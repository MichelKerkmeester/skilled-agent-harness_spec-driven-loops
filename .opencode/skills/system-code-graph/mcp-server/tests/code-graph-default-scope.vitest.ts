// 012 first-time auto-establish gate: isDefaultEndUserScope decides whether an
// empty graph may auto-scan on a read. True only for the default end-user-code
// scope (a fresh clone); any .opencode opt-in makes it false (keeps manual gate).
import { describe, it, expect } from 'vitest';
import { isDefaultEndUserScope, resolveIndexScopePolicy } from '../lib/index-scope-policy.js';

describe('isDefaultEndUserScope', () => {
  it('is true for the default end-user scope (no .opencode opt-ins)', () => {
    expect(isDefaultEndUserScope(resolveIndexScopePolicy({ env: {} }))).toBe(true);
  });

  it('is false when skills are opted in via env', () => {
    const policy = resolveIndexScopePolicy({ env: { SPECKIT_CODE_GRAPH_INDEX_SKILLS: 'true' } });
    expect(isDefaultEndUserScope(policy)).toBe(false);
  });

  it('is false when agents / commands / specs / plugins are opted in', () => {
    for (const key of [
      'SPECKIT_CODE_GRAPH_INDEX_AGENTS',
      'SPECKIT_CODE_GRAPH_INDEX_COMMANDS',
      'SPECKIT_CODE_GRAPH_INDEX_SPECS',
      'SPECKIT_CODE_GRAPH_INDEX_PLUGINS',
    ]) {
      const policy = resolveIndexScopePolicy({ env: { [key]: 'true' } });
      expect(isDefaultEndUserScope(policy), `${key} opt-in should not be default scope`).toBe(false);
    }
  });

  it('is false when a specific skill allow-list is opted in', () => {
    expect(isDefaultEndUserScope(resolveIndexScopePolicy({ includeSkills: ['sk-foo'] }))).toBe(false);
  });
});
