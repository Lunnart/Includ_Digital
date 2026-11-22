import { describe, expect, it } from "vitest";

import { TEXT_SIZES, clampTextSizeIndex, parseStoredTextSize } from "@/lib/text-size";

describe("text size preference", () => {
  it("starts at the large 20px base and only grows from there", () => {
    expect(TEXT_SIZES[0]?.fontSize).toBe("125%");
    const percents = TEXT_SIZES.map((s) => Number.parseFloat(s.fontSize));
    expect(percents).toEqual([...percents].sort((a, b) => a - b));
  });

  it("never goes below the smallest or above the largest size", () => {
    expect(clampTextSizeIndex(-1)).toBe(0);
    expect(clampTextSizeIndex(99)).toBe(TEXT_SIZES.length - 1);
  });

  it("falls back to the normal size for unknown saved values", () => {
    expect(parseStoredTextSize(null)).toBe(0);
    expect(parseStoredTextSize("gigante")).toBe(0);
    expect(parseStoredTextSize("muito-grande")).toBe(2);
  });
});
