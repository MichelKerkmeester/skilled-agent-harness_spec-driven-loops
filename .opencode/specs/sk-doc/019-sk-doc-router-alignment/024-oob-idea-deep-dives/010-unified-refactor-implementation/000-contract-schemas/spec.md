---
title: "Feature Specification: Contract Schemas — Canonical Versioned Family + Deterministic Serialization & Domain-Separated Hashing"
description: "Phase 0 of the unified router refactor: define the canonical, versioned schema set for the whole contract family (CompiledPolicyV1, CorrectionOverlayV1, RouteRequestV1, RouteDecisionV1, RouteProofV1, UncertaintyBudgetV1, and the three read-only projections AdvisorProjectionV1 / TypedRouteGoldV1 / PolicyCardV1.md), plus one canonical-JSON serialization rule and one domain-separated hashing rule that make policy/overlay/proof identity byte-stable. Resolves synthesis open-question 4. Ships the schema set + serialization/hashing rules + an offline schema-validation harness. No live routing; no scorer, registry, or skill is touched."
trigger_phrases:
  - "router contract schemas phase"
  - "compiled policy schema and canonical json"
  - "domain separated hashing route decision algebra"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Contract Schemas — Canonical Versioned Family + Serialization & Hashing

## EXECUTIVE SUMMARY

This phase defines the *foundation every other phase binds to*: the canonical, versioned schemas for the entire router contract family, plus the two rules — one canonical-JSON serialization and one domain-separated hashing scheme — that turn those schemas into **byte-stable identities**. Nothing here routes. The deliverable is a schema set, a serialization/hashing specification, and an offline schema-validation harness that proves determinism and enforces the algebra's safety invariants at parse time.

The architecture this serves is the council's fused design: *one contract family, not one router* [synthesis §1]. Each of the five planes (policy, decision, execution, recovery, learning) exchanges typed artifacts, and the whole design's safety properties — request-pinned identity, deterministic replay, destination-local authority, reversible fenced activation — all reduce to two things being true at the byte level: (a) identical inputs serialize to identical bytes, and (b) each artifact's hash cannot collide with a different artifact type. This phase makes both true and testable before any compiler, evaluator, or activation selector exists.

It also resolves **synthesis open-question 4** — "Canonical JSON serialization + domain-separation strings for byte-stable policy/proof/overlay hashes" [synthesis §11.4] — which every later phase silently assumes. Resolving it first, with a harness that a downstream phase can re-run, is the cheapest place to buy the "gap between green and reality" insurance the whole migration depends on.

**Key decisions:** (1) a single canonical-JSON rule (Proposed: RFC 8785 JCS profile) applied to every hashed body; (2) a single domain-separated `SHA-256` construction `H(domainTag || 0x00 || canonicalBytes)` with one versioned tag per artifact type; (3) `RouteDecisionV1` modeled as a discriminated union so the dangerous states are *unrepresentable*, not merely validated against [synthesis §2.3, §4 Seam A].

**Critical dependency:** none upstream — this is the first slice. Everything downstream (001 shadow compiler, 002 evaluator, 003 execution, 004 recovery, 005 calibration, 006 rollout, 007 overlay) binds to these schemas and this identity model.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-07-18 |
| **Branch** | `000-contract-schemas` |
| **Parent** | `../spec.md` (Unified Router Refactor — Phased Implementation Plan) |
| **Design source** | `../../009-unified-refactor-research/unified-refactor-synthesis.md` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement

The unified router refactor is *not a router rewrite* — it is a shadow compiler plus additive semantic gates whose entire safety model rests on **content-addressed identity**: a request pins one `effectivePolicyHash`, replay recompiles to byte-identical policy bodies, and rollback swaps to a byte-identical prior manifest [synthesis §1, §9]. None of that is achievable until three things exist and are frozen: the schemas for the contract family, a serialization rule that is deterministic to the byte, and a hashing rule that separates artifact domains. The synthesis explicitly parked the last two as open-question 4 [synthesis §11.4]. Without them, "canonical bytes regenerate" (the Stage 1 gate) has no referent, `basePolicyHash`/`overlayHash`/`effectivePolicyHash` are undefined, and the degeneracy proof's "empty collections serialize identically" claim [synthesis §5.1] cannot be tested.

