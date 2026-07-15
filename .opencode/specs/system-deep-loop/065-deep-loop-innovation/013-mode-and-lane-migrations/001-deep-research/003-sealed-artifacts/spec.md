---
title: "Feature Specification: Deep Research - Sealed Reference Artifacts (010 phase 001 child 003)"
description: "Plan the Deep Research mode binding for immutable, content-addressed reference artifacts across init, gather, analyze, convergence, synthesis, resume, and memory-save handoff. The mode consumes the shared sealing primitives and never creates a second digest or verification scheme."
trigger_phrases:
  - "deep research sealed artifacts"
  - "deep-research reference sealing"
  - "deep research tamper-evident read"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/003-sealed-artifacts"
    last_updated_at: "2026-07-15T19:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped Deep Research lifecycle inputs and outputs to shared seal references"
    next_safe_action: "Freeze the mode artifact-kind map and lifecycle seal boundaries"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Research - Sealed Reference Artifacts

> Phase adjacency under the Deep Research parent (navigation order, not a hard runtime dependency): predecessor `002-reducers-and-projections`; successor `004-certificates-and-receipts`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/003-sealed-artifacts |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Third Deep Research child in the phase-010 mode migration fan-out |
| **Depends on** | None (`[]`); sibling planning contracts compose at the Deep Research mode gate |
| **Consumes** | Shared phase-003 sealing primitives, typed replay references, and the phase-009 mode contracts |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep Research is a long-lived autonomous loop: it initializes a research objective and frontier, gathers and analyzes
evidence across iterations, evaluates convergence, synthesizes a report, and hands the result to memory save. Its
externalized control state can be replayable while the inputs and outputs remain mutable: prompts, search recipes,
executor capabilities, fetched source bytes, extracted passages, atomic claims, convergence inputs, synthesis output,
and the memory handoff may be addressed by a path or a logical name whose underlying bytes change. A later resume can
then appear to continue the same run while consuming different evidence, and a tampered source or output can reach a
reducer without a bounded verification failure.

The mode-specific research findings require a typed question frontier, branch-local context, claim-level
cross-validation, explicit unresolved or abstention states, and a portable research object rather than a prose-only
report. They also require living-research resume to rerun frozen search recipes, compare result identifiers and content
digests, and propagate only affected changes through claim dependencies. The research registry further identifies
digest-bound typed statements for source captures and synthesis checkpoints, while warning that external JSONL state
alone replays only the control plane and cannot reconstruct web results, page contents, prompts, models, or stochastic
reasoning.

This phase plans the Deep Research binding to the shared phase-003 sealing primitives. It registers mode artifact kinds,
seals the exact bytes at each lifecycle boundary, carries only shared algorithm-qualified digest references through the
typed event and replay paths, and verifies every read before gather, analyze, convergence, synthesis, resume, or memory
save consumes it. It does not invent a mode-local hash, blob store, descriptor, or tamper check. Sealing failures block
new dark evidence and remain observable without changing legacy authority.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A Deep Research artifact-kind registry over the shared seal descriptor for the initial objective, research plan and frontier, search recipes, executor and tool capability commitments, mode configuration, and replay-affecting policy inputs.
- Seal-on-write capture for source response bytes and provenance metadata, normalized passages and extraction profiles, branch-local gathered observations, atomic claims, evidence spans, cross-validation results, unresolved or abstention states, and contradiction obligations.
- An immutable convergence-input and decision witness that records the verified frontier, coverage, gap, contradiction, and budget evidence consumed by the shared convergence policy without redefining that policy.
- Sealed synthesis outputs as materialized views over the versioned atomic-claim and evidence ledgers, including the report bytes, claim-to-evidence references, unresolved claims, and ordered input digest set.
- A sealed memory-save handoff package containing the final research reference set, continuity payload, source and output digests, and the exact materialized view offered to the memory path.
- Mode adapters that bind ordered verified artifact-reference sets into typed events, replay fingerprints, reducers, projections, shadow-parity evidence, resume decisions, and the independent Deep Research mode gate.
- Tamper-evident verified reads, typed failure propagation, source-refresh diffing, append-only supersession, and rollback behavior while the new path remains additive-dark and non-authoritative.

