import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { checkForUpdate, versionCachePath } from "../src/versionCheck.js";

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "jev-version-check-"));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("checkForUpdate", () => {
  test("returns the latest version when it is newer, and writes a cache", () => {
    const env = { JEV_VERSION_CACHE: join(dir, "cache.json") };
    let calls = 0;
    const latest = checkForUpdate({
      env,
      currentVersion: "0.2.2",
      fetchLatest: () => {
        calls++;
        return "0.3.0";
      },
    });
    expect(latest).toBe("0.3.0");
    expect(calls).toBe(1);
    expect(existsSync(versionCachePath(env))).toBe(true);
  });

  test("returns undefined when already current", () => {
    const env = { JEV_VERSION_CACHE: join(dir, "cache.json") };
    const latest = checkForUpdate({ env, currentVersion: "0.3.0", fetchLatest: () => "0.3.0" });
    expect(latest).toBeUndefined();
  });

  test("reuses a fresh cache instead of calling fetchLatest again", () => {
    const env = { JEV_VERSION_CACHE: join(dir, "cache.json") };
    let calls = 0;
    const fetchLatest = () => {
      calls++;
      return "0.3.0";
    };
    const now = Date.now();
    checkForUpdate({ env, currentVersion: "0.2.2", fetchLatest, now });
    const latest = checkForUpdate({ env, currentVersion: "0.2.2", fetchLatest, now: now + 1000 });
    expect(latest).toBe("0.3.0");
    expect(calls).toBe(1);
  });

  test("refetches once the cache is older than the ttl", () => {
    const env = { JEV_VERSION_CACHE: join(dir, "cache.json") };
    let calls = 0;
    const now = Date.now();
    checkForUpdate({ env, currentVersion: "0.2.2", fetchLatest: () => "0.3.0", now, ttlMs: 1000 });
    checkForUpdate({
      env,
      currentVersion: "0.2.2",
      fetchLatest: () => {
        calls++;
        return "0.4.0";
      },
      now: now + 2000,
      ttlMs: 1000,
    });
    expect(calls).toBe(1);
    const cache = JSON.parse(readFileSync(versionCachePath(env), "utf8"));
    expect(cache.latest).toBe("0.4.0");
  });

  test("swallows fetch failures and reports no update", () => {
    const env = { JEV_VERSION_CACHE: join(dir, "cache.json") };
    const latest = checkForUpdate({
      env,
      currentVersion: "0.2.2",
      fetchLatest: () => {
        throw new Error("offline");
      },
    });
    expect(latest).toBeUndefined();
    expect(existsSync(versionCachePath(env))).toBe(false);
  });
});
