import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { grade } from "../src/app.mjs";

describe("grades", () => {
  beforeEach(() => {});
  it("grades an A", () => {
    assert.equal(grade(95), "A");
  });
  it("grades a B", () => {
    assert.equal(grade(85), "B");
  });
  it("grades a C", () => {
    assert.equal(grade(10), "C");
  });
});
