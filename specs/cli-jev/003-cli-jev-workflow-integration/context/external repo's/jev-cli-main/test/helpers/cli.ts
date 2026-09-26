// Spawns the built CLI (dist/cli.js) against a local fake TypeSafe API.
// Call `cliHarness()` at the top of a test file; it registers the vitest
// hooks and returns `run`, plus accessors for the fake API and a temp dir.

import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import { autoAnswer, type FakeApi, startFakeApi } from "./fake-api.js";

const cliPath = fileURLToPath(new URL("../../dist/cli.js", import.meta.url));

export interface RunResult {
  code: number;
  stdout: string;
  stderr: string;
}

export interface RunOptions {
  env?: Record<string, string>;
  stdin?: string;
  /** Skip the fake API credentials (to test "no credentials" paths). */
  noApi?: boolean;
}

export interface Harness {
  run(args: string[], opts?: RunOptions): Promise<RunResult>;
  /** Fake API; `requests` is reset before every test. */
  api(): FakeApi;
  /** Fresh temp directory per test. */
  dir(): string;
  /** Parse JSONL stdout. */
  // biome-ignore lint/suspicious/noExplicitAny: tests index into JSONL rows freely
  lines(stdout: string): any[];
}

export function cliHarness(overrides: Record<string, unknown> = {}): Harness {
  let api: FakeApi;
  let dir: string;

  beforeAll(async () => {
    api = await startFakeApi(autoAnswer(overrides));
  });
  afterAll(async () => {
    await api.close();
  });
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "jev-test-"));
    api.requests.length = 0;
  });
  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  const run = (args: string[], opts: RunOptions = {}) =>
    new Promise<RunResult>((resolve, reject) => {
      const env: Record<string, string> = {
        PATH: process.env.PATH ?? "",
        HOME: process.env.HOME ?? "",
        NO_COLOR: "1",
        TZ: "UTC",
        JEV_CONFIG: join(dir, "absent-config.json"),
        JEV_CREDENTIAL_STORE: "file",
        JEV_CREDENTIALS: join(dir, "absent-credentials.json"),
        JEV_NO_UPDATE_CHECK: "1",
        ...(opts.noApi ? {} : { TYPESAFE_API_KEY: "test-key", TYPESAFE_BASE_URL: api.url }),
        ...opts.env,
      };
      const child = spawn(process.execPath, [cliPath, ...args], { env, stdio: ["pipe", "pipe", "pipe"] });
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (d) => {
        stdout += d;
      });
      child.stderr.on("data", (d) => {
        stderr += d;
      });
      child.on("error", reject);
      child.on("close", (code) => resolve({ code: code ?? -1, stdout, stderr }));
      child.stdin.end(opts.stdin ?? "");
    });

  return {
    run,
    api: () => api,
    dir: () => dir,
    lines: (stdout) =>
      stdout
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((l) => JSON.parse(l)),
  };
}
