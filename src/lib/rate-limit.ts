// Small sliding-window rate limiter. Lives in memory, so on the hosted edge each
// server instance counts separately: it is a best-effort brake, not a hard quota.
export type RateLimitRule = { limit: number; windowMs: number };

export function createRateLimiter(rules: RateLimitRule[], maxKeys = 5000) {
  const hits = new Map<string, number[]>();
  const longest = Math.max(...rules.map((r) => r.windowMs));

  return function check(key: string, now = Date.now()): { allowed: boolean; retryAfterMs: number } {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < longest);
    for (const rule of rules) {
      const inWindow = recent.filter((t) => now - t < rule.windowMs);
      if (inWindow.length >= rule.limit) {
        const oldest = inWindow[0] ?? now;
        hits.set(key, recent);
        return { allowed: false, retryAfterMs: rule.windowMs - (now - oldest) };
      }
    }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > maxKeys) {
      const firstKey = hits.keys().next().value;
      if (firstKey !== undefined) hits.delete(firstKey);
    }
    return { allowed: true, retryAfterMs: 0 };
  };
}
