<template>
  <div
    id="card"
    class="flex bg-white rounded-sm overflow-hidden cursor-pointer hover:bg-gray-100"
  >
    <div class="w-full p-4">
      <div class="bg-primary-base rounded-full p-1 inline-block">
        <GlobeIcon />
      </div>
      <h3 class="text-lg font-bold text-gray-800">Chinatown</h3>
      <p class="text-sm text-gray-600">Jakarta, PIK</p>
    </div>
    <div class="w-40">
      <img
        src="@/assets/image.jpg"
        class="object-cover w-full h-full flex-none"
        alt=""
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import GlobeIcon from "@/components/Icon/Globe.vue";
</script>
