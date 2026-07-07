---
title: "Implementation Summary: Advisor Scorer Eval Hardening"
description: "Shipped: eval-hardening infrastructure for the advisor scorer. An empirical ambiguity slice, bucket/source_type enum enforcement plus named intent-bucket accuracy slices, a ratcheted accuracy baseline with an exact-match non-regression gate, and an honest independent 78-row holdout from three disjoint labeled fixtures. Corpus-neutral (105/101/4 held byte-identical), additive output plus stricter input validation only, no routing change."
trigger_phrases:
  - "advisor eval hardening summary"
  - "ratcheted baseline implementation summary"
  - "independent holdout shipped"
importance_tier: "high"
contextType: "implementation"
status: "Complete"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-advisor-tuning/007-eval-hardening"
    last_updated_at: "2026-07-07T07:15:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "Eval-hardening infrastructure implemented and verified corpus-neutral; all scorer gates green"
    next_safe_action: "Orchestrator pushes the working tree to the shared branch (no commit/push done here)"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/parity/scorer-eval-baseline-ratchet.vitest.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/parity/holdout-independent.vitest.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/scorer/ambiguity-slice.vitest.ts"
    completion_pct: 100
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3 | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/global/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-eval-hardening |
| **Completed** | 2026-07-07 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:exec-summary -->
## Executive Summary

The advisor scorer's evaluation now catches regressions that the aggregate accuracy gate hid. Four measures are frozen from the current scorer state and guarded: an empirical ambiguity slice over the lowest-margin prompts, named intent buckets (review, memory_save, delegation), an independent 78-row holdout disjoint from the training corpus, and a ratcheted baseline whose gate forbids silent drift in either direction. No routing behavior changed — the scorer is read-only in every new path, and the handler edits are additive output plus enum-tightened input validation only.
<!-- /ANCHOR:exec-summary -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### The gap
The release gate measured only aggregate top-1 accuracy plus a synthetic dead-tie check and an every-fifth-row holdout carved from the same 193-row training corpus. Regressions confined to contested prompts, to a single intent class, or masked by memorization were invisible. The corpus already carried `bucket` and `source_type` on every row, but they were unenforced and unused for slicing.

