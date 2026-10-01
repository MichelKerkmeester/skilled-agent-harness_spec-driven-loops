// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension Tests - Git Message Contract Gate
// ───────────────────────────────────────────────────────────────────

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import gitMessageGate from "./git-message-gate";

// Pins the Pi transport over the shared message-contract gate: a refusal is a `.block` with the
// gate's reason, because Pi drops a tool_call return that does not block.

type Handler = (event: any, ctx: any) => unknown;

const COMMIT_TEMPLATE = new URL("../../../assets/commit-message-template.md", import.meta.url).pathname;
const repos: string[] = [];

function makeRepo(template: string | null): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pi-git-message-gate-"));
  repos.push(dir);
  execFileSync("git", ["init", "-q", dir]);
  if (template !== null) {
    fs.mkdirSync(path.join(dir, ".sk-git"));
    fs.writeFileSync(path.join(dir, ".sk-git", "commit-message-template.md"), template);
  }
  return dir;
}

function toolCallHandler(): Handler {
  const handlers = new Map<string, Handler>();
  const api = { on: (event: string, handler: Handler) => handlers.set(event, handler) } as unknown as ExtensionAPI;
  gitMessageGate(api);
  const handler = handlers.get("tool_call");
  if (!handler) throw new Error("tool_call handler was not registered");
  return handler;
}

function bash(command: string) {
  return { toolName: "bash", toolCallId: "call-1", input: { command } };
}

afterEach(() => {
  for (const dir of repos.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

describe("git-message-gate Pi extension", () => {
  it("blocks a commit message that breaks the template and names the rule", async () => {
    const cwd = makeRepo(fs.readFileSync(COMMIT_TEMPLATE, "utf8"));
    const result = (await toolCallHandler()(bash('git commit -m "Fixed stuff"'), { cwd })) as any;
    expect(result?.block).toBe(true);
    expect(result?.reason).toContain("[subject.format]");
  });

  it("passes a conforming commit, a non-bash tool and a repository without a contract", async () => {
    const handler = toolCallHandler();
    const cwd = makeRepo(fs.readFileSync(COMMIT_TEMPLATE, "utf8"));
    const good = 'git commit -m "docs(readme): record the baseline" -m "A body that says why."';
    expect(await handler(bash(good), { cwd })).toBeUndefined();
    expect(await handler({ ...bash('git commit -m "Fixed stuff"'), toolName: "read" }, { cwd })).toBeUndefined();
    expect(await handler(bash('git commit -m "Fixed stuff"'), { cwd: makeRepo(null) })).toBeUndefined();
  });

  it("blocks when the rules block cannot be read", async () => {
    const cwd = makeRepo("# Commit\n\n## Enforced rules\n\n```json\n{ not json\n```\n");
    const result = (await toolCallHandler()(bash('git commit -m "docs(readme): x" -m "A body."'), { cwd })) as any;
    expect(result?.block).toBe(true);
    expect(result?.reason).toContain("rules cannot be read");
  });
});
