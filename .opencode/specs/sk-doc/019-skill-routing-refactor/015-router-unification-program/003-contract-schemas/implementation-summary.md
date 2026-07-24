---
title: "Implementation Summary: Contract Schemas and Byte-Stable Identity"
description: "Implemented the V1 contract family, canonical serialization, domain-separated hashing, deterministic fixtures, and offline structural validation harness."
trigger_phrases:
  - "contract schemas implementation summary"
  - "router v1 hash baseline"
  - "stage zero schema closure"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

# Implementation Summary: Contract Schemas and Byte-Stable Identity

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Completed** | 2026-07-18 |
| **Level** | 2 |
| **Local Status** | Strengthened harness green; refuted baseline corrected |
| **External Status** | Strict packet validation intentionally delegated to orchestrator |
| **Live Authority** | None; legacy serving behavior untouched |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented and adversarially repaired the V1 router contract foundation. The deliverable has one byte-normalization and hashing implementation, nine JSON Schema fidelity artifacts, 20 valid fixtures, 17 must-fail fixtures, five hand-derived external canonical-byte vectors, and an offline validator that checks structural safety, referential closure, identity, projections, replay compatibility, and the N=1 degeneracy.

### Artifact Groups

| Group | Action | Purpose |
|-------|--------|---------|
| `serialization-hashing.md` | Created | Normative JCS profile, domain registry, identity exclusions, and V1→V2 evolution rule |
| `lib/canonical.cjs` | Corrected | Direct recursive canonical emitter, invalid-Unicode rejection, and domain-separated hash functions |
| `schemas/*.schema.json` | Created (9) | Strict V1 contract family and projection front-matter schemas |
| `fixtures/*.json` | Updated (20 golden, 17 adversarial, 5 byte vectors) | Regenerated replay corpus, rule-specific negative cases, and independent canonical-byte oracle |
| `fixtures/build-fixtures.cjs` | Created | Built-in-only fixture producer using the shared identity implementation |
| `harness/validate-contracts.cjs` | Created | Built-in-only structural validator and invariant harness |
| `checklist.md` | Created | Level-2 evidence and migration-gate record |
| `tasks.md`, `plan.md`, `spec.md` | Updated | Completion evidence and honest external-gate status |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The adversarial review invalidated the earlier green result: rebuilt-object serialization was not JCS for integer-index keys, rejection assertions accepted incidental errors, graph identities were not closed, request-evidence names were underconstrained, and the skill-branch scan covered only three hardcoded files with a one-line `if` regex. The repair kept the handwritten allow-list validators authoritative, mirrored load-bearing route constraints into JSON Schema, replaced object rebuilding with direct recursive byte emission, added a hand-derived byte oracle, regenerated every hash-bearing fixture, and expanded the must-fail corpus. The harness now requires each of 17 negative fixtures to fail for its declared rule, dynamically inventories all `.cjs` files, and self-tests multiline `if`, `switch`, and ternary detection. No live routing surface was touched, so rollback remains deletion or restoration of this phase folder.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Use a narrowed RFC 8785/JCS profile with only integers or decimal strings | Byte identity must not depend on locale, whitespace, insertion order, or IEEE-754 rounding; resolves synthesis §11.4 |
| Emit recursively sorted object members directly | Rebuilding a JavaScript object lets integer-index keys escape lexical JCS ordering |
| Keep five hand-derived canonical byte vectors outside fixture generation | The serializer cannot serve as its own oracle; expected bytes must remain independent of implementation output |
| Normalize `overlayHash: null` to omission before canonical bytes | Makes the base-only N=1 configuration byte-identical under the canonical default from synthesis §5.1 and §4 Seam D |
| Use ten closed V1 domain tags, including an effective-identity tuple tag | Cross-type equal bytes cannot collide, while the effective digest binds base, overlay, schema, and generation from synthesis §2 |
| Model decisions as four strict nested branches | Keeps positive composition inside `route` and makes negative capability smuggling unrepresentable per synthesis §2.3 and §4 Seam A |
| Keep `(T,R,P)` as compiled posture sub-objects | The knobs parameterize a fixed public decision shape instead of becoming a second control plane per synthesis §4 Seam C |
| Use one shared uncertainty budget schema | Independent rung budgets permit loops; one turn, one hop, and one visited set implement synthesis §4 Seam B |
| Validate with targeted type-specific allow-lists | The worktree has no dependencies; strict structural checks provide the required parse behavior while JSON Schemas remain interoperability artifacts |
| Add bare-path and mode-only adversarial identities | The compound destination identity from synthesis §2.2 is load-bearing and needed executable negative coverage |
| Close every policy edge over a unique destination map | Duplicate identities and dangling selector/composition/authority targets otherwise make authority resolution ambiguous |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Evidence |
|-----------|--------|----------|
| Harness | Pass | 11/11 groups; 20/20 golden accepted; 17/17 adversarial rejected for expected rules; 5/5 external byte vectors matched |
| Syntax | Pass | `node --check` on serializer, fixture generator, and harness |
| Serialization | Pass | direct UTF-16 lexical emission, integer-key oracle, nested/array vectors, invalid-Unicode rejection, null-overlay equivalence, float rejection |
| Identity | Pass | all stored digests recompute; effective tuple mutations change identity; ten-way domain separation |
| Algebra | Pass | route-only targets; exact single/bundle cardinality; evidence read-only/no-COMMIT; negative authority withheld; degraded fallback names request evidence |
| Policy closure | Pass | canonical destination IDs unique; selector, composition, and authority targets resolve exactly once |
| Degeneracy | Pass | N=1 common schema, empty bundles/authority, omitted overlay, no handoff rung, zero rank calls; all three `.cjs` files scanned with detector self-tests |
| Projection safety | Pass | advisor omit-list and typed compatibility mappings enforced |
| Isolation grep | Pass | no scorer/loader/registry/skill import, network call, skill-name branch, or forbidden code-comment metadata |
| Strict spec validation | Not run locally | Explicit operator constraint delegates it to the orchestrator from the main tree |

