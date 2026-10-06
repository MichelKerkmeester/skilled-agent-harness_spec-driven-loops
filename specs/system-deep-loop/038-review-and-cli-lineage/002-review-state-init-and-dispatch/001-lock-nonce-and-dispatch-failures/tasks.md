---
title: "Tasks: Phase 1: lock-nonce-and-dispatch-failures"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "lock nonce dispatch tasks"
  - "dispatch failed verifier tasks"
  - "event dir guard tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: lock-nonce-and-dispatch-failures

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

- [x] T001 Reproduce the lost failure event: on a scratch copy of a run directory a wrapper-written `dispatch_failure` line went from 1 to 0 after one gateway append (`projectionRefreshed:true`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Pass `--nonce {captured_acquire_nonce}` on every release and capture the nonce at acquire (`.skilled/commands/deep/assets/deep-review-{auto,confirm}.yaml`, `deep-ai-council-{auto,confirm}.yaml`)
- [x] T003 [P] Drop the unbound `$EVENT_DIR` loop and `rm -rf` from the review codex branch (`.skilled/commands/deep/assets/deep-review-auto.yaml`)
- [x] T004 [P] Report `dispatch_failed` from the completion receipt when the narrative is missing (`.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs`)
- [x] T005 [P] Keep an earlier attempt's receipts as `attempt-N` before a retry reuses the id (`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`)
- [x] T006 Name `dispatch_failed` in the verifier note of the review and research workflows, and recompile the review, research and ai-council contracts
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Each new or widened test fails on the pre-fix source and passes on the fix: lock release 5 failures before, 8/8 after; `EVENT_DIR` guard flags old line 1474, 11/11 after; verifier receipt case and receipt retry case 2 failures before, 37/37 after
- [x] T008 Live check on the 050 run: iteration 3 now reads `dispatch_failed dispatch review-i3-g1: cli-pi exited 143, after 899 s, at the 900 s executor timeout`, iteration 4 still passes
- [x] T009 Full deep-loop runtime suite: 169/169 files, 2839 passed, 8 skipped, 0 failed
- [x] T010 Spec-kit deep-review and deep-research contract tests: 24/24; render-command-contract 32/32 after recompiling
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source run**: See `specs/system-speckit/050-open-knowledge-format-adoption/review/review-report.md` §10
<!-- /ANCHOR:cross-refs -->

---
