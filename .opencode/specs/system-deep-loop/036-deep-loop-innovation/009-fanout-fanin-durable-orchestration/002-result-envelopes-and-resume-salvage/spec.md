---
title: "Feature Specification: Result Envelopes & Resume/Salvage"
description: "Plan typed per-leaf result envelopes and ledger-fold resume/salvage that preserves completed work, recovers partial evidence, and never re-runs a durably completed leaf."
trigger_phrases:
  - "result envelopes and resume salvage"
  - "fanout ledger resume"
  - "salvage interrupted leaves"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/002-result-envelopes-and-resume-salvage"
    last_updated_at: "2026-07-21T05:09:43Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified additive-dark result, salvage, recovery, and resume contracts"
    next_safe_action: "Preserve legacy authority until a later cutover packet adopts the shadow projection"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Result Envelopes & Resume/Salvage

> Phase adjacency under `009-fanout-fanin-durable-orchestration` (navigation order, not a hard runtime dependency): predecessor `001-canonical-dispatch-receipts`; successor `003-logical-branch-ids-leases-waves`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/002-result-envelopes-and-resume-salvage |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Implemented (additive-dark) |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Second child of the phase-009 durable fan-out/fan-in parent |
| **Depends on** | None (`[]`); sibling planning contracts are independent |
| **Program substrate** | Phase-006 versioned envelope + typed ledger; phase-007 receipts/effect recovery; phase-008 compatibility boundary |
| **Authority posture** | Additive-dark; legacy fan-out remains authoritative until the staged phase-014 cutover |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The program phase tree assigns phase 009 a durable orchestration contract over the canonical event ledger: dispatch receipts, result envelopes, resume/salvage, stable branch scheduling, conditional fan-in, partial-failure policy, and provenance-balanced reduction (`.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json`). The phase-009 parent narrows this child to two linked responsibilities: record a typed outcome for every dispatched leaf, then reconstruct interrupted fan-out progress from those durable facts without re-running leaves whose successful outcomes are already committed (`../spec.md`).

The shipped runtime already contains narrower recovery behavior worth preserving. `runtime/scripts/fanout-run.cjs` resumes a persisted pre-dispatch wait, marks ledger rows with unmatched `started` events as orphaned and requeues them, writes a partial summary on signals, saves each subprocess stdout stream, invokes a salvage sweep before classifying the attempt, and rejects an exit-zero lineage when required artifacts or iteration evidence remain unrecoverable. `runtime/scripts/fanout-salvage.cjs` scans the lineage state log, recreates missing iteration markdown from captured stdout, appends `salvaged_from_stdout`, and writes an explicit failure marker when recovery has no substantive text. `runtime/scripts/fanout-merge.cjs` further reconstructs minimal research or review registries from state logs when the canonical registry file is absent, preserving otherwise lost findings and lineage attribution (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `.opencode/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs`, `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`).

Those mechanisms are artifact-local and depend on mutable directories, best-effort JSONL status rows, combined stdout, and process-exit observations. They do not yet provide a canonical typed outcome paired to a durable dispatch receipt, a verified ledger fold that distinguishes completed from interrupted work, or a general salvage record that binds every recovered fragment to its source and digest. This phase generalizes the shipped behavior into ledger-native result and recovery semantics while retaining the existing salvage path behind the compatibility bridge.

Each dispatch attempt receives exactly one canonical terminal result envelope paired to the sibling-001 dispatch receipt. The envelope captures parsed outcome data or a typed reference, terminal status, evidence, measured usage and cost, timing, error/salvage detail, and integrity/provenance bindings. Resume verifies and folds the phase-006 ledger, excludes durably successful pairs from scheduling, reconciles dispatched-but-unsettled attempts through the phase-007 effect-recovery contract, and salvages any trustworthy partial fragments before the applicable retry or partial-failure policy decides what remains eligible. Corrupt, conflicting, or ambiguous state fails closed; completion is never inferred from a process exit or a file's mere presence.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned `orchestration.leaf_result_recorded` payload registered on the phase-006 event envelope and appended through the typed, transition-authorized ledger.
- One result envelope per dispatch-receipt attempt, with `result_envelope_id`, `dispatch_receipt_id`, leaf/attempt identity, event and result schema versions, terminal status, parsed-result reference or inline bounded value, evidence references, artifact digests, error classification, timing, usage, cost, salvage summary, producer, and replay/authority bindings.
- Exact receipt-to-envelope pairing: the result causally references the dispatch event and receipt; an exact repeat returns the existing append receipt, while the same pair with different canonical facts conflicts.
- Explicit outcome states `succeeded`, `partial`, `failed`, `cancelled`, and `timed_out`; salvage is a separately recorded disposition and cannot silently convert a partial or failed result into success.
- A deterministic resume reducer over the verified phase-006 ledger that classifies each expected leaf/attempt as not-dispatched, dispatched-in-flight, succeeded, partial, failed, cancelled, timed-out, salvaged, conflicted, or unreadable.
- A no-rerun invariant for completed leaves: a leaf is complete only when its dispatch receipt and successful result envelope pair validate, required evidence/artifact digests resolve, and the ledger head is trusted.
- Recovery of dispatched-but-unsettled attempts by consulting effect intent/confirmation and adapter reconciliation before any re-dispatch, following phase-007 `001-receipts-and-effect-recovery`.
- Partial-output salvage from bounded stdout, state events, iteration artifacts, registries, and future typed fragments, with source kind, source event/artifact, byte/content digest, parser/schema version, recovered range, confidence/completeness, and failure reason.
- Append-only salvage events and a deterministic derived effective result; no recovery step rewrites the original dispatch receipt, result envelope, or committed artifact evidence.
- Crash-injection, duplicate-resume, corruption, stale-artifact, conflicting-pair, and mixed legacy/new-path fixtures proving deterministic reconstruction and no duplicate completed work.
- Additive adapters that preserve `fanout-run.cjs`, `fanout-salvage.cjs`, and `fanout-merge.cjs` behavior while shadowing equivalent typed results and recovery decisions.

