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
      :stroke-width="strokeWidth"
      :transform="transform"
    >
      <Pin
        v-if="mapStore.svg"
        v-for="province in mapStore.getAllGroupedIsland"
        :province="province"
      />
    </g>
  </svg>
</template>

<style>
path[iso_a2="ID"].hover {
  fill: #2478b1;
}
</style>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useMap } from "@/store/map";
import Pin from "@/components/Map/Pin.vue";
import { generateCSSTransform } from "@/utils";

const emit = defineEmits<{
  (event: "initMap"): void;
}>();

const svg = ref<(HTMLElement & SVGSVGElement) | null>(null);
const mapGroup = ref<HTMLElement | null>(null);

const mapStore = useMap();

const strokeWidth = computed(() => 1 / mapStore.zoomScale);
const transform = computed(() =>
  generateCSSTransform(
    { x: mapStore.position.x, y: mapStore.position.y },
    mapStore.zoomScale
  )
);

onMounted(async () => {
  const svgString = await (await fetch("src/assets/ID.svg")).text();

  const parser = new DOMParser().parseFromString(svgString, "image/svg+xml");
  const paths = Array.from(parser.querySelectorAll("svg > path"));

  for (const path of paths) mapGroup.value!.prepend(path);

  mapStore.svg = svg.value;
  emit("initMap");
});
</script>
