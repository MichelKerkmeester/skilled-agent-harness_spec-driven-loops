const assert = require("node:assert/strict");
const test = require("node:test");
const { permission } = require("../dist/permission.cjs");

for (const [name, admin, owner, expected] of [
  ["admin", true, false, "allowed"],
  ["owner", false, true, "allowed"],
  ["both", true, true, "allowed"],
  ["neither", false, false, "denied"],
]) test(name, () => assert.equal(permission(admin, owner), expected));
