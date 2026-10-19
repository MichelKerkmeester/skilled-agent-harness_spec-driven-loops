// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Client Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, spyOn } from "bun:test";
import { chmodSync, existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuntimeClient } from "./client.js";

describe("RuntimeClient close", () => {
  it("does not start the runtime when closed while still provisioning", async () => {
    const dir = mkdtempSync(join(tmpdir(), "sk-vision-client-"));
    const marker = join(dir, "spawned");
    const fakePython = join(dir, "python");
    writeFileSync(fakePython, `#!/bin/sh\necho spawned > "${marker}"\n`);
    chmodSync(fakePython, 0o755);

    let finishProvisioning!: (python: string) => void;
    const provisioning = new Promise<string>((resolve) => {
      finishProvisioning = resolve;
    });
    const spy = spyOn(
      RuntimeClient.prototype as unknown as { ensurePython(): Promise<string> },
      "ensurePython",
    ).mockImplementation(() => provisioning);

    try {
      const client = new RuntimeClient({ pythonPath: fakePython, timeoutMs: 1_000 });
      await client.close();
      finishProvisioning(fakePython);
      await client.ready;
      await new Promise((resolve) => setTimeout(resolve, 300));
      expect(existsSync(marker)).toBe(false);
    } finally {
      spy.mockRestore();
    }
  });

  it("stops a provisioning step that is still running and settles ready", async () => {
    const dir = mkdtempSync(join(tmpdir(), "sk-vision-client-"));
    const pidFile = join(dir, "uv.pid");
    const fakeUv = join(dir, "uv");
    writeFileSync(fakeUv, `#!/bin/sh\necho $$ > "${pidFile}"\nexec sleep 30\n`);
    chmodSync(fakeUv, 0o755);

    const saved = {
      uv: process.env.SK_VISION_UV,
      venv: process.env.SK_VISION_VENV_DIR,
      python: process.env.SK_VISION_PYTHON,
    };
    process.env.SK_VISION_UV = fakeUv;
    process.env.SK_VISION_VENV_DIR = join(dir, "venv");
    delete process.env.SK_VISION_PYTHON;
    const proto = RuntimeClient.prototype as unknown as {
      hasMoondream(python: string): Promise<boolean>;
      hasUv(): Promise<boolean>;
    };
    const moondream = spyOn(proto, "hasMoondream").mockImplementation(async () => false);
    const uv = spyOn(proto, "hasUv").mockImplementation(async () => true);
    const notes: string[] = [];

    try {
      const client = new RuntimeClient({
        pythonPath: join(dir, "missing-python"),
        timeoutMs: 1_000,
        notify: (m) => {
          notes.push(m.variant ?? "");
        },
      });
      for (let i = 0; i < 100 && !existsSync(pidFile); i++) {
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      expect(existsSync(pidFile)).toBe(true);
      const pid = Number(readFileSync(pidFile, "utf8").trim());

      await client.close();
      await Promise.race([
        client.ready,
        new Promise((_, reject) => setTimeout(() => reject(new Error("ready did not settle")), 2_000)),
      ]);

      let alive = true;
      try {
        process.kill(pid, 0);
      } catch {
        alive = false;
      }
      expect(alive).toBe(false);
      expect(notes).not.toContain("error");
    } finally {
      moondream.mockRestore();
      uv.mockRestore();
      for (const [key, value] of [
        ["SK_VISION_UV", saved.uv],
        ["SK_VISION_VENV_DIR", saved.venv],
        ["SK_VISION_PYTHON", saved.python],
      ] as const) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  });

  it("forces a provisioning step that ignores SIGTERM to exit before close resolves", async () => {
    const dir = mkdtempSync(join(tmpdir(), "sk-vision-client-"));
    const pidFile = join(dir, "uv.pid");
    const fakeUv = join(dir, "uv");
    writeFileSync(fakeUv, `#!/bin/sh\ntrap '' TERM\necho $$ > "${pidFile}"\nwhile :; do sleep 1; done\n`);
    chmodSync(fakeUv, 0o755);

    const saved = {
      uv: process.env.SK_VISION_UV,
      venv: process.env.SK_VISION_VENV_DIR,
      python: process.env.SK_VISION_PYTHON,
    };
    process.env.SK_VISION_UV = fakeUv;
    process.env.SK_VISION_VENV_DIR = join(dir, "venv");
    delete process.env.SK_VISION_PYTHON;
    const proto = RuntimeClient.prototype as unknown as {
      hasMoondream(python: string): Promise<boolean>;
      hasUv(): Promise<boolean>;
    };
    const moondream = spyOn(proto, "hasMoondream").mockImplementation(async () => false);
    const uv = spyOn(proto, "hasUv").mockImplementation(async () => true);

    try {
      const client = new RuntimeClient({ pythonPath: join(dir, "missing-python"), timeoutMs: 1_000 });
      for (let i = 0; i < 100 && !existsSync(pidFile); i++) {
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      expect(existsSync(pidFile)).toBe(true);
      const pid = Number(readFileSync(pidFile, "utf8").trim());

      await client.close();
      let alive = true;
      try {
        process.kill(pid, 0);
      } catch {
        alive = false;
      }
      expect(alive).toBe(false);
      await Promise.race([
        client.ready,
        new Promise((_, reject) => setTimeout(() => reject(new Error("ready did not settle")), 2_000)),
      ]);
    } finally {
      moondream.mockRestore();
      uv.mockRestore();
      for (const [key, value] of [
        ["SK_VISION_UV", saved.uv],
        ["SK_VISION_VENV_DIR", saved.venv],
        ["SK_VISION_PYTHON", saved.python],
      ] as const) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  }, 10_000);

  it("kills an interpreter probe still running and stops before creating the venv", async () => {
    const dir = mkdtempSync(join(tmpdir(), "sk-vision-client-"));
    const pidFile = join(dir, "probe.pid");
    const fakePython = join(dir, "python");
    writeFileSync(fakePython, `#!/bin/sh\necho $$ > "${pidFile}"\nexec sleep 30\n`);
    chmodSync(fakePython, 0o755);
    const venv = join(dir, "venv");

    const saved = {
      venv: process.env.SK_VISION_VENV_DIR,
      python: process.env.SK_VISION_PYTHON,
    };
    process.env.SK_VISION_VENV_DIR = venv;
    delete process.env.SK_VISION_PYTHON;
    const notes: string[] = [];

    try {
      const client = new RuntimeClient({
        pythonPath: fakePython,
        timeoutMs: 1_000,
        notify: (m) => {
          notes.push(m.variant ?? "");
        },
      });
      for (let i = 0; i < 100 && !existsSync(pidFile); i++) {
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      expect(existsSync(pidFile)).toBe(true);
      const pid = Number(readFileSync(pidFile, "utf8").trim());

      await client.close();
      await Promise.race([
        client.ready,
        new Promise((_, reject) => setTimeout(() => reject(new Error("ready did not settle")), 2_000)),
      ]);

      let alive = true;
      for (let i = 0; i < 50 && alive; i++) {
        try {
          process.kill(pid, 0);
          await new Promise((resolve) => setTimeout(resolve, 20));
        } catch {
          alive = false;
        }
      }
      expect(alive).toBe(false);
      expect(existsSync(venv)).toBe(false);
      expect(notes).not.toContain("error");
    } finally {
      for (const [key, value] of [
        ["SK_VISION_VENV_DIR", saved.venv],
        ["SK_VISION_PYTHON", saved.python],
      ] as const) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  }, 10_000);
});
