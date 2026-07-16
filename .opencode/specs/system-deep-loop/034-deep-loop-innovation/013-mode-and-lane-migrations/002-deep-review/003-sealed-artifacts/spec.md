---
title: "Feature Specification: Deep Review - Sealed Reference Artifacts"
description: "Plan the Deep Review mode binding for immutable, content-addressed reference artifacts across scope, per-dimension passes, convergence, review-report synthesis, and resume handoff. The mode consumes the shared sealing primitives and never creates a second digest or verification scheme."
trigger_phrases:
  - "deep review sealed artifacts"
  - "deep-review reference sealing"
  - "deep review tamper-evident read"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/003-sealed-artifacts"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped Deep Review seal boundaries over the shared artifact contract"
    next_safe_action: "Freeze the Deep Review artifact-kind matrix against shared seal contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Review - Sealed Reference Artifacts

> Phase adjacency under the Deep Review parent (navigation order, not a hard runtime dependency): predecessor `002-reducers-and-projections`; successor `004-certificates-and-receipts`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/003-sealed-artifacts |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Third Deep Review child in the phase-013 mode migration fan-out |
| **Depends on** | None (`[]`); sibling planning contracts compose at the Deep Review mode gate |
| **Consumes** | Shared phase-006 sealing primitives, typed replay references, and the phase-012 shared review-loop contract used by deep-alignment |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep Review is a four-phase longitudinal loop: it resolves a review scope, runs one fresh-context pass per dimension,
checks convergence and legal-stop gates, synthesizes `review-report.md`, and saves continuity. The current contract stores
the control plane in `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`, the findings registry,
dashboard, iteration files, and report outputs (`deep-review/SKILL.md:289-329`; `deep-review/references/protocol/loop_protocol.md:70-156`).
Those records can name a target path, mutable worktree, prompt, rubric, graph result, or report without committing the exact
bytes that produced a candidate, a P0/P1/P2 finding, a blocked stop, or the final report.

The review findings registry makes that gap consequential. A pass must emit candidates before verdict-bearing findings,
retain intermediate facts for validation, use versioned fingerprints across changed lines and renamed symbols, and keep
impact separate from confidence, reachability, exploitability, evidence strength, and evidence scope
(`findings-registry-modes.json:2619-2876`). A later pass or resume can otherwise read a changed target, changed analyzer
output, or changed rubric and appear to continue the same lineage while producing a different result. The state log is
append-only, but append-only control records alone cannot reconstruct target bytes, context snapshots, diagnostic output,
adjudication inputs, or report materialization.

This phase plans the Deep Review binding to the shared phase-006 sealing primitives. It registers the mode artifact kinds,
seals the exact canonical bytes at each lifecycle boundary, carries only algorithm-qualified digest references through the
typed event, reducer, replay, convergence, and report paths, and verifies every read before a consumer receives bytes. The
same shared review-loop contract frozen in phase 012 is consumed by Deep Review and deep-alignment; this phase adds only
Deep Review artifact bindings and must not fork their common scope, dimension, lineage, convergence, or report semantics.
It does not invent a mode-local hash, blob store, descriptor, or tamper check. Sealing failures block new dark evidence and
trusted report or handoff promotion without changing legacy authority.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A Deep Review artifact-kind registry over the shared seal descriptor for the review target, base/head or file-set inputs, review contract, dimension and traceability protocol plan, context snapshot, executor/tool capability commitments, prompt/rubric configuration, and replay-affecting policy inputs.
- Seal-on-write capture for each dimension pass: the verified input reference set, selected targets, search/depth ledger, deterministic diagnostics, raw analyzer and test observations, graph events, iteration markdown, JSONL delta, and candidate evidence.
- Immutable candidate and adjudication evidence, including claim packets, intermediate path/data-flow facts, evidence classes, raw scores and confidence, impact, reachability, exploitability, evidence strength and scope, and the independent validation results used before P0/P1/P2 activation.
- A sealed convergence snapshot containing the ordered state history, findings-registry inputs, dimension and protocol coverage, nine legal-stop gate results, graph-convergence result, blocked-stop or recovery decision, and the exact inputs to the next dispatch or synthesis.
- Sealed synthesis outputs as materialized views over the versioned findings registry and projections, including dashboard metrics, optional resource-map coverage output, `review-report.md`, unresolved findings, verdict, advisory state, and the ordered input digest set.
- Mode adapters that bind ordered verified artifact-reference sets into typed events, the predecessor reducer/projection boundary, replay fingerprints, compatibility/shadow evidence, resume references, and the independent Deep Review mode gate.
- Tamper-evident verified reads, typed failure propagation, append-only supersession, changed-target detection, and additive-dark rollback behavior while legacy Deep Review remains authoritative.

