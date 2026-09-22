// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Gate - Pi extension delivery suite
// ───────────────────────────────────────────────────────────────────
// Drives the real pi extensions with a fake ExtensionAPI: no turn-time menu on
// a dialog-capable session, one dialog at the first write, a single blocking
// retry, repeat suppression, and fail-open on cancel.

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

// The extensions resolve the shared core through the runtime symlink layout,
// which the project's resolve alias bridges back to the real tree.
import specGateClassify from "../hooks/pi/spec-gate-classify";
import specGateEnforce from "../hooks/pi/spec-gate-enforce";

const core = await import("../hooks/lib/spec-gate/spec-gate-core.mjs");

type Handler = (event: any, ctx: any) => Promise<any> | any;

const CHOICE_EXISTING = "Use an existing spec folder";
const CHOICE_SKIP = "Skip - no spec folder needed for this change";
const FOLDER_REL = ".opencode/specs/999-test-folder";

function makeWorkspace(): string {
  const root = mkdtempSync(join(tmpdir(), "spec-gate-pi-"));
  const folder = join(root, FOLDER_REL);
  mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, "spec.md"), "# Test Spec\n\n| **Status** | Active |\n");
  writeFileSync(join(folder, "description.json"), "{}\n");
  writeFileSync(join(folder, "graph-metadata.json"), "{}\n");
  mkdirSync(join(root, "src"), { recursive: true });
  writeFileSync(join(root, "src", "app.ts"), "// placeholder\n");
  return root;
}

function makeApi(): { api: ExtensionAPI; handlers: Map<string, Handler[]> } {
  const handlers = new Map<string, Handler[]>();
  const api = {
    on(event: string, handler: Handler) {
      const registered = handlers.get(event) ?? [];
      registered.push(handler);
      handlers.set(event, registered);
    },
  } as unknown as ExtensionAPI;
  return { api, handlers };
}

interface CtxOptions {
  hasUI?: boolean;
  select?: (title: string, options: string[]) => Promise<string | undefined>;
  input?: (title: string) => Promise<string | undefined>;
  notify?: (message: string, type?: string) => void;
}

function makeCtx(root: string, options: CtxOptions = {}) {
  return {
    cwd: root,
    hasUI: options.hasUI ?? true,
    ui: {
      select: options.select ?? (async () => undefined),
      input: options.input ?? (async () => undefined),
      notify: options.notify ?? (() => {}),
    },
    sessionManager: {
      getSessionId: () => "pi-session",
      getSessionFile: () => undefined,
    },
  };
}

async function invoke(
  handlers: Map<string, Handler[]>,
  event: string,
  payload: any,
  ctx: any,
): Promise<any> {
  for (const handler of handlers.get(event) ?? []) {
    const outcome = await handler(payload, ctx);
    if (outcome !== undefined && outcome !== null) return outcome;
  }
  return undefined;
}

function statePath(root: string): string {
  const { stateDir } = core.resolveGuardPaths(root);
  return join(stateDir, `${core.sessionStateKey("pi-session")}.json`);
}

function readState(root: string): any {
  return JSON.parse(readFileSync(statePath(root), "utf8"));
}

let root: string;

beforeEach(() => {
  root = makeWorkspace();
  delete process.env[core.ENFORCE_ENV];
  delete process.env[core.DISABLED_ENV];
  delete process.env[core.CHILD_SESSION_ENV];
  delete process.env[core.GATE_3_DELIVERY_SUPPRESSION_ENV];
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
  delete process.env[core.ENFORCE_ENV];
  delete process.env[core.DISABLED_ENV];
  delete process.env[core.CHILD_SESSION_ENV];
  delete process.env[core.GATE_3_DELIVERY_SUPPRESSION_ENV];
});

describe("pi classify", () => {
  it("never appends a question to a dialog-capable session's turn, but opens the gate", async () => {
    const { api, handlers } = makeApi();
    specGateClassify(api);

    const outcome = await invoke(handlers, "input", { text: "fix the login bug", source: "interactive" }, makeCtx(root));

    expect(outcome).toEqual({ action: "continue" });
    expect(readState(root).status).toBe("open");
  });

  it("stays silent and stateless on a read-only turn", async () => {
    const { api, handlers } = makeApi();
    specGateClassify(api);

    await invoke(handlers, "input", { text: "review the auth module" }, makeCtx(root));

    expect(existsSync(statePath(root))).toBe(false);
  });

  it("relays the reframed deferral exactly once where no dialog exists", async () => {
    const { api, handlers } = makeApi();
    specGateClassify(api);
    const ctx = makeCtx(root, { hasUI: false });

    const first = await invoke(handlers, "input", { text: "fix the login bug" }, ctx);
    expect(first.action).toBe("transform");
    expect(first.text).toContain(core.GATE_3_DEFERRED_INSTRUCTION);
    expect(first.text).not.toContain(core.GATE_3_QUESTION);

    const second = await invoke(handlers, "input", { text: "fix the login bug again" }, ctx);
    expect(second).toEqual({ action: "continue" });
  });
});

