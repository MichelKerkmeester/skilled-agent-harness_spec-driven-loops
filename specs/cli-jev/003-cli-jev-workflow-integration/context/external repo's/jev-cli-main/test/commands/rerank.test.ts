import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { buildRerankRequest, rerankFailed, runRerank } from "../../src/core/rerank.js";
import { cliHarness } from "../helpers/cli.js";
import { fakeAsk, yes } from "../helpers/fake-ask.js";

describe("rerank: core", () => {
  test("one noul per candidate over a {query, candidates} state; custom criteria wording", () => {
    const { questions, state } = buildRerankRequest({
      query: "q",
      candidates: [{ id: "a/b", text: "x" }, { text: "y" }],
      criteria: "a passage stating the rule",
    });
    expect(Object.keys(questions)).toEqual(["a_b", "candidate1"]);
    expect(String((questions.a_b as { instructions: string }).instructions)).toContain(
      "a passage stating the rule",
    );
    expect(state).toEqual({ query: "q", candidates: { a_b: "x", candidate1: "y" } });
    expect(() => buildRerankRequest({ query: " ", candidates: [{ text: "x" }] })).toThrow(/Query/);
    expect(() => buildRerankRequest({ query: "q", candidates: [] })).toThrow(/candidate/);
  });

  test("sorts by relevance, keeps ties in input order, applies min and topK, restores ids", async () => {
    const { ask } = fakeAsk({ a: yes(0.2), b_c: yes(0.9), d: yes(0.9), e: yes(0.55) });
    const out = await runRerank(ask, {
      query: "q",
      candidates: [
        { id: "a", text: "1" },
        { id: "b/c", text: "2" },
        { id: "d", text: "3" },
        { id: "e", text: "4" },
      ],
      topK: 3,
      min: 0.6,
    });
    expect(out.ranked.map((h) => [h.id, h.relevance, h.kept])).toEqual([
      ["b/c", 0.9, true],
      ["d", 0.9, true],
      ["e", 0.55, false],
    ]);
    expect(out.kept).toEqual(["b/c", "d"]);
    expect(rerankFailed(out, ["empty"])).toBe(false);
  });

  test("nothing above min is empty; missing answers score 0", async () => {
    const { ask } = fakeAsk({ a: yes(0.1) });
    const out = await runRerank(ask, {
      query: "q",
      candidates: [
        { id: "a", text: "1" },
        { id: "b", text: "2" },
      ],
      topK: 10,
      min: 0.5,
    });
    expect(out.ranked.map((h) => h.relevance)).toEqual([0.1, 0]);
    expect(rerankFailed(out, ["empty"])).toBe(true);
  });
});

describe("rerank: cli", () => {
  // noul defaults to 0.05; override two candidate ids
  const h = cliHarness({ auth: yes(0.95), billing: yes(0.6) });

  test("--candidates map: table output marks keep/drop and honors --min", async () => {
    const file = join(h.dir(), "c.json");
    writeFileSync(file, JSON.stringify({ billing: "Invoices", auth: "Rotate keys", support: "Contact" }));
    const r = await h.run(["rerank", "rotate api keys", "-c", `@${file}`, "--min", "0.7"]);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/^1 of 3 shown are relevant \(min 0\.7\)/);
    expect(r.stdout).toMatch(/^1\s+0\.95\s+keep\s+auth/m);
    expect(r.stdout).toMatch(/^3\s+0\.05\s+drop\s+support/m);
  });

  test("--json returns ranked and kept; --fail-on empty exits 2", async () => {
    const r = await h.run(["rerank", "q", "--lines", "-", "--fail-on", "empty", "--json"], {
      stdin: "one\ntwo\n",
    });
    expect(r.code).toBe(2);
    const out = JSON.parse(r.stdout);
    expect(out.command).toBe("rerank");
    expect(out.kept).toEqual([]);
    expect(out.ranked.map((x: { id: string }) => x.id)).toEqual(["L1", "L2"]);
  });

  test("--dry-run and usage errors", async () => {
    const d = await h.run(["rerank", "q", "--lines", "-", "--dry-run"], { stdin: "a\n" });
    expect(Object.keys(JSON.parse(d.stdout).questions)).toEqual(["L1"]);
    expect(h.api().requests).toHaveLength(0);
    expect((await h.run(["rerank", "q"])).stderr).toMatch(/Provide candidates/);
    expect((await h.run(["rerank", "q", "--lines", "-", "-k", "0"], { stdin: "a" })).stderr).toMatch(
      /--top-k/,
    );
  });

  test("batchable: each row is a query against shared candidates", async () => {
    const file = join(h.dir(), "c.json");
    writeFileSync(file, JSON.stringify({ billing: "Invoices", auth: "Rotate keys" }));
    const r = await h.run(["batch", "rerank", "-i", "-", "--", "-c", `@${file}`], {
      stdin: "keys\ninvoices\n",
    });
    expect(r.code).toBe(0);
    const recs = h.lines(r.stdout);
    expect(recs).toHaveLength(2);
    expect(recs[0].result.query).toBe("keys");
    expect(recs[0].result.kept).toEqual(["auth", "billing"]);
  });
});
