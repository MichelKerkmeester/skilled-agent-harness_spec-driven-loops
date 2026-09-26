import assert from "node:assert/strict";
import { accessLevel } from "./src/decision.js";

assert.equal(accessLevel(false, false), "visitor");
assert.equal(accessLevel(false, true), "visitor");
assert.equal(accessLevel(true, false), "visitor");
assert.equal(accessLevel(true, true), "owner");
