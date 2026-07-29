---
title: "Implementation Summary: Silent Test Discovery"
description: "Discovery runner and pre-push gate for the thirty-seven silently unrun test files."
trigger_phrases:
  - "silent test discovery docs"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-silent-test-discovery"
    last_updated_at: "2026-07-28T08:20:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Built the runner and wired the report-only pre-push gate"
    next_safe_action: "Spec-kit repairs completion-state; then flip the gate to enforce"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-28-speckit-032"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Silent Test Discovery

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 032-silent-test-discovery |
| **Completed** | 2026-07-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A discovery runner and a pre-push gate for the thirty-seven test files nothing ran. The count itself was the first finding: the gap was known from three instances met one at a time, and enumerating it revealed an order of magnitude more.

What the silence hid, now on the record:

1. **One live suite is genuinely broken.** `completion-state.test.mjs` fails 9 of 65 tests under its own dialect. It passed as evidence of coverage for as long as nothing ran it.
2. **Two files are unrunnable under the harness their extension promises.** `dispatch-audit.test.mjs` and `completion-state.test.mjs` import vitest but wear the `.test.mjs` convention, and sit outside the sole vitest config's glob — doubly silent.
3. **The other thirty-five files are green**: 409 tests, 0 failures, once something finally hosted them.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/scripts/run-node-tests.mjs` | Created | Discovery, dialect partition, honest exits |
| `.opencode/scripts/git-hooks/pre-push` | Modified | Third gate, report-only default |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The full 49-second run was taken first and its 27 failures decomposed by cause before any design: most were vendored third-party suites under the spec tree failing for their own environmental reasons, eight were worktree-only dist gaps, and the residue was the two dialect mismatches and one genuinely rotted suite. Scope followed from that decomposition rather than preceding it.

The gate defaults to report-only on a deliberate blast-radius judgement: enforcing on day one would block every session's pushes on another surface's pre-existing rot. The failure is surfaced on every push instead, with enforcement one flag away once it is fixed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Partition by import, not filename | The extension lies twice in this codebase already |
| Exclude the spec tree wholesale | Vendored and archived suites fail for reasons that say nothing about the runtime |
| Report-only default | Blocking all pushes on pre-existing rot is hostage-taking |
| SKIPPED counts as failure when vitest is missing | Re-hiding the silence would recreate the defect being fixed |
| Do not fix completion-state here | Another surface's failing suite needs its owner's judgement, not a drive-by patch |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Discovery | 37 files: 35 node:test, 2 vitest |
| node:test half | PASS — 409 tests, 0 failures on the main tree |
| vitest half surfaced, not crashed | PASS — 56 pass / 9 fail reported, runner exit 1 |
| False-green refusals | PASS — empty discovery and unparseable summaries exit 2 |
| Pre-push syntax | PASS — `bash -n` clean |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The gate is report-only until completion-state is repaired.** That repair belongs to spec-kit; the open question tracks it.
2. **Worktrees without built dist fail eight suites environmentally.** The gate should run from a built tree; the failures name missing artifacts, not broken logic.
3. **~50 seconds per push.** Accepted for the outward boundary; the skip flag exists for iteration.
4. **Vitest-dialect discovery beyond these two files is by import-grep**, which would miss an exotic re-export. None exists today.
<!-- /ANCHOR:limitations -->