### Harness Output

```text
PASS schema artifacts — 9/9 loaded
PASS golden fixture validation — 20/20 accepted
PASS adversarial parse rejection — 17/17 rejected for expected rule
PASS decision algebra safety — nested union and no-over-emission invariants hold
PASS canonical serialization — 5/5 external vectors matched; Unicode and overlay invariants hold
PASS hash identity and reproducibility — base, overlay, request, proof, projection, and effective hashes reproduced
PASS domain separation — 10/10 registered tags unique across equal canonical bytes
PASS singular degeneracy — empty collections and zero rank calls; 3 executable .cjs inventoried; detector self-tests passed
PASS advisor projection omit-list — paths/tools/mutation/fences/leases/commit authority absent
PASS compatibility projection — typed positive/negative cases map to observedIntents/observedResources
PASS proof overlay and idempotency evidence — stale proof, base-bound overlay replay, and duplicate receipt behavior represented
SUMMARY golden=20 accepted=20; adversarial=17 rejected=17; groups=11 passed=11
```

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR | Target | Actual | Status |
|-----|--------|--------|--------|
| Determinism | Same logical artifact → same bytes/hash | All golden fixtures reproduce across parse/serialize passes | Pass |
| Domain separation | Equal bytes under different types → distinct hashes | 10/10 tags produce unique digests | Pass |
| Safety | Negative decisions, ambiguous identities, dangling references, and evidence roles cannot gain effect authority | 17 adversarial cases rejected for their named rule | Pass |
| Portability | Offline and dependency-free | Node built-ins only; no network or live surface | Pass |
| Compatibility | Typed gold projects to existing observation shape | Positive and negative mappings pass without shared scorer | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:migration -->
## Migration Gate

The earlier Stage-0 closure claim was not reliable because its determinism test shared the serializer under test and several authority/reference invariants were absent. The corrected baseline now has external expected bytes, regenerated hashes, referential closure, rule-specific negative assertions, and broader degeneracy scanning. Subject to the external packet gate below, phase `001` can bind its N=1 shadow compiler to these corrected contracts with legacy routing still authoritative.

This does not claim the full serving baseline has been captured. Phase `001` owns that remaining Stage-0 evidence before any Stage-1 activation gate. Strict packet validation is also pending the orchestrator because the operator prohibited running the repository validator in this worktree.
<!-- /ANCHOR:migration -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Run strict spec validation locally | Delegated to orchestrator | Explicit hard constraint says not to run `validate.sh` in this worktree |
| Four adversarial fixtures | Seventeen adversarial fixtures | Added executable coverage for identity ambiguity, dangling edges, both cardinalities, evidence authority, and request/display namespace abuse |
| Schema validation harness | Targeted strict validator plus JSON Schema artifacts | Zero-dependency constraint rules out a general npm validator; explicit allow-lists enforce the required fixture surface |
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The orchestrator must run strict spec validation from the main tree; no local result is claimed.
2. The five expected canonical strings are independent hand-derived vectors, not a second serializer implementation; cross-runtime reproduction remains a Stage-1 integration gate.
3. The harness intentionally validates the frozen V1 fixture surface, not arbitrary JSON Schema keywords. Downstream consumers should use a standards-compliant validator when dependencies are available.
4. No live compiler, evaluator, activation selector, or serving baseline was built here; those remain Phase `001+` responsibilities.
<!-- /ANCHOR:limitations -->
