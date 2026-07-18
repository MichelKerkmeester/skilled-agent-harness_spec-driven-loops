---
title: "Implementation Plan: Contract Schemas — Canonical Family, Serialization & Hashing"
description: "Build approach for phase 0 of the unified router refactor: the sequence to define the versioned schema family, the single canonical-JSON serialization rule, the single domain-separated hashing rule, and the offline schema-validation harness that proves determinism, algebra safety, and N=1 degeneracy. No live routing; the shared scorer is never touched."
trigger_phrases:
  - "contract schemas build plan"
  - "canonical json hashing plan"
  - "schema validation harness plan"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Contract Schemas

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Deliverable** | Schema set (JSON Schema) + serialization/hashing reference + offline validation harness |
| **Language/Stack** | Node.js (matches the repo's existing `.cjs` tooling and `sha256:` fingerprint convention) |
| **Serialization** | Canonical JSON — Proposed profile RFC 8785 (JCS) |
| **Hashing** | `SHA-256`, domain-separated: `H(domainTag || 0x00 || canonicalBytes)` |
| **Testing** | The harness itself (fixture validation + determinism + invariant assertions); offline, no network |
| **Blast radius** | None on live routing — no scorer, registry, or `SKILL.md` is read or written |

### Overview

Build the foundation the whole refactor binds to, in a strict dependency order: (1) fix the serialization rule so "canonical bytes" has a precise meaning; (2) fix the domain-separated hashing rule so identity is defined; (3) author the schema family against those two rules; (4) author golden fixtures — including the N=1 `mcp-code-mode` shape; (5) build the harness that proves determinism, algebra safety, and degeneracy. The serialization and hashing rules come *first* because every schema's identity fields (`basePolicyHash`, `effectivePolicyHash`, `requestFactsHash`, `proofHash`) are defined in terms of them [synthesis §2, §11.4]. This is planning/design work materialized as schema + spec + harness; it runs entirely offline and mutates no live routing surface.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Design source read: synthesis §2, §2.1, §2.3, §5, §8, §9, §10, §11.4.
- [x] Master-plan phase map + shared migration-gate model read (Stage 0 / Stage 1 ownership confirmed).
- [x] Template/marker shape confirmed against a sibling spec.

### Definition of Done
- [x] Every schema validates its golden fixture AND the N=1 fixture (no skill-name branch).
- [x] Harness passes: determinism, domain separation, algebra invariants, degeneracy, no-over-emission.
- [x] Serialization/hashing reference includes an exact reproduction vector and closed tag registry.
- [x] Nothing imports from `router-replay.cjs`, the registry, or any `SKILL.md`.
- [x] Strict spec validation is explicitly delegated to the orchestrator; the operator prohibited running it in this worktree.

---

## 3. BUILD APPROACH (ordered)

### Step 1 — Fix the canonical-JSON serialization rule (resolves open-q 4, part A)

Author a serialization reference specifying, exactly: UTF-8 / no BOM; object keys sorted lexicographically (Proposed: by UTF-16 code unit per RFC 8785 JCS, so an off-the-shelf JCS library is usable); no insignificant whitespace; **no floating point in any hashed field** — thresholds and weights are integers or decimal strings, never IEEE-754 (the GLM "inert weight `4`" is an integer) [synthesis §12, §11.3]; collections always present as `[]`; optional *scalars* omitted when absent so `overlayHash?` absent ≡ null-overlay byte-for-byte [synthesis §5.1]. State the choice as **Proposed** (open-q 4) and record the one reproduction test that would confirm it (two independent serializers, byte-identical output).

- **Key contract**: "identical inputs compile to byte-identical policy bodies" [synthesis §10].
- **Touches**: `serialization-hashing.md` reference; no schema yet.

### Step 2 — Fix the domain-separated hashing rule (resolves open-q 4, part B)

Define `H(x) = SHA-256(domainTag || 0x00 || canonicalBytes(x))` with a **closed, versioned domain-tag registry** — one ASCII tag per artifact type (`speckit.router.CompiledPolicyV1`, `…CorrectionOverlayV1`, `…RouteRequestV1`, `…RouteProofV1`, `…AdvisorProjectionV1`, `…PolicyCardV1`). Then define each identity field precisely:
- `basePolicyHash` = `H(base body with the three `*Hash` fields excluded)` — resolves the digest self-reference.
- `overlayHash` = `H(CorrectionOverlayV1 body)`.
- `effectivePolicyHash` = `H({basePolicyHash, overlayHash?, schemaVersion, activationGeneration})` — exactly the synthesis identity `hash(base, overlay|null, schema, generation)` [synthesis §2, §4 Seam D].
- `requestFactsHash`, `proofHash`, projection `projectionHash` / `humanViewHash` — each domain-tagged.

- **Key contract**: EffectivePolicy identity + request pinning + byte-exact rollback all reduce to this rule [synthesis §2, §9].
- **Touches**: the same `serialization-hashing.md` reference; the domain-tag registry file.

### Step 3 — Author the schema family (`V1`) against Steps 1–2

Author JSON Schemas for `CompiledPolicyV1`, `CorrectionOverlayV1`, `RouteRequestV1`, `RouteDecisionV1`, `RouteProofV1`, `UncertaintyBudgetV1`, and the three projections. Load-bearing modeling decisions:

- **`CompiledPolicyV1`**: destination `id` is the compound `(skillId, workflowMode, packetId, packetKind, backendKind, runtimeDiscriminator?)`; `role ∈ {actor, evidence, transport, judgment}`; `authorityRef`; `mutatesWorkspace` (an `evidence` role with `mutatesWorkspace:true` is invalid) [synthesis §2.2, §7]. `(T,R,P)` posture as three sub-objects. Identity hashes as defined in Step 2.
- **`RouteDecisionV1`**: a **discriminated union** on the action tag. `route` is the only branch with `targets` (NonEmpty) and with `selectionKind` (inside `route`). `clarify`/`defer`/`reject` have **no** `targets` and **no** capability-bearing authority field — the dangerous states are unrepresentable at the schema level, not caught by a later lint [synthesis §2.3, §4 Seam A]. `rankScore`/`scoreMargin` typed as evidence; `basis` enum with the `degraded-fallback`-names-missing-evidence constraint.
- **`RouteRequestV1`**: `explicitMode?` a separate optional field (precedence, not weight); `evidence[]` items carry `trust ∈ {live, stale, absent, unavailable}` [synthesis §8.1]; `pinnedActivationGeneration`.
- **`RouteProofV1`**: read-set, expiry/epoch, `idempotencyKey`, attestation — no field that itself confers COMMIT rights [synthesis §3 Idea 7].
- **`UncertaintyBudgetV1`**: single shared `userTurns:1` + `handoffHops:1` + visited-set; no per-rung budgets [synthesis §4 Seam B].
- **Projections**: `AdvisorProjectionV1` with an explicit **omit-list** (paths, tools, mutation scope, fences, handoff leases, commit authority) enforced by the harness allowlist [synthesis §8.1]; `TypedRouteGoldV1` carrying the fields the compatibility projector maps into `observedIntents`/`observedResources` [synthesis §8.2]; `PolicyCardV1.md` front-matter binding `effectivePolicyHash` + `humanViewHash` [synthesis §8.3].

- **Touches**: `schemas/*.schema.json` (proposed layout).

### Step 4 — Author golden fixtures (incl. the N=1 shape)

Author one fixture per synthesis §8.2 family (see tasks T-11), plus the two anchor shapes: a multi-mode `CompiledPolicyV1` and the N=1 `mcp-code-mode`-shaped `CompiledPolicyV1` with `compositionRules: []`, `authorityGraph: []`, `overlayHash` omitted, `T=exact-admission`, `R=clarify→defer/reject`, `P=static` [synthesis §5.1]. The zero-signal fixture must be `defer(no-match)` with a target-free body and **no** default/registry union [synthesis §10].

- **Touches**: `fixtures/*.json`.

### Step 5 — Build the offline validation harness

A Node harness that: validates every fixture against its schema; asserts the discriminated-union invariants (a target inside a negative decision must fail to parse); serializes each fixture twice and asserts byte-identity; computes hashes and asserts reproducibility + cross-type domain separation (equal bytes, different tags ⇒ different hashes); asserts the degeneracy identity (N=1 fixture has no bundle/handoff entries and triggers no ranking field); and asserts `AdvisorProjectionV1` omits every excluded field. The harness imports **nothing** from the scorer, registry, or skills, and makes no network calls.

- **Touches**: `harness/validate-contracts.cjs` (proposed).

### Step 6 — Verify + record the migration gate closure

Run the harness green; hand strict spec validation to the orchestrator as required by the operator constraint; confirm the Stage 0 freeze conditions and that `TypedRouteGoldV1` fixtures parse into the compatibility shape without touching `router-replay.cjs`. Record that Stage 1 (phase `001`) is technically unblocked, with strict packet validation remaining an external administrative gate.

---

## 4. KEY FILES & CONTRACTS TOUCHED

| Artifact (proposed) | Role | Binds to |
|---------------------|------|----------|
| `serialization-hashing.md` | The canonical-JSON + domain-separated hashing reference (resolves open-q 4) | synthesis §2, §4 Seam D, §11.4 |
| `schemas/*.schema.json` | The `V1` contract family | synthesis §2.1, §2.2, §2.3, §8 |
| `fixtures/*.json` | Golden + N=1 + §8.2 fixture families | synthesis §5.1, §8.2, §10 |
| `harness/validate-contracts.cjs` | Offline determinism + invariant + degeneracy harness | synthesis §5, §8, §10 |

**Explicitly NOT touched:** `router-replay.cjs`, any mode registry, any hub `SKILL.md`, any live activation manifest. This phase is design-only [synthesis §8.2, §10].

---

## 5. VERIFICATION

| What | How |
|------|-----|
| Schema conformance | Every fixture validates against its schema; multi-mode + N=1 both validate against the identical `CompiledPolicyV1` schema |
| Algebra safety | Adversarial fixtures (target-in-`defer`, authority-in-`reject`) FAIL to parse |
| Determinism | Two serializer passes ⇒ byte-identical; two hash runs ⇒ bit-identical |
| Domain separation | Byte-identical bodies under different tags ⇒ different hashes |
| Degeneracy | N=1 fixture: empty `compositionRules`/`authorityGraph`, omitted `overlayHash`, zero ranking/bundle fields; no skill-name branch in harness |
| No over-emission | Zero-signal fixture is target-free `defer(no-match)`; no default union present |
| Scope hygiene | `grep`-verify the harness imports nothing from scorer/registry/skills |
| Spec discipline | Orchestrator runs `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict`; local execution prohibited by operator |

---

## 6. RISKS & ROLLBACK

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Canonicalization profile (JCS) proves insufficient for some field type | Medium — would re-open open-q 4 | Marked Proposed; reproduction test gates Stage 1; profile change is a versioned bump, not a silent edit [synthesis §11.4, §13] |
| Risk | A schema field boundary is wrong (synthesis §13 "Medium" confidence) | Medium | `V1` is additive; a correction mints `V2` and does not mutate `V1` in place (REQ-012) |
| Dependency | None upstream | — | This is the first slice; nothing blocks it |
| Rollback | This phase writes only docs/schemas/harness under its own folder | Trivial | Delete the folder's artifacts; no live surface changed, so rollback is byte-clean by construction |

---

## RELATED DOCUMENTS
- **Specification**: `spec.md`
- **Tasks**: `tasks.md`
- **Design source**: `../../006-unified-refactor-research/unified-refactor-synthesis.md`
- **Phase parent**: `../spec.md`
