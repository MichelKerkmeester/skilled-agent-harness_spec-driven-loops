---
title: "Memory Indexer Invariants Phase Changelogs"
description: "Index of phase-level changelogs for the 026/005 memory-indexer-invariants track. Each entry documents what was reviewed, what shipped, and what remained open in plain terms."
trigger_phrases:
  - "memory indexer invariants changelog"
  - "005 memory indexer history"
  - "indexer invariants phase index"
  - "memory indexer phase changelog"
  - "005-memory-indexer-invariants changelog"
importance_tier: "normal"
contextType: "implementation"
---

# Memory Indexer Invariants Phase Changelogs

A single review sub-phase shipped on 2026-04-29 that validated the full memory-indexer-invariants packet. The broader 005 track established correctness guarantees for embedding generation, deduplication, content hashing, and storage consistency in the indexed-continuity store across two coordinated tracks:

- **Track A** closes the `E_LINEAGE` and `candidate_changed` save-path regressions through a PE orchestration downgrade guard and a scan-originated `fromScan` bypass. Before the fix, a scan produced 68 `E_LINEAGE` and 58 `candidate_changed` errors. Code-level fixes shipped with 26 of 26 focused regressions passing.
- **Track B** enforces permanent index-scope exclusions (`z_future`, `external`) and stops constitutional-tier pollution through a shared SSOT path-scope helper plus multi-layer defense at the save, SQL, post-insert, checkpoint, and cleanup surfaces. The cleanup removed 5,947 `z_future` rows and 5,698 invalid constitutional rows from the live database, leaving exactly 2 legitimate constitutional rows.
- **Wave-1** closed three storage-layer bypasses: SQL-layer tier downgrade, atomic checkpoint restore validation, and governance audit emission.
- **Wave-2** hardened the packet with cleanup-audit durability, realpath canonicalization, walker DoS caps, and shared governance-audit helpers.

The packet ships at Level 3 with full spec docs: `spec.md` (399 lines, 13 sections), `plan.md` (341 lines), `tasks.md` (189 lines), `checklist.md`, `decision-record.md` (ADR-001 through ADR-012), and `implementation-summary.md` (248 lines, 4 known limitations). Two git commits touched the review sub-phase: `8c8c3fcc42` (deep-review program setup) and `eafdd60678` (follow-up stress-test catalog update).

## Phases (chronological)

| Phase | Date | Title | One-line story |
|-------|------|-------|----------------|
| 005-pt-01 | 2026-04-29 | [Memory indexer invariants review](../../../006-operator-tooling/001-hook-parity/005-fix-opencode-plugin-loader-bridge/changelog-005-opencode-plugin-loader-remediation-review-pt-01.md) | Deep review validated both invariant tracks across 92 file reads, found 1 P1 and 13 P2 items, and confirmed the packet is CONDITIONAL pending a storage-boundary fix and a live MCP rescan. |

## How to read these

Each phase changelog follows the canonical nested-changelog template at `.opencode/skills/system-spec-kit/templates/changelog/phase.md`. Sections are:

- **Summary**: what changed and why it matters, in plain language
- **Added**: new capabilities or surfaces
- **Changed**: behavior changes to existing features
- **Fixed**: bugs closed
- **Verification**: how we proved the change works
- **Files Changed**: source paths with one-line descriptions
- **Follow-Ups**: known deferred items

For review-only phases, the Added, Changed, and Fixed sections read "None - review-only phase." The Verification section cites the review report and finding counts. Follow-Ups list active P1 and P2 items from the review.

Voice rules per `.opencode/skills/sk-doc/references/global/hvr_rules.md` apply throughout. Technical jargon on first use includes a brief parenthetical definition.

## Where to find the full story

- Track-level spec: `spec.md` (399 lines, 13 sections)
- Implementation plan: `plan.md` (341 lines)
- Task breakdown: `tasks.md` (189 lines)
- Verification checklist: `checklist.md`
- Decision records with alternatives and five-checks evaluation: `decision-record.md` (ADR-001 through ADR-012)
- Implementation summary with before/after DB counts: `implementation-summary.md` (248 lines, 4 known limitations)
- Deep review report: `review/005-memory-indexer-invariants-pt-01/review-report.md` (148 lines, 9 sections, finding registry with evidence excerpts and file:line citations)

All paths are relative to `026-graph-and-context-optimization/005-memory-indexer-invariants/`.

## Authoring conventions

File names use the pattern `changelog-<phase>-<short-name>.md`. One file per shipped phase regardless of commit count. HVR rules are non-negotiable: no em-dashes, no semicolons in narrative prose, active voice throughout.
