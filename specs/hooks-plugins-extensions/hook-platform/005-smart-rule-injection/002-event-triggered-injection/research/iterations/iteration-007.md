{"timestamp":"2026-09-12T14:39:33.209Z","runtime":"claude","status":"fail_open","freshness":"unavailable","durationMs":80,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_EXIT_64"}
# ITERATION 7 FINDINGS

*This pass read first-hand: `injection-contract.md` (full), `completion/`, `session-lifecycle/`, `goal/` READMEs plus `goal-core.cjs`/`goal-context.ts`/`opencode-goal.js` verdict paths, `post-edit-quality/README.md`, the primary `git-hooks` pre-commit and its README, `git-worktree-guard` + `git-hooks-check` READMEs, all four editor hook configs, the canonical `hook-registry.json` + `sync-hook-registrations.cjs`, both `repo-rules/` files, AGENTS.md (§2–§3, §10), Cursor's hook contract, and the prior iterations of both rounds. What it adds: the **registration envelope as a live, under-documented event-keyed injection family** (and its one condition-keyed instance), a **gate ↔ event cross-map**, the **sync/async transport split inside one settings file**, the **two-prong synthesis** that now has a named witness on each failing prong, and four new candidates — one of which is the first to pass the content (gate) prong and fail the mechanics prong.*

---

## 1. EVENT SURFACE

Iterations 5–6's registered/unwired tables stand; this pass adds rows and corrections, not a re-enumeration.

**The registration envelope is an event-keyed injection family, and the contract does not enumerate it.** Every registration on Claude (`.claude/settings.json:23-197`), Codex (`.codex/hooks.json:8-151`), Cursor (`.cursor/hooks.json:6-100`), and Devin (`.devin/hooks.v1.json:8-158`) wraps its adapter as `node <adapter> || { <stderr line>; <fallback JSON> }`: on adapter-resolution failure the fallback returns the host's expected envelope carrying a model-directed remedy string (`hookSpecificOutput.additionalContext`, or Cursor's `agent_message`) plus `"mkHookDrift": true`. One canonical emitter generates them (`.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:45`, `:70`, `:84`); per-runtime text lives in the canonical registry (`.../runtime-mirrors/hook-registry.json:8-51`); the contract is documented per runtime (`.opencode/skills/system-spec-kit/runtime/hooks/claude/README.md:5`, `codex/README.md:33`, `cursor/README.md:14`, `devin/README.md:49`) and pinned by a test (`.../runtime/tests/hook-adapter-path-parity.vitest.ts:223-233`). Two consequences: (i) "can this event transport model text" is already answered for every registered event — the envelope is in use there; (ii) a grep of `.opencode/hooks/**` for `mkHookDrift`/`mk-hook-drift` returns zero matches, so `injection-contract.md`'s claim to catalog "every injection point by content" (`:18`) has a live gap.

**One condition notice already rides the envelope — the class the round keeps treating as refused.** Claude's SessionStart chain runs `install-codex-hooks.mjs --check` and, on failure, emits `"[codex-hooks] drift detected - run: node .opencode/bin/install-codex-hooks.mjs --check"` through the envelope (`.claude/settings.json:132`; same on Cursor `.cursor/hooks.json:31`). Devin echoes the same text as plain stdout (`.devin/hooks.v1.json:28`); Pi runs the check via `ctx.exec` inside `session-start-advisories` (`.pi/extensions/README.md:69`); Codex's own config has no self-check (consistent with `coverage-rationale.md:66`). So a condition-keyed, model-visible remedy notice is shipped behavior on two runtimes — the "advisory family is stderr-only" reading (per `injection-contract.md:252-256`) is true of worktree/git-hooks/dist checks, not of this instance.

**Same file, two transports.** Claude's Stop registrations are `"async": true` (`.claude/settings.json:146`, `:152`); the PostToolUse registrations are synchronous (`:176`, `:186` — timeout keys only). Any completion-lane injection inherits a fire-and-forget transport; the edit lane does not.

