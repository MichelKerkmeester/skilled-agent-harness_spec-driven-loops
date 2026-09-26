import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPiSkillItems,
  buildTopLevelGroupItems,
  buildSkillNamespaceGroupItems,
  buildGroupSkillItems,
  buildSkillProfileNamespaceItems,
  applySkillProfileCompletion,
  applySkillGroupCompletion,
  mergeAutocompleteItems,
  createSkillOrchestratorAutocompleteProvider,
} from '../src/autocomplete.ts';

const groups = [
  { id: 'dev', name: 'Dev Tools', description: 'Development helpers', shortcutEnabled: true, order: 10 },
  { id: 'review', name: 'Code Review', description: 'Review workflows', shortcutEnabled: false, order: 20 },
];
const records = [
  { name: 'architecture-review', description: 'Review architecture', filePath: '/tmp/a' },
  { name: 'write-prd', description: 'Write a PRD', filePath: '/tmp/b' },
  { name: 'tdd', description: 'Test driven development', filePath: '/tmp/c' },
];
const config = {
  version: 1,
  groups,
  memberships: {
    'architecture-review': ['dev'],
    'write-prd': ['dev', 'review'],
    'tdd': ['review'],
  },
  autoload: {},
  ignoreAutoDetected: {},
  catalogDescriptionMax: 160,
};


const profiles = [
  { id: 'default', name: 'Default', description: 'General work', active: true },
  { id: 'code-review', name: 'Code Review', description: 'Review workflows', active: false },
];

const piSkillCommands = [
  { name: 'skill:architecture-review', description: 'Review architecture' },
  { name: 'skill:tdd', description: 'Test driven development' },
  { name: 'skill:write-prd', description: 'Write a PRD' },
  // The orchestrator deliberately does not care whether a skill is model-visible.
  // Pi's command catalogue is authoritative for explicitly invokable skills.
  { name: 'skill:hidden-helper', description: 'Explicit-only helper' },
];

test('Pi skill command items include every supplied installed skill command', () => {
  const items = buildPiSkillItems('', piSkillCommands);
  assert.deepEqual(items.map((item) => item.value), [
    'skill:architecture-review',
    'skill:hidden-helper',
    'skill:tdd',
    'skill:write-prd',
  ]);
});

test('Pi skill command items filter on the suffix after /skill:', () => {
  assert.deepEqual(
    buildPiSkillItems('arch', piSkillCommands).map((item) => item.value),
    ['skill:architecture-review'],
  );
});

test('/skill: autocomplete adds only enabled group shortcuts', () => {
  const items = buildSkillNamespaceGroupItems('', groups, config, records);
  assert.deepEqual(items.map((item) => item.value), ['skill:Dev_Tools']);
  assert.match(items[0].description, /2 skills/);
});

test('/skill: group autocomplete filters by typed suffix', () => {
  assert.deepEqual(
    buildSkillNamespaceGroupItems('dev', groups, config, records).map((item) => item.value),
    ['skill:Dev_Tools'],
  );
  assert.deepEqual(buildSkillNamespaceGroupItems('review', groups, config, records), []);
});

test('/Group_Name: autocomplete lists configured members even before record metadata is populated', () => {
  const items = buildGroupSkillItems('Dev_Tools', '', groups, config, []);
  assert.deepEqual(items.map((item) => item.value), [
    'Dev_Tools:architecture-review',
    'Dev_Tools:write-prd',
  ]);
});

test('/Group_Name: autocomplete lists only members of that enabled group', () => {
  const items = buildGroupSkillItems('Dev_Tools', '', groups, config, records);
  assert.deepEqual(items.map((item) => item.value), [
    'Dev_Tools:architecture-review',
    'Dev_Tools:write-prd',
  ]);
  assert.deepEqual(items.map((item) => item.label), ['architecture-review', 'write-prd']);
});

test('/Group_Name: autocomplete is disabled with the group shortcut', () => {
  assert.deepEqual(buildGroupSkillItems('Code_Review', '', groups, config, records), []);
});

test('autocomplete merge preserves native items and deduplicates group collisions', () => {
  const native = [
    { value: 'skill:architecture-review', label: 'skill:architecture-review' },
    { value: 'skill:Dev_Tools', label: 'skill:Dev_Tools', description: 'native collision' },
  ];
  const groupsOnly = buildSkillNamespaceGroupItems('', groups, config, records);
  const merged = mergeAutocompleteItems(native, groupsOnly);
  assert.deepEqual(merged.map((item) => item.value), [
    'skill:architecture-review',
    'skill:Dev_Tools',
  ]);
  assert.equal(merged[1].description, 'native collision');
});

