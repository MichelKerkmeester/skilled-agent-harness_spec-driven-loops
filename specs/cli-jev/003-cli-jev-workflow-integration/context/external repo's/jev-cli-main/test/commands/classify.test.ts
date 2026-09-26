import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  classifyFailed,
  parseLabelJson,
  parseLabelList,
  parseTaxonomy,
  runClassify,
  runClassifyMulti,
  runClassifyTaxonomy,
} from "../../src/core/classify.js";
import { cliHarness } from "../helpers/cli.js";
import { fakeAsk, pick, yes } from "../helpers/fake-ask.js";

const two = [
  { label: "a", description: null },
  { label: "b", description: null },
];

describe("classify: core / label parsing", () => {
  test("parseLabelList handles descriptions and escaped commas", () => {
    expect(parseLabelList("a,b:desc,c\\,d")).toEqual([
      { label: "a", description: null },
      { label: "b", description: "desc" },
      { label: "c,d", description: null },
    ]);
  });

  test("parseLabelJson accepts three shapes and rejects junk", () => {
    expect(parseLabelJson(["a", "b"])).toEqual(two);
    expect(parseLabelJson([{ label: "a", description: "x" }])).toEqual([{ label: "a", description: "x" }]);
    expect(parseLabelJson({ a: "x", b: null })).toEqual([
      { label: "a", description: "x" },
      { label: "b", description: null },
    ]);
    expect(() => parseLabelJson([1])).toThrow(/labels\[0\]/);
    expect(() => parseLabelJson("x")).toThrow(/array or object/);
  });

  test("parseTaxonomy accepts nested objects and leaf arrays", () => {
    expect(parseTaxonomy({ hw: { laptop: null, phone: null }, sw: ["os", "app"] })).toEqual({
      hw: { laptop: null, phone: null },
      sw: { os: null, app: null },
    });
    expect(() => parseTaxonomy([])).toThrow(/object/);
    expect(() => parseTaxonomy({})).toThrow(/no labels/);
  });
});

describe("classify: core / single", () => {
  test("maps sanitized keys back to labels, gates on confidence, supports other", async () => {
    const { ask, calls } = fakeAsk({
      label: {
        type: "choice",
        choice: "needs_triage",
        confidence: 0.4,
        probabilities: { needs_triage: 0.5, bug: 0.3, other: 0.2 },
      },
    });
    const out = await runClassify(ask, {
      text: "t",
      labels: [
        { label: "needs triage", description: null },
        { label: "bug", description: "defect" },
      ],
      other: true,
      minConfidence: 0.6,
    });
    expect(Object.keys((calls[0]!.questions.label as { criteria: object }).criteria)).toEqual([
      "needs_triage",
      "bug",
      "other",
    ]);
    expect(out.label).toBe("needs triage");
    expect(out.action).toBe("review");
    expect(out.probabilities).toEqual({ "needs triage": 0.5, bug: 0.3, other: 0.2 });
    expect(classifyFailed(out, ["review"])).toBe(true);
    expect(classifyFailed(out, ["other"])).toBe(false);
  });

  test("other label is reported and can fail", async () => {
    const { ask } = fakeAsk({ label: pick("other") });
    const out = await runClassify(ask, { text: "t", labels: two, other: true, minConfidence: 0.6 });
    expect(out.label).toBe("other");
    expect(classifyFailed(out, ["other"])).toBe(true);
  });

  test("rejects fewer than two labels and colliding labels", async () => {
    const { ask } = fakeAsk({});
    await expect(
      runClassify(ask, { text: "t", labels: [two[0]!], other: false, minConfidence: 0.6 }),
    ).rejects.toThrow(/At least 2/);
    await expect(
      runClassify(ask, {
        text: "t",
        labels: [
          { label: "a b", description: null },
          { label: "a_b", description: null },
        ],
        other: false,
        minConfidence: 0.6,
      }),
    ).rejects.toThrow(/collide/);
  });
});

describe("classify: core / multi", () => {
  test("one noul per label, thresholded; unlabeled when nothing applies", async () => {
    const { ask, calls } = fakeAsk({ security: yes(0.9), docs: yes(0.2) });
    const out = await runClassifyMulti(ask, {
      text: "t",
      labels: [
        { label: "security", description: null },
        { label: "docs", description: null },
      ],
      threshold: 0.5,
    });
    expect(Object.keys(calls[0]!.questions)).toEqual(["security", "docs"]);
    expect(out.applied).toEqual(["security"]);
    expect(out.labels[1]).toEqual({ label: "docs", probability: 0.2, applies: false });
    expect(classifyFailed(out, ["unlabeled"])).toBe(false);

    const { ask: none } = fakeAsk({ security: yes(0.1) });
    const empty = await runClassifyMulti(none, {
      text: "t",
      labels: [{ label: "security", description: null }],
      threshold: 0.5,
    });
    expect(classifyFailed(empty, ["unlabeled"])).toBe(true);
  });
});

