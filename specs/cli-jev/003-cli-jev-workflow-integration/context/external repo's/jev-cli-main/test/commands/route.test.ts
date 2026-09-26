import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  buildRouteRequest,
  parseHandlerList,
  parseHandlers,
  routeFailed,
  runRoute,
} from "../../src/core/route.js";
import { cliHarness } from "../helpers/cli.js";
import { fakeAsk, pick, yes } from "../helpers/fake-ask.js";

const handlers = parseHandlers({
  refund: {
    description: "give money back",
    args: {
      scope: { type: "choice", options: { full: "entire order", partial: "some items" } },
      urgent: { type: "noul", instructions: "does the customer need this immediately?" },
      anger: { type: "score", levels: ["calm", "annoyed", "furious"] },
    },
  },
  cancel: "stop an order",
  support: null,
});

describe("route: core", () => {
  test("parseHandlers accepts three shapes, rejects reserved and bad names", () => {
    expect(handlers.cancel).toEqual({ description: "stop an order", args: {} });
    expect(handlers.support).toEqual({ description: null, args: {} });
    expect(Object.keys(handlers.refund!.args)).toEqual(["scope", "urgent", "anger"]);
    expect(() => parseHandlers({ none: "x" })).toThrow(/reserved/);
    expect(() => parseHandlers({ "bad name": "x" })).toThrow(/Handler name/);
    expect(() => parseHandlers({ a: { args: { x: { type: "choice", options: ["only"] } } } })).toThrow(
      /Invalid handlers/,
    );
    expect(() => parseHandlers({})).toThrow(/At least one/);
    expect(parseHandlerList("refund:money back,cancel,support:else")).toEqual({
      refund: { description: "money back", args: {} },
      cancel: { description: null, args: {} },
      support: { description: "else", args: {} },
    });
  });

  test("one handler Choice with a none option plus speculative arg questions for every handler", () => {
    const { questions } = buildRouteRequest({ request: "r", handlers });
    expect(Object.keys(questions)).toEqual([
      "handler",
      "arg__refund__scope",
      "arg__refund__urgent",
      "arg__refund__anger",
    ]);
    const h = questions.handler as { criteria: Record<string, unknown> };
    expect(Object.keys(h.criteria)).toEqual(["refund", "cancel", "support", "none"]);
    const scope = questions.arg__refund__scope as { instructions: string; criteria: Record<string, unknown> };
    expect(scope.instructions).toMatch(/^Assuming the request should be handled by `refund`/);
    expect(Object.keys(scope.criteria)).toEqual(["full", "partial", "unspecified"]);
  });

  test("returns only the chosen handler's args, typed; gates on confidence", async () => {
    const { ask } = fakeAsk({
      handler: pick("refund", 0.9),
      arg__refund__scope: pick("partial", 0.85),
      arg__refund__urgent: yes(0.7),
      arg__refund__anger: {
        type: "score",
        score: 1.4,
        confidence: 0.6,
        probabilities: { "0": 0.2, "1": 0.5, "2": 0.3 },
      },
    });
    const out = await runRoute(ask, { request: "r", handlers, minConfidence: 0.6 });
    expect(out).toMatchObject({ handler: "refund", action: "auto", confidence: 0.9 });
    expect(out.args.scope).toMatchObject({ type: "choice", value: "partial", confidence: 0.85 });
    expect(out.args.urgent).toEqual({ type: "noul", value: "yes", probability: 0.7 });
    expect(out.args.anger).toMatchObject({ type: "score", value: 1.4, confidence: 0.6 });
    expect(routeFailed(out, ["review"])).toBe(false);
  });

  test("unspecified choice arg is null; low confidence is review; none handler is unrouted", async () => {
    const { ask } = fakeAsk({ handler: pick("refund", 0.4), arg__refund__scope: pick("unspecified") });
    const out = await runRoute(ask, { request: "r", handlers, minConfidence: 0.6 });
    expect(out.action).toBe("review");
    expect(out.args.scope!.value).toBeNull();
    expect(out.args.urgent).toEqual({ type: "noul", value: null, probability: undefined });
    expect(routeFailed(out, ["review"])).toBe(true);

    const { ask: none } = fakeAsk({ handler: pick("none", 0.95) });
    const un = await runRoute(none, { request: "r", handlers, minConfidence: 0.6 });
    expect(un).toMatchObject({ handler: null, action: "none", args: {} });
    expect(routeFailed(un, ["unrouted"])).toBe(true);
  });
});

describe("route: cli", () => {
  // choice -> first option at 0.88
  const h = cliHarness();

  test("-H shorthand: text output shows the handler and distribution", async () => {
    const r = await h.run([
      "route",
      "cancel my order and refund me",
      "-H",
      "refund:money back,cancel:stop an order,support",
    ]);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/^refund\s+conf 0\.88\s+auto/);
    expect(r.stdout).toContain("none 0.");
  });

  test("--handlers-json with args: only the chosen handler's args come back", async () => {
    const file = join(h.dir(), "handlers.json");
    writeFileSync(
      file,
      JSON.stringify({
        refund: {
          description: "money back",
          args: { scope: { type: "choice", options: ["full", "partial"] } },
        },
        cancel: null,
      }),
    );
    const r = await h.run(["route", "refund everything", "--handlers-json", `@${file}`, "--json"]);
    expect(r.code).toBe(0);
    const out = JSON.parse(r.stdout);
    expect(out.handler).toBe("refund");
    expect(out.args.scope).toMatchObject({ type: "choice", value: "full" });
    expect(Object.keys((h.api().requests[0]!.body as { questions: object }).questions)).toEqual([
      "handler",
      "arg__refund__scope",
    ]);
  });

  test("--fail-on review exits 2 under a strict --min-confidence; --dry-run; usage errors", async () => {
    expect(
      (await h.run(["route", "x", "-H", "a,b", "--min-confidence", "0.95", "--fail-on", "review"])).code,
    ).toBe(2);
    const d = await h.run(["route", "x", "-H", "a:one,b", "--dry-run"]);
    expect(JSON.parse(d.stdout).questions.handler.criteria).toEqual({
      a: "one",
      b: null,
      none: "None of the handlers applies to this request",
    });
    expect((await h.run(["route", "x"])).stderr).toMatch(/exactly one of/);
    expect((await h.run(["route", "x", "-H", "none:x"])).stderr).toMatch(/reserved/);
  });

  test("batchable: rows are requests, handlers shared", async () => {
    const r = await h.run(["batch", "route", "-i", "-", "--", "-H", "a,b"], { stdin: "one\ntwo\n" });
    expect(r.code).toBe(0);
    expect(h.lines(r.stdout).map((x) => x.result.handler)).toEqual(["a", "a"]);
  });
});
