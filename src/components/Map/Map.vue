<template>
  <svg
    ref="svg"
    fill="#3498db"
    stroke="#ecf0f1"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="`${mapStore.viewBox.x} ${mapStore.viewBox.y} ${mapStore.viewBox.width} ${mapStore.viewBox.height}`"
  >
    <g
      id="map-group"
      ref="mapGroup"
      :stroke-width="mapStore.strokeWidth"
      :transform="`translate(${mapStore.position.x} ${mapStore.position.y}) scale(${mapStore.zoomScale})`"
    />

    <Pin />
  </svg>
</template>

<style>
path[iso_a2="ID"]:hover {
  fill: #2478b1;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useMap } from "@/store/map";
import Pin from "@/components/Map/Pin.vue";

const emit = defineEmits<{
  (e: "initMap"): void;
}>();

const svg = ref<(HTMLElement & SVGSVGElement) | null>(null);
const mapGroup = ref<HTMLElement | null>(null);

const mapStore = useMap();

onMounted(async () => {
  const svgString = await (await fetch("src/assets/ID.svg")).text();

  const parser = new DOMParser().parseFromString(svgString, "image/svg+xml");
  const paths = [...parser.querySelectorAll("svg > path")];

  for (const path of paths) mapGroup.value!.appendChild(path);

  mapStore.svg = svg.value;
  emit("initMap");
});
</script>
