---
title: "Implementation Summary: continuity identities"
description: "Stable typed continuity identities now survive retry, resume, handover, replay, fork, and cross-mode boundaries through an additive dark ledger service."
trigger_phrases:
  - "continuity identities implementation"
  - "stable deep-loop identity evidence"
  - "continuity identity verification"
importance_tier: "high"
contextType: "implementation"
status: "Complete"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/007-continuity-identities"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/007-continuity-identities"
    last_updated_at: "2026-07-21T00:38:52Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the additive dark continuity identity service"
    next_safe_action: "Keep legacy authority canonical until the planned cutover phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/continuity-identity/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/continuity-identities.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The v1 identity is token-derived, kind-bearing, opaque, and independent of mutable coordinates."
      - "Legacy readers and writers remain canonical; the new service is standalone and dark."
---
# Implementation Summary: Continuity Identities

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-continuity-identities |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Status** | Complete |
| **BASE SHA** | `d1a3f0323c3635f24c3560feaeda839522ececf0` |
| **Candidate SHA** | `d1a3f0323c3635f24c3560feaeda839522ececf0` plus the uncommitted, path-scoped additive overlay below |
| **Runtime overlay digest** | `sha256:53c2c88cfd99d24f8f0539e82d324b4757afc93f0eca334162c065ced5ca1340` |
| **Identity fixture digest** | `sha256:8c2fd8200cfb261bf6843d113148729b2163e7c96b5afd6c0473bfc31d116c3c` |
| **Event registry digest** | `e054a11a94e704585a30fcbb6b43469afbaef7f12d3752081a068cc94df0fe46` |
| **Local dependency contract** | `depends_on: []`; `006-locks-and-fencing` remains adjacency only |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The runtime now has one stable, typed identity for each lineage, claim, candidate, and logical mode session. The new service records its own evidence through the existing transition-authorization gateway and hash-linked ledger while remaining completely disconnected from shipped legacy writers, so it can prove continuity without taking authority.

### Runtime Modules

| Module | Contract |
|--------|----------|
| `continuity-identity-types.ts` | Closed v1 types for identities, relationships, attempts, cross-mode references, frontiers, and fail-closed errors |
| `continuity-identity-schema.ts` | Opaque token-derived ID minting, typed parsing, bounded alias hashing, and registered-reference resolution |
| `continuity-identity-events.ts` | Five validator-bound event definitions, deterministic reducers, replay component registration, and the dark-only authorization policy |
| `continuity-identity-service.ts` | Gateway-only writes, idempotent mint and alias operations, lifecycle/cross-mode events, verified reads, standalone runtime factory, and legacy-result-preserving observer |
| `continuity-frontier.ts` | Canonical handover frontier creation, exact-cursor replay restoration, and downstream typed-subject validation |
| `index.ts` | Stable public contract for later claim-continuity and authority-cutover consumers |
| `continuity-identities.vitest.ts` | Twenty focused contract tests across identity, authorization, crash/concurrency, lifecycle, replay, handover, aliases, and all six modes |

### Contract Proofs

| Contract | Evidence |
|----------|----------|
| Kind and version safety | Every v1 kind round-trips; malformed, future-version, unknown-kind, cross-kind, and missing refs reject before use |
| Stable derivation | IDs depend only on a caller-retained 256-bit mint token; order, iteration, label, title, path, text, timestamp, and content-hash changes do not affect the accepted ID |
| Authorized idempotent mint | Every append calls `TransitionAuthorizationGateway.authorize` and `AppendOnlyLedger.appendAuthorized`; retry, crash after allow, exact concurrency, conflicting provenance, and conflicting parent semantics are covered |
| Retry versus fork | Attempts stay under the original mode-session ID; true `continues_from` and `forked_from` transitions mint distinct children and retain an unchanged parent |
| Resume and handover | The closed frontier binds typed refs, attempt, exact ledger head, registry digest, projection digest, and final replay digest; stale, tampered, missing, and wrong-kind inputs fail before dispatch |
| Cross-mode continuity | One claim reference crosses research, review, council, improvement, alignment, and benchmark sessions without cloning, re-keying, or changing kind |
| Dark compatibility | Namespaced hashes cover existing session, lineage, graph, finding, candidate, and text-key sources; raw aliases never enter the ledger; collisions emit observer telemetry while the exact legacy result is returned |
| Deterministic replay | Repeated reduction of one verified five-event prefix produced four entities and byte-identical projection and descriptor bytes; tampered frames and future event versions fail explicitly |
| Downstream contract | Identity-bearing payloads require a registered typed `subject_ref` and optionally resolve typed lineage and mode-session refs without mode-local regeneration |

### Lifecycle Decision Table

