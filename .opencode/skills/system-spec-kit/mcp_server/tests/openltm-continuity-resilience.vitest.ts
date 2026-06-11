import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

const { handleSessionResumeMock } = vi.hoisted(() => ({
  handleSessionResumeMock: vi.fn(),
}));

vi.mock('../handlers/session-resume.js', () => ({
  handleSessionResume: handleSessionResumeMock,
}));

vi.mock('../handlers/session-health.js', () => ({
  handleSessionHealth: vi.fn(async () => ({
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: { state: 'ok', hints: ['health ok'] } }),
    }],
  })),
}));

vi.mock('../lib/session/context-metrics.js', () => ({
  recordBootstrapEvent: vi.fn(),
}));

vi.mock('../lib/session/session-snapshot.js', () => ({
  buildStructuralBootstrapContract: vi.fn(() => ({
    status: 'ready',
    summary: 'Code graph: ready',
    recommendedAction: 'Structural context available.',
    sourceSurface: 'session_bootstrap',
  })),
}));

import { handleSessionBootstrap } from '../handlers/session-bootstrap.js';
import { refreshAuthoredContinuitySnapshot } from '../lib/continuity/authored-continuity-snapshot.js';
import { buildContinuityFacets, readThinContinuityRecord, renderContinuityFacets } from '../lib/continuity/thin-continuity-record.js';
import { buildResumeLadder } from '../lib/resume/resume-ladder.js';

function createWorkspace(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'openltm-continuity-'));
}

function specFolderPath(workspacePath: string, specFolder: string): string {
  return path.join(workspacePath, '.opencode', 'specs', specFolder);
}

