---
title: "Feature Specification: Decision Evaluator — The Closed 4-Action Route Algebra"
description: "A pure, offline, deterministic local evaluator that maps RouteRequestV1 + CompiledPolicyV1 into RouteDecisionV1 (route | clarify | defer | reject), enforces the closed-algebra invariants (only route has targets; every negative branch withholds authority; selectionKind is a field inside route; rank is evidence not probability; degraded-fallback is named, read-only, uncached), and wires typed route-gold fixtures through a compatibility projector so the shared benchmark scorer router-replay.cjs is never edited."
trigger_phrases:
  - "decision evaluator route algebra"
  - "RouteDecisionV1 four action evaluator"
  - "typed route-gold compatibility projector"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Decision Evaluator — The Closed 4-Action Route Algebra

## EXECUTIVE SUMMARY

This phase builds the **decision plane** of the unified router refactor: a single pure function that takes a pinned `RouteRequestV1` plus the immutable `CompiledPolicyV1` produced by Phase 1 and returns exactly one `RouteDecisionV1`. The decision type is the **closed, nested four-action algebra** the council converged on — `route | clarify | defer | reject` — with the positive composition shapes (`single | orderedBundle | surfaceBundle`) living as a `selectionKind` field *inside* `route`, never as top-level actions (synthesis §2.3, §4 seam A).

The evaluator carries no capability. A decision is a proof-shaped recommendation: `route` withholds authority as `WithheldUntilVerify` and hands the actual PREPARE→VERIFY→COMMIT to the destination (Phase 3); every non-`route` branch is structurally target-free and authority-`Withheld`, so a negative decision can never smuggle a destination through a fallback field (synthesis §2.3 invariants, §3 idea 3).

The benchmark seam is the load-bearing constraint of this phase. Typed decisions reach the existing deterministic route-gold via a **compatibility projector** that maps them back into the current `observedIntents`/`observedResources` shape. The shared scorer `router-replay.cjs` is **never edited** — a scorer change required to make the unified route pass is recorded as a *migration failure*, not performed (synthesis §8.2, §6, §10). This is planning/design only: no live routing config, registry, scorer, or skill is modified.

## PROBLEM & PURPOSE

### Problem Statement
The eight routing ideas each type "what happens next" differently, and two of them collide directly: Idea 3 (typed no-destination) and Idea 6 (minimal typed contract) both propose an outcome type, and Idea 6's sketch flattens composition and control flow into a single six-value enum `single|orderedBundle|surfaceBundle|clarify|defer|reject`. That flat enum makes dangerous states representable — a "route" whose reason is really `no-match`, or a negative outcome that still carries a target — and it weakens branch-owned authority (synthesis §4 seam A, §6). Without one closed decision type and one pure evaluator that enforces its invariants structurally, every downstream plane (execution, recovery, benchmark, advisor) has to re-litigate what a decision is allowed to contain.

### Purpose
Ship a pure, offline, deterministic evaluator whose only output type is the closed four-action algebra, whose invariants make the dangerous states *unrepresentable*, and whose typed fixtures replay through the untouched shared scorer via a compatibility projector — so the whole fleet routes on one decision shape at every cardinality from N=1 to a multi-mode parent hub.

## SCOPE

### In Scope
- The pure evaluator function `evaluate(request: RouteRequestV1, policy: CompiledPolicyV1) -> RouteDecisionV1` — no I/O, no clock, no advisor call, no mutation, no live authority (synthesis §2 decision plane).
- The `RouteDecisionV1` decision type and its guards: the nested `route` shape with `selectionKind ∈ {single, orderedBundle, surfaceBundle}`, and the three negative branches `clarify`, `defer`, `reject` with their reason vocabularies (synthesis §2.3).
- Structural enforcement of every closed-algebra invariant (targets, authority, selectionKind placement, rank-as-evidence, degraded-fallback discipline — see REQUIREMENTS).
- Generation-pinning check: the request's `pinnedActivationGeneration` must match the policy's `effectivePolicyHash`; a mixed-generation request is refused (synthesis §2.1, §9 hard gate).
- The **compatibility projector** that maps typed decisions into the existing `observedIntents`/`observedResources` convention, plus the evaluator-side typed route-gold fixture families (synthesis §8.2).
- The N=1 degeneracy assertion: at `candidateCount = 1` the evaluator walks empty ranking/bundle/handoff collections and never invokes that machinery (synthesis §5, §9 hard gate).

### Out of Scope
- Destination PREPARE/VERIFY/COMMIT, proof objects, receipts, idempotency — owned by Phase 3 (`003-execution-verify-commit/`). The evaluator only *labels* `route.authority = WithheldUntilVerify`; it never consumes authority.
- The recovery ladder's budget accounting (`UncertaintyBudgetV1`, `H=1`, acceptance≠completion) and the live handoff transfer — owned by Phase 4 (`004-recovery-ladder/`). This phase emits the typed `clarify` and `defer(handoff-required)` shapes; it does not debit a persistent budget or execute a hop.
- Calibrated auto-route and any certificate that would let `rankScore` act as a probability — owned by Phase 5 (`005-calibration/`). Here, rank is inert evidence only.
- The correction overlay and any online learning — Phase 7. The evaluator is complete and correct with `overlay = null` (synthesis §5.3, §12).
- Editing `router-replay.cjs`, the existing route-gold rows, live registries, or any skill — explicitly forbidden.

