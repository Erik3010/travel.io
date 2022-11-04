export const roundNumber = (num: number, decimal: number) =>
  Number(num.toFixed(decimal));

export const clamp = (value: number, [min, max]: number[]) =>
  Math.min(max, Math.max(min, value));
