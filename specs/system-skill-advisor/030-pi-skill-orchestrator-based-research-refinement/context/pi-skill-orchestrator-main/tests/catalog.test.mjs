import test from "node:test";
import assert from "node:assert/strict";
import {
  containsKnownNativeSkillCatalog,
  containsPotentialNativeSkillCatalog,
  replaceNativeSkillCatalog,
  toSkillRecords,
} from "../src/catalog.ts";

const rawSkills = [
  { name: "visible-one", description: "Visible description", filePath: "/skills/visible-one/SKILL.md", disableModelInvocation: false },
  { name: "manual-only", description: "Must stay manual", filePath: "/skills/manual-only/SKILL.md", disableModelInvocation: true },
];

const records = toSkillRecords(rawSkills);

function piNativeBlock(guidance) {
  return [
    "BASE PREFIX",
    "",
    "The following skills provide specialized instructions for specific tasks.",
    guidance,
    "When a skill file references a relative path, resolve it against the skill directory (parent of SKILL.md / dirname of the path) and use that absolute path in tool commands.",
    "",
    "<available_skills>",
    "  <skill>",
    "    <name>visible-one</name>",
    "    <description>Visible description</description>",
    "    <location>/skills/visible-one/SKILL.md</location>",
    "  </skill>",
    "</available_skills>",
    "TAIL",
  ].join("\n");
}

test("Pi prompt records preserve disable-model-invocation visibility", () => {
  assert.equal(records.find((r) => r.name === "visible-one").modelVisible, true);
  assert.equal(records.find((r) => r.name === "manual-only").modelVisible, false);
});

test("XML fallback removes Pi's current native skill catalog without leaking names/descriptions/paths", () => {
  for (const guidance of [
    "Use the read tool to load a skill's file when the task matches its description.",
    "Use bash to load a skill's file when the task matches its description.",
  ]) {
    const prompt = piNativeBlock(guidance);
    assert.equal(containsKnownNativeSkillCatalog(prompt, records), true);
    const next = replaceNativeSkillCatalog(prompt, records, "# Skill Orchestrator — Active group \"Film\"");
    assert.match(next, /BASE PREFIX/);
    assert.match(next, /Skill Orchestrator/);
    assert.match(next, /TAIL/);
    assert.doesNotMatch(next, /available_skills|visible-one|Visible description|\/skills\/visible-one/);
    assert.doesNotMatch(next, /Use the read tool|Use bash to load/);
  }
});

test("catalog fallback leaves unrelated XML untouched when no known skill name is present", () => {
  const prompt = "before\n<available_skills>\n<skill><name>other</name></skill>\n</available_skills>\nafter";
  assert.equal(containsKnownNativeSkillCatalog(prompt, records), false);
  assert.equal(containsPotentialNativeSkillCatalog(prompt, records), false);
  assert.equal(replaceNativeSkillCatalog(prompt, records, "replacement"), prompt);
});

test("native preamble allows safe stripping even if structured skill records are temporarily unavailable", () => {
  const prompt = piNativeBlock("Use the read tool to load a skill's file when the task matches its description.");
  const next = replaceNativeSkillCatalog(prompt, [], "SCOPE-STUB");
  assert.match(next, /SCOPE-STUB/);
  assert.doesNotMatch(next, /visible-one|available_skills|Visible description/);
});


test("catalog stripping preserves unrelated earlier XML and removes a later Pi native catalog", () => {
  const unrelated = [
    "<available_skills>",
    "  <skill><name>other-extension-skill</name></skill>",
    "</available_skills>",
  ].join("\n");
  const native = piNativeBlock("Use the read tool to load a skill's file when the task matches its description.");
  const prompt = `HEAD\n${unrelated}\n${native}`;
  const next = replaceNativeSkillCatalog(prompt, records, "SCOPE-STUB");
  assert.match(next, /other-extension-skill/);
  assert.doesNotMatch(next, /<name>visible-one<\/name>|Visible description|\/skills\/visible-one\/SKILL\.md/);
  assert.equal((next.match(/SCOPE-STUB/g) ?? []).length, 1);
});

test("catalog stripping removes duplicate Pi native catalogs but inserts one scope stub", () => {
  const first = piNativeBlock("Use the read tool to load a skill's file when the task matches its description.");
  const second = piNativeBlock("Use bash to load a skill's file when the task matches its description.");
  const next = replaceNativeSkillCatalog(`${first}\nMIDDLE\n${second}`, records, "SCOPE-STUB");
  assert.equal((next.match(/SCOPE-STUB/g) ?? []).length, 1);
  assert.equal((next.match(/<name>visible-one<\/name>/g) ?? []).length, 0);
  assert.equal((next.match(/The following skills provide specialized instructions/g) ?? []).length, 0);
  assert.match(next, /MIDDLE/);
});


test("potential catalog detection catches malformed/future eager metadata that safe stripping leaves intact", () => {
  const malformed = [
    "BASE",
    "<available_skills>",
    "  <skill>",
    "    <name>visible-one</name>",
    "    <location>/skills/visible-one/SKILL.md</location>",
    // Deliberately no closing available_skills tag: safe deletion must not
    // guess how much unrelated prompt text to remove.
    "TAIL",
  ].join("\n");
  assert.equal(containsKnownNativeSkillCatalog(malformed, records), false);
  assert.equal(replaceNativeSkillCatalog(malformed, records, "SCOPE-STUB"), malformed);
  assert.equal(containsPotentialNativeSkillCatalog(malformed, records), true);

  const futureFormat = "skills-vNext: visible-one @ /skills/visible-one/SKILL.md";
  assert.equal(containsKnownNativeSkillCatalog(futureFormat, records), false);
  assert.equal(containsPotentialNativeSkillCatalog(futureFormat, records), true);
});
