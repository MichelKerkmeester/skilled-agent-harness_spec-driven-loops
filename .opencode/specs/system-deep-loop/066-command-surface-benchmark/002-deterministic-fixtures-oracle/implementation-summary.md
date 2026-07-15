---
title: "Implementation Summary: deterministic fixtures and independent reference oracle"
description: "The command-surface benchmark now has a reproducible 13-tree fixture corpus, a CLI-only independent oracle, frozen per-fixture expectations, and a consuming manifest that production adapter code may not import from or invoke."
status: complete
trigger_phrases:
  - "command fixture oracle implementation"
  - "deterministic command fixtures complete"
  - "command surface frozen expectations"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/002-deterministic-fixtures-oracle"
    last_updated_at: "2026-07-15T06:49:12Z"
    last_updated_by: "codex"
    recent_action: "Completed the independent oracle, deterministic fixture corpus, and frozen expectations"
    next_safe_action: "Refresh generated metadata, then let phase 003 consume expectations without oracle imports"
    blockers: []
    key_files:
      - "oracle/reference-oracle.cjs"
      - "fixtures/mutation-manifest.json"
      - "fixtures/build-fixtures.cjs"
      - "expectations/index.json"
      - ".opencode/skills/system-deep-loop/deep-alignment/assets/conformance_benchmark/command-surface/fixtures/fixture-manifest.json"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The compound held-out fixture combines mirror drift, missing workflow reachability, and duplicated presentation ownership."
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-deterministic-fixtures-oracle |
| **Completed** | 2026-07-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The deterministic command axis now has ground truth that predates and cannot be
shared with the future production adapter. One clean command tree contains
representatives of all four frozen topologies and is transformed into eight public
defect fixtures, four held-out fixtures, and a clean control; the independent
oracle freezes each exact code, severity, dimension, and location.

### Independent Oracle and Corpus

`oracle/reference-oracle.cjs` is a self-contained CommonJS CLI with no exports.
Importing it throws before any classifier API can be reused. It inspects canonical
commands, generated mirrors, target references, subaction mappings, workflow
capabilities, destructive confirmation boundaries, and presentation markers.

`fixtures/build-fixtures.cjs` applies only the transformations declared in
`fixtures/mutation-manifest.json`. Rebuilding all 13 trees preserves the canonical
fixture-root SHA-256 value, so fixture identity does not depend on timestamps or
directory enumeration order.

### Frozen Expectations and Consuming Manifest

The oracle wrote one diffable expectation file per fixture plus
`expectations/index.json`. The consuming `fixture-manifest.json` instantiates the
conformance-benchmark template with oracle provenance, fixture hashes, mutation
provenance, expected outcomes, and `productionAdapterImportProhibited: true`; it
contains no oracle implementation logic.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `oracle/reference-oracle.cjs` | Created | Classify fixture trees, freeze outcomes, verify hashes and exact finding sets, and enforce the import boundary. |
| `fixtures/mutation-manifest.json` | Created | Describe the clean base, twelve defect transformations, classifications, and source provenance. |
| `fixtures/build-fixtures.cjs` | Created | Materialize the deterministic corpus from the clean base and manifest operations. |
| `fixtures/base/clean-command-tree/` | Created | Provide the real-command-derived canonical, mirror, workflow, and presentation baseline. |
| `fixtures/corpus/` | Created | Store eight public defects, four held-out defects, and the clean control. |
| `expectations/` | Created | Store frozen per-fixture results and the oracle/hash index. |
| `fixture-manifest.json` in the consuming package | Created | Publish template-shaped provenance, hashes, mutations, and expected outcomes without oracle code. |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modified/Created | Reconcile completion status and record evidence. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The clean tree follows the live `/doctor:mcp` subaction-router and generated
mirror shapes, with representative workflow-router, direct-tool/plugin-router,
and monolithic commands completing the four-topology baseline. The corpus was
built before freezing expectations. The oracle then classified every materialized
tree, wrote the expectation files and consuming manifest, and reran from disk
without a write path to prove exact-set equality and stable hashes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the oracle in one CLI-only file | A single file with no exports and a fail-fast import guard makes shared classifier helpers unavailable to production adapter code. |
| Generate every fixture from one clean tree | Named data transformations make each defect reproducible and isolate collateral findings. |
| Use eight public single-defect fixtures | Calibration covers mirror identity, target reachability, route integrity, capability/safety consistency, and presentation ownership without teaching compound behavior. |
| Hold back four adversarial fixtures | The orphan mirror, wrong subaction, destructive contradiction, and three-defect compound case remain outside adapter authoring inputs. |
| Hash canonical path-and-content serialization | Sorted repo-relative paths plus file bytes make directory hashes stable across rebuild timestamps and filesystem order. |
| Freeze expectations before adapter implementation | The consuming package records oracle outcomes as data, while the future adapter can read those outcomes but cannot import or invoke oracle logic. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Oracle verifier | PASS, exit `0`: all 13 fixtures match; `clean=0 public=8 held-out=4`. |
| Clean control classification | PASS, exit `0`: direct `--classify` output is `[]`. |
| Deterministic rebuild | PASS, exit `0`: rebuild followed by verify preserves fixture-root hash `0d1e6ab84ad9214a0ad6eabeb5147e99499cfea640326aeeb66503f24e537bf8`. |
| Oracle syntax | PASS, exit `0`: `node --check oracle/reference-oracle.cjs`. |
| Builder syntax | PASS, exit `0`: `node --check fixtures/build-fixtures.cjs`. |
| JSON parsing | PASS, exit `0`: mutation manifest, all expectation files, and consuming fixture manifest parse as strict JSON. |
| Comment hygiene | PASS, exit `0`: both CommonJS files report zero forbidden comment references. |
| Strict packet validation | BLOCKED at the orchestrator boundary, exit `2`: every authored-doc rule passes, but `graph-metadata.json` reports `SOURCE_FINGERPRINT_MISMATCH` until the prohibited metadata refresh runs. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Future tuning remains a process boundary.** The held-out classification and import prohibition are frozen now; phase 003 must keep held-out fixtures outside adapter implementation and tuning.
2. **The adapter boundary scan activates when code exists.** The verifier already rejects direct oracle path, filename, or oracle-ID references in the future adapter, but there is no adapter file to inspect in this phase.
3. **Generated packet metadata remains orchestrator-owned.** `description.json` and `graph-metadata.json` were intentionally not regenerated in this implementation.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
-->
