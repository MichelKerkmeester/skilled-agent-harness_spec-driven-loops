---
title: "Changelog: 005 Post-Program Doc and State Cleanup"
description: "Bounded post-program cleanup that refreshed stale metadata across completed remediation packets, restored parent phase-map traceability, brought the 005 source packet to strict-validator green while preserving CHK-T15. The 011 validator bug was documented as an out-of-scope blocker."
trigger_phrases:
  - "005 post-program cleanup"
  - "post-program doc and state cleanup"
  - "026 stale metadata refresh"
  - "011 validator bug phase_dir"
  - "005 strict validator CHK-T15"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-28

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/004-followup-post-program/001-post-program-doc-and-state-cleanup` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/004-followup-post-program`

### Summary

After the 026 deep-review remediation program closed its main runtime and documentation fixes, several post-program state surfaces were left stale. Completed remediation sub-phases still showed status `planned`. The parent phase map omitted the `005-review-remediation` child. The 005 source packet failed strict validation due to template-header drift. The 011 source packet had both a recursive validator variable leak and broad historical leaf-packet template debt.

This cleanup packet resolved all work that fell inside the approved 026 write boundary. Metadata on three completed sub-phases was updated to `complete`. Parent phase maps were patched to restore traceability. The 005 strict validator was repaired and re-run to green while leaving the live-rescan operator gate (CHK-T15) deliberately deferred. The 011 validator failure was traced to `check-phase-links.sh:39` leaking an undeclared `phase_dir` variable, which is outside the approved write scope. A combined focused Vitest sweep (18 files, 106 tests) and a rubric replay (30 cells, score sum 201) confirmed no regressions.

### Added

- L2 packet docs for this cleanup: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `description.json`, `graph-metadata.json`
- Phase 1 review report under `review/001-post-program-cleanup-review/review-report.md` capturing Tier A audit findings
- Implementation summary with a disposition table covering all seven P1/P2 findings

### Changed

- `graph-metadata.json` on three completed packets updated from `planned` to `complete`: `001-fix-memory-indexer-storage-boundary`, `002-fix-additional-release-readiness-findings`, `006-skill-advisor/002-skill-graph-daemon-native-advisor-tools`
- `../../../005-memory-indexer-invariants/implementation-summary.md` and `graph-metadata.json` refreshed for strict-validator freshness without closing CHK-T15
- `../../../000-release-cleanup/spec.md` updated to include `005-review-remediation` in the phase map
- `../../../spec.md` root row refreshed for `000-release-cleanup/`

### Fixed

- 005 source packet strict validator failure caused by template-header drift. Validator now exits 0 with 0 errors and 0 warnings.
- Stale `planned` status on three completed remediation packets. Status now reflects actual completion evidence.
- Phase-map omission of `005-review-remediation`. Parent maps now include the child and current count.

### Verification

| Check | Result |
|-------|--------|
| Combined focused Vitest sweep | PASS: 18 files, 106 tests |
| Rubric replay | PASS: 30 cells, score sum 201 |
| 005 source validator | PASS: strict validator exits 0 with 0 errors and 0 warnings |
| 011 source validator | FAIL: recursive validation emits literal child-glob `EVIDENCE_MARKER_LINT` errors. Root cause is `check-phase-links.sh:39` using undeclared `phase_dir`. Outside approved write boundary. Recorded as T016. |
| Cleanup packet validator | PASS: strict validator exits 0 with 0 errors and 0 warnings |
| 001 remediation validator | PASS: strict validator exits 0 with 0 errors and 0 warnings |
| 004 remediation validator | PASS: strict validator exits 0 with 0 errors and 0 warnings |
| 008/008 source validator | PASS: strict validator exits 0 with 0 errors and 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|-------------|
| `review/001-post-program-cleanup-review/review-report.md` (NEW) | Created | Phase 1 audit findings and Tier A planning record |
| `spec.md` (NEW) | Created | Cleanup scope, requirements. Acceptance scenarios included. |
| `plan.md` (NEW) | Created | Implementation phases and verification strategy |
| `tasks.md` (NEW) | Created | Atomic task ledger with evidence rows |
| `checklist.md` (NEW) | Created | Verification checklist for L2 gates |
| `description.json` (NEW) | Created | Packet discovery metadata |
| `graph-metadata.json` (NEW) | Created | Packet graph metadata and derived status |
| `implementation-summary.md` (NEW) | Created | Disposition table covering all seven findings |
| `../../../005-memory-indexer-invariants/implementation-summary.md` | Modified | Refreshed strict-validator freshness. CHK-T15 preserved as deferred. |
| `../../../005-memory-indexer-invariants/graph-metadata.json` | Modified | Refreshed metadata save timestamp. CHK-T15 status preserved. |
| `../001-fix-memory-indexer-storage-boundary/graph-metadata.json` | Modified | Status updated from `planned` to `complete` |
| `../002-fix-additional-release-readiness-findings/graph-metadata.json` | Modified | Status updated from `planned` to `complete` |
| `../../../006-skill-advisor/002-skill-graph-daemon-native-advisor-tools/graph-metadata.json` | Modified | Status updated from stale to `complete` |
| `../../../000-release-cleanup/spec.md` | Modified | Added `005-review-remediation` to the phase map |
| `../../../spec.md` | Modified | Refreshed root row for `000-release-cleanup/` |

### Follow-Ups

- Fix `check-phase-links.sh:39` undeclared `phase_dir` variable that causes `validate.sh:898` to run evidence-marker lint against a literal child-glob pattern. Requires editing `.opencode/skills/system-spec-kit/scripts/rules/check-phase-links.sh`, which was outside the approved 026 write boundary. Tracked as T016.
- Address historical leaf-packet template debt in 011 child packets 010-017 after the validator variable leak is fixed. A separate broad hygiene packet will be needed to resolve missing evidence markers. Missing internal references and custom template headers are also in scope for that packet.
