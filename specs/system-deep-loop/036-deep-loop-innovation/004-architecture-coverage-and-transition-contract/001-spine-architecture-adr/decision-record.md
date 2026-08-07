---
title: "Decision Record: Six-Primitive Cross-Mode Spine"
description: "Accepted architecture decision binding every deep-loop mode to one six-primitive runtime spine and additive-dark migration sequence."
trigger_phrases:
  - "six-primitive cross-mode spine decision"
  - "deep-loop spine architecture ADR"
  - "transition-authorized ledger architecture"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/001-spine-architecture-adr"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/001-spine-architecture-adr"
    last_updated_at: "2026-07-20T18:56:56Z"
    last_updated_by: "codex"
    recent_action: "Ratified the six-primitive spine and migration invariants"
    next_safe_action: "Apply this decision as a binding input to phases 006, 007, and 008"
    blockers: []
    key_files:
      - "decision-record.md"
      - "implementation-summary.md"
      - ".opencode/specs/system-deep-loop/036-deep-loop-innovation/spec.md"
      - ".opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json"
      - ".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Six-Primitive Cross-Mode Spine

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Adopt One Six-Primitive Cross-Mode Spine

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-20 |
| **Deciders** | 036 architecture program |
| **Authority effect** | None; this record ratifies architecture and does not authorize runtime cutover |

<!-- ANCHOR:adr-001-context -->
### Context

The 178 recommendations converge on one shared architecture, not independent mode patches. Run-2 section 12 names five recurring primitives and requires each mode to define a typed schema over one shared runtime. The parent architecture and phase-tree manifest add the fail-closed transition-authorization gateway needed to prevent a structurally valid event from becoming an unauthorized state transition. Together these sources establish the six-part spine ratified here. [Source: .opencode/specs/system-deep-loop/036-deep-loop-innovation/spec.md:59-80] [Source: .opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json:5-6] [Source: .opencode/specs/system-deep-loop/036-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md:215-225]

The live runtime holds in-flight state and shares backends, so the new substrate cannot replace legacy state in one step. It must remain additive, dark, and non-authoritative through compatibility, shadow-parity, and rollback work; authority moves later, one mode at a time, behind a rollback window. [Source: .opencode/specs/system-deep-loop/036-deep-loop-innovation/spec.md:68-80] [Source: .opencode/specs/system-deep-loop/036-deep-loop-innovation/spec.md:121-159] [Source: .opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json:6]

### Controlling sources

| Key | Source | Controlling content |
|-----|--------|---------------------|
| **S1** | `.opencode/specs/system-deep-loop/036-deep-loop-innovation/spec.md:59-80,121-171,232-250` | One shared spine; no big-bang swap; sequencing invariants; 006/007/008 outcomes; success criteria |
| **S2** | `.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json:5-16` | Exact `architecture` and `migration_model` values plus consumer-phase outcomes |
| **S3** | `.opencode/specs/system-deep-loop/036-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md:215-225` | Five recurring mode primitives and shared-runtime implication |

### Constraints

- The first typed writer and the fail-closed transition-authorization gateway must co-land in phase 006; neither may ship alone. [Source: S1] [Source: S2]
- Phase 007 may choose service mechanics but may not weaken sealed inputs, proof emission, judge separation, counterfactual checks, or raw-evidence retention. [Source: S1] [Source: S2] [Source: S3]
- Phase 008 must preserve legacy authority while proving compatibility, shadow parity, and rollback; it does not authorize cutover. [Source: S1] [Source: S2]
- This decision selects no storage engine, serialization, cryptographic scheme, transport, adapter implementation, or scoring algorithm.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Adopt one shared, cross-mode runtime spine composed of all six primitives: **(1) typed append-only versioned event ledger, (2) fail-closed transition-authorization gateway (default-deny), (3) sealed/frozen reference artifacts (digest-referenced), (4) versioned replay fingerprints, (5) receipts/certificates, and (6) blinded/counterfactual adjudication**. Every mode must specialize this spine with typed schemas and artifacts; no mode may replace its persistence, transition authority, replay identity, proof, reference truth, or scoring authority. [Source: S1] [Source: S2] [Source: S3]

Default-deny is non-optional. Every canonical state transition must receive explicit authorization before persistence; a missing, malformed, unknown, or unsupported authorization result is a denial. No direct typed writer or compatibility adapter may bypass the gateway. This is the ratified fail-closed meaning required by the parent and manifest. [Source: S1] [Source: S2]