**Cursor's unused set gains two names.** `beforeShellExecution` / `afterShellExecution` are documented (`.opencode/skills/cli-external-orchestration/cli-cursor/references/hook-contract.md:71`) and unregistered (`.cursor/hooks.json` contains none). Nothing candidate-shaped rides a shell-execution event that the dispatch/audit blocks do not already cover elsewhere; parity, not injection.

**Gate ↔ event cross-map (new).** The primary pre-commit's seven blocking sub-gates (`git-hooks/README.md:102`): comment hygiene (edit-time detector + prompt directive), agent-mirror sync (`pre-commit:86-105`, no bypass), mirror parity (`:107-168`), prompt-card sync (`:171-189`) are commit-only; route/spec remint self-heal (`:526`, README `:102`); tool ownership is deliberately CI-only (`:532-535`). The post-edit router's table covers only artifact-property classes (`post-edit-quality/README.md:44-53`); dist staleness is the one shipped condition notice kept out of the table (`:54`).

**Read-only / unused summary.** Unchanged from iterations 5–6: session start, prompt submit, turn-end family, and compaction fire on read-only sessions; tool events are shape-keyed no-ops; session end is `[NONE]`; the unused sets are inherited. The drift family above can fire on any event, including read-only ones.

---

## 2. IDEA ONE — completion presentation

**REFUSE — unchanged; deciding test remains iteration 6's measured frequency and iteration 5's event position.** Three new first-hand facts, no restatement:

- **The completion lane is the async one.** On the runtime where an upgrade would ride an existing registration, Stop is `async: true` (`.claude/settings.json:146`, `:152`) while the edit lane is synchronous (`:176`). The envelope itself proves Stop *can* carry `additionalContext` (drift fallback `:150`) — the obstruction is not capability; it is the recorded advisory-only decision (`completion/README.md:20`, `:133`), the consent class unchanged.
- **"A goal was met" leaves no durable model-visible artifact to attach guidance to — verified in code this time.** OpenCode's supervisor writes the verdict and completes the goal on `met` (`opencode-goal.js:2423-2428`; `opencode-goal-supervisor.test.cjs:114-117`), and only `active` records inject (`goal/README.md:42`). The shared core computes the heuristic verdict at turn end and uses it *only* for the not-met nudge (`goal-context.ts:229-239`); nothing writes `lastVerifierVerdict` on that path, so the rendered `last_check` falls back to `not_evaluated` (`goal-core.cjs:526-527`). Both engines produce silence on met, by construction.
- Standing legs, one line each: payload resident (`AGENTS.md:404-409`, close-out verbatim `:501`); mode contracts own their reports at the rule's own moment (`presenting-decisions.md:129-132`); upgrade of the sentinel channel is the twice-refused consent class (prior round `iteration-010.md`).

---

## 3. IDEA TWO — structured question triggering

**REFUSE as designed. The timing problem is solvable as detection and fatal as remedy — fatal on authorship, not timing.** One-line inheritance: the one machine-authored ask is fixed-enum and forward-looking and already ships (`injection-contract.md:72-84`); the mid-run continuation class is open and already carries it where a mutation bounces (`:40`, `:150-154`); the rewrite surfaces (Pi `message_end`, OpenCode `chat.message`) remain authorship violations (NC-C, iterations 3–4).

New this pass: **the detection leg itself degrades to 5 of 6.** Cursor has no per-turn boundary at all — `stop` never fires under `cursor-agent -p`, `afterAgentResponse` is unwired (iteration 5's correction; `completion/README.md:67`'s Cursor row is orphaned, `hook-registry.json:223-263` has no binding). And a detector could not even name its tool on three surface-table rows: OpenCode "name not recorded", Codex "unverified" (`.opencode/skills/system-commands/…` no — `repo-rules/handoff-and-questions.md:125-131`), while the rule forbids guessing names (`:138-140`). Plainly: **fatal.** Not because the judgment is hard, but because a missed ask has no author outside the model, and the harness cannot compose a question it was not given.

