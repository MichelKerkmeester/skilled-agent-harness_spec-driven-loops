---
title: "Deep Review Strategy — Goal Unification Build"
trigger_phrases: []
---
# Deep Review Strategy — Goal Unification Build

## 1. TOPIC

Independent review of the goal unification build (packet `goal.md` as the single goal source across runtimes) that phase 007 verifies: the shared slice module and its frontmatter boundary, packet binding and path resolution, the resend hash and reminder paths, the locked packet log, the OpenCode plugin's parallel implementation, the TypeScript validator's goal budget and binding rules, the per-runtime command surfaces, and the always-on posture wording.

## 2. REVIEW CHARTER

- Target: `specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification` (`spec-folder`)
- Review surface: per `review/review-scope.md`, the goal-unification build the phase verifies, with every finding citing `file:line` and naming the decision it bears on
- Execution: autonomous detached lineage, executor `cli-pi`, model `deepseek-v4.1-flash`, inline execution (no nested dispatch)
- Artifact root: `specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review`
- Findings only: P0/P1/P2; no fixes; no files changed outside this lineage directory
- Resource Map Coverage: review-generated `resource-map.md` emitted at synthesis (absent at initialization)

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

## 4. NON-GOALS

- No changes to goal hooks, plugin, validator, commands, docs, or any file outside this lineage directory.
- No re-execution of the phase-007 verification sweep; the phase's tasks are read as evidence, not run.
- No review of unrelated v4 surfaces except where a goal claim depends on them.

## 5. STOP CONDITIONS

- Ran exactly three iterations; convergence before iteration 3 is telemetry only.
- Stop reason: `maxIterationsReached` after iteration 3, with active findings remaining.

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 5
- P2 (Suggestions): 10
- Resolved: 0

<!-- /ANCHOR:running-findings -->

## 7. WHAT WORKED

- The three-attempt breadth plan (correctness → security → traceability/maintainability) surfaced distinct bug classes each iteration with no repeats.
- Every load-bearing claim was verified at a named line; two findings (F001, F005) were reproduced end-to-end through the shipped module and CLI before reporting.

## 8. WHAT FAILED

- Attempting to complete the symlink escape check through the CLI with an unsupported `--state-dir` flag failed with `PACKET_GOAL_NOT_FOUND` before the environment-variable override was used; corrected with `OPENCODE_GOAL_STATE_DIR`.

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### AGENTS.md posture block: ruled out; the block is present at `AGENTS.md:311-317` with the no-halt sentence at `:315`, and the Quick Reference row at `:483`. [SOURCE: AGENTS.md:311] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: AGENTS.md posture block: ruled out; the block is present at `AGENTS.md:311-317` with the no-halt sentence at `:315`, and the Quick Reference row at `:483`. [SOURCE: AGENTS.md:311]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: AGENTS.md posture block: ruled out; the block is present at `AGENTS.md:311-317` with the no-halt sentence at `:315`, and the Quick Reference row at `:483`. [SOURCE: AGENTS.md:311]

### Assuming 005's narrower reminder sentence satisfies ADR-004: the ADR and README are the texts a follow-on run reads first, and neither excludes OpenCode. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Assuming 005's narrower reminder sentence satisfies ADR-004: the ADR and README are the texts a follow-on run reads first, and neither excludes OpenCode.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming 005's narrower reminder sentence satisfies ADR-004: the ADR and README are the texts a follow-on run reads first, and neither excludes OpenCode.

### Assuming the byte-for-byte render claim is test-enforced: no cross-implementation test exists, so the claim is human-maintained. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Assuming the byte-for-byte render claim is test-enforced: no cross-implementation test exists, so the claim is human-maintained.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming the byte-for-byte render claim is test-enforced: no cross-implementation test exists, so the claim is human-maintained.

### Bind/resent/packet CLI envelope behavior: ruled out; `goal-core.test.cjs:841-862` pins bind, resent, log, unbind and the session-free packet read. [SOURCE: .opencode/hooks/goal/lib/goal-core.test.cjs:841] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Bind/resent/packet CLI envelope behavior: ruled out; `goal-core.test.cjs:841-862` pins bind, resent, log, unbind and the session-free packet read. [SOURCE: .opencode/hooks/goal/lib/goal-core.test.cjs:841]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Bind/resent/packet CLI envelope behavior: ruled out; `goal-core.test.cjs:841-862` pins bind, resent, log, unbind and the session-free packet read. [SOURCE: .opencode/hooks/goal/lib/goal-core.test.cjs:841]

