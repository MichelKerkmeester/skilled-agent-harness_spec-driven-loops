// ───────────────────────────────────────────────────────────────────
// MODULE: Stop Decision YAML Contract
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

// The stop decision is computed by a script from the state files. A workflow
// step that still carries vote arithmetic would let two runs over the same
// state stop at different points, so the step may only branch on the script's
// stop_decision object.
const ASSETS = resolve(__dirname, '..', '..', '..', '..', '..', 'commands', 'deep', 'assets');

// js-yaml is a dependency of the shared package the runtime declares, so the
// require is anchored there rather than at a package this runtime never names.
const sharedRequire = createRequire(resolve(__dirname, '..', '..', '..', '..', 'system-spec-kit', 'shared', 'package.json'));
const { load: parseYaml } = sharedRequire('js-yaml') as { load: (source: string) => unknown };
const FILES = [
  'deep-research.yaml',
  'deep-review.yaml',
];
const FORBIDDEN_IN_STEP = [
  'MAD(',
  'mean(last',
  'w=0.',
  '0.08',
  '0.05',
  'checkQualityGuards',
  'graph_decision is absent',
  'Skip hard stops',
];

function stepText(text: string, step: string): string {
  const start = text.indexOf(`      ${step}:\n`);
  if (start === -1) return '';
  const rest = text.slice(start + 1);
  const end = rest.search(/\n      step_[a-z_]+:\n/);
  return end === -1 ? rest : rest.slice(0, end);
}

describe.each(FILES)('%s', (file) => {
  const text = readFileSync(resolve(ASSETS, file), 'utf8');

  it('step_check_convergence holds no vote arithmetic', () => {
    const step = stepText(text, 'step_check_convergence');
    expect(step.length).toBeGreaterThan(0);
    const found = FORBIDDEN_IN_STEP.filter((fragment) => step.includes(fragment));
    expect(found).toEqual([]);
  });

  it('step_check_convergence branches on stop_decision', () => {
    const step = stepText(text, 'step_check_convergence');
    expect(step).toContain('stop_decision.decision');
    expect(step).toContain('stop_decision.stopReason');
  });

  it('runs convergence.cjs once with --stop-decision', () => {
    const occurrences = text.split('runtime/scripts/convergence.cjs').length - 1;
    expect(occurrences).toBe(1);
    const invocation = text
      .split('\n')
      .find((line) => line.includes('runtime/scripts/convergence.cjs')) ?? '';
    expect(invocation).toContain('--stop-decision');
  });

  it('the divergent pivot reads stop_decision.reasonDetail', () => {
    const pivot = text
      .split('\n')
      .filter((line) => line.includes('branch_on') && line.includes('stop_decision.reasonDetail'));
    expect(pivot.length).toBeGreaterThan(0);
  });

  it('hands the divergent pivot the fine cause, not the coarse stop reason', () => {
    const lines = text
      .split('\n')
      .filter((line) => line.includes('--trigger-reason "{reason_detail}"'));
    expect(lines.length).toBe(1);
  });

  if (file.startsWith('deep-review')) {
    it('holds no hardcoded 0.05 threshold', () => {
      expect(text).not.toMatch(/0\.05\b/);
    });
  }
});

