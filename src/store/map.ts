import { ZOOM_FACTOR, MAP_PIN_SIZE } from "@/constants";
import { defineStore } from "pinia";

import { HtmlSvg } from "@/types/common";
import { Coordinate } from "@/types/Coordinate";
import { Province } from "@/types/Province";
import { ViewBox } from "@/types/ViewBox";

interface MapState {
  svg: (HTMLElement & SVGSVGElement) | null;
  zoomScale: number;
  viewBox: ViewBox;
  position: Coordinate;
  maxScale: number;
  minScale: number;
  isDragging: boolean;
  isOutOfBound: boolean;
}

interface ZoomParams {
  position: Coordinate;
  scale: number;
  isZoomIn: boolean;
  isCloseUp?: boolean;
}

export const useMap = defineStore("map", {
  state: (): MapState => ({
    svg: null,
    zoomScale: 1,
    viewBox: { x: 0, y: 0, width: 0, height: 0 },
    position: { x: 0, y: 0 },
    maxScale: 10,
    minScale: 0.5,
    isDragging: false,
    isOutOfBound: false,
  }),
  getters: {
    mapGroupElement: (state): HtmlSvg =>
      state.svg!.querySelector<HtmlSvg>("#map-group")!,
    provinceElements: (state): HtmlSvg[] => {
      const svg = state.svg!;
      return Array.from(svg.querySelectorAll<HtmlSvg>("path[iso_a2=ID]"));
    },
    groupIslandByProvince: () => {
      return (provinceEl: HtmlSvg) => {
        const provinceCodeName = provinceEl.getAttribute("iso_3166_2");
        return Array.from(
          document.querySelectorAll<HtmlSvg>(
            `path[iso_3166_2=${provinceCodeName}]`
          )
        );
      };
    },
    getProvincePrimaryIsland: () => {
      return (provinceEls: HtmlSvg[]) => {
        return provinceEls.reduce<HtmlSvg | null>((prevIsland, island) => {
          if (prevIsland === null) return island;

          const { width: prevWidth, height: prevHeight } =
            prevIsland.getBoundingClientRect();
          const { width, height } = island.getBoundingClientRect();

          return prevWidth * prevHeight < width * height ? island : prevIsland;
        }, null);
      };
    },
    getAllGroupedIsland() {
      const provinces: Province[] = [];

      for (const provinceEl of this.provinceElements) {
        const provinceCode = provinceEl.getAttribute("iso_3166_2")!;
        const provinceName = provinceEl.getAttribute("name")!;

        if (provinces.find((province) => province.id === provinceCode))
          continue;

        const provinceIslands = this.groupIslandByProvince(provinceEl);
        const primaryIsland = this.getProvincePrimaryIsland(provinceIslands);
        const rect = primaryIsland!.getBBox();

        const province: Province = {
          id: provinceCode,
          name: provinceName,
          islandEls: provinceIslands,
          primaryIsland: {
            element: primaryIsland,
            // props: rect,
            props: {
              ...rect,
              x:
                rect.x +
                rect.width / 2 -
                ((1 / this.zoomScale) * MAP_PIN_SIZE.width) / 2,
              y:
                rect.y +
                rect.height / 2 -
                ((1 / this.zoomScale) * MAP_PIN_SIZE.height) / 2,
            },
          },
        };

        provinces.push(province);
      }

      return provinces;
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
    setScale({
      position,
      target,
      scale,
    }: {
      position: Coordinate;
      target: Coordinate;
      scale: number;
    }) {
      this.position.x = position.x - target.x * scale;
      this.position.y = position.y - target.y * scale;

      this.zoomScale *= scale;
    },
    zoom({ position, scale, isZoomIn, isCloseUp = false }: ZoomParams) {
      const { x, y } = position;

      const target = {
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

          this.setScale({ position, target, scale: calculateScale });
        } else {
          this.setScale({ position, target, scale: 1 });
        }
      } else {
        this.isOutOfBound = false;
        this.setScale({ position, target, scale });
      }

      // ----------
      // this.position.x = x - targetX * scale;
      // this.position.y = y - targetY * scale;
      // this.zoomScale *= scale;

      // // const nextScale = this.zoomScale + 0.25 * (isZoomIn ? 1 : -1);
      // const nextScale = this.zoomScale + scale * (isZoomIn ? 1 : -1);
      // const scaleRatio = nextScale / this.zoomScale;

      // this.position.x = x - targetX * (nextScale / this.zoomScale);
      // this.position.y = y - targetY * (nextScale / this.zoomScale);
      // this.zoomScale = nextScale;
    },
  },
});
