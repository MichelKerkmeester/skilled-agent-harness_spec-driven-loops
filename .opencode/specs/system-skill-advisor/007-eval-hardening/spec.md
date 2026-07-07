---
title: "Feature Specification: Advisor Scorer Eval Hardening"
description: "Harden the advisor scorer's evaluation so regressions are caught. Add an empirical ambiguity slice, bucket/source_type schema enforcement plus named intent-bucket accuracy slices, a ratcheted accuracy baseline with a non-regression gate, and an honest independent holdout assembled from disjoint labeled fixtures. Corpus-neutral by construction: scoreAdvisorPrompt is read-only in every path and the handler edits are additive output plus stricter input validation only."
trigger_phrases:
  - "advisor eval hardening"
  - "scorer regression gate"
  - "ratcheted accuracy baseline"
  - "independent holdout gate"
  - "empirical ambiguity slice"
importance_tier: "high"
contextType: "implementation"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/007-eval-hardening"
    last_updated_at: "2026-07-07T07:15:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "Eval-hardening infrastructure implemented and verified corpus-neutral"
    next_safe_action: "Orchestrator pushes the working tree to the shared branch"
---
# Feature Specification: Advisor Scorer Eval Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The advisor scorer had an aggregate accuracy gate but no defense against regressions that hide inside contested prompts, single-intent classes, or the every-Nth-row holdout carved from the same training corpus the explicit-lane rules were tuned against. This packet adds test and measurement infrastructure that makes such regressions visible: an empirical ambiguity slice over the lowest-margin prompts, named per-intent accuracy buckets (review / memory_save / delegation), a ratcheted accuracy baseline whose gate forbids silent drift in either direction, and an honest independent holdout assembled from three disjoint, separately-authored labeled fixtures. It changes no routing behavior — `scoreAdvisorPrompt` is read-only in every new path, and the handler edits are additive output plus stricter input validation only.

**Key Decisions**: Keep the fixed release floors as an absolute minimum and add an exact-match ratchet on top (ADR-001); assemble the holdout from repurposed disjoint labeled fixtures with no fabricated gold (ADR-002); capture the baseline under the deterministic test-harness regime that every scorer gate already uses (ADR-003).

**Critical Dependencies**: the 193-row labeled corpus, the shared executor-delegation fixture, the harder-intent and regression-case fixtures, and the reproducible filesystem projection.

<!-- /ANCHOR:executive-summary -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Estimated LOC** | ~900 (fixtures + generators + 3 gates + handler/schema additions) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The scorer's release gate measured only aggregate top-1 accuracy over the full corpus, plus a synthetic dead-tie stability check and a holdout selected by taking every fifth row of the same 193-row training corpus. Three blind spots followed. A regression confined to the hardest contested prompts (where the top-2 fused-score margin is near zero) could leave the aggregate untouched, because contested rows are a minority. A regression confined to one intent class — read-only review routing, memory-save/resume routing, or executor delegation — was similarly invisible. And the every-fifth-row holdout measured memorization, not generalization, because it is drawn from the corpus the rules were tuned on. The corpus already carried `bucket` and `source_type` on every row, but they were unenforced (`.passthrough()`) and unused for slicing.

### Purpose
Add measurement infrastructure that catches these regressions without changing any routing behavior: freeze an empirical ambiguity slice of the lowest-margin prompts, enforce and slice on the corpus buckets, ratchet the accuracy of each measure against a committed baseline, and assemble an independent holdout that is provably disjoint from the training corpus.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An empirical ambiguity slice: offline-derive the top-2 margin for every corpus row under the reproducible projection, freeze the low-margin row-id set and threshold `tau` into a fixture, and gate top-1 accuracy on it.
- Schema enforcement: tighten `CorpusRowSchema` so `bucket` and `source_type` are validated enums (retaining `.passthrough()`), and add `slices.buckets.{review, memory_save, delegation}` with a `minN` floor to the validate output and schema.
- A ratcheted accuracy baseline (`scorer-eval-baseline.json`) plus a capture script and a non-regression gate: exact-match with directional failures, sha256 fixture pins, and the retained hard floors as an absolute minimum.
- An honest independent holdout assembled from three disjoint labeled fixtures, with a build script and a gate that re-proves disjointness and holds top-1 at or above the baseline.
- New vitest gates for the ratchet, the holdout, and the ambiguity slice, plus extension of the validate handler test for the new buckets and schema.

