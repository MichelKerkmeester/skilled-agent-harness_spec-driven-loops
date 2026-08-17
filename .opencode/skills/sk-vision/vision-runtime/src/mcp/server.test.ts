import { afterAll, describe, expect, it } from "bun:test";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

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
