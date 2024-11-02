
<template>
    <div class="container mx-auto">
        <div class="space-y-0.5 mb-6">
            <h1 class="text-3xl font-bold tracking-tight">Student Dashboard</h1>
            <p class="text-muted-foreground">Your learning journey at a glance</p>
        </div>

        <div class="flex-col md:flex">
            <div class="flex-1 space-y-4 pt-6">
                <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    <!-- Total Lessons Completed Card -->
                    <Card>
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle class="text-sm font-medium">Total Lessons Completed</CardTitle>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                class="h-4 w-4 text-muted-foreground">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div class="text-2xl font-bold">{{ completedLessons.length }}</div>
                            <p class="text-xs text-muted-foreground">+{{ lessonsThisWeek.length }} from last week</p>
                        </CardContent>
                    </Card>

                    <!-- Next Lesson Card -->
                    <Card>
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle class="text-sm font-medium">Next Lesson</CardTitle>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                class="h-4 w-4 text-muted-foreground">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div class="text-2xl font-bold">
                                {{ nextLesson && nextLesson.date ? formatDate(nextLesson.date) : 'No upcoming lessons' }}
                            </div>
                            <p class="text-xs text-muted-foreground">{{ nextLesson ? nextLesson.time : '' }}</p>
                        </CardContent>
                    </Card>
                </div>

                <!-- Lessons for Next Week Section -->
                <Card>
                    <CardHeader>
                        <CardTitle>Lessons for Next Week</CardTitle>
                        <CardDescription>Your scheduled lessons for the upcoming week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-8">
                            <div v-for="lesson in nextWeekLessons" :key="lesson.id" class="flex items-center">
                                <Avatar :class="'h-9 w-9'">
                                    <AvatarImage
                                        :src="`https://avatar.vercel.sh/${lesson.instructor_name.replace(' ', '-')}.png`"
                                        alt="Avatar" />
                                    <AvatarFallback>{{ lesson.instructor_name.split(' ').map(n => n[0]).join('') }}
                                    </AvatarFallback>
                                </Avatar>
                                <div class="ml-4 space-y-1">
                                    <p class="text-sm font-medium leading-none">{{ lesson.instructor_name }}</p>
                                    <p class="text-sm text-muted-foreground">{{ formatDate(lesson.date) }} at {{
                                        lesson.time }}</p>
                                </div>
                                <div class="ml-auto font-medium">{{ lesson.location }}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Notifications for Past Instructors to Review -->
                <Card>
                    <CardHeader>
                        <CardTitle>Review</CardTitle>
                        <CardDescription>Past Instructors to Review</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-8" v-if="uniqueInstructors && uniqueInstructors.length">
                            <div v-for="lesson in uniqueInstructors" :key="lesson.instructor_id"
                                class="flex items-center">
                                <Avatar :class="'h-9 w-9'">
                                    <AvatarImage
                                        :src="`https://avatar.vercel.sh/${lesson.instructor_name.replace(' ', '-')}.png`"
                                        alt="Avatar" />
                                    <AvatarFallback>{{ lesson.instructor_name.split(' ').map(n => n[0]).join('') }}
                                    </AvatarFallback>
                                </Avatar>
                                <div class="ml-4 space-y-1">
                                    <p class="text-sm font-medium leading-none">{{ lesson.instructor_name }}</p>
                                </div>
                                <button class="ml-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    @click="goToReviewForm(lesson.instructor_id)">
                                    Review
                                </button>
                            </div>
                        </div>
                        <div v-else>
                            <p class="text-muted-foreground">No past instructors to review.</p>
                        </div>
                    </CardContent>
                </Card>

                <!-- Review Modal -->
                <Transition name="fade" appear>
                    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
                        <div class="bg-white rounded-lg p-6 shadow-2xl w-11/12 max-w-md">
                            <h3 class="text-lg font-bold mb-4">
                                {{ existingReview ? 'Edit' : 'Review' }} Instructor: {{ selectedInstructorId }}
                            </h3>

                            <p v-if="existingReview" class="text-sm text-gray-600 mb-2">
                                Note: Editing this review will replace your original review.
                            </p>

                            <form @submit.prevent="submitReview">
                                <!-- Improved Star Rating System -->
                                <div class="flex items-center justify-center mb-4">
                                    <svg v-for="star in 5" :key="star" :class="[
                                        'w-8 h-8 cursor-pointer transition-all duration-200',
                                        star <= (hoverRating || reviewRating) ? 'text-yellow-400 scale-110' : 'text-gray-300'
                                    ]" @click="setRating(star)" @mouseenter="setHoverRating(star)"
                                        @mouseleave="setHoverRating(0)" xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor" viewBox="0 0 24 24" stroke="currentColor"
                                        stroke-width="1.5">
                                        <path
                                            d="M12 17.25l-6.172 3.243 1.179-6.873L2.5 9.327l6.9-1 3.1-6.273 3.1 6.273 6.9 1-5.507 4.293 1.179 6.873z" />
                                    </svg>
                                </div>

                                <!-- Review Textarea -->
                                <textarea v-model="reviewText" placeholder="Write your review here..." :rows="4"
                                    class="w-full border p-2 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>

                                <!-- Buttons for Cancel and Submit -->
                                <div class="flex justify-end mt-4">
                                    <button type="button"
                                        class="mr-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors duration-200"
                                        @click="closeModal">
                                        Cancel
                                    </button>
                                    <button type="submit"
                                        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-200">
                                        {{ existingReview ? 'Update' : 'Submit' }}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { supabase } from '../../clients/supabase';


const client = supabase;

interface Lesson {
    id: number;
    instructor_id: number;
    student_id: number;
    instructor_name: string;
    date: string;
    time: string;
    location: string;
}

