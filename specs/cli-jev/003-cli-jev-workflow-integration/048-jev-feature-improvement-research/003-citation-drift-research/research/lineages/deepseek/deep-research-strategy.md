# Deep Research Strategy - Variation Season for the Citation Drift Scan

## 1. OVERVIEW

Topic: Improve, refine and expand the Jev citation drift scan (cli-jev feature 032) with file:line evidence.

Executor: cli-pi model=deepseek-v4.1-flash (fan-out lineage deepseek, session fanout-deepseek-1790979783604-glohfs).
Stop policy: max-iterations, cap 5. All five iterations ran; convergence was telemetry only.

---

## 2. TOPIC
Improve, refine and expand the Jev citation drift scan (cli-jev feature 032) with file:line evidence.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Q1: What drove the measured result K=40 M=40 A=35 B=13 W=22 L=0 TP=26 FP=0 F=3 p=2.384e-7?
- [x] Q2: How can the scan's accuracy be raised or its cost lowered?
- [x] Q3: How can the measurement be made more trustworthy?
- [x] Q4: Where else in .skilled would the same judgment pay off?
- [x] Q5: What would a default-on integration need, and at what cost and risk?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Changing the scorer or any live workflow; this lineage researches only.
- Re-measuring feature 032; phase 047 owns the measurement.
- Judging other Jev features on their own merits.

---

## 5. STOP CONDITIONS
- 5 iterations reached (max-iterations; the runner's cap). Reached.
- Operator pause sentinel, or an unrecoverable state. Not triggered.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- **Q1 (iteration 1):** The verdict is the pre-registered keep rule over a 31/40-drifted sample scored against a weak comparator; margin from baseline weakness, not near-perfect accuracy; replay reproduces the column exactly. [iteration-001.md]
- **Q2 (iteration 2):** Free accuracy via aggregation and the payload unit; cost dominated by the 8,667-doc census (82 with citations); model side 121 calls/41s; adaptive reruns ~65 calls. [iteration-002.md]
- **Q3 (iteration 3):** Pooled p dominated by the constructed half (live-only 6-0, p=0.0156) though both halves independently keep; binary label kappa 0.79-1.00; comparator blind to same-file moved windows; replay needs calls.jsonl; dead half finds only fixture noise. [iteration-003.md]
- **Q4 (iteration 4):** specs/** is the real adjacent corpus (12,092 citing docs vs 82); neighbors check deadness/path only; mirrors and repo-rules are null; 41% of in-scope citations are invisible and mostly illustrative; per-corpus draws keep model cost flat. [iteration-004.md]
- **Q5 (iteration 5):** Needs a reader and an advisory-only policy; periodic cadence (minutes today, seconds after the read fix); label lifecycle = frozen benchmark + explicit re-draws; widen requalification; per-row record; risk register recorded. [iteration-005.md]
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Replaying and re-scoring from recorded artifacts; splitting every statistic by row kind (iterations 1-3).
- Computing label reliability from committed rater drafts; per-corpus censuses; sampling unresolved rows (iterations 3-4).
- Assembling constraints into an integration shape with a risk register (iteration 5).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- "Construction rows inflate", "fewer reruns fix the misses", "constructed half inflates the keep", "blind labels unreliable", "mirrors carry copied citations", "pre-commit hook fits", "auto-labeling" — all failed and are recorded.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[None; all lines of inquiry produced evidence.]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- "Construction rows inflate the headline accuracy" (iteration 1).
- "The result is a threshold artifact" (iteration 1).
- "Fewer reruns will fix the misses" (iteration 2).
- "The misses are pure model error" (iteration 2).
- "The keep is an artifact of the constructed half" (iteration 3).
- "The blind labels are unreliable" (iteration 3).
- "Expand to runtime mirrors and repo rules" (iteration 4).
- "Path-only references are the same judgment" (iteration 4).
- "Wire the scan into the pre-commit hook" (iteration 5).
- "Auto-label the draw with a model" (iteration 5).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Does the paragraph-unit fix survive re-labeling? (iteration 2; open)
- Does a strengthened comparator leave the keep intact? (iteration 3; open)
- Who owns the periodic advisory run and its cadence? (iteration 5; open)
- Can the illustrative-reference classifier be deterministic? (iteration 4; open)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
None — all five questions answered; synthesis written to research.md. The ranked recommendations (R1-R12) are the handoff.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- The measurement: live Jev run 2026-10-01 (report at ~/.skilled/.labels/runs/032-jev-20261001/): K=40 M=40 A=35 B=13 W=22 L=0 TP=26 FP=0 F=3 p=2.384e-7; census 357 citations (208 in_range, 44 ambiguous, 103 unresolved, 2 dead); latency p50 326ms; model jev-1.13.0; verdict keep.
- Iterations 1-5 details in the matching iteration files; key numbers: live-only p=0.015625; binary label kappa 0.793-1.000; 20/20 constructed windows contain sentence tokens; specs holds 12,092 citing docs; skills docs hold 43,523 path-only refs; census reads 8,667 docs for 82 citing.
- Labels (042): seed 20260929, drawn at ebcc68e8edb4; drafts and split table committed under 042 scratch.
- Scorer: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs (1,398 lines at HEAD 1f7746def8; Deem arm removed in 7c2bb6e3d1).

### Bounded Context Snapshot

- Source pointers: cite-drift-scan.mjs; test file; catalog entry; playbook scenario; 042 scratch evidence; check-ac-coverage.sh; validate_catalog_package.py.
- Integration points: sk-doc validation surface; Jev CLI (pinned 0.6.2); spec validation (validate.sh); ACC coverage.
- Constraints: research only; write surface is this lineage directory.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5 (from config)
- Convergence threshold: 0.05 (telemetry only)
- Stop policy: max-iterations
- Progressive synthesis: true
- Lifecycle: new lineage, generation 1
- Machine-owned sections updated by this executor after each iteration
- Started: 2026-10-02T22:39:34Z
