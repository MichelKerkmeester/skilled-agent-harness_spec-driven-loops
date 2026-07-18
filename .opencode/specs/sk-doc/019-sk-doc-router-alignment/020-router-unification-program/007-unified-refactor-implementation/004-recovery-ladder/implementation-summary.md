---
title: "Implementation Summary: Recovery Ladder"
description: "Ordered six-rung recovery behavior, shared uncertainty budget, typed route-gold projection, and finite shadow replay."
trigger_phrases:
  - "recovery ladder implementation summary"
  - "shared uncertainty budget evidence"
  - "recovery shadow replay results"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: Recovery Ladder

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented; phase-local evidence is `shadow-partial` |
| **Date** | 2026-07-18 |
| **Level** | 2 |
| **Authority** | Shadow-only; no serving route, commit authority, or external effect |
| **Strict Validation** | Not run here by instruction; orchestrator-owned from main tree |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The phase now contains a single ordered recovery ladder evaluated only when the caller has not
already produced a confident route. Its fixed sequence is eligibility/authority, deterministic
route or certificate-gated fall-through, clarify, handoff, defer, and reject. A confident route is
returned before any rung is invoked. The ladder emits only the frozen four-action
`RouteDecisionV1` algebra; handoff is internal recovery trace and ownership state, not a fifth
public decision action.

One request-scoped budget carries the frozen `UncertaintyBudgetV1` limits
`{ userTurns: 1, handoffHops: 1 }`. The reducer accepts and returns the continuation under the same
`budgetState` field; `budget` remains a human-facing alias. Given a caller threads the returned
state under the same `requestId`, turn and hop counters are monotonic and bounded. An accepted
clarification answer must carry the paid, matching continuation; it performs exactly one rescore
without spending a second turn. Unthreaded accepted answers are rejected as caller-contract
violations. Visited destinations and hop count are guarded before ownership transfer, and
downstream `NEEDS_INPUT` terminates without reopening the counter.

The eligibility and authority gate now fails closed. Missing eligibility proof rejects before
ranking; missing authority or freshness proof defers before ranking. Confident decisions are
validated against the closed decision algebra before bypass, so malformed target-bearing or
authority-granted negatives cannot be echoed. Zero positive signal is classified by the reducer as
`defer(idle)`, while `reject(invalid)` requires an explicit invalidity fact. Clarification is
admitted only when its legal-local candidate has a routable target. Every public negative decision
is target-free and authority-`Withheld` (synthesis §2.3, §4 seam B, §10).

The compatibility projector emits current scorer observations and a checked-in
`TypedRouteGoldV1` row per case. Negative observations use the empty-intent convention. Twenty-two
behavioral cases cover every required family and every defer reason; the zero-dependency harness
drives the paths, checks fixed counters and reasons, hashes repeated replay, and invokes the real
shared scorer in a write-denied child process. At shadow stage the phase-local compatibility
projector stands in for the router; `routeSkillResources()` is not invoked or claimed as exercised.

### Files Delivered

| File | Action | Purpose |
|------|--------|---------|
| `recovery-ladder.v1.json` | Created | Declarative rung order, schema pins, budget semantics, and inert auto-route boundary |
| `lib/recovery-ladder.cjs` | Created | Ordered recovery evaluator, shared budget ledger, and bounded handoff trace |
| `lib/compatibility-projector.cjs` | Created | Existing scorer observations and typed-gold projection |
| `fixtures/recovery-cases.v1.json` | Created | Independently authored behavioral inputs, exact path expectations, and scorer gold |
| `fixtures/typed-route-gold.v1.json` | Created | Checked-in frozen-schema-shaped projection fixtures |
| `harness/validate-recovery-ladder.cjs` | Created | Determinism, finiteness, authority, bypass, scorer, and protected-byte gates |
| `checklist.md` | Created | Level-2 verification evidence |
| `spec.md`, `plan.md`, `tasks.md` | Updated | Implementation state, task checkboxes, and evidence |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The runtime and projector import Phase-0 `lib/canonical.cjs`; they do not import another phase's
live evaluator or projector. The declarative contract pins the frozen decision and budget schema
digests. The implementation uses Node built-ins only in the harness and introduces no package or
install surface.

