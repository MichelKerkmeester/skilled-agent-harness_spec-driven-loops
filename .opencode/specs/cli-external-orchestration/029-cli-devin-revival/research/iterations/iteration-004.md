# Iteration 4: Verified Alias-Retirement Boundaries

## Focus

Q2: Verify whether the confirmed Devin payloads justify tightening the field fallbacks in `task-dispatch-guard.cjs`, `spec-gate-enforce.mjs`, and `mcp-route-guard.cjs` without reducing effective guard coverage or changing the adapters' fail-open contract.

## Actions Taken

1. Read the externalized state, reducer-owned strategy, and iterations 2-3 before reopening Q2.
2. Rechecked the current Devin live-test record and phases 008, 011, and 012 for observed payload fields, explicit limitations, and tested workspace-root behavior.
3. Inspected the current Devin adapters, the shared dispatch/spec-gate cores, and the reorganized Cursor lifecycle evidence to trace alias selection through the final guard decisions.
4. Searched the current test corpus for adapter-level coverage of `subagentType`, `agent_type`, `agentType`, `filePath`, and `path` rather than treating source presence as behavioral evidence.

## Findings

### F1. Tighten resolver semantics now; do not tighten the accepted Devin vocabulary yet

The confirmed payloads support a canonical-first ordered resolver that selects the first nonblank string, but they still do not support canonical-only parsing. Both alias-bearing Devin adapters currently use truthiness chains: task dispatch selects among four identity spellings, while spec-gate selects among three path spellings. A truthy object or whitespace string in a higher-priority field can suppress a later valid string. Replacing that selection rule is additive hardening: malformed JSON and internal failures can still approve, while valid compatibility data is no longer shadowed. Conflicting valid strings should resolve deterministically with confirmed snake-case first. [SOURCE: `.opencode/skills/system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs:44-67`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs:49-53,59-87`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md:55-61`]

### F2. The task-dispatch aliases have three distinct evidence tiers, so they should not be retired as one set

`subagent_type` is the strongest canonical candidate: Cursor captured it in a real `Task` payload, and the Claude adapter and its process tests use it. `subagentType` has cross-runtime compatibility provenance in the Claude adapter but no live Devin confirmation. `agent_type` and `agentType` are Devin-only hedges in the inspected adapter and are not exercised by the current task-dispatch process-test corpus. This ranks the aliases for future retirement, but does not yet make deletion safe because Devin `run_subagent` remains explicitly unobserved. The next implementation should first add table-driven resolver tests, then capture a real Devin `run_subagent` payload; only that capture can establish which identity spelling the runtime actually emits. [SOURCE: `.opencode/skills/system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs:52-67`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs:53-65`] [SOURCE: `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/003-cursor-hooks-claude-parity/implementation-summary.md:54-68`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/implementation-summary.md:96-103`]

### F3. Losing a task identity alias is conditionally, not universally, a guard bypass

The shared dispatch core resolves `target_agent=@...` or `Agent: @...` from the prompt before consulting `subagentType`. Therefore a removed alias would not erase identity for command-owned deep-loop prompts that carry those route markers. It can still make direct dispatches without route markers unresolvable, causing the fail-open guard to no-op. This narrows the risk from iteration 2: alias deletion threatens a specific caller class rather than every dispatch, and a caller audit plus a real payload capture is required before retirement. Type-aware resolution remains useful independently because it preserves a valid fallback for that caller class. [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs:140-163`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs:61-67`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/011-hook-truth-and-runtime-readmes/implementation-summary.md:106-111`]

### F4. Spec-gate path aliases can be staged separately because missing path context is enforcement-conservative

`file_path` is confirmed by the live Devin `edit` capture. `filePath` is an explicit compatibility spelling shared by all inspected runtime adapters, while generic `path` is broader and can ambiguously describe something other than the mutation target. Under an open gate, a null path does not permit an edit: `evaluateMutation()` allows only a positively recognized exempt target and otherwise keeps `edit` deny-capable. Consequently, retiring generic `path` cannot create an ordinary-edit allow bypass, but it can false-deny or advise a legacy/synthetic exempt edit. The safe order is resolver tests first, caller/fixture audit second, `path` retirement third; keep `filePath` until measured evidence shows it unused. [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md:55-61`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs:49-53,80-87`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs:906-928,943-970`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs:50-53`]

### F5. `mcp-route-guard.cjs` has no Q2 field fallback, and its project-root chain is a verified invariant

The Devin MCP adapter reads only canonical `tool_name`. Its `cwd` -> `DEVIN_PROJECT_DIR` -> `process.cwd()` chain is workspace-root resolution, not an MCP argument alias, and phase 012 deliberately standardized whitespace handling across ten adapters. Q2 therefore requires no MCP adapter field change. Whether the guard has applicable live traffic remains Q4 and must not be used as a reason to alter this resolution invariant. [SOURCE: `.opencode/skills/mcp-code-mode/runtime/hooks/devin/mcp-route-guard.cjs:41-60`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/012-devin-hook-hardening/implementation-summary.md:44-67,72-88`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/implementation-summary.md:44-46,101-103`]

### Recommended implementation gate

1. Add a shared or adapter-local ordered `firstNonblankString` resolver with canonical-first conflict tests.
2. Add exact process fixtures for the observed Devin `edit.file_path` payload and malformed/whitespace canonical fields followed by valid aliases.
3. Add task-dispatch fixtures for all four current spellings, prompt-marker recovery, and direct calls without markers.
4. Capture a real Devin `run_subagent` payload before deleting any task identity alias.
5. Audit synthetic callers before retiring generic spec-gate `path`; retain `filePath` until usage is measured.
6. Make no Q2 field-name change to `mcp-route-guard.cjs`.

### Ruled-Out Directions

- Immediate canonical-only task parsing is ruled out because Devin `run_subagent` remains unobserved and direct marker-free callers can depend on identity fields.
- Treating every task alias as equally justified is ruled out: the current evidence distinguishes live canonical, inherited compatibility, and Devin-only hedge tiers.
- Removing project-directory fallbacks as payload cleanup is ruled out because phase 012 verifies them as a cross-adapter workspace-root invariant.

## Questions Answered

- **Q2: Answered and verified.** Confirmed payloads justify canonical-first, first-nonblank-string resolution now, but not immediate vocabulary reduction. Stage generic spec-gate `path` for retirement after fixture/caller audits; retain `filePath`; retain all task identity aliases until a real Devin `run_subagent` capture and direct-caller audit; make no Q2 field change to the MCP adapter.

## Questions Remaining

- Q3: How to force and distinguish real Devin `PermissionRequest` and `PostCompaction` events in a follow-up live test.
- Q4: Current dormancy/applicability of both MCP route guards after per-runtime MCP registration changes.
- Q5: Devin/Cursor CLI features shipped since the original packet research.
- Q6: Safe deduplication boundaries across Cursor and Devin adapters.

## Next Focus

Q4: Classify the Devin and Cursor MCP route guards as active, conditionally dormant, or structurally obsolete using current per-runtime MCP registration and hook-wiring evidence.
