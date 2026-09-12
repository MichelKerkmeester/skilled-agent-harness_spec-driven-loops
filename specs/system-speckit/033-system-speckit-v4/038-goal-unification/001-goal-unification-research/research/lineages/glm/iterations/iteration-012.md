# Iteration 12: A5 — Verify or refute run 1's runtime feasibility table (D5)

- **Lineage:** glm (cli-pi, glm-5.3-flash) - Program iteration 12 of 15, run 2 of 5 (charter allocation row 12)
- **Question:** Does run 1's runtime feasibility map survive line-verification — identity sources, command/hook surfaces, injection caps — and can any of its UNKNOWN host caps be closed?

## Actions Taken

1. Line-verified the pi adapter: identity options, command registration, injection/restore/verify events.
2. Grepped the goal hub README for the delivery matrix and compared every anchor run 1 cited, with mtimes to distinguish file drift from citation drift.
3. Line-verified the plugin's caps, option/identity normalization, key schemes, and renderer gate.
4. Inventoried the four host surfaces: `.devin/` (hooks + goal-artifact search), `.claude/` (hooks, command, memory goals), `~/.codex` (goals SQLite, prompt), `.cursor/` (command contract).
5. Re-verified the Devin-removal citations (009/006) and hunted the pi host injection cap in the installed runtime's own docs.

9 evidence calls (7 bash, 1 head-read equivalent via awk, 1 docs grep) — inside the 8-11 target.

## Findings

### F1. pi: every substantive claim verified; the delivery-matrix anchors were wrong, and the file predates run 1

Identity: `goalOptions(ctx)` builds the scope from `sessionId = ctx.sessionManager.getSessionId()` (`:73`, fail-closed comment `:75`) and `cwd: ctx.cwd` (`:78`) (`[SOURCE: .opencode/hooks/goal/pi/goal-context.ts:70-81]`) — run 1's `:70-79` resolves. Command: `pi.registerCommand("goal-pi", …)` at `:178-181` — exact. Events: `pi.on("input")` returns `{action: "transform", text: …}` with a fail-open catch (`:183-195`, transform at `:190`); `pi.on("session_start")` at `:197`; the `turn_end` verifier is described (and constrained) by the comment at `:166-171`: those events are `void`-returning, so the nudge "never re-queues, steers, or blocks a turn". The README's delivery row (`[SOURCE: .opencode/hooks/goal/README.md:66]`) confirms all of it verbatim — "input → {action: "transform", text: …} (per-turn injection, chains additively) … `/goal-pi` shells to `bin/goal.cjs` with scope flags". **Citation correction:** run 1 (deepseek it-005 F1; research.md:170) cited `README.md:96` — that line today heads the KEY FILES table (`:96-104`), whose `:102` row merely echoes the pi claim. The README's mtime (Sep 6 19:51, before run 1 began) proves the file did not change: these are prose-precision errors, not repo drift.

### F2. The plugin row: caps exact; two new facts widen the known drift surface; two citations imprecise

