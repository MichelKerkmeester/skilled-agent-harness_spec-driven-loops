# Iteration 1: Hook Coverage Inventory

## Focus

Q1: Identify current cli-devin and cli-cursor coverage gaps against the repository's Claude lifecycle wiring and Codex guard-adapter inventory, while separating configured, live-observed, and functionally equivalent coverage.

## Actions Taken

1. Read the current deep-research strategy/state and the required Devin evidence: `hook-testing-results.md` plus phases 008, 011, and 012.
2. Read all six current children under Cursor's reorganized `009-cursor-hooks-lifecycle/` parent and phase `010-hook-code-style-cross-runtime/`.
3. Compared the live `.claude/settings.json`, `.devin/hooks.v1.json`, and `.cursor/hooks.json` registration surfaces and the canonical cross-runtime hook reference.
4. Checked Codex's current guard-adapter contract and the later Cursor phases that supersede historical phase-009 claims about MCP routing and spec-gate prebinding.

## Findings

### F1. The comparison baseline is seven Claude event keys plus Codex guard parity, not an independent eight-event Claude/Codex lifecycle

The eight-event set in the research question is Devin's native contract: `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PermissionRequest`, `Stop`, `PostCompaction`, and `SessionEnd`. Current Claude wiring has seven keys and no `PermissionRequest`; its compaction event is `PreCompact`. Codex contributes eight tool-level guard-adapter rows over lifecycle-like hook events, not a separate eight-event lifecycle inventory. Therefore, coverage must be assessed on two axes: normalized lifecycle coverage and guard capability coverage. Treating all three as one eight-event inventory would incorrectly classify Devin's empty `PermissionRequest` as a failed port even though there is no Claude source handler to port. [SOURCE: `.claude/settings.json:14-180`] [SOURCE: `.opencode/skills/cli-external-orchestration/cli-codex/references/hook-contract.md:81-106`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/research-devin-hooks-portability/iterations/iteration-005.md:18-45`]

### F2. Devin has complete registration coverage, six observed event categories, one explicit functional gap, and one unobserved implementation

| Normalized event | Current Devin state | Coverage verdict |
|---|---|---|
| SessionStart | Five handlers registered; observed live | Covered |
| UserPromptSubmit | Advisor and spec-gate classification registered; observed live | Covered |
| PreToolUse | Exec/edit/subagent/MCP matchers registered; event observed live | Covered at event level; `run_subagent` and applicable external-MCP branches remain unobserved |
| PostToolUse | Edit quality/freshness and exec audit registered; observed live | Covered |
| PermissionRequest | Explicit empty array; no Claude source handler | Intentional functional gap, not an adapter failure |
| Stop | Session accounting and completion evidence registered; observed live | Covered |
| Compaction | Native `PostCompaction` adapter registered | Structurally covered, live behavior unobserved |
| SessionEnd | Cleanup registered; observed live | Covered |

The current registration contains all eight keys, and the corrected-schema probe observed six. The non-firing of `PermissionRequest` and `PostCompaction` in a session where neither underlying condition occurred is not negative evidence. [SOURCE: `.devin/hooks.v1.json:1-166`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md:51-61`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/implementation-summary.md:48-54`]

### F3. Cursor covers the active session/tool lifecycle but has two material functional gaps and two confidence gaps

| Normalized event/capability | Current Cursor state | Coverage verdict |
|---|---|---|
| SessionStart | Six handlers wired; base event live; spec-gate prebind now committed and tested | Covered |
| UserPromptSubmit | Two `beforeSubmitPrompt` handlers wired, but the event is confirmed dormant | Material gap: prompt-time advisor/classification is unavailable; startup prebinding compensates only mutation-gate state |
| PreToolUse | Spec-gate enforcement and Task dispatch guard wired and live | Covered for those guards; Codex's dispatch-preflight lint has no Cursor pre-tool equivalent |
| PostToolUse | Write/Shell proxy wired and live; chains quality, freshness, and audit | Covered, with known audit-provenance drift only |
| PermissionRequest | No generic Cursor equivalent wired | Native-lifecycle gap, but no Claude source handler exists either; `beforeMCPExecution` is not a generic substitute |
| Stop | Cursor CLI `stop` is non-delivering; `sessionEnd` proxies session accounting | Partial: lifecycle accounting covered, completion-evidence sentinel deliberately absent because Cursor lacks `last_assistant_message` and supporting state |
| Compaction | `preCompact` proxy wired; no CLI-reachable trigger observed | Structural coverage with no live-delivery evidence |
| SessionEnd | Accounting and cleanup wired; observed live | Covered |

Cursor's later phases materially supersede historical phase-009 snapshots: `beforeMCPExecution` is now wired and live-observed after real payload capture, and `spec-gate-prebind.mjs` is now committed, registered, and covered by an 11-row process suite. Those are current coverage facts even though earlier child summaries correctly describe them as unwired/unreviewed at their historical completion points. [SOURCE: `.cursor/hooks.json:4-93`] [SOURCE: `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/003-cursor-hooks-claude-parity/implementation-summary.md:42-55`] [SOURCE: `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/011-cursor-mcp-wiring-and-route-guard-fix/implementation-summary.md:37-64`] [SOURCE: `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/013-cursor-spec-gate-prebind/implementation-summary.md:57-80`]

### F4. Guard-capability parity narrows the actionable backlog

Against Codex's eight guard rows, Devin has adapters for all seven shared guard cores plus its native task-dispatch path; its remaining issues are branch-level live evidence, not missing adapter files. Cursor currently covers spec-gate enforce/classify, post-edit quality, code-graph freshness, dispatch audit, task dispatch, and MCP routing. The two substantive missing capabilities are: (1) dispatch preflight lint before `Shell` execution, and (2) completion-evidence checking at turn/session completion. The latter is not a thin-port task because Cursor's `sessionEnd` payload supplies `transcript_path` rather than `last_assistant_message`; implementing it would require a Cursor transcript reader and state contract. [SOURCE: `.opencode/skills/cli-external-orchestration/cli-codex/references/hook-contract.md:88-102`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/implementation-summary.md:39-54`] [SOURCE: `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/003-cursor-hooks-claude-parity/implementation-summary.md:45-55,80-82`]