### Out of Scope
- Defining the canonical dispatch receipt or invocation fingerprint, owned by sibling `001-canonical-dispatch-receipts`.
- Logical branch-ID semantics, worker leases/fences, or wave scheduling, owned by successor `003-logical-branch-ids-leases-waves`.
- Deciding quorum/deadline/progressive fan-in or tolerated failure counts, owned by siblings 004 and 005; this phase supplies typed inputs to those policies.
- Provenance-balanced cross-leaf reduction, owned by sibling 006; this phase preserves provenance but does not merge leaf claims/findings.
- Replacing the phase-006 envelope, ledger append, hash chain, authorization proof, replay fingerprint, or verified reader.
- Replacing phase-007 effect reconciliation, inventing exactly-once guarantees for opaque executors, or re-dispatching an `in_doubt` external effect.
- Treating recovered stdout as equivalent to independently persisted iteration content without a typed parser, digest, source record, and explicit completeness status.
- Authority cutover, per-mode migration, or legacy-writer retirement, owned by phases 013, 014, and 015.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every dispatched leaf attempt has one canonical terminal result envelope | For each terminal sibling-001 dispatch receipt, the ledger contains exactly one canonical result pair or an explicit unresolved recovery state; no result exists without a valid receipt |
| REQ-002 | The result envelope is typed, bounded, and complete | Schema validation requires receipt/leaf/attempt identity, status, parsed result or typed reference, evidence and artifact digests, timing, usage/cost provenance, error/salvage detail, producer, replay fingerprint, authority epoch, and correlation/causation fields |
| REQ-003 | Receipt-to-result pairing is immutable and conflict detecting | An exact repeat returns the original append receipt; a reused `dispatch_receipt_id` with different status, result, evidence, cost, or digest fails before append |
| REQ-004 | Completion is evidence-based rather than exit-based | `succeeded` requires a valid parsed result and every required evidence/artifact reference; exit zero, a summary file, or a `completed` status row alone cannot mark a leaf complete |
| REQ-005 | Resume reconstruction is deterministic from the verified ledger | The same verified stream, expected leaf set, registry versions, and reducer version yield byte-identical progress state and scheduling exclusions |
| REQ-006 | Resume never re-runs a durably completed leaf | Every leaf with a valid successful receipt/result pair and resolvable required evidence is excluded from the eligible dispatch set across repeated resumes and process restarts |
| REQ-007 | Interrupted dispatches reconcile before any retry | A dispatch receipt without a terminal result is classified through phase-007 effect recovery as not-applied, applied, in-doubt, or conflict; only a proved not-applied/retry-eligible case may dispatch again under the governing retry policy |
| REQ-008 | Partial output is salvaged with provenance and without rewriting history | Every recovered fragment records source kind/reference, digest, parser/schema version, recovered scope, completeness, and recovery verdict in a new ledger event; original events and artifacts remain immutable |
| REQ-009 | Salvage preserves partial value without manufacturing success | Recovered fragments may produce an effective `partial` result or complete missing evidence only when all required contracts validate; failed/ambiguous fragments remain explicit and cannot satisfy success gates |
| REQ-010 | Corruption and ambiguity fail closed | Hash/sequence failure, unknown schema, missing receipt, conflicting result, stale or mismatched artifact digest, unknown cost provenance, and `in_doubt` effect state yield no automatic re-dispatch or success classification |
| REQ-011 | Shipped salvage and merge behavior remains available during migration | Shadow fixtures prove iteration-file recovery, failed markers, registry reconstruction, attribution, and failure classification remain semantically equivalent while typed events are non-authoritative |
| REQ-012 | Result data is safe and cost-accountable | Ledger payloads exclude credentials and unrestricted raw output, reference large artifacts by digest, record measured versus estimated usage/cost explicitly, and use `null`/unknown rather than invented zero values |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every terminal leaf dispatch can be joined to exactly one typed result envelope by `dispatch_receipt_id`, with conflict detection for changed facts.
- **SC-002**: A crash at every dispatch/result/salvage append boundary reconstructs the same progress and never schedules a durably completed leaf again.
- **SC-003**: Interrupted leaves retain every verifiable partial fragment with source, parser, digest, completeness, evidence, usage, and cost provenance.
- **SC-004**: Missing, corrupt, stale, unknown-version, or ambiguous evidence fails closed and cannot become success or automatic re-dispatch.
- **SC-005**: Repeated resume and salvage passes are idempotent: no duplicate terminal result, duplicate fragment, duplicate artifact publication, or duplicate completed-leaf execution.
- **SC-006**: Shadow comparison preserves shipped wait resume, orphan detection, stdout salvage, failed-marker behavior, registry reconstruction, and lineage attribution while the ledger path remains dark.

