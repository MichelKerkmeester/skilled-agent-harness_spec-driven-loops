# Iteration 3 — Seven guard-core reusability audit

## Focus

Audit the seven guard surfaces named by the Codex hook contract. For each, identify the runtime-neutral core, map the Claude and OpenCode transports, select the Devin lifecycle event and stdin shape, and decide whether Devin needs only a transport shim or a semantic redesign.

## Actions Taken

- Read the Codex parity contract and its source-file inventory at `.opencode/skills/cli-external-orchestration/cli-codex/references/hook-contract.md:81-102` and `:221-235`.
- Read the live Claude registrations in `.claude/settings.json:14-180` and the OpenCode plugin catalog/loader contract in `.opencode/plugins/README.md:11-23`, `:81-94`, and `:122-140`.
- Traced each neutral core's exported decision function and each existing Claude/OpenCode adapter, including the Codex sibling where it exposes an already-proven payload normalization pattern.
- Reused the pinned Devin contract from `001-devin-contract-pin/implementation-summary.md:56-59` and the event-specific schemas recorded in iteration 1 at `research/iterations/iteration-001.md:98-109`; no implementation or runtime configuration was changed.

## Findings

### Seven-row Devin adapter table

| Guard | Shared runtime-neutral core | Existing Claude wrapper | Existing OpenCode wrapper | Devin adapter shape, stdin, and reuse verdict |
|---|---|---|---|---|
| **spec-gate enforce/classify** | `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs:798,918` (`classifyIntent`, `evaluateMutation`) | `runtime/hooks/claude/spec-gate-classify.mjs:26-53` on `UserPromptSubmit`; `spec-gate-enforce.mjs:31-93` on `PreToolUse` | `.opencode/plugins/mk-spec-gate.js:160-256` maps system transform, `tool.execute.before`, and lifecycle events | **Primary: `UserPromptSubmit` + `PreToolUse`**, match `^(exec|edit)$`. stdin is the common Devin envelope (`hook_event_name`, `session_id`, optional `prompt_id`, `tool_name`, `tool_input`, `cwd` where supplied) plus `prompt` for classify. Map Devin `exec` to the core's `bash` class and extract edit paths from `tool_input`. Reuse the core directly; add a stdin parser, `DEVIN_PROJECT_DIR` fallback, tool/path aliases, and Devin `additionalContext`/deny output. `SessionStart` may call the core's stale-state sweep, but is not required for the decision path. **Needs thin adaptation.** |
| **dispatch-preflight-lint** | `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs:28,105` (`parseHardRules`, `evaluate`); dispatch-shape registry is shared from `dispatch-audit.mjs:31-34` | `cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs:34-83`, `PreToolUse(Bash)` | **No dedicated OpenCode preflight plugin exists.** `mk-cli-dispatch-audit.js:45-76` is after-only; it shares the shape registry but does not run the preflight policy | **`PreToolUse`**, matcher `^exec$`. stdin adds `tool_input.command`; resolve the target skill under `DEVIN_PROJECT_DIR`, then pass the command and parsed rules to the core. Emit Devin's PreToolUse block/deny result or `additionalContext`, never Claude's `hookSpecificOutput.permissionDecision` envelope unchanged. The rule parser/evaluator is directly reusable. **Needs a thin adapter, and exposes an OpenCode coverage gap rather than a reusable OpenCode wrapper.** |
| **post-edit-quality** | `.opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs:156,320,426` (`resolveDispatch`, `runChecks`, exports) | `sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs:67-125`, `PostToolUse(Write|Edit)` | `.opencode/plugins/mk-post-edit-quality.js:117-189`, correlates `tool.execute.before` and `tool.execute.after` by `callID` | **`PostToolUse`**, matcher `^edit$` unless the live Devin tool list adds another write tool. stdin has `tool_input` with the edited path and `tool_response:{success,output,error}`. Unlike OpenCode, no before/after correlation is needed when Devin returns the original input. Reuse the router/checker execution directly; add path extraction, relative-path resolution against `DEVIN_PROJECT_DIR`, deadline handling, and PostToolUse `additionalContext` output because Devin has no OpenCode system transform. **Needs thin adaptation.** |
| **code-graph-freshness** | `.opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs:551,642,743` (`sweepStaleFreshnessState`, `evaluateEdit`, `drainPending`) | `system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs:61-95`, `PostToolUse(Write|Edit)` | `.opencode/plugins/mk-code-graph-freshness.js:111-233`, adds correlation, real quiet-period timers, lifecycle sweeps, and detached scan ownership | **Primary: `PostToolUse`** on `^edit$`; optional `SessionStart` for stale-state sweep/drain. stdin has the common envelope, `tool_input` path, and Devin `tool_response`. Reuse `evaluateEdit`, logging, lock, and detached scan dispatch directly. The Devin adapter must normalize the path, use `DEVIN_PROJECT_DIR`, and accept that `SessionEnd` cannot reproduce OpenCode's server/global disposal timer cleanup. **Needs thin adaptation; OpenCode's in-memory trailing-edge timer is not portable.** |
| **dispatch-audit** | `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib/dispatch-audit.mjs:31,238` (`DISPATCH_SHAPES`, `recordDispatch`) | `cli-opencode/scripts/hooks/dispatch-audit-posttooluse.mjs:27-66`, `PostToolUse(Bash)` | `.opencode/plugins/mk-cli-dispatch-audit.js:45-76`, `tool.execute.after` | **`PostToolUse`**, matcher `^exec$`. stdin has `tool_input.command` and `tool_response:{success,output,error}`; feed `tool_response.output` as `outputText`, with unavailable duration/exit metadata left null. Reuse matching, redaction, formatting, rotation, and append directly. Add only Devin cwd/env, session/call identity, and response normalization; emit no stdout. **Needs thin adaptation.** |
| **completion-evidence-sentinel** | `.opencode/skills/system-spec-kit/mcp-server/lib/hooks/completion-evidence-sentinel.cjs:112,478,537` (`detectCompletionClaim`, `evaluateCompletionEvidence`, exports) | `system-spec-kit/mcp-server/hooks/claude/completion-evidence-stop.cjs:62-115`, `Stop` | `.opencode/plugins/mk-completion-sentinel.js:114-155`, `session.idle` plus `session.created` sweep; resolves assistant text through the OpenCode client | **`Stop`**, empty matcher. stdin supplies the common envelope plus `stop_hook_active`; Devin's documented Stop payload does not provide Claude's `last_assistant_message`, and it does not reproduce OpenCode's client message lookup. The core can be reused only after a Devin adapter obtains the claim text and active spec folder from durable session state or another hook. Keep the sentinel advisory-only and map any output to Devin's Stop reason/context form without blocking. **Needs adaptation with a semantic input gap; not a 1:1 port.** |
| **mcp-route-guard** | `.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs:220,273` (`evaluateNativeMcpCall`, exports) | `mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs:27-58`, `PreToolUse(mcp__claude_ai_.*)` | `.opencode/plugins/mk-mcp-route-guard.js:66-89`, `tool.execute.before` | **`PreToolUse`**, matcher `^mcp__.*$`. stdin has `tool_name`, `tool_input`, session identity, and project context; Devin's public native MCP names use the same `mcp__server__tool` family shape. Reuse the parser, manifest lookup, and warn-only policy directly. Add only `DEVIN_PROJECT_DIR` resolution and Devin `additionalContext` output. **Needs thin adaptation; no policy-core change.** |

