import { createRouter , createWebHistory } from "vue-router";
import Axios from "@/API/axios"
import homePage from "@/view/homePage.vue";
import login from "@/component/login.vue";
import register from "@/component/register.vue";
import profile from "@/component/profile.vue";
import notFound from "@/component/404.vue";

const router = createRouter({
    history: createWebHistory("/"),
    routes: [
        {path: "/" , component: homePage},
        {path : "/login" , component: login , meta: {guest: true}},
        {path: "/register" , component: register , meta: {guest: true}},
        {path: "/profile" , component: profile , meta: {requiresAuth: true}},
        {path: "/:pathMatch(.*)*" , component: notFound}
    ]
});


const isAuth = async () => {
    try{
        const response = await Axios.get("/check-auth" );
        return response.data.isAuthenticated;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

// if user is logged then when user try to go to profile it redirects to register

router.beforeEach( async (to, from, next) => {
    const isAuthenticated = await isAuth();

    if (to.meta.requiresAuth && !isAuthenticated) {
      next("/login"); // Redirect to login if not authenticated
    } else if (to.meta.guest && isAuthenticated) {
      next("/profile"); // Redirect logged-in users away from login/register
    } else {
      next()
    }
  });

export default router; 