describe("pi enforce", () => {
  async function openGate(): Promise<void> {
    const { api, handlers } = makeApi();
    specGateClassify(api);
    await invoke(handlers, "input", { text: "fix the login bug" }, makeCtx(root));
    expect(readState(root).status).toBe("open");
  }

  const writeCall = { toolName: "write", input: { path: "src/app.ts" } };

  it("asks at the first write, binds the answer, and blocks that one call", async () => {
    await openGate();
    const selectCalls: string[] = [];
    const { api, handlers } = makeApi();
    specGateEnforce(api);
    const ctx = makeCtx(root, {
      select: async (_title, options) => {
        selectCalls.push(...options);
        return CHOICE_EXISTING;
      },
      input: async () => FOLDER_REL,
    });

    const blocked = await invoke(handlers, "tool_call", writeCall, ctx);
    expect(blocked.block).toBe(true);
    expect(blocked.reason).toContain(FOLDER_REL);
    expect(readState(root).status).toBe("satisfied");

    // The retried call goes through, and nothing asks again.
    const retried = await invoke(handlers, "tool_call", writeCall, ctx);
    expect(retried).toBeUndefined();
  });

  it("asks once per session: a cancelled dialog does not re-open on the next write", async () => {
    await openGate();
    let selectCount = 0;
    const { api, handlers } = makeApi();
    specGateEnforce(api);
    const ctx = makeCtx(root, {
      select: async () => {
        selectCount += 1;
        return undefined;
      },
    });

    const first = await invoke(handlers, "tool_call", writeCall, ctx);
    expect(first).toBeUndefined();
    expect(selectCount).toBe(1);
    expect(readState(root).questionDeliveredChannel).toBe("dialog-cancelled");

    const second = await invoke(handlers, "tool_call", writeCall, ctx);
    expect(second).toBeUndefined();
    expect(selectCount).toBe(1);
  });

  it("never prompts for bash, and never for an exempt target", async () => {
    await openGate();
    const asked: string[] = [];
    const { api, handlers } = makeApi();
    specGateEnforce(api);
    const ctx = makeCtx(root, {
      select: async (title) => {
        asked.push(title);
        return undefined;
      },
    });

    await invoke(handlers, "tool_call", { toolName: "bash", input: { command: "rm src/app.ts" } }, ctx);
    await invoke(handlers, "tool_call", { toolName: "write", input: { path: `${FOLDER_REL}/spec.md` } }, ctx);

    expect(asked).toEqual([]);
  });

  it("still blocks under enforce-on, with the deny reason, when the dialog is cancelled", async () => {
    await openGate();
    process.env[core.ENFORCE_ENV] = "1";
    const { api, handlers } = makeApi();
    specGateEnforce(api);

    const blocked = await invoke(handlers, "tool_call", writeCall, makeCtx(root));
    expect(blocked.block).toBe(true);
    expect(blocked.reason).toBe(core.GATE_3_DENY_DETAIL);
    expect(readState(root).status).toBe("open");
  });

  it("answers a skip through the dialog and lets the retry through", async () => {
    await openGate();
    const { api, handlers } = makeApi();
    specGateEnforce(api);
    const ctx = makeCtx(root, { select: async () => CHOICE_SKIP });

    const blocked = await invoke(handlers, "tool_call", writeCall, ctx);
    expect(blocked.block).toBe(true);
    expect(readState(root).status).toBe("skipped");

    expect(await invoke(handlers, "tool_call", writeCall, ctx)).toBeUndefined();
  });

  it("fails open when an invalid path is entered", async () => {
    await openGate();
    const notifications: string[] = [];
    const { api, handlers } = makeApi();
    specGateEnforce(api);
    const ctx = makeCtx(root, {
      select: async () => CHOICE_EXISTING,
      input: async () => ".opencode/specs/does-not-exist",
      notify: (message) => notifications.push(message),
    });

    const outcome = await invoke(handlers, "tool_call", writeCall, ctx);
    expect(outcome).toBeUndefined();
    expect(notifications[0]).toContain("could not be bound");
    expect(readState(root).status).toBe("open");
  });
});
