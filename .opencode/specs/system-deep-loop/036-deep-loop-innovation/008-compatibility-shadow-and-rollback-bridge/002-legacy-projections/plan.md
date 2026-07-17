---
title: "Implementation Plan: Legacy Projections"
description: "Implementation plan for deterministic dark-ledger folds into byte-identical legacy JSONL and JSON artifacts."
trigger_phrases:
  - "legacy projections implementation plan"
  - "dark ledger projection plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/002-legacy-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/002-legacy-projections"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned census-driven folds, refresh timing, and byte-parity gates"
    next_safe_action: "Build the projection manifest from the frozen phase-003 census"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Legacy Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime compatibility bridge |
| **Change class** | Additive dark projection and legacy-contract preservation |
| **Execution** | Census-driven implementation against immutable BASE and verified phase-006 ledger fixtures |

### Overview
Implement one versioned projection registry whose entries fold a verified dark-ledger prefix into an exact legacy
artifact contract. The work starts from the phase-003 schema census, binds each artifact to its existing serializer,
refresh trigger, writer boundary, and readers, then proves full-rebuild and incremental byte identity in a shadow
root. Live legacy writers and paths remain untouched; successor `003-shadow-parity-harness` consumes the resulting
artifact/digest pairs.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-003 census is frozen and every candidate JSONL/JSON surface has writer and reader traceability
- [ ] Phase-006 fixtures expose a verified ledger head, typed events, authorization linkage, and deterministic ordering
- [ ] BASE fixtures capture exact legacy bytes and publication behavior for every projection-manifest row
- [ ] Shadow-root path isolation and live-target rejection are defined before any projector opens an output
- [ ] Projection and reducer versions have a stable identifier included in watermarks and parity reports

### Definition of Done
- [ ] Every census-owned legacy surface has one projection contract or a disposition with an owning later phase
- [ ] Full and incremental folds are byte-identical at every tested ledger head
- [ ] JSONL immediate append and snapshot atomic/coalesced refresh semantics match their legacy writers
- [ ] Restart, duplicate, corruption, and crash fixtures advance no invalid watermark and mutate no live path
- [ ] Existing readers pass unchanged against the complete projected fixture tree
- [ ] The successor parity harness receives deterministic evidence bound to BASE and exact ledger heads
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Projection manifest**: generated from the phase-003 census, with artifact identity, path class, schema/version,
  writer, readers, fold, serializer, refresh trigger, baseline bytes, repair semantics, and archival obligation.
- **Verified fold input**: `(BASE anchor, ledger identity, verified head, ordered typed events, projection version,
  configuration)`. Unknown or unverified input stops before staging output.
- **Pure reducers**: rebuild a legacy semantic state without consulting mutable live legacy files. Incremental mode is
  an optimization checked against full replay, never a separate authority.
- **Legacy serializers**: reuse or extract today's row/object construction and serialization. Hash canonicalization
  remains an integrity concern; it does not replace insertion-ordered legacy output.
- **Publication adapters**: JSONL uses immediate append, fsync, expected-head, and terminal-newline rules. Snapshots use
  stage + fsync + atomic rename; debounce is allowed only for census rows whose current writer already coalesces, with
  explicit `flushNow()`/close behavior.
- **Projection watermarks**: durable records bind artifact ID, ledger head, projection/reducer version, BASE digest,
  prior watermark, and projected digest. Watermarks advance only after output durability.
- **Shadow namespace guard**: output resolution is rooted under an isolated fixture/shadow directory, rejects symlink
  escapes and live legacy targets, and keeps legacy writers authoritative throughout phase 008.
- **Parity handoff**: emit per-head expected bytes, projected bytes, hashes, timings, reader results, and typed mismatch
  classifications for `003-shadow-parity-harness`.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Freeze the phase-003 census and BASE artifact fixtures; reject unresolved schema, writer, reader, or path rows.
- Inventory projection boundaries in `atomic-state.ts` and each censused writer, including serialization and refresh rules.
- Define projection registry, watermark, shadow-root, mismatch, and fixture schemas.

### Phase 2: Implementation
- Implement pure full-rebuild folds and versioned registry dispatch for every manifest row.
- Extract or reuse legacy serializers for JSONL rows, replace-style JSON, dashboards, registries, and resume inputs.
- Implement incremental projection with expected-head checks and equivalence to full rebuild.
- Implement immediate JSONL publication and atomic snapshot publication with census-authorized coalescing only.
- Persist watermarks after output durability; add restart, duplicate-head, and torn-shadow recovery.
- Enforce shadow-root confinement and fail closed on corrupt, unknown, unauthorized, or version-mismatched ledger input.
- Produce the parity artifact bundle without modifying a live legacy file or reader.

### Phase 3: Verification
- Prove census closure: every legacy JSONL/JSON writer-reader row has exactly one projection disposition.
- Compare exact bytes at every selected ledger head for full rebuild and incremental refresh.
- Verify JSONL ordering/no-op suppression and snapshot indentation/newline/integrity/atomic replacement.
- Exercise process restart, duplicate event/head, projection-version change, crash before/after fsync, and corrupt tail.
- Run every unchanged dashboard, resume, registry, and tooling reader against projected fixture trees.
- Confirm the shadow-parity handoff binds BASE, ledger head, projection version, expected digest, and actual digest.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare the projection manifest with the phase-003 schema/state census; fail on missing, duplicate, or unowned rows |
| REQ-002 | Run clean full replays and restarted incremental replays for the same verified heads; compare artifact digests |
| REQ-003 | Byte-compare snapshot fixtures for insertion order, indentation, terminal newline, omitted fields, integrity, and atomic publication |
| REQ-004 | Byte-compare JSONL fixtures per head for row order, separators, newline, diff fingerprints, and no-op suppression |
| REQ-005 | Use event/lifecycle timing fixtures to verify immediate JSONL append, allowed snapshot coalescing, final flush, and publication order |
| REQ-006 | Re-run committed heads across process restarts and injected crashes; assert no duplicate bytes and monotonic durable watermarks |
| REQ-007 | Attempt traversal, symlink escape, and direct live-target projection; require refusal before file open and zero live mutation |
| REQ-008 | Inject gap, fork, hash mismatch, unknown type/version, bad authorization, and reducer mismatch; assert no publication or watermark advance |
| REQ-009 | Run all census-linked reader commands unchanged against BASE and projected fixture roots; compare outputs and exit behavior |
| REQ-010 | Validate the handoff bundle schema and reproduce each expected/projected digest pair from its pinned ledger head |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This leaf declares `depends_on: []`; adjacency is navigation among independently authored sibling planning contracts.
Execution consumes the frozen census from
`003-baseline-taxonomy-and-state-census/spec.md`, the verified ledger contract from
`006-transition-authorized-ledger-core/002-typed-append-only-ledger/spec.md`, the migration posture in
`manifest/phase-tree.json`, and shipped publication behavior in
`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts`. The predecessor adapter contract supplies
the compatibility boundary at the phase-008 parent gate; the successor parity harness consumes this phase's outputs.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All implementation is additive and shadow-root confined. Rollback disables the projector, removes only disposable
shadow artifacts and watermarks, and leaves live legacy writers, readers, and files untouched. A failed projector or
parity result blocks later cutover evidence; it cannot trigger an authority change. BASE fixtures and ledger history
remain immutable, allowing the projection to be rebuilt after a corrected reducer or serializer version lands.
<!-- /ANCHOR:rollback -->
