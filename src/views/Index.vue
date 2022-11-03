<template>
  <div class="w-full h-full grid grid-cols-[1.5fr_4fr]">
    <Sidebar />
    <div
      id="map"
      class="overflow-hidden bg-blue-100 w-full h-full cursor-grab flex items-center"
    >
      <Map ref="map" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Map from "@/components/Map.vue";
import Sidebar from "@/components/Sidebar/Index.vue";
import { ref, onMounted } from "vue";
import { Coordinate } from "@/types/Coordinate";
import { useMap } from "@/store/map";

import { roundNumber } from "@/utils";

import { storeToRefs } from "pinia";

const isMousedown = ref(false);
const coordinate = ref<Coordinate>({ x: 0, y: 0 });

const map = ref<InstanceType<typeof Map> | null>(null);

const mapStore = useMap();

onMounted(() => {
  // const svg = map.value?.svg!;
  const svg = mapStore.svg!;

  svg.addEventListener("mousedown", (event) => {
    const { offsetY, offsetX } = event;

    isMousedown.value = true;

    coordinate.value = { x: offsetX, y: offsetY };
  });

  svg.addEventListener("mousemove", (event) => {
    if (!isMousedown.value) return;

    const { offsetY, offsetX } = event;

    // mapStore.viewBox.x += coordinate.value.x - offsetX;
    // mapStore.viewBox.y += coordinate.value.y - offsetY;
    mapStore.viewBox.x += offsetX - coordinate.value.x;
    mapStore.viewBox.y += offsetY - coordinate.value.y;

    coordinate.value = { x: offsetX, y: offsetY };
  });

  svg.addEventListener("wheel", (event) => {
    event.preventDefault();
    const { deltaY, offsetY, offsetX, clientY, clientX } = event;

    // const delta = ((deltaY > 0 ? 1 : -1) * Math.log(Math.abs(deltaY) + 10)) / 3;
    // const zoom = Math.pow(1.1, -1 * delta);

    // const scaleStep = 0.25;
    const scaleAmount = 1.1;
    const scaleStep = deltaY < 0 ? scaleAmount : 1 / scaleAmount;

    // const zoom = mapStore.zoomScale + (deltaY < 0 ? scaleStep : -scaleStep);

    // const zoom = roundNumber(mapStore.zoomScale + (deltaY * -1) / 1000, 2);

    // mapStore.viewBox.x =
    //   (zoom / mapStore.zoomScale) * (mapStore.viewBox.x - offsetX) + offsetX;

    // mapStore.viewBox.y =
    //   (zoom / mapStore.zoomScale) * (mapStore.viewBox.y - offsetY) + offsetY;

    // mapStore.zoomScale = zoom;

    console.log(offsetX, mapStore.viewBox.x, offsetX - mapStore.viewBox.x);
    mapStore.viewBox.x = offsetX - (offsetX - mapStore.viewBox.x) * scaleStep;
    mapStore.viewBox.y = offsetY - (offsetY - mapStore.viewBox.y) * scaleStep;

    mapStore.zoomScale *= scaleStep;

    // mapStore.zoomScale += Math.round(((deltaY * -1) / 1000) * 100) / 100;
  });

  window.addEventListener("mouseup", () => {
    isMousedown.value = false;
  });
});
</script>
