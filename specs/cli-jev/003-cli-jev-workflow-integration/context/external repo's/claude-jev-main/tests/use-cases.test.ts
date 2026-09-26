import { describe, expect, it } from 'vitest';
import { EmptyStateError, askJev, type JevDeps } from '../src/application/ask.js';
import { EmptyCandidateError, filterRelevance } from '../src/application/filter-relevance.js';
import { pickOption } from '../src/application/pick-option.js';
import { rankHypotheses } from '../src/application/rank-hypotheses.js';
import { reviewFindings } from '../src/application/review-findings.js';
import { SEVERITY_LEVELS } from '../src/domain/catalog/review.js';
import { RISK_LEVELS } from '../src/domain/catalog/options.js';
import type { Answer } from '../src/domain/question.js';
import { FakeJev, choice, noul, score } from './fake-jev.js';
import { FakeReader } from './fake-reader.js';

function deps(
  table: Readonly<Record<string, Answer>>,
  files: Readonly<Record<string, string>> = {},
): JevDeps & { readonly jev: FakeJev; readonly reader: FakeReader } {
  return { jev: new FakeJev(table), reader: new FakeReader(files), maxRequests: 8 };
}

describe('askJev', () => {
  it('refuses a call with neither state nor sources', async () => {
    await expect(
      askJev(deps({}), { questions: { q: { type: 'noul', instructions: 'Is it fine?' } } }),
    ).rejects.toThrow(EmptyStateError);
  });

  it('sends the read sources as their own state field', async () => {
    const dependencies = deps({ q: noul(0.7) }, { 'src/a.ts': 'const a = 1;' });
    const result = await askJev(dependencies, {
      sources: [{ path: 'src/a.ts' }],
      questions: { q: { type: 'noul', instructions: 'Is it fine?' } },
    });
    const state = dependencies.jev.calls[0]?.state;
    expect(state).toMatchObject({ sources: [{ path: 'src/a.ts', content: 'const a = 1;' }] });
    expect(result.answers['q']).toEqual(noul(0.7));
  });

  it('keeps a caller-supplied string state beside the sources', async () => {
    const dependencies = deps({ q: noul(0.1) });
    await askJev(dependencies, {
      state: 'the caller cares about startup order',
      sources: [{ path: 'src/a.ts' }],
      questions: { q: { type: 'noul', instructions: 'Is it fine?' } },
    });
    expect(dependencies.jev.calls[0]?.state).toMatchObject({
      context: 'the caller cares about startup order',
    });
  });

  it('reports how many requests the fan-out needed', async () => {
    const dependencies = deps({ q: noul(0.5) });
    const result = await askJev(dependencies, {
      state: 'x',
      questions: { q: { type: 'noul', instructions: 'Is it fine?' } },
    });
    expect(result.requests).toBe(1);
    expect(result.usage.inputTokens).toBe(100);
  });
});

describe('reviewFindings', () => {
  const findings = [
    { id: 'f1', file: 'src/a.ts', line: 12, claim: 'off by one', failure: 'skips the last item' },
    { id: 'f2', file: 'src/b.ts', claim: 'unchecked cast', failure: 'throws on a null row' },
  ];

  const table = {
    real_f1: noul(0.2),
    reachable_f1: noul(0.9),
    already_handled_f1: noul(0.0),
    severity_f1: score(3, SEVERITY_LEVELS.length),
    real_f2: noul(0.95),
    reachable_f2: noul(0.8),
    already_handled_f2: noul(0.1),
    severity_f2: score(2, SEVERITY_LEVELS.length),
  };

  it('asks about every finding and returns the survivor first', async () => {
    const dependencies = deps(table, { 'src/a.ts': 'a', 'src/b.ts': 'b' });
    const result = await reviewFindings(dependencies, {
      findings,
      sources: [{ path: 'src/a.ts' }, { path: 'src/b.ts' }],
      intent: 'harden the importer',
    });
    expect(result.judgements.map((judgement) => judgement.id)).toEqual(['f2', 'f1']);
    expect(result.judgements[0]?.verdict).toBe('keep');
    expect(result.judgements[1]?.verdict).toBe('drop');
    expect(Object.keys(dependencies.jev.calls[0]?.questions ?? {})).toHaveLength(8);
  });

  it('puts the findings in the state keyed by the id the questions reference', async () => {
    const dependencies = deps(table);
    await reviewFindings(dependencies, { findings, sources: [] });
    expect(dependencies.jev.calls[0]?.state).toMatchObject({
      findings: { f1: { file: 'src/a.ts', line: 12 }, f2: { file: 'src/b.ts' } },
    });
  });

  it('omits the change intent when none was given', async () => {
    const dependencies = deps(table);
    await reviewFindings(dependencies, { findings, sources: [] });
    expect(dependencies.jev.calls[0]?.state).not.toHaveProperty('change_intent');
  });
});

