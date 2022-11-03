import { Coordinate } from "@/types/Coordinate";
import { defineStore } from "pinia";

interface State {
  svg: (HTMLElement & SVGSVGElement) | null;
  zoomScale: number;
  viewBox: ViewBox;
  position: Coordinate;
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
    position: { x: 0, y: 0 },
  }),
});
