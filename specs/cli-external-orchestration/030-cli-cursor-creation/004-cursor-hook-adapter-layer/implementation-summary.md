---
title: "Implementation Summary: Cursor hook adapter layer"
description: "Cursor hook adapters built and live-verified against a real cursor-agent CLI, overturning the phase's original event-mapping assumption; .cursor/hooks.json registration itself deferred by operator choice."
trigger_phrases: ["cursor hook adapter summary", "cursor hook delivery findings"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/004-cursor-hook-adapter-layer"
    last_updated_at: "2026-07-24T11:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented and live-verified Cursor hook adapters; registration deferred"
    next_safe_action: "Begin phase 005 (model registry and routing)"
    blockers: []
    key_files: ["../../../../.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/shared.ts", "../../../../.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs", "../../../../.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/README.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-implementation", parent_session_id: null }
    completion_pct: 100
    open_questions: ["Whether/when to register .cursor/hooks.json is an operator decision, deferred explicitly during this phase - not a technical blocker."]
    answered_questions: ["Cursor CLI event delivery under cursor-agent -p is empirically confirmed: sessionStart/preToolUse/postToolUse/sessionEnd/beforeShellExecution/afterShellExecution/beforeReadFile/afterFileEdit/afterAgentThought all fire; beforeSubmitPrompt/stop confirmed to NEVER fire across 3 dispatches including a --continue turn.", "The {permission:deny}+exit-2 response contract was live-verified to actually block a real cursor-agent tool call."]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- ANCHOR:metadata -->
## METADATA
| Field | Value |
|---|---|
| **Spec Folder** | 004-cursor-hook-adapter-layer |
| **Completed** | 2026-07-24 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

Cursor hook adapters mirroring the `cli-codex` precedent, but with the event mapping corrected against live CLI evidence rather than assumed from the sibling's event names.

### `mcp-server/hooks/cursor/` (TypeScript, compiled via the existing `mcp-server` build)
- `shared.ts`: reads/validates a bounded Cursor hook payload, translates it into the field shape the existing `../claude/*.js` implementations already accept, spawns them, and emits Cursor's native `{permission, user_message, agent_message}` response envelope (a materially different shape from Codex's `hookSpecificOutput` envelope).
- `session-start.ts`: `sessionStart` adapter, delegates to `session-prime.js`. Live-tested directly against the compiled `dist/hooks/cursor/session-start.js` with a real payload shape — returned a valid envelope carrying the actual Spec Kit Memory startup brief.
- `session-end.ts`: `sessionEnd` adapter, delegates to `session-stop.js`. **Not** named `session-stop.ts`/wired to `stop` — `stop` is confirmed to never fire under CLI dispatch (see below).
- `README.md`: full event-delivery table with per-event confirmed/dormant/untested status.

