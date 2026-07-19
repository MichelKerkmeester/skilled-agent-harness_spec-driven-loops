---
title: "Checklist: mcp-tooling subtree rollup gate (020 phase 008)"
description: "Blocking SOL verifier contract for sibling aggregation and the exemption-aware whole mcp-tooling naming gate."
trigger_phrases:
  - "mcp-tooling rollup checklist"
  - "mcp tooling whole surface gate"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/008-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/008-skill-gate"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the phase 008 SOL verifier contract"
    next_safe_action: "Aggregate sibling evidence and run the whole-surface gate"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/"
      - ".opencode/skills/mcp-tooling/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: mcp-tooling Subtree Rollup Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 008. Every item is a check the paired
verify agent runs BEFORE the candidate commit lands; each SOL report pins the candidate SHA, BASE SHA, and rename-map
hash, records commands + exit codes + discovery counts, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Candidate SHA, BASE SHA, and final rename-map hash are recorded before rollup
- [ ] CHK-002 [P2] The report includes all sibling checklist paths and non-zero evidence for applicable catalog/playbook/scenario checks
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] All sibling phases 001-007 are represented with no missing P0 evidence or unresolved blocker
- [ ] CHK-004 [P2] Phase 008 creates no rename, reference repair, changelog edit, code change, or other migration mutation
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The exemption-aware whole-surface scan finds zero in-scope snake_case filesystem names under .opencode/skills/mcp-tooling
- [ ] CHK-006 [P0] Every remaining underscore is classified as an approved Python/package, tool-mandated, generated/lockfile, frozen, or other documented exemption
- [ ] CHK-007 [P0] Cross-surface Markdown links, path-valued metadata, route resources, catalog/playbook indexes, and benchmark references resolve
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The rollup evidence reconciles each sibling candidate count, post-change count, reference scan, and exemption disposition
- [ ] CHK-009 [P1] Any failure is routed to its owning sibling phase; the rollup gate does not apply an opportunistic fix
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No executable behavior, credential boundary, routing policy, or tool allowlist changed during rollup
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] The parent phase map and all eight child contracts agree on status, ownership, and final naming scope
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Verification leaves git diff-index --quiet HEAD -- clean and no gate-created tracked mutation is present
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The subtree gate is green only when all sibling P0 contracts pass, the whole mcp-tooling scan is zero outside exemptions, all references resolve, and phase 008 itself creates no migration change.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 rollup contract and routes any failure back to the owning child phase.
<!-- /ANCHOR:sign-off -->
