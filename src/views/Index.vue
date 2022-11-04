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
const { setSVGIntialSize, centerizedMap, movePosition, zoom } = mapStore;

const onMouseDownHandler = (event: MouseEvent) => {
  event.preventDefault();
  const { offsetY, offsetX } = event;

  isMousedown.value = true;

  coordinate.value = { x: offsetX, y: offsetY };
};

const onMouseMoveHandler = (event: MouseEvent) => {
  if (!isMousedown.value) return;

  const { offsetY, offsetX } = event;
  movePosition({
    x: offsetX - coordinate.value.x,
    y: offsetY - coordinate.value.y,
  });

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

  zoom({
    isZoomIn,
    position: { x: offsetX, y: offsetY },
    scale: scaleStep,
    // scale: 0.25,
  });
};

const provinceClickHandler = (
  provinceEl: HTMLElement & SVGGraphicsElement,
  event: MouseEvent
) => {
  const svg = mapStore.svg!;
  const svgRect = svg.getBoundingClientRect();
  const provinceSize = provinceEl.getBoundingClientRect();

  // console.log(provinceSize);
  // return;

  (svg.querySelector("#map-group")! as HTMLElement).style.transition =
    ".3s cubic-bezier(0.25, 1, 0.5, 1)";

  (svg.querySelector("#map-group")! as HTMLElement).addEventListener(
    "transitionend",
    () => {
      (svg.querySelector("#map-group")! as HTMLElement).style.transition = "";
    }
  );

  // console.log((svgRect.width - provinceEl.getBBox().width) / 2);
  const position = {
    x: provinceSize.x - svgRect.x + provinceSize.width / 2,
    y: provinceSize.y - svgRect.y + provinceSize.height / 2,
  };
  zoom({
    position,
    scale: Math.pow(ZOOM_FACTOR, 20),
    // scale: 4,
    isZoomIn: true,
  });
};

onMounted(() => {
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
