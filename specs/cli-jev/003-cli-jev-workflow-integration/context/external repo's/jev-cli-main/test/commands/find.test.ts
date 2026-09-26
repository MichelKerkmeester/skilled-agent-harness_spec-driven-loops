import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { buildFindRequest, findFailed, runFind } from "../../src/core/find.js";
import { cliHarness } from "../helpers/cli.js";
import { autoAnswer, startFakeApi } from "../helpers/fake-api.js";
import { fakeAsk, pick, yes } from "../helpers/fake-ask.js";

describe("find: core", () => {
  test("builds a Choice over candidate ids plus an exists Noul, truncating long text", () => {
    const { questions, candidates } = buildFindRequest({
      query: "q",
      candidates: [{ id: "a/b.md", text: "x".repeat(5000) }, { text: "short" }],
    });
    expect(Object.keys(questions)).toEqual(["best", "exists"]);
    expect(Object.keys((questions.best as { criteria: object }).criteria)).toEqual(["a_b.md", "candidate1"]);
    expect(candidates[0]!.text).toMatch(/truncated\]$/);
  });

  test("rejects empty and oversized inputs", () => {
    expect(() => buildFindRequest({ query: "", candidates: [{ text: "a" }] })).toThrow(/Query/);
    expect(() => buildFindRequest({ query: "q", candidates: [] })).toThrow(/candidate/);
    const many = Array.from({ length: 251 }, (_, i) => ({ text: `c${i}` }));
    expect(() => buildFindRequest({ query: "q", candidates: many })).toThrow(/Too many/);
  });

  test("ranks, restores original ids, and reports the exists verdict", async () => {
    const { ask } = fakeAsk({
      best: {
        type: "choice",
        choice: "auth",
        probabilities: { billing: 0.01, auth: 0.98, support: 0.01 },
        confidence: 0.97,
      },
      exists: yes(0.95),
    });
    const out = await runFind(ask, {
      query: "rotate keys",
      candidates: [
        { id: "billing", text: "b" },
        { id: "auth", text: "a" },
        { id: "support/faq", text: "s" },
      ],
      topK: 2,
      found: 0.7,
      absent: 0.35,
    });
    expect(out.top.map((x) => x.id)).toEqual(["auth", "billing"]);
    expect(out.exists_verdict).toBe("answered");
    expect(findFailed(out, ["absent"])).toBe(false);

    const { ask: none } = fakeAsk({ best: pick("support_faq", 1), exists: yes(0.1) });
    const miss = await runFind(none, {
      query: "q",
      candidates: [{ id: "support/faq", text: "s" }],
      topK: 5,
      found: 0.7,
      absent: 0.35,
    });
    expect(miss.top[0]!.id).toBe("support/faq");
    expect(miss.exists_verdict).toBe("absent");
    expect(findFailed(miss, ["absent"])).toBe(true);
  });
});

describe("find: core thresholds", () => {
  test("rejects --absent above --found", async () => {
    const { ask } = fakeAsk({ best: pick("a"), exists: yes(0.5) });
    await expect(
      runFind(ask, { query: "q", candidates: [{ id: "a", text: "t" }], topK: 1, found: 0.3, absent: 0.7 }),
    ).rejects.toThrow(/--absent \(0.7\) must not exceed --found \(0.3\)/);
  });
});

describe("find: cli", () => {
  const h = cliHarness({
    best: {
      type: "choice",
      choice: "auth",
      probabilities: { billing: 0.02, auth: 0.97, support: 0.01 },
      confidence: 0.96,
    },
    exists: yes(0.93),
  });

  test("--files: ids are the paths given, exists verdict shown", async () => {
    const d = h.dir();
    for (const [name, text] of [
      ["billing", "Invoices monthly."],
      ["auth", "Rotate keys in Settings."],
      ["support", "Contact support."],
    ] as const) {
      writeFileSync(join(d, name), text);
    }
    const r = await h.run([
      "find",
      "rotate api keys",
      "--files",
      join(d, "billing"),
      join(d, "auth"),
      join(d, "support"),
      "-k",
      "2",
      "--json",
    ]);
    expect(r.code).toBe(0);
    const out = JSON.parse(r.stdout);
    expect(out.command).toBe("find");
    expect(out.top).toHaveLength(2);
    expect(out.exists_verdict).toBe("answered");
    expect(out.top.every((x: { id: string }) => x.id.startsWith(d))).toBe(true);
    const sent = h.api().requests[0]!.body as { state: { candidates: Array<{ text: string }> } };
    expect(sent.state.candidates).toHaveLength(3);
    expect(sent.state.candidates[0]!.text).toBe("Invoices monthly.");
  });

  test("--candidates JSON map preserves ids and ranks them", async () => {
    const file = join(h.dir(), "c.json");
    writeFileSync(file, JSON.stringify({ billing: "Invoices", auth: "Rotate keys", support: "Contact" }));
    const r = await h.run(["find", "rotate api keys", "-c", `@${file}`]);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/answered/);
    expect(r.stdout.split("\n").find((l) => l.startsWith("1 "))).toContain("auth");
  });

  test("--lines ids are source line numbers, blank lines counted; --fail-on absent exits 2", async () => {
    const absentApi = await startFakeApi(autoAnswer({ exists: yes(0.05) }));
    try {
      const r = await h.run(["find", "q", "--lines", "-", "--fail-on", "absent", "--json"], {
        env: { TYPESAFE_BASE_URL: absentApi.url },
        stdin: "first line\n\nsecond line\n",
      });
      expect(r.code).toBe(2);
      const out = JSON.parse(r.stdout);
      expect(out.exists_verdict).toBe("absent");
      expect(out.top.map((x: { id: string }) => x.id)).toEqual(["L1", "L3"]);
    } finally {
      await absentApi.close();
    }
  });

  test("batchable: rows are queries against shared candidates", async () => {
    const file = join(h.dir(), "c.json");
    writeFileSync(file, JSON.stringify({ billing: "Invoices", auth: "Rotate keys", support: "Contact" }));
    const r = await h.run(["batch", "find", "-i", "-", "--", "-c", `@${file}`, "-k", "1"], {
      stdin: "keys\ninvoices\n",
    });
    expect(r.code).toBe(0);
    const recs = h.lines(r.stdout);
    expect(recs.map((x) => x.result.query)).toEqual(["keys", "invoices"]);
    expect(recs[0].result.top[0].id).toBe("auth");
    const leak = await h.run(["batch", "find", "-i", "-", "--", "-c", `@${file}`, "extra"], { stdin: "q" });
    expect(leak.stderr).toMatch(/positional/);
  });

  test("no candidates is a usage error", async () => {
    const r = await h.run(["find", "q"]);
    expect(r.code).toBe(1);
    expect(r.stderr).toMatch(/Provide candidates/);
  });
});
