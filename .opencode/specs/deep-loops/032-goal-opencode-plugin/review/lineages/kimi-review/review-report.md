# Review Report — /goal OpenCode Plugin

## 1. Executive Summary
- **Verdict:** CONDITIONAL
- **Active findings:** P0=0, P1=3, P2=34
- **hasAdvisories:** true
- **Scope:** `.opencode/specs/deep-loops/032-goal-opencode-plugin` (spec-folder)
- **Review dimensions covered:** correctness, security, traceability, maintainability
- **Stop reason:** maxIterationsReached
- **Session:** fanout-kimi-review-1783146823455-7q45s6
- **Total iterations:** 10

## 2. Planning Trigger
The P1 findings block a clean PASS. Route to /speckit:plan to close the race conditions and checklist overclaim before changelog creation.

## 3. Active Finding Registry

### P0 — Blocker
_None._

### P1 — Required
- **F008** (P1) — Phase 016 checklist overclaim is part of broader status-drift pattern  
  File: `.opencode/specs/deep-loops/032-goal-opencode-plugin/016-plugin-correctness-fixes/checklist.md:40` | Dimension: traceability | First seen: iteration 3 | Evidence: .opencode/specs/deep-loops/032-goal-opencode-plugin/016-plugin-correctness-fixes/checklist.md:40-90, .opencode/specs/deep-loops/032-goal-opencode-plugin/016-plugin-correctness-fixes/spec.md:52, .opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:186  
  Child implementation summaries claim completion while child specs and parent map list phases as Planned; phase 016 is one instance.

- **F009** (P1) — Continuation in-flight lock race is reachable from session.idle  
  File: `.opencode/plugins/mk-goal.js:2091` | Dimension: security | First seen: iteration 3 | Evidence: .opencode/plugins/mk-goal.js:2091-2095, .opencode/plugins/mk-goal.js:2539-2569  
  Multiple session.idle dispatches for the same session can pass the has check before add, firing continuation twice.

- **F010** (P1) — Sweep/archive path can resurrect active goals  
  File: `.opencode/plugins/mk-goal.js:1231` | Dimension: traceability | First seen: iteration 3 | Evidence: .opencode/plugins/mk-goal.js:1231-1262  
  sweepOrphanedActiveStates reads outside the mutation queue and can archive a file while a queued mutator writes a new active file afterward.

### P2 — Advisory
- **F001** (P2) — Command surface expanded beyond original spec verbs  
  File: `.opencode/commands/goal_opencode.md:3` | Dimension: correctness | First seen: iteration 1 | Evidence: .opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:89-92, .opencode/commands/goal_opencode.md:3,30-33  
  Parent spec scoped /goal to set/show/clear/complete/pause; shipped command adds history/doctor/health/resume.

- **F002** (P2) — 009-diagnostic-review folder remains undocumented  
  File: `.opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:166` | Dimension: traceability | First seen: iteration 1 | Evidence: .opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:166-193, .opencode/specs/deep-loops/032-goal-opencode-plugin/009-diagnostic-review/  
  No spec.md or implementation-summary exists inside 009-diagnostic-review and it is not referenced in the parent phase map.

- **F003** (P2) — State directory resolved relative to plugin file  
  File: `.opencode/plugins/mk-goal.js:25` | Dimension: correctness | First seen: iteration 1 | Evidence: .opencode/plugins/mk-goal.js:25  
  Spec names .opencode/skills/.goal-state/; plugin resolves ../skills/.goal-state/ from its own file URL.

- **F004** (P2) — appendGoalJsonl swallows all errors silently  
  File: `.opencode/plugins/mk-goal.js:696` | Dimension: security | First seen: iteration 2 | Evidence: .opencode/plugins/mk-goal.js:696-709  
  Audit and debug log append failures are silently dropped, removing observability signals for disk/permission problems.

- **F005** (P2) — redactEvidence misses common secret formats  
  File: `.opencode/plugins/mk-goal.js:380` | Dimension: security | First seen: iteration 2 | Evidence: .opencode/plugins/mk-goal.js:380-389  
  Regex set omits Google API keys, PEM private key blocks, and hex high-entropy secrets from evidence redaction.

- **F006** (P2) — role marker sanitizer only handles colon delimiter  
  File: `.opencode/plugins/mk-goal.js:339` | Dimension: security | First seen: iteration 2 | Evidence: .opencode/plugins/mk-goal.js:339-347  
  Role label rewrite requires a colon; equals or arrow delimiters around system/developer/etc. are not neutralized.

