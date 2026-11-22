# T004: the five existing status vocabularies

Evidence for T004 and REQ-007. Gathered 2026-11-22 in the worktree `/Users/michelkerkmeester/worktrees/public/system-skilled-bots`. Every path below is relative to that root unless it is absolute.

## Source of the list

research.md is gitignored (`specs/other/` is ignored), so it exists only in the primary checkout: `/Users/michelkerkmeester/MEGA/Development/Skilled/specs/other/008-workflow-hub-research/research/research.md`. It was read there, read-only.

research.md §10 line 245 names the five, verbatim:

> **No sixth vocabulary.** Iteration status, stop reasons, dispatch failures, verification reasons and delivery states already exist. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:65]

So the five are: (1) iteration status, (2) stop reasons, (3) dispatch failures, (4) verification reasons, (5) delivery states.

Failure classes are not one of the five. research.md §10 line 244 proposes them as a new derived field ("author, operator, environment or hub"), written beside the raw reason. Their only source is research.md line 244 and the iteration file it cites. No repository file defines them. They are listed at the end for completeness only.

## 1. Iteration status

Source: `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:142-145` (`ITERATION_COMPLETION_STATUS_RULE`, values at line 144). The same set is the TypeScript type at `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts:241`.

Values, verbatim and in file order:
- `complete`
- `error`
- `insight`
- `stuck`
- `thought`
- `timeout`

Related: the started record has its own one-value rule, `ITERATION_STARTED_STATUS_RULE` at `deep-research-ledger-schema.ts:146-149`, value `started` (line 148).

Deep-review has no matching iteration-status enum. Its ledger schema uses other status fields: `passStatus: enumRule('blocked', 'complete', 'incomplete')` at `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts:211`, and `terminalStatus: enumRule('blocked', 'completed', 'incomplete')` at line 434. These are recorded as related, not as the vocabulary.

## 2. Stop reasons

Source: `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/lifecycle-taxonomy.cjs:45-57` (`STOP_REASONS`). The typedef `LoopStopReasonValue` at line 14 carries the same set. Lines 41-42 say the insertion order is contractual, because validation error strings join the values in order.

Values, verbatim and in file order:
- `converged`
- `maxIterationsReached`
- `blockedStop`
- `manualStop`
- `error`
- `stuckRecovery`
- `userPaused`
- `maxDurationReached`

Same file, kept separate on purpose (lines 4-8, 37-39): `SESSION_OUTCOMES` at lines 87-92 (`keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`) and `LoopActiveStatus` at lines 29-35 (`running`, `waiting`, `paused`, `idle`, `stopped`).

ADR-010's `awaiting-decision` maps to `blockedStop` here.

## 3. Dispatch failures

Source: `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:49-57` (`DispatchFailureReason`), which includes `RecursionGuardFailureReason` from lines 60-65.

Values, verbatim and in file order:
- `timeout`
- `crash`
- `missing_output`
- `invalid_output`
- `model_mismatch`
- `other`
- `dispatch_receipt_write_failed`
- `recursion-guard-lineage`
- `recursion-guard-stack`
- `recursion-guard-ancestry`
- `recursion-guard-env`
- `recursion-guard-lockfile`

These are the `reason` values of the `dispatch_failure` JSONL event the same file emits (`event: 'dispatch_failure'` at line 1419, emitter comment at lines 1559-1560).

## 4. Verification reasons

Source: `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:65-79` (`REASONS`). This is the line research.md cites.

Values, verbatim and in file order:
- `dispatch_failed`
- `iteration_file_missing`
- `iteration_verdict_missing`
- `state_record_missing`
- `route_proof_missing`
- `route_proof_mismatch`
- `delta_file_missing`
- `state_log_malformed`
- `delta_file_malformed`
- `findings_not_enumerated`
- `gateway_bypass_detected`
- `ledger_backing_missing`
- `executor_missing`

Related second set, the post-dispatch validator's own failure reasons: `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:199-222` (`PostDispatchFailureReason`, not exported). Values, verbatim and in file order: `iteration_file_missing`, `iteration_file_empty`, `jsonl_not_appended`, `jsonl_missing_fields`, `jsonl_parse_error`, `jsonl_wrong_type`, `delta_file_missing`, `delta_file_empty`, `delta_file_missing_iteration_record`, `executor_missing`, `dispatch_failure_logged`, `verification_degraded`, `route_proof_missing`, `route_proof_mismatch`, `dispatch_receipt_missing`, `dispatch_receipt_invalid_mac`, `dispatch_receipt_intent_mismatch`, `v2_missing_ledger`, `v2_uncited_ledger_row`, `v2_broken_linked_finding`, `v2_shallow_finding_details`, `delta_iteration_id_mismatch`, `state_delta_iteration_mismatch`.

Same file, judge failures: `JudgeFailureKind` at `post-dispatch-validate.ts:64`, values `model_error`, `parse_error`, `slow_timeout`, `unknown`.

## 5. Delivery states

No repository file defines this vocabulary. Its only source is research.md §10 line 247:

> **Delivery is at most once.** States are `queued`, `claimed`, then `delivered`, `failed` or `unknown`. An uncertain send is `unknown` and is never retried. [SOURCE: ~/.hermes/hermes-agent/cron/delivery_queue.py:5]

Values as research.md states them: `queued`, `claimed`, `delivered`, `failed`, `unknown`.

Source mismatch. The cited Hermes file is outside this repository but present on this machine, and was read read-only. It stores different names for the two non-terminal states:
- `/Users/michelkerkmeester/.hermes/hermes-agent/cron/delivery_queue.py:103-104`, the `deliveries` table: `status TEXT NOT NULL CHECK(status IN ('pending','delivering','delivered','failed','unknown'))`.
- Same file, line 35: `_TERMINAL = ("delivered", "failed", "unknown")`.
- Same file, lines 116-117, `delivery_tombstones.terminal_status IN ('delivered','failed','unknown')`.

In Hermes, `queued` and `claimed` are local variable names (`claimed = conn.execute(` at line 216, `queued = enqueue(` at line 366), not stored states. The terminal three agree. The two non-terminal names differ: research.md says `queued`, `claimed` and Hermes stores `pending`, `delivering`. The hub has to pick one pair; that choice is open.

research.md §10 line 248 also names `not-attempted` (empty target list) and `attempted` (an `osascript` notice nothing acknowledges), citing `.skilled/hooks/session-handover/lib/hop-history.cjs:134`. That code (`notifyHandOver`, lines 127-142) spawns `osascript` and returns `true` or `false`. It defines no state string. `rg -n "not-attempted" .skilled` exits 1. Both values are research-only.

Unrelated repository matches, recorded so they are not mistaken for the source: `.skilled/skills/system-deep-loop/runtime/lib/transactional-projections/transactional-projection-types.ts:346` has `readonly status: 'delivered' | 'delivery-failed';`, a projection-publish status. `.skilled/hooks/session-handover/lib/relaunch-core.cjs:32` has `NOTE_STATUSES = ['open', 'claimed', 'done']`, a handoff-note state.

## Not one of the five: failure classes

research.md §10 line 244: "Failure classes group by who can fix them: author, operator, environment or hub." Values per research.md: `author`, `operator`, `environment`, `hub`. Line 244 also says reaching the budget is its own class, apart from a timeout, but names no value for it. No repository file defines these. ADR-010 sets `exit.class` to `operator` for a parked run.

## Commands run

Each was run under `bash -c` from the worktree root, without a pipe, followed by `echo "exit=$?"`.

```
$ rg -n "^const REASONS = \{" .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs
65:const REASONS = {
exit=0

$ rg -n "^const STOP_REASONS = Object.freeze" .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lifecycle-taxonomy.cjs
45:const STOP_REASONS = Object.freeze({
exit=0

$ rg -n "^export type DispatchFailureReason =|^export type RecursionGuardFailureReason =" .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts
49:export type DispatchFailureReason =
60:export type RecursionGuardFailureReason =
exit=0

$ rg -n "^type PostDispatchFailureReason =" .skilled/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts
199:type PostDispatchFailureReason =
exit=0

$ rg -n "ITERATION_COMPLETION_STATUS_RULE = |ITERATION_STARTED_STATUS_RULE = |values: \[.complete., .error., .insight." .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts
142:const ITERATION_COMPLETION_STATUS_RULE = Object.freeze({
144:  values: ['complete', 'error', 'insight', 'stuck', 'thought', 'timeout'],
146:const ITERATION_STARTED_STATUS_RULE = Object.freeze({
exit=0

$ rg -n "readonly status: .complete. \| .error." .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts
241:  readonly status: 'complete' | 'error' | 'insight' | 'stuck' | 'thought' | 'timeout';
exit=0

$ rg -n "insight|ITERATION_.*STATUS" .skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema
exit=1

$ rg -n "not-attempted" .skilled
exit=1

$ rg -n "'delivered'" .skilled --glob "!**/node_modules/**" --glob "!**/tests/**"
.skilled/skills/system-deep-loop/runtime/lib/transactional-projections/committed-snapshot-publisher.ts:54:        status: 'delivered',
.skilled/skills/system-deep-loop/runtime/lib/transactional-projections/transactional-projection-types.ts:346:  readonly status: 'delivered' | 'delivery-failed';
exit=0
```

`rg -n "'claimed'|\"claimed\"" .skilled --glob "!**/node_modules/**"` exited 0 with matches only in `.skilled/hooks/session-handover/` (handoff-note states, for example `relaunch-core.cjs:32` and `hop-history.cjs:27`) and in `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:41` (a request folder name). None is a delivery state.

The value lists above were read with `sed -n` on the cited line ranges. The Hermes lines were found with `rg -n "queued|claimed|delivered|'failed'|\"failed\"|unknown" ~/.hermes/hermes-agent/cron/delivery_queue.py` and read with `sed -n 30,36p` and `sed -n 98,118p`.
