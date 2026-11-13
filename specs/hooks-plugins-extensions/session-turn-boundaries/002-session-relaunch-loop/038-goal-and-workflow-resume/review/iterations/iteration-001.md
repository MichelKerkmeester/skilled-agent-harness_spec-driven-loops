# Deep Review — Iteration 001

## Dispatcher

- Command: `/deep:review` (loop owner), dispatching `@deep-review` once per iteration.
- Mode: `review`; execution: single review iteration; state source: externalized files.
- Session: `2026-11-13T04:30:08Z`, generation 1, lineage `new`.
- Review target: `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume` (type `spec-folder`).
- Budget profile: `verify` (11 analysis actions used, within the 12-call per-iteration config limit).
- Prior state: no iterations on record; P0=0 P1=0 P2=0.

## Files Reviewed

- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1-2117` (full read)
- `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs:1-232` (full read)
- `.opencode/plugins/opencode-goal.js:380-430` (session keying), `:1160-1200` (state dir and per-session path), `:1218-1248` (stored-goal normalization), `:1435-1470` (atomic write), plus symbol search for `stateDir`/`packetPath`/`writeGoalAtomic`
- `.skilled/hooks/goal/lib/goal-core.cjs:150-300` (env and path resolution), `:1030-1080` (packet binding), plus symbol search for `readGoalRecord`/`scopeKey`
- `.skilled/hooks/session-relaunch/lib/context-usage.cjs:229-398` (exports verified: `readClaudeSettings`, `readCodexSettings` exist)
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` (symbol search only: `manualClaimCommand`, `preparePending`, `resolveGoalPacketResult`, `recordGoalPacket` call sites at 323, 391-456, 555)

Not read this iteration (carried to Next Focus): `lib/nudge.cjs`, `commands/speckit/handoff.md`, `hooks/session-relaunch/README.md`, `hooks/goal/pi/goal-context.ts`, `bin/skilled-loop-shell.sh`, `hooks/hook-flags.env.example`, the five test suites, the goal-hook playbook, and the child specs 001-007.

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Startup claim is emitted under an inferred, demonstrably wrong hook event name** -- `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs:198-201` -- Description: `claimAfterGoalStart` is only reachable for `payload.source === 'startup'`, a `SessionStart` field, and then emits through `payloadEventName(payload, { runtime: 'claude' })`. When the payload carries no `hook_event_name`, the Claude inference policy at `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1493-1495` returns `UserPromptSubmit` if `payload.prompt` is a string and `PostToolUse` otherwise. A `SessionStart` payload has no `prompt`, so the branch that exists to deliver the hand-over claim emits `{hookEventName: "PostToolUse"}` on a `SessionStart` hook. The same inference is used by the compact-path emit at `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs:239`.
   Finding class: class-of-bug
   Scope proof: `payloadEventName` (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1484-1497`) is the only event-naming path for both emits in `compact-pointer.mjs` (lines 201 and 239); `MISSING_EVENT_POLICIES.claude = 'infer'` (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:73-76`) is the module's own stated contract that a Claude payload may arrive without an event name, so the inferred-wrong case is inside the claimed class rather than out of contract.
   Affected surface hints: ["compact-pointer startup claim", "compact-pointer compact pointer", "payloadEventName inference table"]
   Case: a Claude `SessionStart` payload arrives with `source: "startup"` and no `hook_event_name`; the startup claim is emitted under `PostToolUse`, so the fresh session's start context never carries the claim instructions and the relaunched session begins without claiming its hand-off.

   Claim adjudication:
   ```json
   {"type":"correctness","claim":"The startup claim context is emitted under a non-SessionStart event name whenever the Claude payload omits hook_event_name","evidenceRefs":["compact-pointer.mjs:198-201","relaunch-core.cjs:1493-1495","relaunch-core.cjs:73-76"],"counterevidenceSought":"Read both emit call sites and the inference policy; checked whether a startup payload can carry a prompt string that would infer UserPromptSubmit instead","alternativeExplanation":"Claude always sends hook_event_name, so the inference branch is dead code on this path and the finding has no reach","finalSeverity":"P1","confidence":0.65,"downgradeTrigger":"Downgrade to P2 if a recorded Claude SessionStart payload is shown to always carry hook_event_name, making the inference branch unreachable"}
   ```

### P2 Findings