### Out of Scope
- Defining or replacing the shared seal descriptor, canonicalization registry, digest algorithm, immutable store, atomic publisher, verified-read implementation, lifecycle ledger, retention collector, or corruption policy.
- Defining the phase-003 event envelope, typed append-only ledger, transition-authorization gateway, or generic replay-fingerprint descriptor; this phase supplies mode references to those contracts.
- Replacing the reducers and projections owned by predecessor `002-reducers-and-projections`; a synthesis artifact is a sealed output of those projections, not a second reducer.
- Defining certificate, receipt, promotion, or boundary-attestation semantics owned by successor `004-certificates-and-receipts`.
- Changing the generic convergence, termination, health, budget, fan-out, memory database, source-refresh, or authority-cutover policies outside the Deep Research reference bindings.
- Moving runtime authority, rewriting legacy JSONL, rebaselining a mismatch, deleting sealed data, or silently accepting an unverified source or output.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Deep Research artifact kinds use one shared seal contract | A reviewed mode matrix maps every lifecycle input and output to a registered shared artifact kind, canonicalization version, media type, and digest reference; no mode-local digest or verifier exists |
| REQ-002 | Initialization freezes the research reference set | Init seals the objective, plan/frontier, search recipes, executor/tool capability commitments, mode configuration, and replay-affecting policy inputs before the first gather operation; a path-only or mutable-only input is rejected |
| REQ-003 | Gather preserves source identity and bytes | Every admitted source capture is sealed with its source identity, retrieval metadata, response bytes, extraction profile, and normalized passages; branch events cite the exact verified references and never rely on a mutable URL or cache entry alone |
| REQ-004 | Analyze preserves atomic evidence and uncertainty | Claims, evidence spans, cross-validation results, contradiction links, and unresolved or abstention states are sealed as immutable observations; later judgments supersede by new references rather than editing the observations |
| REQ-005 | Convergence reads one verified decision set | The convergence witness binds one ordered verified snapshot of frontier coverage, gaps, contradictions, novelty, completion, and budget evidence; changed or missing inputs yield a typed blocked or mismatch result rather than a new baseline |
| REQ-006 | Synthesis is reproducible from sealed inputs | The report and claim/evidence materialized view cite the exact ordered artifact set and reducer/projection versions; identical verified inputs and replay contracts produce byte-identical output bytes and digest |
| REQ-007 | Memory-save handoff is sealed before persistence | The handoff contains the final reference set, continuity state, source/output digests, and offered content; memory save can consume it only after verified reads, and a failed handoff cannot be presented as a trusted completion |
| REQ-008 | Every mode read is tamper-evident | Missing, changed, truncated, substituted, wrong-kind, wrong-size, corrupted, unsupported, or descriptor-drifted artifacts release zero bytes and return the shared typed verification failure |
| REQ-009 | Resume detects evidence drift without mutating history | Resume reruns the sealed search recipes, compares result identifiers and content digests, screens only changed evidence, and appends new source/claim/synthesis references for affected dependencies; old seals remain readable and immutable |
| REQ-010 | Replay and shadow parity use the same sealed set | The mode binds the same ordered verified digest set to events, reducers, replay fingerprints, legacy execution, and dark execution; differing or unverifiable sets produce input-equivalence failure before behavior comparison |
| REQ-011 | Sealing remains additive-dark | Seal and read failures block new dark evidence, replay, parity, or handoff promotion but do not modify legacy state, legacy output, schema, or runtime authority before the staged cutover phase |

### Deep Research artifact boundary matrix

