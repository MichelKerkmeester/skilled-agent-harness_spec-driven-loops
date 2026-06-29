---
title: "/goal OpenCode Plugin — Deep-Research Design Synthesis"
description: Buildable end-to-end design for an OpenCode /goal capability, synthesized from an 11-iteration deep-research run (G1–G13).
status: design-complete
session_id: dr-goal-001-20260628-164019
iterations: 11
date: 2026-06-28
---

# /goal OpenCode Plugin — Design Synthesis (G14)

> Faithful synthesis of iterations 001–011. Every mechanic carries file:line or sqlite evidence; design decisions cite the iteration that resolved them. This is the convergence report — the build is the follow-up sub-phases in §5.

---

## 1. Executive Summary

`/goal` lets a user set a **session-level completion condition** ("finish this refactor and make the tests pass"), persist it, **inject it into the model's context on every turn until it is met**, and `show` / `clear` / `complete` / `pause` it — an OpenCode port of Claude Code's `/goal` and Codex's `thread_goals`.

The recommended OpenCode design is a **standalone plugin `.opencode/plugins/mk-goal.js`** plus a **thin root command `.opencode/commands/goal.md`**, backed by a **flat per-session JSON state store**. The plugin injects a compact `[active_goal]` block via the `experimental.chat.system.transform` hook every turn (modeled exactly on `mk-spec-memory.js`), and uses the `event` hook to track progress and — on `session.idle` only — drive **active continuation** by calling the SDK's `promptAsync`. Completion is decided by a **supervisor verifier** (strict `met`/`not_met`/`blocked` JSON), never by assistant self-report; `/goal complete` is the manual override. The state record ports the Codex `thread_goals` row (objective, six-status enum, token budget/usage, ms timestamps) plus OpenHuman's `continuationSuppressed` guard. Autonomy ships behind hard guardrails: loop caps (≤8 auto-turns, ≤30 min, 1500 ms cooldown, one in-flight continuation), a three-level kill-switch (`MK_GOAL_AUTONOMY=passive` env → `/goal pause`/`/goal clear` → per-idle-event suppression), and a default-safe posture (passive injection first; real continuation enabled only after a smoke test). User-authored objective text is sanitized and fenced before it ever enters context.

---

## 2. Confirmed Mechanics (with evidence)

### 2.1 The injection hook — `experimental.chat.system.transform` (string-only, per-turn)

- The installed OpenCode `Hooks` interface defines `"experimental.chat.system.transform"` with `input.sessionID?: string`, `input.model`, and `output.system: string[]` — `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:197`, `:201`. (iter 4 F1, iter 11 F2)
- The existing memory plugin registers it as `'experimental.chat.system.transform': appendContinuityBrief` — `.opencode/plugins/mk-spec-memory.js:436`. Its append flow is the template to copy: guard `output`, normalize `output.system` to an array, skip when disabled, resolve `sessionID`, fetch the brief, clamp, dedupe against existing entries, then `push` — `.opencode/plugins/mk-spec-memory.js:404`, `:406`, `:408`, `:411`, `:412`, `:413`. (iter 4 F2)
- `mk-code-graph.js` renders one block and appends to `output.system` the same way — `.opencode/plugins/mk-code-graph.js:442`, `:462`, `:467`. (iter 11 F2)
- **Key constraint:** `sessionID` is optional. If absent, **skip injection** rather than fall back to a global goal (avoids cross-session leakage) — `mk-spec-memory.js` session resolution at `:128`, `:131`, `:134`, `:137` with `__global__` fallback that goal injection must *not* use for steering. (iter 4 F1/F4)

### 2.2 Lifecycle hooks — `event` hook; `session.idle` is the autonomy seam

