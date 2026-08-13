---
title: "Implementation Plan: claim continuity"
description: "Implementation plan for stable claim minting, semantic matching, lifecycle folding, and replay-safe resume continuity in phase 010 child 003."
trigger_phrases:
  - "claim continuity implementation plan"
  - "stable claim lifecycle implementation"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/003-claim-continuity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/003-claim-continuity"
    last_updated_at: "2026-07-21T09:10:00Z"
    last_updated_by: "codex"
    recent_action: "Delivered claim identity matching, lifecycle folding, replay, and resume recovery"
    next_safe_action: "Keep the projection dark until a separate authority phase approves cutover"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/claim-continuity/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/claim-continuity.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Claim Continuity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime |
| **Change class** | Logic (claim identity, lifecycle reducer, and resume projection) |
| **Execution** | Additive dark path in an isolated worktree pinned to the program baseline |

### Overview
Implement one durable claim record per phase-007 typed `claim` identity. New observations pass through exact alias/fingerprint
resolution and sibling-001 semantic-community candidates; support and sibling-002 contradiction/supersession events then fold
onto that identity. A versioned reducer derives lifecycle and epistemic status from the authorized ledger, while resume restores
typed claim references, cursor, fingerprint, and unresolved work without reminting. The program outcome and sequencing remain
those in `.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The phase-007 continuity identity schema and phase-006 event/replay contracts are pinned to exact versions
- [x] Sibling-001 semantic candidate output and sibling-002 contradiction/supersession input boundaries are frozen or fixture-backed
- [x] Claim namespaces, exact aliases, normalized fingerprints, idempotency keys, and ambiguity outcomes are specified
- [x] Lifecycle states and epistemic statuses are separate, exhaustive, and covered by a transition/precedence table
- [x] Canonical ledger ordering, compensating-event behavior, and projection-version rules are defined
- [x] Resume frontier fields and stale, missing, ambiguous, and wrong-kind failure behavior are defined
- [x] Legacy comparison inputs, dark feature boundary, frozen fixtures, and baseline projection outputs are recorded

### Definition of Done
- [x] Equivalent observations retain one claim ID while distinct and ambiguous claims never merge or remint silently
- [x] Support, contradiction, supersession, correction, and retraction fold to the declared lifecycle and status outcomes
- [x] Incremental application, full replay, crash/retry, handover, and resume produce identical claim projection hashes
- [x] Shadow comparison is observable and no legacy reader, writer, convergence rule, or authority boundary changes
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Typed claim registry**: phase-007 `claim` IDs index immutable mint provenance, namespaced aliases, raw observations, relationship references, and the current derived projection cursor.
- **Idempotent mint boundary**: a transition-authorized mint request binds source event and namespace to one durable ID; retry returns the same ID and concurrent collision fails explicitly.
- **Layered matcher**: exact aliases and normalized fingerprints run first; sibling-001 community membership supplies bounded candidates; a versioned equivalence policy returns reuse, mint, or unresolved ambiguity with provenance.
- **Observation/evidence attachment**: later wording and sources append typed observations and evidence to the matched claim while retaining source independence, qualification, and duplicate-source metadata.
- **Lifecycle reducer**: canonical ledger order folds `proposed`, `active`, `superseded`, and `retracted` independently from `unassessed`, `supported`, `contested`, and `refuted`.
- **Relationship boundary**: sibling-002 contradiction and supersession events reference stable source/target claim IDs; materially changed successors receive new IDs and preserve predecessor history.
- **Pre-append domain gate**: the service folds each prepared candidate event through the same claim reducer against the verified projection before policy authorization or append, so a replay-invalid event cannot become irreversible ledger history.
- **Resume verifier**: the frontier carries typed claim references, unresolved work, reducer version, ledger cursor, replay fingerprint, and projection hash; resume reconstructs and validates before accepting events.
- **Dark projection**: incremental state is rebuildable from the ledger, versioned beside legacy behavior, and published only to shadow comparison until the later authority program authorizes cutover.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

All three phases completed on 2026-07-21. Exact verifier evidence is recorded in `implementation-summary.md`.

### Phase 1: Setup
- Pin the phase-006 event envelope/replay fingerprint and phase-007 continuity identity contracts used by the implementation.
- Capture sibling-001 candidate and sibling-002 relationship interfaces from their frozen fixtures; adjacency does not become a hard child dependency.
- Freeze claim namespaces, match-policy version, lifecycle/status tables, resume-frontier schema, legacy comparison corpus, and baseline hashes.

### Phase 2: Implementation
- Implement the typed claim registry and idempotent mint operation over the transition-authorized dark ledger path.
- Implement exact alias/fingerprint resolution, semantic-community candidate lookup, versioned match decisions, and explicit ambiguity records.
- Append observations, support, qualification, contradiction, supersession, adjudication, correction, and retraction inputs against stable claim IDs.
- Implement the versioned lifecycle/status reducer with canonical event order, compensating-event semantics, projection hashing, and bounded incremental recomputation.
- Apply that reducer at the shared service write boundary before authorization and append for mint, match, observation, evidence, lifecycle, adjudication, and correction events.
- Implement the resume frontier writer/reader and fail-closed reconstruction for stale cursors, fingerprint mismatch, unresolved aliases, missing identities, and wrong kinds.
- Wire shadow comparison and telemetry without changing legacy authority, convergence inputs, or historical packet data.

### Phase 3: Verification
- Prove mint idempotency and collision handling under retry, crash, and concurrent equivalent observations.
- Prove exact matches, paraphrases, distinct neighbors, bridge cases, namespace collisions, and ambiguous candidates yield the declared reuse/mint/unresolved outcomes.
- Prove an exact same-namespace fingerprint with no semantic candidates reuses the registered claim and leaves identity count unchanged.
- Exercise every lifecycle and epistemic-status transition, including contradiction resolution, supersession, retraction, and compensating corrections.
- Prove a repeated correction is rejected before append, leaves the ledger readable, advances the head only for the accepted correction, and does not block an unrelated later mint.
- Compare incremental application with full replay across event reorder fixtures, reducer versions, and projection rebuilds.
- Resume and hand over at every fixture cursor; verify stable IDs, unresolved work, fingerprints, statuses, relationships, and projection hashes.
- Run legacy shadow parity and confirm no authoritative reader, writer, convergence decision, or tracked fixture changes unexpectedly.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Type-validation fixtures reject array, iteration, path, text, timestamp, hash, community, and wrong-kind substitutes for a `claim` ID |
| REQ-002 | Retry, crash-after-append, and concurrent-mint fixtures return one accepted claim identity or an explicit conflict |
| REQ-003 | Frozen alias, fingerprint, and semantic-candidate fixtures reproduce the same candidate set, decision, provenance, and policy version; a plain exact-fingerprint repeat returns `reuse`/`exact_fingerprint` without minting |
| REQ-004 | Ambiguous, weak, cross-namespace, and conflicting matches create unresolved records with no evidence attachment or duplicate mint |
| REQ-005 | A complete state matrix proves lifecycle and epistemic status are independently represented and exhaustively validated |
| REQ-006 | Event-prefix and compensating-event fixtures recompute state without in-place history mutation or mutable-status trust; a reducer-rejected second correction does not advance the ledger and later reads/writes remain healthy |
| REQ-007 | Paraphrase, multi-source, duplicate-source, and qualification fixtures accumulate on one ID with preserved provenance |
| REQ-008 | Contradiction retains both claims; supersession mints or reuses the correct successor ID and preserves the typed relationship |
| REQ-009 | Resume/handover fixtures restore the same frontier and fail before execution on stale, missing, ambiguous, or wrong-kind references |
| REQ-010 | Incremental and full replay outputs match claim-by-claim, including state, status, relationships, cursor, and projection hash |
| REQ-011 | Dark-path comparison records divergence while legacy outputs, convergence decisions, and authority remain unchanged |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This child declares `depends_on: []` in the phase tree. Its runtime implementation consumes the already ordered program
substrate: phase 006's transition-authorized ledger and replay fingerprint, phase 007's continuity identities, phase 008's
compatibility/shadow boundary, and phase 009's durable fan-in identity inputs. Siblings `001-semantic-communities` and
`002-contradiction-and-supersession-events` are adjacent independent planning contracts whose typed interfaces are consumed
through frozen fixtures, not hidden runtime ordering. Successor `004-next-focus-semantics` may read the committed claim view but
does not own identity or status recomputation.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The implementation remains additive, dark, and non-authoritative. Disable the claim-continuity feature boundary, stop its writer,
and rebuild or discard only the derived claim projection; legacy readers, writers, and convergence inputs continue unchanged.
Append-only claim events are retained for audit and replay compatibility rather than deleted. Work lands in path-scoped commits on
the isolated worktree, so reverting the phase code and fixtures restores the prior runtime while preserved events remain readable
through the versioned adapter.
<!-- /ANCHOR:rollback -->
