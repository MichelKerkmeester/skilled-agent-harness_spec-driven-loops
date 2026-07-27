---
title: "Implementation Summary: cli-cursor hooks Claude-parity expansion"
description: "Wired 5 Tier-0 sessionStart/sessionEnd repo-guard scripts, a live-fire-confirmed postToolUse chain proxy and Task-matcher preToolUse dispatch guard, registered-for-parity beforeSubmitPrompt/preCompact proxies with unconfirmed delivery, authored-but-unwired an MCP-route advisory guard, and documented why the completion-evidence-stop analog was skipped."
trigger_phrases: ["cli-cursor hooks Claude parity implementation", "cursor postToolUse task-dispatch-guard live-fire"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/011-cursor-hooks-claude-parity"
    last_updated_at: "2026-07-24T18:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented, live-fire verified, documentation corrected, and validated"
    next_safe_action: "Commit"
    blockers: []
    key_files: [".cursor/hooks.json", ".opencode/skills/system-spec-kit/mcp-server/hooks/cursor/shared.ts", ".opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs", ".opencode/skills/system-spec-kit/mcp-server/hooks/cursor/task-dispatch-guard.mjs"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-claude-parity", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Wire the 5 Tier-0 scripts directly: yes, no Cursor-specific shape needed.", "Wire mcp-route-guard.mjs despite no configured MCP server: no, mirrors spec-gate-classify.mjs's own re-confirm-before-wiring precedent.", "Wire completion-evidence-stop.cjs: no, its required last_assistant_message field has no Cursor-side source."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- ANCHOR:metadata -->
## METADATA
| Field | Value |
|---|---|
| **Spec Folder** | 011-cursor-hooks-claude-parity |
| **Completed** | 2026-07-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

`.cursor/hooks.json` (phase 010's committed baseline) is extended across five tiers, each carrying its own honestly-stated confidence level:

### Tier 0 -- BUILT + WIRED (confirmed)
Four new `sessionStart` entries (`bash .opencode/bin/worktree-guard.sh`, `bash .opencode/bin/check-git-hooks.sh`, `python3 .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh --all`, `node .opencode/bin/install-codex-hooks.mjs --check`) and one new `sessionEnd` entry (`bash .opencode/scripts/session-cleanup.sh`) run as direct commands alongside the phase-010 baseline entries -- no new adapter code, just registry additions confirmed firing in the same live-fire pass as the pre-existing entries (dispatch 1).

### Tier 1 -- `beforeSubmitPrompt` proxy, BUILT + REGISTERED (delivery unconfirmed)
`shared.ts`'s `CursorHookEvent` union gained `beforeSubmitPrompt` and `preCompact`; `ClaudeHookAdapterFilename` gained `compact-inject.js`. `stop` was deliberately NOT added -- `sessionEnd` is the confirmed-firing substitute already used by `session-end.ts`. `user-prompt-submit.ts` is a new thin proxy from `beforeSubmitPrompt` to the existing `user-prompt-submit.js` advisor-brief shim, wired as the 2nd `beforeSubmitPrompt` entry alongside `spec-gate-classify.mjs`. It adds an explicit `prompt` field on top of `toClaudeShape()` -- standalone-tested and confirmed load-bearing: `user-prompt-submit.js`'s `normalizePrompt()` fails open to `{}` with no advisory content whenever `input.prompt` is missing, so `toClaudeShape()` alone would have compiled and run but produced a silently-dead wire. Live-fire dispatch 2 (plain prompt) showed no `beforeSubmitPrompt` marker at all, re-confirming the pre-existing dormancy finding rather than contradicting it -- `session-end.ts` was left unchanged; Tier 1c (`completion-evidence-stop.cjs`) was skipped (see Known Limitations).

### Tier 2 -- `postToolUse`, BUILT + WIRED + LIVE-FIRE CONFIRMED
`post-tool-use.mjs` (plain `.mjs`, direct-spawn style matching `spec-gate-enforce.mjs`, not a thin `shared.ts` proxy since its 3 targets live outside `mcp-server/hooks/claude/`) reads `postToolUse` and chains `Write` -> `claude-posttooluse.cjs` + `code-graph-freshness.cjs`, and `Shell` -> `dispatch-audit-posttooluse.mjs` with an explicit `Shell`->`Bash` `tool_name` normalization -- that target's own matcher requires the literal string `bash`, so without the normalization the audit hook would have silently no-op'd on every Cursor `Shell` call. Wired as the sole `postToolUse` entry. Live-fire dispatch 1 showed `postToolUse-fired` x2 (Write + Shell). A synthetic `tool_name: "Shell"` payload piped directly through `post-tool-use.mjs` produced a real new line in `.opencode/logs/cli-dispatch-audit.log` with correct `sessionID`/`callID`/`command`/`skill` fields, independently proving the normalization reaches the target's matcher.

### Tier 3a -- `preCompact`, BUILT + WIRED (registered, delivery unconfirmed)
`precompact.ts` proxies `preCompact` -> `compact-inject.js` via `toClaudeShape()` (the target only requires a non-empty `session_id`, which `toClaudeShape()` supplies). It never relays an `agent_message` -- `compact-inject.js` only caches merged context for the NEXT `SessionStart` to inject; it never emits output for `PreCompact` to relay -- so the adapter always emits a plain allow envelope. Standalone test passed (`{"permission":"allow"}`). Across all 3 live-fire dispatches, no `preCompact` marker fired, matching the pre-existing prediction that no CLI-reachable compaction trigger exists (grep of `cli-reference.md`/`cursor-tools.md` for compaction flags: 0 hits; live `cursor-agent --help`: no compaction/context-limit flag).

### Tier 3b -- `mcp-route-guard.mjs`, BUILT, DELIBERATELY UNWIRED
Authored and standalone-tested against a synthetic `beforeMCPExecution`-shaped payload (returned a real advisory: routed `mcp__claude_ai_Figma__...` through Code Mode). NOT added to `.cursor/hooks.json` -- no MCP server is configured on this machine (repo `.cursor/mcp.json` absent, `~/.cursor/mcp.json` empty, `cursor-agent mcp list` reports none), so `beforeMCPExecution`'s actual payload shape (`tool_name`/`workspace_roots`, assumed by analogy to every other confirmed Cursor event) cannot be live-verified. Mirrors `spec-gate-classify.mjs`'s own "register... ONLY after re-confirming live delivery" precedent, applied before registration rather than after.

### Tier 4 -- `task-dispatch-guard.mjs`, BUILT + WIRED + LIVE-FIRE CONFIRMED
Added as a SECOND `preToolUse` array entry with `"matcher": "Task"` (the existing unmatched `spec-gate-enforce.mjs` entry preserved untouched). A real `cursor-agent` dispatch asking for subagent delegation produced both `preToolUse-Task-fired` and `preToolUse-unmatched-fired` marker lines for the same `Task` tool call (live-fire dispatch 3), confirming Cursor's `hooks.json` `matcher` schema field actually routes by `tool_name` as documented in `hook-contract.md` §2, and that both entries fire together rather than one shadowing the other.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED
1. Read `.cursor/hooks.json`, `shared.ts`, `session-start.ts`/`session-end.ts` to confirm the phase-010 4-entry baseline and the existing TS-adapter pattern before extending it.
2. Researched `postToolUse`'s real payload shape via a temporary probe-hook dispatch in an isolated `/tmp` workspace (self-invocation guard confirmed clean via `env | grep -i cursor_` returning empty before dispatch): confirmed `Write`/`Shell` tool_name payloads, `tool_output` as a JSON-stringified string, and a distinct `postToolUseFailure` variant.
3. Researched `preCompact`'s testability (grepped `cli-reference.md`/`cursor-tools.md` for compaction flags: 0 hits; ran live `cursor-agent --help`: no compaction/context-limit control) and `beforeMCPExecution`'s testability (confirmed no MCP server configured on this machine via `cursor-agent mcp list` and direct file checks).
4. Researched the `Task` tool_name via a live probe-hook dispatch requesting subagent delegation, capturing the real `tool_input: {description, prompt, model, subagent_type}` shape and confirming a delegated child session re-fires `preToolUse` under its own child `session_id`.
5. Added the 5 Tier-0 entries to `.cursor/hooks.json` as direct command invocations -- no new adapter code needed.
6. Extended `shared.ts`'s `CursorHookEvent`/`ClaudeHookAdapterFilename` unions, then authored `user-prompt-submit.ts` and `precompact.ts` as thin TS proxies reusing the existing helpers, and `post-tool-use.mjs`/`task-dispatch-guard.mjs`/`mcp-route-guard.mjs` as plain-`.mjs` direct-spawn proxies (their targets live outside `mcp-server/hooks/claude/`, so `shared.ts`'s `runClaudeHookAdapter()` cannot reach them).
7. Standalone-tested every new adapter with synthetic stdin before any wiring decision: `user-prompt-submit.js` returned a real advisor `agent_message` (proving the `prompt` field addition load-bearing); `precompact.js` returned a clean allow envelope; `task-dispatch-guard.mjs` and `mcp-route-guard.mjs` were tested against synthetic Task/MCP-shaped payloads.
8. Rebuilt `dist/hooks/cursor/*.js` via `npm run build` so the compiled-path entries (`sessionStart`, `beforeSubmitPrompt`, `preCompact`) resolve against fresh output.
9. Wired `postToolUse`, the 2nd `preToolUse` (Task-matched) entry, the 2nd `beforeSubmitPrompt` entry, and the new `preCompact` array into `.cursor/hooks.json`; deliberately left `mcp-route-guard.mjs` out.
10. Live-fire tested via a temporary marker-wrapper diagnostic (`bash -c "echo <marker>-fired-$(date +%s) >> <logfile>; <original command>"` substituted for every `.cursor/hooks.json` entry) across 3 real `cursor-agent -p --model composer-2.5 --output-format text --auto-review --sandbox enabled </dev/null` dispatches from repo root, confirming the self-invocation guard clean each time.
11. Piped a synthetic `tool_name: "Shell"` payload directly through `post-tool-use.mjs` (non-wrapped, before restoring the wrapper) to independently prove the `Shell`->`Bash` normalization reaches `dispatch-audit-posttooluse.mjs`'s literal-string matcher.
12. Restored `.cursor/hooks.json` to its clean, un-wrapped, intended content; diffed it byte-identical before finishing; deleted all `/tmp` test artifacts (wrapped-hooks backup, marker log, dispatch logs, probe workdir/files).
13. Ran a full-repo `git status --porcelain` sweep and confirmed the pre-existing concurrent-session activity (023/024/025 archive-move, mcp-tooling research.md, 036 metadata, sk-doc/019 research rounds, `system-skill-advisor/mcp_server/`) predated this pass and was left entirely untouched.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS
- **Wire Tier 0 directly, no proxy layer.** The 5 repo-guard scripts already take no Cursor-specific input shape and already print advisory text / fail open on their own (same scripts the Claude-side hooks already invoke); a thin-proxy layer would add indirection with zero behavioral benefit.
- **`Shell`->`Bash` normalization in `post-tool-use.mjs`, not left to the target.** `dispatch-audit-posttooluse.mjs` matches `tool_name.toLowerCase() === 'bash'` literally; Cursor's own `Shell` tool_name would never match without this explicit rename, so the normalization had to live in the proxy, not be assumed away.
- **`task-dispatch-guard.mjs` as a SECOND `preToolUse` entry, not a replacement.** The existing unmatched `spec-gate-enforce.mjs` entry already covers every tool call; adding a `matcher: "Task"` entry alongside it (rather than merging logic into one script) keeps each guard's responsibility isolated and was confirmed by live-fire to actually fire both entries for the same call, not shadow one another.
- **Register `beforeSubmitPrompt`/`preCompact` for parity even though delivery is unconfirmed, rather than skip them.** This mirrors `spec-gate-classify.mjs`'s own precedent from phase 004/010: build the thin proxy, wire it, document the status honestly, rather than waiting for a confirmation that may never arrive under the current CLI build.
- **Do NOT wire `mcp-route-guard.mjs` without a configured MCP server.** Applying the same "re-confirm before wiring" precedent one step earlier -- before any registration, not just before trusting the result -- since there is no way to capture a real `beforeMCPExecution` payload on this machine to check the assumed field names against.
- **Do NOT build a Tier-1c completion-evidence analog.** `completion-evidence-stop.cjs` requires `payload.last_assistant_message`, a field Cursor's `sessionEnd` payload never carries (only `transcript_path`, a JSONL path), and a `lastSpecFolder` state file only the Claude-side `Stop` hook populates. Building real Cursor-transcript-JSONL parsing to backfill that field would be new capability, not a thin proxy, and was out of this pass's scope.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION
| Item | Result |
|---|---|
| Tier 0 (5 new sessionStart/sessionEnd entries) firing (SC-001) | PASS -- dispatch 1 marker log: `sessionStart-fired` x1, `sessionEnd-fired` x1, alongside `preToolUse-unmatched-fired` x3, `postToolUse-fired` x2 |
| Tier 4 `Task`-matcher guard firing alongside the unmatched entry (SC-002) | PASS -- dispatch 3: `preToolUse-Task-fired` x1 AND `preToolUse-unmatched-fired` x1 for the same Task call |
| Tier 1 `beforeSubmitPrompt` dormancy re-confirmed, not contradicted (SC-003) | PASS -- dispatch 2 (plain prompt): no `beforeSubmitPrompt` marker |
| Tier 2 `Shell`->`Bash` normalization reaching the target matcher (SC-004) | PASS -- synthetic pipe produced a real new `.opencode/logs/cli-dispatch-audit.log` line with correct fields |
| `.cursor/hooks.json` restored byte-identical (SC-005) | PASS -- `diff` against the clean, un-wrapped, intended content showed no differences |
| Whole-packet `validate.sh --recursive --strict` (SC-006) | PASS |
| No embedded credential in `.cursor/hooks.json` or new adapter files | PASS -- security grep 0 matches |
| No absolute machine-specific paths added | PASS -- confirmed by direct read |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS
1. **Tier 1c skipped, not broken.** `completion-evidence-stop.cjs` requires `payload.last_assistant_message` (a literal string of the final turn's text, read via `JSON.parse(stdin)`), which Cursor's `sessionEnd` payload never carries -- only `transcript_path`, a JSONL file path. It also depends on a `lastSpecFolder` state file keyed by `sha256(cwd)`/`sha256(sessionId)` that no Cursor-side hook currently populates. Building real Cursor-transcript-JSONL parsing to backfill `last_assistant_message` would be new capability, not a thin proxy, and was out of this pass's scope.
2. **`dispatch-audit-posttooluse.mjs` provenance drift.** The chained script hardcodes `runtime: 'claude'` in its recorded audit line even when proxied from Cursor via `post-tool-use.mjs` -- confirmed live (the recorded audit line shows `runtime:"claude"`). This is inherited, cosmetic provenance drift from reusing the Claude script unmodified (in-scope files only; the shared Claude script itself was not touched, per scope lock).
3. **`beforeSubmitPrompt` and `preCompact` are registered for parity but confirmed/predicted dormant** under the current `cursor-agent` build (`2026.07.23-e383d2b`) -- re-verify against a future build.
4. **`mcp-route-guard.mjs` (Tier 3b) is built and standalone-verified logically sound but not wired**; its assumed `beforeMCPExecution` payload field names (`tool_name`/`workspace_roots`) are inferred by analogy to every other confirmed Cursor event, not independently confirmed, since no MCP server is configured on this machine to capture a real payload against.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`
- `.cursor/hooks.json`
- `../010-cursor-hooks-live-wiring/implementation-summary.md` (predecessor, same live-fire methodology)
- `../004-cursor-hook-adapter-layer/decision-record.md` (ADR-001, the decision this phase further extends)
