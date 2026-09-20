import { writeFileSync, mkdirSync, appendFileSync } from 'node:fs';

const ARTIFACT_DIR = process.env.ARTIFACT_DIR;
const SPEC_FOLDER = process.env.SPEC_FOLDER;
const SESSION_ID = process.env.SESSION_ID;
const NOW = process.env.NOW;
const RESEARCH_TOPIC = process.env.RESEARCH_TOPIC;

mkdirSync(ARTIFACT_DIR, { recursive: true });
mkdirSync(`${ARTIFACT_DIR}/prompts`, { recursive: true });
mkdirSync(`${ARTIFACT_DIR}/iterations`, { recursive: true });
mkdirSync(`${ARTIFACT_DIR}/deltas`, { recursive: true });
mkdirSync(`${ARTIFACT_DIR}/dispatch-receipts`, { recursive: true });

const config = {
  topic: RESEARCH_TOPIC,
  maxIterations: 10,
  minIterations: 3,
  convergenceThreshold: 0.05,
  antiConvergence: {
    minIterations: 3,
    convergenceMode: 'default',
    stopPolicy: 'fail-closed',
    divergent: {},
  },
  stuckThreshold: 3,
  minIdeaObservations: 2,
  maxDurationMinutes: 120,
  maxToolCallsPerIteration: 12,
  maxMinutesPerIteration: 10,
  progressiveSynthesis: true,
  specFolder: SPEC_FOLDER,
  resource_map_present: false,
  resource_map: { emit: true },
  createdAt: NOW,
  status: 'initialized',
  executionMode: 'auto',
  executor: {
    kind: 'cli-codex',
    model: 'gpt-5.6-luna',
    reasoningEffort: 'xhigh',
    serviceTier: 'fast',
    sandboxMode: 'workspace-write',
    timeoutSeconds: 1500,
    configDir: null,
  },
  config: {
    executor: {
      type: 'cli-codex',
      model: 'gpt-5.6-luna',
      reasoningEffort: 'xhigh',
      serviceTier: 'fast',
      timeoutSeconds: 1500,
    },
  },
  lineage: {
    sessionId: SESSION_ID,
    parentSessionId: null,
    lineageMode: 'new',
    generation: 1,
    continuedFromRun: null,
  },
  nextRunAt: null,
  remainingDelayMs: null,
  reducer: {
    enabled: true,
    version: '1.0',
    registryFile: 'research/findings-registry.json',
    dashboardFile: 'research/deep-research-dashboard.md',
    strategyFile: 'research/deep-research-strategy.md',
    machineOwnedSections: [
      'key-questions',
      'answered-questions',
      'what-worked',
      'what-failed',
      'exhausted-approaches',
      'ruled-out-directions',
      'divergence-frontier',
      'next-focus',
    ],
  },
  fileProtection: {
    'deep-research-config.json': 'immutable',
    'deep-research-state.jsonl': 'append-only',
    'deep-research-strategy.md': 'mutable',
    'deep-research-dashboard.md': 'auto-generated',
    'findings-registry.json': 'auto-generated',
    'iteration-*.md': 'write-once',
    'research/research.md': 'mutable',
  },
};
writeFileSync(`${ARTIFACT_DIR}/deep-research-config.json`, JSON.stringify(config, null, 2) + '\n');

const stateLogLine = JSON.stringify({
  type: 'config',
  topic: RESEARCH_TOPIC,
  maxIterations: 10,
  minIterations: 3,
  convergenceThreshold: 0.05,
  antiConvergence: { convergenceMode: 'default', divergent: {} },
  minIdeaObservations: 2,
  resource_map_present: false,
  resource_map: { emit: true },
  createdAt: NOW,
  specFolder: SPEC_FOLDER,
  nextRunAt: null,
  remainingDelayMs: null,
  sessionId: SESSION_ID,
  generation: 1,
  lineageMode: 'new',
  executor: config.executor,
  config: { executor: config.config.executor },
});
appendFileSync(`${ARTIFACT_DIR}/deep-research-state.jsonl`, stateLogLine + '\n');

const registry = {
  openQuestions: [],
  resolvedQuestions: [],
  keyFindings: [],
  ruledOutDirections: [],
  observedIdeas: [],
  promotedIdeas: [],
  suppressedIdeas: [],
  rejectedPatterns: [],
  rejectedPatternIndex: {},
  suppressedCandidates: [],
  divergence: { completed: [], overrides: [], saturatedDirections: [], failed: [] },
  metrics: {
    iterationsCompleted: 0,
    openQuestions: 0,
    resolvedQuestions: 0,
    keyFindings: 0,
    convergenceScore: 0,
    coverageBySources: {},
  },
};
writeFileSync(`${ARTIFACT_DIR}/findings-registry.json`, JSON.stringify(registry, null, 2) + '\n');

