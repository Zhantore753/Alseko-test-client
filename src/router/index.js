import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import Person from "@/views/Person.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/person/:id",
    name: "Person",
    component: Person,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;