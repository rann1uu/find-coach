import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

import CoachDetail from "@/views/coaches/CoachDetail.vue";
import CoachList from "@/views/coaches/CoachList.vue";
import CoachRegistration from "@/views/coaches/CoachRegistration.vue";
import ContactCoach from "@/views/requests/ContactCoach.vue";
import RequestReceived from "@/views/requests/RequestReceived.vue";
import NotFound from "@/views/NotFound.vue";
import UserAuth from "@/views/auth/UserAuth.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/coaches" },
    { path: "/coaches", component: CoachList },
    {
      path: "/coaches/:id",
      component: CoachDetail,
      props: true,
      children: [{ path: "contact", component: ContactCoach }], // coached/id/contact
    },
    {
      path: "/register",
      component: CoachRegistration,
      meta: { requireAuth: true },
    },
    {
      path: "/requests",
      component: RequestReceived,
      meta: { requireAuth: true },
    },
    { path: "/:notFound(.*)", component: NotFound },
    { path: "/auth", component: UserAuth, meta: { requireUnAuth: true } },
  ],
});

router.beforeEach(function (to) {
  const userStore = useUserStore();
  const { authenticated } = storeToRefs(userStore);
  if (to.meta.requireAuth && !authenticated.value) {
    return { path: "/auth" };
  } else if (to.meta.requireUnAuth && authenticated.value) {
    return { path: "/coaches" };
  } else return true;
});

export default router;