describe('pickOption', () => {
  it('reads each option against all three angles', async () => {
    const dependencies = deps({
      best: choice('sqlite', { sqlite: 0.7, redis: 0.3 }),
      safest: choice('redis', { sqlite: 0.45, redis: 0.55 }),
      simplest: choice('sqlite', { sqlite: 0.85, redis: 0.15 }),
      risk_1: score(1, RISK_LEVELS.length),
      risk_2: score(2.5, RISK_LEVELS.length),
    });
    const result = await pickOption(dependencies, {
      decision: {
        question: 'How should the cache live?',
        requirement: 'survive a restart',
        options: [
          { label: 'sqlite', summary: 'local file' },
          { label: 'redis', summary: 'separate server' },
        ],
      },
      sources: [],
    });
    expect(result.best).toBe('sqlite');
    expect(result.safest).toBe('redis');
    expect(result.unanimous).toBe(false);
    expect(result.options.map((option) => option.risk)).toEqual([1, 2.5]);
  });
});

describe('rankHypotheses', () => {
  it('orders hypotheses by the weighted combination', async () => {
    const dependencies = deps({
      explains_h1: noul(0.4),
      supported_h1: noul(0.9),
      next_check_h1: choice('run_test', { run_test: 0.8 }),
      explains_h2: noul(0.9),
      supported_h2: noul(0.5),
      next_check_h2: choice('read_code', { read_code: 0.7 }),
    });
    const result = await rankHypotheses(dependencies, {
      symptom: 'the worker stops after an hour',
      evidence: 'no error in the log',
      hypotheses: [
        { id: 'h1', claim: 'the queue is empty' },
        { id: 'h2', claim: 'the lock is never released' },
      ],
      sources: [],
    });
    expect(result.hypotheses.map((reading) => reading.id)).toEqual(['h2', 'h1']);
    expect(dependencies.jev.calls[0]?.state).toMatchObject({ evidence: 'no error in the log' });
  });
});

describe('filterRelevance', () => {
  it('reads only the head of each path candidate', async () => {
    const dependencies = deps(
      { needed_c1: noul(0.9), needed_c2: noul(0.1) },
      { 'src/a.ts': 'a', 'src/b.ts': 'b' },
    );
    const result = await filterRelevance(dependencies, {
      goal: 'where is the session refreshed?',
      candidates: [{ id: 'c1', path: 'src/a.ts' }, { id: 'c2', path: 'src/b.ts' }],
      headBytes: 300,
    });
    expect(result.kept.map((reading) => reading.label)).toEqual(['src/a.ts']);
    expect(result.dropped.map((reading) => reading.label)).toEqual(['src/b.ts']);
    expect(dependencies.reader.requests).toEqual([
      { path: 'src/a.ts', maxBytes: 300 },
      { path: 'src/b.ts', maxBytes: 300 },
    ]);
  });

  it('takes inline text without touching the reader', async () => {
    const dependencies = deps({ needed_c1: noul(0.8) });
    const result = await filterRelevance(dependencies, {
      goal: 'does this log line matter?',
      candidates: [{ id: 'c1', text: 'WARN retry budget exhausted', label: 'log' }],
    });
    expect(result.kept[0]?.label).toBe('log');
    expect(dependencies.reader.requests).toEqual([]);
  });

  it('refuses a candidate with neither path nor text', async () => {
    await expect(
      filterRelevance(deps({}), { goal: 'anything', candidates: [{ id: 'c1' }] }),
    ).rejects.toThrow(EmptyCandidateError);
  });
});
