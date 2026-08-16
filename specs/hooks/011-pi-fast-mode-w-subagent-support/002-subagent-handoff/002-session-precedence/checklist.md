---
title: "Verification Checklist: Phase 2 session-precedence"
description: "Evidence checklist for presence-aware lifecycle handoff precedence."
trigger_phrases:
  - "session-precedence checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff/002-session-precedence"
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Created lifecycle precedence checklist"
    next_safe_action: "Run and record the precedence matrix"
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
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Phase 2 session-precedence

<!-- ANCHOR:protocol -->
## Verification Protocol

- [ ] CHK-501 [P1] Record the flag-presence probe, precedence rows, exits, and relevant output.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-502 [P1] Handoff contract child passes its strict-value matrix.
- [ ] CHK-503 [P1] Explicit `--fast` true, absent/default false, and explicit `/fast off` (or `--no-fast` equivalent) semantics are written down; absent never equals explicit false.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-504 [P1] Lifecycle writes use the single handoff helper.
- [ ] CHK-505 [P1] Payload/model gating remains separate from handoff resolution.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-506 [P1] Explicit `--fast` true overrides inherited env and persisted config.
- [ ] CHK-507 [P1] Inherited `1`/`0` overrides persisted config when no explicit flag exists.
- [ ] CHK-508 [P1] Invalid/unset env falls back to persisted config.
- [ ] CHK-509 [P1] Existing payload/status tests remain green.
- [ ] CHK-517 [P1] Explicit `/fast off` (or `--no-fast`) false overrides inherited `"1"` and persisted config.
- [ ] CHK-518 [P1] Inherited `"1"` resolves enabled over persisted-disabled config when no explicit flag exists.
- [ ] CHK-519 [P1] Inherited `"0"` resolves disabled over persisted-enabled config when no explicit flag exists.
- [ ] CHK-520 [P1] Invalid inherited env (non-`1`/`0`) falls through to persisted config.
- [ ] CHK-521 [P1] Unset inherited env falls through to persisted config.
- [ ] CHK-522 [P1] Absent/default flag never overrides inherited env.
- [ ] CHK-523 [P1] Resolved preference passes the model/target match before any service_tier applies; handoff never bypasses gating.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-510 [P1] `/fast` writes normalized state after persistence.
- [ ] CHK-511 [P1] Session start reads the inherited value and resolves the effective state; the child does not write the parent-owned env.
- [ ] CHK-524 [P1] Effective state is exported to the env after every parent toggle/flag change (single writer).
- [ ] CHK-525 [P1] Child never overwrites the parent-owned env value; it is a reader only.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-512 [P1] Only the boolean flag crosses the environment boundary.
- [ ] CHK-513 [P1] No credentials or provider payload data are logged or persisted through handoff.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-514 [P1] Explicit-flag semantics and precedence are ready for the process-propagation README section.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-515 [P1] Changes stay in lifecycle sources/tests; no install settings change.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-516 [P1] Session-precedence handoff criteria are satisfied and evidence is recorded here.
<!-- /ANCHOR:summary -->
