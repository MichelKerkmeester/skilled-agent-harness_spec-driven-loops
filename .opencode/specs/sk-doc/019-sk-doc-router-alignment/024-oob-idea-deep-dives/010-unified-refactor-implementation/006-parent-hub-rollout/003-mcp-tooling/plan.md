---
title: "Implementation Plan: Activate the Compiled Contract on mcp-tooling (Phase 006/003)"
description: "Build approach for the final, highest-blast-radius parent-hub activation: author the mcp-tooling destination graph and composition edges (composeAfter, requiresAuthorityFrom) as compiled data, wire the fenced activation selector, prove the design-affecting Figma worked case, and pass the Stage 4 canary + Stage 6 destination-rollout gates with read-only legs before mutating legs. The shared scorer is never touched."
trigger_phrases:
  - "mcp-tooling activation plan"
  - "composeAfter requiresAuthorityFrom build"
  - "destination rollout read-only legs first"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Activate the Compiled Contract on mcp-tooling (Phase 006/003)

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Nature** | Planning/design packet — no live routing config, registry, scorer, or skill is modified |
| **Consumes** | `EffectivePolicy` + 3 projections (phase `001`), evaluator + 4-action algebra (phase `002`), PREPARE→VERIFY→COMMIT + receipts + idempotency (phase `003-execution-verify-commit`), recovery ladder (phase `004`) |
| **Produces** | The compiled `mcp-tooling` destination graph + composition edges, the fenced-selector activation procedure, the canary + destination-rollout gate definitions, and the fixture inventory — all as spec-folder documentation |
| **Never touches** | `router-replay.cjs` (shared scorer); a required scorer edit is a migration failure [synthesis §8.2] |

### Overview

The build is **additive semantic data + a fenced activation**, not a rewrite [synthesis §9]. `mcp-tooling` is the fleet's only archetype with effect-ordered composition and a cross-hub judgment dependency, so the whole plan turns on getting two edge kinds and one authority discipline into *compiled data* such that the dangerous states are unrepresentable rather than merely checked [synthesis §7]. The approach mirrors the earlier hub activations but adds the destination-rollout discipline (read-only legs before mutating legs) because this is where routing produces real external effects [master plan Stage 6].

The plan proceeds in the order: (1) confirm the activation-order precondition and blast-radius data; (2) author the destination graph + roles; (3) author the two composition edge kinds + authority graph; (4) specify the fenced selector; (5) define fixtures via the compatibility projector; (6) define the Stage 4 canary and Stage 6 destination-rollout gates; (7) specify the rollback drill and its explicit limit.

## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases `000`–`004` contracts are stable and cited (compiler, evaluator, execution, recovery)
- [ ] `006/002` (`system-deep-loop`) Stage 4 canary is cleared — mcp-tooling activates last [synthesis §9]
- [ ] Real blast-radius data resolving open question Q1 is available before Stage 4 opens [synthesis §11 Q1]
- [ ] The `mcp-tooling` SKILL.md transport/judgment boundary is re-read as source-of-truth [`.opencode/skills/mcp-tooling/SKILL.md:15,32-36`]

### Definition of Done
- [ ] Destination graph, composition edges, and authority graph fully specified as compiled data (no hub/transport-name conditionals)
- [ ] The design-affecting Figma worked case is specified end-to-end with authority withheld until approval
- [ ] Stage 4 canary + Stage 6 destination-rollout gates defined with read-only-before-mutating sequencing
- [ ] Fixture families enumerated against the existing compatibility projector; scorer untouched
- [ ] Rollback drill defined, including the explicit "cannot undo external COMMIT" limit

## 3. ARCHITECTURE

### Where this phase sits

`mcp-tooling` compiles into the **same** `CompiledPolicyV1` shape as every other destination; only cardinality and the emptiness of a few collections differ [synthesis §5.3]. This hub is the one where `crossTargetEdges` and the `authorityGraph` are non-empty and `selectionKinds` includes `orderedBundle`:

| Field | `mcp-tooling` value | Note |
|-------|---------------------|------|
| `candidateCount` | many | transports + judgment destinations [synthesis §5.3] |
| `selectionKinds` | `{single, orderedBundle}` | ordered = *effect order*, unlike `sk-code`'s order-of-loading evidence [synthesis §5.3, §7] |
| `crossTargetEdges` | `composeAfter`, `requiresAuthorityFrom` | the two edge kinds unique to this archetype [synthesis §7] |
| `overlay` | `opt` | only after a demonstrated routing gain (phase `007`) [synthesis §5.3, §12] |
| typical `basis` | `ordered`, judgment-gated | not calibrated auto-route until a certificate exists [synthesis §5.3, §8.1] |

### The two edge kinds (compiled data)

- **`composeAfter(A, B)`** — B is an effect-capable transport step that must run after A; the evaluator emits an `orderedBundle` whose targets are effect-ordered. Ordering is a property of a *successful route*, never a recovery mechanism (`orderedBundle` under recovery is an eliminated alternative) [synthesis §6, §4 Seam A].
- **`requiresAuthorityFrom(T, J)`** — transport T may only reach COMMIT for an intent once judgment destination J has produced an approving `RouteProofV1` for that pinned intent. J is a `judgment`-role destination; T is a `transport`-role destination. The edge lives in `authorityGraph[]`; there is no name conditional [synthesis §7, §2.2].

### Authority discipline (the load-bearing property)

Authority is destination-local: a proof/recommendation is evidence, never a capability [synthesis §2, §10]. Every non-`route` decision withholds authority structurally; a `route` decision carries `authority: WithheldUntilVerify` [synthesis §2.3]. For the worked Figma case, the compiled route is `orderedBundle[ sk-design/<mode>, mcp-tooling/mcp-figma ]`; `mcp-figma` receives authority scoped **only to the approved intent** and only after `sk-design`'s VERIFY produces the approving proof [synthesis §7]. Transports never own design judgment; `mcp-code-mode` stays external infrastructure [synthesis §7, §6].

### Data flow (design-affecting Figma worked case)

1. Evidence adapters build a `RouteRequestV1` pinned to one activation generation [synthesis §2.1].
2. The evaluator matches a design-affecting intent to the `composeAfter`/`requiresAuthorityFrom` rules and emits `route{ selectionKind: orderedBundle, targets: [sk-design/<mode>, mcp-tooling/mcp-figma], authority: WithheldUntilVerify }` [synthesis §2.3, §7].
3. `sk-design/<mode>` runs PREPARE→VERIFY→COMMIT for the judgment leg, producing an approving `RouteProofV1` scoped to the intent [synthesis §2.1].
4. `mcp-tooling/mcp-figma` PREPARE reads that proof as evidence; its VERIFY checks the `requiresAuthorityFrom` edge is satisfied for the pinned intent and epoch; only then may COMMIT run once (idempotency key), emitting a receipt [synthesis §7, §2.1, §9].
5. Any deviation — transport-first, transport-without-approval, COMMIT-without-VERIFY, duplicate-key second effect — is a hard gate block [synthesis §9].

## 4. IMPLEMENTATION PHASES

### Phase A: Preconditions
- [ ] Confirm `006/002` Stage 4 canary cleared and blast-radius data resolves Q1 (mcp-tooling-last) [synthesis §9, §11 Q1]
- [ ] Re-read `mcp-tooling` transport/judgment boundary and inventory its transports (mcp-figma, mcp-refero, mcp-mobbin, mcp-code-mode as external infra) [`.opencode/skills/mcp-tooling/SKILL.md:15,32-36`]

### Phase B: Author the compiled destination graph
- [ ] Enumerate `destinations[]` with `role ∈ {actor, evidence, transport, judgment}`; assert no transport carries a judgment role [synthesis §2.2, §7]
- [ ] Fix `selectionKinds = {single, orderedBundle}`; document that ordered = effect order [synthesis §5.3]

