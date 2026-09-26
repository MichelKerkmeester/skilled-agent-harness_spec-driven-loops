import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const source = fs.readFileSync(path.resolve('src/index.ts'), 'utf8');
const uiSource = fs.readFileSync(path.resolve('src/ui.ts'), 'utf8');

test('/skill:Group activates a lazy candidate scope and never bulk-loads group bodies', () => {
  const start = source.indexOf('if (namespaced.value.kind === "group"');
  const end = source.indexOf('// Group shortcuts are intercepted', start);
  assert.ok(start >= 0 && end > start, 'namespaced group branch must exist');
  const branch = source.slice(start, end);
  assert.match(branch, /groupMemberRecords\(group\.id/);
  assert.match(branch, /activeScope = \{/);
  assert.match(branch, /kind: "group"/);
  assert.match(branch, /formatScopeNotification\(scope\)/);
  assert.match(branch, /if \(!task\) return \{ action: "handled" as const \}/);
  assert.match(branch, /return \{ action: "transform" as const, text: task \}/);
  assert.doesNotMatch(branch, /loadRoots\(/);
  assert.doesNotMatch(branch, /queueBundleForNextTurn/);
});

test('/Group shortcut uses the same lazy candidate-scope behavior', () => {
  const start = source.indexOf('const shortcut = parseShortcut');
  const noSkillEnd = source.indexOf('    try {', start);
  assert.ok(start >= 0 && noSkillEnd > start, 'short group branch must exist');
  const branch = source.slice(start, noSkillEnd);
  assert.match(branch, /if \(!skill\) \{/);
  assert.match(branch, /groupMemberRecords\(group\.id/);
  assert.match(branch, /activeScope = \{/);
  assert.match(branch, /kind: "group"/);
  assert.match(branch, /if \(!task\) return \{ action: "handled" as const \}/);
  assert.match(branch, /return \{ action: "transform" as const, text: task \}/);
  assert.doesNotMatch(branch, /loadRoots\(/);
  assert.doesNotMatch(branch, /loadBundle\(/);
});

test('explicit /Group:skill still lazy-loads only that selected root plus dependencies', () => {
  const start = source.indexOf('    try {', source.indexOf('const shortcut = parseShortcut'));
  const end = source.indexOf('  });\n\n  pi.registerTool', start);
  assert.ok(start >= 0 && end > start, 'explicit group-member branch must exist');
  const branch = source.slice(start, end);
  assert.match(branch, /loadBundle\(skill\.name/);
  assert.doesNotMatch(branch, /loadRoots\(roots/);
});

test('manager Enter on a group returns a scope action, not a multi-skill load', () => {
  const start = uiSource.indexOf('if (matchesKey(data, Key.enter))', uiSource.indexOf('if (matchesKey(data, Key.down))', 9000));
  const end = uiSource.indexOf('    if (data === " ")', start);
  assert.ok(start >= 0 && end > start, 'manager Enter branch must exist');
  const branch = uiSource.slice(start, end);
  assert.match(branch, /action: "scope"/);
  assert.match(branch, /groupId: group\.id/);
  assert.doesNotMatch(branch, /action: "load", skills: members/);
});

test('model-facing skill tool prefers the active scope but permits only surfaced global-fallback roots', () => {
  const start = source.indexOf('pi.registerTool({', source.indexOf('name: "skill"') - 80);
  const end = source.indexOf('  const openManager', start);
  const branch = source.slice(start, end);
  assert.match(branch, /resolveSkillScope\(activeScope/);
  assert.match(branch, /const inActiveScope = active\.allowedNames\.has\(params\.name\)/);
  assert.match(branch, /const authorizedFallback = fallbackRootNames\.has\(params\.name\)/);
  assert.match(branch, /active\.restricted && !inActiveScope && !authorizedFallback/);
  assert.match(branch, /loadBundle\(params\.name/);
  assert.match(branch, /recursive dependencies may be outside the active scope/);
  assert.doesNotMatch(branch, /Eligible root skills:/);
});


test('profile selection activates a profile candidate scope without loading skill bodies', () => {
  const start = source.indexOf('const profileMatch =');
  const end = source.indexOf('const records = extensionContextRecords', start);
  assert.ok(start >= 0 && end > start, 'profile input branch must exist');
  const branch = source.slice(start, end);
  assert.match(branch, /applyProfileSelection\(profileStore\.switchProfile/);
  assert.match(branch, /Skills remain lazy-loaded/);
  assert.doesNotMatch(branch, /loadBundle\(/);
  assert.doesNotMatch(branch, /loadRoots\(/);
});

test('before_agent_start removes the all-skill advertisement and inserts only a constant-size scope stub', () => {
  const start = source.indexOf('pi.on("before_agent_start"');
  const end = source.indexOf('pi.on("input"', start);
  const branch = source.slice(start, end);
  assert.match(branch, /resolveSkillScope\(/);
  assert.match(branch, /renderScopeCatalog\(/);
  assert.doesNotMatch(branch, /formatSkillsForPrompt/);
  assert.match(branch, /replaceNativeSkillCatalog\(/);
  assert.match(branch, /containsPotentialNativeSkillCatalog\(/);
  assert.doesNotMatch(branch, /if \(!configState\.config\.compactCatalog\) return undefined/);
});


test('model gets active-first on-demand skill_search with a bounded global fallback instead of an eager catalogue', () => {
  assert.match(source, /name: "skill_search"/);
  assert.match(source, /rankSkillRecordsBySearch\(active\.records/);
  assert.match(source, /globalFallbackRecords\(active, records\)/);
  assert.match(source, /Type\.Literal\("global"\)/);
  assert.match(source, /authorizeFallback\(fallbackMatches\)/);
  assert.match(source, /The active scope remains unchanged/);
});

test('extension source never mutates Pi global enableSkillCommands/settings.json', () => {
  const srcDir = path.resolve('src');
  const allSource = fs.readdirSync(srcDir)
    .filter((name) => name.endsWith('.ts'))
    .map((name) => fs.readFileSync(path.join(srcDir, name), 'utf8'))
    .join('\n');
  assert.doesNotMatch(allSource, /enableSkillCommands/);
  assert.doesNotMatch(allSource, /settings\.json/);
});


test('manager blocks scope/load completion until pending edits are successfully autosaved', () => {
  const start = uiSource.indexOf('if (matchesKey(data, Key.enter))', uiSource.indexOf('if (matchesKey(data, Key.down))', 9000));
  const end = uiSource.indexOf('    if (data === " ")', start);
  assert.ok(start >= 0 && end > start, 'manager Enter branch must exist');
  const branch = uiSource.slice(start, end);
  const donePositions = [...branch.matchAll(/this\.done\(/g)].map((match) => match.index ?? -1);
  assert.ok(donePositions.length >= 3, 'expected All Skills, group scope, and skill load completion paths');
  for (const doneAt of donePositions) {
    const prefix = branch.slice(0, doneAt);
    assert.ok(prefix.lastIndexOf('ensureAutosaved()') >= 0, 'every Enter completion path must autosave before closing');
  }
});

test('non-TUI manager rejection happens before dependency-body scanning', () => {
  const start = source.indexOf('const openManager');
  const end = source.indexOf('pi.registerCommand("skill"', start);
  assert.ok(start >= 0 && end > start, 'openManager block must exist');
  const branch = source.slice(start, end);
  const modeGuard = branch.indexOf('ctx.mode !== "tui"');
  const recordLookup = branch.indexOf('currentRecords(ctx)');
  const dependencyScan = branch.indexOf('computeAutoDeps(records)');
  assert.ok(modeGuard >= 0, 'non-TUI mode guard must exist');
  assert.ok(recordLookup >= 0, 'TUI manager record lookup must exist');
  assert.ok(dependencyScan >= 0, 'dependency scan must exist for TUI manager');
  assert.ok(modeGuard < recordLookup, 'non-TUI guard must precede skill-resource lookup');
  assert.ok(modeGuard < dependencyScan, 'non-TUI guard must precede dependency-body scanning');
});

test('production source contains no developer-specific absolute workspace paths', () => {
  const srcDir = path.resolve('src');
  const allSource = fs.readdirSync(srcDir)
    .filter((name) => name.endsWith('.ts'))
    .map((name) => fs.readFileSync(path.join(srcDir, name), 'utf8'))
    .join('\n');
  assert.doesNotMatch(allSource, /\/home\//);
  assert.doesNotMatch(allSource, /\/mnt\/[a-z]\//i);
  assert.doesNotMatch(allSource, /Badgids/i);
  assert.doesNotMatch(allSource, /workspace\//i);
});

test('obsolete compactCatalog switch cannot re-enable eager model catalog injection', () => {
  const srcDir = path.resolve('src');
  const allSource = fs.readdirSync(srcDir)
    .filter((name) => name.endsWith('.ts'))
    .map((name) => fs.readFileSync(path.join(srcDir, name), 'utf8'))
    .join('\n');
  assert.doesNotMatch(allSource, /compactCatalog/);
});