const researchTopicEscaped = RESEARCH_TOPIC;
const strategy = `---
title: Deep Research Strategy - devin-hooks-claude-opencode-plugin-portability
description: Iterative research session focused on porting this repo's Claude Code hooks and OpenCode plugins into Devin CLI hook contract; informs phase 004-devin-hook-adapter-layer ADR-001.
trigger_phrases: [devin hooks portability, claude hooks devin port, opencode plugins devin, hook-adapter-layer, ADR-001]
importance_tier: important
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW
Persistent brain for the deep-research session; tracks focus decisions and outcomes across iterations.

## 2. TOPIC
${researchTopicEscaped}

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1. Enumerate every Claude Code hook registered in this repo's .claude settings (settings.json hooks.* keys, plus any plugin-bundled hooks), with event name + matcher + cwd + handler command for each.
- [ ] Q2. Enumerate every OpenCode plugin registered under .opencode/ (plugin manifests, hook registrations, runtime-neutral cores referenced by cli-codex hook-contract.md: spec-gate-enforce/classify, dispatch-preflight-lint, post-edit-quality, code-graph-freshness, dispatch-audit, completion-evidence-sentinel, mcp-route-guard).
- [ ] Q3. Enumerate Devin CLI's 8 lifecycle hooks (PreToolUse, PostToolUse, PermissionRequest, UserPromptSubmit, Stop, PostCompaction, SessionStart, SessionEnd), the JSON schema each receives on stdin, and the .devin/hooks.v1.json entry shape (type, matcher, command|prompt, timeout).
- [ ] Q4. Per hook + per plugin: classify portable 1:1 / needs adaptation / cannot port, with rationale grounded in matching shapes, missing payload fields, cwd/env differences, and Devin's missing equivalent events.
- [ ] Q5. Evaluate whether Devin native read_config_from.claude:true import could substitute for hand-built adapters in part or in full (which hooks it covers vs misses, and why).
- [ ] Q6. Produce a per-hook per-plugin port verdict table ready to be cited as ADR-001 evidence by phase 004-devin-hook-adapter-layer/plan.md.
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
- Not designing the actual adapter implementation (that's the phase 004 build step).
- Not evaluating Devin IDE-runtime hooks surface (the deleted D5 surface, explicitly out-of-scope per parent spec section 3).
- Not evaluating Devin-as-MCP-host surface (also explicitly out-of-scope per parent spec section 3).
- Not re-pinning the Devin CLI contract facts - phase 001 implementation-summary.md is the source of truth and is cited inline.

## 5. STOP CONDITIONS
- All 6 key questions answered with reproducible evidence (file:line citations + Devin docs citations + per-row verdict + rationale).
- Or --max-iterations=10 reached.
- Or all-research-failed state requiring operator direction.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet - populated as iterations resolve questions]
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[First iteration - populated after iteration 1 completes]
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[First iteration - populated after iteration 1 completes]
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[Approaches definitively eliminated]
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: 6 key questions, none saturated
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[Self-owned open questions from iteration write-back]
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Iteration 1 starting point: inventory enumeration - produce authoritative per-hook per-plugin inventories with file:line citations from the live tree, before any verdict logic.
<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
### Prior Research
Phase 001 (001-devin-contract-pin/implementation-summary.md) already verified the live Devin CLI v3000.2.17, hooks contract (8 lifecycle events), config format, 4 permission modes, model roster, subagent mechanism, cloud handoff. Cite this implementation-summary.md as the Devin-side fact base; do not re-fetch Devin docs unless a new contract surface is needed.
### Spec Folder Context
- Parent packet: .opencode/specs/cli-external-orchestration/029-cli-devin-revival (phase parent, 7 phases).
- Phase 001 complete; phase 004 (devin-hook-adapter-layer) is the consuming phase; ADR-001 lives there.
- Existing research packet at this artifact_dir will be consulted on resume.

### Bounded Context Snapshot
- Source pointers:
  - .claude/settings.json or equivalent .claude config (Claude Code hook registrations)
  - .opencode/opencode.json + .opencode/plugin/** (OpenCode plugin registrations)
  - cli-codex SKILL.md or its hook-contract.md file (runtime-neutral hook cores referenced by the 7 guard hooks)
  - 001-devin-contract-pin/implementation-summary.md (Devin CLI contract source of truth)
- Reuse candidates: cli-codex hook-adapter-layer precedent (existing thin-adapter pattern); parent spec section 3 "decide native import vs. custom adapters" note.
- Integration points: .devin/hooks.v1.json (the new config file to be written under phase 004), existing .claude/ settings (likely no change).

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (default)
- Stop policy: max-iterations (forced-depth; convergence treated as telemetry only)
- Per-iteration budget: 12 tool calls, 10 min, 1500s dispatch timeout per iteration
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches live: new, resume, restart
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Question injection surface: ${SPEC_FOLDER}/research/inbox.jsonl
- Current generation: 1
- Started: ${NOW}
`;

writeFileSync(`${ARTIFACT_DIR}/deep-research-strategy.md`, strategy);

writeFileSync(
  `${ARTIFACT_DIR}/deep-research-dashboard.md`,
  `# Deep Research Dashboard

- Status: initialized
- Topic: devin-hooks-claude-opencode-plugin-portability
- Spec Folder: ${SPEC_FOLDER}
- Session: ${SESSION_ID} (gen 1, lineage=new)
- Executor: cli-codex / gpt-5.6-luna / xhigh / fast / workspace-write / 1500s
- Stop policy: max-iterations (forced-depth, max=10)
- Started: ${NOW}

Awaiting iteration 1 completion.
`
);

console.log(JSON.stringify({ sessionId: SESSION_ID, artifactDir: ARTIFACT_DIR, specFolder: SPEC_FOLDER }, null, 2));
