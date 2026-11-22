import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  TEXT_SIZES,
  TEXT_SIZE_STORAGE_KEY,
  clampTextSizeIndex,
  parseStoredTextSize,
} from "@/lib/text-size";

export function TextSizeControl() {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      setIndex(parseStoredTextSize(window.localStorage.getItem(TEXT_SIZE_STORAGE_KEY)));
    } catch {
      // Storage can be blocked; the default size still works.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const size = TEXT_SIZES[index] ?? TEXT_SIZES[0];
    document.documentElement.style.fontSize = size.fontSize;
    try {
      window.localStorage.setItem(TEXT_SIZE_STORAGE_KEY, size.id);
    } catch {
      // Ignore: the size still applies for this visit.
    }
  }, [index, loaded]);

  const current = TEXT_SIZES[index] ?? TEXT_SIZES[0];
  const isSmallest = index === 0;
  const isLargest = index === TEXT_SIZES.length - 1;

  return (
    <div role="group" aria-label="Tamanho da letra" className="flex items-center gap-2">
      <span className="hidden text-base font-semibold sm:inline">Letra:</span>
      <Button
        type="button"
        variant="outline"
        size="touch"
        onClick={() => setIndex((i) => clampTextSizeIndex(i - 1))}
        disabled={isSmallest}
        aria-label="Diminuir o tamanho da letra"
      >
        A−
      </Button>
      <Button
        type="button"
        variant="outline"
        size="touch"
        onClick={() => setIndex((i) => clampTextSizeIndex(i + 1))}
        disabled={isLargest}
        aria-label="Aumentar o tamanho da letra"
        className="text-2xl"
      >
        A+
      </Button>
      <p className="sr-only" aria-live="polite">
        Tamanho da letra: {current.label}
      </p>
    </div>
  );
}
