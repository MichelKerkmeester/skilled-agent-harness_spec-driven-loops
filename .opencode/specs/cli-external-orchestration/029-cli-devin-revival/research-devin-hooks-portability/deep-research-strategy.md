---
title: Deep Research Strategy - devin-hooks-claude-opencode-plugin-portability
description: Iterative research session focused on porting this repo's Claude Code hooks and OpenCode plugins into Devin CLI hook contract; informs phase 004-devin-hook-adapter-layer ADR-001.
trigger_phrases: [devin hooks portability, claude hooks devin port, opencode plugins devin, hook-adapter-layer, ADR-001]
importance_tier: important
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW
Persistent brain for the deep-research session; tracks focus decisions and outcomes across iterations.

## 2. TOPIC
devin-hooks-claude-opencode-plugin-portability: Investigate every Claude Code hook and every OpenCode plugin currently defined in this repo (.claude settings hooks, .opencode plugin registrations, the 7 repo guard hooks referenced by cli-codex hook-contract.md: spec-gate-enforce/classify, dispatch-preflight-lint, post-edit-quality, code-graph-freshness, dispatch-audit, completion-evidence-sentinel, mcp-route-guard) against Devin CLI real current hook contract (PreToolUse/PostToolUse/PermissionRequest/UserPromptSubmit/Stop/PostCompaction/SessionStart/SessionEnd via .devin/hooks.v1.json, confirmed in 001-devin-contract-pin/implementation-summary.md). For each hook or plugin determine: portable 1:1, needs adaptation, or cannot port and why. Also evaluate whether Devin native read_config_from.claude:true import could substitute for some ports instead of hand-built adapters. Produce a concrete per-hook per-plugin port verdict table with rationale, to directly inform phase 004-devin-hook-adapter-layer ADR-001.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1. Enumerate every Claude Code hook registered in this repo's .claude settings (settings.json hooks.* keys, plus any plugin-bundled hooks), with event name + matcher + cwd + handler command for each.
- [ ] Q2. Enumerate every OpenCode plugin registered under .opencode/ (plugin manifests, hook registrations, runtime-neutral cores referenced by cli-codex hook-contract.md: spec-gate-enforce/classify, dispatch-preflight-lint, post-edit-quality, code-graph-freshness, dispatch-audit, completion-evidence-sentinel, mcp-route-guard).
- [ ] Q3. Enumerate Devin CLI's 8 lifecycle hooks (PreToolUse, PostToolUse, PermissionRequest, UserPromptSubmit, Stop, PostCompaction, SessionStart, SessionEnd), the JSON schema each receives on stdin, and the .devin/hooks.v1.json entry shape (type, matcher, command|prompt, timeout).
- [ ] Q4. Per hook + per plugin: classify portable 1:1 / needs adaptation / cannot port, with rationale grounded in matching shapes, missing payload fields, cwd/env differences, and Devin's missing equivalent events.
- [ ] Q5. Evaluate whether Devin native read_config_from.claude:true import could substitute for hand-built adapters in part or in full (which hooks it covers vs misses, and why).
- [ ] Q6. Produce a per-hook per-plugin port verdict table ready to be cited as ADR-001 evidence by phase 004-devin-hook-adapter-layer/plan.md.

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
- Not designing the actual adapter implementation (that's the phase 004 build step).
- Not evaluating Devin IDE-runtime hooks surface (the deleted D5 surface, explicitly out-of-scope per parent spec section 3).
- Not evaluating Devin-as-MCP-host surface (also explicitly out-of-scope per parent spec section 3).
- Not re-pinning the Devin CLI contract facts - phase 001 implementation-summary.md is the source of truth and is cited inline.

## 5. STOP CONDITIONS
- All 6 key questions answered with reproducible evidence (file:line citations + Devin docs citations + per-row verdict + rationale).
- Or --max-iterations=10 reached.
- Or all-research-failed state requiring operator direction.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
All 6 answered in research (iteration 009 evidence pack, confirmed by iteration 010 convergence pass) — see `research/research.md` for the full compiled answer with citations. Machine-owned `resolvedQuestions` in `findings-registry.json` was not updated by the reducer because the automated synthesis step crashed after iteration 10 before running its promotion pass; `research.md` §11 documents this gap explicitly. The underlying answers are not in question — only the registry bookkeeping field is stale.
- Q1 (Claude hook inventory): Answered — 7 hook keys, 19 handlers enumerated (C-01–C-20).
- Q2 (OpenCode plugin inventory): Answered — 15 plugin entrypoints + 7 guard cores enumerated (P-01–P-15, G-01–G-07).
- Q3 (Devin 8-event contract): Answered — pinned from phase 001, restated with schema detail.
- Q4 (per-hook/plugin port verdicts): Answered — full C/P/G verdict tables with rationale.
- Q5 (native import substitution): Answered — conditional/partial only, never a full substitute.
- Q6 (ADR-001-ready verdict table): Answered — delivered as `research.md` §3-§10 plus a concrete `.devin/hooks.v1.json` skeleton.

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Smoke-test command stdout/exit handling for the imported Claude shell wrappers and the seven new Devin adapters; this iteration intentionally did not implement or run them. (iteration 1)
- Verify the exact behavior of Devin's Claude-settings import against this repository with `/hooks`, especially whether unsupported `PreCompact` entries are ignored or surfaced as warnings. (iteration 1)
- Confirm the exact Devin tool name and payload for subagent dispatch before deciding whether the `Task` guard can be adapted to `PreToolUse`. (iteration 1)
- Fold this confirmed subagent row into the complete per-hook/per-plugin matrix and ADR-001 evidence table in a later synthesis pass. (iteration 2)
- Run Devin `/hooks` against this repository with a working session and determine whether the imported `PreCompact` entry is ignored, warned, or rejected, and whether `async` is ignored or surfaced. (iteration 2)
- Smoke-test stdout/exit handling for the imported shell wrappers and the future Devin adapters, especially top-level `decision` versus Claude `hookSpecificOutput.permissionDecision`. (iteration 2)
- Confirm `run_subagent` required fields and the runtime representation of `resume` with one real `PreToolUse` capture; the installed binary schema names the fields but does not expose all validation constraints through `strings`. (iteration 2)
- Smoke-test Devin stdout/exit parsing for deny-capable `PreToolUse`, advisory `PostToolUse`, `UserPromptSubmit`, and `Stop` outputs. (iteration 3)
- Decide how the completion sentinel obtains the final assistant claim and active spec folder under Devin `Stop`. (iteration 3)
- Live-test Devin's imported Claude settings with `/hooks`, especially whether unsupported `PreCompact` and `async` fields are ignored, warned, or rejected. (iteration 3)
- Fold this core table and the confirmed `run_subagent` mapping into the complete per-hook/per-plugin matrix for ADR-001. (iteration 3)
- Confirm the live Devin tool vocabulary for file writes (`edit` versus any additional write tool) and whether `tool_use_id`/`cwd` are present on every relevant event. (iteration 3)
- Decide how the completion sentinel obtains `last_assistant_message` and the active spec folder under Devin `Stop`. (iteration 4)
- Fold the confirmed live-import result into `004-devin-hook-adapter-layer/decision-record.md` before implementation claims parity. (iteration 4)
- Run Devin `/hooks` in a real session and record whether `PreCompact` is ignored, warned, or rejected, and whether `async` is ignored or surfaced. (iteration 4)
- Smoke-test stdout and exit handling for imported `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `PostCompaction`, `SessionStart`, and `SessionEnd` commands, especially Claude nested `permissionDecision` output. (iteration 4)
- Capture one real Devin `PreToolUse` event to confirm `run_subagent`, `edit`, tool identity, `cwd`, and the exact edit input fields. (iteration 4)
- Capture one live Devin `PreToolUse(run_subagent)` payload to confirm required fields and the runtime representation of `resume`. (iteration 5)
- Smoke-test stdout/exit parsing for imported shell wrappers and representative explicit adapters, especially top-level Devin `decision` versus Claude nested `hookSpecificOutput.permissionDecision`. (iteration 5)
- Confirm the live Devin file-write vocabulary and whether `tool_use_id`/`cwd` are present on every relevant post-tool event before implementation freezes matchers. (iteration 5)
- Run Devin `/hooks` against this repository with an authenticated working session to determine whether the imported `PreCompact` entry is ignored, warned on, or rejected, and how `async` is handled. (iteration 5)
- Confirm the actual process cwd used by Devin command hooks; the docs guarantee `DEVIN_PROJECT_DIR`, but not the inherited cwd. (iteration 6)
- Determine whether the implementation phase can provide an explicit Devin-owned cleanup PID, or whether SessionEnd cleanup must remain safe no-op/orphan-only. (iteration 6)
- Smoke-test plain stdout, stderr, exit `2`, and top-level JSON decisions for imported commands and explicit Devin wrappers. (iteration 6)
- Run authenticated Devin `/hooks` in this repository and record whether imported `PreCompact` and `async` entries are ignored, warned on, or rejected. (iteration 6)
- Confirm the exact Devin process cwd and representative stdout/exit handling for the new adapter before implementation freezes the wrapper contract. (iteration 7)
- Confirm whether Devin fires a `SessionStart` or `UserPromptSubmit` immediately after compaction; the adapter must not rely on a Claude-only follow-up event without evidence. (iteration 7)
- Smoke-test whether a Devin `PostCompaction` command's `hookSpecificOutput.additionalContext` is injected when tagged with `PostCompaction`, including the null-summary case. (iteration 7)
- Run authenticated Devin `/hooks` in this repository and record whether imported `PreCompact` is ignored, warned on, or rejected. (iteration 7)
- Smoke-test the `UserPromptSubmit`/`PostCompaction` context envelopes and verify whether the CLI alternatives can remain warm-only without changing the fail-open behavior. (iteration 8)
- Run an authenticated Devin `/hooks` inspection to verify the imported Claude-settings behavior and the exact handling of unsupported `PreCompact`/`async` entries. (iteration 8)
- Confirm the live Devin `mcpServers` registration shape for the repository's daemon launchers, including relative working directory and environment propagation. (iteration 8)
- Fold this five-row alternative table into the complete per-hook/per-plugin matrix and ADR-001 synthesis. (iteration 8)
- Confirm the actual process cwd used by Devin command hooks. (iteration 9)
- Smoke-test `PostCompaction` context injection, including the null-summary case, and verify whether a follow-up `SessionStart` or `UserPromptSubmit` fires. (iteration 9)
- Confirm Devin's live file-write vocabulary and whether `tool_use_id`/`cwd` exist on relevant post-tool events. (iteration 9)
- Have the reducer promote iteration-5, iteration-8, and iteration-9 findings and reconcile the six key-question statuses before ADR-001 is treated as registry-complete. (iteration 9)
- Capture one live `PreToolUse(run_subagent)` event to confirm required fields and `resume` representation. (iteration 9)
- Run authenticated Devin `/hooks` in this repository and record whether imported `PreCompact` is ignored, warned on, or rejected, and how `async` is handled. (iteration 9)
- Determine the safe Devin-owned source for completion claims and active spec-folder state at `Stop`. (iteration 9)
- Smoke-test plain stdout, stderr, exit `2`, and top-level JSON decisions for imported commands and explicit Devin adapters. (iteration 9)
- Determine the safe Devin-owned source for the final assistant claim and active spec folder at `Stop`. (iteration 10)
- Promote the iteration-005, iteration-008, and iteration-009 evidence into the registry and reconcile the six key-question statuses before calling ADR-001 registry-complete. (iteration 10)
- Smoke-test plain stdout, stderr, exit `2`, and top-level JSON decisions for imported commands and explicit adapters. (iteration 10)
- Confirm the live `mcpServers` registration shape for repository daemon launchers, including relative working directory and environment propagation. (iteration 10)
- Confirm Devin's file-write vocabulary, `tool_use_id`/`cwd` presence, and the actual process cwd for command hooks. (iteration 10)
- Smoke-test `PostCompaction` context injection, including a null summary, and verify whether a follow-up `SessionStart` or `UserPromptSubmit` occurs. (iteration 10)
- Update phase 004 ADR-001 with the consolidated evidence, then implement the adapters and run the phase checklist. This research pass claims neither implementation nor runtime parity. (iteration 10)
- Capture one live `PreToolUse(run_subagent)` event to confirm required fields and the runtime representation of `resume`. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Capture one live `PreToolUse(run_subagent)` event to confirm required fields and the runtime representation of `resume`.

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
### Prior Research
Phase 001 (001-devin-contract-pin/implementation-summary.md) already verified the live Devin CLI v3000.2.17, hooks contract (8 lifecycle events), config format, 4 permission modes, model roster, subagent mechanism, cloud handoff. Cite this implementation-summary.md as the Devin-side fact base; do not re-fetch Devin docs unless a new contract surface is needed.
### Spec Folder Context
- Parent packet: .opencode/specs/cli-external-orchestration/029-cli-devin-revival (phase parent, 7 phases).
- Phase 001 complete; phase 004 (devin-hook-adapter-layer) is the consuming phase; ADR-001 lives there.
- Existing research packet at this artifact_dir will be consulted on resume.

### Bounded Context Snapshot
- Source pointers:
  - .claude/settings.json or equivalent .claude config (Claude Code hook registrations)
  - .opencode/opencode.json + .opencode/plugin/** (OpenCode plugin registrations)
  - cli-codex SKILL.md or its hook-contract.md file (runtime-neutral hook cores referenced by the 7 guard hooks)
  - 001-devin-contract-pin/implementation-summary.md (Devin CLI contract source of truth)
- Reuse candidates: cli-codex hook-adapter-layer precedent (existing thin-adapter pattern); parent spec section 3 "decide native import vs. custom adapters" note.
- Integration points: .devin/hooks.v1.json (the new config file to be written under phase 004), existing .claude/ settings (likely no change).

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (default)
- Stop policy: max-iterations (forced-depth; convergence treated as telemetry only)
- Per-iteration budget: 12 tool calls, 10 min, 1500s dispatch timeout per iteration
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches live: new, resume, restart
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Question injection surface: .opencode/specs/cli-external-orchestration/029-cli-devin-revival/research/inbox.jsonl
- Current generation: 1
- Started: 2026-07-24T04:06:41.346Z
