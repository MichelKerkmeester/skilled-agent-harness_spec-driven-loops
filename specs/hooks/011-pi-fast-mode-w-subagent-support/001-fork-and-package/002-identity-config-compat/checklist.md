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
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Created compatibility checklist"
    next_safe_action: "Run and record the config compatibility gates"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Phase 2 identity-config-compat

<!-- ANCHOR:protocol -->
## Verification Protocol

- [ ] CHK-201 [P1] Record each command, exit code, and relevant output.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-202 [P1] `001-source-baseline/` handoff is present and unchanged.
- [ ] CHK-203 [P1] `tests/config.test.ts` and `tests/payload.test.ts` fixtures are listed before coding.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:config-compat -->
## Config Compatibility

- [ ] CHK-204 [P0] Legacy-only fixture migrates to the new path with no data loss.
- [ ] CHK-205 [P0] Explicit empty `targets` array is preserved as an opt-out.
- [ ] CHK-206 [P1] One-time migration leaves the legacy file untouched with no fallback read after migration.
- [ ] CHK-207 [P1] Project-local path quirk (project path selected even when the file is absent) is documented and fixture-tested.
<!-- /ANCHOR:config-compat -->

<!-- ANCHOR:persistence -->
## Persistence

- [ ] CHK-208 [P1] Config writes are atomic (temporary file plus rename).
- [ ] CHK-209 [P1] Malformed/torn JSON reads fail safe to a valid default config.
<!-- /ANCHOR:persistence -->

<!-- ANCHOR:payload-guards -->
## Payload Guards

- [ ] CHK-210 [P0] Unsupported model returns `undefined` (no change).
- [ ] CHK-211 [P0] Supported model returns a cloned payload carrying `service_tier`.
- [ ] CHK-212 [P0] Payload is never mutated in place.
- [ ] CHK-213 [P0] A parallel/child request for a different model is NOT stamped.
<!-- /ANCHOR:payload-guards -->

<!-- ANCHOR:scope -->
## Scope

- [ ] CHK-214 [P1] No subagent-handoff or install behavior is introduced in this child.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-215 [P1] `npm run typecheck` exits 0.
- [ ] CHK-216 [P1] `npm test` exits 0.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-217 [P1] Handoff criteria to `003-package-baseline-gates` are satisfied and evidence is recorded in this checklist.
<!-- /ANCHOR:summary -->