**Given** a leaf has a valid dispatch receipt and successful result envelope with resolvable evidence, **When** the process crashes and resume folds the ledger, **Then** the leaf is marked complete and omitted from the eligible dispatch set.

**Given** a dispatch receipt has no terminal result, **When** resume reaches it, **Then** effect recovery reconciles the attempt before any retry and an `in_doubt` verdict blocks automatic re-dispatch.

**Given** an interrupted leaf left parseable state events and captured stdout but no iteration file, **When** salvage runs, **Then** it records a provenance-bound recovered fragment and preserves `partial` status until every required success condition validates.

**Given** salvage or result recording repeats with identical canonical facts, **When** the ledger append is retried, **Then** the original append receipt is returned and no duplicate event is committed.

**Given** the same dispatch receipt is paired with a changed result digest, status, evidence set, or cost, **When** append is attempted, **Then** the ledger rejects the conflict and resume stops that leaf.

**Given** a legacy lineage has no registry file but contains structured state-log findings, **When** the compatibility merge runs, **Then** the typed salvage projection retains those findings and lineage attribution without claiming independently persisted source content.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:implementation-evidence -->
## 6. IMPLEMENTATION EVIDENCE

The implementation lives entirely in `runtime/lib/result-envelopes/` with one adversarial suite at `runtime/tests/unit/result-envelopes.vitest.ts`. The logical event name is `orchestration.leaf_result_recorded`; its valid phase-006 wire type is `orchestration.leaf.result-recorded`, version 1. Companion version-one events record salvage provenance and verified phase-007 recovery links. The resume reducer is `result-resume-reducer@1`; the composed registry digest for the verified candidate is `4a91f98466577639d7cd2c188d315dcad7c6a91c640b8d9a2ef34172db8a5844`.

The suite proves one receipt/result slot, exact-repeat receipt reuse, changed-fact conflicts, evidence-based success, present-but-wrong digest rejection, unknown-cost rejection, completed-leaf exclusion, dispatch-only reconciliation blocking, byte-identical repeated folds, fault-injected torn-tail recovery, corrupt-ledger fail-closed behavior, all four recovery verdicts, retry-policy gating, recovery-source correlation binding, append-only salvage provenance, reconstructed-content honesty for every source kind, and legacy parity for iteration recreation, failed markers, registry reconstruction, attribution, and failure classification. The shipped fan-out scripts remain byte-untouched and authoritative.
<!-- /ANCHOR:implementation-evidence -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

The highest risk is equating process completion with durable semantic completion. The current runtime can observe exit zero and top-level artifacts while iteration evidence remains unrecoverable; its explicit rejection of `salvage.failed > 0` is the behavior to preserve. The generalized contract therefore marks success only from a verified receipt/result pair plus required evidence, and it records partial salvage separately from terminal success.

A second risk is duplicate work after restart. The existing status ledger can mark a `started` row orphaned and requeue it, but that heuristic cannot prove whether an external executor applied an effect or produced a durable result immediately before the crash. Resume must join the sibling-001 dispatch receipt, phase-006 ledger head, and phase-007 effect-recovery verdict before scheduling. An `applied` result is reconciled into a result envelope; `not_applied` may become retry-eligible; `in_doubt` or conflict stops automatically.

Salvage can also overstate provenance. The shipped sweep may write one recovered stdout body to multiple missing iteration files, and the merge path may synthesize a minimal registry from state-log narratives. The typed design keeps those useful fallbacks but labels source, parser, scope, completeness, and confidence, stores large raw material outside the ledger by digest, and never presents reconstructed content as byte-identical original evidence.

This child declares `depends_on: []` because sibling phase documents are independent planning contracts. Program implementation still consumes phase-006 envelope/ledger integrity, phase-007 receipts and effect recovery, and the phase-008 compatibility bridge as required by `manifest/phase-tree.json`. Sibling 001 defines the dispatch receipt being paired; siblings 003-006 consume reconstructed result state. Authority remains with the legacy path until phase 014.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

None blocking for planning. Implementation may choose exact event-type names, module boundaries, bounded inline-result limits, and parser identifiers after the sibling-001 receipt schema and phase-006 registry APIs materialize. It may not weaken one-pair-per-attempt identity, evidence-based completion, deterministic ledger folding, no-rerun of completed leaves, effect reconciliation before retry, append-only salvage provenance, explicit unknown cost, or fail-closed ambiguity.
<!-- /ANCHOR:questions -->