### F5. Registration must not be counted as behavioral coverage

The strongest recurring failure mode is flattening `wired`, `event observed`, and `branch behavior observed` into one status. Devin's `PreToolUse` event firing does not prove the `run_subagent`, deny, or applicable external-MCP branches. Cursor's registered `beforeSubmitPrompt` and `preCompact` do not prove delivery. Conversely, Cursor `beforeMCPExecution` and spec-gate prebinding are now stronger than registration-only because later phases captured real payloads or ran discriminating process suites. Future matrices should retain these separate states. [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/011-hook-truth-and-runtime-readmes/implementation-summary.md:106-111`] [SOURCE: `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/004-hooks-manual-testing-results/implementation-summary.md:39-48`] [SOURCE: `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/011-cursor-mcp-wiring-and-route-guard-fix/implementation-summary.md:86-105`]

### Ruled-Out Directions

- Treating Cursor `beforeMCPExecution` as a `PermissionRequest` equivalent is ruled out: it is MCP-specific route advice, not a generic approval lifecycle surface.
- Treating phase-009's “unwired” MCP/prebind statements as current truth is ruled out: later phases 011 and 013 explicitly supersede those historical states.
- Treating the eight normalized events as eight currently registered Claude keys is ruled out: `.claude/settings.json` has seven and no `PermissionRequest`.

## Questions Answered

- **Q1: Answered.** Devin's only event-level functional hole is the intentionally empty `PermissionRequest`; `PostCompaction` is implemented but unobserved, while several PreToolUse branches still need live evidence. Cursor's material functional gaps are dormant prompt-time delivery, missing dispatch-preflight lint, and missing completion-evidence behavior; compaction remains registration-only. Session lifecycle, tool enforcement, post-tool quality/freshness/audit, task dispatch, and MCP routing are otherwise covered in the current on-disk state.

## Questions Remaining

- Q2: Whether confirmed Devin payloads justify tightening field fallbacks without reducing fail-open safety.
- Q3: How to force and distinguish real Devin `PermissionRequest` and `PostCompaction` events in a follow-up live test.
- Q4: Current dormancy/applicability of both MCP route guards after per-runtime MCP registration changes.
- Q5: Devin/Cursor CLI features shipped since the original packet research.
- Q6: Safe deduplication boundaries across Cursor and Devin adapters.

## Next Focus

Q2: Read the current Devin `task-dispatch-guard.cjs`, `spec-gate-enforce.mjs`, and `mcp-route-guard.cjs` alongside their captured real payload evidence and sibling adapters. Classify each fallback as confirmed alias, compatibility hedge, or unsafe ambiguity before recommending any tightening.
