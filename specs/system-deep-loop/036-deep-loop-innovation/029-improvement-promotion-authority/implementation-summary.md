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
    last_updated_at: "2026-08-08T03:00:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciliation found F-017-04 falsely marked Landed; corrected to 10/13"
    next_safe_action: "Land F-017-04 (rollback candidate-hash bypass) + F-019-01/F-019-03"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs"
      - ".opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs"
    completion_pct: 77
    open_questions:
      - "F-017-04: shared/rollback-candidate.cjs still accepts either preAcceptTargetHash or candidateHash; 0d1827eef5 never touched this file despite the prior Landed claim"
      - "F-019-01/F-019-03 need a packet-root-relative confinement, not process.cwd(), so the 12 legitimate out-of-cwd persistence tests stay green"
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
| **Completed** | 2026-08-07 |
| **Level** | 3 |
| **Status** | PARTIAL (10/13 findings landed; F-017-04 wrongly claimed Landed, corrected 2026-08-08) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Eight P0 findings shared one mechanism: mutable local JSON was treated as authority. Promotion checked score status and thresholds but never `score.candidate`, `score.target`, or `score.inputHash`, so a stale score from an earlier revision could authorize promotion of a newer, unscored candidate. Ship verified only fields stored inside that same mutable acceptance JSON. The candidate authored the rubric it was scored against. Council persistence resolved its packet root from a caller-chosen positional argument. 10 of 13 scoped findings landed as `0d1827eef5` on `skilled/v4.0.0.0`; the council-persistence confinement (F-019-01, F-019-03) was attempted and reverted (see Known Limitations), and F-017-04 was reconciled on 2026-08-08 from a false "Landed" claim to NOT LANDED (see Known Limitations) — real landed count is 10/13, not the 11/13 this summary originally claimed.

### T001 Confirmation and Landed Findings

| Finding | Landed | HEAD probe and disposition |
|---------|--------|-----------------------------|
| `F-017-01` | Landed | `promote-candidate.cjs:455` accepted evaluator receipts for a different artifact. Promotion now checks `score.candidate`, `score.target`, and `score.inputHash` against the acceptance receipt; a stale or cross-target score cannot authorize. |
| `F-017-02` | Landed | `promote-candidate.cjs:550` had no candidate or artifact-output containment. The archive directory is now confined to allowed roots alongside the target. |
| `F-017-03` | Landed | `promote-candidate.cjs:157` let ship trust a caller-forged acceptance receipt. `--approve` now requires a candidate-and-target-bound receipt path; a bare flag is rejected. |
| `F-017-04` | **NOT LANDED (claim corrected 2026-08-08)** | `shared/rollback-candidate.cjs:177` (`expectedRollbackSourceHashes`/`assertRollbackHashGuard`) still accepts either `preAcceptTargetHash` or `candidateHash` as a match for the current target hash. Commit `0d1827eef5` never touched this file (`git diff 0d1827eef5^ HEAD -- shared/rollback-candidate.cjs` is empty); this row previously said "Landed" in error. REQ-003 is not met for this file. |
| `F-017-05` | Landed | `score-candidate.cjs:535` let the candidate control evaluator identity and derived rubric. Agent identity is now resolved from the manifest profile id, not candidate frontmatter. |
| `F-021-01` | Landed | `deep-model-benchmark-auto.yaml:198` fabricated promotion approval in autonomous mode. `--approve` now carries the required receipt path, the counterpart to the bare-flag rejection. |
| `F-021-02` | Landed | `remediate-hook.cjs:87` did not enforce operator confirmation. The REMEDIATE hook now requires explicit confirmation at both the CLI and the module boundary; `state-machine-wiring.test.cjs` gained a red-before/green-after assertion. |
| `F-019-02` | Landed | `orchestrate-topic.cjs:48` let council topic identifiers traverse outside the packet. Topic ids containing path-traversal are now rejected/skipped in both `orchestrate-topic.cjs` and `orchestrate-session.cjs`. |
| `F-008-01` | Landed | `promote-candidate.cjs:518` let non-finite score values bypass promotion gates. Non-finite and absent score, delta, and aggregate fields now fail closed. |
| `F-008-02` | Landed | `sweep-benchmark.cjs:322` scored raw event JSON when assistant text was absent. A text-less event stream is now unscorable rather than scored as raw stdout. |
| `F-008-03` | Landed | `rollback-candidate.cjs:144` let direct rollback trust an unbound backup file. Direct rollback now records a pre-restore hash before copying; a missing backup fails closed. |
| `F-019-01` | DEFERRED (not landed) | `persist-artifacts.cjs:532` scoped council writes relative to an attacker-chosen root. See Known Limitations. |
| `F-019-03` | DEFERRED (not landed) | `persist-artifacts.cjs:1007` let `--memory-save-payload-out` overwrite an unrestricted file. See Known Limitations. |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Findings were fixed by shared mechanism (receipt binding, hash guards, containment, path-traversal rejection) rather than one patch per finding ID. The `deep-improvement` suite showed zero new failures against the `5c98` baseline (54 pre-existing model/skill-benchmark failures unchanged); the `deep-ai-council` suite returned to baseline (1 pre-existing failure); `remediate-hook`'s `node --test` passed. The council-persistence confinement (F-019-01, F-019-03) was implemented, tested, found to break 12 legitimate out-of-cwd persistence tests, and reverted before landing rather than shipped with a known regression. 10 findings landed as `0d1827eef5` on `skilled/v4.0.0.0`; F-017-04 was believed landed in the same commit but a 2026-08-08 reconciliation pass found the commit never touched its file (see Known Limitations).
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

**Not actually changed by `0d1827eef5`**, despite an earlier version of this list claiming it: `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs` (would have been F-017-04). See Known Limitations.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`F-017-04` NOT LANDED, previously mis-claimed "Landed" — found by 2026-08-08 honesty-gated reconciliation.** This document originally listed F-017-04 as landed by `0d1827eef5` and listed `shared/rollback-candidate.cjs` in the Files Changed table. Neither is true: `git diff 0d1827eef5^ HEAD -- .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs` is empty, and the file at HEAD still has `assertRollbackHashGuard` accept either `preAcceptTargetHash` or `candidateHash` as a match for the current target hash (`expectedRollbackSourceHashes`, line 177) — the exact "candidate-hash alternative" bypass the finding describes. REQ-003 ("Rollback accepts only the recorded promoted-candidate hash") is not met for this file. Real landed count is 10/13, not 11/13. Re-landing needs an actual edit to `shared/rollback-candidate.cjs` narrowing the accepted source hash to the recorded promoted-candidate hash only.
2. **`F-019-01`/`F-019-03` DEFERRED (not landed)** — confining council persistence (`persist-artifacts.cjs`) to an authorized packet root was attempted and reverted: the attempted fix confined writes to `process.cwd()` rather than the packet root, which is already enforced by the existing `assertInside` boundary, and broke 12 legitimate out-of-cwd persistence tests. Re-landing needs a packet-root-relative confinement that does not regress out-of-cwd callers.
3. `score-candidate.cjs` sweep-benchmark scoring change (F-008-02) narrows "unscorable" to text-less event streams only; event streams with any assistant text are still scored as before.
4. `checklist.md` for this packet remains entirely unchecked (0/50 items, "Status: Planned" in its own summary) despite the landed code changes above — the checklist ceremony this packet's own REQ-U06 requires was not run against the landed commit. Not corrected here (out of the scope of this status-reconciliation pass); flagged for the packet owner.
<!-- /ANCHOR:limitations -->
