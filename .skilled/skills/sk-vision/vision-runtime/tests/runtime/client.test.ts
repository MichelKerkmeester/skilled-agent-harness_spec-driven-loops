// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Client Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, spyOn } from "bun:test";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuntimeClient } from "../../src/runtime/client.js";

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

describe("RuntimeClient probes and startup", () => {
  it("clears the startup ping timer after a fast ping", async () => {
    const dir = mkdtempSync(join(tmpdir(), "sk-vision-client-"));
    const stub = join(dir, "python");
    writeFileSync(
      stub,
      `#!/bin/sh
while read -r line; do
  id=$(printf '%s' "$line" | sed -E 's/.*"id":(-?[0-9]+).*/\\1/')
  [ "$id" = "-1" ] && exit 0
  printf '{"id":%s,"result":{}}\\n' "$id"
done
`,
    );
    chmodSync(stub, 0o755);

    const saved = {
      python: process.env.SK_VISION_PYTHON,
    };
    process.env.SK_VISION_PYTHON = stub;

    type TimerHandle = ReturnType<typeof setTimeout>;
    const realSetTimeout = globalThis.setTimeout;
    const realClearTimeout = globalThis.clearTimeout;
    const pingTimers: TimerHandle[] = [];
    const cleared = new Set<TimerHandle>();
    const refAtClear = new Map<TimerHandle, boolean>();
    globalThis.setTimeout = ((
      fn: (...args: unknown[]) => void,
      ms?: number,
      ...rest: unknown[]
    ) => {
      const handle = (realSetTimeout as unknown as (...args: unknown[]) => TimerHandle)(
        fn,
        ms,
        ...rest,
      );
      if (ms === 15_000) pingTimers.push(handle);
      return handle;
    }) as unknown as typeof globalThis.setTimeout;
    globalThis.clearTimeout = ((handle?: TimerHandle) => {
      if (handle !== undefined) {
        cleared.add(handle);
        refAtClear.set(handle, (handle as unknown as { hasRef(): boolean }).hasRef());
      }
      (realClearTimeout as unknown as (handle?: TimerHandle) => void)(handle);
    }) as unknown as typeof globalThis.clearTimeout;

    let client: RuntimeClient | undefined;
    try {
      client = new RuntimeClient({ timeoutMs: 2_000 });
      await client.ready;
    } finally {
      globalThis.setTimeout = realSetTimeout;
      globalThis.clearTimeout = realClearTimeout;
      if (saved.python === undefined) delete process.env.SK_VISION_PYTHON;
      else process.env.SK_VISION_PYTHON = saved.python;
    }

    expect(pingTimers.length).toBe(1);
    for (const handle of pingTimers) {
      expect(cleared.has(handle)).toBe(true);
      expect(refAtClear.get(handle)).toBe(false);
    }
    await client?.close();
  }, 10_000);

  it("removes only a venv it made when close() lands during mkdir", async () => {
    const dir = mkdtempSync(join(tmpdir(), "sk-vision-client-"));
    const venv = join(dir, "venv");
    const existing = join(dir, "existing-venv");
    mkdirSync(existing);

    const saved = {
      venv: process.env.SK_VISION_VENV_DIR,
      python: process.env.SK_VISION_PYTHON,
      provision: process.env.SK_VISION_DISABLE_AUTO_PROVISION,
    };
    process.env.SK_VISION_VENV_DIR = existing;
    delete process.env.SK_VISION_PYTHON;
    delete process.env.SK_VISION_DISABLE_AUTO_PROVISION;

    try {
      const first: RuntimeClient = new RuntimeClient({
        pythonPath: join(dir, "missing-python"),
        timeoutMs: 1_000,
        notify: (m) => {
          if (m.message.startsWith("Installing")) void first.close();
        },
      });
      await first.ready.catch(() => undefined);
      expect(existsSync(existing)).toBe(true);

      process.env.SK_VISION_VENV_DIR = venv;
      const client: RuntimeClient = new RuntimeClient({
        pythonPath: join(dir, "missing-python"),
        timeoutMs: 1_000,
        notify: (m) => {
          if (m.message.startsWith("Installing")) void client.close();
        },
      });
      await client.ready.catch(() => undefined);
      expect(existsSync(venv)).toBe(false);
    } finally {
      for (const [key, value] of [
        ["SK_VISION_VENV_DIR", saved.venv],
        ["SK_VISION_PYTHON", saved.python],
        ["SK_VISION_DISABLE_AUTO_PROVISION", saved.provision],
      ] as const) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  }, 10_000);

  it("treats a probe that outlives its timeout as present", async () => {
    const dir = mkdtempSync(join(tmpdir(), "sk-vision-client-"));
    const stub = join(dir, "python");
    writeFileSync(stub, `#!/bin/sh\nsleep 1\nexit 1\n`);
    chmodSync(stub, 0o755);

    const saved = {
      probe: process.env.SK_VISION_PROBE_TIMEOUT_MS,
    };
    process.env.SK_VISION_PROBE_TIMEOUT_MS = "100";

    try {
      const probe = Object.assign(Object.create(RuntimeClient.prototype), {
        probes: new AbortController(),
      }) as unknown as { hasMoondream(python: string): Promise<boolean> };
      expect(await probe.hasMoondream(stub)).toBe(true);
    } finally {
      if (saved.probe === undefined) delete process.env.SK_VISION_PROBE_TIMEOUT_MS;
      else process.env.SK_VISION_PROBE_TIMEOUT_MS = saved.probe;
    }
  }, 10_000);
});