### Purpose

Freeze one versioned schema family, one canonical-JSON serialization rule, and one domain-separated hashing rule — and prove, with an offline harness, that identical inputs hash identically, that negative decisions cannot carry authority, and that the N=1 (`mcp-code-mode`) shape and the multi-mode shape differ only in cardinality and empty collections.

---

## 3. SCOPE

### In Scope

- **Schema definitions** for the full contract family, each carrying an explicit `schemaVersion` (the `V1` suffix is the wire/identity version):
  - `CompiledPolicyV1` — `destinations[]` (each with a compound `id`, a `role ∈ {actor, evidence, transport, judgment}`, an `authorityRef`, and `mutatesWorkspace`), `detectors[]`, `selectors[]`, `compositionRules[]`, `authorityGraph[]`, the `(T,R,P)` posture (`thresholdPolicy`, `recoveryPolicy`, `provenancePolicy`), and the identity fields `basePolicyHash` / `overlayHash?` / `effectivePolicyHash` [synthesis §2.1, §2.2].
  - `CorrectionOverlayV1` — separately hashed, offline-promoted vocabulary→destination adjustment bound to a specific `basePolicyHash` [synthesis §2.1, §4 Seam D].
  - `RouteRequestV1` — `requestFactsHash`, `explicitMode?`, `observations`, provenance-tagged `evidence[]` with a `trust` state, and `pinnedActivationGeneration` [synthesis §2.1].
  - `RouteDecisionV1` — the closed *nested* four-action algebra `route | clarify | defer | reject` as a discriminated union [synthesis §2.3].
  - `RouteProofV1` — the destination-local proof body for PREPARE→VERIFY→COMMIT (read-set, expiry/epoch, idempotency key, attestation), proof-as-evidence only [synthesis §2.1, §3 Idea 7].
  - `UncertaintyBudgetV1` — the single shared recovery budget (`userTurns: 1`, `handoffHops: 1`, visited-set) [synthesis §2.1, §4 Seam B].
  - The three read-only projections: `AdvisorProjectionV1`, `TypedRouteGoldV1`, `PolicyCardV1.md` [synthesis §2.1, §8].
- **Canonical-JSON serialization rule** (one rule, applied to every hashed body) — resolves open-question 4.
- **Domain-separated hashing rule** (one construction, one versioned tag per artifact type) and the exact definitions of `basePolicyHash`, `overlayHash`, `effectivePolicyHash`, `requestFactsHash`, `proofHash`, and the projection `projectionHash` / `humanViewHash` — resolves open-question 4.
- **Offline schema-validation harness** — validates golden fixtures against the schemas, asserts the algebra invariants as structural (parse-time) constraints, and asserts hash determinism/reproducibility. No network, no live routing, no scorer.

### Out of Scope

- Any live routing, compilation of real authored sources, or activation — begins in phase `001` (only `mcp-code-mode` compiled there).
- Editing, wrapping, or reading the shared benchmark scorer `router-replay.cjs` — hard constraint, an eliminated alternative in all four lineages [synthesis §8.2, §10].
- The evaluator, PREPARE/VERIFY/COMMIT execution, the recovery ladder runtime, calibration, per-hub rollout, and the learning overlay pipeline — later phases bind to these schemas but are not defined here.
- Choosing final threshold constants, calibration tiers, or overlay learnable-field sets — those are open-questions 2, 3, 7 and require corpora that do not yet exist [synthesis §11].
- Modifying any live routing config, registry, or `SKILL.md`. This phase is planning/design only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `000-contract-schemas/spec.md` | Create | This specification |
| `000-contract-schemas/plan.md` | Create | Build approach for the schema set, serialization/hashing rules, and harness |
| `000-contract-schemas/tasks.md` | Create | Ordered, checkable task list |

