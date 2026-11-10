---
title: "Deep Review Iteration 003 — deep-loop locks, fencing, authority, containment"
trigger_phrases: []
---

# Iteration 3: Security — locks, fencing, authority, containment

## Focus

Dimension: **security**. Slice: the deep-loop's lock, fence, and authority surfaces —
`runtime/lib/deep-loop/loop-lock.ts` and `runtime/scripts/loop-lock.cjs`, `lib/locks-and-fencing/**`
(fence capability, fenced ledger writer, lease coordinator), `lib/authority-root/**`,
`lib/per-mode-authority-flip/**` (registry/selector), the append gateway's authorization path,
and the workflow's lock usage. A secret-exposure sweep over the four focus trees and the memory
save path's scrubber was run in the same pass.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts` (full, 1-756)
- `.skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs` (full, 1-210)
- `.skilled/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts` (lines 38-120)
- `.skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts` (fence-token paths, lines 400-565)
- `.skilled/skills/system-deep-loop/runtime/lib/authority-root/resolve-authority-root.ts` (full)
- `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-lock.vitest.ts` (lines 210-310, reclaim tests index)
- `.skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts` (lines 55-250)
- `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts` (scrub coverage, lines 55-250, 1600-1650)
- Secret/exposure sweep across the four focus trees (shell-true/exec/eval patterns; production paths only)
- `.skilled/commands/deep/assets/deep-review-auto.yaml` (lock acquire/release steps, lines 295-312)

## Findings

### P0 Findings

None.

### P1 Findings

- **F002**: Two processes can both reclaim the same stale loop lock and both hold the packet lock — `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:298` — `tryReclaimStaleLoopLock` renames whatever is at `lockPath` to a private claim path and then publishes its own record, without verifying that the record it just renamed is the stale holder it observed at `:456-457`. A second process that read the same stale holder can therefore rename and replace the *fresh* lock published by the first reclaimer: interleaving `A.rename -> A.writeLoopLockExclusive (temp write + fsync + link) -> B.rename -> B.link` yields two `acquired: true` results. The inline comment claiming "two reclaimers can never both end up holding the lock" only holds for callers racing on the *same stale inode*; once the winner has linked its new record, the path is stealable again. The window contains a file write and an fsync (`:265-286`), and the host-local single-flight backstop that could serialize same-host reclaims is only engaged when `options.hostLocalSingleFlight === true` (`:600-603`), which the CLI never passes (`scripts/loop-lock.cjs:156`), so production has no second guard. Consequence: `deep-review-auto.yaml:297-298` fails closed only when `acquired=false`; with both true, two review runs write the same packet — the state the lock exists to prevent — and the first winner's heartbeat later stops silently on identity mismatch.

  Finding class: `race-condition`
  Scope proof: Read the full lock library, the CLI that calls it, the fence-capability reader that consumes the lease, the concurrency unit test, and the workflow's acquire/release steps; the reclaim path's rename is unconditional and unverified, and no caller enables the single-flight guard.
  Affected surface hints: [`lib/deep-loop/loop-lock.ts`, `scripts/loop-lock.cjs`, `commands/deep/assets/deep-review-auto.yaml`, `tests/unit/loop-lock.vitest.ts`]

  Claim adjudication:

  ```json
  {
    "type": "race-condition",
    "claim": "tryReclaimStaleLoopLock can replace a fresh lock published by another reclaimer, so two concurrent acquirers can both return acquired:true and both write the same review packet.",
    "evidenceRefs": [
      ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:298-315",
      ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:265-286",
      ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:453-478",
      ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:600-603",
      ".skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:156",
      ".skilled/skills/system-deep-loop/runtime/tests/unit/loop-lock.vitest.ts:213-309",
      ".skilled/commands/deep/assets/deep-review-auto.yaml:297-298"
    ],
    "counterevidenceSought": "Checked whether the reclaim re-reads and verifies the claimed record before republishing (it does not); whether link-based publish forces the loser to EEXIST (it does, but only when the loser has not itself vacated lockPath first via its own rename); whether ENOENT protects the winner (it only protects when the loser's rename lands while lockPath is absent, not after the winner links); whether host-local single-flight serializes production callers (tests only; CLI never passes the option); whether a test interleaves two reclaimers (the atomic-publish test races a fresh acquire against an observer, not reclaim against reclaim).",
    "alternativeExplanation": "The window may be judged too short to hit in practice, and the losing run's heartbeat eventually notices the identity mismatch and stops. Neither closes the hole: the window contains a temp write plus an fsync before link, a descheduled process can be delayed arbitrarily inside it, and the heartbeat check happens after both acquisitions, stops only the heartbeat, and does not force either run to stand down.",
    "finalSeverity": "P1",
    "confidence": 0.8,
    "downgradeTrigger": "Downgrade to P2 if the acquire CLI enables hostLocalSingleFlight (serializing same-host attempts before the file race) or the reclaim path verifies the renamed record's identity against the observed stale holder and restores an unverified fresh lock untouched, with a test that interleaves two reclaimers."
  }
  ```

