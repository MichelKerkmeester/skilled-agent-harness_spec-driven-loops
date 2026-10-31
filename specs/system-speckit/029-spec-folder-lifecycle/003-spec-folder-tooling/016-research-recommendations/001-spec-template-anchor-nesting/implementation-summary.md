---
title: "Implementation Summary"
description: "Spec template anchor nesting is built: the questions anchor now wraps only the questions, the golden test asserts anchor order, and the suite is green."
trigger_phrases:
  - "spec template anchor nesting implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/001-spec-template-anchor-nesting"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built, reviewed and verified the phase"
    next_safe_action: "Commit with wave 1"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/templates/core/spec.md.tmpl"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-spec-template-anchor-nesting"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-spec-template-anchor-nesting |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is **complete**. Built in wave 1, reviewed once by Luna, and verified by the orchestrator. The questions anchor in the spec.md template now wraps only the questions, so the NFR, edge-cases and complexity sections are no longer nested inside it and anchor-based retrieval and merges see them again for every new scaffold.

### Phase 1: spec-template-anchor-nesting

- **Template.** The unconditional `questions` opener that sat at old line 184, before the L2 and L3 NFR, edge-cases and complexity blocks, is gone. One opener now sits directly above each level's OPEN QUESTIONS heading, inside that level's conditional: line 302 for L2, 307 for L1, 390 for L3+ and 394 for L3.
- **Closers.** The L3+ closer moved from after RELATED DOCUMENTS to directly after Question 1 (line 401), so RELATED DOCUMENTS now sits outside the anchor. The L1, L2 and L3 closer was not moved: at old line 399 it already sat directly after Question 2, so only those levels' opener needed to move (it is now line 405).
- **Test.** `scaffold-golden-snapshots.vitest.ts` gained one helper, `expectAnchorsWellOrdered`. It tracks the open anchor, fails on an anchor opened inside another, on a closer with no matching opener and on an unclosed anchor, and skips fenced code. It runs on the spec.md of L1, L2, L3 and L3+, the phase-parent spec and the review and research spec templates.
- **Snapshots.** The `2-spec.md`, `3-spec.md` and `3+-spec.md` entries were regenerated and the diff is only the opener and closer moving. A new `review-spec.md` entry was added in review round 1. `1-spec.md` is unchanged because its opener already sat directly above the heading.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl` | Modify | Per-level openers above OPEN QUESTIONS, L3+ closer moved (+7/-4) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` | Modify | Anchor order helper, review spec template added to the render matrix (+40/-1) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Modify | Three regenerated entries and one new entry (+106/-6) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built in wave 1 against `goal.md`, then checked by running the new assertions against the old template (2 tests failed with named messages), rendering fresh scaffolds at every level with `create.sh`, and running the full suite.

### Review

One cross-family review round ran, by Luna.

| Finding | Class | Outcome |
|---------|-------|---------|
| P1: `review.spec.md.tmpl` was never rendered by the golden test | matrix/evidence | Fixed. The template is flat and needed no change, but it is now in the render matrix, its level marker check uses the level parameter, and it gets the anchor order assertion. The file passes (12 passed) and the snapshot gained a `review-spec.md` entry. |

The evidence records no second round. A cosmetic P2 was noted during the gate: removing the opener leaves a doubled blank line in the L2 and L3 renders. It was not applied because it is cosmetic only and changes no anchor.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move the anchor at the template level, not in individual packets | The template is the producer. Fixing it at the source means all new scaffolds inherit the fix |
| One opener per level, each directly above its heading | The four headings sit in separate level conditionals, so each one carries its own opener |
| Leave the L1, L2 and L3 closer where it was | It already sat directly after the last question, so the plan's move to just before RELATED DOCUMENTS was not needed for those levels. The L3+ closer was the one that wrapped RELATED DOCUMENTS and was moved |
| One shared test helper instead of per-level `assert` calls | The same check covers the four spec levels, the phase-parent spec and the review and research spec templates without repeating it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `scaffold-golden-snapshots.vitest.ts` | 12 passed, 3 snapshots updated (2, 3, 3+); re-run on 2026-10-08 in CI mode: 12 passed |
| New assertions against the old template | 2 tests failed ("2-spec.md: anchor nfr nested inside questions", "3+-spec.md: approval-workflow nested inside questions") |
| `create.sh` at L1, L2, L3 and L3+, then `validate.sh --strict` on each | RESULT: PASSED, Errors 0 for each; warnings were the SPEC_DOC_SUFFICIENCY placeholder and, at L3, AI_PROTOCOLS |
| Node anchor stack check on those four renders | Nesting none, unclosed anchors none, for each |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` | rc 0; 162 files passed and 3 skipped; 1648 tests passed and 19 skipped, 0 failed. Baseline at `c85ec7f880`: 161 files, 1639 passed |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` | rc 0 |
| CLI typecheck and build | rc 0 and rc 0 |
| `node --test runtime/tests/hooks/*.test.mjs` | 184 tests, 181 pass, 0 fail |
| `validate.sh --strict` on this folder | RESULT: PASSED |

The suite figures are the wave 1 final gate, so they cover every wave 1 phase, not this one alone.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **549 existing spec.md files carry the old layout.** The un-nesting of those documents is handled by phase 11 (SH-11, anchor-repair-mode), which depends on this phase's fixed template.
2. **Doubled blank line in the L2 and L3 renders.** Removing the opener leaves one extra blank line. It is cosmetic and was left unchanged.
3. **Evidence is pinned to the working tree.** The phase is uncommitted, so its diff range is the working tree against `c85ec7f880`. Re-pin to the wave 1 commit SHA after the commit.
<!-- /ANCHOR:limitations -->

---
