---
title: "Verification Checklist: Phase 1 handoff-contract"
description: "Evidence checklist for the strict fork-owned fast-mode handoff environment contract."
trigger_phrases:
  - "handoff-contract checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff/001-handoff-contract"
    last_updated_at: "2026-08-16T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Verified handoff contract checklist; all items evidenced"
    next_safe_action: "Continue the 002-subagent-handoff workstream"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Phase 1 handoff-contract

<!-- ANCHOR:protocol -->
## Verification Protocol

- [x] CHK-401 [P1] Record the strict-parser probe command, exit status, and relevant output. — `npm test` ran `tests/handoff.test.ts`; 76 tests passed, exit 0
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:contract -->
## Contract

- [x] CHK-402 [P0] Only `"1"` and `"0"` carry a preference; the parser maps `"1"` → true and `"0"` → false. — `readHandoff` maps `"1"`->true, `"0"`->false in `src/handoff.ts`
- [x] CHK-403 [P0] Invalid or unset input parses to `undefined` (no opinion) and never enables a paid priority tier by accident. — `readHandoff` returns undefined for unset/invalid; `tests/handoff.test.ts` green
- [x] CHK-404 [P1] `writeHandoff` emits the exact normalized `"1"`/`"0"` string for both boolean inputs. — `writeHandoff` sets exact `"1"`/`"0"`; asserted in `tests/handoff.test.ts`
<!-- /ANCHOR:contract -->

<!-- ANCHOR:namespace -->
## Namespace

- [x] CHK-405 [P1] The environment variable is named `PI_FAST_MODE_W_SUBAGENT_SUPPORT`. — `HANDOFF_ENV = "PI_FAST_MODE_W_SUBAGENT_SUPPORT"` in `src/types.ts`
- [x] CHK-406 [P1] The collision grep over `PI_*` names (installed packages, pinned sources, user `.pi`) is clean; no `PI_FAST_MODE*` exists. — `rg` over `PI_*` clean; no prior `PI_FAST_MODE*` name
<!-- /ANCHOR:namespace -->

<!-- ANCHOR:policy -->
## Policy

- [x] CHK-407 [P1] The parent-only-writer rule is documented in this leaf; lifecycle wiring is deferred to `002-session-precedence`. — POLICY documented in `plan.md`; wiring lives in `002-session-precedence`
<!-- /ANCHOR:policy -->

<!-- ANCHOR:scope -->
## Scope

- [x] CHK-408 [P1] The handoff module carries no provider-payload responsibility. — `src/handoff.ts` exports only `readHandoff`/`writeHandoff`; no provider payload
- [x] CHK-409 [P1] No lifecycle hook wiring or child-process spawning happens in this leaf. — `src/handoff.ts` is pure; no `session_start` or spawn code here
<!-- /ANCHOR:scope -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-410 [P1] `tests/handoff.test.ts` covers `"1"`, `"0"`, unset, and invalid inputs (`"true"`, `"2"`, `""`) and passes under raw-TS Vitest. — `tests/handoff.test.ts` covers all cases; `npm test` 76 passed
- [x] CHK-411 [P1] `npm run typecheck` exits 0. — `npm run typecheck` exit 0
<!-- /ANCHOR:testing -->

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-412 [P1] Handoff criteria to `002-session-precedence` are met with evidence recorded here. — parse matrix and ownership recorded; `002-session-precedence` unblocked
<!-- /ANCHOR:summary -->
