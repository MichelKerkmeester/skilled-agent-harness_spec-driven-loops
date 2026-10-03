# Deep Research Strategy - Jev spec-folder suggestion (feature 022)

## 1. OVERVIEW

Lineage `deepseek` of the 008-folder-suggestion-research fan-out. Stop policy max-iterations (5); run completed at the cap with all five brief questions answered. Executor: cli-pi deepseek-v4.1-flash.

---

## 2. TOPIC

Improve, refine and expand the Jev spec-folder suggestion (cli-jev feature 022): what drove the recorded keep verdict, how to raise accuracy or lower cost, how to make the measurement trustworthy, where else in `.skilled` the same judgment pays off, and what a default-on integration needs, costs and risks.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

None. All five answered; residuals carried in `research.md` Section 12.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- No scorer/validator change, no implementation in this lineage.
- No live model calls, no `jev` invocation, no network egress.
- No writes outside this lineage directory.

---

## 5. STOP CONDITIONS

- Max iterations reached (5 of 5) -- terminal.
- Contradiction between corpus provenance and recorded run -- none found.
- Write surface breach -- none occurred.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Q1 what drove the result -- iteration 1 (F1-01..F1-08): sign test drove the keep; baseline collapsed to the top alternative because the fixture's target column is wrong on every row; one semantic near-tie loss; zero flips.
- Q2 accuracy/cost -- iteration 2 (F2-01..F2-08): description-collision fix for accuracy; confidence-gated passes (-42%) and margin gating for cost; per-save unit ~1s; no price receipt.
- Q3 measurement trust -- iteration 3 (F3-01..F3-08): fixture not transcript draw, dead target column, thin label provenance, unpinned artifacts; fixes T1-T7.
- Q4 pay-off map -- iteration 4 (F4-01..F4-08): four copies in the save flow; auto-detect near-ties highest value; sibling features 019/020/021 already monetize the pattern.
- Q5 default-on -- iteration 5 (F5-01..F5-08): six missing prerequisites; S1 flag-gated interactive first; risks and checklist recorded.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Reading the scorer top-to-bottom before interpreting counts: the verdict math and the baseline switch are both plain code (iterations 1, 2).
- Diffing the repository fixture against the scored corpus field-by-field: exposed the null-label gap and the label==own-folder pattern in one shot (iteration 1).
- Aggregating `calls.jsonl` for pick_prob and wall-time: turned "cost" into measured units and exposed the confidence-gate opportunity (iteration 2).
- Tracing provenance through 042/047 packet docs: explained why a fixture exists at all (iteration 3).
- Surveying call sites in the save flow: found the unbuilt copies of the judgment with their gates already present (iteration 4).
- Using the measured gates and timeouts as the integration's real constraints instead of designing in the abstract (iteration 5).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- No approach failed outright. Two limits were recorded rather than worked around: token/price receipts do not exist in the run evidence, and the auto-detect low-confidence frequency has no census.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Basename-index description resolution -- EXHAUSTED (iteration 2, evidence F2-02)
- What was tried: relying on `buildDescriber`'s global basename index to describe options.
- Why exhausted: 1 of 46 distinct option names is non-unique across `specs/` and silently degrades to the bare name; the lost row is exactly the row it hit.
- Do NOT retry: the basename-index path for save-time option text. Path-resolve instead.

### Fixture target column -- EXHAUSTED (iteration 3, evidence F3-02)
- What was tried: treating the fixture's target as one of the free answers.
- Why exhausted: wrong on 40/40 by construction; provides no information.
- Do NOT retry: target-based claims from this corpus.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- One fixed pass as the scoring protocol: kills W/L basis and F (F2-08).
- Order-rotation reduction as an accuracy lever: F=0 (F1-06).
- "+97.5 points over the default": manufactured target failure (F3-02).
- Discarding the verdict over corpus provenance: the arithmetic is sound (F3-08).
- Hard-block override by model pick: rejected on policy (F5-08).
- Default-on immediately: fails 047 D6 and the prerequisite list (F5-08).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: Q1 mechanism (one pass closed it); cost quantification (only where receipts exist)
- Pivot lineage: none
- Remaining frontier: real-transcript corpus (T1), adjudicated labels (T2), auto-detect frequency census, price receipts
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Does the keep survive a real-transcript corpus with genuine targets? (T1)
- Are the 10 W and 1 L labels right? (T2)
- Price per fire and fires per week? (no receipt, no census)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Follow-up implementation track (not this research): R1 real-transcript corpus -> R2 description resolution -> R3 label adjudication -> R4 artifact pinning -> R5 flag-gated interactive suggestion -> R6 its own decision record.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Scorer, validator, call sites, corpus and run artifacts are indexed in `resource-map.md`; the full synthesis is `research.md`.
