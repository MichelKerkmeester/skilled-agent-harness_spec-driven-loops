import { PassThrough } from "node:stream";
import { describe, expect, test } from "vitest";
import { compareVersions, type UpdateRunner, updateAction } from "../../src/commands/update.js";
import type { CommandContext } from "../../src/context.js";

function fakeCtx(): { ctx: CommandContext; stdout: () => string } {
  const stream = new PassThrough();
  let out = "";
  stream.on("data", (chunk) => {
    out += chunk.toString();
  });
  const ctx = {
    config: {} as CommandContext["config"],
    env: {},
    output: { format: "text", color: false, quiet: false, stream },
    dryRun: false,
    ask: () => {
      throw new Error("not used");
    },
  } as CommandContext;
  return { ctx, stdout: () => out };
}

describe("update: core", () => {
  test("compareVersions orders dotted numeric versions", () => {
    expect(compareVersions("0.2.1", "0.2.0")).toBeGreaterThan(0);
    expect(compareVersions("0.2.0", "0.2.1")).toBeLessThan(0);
    expect(compareVersions("0.2.0", "0.2.0")).toBe(0);
    expect(compareVersions("0.10.0", "0.9.0")).toBeGreaterThan(0);
  });

  test("reports up to date without installing when already current", () => {
    const { ctx, stdout } = fakeCtx();
    let installed = false;
    const runner: UpdateRunner = {
      latestVersion: () => "0.2.1",
      install: () => {
        installed = true;
      },
    };
    const code = updateAction({}, ctx, "0.2.1", runner);
    expect(code).toBe(0);
    expect(installed).toBe(false);
    expect(stdout()).toMatch(/up to date/);
  });

  test("--check reports an available update without installing", () => {
    const { ctx, stdout } = fakeCtx();
    let installed = false;
    const runner: UpdateRunner = {
      latestVersion: () => "0.3.0",
      install: () => {
        installed = true;
      },
    };
    const code = updateAction({ check: true }, ctx, "0.2.1", runner);
    expect(code).toBe(0);
    expect(installed).toBe(false);
    expect(stdout()).toMatch(/0\.2\.1 -> 0\.3\.0/);
  });

  test("installs the latest version when outdated", () => {
    const { ctx, stdout } = fakeCtx();
    let installedVersion: string | undefined;
    const runner: UpdateRunner = {
      latestVersion: () => "0.3.0",
      install: (v) => {
        installedVersion = v;
      },
    };
    const code = updateAction({}, ctx, "0.2.1", runner);
    expect(code).toBe(0);
    expect(installedVersion).toBe("0.3.0");
    expect(stdout()).toMatch(/Updated jev 0\.2\.1 -> 0\.3\.0/);
  });
});
