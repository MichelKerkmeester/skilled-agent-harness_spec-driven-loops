---
title: "Unified Router Refactor — Council Synthesis of the Eight Ideas"
description: "The single fused router architecture: one content-addressed compiled policy, one closed decision algebra, one shared recovery budget, destination-local proof/verify/commit, and an offline correction overlay — with the singular-skill (mcp-code-mode) degeneracy proof, the overlap-resolution table, a phased reversible migration, the advisor/benchmark/standalone-docs read, constraint compliance, and open questions."
contextType: "synthesis"
importance_tier: "critical"
---

# Unified Router Refactor — Council Synthesis

> Capstone synthesis of the 20-iteration, four-lineage research program (2× GPT-5.6-SOL xhigh, 1× Terra xhigh, 1× Luna max). A fresh Opus 4.8 council fused the eight ideas into one architecture, resolved every named seam, and proved the singular-skill degeneracy. This document is the single fused design end to end. It is planning only: no live router, registry, scorer, or skill was modified.

Evidence labels used below (inherited from the lineages):
- **Confirmed** — the behaviour exists in inspected repository artifacts.
- **Derived** — the conclusion follows from combining confirmed contracts.
- **Proposed** — an implementation detail still requiring build and validation.

---

## 1. Executive verdict

Fuse the eight ideas into **one contract family, not one router**. The decisive move — reached independently by all four lineages — is to assign each idea to a distinct *authority boundary* and let a single closed decision algebra sit at the centre. Nothing is layered as a competing router; each idea owns exactly one plane.

The architecture is a **compiled, immutable, content-addressed policy** evaluated by a **pure local evaluator** that emits **one closed decision algebra** (`route | clarify | defer | reject`), with a **single bounded recovery budget**, **destination-local PREPARE/VERIFY/COMMIT**, and an **offline correction overlay** that never serves online. `(T,R,P)` is the *coordinate system* the policy sits in — a compile-time posture, never a second decision shape.

The same contract serves both a multi-mode parent hub and a singular mode-less skill. `mcp-code-mode` is the **degenerate N=1 case of the same contract** — ranking, bundles, handoff, and mode-choice structures **constant-fold to empty**, while admission, typed negatives, destination identity, leaf routing, and VERIFY remain. There is **no `SingularRouter`, no `if skillId == mcp-code-mode` branch, and no special-casing** anywhere. The base contract is complete and correct with `overlay = null` and `P = static` — and that configuration *is* the N=1 case. This inversion — the degenerate case is the default, multi-mode composition and learning are additive corners — is what makes the design graceful rather than over-built.

The refactor is **not a router rewrite**. It is a shadow compiler plus additive semantic gates, activated one hub at a time by a fenced activation-manifest selector, in the order `mcp-code-mode → sk-code → system-deep-loop → mcp-tooling`. The shared advisor scorer and the existing route-gold outputs are never touched.

---

## 2. The one architecture — five planes, one contract family

Each idea owns one plane; no plane may silently acquire another plane's authority.

```text
AUTHORED SOURCES
  mode registries + hub routers + leaf manifests + packet authority + detector sources
        |
        v
POLICY PLANE                                            ── Ideas 1, 2, 8
  pure compiler -> CompiledPolicyV1 (immutable, content-addressed)
      + optional CorrectionOverlayV1 (immutable, offline-promoted)
      -> EffectivePolicy identity = hash(base, overlay|null, schema, generation)
      -> read-only projections (advisor / route-gold / policy card)
      -> fenced ActivationManifestV1 selector (one generation per request)
        |
        v
DECISION PLANE                                          ── Ideas 3, 6
  evidence adapters -> RouteRequestV1 (facts pinned to one policy tuple)
  pure evaluator    -> RouteDecisionV1
        | route (single|orderedBundle|surfaceBundle)     | clarify | defer | reject
        v                                                 v
EXECUTION PLANE            ── Idea 7                     RECOVERY PLANE   ── Ideas 4, 5
  destination PREPARE -> VERIFY -> COMMIT -> receipt      one shared UncertaintyBudget
  (proof is evidence, authority is destination-local)     clarify -> handoff -> defer/reject
        ^                                                 |
        |_________________________________________________|
        v
LEARNING PLANE (offline only)                          ── Idea 2 (+ GLM closed-loop)
  sanitized handoff/correction records
  -> candidate overlay (learns vocab->destination, not weights)
  -> deterministic replay + safety/parity gates + human promotion
  -> activation pointer CAS (never edits a serving policy)
```

