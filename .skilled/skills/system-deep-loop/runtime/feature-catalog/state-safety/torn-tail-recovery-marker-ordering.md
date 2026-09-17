---
title: "Torn-tail recovery marker ordering"
description: "Writes the durable torn-tail recovery marker before renaming the torn frame into quarantine, and replays an interrupted move by digest match on restart."
trigger_phrases:
  - "torn-tail recovery marker ordering"
  - "torn-tail-recovery-marker-ordering"
  - "torn-tail recovery marker ordering runtime"
  - "state safety torn-tail recovery marker ordering"
version: 1.4.0.15
---

# Torn-tail recovery marker ordering

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Writes the durable torn-tail recovery marker before renaming the torn frame into quarantine, and replays an interrupted move by digest match on restart.

This feature belongs to the state safety group and is catalogued as F052 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

`quarantineTornTailUnlocked()` used to `renameSync` the torn final frame into `quarantine/` first and only then write the `O_EXCL` recovery marker, leaving a window where a crash produced a quarantined file with no durable record explaining it. The ordering is now inverted: the quarantined digest is computed from the candidate bytes already in memory, the complete recovery record (including `quarantined_file`, `quarantined_digest`, and `recovery_hash`) is built, the marker is written with `O_CREAT|O_EXCL|O_WRONLY|O_NOFOLLOW` plus `writeFileSync`/`fsyncSync`/`closeSync`, and `fsyncDirectory()` on the recoveries directory makes the marker durable before `renameSync` moves the bytes into `quarantine/`, `chmodSync`, and fsyncs the frames and quarantine directories.

`readRecoveryEvidenceUnlocked()` gained one replay branch: when a valid marker exists but its quarantine file does not, it looks for the still-unmoved frame at that sequence, compares its bytes against the marker's recorded `quarantined_digest`, and on an exact match completes the interrupted rename. Any other case throws the pre-existing byte-preservation integrity error (`FRAME_HASH_MISMATCH`), unchanged. The digest pins exactly which bytes may move, so replay can never quarantine the wrong frame.

A crash during the marker write itself still leaves a partial marker that fails the trailing-newline and recovery-hash checks in `readRecoveryEvidenceUnlocked()` -- that window is unchanged by this work because it existed identically under the old ordering.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/authorized-ledger/immutable-frame-store.ts` | Runtime | torn-tail recovery marker ordering. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/authorized-ledger.vitest.ts` | Test | Primary regression coverage for Torn-tail recovery marker ordering. |

---

## 4. SOURCE METADATA

- Group: State safety
- Canonical catalog source: `feature-catalog.md`
- Feature ID: F052
- Feature file path: `state-safety/torn-tail-recovery-marker-ordering.md`
- Source phase: `.opencode/specs/system-deep-loop/036-deep-loop-innovation/005-blocker-closeout/004-durable-write-boundaries`
- Primary sources: `lib/authorized-ledger/immutable-frame-store.ts`, `tests/unit/authorized-ledger.vitest.ts`
Related references:
- [state safety](../../feature-catalog/state-safety) — State safety category
