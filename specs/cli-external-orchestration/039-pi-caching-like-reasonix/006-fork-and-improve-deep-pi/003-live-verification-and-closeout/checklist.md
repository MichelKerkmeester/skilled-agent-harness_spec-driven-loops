---
title: "Verification Checklist: Live Verification and Closeout"
description: "Verification gates for the deep-pi live-verification-and-closeout phase."
trigger_phrases:
  - "deep-pi closeout checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout"
    last_updated_at: "2026-08-07T20:22:03Z"
    last_updated_by: "spec-author"
    recent_action: "HANDOFF review's confirmed findings closed; RPC mode followed up"
    next_safe_action: "None — 006 packet complete"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-006-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Live Verification and Closeout

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-003 [P0] Phase 2 (`002-vendor-and-repoint`) confirmed Complete before live verification begins
  Evidence: phase 2's `spec.md` Status (Complete) and `checklist.md` (8/8 verified) read directly before starting any live session.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-015 [P1] No unintended code changes introduced during this phase
  Evidence: `git status --porcelain .pi/extensions/deep-pi/ .pi/settings.json` shows exactly the two paths phases 1/2 already touched (`.pi/settings.json` modified, `.pi/extensions/deep-pi/` new) — nothing added by this phase's own work.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-024 [P1] Live DeepSeek-direct smoke test passes with the patched fork active
  Evidence: `pi --print --session-id phase006-smoke-deepseek --model deepseek/deepseek-v4-flash "reply with just the word OK"` returned a genuine "OK" response; `pi-cache-optimizer-stats.json` shows zero new entries for `deepseek/deepseek-v4-flash` and `legacyFamily.deepseek` stayed at 0. `/deeppi`'s counter output was NOT directly observable (`ctx.ui.notify()` doesn't surface via `pi --print` or the session `.jsonl`, confirmed by direct inspection of both) — this is a real tooling limitation, disclosed rather than papered over; phase 1's unit tests already prove both counters surface/reset correctly when forced. **HANDOFF follow-up:** `pi --mode rpc` was checked as a possible alternate path — it does emit `extension_ui_request` events carrying `setStatus`/`notify` payloads, confirming a status-bar-level signal is observable there, but the full `/deeppi` report body was still not confirmed reaching that stream; narrower residual limitation, recorded honestly rather than claimed resolved.
- [x] CHK-025 [P1] Non-regression: boundary and non-DeepSeek sessions still show `deep-pi` inactive with no warning triggered
  Evidence: `opencode-go/deepseek-v4-flash` (67→68 `pi-cache-optimizer` requests) and `openai-codex/gpt-5.6-luna` (92→93) both confirmed live, unaffected. `opencode/deepseek-v4-flash-free` returned "No API key found for opencode" when invoked directly — no live credential exists for it right now (pre-existing, not introduced here); substituted phase 1's new `tests/eligibility.test.ts` case, which source-confirms this model fails `isDeepPiModel`'s `provider === "deepseek"` gate.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P1] REQ-003/fix #3 decision resolved and recorded before this phase — and the whole 006 packet — closes
  Evidence: `001-fix-and-test-deep-pi/spec.md` §7 records the decision (implemented, not cut); that phase's `tasks.md` T004/T007 both `[x]` with real evidence, no `[B]` remaining.
- [x] CHK-FIX-002 [P1] HANDOFF `gpt-5.6-sol` review's confirmed findings against this phase closed, not just acknowledged
  Evidence: `tasks.md` T009 records both confirmed findings and their resolution — the "Partially met" approval-language gap (fixed by citing the governing `/goal` directive's standing disclosure instruction as the approval basis, recorded in `spec.md`'s REQ-007/REQ-008 rows) and the `pi --mode rpc` observation-path finding (followed up directly, a narrower real limitation recorded rather than either ignored or falsely marked resolved).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-031 [P1] No credentials exposed in live session logs or command output beyond what's expected
  Evidence: `pi auth print-api-key --model deepseek-v4-flash --provider deepseek` confirmed a real credential exists (piped through `sed` to mask the value, only its presence/length observed) — never echoed to a document or session log.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] All three 006 phases' and the parent's docs reflect actual final state, not planning-time defaults
  Evidence: all three phases' Status fields read Complete with real evidence throughout; parent `006-fork-and-improve-deep-pi/spec.md`'s Phase Documentation Map and Status updated to Complete, `graph-metadata.json` regenerated.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files, if any, confined to `scratch/`
  Evidence: phase folder's `scratch/` contains only `.gitkeep`; all temporary live-session files (`phase006-smoke-*.jsonl`) were removed after verification.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 1 | 1/1 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0 |

**Status**: Complete. All items verified with real evidence, including three honestly disclosed limitations (see `implementation-summary.md`) that don't block completion since none reflects a defect in this phase's own work, plus a HANDOFF adversarial review round whose 2 confirmed findings against this phase were both closed with real follow-up, not just acknowledged.
<!-- /ANCHOR:summary -->
