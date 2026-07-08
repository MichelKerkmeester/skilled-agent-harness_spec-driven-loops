---
title: "Tasks: Canon self-enforcement (parent-hub hardening)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "canon self-enforcement tasks"
  - "999 sk-doc phase 024 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/024-canon-self-enforcement"
    last_updated_at: "2026-07-07T20:36:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-024 tasks (twelve WU roadmap)"
    next_safe_action: "Operator resolves D1-D3 then execute Phase 2 trio"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Tasks: Canon self-enforcement (parent-hub hardening)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked (gate-adjacent — awaits the advisor scorer lane) |

**Task Format**: `T### [P?] Description (file path)`

**AI Execution Protocol** (Level 3 execution discipline):
- **Pre-Task Checklist** — before each WU: re-verify its file:line anchors against HEAD and confirm `parent-skill-check.cjs` is 4/4.
- **Execution Rules** (TASK-SEQ, TASK-SCOPE) — land WU1 before its dependents; keep every edit within the WU's named files (0-leak).
- **Status Reporting Format** — after each WU report: the checker 4/4 result, the new-vitest result, and the `validate.sh --strict` exit code.
- **Blocked Task Protocol** — `[B]` tasks stay PREP-only until the operator opens the advisor scorer lane; never land them outside the single 193-row re-baseline event.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Extract all twelve council opportunities; re-verify every file:line anchor against HEAD
- [x] T002 Partition DO-NOW (WU1-7,9,12) vs GATE-ADJ (WU8,10,11) vs the three operator forks
- [ ] T003 [P] Author the WU11 dead-id → live-replacement sequencing doc (gate-free PREP)
- [ ] T004 [P] Author the WU8 `derived.entities` shape-break guard that fails today (gate-free PREP)
- [ ] T005 Capture baseline (checker 4/4 x4; existing advisor vitest counts); confirm scorer lane quiet
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Foundational trio (lead)**
- [ ] T006 WU1 [P1] Widen CI gate to `skills/*/mode-registry.json` + per-hub checker loop; fix CWD rule-4a (`routing-registry-drift.yml:9-20,51`; `parent-skill-check.cjs:90,194,599,608`)
- [ ] T007 WU3 [P] Defuse `edge_type` CHECK + self-heal migration + vitest (`skill-graph-db.ts:209,372-422`; `skill-graph-db.vitest.ts:176-219`)
- [ ] T008 WU12(a) [P] Patch template `sk-hub` family line (`parent_skill_graph_metadata_template.json:5`)
- [ ] T009 WU2 Cross-language vocabulary-agreement battery; subset-flag the 2 gated read-only sites (`skill-graph-db.ts:47,49-54,148,158`; `skill_graph_compiler.py:38,44`; `skill-graph-tools.ts:45`; `parent-skill-check.cjs:43,48,53`; flag `skill_advisor.py:242`, `graph-causal.ts:28-34`)

**DO-NOW hardening batch**
- [ ] T010 WU4 [P] [D1] Command-binding existence gate vitest; RED on `/doc:quality` (`sk-doc/mode-registry.json:145`; `.opencode/commands/**`)
- [ ] T011 WU5 [P] [D2] Read-only doctor freshness panel (3-way graph diff; report-only)
- [ ] T012 WU6 [P] Checker fixture harness (execFileSync golden+mutant); delete dead `VALID_BACKEND_KINDS` (`parent-skill-check.cjs:58`)
- [ ] T013 WU7 [P] Discovery-pipeline parity fixtures (TS recursive vs Python depth-1)
- [ ] T014 WU9 [P] description.json guard — checker rule 8b (no registry-owned `modes`/`backend_kinds`)
- [ ] T015 WU12(b-d) command-frontmatter⊆toolSurface rule; `importance_tier` reconciliation; surface the family fork (D3)

**Gate-adjacent (deferred — advisor scorer lane + 193-row re-baseline)**
- [B] T016 WU8-fix Flatten object entities (`metadata-sanitizer.ts:60-68`) — shifts scoring; co-lands with re-baseline
- [B] T017 WU10 Fix vocab-sync prefix-ownership (`parent-hub-vocab-sync.cjs:113-118`); Lane-C baseline adjacent
- [B] T018 WU11 Retire dead ids + rewrite ~8 corpus rows + recompute 193-row parity as ONE event (`labeled-prompts.jsonl`; `scorer-eval-baseline.json:16`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 `parent-skill-check.cjs` 4/4 (0 warnings) on all four hubs after every DO-NOW unit
- [ ] T020 Each new vitest green (vocab battery, edge_type CHECK, command-binding, checker fixtures, discovery parity)
- [ ] T021 A synthetic PR touching a non-deep-loop hub registry triggers the CI gate; checker run from a subdir passes 4a
- [ ] T022 `validate.sh --strict` on this packet + every touched spec folder
- [B] T023 Post-gate: advisor drift-guard + parity vitests green; re-baseline is one committed event
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All twelve council opportunities mapped to work units with real anchors; three forks surfaced
- [ ] Foundational trio (WU1+WU2+WU3) landed and 4/4 maintained
- [ ] DO-NOW batch (WU4-7, WU9, WU12) shipped; each carries a green gate
- [ ] GATE-ADJ tranche (WU8-fix, WU10, WU11) held PREP-only until the operator opens the lane
- [ ] `validate.sh --strict` clean on this folder (exit 0)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Source review**: See `../022-parent-skill-logic-review/review-report.md`
- **Baseline remediation**: See `../023-parent-hub-remediation/`
<!-- /ANCHOR:cross-refs -->
