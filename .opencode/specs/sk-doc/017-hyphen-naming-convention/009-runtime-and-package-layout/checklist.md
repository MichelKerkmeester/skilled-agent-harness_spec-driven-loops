---
title: "Checklist: runtime and package layout (017 phase 009)"
description: "Checklist for phase 009 of the 017 kebab-case filesystem-naming program: runtime and package layout."
trigger_phrases:
  - "runtime and package layout checklist"
  - "hyphen naming phase 009 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/009-runtime-and-package-layout"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/009-runtime-and-package-layout"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "SOL verifier contract authored from the design review"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Runtime and package layout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 009. Every item is a check the paired
verify agent runs BEFORE the candidate commit lands; each SOL report pins the candidate SHA, BASE SHA, and rename-map
hash, records commands + exit codes + discovery counts, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-005 [P0] Predecessor phases have landed and the worktree is clean, pinned to BASE, with an isolated git index
- [ ] CHK-006 [P2] The pinned BASE SHA and rename-map hash for this phase are recorded in the candidate report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-007 [P1] Changes are scoped to this phase; no adjacent cleanup; exemptions honored
- [ ] CHK-008 [P2] No code identifier / JSON-YAML-TOML key / frontmatter field was altered by a filesystem rename
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] After manifest/lock changes, a fresh install proves resolved packages + build output live inside the worktree via `realpath`
- [ ] CHK-002 [P0] Build/typecheck/test the affected packages; smoke launchers and doctor checks
- [ ] CHK-003 [P0] Preserve symlink and executable modes; no Python package dir renamed
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-004 [P1] No old-path reference remains in the moved batch's consumer closure
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No executable behavior or allowlist changed beyond the intended logic/rename; sandbox and gate posture preserved
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P2] The phase outcome is reflected in the packet docs and the convention doc where applicable
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Renames land in dependency-closed, path-scoped commits on the pinned worktree branch
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the candidate report pins the SHAs + map hash, and the gate
(validate/build/test/link/benchmark as applicable) is green with discovery-count parity against the 000 baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and `git diff-index --quiet HEAD --` shows no unexpected
tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
