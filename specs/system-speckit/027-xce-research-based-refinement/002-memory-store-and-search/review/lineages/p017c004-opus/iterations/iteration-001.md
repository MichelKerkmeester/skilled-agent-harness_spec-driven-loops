# Iteration 001 — Breadth-first review (all dimensions)

**Target:** `004-confidence-calibration-labeled-set` (spec-folder)
**Executor:** cli-claude-code / claude-opus-4-8
**Mode:** review · maxIterations=1 · lineage p017c004-opus
**Dimensions covered this pass:** Correctness, Security, Traceability, Maintainability

---

## D1 — Correctness

The shipped behavior matches the implementation-summary narrative on direct read.

- **Rebalance weights.** `WEIGHT_HEURISTIC = 0.45` + `WEIGHT_SCORE_PRIOR = 0.55` sum to 1.0 [SOURCE: confidence-scoring.ts:55-56]. The blend `heuristicValue + scorePrior` is clamped to `[0,1]` [SOURCE: confidence-scoring.ts:316-318]. `rawValue` is bounded by `WEIGHT_MARGIN(0.35)+WEIGHT_CHANNEL_AGREEMENT(0.30)+WEIGHT_ANCHOR_DENSITY(0.15) = 0.80` [SOURCE: confidence-scoring.ts:45-47], so `heuristicValue ≤ 0.36` and `scorePrior ≤ 0.55` → max value 0.91 before clamp. Monotonic in relevance as claimed.
- **scorePrior uses absolute relevance, not RRF.** `resolveCalibrationScore` reads `resolveAbsoluteRelevance` when `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION` is on [SOURCE: confidence-scoring.ts:158-162], avoiding the ~0.03 RRF-magnitude trap that the 0.7/0.4 thresholds would otherwise misread. Consistent in both `computeResultConfidence` and `assessRequestQuality`.
- **Isotonic fit (PAV).** `fitCalibration` pools left while `prev.meanY > curr.meanY`, producing a non-decreasing curve; empty input returns an identity (empty-points) model [SOURCE: confidence-calibration.ts:145-183]. `applyCalibration` clamps out-of-range x to endpoint y, interpolates piecewise-linearly, guards `span <= 0` for duplicate-x points, and bounds output to `[0,1]` [SOURCE: confidence-calibration.ts:196-215]. Empty model is the identity transform.
- **Default-OFF wiring.** `maybeCalibrate` returns the input unchanged unless `isConfidenceCalibrationEnabled()` AND a model resolves [SOURCE: confidence-scoring.ts:187-192]. `isConfidenceCalibrationEnabled` is backed by `isOptInEnabled` (default OFF; only `true/1/yes/on/enabled` enable it) [SOURCE: search-flags.ts:622-623, 27-30] — distinct from the default-ON `isFeatureEnabled` used by graduated flags. The two test cases assert exactly this: model ignored when flag off, applied when flag on [SOURCE: confidence-calibration.vitest.ts:184-219]. Confirmed inert in production.
- **Model memoization.** `resolveCalibrationModel` caches by path; `undefined`=unlooked, `null`=looked-up-absent, so a missing/invalid path degrades to identity without re-reading [SOURCE: confidence-scoring.ts:164-179].

No P0/P1 correctness defects. One documented limitation (cache content-invalidation) tracked as F004 (P2).

## D2 — Security

- `loadCalibrationModel` wraps `readFileSync` and `JSON.parse` in try/catch and returns `null` on any failure or shape mismatch, so the search hot path never throws on a bad/missing model file [SOURCE: confidence-calibration.ts:104-131].
- `loadLabeledSet` rejects malformed entries loudly rather than coercing [SOURCE: confidence-calibration.ts:73-96] — but it is an offline tooling path, not the request hot path.
- Model path comes from an operator-set env var (`SPECKIT_CONFIDENCE_CALIBRATION_MODEL`), trimmed and presence-checked [SOURCE: search-flags.ts:640-644]. No untrusted-input path traversal, no credential exposure, no injection surface.

No security findings.

## D3 — Traceability / Spec-Alignment

This is the dimension that blocks a clean PASS.

