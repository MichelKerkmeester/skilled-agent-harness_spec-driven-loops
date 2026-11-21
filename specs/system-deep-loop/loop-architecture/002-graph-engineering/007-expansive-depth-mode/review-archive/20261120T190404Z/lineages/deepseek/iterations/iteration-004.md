# Iteration 4 - F-1-003 security: fan-out runner command construction, env and merge trust boundaries

## Dispatcher

- Mode: review, detached fan-out lineage `deepseek` (session `fanout-deepseek-1795113418367-pvzn7z`, generation 1, lineageMode new).
- Frontier node: F-1-003, dimension security. Node scope: `fanout-run.cjs`, `fanout-merge.cjs` and their unit suites.
- Operator review focus covered in this iteration: overengineering (native and CLI PRE-BOUND blocks compared, two instances ruled out as a pattern), operator UX (review-focus control stripping and length bound, partition and merge warning text), cross-CLI/OS parity (all nine executor adapters, per-kind env filtering, Windows-safe spawn and path handling).

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` -- `normalizeReviewFocus`, native command input, detached lineage prompt, spawn wrapper and timeout/stderr caps, all nine executor adapters, per-lineage env assembly.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` -- real-file/containment readers, lineage directory enumeration, frontier merge and partition guard, review finding/traceability merge.
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` -- lineage label grammar and config validation (context for path safety).
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` -- per-kind env allowlist applied before the lineage env overlay (context).
- Traceability sources: `011-review-frontier-mode` REQ-008 and `009-fanout-review-coverage-merge` REQ-001..REQ-006.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | `011` REQ-008's depth-1 seed before spawn, `depthMode` passthrough, round-robin partition, `frontier_scope:` binding, `frontier_partition` record, per-lineage stores and the merge guard are implemented as written. The only outstanding partial remains iteration 3's REQ-007 admission gap; this iteration found no new contradiction. |
| `checklist_evidence` | partial | `009` REQ-001..REQ-006 merge rules and `011` AC-010/AC-011 fan-out criteria match the code; AC-008's admission claim remains the outstanding partial. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4193-4206` builds each child env as `buildExecutorDispatchEnv(lineage, process.env)` and overlays only the named `SPECKIT_*`, gate-off, graph-store and adapter env keys after the allowlist filter.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4171-4186` re-injects `AI_SESSION_CHILD`, `SYSTEM_SPEC_GATE_DISABLED`, `DEEP_LOOP_COVERAGE_DB_DIR` and the per-kind state dir because the allowlist drops them; these are the values the detached contract depends on.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1592-1617` enumerates lineage directories from disk and rejects symlinked entries; every read goes through `resolveOptionalRealFile`/`assertSafeOutputPath` with realpath containment.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:778-805` qualifies every merged node id with its lineage label, sorts by label then id, and compares the dealt depth-1 ids against reported local ids so a missing lineage is named.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3492-3515` maps all nine `EXECUTOR_KINDS` to an adapter and throws on an unknown kind.

## Edge Cases

- `cli-opencode` defaults to `danger-full-access` because the CLI exposes no enforceable sandbox flag (`fanout-run.cjs:4079-4088`); the lineage-only write boundary is carried by the prompt and the post-hoc containment guard, a tradeoff the range records in its own comment rather than hiding.
- A multi-line or control-bearing review focus is collapsed to one bounded line before it reaches the `review_focus:` binding (`fanout-run.cjs:232-247`), so it cannot end the binding early; the focus is also embedded twice for CLI lineages, once as a flag and once as a binding.
- `spawnSync('/bin/sh', ['-c', 'command -v codex ...'])` is used only for binary detection in `isCodexBinaryAvailable` and the sibling checks; the command string is static, so no lineage/config value reaches a shell.
- The merge throws on the first unreadable or invalid lineage registry/state log rather than degrading that lineage; this reader predates the range, so it is recorded as context and not as a range finding.

## Confirmed-Clean Surfaces

- No executor adapter uses `shell: true`; every argument is built as an argv array, with prompts passed on stdin or as a single argv element.
- Lineage labels are validated to `^[a-z0-9][a-z0-9-]*$` before they become directory names (`executor-config.ts:889`), and the merge enumerates real directories rather than trusting a label from the summary.
- The merge rejects symlinked artifact and lineage directories and confirms every read path resolves inside the artifact root.
- The review-focus and review-target normalizers strip control characters, collapse whitespace and cap length, closing the setup-binding injection path the code documents.
- Per-kind env allowlists are applied before the fan-out overlay, so credentials for one executor kind do not reach another kind's child by default.
- The recursion guard requires both an inherited fan-out lineage id and the same kind on the dispatch stack, so a seat cannot silently re-fan-out its own executor.

## Ruled Out

- Shell injection through model, focus, target or node text: no adapter shells out, and the two static `/bin/sh -c command -v` probes carry no input.
- Prompt injection from an admitted frontier node into a sibling lineage: post-spawn admissions stay in the lineage's own store and prompt; the shared seed questions come from the orchestrator.
- Treating the whole-merge abort on one corrupt lineage log as a security finding: the throwing readers predate the range and the behavior is fail-closed rather than silently merging a corrupt registry.
- Extracting the duplicated PRE-BOUND block from `buildNativeCommandInput` and `buildLoopPrompt`: two instances with different delivery surfaces, and `prevent-overengineering.md` section 4 keeps them separate until a third caller appears.

## Next Focus

- Dimension: security on F-1-005 (reducers, convergence, upsert and dispatch).
- Reason: F-1-003 security is clear; the reducer and gateway path handles lineage state, extension events and finding evidence, so it carries the next security risk.
- Required evidence: `append-mode-event.cjs` authorization/fencing surface, `reduce-state.cjs` path echo and file writes, `upsert.cjs` JSON parsing and graph namespace isolation, `dispatch-iteration.cjs` env propagation.
- Rotation status: correctness covered on all three nodes; security covered on F-1-003 only.

Review verdict: CONDITIONAL
