import { describe, expect, it } from "vitest";
import { readHandoff, writeHandoff } from "../src/handoff";
import { HANDOFF_ENV } from "../src/types";

describe("readHandoff", () => {
  it.each([
    ["1", true],
    ["0", false],
    [undefined, undefined],
    ["true", undefined],
    ["2", undefined],
    ["", undefined],
  ])("parses %s as %s", (value, expected) => {
    const env: NodeJS.ProcessEnv = {};
    if (value !== undefined) env[HANDOFF_ENV] = value;

    expect(readHandoff(env)).toBe(expected);
  });
});

describe("writeHandoff", () => {
  it("emits only the normalized enabled value", () => {
    const env: NodeJS.ProcessEnv = {};

    writeHandoff(env, true);
    expect(env[HANDOFF_ENV]).toBe("1");

    writeHandoff(env, false);
    expect(env[HANDOFF_ENV]).toBe("0");
  });

  it("round-trips the normalized value through the parser", () => {
    const env: NodeJS.ProcessEnv = {};

    writeHandoff(env, true);
    expect(readHandoff(env)).toBe(true);

    writeHandoff(env, false);
    expect(readHandoff(env)).toBe(false);
  });
});
