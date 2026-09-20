#!/usr/bin/env node
// Deep-research single-iteration driver. Workflow-owned orchestration only.
// Reads state, renders prompt pack, dispatches via codex CLI, validates artifacts,
// runs reducer, refreshes dashboard, and updates tracking. The leaf agent owns
// research artifacts under iterations/iterations-NNN.md, deltas/iter-NNN.jsonl,
// and the JSONL append; this driver owns everything else.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve as pathResolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tsxLoader = pathResolve(__dirname, '../../../../skills/system-deep-loop/runtime/node_modules/tsx/dist/loader.mjs');
if (existsSync(tsxLoader)) {
  // tsx loader is registered at startup via `node --import` flag on the wrapper bash invocation.
}

const REPO = process.cwd();
const ARTIFACT_DIR = pathResolve(
  REPO,
  '.opencode/specs/cli-external-orchestration/029-cli-devin-revival/research'
);
const CONFIG_PATH = `${ARTIFACT_DIR}/deep-research-config.json`;
const STATE_LOG = `${ARTIFACT_DIR}/deep-research-state.jsonl`;
const STRATEGY = `${ARTIFACT_DIR}/deep-research-strategy.md`;
const REGISTRY = `${ARTIFACT_DIR}/findings-registry.json`;
const DASHBOARD = `${ARTIFACT_DIR}/deep-research-dashboard.md`;
const PROMPT_DIR = `${ARTIFACT_DIR}/prompts`;
const ITER_DIR = `${ARTIFACT_DIR}/iterations`;
const DELTA_DIR = `${ARTIFACT_DIR}/deltas`;
const PROMPT_TEMPLATE = pathResolve(
  REPO,
  '.opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl'
);
const RUN_AUDITED = pathResolve(
  REPO,
  '.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts'
);
const WRITE_CONTAINMENT = pathResolve(
  REPO,
  '.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts'
);
const PROMPT_PACK = pathResolve(
  REPO,
  '.opencode/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts'
);

function readJson(p) { return JSON.parse(readFileSync(p, 'utf8')); }
function readJsonl(p) {
  if (!existsSync(p)) return [];
  return readFileSync(p, 'utf8').split(/\r?\n/).map(s=>s.trim()).filter(Boolean).flatMap(l => {
    try { return [JSON.parse(l)]; } catch { return []; }
  });
}
function iso() { return new Date().toISOString(); }
function pad3(n) { return String(n).padStart(3, '0'); }

