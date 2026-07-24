---
title: "Verification Checklist: Contract Schemas and Byte-Stable Identity"
description: "Level-2 evidence for the V1 router contract family, deterministic serialization, domain-separated hashing, golden/adversarial fixtures, and the offline harness."
trigger_phrases:
  - "contract schema verification"
  - "router hashing harness"
  - "stage zero contract baseline"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Contract Schemas and Byte-Stable Identity

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim the local implementation gate is closed until complete |
| **[P1]** | Required | Must complete or carry an explicit operator-owned handoff |
| **[P2]** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements REQ-001..REQ-013 and edge cases read from `spec.md`.
  - **Evidence**: all requirements map to schema, fixture, harness, or reference artifacts in `tasks.md`.
- [x] CHK-002 [P0] Ordered Steps 1–6 and file layout read from `plan.md`.
  - **Evidence**: implementation order was serialization/hash → schemas → fixtures → harness → gate record.
- [x] CHK-003 [P0] Design source and migration ownership read.
  - **Evidence**: synthesis §§2, 2.1, 2.2, 2.3, 4, 5, 5.1, 8, 9, 10, 11.4 and the parent Stage-0/Stage-1 map were inspected.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Canonicalization and hashing have one implementation.
  - **Evidence**: `lib/canonical.cjs` is imported by fixture generation and validation, while `fixtures/canonical-vectors.json` remains an independent hand-derived byte oracle rather than a second producer.
- [x] CHK-011 [P0] Runtime code uses Node built-ins only.
  - **Evidence**: direct imports are limited to `crypto`, `fs`, `path`, and `assert`; no package dependency exists.
- [x] CHK-012 [P0] Targeted validation is strict rather than permissive.
  - **Evidence**: explicit required/optional allow-lists are authoritative, trim-check named references, enforce route cardinality/evidence authority, reject duplicate identities, and close selector/composition/authority references over declared destinations.
- [x] CHK-013 [P1] JSON Schemas remain high-fidelity interoperability artifacts.
  - **Evidence**: nine Draft 2020-12 schemas carry `$id`, title, strict object shapes, enums, bounds, patterns, evidence-role/cardinality conditionals, and the four-branch decision union; the harness checks those load-bearing schema nodes exist.
- [x] CHK-014 [P0] No singleton or skill-name branch exists.
  - **Evidence**: the harness inventories every `.cjs` recursively and finds no `if`, `switch`, or ternary condition using `skillId` or a policy skill name; multiline-if, `switch (skillId)`, and ternary negative self-tests prove the detector fires.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All golden fixtures parse.
  - **Evidence**: harness reports `20/20 accepted` across all nine contract types.
- [x] CHK-021 [P0] All adversarial fixtures fail structural parsing.
  - **Evidence**: harness reports `17/17 rejected for expected rule`; each fixture must match its rule-specific error substring, so an incidental exception cannot green the test.
- [x] CHK-022 [P0] Canonical bytes are deterministic and normalize a null overlay to omission.
  - **Evidence**: 5/5 hand-derived external byte vectors match, including `{"10":1,"2":2}`, nested objects, and arrays of objects; lone surrogates and floats are rejected, and null-overlay omission remains byte-identical.
- [x] CHK-023 [P0] All identity hashes reproduce and remain domain-separated.
  - **Evidence**: base/overlay/effective/request/proof/projection hashes recompute; ten registered tags produce ten distinct hashes over equal bytes.
- [x] CHK-024 [P0] Decision algebra safety and no-over-emission hold.
  - **Evidence**: only route has targets; negative authority is `Withheld`; zero-signal is target-free `defer(no-match)` with no default union.
- [x] CHK-025 [P1] N=1 degeneracy holds through the common schema.
  - **Evidence**: one destination, empty composition/authority collections, omitted overlay, no handoff rung, zero ranking fields/calls.
- [x] CHK-026 [P1] Advisor projection omission is enforced recursively.
  - **Evidence**: paths, tools, mutation scope, fences, handoff leases, and commit authority are absent.
- [x] CHK-027 [P1] Compatibility, stale-proof, overlay, and idempotency evidence are represented.
  - **Evidence**: positive/negative compatibility projection, expired proof, base-bound replay overlay, and duplicate key → one receipt/one effect assertions pass.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

The original green result was insufficient: it used self-derived canonical bytes, broad `assert.throws`, incomplete reference closure, and a one-line branch regex. The evidence below records the strengthened defect-remediation bar.

