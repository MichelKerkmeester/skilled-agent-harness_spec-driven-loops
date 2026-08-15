---
title: "Tasks: Advisor Suite Drift Reconciliation"
description: "Task breakdown for the guardrailed LUNA-MAX suite-drift reconciliation."
trigger_phrases:
  - "advisor suite drift tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/021-advisor-suite-drift-reconciliation"
    last_updated_at: "2026-08-15T17:14:48Z"
    last_updated_by: "claude-code"
    recent_action: "LUNA-MAX reconciled 6 clusters; default suite 40->4 failures; diff reviewed clean"
    next_safe_action: "Owner decision on the 4 residual reds (2 real regressions, corpus floor, env)"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Advisor Suite Drift Reconciliation

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Capture the baseline (`40 failed / 827 passed`) and categorize the six clusters
- [x] T002 Create the Gate-3 packet `021-advisor-suite-drift-reconciliation` and write the guardrailed cli-codex dispatch prompt
- [x] T003 Verify codex OAuth: `codex login status` logged in
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Dispatch GPT-5.6 LUNA MAX (`--model gpt-5.6-luna` max fast) scope-locked to `system-skill-advisor`
- [x] T005 Reconcile: regenerate baselines (`capture-scorer-eval-baseline.mjs`, new `capture-local-native-divergence-ledger.mjs`), update corpus, sync TS+Python skill-list copies, re-point retired-skill vocabulary to `mcp-tooling`, update launcher/hook fixtures
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Red-flag scan: no `.skip`/`.todo` added, no leak assertion removed, no floor/threshold lowered
- [x] T007 Source-diff review: scorer changes are pure renames with `weights preserved`; `deep-improvement` removal makes Python agree with TS
- [x] T008 Full suite re-run: `40 failed -> 4 failed` (871 passed); `tsc --noEmit` exit 0; `node_modules` intact
- [x] T009 Confirm the 4 residual reds (`advisor-validate`, `cli-parity`, `manual-testing-playbook`) are real regressions / corpus-floor / env, not masking
- [x] T010 `validate.sh --strict` exits clean on this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Reconcilable subset green (`40 -> 4`); no gate weakened
- [x] Every baseline/test/fixture edit reviewed clean
- [x] Residual reds documented and left to their owners
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