function extractStateSummary(config, strategy, stateLog) {
  const iterations = stateLog.filter(r => r.type === 'iteration');
  const iterationCount = iterations.length;
  const last = iterations.at(-1);
  const secondLast = iterations.at(-2);
  const answeredMatch = strategy.match(/##\s*6\.\s*ANSWERED QUESTIONS[\s\S]*?(?=^##\s|\Z)/m);
  const answeredCount = answeredMatch ? (answeredMatch[0].match(/^- \[x\]/gm) || []).length : 0;
  const totalMatch = strategy.match(/##\s*3\.\s*KEY QUESTIONS[\s\S]*?(?=^##\s|\Z)/m);
  const totalQuestions = totalMatch ? (totalMatch[0].match(/^- \[ \]/gm) || []).length : 0;
  const ratioPrev = secondLast ? (secondLast.newInfoRatio ?? 'N/A') : 'N/A';
  const ratioLatest = last ? (last.newInfoRatio ?? 'N/A') : 'N/A';
  const lastFocus = last ? (last.focus ?? 'none yet') : 'none yet';
  const nextFocusMatch = strategy.match(/##\s*11\.\s*NEXT FOCUS[\s\S]*?(?=^##\s|\Z)/m);
  const nextFocus = nextFocusMatch ? nextFocusMatch[0].replace(/^##[^\n]*\n/, '').trim() : 'not yet recorded';
  const remainingQMatch = strategy.match(/^- \[ \] Q\d+\.[^\n]+/gm) || [];
  const remainingList = remainingQMatch.slice(0, 8).join('\n') || '[none]';
  const carriedMatch = strategy.match(/##\s*11A\.[\s\S]*?(?=^##\s|\Z)/m);
  const carriedForward = carriedMatch ? carriedMatch[0].replace(/^##[^\n]*\n/, '').trim() : '[None yet]';
  const last3 = iterations.slice(-3).map((it) => `run ${it.iteration ?? '?'}: ${(it.focus || '').slice(0, 60)} (${it.newInfoRatio ?? '?'})`).join(' | ') || 'none yet';
  const resourceMapPresent = config.resource_map_present === true;
  const resourceMapLine = resourceMapPresent
    ? `Resource map: prior-inventoried files are listed in ${config.specFolder}/resource-map.md; treat them as the exclusion set when hunting for net-new files; flag only missed-from-map candidates as gaps.`
    : 'Resource map: resource-map.md not present; skipping coverage gate.';
  const sessionId = config.lineage?.sessionId ?? 'unknown';
  const generation = config.lineage?.generation ?? 1;
  return {
    iterationCount, answeredCount, totalQuestions,
    ratioPrev, ratioLatest, lastFocus, nextFocus,
    remainingList, carriedForward, last3,
    resourceMapLine, sessionId, generation,
  };
}

async function main() {
  const config = readJson(CONFIG_PATH);
  const strategy = readFileSync(STRATEGY, 'utf8');
  const stateLog = readJsonl(STATE_LOG);
  const sum = extractStateSummary(config, strategy, stateLog);
  const maxIter = config.maxIterations;
  const stopPolicy = config.antiConvergence?.stopPolicy ?? 'convergence';
  const currentIter = sum.iterationCount + 1;

  if (currentIter > maxIter) {
    console.log(`[iter-driver] iteration_count=${sum.iterationCount} >= maxIterations=${maxIter}; nothing to dispatch.`);
    return { dispatched: false, reason: 'max_iterations_reached' };
  }

  // step_check_convergence — for stopPolicy=max-iterations, convergence is telemetry only.
  let decision = 'CONTINUE';
  let reason = 'stopPolicy=max-iterations; forced-depth run';
  if (stopPolicy !== 'max-iterations') {
    if (sum.iterationCount >= maxIter) { decision = 'STOP'; reason = 'maxIterationsReached'; }
    else if (sum.answeredCount >= sum.totalQuestions && sum.totalQuestions > 0) {
      decision = 'STOP'; reason = 'all_questions_answered';
    }
  }

  console.log(`[iter-driver] dispatching iteration ${currentIter}/${maxIter} (decision=${decision}, reason=${reason})`);

  // step_dispatch_iteration.render_prompt_pack
  const vars = {
    state_summary: [
      `Segment: 1 | Iteration: ${currentIter} of ${maxIter}`,
      `Questions: ${sum.answeredCount}/${sum.totalQuestions} answered | Last focus: ${sum.lastFocus.slice(0, 80)}`,
      `Last 2 ratios: ${sum.ratioPrev} -> ${sum.ratioLatest}`,
      sum.resourceMapLine,
      `Memory context refresh: phase 001 implementation-summary.md is on disk in spec folder`,
      `Next focus: ${sum.nextFocus.slice(0, 240)}`,
    ].join('\n'),
    research_topic: config.topic,
    current_iteration: currentIter,
    max_iterations: maxIter,
    next_focus: sum.nextFocus,
    remaining_questions_list: sum.remainingList,
    carried_forward_open_questions: sum.carriedForward,
    last_3_summaries: sum.last3,
    pivot_lineage: 'none yet',
    saturated_directions: 'none yet',
    state_paths_config: CONFIG_PATH.replace(`${REPO}/`, ''),
    state_paths_state_log: STATE_LOG.replace(`${REPO}/`, ''),
    state_paths_strategy: STRATEGY.replace(`${REPO}/`, ''),
    state_paths_registry: REGISTRY.replace(`${REPO}/`, ''),
    state_paths_iteration_pattern: `${ITER_DIR.replace(`${REPO}/`, '')}/iteration-${pad3(currentIter)}.md`,
    state_paths_delta_pattern: `${DELTA_DIR.replace(`${REPO}/`, '')}/iter-${pad3(currentIter)}.jsonl`,
  };

  const { renderPromptPack } = await import(`file://${PROMPT_PACK}`);
  const rendered = renderPromptPack(PROMPT_TEMPLATE, vars);
  const promptPath = `${PROMPT_DIR}/iteration-${currentIter}.md`;
  writeFileSync(promptPath, rendered, 'utf8');
  console.log(`[iter-driver] rendered prompt pack to ${promptPath}`);

  // step_dispatch_iteration.if_cli_codex
  const { runAuditedExecutorCommand } = await import(`file://${RUN_AUDITED}`);
  const { snapshotOutOfScopeDirtyPaths, enforceWriteContainment } = await import(`file://${WRITE_CONTAINMENT}`);

  const model = config.executor?.model ?? null;
  const reasoningEffort = config.executor?.reasoningEffort ?? null;
  const serviceTier = config.executor?.serviceTier ?? null;
  const timeoutSeconds = config.executor?.timeoutSeconds ?? 1500;
  const sandboxMode = 'workspace-write';

  const args = ['exec'];
  if (model) args.push('--model', model);
  args.push('-c', `model_reasoning_effort=${reasoningEffort || 'medium'}`);
  if (serviceTier) args.push('-c', `service_tier=${serviceTier}`);
  args.push('-c', 'approval_policy=never', '--sandbox', sandboxMode, '-');

  const dispatchId = `research-i${currentIter}-g${sum.generation}`;
  const preDispatchDirtyPaths = snapshotOutOfScopeDirtyPaths({ repoRoot: REPO, artifactDir: ARTIFACT_DIR });
  const promptBody = readFileSync(promptPath, 'utf8');

  const exit = runAuditedExecutorCommand({
    command: 'codex',
    args,
    cwd: REPO,
    timeoutSeconds,
    stateLogPath: STATE_LOG,
    executor: {
      kind: 'cli-codex',
      model,
      configDir: null,
      reasoningEffort,
      serviceTier,
      sandboxMode,
      timeoutSeconds,
      governor: null,
    },
    iteration: currentIter,
    input: promptBody,
    receiptDir: `${ARTIFACT_DIR}/dispatch-receipts`,
    dispatchId,
  });

  const containment = enforceWriteContainment({
    repoRoot: REPO,
    artifactDir: ARTIFACT_DIR,
    preDispatchDirtyPaths,
    stateLogPath: STATE_LOG,
    iteration: currentIter,
    label: dispatchId,
  });
  if (containment.violations.length > 0) {
    console.error(`[iter-driver] write-containment violation: ${containment.violations.length} paths reverted: ${containment.violations.map(v => v.path).join(', ')}`);
    process.exit(1);
  }
  if (exit !== 0) {
    console.error(`[iter-driver] codex dispatch exit=${exit}`);
    process.exit(exit || 1);
  }

  // post_dispatch_validate
  const verifyProc = execFileSync(
    'node',
    [
      pathResolve(REPO, '.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs'),
      '--loop-type', 'research',
      '--artifact-dir', ARTIFACT_DIR,
      '--iteration', String(currentIter),
    ],
    { encoding: 'utf8' }
  );
  console.log(`[iter-driver] verify-iteration.cjs output: ${verifyProc.trim()}`);

  // step_reduce_state
  execFileSync(
    'node',
    [
      pathResolve(REPO, '.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs'),
      config.specFolder,
    ],
    { encoding: 'utf8', stdio: 'inherit' }
  );

  // Verify post-reduce that the new iteration record exists in state log
  const afterStateLog = readJsonl(STATE_LOG);
  const iterRecords = afterStateLog.filter(r => r.type === 'iteration');
  const lastIter = iterRecords.at(-1);
  if (!lastIter || (lastIter.iteration ?? -1) !== currentIter) {
    console.error(`[iter-driver] post-dispatch: iteration ${currentIter} record missing in state log`);
    process.exit(1);
  }
  console.log(`[iter-driver] iteration ${currentIter} COMPLETE: newInfoRatio=${lastIter.newInfoRatio}, status=${lastIter.status}, focus="${(lastIter.focus ?? '').slice(0, 80)}"`);

  return {
    dispatched: true,
    iteration: currentIter,
    newInfoRatio: lastIter.newInfoRatio,
    status: lastIter.status,
    decision,
    reason,
  };
}

main().catch(err => {
  console.error('[iter-driver] FATAL', err);
  process.exit(1);
});
