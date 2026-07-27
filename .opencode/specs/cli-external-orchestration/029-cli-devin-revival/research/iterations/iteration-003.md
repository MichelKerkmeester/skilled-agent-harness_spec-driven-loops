# Iteration 3: Alias Precedence and Fail-Open Safety

## Focus

Q2: Refine whether confirmed Devin payloads justify tightening field fallbacks by separating compatibility breadth, alias precedence, and actual fail-open behavior in each guard.

## Actions Taken

1. Read the externalized state, reducer-owned strategy, and iteration-002 conclusion before inspecting the target surface.
2. Rechecked the corrected-schema live Devin captures and current packet summaries for confirmed versus unobserved tool-input fields.
3. Inspected the three current Devin adapters and the shared spec-gate core to trace what happens when a canonical field is absent, malformed, or conflicts with an alias.
4. Cross-checked the reorganized Cursor lifecycle packet for independently confirmed `Task` payload evidence and the current MCP guard wiring boundary.

## Findings

### F1. Confirmed payloads support canonical-first resolution, not canonical-only parsing

The live Devin captures confirm `tool_name`, `tool_input`, and `file_path` for observed tools, but still do not cover `run_subagent`. Cursor independently observed `Task` with `tool_input.subagent_type`, which increases confidence that snake-case is the cross-runtime canonical spelling but is not evidence of Devin's exact `run_subagent` contract. The safe policy is therefore canonical-first: prefer `subagent_type` and `file_path`, but do not delete Devin's unobserved subagent aliases solely from adjacent-tool or Cursor evidence. [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md:58-61,96`] [SOURCE: `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/003-cursor-hooks-claude-parity/implementation-summary.md:54-68`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs:52-67`]

### F2. The current `||` chains need type-aware precedence before any alias retirement

Both alias-bearing adapters choose the first truthy property and validate type only afterward, or not at the adapter boundary. In `filePathFrom`, a truthy non-string `file_path` suppresses a later valid `filePath`/`path` and then resolves to `null`; in the dispatch adapter, a truthy malformed `subagent_type` suppresses later aliases and is forwarded to the core. Tightening by deletion does not fix this precedence defect. A future implementation should use an ordered resolver that selects the first non-empty string, records which spelling won in bounded telemetry or tests, and treats conflicting valid aliases deterministically with the confirmed snake-case field first. This preserves fail-open parsing while preventing malformed high-priority fields from shadowing valid compatibility data. [SOURCE: `.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs:49-53,80-87`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs:54-67`]

### F3. Missing spec-gate path context is enforcement-conservative, not a silent fail-open bypass

Iteration 2 correctly warned that alias removal can lose target-path context, but the shared core narrows the safety consequence. For an open gate, `edit` remains deny-capable regardless of whether `filePath` is null; path data is used only to recognize an exempt target. Therefore retiring `path` or losing an alias cannot silently allow an ordinary edit under an open enforced gate. It can instead false-deny or advise an actually exempt edit. Conversely, accepting generic `path` can falsely exempt a mutation if that field names an exempt spec artifact while the true target is elsewhere. This makes generic `path` the strongest retirement candidate, but compatibility evidence and process fixtures are still needed before removal. [SOURCE: `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs:906-928,943-967`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs:49-53`]

### F4. `mcp-route-guard.cjs` remains outside field-alias tightening

The MCP adapter reads only canonical `tool_name`; its `cwd` to `DEVIN_PROJECT_DIR` to `process.cwd()` chain is a tested project-root invariant shared across Devin adapters, not a tool-input spelling fallback. Removing it would alter manifest lookup behavior without increasing payload certainty. Its runtime applicability remains Q4. [SOURCE: `.opencode/skills/mcp-code-mode/runtime/hooks/devin/mcp-route-guard.cjs:41-60`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/012-devin-hook-hardening/implementation-summary.md:47-55,75-85`]

### F5. Recommended staged hardening order

1. Add exact live-payload process fixtures for observed `edit.file_path` and a discriminating future `run_subagent` capture.
2. Replace truthiness chains with first-non-empty-string canonical-first resolution and conflicting-alias tests.
3. Retire generic spec-gate `path` only after fixture and caller audits; missing path remains enforcement-conservative, but exemption compatibility can regress.
4. Retain `filePath` as an explicit compatibility spelling until usage is measured.
5. Retire dispatch aliases only after a real Devin `run_subagent` payload establishes the field contract.
6. Make no field-name change to the MCP adapter under Q2.

This sequence improves determinism before reducing accepted shapes, preserving the distinction between fail-open parser behavior and effective guard coverage. [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/implementation-summary.md:63-65,86-101`] [SOURCE: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/011-hook-truth-and-runtime-readmes/implementation-summary.md:66,110`]

### Ruled-Out Directions

- Removing every non-snake-case alias now is ruled out because Devin `run_subagent` remains unobserved and deletion does not address malformed-field precedence.
- Treating missing spec-gate path data as a silent allow bypass is ruled out by `evaluateMutation`: an open gate still denies or advises an edit unless the target is positively recognized as exempt.
- Tightening the MCP adapter's project-directory fallback as payload-schema cleanup is ruled out because it is unrelated to tool-input field spelling.

## Questions Answered

- **Q2: Answered with refined safety boundaries.** Confirmed payloads justify canonical-first, type-aware resolution and staged retirement of generic `path`; they do not justify canonical-only `run_subagent` parsing. Missing spec-gate paths are enforcement-conservative rather than fail-open, and the MCP adapter has no field aliases to tighten.

## Questions Remaining

- Q3: How to force and distinguish real Devin `PermissionRequest` and `PostCompaction` events in a follow-up live test.
- Q4: Current dormancy/applicability of both MCP route guards after per-runtime MCP registration changes.
- Q5: Devin/Cursor CLI features shipped since the original packet research.
- Q6: Safe deduplication boundaries across Cursor and Devin adapters.

## Next Focus

Q4: Determine whether each runtime can currently register external MCP servers, whether the corresponding hook event is wired and live-delivering, and whether Code Mode's manifest can overlap native tools. Classify each route guard as active, conditionally dormant, or structurally obsolete.