### What was added
- **Empirical ambiguity slice**: the top-2 fused-score margin is derived for every corpus row under the reproducible projection; the 25 lowest-margin rows (at a frozen `tau=0.03`) are frozen with their existing gold labels, and a gate holds their top-1 at or above the baseline.
- **Bucket enforcement + slices**: `CorpusRowSchema` now validates `bucket` and `source_type` as enums (passthrough retained); the validate output gains `slices.buckets.{review, memory_save, delegation}`, each with a `minN` floor. review and memory_save slice the corpus by bucket; delegation scores the shared executor-delegation fixture (the training corpus carries no honest executor-delegation signal).
- **Ratcheted baseline + gate**: `scorer-eval-baseline.json` records the top-1 count for every measure with sha256 fixture pins. The gate re-scores live and holds each metric exactly, failing directionally on any drift (regression vs unrecaptured improvement), with the fixed release floors retained as an absolute minimum.
- **Independent holdout**: 78 rows assembled from three disjoint labeled fixtures (harder-intent 22, regression 50, delegation 11 -> dedup -> 78), with a gate that re-proves disjointness from the training corpus and holds top-1 at or above the baseline.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `handlers/advisor-validate.ts` | Modified | Enum-enforce bucket/source_type; delegation loader + `evaluateDelegationCases`; `bucketSlice`; compute + output `slices.buckets` over the full corpus |
| `schemas/advisor-tool-schemas.ts` | Modified | `bucketSliceSchema` (adds `minN` + `top1`); `slices.buckets` block |
| `scripts/routing-accuracy/build-holdout.mjs` | Created | Assemble + dedup the 78-row independent holdout |
| `scripts/routing-accuracy/derive-ambiguity-slice.mjs` | Created | Offline-derive + freeze the ambiguity slice at `tau` |
| `scripts/routing-accuracy/capture-scorer-eval-baseline.mjs` | Created | Capture the baseline with sha256 fixture pins |
| `scripts/routing-accuracy/holdout-prompts.jsonl` | Created | Frozen 78-row independent holdout |
| `scripts/routing-accuracy/ambiguity-prompts.jsonl` | Created | Frozen 25-row ambiguity slice |
| `scripts/routing-accuracy/scorer-eval-baseline.json` | Created | Frozen accuracy baseline |
| `tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | Created | Non-regression + fixture-pin + floor gate |
| `tests/parity/holdout-independent.vitest.ts` | Created | Independent holdout gate |
| `tests/scorer/ambiguity-slice.vitest.ts` | Created | Ambiguity-slice gate |
| `tests/handlers/advisor-validate.vitest.ts` | Modified | Assert the new buckets, minN, full-corpus scope, and enum enforcement |
| `tests/handlers/advisor-validate-shapes.vitest.ts` | Modified | Update the valid-corpus-row fixtures for the now-required enum fields |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Numbers were measured, not assumed. The additive handler and schema edits were made and typechecked (exit 0) before dist was rebuilt. The holdout dedup was verified to reproduce 78 rows exactly (83 raw, 4 intra-pool duplicates, 1 training collision — the CommonJS-helper delegation prompt — removed) with disjointness confirmed. The ambiguity slice was derived from live margins. The baseline was captured under the deterministic filesystem projection.

A discrepancy surfaced during verification: the node-captured baseline disagreed with the vitest gate on the near-tie rows. Root cause was found empirically — the semantic-shadow lane substitutes deterministic fixture vectors under the test-harness flag, which every existing scorer gate runs with, but a plain node capture does not. The capture scripts were corrected to set the harness flag (recorded as ADR-003), after which the baseline reproduces the gate numbers exactly. No commit or push was performed; the changes are left in the working tree for the orchestrator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fixed floor + exact-match ratchet (ADR-001) | A fixed floor is blind to above-floor drift; the ratchet holds the last-known-good and forces a conscious re-baseline on any legitimate movement, with the floor as a hard backstop |
| Honest holdout from disjoint labeled fixtures (ADR-002) | No never-seen production gold exists in the repo; repurposing three disjoint, separately-authored labeled fixtures measures generalization without fabricating labels |
| Capture under the test-harness regime (ADR-003) | Every scorer gate runs the harness fixture-semantic regime; the baseline must be measured in the same regime that re-scores it, or the ratchet fails against its own baseline |
| Buckets over the full corpus, not the skillSlug scope | The named buckets are a global diagnostic; scoping them would shrink them below `minN` and lose meaning |
| Retain the legacy every-Nth-row holdout | Removing it would churn the live handler and adjacent parity assertions for no measurement gain; it stays as a secondary signal |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS (exit 0) |
| `scorer-eval-baseline-ratchet.vitest.ts` | PASS (6/6) |
| `holdout-independent.vitest.ts` | PASS (3/3) |
| `ambiguity-slice.vitest.ts` | PASS (3/3) |
| `advisor-validate.vitest.ts` (extended) | PASS |
| `advisor-validate-shapes.vitest.ts` (reconciled) | PASS |
| `python-ts-parity.vitest.ts` | PASS (hard-asserts pythonCorrect=105, tsAlsoCorrect=101, regressions=4, ids equal) |
| `local-native-divergence-ratchet.vitest.ts` | PASS (green; no ledger edit) |
| Ratchet mutation proof | PASS (baseline full_corpus 147 -> 148 fails the gate with the exact directional diff; restored) |
| Full advisor vitest suite | 652 passed, 5 skipped, 4 failed (all pre-existing scorer-independent infra flakes) |

**Baseline (harness regime, filesystem projection)**: full-corpus 147/193 = 0.7617; unknown 10; gold-none-false-fire 8; holdout 60/78 = 0.7692; ambiguity 15/25 = 0.60 (`tau=0.03`); buckets review 22/32 = 0.6875, memory_save 25/32 = 0.7813, delegation 11/11 = 1.0. Floors met: full-corpus >= 0.75, holdout >= 0.725.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations From Plan

1. **A third generator script was added** (`derive-ambiguity-slice.mjs`) beyond the plan's two. The ambiguity slice needs an offline deriver, mirroring `build-holdout.mjs`; it is a run-once frozen generator, not a CI dependency.
2. **The baseline is captured under the test-harness regime** (ADR-003). The plan's capture recipe omitted the harness fixture-semantic factor; matching it is required for the baseline and the gate to agree and keeps this gate consistent with every sibling scorer test.
3. **`advisor-validate-shapes.vitest.ts` was reconciled** (not named in the plan). The enum tightening made its minimal valid-row fixtures invalid; two fixtures gained the now-required `bucket` + `source_type` fields.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The full suite shows 4 failures, all pre-existing and scorer-independent.** `compat/shim` (Python subprocess stdin), `skill-advisor-cli-parity` (Python/native CLI), `advisor-graph-health` (legacy graph health), and `manual-testing-playbook` (doc inventory). None imports the scorer, and the scorer/parity/ratchet gates are all green, so this change introduces no new failures. A fifth infra flake (migration-lineage-identity / launcher-orphan-reaping) is fluid and passed this run.
2. **The baseline measures the harness regime, not the daemon's real-embedding runtime.** This is the standard reproducible-CI trade-off shared by every scorer gate; the ratchet tracks relative regressions, which is its purpose (ADR-003).
3. **The holdout rows are repurposed labeled fixtures, not fresh held-out production traffic.** The telemetry-labeled upgrade is deferred, not faked (prompt-safety forbids storing routable prompt content in telemetry) (ADR-002).
4. **The routing-accuracy `README.md` fixture documentation is deferred.** A concurrent session holds the README dirty; the doc delta is handed off rather than clobbering their edit.
5. **No commit or push was performed.** The orchestrator owns the push to the shared branch; the changes are in the working tree.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-Up

- Document the four routing-accuracy fixtures in the `README.md` once the concurrent session's edit lands.
- When the scorer or skill metadata legitimately changes, re-run `capture-scorer-eval-baseline.mjs --write` to re-baseline (the ratchet's directional message names this step).
<!-- /ANCHOR:follow-up -->
