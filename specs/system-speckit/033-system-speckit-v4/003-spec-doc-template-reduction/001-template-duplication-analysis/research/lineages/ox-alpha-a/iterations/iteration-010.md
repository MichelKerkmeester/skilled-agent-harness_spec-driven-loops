---
title: "Iteration 010 — Final broadening: merge-vs-two-docs legibility trade, handover non-merge guard, plan.md gate line check"
trigger_phrases: []
---
# Iteration 010 — Final broadening: merge-vs-two-docs legibility trade, handover non-merge guard, plan.md gate line check

**Focus:** Broaden before synthesis: three angles not yet explicit.

## Findings

### F-H1.1 — Merged doc vs two smaller docs for 7-30B models: merge wins under ordering discipline [ANALYTICAL]
Concern: does one ~5KB merged tasks+verification doc beat two ~2.5KB docs? Evidence says yes IF ordered by attention bias: machine contracts (frontmatter, notation anchor) at top, verification summary at bottom (F-E1.3 lost-in-the-middle U-bias favors ends). Two files cost extra: file-switch overhead in agent context, duplicated headers/frontmatter (~50 lines), and split state (the F-A1.5 T008-vs-CHK-020 duplication). Instruction density is governed by section count, not file count — the merged doc keeps the same sections. Condition: the merge must NOT stack verification protocol prose between task phases; verification content stays a contiguous gated addendum after phases.

### F-H1.2 — handover.md must NOT be folded into implementation-summary [GUARD FINDING]
[SOURCE: mcp-server/lib/resume/resume-ladder.ts:590-620] The ladder treats handover.md and the continuity block as two competing freshness sources (`freshnessWinner` resolution; `last_updated`/`updated` alias handling for handover vs `_memory.continuity.last_updated_at`). They are alternatives by design, not duplicates — merging them would destroy the fresher-source arbitration.
**Implication:** template-reduction scope correctly EXCLUDES handover.md consolidation; only its instructional comments (F-D1.1, 588B) are reclaimable.

### F-H1.3 — plan.md acceptance-gate checkbox has no validator consumer [VERIFIED]
No rule script references "All acceptance criteria met" or parses plan.md completion checkboxes (grep across scripts/rules/*.sh: no hits; AC_COVERAGE reads spec.md + checklist only; deriveStatus reads checklist/tasks/impl-summary). The plan.md.tmpl:128 line is purely workflow guidance → safe to simplify during merge-era edits without co-updates.

## Synthesis readiness assessment
All six dispatch angles now carry evidence-backed answers (Q-A1..Q-A6 resolved or draft-resolved), a ranked plan (R1-R6) exists, regression ledger compiled, eliminated alternatives logged per iteration. Ready for phase_synthesis.

## Ruled out this iteration
- Ruled OUT: folding handover.md into implementation-summary (breaks freshness arbitration).
