---
title: "Implementation Summary: 029-improvement-promotion-authority"
description: "Authenticated append-only acceptance receipts bind promotion, rollback records a pre-restore hash, evaluator identity comes from the manifest profile, and topic-id traversal is rejected before any council write."
trigger_phrases:
  - "improvement promotion authority implementation"
  - "acceptance receipt binding evidence"
  - "deep loop 029 implementation summary"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/029-improvement-promotion-authority"
    last_updated_at: "2026-08-11T13:55:00Z"
    last_updated_by: "codex"
    recent_action: "Confirmed the 3-finding tail landed as f6cdf604a2; implementation is 13/13"
    next_safe_action: "Evidence the checklist and reconcile the ADRs."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs"
      - ".opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs"
    completion_pct: 77
    open_questions:
      - "Implementation is landed, but the packet checklist remains 0/50 and the three ADRs remain Proposed"
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

# Implementation Summary: 029-improvement-promotion-authority

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 029-improvement-promotion-authority |
| **Last implementation landing** | 2026-08-08 (`f6cdf604a2`) |
| **Level** | 3 |
| **Status** | IN PROGRESS — 13/13 implementation findings landed; checklist and ADR closeout remain open |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Eight P0 findings shared one mechanism: mutable local JSON was treated as authority. Promotion checked score status and thresholds but never `score.candidate`, `score.target`, or `score.inputHash`, so a stale score from an earlier revision could authorize promotion of a newer, unscored candidate. Ship verified only fields stored inside that same mutable acceptance JSON. The candidate authored the rubric it was scored against. Council persistence accepted degenerate roots and a payload output could follow planted symlinks. Ten scoped findings landed as `0d1827eef5`; the three-finding tail landed as `f6cdf604a2`, bringing implementation to 13/13. This does not close the packet: its evidence checklist remains unchecked and its ADR dispositions remain Proposed.

### T001 Confirmation and Landed Findings

| Finding | Landed | HEAD probe and disposition |
|---------|--------|-----------------------------|
| `F-017-01` | Landed | `promote-candidate.cjs:455` accepted evaluator receipts for a different artifact. Promotion now checks `score.candidate`, `score.target`, and `score.inputHash` against the acceptance receipt; a stale or cross-target score cannot authorize. |
| `F-017-02` | Landed | `promote-candidate.cjs:550` had no candidate or artifact-output containment. The archive directory is now confined to allowed roots alongside the target. |
| `F-017-03` | Landed | `promote-candidate.cjs:157` let ship trust a caller-forged acceptance receipt. `--approve` now requires a candidate-and-target-bound receipt path; a bare flag is rejected. |
| `F-017-04` | Landed | `f6cdf604a2` added acceptance-receipt authenticity at rollback, so a caller-supplied acceptance JSON without the matching receipt sidecar is rejected before either legitimate rollback hash branch is considered. |
| `F-017-05` | Landed | `score-candidate.cjs:535` let the candidate control evaluator identity and derived rubric. Agent identity is now resolved from the manifest profile id, not candidate frontmatter. |
| `F-021-01` | Landed | `deep-model-benchmark-auto.yaml:198` fabricated promotion approval in autonomous mode. `--approve` now carries the required receipt path, the counterpart to the bare-flag rejection. |
| `F-021-02` | Landed | `remediate-hook.cjs:87` did not enforce operator confirmation. The REMEDIATE hook now requires explicit confirmation at both the CLI and the module boundary; `state-machine-wiring.test.cjs` gained a red-before/green-after assertion. |
| `F-019-02` | Landed | `orchestrate-topic.cjs:48` let council topic identifiers traverse outside the packet. Topic ids containing path-traversal are now rejected/skipped in both `orchestrate-topic.cjs` and `orchestrate-session.cjs`. |
| `F-008-01` | Landed | `promote-candidate.cjs:518` let non-finite score values bypass promotion gates. Non-finite and absent score, delta, and aggregate fields now fail closed. |
| `F-008-02` | Landed | `sweep-benchmark.cjs:322` scored raw event JSON when assistant text was absent. A text-less event stream is now unscorable rather than scored as raw stdout. |
| `F-008-03` | Landed | `rollback-candidate.cjs:144` let direct rollback trust an unbound backup file. Direct rollback now records a pre-restore hash before copying; a missing backup fails closed. |
| `F-019-01` | Landed (calibrated closure) | `f6cdf604a2` rejects a filesystem root or symlink packet root before `mkdir`, while preserving legitimate real out-of-CWD packet roots. Full config-resolved root authority remains an ADR-003 design item. |
| `F-019-03` | Landed (calibrated closure) | `f6cdf604a2` rejects a symlink target or symlink parent for `--memory-save-payload-out`, closing the planted-symlink redirect without inventing an incompatible CWD boundary. |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Findings were fixed by shared mechanism (receipt binding, hash guards, containment, path-traversal and symlink rejection) rather than one patch per finding ID. The original batch landed 10 findings as `0d1827eef5`. After the first council-root attempt was reverted because it broke legitimate out-of-CWD callers, `f6cdf604a2` added the narrower calibrated guards and the missing rollback-receipt check. That tail commit records red-before/green-after coverage and reports council persistence 26/26 plus rollback/promotion regression 16/16.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bind promotion to an authenticated append-only acceptance receipt (evidence digests, target preimage, candidate snapshot, hashes) | A mutable local JSON that promotion trusts as authority lets a stale or forged state authorize copying bytes into canonical shipped targets. |
| Require `--approve` to carry a candidate-and-target-bound receipt path, not a bare flag | A bare approval flag is fabricatable by any caller; binding it to a receipt path makes approval traceable to a specific candidate and target. |
| Resolve evaluator identity from the manifest profile id, not candidate frontmatter | A candidate that authors its own evaluator identity can also author the rubric it is scored against. |
| Record a pre-restore hash before direct rollback copies, and fail closed on a missing backup | Rollback without a pre-restore hash cannot prove what it restored, and a missing backup silently copying nothing is worse than failing loudly. |
| Reject topic IDs containing path-traversal before any `mkdir` | Council topic identifiers reaching `mkdir` unfiltered let a caller-chosen id create directories outside the packet. |
| Revert the council-persistence confinement rather than ship a `process.cwd()`-scoped fix | The attempted fix confined writes to the process working directory instead of the packet root (redundant with the already-enforced `assertInside` boundary) and broke 12 legitimate out-of-cwd persistence tests. |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `deep-improvement` vitest suite | Zero new failures vs the `5c98` baseline; 54 pre-existing model/skill-benchmark failures unchanged |
| `deep-ai-council` vitest suite | Returned to baseline; 1 pre-existing failure |
| `remediate-hook` `node --test` | PASS |
| `state-machine-wiring.test.cjs` | Gained a red-before/green-after assertion for the REMEDIATE confirmation boundary |
| `persist-artifacts.vitest.ts` tail verification | 26/26 at `f6cdf604a2` |
| rollback hash-guard plus promotion/rollback regression | 16/16 at `f6cdf604a2` |