Carried: F001 remains active (no re-review this iteration; its evidence was re-verified in iteration 2).

### P2 Findings

None.

## Claim Adjudication

One new P1 (F002). Hunter pass: the only unconditional rename in the acquire path is the reclaim rename; every other mutation is identity-checked. Skeptic pass: could the second caller be blocked by `writeLoopLockExclusive`'s EEXIST? Only if the second caller links without having renamed, which is the branch it does not take after passing the stale-read gate. Referee pass: severity held at P1 — it is a mutual-exclusion failure in the guard protecting the single-writer invariant, with a documented (and incorrect) impossibility claim in the code.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pending | Full traceability pass scheduled for iteration 8. |
| `checklist_evidence` | pending | Scheduled with the same pass. |

## Ruled Out

- "Command injection through an executor or evaluator path": ruled out — a production-path sweep of the four focus trees found no `shell: true`, no `eval`, and no `new Function`; the only `exec` hits are `RegExp.exec` loops and SQLite DDL (`db.exec` with literal statements, no interpolation).
- "Secrets can reach a durable save unscrubbed": ruled out on read — the save path scrubs slug, filename, title, description, sessionData and collectedData as whole trees (`workflow.ts:208-247, 1612-1625`), the scrubber resets `lastIndex` before each pattern and fails closed by throwing (`secret-scrubber.ts:196-239`), and the pattern set covers private keys, AWS/GitHub/Anthropic/OpenAI/Google/Slack/JWT/bearer and credential assignments with documented guard reasoning.
- "The ledger append can commit under a stale or forged fence": ruled out on read — the fenced writer compares the fence's resource identity and the expected head sequence before commit (`fenced-ledger-writer.ts:57-77`) and the ledger re-checks the current fence token against the holder (`append-only-ledger.ts:552-560`); a stale, released, or forged capability is rejected before append.
- "Authority can silently fork per run": ruled out — the authority root discovers the checkout rather than accepting a per-run directory, with the documented reason that a per-run root would let two runs disagree on the canonical writer (`resolve-authority-root.ts:5-17, 56-71`).
- "The release/refresh path can clobber a lock reclaimed after a stale read": ruled out for those paths — `refreshLoopLock` and `releaseLoopLock` both re-verify identity from the claimed record and restore it on mismatch (`loop-lock.ts:634-666, 731-756`), and unit tests cover the reclaim-during-refresh and reclaim-during-release interleavings; the gap is the reclaim path itself.

## Dead Ends

- Reproducing the reclaim race by executing the lock library: not attempted — the race needs process interleaving; a scripted reproduction would write outside the lineage directory (temp dirs), and the static interleaving is fully specified by the code paths.

## Assessment

- New findings ratio: 1.0 (one new P1; weighted total = weighted new = 5)
- Dimensions addressed: security
- Novelty justification: the security slice read the lock/fence/authority stack end to end and the secret-exposure surface by sweep; the one new finding is the reclaim TOCTOU, and the remaining results are recorded as ruled-out directions.

## Next Focus

Dimension: correctness. Focus area: spec-kit validation engine and its rule scripts (`runtime/cli/spec/validate.sh`, `runtime/cli/rules/**`, `validator-registry.json`, and the shared source-tag checker). Required evidence: the exact code path that decides PASS/FAIL/WARN, plus one positive control for any absence claim. Rotations status: correctness slice 4 of 6.

Review verdict: CONDITIONAL
