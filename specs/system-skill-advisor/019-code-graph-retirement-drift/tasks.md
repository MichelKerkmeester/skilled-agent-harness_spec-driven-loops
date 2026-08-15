---
title: "Tasks: Code-Graph Retirement Test Drift"
description: "Task breakdown for the scorer null-id hardening and suite triage."
trigger_phrases:
  - "code-graph retirement drift tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/019-code-graph-retirement-drift"
    last_updated_at: "2026-08-15T14:37:23Z"
    last_updated_by: "claude-code"
    recent_action: "Scorer null-id crash fixed via SOL-HIGH; remaining suite failures triaged"
    next_safe_action: "Owner decision on the unrelated drift and the corpus-authoring subset"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Code-Graph Retirement Test Drift

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

- [x] T001 Capture the baseline suite: `36 failed | 839 passed | 7 skipped`
- [x] T002 Create the Gate-3 packet `019-code-graph-retirement-drift` and write the guardrailed cli-codex dispatch prompt
- [x] T003 Verify codex availability + ChatGPT OAuth: `command -v codex` present, `codex login status` logged in
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Dispatch GPT-5.6 SOL HIGH (`--model gpt-5.6-sol` high fast) scope-locked to `system-skill-advisor`
- [x] T005 Guard `skillNameVariants` for null/blank id (`lib/scorer/text.ts`)
- [x] T006 Skip malformed projection entries in the explicit lane and at the fusion boundary (`lib/scorer/lanes/explicit.ts`, `lib/scorer/fusion.ts`)
- [x] T007 Skip unlabeled corpus rows in the holdout builder (`scripts/routing-accuracy/build-holdout.mjs`); regenerate `holdout-prompts.jsonl` byte-stable
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Review the diff: 4 source files, `git diff` shows no test/baseline/gate edit
- [x] T009 Re-run focused suite: `tests/scorer/` + `state-containment` = `5 failed | 141 passed`; the 4 crash tests are green; typecheck exit 0
- [x] T010 Triage the residuals: `bm25-lexical-shadow` (corpus authoring), `executor-delegation` (unrelated CLI-hub), `lane-weight-sweep` (harness), plus parity/legacy/launcher/daemon as unrelated drift
- [x] T011 `validate.sh --strict` exits clean on this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Crash cluster green; scorer robust to malformed projections
- [x] No gate weakened; diff is source guards only
- [x] Residual failures triaged and left to their owners / an operator decision
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
