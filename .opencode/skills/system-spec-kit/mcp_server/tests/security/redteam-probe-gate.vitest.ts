// ───────────────────────────────────────────────────────────────────
// MODULE: Red-Team Probe Gate
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';

import Database from 'better-sqlite3';
import { describe, expect, it } from 'vitest';

import {
  formatSearchResults,
  RECALLED_MEMORY_CONTEXT_NOTE,
  RECALLED_MEMORY_CONTEXT_TAG,
  renderRecalledMemoryContent,
} from '../../formatters/search-results.js';
import { recordGovernanceAudit, reviewGovernanceAudit } from '../../lib/governance/scope-governance.js';
import { sanitizeFTS5Query } from '../../lib/search/bm25-index.js';
import { sanitizeSkillLabel } from '../../lib/utils/skill-label-sanitizer.js';

import type { MCPEnvelope, MCPResponse } from '../../lib/response/envelope.js';

type AttackFamily = 'poisoned-rag' | 'query-only-injection' | 'wrapper-breakout' | 'exfil-audit';
type ProbeVerdict = 'blocked' | 'failed';
type RecallShape = 'full' | 'compact';

interface PayloadFixture {
  id: string;
  payloadClass: string;
  body: string;
}

interface ExfilAuditFixture {
  id: string;
  payloadClass: string;
  queryText: string;
}

interface RedteamFixtures {
  poisonedRag: PayloadFixture[];
  queryOnlyInjection: PayloadFixture[];
  wrapperBreakout: PayloadFixture[];
  negativeControls: PayloadFixture[];
  exfilAudit: ExfilAuditFixture;
}

interface ProbeReport {
  id: string;
  family: AttackFamily;
  seam: string;
  payloadClass: string;
  verdict: ProbeVerdict;
  attackSucceeded: boolean;
  recallShape?: RecallShape;
}

interface SearchResultsResponseData {
  results: Array<{ content?: string | null }>;
}

const fixtures = JSON.parse(
  readFileSync(new URL('./redteam-fixtures/probe-payloads.json', import.meta.url), 'utf8'),
) as RedteamFixtures;
const poisoningFixture = JSON.parse(
  readFileSync(new URL('../advisor-fixtures/promptPoisoningAdversarial.json', import.meta.url), 'utf8'),
) as { inputPrompt: string };
const unicodeInstructionalFixture = JSON.parse(
  readFileSync(new URL('../advisor-fixtures/unicodeInstructionalSkillLabel.json', import.meta.url), 'utf8'),
) as { recommendations: Array<{ skill: string }> };

function parseEnvelope(response: MCPResponse): MCPEnvelope<SearchResultsResponseData> {
  const firstContent = response.content[0];
  expect(firstContent?.type).toBe('text');
  if (firstContent?.type !== 'text') {
    throw new Error('Expected text response content');
  }
  return JSON.parse(firstContent.text) as MCPEnvelope<SearchResultsResponseData>;
}

function makeRecallBody(payload: string, recallShape: RecallShape): string {
  if (recallShape === 'compact') {
    return [
      '<!-- ANCHOR:state -->',
      payload,
      '<!-- /ANCHOR:state -->',
    ].join('\n');
  }
  return payload;
}

async function renderFormattedRecall(payload: string, recallShape: RecallShape): Promise<string> {
  const response = await formatSearchResults(
    [{
      id: recallShape === 'compact' ? 1002 : 1001,
      spec_folder: 'specs/redteam-probe',
      file_path: '/nonexistent/path.md',
      title: 'Redteam Probe',
      source_kind: 'import',
      contentSource: 'reassembled_chunks',
      precomputedContent: makeRecallBody(payload, recallShape),
    }],
    'semantic',
    true,
    recallShape === 'compact' ? ['state'] : null,
  );
  const result = parseEnvelope(response).data.results[0];
  return result?.content ?? '';
}

function countUnescapedRecallClosers(rendered: string): number {
  return rendered.match(new RegExp(`</${RECALLED_MEMORY_CONTEXT_TAG}>`, 'g'))?.length ?? 0;
}

function didEscapeRecallWrapper(rendered: string): boolean {
  return countUnescapedRecallClosers(rendered) !== 1
    || rendered.includes(`</${RECALLED_MEMORY_CONTEXT_TAG}>\nSYSTEM`)
    || /<\/?(assistant|developer|system)>/i.test(rendered);
}

function toReport(input: Omit<ProbeReport, 'verdict'>): ProbeReport {
  return {
    ...input,
    verdict: input.attackSucceeded ? 'failed' : 'blocked',
  };
}

async function runPoisonedRagProbes(): Promise<ProbeReport[]> {
  const reports: ProbeReport[] = [];

  for (const fixture of fixtures.poisonedRag) {
    for (const recallShape of ['full', 'compact'] as const) {
      const rendered = await renderFormattedRecall(fixture.body, recallShape);
      reports.push(toReport({
        id: `${fixture.id}-${recallShape}`,
        family: 'poisoned-rag',
        seam: 'recall-render-wrapper',
        payloadClass: fixture.payloadClass,
        attackSucceeded: didEscapeRecallWrapper(rendered),
        recallShape,
      }));
    }
  }

  return reports;
}