Recovery trace is deliberately separate from the public decision. The frozen decision schema has
no handoff action and permits no candidate field on `defer`; the phase therefore pairs a
schema-valid `defer(handoff-required)` source with a named candidate in the internal recovery
context. This preserves the closed algebra and prevents a negative result from smuggling a target.

The harness pins trusted SHA-256 constants for `router-replay.cjs`,
`score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`, and both consumed schemas. It checks the
bytes before and after replay. A child process disables filesystem mutation functions before
requiring `evaluateRouteGold()`, scores phase-projected observations against separately authored
intent/resource gold, and proves the failure lane with a corrupted intent. `router-replay.cjs`
remains a protected byte input, not an executed router path at this stage.

Rollback is removal or disablement of the phase-local shadow lane. The lane owns no live authority
or effects, so rollback requires no external compensation (synthesis §§9-10).

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep handoff inside recovery trace over the four-action public algebra | The decision contract remains `route \| clarify \| defer \| reject`, and negatives stay structurally target-free (synthesis §2.3, §4 seam B). |
| Use one symmetrically named continuation for clarify and handoff | Independent or silently reset budgets permit duplicate turns and loops; threading returned `budgetState` under the same request id makes counters monotonic and bounded (synthesis §2.1, §4 seam B). |
| Separate paid-answer rescore from asking | The question spends the one turn; its matching accepted answer performs one rescore without allocating another turn (synthesis §3 idea 5, §4 seam B). |
| Fail closed before ranking and validate confident bypasses | Only affirmative eligibility, authority-dependency, and freshness facts admit ranking; bypassed decisions must still satisfy the closed algebra (synthesis §2.3, §4 step 1, §10). |
| Stop high rank at evidence when no certificate validator exists | Advisor rank is not probability, and calibrated auto-route requires a pinned certificate for the policy/risk slice (synthesis §3 idea 5, §8.1). |
| Require schema-valid `defer(handoff-required)` plus a distinct named viable recovery candidate | Handoff is admitted only from the declared recovery state and transfers ownership rather than completion (synthesis §3 idea 4, §4 seam B, §9). |
| Project negatives to empty scorer observations | Preserves current route-gold semantics without changing the shared scorer (synthesis §8.2, §10). |
| Pin protected inputs and score in a write-denied child | Keeps baseline comparability and turns an attempted write or byte drift into an observed hard failure (synthesis §8.2, §9, §10). |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Gate | Result | Evidence |
|------|--------|----------|
| Frozen contract baseline | Pass | 20/20 golden fixtures accepted, 17/17 adversarial fixtures rejected, 11/11 Phase-0 validation groups passed before implementation |
| Syntax and config parsing | Pass | `node --check` on three CJS files; JSON parse on all three phase JSON artifacts |
| Alignment and comment hygiene | Pass | Alignment verifier scanned eight implementation/config files with zero findings; comment checker reported zero violations on all CJS files |
| Behavioral replay | Pass | 22 cases and 1,720 assertions, including exact rung lists, specific terminal reasons, and real two-call continuations |
| Determinism | Pass | 25 same-process and three child-process runs reproduced all result and typed-gold hashes |
| Shared budget and handoff finiteness | Pass | A first accepted handoff threads its returned `budgetState` into a second call; cumulative accepted turn and hop increments remain exactly one, with maximum counters of one |
| Accepted clarification | Pass | Call 1 asks and spends one turn; call 2 threads the returned state, performs one rescore, routes locally, and leaves `userTurnsUsed=1` |
| Fail-closed authority gate | Pass | Missing gate rejects and partial gate defers with `rankCalls=0`; explicit missing dependency and stale policy retain their typed reasons |
| Negative authority invariant | Pass | Every clarify/defer/reject is recursively target-free and authority-`Withheld` |
| Confident bypass | Pass | A valid confident route invokes zero rungs; a malformed confident negative is converted to target-free `reject(invalid)` rather than echoed |
| Zero-signal and invalid split | Pass | A reason-free well-formed request yields `defer(idle)`; a separate request with an invalidity fact reaches `reject(invalid)` |
| Clarify candidate shape | Pass | A truthy targetless candidate emits no clarify, spends no turn, and falls to `defer(no-match)` |
| Projector and real scorer | Shadow-partial | 22/22 real read-only `evaluateRouteGold()` verdicts pass against independently authored gold; a corrupted intent fails; the real router is not invoked at shadow |
| Protected bytes | Pass | Router, scorer, loader, and both consumed schemas match trusted constants before and after |
| Level-2 document conformance | Pass | Both edited docs pass `validate_document.py --type spec`; anchor/evidence checks pass; extraction reports DQI 79 and 75, both `good` |

