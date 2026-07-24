---
title: "Implementation Summary: sk-code Per-Hub Canary"
description: "Compiled surfaceBundle canary, authority fences, real route-gold proof, and byte-exact rollback evidence."
trigger_phrases:
  - "sk-code canary implementation summary"
  - "surfaceBundle canary results"
  - "sk-code stage-4 handoff"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: sk-code Per-Hub Canary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented; phase harness and certificate gate GREEN; strict packet validation blocked |
| **Date** | 2026-07-19 |
| **Level** | 2 |
| **Serving authority** | Legacy; candidate remains shadow-only |
| **Strict validation** | Run; baseline package-runtime, metadata, anchor, and template failures remain outside the authorized edit boundary |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The phase now contains a zero-dependency compiler and canary router for the real `sk-code` hub
shape. The compiler reads the live authored registry and hub policy as immutable inputs, derives
workflow destinations as actors and surface packets as evidence, and emits canonical policy,
advisor, alias, policy-card, route-gold, and activation artifacts. The compound destination
identity retains `skillId`, `workflowMode`, `packetId`, `packetKind`, and `backendKind`; authority
is derived from `packetKind`, never from a destination's claim (synthesis §§2.1–2.3, 7).

The reference request produces one `surfaceBundle` route with the actor first and Webflow evidence
second only after the selective controller validates a live certificate against the request-pinned
policy generation and `actor:mutating:composite` risk slice. The evaluator supplies ordered
candidates and non-authority rank evidence; the controller emits the frozen decision and returns
calibration evidence out-of-band. Missing, stale, policy-mismatched, and risk-mismatched handles
abstain to `clarify`. The N=1 path resolves directly with no certificate, ranking, or threshold call
(synthesis §3 Idea 5, §4 recovery ladder rung 2, §5).

Advisor data remains evidence-only, negative outcomes have no target authority, and document replay
reads the generated card snapshot without a machine-policy fallback. Document parity compares the
decision action, selection, targets, basis, and authority while leaving runtime rank and certificate
evidence outside the document-only claim (synthesis §§8.1–8.3).

### Files Delivered

| Area | Files | Purpose |
|------|-------|---------|
| Compiler/router | `lib/registry-compiler.cjs`, `lib/canary-router.cjs` | Authored-input compilation and typed local decisions |
| Authority/card | `lib/execution-fence.cjs`, `lib/policy-card.cjs` | Actor/evidence lifecycle fence and document-only policy |
| Activation | `lib/activation-gate.cjs`, `activation/*.json` | Hard-block gate, accepted candidate, retained prior, fenced state |
| Fixtures/harness | `fixtures/canary-cases.v1.json`, `harness/*.cjs` | Certificate fixtures, bypass falsifier, external decision oracle, and Stage-4 validation |
| Generated snapshot | `compiled/*` | Canonical policy, advisor projection, route gold, and PolicyCardV1 |
| Documentation | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Current status, evidence, verification, and limitations |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Compilation binds raw authored bytes to their independently computed hashes before parsing. A
second compile from the same registry and hub bytes must equal the generated canonical snapshot;
passing a caller-authored object that does not match those bytes is rejected. Canonical hashing
comes from the frozen phase-`000` library. The route shape and structural decision checks come from
the frozen phase-`002` evaluator. Positive evaluator results are adapted into the frozen selective
controller's exact input contract: request-pinned policy/risk identity, ranked candidates with rank
evidence, an external certificate handle, and the phase-`004` shared uncertainty budget. Execution
continues to use phase `003` PREPARE→VERIFY→COMMIT.

The certificate handle is never embedded in `RouteDecisionV1`. The validated route carries only
non-authority rank evidence and `WithheldUntilVerify`; the controller returns
`CalibrationEvidenceEnvelopeV1`-compatible evidence beside the decision. This preserves
destination-local authority while enforcing calibrated auto-route exactly at recovery rung 2
(synthesis §3 Idea 5, §4 recovery ladder rung 2, §5).

The activation lane snapshots every candidate artifact and the retained prior manifest. Ship first
checks the expected prior generation/hash, then uses a token lock and rechecks its fencing epoch
immediately before atomic rename. The fixture performs an actual phase-local swap, rejects a mixed
generation observation, and CASes back to byte-identical retained bytes. It does not flip a live
router; legacy remains serving-authoritative (synthesis §§9–10).