### Files Changed (landed as `0d1827eef5` on `skilled/v4.0.0.0`)

1. `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs` (F-017-01, F-017-02, F-017-03, F-008-01) — 168 lines
2. `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs` (F-008-03)
3. `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs` (F-017-05)
4. `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs` (F-008-02)
5. `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs` (F-019-02)
6. `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs` (F-019-02)
7. `.opencode/skills/system-deep-loop/deep-alignment/scripts/remediate-hook.cjs` (F-021-02)
8. `.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs` (F-021-02 test)
9. `.opencode/commands/deep/assets/deep-model-benchmark-auto.yaml` (F-021-01)
10. `.opencode/skills/system-deep-loop/deep-improvement/scripts/tests/promote-candidate-benchmark.vitest.ts` (test updates)
11. `.opencode/skills/system-deep-loop/deep-improvement/scripts/tests/promote-candidate-mirror-sync.vitest.ts` (test updates)

### Tail files changed (landed as `f6cdf604a2`)

1. `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs` (F-017-04)
2. `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/rollback-candidate-hash-guard.vitest.ts` (rollback receipt and hash-guard coverage)
3. `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs` (F-019-01, F-019-03 calibrated guards)
4. `.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/persist-artifacts.vitest.ts` (root and symlink coverage)
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. `F-019-01` is a calibrated closure: filesystem-root and symlink packet roots are rejected, but ADR-003's broader config-resolved root-authority design remains Proposed.
2. `F-019-03` closes planted-symlink redirection; it does not impose a CWD-only output policy, because that policy previously regressed legitimate out-of-CWD callers.
3. `score-candidate.cjs` sweep-benchmark scoring change (F-008-02) narrows "unscorable" to text-less event streams only; event streams with any assistant text are still scored as before.
4. `checklist.md` remains entirely unchecked (0/50 items, "Status: Planned" in its own summary), and the three ADRs remain Proposed. The implementation is landed, but REQ-U06 packet completion is not yet evidenced.
<!-- /ANCHOR:limitations -->
