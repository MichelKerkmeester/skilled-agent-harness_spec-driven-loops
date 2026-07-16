---
title: "Checklist: system-code-graph subtree rollup gate (032 phase 008)"
description: "Blocking SOL verifier contract for sibling aggregation and the exemption-aware whole system-code-graph naming and active-reference gate."
trigger_phrases:
  - "system-code-graph rollup checklist"
  - "system-code-graph whole surface gate"
  - "code graph naming verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/010-system-code-graph/008-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/010-system-code-graph/008-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored subtree gate checklist"
    next_safe_action: "Aggregate sibling evidence and run the whole-surface gate"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/032-hyphen-naming-convention/008-component-migration/010-system-code-graph/"
      - ".opencode/skills/system-code-graph/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: system-code-graph Subtree Rollup Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 008. Every item is checked against the candidate SHA,
BASE SHA, and final rename-map hash. The report records all seven sibling checklist results, path counts, exemption
dispositions, reference results, commands, exit codes, and mutation evidence, and fails on missing evidence or
unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Candidate SHA, BASE SHA, and final rename-map hash are recorded before rollup
- [ ] CHK-002 [P2] The report enumerates phases 001–007 and includes non-zero evidence for each applicable inventory, link, catalog/playbook, runtime, and release check
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] All sibling phases 001–007 are represented with no missing P0 evidence or unresolved blocker
- [ ] CHK-004 [P2] Phase 008 creates no rename, reference repair, changelog edit, code change, or other migration mutation
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The exemption-aware whole-surface scan finds zero in-scope snake_case filesystem names under `.opencode/skills/system-code-graph/`
- [ ] CHK-006 [P0] Every remaining underscore is classified as an approved Python/package, tool-mandated, generated/lockfile, test-magic, frozen, or other documented filesystem exemption
- [ ] CHK-007 [P0] Active Markdown links, path-valued metadata, catalog/playbook indexes, launcher/configuration paths, and sibling handoffs resolve; frozen-history references are excluded by policy
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Rollup evidence reconciles each sibling candidate count, post-change count, reference result, exemption disposition, and phase-007 version/history result
- [ ] CHK-009 [P1] Any failure is routed to its owning sibling phase; the rollup gate does not apply an opportunistic rename or repair
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

- [ ] CHK-012 [P1] Verification leaves `git diff-index --quiet HEAD --` clean and no gate-created tracked mutation is present
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The subtree gate is green only when all sibling P0 contracts pass, the whole system-code-graph scan is zero outside
the approved exemptions, active references resolve, and phase 008 itself creates no migration change.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 rollup contract and routes any failure back to the owning child phase.
<!-- /ANCHOR:sign-off -->
