---
title: "Tasks: cli-cursor hooks Claude-parity expansion"
description: "Task breakdown for the 5-tier Cursor hooks Claude-parity expansion and its live-fire verification."
trigger_phrases: ["cli-cursor hooks Claude parity tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/011-cursor-hooks-claude-parity"
    last_updated_at: "2026-07-24T18:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-claude-parity", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: cli-cursor hooks Claude-parity expansion

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Read `.cursor/hooks.json`, `shared.ts`, `session-start.ts`/`session-end.ts` to confirm the phase-010 4-entry baseline and TS-adapter pattern
- [x] T002 Probe-hook research: `postToolUse` fires for `Write` and `Shell` tool_name payloads (isolated `/tmp` workspace, `cursor-agent -p --trust` dispatch) -- `tool_output` confirmed as a JSON-stringified string, plus a distinct `postToolUseFailure` variant with `error_message`/`failure_type`
- [x] T003 `preCompact` testability check: `grep -rniE "compact|context.window|token.limit"` over `cli-reference.md`/`cursor-tools.md` returned 0 hits; live `cursor-agent --help` exposes no compaction/context-limit flag
- [x] T004 `beforeMCPExecution` testability check: confirmed `.cursor/mcp.json` absent, `~/.cursor/mcp.json` 0 bytes, `cursor-agent mcp list` reports no configured servers
- [x] T005 `Task` tool_name probe: live subagent-delegation dispatch confirmed `tool_name: "Task"`, `tool_input: {description, prompt, model, subagent_type}`, and a child session re-fires `preToolUse` under its own `session_id`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T006 Added 4 `sessionStart` entries (`worktree-guard.sh`, `check-git-hooks.sh`, `check-dist-staleness.sh --all`, `install-codex-hooks.mjs --check`) + 1 `sessionEnd` entry (`session-cleanup.sh`) to `.cursor/hooks.json`
- [x] T007 Extended `shared.ts`'s `CursorHookEvent` union (`beforeSubmitPrompt`, `preCompact`) and `ClaudeHookAdapterFilename` (`compact-inject.js`); deliberately excluded `stop`
- [x] T008 Authored `user-prompt-submit.ts` -- explicit `prompt` field on top of `toClaudeShape()`, confirmed load-bearing by standalone test (target fails open to `{}` without it); uses `emitNormalizedCursorResponse()` for the JSON-envelope unwrap
- [x] T009 Authored `post-tool-use.mjs` (plain `.mjs`, direct-spawn, not through `shared.ts`) chaining `Write` -> `claude-posttooluse.cjs` + `code-graph-freshness.cjs`, `Shell` -> `dispatch-audit-posttooluse.mjs` with explicit `Shell`->`Bash` `tool_name` normalization
- [x] T010 Authored `task-dispatch-guard.mjs` (plain `.mjs`, `Task`-matcher `preToolUse` proxy) forwarding the payload as-is to `task-dispatch-guard.cjs`
- [x] T011 Authored `precompact.ts` (thin `preCompact` proxy to `compact-inject.js`, always emits plain allow)
- [x] T012 Authored `mcp-route-guard.mjs` (`beforeMCPExecution` advisory proxy); standalone-tested against a synthetic payload (returned a real Code-Mode-routed advisory); deliberately NOT wired
- [x] T013 Rebuilt compiled `dist/hooks/cursor/*.js` via `npm run build`
- [x] T014 Wired `postToolUse` (`post-tool-use.mjs`), 2nd `preToolUse` entry (`task-dispatch-guard.mjs`, `matcher: "Task"`), 2nd `beforeSubmitPrompt` entry (compiled `user-prompt-submit.js`), and new `preCompact` array (compiled `precompact.js`) into `.cursor/hooks.json`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T015 Live-fire dispatch 1 (file write + shell command, exit 0): marker log shows `sessionStart-fired` x1, `preToolUse-unmatched-fired` x3, `postToolUse-fired` x2 (Write + Shell), `sessionEnd-fired` x1
- [x] T016 Live-fire dispatch 2 (plain prompt "What is 2+2?", exit 0): marker log shows `sessionStart-fired`/`sessionEnd-fired` only -- NO `beforeSubmitPrompt` marker, re-confirming the pre-existing dormancy finding
- [x] T017 Live-fire dispatch 3 (explicit subagent-delegation prompt, exit 0): marker log shows `preToolUse-Task-fired` x1 AND `preToolUse-unmatched-fired` x1 for the SAME `Task` call, alongside `sessionStart-fired`/`sessionEnd-fired`
- [x] T018 Piped a synthetic `tool_name: "Shell"` payload directly through `post-tool-use.mjs`: produced a real new line in `.opencode/logs/cli-dispatch-audit.log` with correct `sessionID`/`callID`/`command`/`skill` fields
- [x] T019 Restored `.cursor/hooks.json` to its clean, un-wrapped, intended content; `diff` confirmed byte-identical before finishing; deleted all `/tmp` test artifacts
- [x] T020 `git status --porcelain` at repo root swept for collateral changes -- confirmed pre-existing concurrent-session activity (023/024/025 archive-move, mcp-tooling research, 036 metadata, sk-doc/019 research rounds) predated and was untouched by this pass
- [x] T021 `bash validate.sh 030-cli-cursor-creation --recursive --strict` -> confirmed passing
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] T022 `validate.sh 011-cursor-hooks-claude-parity --strict` passes 0/0; SC-001..SC-006 met; `implementation-summary.md` written
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Extends phase 004 (hook adapter layer) and phase 010 (`.cursor/hooks.json` live wiring) with 5 additional confirmed/registered adapters.
- Feeds the feature-catalog `cursor-hooks-and-spec-gate` entry and the manual-testing-playbook hooks category (new `CU-021`).
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
