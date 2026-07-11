---
title: "Tasks: Phase 6: Validation & Close-Out"
description: "Task Format: T### [P?] <FINDING-ID>: <one-line fix> (file:line) — CMD-05, XS-01 (operator-gated), XS-03, then the validation gate."
trigger_phrases:
  - "validation closeout tasks"
  - "build-artifact regen tasks"
  - "skill-graph regen operator gate tasks"
  - "006-validation-closeout tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-command-agent-conformance-audit/006-validation-closeout"
    last_updated_at: "2026-07-11T00:45:00Z"
    last_updated_by: "fable-5"
    recent_action: "Authored tasks.md: 25 tasks for 3 findings + validation gate, P0-P2"
    next_safe_action: "Execute T001 pre-flight after 002-005 land; T003/T004 need operator OK"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py"
      - ".opencode/commands/doctor/scripts/skill-graph-freshness.cjs"
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: Validation & Close-Out

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

**Task Format**: `T### [P?] <FINDING-ID>: <one-line fix> (file:line)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Pre-Flight (Dependency Gate)

- [ ] T001 Confirm phases 002-005 each have `implementation-summary.md` and an individually clean `validate.sh --strict` (per-child)
- [ ] T002 [P] Capture the pre-regen baseline via `node .opencode/commands/doctor/scripts/skill-graph-freshness.cjs` (for before/after diffing against T007/T014)
- [ ] T003 [P] Confirm phase 002's CMD-06 fix (deep presentation `.txt` executor-selector dedup) is on disk before CMD-05's recompile runs (T009-T011)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P0 — XS-01 Skill-Graph Regen (OPERATOR-GATED)

- [B] T004 XS-01: **STOP — obtain explicit operator approval before this task or T005/T006 run.** Regen mutates persistent advisor-routing state (SQLite + compiled skill-graph.json); default posture without approval is "deferred," not "skipped silently" (`.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json`)
- [B] T005 XS-01: (If approved) Regenerate `skill-graph.json` via `skill_graph_compiler.py` — purge 9 ghost nodes (`cli-claude-code`, `cli-opencode`, `deep-loop-runtime`, `deep-loop-workflows`, `mcp-chrome-devtools`, `mcp-click-up`, `mcp-figma`, `mcp-open-design`, `sk-prompt-models`) + 2 family mismatches (`sk-design` sk-hub/sk-code, `sk-prompt` sk-hub/sk-util) (`.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py`) — sequenced after T004 approval
- [B] T006 XS-01: (If approved) Run the `skill_graph_scan` MCP tool (trusted caller required) to re-index `.opencode/skills` and purge the `cli-codex-retired` SQLite zombie (`.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`) — sequenced after T005
- [ ] T007 [P] Verify T004-T006: re-run `skill-graph-freshness.cjs`; if approved+executed, confirm `GHOST`/`FAMILY MISMATCH`/`ZOMBIE` lines all report `none`; if deferred, confirm the deferral + rationale is recorded in this phase's continuity/handoff

### P1 — CMD-05 Deep Contract Regen

- [ ] T008 [P] CMD-05: Recompile `deep_research.contract.md` via `node compile-command-contracts.cjs --command deep/research --write` (`.opencode/commands/deep/assets/compiled/deep_research.contract.md`) — sequenced after T003
- [ ] T009 [P] CMD-05: Recompile `deep_review.contract.md` via `node compile-command-contracts.cjs --command deep/review --write` (`.opencode/commands/deep/assets/compiled/deep_review.contract.md`) — sequenced after T003
- [ ] T010 [P] CMD-05: Recompile `deep_ai-council.contract.md` via `node compile-command-contracts.cjs --command deep/ai-council --write` (`.opencode/commands/deep/assets/compiled/deep_ai-council.contract.md:368`) — sequenced after T003
- [ ] T011 CMD-05: Investigate + reconcile the `deep/ai-council` row in `manifest.jsonl` — rows are appended only by `render-command-contract.cjs` at render time, not the compiler; determine why the prior row's `compiledContractSha256` diverged from the on-disk file (`.opencode/commands/deep/assets/compiled/manifest.jsonl`) — sequenced after T010
- [ ] T012 [P] Verify T008-T011: recompute sha256 of each contract's declared source paths, confirm it matches that contract's own `sourceDigests` header; confirm `deep_ai-council.contract.md`'s on-disk sha256 matches the latest `manifest.jsonl` row for `deep/ai-council`

### P2 — XS-03 Hub Timestamp Backfill

- [ ] T013 XS-03: Backfill `derived.generated_at` on 12 hub `graph-metadata.json` files — no wired production CLI found; invoke `syncDerivedMetadata` (`.opencode/skills/system-skill-advisor/mcp_server/lib/derived/sync.ts`) per hub or author a thin driver. Hubs: `cli-external`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-git`, `sk-prompt`, `system-code-graph`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit` (`.opencode/skills/<hub>/graph-metadata.json`)
- [ ] T014 [P] Verify T013: re-run `skill-graph-freshness.cjs`, confirm the `NULL derived.generated_at` line reports `none`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Validation Gate (P0 — terminal)

- [ ] T015 Spot-confirm each of phases 002-005 is individually clean: `bash validate.sh <child> --strict` per child, before the parent-wide run
- [ ] T016 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <132-parent> --strict` (auto-recurses) — confirm Errors:0 across parent + all 6 children — sequenced after T007, T012, T014
- [ ] T017 [P] Run `bash .opencode/commands/doctor/scripts/route-validate.sh` — confirm exit 0
- [ ] T018 [P] Re-run each read-only `/doctor` target (`memory`, `embeddings`, `causal-graph`, `code-graph`, `deep-loop`, `skill-budget`, `parent-skill`, `skill-graph-freshness`, `fable-mode`) against the corrected surface — confirm no new errors vs. the research.md §4 baseline (exit 75 on `memory`/`causal-graph` remains the documented "daemon not warm" code)
- [ ] T019 Run `node .opencode/commands/doctor/scripts/parent-skill-check.cjs sk-doc` (owns `create-agent`, touched by phase 004's AGT-03/AGT-08/AGT-09) — confirm STRICT 0; also run against `system-skill-advisor` if T005/T006 executed
- [ ] T020 Re-run `skill_advisor_regression.py --dataset .opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl` if any advisor-facing metadata changed (002-005's `trigger_phrases`/frontmatter, or T005/T006) — confirm no regression vs. the pre-program baseline, or document the intended delta

### Program Metadata + Close (P0 — terminal)

- [ ] T021 Regenerate `description.json` + `graph-metadata.json` for each of the 6 children, then the 132 parent
- [ ] T022 Confirm parent `graph-metadata.json` `children_ids` count == 6 on-disk children and `derived.last_active_child_id` is set — sequenced after T021
- [ ] T023 Memory-save the program via `generate-context.js`; confirm the POST-SAVE quality review is PASSED, or patch HIGH/MEDIUM issues
- [ ] T024 Reconcile completion metadata across this phase's own spec/plan/tasks (and cross-check parent + sibling children docs) so nothing claims a conflicting completion state; author this phase's `implementation-summary.md` ONLY once the work above is executed and green
- [ ] T025 Final terminal re-check: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <132-parent> --strict` re-run after T021-T024 (metadata regen can itself introduce drift) — confirm Errors:0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T004-T007 may close as "deferred" with rationale instead of `[x]` if the operator does not approve XS-01 — that is an honest terminal state, not a blocker)
- [ ] No `[B]` blocked tasks remaining without a recorded resolution (approved-and-executed, or explicitly deferred)
- [ ] Final `validate.sh --strict` (T025) is Errors:0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (REQ-001 through REQ-009)
- **Plan**: See `plan.md` (Phases 1-5)
- **Findings source**: `../001-conformance-deep-research/research/research.md` §3.1 (CMD-05), §3.4 (XS-01, XS-03), §6 (routing)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
