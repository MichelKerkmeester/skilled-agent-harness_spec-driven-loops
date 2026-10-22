---
title: "Implementation Summary"
description: "The session relaunch loop now holds up live on Claude, Pi and OpenCode across thirteen situations, after the live runs found and fixed four defects that unit tests had missed."
trigger_phrases:
  - "runtime certainty claude pi opencode implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/022-runtime-certainty-claude-pi-opencode"
    last_updated_at: "2026-10-22T13:05:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Live matrix done; four defects fixed"
    next_safe_action: "Validate the packet, then merge to main"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"
      - ".skilled/hooks/session-relaunch/lib/nudge.cjs"
      - ".skilled/hooks/session-relaunch/pi/session-relaunch.ts"
      - ".opencode/plugins/session-relaunch.js"
      - ".skilled/bin/skilled-loop"
      - ".skilled/bin/skilled-loop-shell.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "5820adf5-6b90-452d-9421-385ec95d7f40"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-runtime-certainty-claude-pi-opencode |
| **Completed** | 2026-10-22 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now trust a relaunch on Claude, Pi and OpenCode in the situations that used to be guesses: sub-agents, nested runs, compaction outside the loop, two sessions at once, an interrupt mid-hop and a turn started just after the arm. Every one of them ran live against a recorded commit, and four defects that no unit test had caught were fixed before the final runs.

### Phase 22: runtime-certainty-claude-pi-opencode

Nested runs no longer hijack the loop. A `claude -p` or `pi -p` started from a looped session's shell inherits the loop's variables. The adapters and the CLI now check the process tree and treat such a run as outside the loop, so it can never arm the outer loop or relaunch the wrong runtime. OpenCode `task` sub-agents are skipped by their `parentID`, so a sub-agent never nudges, arms or receives a seed.

Compaction outside the loop now works on Pi and OpenCode as it already did on Claude. After a compaction, the session is pointed back at the note it kept, and the stale nudge that quoted the old fill is dropped.

The live runs found four more problems, each fixed with a failing test first:

- Two OpenCode sessions started in the same second planned the same note, and one overwrote the other. Note names now carry the full session id.
- On OpenCode and on Pi, a turn the operator started just after the arm was signalled mid-turn. Each adapter now withdraws the arm when its session starts a new turn.
- The shell shim's helpers vanished from Claude Code's tool shells, so a nested `claude` there exited 127. The helpers now have plain names.
- A relaunched session that ended before claiming its note left no trace. The wrapper now warns and prints the manual claim command.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | Nested-run check: `hostRuntimePid`, `nestedUnderLoop`, `dropNestedLoop` |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modified | Full session id in new note names; legacy names still read |
| `.skilled/hooks/session-relaunch/claude/context-nudge.mjs`, `claude/stop-arm.mjs` | Modified | Drop the loop variables in a nested run |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | `prepare` and `keep` drop the loop variables in a nested run |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modified | Compaction pointer, nested-run drop, arm withdrawal on `agent_start` |
| `.opencode/plugins/session-relaunch.js` | Modified | Child-session skip, compaction pointer, nested-run drop, arm withdrawal on a new user message |
| `.opencode/plugins/tests/plugin-inventory.json` | Modified | Lists `session.updated` for the v2 bridge check |
| `.skilled/bin/skilled-loop` | Modified | Not-claimed warning with the manual command |
| `.skilled/bin/skilled-loop-shell.sh` | Modified | Plain helper names |
| Tests under `.skilled/hooks/session-relaunch/tests/`, `pi/session-relaunch.test.ts`, `.opencode/plugins/tests/session-relaunch.test.cjs`, `tests/fixtures/nested-run.cjs` | Created/Modified | One test per change, written to fail first |
| `.skilled/hooks/session-relaunch/README.md` | Modified | Sub-agents and nested runs, Pi and OpenCode compaction, arm withdrawal, note names, shim naming, not-claimed warning |
| `manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md`, `session-relaunch-pi-opencode.md` | Modified | Dated results for 2026-10-22 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Probes came first, so each fix keys on an observed payload. OpenCode 1.19.3 marks a `task` sub-agent with `info.parentID` on `session.created` and `session.updated` and fires `session.compacted` on the compacted session's own id. Pi 1.3.0 has no built-in sub-agent and emits `session_compact`.

