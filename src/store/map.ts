import { ZOOM_FACTOR } from "@/constants";
import { Coordinate } from "@/types/Coordinate";
import { defineStore } from "pinia";
import { clamp, log } from "@/utils";

interface State {
  svg: (HTMLElement & SVGSVGElement) | null;
  zoomScale: number;
  viewBox: ViewBox;
  position: Coordinate;
  strokeWidth: number;
  maxScale: number;
  minScale: number;
  isDragging: boolean;
  isOutOfBound: boolean;
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
  isCloseUp?: boolean;
}

export const useMap = defineStore("map", {
  state: (): State => ({
    svg: null,
    zoomScale: 1,
    viewBox: { x: 0, y: 0, width: 0, height: 0 },
    position: { x: 0, y: 0 },
    strokeWidth: 1,
    maxScale: 10,
    minScale: 0.5,
    isDragging: false,
    isOutOfBound: false,
  }),
  getters: {
    mapGroupElement: (state): SVGGraphicsElement =>
      state.svg!.querySelector("#map-group") as SVGGraphicsElement,
    provinceElements: (state): (HTMLElement & SVGGraphicsElement)[] => {
      const svg = state.svg!;
      return Array.from(
        svg.querySelectorAll("path[iso_a2=ID]")
      ) as (HTMLElement & SVGGraphicsElement)[];
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
    zoom({ position, scale, isZoomIn, isCloseUp = false }: ZoomParams) {
      const { x, y } = position;

      const { x: targetX, y: targetY } = {
        x: x - this.position.x,
        y: y - this.position.y,
      };

      if (
        (this.zoomScale * scale >= this.maxScale && isZoomIn) ||
        (this.zoomScale * scale <= this.minScale && !isZoomIn)
      ) {
        this.isOutOfBound = !isCloseUp;

        if (!this.isOutOfBound) {
          this.isOutOfBound = true;

          const calculateScale = isCloseUp
            ? isZoomIn
              ? this.maxScale / this.zoomScale
              : this.minScale
            : scale;

          this.position.x = x - targetX * calculateScale;
          this.position.y = y - targetY * calculateScale;
          this.zoomScale *= calculateScale;
        } else {
          this.position.x = x - targetX;
          this.position.y = y - targetY;
        }
      } else {
        this.isOutOfBound = false;

        this.position.x = x - targetX * scale;
        this.position.y = y - targetY * scale;
        this.zoomScale *= scale;
      }

      // ----------
      // this.position.x = x - targetX * scale;
      // this.position.y = y - targetY * scale;
      // this.zoomScale *= scale;

      this.strokeWidth = 1 / this.zoomScale;

      // // const nextScale = this.zoomScale + 0.25 * (isZoomIn ? 1 : -1);
      // const nextScale = this.zoomScale + scale * (isZoomIn ? 1 : -1);
      // const scaleRatio = nextScale / this.zoomScale;

      // this.position.x = x - targetX * (nextScale / this.zoomScale);
      // this.position.y = y - targetY * (nextScale / this.zoomScale);
      // this.zoomScale = nextScale;
    },
  },
});