### Bound record with a missing document: ruled out; both render paths return empty, pinned by `goal-core.test.cjs:788`. [SOURCE: .opencode/hooks/goal/lib/goal-core.test.cjs:788] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Bound record with a missing document: ruled out; both render paths return empty, pinned by `goal-core.test.cjs:788`. [SOURCE: .opencode/hooks/goal/lib/goal-core.test.cjs:788]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Bound record with a missing document: ruled out; both render paths return empty, pinned by `goal-core.test.cjs:788`. [SOURCE: .opencode/hooks/goal/lib/goal-core.test.cjs:788]

### Budget arithmetic inconsistency: ruled out; preview keeps `floor(4800*0.12)=576` characters (`goal-core.cjs:374-377`), the prompt objective budget is `max(240, min(1200, 4000-1900)) = 1200` (`:344-349`), and the objective slice is pointer-first (`goal-slice.cjs:93-105`). [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:344] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Budget arithmetic inconsistency: ruled out; preview keeps `floor(4800*0.12)=576` characters (`goal-core.cjs:374-377`), the prompt objective budget is `max(240, min(1200, 4000-1900)) = 1200` (`:344-349`), and the objective slice is pointer-first (`goal-slice.cjs:93-105`). [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:344]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Budget arithmetic inconsistency: ruled out; preview keeps `floor(4800*0.12)=576` characters (`goal-core.cjs:374-377`), the prompt objective budget is `max(240, min(1200, 4000-1900)) = 1200` (`:344-349`), and the objective slice is pointer-first (`goal-slice.cjs:93-105`). [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:344]

### Devin adapter wiring: ruled out; both `SessionStart` and `UserPromptSubmit` invoke `goal-inject.mjs` (`.devin/hooks.v1.json:33,55`) and `README.md:74` documents the injection-only fallback ADR-005 authorized. [SOURCE: .devin/hooks.v1.json:33] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Devin adapter wiring: ruled out; both `SessionStart` and `UserPromptSubmit` invoke `goal-inject.mjs` (`.devin/hooks.v1.json:33,55`) and `README.md:74` documents the injection-only fallback ADR-005 authorized. [SOURCE: .devin/hooks.v1.json:33]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Devin adapter wiring: ruled out; both `SessionStart` and `UserPromptSubmit` invoke `goal-inject.mjs` (`.devin/hooks.v1.json:33,55`) and `README.md:74` documents the injection-only fallback ADR-005 authorized. [SOURCE: .devin/hooks.v1.json:33]

### Expecting the plugin's record replacement to preserve the pointer: `buildNewGoal` starts from an empty record by construction. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Expecting the plugin's record replacement to preserve the pointer: `buildNewGoal` starts from an empty record by construction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Expecting the plugin's record replacement to preserve the pointer: `buildNewGoal` starts from an empty record by construction.

### Happy-path frontmatter leak: ruled out; `goal-slice.test.cjs:66-70` and the plugin test both assert no `SECRET` on a well-formed fence. [SOURCE: .opencode/hooks/goal/lib/goal-slice.test.cjs:66] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Happy-path frontmatter leak: ruled out; `goal-slice.test.cjs:66-70` and the plugin test both assert no `SECRET` on a well-formed fence. [SOURCE: .opencode/hooks/goal/lib/goal-slice.test.cjs:66]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Happy-path frontmatter leak: ruled out; `goal-slice.test.cjs:66-70` and the plugin test both assert no `SECRET` on a well-formed fence. [SOURCE: .opencode/hooks/goal/lib/goal-slice.test.cjs:66]

### Lexical path escape: ruled out; `../outside`, absolute and empty targets are refused (`goal-slice.cjs:132-136`; test `goal-core.test.cjs:795`). [SOURCE: .opencode/hooks/goal/lib/goal-slice.cjs:132] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Lexical path escape: ruled out; `../outside`, absolute and empty targets are refused (`goal-slice.cjs:132-136`; test `goal-core.test.cjs:795`). [SOURCE: .opencode/hooks/goal/lib/goal-slice.cjs:132]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lexical path escape: ruled out; `../outside`, absolute and empty targets are refused (`goal-slice.cjs:132-136`; test `goal-core.test.cjs:795`). [SOURCE: .opencode/hooks/goal/lib/goal-slice.cjs:132]

### Log-row injection altering the durable slice: ruled out; `sanitizeInlineText` collapses newlines and the handler refuses any write whose durable hash changed (`goal-core.cjs:1038-1041,1069`), pinned by `goal-core.test.cjs:814`. [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:1069] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Log-row injection altering the durable slice: ruled out; `sanitizeInlineText` collapses newlines and the handler refuses any write whose durable hash changed (`goal-core.cjs:1038-1041,1069`), pinned by `goal-core.test.cjs:814`. [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:1069]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Log-row injection altering the durable slice: ruled out; `sanitizeInlineText` collapses newlines and the handler refuses any write whose durable hash changed (`goal-core.cjs:1038-1041,1069`), pinned by `goal-core.test.cjs:814`. [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:1069]