### 2.1 The contract family (canonical names)

- **`CompiledPolicyV1`** — immutable content-addressed graph: `destinations[]` (id + role + authority ref), `detectors[]`, `selectors[]`, `compositionRules[]`, `authorityGraph[]`, and the `(T,R,P)` posture (`thresholdPolicy`, `recoveryPolicy`, `provenancePolicy`), plus `basePolicyHash`, `overlayHash?`, `effectivePolicyHash`. **(Idea 1 + Idea 8 live here.)**
- **`CorrectionOverlayV1`** — separately hashed, offline-promoted adjustment to the vocabulary→destination assignment. Serving policy never mutates online; "learning" flips *which* overlay is active. **(Idea 2 lives here.)**
- **`RouteRequestV1`** — an immutable snapshot: `requestFactsHash`, `explicitMode?` (kept separate because commands take precedence, not extra weight), `observations`, provenance-tagged `evidence[]` with trust state, and a `pinnedActivationGeneration`.
- **`RouteDecisionV1`** — the closed four-action algebra. **(Ideas 3 + 6 fuse here.)**
- **`RouteProofV1`** + PREPARE/VERIFY/COMMIT — destination-local proof and effect fence. **(Idea 7 lives here.)**
- **`UncertaintyBudgetV1`** — one budget shared by clarify and handoff. **(Ideas 4 + 5 fuse here.)**
- **`AdvisorProjectionV1`, `TypedRouteGoldV1`, `PolicyCardV1.md`** — three read-only projections of the same compiled snapshot, one per external consumer (advisor / benchmark / document).

### 2.2 Destination identity (Derived, load-bearing)

Neither `workflowMode` name nor packet path is a sufficient identity. `system-deep-loop` maps several public modes onto one packet with different backend/runtime discriminators [Confirmed: `.opencode/skills/system-deep-loop/SKILL.md:46-49`, `mode-registry.json:104,130`]. A destination therefore needs at least `(skillId, workflowMode, packetId, packetKind, backendKind)` plus any policy-declared runtime discriminator, and a `role ∈ {actor, evidence, transport, judgment}`. This single fact kills "packet path = capability" and "workflow mode = global identity" as universal models.

### 2.3 The closed decision algebra

```text
RouteDecisionV1 =
  | route   { selectionKind: single | orderedBundle | surfaceBundle,
              targets: NonEmpty<Target>,
              basis: signal | bounded-default | degraded-fallback,
              evidence, authority: WithheldUntilVerify }
  | clarify { question, budget, alternatives, authority: Withheld }
  | defer   { reason: idle | no-match | dependency-failure
                     | handoff-required | stale-policy | evidence-unavailable,
              recovery, authority: Withheld }
  | reject  { reason, authority: Withheld }
```

Invariants (all four lineages converged on these):
- Only `route` has non-empty `targets`; `clarify | defer | reject` are structurally target-free.
- Every non-`route` branch structurally **withholds authority** — a negative decision can never smuggle a destination through a fallback-resource field.
- `selectionKind` is a *field inside* `route`, never a top-level action. The flat six-value enum (`single|orderedBundle|surfaceBundle|clarify|defer|reject`) from Idea 6's sketch is **rejected** — it mixes positive composition with control flow and weakens branch-owned authority.
- `rankScore`/`scoreMargin` are evidence, never authority, and never a calibrated probability without a validation certificate.
- `basis: degraded-fallback` must name the unavailable evidence, is read-only/non-mutating, is visible before it runs, and is never cached — it cannot masquerade as calibrated certainty.

---

## 3. Where each of the eight ideas lives

