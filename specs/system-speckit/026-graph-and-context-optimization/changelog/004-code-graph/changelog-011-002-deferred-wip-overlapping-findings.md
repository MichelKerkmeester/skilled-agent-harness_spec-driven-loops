---
title: "Code Graph Audit 002: Deferred WIP-Overlapping Findings"
description: "7 audit findings held back from the remediation pass because each either edits a file under active BUG-04/BUG-06 in-tree WIP or requires deeper semantic reconciliation. All applied edits were reverted. Findings remain open on branch cg-remediation for a deliberate follow-on pass."
trigger_phrases:
  - "deferred wip overlapping findings"
  - "code graph remediation deferred"
  - "CG-002 CG-006 CG-007 CG-008 CG-009 CG-010 CG-037 deferred"
  - "cg-remediation branch deferred findings"
  - "code graph audit wip conflict revert"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/002-deferred-wip-overlapping-findings` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit`

### Summary

The source-bug and misalignment audit surfaced 28 findings. During the remediation pass, 7 of those findings could not be safely auto-fixed. Each finding either edits a file that the operator's in-progress BUG-04 or BUG-06 work-in-progress already modifies. Alternatively it requires reconciling behavioral semantics that interact with that in-flight work.

The remediation agent applied edits in an isolated worktree seeded with the operator's WIP. Typecheck passed and the full vitest suite confirmed zero new failures against the B0 baseline. Each attempted fix was then examined individually. Fixes that were over-broad or destabilized the existing test contract were reverted. The 7 findings (CG-002, CG-006, CG-007, CG-008, CG-009, CG-010, CG-037) remain open, documented with the exact conflict or semantic gap that blocked safe application.

The outcome lives on branch `cg-remediation`. Merging is operator-gated pending settlement of BUG-04 and BUG-06.

### Added

None.

### Changed

None.

### Fixed

None.

### Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS (0 errors) |
| Full vitest suite | Failing set identical to B0 baseline (24 pre-existing WIP failures). Zero new failures introduced. |
| Findings outcome table | All 7 deferred findings recorded with conflict reason in `spec.md` and `implementation-summary.md`. |

### Files Changed

| File | What changed |
|------|--------------|
| `002-deferred-wip-overlapping-findings/spec.md` (NEW) | Finding-outcome table for CG-002, CG-006, CG-007, CG-008, CG-009, CG-010, CG-037 with per-finding deferral reason. |
| `002-deferred-wip-overlapping-findings/implementation-summary.md` (NEW) | What Was Built, Key Decisions, Verification. Known Limitations for the deferred-findings pass. |
| `002-deferred-wip-overlapping-findings/tasks.md` (NEW) | Phase 1-3 task checklist. All four completion items marked done. |
| `002-deferred-wip-overlapping-findings/plan.md` (NEW) | Phase plan scoping the triage-and-record workflow for this packet. |

### Follow-Ups

- Re-implement CG-002 numeric-range validation (min/max) after BUG-04 WIP lands on main and the dispatch guard is complete.
- Re-implement CG-006 scanPromotable freshness gating after BUG-06 readiness-mock reconciliation is done.
- Re-implement CG-007 read-path `setLastGitHead` removal after scan-side HEAD recording is added so status does not report stale.
- Re-implement CG-008 candidate-manifest source change once `ensure-ready.ts` is no longer under active BUG-06 WIP.
- Re-apply CG-009 and CG-010 together after the recovery-procedures no-op vs errored-rollback distinction is added, enabling a precise `restored !== true` check.
- Re-apply CG-037 dry-run rollback target fix alongside the apply-orchestrator changes once the CG-009/CG-010 pair are unblocked.
