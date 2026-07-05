# Iteration 008 — Re-verify: 008-Parent Template Scaffolds Under Complete (Round-1 F-010/F-015)

**Focus:** 008-loop-systems-remediation parent docs — are tasks.md/implementation-summary.md still verbatim templates?
**Angle:** Read the live parent files; check template markers.

## Findings

**008 parent `tasks.md` — STILL VERBATIM TEMPLATE:**
- Title: `"Tasks: Phase 1: loop-systems... [template:level_1/tasks.md]"`
- `last_updated_by: "template-author"`
- `packet_pointer: "scaffold/008-loop-systems-remediation"`

**008 parent `implementation-summary.md` — STILL VERBATIM TEMPLATE:**
- Title: `"Implementation Summary [template:level_1/implementation-summary.md]"`
- `last_updated_by: "template-author"`
- `next_safe_action: "Replace template defaults on first save"`
- `completion_pct: 0`

**008 parent `spec.md` — claims COMPLETE:**
- Line 27: `completion_pct: 100`
- Status: Complete

**TRIPLE CONTRADICTION:** spec.md says 100%/Complete while its own sibling tasks.md and implementation-summary.md are verbatim templates at 0%/template-author. This is the most severe instance of the scaffold-drift pattern: a phase marked Complete whose parent-level docs were never finalized from their scaffolds.

This is the exact defect codex review F001 and glm review P1-006 flagged — both registries still list it "active", correctly, because it is unfixed. 009/007-parent-scaffold-and-governance-docs was scaffolded (Tier 1) but **does not exist as a folder**.

## Evidence
[SOURCE: 008-loop-systems-remediation/tasks.md:2,16,18 — template markers]
[SOURCE: 008-loop-systems-remediation/implementation-summary.md:2,15,17,24 — template + completion_pct:0]
[SOURCE: 008-loop-systems-remediation/spec.md:27 — completion_pct:100]

## newInfoRatio: 0.6 (confirmed still live; the most acute template-vs-complete contradiction)
