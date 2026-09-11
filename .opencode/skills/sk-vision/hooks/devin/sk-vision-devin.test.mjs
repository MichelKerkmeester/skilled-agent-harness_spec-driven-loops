// ───────────────────────────────────────────────────────────────────
// MODULE: Devin Vision Hook Tests
// ───────────────────────────────────────────────────────────────────
// Drives the adapter as Devin does, by spawning it and writing a payload to
// stdin, because the contract under test is the process envelope rather than
// any exported function. Every case here asserts the fail-open guarantee: the
// adapter must emit an empty object and exit 0, so a vision problem can never
// cost the operator a turn.

import { describe, expect, it } from "bun:test";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ADAPTER = join(HERE, "sk-vision.mjs");

/** Runs the adapter with the given stdin and env, resolving its parsed stdout. */
function runAdapter(stdin, env = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn("node", [ADAPTER], {
      env: { ...process.env, ...env },
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      resolvePromise({ code, stdout, stderr });
    });
    child.stdin.end(stdin);
  });
}

describe("devin sk-vision adapter", () => {
  it("fails open on malformed stdin", async () => {
    const { code, stdout } = await runAdapter("{not json");
    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({});
  });

  it("fails open on an empty payload", async () => {
    const { code, stdout } = await runAdapter("{}");
    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({});
  });

  it("stays silent when the prompt names no image", async () => {
    const payload = JSON.stringify({
      prompt: "refactor the config loader and run the tests",
      cwd: HERE,
      hook_event_name: "UserPromptSubmit",
    });
    const { code, stdout } = await runAdapter(payload);
    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({});
  });

  it("stays silent when the named image does not exist", async () => {
    const payload = JSON.stringify({
      prompt: "what is in definitely-not-here.png?",
      cwd: HERE,
      hook_event_name: "UserPromptSubmit",
    });
    const { code, stdout } = await runAdapter(payload);
    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({});
  });

  it("honors its own kill-switch", async () => {
    const payload = JSON.stringify({ prompt: "look at a.png", cwd: HERE });
    const { code, stdout } = await runAdapter(payload, { SYSTEM_SK_VISION_DISABLED: "1" });
    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({});
  });

  it("honors the master hooks kill-switch", async () => {
    const payload = JSON.stringify({ prompt: "look at a.png", cwd: HERE });
    const { code, stdout } = await runAdapter(payload, { SYSTEM_HOOKS_DISABLED: "1" });
    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({});
  });

  it("never writes to stderr, which Devin would surface into the session", async () => {
    const { stderr } = await runAdapter("{not json");
    expect(stderr).toBe("");
  });
});

describe("evidence entry wiring", () => {
  // Regression guard. The adapter first pointed at the CLI's bundle, which
  // exports only its own entry symbol, so `evidenceForPrompt` was undefined and
  // the adapter fell through to its fail-open path on every turn. Every test
  // above still passed, because they all assert that same empty object. Only an
  // assertion on the dependency itself can catch a silent no-op.
  it("resolves a built entry that exports what the adapter calls", async () => {
    const entry = join(HERE, "../../vision-runtime/dist/prompt-evidence.js");
    expect(existsSync(entry)).toBe(true);
    const mod = await import(pathToFileURL(entry).href);
    expect(typeof mod.evidenceForPrompt).toBe("function");
  });
});
