import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createPiFastModeExtension } from "../src/index";
import { DEFAULT_CONFIG, getUserConfigPath } from "../src/config";
import { HANDOFF_ENV } from "../src/types";

type FakePi = {
  registerFlag: ReturnType<typeof vi.fn>;
  registerCommand: ReturnType<typeof vi.fn>;
  getFlag: ReturnType<typeof vi.fn>;
  on: ReturnType<typeof vi.fn>;
};

const tempDirs: string[] = [];
const initialHandoff = process.env[HANDOFF_ENV];

afterEach(async () => {
  if (initialHandoff === undefined) {
    delete process.env[HANDOFF_ENV];
  } else {
    process.env[HANDOFF_ENV] = initialHandoff;
  }
  await Promise.all(
    tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })),
  );
});

function createFakePi(fastFlag: boolean): {
  pi: FakePi;
  handlers: Map<string, Function[]>;
} {
  const handlers = new Map<string, Function[]>();
  const pi: FakePi = {
    registerFlag: vi.fn(),
    registerCommand: vi.fn(),
    getFlag: vi.fn((name: string) => (name === "fast" ? fastFlag : undefined)),
    on: vi.fn((event: string, handler: Function) => {
      const list = handlers.get(event) ?? [];
      list.push(handler);
      handlers.set(event, list);
    }),
  };
  return { pi, handlers };
}

async function makeCase(
  configEnabled: boolean,
  fastFlag: boolean,
  handoff: string | undefined,
  model: { provider: string; id: string },
) {
  const root = await mkdtemp(join(tmpdir(), "pi-fast-mode-precedence-"));
  tempDirs.push(root);
  const cwd = join(root, "project");
  const agentDir = join(root, "agent");
  await mkdir(cwd, { recursive: true });
  await mkdir(join(agentDir, "extensions", "pi-fast-mode-w-subagent-support"), {
    recursive: true,
  });
  await writeFile(
    getUserConfigPath(agentDir),
    JSON.stringify({ enabled: configEnabled, targets: DEFAULT_CONFIG.targets }),
    "utf8",
  );

  if (handoff === undefined) {
    delete process.env[HANDOFF_ENV];
  } else {
    process.env[HANDOFF_ENV] = handoff;
  }

  const { pi, handlers } = createFakePi(fastFlag);
  createPiFastModeExtension({
    extensionDir: join(root, "global", "pi-fast-mode-w-subagent-support", "src"),
    agentDir,
  })(pi as any);
  const ctx = {
    cwd,
    model,
    hasUI: false,
    ui: { notify: vi.fn() },
  };
  const handler = handlers.get("session_start")?.[0];
  expect(handler).toBeTypeOf("function");
  await handler!({ type: "session_start", reason: "startup" }, ctx);

  return {
    enabled: JSON.parse(await readFile(getUserConfigPath(agentDir), "utf8"))
      .enabled,
    handoff: process.env[HANDOFF_ENV],
    handlers,
    ctx,
  };
}

describe("session_start handoff precedence", () => {
  it("lets explicit --fast true override inherited false and config", async () => {
    const result = await makeCase(false, true, "0", {
      provider: "openai",
      id: "gpt-5.4",
    });

    expect(result.enabled).toBe(true);
    expect(result.handoff).toBe("1");
  });

  it("uses inherited 1 when no explicit flag is set", async () => {
    const result = await makeCase(false, false, "1", {
      provider: "openai",
      id: "gpt-5.4",
    });

    expect(result.enabled).toBe(true);
    expect(result.handoff).toBe("1");
  });

  it("uses inherited 0 when no explicit flag is set", async () => {
    const result = await makeCase(true, false, "0", {
      provider: "openai",
      id: "gpt-5.4",
    });

    expect(result.enabled).toBe(false);
    expect(result.handoff).toBe("0");
  });

  it.each([undefined, "true", "2", ""])(
    "falls back to config for invalid or unset handoff %s",
    async (handoff) => {
      const result = await makeCase(true, false, handoff, {
        provider: "openai",
        id: "gpt-5.4",
      });

      expect(result.enabled).toBe(true);
      expect(result.handoff).toBe("1");
    },
  );

  it("does not bypass model or target matching", async () => {
    const result = await makeCase(false, false, "1", {
      provider: "anthropic",
      id: "claude-3",
    });
    const handler = result.handlers.get("before_provider_request")?.[0];

    expect(result.enabled).toBe(true);
    expect(result.handoff).toBe("1");
    expect(
      handler!(
        { type: "before_provider_request", payload: { model: "claude-3" } },
        result.ctx,
      ),
    ).toBeUndefined();
  });
});
