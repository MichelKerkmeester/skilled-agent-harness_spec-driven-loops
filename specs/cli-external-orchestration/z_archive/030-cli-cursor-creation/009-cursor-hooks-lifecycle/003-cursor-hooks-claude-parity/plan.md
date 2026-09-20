---
title: "Implementation Plan: cli-cursor hooks Claude-parity expansion"
description: "Plan for wiring the confirmed-firing Tier 0/2/4 Cursor hook additions, registering the plausible-but-unconfirmed Tier 1/3a additions for parity, authoring but leaving unwired the Tier 3b MCP guard, and skipping the Tier 1c completion-evidence chain with its reason documented."
trigger_phrases: ["cli-cursor hooks Claude parity plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/003-cursor-hooks-claude-parity"
    last_updated_at: "2026-07-24T18:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 3 phases complete"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files: ["spec.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-claude-parity", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: cli-cursor hooks Claude-parity expansion

<!-- ANCHOR:summary -->
## 1. SUMMARY
Extend phase 010's committed `.cursor/hooks.json` toward Claude-adapter parity across five tiers: wire 5 direct repo-guard scripts to `sessionStart`/`sessionEnd` (Tier 0, confirmed); author and wire a `postToolUse` chain proxy (Tier 2, confirmed) and a `Task`-matcher `preToolUse` dispatch guard (Tier 4, confirmed); author and register a `beforeSubmitPrompt` advisor proxy and a `preCompact` proxy for parity (Tier 1/3a, registered but delivery unconfirmed); author but deliberately leave unwired an MCP-route advisory guard (Tier 3b, no configured server to verify against); and explicitly skip the Tier-1c completion-evidence chain, documenting why it cannot be a thin proxy.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [x] Tier 0's 5 sessionStart/sessionEnd script entries live-fire confirmed alongside the pre-existing 4 phase-010 entries.
- [x] Tier 2's `postToolUse` proxy live-fire confirmed for both `Write` and `Shell` tool_name payloads, including the `Shell`->`Bash` normalization reaching `dispatch-audit-posttooluse.mjs`.
- [x] Tier 4's `Task`-matcher `preToolUse` guard live-fire confirmed against a real subagent-delegation dispatch, firing alongside (not instead of) the existing unmatched entry.
- [x] Tier 1/3a's `beforeSubmitPrompt`/`preCompact` proxies standalone-tested and registered, with unconfirmed-delivery status stated honestly (not claimed as confirmed).
- [x] Tier 3b's `mcp-route-guard.mjs` authored and standalone-tested, deliberately NOT added to `.cursor/hooks.json`.
- [x] `.cursor/hooks.json` restored byte-identical to its clean, intended content before commit (diagnostic wrapper fully reverted).
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Five additive changes to the existing schema documented in `references/hook-contract.md` §2. Tier 0 adds plain `bash`/`python3`/`node` command entries with no new adapter code. Tier 2/4 add new plain-`.mjs` proxies (`post-tool-use.mjs`, `task-dispatch-guard.mjs`) that spawn existing Claude-side/runtime-neutral scripts directly by repo-relative path -- NOT through `shared.ts`'s `runClaudeHookAdapter()`, because their targets live outside `mcp-server/hooks/claude/` (in `sk-code`, `system-code-graph`, `cli-external-orchestration`, and `system-deep-loop` respectively), so that helper's `../claude/<filename>` resolution cannot reach them. Tier 1/3a add new thin TS proxies (`user-prompt-submit.ts`, `precompact.ts`) that DO use `shared.ts`'s existing `runClaudeHookAdapter()`/`toClaudeShape()`/`emitNormalizedCursorResponse()` helpers, extending `CursorHookEvent` and `ClaudeHookAdapterFilename` to cover the two new event/target names. Tier 3b (`mcp-route-guard.mjs`) follows the same plain-`.mjs` direct-spawn pattern as Tier 2/4 but is authored and standalone-tested only -- never added to the registry. `task-dispatch-guard.mjs` is registered as a SECOND `preToolUse` array entry (`"matcher": "Task"`) alongside the existing unmatched `spec-gate-enforce.mjs` entry, confirmed by `hook-contract.md` §2 to be a real schema field and by live dispatch to actually route by `tool_name`.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `.cursor/hooks.json` | 4-adapter registration from phase 010 | Add 5 Tier-0 entries, 1 postToolUse array, 1 2nd preToolUse (Task) entry, 1 2nd beforeSubmitPrompt entry, 1 preCompact array | Live-fire marker-wrapper dispatch, byte-identical diff after revert |
| `mcp-server/hooks/cursor/shared.ts` | Types + helpers for TS adapters | Extend `CursorHookEvent`/`ClaudeHookAdapterFilename` unions | `tsc`/build clean, `npm run build` produces updated `dist/` |
| `mcp-server/hooks/cursor/user-prompt-submit.ts` (new) | Did not exist | Thin `beforeSubmitPrompt` proxy | Standalone synthetic-stdin test |
| `mcp-server/hooks/cursor/post-tool-use.mjs` (new) | Did not exist | Plain `postToolUse` chain proxy | Live-fire dispatch 1 + synthetic Shell-payload pipe into a real audit-log line |
| `mcp-server/hooks/cursor/task-dispatch-guard.mjs` (new) | Did not exist | `Task`-matcher `preToolUse` proxy | Live-fire dispatch 3 |
| `mcp-server/hooks/cursor/precompact.ts` (new) | Did not exist | Thin `preCompact` proxy | Standalone synthetic-stdin test; live-fire absence noted (expected) |
| `mcp-server/hooks/cursor/mcp-route-guard.mjs` (new, unwired) | Did not exist | `beforeMCPExecution` advisory proxy, standalone only | Standalone synthetic-payload test; NOT wired |
| `feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md` + `feature-catalog.md` | Documents 4-adapter status from phase 010 | Add the newly wired/confirmed adapter statuses | Grep + direct read |
| `cli-cursor/manual-testing-playbook/manual-testing-playbook.md` (+ new `hooks/*.md`) | 3 hooks scenarios (`CU-013/014/020`) | Add `CU-021` for the live-fire-confirmed Task guard | Direct read against the per-feature-file pattern |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `.cursor/hooks.json`, `shared.ts`, `session-start.ts`, and `session-end.ts` to confirm the existing 4-entry registration and the TS-adapter pattern this phase extends.
- [x] Researched `postToolUse`'s real payload shape via a temporary probe-hook dispatch (isolated `/tmp` workspace) -- confirmed `Write` and `Shell` tool_name payloads, `tool_output` as a JSON-stringified string (not a nested object), and a distinct `postToolUseFailure` variant.
- [x] Researched `preCompact`'s testability -- confirmed no forcing mechanism exists (grep of `cli-reference.md`/`cursor-tools.md` for compaction-related flags returned zero hits; live `cursor-agent --help` exposes no compaction/context-limit flag).
- [x] Researched `beforeMCPExecution`'s testability -- confirmed no MCP server is configured on this machine (`.cursor/mcp.json` absent, `~/.cursor/mcp.json` empty, `cursor-agent mcp list` reports none).
- [x] Researched the `Task` tool_name via a live probe-hook dispatch requesting subagent delegation -- confirmed `tool_name: "Task"`, `tool_input: {description, prompt, model, subagent_type}`, and that a delegated child session re-fires `preToolUse` under its own child `session_id`.

### Phase 2: Core Implementation
- [x] Added 4 `sessionStart` entries (`worktree-guard.sh`, `check-git-hooks.sh`, `check-dist-staleness.sh --all`, `install-codex-hooks.mjs --check`) and 1 `sessionEnd` entry (`session-cleanup.sh`) to `.cursor/hooks.json` as direct command invocations.
- [x] Extended `shared.ts`'s `CursorHookEvent` union with `beforeSubmitPrompt`/`preCompact` and `ClaudeHookAdapterFilename` with `compact-inject.js`; deliberately excluded `stop` (`sessionEnd` is the confirmed-firing substitute).
- [x] Authored `user-prompt-submit.ts`, adding an explicit `prompt` field on top of `toClaudeShape()` (confirmed load-bearing by standalone test: the target's `normalizePrompt()` fails open to `{}` without it) and using `emitNormalizedCursorResponse()` to unwrap the target's JSON envelope.
- [x] Authored `post-tool-use.mjs` as a plain-`.mjs` proxy (not through `shared.ts`, since its 3 targets live outside `mcp-server/hooks/claude/`), chaining `Write` -> `claude-posttooluse.cjs` + `code-graph-freshness.cjs` and `Shell` -> `dispatch-audit-posttooluse.mjs` with an explicit `Shell`->`Bash` `tool_name` normalization.
- [x] Authored `task-dispatch-guard.mjs` as a plain-`.mjs` `Task`-matcher `preToolUse` proxy forwarding the payload as-is to `task-dispatch-guard.cjs` (no field renaming needed -- the existing guard core already reads `subagent_type`/`subagentType`).
- [x] Authored `precompact.ts` as a thin `preCompact` proxy to `compact-inject.js`, emitting a plain allow envelope always (the target never emits output for `PreCompact` to relay).
- [x] Authored `mcp-route-guard.mjs` as a plain-`.mjs` `beforeMCPExecution` advisory proxy; standalone-tested against a synthetic payload (returned a real advisory routed through Code Mode); deliberately NOT added to `.cursor/hooks.json`.
- [x] Rebuilt the compiled `dist/hooks/cursor/*.js` output via `npm run build` so `sessionStart`/`beforeSubmitPrompt`/`preCompact` entries pointing at compiled `.js` files resolve against fresh output.
- [x] Wired `postToolUse` (`post-tool-use.mjs`), a 2nd `preToolUse` entry (`task-dispatch-guard.mjs`, `matcher: "Task"`), a 2nd `beforeSubmitPrompt` entry (compiled `user-prompt-submit.js`), and a new `preCompact` array (compiled `precompact.js`) into `.cursor/hooks.json`.

### Phase 3: Verification
- [x] Live-fire tested via a temporary marker-wrapper diagnostic (`bash -c "echo <marker>-fired-$(date +%s) >> <logfile>; <original command>"` around every `.cursor/hooks.json` entry) across 3 real `cursor-agent -p --model composer-2.5` dispatches, confirming the self-invocation guard was clean (`env | grep -i cursor_` empty) before each.
- [x] Piped a synthetic `tool_name: "Shell"` payload directly through `post-tool-use.mjs`, confirming a real new line in `.opencode/logs/cli-dispatch-audit.log` with correct `sessionID`/`callID`/`command`/`skill` fields -- proving the `Shell`->`Bash` normalization reaches the target's literal-string matcher rather than silently no-op'ing.
- [x] Restored `.cursor/hooks.json` to its clean, un-wrapped, intended content and diffed it byte-identical before finishing; deleted all `/tmp` test artifacts (wrapped-hooks backup, marker log, dispatch logs, probe workdir/files).
- [x] Ran `git status --porcelain` at repo root and confirmed unrelated concurrent-session activity (023/024/025 archive-move, mcp-tooling research, 036 metadata, sk-doc/019 research rounds) was pre-existing and untouched by this pass.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Empirical live-fire testing against the real repo (same methodology as phase 010), plus targeted standalone synthetic-stdin tests for adapters whose live trigger cannot be manufactured (`preCompact`) or whose live target is unconfigured (`mcp-route-guard.mjs`). A temporary marker-wrapper substituted for each hook's `command` field across 3 real `cursor-agent -p --model composer-2.5 --output-format text --auto-review --sandbox enabled </dev/null` dispatches (file write + shell command; a plain arithmetic prompt; an explicit subagent-delegation prompt), with the resulting marker log inspected for unambiguous per-event proof, then the wrapper reverted to the clean command before commit. `user-prompt-submit.js`/`precompact.js`/`task-dispatch-guard.mjs`/`mcp-route-guard.mjs` were each also standalone-tested with synthetic stdin payloads before any wiring decision, independent of the live-fire pass.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 010 (`.cursor/hooks.json` live wiring) | Internal | Green (committed, this phase extends the same file) | Source of the 4-adapter baseline this phase adds to |
| `mcp-server` dist build | Internal | Green -- rebuilt via `npm run build` after the new/changed `.ts` sources | `sessionStart`/`beforeSubmitPrompt`/`preCompact` entries pointing at compiled `.js` output require fresh compilation |
| A configured MCP server (for `mcp-route-guard.mjs` wiring) | External | Red -- not configured on this machine | `beforeMCPExecution` cannot be live-verified; adapter stays authored-but-unwired until resolved |
| A long real session that triggers compaction (for `preCompact` confirmation) | External | Red -- no forcing mechanism reachable from a single `-p` dispatch | `preCompact` delivery stays registered-but-unconfirmed until a future long session or CLI build exposes one |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Revert `.cursor/hooks.json` to its phase-010 4-entry state (`git checkout HEAD~1 -- .cursor/hooks.json` once this phase's commit lands, or a manual edit removing the added entries). Every new adapter is fail-open by design, so mid-flight removal cannot leave a session blocked. `user-prompt-submit.ts`/`post-tool-use.mjs`/`task-dispatch-guard.mjs`/`precompact.ts`/`mcp-route-guard.mjs` can each be deleted independently without affecting the phase-010 baseline adapters, since none of them modify `shared.ts`'s existing exports, only add to its type unions.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
Extends the completed `030-cli-cursor-creation` packet (phase 004's original hook-adapter layer and phase 010's live-wiring registration specifically); independent of phases 002/003/005/006/008/009.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|---|---|---|
| Setup (postToolUse/Task/preCompact/MCP research) | Medium | 45-60 min |
| Core implementation (5 new/modified adapter files + registry wiring + rebuild) | High | 1.5-2 hours |
| Verification (3-dispatch live-fire pass + synthetic pipe test + cleanup) | Medium | 45 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
Five new/modified adapter files (all fail-open by design) + one registry file extension + doc updates. Low-to-medium blast radius: the genuine cross-surface effect is that Cursor-editor users of this repo now also receive the Tier-0 startup checks, the postToolUse quality/audit chain, and the Task-scoped dispatch guard -- an intentional extension of phase 010's already-approved ADR-001 scope, not an accidental one. `mcp-route-guard.mjs` carries zero blast radius since it is never registered.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`
- `../002-cursor-hooks-live-wiring/plan.md` (predecessor, same methodology)
- `../../004-cursor-hook-adapter-layer/decision-record.md` (ADR-001)
