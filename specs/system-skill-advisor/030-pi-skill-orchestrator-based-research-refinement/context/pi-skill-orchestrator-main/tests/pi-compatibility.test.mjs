import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

const PI_CORE_PEERS = [
  "@earendil-works/pi-coding-agent",
  "@earendil-works/pi-tui",
  "typebox",
];

test("Pi-provided core modules follow Pi's documented peer dependency contract", () => {
  assert.ok(packageJson.peerDependencies, "peerDependencies must be present");
  for (const name of PI_CORE_PEERS) {
    assert.equal(
      packageJson.peerDependencies[name],
      "*",
      `${name} must use the Pi-documented '*' peer range so the running Pi supplies its matching core module`,
    );
    assert.equal(packageJson.dependencies?.[name], undefined, `${name} must not be bundled as a normal dependency`);
  }
});

test("package declares the extension through Pi's package manifest and matches Pi's current Node minimum", () => {
  assert.deepEqual(packageJson.pi?.extensions, ["./src/index.ts"]);
  assert.ok(packageJson.keywords?.includes("pi-package"));
  assert.equal(packageJson.engines?.node, ">=22.19.0");
});

test("production code imports Pi APIs only from supported public package roots", () => {
  const sourceDir = path.join(root, "src");
  const files = fs.readdirSync(sourceDir).filter((name) => name.endsWith(".ts"));
  const forbiddenDeepImport = /from\s+["'](?:@earendil-works\/pi-(?:coding-agent|tui|ai|agent-core)\/|typebox\/)/;

  for (const file of files) {
    const text = fs.readFileSync(path.join(sourceDir, file), "utf8");
    assert.doesNotMatch(text, forbiddenDeepImport, `${file} must not depend on Pi internal/deep module paths`);
  }
});

test("all model-facing tools keep explicit parameter schemas for current Pi registration validation", () => {
  const text = fs.readFileSync(path.join(root, "src", "index.ts"), "utf8");
  const registrations = [...text.matchAll(/pi\.registerTool\(\{([\s\S]*?)\n\s*\}\);/g)].map((match) => match[1]);
  assert.equal(registrations.length, 4, "expected token_tool_search, token_retrieve, skill_search, and skill model-facing tools");
  for (const registration of registrations) {
    assert.match(registration, /\bparameters\s*:/, "every registerTool call must provide a parameters schema");
  }
});


test("token saver uses current Pi public hooks for reversible output filtering and deferred tools", () => {
  const text = fs.readFileSync(path.join(root, "src", "index.ts"), "utf8");
  assert.match(text, /pi\.on\("tool_result"/, "Token Saver must filter tool results before later model turns");
  assert.match(text, /pi\.on\("before_provider_request"/, "Token Saver must shape provider requests through Pi's public hook");
  assert.match(text, /pi\.getAllTools\(\)/, "deferred tool search must use Pi's public tool catalogue");
  assert.match(text, /pi\.getActiveTools\(\)/);
  assert.match(text, /pi\.setActiveTools\(/);
  assert.match(text, /pi\.registerCommand\("token-saver"/);
  assert.match(text, /name:\s*TOKEN_TOOL_SEARCH_TOOL/);
  assert.match(text, /name:\s*TOKEN_RETRIEVE_TOOL/);
});


test("token saver restores deferred tools and removes helper schemas during Pi session shutdown", () => {
  const text = fs.readFileSync(path.join(root, "src", "index.ts"), "utf8");
  const match = text.match(/pi\.on\("session_shutdown",[\s\S]*?\n\s*\}\);/);
  assert.ok(match, "Token Saver must clean up its active-tool changes on session replacement, reload, and quit");
  assert.match(match[0], /restoreTokenSaverToolState\(\)/);
  assert.match(match[0], /tokenSaver\.resetSession\(\)/);
});

test("routine effort routing aggregates all tool results instead of trusting the last parallel result", () => {
  const text = fs.readFileSync(path.join(root, "src", "index.ts"), "utf8");
  assert.match(text, /updateRoutineContinuationState\(/);
  assert.match(text, /routineContinuation === "eligible"/);
});
