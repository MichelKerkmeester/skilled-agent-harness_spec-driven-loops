import { describe, expect, it } from "vitest";
import { status } from "../../src/status.ts";

describe("status", () => {
  it("returns empty when either requirement is absent", () => {
    expect(status(false, 1)).toBe("empty");
    expect(status(true, 0)).toBe("empty");
  });
});
