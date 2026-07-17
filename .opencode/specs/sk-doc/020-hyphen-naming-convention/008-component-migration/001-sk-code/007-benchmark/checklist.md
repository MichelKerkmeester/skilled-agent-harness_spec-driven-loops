---
title: "Checklist: sk-code benchmark artifacts (032 phase 008/007)"
description: "Blocking SOL verification contract for the sk-code benchmark storage rename and navigation closure."
trigger_phrases:
  - "benchmark naming checklist"
  - "sk-code benchmark rename verification"
  - "benchmark artifact parity"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/007-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/007-benchmark"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored benchmark SOL checklist"
    next_safe_action: "Verify benchmark paths and artifact parity against BASE"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: sk-code benchmark artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the benchmark child. The report pins candidate SHA, BASE SHA, frozen-map hash, commands, exit codes, storage/file counts, report hashes, corpus IDs, and discovery outcomes. Empty corpus/report discovery or unexpected tracked mutation fails the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate is on the pinned BASE worktree with the 006 corpus handoff, benchmark baseline, and clean isolated index attached.
- [ ] CHK-002 [P2] The report records the map hash, seven storage labels, generated-output classification, report hashes, and corpus baseline.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Changes are limited to benchmark storage labels and declared navigation/path consumers.
- [ ] CHK-004 [P0] Generated report content, schemas, fixture data, identifiers, keys, exact names, Python/package exemptions, and frozen history retain their contracts.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every listed storage label and nested path has one disposition and every renamed target is kebab-case.
- [ ] CHK-006 [P0] benchmark/README.md, storage readmes, command paths, report links, and corpus paths resolve with no active old storage label.
- [ ] CHK-007 [P0] Report filenames/content, fixture files, corpus IDs, and non-zero benchmark/report discovery match BASE.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] No in-scope snake_case storage name remains under benchmark and no generated report was rewritten.
- [ ] CHK-009 [P1] The final report records the 006 corpus handoff and path evidence for the 008 changelog check and 009 subtree gate.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] Benchmark command safety, output-directory boundaries, generated-artifact handling, and tool restrictions are unchanged beyond path literals.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] Benchmark README, storage navigation, and the child packet record final paths, classifications, and evidence.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The benchmark path closure is path-scoped and dependency-closed, with no benchmark rerun or unrelated report regeneration.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept the child only when every P0 check passes, storage and corpus/report parity is proven, generated artifacts are preserved, all paths resolve, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the evidence report pins the map and baseline and git diff-index --quiet HEAD -- shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
