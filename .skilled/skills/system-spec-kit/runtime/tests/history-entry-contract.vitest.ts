// ───────────────────────────────────────────────────────────────────
// MODULE: History Entry Contract Tests
// ───────────────────────────────────────────────────────────────────

import Ajv2020 from 'ajv/dist/2020.js';
import { describe, expect, it } from 'vitest';

import schema from '../hooks/lib/history/history-entry.schema.json';
import {
  HISTORY_ENTRY_KEYS,
  HISTORY_ENTRY_KEYS_COMPLETE,
  HISTORY_ENTRY_REQUIRED_KEYS,
  HISTORY_ENTRY_REQUIRED_KEYS_COMPLETE,
  type HistoryEntry,
} from '../hooks/lib/history/history.js';
import { buildRoleFixtures } from './_support/history-fixtures.js';

const validate = new Ajv2020({ allErrors: true, strict: false }).compile(schema);

function without(entry: HistoryEntry, key: string): Record<string, unknown> {
  const copy = { ...entry } as Record<string, unknown>;
  delete copy[key];
  return copy;
}

describe('entry contract', () => {
  it('publishes a closed Draft 2020-12 object schema', () => {
    expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
    expect(schema.$id).toEqual(expect.any(String));
    expect(schema.type).toBe('object');
    expect(schema.additionalProperties).toBe(false);
  });

  it('agrees with the type on required and declared keys in both directions', () => {
    expect([...(schema.required as string[])].sort()).toEqual([...HISTORY_ENTRY_REQUIRED_KEYS].sort());
    expect(Object.keys(schema.properties as Record<string, unknown>).sort()).toEqual([...HISTORY_ENTRY_KEYS].sort());
    expect(HISTORY_ENTRY_KEYS_COMPLETE).toBe(true);
    expect(HISTORY_ENTRY_REQUIRED_KEYS_COMPLETE).toBe(true);

    const allKeys = buildRoleFixtures()[2];
    expect(allKeys).toBeDefined();
    expect(Object.keys(allKeys as HistoryEntry).sort()).toEqual([...HISTORY_ENTRY_KEYS].sort());
  });

  it('validates one typed fixture per role', () => {
    for (const entry of buildRoleFixtures()) {
      expect(validate(entry)).toBe(true);
    }
  });

  it('rejects every missing required field', () => {
    for (const key of HISTORY_ENTRY_REQUIRED_KEYS) {
      expect(validate(without(buildRoleFixtures()[0] as HistoryEntry, key))).toBe(false);
    }
  });

  it('rejects an unknown root or block field', () => {
    expect(validate({ ...buildRoleFixtures()[0], extra: true })).toBe(false);
    const assistant = buildRoleFixtures()[1] as HistoryEntry;
    const content = assistant.content.map((block, index) =>
      index === 0 ? { ...block, extra: true } : block);
    expect(validate({ ...assistant, content })).toBe(false);
  });

  it('enforces the role conditionals', () => {
    const toolResult = buildRoleFixtures()[2] as HistoryEntry;
    const user = buildRoleFixtures()[0] as HistoryEntry;

    expect(validate(without(toolResult, 'toolCallId'))).toBe(false);
    expect(validate({ ...user, toolCallId: 'call-1' })).toBe(false);
    expect(validate({ ...user, isError: true })).toBe(false);
    expect(validate(toolResult)).toBe(true);
  });

  it('rejects an unknown content block type', () => {
    const user = buildRoleFixtures()[0] as HistoryEntry;
    expect(validate({ ...user, content: [{ type: 'audio', data: 'AA==' }] })).toBe(false);
  });
});
