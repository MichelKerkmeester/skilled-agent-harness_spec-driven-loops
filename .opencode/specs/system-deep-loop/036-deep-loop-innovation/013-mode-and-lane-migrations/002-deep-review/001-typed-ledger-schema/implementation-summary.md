---
title: "Implementation Summary: Deep Review Typed Ledger Schema"
description: "The additive-dark Deep Review ledger boundary now exposes a 26-stem typed event union, closed payload and scope contracts, adjudication-bound severity transitions, and fail-closed legacy compatibility hooks."
trigger_phrases:
  - "deep review typed ledger implementation"
  - "deep review event union"
  - "deep review legacy upcaster"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/001-typed-ledger-schema"
    last_updated_at: "2026-07-23T08:21:59Z"
    last_updated_by: "codex"
    recent_action: "Closed the graph-convergence blocker validation gap"
    next_safe_action: "Fold the exported union in 002-reducers-and-projections"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-ledger-schema.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-review-ledger-schema-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Authorization references remain owned by durable ledger frames"
      - "Verdict-bearing finding state binds a typed adjudication event and digest"
      - "Both blocked decisions on graph convergence require recorded blockers"
      - "Unknown legacy records and versions fail closed"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-typed-ledger-schema |
| **Completed** | 2026-07-23 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; legacy Deep Review state remains authoritative |
| **Baseline revision** | `012652b479dee08455de574574c5e7a8971a8b0b` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep Review now has a typed append-only vocabulary that later reducer and projection work can consume without inheriting mutable JSONL shapes. The schema covers 26 lifecycle stems from initialization through scope and protocol planning, dimension passes, candidates, raw evidence, adjudication, lineage, convergence, recovery, report handoff, continuity, and completion.

### Closed typed ledger boundary

`DeepReviewLedgerEvent` is the discriminated union. `DeepReviewEventEnvelope` specializes the shared `EventEnvelope` and reuses its identity, causation, producer, authority epoch, and replay fields. The mode payload adds only the stem, per-event version, typed scope, prior-tail commitment, deterministic payload digest, replay metadata, and closed event data.

`DATA_FIELD_RULES` assigns every data field one semantic validator. Digests and fingerprints require lowercase 64-character hex; identifiers, references, versions, and codes use bounded tokens; ratios and counts are range checked; enums are occurrence-specific; human explanation is accepted only in explicit reason fields; nested targets, locators, fingerprints, signals, gates, counts, event ranges, and report manifests reject unknown keys.

The schema keeps raw observations separate from derived decisions. Candidate events carry raw confidence, impact, actionability, reachability, exploitability, evidence scope, and observation digests but cannot carry P0/P1/P2 severity. Only typed adjudication records can establish severity, and a later finding-state event must bind both the adjudication event ID and its payload digest.

Semantic fingerprints combine a versioned semantic anchor, normalized context, program slice, rename map, and baseline state. Finding lineage distinguishes `introduced`, `updated`, `unchanged`, `fixed`, `preexisting`, `absent`, and `disproved` without mutating prior events.

Graph convergence now applies the blocker implication to both decision layers. A blocked inherited `decision` or blocked `graphDecision` requires at least one `blockerIds` entry, while non-blocked values remain independently valid.

### Legacy compatibility boundary

The pure compatibility hook returns `exact`, `compatible`, `migrate`, `pin-old-runtime`, or `blocked`. Registered legacy JSONL migrations preserve the original record digest and deterministic upcaster fingerprint, emit values accepted by the current closed schema, and pass through the real authorization and append path. Unknown records, stems, and versions return `blocked`; in-place legacy mutations return `pin-old-runtime`.

### Contract pins

