<template>
  <div class="flex flex-col">
    <h1 class="text-3xl font-bold tracking-tight">Reviews</h1>
    <p class="text-muted-foreground">View the instructor reviews</p>
    <br>
    <div v-for="instructor in instructors" :key="instructor.id">
      <NuxtLink :to="`/Student/reviewTemplate/${instructor.id}`">
        <Card class="card">
          <div class="flex-shrink-0 mr-16">
            <img 
              height="100px" 
              width="100px" 
              src="https://theurbanwire.sg/wp-content/uploads/2022/05/photo_2022-05-13-16.32.39.jpeg"
              alt="Instructor Uncle" 
              class="rounded-full"
            />
          </div>
          <div class="flex-grow">
  <h1 class="text-2xl font-bold mb-4">{{ instructor.name }}</h1>
  <div class="inline-flex items-center">
    <h2 class="text-xl">
      {{ instructor.rating !== null ? instructor.rating.toFixed(1) : 'No reviews yet' }}
    </h2>
    <div class="flex ml-2"  v-if="instructor.rating !== null">
      <template v-for="n in 5" :key="n">
        <!-- Full stars -->
        <svg
          v-if="n <= Math.floor(instructor.rating)"
          xmlns="http://www.w3.org/2000/svg"
          fill="gold"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
          style="color:gold"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>

        <!-- Partial star (for decimal ratings) -->
        <svg
          v-else-if="n === Math.ceil(instructor.rating)"
          xmlns="http://www.w3.org/2000/svg"
          fill="gold"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
          style="color:gold"
        >
          <defs>
            <clipPath :id="'partial-clip-' + n">
              <!-- Width adjusts based on the remainder of the rating -->
              <rect :width="(instructor.rating % 1) * 24" height="24" />
            </clipPath>
          </defs>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            :clip-path="'url(#partial-clip-' + n + ')'"
          />
        </svg>

        <!-- Empty stars -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
          style="color: lightgray;"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      </template>
    </div>
  </div>
</div>

          <div class="flex p-3 text-center">
            <h2 class="text-lg"><b>Total reviews:</b><br>{{ instructor.totalReviews }}</h2>
          </div>
        </Card>
      </NuxtLink>
    </div>
  </div>
</template>



<style>
  .card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    overflow: hidden;
    margin-bottom: 10px
  }

  .card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: #bfc2c5;
  }
</style>
<script setup lang="ts">


import {Card, CardContent, CardDescription} from '../../../@/lib/components/ui/card';
import { supabase } from "../../clients/supabase"

const client = supabase;

interface Instructor {
  id: number;
  name: string;
  location: string;
  rating: number | null ;
  totalReviews: number;
}


import { ref, onMounted } from 'vue';

// Main instructors data with initial data from Supabase
const instructors = ref<Instructor[]>([]);

const fetchInstructorsWithReviews = async () => {
  try {
    // Fetch instructors without reviews first
    const { data: instructorsData, error } = await client.from('instructors').select('id, name, location');
    if (error) throw error;

    // For each instructor, fetch their reviews and calculate rating/totalReviews
    for (const instructor of instructorsData ?? []) {
      const { data: reviews, error: reviewError } = await client
        .from('instructor_reviews')
        .select('rating')
        .eq('instructor_id', instructor.id);

      if (reviewError) throw reviewError;

      const totalReviews = reviews?.length ?? 0;
      const averageRating = totalReviews
      ? parseFloat((reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)) : null;

      // Add to instructors array with calculated fields
      instructors.value.push({
        id: instructor.id,
        name: instructor.name,
        location: instructor.location,
        rating: averageRating,
        totalReviews: totalReviews,
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Fetch data on component mount
onMounted(fetchInstructorsWithReviews);






</script>