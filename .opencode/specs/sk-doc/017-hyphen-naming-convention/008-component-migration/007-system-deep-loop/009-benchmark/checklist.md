---
title: "Checklist: system-deep-loop benchmark names (017 phase 007/009)"
description: "Blocking SOL verification contract for the root benchmark storage-label rename set, generated reports, fixtures/profiles ownership, and reproducible outputs."
trigger_phrases:
  - "system-deep-loop benchmark checklist"
  - "benchmark storage naming verification"
  - "deep loop benchmark directory rename"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/009-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/009-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored benchmark checklist"
    next_safe_action: "Verify benchmark storage paths"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: System-deep-loop benchmark names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the root benchmark child. The report pins the candidate SHA, BASE SHA, frozen-map hash, commands, exit codes, the three storage-label directories plus baseline, report filenames/payloads, and ownership of component fixtures/profiles. Verification must leave no unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate is on the pinned BASE worktree with a clean isolated index and root system-deep-loop/benchmark ownership is attached.
- [ ] CHK-002 [P2] The report records BASE SHA, candidate SHA, frozen-map hash, storage/report manifest, generated-output ownership, and the fixture/profile split with deep-improvement.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The change is limited to root benchmark storage labels and dependency-closed references; component-local benchmark fixtures/profiles remain owned by deep-improvement.
- [ ] CHK-004 [P0] Report filenames skill-benchmark-report.json and skill-benchmark-report.md, payload keys, schema names, tool-mandated names, and generated output contracts were not renamed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every candidate storage path has exactly one rename, exempt, frozen, generated, or tool-mandated disposition with no unknown row or collision.
- [ ] CHK-006 [P0] Baseline, after-proxy, live-mode, router-mode, README, runner, and report references resolve to the intended storage paths.
- [ ] CHK-007 [P0] The benchmark runner produces non-zero results with D5 coverage, and report structure/content remains equivalent except for required path labels.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Every old in-scope storage label in scripts, guides, and generated-output references has an explicit disposition; no stale benchmark directory label remains.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] Benchmark output containment, fixture loading, profile selection, generated-data handling, and runner boundaries are unchanged except for required path values.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P2] The storage/report manifest, ownership split, exemption decisions, reproducibility evidence, and final path inventory are recorded in the phase report and packet docs.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] The rename/reference change is one dependency-closed root-benchmark batch with no deep-improvement fixture/profile or unrelated component files.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept this child only when every P0 item passes, benchmark outputs are reproducible and non-trivial, storage ownership is unambiguous, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the report contains the required receipts and git diff-index --quiet HEAD -- shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
