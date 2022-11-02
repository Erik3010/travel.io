import { defineStore } from "pinia";

interface State {
  svg: (HTMLElement & SVGElement) | null;
  zoomScale: number;
  viewBox: ViewBox;
}

interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const useMap = defineStore("map", {
  state: (): State => ({
    svg: null,
    zoomScale: 1,
    viewBox: { x: 0, y: 0, width: 0, height: 0 },
  }),
});
