---
title: "Implementation Summary"
description: "The committed trigger-index manifest now lists the same skipped paths whether or not the checkout is installed and built, so regenerations stop flipping entries by machine."
trigger_phrases:
  - "implementation summary"
  - "corpus manifest build state"
  - "walker skip list evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/056-corpus-manifest-build-state"
    last_updated_at: "2026-09-23T20:14:39Z"
    last_updated_by: "generate-context"
    recent_action: "Made the corpus skip list independent of build state"
    next_safe_action: "Continue with the continuity reader phase"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0267cbd904d315b35bea10ec626880e3c070cb50d9302c107feca32df06d8201"
      session_id: "scaffold-056-corpus-manifest-build-state"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 056-corpus-manifest-build-state |
| **Completed** | 2026-09-23 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Regenerating the trigger index no longer rewrites skip entries depending on who ran it. The walker's skip list is now a function of the tracked tree: the same commit gives the same `skippedPaths` in a fresh checkout and in one that has been installed and built.

### A skip list that ignores build state

`node_modules` and `dist` are still pruned, but no longer listed, since whether they exist says nothing about the tree and the manifest's exclusion list already records the rule. A link is resolved only when its name ends in `.md`; any other link is recorded as "symlink not followed" without looking at its target, so a tracked link into build output reads the same whether the output exists or not. A broken link to a document is still reported as a broken symlink.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | Modified | Build-output directories pruned without a skip entry; one fixed reason for non-document links |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts` | Modified | Build-state test; the linked-directory case expects the new reason |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and the three retrieval fixtures | Regenerated | Committed index and manifest under the new rule |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The drift was measured first by comparing a built checkout's skip list with the committed one. The fix was then checked on the real repository: a `git archive` extract of HEAD, which has never been installed or built, walked to the same skip list as this built checkout apart from one untracked folder this phase added. The same comparison under the previous walker differed by 9 entries one way and at least 15 the other.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record non-document links without reading their target | Any reason read from the target depends on whether the build has run; a fixed reason cannot |
| Keep pruning build output, only stop listing it | The pruning policy is right and already recorded in `EXCLUSIONS`; only the listing was machine-specific |
| Leave `retrofit-convention.mjs` alone | Its walker writes a frozen per-run artifact, not a committed fixture that is regenerated |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Walker and retrieval suites (`trigger-index`, `retrieval-coverage-parity`, `retrieval-repo-root`, `dist-freshness-walker`) | PASS, 75 of 75 |
| New build-state test against the previous walker | FAIL, as intended |
| Real repository, built checkout against an unbuilt extract of HEAD | Identical apart from this phase's new untracked `scratch` folder |
| `validate.sh --strict` on this phase | PASS, `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The first regeneration rewrites many entries at once.** Every non-document link now appears under the new reason, a one-time change to a diagnostic list that `manifestHash` does not cover.
<!-- /ANCHOR:limitations -->

---
