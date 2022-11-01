<template>
  <div class="w-[1440px] grid grid-cols-[400px_1fr]">
    <Sidebar />
    <div id="map" class="overflow-hidden bg-slate-100 h-full">
      <Map />
    </div>
  </div>
</template>

<script setup lang="ts">
import Map from "@/components/Map.vue";
import Sidebar from "@/components/Sidebar/Index.vue";
</script>
