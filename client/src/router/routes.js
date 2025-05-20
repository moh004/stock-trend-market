import { createRouter, createWebHistory } from "vue-router";
import Axios from "@/API/axios";

import HomePage from "@/view/HomePage.vue";
import Login from "@/view/loginPage.vue";
import Register from "@/view/registerPage.vue";
import Profile from "@/view/profilePage.vue";
import SellPage from "@/view/sellPage.vue";
import NotFound from "@/view/404Page.vue";

const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    { path: "/", component: HomePage },
    { path: "/login", component: Login, meta: { guest: true } },
    { path: "/register", component: Register, meta: { guest: true } },
    { path: "/profile", component: Profile, meta: { requiresAuth: true } },
    { path: "/sell", name: "SellCoin", component: SellPage, meta: { requiresAuth: true } },
    { path: "/:pathMatch(.*)*", component: NotFound }
  ]
});

const isAuth = async () => {
  try {
    const response = await Axios.get("/check-auth");
    return response.data.isAuthenticated;
  } catch (e) {
    console.error(e);
    return false;
  }
};

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await isAuth();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.meta.guest && isAuthenticated) {
    next("/profile");
  } else {
    next();
  }
});

export default router;
