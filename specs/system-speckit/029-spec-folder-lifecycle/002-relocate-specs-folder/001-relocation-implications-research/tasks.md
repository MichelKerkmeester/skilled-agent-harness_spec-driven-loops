---
title: "Tasks: Relocation Implications Research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "relocation research tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/001-relocation-implications-research"
    last_updated_at: "2026-08-06T13:28:45Z"
    last_updated_by: "claude-code"
    recent_action: "4-lineage synthesis complete after a second research round (sol + luna)"
    next_safe_action: "Read research/research.md before scoping phase 002"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-system-speckit-032-relocate-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Relocation Implications Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold the phase folder (spec.md, plan.md, tasks.md, implementation-summary.md, description.json, graph-metadata.json) [evidence: `create.sh --phase --parent` scaffolded the folder; `validate.sh --recursive --strict` on the parent packet reports `RESULT: PASSED`]
- [x] T002 Confirm `devin` and `cursor-agent` CLI auth (`devin auth status`, `cursor-agent about`) [evidence: `devin auth status` → "Logged in (via Devin)", Devin Pro; `cursor-agent about` → authenticated, Cursor Pro, no "Not logged in" text]
- [x] T003 Resolve model tiers against each CLI's enforced allowlist (GLM-5.2 High → `glm-5-2` on cli-devin; Grok 4.5 High → `cursor-grok-4.5-high` on cli-cursor) [evidence: `cli-devin/references/providers-and-models.md` and `cli-cursor/references/providers-and-models.md` catalogs read directly; operator confirmed `cursor-grok-4.5-high` since no Grok "Max" id exists on either allowlist]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Dispatch both lineages via `fanout-run.cjs` (the runtime `/deep:research:auto` delegates to for `--executor`-flag multi-lineage fan-out), `--concurrency=2`, `--convergence-threshold=0.05` [evidence: `orchestration-summary.json` run `1786007920763-ma04a6`]
- [x] T005 [P] Monitor both lineages through convergence [evidence: grok converged iteration 6 on first dispatch; glm's first dispatch exited code 1 in 388ms — reproduced directly (`devin -p --model glm-5-2 --permission-mode dangerous --sandbox` → "Mode 'autonomous' is restricted by your organization's policy"), got explicit operator approval for `sandboxMode: danger-full-access`, retried, glm converged iteration 5 (`orchestration-summary.json` run `1786009077472-i5lfbh`, `EXIT:0`)]
- [x] T006 Confirm the workflow synthesized `research/research.md` from both lineages [evidence: the packet-level merge step never ran automatically since the first attempt was partial (1/2 lineages); wrote `research/research.md` by hand after both lineages had real output, reconciling the two verdicts rather than picking one]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Read `research/research.md`; confirm findings are source-cited and the recommendation is explicit [evidence: 10/10 spot-checked citations (5 per lineage) independently re-verified against the actual files during synthesis; recommendation is explicit — CONDITIONAL-GO with a named patch list and carried-forward verification items]
- [x] T008 Run `validate.sh --recursive --strict` on the parent packet [evidence: see implementation-summary.md Verification table for the exact re-run result]
- [x] T009 Report the ranked implications and recommendation to the operator; scope phase 002 only after that review [evidence: reported in-session, citing `research/research.md` §6 for the recommendation and §3 for the combined implication table]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Second Round (sol + luna)

- [x] T010 Dispatch two more lineages on the same topic — `sol` (cli-codex, `gpt-5.6-sol`, reasoningEffort `high`) and `luna` (cli-codex, `gpt-5.6-luna`, reasoningEffort `max`), 5 iterations each per operator confirmation [evidence: `orchestration-summary.json` run `1786019208170-r5nald`]
- [x] T011 Investigate sol's containment-violation flag before trusting or discarding its output [evidence: `git status --porcelain .pi/modes.json` clean (zero diff) confirms the reverted write left no residue; `grep -rl "modes.json" research/lineages/sol/` found no reference in sol's own research output; sol's own state log shows a clean `synthesis_complete` + `lock_released` sequence before the containment check ran]
- [x] T012 Verify sol/luna citations against real files before merging into the synthesis [evidence: 5/5 spot-checked citations (`spec-root-migration.ts:219`, `spec-root-write-guard.ts:15`, `spec-root-registry.ts:24`, `spec-doc-paths.ts:275-290`, `indexing.ts:66-75`) matched exactly]
- [x] T013 Rewrite `research/research.md` as a 4-lineage synthesis, incorporating the newly-found existing `spec-root-*` migration subsystem and revising the recommendation accordingly
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `research/research.md` present with a ranked implication list and explicit recommendation
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
