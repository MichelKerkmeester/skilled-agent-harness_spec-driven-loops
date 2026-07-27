# Iteration 5: Fail-Open Boundary Correction

## Focus

Q2: Determine whether confirmed Devin payloads justify tightening field-name fallbacks in `task-dispatch-guard.cjs`, `spec-gate-enforce.mjs`, and `mcp-route-guard.cjs` without reducing fail-open safety.

## Actions Taken

1. Read the externalized strategy, state log, iteration 4, and the current live-hook evidence before reopening Q2.
2. Read the required Devin phase 008, 011, and 012 summaries and the current Cursor phase-parent children plus phase 010 summary, using the reorganized `009-cursor-hooks-lifecycle/` structure.
3. Inspected the current three Devin adapters and traced `spec-gate-enforce.mjs` path resolution through `isExemptTargetPath()` and `evaluateMutation()`.
4. Checked the current Devin process tests and Cursor live Task payload evidence for coverage of accepted aliases.

## Findings

### F1. Type-aware canonical-first resolution is safe hardening, but vocabulary reduction is not yet justified

Both alias-bearing adapters use truthiness chains before validating type. In task dispatch, a truthy malformed `subagent_type` can shadow a later valid alias. In spec-gate enforcement, a truthy object or whitespace-only canonical path can shadow a later valid alias and resolve to null or blank. Selecting the first nonblank string in deterministic order would recover valid compatibility data while preserving malformed-JSON and internal-error fail-open behavior. Confirmed snake-case fields should remain first: Cursor captured `subagent_type` live, and Devin captured `file_path` live. [SOURCE: `.opencode/skills/system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs:44-67`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs:49-53,59-87`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md:55-61`] [SOURCE: `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/003-cursor-hooks-claude-parity/implementation-summary.md:54-68`]

### F2. The prior claim that missing spec-gate paths remain deny-capable is false in the current core

Iteration 4 stated that losing a path alias would remain enforcement-conservative. The current core proves the opposite: `isExemptTargetPath()` returns `true` for a missing or blank path, and `evaluateMutation()` returns `allow` for an open-gate non-bash mutation whose path is exempt. Therefore, removing `path` or `filePath` can create an enforcement bypass for any alias-only caller: the adapter resolves no path, and the core allows the edit before reaching deny/advice logic. This does not justify making unknown paths deny by default, which would weaken the explicit fail-open contract; it just means aliases cannot be retired safely without first proving those caller shapes absent or changing the contract deliberately. This finding supersedes iteration 4 F4. [SOURCE: `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs:745-779`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs:906-970`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs:49-53,80-87`]

### F3. Current tests prove canonical `file_path`, not alias retirement safety

The Devin process suite constructs every enforce payload with `tool_input.file_path`; it exercises deny, advise, satisfied-state, whitespace-cwd, and missing-cwd behavior, but has no `filePath`, generic `path`, conflicting-field, malformed-canonical, or missing-path row. Phase 012 accurately describes the suite as high-risk spec-gate coverage, but it does not provide evidence that the compatibility spellings are unused. Add table-driven rows for each accepted spelling and shadowing case before changing resolution, then audit direct/synthetic callers before deleting any spelling. [SOURCE: `.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-devin.test.mjs:53-63,175-205,253-286`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/012-devin-hook-hardening/implementation-summary.md:44-75,93-115`]

### F4. Retain all task identity aliases until Devin `run_subagent` is captured live

`run_subagent` remains explicitly unobserved in phases 008 and 011, and no adapter-level task-dispatch test was found. Cursor's live Task capture proves `subagent_type` for Cursor, not Devin. The shared dispatch core can recover identity from route markers in command-owned prompts, but marker-free direct callers still rely on the identity field. Therefore, implement first-nonblank-string resolution now, add fixtures for all four current spellings and marker-free prompts, and postpone alias deletion until a real Devin payload plus caller audit establishes the emitted field. [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/implementation-summary.md:96-103`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/011-hook-truth-and-runtime-readmes/implementation-summary.md:106-111`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs:52-67`] [SOURCE: `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/003-cursor-hooks-claude-parity/implementation-summary.md:54-68`]

### F5. `mcp-route-guard.cjs` still has no Q2 field fallback to tighten

The MCP adapter reads canonical `tool_name` and applies the phase-012 workspace-root chain `cwd` -> `DEVIN_PROJECT_DIR` -> `process.cwd()`. That chain is not a tool-input alias and should remain unchanged. MCP traffic applicability is a separate Q4 question. [SOURCE: `.opencode/skills/mcp-code-mode/runtime/hooks/devin/mcp-route-guard.cjs:41-60`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/012-devin-hook-hardening/implementation-summary.md:44-67,80-106`]

### Recommended implementation gate

1. Replace truthiness chains with a tested first-nonblank-string resolver, preserving the current canonical-first ordering.
2. Retain all four task identity spellings until a live Devin `run_subagent` capture and marker-free caller audit exist.
3. Retain `filePath` and `path` unless caller/telemetry evidence proves them unused; missing-path behavior currently makes premature removal bypass-capable.
4. Add spec-gate tests for all three path spellings, missing/blank paths, malformed canonical values followed by valid aliases, and conflicts.
5. Make no Q2 field-name or project-root change to `mcp-route-guard.cjs`.

### Ruled-Out Directions

- Immediate canonical-only parsing is ruled out for both alias-bearing adapters.
- Treating missing spec-gate path context as enforcement-conservative is ruled out by the current core.
- Changing unknown paths to deny merely to enable alias deletion is ruled out because it would be a separate fail-open contract change.
- Removing the MCP project-directory fallback chain as payload cleanup is ruled out because it is a verified workspace-root invariant, not a field alias.

## Questions Answered

- **Q2: Answered with a correction.** Confirmed payloads justify canonical-first first-nonblank-string resolution, but not accepted-vocabulary reduction. Contrary to iteration 4, loss of a spec-gate path alias can bypass enforcement because missing paths are exempt. Retain task and path aliases until runtime/caller evidence supports removal; make no Q2 change to the MCP adapter.

## Questions Remaining

- Q3: How to force and distinguish real Devin `PermissionRequest` and `PostCompaction` events in a follow-up live test.
- Q4: Current dormancy/applicability of both MCP route guards after per-runtime MCP registration changes.
- Q5: Devin/Cursor CLI features shipped since the original packet research.
- Q6: Safe deduplication boundaries across Cursor and Devin adapters.

## Next Focus

If research is extended beyond the five-iteration cap, Q4 should classify the Devin and Cursor MCP route guards as active, conditionally dormant, or structurally obsolete using current registration and hook-wiring evidence.
