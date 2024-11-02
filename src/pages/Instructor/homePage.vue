<template>
  <div class="space-y-0.5">
    <h2 class="text-2xl font-bold tracking-tight">Home</h2>
    <p class="text-muted-foreground">Manage everything here!</p>
  </div>
  <div class="hidden flex-col md:flex">
    <div class="flex-1 space-y-4 pt-6">
      <Tabs default-value="overview" class="space-y-4">
        <TabsList>
          <TabsTrigger value="overview"> Overview </TabsTrigger>
          <TabsTrigger value="calendar"> Calendar </TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
            <Badge
              v-if="eventCount > 0"
              variant="destructive"
              class="rounded-full px-2 py-1"
            >
              {{ eventCount }}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" class="space-y-4">
          <Summary />
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <Overview />
            </Card>
            <RecentSales />
          </div>
        </TabsContent>

        <TabsContent value="calendar" class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card class="col-span-3">
              <Cal />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Notifications />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">


import Overview from "../../../@/lib/components/dashboard/Overview.vue";
import RecentSales from "../../../@/lib/components/dashboard/RecentSales.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../@/lib/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../@/lib/components/ui/tabs";
import Notifications from "../../../@/lib/components/dashboard/Notifications.vue";
import Summary from "../../../@/lib/components/dashboard/Summary.vue";
import { Badge } from "../../../@/lib/components/ui/badge";
import Cal from "../../../@/lib/components/dashboard/Cal.vue";

const eventCount = ref(0);

const updateEventCount = (count: number) => {
  eventCount.value = count;
};


import { ref, onMounted } from "vue";
import { useFetch } from "../../../@/lib/composable/useFetch";

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  extendedProperties?: {
    private?: {
      instructor_id?: string;
      student_id?: string;
    };
  };
}

// State variables
const events = ref<CalendarEvent[]>([]); // Properly type events as CalendarEvent[]
const isLoading = ref(false); // Loading state
const startDate = ref(new Date().toISOString().split("T")[0]); // Default to today's date
const instructorId = ref("");
const errorMessage = ref("");

interface FetchResponse {
  success: boolean;
  data?: CalendarEvent[];
  message?: string;
}

const getPastEvents = async () => {
  try {
    const { data } = await useFetch<FetchResponse>("../../../../server/api/getEventsBefore");
    if (data.value?.success && data.value?.data) {
      events.value = data.value.data;
      eventCount.value = events.value.length; // Update eventCount with the number of past events
    } else {
      errorMessage.value = data.value?.message || "Failed to retrieve events";
      eventCount.value = 0; // Reset count if there’s an error
    }
  } catch (error) {
    errorMessage.value = "API call failed: " + (error as Error).message;
    eventCount.value = 0; // Reset count in case of failure
  }
};

const getEvents = async () => {
  isLoading.value = true;

  try {
    // Format timeMin as ISO string from startDate
    const timeMin = new Date(startDate.value).toISOString();

    const { data } = await useFetch<{
      success: boolean;
      data?: CalendarEvent[];
    }>("../../../../server/api/getEventBefore", {
      params: {
        timeMin,
        instructorId: instructorId.value || undefined, // Optional parameter
      },
    });

    if (data.value?.success && data.value?.data) {
      events.value = data.value.data;
    } else {
      events.value = []; // Clear events if no data is found
    }
  } catch (error) {
    // Handle errors if necessary (for now, we just clear events)
    events.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Helper functions for date and time formatting
const formatDate = (dateTime: string | undefined): string => {
  if (!dateTime) return "N/A";
  const date = new Date(dateTime);
  return date.toLocaleDateString();
};

const formatTime = (dateTime: string | undefined): string => {
  if (!dateTime) return "All day";
  const date = new Date(dateTime);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
};

onMounted(async () => {
  await getPastEvents(); // Fetch past events and update event count
});
</script>
