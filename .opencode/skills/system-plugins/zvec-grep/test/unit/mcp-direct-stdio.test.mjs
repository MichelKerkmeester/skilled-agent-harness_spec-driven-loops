import assert from "node:assert/strict";
import test from "node:test";
import { parseArgs } from "../../dist/cli/args.js";
import { resolveStdioServerMode } from "../../dist/mcp/stdio-direct.js";

test("the stdio entry serves direct mode only when it is explicitly selected", () => {
  assert.equal(resolveStdioServerMode(undefined, undefined), "bridge");
  assert.equal(resolveStdioServerMode(undefined, ""), "bridge");
  assert.equal(resolveStdioServerMode(undefined, "auto"), "bridge");
  assert.equal(resolveStdioServerMode(undefined, "server"), "bridge");
  assert.equal(resolveStdioServerMode(undefined, "direct"), "direct");
  assert.equal(resolveStdioServerMode("direct", undefined), "direct");
  assert.equal(resolveStdioServerMode("auto", undefined), "bridge");
  assert.equal(resolveStdioServerMode("server", undefined), "bridge");
  // An explicit flag wins over the environment, in both directions.
  assert.equal(resolveStdioServerMode("direct", "server"), "direct");
  assert.equal(resolveStdioServerMode("server", "direct"), "bridge");
  assert.throws(
    () => resolveStdioServerMode(undefined, "sometimes"),
    /ZVEC_GREP_MODE must be direct, server, or auto/,
  );
});

test("--mode selects the stdio server backend and stays out of the daemon actions", () => {
  const parsed = parseArgs(["server", "--stdio", "--mode", "direct"]);
  assert.equal(parsed.options.serverStdio, true);
  assert.equal(parsed.options.mode, "direct");
  assert.equal(
    parseArgs(["server", "--stdio", "--mode=direct"]).options.mode,
    "direct",
  );
  assert.equal(
    parseArgs([
      "server",
      "--stdio",
      "--mode",
      "direct",
      "--mcp-toolset",
      "full",
    ]).options.mcpToolset,
    "full",
  );
  assert.equal(parseArgs(["server", "--stdio"]).options.mode, undefined);

  for (const args of [
    ["server", "on", "--mode", "direct"],
    ["server", "run", "--mode", "direct"],
    ["server", "off", "--mode", "direct"],
    ["server", "status", "--mode", "server"],
  ]) {
    assert.throws(
      () => parseArgs(args),
      /--mode can only be used with zg server --stdio/,
    );
  }
  assert.throws(
    () => parseArgs(["server", "--stdio", "--mode", "sometimes"]),
    /--mode must be direct, server, or auto/,
  );
});
