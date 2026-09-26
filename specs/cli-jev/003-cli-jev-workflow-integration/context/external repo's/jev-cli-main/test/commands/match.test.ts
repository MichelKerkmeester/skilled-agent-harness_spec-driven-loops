import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { parsePairs } from "../../src/commands/match.js";
import {
  allPairs,
  buildMatchRequest,
  crossPairs,
  MATCH_LEVELS,
  matchFailed,
  PAIRS_PER_REQUEST,
  runMatch,
} from "../../src/core/match.js";
import { cliHarness } from "../helpers/cli.js";
import { fakeAsk } from "../helpers/fake-ask.js";

/** A score answer whose probabilities put `winner` on top. */
const level = (winner: 0 | 1 | 2, confidence = 0.8) => {
  const p = [0.1, 0.1, 0.1];
  p[winner] = 0.8;
  return {
    type: "score",
    score: winner,
    confidence,
    probabilities: { "0": p[0], "1": p[1], "2": p[2] },
    legend: {},
  };
};

describe("match: core", () => {
  test("pair generators", () => {
    const items = [
      { id: "a", text: "1" },
      { id: "b", text: "2" },
      { id: "c", text: "3" },
    ];
    expect(allPairs(items).map((p) => `${p.left.id}-${p.right.id}`)).toEqual(["a-b", "a-c", "b-c"]);
    expect(crossPairs(items.slice(0, 2), items.slice(2)).map((p) => `${p.left.id}-${p.right.id}`)).toEqual([
      "a-c",
      "b-c",
    ]);
  });

  test("builds one three-level score per pair with the kind in the question", () => {
    const { state, questions } = buildMatchRequest(
      [{ left: { id: "x", text: "1" }, right: { text: "2" } }],
      "beers",
    );
    const q = questions.pair0 as { instructions: string; criteria: string[] };
    expect(q.criteria).toEqual([MATCH_LEVELS.different, MATCH_LEVELS.unclear, MATCH_LEVELS.same]);
    expect(q.instructions).toContain("these beers");
    expect((state as { pairs: Record<string, unknown> }).pairs.pair0).toEqual({
      left: { id: "x", text: "1" },
      right: { id: "right0", text: "2" },
    });
  });

  test("decision is the most likely level; unclear when unanswered; summary and fail-on", async () => {
    const { ask } = fakeAsk({ pair0: level(2, 0.9), pair1: level(0, 0.7) });
    const out = await runMatch(ask, {
      pairs: [
        { left: { id: "a", text: "Acme Inc" }, right: { id: "b", text: "ACME Incorporated" } },
        { left: { id: "c", text: "Foo" }, right: { id: "d", text: "Bar" } },
        { left: { id: "e", text: "x" }, right: { id: "f", text: "y" } },
      ],
    });
    expect(out.results.map((r) => r.decision)).toEqual(["same", "different", "unclear"]);
    expect(out.results[0]).toMatchObject({
      left: "a",
      right: "b",
      score: 2,
      confidence: 0.9,
      probabilities: { different: 0.1, unclear: 0.1, same: 0.8 },
    });
    expect(out.summary).toEqual({ different: 1, unclear: 1, same: 1 });
    expect(matchFailed(out, ["same"])).toBe(true);
    expect(matchFailed(out, ["different"])).toBe(true);
    expect(matchFailed(out, [])).toBe(false);
  });

  test("more than PAIRS_PER_REQUEST pairs are sent in ordered chunks and usage is summed", async () => {
    const { ask, calls } = fakeAsk((q) => Object.fromEntries(Object.keys(q).map((k) => [k, level(2)])));
    const pairs = Array.from({ length: PAIRS_PER_REQUEST + 5 }, (_, i) => ({
      left: { id: `l${i}`, text: "x" },
      right: { id: `r${i}`, text: "x" },
    }));
    const out = await runMatch(ask, { pairs });
    expect(calls).toHaveLength(2);
    expect(Object.keys(calls[1]!.questions)).toEqual(["pair50", "pair51", "pair52", "pair53", "pair54"]);
    expect(out.results).toHaveLength(55);
    expect(out.results[54]!.left).toBe("l54");
    expect(out.usage.input_tokens).toBe(20);
    await expect(runMatch(ask, { pairs: [] })).rejects.toThrow(/At least one pair/);
  });

  test("parsePairs accepts tuples and objects", () => {
    expect(parsePairs('[["a","b"],{"left":{"id":"x","text":"1"},"right":"2"}]')).toEqual([
      { left: { text: "a" }, right: { text: "b" } },
      { left: { id: "x", text: "1" }, right: { text: "2" } },
    ]);
    expect(() => parsePairs('[["a"]]')).toThrow(/pairs\[0\]/);
    expect(() => parsePairs("{}")).toThrow(/array/);
  });
});

