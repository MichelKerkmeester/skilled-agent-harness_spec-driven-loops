# Deep Research Strategy - ds-a (fanout lineage)

## 2. TOPIC
Analyze the 036 phase-parent child phase folders (~50, `^[0-9]{3}-`). Determine (1) feasibility/benefit of merging them into fewer, larger multi-phase groups for context optimization; (2) HOW - which child folders cluster into which fewer bigger multi-phase parents, by theme/dependency, with optimized names; (3) the full migration plan - renaming, and updating ALL references and JSONs (parent+child graph-metadata children_ids, spec.md phase documentation map, cross-refs, description.json, validate.sh manifest); (4) CRITICAL - a timeline.md design that records which spec folder was worked on first and which came after, so chronological lineage survives any renumbering (derive order from git history and graph-metadata created/updated timestamps). Ground every grouping in actual on-disk folders and their metadata; research/proposal only - do not restructure anything.

## 3. KEY QUESTIONS (remaining)
<!-- ANCHOR:key-questions -->
- [ ] KQ1: Is consolidation into fewer larger multi-phase parents feasible and beneficial for context optimization?
- [ ] KQ2: Which child folders cluster into which multi-phase parents (by theme/dependency, optimized names)?
- [ ] KQ3: What is the full migration plan (renames + ALL reference/JSON updates)?
- [ ] KQ4: How should timeline.md be designed so chronological lineage survives renumbering?
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
- Do NOT restructure, rename, or modify any folder outside the bound lineage dir.
- Do NOT touch any path outside `057-phase-consolidation-research/research/lineages/ds-a`.
- This is research/proposal only; no execution of the migration.

## 5. STOP CONDITIONS
- Max iterations (5) reached.

## 6. ANSWERED QUESTIONS
<!-- ANCHOR:answered-questions -->
[None yet]
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
- Census via `ls` + python diff of children_ids vs on-disk confirmed 44 non-host child folders, all in sync with parent graph-metadata children_ids.

## 8. WHAT FAILED
- (none yet)

## 9. EXHAUSTED APPROACHES (do not retry)
(none yet)

## 10. RULED OUT DIRECTIONS
(none yet)

## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Saturated: none yet

## 11A. CARRIED-FORWARD OPEN QUESTIONS
(none yet)

## 11. NEXT FOCUS
Iteration 1: Full on-disk census - inventory all 44 child folders' spec.md titles/purposes, plan/tasks/checklist presence, child-phase structure, and identify the structural distinction between leaf children vs phase-parent children.
<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- Spec host: `specs/system-deep-loop/036-deep-loop-innovation/057-phase-consolidation-research`
- Parent: `specs/system-deep-loop/036-deep-loop-innovation/` (phase parent, has `graph-metadata.json` with 44 children_ids; `spec.md`; `description.json`)
- On disk: 45 dirs matching `^[0-9]{3}-`; 44 are child phases (excl. 057 host). All 44 present in parent children_ids; no orphans.
- Note: numbering has gaps (034, 036-046 absent); there is a `033-dispositions.md` file alongside 033 dir; later dirs 047-056 exist. 057 is the host.
- 001-003, 005, 015-035, 050-056 appear to be leaf children (have plan.md/tasks.md/checklist.md directly). 004, 006-014, 047, 048, 049 appear to be phase-parent children (have their own `NNN-name/` subdirs + spec.md + graph-metadata.json).

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (treat as telemetry only; broaden angles instead of early synthesis)
- Stop policy: max-iterations
- Write authority: ONLY `.../057-phase-consolidation-research/research/lineages/ds-a/`
- Started: 2026-08-13T09:10:00Z
