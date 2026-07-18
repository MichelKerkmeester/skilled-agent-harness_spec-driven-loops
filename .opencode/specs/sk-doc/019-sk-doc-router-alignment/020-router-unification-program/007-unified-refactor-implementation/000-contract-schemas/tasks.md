---
title: "Tasks: Contract Schemas — Canonical Family, Serialization & Hashing"
description: "Ordered, checkable task list executing the phase-0 plan: serialization rule, domain-separated hashing rule, the versioned schema family, golden + N=1 fixtures, the offline validation harness, and gate closure. Task Format: T### [P?] Description (file path)."
trigger_phrases:
  - "contract schemas tasks"
  - "canonical json hashing tasks"
  - "schema validation harness tasks"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Contract Schemas

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

---

## Phase A: Serialization & hashing rules (resolve open-q 4) — do first

- [x] T001 Read the named synthesis sections and confirm `hash(base, overlay|null, schema, generation)` (`spec.md`)
  - **Evidence**: `serialization-hashing.md` §§1–5 cite synthesis §§2, 4, 8, 9, and 11.4 and freeze the tuple.
- [x] T002 Author the canonical-JSON serialization rule (`serialization-hashing.md`)
  - **Evidence**: §1 specifies direct recursive emission, UTF-8/no-BOM, UTF-16 lexical key order, compact output, integer/decimal-string numbers, lone-surrogate rejection, present collections, omitted optional scalars, and five hand-derived external byte vectors.
- [x] T003 Author the domain-separated SHA-256 rule and closed registry (`serialization-hashing.md`)
  - **Evidence**: §§2–3 define the NUL-delimited construction and ten unique V1 tags.
- [x] T004 Define every identity field (`serialization-hashing.md`)
  - **Evidence**: §4 defines base, overlay, effective, request, proof, advisor/gold projection, and human-view hashes with exact exclusion sets.
- [x] T005 Record schema versioning (`serialization-hashing.md`)
  - **Evidence**: §5 requires V2 for any hashed-field, canonicalization, algorithm, exclusion-set, or tag change and includes a worked field-addition example.

---

## Phase B: Author the `V1` schema family (binds to Phase A)

- [x] T006 [P] Author `CompiledPolicyV1` (`schemas/compiled-policy.v1.schema.json`)
  - **Evidence**: compound six-part identity shape, role/authority/mutation fields, evidence read-only/no-COMMIT conditional, duplicate-ID rejection, selector/composition/authority referential closure, all graph collections, posture objects, and identity digests are enforced.
- [x] T007 [P] Author nested `RouteDecisionV1` (`schemas/route-decision.v1.schema.json`)
  - **Evidence**: four `oneOf` branches own disjoint nested bodies; only `route` admits targets/selection; schema and validator enforce exact single/bundle cardinality; evidence targets are read-only and cannot carry COMMIT authority; clarify alternatives reserve authority/capability namespaces.
- [x] T008 [P] Author `RouteRequestV1` (`schemas/route-request.v1.schema.json`)
  - **Evidence**: explicit mode is separate and optional; observations, provenance-tagged evidence/trust, request digest, and pinned generation are required.
- [x] T009 [P] Author overlay and shared uncertainty budget schemas (`schemas/correction-overlay.v1.schema.json`, `schemas/uncertainty-budget.v1.schema.json`)
  - **Evidence**: overlay binds one base digest; budget has one fixed turn, one fixed hop, and one unique visited set with no per-rung fields.
- [x] T010 [P] Author `RouteProofV1` (`schemas/route-proof.v1.schema.json`)
  - **Evidence**: strict allow-list contains destination/read-set/epoch/expiry/key/attestation/proof digest and no COMMIT grant.
- [x] T011 [P] Author advisor, typed-gold, and policy-card projection schemas (`schemas/*.schema.json`)
  - **Evidence**: strict projection allow-lists, compatibility fields, receipt evidence, effective identity, and projection/human-view digests are present.

---

## Phase C: Golden + N=1 fixtures

- [x] T012 Author the multi-mode compiled-policy fixture (`fixtures/compiled-policy.multimode.json`)
  - **Evidence**: three roles, two bundle kinds, authority edges, calibrated posture, active overlay, and real computed hashes validate.