Each change went to DeepSeek v4.1 flash through cli-pi as one brief: a test brief whose new test had to fail, then a fix brief. Briefs ran in parallel only when their file lists were disjoint. Every live run used tmux with its own `XDG_RUNTIME_DIR`, a 0.05 threshold and a 200,000-token window for Pi and OpenCode. Raw evidence sits under `scratch/evidence/<run>/` (gitignored), one row per run in `scratch/evidence/LEDGER.md`. Rows a fix touched ran again on the fixed commit.

Commits, in order: `57f6b436b2` nested runs, sub-agents and compaction pointers; `58449ea2bd` not-claimed warning; `79e9a72882` shim helper names; `ecd8873efa` full-id note names; `ab21395e74` OpenCode arm withdrawal; `5af08b2f1a` Pi arm withdrawal.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat a host as nested only on positive proof: two or more processes between it and the loop pid | The loop's own runtime sits directly under the wrapper, and the shim adds one shell, so anything deeper was started from inside a session. Unreadable tables fail open. |
| Withdraw the arm on a new turn instead of lengthening the killer's wait | A fixed wait still guesses, and a long thought outlasts it. A started turn is proof the session is alive. See ADR-002. |
| Name notes by the full session id, and keep reading the old eight-character names | OpenCode and Pi ids share a time-based prefix; the full id is already used for the state file. Reading old names keeps notes written before the change. |
| Waive the live OpenCode nested run | The model refused to self-invoke under the cli-opencode skill, and the shared code passed live on Claude and Pi. See ADR-001. |
| Leave a single exec'd command undetected by the shell-child check | Telling an exec'd `sleep` from an MCP server or git child would need guesses about process names; the arm withdrawal and the idle wait already keep that turn alive. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/session-relaunch/tests/` | PASS, 622/622 (baseline 597) |
| `node --test .opencode/plugins/tests/` | PASS, 533/533 |
| `npx vitest run --config .skilled/hooks/vitest.config.ts` | PASS, 461/461, Pi adapter 49/49 |
| `tsc -p tsconfig.pi.json --noEmit` | PASS, exit 0 |
| `shellcheck .skilled/bin/skilled-loop-shell.sh` | PASS, clean |
| `run-all-drift-guards.sh` | PASS, 4/4 guards |
| `sync-hook-registrations.cjs --check` | PASS, exit 0 |
| README and playbook `validate_document.py` | PASS, 0 issues each |

### Tests written to fail first

Nested runs: `nestedUnderLoop is true for a runtime started from the loop runtime shell`, `dropNestedLoop removes the loop variables for a nested run`, `a nested run gets the outside-the-loop nudge`, `stop-arm leaves a nested run's pending record untouched`, `prepare from a nested run prints the manual command and exits 3`, `keep from a nested run behaves as outside the loop`, `the plugin drops the loop variables when it runs nested`, `drops the loop variables when the extension runs nested`. Sub-agents: `a task sub-agent session never receives a nudge`, `a sub-agent session.idle never arms a pending record`, `a sub-agent never receives the claim seed`. Compaction: `after compaction the next transform points the session at its open note`, `compaction drops the active nudge text`, `after compaction the first-level nudge fires again`, `points a compacted session at its open note`, `drops a nudge held before the compaction`. Wrapper and shim: `a relaunched runtime that exits before claiming prints the manual claim command`, `runtime functions still work after a snapshot drops single-underscore functions` (bash and zsh). Note names: `two OpenCode sessions with a shared id prefix plan different notes in the same second`, `a planned note name carries the full session id`. Arm withdrawal: `a new user message disarms the armed record it owns`, `agent_start disarms the armed record this session owns`. Gaps the coverage map named, where the behavior already worked and only the test was missing, so these were not written to fail and their first-run status was not recorded: `stop-arm leaves a pending record alone when the relaunch concern is disabled`, `prepare refuses a live shell child of the Pi loop runtime`, `prepare refuses a live shell child of the OpenCode loop runtime`.