> Schema artifacts, the serialization/hashing reference, and the harness are *design deliverables described* by these docs; their concrete file layout is proposed in `plan.md`. No live routing surface is touched by this phase.

---

## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define `CompiledPolicyV1` with `destinations[]`, `detectors[]`, `selectors[]`, `compositionRules[]`, `authorityGraph[]`, the `(T,R,P)` posture, and the three identity hashes. Each destination `id` is the compound `(skillId, workflowMode, packetId, packetKind, backendKind, runtimeDiscriminator?)`, not a path or a mode name alone [synthesis §2.2]. Each destination carries `role ∈ {actor, evidence, transport, judgment}`, an `authorityRef`, and `mutatesWorkspace`. | Schema validates a golden multi-mode fixture AND the N=1 `mcp-code-mode`-shaped fixture. Packet-path-only and workflow-mode-only identities are rejected as insufficient. An `evidence` role with `mutatesWorkspace:true` fails validation [synthesis §7]. |
| REQ-002 | Define `RouteDecisionV1` as a *nested discriminated union* keyed on `{route, clarify, defer, reject}`, with `selectionKind ∈ {single, orderedBundle, surfaceBundle}` living *inside* `route` [synthesis §2.3, §4 Seam A]. | Only `route` admits a non-empty `targets`. The negative variants (`clarify`/`defer`/`reject`) have no `targets` field and no capability-bearing authority field — a fixture that places a target or tool inside a negative decision FAILS to parse (unrepresentable, not merely invalid). A flat six-value enum is rejected. |
| REQ-003 | Encode the algebra invariants structurally: negatives carry `authority: Withheld`; `route` carries `authority: WithheldUntilVerify`; `rankScore`/`scoreMargin` are typed as evidence fields, never as an authority or a probability; `basis ∈ {signal, bounded-default, degraded-fallback}` and `degraded-fallback` MUST name the unavailable evidence [synthesis §2.3]. | Harness asserts each invariant against golden and adversarial fixtures. A `route` whose `basis` is `degraded-fallback` without a named missing-evidence reference fails. A `rankScore` used where authority is expected is a type error. |
| REQ-004 | Define `RouteRequestV1` as an immutable snapshot: `requestFactsHash`, `explicitMode?` (kept a separate field because commands take precedence, not extra weight), `observations`, `evidence[]` each with provenance + `trust ∈ {live, stale, absent, unavailable}`, and `pinnedActivationGeneration` [synthesis §2.1, §8.1]. | Schema validates; `requestFactsHash` recomputes deterministically from the pinned facts (REQ-009). `explicitMode` is representable independently of ranking evidence. |
| REQ-005 | Define `CorrectionOverlayV1` (separately hashed, bound to a `basePolicyHash`, encoding vocabulary→destination adjustments and promotion provenance) and `UncertaintyBudgetV1` (`userTurns: 1`, `handoffHops: 1`, visited-set) [synthesis §2.1, §4 Seam B, §4 Seam D]. | Overlay validates and references exactly one base by hash; a `null`/absent overlay is the canonical default. Budget schema forbids separate per-rung budgets (one shared counter). |
| REQ-006 | Define `RouteProofV1` for destination-local PREPARE→VERIFY→COMMIT: read-set, expiry/epoch, `idempotencyKey`, attestation. Proof is evidence and carries no capability; exactly-once is an adapter property, not proof text [synthesis §3 Idea 7, §2.1]. | Schema validates a proof fixture and a *stale* proof fixture (expired epoch). The proof body contains no field that grants a destination the right to COMMIT — authority stays in the destination's VERIFY→COMMIT, not in the proof. |
| REQ-007 | Define the three read-only projections. `AdvisorProjectionV1` carries hub id, aliases, eligible modes (`qualifiedId`/`publicMode`/`routingClass`), admission labels, `effectivePolicyHash`, `projectionHash`, and OMITS paths, tools, mutation scope, fences, handoff leases, and commit authority [synthesis §8.1]. `TypedRouteGoldV1` carries typed fixtures plus the fields the compatibility projector maps into the existing `observedIntents`/`observedResources` shape [synthesis §8.2]. `PolicyCardV1.md` is a generated Markdown card carrying a `humanViewHash` derived from the same compiled snapshot [synthesis §8.3]. | Each projection validates. `AdvisorProjectionV1` provably omits every excluded field (harness allowlist check). `TypedRouteGoldV1` fixtures parse into the compatibility shape without touching the scorer. `PolicyCardV1.md` front-matter binds `effectivePolicyHash` + `humanViewHash`. |
| REQ-008 | Specify the **canonical-JSON serialization rule** applied to every hashed body: UTF-8/no-BOM, lexicographically sorted object keys, no insignificant whitespace, no floating-point in hashed fields (integers or decimal strings only), collections always present (empty `[]`), optional *scalars* omitted when absent (`overlayHash?` omitted ≡ null-overlay). Proposed profile: RFC 8785 (JCS) [resolves synthesis §11.4]. | Two independent serializer passes over the same logical artifact produce byte-identical output. The N=1 fixture serializes with `compositionRules: []`, `authorityGraph: []`, and `overlayHash` omitted — byte-identical whether the overlay is expressed as absent or as null [synthesis §5.1]. |
| REQ-009 | Specify the **domain-separated hashing rule**: `H(domainTag || 0x00 || canonicalBytes)` with `SHA-256` and one versioned ASCII tag per artifact type (e.g. `speckit.router.CompiledPolicyV1`). Define `basePolicyHash` (over the base body with the three digest fields excluded), `overlayHash`, `effectivePolicyHash = H(domain, {basePolicyHash, overlayHash?, schemaVersion, activationGeneration})` [synthesis §2, §4 Seam D], `requestFactsHash`, `proofHash`, and the projection hashes. | Distinct artifact types with byte-identical canonical bodies produce distinct hashes (domain separation holds). `effectivePolicyHash` changes iff base, overlay, schema, or generation changes — and is stable otherwise. Recomputation across two runs is bit-identical. |
| REQ-010 | Deliver an **offline schema-validation harness** that validates golden fixtures, asserts the REQ-002/003 algebra invariants as parse-time constraints, asserts serialization determinism (REQ-008) and hash reproducibility + domain separation (REQ-009), and asserts the degeneracy identity (REQ-011). Runs with zero network and zero live-routing dependency. | Harness exits non-zero on any invariant/determinism violation. It imports nothing from the scorer, registry, or any `SKILL.md`. CI-runnable and re-runnable by phase `001`. |
| REQ-011 | Encode the singular-skill degeneracy at the schema level: the N=1 shape is the SAME schema with empty collections and omitted optional scalars, NOT a distinct schema or a name branch [synthesis §5, §5.1, §5.3]. | A `mcp-code-mode`-shaped fixture validates against the identical `CompiledPolicyV1` schema; ranking/bundle/handoff *fields* are absent (empty collections), and the harness asserts the fixture contains no `orderedBundle`/`surfaceBundle` target and no `handoffEdges` entry. No `if skillId == 'mcp-code-mode'` branch exists anywhere in the harness. |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-012 | Document the schema-evolution/versioning rule: any change to a hashed field or to the canonicalization rules is a breaking version bump (`V1`→`V2`) because it changes byte-identity; `schemaVersion` participates in `effectivePolicyHash` [synthesis §2, §4 Seam C]. | The rule is written in the serialization/hashing reference with a worked example of a field addition minting a new version. |
| REQ-013 | Provide a minimum golden-fixture set spanning the families the benchmark will later need [synthesis §8.2]: exact single route; ordered + surface bundles; zero-signal `defer(no-match)` with no default union; one-turn clarify; forbidden `reject`; stale/absent advisor; stale proof; overlay replay; the singular-omission + zero-rank-call assertion; duplicate idempotency-key receipt. | Every fixture parses; each maps 1:1 to a synthesis §8.2 fixture family; the zero-signal fixture contains no fallback/default union (no over-emission). |

