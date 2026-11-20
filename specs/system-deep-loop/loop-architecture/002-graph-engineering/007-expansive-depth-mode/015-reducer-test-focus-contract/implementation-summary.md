---
title: "Implementation Summary"
description: "The spec-kit CLI deep-research reducer test now asserts the leaf-first Next Focus contract phase 004 shipped, so the Spec-Kit Check workflow passes on main again. The reducer is unchanged."
trigger_phrases:
  - "reducer test focus contract implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/015-reducer-test-focus-contract"
    last_updated_at: "2026-11-20T15:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Aligned three reducer tests"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-reducer.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-reducer-test-focus-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-reducer-test-focus-contract |
| **Completed** | 2026-11-20 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Spec-Kit Check workflow no longer fails on the deep-research reducer test. Three cases now assert the Next Focus chain the reducer has shipped since phase 004, and the reducer itself is unchanged.

### Phase 15: reducer-test-focus-contract

Phase 004 gave the leaf's `## Recommended Next Focus` a reader. When it is open and unresolved, it now outranks the carried-forward thread (`../004-focus-hijack-fix/spec.md` REQ-002). That phase updated the deep-loop runtime suites but not the spec-kit CLI copy of the reducer test, which kept three expectations from the older chain.

The idempotent-output case now expects the leaf recommendation `Question C`. The answer-seeded and first-question fallback cases set their second-iteration recommendation to the resolved `Question B`. The reducer skips a resolved recommendation, so both cases still reach the branch their names describe, keep their original assertions and also pin the resolved-skip rule. Removing the section alone would not do that, because the shared fixture's first iteration also recommends `Question C`, and the reducer takes the latest non-empty recommendation.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-reducer.vitest.ts` | Modified | Align three Next Focus cases with the leaf-first contract |
| `../spec.md` | Modified | Phase 15 row in the Phase Documentation Map |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The failure was reproduced in a fresh worktree on `origin/main`, then bisected: with the reducer and `continuity-thread.cjs` at the parent of the phase 004 commit the file passes 13 of 13, and at that commit it fails the same 3. After the edit, the reducer test file passed, then the full CLI vitest project ran from the workflow's directory, `.opencode/skills/system-spec-kit/runtime/cli`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Change the tests, not the reducer | Phase 004's spec states the leaf-first rule as a deliberate default-path change, so the old expectations describe behavior that was retired on purpose |
| Resolved `Question B` as the fixture recommendation, not deletion | Deleting the section lets the first iteration's `Question C` win, which would hide the two branches the cases are named for |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reducer test file, before | 3 failed, 10 passed (13) |
| Reducer test file, after | 13 passed (13) |
| Full CLI project, before (unsharded) | 3 failed, 2590 passed, 20 skipped (2613); a 4th file-level failure in `relocate-real-pipeline` came from editing this packet during the run and does not appear in CI |
| Full CLI project, after (unsharded) | 0 failed, 2593 passed, 20 skipped (2613); 209 files passed, 3 skipped; exit 0 |
| `validate.sh --strict` on this phase and the parent | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The CLI test duplicates runtime coverage.** The deep-loop runtime suite tests the same reducer, and only that suite was updated in phase 004. A future Next Focus change has to update both, or this file goes stale again.
<!-- /ANCHOR:limitations -->

---
