---
title: "Implementation Plan: Phase 2 identity-config-compat"
description: "Apply package identity and the researched config/request safety contract without adding handoff behavior."
trigger_phrases:
  - "identity-config-compat plan"
  - "config compatibility plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/002-identity-config-compat"
    last_updated_at: "2026-08-16T14:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Landed identity, migration, atomic writes, guards; tsc 0, 57 tests green"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: Phase 2 identity-config-compat

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | Pi Extension API |
| **Storage** | User/project JSON config |
| **Testing** | Vitest pure unit tests |

### Overview
Start with the upstream `{ enabled, targets }` schema. Resolve the fork path first, use the selected one-time compatibility policy when only the old path exists, normalize state, write through a temporary file plus rename, and keep provider/model/tier guards pure and config-driven.


<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source baseline exists.
- [x] Research evidence identifies config, atomic-write, and guard constraints.

### Definition of Done
- [x] Compatibility fixture preserves user state.
- [x] Malformed/torn state fails safe.
- [x] Negative model/tier cases return unchanged behavior.


<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure normalization and model-gate helpers around one resolved config path.

### Key Components
- `config.ts`: path resolution, normalization, compatibility, atomic save. Evidence: config schema + normalize `config.ts:6-55`; path resolution `config.ts:92-104`; `syncSupportedTargets` refresh `config.ts:108-153`.
- `payload.ts`: explicit request/model/service-tier guard. Evidence: replace-style payload + `service_tier` injection `payload.ts:45-70`; request guards modeled on `context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:196-208`.
- `types.ts`: package-owned identity constants.

### Config Compatibility Policy
Adopt a ONE-TIME legacy migration, not a continuing dual-read fallback:
1. Resolve the fork's own new config path.
2. If it is absent, read the legacy `pi-openai-fast-mode` config path once.
3. Normalize field-aware (an explicit empty `targets` array stays an opt-out) and ATOMIC-write the migrated data to the new path.
4. Leave the legacy file untouched — no delete, no continuing fallback read after migration.
5. Preserve and document the upstream project-local path quirk: a project-local install selects the project path even when the file does not yet exist.

Evidence: research.md Section 7; `config.ts:6-55` (schema+normalize), `config.ts:92-104` (path resolution), `config.ts:108-153` (`syncSupportedTargets`); the Eliminated-Alternatives rows rejecting dual-read and gpt/TBG schemas.

### Payload Guard Contract
`before_provider_request` is REPLACE-style:
- Return a cloned `{ ...payload, service_tier }` only when applying a tier to a matching, untiered request.
- Return `undefined` (no change) otherwise.
- Never mutate the payload in place.
- Never stamp a tier for an unsupported or unconfigured model (guard against the request record and `payload.model`).

Evidence: `payload.ts:45-70`; `openai-codex-fast-mode.ts:196-208`.

### Data Flow
Resolved path → compatible read → normalized state → atomic write → config-driven payload gate.


<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Config path resolver | Chooses user/project state | Add explicit compatibility policy | Legacy-only fixture |
| State writer | Persists JSON | Use temporary file plus rename | Torn-write test |
| Payload hook | Applies service tier | Guard request record, payload model, and explicit tier | Negative matrix |
| Handoff env | Child preference | Unchanged in this child | Namespace grep |

<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the new and legacy path names and write scope against `config.ts:92-104`, including the project-local path quirk.
- [x] Write the compatibility and model-gate test matrix in `tests/config.test.ts` and `tests/payload.test.ts`.

### Phase 2: Core Implementation
- [x] Apply package/status/config identity constants and preserve the `{ enabled, targets }` schema (`config.ts:6-55`).
- [x] Implement the one-time compatibility policy: field-aware normalization and atomic new-path write with the legacy file untouched (`config.ts:92-104`, `config.ts:108-153`).
- [x] Implement malformed-state fallback and torn-write-safe persistence.
- [x] Implement the replace-style payload guard: cloned `{ ...payload, service_tier }` for matching untiered requests, `undefined` otherwise, never in-place mutation (`payload.ts:45-70`; guards modeled on `openai-codex-fast-mode.ts:196-208`).

### Phase 3: Verification
- [x] Run `npm run typecheck` and `npm test`; record exit codes and relevant output.
- [x] Confirm no handoff code or install settings changed.


<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Schema normalization, one-time migration, path policy, atomic writes — `tests/config.test.ts` | Vitest |
| Unit | Supported/unsupported model, cloned payload, cross-model guard matrix — `tests/payload.test.ts` | Vitest |
| Static | Identity and handoff ownership | `rg` |


<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-source-baseline/` | Internal | Green | No safe source target |
| Pinned Pi runtime docs | External reference | Green | Guard semantics need re-check |


<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Compatibility or guard tests fail, or state writes touch an unintended path.
- **Procedure**: Revert only this child, restore the source-baseline copy, and retain the pinned context snapshot.
<!-- /ANCHOR:rollback -->