test('provider /skill: remains complete when native provider returns only a partial skill list', async () => {
  const current = {
    async getSuggestions() {
      return {
        prefix: '/skill:',
        items: [{ value: 'skill:architecture-review', label: 'skill:architecture-review' }],
      };
    },
    applyCompletion(lines, cursorLine, cursorCol, item, prefix) {
      return { lines, cursorLine, cursorCol: cursorCol + item.value.length - prefix.length };
    },
  };
  const provider = createSkillOrchestratorAutocompleteProvider(
    current,
    () => ({ config, records }),
    () => piSkillCommands,
  );
  const result = await provider.getSuggestions(['/skill:'], 0, 7, { signal: new AbortController().signal });
  assert.deepEqual(result.items.map((item) => item.value), [
    'skill:architecture-review',
    'skill:hidden-helper',
    'skill:tdd',
    'skill:write-prd',
    'skill:Dev_Tools',
  ]);
});

test('provider /skill: still works when native provider returns null', async () => {
  const current = {
    async getSuggestions() { return null; },
    applyCompletion(lines, cursorLine, cursorCol) { return { lines, cursorLine, cursorCol }; },
  };
  const provider = createSkillOrchestratorAutocompleteProvider(
    current,
    () => ({ config, records: [] }),
    () => piSkillCommands,
  );
  const result = await provider.getSuggestions(['/skill:'], 0, 7, { signal: new AbortController().signal });
  assert.deepEqual(result.items.map((item) => item.value), [
    'skill:architecture-review',
    'skill:hidden-helper',
    'skill:tdd',
    'skill:write-prd',
    'skill:Dev_Tools',
  ]);
});

test('provider adds slash as a natural trigger so unregistered /Group: aliases can reopen autocomplete', () => {
  const current = {
    triggerCharacters: ['@'],
    async getSuggestions() { return null; },
    applyCompletion(lines, cursorLine, cursorCol) { return { lines, cursorLine, cursorCol }; },
  };
  const provider = createSkillOrchestratorAutocompleteProvider(current, () => ({ config, records }));
  assert.deepEqual(provider.triggerCharacters, ['@', '/']);
});

test('provider replaces /Group: menu with group members only', async () => {
  const current = {
    async getSuggestions() {
      return { prefix: '/Dev_Tools:', items: [{ value: 'unrelated', label: 'unrelated' }] };
    },
    applyCompletion(lines, cursorLine, cursorCol) {
      return { lines, cursorLine, cursorCol };
    },
  };
  const provider = createSkillOrchestratorAutocompleteProvider(current, () => ({ config, records }));
  const text = '/Dev_Tools:';
  const result = await provider.getSuggestions([text], 0, text.length, { signal: new AbortController().signal });
  assert.deepEqual(result.items.map((item) => item.value), [
    'Dev_Tools:architecture-review',
    'Dev_Tools:write-prd',
  ]);
});

test('recognized enabled /Group: with no matching member does not fall back to unrelated Pi commands', async () => {
  let delegated = 0;
  const current = {
    async getSuggestions() {
      delegated += 1;
      return { prefix: '/Dev_Tools:nope', items: [{ value: 'unrelated', label: 'unrelated' }] };
    },
    applyCompletion(lines, cursorLine, cursorCol) {
      return { lines, cursorLine, cursorCol };
    },
  };
  const provider = createSkillOrchestratorAutocompleteProvider(current, () => ({ config, records }));
  const text = '/Dev_Tools:nope';
  const result = await provider.getSuggestions([text], 0, text.length, { signal: new AbortController().signal });
  assert.equal(result, null);
  assert.equal(delegated, 0);
});


test('top-level slash autocomplete adds enabled group shortcuts only', () => {
  const items = buildTopLevelGroupItems('', groups, config, records);
  assert.deepEqual(items.map((item) => item.value), ['Dev_Tools']);
  assert.match(items[0].description, /Skill group · 2 skills/);
});

test('top-level group autocomplete filters partial shortcut names', () => {
  assert.deepEqual(
    buildTopLevelGroupItems('dev', groups, config, records).map((item) => item.value),
    ['Dev_Tools'],
  );
  assert.deepEqual(buildTopLevelGroupItems('review', groups, config, records), []);
});