Additive-dark sequencing is non-optional. The substrate lands additive, dark, and non-authoritative; legacy state remains authoritative through phase 008 compatibility, shadow-parity, and rollback proof. This ADR grants no authority cutover and no legacy-writer retirement. [Source: S1] [Source: S2]

#### Primitive-to-problem contract

| Primitive | Problem solved | Ratified invariant | Primary consumer phase | Source trace |
|-----------|----------------|--------------------|------------------------|--------------|
| **Typed append-only versioned event ledger** | Per-mode state fragments cannot be audited, deterministically reduced, or replayed under one contract | Canonical history for the new substrate is event-derived, typed, versioned, append-only, and shared across modes | **Phase 006: transition-authorized ledger core** | S1, S2, S3 |
| **Fail-closed transition-authorization gateway (default-deny)** | A valid event shape does not prove that its state transition is permitted | Every transition is explicitly authorized before write; missing, malformed, unknown, or unsupported authorization denies, and no writer or adapter bypasses the gate | **Phase 006: transition-authorized ledger core** | S1, S2 |
| **Sealed/frozen reference artifacts (digest-referenced)** | Mutable authorities, evaluators, canaries, rubrics, or independence sets let the ruler drift after candidates or outcomes are visible | Governing inputs are frozen for the decision epoch and referenced by content digest, not mutable location alone | **Phase 007: shared evidence and control services** | S1, S2, S3 |
| **Versioned replay fingerprints** | Unversioned hashes cannot reproduce behavior or track an entity across schema, reducer, artifact, and policy revisions | Replay identity binds the relevant event, schema, reducer, artifact, and policy versions | **Phase 006: transition-authorized ledger core** | S1, S2, S3 |
| **Receipts/certificates** | Logs do not provide portable, independently checkable proof of effects or boundary decisions | Every governed phase or mode boundary emits typed proof linked to its inputs, events, sealed artifacts, and replay identity | **Phase 007: shared evidence and control services** | S1, S2, S3 |
| **Blinded/counterfactual adjudication** | Self-scoring and provenance or order leakage can reward identity, style, or evaluator gaming instead of merit | Candidate and judge remain separate; merit-irrelevant provenance is blinded; mirrored-order or equivalent counterfactual checks test verdict stability; raw pre-reduction evidence is retained | **Phase 007: shared evidence and control services** | S1, S2, S3 |

Phase 008 is the preservation consumer for every row: its compatibility adapters, shadow-parity harness, in-flight-state classification, and rollback drills must preserve the complete spine while legacy remains authoritative. [Source: S1] [Source: S2]

#### Why the primitives are indivisible

The ledger without authorization records forbidden transitions faithfully. Authorization without a versioned ledger cannot prove which rule governed a historical decision. Seals without replay fingerprints freeze inputs but not the execution contract. Fingerprints without receipts reproduce a run without proving its external effects or boundary verdicts. Receipts without blinded adjudication can certify a biased or self-scored decision. The six primitives therefore form one evidence and authority chain; removing any link recreates the ad-hoc failure pattern the parent program rejects. [Source: S1] [Source: S2] [Source: S3]
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered and Rejected

| Alternative | Rejection rationale | Forbidden recreation | Source trace |
|-------------|---------------------|----------------------|--------------|
| Independent per-mode JSONL formats | Duplicate schema, reducer, replay, and migration logic fragments cross-mode evidence lineage | Per-mode persistence and authority | S1, S3 |
| Mutable shared state as canonical truth | Overwrites causal history, makes recovery order-dependent, and blocks exact audit | Mutable truth | S1, S3 |
| Unversioned event envelopes, hashes, or replay keys | Makes schema and reducer revisions indistinguishable and historical replay best-effort | Unversioned replay | S1, S2, S3 |
| Typed ledger with direct or adapter-owned writers | Treats structural validity as transition authority and permits well-formed forbidden transitions | Per-mode or bypass authority | S1, S2 |
| Live or mutable reference artifacts | Lets an evaluator, authority, canary, rubric, or independence input change after seeing a candidate or result | Mutable truth and ruler drift | S1, S3 |
| Logs with optional receipts | Leaves side effects and boundary decisions without portable proof or independent verification | Optional evidence | S1, S3 |
| Mode-owned, candidate-visible, or self-scoring adjudication | Couples mutation to measurement and preserves provenance, order, style, and evaluator-gaming bias | Self-scoring | S1, S2, S3 |
| Big-bang replacement of legacy state | Breaks in-flight and shared-backend consistency and violates the additive-dark migration model | Ungated authority transfer | S1, S2 |