2. **`recordGoalPacket` rewrites a note's frontmatter with no open-status guard, unlike every other note mutator** -- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:892-903` -- Description: the function is documented as acting on "an open note", but under `withAppendLock` it reads, parses, and rewrites the note without checking `frontmatter.status === 'open'`. `claimHandoff` (`:1323`), `completeHandoff` (`:1349`) and `supersedeClaimed` (`:1398-1402`) all re-check status inside the same lock. Caller `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:391-404` resolves the goal packet and then writes it, so a claim that lands in between is overwritten.
   Finding class: class-of-bug
   Scope proof: the three sibling mutators guard status under `withAppendLock`; `recordGoalPacket` is the only frontmatter writer in the module without the guard (`rg "frontmatter.status !== " relaunch-core.cjs` returns 1323, 1349 and the `supersedeClaimed` predicate at 1398).
   Affected surface hints: ["recordGoalPacket", "prepare goal carry", "claimHandoff"]
   Case: the receiving session claims the hand-off between prepare's pre-check and `recordGoalPacket`'s write; the write then edits the now-`claimed` note's frontmatter and re-pins it `0600`, changing a note another session owns.

3. **An active goal with no usable condition text is reported as a packet-resolution failure** -- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:624-648` -- Description: `goalLogEntry` writes `condition: ''` when `attachment.condition` is not a string (`:553-557`). `claudeGoalPacketResult` then derives `headline = ''`, the acceptance predicate can never match because it requires `headline !== ''` (`:633`), and `goalHeadlinePackets` returns `[]` for an empty headline (`:771`). The function finally reports `the active goal names no packet this hand-over can find` (`:647`), attributing the miss to the packet instead of to the unproven goal text.
   Finding class: instance-only
   Scope proof: `headline` is consumed only at `:624`, `:633` and `:643`; both consumers already treat empty as "no proof", so the message at `:645-647` is the only place the empty-headline state is misdescribed.
   Affected surface hints: ["claudeGoalPacketResult", "resolveGoalPacketResult reason"]
   Case: a Claude `goal_status` attachment arrives with `met: false` and no `condition` string; the operator is told the goal names no packet, and the real cause (no goal text to match) is not reported.

4. **The OpenCode goal record is re-derived from the plugin's private file layout instead of the shared resolver** -- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:526-534` -- Description: the non-OpenCode branch calls `goalCore.readGoalRecord({ scope: ... })`, while the OpenCode branch hand-builds `<resolveStateDir(workspace)>/<sha256(sessionId)>.json` and `JSON.parse`s it. That duplicates `goalPathForSession` (`.opencode/plugins/opencode-goal.js:1185-1187`), which is keyed by `sessionKeyForSession` (`:399-401`), and skips the legacy per-session filename the plugin still reads (`.opencode/plugins/opencode-goal.js:1190-1192`). The read is wrapped in `try/catch` at `:746-751`, so any drift resolves to "no goal" with no log line.
   Finding class: cross-consumer
   Scope proof: `rg "readGoalRecord|sha256.*sessionId"` shows two derivations of the same on-disk contract (`.skilled/hooks/goal/lib/goal-core.cjs:228-246` and `.opencode/plugins/opencode-goal.js:399-401`), and `relaunch-core.cjs:531-533` is a third copy that no test on the shared resolver covers.
   Affected surface hints: ["goalRecordFor", "opencode-goal plugin state path", "goal-core readGoalRecord"]
   Case: the plugin renames its per-session goal file or gains the legacy-filename migration the shared resolver already models; the OpenCode carry then silently resolves no packet and the receiver starts unbound.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Correctness of the resolution and claim paths was read directly, but no child spec (001-007) was compared against this code this iteration; no spec-to-code claim is asserted. |
| `checklist_evidence` | core | deferred | `tasks.md` / `acceptance-criteria.md` were not opened; iteration 3 owns the closure check. |
| `skill_agent` | overlay | notApplicable | No skill or agent file is in the changed-code path for this dimension. |
| `agent_cross_runtime` | overlay | deferred | Cross-runtime parity (`claude` vs `pi`/`codex`/`cursor`) needs the adapter tests, which were not read. |
| `feature_catalog_code` | overlay | deferred | Not reached in a correctness-only pass. |
| `playbook_capability` | overlay | deferred | The goal-hook playbook was not read; its capability claims are unverified. |

