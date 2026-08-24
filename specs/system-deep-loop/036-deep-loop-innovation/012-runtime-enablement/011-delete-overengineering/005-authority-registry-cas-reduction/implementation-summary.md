---
title: "Implementation Summary: Phase 005 Authority Registry CAS Reduction"
description: "F7 CAS-mutator reduction of authority-registry.ts plus the resequenced F4 flip runner, with the read path and lock family kept byte-for-byte and gate evidence."
trigger_phrases:
  - "phase 005 authority registry cas reduction"
  - "authority registry mutators removed"
  - "flip-authority removed"
importance_tier: "normal"
contextType: "implementation"
status: complete
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/005-authority-registry-cas-reduction"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/005-authority-registry-cas-reduction"
    last_updated_at: "2026-08-25T00:30:00Z"
    last_updated_by: "claude"
    recent_action: "Reduced authority-registry CAS mutators plus F4 flip runner; auth 8/8 green"
    next_safe_action: "Program complete; validate recursive then stop for operator ff-merge gate"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The read path and full lock-reclaim family were kept byte-for-byte; only the four CAS mutators, their private lock-path helper, and three orphaned input interfaces were removed"
---
# Implementation Summary: Phase 005 Authority Registry CAS Reduction

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-authority-registry-cas-reduction |
| **Completed** | 2026-08-24 |
| **Level** | 2 |
| **Actual Effort** | 1 reduction wave (orchestrator-executed; high-adjacency, boundary-asserted) |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Reduced `lib/per-mode-authority-flip/authority-registry.ts` (F7) — the last and highest-adjacency wave of
the over-engineering removal program. The registry had two faces: a read path every live consumer depends
on, and a CAS write/mutate path whose only production callers were the one-time rollout/flip tooling. With
all eight modes finalized, the write path is dead. The four CAS mutators, their private per-mode lock-path
helper, and three now-orphaned input interfaces came out (637 → 298 LOC); the read path, the whole
lock-reclaim family, and the pending-transition trio stayed byte-for-byte.

The resequenced F4 (`flip-authority.cjs`) was removed here too, together with its two test files, so the
`authority-finalize.vitest.ts` file — which tested both `flip-authority.cjs` and the F7 mutator — could be
deleted whole rather than split across two waves.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `lib/per-mode-authority-flip/authority-registry.ts` | Modified | Removed 4 CAS mutators + `#writeRollbackFinalRecord` + `#lockPath()` + 3 input interfaces; kept read path + lock family + pending trio |
| `lib/per-mode-authority-flip/index.ts` | Modified | Dropped `AuthorityPrepareCutoverInput` + `AuthorityCompareAndSwapRollbackInput` from the type-export barrel |
| `tests/unit/per-mode-authority-flip.vitest.ts` | Modified | Removed the CAS test blocks; kept read/lock/selector coverage; dropped 3 now-unused imports |
| `tests/integration/deep-research-postflip-fanout.vitest.ts` | Modified | Rewrote `flipAuthority()` to seed the post-flip record directly (§9.3) instead of via the removed CAS API |
| `tests/unit/authority-finalize.vitest.ts` | Deleted | Whole file — every describe tested a removed target |
| `scripts/flip-authority.cjs` | Deleted | F4 (resequenced from phase 004) — the one-time flip runner |
| `tests/unit/flip-authority-cli.vitest.ts` | Deleted | F4 — tests the deleted runner |


<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Because this file sits next to the fail-closed authorization gateway, the registry reduction was applied
with a boundary-asserted transform rather than a hand-typed multi-hundred-line edit: a script that asserts
the exact content at every removal boundary before deleting, so a mismatch aborts loudly with no partial
edit — which is what happened once (a box-drawing banner's dash count), leaving the file untouched until the
assertion was corrected. The same technique removed the interleaved CAS test blocks.

The one live survivor the audit's F7 write-up missed — `deep-research-postflip-fanout.vitest.ts`'s
`flipAuthority()`, which drove the record through `prepareCutover` + `compareAndSwap` — was rewritten to
construct the target `AuthorityRecord` directly and write it with `writeCanonicalJsonAtomic`, reproducing
the registry's own integrity digest (`sha256Bytes(canonicalBytes(core))`). All edits landed in one
working-tree state, so no intermediate broken commit exists. The orchestrator performed the removal
directly (the named cli-devin remover was blocked by the permission classifier; operator-approved) and ran
every gate.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep the read path + full lock-reclaim family + pending trio byte-for-byte | They are load-bearing for the live loop; only the CAS write path was dead (spec §8 KEEP LIST) |
| Rewrite `flipAuthority()` rather than delete it | It seeds a fixture the fan-out integration still needs; only its CAS-driven construction was dead |
| Remove `#lockPath()` but keep `#transactionLockPath()` | `#lockPath` (per-mode CAS lock) was called only by the removed mutators; `#transactionLockPath` backs the kept `withTransactionLock()` |
| Boundary-asserted transform over a giant hand-edit | On a high-adjacency file, a loud abort-on-mismatch beats a silent typo in a 300-line edit string |
| Leave the unused `seedAuthorityRecord()` test helper | Removing it is outside the spec's enumerated edit list (scope-lock) |


<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Typecheck | Pass | - | 56 → 56 errors, 0 `TS2307`, no new error on any removed symbol |
| Authority (critical) | Pass | 8/8 modes | All `new_authoritative_final`, `allOnLedger` true, epoch 3 — unchanged by the reduction |
| Targeted tests | Pass | 24/24 | `per-mode-authority-flip.vitest.ts` + `deep-research-postflip-fanout.vitest.ts` both green |
| Suite | Pass | - | Failing set unchanged by name vs baseline |
| Residue | Pass | - | Removed method calls / interfaces / `#lockPath` / `#writeRollbackFinalRecord` all zero non-deleted refs |
| KEEP fidelity | Pass | - | Read path + lock family + pending trio confirmed present; kept anchors grepped |


<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR | Target | Actual | Status |
|-----|--------|--------|--------|
| Authorization boundary intact | Read path + lock family unchanged | Kept byte-for-byte; authority 8/8 final | Pass |
| No live-loop regression | Reducers/gateway/projections untouched | tsc 0 `TS2307`; suite no new failures | Pass |
| Scope containment | Only the CAS write path ± F4 and the survivor rewrite | 3 deletions, 4 edits; KEEP surface intact | Pass |


<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`seedAuthorityRecord()` in `per-mode-authority-flip.vitest.ts` is now unreferenced** — left in place because removing it is outside this wave's enumerated edit list. A trivial follow-up if desired.
2. **`AuthorityPendingTransition`'s JSDoc still says "Every durable fact `compareAndSwap` needs…"** — the pending trio is an explicit do-not-touch KEEP surface (§8), so its comment was left as-is despite the now-removed `compareAndSwap` reference.
3. **Realized removal (~830 LOC) far exceeds the parent PHASE MAP's provisional "~500"** for this row (spec §9.5).
<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| F7 only (per the parent PHASE MAP's original 005) | F4 + F7 together | F4 (`flip-authority.cjs`) was resequenced from phase 004 because it shared the `authority-finalize.vitest.ts` test file with the F7 mutator (spec §2) |
| GLM-5.2-High (cli-devin) performs the reduction | Orchestrator performed it directly | The cli-devin dispatch was blocked by the Claude Code permission classifier; operator approved direct removal with identical verification |

<!-- /ANCHOR:deviations -->