- Caps: `DEFAULT_MAX_OBJECTIVE_CHARS = 4000` / `DEFAULT_MAX_GOAL_PROMPT_CHARS = 4000` / `DEFAULT_MAX_INJECTION_CHARS = 4800` at `[SOURCE: .opencode/plugins/opencode-goal.js:29-31]` — exact, plus neighbors run 1 never cited (`:32-33` reason 280 / evidence 1200).
- **NEW — the budget policy is duplicated, not just the renderer:** the plugin carries its own copies of the derivation constants — `PROMPT_OVERHEAD_CHARS = 1900`, `OBJECTIVE_PREVIEW_RATIO = 0.12`, `OBJECTIVE_PREVIEW_MIN_CHARS = 60`, `OBJECTIVE_PREVIEW_MAX_CHARS = 600` (`[SOURCE: .opencode/plugins/opencode-goal.js:45-48]`) — the same numbers it-008 traced in the core (`goal-core.cjs:67-68`, not re-verified here). R3 ("two implementations drifting") is therefore wider than two renderers: the *numeric policy* exists twice, and only theGolden-comment convention keeps them aligned.
- Identity: run 1 cited `:281` (ctx.directory) and `:334` (sessionID). Reality: `:281` is the *normalized option* field (`directory: typeof options.directory === 'string' …`), not a context read; `:333-339` is `requireSessionID` — whose fail-closed contract matches the core: `throw new GoalError('MISSING_SESSION_ID', 'Missing session id; refusing to read or write shared goal state')` (`[SOURCE: .opencode/plugins/opencode-goal.js:333-339]`). The actual context extraction is `sessionIdFromContext` at `:353-356`, and it is **more** permissive than run 1 recorded: `context.sessionID || context.sessionId || context.session?.id` — three accepted spellings (`[SOURCE: .opencode/plugins/opencode-goal.js:353-356]`).
- Key schemes: sha256 at `:358-360`, hex-legacy at `:362-364` — both exact as cited (`[SOURCE: .opencode/plugins/opencode-goal.js:358-364]`).
- Renderer: `renderGoalInjection` at `:2614`, active-gate at `:2615` — exact (corroborates it-002's F1).

### F3. Devin: the verdict survives, the hook enumeration was incomplete, and the preservation clause is exact

`.devin/hooks.v1.json` registers **four** events — `SessionStart`, `UserPromptSubmit`, `Stop`, `SessionEnd` (grep over the 178-line file) — not the two run 1 listed; the extra `Stop`/`SessionEnd` chains make the hook side *richer* than "SessionStart, UserPromptSubmit" (`[SOURCE: .devin/hooks.v1.json]`, 178 lines). No goal artifact exists under `.devin/` (find: none) — confirmed. The Devin-runtime documentation row resolves exactly: `post-compaction.cjs` — "Devin fires `PostCompaction` *after* compaction with only `session_id` + a possibly-null `summary`" (`[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/devin/README.md:42]`), and the Stop adapter "reads the active packet from the shared `lastSpecFolder` state file" (`[SOURCE: .../devin/README.md:41]` — independently corroborating it-011's F1 carrier reading). The removal/preservation pair: 009 REQ-010 at `009/spec.md:150` (verified in it-011) and — exact — REQ-008: "`.devin/hooks.v1.json` and non-goal Devin hook/skill paths remain byte-unchanged in the Phase 6 diff" (`[SOURCE: specs/hooks/009-goal-isolation/006-opencode-goal-optimization-and-devin-removal/spec.md:156]`). The current hub README also carries a Devin row run 1 never mentioned: **by-design: same. No adapter.** (`[SOURCE: .opencode/hooks/goal/README.md:71]`) — so "defer" is not just an inference from the 009 packet, it is the hub's own present-tense contract.

### F4. claude-code: the filesystem facts re-confirm; the by-design clause is now precisely located

44 `goal_*.md` files under `~/.claude/projects/*/memory/` (count: 44 — exact as it-005 F3 claimed); no goal command in `~/.claude/commands` (listing: none); 22 hook files under `.claude/hooks/`, none goal-named. The "by-design" declaration resolves at `[SOURCE: .opencode/hooks/goal/README.md:69]` ("goal state ships only on native session-bound goal surfaces. No adapter in this core."), not at `:102` as run 1 had it. Run 1's "defer to native; nesting via speckit/conversation" now rests on the repo's own contract sentence, not only the operator constraint.

### F5. codex: the private store facts confirm exactly

`~/.codex/goals_1.sqlite` (32,768 bytes, WAL/SHM sidecars), a `~/.codex/sqlite/` copy (plus `codex-dev.db`), and `~/.codex/prompts/goal_opencode.md` — all present. By-design row at `[SOURCE: .opencode/hooks/goal/README.md:70]`.

### F6. cursor: the "degraded" verdict is the command's own documented contract, not a characterization

`/goal-cursor` is a deliberate no-op: "Cursor's prompt-command surface does not expose the same identity, so management is intentionally unsupported"; its contract is `STATUS=FAIL … ERROR="Cursor command lacks native session identity"`, `code=UNSUPPORTED_SESSION_BINDING`, and its instruction is "Do not run tools or mutate goal state" (`[SOURCE: .cursor/commands/goal-cursor.md:11-33]`). The delivery row resolves at `[SOURCE: .opencode/hooks/goal/README.md:67]` — "Injection-only: no management (prompt commands don't receive native identity), no mid-session refresh, no verify/continue. Model-visibility is recorded-evidence, not a proven end-to-end guarantee." — which it-005 paraphrased faithfully ("recorded as evidence rather than a proven guarantee") but cited at `:99`.

### F7. The charter's contract-path erratum is confirmed, and the file is healthy where it actually lives

`.opencode/hooks/hooks/` does not exist; the real contract is `.opencode/hooks/injection-contract.md` (21,938 bytes), and the goal hub's own references use the one-level-up path (`[SOURCE: .opencode/hooks/goal/goal-plugin.md:162]`, `[SOURCE: .opencode/hooks/goal/README.md:168]`). it-005 F6 confirmed.

### F8. Host-injection caps: theUNKNOWN verdict stands, now with a documented negative search

The installed pi runtime's extension docs define the `input → transform` mechanism (`[SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:288]`, `:917`, `:931-955`) and its truncation guidance — but the documented limits there (50KB / 2000 lines, `:2170-2183`) govern **tool output**, not injected prompt text. No character cap for transform/injected text is documented. The other hosts were not searched beyond this repo. Conclusion: run 1's UNKNOWNs for pi/cursor/devin/claude/codex host caps **stand**, and the design counsel (treat the core's 4800 as the only enforced ceiling; fit the smallest known preview) needs no change — it now rests on a recorded search, not just absence of knowledge.

## Run-1 claim verification table (A5)

| # | Run-1 claim (its citation) | Verdict | Resolving citation (run 2) |
|---|---|---|---|
| 1 | pi identity (goal-context.ts:70-79) | **confirmed** | `goal-context.ts:70-81` (identity `:73`, cwd `:78`) |
| 2 | `/goal-pi` (goal-context.ts:178) | **confirmed, exact** | `:178-181` |
| 3 | pi events + additive transform (README:96) | **confirmed; anchor wrong** | delivery matrix `README.md:66` (KEY FILES at `:96-104`) |
| 4 | cursor restricted surface (README:99) | **confirmed; anchor wrong** | `README.md:67`; refusal contract `goal-cursor.md:11-33` |
| 5 | opencode separate, no core import (README:31) | **confirmed; anchor wrong** | `README.md:25` |
| 6 | claude/codex by-design (README:102-103) | **confirmed; anchor wrong** | `README.md:69-70` (Devin row `:71`, unnoticed by run 1) |
| 7 | plugin caps 4000/4000/4800 (plugin:29-31) | **confirmed, exact** | `opencode-goal.js:29-31` |
| 8 | plugin workspace/identity (:281, :334) | **imprecise** | option field `:281`; fail-closed `:333-339`; context extraction `:353-356` (three spellings) |
| 9 | plugin keys sha256/hex (:358, :362) | **confirmed, exact** | `:358-360`, `:362-364` |
| 10 | devin hook events (hooks.v1.json:1) | **confirmed, incomplete** | four events: SessionStart, UserPromptSubmit, **Stop, SessionEnd** |
| 11 | no goal artifacts (.devin/.claude) | **confirmed** | find: none; `.claude/hooks/` 22 files, none goal |
| 12 | 44 Claude memory goal files; no /goal | **confirmed, exact** | count 44; `~/.claude/commands` has no goal |
| 13 | codex goals SQLite + prompt | **confirmed** | `~/.codex/` listing |
| 14 | 009:150 / 006:156 (Devin removed / preserved) | **confirmed, exact** | `009/spec.md:150`; `006-…/spec.md:156` |
| 15 | charter path doubled (README:31→) | **confirmed** | real: `.opencode/hooks/injection-contract.md` (21,938 bytes); referenced as `../injection-contract.md` at `goal-plugin.md:162`, `goal/README.md:168` |
| 16 | host caps UNKNOWN | **stands** | pi docs: transform mechanism documented, no char cap (`extensions.md:905-955`, truncation guidance is tool-output: `:2170-2192`) |

## What worked / what failed / ruled out

- **Worked:** pairing every citation check with an mtime — it separated "the repo moved" from "the prose drifted" in one look (all four goal-surface files predate run 1).
- **Failed:** the plugin's `ctx.directory` read site was not located (the `:281` line is the normalized option, not the read); the pi host-cap search found mechanism but no number — recorded as a negative, not a gap silently closed.
- **Ruled out:** (a) *the README drifted after run 1* — mtimes Sep 6/Aug 21/Aug 15, before the run-1 window (Sep 11 07:23-07:31); (b) *a documented pi injection cap* — the runtime's only documented truncation rule covers tool output, not input transforms.

## Assessment

- `newInfoRatio`: 0.55 — genuinely new: the budget-policy duplication in the plugin (`:45-48` vs core `:67-68`), the three-spelling session-identity acceptance, the complete Devin event set (Stop/SessionEnd) and the hub's own Devin/Claude/Codex "by-design" rows, the recorded negative on the pi host cap, and four relocated README/plugin anchors; the remainder is faithful confirmation of run 1's substance.
- Convergence telemetry: 0.55 >> 0.05 — no convergence signal; continuing per stop policy.
- Confidence: high on every row (all read directly this iteration); the `:281`-read-site question is the only open detail, flagged as such.

## Recommended Next Focus

Iteration 13 (A6+A7): reconcile the 009 isolation invariants with the auto-update authority ladder — with the corrected ADR line numbers from it-011 as the entry points.
