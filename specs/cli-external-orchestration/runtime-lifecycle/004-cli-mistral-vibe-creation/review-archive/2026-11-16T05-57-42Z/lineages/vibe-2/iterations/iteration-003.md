# Review Iteration 003

## Dispatcher

- Mode: review (fan-out lineage `vibe-2`)
- Session: `fanout-vibe-2-1794765851303-zrv85l`, generation 1, lineageMode `new`
- Dimension: security
- Review target: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation` (spec-folder)
- Operator review focus: phases 013-022 and the 2026-11-15 fixes. This iteration addresses the focus by auditing the trust boundary the automatic handover tier widened: the three composers now run a hand-over part that reads the session journal and writes state on every turn start, tool call and turn end.
- Sources read this iteration: `steer.md` (absent), `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:59-150,199-324`, `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs:1-86`, `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:1-162`, `.skilled/hooks/session-handover/vibe/handover-parts.mjs:1-375`, `.skilled/hooks/session-handover/lib/nudge.cjs:54,433-460,745-752`, `.skilled/hooks/session-handover/lib/relaunch-core.cjs:291-297`, `.skilled/hooks/session-handover/lib/context-usage.cjs:388-428`, `.skilled/hooks/goal/lib/goal-slice.cjs:271-303,443-475`, `.skilled/hooks/goal/vibe/goal-inject.mjs:30-42`, `.vibe/hooks.toml:110-140`, `.skilled/bin/skilled-loop:905-915`.

## Files Reviewed

- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:59-150,199-324`
- `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs:1-86`
- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:1-162`
- `.skilled/hooks/session-handover/vibe/handover-parts.mjs:1-375`
- `.skilled/hooks/session-handover/lib/nudge.cjs:54,433-460,745-752`
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:291-297`
- `.skilled/hooks/session-handover/lib/context-usage.cjs:388-428`
- `.skilled/hooks/goal/lib/goal-slice.cjs:271-303,443-475`
- `.skilled/hooks/goal/vibe/goal-inject.mjs:30-42`
- `.vibe/hooks.toml:110-140`
- `.skilled/bin/skilled-loop:905-915`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The compaction state directory is derived from `payload.cwd` with no containment check, so the hook creates and writes a state tree at whatever absolute path the payload names** -- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:67-70` -- `stateDirFor` returns `join(cwd && isAbsolute(cwd) ? cwd : workspace, STATE_RELATIVE_DIR)` and `writeWatermark:116` and `writeJournalSize:143` both `mkdirSync(stateDir, { recursive: true })` there. The comment at `:63-66` states the intent ("the watermark lives under the session's own working folder ... so a session that may not write into the checkout ... can still record what it injected"), but nothing checks that the folder is the session's own.
   Finding class: security
   Scope proof: the helper and both writers are in a `reviewScopeFiles` entry; the payload shape is the one the packet's own wire-format reference records.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`
   Case: a payload whose `cwd` is a shared directory, a mount root or `/` makes the hook create `<that>/.skilled/skills/.state/vibe-compaction/` and write a watermark and a size file there, outside the session folder the comment says the state belongs to.
   ```json
   {"type":"claim","claim":"The state directory follows payload.cwd with no containment check, so the hook writes outside the session folder when the payload names one.","evidenceRefs":["compaction-context.mjs:67-70","compaction-context.mjs:116","compaction-context.mjs:143"],"counterevidenceSought":"Checked whether the payload cwd is validated anywhere (it is not), whether the state key bounds the path (it bounds the filename, not the directory), and whether the writes are mode-restricted (they are 0o700/0o600, which limits disclosure but not location).","alternativeExplanation":"The payload is host-supplied, so the reach is a misconfigured or hostile host rather than the model. That is why this is P2 hardening rather than a blocking finding.","finalSeverity":"P2","confidence":"high","downgradeTrigger":"No downgrade path; the tier is already the lowest."}
   ```

