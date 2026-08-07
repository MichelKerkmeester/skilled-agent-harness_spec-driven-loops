---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `.opencode/specs/system-deep-loop/032-goal-opencode-plugin/research/`. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `research/inbox.jsonl` to append external questions during an active run.

---

## 2. TOPIC

Audit the shipped `/goal` OpenCode plugin implementation in packet `system-deep-loop/032-goal-opencode-plugin` (phases `001-state-store` through `008-system-spec-kit-integration` only; **phase `009-speckit-command-goal-prompt-offer` is EXCLUDED — owned by a separate in-flight session, do not touch or read as in-scope**). Investigate drift between what was planned (each phase's `spec.md`/`plan.md`/`tasks.md`, and the original design synthesis) and what was actually built (`.opencode/plugins/mk-goal.js`, `.opencode/commands/opencode_goal.md`, the `mk-goal-*.test.cjs` suite, `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md`), refinement needed, missing upgrades, and new additions required to make the `/goal` plugin feature-complete, fully integrated, low-friction UX, safely automated, and flawless.

ANTI-CONVERGENCE: target at least 10 proper iterations, each adding genuine novelty. Do not converge before iteration 10 unless every avenue is genuinely exhausted (enforced by `minIterations: 10` in config — the workflow's convergence gate will auto-override any earlier STOP candidate to CONTINUE).

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] For each phase 001-008, does the shipped code (`mk-goal.js`, `opencode_goal.md`, test suite, `goal_plugin.md`) match what that phase's `spec.md`/`plan.md`/`tasks.md` specified — where is the drift, and is it a regression, an intentional improvement, or an unresolved gap?
- [ ] Does the shipped implementation faithfully realize the 9 resolved design forks from the original design synthesis (autonomy tier, scope/keying, state store, budget governance, completion detection, status set, surfacing substitute, command style, reuse vs standalone)?
- [ ] What refinements, missing upgrades, or safety/automation gaps exist in the current `/goal` plugin that block it from being feature-complete and low-friction (UX rough edges, error handling, edge cases, race conditions)?
- [ ] Is the system-spec-kit integration (`goal_plugin.md` hook doc + any `_memory.continuity` / spec-folder wiring) complete, consistent, and low-friction — does it correctly interoperate with the rest of the plugin ecosystem (`mk-spec-memory.js` patterns, event hooks, session lifecycle)?
- [ ] What new additions — beyond anything originally planned — does the actual shipped code reveal are needed for the `/goal` plugin to be genuinely flawless (issues discoverable only by reading real code, not anticipated at design time)?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do NOT touch, modify, or read phase `009-speckit-command-goal-prompt-offer` (owned by a separate in-flight OpenCode session).
- Do NOT implement fixes. This is an audit/research pass only — findings, drift classification, and recommendations are the output, not code changes.
- Do NOT re-litigate design decisions already resolved and shipped correctly in the original synthesis unless the shipped code reveals the decision itself was wrong in practice.

---

## 5. STOP CONDITIONS

- Standard convergence (newInfoRatio + question coverage + graph-assisted composite) applies, but is hard-floored at `minIterations: 10` — no STOP before iteration 10 except `maxIterationsReached` (15).
- If genuinely exhausted before iteration 10 (all 8 phases + all 9 forks + UX/automation/integration axes covered with no new findings), rotate to under-examined angles (test coverage gaps, error-path behavior, concurrency/race conditions, prompt/command UX friction, deferred-modes wiring) rather than stopping.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
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

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
(Carried) **F-018 deep-dive:** read `appendGoalBrief`/`renderGoalInjection` body to characterize the injection behavior and confirm F-015 (full goal_prompt embedded) + whether `options.enabled` gating + `maxInjectionChars` cap are honored.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

**Prior research (archived, same packet):** `.opencode/specs/system-deep-loop/032-goal-opencode-plugin/research_archive/2026-06-28-goal-design-synthesis/research.md` — an 11-iteration (G1-G11) design synthesis dated 2026-06-28, `status: design-complete`, answering a DIFFERENT question ("design a /goal capability for OpenCode"). This is the "planned" side of the drift comparison for THIS audit. Key content to carry forward:

- **Recommended design (Executive Summary):** standalone plugin `.opencode/plugins/mk-goal.js` + thin root command `.opencode/commands/goal.md`, flat per-session JSON state store, `experimental.chat.system.transform` injection (modeled on `mk-spec-memory.js`), `event` hook lifecycle tracking, Tier-2 active continuation via `session.idle` → `promptAsync` (default-gated behind smoke test), supervisor-verifier completion detection (never self-report), Codex's six-status enum + `continuationSuppressed` guard, three UX surfaces (injection block / `/goal show` / `mk_goal_status` diagnostic tool).
- **9 Resolved Design Forks** (§4 of archived research.md): (1) autonomy tier = active-continuation w/ supervisor verifier beside the loop, caps `maxAutoTurns=8`/`maxWallMs=30min`/`cooldownMs=1500`/one in-flight, 3-level kill-switch; (2) scope/keying = per-session, hex(sessionID), fail-closed on missing id; (3) state store = flat JSON at `.opencode/skills/.goal-state/<hex(sessionID)>.json`, atomic temp+fsync+rename, in-process mutation queue; (4) budget governance = token-first post-turn accounting, `budget_limited` transitions; (5) completion detection = supervisor verifier authoritative, `/goal complete` = manual override, self-report is candidate-only, shell gate = opt-in evidence adapter only; (6) status set = Codex's six statuses unchanged (`active/paused/blocked/usage_limited/budget_limited/complete`) + `continuationSuppressed`; (7) surfacing = injection block + `/goal show` + `mk_goal_status`; (8) command style = root `/goal` (Claude parity), thin router delegating to `mk_goal`/`mk_goal_status` tools; (9) reuse = standalone plugin reusing `mk-spec-memory.js` *patterns* (not a bridge), porting `thread_goals` data shape.
- **6 Build sub-phases** (§5 of archived research.md, IN SCOPE for this audit as 001-006; note the shipped packet also has 007-sk-prompt-goal-enhancement and 008-system-spec-kit-integration which are ADDITIONS beyond the original 6-phase plan — worth checking why/how they were added): `001-state-store` (thread_goals JSON port + atomic writes), `002-injection-plugin` (`mk-goal.js` scaffold, passive tier), `003-goal-command` (`goal.md` thin router + tools), `004-lifecycle-tracking` (`event` hook, usage accounting, budget transitions), `005-completion-supervisor` (verifier, `completeGoalIfCurrent`), `006-active-continuation` (Tier 2 `promptAsync`, kill-switches, default-off).
- **Named risks / open decisions** (§6 of archived research.md): recursive continuation from a plugin hook unproven (log-only → single-turn → multi-turn rollout required); `message.updated` token payload shape unverified; plugin tool names in command `allowed-tools` need a real-run check; permission/question event coverage partial; multi-process concurrency needs a lockfile if multi-process sessions expected; resume must not auto-continue without a fresh user turn; no persistent overlay (print state after every mutation); `/goal clear` has no Codex status equivalent; verifier false-positives (default `not_met` on ambiguous evidence).
- **Meta note:** the archived reducer showed `resolvedQuestions: 0` and a `2.1.139` source tree was never found locally (behavior inferred from app-binary strings of `2.1.169` instead) — a known limitation of the prior research pass, not a design gap.

**Shipped artifacts to compare against the above** (read fresh each iteration, do not assume prior research described the final state): `.opencode/plugins/mk-goal.js`, `.opencode/commands/opencode_goal.md`, `mk-goal-*.test.cjs` suite (locate via glob), `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md`, and each phase folder's `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md` under `001-state-store` through `008-system-spec-kit-integration`.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 15
- Min iterations (hard floor): 10 (operator-directed anti-convergence override; standard template default is 3)
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Question injection surface: `research/inbox.jsonl`
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-07-01T05:43:53Z
- Prior lineage: none (fresh session; prior unrelated content archived to `research_archive/2026-06-28-goal-design-synthesis/`)
