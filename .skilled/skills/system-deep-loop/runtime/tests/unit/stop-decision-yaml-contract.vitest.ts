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
    expect(yaml).toMatch(/\n  depth_mode: "\[default\|expansive\]/);
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

  it('names the depth keys config creation writes in the Tier-1 shape and the defaults line', () => {
    const tier1 = presentation.split('\n').find((line) => line.includes('**Tier 1')) ?? '';
    expect(tier1).toContain('`antiConvergence.depthMode`');
    expect(tier1).toContain('`expansiveDepth.*`');
    const defaults = presentation.split('\n').find((line) => line.includes('+-- Defaults:')) ?? '';
    expect(defaults).toContain('antiConvergence.depthMode=`default`');
  });
});

// The review loop binds the same opt-in depth mode on every surface the
// convergence mode reaches, so an expansive run can never hand convergence.cjs
// an empty --depth-mode argument and silently fall back to the default depth.
describe('deep-review binds depth_mode beside convergence_mode', () => {
  const yaml = readFileSync(resolve(ASSETS, 'deep-review.yaml'), 'utf8');
  const presentation = readFileSync(resolve(ASSETS, 'deep-review-presentation.txt'), 'utf8');

  it('declares depth_mode in user_inputs and requires it in the preflight contract', () => {
    expect(yaml).toMatch(/\n  depth_mode: "\[default\|expansive\]/);
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

  it('names the depth keys config creation writes in the Tier-1 shape and the defaults line', () => {
    const tier1 = presentation.split('\n').find((line) => line.includes('**Tier 1')) ?? '';
    expect(tier1).toContain('`antiConvergence.depthMode`');
    expect(tier1).toContain('`expansiveDepth.*`');
    const defaults = presentation.split('\n').find((line) => line.includes('+-- Defaults:')) ?? '';
    expect(defaults).toContain('antiConvergence.depthMode=`default`');
  });

  it('samples the review default iteration cap and the frontier_scope marker fan-out writes', () => {
    const marker = presentation.slice(presentation.indexOf('PRE-BOUND SETUP ANSWERS:\n'));
    const block = marker.slice(0, marker.indexOf('```'));
    expect(block).toMatch(/\n  maxIterations: 7\n/);
    expect(block).toContain('frontier_scope:');
    expect(presentation).toContain('| `frontier_scope`');
  });

  it('passes the depth mode to the review fan-out runner', () => {
    // The fan-out command is a YAML block scalar, so the flag is only visible
    // once the document is parsed and the scalar is read back as text.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = parseYaml(yaml) as any;
    const command = doc.workflow.step_fanout_spawn.sub_steps.step_fanout_spawn_cli.command as string;
    expect(command).toContain('--depth-mode {depth_mode}');
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

  // The focus and the iteration record carry text a leaf wrote, so neither may
  // reach a shell argument: the block reads the focus from a file, and the stuck
  // close takes its node id from the reducer-owned registry, never from the focus.
  it('keeps leaf-written focus text out of every shell argument', () => {
    const block = wf.phase_loop.steps.step_dispatch_iteration.pre_dispatch.render_prompt_pack.bind_before_render.frontier_block as string;
    expect(block).toContain('--focus-file "{artifact_dir}/frontier-focus.txt"');
    expect(block).not.toContain('--focus "{next_focus}"');
    expect(block).toContain('never through a shell');

    const stuck = wf.phase_loop.steps.step_handle_convergence.if_stuck_recovery;
    const extract = JSON.stringify(stuck.if_expansive_open_node.extract);
    expect(extract).toContain('registry.frontier.nodes');
    expect(extract).toMatch(/never the text/);

    expect(yamlText).not.toMatch(/--focus \\?"\{next_focus\}/);
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

// The review loop grows the same opt-in frontier, so its steps keep the same
// places: the seed must land before any lineage split, activation must precede
// the dispatch, and admission must follow the proposed rows and precede the
// reducer that rewrites the registry. Key order is the contract.
describe('deep-review wires the expansive frontier steps', () => {
  const yamlText = readFileSync(resolve(ASSETS, 'deep-review.yaml'), 'utf8');
  // The workflow shape is checked key by key below, so the parsed tree stays loosely typed.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = parseYaml(yamlText) as any;
  const wf = doc.workflow;
  const order = (map: Record<string, unknown>): string[] => Object.keys(map);
  const extracts = (): Record<string, string> => {
    const merged: Record<string, string> = {};
    for (const entry of wf.phase_loop.steps.step_read_state.extract as Array<Record<string, string>>) {
      Object.assign(merged, entry);
    }
    return merged;
  };

  it('seeds the review frontier before fan-out spawns', () => {
    const steps = order(wf);
    const seed = steps.indexOf('step_frontier_seed');
    expect(seed).toBeGreaterThanOrEqual(0);
    expect(steps[seed + 1]).toBe('step_fanout_spawn');
    expect(wf.step_frontier_seed.enabled_when).toBe("depth_mode == 'expansive'");
    expect(wf.step_frontier_seed.command).toContain('frontier-admit.cjs seed --target review');
  });

  it('seeds the single-executor review frontier right after the config exists', () => {
    const steps = order(wf.phase_init.steps);
    const seed = steps.indexOf('step_frontier_seed');
    expect(seed).toBeGreaterThanOrEqual(0);
    expect(steps[seed - 1]).toBe('step_frontier_scope');
    expect(steps[seed - 2]).toBe('step_create_config');
    expect(wf.phase_init.steps.step_frontier_seed.skip_when).toContain('fanout_lineage_artifact_dir');
  });

  // Relevance and the terminal scope gate read reviewScopeFiles, so a commit-range
  // target's touched files are written by a command before the seed admits
  // anything, in every lineage, and never on a default run.
  it('records the touched files of a commit range before the seed, in every lineage', () => {
    const step = wf.phase_init.steps.step_frontier_scope;
    expect(step.command).toContain('frontier-admit.cjs scope --target review');
    expect(step.enabled_when).toBe("depth_mode == 'expansive'");
    expect(step.skip_when).toBeUndefined();
  });

  it('defines the review seed decomposition once, at the root seed step', () => {
    expect(wf.step_frontier_seed.instructions).toContain('Decompose {review_target} into 3 to 8 depth-1 sub-targets');
    expect(wf.phase_init.steps.step_frontier_seed.instructions).not.toContain('3 to 8');
    expect(wf.phase_init.steps.step_frontier_seed.instructions).toContain('exactly as the root step_frontier_seed describes');
    expect(wf.phase_init.steps.step_frontier_seed.command).toBe(wf.step_frontier_seed.command);
  });

  it('activates the active frontier node right before the dispatch', () => {
    const steps = order(wf.phase_loop.steps);
    const activate = steps.indexOf('step_frontier_activate');
    expect(activate).toBeGreaterThanOrEqual(0);
    expect(steps[activate + 1]).toBe('step_dispatch_iteration');
    expect(wf.phase_loop.steps.step_frontier_activate.enabled_when).toContain('active_frontier_node');
  });

  it('admits proposals after the iteration lands and before the reducer runs', () => {
    const steps = order(wf.phase_loop.steps);
    const admit = steps.indexOf('step_frontier_admit');
    expect(admit).toBeGreaterThanOrEqual(0);
    expect(steps[admit + 1]).toBe('step_reduce_review_state');
    expect(admit).toBeGreaterThan(steps.indexOf('step_dispatch_iteration'));
    const step = wf.phase_loop.steps.step_frontier_admit;
    expect(step.command).toContain('frontier-admit.cjs admit');
    expect(step.command).toContain('--target review');
    expect(JSON.stringify(step)).not.toContain('inbox');
  });

  it('closes the stuck review frontier node and keeps the stuckRecovery state', () => {
    const stuck = wf.phase_loop.steps.step_handle_convergence.if_stuck_recovery;
    expect(stuck).toBeDefined();
    expect(stuck.set.pending_stop_event).toBe('stuck_recovery');
    expect(stuck.if_expansive_open_node.command).toContain('frontier-admit.cjs close --target review');
    expect(stuck.if_expansive_open_node.command).toContain('--status exhausted');
  });

  // The loop bound active_frontier_node before the stuck close. Without a rebind
  // the activate step and the dispatch would still name the node just closed.
  it('rebinds the active frontier node after the stuck close', () => {
    const branch = wf.phase_loop.steps.step_handle_convergence.if_stuck_recovery.if_expansive_open_node;
    expect(branch.set?.active_frontier_node).toContain('registry.frontier.activeNodeId');
    expect(branch.set?.next_dimension).toContain('registry.frontier.activeNextDimension');
  });

  it('takes the next dimension from the active frontier node under expansive depth', () => {
    const extract = extracts();
    expect(extract.active_frontier_node).toContain('registry.frontier.activeNodeId');
    expect(extract.next_dimension).toContain('registry.frontier.activeNextDimension');
    expect(extract.next_dimension).toContain(
      'Otherwise the next uncovered dimension from dimension_queue in strategy.md.',
    );
  });

  // The registry lists unfinished core protocols whatever the run reviews, so a run
  // configured without traceability would lose its last iteration to a dimension it
  // never asked for. A default run reviews traceability and keeps the steer.
  it('steers the last iteration to traceability only when the run reviews traceability', () => {
    const extract = extracts();
    expect(extract.traceability_in_run).toContain('reviewDimensions');
    expect(extract.traceability_in_run).toContain('absent');
    expect(extract.next_dimension).toMatch(
      /^When max_iterations >= 2, current_iteration == max_iterations, unfinished_core_protocols is non-empty and traceability_in_run is true, 'traceability'/,
    );
    expect(extract.unfinished_core_protocols_block).toContain("Under the same condition as next_dimension's traceability case");
    const recovery = yamlText.split('\n').find((line) => line.includes('recovery_strategy = one line')) ?? '';
    expect(recovery).toContain('I.unfinishedCoreProtocols is non-empty and traceability_in_run is true');
  });

  it('gates the divergent pivot on a terminal review frontier', () => {
    const contract =
      wf.phase_loop.steps.step_handle_convergence.if_stop.if_divergent_eligible.eligibility_contract;
    expect(contract.frontier_gate).toContain('no open or active node');
  });
});

// The prose order in step_check_convergence is what an operator reads to learn
// why a run kept going, so it must name every branch convergence.cjs takes, in
// the order the script takes them.
describe.each(FILES)('%s stop-order prose follows the script', (file) => {
  const text = readFileSync(resolve(ASSETS, file), 'utf8');
  const step = stepText(text, 'step_check_convergence');

  it('names the frontierOpen veto after the floor and before the guards or gates', () => {
    const floor = step.indexOf('minIterationsNotReached');
    const veto = step.indexOf('frontierOpen');
    const after = file === 'deep-review.yaml'
      ? step.indexOf('legal-stop gates run on a candidate')
      : step.indexOf('qualityGuardFailed');
    expect(floor).toBeGreaterThan(-1);
    expect(veto).toBeGreaterThan(floor);
    expect(after).toBeGreaterThan(veto);
  });
});

describe('deep-review gate rows cover every legal-stop gate', () => {
  it('lists all nine gates convergence.cjs evaluates in gate_results_array_json', () => {
    const text = readFileSync(resolve(ASSETS, 'deep-review.yaml'), 'utf8');
    const line = text.split('\n').find((entry) => entry.includes('- gate_results_array_json:')) ?? '';
    for (const gate of [
      'convergenceGate', 'dimensionCoverageGate', 'p0ResolutionGate', 'evidenceDensityGate',
      'hotspotSaturationGate', 'claimAdjudicationGate', 'fixCompletenessReplayGate',
      'candidateCoverageGate', 'graphlessFallbackGate',
    ]) {
      expect(line).toContain(gate);
    }
  });
});

describe('deep-research snapshot path pattern', () => {
  it('keys the synthesis snapshot by generation and continuedFromRun, as the snapshot step writes it', () => {
    const text = readFileSync(resolve(ASSETS, 'deep-research.yaml'), 'utf8');
    expect(text).toContain('synthesis_snapshot_pattern: "{artifact_dir}/synthesis-v{generation}-r{continuedFromRun}.md"');
    expect(text).toContain('synthesis-v${GENERATION}-r{continued_from_run}.md');
  });
});

// A fan-out lineage may write only inside its own directory. Every step that
// opens the coverage graph store has to tell the leaf that the store lives in
// the lineage, or a compliant leaf skips the step and the lineage runs graphless.
describe('graph-writing steps name the lineage-local graph store', () => {
  const GRAPH_STEPS: Array<[string, string]> = [
    ['deep-review.yaml', 'step_seed_coverage_graph'],
    ['deep-review.yaml', 'step_graph_upsert'],
    ['deep-review.yaml', 'step_graph_convergence'],
    ['deep-research.yaml', 'step_graph_convergence'],
    ['deep-research.yaml', 'step_graph_upsert'],
    ['deep-research.yaml', 'step_frontier_graph_upsert'],
  ];

  it.each(GRAPH_STEPS)('%s %s', (file, stepName) => {
    const step = stepText(readFileSync(resolve(ASSETS, file), 'utf8'), stepName);
    expect(step.length).toBeGreaterThan(0);
    expect(step).toContain('DEEP_LOOP_COVERAGE_DB_DIR="{artifact_dir}/graph-db"');
    expect(step).toContain('config.fanout_lineage_artifact_dir');
  });
});

describe('deep-review stop-order prose names the drained-frontier candidate', () => {
  const text = readFileSync(resolve(ASSETS, 'deep-review.yaml'), 'utf8');
  const step = stepText(text, 'step_check_convergence');

  it('lists frontier_drained with the candidates, before the floor and the gates', () => {
    const composite = step.indexOf('composite_converged');
    const drained = step.indexOf('frontier_drained');
    const floor = step.indexOf('minIterationsNotReached');
    expect(composite).toBeGreaterThan(-1);
    expect(drained).toBeGreaterThan(composite);
    expect(floor).toBeGreaterThan(drained);
    expect(step.indexOf('legal-stop gates run on a candidate')).toBeGreaterThan(drained);
  });

  it('leaves the research stop order without it', () => {
    const research = stepText(readFileSync(resolve(ASSETS, 'deep-research.yaml'), 'utf8'), 'step_check_convergence');
    expect(research).not.toContain('frontier_drained');
  });
});

describe('deep-review graph upsert derives finding evidence from the iteration record', () => {
  it('passes the state log and the iteration to upsert.cjs', () => {
    const step = stepText(readFileSync(resolve(ASSETS, 'deep-review.yaml'), 'utf8'), 'step_graph_upsert');
    const bash = step.split('\n').find((line) => line.trim().startsWith('bash:')) ?? '';
    expect(bash).toContain('--state-log \\"{state_paths.state_log}\\"');
    expect(bash).toContain('--iteration \\"{current_iteration}\\"');
    expect(bash).toContain('--delta-dir \\"{state_paths.delta_dir}\\"');
    expect(step).toContain('EVIDENCE_FOR');
  });
});

// A defaulted expansive budget is resized once the seed is known. The step must
// run only for a defaulted budget, rebind max_iterations for the loop, and never
// put the setup-only source binding into the config.
describe.each(FILES)('%s sizes a defaulted expansive budget after the seed', (file) => {
  const text = readFileSync(resolve(ASSETS, file), 'utf8');
  const initSeed = text.indexOf('      step_frontier_seed:\n');
  const budget = stepText(text, 'step_frontier_budget');

  it('places step_frontier_budget right after the phase_init seed step', () => {
    expect(initSeed).toBeGreaterThan(-1);
    expect(budget.length).toBeGreaterThan(0);
    // Without this the slice below is empty when budget sits above seed, and passes.
    expect(text.indexOf('      step_frontier_budget:\n')).toBeGreaterThan(initSeed);
    const between = text.slice(initSeed, text.indexOf('      step_frontier_budget:\n'));
    expect(between.match(/\n      step_[a-z_]+:\n/g) ?? []).toHaveLength(0);
  });

  it('runs only for a defaulted expansive budget and rebinds max_iterations', () => {
    expect(budget).toContain("depth_mode == 'expansive'");
    expect(budget).toContain("max_iterations_source == 'default'");
    expect(budget).toContain('extension_pending');
    expect(budget).toContain('frontier-admit.cjs budget');
    expect(budget).not.toContain('node -e');
    expect(budget).toMatch(/- max_iterations: /);
  });

  // The fan-out parent seeds at the top level and a single-executor run seeds in
  // phase_init; both copies run the same command, so their outputs agree.
  it('runs one seed command in both seed steps', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wf = (parseYaml(text) as any).workflow;
    expect(wf.step_frontier_seed.command).toBe(wf.phase_init.steps.step_frontier_seed.command);
  });

  it('passes the source to the seed and keeps it out of the config', () => {
    expect(stepText(text, 'step_frontier_seed')).toContain('--max-iterations-source "{max_iterations_source}"');
    expect(text).toMatch(/\n  max_iterations_source: /);
    expect(stepText(text, 'step_create_config')).not.toContain('max_iterations_source');
  });
});

// The two expansive frontier caps reach the config only through setup bindings,
// so every surface an operator flag passes through must carry both of them. An
// absent flag must leave the literal default in place, or a default run's config
// would change.
describe.each([
  ['research', 'deep-research'],
  ['review', 'deep-review'],
])('deep-%s binds the frontier cap flags', (command, asset) => {
  const yaml = readFileSync(resolve(ASSETS, `${asset}.yaml`), 'utf8');
  const presentation = readFileSync(resolve(ASSETS, `${asset}-presentation.txt`), 'utf8');
  const commandDoc = readFileSync(resolve(ASSETS, '..', `${command}.md`), 'utf8');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = parseYaml(yaml) as any;

  it('declares both caps in user_inputs', () => {
    expect(doc.user_inputs.frontier_max_depth).toContain('--frontier-max-depth=N');
    expect(doc.user_inputs.frontier_max_nodes).toContain('--frontier-max-nodes=N');
  });

  it('rejects a cap outside expansive depth or below 1 in the preflight', () => {
    const verify = (doc.workflow.phase_init.steps.step_preflight_contract.verify as Array<Record<string, string>>)
      .find((entry) => 'frontier_cap_values' in entry)?.frontier_cap_values ?? '';
    expect(verify).toContain('positive integer');
    expect(verify).toContain("depth_mode != 'expansive'");
    expect(verify).toContain('Usage error (frontier-cap-without-expansive)');
  });

  // A fan-out run never reaches phase_init, so the preflight cannot see the caps there.
  it('refuses the caps on a fan-out config before any lineage spawns', () => {
    const keys = Object.keys(doc.workflow);
    const guard = doc.workflow.step_reject_frontier_caps_with_fanout;
    expect(guard?.halt).toBe(true);
    expect(guard.skip_when).toContain('config.fanout is absent');
    expect(guard.message).toContain('Usage error (frontier-caps-with-fanout)');
    expect(keys.indexOf('step_reject_frontier_caps_with_fanout')).toBeLessThan(keys.indexOf('step_fanout_spawn'));
  });

  it('writes a bound cap and keeps the default literals when the flags are absent', () => {
    const populate = doc.workflow.phase_init.steps.step_create_config.populate;
    expect(populate['expansiveDepth.maxDepth']).toBe('{frontier_max_depth} when bound, else 3');
    expect(populate['expansiveDepth.maxFrontierNodes']).toBe('{frontier_max_nodes} when bound, else null');
  });

  it('binds both flags in the presentation and the command flag table', () => {
    expect(presentation).toContain('|-- --frontier-max-depth=N -> frontier_max_depth = N');
    expect(presentation).toContain('|-- --frontier-max-nodes=N -> frontier_max_nodes = N');
    expect(presentation).toContain('| `frontier_max_depth` |');
    expect(presentation).toContain('| `frontier_max_nodes` |');
    const marker = presentation.slice(presentation.indexOf('PRE-BOUND SETUP ANSWERS:\n'));
    const block = marker.slice(0, marker.indexOf('```'));
    expect(block).toContain('frontier_max_depth: ""');
    expect(block).toContain('frontier_max_nodes: ""');
    expect(commandDoc).toContain('| `--frontier-max-depth` |');
    expect(commandDoc).toContain('| `--frontier-max-nodes` |');
  });
});
