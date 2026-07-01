---
title: Deep Review Iteration 002
description: Correctness pass B for goal-command and lifecycle-tracking surfaces.
---

# Deep Review Iteration 002

## Dimension

Correctness -- pass B: goal-command handlers and lifecycle tracking.

## Files Reviewed

| File | Lines | Notes |
|------|-------|-------|
| `.opencode/plugins/mk-goal.js` | 162-164, 177-212, 370-423, 548-565, 783-865, 879-986, 1402-1494, 1536-1644 | Tool action routing, lifecycle state transitions, usage accounting, evidence redaction, prompt blocker handling, plugin tool registration. |
| `.opencode/commands/opencode_goal.md` | 1-83 | Live command markdown and user-facing action contract. |
| `.opencode/commands/README.txt` | 38-51, 71-112 | Command filename-to-slash-command evidence; root commands are root markdown filenames. |
| `.opencode/commands/` | directory listing | Only `opencode_goal.md` exists; no `goal.md` command exists. |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/spec.md` | 71-74, 97-103, 128-137, 145-148 | Phase 003 command/tool acceptance claims. |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/plan.md` | 80-86, 96-104, 119-127 | Phase 003 routing and verification claims. |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/tasks.md` | 65-79 | Phase 003 completed task claims. |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/implementation-summary.md` | 53-61, 67-70, 96-102 | Phase 003 delivered surface and verification claims. |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/004-lifecycle-tracking/spec.md` | 94-102, 120-129, 137-139 | Lifecycle requirements and success criteria. |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/004-lifecycle-tracking/plan.md` | 77-83, 96-100, 113-121 | Lifecycle architecture, invariants, and verification plan. |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/004-lifecycle-tracking/tasks.md` | 63-76 | Lifecycle completed task claims. |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/004-lifecycle-tracking/implementation-summary.md` | 51-66, 90-98 | Lifecycle delivery and verification claims. |
| `.opencode/plugins/__tests__/mk-goal-state.test.cjs` | 70-83, 89-108, 174-180 | Goal tool set/show/status/clear and injection-preview coverage. |
| `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs` | 23-45 | Tool-context session resolution coverage. |
| `.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs` | 27-68, 70-115, 116-128, 130-166 | Lifecycle usage dedupe, budget transition, reset, unavailable usage, prompt blocking coverage. |
| `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` | 23-47 | Current runtime-specific command-name decision: OpenCode plugin is `/opencode_goal`, not bare `/goal`. |

## Findings by Severity

### P0

None.

### P1

#### DR-002-P1-001 [P1] Goal command docs/specs still advertise a bare `/goal` command after the live router was renamed to `/opencode_goal`

- **Claim:** The shipped command surface no longer matches the phase 003 command contract or the live command markdown. The only command file is `.opencode/commands/opencode_goal.md`, and current constitutional guidance says the OpenCode plugin is invoked as `/opencode_goal`, but the scoped command/spec/operator references still describe `.opencode/commands/goal.md` and bare `/goal` as the active plugin route.
- **Evidence refs:** `.opencode/commands/opencode_goal.md:7`, `.opencode/commands/opencode_goal.md:15`, `.opencode/commands/README.txt:38`, `.opencode/commands/README.txt:49`, `.opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/spec.md:71`, `.opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/spec.md:98`, `.opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/spec.md:113`, `.opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/implementation-summary.md:57`, `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md:35`, `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md:43`.
- **Counterevidence sought:** Checked `.opencode/commands/` and found only `opencode_goal.md`; no `goal.md` exists. Checked current runtime-specific constitutional rule and it explicitly says the command was renamed to `.opencode/commands/opencode_goal.md`, freeing bare `/goal` for Claude Code native goal prompting.
- **Alternative explanation:** The phase 003 docs may be historical snapshots from before the rename, and the implementation may intentionally keep the display heading `# /goal`. That explains why the mismatch exists, but it does not make the current user-facing command doc accurate because invoking bare `/goal` is now explicitly the wrong route for the OpenCode plugin.
- **Final severity:** P1.
- **Confidence:** 0.91.
- **Downgrade trigger:** Downgrade to P2 if the OpenCode runtime has an alias mapping that makes `.opencode/commands/opencode_goal.md` invokable as bare `/goal` while preserving Claude Code native `/goal`; no such alias was found in the scoped files reviewed.
- **Finding class:** spec mismatch / cross-consumer command surface.
- **Scope proof:** `Glob .opencode/commands/*goal*.md` returned only `.opencode/commands/opencode_goal.md`; exact search found repeated `.opencode/commands/goal.md` and `/goal` claims in scoped phase docs and operator references.
- **Recommendation:** Update the live command markdown and phase 003/004-adjacent references to consistently name `/opencode_goal` and `.opencode/commands/opencode_goal.md`, or add and document a real compatibility alias if bare `/goal` is intentionally supported in OpenCode without conflicting with Claude Code.

### P2

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Phase 003 tool contracts match `executeGoalAction`, `executeGoalStatus`, and plugin tool registration in `.opencode/plugins/mk-goal.js:1454-1494` and `.opencode/plugins/mk-goal.js:1625-1644`, but the command-file/name claim is stale (`DR-002-P1-001`). Phase 004 lifecycle claims match the implementation paths reviewed in `.opencode/plugins/mk-goal.js:912-986` and `.opencode/plugins/mk-goal.js:1536-1608`. |
| `checklist_evidence` | notApplicable | Phase 003 and 004 are Level 1 phase packets without `checklist.md`; tasks and implementation-summary evidence were reviewed instead. |
| `feature_catalog_code` | deferred | Overlay catalog/playbook paths were not in this pass B scope except for current constitutional command-name rule. |
| `agent_cross_runtime` | partial | Runtime-specific command split was checked through `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md:23-47`. |

## Ruled Out

- Goal tool action routing mismatch: `executeGoalAction` handles set, clear, complete, pause, and show; `executeGoalStatus` reads status; tool registration exposes `mk_goal` and `mk_goal_status` with matching schemas. Evidence: `.opencode/plugins/mk-goal.js:1454-1494`, `.opencode/plugins/mk-goal.js:1625-1644`.
- Lifecycle usage-accounting mismatch: `recordMessageUpdated` refreshes evidence, extracts usage, accounts only while the current goal is active, dedupes by message id, and transitions to `budget_limited` at the token cap. Evidence: `.opencode/plugins/mk-goal.js:912-986`, `.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs:57-115`.
- Prompt blocker and volatile cleanup mismatch: permission/question events set and clear prompt blocking, `session.deleted` and `*.disposed` clear volatile locks. Evidence: `.opencode/plugins/mk-goal.js:1558-1608`, `.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs:158-166`.
- DR-001-P1-001 lifecycle angle: the existing injection max-length cap issue is in `renderGoalInjection`/status preview behavior, not lifecycle transition accounting. This pass found no separate lifecycle state bug caused by that cap mismatch.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. One new P1 was found in the goal command surface/docs alignment. No new lifecycle-tracking correctness defect was found.

## Next Dimension

Security pass focused on prompt-injection sanitization, secret redaction in evidence/logs, and JSONL/debug logging surfaces.
Review verdict: CONDITIONAL