test('provider keeps enabled group shortcut in Pi slash menu while typing it', async () => {
  const current = {
    triggerCharacters: ['@'],
    async getSuggestions(lines, cursorLine, cursorCol) {
      const text = (lines[cursorLine] ?? '').slice(0, cursorCol);
      if (text === '/') {
        return { prefix: '/', items: [{ value: 'model', label: 'model', description: 'Select model' }] };
      }
      // Simulate Pi dropping the native menu once /Dev stops matching a registered command.
      return null;
    },
    applyCompletion(lines, cursorLine, cursorCol, item, prefix) {
      return { lines, cursorLine, cursorCol: cursorCol + item.value.length - prefix.length };
    },
  };
  const provider = createSkillOrchestratorAutocompleteProvider(current, () => ({ config, records }));

  const root = await provider.getSuggestions(['/'], 0, 1, { signal: new AbortController().signal });
  assert.deepEqual(root.items.map((item) => item.value), ['model', 'Dev_Tools']);

  const partial = '/Dev';
  const continued = await provider.getSuggestions([partial], 0, partial.length, { signal: new AbortController().signal });
  assert.deepEqual(continued.items.map((item) => item.value), ['Dev_Tools']);
  assert.equal(continued.prefix, '/Dev');
});

test('top-level group alias transitions into its member menu after colon', async () => {
  const current = {
    triggerCharacters: ['@'],
    async getSuggestions() { return null; },
    applyCompletion(lines, cursorLine, cursorCol) { return { lines, cursorLine, cursorCol }; },
  };
  const provider = createSkillOrchestratorAutocompleteProvider(current, () => ({ config, records }));
  const text = '/Dev_Tools:';
  const result = await provider.getSuggestions([text], 0, text.length, { signal: new AbortController().signal });
  assert.deepEqual(result.items.map((item) => item.value), [
    'Dev_Tools:architecture-review',
    'Dev_Tools:write-prd',
  ]);
});


test('/skill-profile: autocomplete lists saved profiles using colon namespace values', () => {
  const items = buildSkillProfileNamespaceItems('', profiles);
  assert.deepEqual(items.map((item) => item.value), [
    'skill-profile:Default',
    'skill-profile:Code_Review',
  ]);
  assert.match(items[0].description, /ACTIVE/);
});

test('/skill-profile: autocomplete filters by profile suffix', () => {
  const items = buildSkillProfileNamespaceItems('code_', profiles);
  assert.deepEqual(items.map((item) => item.value), ['skill-profile:Code_Review']);
});

test('provider serves /skill-profile: without relying on Pi argument autocomplete', async () => {
  const current = {
    async getSuggestions() { return null; },
    applyCompletion(lines, cursorLine, cursorCol) { return { lines, cursorLine, cursorCol }; },
  };
  const provider = createSkillOrchestratorAutocompleteProvider(
    current,
    () => ({ config, records }),
    () => piSkillCommands,
    () => profiles,
  );
  const text = '/skill-profile:';
  const result = await provider.getSuggestions([text], 0, text.length, { signal: new AbortController().signal });
  assert.deepEqual(result.items.map((item) => item.value), [
    'skill-profile:Default',
    'skill-profile:Code_Review',
  ]);
  assert.equal(result.prefix, text);
});


test('/skill-profile: completion preserves the canonical colon command instead of generic slash completion', () => {
  const lines = ['/skill-profile:Code_'];
  const item = { value: 'skill-profile:Code_Review', label: 'skill-profile:Code_Review' };
  const result = applySkillProfileCompletion(
    lines,
    0,
    lines[0].length,
    item,
    lines[0],
  );

  assert.deepEqual(result, {
    lines: ['/skill-profile:Code_Review '],
    cursorLine: 0,
    cursorCol: '/skill-profile:Code_Review '.length,
  });
});

test('provider does not delegate /skill-profile: completion to Pi generic slash completion', () => {
  let delegated = 0;
  const current = {
    async getSuggestions() { return null; },
    applyCompletion() {
      delegated += 1;
      throw new Error('profile completion must not reach generic completion');
    },
  };
  const provider = createSkillOrchestratorAutocompleteProvider(
    current,
    () => ({ config, records }),
    () => piSkillCommands,
    () => profiles,
  );
  const text = '/skill-profile:';
  const item = { value: 'skill-profile:Code_Review', label: 'skill-profile:Code_Review' };
  const result = provider.applyCompletion([text], 0, text.length, item, text);

  assert.equal(delegated, 0);
  assert.deepEqual(result, {
    lines: ['/skill-profile:Code_Review '],
    cursorLine: 0,
    cursorCol: '/skill-profile:Code_Review '.length,
  });
});