### Resend hash stability: ruled out; a log append and a reflow do not change the hash while a criterion change does (`goal-core.test.cjs:801`). [SOURCE: .opencode/hooks/goal/lib/goal-core.test.cjs:801] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Resend hash stability: ruled out; a log append and a reflow do not change the hash while a criterion change does (`goal-core.test.cjs:801`). [SOURCE: .opencode/hooks/goal/lib/goal-core.test.cjs:801]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Resend hash stability: ruled out; a log append and a reflow do not change the hash while a criterion change does (`goal-core.test.cjs:801`). [SOURCE: .opencode/hooks/goal/lib/goal-core.test.cjs:801]

### Resume surfaces are read-only: ruled out as a defect; `resume-auto`/`resume-confirm` never call `opencode_goal`, never bind, and carry the `never_halts` line (`:45-48`). [SOURCE: .opencode/commands/speckit/assets/speckit-resume-auto.yaml:45] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Resume surfaces are read-only: ruled out as a defect; `resume-auto`/`resume-confirm` never call `opencode_goal`, never bind, and carry the `never_halts` line (`:45-48`). [SOURCE: .opencode/commands/speckit/assets/speckit-resume-auto.yaml:45]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Resume surfaces are read-only: ruled out as a defect; `resume-auto`/`resume-confirm` never call `opencode_goal`, never bind, and carry the `never_halts` line (`:45-48`). [SOURCE: .opencode/commands/speckit/assets/speckit-resume-auto.yaml:45]

### Speckit goal-step wiring: ruled out; plan/implement/complete expose `goal_prompt_choice` plus the per-runtime `packet_goal.bind_by_runtime` invocation and the durable-hash resend trigger (`speckit-plan.yaml:177-192`). [SOURCE: .opencode/commands/speckit/assets/speckit-plan.yaml:177] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Speckit goal-step wiring: ruled out; plan/implement/complete expose `goal_prompt_choice` plus the per-runtime `packet_goal.bind_by_runtime` invocation and the durable-hash resend trigger (`speckit-plan.yaml:177-192`). [SOURCE: .opencode/commands/speckit/assets/speckit-plan.yaml:177]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Speckit goal-step wiring: ruled out; plan/implement/complete expose `goal_prompt_choice` plus the per-runtime `packet_goal.bind_by_runtime` invocation and the durable-hash resend trigger (`speckit-plan.yaml:177-192`). [SOURCE: .opencode/commands/speckit/assets/speckit-plan.yaml:177]

### State-file atomicity and modes: ruled out for this review; temp+fsync+rename with 0600/0700 documented and unchanged. [SOURCE: .opencode/hooks/goal/README.md:52] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: State-file atomicity and modes: ruled out for this review; temp+fsync+rename with 0600/0700 documented and unchanged. [SOURCE: .opencode/hooks/goal/README.md:52]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: State-file atomicity and modes: ruled out for this review; temp+fsync+rename with 0600/0700 documented and unchanged. [SOURCE: .opencode/hooks/goal/README.md:52]

### Treating the ADR fallback sentence as a stale research note: it is in the frozen decision text and in README:37, so it will be read as binding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the ADR fallback sentence as a stale research note: it is in the frozen decision text and in README:37, so it will be read as binding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the ADR fallback sentence as a stale research note: it is in the frozen decision text and in README:37, so it will be read as binding.

### Treating the per-packet lock as sufficient without naming the state-dir precondition: the lock name is packet-scoped but its directory is not. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the per-packet lock as sufficient without naming the state-dir precondition: the lock name is packet-scoped but its directory is not.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the per-packet lock as sufficient without naming the state-dir precondition: the lock name is packet-scoped but its directory is not.

### Treating the regex difference as cosmetic: the divergence is the leak mechanism, not a style difference. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the regex difference as cosmetic: the divergence is the leak mechanism, not a style difference.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the regex difference as cosmetic: the divergence is the leak mechanism, not a style difference.

### Validator budget and binding rule presence: ruled out; warn/error tiers and the binding-row existence check are implemented (`spec-doc-structure.ts:1041-1076`) and tested (`spec-doc-structure.vitest.ts:314-354`). [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1045] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Validator budget and binding rule presence: ruled out; warn/error tiers and the binding-row existence check are implemented (`spec-doc-structure.ts:1041-1076`) and tested (`spec-doc-structure.vitest.ts:314-354`). [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1045]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Validator budget and binding rule presence: ruled out; warn/error tiers and the binding-row existence check are implemented (`spec-doc-structure.ts:1041-1076`) and tested (`spec-doc-structure.vitest.ts:314-354`). [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1045]

