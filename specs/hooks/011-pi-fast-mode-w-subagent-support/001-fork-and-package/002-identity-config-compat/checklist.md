---
title: "Verification Checklist: Phase 2 identity-config-compat"
description: "Evidence checklist for package identity, config compatibility, safe persistence, and request guards."
trigger_phrases:
  - "identity-config-compat checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/002-identity-config-compat"
    last_updated_at: "2026-08-16T14:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Verified identity/config/guards: tsc 0, 57 tests green (was 50)"
    next_safe_action: "Hand off to 003-package-baseline-gates"
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

# Verification Checklist: Phase 2 identity-config-compat

<!-- ANCHOR:protocol -->
## Verification Protocol

- [x] CHK-201 [P1] Record each command, exit code, and relevant output. — `tsc --noEmit`, `vitest run`, and `git diff` results recorded in `implementation-summary.md` Verification.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-202 [P1] `001-source-baseline/` handoff is present and unchanged. — source baseline Complete; the copied package tree is the build target.
- [x] CHK-203 [P1] `tests/config.test.ts` and `tests/payload.test.ts` fixtures are listed before coding. — matrix listed in `tasks.md` T202 (payload guards authored in `tests/payload-status.test.ts`).
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:config-compat -->
## Config Compatibility

- [x] CHK-204 [P0] Legacy-only fixture migrates to the new path with no data loss. — test "migrates a legacy user config once and leaves the legacy file untouched" green; `loadConfigForScope` migrates when the new path is absent and legacy exists.
- [x] CHK-205 [P0] Explicit empty `targets` array is preserved as an opt-out. — test "preserves an explicit empty target opt-out through load and save" green.
- [x] CHK-206 [P1] One-time migration leaves the legacy file untouched with no fallback read after migration. — `loadConfigForScope` writes only the new path via `saveConfigToPath` (no delete, no continuing fallback); the migration test asserts the legacy file is byte-unchanged.
- [x] CHK-207 [P1] Project-local path quirk (project path selected even when the file is absent) is documented and fixture-tested. — `selectConfigPath` unchanged; documented in `plan.md`; tests "uses project-level state for project-local packages under cwd/.pi" + `isProjectLocalExtension` cases green.
<!-- /ANCHOR:config-compat -->

<!-- ANCHOR:persistence -->
## Persistence

- [x] CHK-208 [P1] Config writes are atomic (temporary file plus rename). — `saveConfigToPath` writes `.{name}.{uuid}.tmp` then `fs.rename`, removing the temp on error; exercised through the temp-dir config tests.
- [x] CHK-209 [P1] Malformed/torn JSON reads fail safe to a valid default config. — `parseConfigJson`/`loadConfigFromPath` catch parse errors and return a cloned default; malformed-JSON test green.
<!-- /ANCHOR:persistence -->

<!-- ANCHOR:payload-guards -->
## Payload Guards

- [x] CHK-210 [P0] Unsupported model returns `undefined` (no change). — test "does not stamp an unsupported model" green.
- [x] CHK-211 [P0] Supported model returns a cloned payload carrying `service_tier`. — tests "injects service_tier while preserving existing fields" + "uses target-specific serviceTier when configured" green.
- [x] CHK-212 [P0] Payload is never mutated in place. — returns a cloned `{ ...payload }`; non-record payload returns `undefined`.
- [x] CHK-213 [P0] A parallel/child request for a different model is NOT stamped. — test "does not stamp a different model" green (`payload.model !== target.model` → `undefined`); already-tiered payload also returns `undefined`.
<!-- /ANCHOR:payload-guards -->

<!-- ANCHOR:scope -->
## Scope

- [x] CHK-214 [P1] No subagent-handoff or install behavior is introduced in this child. — changes confined to `src/{types,config,payload}.ts`, tests, and `package.json` identity; no env/handoff code; `.pi/settings.json` untouched (its mtime pre-dates the change).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-215 [P1] `npm run typecheck` exits 0. — verified.
- [x] CHK-216 [P1] `npm test` exits 0. — 4 files, 57 tests passed (baseline 50, +7 for migration/atomic/malformed/guards).
<!-- /ANCHOR:testing -->

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-217 [P1] Handoff criteria to `003-package-baseline-gates` are satisfied and evidence is recorded in this checklist. — identity, one-time migration, atomic persistence, malformed fallback, and payload guards implemented and green.
<!-- /ANCHOR:summary -->
