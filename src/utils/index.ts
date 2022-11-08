import { Coordinate } from "@/types/Coordinate";

export const roundNumber = (num: number, decimal: number) =>
  Number(num.toFixed(decimal));

export const clamp = (value: number, [min, max]: number[]) =>
  Math.min(max, Math.max(min, value));

export const log = (base: number, num: number) =>
  Math.log(num) / Math.log(base);

export const generateCSSTransform = (position: Coordinate, scale: number) =>
  `translate(${position.x} ${position.y}) scale(${scale})`;
