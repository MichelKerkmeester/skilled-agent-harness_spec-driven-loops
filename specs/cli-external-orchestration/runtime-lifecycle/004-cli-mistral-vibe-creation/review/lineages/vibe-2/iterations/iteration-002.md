# Review Iteration 002

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Mode: review, execution single_review_iteration, state source externalized files
- Session: `fanout-vibe-2-1794808672532-65xu0h`, generation 1, lineageMode `new`
- Iteration: 2 of 5 (stopPolicy `max-iterations`)
- Dimension: security
- Operator review focus: correctness, security and fail-open defects, wire-format and payload edge cases, ordering and kill-switch gaps, and parity gaps against the OpenCode plugins. This iteration addresses the focus by testing whether a strict binding can turn a non-blocking note into a deny, whether the composer parts can each be switched off, and whether the spawn budgets leave the startup warnings reachable.
- Sources read: `.vibe/hooks.toml`, `.vibe/plugins/repo-guards/spec-gate.mjs`, `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, `.skilled/hooks/session-lifecycle/vibe/README.md`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md`, `.opencode/plugins/session-cleanup.js`, `.skilled/hooks/shared/hook-flags.cjs`, `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`.

## Files Reviewed

- `.vibe/hooks.toml:1-140`
- `.vibe/plugins/repo-guards/spec-gate.mjs:54-82`
- `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:1-147`
- `.skilled/hooks/session-lifecycle/vibe/README.md:20-30`
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:186-245`
- `.opencode/plugins/session-cleanup.js:40-50,255-300,340-375`
- `.skilled/hooks/shared/hook-flags.cjs:100-140,212-245`
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1611-1660,1763-1830`

## Findings - New

### P0 Findings

None. No finding in this iteration is exploitable without an operator action or an unverified runtime field.

### P1 Findings

None new. R1-P1-001 remains active and is carried forward; it is not re-raised here.

### P2 Findings

1. **The advise reply uses a field the recorded `pre_tool` format does not carry, on a strict binding** -- `.vibe/plugins/repo-guards/spec-gate.mjs:72-78` -- the advise branch writes `{"system_message": result.detail}`. The recorded reply table in `references/guards-and-hooks.md:202-208` gives exactly one conforming `pre_tool` reply, `{"decision":"deny","reason":"..."}`, and classifies everything else as a failure path. The same document scopes `system_message` to `session_start` only (`guards-and-hooks.md:238`: "It reads `additional_context` and `system_message` only"). The binding is `strict = true` (`.vibe/hooks.toml:39`), and `guards-and-hooks.md:210` states that `strict = true` turns a `pre_tool` failure path into a deny. So if `system_message` is a schema mismatch on `pre_tool`, the note meant to be non-blocking denies the shell call instead.
   Finding class: algorithmic
   Scope proof: the reply write is inside the declared target; the reference doc and the binding are cited as the wire-format and configuration evidence.
   Affected surface hints: `.vibe/plugins/repo-guards/spec-gate.mjs`, the `spec-gate` binding in `.vibe/hooks.toml:36-40`, `references/guards-and-hooks.md` §5
   Case: a session whose gate is open and whose delivery marker is absent. The operator runs a shell command; the hook writes `{"system_message": ...}`; if the runner treats that as a schema mismatch, the strict binding converts it into a deny and the shell command never runs.

2. **The startup-guard spawn budget equals the inner per-script budget, so the warnings are lost on a slow start** -- `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:42,82-92` -- `SESSION_CLEANUP_TIMEOUT_MS` is `8_000`, and `startupGuardsPart` spawns `session-cleanup.mjs` with that budget. Inside, `session-cleanup.mjs:47-54` calls the OpenCode plugin's `server()` and `event()`, which reaches `runStartupGuards` and runs each guard script with `PROCESS_TIMEOUT_MS = 8000` (`.opencode/plugins/session-cleanup.js:46`). The outer budget therefore leaves no headroom for node startup, the plugin module load, or the plugin's own bookkeeping. `runNode` returns `String(result.stdout ?? '')` (`session-start.mjs:65`), so a killed spawn yields an empty string and the part contributes nothing.
   Finding class: algorithmic
   Scope proof: the outer budget and the spawn are inside the declared target; the inner budget is cited from the OpenCode plugin as the dependency that sets the floor.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, `.vibe/plugins/repo-guards/session-cleanup.mjs`, `.opencode/plugins/session-cleanup.js`
   Case: a cold machine where node startup plus the plugin import takes a second or two and one guard script runs near its own 8-second ceiling. The outer spawn is killed at 8 seconds, `stdout` is empty, and the operator never sees the startup warnings the guards produced.

3. **The goal part has no kill switch and the switch table does not mention it** -- `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:68-70` -- `goalPart()` calls `renderVibeGoalSlice` with no `isHookEnabled` check, while every other part in the same file is gated: `sessionContextPart` on `session-lifecycle` (line 73), `distFreshnessPart` on `dist-freshness` (line 95), and the two turn-start parts on `completion` and `decision-capture`. The README's switch table (`README.md:29`) enumerates six environment switches plus the `decision-capture` flag, the hand-over switches and the compaction parts, and does not name the goal part at all.
   Finding class: instance-only
   Scope proof: inside the declared target; the README is cited as the documentation that should agree.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, `.skilled/hooks/session-lifecycle/vibe/README.md`
   Case: an operator who wants a session with no injected packet context sets every switch the README names. The goal slice still arrives, because the only thing that stops it is an unset `VIBE_SPEC_FOLDER`, which is a binding rather than a switch.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | The binding set in `.vibe/hooks.toml` matches the 18 bindings the reference doc records (`guards-and-hooks.md:31-33`). The reply format does not match: the doc records one `pre_tool` reply and the code writes a second, unrecorded one. |
