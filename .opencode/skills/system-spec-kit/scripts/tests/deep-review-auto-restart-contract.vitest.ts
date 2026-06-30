import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');

function readWorkspaceFile(relativePath: string): string {
  return fs.readFileSync(path.join(WORKSPACE_ROOT, relativePath), 'utf8');
}

describe('deep-review auto restart command contract', () => {
  it('exposes restart as a first-class auto setup input', () => {
    const command = readWorkspaceFile('.opencode/commands/deep/review.md');
    const presentation = readWorkspaceFile('.opencode/commands/deep/assets/deep_review_presentation.txt');
    const autoWorkflow = readWorkspaceFile('.opencode/commands/deep/assets/deep_review_auto.yaml');
    const fanoutRun = readWorkspaceFile('.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs');

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
    expect(autoWorkflow).toContain('config.stopPolicy: {stop_policy}');
    expect(autoWorkflow).toContain('config.fanout_lineage_artifact_dir: "[optional internal path]');
    expect(autoWorkflow).toContain('treat convergence signals as telemetry');
    expect(autoWorkflow).toContain('the explicit restart flag is operator');
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
    expect(fanoutRun).toContain('deep/review command surface');
    expect(fanoutRun).toContain("if (kind === 'native')");
    expect(fanoutRun).toContain('const cliLineages = allLineages');
    expect(fanoutRun).toContain('config.convergenceThreshold');
    expect(fanoutRun).toContain('config.stopPolicy');
    expect(fanoutRun).toContain('treat convergence before that as telemetry only');
    expect(fanoutRun).toContain('findMaxIterationsPolicyViolation');
    expect(fanoutRun).toContain('expected stopReason=maxIterationsReached');
  });

  it('applies restart before fan-out can spawn lineages', () => {
    const autoWorkflow = readWorkspaceFile('.opencode/commands/deep/assets/deep_review_auto.yaml');
    const restartStepIndex = autoWorkflow.indexOf('step_apply_lifecycle_request:');
    const fanoutStepIndex = autoWorkflow.indexOf('step_fanout_spawn:');

    expect(restartStepIndex).toBeGreaterThan(-1);
    expect(fanoutStepIndex).toBeGreaterThan(-1);
    expect(restartStepIndex).toBeLessThan(fanoutStepIndex);
    expect(autoWorkflow).toContain('skip_when: "lineage_mode != \'restart\'"');
    expect(autoWorkflow).toContain('do not continue as resume or auto');
  });
});
