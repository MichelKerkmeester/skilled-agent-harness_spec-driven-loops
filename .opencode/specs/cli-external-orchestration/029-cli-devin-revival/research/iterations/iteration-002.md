# Iteration 2: Devin Payload Fallback Hardening

## Focus

Q2: Determine whether the confirmed live Devin payloads justify tightening field-name fallbacks in `task-dispatch-guard.cjs`, `spec-gate-enforce.mjs`, and `mcp-route-guard.cjs` without weakening fail-open behavior or silently bypassing a guard.

## Actions Taken

1. Read the current research state, strategy, and iteration-001 coverage baseline.
2. Reused the packet's corrected-schema live evidence rather than re-deriving hook delivery: observed payloads use `tool_name`, `tool_input.command`, and `tool_input.file_path`; `run_subagent` remains unobserved.
3. Inspected the three current Devin adapters and classified each apparent fallback as a confirmed field, an unconfirmed compatibility hedge, or an operational project-directory fallback.
4. Compared Devin spec-gate path handling with the current Cursor sibling to test whether the aliases are Devin-specific residue or an intentional cross-runtime adapter convention.

## Findings

### F1. The current adapters already use the confirmed canonical Devin envelope; the broad fallback concern is narrower than the research premise

All three adapters consume `payload.tool_name` directly, and the two adapters that inspect tool arguments consume `payload.tool_input` directly. None accepts `toolName`, `toolInput`, `input`, `arguments`, or `args`. The live capture confirms the existing snake-case envelope and the observed `exec`/`edit` argument names, so there is no envelope-level fallback to remove. Tightening should not be framed as a three-adapter rewrite. [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md:55-61`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs:45-64`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs:59-80`] [SOURCE: `.opencode/skills/mcp-code-mode/runtime/hooks/devin/mcp-route-guard.cjs:41-57`]

### F2. `task-dispatch-guard.cjs` must retain its subagent-type aliases until a real `run_subagent` payload is captured

The adapter maps `subagent_type`, `subagentType`, `agent_type`, and `agentType` into the shared core. None of those alternatives was validated by the live session because no `run_subagent` event occurred. Removing aliases based on observed `exec`, `edit`, or `read` payloads would be an invalid extrapolation: if Devin emits any removed spelling, the adapter would still exit successfully but pass an absent identity to the core, creating a silent fail-open bypass. The correct tightening gate is a discriminating live `run_subagent` capture, followed by a process fixture using that exact payload. Until then, these aliases are compatibility hedges, not stale code. [SOURCE: `.opencode/skills/system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs:52-67`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/implementation-summary.md:101`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md:96`]

### F3. `spec-gate-enforce.mjs` has one confirmed path field and two unconfirmed aliases, but immediate removal has no demonstrated safety benefit

For live `edit`, `tool_input.file_path` is confirmed. `filePath` and generic `path` are unconfirmed compatibility aliases. The generic `path` alias has the greatest ambiguity risk, but the evidence does not show an actual conflicting Devin payload, and the same three-name helper exists in Cursor's independently live-verified adapter. Removing either alias can make an alternate-version or synthetic payload lose target-path context while still returning exit 0. A safe staged refinement is therefore: preserve all three today; add exact real-payload fixtures and alias-selection telemetry in a future implementation; remove generic `path` first only if fixture/caller audit shows zero use; consider `filePath` separately as an explicit compatibility spelling. [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md:58-61`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs:49-53,67-87`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs:50-53,68-88`]

### F4. `mcp-route-guard.cjs` has no tool-input field-name fallback to tighten

The MCP adapter forwards only canonical `payload.tool_name`; it does not read `tool_input` at all. Its remaining fallback resolves project directory from a nonblank `payload.cwd`, then `DEVIN_PROJECT_DIR`, then `process.cwd()`. That is an execution-context fallback, not uncertainty about Devin's MCP payload schema. Phase 012 deliberately standardized this resolution across adapters and tests missing/whitespace cwd. Removing it would risk reading the Code Mode manifest from the wrong or absent root and would not improve payload strictness. MCP dormancy/applicability belongs to Q4, not Q2. [SOURCE: `.opencode/skills/mcp-code-mode/runtime/hooks/devin/mcp-route-guard.cjs:41-60`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/012-devin-hook-hardening/implementation-summary.md:47-55,75-85`]

### F5. Fail-open parsing and field strictness are separate controls

Malformed JSON, missing identity, unmapped tools, and internal errors must continue to approve. Canonicalizing known payload names does not require making parsing fail closed. Conversely, deleting an unconfirmed alias can weaken effective enforcement while preserving nominal fail-open behavior, because the adapter exits cleanly with less information. Future hardening should measure which alias was selected and test guard outcomes, not equate fewer accepted spellings with greater safety. [SOURCE: `.opencode/skills/system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs:44-54,102`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs:59-71,132`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/implementation-summary.md:63-65,86-91`]

### Ruled-Out Directions

- Tightening `run_subagent` identity fields from the observed `exec`/`edit` samples is ruled out because those are different tools with different argument contracts.
- Removing the `cwd`/environment/process fallback as payload cleanup is ruled out because it is a tested project-root resolution invariant, not a field-name alias.
- Treating all three named adapters as equally fallback-heavy is ruled out: the MCP adapter has no argument aliases, and all three already use canonical snake-case envelope fields.

## Questions Answered

- **Q2: Answered.** The confirmed payloads validate the existing canonical envelope and `file_path`, but do not justify immediate fallback removal. Keep the unobserved `run_subagent` aliases; keep spec-gate path aliases pending fixture/caller audit, with generic `path` the first candidate for staged retirement; retain project-directory fallbacks; no field-name tightening exists for the MCP adapter.

## Questions Remaining

- Q3: How to force and distinguish real Devin `PermissionRequest` and `PostCompaction` events in a follow-up live test.
- Q4: Current dormancy/applicability of both MCP route guards after per-runtime MCP registration changes.
- Q5: Devin/Cursor CLI features shipped since the original packet research.
- Q6: Safe deduplication boundaries across Cursor and Devin adapters.

## Next Focus

Q4: Establish whether each runtime can currently register external MCP servers, whether the corresponding hook event is registered and live-delivering, and whether Code Mode's manifest can overlap those native tools. Classify each MCP route guard as active, conditionally dormant, or structurally obsolete before considering adapter changes.