- **F007** (P2) — sweepOrphanedActiveStates swallows all errors  
  File: `.opencode/plugins/mk-goal.js:1231` | Dimension: security | First seen: iteration 2 | Evidence: .opencode/plugins/mk-goal.js:1231-1262  
  Orphan sweep catches and discards every exception, hiding permission, disk, or integrity failures in state management.

- **F011** (P2) — goal-events.log grows unbounded under DEBUG  
  File: `.opencode/plugins/mk-goal.js:735` | Dimension: traceability | First seen: iteration 3 | Evidence: .opencode/plugins/mk-goal.js:735-742  
  logDebugEvent appends one line per event when MK_GOAL_DEBUG=1 with no rotation or size cap.

- **F012** (P2) — executeGoalAction default show action is dead code  
  File: `.opencode/plugins/mk-goal.js:2391` | Dimension: maintainability | First seen: iteration 4 | Evidence: .opencode/plugins/mk-goal.js:2391, .opencode/commands/goal_opencode.md:55-74  
  Unknown actions fallback to show, but command router never dispatches unknown actions.

- **F013** (P2) — Duplicate budget-prefixed aliases remain in final status output  
  File: `.opencode/plugins/mk-goal.js:2327` | Dimension: maintainability | First seen: iteration 4 | Evidence: .opencode/plugins/mk-goal.js:2327-2329  
  Canonical tokens_used/token_budget/usage_source are emitted alongside legacy budget_* aliases.

- **F014** (P2) — executeGoalStatus lacks includeInjectionPreview option  
  File: `.opencode/plugins/mk-goal.js:2441` | Dimension: maintainability | First seen: iteration 4 | Evidence: .opencode/plugins/mk-goal.js:2441-2453, .opencode/plugins/mk-goal.js:2390-2394  
  executeGoalAction accepts includeInjectionPreview but executeGoalStatus always renders the preview.

- **F015** (P2) — goal_plugin.md verification list is stale  
  File: `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:99` | Dimension: maintainability | First seen: iteration 4 | Evidence: .opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:99-111, .opencode/plugins/tests/  
  Verification section lists 7 test files; the suite now has 10 files.

- **F016** (P2) — AI-driven budget parsing has concrete non-trailing edge case  
  File: `.opencode/commands/goal_opencode.md:63` | Dimension: correctness | First seen: iteration 4 | Evidence: .opencode/commands/goal_opencode.md:63-66  
  --budget N is only handled when trailing; mid-string budgets fail validation before reaching the tool.

- **F017** (P2) — GOAL_ACTIONS includes later-phase verbs without provenance  
  File: `.opencode/plugins/mk-goal.js:156` | Dimension: maintainability | First seen: iteration 4 | Evidence: .opencode/plugins/mk-goal.js:156, .opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:89-92  
  history/doctor/health/resume were added after original spec scope but carry no comment or deprecation path.

- **F018** (P2) — session.idle handler calls continuation with missing sessionID  
  File: `.opencode/plugins/mk-goal.js:2541` | Dimension: correctness | First seen: iteration 5 | Evidence: .opencode/plugins/mk-goal.js:2541-2548  
  When sessionID is falsy the branch still invokes maybeContinueGoal(null), logging a misleading missing_session_id reason.

- **F019** (P2) — recoverProviderUsageLimitIfDue does not recover budget_limited goals  
  File: `.opencode/plugins/mk-goal.js:1520` | Dimension: correctness | First seen: iteration 5 | Evidence: .opencode/plugins/mk-goal.js:1520-1527  
  Only usage_limited goals are resumed; budget_limited remains terminal even if the budget constraint changes.

- **F020** (P2) — retryAfterDeadlineFromValue misinterprets large second values  
  File: `.opencode/plugins/mk-goal.js:867` | Dimension: correctness | First seen: iteration 5 | Evidence: .opencode/plugins/mk-goal.js:867-878  
  Numeric values above 1e12 are treated as absolute ms without unit validation, so large Retry-After seconds become distant epoch timestamps.

- **F021** (P2) — buildPromptAsyncOptions uses statSync in async path  
  File: `.opencode/plugins/mk-goal.js:2034` | Dimension: correctness | First seen: iteration 5 | Evidence: .opencode/plugins/mk-goal.js:2034-2056  
  An async continuation path performs a blocking synchronous filesystem stat, stalling the event loop.

- **F022** (P2) — Smoke mode reports would_fire without promptAsync check  
  File: `.opencode/plugins/mk-goal.js:2143` | Dimension: security | First seen: iteration 6 | Evidence: .opencode/plugins/mk-goal.js:2143-2149  
  autonomyMode === smoke returns would_fire before verifying client.session.promptAsync exists.