---

## 5. SUCCESS CRITERIA

- **SC-001**: Every artifact in the contract family has a frozen `V1` schema that validates both a multi-mode golden fixture and the N=1 `mcp-code-mode`-shaped fixture, with no schema branch on skill name [REQ-001, REQ-011; synthesis §5].
- **SC-002**: `RouteDecisionV1` makes the dangerous states *unrepresentable* — a negative decision carrying a target or authority fails to parse, not merely fails a lint [REQ-002, REQ-003; synthesis §2.3, §4 Seam A].
- **SC-003**: Open-question 4 is resolved: one canonical-JSON rule and one domain-separated hashing rule are specified precisely enough that two independent implementations produce bit-identical hashes for the golden set [REQ-008, REQ-009; synthesis §11.4].
- **SC-004**: Identity holds: `effectivePolicyHash` binds exactly `{base, overlay|null, schema, generation}` and is stable under re-serialization; artifact-type domain separation prevents cross-type hash collision [REQ-009; synthesis §2, §4 Seam D].
- **SC-005**: The offline harness passes on the golden set, asserts all algebra + determinism + degeneracy invariants, and imports nothing from the scorer/registry/skills [REQ-010, REQ-013].
- **SC-006**: The no-over-emission property is structural: the zero-signal path is `defer(no-match)` with a target-free body and no default union anywhere in the fixtures [REQ-013; synthesis §10].

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism (the load-bearing NFR)
- **NFR-D01**: Serialization is a pure function of the logical artifact — no timestamps, no map-iteration-order leakage, no locale, no float rounding in any hashed field. Same input ⇒ same bytes, on any machine.
- **NFR-D02**: Hashing is reproducible across runs and across independent implementations; the domain-tag registry is closed and versioned.

