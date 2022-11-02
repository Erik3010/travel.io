<template>
  <div class="w-full h-full grid grid-cols-[1.5fr_4fr]">
    <Sidebar />
    <div id="map" class="overflow-hidden bg-blue-100 w-full h-full cursor-grab">
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

    mapStore.viewBox.x += coordinate.value.x - offsetX;
    mapStore.viewBox.y += coordinate.value.y - offsetY;

    coordinate.value = { x: offsetX, y: offsetY };
  });

  svg.addEventListener("wheel", (event) => {
    event.preventDefault();
    const { deltaY } = event;

    // console.log(event.offsetY, event.offsetX);

    mapStore.zoomScale = roundNumber(
      mapStore.zoomScale + (deltaY * -1) / 1000,
      2
    );
    // mapStore.zoomScale += Math.round(((deltaY * -1) / 1000) * 100) / 100;
  });

  window.addEventListener("mouseup", () => {
    isMousedown.value = false;
  });
});
</script>
