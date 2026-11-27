// Proves the approval ladder asks at rung 1 or the bot fallback and that a grant records only once or deny, with every matrix grant validating.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { ACTION_KINDS, ALL_ACTION_KINDS, classifyAction } from '../lib/action-kind.js';
import {
  NOT_IMPLEMENTED_RUNGS,
  RUNG_FALLBACK,
  RUNGS,
  SCOPES,
  UNSUPPORTED_SCOPES,
  decideApproval,
  grantScopeFor,
  isGrantScope,
} from '../lib/approval-ladder.js';
import { validateNeedsYouItem } from '../lib/needs-you.js';
import { REAL_CHECKOUT } from './support.js';

import type { ActionKind } from '../lib/action-kind.js';
import type { GrantScope } from '../lib/approval-ladder.js';
import type { NeedsYouItem } from '../lib/needs-you.js';

const DESIGN = join(
  REAL_CHECKOUT,
  'specs',
  'system-skilled-bots',
  '003-openbot-parity-build',
  '006-approval-grants',
  'design',
  'fixtures',
);

interface RungCase {
  name: string;
  kind: ActionKind;
  expected?: { asks: boolean; rung: string };
  forbidden?: string;
}

interface ScopeCase {
  name: string;
  given: string | null;
  text: string;
  expected: string;
}

interface MatrixRow {
  kind: ActionKind;
  scope: GrantScope | null;
  grant: { kind: ActionKind; scope: GrantScope | null };
}

interface LadderGolden {
  rungs: string[];
  fallback: string;
  implemented: string[];
  notImplemented: string[];
  scopes: (string | null)[];
  rungCases: RungCase[];
  scopeCases: ScopeCase[];
  matrix: MatrixRow[];
}

const GOLDEN = JSON.parse(readFileSync(join(DESIGN, 'ladder-cases.json'), 'utf8')) as LadderGolden;

const ITEM = JSON.parse(readFileSync(join(DESIGN, 'item.with-grant.json'), 'utf8')) as NeedsYouItem;

const ANSWERED_AT = '2026-11-25T21:13:10.000Z';

/** The item one matrix row builds, answered when the row names a scope. */
function matrixItem(row: MatrixRow): NeedsYouItem {
  return {
    ...ITEM,
    id: 'm1',
    runId: 'm1',
    grants: {
      kind: row.kind,
      action: 'Ship the release?',
      rung: decideApproval({ kind: row.kind }).rung,
      scope: row.scope,
      grantedBy: row.scope === null ? null : 'ada',
      grantedAt: row.scope === null ? null : ANSWERED_AT,
    },
    answer: row.scope === null ? null : { text: 'yes', answeredAt: ANSWERED_AT, by: 'ada', scope: row.scope },
  };
}

describe('decideApproval', () => {
  it('first answer wins', () => {
    expect([...RUNGS]).toEqual(GOLDEN.rungs);
    expect(RUNG_FALLBACK).toBe('bot');

    for (const row of GOLDEN.rungCases) {
      if (row.expected === undefined) continue;
      expect(decideApproval({ kind: row.kind }), row.name).toEqual(row.expected);
    }

    for (const kind of ACTION_KINDS) {
      expect(decideApproval({ kind }), kind).toEqual({ asks: true, rung: 'kind' });
    }
  });

  it('never returns rungs 2 to 4', () => {
    expect([...NOT_IMPLEMENTED_RUNGS]).toEqual(GOLDEN.notImplemented);

    for (const kind of ALL_ACTION_KINDS) {
      const { rung } = decideApproval({ kind });
      expect(['kind', 'bot'], kind).toContain(rung);
      expect(NOT_IMPLEMENTED_RUNGS as readonly string[], kind).not.toContain(rung);
    }
  });

  it('walks the 21-row matrix', () => {
    expect(GOLDEN.matrix).toHaveLength(21);

    for (const row of GOLDEN.matrix) {
      const label = `${row.kind} ${String(row.scope)}`;
      const valid = validateNeedsYouItem(matrixItem(row));
      expect(valid.ok, label).toBe(true);
      if (!valid.ok) continue;
      expect(valid.value.grants?.kind, label).toBe(row.grant.kind);
      expect(valid.value.grants?.scope, label).toBe(row.grant.scope);
    }
  });
});

describe('the scope rule', () => {
  it('records the scope the answer grants', () => {
    const rows = GOLDEN.scopeCases.filter(
      (row) => (row.expected === 'once' || row.expected === 'deny') && !row.name.includes('review item'),
    );
    expect(rows.length).toBeGreaterThan(0);

    for (const row of rows) {
      expect(grantScopeFor(row.text, row.given as GrantScope | null), row.name).toBe(row.expected);
    }
  });

  it('refuses always and conversation', () => {
    expect([...SCOPES]).toEqual(['once', 'deny']);
    expect([...UNSUPPORTED_SCOPES]).toEqual(['always', 'conversation']);

    for (const value of ['always', 'conversation', 'sometimes', null]) {
      expect(isGrantScope(value), String(value)).toBe(false);
    }
    for (const value of ['once', 'deny']) {
      expect(isGrantScope(value), value).toBe(true);
    }
  });
});

describe('adversarial', () => {
  it('an empty question', () => {
    expect(classifyAction('')).toEqual({ ok: true, value: 'other' });
    expect(decideApproval({ kind: 'other' }).rung).toBe('bot');
  });

  it('a question naming two kinds', () => {
    expect(classifyAction('pay the invoice and delete the receipt')).toEqual({ ok: true, value: 'pay' });
    expect(decideApproval({ kind: 'pay' }).rung).toBe('kind');
    expect(classifyAction('share the link then delete it')).toEqual({ ok: true, value: 'delete' });
  });

  it('the other kind variant', () => {
    expect(classifyAction('[ACTION: other] Delete the production database?')).toEqual({ ok: true, value: 'delete' });
    expect(decideApproval({ kind: 'delete' }).rung).toBe('kind');

    expect(classifyAction('[ACTION: other] Which branch?')).toEqual({ ok: true, value: 'other' });
    expect(decideApproval({ kind: 'other' }).rung).toBe('bot');

    const valid = validateNeedsYouItem({
      ...ITEM,
      id: 'm1',
      runId: 'm1',
      grants: {
        kind: 'other',
        action: 'Ship the release?',
        rung: 'bot',
        scope: null,
        grantedBy: null,
        grantedAt: null,
      },
    });
    expect(valid.ok).toBe(true);
  });
});