| Boundary | Identity action | Durable evidence |
|----------|-----------------|------------------|
| New logical entity | Mint a new typed ID | `deep-loop.identity.minted` |
| Exact retry | Return the recorded ID | Existing mint-token binding; no second domain event |
| Resume or handover | Retain the logical ID | New attempt plus exact typed frontier and replay cursor |
| True restart | Mint a child | `continues_from` relationship |
| True fork | Mint a child | `forked_from` relationship |
| Cross-mode transfer | Retain the subject ID | Source/target mode-session boundary event |

### Producer and Consumer Manifest

| Current source | Observed coordinate | Disposition |
|----------------|---------------------|-------------|
| `continuity-thread.cjs:69-100` | Normalized question text, iteration, content ordering | Keep authoritative; dark alias as `legacy-continuity-text` |
| `reduce-state.cjs:628-754` | Run/severity/index summary IDs and content/file/title dedupe | Keep authoritative; dark finding alias |
| `session-state-hierarchy.cjs:69,104,143` | Topic index, round number, timestamp session | Keep authoritative; dark session alias |
| `fanout-run.cjs:1879` | Lineage label plus run ID session | Keep authoritative; dark lineage/session alias |
| `jsonl-repair.ts:110-122` | Type/iteration/focus/id composite | Keep authoritative; optional dark alias only |
| `coverage-graph-db.ts:236-249` | Spec/loop/session/id composite primary key | Keep authoritative; dark graph-node alias |
| Resume and handover consumers | Mode-local or regenerated references | New dark typed frontier; later cutover consumer |
| Claim continuity and authority cutover | Stable typed subject reference | Downstream owner; no behavior implemented here |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation consumes the canonical envelope registry and read/write boundary at `event-type-registry.ts:585` and `event-envelope-boundary.ts:320,360`; the gateway, single-use append, verified reader, dark adapter, and typed reducer at `transition-authorization-gateway.ts:524-554`, `append-only-ledger.ts:306-347`, `dark-ledger-adapter.ts:110-156`, and `deterministic-reducer.ts:44-110`; and replay fingerprinting at `derive-replay-fingerprint.ts:572`. None of those substrate files changed.

The runtime exposes a standalone factory only. It does not import into or alter any existing writer, reader, state reducer, graph adapter, or mode dispatcher. Rollback is path-scoped removal or `git revert` of the new module and test; any already-recorded append-only events remain inert audit history.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Derive the opaque ID from a hashed random mint token only | Exact retries recover one ID while mutable content and coordinates cannot become identity inputs |
| Persist mint parent semantics in the immutable identity record | Reusing one token with a different continuation/fork contract must conflict, including concurrent retries |
| Store only hashed namespaced aliases | Legacy coordinates remain resolvable without leaking prompt text, paths, labels, or local IDs into the new ledger |
| Require exact-current-head frontier restoration | Dispatching from a stale handover can silently fork state; fail-closed restoration makes the caller rebuild explicitly |
| Keep v1 closed with no speculative upcaster | No historical continuity event version exists; unsupported future versions reject at the canonical read boundary |
| Keep the runtime dark and standalone | Legacy remains canonical until the planned authority-cutover phase; this leaf produces evidence, not migration |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused Vitest | PASS, exit 0: 1 file and 20 tests passed in 19.65 seconds |
| Runtime TypeScript project | PASS, exit 0: `tsc -p .opencode/skills/system-deep-loop/runtime/tsconfig.json --noEmit` |
| Targeted strict TypeScript closure | PASS, exit 0 across the six continuity modules |
| Comment hygiene | PASS, exit 0 across six modules and the focused test |
| Alignment drift | PASS, exit 0: 6 files scanned, 0 findings, 0 errors, 0 warnings |
| Deterministic replay fixture | PASS: 5 domain events, 4 entities, projection `5ba6b0f495bd7880c12ca11a5acf47906f5af6357cadce01dd2c7ebe4114df04`, final fingerprint `ffad1b34fa165ac51b905a39987ccf08b5e227c1490770fb3713593451683649`, terminal head `e3b0cc20f56bf5c56d69ffbfa1ca8d496adaa71c856d1cf8ff11d35ccaf56962` |
| Additive-dark path check | PASS: path-scoped status contains only the new continuity module, focused test, and this leaf's docs; consumed substrate and all inventoried existing writers have no mutation |
| Full runtime suite | NOT USED as this leaf's gate: the known baseline has about 100 unrelated failures from missing `better-sqlite3` and kebab-case fixture mismatches; no baseline repair was attempted |
| Strict leaf validation | PASS, exit 0: Errors 0 and Warnings 0 after metadata refresh |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Dark only.** The factory is deliberately not wired into shipped writers or readers. Legacy behavior remains canonical until the planned authority-cutover phase.
2. **Closed v1 history.** No legacy continuity-event schema exists to upcast. Unknown and future event versions fail explicitly.
3. **Focused suite is the leaf gate.** The unrelated full-suite baseline remains owned by its separate runtime gate; this work neither changes nor masks those failures.
<!-- /ANCHOR:limitations -->