2. **The hand-over state directory falls back to a predictable path under `os.tmpdir()` with no ownership or symlink check** -- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:291-297` -- `stateDir` returns `join(env.XDG_RUNTIME_DIR, STATE_DIRECTORY_NAME)` when the variable is set and otherwise `join(os.tmpdir(), 'session-handover-<uid>')`, and `nudge.cjs:749-752` writes `nudge-<sessionId>.json` there. The directory name is predictable and nothing verifies that an existing directory is owned by the current user or is not a symlink.
   Finding class: security
   Scope proof: `relaunch-core.cjs` is a `reviewScopeFiles` entry, and `nudge.cjs` is the writer the Vibe hand-over part calls.
   Affected surface hints: `.skilled/hooks/session-handover/lib/relaunch-core.cjs`, `.skilled/hooks/session-handover/lib/nudge.cjs`
   Case: on a host whose `os.tmpdir()` is world-writable, another local user pre-creates `session-handover-<uid>` as a symlink to a directory they own, and the hook's nudge state writes land there.
   ```json
   {"type":"claim","claim":"The fallback state directory is a predictable path under the system temp directory with no ownership or symlink check.","evidenceRefs":["relaunch-core.cjs:291-297","nudge.cjs:749-752"],"counterevidenceSought":"Checked whether the directory is created with an exclusive flag or its ownership verified (neither), and whether the session id can escape it (it cannot: `SESSION_ID_PATTERN` at `nudge.cjs:54` is `^[A-Za-z0-9_-]{1,128}$`).","alternativeExplanation":"On macOS `os.tmpdir()` is a per-user folder, so the path is not world-writable there. The finding is host-dependent, which is why it is P2.","finalSeverity":"P2","confidence":"medium","downgradeTrigger":"No downgrade path; the tier is already the lowest."}
   ```

3. **The `post_tool` binding re-reads the whole session store on every tool call whose journal grew, inside a 10-second budget** -- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:314-319` -- `buildPostToolPart` runs `detect` whenever the measured size differs, and `detect` is `buildCompactionPart`, which calls `loadVibeSession` and therefore reads every `journal/*.jsonl` file plus the committed snapshot's chunks (`session-readers/vibe.mjs:76-107,124-129`). `.vibe/hooks.toml:127` gives the entry `timeout = 10.0`, and the same entry then runs the hand-over part, which reads the journal again through `readVibeUsage` (`context-usage.cjs:388-394`).
   Finding class: security
   Scope proof: the binding, the reader and the hook registration are all in the declared review target or its named integration surface.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`, `.skilled/hooks/shared/session-readers/vibe.mjs`, `.vibe/hooks.toml`
   Case: a long session whose journal has grown to tens of megabytes pays a full store read on every tool call, and a call that crosses the 10-second budget is killed, so the tool result the model needs is delayed or the binding is skipped.
   ```json
   {"type":"claim","claim":"The per-tool-call cost grows with the whole session store, and the entry budget is fixed at 10 seconds.","evidenceRefs":["compaction-context.mjs:314-319","session-readers/vibe.mjs:76-107","session-readers/vibe.mjs:124-129","context-usage.cjs:388-394",".vibe/hooks.toml:127"],"counterevidenceSought":"Checked whether the detector caches a parsed store (it does not), whether the size gate bounds the work (it only skips unchanged journals), and whether the hand-over part reuses the detector's read (it does not).","alternativeExplanation":"Vibe may cap the journal size by rolling it into snapshots, which bounds the read. The snapshot chunks are read too, so the bound is the whole store rather than the journal.","finalSeverity":"P2","confidence":"medium","downgradeTrigger":"No downgrade path; the tier is already the lowest."}
   ```

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | Carried from iterations 1 and 2; this iteration adds no spec-alignment change. |
| `checklist_evidence` | core | notApplicable | No phase in 013-022 carries a `checklist.md`. |
| `skill_agent` | overlay | pass | Carried from iteration 2. |
| `agent_cross_runtime` | overlay | pass | Carried from iteration 2. |
| `feature_catalog_code` | overlay | pending | Deferred to the cross-reference iteration. |
| `playbook_capability` | overlay | partial | Carried from iteration 2. |

## Integration Evidence

- `.vibe/hooks.toml:124-128` registers `compaction-post-tool` as a `post_tool` entry with `timeout = 10.0` and no `strict`, so a failure never blanks the tool result. That is the intended posture and it holds.
- `.vibe/hooks.toml:19-24` registers `turn-start` with `timeout = 20.0`, which covers five parts including two journal reads.
- `.skilled/bin/skilled-loop:911-912` unsets `SESSION_HANDOVER_GOAL_PACKET` and `SKILLED_LOOP_CLAIM_SEED` before a first launch but leaves `VIBE_SPEC_FOLDER` alone, so an outer session's packet binding reaches a first launch. `goal-inject.mjs:33` prefers it over the claimed packet, which the goal README documents as intended ("An operator-named `VIBE_SPEC_FOLDER` always wins"), so this is a comment-precision gap in the wrapper rather than a defect.

## Edge Cases

- **Ambiguity: the payload is host-supplied, not model-supplied.** I kept both path findings at P2 because the reach is a misconfigured or hostile host, not the model, and the packet's own wire-format reference records `cwd` as a host field.
- **Contradiction: the wrapper comment says an outer packet never reaches a first launch, and `VIBE_SPEC_FOLDER` does.** Both sides are cited; the adjudication is that the goal README makes the operator's choice authoritative, so the comment is imprecise rather than the code being wrong. Recorded as integration evidence, not as a finding.
- **Missing dependency: no live Vibe session.** The timeout finding is a cost reading, not a measured timeout, so it stays at P2.
- **Partial success:** the goal path resolution is genuinely hardened, so the security dimension is not empty of clean surfaces.

## Confirmed-Clean Surfaces

- `goal-slice.cjs:271-303` resolves an absolute or relative packet path and rejects anything outside the workspace on both the lexical and the real path, including a symlinked parent.
- `goal-slice.cjs:443-462` re-judges the `goal.md` file's real path, so a symlinked goal document that targets a file outside the workspace reads as unbound.
- `nudge.cjs:54,745-747` validates a session id against `^[A-Za-z0-9_-]{1,128}$` before it reaches any path join, so no session id can traverse.
- `compaction-context.mjs:92,116-123,144` bounds the watermark read at 4096 bytes and writes both state files with `0o600` inside a `0o700` directory.
- `compaction-context.mjs:208-256` wraps the whole detector in one `try/catch` and returns `''`, so no malformed payload can throw into a hook.
- `handover-parts.mjs:186-272` returns `''` for a non-context event, a disabled concern, an invalid session id and a subagent payload, and logs rather than throws on every failure path.
- `compaction-post-tool.mjs:76-84` keeps the exit code at 0 and prints nothing when both parts are empty.

## Ruled Out

- **A session id can traverse the state path.** Ruled out by `nudge.cjs:54,745-747` and by `stateKey` hashing the id at `compaction-context.mjs:72-74`.
- **`VIBE_SPEC_FOLDER` can point the goal slice outside the checkout.** Ruled out by `goal-slice.cjs:271-303,443-462`.
- **A strict `post_tool` failure can blank the tool result.** Ruled out: the entry carries no `strict` (`.vibe/hooks.toml:124-128`).
- **The hand-over part can deny a turn.** Ruled out: `armHandoverTurnEnd` returns `null` on every path (`handover-parts.mjs:286-369`).

## Next Focus

- Dimension: maintainability
- Focus area: the Vibe hook documentation set (`guards-and-hooks.md`, the session-lifecycle README, the goal README, the playbook) against the code this lineage has now read, plus the duplicated rule sets and line-length conventions phase 013 claims to have fixed.
- Reason: three iterations have produced seven findings, and the docs are the surface that will carry the fixes.
- Rotation status: correctness, traceability and security complete; maintainability next.
- Blocked/productive carry-forward: productive — the security pass confirmed the goal-path hardening and found three hardening gaps.
- Required evidence: `file:line` in each doc and the code line it describes.
- Recovery note: not applicable.

Review verdict: CONDITIONAL
