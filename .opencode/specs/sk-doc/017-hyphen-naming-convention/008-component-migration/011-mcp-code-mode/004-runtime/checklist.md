---
title: "Checklist: mcp-code-mode runtime (017 component 011 phase 004)"
description: "Blocking SOL verifier contract for the runtime filename census, no-op proof, and executable path closure."
trigger_phrases:
  - "mcp-code-mode runtime checklist"
  - "mcp-code-mode phase 004 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/004-runtime"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/004-runtime"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored runtime verifier contract"
    next_safe_action: "Run the runtime closure verifier"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: mcp-code-mode runtime

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 004. The report pins the candidate SHA, BASE SHA, and
rename-map hash, records the complete runtime inventory, path dispositions, commands, and exit codes, and fails on an
unproved no-op, stale active runtime path, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phases 001 through 003 provide their required path state and the runtime census is recorded from BASE
- [ ] CHK-002 [P2] The BASE SHA, runtime map hash, and direct/manual consumer inventory are recorded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Changes are limited to runtime names and runtime path consumers; the phase-005 playbook filename is untouched
- [ ] CHK-004 [P0] Route-guard decisions, tool names, environment variable names, identifiers, data keys, Python paths, and frozen history are unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The inventory lists runtime/hooks/claude/mcp-route-guard.cjs, runtime/hooks/codex/mcp-route-guard.cjs, runtime/lib/mcp-route-guard.cjs, and runtime/lib/mcp-route-guard.test.cjs
- [ ] CHK-006 [P0] The map proves all observed runtime names are compliant or records every eligible candidate with a kebab-case target
- [ ] CHK-007 [P0] node --check, route-guard tests, and active runtime path resolution pass against the final map
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Strict packet validation and the runtime reference scan pass with no stale eligible path
- [ ] CHK-009 [P1] Every runtime path hit has a disposition and the empty map, if used, is supported by the complete census
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No route policy, allowlist, fail-open behavior, environment handling, or executable logic changed beyond path rewriting
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] The phase evidence states the runtime map result and separates runtime paths from phase-005 playbook filenames
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Any runtime rename and its path updates land in one dependency-closed, path-scoped commit
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, the runtime tree and path graph are proven clean, executable checks
are green, and no unexpected tracked mutation remains.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and the runtime audit has no unproved candidate or stale edge.
<!-- /ANCHOR:sign-off -->