### Out of Scope
- Defining or replacing the shared seal descriptor, canonicalization registry, digest algorithm, immutable store, atomic publisher, verified-read implementation, lifecycle ledger, retention collector, or corruption policy owned by the shared sealing primitives.
- Defining the phase-006 event envelope, typed append-only ledger, transition-authorization gateway, or generic replay-fingerprint descriptor; this phase supplies Deep Review references to those contracts.
- Defining the phase-012 shared review-loop contract used by Deep Review and deep-alignment, including shared target, dimension, lineage, convergence, report, and write-set semantics.
- Replacing the reducer and projection algorithms owned by predecessor `002-reducers-and-projections`; findings registries, dashboards, and reports are sealed views of those outputs, not second reducers.
- Defining certificate, receipt, boundary-attestation, promotion, or authority semantics owned by successor `004-certificates-and-receipts` and later cutover phases.
- Defining the resume decision algebra, state migration, shadow-parity harness, rollback switch, or independent mode-gate policy owned by the other Deep Review siblings and the mode gate; this phase only supplies their immutable references and verification results.
- Moving runtime authority, rewriting legacy JSONL, deleting sealed data, silently accepting an unverified target or observation, or treating P0/P1/P2 as a substitute for orthogonal evidential fields.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Deep Review artifact kinds use one shared seal contract | A reviewed mode matrix maps every lifecycle input and output to a registered shared artifact kind, canonicalization version, media type, and digest reference; no mode-local digest or verifier exists |
| REQ-002 | Scope initialization freezes the review reference set | Init seals the target bytes or immutable target references, base/head or file-set selection, review contract, dimensions, protocols, context snapshot, capability commitments, and replay-affecting policy before the first pass; mutable paths alone are rejected |
| REQ-003 | Every dimension pass consumes and emits exact references | A pass cites one ordered verified input set and seals selected targets, search ledger, diagnostics, raw observations, graph evidence, iteration output, and JSONL delta before reducer or convergence consumption |
| REQ-004 | Candidate evidence remains reproducible before severity activation | Candidate records seal intermediate facts, evidence classes, reproduction or refutation outputs, raw scores, and orthogonal confidence/impact fields; P0/P1/P2 activation cannot rely on a prose-only or inference-only reference |
| REQ-005 | Convergence reads one verified decision set | The convergence witness binds one ordered state snapshot, findings-registry inputs, coverage, nine legal-stop gate results, graph result, and recovery decision; mixed watermarks or changed inputs return a typed blocked or mismatch result |
| REQ-006 | Review-report synthesis is reproducible from sealed inputs | Dashboard, optional resource-map coverage, report bytes, unresolved findings, verdict, advisory metadata, reducer/projection versions, and ordered input references reproduce byte-identically from identical verified inputs |
| REQ-007 | Every mode read is tamper-evident | Missing, changed, truncated, substituted, wrong-kind, wrong-size, corrupted, unsupported, or descriptor-drifted artifacts release zero bytes and return the shared typed verification failure |
| REQ-008 | Replay and shadow parity use the same sealed set | Typed events, reducer inputs, replay fingerprints, legacy execution, and dark execution bind the same ordered verified digest set before behavior comparison; divergent sets produce input-equivalence failure |
| REQ-009 | Finding continuity preserves immutable observations | Moved lines, renamed symbols, new target revisions, finding updates, resolutions, suppressions, and supersessions append new references while retaining prior observations and their digests |
| REQ-010 | Resume and handoff detect reference drift without rewriting history | Resume-facing references identify unchanged, changed, missing, and unverifiable inputs and point to affected findings or report views; old seals remain readable and no silent rebaseline is allowed |
| REQ-011 | Sealing remains additive-dark and non-authoritative | Seal or read failure blocks new dark evidence, parity, trusted synthesis, or handoff promotion but does not modify legacy state, legacy output, schema, or runtime authority before staged cutover |

### Deep Review artifact boundary matrix