interface Review {
    instructor_id: number;
    student_id: number;
    comment: string;
    rating: number;
    date_posted: Date;
}

const isModalOpen = ref(false);
const selectedInstructorId = ref(0);
const reviewText = ref('');
const reviewRating = ref(0);
const existingReview = ref<Review | null>(null);
const hoverRating = ref(0);

const setRating = (rating: number) => {
    reviewRating.value = rating;
};

const setHoverRating = (rating: number) => {
    hoverRating.value = rating;
};

const goToReviewForm = async (instructorId: number) => {
    selectedInstructorId.value = instructorId;
    existingReview.value = await fetchExistingReview(101, instructorId);

    if (existingReview.value) {
        reviewText.value = existingReview.value.comment;
        reviewRating.value = existingReview.value.rating;
    } else {
        reviewText.value = '';
        reviewRating.value = 0;
    }

    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    reviewText.value = '';
    reviewRating.value = 0;
    existingReview.value = null;
};

const submitReview = async () => {
    const reviewExists = await checkReviewExists(101, selectedInstructorId.value);

    if (reviewExists) {
        await updateReview(101, selectedInstructorId.value, reviewText.value, reviewRating.value);
    } else {
        await createReview(101, selectedInstructorId.value, reviewText.value, reviewRating.value);
    }

    closeModal();
};

const fetchExistingReview = async (studentId: number, instructorId: number): Promise<Review | null> => {
    const { data, error } = await client
        .from('instructor_reviews')
        .select()
        .eq('student_id', studentId)
        .eq('instructor_id', instructorId)
        .single();

    if (error) {
        console.error('Error fetching existing review:', error);
        return null;
    }
    return data;
};

const checkReviewExists = async (studentId: number, instructorId: number): Promise<boolean> => {
    const { data, error } = await client
        .from('instructor_reviews')
        .select()
        .eq('student_id', studentId)
        .eq('instructor_id', instructorId)
        .single();

    if (error) {
        console.error('Error checking if review exists:', error);
        return false;
    }

    return data ? true : false;
};

const createReview = async (studentId: number, instructorId: number, comment: string, rating: number) => {
    Swal.fire({
        title: "Do you want to submit your review?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Submit",
        denyButtonText: `Don't submit`
    }).then(async (result) => {
        if (result.isConfirmed) {
            const currentTimestamp = new Date().toISOString();

            const { error } = await client
                .from('instructor_reviews')
                .insert({
                    instructor_id: instructorId,
                    student_id: studentId,
                    comment,
                    rating,
                    date_posted: currentTimestamp
                });

            if (error) {
                console.error('Error creating review:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: 'There was an issue submitting your review. Please try again later.',
                    confirmButtonText: 'Retry'
                });
            } else {
                Swal.fire('Submitted!', 'Your review has been submitted successfully.', 'success');
            }
        } else if (result.isDenied) {
            Swal.fire("Review not submitted", "", "info");
        }
    });
};

const updateReview = async (studentId: number, instructorId: number, comment: string, rating: number) => {
    Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: "Don't save"
    }).then(async (result) => {
        if (result.isConfirmed) {
            const currentTimestamp = new Date().toISOString();
            const { error } = await client
                .from('instructor_reviews')
                .update({ comment, rating, date_posted: currentTimestamp })
                .eq('student_id', studentId)
                .eq('instructor_id', instructorId);

            if (error) {
                console.error('Error updating review:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: 'There was a problem updating your review. Please try again later.',
                    confirmButtonText: 'Retry'
                });
            } else {
                Swal.fire('Saved!', 'Your review has been updated successfully.', 'success');
            }
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });
};

const lessons = ref<Lesson[]>([]);

onMounted(async () => {
    const { data, error } = await client
        .from('lessons')
        .select()
        .eq('student_id', 101);
    if (error) {
        console.error('Error fetching lessons:', error);
    } else {
        lessons.value = data ?? [];
    }
});

const today = new Date();

const completedLessons = computed(() => {
    return lessons.value.filter(lesson => new Date(lesson.date) < today);
});

const lessonsThisWeek = computed(() => {
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return completedLessons.value.filter(lesson => new Date(lesson.date) >= lastWeek && new Date(lesson.date) < today);
});

const nextLesson = computed(() => {
    const now = new Date();
    const upcomingLessons = lessons.value
        .filter(lesson => {
            const lessonDateTime = combineDateTime(lesson.date, lesson.time);
            return lessonDateTime > now.getTime();
        })
        .sort((a, b) => combineDateTime(a.date, a.time) - combineDateTime(b.date, b.time));

    return upcomingLessons.length > 0 ? upcomingLessons[0] : null;
});

const combineDateTime = (dateStr: string, timeStr: string) => {
    return new Date(`${dateStr}T${timeStr}`).getTime();
};

const nextWeekLessons = computed(() => {
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const nextWeekStart = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000);

    return lessons.value
        .filter(lesson => {
            const lessonDateTime = combineDateTime(lesson.date, lesson.time);
            return lessonDateTime >= now.getTime() && lessonDateTime < nextWeekStart.getTime();
        })
        .sort((a, b) => combineDateTime(a.date, a.time) - combineDateTime(b.date, b.time));
});

const pastLessons = computed(() => {
    return lessons.value.filter(lesson => new Date(lesson.date) < today);
});

const uniqueInstructors = computed(() => {
    if (!pastLessons.value) return [];

    const unique = new Map();
    pastLessons.value.forEach(lesson => {
        if (lesson.instructor_id && !unique.has(lesson.instructor_id)) {
            unique.set(lesson.instructor_id, lesson);
        }
    });
    return Array.from(unique.values());
});

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>








