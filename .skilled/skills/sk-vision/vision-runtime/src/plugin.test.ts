// ───────────────────────────────────────────────────────────────────
// MODULE: Vision Plugin Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from "bun:test";
import { toV1FileUrl } from "./plugin.js";

describe("v2 attachment URL mapping", () => {
  it("wraps bare base64 data in a MIME data URL", () => {
    expect(toV1FileUrl({ mime: "image/png", data: "aGVsbG8=" })).toBe(
      "data:image/png;base64,aGVsbG8=",
    );
  });

  it("preserves an attachment value that is already a data URL", () => {
    const dataUrl = "data:image/jpeg;base64,already-encoded";

    expect(toV1FileUrl({ mime: "image/png", data: dataUrl })).toBe(dataUrl);
  });
});