| Lifecycle boundary | Mode artifact set | Required consumer rule |
|--------------------|-------------------|------------------------|
| `scope/init` | Target bytes or immutable target references, base/head or file set, review contract, dimensions, protocols, context snapshot, capabilities, prompts, rubrics, policy inputs | Seal before the first dimension dispatch; bind one initial reference-set digest and reject path-only or mutable-only inputs |
| `dimension-pass` | Selected targets, search/depth ledger, deterministic diagnostics, raw analyzer/test/runtime observations, graph events, iteration markdown, JSONL delta | Verify before reducer or convergence consumption; pass output is a candidate/evidence record, not a trusted verdict by itself |
| `candidate/adjudication` | Candidate facts, evidence spans, reproducer/refutation output, claim packet, raw score, confidence, impact, reachability, exploitability, evidence strength and scope | Verify before P0/P1/P2 activation; preserve orthogonal fields and append later validation or severity changes |
| `convergence` | Ordered state history, findings registry inputs, coverage, gate results, graph-convergence event, blocked-stop or recovery witness | Read one verified snapshot; do not combine JSONL, iteration files, graph state, or dashboards from different watermarks |
| `synthesis` | Findings-registry view, dashboard, optional resource-map coverage, review-report, unresolved findings, verdict, advisory metadata, ordered input references | Seal after projection; report is a reproducible materialized view and cannot become primary mutable state |
| `resume/save` | Lineage and prior reference set, changed-input comparison, affected finding/report references, continuity handoff pointer | Verify before re-entry or save; drift produces a typed decision for the resume adapter and never mutates prior seals |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every Deep Review lifecycle boundary has a reviewed artifact-kind row and uses the shared content-addressed seal and verified-read contract.
- **SC-002**: Scope initialization, dimension passes, candidate adjudication, convergence, synthesis, resume, and save bind exact algorithm-qualified digest references rather than mutable paths or aliases.
- **SC-003**: Mutation, absence, truncation, substitution, descriptor drift, unsupported versions, and corrupted target or evidence artifacts fail before bytes reach a reducer, model, convergence decision, report, or handoff.
- **SC-004**: Identical verified reference sets plus the same registered review-loop, replay, reducer, and projection contracts reproduce byte-identical effective events, findings views, convergence evidence, and `review-report.md` output.
- **SC-005**: Finding lineage and changed-target handling append affected revisions, preserve prior observations, keep P0/P1/P2 separate from evidential dimensions, and never silently rebaseline a review.
- **SC-006**: The Deep Review mode gate can prove shadow parity over the same verified reference set while legacy authority remains unchanged; certificates and authority decisions remain with later phases.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The highest risk is a second mode-local sealing scheme that hashes a path, JSONL line, iteration markdown file, or report
without committing the exact canonical bytes consumed by the next review stage. The mode adapter must consume the shared
phase-006 sealing interface, use its descriptor, canonicalization, atomic publication, and verified-read errors, and expose
only digest references to the phase-012 review-loop, ledger, reducer, replay, and report layers.

Sealing only the control plane leaves target source, diff context, prompt/rubric inputs, deterministic diagnostics, raw
observations, and adjudication witnesses unreconstructable. Sealing only the final report hides candidate drift and makes
P0/P1/P2 changes look authoritative without the evidence that justified them. The boundary matrix therefore seals both
replay-affecting inputs and immutable intermediate/output observations, while predecessor reducers continue to own the
findings and dashboard projections.

The review loop has multiple arrival orders: dimensions run in configured order, graph events may be emitted during a pass,
and convergence consumes full JSONL history plus iteration files and graph state. Reference-set ordering must use the shared
canonical ordering and stable session, generation, iteration, dimension, candidate, and finding identities, never filesystem
discovery or subprocess completion order. A failed or corrupted read must block dark evidence and synthesis without changing
the legacy path. The phase-012 conflict graph is required before parallel lane execution so target snapshots, pass outputs,
candidate evidence, convergence snapshots, and report references have explicit write ownership.

Dependencies are the shared phase-006 sealing, event, and replay contracts; the phase-012 shared review-loop contract and
write-set conflict graph; predecessor `002-reducers-and-projections`; the existing Deep Review state, convergence, and report
references; and the compatibility/shadow bridge. Successor `004-certificates-and-receipts` consumes this phase's verified
reference set for boundary evidence. Deep-alignment consumes the same shared review-loop contract and must not receive a
Deep Review-only sealing or lineage fork.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Execution must freeze the final artifact-kind names, canonicalization profiles, media types,
maximum object sizes, target snapshot boundary, exact reference-set ordering, and typed error mapping against the pinned
baseline and phase-012 contract. It must decide whether a review-report package stores one sealed bundle or a sealed manifest
of separately addressed target, evidence, state, and output artifacts, without weakening verified reads, append-only
supersession, or the shared retention roots. It must also confirm how optional `resource-map.md` coverage is represented
when the shared review contract enables it. These choices may narrow the mode binding but may not introduce a second sealing
scheme, change shared review-loop semantics, or make a report path authoritative.
<!-- /ANCHOR:questions -->
