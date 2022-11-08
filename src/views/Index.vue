<template>
  <div class="w-full h-full grid grid-cols-[1.5fr_4fr]">
    <Sidebar />
    <div
      id="map"
      class="overflow-hidden w-full h-full flex items-center"
      :style="{ cursor: mapStore.isDragging ? 'grabbing' : 'grab' }"
      ref="mapWrapper"
    >
      <Map @init-map="initMap" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Map from "@/components/Map/Map.vue";
import Sidebar from "@/components/Sidebar/Index.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { Coordinate } from "@/types/Coordinate";
import { useMap } from "@/store/map";
import { ZOOM_FACTOR } from "@/constants";
import { HtmlSvg } from "@/types/common";

const mapWrapper = ref<HTMLElement | null>(null);

const isMousedown = ref(false);
const coordinate = ref<Coordinate>({ x: 0, y: 0 });

const mapStore = useMap();
const { setSVGIntialSize, centerizedMap, movePosition, zoom } = mapStore;

const onMouseDownHandler = (event: MouseEvent) => {
  event.preventDefault();
  const { offsetY, offsetX } = event;

  isMousedown.value = true;

  coordinate.value = { x: offsetX, y: offsetY };
};

const onMouseMoveHandler = (event: MouseEvent) => {
  if (!isMousedown.value) return;

  mapStore.isDragging = true;

  const { offsetY, offsetX } = event;
  movePosition({
    x: offsetX - coordinate.value.x,
    y: offsetY - coordinate.value.y,
  });

  coordinate.value = { x: offsetX, y: offsetY };
};

const onMouseUpHandler = (event: MouseEvent) => {
  isMousedown.value = false;
  mapStore.isDragging = false;
};

const onWheelHandler = (event: WheelEvent) => {
  event.preventDefault();

  const { deltaY, offsetY, offsetX } = event;
  const isZoomIn = deltaY < 0;
  const scaleStep = isZoomIn ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;

  zoom({
    isZoomIn,
    position: { x: offsetX, y: offsetY },
    scale: scaleStep,
    // scale: 0.25,
  });
};

const provinceClickHandler = (provinceEl: HtmlSvg, event: MouseEvent) => {
  const svg = mapStore.svg!;
  const svgRect = svg.getBoundingClientRect();
  const provinceSize = provinceEl.getBoundingClientRect();
  const mapEl = mapStore.mapGroupElement;

  const endAnimationHandler = () => {
    mapEl.style.transition = "";
    mapEl.removeEventListener("transitionend", endAnimationHandler);
  };

  const centerX = svgRect.width / 2;
  const centerY = svgRect.height / 2;

  const targetToCenterX =
    centerX - (provinceSize.x - svgRect.x + provinceSize.width / 2);
  const targetToCenterY =
    centerY - (provinceSize.y - svgRect.y + provinceSize.height / 2);

  movePosition({
    x: targetToCenterX,
    y: targetToCenterY,
  });

  mapEl.style.transition = ".6s cubic-bezier(0.785, 0.135, 0.15, 0.86)";
  mapEl.addEventListener("transitionend", endAnimationHandler);

  const position = {
    // x: provinceSize.x - svgRect.x + provinceSize.width / 2,
    // y: provinceSize.y - svgRect.y + provinceSize.height / 2,
    x: centerX,
    y: centerY,
  };

  const scale = Math.min(
    (svgRect.width - 200) / provinceSize.width,
    (svgRect.height - 100) / provinceSize.height
  );

  zoom({
    position,
    scale,
    // scale: Math.pow(ZOOM_FACTOR, 20),
    // scale: 4,
    // isZoomIn: true,
    isZoomIn: mapStore.zoomScale < mapStore.zoomScale * scale,
    isCloseUp: true,
  });
};

const provinceMouseMoveHandler = (provinceEl: HtmlSvg) => {
  for (const province of mapStore.groupIslandByProvince(provinceEl)) {
    province.classList.add("hover");
  }
};

const provinceMouseOutHandler = (provinceEl: HtmlSvg) => {
  for (const province of mapStore.groupIslandByProvince(provinceEl)) {
    province.classList.remove("hover");
  }
};

const initMap = () => {
  const svg = mapStore.svg!;

  const { width, height } = mapWrapper.value!.getBoundingClientRect();
  setSVGIntialSize(width, height);
  centerizedMap();

  svg.addEventListener("mousedown", onMouseDownHandler);
  svg.addEventListener("mousemove", onMouseMoveHandler);
  svg.addEventListener("wheel", onWheelHandler);

  window.addEventListener("mouseup", onMouseUpHandler);

  for (const province of mapStore.provinceElements) {
    province.addEventListener(
      "click",
      provinceClickHandler.bind(null, province)
    );

    province.addEventListener(
      "mousemove",
      provinceMouseMoveHandler.bind(null, province)
    );

    province.addEventListener(
      "mouseout",
      provinceMouseOutHandler.bind(null, province)
    );
  }
};

onUnmounted(() => {
  const svg = mapStore.svg!;

  svg.removeEventListener("mousedown", onMouseDownHandler);
  svg.removeEventListener("mousemove", onMouseMoveHandler);
  svg.removeEventListener("wheel", onWheelHandler);

  window.removeEventListener("mouseup", onMouseUpHandler);
});
</script>

<style>
#map {
  background: linear-gradient(-30deg, #f4e8ea 0, #e3eeff 100%, #e3eeff);
}
</style>
