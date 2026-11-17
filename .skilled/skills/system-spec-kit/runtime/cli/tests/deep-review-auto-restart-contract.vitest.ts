// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Auto Restart Contract
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../');

function readWorkspaceFile(relativePath: string): string {
  return fs.readFileSync(path.join(WORKSPACE_ROOT, relativePath), 'utf8');
}

describe('deep-review auto restart command contract', () => {
  it('exposes restart as a first-class auto setup input', () => {
    const command = readWorkspaceFile('.skilled/commands/deep/review.md');
    const presentation = readWorkspaceFile('.skilled/commands/deep/assets/deep-review-presentation.txt');
    const autoWorkflow = readWorkspaceFile('.skilled/commands/deep/assets/deep-review.yaml');
    const fanoutRun = readWorkspaceFile('.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs');

    expect(command).toContain('--restart|--lineage-mode=restart');
    expect(command).toContain('--stop-policy=convergence|max-iterations');
    expect(command).toContain('--fanout-lineage-artifact-dir');
    expect(command).toContain('lineage_mode');
    expect(command).toContain('stop_policy');
    expect(command).toContain('Do not use the Task tool to spawn the general agent');
    expect(command).toContain('Do not ask for a second confirmation');
    expect(command).not.toContain('@general');
    expect(command).not.toContain('@deep-review');
    expect(presentation).toContain('lineage_mode: auto');
    expect(presentation).toContain('| `lineage_mode` | Y |');
    expect(presentation).toContain('| `stop_policy` | Y |');
    expect(presentation).toContain('| `config.fanout_lineage_artifact_dir` | N |');
    expect(presentation).toContain('|-- --restart -> lineage_mode = restart');
    expect(presentation).toContain('|-- --stop-policy=convergence|max-iterations -> stop_policy = value');
    expect(presentation).toContain('|-- --fanout-lineage-artifact-dir=PATH -> config.fanout_lineage_artifact_dir = PATH');
    expect(presentation).toContain('A restart request must never silently downgrade to resume');
    expect(presentation).toContain('an explicit `--restart` or `--lineage-mode=restart` flag is operator authorization');
    expect(presentation).toContain('stop_policy=max-iterations');
    expect(presentation).toContain('explicit parallel-detached OpenCode session');
    expect(presentation).toContain('Native and CLI fan-out lineages run under `fanout-run.cjs`');
    expect(presentation).toContain('calls the `deep/review` command with the internal `--fanout-lineage-artifact-dir` override');
    expect(autoWorkflow).toContain('--convergence-threshold {convergence_threshold}');
    expect(autoWorkflow).toContain('--stop-policy {stop_policy}');
    expect(autoWorkflow).toContain('stopPolicy: "{stop_policy}"');
    expect(autoWorkflow).toContain('config.fanout_lineage_artifact_dir: "[optional internal path]');
    expect(autoWorkflow).toContain('the vote is telemetry only and the decision is CONTINUE');
    expect(autoWorkflow).toMatch(/The explicit\s+restart flag is operator authorization/);
    expect(autoWorkflow).toContain('A cli-opencode lineage inside this fan-out is an explicit parallel-detached OpenCode');
    expect(autoWorkflow).toContain('fanout-run.cjs owns native and CLI lineage execution');
    expect(autoWorkflow).toContain('deep/review command surface with config.fanout_lineage_artifact_dir');
    expect(autoWorkflow).toContain('pasted phase-running prompt');
    expect(autoWorkflow).not.toContain('step_fanout_spawn_native');
    expect(autoWorkflow).toContain('this single-executor branch must only run from a non-OpenCode dispatch surface');
    expect(fanoutRun).toContain('explicit parallel-detached OpenCode lineage');
    expect(fanoutRun).toContain('buildNativeCommandInput');
    expect(fanoutRun).toContain('--fanout-lineage-artifact-dir=');
    expect(fanoutRun).toContain("'--command'");
    expect(fanoutRun).toContain("explicit native fan-out adapter running through the command host's OpenCode CLI surface");
    expect(fanoutRun).toContain("lineage.kind === 'native'");
    expect(fanoutRun).toContain('const cliLineages = allLineages');
    expect(fanoutRun).toContain('config.convergenceThreshold');
    expect(fanoutRun).toContain('config.stopPolicy');
    expect(fanoutRun).toContain('treat convergence before that as telemetry only');
    expect(fanoutRun).toContain('findMaxIterationsPolicyViolation');
    expect(fanoutRun).toContain('expected stopReason=maxIterationsReached');
  });

  it('applies restart before fan-out can spawn lineages', () => {
    const autoWorkflow = readWorkspaceFile('.skilled/commands/deep/assets/deep-review.yaml');
    const restartStepIndex = autoWorkflow.indexOf('step_apply_lifecycle_request:');
    const fanoutStepIndex = autoWorkflow.indexOf('step_fanout_spawn:');

    expect(restartStepIndex).toBeGreaterThan(-1);
    expect(fanoutStepIndex).toBeGreaterThan(-1);
    expect(restartStepIndex).toBeLessThan(fanoutStepIndex);
    expect(autoWorkflow).toContain('skip_when: "lineage_mode != \'restart\'"');
    expect(autoWorkflow).toContain('do not continue as resume or auto');
  });

  // A completed review used to re-synthesize through on_completed_session and add
  // no iteration. The extension reopens the run before classification instead, so
  // classification lands on resume and the completed-session branch never sees it.
  it('extends a completed run before classification, and refuses fan-out before the spawn', () => {
    const autoWorkflow = readWorkspaceFile('.skilled/commands/deep/assets/deep-review.yaml');
    const lockIndex = autoWorkflow.indexOf('\n      step_acquire_lock:\n');
    const extendIndex = autoWorkflow.indexOf('\n      step_extend_completed_run:\n');
    const classifyIndex = autoWorkflow.indexOf('\n      step_classify_session:\n');
    expect(lockIndex).toBeGreaterThan(-1);
    expect(extendIndex).toBeGreaterThan(lockIndex);
    expect(classifyIndex).toBeGreaterThan(extendIndex);

    const completedAt = autoWorkflow.indexOf('        on_completed_session:\n');
    const completedBranch = autoWorkflow.slice(completedAt, autoWorkflow.indexOf('        on_invalid_state:\n', completedAt));
    expect(completedBranch).toContain('skip_to: phase_synthesis');
    expect(completedBranch).not.toContain('extend');

    const guardIndex = autoWorkflow.indexOf('\n  step_reject_extend_with_fanout:\n');
    expect(guardIndex).toBeGreaterThan(-1);
    expect(guardIndex).toBeLessThan(autoWorkflow.indexOf('\n  step_fanout_spawn:\n'));
  });
});