### Non-Negotiable Constraints (apply to every phase, enforced here)
- **Deterministic offline route-gold replay preserved.** Identical inputs produce a byte-identical decision; replay never calls a live advisor or clock (synthesis §10).
- **NEVER touch the shared scorer (`router-replay.cjs`).** The projector adapts typed decisions into the existing intent/resource contract; a required scorer edit is a migration failure (synthesis §8.2, §6).
- **Authority stays destination-local.** A proof/recommendation is never a capability; only destination VERIFY→COMMIT consumes authority; negatives withhold it (synthesis §10, §2.3).
- **Reversible + gated.** The evaluator activates behind the fenced CAS activation manifest with a retained prior generation; requests pin one generation (synthesis §9, master plan shared-gate model).
- **No over-emission.** Zero-signal ⇒ a typed `defer` with no fallback/default union; the full registry is never scored into routes (synthesis §10, §5.2).

## REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The evaluator is a **pure** function of `(RouteRequestV1, CompiledPolicyV1)` — no filesystem, network, clock, RNG, advisor call, or mutation (synthesis §2 decision plane). | Static scan shows the module imports no I/O/clock/RNG; N-run replay of every fixture yields byte-identical decisions. |
| REQ-002 | `RouteDecisionV1` is the **closed nested 4-action algebra** `route \| clarify \| defer \| reject`; `selectionKind ∈ {single, orderedBundle, surfaceBundle}` is a field **inside** `route` (synthesis §2.3, §4 seam A). | Schema/type rejects any decision with a top-level `selectionKind`; the flat six-value enum fails to parse; a `route` with no `selectionKind` fails. |
| REQ-003 | Only `route` has non-empty `targets: NonEmpty<Target>`; `clarify \| defer \| reject` are structurally target-free (synthesis §2.3, §3 idea 3). | A fixture placing any target/tool/destination on a `clarify/defer/reject` decision is unrepresentable (fails the guard); a `route` with empty targets fails. |
| REQ-004 | Every non-`route` branch structurally **withholds authority** (`Withheld`); `route.authority = WithheldUntilVerify`. A proof/recommendation never yields capability (synthesis §2.3, §10). | Authority enum is constrained per branch; no decision emits a capability, lease, or fence token; guard rejects any authority value outside the allowed per-branch set. |
| REQ-005 | Each `Target` carries the full destination identity `(skillId, workflowMode, packetId, packetKind, backendKind)` + policy-declared runtime discriminator + `role ∈ {actor, evidence, transport, judgment}`, selected only from `CompiledPolicyV1.destinations[]` (synthesis §2.2, §7). | A target whose identity tuple is not present in the compiled policy fails; an `evidence`-role target that would COMMIT is rejected; `surfaceBundle` requires exactly one `actor` + N `evidence`. |
| REQ-006 | `rankScore`/`scoreMargin` are **evidence, never authority, never a calibrated probability** without a validation certificate (deferred to Phase 5) (synthesis §2.3, §3 idea 5, §6). | Schema types rank fields as evidence; no evaluator path converts rank to a probability or auto-routes on rank alone; fixture asserts rank cannot flip a `defer` into a `route`. |
| REQ-007 | `basis: degraded-fallback` **names** the unavailable evidence, is read-only/non-mutating, is visible before it runs, and is **never cached** (synthesis §2.3 final invariant). | A degraded-fallback route records the named missing evidence and performs no write; a cached or unnamed degraded-fallback fails the gate. |
| REQ-008 | Typed decisions reach route-gold **only** through a compatibility projector into the existing `observedIntents`/`observedResources` shape; `router-replay.cjs` is byte-unchanged (synthesis §8.2, §6). | `git diff` on `router-replay.cjs` is empty; positive routes project to intents/resources, negatives to the empty-intent convention, typed leaf pairs to manifest-aware resource observations; route-gold gate stays green. |
| REQ-009 | **Stage 3 (Shadow evaluate) gate:** full typed replay is deterministic, the compatibility projection **matches** the existing route-gold, mismatches are classified, and the gold is **never auto-updated** (synthesis §9 stage 3; master plan shared-gate model). | Typed replay over all fixtures is deterministic; projected output equals current gold rows; any mismatch is emitted as a classified report, not written back to the gold. |
| REQ-010 | **No over-emission:** a zero-signal request yields a typed `defer` (`idle`/`no-match`) with **no** fallback/default union (synthesis §10, §5.2). | A zero-signal fixture produces an empty-target `defer`; no path unions the destination registry into scored routes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | The evaluator-side **typed fixture families** exist: exact single route; ordered + surface bundles; zero-signal idle `defer` with no default union; one-turn `clarify`; forbidden `reject`; direct route carrying **no** clarify/handoff artifacts; singular omission + zero rank-call assertion (synthesis §8.2). | Each family has ≥1 fixture that parses and replays deterministically; the "direct route" fixture asserts absence of recovery artifacts (synthesis §9 hard gate). |
| REQ-012 | **N=1 degeneracy honored:** at `candidateCount = 1` the evaluator walks empty ranking/bundle/handoff collections and never invokes that machinery; a singular evaluation calling ranking/bundle/handoff is a hard-block (synthesis §5.1, §5.2, §9). | An `mcp-code-mode` fixture asserts zero rank/bundle/handoff calls and that zero leaf signal ⇒ `defer(no-match)` (never default-to-self). |
| REQ-013 | Generation pinning: a request whose `pinnedActivationGeneration` mismatches `policy.effectivePolicyHash` is refused via `defer(stale-policy)` or `reject`; a request observing mixed generations hard-blocks (synthesis §2.1, §9). | A stale/mixed-generation fixture yields the refusal branch, never a `route`. |