- **F023** (P2) — Autonomy kill switch is global env only  
  File: `.opencode/plugins/mk-goal.js:660` | Dimension: security | First seen: iteration 6 | Evidence: .opencode/plugins/mk-goal.js:660-666  
  No per-session emergency stop exists beyond goal-level paused; runaway sessions require global env change or goal clear.

- **F024** (P2) — Wall clock cap measures from goal creation not resume  
  File: `.opencode/plugins/mk-goal.js:1972` | Dimension: security | First seen: iteration 6 | Evidence: .opencode/plugins/mk-goal.js:1972-1978  
  continuationCapReason uses startedAtMs, so paused-and-resumed goals resume with already-depleted wall budget.

- **F025** (P2) — Phase 015 status inconsistent between spec and implementation summary  
  File: `.opencode/specs/deep-loops/032-goal-opencode-plugin/015-packet-hygiene-and-narrative-integrity/spec.md:52` | Dimension: traceability | First seen: iteration 7 | Evidence: .opencode/specs/deep-loops/032-goal-opencode-plugin/015-packet-hygiene-and-narrative-integrity/spec.md:52, .opencode/specs/deep-loops/032-goal-opencode-plugin/015-packet-hygiene-and-narrative-integrity/implementation-summary.md:35  
  Child spec says Planned while implementation-summary says Complete and 100% completion.

- **F026** (P2) — Parent phase map does not reflect phase 015 completion  
  File: `.opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:186` | Dimension: traceability | First seen: iteration 7 | Evidence: .opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:186, .opencode/specs/deep-loops/032-goal-opencode-plugin/015-packet-hygiene-and-narrative-integrity/implementation-summary.md:35  
  Parent map lists phase 015 Planned, matching the child spec but conflicting with the child implementation summary.

- **F027** (P2) — __test seam list is duplicated  
  File: `.opencode/plugins/tests/mk-goal-export-contract.test.cjs:28` | Dimension: maintainability | First seen: iteration 8 | Evidence: .opencode/plugins/tests/mk-goal-export-contract.test.cjs:28-48, .opencode/plugins/mk-goal.js:2637-2655  
  Export-contract test hard-codes expected __test keys; adding a seam requires editing two files.

- **F028** (P2) — speckit-goal-offer-contract test not matched by documented glob  
  File: `.opencode/plugins/tests/:1` | Dimension: maintainability | First seen: iteration 8 | Evidence: .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs, .opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:99-111  
  Verification docs cite mk-goal-*.test.cjs which excludes speckit-goal-offer-contract.test.cjs.

- **F029** (P2) — Verification commands use per-file node invocation  
  File: `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:99` | Dimension: maintainability | First seen: iteration 8 | Evidence: .opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:99-111  
  Docs list individual node <file> commands instead of node --test runner, losing aggregated output.

- **F030** (P2) — GoalError codes are string literals without centralized enum  
  File: `.opencode/plugins/mk-goal.js:166` | Dimension: maintainability | First seen: iteration 8 | Evidence: .opencode/plugins/mk-goal.js:166-173, .opencode/plugins/mk-goal.js:289-292, .opencode/plugins/mk-goal.js:1430-1432  
  Error codes appear as inline strings across the file instead of a single const enum.

- **F031** (P2) — Command budget parsing only handles trailing --budget N  
  File: `.opencode/commands/goal_opencode.md:63` | Dimension: correctness | First seen: iteration 9 | Evidence: .opencode/commands/goal_opencode.md:63-66  
  Mid-string --budget N is parsed as the budget value and fails validation instead of extracting the suffix.

- **F032** (P2) — Command output contract summary omits show from ACTION list  
  File: `.opencode/commands/goal_opencode.md:30` | Dimension: correctness | First seen: iteration 9 | Evidence: .opencode/commands/goal_opencode.md:30-33  
  The summary ACTION list should explicitly include show or clarify it is the default path.

- **F033** (P2) — Failure envelope normalizes unknown action to show  
  File: `.opencode/plugins/mk-goal.js:2380` | Dimension: correctness | First seen: iteration 9 | Evidence: .opencode/plugins/mk-goal.js:2380-2388  
  failureLines maps unrecognized actions to show, which is misleading if a different action failed.

- **F034** (P2) — goal_plugin.md output field table omits emitted fields  
  File: `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:64` | Dimension: maintainability | First seen: iteration 10 | Evidence: .opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:64-78, .opencode/plugins/mk-goal.js:2337-2340  
  blocked_by_prompt, continuation_suppressed, continuation_attempts, and continuation_suppressed_reason are emitted but not documented.

