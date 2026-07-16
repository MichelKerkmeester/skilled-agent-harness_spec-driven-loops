DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `opencode run`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 9 of 15
Questions: 0/5 answered | Last focus: Examine mk-goal-*.test.cjs suite: command-namespace + code-tail (L1510-1676) coverage. Namespace untested; tail helper bodies covered but factory hooks (transform/event/tool-binding/error-swallow) not. New F-018..F-022.
Last 2 ratios: 0.74 -> 0.78 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: mk-spec-memory MCP unavailable in this Claude Code dispatch session; relying on strategy.md Known Context (archived prior design synthesis) as the standing prior-context surface.
Next focus: ## 11. NEXT FOCUS
(Carried) **F-018 deep-dive:** read `appendGoalBrief`/`renderGoalInjection` body to characterize the injection behavior and confirm F-015 (full goal_prompt embedded) + whether `options.enabled` gating + `maxInjectionChars` cap are honored.

Research Topic: Audit the shipped /goal OpenCode plugin implementation in packet system-deep-loop/032-goal-opencode-plugin (phases 001-state-store through 008-system-spec-kit-integration only; EXCLUDE phase 009-speckit-command-goal-prompt-offer, which is actively owned by a separate in-flight OpenCode session and must not be touched or read as in-scope). Investigate drift between what was planned (each phase's spec.md/plan.md/tasks.md, and the original design synthesis at research_archive/2026-06-28-goal-design-synthesis/research.md) and what was actually built (.opencode/plugins/mk-goal.js, .opencode/commands/opencode_goal.md, the mk-goal-*.test.cjs suite, .opencode/skills/system-spec-kit/references/hooks/goal_plugin.md), refinement needed, missing upgrades, and new additions required to make the /goal plugin feature-complete, fully integrated, low-friction UX, safely automated, and flawless.

ANTI-CONVERGENCE: do not stop early; target at least 10 proper iterations, each adding genuine novelty (new phase examined, new drift class, new UX gap, new automation/safety gap). Do not converge before iteration 10 unless every avenue is genuinely exhausted. Under convergence pressure before iteration 10, rotate to an unexamined phase/file/comparison axis instead of stopping.
Iteration: 9 of 15
Focus Area: ## 11. NEXT FOCUS
(Carried) **F-018 deep-dive:** read `appendGoalBrief`/`renderGoalInjection` body to characterize the injection behavior and confirm F-015 (full goal_prompt embedded) + whether `options.enabled` gating + `maxInjectionChars` cap are honored.
Remaining Key Questions: - [ ] For each phase 001-008, does the shipped code (`mk-goal.js`, `opencode_goal.md`, test suite, `goal_plugin.md`) match what that phase's `spec.md`/`plan.md`/`tasks.md` specified — where is the drift, and is it a regression, an intentional improvement, or an unresolved gap?
- [ ] Does the shipped implementation faithfully realize the 9 resolved design forks from the original design synthesis (autonomy tier, scope/keying, state store, budget governance, completion detection, status set, surfacing substitute, command style, reuse vs standalone)?
- [ ] What refinements, missing upgrades, or safety/automation gaps exist in the current `/goal` plugin that block it from being feature-complete and low-friction (UX rough edges, error handling, edge cases, race conditions)?
- [ ] Is the system-spec-kit integration (`goal_plugin.md` hook doc + any `_memory.continuity` / spec-folder wiring) complete, consistent, and low-friction — does it correctly interoperate with the rest of the plugin ecosystem (`mk-spec-memory.js` patterns, event hooks, session lifecycle)?
- [ ] What new additions — beyond anything originally planned — does the actual shipped code reveal are needed for the `/goal` plugin to be genuinely flawless (issues discoverable only by reading real code, not anticipated at design time)?
Carried-Forward Open Questions:
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- [ ] Read `plan.md`/`tasks.md`/`checklist.md` per phase to find task-level drift (spec-level only this iteration). (iteration 1)
- [ ] **F-004 follow-up:** Read `mk-goal.js` lines 1244+ to verify phase 002 injection (`renderGoalInjection`/`appendGoalBrief`/transform), phase 003 tool registration, and phase 004/006 `event()` wiring. (iteration 1)
- [ ] Examine the `mk-goal-*.test.cjs` suite to see whether tests cover the unverified tail and the flagged drifts. (iteration 1)
- [ ] Cross-check the 9 resolved design forks from `research_archive/2026-06-28-goal-design-synthesis/research.md` against shipped behavior (deferred to a dedicated iteration). (iteration 1)
- [ ] Verify phase 008 doc deliverables actually exist on disk (`goal_plugin.md`, catalog, playbook, `ENV_REFERENCE` `MK_GOAL_*`). (iteration 1)
- [ ] **F-003 follow-up:** Trace every `status:` write to confirm whether `usage_limited` is ever set in production paths (or is dead). (iteration 1)
- [ ] **F-001 follow-up:** Confirm whether `.opencode/commands/goal.md` coexists with `opencode_goal.md`, and determine the actual `/goal` invocation namespace + whether spec 003 needs amending. (iteration 1)
- [ ] (Carried) Per-phase plan.md/tasks.md drift for phases 001, 002, 004–008 (003 done this iteration). (iteration 2)
- [ ] **NEW:** Verify the exact opencode command-resolution rule for `opencode_goal.md` → resolved invocation string (confirm or refute `/opencode_goal`). (iteration 2)
- [ ] Do the `mk-goal-*.test.cjs` files exercise the command *namespace* at all, or only the `mk_goal`/`mk_goal_status` tool paths? (Likely the latter; the filename drift would not be caught by tool-path tests.) (iteration 2)
- [ ] (Carried) F-004: read `mk-goal.js` lines 1244+ (injection/transform/event wiring). (iteration 2)
- [ ] (Carried) Cross-check 9 resolved design forks (esp. "command style" + "reuse vs standalone") against shipped behavior. (iteration 2)
- [ ] **NEW:** Determine whether a built-in `/goal` command exists in opencode (collision check) — this decides Path A vs B. (iteration 2)
- [ ] Confirm the exact opencode command-resolution rule for `.opencode/commands/*.md` → invocation string (does `opencode_goal.md` → `/opencode_goal`?). Non-blocking for Path A; refines F-008. (iteration 3)
- [ ] (Carried) **F-004:** read `mk-goal.js` lines 1244+ (injection/transform/event wiring). (iteration 3)
- [ ] (Carried) Examine `mk-goal-*.test.cjs` suite — does it exercise the command *namespace* at all, and does it cover the unverified code tail? (iteration 3)
- [ ] (Carried) Cross-check the 9 resolved design forks against shipped behavior (fork #8 "command style = root /goal" is now *directly* implicated by F-007/F-008). (iteration 3)
- [ ] (Carried) Per-phase `plan.md`/`tasks.md` drift for phases 001, 002, 004–008 (003 done in iter 2). (iteration 3)
- [ ] **NEW:** Verify `ENV_REFERENCE.md` `MK_GOAL_*` env entries exist and are consistent with the code's env reads (e.g. `MK_GOAL_AUTONOMY`, `MK_GOAL_*` budget knobs). O-004 left this open. (iteration 4)
- [ ] (Carried) **F-004:** read `mk-goal.js` lines 1244+ — phase 002 injection (`renderGoalInjection`/`appendGoalBrief`/transform), phase 003 tool registration, phase 004/006 `event()` wiring. (iteration 4)
- [ ] (Carried) Cross-check the 9 resolved design forks against shipped behavior (fork #8 "command style = root /goal" is now directly implicated by F-005/F-007/F-008/F-009). (iteration 4)
- [ ] (Carried) **F-003:** trace `status:` writes — is `usage_limited` ever set in production paths, or dead? (iteration 4)
- [ ] (Carried) Examine `mk-goal-*.test.cjs` suite — does it exercise the command *namespace*, and does it cover the unverified code tail? (iteration 4)
- [ ] (Carried) Confirm the exact opencode command-resolution rule for `.opencode/commands/*.md` → invocation string (`opencode_goal.md` → `/opencode_goal`?). Refines F-008. (iteration 4)
- [ ] **NEW:** Run the phase-006 live `MK_GOAL_AUTONOMY=smoke` idle smoke (or formally downgrade the 006 completion metadata) to close F-010. (iteration 4)
- (Carried) Verify `ENV_REFERENCE.md` `MK_GOAL_*` entries vs the code's env reads (`MK_GOAL_AUTONOMY` confirmed in code at line 34; `MK_GOAL_DEBUG` referenced in impl summary; remaining budget knobs unverified). (iteration 5)
- (Carried) **F-004:** read `mk-goal.js` injection/transform wiring (`renderGoalInjection`/`appendGoalBrief`/`experimental.chat.system.transform`) — lines 1350+ now partially seen (transform at 1620, `__test` exports at 1658–1676 confirm `renderGoalInjection`/`maybeContinueGoal`/`maybeVerifyGoal` are the test seams); the 002 injection body still wants a dedicated read. (iteration 5)
- (Carried) **Cross-check the 9 resolved design forks** against shipped behavior — heavily carried since iter 1, still untouched; richest remaining novel axis. Fork #8 "command style = root /goal" is implicated by F-005/F-007/F-008/F-009; forks #1 (autonomy), #5 (completion detection), #6 (status set) are now well-evidenced by code reads and can be formally closed cheaply. (iteration 5)
- (Carried) Confirm the opencode command-resolution rule for `.opencode/commands/*.md` (`opencode_goal.md` → `/opencode_goal`?) — refines F-008. (iteration 5)
- (Carried) **F-003:** trace `status:` writes — is `usage_limited` ever set in production paths, or dead? (iteration 5)
- (Carried) **F-004:** dedicated read of `mk-goal.js` injection/transform wiring (`renderGoalInjection`/`appendGoalBrief`/`experimental.chat.system.transform`) — partially seen at L1350–1676 but not examined as a dedicated axis. (iteration 6)
- (Carried) **F-013:** `session.idle` → `maybeContinueGoal` autonomy-enabled seam has zero test coverage (iter 5). (iteration 6)
- **NEW:** Decide F-014 remediation direction (collapse vs wire) — needs a design decision, not research. (iteration 6)
- (Carried) **9 Resolved Design Forks cross-check** against shipped behavior — richest remaining novel axis; forks #1 (autonomy), #5 (completion detection), #6 (status set — now *almost* closable modulo F-014) are well-evidenced, but forks #2 (keying), #3 (state store atomicity), #4 (budget governance), #7 (surfacing), #9 (reuse) deserve a formal pass. (iteration 6)
- (Carried) Confirm opencode command-resolution rule for `.opencode/commands/*.md` (`opencode_goal.md` → `/opencode_goal`?) — refines F-008. (iteration 7)
- (Carried) **F-004 remainder:** dedicated read of `mk-goal.js` L1510–1676 — plugin factory hooks (`experimental.chat.system.transform`, `event`, `tool` registration), `mk_goal`/`mk_goal_status` tool schemas, `__test` export seams. (iteration 7)
- (Carried) **F-014:** decide remediation direction (collapse `usage_limited` enum vs wire the provider-cap detector) — design decision, not research. (iteration 7)
- (Carried) Examine `mk-goal-*.test.cjs` suite — does it exercise the command *namespace*, and does it cover the unverified code tail (L1510–1676)? (iteration 7)
- (Carried) **F-014:** collapse `usage_limited` enum vs wire provider-cap detector — design decision. (iteration 8)
- (Carried) **9 design forks formal pass** (iter 7 did 7/9; forks #2 keying, #3 store atomicity, #4 budget, #7 surfacing, #9 reuse deserve a formal close). (iteration 8)
- (Carried) Confirm opencode command-resolution rule for `.opencode/commands/*.md` → invocation string (refines F-008). (iteration 8)
- (Carried) **F-003:** is `usage_limited` ever set in production paths (dead code)? Continuation test sets `budget_limited`, never `usage_limited`. (iteration 8)
- (Carried) **F-013:** session.idle→maybeContinueGoal autonomy-enabled seam has zero coverage. (iteration 8)
- (Carried) **F-018 deep-dive:** read `appendGoalBrief`/`renderGoalInjection` body to characterize the injection behavior and confirm F-015 (full goal_prompt embedded) + whether `options.enabled` gating + `maxInjectionChars` cap are honored. (iteration 8)
Last 3 Iterations Summary: run 6: F-003: trace status: writes - is usage_limited ever set in production paths, or dead? (0.72) | run 7: 9 Resolved Design Forks cross-check vs shipped mk-goal.js: 7/9 realized (#1,#2,#3,#4,#5,#7-mostly,#9), #6 partial (usage_limited writer dead), #8 drift (command namespace /opencode_goal not /goal). New F-015 (injection embeds full goal_prompt), F-016 (fsyncDirectory swallows fsync errors), F-017 (mk_goal_status lacks store-health dimension). (0.74) | run 8: Examine mk-goal-*.test.cjs suite: command-namespace + code-tail (L1510-1676) coverage. Namespace untested; tail helper bodies covered but factory hooks (transform/event/tool-binding/error-swallow) not. New F-018..F-022. (0.78)

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/deep-research-config.json
- State Log: .opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/deep-research-strategy.md
- Registry: .opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/deep-research-findings-registry.json
- Write iteration narrative to: .opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/iterations/iteration-009.md
- Write per-iteration delta file to: .opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/deltas/iter-009.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/iterations/iteration-009.md` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored (the iteration will look incomplete and the reducer may re-run it). Required schema:

```json
{"type":"iteration","iteration":<n>,"mode":"research","target_agent":"deep-research","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=research target_agent=deep-research","newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */],"executor":{/* workflow-owned for non-native runs */}}
```

Append via single-line JSON with newline terminator — for example: `echo '<single-line-json>' >> .opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/deep-research-state.jsonl`. Do NOT pretty-print. Do NOT print the JSON to stdout only; it MUST land in the state log file.

For non-native CLI executors, the workflow owns executor provenance. It writes a pre-dispatch sentinel, then patches the first canonical `"type":"iteration"` record with the `executor` block before `post_dispatch_validate` runs. Do NOT append your own `dispatch_failure` event or a partial fallback record when the executor itself crashes or times out; the workflow emits the typed failure event on that path.

3. **Per-iteration delta file** at `.opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/deltas/iter-009.jsonl` (path pre-substituted for the current iteration — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per graphEvent, finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line. The reducer reads the combined state log + delta files to rebuild dashboards and registries after interruption or partial runs.

Example delta file contents (one iteration):
```json
{"type":"iteration","iteration":3,"mode":"research","target_agent":"deep-research","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=research target_agent=deep-research","newInfoRatio":0.62,"status":"insight","focus":"..."}
{"type":"finding","id":"f-iter003-001","severity":"P1","label":"...","iteration":3}
{"type":"invariant","id":"inv-iter003-001","label":"...","iteration":3}
{"type":"observation","id":"obs-iter003-001","packet":"007","classification":"real","iteration":3}
{"type":"edge","id":"e-iter003-001","relation":"VIOLATES","source":"obs-001","target":"inv-001","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).

## GRAPH EVENTS VOCABULARY (REQUIRED IF EMITTING graphEvents)

If you include `graphEvents`, every node `type` MUST have a `kind` field from this closed set: `QUESTION`, `FINDING`, `CLAIM`, `SOURCE`. Every edge `relation` MUST be one of: `ANSWERS`, `SUPPORTS`, `CONTRADICTS`, `SUPERSEDES`, `DERIVED_FROM`, `COVERS`, `CITES`. Any other kind/relation value is silently rejected by the coverage-graph upsert (nodes dropped, dependent edges fail a foreign-key check). Model drift/gap observations as `FINDING` nodes with a `CONTRADICTS` or `SUPPORTS` edge to the relevant `CLAIM` (the planned spec claim) rather than inventing new relation names. It is fine to omit graphEvents entirely if no clean mapping exists this iteration.
