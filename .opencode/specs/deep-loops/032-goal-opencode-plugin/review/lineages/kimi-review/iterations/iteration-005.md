# Iteration 005: Correctness — Edge Cases / Error Handling

## Focus
- Dimension: correctness
- Files reviewed: `.opencode/plugins/mk-goal.js`
- Scope: Review error-handling paths, retry logic, and edge cases that could produce incorrect behavior.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 1
- New findings: P0=0 P1=0 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.20 (4 P2 * 1 = 4; cumulative weighted = 21; 4/21)

## Findings

### P2, Suggestion
- **F018**: `session.idle` handler calls continuation with a missing session ID, `.opencode/plugins/mk-goal.js:2541-2548`. When `sessionID` is falsy, the branch still invokes `maybeContinueGoal(null, ...)`, which immediately returns `suppressed` with reason `missing_session_id`. The log line implies a session was expected but absent; the branch is effectively a no-op that creates misleading telemetry.
- **F019**: `recoverProviderUsageLimitIfDue` cannot recover a `budget_limited` goal, `.opencode/plugins/mk-goal.js:1520-1527`. It only resumes goals whose status is `usage_limited`. If the user later increases the token budget or otherwise wants to resume, a `budget_limited` goal remains terminal until manually reset.
- **F020**: `retryAfterDeadlineFromValue` misinterprets large second values as absolute timestamps, `.opencode/plugins/mk-goal.js:867-878`. The function treats any numeric value greater than `1000000000000` as an absolute millisecond timestamp. A `Retry-After` value of ~31.7 years in seconds would cross this threshold and be interpreted as an epoch ms value around the year 33658, causing incorrect recovery timing.
- **F021**: `buildPromptAsyncOptions` uses synchronous `statSync` inside an async path, `.opencode/plugins/mk-goal.js:2034-2056`. The function is async and called from `maybeContinueGoal`, yet it performs a blocking filesystem stat. Under load this stalls the event loop for continuation dispatch.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | goal_plugin.md:39-44 vs mk-goal.js:1520-1527 | Resume contract only covers paused/usage_limited, so budget_limited omission is consistent with current docs but an edge-case gap |
| checklist_evidence | pass | hard | - | No checklist checked |
| feature_catalog_code | pass | advisory | - | No drift |
| playbook_capability | pending | advisory | - | Not exercised |

## Assessment
- New findings ratio: 0.20
- Dimensions addressed: [correctness]
- Novelty justification: Four new P2 edge-case findings. No P0/P1.

## Ruled Out
- Provider usage-limit recovery for 429 responses is correctly implemented.
- Token budget crossing uses inclusive comparison (`>=`), matching the spec intent.

## Dead Ends
- Searching for unhandled promise rejections in event handlers found explicit try/catch wrappers.

## Recommended Next Focus
Security (lifecycle / autonomy safety): inspect continuation gates, kill switch, and auto-turn/wall-clock caps.

Review verdict: PASS