| Lifecycle boundary | Mode artifact set | Required consumer rule |
|--------------------|-------------------|------------------------|
| `init` | Objective, frontier, plan, recipes, capabilities, configuration, policy inputs | Seal before any branch is dispatched; bind one initial reference-set digest |
| `gather` | Source captures, retrieval metadata, extraction profile, normalized passages | Verify before analysis; source updates create new captures and never replace prior bytes |
| `analyze` | Atomic claims, evidence spans, cross-validation, contradictions, abstentions | Preserve raw observations; reducers and judgments reference them by digest |
| `convergence` | Verified frontier snapshot and decision witness | Read one snapshot; do not mix watermarks or recompute from mutable files |
| `synthesize` | Claim/evidence view, unresolved obligations, report bytes, ordered input references | Seal after projection; output is a materialized view, not authoritative mutable state |
| `memory-save` | Handoff package, continuity payload, final reference set, output digest | Verify before save; failure leaves no trusted handoff or completion evidence |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every Deep Research lifecycle boundary has a reviewed mode artifact-kind row and uses the shared content-addressed seal and verified-read contract.
- **SC-002**: Initialization, source capture, analysis, convergence, synthesis, resume, and memory-save bind exact algorithm-qualified digest references rather than mutable paths or aliases.
- **SC-003**: Mutation, absence, truncation, substitution, descriptor drift, unsupported versions, and source poisoning at a read boundary fail before bytes reach a reducer, model, memory save, or parity comparison.
- **SC-004**: Identical verified reference sets plus the same registered replay and reducer contracts reproduce byte-identical Deep Research effective events, projections, synthesis output, and handoff package.
- **SC-005**: A living-research resume compares frozen result identifiers and content digests, appends affected revisions, preserves old evidence, and does not silently rebaseline unchanged claims.
- **SC-006**: The Deep Research mode gate proves shadow parity over the same verified reference set, keeps legacy authority unchanged, and leaves certificate and authority decisions to later phases.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The highest risk is a second mode-local sealing scheme that hashes a path, report, or JSONL control record differently from
the shared primitive. The mode adapter must consume the phase-003 sealing interface, use its descriptor and verified-read
errors, and expose only digest references to the ledger and replay layers. The phase-009 mode contract and write-set
conflict graph are required before parallel lane execution so source capture, claim updates, convergence snapshots, and
synthesis cannot race on an unowned reference set.

Sealing only the control plane leaves web content, prompts, executor capabilities, or stochastic model observations
unreconstructable. Sealing only the final report hides source and claim drift. The boundary matrix therefore seals both
replay-affecting inputs and immutable intermediate/output observations, while predecessor reducers continue to produce
projections from versioned evidence. A source refresh is an append-only new capture and dependency revision, not an
overwrite or an automatic whole-run rebaseline.

Branch concurrency can make arrival order differ even when the logical research frontier is the same. Reference-set
ordering must use the shared canonical ordering and stable logical branch/sequence identities, not filesystem discovery or
completion order. A failed or corrupted read must block dark evidence and handoff without changing the legacy path; the
rollback switch disables new mode binding while preserving already sealed data for audit and later replay.

Dependencies are the shared phase-003 sealing, event, and replay contracts, the phase-009 mode interfaces and conflict
graph, predecessor `002-reducers-and-projections`, and the existing compatibility/shadow bridge. Successor
`004-certificates-and-receipts` consumes the sealed reference set for boundary evidence; it does not change this phase's
seal identity.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Execution must freeze the final artifact-kind names, canonicalization profiles, media types,
source-capture boundary, maximum object sizes, and exact reference-set ordering against the phase-000 census and the
phase-009 shared contract. It must also decide whether the memory-save handoff stores a sealed portable package or a
sealed manifest of separately addressed artifacts, without weakening verified reads, append-only supersession, or the
shared retention roots. The concrete choices may narrow the mode contract but may not introduce a second sealing scheme.
<!-- /ANCHOR:questions -->
