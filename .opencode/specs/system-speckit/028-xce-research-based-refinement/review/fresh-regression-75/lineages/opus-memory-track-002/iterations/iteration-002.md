# Seat opus-memory-track-002 — iteration 2 (global #31)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-memory-track-002
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=1

## Analysis

I've traced the complete flag-off path. Here is my analysis.

## Review: feedback retention reducer — flag-off mutation safety

**Slice traced:** `feedback-retention-reducer.ts` (the `SPECKIT_FEEDBACK_RETENTION_*` reducer — the default-off, shadow-first feedback aggregator/reducer matching this seat), its gate functions, the shared aggregator `batch-learning.ts::aggregateEvents`, and the sole integration point `memory-retention-sweep.ts::runMemoryRetentionSweep`, plus all callers and the regression tests.

### Core claim verified: flag-off cannot mutate live state

1. **Gate is correct and default-off.** `isFeedbackRetentionLearningEnabled` (`feedback-retention-reducer.ts:116-121`) returns `false` for an undefined env var (`raw !== undefined && TRUE_VALUES.has(raw)`). Default = OFF. `resolveFeedbackRetentionMode:123-129` defaults to `shadow`.

2. **Single gated entry point.** `grep` confirms `evaluateFeedbackRetention` / `recordFeedbackRetentionAudit` / `aggregateEvents` have **no caller** outside the gated sweep, `batch-learning.ts`, and tests. The reducer is reachable only via `runMemoryRetentionSweep`.

3. **Flag-off fully bypasses the reducer.** `memory-retention-sweep.ts:439-441` sets `feedbackRetention = isFeedbackRetentionLearningEnabled() ? buildFeedbackRetentionReport(...) : null`. When OFF, `feedbackRetention` is `null`, so every feedback branch in the delete transaction (`:507-540`, the `UPDATE memory_index ... = NULL` protect / `UPDATE ... delete_after` extend / feedback audit writes) is skipped. No `aggregateEvents` call ⇒ no `initBatchLearning` DDL either. The only deletions are the pre-existing baseline TTL path, which is unchanged.

4. **Tests confirm.** `memory-retention-feedback-learning.vitest.ts:98-118` ("default-off") runs with mode forced to `active` but the master flag unset, and asserts `feedbackRetention` absent from the result, `auditRows == []`, and only baseline behavior (constitutional row protected by the tier check, normal expired row deleted). Shadow path (`:141-169`) and active-without-gate (`:171-188`) both assert `swept:0` and `applied:false`. Active mutation requires master-flag ON + mode=active + caller-supplied `shadowEvaluationPassed` — three gates, two operator-controlled env flags.

The shadow/active gating, dry-run no-write path, and protect/extend handling all match the spec (`004-retention-reducer/spec.md` §3-§7) and the manual playbook. **The seat's central safety property holds.**

### One minor traceability mismatch (P2)

The manual playbook (`feedback-retention-learning-modes.md:20`, `:47`) states "Off mode is inert" / **"Off mode writes no audit or retention state,"** and step 3 (`:38`) instructs the operator to "capture zero retention mutations." But in off mode the baseline sweep still **deletes** expired non-protected rows — the regression test for exactly this scenario asserts `swept: 1, deletedIds: [1]` (`memory-retention-feedback-learning.vitest.ts:109`). "Inert" correctly scopes to the *feedback reducer*, but the literal wording plus a fixture seeded with expired rows could lead an operator to record a false failure when baseline deletion occurs. Code is correct; this is doc precision only.

No P0/P1 found. The implementation faithfully implements default-off, shadow-first safety.

```json
{"seat":"opus-memory-track-002","model":"claude-opus-4-8","angle":"Feedback aggregator reducer (default-off, shadow-first): verify it cannot mutate live state when the flag is off.","verdict":"PASS","summary":"Flag-off path fully bypasses the reducer; only gated sweep invokes it, default-off confirmed in code+tests. No live mutation when off. One P2 doc-wording nit.","files_reviewed":[".opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-retention-reducer.ts",".opencode/skills/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts",".opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts",".opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts",".opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts",".opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-feedback-learning.vitest.ts",".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers/004-retention-reducer/spec.md",".opencode/skills/system-spec-kit/manual_testing_playbook/feature-flag-reference/feedback-retention-learning-modes.md"],"findings":[{"severity":"P2","dimension":"traceability","title":"Playbook 'off mode writes no retention state' contradicts baseline-delete behavior","file":".opencode/skills/system-spec-kit/manual_testing_playbook/feature-flag-reference/feedback-retention-learning-modes.md:20","evidence":"Doc says 'Off mode is inert' / 'Off mode writes no audit or retention state' and step 3 says 'capture zero retention mutations'; but the off-mode regression test asserts swept:1, deletedIds:[1] (memory-retention-feedback-learning.vitest.ts:109) — baseline TTL deletion still runs when the master flag is off.","why":"'Inert' is true only for the feedback reducer, not the whole sweep. An operator seeding expired rows and following step 3 verbatim would observe baseline deletion and could record a false test failure.","recommendation":"Reword to 'Off mode runs no feedback-driven audit or retention decisions; the baseline TTL sweep still deletes expired non-protected rows' and adjust step 3 to expect baseline deletion."}]}
```
