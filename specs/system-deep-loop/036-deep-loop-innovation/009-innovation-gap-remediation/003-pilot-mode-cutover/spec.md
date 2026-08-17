---
title: "Feature Specification: Pilot Mode Authority Cutover"
description: "Plan the deep-research pilot that wires the authority-flip coordinator into its production composition root behind a rollback window, requires shadow parity before cutover, and proves five production boundaries."
trigger_phrases:
  - "pilot mode authority cutover"
  - "deep-research production authority flip"
  - "five-boundary cutover test"
importance_tier: "important"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/003-pilot-mode-cutover"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "opencode"
    recent_action: "Authored the planned deep-research pilot authority-cutover contract"
    next_safe_action: "Confirm predecessor gates and inventory the production composition root"
    blockers:
      - "Predecessor 002-substrate-identity-fail-closed must pass before live wiring"
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-selector.ts"
    completion_pct: 0
    open_questions:
      - "Which shared construction seam owns both deep-research command variants?"
      - "What rollback-window duration and open-window policy will the operator approve?"
    answered_questions:
      - "The pilot mode is deep-research because the frozen program order names it first"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Pilot Mode Authority Cutover

> Phase adjacency under `009-innovation-gap-remediation`: predecessor `002-substrate-identity-fail-closed`; successor `004-fleet-authority-cutover`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/003-pilot-mode-cutover |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-14 |
| **Owner skill** | system-deep-loop |
| **Origin** | Third child of the innovation-gap-remediation packet |
| **Depends on** | `002-substrate-identity-fail-closed` |
| **Pilot mode** | `deep-research`, the first mode in the frozen cutover order (`../../goal.md:326-343`) |
| **Authority posture** | Legacy remains authoritative until shadow parity, predecessor gates, explicit operator approval, and the recoverable cutover transaction all pass |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The authority-flip substrate is implemented but deliberately dark. The coordinator states that it is not invoked
against a real mode registry or ledger and that every package call site is a unit test
(`.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:5-11`). The canonical
selector likewise says no live adapter consults it
(`.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-selector.ts:5-8`). The implementation
record independently confirms that no mode adapter imports the package
(`../../003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/implementation-summary.md:119-129,169-173`).
Consequently, the program has verified unit mechanisms without production composition evidence or one live mode whose
canonical writes are selected by the durable typed-event-ledger authority record.

This phase closes the first production slice for `deep-research`. The choice is grounded in the program's frozen mode
order, where `deep-research` is the first cutover candidate (`../../goal.md:326-343`). The current production surfaces
are confirmed rather than guessed: both deep-research command manifests invoke the packet-local reducer
(`.opencode/commands/deep/assets/deep-research-auto.yaml:889-899` and
`.opencode/commands/deep/assets/deep-research-confirm.yaml:790-818`), and the reducer resolves and writes the mode's
canonical packet-local state surfaces
(`.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2902-2930,3044-3063`). These facts establish
the production boundary to inventory, but they do not establish a coordinator construction symbol. Implementation must
identify the one shared construction seam used by both command variants before editing it.

The pilot will construct the existing `AuthorityFlipCoordinator` with deployment-resolved identity, policy, registry,
and ledger dependencies; require current shadow-parity evidence before `requestCutover`; and make the existing
`selectAuthorityRoute` decision govern canonical admission and persistence at the confirmed mode root. The cutover
must remain reversible during a declared window. A production-boundary test must exercise selector admission, durable
intent persistence, real producer death, fresh-process restart, and authority compare-and-swap plus rollback against
that same root. The gap brief's `0/72` composition-evidence and empty production-matrix claims are treated as inferred
planning inputs because those iteration measurements were not uniquely identifiable from the supplied paths. The
persisted recommendation ledger does confirm that 72 adopted recommendations were assigned to phase 013
(`../../001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/implementation-summary.md:98-103,125-135`);
implementation must take a fresh composition and matrix baseline before claiming any delta.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Freeze `deep-research` as the only pilot mode and inventory the shared production construction seam used by its auto
  and confirm command roots. The inventory must name actual imports, constructors, durable roots, writer paths, and
  rollback entry points before implementation begins.
- Wire one production composition root to construct the existing `AuthorityRegistry`, transition-authorization gateway,
  policy registry, deployment identity resolver, ledger, and `AuthorityFlipCoordinator`; no test-only temporary root may
  stand in for the production wiring.
- Require a current, mode-bound, zero-divergence shadow-parity result before a cutover request can reach the coordinator.
  The per-mode authority contract already makes parity a hard precondition
  (`../../003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/spec.md:69-74,121-129`).
