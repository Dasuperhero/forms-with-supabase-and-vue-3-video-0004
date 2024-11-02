<!-- <script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Skeleton } from "../ui/skeleton";
import { Checkbox } from "../ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {supabase} from "../../../../src/clients/supabase"

// Interface definitions
interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  extendedProperties?: {
    private?: {
      location_detail?: string;
      instructor_id?: string;
      student_id?: string;
    };
  };
}

interface FetchResponse {
  success: boolean;
  data?: CalendarEvent[];
  message?: string;
}

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
  modulesn: string;
}

export default defineComponent({
  setup() {
    const events = ref<CalendarEvent[]>([]);
    const errorMessage = ref("");
    const students = ref<Student[]>([]);
    const studentProgress = ref<StudentDrivingProgress[]>([]);
    const loading = ref(true);
    const client = supabase;
    const checkedModules = ref([]);

    const getEvents = async () => {
      try {
        const response = await $fetch<FetchResponse>("/api/getEventsBefore");
        if (response.success && response.data) events.value = response.data;
        else
          errorMessage.value = response.message || "Failed to retrieve events";
      } catch (error) {
        errorMessage.value = "API call failed: " + (error as Error).message;
      }
    };

    const getStudents = async () => {
      try {
        const { data, error } = await client.from("studentview").select();
        if (error) throw error;
        if (data) students.value = data;
      } catch (error) {
        errorMessage.value = "Failed to retrieve student data.";
      }
    };

    function getStudentName(studentId: number): string {
      const student = students.value.find(
        (student) => student.id === studentId
      );
      return student ? student.name : "Unknown Student";
    }

    const getProgress = async () => {
      try {
        const { data, error } = await client
          .from("student_driving_progress")
          .select();
        if (error) throw error;
        if (data) studentProgress.value = data;
      } catch (error) {
        errorMessage.value = "Failed to retrieve student progress.";
      }
    };

    function getProgressByStudent(studentId: number) {
      return studentProgress.value.filter(
        (progress) => progress.id === studentId && progress.done === false
      );
    }

    const updateDatabase = async (studentId: number) => {
      console.log("Update database function called");
      console.log("Checked modules:", checkedModules.value); // Logs the selected modules

      try {
        for (const moduleId of checkedModules.value) {
          const progressItem = studentProgress.value.find(
            (progress) => progress.modulesn === moduleId
          );

          if (progressItem) {
            const { error } = await client
              .from("student_driving_progress")
              .update({ done: true }) // Update the `done` status to true
              .eq("modulesn", moduleId)
              .eq("id", studentId); // Use ID to ensure correct item is updated

            if (error) throw error;
          }
        }
        console.log("Database updated successfully with checked modules");

        checkedModules.value = [];
        await nextTick();
        await getProgress();
      } catch (error) {
        console.error("Failed to update database:", error);
        errorMessage.value = "Failed to save progress.";
      }
    };
    onMounted(async () => {
      loading.value = true;
      await Promise.all([getEvents(), getStudents(), getProgress()]);
      loading.value = false;
    });

    return {
      events,
      errorMessage,
      getStudentName,
      getProgressByStudent,
      loading,
      checkedModules,
      updateDatabase,
    };
  },
});
</script>

<template>
  <Card class="col-span-3">
    <CardHeader>
      <CardTitle>Review</CardTitle>
      <CardDescription>
        Please complete the following reviews for students!
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="loading" class="flex items-center space-x-4">
        <Skeleton class="h-9 w-9 rounded-full" />
        <div class="flex flex-col space-y-2">
          <Skeleton class="h-4 w-[250px]" />
          <Skeleton class="h-4 w-[200px]" />
        </div>
      </div>

      <div v-else-if="events.length" class="space-y-3">
        <div
          v-for="event in events"
          :key="event.id"
          class="flex items-center gap-4"
        >
          <Avatar class="h-9 w-9">
            <AvatarImage src="" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div class="ml-4 space-y-1">
            <p class="text-sm font-medium leading-none">
              {{
                getStudentName(
                  Number(event.extendedProperties?.private?.student_id)
                )
              }}
            </p>
            <p class="text-sm text-muted-foreground">
              {{
                event.start.date
                  ? event.start.date
                  : event.start.dateTime
                  ? new Date(event.start.dateTime).toLocaleDateString()
                  : "No Date"
              }}
            </p>
          </div>

          <div class="ml-auto font-medium">
            <Dialog>
              <DialogTrigger as-child>
                <Button variant="outline">Review</Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-[425px]">
                <p>Uncompleted Modules</p>
                <form @submit.prevent="updateDatabase(Number(event.extendedProperties?.private?.student_id))">
                  <div
                    v-for="progress in getProgressByStudent(
                      Number(event.extendedProperties?.private?.student_id)
                    )"
                    :key="progress.modulesn"
                  >
                    <input
                      type="checkbox"
                      :id="progress.modulesn"
                      :value="progress.modulesn"
                      v-model="checkedModules"
                    />
                    <label :for="progress.modulesn">{{
                      progress.module
                    }}</label>
                  </div>
                  <button type="submit">submit</button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div v-else>No events to review.</div>
    </CardContent>
  </Card>
