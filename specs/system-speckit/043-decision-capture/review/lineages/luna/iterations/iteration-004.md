# Review Iteration 004

## Dispatcher

- Iteration: 4 of 7
- Mode: review
- Dimension: maintainability
- Target agent: deep-review
- Agent definition loaded: true
- Resolved route: Resolved route: mode=review target_agent=deep-review
- Operator review focus (review_focus): Decision-capture series code and docs: .skilled/hooks/decision-capture (lib, bin sweeps, claude, devin, pi adapters and tests), .opencode/plugins/decision-capture.js, system-spec-kit runtime decision-table-matcher.ts, cli/continuity/match-decision-table.ts, decision-record-writer.ts consumed-log reader, cli/core/workflow.ts operator-decision path, .skilled/commands/speckit/save.md decision step, hooks README and coverage-rationale, the operator-decision-capture feature catalog entry and the decision-capture playbook scenarios. Look for correctness bugs, security and path issues, maintainability and overengineering.
- Focus application: Traced answers from shared queue normalization through the five native sweep readers, live adapters, matcher, consumed-log writer and save workflow. Inspected the corresponding per-runtime and matcher/writer tests as source without executing them.

## Files Reviewed

- .skilled/hooks/decision-capture/lib/capture-core.mjs:38-80,238-329,335-389
- .skilled/hooks/decision-capture/lib/chat-questions.mjs:17-208
- .skilled/hooks/decision-capture/bin/sweep-transcript.mjs:229-309
- .skilled/hooks/decision-capture/bin/sweep-codex.mjs:98-137,311-349
- .skilled/hooks/decision-capture/bin/sweep-devin.mjs:234-310
- .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:113-225,255-345
- .skilled/hooks/decision-capture/bin/sweep-pi.mjs:128-175,234-327
- .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs:1-75
- .skilled/hooks/decision-capture/devin/ask-capture-posttooluse.mjs:60-102
- .skilled/hooks/decision-capture/pi/decision-capture.ts:48-129
- .opencode/plugins/decision-capture.js:41-104
- .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-table-matcher.ts:57-213,260-391
- .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts:19-33,103-227,255-455
- .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:667-741,748-839
- .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:624-765
- .skilled/hooks/decision-capture/lib/capture-core.test.mjs:592-889
- .skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs:131-510
- .skilled/hooks/decision-capture/bin/sweep-codex.test.mjs:119-340
- .skilled/hooks/decision-capture/bin/sweep-devin.test.mjs:58-248
- .skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs:77-410
- .skilled/hooks/decision-capture/bin/sweep-pi.test.mjs:71-318
- .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.test.mjs:65-78
- .skilled/hooks/decision-capture/devin/ask-capture-posttooluse.test.mjs:144-202
- .skilled/hooks/decision-capture/pi/decision-capture.test.ts:95-306
- .opencode/plugins/tests/decision-capture.test.cjs:76-181
- .skilled/skills/system-spec-kit/runtime/cli/tests/decision-table-matcher.vitest.ts:36-210
- .skilled/skills/system-spec-kit/runtime/cli/tests/match-decision-table.vitest.ts:173-310
- .skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts:162-462

## Findings by Severity

### P0 Findings

None.

### P1 Findings

No new P1 findings. The active transcript-identity and series-closure findings remain unresolved.

### P2 Findings

No new P2 findings. The active chat-candidate, queue-symlink and transcript-sweeps documentation findings remain unresolved.

## Traceability Checks

- Core spec_code: fail, carried forward from iteration 3.
- Core checklist_evidence: fail, carried forward from iteration 3.
- Overlay skill_agent: not applicable; no separate agent contract owns this feature.
- Overlay agent_cross_runtime: pass; runtime capability descriptions remain consistent outside the transcript-sweeps finding.
- Overlay feature_catalog_code: pass; save and runtime boundaries remain aligned.
- Overlay playbook_capability: fail, carried forward from iteration 3.

## Integration Evidence

The runtime-neutral core owns source-key creation, process-question filtering, queue locking, deduplication, consumed-key filtering and nudge state. Each sweep adapts a native storage format and hands normalized records to the same core; adapters are thin and reuse those mappings. The pure table matcher owns parsing and scoring while the CLI owns file access and output. The workflow separates packet planning from record writing, and the writer owns record formatting plus consumed-log updates. Existing tests are grouped around the shared core, each sweep, live adapters, matcher, CLI and writer; they cover cross-order deduplication, malformed/cancelled inputs, storage variants, ambiguous matches and repeat-save behavior. No tests or live sessions were run.

## Edge Cases

- The shared core and save-time consumers each derive the same state directory; this remains relevant to the active symlink-boundary finding and should be handled consistently if fixed.
- Per-runtime CLI wrappers repeat some entrypoint scaffolding, but missing-session behavior and storage discovery differ by runtime; a common wrapper would couple those distinct paths.
- Test files were read selectively for structure and regression intent. Their assertions were not executed in this read-only review.

## Confirmed-Clean Surfaces

- Runtime-specific sweep modules keep storage parsing local and reuse the shared record format, queue operations and chat-question detector.
- Table matching has one scoring implementation; the CLI imports the library rather than copying the matching rules.
- The queue lock protects the read-existing-keys then append sequence, and tests cover concurrent writes plus hook/sweep ordering.
- The writer and workflow separate document formatting from packet ownership and save orchestration.

## Ruled Out

- No additional maintainability issue or unnecessary abstraction was confirmed in the reviewed code.
- The independent transcript readers reflect different runtime storage formats; their small CLI wrappers have meaningful runtime-specific behavior.
- No tests were run, as required by this review workflow.

## Workflow Provenance

The first graph convergence attempt was STOP_BLOCKED because the projection omitted the workflow's canonical dimension-to-file coverage. I rebuilt that coverage from the four recorded iteration events; the corrected graph reports dimensionCoverage 1.0 and STOP_ALLOWED. The reviewed sources and findings did not change.
The inline review vote also requires one stabilization pass: dimension coverage first reached 100% in iteration 4, so coverage_age is 0. The loop continues for a focused review pass before synthesis.

## Next Focus

- Dimension: all four review dimensions covered; evaluate the inline convergence vote and synthesize.
- Focus area: Record the unresolved findings with their evidence and conditional verdict.
- Reason: Maintainability was the final uncovered dimension.
- Rotation status: D4 maintainability recorded.
- Blocked/productive carry-forward: Preserve all five active findings; the P1 items have typed adjudication packets.
- Required evidence: Reducer state, graph convergence event, and synthesis reconciliation.
- Recovery note: The review is read-only; no source-code or documentation fixes were made.

Review verdict: CONDITIONAL