| `checklist_evidence` | notApplicable | No checklist document on a hook and plugin surface. |

## Integration Evidence

- `.vibe/hooks.toml:36-40` — `spec-gate` is `strict = true`; `.vibe/hooks.toml:64-68` — `mcp-route-guard` is `strict = true` with no `match`, so it runs on every `pre_tool` call.
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:202-210` — the reply table and the `strict` failure-path rule that finding R2-P2-001 turns on.
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:238` — `system_message` recorded for `session_start` only.
- `.opencode/plugins/session-cleanup.js:46,260-300` — the inner `PROCESS_TIMEOUT_MS = 8000` and the parallel guard-script runs that set the floor for finding R2-P2-002.
- `.skilled/hooks/shared/hook-flags.cjs:104-122` — `session-handover` is `DEFAULT_OFF` and `DEFAULT_ON_RUNTIMES` names only `claude`, so on Vibe the hand-over parts are off unless `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1` or the global switch is set. `handover-parts.mjs:68-74` passes `runtime: 'vibe'`, so the resolution is correct.

## Edge Cases

- **The `pre_tool` reply schema is not recorded.** `guards-and-hooks.md:196-198` states that only the `pre_tool` and `post_agent` payloads were captured, and the reply table records one `pre_tool` reply. Whether the runner accepts `system_message` on `pre_tool` is therefore unverified. Finding R2-P2-001 is held at P2 for that reason, with an explicit upgrade trigger: if a captured `pre_tool` run shows the runner treating `system_message` as a schema mismatch, the finding becomes P1, because the strict binding then denies every shell call while the gate is open.
- **The two findings interact.** R1-P1-001 (the missing `observe()`) is what keeps the advise branch reachable on every call; R2-P2-001 is what makes each of those calls a potential deny. Neither is P0 alone, and together they are still bounded by the gate being open and the marker being absent.
- **`dispose()` at session start was checked and is not a defect.** `session-cleanup.mjs:47-54` does not call `hooks.dispose()`, but the plugin's `dispose()` calls `runCleanup()` (`.opencode/plugins/session-cleanup.js:364-371`), which is the session-end work. Not calling it at start is correct.
- **Prior-finding overlap checked.** None of the three appears in the 29 dispositions. `R4-P2-003--8f1aef762f06` fixed the README's switch table for the parts it named; R2-P2-003 is the part it still omits.

## Confirmed-Clean Surfaces

- `.vibe/hooks.toml:1-140` — the 18 bindings match the reference doc's count and event assignment; every shell guard matches `re:bash|process_start`; every write guard matches `write_file|edit`.
- `spec-gate-classify.mjs:35-40` and `spec-gate.mjs:46-52` — both halves mark a child session from `parent_session_id`, and `classifyIntent` returns before any state read for a child (`spec-gate-core.mjs:1631-1634`), so a subagent never opens the gate.
- `spec-gate.mjs:50` — the enforce opt-in is supplied only when the operator has not set a value, so an explicit `0` keeps the core advisory.
- `session-start.mjs:129-136` — every part runs in its own try/catch, so one failing part cannot suppress the rest.
- `session-start.mjs:118-119` — a non-object payload and a non-`session_start` event both return before any work.
- `hook-flags.cjs:222-245` — the environment wins over the config file, and the master and kill switches win over the runtime and global enable switches.
- `handover-parts.mjs:68-74` — the hand-over concern resolves with `runtime: 'vibe'`, so the `DEFAULT_ON_RUNTIMES` list is consulted correctly.
- `post-edit-quality.mjs:57-61` — the router dispatches with `spawnSync(checkerPath, args)` and no `shell: true` (`post-edit-router.cjs:493`), so an edited file's path is an argv element and cannot inject a command.
- `overlay-guard.cjs:144-150` — `fileFieldPath` reads only `file_path`, `filePath` and `path`, never a write's `content`, so content cannot be mistaken for a path.

## Ruled Out

- **`session-cleanup.mjs` not disposing the plugin at session start.** `dispose()` runs the cleanup script, which is the session-end work; skipping it at start is correct.
- **`spec-gate-classify` opening the gate for a subagent.** `classifyIntent` returns before any state read when `isChildSession` is true.
- **`mcp-route-guard` running on every `pre_tool` call.** It has no `match`, but `coreToolNameFor` returns null for any name that does not start with `mcp_`, so a non-MCP call is allowed before the core is consulted.
- **`post-edit-quality` command injection through an edited file's path.** The router spawns without a shell.

## Next Focus

- Dimension: correctness
- Focus area: the session-lifecycle composers (`turn-start`, `turn-end`, `session-start`, `compaction-post-tool`) and the Vibe session reader
- Reason: iteration 2 closed the binding and kill-switch questions; the composers and the reader are where a silent no-op costs the most, because every part fails open by design and a wrong field name produces no diagnostic.
- Rotation status: correctness (guard seam) and security done; correctness (composers and reader) next.
- Blocked/productive carry-forward: the `process_start` upgrade trigger and the `system_message` upgrade trigger are both carried forward as required evidence; the journal-ordering direction stays BLOCKED.
- Required evidence: the `post_tool` and `session_start` payload field names, which the reference doc records as documented rather than observed.

Review verdict: CONDITIONAL
