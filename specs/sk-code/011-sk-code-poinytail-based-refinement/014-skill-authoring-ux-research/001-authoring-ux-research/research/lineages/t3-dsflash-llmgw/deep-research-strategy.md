# Deep Research Strategy - Session Tracking (final)

## 2. TOPIC
Skill authoring UX research for sk-create-skill and system-skill-advisor: for error classes E1-E5, find the root cause inside these two skills (or the generator/check they own) and the smallest change that prevents the error at authoring time, for repository maintainers and external skill authors.

## 3. KEY QUESTIONS (remaining)

- [x] Q1: E1 - root cause and smallest authoring-time fix (answered in iterations 1-2, consolidated 9-10)
- [x] Q2: E2 - root cause and smallest fix (answered iteration 3)
- [x] Q3: E3 - root cause and smallest fix (answered iterations 4-5)
- [x] Q4: E4 - root cause and smallest fix (answered iteration 6)
- [x] Q5: E5 - root cause and smallest fix (answered iteration 7)

## 4. NON-GOALS
- Implementing any fix; research only, no edits outside the lineage directory.
- Editing .skilled/, AGENTS.md, CLAUDE.md, REPO RULES.md.

## 5. STOP CONDITIONS
- Reached: maxIterations (10 of 10) with all questions answered; convergence-threshold stop not reached (ratios stayed above 0.05 until the final consolidation iterations).

## 6. ANSWERED QUESTIONS
- Q1 (E1): stored projections with out-of-loop mint triggers; extend the pre-commit staged-hub dispatch and wire existing checks into CI.
- Q2 (E2): hand-allocated, multiply-stored version with a local-only allocator and doctor-time parity; one command bumps all carriers; warn set emptied.
- Q3 (E3): split vocabularies (description.json inert), two operator-gated reindexes, no counter-signal lane; wire existing checks, source description.json, values before anti-signals.
- Q4 (E4): closed option schema in the only automated caller; thread surfaceHint through the spawn.
- Q5 (E5): third check plane with no edit-loop trigger; extend the pre-commit dispatch with the scoped checker and umbrella.

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
- Running the read-only checks (leaf gate, route guard, intent-signals, freshness panel, parent-skill-check) turned classes into live defects with repair commands.
- Searching for a generator's callers decided prevention states better than reading its quality.

## 8. WHAT FAILED
- An early assumption that no hook surface exists (corrected in iteration 1: hooks are machine-global).
- An echo-after-pipe captured tail's exit instead of node's (corrected in iteration 2).
- The first citation auditor regex missed dash ranges (corrected in iteration 9).

## 9. EXHAUSTED APPROACHES (do not retry)
[None]

## 10. RULED OUT DIRECTIONS
- See research.md §2 Rejected Ideas (new-file hooks/registries/linters, derive-on-read, auto-reindex, standalone bump script, composite-convergence claim, and others).

## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0; Failed pivots: 0; Saturated: none; Remaining frontier: none

## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None — all five answered; residual uncertainty is disclosed in research.md, not open work]

## 11. NEXT FOCUS
[Complete — synthesis written to research.md; implementation phases ranked in §3]
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
- Lineage artifact dir: specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/research/lineages/t3-dsflash-llmgw
- Research packet: specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research
- Evidence base: sk-code epic children 002-011; hook/CI/doctor planes; generator/validator code paths.
