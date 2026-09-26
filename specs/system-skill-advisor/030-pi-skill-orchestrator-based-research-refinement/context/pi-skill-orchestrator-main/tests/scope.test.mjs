import test from "node:test";
import assert from "node:assert/strict";
import { globalFallbackRecords, groupMemberRecords, profileMemberRecords, resolveSkillScope, renderScopeCatalog } from "../src/scope.ts";

const records = [
  { name: "alpha", description: "Alpha skill", filePath: "/alpha/SKILL.md" },
  { name: "beta", description: "Beta skill", filePath: "/beta/SKILL.md" },
  { name: "gamma", description: "Gamma skill", filePath: "/gamma/SKILL.md" },
];

const config = {
  version: 1,
  groups: [
    { id: "review", name: "Review", description: "Review work", shortcutEnabled: true, order: 10 },
    { id: "write", name: "Write", description: "Writing work", shortcutEnabled: true, order: 20 },
  ],
  memberships: { alpha: ["review"], beta: ["review", "write"] },
  autoload: {},
  ignoreAutoDetected: {},
  catalogDescriptionMax: 160,
};

const profile = { id: "test", name: "Test" };

test("group scope indexes members without putting their metadata in the prompt", () => {
  assert.deepEqual(groupMemberRecords("review", config, records).map((record) => record.name), ["alpha", "beta"]);
  const scope = resolveSkillScope(
    { kind: "group", profileId: "test", groupId: "review", groupName: "Review" },
    config,
    records,
    profile,
  );
  assert.equal(scope.restricted, true);
  assert.deepEqual([...scope.allowedNames].sort(), ["alpha", "beta"]);
  const catalog = renderScopeCatalog(scope, config);
  assert.doesNotMatch(catalog, /Alpha skill/);
  assert.doesNotMatch(catalog, /Beta skill/);
  assert.doesNotMatch(catalog, /Gamma skill/);
  assert.doesNotMatch(catalog, /\balpha\b|\bbeta\b|\bgamma\b/i);
  assert.match(catalog, /2 lazy skill candidates are indexed outside the model context/i);
  assert.match(catalog, /skill_search/);
  assert.match(catalog, /scope `global`/);
});

test("profile scope is the union of skills assigned to any group in that profile", () => {
  assert.deepEqual(profileMemberRecords(config, records).map((record) => record.name), ["alpha", "beta"]);
  const scope = resolveSkillScope(
    { kind: "profile", profileId: "test", profileName: "Test" },
    config,
    records,
    profile,
  );
  assert.deepEqual([...scope.allowedNames].sort(), ["alpha", "beta"]);
  assert.equal(scope.restricted, true);
});

test("empty profiles expose zero automatic candidates instead of falling back to all skills", () => {
  const emptyConfig = { ...config, groups: [], memberships: {} };
  const scope = resolveSkillScope(
    { kind: "profile", profileId: "test", profileName: "Test" },
    emptyConfig,
    records,
    profile,
  );
  assert.equal(scope.emptyProfileFallback, false);
  assert.equal(scope.restricted, true);
  assert.deepEqual([...scope.allowedNames], []);
  assert.deepEqual(scope.records, []);
});


test("global fallback searches outside a restrictive scope without changing that scope", () => {
  const scope = resolveSkillScope(
    { kind: "group", profileId: "test", groupId: "review", groupName: "Review" },
    config,
    records,
    profile,
  );
  assert.deepEqual(globalFallbackRecords(scope, records).map((record) => record.name), ["gamma"]);
  assert.equal(scope.kind, "group");
  assert.deepEqual([...scope.allowedNames].sort(), ["alpha", "beta"]);
});

test("global fallback from an empty profile can lazily search every installed skill", () => {
  const emptyConfig = { ...config, groups: [], memberships: {} };
  const scope = resolveSkillScope(
    { kind: "profile", profileId: "test", profileName: "Test" },
    emptyConfig,
    records,
    profile,
  );
  assert.deepEqual(globalFallbackRecords(scope, records).map((record) => record.name), ["alpha", "beta", "gamma"]);
});

test("stale group scope falls back to the current profile scope", () => {
  const scope = resolveSkillScope(
    { kind: "group", profileId: "old-profile", groupId: "review", groupName: "Review" },
    config,
    records,
    profile,
  );
  assert.equal(scope.kind, "profile");
  assert.deepEqual([...scope.allowedNames].sort(), ["alpha", "beta"]);
});


test("scope prompt size stays effectively constant with forty-plus skills", () => {
  const manyRecords = Array.from({ length: 48 }, (_, i) => ({
    name: `film-skill-${i}`,
    description: `Very detailed filmmaking workflow description number ${i} with camera, lighting, production, editing, and continuity instructions`,
    filePath: `/film/${i}/SKILL.md`,
  }));
  const manyConfig = {
    ...config,
    groups: [{ id: "film", name: "Film", description: "Film making", shortcutEnabled: true, order: 10 }],
    memberships: Object.fromEntries(manyRecords.map((record) => [record.name, ["film"]])),
  };
  const scope = resolveSkillScope(
    { kind: "group", profileId: "test", groupId: "film", groupName: "Film" },
    manyConfig,
    manyRecords,
    profile,
  );
  const catalog = renderScopeCatalog(scope, manyConfig);
  assert.match(catalog, /48 lazy skill candidates are indexed outside the model context/i);
  assert.doesNotMatch(catalog, /film-skill-0|film-skill-47|Very detailed filmmaking workflow/);
  assert.ok(catalog.length < 800, `scope stub unexpectedly large: ${catalog.length} chars`);
});


test("disable-model-invocation skills stay out of active and global automatic discovery", () => {
  const mixed = [
    ...records,
    { name: "manual-only", description: "Manual helper", filePath: "/manual/SKILL.md", modelVisible: false },
  ];
  const mixedConfig = {
    ...config,
    memberships: { ...config.memberships, "manual-only": ["review"] },
  };
  const groupScope = resolveSkillScope(
    { kind: "group", profileId: "test", groupId: "review", groupName: "Review" },
    mixedConfig,
    mixed,
    profile,
  );
  assert.deepEqual(groupScope.records.map((record) => record.name), ["alpha", "beta"]);
  assert.deepEqual(globalFallbackRecords(groupScope, mixed).map((record) => record.name), ["gamma"]);

  const allScope = resolveSkillScope({ kind: "all" }, mixedConfig, mixed, profile);
  assert.equal(allScope.allowedNames.has("manual-only"), false);
});

test("global fallback is empty when the active scope already includes every model-invokable skill", () => {
  const scope = resolveSkillScope({ kind: "all" }, config, records, profile);
  assert.equal(scope.restricted, false);
  assert.deepEqual(globalFallbackRecords(scope, records), []);
});


test("scope labels quote punctuation so user-controlled names cannot alter prompt structure", () => {
  const quotedConfig = {
    ...config,
    groups: [{ id: "camera-a", name: 'Camera "A"', description: "", shortcutEnabled: true, order: 10 }],
    memberships: { alpha: ["camera-a"] },
  };
  const scope = resolveSkillScope(
    { kind: "group", profileId: "test", groupId: "camera-a", groupName: 'Camera "A"' },
    quotedConfig,
    records,
    profile,
  );
  const prompt = renderScopeCatalog(scope, quotedConfig);
  assert.match(prompt, /Active group "Camera \\"A\\""/);
  assert.doesNotMatch(prompt, /Alpha skill|Beta skill|Gamma skill/);
});