</template> -->


<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { Skeleton } from "../ui/skeleton";
import { Checkbox } from "../ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { supabase } from "../../../../src/clients/supabase"; // Update import path as necessary

// Interface definitions
interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  extendedProperties?: {
    private?: {
      location_detail?: string;
      instructor_id?: string;
      student_id?: string;
    };
  };
}

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
  modulesn: string;
}

const events = ref<CalendarEvent[]>([]);
const errorMessage = ref("");
const students = ref<Student[]>([]);
const studentProgress = ref<StudentDrivingProgress[]>([]);
const loading = ref(true);
const client = supabase;
const checkedModules = ref<string[]>([]);

// Fetch events from an API endpoint
const getEvents = async () => {
  try {
    const response = await fetch("/api/getEventsBefore");
    const result: { success: boolean; data?: CalendarEvent[]; message?: string } = await response.json();
    if (result.success && result.data) {
      events.value = result.data;
    } else {
      errorMessage.value = result.message || "Failed to retrieve events";
    }
  } catch (error) {
    errorMessage.value = `API call failed: ${(error as Error).message}`;
  }
};

// Fetch student data from Supabase
const getStudents = async () => {
  try {
    const { data, error } = await client.from("studentview").select();
    if (error) throw error;
    students.value = data || [];
  } catch (error) {
    errorMessage.value = "Failed to retrieve student data.";
  }
};

// Fetch student driving progress data from Supabase
const getProgress = async () => {
  try {
    const { data, error } = await client.from("student_driving_progress").select();
    if (error) throw error;
    studentProgress.value = data || [];
  } catch (error) {
    errorMessage.value = "Failed to retrieve student progress.";
  }
};

// Get student name by ID
function getStudentName(studentId: number): string {
  const student = students.value.find((student) => student.id === studentId);
  return student ? student.name : "Unknown Student";
}

// Get uncompleted progress items by student ID
function getProgressByStudent(studentId: number) {
  return studentProgress.value.filter((progress) => progress.id === studentId && !progress.done);
}

// Update checked modules in the database
const updateDatabase = async (studentId: number) => {
  try {
    for (const moduleId of checkedModules.value) {
      const progressItem = studentProgress.value.find((progress) => progress.modulesn === moduleId);
      if (progressItem) {
        const { error } = await client.from("student_driving_progress").update({ done: true }).eq("modulesn", moduleId).eq("id", studentId);
        if (error) throw error;
      }
    }
    checkedModules.value = [];
    await nextTick();
    await getProgress();
  } catch (error) {
    errorMessage.value = "Failed to save progress.";
  }
};

// Fetch all data on component mount
onMounted(async () => {
  loading.value = true;
  await Promise.all([getEvents(), getStudents(), getProgress()]);
  loading.value = false;
});
</script>

<template>
  <Card class="col-span-3">
    <CardHeader>
      <CardTitle>Review</CardTitle>
      <CardDescription>
        Please complete the following reviews for students!
      </CardDescription>
    </CardHeader>

    <CardContent>
      <div v-if="loading" class="flex items-center space-x-4">
        <Skeleton class="h-9 w-9 rounded-full" />
        <div class="flex flex-col space-y-2">
          <Skeleton class="h-4 w-[250px]" />
          <Skeleton class="h-4 w-[200px]" />
        </div>
      </div>

      <div v-else-if="events.length" class="space-y-3">
        <div v-for="event in events" :key="event.id" class="flex items-center gap-4">
          <Avatar class="h-9 w-9">
            <AvatarImage src="" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div class="ml-4 space-y-1">
            <p class="text-sm font-medium leading-none">
              {{ getStudentName(Number(event.extendedProperties?.private?.student_id)) }}
            </p>
            <p class="text-sm text-muted-foreground">
              {{ event.start.date ? event.start.date : event.start.dateTime ? new Date(event.start.dateTime).toLocaleDateString() : "No Date" }}
            </p>
          </div>

          <div class="ml-auto font-medium">
            <Dialog>
              <DialogTrigger as-child>
                <Button variant="outline">Review</Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-[425px]">
                <p>Uncompleted Modules</p>
                <form @submit.prevent="updateDatabase(Number(event.extendedProperties?.private?.student_id))">
                  <div v-for="progress in getProgressByStudent(Number(event.extendedProperties?.private?.student_id))" :key="progress.modulesn">
                    <input type="checkbox" :id="progress.modulesn" :value="progress.modulesn" v-model="checkedModules" />
                    <label :for="progress.modulesn">{{ progress.module }}</label>
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div v-else>No events to review.</div>
    </CardContent>
  </Card>
</template>
