import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { toSkillRecords, toSkillRecordsFromCommands, mergeSkillRecords } from "../src/catalog.ts";

test("skill records can be reconstructed from Pi's public command catalogue", () => {
  const records = toSkillRecordsFromCommands([
    {
      name: "skill:tdd",
      description: "Test driven development",
      source: "skill",
      sourceInfo: { path: "/home/user/.pi/agent/skills/tdd/SKILL.md" },
    },
    {
      name: "skill:architecture-review",
      description: "Review architecture",
      source: "skill",
      sourceInfo: { path: "/home/user/.agents/skills/architecture-review/SKILL.md" },
    },
    {
      name: "skill-profile",
      description: "Profile selector",
      source: "extension",
      sourceInfo: { path: "/tmp/extension.ts" },
    },
  ]);

  assert.deepEqual(records, [
    {
      name: "architecture-review",
      description: "Review architecture",
      filePath: "/home/user/.agents/skills/architecture-review/SKILL.md",
      source: "skill-command",
    },
    {
      name: "tdd",
      description: "Test driven development",
      filePath: "/home/user/.pi/agent/skills/tdd/SKILL.md",
      source: "skill-command",
    },
  ]);
});

test("cached prompt records win while command records fill missing skills", () => {
  const cached = [
    { name: "tdd", description: "Cached TDD", filePath: "/cached/tdd/SKILL.md" },
  ];
  const commands = toSkillRecordsFromCommands([
    {
      name: "skill:tdd",
      description: "Command TDD",
      source: "skill",
      sourceInfo: { path: "/command/tdd/SKILL.md" },
    },
    {
      name: "skill:write-prd",
      description: "Write PRD",
      source: "skill",
      sourceInfo: { path: "/command/write-prd/SKILL.md" },
    },
  ]);

  assert.deepEqual(mergeSkillRecords(cached, commands), [
    { name: "tdd", description: "Cached TDD", filePath: "/cached/tdd/SKILL.md" },
    { name: "write-prd", description: "Write PRD", filePath: "/command/write-prd/SKILL.md", source: "skill-command" },
  ]);
});

test("non-command extension contexts never need getSystemPromptOptions for runtime skill discovery", () => {
  const source = new URL("../src/index.ts", import.meta.url);
  const text = fs.readFileSync(source, "utf8");
  const occurrences = text.match(/ctx\.getSystemPromptOptions\(\)/g) ?? [];
  assert.equal(occurrences.length, 1, "only the ExtensionCommandContext helper may call getSystemPromptOptions");
});


test("authoritative prompt records preserve manual-only visibility over command metadata", () => {
  const prompt = toSkillRecords([
    { name: "manual", description: "manual", filePath: "/manual/SKILL.md", disableModelInvocation: true },
  ]);
  const command = toSkillRecordsFromCommands([
    { name: "skill:manual", description: "manual", source: "skill", sourceInfo: { path: "/manual/SKILL.md" } },
  ]);
  const merged = mergeSkillRecords(prompt, command);
  assert.equal(merged[0].modelVisible, false);
});


test("indexed skill metadata is single-line, terminal-control-safe, and bounded", () => {
  const [record] = toSkillRecords([{
    name: "safe-name",
    description: `line one\nline two\x1b[31m red ${"x".repeat(1200)}`,
    filePath: "/safe/SKILL.md",
  }]);
  assert.equal(record.description.includes("\n"), false);
  assert.equal(record.description.includes("\x1b"), false);
  assert.ok(record.description.length <= 1024);
});

test("skill records with terminal-control characters in names are excluded from orchestrator indexing", () => {
  assert.deepEqual(toSkillRecords([{
    name: "bad\x1b[31m-name",
    description: "unsafe terminal name",
    filePath: "/bad/SKILL.md",
  }]), []);
});