- Local plugins expose a generic `event` hook; `mk-spec-memory` returns it at `.opencode/plugins/mk-spec-memory.js:417`, marks ready on `session.created` (`:419`), evicts cache on `session.deleted` (`:423`), and invalidates on any `message.*`/`session.*` (`:427`); `mk-code-graph.js:371` mirrors this. (iter 5 F1)
- `session.idle` is real in the installed runtime (`opencode --version` = **1.17.11**) and is the TUI's "response-ready" signal: the bundled binary listens for `session.idle`/`session.error` and reads `properties.sessionID` on idle — `/opt/homebrew/lib/node_modules/opencode-ai/bin/opencode.exe` strings line `84952`. (iter 5 F2)
- SDK confirms the event type and continuation API:
  - `EventSessionIdle` → `type: "session.idle"`, `properties.sessionID` — `.opencode/node_modules/@opencode-ai/sdk/dist/gen/types.gen.d.ts:413`, `:417`. (iter 8 F2)
  - Session status is `idle | retry | busy` via `session.status` — `types.gen.d.ts:396`, `:410`. (iter 8 F2)
  - Permission events carry session/message ids — `types.gen.d.ts:369`, `:375`, `:388`, `:394`. (iter 8 F2)
  - The plugin receives `client: ReturnType<typeof createOpencodeClient>` — `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:10`, `:11`; the SDK exposes `prompt` (`sdk.gen.d.ts:172`, `:174`) and **`promptAsync`** which sends and returns immediately (`sdk.gen.d.ts:180`, `:182`), posting to `/session/{id}/prompt_async` (`sdk.gen.js:380`, `:384`). (iter 8 F1)
- `message.updated` is a **tracking/cache** signal, not a continuation driver (it can fire mid-stream) — bundled reducer reads `info.sessionID`/`info.id` at strings line `84952`. (iter 5 F3)

### 2.3 Command contract — thin root router delegating to plugin tools

- Root command files live directly under `.opencode/commands/` — `.opencode/commands/prompt.md:1`–`:4`. (iter 6 F1)
- The thin-router pattern (route in markdown, implement elsewhere) and `$ARGUMENTS` parsing come from `.opencode/commands/memory/learn.md:7`–`:10`, `:24`–`:31`, `:39`; an argument-resolution shell prelude binding `ARGS_PRESENT`/`QUERY` from `.opencode/commands/memory/search.md:15`–`:22`; a safe default mode for empty args from `.opencode/commands/memory/manage.md:22`. (iter 6 F1/F2)
- Plugins expose a `tool` map — `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:108`–`:115`; tool execution context includes `sessionID`, `directory`, `worktree` — `.opencode/node_modules/@opencode-ai/plugin/dist/tool.d.ts:2`–`:15`, `:33`–`:37`. This is why the command never needs to infer a session id. (iter 6 F3, iter 8 F5)
- Parseable result envelopes (`STATUS=OK/FAIL ...`) come from `learn.md:32`–`:35`, `manage.md:38`, `search.md:53`–`:66`. (iter 6 F4)
- Plugins auto-load from `.opencode/plugins/*.js` at session start — `.opencode/plugins/README.md:8`, `:32`–`:36`. (iter 6 F3)

### 2.4 The data model being ported — Codex `thread_goals`

`sqlite3 ~/.codex/goals_1.sqlite '.schema thread_goals'` returned (iter 1 F1–F4, re-confirmed iter 7/9/10):

| Column | Type / constraint | Notes |
|---|---|---|
| `thread_id` | `TEXT PRIMARY KEY NOT NULL` | one durable goal **per thread** (singleton, not a list) |
| `goal_id` | TEXT | stable identity of the current objective |
| `objective` | TEXT | user-authored completion condition |
| `status` | `CHECK(status IN ('active','paused','blocked','usage_limited','budget_limited','complete'))` | closed six-value enum |
| `token_budget` | INTEGER (nullable) | optional cap |
| `tokens_used` | `INTEGER NOT NULL DEFAULT 0` | usage counter |
| `time_used_seconds` | `INTEGER NOT NULL DEFAULT 0` | elapsed-time **telemetry** |
| `created_at_ms` / `updated_at_ms` | `INTEGER NOT NULL` | millisecond timestamps |

Only index = `sqlite_autoindex_thread_goals_1` (the PK). **No `time_budget_seconds` column** (`no such column` error) → budget is **token-first**; time is telemetry only. Live `goal_count = 0` → this is schema evidence, not transition evidence. (iter 1 F1–F4)

