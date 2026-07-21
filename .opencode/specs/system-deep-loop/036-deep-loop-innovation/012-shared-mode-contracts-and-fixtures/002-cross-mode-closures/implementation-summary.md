---
title: "Implementation Summary: Cross-Mode Closures"
description: "Five reusable typed closures now give all eight phase-013 workstreams one additive-dark path for evidence, effects, adjudication, budgets, and projections."
trigger_phrases:
  - "cross-mode closures implementation"
  - "shared closure verification evidence"
  - "phase 013 closure handoff"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/002-cross-mode-closures"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/002-cross-mode-closures"
    last_updated_at: "2026-07-21T14:11:23Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the additive-dark cross-mode closure layer"
    next_safe_action: "Consume the closure catalog from the phase-013 mode adapters"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/cross-mode-closures.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The frozen ModeContract supplies mode identity, interface version, authority posture, lifecycle declarations, and declared writes."
      - "Overrides supply data or policy only and never receive a safety-port capability."
      - "Legacy council, deep-loop, synthesis, and improvement helpers remain authoritative parity or adapter inputs."
---
# Implementation Summary: Cross-Mode Closures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-cross-mode-closures |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Status** | Complete |
| **Closure owners** | `cross-mode-closures.{evidence,receipts-effects,adjudication,budgets,projections}@1` |
| **Authority** | Additive-dark; legacy results remain authoritative |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

All eight phase-013 workstreams now resolve the five recurring responsibilities to the same function identities. The layer consumes the frozen `ModeContract`, binds its declared writes to concrete fence resources, and wraps the existing phase-007 services without copying their authorization, sealing, recovery, adjudication, budget, gauge, or fencing logic.

### Five Shared Owners

- Evidence preserves the complete mode payload and attaches the shared claim contract, verified sealed-reference digests, lifecycle identity, and provenance.
- Receipts and effects append the authorized lifecycle fact before delegating intent, execution or recovery, confirmation, and boundary certification to the existing gateway.
- Adjudication invokes the shared blinded service and returns its verdict, raw judgments, and counterfactual probes without a mode-local reduction.
- Budgets admit, charge attempts, and settle through the hierarchical authority; uncertain accounting, missing terminal usage, and typed exhaustion deny work.
- Projections apply the authorized event to the registered gauge, run a deterministic mode-owned reducer, and replace state through a declared fenced resource.

### Ownership and Compatibility

The closed override seam accepts only named data or policy transformations. All four override sites now validate exact output keys, reserved bypass fields are rejected recursively, and nondeterministic output fails before persistence or return. The catalog maps the exact eight manifest identities to the same five implementations, while the deep-improvement common pipeline runs evaluation, benchmark, promotion, and mirror verification once before the three thin variants.

Validated phase-006/007 ports are held in module-private context storage. The returned context no longer exposes `services`, so a mode holding the context cannot invoke raw effect or receipt methods outside the authorized closure sequence.

Legacy council, deep-loop, synthesis, and deep-improvement surfaces are recorded as executable parity or adapter inputs. `compareAdditiveDark` returns the exact legacy result on closure match, divergence, or failure, so this leaf never becomes a second authority.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/` | Created | Typed context, five closure owners, catalog, overrides, parity observation, and common improvement pipeline |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/cross-mode-closures.vitest.ts` | Created | Fifteen adversarial ownership, bypass, ordering, denial, replay, preservation, parity, private-port, closed-output, and reuse fixtures |
| This leaf's canonical docs | Updated | Completion state, decisions, evidence, and phase-013 handoff |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation is additive only. It imports the frozen mode-contract and phase-007 types, privately binds class methods instead of copying service logic, and exposes no authority-changing switch. The unit suite supplies fixed service results and attacks missing manifest rows, nested and top-level safety bypass fields at every previously uncovered override site, direct raw-port access, local adjudication reduction, receipt ordering, budget uncertainty and exhaustion, replay instability, raw evidence loss, shadow failure, and common-pipeline duplication.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Derive mode identity and interface version from `ModeContract` | A caller cannot present a closure-local lifecycle or authority interpretation that differs from the frozen sibling interface. |
| Bind declared mode writes to concrete protected resources | The projection closure can reject an undeclared lease before it reaches the fenced state store. |
| Invoke data/policy overrides twice against frozen canonical input | Nondeterministic mode policy fails before it can produce a receipt, admission, or projection write. |
| Require declared exact output keys at projection and variant override sites | Mode-owned schemas remain explicit while undeclared fields cannot flow into persisted projections or returned variants. |
| Store validated services outside the public context object | Closure owners can invoke raw ports, while a mode holding only the context cannot bypass authorized receipt/effect ordering. |
| Return adjudication service evidence by reference | The closure cannot silently reconstruct pass/fail from scores or discard probes, ties, minority evidence, or independence data. |
| Keep common improvement mechanics separate from the five closure responsibilities | The three variants stay thin without inventing a sixth cross-mode safety authority. |
| Treat shipped helpers as parity or adapter inputs | Existing runtime behavior stays authoritative and remains directly comparable without a forked implementation. |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest suite | PASS: 1 file, 15 tests |
| Runtime TypeScript project | PASS: `tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json` with repository TypeScript 5.9.3 |
| Comment hygiene | PASS: zero violations across the new library and test |
| Strict leaf validation | PASS: errors 0, warnings 0 |
| Scope audit | PASS for this leaf: only the new closure library, its test, and this leaf's docs are authored by this work |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No authority cutover.** Phase-013 adapters may consume these closures in shadow, but legacy decisions and projections remain authoritative until a later approved cutover.
2. **No mode migration.** This leaf supplies the catalog and typed mechanics; it does not edit any of the eight mode workstreams.
3. **No substrate replacement.** Crash recovery, receipt idempotency, artifact sealing, blinded reduction, budget accounting, gauge determinism, and fence validation remain owned by their existing phase-007 services.
<!-- /ANCHOR:limitations -->
