export const roundNumber = (num: number, decimal: number) =>
  Number(num.toFixed(decimal));

export const clamp = (value: number, [min, max]: number[]) =>
  Math.min(max, Math.max(min, value));

export const log = (base: number, num: number) =>
  Math.log(num) / Math.log(base);
