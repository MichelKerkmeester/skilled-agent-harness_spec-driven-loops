# Iteration 005 — Close F-010 disposition + expose the idle→continuation test seam

- **Segment:** 1 | **Iteration:** 5 of 15
- **Focus:** Run the phase-006 live `MK_GOAL_AUTONOMY=smoke` idle smoke, OR formally downgrade the 006 completion metadata, to close F-010.
- **newInfoRatio:** 0.74

---

## Focus

F-010 (iteration 4): phase-006 completion overclaim — the live `session.idle` continuation path was never exercised end-to-end. This iteration was tasked to either (a) run the live `MK_GOAL_AUTONOMY=smoke` idle smoke and observe a `would_fire` row in `.continuation.log`, or (b) formally downgrade the phase-006 completion metadata.

## Actions Taken

1. Read `deep-research-findings-registry.json` (unsynced / empty — reducer has not projected machine-owned sections; strategy.md is the live surface) and `deep-research-strategy.md` to re-anchor on F-010 + carried-forward test-coverage questions.
2. Located phase-006 docs (`006-active-continuation/{spec,plan,tasks,implementation-summary}.md`) and grepped `mk-goal.js` for `session.idle` / `MK_GOAL_AUTONOMY` / `smoke` / `promptAsync` / `continuationSuppressed`.
3. Read the phase-006 `implementation-summary.md` in full — established the exact overclaim (`completion_pct: 100`, `Completed: 2026-06-28`, `status`-implicit-complete) versus the honest body concession (`Known Limitations #1: "Live idle smoke is still required"`; `_memory.continuity.next_safe_action: "Run live idle smoke"`; `open_questions: ["Whether session.idle is observable in one-shot opencode run"]`).
4. Read the autonomy decision block (`mk-goal.js:1280–1337`): confirmed `smoke` mode (line 1302) returns `would_fire` *before* calling `promptAsync` — i.e. log-only, no prompt sent. Read the event handler `session.idle` branch (`mk-goal.js:1574–1599`): `session.idle` → `maybeVerifyGoal` → `maybeContinueGoal({client, directory, runtimeState})`.
5. Grepped the `mk-goal-*.test.cjs` suite for the event-handler seam. `mk-goal-continuation.test.cjs` calls `helpers.maybeContinueGoal(...)` directly 15× (never `plugin.event`); only `mk-goal-supervisor.test.cjs` fires `session.idle` events (4×). Read `mk-goal-supervisor.test.cjs` lines 1–145 to confirm it constructs the plugin with `pluginModule.default({}, {...})` — **no `MK_GOAL_AUTONOMY` / autonomy option** — so `session.idle` → `maybeContinueGoal` runs with autonomy *disabled* and returns at the autonomy gate before reaching `smoke`/`active` logic; assertions are verifier-only (status/verdict/secret-redaction), continuation is never asserted.

## Findings

### F-010 — RESOLVED (disposition: formal metadata downgrade recommended)

A deterministic live `MK_GOAL_AUTONOMY=smoke` idle smoke is **not runnable** by this LEAF research agent within a single-iteration dispatch: it requires an interactive `opencode serve`/TUI session where the host runtime genuinely emits `session.idle` and the resulting `would_fire` row in `.opencode/skills/.goal-state/.continuation.log` is observable. In a one-shot/automated dispatch the host does not deterministically reach an idle boundary that this agent controls, and forcing one would not yield a reproducible artifact.

**Recommendation (the offered alternative path):** formally downgrade the phase-006 completion metadata rather than claim the live smoke as done.
- `implementation-summary.md` frontmatter: `completion_pct: 100` → **≤90**; remove/qualify the unconditional `Completed: 2026-06-28` reading.
- `_memory.continuity`: `recent_action: "Implemented and verified default-off active continuation"` overstates — the verification is *unit-only*. Align `recent_action` with `next_safe_action: "Run live idle smoke"` (which is already correct).
- The body `Known Limitations` and `Verification` table are honest and need no change; only the *metadata* overclaims. The overclaim is an integrity bug, not a code bug — F-010 severity stays **P1** (completion-integrity / trust-in-metadata), downgraded from "blocks shipping" to "blocks a clean audit sign-off."

Note: implementing this downgrade is an **audit follow-up doc change**, out of scope for this do-not-implement iteration. Logged as a recommendation only.

### F-013 — NEW (P1): the `session.idle → maybeContinueGoal` autonomy-enabled seam is covered by NO test