### Phase C: Author composition + authority edges
- [ ] Specify `composeAfter` rules for effect-ordered transport chains [synthesis §7]
- [ ] Specify `requiresAuthorityFrom` edges in `authorityGraph[]`; specify authority scoped to the approved intent, consumed at VERIFY→COMMIT only [synthesis §2.3, §7]
- [ ] Specify the design-affecting Figma worked case as the canonical example [synthesis §7]

### Phase D: Fenced activation selector
- [ ] Specify accept-snapshot (candidate + prior manifest), expected generation/hash compare, atomic swap under token lock + fencing epoch checked immediately before rename [synthesis §9]
- [ ] Specify one-generation-per-request pinning and retained prior generation [synthesis §9]

### Phase E: Fixtures via the compatibility projector (scorer untouched)
- [ ] Enumerate fixture families: exact single route; ordered bundle; `role escalation + missing authority dependency`; direct route with forbidden handoff artifacts; stale/absent advisor parity; stale proof rejected by VERIFY; duplicate idempotency-key receipt [synthesis §8.2]
- [ ] Confirm each maps back through the compatibility projector into the existing intent/resource gold shape; `router-replay.cjs` unchanged [synthesis §8.2, §10]

### Phase F: Gates + rollback drill
- [ ] Define the Stage 4 per-hub canary acceptance (zero hard mismatch; advisor match-or-ignore; document parity; rollback proven) [master plan Stage 4]
- [ ] Define the Stage 6 destination rollout acceptance with read-only legs proven before any mutating leg [master plan Stage 6]
- [ ] Define rollback = CAS to byte-identical prior manifest; state explicitly it cannot undo an external COMMIT; post-effect recovery is destination-owned [synthesis §9]

## 5. TESTING STRATEGY

| Test Type | Scope | Mechanism |
|-----------|-------|-----------|
| Deterministic route-gold | Typed decisions → existing gold via compatibility projector | Existing gold + loud-fail-on-malformed; scorer never edited [synthesis §8.2] |
| Worked-case replay | `sk-design/<mode> → mcp-tooling/mcp-figma` ordered, authority-gated | Fixture asserts transport authorized only post-approval; reverse unrepresentable [synthesis §7] |
| Hard-gate assertions | Transport-supplies-judgment, missing authority edge, COMMIT-without-VERIFY, duplicate-key, exact-route-with-handoff-artifacts | Each hard-blocks activation [synthesis §9] |
| Canary parity | Advisor identity match-or-ignore; document-only `PolicyCardV1.md` parity | `effectivePolicyHash` match; `PREPARED_DRAFT` terminal only [synthesis §8.1, §8.3] |
| Rollback drill | Fenced CAS to prior manifest | Byte-identical restore proven; external-COMMIT limit documented [synthesis §9] |

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases `000`–`004` contracts | Internal | Required | Cannot compile/execute the tooling contract |
| `006/002` Stage 4 cleared | Internal | Required | Cannot open mcp-tooling canary (last in order) [synthesis §9] |
| Blast-radius data (Q1) | Internal | Open | Ordering `mcp-tooling`-last is disputed by Terra lineage; resolve before Stage 4 [synthesis §11 Q1] |
| Cross-process authority representation (Q8) | Internal | Open | `sk-design → mcp-figma` approval spans process/machine boundaries; canary must exercise the real boundary [synthesis §11 Q8] |
| `router-replay.cjs` | External (frozen) | Do-not-touch | Any required edit = migration failure [synthesis §8.2, §10] |

## 7. ROLLBACK PLAN

- **Trigger**: Any hard-gate trip on the canary, hash mismatch against the pinned tuple, mixed-generation observation, or a transport reaching COMMIT without a satisfied authority edge [synthesis §9].
- **Procedure**: Fenced CAS swap of the activation manifest to the byte-identical prior generation (retained during the window); requests continue to pin one generation.
- **Hard limit**: Rollback **cannot** undo an external COMMITted effect (a committed Figma mutation). This is why read-only legs are proven before any mutating leg is enabled, and post-effect recovery is destination-owned [synthesis §9, master plan Stage 6].
