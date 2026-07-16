---
title: "Checklist: sk-doc root benchmark artifact boundary"
description: "Blocking SOL verifier contract for the root benchmark artifact census and conditional rename phase."
trigger_phrases:
  - "sk-doc root benchmark checklist"
  - "benchmark artifact naming verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/005-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/005-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored root benchmark audit checklist"
    next_safe_action: "Run the root benchmark verifier"
    blockers: []
    key_files: [".opencode/skills/sk-doc/benchmark/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: sk-doc root benchmark artifact boundary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 005. The report pins BASE, candidate SHA, and root-census hash, records hidden-inclusive path counts and ownership evidence, and fails on an unclassified artifact or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Hidden-inclusive root benchmark inventory and consumer search are recorded.
- [ ] CHK-002 [P1] BASE SHA, census hash, and root-vs-create-benchmark boundary are pinned.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Only root benchmark paths would be in scope; no create-benchmark packet file changed.
- [ ] CHK-004 [P0] Benchmark fields, keys, IDs, content names, and mandated names are unchanged.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The report proves the `.gitkeep`-only zero-row baseline or supplies a complete actual-artifact map.
- [ ] CHK-006 [P0] Root-owned paths resolve and no stale root benchmark reference remains.
- [ ] CHK-007 [P1] Root census count/path parity and ownership match BASE.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Hidden/generated-looking files, dynamic paths, and cross-phase artifact references are dispositioned.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No benchmark execution permission, allowlist, or sandbox boundary changed.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] Parent and rollup docs record the root benchmark census result and ownership boundary.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] No implementation-summary or scratch artifact remains and no benchmark artifact was created by this phase.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when the root census is complete, the zero-row or actual map is evidence-pinned, packet ownership is separate, and no unexpected mutation remains.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off requires the pinned census report, ownership evidence, and a clean scoped diff.
<!-- /ANCHOR:sign-off -->