### Out of Scope
- Any change to routing behavior, lane weights, thresholds, or the scorer fusion path.
- Removal of the legacy every-Nth-row holdout (`stratifiedHoldout`) — retained as a secondary signal.
- Harvesting and hand-labeling real advisor-hook telemetry prompts into gold — prompt-safety forbids storing routable prompt content in telemetry; this remains a future upgrade, not faked here.
- Editing the WS-adjacent divergence ratchet / ledger or the orchestrator's fusion / delegation / graph-causal files.
- The routing-accuracy `README.md` documentation update — deferred (a concurrent session holds it dirty).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/handlers/advisor-validate.ts` | Modify | Enum-enforce bucket/source_type; delegation loader; `evaluateDelegationCases`; `bucketSlice`; compute + output `slices.buckets` over the full corpus |
| `mcp_server/schemas/advisor-tool-schemas.ts` | Modify | `bucketSliceSchema` (adds `minN` + `top1`); `slices.buckets` block |
| `mcp_server/scripts/routing-accuracy/build-holdout.mjs` | Create | Assemble + dedup the 78-row independent holdout |
| `mcp_server/scripts/routing-accuracy/derive-ambiguity-slice.mjs` | Create | Offline-derive + freeze the ambiguity slice at `tau` |
| `mcp_server/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs` | Create | Capture the ratchet baseline with sha256 fixture pins |
| `mcp_server/scripts/routing-accuracy/holdout-prompts.jsonl` | Create | Frozen 78-row independent holdout |
| `mcp_server/scripts/routing-accuracy/ambiguity-prompts.jsonl` | Create | Frozen ambiguity slice |
| `mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json` | Create | Frozen accuracy baseline |
| `mcp_server/tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | Create | Non-regression + fixture-pin + floor gate |
| `mcp_server/tests/parity/holdout-independent.vitest.ts` | Create | Independent holdout gate |
| `mcp_server/tests/scorer/ambiguity-slice.vitest.ts` | Create | Ambiguity-slice gate |
| `mcp_server/tests/handlers/advisor-validate.vitest.ts` | Modify | Assert the new buckets, minN, full-corpus scope, and enum enforcement |
| `mcp_server/tests/handlers/advisor-validate-shapes.vitest.ts` | Modify | Update the valid-corpus-row fixtures for the now-required enum fields |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No routing behavior changes | `python-ts-parity` holds 105/101/4 byte-identical; divergence ratchet and ablation unchanged |
| REQ-002 | Ratcheted baseline with a non-regression gate | Baseline captured under the deterministic regime; gate holds every metric exactly and fails directionally on drift |
| REQ-003 | Independent holdout, disjoint from training, no fabricated gold | 78 rows from three disjoint fixtures; every label maps a real existing field; disjointness re-proven at test time |
| REQ-004 | Empirical ambiguity slice frozen with tau | Non-empty slice at a frozen `tau`; top-1 gated at or above baseline |
| REQ-005 | Bucket/source_type enum enforcement + slices.buckets | Loader rejects malformed enum values; `slices.buckets.{review,memory_save,delegation}` present with `minN` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Retain the hard floors as an absolute minimum | Ratchet also asserts full-corpus >= 0.75 and holdout >= 0.725 |
| REQ-007 | Fixture pins force conscious re-baselining | Baseline stores sha256 of corpus/holdout/ambiguity; gate fails on any hash mismatch |
| REQ-008 | Buckets are a global diagnostic | `slices.buckets` computed over the full corpus regardless of `skillSlug` scope; `minN` guards shrinkage |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The full advisor suite adds only new passing tests; the pre-existing failing set is unchanged (four scorer-independent infra flakes).
- **SC-002**: `python-ts-parity` remains 105/101/4 byte-identical (proven by its passing hard assertions).
- **SC-003**: The ratchet gate fails when the committed baseline is perturbed (mutation-proved) and passes against the true baseline.
- **SC-004**: The holdout is measured disjoint from the 193-row training corpus at test time (one training collision removed at build).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 193-row labeled corpus | Baseline + buckets rest on it | sha256-pinned in the baseline; enum-enforced at load |
| Dependency | Reproducible FS projection | Determinism of every metric | Empty DB-dir override forces the filesystem projection from committed metadata |
| Risk | Baseline captured under transient state | Ratchet drifts | Deterministic env + `capturedAtSha` + fixture sha256 pins; harness-regime capture |
| Risk | Ambiguity `tau` over-broad | Slice loses meaning | `tau` frozen to the tightest contested band; slice row-id set frozen |
| Risk | Holdout not truly unseen | Weak generalization signal | Disjointness measured and re-proven at test time; telemetry-gold upgrade deferred, not faked |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reproducibility
- **NFR-R01**: Every metric is a pure function of committed fixtures under the deterministic projection; reproducible from the repo alone.
- **NFR-R02**: A fixture edit changes a sha256 pin and forces a conscious re-baseline.

