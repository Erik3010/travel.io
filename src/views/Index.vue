<template>
  <div class="w-full h-full grid grid-cols-[1.5fr_4fr]">
    <Sidebar />
    <div
      id="map"
      class="overflow-hidden bg-blue-100 w-full h-full cursor-grab flex items-center"
      ref="mapWrapper"
    >
      <Map />
    </div>
  </div>
</template>

<script setup lang="ts">
import Map from "@/components/Map.vue";
import Sidebar from "@/components/Sidebar/Index.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { Coordinate } from "@/types/Coordinate";
import { useMap } from "@/store/map";
import { ZOOM_FACTOR } from "@/constants";
import { roundNumber } from "@/utils";
import { storeToRefs } from "pinia";

const mapWrapper = ref<HTMLElement | null>(null);

const isMousedown = ref(false);
const coordinate = ref<Coordinate>({ x: 0, y: 0 });

const mapStore = useMap();

const onMouseDownHandler = (event: MouseEvent) => {
  const { offsetY, offsetX } = event;

  isMousedown.value = true;

  coordinate.value = { x: offsetX, y: offsetY };
};

const onMouseMoveHandler = (event: MouseEvent) => {
  if (!isMousedown.value) return;

  const { offsetY, offsetX } = event;

  mapStore.position.x += offsetX - coordinate.value.x;
  mapStore.position.y += offsetY - coordinate.value.y;

  coordinate.value = { x: offsetX, y: offsetY };
};

const onMouseUpHandler = (event: MouseEvent) => {
  isMousedown.value = false;
};

const onWheelHandler = (event: WheelEvent) => {
  event.preventDefault();

  const { deltaY, offsetY, offsetX } = event;

  const isZoomIn = deltaY < 0;
  const scaleStep = isZoomIn ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;

  mapStore.position.x = offsetX - (offsetX - mapStore.position.x) * scaleStep;
  mapStore.position.y = offsetY - (offsetY - mapStore.position.y) * scaleStep;

  mapStore.zoomScale *= scaleStep;
};

onMounted(() => {
  const { width, height } = mapWrapper.value!.getBoundingClientRect();
  mapStore.viewBox.width = width;
  mapStore.viewBox.height = height;

  const svg = mapStore.svg!;
  const map = svg.querySelector("#map-group") as SVGGraphicsElement;
  const mapRect = map.getBBox();

  mapStore.position.x = (mapStore.viewBox.width - mapRect.width) / 2;
  mapStore.position.y = (mapStore.viewBox.height - mapRect.height) / 2;

  svg.addEventListener("mousedown", onMouseDownHandler);
  svg.addEventListener("mousemove", onMouseMoveHandler);
  svg.addEventListener("wheel", onWheelHandler);

  window.addEventListener("mouseup", onMouseUpHandler);
});

onUnmounted(() => {
  const svg = mapStore.svg!;

  svg.removeEventListener("mousedown", onMouseDownHandler);
  svg.removeEventListener("mousemove", onMouseMoveHandler);
  svg.removeEventListener("wheel", onWheelHandler);

  window.removeEventListener("mouseup", onMouseUpHandler);
});
</script>
