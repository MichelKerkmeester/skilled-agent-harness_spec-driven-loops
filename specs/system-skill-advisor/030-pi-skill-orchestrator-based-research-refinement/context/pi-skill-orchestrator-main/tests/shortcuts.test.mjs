import test from 'node:test';
import assert from 'node:assert/strict';
import { parseShortcut, parseSkillNamespaceShortcut, shortcutName } from '../src/shortcuts.ts';

const groups = [
  { id: 'dev', name: 'Dev Tools', description: 'Development helpers', shortcutEnabled: true, order: 10 },
  { id: 'review', name: 'Code Review', description: '', shortcutEnabled: true, order: 20 },
];
const skills = [
  { name: 'architecture-review', description: 'Review architecture', filePath: '/tmp/a' },
  { name: 'write-prd', description: 'Write a PRD', filePath: '/tmp/b' },
];
const config = {
  version: 1,
  groups,
  memberships: {
    'architecture-review': ['dev', 'review'],
    'write-prd': ['dev'],
  },
  autoload: {},
  ignoreAutoDetected: {},
  catalogDescriptionMax: 160,
};

test('group names become underscore text-input shortcuts', () => {
  assert.equal(shortcutName('Code Review'), 'Code_Review');
  assert.equal(shortcutName('  Dev & Tools  '), 'Dev_Tools');
});

test('parses a group shortcut with an optional task', () => {
  assert.deepEqual(parseShortcut('/Dev_Tools fix the tests', groups, skills, config), {
    kind: 'match',
    value: { group: groups[0], task: 'fix the tests' },
  });
});

test('parses a group-scoped skill shortcut and requires membership', () => {
  assert.deepEqual(parseShortcut('/Code_Review:architecture-review', groups, skills, config), {
    kind: 'match',
    value: { group: groups[1], skill: skills[0], task: undefined },
  });

  assert.deepEqual(parseShortcut('/Code_Review:write-prd', groups, skills, config), {
    kind: 'error',
    message: 'Skill "write-prd" is not a member of group "Code Review".',
  });
});

test('unrecognized slash input is left alone for Pi', () => {
  assert.deepEqual(parseShortcut('/model', groups, skills, config), { kind: 'none' });
});

test('/skill:Skill resolves an installed skill without registering per-skill commands', () => {
  assert.deepEqual(parseSkillNamespaceShortcut('/skill:architecture-review fix it', groups, skills), {
    kind: 'match',
    value: { kind: 'skill', skill: skills[0], task: 'fix it' },
  });
});

test('/skill:Group_Name resolves a group using Pi\'s native skill namespace', () => {
  assert.deepEqual(parseSkillNamespaceShortcut('/skill:Code_Review review this', groups, skills), {
    kind: 'match',
    value: { kind: 'group', group: groups[1], task: 'review this' },
  });
});

test('/skill namespace reports unknown names', () => {
  assert.deepEqual(parseSkillNamespaceShortcut('/skill:nope', groups, skills), {
    kind: 'error',
    message: 'No skill or group matched "nope".',
  });
});

test('/skill namespace reports skill/group ambiguity', () => {
  const ambiguousGroups = [...groups, { id: 'a', name: 'architecture-review', description: '', shortcutEnabled: true, order: 30 }];
  assert.deepEqual(parseSkillNamespaceShortcut('/skill:architecture-review', ambiguousGroups, skills), {
    kind: 'error',
    message: '"architecture-review" matches both skill "architecture-review" and group "architecture-review". Use /architecture-review for the group.',
  });
});


test('disabled per-group shortcuts do not intercept /Group_Name or /Group_Name:skill', () => {
  const disabledGroups = groups.map((g) => g.id === 'dev' ? { ...g, shortcutEnabled: false } : g);
  assert.deepEqual(parseShortcut('/Dev_Tools', disabledGroups, skills, config), { kind: 'none' });
  assert.deepEqual(parseShortcut('/Dev_Tools:architecture-review', disabledGroups, skills, config), { kind: 'none' });
});

test('/skill:Group_Name still resolves a group when its short group shortcut is disabled', () => {
  const disabledGroups = groups.map((g) => g.id === 'review' ? { ...g, shortcutEnabled: false } : g);
  assert.deepEqual(parseSkillNamespaceShortcut('/skill:Code_Review review this', disabledGroups, skills), {
    kind: 'match',
    value: { kind: 'group', group: disabledGroups[1], task: 'review this' },
  });
});