### Live matrix

Run names point at `scratch/evidence/<run>/` and the ledger row. Claude ran Claude Code 2.1.306 to 2.1.308; Pi 1.3.0 and OpenCode 1.19.3 ran `openai/gpt-6-luna`.

| Situation | Claude | Pi | OpenCode |
|---|---|---|---|
| S1 hop, model carry, spec folder | PASS `57f6b436b2` c-s1; rerun `5af08b2f1a` c-s1b | PASS `ab21395e74` p-s1 | PASS `58449ea2bd` o-s1 |
| S2 one nudge and one re-nudge | PASS c-s2 | PASS p-s1 | PASS o-s8, o-s4 |
| S3 keep, compact, claim | PASS c-s3 | PASS p-s3 | PASS `79e9a72882` o-s3 |
| S4 hop cap | PASS c-s4 | PASS p-s4 | PASS o-s4 |
| S5 stale record | PASS c-s5 | PASS p-s5 | PASS o-s5 |
| S6 busy at arm time | PASS c-s6 | FAIL, fixed, PASS `5af08b2f1a` p-s6 | FAIL, fixed, PASS `ab21395e74` o-s6 |
| S7 live shell child | PASS c-s7 | PASS p-s7 | PASS with limit o-s7 |
| S8 sub-agent | PASS c-s8 | Not applicable | PASS o-s8 |
| S9 two loops at once | PASS `58449ea2bd` c-s9 | PASS p-s9 | FAIL, fixed, PASS `ab21395e74` o-s9 |
| S10 kill switch | PASS c-s10 | PASS p-s10 | PASS o-s10 |
| S11 worktree, subdirectory, linked-repo shim | PASS c-s1, s11-shim | PASS p-s11, s11-shim | PASS o-s11, s11-shim |
| S12 interrupt before claim | PASS `58449ea2bd` c-s12b | PASS p-s12 | PASS o-s12 |
| S13 nested run | PASS c-s13b | PASS p-s13 | Waived, ADR-001 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A single exec'd command is not a shell child.** `zsh -c 'sleep 45'` becomes a `sleep` process, so prepare does not refuse it. The arm withdrawal and the killer's idle wait still keep that turn from being cut off; on OpenCode the killer signalled 19 s after the sleep ended.
2. **No live nested run on OpenCode.** The model refuses to start OpenCode from OpenCode under the cli-opencode skill. ADR-001 records the waiver.
3. **No timeout notification on Pi and OpenCode for a busy arm.** The arm is withdrawn instead, and the wrapper prints the manual claim command at exit. ADR-002 records the trade.
4. **Pi passes its own interrupt status through.** After an interrupt before the claim, the wrapper exits 130 on Pi and 0 on OpenCode, with the same warning and manual command on both.
5. **The Claude shim path of S13 runs live only after the merge.** Claude Code's tool shell sources `~/.zshrc`, which loads the main checkout's shim. The shim fix is proven by the snapshot replay tests in bash and zsh, and the core nested path passed live.
6. **Versions.** Certainty covers Claude Code 2.1.306 to 2.1.308, Pi 1.3.0 and OpenCode 1.19.3. Pi 1.4.0 is available and untested. A host upgrade that changes event payloads needs the probes and the matrix again.
7. **Model behavior, not mechanism.** GPT-6 Luna sometimes shortened `/Users/michelkerkmeester` to `/Users/michelkerkme`, stopped when an evidence file did not exist yet, or took the finish-instead branch, and needed the step resent. None of these touched the relaunch mechanism.
8. **Out of scope.** The Hermes live-run contradiction between the phase 013 and 016 summaries and the playbook stays open, as do Codex, Cursor and Devin, which this phase did not certify.
<!-- /ANCHOR:limitations -->

---
