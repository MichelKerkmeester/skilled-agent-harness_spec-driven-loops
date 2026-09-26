// The Gemini CLI extension is built from the Claude Code plugin at release
// time. Gemini only finds it if gemini-extension.json sits at the archive root
// and carries the release's version, and a command only works if its TOML
// passes the user's arguments where the Claude Code command did.
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

import { buildExtension, geminiCommand } from "../../scripts/gemini-extension.mjs";

const repository = resolve(import.meta.dirname, "../..");

test("a command keeps its description and passes its arguments as {{args}}", () => {
  const toml = geminiCommand(
    '---\ndescription: Check "this" code.\ndisable-model-invocation: true\n---\n\nRun `npx supercov security $ARGUMENTS`.\n',
  );
  assert.equal(toml, "description = \"Check \\\"this\\\" code.\"\nprompt = '''\nRun `npx supercov security {{args}}`.\n'''\n");
});

test("a prompt that would end the TOML string is refused", () => {
  assert.throws(() => geminiCommand("---\ndescription: x\n---\nsay '''\n"), /'''/);
});

test("the extension carries the release version, the skills and every command", () => {
  const directory = mkdtempSync(join(tmpdir(), "supercov-gemini-"));
  try {
    buildExtension(directory);
    const manifest = JSON.parse(readFileSync(join(directory, "gemini-extension.json"), "utf8"));
    const version = JSON.parse(readFileSync(join(repository, "package.json"), "utf8")).version;
    assert.equal(manifest.name, "supercov");
    assert.equal(manifest.version, version);
    for (const skill of readdirSync(join(repository, "plugins/supercov/skills"))) {
      assert.ok(existsSync(join(directory, "skills", skill, "SKILL.md")), `skill ${skill}`);
    }
    const commands = readdirSync(join(repository, "plugins/supercov/commands")).map((name) => name.replace(/\.md$/, ".toml"));
    assert.deepEqual(readdirSync(join(directory, "commands/supercov")).sort(), commands.sort());
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
