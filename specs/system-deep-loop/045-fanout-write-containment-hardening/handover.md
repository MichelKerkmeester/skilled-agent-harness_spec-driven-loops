---
title: "Handover: fan-out write containment and entry-point link resolution"
description: "Both packets are complete; this one is signed off and its work is pushed, and the containment gap the sign-off left open is now delivered as a checkout watch. This records the delivered state of fan-out write containment and the entry-point link repair, the one operator decision still open, and the traps a cold session would otherwise rediscover at cost."
trigger_phrases:
  - "fan-out write containment handover"
  - "worktree default decision"
  - "entry point symlink resolution"
  - "resume containment work"
importance_tier: "important"
contextType: "implementation"
---
# Handover: fan-out write containment and entry-point link resolution

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

Continuity handover for two completed packets. Read this first on resume, then the packet docs.

---

<!-- ANCHOR:state -->
## Current State

**Both packets are complete, and this one is signed off.** On 2026-09-13 the operator approved all three rows of the fan-out containment sign-off table. This session's worktree-default flip and its review fixes (`15bbc48b79`) sit on `skilled/v4.0.0.0` on top of `1c157667067` and are pushed to `origin/skilled/v4.0.0.0` together with the sign-off commit. The operator then directed the checkout watch ADR-004 named; it is committed on the same branch on top of the sign-off commit (`e910a812c0`) as `bdda9abe12`, and that commit is pushed to both `skilled/v4.0.0.0` and `main`.

Verification from the final state: the deep-loop suite reports 156 files, 2654 passed and 7 skipped, exit 0, re-run after the checkout watch. Packet 045 returns `RESULT: PASSED`; the spec-kit figures for packet B from the earlier final state were 259 files and 3891 passed.
<!-- /ANCHOR:state -->

---

<!-- ANCHOR:packet-a -->
## Packet A: Fan-out Write Containment

**`system-deep-loop/045-fanout-write-containment-hardening`**

The fan-out guard used to revert out-of-scope writes to HEAD, which destroyed a neighbouring session's live work. The remedy is now preservation by default, with restore opted in per run. A restore, when chosen, targets the pre-dispatch bytes rather than HEAD, so it cannot discard work the lane never touched. A containment finding no longer erases a finished lane's own outcome.

Per-lineage git worktrees were built, turned off by default, and then removed entirely in phase 007 (ADR-007): every lane runs in the shared checkout under preserve-by-default containment, and there is no isolation option or tally any more. All 91 checklist items are checked with evidence.

Measured facts:

- Six lanes at concurrency 3 cost 16.5 s without worktrees and 149.7 s with them.
- A worktree checkout costs 1.6 GB; the git object store is shared rather than copied.
- A manual run against an uncommitted packet on the real checkout PASSED, including seeding, publication and cleanup.
- Abandoned-tree reclaim was observed end to end: a tree is kept while its lane is resumable and reclaimed once it is not, and the liveness proof needs the heartbeat stale beyond TWICE the lease term plus a dead owner.
<!-- /ANCHOR:packet-a -->

---

<!-- ANCHOR:packet-b -->
## Packet B: Entry-point Link Resolution

**`system-speckit/033-system-speckit-v4/039-entry-point-symlink-resolution`**

Scripts decided whether to run by comparing the path they were launched with against the location they derive from their own file. A symlink makes those differ, so they exited 0 doing nothing. Fixed by canonicalizing both sides.

Three copies of the helper exist, one per build boundary the code cannot cross, and a test asserts they agree. 21 modules were migrated onto them. The biggest impact: the Gate 1 trigger-index lookup returned 0 bytes through a symlinked `.opencode` and now returns identical output.
<!-- /ANCHOR:packet-b -->

---

<!-- ANCHOR:operator-decisions -->
## Open For The Operator

These are decisions, not defects.

1. **The shared checkout watch is delivered; two boundaries remain.** ADR-004 recorded that containment watched the lane's tree, so a bare checkout write by a flag-lever kind (`cli-opencode`, `native`, `cli-cursor`) was not observed. **Decided 2026-09-13: build it — delivered** (ADR-005): such an attempt is watched in the checkout, a change is reported as `checkout_write_detected` and counted in `isolation.checkout_watched` / `checkout_writes`, report-only, with the artifact plane exempted so a sibling's publication is not attributed to a lane. Still unobserved: an absolute-path write by a kind whose cwd is its own tree, and a lane that fails before the post-dispatch comparison.
2. **Concurrency ceilings are unbounded.** There is a single runner process and heap, no quota admission control, and an unclassified resource exhaustion is retried into.
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:carry-forward -->
## Carry Forward

Hard-won, and a session costs each time it is rediscovered.

- A compiled `.js` beside its `.ts` wins resolution for anything not going through the compiler. Two were removed and an eval now refuses new ones. Two deliberate ones remain and are declared.
- `validate.sh` can report a pass it never performed. Require an explicit `RESULT: PASSED` line before believing a run.
- Regenerate derived metadata after ANY spec-doc edit, or `GENERATED_METADATA_INTEGRITY` fails.
- The test harness has its own 10-minute bound. Raise `SPECKIT_TEST_RUN_TIMEOUT_MS` for a full run.
- Concurrent sessions committed this session's in-flight work five times under generic messages. Use pathspec-limited commits so another session's staged files are not swept in.
<!-- /ANCHOR:carry-forward -->

---

<!-- ANCHOR:resume -->
## How To Resume

Both packets pass the same gate. For this folder, from the repository root:

```
node .opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs \
  --folder specs/system-deep-loop/045-fanout-write-containment-hardening --apply
NODE_PRESERVE_SYMLINKS=1 bash "$(realpath .opencode)/skills/system-spec-kit/runtime/cli/spec/validate.sh" \
  specs/system-deep-loop/045-fanout-write-containment-hardening --strict
```

The same pair of commands against the entry-point packet also returns PASSED.

Cold-read order: this file, then `implementation-summary.md` for what shipped and its recorded limitations, then `decision-record.md` for the worktree-default decision (ADR-004), the checkout watch that closed the risk it left open (ADR-005) and the boundaries that remain, then `spec.md` for the incident that started it.
<!-- /ANCHOR:resume -->