| Idea | Sole plane / ownership | Required correction or boundary |
|---|---|---|
| **1. Compiled policy collapse** | Policy plane: the immutable content-addressed graph + activation selector | Semantic collapse only — local destination authority and the thin resolver stay |
| **2. Replayable correction overlay** | Learning plane: offline candidate → gated promotion → pointer CAS | Never mutate serving policy online; learns the vocab→destination table, not weights |
| **3. Typed no-destination** | Decision plane: the negative vocabulary + the "negatives carry no target/authority" invariant | Contributes the *invariant*, not a second enum |
| **4. No-wrong-door handoff** | Recovery plane: one bounded transfer rung (H=1) | Acceptance transfers ownership, not completion; only from `defer(handoff-required)` naming a viable candidate |
| **5. Calibrated negotiation** | Recovery + evidence: tiers, the one-turn `clarify` rung, the risk budget | Rank is not probability; auto-route needs a certificate tied to the policy/risk slice |
| **6. Minimal typed contract** | Decision plane: the fixed public request/decision shape + positive selection kinds | Keep selection kinds *inside* `route` |
| **7. Proof-carrying commit** | Execution plane: PREPARE/VERIFY/COMMIT + receipts | Proof is evidence; exactly-once is an adapter property, not proof text |
| **8. `(T,R,P)`** | Policy posture: evaluator profile coordinates inside `CompiledPolicyV1` | Not the whole policy; it is the coordinate system, not the decision shape |

Idea 8 required the strongest revision: `(T,R,P)` usefully separates threshold, recovery, and provenance, but on its own it omits the destination graph, roles, selectors, composition, authority references, and lifecycle identity — and its source is explicitly a single-model, unvalidated GLM inference. It is adopted as **subordinate policy posture**, not as the policy.

---

## 4. The four seams and how each closes

The task named four overlaps that must not be left open. Each closes into a single mechanism.

| Seam | The two ideas | The single fused mechanism | Why this and not the alternative |
|---|---|---|---|
| **A — two ways to type outcomes** | 3 (typed no-destination) vs 6 (minimal typed contract) | **One nested algebra.** Top level = 4 actions `{route, clarify, defer, reject}`. Idea 6 supplies the positive `selectionKind` shapes *inside* `route`; Idea 3 supplies the invariant that negatives are target-free and authority-free. | A flat six-value enum mixes composition with control flow and lets a "route" whose reason is `no-match` be representable. The nested form makes the dangerous states unrepresentable. |
| **B — two ways to handle uncertainty** | 4 (handoff) vs 5 (calibrated clarify) | **One ordered ladder + one budget.** `clarify` and `handoff` are two rungs of the same ladder, both drawing from one `UncertaintyBudgetV1 { userTurns: 1 }`. A handed-off destination returning `NEEDS_INPUT` does **not** reopen a user turn. | Independent clarification and handoff budgets permit duplicate user turns and recovery loops. One budget makes recovery provably finite. |
| **C — knobs vs decision shape** | 8 `(T,R,P)` vs 6's decision contract | **Knobs parameterize; shape is fixed.** `T`/`R`/`P` are compile-time coordinates in `CompiledPolicyV1`; a coordinate change mints a new policy generation. The public `RouteDecisionV1` shape is identical at every coordinate. `defaultMode` decomposes into `basis: bounded-default` (a guarded route branch), i.e. the `(T low, R none, P static)` corner. | `(T,R,P)` as the whole policy omits destinations, roles, composition, and lifecycle identity. Repeating mutable knobs inside the decision would create a second control plane. |
| **D — overlay vs compiled base** | 2 (overlay) vs 1 (compiled base) | **Base + overlay = one pinned identity.** The base is Idea 1's compiled policy; the overlay is a second immutable artifact; the *effective* identity is `hash(base, overlay|null, schema, generation)`, pinned once per request. Learning changes which overlay is active (pointer CAS), never a live edit. | A mutable online overlay breaks deterministic replay and request-pinned identity — the whole route-gold safety net. |

### The recovery ladder (Seam B, expanded)

1. Eligibility + authority gate (before ranking).
2. Deterministic exact route, **or** calibrated auto-route only with a validated risk certificate for this policy/risk slice.
3. One typed `clarify` **iff** one answer can discriminate to a legal local route (≤3 options + `none_of_these`, one accepted-answer rescore).
4. One bounded `handoff` **iff** a distinct viable candidate is already named and policy permits it (visited-set guarded, one hop, `H=1`).
5. Typed `defer` for recoverable missing evidence/dependency.
6. `reject` for invalid/forbidden requests.

Rungs 3 and 4 share the single budget; confident routes never touch the ladder at all.

---

## 5. The singular-skill degeneracy proof (the load-bearing test)

`mcp-code-mode` has one standalone workflow mode, explicitly **no `mode-registry.json`**, a manifest with one packet, seven canonical leaf resources, six selector classes, a near-tie path, and a zero-signal fallback [Confirmed: `.opencode/skills/mcp-code-mode/SKILL.md:69-71,154,180`, `leaf-manifest.json:2-15`]. It compiles into the **same** `CompiledPolicyV1`.