### Safety
- **NFR-S01**: No routable prompt content is added to any output; bucket and slice outputs are counts only.
- **NFR-S02**: Stricter input validation can only reject malformed fixtures; it can never change a score.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Single or zero candidate on a prompt**: the top-2 margin is treated as effectively non-ambiguous, so the row is not pulled into the slice.
- **A bucket shrunk below its `minN`**: the bucket slice fails (both in the handler's `passed` and the ratchet's `minN` assertion), rather than reporting a meaningless ratio.
- **A `skillSlug` scope on validate**: the aggregate corpus narrows, but the named buckets stay computed over the full corpus, so their totals are stable.
- **A delegation case expecting `none`**: a correct abstain (null top skill) is the passing outcome.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

The change is broad in file count but shallow in risk: three frozen fixtures, three offline generators, three vitest gates, two additive source edits, and two test reconciliations. The complexity concentrates in reproducibility — every metric must be a deterministic function of committed fixtures under the same regime the gate re-scores in. There is no algorithmic complexity in the scorer path (it is read-only), no state migration, and no deployed-contract change. Level 3 is warranted by the durable ratchet commitment and the three architectural decisions, not by raw difficulty.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Concurrent metadata change shifts the FS projection | M | M | Documented re-baseline contract; `capturedAtSha` records the capture commit |
| R-002 | Capture/runtime transpiler divergence | M | L | Both capture and gate run the harness regime; fixture pins + exact-match catch mismatch loudly |
| R-003 | An operator re-captures downward | L | L | The ratchet exact-match plus the retained hard floors resist a silent downgrade |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Catch a contested-prompt regression (Priority: P0)

**As a** scorer maintainer, **I want** a gate over the hardest low-margin prompts and the named intent buckets, **so that** a regression that leaves the aggregate untouched still fails CI.

**Acceptance Criteria**:
1. Given a change that lowers top-1 on the ambiguity slice, When the suite runs, Then the ambiguity gate fails with a live-vs-baseline diff.
2. Given a change that lowers a single bucket's top-1, When the suite runs, Then the ratchet fails naming that bucket.

### US-002: Trust the holdout measures generalization (Priority: P1)

**As a** reviewer, **I want** the holdout proven disjoint from the training corpus with auditable provenance, **so that** its accuracy is not memorization and no gold is fabricated.

**Acceptance Criteria**:
1. Given the holdout gate runs, When it checks each row, Then every row carries a real source fixture and no row collides with a training prompt.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## OPEN QUESTIONS

- Should the legacy every-Nth-row holdout be removed now that an independent holdout exists? **RESOLVED: No — retained as a secondary signal to avoid churning the live handler and adjacent parity assertions.**
- Should the routing-accuracy `README.md` document the four fixtures in this packet? **RESOLVED: Deferred — a concurrent session holds the README dirty; the doc delta is handed off rather than clobbering their edit.**
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Program umbrella**: `system-skill-advisor/001-scorer-saturation-root-fix`

<!-- /ANCHOR:related-docs -->
