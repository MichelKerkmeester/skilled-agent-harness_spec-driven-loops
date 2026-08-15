---
title: "Feature Specification: Deep Alignment - Rollback & Mode Gate"
description: "Plan the Deep Alignment rollback switch and independent migration gate over the typed event-ledger path: fail-closed authority control, a bounded rollback window, per-lane shadow parity, sealed conformance evidence, certificate closure, and the phase-014 handoff without moving runtime authority."
trigger_phrases:
  - "Deep Alignment rollback and mode gate"
  - "deep-alignment authority rollback switch"
  - "deep-alignment migration gate"
  - "deep-alignment shadow parity cutover readiness"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/008-deep-alignment/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/008-deep-alignment/007-rollback-and-mode-gate"
    last_updated_at: "2026-08-15T16:12:18Z"
    last_updated_by: "codex"
    recent_action: "Verified the cited suite and reconciled closeout evidence"
    next_safe_action: "No leaf-local closeout action remains"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "This phase plans the Deep Alignment switch and gate, not the shared review-loop backbone"
      - "Invalid authority material resolves to legacy authority"
      - "Shadow parity, sealed artifacts, and certificate closure are independent gate inputs"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Alignment - Rollback & Mode Gate

> Phase adjacency under `008-deep-alignment` (independent planning contracts, not a hard runtime dependency): predecessor `006-shadow-parity`; successor: none (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/008-deep-alignment/007-rollback-and-mode-gate |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop / deep-alignment |
| **Origin** | Phase 013 Deep Alignment migration after typed schema, reducers, sealed artifacts, certificates, resume adapter, and shadow-parity siblings |
| **Depends on** | `001-typed-ledger-schema`, `002-reducers-and-projections`, and `003-sealed-artifacts` are LANDED as additive-dark, non-authoritative substrate; sibling adjacency remains navigation rather than authority |
| **Consumes** | Landed certificate/receipt, resume-adapter, and required phase-009 shadow-parity evidence from `004` through `006`, plus the real transition gateway and fencing coordinator |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep Alignment has a distinct verify-first lifecycle: `INIT` binds the run, `SCOPE` resolves lanes as authority x artifact class x scope,
`DISCOVER` finds the lane corpus, `ITERATE` checks artifacts and re-verifies every finding against live ground truth, `CONVERGE`
requires coverage and stability, and `REPORT` emits one result per lane. Read-only operation is the default and `REMEDIATE` is a
separate opt-in state (`.opencode/skills/system-deep-loop/deep-alignment/SKILL.md:251-268`). The mode therefore cannot treat a
matching final report or a generic loop health result as proof that the named authority, applicability decisions, evidence chain,
and per-lane findings remain safe to operate after migration.

The migration adds a typed event-ledger path beside the legacy JSONL and report path. A parity result alone does not establish that
authority material was compiled, pinned, authorized, and replayed correctly, that known deviations remain visible, or that an
unknown effect can be recovered without allowing the failing alignment lineage to judge its own recovery. The research requires an
authority capsule to pass parse, type, capability, rule-test, coverage, revision, and signature checks before conformance is valid;
it also requires applicability before verification, proof-carrying findings, content-bound receipts, authority epochs, compatibility
classes, and separate certificate fields for claims, counterclaims, evidence, assessor, conformance, and confidence
(`findings-registry-modes.json:3434-3666`).

The program requires additive-dark migration, shadow parity before authority movement, a bounded rollback window, and an
independent gate for each mode. This phase plans the mode-local **rollback switch** and **Deep Alignment mode gate**. The switch is
an externally authorized, fail-closed control that retains legacy authority for invalid, stale, expired, or incompatible control
material, records a bounded window with a sealed healthy anchor, and restores the legacy path on a declared trigger. The gate is an
independent per-lane evidence contract that certifies this mode is migrated only when shadow parity is green, required artifacts are
sealed, verifier and authority provenance are pinned, and the certificate and receipt chain close. This is planning only: it is the
mode exit gate into phase 014 and does not flip authority, retire legacy writers, migrate in-flight state, or fork the shared
review-loop backbone used by Deep Review mode 002.

The schema, reducer/projection, and sealed-artifact leaves are already LANDED but remain additive-dark and non-authoritative.
This completed leaf consumes their contracts and the later receipt, resume, and parity evidence without allowing any predecessor
output to become an authority decision.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A Deep Alignment authority-control record with a fail-closed legacy/shadow/ledger posture, authority epoch, named-authority and
  verifier digests, phase-012 shared review-loop digest, mode-gate certificate reference, health witness, and one externally
  authorized rollback transition.
- A bounded rollback-window contract with wall-clock and logical-operation or attempt bounds, a last-healthy sealed ledger
  frontier, the matching legacy checkpoint, observed lane health, rollback triggers, and deterministic expiry behavior.
- A rollback decision matrix covering authority parse or signature failure, stale or mixed authority epochs, applicability drift,
  parity differences, replay mismatch, missing or invalid seals, receipt gaps, unknown effects, stale fences, contract drift,
  health degeneration, and unexpected canonical writes.
- An independent Deep Alignment gate for lane resolution, discovery coverage, verify-first checks, known-deviation adjudication,
  finding lifecycle, convergence, per-lane reports, resume decisions, continuity handoff, and explicit remediation exclusion.
- A gate evidence matrix consuming typed schema, reducers and projections, sealed artifacts, certificates and receipts, resume
  decisions, and `006-shadow-parity` output without redefining those six sibling contracts.
- A mode-gate certificate binding BASE, the phase-012 shared review-loop contract digest, mode contract digest, event and reducer
  versions, lane configuration, authority capsule and verifier digests, applicability coverage, finding receipts, report outputs,
  parity receipt, receipt root, replay fingerprint, rollback-drill evidence, gate result, and phase-014 handoff.
- Shared review-loop conformance with Deep Review mode 002: scope, lane or dimension coverage, finding lineage, convergence,
  report, resume, and write-set behavior are consumed from phase 012 rather than copied into a Deep Alignment-only state machine.
- Planning fixtures for clean lane gates, missing or stale authority, unsupported applicability, known deviations, evidence gaps,
  parity drift, malformed switch state, rollback at effect boundaries, expired windows, unknown effects, and safe legacy fallback.
- An exception-safe caller boundary that authenticates the complete rollback request class, guards every caller-controlled digest
  and validator, snapshots validated primitives, and converts circular, non-finite, forbidden-prototype, non-plain, or wrong-shape
  input into a typed denial.
- Required phase-009 parity-receipt verification followed by independent readiness derivation through the real
  `TransitionAuthorizationGateway` and deterministic ledger replay.

### Out of Scope
- Implementing the phase-012 shared review-loop contract, typed ledger, transition gateway, replay fingerprint, sealing primitive,
  generic receipt service, health detector, or phase-014 generic shadow framework.
- Rewriting the Deep Alignment event schema, reducers, projections, sealed artifact bindings, certificates, resume adapter, or
  comparator owned by the six preceding sibling concerns.
- Moving runtime authority, deleting or retiring legacy writers, migrating in-flight state, issuing the later authority cutover
  certificate, or authorizing another mode.
- Forking the review-loop backbone from Deep Review mode 002, changing lane resolution, weakening verify-first or read-only rules,
  or adding new authorities and artifact classes.
- Treating a final alignment report, aggregate verdict, nominal coverage count, or generic deep-loop green result as a substitute for
  the independent Deep Alignment gate.
- Hand-writing `description.json` or `graph-metadata.json` for this folder.
- Re-running the phase-009 parity harness, adopting its computed `exitStatus` as the gate verdict, or claiming provenance beyond
  the substrate-handle boundaries accepted by the golden 007 decision record.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Authority control never throws and fails closed | Missing, malformed, stale, unauthorized, expired, mixed-version, digest-mismatched, circular, non-finite, forbidden-prototype, non-plain, or wrong-shape caller input resolves to `legacy_authoritative`; every caller-input digest and validator is guarded, and no exception or ledger result escapes through an environment fallback, prompt flag, or process-local state |
| REQ-002 | Rollback is external and auditable | A rollback is one authorized `ledger -> legacy` transition bound to mode, lane set, authority epoch, healthy anchor, observed tail, reason, gate state, and restoration receipt; a failing lane cannot self-authorize or self-clear it |
| REQ-003 | The rollback window is bounded | The window has a start event, expiry deadline, maximum logical operations or attempts, last healthy sealed frontier, legacy checkpoint, and explicit expiry disposition; renewal requires a new authorized transition and evidence |
| REQ-004 | Rollback triggers preserve safety | Authority invalidity, applicability drift, unexplained semantic parity difference, replay mismatch, seal or receipt failure, unknown effect, stale fence, contract drift, integrity alarm, health quarantine, or unexpected canonical write blocks promotion and invokes legacy fallback within the window |
| REQ-005 | Rollback preserves evidence | Failed ledger tails, lane parity receipts, authority and verifier references, known-deviation adjudications, seal references, rollback reason, and legacy restoration receipt remain append-only and replay-addressable |
| REQ-006 | The gate covers the full Deep Alignment lifecycle | The matrix covers lane resolution, discovery, applicability, per-artifact verification, finding re-probe, known-deviation disposition, convergence, per-lane report, resume, continuity, and the gated-remediation boundary |
| REQ-007 | Phase-009 shadow parity is required evidence, not the gate verdict | The gate re-verifies receipt integrity, mode/frontier/manifest binding, and typed dispositions, ignores the receipt's computed `exitStatus` as authority, does not re-run the parity harness, and independently re-derives readiness through the real `TransitionAuthorizationGateway` plus deterministic ledger replay |
| REQ-008 | Authority and artifact evidence are complete and referentially verified | Every named cross-artifact reference resolves through the real substrate to its expected KIND and, where present, matches EPOCH, LIFECYCLE, freshness, real STATE, VISIBILITY/role redaction, and AUTHORITY liveness; existence or shape alone cannot pass |
| REQ-009 | Findings remain verify-first and typed | Detector candidates, live re-probe results, severity, confidence, evidence strength, conformance, applicability, unresolved state, and known-deviation adjudication remain separate fields; unsupported claims cannot enter the asserted registry |
| REQ-010 | Certificates and receipts are independently verifiable | The gate receives a verified run certificate, receipt-set closure, authority epoch, verifier digest, replay fingerprint, and certificate policy digest; signature or process integrity is not overclaimed as semantic conformance |
| REQ-011 | Deep Alignment reuses the shared review loop | The gate consumes phase-012 shared scope, coverage, lineage, convergence, report, resume, and write-set contracts used by Deep Review; no Deep Alignment-local lifecycle fork can pass |
| REQ-012 | The gate is independent and phase-safe | Deep Alignment produces its own `PASS`, `BLOCKED`, or `INDETERMINATE` result and certificate; another mode, aggregate dashboard, or final report cannot substitute, and a pass emits only `MIGRATED_SHADOW_READY` for phase 014 |
| REQ-013 | Rollback-request authentication is structurally complete | A closed request schema classifies every field as gateway-authenticated, independently re-derived, cross-checked against verified evidence, a validated closed value, or a deterministic constant; unknown or inert fields fail closed, and only snapshotted validated values reach authorization and certificate emission |
| REQ-014 | Fencing and rollback anchoring use re-verified substrate state | A stale token is accepted only when it is a positive safe integer strictly below the canonical writer resource's durable coordinator high-water mark and newly issued rollback token; the requested rollback anchor must equal the anchor in the independently re-verified migration certificate |

The authority-control record is resolved by one fail-closed function over requested posture, toggle, mode-gate certificate, authority
epoch, named-authority capsule, verifier digest, lane configuration, contract digests, rollback-window record, and current health
witness. `legacy_authoritative` is the safe result for absent or invalid input. `shadow_non_authoritative` is allowed while parity,
authority replay, and certificate evidence are collected. `ledger_authoritative` is a later consumer decision after an externally
authorized cutover transition validates a current Deep Alignment gate certificate; this phase never emits that transition.

The rollback window begins at a later cutover acceptance event, not at mode-gate PASS. It binds a last healthy ledger frontier and
matching legacy checkpoint, remains open until the earlier of its deadline or logical-operation budget, and returns to legacy
authority on expiry unless a new authorized window is proven. A trigger freezes new ledger-authoritative work, records lane health,
selects the matching legacy checkpoint, verifies the legacy path, and emits a restoration receipt. An unknown effect, unavailable
checkpoint, stale authority, or unresolved applicability is `BLOCKED`, not an implicit successful rollback.

The mode gate passes only when all P0 evidence is present and independently verified: the shared contracts are digest-bound, every
resolved lane has complete applicability and artifact coverage, verify-first findings have live re-probe evidence, shadow parity is
green, all required references verify, the certificate and receipt chain close, resume and rollback fixtures are green, and the
authority guard remains non-authoritative. A tolerated difference must have a typed disposition, owner, reason, expiry, and proof of
non-interference; it cannot be silently counted as parity. Known deviations remain observable adjudication facts and never delete
the original observation.

Parity is mandatory evidence only. The gate authenticates the phase-009 receipt and its bindings, then independently replays
the deterministic ledger and asks the real transition gateway to evaluate locally re-derived evidence. The receipt's computed
`exitStatus` never becomes the verdict, and this leaf does not re-run the parity harness.

The complete rollback request is authenticated structurally before authorization. Every named reference must resolve through
the real substrate and satisfy its kind, epoch/lifecycle/freshness/state, visibility, and authority obligations. Stale-writer
denial compares the caller-attested predecessor token with the coordinator's durable high-water mark and newly issued rollback
token; rollback anchoring compares the request with the independently re-verified migration certificate. The accepted limits on
retained-store observation, lifecycle-label semantics, health/resume/window/risk authenticity, and historical lease identity
come from the golden leaf's [decision record](../../001-deep-research/007-rollback-and-mode-gate/decision-record.md). Their
provenance must be verified before propagation, and phase 014 must correlate those bounded sources before relying on the
readiness certificate.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A malformed, stale, unauthorized, mixed, or incomplete authority-control record resolves to legacy authority and leaves an auditable refusal.
- **SC-002**: The rollback switch has one externally authorized inverse transition, a healthy sealed anchor, a bounded wall-clock and logical-operation window, and deterministic expiry behavior.
- **SC-003**: Every declared rollback trigger restores or blocks before unsafe ledger authority continues, while preserving failed tails, authority evidence, and restoration receipts.
- **SC-004**: The Deep Alignment gate covers lane resolution through per-lane report, resume, continuity, and remediation exclusion without inferring readiness from another mode or generic status.
- **SC-005**: Shadow parity is green with zero unexplained semantic differences across clean, drifted, known-deviation, unresolved, resumed, and replayed lane fixtures.
- **SC-006**: Required authority, rule, target, observation, finding, counterevidence, report, and resume artifacts are sealed and verified from pinned inputs.
- **SC-007**: A run certificate and receipt chain independently bind the authority epoch, verifier, lane coverage, replay fingerprint, gate result, and rollback evidence.
- **SC-008**: The gate emits `MIGRATED_SHADOW_READY` with a phase-014 handoff while retaining legacy authority, keeping remediation opt-in, and changing no shared review-loop contract.
- **SC-009**: Malformed request objects never throw; class-wide authentication, referential-integrity checks, independent gateway/replay derivation, strict coordinator supersession, and rollback-anchor equality all fail closed with typed evidence.
- **Given** an authority capsule is expired or mixed with a different verifier digest, **When** the gate resolves control state, **Then** it returns `legacy_authoritative` or `BLOCKED` and emits no pass certificate.
- **Given** a lane has an unresolved applicability predicate, **When** verification is requested, **Then** the lane records `UNRESOLVED` or `NOT_APPLICABLE` before expensive judging and cannot be counted as conformant.
- **Given** shadow parity differs in event order or a finding receipt is missing, **When** the mode gate evaluates the fixture, **Then** the result is `PARITY_BLOCKED` or `INDETERMINATE` and authority remains unchanged.
- **Given** a rollback trigger fires inside the window, **When** the external transition is authorized, **Then** the matching legacy checkpoint is restored or the result is `BLOCKED`, with the failed tail and restoration receipt retained.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Fail-open authority cutover** - a stale toggle, readable but unauthorized authority file, or permissive environment value could select the ledger path. Mitigation: default every invalid control result to legacy authority and require an external transition-authorization receipt.
- **Authority semantic weakening** - a parsed rule IR can omit ambiguous or weakened obligations while appearing executable. Mitigation: retain source anchors, residual reasoning-required states, negative and boundary witnesses, mutation checks, and authorized publication evidence.
- **False conformance from incomplete discovery** - a broken adapter can shrink the applicability denominator and report perfect coverage. Mitigation: gate on declared applicability edges and discovery completeness, not only discovered artifact count.
- **Unbounded rollback** - a time-only window can remain unsafe during retries, handoffs, or slow effects. Mitigation: bind both deadline and logical-operation or attempt budget to a sealed healthy frontier.
- **Self-authorized recovery** - a failing lane or quarantined verifier could clear its own quarantine or choose its own replacement. Mitigation: keep rollback authority in the shared transition kernel and require external authorization.
- **False parity** - matching reports can hide event order, authority epoch, known-deviation, evidence, receipt, or resume drift. Mitigation: compare events, projections, source and target digests, lane coverage, and replay fingerprints with a narrow volatility allowlist.
- **Certificate overclaim** - a signed certificate can prove origin and integrity without proving authority correctness, scope closure, or evidence sufficiency. Mitigation: keep those obligations as independent P0 evidence rows.
- **Review/alignment fork** - Deep Alignment and Deep Review could drift in scope, convergence, or report semantics. Mitigation: consume the frozen phase-012 shared review-loop contract and write-set fence rather than defining local lifecycle rules.
- **Provenance overclaim** - Caller-supplied health, historical lease, retention, resume, window, or risk evidence could look internally consistent without a real source handle. Mitigation: preserve the golden 007 decision-record boundaries and require phase-014 correlation against authoritative stores and coordinator history.
- **Dependencies**: the 036 parent and phase tree; phase-012 shared review-loop and write-set contracts; phase-014 handoff consumer; the phase-006 authorization spine; the six Deep Alignment siblings; Deep Alignment's existing state-machine and adapter contracts; the two findings registries; and the spec-kit validator. The phase tree declares `depends_on: []`; these are pinned contract inputs and navigation boundaries, not an added phase dependency.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which phase-012 transition token and authority epoch fields are mandatory for the Deep Alignment cutover arm and inverse rollback event?
- Does the shared health witness expose one canonical lane quarantine trigger, or must the gate bind typed authority, applicability, verifier, and receipt alarm classes?
- Which logical-operation counter is the rollback-window budget: lane transitions, artifact checks, verifier calls, effects, or the shared root lease debit?
- What exact phase-014 handoff schema consumes `MIGRATED_SHADOW_READY`, and which certificate expiry and authority epoch checks occur before later cutover?
- Which fixture proves legacy restoration when an external effect is `unknown`, the authority capsule changed, and the legacy checkpoint is available but the ledger tail is not finalized?

These decisions are resolved against the frozen shared contracts and the pinned baseline during implementation planning. They do not
authorize a local review-loop fork, a fail-open fallback, an unbounded window, an authority change, automatic remediation, or
legacy-writer retirement.
<!-- /ANCHOR:questions -->
