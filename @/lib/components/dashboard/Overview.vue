<!-- <script setup lang="ts">
import { BarChart } from "recharts";

import {supabase} from "../../../../src/clients/supabase";
const client = supabase;

interface Earning {
  month: string;
  instructorId: number;
  year: number;
  amount: number;
}

const { data: instructor_earnings } = await useAsyncData<Earning[]>(
  "instructor_earnings",
  async () => {
    const { data } = await client.from("instructor_earnings").select();
    return data ?? [];
  }
);

function getInstructorEarning(instructorId: number){
  return (
    instructor_earnings.value?.filter(
      (earning) => earning.instructorId === instructorId
    )
  );
}

const instructorId = 101; // replace with session id

const formattedEarnings = computed(() => {
  return (
    instructor_earnings.value
      ?.filter((earning) => earning.instructorId === instructorId)
      .map((earning) => ({
        name: earning.month,
        total: earning.amount, 
      })) ?? []
  );
});


</script>

<template>
    <CardHeader>
      <CardTitle class="">Overview</CardTitle>
    </CardHeader>
    <CardContent class="pl-2">
      <BarChart
        :data="formattedEarnings"
        :categories="['total']"
        :index="'name'"
        :rounded-corners="4"
      />
    </CardContent>
</template> -->


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"; // Import necessary components
import { supabase } from "../../../../src/clients/supabase"; // Adjust import path as needed

// Define data structure
interface Earning {
  month: string;
  instructorId: number;
  year: number;
  amount: number;
}

const instructor_earnings = ref<Earning[] | null>(null);
const error = ref<string | null>(null);
const instructorId = 101; // Replace with session ID as needed

// Fetch data on component mount
onMounted(async () => {
  try {
    const { data, error: fetchError } = await supabase.from("instructor_earnings").select();
    if (fetchError) throw new Error(fetchError.message);
    instructor_earnings.value = data ?? [];
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to fetch data";
  }
});

// Format earnings for the current instructor
const formattedEarnings = computed(() => {
  return (
    instructor_earnings.value
      ?.filter((earning) => earning.instructorId === instructorId)
      .map((earning) => ({
        name: earning.month,
        total: earning.amount,
      })) ?? []
  );
});

</script>

<template>
  <CardHeader>
    <CardTitle>Overview</CardTitle>
  </CardHeader>

  <CardContent v-if="!error" class="pl-2">
    <BarChart :width="500" :height="300" :data="formattedEarnings">
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="total" fill="#8884d8" radius={[4, 4, 0, 0]} />
    </BarChart>
  </CardContent>

  <p v-else class="text-red-500">{{ error }}</p>
</template>
