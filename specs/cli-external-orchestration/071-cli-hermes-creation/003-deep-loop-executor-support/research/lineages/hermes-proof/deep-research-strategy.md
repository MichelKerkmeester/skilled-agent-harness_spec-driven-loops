---
title: Deep Research Strategy - cli-hermes hard rule ids and the fan-out by-construction rule (lineage hermes-proof)
description: Persistent research plan for the hermes-proof fan-out lineage of the deep-loop executor support packet.
trigger_phrases:
  - "deep research strategy"
  - "hermes-proof lineage strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Tracking

Fan-out lineage `hermes-proof` (executor cli-hermes, model deepseek-v4.1-flash) of phase 003
(deep-loop executor support) for packet 071-cli-hermes-creation. One iteration, stop policy
max-iterations (convergence before the cap is telemetry only).

## 2. TOPIC

List the eight hard rule ids declared in
`.opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md` and state which one a
fan-out lineage exercises by construction, citing the file and line for each id.

## 3. KEY QUESTIONS (remaining)

- [x] Q1 Eight hard rule ids with file:line citations, plus the one a fan-out lineage
      exercises by construction.

## 4. NON-GOALS

- No nested CLI dispatch, no sub-agents (LEAF executor; the lineage IS the executor).
- No writes outside
  `specs/cli-external-orchestration/071-cli-hermes-creation/003-deep-loop-executor-support/research/lineages/hermes-proof`.
- No repo tooling that writes (no generate-context.js, no validate.sh, no git writes).
- No live `hermes` dispatch — the topic is a static-source extraction.

## 5. STOP CONDITIONS

- 1 iteration completed (hard cap, stop policy max-iterations).
- The eight ids and the by-construction rule answered with cited evidence.

## 6. ANSWERED QUESTIONS

- Q1: The eight hard rule ids are `stdin-redirect-required` (SKILL.md:7),
  `hermes-availability-required` (SKILL.md:11), `yolo-required-for-writes` (SKILL.md:15),
  `ignore-rules-required` (SKILL.md:19), `explicit-toolsets-required` (SKILL.md:23),
  `no-worktree-flag` (SKILL.md:27), `mcp-config-operator-required` (SKILL.md:31), and
  `hooks-user-level` (SKILL.md:35). The rule a fan-out lineage exercises by construction is
  `stdin-redirect-required` (SKILL.md:7): a lineage dispatch is non-interactive by
  construction, and `buildHermesLineageCommand` emits `chat -Q --oneshot --query-file -`
  with the prompt on stdin, satisfying the rule's MUST
  (changelog/v1.0.0.0.md:13; SKILL.md:208; fanout-run.cjs:2603) (iteration 1).

## 7. WHAT WORKED

- Reading the SKILL.md frontmatter directly and re-verifying the eight `- id:` line numbers
  with a line-numbered content search: zero transcription risk on ids/lines (iteration 1)
- The packet changelog's `buildHermesLineageCommand` paragraph: one-line corroboration of
  the by-construction claim without needing a live dispatch (iteration 1)

## 8. WHAT FAILED

- First-pass reading of `no-worktree-flag` as the by-construction answer: its message names
  the fan-out containment guard, but the guard reacts to a violation rather than being
  exercised by the construction (iteration 1)

## 9. EXHAUSTED APPROACHES (do not retry)

[Populated when an approach has been tried from multiple angles without success]

## 10. RULED OUT DIRECTIONS

- `no-worktree-flag` as the by-construction answer (iteration 1, evidence:
  SKILL.md:27 — the message describes the guard's reaction to a violation)
- Listing every rule a fan-out touches rather than the single by-construction one
  (iteration 1, evidence: SKILL.md:208 — the topic asks for the rule whose precondition the
  construction guarantees)

## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none (cap reached at iteration 1)
- Pivot lineage: none
- Remaining frontier: none recorded

## 11A. CARRIED-FORWARD OPEN QUESTIONS

[None]

## 11. NEXT FOCUS

None — cap reached (maxIterationsReached). Proceed to synthesis.

## 12. KNOWN CONTEXT

`resource_map_present: false` — no `resource-map.md` at the spec folder
`specs/cli-external-orchestration/071-cli-hermes-creation/003-deep-loop-executor-support`.
Known inventory for this lineage: the `cli-hermes` skill packet
(`.opencode/skills/cli-external-orchestration/cli-hermes/` — SKILL.md, changelog,
references, assets), the shared deep-loop runtime
(`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`), and this phase's own
packet docs.

### Bounded Context Snapshot

- Source pointers: `.opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md`
  (frontmatter `hard_rules:` block, lines 6-38; dispatch shape §3, lines 191-232);
  `.opencode/skills/cli-external-orchestration/cli-hermes/changelog/v1.0.0.0.md`;
  `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2603`.
- Integration points: the fan-out lineage is bound to
  `config.fanout_lineage_artifact_dir` (this directory), so the workflow's
  `step_resolve_artifact_root` override — not the resolver node — owns `artifact_dir`.
- Constraints and risks: LEAF-only execution, write confinement to this lineage directory,
  no repo tooling that writes.

## 13. RESEARCH BOUNDARIES

- Max iterations: 1 (from config; stop policy max-iterations)
- Convergence threshold: 0.05 (telemetry only under max-iterations policy)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` (this lineage); `resume`/`restart` live
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-09-14T19:23:37Z