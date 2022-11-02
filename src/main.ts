import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";

import "./style.css";

import App from "@/App.vue";
import routes from "@/router";

const router = createRouter({
  routes,
  history: createWebHistory(),
});

const store = createPinia();

const app = createApp(App);
app.use(router);
app.use(store);

app.mount("#app");