- Apply `selectAuthorityRoute` at the pilot's canonical admission and persistence boundary. Legacy remains canonical in
  legacy, shadow, and cutover-ready states; dark becomes canonical only in the reversible authority state; selector
  denial admits neither writer (`.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-selector.ts:62-109`).
- Persist the exact forward-cutover intent before the ledger append and recover it after producer death. The existing
  registry contract captures the complete pending transition for disk-only recovery
  (`.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-registry.ts:90-113,428-452`).
- Open a declared rollback window after the pilot flips, preserve the legacy path and rollback assets throughout it,
  and wire the existing deep-research rollback gate to the same durable authority record. The reverse registry edge
  restores legacy at a new epoch and denies admission while rollback is pending
  (`.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-registry.ts:325-403`).
- Add one production-boundary integration matrix for the actual deep-research root with five named boundaries:
  selector admission, intent persistence, producer death, fresh-process restart, and authority CAS plus rollback.
- Run a live-path rollback drill in the isolated production-shaped test environment and record the measured restoration
  time against the declared rollback window. Production operator approval remains a separate explicit stop.

### Out of Scope
- Cutting over any mode other than `deep-research`, changing the frozen eight-mode order, or beginning the successor
  fleet rollout.
- Retiring legacy writers, deleting rollback assets, closing the fleet's rollback windows, or making dark authority final.
- Reimplementing the coordinator, authority selector, registry CAS, transition gateway, deep-research rollback gate,
  shadow-parity framework, or typed event ledger when the existing contract can be composed.
- Treating unit tests, a test-only constructor, a verifier-only rollback certificate, or a temporary registry root as
  production composition evidence.
- Choosing an implementation symbol for the production construction seam before the current auto/confirm root inventory
  proves where one shared dependency graph can be installed.
- Proceeding past the operator approval stop or changing real operator authority state as part of automated tests.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The pilot uses one verified production composition root | A fresh inventory proves the shared construction seam used by both deep-research command variants; the coordinator and selector are instantiated from that seam with production-resolved durable roots and dependencies, and no unit-test helper or temporary root is the serving path |
| REQ-002 | Predecessor identity and lock controls fail closed | Before wiring can activate, `002-substrate-identity-fail-closed` proves deployment identity resolution, policy binding, append fencing, and fresh lock ownership at the exact pilot root; absent, null, partial, stale, or mismatched identity denies before a durable authority write |
| REQ-003 | Shadow parity is a hard flip precondition | The exact pilot candidate presents current mode-bound parity evidence with zero open divergences and matching candidate, BASE, contract, input, comparator, and projection identities; any absent, stale, partial, or wrong-mode evidence leaves legacy authoritative |
| REQ-004 | Selector admission is authoritative at the mode boundary | Every canonical deep-research admission and persistence attempt reads the durable authority record and applies `selectAuthorityRoute`; legacy states select only legacy, reversible dark authority selects only the ledger path, and any denial or rollback-pending state admits neither writer |
| REQ-005 | Cutover intent is durable before authority publication | The exact expected-state/epoch CAS input is persisted before the authority-transition event append; a missing or malformed marker fails closed, and a restart can complete or abort the transition from durable registry and ledger facts without the original request object |
| REQ-006 | Producer death cannot create split authority | A real child process is terminated at every declared cutover fault boundary, including after intent persistence and after ledger append but before registry CAS; verified recovery yields one transition event, one monotonic epoch, one selected writer, and no duplicate or unauthorized effect |
| REQ-007 | Fresh-process restart recovers from durable facts | A newly started process with no in-memory state opens the production-shaped roots, reconciles pending intent against verified ledger events, selects the same authority route, and either resumes the exact transition or fails closed on conflicting durable facts |
| REQ-008 | Authority CAS and rollback use one durable record | The forward CAS changes only deep-research from `cutover_ready(N)` to `new_authoritative_reversible(N+1)`; the rollback path moves through `rollback_pending` and restores `legacy_authoritative` at a newer epoch while stale dark and stale legacy writers are denied |
| REQ-009 | The rollback window is declared, measured, and enforceable | Before cutover, the operator-facing plan declares the duration, health triggers, maximum simultaneous open windows, rollback assets, and restoration-time objective; the drill restores a successful legacy write within that window and retains all ledger events and receipts |
| REQ-010 | The blast radius remains one mode | During positive, crash, restart, CAS-conflict, and rollback tests, every non-pilot authority record and canonical route remains byte-identical and legacy-authoritative; no fleet cutover task can start from this phase |
| REQ-011 | Production evidence is candidate-bound and reproducible | The five-boundary matrix and rollback drill record the exact candidate, BASE, mode, source and restored epochs, policy and certificate digests, commands, process exits, before/after heads, elapsed restoration time, and tracked-mutation result |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The deep-research production composition root, not a unit fixture, constructs the authority-flip
  dependencies and applies the durable selector at canonical admission and persistence.
