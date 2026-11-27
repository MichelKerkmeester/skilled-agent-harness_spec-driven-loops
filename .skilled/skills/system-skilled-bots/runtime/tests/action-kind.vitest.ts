// ───────────────────────────────────────────────────────────────────
// MODULE: Action Kind Tests
// ───────────────────────────────────────────────────────────────────
//
// The six kinds resolve in the plan's order and a declaration is a floor
// rather than an override, so the scan reads the whole question as whole
// words only.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  ACTION_KINDS,
  ACTION_WORDS,
  ALL_ACTION_KINDS,
  classifyAction,
  clipAction,
  stricterKind,
} from '../lib/action-kind.js';
import { REAL_CHECKOUT } from './support.js';

type Kind = (typeof ACTION_KINDS)[number];

type Golden = {
  order: string[];
  fallback: string;
  kinds: Array<{ kind: string; words: string[]; sample: string; expected: string }>;
  cases: Array<{ name: string; question: string; declared?: string; expected: string }>;
};

const GOLDEN = JSON.parse(
  readFileSync(join(REAL_CHECKOUT, 'specs', 'system-skilled-bots', '003-openbot-parity-build', '006-approval-grants', 'design', 'fixtures', 'action-kinds.json'), 'utf8'),
) as Golden;

describe('classifyAction', () => {
  it("tests the six kinds in the plan's order", () => {
    expect(ACTION_KINDS).toEqual(GOLDEN.order);
    expect(ALL_ACTION_KINDS[ALL_ACTION_KINDS.length - 1]).toBe('other');

    for (const entry of GOLDEN.kinds) {
      expect(ACTION_WORDS[entry.kind as Kind], entry.kind).toEqual(entry.words);
      expect(classifyAction(entry.sample), entry.kind).toEqual({ ok: true, value: entry.expected });
    }

    expect(classifyAction('pay the invoice and delete the receipt')).toEqual({ ok: true, value: 'pay' });
    expect(classifyAction('I will tidy the notes. Delete the production database?')).toEqual({ ok: true, value: 'delete' });
  });

  it('reads the whole question', () => {
    expect(classifyAction('I will tidy the notes. Delete the production database?')).toEqual({ ok: true, value: 'delete' });
    expect(classifyAction('The docs say "delete the row" as an example. Shall I update the docs?')).toEqual({ ok: true, value: 'delete' });
    expect(classifyAction('Which branch should I start from?')).toEqual({ ok: true, value: 'other' });
    expect(classifyAction('')).toEqual({ ok: true, value: 'other' });

    const filler = 'lorem ipsum dolor sit amet '.repeat(200);
    const long = `${filler.slice(0, 3991)}delete it`;
    expect(long).toHaveLength(4000);
    expect(classifyAction(long)).toEqual({ ok: true, value: 'delete' });
    expect(clipAction(long)).toHaveLength(120);
    expect(clipAction(long)).toBe(long.slice(0, 120));
  });

  it('matches a whole word only', () => {
    expect(classifyAction('postpone the buyer call')).toEqual({ ok: true, value: 'other' });
    expect(classifyAction('Notify the buyer')).toEqual({ ok: true, value: 'send' });
    expect(classifyAction('Rotate the API-key')).toEqual({ ok: true, value: 'credentials' });
    expect(classifyAction('api  key')).toEqual({ ok: true, value: 'other' });
    expect(classifyAction('DELETE the row')).toEqual({ ok: true, value: 'delete' });
    expect(classifyAction('the payday')).toEqual({ ok: true, value: 'other' });
  });

  it('removes the declaration tokens before the scan', () => {
    expect(classifyAction('[ACTION: send] [ACTION: pay] Notify the buyer')).toEqual({ ok: true, value: 'send' });
    expect(classifyAction('[ACTION: post] Which branch?')).toEqual({ ok: true, value: 'post' });
  });
});

describe('the ACTION line', () => {
  it('takes the declared kind as a floor', () => {
    expect(classifyAction('[ACTION: pay] Settle the account')).toEqual({ ok: true, value: 'pay' });
    expect(classifyAction('[ACTION: other] Delete the production database?')).toEqual({ ok: true, value: 'delete' });
    expect(classifyAction('[ACTION: delete] Pay the invoice')).toEqual({ ok: true, value: 'pay' });
    expect(classifyAction('[ACTION: transfer] Move the balance')).toEqual({ ok: false, reason: 'action-kind-invalid', detail: 'transfer' });

    for (const row of GOLDEN.cases.filter((entry) => entry.declared !== undefined)) {
      const result = classifyAction(row.question);
      if (row.expected === 'action-kind-invalid') {
        expect(result, row.name).toEqual({ ok: false, reason: 'action-kind-invalid', detail: row.declared });
      } else {
        expect(result, row.name).toEqual({ ok: true, value: row.expected });
      }
    }

    expect(stricterKind('post', 'pay')).toBe('pay');
  });
});