### 5.1 What constant-folds away (by partial evaluation, not special-casing)

```text
destinations   = [ skill:mcp-code-mode ]     candidateCount = 1
selectionKinds = { single }                  (orderedBundle/surfaceBundle structurally unreachable: no 2nd target)
crossTargetEdges = []                         bundleRules = []      handoffEdges = []

T = exact admission predicates               (no rank/calibration threshold — nothing to calibrate against one candidate)
R = clarify -> defer/reject                  (no handoff rung — nowhere to hand off)
P = authored policy + leaf-manifest hashes    (no overlay by default — nothing to learn with one destination)
```

Constant-folded or canonically omitted: candidate ranking, margins, tie-breaking, bundle planning, cross-destination handoff, mode selection, calibration certificates, and empty overlay patches. These vanish because the evaluator walks **empty collections** — which is free — not because a branch checks the skill name.

### 5.2 What is retained (why it is the SAME contract, not a stub)

- **Positive AND negative admission.** The single target does **not** become an unconditional route. Zero leaf signal ⇒ `defer(no-match)`. "Default-to-self singular route" is an eliminated alternative — it would swallow real exclusions and forbidden requests.
- **Leaf-level routing inside the destination.** The seven leaves, six selector classes, near-tie path, and zero-signal fallback all remain; ambiguous leaf evidence ⇒ one `clarify`, never an invented second mode.
- **Destination identity, PREPARE/VERIFY/COMMIT, idempotency, receipts, deterministic replay** — all retained as shared safety machinery.
- The packet's `mcp-route-guard.cjs` stays advisory (`allow`/`warn`, fails open) [Confirmed: `.../runtime/lib/mcp-route-guard.cjs:211-218,260-265`] and **cannot** become destination VERIFY.

Three scopes stay separate at N=1 and must not be conflated into one "admission": (1) fleet admission to Code Mode, (2) knowledge-leaf loading inside `mcp-code-mode`, (3) external manual/tool selection during Code Mode execution.

### 5.3 The complexity dial (N=1 → multi-mode parent hub)

The **only** things that change across the fleet are cardinality and the emptiness of a few collections — the schema is byte-for-byte the same shape:

| Skill | candidateCount | selectionKinds | crossTargetEdges | handoffEdges | overlay | typical basis |
|---|---|---|---|---|---|---|
| `mcp-code-mode` (N=1) | 1 | `{single}` | `[]` | `[]` | null | `signal` / `defer` |
| `sk-code` | few | `{single, surfaceBundle}` | evidence edges | optional | null→opt | `signal`, `surfaceBundle` |
| `system-deep-loop` | many (shared packets) | `{single}` | backend/runtime projections | optional | opt | `signal` |
| `mcp-tooling` | many | `{single, orderedBundle}` | `composeAfter`, `requiresAuthorityFrom` | optional | opt | ordered, judgment-gated |

The residual N=1 runtime cost (leaf scoring, manifest membership, PREPARE/VERIFY, idempotency, replay hashing) is **shared safety machinery, not singleton overhead**. Measured input sizes (Confirmed, SOL-B iteration): the singleton manifest is ~414 bytes + ~1,000 bytes of legacy aliases, versus ~5,355 + ~3,893 bytes for `sk-code`. The manifest is a *correctness* cost (fail-closed on unmapped leaves, drift detection), not hot-path overhead; the alias array compiles out of the hot card once dual-read retires.

**Verdict: the degeneracy holds cleanly.** The design is not over-built. The base contract is complete and correct with `overlay = null` and `P = static`, and *that configuration is exactly the N=1 case*. Multi-mode composition and learning are additive corners of the same coordinate space, reached by populating collections that are empty at N=1.

---

## 6. Overlap-resolution and eliminated-alternatives (consolidated)

Beyond the four named seams, the lineages ruled out ten-plus design directions. The load-bearing eliminations:

| Rejected | Why (across lineages) |
|---|---|
| Flat six-outcome enum | Mixes positive composition with control flow; weakens branch-owned authority |
| `(T,R,P)` as the whole policy | Omits destination graph, roles, selectors, composition, lifecycle identity |
| `orderedBundle` under recovery | Composition is a successful route shape, not uncertainty handling |
| Independent clarify + handoff budgets | Permit duplicate user turns and retries |
| Handoff acceptance = completion | Collapses ownership transfer into effects |
| Mutable online overlay | Breaks replay and request-pinned identity |
| Separate `SingularRouter` / default-to-self | Forks common semantics; swallows real exclusions |
| Packet path / workflow-mode as global identity | Fails same-packet lanes and name collisions |
| Advisor rank as calibrated probability | Exceeds available evidence |
| Replace / edit the shared scorer | Loses baseline comparability (hard constraint) |
| Runtime registry reads by the advisor | Hot-path cross-skill coupling; mixed generations |
| Transport as taste authority | Violates destination roles and the `mcp-tooling` contract |
| Big-bang migration / rollback by regeneration | Unsafe attribution; cannot guarantee restored bytes |

---

## 7. Parent-hub archetype mapping (falsification survivors)

- **`sk-code` — workflow + evidence.** One acting workflow, zero-or-more read-only surfaces; the advisor routes one hub identity and surfaces are advisor-invisible [Confirmed: `.opencode/skills/sk-code/SKILL.md:50-57`]. Expressed as `surfaceBundle`: one `actor` primary + N `evidence` roles (`mutatesWorkspace=false`); an evidence target can never COMMIT. Evidence ordering is order-of-loading, not effect order.
- **`system-deep-loop` — public mode / packet / backend / runtime.** Compile four explicit projections: `qualified public mode → packetRef → backendKind → optional runtimeLoopType`. Do not collapse modes sharing `deep-improvement` or modes mapping to a different runtime loop key. Advisor/command aliases stay compatibility projections with hash-drift guards.
- **`mcp-tooling` — execution order + judgment dependency.** Transports never own design judgment; `mcp-code-mode` stays external infrastructure [Confirmed: `.opencode/skills/mcp-tooling/SKILL.md:15,32-36`]. Two edge kinds: `composeAfter` (ordered effect-capable steps) and `requiresAuthorityFrom` (an authority dependency that must approve before a dependent transport commits). A design-affecting Figma route composes `sk-design/<mode>` then `mcp-tooling/mcp-figma`; the transport receives authority only for the approved intent.

Nine representative break-cases survived with repairs living entirely in compiled data, the fixed algebra, recovery parameters, or destination VERIFY — none required a hub-name or singleton-name conditional.

---

## 8. The three-dimension read

### 8.1 Advisor (Layer-0 `system-skill-advisor`)

The advisor carries a hashed `AdvisorProjectionV1` (hub id, aliases, eligible modes with `qualifiedId`/`publicMode`/`routingClass`, admission labels, `effectivePolicyHash`, projection hash). It **omits** paths, tools, mutation scope, fences, handoff leases, and commit authority. Advisor output becomes **one evidence record**:
- `live` + identity-matching ⇒ may rank eligible destinations (decision-bearing).
- `stale` ⇒ annotation only.
- `absent` / `unavailable` ⇒ zero evidence; local policy continues on last-known-good.

This extends the existing projection-hash drift-guard [Confirmed: `.opencode/skills/system-skill-advisor/feature_catalog/scorer_fusion/projection.md:24-30`] — it never changes the scorer formula. Calibrated auto-route requires a separate certificate tied to the policy/risk slice; advisor rank alone is never probability. **Graceful degradation:** with no advisor, routing is deterministic on the compiled policy — recommendation strength never rewrites a decision.

### 8.2 Benchmark (deterministic route-gold)

The shared scorer `router-replay.cjs` is **never edited** (hard constraint; an eliminated alternative in all four lineages). Mechanism: add `TypedRouteGoldV1` fixtures + a **compatibility projector** that maps typed decisions back into the existing `observedIntents`/`observedResources` shape — positive routes → intents/resources; `clarify|defer|reject` → the existing empty-intent convention; typed leaf pairs → current manifest-aware resource observations. The existing gold and its loud-fail-on-malformed behaviour stay unchanged [Confirmed: `.../router-replay.cjs:432-479`, `.../tests/route-gold-gate.vitest.ts:75-143`]. A scorer edit required to make the unified route pass is a **migration failure**, not a licence to edit the scorer.

Minimum fixture families: exact single route; ordered + surface bundles; zero-signal idle defer with **no default union**; one-turn clarification; forbidden rejection; stale/absent advisor parity; stale proof rejected by VERIFY; direct route with forbidden handoff artifacts; overlay replay/rollback; role escalation + missing authority dependency; **singular omission + zero rank-call assertion**; duplicate idempotency-key receipt.

