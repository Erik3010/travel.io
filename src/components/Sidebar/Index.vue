<template>
  <aside class="h-full border-l bg-gray-50 border-l-gray-200">
    <SidebarHeader />
    <div
      class="p-4 bg-slate-200 overflow-y-auto h-[calc(100vh-70px)] space-y-3"
    >
      <Card v-for="i in 10" :key="i" />
    </div>
  </aside>
</template>

<script lang="ts" setup>
import SidebarHeader from "@/components/Sidebar/SidebarHeader.vue";
import Card from "@/components/Sidebar/Card.vue";
</script>
