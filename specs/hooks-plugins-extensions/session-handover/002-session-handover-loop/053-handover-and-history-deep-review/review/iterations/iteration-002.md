# Iteration 002: Security

## Dispatcher

- Iteration 2 of 5, dimension `security`, executor cli-claude-code `claude-opus-5-5` medium.
- Iteration number derived from `deep-review-state.jsonl`: one `type:"iteration"` record (iteration 1, recorded by the orchestrator as `iteration_error`), so this is iteration 2. It matches the dispatch.
- Operator focus (handover logic and history search across every runtime) was addressed as the trust boundaries each runtime path crosses: the signal the killer sends, the handoff path the CLI accepts from a record or an argument, the live settings the wrapper replays from a record, the state directory every adapter writes, and the history locator that picks a transcript file to read.

## Files Reviewed

- `.skilled/hooks/session-handover/lib/killer.cjs:131-140,220-227,475-598,714-830`
- `.skilled/hooks/session-handover/bin/session-handover.cjs:160-228,808-864`
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:145-177,179-207,232-275,291-297`
- `.skilled/bin/skilled-loop:204-399`
- `.skilled/hooks/session-handover/lib/goal-handover.cjs:95-130`
- `.skilled/hooks/session-handover/history/lib/cli.ts:131-212,243-293`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:300-314,484-487` (context only: the locator schema and state path the history CLI imports)
- Spawn inventory across `claude/`, `codex/`, `opencode/`, `pi/`, `vibe/`, `lib/` (exact search for `spawn|execSync|execFile|shell: true|child_process`)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new. R1-P2-001 (history README vs navigator, iteration 1) stays active and is unchanged by this pass.

## Traceability Checks

- `spec_code` (partial): the security claims in `lib/README.md:32` (the killer signals only after an armed record exists and exits on hop cap) hold against `killer.cjs:723-756`. The documented record-guard for `bypassPermissions` holds against `skilled-loop:243-270`. Not yet checked against the packet spec; carried to the traceability iteration.
- `checklist_evidence`: not run this iteration; carried to the traceability iteration.

## Integration Evidence

- Adapters spawn `../lib/killer.cjs` through `child_process.spawn` with an argument array, never a shell: `claude/handover-stop-arm.mjs:62-82`, `codex/handover-stop-arm.mjs:71-91`, `vibe/handover-parts.mjs:155-175`, `pi/session-handover.ts:399-417`.
- The only other spawns are `ps` (`relaunch-core.cjs:2262`), `osascript` with a `JSON.stringify`-escaped literal (`killer.cjs:689`, `hop-history.cjs:134`) and `node <goal cli> packet <packet>` after a packet path gate (`goal-handover.cjs:102-118`).

## Edge Cases

- Pid reuse between the ancestry snapshot and `SIGTERM` (`killer.cjs:781-818`) is acknowledged in code: Node has no pidfd, so the window is minimised, not closed. The ancestry walk refuses on any process-table read failure (`killer.cjs:220-227`). Accepted residual risk, not a finding.
- `handoffPathWithinRepo` returns the lexical `candidate`, not the real path (`session-handover.cjs:227`), so a directory component swapped for a link after the check could redirect the later read. Exploiting it needs write access to the repository's own handoffs directory, which is already the operator's trust zone. Ruled out as a finding; recorded so a later pass can revisit if the handoffs directory ever becomes shared.
- Consume-before-cd edge case carried from iteration 1 was not revisited; budget went to trust boundaries.

## Confirmed-Clean Surfaces

- Killer target selection: `--loop-id` must equal `SKILLED_LOOP_ID` and be > 1; the target must descend from the loop pid; the record is re-checked and stamped under lock just before the signal (`killer.cjs:832-842,784-809`). `EPERM` on the liveness probe is treated as "not our target" (`killer.cjs:136-137`).
- Killer lock and takeover mutex: `wx`/`0o600` create, owner-pid release, token-proved mutex removal with rename-first (`killer.cjs:269-404`).
- State directory: per-uid name under `os.tmpdir()`, `lstat` re-inspection for real directory owned by the current uid, `chmod 0o700`; files written via `wx` temp plus rename at `0o600` (`relaunch-core.cjs:145-207,291-297`).
- Handoff path gate: lexical containment in the handoffs dir, the handoffs dir must be reached without a link below the repo root, then real-parent and real-file containment (`session-handover.cjs:160-228`). Consume re-applies the gate to `record.handoff` and drops a path outside it (`session-handover.cjs:827-833`).
- Wrapper replay of record fields: permission mode limited to a fixed set, `plan` refused, `bypassPermissions` only when the launch line already carried the unlocking flag; model ids, names and efforts are pattern- or set-checked (`skilled-loop:216-288`).
- Frontmatter rewrite: keys come from module callers; values that callers derive from session ids reject line breaks (`relaunch-core.cjs:232-275`).
- History lookup: the state file path is a sha256 of the session id (`hook-state.ts:484-487`); the locator's `sessionId` refuses separators, `..` and control characters, and `workspace` must be absolute (`hook-state.ts:300-314`); transcript candidates are joined from those checked keys (`cli.ts:248-279`). The lookup reads state without writing (`cli.ts:184-212`).

## Ruled Out

- Shell injection through adapter spawns: every spawn is array-form, none uses `shell: true`.
- Permission escalation through a forged relaunch record's `permissionMode`: refused unless the operator's own launch line unlocked bypass (`skilled-loop:261-270`).
- Path traversal through the history locator `sessionId`: schema refuses it (`hook-state.ts:305-307`).
- Symlinked state directory takeover on a shared temp dir: refused by the `lstat` owner check (`relaunch-core.cjs:157-163,170-174`).

## Next Focus

- Dimension: traceability
- Focus area: `spec_code` and `checklist_evidence` for the packet against `runtime-behavior.md`, `state-files.md`, `handoff-protocol.md`, `goal-carry-over.md` and the per-runtime READMEs; also `nudge.seedInstructions` and the Codex `handover-prompt-seed.mjs` note-path derivation, which this pass did not reach.
- Reason: both core protocols are unfinished, and the seed path is the one handover input not yet traced to the handoffs-dir gate.
- Rotation status: correctness and security done (2/4).
- Blocked/productive carry-forward: productive = exact-search spawn inventory, then direct reads of each gate.
- Required evidence: file:line for each doc claim checked against code.

Review verdict: PASS
