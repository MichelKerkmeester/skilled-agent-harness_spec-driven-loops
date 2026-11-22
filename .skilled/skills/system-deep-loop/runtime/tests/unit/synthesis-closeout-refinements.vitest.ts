// ───────────────────────────────────────────────────────────────────
// MODULE: Synthesis Closeout Refinement Count Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const closeoutScript = join(dirname(fileURLToPath(import.meta.url)), '../../scripts/synthesis-closeout.cjs');

type Finding = Record<string, unknown>;

// One review run over two iterations. The registry is what the review reducer
// leaves behind, so a test states the folded or unfolded shape directly.
function runReviewCloseout(
  iterationFindings: Finding[][],
  openFindings: Finding[],
): { status: number | null; stderr: string; eventName: string; data: Record<string, unknown> } {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'synthesis-closeout-refinements-'));
  try {
    const artifactDir = join(root, 'review');
    const eventDir = join(root, 'events');
    fs.mkdirSync(artifactDir, { recursive: true });
    fs.mkdirSync(eventDir, { recursive: true });
    const stateLog = join(artifactDir, 'deep-review-state.jsonl');
    const registryPath = join(artifactDir, 'deep-review-findings-registry.json');
    const rows = iterationFindings.map((findingDetails, index) => JSON.stringify({
      type: 'iteration',
      iteration: index + 1,
      run: index + 1,
      mode: 'review',
      status: 'complete',
      findingsCount: findingDetails.length,
      findingDetails,
    }));
    fs.writeFileSync(stateLog, `${rows.join('\n')}\n`);
    fs.writeFileSync(registryPath, JSON.stringify({ openFindings, resolvedFindings: [], repeatedFindings: [] }));
    fs.writeFileSync(join(artifactDir, 'review-report.md'), '# Review\n');
    fs.writeFileSync(join(artifactDir, 'deep-review-dashboard.md'), '# Dashboard\n');

    const result = spawnSync(process.execPath, [
      closeoutScript,
      '--mode', 'review',
      '--event-dir', eventDir,
      '--artifact-dir', artifactDir,
      '--state-log', stateLog,
      '--registry', registryPath,
      '--output', join(artifactDir, 'review-report.md'),
      '--dashboard', join(artifactDir, 'deep-review-dashboard.md'),
      '--stop-reason', 'maxIterationsReached',
      '--active-p0', '0',
      '--active-p1', String(openFindings.length),
      '--active-p2', '0',
      '--dimension-coverage', '1',
      '--verdict', 'CONDITIONAL',
      '--release-readiness-state', 'ready',
    ], { encoding: 'utf8' });

    const eventFile = fs.readdirSync(eventDir)[0];
    if (!eventFile) throw new Error(`closeout staged no event: ${result.stderr}`);
    const staged = JSON.parse(fs.readFileSync(join(eventDir, eventFile), 'utf8')) as { data: Record<string, unknown> };
    return {
      status: result.status,
      stderr: result.stderr,
      eventName: path.basename(eventFile, '.json'),
      data: staged.data,
    };
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

const original = { id: 'R1-P1-001', title: 'Token is logged in plain text', severity: 'P1' };

describe('synthesis-closeout refinement counting', () => {
  it('completes when a refinement was folded into the finding it names', () => {
    const refinement = {
      id: 'R2-P1-001',
      title: 'Token is logged in plain text by the retry path',
      severity: 'P1',
      refines: 'R1-P1-001',
    };
    const folded = { findingId: 'R1-P1-001', title: refinement.title, severity: 'P1', status: 'active' };

    const outcome = runReviewCloseout([[original], [refinement]], [folded]);

    expect(outcome.status, outcome.stderr).toBe(0);
    expect(outcome.eventName, JSON.stringify(outcome.data)).toBe('synthesis_complete');
  });

  it('completes for an id-only refinement that names its target by the alias spelling', () => {
    const refinement = { id: 'R2-P1-001', severity: 'P1', refinementOf: 'R1-P1-001' };
    const folded = { findingId: 'R1-P1-001', title: original.title, severity: 'P1', status: 'active' };

    const outcome = runReviewCloseout([[original], [refinement]], [folded]);

    expect(outcome.eventName, JSON.stringify(outcome.data)).toBe('synthesis_complete');
  });

  it('still reports a lost finding when the refinement target never reached the registry', () => {
    const refinement = { id: 'R2-P1-001', severity: 'P1', refines: 'R1-P1-001' };
    const unrelated = { findingId: 'R1-P1-009', title: 'Unrelated finding', severity: 'P1', status: 'active' };

    const outcome = runReviewCloseout([[original], [refinement]], [unrelated]);

    expect(outcome.eventName).toBe('synthesis_incomplete');
    expect(outcome.data.invariantFailures).toEqual(expect.arrayContaining([
      'structured_state_findings_partially_reflected_in_registry',
      'structured_state_findings_missing_from_registry',
    ]));
    expect(outcome.data.missingStructuredFindingCount).toBe(2);
  });
});