The vendored OpenHuman reference is the proven "Codex row → file JSON" adapter and supplies the autonomy field the plugin needs:
- Single thread-scoped goal, type mirrors the Codex row, adds `continuation_suppressed` — `.opencode/specs/z_future/openhuman/external/src/openhuman/thread_goals/types.rs:10`, `:59`, `:87`; its status enum is *smaller* (`active|paused|budget_limited|complete`) — `types.rs:15` (so do not copy OH's enum verbatim). (iter 3 F1, iter 7 F1)
- JSON-per-thread store `<workspace>/thread_goals/<hex(thread_id)>.json`, load-mutate-save under a mutex, temp-file + fsync + rename, dir-on-demand, non-empty-id validation — `store.rs:1`, `:3`, `:9`, `:38`, `:57`, `:64`, `:103`. (iter 3 F2, iter 7 F2)
- Mutation semantics: same-objective preserves `goal_id`+counters, changed-objective re-mints+resets; clear = delete file; list skips corrupt; stale-write guard by `expected_goal_id`; saturating budget add flips to `BudgetLimited`; raising budget above usage reactivates — `store.rs:144`, `:146`, `:190`, `:256`, `:291`, `:401`, `:403`, `:433`, `:437`, `:491`, `:511`. (iter 7 F5, iter 10 F2/F4)
- Lifecycle API verbs `get/set/complete/pause/resume/clear` — `threadGoalApi.ts:19`, `:50`; full e2e lifecycle test — `json_rpc_e2e.rs:2802`, `:2851`, `:2894`. (iter 3 F3)
- `[active_goal]` steering block rendered only for active/budget-limited goals with a directive; budget stop-hook; charge only active goals — `runtime.rs:86`, `:91`, `:102`, `:106`, `:143`, `:192`, `:207`, `:257`. (iter 3 F6, iter 10 F3)
- Guarded one-shot idle continuation (opt-in, suppress-after-one, semaphore, skip in-flight, capped; "no present user" prompt) — `continuation.rs:1`, `:8`, `:45`, `:53`, `:71`, `:147`. (iter 3 F7)
- `goal_complete` tool callable only with concrete evidence — `tools.rs:169`, `:180`. (iter 9 F1/F3)
- **Do not reuse** the global `goalsApi` (durable `MEMORY_GOALS.md` long-term goals) — `goalsApi.ts:1`, `:4`, `:62`, `:96`. (iter 3 F4)

Claude Code `/goal` behavior (binary strings from `/Users/michelkerkmeester/.local/share/claude/ClaudeCode.app/Contents/MacOS/claude`; local app `VERSION:"2.1.169"`, wrapper `2.1.195`, npm cache confirms `2.1.139` shipped but no source tree was available): it is a **trusted-workspace, hooks-gated** feature (strings `143046`–`143047`); completion is **Stop-hook verifier-driven** (`goal_status`/`active_goal`/`goal_met`/`impossible`/`tengu_goal_achieved` at `187412`–`187420`, `188035`–`188040`, `313053`–`313054`); continue-until-met is a **stop-prevention loop with an explicit `/goal clear` escape** (`188043`–`188044`, `210099`–`210108`); it surfaces an **active/achieved status indicator** (`210102`–`210111`, `218886`) and **restores goals on resume** (`tengu_goal_restored_on_resume` `221799`–`221803`, command strings `343969`–`343989`). (iter 2 F1–F5)

---

## 3. Recommended Design

### 3.1 Files to build

| File | Role |
|---|---|
| `.opencode/plugins/mk-goal.js` (new) | Owns all behavior: per-turn injection, lifecycle/event handling, state I/O, autonomy loop, verifier, `mk_goal` + `mk_goal_status` tools. Modeled on `mk-spec-memory.js`. |
| `.opencode/commands/goal.md` (new) | Thin root `/goal` router; parses `$ARGUMENTS`, delegates to `mk_goal`/`mk_goal_status`, prints terse `STATUS=` envelopes. |
| `.opencode/skills/.goal-state/<hex(sessionID)>.json` (new, runtime) | Flat per-session state store (atomic temp+rename). Optional `thread-goals/` subdir. |

### 3.2 State record (ported Codex/OpenHuman shape + OpenCode guards)

```jsonc
{
  // Core (Codex thread_goals → JSON; iter 1, 3, 7)
  "sessionId": "...", "goalId": "...", "objective": "<sanitized>",
  "status": "active|paused|blocked|usage_limited|budget_limited|complete",
  "tokenBudget": null, "tokensUsed": 0, "timeUsedSeconds": 0,
  "createdAtMs": 0, "updatedAtMs": 0,
  "continuationSuppressed": false,            // OpenHuman guard (iter 3 F7, 7 F1)
  // Autonomy caps (iter 8 F4)
  "autoTurnsUsed": 0, "maxAutoTurns": 8, "startedAtMs": 0,
  "lastContinuationAtMs": 0, "lastContinuationMessageId": null,
  "lastContinuationError": null, "continuationSuppressedReason": null,
  // Verifier state (iter 9 F4)
  "iterations": 0, "lastCheckAtMs": 0, "lastVerifierVerdict": "not_evaluated",
  "lastVerifierReason": null, "lastVerifierConfidence": null,
  "lastEvidence": null, "completionSource": null, "verifierRunID": null,
  // Budget accounting guards (iter 10 F2)
  "lastAccountedMessageID": null, "usageSource": "unavailable"
}
```

State helpers inside the plugin (iter 7 F2/F5): `ensureGoalStateDir()`, `goalPathForSession(id)`, `readGoal(id)`, `mutateGoal(id, fn)` (in-process queue), `writeGoalAtomic(goal)`, `setGoal` (upsert: same-objective preserve / changed reset), `clearGoal(id)` (delete), `accountUsage(id, expectedGoalID, tokenDelta, secDelta, sourceEvent)` (compare-and-skip on stale id + dedupe by message id).

### 3.3 How the goal is injected every turn

Register `'experimental.chat.system.transform': appendGoalBrief`. `appendGoalBrief(input, output = { system: [] })`: ensure `output.system` is an array → skip if plugin/injection disabled → resolve `sessionID` (skip if missing) → `readGoal` fresh (no long TTL — goal changes must feel immediate) → **inject only when `status === 'active'`** (skip `paused`/`complete`/`budget_limited`/`usage_limited`; for `blocked`, inject only to explain the block) → render the compact, **sanitized + fenced** block → clamp to a hard char cap → dedupe by `[active_goal:<goalId>]` → `push`. Fail open (skip + record `lastError`). (iter 4 F1/F2/F6, iter 11 F2)

Model-facing block (iter 11 F2):

```text
[active_goal:<goalId>]
status: active
objective: <sanitized objective>
last_check: <not_evaluated|met|not_met|blocked> ; reason: <short|none>
usage: tokens <tokensUsed>/<tokenBudget|none>; time <timeUsedSeconds>s; iteration <autoTurnsUsed>/<maxAutoTurns>
directive: Continue toward this objective. Before ending, run the goal verifier or explain why it is blocked.
[/active_goal]
```

### 3.4 How lifecycle / tracking / autonomy works

Single `event({ event })` switch (iter 5 F1–F5, iter 8, iter 9 F5):

- `session.created` → mark runtime ready; restore active goal for the session id (resume parity with Claude).
- `message.updated` → refresh `lastActivityAt`, capture latest assistant transcript as verifier evidence, and `accountUsage(...)` **if** the payload carries token totals (else `usageSource=unavailable`). **Never** continues. Dedupe by `lastAccountedMessageID`.
- `permission.asked`/`question.asked` → set `blockedByPrompt=true`; clear on replies. Blocks continuation.
- `session.idle` → the **only** continuation seam. Run `maybeVerifyGoal(sessionID)` **then** `maybeContinueGoal(sessionID)`:
  1. **Verify first:** if goal `active` and `goalId`/`generation` match, run the supervisor verifier → `met` ⇒ `complete` (stop); `blocked` ⇒ `blocked` (stop); `not_met` ⇒ bump `iterations`, update `lastReason`, fall through.
  2. **Continue (guarded):** require, in order — plugin enabled, autonomy enabled, real session id, `status==='active'`, `!continuationSuppressed`, no in-flight lock, no permission/question block, last status not `busy`/`retry`, cooldown elapsed, caps not exceeded, budget not exceeded → then `ctx.client.session.promptAsync({ path:{id:sessionID}, query:{directory}, body:{ parts:[<sanitized continuation prompt>] } })`. Increment `autoTurnsUsed` **before** sending. (iter 8 F1/F2/F4)
- `session.deleted` / `server.instance.disposed` / `global.disposed` → flush volatile locks/caches; durable state untouched unless `/goal clear|complete`. (iter 5 F4)

---

## 4. The 9 Design Forks — Resolved

| # | Fork | Recommendation | Rationale (evidence / iteration) |
|---|---|---|---|
| 1 | **Autonomy tier** | **Active-continuation (Tier 2)** via `session.idle → promptAsync`, with the **supervisor as a completion verifier beside the loop** (not a loop driver), shipped **default-gated** (passive injection until smoke test passes). Guardrails: caps `maxAutoTurns=8`, `maxWallMs=30 min`, `cooldownMs=1500`, **one in-flight continuation/session**; kill-switch at 3 levels (env `MK_GOAL_AUTONOMY=passive`/`MK_GOAL_DISABLE_AUTONOMY=1` → `/goal pause`/`/goal clear` → per-idle-event suppression on error/busy/cap/missing-id/promptAsync-fail). | Passive injection alone does not match Claude's continue-until-met; SDK proves `promptAsync` is callable from the plugin client (`sdk.gen.d.ts:180`–`:182`; `index.d.ts:10`–`:11`). Supervisor in the hot loop is rejected — the idle loop *continues work*, verification gates *completion* only (iter 8 F1/F3/F4/F5). Caps stored durably to survive reload (iter 8 F4). Smoke-first because recursive prompt-submission from a hook is unproven (iter 8 F1 risk). |
| 2 | **Scope / keying** | **Per-session**, keyed strictly by OpenCode `sessionID`, filename `<hex(sessionID)>.json`. **Fail closed** if no session id for any mutation (no `__global__` row); `__global__` allowed only for plugin diagnostics. | Codex/OpenHuman are per-thread singletons (`goals_1.sqlite` PK `thread_id`; `store.rs:64`). Global fallback would leak/cross-contaminate goals (iter 4 F1, iter 7 F3). |
| 3 | **State store** | **Flat per-session JSON** at `.opencode/skills/.goal-state/<hex(sessionID)>.json`, atomic temp+fsync+rename, in-process mutation queue (+ lockfile if multi-process). **Not** SQLite, **not** spec-kit memory MCP. | OpenHuman already rejected a SQLite port for one-row-per-thread JSON (`store.rs:3`,`:9`,`:103`); Node-core-only ship avoids dependency friction; spec-memory is a context layer, too indirect for authoritative command state (`mk-spec-memory.js:273`,`:315`) (iter 7 F2/F4). |
| 4 | **Budget governance** | **Token-first.** `tokenBudget` (nullable) / `tokensUsed` / `timeUsedSeconds` (telemetry, no time-cap column). Guarded **post-turn** accounting: charge only `active` goals, only on completed turns, only if `goalId` matches, dedupe by message id. Cross cap → `budget_limited`, suppress continuation. Refuse continuation when over budget. Best-effort: `usageSource=unavailable` when events lack token totals. | Codex has `token_budget`/`tokens_used`/`time_used_seconds` but no `time_budget_seconds` (sqlite). OpenHuman saturating-adds + flips `BudgetLimited`, reactivates on budget raise (`store.rs:403`,`:437`,`:491`). `message.updated` token payload unverified → tolerant extraction (iter 1 F3, iter 10 F1–F5). |
| 5 | **Completion detection** | **Supervisor verifier** is authoritative for *automatic* completion: strict JSON `{verdict: met\|not_met\|blocked, confidence, reason, evidence}`; only `met` → `complete`. `/goal complete` = manual override (`completionSource: manual` vs `supervisor`). Assistant self-report = candidate only. Optional shell gate = evidence adapter, **never inferred from objective text**. | Claude completion is Stop-hook verifier-driven, not self-report (strings `188035`–`188040`); OpenHuman `goal_complete` requires concrete evidence (`tools.rs:169`). Auto-extracting shell commands from NL is a command-injection footgun (iter 9 F1/F2/F3). |
| 6 | **Status set** | Keep **Codex's six statuses unchanged**: `active`, `paused`, `blocked`, `usage_limited`, `budget_limited`, `complete` + the OpenHuman `continuationSuppressed` guard field. User transitions: `active`/`paused`/`complete` (+ `clear`=delete). Runtime transitions: `blocked`/`usage_limited`/`budget_limited`. `budget_limited`=our configured cap hit; `usage_limited`=external provider/runtime cap; `blocked`=needs user input or verifier `impossible`. No `cleared`/`expired` statuses. | sqlite CHECK enum is the closed contract; OpenHuman's smaller enum would erase `blocked`/`usage_limited` (`types.rs:15`) (iter 1 F2, iter 7 F1, iter 10 F1). |
| 7 | **Surfacing substitute** | **Three surfaces** for Claude's status-line overlay: (a) per-turn `[active_goal]` injection = model-facing status line; (b) `/goal show` = user-facing compact view (objective, last check, usage, controls + `STATUS=` footer); (c) `mk_goal_status` = richer diagnostic tool (session/goal/verifier/continuation/store health, logical store labels not paths). | OpenCode cannot render Claude's overlay (strategy non-goal `:38`); plugins inject via `output.system.push` and register status tools (`mk-spec-memory.js:404`,`:438`). Maps OpenHuman chip's visible/expanded/hidden hierarchy onto OpenCode's non-UI surfaces (iter 4 F5, iter 11 F1–F5). |
| 8 | **Command style** | **Root `/goal`** (Claude parity), not `/goal:*`. Thin router: empty/`show`→show; bare text or `set <text>`→set; `pause [reason]`; `complete`; `clear`; `<objective> --budget <n>` / `budget <n>`→budget. Delegates every mutation to `mk_goal`/`mk_goal_status`. | Root command files supported (`prompt.md:1`); thin-router + `$ARGUMENTS` parsing proven (`learn.md`, `search.md`); tool context supplies `sessionID` so command stays state-free (`tool.d.ts:2`–`:15`) (iter 6 F1–F4). Risk: future upstream `/goal` collision — keep swappable to `/goal:*` (iter 6 F1 risk). |
| 9 | **Reuse vs standalone** | **Standalone plugin**, reusing `mk-spec-memory.js` *patterns* (helpers `sessionIdFrom`/`eventPayloadFrom`/`eventTypeFrom`/`invalidateSession`, `output.system` append, status-tool shape) and **porting the `thread_goals` data shape** from Codex/OpenHuman. **No bridge subprocess** (read local JSON directly, fail open). Do **not** reuse global `goalsApi`/`MEMORY_GOALS.md` semantics. | Goal state is local, single-row, hot-path — a bridge is unnecessary overhead (`mk-spec-memory.js:273` vs direct read) (iter 4 F4/F6); global goals are the wrong concept (`goalsApi.ts:1`) (iter 3 F4). |

### Security note (G13)

User-authored objective text enters context **every turn** and again in autonomous continuation prompts, so sanitize + fence it **before persistence and before injection** (iter 3 F6 risk, iter 4 F1, iter 6 F2, iter 9 F2/F4, iter 11 F2):
- Strip/escape control chars and fence-breaking sequences; neutralize role-prefix / instruction-injection patterns ("ignore previous", fake `system:`/`assistant:` turns).
- Enforce a **hard character cap** on the objective (set in build) so a long objective can't dominate the prompt budget.
- Wrap in the clearly-labeled `[active_goal]…[/active_goal]` fence that identifies it as **harness state, not a user instruction**.
- Cap and **redact stored verifier evidence** (`lastEvidence`) — store summaries/references, never raw secrets or full shell output, to avoid leaking transcript/secret data into `.goal-state`.
- **Never auto-extract or run shell commands** from objective text; an explicit `verification.gate` is a separate, opt-in safety design with timeout + captured exit code/output passed to the supervisor as evidence.

---

## 5. Build Sub-Phases (scaffold under `001-goal-opencode-plugin/`)

Ordered by dependency; each is a phase child `^[0-9]{3}-[a-z0-9-]+$`:

| Phase | Scope (one line) |
|---|---|
| `001-state-store` | Port the `thread_goals` JSON record + helpers (`read/mutate/writeAtomic/setGoal/clearGoal/accountUsage`), atomic temp+rename, in-process mutation queue, hex-by-sessionID keying, fail-closed on missing id. |
| `002-injection-plugin` | `mk-goal.js` scaffold: `experimental.chat.system.transform` → `appendGoalBrief` renders the sanitized, fenced, deduped `[active_goal]` block for `active` goals; fail-open. (Passive tier — shippable on its own.) |
| `003-goal-command` | `goal.md` thin root router + `$ARGUMENTS` prelude; `mk_goal`/`mk_goal_status` tools; verbs set/show/clear/complete/pause(/budget); terse `STATUS=` envelopes; post-mutation summary. |
| `004-lifecycle-tracking` | `event` hook: `session.created` restore, `message.updated` evidence capture + guarded `accountUsage`, permission/question blockers, dispose cleanup; `mk_goal_status` budget/verifier fields; `budget_limited` transitions. |
| `005-completion-supervisor` | Supervisor verifier (`met`/`not_met`/`blocked` JSON) on `session.idle` before continuation; `completeGoalIfCurrent` compare-and-set; `completionSource` manual vs supervisor; verifier state in record + `/goal show`. |
| `006-active-continuation` | Enable Tier 2: `maybeContinueGoal` → `promptAsync` with all gates + caps + 3-level kill-switch; smoke mode (log-only) → single real turn → multi-turn, behind `MK_GOAL_AUTONOMY`. |

> 001→002→003 deliver a usable passive `/goal`; 004→005→006 layer in tracking, verified completion, and guarded autonomy. Continuation (006) ships last and default-off.

---

## 6. Risks & Open Decisions

- **Recursive continuation from a plugin hook is unproven.** SDK surface exists (`promptAsync`), but in-hook recursive submission was not smoke-tested. → Phase 006 must log-only first, then a single real turn, before multi-turn. (iter 8 F1)
- **`message.updated` token payload shape unverified.** Installed types prove generic `event`, not token fields. → tolerant extraction; surface `usageSource=unavailable`; no mid-turn hard stop promised until an event/API exposes live totals. (iter 5 F3, iter 10 F5, dashboard build-smoke risk)
- **Plugin tool names in command `allowed-tools` need a real-run check.** Fallback: route through a plugin-owned CLI helper if frontmatter naming differs. (iter 6 F3 risk)
- **Permission/question event coverage in the plugin layer is partial in the types read.** If question events don't reach the plugin, guard continuation via observed `session.status` + `permission.*`. (iter 8 F2 risk)
- **Multi-process concurrency.** Atomic rename prevents torn writes but not two processes mutating one session. → in-process queue for v1; add an exclusive-open lockfile + stale-lock cleanup if multi-process sessions are expected. (iter 7 F2 risk)
- **Resume can resurrect stale work.** Restore active goals but do **not** auto-continue until a fresh user turn confirms the session is live; show age/last-check. (iter 2 F5 risk)
- **No persistent overlay.** Users may miss active state between turns → print state immediately after every mutation; keep injection concise. (iter 11 F1 risk)
- **`/goal clear` has no Codex status equivalent.** If history is wanted, archive with `ended_reason:"cleared"` outside the enum rather than only deleting. (iter 6 F4 risk)
- **Verifier false-positives.** Require concrete evidence; default `not_met` on absent/ambiguous evidence or bare assistant claims. (iter 9 F1 risk)
- **Meta / reducer note:** the deep-research reducer shows `resolvedQuestions: 0` and a `2.1.139` source tree was never found locally (behavior came from app binary strings of `2.1.169`); the per-angle progress table nonetheless marks **G1–G11 complete** and the iteration narratives resolve each angle. Treat the registry counters as a state-log tracking artifact, not unanswered design questions. (dashboard §3; iter 2 Questions Remaining)