### Safety (schema-enforced, not convention)
- **NFR-S01**: Authority-locality is a shape property: negatives structurally withhold authority; `route` withholds until VERIFY; proof carries no capability [synthesis §2.3, §3 Idea 7, §10].
- **NFR-S02**: No-over-emission is a shape property: zero-signal is a typed `defer`, never a full-registry union [synthesis §10].

### Portability / Standalone
- **NFR-P01**: The schemas and the hashing rule are expressible in a document-only context so a later `PolicyCardV1.md` can be generated from the same compiled snapshot (a matching `humanViewHash` alone is explicitly insufficient) [synthesis §8.3].

---

## L2: EDGE CASES

### Data boundaries
- **Empty collections**: `compositionRules`, `authorityGraph`, `detectors` selectors etc. serialize as present-but-empty `[]`; they are the N=1 default and must be byte-stable [synthesis §5.1].
- **Absent optional scalar**: `overlayHash?` absent ≡ null-overlay; MUST be *omitted* (not serialized as `null`) so the degenerate and explicit-null forms coincide byte-for-byte [REQ-008].
- **Compound-identity collisions**: two lanes sharing a packet but differing in `backendKind`/`runtimeDiscriminator` are distinct destinations; `system-deep-loop` is the canonical case [synthesis §2.2, §7].

### Error scenarios
- **Malformed fixture**: harness fails loudly (never silently "repairs") — mirrors the existing route-gold loud-fail-on-malformed posture the benchmark relies on [synthesis §8.2].
- **Digest self-reference**: the three `*Hash` fields are excluded from the body when computing `basePolicyHash`; a fixture that folds a stale hash into its own body is rejected.
- **Cross-type collision attempt**: a fixture whose `CorrectionOverlayV1` bytes equal some `CompiledPolicyV1` bytes still hashes differently (domain tag) — harness asserts this explicitly.

### State transitions
- **Version bump**: a hashed-field change mints `V2`; `V1` fixtures continue to validate against `V1` (schemas are additive, not mutated in place) [REQ-012].

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | ~9 schemas + 1 serialization rule + 1 hashing rule + harness; no runtime |
| Risk | 14/25 | Foundational (every phase binds here), but zero live-routing blast radius; reversible by definition |
| Research | 12/20 | Resolves open-q 4; canonicalization/hashing profiles are Proposed and need validation |
| **Total** | **42/70** | **Level 2** |

