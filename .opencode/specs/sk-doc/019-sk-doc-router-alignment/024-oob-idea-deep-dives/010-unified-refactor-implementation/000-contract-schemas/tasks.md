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

- [ ] T001 Read design source synthesis §2, §2.1, §2.3, §5, §8, §9, §10, §11.4 and confirm the identity formula `hash(base, overlay|null, schema, generation)` (`spec.md`)
- [ ] T002 Author the canonical-JSON serialization rule: UTF-8/no-BOM, sorted keys, no insignificant whitespace, no float in hashed fields, empty collections as `[]`, optional scalars omitted (Proposed: RFC 8785 JCS) (`serialization-hashing.md`)
- [ ] T003 Author the domain-separated hashing rule `H(domainTag || 0x00 || canonicalBytes)` with `SHA-256` and a closed, versioned domain-tag registry (one tag per artifact type) (`serialization-hashing.md`)
- [ ] T004 Define each identity field precisely: `basePolicyHash` (digest fields excluded), `overlayHash`, `effectivePolicyHash`, `requestFactsHash`, `proofHash`, projection `projectionHash`/`humanViewHash` (`serialization-hashing.md`)
- [ ] T005 Record the schema-versioning rule: any hashed-field or canonicalization change mints `V1→V2`; `schemaVersion` participates in `effectivePolicyHash` (`serialization-hashing.md`)

---

## Phase B: Author the `V1` schema family (binds to Phase A)

- [ ] T006 [P] Author `CompiledPolicyV1`: compound destination `id`, `role∈{actor,evidence,transport,judgment}`, `authorityRef`, `mutatesWorkspace`, `detectors[]`, `selectors[]`, `compositionRules[]`, `authorityGraph[]`, `(T,R,P)` posture, identity hashes (`schemas/compiled-policy.v1.schema.json`)
- [ ] T007 [P] Author `RouteDecisionV1` as a discriminated union: `route` (only branch with `targets`+`selectionKind`), target-free/authority-free `clarify`/`defer`/`reject`; `rankScore`/`scoreMargin` as evidence; `basis` enum with named-missing-evidence constraint (`schemas/route-decision.v1.schema.json`)
- [ ] T008 [P] Author `RouteRequestV1` (`requestFactsHash`, separate `explicitMode?`, `evidence[]` with `trust∈{live,stale,absent,unavailable}`, `pinnedActivationGeneration`) (`schemas/route-request.v1.schema.json`)
- [ ] T009 [P] Author `CorrectionOverlayV1` (bound to one `basePolicyHash`, vocab→destination adjustments, promotion provenance) and `UncertaintyBudgetV1` (`userTurns:1`, `handoffHops:1`, visited-set, no per-rung budgets) (`schemas/correction-overlay.v1.schema.json`, `schemas/uncertainty-budget.v1.schema.json`)
- [ ] T010 [P] Author `RouteProofV1` (read-set, expiry/epoch, `idempotencyKey`, attestation; no COMMIT-conferring field) (`schemas/route-proof.v1.schema.json`)
- [ ] T011 [P] Author the three projections: `AdvisorProjectionV1` (with explicit omit-list), `TypedRouteGoldV1` (compatibility-projector fields), `PolicyCardV1.md` front-matter (`effectivePolicyHash`+`humanViewHash`) (`schemas/advisor-projection.v1.schema.json`, `schemas/typed-route-gold.v1.schema.json`, `schemas/policy-card.v1.schema.json`)

---

## Phase C: Golden + N=1 fixtures

- [ ] T012 Author the multi-mode `CompiledPolicyV1` golden fixture (`fixtures/compiled-policy.multimode.json`)
- [ ] T013 Author the N=1 `mcp-code-mode`-shaped fixture: `compositionRules:[]`, `authorityGraph:[]`, `overlayHash` omitted, `T=exact-admission`, `R=clarify→defer/reject`, `P=static` (`fixtures/compiled-policy.n1.json`)
- [ ] T014 Author the §8.2 decision fixture families: exact single route; ordered + surface bundles; zero-signal `defer(no-match)` with NO default union; one-turn `clarify`; forbidden `reject`; stale/absent advisor; stale proof; overlay replay; singular-omission + zero-rank-call; duplicate idempotency-key receipt (`fixtures/decisions/*.json`)
- [ ] T015 Author adversarial fixtures that MUST fail: target inside `defer`, authority inside `reject`, `degraded-fallback` without named missing evidence, `evidence` role with `mutatesWorkspace:true` (`fixtures/adversarial/*.json`)

---

## Phase D: Offline validation harness

- [ ] T016 Build the harness: validate every fixture against its schema (multi-mode + N=1 both against the identical `CompiledPolicyV1` schema) (`harness/validate-contracts.cjs`)
- [ ] T017 Assert discriminated-union invariants: adversarial fixtures FAIL to parse (unrepresentable, not lint-caught) (`harness/validate-contracts.cjs`)
- [ ] T018 Assert serialization determinism (two passes ⇒ byte-identical) and hash reproducibility + cross-type domain separation (equal bytes, different tags ⇒ different hashes) (`harness/validate-contracts.cjs`)
- [ ] T019 Assert the degeneracy identity (N=1: no bundle/handoff entries, zero ranking field) and the `AdvisorProjectionV1` omit-list allowlist check — with NO skill-name branch anywhere (`harness/validate-contracts.cjs`)
- [ ] T020 [P] `grep`-verify the harness imports nothing from `router-replay.cjs`, any registry, or any `SKILL.md`; assert zero network calls (`harness/validate-contracts.cjs`)

---

## Phase E: Verify + close the migration gate

- [ ] T021 Run the harness green over the full golden + adversarial set
- [ ] T022 Confirm `TypedRouteGoldV1` fixtures parse into the compatibility `observedIntents`/`observedResources` shape WITHOUT touching `router-replay.cjs`
- [ ] T023 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/019-sk-doc-router-alignment/024-oob-idea-deep-dives/010-unified-refactor-implementation/000-contract-schemas --strict` and resolve to Errors:0
- [ ] T024 Record Stage 0 (Baseline freeze) closure in `checklist.md`/`implementation-summary.md` and confirm Stage 1 (phase `001`) is unblocked (`checklist.md`)

---

## Dependency Notes

- Phase A (T002–T005) is a hard prerequisite for Phase B — schema identity fields are defined in terms of the serialization/hashing rules.
- Phase B tasks T006–T011 are mutually parallelizable once Phase A is frozen.
- Phase C depends on the schemas (Phase B); Phase D depends on schemas + fixtures.
- T024 is the gate-closure task: it must not be marked `[x]` until T021–T023 pass.
