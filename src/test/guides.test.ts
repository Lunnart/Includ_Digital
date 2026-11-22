import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { GUIDES, getGuide, guidesByCategory } from "@/lib/guides";
import { routeTree } from "@/routeTree.gen";

describe("guides", () => {
  it("gives every guide a unique address", () => {
    const slugs = GUIDES.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("puts the phone (celular) in focus, with more guides than internet", () => {
    expect(guidesByCategory("celular").length).toBeGreaterThan(guidesByCategory("internet").length);
  });

  it("returns nothing for an unknown guide", () => {
    expect(getGuide("nao-existe")).toBeUndefined();
  });

  it("opens the doubts, guide and scam pages", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/duvidas").at(-1)?.routeId).toBe("/duvidas/");
    expect(router.matchRoutes("/duvidas/fazer-uma-ligacao").at(-1)?.routeId).toBe("/duvidas/$slug");
    expect(router.matchRoutes("/golpes").at(-1)?.routeId).toBe("/golpes");
  });
});