- [x] T013 Author the N=1 compiled-policy fixture (`fixtures/compiled-policy.n1.json`)
  - **Evidence**: identical schema; one destination; empty composition/authority collections; exact admission; clarify/defer/reject ladder; static provenance; omitted overlay.
- [x] T014 Author all named decision and replay families (`fixtures/`)
  - **Evidence**: 20 golden fixtures cover exact/ordered/surface/degraded routes, no-match defer, clarify, reject, live/stale/absent evidence, stale/fresh proof, overlay replay, shared budget, all projections, singular zero-rank, and duplicate receipt behavior.
- [x] T015 Author must-fail fixtures (`fixtures/adversarial/`)
  - **Evidence**: 17 fixtures cover negative capability smuggling, invalid identities, route evidence mutation/COMMIT authority, both selection-cardinality directions, duplicate identities, dangling selector/composition/authority references, and invalid unavailable-evidence/clarify namespaces.

---

## Phase D: Offline validation harness

- [x] T016 Build the targeted zero-dependency validator (`harness/validate-contracts.cjs`)
  - **Evidence**: all 20 golden fixtures validate through authoritative type-specific allow-lists tied to nine loaded schema artifacts; named references are trim-checked and graph references resolve against a unique destination inventory.
- [x] T017 Assert union invariants and must-fail parsing (`harness/validate-contracts.cjs`)
  - **Evidence**: all 17 adversarial fixtures are rejected by structural parsing, and every assertion matches the expected rule-specific error substring so incidental exceptions cannot pass the group.
- [x] T018 Assert serialization and hashing determinism (`harness/validate-contracts.cjs`)
  - **Evidence**: 5/5 hand-derived external canonical-byte vectors, integer-key lexical order, nested/array recursion, lone-surrogate rejection, absent/null overlay equivalence, digest recomputation, effective tuple mutations, and ten-tag cross-domain separation pass.
- [x] T019 Assert N=1 degeneracy and advisor omission (`harness/validate-contracts.cjs`)
  - **Evidence**: empty bundle/authority collections, no handoff rung, zero rank calls, no rank fields, no overlay, dynamic inventory of all three executable `.cjs` files, multiline-if/switch/ternary detector self-tests, and recursive advisor omit-list pass.
- [x] T020 [P] Verify isolation and offline operation (`harness/validate-contracts.cjs`)
  - **Evidence**: `rg` returned no matches for scorer/loader/registry/skill imports, network built-ins/fetch, skill-name branches, or forbidden code-comment metadata.

---

## Phase E: Verify + close the migration gate

- [x] T021 Run the harness green over the full golden + adversarial set
  - **Evidence**: `node harness/validate-contracts.cjs` exits 0; 11/11 groups pass, 20/20 golden accepted, 17/17 adversarial rejected for the expected rule, and 5/5 external canonical vectors match.
- [x] T022 Confirm typed-gold compatibility projection without the shared scorer
  - **Evidence**: harness maps positive and negative fixtures to `observedIntents`/`observedResources`; forbidden-import grep is empty.
- [x] T023 Route strict packet validation to the orchestrator
  - **Evidence**: operator hard constraint explicitly prohibits `validate.sh` in this worktree and states the orchestrator will run it from the main tree; no local pass is claimed.
- [x] T024 Record the local Stage-0 contract baseline closure and Stage-1 readiness (`checklist.md`, `implementation-summary.md`)
  - **Evidence**: the previously self-oracular baseline is superseded by external canonical bytes and rule-specific adversarial evidence; schemas, generated hashes, fixtures, and the strengthened harness are synchronized and green.

---

## Dependency Notes

- Phase A (T002–T005) is a hard prerequisite for Phase B — schema identity fields are defined in terms of the serialization/hashing rules.
- Phase B tasks T006–T011 are mutually parallelizable once Phase A is frozen.
- Phase C depends on the schemas (Phase B); Phase D depends on schemas + fixtures.
- T024 is the gate-closure task: it must not be marked `[x]` until T021–T023 pass.
