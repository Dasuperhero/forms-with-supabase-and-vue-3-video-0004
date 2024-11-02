<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Button } from '../../../@/lib/components/ui/button';
import { supabase } from '../../clients/supabase.js';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../@/lib/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../@/lib/components/ui/tooltip';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../../@/lib/components/ui/drawer';

// Define data interfaces
interface Student {
  id: number;
  name: string;
  location: string;
  time: string;
  date: string;
  contact: string;
  upcomingLessonTopic: string;
}

interface StudentDrivingProgress {
  id: number;
  sn: number;
  module: string;
  done: boolean;
}

interface StudentTestRoutes {
  id: number;
  sn: number;
  testroute: string;
  done: boolean;
}

// Reactive state for data and errors
const studentview = ref<Student[] | null>(null);
const student_driving_progress = ref<StudentDrivingProgress[] | null>(null);
const student_test_routes = ref<StudentTestRoutes[] | null>(null);
const error = ref<string | null>(null);

// Fetch data on component mount
onMounted(async () => {
  try {
    // Fetch student view data
    const { data: studentData, error: studentError } = await supabase.from('studentview').select();
    if (studentError) throw new Error(studentError.message);
    studentview.value = studentData ?? [];

    // Fetch student driving progress data
    const { data: progressData, error: progressError } = await supabase.from('student_driving_progress').select();
    if (progressError) throw new Error(progressError.message);
    student_driving_progress.value = progressData ?? [];

    // Fetch student test routes data
    const { data: testRoutesData, error: testRoutesError } = await supabase.from('student_test_routes').select();
    if (testRoutesError) throw new Error(testRoutesError.message);
    student_test_routes.value = testRoutesData ?? [];
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred while fetching data.';
  }
});

// Utility functions to filter data
function getCompletedProgressByStudent(studentId: number) {
  return (
    student_driving_progress.value?.filter(
      (progress) => progress.sn === studentId && progress.done === true
    ) || []
  );
}

function getUncompletedProgressByStudent(studentId: number) {
  return (
    student_driving_progress.value?.filter(
      (progress) => progress.sn === studentId && progress.done === false
    ) || []
  );
}

function getStudentTestRoutes(studentId: number) {
  return (
    student_test_routes.value?.filter((testroutes) => testroutes.sn === studentId) || []
  );
}
</script>

<template>
  <div class="space-y-0.5">
    <h2 class="text-2xl font-bold tracking-tight">Current Students</h2>
    <p class="text-muted-foreground">See your students!</p>
  </div>

  <div v-if="error">
    <p class="text-red-500">{{ error }}</p>
  </div>

  <div v-else class="grid lg:grid-cols-5 gap-2">
    <div v-if="studentview" class="flex p-4 space-x-4 w-max">
      <div
        v-for="student in studentview"
        :key="student.id"
        class="student-card"
      >
        <Card class="h-80 w-60 flex flex-col items-center justify-center">
          <CardContent class="text-center flex flex-col items-center">
            <img
              class="rounded-full h-20 mb-4"
              src="https://via.placeholder.com/150"
              alt="Student Photo"
            />
            <h2 class="text-xl font-semibold">{{ student.name }}</h2>
            <p class="mt-2 text-sm text-muted-foreground">
              Next Lesson: {{ student.date }}
            </p>
            <Drawer>
              <DrawerTrigger as-child>
                <Button variant="secondary" class="mt-5 view-progress" style="cursor: pointer;">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6 mr-1"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  View Progress
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <h2 class="text-2xl font-bold tracking-tight">
                    {{ student.name }}'s Progress
                  </h2>
                </DrawerHeader>

                <!-- Student's driving modules and test routes content here -->

                <DrawerFooter>
                  <DrawerClose as-child>
                    <Button variant="outline" style="cursor: pointer;">Ok!</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-progress:hover {
  background-color: rgb(213, 213, 213);
}
.student-card {
  cursor: pointer;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}
.student-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  z-index: 10;
}
</style>
