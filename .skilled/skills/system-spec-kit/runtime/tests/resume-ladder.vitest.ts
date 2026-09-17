import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { buildResumeLadder } from '../lib/resume/resume-ladder.js';
import { buildContinuityFingerprint } from '../lib/validation/spec-doc-structure.js';

function createWorkspace(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'resume-ladder-'));
}

function specFolderPath(workspacePath: string, specFolder: string): string {
  return path.join(workspacePath, '.opencode', 'specs', specFolder);
}

function writeDoc(workspacePath: string, specFolder: string, relativePath: string, content: string): void {
  const fullPath = path.join(specFolderPath(workspacePath, specFolder), relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

function buildHandover(options: {
  title?: string;
  lastUpdated?: string;
  recentAction?: string;
  nextSafeAction?: string;
  blockers?: string;
  keyFiles?: string;
  /** Packet pointer + content fingerprint that lets a handover verify its own binding */
  packetPointer?: string;
  fingerprint?: string;
} = {}): string {
  const bindingLines = options.packetPointer && options.fingerprint
    ? [
      '_memory:',
      '  continuity:',
      `    packet_pointer: "${options.packetPointer}"`,
      '    session_dedup:',
      `      fingerprint: "${options.fingerprint}"`,
    ]
    : [];

  return [
    '---',
    `title: "${options.title ?? 'Gate D handover'}"`,
    `last_updated: "${options.lastUpdated ?? '2026-04-11T12:00:00Z'}"`,
    ...bindingLines,
    '---',
    '# Handover',
    '',
    `**Recent action**: ${options.recentAction ?? 'Finished the reader refactor'}`,
    `**Next safe action**: ${options.nextSafeAction ?? 'Run the targeted resume vitest slice'}`,
    `**Blockers**: ${options.blockers ?? 'Awaiting perf benchmark'}`,
    `**Key files**: ${options.keyFiles ?? 'runtime/handlers/session-resume.ts, runtime/lib/resume/resume-ladder.ts'}`,
    '',
  ].join('\n');
}

function buildImplementationSummary(options: {
  packetPointer: string;
  lastUpdatedAt?: string;
  recentAction?: string;
  nextSafeAction?: string;
  blockers?: string[];
  keyFiles?: string[];
  completionPct?: number;
  bodyLines?: string[];
}): string {
  const blockers = options.blockers ?? ['Awaiting regression confirmation'];
  const keyFiles = options.keyFiles ?? ['runtime/lib/resume/resume-ladder.ts'];
  const bodyLines = options.bodyLines ?? [
    '# Implementation Summary',
    '',
    '## What Was Built',
    '',
    'Canonical resume fallback notes live here when continuity is missing.',
    '',
  ];

  return [
    '---',
    'title: "Gate D implementation summary"',
    'description: "Reader ready fixture"',
    '_memory:',
    '  continuity:',
    `    packet_pointer: "${options.packetPointer}"`,
    `    last_updated_at: "${options.lastUpdatedAt ?? '2026-04-11T11:00:00Z'}"`,
    '    last_updated_by: "resume-test"',
    `    recent_action: "${options.recentAction ?? 'Recorded continuity for the resume ladder'}"`,
    `    next_safe_action: "${options.nextSafeAction ?? 'Review the fixture continuity state'}"`,
    blockers.length === 0 ? '    blockers: []' : '    blockers:',
    ...blockers.map((entry) => `      - "${entry}"`),
    keyFiles.length === 0 ? '    key_files: []' : '    key_files:',
    ...keyFiles.map((entry) => `      - "${entry}"`),
    `    completion_pct: ${options.completionPct ?? 72}`,
    '    open_questions: []',
    '    answered_questions: []',
    '---',
    ...bodyLines,
  ].join('\n');
}

function buildSpecDoc(title: string, body: string): string {
  return [
    '---',
    `title: "${title}"`,
    'description: "Spec doc fallback fixture"',
    '---',
    `# ${title}`,
    '',
    body,
    '',
  ].join('\n');
}

const workspacesToRemove: string[] = [];

afterEach(() => {
  while (workspacesToRemove.length > 0) {
    const workspacePath = workspacesToRemove.pop();
    if (workspacePath) {
      fs.rmSync(workspacePath, { recursive: true, force: true });
    }
  }
});

describe('resume-ladder', () => {
  it('uses handover as the happy-path source when it verifies its packet binding', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/026-root/004-gate-d';

    const continuityContent = buildImplementationSummary({ packetPointer: specFolder });
    writeDoc(workspacePath, specFolder, 'handover.md', buildHandover({
      packetPointer: specFolder,
      fingerprint: buildContinuityFingerprint(continuityContent),
    }));
    writeDoc(workspacePath, specFolder, 'implementation-summary.md', continuityContent);

    const result = buildResumeLadder({ specFolder, workspacePath });

    expect(result.source).toBe('handover');
    expect(result.recentAction).toContain('Finished the reader refactor');
    expect(result.nextSafeAction).toContain('Run the targeted resume vitest slice');
    expect(result.documents.map((document) => document.type)).toContain('handover');
  });

  it('falls back to continuity when handover is missing', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/026-root/004-gate-d';

    writeDoc(workspacePath, specFolder, 'implementation-summary.md', buildImplementationSummary({
      packetPointer: specFolder,
      recentAction: 'Continuity owns this resume path',
      nextSafeAction: 'Run the continuity-first resume flow',
    }));

    const result = buildResumeLadder({ specFolder, workspacePath });

    expect(result.source).toBe('continuity');
    expect(result.recentAction).toBe('Continuity owns this resume path');
    expect(result.nextSafeAction).toBe('Run the continuity-first resume flow');
  });

  it('falls through to spec docs when continuity is malformed', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/026-root/004-gate-d';

    writeDoc(workspacePath, specFolder, 'implementation-summary.md', [
      '---',
      'title: "Malformed continuity fixture"',
      '_memory:',
      '  continuity:',
      '    packet_pointer: "broken',
      '---',
      '# Implementation Summary',
      '',
      'Spec doc fallback should still recover from the body content.',
      '',
    ].join('\n'));
    writeDoc(workspacePath, specFolder, 'tasks.md', buildSpecDoc('Tasks', 'Review tasks.md and continue the packet.'));

    const result = buildResumeLadder({ specFolder, workspacePath });

    expect(result.source).toBe('spec-docs');
    expect(result.summary).toContain('Malformed continuity fixture');
    expect(result.nextSafeAction).toContain('tasks.md');
  });

  it('returns a no-recovery package when the packet has no canonical docs', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/026-root/004-gate-d';
    fs.mkdirSync(specFolderPath(workspacePath, specFolder), { recursive: true });

    const result = buildResumeLadder({ specFolder, workspacePath });

    expect(result.source).toBe('none');
    expect(result.summary).toContain('No recovery context found');
  });

  it('merges mixed handover and continuity state while preferring the freshest signal', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/026-root/004-gate-d';

    writeDoc(workspacePath, specFolder, 'handover.md', buildHandover({
      lastUpdated: '2026-04-11T10:00:00Z',
      recentAction: 'Handover is older than continuity',
      nextSafeAction: 'Run the older handover path',
      blockers: 'Manual QA pending',
    }));
    writeDoc(workspacePath, specFolder, 'implementation-summary.md', buildImplementationSummary({
      packetPointer: specFolder,
      lastUpdatedAt: '2026-04-11T12:30:00Z',
      recentAction: 'Continuity is newer than handover',
      nextSafeAction: 'Continue with the fresher continuity state',
      blockers: ['Regression still pending'],
      keyFiles: ['runtime/tests/session-resume.vitest.ts'],
    }));

    const result = buildResumeLadder({ specFolder, workspacePath });

    expect(result.source).toBe('continuity');
    expect(result.freshnessWinner).toBe('continuity');
    expect(result.blockers).toContain('Manual QA pending');
    expect(result.blockers).toContain('Regression still pending');
    expect(result.keyFiles).toContain('runtime/tests/session-resume.vitest.ts');
  });

  it('renders only budget-restored items in restore panel markdown', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/026-root/004-gate-d';
    const keyFiles = Array.from({ length: 12 }, (_, index) => `runtime/tests/recovery-${index}.ts`);
    const blockers = Array.from({ length: 8 }, (_, index) => `cache note ${index}`);

    writeDoc(workspacePath, specFolder, 'handover.md', buildHandover({
      blockers: blockers.join('; '),
      keyFiles: keyFiles.join(', '),
    }));

    const result = buildResumeLadder({ specFolder, workspacePath });

    expect(result.restorePanel.restoredCount).toBe(result.restorePanel.maxItems);
    expect(result.restorePanel.omittedCount).toBeGreaterThan(0);
    expect(result.restorePanel.omittedByReason['item-budget']).toBeGreaterThan(0);
    expect(result.restorePanel.markdown.length).toBeLessThanOrEqual(result.restorePanel.maxChars);
    expect(result.restorePanel.markdown).toContain(`Restored: ${result.restorePanel.restoredCount}`);
    expect(result.restorePanel.markdown).toContain(`Not restored: ${result.restorePanel.omittedCount}`);
    for (const item of result.restorePanel.restored) {
      expect(result.restorePanel.markdown).toContain(item.text);
    }
    expect(result.restorePanel.markdown).not.toContain('cache note 3');
    expect(result.restorePanel.markdown).not.toContain('Recovered ');
    expect(result.restorePanel.facets.gotcha).not.toContain('cache note 3');
  });

  // Add absolute and out-of-root specFolder rejection tests
  it('rejects absolute specFolder values that escape the workspace root', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);

    // Attempt to use an absolute path that does not resolve under workspacePath
    const result = buildResumeLadder({
      specFolder: '/etc/passwd',
      workspacePath,
    });

    // The ladder should return a none/error recovery since the path is invalid
    expect(['none', 'error']).toContain(result.source);
  });

  it('rejects specFolder with path traversal that escapes the workspace', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);

    const result = buildResumeLadder({
      specFolder: '../../../../etc/passwd',
      workspacePath,
    });

    expect(['none', 'error']).toContain(result.source);
  });

  it('handles Unicode characters in specFolder names gracefully', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/026-root/004-\u00e4\u00f6\u00fc-gate';

    writeDoc(workspacePath, specFolder, 'implementation-summary.md', buildImplementationSummary({
      packetPointer: specFolder,
      recentAction: 'Unicode folder name test',
      nextSafeAction: 'Verify Unicode path handling',
    }));

    const result = buildResumeLadder({ specFolder, workspacePath });

    // packet_pointer's canonical-path-shape check is ASCII-only, so a
    // Unicode folder name fails strict continuity validation regardless of
    // the rest of the record; "graceful" here means the ladder still
    // resolves the folder and falls through to the spec-doc tier instead of
    // throwing or silently trusting an unvalidated field extraction.
    expect(result.specFolder).toBe(specFolder);
    expect(result.source).toBe('spec-docs');
    expect(result.recentAction).toBeTruthy();
  });

  // Timestamp-alias coverage: handover files in the wild use field names other than
  // 'last_updated'. These tests confirm the freshness comparison uses the correct
  // logical edit time rather than silently falling through to mtime. Each handover
  // also declares a packet-bound, fingerprint-verified binding so it competes on
  // freshness at all (an unbound handover never outranks validated continuity,
  // regardless of timestamp).

  it('reads handover freshness from the short "updated" alias', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/026-root/004-gate-d';

    const continuityContent = buildImplementationSummary({
      packetPointer: specFolder,
      lastUpdatedAt: '2026-04-11T11:00:00Z',
    });
    const fingerprint = buildContinuityFingerprint(continuityContent);
    const handover = [
      '---',
      'title: "Short-alias handover"',
      'updated: "2026-05-30T00:00:00Z"',
      '_memory:',
      '  continuity:',
      `    packet_pointer: "${specFolder}"`,
      '    session_dedup:',
      `      fingerprint: "${fingerprint}"`,
      '---',
      '# Handover',
      '',
      '**Recent action**: Used updated field alias',
      '**Next safe action**: Confirm alias is resolved',
      '**Blockers**: none',
      '',
    ].join('\n');
    writeDoc(workspacePath, specFolder, 'handover.md', handover);
    writeDoc(workspacePath, specFolder, 'implementation-summary.md', continuityContent);

    const result = buildResumeLadder({ specFolder, workspacePath });

    // Handover's 2026-05-30 is newer than continuity's 2026-04-11, so a verified handover wins.
    expect(result.source).toBe('handover');
    expect(result.freshnessWinner).toBe('handover');
    expect(result.recentAction).toContain('Used updated field alias');
  });

  it('reads handover freshness from last_updated_at indented under _memory.continuity', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/026-root/004-gate-d';

    const continuityContent = buildImplementationSummary({
      packetPointer: specFolder,
      lastUpdatedAt: '2026-04-11T11:00:00Z',
    });
    const fingerprint = buildContinuityFingerprint(continuityContent);
    // Mirrors the handover.md shape where last_updated_at is
    // nested 4 spaces inside _memory.continuity rather than at the document root.
    const handover = [
      '---',
      'title: "Nested continuity handover"',
      '_memory:',
      '  continuity:',
      `    packet_pointer: "${specFolder}"`,
      '    last_updated_at: "2026-05-28T00:00:00Z"',
      '    last_updated_by: "claude-opus"',
      '    recent_action: "Used indented last_updated_at"',
      '    next_safe_action: "Confirm continuity-block fallback works"',
      '    blockers: []',
      '    session_dedup:',
      `      fingerprint: "${fingerprint}"`,
      '---',
      '# Handover',
      '',
      '**Recent action**: Used indented last_updated_at',
      '**Next safe action**: Confirm continuity-block fallback works',
      '**Blockers**: none',
      '',
    ].join('\n');
    writeDoc(workspacePath, specFolder, 'handover.md', handover);
    writeDoc(workspacePath, specFolder, 'implementation-summary.md', continuityContent);

    const result = buildResumeLadder({ specFolder, workspacePath });

    // Handover's 2026-05-28 is newer than continuity's 2026-04-11, so a verified handover wins.
    expect(result.source).toBe('handover');
    expect(result.freshnessWinner).toBe('handover');
    expect(result.recentAction).toContain('Used indented last_updated_at');
  });

  // Deep-review regression coverage for explicit specFolder priority over cached scope.
  it('keeps explicit specFolder overrides ahead of cached scope fallbacks', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const fallbackSpecFolder = 'system-spec-kit/026-root/003-stale';
    const explicitSpecFolder = 'system-spec-kit/026-root/004-gate-d';

    writeDoc(workspacePath, fallbackSpecFolder, 'implementation-summary.md', buildImplementationSummary({
      packetPointer: fallbackSpecFolder,
      recentAction: 'Stale fallback continuity',
    }));
    writeDoc(workspacePath, explicitSpecFolder, 'implementation-summary.md', buildImplementationSummary({
      packetPointer: fallbackSpecFolder,
      recentAction: 'Explicit override continuity',
      nextSafeAction: 'Validate the explicit folder path',
    }));

    const result = buildResumeLadder({
      specFolder: explicitSpecFolder,
      fallbackSpecFolder,
      workspacePath,
    });

    expect(result.resolution.kind).toBe('explicit');
    expect(result.specFolder).toBe(explicitSpecFolder);
    expect(result.recentAction).toBe('Explicit override continuity');
    expect(result.hints).toContain('Explicit specFolder override took precedence over the continuity packet pointer.');
  });

  // Trust-ranking coverage: a malformed continuity signal is rejected outright
  // rather than partially trusted, and only a packet-bound, fingerprint-verified
  // handover can outrank validated continuity on freshness.

  it('rejects a malformed session_dedup.fingerprint outright instead of falling back to manual extraction', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/026-root/004-gate-d';

    // Every other field is well-formed; only the fingerprint fails MEMORY_011's
    // sha256-prefixed 64-hex-digest shape. The removed manual-extraction fallback
    // never checked field shapes at all, so it would have salvaged this record.
    writeDoc(workspacePath, specFolder, 'implementation-summary.md', [
      '---',
      'title: "Malformed fingerprint fixture"',
      '_memory:',
      '  continuity:',
      `    packet_pointer: "${specFolder}"`,
      '    last_updated_at: "2026-04-11T11:00:00Z"',
      '    last_updated_by: "resume-test"',
      '    recent_action: "Recorded continuity for the resume ladder"',
      '    next_safe_action: "Review the fixture continuity state"',
      '    blockers: []',
      '    key_files: []',
      '    session_dedup:',
      '      fingerprint: "not-a-valid-fingerprint"',
      '      session_id: "2026-04-11-gate-d"',
      '      parent_session_id: null',
      '    completion_pct: 40',
      '    open_questions: []',
      '    answered_questions: []',
      '---',
      '# Implementation Summary',
      '',
      'Body content the ladder must not use as a continuity signal.',
      '',
    ].join('\n'));
    writeDoc(workspacePath, specFolder, 'tasks.md', buildSpecDoc('Tasks', 'Review tasks.md and continue the packet.'));

    const result = buildResumeLadder({ specFolder, workspacePath });

    expect(result.source).toBe('spec-docs');
    expect(result.nextSafeAction).toContain('tasks.md');
  });

  it('never lets an unbound newer handover outrank validated continuity', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/026-root/004-gate-d';

    writeDoc(workspacePath, specFolder, 'handover.md', buildHandover({
      lastUpdated: '2026-06-01T00:00:00Z',
      recentAction: 'Unbound handover claims the freshest edit',
      nextSafeAction: 'Trust this handover on timestamp alone',
    }));
    writeDoc(workspacePath, specFolder, 'implementation-summary.md', buildImplementationSummary({
      packetPointer: specFolder,
      lastUpdatedAt: '2026-01-01T00:00:00Z',
      recentAction: 'Older but validated and packet-bound',
    }));

    const result = buildResumeLadder({ specFolder, workspacePath });

    expect(result.source).toBe('continuity');
    expect(result.freshnessWinner).toBe('continuity');
    expect(result.recentAction).toBe('Older but validated and packet-bound');
  });

  it('lets a packet-bound, fingerprint-verified newer handover win on freshness', () => {
    const workspacePath = createWorkspace();
    workspacesToRemove.push(workspacePath);
    const specFolder = 'system-spec-kit/026-root/004-gate-d';

    const continuityContent = buildImplementationSummary({
      packetPointer: specFolder,
      lastUpdatedAt: '2026-01-01T00:00:00Z',
      recentAction: 'Older continuity state',
    });
    writeDoc(workspacePath, specFolder, 'handover.md', buildHandover({
      lastUpdated: '2026-06-01T00:00:00Z',
      recentAction: 'Verified handover wins on freshness',
      nextSafeAction: 'Trust this handover binding',
      packetPointer: specFolder,
      fingerprint: buildContinuityFingerprint(continuityContent),
    }));
    writeDoc(workspacePath, specFolder, 'implementation-summary.md', continuityContent);

    const result = buildResumeLadder({ specFolder, workspacePath });

    expect(result.source).toBe('handover');
    expect(result.freshnessWinner).toBe('handover');
    expect(result.recentAction).toBe('Verified handover wins on freshness');
  });
});
