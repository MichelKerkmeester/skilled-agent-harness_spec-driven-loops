import { describe, expect, it } from 'vitest';
import {
  REVIEW_THRESHOLDS,
  SEVERITY_LEVELS,
  byReviewPriority,
  judgeFinding,
  reviewQuestions,
  type Finding,
} from '../src/domain/catalog/review.js';
import {
  HYPOTHESIS_WEIGHTS,
  hypothesisQuestions,
  readHypothesis,
} from '../src/domain/catalog/hypotheses.js';
import {
  PICK_THRESHOLDS,
  decisionQuestions,
  readDecision,
  type Decision,
} from '../src/domain/catalog/options.js';
import { RELEVANCE_THRESHOLDS, readRelevance } from '../src/domain/catalog/relevance.js';
import { MissingAnswerError, type AnswerMap } from '../src/domain/question.js';
import { choice, noul, score } from './fake-jev.js';

const finding: Finding = {
  id: 'f1',
  file: 'src/a.ts',
  claim: 'the index can be negative',
  failure: 'items.at(-1) returns the last element instead of undefined',
};

function reviewAnswers(real: number, reachable: number, handled: number, severity = 2): AnswerMap {
  return {
    real_f1: noul(real),
    reachable_f1: noul(reachable),
    already_handled_f1: noul(handled),
    severity_f1: score(severity, SEVERITY_LEVELS.length),
  };
}

describe('review questions', () => {
  it('asks four independent questions per finding', () => {
    expect(Object.keys(reviewQuestions(finding))).toEqual([
      'real_f1',
      'reachable_f1',
      'already_handled_f1',
      'severity_f1',
    ]);
  });

  it('rates severity against the shared level list', () => {
    const question = reviewQuestions(finding)['severity_f1'];
    expect(question?.type).toBe('score');
    expect(question?.type === 'score' && question.criteria).toEqual(SEVERITY_LEVELS);
  });
});

describe('judgeFinding', () => {
  it('drops a finding just below the reality threshold', () => {
    const judgement = judgeFinding(finding, reviewAnswers(REVIEW_THRESHOLDS.real - 0.01, 0.9, 0));
    expect(judgement.verdict).toBe('drop');
  });

  it('keeps a finding exactly at the reality threshold', () => {
    const judgement = judgeFinding(finding, reviewAnswers(REVIEW_THRESHOLDS.real, 0.9, 0));
    expect(judgement.verdict).toBe('keep');
  });

  it('drops a finding an existing guard already covers', () => {
    const judgement = judgeFinding(
      finding,
      reviewAnswers(0.9, 0.9, REVIEW_THRESHOLDS.alreadyHandled),
    );
    expect(judgement.verdict).toBe('drop');
    expect(judgement.reason).toContain('guard');
  });

  it('demotes a real but unreachable finding', () => {
    const judgement = judgeFinding(
      finding,
      reviewAnswers(0.9, REVIEW_THRESHOLDS.reachable - 0.01, 0),
    );
    expect(judgement.verdict).toBe('keep_low');
  });

  it('keeps a finding exactly at the reachability threshold', () => {
    const judgement = judgeFinding(finding, reviewAnswers(0.9, REVIEW_THRESHOLDS.reachable, 0));
    expect(judgement.verdict).toBe('keep');
  });

  it('refuses to guess when Jev skipped an answer', () => {
    expect(() => judgeFinding(finding, {})).toThrow(MissingAnswerError);
  });
});

describe('byReviewPriority', () => {
  it('puts keepers first and the worst consequence on top', () => {
    const answersFor = (
      id: string,
      real: number,
      reachable: number,
      severity: number,
    ): AnswerMap => ({
      [`real_${id}`]: noul(real),
      [`reachable_${id}`]: noul(reachable),
      [`already_handled_${id}`]: noul(0),
      [`severity_${id}`]: score(severity, SEVERITY_LEVELS.length),
    });
    const judgements = [
      judgeFinding({ ...finding, id: 'dropped' }, answersFor('dropped', 0.2, 0.9, 3)),
      judgeFinding({ ...finding, id: 'mild' }, answersFor('mild', 0.9, 0.9, 1)),
      judgeFinding({ ...finding, id: 'severe' }, answersFor('severe', 0.9, 0.9, 3)),
      judgeFinding({ ...finding, id: 'unreachable' }, answersFor('unreachable', 0.9, 0.1, 3)),
    ];
    const order = [...judgements].sort(byReviewPriority).map((judgement) => judgement.id);
    expect(order).toEqual(['severe', 'mild', 'unreachable', 'dropped']);
  });
});

describe('readDecision', () => {
  const decision: Decision = {
    question: 'How should the cache live?',
    requirement: 'survive a restart without extra infrastructure',
    options: [
      { label: 'sqlite', summary: 'a local file-backed table' },
      { label: 'redis', summary: 'a separate server' },
    ],
  };

  it('asks one question per angle plus a risk score per option', () => {
    expect(Object.keys(decisionQuestions(decision))).toEqual([
      'best',
      'safest',
      'simplest',
      'risk_1',
      'risk_2',
    ]);
  });

  it('reports unanimity when all three angles pick the same option', () => {
    const reading = readDecision(decision, {
      best: choice('sqlite', { sqlite: 0.8, redis: 0.2 }),
      safest: choice('sqlite', { sqlite: 0.7, redis: 0.3 }),
      simplest: choice('sqlite', { sqlite: 0.9, redis: 0.1 }),
      risk_1: score(0.5, 4),
      risk_2: score(2.5, 4),
    });
    expect(reading.unanimous).toBe(true);
    expect(reading.flat).toBe(false);
    expect(reading.options[0]?.risk).toBe(0.5);
  });

  it('flags a flat distribution as a weak preference', () => {
    const reading = readDecision(decision, {
      best: choice('sqlite', { sqlite: 0.51, redis: 0.49 }, PICK_THRESHOLDS.lowConfidence - 0.01),
      safest: choice('redis', { sqlite: 0.4, redis: 0.6 }),
      simplest: choice('sqlite', { sqlite: 0.9, redis: 0.1 }),
      risk_1: score(1, 4),
      risk_2: score(2, 4),
    });
    expect(reading.flat).toBe(true);
    expect(reading.unanimous).toBe(false);
  });
});

describe('readHypothesis', () => {
  it('weights explaining the whole symptom above supporting evidence', () => {
    const questions = hypothesisQuestions({ id: 'h1', claim: 'the lock is never released' });
    expect(Object.keys(questions)).toEqual(['explains_h1', 'supported_h1', 'next_check_h1']);
    const reading = readHypothesis(
      { id: 'h1', claim: 'the lock is never released' },
      {
        explains_h1: noul(1),
        supported_h1: noul(0),
        next_check_h1: choice('read_code', { read_code: 0.9, run_test: 0.1 }),
      },
    );
    expect(reading.rank).toBeCloseTo(HYPOTHESIS_WEIGHTS.explains);
    expect(reading.nextCheck).toBe('read_code');
  });
});

describe('readRelevance', () => {
  it('keeps a candidate exactly at the threshold', () => {
    const reading = readRelevance(
      { id: 'c1', label: 'src/a.ts' },
      { needed_c1: noul(RELEVANCE_THRESHOLDS.needed) },
    );
    expect(reading.keep).toBe(true);
  });

  it('drops a candidate just below it', () => {
    const reading = readRelevance(
      { id: 'c1', label: 'src/a.ts' },
      { needed_c1: noul(RELEVANCE_THRESHOLDS.needed - 0.01) },
    );
    expect(reading.keep).toBe(false);
  });
});