## Integration Evidence

- Loop owner: `.skilled/commands/deep/review.md` (`/deep:review`) — dispatcher for this iteration; no file read this iteration beyond the rendered prompt.
- Append gateway: `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` — the only writer of `review/deep-review-state.jsonl`.
- Reducer: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` — owns the findings registry and dashboard; not invoked by this agent.
- Reviewed integration surfaces: `.opencode/plugins/opencode-goal.js` (goal record producer) and `.skilled/hooks/goal/lib/goal-core.cjs` (shared record reader) were read as the producer/consumer pair behind finding 4.

## Edge Cases

- **Unverified record field**: the plugin's persisted goal record was shown to carry a top-level `status` (`opencode-goal.js:1248`) and a `packetPath` acceptance branch (`:1313-1314`), but the write path (`writeGoalAtomic:1435-1450`) was not traced field-by-field. `recordedGoalPacket` depends on both being top-level; this remains unproven and is not reported as a finding.
- **Environment override parity**: `goalCore.resolveStateDir` honours `OPENCODE_GOAL_STATE_DIR` (`goal-core.cjs:184-190`) and the plugin's `DEFAULT_STATE_DIR` reads the same variable at module load (`opencode-goal.js:49`). A session that sets the variable after import would diverge; not proven reachable.
- **No suite executed**: no test run was performed this iteration, so no behaviour is claimed as tested. The `scratch/red.txt` and `scratch/green.txt` baselines were not consulted.
- **Coverage shortfall, recorded not masked**: 8 of the 18 scope files received no read at all; the correctness dimension is `partial`, not complete.

## Confirmed-Clean Surfaces

- `parseClaimSeed` (`relaunch-core.cjs:111-131`) round-trips both the current and the legacy skip suffix, rejects non-absolute paths, and trims strictly.
- `goalPacketProblem` (`:437-457`) follows real paths for packet and `goal.md` and rejects anything outside the checkout, including through links.
- `shouldRelaunch` (`:1227-1274`) reads `hops` without coercion and fails closed on a backward clock.
- `armLocked` (`:984-1021`) drops a recorded effort when the model switched and no new effort is supplied.
- `ensureStateDir` / `inspectStateDir` (`:150-173`) re-inspect the directory after `mkdirSync` and refuse a symlinked or foreign-owned state dir.
- `manualClaimCommand` (`:1435-1452`) escapes `\ " $ ` !` before the seed is quoted, and `manualTemplateProblem` refuses a template with zero or two placeholders.
- Both goal settings readers exist and are exported (`context-usage.cjs:229`, `:265`, `:395-398`), so `resolveSessionSettings` fails closed for the right reason.

## Ruled Out

- **`dropNestedLoop` deleting `SKILLED_LOOP_CLAIM_SEED`**: `dropNestedLoop` removes every `SKILLED_LOOP_` key (`relaunch-core.cjs:2044-2046`), which includes the claim seed, but `claimAfterGoalStart` reads the seed after that call and returns `done()` when it is gone (`compact-pointer.mjs:187-193`). Intentional, per the surrounding comment.
- **Goal switch default-on**: `goalSwitchOn` returns true unless the value is one of `0/false/off/no` (`relaunch-core.cjs:466-469`), which matches the documented "on unless the operator turned it off" contract.
- **Hop-cap off-by-one**: `hops >= hopLimit` (`:1257-1267`) with `DEFAULT_MAX_HOPS = 10` allows the tenth hop and refuses the eleventh, consistent with `hops` counting completed hops.

## Next Focus

- Dimension: correctness (D1), still partial.
- Focus area: `lib/nudge.cjs` seed/instruction rendering, `bin/session-relaunch.cjs` prepare output and consume wiring, and `commands/speckit/handoff.md` note shape, checked against child packets 001, 003 and 004.
- Reason: these are the remaining producers and consumers of the claim seed and hand-off note that iteration 1 could not reach, and they are the surfaces where finding 1's wrong-event delivery actually lands.
- Rotation status: D1 stays current; D2-D4 not started.
- Blocked/productive carry-forward: productive = direct read of the resolution and claim state machine; blocked = none.
- Required evidence: a read of `nudge.seedInstructions`/`notePathFromSeed` and of the prepare print path, plus at least one child spec for the spec-to-code comparison.
- Recovery note: none.

Review verdict: CONDITIONAL
