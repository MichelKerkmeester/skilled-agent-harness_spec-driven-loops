---
title: "Implementation Plan: Durable Archiving & Serving-Snapshot"
description: "Planned sequence for the durable report-path convention, the serving-snapshot.json schema and renderer, repo-relative provenance, and the append-only flip-history log — gated on the active 010 manifest and never touching the frozen scorer or the baseline label."
trigger_phrases:
  - "durable archiving plan"
  - "serving snapshot renderer plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Durable Archiving & Serving-Snapshot

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node/CommonJS orchestrator scripts (non-frozen), Markdown documentation under `create-benchmark` |
| **Archive convention** | `<hub>/benchmark/compiled-routing/<run-label>/{skill-benchmark-report.json,skill-benchmark-report.md}`, fail-closed on collision |
| **Joined artifact** | `serving-snapshot.json` — one file per hub joining manifest, fence, flag, freshness, and parity state |
| **Frozen inputs** | The three pinned scorer files are read-only inputs; never edited |
| **Archive source of truth** | The active `010-live-activation/activation/<hub>/manifest.json`, never a `006` shadow candidate |

### Overview

The plan adds one durable path convention, one joined schema plus renderer, one non-frozen render-block addition to the existing `build-report.cjs`, a provenance rework from absolute to repo-relative, and an append-only transition log. Every archive step reads the active serving manifest and aborts on drift rather than completing with mismatched state; the existing `baseline` label is never touched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] `../002-runtime-promotion-and-status-foundation/` has landed and named the durable status-probe fields this packet's schema consumes.
- [ ] `../004-benchmark-compiled-lane-c/` emits a `compiledRoute` parity JSON this packet can archive.
- [ ] The `serving-snapshot.json` field list is pinned and approved against the actual `010-live-activation/activation/<hub>/manifest.json` shape.

### Definition of Done

- [x] The report-path convention is documented and fails closed on an existing run-label. — `archive-compiled-routing.cjs`; collision fixture returns `COLLISION`, no partial write.
- [x] `serving-snapshot.json` + renderer ship and produce a joined, readable view per hub. — `render-serving-snapshot.cjs` capture/render/validate; real sk-code snapshot validates against `serving-snapshot-schema.md`.
- [x] `report.compiledRouting` renders via the non-frozen `build-report.cjs`; new immutable label siblings exist; `baseline` is untouched. — `router-compiled-parity-baseline`/`-final` family; `baseline` run-label refused (`BAD_LABEL`).
- [x] Every archive step reads the active `010` manifest and aborts on a mid-run digest change. — drift fixture returns `DRIFT`; a `006` source returns `MANIFEST_SOURCE`.
- [x] Repo-relative provenance ships for every newly-archived artifact. — absolute `targetSkill.root` dropped for `rootRel`; grep of archived pair for the worktree root returns 0.
- [~] `flip-history.jsonl` is append-only per hub. — deferred: owned by `../010-rollback-audit-and-non-hub-policy/` (ledger schema + drivers), not re-implemented here.
- [x] All 7 hub `benchmark/README.md` files document the convention. — all 7 validate at 0 issues.
- [x] No frozen scorer file is modified; strict Level-2 packet validation passes. — pre/post SHA-256 of the three frozen scorer files identical; skill-benchmark vitest 239/239.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Capture-then-render, gated on the active manifest. A capture step reads the live `010` manifest, the flag state, and the latest parity result into one joined snapshot; a separate renderer turns that JSON into a readable view. Archiving the canonical Lane C report pair follows the same fail-closed, source-gated discipline as the snapshot capture.

### Key Components

- **Report-path convention**: `<hub>/benchmark/compiled-routing/<run-label>/` — the durable sibling of the existing `router-final/`/`live-final/` family.
- **`serving-snapshot.json`**: the joined per-hub artifact — `{hubId, capturedAt, flag, manifest{...}, liveConfigHash, freshness, engineResolverPath, parityBaseline, realModelLast}`.
- **Snapshot renderer** (under `create-benchmark`): turns the JSON into a human-readable view.
- **`build-report.cjs` extension**: the non-frozen renderer's new `report.compiledRouting` block.
- **`flip-history.jsonl`**: append-only per-hub transition log.

