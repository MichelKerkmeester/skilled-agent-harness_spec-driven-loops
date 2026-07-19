---
title: "Checklist: convention policy and scope (020 phase 001)"
description: "Checklist for phase 001 of the 020 kebab-case filesystem-naming program: convention policy and scope."
trigger_phrases:
  - "convention policy and scope checklist"
  - "hyphen naming phase 001 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope"
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
# Checklist: Convention policy and scope

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 001. Every item is a check the paired
verify agent runs BEFORE the candidate commit lands; each SOL report pins the candidate SHA, BASE SHA, and rename-map
hash, records commands + exit codes + discovery counts, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-006 [P0] Predecessor phases have landed and the worktree is clean, pinned to BASE, with an isolated git index — phase 000 landed at commit `af08e824a0`; worktree pinned to BASE `1ec0ad2947b` with an isolated git index
- [ ] CHK-007 [P2] The pinned BASE SHA and rename-map hash for this phase are recorded in the candidate report — BASE recorded; rename-map hash is a phase-006 artifact, N/A here
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-008 [P1] Changes are scoped to this phase; no adjacent cleanup; exemptions honored — additive policy only: new `filesystem-naming-convention.md`, a `core_standards.md` §2 forward-pointer, the 027 supersession banner, and the decision record; no code or rename
- [x] CHK-009 [P2] No code identifier / JSON-YAML-TOML key / frontmatter field was altered by a filesystem rename — no renames performed in phase 001
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-001 [P0] Every observed census candidate maps to exactly one policy class (rename/exempt/frozen/generated/tool-mandated); no "unknown" bucket — the taxonomy is exhaustive and mutually exclusive by construction; `decision-record.md` Policy Classification Fixtures proves no "unknown" bucket exists (per-candidate application over the census is frozen in phase 006)
- [x] CHK-002 [P0] Test the exemption matcher with positive and negative fixtures (a .py, a package dir, a tool-mandated name; a plain snake_case doc) — `decision-record.md` Policy Classification Fixtures gives positive rows (`validate_document.py`, `mcp_server/`, `SKILL.md`) and negative rows (`my_document.md`, `feature_catalog/read_path_freshness.md` rename)
- [x] CHK-003 [P0] Resolve the packet number, the frontmatter value-vs-key boundary, the frozen-history exception, and test-magic handling in the decision record — `decision-record.md` DR-010 (number 020), DR-008 + convention §5 (value-vs-key), DR-008 + convention §4 (frozen-history), convention §2 (test-magic)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-004 [P1] Strict-validate the packet; the convention doc is linked from the create-* skills — `validate.sh` --strict clean on this node; `filesystem-naming-convention.md` is reachable from the create-* skills via the `core_standards.md` §2 forward-pointer (create-agent/command/benchmark/manual-testing-playbook/quality-control all reference `core_standards.md`)
- [x] CHK-005 [P1] The 027 ADR is referenced and marked superseded, not deleted — `027-catalog-naming-convention/spec.md` carries a supersession banner and `decision-record.md` DR-011 records it; 027's completed work is preserved (append-only)
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-010 [P2] No executable behavior or allowlist changed beyond the intended logic/rename; sandbox and gate posture preserved — phase 001 adds only policy documentation; no executable behavior or allowlist changed
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-011 [P2] The phase outcome is reflected in the packet docs and the convention doc where applicable — `implementation-summary.md` records the outcome and `filesystem-naming-convention.md` §6-7 states its relationship to the classifier and its provenance
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Renames land in dependency-closed, path-scoped commits on the pinned worktree branch
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
