<template>
  <path
    :transform="transform"
    ref="pinEl"
    class="fill-gray-700 transition-transform duration-[0.6s] pointer-events-none"
    fill-rule="evenodd"
    stroke="none"
    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975
    16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98
    3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58
    0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000
    6z"
    clip-rule="evenodd"
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useMap } from "@/store/map";
import { generateCSSTransform } from "@/utils";
import { HtmlSvg } from "@/types/common";
import { Province } from "@/types/Province";

const props = defineProps<{ province: Province }>();
const mapStore = useMap();

const pinEl = ref<HtmlSvg | null>(null);

const { x, y, width, height } = props.province.primaryIsland.props;

const scale = computed(() => 1 / mapStore.zoomScale);
const transform = computed(() => {
  const rect = pinEl.value?.getBoundingClientRect() ?? null;
  const pinSize = {
    width: rect?.width ?? 0,
    height: rect?.height ?? 0,
  };

  return generateCSSTransform(
    {
      x: x + width / 2 - (scale.value * pinSize.width) / 2,
      y: y + height / 2 - (scale.value * pinSize.height) / 2,
    },
    scale.value
  );
});
</script>
