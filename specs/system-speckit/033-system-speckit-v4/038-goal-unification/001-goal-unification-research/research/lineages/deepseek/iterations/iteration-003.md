# Iteration 3: A3 — What the legacy store holds that `goal.md` cannot (D2)

## Focus

Inventory `.opencode/skills/.state/goal/` — what is really in it, what a packet `goal.md` cannot carry — and
decide whether it retires outright or demotes to a session-to-packet index. Angle A3 / decision D2
(charter `../../deep-research-strategy.md`:52).

## Actions Taken

1. Inventoried the live store (filesystem + tracked README).
2. Read the record schema written by `setGoal`/`buildNewRecord` and the mutation semantics.
3. Read the locking, archive, and removal paths.
4. Compared the store's fields against what the `goal.md` template can carry.

## Findings

### F1. The store's own README declares its contents machine-local and its only tracked file itself

`.opencode/skills/.state/goal/` currently holds exactly one file — `README.md` (tracked); raw runtime data is
git-ignored (`[SOURCE: .opencode/skills/.state/goal/README.md:25]`). The README's structure table is the
authoritative inventory of what the folder is *for*:

| Path | Shape | Purpose |
|------|-------|---------|
| `<session-id-hex>.json` | JSON | one session goal: `sessionId`, `goalId`, `objective`, `goalPrompt`, `promptEnhancement`, `status`, budget/usage counters, timestamps, continuation state, verifier results |
| `.continuation.log` | JSONL | continuation decisions `ts`, `sid`, `goalId`, `decision`, `reason`, `autoTurnsUsed` |
| `.goal-events.log` | JSONL | debug/persistence events |
| `.continuation.log.<ts>-<uuid>`, `.goal-events.log.<ts>-<uuid>` | JSONL | rotated segments |
| `.archive/<session-id-hex>.json` | JSON | past goal snapshot, same shape as active |

`[SOURCE: .opencode/skills/.state/goal/README.md:31]`, `[SOURCE: .../README.md:34]`,
`[SOURCE: .../README.md:33]`, `[SOURCE: .../README.md:35]`, `[SOURCE: .../README.md:36]`

### F2. The record field set, read from the writer

`buildNewRecord` (`[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:869]`) writes: `goalId`, `objective`,
`goalPrompt`, `status`, `tokenBudget`, `createdAt`/`createdAtMs`, `updatedAt`/`updatedAtMs`, `revision`,
`lastVerifierVerdict`, `lastVerifierReason`, `lastVerifierSource`, `turnsUsed`, `startedAtMs`,
`lastActivityAtMs`, `usageSource`, `runtime`.

Only two of those fields are durable goal *content* (`objective`, `goalPrompt`); the rest is liveness and
telemetry. `setGoal` (`[SOURCE: .../goal-core.cjs:897]`) adds mutation semantics a file cannot express:
`refreshed` when the objective is unchanged on an active/paused goal, `created` when none existed,
`replaced` otherwise — and a replacement archives the record first
(`[SOURCE: .../goal-core.cjs:929]`, `archiveGoalRecord` at `[SOURCE: .../goal-core.cjs:644]`).
`completeGoal` and `clearGoal` archive then delete the active file
(`[SOURCE: .../goal-core.cjs:949]`, `[SOURCE: .../goal-core.cjs:970]`).

### F3. Three of the store's jobs are physically impossible for `goal.md`

1. **Cross-process mutual exclusion.** Mutations take a lock under `.locks/`
   (`LOCK_SUBDIR` at `[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:48]`, retry 10 ms at
   `[SOURCE: .../goal-core.cjs:55]`, timeout 10 s at `[SOURCE: .../goal-core.cjs:56]`, stale 120 s at
   `[SOURCE: .../goal-core.cjs:57]`, acquisition plus stale detection at
   `[SOURCE: .../goal-core.cjs:524]`). A git-tracked spec document cannot be the lock target: two sessions
   writing one packet file is the shared-state regression A6 exists to prevent.
2. **Ephemeral per-session telemetry** — `turnsUsed`, `tokenBudget`, `startedAtMs`, `lastActivityAtMs`,
   `lastVerifierVerdict/Reason/Source`, `revision`, `usageSource` (`goal-core.cjs:869-889`); the plugin adds
   its own continuation counters and cooldowns
   (`autoTurnsUsed`, `maxAutoTurns`, continuation cooldown and wall clock:
   `[SOURCE: .opencode/plugins/opencode-goal.js:34]`, `[SOURCE: .../opencode-goal.js:36]`).
