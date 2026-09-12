---
iteration: 1
focus: "correctness — concurrency between two sessions on one packet log"
dimensions: [correctness, security]
started_at: "2026-09-11T10:52:30Z"
status: complete
---

# Iteration 001 — correctness: concurrency on the packet log

## Scope

Second pass. Prior lineage (`lineages/deepseek-review`) reported F006 against the log lock; this iteration re-derives the mechanism from the current code and reproduces it end to end instead of trusting the pass-1 wording. Surfaces read: `.opencode/hooks/goal/lib/goal-core.cjs` (lock acquisition, scope resolution, log append), `.opencode/hooks/goal/bin/goal.cjs` (CLI router), `.opencode/hooks/goal/README.md` (lock claim). Fixtures live under this lineage's `scratch/`; state is redirected with `OPENCODE_GOAL_STATE_DIR`, so no repository state was touched.

## Findings

### F101 — P2 — The per-packet log lock is scoped to the state directory, so two sessions with different state directories silently lose log rows

**Dimension**: correctness | **Bears on**: ADR-004 (log append never changes the durable slice) and the README's "per-packet lock" claim | **Carry-over**: pass-1 F006, now reproduced with a measured loss

**Evidence** (read at the cited lines):

- `appendGoalLog` takes exactly one lock before the read-modify-write of `goal.md`: `.opencode/hooks/goal/lib/goal-core.cjs:1050` — `withFileLocks(goalScope.stateDir, [packetLockName(goalScope, packet.packetPath)], ...)`.
- The lock file therefore lives under `goalScope.stateDir` (`.opencode/hooks/goal/lib/goal-core.cjs:540-545`), which `resolveStateDir` resolves from the explicit option, the `OPENCODE_GOAL_STATE_DIR` environment override, or the repo default (`.opencode/hooks/goal/lib/goal-core.cjs:151-162`).
- The lock *name* is packet-scoped — `workspace + "\n" + packetPath` — so the name does not help when the directory differs: `.opencode/hooks/goal/lib/goal-core.cjs:894-896`.
- The durable-slice guard is a read-modify-write check inside the same critical section: `.opencode/hooks/goal/lib/goal-core.cjs:1069-1073`. Two writers that never meet on a lock both compute their row from the same original bytes, both pass the guard, and the second `renameSync` discards the first row.

**Reproduction** (shipped CLI, fixture packet under this lineage, two sessions `s1`/`s2`, state dirs `state-a` and `state-b`):

- Positive control — both sessions on `state-a`, one pair appending at the same time: `STATUS=OK ACTION=log` twice and both `| row-C … |` and `| row-D … |` are present in the table.
- Divergent state dirs — 20 concurrent pairs (`s1` on `state-a`, `s2` on `state-b`): 9 of 20 `x` rows and 11 of 20 `y` rows survived. Each process still reported `STATUS=OK ACTION=log`; nothing in the envelope signals the loss.

**Impact**: when the two writers do not share a state directory, log rows are lost silently. The README advertises the append as serialized ("`log` appends one row to the packet's progress table under a per-packet lock", `.opencode/hooks/goal/README.md:60`), and the packet log is the evidence trail an operator reads. Trigger requires a divergent `OPENCODE_GOAL_STATE_DIR`, which the README documents as the test/probe override (`.opencode/hooks/goal/README.md:43`) — hence P2 rather than P1.

**Recommendation**: derive the lock directory from the packet's workspace (or place a marker next to the packet's `goal.md`) so the lock name and its scope agree, or document the state-dir precondition next to the serialization claim. Report only; no fix in this review.

## Ruled out

- Two sessions sharing one state directory losing a row: ruled out. Five concurrent same-directory pairs all landed, and the clean pair landed both rows; `acquireFileLock` + `withFileLocks` serialize correctly in the shared-directory case (`.opencode/hooks/goal/lib/goal-core.cjs:540-583`).
- Lock reaping turning a live writer loose: not observed. `LOCK_STALE_MS` is 120 s against a read-modify-write that completes in milliseconds (`.opencode/hooks/goal/lib/goal-core.cjs:56-58`), and `writeTextAtomic` renames into place (`.opencode/hooks/goal/lib/goal-core.cjs:899-920`).
- Lock deadlock between the scope lock and the packet lock: ruled out by reading; `withScopeMutation` and `appendGoalLog` each acquire a single lock and never nest (`.opencode/hooks/goal/lib/goal-core.cjs:600-606`, `:1050`).

## Coverage

| Item | Value |
|---|---|
| Dimensions touched | correctness, security |
| Files reviewed | `goal-core.cjs:151-162,540-583,894-896,899-920,1037-1077`, `bin/goal.cjs:192-200`, `goal-readme.md:43,60` |
| New findings | 1 (P2) |
| Reproduction fidelity | end-to-end through the shipped CLI; fixture workspace and both state dirs under this lineage's `scratch/` |

Review verdict: PASS
