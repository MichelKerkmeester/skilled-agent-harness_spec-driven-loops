import assert from "node:assert/strict";
import test from "node:test";
import { permission } from "../dist/permission.js";

for (const [name, admin, owner, expected] of [
  ["admin", true, false, "allowed"],
  ["owner", false, true, "allowed"],
  ["both", true, true, "allowed"],
  ["neither", false, false, "denied"],
]) test(name, () => assert.equal(permission(admin, owner), expected));
