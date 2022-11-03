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

const setScale = (position: Coordinate, scale: number, isZoomIn: boolean) => {
  mapStore.position.x = position.x - (position.x - mapStore.position.x) * scale;
  mapStore.position.y = position.y - (position.y - mapStore.position.y) * scale;

  mapStore.zoomScale *= scale;

  mapStore.strokeWidth += isZoomIn ? -0.025 * scale : 0.025 * scale;

  // mapStore.strokeWidth *= isZoomIn
  //   ? 1 / (ZOOM_FACTOR * scale)
  //   : ZOOM_FACTOR * scale;
};

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

  setScale({ x: offsetX, y: offsetY }, scaleStep, isZoomIn);
  // mapStore.position.x = offsetX - (offsetX - mapStore.position.x) * scaleStep;
  // mapStore.position.y = offsetY - (offsetY - mapStore.position.y) * scaleStep;

  // mapStore.zoomScale *= scaleStep;

  // mapStore.strokeWidth *= isZoomIn ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
};

const provinceClickHandler = (element: HTMLElement, event: MouseEvent) => {
  const svg = mapStore.svg!;
  const { x, y } = svg.getBoundingClientRect();
  const rect = element.getBoundingClientRect();

  (svg.querySelector("#map-group")! as HTMLElement).style.transition =
    ".3s cubic-bezier(0.25, 1, 0.5, 1)";

  svg.addEventListener("transitionend", () => {
    (svg.querySelector("#map-group")! as HTMLElement).style.transition = "";
  });

  setScale(
    { x: rect.x - x + rect.width / 2, y: rect.y - y + rect.height / 2 },
    4 * ZOOM_FACTOR,
    true
  );
  // setScale({ x: event.offsetX, y: event.offsetY }, 6, true);
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

  const provinces = [
    ...svg.querySelectorAll("path[iso_a2=ID]"),
  ] as HTMLElement[];

  for (const province of provinces) {
    (province as HTMLElement).addEventListener(
      "click",
      provinceClickHandler.bind(null, province)
    );
  }
});

onUnmounted(() => {
  const svg = mapStore.svg!;

  svg.removeEventListener("mousedown", onMouseDownHandler);
  svg.removeEventListener("mousemove", onMouseMoveHandler);
  svg.removeEventListener("wheel", onWheelHandler);

  window.removeEventListener("mouseup", onMouseUpHandler);
});
</script>
