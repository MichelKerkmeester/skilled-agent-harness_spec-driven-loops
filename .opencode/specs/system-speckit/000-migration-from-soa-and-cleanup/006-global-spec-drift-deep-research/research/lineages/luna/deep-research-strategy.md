---
title: Deep Research Strategy — Luna Lineage
---

# Deep Research Strategy

## 2. TOPIC
spec drift and prior context-optimization efforts across all `.opencode/specs/*`

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Where do current specs, implementation evidence, and generated metadata disagree?
- [x] What prior context-optimization efforts exist, and which patterns recur across packets?
- [x] Which drift is systemic versus packet-local, and what evidence supports that distinction?
- [x] Which remediation or governance patterns were already attempted, with what outcomes?
- [x] What evidence gaps remain before a cleanup plan can be trusted?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
No implementation, no parent-spec edits, no memory/continuity writes, and no claims about files outside `.opencode/specs/*` except as cited context.

## 5. STOP CONDITIONS
Stop at legal convergence or iteration 10, whichever comes first; preserve unresolved contradictions as open questions.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What prior context-optimization efforts exist, and which patterns recur across packets?
- Which drift is systemic versus packet-local, and what evidence supports that distinction?
- Which remediation or governance patterns were already attempted, with what outcomes?
- What evidence gaps remain before a cleanup plan can be trusted?

<!-- /ANCHOR:answered-questions -->

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- filesystem inventory exposed scale and cluster boundaries quickly. (iteration 1)
- selecting packets with explicit context/migration terms exposed governance patterns rather than isolated fixes. (iteration 2)
- prior audit packets contain direct source checks and correction history, making them reliable evidence about drift mechanisms. (iteration 3)
- correction summaries expose not only fixes but the controls and failure modes around them. (iteration 4)
- counts plus filename sampling exposed scale and contamination. (iteration 5)
- parent governance sections explicitly state ownership. (iteration 6)
- audit packets expose ruled-out/current surfaces. (iteration 7)
- repeated patterns converged into stable evidence classes. (iteration 8)
- explicit scope and authority rules reconcile apparent status conflicts. (iteration 9)
- repeated evidence patterns were stable across independent packet families. (iteration 10)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- code graph cannot contribute because its index is empty. (iteration 1)
- status fields cannot be compared without their scope and authority sections. (iteration 2)
- existing status labels cannot be trusted without their validator semantics. (iteration 3)
- no single packet owns all drift classes; governance is distributed. (iteration 4)
- directory-wide metadata parity overcounts scratch and backup material. (iteration 5)
- no shared cross-family metadata authority table was found. (iteration 6)
- no shared confidence scale. (iteration 7)
- corpus-wide denominator remains unavailable. (iteration 8)
- prevalence cannot be promoted from qualitative to quantitative. (iteration 9)
- the hard cap arrives before a manifest-scoped prevalence sweep. (iteration 10)

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
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Follow up on: Not established: a trustworthy global defect count, a complete cross-family authority map, or current truth for every archived/fixture path. [SOURCE: iterations 5, 6, and 9]

<!-- /ANCHOR:next-focus -->

## 12. KNOWN CONTEXT
resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot
- Source pointers: `.opencode/specs/**/spec.md`, `implementation-summary.md`, `research/research.md`, and `research/iterations/`.
- Integration points: packet metadata, generated status files, deep-research artifacts, and migration/context terminology.
- Constraints: all authored outputs remain in the `luna` lineage directory; parent packet and memory surfaces are read-only.

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls
- Progressive synthesis: true
- Canonical synthesis: lineage-local `research.md`
