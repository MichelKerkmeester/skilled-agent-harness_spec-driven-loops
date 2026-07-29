---
title: "Feature Specification: Deep Review - Rollback & Mode Gate"
description: "Plan the Deep Review rollback switch and independent migration gate over the typed event-ledger path: fail-closed authority control, a bounded rollback window, shadow-parity acceptance, sealed artifacts, certificate evidence, and the scope-to-report handoff without moving runtime authority."
trigger_phrases:
  - "Deep Review rollback and mode gate"
  - "deep-review authority rollback switch"
  - "deep-review migration gate"
  - "deep-review shadow parity cutover readiness"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T20:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped the Deep Review rollback switch and independent mode gate"
    next_safe_action: "Freeze rollback window and gate evidence against shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which phase-012 control record carries the authoritative cutover arm and rollback window?"
      - "Which health alarms require immediate rollback instead of a bounded observation period?"
      - "Which phase-014 consumer names the mode-gate certificate and its expiry policy?"
    answered_questions:
      - "This phase plans the Deep Review switch and gate, not the shared loop backbone"
      - "A malformed or stale authority control resolves to legacy authority"
      - "Shadow parity, sealed artifacts, and a verified certificate are independent gate inputs"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Review - Rollback & Mode Gate

> Phase adjacency under `002-deep-review` (independent planning contracts, not a hard runtime dependency): predecessor `006-shadow-parity`; successor: none (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/007-rollback-and-mode-gate |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Implemented |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop / deep-review |
| **Origin** | Deep Review mode migration after the typed schema, reducers, sealed artifacts, certificates, resume adapter, and shadow-parity siblings |
| **Depends on** | `001-typed-ledger-schema`, `002-reducers-and-projections`, and `003-sealed-artifacts` are LANDED as additive-dark, non-authoritative substrate; sibling adjacency remains navigation rather than authority |
| **Consumes** | Planned certificate/receipt, resume-adapter, and phase-009 shadow-parity evidence from `004` through `006`, plus the real transition gateway and fencing coordinator |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep Review has a defined lifecycle: scope resolution, one fresh-context pass per review dimension, candidate findings and
independent adjudication, convergence and blocked-stop handling, synthesis, `review-report.md`, and continuity handoff. The
legacy implementation owns that lifecycle through JSONL state, iteration artifacts, reducer projections, findings, dashboard,
and report files. The migration adds a typed ledger path, but a parity result alone does not say whether the mode can be
operated safely during a later authority transition or restored if the new path becomes unhealthy.

The program requires additive-dark migration, shadow parity before authority movement, a bounded rollback window, and an
independent gate for each mode. The Deep Review research makes the gate evidence-sensitive: a pass emits candidates before
verdict-bearing P0/P1/P2 findings, impact is separate from confidence and evidence strength, a runtime difference is only a
witness until stability, causal proximity, and relevance checks pass, and cheap deterministic checks precede expensive
judging (`findings-registry-modes.json:2619-2876`; `findings-registry.json:2690-2970`). The existing loop also requires
coverage across dimensions and traceability protocols, nine legal-stop gates, fail-closed blocked stops, and a reproducible
report (`deep-review/SKILL.md:289-329,420-435`).

The schema, reducer/projection, and sealed-artifact leaves are already LANDED but remain additive-dark and non-authoritative.
This Planned leaf may consume those contracts and the later receipt, resume, and parity evidence, but none of those inputs
may move authority or bypass the real transition and fencing substrates.

This phase plans the mode-local **rollback switch** and **Deep Review mode gate**. The switch is an externally authorized,
fail-closed control that keeps legacy authority on any invalid, stale, or incomplete cutover input, records a bounded window
with a healthy rollback anchor, and restores the legacy path on a declared trigger. The gate is an independent evidence
contract that certifies this mode is migrated to shadow-ready status only when parity is green, all required artifacts are
sealed and verified, and the per-run certificate and receipts are emitted and independently verifiable. The gate is the
Deep Review exit gate into phase 014; it does not itself flip authority, retire legacy writers, or fork the shared review loop.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A Deep Review authority-control record with a fail-closed cutover toggle, explicit legacy/shadow/ledger posture, shared
  contract and gate-certificate digests, authority epoch, and one externally authorized rollback transition.
- A bounded rollback-window contract with both wall-clock and logical-operation bounds, a last-healthy sealed ledger tail,
  the corresponding legacy checkpoint, observed health state, rollback triggers, and expiry behavior.
- A rollback decision matrix covering parity differences, replay or schema mismatch, missing or invalid seals, receipt gaps,
  unknown effects, stale fences, target or contract drift, health degeneration, and unexpected canonical writes.
- An independent Deep Review gate for the complete `scope -> per-dimension passes -> P0/P1/P2 findings -> convergence ->
  review-report` lifecycle, with explicit pass, blocked, indeterminate, and deferred evidence outcomes.
- A gate evidence matrix consuming the typed schema, reducers and projections, sealed artifacts, certificates and receipts,
  resume decisions, and `006-shadow-parity` output without redefining those sibling contracts.
- A mode-gate certificate binding BASE, phase-012 shared review-loop contract digest, mode contract digest, event and reducer
  versions, sealed artifact manifest, parity receipt, run certificate, receipt root, replay fingerprint, rollback-drill
  evidence, gate result, and the next-phase handoff.
- Shared review-loop conformance with deep-alignment mode 008: shared scope, dimension, lineage, convergence, report, and
  write-set behavior is consumed from phase 012 rather than copied into a Deep Review-only state machine.
- Planning fixtures for valid gate evidence, missing evidence, stale evidence, parity drift, malformed switch state, rollback
  at every declared boundary, expired windows, and safe legacy fallback.
- An exception-safe caller boundary that authenticates the complete rollback request shape, guards every digest and validator
  invocation, snapshots validated primitives, and converts circular, non-finite, forbidden-prototype, or wrong-shape input
  into a typed denial rather than a thrown exception.
- Required phase-009 parity-receipt verification followed by independent readiness derivation through the real
  `TransitionAuthorizationGateway` and deterministic ledger replay.

### Out of Scope
- Implementing the phase-012 shared review-loop contract, typed ledger, transition gateway, replay fingerprint, sealing
  primitive, generic receipt service, or health detector.
- Rewriting the Deep Review event schema, reducers, projections, sealed artifact bindings, certificates, resume adapter, or
  shadow comparator owned by the six preceding sibling concerns.
- Moving runtime authority, deleting or retiring legacy writers, migrating in-flight state, or issuing the later authority
  cutover certificate; this phase defines the control and evidence consumed by that work.
- Adding review dimensions, changing P0/P1/P2 semantics, changing legal-stop thresholds, or weakening the nine gate bundle.
- Treating a final report, aggregate score, nominal parity count, or generic deep-loop green result as a substitute for the
  independent Deep Review gate.
- Hand-writing `description.json` or `graph-metadata.json` for this folder.
- Re-running the phase-009 parity harness inside this leaf, adopting its computed `exitStatus` as the gate verdict, or
  claiming authenticity for evidence classes that the accepted substrate boundaries leave to phase 014.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The authority-cutover toggle is never-throw and fails closed | Missing, stale, unauthorized, contract-mismatched, circular, non-finite, forbidden-prototype, non-plain, or wrong-shape caller input resolves to a typed denial and `legacy_authoritative`; every caller-controlled digest and validation site is guarded and no exception escapes the decision contract |
| REQ-002 | The rollback switch is external and auditable | A rollback is one authorized `ledger -> legacy` transition bound to mode, authority epoch, healthy anchor, reason, observed tail, gate state, and receipt; a local boolean cannot self-authorize or self-clear rollback |
| REQ-003 | The rollback window is bounded | The window has a start event, expiry deadline, maximum logical operations or attempts, last healthy sealed frontier, legacy checkpoint, and explicit expiry disposition; renewal requires a new authorized transition and evidence |
| REQ-004 | Rollback triggers preserve safety | Any unexplained semantic parity difference, replay mismatch, seal or receipt failure, unknown effect, stale fence, target or contract drift, integrity violation, health quarantine, or unexpected canonical write blocks promotion and invokes legacy fallback within the window |
| REQ-005 | Rollback does not erase evidence | The failed ledger tail, parity receipt, seal references, rollback reason, and legacy restoration receipt remain append-only and replay-addressable; rollback never truncates or rewrites the evidence ledger |
| REQ-006 | The mode gate covers the full Deep Review lifecycle | The gate matrix covers scope, each dimension pass, candidate emission, evidence and adjudication, P0/P1/P2 projection, convergence and blocked stop, synthesis, `review-report.md`, resume, and continuity handoff |
| REQ-007 | The phase-009 shadow-parity receipt is required evidence, not the verdict | The gate re-verifies receipt integrity, mode/frontier/manifest binding, and every typed disposition, ignores the receipt's computed `exitStatus` as authority, does not re-run the parity harness, and independently re-derives readiness through the real `TransitionAuthorizationGateway` plus deterministic ledger replay |
| REQ-008 | Sealed artifacts are complete and referentially verified | Every named cross-artifact reference is resolved and checked for expected KIND plus EPOCH, LIFECYCLE, freshness, real STATE, VISIBILITY/role redaction, and AUTHORITY liveness wherever the referenced artifact carries that property; existence or shape alone cannot pass |
| REQ-009 | Certificates and receipts are emitted and independently verifiable | The mode gate receives a verified run certificate, receipt-set closure, replay fingerprint, and certificate policy digest; process integrity is not overclaimed as semantic truth |
| REQ-010 | Deep Review reuses the shared review loop | The gate consumes phase-012 shared scope, dimension, lineage, convergence, report, and write-set contracts and records their digest; no Deep Review-local lifecycle fork can pass the gate |
| REQ-011 | The gate is independent from cutover and from other modes | Deep Review produces its own `PASS`, `BLOCKED`, or `INDETERMINATE` result and certificate; deep-alignment status, a generic mode count, or a shared dashboard cannot substitute for its evidence |
| REQ-012 | The gate handoff is phase-safe | A `PASS` certifies `MIGRATED_SHADOW_READY` and enables the phase-014 handoff only; it cannot set ledger authority, close the rollback window, remove legacy writers, or authorize another mode |
| REQ-013 | Request-field authentication is complete by construction | A closed request schema classifies every field as gateway-authenticated, independently re-derived, cross-checked against verified evidence, validated closed value, or deterministic constant; unknown or inert fields are rejected, and validated snapshots—not caller-owned objects—drive authorization and certificate emission |
| REQ-014 | Writer supersession and rollback anchoring use real evidence | The stale token must be a positive safe integer strictly below the coordinator's durable high-water mark and the rollback token newly issued for the canonical writer resource; the requested rollback anchor must equal the anchor in the independently re-verified migration certificate |

The authority-control record is resolved by a single fail-closed function over the requested posture, toggle, mode-gate
certificate, authority epoch, contract digests, rollback-window record, and current health witness. `legacy_authoritative` is
the safe result for an absent or invalid input. `shadow_non_authoritative` is allowed while parity evidence is collected.
`ledger_authoritative` is only a later consumer decision after an externally authorized cutover transition validates a current
Deep Review gate certificate; this phase never emits that transition.

The rollback window begins at the later cutover acceptance event, not at mode-gate PASS. It binds a last healthy ledger frontier
and matching legacy checkpoint, remains open only until the earlier of the declared deadline or logical-operation budget, and
returns to legacy authority on expiry unless a new authorized window is proven. A rollback trigger freezes new ledger-authoritative
work, records the observed state, selects the matching legacy checkpoint, verifies the legacy path, and emits a restoration
receipt. An unknown effect or unavailable checkpoint is `BLOCKED`, not an implicit successful rollback.

The mode gate passes only when all P0 evidence is present and independently verified: the shared contracts are digest-bound, the
full lifecycle has shadow parity, all required artifact references verify, the certificate and receipt chain closes, resume and
rollback fixtures are green, and the authority guard remains non-authoritative. A tolerated difference must have a typed
disposition, owner, reason, expiry, and proof of non-interference; it cannot be silently counted as parity.

Parity supplies mandatory evidence only. The gate first authenticates the phase-009 receipt and its bindings, then independently
replays the deterministic ledger and asks the real transition gateway to evaluate the locally re-derived evidence. A green
receipt `exitStatus` cannot become the verdict, and this leaf does not re-run the parity harness.

The complete rollback request is authenticated structurally before authorization. Every named reference must resolve through the
real substrate and satisfy its kind, epoch/lifecycle/freshness/state, visibility, and authority obligations. Stale-writer denial
compares the caller-attested predecessor token with the coordinator's durable high-water mark and newly issued rollback token;
rollback anchoring compares the request with the re-verified migration certificate. The accepted provenance limits are carried
forward from the golden leaf's [decision record](../../001-deep-research/007-rollback-and-mode-gate/decision-record.md), especially
its retained-store observation, lifecycle-label semantics, health/resume/window/risk authenticity, and historical lease-identity
boundaries. Their provenance must be verified before propagation, and phase 014 must verify those sources before treating the
readiness certificate as sufficient.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A malformed, stale, unauthorized, or incomplete authority-control record resolves to legacy authority and leaves an auditable refusal.
- **SC-002**: The rollback switch has one externally authorized inverse transition, a healthy anchor, a bounded wall-clock and logical-operation window, and deterministic expiry behavior.
- **SC-003**: Every declared rollback trigger restores or blocks before unsafe ledger authority continues, while preserving the failed tail and restoration evidence.
- **SC-004**: The Deep Review gate covers the complete scope-to-report loop, resume, and continuity handoff and does not infer readiness from another mode or a generic status.
- **SC-005**: Shadow parity is green with zero unexplained semantic differences on the required fresh, dimension, candidate, adjudication, convergence, synthesis, resume, and handoff fixtures.
- **SC-006**: Required Deep Review artifacts are sealed and verified, and a run certificate plus complete receipt chain is independently verifiable from pinned inputs.
- **SC-007**: The gate emits a mode certificate with `MIGRATED_SHADOW_READY` and phase-014 handoff evidence without moving authority or retiring legacy writers.
- **SC-008**: Deep Review consumes the phase-012 shared review-loop contract used by deep-alignment and records the contract digest and write-set fence in its gate evidence.
- **SC-009**: Malformed caller objects never escape as exceptions; complete request authentication, reference-integrity checks, independent gateway/replay derivation, strict coordinator supersession, and certificate-anchor equality all fail closed with typed evidence.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Fail-open cutover** - an absent toggle, stale certificate, or permissive environment value could select the ledger path.
  Mitigation: default every invalid control result to legacy authority and require an external transition-authorization receipt.
- **Unbounded rollback** - a rollback window measured only by time can remain unsafe during retries, handoffs, or slow effects.
  Mitigation: bind both a deadline and a logical-operation or attempt budget to a sealed healthy anchor.
- **Self-authorized recovery** - the failing review lineage could clear its own quarantine or select its own recovery path.
  Mitigation: keep rollback authority in the shared transition kernel and treat the mode switch as an externally authorized event.
- **False parity** - matching reports can hide event-order, evidence, candidate, adjudication, resume, or receipt drift.
  Mitigation: require event-for-event and projection fingerprints across the complete lifecycle with a narrow volatility allowlist.
- **Certificate overclaim** - a process certificate could be read as proof that every P0/P1/P2 finding is semantically true.
  Mitigation: bind raw observations, independent adjudication, evidence dimensions, and declared unresolved states without collapsing them.
- **Seal or receipt gaps** - an unsealed target, missing receipt, or unknown effect can pass through a report-only gate.
  Mitigation: make artifact verification and receipt closure P0 gate inputs and return blocked on missing or ambiguous evidence.
- **Review/alignment fork** - separate Deep Review and deep-alignment loops would drift in scope, convergence, or report semantics.
  Mitigation: consume the frozen phase-012 shared review-loop contract and the write-set fence rather than defining local lifecycle rules.
- **Cutover scope leakage** - a mode gate could accidentally flip authority, close rollback, or remove legacy writers.
  Mitigation: constrain the output to `MIGRATED_SHADOW_READY`; reserve authority and retirement for later phases.
- **Provenance overclaim** - a well-formed health aggregate, historical lease tuple, retained count, resume bundle, or
  rollback-window history could be mistaken for substrate-authenticated evidence. Mitigation: preserve the golden 007
  decision-record boundaries and require phase-014 correlation against the real stores and coordinator history.
- **Dependencies**: the 036 parent and phase tree; phase-012 shared mode interfaces, cross-mode closures, mixed-version fixtures,
  and write-set conflict graph; the phase-006 ledger and authorization spine; LANDED additive-dark siblings `001` through `003`;
  planned evidence inputs `004` through `006`; the existing Deep Review
  lifecycle and blocked-stop fixtures; the mode research registries; and the spec-kit validator.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which phase-012 transition token and authority epoch fields are mandatory for the Deep Review cutover arm and inverse rollback event?
- Does the shared health witness expose one canonical quarantine trigger, or must the mode gate bind a typed set of health alarm classes?
- Which logical-operation counter is the rollback-window budget: transitions, effects, review passes, or the shared root lease debit?
- What exact phase-014 handoff schema consumes `MIGRATED_SHADOW_READY`, and which certificate expiry is checked before a later cutover request?
- Which rollback fixture proves legacy restoration when an external effect is `unknown` and the legacy checkpoint is available but the ledger tail is not finalized?

These decisions are resolved against the frozen shared contracts and the pinned baseline during implementation planning. They do not
authorize a local review-loop fork, a fail-open fallback, an unbounded window, an authority change, or legacy-writer retirement.
<!-- /ANCHOR:questions -->
