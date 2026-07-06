---
title: "Tasks: Phase 012 - Rigorous Routing Benchmark and Skill-Advisor Verification"
description: "Pending task breakdown for updating the sk-design benchmark corpus for Phases 006-011, freezing a post-011 baseline, and running a numerically-gated routing-accuracy benchmark."
trigger_phrases:
  - "phase 012 tasks"
  - "routing benchmark tasks"
  - "post-011 baseline tasks"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Reconciled tasks: T018-T020/T024-T025 done; rest descoped per ADR-003"
    next_safe_action: "No further Phase 012 action required."
---
# Tasks: Phase 012 - Rigorous Routing Benchmark and Skill-Advisor Verification

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are met |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (primary artifact) {deps: T###}`

> **Reconciliation note (2026-07-06)**: Per `decision-record.md` ADR-003, T001-T019 and T021-T023 (the corpus audit, battery expansion, harness extension, live-mode rerun, and baseline promotion) were never executed and remain `[ ]` below as an honest record, open for a future phase. Only T020, T024, and T025 (strict validation, doc reconciliation, handoff notes) were performed, against the existing `benchmark/after-012-routing-rigor/` evidence rather than a fresh `after-011`/`after-011-live` run.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Corpus and Change-Surface Audit

- [ ] T001 Confirm Phases 006-011 are independently validated and each `implementation-summary.md` records completion (Phases 006-011 evidence).
- [ ] T002 Read `benchmark/baseline/skill-benchmark-report.{json,md}` and `benchmark/after-009/report.{json,md}` in full to capture existing scenario ids, dimension scores, and known measurement gaps (`benchmark/baseline/`, `benchmark/after-009/`).
- [ ] T003 Read `benchmark/README.md` to confirm the append-only baseline convention and the exact rerun command shape (`benchmark/README.md`).
- [ ] T004 [P] Build the change-surface inventory: for each Phases 006-011 file-list entry, classify it as scenario-update, net-new-scenario, or no-benchmark-impact (inventory table, this packet's future revision).
- [ ] T005 [P] Read `advisor-probe.cjs` and `score-skill-benchmark.cjs` in full, confirming `probeAdvisor`'s ranked `recommendations` array and `scoreD1Inter`'s current return shape (`score`, `rank`, `topSkill`) (`advisor-probe.cjs`, `score-skill-benchmark.cjs`).
- [ ] T006 Inventory the live `procedures/` folder count and names per mode to anchor the procedure-card-selection scenario count against actual cards, not this packet's static estimate (five `design-*/procedures/` folders).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Battery Expansion and Harness Extension

- [ ] T007 Update existing `manual_testing_playbook` category scenarios (01 through 06) for every Phases 006-011 change identified in T004 (`manual_testing_playbook/01--*` through `06--*`).
- [ ] T008 Create `manual_testing_playbook/07--procedure-card-selection/` with one scenario per active procedure card, each proving router-mode and live-mode selection by trigger (new category `07`).
- [ ] T009 Create `manual_testing_playbook/08--advisor-confidence-battery/` with at least 40 prompts distinct from mode-routing scenarios, covering plausible neighbor-skill ambiguity for `sk-design` (new category `08`).
- [ ] T010 Update `manual_testing_playbook/manual_testing_playbook.md` root index with the new categories, scenario ids, and total count (`manual_testing_playbook.md`).
- [ ] T011 [P] Extend `advisor-probe.cjs`'s `scoreD1Inter` to compute `topConfidence` (`recs[0].confidence`) and `gapToSecond` (`recs[0].confidence - recs[1].confidence`, or `null`/N/A when no second candidate exists) (`advisor-probe.cjs`) {deps: T005}.
- [ ] T012 [P] Thread `topConfidence` and `gapToSecond` through `score-skill-benchmark.cjs`'s `dims.d1inter` object without removing or renaming `score`, `rank`, or `topSkill` (`score-skill-benchmark.cjs`) {deps: T011}.
- [ ] T013 Update `build-report.cjs`'s rendering to add a confidence/gap-to-second table alongside the existing dimension-scores table, keeping it advisory unless the decision record promotes it into the gate (`build-report.cjs`) {deps: T012}.
- [ ] T014 Confirm the extension does not touch `skill_advisor.py` or any other `system-skill-advisor` scoring source (boundary review, T011-T013).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Rigorous Benchmark Run and Numeric Gate

- [ ] T015 Run the expanded battery in router mode and capture `benchmark/after-011/report.json` and `report.md` (`run-skill-benchmark.cjs --trace-mode router`) {deps: T007, T008, T009, T012}.
- [ ] T016 Run the expanded battery in live mode and capture `benchmark/after-011-live/report.json` and `report.md`, including D1-inter, advisor confidence, gap-to-second, and browser-class scenarios (`run-skill-benchmark.cjs --trace-mode live`) {deps: T015}.
- [ ] T017 Build a per-scenario router-vs-live reconciliation table; document any divergence as a routing risk rather than an averaged score (release report draft) {deps: T015, T016}.
- [x] T018 Compare the fresh run's D1 intra/inter, D2, D5, advisor confidence, gap-to-second, and procedure-card selection scores against the numeric floors in `decision-record.md` ADR-001 (gate comparison table) {deps: T017}. **Evidence**: performed against the existing `benchmark/after-012-routing-rigor/report.json` (no fresh `after-011` run exists); see `decision-record.md` ADR-001 "Actual Result Against the Real Existing Report" table for the full per-floor comparison. T015-T017 (fresh router/live runs and reconciliation table) remain not executed.
- [x] T019 Invoke the remediation loop (`decision-record.md` ADR-002) for any scenario or dimension below its floor; re-run only the affected scope and record the outcome {deps: T018}. **Evidence**: not triggered — nothing that was actually scored (D1 intra, D2, D5) fell below its floor. The unscored dimensions (D1 inter, advisor confidence, gap-to-second, procedure-card selection) are handled via ADR-002 outcome (b) / ADR-003's accepted-risk descope, not a remediation fix.
- [x] T020 Run strict spec validation for the Phase 012 packet and record the exit code (`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase-root> --strict`). **Evidence**: run after all content edits and metadata regeneration in this reconciliation pass; exit code recorded in `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Baseline Promotion and Handoff

- [ ] T021 Obtain explicit release-owner confirmation that Phases 006-011 are complete and the rigorous pass meets its floors, or has documented accepted risk (release-owner sign-off record) {deps: T018, T019}.
- [ ] T022 Promote the passing run to `benchmark/baseline-post-011/skill-benchmark-report.{json,md}` as a new, appended sibling folder; do not overwrite `benchmark/baseline/` or `benchmark/after-009/` (`benchmark/baseline-post-011/`) {deps: T021}.
- [ ] T023 Update `benchmark/README.md` with the new corpus size, new confidence/gap-to-second metrics, and the new baseline pointer (`benchmark/README.md`) {deps: T022}.
- [x] T024 Update this phase's `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` with final evidence, and add `implementation-summary.md` (phase docs) {deps: T020, T022}. **Evidence**: all five docs reconciled and `implementation-summary.md` created in this pass, against the accepted existing evidence per ADR-003 (T022's `baseline-post-011/` promotion was not performed).
- [x] T025 Record Phase 013 handoff notes in `implementation-summary.md` (next-safe-action and remaining risks) {deps: T024}. **Evidence**: `implementation-summary.md` Follow-Up Items names Phase 013 as the next safe action and lists the descoped expanded-battery work as an open item.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements in `spec.md` are satisfied (`spec.md` REQ-001 through REQ-010, checked against the real report and the ADR-003 descope decision).
- [ ] All tasks required for audit, battery expansion, harness extension, rigorous run, and baseline promotion are marked `[x]` with evidence. **Not met by design**: T001-T019 (except T018/T019, resolved via the existing-evidence comparison) and T021-T023 remain not executed; see `decision-record.md` ADR-003 for the accepted descope.
- [x] No `[B]` blocked tasks remain (T019 unblocks once a rigorous run exists to evaluate). **Met**: T019 is resolved as not-triggered (nothing scored fell below its floor), not left blocked.
- [x] Strict validation passes for the phase packet or produces only the accepted dirty-tree freshness warning described in the user scope.
- [x] `implementation-summary.md` records final status, evidence, and known limitations once implementation completes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
