---
title: "Feature Specification: Legacy Projections"
description: "Plan deterministic folds from the verified dark ledger into byte-identical legacy JSONL and JSON artifacts, preserving every existing reader while legacy authority remains unchanged."
trigger_phrases:
  - "legacy projections"
  - "dark ledger legacy shapes"
  - "byte-identical JSONL projection"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/005-compatibility-shadow-and-rollback-bridge"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/005-compatibility-shadow-and-rollback-bridge/002-legacy-projections"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the legacy projection contract for byte-identical dark-ledger folds"
    next_safe_action: "Execute the phase-000 projection manifest and byte-parity fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Legacy Projections

> Phase adjacency under `005-compatibility-shadow-and-rollback-bridge` (navigation order, not a hard runtime dependency): predecessor `001-upcasters-and-dual-read-adapters`; successor `003-shadow-parity-harness`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/005-compatibility-shadow-and-rollback-bridge/002-legacy-projections |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Legacy-projection child of the phase-005 compatibility, shadow, and rollback bridge |
| **Depends on** | None (`[]`); sibling contracts compose at the phase-005 parent gate |
| **Authority posture** | Shadow-only; legacy writers and legacy paths remain authoritative |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The phase-003 spine introduces an immutable, typed append-only ledger that records in parallel while the shipped
legacy JSONL and replace-style JSON paths remain authoritative. Existing consumers do not read that ledger. They read
the exact state files, checkpoints, dashboards, registries, and resume-facing artifacts catalogued by the phase-000
schema and state census. Changing those readers during the compatibility window would multiply the migration surface
and violate the program's additive-dark invariant.

This phase defines legacy projection as a deterministic fold over a verified ledger prefix. For a declared ledger
head, reducer version, baseline anchor, and projection contract, the fold must reproduce the exact bytes today's
legacy writer would have produced: field presence, insertion order, whitespace, newline policy, row order, diff
suppression, integrity fields, and publication boundary. The projection is evaluated in an isolated shadow namespace
and never overwrites an authoritative legacy path in phase 005. Existing readers therefore continue unchanged against
the live legacy writer while the dark spine proves it can render their contracts faithfully.

The design is grounded in the phase-000 census contract, the phase-003 typed-ledger contract, the program phase tree,
and `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts`. That runtime module makes a critical
distinction the projection must preserve: JSON snapshots use pretty replace-style atomic writes, while JSONL rows use
immediate fsynced append and must not pass through the debounced snapshot path.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Derive a closed projection manifest from the executed phase-000 census. Every legacy JSONL/JSON surface records its
  path class, schema, writer, readers, baseline fixture, serialization rules, refresh trigger, ordering semantics,
  repair behavior, and archival-read obligation.
- Define projection as a pure fold from a verified phase-003 ledger prefix plus an explicit BASE anchor and versioned
  reducer/projection contract; no projection reads mutable live legacy output as hidden reducer state.
- Project the census-owned legacy shape classes: append-only JSONL state/event logs; replace-style JSON snapshots and
  checkpoints; dashboard and observability JSON; registries and inventories; and JSON/JSONL inputs used by resume and
  other unchanged tooling.
- Reuse or extract each legacy serializer and publication routine. Canonical ledger bytes are not a substitute for
  legacy bytes because canonical hash ordering can differ from insertion-ordered `JSON.stringify` output.
- Define event-triggered and lifecycle-triggered refresh semantics, per-artifact projection watermarks, restart-safe
  idempotency, crash recovery, bounded lag telemetry, and the same observable publication order as the current writer.
- Produce byte-parity fixtures keyed by BASE for full rebuild and incremental refresh, including no-op transitions,
  process restart, torn shadow output, and unknown or corrupt ledger records.
- Keep all projected files in an isolated shadow root during this phase; successor `003-shadow-parity-harness` owns
  comparison and later cutover phases own any authority change.