- **SC-002**: Current shadow-parity and predecessor identity/lock evidence are mandatory; every missing, stale, partial,
  or mismatched input leaves the pilot legacy-authoritative with zero authority mutation.
- **SC-003**: One approved pilot cutover produces exactly one authorized transition event, advances exactly one epoch,
  selects the typed event ledger only for deep-research, and opens the declared rollback window.
- **SC-004**: The five-boundary production matrix is green for selector admission, intent persistence, real producer
  death, fresh-process restart, and authority CAS plus rollback.
- **SC-005**: The rollback drill restores legacy authority at a newer epoch within the declared window, completes a
  legacy canary write, preserves events and receipts, and rejects stale dark and stale legacy writers.
- **SC-006**: Every non-pilot mode remains byte-identical and legacy-authoritative throughout the cutover and rollback.

**Given** the deep-research candidate has current predecessor, mode-gate, parity, migration, and rollback evidence,
**When** the production composition root admits the operator-approved cutover request, **Then** it persists the intent,
authorizes and appends one transition event, publishes one CAS result, and routes only deep-research to the typed ledger.

**Given** shadow parity is absent, stale, divergent, or bound to another candidate, **When** cutover is requested,
**Then** legacy remains authoritative, no pending intent or transition event is committed, and the denial is recorded.

**Given** the producer dies after intent persistence or ledger append, **When** a fresh process starts against the same
durable roots, **Then** it reconciles from the marker, ledger, and registry without duplicate events or split authority.

**Given** deep-research is dark-authoritative inside its open rollback window, **When** the rollback drill triggers,
**Then** admission freezes, the dark writer is fenced, legacy is restored at a new epoch within the declared window, a
legacy canary succeeds, and stale capabilities are denied.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The hard predecessor is `002-substrate-identity-fail-closed`. This phase may inventory and test the root before that
packet completes, but it may not enable cutover wiring until the predecessor proves deployment identity resolution,
policy binding, append fencing, and lock publication against the same production boundary. This is necessary because
the generic gateway only checks identity when an `identityResolver` is configured
(`.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:747-751`), while
the coordinator requires a resolver that pins actor and capability and denies null or mismatched results
(`.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:61-81,291-317`). The
identity-hardening summary confirms that no production gateway construction site configured the optional resolver at
that review point
(`../../006-runtime-docs-and-integrity-hardening/011-identity-and-lock-ownership-hardening/implementation-summary.md:64-68`).

The highest integration risk is wiring only one command variant or only the reducer while another canonical writer
bypasses selection. The mitigation is a current producer/consumer census and a single shared construction seam proved
by positive and negative tests through both auto and confirm roots. A second risk is false confidence from callback
fault injection. The production matrix must terminate a real process and restart a new one, matching the program's
explicit crash-test requirement (`../../goal.md:213-222`). A third risk is split authority between the durable ledger
event and registry CAS. The coordinator's persisted intent and reconciliation path are reusable
(`.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:142-147,256-280,345-409`),
but the production test must prove them through the actual root.

Other risks are stale parity opening authority, selector caching past an epoch change, a rollback certificate that does
not mutate the canonical authority record, an unbounded rollback window, stale writers surviving a route change, test
fixtures touching operator state, and non-pilot modes sharing a backend that broadens blast radius. Mitigations are
fresh candidate-bound evidence, selector checks at admission and persistence, the same durable record for forward and
reverse CAS, isolated production-shaped roots, byte-identity checks for non-pilot records, and an explicit operator stop
before any real authority transition. The successor `004-fleet-authority-cutover` depends on this phase's complete
matrix and rollback evidence; this phase does not authorize fleet execution.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. Which current module should own the one shared deep-research production dependency graph used by both auto and
   confirm command manifests? The manifests and reducer are confirmed surfaces, but no live coordinator construction
   symbol exists yet. A fresh import/write-path census must answer this before implementation.
2. What rollback-window duration, restoration-time objective, health thresholds, and maximum number of simultaneously
   open windows will the operator approve for the pilot? The safe default remains one open window, but the phase cannot
   claim acceptance until the concrete policy is declared.
3. Which exact candidate SHA, BASE SHA, operator identity, and deployment-resolved actor/capability values will bind the
   pilot request? These are execution-time facts and must be frozen immediately before the approval stop.
<!-- /ANCHOR:questions -->