- **F035** (P2) — goal_opencode.md output summary omits mutation= field  
  File: `.opencode/commands/goal_opencode.md:49` | Dimension: maintainability | First seen: iteration 10 | Evidence: .opencode/commands/goal_opencode.md:30-33, .opencode/commands/goal_opencode.md:49, .opencode/commands/goal_opencode.md:80-84  
  mutation= is described in prose but missing from the STATUS/ACTION envelope summary lines.

- **F036** (P2) — PROMPT_OVERHEAD_CHARS magic constant lacks derivation  
  File: `.opencode/plugins/mk-goal.js:38` | Dimension: maintainability | First seen: iteration 10 | Evidence: .opencode/plugins/mk-goal.js:38, .opencode/plugins/mk-goal.js:445  
  Value 1900 determines objective budget in buildEnhancedGoalPrompt but has no derivation comment.

- **F037** (P2) — maxAutoTurns clamping to env value is undocumented  
  File: `.opencode/plugins/mk-goal.js:2015` | Dimension: maintainability | First seen: iteration 10 | Evidence: .opencode/plugins/mk-goal.js:2015, .opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:45-62  
  reserveContinuationTurn clamps stored maxAutoTurns to the current env cap, but docs describe the env var only as a default for new goals.

## 4. Remediation Workstreams
### Race conditions and autonomy safety
- F008: Phase 016 checklist overclaim is part of broader status-drift pattern (.opencode/specs/deep-loops/032-goal-opencode-plugin/016-plugin-correctness-fixes/checklist.md:40)
- F009: Continuation in-flight lock race is reachable from session.idle (.opencode/plugins/mk-goal.js:2091)
- F010: Sweep/archive path can resurrect active goals (.opencode/plugins/mk-goal.js:1231)
- F022: Smoke mode reports would_fire without promptAsync check (.opencode/plugins/mk-goal.js:2143)
- F023: Autonomy kill switch is global env only (.opencode/plugins/mk-goal.js:660)
- F024: Wall clock cap measures from goal creation not resume (.opencode/plugins/mk-goal.js:1972)
### Documentation and traceability drift
- F001: Command surface expanded beyond original spec verbs (.opencode/commands/goal_opencode.md:3)
- F002: 009-diagnostic-review folder remains undocumented (.opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:166)
- F003: State directory resolved relative to plugin file (.opencode/plugins/mk-goal.js:25)
- F015: goal_plugin.md verification list is stale (.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:99)
- F016: AI-driven budget parsing has concrete non-trailing edge case (.opencode/commands/goal_opencode.md:63)
- F025: Phase 015 status inconsistent between spec and implementation summary (.opencode/specs/deep-loops/032-goal-opencode-plugin/015-packet-hygiene-and-narrative-integrity/spec.md:52)
- F026: Parent phase map does not reflect phase 015 completion (.opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:186)
- F028: speckit-goal-offer-contract test not matched by documented glob (.opencode/plugins/tests/:1)
- F029: Verification commands use per-file node invocation (.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:99)
- F032: Command output contract summary omits show from ACTION list (.opencode/commands/goal_opencode.md:30)
- F034: goal_plugin.md output field table omits emitted fields (.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:64)
- F035: goal_opencode.md output summary omits mutation= field (.opencode/commands/goal_opencode.md:49)
- F037: maxAutoTurns clamping to env value is undocumented (.opencode/plugins/mk-goal.js:2015)
### Security hardening
- F004: appendGoalJsonl swallows all errors silently (.opencode/plugins/mk-goal.js:696)
- F005: redactEvidence misses common secret formats (.opencode/plugins/mk-goal.js:380)
- F006: role marker sanitizer only handles colon delimiter (.opencode/plugins/mk-goal.js:339)
- F007: sweepOrphanedActiveStates swallows all errors (.opencode/plugins/mk-goal.js:1231)
- F011: goal-events.log grows unbounded under DEBUG (.opencode/plugins/mk-goal.js:735)
### Maintainability and polish
- F012: executeGoalAction default show action is dead code (.opencode/plugins/mk-goal.js:2391)
- F013: Duplicate budget-prefixed aliases remain in final status output (.opencode/plugins/mk-goal.js:2327)
- F014: executeGoalStatus lacks includeInjectionPreview option (.opencode/plugins/mk-goal.js:2441)
- F017: GOAL_ACTIONS includes later-phase verbs without provenance (.opencode/plugins/mk-goal.js:156)
- F018: session.idle handler calls continuation with missing sessionID (.opencode/plugins/mk-goal.js:2541)
- F019: recoverProviderUsageLimitIfDue does not recover budget_limited goals (.opencode/plugins/mk-goal.js:1520)
- F020: retryAfterDeadlineFromValue misinterprets large second values (.opencode/plugins/mk-goal.js:867)
- F021: buildPromptAsyncOptions uses statSync in async path (.opencode/plugins/mk-goal.js:2034)
- F027: __test seam list is duplicated (.opencode/plugins/tests/mk-goal-export-contract.test.cjs:28)
- F030: GoalError codes are string literals without centralized enum (.opencode/plugins/mk-goal.js:166)
- F031: Command budget parsing only handles trailing --budget N (.opencode/commands/goal_opencode.md:63)
- F033: Failure envelope normalizes unknown action to show (.opencode/plugins/mk-goal.js:2380)
- F036: PROMPT_OVERHEAD_CHARS magic constant lacks derivation (.opencode/plugins/mk-goal.js:38)

