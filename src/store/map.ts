import { ZOOM_FACTOR } from "@/constants";
import { Coordinate } from "@/types/Coordinate";
import { defineStore } from "pinia";

interface State {
  svg: (HTMLElement & SVGSVGElement) | null;
  zoomScale: number;
  viewBox: ViewBox;
  position: Coordinate;
  strokeWidth: number;
}

interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ZoomParams {
  position: Coordinate;
  scale: number;
  isZoomIn: boolean;
}

export const useMap = defineStore("map", {
  state: (): State => ({
    svg: null,
    zoomScale: 1,
    viewBox: { x: 0, y: 0, width: 0, height: 0 },
    position: { x: 0, y: 0 },
    strokeWidth: 1,
  }),
  getters: {
    mapGroupElement: (state): SVGGraphicsElement =>
      state.svg!.querySelector("#map-group") as SVGGraphicsElement,
    provinceElements: (state): HTMLElement[] => {
      const svg = state.svg!;
      return [...svg.querySelectorAll("path[iso_a2=ID]")] as HTMLElement[];
    },
  },
  actions: {
    setSVGIntialSize(width: number, height: number) {
      this.viewBox.width = width;
      this.viewBox.height = height;
    },
    centerizedMap() {
      const { width, height } = this.mapGroupElement.getBBox();

      this.position.x = (this.viewBox.width - width) / 2;
      this.position.y = (this.viewBox.height - height) / 2;
    },
    movePosition(coordinate: Coordinate) {
      this.position.x += coordinate.x;
      this.position.y += coordinate.y;
    },
    zoom({ position, scale, isZoomIn }: ZoomParams) {
      const { x, y } = position;

      this.position.x = x - (x - this.position.x) * scale;
      this.position.y = y - (y - this.position.y) * scale;

      this.zoomScale *= scale;

      // this.strokeWidth += isZoomIn ? -0.025 * scale : 0.025 * scale;

      // this.strokeWidth *= isZoomIn
      //   ? 1 / (ZOOM_FACTOR * scale)
      //   : ZOOM_FACTOR * scale;
    },
  },
});