These rejected alternatives are not fallback implementation choices. A consumer that needs one must propose a superseding ADR with impact analysis across phases 006, 007, and 008. [Source: S1] [Source: S2]
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**

- Every mode gains one auditable, replayable, and falsifiable evidence chain while retaining typed domain schemas and artifacts. [Source: S1] [Source: S3]
- Cross-mode gates can inspect common events, digests, fingerprints, and receipts instead of mode-specific log conventions. [Source: S1] [Source: S2]
- Compatibility and later cutover decisions become evidence-bearing transitions, not deployment convention. [Source: S1] [Source: S2]

**What it costs**

- Phase 006 must co-land ledger and authorization, and must version durable event, schema, reducer, artifact, policy, and fingerprint surfaces.
- Phase 007 must operate seals, receipts, evidence retention, recovery, and judge separation as required services rather than optional observability.
- Phase 008 must maintain adapters, shadow comparison, in-flight classification, and rollback proof while the legacy path remains authoritative.
- Mode implementations lose the freedom to create independent canonical stores or scoring authorities, but keep control of typed domain schemas, projections, and bounded service mechanics.

**Migration obligations**

- The new spine begins additive, dark, and non-authoritative. [Source: S1] [Source: S2]
- Phase 008 preserves legacy reads and authority while proving shadow parity and rollback. [Source: S1] [Source: S2]
- Authority cutover remains later, per mode, and certificate-gated; this ADR does not authorize it. [Source: S1] [Source: S2]
- Legacy writers remain until the program's zero-use telemetry and retirement gates pass. [Source: S1] [Source: S2]

| Risk | Impact | Mitigation |
|------|--------|------------|
| A consumer treats one primitive as optional | High | Its phase gate must trace the implementation back to this six-row invariant matrix |
| A compatibility adapter bypasses authorization | High | Phase 008 must preserve the phase-006 default-deny gateway on every canonical write path |
| A mode introduces mutable or self-owned truth | High | Reject the implementation unless it uses digest-bound inputs and separated adjudication |
| A local schema edit silently changes topology | High | Require a superseding ADR and cross-consumer impact analysis |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The parent identifies ad-hoc state, missing receipts, weak replay, and unmeasured independence as current failures. [Source: S1] |
| 2 | **Beyond Local Maxima?** | PASS | The decision rejects eight concrete alternatives, including the existing per-mode JSONL and mutable-state patterns. [Source: S1] [Source: S3] |
| 3 | **Sufficient?** | PASS | The six primitives close persistence, authority, immutable input, replay, proof, and scoring gaps as one chain. [Source: S1] [Source: S2] [Source: S3] |
| 4 | **Fits Goal?** | PASS | The phase map requires ratification before any typed writer and assigns implementation to phases 006-008. [Source: S1] [Source: S2] |
| 5 | **Open Horizons?** | PASS | Modes can specialize typed schemas without reopening the shared topology. [Source: S1] [Source: S3] |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Consumer Contract and Rollback

| Consumer | Binding responsibility | Forbidden weakening |
|----------|------------------------|---------------------|
| **Phase 006** | Co-land the typed append-only versioned event ledger, versioned replay fingerprints, and fail-closed transition-authorization gateway; keep the substrate dark and legacy authoritative | No writer before the gateway, no default-allow path, no unversioned replay identity |
| **Phase 007** | Deliver digest-bound sealed artifacts, typed receipts/certificates, and blinded/counterfactual adjudication with raw evidence retention | No mutable reference truth, optional proof, candidate-owned judge, or self-scoring |
| **Phase 008** | Preserve all six primitives through compatibility adapters, shadow parity, in-flight classification, and rollback drills without moving authority | No adapter bypass, big-bang swap, authority cutover, or legacy retirement |

This leaf changes documentation only. It introduces no runtime code, writer, service, adapter, authority transfer, or legacy retirement. Before consumer implementation begins, rollback is a documentation revert followed by re-ratification. After a consumer relies on this contract, topology changes require a superseding ADR and impact analysis across phases 006, 007, and 008. [Source: S1] [Source: S2]
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