### 8.3 Standalone on documents alone

`SKILL.md` + a generated `PolicyCardV1.md` (identity/hashes, admission/precedence, qualified roles, bundle grammar, `(T,R,P)`, recovery budget, negative reasons, authority edges, lifecycle checklist, explicit limitations — linking packet contracts, not copying them) lets a document-only AI route deterministically, clarify once, defer, reject, and emit `PREPARED_DRAFT`. It **cannot** claim live activation freshness, calibrated probability, atomic handoff, destination READY, or committed effects. Honest terminal: `DOCUMENT_ONLY_UNATTESTED` / `PREPARED_DRAFT`. This works identically for a parent hub and for `mcp-code-mode` (the card is simply smaller at N=1). The card must be **generated from the same compiled snapshot** — a matching `humanViewHash` alone is insufficient (a generator can hash an incomplete view), so correctness leans on a document-only replay lane that never silently falls back to the machine policy.

---

## 9. Migration — phased, gated, reversible

Authority moves in gates, not file conversions. Legacy stays serving-authoritative until an atomic activation binds the compiled tuple to its human-readable fence.

| Stage | Serving authority | Gate to advance | Rollback |
|---|---|---|---|
| 0. Baseline freeze | legacy | full legacy baseline recorded | — |
| 1. Shadow compile | legacy | canonical bytes regenerate; typed fixtures parse; route-gold stays green | discard inactive generation |
| 2. Dual-read | legacy | every legacy input resolves through a declared mode/alias; unmapped fails closed | disable adapter |
| 3. Shadow evaluate | legacy | full typed replay deterministic; compatibility projection matches route-gold; mismatches classified; gold never auto-updates | disable shadow lane |
| 4. Per-hub canary | typed evaluator behind fenced selector | zero hard mismatch; advisor identity matches or is ignored; document parity passes; rollback drill proven | CAS to prior/legacy generation |
| 5. Offline overlay | base or promoted tuple | offline replay + safety/parity + independent approval + byte-stable tuple | CAS to base-only/prior overlay |
| 6. Destination rollout | destination-local | proof/expiry/read-set/authority/epoch/idempotency/receipt fixtures; read-only legs before mutating | disable pre-effect adapter; post-effect recovery is destination-owned |
| 7. Fleet cleanup | typed contract | per-skill deletion gates, incl. N=1 via the identical compiler path | retain prior generation during window |

**Activation order (majority):** `mcp-code-mode → sk-code → system-deep-loop → mcp-tooling`. Increasing semantic blast radius: cardinality-one, then evidence composition, then shared packet/backend projections, then external effects + cross-hub judgment. Fenced selector: acceptance snapshots candidate artifacts + prior manifest; ship compares expected generation/hash then swaps atomically (token lock + fencing epoch, checked immediately before rename). Requests pin one generation. Rollback swaps to the byte-identical prior manifest — it **cannot** undo an external COMMITted effect; post-effect recovery is destination-owned. Follows confirmed repo safety properties: atomic temp/fsync/rename [Confirmed: `.../state_safety/atomic_state.md:19-31`] and accept/ship with preimage drift checks + rollback [Confirmed: `.../two_phase_promotion_and_rollback.md:17-29`].

Aggregate score may inform promotion but can never override a hard gate: a negative decision that carries a target/tool/authority, an evidence target that commits, a transport that supplies judgment, a missing authority edge, a hash mismatch against the pinned tuple, a request observing mixed generations, an exact route emitting clarification/handoff artifacts, a handoff revisiting a destination or exceeding the shared budget, a COMMIT lacking VERIFY, a duplicate key creating a second effect, or **singular evaluation calling ranking/bundle/handoff machinery** — each hard-blocks activation.

**Recommended first slice:** define the canonical schemas + deterministic serialization; compile only `mcp-code-mode` into `EffectivePolicy` + the three projections; generate the legacy-gold compatibility fields + typed fixtures; run shadow parity with zero live authority; prove one-generation activation + byte-exact rollback. Do **not** begin with the overlay, calibrated auto-route, or the handoff service — those are valuable only after the base compiler, typed decisions, projections, VERIFY, and rollback are proven.

---

## 10. Constraint compliance

