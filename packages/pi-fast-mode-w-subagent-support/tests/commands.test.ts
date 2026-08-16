import { describe, expect, it } from "vitest";
import {
  FAST_COMMAND_USAGE,
  FastCommandUsageError,
  getFastCommandCompletions,
  parseFastCommand,
} from "../src/commands";

describe("parseFastCommand", () => {
  it("toggles for empty args", () => {
    expect(parseFastCommand("", false)).toBe(true);
    expect(parseFastCommand("   ", true)).toBe(false);
  });

  it("enables for on", () => {
    expect(parseFastCommand("on", false)).toBe(true);
    expect(parseFastCommand(" ON ", false)).toBe(true);
  });

  it("disables for off", () => {
    expect(parseFastCommand("off", true)).toBe(false);
    expect(parseFastCommand(" OFF ", true)).toBe(false);
  });

  it("toggles for toggle", () => {
    expect(parseFastCommand("toggle", false)).toBe(true);
    expect(parseFastCommand("toggle", true)).toBe(false);
  });

  it("throws concise usage guidance for invalid args", () => {
    expect(() => parseFastCommand("status", false)).toThrow(
      FastCommandUsageError,
    );
    expect(() => parseFastCommand("status", false)).toThrow(FAST_COMMAND_USAGE);
    expect(() => parseFastCommand("on now", false)).toThrow(FAST_COMMAND_USAGE);
  });
});

describe("getFastCommandCompletions", () => {
  it("returns command argument completions with value and label", () => {
    expect(getFastCommandCompletions("o")).toEqual([
      { value: "on", label: "on" },
      { value: "off", label: "off" },
    ]);
  });
});
