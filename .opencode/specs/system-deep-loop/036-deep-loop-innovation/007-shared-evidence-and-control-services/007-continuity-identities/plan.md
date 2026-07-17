---
title: "Implementation Plan: continuity identities"
description: "Implementation plan for stable continuity identity minting, ledger persistence, resume and handover restoration, and cross-mode references."
trigger_phrases:
  - "continuity identities implementation plan"
  - "stable deep-loop identity plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/007-continuity-identities"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/007-continuity-identities"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined identity minting, persistence, cross-mode reference, and replay gates"
    next_safe_action: "Build the shared identity module and ledger event contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Continuity Identities

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/system-deep-loop/runtime/` shared identity, state-reduction, ledger, and mode-boundary adapters |
| **Change class** | Additive dark runtime service + typed ledger contract |
| **Execution** | Isolated worktree pinned to the phase-003 BASE; legacy paths remain authoritative |

### Overview
Add one shared continuity-identity service that mints opaque typed IDs for lineages, claims, candidates, and logical mode sessions, persists identity events through the transition-authorized ledger, and restores the same references from resume and handover state. The service separates stable logical identity from attempts, iterations, labels, paths, timestamps, and content fingerprints. Existing identifiers are observed as namespaced aliases in the dark path. Cross-mode consumers carry typed references to the original entity instead of generating a local replacement. Design evidence comes from `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs`, `.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`, `.opencode/skills/system-deep-loop/runtime/lib/council/session-state-hierarchy.cjs`, `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/jsonl-repair.ts`, `.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts`, the parent program `spec.md`, `manifest/phase-tree.json`, and the run-2 `research-modes.md`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-006 ledger envelope, transition gate, event-version field, and replay cursor are pinned to exact source contracts
- [ ] Current lineage, claim/finding, candidate, session, resume, handover, and graph identifier producers are inventoried with fixtures
- [ ] Identity kinds, mint request shape, alias namespaces, relationship vocabulary, and fail-closed errors are frozen
- [ ] Retry versus resume versus restart/fork semantics are explicit for every identity kind
- [ ] Downstream program phases 007 and 011 accept the same typed-reference contract

### Definition of Done
- [ ] Minting is idempotent, authorized, collision-safe, and replay deterministic
- [ ] Resume and handover restore the same logical IDs and reject missing, ambiguous, or wrong-kind references
- [ ] Cross-mode references preserve the original ID while recording a typed boundary relationship
- [ ] Reorder, rename, path change, text change, and timestamp change cannot mutate an existing identity
- [ ] Dark compatibility events bind existing IDs as aliases without changing legacy authority or output
- [ ] All targeted tests, replay fixtures, build/typecheck gates, and strict spec validation pass on the candidate SHA
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Shared identity module**: add a runtime-owned module under `runtime/lib/deep-loop/` with `mintIdentity`, `parseIdentity`, `assertIdentityKind`, `bindAlias`, and `linkIdentities`. The canonical value is an opaque, versioned, kind-bearing ID minted from cryptographic randomness; mutable domain data is never encoded into it.
- **Four initial kinds**: `lineage`, `claim`, `candidate`, and `mode_session`. The schema is extensible only through a versioned kind registry; unknown kinds fail closed. A logical mode session survives pause/resume and handover. An invocation/attempt receives separate attempt metadata. A true restart or fork receives a new ID and an explicit relationship to the prior identity.
- **Idempotent mint boundary**: callers provide a durable mint-request token. The transition-authorized append atomically records the accepted identity. Retrying the token resolves the recorded ID; a token reused with different kind or provenance is a conflict.
- **Ledger representation**: define versioned mint, alias-bind, relationship-bind, and cross-mode-reference events over the phase-006 envelope. Domain events carry typed `subject_ref` values plus optional lineage and mode-session refs. Replay folds these events into an identity registry, alias index, and relationship graph; no mutable projection becomes the source of truth.
- **Resume/handover frontier**: persist the active mode-session ID, lineage IDs, active claim/candidate refs, attempt metadata, ledger cursor, and replay fingerprint. Resume resolves the frontier against the ledger before dispatch. It preserves IDs for continuation, rejects ambiguity, and mints only when an explicit new/fork transition is authorized.
- **Cross-mode transfer**: pass a typed reference `{id, kind, schema_version}` and ledger position. The receiving mode verifies the kind and existence, then records a boundary relation with source/target mode-session refs. Mode-local labels and projections may change; the referenced ID does not.
- **Dark legacy observer**: adapt current `sessionId`, lineage label/run IDs, graph node IDs, candidate IDs, synthesized summary IDs, and continuity-thread text keys into namespaced aliases. Ambiguous aliases produce telemetry and rejection in the dark service while the legacy path continues unchanged. Upcasting and authority selection remain phase-008 work.
- **Current-gap fixtures**: lock regressions around text-keyed open questions in `continuity-thread.cjs`, index/timestamp defaults in `session-state-hierarchy.cjs`, run/index fallback IDs in `reduce-state.cjs`, label/run-derived sessions in `fanout-run.cjs`, mutable composite dedupe keys in `jsonl-repair.ts`, and session-namespaced graph keys in `coverage-graph-db.ts`.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the phase-006 ledger envelope and transition-authorization interfaces, then census every shipped producer and consumer of lineage, claim/finding, candidate, mode-session, resume, handover, and graph identities.
- Freeze golden legacy fixtures and a decision table for continue, retry, resume, restart, fork, clone-forbidden, and cross-mode-reference behavior.
- Confirm this child remains `depends_on: []` within the 004 parent; adjacency to `006-locks-and-fencing` adds no hard execution dependency.

### Phase 2: Implementation
- Add the versioned identity kind registry, parser/validator, cryptographic minting, durable mint-request idempotency, and explicit error taxonomy.
- Add transition-authorized identity ledger events and a deterministic replay fold for registry, aliases, and relationships.
- Thread typed identity refs through state reduction, continuity threading, logical mode-session state, resume payloads, handover frontiers, fan-out lineage state, and cross-mode invocation contracts without changing legacy authority.
- Add the dark legacy alias observer and diagnostics for collisions, ambiguous aliases, wrong-kind references, missing ledger subjects, and forbidden remint attempts.
- Publish the downstream typed-reference contract consumed by program phase 010 claim continuity and phase 014 per-mode cutover.

### Phase 3: Verification
- Prove same-ID restoration across pause/resume, process restart, handover round trip, replay, reordered arrays, renamed labels/paths, and changed content text.
- Prove retries are idempotent; true forks/restarts mint a linked child; concurrent conflicting mints fail closed with one accepted identity.
- Prove each mode can reference a lineage, claim, or candidate created by another mode without copying, changing kind, or losing provenance.
- Prove event-prefix replay reconstructs byte-equivalent canonical identity state and detects tampering or incompatible schema versions.
- Compare dark-path alias resolution against legacy behavior and require zero authoritative output changes before phase 008.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Property and table tests cover every valid kind/version plus malformed, unknown-kind, and cross-kind inputs |
| REQ-002 | Crash-before-response, retry, duplicate request, and concurrent request fixtures yield one accepted identity |
| REQ-003 | Metamorphic fixtures vary array order, iteration, label, title, path, text, timestamp, and content hash while asserting ID stability |
| REQ-004 | Resume and handover round trips restore the same typed frontier and fail before dispatch on missing, ambiguous, stale, or wrong-kind refs |
| REQ-005 | Retry/resume keeps the ID and increments attempt metadata; restart/fork mints a linked child with no parent mutation |
| REQ-006 | Cross-mode matrix covers research, review, council, improvement, alignment, and benchmark consumers using the same source identity |
| REQ-007 | Ledger schema, transition-authorization, append, and replay tests prove complete provenance and relationship reconstruction |
| REQ-008 | Shadow fixtures map shipped legacy keys to aliases and compare outputs while asserting the legacy path remains authoritative |
| REQ-009 | Repeat replay, prefix replay, mixed-version replay, and tamper fixtures produce deterministic state or an explicit incompatibility error |
| REQ-010 | Contract fixtures for program phases 007 and 011 consume typed refs without index-, path-, label-, or mode-local regeneration |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The child manifest contract is `depends_on: []`; `006-locks-and-fencing` is an adjacency pointer only. The 004 parent inherits the program-level dependency on `006-transition-authorized-ledger-core`, whose envelope, transition gate, append semantics, and replay cursor are integration contracts rather than work reimplemented here. Program phases `010-novelty-claims-continuity-and-projections` and `014-staged-state-migration-and-authority-cutover` consume this phase's stable references. Phase 008 owns compatibility authority and phase 009 owns durable orchestration. Source-of-truth planning inputs are `.opencode/specs/system-deep-loop/036-deep-loop-innovation/spec.md`, `.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json`, and `.opencode/specs/system-deep-loop/036-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md`.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The identity service lands additive, dark, and non-authoritative. Rollback disables new mint/reference emission and removes the dark adapters through a path-scoped `git revert`, leaving legacy readers, writers, state, and outputs authoritative. Append-only identity events already written are retained as inert audit history rather than deleted or reused. A rollback must not remint their IDs on re-enable; the idempotency and replay fixtures prove safe reactivation from the same ledger prefix.
<!-- /ANCHOR:rollback -->
