---
title: "Implementation Summary: reclaim the DeepSeek-direct models"
description: "What shipped in this phase, the evidence behind each claim, and what was left undone or unverified."
trigger_phrases:
  - "implementation summary"
  - "phase outcome"
  - "verification evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/001-reclaim-deepseek-direct-ownership"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded the shipped outcome and its evidence"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-001-reclaim-deepseek-direct-ownership"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: reclaim the DeepSeek-direct models

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Status** | Complete |
| **Completed** | 2026-09-08 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deleted `isDeepPiOwned` from `.pi/extensions/pi-cache-optimizer/index.ts` (it sat at line 1462),
its export from the test-internals block, and its six early-return call sites in `session_start`,
`model_select`, `before_agent_start`, `before_provider_request`, `after_provider_response` and
`message_end`. Removed `.pi/extensions/shared/deepseek-ownership.json`,
`.pi/extensions/shared/composition/one-owner.ts` and both `ownership-composition.test.ts` files,
which existed only to prove a duplicated allowlist had not drifted. Removed `extensions/deep-pi`
from the `packages` array in `.pi/settings.json` in the same change, so the flip was atomic.
`isDeepSeekLikeModel` was left untouched; it is a different, broader predicate driving proxy
compat warnings.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One change, because the halves are unsafe apart: dropping the predicate alone makes both
extensions act on the same request, and unloading the sibling alone leaves those two models handled
by neither.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**The flip is atomic.** Ownership moved from one extension to the other with no window in which
both act or neither does.

**The shared machinery went with the split it policed.** A grep confirmed only the two composition
tests imported the fixture and helper before either was deleted.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Extension suite | `npm --prefix .pi/extensions/pi-cache-optimizer run check` exit 0, 40/40, tsc clean |
| Residue | `isDeepPiOwned` absent outside historical records |
| Enabled packages | 11 -> 10, `deep-pi` gone, other entries byte-intact |
| Live Pi session | Loads with zero extension-load failures; the retired extension no longer loads |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The dispatched executor edited `.opencode/scripts/vendored-fork-provenance.json`, outside the
frozen scope, and flagged it. Verified afterwards: three READMEs existed at HEAD but were missing
from the recorded file list, so that baseline was already stale. The re-record is legitimate, but it
folds a pre-existing drift and this change into one hash, so the earlier drift is no longer
separately visible. Separately, the provenance script reports drift but returns exit 0 in every
case; the non-zero path is inside its catch block. It is a report, not a gate.
<!-- /ANCHOR:limitations -->
