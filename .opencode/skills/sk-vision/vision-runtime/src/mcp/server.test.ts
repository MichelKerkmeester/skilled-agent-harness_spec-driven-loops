import { afterAll, describe, expect, it } from "bun:test";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { installMcpLifecycleGuards } from "./server.js";

const ROOT = join(import.meta.dir, "..", "..");
const SERVER = join(ROOT, "src", "mcp", "server.ts");

function resolvePython(): string {
  const candidates = [
    join(homedir(), ".cache", "sk-vision", "venv", "bin", "python"),
    join(ROOT, ".venv", "bin", "python"),
  ];
  return candidates.find(existsSync) ?? "python3";
}

function testEnvironment(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) env[key] = value;
  }
  env.SK_VISION_PYTHON = resolvePython();
  env.SK_VISION_DISABLE_AUTO_PROVISION = "1";
  return env;
}

const transport = new StdioClientTransport({
  command: process.execPath,
  args: ["run", SERVER],
  cwd: ROOT,
  env: testEnvironment(),
  stderr: "pipe",
});
const client = new Client({ name: "sk-vision-mcp-test", version: "1.0.0" });

afterAll(async () => {
  await client.close();
});

describe("sk-vision MCP stdio transport", () => {
  it("lists 13 tools and serves status without loading model weights", async () => {
    await client.connect(transport);

    const listed = await client.listTools();
    expect(listed.tools).toHaveLength(13);
    expect(listed.tools.map((tool) => tool.name)).toContain("sk_vision_status");

    const status = await client.callTool({
      name: "sk_vision_status",
      arguments: {},
    });
    expect(status.isError).not.toBe(true);
    expect(Array.isArray(status.content)).toBe(true);
    if (!Array.isArray(status.content)) throw new Error("status content is not an array");
    expect(status.content).toHaveLength(1);
    const content = status.content[0] as { type?: unknown; text?: unknown };
    expect(content.type).toBe("text");
    expect(typeof content.text).toBe("string");
    expect(content.text).toContain("provider: photon");
    expect(content.text).toContain("loaded: false");
  });
});

function deferred<T>(): { promise: Promise<T>; resolve: (v: T) => void } {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

describe("installMcpLifecycleGuards", () => {
  it("shuts down on stdin end", async () => {
    const server = { server: { onclose: undefined as (() => void) | undefined } };
    const close = deferred<void>();
    let closeCalls = 0;
    const client = {
      close: () => {
        closeCalls += 1;
        return close.promise;
      },
    };
    const exits: number[] = [];
    const handle = installMcpLifecycleGuards({
      server: server as unknown as Parameters<typeof installMcpLifecycleGuards>[0]["server"],
      client: client as unknown as Parameters<typeof installMcpLifecycleGuards>[0]["client"],
      exit: (code) => exits.push(code),
    });
    process.stdin.emit("end");
    expect(closeCalls).toBe(1);
    close.resolve();
    await close.promise;
    expect(exits).toEqual([0]);
    handle.dispose();
    process.stdin.removeAllListeners("end");
    process.stdin.removeAllListeners("close");
  });

  it("is idempotent across multiple shutdown events", async () => {
    const server = { server: { onclose: undefined as (() => void) | undefined } };
    const close = deferred<void>();
    let closeCalls = 0;
    const client = {
      close: () => {
        closeCalls += 1;
        return close.promise;
      },
    };
    const exits: number[] = [];
    const handle = installMcpLifecycleGuards({
      server: server as unknown as Parameters<typeof installMcpLifecycleGuards>[0]["server"],
      client: client as unknown as Parameters<typeof installMcpLifecycleGuards>[0]["client"],
      exit: (code) => exits.push(code),
    });
    process.stdin.emit("end");
    process.emit("SIGTERM" as NodeJS.Signals);
    if (server.server.onclose !== undefined) server.server.onclose();
    expect(closeCalls).toBe(1);
    expect(exits).toEqual([]);
    close.resolve();
    await close.promise;
    expect(exits).toEqual([0]);
    handle.dispose();
    process.stdin.removeAllListeners("end");
    process.stdin.removeAllListeners("close");
  });

  it("exits when reparented to init", async () => {
    const server = { server: { onclose: undefined as (() => void) | undefined } };
    const close = deferred<void>();
    let closeCalls = 0;
    const client = {
      close: () => {
        closeCalls += 1;
        return close.promise;
      },
    };
    const exits: number[] = [];
    const handle = installMcpLifecycleGuards({
      server: server as unknown as Parameters<typeof installMcpLifecycleGuards>[0]["server"],
      client: client as unknown as Parameters<typeof installMcpLifecycleGuards>[0]["client"],
      getParentPid: () => 1,
      watchIntervalMs: 5,
      exit: (code) => exits.push(code),
    });
    await new Promise((res) => setTimeout(res, 40));
    // The watchdog fired (client.close ran) and stays idempotent despite
    // repeated ticks; exit is gated behind the close promise, like the paths above.
    expect(closeCalls).toBe(1);
    close.resolve();
    await close.promise;
    expect(exits).toEqual([0]);
    handle.dispose();
    process.stdin.removeAllListeners("end");
    process.stdin.removeAllListeners("close");
  });
});