---

## MIGRATION GATE

This phase satisfies **Stage 0 — Baseline freeze** of the shared migration-gate model in the master plan (`../spec.md` → "SHARED MIGRATION-GATE MODEL"), whose gate is *"full legacy baseline recorded"* and which the master plan assigns to phases `000/001` jointly [master plan §"SHARED MIGRATION-GATE MODEL"; synthesis §9 Stage 0]. This phase's contribution to Stage 0 is the freeze itself: the versioned schema family, the canonical-JSON rule, and the domain-separated hashing rule must be locked and proven byte-stable so that a legacy baseline — and, later, regenerated canonical bytes — are *recordable and reproducible*.

**Gate this phase must satisfy before the next phase activates:** the schema set is frozen (`V1` locked), the offline harness passes on the golden set (determinism + domain separation + algebra invariants + degeneracy), and `TypedRouteGoldV1` fixtures parse into the compatibility shape **without touching `router-replay.cjs`**.

**Gate this phase unblocks:** **Stage 1 — Shadow compile** (owned by phase `001`), whose gate is *"canonical bytes regenerate; typed fixtures parse; route-gold stays green"* [master plan §"SHARED MIGRATION-GATE MODEL"; synthesis §9 Stage 1]. That gate is meaningless until the schemas and serialization/hashing rules are frozen here — "canonical bytes" has no referent otherwise. Phase `001` does not activate until this gate closes.

**Non-negotiable constraints inherited by every phase (recorded here because this phase makes them structural):**
- **Deterministic offline route-gold replay preserved** — via byte-identical serialization (REQ-008) + the `TypedRouteGoldV1` compatibility projector contract (REQ-007); replay never calls a live advisor [synthesis §10].
- **NEVER touch the shared benchmark scorer (`router-replay.cjs`)** — the harness and projections import nothing from it; a required scorer edit is a *migration failure*, not a license [synthesis §8.2, §10].
- **Authority stays destination-local** — a proof/recommendation is never a capability; negatives withhold authority; `route` withholds until VERIFY (REQ-003, REQ-006) [synthesis §2.3, §10].
- **Reversible + gated** — schema versioning + `effectivePolicyHash` identity are the primitives that make fenced CAS activation and retained-prior-generation rollback possible; a prior generation's bytes are exactly recoverable because serialization is deterministic (REQ-009, REQ-012) [synthesis §9].
- **No over-emission** — zero-signal is a typed target-free `defer`; the schemas provide no fallback/default-union field (REQ-013, SC-006) [synthesis §10].

---

## OPEN QUESTIONS

- **OQ-1 (resolves synthesis §11.4 here):** canonical-JSON profile is Proposed as RFC 8785 (JCS) and the hash as `SHA-256` with `H(domainTag || 0x00 || canonicalBytes)`. These are the design decisions this phase is chartered to make; they still require a cross-implementation reproduction test before Stage 1 relies on them [synthesis §11.4, §13 "Medium" confidence on schema field boundaries].
- **OQ-2:** Whether `runtimeDiscriminator` must be a first-class identity field for hubs beyond `system-deep-loop`, or an optional extension — deferred to the per-hub archetype work in phase `006` [synthesis §2.2, §7].
- **OQ-3:** Which `CorrectionOverlayV1` fields are learnable is out of scope here (open-q 3); this phase only fixes the overlay's *shape* and its binding-by-`basePolicyHash` [synthesis §11.3].
- **OQ-4:** Idempotency-ledger location/retention (open-q 5) is not decided here; `RouteProofV1` only carries the `idempotencyKey` field, not the ledger model [synthesis §11.5].

---

## RELATED DOCUMENTS

- **Build approach**: See `plan.md`
- **Task breakdown**: See `tasks.md`
- **Phase parent**: `../spec.md`
- **Design source**: `../../009-unified-refactor-research/unified-refactor-synthesis.md` (§2, §2.1, §2.3, §5, §8, §9, §10, §11.4)