- [x] CHK-FIX-001 [P0] Every negative class the contracts must reject has adversarial coverage.
  - **Evidence**: 17 must-fail fixtures cover the original six classes plus route evidence mutation/COMMIT authority, both selection-cardinality directions, duplicate identity, dangling selector/composition/authority targets, blank/unknown unavailable evidence, and capability-bearing clarify alternatives.
- [x] CHK-FIX-002 [P0] Serialization and hashing have a single producer, so no divergent second implementation can drift.
  - **Evidence**: `rg` finds only `lib/canonical.cjs` implementing canonical bytes and domain-separated hashing; the independent oracle is checked-in expected text derived by hand, and hashes compare actual versus expected bytes through Node `crypto`.
- [x] CHK-FIX-003 [P0] Every contract type is validated by the same strict allow-lists.
  - **Evidence**: the harness validates all nine `V1` types and their fixtures against one allow-list mechanism; no type bypasses it.
- [x] CHK-FIX-004 [P0] Structural rejection is proven, not assumed.
  - **Evidence**: harness reports 17/17 adversarial fixtures rejected for their individually declared rule substring, not incidental parse, hash, or file errors.
- [x] CHK-FIX-005 [P1] The fixture matrix axes and counts are listed before completion.
  - **Evidence**: 20 golden fixtures across nine contract types, 17 adversarial fixtures, and five independent canonical-byte vectors.
- [x] CHK-FIX-006 [P1] No hostile global/process-wide state path exists to exercise.
  - **Evidence**: the harness is offline and reads only Node built-ins; it consults no environment or process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to this phase's committed artifacts.
  - **Evidence**: harness output and the fixture corpus are materialized in this folder and move together under one commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Authority locality is structural.
  - **Evidence**: route authority is withheld until VERIFY, negatives withhold authority, proof allow-list has no COMMIT grant, and evidence destinations/targets can neither mutate nor reference COMMIT authority.
- [x] CHK-031 [P0] Harness is offline.
  - **Evidence**: no HTTP/network built-in import, request call, or `fetch` call exists.
- [x] CHK-032 [P0] Shared serving surfaces are isolated.
  - **Evidence**: no scorer, benchmark loader, mode registry, or skill document is read/imported; every created/edited artifact is in this folder.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, and summary agree on local status.
  - **Evidence**: `spec.md` records local harness green and external strict validation; `tasks.md` contains evidence for T001–T024.
- [x] CHK-041 [P1] Serialization/hash reference is independently reproducible.
  - **Evidence**: `serialization-hashing.md` specifies direct recursive emission, UTF-16 ordering, invalid-Unicode rejection, omission, delimiter, algorithm, tags, exclusion sets, and the five-vector independent oracle.
- [x] CHK-042 [P1] Strict packet validation handoff is explicit.
  - **Evidence**: the operator prohibited local `validate.sh`; the orchestrator owns that command and no local result is claimed.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All writes are confined to the approved phase folder.
  - **Evidence**: schemas, fixtures, library, harness, and documentation live below this checklist's directory.
- [x] CHK-051 [P1] No temporary or dependency artifacts were introduced.
  - **Evidence**: no install command ran; fixture generation writes only the checked-in JSON corpus.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:migration-gate -->
## Migration Gate

- [x] CHK-060 [P0] Stage-0 contract baseline portion is frozen.
  - **Evidence**: V1 byte rules, schemas, domain registry, golden/adversarial corpus, and validator are materialized and green.
- [x] CHK-061 [P1] Phase `001` has the contract inputs needed for shadow compilation.
  - **Evidence**: canonical byte generation and typed compatibility projection are executable without live authority or shared-scorer changes.
- [x] CHK-062 [P1] Remaining Stage-0 ownership is named.
  - **Evidence**: Phase `001` still owns the serving legacy-baseline capture before activation; the orchestrator owns strict packet validation.
<!-- /ANCHOR:migration-gate -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified / Routed |
|----------|-------|-------------------|
| P0 Items | 16 | 16/16 |
| P1 Items | 11 | 11/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-18  
**Local Harness**: Pass — 11/11 groups; 20/20 golden; 17/17 adversarial; 5/5 external vectors  
**External Gate**: Strict spec validation delegated to orchestrator by operator instruction
<!-- /ANCHOR:summary -->