### Reuse boundary

The seven neutral cores are genuinely reusable as policy modules. The existing Codex adapters provide the closest precedent: they read JSON stdin, normalize snake-case fields, parse patch paths where needed, call the same core, and fail open (`hook-contract.md:83-102`). Devin's adapter layer should follow that boundary rather than fork policy logic.

The exception is completion evidence. Its policy function is reusable, but its required evidence inputs are not present in Devin's `Stop` payload. That row needs a state-lookup or evidence-capture decision before implementation can claim parity.

### Native Claude import is a compatibility baseline, not a substitute

`read_config_from.claude:true` can be useful for the shell-only `SessionStart`/`SessionEnd` commands identified in iteration 1 (`iteration-001.md:31-34`, `:37`). It cannot safely replace the seven guard adapters:

- Claude matchers (`Bash`, `Write`, `Edit`, `Task`, `mcp__claude_ai_.*`) do not select Devin's `exec`, `edit`, `run_subagent`, or generic `mcp__.*` calls.
- Imported handlers still receive Devin's event payload and environment, while several current wrappers read Claude-specific assumptions such as `CLAUDE_PROJECT_DIR`, `tool_input.file_path`, `tool_response` layout, or `last_assistant_message`.
- Claude's `PreToolUse`/Stop output envelopes are not Devin's top-level decision/reason contract. Copying the current stdout unchanged risks silent non-enforcement or rejected output.
- OpenCode plugin factories, `tool.execute.*`, `session.idle`, system transforms, and disposal hooks are not imported from `.opencode/plugins/`.
- Claude `PreCompact` remains unmatched: Devin's `PostCompaction` runs after compaction and supplies `summary`, so import cannot preserve the before-compaction timing.

Therefore the recommended ADR boundary is: allow native Claude import for compatibility testing and shell-only lifecycle commands, but make explicit Devin adapters authoritative for all seven guard cores and for every Devin-specific matcher/output decision.

## Questions Answered

- The seven guard cores and their load-bearing entrypoints are identified with file:line evidence.
- The Claude and OpenCode transport boundaries are mapped for every row; dispatch preflight has no dedicated OpenCode wrapper.
- Devin event selection is concrete: `UserPromptSubmit`/`PreToolUse` for spec gate, `PreToolUse` for dispatch preflight and MCP routing, `PostToolUse` for post-edit quality, freshness, and dispatch audit, and `Stop` for completion evidence.
- Six rows can call the shared core directly after a thin stdin/env/output shim. Completion evidence has a semantic input gap, not a policy-core gap.
- Native Claude import can cover compatible shell-only lifecycle commands, but it cannot substitute for the seven guard adapters as a set.

## Questions Remaining

- Live-test Devin's imported Claude settings with `/hooks`, especially whether unsupported `PreCompact` and `async` fields are ignored, warned, or rejected.
- Smoke-test Devin stdout/exit parsing for deny-capable `PreToolUse`, advisory `PostToolUse`, `UserPromptSubmit`, and `Stop` outputs.
- Confirm the live Devin tool vocabulary for file writes (`edit` versus any additional write tool) and whether `tool_use_id`/`cwd` are present on every relevant event.
- Decide how the completion sentinel obtains the final assistant claim and active spec folder under Devin `Stop`.
- Fold this core table and the confirmed `run_subagent` mapping into the complete per-hook/per-plugin matrix for ADR-001.

## Next Focus

Iteration 4 — consolidate the seven-row core audit with the full Claude hook and OpenCode plugin verdict matrix, including the `run_subagent` row and native-import baseline, then identify the smallest explicit Devin adapter set for ADR-001.
