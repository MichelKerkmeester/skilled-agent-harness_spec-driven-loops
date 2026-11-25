# Third review of the 003 plans (after the second fix pass)

Fresh Opus high re-review, read-only. Paths are relative to the packet folder. Build order stays 001 to 011, each phase passing before the next starts.

## P0
- R3-P0-1 006 REQ-004 (006 spec.md:155) and AC-004 (006 acceptance-criteria.md:57) require "the proposal writer 009 adds" to carry the grant, which does not exist while 006 is built. 009 REQ-005 (009 spec.md:164) and 009 spec.md:46 write `grants: null`, contradicting the parent's "every item writer fills it" (spec.md:128). Fix: take 009 out of 006 REQ-004 and AC-004, and make 009 REQ-005 classify its item and fill `grants` with 006's functions.

## P1
- R3-P1-1 `bots inbox` filters answered items (.skilled/bin/bots.cjs:465) and 001 REQ-003 keeps that, yet 001 SC-002 (spec.md:177) expects the inbox to print `by` and 003 T030 (tasks.md:85) selects state answered. Fix: add `--all` to `inbox --json` in 001, or check through the item file.
- R3-P1-2 011 REQ-008 (spec.md:186) accepts `N` and relies on 006's rule, but 006 REQ-005 (spec.md:156) matches only deny or no, so a channel N records once. Fix: 011 maps N to no before calling answerItem, and 006 lists n in its rule.
- R3-P1-3 002 REQ-006 (spec.md:165) counts "failed runs" without a definition. Parked runs carry exit.class operator (runtime/lib/run-record.ts:50,277) and held bots write refusal records (runtime/lib/runner.ts:832-845). Fix: count only dispatched runs that failed, excluding awaiting-decision and refusals before dispatch.
- R3-P1-4 011 REQ-005 refuses `channel-not-approver` (spec.md:183) while REQ-021, SC-007 and AC-021 (spec.md:204,222, acceptance-criteria.md:74) say `answer-not-approver`. Fix: one name, answer-not-approver.
- R3-P1-5 001 SC-002 writes by: ada while SC-004 (spec.md:179) refuses the same command from a script. Fix: SC-002 says "from a tty, or through answerItem".
- R3-P1-6 003 AC-001 launches the interactive screen (needs a tty) and runs `mv crates/bots-tui /tmp/` without moving it back. Fix: test through cli-ui.vitest.ts with a stub binary, no file moves.
- R3-P1-7 006 spec.md:103,199: the claim that a capped child can reach the state root is still uncited. Fix: cite runtime/lib/posture.ts:42,62 per executor or mark it UNKNOWN with the check that settles it.

## P2
- R3-P2-1 002 fatigue item: its runId is never stated though the item id must equal its run id (runtime/lib/needs-you.ts:104), and answerItem always queues a resume (runtime/lib/answer.ts:97-107), so bots enable re-runs the tenth failed run. State the runId and that enable answers without a resume.
- R3-P2-2 002 T031 and AC-007 use SKILLED_BOTS_STATE_ROOT=$(mktemp -d), which does not isolate a host with installed jobs because jobEnv uses the job file's environment (runtime/lib/installer.ts:780). Use an isolation the runtime honors.
- R3-P2-3 008 AC-007, AC-014, T035, CHK-021 say `rg -c ... "$RUN"` prints 0, but with no match rg -c prints nothing and exits 1. Say "exits 1".
- R3-P2-4 011 plan.md:99 credits 001's tty rule for a test that calls answerItem directly. Reword.
- R3-P2-5 002 plan.md:93 says five new hard invariants, spec.md:136 and CHK-012 say nine. Align.
- R3-P2-6 009 spec.md:264 says the drain suffix is the only reserved entry, untrue once 005 runs, and its reversal condition is met by 005's kind field. Update.
- R3-P2-7 Parent dependency column (spec.md:147-156) is stale: 006 and 011 need 005's review seam, 009 needs 005 and 006, 010 needs 003, 005 and 008, and row 2 says "by: column" though the actor is a summary field. The parent prompt order (spec.md:130) omits checkout. Fix both.
- R3-P2-8 003 spec.md:224 says the screen reads 006's grants while spec.md:50 says it reads neither. Align.
- R3-P2-9 research/research.md Divergence Map cells still wrong against the lineage files: devin-1 schema "P1 (iter 4)" (only iteration-001 mentions it and rules it out), devin-1 until "P1 (iter 6)" (no such finding), vibe-2 until "not found" (vibe-2 research.md:37,72 rate it P0), vibe-2 shared-host "not found" (vibe-2 research.md:60,100), vibe-2 serialization reason is item-answered-differently (:139), "011 belongs" dispute is vibe-1's (vibe-1 :234) and vibe-2 cuts four of five transports, "Rust TUI overbuild vibe-2 yes" is wrong (vibe-2 section 6 cuts the activity.rs table and the CI job), and devin-2 also rated the schema conflict P0. Also refresh Open Questions.
