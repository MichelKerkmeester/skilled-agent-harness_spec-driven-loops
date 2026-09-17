import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { evidenceForPrompt, findImagePathInText, wrapEvidence } from "./prompt-evidence.js";

let workspace: string;
let screenshot: string;
let spaced: string;

beforeAll(() => {
  workspace = mkdtempSync(join(tmpdir(), "sk-vision-evidence-"));
  screenshot = join(workspace, "screenshot.png");
  spaced = join(workspace, "my screen.png");
  writeFileSync(screenshot, "not a real png, only its path matters here");
  writeFileSync(spaced, "same");
  writeFileSync(join(workspace, "notes.txt"), "same");
  writeFileSync(join(workspace, "second.jpg"), "same");
});

afterAll(() => {
  rmSync(workspace, { recursive: true, force: true });
});

describe("findImagePathInText", () => {
  it("finds a relative image path that exists on disk", () => {
    expect(findImagePathInText("what does screenshot.png show?", workspace)).toBe(screenshot);
  });

  it("finds an absolute image path", () => {
    expect(findImagePathInText(`read ${screenshot} please`, workspace)).toBe(screenshot);
  });

  it("ignores a path that does not resolve to a file", () => {
    expect(findImagePathInText("check missing.png for errors", workspace)).toBeUndefined();
  });

  it("ignores a file that exists but is not an image", () => {
    expect(findImagePathInText("open notes.txt", workspace)).toBeUndefined();
  });

  it("returns the last resolvable image when several are named", () => {
    const found = findImagePathInText("compare screenshot.png with second.jpg", workspace);
    expect(found).toBe(join(workspace, "second.jpg"));
  });

  it("handles a quoted path containing a space", () => {
    expect(findImagePathInText('look at "my screen.png" now', workspace)).toBe(spaced);
  });

  it("strips punctuation a sentence leaves on the path", () => {
    expect(findImagePathInText("see screenshot.png, then stop", workspace)).toBe(screenshot);
  });

  it("returns undefined for empty or non-string input", () => {
    expect(findImagePathInText("", workspace)).toBeUndefined();
    expect(findImagePathInText(undefined as unknown as string, workspace)).toBeUndefined();
  });
});

describe("evidenceForPrompt", () => {
  it("returns undefined without spawning a runtime when no image is named", async () => {
    await expect(evidenceForPrompt("refactor the config loader", workspace)).resolves.toBeUndefined();
  });
});

describe("wrapEvidence", () => {
  it("wraps rendered text in the delimiter hosts look for", () => {
    expect(wrapEvidence("SCENE: a chart")).toBe(
      "<SK-VISION EVIDENCE>\nSCENE: a chart\n</SK-VISION EVIDENCE>",
    );
  });

  // The per-signal renderers emit their own <SK-VISION Scene|Caption|OCR> blocks,
  // so a bare outer <SK-VISION> would nest the same tag and strand a closing one.
  it("does not reuse the tag name the inner renderers already emit", () => {
    const wrapped = wrapEvidence("<SK-VISION Scene>\nx\n</SK-VISION>");
    expect(wrapped.startsWith("<SK-VISION EVIDENCE>")).toBe(true);
    expect(wrapped.split("<SK-VISION>").length - 1).toBe(0);
  });
});
