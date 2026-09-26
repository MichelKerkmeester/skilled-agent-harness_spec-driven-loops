import { describe, expect, it } from 'vitest';
import { formatAnswers, formatRelevance, formatReview } from '../src/adapters/format.js';
import { judgeFinding, SEVERITY_LEVELS, type Finding } from '../src/domain/catalog/review.js';
import { readRelevance } from '../src/domain/catalog/relevance.js';
import { choice, noul, score } from './fake-jev.js';

const meta = {
  model: 'jev-1.13.0',
  usage: { inputTokens: 4210, outputTokens: 96 },
  requests: 2,
  stateTokens: 3100,
};

describe('formatAnswers', () => {
  it('prints one line per answer and the cost at the end', () => {
    const text = formatAnswers(
      {
        urgent: noul(0.92),
        team: choice('technical', { technical: 0.85, billing: 0.15 }, 0.82),
      },
      meta,
    );
    expect(text).toContain('urgent  noul 0.92');
    expect(text).toContain('team  choice technical  conf 0.82  [technical 0.85, billing 0.15]');
    expect(text).toContain('4210 input tok');
    expect(text).toContain('2 requests');
  });
});

describe('formatReview', () => {
  it('shows the verdict, the numbers behind it, and how many survived', () => {
    const finding: Finding = {
      id: 'f1',
      file: 'src/a.ts',
      claim: 'off by one',
      failure: 'skips the last item',
    };
    const judgement = judgeFinding(finding, {
      real_f1: noul(0.93),
      reachable_f1: noul(0.88),
      already_handled_f1: noul(0.04),
      severity_f1: score(2.6, SEVERITY_LEVELS.length, 0.71),
    });
    const text = formatReview([judgement], meta);
    expect(text).toContain('keep     f1  real 0.93  reach 0.88  guarded 0.04  severity 2.60/3');
    expect(text).toContain('1 of 1 findings survive');
  });
});

describe('formatRelevance', () => {
  it('names the dropped candidates so nothing disappears silently', () => {
    const kept = readRelevance({ id: 'c1', label: 'src/a.ts' }, { needed_c1: noul(0.94) });
    const dropped = readRelevance({ id: 'c2', label: 'src/b.ts' }, { needed_c2: noul(0.12) });
    const text = formatRelevance([kept], [dropped], meta);
    expect(text).toContain('keep (1):');
    expect(text).toContain('0.94  src/a.ts');
    expect(text).toContain('drop (1): src/b.ts 0.12');
  });

  it('says so when nothing passed', () => {
    expect(formatRelevance([], [], meta)).toContain('nothing passed the threshold');
  });
});