3. **Retention and rotation policy** — active retention 2 days, archive retention 90 days, hourly sweep,
   JSONL size cap 5 MB (`[SOURCE: .../opencode-goal.js:38]`, `[SOURCE: .../opencode-goal.js:39]`,
   `[SOURCE: .../opencode-goal.js:41]`, `[SOURCE: .../opencode-goal.js:43]`).

### F4. Two key schemes already coexist, and neither is packet-aware

The core derives `scopeKey = sha256(JSON([workspace, runtime, sessionId]))`
(`[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:191]`) with the adopted legacy form
`${runtime}-${sessionDigest}` (`[SOURCE: .../goal-core.cjs:190]`); the plugin writes hex-encoded session ids
(`legacySessionKeyForSession` at `[SOURCE: .opencode/plugins/opencode-goal.js:362]`) alongside its own
sha256 key (`[SOURCE: .../opencode-goal.js:358]`). The store is therefore *already* two implementations in
one directory — the "two implementations drifting" risk in the charter is not hypothetical, it is the
current state.

### F5. What `goal.md` uniquely holds that the store cannot

Durable directive with a decisions table, a phase binding table, completion criteria, a volatile log, a
`_memory.continuity` block, and `trigger_phrases` that feed the doc graph
(`[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:48]`,
`[SOURCE: .../goal.md.tmpl:71]`, `[SOURCE: .../goal.md.tmpl:88]`, `[SOURCE: .../goal.md.tmpl:99]`,
`[SOURCE: .../goal.md.tmpl:16]`, `[SOURCE: .../goal.md.tmpl:7]`). It is committed, reviewable, and shared by
every session working the packet — which is precisely what the per-session store is not.

## Store-fate options (D2)

| Option | What survives | Cost today | What fails | Enforcement site |
|--------|---------------|-----------|------------|------------------|
| **O3-A** | Retire the store; `goal.md` only | Removes two key schemes and all archive machinery | Liveness, locks, telemetry, and retention have no home; two writers to one tracked file with no lock = the 009 regression | deletion across `goal-core.cjs`, `opencode-goal.js`, adapters |
| **O3-B** | Demote to a per-session **index + telemetry**: keep `packetPath`, `status`, usage, verifier, locks, archive; derive `objective`/`goalPrompt` from `goal.md` on read | One extra file read per injection (cacheable, the plugin already caches briefs) | `goal.md` deleted/renamed mid-session leaves a dangling pointer — must fail open to the last durable slice and mark the record `unbound` | read path beside `readGoalRecordForScope` (`goal-core.cjs:622`); writer at `setGoal` (`goal-core.cjs:897`) |
| **O3-C** | Keep the store as-is (objective duplicated) | Zero change | Two authors of the same truth; the store's copy silently wins at injection time, so `goal.md` edits never reach the model | n/a — rejected on the charter premise |
| **O3-D** | Liveness into `goal.md` frontmatter `_memory.continuity` | One file | Per-session status written into a committed shared file; two sessions in one packet overwrite each other's state | n/a — this is the 009 failure mode |

## Assessment

- `newInfoRatio`: 0.7 — the README's path inventory and the lock/retention constants are new; the record
  field set and the key schemes were partially in Known Context (scope key) or inferable (archive).
- Confidence: high on F1-F4 (read directly). F5 is a template read; the graph-edge benefit of
  `trigger_phrases` is asserted from the frontmatter shape, and iteration 6 verifies what the doc graph
  actually consumes.
- One sentence: the store holds three things a file cannot (locks, liveness, telemetry) and one thing it
  must stop holding (the durable objective), which makes demotion — not retirement — the only option that
  keeps the documented invariants.

## Reflection

- What worked: the store's README is a contract document, not prose — its structure table gave the
  inventory in one read, and the code confirmed the field set.
- What failed: nothing this iteration reached a dead end; the `ls` of `.state/goal/` looked empty at first
  (only README), which briefly suggested there was nothing to inventory — the README corrected that.
- Ruled out: retiring the store outright (O3-A) and putting liveness into `goal.md` frontmatter (O3-D);
  both re-introduce shared mutable state for per-session facts.

## Sources Consulted

- `.opencode/skills/.state/goal/README.md` (25, 31, 33-36)
- `.opencode/hooks/goal/lib/goal-core.cjs` (48, 55-57, 190, 191, 524, 622, 644, 869-889, 897, 929, 949, 970)
- `.opencode/plugins/opencode-goal.js` (34, 36, 38-43, 358, 362)
- `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` (7, 16, 48, 71, 88, 99)

## Recommended Next Focus

Iteration 4 (A4 / KQ4 / D4): the resend trigger predicate, cadence, dedup, and non-blocking semantics.
