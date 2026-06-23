import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  formatSearchResults,
  buildEnvelopeRenderFragment,
  type RawSearchResult,
} from '../formatters/search-results';
// @ts-expect-error -- plain ESM eval script, no type declarations
import { checkEnvelopeFidelity, readRenderedField } from '../scripts/evals/check-envelope-fidelity.mjs';

const ENVELOPE_FLAG = 'SPECKIT_ENVELOPE_FIDELITY_V1';
// The verdict bands off the uncalibrated relevance signal; the isotonic model
// caps "good" by default, so pin it OFF to keep the verdict subject visible.
const CONFIDENCE_CALIBRATION_FLAG = 'SPECKIT_CONFIDENCE_CALIBRATION';

interface SearchEnvelope {
  data: {
    count: number;
    results: Array<Record<string, unknown>>;
    requestQuality?: { label: string };
    citationPolicy?: string;
    envelopeRender?: string;
    [key: string]: unknown;
  };
}

function parseEnvelope(response: Awaited<ReturnType<typeof formatSearchResults>>): SearchEnvelope {
  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || typeof textBlock.text !== 'string') {
    throw new Error('Expected text response block');
  }
  return JSON.parse(textBlock.text) as SearchEnvelope;
}

function makeResult(id: number, overrides: Partial<RawSearchResult> = {}): RawSearchResult {
  return {
    id,
    spec_folder: 'specs/system-spec-kit/027-envelope-fidelity-enforcement',
    file_path: `/tmp/envelope-${id}.md`,
    title: `Envelope Result ${id}`,
    similarity: 92,
    averageSimilarity: 92,
    triggerPhrases: ['envelope', 'fidelity'],
    created_at: '2026-06-22T00:00:00.000Z',
    ...overrides,
  };
}

function goodResults(): RawSearchResult[] {
  return [1, 2, 3].map((n) =>
    makeResult(n, {
      intentAdjustedScore: 0.95 - (n - 1) * 0.03,
      rrfScore: 0.93 - (n - 1) * 0.03,
      sources: ['semantic', 'fts'],
      anchorMetadata: [
        { id: `decision-${n}`, type: 'decision' },
        { id: `plan-${n}`, type: 'plan' },
        { id: `task-${n}`, type: 'task' },
      ],
    }),
  );
}

async function formatEnvelope(results: RawSearchResult[] | null): Promise<SearchEnvelope> {
  const response = await formatSearchResults(
    results,
    'hybrid',
    false,
    null,
    null,
    Date.now(),
    { query: 'envelope fidelity enforcement', normalizedQuery: 'envelope fidelity enforcement' },
    true,
    'envelope fidelity enforcement',
  );
  return parseEnvelope(response);
}

describe('Phase 027: envelope-fidelity render fragment', () => {
  let originalEnvelopeFlag: string | undefined;
  let originalCalibrationFlag: string | undefined;

  beforeEach(() => {
    originalEnvelopeFlag = process.env[ENVELOPE_FLAG];
    originalCalibrationFlag = process.env[CONFIDENCE_CALIBRATION_FLAG];
    process.env[CONFIDENCE_CALIBRATION_FLAG] = 'false';
  });

  afterEach(() => {
    if (originalEnvelopeFlag === undefined) delete process.env[ENVELOPE_FLAG];
    else process.env[ENVELOPE_FLAG] = originalEnvelopeFlag;
    if (originalCalibrationFlag === undefined) delete process.env[CONFIDENCE_CALIBRATION_FLAG];
    else process.env[CONFIDENCE_CALIBRATION_FLAG] = originalCalibrationFlag;
  });

  it('emits envelopeRender matching the shipped label and policy when the flag is on', async () => {
    process.env[ENVELOPE_FLAG] = 'true';
    const envelope = await formatEnvelope(goodResults());

    const label = envelope.data.requestQuality?.label;
    const policy = envelope.data.citationPolicy;
    expect(label).toBe('good');
    expect(policy).toBe('cite_results');

    expect(envelope.data.envelopeRender).toBe(`requestQuality ${label}\ncitationPolicy ${policy}`);
    // The fragment must carry both field names and the verbatim verdict values.
    expect(readRenderedField(envelope.data.envelopeRender, 'requestQuality')).toBe(label);
    expect(readRenderedField(envelope.data.envelopeRender, 'citationPolicy')).toBe(policy);
  });

  it('is absent when the flag is off, leaving the shipped shape unchanged', async () => {
    process.env[ENVELOPE_FLAG] = 'false';
    const flagOff = await formatEnvelope(goodResults());
    expect('envelopeRender' in flagOff.data).toBe(false);

    process.env[ENVELOPE_FLAG] = 'true';
    const flagOn = await formatEnvelope(goodResults());

    // Flag-off envelope is byte-identical to flag-on minus only the additive
    // envelopeRender key, proving the gate adds nothing else.
    const { envelopeRender: _stripped, ...flagOnWithoutRender } = flagOn.data;
    expect(flagOnWithoutRender).toEqual(flagOff.data);
  });

  it('emits the fragment whenever the verdict is shipped (weak verdict too)', async () => {
    process.env[ENVELOPE_FLAG] = 'true';
    const envelope = await formatEnvelope([
      makeResult(1, { similarity: 19, averageSimilarity: 19, intentAdjustedScore: 0.18, rrfScore: 0.16, fts_score: 0.03, anchorMetadata: [] }),
      makeResult(2, { similarity: 17, averageSimilarity: 17, intentAdjustedScore: 0.17, rrfScore: 0.15, fts_score: 0.02, anchorMetadata: [] }),
    ]);

    const label = envelope.data.requestQuality?.label;
    expect(label).toBeDefined();
    expect(envelope.data.envelopeRender).toBe(
      `requestQuality ${label}\ncitationPolicy ${envelope.data.citationPolicy}`,
    );
  });

  it('survives the memory_context re-wrap passthrough', async () => {
    process.env[ENVELOPE_FLAG] = 'true';
    const envelope = await formatEnvelope(goodResults());
    expect(envelope.data.envelopeRender).toBeDefined();

    // Mirror the context handler re-wrap: spread the whole data object, mutate
    // results, re-stringify with { ...envelope, data }, then re-parse.
    const data = { ...(envelope.data as Record<string, unknown>) };
    data.results = [...(data.results as Array<Record<string, unknown>>), { id: 'prelude', groundingPrelude: true }];
    const rewrapped = JSON.parse(JSON.stringify({ ...envelope, data })) as SearchEnvelope;

    expect(rewrapped.data.envelopeRender).toBe(envelope.data.envelopeRender);
  });

  it('builds null when the tool shipped no verdict', () => {
    expect(buildEnvelopeRenderFragment(null, null)).toBeNull();
    expect(buildEnvelopeRenderFragment({ requestQuality: { label: 'good' } }, null)).toBeNull();
  });
});

