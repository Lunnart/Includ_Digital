// Text-size preference: a purely visual setting kept only in this browser.
export const TEXT_SIZES = [
  { id: "normal", label: "Normal", fontSize: "125%" },
  { id: "grande", label: "Grande", fontSize: "145%" },
  { id: "muito-grande", label: "Muito grande", fontSize: "170%" },
] as const;

export const TEXT_SIZE_STORAGE_KEY = "tamanho-da-letra";

export function clampTextSizeIndex(index: number): number {
  return Math.min(Math.max(index, 0), TEXT_SIZES.length - 1);
}

export function parseStoredTextSize(value: string | null): number {
  const index = TEXT_SIZES.findIndex((size) => size.id === value);
  return index === -1 ? 0 : index;
}