The Stage-4 route-gold lane calls the real read-only `evaluateRouteGold` on five real-hub typed
scenarios. Expected gold is authored independently of projected observations, and a deliberate
observation corruption fails. This avoids projection-to-self comparison and leaves all scorer
files untouched (synthesis §8.2).

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Derive role and mutation from `packetKind` | `workflow → actor/true` and `surface → evidence/false` prevent a destination from self-declaring authority (synthesis §§2.1–2.2, 7). |
| Keep `selectionKind` inside `route` | Composition stays distinct from control flow, so clarify/defer/reject cannot carry route targets (synthesis §2.3). |
| Order targets for loading, not effects | The actor is loaded first and surfaces follow as read-only evidence; this does not grant evidence effect order or commit authority (synthesis §7). |
| Reuse the frozen compatibility projector and real scorer | The legacy observation contract stays stable and route-gold remains an external verdict rather than a self-oracle (synthesis §8.2). |
| Treat advisor status as evidence state | Only live identity-matched data may rank; stale or drifted data annotates and absent/unavailable data contributes zero (synthesis §8.1). |
| Gate every positive canary route through the selective controller | The evaluator ranks and composes, but only the controller can license a multi-candidate signal route with a certificate bound to the pinned policy generation and risk slice (synthesis §3 Idea 5, §4 recovery ladder rung 2). |
| Keep certificate evidence out-of-band | A certificate proves calibration legality; it does not become destination authority or widen the frozen `RouteDecisionV1` shape (synthesis §§2.3, 10). |
| Constant-fold N=1 calibration | A one-candidate exact route has nothing to calibrate, so the controller forbids certificate resolution and makes zero rank or threshold calls (synthesis §5). |
| Generate the PolicyCard from the compiled snapshot | Machine and document replay share identity, hashes, grammar, and authority edges; planted divergence fails closed (synthesis §8.3). |
| Retain legacy authority through this phase | Stage 4 proves the canary and rollback primitive without widening to a live serving flip (synthesis §9). |
| Fence activation with preimage CAS | Candidate self-description cannot authorize replacement; expected prior generation/hash and the current fencing epoch must match immediately before rename (synthesis §§9–10). |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Gate | Result | Evidence |
|------|--------|----------|
| Canonical compile | Pass | Four destinations; byte-identical recompile; external-source mismatch rejected |
| Reference bundle | Pass | `surfaceBundle [code-review(actor), code-webflow(evidence)]` |
| Certificate gate | Pass | Valid identity-bound certificate `dd5e53e2…e1a3` routes; absent, stale, policy-mismatched, and risk-mismatched handles clarify |
| Gate falsifier | Pass | The identical no-certificate request sent directly to the evaluator reverts to `route(surfaceBundle, basis:signal)` |
| External decision oracle | Pass | Certified, four abstention, and N=1 decisions reparse byte-equivalently through the frozen `decision-contract` validator |
| N=1 constant fold | Pass | `route(single)`, unvalidated calibration, zero rank calls, zero threshold calls |
| Real route-gold | GREEN | 5/5 typed rows pass real `evaluateRouteGold`; corrupt observation fails |
| Authority lifecycle | Pass | Evidence VERIFY rejects; evidence COMMIT `ROLE_CANNOT_COMMIT`; actor path exactly PREPARE→VERIFY→COMMIT |
| Aggregate hard blocks | Pass | All seven blocks driven with specific activation and structural refusal codes |
| Advisor guard | Pass | Live match ranks; stale/absent/unavailable/drift cannot rewrite the route |
| No-over-emission | Pass | Zero signal and surface-only defer; ambiguity clarifies once from authored checklist |
| Document parity | Pass | 5/5 decision semantics match with rank/certificate evidence out-of-band; planted divergence rejected; terminal is document-only unattested |
| Rollback | Pass | Prior/restored hashes byte-identical; final fencing epoch 2; mixed pins refused |
| Dual read | Pass | 29 aliases resolve; unknown alias fails closed; projection drift detected |
| Static constraints | Pass | Seven code files; zero external dependencies, name branches, or comment violations |
| Serving state | Pass | `legacy`, `shadowOnly: true` |

Protected scorer inputs after the final Stage-4 run:

- `router-replay.cjs`: `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47`
- `score-skill-benchmark.cjs`: `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`
- `load-playbook-scenarios.cjs`: `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029`

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. This phase proves Stage 4 through the real scorer and real `sk-code` typed scenarios, but it does
   not replace the live serving producer. Legacy intentionally remains authoritative and the
   candidate manifest stays shadow-only.
2. The fixture set has five decision rows. It covers the required bundle, single, clarify, defer,
   and reject branches plus four certificate-gate cases and separate advisor, authority, hard-block,
   and rollback matrices; it is not an exhaustive natural-language corpus.
3. The authoritative `spec.md` defines `REQ-001` through `REQ-009`; there is no `REQ-010` entry to
   implement or mark complete. No requirement was invented to fill that numbering gap.
4. Git was forbidden, so protected-file digest equality replaces a git-diff check. Strict packet
   validation was run and remains red for baseline missing generated package runtime files, missing
   local `tsx`, legacy anchor/template structure, and pre-existing metadata shape. Repairing those
   failures requires writes outside this phase or structural spec/plan/tasks edits that were not
   authorized.
5. Generated `description.json` and `graph-metadata.json` were not manually refreshed. Their
   lifecycle belongs to the orchestrator's packet indexing/validation path; authored status docs
   carry the phase-local implementation result.

<!-- /ANCHOR:limitations -->