function writeDoc(workspacePath: string, specFolder: string, relativePath: string, content: string): void {
  const fullPath = path.join(specFolderPath(workspacePath, specFolder), relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

function readDoc(workspacePath: string, specFolder: string, relativePath: string): string {
  return fs.readFileSync(path.join(specFolderPath(workspacePath, specFolder), relativePath), 'utf8');
}

function buildHandover(options: { blockers?: string[]; keyFiles?: string[] } = {}): string {
  const blockers = options.blockers ?? ['Hook cache unavailable'];
  const keyFiles = options.keyFiles ?? ['mcp_server/handlers/session-bootstrap.ts'];
  return [
    '---',
    'title: "OpenLTM handover fixture"',
    'last_updated: "2026-06-10T10:00:00Z"',
    '---',
    '# Handover',
    '',
    '**Recent action**: Restored continuity ladder state',
    '**Next safe action**: Run targeted continuity tests',
    `**Blockers**: ${blockers.join('; ')}`,
    `**Key files**: ${keyFiles.join(', ')}`,
    '',
  ].join('\n');
}

function buildImplementationSummary(specFolder: string): string {
  return [
    '---',
    'title: "OpenLTM implementation summary fixture"',
    '_memory:',
    '  continuity:',
    `    packet_pointer: "${specFolder}"`,
    '    last_updated_at: "2026-06-10T09:00:00Z"',
    '    last_updated_by: "resume-test"',
    '    recent_action: "Recorded authored continuity state"',
    '    next_safe_action: "Review continuity handover"',
    '    blockers:',
    '      - "Hook cache unavailable"',
    '    key_files:',
    '      - "mcp_server/lib/resume/resume-ladder.ts"',
    '    completion_pct: 50',
    '    open_questions: []',
    '    answered_questions: []',
    '---',
    '# Implementation Summary',
    '',
    'Authored ladder body content.',
    '',
  ].join('\n');
}

const workspacesToRemove: string[] = [];

afterEach(() => {
  vi.clearAllMocks();
  while (workspacesToRemove.length > 0) {
    const workspacePath = workspacesToRemove.pop();
    if (workspacePath) {
      fs.rmSync(workspacePath, { recursive: true, force: true });
    }
  }
});

describe('OpenLTM continuity resilience surfaces', () => {
  it('builds a bounded restore panel with restored and omitted counts', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/027-parent/009-openltm-continuity';
    const keyFiles = Array.from({ length: 12 }, (_, index) => `mcp_server/tests/recovery-${index}.ts`);
    const blockers = Array.from({ length: 8 }, (_, index) => `cache note ${index}`);
    writeDoc(workspacePath, specFolder, 'handover.md', buildHandover({ blockers, keyFiles }));
    writeDoc(workspacePath, specFolder, 'implementation-summary.md', buildImplementationSummary(specFolder));

    const result = buildResumeLadder({ specFolder, workspacePath });

    expect(result.restorePanel.restoredCount).toBeLessThanOrEqual(result.restorePanel.maxItems);
    expect(result.restorePanel.omittedCount).toBeGreaterThan(0);
    expect(result.restorePanel.markdown).toContain('Restored:');
    expect(result.restorePanel.markdown).toContain('Not restored:');
    expect(result.restorePanel.markdown).toContain('### Goal');
    expect(result.restorePanel.markdown).toContain('### Decision');
    expect(result.restorePanel.markdown).toContain('### Progress');
    expect(result.restorePanel.markdown).toContain('### Gotcha');
    const renderedItems = result.restorePanel.markdown
      .split('\n')
      .filter((line) => line.startsWith('- ') && line !== '- None restored');
    expect(renderedItems).toHaveLength(result.restorePanel.restoredCount);
  });

  it('surfaces the bounded restore panel during session bootstrap', async () => {
    handleSessionResumeMock.mockResolvedValueOnce({
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: {
            memory: {
              restorePanel: {
                restoredCount: 2,
                omittedCount: 3,
                markdown: 'Restored: 2\nNot restored: 3\n\n### Goal\n- Run tests',
              },
            },
            hints: ['resume ok'],
            payloadContract: {
              kind: 'resume',
              summary: 'resume payload',
              sections: [{
                key: 'structural-context',
                title: 'Structural Context',
                content: 'ready',
                source: 'code-graph',
                certainty: 'exact',
                structuralTrust: {
                  parserProvenance: 'ast',
                  evidenceStatus: 'confirmed',
                  freshnessAuthority: 'live',
                },
              }],
              provenance: {
                producer: 'session_resume',
                sourceSurface: 'session_resume',
                trustState: 'live',
                generatedAt: '2026-06-10T00:00:00Z',
                lastUpdated: null,
                sourceRefs: ['session-snapshot'],
              },
            },
          },
        }),
      }],
    });

    const result = await handleSessionBootstrap({ specFolder: 'system-spec-kit/027-parent/009-openltm-continuity' });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.payloadContract.sections).toEqual(expect.arrayContaining([
      expect.objectContaining({
        key: 'startup-restore-panel',
        content: expect.stringContaining('Not restored: 3'),
      }),
    ]));
    expect(parsed.data.hints).toContain('Startup restore panel restored 2 item(s) and omitted 3 item(s).');
  });

  it('refreshes authored ladder docs without minting memory records', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/027-parent/009-openltm-continuity';
    writeDoc(workspacePath, specFolder, 'handover.md', buildHandover());
    writeDoc(workspacePath, specFolder, 'implementation-summary.md', buildImplementationSummary(specFolder));

    const result = refreshAuthoredContinuitySnapshot({
      workspacePath,
      specFolder,
      enabled: true,
      now: new Date('2026-06-10T12:00:00Z'),
    });

    expect(result.status).toBe('updated');
    expect(result.createdMemoryRecords).toBe(0);
    expect(result.indexMutations).toBe(0);
    expect(result.docsUpdated).toEqual(expect.arrayContaining([
      `.opencode/specs/${specFolder}/handover.md`,
      `.opencode/specs/${specFolder}/implementation-summary.md`,
    ]));
    expect(readDoc(workspacePath, specFolder, 'handover.md')).toContain('## Continuity Snapshot');
    expect(readDoc(workspacePath, specFolder, 'implementation-summary.md')).toContain('last_updated_by: "precompact-hook"');
  });

  it('preserves authored continuity fields during snapshot refresh', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/027-parent/009-openltm-continuity';
    const fingerprint = `sha256:${'b'.repeat(64)}`;
    writeDoc(workspacePath, specFolder, 'handover.md', buildHandover());
    writeDoc(workspacePath, specFolder, 'implementation-summary.md', [
      '---',
      'title: "OpenLTM implementation summary fixture"',
      '_memory:',
      '  continuity:',
      `    packet_pointer: "${specFolder}"`,
      '    last_updated_at: "2026-06-10T09:00:00Z"',
      '    last_updated_by: "resume-test"',
      '    recent_action: "Recorded authored continuity state"',
      '    next_safe_action: "Review continuity handover"',
      '    blockers:',
      '      - "Hook cache unavailable"',
      '    key_files:',
      '      - "mcp_server/lib/resume/resume-ladder.ts"',
      '    session_dedup:',
      `      fingerprint: "${fingerprint}"`,
      '      session_id: "precompact-session-001"',
      '      parent_session_id: null',
      '    completion_pct: 80',
      '    open_questions:',
      '      - "Q1"',
      '    answered_questions:',
      '      - "Q2"',
      '---',
      '# Implementation Summary',
      '',
      'Authored ladder body content.',
      '',
    ].join('\n'));

    const result = refreshAuthoredContinuitySnapshot({
      workspacePath,
      specFolder,
      enabled: true,
      now: new Date('2026-06-10T12:00:00Z'),
    });
    const readBack = readThinContinuityRecord(readDoc(workspacePath, specFolder, 'implementation-summary.md'));

    expect(result.status).toBe('updated');
    expect(readBack.ok).toBe(true);
    expect(readBack.record).toMatchObject({
      last_updated_at: '2026-06-10T12:00:00Z',
      last_updated_by: 'precompact-hook',
      recent_action: 'Restored continuity ladder state',
      next_safe_action: 'Run targeted continuity tests',
      completion_pct: 80,
      open_questions: ['Q1'],
      answered_questions: ['Q2'],
      session_dedup: {
        fingerprint,
        session_id: 'precompact-session-001',
        parent_session_id: null,
      },
    });
  });

  it('recovers from markdown snapshot when hook cache is absent', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/027-parent/009-openltm-continuity';
    writeDoc(workspacePath, specFolder, 'implementation-summary.md', buildImplementationSummary(specFolder));

    const snapshot = refreshAuthoredContinuitySnapshot({
      workspacePath,
      specFolder,
      enabled: true,
      now: new Date('2026-06-10T12:00:00Z'),
    });
    const recovery = buildResumeLadder({ specFolder, workspacePath });

    expect(snapshot.recoveryContext).toContain('## Continuity Snapshot');
    expect(recovery.source).not.toBe('none');
    expect(recovery.summary.length).toBeGreaterThan(0);
    expect(readDoc(workspacePath, specFolder, 'handover.md')).toContain('## Continuity Snapshot');
  });

  it('renders continuity summaries with goal decision progress gotcha facets', () => {
    const facets = buildContinuityFacets({
      recentAction: 'Added the restore panel',
      nextSafeAction: 'Run continuity tests',
      blockers: ['Hook cache unavailable'],
      keyFiles: ['mcp_server/lib/resume/resume-ladder.ts'],
      answeredQuestions: ['Q1'],
    });
    const rendered = renderContinuityFacets(facets);

    expect(facets.goal).toEqual(['Run continuity tests']);
    expect(facets.decision).toEqual(['Answered Q1']);
    expect(facets.progress).toContain('Added the restore panel');
    expect(facets.gotcha).toContain('Hook cache unavailable');
    expect(rendered).toContain('### Goal');
    expect(rendered).toContain('### Decision');
    expect(rendered).toContain('### Progress');
    expect(rendered).toContain('### Gotcha');
  });

  it('leaves authored ladder docs and index counters unchanged when disabled', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/027-parent/009-openltm-continuity';
    writeDoc(workspacePath, specFolder, 'handover.md', buildHandover());
    writeDoc(workspacePath, specFolder, 'implementation-summary.md', buildImplementationSummary(specFolder));
    const handoverBefore = readDoc(workspacePath, specFolder, 'handover.md');
    const summaryBefore = readDoc(workspacePath, specFolder, 'implementation-summary.md');

    const result = refreshAuthoredContinuitySnapshot({ workspacePath, specFolder, enabled: false });

    expect(result.status).toBe('disabled');
    expect(result.docsUpdated).toEqual([]);
    expect(result.createdMemoryRecords).toBe(0);
    expect(result.indexMutations).toBe(0);
    expect(readDoc(workspacePath, specFolder, 'handover.md')).toBe(handoverBefore);
    expect(readDoc(workspacePath, specFolder, 'implementation-summary.md')).toBe(summaryBefore);
  });
});