test('/skill: group completion bypasses Pi native completion and preserves the group token', () => {
  const lines = ['/skill:De'];
  const item = { value: 'skill:Dev_Tools', label: 'skill:Dev_Tools', description: 'Group · 2 skills' };
  const result = applySkillGroupCompletion(
    lines,
    0,
    lines[0].length,
    item,
    lines[0],
    groups,
    config,
    records,
  );
  assert.deepEqual(result, {
    lines: ['/skill:Dev_Tools '],
    cursorLine: 0,
    cursorCol: '/skill:Dev_Tools '.length,
  });
});

test('provider never delegates a synthetic /skill:Group completion to Pi native completion', () => {
  let delegated = 0;
  const current = {
    async getSuggestions() { return null; },
    applyCompletion() {
      delegated += 1;
      throw new Error('group completion must not reach native skill completion');
    },
  };
  const provider = createSkillOrchestratorAutocompleteProvider(
    current,
    () => ({ config, records }),
    () => piSkillCommands,
  );
  const text = '/skill:De';
  const item = { value: 'skill:Dev_Tools', label: 'skill:Dev_Tools', description: 'Group · 2 skills' };
  const result = provider.applyCompletion([text], 0, text.length, item, text);
  assert.equal(delegated, 0);
  assert.deepEqual(result, {
    lines: ['/skill:Dev_Tools '],
    cursorLine: 0,
    cursorCol: '/skill:Dev_Tools '.length,
  });
});


test('/Group:skill completion applies from saved membership before record metadata exists', () => {
  const prefix = '/Dev_Tools:arch';
  const item = { value: 'Dev_Tools:architecture-review', label: 'architecture-review' };
  const result = applySkillGroupCompletion([prefix], 0, prefix.length, item, prefix, groups, config, []);
  assert.equal(result.lines[0], '/Dev_Tools:architecture-review ');
});

test('provider survives a throwing native autocomplete provider and still serves orchestrator entries', async () => {
  const current = {
    triggerCharacters: [],
    async getSuggestions() { throw new Error('native autocomplete failed'); },
    applyCompletion(lines, cursorLine, cursorCol) { return { lines, cursorLine, cursorCol }; },
  };
  const provider = createSkillOrchestratorAutocompleteProvider(current, () => ({ config, records }));
  const result = await provider.getSuggestions(['/Dev'], 0, 4, { signal: new AbortController().signal });
  assert.deepEqual(result.items.map((item) => item.value), ['Dev_Tools']);
});

test('/Group: autocomplete omits stale configured members once installed records are known', () => {
  const staleConfig = { ...config, memberships: { ...config.memberships, 'gone-skill': ['dev'] } };
  const items = buildGroupSkillItems('Dev_Tools', '', groups, staleConfig, records);
  assert.equal(items.some((item) => item.value.endsWith(':gone-skill')), false);
  const preMetadata = buildGroupSkillItems('Dev_Tools', '', groups, staleConfig, []);
  assert.equal(preMetadata.some((item) => item.value.endsWith(':gone-skill')), true);
});

test('autocomplete descriptions are flattened and terminal-control-safe', () => {
  const skillItems = buildPiSkillItems('', [{
    name: 'skill:safe',
    description: 'line one\nline two\x1b[31m red',
  }]);
  assert.equal(skillItems[0].description, 'line one line two [31m red');

  const groupItems = buildTopLevelGroupItems('', [
    { id: 'film', name: 'Film', description: 'film\nwork\x1b[2J', shortcutEnabled: true, order: 10 },
  ], {
    version: 1,
    groups: [{ id: 'film', name: 'Film', description: 'film\nwork\x1b[2J', shortcutEnabled: true, order: 10 }],
    memberships: {}, autoload: {}, ignoreAutoDetected: {}, catalogDescriptionMax: 160,
  }, []);
  assert.equal(groupItems[0].description.includes('\n'), false);
  assert.equal(groupItems[0].description.includes('\x1b'), false);
});