describe("classify: core / taxonomy", () => {
  const taxonomy = parseTaxonomy({
    hardware: { laptop: null, phone: null },
    software: { os: null, app: { mobile: null, web: null } },
  });

  test("descends greedily, one request per decided level, min confidence along the path", async () => {
    const { ask, calls } = fakeAsk((q) => {
      const keys = Object.keys((q.label as { criteria: object }).criteria);
      if (keys.includes("software")) return { label: pick("software", 0.95) };
      if (keys.includes("app")) return { label: pick("app", 0.7) };
      return { label: pick("web", 0.85) };
    });
    const out = await runClassifyTaxonomy(ask, { text: "t", taxonomy, other: false, minConfidence: 0.6 });
    expect(out.path).toEqual(["software", "app", "web"]);
    expect(calls).toHaveLength(3);
    expect(out.confidence).toBe(0.7);
    expect(out.action).toBe("auto");
    expect(out.usage).toEqual({ input_tokens: 30, output_tokens: 6 });
    expect(String((calls[1]!.questions.label as { instructions: string }).instructions)).toContain(
      'within "software"',
    );
  });

  test("stops at other and flags review", async () => {
    const { ask } = fakeAsk((q) => {
      const keys = Object.keys((q.label as { criteria: object }).criteria);
      return { label: pick(keys.includes("hardware") ? "hardware" : "other", 0.9) };
    });
    const out = await runClassifyTaxonomy(ask, { text: "t", taxonomy, other: true, minConfidence: 0.6 });
    expect(out.path).toEqual(["hardware"]);
    expect(out.stopped_at_other).toBe(true);
    expect(out.action).toBe("review");
    expect(classifyFailed(out, ["other"])).toBe(true);
  });

  test("single-child levels are taken without a request", async () => {
    const { ask, calls } = fakeAsk({ label: pick("b") });
    const out = await runClassifyTaxonomy(ask, {
      text: "t",
      taxonomy: { only: { a: null, b: null } },
      other: false,
      minConfidence: 0.6,
    });
    expect(out.path).toEqual(["only", "b"]);
    expect(calls).toHaveLength(1);
  });
});

describe("classify: cli", () => {
  // autoAnswer: choice -> first option at 0.88; noul -> 0.05 unless overridden
  const h = cliHarness({ security: yes(0.9) });

  test("single: text and json output, exit 0 when confident", async () => {
    const r = await h.run([
      "classify",
      "Login fails after update",
      "-l",
      "bug:defect,feature,question",
      "--other",
    ]);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/^bug\s+conf 0\.88\s+auto/);
    const j = await h.run(["classify", "x", "-l", "a,b", "--json"]);
    expect(JSON.parse(j.stdout)).toMatchObject({
      command: "classify",
      mode: "single",
      label: "a",
      action: "auto",
    });
  });

  test("--min-confidence above the answer flags review; --fail-on review exits 2", async () => {
    const r = await h.run([
      "classify",
      "x",
      "-l",
      "a,b",
      "--min-confidence",
      "0.95",
      "--fail-on",
      "review",
      "--json",
    ]);
    expect(r.code).toBe(2);
    expect(JSON.parse(r.stdout).action).toBe("review");
  });

  test("--multi returns per-label probabilities; --fail-on unlabeled exits 2 when nothing applies", async () => {
    const r = await h.run(["classify", "x", "--multi", "-l", "security,docs", "--json"]);
    const out = JSON.parse(r.stdout);
    expect(out.mode).toBe("multi");
    expect(out.applied).toEqual(["security"]);
    const none = await h.run(["classify", "x", "--multi", "-l", "docs,perf", "--fail-on", "unlabeled"]);
    expect(none.code).toBe(2);
    expect(none.stdout).toContain("Label");
  });

  test("--taxonomy walks levels and reports the path", async () => {
    const tax = join(h.dir(), "tax.json");
    writeFileSync(tax, JSON.stringify({ hardware: { laptop: null, phone: null }, software: ["os", "app"] }));
    const r = await h.run(["classify", "x", "-t", `@${tax}`, "--json"]);
    const out = JSON.parse(r.stdout);
    expect(out.mode).toBe("taxonomy");
    expect(out.path).toEqual(["hardware", "laptop"]);
    expect(h.api().requests).toHaveLength(2);
  });

  test("--dry-run shows the single-mode request", async () => {
    const r = await h.run(["classify", "x", "-l", "a,b:desc", "--other", "--dry-run"]);
    expect(JSON.parse(r.stdout).questions.label.criteria).toEqual({
      a: null,
      b: "desc",
      other: "None of the other labels fits",
    });
    expect(h.api().requests).toHaveLength(0);
  });

  test("usage errors", async () => {
    expect((await h.run(["classify", "x"])).stderr).toMatch(/exactly one of/);
    expect((await h.run(["classify", "x", "-l", "only"])).stderr).toMatch(/at least two/);
    expect((await h.run(["classify", "x", "-l", "a,b", "--multi", "-t", "@x"])).stderr).toMatch(
      /exactly one of/,
    );
    expect((await h.run(["classify", "x", "-l", "a,b", "--fail-on", "none"])).code).toBe(0);
  });
});