<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Budget arithmetic inconsistency (iteration 1).
- Validator goal-budget and binding-rule absence (iteration 1).
- Happy-path frontmatter leak (iteration 1).
- Log row injection altering the durable slice (iteration 2).
- Lexical path escape (iteration 2).
- Resend hash instability (iteration 2).
- Devin adapter wiring absence (iteration 3).
- AGENTS.md posture block absence (iteration 3).
- Resume surfaces mutating goals (iteration 3).
- Speckit goal-step wiring absence (iteration 3).

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Maximum iteration count reached; synthesize the active findings and remediation workstreams without changing reviewed sources. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `goal-slice.cjs`/`goal-core.cjs`/`bin/goal.cjs`; pi, cursor and devin adapters; `.opencode/plugins/opencode-goal.js`; `spec-doc-structure.ts` and `continuity-freshness.ts`; `goal.md.tmpl`, `spec-kit-docs.json`, `goal-set-string-playbook.md`; speckit plan/implement/complete/resume yamls; `/goal-opencode` and `/goal-cursor`; `AGENTS.md` section 4.
- Decision record: eight Accepted ADRs (2026-09-11) fix the packet pointer, the demoted store, the shared extractor, the hash-triggered reminder, per-runtime surfaces, the two-tier budget plus set-time check, reconciliation with 009, and the posture block's home.
- Behavior claims: frontmatter never leaves the file; a bound and missing document injects nothing; the reminder rides the injection path; a durable change resends the stripped slice; work never stops for an unset goal.
- Risk areas: regex boundaries between the validator and the runtime extractor; silent truncation at the 4000-character cap; workspace resolution differences between the plugin and core; the OpenCode plugin's narrower action set and absent reminder; changelog and 009 requirement rows that predate the Devin resurrection.
- Context gap: the phase-007 packet is still a scaffold (tasks unchecked, `Status: Draft`, no verification evidence), so the review reads the build the phase verifies rather than the phase's own claims.

## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 3 | Four frozen-ADR contradictions: F002 (pointer-less render), F003 (set-time check), F005 (workspace escape), F010 (reminder path). |
| `checklist_evidence` | core | partial | 3 | Phase 007 is a scaffold; no completion claim, no verification evidence yet. |
| `skill_agent` | overlay | notApplicable | — | Spec-folder target. |
| `agent_cross_runtime` | overlay | fail | 3 | OpenCode diverges on actions (F007), workspace normalization (F013) and reminder (F010); Cursor hint mismatches its contract (F015). |
| `feature_catalog_code` | overlay | partial | 3 | Feature catalog updated; 009 REQ-010 stale (F012). |
| `playbook_capability` | overlay | partial | 3 | Playbook/template/manifest numbers align; runtime enforcement missing (F003). |

## 15. FILES UNDER REVIEW

| File or group | Dimensions Reviewed | Last Iteration | Findings | Status |
|---------------|---------------------|----------------|----------|--------|
| `lib/goal-slice.cjs` | correctness, security | 2 | F001, F005 | reviewed |
| `lib/goal-core.cjs` | correctness, security | 2 | F002, F003, F006, F008, F009 | reviewed |
| `bin/goal.cjs` | security | 2 | F005 | reviewed |
| pi/cursor/devin adapters | traceability | 3 | F010 | reviewed |
| `.opencode/plugins/opencode-goal.js` | correctness, security, traceability | 3 | F004, F007, F008, F009, F010, F013, F014 | reviewed |
| `spec-doc-structure.ts`, `level-contract-resolver.ts` | correctness | 1 | — | reviewed |
| `goal.md.tmpl`, `spec-kit-docs.json`, playbook | traceability | 3 | F003 | reviewed |
| speckit plan/implement/complete/resume yamls, goal commands | traceability | 3 | F007, F015 | reviewed |
| `AGENTS.md` posture block and Quick Reference row | traceability | 3 | — | reviewed |
| 004/005/006 implementation summaries, changelog, 009 REQ-010 | traceability | 3 | F002, F010, F011, F012 | reviewed |

## 16. REVIEW BOUNDARIES

- Max iterations: 3
- Stop policy: max-iterations
- Convergence threshold: 0.05 (telemetry only before the cap)
- No-progress threshold: 0.05
- Severity threshold: P2
- Session lineage: `sessionId=fanout-deepseek-review-1789117367422-11rap2`, `parentSessionId=null`, `generation=1`, `lineageMode=auto`
- Started: 2026-09-11T09:03:00Z
- Stopped: 2026-09-11T09:23:00Z (`maxIterationsReached`)

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