describe('Phase 027: post-render envelope-fidelity check', () => {
  const verdict = { requestQuality: { label: 'good' }, citationPolicy: 'cite_results' };
  const faithfulRender = [
    'specs/027-envelope/',
    '  0.92  #1  Envelope Result 1',
    '',
    'requestQuality good',
    'citationPolicy cite_results',
    '',
    'STATUS=OK RESULTS=1 INTENT=understand',
  ].join('\n');

  it('passes a faithful render', () => {
    const report = checkEnvelopeFidelity(verdict, faithfulRender, { mode: 'fail' });
    expect(report.ok).toBe(true);
    expect(report.conforming).toBe(true);
    expect(report.findings).toEqual([]);
  });

  it('fails a render that drops a shipped field in fail mode', () => {
    const droppedRender = faithfulRender.replace('citationPolicy cite_results\n', '');
    const report = checkEnvelopeFidelity(verdict, droppedRender, { mode: 'fail' });
    expect(report.ok).toBe(false);
    expect(report.conforming).toBe(false);
    expect(report.findings).toContainEqual(
      expect.objectContaining({ field: 'citationPolicy', kind: 'dropped', expected: 'cite_results' }),
    );
  });

  it('reads a renamed field as a dropped field', () => {
    const renamedRender = faithfulRender.replace('requestQuality good', 'quality good');
    const report = checkEnvelopeFidelity(verdict, renamedRender, { mode: 'fail' });
    expect(report.ok).toBe(false);
    expect(report.findings).toContainEqual(
      expect.objectContaining({ field: 'requestQuality', kind: 'dropped' }),
    );
  });

  it('fails an altered verdict value distinctly from a drop', () => {
    const alteredRender = faithfulRender.replace('requestQuality good', 'requestQuality high');
    const report = checkEnvelopeFidelity(verdict, alteredRender, { mode: 'fail' });
    expect(report.ok).toBe(false);
    expect(report.findings).toContainEqual(
      expect.objectContaining({ field: 'requestQuality', kind: 'altered', expected: 'good', actual: 'high' }),
    );
  });

  it('lists a non-conforming render without failing in grandfather report mode', () => {
    const droppedRender = faithfulRender.replace('citationPolicy cite_results\n', '');
    const report = checkEnvelopeFidelity(verdict, droppedRender, { mode: 'grandfather' });
    expect(report.ok).toBe(true);
    expect(report.conforming).toBe(false);
    expect(report.status).toBe('non_conforming');
    expect(report.findings.length).toBeGreaterThan(0);
  });

  it('treats a confidence-disabled run as nothing-to-replay', () => {
    const report = checkEnvelopeFidelity({}, 'no verdict was shipped', { mode: 'fail' });
    expect(report.ok).toBe(true);
    expect(report.status).toBe('nothing_to_replay');
  });

  it('replays the exact fragment the formatter emits', () => {
    const fragment = buildEnvelopeRenderFragment(
      { requestQuality: { label: 'good' } },
      'cite_results',
    );
    const report = checkEnvelopeFidelity(verdict, fragment, { mode: 'fail' });
    expect(report.conforming).toBe(true);
  });
});
