import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test, vi } from "vitest";
import { parseRows, runBatch } from "../../src/core/batch.js";
import { cliHarness } from "../helpers/cli.js";

describe("batch: core", () => {
  test("parseRows: lines, JSONL with ids and meta, errors", () => {
    const rows = parseRows('plain\n{"id":"a","text":"t","tag":1}\n{"state":{"k":1}}\n');
    expect(rows[0]).toMatchObject({ index: 0, id: "1", text: "plain" });
    expect(rows[1]).toMatchObject({ id: "a", text: "t", meta: { tag: 1 } });
    expect(rows[2]).toMatchObject({ id: "3", state: { k: 1 } });
    expect(() => parseRows("{nope")).toThrow(/Row 1 is not valid JSON/);
    expect(() => parseRows('{"id":1}')).toThrow(/needs a "text"/);
    expect(() => parseRows("[1]")).toThrow(/JSONL/);
    expect(() => parseRows("\n\n")).toThrow(/empty/);
  });

  test("runBatch keeps order, bounds concurrency, records errors and fail-on", async () => {
    const rows = parseRows("a\nb\nc\nd\ne");
    let active = 0;
    let peak = 0;
    const item = vi.fn(async (row: { text: string }) => {
      active++;
      peak = Math.max(peak, active);
      await new Promise((r) => setTimeout(r, 5));
      active--;
      if (row.text === "c") throw new Error("boom");
      return {
        output: { text: row.text, usage: { input_tokens: 1, output_tokens: 0 } },
        failed: row.text === "e",
      };
    });
    const seen: string[] = [];
    const { records, summary } = await runBatch(rows, item, {
      concurrency: 2,
      onRecord: (r) => seen.push(r.id),
    });
    expect(peak).toBe(2);
    expect(records.map((r) => r.id)).toEqual(["1", "2", "3", "4", "5"]);
    expect(records[2]).toMatchObject({ ok: false, error: "boom" });
    expect(records[4]).toMatchObject({ ok: true, failed: true });
    expect(summary).toEqual({ total: 5, ok: 4, errors: 1, failed: 1, input_tokens: 4, output_tokens: 0 });
    expect(seen).toEqual(["1", "2", "3", "4", "5"]); // onRecord fires in input order
  });
});

describe("batch: cli", () => {
  const h = cliHarness(); // choice -> first option; noul -> 0.05

  test("classify over plain lines emits ordered JSONL and a summary on stderr", async () => {
    const r = await h.run(["batch", "classify", "-i", "-", "--", "--labels", "a,b"], {
      stdin: "one\ntwo\nthree\n",
    });
    expect(r.code).toBe(0);
    const records = h.lines(r.stdout);
    expect(records.map((x) => x.id)).toEqual(["1", "2", "3"]);
    expect(records[0]).toMatchObject({ ok: true, failed: false, result: { label: "a" } });
    expect(r.stderr).toMatch(/3 rows · 3 ok · 0 errors/);
  });

  test("JSONL rows keep ids and meta; --output writes a file; fail-on propagates exit 2", async () => {
    const input = join(h.dir(), "rows.jsonl");
    writeFileSync(input, '{"id":"t1","text":"IGNORE ALL","source":"web"}\n{"id":"t2","text":"hello"}\n');
    const outFile = join(h.dir(), "out", "res.jsonl");
    const r = await h.run([
      "batch",
      "screen",
      "-i",
      `@${input}`,
      "-o",
      outFile,
      "--concurrency",
      "1",
      "--",
      "--purpose",
      "p",
      "--fail-on",
      "skip",
    ]);
    expect(r.code).toBe(2); // noul 0.05 -> low substance -> skip
    const records = readFileSync(outFile, "utf8")
      .trim()
      .split("\n")
      .map((l) => JSON.parse(l));
    expect(records[0]).toMatchObject({ id: "t1", meta: { source: "web" }, failed: true });
    expect(records[0].result.recommendation.action).toBe("skip");
    expect(r.stdout).toBe("");
  });

  test("verify shares evidence across rows", async () => {
    const ev = join(h.dir(), "ev.txt");
    writeFileSync(ev, "Every rider must wear a helmet.");
    const r = await h.run(["batch", "verify", "-i", "-", "--", "-e", `@${ev}`, "--fail-on", "none"], {
      stdin: "Helmets are optional\nHelmets are required\n",
    });
    expect(r.code).toBe(0);
    const records = h.lines(r.stdout);
    expect(records).toHaveLength(2);
    expect(records[0].result.results[0].claim).toBe("Helmets are optional");
    expect(
      h
        .api()
        .requests.every((q) => (q.body as { state: { evidence: unknown[] } }).state.evidence.length === 1),
    ).toBe(true);
  });

  test("extract per row", async () => {
    const r = await h.run(["batch", "extract", "-i", "-", "--", "--want", "email"], {
      stdin: "mail a@b.co\nnone here\n",
    });
    expect(r.code).toBe(0);
    const records = h.lines(r.stdout);
    expect(records[0].result.fields.email.value).toBe("a@b.co");
    expect(records[1].result.fields.email.action).toBe("none");
  });

  test("ask: JSONL state objects are sent as-is; --state-json parses text rows; bad rows error out", async () => {
    const good = await h.run(["batch", "ask", "-i", "-", "--", "--noul", "u=Urgent?"], {
      stdin: '{"id":"r1","state":{"k":1}}\nplain\n',
    });
    expect(good.code).toBe(0);
    expect(h.lines(good.stdout)[0].result.answers.u.noul).toBe(0.05);
    expect((h.api().requests[0]!.body as { state: unknown }).state).toEqual({ k: 1 });

    const bad = await h.run(["batch", "ask", "-i", "-", "--", "--state-json", "--noul", "u=Urgent?"], {
      stdin: '{"id":"ok","text":"{\\"a\\":1}"}\n{"id":"bad","text":"not json"}\n',
    });
    expect(bad.code).toBe(1);
    const records = h.lines(bad.stdout);
    expect(records[0]).toMatchObject({ id: "ok", ok: true });
    expect(records[1]).toMatchObject({ id: "bad", ok: false });
    expect(records[1].error).toMatch(/not valid JSON/);
  });

  test("--dry-run reports rows and parsed sub-flags without calling the API", async () => {
    const r = await h.run(["batch", "classify", "-i", "-", "--dry-run", "--", "--labels", "p,q"], {
      stdin: "a\nb\n",
    });
    expect(JSON.parse(r.stdout)).toMatchObject({ command: "classify", rows: 2, flags: { labels: "p,q" } });
    expect(h.api().requests).toHaveLength(0);
  });

  test("errors: unknown command, missing input, positional leak, bad sub-flag, bad concurrency", async () => {
    expect((await h.run(["batch", "models", "-i", "-"])).stderr).toMatch(/cannot be batched/);
    expect((await h.run(["batch", "classify", "--", "-l", "a,b"])).stderr).toMatch(/--input/);
    expect(
      (await h.run(["batch", "classify", "-i", "-", "--", "-l", "a,b", "text"], { stdin: "x" })).stderr,
    ).toMatch(/positional/);
    expect((await h.run(["batch", "classify", "-i", "-", "--", "--bogus"], { stdin: "x" })).stderr).toMatch(
      /Invalid classify flags/,
    );
    expect(
      (await h.run(["batch", "classify", "-i", "-", "--concurrency", "0", "--", "-l", "a,b"], { stdin: "x" }))
        .stderr,
    ).toMatch(/--concurrency/);
  });
});