| Hard constraint | How the design holds it |
|---|---|
| Deterministic offline route-gold replay preserved | Typed gold + compatibility projector; identical inputs compile to byte-identical policy bodies; replay never calls a live advisor |
| Never touch the shared scorer | Projector adapter maps typed decisions into the existing intent/resource contract; a required scorer edit is a migration failure |
| Authority stays destination-local | Proof/recommendation is evidence; only destination VERIFY→COMMIT consumes authority; negatives withhold authority; advisor is evidence-only |
| Reversible + gated migration | Seven gated stages; fenced CAS activation; per-hub canary; retained prior generations; drift-checked rollback |
| No over-emission | Zero-signal ⇒ typed `defer` with no fallback/default union; forbidden-artifact gates; full-registry-on-uncertainty eliminated |

---

## 11. Open questions (empirical / operational — no architectural ambiguity remains)

1. **Migration activation order** — the majority order puts `mcp-tooling` last (highest blast radius: external effects + cross-hub judgment). The Terra lineage argued `mcp-code-mode → mcp-tooling → sk-code → system-deep-loop` (transports before bundles). A genuine cross-lineage disagreement; resolve with real blast-radius data before Stage 4.
2. Exact evidence tiers and thresholds that permit calibrated auto-route per hub/risk slice — requires a held-out corpus that does not yet exist.
3. Which overlay fields are learnable per hub beyond vocabulary→destination — GLM's "learn the vocab table, not the weights" (weights are a uniform, inert `4`) needs live validation.
4. Canonical JSON serialization + domain-separation strings for byte-stable policy/proof/overlay hashes.
5. Idempotency ledger location + retention/partition model; which destinations can supply side-effect-free PREPARE and atomic (or explicitly non-atomic) COMMIT.
6. Whether the advisor projection can consume compiled cards directly or needs a generated byte-identical view.
7. Shadow-evaluation traffic sample, privacy filter, and retention governing overlay training.
8. How cross-hub judgment approvals (e.g. `sk-design → mcp-figma`) are represented across process/machine boundaries.

None should be answered by invented constants; each needs implementation research, baseline measurement, and an explicit operating decision.

---

## 12. The biggest unresolved tension

**Minimalism vs. adaptivity, under the graceful-degradation mandate.** The learning value (Idea 2 overlay + GLM's closed-loop handoff signal) is real and is the only idea in the set about learning — yet the degenerate-case proof shows that at N=1 there is *nothing to learn* (one destination, inert weights, no handoff signal), and the authority hardliner shows the overlay must *never* serve online. So the overlay is simultaneously the most architecturally interesting plane and the last thing to build, contributing zero to the load-bearing degenerate case; and its `P = offline-learned` corner rests on the least-validated idea in the set (single-model GLM inference, no live execution).

The council resolves this by **inverting the default**: the base contract must be complete and correct with `overlay = null` and `P = static` — which is exactly the N=1 configuration — and multi-mode composition and learning become additive corners reached by populating collections that are empty at N=1. `(T,R,P)` is kept as the *explanatory coordinate system* (it is why the shipped keep-1/flip-4 verdict sits at defensible corners) and the overlay as an *optional, gated, offline* capability. Neither is allowed to become load-bearing for the base. The residual, honestly unresolved, question is whether the `P` axis and the overlay earn their conceptual weight in a fleet where the load-bearing skill and most parent hubs may run `P = static` forever — a call that only real correction-telemetry volume and a demonstrated routing gain can settle.

---

## 13. Confidence and limitations

- **High** confidence in the structural architecture: it survived four independent lineages (2× SOL xhigh, Terra xhigh, Luna max), four repository archetypes, and each lineage's own falsification matrix, converging near-identically on the five planes, the four-action nested algebra, the one shared budget, and the N=1 partial-evaluation reduction.
- **Medium** confidence in the schema field boundaries: implementation may reveal serialization or compatibility details warranting amendments.
- **Low — and intentionally unclaimed** — for performance, calibration quality, threshold values, bake windows, exactly-once storage, and overlay benefit: no implementation or production corpus was measured. Source evidence is repository-local; no external standards survey or production telemetry was included; the code graph was unavailable, so structural claims were verified through direct file reads and exact-text search.

This document is a planning recommendation for user review or handoff to an implementation agent. No files outside this synthesis and the sibling `ai-council/**` artifacts were produced by the council.
