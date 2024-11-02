import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../clients/supabase'
import LoginView from '../pages/LoginView.vue'
import UnauthorizedView from '../pages/UnauthorizedView.vue'
import Mainpage from '../mainpage.vue'
import StudentView from '../pages/Student/homePage.vue'
import StudentViewFull from '../pages/Student/StudentViewFull.vue'
import StudentBookingPage from '../pages/Student/bookingPage.vue'
import StudentProfile from '../pages/Student/profile.vue'
import StudentResources from '../pages/Student/resourcesPage.vue'
import StudentInstructorReview from '../pages/Student/instructorReview.vue'
import InstructorView from '../pages/Instructor/homePage.vue'
import InstructorAvailability from '../pages/Instructor/availability.vue'
import InstructorStudentAnalysis from '../pages/Instructor/studentAnalysis.vue'
import InstructorProfile from '../pages/Instructor/profile.vue'
import InstructorTestPage from '../pages/Instructor/testpage.vue'
import InstructorViewFull from '../pages/Instructor/InstructorViewFull.vue'


let localUser;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'mainpage',
      component: Mainpage
    },
    {
      path: '/secret',
      name: 'secret',
      component: () => import('../pages/SecretView.vue'),
	  meta: { requiresAuth: true }
    },
	{
      path: '/login',
	  name: 'login',
	  component: LoginView
	},
	{
	  path: '/unauthorized',
	  name: 'unauthorized',
	  component: UnauthorizedView
	},
	{
		path: '/student',
		name: 'StudentViewFull',
		component: StudentViewFull,
		children: [
			{
				path: 'Home',
				name: 'StudentView',
				component: StudentView
			},
			{
				path: 'booking',
				name: 'StudentBookingPage',
				component: StudentBookingPage
			},
			{
				path: 'profile',
				name: 'StudentProfile',
				component: StudentProfile
			},
			{
				path: 'resources',
				name: 'StudentResources',
				component: StudentResources
			},
			{
				path: 'instructor-review',
				name: 'StudentInstructorReview',
				component: StudentInstructorReview
			}
		]
	},
	{
		path: '/instructor',
		name: 'InstructorViewFull',
		component: InstructorViewFull,
		children: [
			{
				path:'Home',
				name:"InstructorView",
				component: InstructorView
			},
			{
				path: 'availability',
				name: 'InstructorAvailability',
				component: InstructorAvailability
			},
			{
				path: 'student-analysis',
				name: 'InstructorStudentAnalysis',
				component: InstructorStudentAnalysis
			},
			{
				path: 'profile',
				name: 'InstructorProfile',
				component: InstructorProfile
			},
			{
				path: 'testpage',
				name: 'InstructorTestPage',
				component: InstructorTestPage
			},
		]
	},
			
	]})

async function getUser(next) {
	localUser = await supabase.auth.getSession();
	if (localUser.data.session == null) {
		next('/unauthorized')
	}
	else {
		next();
	}
}


router.beforeEach((to, from, next) => {
	if (to.meta.requiresAuth) {
		getUser(next);
	}
	else {
		next();
	}
})

export default router
