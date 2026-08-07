# Iteration 007 — Adversarial verification of the load-bearing seams

Focus: stress the claims the whole program rests on, by reading the exact lines rather than trusting the inferences from iters 1-6. Two confirmed, two corrected. Status: thought/verification (no new design, sharpens existing).

## CONFIRMED

- **The truncation floor is real and central.** `confidence-truncation.ts:35 const DEFAULT_MIN_RESULTS = 3;` and `:106 const minResults = options?.minResults ?? DEFAULT_MIN_RESULTS;`. The inherited parent claim holds at file:line. Every retrieval-class verdict's C2 gate is therefore correctly grounded. [CONFIRMED]

- **The non-mutating reviewer is the right machine to extend (A1).** `reviewPostSaveQuality` exists with the exact `{severity, field, message, fix}` contract, a composite blocker (`post-save-review.ts:1041`), and a bounded penalty (`:1077`). It is wired into the live save workflow. [CONFIRMED]

## CORRECTED (these sharpen the build design)

### Correction 1 — the A1 reviewer seam is `workflow.ts:1854`, not `generate-context.ts main()`

I asserted the post-save reviewer runs inside `generate-context.ts`. The actual call site is `core/workflow.ts:1854-1860`:
```
const { reviewPostSaveQuality, printPostSaveReview } = await import('./post-save-review.js');
const reviewResult = reviewPostSaveQuality({ savedFilePath, collectedData, ... });
printPostSaveReview(reviewResult);
```
**Revised A1 seam:** the A1 hooks split across two files, not one:
- **H1 (metadata-JSON scoring)** → `generate-context.ts:398 atomicWriteJson` (where description.json/graph-metadata.json are written). Score the JSON object right before the atomic write.
- **H2 (authored-doc-body review extension)** → `workflow.ts:1854` (where `reviewPostSaveQuality` already runs). Extend the reviewer's input to optionally carry the spec.md/plan.md body and add the `computeMemoryQualityScore` advisory call THERE.
This is a more accurate seam map and does not change the design's substance (reuse the non-mutating reviewer; pure scorer; no body auto-fix) — only the file where H2 lands.

### Correction 2 — `run-eval-v2.mjs` does NOT yet gate; the regression gate (C2-2) is fully net-new

I read `:357 process.exitCode = 1` as "an existing regression-gate hook point." Reading the surrounding lines (`:351-358`), it is the **catch handler for an uncaught error in `main()`** — it fails the process on a CRASH, not on a recall verdict. The coverage gap is only a NOTE (`:307 'class absent from golden set'`), not a failing verdict. 
**Implication (strengthens C2):** the harness REPORTS prod@3 + the fidelity delta but performs NO baseline comparison and NO pass/fail gate. So C2-2 (`run-spec-recall-gate.mjs` with PROMOTION/REGRESSION modes + `spec-corpus-baseline.json`) is genuinely net-new, not an extension of an existing exit. The C2 reframe in iter 005 ("the engine exists, add a golden + a gate") is correct and is now confirmed honest: the dual-mode MEASUREMENT exists; the GATE does not. This makes C2 a real (if small) build, not a no-op.

## Net effect on the program

Neither correction weakens a verdict; both make the build map more precise:
- A1 is a two-file hook (`generate-context.ts:398` + `workflow.ts:1854`), still reuse-first, still no body auto-fix.
- C2's gate is real net-new code (not a flag flip), reinforcing that the retrieval tier stays frozen until that gate is written and green.

The two hard rails survive the adversarial pass intact: (1) no body-mutating auto-fix (structural, via the fixClass registry), (2) no retrieval promotion without a prod@3 read (and that read's gate must be built, it is not free).

## Assessment

newInfoRatio: 0.22 — no new design; two file:line corrections to existing findings and two confirmations. Diminishing returns reached; all six key questions answered with grounded seams and the load-bearing claims verified. Status: thought. Sources: `confidence-truncation.ts:35,106`; `workflow.ts:1854-1860`; `post-save-review.ts:1041,1077`; `run-eval-v2.mjs:307,351-358`.