### Out of Scope
- Modifying any existing dashboard, resume-ladder, registry, reducer, or other legacy reader.
- Writing projected output over a live authoritative legacy file, disabling a legacy writer, or changing authority.
- Defining the event envelope, ledger framing, authorization proof, or replay fingerprint owned by phase 003.
- Defining upcasters or dual-read/single-write adapters owned by predecessor `001-upcasters-and-dual-read-adapters`.
- Owning parity adjudication, rollback drills, in-flight-state classification, mode cutover, or legacy retirement.
- Guessing legacy surfaces not yet resolved by the phase-000 census; an unclassified surface blocks manifest closure.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Projection coverage is census-complete | Every JSONL/JSON surface in `000-baseline-taxonomy-and-state-census/spec.md` maps to exactly one projection contract or an explicit non-projectable disposition with an owning later phase; zero reader or writer rows remain unclassified |
| REQ-002 | Each projection is a deterministic fold over trusted inputs | The same verified ledger head, BASE anchor, projection version, and configuration produce the same artifact digests across clean rebuilds and process restarts |
| REQ-003 | Legacy snapshot output is byte-identical | Replace-style JSON matches the BASE oracle for key order, two-space indentation, terminal newline, omitted fields, integrity stamp, and atomic publication behavior |
| REQ-004 | Legacy JSONL output is byte-identical | Full and incremental projections match row bytes, row order, separators, terminal newline, diff-field fingerprints, and unchanged-row suppression at every declared ledger head |
| REQ-005 | Refresh timing preserves each legacy observable contract | JSONL rows project immediately after a durable verified head; snapshots refresh at their censused writer boundary; any permitted coalescing preserves final flush and reader-visible ordering semantics |
| REQ-006 | Projection progress is monotonic and restart-safe | A durable watermark binds artifact ID, ledger ID/head, projection version, BASE digest, and output digest; replaying a committed head neither duplicates a row nor rewrites unchanged output |
| REQ-007 | Shadow publication cannot alter legacy authority | All phase-005 projection writes resolve under an isolated shadow root, and path guards reject live legacy targets before opening a file |
| REQ-008 | Invalid ledger input fails closed | A sequence gap, hash mismatch, unknown envelope/type/version, invalid authorization linkage, or reducer-version mismatch publishes no new projection and records a typed failure |
| REQ-009 | Every unchanged reader is represented in compatibility evidence | The manifest links dashboards, resume paths, registries, and other tooling to the exact projected artifacts they consume, with zero reader code changes required |
| REQ-010 | The successor receives reproducible parity inputs | `003-shadow-parity-harness` receives BASE fixtures, ledger-head identities, expected legacy bytes, projected bytes, per-artifact digests, refresh timestamps, and explicit mismatch classes |

### Projection coverage contract

| Legacy shape class | Fold output | Refresh and consistency rule | Byte-identity oracle |
|--------------------|-------------|------------------------------|----------------------|
| Append-only JSONL state/event logs | Ordered legacy rows derived from verified ledger events | Immediate after durable ledger head; no debounce; append only after expected-head and watermark checks | BASE row bytes, order, separators, newline, persisted diff field, and no-op suppression |
| Replace-style JSON snapshots/checkpoints | Complete legacy object for one ledger head | Stage, fsync, and atomic rename at the censused writer boundary; coalesce only where current semantics permit; flush at lifecycle exit | BASE insertion order, indentation, terminal newline, field omission, and integrity stamp |
| Dashboard and observability JSON | Reader-facing aggregate or snapshot | Refresh at the same event/lifecycle boundary and publish in the same observable order as today's writer | BASE bytes plus dashboard query/result parity |
| Registries and inventories | Whole-object registry projection | Atomic replacement after complete fold and integrity calculation; unchanged bytes skip the write | BASE bytes, `_integrity` behavior, and unchanged-write suppression |
| Resume and tooling inputs | The census-linked JSON/JSONL artifacts those readers already open | Never expose a head newer than the artifact's durable watermark; shadow paths only in phase 005 | Unmodified reader results against BASE and projected fixture trees |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The phase-000 census closes to a projection manifest with zero unclassified JSONL/JSON surfaces or readers.
- **SC-002**: Full rebuild and incremental refresh produce byte-identical legacy artifacts for every manifest row.
- **SC-003**: JSONL immediacy and snapshot atomic/coalescing semantics match `atomic-state.ts` and each censused writer.
- **SC-004**: Restart, duplicate-head, corruption, and crash fixtures prove monotonic idempotent projection without live-path mutation.
- **SC-005**: Every existing dashboard, resume, registry, and tooling reader passes unchanged against the projected fixture tree.
- **SC-006**: The shadow-parity successor receives deterministic artifacts and mismatch evidence bound to an exact ledger head and BASE.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The phase has `depends_on: []` as an independent sibling planning contract, but execution consumes the completed
phase-000 census and the verified phase-003 ledger reader. The highest risk is false byte parity from reserializing a
semantic object: `atomic-state.ts` canonicalizes keys for integrity hashing but writes snapshot JSON using the object's
insertion order. A projection that uses canonical ledger serialization for output can be semantically equal and still
break byte-sensitive readers, fingerprints, or parity checks. Each surface must therefore use its legacy serializer
contract and a BASE byte oracle.

Other risks are hidden dynamically constructed paths, allowing snapshot debounce on append-only JSONL, advancing a
watermark before bytes are durable, replaying from mutable legacy state, projecting an unverified ledger tail, and
letting shadow output collide with a live legacy target. The controlling sources are
`000-baseline-taxonomy-and-state-census/spec.md`,
`003-transition-authorized-ledger-core/002-typed-append-only-ledger/spec.md`, `manifest/phase-tree.json`, and
`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts`.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Execution must resolve the exact manifest rows, writer boundaries, and permitted snapshot
coalescing from the frozen phase-000 census. Any artifact whose serializer, authority, or refresh semantics remain
ambiguous is blocked from projection rather than assigned a guessed compatibility contract.
<!-- /ANCHOR:questions -->
