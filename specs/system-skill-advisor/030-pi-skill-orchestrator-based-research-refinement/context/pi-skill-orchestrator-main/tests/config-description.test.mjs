import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeConfig } from '../src/config.ts';

test('group descriptions are normalized and old configs remain compatible', () => {
  const config = normalizeConfig({
    version: 1,
    groups: [
      { id: 'dev', name: 'Dev', description: '  Development helpers  ', shortcutEnabled: false, order: 10 },
      { id: 'old', name: 'Old Group', order: 20 },
    ],
  });

  assert.equal(config.groups[0].description, 'Development helpers');
  assert.equal(config.groups[0].shortcutEnabled, false);
  assert.equal(config.groups[1].description, '');
  assert.equal(config.groups[1].shortcutEnabled, true);
});


test('group descriptions are flattened, control-safe, and bounded for terminal UI', () => {
  const config = normalizeConfig({
    version: 1,
    groups: [
      { id: 'film', name: 'Film', description: `  first line\nsecond\x1b[31m red  ${'x'.repeat(1200)}`, order: 10 },
    ],
  });
  const description = config.groups[0].description;
  assert.equal(description.includes('\n'), false);
  assert.equal(description.includes('\x1b'), false);
  assert.ok(description.startsWith('first line second [31m red'));
  assert.ok(description.length <= 1024);
});
