import { describe, expect, test } from "vitest";
import {
  ensureUniqueIds,
  existsVerdict,
  limitConcurrency,
  MAX_CANDIDATES,
  parseFailOn,
  parseProbability,
  RELATION_TO_VERDICT,
  rankCandidates,
  sanitizeId,
  screenRecommendation,
  truncate,
  verifyAction,
} from "../src/lib.js";

describe("sanitizeId", () => {
  test("keeps safe characters and drops the rest", () => {
    expect(sanitizeId("src/lib.ts")).toBe("src_lib.ts");
    expect(sanitizeId("note: hello?!")).toBe("note_hello");
    expect(sanitizeId("???")).toBe("");
    expect(sanitizeId("a".repeat(100))).toHaveLength(64);
  });
});

describe("ensureUniqueIds", () => {
  test("assigns fallbacks and resolves collisions", () => {
    const items = ensureUniqueIds(
      [{ id: "src/lib.ts", text: "a" }, { id: "src/lib.ts", text: "b" }, { text: "c" }],
      "candidate",
    );
    expect(items.map((i) => i.id)).toEqual(["src_lib.ts", "src_lib.ts_1", "candidate2"]);
    expect(items.map((i) => i.originalId)).toEqual(["src/lib.ts", "src/lib.ts", "candidate2"]);
  });
});

describe("truncate", () => {
  test("marks truncated text and leaves short text alone", () => {
    expect(truncate("abcdef", 3)).toMatch(/^abc .*truncated\]$/);
    expect(truncate("abc", 3)).toBe("abc");
  });
});

describe("verify helpers", () => {
  test("relation maps to verdict labels", () => {
    expect(RELATION_TO_VERDICT.supports).toBe("verified");
    expect(RELATION_TO_VERDICT.contradicts).toBe("contradicted");
    expect(RELATION_TO_VERDICT.says_nothing).toBe("unsupported");
    expect(RELATION_TO_VERDICT.other).toBeUndefined();
  });

  test("verifyAction gates on the auto-accept threshold", () => {
    expect(verifyAction(0.8, 0.8)).toBe("auto");
    expect(verifyAction(0.79, 0.8)).toBe("review");
    expect(verifyAction(null, 0.8)).toBe("review");
  });
});

describe("screenRecommendation", () => {
  const t = { blockAt: 0.75, reviewAt: 0.25 };
  test("escalates by injection, then demotes junk", () => {
    expect(screenRecommendation({ injection: 0.9, ...t }).action).toBe("block");
    expect(screenRecommendation({ injection: 0.4, ...t }).action).toBe("review");
    expect(screenRecommendation({ injection: 0.01, ...t }).action).toBe("pass");
    expect(screenRecommendation({ injection: 0.01, substance: 0.1, ...t }).action).toBe("skip");
    expect(screenRecommendation({ injection: 0.01, relevance: 0.05, ...t }).action).toBe("skip");
  });
  test("reason names the threshold that fired", () => {
    expect(screenRecommendation({ injection: 0.9, ...t }).reason).toContain("block threshold 0.75");
  });
});

describe("find helpers", () => {
  test("existsVerdict uses cookbook thresholds by default", () => {
    expect(existsVerdict(0.98)).toBe("answered");
    expect(existsVerdict(0.46)).toBe("partial");
    expect(existsVerdict(0.14)).toBe("absent");
    expect(existsVerdict(0.5, 0.5, 0.2)).toBe("answered");
  });

  test("rankCandidates orders by probability and keeps caller order on ties", () => {
    const ranked = rankCandidates([{ id: "a" }, { id: "b" }, { id: "c" }], { a: 0.1, b: 0.5, c: 0.1 });
    expect(ranked.map((c) => c.id)).toEqual(["b", "a", "c"]);
    expect(rankCandidates([{ id: "x" }], {})[0]!.probability).toBe(0);
  });

  test("MAX_CANDIDATES stays within the Choice option limit", () => {
    expect(MAX_CANDIDATES).toBeLessThanOrEqual(255);
  });
});

describe("flag parsers", () => {
  const allowed = ["a", "b"] as const;
  test("parseFailOn accepts lists, none, and defaults", () => {
    expect(parseFailOn(undefined, allowed, ["a"])).toEqual(["a"]);
    expect(parseFailOn("a, b", allowed, [])).toEqual(["a", "b"]);
    expect(parseFailOn("none", allowed, ["a"])).toEqual([]);
    expect(parseFailOn("", allowed, ["a"])).toEqual([]);
    expect(() => parseFailOn("zzz", allowed, [])).toThrow(/Invalid --fail-on/);
  });

  test("parseProbability validates the 0..1 range", () => {
    expect(parseProbability("--x", undefined, 0.5)).toBe(0.5);
    expect(parseProbability("--x", "0.75", 0.5)).toBe(0.75);
    expect(() => parseProbability("--x", "1.5", 0.5)).toThrow(/between 0 and 1/);
    expect(() => parseProbability("--x", "abc", 0.5)).toThrow();
  });
});

describe("limitConcurrency", () => {
  test("keeps at most n calls in flight and still resolves every call", async () => {
    let inFlight = 0;
    let peak = 0;
    const work = async (n: number) => {
      inFlight += 1;
      peak = Math.max(peak, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 1));
      inFlight -= 1;
      return n * 2;
    };
    const limited = limitConcurrency(3, work);
    const results = await Promise.all([1, 2, 3, 4, 5, 6, 7].map(limited));
    expect(results).toEqual([2, 4, 6, 8, 10, 12, 14]);
    expect(peak).toBe(3);
  });

  test("a rejection frees its slot, so later calls still run", async () => {
    const limited = limitConcurrency(1, async (fail: boolean) => {
      if (fail) throw new Error("boom");
      return "ok";
    });
    const failed = limited(true);
    const after = limited(false);
    await expect(failed).rejects.toThrow("boom");
    await expect(after).resolves.toBe("ok");
  });

  test("rejects a limit below one", () => {
    expect(() => limitConcurrency(0, async () => 1)).toThrow(/at least 1/);
  });
});
