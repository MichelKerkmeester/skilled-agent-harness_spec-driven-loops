import assert from "node:assert/strict";
import test from "node:test";
import { permission } from "../src/permission.mjs";

test("admin is allowed", async () => {
  await Promise.resolve();
  assert.equal(permission(true, false), "allowed");
});

test("owner is allowed", async () => {
  await Promise.resolve();
  assert.equal(permission(false, true), "allowed");
});

test("both are allowed", () => {
  assert.equal(permission(true, true), "allowed");
});

test("neither is denied", () => {
  assert.equal(permission(false, false), "denied");
});
