import { readFileSync, writeFileSync } from 'node:fs';
import { renderPromptPack } from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts';

const ARTIFACT_DIR = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/cli-external-orchestration/029-cli-devin-revival/research';
const REPO_ROOT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const TEMPLATE_PATH = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl';

const config = JSON.parse(readFileSync(`${ARTIFACT_DIR}/deep-research-config.json`, 'utf8'));
const SESSION_ID = config.lineage.sessionId;
const RESEARCH_TOPIC = config.topic;

const STATE_SUMMARY = [
  'Segment: 1 | Iteration: 1 of 10',
  'Questions: 0/6 answered (none yet attempted) | Last focus: none yet',
  'Last 2 ratios: N/A -> N/A | Stuck count: 0',
  'Resource map: resource-map.md not present; skipping coverage gate.',
  'Memory context refresh: phase 001 implementation-summary.md is on disk in spec folder',
  'Next focus: inventory enumeration (Q1, Q2, Q3) — authoritative per-hook per-plugin inventories with file:line citations, before any verdict logic.',
].join('\n');

const variables = {
  state_summary: STATE_SUMMARY,
  research_topic: RESEARCH_TOPIC,
  current_iteration: 1,
  max_iterations: 10,
  next_focus: 'Iteration 1 — INVENTORY ENUMERATION. Produce three exhaustive inventories before any verdict logic: (A) every Claude Code hook registered under .claude/ in this repo (settings.json `hooks.*` keys, plugin-bundled hooks if any), with event name + matcher + cwd + handler command for each, with file:line citations; (B) every OpenCode plugin registered under .opencode/ (plugin manifests + any hook registrations), calling out the 7 repo guard hook cores referenced by cli-codex hook-contract.md (spec-gate-enforce/classify, dispatch-preflight-lint, post-edit-quality, code-graph-freshness, dispatch-audit, completion-evidence-sentinel, mcp-route-guard) — for each one identify its runtime-neutral core implementation file:line; (C) Devin CLI hook contract surface — every one of the 8 lifecycle events (PreToolUse, PostToolUse, PermissionRequest, UserPromptSubmit, Stop, PostCompaction, SessionStart, SessionEnd) with the JSON schema it receives on stdin and a fully-populated example entry for .devin/hooks.v1.json. ONLY after (A)+(B)+(C) are complete: produce an initial per-row port verdict table (portable 1:1 / needs adaptation / cannot port) with rationale grounded in matching shapes, missing payload fields, cwd/env differences, and Devin missing-event semantics. End with a preliminary read on read_config_from.claude:true viability (Q5) — which hooks it would cover vs which it cannot.',
  remaining_questions_list: 'Q1 (Claude Code hooks inventory), Q2 (OpenCode plugins + 7 guard hook cores inventory), Q3 (Devin CLI hooks contract surface), Q4 (per-hook per-plugin port verdict with rationale), Q5 (read_config_from.claude viability), Q6 (ADR-001-ready table)',
  carried_forward_open_questions: '[None yet — first iteration]',
  last_3_summaries: 'none yet',
  pivot_lineage: 'none yet',
  saturated_directions: 'none yet',
  state_paths_config: '.opencode/specs/cli-external-orchestration/029-cli-devin-revival/research/deep-research-config.json',
  state_paths_state_log: '.opencode/specs/cli-external-orchestration/029-cli-devin-revival/research/deep-research-state.jsonl',
  state_paths_strategy: '.opencode/specs/cli-external-orchestration/029-cli-devin-revival/research/deep-research-strategy.md',
  state_paths_registry: '.opencode/specs/cli-external-orchestration/029-cli-devin-revival/research/findings-registry.json',
  state_paths_iteration_pattern: `${ARTIFACT_DIR}/iterations/iteration-001.md`,
  state_paths_delta_pattern: `${ARTIFACT_DIR}/deltas/iter-001.jsonl`,
};

const rendered = renderPromptPack(TEMPLATE_PATH, variables);
const promptPath = `${ARTIFACT_DIR}/prompts/iteration-1.md`;
writeFileSync(promptPath, rendered);
console.log(JSON.stringify({ promptPath, bytes: rendered.length, sessionId: SESSION_ID }, null, 2));
