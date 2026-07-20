# Deep Research Strategy: Packet 036 Drift Census

## 1. Research Topic
Revalidate phases 003-017 of packet 036 against `0ce43ff589..HEAD`, separating first-order path/symbol drift from second-order premise drift and producing a fully evidenced verdict for every phase.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which paths, files, globs, symbols, and dependencies named by phases 003-017 no longer resolve, including phase 003's required positive controls?
- [x] Which phase premises are now false because registered-mode counts, routing defaults, taxonomy, or planned capabilities changed or already shipped?
- [x] Does the packet-033 benchmark dependency survive its renumber, and what exact benchmark location should phases 003 and 016 use now?
- [x] What is the explicit verdict for each phase 003-010, with commit SHA and path:line evidence?
- [x] What is the explicit verdict for each phase 011-017, including at least one genuinely clean negative control, with commit SHA and path:line evidence?

<!-- /ANCHOR:key-questions -->

## 3. Non-Goals
- Do not repair packet 036 or implement any planned phase.
- Do not write outside this detached lineage artifact directory.
- Do not treat previously catalogued phase-number reference corruption as new drift unless a post-baseline commit independently changed the relevant contract.

## 4. Stop Conditions
- Every phase 003-017 has an explicit `still valid`, `needs refinement`, or `invalidated` verdict.
- Every verdict has commit SHA plus path:line evidence, or a no-drift statement naming checked surfaces and the baseline comparison.
- Both positive controls, the packet-033 dependency, the phase-013 mode-count question, and at least one negative control are resolved.
- Legal convergence passes after at least three evidence iterations, or iteration 10 is reached.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which paths, files, globs, symbols, and dependencies named by phases 003-017 no longer resolve, including phase 003's required positive controls?
- Which phase premises are now false because registered-mode counts, routing defaults, taxonomy, or planned capabilities changed or already shipped?
- Does the packet-033 benchmark dependency survive its renumber, and what exact benchmark location should phases 003 and 016 use now?
- What is the explicit verdict for each phase 003-010, with commit SHA and path:line evidence?
- What is the explicit verdict for each phase 011-017, including at least one genuinely clean negative control, with commit SHA and path:line evidence?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Which additional paths, globs, symbols, and dependencies in phases 004-017 no longer resolve? (iteration 1)
- What is the explicit final verdict for every phase 004-017? (iteration 1)
- Which phase premises changed because mode counts, routing defaults, taxonomy, or capabilities changed or shipped? (iteration 1)
- Which phase can serve as a genuinely clean negative control? (iteration 1)
- What is the explicit evidence-backed verdict for every phase 003-010 after combining first-order and second-order findings? (iteration 3)
- Which remaining phases besides 005 and 013 have second-order premise drift from shipped capabilities, routing semantics, or authority changes? (iteration 3)
- What is the explicit evidence-backed verdict for every phase 011-017, carrying phase 004 as the clean negative control? (iteration 3)
- Which phase-006 through phase-012 capabilities already shipped partially or completely? (iteration 4)
- Does phase 016 require only benchmark-path and taxonomy refinement? (iteration 4)
- Which phase-006 through phase-012 capabilities have already shipped partially or completely in the current runtime? (iteration 4)
- Have phase-014 authority semantics or phase-015 retirements already landed? (iteration 4)
- Have any phase-014 authority semantics or phase-015 legacy retirements already landed? (iteration 4)
- Does phase 016's executable gate inventory need only path/taxonomy refinement, or broader contract changes? (iteration 4)
- Have phase-014 authority semantics or phase-015 legacy-writer retirements already landed? (iteration 5)
- Does phase 016 require only benchmark-path and taxonomy refinement, or broader gate changes? (iteration 5)
- Does the reconciled final 003-017 matrix consistently carry every final verdict, refinement, commit, confidence, and path:line citation? (iteration 6)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 13. Known Context
- Baseline: `0ce43ff589` dated 2026-07-16.
- Operator reports 204 commits after baseline, 183 AI-co-authored, and 22 touching `.opencode/skills/system-deep-loop`.
- Required positive controls: commit `cc77a1e550a` renamed two runtime reference files named by phase 003, and phase 003's `behavior_benchmark/` glob should match zero directories.
- Required mode-count commits: `6cd8ab14e4e`, `708d25acf04`, and `908efde8d8f`.
- Root packet says eight research workstreams but distinguishes them from public workflow modes.
- No packet-local resource map exists; coverage must come from the phase docs, commit range, and current tree.

## 14. Research Boundaries
- Maximum iterations: 10
- Convergence threshold: 0.05
- Stop policy: convergence
- Per-iteration tool budget: 12 calls
- Progressive synthesis: false
- Allowed writes: this detached lineage directory only
