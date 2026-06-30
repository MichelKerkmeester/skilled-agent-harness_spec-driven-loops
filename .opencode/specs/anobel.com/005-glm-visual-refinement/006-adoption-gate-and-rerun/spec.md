---
title: "Feature Specification: adoption-gate-and-rerun"
description: "Phases 001-005 implement the GLM-refinement program but its value is unproven until the full pipeline is run end-to-end on the same 45 tiles and the lift is measured. This phase adds pipeline step 11 (the final adoption gate) plus the measured re-run that proves SHIP-rate and diagram-delta lift vs the 60% / ~41-pt baseline."
trigger_phrases:
  - "006-adoption-gate-and-rerun"
  - "adoption gate"
  - "measured re-run"
  - "ship rate lift"
  - "diagram-vs-linear delta"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/006-adoption-gate-and-rerun"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Folded panel: pre-registered ADOPT rule, de-circular gate, recovered-2D floor"
    next_safe_action: "Implement adoption-gate + ground-truth calibration before the re-run"
    blockers:
      - "Predecessor phases 001-005 must be shipped + validated before the re-run can run"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Baseline is fixed: 27/45 = 60% SHIP, mean 81.1, diagram-vs-linear delta ~41 pts (004/resea…"
      - "Contrast exit-0 is reported as a sub-metric, not the headline (near-tautological for a har…"
      - "SHIP at 80% via downgrades with no genuine 2D recovery returns ITERATE, not ADOPT - pre-re…"
      - "MiniMax is demoted to a shadow diagnostic (deterministic gates govern ship) until calibrat…"
---
# Feature Specification: adoption-gate-and-rerun

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-29 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | anobel.com/005-glm-visual-refinement |
| **Phase** | 6 of 6 (final) |
| **Pipeline Step** | Step 11 (final adoption gate) + program validation |
| **Predecessors** | 001-spatial-contract-and-gate, 002-primitive-routing, 003-minimax-auditor-in-loop, 004-skeleton-first-2d, 005-gpt5-5-skeleton-author (all must ship + validate first) |
| **Successor** | None (this phase proves the program) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 001-005 implement the seven research angles and the eleven-step pipeline that should close the bento-tile quality gap, but the program's value is still a hypothesis: the 004 run shipped only 27/45 = 60% SHIP (mean audit 81.1) with a ~41-point diagram-vs-linear gap, and nothing yet runs the full hardened pipeline end-to-end against those same 45 tiles. Without a final adoption gate and a measured re-run, individual tiles can silently regress, SHIP rate can inflate by downgrading diagrams to linear layouts, and the predicted lift remains unverified.

### Purpose
Add pipeline step 11 — the final adoption gate that decides ship / keep-prior-best / downgrade per tile — then re-run all 45 tiles through the full 001-005 pipeline and report the measured lift vs the 60% / ~41-pt baseline, so the program can be adopted, iterated, or rejected on evidence rather than projection.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **(a) Final adoption gate (step 11):** a per-tile decision that ships a tile only if the four DETERMINISTIC sub-gates (geometry, contrast, casing/glyph, palette) ALL pass; otherwise keeps the prior best render (subject to the keep-prior quality floor) or downgrades to a safer primitive. MiniMax-M3 runs as a SHADOW diagnostic (recorded, not ship-blocking) until calibrated. Failing sub-gates are recorded, not discarded.
- **(b) Measured re-run:** drive all 45 tiles through the full 001-005 pipeline (contract + deterministic gate -> primitive routing -> MiniMax-in-loop repair -> skeleton-first 2D -> GPT-5.5 skeleton escalation) and the adoption gate, recording per-tile telemetry.
- **(c) Lift computation + report:** compute and report SHIP rate (with confidence intervals, not point estimates), diagram-vs-linear delta, contrast exit-0 rate, recovered-2D vs downgrade-inflation split, and token / wall-clock / paid-call cost; present new-vs-baseline with paired tile-level deltas and the pre-registered adopt / iterate / reject verdict.
- **(d) Independent ground-truth calibration (BEFORE the batch):** a human-labeled stratified set of 25-30 tiles used to measure the gate's precision / recall / accuracy and to calibrate MiniMax, breaking the gate's self-validation circularity.
- **(e) Gate-config ablation:** run the same rendered output set through loose (geometry+contrast), deterministic-only (no MiniMax), and full gate configurations; the loose-vs-full SHIP delta is the reported "gate tax" (zero extra API calls).

### Out of Scope
- Implementing or modifying the phase 001-005 mechanisms themselves - they are consumed as-is.
- Any executable code in this scaffolding pass - planning only, no code yet.
- Changing the approved house style, Product register (V4/M2/D6), or palette - frozen.
- Re-deriving the baseline - taken as fixed (27/45, mean 81.1, ~41-pt delta).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `004-bento-visuals/research/inputs/gen-tile.mjs` | Reuse | Generation harness (confirmed present) as evolved by phases 001-005; invoked unchanged by the re-run driver |
| `004-bento-visuals/research/inputs/audit-concept.sh` | Reuse (from 001) | Deterministic DOM/CSS audit gate produced by phase 001; invoked per tile for geometry/contrast/casing verdicts |
| `004-bento-visuals/research/rerun/adoption-gate.mjs` | Create | Final adoption-gate decision: four-deterministic-sub-gate AND -> ship / keep-prior / downgrade; MiniMax recorded as shadow diagnostic |
| `004-bento-visuals/research/rerun/rerun-45.mjs` | Create | Re-run driver: iterates 45 tiles through 001-005 + adoption gate; writes per-tile JSONL |
| `004-bento-visuals/research/rerun/compute-lift.mjs` | Create | Computes SHIP rate + CIs, diagram-vs-linear delta, contrast exit-0, recovered-2D split, cost, paired deltas |
| `004-bento-visuals/research/rerun/ground-truth.json` | Create | Human-labeled stratified set (25-30 tiles) for gate precision/recall calibration + MiniMax calibration, captured before the batch |
| `004-bento-visuals/research/rerun/gate-ablation.md` | Create | Loose / deterministic-only / full gate-config SHIP comparison ("gate tax") |
| `004-bento-visuals/research/rerun/rerun-results.jsonl` | Create | Per-tile machine record (verdict, audit score, gate flags, recovered/downgrade tag, cost, latency) |
| `004-bento-visuals/research/rerun/rerun-report.md` | Create | Human-facing lift report vs the 60% / ~41-pt baseline + pre-registered verdict |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Adoption-gate decision function (step 11) | Emits a typed decision `ship` / `keep-prior` / `downgrade` per tile; ships only when the four DETERMINISTIC sub-gates (geometry, contrast, casing/glyph, palette) all pass; MiniMax-M3 status is recorded as a shadow diagnostic and does NOT block ship until calibrated (REQ-008); failing sub-gate names recorded on the record |
| REQ-002 | Measured re-run of all 45 tiles through 001-005 | 45 per-tile records produced, each with final verdict, audit score, and gate flags; pipeline stages invoked in order per tile |
| REQ-003 | Lift report vs baseline | Report shows new SHIP rate, diagram-vs-linear delta, and contrast exit-0 rate against the fixed baseline (60% / ~41 pt), with paired per-tile deltas (not independent angle sums) and confidence intervals (REQ-011) |
| REQ-004 | Cost accounting + realistic ceiling | Report includes GLM call count, paid-call count (MiniMax + GPT-5.5) and wall-clock per tile and per batch, measured against the realistic ceiling (120-200 GLM + 5-15 GPT-5.5 + 20-40 MiniMax, SC-004) calibrated on a 3-5 tile dry run; sets a per-tile and per-batch breach flag that aborts when exceeded |
| REQ-005 | Recovered-2D quality floor (downgrade-inflation guard) | Each newly-shipped tile is tagged `recovered-2D`, `downgraded-to-linear`, or `improved-linear`. HARD criterion: among recovered tiles, `recovered-2D / (recovered-2D + downgraded-to-linear) >= 0.50` — genuine 2D repair, not primitive collapse. Report separates 2D recovery from pass-rate gained by downgrading |
| REQ-008 | Independent ground-truth calibration BEFORE the batch | A human-labeled stratified set of 25-30 tiles is captured before the re-run; the gate's precision / recall / accuracy is measured against it (target: < 15% human-disagreed blocks) and reported. MiniMax is calibrated against the same labels; it may only be promoted from shadow to a hard sub-gate after passing calibration |
| REQ-010 | Keep-prior semantics + prior-best-quality floor | `keep-prior` is defined as retaining the previously-shipped best render and is permitted ONLY when that prior render itself cleared the deterministic ship bar (prior-best-quality floor). For the 18 baseline failures (prior render is the failing 35-58, below the floor) keep-prior is FORBIDDEN: the tile records `fail` (no shippable render) and is never silently counted as non-regression |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Linear no-regression check | Prior linear winners (audit 86-94) remain 100% passing and semantically equivalent; ANY linear regression is listed explicitly and blocks ADOPT (the prior >= 90% bar is too permissive — it tolerates degrading 1-2 strong tiles) |
| REQ-007 | Pre-registered adopt / iterate / reject verdict | Report ends with exactly one verdict computed by the pre-registered typed decision rule in spec.md §5 (frozen before the run), with the measured inputs and rationale; the rule is NOT deferred to checklist.md |
| REQ-009 | Gate-config ablation (gate tax) | The same rendered output set is scored under loose (geometry+contrast) / deterministic-only (no MiniMax) / full gate configurations; the loose-vs-full SHIP delta is reported as the "gate tax" (zero extra API calls) |
| REQ-011 | Honest statistics | SHIP rate and delta are reported with confidence intervals (n=45 -> ~+/-10-12 pt, not +/-3); the run executes 3 repeated batches plus a sign test where feasible to separate pipeline lift from model sampling noise, or explicitly states the variance is unquantified |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Pre-Registered Decision Rule (typed; FROZEN before the run)

The verdict is pre-registered here, before any tile is re-run, so the run is not interpretive and the goalposts cannot move after seeing results. The driver computes `decision(measured)` and the report emits exactly that verdict (REQ-007).

```ts
type Measured = {
  shipRate: number;             // accepted / (45 - transientFails)
  recovered2DShare: number;     // recovered-2D tiles / previously-failing-2D tiles
  linearNoRegression: number;   // prior linear winners still passing (1.00 = none regressed)
  lockedFieldRegressions: number; // copy/casing/glyph regressions on locked fields
  minimaxUnknownTiles: number;  // tiles where the MiniMax shadow diagnostic returned unknown
};

function decision(m: Measured): "ADOPT" | "ITERATE" | "REJECT" {
  if (
    m.shipRate >= 0.80 &&
    m.recovered2DShare >= 0.50 &&     // >= 50% of previously-failing 2D genuinely recovered
    m.linearNoRegression === 1.00 &&  // zero linear regressions
    m.lockedFieldRegressions === 0    // zero locked-field regressions
  ) return "ADOPT";

  if (
    (m.shipRate >= 0.60 && m.shipRate < 0.80) ||
    m.recovered2DShare < 0.50 ||      // 80% reached via downgrades only => ITERATE, not ADOPT
    m.minimaxUnknownTiles > 2         // shadow diagnostic too sparse to trust
  ) return "ITERATE";

  return "REJECT";                    // SHIP did not improve, or a hard regression appeared
}
```

> Tie-break / precedence: `ADOPT` is tested first, then `ITERATE`, else `REJECT`. The `recovered2DShare` floor in `decision()` is enforced jointly with the harder REQ-005 ratio (`recovered-2D / (recovered-2D + downgraded-to-linear) >= 0.50`); failing either keeps the verdict at `ITERATE` at best. Inputs are read from the measured ledger only — never re-estimated by hand.

### Success Criteria

- **SC-001**: SHIP rate reaches the conservative band 80-84% (36-38/45), optimistic up to 87-91% (39-41/45), from the 60% baseline, REPORTED WITH a confidence interval (n=45 -> ~+/-10-12 pt, not +/-3) per REQ-011 (predicted-lift table, iter-r4-pipeline.md section 2).
- **SC-002**: Diagram-vs-linear delta drops to the conservative band 14-20 pts, optimistic 8-14 pts, from the ~41-pt baseline, with the same CI discipline.
- **SC-003**: Contrast exit-0 rate among accepted tiles is 95-100% - reported, but treated as a sub-metric, not the headline, because it is near-tautological for a hard contrast gate (per iter-r4-risk.md section 5).
- **SC-004**: Cost stays within the REALISTIC measured ceiling - the prior <= 63 GLM estimate undercounts step-8 best-of-3 skeleton recompute, step-10 GPT-5.5 escalation, and MiniMax rescores; the calibrated ceiling is ~120-200 GLM + 5-15 GPT-5.5 + 20-40 MiniMax, set from a 3-5 tile dry run, with a breach flag that aborts (REQ-004); median per-tile wall-clock < 90s.
- **SC-005**: Zero copy / casing / glyph regressions on locked fields; linear no-regression = 100% (REQ-006).
- **SC-006**: Gate precision/recall measured against the 25-30 tile human ground-truth set with < 15% human-disagreed blocks before the batch is trusted (REQ-008); gate-config ablation reports the loose-vs-full "gate tax" (REQ-009).
- **SC-007**: Recovered-2D quality floor holds: `recovered-2D / (recovered-2D + downgraded-to-linear) >= 0.50` among recovered tiles (REQ-005) - SHIP gains are not pure downgrade inflation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001-005 shipped + validated | Re-run cannot run | Gate on `validate.sh --recursive` of the parent before starting |
| Dependency | `gen-tile.mjs` + `audit-concept.sh` audit gate | Re-run / gating blocked | Reuse confirmed harness under `004-bento-visuals/research/`; audit gate owned by phase 001 |
| Dependency | Z.AI multimodal, MiniMax-M3, GPT-5.5 endpoints | Partial or biased run | Record dispatch failures; ~1/45 transient failure expected; retry once before recording fail |
| Risk | Circular / self-validating gate - the gate determines SHIP and SHIP is measured against the gate | High | Break circularity with the independent human-labeled ground-truth set (REQ-008) AND the gate-config ablation (REQ-009), both before/over the same batch |
| Risk | Validator overfit - gates pass dull RC-7 slop | High | bbox/contrast cannot catch slop; run MiniMax as a shadow diagnostic + human spot-check accepted tiles + ground-truth calibration |
| Risk | Downgrade inflation - SHIP rises by losing diagrams | High | Tag `recovered-2D` vs `downgraded-to-linear`; HARD recovered-2D floor >= 50% (REQ-005); encode in the pre-registered decision rule (§5) |
| Risk | MiniMax uncalibrated hard veto + unknown-status mass-block of linear winners | High | Demoted to a shadow diagnostic; deterministic gates govern ship; promote to hard gate only after ground-truth calibration (REQ-001, REQ-008) |
| Risk | keep-prior silently ships a known-bad baseline render | High | Prior-best-quality floor (REQ-010); for the 18 baseline failures keep-prior is forbidden -> records `fail` |
| Risk | Over-optimism on n=45 (1 tile = 2.2 pts) | Med | Use paired tile-level deltas; report CIs (~+/-10-12 pt); 3 re-runs + sign test (REQ-011); do not sum A1/A3/A4/A5 gains independently (they overlap) |
| Risk | Cost ceiling undercount (63 GLM ignores best-of-3 + GPT-5.5 + MiniMax) | Med | Realistic measured ceiling 120-200 GLM + paid, dry-run calibrated, with an aborting breach flag (REQ-004, SC-004) |
| Risk | Latency tail (observed 6-161s, avg ~26s) biases run downward | Med | Explicit timeout/slow-tail policy; allow 3-6 min tail before marking fail |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Median per-tile wall-clock < 90s; REALISTIC batch ceiling ~120-200 GLM calls (45 first-pass + best-of-3 skeleton recompute + repair) + 5-15 GPT-5.5 + 20-40 MiniMax, calibrated on a 3-5 tile dry run; an aborting breach flag fires on per-tile or per-batch overrun.
- **NFR-P02**: Paid escalation (GPT-5.5 skeleton) fires failure-only, never on linear winners; MiniMax runs as a shadow diagnostic (recorded, not ship-gating) until calibrated; paid-call count reported per batch.

### Security
- **NFR-S01**: API keys (Z.AI, MiniMax, GPT-5.5) read from environment only - never hardcoded, never written to JSONL or report.
- **NFR-S02**: Re-run is measurement-only and writes only inside the `004-bento-visuals/research/rerun/` workspace - no production or site mutation.

### Reliability
- **NFR-R01**: Tolerate ~1/45 transient dispatch failure - retry once, then record `transient-fail` and exclude from the quality denominator (reported separately).
- **NFR-R02**: Re-run is resumable per tile from the JSONL ledger and idempotent per tile.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- **2D tile that fails twice**: routed to the downgrade path (linear-flow / stacked-list / compact-matrix); recorded as `downgraded-to-linear`, not a free retry; counts against the recovered-2D floor (REQ-005).
- **Tile with no prior best render (e.g. the 18 baseline failures)**: prior render is below the prior-best-quality floor, so keep-prior is forbidden -> records `fail` (no shippable render); never counted as non-regression (REQ-010).
- **Tile passing the deterministic gates but with `MiniMax status = unknown`**: SHIPS on the deterministic verdict; the unknown MiniMax shadow result is recorded only and counts toward `minimaxUnknownTiles` in the decision rule (no mass-block of linear winners).

### Error Scenarios
- **API dispatch failure**: retry once, then record `transient-fail`; excluded from the quality denominator but counted in the failure log.
- **MiniMax timeout**: treat status as `unknown` -> recorded on the shadow diagnostic (counts toward `minimaxUnknownTiles`); does NOT block ship, since deterministic gates govern.
- **Audit gate disagreement with MiniMax**: deterministic geometry/contrast verdicts always win; MiniMax is a shadow taste signal until calibrated against the ground-truth set, then optionally promoted.

### State Transitions
- **Partial batch**: resume from the JSONL ledger; completed tiles are not re-run.
- **Re-run after a phase 001-005 change**: full re-run required - paired deltas are only valid against a single pipeline snapshot.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | ~5 new harness files, no product code, reuses `gen-tile.mjs` + audit gate |
| Risk | 10/25 | Measurement-only, but depends on 5 predecessor phases plus paid external APIs |
| Research | 4/20 | Research already complete (iter-r4); this phase consumes it, does not extend it |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

All prior open questions were resolved during the 5-model panel review and folded into requirements / success criteria:

- ~~Contrast exit-0 headline vs sub-metric?~~ RESOLVED -> sub-metric, not the headline (SC-003).
- ~~SHIP at 80% via downgrades only - ADOPT or ITERATE?~~ RESOLVED -> ITERATE (pre-registered decision rule §5 + REQ-005 recovered-2D floor).
- ~~MiniMax on every accepted tile, or failure-only shadow audit?~~ RESOLVED -> shadow diagnostic; deterministic gates govern ship; promote only after ground-truth calibration (REQ-001, REQ-008).

No open questions remain.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: `../spec.md` (Phase 6 row)
- **Research source**: `../../004-bento-visuals/research/iterations/iter-r4-pipeline.md` (step 11 + predicted-lift table), `iter-r4-risk.md` (failure modes, pilot order, over-optimism), `../../004-bento-visuals/research/research.md` (exec summary + baseline)