---

## 4. NEW CANDIDATES

Same bar; portability noted; each refusal decided by a named test.

**G-1. Generated-anchor rows in the post-edit router** (mirror parity / agent-mirror sync / prompt-card sync at the edit).
- *Event/runtimes:* `PostToolUse`/`tool_result` on edits to anchor sources (agent files, command files, card/docs); all six fire, settlement per NC-A (3/6 model-visible today).
- *Payload:* "this file fans out into generated mirrors; the pre-commit `mirror-parity` gate blocks until they are regenerated and staged."
- *Silence:* none that survives the test — the failure state (anchor newer than mirror) is **the legitimate intermediate state of a correct edit → regenerate → stage workflow**, so the finding fires on the compliant path itself, on every anchor edit.
- *Wrong-fire cost:* noise on correct work; degrades the router's "one checker per edit" discipline (`post-edit-quality/README.md:16`).
- *Portability:* fails. The regenerators are hub-internal (`.opencode/scripts/git-hooks/pre-commit:146-151`: `system-spec-kit/...`); a payload cannot name them, and without a runner it is not actionable.
- *Bar side — the round's first content-passes/mechanics-fails candidate.* The prohibition is specific and gate-enforced (survivor content), and the commit gate's message already names the fix (`pre-commit:166`: "regenerate the mirror the message names, git add its output, and re-commit"); what fails is the event: every other gate in this family is a **final-state** check, and its violations are transition states. The accepted counterexample (dist staleness, `post-edit-quality/README.md:54`) is kept out of the dispatch table and is the *only* detector for its condition; mirrors already have three (local gate, CI's mirror job per `pre-commit:107`, the sync `--check` scripts).
- *Deciding test:* **final-state vs intermediate-state, plus gate-message completeness.** REFUSE.

**G-2. Enforcement-drift notice (git hooks missing/broken) made model-visible at SessionStart.**
- *Event/runtimes:* `SessionStart` on Claude/Codex/Cursor/Devin (`git-hooks-check/README.md:57-62`); Pi/OpenCode absent.
- *Payload:* "the commit/push gates are not installed; run the installer."
- *Silence:* genuinely rare — only `missing`/`broken`/`mismatched`/`non-executable` symlinks (`:34-39`).
- *Wrong-fire cost:* the remedy is **context-forbidden where self-heal declined**: the check skips auto-install in a linked worktree precisely because "installing from a session tree would point the shared symlinks at scripts that vanish when the worktree is removed" (`:47`). A model told to run the installer from that context would execute the documented hazard.
- *Portability:* passes — repo-level bins, not hub-internal paths.
- *Bar side — refused on the mechanism test.** Where the action is safe, the mechanism already performs it silently (self-heal when live-sync is enabled from the main checkout, `:20`, `:47`); where it does not, the remedy is the one the design forbids there. The candidate's domain is empty. The in-fleet precedent (codex-hooks notice, `.claude/settings.json:132`) differs exactly in this: its remedy is context-independent.
- *Deciding test:* **mechanism-already-answers (E3's test, first applied to the enforcement-infrastructure event) + remedy-context-forbidden.** REFUSE.

**G-3. Stuck-loop notice — derived "same failure repeated N times" event.**
- *Event/runtimes:* constructed from tool results; sources exist on all six, model-visible settlement only on NC-A's set. First **harness-state** candidate of the round.
- *Payload:* the repetition count + `AGENTS.md:192` ("stop local retries at the code skill's repeated-failure limit").
- *Silence:* best by construction — only a stuck session repeats an identical-failing command; this is C4's refused candidate with its frequency objection removed (`iteration 6 §4 C4`).
- *Wrong-fire cost:* mid-debug trust damage; identical command ≠ identical failure (files change between runs), and a bounded-state store (shape of the OpenCode call-ID correlation map, `post-edit-quality/README.md:71`) must be built new.
- *Portability:* passes (framework text + derived count).
- *Bar side — retired.* No adjudicator adjudicates "you kept retrying" (the gate inventory's subjects are comments, mirrors, cards, deletion volume, mutation class, routes, metadata, tools — `git-hooks/README.md:102`), so it fails via C2's lesson. The only shipped state-note precedent is the goal nudge, which carries **operator-authored** state with consent (`goal-context.ts:233-239`); a failure counter is harness-authored, with none.
- *Deciding test:* **no adjudicator (C2's test, applied after C4's objection was neutralized) + harness-state consent.** REFUSE.

**G-4. Recorded, bad by construction: make the worktree-guard warning model-visible.**
- The payload would ask the model to do what it cannot — relocate its own already-started session ("A SessionStart hook cannot relocate an already-started process", `git-worktree-guard/README.md:18`); the remedy is a launch-time operator choice naming `worktree-session.sh` (`:36`), and the guard itself exempts orchestrated children (`:31`). A model-visible copy of a message addressed to the operator's next launch teaches nothing actionable. REFUSE — recorded because nobody proposed it and the reason is structural.

---

## 5. VERDICT

1. **Idea One — REFUSE.** Deciding test: **measured frequency + event position** (iteration 6), now with the transport fact: on the one runtime that could carry it, the completion lane is async and the state it names ("goal met") is transient-by-design in both engines (`opencode-goal.js:2423-2428`; `goal-context.ts:229-239`).
2. **Idea Two — REFUSE as designed.** Deciding test: **content authorship**; detection ceiling 5/6, surface names unverified on three rows, no-invented-names rule (`handoff-and-questions.md:125-140`).
3. **G-1 generated anchors — REFUSE.** Deciding test: **final-state vs intermediate-state** + portability + complete gate message. First candidate to pass the content prong and fail mechanics.
4. **G-2 enforcement drift — REFUSE.** Deciding test: **mechanism already answers the event** (`git-hooks-check/README.md:47`) and the remedy is context-forbidden where it does not.
5. **G-3 stuck-loop — REFUSE.** Deciding test: **no adjudicator** (C2's test) after C4's frequency objection was removed — frequency was necessary, not sufficient.
6. **G-4 worktree-guard model-visible — REFUSE by construction.**
7. **NC-A — status unchanged; evidence strengthened, nothing newly admitted.** The same PostToolUse registration already carries model-directed remedy text on its failure path (`.claude/settings.json:175`), and Codex's registration does too (`.codex/hooks.json:106`); the live `claude --debug` delivery probe remains the standing adoption gate, and the self-kill condition (stdout reaching the model) is unresolved offline.

**The round's structural finding.** Admission needs two independent prongs: a **gate-backed content prong** and an **event-timing prong**. C2 (read-ledger) had perfect timing and no adjudicator; G-1 has a real adjudicator and no clean timing; NC-A is the only object that passes both — because its checkers' findings are properties of the edited artifact's final state, and its prohibition is enforced by a pre-commit gate. Every event-keyed injection the fleet ships without controversy (`mkHookDrift` family, codex-hooks notice) rides the registration envelope and adds no new admission; the moment a detector wants to *compose new content* at an event, the consent ledger opens and this round's refusals are the ledger.

**Fleet notes to reconcile (not candidates):** (a) `mkHookDrift` is absent from `injection-contract.md` — close the enumeration gap or state the exclusion; (b) Devin's codex-hooks drift notice is plain stdout while Claude/Cursor use the model-visible envelope (`.devin/hooks.v1.json:28` vs `.claude/settings.json:132`) — verify intended, else parity miss; (c) the sentinel's measured dominant-class defects (iteration 6, log `:468`, `:476`) remain detector-quality backlog, unchanged.