The integration seam that the F-010 live smoke would exercise is itself unverified:

- `mk-goal-continuation.test.cjs` invokes `helpers.maybeContinueGoal(...)` **directly** (15 call sites) — it never routes through `plugin.event({event:{type:'session.idle'}})`. So the unit tests prove the pure decision function in isolation but **not** the event-handler wiring at `mk-goal.js:1574–1599` that connects a real `session.idle` to it.
- `mk-goal-supervisor.test.cjs` is the only suite that fires `session.idle` events (4×, lines 71/100/118/135), but it constructs the plugin with **autonomy disabled** (`pluginModule.default({}, {stateDir, nowMs, supervisorVerifier})` — no `MK_GOAL_AUTONOMY`, no autonomy option). Consequently `session.idle` → `maybeContinueGoal` returns at the autonomy gate long before the `smoke`/`active`/`promptAsync` logic (line 1302+), and the assertions verify only the supervisor path (verdict→status, secret redaction). Continuation outcomes (`would_fire`/`fired`/`prompt_async_*`) are never asserted from a `session.idle` entry point.

**Implication:** even the *wiring* the live smoke is meant to validate — a real `session.idle` flowing through `handleEvent` into an autonomy-enabled `maybeContinueGoal` — has no automated coverage. So F-010's "live smoke still required" understates the gap: the seam is doubly unverified (runtime observability **and** no integration test). Recommended remediation (out of scope here): add an integration test that fires `plugin.event({event:{type:'session.idle', properties:{sessionID}}})` against a plugin constructed with `autonomy:'smoke'` (or env `MK_GOAL_AUTONOMY=smoke`) and an active goal, then asserts a `would_fire`/`smoke_mode` row in `.continuation.log`.

### F-012 — CONFIRMED recurring in phase 006

`006-active-continuation/implementation-summary.md:22` carries the packet-wide zeroed session_dedup fingerprint (`sha256:0000…0000`), identical to the other phases flagged in iteration 4. Reinforces F-012 as a packet-wide metadata defect, not a single-phase slip.

## Questions Answered

- **(Carried, iter 1–4) "Does the `mk-goal-*.test.cjs` suite exercise the event handler / cover the unverified tail?"** — Partially answered: the supervisor suite fires `session.idle` through the real `plugin.event` handler (so the idle→verification wiring IS covered), but the **idle→continuation-with-autonomy seam is not covered** — continuation is tested only by direct `maybeContinueGoal` calls, and the idle-driven path always runs with autonomy off. The specifically unverified tail is precisely the F-010 live-smoke path.

## Questions Remaining

- (Carried) **F-004:** read `mk-goal.js` injection/transform wiring (`renderGoalInjection`/`appendGoalBrief`/`experimental.chat.system.transform`) — lines 1350+ now partially seen (transform at 1620, `__test` exports at 1658–1676 confirm `renderGoalInjection`/`maybeContinueGoal`/`maybeVerifyGoal` are the test seams); the 002 injection body still wants a dedicated read.
- (Carried) **Cross-check the 9 resolved design forks** against shipped behavior — heavily carried since iter 1, still untouched; richest remaining novel axis. Fork #8 "command style = root /goal" is implicated by F-005/F-007/F-008/F-009; forks #1 (autonomy), #5 (completion detection), #6 (status set) are now well-evidenced by code reads and can be formally closed cheaply.
- (Carried) **F-003:** trace `status:` writes — is `usage_limited` ever set in production paths, or dead?
- (Carried) Confirm the opencode command-resolution rule for `.opencode/commands/*.md` (`opencode_goal.md` → `/opencode_goal`?) — refines F-008.
- (Carried) Verify `ENV_REFERENCE.md` `MK_GOAL_*` entries vs the code's env reads (`MK_GOAL_AUTONOMY` confirmed in code at line 34; `MK_GOAL_DEBUG` referenced in impl summary; remaining budget knobs unverified).

## Next Focus (proposed for iteration 6)

**Cross-check the 9 resolved design forks** from `research_archive/2026-06-28-goal-design-synthesis/research.md` §4 against shipped behavior — the largest untouched novel axis, carried since iteration 1. Prioritize forks #1 (autonomy tier — now well-evidenced), #5/#6 (completion detection + status set — verifier code seen this iteration), #8 (command style — already implicated), and the under-examined #2/#3/#4/#7/#9. This rotates off the per-phase drift axis onto the design-fidelity axis, satisfying the anti-convergence directive.