describe("match: result text", () => {
  test("every result carries the pair text next to the ids", async () => {
    const { ask } = fakeAsk((qs) =>
      Object.fromEntries(
        Object.keys(qs).map((k) => [
          k,
          { type: "score", score: 2, probabilities: { "0": 0, "1": 0, "2": 1 }, confidence: 0.9 },
        ]),
      ),
    );
    const out = await runMatch(ask, {
      pairs: [{ left: { text: "Acme" }, right: { id: "r9", text: "ACME Inc" } }],
    });
    expect(out.results[0]).toMatchObject({
      left: "left0",
      right: "r9",
      left_text: "Acme",
      right_text: "ACME Inc",
    });
  });
});

describe("match: cli", () => {
  // autoAnswer for score: last level most likely (0.7) -> "same" everywhere, confidence 0.7
  const h = cliHarness();

  test("--dedupe compares every pair and --fail-on same exits 2", async () => {
    const file = join(h.dir(), "items.json");
    writeFileSync(file, JSON.stringify(["Acme Inc", "ACME Incorporated", "Globex"]));
    const r = await h.run(["match", "--dedupe", `@${file}`, "--kind", "companies", "--fail-on", "same"]);
    expect(r.code).toBe(2);
    expect(r.stdout).toContain("3 same · 0 unclear · 0 different");
    expect(r.stdout).toMatch(/same\s+0\.70\s+item1: Acme Inc\s+item2: ACME Incorporated/);
    const sent = h.api().requests[0]!.body as { questions: object; state: { kind: string } };
    expect(Object.keys(sent.questions)).toHaveLength(3);
    expect(sent.state.kind).toBe("companies");
  });

  test("--left/--right cross product in JSON", async () => {
    const l = join(h.dir(), "l.json");
    const rr = join(h.dir(), "r.json");
    writeFileSync(l, JSON.stringify({ a: "x", b: "y" }));
    writeFileSync(rr, JSON.stringify(["z"]));
    const r = await h.run(["match", "--left", `@${l}`, "--right", `@${rr}`, "--json"]);
    expect(r.code).toBe(0);
    const out = JSON.parse(r.stdout);
    expect(out.results.map((x: { left: string; right: string }) => `${x.left}-${x.right}`)).toEqual([
      "a-R1",
      "b-R1",
    ]);
    expect(out.results[0].decision).toBe("same");
  });

  test("--pairs from stdin; --dry-run; usage errors", async () => {
    const d = await h.run(["match", "--pairs", "-", "--dry-run"], { stdin: '[["a","b"]]' });
    expect(JSON.parse(d.stdout).pairs).toBe(1);
    expect(h.api().requests).toHaveLength(0);
    expect((await h.run(["match"])).stderr).toMatch(/exactly one of/);
    expect((await h.run(["match", "--left", "@x"])).stderr).toMatch(/exactly one of|together/);
    expect((await h.run(["match", "--dedupe", "-"], { stdin: '["only"]' })).stderr).toMatch(/at least two/);
    const many = JSON.stringify(Array.from({ length: 21 }, (_, i) => `item ${i}`));
    expect((await h.run(["match", "--dedupe", "-"], { stdin: many })).stderr).toMatch(/exceeds the limit/);
  });
});
