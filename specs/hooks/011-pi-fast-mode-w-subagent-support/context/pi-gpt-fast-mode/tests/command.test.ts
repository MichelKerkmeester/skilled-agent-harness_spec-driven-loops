import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FastCommandError,
  getCommandCompletions,
  parseFastCommand,
} from "../src/command.ts";

test("parseFastCommand: empty and 'toggle' both toggle", () => {
  assert.deepEqual(parseFastCommand(""), { kind: "toggle" });
  assert.deepEqual(parseFastCommand("  "), { kind: "toggle" });
  assert.deepEqual(parseFastCommand("toggle"), { kind: "toggle" });
  assert.deepEqual(parseFastCommand("TOGGLE"), { kind: "toggle" });
});

test("parseFastCommand: on/off set desired", () => {
  assert.deepEqual(parseFastCommand("on"), { kind: "set", desired: true });
  assert.deepEqual(parseFastCommand(" Off "), { kind: "set", desired: false });
});

test("parseFastCommand: status", () => {
  assert.deepEqual(parseFastCommand("status"), { kind: "status" });
});

test("parseFastCommand: tier names select a tier", () => {
  assert.deepEqual(parseFastCommand("flex"), { kind: "tier", tier: "flex" });
  assert.deepEqual(parseFastCommand("PRIORITY"), {
    kind: "tier",
    tier: "priority",
  });
  assert.deepEqual(parseFastCommand(" auto "), { kind: "tier", tier: "auto" });
  assert.deepEqual(parseFastCommand("default"), {
    kind: "tier",
    tier: "default",
  });
});

test("parseFastCommand: invalid throws FastCommandError", () => {
  assert.throws(() => parseFastCommand("nope"), FastCommandError);
  assert.throws(() => parseFastCommand("turbo"), FastCommandError);
});

test("getCommandCompletions filters by prefix and includes tiers", () => {
  assert.deepEqual(
    getCommandCompletions("o").map((c) => c.value),
    ["on", "off"],
  );
  assert.deepEqual(
    getCommandCompletions("fl").map((c) => c.value),
    ["flex"],
  );
  assert.deepEqual(
    getCommandCompletions("st").map((c) => c.value),
    ["status"],
  );
  assert.equal(getCommandCompletions("zzz").length, 0);
});
