// Drives one deep-research iteration through the same library entry points the
// deep-research auto workflow's if_cli_devin branch names. Kept in the packet's
// scratch/ because it is a faithful executor of that workflow's dispatch step for
// this run, not a second adapter: prompt rendering, audit, command building,
// containment and exit handling all come from the shipped runtime modules.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Static relative specifiers resolve from this file's directory, not the repo root the
// workflow assumes, so the runtime modules are loaded by absolute path from cwd instead.
const LIB = (rel) => pathToFileURL(resolve(process.cwd(), '.opencode/skills/system-deep-loop/runtime', rel)).href;
const { renderPromptPack } = await import(LIB('lib/deep-loop/prompt-pack.ts'));
const { runAuditedExecutorCommand, writeFirstRecordExecutor } = await import(LIB('lib/deep-loop/executor-audit.ts'));
const { resolveSandboxMode, resolveClaudePermissionMode } = await import(LIB('lib/deep-loop/executor-config.ts'));
const { snapshotOutOfScopeDirtyPaths, enforceWriteContainment } = await import(LIB('lib/deep-loop/write-containment.ts'));

const require = createRequire(import.meta.url);
const { buildLineageCommand } = require(resolve(process.cwd(), '.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs'));

const iteration = Number(process.argv[2]);
const nextFocus = process.argv[3];
if (!Number.isInteger(iteration) || !nextFocus) {
  console.error('usage: run-iteration.mjs <iteration> "<next focus>"');
  process.exit(2);
}

const repoRoot = process.cwd();
const SF = 'specs/sk-doc/040-create-repo-rules/001-repo-rules-router/003-disposition-and-gap-research';
const AD = `${SF}/research`;
const cfg = JSON.parse(readFileSync(`${AD}/deep-research-config.json`, 'utf8'));
const NNN = String(iteration).padStart(3, '0');