| Contract | SHA-256 |
|----------|---------|
| Shared event-envelope export | `87c50ebe979550fe2ac69be7eaf89a43d6fbfeb280d9a72e8fcba0ac59e1dd9b` |
| Authorized-ledger export | `5c5daca8f76752311478a905df6c7035a6eefcfb18bbd474bbbb6310d7d33315` |
| Replay-fingerprint export | `4bc262f52f155ef4efdd993f6193fdd40558f07429b67244496bb70a4807bc90` |
| Golden Deep Research schema template | `1dbc162804943d1b845f3b1088cebc234336d6959fc8351fbacd1dc5fe9b605a` |
| Deep Review vocabulary manifest | `eb588e451e91501be56d1bd34dbecdb3f3e36ad3c502307ca9519412a74f10d4` |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts` | Created | Event stems, wire mappings, scopes, value objects, payload contracts, and exported union |
| `runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts` | Created and hardened | Closed validators, payload digests, event registry, envelope preparation, and blocker implications for both graph-convergence decisions |
| `runtime/lib/deep-review-ledger-schema/legacy-compatibility.ts` | Created | Pure fail-closed compatibility decisions and registered legacy upcasters |
| `runtime/lib/deep-review-ledger-schema/index.ts` | Created | Stable public module boundary for sibling consumers |
| `runtime/tests/unit/deep-review-ledger-schema.vitest.ts` | Created and expanded | Full-stem authorization, replay, rejection, adjudication, lineage, compatibility, and graph-convergence blocker coverage |
| Leaf packet docs | Updated | Completion state, verification evidence, boundary decision, and sibling handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module is dark and has no authoritative writer integration. Tests construct current envelopes, authorize them with the real `TransitionAuthorizationGateway`, append them with `AppendOnlyLedger.appendAuthorized`, and read them through verified ledger storage. The graph-convergence regression first failed at its intended rejection assertion with the source guard absent, then passed with a non-empty blocker positive control after the guard was added. No golden Deep Research module, shared envelope, authorized ledger, replay fingerprint, mode contract, legacy writer, reducer, projection, report generator, or authority path changed. The template-inherited mutable-field denylist remains unchanged; the exact-field allowlists continue to enforce the existing no-mutable-bodies behavior.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep authorization references in durable ledger frames | The frozen gateway and ledger own proof freshness, policy binding, and durable decision references. Repeating those fields in a mode payload would create a second authority surface. |
| Keep candidates non-verdict-bearing | Candidate impact and confidence are observations, not publication authority. P0/P1/P2 exists only on a typed adjudication event, and finding-state changes bind that event plus its payload digest. |
| Close every payload and nested object by semantic kind | Exact fields prevent synonym-key smuggling and ensure new fields fail until their digest, token, enum, numeric, prose, array, or value-object kind is declared. |
| Preserve raw and derived values in different event families | Evidence observations retain raw tool results, while adjudication and convergence record later decisions without overwriting the raw witness. |
| Apply blocker implications to both graph-convergence decisions | The graph event inherits the baseline decision and adds a graph decision, so either blocked value must retain the blockers that caused it. |
| Leave the inherited mutable-field denylist unchanged | Exact-field allowlists already enforce the behavior, and a clone-local rewrite would diverge from the landed template without changing accepted payloads. |
| Use semantic fingerprints for cross-pass identity | Semantic anchors, normalized context, program slices, rename maps, and baseline state survive line movement better than path and line identity alone. |
| Pin lossy legacy mutations to the old runtime | A compatibility hook must not invent candidate, finding, evidence, or adjudication identity from mutable prose. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 15 tests passed, up from the 14-test baseline |
| All-stem matrix | PASS: 26/26 stems authorize, append, and read back with durable authorization references |
| Candidate-verdict mutation check | PASS: temporarily admitting `finalSeverity` on candidate data made the targeted test fail at its intended assertion; the guard was restored and the full suite returned green |
| Graph-convergence decision mutation check | PASS: with the new test present and the source guard absent, Vitest reported 1 failed and 14 passed; after the guard was added, the blocked/no-blockers case rejects and the blocked/non-empty-blockers positive control accepts |
| Legacy producer path | PASS: a registered legacy iteration upcasts, preserves source/upcaster digests, prepares against the current registry, authorizes, appends, and reads back |
| Runtime TypeScript project | PASS: project-pinned `tsc --noEmit -p runtime/tsconfig.json` exit 0 with zero errors |
| Comment hygiene scan | PASS: no decision, requirement, checklist, task, or spec-path labels in code comments |
| Scope audit | PASS: authored changes are limited to the new module, its unit suite, and this leaf's docs |
| Strict spec validation | PASS: exit 0, Errors 0, Warnings 0 after metadata refresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No reducer or projection.** The next sibling must fold `DeepReviewLedgerEvent`; this leaf provides no materialized state.
2. **No authoritative writer.** The existing Deep Review state path remains unchanged and authoritative.
3. **No report view or sealed artifact.** Report payloads carry revision, section-manifest, digest, receipt, unresolved, and deferred references only.
4. **No certificate, rollback switch, mode gate, or cutover.** Those remain owned by later siblings.
5. **Legacy migration is narrow.** Records without stable run, session, iteration, and dimension identity return `pin-old-runtime`; unknown records and versions return `blocked`.
<!-- /ANCHOR:limitations -->
