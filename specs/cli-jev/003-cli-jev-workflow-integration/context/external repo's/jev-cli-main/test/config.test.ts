import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import {
  configFromEnv,
  configPath,
  DEFAULT_CONFIG,
  knownConfigKeys,
  mergeConfig,
  readConfigFile,
  resolveConfig,
  setConfigValue,
  writeConfigFile,
} from "../src/config.js";
import { flagsToConfig } from "../src/context.js";

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "jevctl-"));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("configPath", () => {
  test("JEV_CONFIG wins, then XDG_CONFIG_HOME, then ~/.config", () => {
    expect(configPath({ JEV_CONFIG: "/x/y.json" })).toBe("/x/y.json");
    expect(configPath({ XDG_CONFIG_HOME: "/xdg", HOME: "/home/u" })).toBe("/xdg/jev/config.json");
    expect(configPath({ HOME: "/home/u" })).toBe("/home/u/.config/jev/config.json");
  });
});

describe("config file", () => {
  test("missing file yields empty config", () => {
    expect(readConfigFile(join(dir, "nope.json"))).toEqual({});
  });

  test("round-trips through write and read", () => {
    const path = join(dir, "sub", "config.json");
    writeConfigFile(path, { model: "jev-1.13.0", screen: { blockAt: 0.6 } });
    expect(readConfigFile(path)).toEqual({ model: "jev-1.13.0", screen: { blockAt: 0.6 } });
    expect(readFileSync(path, "utf8").endsWith("\n")).toBe(true);
  });

  test("rejects invalid JSON and invalid values", () => {
    const bad = join(dir, "bad.json");
    writeFileSync(bad, "{not json");
    expect(() => readConfigFile(bad)).toThrow(/not valid JSON/);
    writeFileSync(bad, JSON.stringify({ provider: "nope" }));
    expect(() => readConfigFile(bad)).toThrow(/invalid/);
  });
});

describe("resolution", () => {
  test("defaults < file < env < flags", () => {
    const path = join(dir, "config.json");
    writeConfigFile(path, { model: "from-file", timeoutMs: 1000, verify: { autoAccept: 0.5 } });
    const env = { JEV_CONFIG: path, JEV_MODEL: "from-env" };
    const config = resolveConfig({ env, flags: { timeoutMs: 5 } });
    expect(config.model).toBe("from-env");
    expect(config.timeoutMs).toBe(5);
    expect(config.verify.autoAccept).toBe(0.5);
    expect(config.screen).toEqual(DEFAULT_CONFIG.screen);
  });

  test("useFile:false ignores the file", () => {
    const path = join(dir, "config.json");
    writeConfigFile(path, { model: "from-file" });
    expect(resolveConfig({ env: { JEV_CONFIG: path }, useFile: false }).model).toBe("jev-latest");
  });

  test("configFromEnv parses and validates", () => {
    expect(configFromEnv({ JEV_PROVIDER: "TypeSafe", JEV_TIMEOUT_MS: "250" })).toEqual({
      provider: "typesafe",
      timeoutMs: 250,
    });
    expect(() => configFromEnv({ JEV_TIMEOUT_MS: "-1" })).toThrow(/positive/);
  });

  test("mergeConfig deep-merges nested sections", () => {
    expect(mergeConfig({ screen: { blockAt: 0.1 } }, { screen: { reviewAt: 0.05 } })).toEqual({
      screen: { blockAt: 0.1, reviewAt: 0.05 },
    });
  });
});

describe("setConfigValue", () => {
  test("sets dotted keys with coercion and validates", () => {
    const next = setConfigValue({}, "screen.blockAt", "0.6");
    expect(next).toEqual({ screen: { blockAt: 0.6 } });
    expect(setConfigValue(next, "model", "jev-1.13.0")).toEqual({
      model: "jev-1.13.0",
      screen: { blockAt: 0.6 },
    });
    expect(() => setConfigValue({}, "screen.blockAt", "2")).toThrow(/Cannot set/);
    expect(() => setConfigValue({}, "provider", "nope")).toThrow(/Cannot set/);
  });

  test("rejects keys the schema does not know", () => {
    expect(() => setConfigValue({}, "bogus.key", "1")).toThrow(/Unknown config key "bogus.key"/);
    expect(() => setConfigValue({}, "screen.typo", "1")).toThrow(/Unknown config key/);
    expect(knownConfigKeys().has("compact.keepThreshold")).toBe(true);
  });
});

describe("flagsToConfig", () => {
  test("maps global flags and rejects bad values", () => {
    expect(flagsToConfig({ json: true, model: "m", provider: "OpenRouter", timeout: "10" })).toEqual({
      format: "json",
      model: "m",
      provider: "openrouter",
      timeoutMs: 10,
    });
    expect(flagsToConfig({ format: "text" })).toEqual({ format: "text" });
    expect(() => flagsToConfig({ provider: "x" })).toThrow(/Unknown provider/);
    expect(() => flagsToConfig({ format: "yaml" })).toThrow(/Unknown format/);
    expect(() => flagsToConfig({ timeout: "0" })).toThrow(/--timeout/);
  });
});