### `runtime/hooks/cursor/` (plain `.mjs`, no build step, matching the codex precedent)
- `spec-gate-enforce.mjs`: `preToolUse` hook (not `beforeShellExecution` — see Key Decisions). Maps confirmed `Shell`→`bash`/`Write`→`write` tool names onto `evaluateMutation()`. Live-tested directly: allows unmapped tools (`Grep`), allows mapped tools when no gate is open, and fails open on malformed stdin.
- `spec-gate-classify.mjs`: `beforeSubmitPrompt` hook, built to the same shape as the codex/claude siblings but explicitly marked **dormant** — the event it targets never fires under the CLI.
- `README.md`: documents why `preToolUse` was chosen over `beforeShellExecution`, and the dormant status of the classify hook.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED
1. Read the live `cli-codex` precedent in full (`shared.ts`, `session-start.ts`, `user-prompt-submit.ts`, `session-stop.ts`, `spec-gate-enforce.mjs`, `spec-gate-classify.mjs`, both READMEs) as the structural template.
2. **Before writing any adapter code**, live-probed which Cursor events actually fire: created a temporary, uncommitted `.cursor/hooks.json` wiring every documented agent event to a logging probe script, then ran 3 separate `cursor-agent -p` dispatches (2 single-turn + 1 `--continue` second turn) exercising shell commands, file reads, and file writes.
3. **Result inverted the phase's original assumption.** `sessionStart`/`beforeSubmitPrompt`/`stop` (mirroring Codex's `SessionStart`/`UserPromptSubmit`/`Stop`) was the phase's planned starting set. Empirically: `sessionStart` fires, but `beforeSubmitPrompt` and `stop` do NOT — confirmed across all 3 dispatches, including the `--continue` turn specifically testing whether `beforeSubmitPrompt` needed a second turn to trigger. Meanwhile `preToolUse` (not in the original plan) fires reliably before every tool call.
4. Updated `decision-record.md` ADR-002 with the full delivery table and corrected event mapping BEFORE writing adapter code, so the code matches the evidence rather than the other way around.
5. Live-verified the deny mechanism specifically: wired `preToolUse` to a probe that returns `{"permission":"deny",...}` + exit 2, dispatched a real session asking it to run a shell command, and confirmed the command never executed — direct proof the response contract works, not an assumption from documentation.
6. Wrote the adapter code, typechecked it (`tsc --noEmit`, 0 errors), built it (`npm run build` in `mcp-server/`), and directly invoked the compiled outputs with realistic payloads (see Verification).
7. Cleaned up all temporary test artifacts (`/tmp/cursor-hook-test/`, the temporary `.cursor/hooks.json`, scratch output files) before finishing — confirmed via `git status` that nothing stray remained.
8. Per operator's explicit choice (asked directly, given the real blast radius of a committed `.cursor/hooks.json` on their live Cursor editor usage of this repo), the actual project-level `.cursor/hooks.json` registration was NOT committed this phase — only the adapters and the live-verification evidence.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS
- **`preToolUse` chosen over `beforeShellExecution` for spec-gate-enforce.** Codex's enforce hook has exactly one pre-mutation gate to map onto (`PreToolUse`). Cursor exposes both narrower events (`beforeShellExecution`, with no pre-write-file equivalent at all) and a generic `preToolUse`/`postToolUse` pair. Live probing showed `preToolUse` fires before every tool call including `Write` — broader coverage with one hook than stitching together `beforeShellExecution` plus a non-existent "beforeWriteFile" event would have given.
- **`session-end.ts`/`sessionEnd` replaces the originally-planned `session-stop.ts`/`stop`.** `stop` never fired in any of 3 live dispatches. `sessionEnd` reliably fires with `reason`/`final_status` fields and a real `transcript_path` — it is the actual completion signal under `-p` dispatch, just timed after (not at) completion rather than at an interactive "stop" moment.
- **`spec-gate-classify.mjs` (Gate-3 advisory) built but not wired anywhere.** `beforeSubmitPrompt` — its only plausible attachment point — is confirmed to never fire. This is a genuine, load-bearing capability gap for `cli-cursor` dispatch: the advisory Gate-3 question cannot be surfaced pre-emptively the way it can for Codex/Claude. The enforce path (via `preToolUse`) still blocks unauthorized mutations regardless — the classify advisory is what's missing, not the deny capability.
- **`.cursor/hooks.json` registration deferred by explicit operator choice, not a technical blocker.** Asked directly before starting implementation: a committed project-level `.cursor/hooks.json` also fires for the operator's own Cursor editor usage of this repo (confirmed architecturally sound per ADR-001, fail-open mitigated), and the operator chose to see the adapters built and proven first, registering separately later. The live-verification evidence in this summary and in `mcp-server/hooks/cursor/README.md` is independent of that registration file — the adapters were tested directly and via a temporary, uncommitted probe file, never relying on the final committed config.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION
| Item | Result |
|---|---|
| `SC-001`: hook adapters fire in a live session, stdin/stdout evidence captured | PASS — 3 live dispatches via temporary probe hooks.json; full JSON payloads captured for every confirmed-firing event |
| `SC-002`: neutral hook cores show zero diff | PASS — `git diff --stat` empty for `hooks/claude/`, `runtime/lib/spec-gate/`, `hooks/codex/`, `runtime/hooks/codex/` |
| `SC-003`: both ADRs have a status + verification trigger | PASS — both `Accepted`; each documents a re-verification trigger (re-run the probe methodology when `cursor-agent`'s build changes) |
| `SC-004`: non-delivered events documented, not assumed closed | PASS — `beforeSubmitPrompt`/`stop` explicitly marked "confirmed non-delivery" (stronger than "undelivered") in the README delivery table |
| `tsc --noEmit` on the new `.ts` files | PASS — 0 errors |
| `npm run build` produces `dist/hooks/cursor/*.js` | PASS — `session-start.js`, `session-end.js`, `shared.js` all compiled |
| Direct invocation: `session-start.js` with a real sessionStart payload | PASS — returned `{"permission":"allow","agent_message":"## Session Context..."}`, the actual Spec Kit Memory startup brief |
| Direct invocation: `session-end.js` | PASS — exit 0, no crash |
| Direct invocation: `spec-gate-enforce.mjs` with `Grep` (unmapped tool) | PASS — `{"permission":"allow"}` |
| Direct invocation: `spec-gate-enforce.mjs` with `Shell` (mapped tool, no gate open) | PASS — `{"permission":"allow"}` |
| Direct invocation: `spec-gate-enforce.mjs` with malformed stdin | PASS — fail-open `{"permission":"allow"}`, exit 0 |
| Live deny-path test: `{"permission":"deny"}` + exit 2 via a real `cursor-agent` dispatch | PASS — the shell command was confirmed to never execute; the CLI reported the exact denial payload back |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS
1. **`.cursor/hooks.json` is not committed.** The adapters are built, typechecked, compiled, and live-verified independently, but the actual project-level registration file — the last step that would make these guards active for real dispatched/editor sessions — is an explicit, operator-deferred decision, not an oversight. Registering it is a small, well-understood follow-up (the exact JSON shape is documented in both READMEs) whenever the operator chooses.
2. **Gate-3 classify (advisory) has no working Cursor CLI attachment point today.** `beforeSubmitPrompt` is confirmed to never fire under `cursor-agent -p`/`--continue`. `spec-gate-classify.mjs` ships as ready, dormant code; it becomes wireable only if a future `cursor-agent` build starts delivering that event (re-verify via the same probe methodology before trusting it then).
3. **7 untested events remain genuinely unconfirmed**, not assumed either way: `postToolUseFailure`, `beforeMCPExecution`, `afterMCPExecution`, `preCompact`, `subagentStart`, `subagentStop`, `afterAgentResponse`. None was triggered by this phase's probe scenarios (no failure, no configured MCP server, no subagent spawn, no long-context compaction). Extending coverage to these (REQ-008, P2) requires scenarios that actually trigger them, live-tested the same way.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`
- `../003-cli-cursor-skill-packet/implementation-summary.md` (predecessor)
- `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/README.md`, `.opencode/skills/system-spec-kit/runtime/hooks/cursor/README.md` (full event-delivery evidence tables)
