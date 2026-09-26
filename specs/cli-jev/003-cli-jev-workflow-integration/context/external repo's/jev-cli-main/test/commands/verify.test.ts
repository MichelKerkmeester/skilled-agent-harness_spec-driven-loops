import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { buildVerifyRequest, runVerify, verifyFailed } from "../../src/core/verify.js";
import { cliHarness } from "../helpers/cli.js";
import { fakeAsk, pick, USAGE } from "../helpers/fake-ask.js";

describe("verify: core", () => {
  test("builds one relation question per claim and source questions with multiple evidence", () => {
    const single = buildVerifyRequest({ claims: ["a", "b"], evidence: [{ text: "e" }] });
    expect(Object.keys(single.questions)).toEqual(["relation_claim0", "relation_claim1"]);

    const multi = buildVerifyRequest({
      claims: ["a"],
      evidence: [
        { id: "spec.md", text: "e1" },
        { id: "rfc/4.txt", text: "e2" },
      ],
    });
    expect(Object.keys(multi.questions)).toEqual(["relation_claim0", "source_claim0"]);
    const source = multi.questions.source_claim0 as { criteria: Record<string, unknown> };
    expect(Object.keys(source.criteria)).toEqual(["spec.md", "rfc_4.txt", "none"]);
  });

  test("rejects empty inputs", () => {
    expect(() => buildVerifyRequest({ claims: [], evidence: [{ text: "e" }] })).toThrow(/claim/);
    expect(() => buildVerifyRequest({ claims: ["a"], evidence: [] })).toThrow(/evidence/);
  });

  test("maps answers to verdicts, actions, and the original evidence id", async () => {
    const { ask } = fakeAsk({
      relation_claim0: pick("contradicts", 0.97),
      source_claim0: pick("rfc_4.txt"),
      relation_claim1: pick("supports", 0.5),
      source_claim1: pick("none"),
    });
    const out = await runVerify(ask, {
      claims: ["x", "y"],
      evidence: [
        { id: "spec.md", text: "e1" },
        { id: "rfc/4.txt", text: "e2" },
      ],
      autoAccept: 0.8,
    });
    expect(out.results[0]).toMatchObject({
      verdict: "contradicted",
      action: "auto",
      supporting_evidence: "rfc/4.txt",
    });
    expect(out.results[1]).toMatchObject({
      verdict: "verified",
      action: "review",
      supporting_evidence: null,
    });
    expect(out.summary).toEqual({ verified: 1, contradicted: 1, unsupported: 0, needs_review: 1 });
    expect(out.usage).toEqual(USAGE);
    expect(verifyFailed(out, ["contradicted"])).toBe(true);
    expect(verifyFailed(out, ["unsupported"])).toBe(false);
    expect(verifyFailed(out, ["review"])).toBe(true);
    expect(verifyFailed(out, [])).toBe(false);
  });

  test("missing answers become unknown + review", async () => {
    const { ask } = fakeAsk({});
    const out = await runVerify(ask, { claims: ["x"], evidence: [{ text: "e" }], autoAccept: 0.8 });
    expect(out.results[0]).toMatchObject({ verdict: "unknown", action: "review", confidence: null });
    expect(verifyFailed(out, ["unknown"])).toBe(true);
  });
});

describe("verify: cli", () => {
  const h = cliHarness({
    relation_claim0: {
      type: "choice",
      choice: "contradicts",
      probabilities: { contradicts: 0.96, supports: 0.02, says_nothing: 0.02 },
      confidence: 0.95,
    },
    relation_claim1: {
      type: "choice",
      choice: "supports",
      probabilities: { supports: 0.55, says_nothing: 0.4, contradicts: 0.05 },
      confidence: 0.4,
    },
  });

  test("text output; default --fail-on contradicted exits 2", async () => {
    const r = await h.run([
      "verify",
      "Helmets are optional",
      "Reflective gear is mentioned",
      "-e",
      "Every rider must wear a helmet.",
    ]);
    expect(r.code).toBe(2);
    expect(r.stdout).toContain("contradicted");
    expect(r.stdout).toContain("1 verified · 1 contradicted");
    expect(r.stdout).toContain("via typesafe");
    expect(h.api().requests[0]!.body).toMatchObject({ model: "jev-latest" });
  });

  test("--json, --fail-on none, evidence files carry ids, claims from stdin", async () => {
    const spec = join(h.dir(), "spec.md");
    writeFileSync(spec, "Every rider must wear a helmet.");
    const rfc = join(h.dir(), "rfc.txt");
    writeFileSync(rfc, "Riders under 18 must wear reflective gear.");
    const r = await h.run(
      ["verify", "--claims", "-", "-e", `@${spec}`, "-e", `@${rfc}`, "--fail-on", "none", "--json"],
      {
        stdin: "Helmets are optional\nReflective gear is mentioned\n",
      },
    );
    expect(r.code).toBe(0);
    const out = JSON.parse(r.stdout);
    expect(out.command).toBe("verify");
    expect(out.results).toHaveLength(2);
    expect(out.results[0].verdict).toBe("contradicted");
    expect(out.results[1].action).toBe("review");
    expect(out.usage).toEqual({ input_tokens: 42, output_tokens: 7 });
    const sent = h.api().requests[0]!.body as {
      state: { evidence: Array<{ id: string }> };
      questions: object;
    };
    expect(sent.state.evidence.map((e) => e.id)).toEqual(["spec.md", "rfc.txt"]);
    expect(Object.keys(sent.questions)).toContain("source_claim0");
  });

  test("--fail-on review exits 2 on low confidence; missing evidence is a usage error", async () => {
    expect((await h.run(["verify", "a", "b", "-e", "e", "--fail-on", "review"])).code).toBe(2);
    const missing = await h.run(["verify", "a"]);
    expect(missing.code).toBe(1);
    expect(missing.stderr).toMatch(/Provide evidence/);
  });

  test("--dry-run prints the request without calling the API", async () => {
    const r = await h.run(["verify", "a", "-e", "e", "--dry-run"]);
    expect(r.code).toBe(0);
    expect(Object.keys(JSON.parse(r.stdout).questions)).toEqual(["relation_claim0"]);
    expect(h.api().requests).toHaveLength(0);
  });
});
