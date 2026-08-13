---
title: "Implementation Summary: Legacy Projections"
description: "Additive-dark, byte-faithful projections from verified authorized-ledger heads into isolated legacy JSONL and JSON shadow artifacts."
trigger_phrases:
  - "legacy projections implementation"
  - "legacy projection verification evidence"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/002-legacy-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/002-legacy-projections"
    last_updated_at: "2026-07-21T02:54:06Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the additive-dark legacy projection bridge"
    next_safe_action: "Commit the path-scoped candidate when authorized"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/legacy-projections/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/legacy-projections.test.ts"
    completion_pct: 100
---
# Implementation Summary: Legacy Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-legacy-projections |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Status** | Implemented and verified in the working tree |
| **Phase-003 BASE SHA** | `fe6ca3030917073f3b478bc044e10034dcc4394b` |
| **Worktree HEAD** | `012652b479dee08455de574574c5e7a8971a8b0b` |
| **Authority posture** | Dark and disposable; legacy writers, files, readers, and control flow remain canonical |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The runtime now folds only verified `AppendOnlyLedger` prefixes from an immutable BASE anchor into exact legacy bytes,
checks those bytes against an explicit legacy oracle, and publishes them only beneath an isolated shadow root. The
projection inventory closes all 28 JSON-bearing phase-003 state-census rows: 22 are projectable through versioned fold
contracts and six immutable or source-owned inputs remain explicitly legacy-owned.

### Runtime modules

| Module | Contract |
|--------|----------|
| `legacy-projection-errors.ts` | Stable typed failures with bounded artifact, head, version, and invariant context |
| `legacy-projection-types.ts` | BASE, fold, serializer, watermark, observation, parity receipt, and engine contracts |
| `legacy-projection-manifest.ts` | Frozen 28-row census inventory, exact paths/owners/readers/fixtures, dispositions, publication rules, and manifest digest |
| `legacy-projection-fold.ts` | Verified-prefix validation, deterministic double fold, exact insertion-ordered JSON/JSONL serializers, and BASE checks |
| `shadow-projection-store.ts` | Shadow-only path guards, durable JSONL append, atomic snapshot replacement, monotonic watermarks, and crash recovery |
| `legacy-projection-engine.ts` | Fail-closed orchestration and bounded refresh/head/lag observations |
| `index.ts` | Public runtime surface |
| `legacy-projections.test.ts` | Focused 15-test contract and adversarial suite |

### Adversarial property proofs

| Property | Proof |
|----------|-------|
| Byte-faithful output | The oracle digest must equal projected bytes before a target is prepared; JSON uses insertion order, two spaces, and one terminal newline, while JSONL preserves row/key order and separators. All 22 frozen event-stream shapes are serialized byte-for-byte. |
| Derived, never authoritative | Every target is relative to a declared shadow root. Traversal, direct overlap, symlinks, non-regular files, and hard-link aliases reject. Focused fixtures assert the authoritative legacy file remains byte-identical on success and every tested failure. |
| Observable failure | Every attempt returns a typed result and emits bounded status, ledger head, watermark, lag, duration, code, and invariant telemetry. Observation-sink failures cannot affect projection control flow. |
| Trusted inputs only | The engine requires the concrete verified `AppendOnlyLedger`; it rejects structural lookalikes. The fold rechecks the closed hash-chain prefix, receipt/event linkage, authorization epoch, supported event versions, and BASE bytes/digest/head. It consumes the shared phase-006 `DerivedReplayFingerprint` and validates its exact range, reducer/schema identities, initial-state and projection digests, descriptor bytes, and final commitment. |
| Determinism | Reducer state is cloned/frozen and folded twice. Serializer bytes are repeated independently. Semantic or insertion-order drift fails before publication. |
| Durable progress | JSONL suffixes use durable append; snapshots and watermarks use fsync-backed atomic replacement. Watermarks record prior and current heads/digests and advance only after output durability. Restart, no-op, regression, torn shadow, pre-commit crash, and output-before-watermark crash fixtures pass. |
| Successor parity evidence | Receipts bind manifest digest, BASE SHA/digest, exact ledger head, fold/projection/reducer/serializer identities, expected/projected bytes and digests, refresh boundary, publication result, replay fingerprint, and timestamp. Typed errors supply mismatch classifications. |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change is additive and dark. It imports the shipped phase-006 event envelope, authorized ledger, and replay
fingerprint implementation plus the existing atomic-state and durable-append routines. It does not change or wrap an
existing legacy writer or reader, does not write a live legacy path, and exposes no authority-switch API. Rollback
disables the projector and deletes only its disposable shadow root; rebuilding from BASE and a verified ledger head
restores it.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Require an explicit expected-byte oracle | Semantic JSON equality cannot prove insertion order, whitespace, newline, omitted-field, or integrity-field compatibility |
| Keep full replay as the only semantic path | Incremental publication may append a verified byte suffix, but reducer state is always disposable and rebuilt from BASE |
| Record prior watermark identity | Recovery can distinguish unchanged, output-durable/watermark-missing, regression, and same-head conflict states |
| Reject every multiply linked target | A hard-linked shadow file could otherwise append into a live authoritative inode |
| Retain six census inputs under legacy ownership | Operator inputs and source-owned benchmark evidence are not ledger-derived; inventing folds would create false authority |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused Vitest | PASS, exit 0: 1 file and 15 tests passed |
| Mutation falsifier | PASS: disabling the byte-oracle guard produced exit 1 at the intended parity assertion; the guard was restored and the suite returned green |
| Runtime TypeScript | PASS, exit 0: `tsc --noEmit -p runtime/tsconfig.json` |
| Phase-003 census, static | PASS, exit 0: 22 fixture streams, 46 state backends, zero projection mismatches, zero discovery orphans, zero writes |
| Phase-003 census, execute | PASS, exit 0: 22 streams materialized, shipped round-state readers executed, rollback fixtures restored, zero tracked-scope mutations |
| Alignment drift | PASS, exit 0: seven runtime files, zero findings |
| Comment hygiene | PASS, exit 0 across all new runtime and focused test files |
| Strict packet validation | PASS, exit 0: Errors 0, Warnings 0 after scoped description and graph-metadata refresh |

### Evidence anchors

| Evidence | Digest or observation |
|----------|-----------------------|
| Focused test file | SHA-256 `0cf7cda9ce0966cdb43cb3ad79b66c683ce509c1a9feb06311f3769c0faf9bd0` |
| Frozen event-stream fixtures | SHA-256 `2187aca49c5ef8f50d2d5115aec98adda3451930f62391d125cb94b088a19b9d` |
| Frozen state census | SHA-256 `e35a707bc969f075e1e4fb0558a9b211f48c526a47d7d0a121e8712d54bb9441` |
| Additive-dark proof | Leaf-scoped status contains only the new `legacy-projections` runtime directory, its focused test, and this leaf's documentation; consumed substrate and existing writers/readers have no leaf diff |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Dark only.** Projection parity cannot move read or write authority. Phase 014 owns any authority switch.
2. **Full-suite baseline is not this leaf's gate.** The repository-wide runtime suite was not run because the user-pinned baseline has roughly 100 known failures from missing `better-sqlite3` and kebab-case fixture names. The focused 15-test suite and runtime typecheck are green.
3. **Shared worktree activity is visible.** A concurrent sibling `001-upcasters-and-dual-read-adapters` candidate is also present in the worktree. This leaf did not read as authority from, edit, or include those sibling files; scope proof is path-filtered.
4. **No commit was created.** The user requested implementation and verification, not a commit or push.
<!-- /ANCHOR:limitations -->