- `spec.md` is still the raw scaffold: Problem/Purpose, Scope, Requirements (`REQ-001 [Requirement description]`), and Success Criteria are all unreplaced placeholders [SOURCE: spec.md:84-137]. Status field reads the template literal `[Draft/In Progress/Review/Complete]` [SOURCE: spec.md:51].
- `plan.md` is the raw scaffold (`[e.g., TypeScript...]`, placeholder phases) [SOURCE: plan.md:46-129].
- `tasks.md` is the raw scaffold — T001–T010 are template tasks, all unchecked [SOURCE: tasks.md:50-87].
- `graph-metadata.json` reports `Status: planned` and lists Key Files as `spec.md, plan.md, tasks.md` (not the shipped implementation files) [SOURCE: graph-metadata.json].
- Meanwhile `implementation-summary.md` is fully fleshed out, accurate to the code, and its continuity block asserts `completion_pct: 100` / "Shipped" [SOURCE: implementation-summary.md:16-28].

The `spec_code` core protocol cannot pass: there are no normative claims in `spec.md` to resolve against shipped behavior, and the machine-readable status (`planned`) directly contradicts the shipped state. This is a real reconciliation failure (the framework Completion Verification Rule requires spec.md status, plan/tasks, and implementation-summary to agree). Recorded as **F001 (P1)**.

## D4 — Maintainability / Completeness

- **Starter model bloat (F002, P2).** The PAV implementation only merges on a strict `prev.meanY > curr.meanY` violation [SOURCE: confidence-calibration.ts:166-175]; adjacent blocks with *equal* means are never pooled. On the perfectly-separable proxy data this yields 100 serialized points for what is effectively a 2-level step (`y=0` until x≈0.27, then `y=1`) [SOURCE: confidence-calibration-model.starter.json:3-404]. Harmless (default OFF, apply handles duplicate-x) but wasteful; the model is also a near-degenerate hard threshold, which corroborates the "UNVALIDATED proxy — do not enable" labeling rather than contradicting it.
- **Fit duplication (F003, P2).** The PAV fit is duplicated in `assets/fit-calibration.mjs` [SOURCE: fit-calibration.mjs:97-124], explicitly "mirrors lib/search/confidence-calibration.ts". Intentional (standalone .mjs seed tool can't import the TS module cheaply) but there is no drift guard, so a change to the canonical fit will silently diverge from the seed generator.
- **Cache content-invalidation (F004, P2).** Documented limitation #4 [SOURCE: implementation-summary.md:151]; acceptable for a default-OFF path.
- Positives: clear named constants, honest comments, no ephemeral artifact ids in code comments, monotonicity/bounds covered by 13 new tests.

## Verification note

`npm run typecheck` and the vitest suites are reported PASS (67/67) in implementation-summary.md:131-134. Independent re-execution was **blocked by the sandbox** in this lineage, so that figure is carried as a documented-but-not-re-run claim, not an independently confirmed result. No code defect was found on read that would contradict it.

---

## Claim Adjudication

### F001 (P1)

- **findingId:** F001
- **claim:** The packet's normative docs (spec.md/plan.md/tasks.md) and machine status (graph-metadata `planned`) do not describe or agree with the shipped, "100% complete" implementation.
- **evidenceRefs:** spec.md:51, spec.md:84-128, plan.md:46-129, tasks.md:50-87, graph-metadata.json (Status: planned), implementation-summary.md:16-28
- **counterevidenceSought:** Checked whether 004 is a phase *child* whose heavy docs live in a parent — it is a phase child under 017-…-implementation, and phase children are exactly where heavy docs must live, so the empty templates are a gap, not a parent-delegation. Checked implementation-summary for accuracy — it is accurate to the code, so the work is genuinely done.
- **alternativeExplanation:** The team may treat implementation-summary.md as the single source of truth and code-first the work, leaving scaffolds unfilled intentionally. Rejected as a downgrade basis because the `planned`-vs-`shipped` status contradiction will mislead resume/validation regardless of intent.
- **finalSeverity:** P1
- **confidence:** 0.85
- **downgradeTrigger:** Downgrade to P2 if project convention explicitly designates implementation-summary.md as the sole normative doc for phase children AND graph-metadata status is reconciled to a shipped/complete value.
- **transitions:** none (asserted P1, confirmed P1)

P2 findings (F002–F004) are advisory and not adjudicated as convergence-gating.

---

Review verdict: CONDITIONAL
