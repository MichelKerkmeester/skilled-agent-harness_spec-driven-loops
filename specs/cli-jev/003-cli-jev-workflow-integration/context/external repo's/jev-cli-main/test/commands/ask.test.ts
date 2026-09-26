import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  parseQuestions,
  questionsFromFlags,
  runAsk,
  splitOptions,
  splitShorthand,
} from "../../src/core/ask.js";
import { cliHarness } from "../helpers/cli.js";
import { fakeAsk, yes } from "../helpers/fake-ask.js";

describe("ask: core", () => {
  test("splitShorthand and splitOptions", () => {
    expect(splitShorthand("urgent=Is it urgent?", "q1")).toEqual({
      id: "urgent",
      instructions: "Is it urgent?",
    });
    expect(splitShorthand("Is it urgent?", "q1")).toEqual({ id: "q1", instructions: "Is it urgent?" });
    expect(() => splitShorthand("bad id=x", "q1")).toThrow(/Question id/);
    expect(splitOptions("Which team?|billing:refunds and invoices,tech,sales:new accounts")).toEqual({
      instructions: "Which team?",
      options: [
        { label: "billing", description: "refunds and invoices" },
        { label: "tech", description: null },
        { label: "sales", description: "new accounts" },
      ],
    });
    expect(splitOptions("A \\| B?|x,y\\,z").options.map((o) => o.label)).toEqual(["x", "y,z"]);
    expect(() => splitOptions("no options")).toThrow(/Missing options/);
  });

  test("questionsFromFlags rejects a question id used twice", () => {
    expect(() => questionsFromFlags({ noul: ["a=q1", "a=q2"] })).toThrow(/"a" is used twice/);
  });

  test("questionsFromFlags builds all three primitives", () => {
    const q = questionsFromFlags({
      noul: ["urgent=Is it urgent?"],
      choice: ["team=Which team?|billing:refunds,tech"],
      score: ["tone=How harsh?|gentle,direct,harsh:hostile"],
    });
    expect(q.urgent).toEqual({ type: "noul", instructions: "Is it urgent?" });
    expect(q.team).toEqual({
      type: "choice",
      instructions: "Which team?",
      criteria: { billing: "refunds", tech: null },
    });
    expect(q.tone).toEqual({
      type: "score",
      instructions: "How harsh?",
      criteria: ["gentle", "direct", "harsh: hostile"],
    });
    expect(() => questionsFromFlags({ choice: ["x=Q?|only"] })).toThrow(/at least two options/);
    expect(() => questionsFromFlags({})).toThrow(/At least one question/);
  });

  test("parseQuestions validates the API shape", () => {
    expect(parseQuestions({ a: { type: "noul", instructions: "x" } })).toBeTruthy();
    expect(() => parseQuestions({ a: { type: "score", criteria: ["one"] } })).toThrow(/Invalid questions/);
    expect(() => parseQuestions({ a: { type: "bogus" } })).toThrow(/Invalid questions/);
  });

  test("runAsk passes state and questions straight through", async () => {
    const { ask, calls } = fakeAsk({ a: yes(0.5) });
    const questions = parseQuestions({ a: { type: "noul", instructions: "x" } });
    const out = await runAsk(ask, { state: { k: 1 }, questions });
    expect(calls[0]).toEqual({ state: { k: 1 }, questions });
    expect(out.answers).toEqual({ a: yes(0.5) });
    expect(out.model).toBe("jev-1.13.0");
  });
});

describe("ask: cli", () => {
  const h = cliHarness();

  test("shorthand flags produce typed answers in text mode", async () => {
    const r = await h.run([
      "ask",
      "I was charged twice",
      "--noul",
      "urgent=Is it urgent?",
      "--choice",
      "team=Which team?|billing:refunds,tech",
      "--score",
      "tone=Tone?|calm,angry",
    ]);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/urgent: 0\.05/);
    expect(r.stdout).toMatch(/team: billing\s+conf 0\.88/);
    expect(r.stdout).toMatch(/tone: 0\.70/);
  });

  test("--questions JSON with --state-json passes structured state through", async () => {
    const q = join(h.dir(), "q.json");
    writeFileSync(q, JSON.stringify({ ok: { type: "noul", instructions: "Is it ok?" } }));
    const r = await h.run(["ask", "--state-json", "--questions", `@${q}`, "--json"], { stdin: '{"a":1}' });
    expect(r.code).toBe(0);
    expect(JSON.parse(r.stdout).answers.ok.noul).toBe(0.05);
    expect(h.api().requests[0]!.body).toMatchObject({ state: { a: 1 } });
  });

  test("-Q is reachable: the short form of --questions survives the root option table", async () => {
    const q = join(h.dir(), "q.json");
    writeFileSync(q, JSON.stringify({ ok: { type: "noul", instructions: "Is it ok?" } }));
    const r = await h.run(["ask", "I was charged twice", "-Q", `@${q}`, "--json"]);
    expect(r.code).toBe(0);
    expect(JSON.parse(r.stdout).answers.ok.noul).toBe(0.05);
  });

  test("mixing --questions and shorthands, or providing neither, is an error", async () => {
    const both = await h.run(["ask", "s", "--questions", "@x.json", "--noul", "a=b"]);
    expect(both.code).toBe(1);
    expect(both.stderr).toMatch(/not both/);
    const neither = await h.run(["ask", "s"]);
    expect(neither.code).toBe(1);
    expect(neither.stderr).toMatch(/Provide questions/);
  });
});
