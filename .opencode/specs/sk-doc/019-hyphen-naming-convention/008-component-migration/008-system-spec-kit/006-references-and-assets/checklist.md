---
title: "Checklist: References and assets (017 subtree 008 phase 006)"
description: "The system-spec-kit reference and asset surfaces contain a broad set of underscore-bearing Markdown filenames, plus MCP documentation and curated benchmark report files. This phase renames permitted reference/asset files and updates links and pointers while keeping tool-mandated names, generated artifacts, Python files, keys, and frozen history within their exemptions."
trigger_phrases:
  - "system-spec-kit references and assets"
  - "reference filename kebab-case"
  - "asset filename rename"
  - "benchmark_report rename"
  - "kebab-case phase 006"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit/006-references-and-assets"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored SOL verifier checklist"
    next_safe_action: "Execute the reference and asset file map after template pointers are stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: References and assets

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 006. The verifier records candidate SHA, BASE SHA, rename-map hash, commands, exit codes, discovery counts, and disposition-ledger evidence before accepting the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 005 template handoff is available.
- [ ] CHK-002 [P0] Reference/asset and MCP benchmark classifications are recorded before edits.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] File moves use semantic mappings and never change field/key names.
- [ ] CHK-004 [P0] Generated and frozen classifications are evidence-backed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Candidate counts and per-file dispositions are complete.
- [ ] CHK-006 [P0] Active Markdown links and path-valued pointers resolve.
- [ ] CHK-007 [P0] No exempt or frozen surface is rewritten.
- [ ] CHK-008 [P1] Benchmark and MCP reference indexes remain discoverable.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] No permitted active reference/asset filename retains an underscore.
- [ ] CHK-010 [P1] All old active paths have zero unresolved dispositions.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] Resource loading and benchmark entrypoint boundaries are unchanged.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P2] Candidate map and excluded-file ledger are retained for the shared/runtime handoff.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] Batch contains only assigned reference/asset files and their active pointers.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept only when the per-file inventory, semantic map, active-link resolution, exemption ledger, and benchmark/reference discoverability are evidenced.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms zero broken active references or asset pointers.
<!-- /ANCHOR:sign-off -->