const stateLines = readFileSync(`${AD}/deep-research-state.jsonl`, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
const iters = stateLines.filter((r) => r.type === 'iteration');
const ratios = iters.map((r) => (typeof r.newInfoRatio === 'number' ? r.newInfoRatio : null));
const last3 = iters.slice(-3).map((r) => `i${r.iteration}: ${r.summary ?? '(no summary)'}`).join(' | ') || 'none';

const RQ = [
  'RQ1: Does the shipped repo-rules set expand every thinking-and-acting row in `AGENTS.md` sections 2, 3, 4 and 7, and which rows are still compressed with nowhere to expand?',
  'RQ2: Which `AGENTS.md` rows should move down into a rule file, and which must stay because they are hard blockers, gates, or routing?',
  'RQ3: Separating container from content, does the disposition carried by the per-turn governor directive retired in commit `4477a9f1` earn a rule file, a section in an existing file, or nothing?',
  'RQ4: Which further repo rules are warranted, which plausible-sounding ones are not, and what is the subtraction candidate?',
  'RQ5: What does `repo-rules/delegation-and-orchestration.md` get wrong, overstate, or leave uncovered?',
];
const answered = iteration - 1;
const remaining = RQ.slice(answered).map((q) => `\n  - ${q}`).join('');

const stateSummary = [
  'STATE SUMMARY (auto-generated):',
  `Segment: 1 | Iteration: ${iteration} of ${cfg.maxIterations}`,
  `Questions: ${answered}/${RQ.length} answered | Last focus: ${iteration === 1 ? 'none (first iteration)' : RQ[answered - 1].slice(0, 60)}`,
  `Last 2 ratios: ${ratios.at(-2) ?? 'n/a'} -> ${ratios.at(-1) ?? 'n/a'} | Stuck count: 0`,
  'resource-map.md not present; skipping coverage gate.',
  'memory_context unavailable this session: the system-spec-memory MCP server failed to connect (CONNECT_TIMEOUT). Absence of prior context is a connection failure, not evidence that none exists.',
  `Next focus: ${nextFocus}`,
].join('\n');

const promptPath = `${AD}/prompts/iteration-${iteration}.md`;
writeFileSync(promptPath, renderPromptPack(
  resolve(process.cwd(), '.opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl'),
  {
    state_summary: stateSummary,
    research_topic: cfg.topic,
    current_iteration: iteration,
    max_iterations: cfg.maxIterations,
    next_focus: nextFocus,
    remaining_questions_list: remaining || ' none',
    carried_forward_open_questions: iters.flatMap((r) => r.openQuestions ?? []).map((q) => `  - ${q}`).join('\n') || '  (none yet)',
    last_3_summaries: last3,
    pivot_lineage: 'none yet',
    saturated_directions: 'none yet',
    state_paths_config: `${AD}/deep-research-config.json`,
    state_paths_state_log: `${AD}/deep-research-state.jsonl`,
    state_paths_strategy: `${AD}/deep-research-strategy.md`,
    state_paths_registry: `${AD}/findings-registry.json`,
    state_paths_iteration_pattern: `${AD}/iterations/iteration-${NNN}.md`,
    state_paths_delta_pattern: `${AD}/deltas/iter-${NNN}.jsonl`,
  },
));

const executor = {
  kind: cfg.executor.kind,
  model: cfg.executor.model,
  configDir: null,
  reasoningEffort: null,
  serviceTier: null,
  sandboxMode: 'workspace-write',
  timeoutSeconds: cfg.executor.timeoutSeconds,
  governor: null,
};
writeFirstRecordExecutor(`${AD}/deep-research-state.jsonl`, executor, iteration);

const lineage = { kind: executor.kind, model: executor.model, sandboxMode: 'workspace-write' };
const { command, args, input } = buildLineageCommand(
  lineage,
  readFileSync(promptPath, 'utf8'),
  resolveSandboxMode('workspace-write'),
  resolveClaudePermissionMode('workspace-write'),
  { env: process.env, cwd: repoRoot },
);
console.error(`[dispatch] iteration ${iteration}: ${command} ${args.filter((a) => a.length < 40).join(' ')}`);

const dispatchId = `research-i${iteration}-g1`;
const preDispatchDirtyPaths = snapshotOutOfScopeDirtyPaths({ repoRoot, artifactDir: AD });
const dispatchExit = runAuditedExecutorCommand({
  command, args, cwd: repoRoot,
  timeoutSeconds: executor.timeoutSeconds,
  stateLogPath: `${AD}/deep-research-state.jsonl`,
  executor, iteration, input,
  receiptDir: `${AD}/dispatch-receipts`,
  dispatchId,
});
const containment = enforceWriteContainment({
  repoRoot, artifactDir: AD, preDispatchDirtyPaths,
  stateLogPath: `${AD}/deep-research-state.jsonl`,
  iteration, label: dispatchId,
});
if (containment.violations.length > 0) {
  console.error(`write-containment violation: reverted ${containment.violations.length} out-of-scope path(s): ${containment.violations.map((v) => v.path).join(', ')}`);
  process.exit(1);
}
// The append gateway's legacy projection contract already carries `research/` in its
// relative path, so pointing --run-directory at the artifact dir (as the workflow's
// state_write_protocol specifies) lands the projection one level too deep. Fold the
// nested rows back into the canonical log the reducer and convergence actually read.
const nested = `${AD}/research/deep-research-state.jsonl`;
if (existsSync(nested)) {
  const canonPath = `${AD}/deep-research-state.jsonl`;
  const seen = new Set(readFileSync(canonPath, 'utf8').split('\n').filter(Boolean)
    .map((l) => JSON.stringify(JSON.parse(l), Object.keys(JSON.parse(l)).sort())));
  const extra = readFileSync(nested, 'utf8').split('\n').filter(Boolean).filter((l) => {
    const o = JSON.parse(l);
    return !seen.has(JSON.stringify(o, Object.keys(o).sort()));
  });
  if (extra.length > 0) {
    writeFileSync(canonPath, readFileSync(canonPath, 'utf8').replace(/\n?$/, '\n') + extra.join('\n') + '\n');
    console.error(`[fold] merged ${extra.length} projected row(s) into the canonical state log`);
  }
}

console.error(`[dispatch] exit=${dispatchExit} iteration-file=${existsSync(`${AD}/iterations/iteration-${NNN}.md`)} delta=${existsSync(`${AD}/deltas/iter-${NNN}.jsonl`)}`);
process.exit(dispatchExit);
