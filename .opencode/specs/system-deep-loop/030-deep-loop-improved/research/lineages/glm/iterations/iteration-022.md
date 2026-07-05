# Iteration 022 — NEW: 001-reference-research Template plan.md (Weak Evidence Phase)

**Focus:** Phase 001 plan.md — is it still a verbatim template under Complete status?
**Angle:** Expand coverage into phase 001 (round 1 only sampled it).

## Findings

**001-reference-research/plan.md is STILL a verbatim template:**
- Title: `"Implementation Plan: Phase 1: reference-research [template:level_1/plan.md]"`
- `last_updated_by: "template-author"`
- `next_safe_action: "Replace template defaults on first save"`
- `completion_pct: 0`

Yet 001's parent (030 root spec.md:98) lists phase 001 as **Complete** ("50-iteration mining of loop-cli-main + kasper → 40 recommendations"). So phase 001 — the foundational research phase that produced the entire backlog — has a template-default plan.md while claiming Complete.

**However**, 001 DOES have a real `research/research.md` (the 40-recommendation output) and a real `implementation-summary.md` (round 1 noted this). So the WORK is done; only the plan.md scaffold was never finalized. This is the same "work-done-scaffold-not-finalized" pattern as 008's tasks.md.

**Weak-evidence assessment (round-1 F-010 deepened):** 001's tests-vs-evidence — the 50-iteration mining was a research loop, not code, so "tests" don't apply. But the plan.md claiming 0% while impl-summary claims completion is the canonical completion_pct contradiction. The root cause is the same: plan.md is created from template at scaffold time and never touched again.

**Scope of template-default plan.md:** this affects 001, 008-parent, and likely others. A systematic check (rg "template:level_1/plan.md" / "template:level_1/tasks.md") would enumerate all instances. This is exactly what 009/010-validate-sh-template-detection (Tier 2, doesn't exist) is meant to catch.

## Evidence
[SOURCE: 001-reference-research/plan.md:2,16,18,25 — template markers + completion_pct:0]
[SOURCE: 030 spec.md:98 — phase 001 "Complete"]

## newInfoRatio: 0.7 (new instance of template drift in phase 001; confirms pattern is packet-wide)
