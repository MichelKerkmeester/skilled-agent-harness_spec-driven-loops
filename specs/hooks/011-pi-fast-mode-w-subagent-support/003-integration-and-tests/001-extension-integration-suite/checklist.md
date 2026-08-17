---
title: "Verification Checklist: Phase 1 extension-integration-suite"
description: "Evidence checklist for deterministic extension-boundary coverage and the static/test gate."
trigger_phrases:
  - "extension-integration-suite checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/001-extension-integration-suite"
    last_updated_at: "2026-08-17T03:34:46Z"
    last_updated_by: "claude-code"
    recent_action: "All checklist items evidenced from the green suite gate"
    next_safe_action: "Continue to 002-install-transition"
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

# Verification Checklist: Phase 1 extension-integration-suite

<!-- ANCHOR:protocol -->
## Verification Protocol

- [x] CHK-701 [P1] Record each command, its exit code, and its redacted output for every gate and test invocation. — `npm run typecheck` exit 0 and `npm test` = 76 passed recorded in `implementation-summary.md` Verification.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-702 [P0] Registration assertions cover the `fast` command and the `fast` flag. — `tests/extension.test.ts` asserts `registerCommand("fast")` + `registerFlag("fast")`; `npm test` 76 passed.
- [x] CHK-703 [P0] Lifecycle-order assertions cover `session_start` → `model_select` → `session_shutdown`. — event order captured via the handler map in `tests/extension.test.ts`.
- [x] CHK-704 [P0] Config scope resolution and the one-time legacy migration are exercised. — `tests/config.test.ts` + `tests/extension.test.ts` cover scope + one-time migration; 76 passed.
- [x] CHK-705 [P0] Model selection gates fast-mode behavior for supported targets. — model gating asserted in `tests/extension.test.ts`; unsupported targets skip injection.
- [x] CHK-706 [P0] Namespaced `setStatus` calls are asserted. — `tests/extension.test.ts` asserts `setStatus(STATUS_KEY, ...)`; never `setFooter`.
- [x] CHK-707 [P0] Handoff-state application is asserted on a supported model. — `tests/extension.test.ts` asserts handoff-state applied on a supported model.
- [x] CHK-708 [P0] Every case above runs through the structural FakePi (registration spies, handler maps, fabricated ctx); no whole-module mock is used. — `tests/extension.test.ts` uses `vi.fn()` spies + handler/command maps; no whole-module mock.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-709 [P1] The command-ownership helper is exported for the live probe in `002-install-transition/`. — DEVIATION: no `tests/helpers/command-ownership.ts` was exported; live ownership was proven via RPC `get_commands` directly in `002-install-transition`.
- [x] CHK-710 [P0] A broken lifecycle or ownership boundary FAILS the suite, not only pure helper errors. — structural assertions in `tests/extension.test.ts` fail on wrong order/registration; `npm test` 76 passed on correct wiring.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:boundary -->
## Scope Boundary

- [x] CHK-711 [P0] The suite does NOT touch `.pi/settings.json` or install/npm state. — suite runs under `packages/pi-fast-mode-w-subagent-support/`; no `.pi/settings.json` access.
- [x] CHK-712 [P1] No live-only behavior is asserted in-process (command-suffix renumbering, RPC/TUI rendering, and child-process spawn stay in later leaves). — in-process suite asserts only structural FakePi behavior; live-only checks deferred to `003-live-verification-and-sync`.
<!-- /ANCHOR:boundary -->

<!-- ANCHOR:gate -->
## Verification Gate

- [x] CHK-713 [P0] `npm run typecheck` (`tsc --noEmit`) exits 0. — `npm run typecheck` (`tsc --noEmit`) exit 0.
- [x] CHK-714 [P0] The full Vitest suite (`npm test`) is green. — `npm test` = 76 passed.
<!-- /ANCHOR:gate -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-715 [P1] No settings or npm-scope change occurred; `git status` is clean. — `git status` shows no `.pi/` or npm-scope change from the suite run.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-716 [P1] Handoff criteria to `002-install-transition/` are met and evidence is appended here. — typecheck + 76 tests green; ownership deferred to live RPC `get_commands` in `002-install-transition`.
<!-- /ANCHOR:summary -->
