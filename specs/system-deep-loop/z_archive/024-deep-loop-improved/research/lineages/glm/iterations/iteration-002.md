# Iteration 002 — Re-verify: Phase Documentation Map Draft Drift (Round-1 F-001)

**Focus:** Phase-parent spec.md Phase Documentation Map status columns.
**Angle:** Re-verify 002 and 003 phase parents; quantify the row count.

## Findings

**002-deep-loop-runtime/spec.md:** Parent METADATA `Status: Complete` (line 55), but the Phase Documentation Map lists **all 18 children at "Draft"** (lines 123-140: 001-018 all Draft).

**003-deep-loop-workflows/spec.md:** Parent `Status: Complete` (line 45), but the Phase Documentation Map lists **all 12 children at "Draft"** (lines 105-116: 001-012 all Draft).

**Verdict: STILL LIVE.** 40 rows across just these two parents remain stuck at Draft while every child's own implementation-summary.md claims 100%. Round-1's recommendation (`step_phase_map_status_sync` in `speckit:complete`) was never implemented — 009/004-phase-doc-map-and-completion-pct-sync was scaffolded (Tier 1) but does **not exist as a folder** (009 has only 3 child folders: 001,002,003).

## Evidence
[SOURCE: 002-deep-loop-runtime/spec.md:55,123-140]
[SOURCE: 003-deep-loop-workflows/spec.md:45,105-116]
[SOURCE: 009-research-backlog-remediation/ — only 3 child folders exist, 004 missing]

## newInfoRatio: 0.6 (confirmed persistence + new detail that the planned fix-phase 009/004 doesn't even exist yet)