## SUCCESS CRITERIA

- **SC-001**: `evaluate()` is pure and deterministic — every fixture replays byte-identically across repeated runs and across processes (REQ-001).
- **SC-002**: The four dangerous states are **unrepresentable**: a top-level `selectionKind`, a negative decision with a target, a negative decision with authority, and a `route` carrying clarify/handoff artifacts all fail the type/guard rather than being caught at runtime (REQ-002..004, REQ-011).
- **SC-003**: `router-replay.cjs` shows a zero-byte diff and the existing route-gold gate stays green with the projector in place (REQ-008).
- **SC-004**: The Stage 3 shadow-evaluate gate passes — deterministic typed replay, projection matches gold, mismatches classified, gold untouched (REQ-009).
- **SC-005**: The N=1 case emits `single`/`defer` decisions with zero rank/bundle/handoff calls, proving the evaluator is the same contract at cardinality one (REQ-012).

## VERIFICATION & EDGE CASES

Verification is **replay-first**: the acceptance evidence for this phase is a deterministic offline replay of the typed fixture families through the evaluator and the compatibility projector, compared against the frozen route-gold. The shared scorer is invoked, never modified.

Edge cases the fixtures must pin:
- **Zero leaf signal at N=1** ⇒ `defer(no-match)`, not a default-to-self route (synthesis §5.2). "Default-to-self singular route" is an eliminated alternative.
- **Ambiguous leaf evidence** ⇒ exactly one `clarify` (≤3 options + `none_of_these`), never an invented second mode (synthesis §5.2).
- **Confident route** ⇒ never touches the recovery ladder; a `route` emitting clarification/handoff artifacts is a hard-block (synthesis §4, §9).
- **Stale / mixed generation** ⇒ refusal branch, never a route (synthesis §9).
- **Missing/unavailable advisor evidence** ⇒ zero evidence; local policy continues on last-known-good; recommendation strength never rewrites a decision (synthesis §8.1). Advisor consumption itself is Phase 6/advisor-projection scope; here the evaluator only treats advisor input as one optional evidence record.
- **Evidence-role target attempting COMMIT** ⇒ rejected before it can reach execution (synthesis §7).

## MIGRATION GATE

This phase owns **Stage 3 — Shadow evaluate** in the shared migration-gate model (master plan `../spec.md` → "SHARED MIGRATION-GATE MODEL"; synthesis §9 stage 3). Legacy remains serving-authoritative throughout; the typed evaluator runs in shadow with **zero live authority**.

**Gate to advance (must pass before Phase 3 activates):** full typed replay is deterministic; the compatibility projection matches route-gold; mismatches are classified (not silently reconciled); and the gold is never auto-updated. **Rollback:** disable the shadow lane — because the evaluator holds no authority and mutates nothing, disabling it restores the prior behavior exactly. Any of the following hard-blocks activation regardless of aggregate score (synthesis §9): a negative decision carrying a target/tool/authority, an exact route emitting recovery artifacts, a request observing mixed generations, a `hash` mismatch against the pinned tuple, or a singular evaluation calling ranking/bundle/handoff machinery.

## RELATED DOCUMENTS
- **Build approach**: see `plan.md`
- **Task breakdown**: see `tasks.md`
- **Source design**: `../../006-unified-refactor-research/unified-refactor-synthesis.md` (§2.3, §4 seam A, §8.2, §6, §5, §9)
- **Master plan / phase map + shared gate model**: `../spec.md`
- **Upstream contracts**: `../000-contract-schemas/` (schemas), `../001-compiler-n1-shadow/` (CompiledPolicy + projections)
- **Downstream consumers**: `../003-execution-verify-commit/`, `../004-recovery-ladder/`, `../005-calibration/`, `../006-parent-hub-rollout/`
