import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import {
  isReference,
  nonEmptyLines,
  parseItems,
  parseJson,
  parseList,
  readInput,
  referenceId,
} from "../src/input.js";

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "jevctl-input-"));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("readInput", () => {
  test("returns literals, reads @files, and unescapes @@", () => {
    const file = join(dir, "a.txt");
    writeFileSync(file, "hello");
    expect(readInput("plain")).toBe("plain");
    expect(readInput(`@${file}`)).toBe("hello");
    expect(readInput("@@literal")).toBe("@literal");
  });

  test("missing file is a friendly error", () => {
    expect(() => readInput(`@${join(dir, "missing.txt")}`, "evidence")).toThrow(/Cannot read evidence/);
  });
});

describe("reference helpers", () => {
  test("isReference and referenceId", () => {
    expect(isReference("-")).toBe(true);
    expect(isReference("@x")).toBe(true);
    expect(isReference("@@x")).toBe(false);
    expect(isReference("x")).toBe(false);
    expect(referenceId("-")).toBe("stdin");
    expect(referenceId("@/tmp/dir/file.md")).toBe("file.md");
    expect(referenceId("literal")).toBeUndefined();
  });
});

describe("parsers", () => {
  test("parseJson names the source on failure", () => {
    expect(parseJson('{"a":1}')).toEqual({ a: 1 });
    expect(() => parseJson("{", "questions")).toThrow(/questions is not valid JSON/);
  });

  test("nonEmptyLines trims and drops blanks", () => {
    expect(nonEmptyLines(" a \n\n b\r\n\n")).toEqual(["a", "b"]);
  });

  test("parseList handles JSON arrays and line lists", () => {
    expect(parseList('["x","y"]')).toEqual(["x", "y"]);
    expect(() => parseList('{"not":"a list"}', "claims")).toThrow(/claims must be a JSON array of strings/);
    expect(parseList("x\ny\n")).toEqual(["x", "y"]);
    expect(() => parseList("[1,2]", "claims")).toThrow(/array of strings/);
  });

  test("parseItems accepts strings, objects, and maps", () => {
    expect(parseItems('["a","b"]')).toEqual([{ text: "a" }, { text: "b" }]);
    expect(parseItems('[{"id":"x","text":"a"},{"text":"b"}]')).toEqual([
      { id: "x", text: "a" },
      { text: "b" },
    ]);
    expect(parseItems('{"x":"a","y":"b"}')).toEqual([
      { id: "x", text: "a" },
      { id: "y", text: "b" },
    ]);
    expect(() => parseItems("[1]", "candidates")).toThrow(/candidates\[0\]/);
    expect(() => parseItems('{"x":1}', "candidates")).toThrow(/candidates.x/);
    expect(() => parseItems('"str"', "candidates")).toThrow(/array or object/);
  });
});