// The opt-in depth mode must be bound everywhere the convergence mode is, so an
// unbound value can never reach convergence.cjs as an empty argument.
describe('deep-research binds depth_mode beside convergence_mode', () => {
  const yaml = readFileSync(resolve(ASSETS, 'deep-research.yaml'), 'utf8');
  const presentation = readFileSync(resolve(ASSETS, 'deep-research-presentation.txt'), 'utf8');

  it('declares depth_mode in user_inputs and requires it in the preflight contract', () => {
    expect(yaml).toMatch(/\n  depth_mode: "\[default|expansive\]/);
    expect(yaml).toContain('convergence_mode, depth_mode, stop_policy]');
  });

  it('writes the depth mode at config creation and extracts it in step_read_state', () => {
    expect(yaml).toContain('antiConvergence.depthMode: "{depth_mode}"');
    expect(yaml).toMatch(/- depth_mode: "Extract antiConvergence\.depthMode/);
  });

  it('passes --depth-mode to the convergence.cjs stop decision', () => {
    const invocation = yaml.split('\n').find((line) => line.includes('runtime/scripts/convergence.cjs') && line.includes('--stop-decision'));
    expect(invocation).toContain('--convergence-mode "{convergence_mode}" --depth-mode "{depth_mode}"');
  });

  it('binds depth_mode in the presentation default, input table, resolution and bound values', () => {
    expect(presentation).toContain('depth_mode: default  # default | expansive');
    expect(presentation).toContain('| `depth_mode`');
    expect(presentation).toContain('|-- --depth-mode=default|expansive -> antiConvergence.depthMode = value');
    expect(presentation).toContain('- depth_mode = [from flag, marker, or default `default`');
  });
});

// Frontier growth only holds together while its steps keep their place: the seed
// must land before any lineage split, admission before the reducer rewrites the
// registry, and the graph mirror after the leaf upsert. Key order is the contract.
describe('deep-research wires the expansive frontier steps', () => {
  const yamlText = readFileSync(resolve(ASSETS, 'deep-research.yaml'), 'utf8');
  // The workflow shape is checked key by key below, so the parsed tree stays loosely typed.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = parseYaml(yamlText) as any;
  const wf = doc.workflow;
  const order = (map: Record<string, unknown>): string[] => Object.keys(map);

  it('seeds the frontier before fan-out spawns', () => {
    const steps = order(wf);
    const seed = steps.indexOf('step_frontier_seed');
    expect(seed).toBeGreaterThanOrEqual(0);
    expect(steps[seed + 1]).toBe('step_fanout_spawn');
    expect(wf.step_frontier_seed.enabled_when).toBe("depth_mode == 'expansive'");
    expect(wf.step_frontier_seed.command).toContain('frontier-admit.cjs seed');
  });

  it('seeds the single-executor frontier right after the config exists', () => {
    const steps = order(wf.phase_init.steps);
    const seed = steps.indexOf('step_frontier_seed');
    expect(seed).toBeGreaterThanOrEqual(0);
    expect(steps[seed - 1]).toBe('step_create_config');
    expect(wf.phase_init.steps.step_frontier_seed.skip_when).toContain('fanout_lineage_artifact_dir');
  });

  it('admits proposals after the iteration lands and before the reducer runs', () => {
    const steps = order(wf.phase_loop.steps);
    const admit = steps.indexOf('step_frontier_admit');
    expect(admit).toBeGreaterThanOrEqual(0);
    expect(steps[admit + 1]).toBe('step_reduce_state');
    expect(admit).toBeGreaterThan(steps.indexOf('step_dispatch_iteration'));
    expect(wf.phase_loop.steps.step_frontier_admit.command).toContain('frontier-admit.cjs admit');
  });

  it('mirrors the frontier into the graph after the leaf graph upsert', () => {
    const steps = order(wf.phase_loop.steps);
    const mirror = steps.indexOf('step_frontier_graph_upsert');
    expect(mirror).toBeGreaterThanOrEqual(0);
    expect(steps[mirror - 1]).toBe('step_graph_upsert');
    const command = wf.phase_loop.steps.step_frontier_graph_upsert.command;
    expect(command).toContain('frontier-admit.cjs graph');
    expect(command).toContain('upsert.cjs');
  });

  it('closes the stuck frontier node and keeps the stuckRecovery append', () => {
    const stuck =
      wf.phase_loop.steps.step_check_convergence?.if_stuck_recovery ??
      wf.phase_loop.steps.step_handle_convergence?.if_stuck_recovery;
    expect(stuck).toBeDefined();
    expect(stuck.append_jsonl).toContain('"event":"stuckRecovery"');
    expect(stuck.if_expansive_open_node.command).toContain('frontier-admit.cjs close');
    expect(stuck.if_expansive_open_node.command).toContain('--status exhausted');
  });

  it('gates the divergent pivot on a terminal frontier', () => {
    expect(yamlText).toContain('frontier_gate:');
    const contract =
      wf.phase_loop.steps.step_handle_convergence.if_stop.if_divergent_eligible.eligibility_contract;
    expect(contract.frontier_gate).toContain('no open or active node');
  });

  it('passes the depth mode to the fan-out runner', () => {
    const command = wf.step_fanout_spawn.sub_steps.step_fanout_spawn_cli.command as string;
    expect(command).toContain('--depth-mode {depth_mode}');
    expect(command).toContain('--convergence-mode {convergence_mode} \\\n');
  });
});
