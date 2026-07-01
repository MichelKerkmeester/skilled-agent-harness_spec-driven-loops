# Dimension

Correctness -- inventory + pass A on state-store and injection-plugin behavior.

## Artifact Map

| Artifact | Type | Size / complexity estimate | Pass A role |
|---|---:|---:|---|
| `.opencode/plugins/mk-goal.js` | ESM OpenCode plugin | 1676 lines; high complexity; state, lifecycle, supervisor, continuation, injection, tools | Primary implementation under review |
| `.opencode/commands/opencode_goal.md` | command markdown | 83 lines per strategy inventory; not deeply reviewed in pass A | Deferred for command phase |
| `.opencode/plugins/__tests__/mk-goal-state.test.cjs` | Node test | 189 lines; state + passive injection checks | Primary test evidence for phases 001-002 |
| `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs` | Node test | 56 lines; tool context session resolution | State helper consumer evidence |
| `.opencode/plugins/__tests__/mk-goal-export-contract.test.cjs` | Node test | 24 lines; loader/export shape | Supporting plugin-load evidence |
| `.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs` | Node test | 175 lines; lifecycle accounting | Adjacent state transition consumer spot-check |
| `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs` | Node test | 155 lines; verifier persistence/redaction | Adjacent state transition/redaction spot-check |
| `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs` | Node test | 373 lines; autonomy/continuation | Inventory only for this pass |
| `001-state-store/{spec,plan,tasks,implementation-summary}.md` | phase docs | Level 1 packet docs | Cross-check state-store claims |
| `002-injection-plugin/{spec,plan,tasks,implementation-summary}.md` | phase docs | Level 1 packet docs | Cross-check injection claims |

Graph status: stale, so this iteration used graphless fallback: direct reads plus exact searches. Phase `009-speckit-command-goal-prompt-offer/**` was not read.

# Files Reviewed

- `.opencode/plugins/mk-goal.js:135-168` -- session normalization and state file keying.
- `.opencode/plugins/mk-goal.js:177-212` -- prompt/objective sanitization and evidence redaction helpers.
- `.opencode/plugins/mk-goal.js:579-595` -- state directory and per-session path helpers.
- `.opencode/plugins/mk-goal.js:685-738` -- read and atomic write behavior.
- `.opencode/plugins/mk-goal.js:762-781` -- per-session mutation queue.
- `.opencode/plugins/mk-goal.js:835-877` -- set and clear helpers.
- `.opencode/plugins/mk-goal.js:1350-1395` -- injection rendering and append behavior.
- `.opencode/plugins/mk-goal.js:1402-1441` -- status output and injection preview.
- `.opencode/plugins/mk-goal.js:1620-1644` -- transform and tool hook exposure.
- `.opencode/plugins/__tests__/mk-goal-state.test.cjs:21-180` -- state/injection test assertions.
- `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:23-45` -- ToolContext session resolution test assertions.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/001-state-store/spec.md:120-147` -- state-store requirements and success criteria.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/001-state-store/plan.md:77-84` -- state-store architecture claims.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/001-state-store/implementation-summary.md:53-61` -- state-store implementation claims.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/002-injection-plugin/spec.md:95-130` -- injection requirements.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/002-injection-plugin/plan.md:77-99` -- injection architecture and required inventory.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/002-injection-plugin/implementation-summary.md:51-59` -- injection implementation claims.

# Findings By Severity

## P0

None.

## P1

### DR-001-P1-001 [P1] Injection max-length option does not cap the rendered active-goal block

- File: `.opencode/plugins/mk-goal.js:1376`
- Claim: Phase 002 claims `renderGoalInjection` caps output length, but the implementation only budgets the `goal_prompt` segment and can return a block longer than `maxInjectionChars` once fixed structural lines, objective, verifier reason, usage, and directive are added.
- Evidence: Phase 002 scope requires a "length-capped" active-goal block at `.opencode/specs/deep-loops/032-goal-opencode-plugin/002-injection-plugin/spec.md:95`, and the plan says `renderGoalInjection` "caps output length" at `.opencode/specs/deep-loops/032-goal-opencode-plugin/002-injection-plugin/plan.md:77`. Implementation computes `promptBudget` from `options.maxInjectionChars - buildBlock('').length`, clamps that to at least 3, then returns `buildBlock(sanitizePromptText(goalPrompt, promptBudget))` without clamping the final block at `.opencode/plugins/mk-goal.js:1376-1378`. The existing long-injection test passes `maxInjectionChars: 220` but only asserts structure and ellipsis, not `clippedBlock.length <= 220`, at `.opencode/plugins/__tests__/mk-goal-state.test.cjs:120-132`.
- Reproduction evidence: A direct helper invocation with `maxInjectionChars: 220` produced `{"length":331,"max":220,...}`. This confirmed the code-path behavior but created temp state outside the allowed review packet; see `## SCOPE VIOLATIONS`.
- Counterevidence sought: I checked whether tests asserted the total rendered length and found only `maxInjectionChars` usages in `.opencode/plugins/__tests__/mk-goal-state.test.cjs:121` and `.opencode/plugins/__tests__/mk-goal-state.test.cjs:151`, with no total-length assertion.
- Alternative explanation: The option could be intended to cap only the prompt subsection, but the phase language says "block" and "output length", and the option is named `maxInjectionChars`, not `maxGoalPromptChars`.
- Final severity: P1.
- Confidence: high.
- Downgrade trigger: Downgrade to P2 only if the phase docs are amended to state `maxInjectionChars` is a soft prompt-subsection budget and not a total injection limit.
- Finding class: spec mismatch / boundary handling.
- Recommendation: Clamp or budget the final rendered block so `renderGoalInjection(..., { maxInjectionChars: N }).length <= N` while preserving a valid `[active_goal]...[/active_goal]` frame, then add an assertion covering total block length.

## P2

None.

# Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial | Phase 001 state-store requirements align with fail-closed session ids, hex-keyed files, atomic writes, queued mutations, and set/clear helpers in `.opencode/plugins/mk-goal.js:579-877`. Phase 002 injection mostly aligns, except DR-001-P1-001 on total length capping. |
| `checklist_evidence` | notApplicable | Strategy records no `checklist.md` for Level 1 phase packets. |
| `feature_catalog_code` | deferred | Out of focus for pass A. |
| `playbook_capability` | deferred | Out of focus for pass A. |

# SCOPE VIOLATIONS

- Executed a read-only-intended helper reproduction with `stateDir` set to `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode/mk-goal-review-state`; because `setGoal` persists state, this created temp plugin state outside the allowed write list. No reviewed source/spec files were modified. Further reproduction was stopped, and this iteration records the violation explicitly.

# Verdict

CONDITIONAL. One P1 correctness/spec-mismatch finding is active.

# Next Dimension

Security pass focused on prompt-injection sanitization and secret redaction in evidence/logs.

Review verdict: CONDITIONAL