## 5. Spec Seed
- Clarify in the parent spec whether phases 015 and 016 are Complete or Planned.
- Add `009-diagnostic-review` to the phase map or remove/archive the folder.
- Update the original `/goal` command scope claim to include the additional verbs shipped in phase 020.
- Document the state-directory resolution policy explicitly (absolute path vs plugin-relative).

## 6. Plan Seed
1. **Close the continuation race (F009):** Replace the check-then-act lock in `maybeContinueGoal` with atomic check-and-set or queue-based serialization.
2. **Route sweep through the mutation queue (F010):** Move the sweep decision into the per-session mutation queue to prevent archived-goal resurrection.
3. **Reconcile phase 016 checklist (F008):** Either land the missing F2/F3 fixes or revert the checklist marks and update the phase spec status.
4. **Reconcile phase 015/016 status metadata (F025, F026, F008):** Align spec.md, implementation-summary.md, and parent phase map.
5. **Harden logging and redaction (F004, F005, F006, F007, F011):** Surface non-fatal log errors, expand secret patterns, handle non-colon role delimiters, and bound debug logs.
6. **Polish docs and output fields (F013, F014, F015, F029, F031, F032, F034, F035, F037):** Remove duplicate aliases, document omitted fields, and update verification commands.

## 7. Traceability Status
| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| spec_code | core | partial | Original command scope and state-dir path drift (F001, F003); status metadata drift (F025, F026) |
| checklist_evidence | core | fail | Phase 016 checklist overclaims F2/F3 completion (F008) |
| feature_catalog_code | overlay | pass | Feature catalog verbs align with shipped command |
| playbook_capability | overlay | pending | Not exercised in this review |

## 8. Deferred Items
- P2 advisories listed above may be deferred individually if risk is accepted.
- Playbook capability audit was not executed and is left as follow-up.
- Resource-map coverage gate was skipped because `resource-map.md` is absent at the spec-folder root.

## 9. Audit Appendix
### Iteration summary
| Iteration | Dimension | Status | Verdict | New (P0/P1/P2) | Ratio |
|-----------|-----------|--------|---------|----------------|-------|
| 001 | correctness | complete | PASS | 0/0/3 | 1.00 |
| 002 | security | complete | PASS | 0/0/4 | 1.00 |
| 003 | traceability | complete | CONDITIONAL | 0/3/1 | 0.88 |
| 004 | maintainability | complete | CONDITIONAL | 0/0/6 | 0.35 |
| 005 | correctness | complete | CONDITIONAL | 0/0/4 | 0.20 |
| 006 | security | complete | CONDITIONAL | 0/0/3 | 0.13 |
| 007 | traceability | complete | CONDITIONAL | 0/0/2 | 0.08 |
| 008 | maintainability | complete | CONDITIONAL | 0/0/4 | 0.13 |
| 009 | correctness | complete | CONDITIONAL | 0/0/3 | 0.09 |
| 010 | maintainability | complete | CONDITIONAL | 0/0/4 | 0.11 |

### Convergence
- Stop policy: max-iterations
- Final iteration: 10
- Convergence was treated as telemetry only before iteration 10 per the execution parameters.
- One `stop_decision` event was emitted after iteration 008 because composite convergence signals (rolling average below threshold and full dimension coverage with stabilization) voted STOP. The decision was overridden by the `max-iterations` policy, so the loop continued to iteration 010.
- No `blocked_stop` events were emitted (all legal-stop gates that were evaluated passed; the only override was the explicit max-iterations policy).

### Executor note
- Review executed directly by the orchestrator model using native Read/Grep/Glob tools.
- The configured `cli-opencode model=kimi-for-coding/k2p7` executor was not available; fallback is recorded in each JSONL record.

### Verification sample
- `node .opencode/plugins/tests/mk-goal-state.test.cjs` passed 21/21 before review synthesis.
