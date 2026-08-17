---
title: "Tasks: Phase 2 identity-config-compat"
description: "Task ledger for package identity, config compatibility, safe persistence, and request guards."
trigger_phrases:
  - "identity-config-compat tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/002-identity-config-compat"
    last_updated_at: "2026-08-16T14:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Executed identity/config/guard tasks; tsc 0, 57 tests green"
    next_safe_action: "Hand off to 003-package-baseline-gates"
    blockers: []
    key_files: ["../../research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: Phase 2 identity-config-compat

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[P]` parallelizable · `[B]` blocked.

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T201 Confirm new/legacy path names and project/user write scope against `config.ts:92-104`, including the project-local path quirk.
- [x] T202 [P] Write the config and request-guard matrix from the research handoff into `tests/config.test.ts` and `tests/payload.test.ts`:
  - `tests/config.test.ts`: legacy-only fixture migrates to the new path with no data loss; malformed/torn config falls back safely; explicit empty `targets` opt-out survives.
  - `tests/payload.test.ts`: unsupported model returns `undefined`; supported model returns a cloned payload carrying `service_tier`; a parallel/child request for a different model is NOT stamped.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T203 Apply package/status/config identity constants and keep `{ enabled, targets }` (`config.ts:6-55`). — `PACKAGE_NAME` set in `types.ts`; schema unchanged; tsc exit 0.
- [x] T204 Implement the one-time compatibility policy: when the new path is absent, read the legacy path once, normalize field-aware, atomic-write to the new path, and leave the legacy file untouched. — implemented in `loadConfigForScope`; migration test green.
- [x] T205 Add atomic replacement (temporary file plus rename) and malformed/torn JSON reads that fail safe to a valid default. — `saveConfigToPath` temp+rename; malformed-fallback test green.
- [x] T206 Add explicit request-record, payload-model, and service-tier guards returning a cloned `{ ...payload, service_tier }` or `undefined`; never mutate in place (`payload.ts:45-70`; guards modeled on `openai-codex-fast-mode.ts:196-208`). — untiered + model guards in `getFastModePayload`; guard tests green.

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T207 Run `npm run typecheck` and `npm test`; record exit codes and relevant output. — typecheck exit 0; test exit 0, 57 passed (was 50).
- [x] T208 Grep for unintended handoff/install ownership and record the clean boundary. — changes confined to package `src`/tests + `package.json`; `.pi/settings.json` untouched.

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remain.
- [x] Handoff criteria in `spec.md` are evidenced.

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
<!-- /ANCHOR:cross-refs -->
