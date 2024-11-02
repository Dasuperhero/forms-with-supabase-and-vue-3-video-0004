<script setup lang="ts">

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../@/lib/components/ui/card";

import { Button } from "../../../../@/lib/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "../../../../@/lib/components/ui/dropdown-menu";

import { DropdownMenuCheckboxItemProps } from "radix-vue";

import { ref, onMounted } from 'vue';

type Checked = DropdownMenuCheckboxItemProps['checked']

const showNewest = ref<Checked>(true)
const showHighest = ref<Checked>(false)
const showLowest = ref<Checked>(false)

import Stars from '../../../../@/lib/components/review/Stars.vue';


// Define types as per your existing code

import { useRoute } from 'vue-router';

// Define types
interface Instructor {
  id: number;
  name: string;
  location: string;
  rating: number | null;
  totalReviews: number;
}

interface Review {
  instructor_id: number;
  student_id: number;
  rating: number;
  comment: string;
  date_posted: Date;
}

const route = useRoute();
const instructor_id = Number(route.params.id); // Ensure it's a number

const instructor = ref<Instructor | null>(null);
const reviews = ref<Review[]>([]);

import { supabase} from "../../../clients/supabase"
const client = supabase;

onMounted(async () => {
  // Fetch instructor details
  const { data: instructorData, error: instructorError } = await client
    .from('instructors')
    .select('*')
    .eq('id', instructor_id)
    .single();

  if (instructorError) {
    console.error('Error fetching instructor:', instructorError);
    return; // Handle error appropriately
  }

  if (instructorData) {
    instructor.value = instructorData;
    console.log('Fetched instructor:', instructor.value); // Log the instructor data
  }
  
  // Fetch reviews for this instructor
  const { data: reviewData, error: reviewError } = await client
    .from('instructor_reviews')
    .select('*')
    .eq('instructor_id', instructor_id);

  if (reviewError) {
    console.error('Error fetching reviews:', reviewError);
    return; // Handle error appropriately
  }

  if (reviewData) {
    reviews.value = reviewData;
    console.log('Fetched reviews:', reviews.value); // Log the reviews data
  }
});
const students = ref<{ [key: number]: string }>({});

onMounted(async () => {
  // Existing instructor and review fetching code

  // Fetch student data
  const { data: studentData, error: studentError } = await client
    .from('studentview')
    .select('id, name');

  if (studentError) {
    console.error('Error fetching students:', studentError);
    return;
  }

  if (studentData) {
    // Map student IDs to names for easy lookup
    studentData.forEach(student => {
      students.value[student.id] = student.name;
    });
  }
});


</script>

<template>
  <div class="flex flex-col">
    <NuxtLink to="/Student/instructorReview" class="inline-flex">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" stroke-width="1.5" stroke="currentColor" class="size-6 mr-2 mt-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg> 
      <h1 class="text-lg">Back to Reviews</h1>
    </NuxtLink>
    <br>
    <div class="inline-flex">
      <h1 v-if="instructor" class="text-3xl font-bold tracking-tight">{{ instructor.name }}'s Reviews</h1>
      <p v-else class="text-gray-500">Loading instructor reviews...</p>
    <div class="ml-auto flex-end">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline">
            Sort reviews
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56">
          <DropdownMenuCheckboxItem v-model:checked="showNewest">
            Newest
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem v-model:checked="showHighest" disabled>
            Highest
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem v-model:checked="showLowest">
            Lowest
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    </div>

    <br>
  <div class="grid grid-cols-1 gap-5 lg:grid-cols-3" style="height:300px" v-if="reviews.length > 0">
    <Card id="app" class="review" v-for="(review, idx) in reviews" :key="idx">
        <!-- Name and rating in the center -->
        <div class="flex-grow inline-flex items-center mb-2">
          <div class="text-2xl font-bold">{{students[review.student_id] || "Unknown Student"}}</div>
          <div class="flex ml-4">
            <Stars :rating="review.rating" />
          </div>
        </div>
        <div>
          <div class="text-sm mb-2" style="color:gray">
          {{ review.date_posted }}
          </div>
        <!-- <div class="text-sm mb-2" style="font-style: italic" v-for="badge in review.badges">
            {{ badge }}
        </div> -->
        </div>
        <hr>
        <p class="py-2">{{review.comment}}</p>


    </Card>
  </div>
  <div v-else class="text-2xl">No reviews yet.</div>
  </div>  
</template>

<style>
.review {
  padding: 1rem;
}
</style>