Protected input hashes:

- `router-replay.cjs`: `b039b8dd22dbfaaa91042f613998d54610080feadef6179362e0d01b83e8bedf`
- `score-skill-benchmark.cjs`: `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`
- `load-playbook-scenarios.cjs`: `249be7c1cae9dcfe1faec8dcfc2965a0a0fc89e0af8e30bdd271625f300a6fde`
- `route-decision.v1.schema.json`: `6b776b2fbdaf43996511d2d096bcc172d287d5a86609dd6c9dcd4013f481f5a7`
- `uncertainty-budget.v1.schema.json`: `353a9cee567fc6e612e1c3f17088eb2bf30a88bbcf745923552361b136539b2c`

The verification rung is deterministic unit/in-memory shadow replay. It proves phase-local contract
behavior and shared-scorer compatibility, not serving activation.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Route-gold evidence is shadow-partial.** The real shared scorer evaluated all 24 locally
   authored rows, but the ladder was not mapped to real hub producer scenarios. Full producer and
   per-hub route-gold, including real `routeSkillResources()` execution, is deferred to activation.
2. **Certificate-backed auto-route remains inert.** No held-out corpus or certificate validator is
   available in this phase, so ranking can only supply evidence and fall through. This is the
   intended boundary (synthesis §8.1, §11 open question 2).
3. **The frozen public defer branch cannot carry a candidate name.** Candidate identity is paired
   with a schema-valid `defer(handoff-required)` in internal recovery context and never emitted on
   the negative decision. A future first-class public recovery envelope would require a frozen
   contract amendment; this phase does not make one.
4. **Repository-level strict validation was not run.** The execution brief reserves
   `validate.sh --strict` for the orchestrator. Task T025 remains `[B]` for that external boundary.
5. **Metadata refresh and strict validation are orchestrator-owned.** `description.json` and
   `graph-metadata.json` are regenerated from the completed docs, and strict validation runs from
   the main tree, at ship time by the orchestrator rather than by the phase build.
6. **Threaded continuation state is trusted, not adversarial input.** The shared budget counters and
   the clarification continuation are threaded by the caller between turns. A stateless, deterministic,
   serializable reducer cannot cryptographically distinguish a genuine continuation from a forged one
   without a module secret it does not hold, so the recovery ladder is an internal router component
   whose threaded state is trusted router-loop state: a caller that forges continuation state (a
   fabricated "already-asked" marker, or a reset counter) breaks the same threading contract as one
   that omits the state entirely. Detectable violations — a mismatched request/budget identity, an
   out-of-range counter, or a changed-resource continuation whose fingerprint no longer matches — are
   rejected; the residual is a documented trust boundary, not an integrity guarantee.

<!-- /ANCHOR:limitations -->