### Data Flow

```text
active 010-live-activation/activation/<hub>/manifest.json (read-only source)
              |
              v
   snapshot capture --> serving-snapshot.json (joined artifact)
              |                      |
              v                      v
   snapshot renderer          report.compiledRouting
   (create-benchmark)         (via build-report.cjs, non-frozen)
                                     |
                                     v
                    archive to <hub>/benchmark/compiled-routing/<run-label>/
                    (fail-closed on existing label; repo-relative provenance;
                     abort on mid-run manifest-digest drift)
                                     |
                                     v
                    append transition to flip-history.jsonl
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Planned Action | Verification |
|---------|--------------|------------------|----------------|
| `010-live-activation/activation/<hub>/manifest.json` | Active serving manifest (7 hubs) | Read-only source for every snapshot/archive | Digest re-checked at capture-start and archive-commit; drift aborts |
| `006-parent-hub-rollout/*/activation/` | Shadow-candidate manifests | **Never read as the archive source** | Boundary asserted in the capture step; a negative fixture proves it is rejected if pointed at by mistake |
| `run-skill-benchmark.cjs` / Lane C outputs | Caller-supplied `--outputs-dir` only | Add the durable convention as an additional, fail-closed archive target | Collision test: re-running a used `<run-label>` fails closed |
| `build-report.cjs` (non-frozen) | JSON→Markdown report renderer | Add the `report.compiledRouting` block | Rendered-report fixture test |
| Three frozen scorer files | Frozen route-gold scorer | **Unchanged — not a consumer** | Pre/post SHA-256 comparison stays identical |
| `sk-code/benchmark/baseline/` (and sibling hubs' `baseline/`) | Frozen baseline label | **Unchanged — never repurposed** | `git diff` on every `baseline/` path stays empty |
| 7 hub `benchmark/README.md` | Existing archive-directory index | Add the compiled-routing convention row | Diff review per hub |

Required inventories before implementation:
- Confirm the exact shape of `010-live-activation/activation/<hub>/manifest.json` for all 7 hubs (fields feeding `serving-snapshot.json`).
- Confirm `../004-benchmark-compiled-lane-c/`'s `compiledRoute` parity JSON shape before wiring the `report.compiledRouting` block.
- Confirm every hub's `benchmark/` directory naming family before adding new labels, to avoid an accidental collision with an existing directory name.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Confirm `002` and `004` dependencies are ready; pin the `010` manifest field shape and the `compiledRoute` parity JSON shape.
- [ ] Pin the `serving-snapshot.json` schema field list against the confirmed manifest shape.
- [ ] Inventory each hub's `benchmark/` directory naming family to select non-colliding new labels.

### Phase 2: Core Implementation

- [x] Implement the fail-closed report-path convention (`<hub>/benchmark/compiled-routing/<run-label>/`). — `scripts/archive-compiled-routing.cjs`.
- [x] Implement the `serving-snapshot.json` capture step (reads the active `010` manifest, flag, freshness, latest parity). — `scripts/render-serving-snapshot.cjs` `captureServingSnapshot`.
- [x] Implement the snapshot renderer under `create-benchmark`. — `renderServingSnapshot` + `--out` CLI in the same script.
- [x] Add the `report.compiledRouting` block to `build-report.cjs` (non-frozen). — present from `../004`; extended here with a guarded Provenance & execution-context block.
- [x] Implement repo-relative provenance (`rootRel` + digests) for newly-archived artifacts. — `rewriteProvenance` in the archiver.
- [~] Implement the append-only `flip-history.jsonl` writer. — deferred to `../010-rollback-audit-and-non-hub-policy/` (owns the ledger + drivers).
- [x] Update all 7 hub `benchmark/README.md` index files. — 4 extended, 3 created; all validate at 0 issues.

### Phase 3: Verification

- [x] Collision test: re-run against an existing `<run-label>` and confirm a fail-closed, non-zero, no-partial-write result. — `COLLISION`; original bytes unchanged; empty pre-existing label dir also refused.
- [x] Drift test: mutate the active manifest mid-capture and confirm the archive aborts rather than completing. — `DRIFT`; no partial directory left behind.
- [x] Boundary test: point the capture step at a `006` shadow-candidate manifest and confirm it is rejected. — `MANIFEST_SOURCE` for both the archiver and the snapshot capture.
- [x] Confirm the frozen scorer digests are unchanged and no `baseline/` directory was written to. — pre/post SHA-256 identical; `baseline` run-label refused.
- [x] Run strict spec-folder validation on this phase folder. — see checklist CHK-052.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Planned Tools |
|-----------|-------|----------------|
| Fail-closed | Report-path collision on an existing run-label | Fixture re-run; assert non-zero exit, no partial write |
| Source-integrity | Archive reads only the active `010` manifest | Negative fixture pointed at a `006` shadow candidate; assert rejection |
| Drift | Manifest digest changes mid-capture | Simulated mid-run mutation; assert abort, not silent completion |
| Rendered-report | `report.compiledRouting` block | Fixture test against `build-report.cjs` output |
| Portability | `rootRel` + digests resolve after a path move | Copy an archived artifact to a different path; assert it still validates |
| Append-only | `flip-history.jsonl` never shrinks or rewrites | Before/after entry-count and byte-prefix comparison across two runs |
| Package | Full spec-folder conformance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|---------------------|
| `../002-runtime-promotion-and-status-foundation/` | Internal | Planned | `serving-snapshot.json`'s `freshness`/`engineResolverPath` fields lack a stable source |
| `../004-benchmark-compiled-lane-c/` | Internal | Planned | Nothing to archive under `report.compiledRouting` |
| `010-live-activation/activation/<hub>/manifest.json` (7 hubs) | Internal | Available | The archive's entire source-of-truth; without it, no snapshot can be captured |
| `build-report.cjs` (non-frozen orchestrator) | Internal | Available | The correct, safe extension point for the render block |
| Three frozen scorer files (read-only) | Internal | Available (pinned) | Any required edit to them is treated as a migration failure, not license to edit |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fail-closed collision fires incorrectly; a snapshot captures against the wrong manifest source; provenance rework breaks an existing consumer; `flip-history.jsonl` is found truncated or rewritten.
- **Procedure**: Revert the offending script/documentation change via version control. Archiving is purely additive (new directories/files), so no existing report, manifest, or `baseline/` label needs unwinding — only the newly-added convention code or docs are reverted. Re-derive the schema/renderer against the confirmed manifest shape before re-shipping.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Setup / pin schema + naming) ──► Phase 2 (Core / convention + snapshot + renderer + provenance) ──► Phase 3 (Verify / fail-closed + drift + boundary)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `002`, `004` readiness; confirmed manifest shape | Core |
| Core | Setup | Verify |
| Verify | Core | The P3 coverage-closure join gate (`../011-activation-cutover-p4/`) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|---------------------|
| Setup (schema + naming pin) | Low | Confirms shapes already mostly known from research |
| Core (convention + schema + renderer + provenance + log) | Med-High | Five distinct additive surfaces, each small but source-gated |
| Verification (fail-closed + drift + boundary) | Med | Negative-fixture-heavy; correctness-critical despite being additive |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Implementation Checklist

- [ ] `010` manifest field shape confirmed for all 7 hubs.
- [ ] `004`'s `compiledRoute` parity JSON shape confirmed.
- [ ] No existing `baseline/` or other established label is targeted for reuse.

### Rollback Procedure

1. Revert the report-path convention, snapshot capture/renderer, `build-report.cjs` block, provenance, or `flip-history.jsonl` writer via version control, individually or together.
2. Confirm no `baseline/` directory or frozen scorer file was touched (it should not have been, by construction).
3. Re-verify the manifest-source boundary before re-shipping.

### Data Reversal

- **Has runtime effect?** No — archiving is read-only against live routing and purely additive on disk.
- **Reversal procedure**: Delete or revert the newly-created archive directories/files; no existing report, manifest, or label needs restoring since none is ever overwritten in place.
<!-- /ANCHOR:enhanced-rollback -->
