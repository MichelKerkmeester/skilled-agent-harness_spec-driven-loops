// ───────────────────────────────────────────────────────────────────
// MODULE: Completion Evidence - Pi extension delivery suite
// ───────────────────────────────────────────────────────────────────
// Drives the real Pi extension with a fake ExtensionAPI and checks how its
// advisory is delivered. turn_end fires while Pi is still streaming, so the
// send options decide whether an advisory-only check restarts a finished run.

import { afterEach, describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const { default: completionEvidence } = await import("../hooks/pi/completion-evidence");

type Handler = (event: any, ctx: any) => Promise<any> | any;

const SESSION_ID = "pi-completion-session";
const CLAIM_TEXT = "The core is now complete and shipped.";

function makeApi() {
  const handlers = new Map<string, Handler>();
  const sent: Array<{ message: any; options: any }> = [];
  const api = {
    on(event: string, handler: Handler) {
      handlers.set(event, handler);
    },
    sendMessage(message: any, options?: any) {
      sent.push({ message, options });
    },
  } as unknown as ExtensionAPI;
  return { api, handlers, sent };
}

// The extension finds the claimed spec folder through the session state file
// the spec-kit hooks share, keyed on the project dir and session id hashes.
function writeHookState(projectDir: string, specFolder: string): void {
  const projectHash = createHash("sha256").update(projectDir).digest("hex").slice(0, 12);
  const sessionHash = createHash("sha256").update(SESSION_ID).digest("hex").slice(0, 16);
  const stateDir = join(tmpdir(), "speckit-claude-hooks", projectHash);
  mkdirSync(stateDir, { recursive: true });
  writeFileSync(join(stateDir, `${sessionHash}.json`), JSON.stringify({ lastSpecFolder: specFolder }), "utf8");
}

describe("completion-evidence Pi extension", () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  it("sends its advisory without continuing the running turn", async () => {
    const projectDir = mkdtempSync(join(tmpdir(), "completion-pi-project-"));
    // A Level 1 folder with neither checklist.md nor implementation-summary.md
    // always resolves to an advisory, with no script spawn involved.
    const specFolder = mkdtempSync(join(tmpdir(), "completion-pi-spec-"));
    tempDirs.push(projectDir, specFolder);
    writeHookState(projectDir, specFolder);

    const { api, handlers, sent } = makeApi();
    completionEvidence(api);
    await handlers.get("turn_end")?.(
      {
        type: "turn_end",
        turnIndex: 0,
        message: { role: "assistant", content: [{ type: "text", text: CLAIM_TEXT }] },
        toolResults: [],
      },
      { cwd: projectDir, sessionManager: { getSessionId: () => SESSION_ID } },
    );

    const advisories = sent.filter(({ message }) => message.customType === "completion-evidence-advisory");
    expect(advisories).toHaveLength(1);
    // Default options steer the advisory into the streaming run and continue
    // it. triggerTurn false appends it after the final answer, which leaves
    // print mode with nothing to print. Only a next-turn delivery does neither.
    expect(advisories[0].options).toEqual({ deliverAs: "nextTurn" });
  });
});