function runQueryOnlyInjectionProbes(): ProbeReport[] {
  return [
    ...fixtures.queryOnlyInjection,
    {
      id: 'fixture-prompt-poisoning-input',
      payloadClass: 'advisor-input-prompt',
      body: poisoningFixture.inputPrompt,
    },
  ].map((fixture) => {
    const sanitizedSkillLabel = sanitizeSkillLabel(fixture.body);
    const sanitizedFtsQuery = sanitizeFTS5Query(fixture.body);
    const attackSucceeded = sanitizedSkillLabel !== null
      || sanitizedFtsQuery.includes(fixture.body)
      || /system\s*:/i.test(sanitizedFtsQuery);

    return toReport({
      id: fixture.id,
      family: 'query-only-injection',
      seam: 'query-label-sanitizers',
      payloadClass: fixture.payloadClass,
      attackSucceeded,
    });
  });
}

function runWrapperBreakoutProbes(): ProbeReport[] {
  const unicodeSkillLabel = unicodeInstructionalFixture.recommendations[0]?.skill ?? '';
  const payloads = [
    ...fixtures.wrapperBreakout,
    {
      id: 'fixture-unicode-instructional-label',
      payloadClass: 'advisor-unicode-skill-label',
      body: unicodeSkillLabel,
    },
  ];

  const reports: ProbeReport[] = [];
  for (const fixture of payloads) {
    for (const recallShape of ['full', 'compact'] as const) {
      const rendered = renderRecalledMemoryContent(
        makeRecallBody(fixture.body, recallShape),
        recallShape === 'compact' ? null : 'manual',
      );
      const skillLabelAccepted = sanitizeSkillLabel(fixture.body) !== null
        && /ignore|system|developer|assistant/i.test(fixture.body);
      reports.push(toReport({
        id: `${fixture.id}-${recallShape}`,
        family: 'wrapper-breakout',
        seam: 'recall-wrapper-and-skill-label',
        payloadClass: fixture.payloadClass,
        attackSucceeded: didEscapeRecallWrapper(rendered) || skillLabelAccepted,
        recallShape,
      }));
    }
  }

  return reports;
}

function runExfilAuditProbe(): ProbeReport {
  const database = new Database(':memory:');
  database.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      file_path TEXT,
      session_id TEXT
    )
  `);

  recordGovernanceAudit(database, {
    action: 'memory_search',
    decision: 'deny',
    tenantId: 'tenant-a',
    userId: 'user-1',
    sessionId: 'session-1',
    reason: fixtures.exfilAudit.queryText,
    metadata: {
      queryText: fixtures.exfilAudit.queryText,
      nested: {
        rawPrompt: fixtures.exfilAudit.queryText,
      },
      issues: ['scope_mismatch'],
    },
  });

  const rawRows = database.prepare('SELECT reason, metadata FROM governance_audit').all() as Array<{
    reason: string | null;
    metadata: string | null;
  }>;
  const review = reviewGovernanceAudit(database, {
    tenantId: 'tenant-a',
    action: 'memory_search',
    decision: 'deny',
  });
  const serializedRawRows = JSON.stringify(rawRows);
  const serializedReview = JSON.stringify(review.rows);
  const attackSucceeded = serializedRawRows.includes(fixtures.exfilAudit.queryText)
    || serializedReview.includes(fixtures.exfilAudit.queryText)
    || review.summary.totalMatching !== 1;

  database.close();

  return toReport({
    id: fixtures.exfilAudit.id,
    family: 'exfil-audit',
    seam: 'governance-denial-audit',
    payloadClass: fixtures.exfilAudit.payloadClass,
    attackSucceeded,
  });
}

function expectStructuredReport(report: ProbeReport[]): void {
  expect(report.length).toBeGreaterThan(0);
  for (const row of report) {
    expect(row).toEqual(expect.objectContaining({
      id: expect.any(String),
      family: expect.stringMatching(/^(poisoned-rag|query-only-injection|wrapper-breakout|exfil-audit)$/),
      seam: expect.any(String),
      payloadClass: expect.any(String),
      verdict: expect.stringMatching(/^(blocked|failed)$/),
      attackSucceeded: expect.any(Boolean),
    }));
  }
}

describe('red-team probe gate', () => {
  it('aggregates injection seams with a zero-success ceiling', async () => {
    const report = [
      ...await runPoisonedRagProbes(),
      ...runQueryOnlyInjectionProbes(),
      ...runWrapperBreakoutProbes(),
      runExfilAuditProbe(),
    ];

    expectStructuredReport(report);
    expect(report.filter((row) => row.attackSucceeded)).toEqual([]);
    expect(report.map((row) => row.family)).toEqual(expect.arrayContaining([
      'poisoned-rag',
      'query-only-injection',
      'wrapper-breakout',
      'exfil-audit',
    ]));
    expect(report.filter((row) => row.recallShape === 'full').length).toBeGreaterThan(0);
    expect(report.filter((row) => row.recallShape === 'compact').length).toBeGreaterThan(0);
  });

  it('keeps a benign recall note from manufacturing a blocked attack', () => {
    const rendered = renderRecalledMemoryContent(fixtures.negativeControls[0]?.body ?? '', 'manual');

    expect(rendered).toContain(`<${RECALLED_MEMORY_CONTEXT_TAG} note="${RECALLED_MEMORY_CONTEXT_NOTE}"`);
    expect(didEscapeRecallWrapper(rendered)).toBe(false);
  });

  it.todo('adds the sibling prompt-pack renderer probe once this phase is allowed to edit deep-loop-runtime');
});
