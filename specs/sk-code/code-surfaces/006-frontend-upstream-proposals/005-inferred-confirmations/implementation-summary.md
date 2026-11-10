---
title: "Implementation Summary"
description: "Ranks 10 to 12 were confirmed and fixed, each in its own commit with a test that fails without it; rank 13 was refuted and dropped."
trigger_phrases:
  - "inferred confirmations implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/006-frontend-upstream-proposals/005-inferred-confirmations"
    last_updated_at: "2026-11-03T13:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Shipped ranks 10 to 12 and dropped rank 13"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-inferred-confirmations |
| **Completed** | 2026-11-03 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The stage-two leaf replay now reads `INTENT_MODEL` routers and tuple weights, so the fundamentals control prompt resolves `DIAGNOSE` where it resolved nothing. Every hub matcher treats a hyphen and a space alike. The trigger-index generator warns when it is about to index another checkout than the caller's.

### Phase 5: inferred-confirmations

Each rank opened with a saved run. Ranks 10 and 11 were confirmed, rank 12 half confirmed and rank 13 refuted, as `decision-record.md` records. Rank 13 changed no file.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-create-skill/scripts/leaf-route-replay.cjs` | Modified | Reads `INTENT_MODEL` and tuple weights; folds hyphens in `keywordHits` |
| `sk-create-skill/scripts/tests/leaf-route-replay.test.cjs` | Modified | Three tests for those fixes |
| Five hub routers, two policy cards, the compiler's `evaluator.cjs` and `projections.cjs` (authored and served copies) | Modified | Fold hyphen runs to one space on both sides |
| `.skilled/bin/tests/compiled-route-hyphen-parity.test.cjs` | Created | Spaced and hyphenated keywords route alike on every default-on hub |
| `system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Modified | Warns on a root mismatch |
| `system-spec-kit/runtime/cli/tests/trigger-index-root-mismatch.vitest.ts` | Created | Warning and no-warning cases |
| `sk-create-skill/changelog/v1.10.1.0.md`, `SKILL.md` | Created, modified | Records ranks 10 and 11 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The four confirming runs were saved first. DeepSeek V4.1 Flash max built each fix from its own brief, and each was checked in this session and committed alone: `a71daa9605`, `8babc9421a` and `2823435107`. Each fix was then reverted with its tests kept, and the tests failed until it was restored. Rank 11 also ran reach on every hub and a sync publication that was finalized after the gates passed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Normalise hyphens in every matcher | The operator wanted every hub to treat hyphen and space alike, not sk-code only |
| Warn rather than change the trigger-index default | Every existing caller keeps today's root |
| Drop rank 13 | No save scores a payload 0; the metadata-only write is documented plan-only behaviour |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Revert tests | Rank 10: 2 fail reverted, 24/24 restored. Rank 11: 3 fail, 27/27. Rank 12: 1 fail, 3/3 |
| Reach, every hub, concurrency 2 | `outranked=0`, `wrong-hub=0`, `RESULT: PASSED`, same counts as before |
| sk-create-skill tests | 100/100 |
| Trigger-index vitest | 70/70 across three files |
| Compiled-route tests | Every file exits 0 except the admission gold-corpus pin, `84 !== 96`, which fails the same at merge-base `a5105fb512` |
| Hub status | All seven `compiled-serving` and `fresh`; 55 served copies match |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The rank 12 warning does not change the default.** A linked project still indexes the source checkout unless it passes `--repo-root`, which the warning names.
2. **A tie in sk-design's canary router throws.** `compareText is not defined` at `009-sk-design/lib/canary-router.cjs:257` when two intents of one mode tie; routing falls back to legacy. It predates this phase and is not fixed here.
3. **The system-spec-kit changelog entry for rank 12 is deferred** until merge, because main already holds the next version numbers.
<!-- /ANCHOR:limitations -->

---
