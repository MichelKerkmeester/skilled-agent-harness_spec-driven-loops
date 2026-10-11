// ───────────────────────────────────────────────────────────────────
// MODULE: Session Start Context - Pi extension build notice
// ───────────────────────────────────────────────────────────────────
// Pi's session-start context comes from the built Claude session-prime hook.
// When that build is missing the extension must say so once and name the
// build, instead of returning silently.

import { afterEach, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const { default: sessionStartContext } = await import("../hooks/pi/session-start-context");

type Handler = (event: any, ctx: any) => Promise<any> | any;
type Notice = { message: string; level: string };

function makeApi() {
  const handlers = new Map<string, Handler>();
  const sent: any[] = [];
  const api = {
    on(event: string, handler: Handler) {
      handlers.set(event, handler);
    },
    sendMessage(message: any) {
      sent.push(message);
    },
  } as unknown as ExtensionAPI;
  return { api, handlers, sent };
}

function makeCtx(cwd: string, notices: Notice[]) {
  return {
    cwd,
    sessionManager: { getSessionId: () => "pi-session-start-test" },
    ui: { notify: (message: string, level: string) => notices.push({ message, level }) },
  };
}

describe("session-start-context Pi extension", () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  it("names the spec-kit build when the session-prime adapter is not built", async () => {
    const projectDir = mkdtempSync(join(tmpdir(), "session-start-pi-unbuilt-"));
    tempDirs.push(projectDir);
    const notices: Notice[] = [];
    const { api, handlers, sent } = makeApi();

    sessionStartContext(api);
    await handlers.get("session_start")?.({ type: "session_start", reason: "startup" }, makeCtx(projectDir, notices));

    expect(sent).toHaveLength(0);
    expect(notices).toHaveLength(1);
    expect(notices[0].level).toBe("warning");
    expect(notices[0].message).toContain("npm --prefix .skilled/skills/system-spec-kit run build");
  });

  it("stays quiet when the built adapter runs and prints nothing", async () => {
    const projectDir = mkdtempSync(join(tmpdir(), "session-start-pi-built-"));
    tempDirs.push(projectDir);
    const adapterDir = join(projectDir, ".skilled", "skills", "system-spec-kit", "runtime", "dist", "hooks", "claude");
    mkdirSync(adapterDir, { recursive: true });
    writeFileSync(join(adapterDir, "session-prime.js"), "", "utf8");
    const notices: Notice[] = [];
    const { api, handlers, sent } = makeApi();

    sessionStartContext(api);
    await handlers.get("session_start")?.({ type: "session_start", reason: "startup" }, makeCtx(projectDir, notices));

    expect(sent).toHaveLength(0);
    expect(notices).toHaveLength(0);
  });
});
