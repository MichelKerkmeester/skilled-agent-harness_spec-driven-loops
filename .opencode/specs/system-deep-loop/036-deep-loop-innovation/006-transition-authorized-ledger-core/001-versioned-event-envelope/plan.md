---
title: "Implementation Plan: Versioned Event Envelope"
description: "Implementation plan for the canonical deep-loop event envelope, deterministic type/version registry, strict validators, and read-time adjacent-version upcaster boundary."
trigger_phrases:
  - "versioned event envelope implementation plan"
  - "deep-loop upcaster registry plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined envelope fields, registry boundaries, upcast flow, and verification gates"
    next_safe_action: "Implement registry fixtures and mixed-version read tests before ledger integration"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Versioned Event Envelope

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime (program phase 006, child 001) |
| **Change class** | Additive-dark schema, registry, validation, and read compatibility foundation |
| **Execution** | Future runtime implementation in an isolated worktree pinned to the phase-003 BASE |

### Overview
Build one strict envelope module and one deterministic event-definition registry before the typed ledger exists. The module validates current write requests, serializes canonical bytes for authorization/append, parses stored rows, and upcasts supported historical payloads to the current in-memory shape. It preserves source bytes and immutable envelope fields, exposes typed failures, and leaves every shipped JSONL writer authoritative and unchanged. The design implements the compatibility rules already fixed by the phase-004 transition policy and provides the sole envelope contract consumed by `002-typed-append-only-ledger`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-004 transition/versioning policy is ratified and its `event_type`, `event_version`, upcaster, and fail-closed rules are treated as normative
- [ ] The phase-003 BASE and runtime writer census identify the shipped observability, council, iteration/audit, fan-out status, and generic JSONL boundaries
- [ ] The canonical outer field table, namespace grammar, version semantics, nullability, and unknown-field posture are frozen in tests before the first event type is registered
- [ ] Ownership is explicit: this child owns envelope/registry/upcast seams; `002-typed-append-only-ledger` owns persistence; the authorization child owns allow/deny decisions
- [ ] No legacy writer, reducer, projection, or authority switch is included in the implementation write set

### Definition of Done
- [ ] All current write requests validate and serialize through one canonical envelope API; caller-selected historical/future versions fail closed
- [ ] All supported historical read fixtures traverse deterministic adjacent upcaster chains and expose stored/effective forms plus hop provenance
- [ ] Unknown, duplicate, cyclic, incomplete, future, lossy, identity-mutating, and ambiguous cases return stable typed errors
- [ ] Representative shipped producer fixtures fit beneath the common `payload` field without changing their authoritative runtime files
- [ ] The successor ledger consumes the exported append-preflight/read result contracts without redefining envelope fields
- [ ] Strict spec validation, typecheck, targeted unit tests, deterministic replay fixtures, and the blocking SOL verification contract are green on the candidate SHA
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Wire contract**: a closed outer object with explicit `envelope_version`, namespaced `event_type`, per-type `event_version`, immutable identity/stream/time/producer/authority/correlation/causation/idempotency fields, and one typed `payload` object.
- **Definition registry**: exact `event_type` keys; one current version; a validator/required-field contract for every supported version; one pure adjacent upcaster for every non-current version; deterministic registry and chain identities.
- **Write seam**: construct from domain input plus ledger-assigned stream metadata, reject non-current or unknown versions, validate outer/current payload, canonicalize once, and return canonical bytes plus digest inputs. It performs no append and grants no authorization.
- **Read seam**: preserve raw stored bytes, parse and validate the stored envelope, resolve exact type/version, reject unsupported future values, run and validate every adjacent hop, validate the current payload, then return `{ stored, effective, upcast_trace }`.
- **Immutability boundary**: upcasters may change only the effective `payload` and increment the effective `event_version`; event ID, stream identity/sequence, timestamps, producer, authority epoch, correlation, causation, and idempotency identity remain byte-semantically stable.
- **Failure boundary**: parsing, registration, historical validation, chain resolution, hop execution, current validation, and canonical serialization each return a distinct stable error code; no fallback constructs a partial effective event.
- **Dark integration**: new modules and fixtures are additive. Existing writers in `.opencode/skills/system-deep-loop/runtime/` are evidence inputs only; adapters and live dual reads belong to program phase 008.

Read flow:

`stored bytes -> outer parse/validate -> exact type/version lookup -> historical payload validate -> adjacent upcast chain -> per-hop validate -> current payload validate -> stored + effective + trace`
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the implementation worktree to the phase-003 BASE and record the phase-004 policy digest used by the candidate.
- Inventory representative records and call sites from `observability-events.cjs`, `round-state-jsonl.cjs`, `executor-audit.ts`, `fanout-pool.cjs`, and `jsonl-repair.ts` without editing those files.
- Freeze the outer field grammar, event namespace, error taxonomy, registry invariants, canonicalization rule, and module ownership boundaries as failing contract tests.

### Phase 2: Implementation
- Add the envelope types/schema and strict stored/current validators.
- Add the deterministic event-definition registry with duplicate, gap, cycle, non-adjacent, and incomplete-definition rejection.
- Add the current-only write-preflight and canonical serialization result consumed by authorization and ledger siblings.
- Add the read entry point, adjacent upcaster-chain resolver, per-hop validation, immutable-field guard, stored/effective result, and ordered upcast trace.
- Add representative dark fixtures for shipped producer families and explicit typed errors without routing live legacy paths through the new modules.

### Phase 3: Verification
- Prove required outer-field rejection, exact discriminator resolution, current-only writes, and canonical byte stability.
- Prove `type@1 -> type@2 -> current` read behavior, per-hop validation, repeated-run determinism, stored-byte preservation, and registry/chain identity stability.
- Prove unknown outer/type versions, unsupported future event versions, missing links, cycles, duplicate registrations, invalid intermediate payloads, identity mutation, lossy conversions, and ambiguous defaults fail closed.
- Prove observability, council, audit/iteration, and fan-out status fixtures share the envelope while the authoritative runtime writers remain unchanged.
- Run typecheck, targeted unit/integration tests, strict packet validation, tracked-mutation checks, and the SOL verifier bound to the exact candidate SHA.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Table-driven outer-schema tests omit, mistype, empty, null, and add fields; every invalid record is rejected before append |
| REQ-002 | Fixtures vary outer and per-type versions independently and assert distinct resolution/error paths |
| REQ-003 | Namespace, exact-case lookup, duplicate registration, alias, and persisted-name stability tests |
| REQ-004 | Registry completeness tests enumerate validators and required fields for every supported type/version |
| REQ-005 | Write-preflight accepts only the registry current version and produces byte-stable canonical output |
| REQ-006 | Mixed-version fixtures assert the exact adjacent hop order and current effective result before reducer dispatch |
| REQ-007 | Repeat, frozen-clock/randomness, I/O-spy, event-emission-spy, and immutable-field differential tests constrain upcasters |
| REQ-008 | Raw-byte hash and stored-envelope deep-equality remain stable across successful upcasts and replay repetitions |
| REQ-009 | Unknown/future/gap/cycle/duplicate/invalid-hop/lossy/default fixtures assert typed errors and no effective event |
| REQ-010 | Contract tests pass canonical bytes and metadata directly into ledger/authorization test doubles with no reparsing |
| REQ-011 | Git diff and targeted legacy tests prove no shipped writer is changed or made non-authoritative |
| REQ-012 | Producer-family fixtures validate under one outer schema with all producer-native fields contained in `payload` |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This child declares no predecessor dependency (`depends_on: []`). Its normative planning inputs are the parent program invariants, `manifest/phase-tree.json`, and the phase-004 transition/versioning/rollback policy. Its implementation reads the pinned phase-003 runtime census and representative shipped writers. Its first consumer is sibling `002-typed-append-only-ledger`; authorization and replay-fingerprint children consume the same canonical-byte and registry/chain identity outputs. Program phase 008 later supplies legacy adapters and mixed-authority compatibility without changing this envelope contract.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The implementation is additive and dark: no authoritative writer, historical row, projection, or authority record is modified. Before any consumer append exists, rollback is a path-scoped `git revert` of the new envelope/registry modules and fixtures. After the typed-ledger sibling integrates, revert consumers before providers or disable the dark ledger feature path, retain all stored bytes, and keep legacy authority unchanged. Persisted discriminator or version semantics are never edited in place; a defective current schema is corrected with a new event version and adjacent upcaster, while a defective unpublished registry entry is removed only when no ledger record references it.
<!-- /ANCHOR:rollback -->
