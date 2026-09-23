---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/028-restore-pi-advisor-brief"
    last_updated_at: "2026-09-22T07:25:00Z"
    last_updated_by: "implementing-agent"
    recent_action: "Implemented either-root probe and contribution-keyed dedup receipt; rebuilt; evidence below"
    next_safe_action: "Operator runs the interactive pi validation, then this worktree merges back"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts"
      - ".skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-implementation-2026-09-22"
      parent_session_id: null
    completion_pct: 90
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
| **Spec Folder** | 028-restore-pi-advisor-brief |
| **Completed** | 2026-09-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The pi skill advisor brief is back. Since the source-root migration every prompt silently lost its skill suggestion: the hook's warm-CLI probe still knocked on the old door, found nothing, and failed open in ~2 ms — you saw a bare directives line at best, usually nothing. Two small fixes changed that, and the very next prompt scores, cold-starts its advisor when needed, and answers.

### restore the pi skill advisor brief: probe either root name for the warm-CLI assets and key the directive dedup receipt on the full contribution

The warm-CLI fallback probe now accepts either root name — the renamed root first, the older-checkout root as fallback — and takes the advisor shim, the IPC-bridge companion and the default advisor database dir from the same found root, so a half-migrated checkout can never pair mismatched paths; the upward directory walk is unchanged. In the pi extension, the directive-dedup receipt now records the full delivered contribution (route head plus directives) instead of the directives alone, so when your recommended skill changes, the new recommendation actually reaches you; the always-full escape hatch and the session-start/compact resets behave exactly as before.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts | Modified | Either-root probe; all three paths from one found root |
| .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts | Modified | Dedup receipt keyed on the full delivered contribution |
| .skilled/skills/system-skill-advisor/runtime/dist/ (untracked) | Rebuilt | Compiled hook carries both fixes; dist freshness green |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All work happened in the local-only worktree `worktrees/059-restore-pi-advisor-brief` (no remote push, per the operator's decision), with this packet documenting it. After the two source edits the advisor package was rebuilt, so the compiled hook the pi extension imports in-process serves the fixed behavior immediately; nothing else (shim, CLI, daemon, skill graph) was touched. The documentation landed in this new packet under the system-skill-advisor track, as the operator chose.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Probe either root, but take all three paths from one found root | Either root proves the same repository, yet mixing a shim from one root with a bridge or database from another would quietly spawn a broken pair in a half-migrated checkout |
| Key the dedup receipt on the full contribution, not the directives | The directives block is constant, so keying on it alone would deliver a changed recommendation only once per session — exactly the "no suggestions" symptom this packet fixes |
| Leave the duplicated environment-alias expression untouched | It is harmless, and this packet's scope is the two behavioral fixes; noted for a later cleanup |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Stdin smoke of the compiled hook (after the fix) | PASS — `status: "ok"`, `freshness: "live"`, brief = `Advisor: live; use sk-doc 0.94/0.12 pass.` (warm 1141 ms, exit 0; the session's first call took 2431 ms = the one-time cold start). Before the fix: `fail_open`, freshness `unavailable`, 2 ms, "CLI_RETRYABLE_UNAVAILABLE exit 75: CLI assets missing", directives-only output |
| Worktree advisor status | PASS — `ok`, freshness `live`, generation 1, 21 skills, trustState `live` (the worktree's own database, scanned on first trust) |
| Package test battery (vitest) | PASS — 880 passed / 11 failed / 898 (150 s); the identical 11 failures reproduced on a stash-baseline of the same 8 files without the edits, so they pre-exist at the worktree's HEAD. Correction: this battery only includes `tests/**/*.vitest.ts` and never ran the Pi dedup suite (`.skilled/hooks/dispatch/pi/directive-dedup.test.ts`, run under `.skilled/hooks/vitest.config.ts`). That suite fails 8 of 15 tests against this packet's `prompt-advisor.ts` because the changed-contribution path returned nothing. Fixed in `system-skill-advisor/029-fix-remaining-advisor-defects` (see its `implementation-summary.md`) |
| Comment hygiene (both edited sources) | PASS — exit 0, zero violations |
| Strict packet validation (validate --strict) | PASS — RESULT: PASSED, Errors: 0, Warnings: 0 (validate.sh --strict, 2026-09-22) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fix lives in the worktree until it merges.** Your day-to-day pi in the main checkout keeps the old behavior until this branch merges back; the worktree copy is fully fixed and verified.
2. **First prompt after a cold advisor pays the once-per-checkout scan.** In the verification worktree that cost was 2431 ms, inside the hook's 2500 ms budget; later prompts are warm (1141 ms observed) because the advisor stays resident.
3. **Eleven pre-existing test failures elsewhere in the package.** They are proven identical with and without this change (see Verification) and are outside this packet's scope.
<!-- /ANCHOR:limitations -->
