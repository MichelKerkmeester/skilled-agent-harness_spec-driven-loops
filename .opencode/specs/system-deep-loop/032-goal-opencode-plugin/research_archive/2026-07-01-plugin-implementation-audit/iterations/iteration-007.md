# Iteration 007 — 9 Resolved Design Forks cross-check against shipped behavior

## Focus

**(Carried since iter 1):** Cross-check the **9 Resolved Design Forks** from the archived design synthesis (`research_archive/2026-06-28-goal-design-synthesis/research.md` §4) against the shipped code (`.opencode/plugins/mk-goal.js`). Forks #1/#5/#6 were already well-evidenced by prior iterations; this iteration formally closes #2 (keying), #3 (state store atomicity), #4 (budget governance), #7 (surfacing), and #9 (reuse), and resolves the fork-level status of #8 (command style).

## Actions Taken

1. Read the archived design synthesis §4 (the 9-fork table) and §3 (state record, injection block, lifecycle) to establish each fork's planned contract + rationale citations.
2. Read `mk-goal.js` constants/utilities (L1–320) — keyed helpers (`sessionKeyForSession` L167, `requireSessionID` L142), sanitizers, autonomy caps (L30–49), status enum (L50–57).
3. Read state-store + budget core (L615–984): `normalizeStoredGoal`, `readGoal`, `fsyncDirectory`, `writeGoalAtomic`, `mutateGoal`, `setGoal`/`clearGoal`, `markGoalStatus`, `budgetWasCrossed`, `accountUsage`.
4. Read injection + tool-output surface (L1340–1496): `renderGoalInjection`, `appendGoalBrief`, `goalStateLines`, `executeGoalAction`, `executeGoalStatus`.
5. Re-read iteration-006 to inherit F-003/F-014 status (fork #6) and avoid re-litigating.
6. Grep-confirmed `__global__` / `fsync` / `rename` / `budget_limited` / `tokenBudget` distribution across plugins (isolation evidence).

## Findings

### Fork realization matrix

| # | Fork | Plan | Shipped | Verdict | Evidence |
|---|------|------|---------|---------|----------|
| 1 | Autonomy tier | Tier-2 `session.idle→promptAsync`, caps 8/30min/1500ms, 3-level kill-switch, default-off | caps `DEFAULT_MAX_AUTO_TURNS=8`(L30), `maxWallMs=30min`(L32), `cooldownMs=1500`(L31), `AUTONOMY_ACTIVE_MODES`(L49), `MK_GOAL_AUTONOMY`(L34) | **REALIZED** (prior iters) | iters 5–6 |
| 2 | Scope/keying | per-session `hex(sessionID)`, fail-closed, no `__global__` steering | `sessionKeyForSession`=hex(L167), `requireSessionID` throws `MISSING_SESSION_ID`(L142–148), **no `__global__` anywhere** in mk-goal.js (grep: `__global__` only in mk-spec-memory/mk-skill-advisor/mk-code-graph) | **REALIZED** (stricter than plan — rejects diagnostics too) | L167, L142 |
| 3 | State store | flat JSON atomic temp+fsync+rename, in-process queue, not SQLite/MCP, lockfile if multi-process | `writeGoalAtomic`(L716): temp(`pid.ts.rand`, L721)→open 0o600→writeFile→`handle.sync()`(L727)→close→`rename`(L730)→`fsyncDirectory`(L731); `mutateGoal`(L762) chains per-key promises; direct `readFile`(L688), no SQLite, no MCP; **no lockfile** | **REALIZED** (lockfile is design-accepted v1 deferral) | L716–781 |
| 4 | Budget governance | token-first; charge active-only, goalId-match, messageID-dedupe; cross→`budget_limited`+suppress; `usageSource=unavailable` best-effort | `accountUsage`(L912): active-only(L926), goalId-match(L927), messageID-dedupe(L928), `budgetWasCrossed`→`budget_limited`(L941), `continuationSuppressed=true`(L949), `usageSource` default `'unavailable'`(L922); continuation preflight also flips `budget_limited`(L1180) | **REALIZED** (doubly-guarded: status gate + suppression flag) | L899–955, L1180 |
| 5 | Completion detection | supervisor verifier authoritative, manual override, self-report candidate-only | `lastVerifierVerdict` met/not_met/blocked, `completeGoalIfCurrent` CAS, `completionSource` manual vs supervisor | **REALIZED** (prior iters) | iters 4–5 |
| 6 | Status set | Codex six + `continuationSuppressed`; `usage_limited`=external cap | enum L50–57 matches six; `continuationSuppressed` L630/L802; **`usage_limited` dead/unwired** | **PARTIAL** — enum present, writer absent (F-003/F-014) | iter 6 |
| 7 | Surfacing | (a) `[active_goal]` injection, (b) `/goal show`, (c) `mk_goal_status` richer diag w/ store-health | (a) `renderGoalInjection`+`appendGoalBrief`(L1350–1396) ✓; (b) `executeGoalAction` show→`goalStateLines`(L1402, STATUS= footer) ✓; (c) `executeGoalStatus`(L1488) reuses `goalStateLines` — **goal-centric, no store-health/session-liveness dimension** | **MOSTLY REALIZED** (gap: status surface lacks health dimension) | L1350–1496 |
| 8 | Command style | root `/goal` (Claude parity), thin router | shipped file is `opencode_goal.md` → resolves `/opencode_goal`, **not** `/goal` | **DRIFT** — ties F-007/F-008/F-009 to a fork-level realization failure | F-007/F-008/F-009 |
| 9 | Reuse vs standalone | standalone plugin, reuse `mk-spec-memory` *patterns*, port `thread_goals` shape, no bridge, no global goalsApi | standalone default-export; `appendGoalBrief` mirrors `appendContinuityBrief` (normalize output.system→resolve sessionID→dedupe→push); `sessionIdFromInput`(L150) ported; direct `readGoal`, fail-open try/catch(L1393); no `goalsApi`/`MEMORY_GOALS.md` ref; fresh-read per turn (no cache = design §3.3 intent) | **REALIZED** | L150, L1381–1396, L688 |

**Summary: 7/9 forks faithfully realized (#1,#2,#3,#4,#5,#7-mostly,#9); #6 partial (enum ok, writer dead); #8 drift (command namespace).**

### F-015 (P2) — Injection block embeds the full enhanced `goal_prompt`, departing from design's "compact block"

Design §3.3 specified a **compact** model-facing block: `objective` / `last_check` / `usage` / `directive`, clamped to a hard char cap. The shipped `renderGoalInjection` (L1350–1378) adds a multi-line **`goal_prompt:`** section carrying the phase-007 enhanced goal prompt (`buildEnhancedGoalPrompt`, up to `DEFAULT_MAX_GOAL_PROMPT_CHARS`=4000). Although bounded by `maxInjectionChars` (4800), this roughly doubles/triples the per-turn injection footprint versus the design's lean block and means the model sees both the *objective summary* AND the full *role/method/success-criteria/stop-conditions* prompt every turn. This is a phase-007 addition layered onto the injection surface without re-visiting the design's compactness rationale. Refinement candidate: gate the `goal_prompt:` section (omit on steady-state turns, or shrink to the objective preview) once the first injection has primed the model.

### F-016 (P2) — `fsyncDirectory` silently swallows all fsync failures

`fsyncDirectory` (L697–707) wraps the directory `open`+`handle.sync()` in `catch { return; }` — any fsync error (permissions, vanished dir, EIO) is swallowed and the atomic write is reported successful. The design (fork #3) explicitly wanted temp+**fsync**+rename for crash durability; silently dropping the dir fsync weakens that guarantee (the rename lands, but directory-entry durability is unverified). Low blast radius (single-session goal state, non-critical), but it's a correctness-vs-intent gap. Refinement: at least log fsync failures under `MK_GOAL_DEBUG` rather than discarding them silently.

### F-017 (P3) — `mk_goal_status` / `/goal show` lack a store-health / session-liveness dimension

Design fork #7(c) specified `mk_goal_status` as a richer diagnostic exposing "**session/goal/verifier/continuation/store health**, logical store labels not paths." The shipped `goalStateLines` (L1402–1443, shared by `executeGoalAction` show and `executeGoalStatus`) is goal-centric: it reports goal/verifier/continuation fields richly, but exposes **no** session-liveness, store-writability, or `lastAccountedMessageID`-staleness signal. A diagnostic user cannot tell from the status output whether the store is writable, whether the session is live, or whether usage accounting has stalled. Surfacing-completeness gap, not a regression.

### Residual risk (low, design-accepted) — multi-process lockfile not implemented

Fork #3 deferred the cross-process lockfile to "if multi-process sessions are expected." Shipped code has only the in-process `mutateGoal` queue (per-key promise chain, L765). Atomic temp+rename prevents torn writes but two concurrent opencode processes sharing a workspace could lose updates (last-writer-wins on the rename). Confirmed still a v1 deferral, not new drift.

## Questions Answered

- **[Q-9-forks] Does shipped code faithfully realize the 9 resolved design forks?** → **7/9 fully realized, 1 partial (#6), 1 drift (#8).** Forks #2/#3/#4/#9 confirmed via direct code read; #7 mostly realized (one completeness gap, F-017); #1/#5 confirmed in prior iters; #6 enum-realized/writer-dead (F-003/F-014); #8 command-namespace drift (F-007/F-008/F-009).
- **[F-004-status] injection/transform wiring** — partially closed: `appendGoalBrief`(L1381) + `renderGoalInjection`(L1350) + dedupe(L1390) + fail-open(L1393) confirmed; the dedicated *event()/tool-registration* read still carried (lines 1510–1676 not examined this pass).

## Questions Remaining

- (Carried) **F-004 remainder:** dedicated read of `mk-goal.js` L1510–1676 — plugin factory hooks (`experimental.chat.system.transform`, `event`, `tool` registration), `mk_goal`/`mk_goal_status` tool schemas, `__test` export seams.
- (Carried) **F-013:** `session.idle` → `maybeContinueGoal` autonomy-enabled seam has zero test coverage (iter 5).
- (Carried) **F-014:** decide remediation direction (collapse `usage_limited` enum vs wire the provider-cap detector) — design decision, not research.
- (Carried) Confirm opencode command-resolution rule for `.opencode/commands/*.md` (`opencode_goal.md` → `/opencode_goal`?) — refines F-008.
- (Carried) Examine `mk-goal-*.test.cjs` suite — does it exercise the command *namespace*, and does it cover the unverified code tail (L1510–1676)?

## Next Focus

The 9-fork axis is now closed (richest remaining axis exhausted). Rotate to **test-suite coverage analysis** (`mk-goal-*.test.cjs`): map which production regions are covered vs the unverified tail (F-004: plugin-factory hooks, tool schemas, `session.idle` autonomy seam per F-013), and confirm the suite tests tool-paths only (never the command namespace per F-008). This serves key question #3 (refinements/safety/automation gaps) and #5 (new additions needed) via a fresh, code-grounded axis.
