<template>
    <div class="flex min-h-screen">
        <!-- Sidebar Navigation -->
        <nav
            :class="menuOpen ? 'translate-x-0' : '-translate-x-full'"
            class="side-navbar fixed top-0 left-0 h-full w-60 z-40 md:translate-x-0 transition-transform duration-300 ease-in-out bg-black text-white border-r border-gray-700"
        >
            <div class="flex flex-col h-full py-8 px-6">
                <!-- Project Title -->
                <div class="mb-10 flex justify-center">
                    <router-link to="/" class="text-3xl font-bold tracking-tight">
                        Learn2Drive
                    </router-link>
                </div>

                <!-- Navigation Links -->
                <div class="flex-grow flex flex-col space-y-4">
                    <router-link to="/instructor/home" class="sidebar-link">
                        🏠 Home
                    </router-link>
                    <router-link to="/instructor/availability" class="sidebar-link">
                        📅 Availability
                    </router-link>
                    <router-link to="/instructor/student-analysis" class="sidebar-link">
                        📝 Student Analysis
                    </router-link>
                    <router-link to="/instructor/testpage" class="sidebar-link">
                        🧪 Test
                    </router-link>
                </div>

                <!-- Profile Link at the Bottom -->
                <div class="mt-auto">
                    <router-link to="/instructor/profile" class="sidebar-link">
                        👤 Profile
                    </router-link>
                </div>
            </div>
        </nav>

        <!-- Mobile Hamburger Menu Button -->
        <Button
            variant="ghost"
            size="lg"
            class="md:hidden p-4 fixed top-2.5 left-2.5 z-50 bg-white rounded-full shadow-lg"
            @click="toggleMenu"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-dark"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4 6h16M4 12h16m-7 6h7"
                />
            </svg>
        </Button>

        <!-- Main Content Area -->
        <div
            class="flex-1 ml-0 md:ml-60 transition-all duration-300 ease-in-out p-8"
            :class="menuOpen ? 'ml-60' : ''"
        >
            <router-view />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Button } from "../../../@/lib/components/ui/button";

// Sidebar state and toggle function
const menuOpen = ref(false);
const toggleMenu = () => {
    menuOpen.value = !menuOpen.value;
};
</script>

<style scoped>
.side-navbar {
    width: 15rem; /* Width of the sidebar */
}

.sidebar-link {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1rem;
    color: white;
    font-size: 1.125rem; /* Adjust font size */
    transition: background-color 0.2s;
}

.sidebar-link:hover {
    background-color: #1f2937; /* Hover color */
}

@media (min-width: 768px) {
    /* Ensure sidebar is shown on larger screens */
    .side-navbar {
        transform: translateX(0);
    }
}
</style>
