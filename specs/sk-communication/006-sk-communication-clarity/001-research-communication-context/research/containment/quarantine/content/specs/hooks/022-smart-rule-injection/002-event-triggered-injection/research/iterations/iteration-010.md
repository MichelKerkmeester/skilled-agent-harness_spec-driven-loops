{"timestamp":"2026-09-12T14:58:21.654Z","runtime":"claude","status":"fail_open","freshness":"unavailable","durationMs":168,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_EXIT_64"}
All sources verified. Composing the final iteration.

# ITERATION 10 FINDINGS

*This pass read first-hand: `injection-contract.md` (full), the completion / session-lifecycle / goal READMEs, the spec-gate README + `spec-gate-core.mjs`, the Claude / Pi / OpenCode enforce adapters, `.claude/settings.json` (full), the whole `git-hooks/pre-commit`, the spec-gate warning log, `session-prime.ts`, `AGENTS.md` (§2 Gate 5, §10), both `repo-rules/` files, iterations 1–8 of this round and `001`'s iteration 10, and the Pi extensions doc. It does not restate iterations 1–9; it tests them and adds four surfaces they never opened — the spec-gate warning log (never measured by anyone), the Pi enforce adapter (code), the `session-prime` startup path (code), and Pi's `agent_end`/`agent_settled` semantics (docs).*

---

## 1. EVENT SURFACE

The registered matrices of iterations 5/7/8 stand as written; this pass adds rows and one measured column, not a re-enumeration.

**The event nobody indexed until now: the spec-gate advise.** `evaluateMutation` returns `{decision:'advise', detail: GATE_3_QUESTION}` for any mutation — including every `bash` call — while the gate is open and unanswered (`spec-gate-core.mjs:1486`; deny-capable set is write/edit only, `:126`). It is a tool-time event on all six runtimes, and **it is the loudest event in the fleet, measured:**

- `.opencode/skills/.state/spec-gate/spec-gate-warnings.log` holds **2,096 lines spanning 2026-09-11T18:27:15 → 2026-09-12T15:04:25** (~21 h) plus a rotated `.1` (`:1`, `:2096`).
- The file's first 462 lines span 57 minutes (18:27–19:24), ≈8/minute across 4–6 concurrent Claude sessions. Dominant class: **`bash | - | advise`** — no file attribution, so read-shaped commands are indistinguishable from mutations. `write … would-deny` entries are rare (`:6`, `:103`, `:218`, `:2073`).
- Individual sessions hold the gate open for 40+ minutes of continuous traffic (`d22f591e…` advises from `:2` through `:397`; `a475b3da…` from 14:11 through 15:04).

**Delivery of that event is split, code-verified:** Claude emits the literal question as `additionalContext` on every advise (`spec-gate-enforce.mjs:40-48`); Codex/Devin share the envelope and Cursor lists advise without a stated channel (`spec-gate/README.md:45-47`); **Pi drops it** (the deny-only handler returns `undefined` on advise, `pi/spec-gate-enforce.ts:44-51`) and **OpenCode logs it** (`system-spec-gate.js:264-278`). This split is candidate C-1.

**Pi's uncharacterized events, finally characterized** (iteration 1 listed them unused, nobody said what they are): `turn_end` fires per LLM response ("one LLM response + tool calls", pi docs `extensions.md:601-603`), while `agent_end` may still continue (retry/compaction/follow-up) and **`agent_settled` is the only event meaning "Pi will not continue running automatically"** (`extensions.md:311-312`, `:569-570`). Both unregistered fleet-wide; this is candidate C-2.

**Read observation does not exist anywhere.** Claude's five `PreToolUse` matchers are Bash / Task / Task|Agent / `mcp__claude_ai_.*` / Write|Edit (`.claude/settings.json:17-77`) — no Read matcher; Cursor's `beforeReadFile` is documented-but-unwired (cursor README `:38`). The entire read-side of the framework's obligations (Law 1, Gate 5's load-before-action) has **no event to key on in any runtime**, which is the structural reason C2's read-ledger was unsound and a fresh answer to why the read-side stays at Gate 5.

**Read-only sessions:** the iteration-5/6 set stands, with one addition — "read-only" is not a guarantee of quiet once a gate opens. A session that classified as mutation-intent and never resolved keeps advising through read-shaped bash traffic; the log's dominant class is exactly that.

**Unused sets:** inherited unchanged (Cursor's eight wired-nowhere events, Claude `PermissionRequest` deliberately unclaimed, Pi ~25/33); **new names added: `Notification` (Claude, unregistered, operator-facing channel with no model window) and `agent_settled`.** No new consumers appeared in this pass.

---

## 2. IDEA ONE — completion presentation

**REFUSE. The deciding tests — trigger absence, measured frequency, consent class, event position, restatement — stand by name and are not restated. This pass adds two first-hand facts, both in the "does the event even reach anything" column.**

1. **The completion event's one historical model-facing product has a retired reader.** The startup path that used to carry a session summary forward is now a pure fallback: `handleStartup()` returns only `Session Context` + `Recovery Tools` (`session-prime.ts:144-156`), and its own comment says why — "the startup brief and the cached session summary both came from a structural index that no longer exists, so the fallback surface is the only surface left" (`:141-143`). The session you are reading this in received exactly that fallback. So the completion event does not merely fail to reach the presentation rules; **the last model-visible consumer of anything completion-shaped on the session-start side was retired with the index.** (Fleet note: `session-lifecycle/README.md:35` still documents a "Session Continuity" section — stale against the code.)
2. **On the one runtime where a completion check *is* model-visible, its placement is the wrong event.** Pi's sentinel evaluates at `turn_end` (`completion/README.md:68`), which is per-LLM-response (pi docs `:601-603`) — it can evaluate messages that are not the run's final state — while `agent_settled`, the event that fires exactly once when no continuation is coming (`:569-570`), is unregistered. Even the shipped advisory is not aimed at the settled moment.

**Worth the channel? No, and now for a sharper reason: there is no longer a channel for this event's own product on any runtime, and the only runtime that injects anything completion-shaped points its check at a different event.** The payload itself remains resident (`AGENTS.md:404-409`, `:501`) and mode-delegated (`presenting-decisions.md:129-132`). No new object exists; nothing here reopens the refusal.

---

## 3. IDEA TWO — structured question triggering

**FATAL — stated plainly, as asked: the timing problem is solvable as *detection* and fatal as *remedy*, finally on authorship, not on timing.** The deciding tests are named: mid-run continuation class already services the action-shaped subclass (I5 test A); stable-identity re-arm cannot carry a one-shot question (I6); every surface that has the reply can only rewrite or append it, and that is an authorship violation on two runtimes (I3/I4 NC-C, inherited); I8's authorship + disjointness closure stands.

**The one untested variant, tested this pass — the deferred nudge.** Judge the prior reply at the *next prompt* (the first moment after the reply exists and the last moment the model still composes). Mechanically available (backward reads are production). Refused, four ways:

- The predicate is still uncomputable: "options enumerated + no question" fires on the compliant prose default (`handoff-and-questions.md:108-110`) — this lineage's own reports are the counterexample class.
- The operator's next message frequently *is* the decision ("go with B, but…") — the nudge is noise on the common path and absent on the rare one.
- The payload is a disposition-shaped restatement of §4 with no gate leg.
- **And empirically: the fleet is already running the closest possible experiment — repeat the ask at every opportunity — and it does not convert.** See C-1: the spec-gate advise emits the full A–E question into Claude's context on every un-scoped call and the measured gates stay open for tens of minutes of traffic. Either the model relayed and the operator ignored it, or the model never acted; in both readings, more injection volume is not the fix.

No runtime gained an authoring surface since iteration 5 — the projection seam and the fable guard are rewrite/deny actors, never authors. **Class closed; the only surviving form is the one already shipped (fixed-enum, pre-composition), and its tool-time backstop is the subject of C-1.**

---

## 4. NEW CANDIDATES

Held to the same bar: event + runtimes, silence, wrong-fire cost, portability, bar side. None is named by the operator. All four are outside the named list (completion / goal-met / turn-end / session-end / gate).

**C-1. Gate-3 question parity at the tool-time event (Pi + OpenCode) — "inject the ask everywhere the other runtimes already do."**

- *Event/runtimes:* tool-time enforce, 6/6 fire. **Delivery: 3 of 6 model-directed confirmed** — Claude code-verified (`spec-gate-enforce.mjs:40-48`), Codex/Devin per contract (`spec-gate/README.md:45,47`); Cursor lists advise without a channel (`:46`); **Pi drops it in code** (`pi/spec-gate-enforce.ts:44-51`); **OpenCode logs it** (`system-spec-gate.js:264-278`).
- *Silence condition:* **measured absent** (§1): ~8 emissions/minute in the sampled hour, 2,096 in ~21 h, dominant class bash-with-no-file — the loudest event in the fleet, not a rare discrete one.
- *Wrong-fire cost:* injecting the full A–E menu into every un-attributed bash call of an unresolved session; the measured fleet shows exactly that state persisting for 40+ minutes without resolution.
- *Portability:* clean — payload is core-owned (`GATE_3_QUESTION`, `spec-gate-core.mjs:131-138`), transports are skill-owned; nothing hub-internal, no corpus contact.
- *Bar side — retired, and this is the round's most instructive refusal:* its **content passes** — it literally *is* the one machine-authored, fixed-enum ask class the round admits (the surviving form of Idea Two) — and it still fails, on the empirical half: the measured production behavior of "inject the ask at the event" is a firehose that does not resolve its own state. Extending delivery to two more runtimes would scale a non-functioning loop. The corrective direction, if the spec-gate concern acts, is its own default-off suppression machinery (`spec-gate/README.md:30,101`) or transport policy — not parity. **REFUSE; the measurement is the finding.**

**C-2. Pi `agent_settled` — the only event that means "no continuation is coming."**

- *Event/runtimes:* Pi only, 1/6 (partial answer, stated). `agent_settled` fires when retry/compaction/follow-up are exhausted (pi docs `:311-312`, `:569-570`); unregistered (I1's slot, now characterized).
- *What it is uniquely positioned to carry:* **no injectable object.** Every payload shape at that moment is the resident close-out layer (`AGENTS.md:501`), and the one real use is *detector placement*: move the completion sentinel's evaluation from per-LLM-response `turn_end` to the settled moment, so it reads the run's true final state once. Whether that reduces the measured 477-fire volume is for the completion concern to measure.
- *Silence:* strictly rarer than `turn_end`; not constructible as an injection domain.
- *Wrong-fire cost / portability:* n/a.
- *Bar side — retired as injection; recorded as backlog.* **REFUSE as a hook; RECORD the placement defect.**

**C-3. The dispatch-completion event (CLI dispatch audit) → "delegated output is a claim about itself."**

- *Event/runtimes:* `PostToolUse` Bash on dispatch shapes on Claude (`.claude/settings.json:185-188`), `[LOG]` on 6/6 by contract — "a pure telemetry hook. It has no `additionalContext` path at all" (`injection-contract.md:177-181`).
- *Silence:* genuinely rare and discrete — the best silence in this candidate set.
- *Wrong-fire cost:* low.
- *Bar side — retired.* The payload is resident **unconditionally** (`AGENTS.md:239`, `:245`), and no adjudicator covers "did you verify the delegate" — the gate inventory adjudicates artifacts (comments, mirrors, cards, mutation-class, derived metadata, routes: `pre-commit:40-537`), never a verification act. This is C2's lesson at a new event: **perfect silence plus no adjudicator is still a refusal.** **REFUSE.**

**C-4. Recorded, bad by construction — guard-status announcement at SessionStart ("which kill switches are set").**

- The obvious debug-shaped idea nobody proposed. It is operator configuration, not a rule obligation; it inverts the fleet's fail-open-silence posture (`injection-contract.md:20`); it is the constant every-session shape; nothing the model can do changes an env var, so no action window exists. **REFUSE — recorded because it is the temptation every future event-round will have.**

---

## 5. VERDICT

Ranked; each with the test that decided it.

1. **Idea One — REFUSE.** Deciding test: **restatement + retired reader.** The completion event reaches no rules, its one historical model-facing product lost its reader with the structural index (`session-prime.ts:141-143`), and the only runtime with a model-visible completion check points it at `turn_end`, not the settled event (C-2, pi docs `:569-570`).
2. **Idea Two — FATAL.** Deciding test: **content authorship** — the ask has no author outside the model, so no surface can compose it (I5/I8, inherited); the deferred-nudge variant adds predicate failure at the next prompt; the measured precedent (C-1) shows repetition without conversion.
3. **C-1 spec-gate advise parity — REFUSE the build; measurement decides.** Deciding test: **silence condition, measured** (~8/min loudest event; gates unresolved for tens of minutes). It is the round's cleanest proof that *delivery is not the binding constraint and volume is not efficacy* — its payload is the admissible question class and it still fails empirically.
4. **C-2 `agent_settled` — REFUSE as injection; recorded as detector placement** for the completion concern (sentinel evaluation belongs at the settled moment, not per-LLM-response).
5. **C-3 dispatch-completion — REFUSE.** Deciding test: restatement of unconditional standards + no adjudicator (C2's test at a new event).
6. **C-4 guard-status announcement — REFUSE** by construction (operator config, no action window; recorded).
7. **NC-A — status unchanged.** Evidence strengthened only by contrast: the same registration carries model-directed text on its drift path (`.claude/settings.json:175`), its payload fires on actual violations (rare), and its prohibition has a gate leg — the three properties C-1's payload lacks on the timing axis. The `claude --debug` delivery probe remains the standing adoption gate. **The event-injection map is now mechanically closed:** every adjudicated violation state either self-heals at its gate (mirror/route/spec remints — `pre-commit:119-386`, `:399-528`), arrives as a complete gate message (hygiene/mirror/card/mutation-class all name their fix and bypass — `:77-83`, `:99-104`, `:180-186`, `:202-208`), already has an edit-time detector (NC-A's transport repair), or is the spec-gate advise — measured non-effective. Everything else has no adjudicator.
8. **Fleet-note ledger (not candidates):** (a) `session-lifecycle/README.md:35`'s Session Continuity row is stale vs `session-prime.ts:141-143`; (b) the pre-commit header still describes the doc-model validator its body says moved to CI (`pre-commit:2-6` vs `:36-38`); (c) spec-gate log shows persistent open gates and low-specificity bash-advise — detector-quality backlog owned by the spec-gate concern; (d) the Pi sentinel placement defect (C-2).

**Idea One and Idea Two are confirmed refused; the round's one admitted object remains NC-A, and the one candidate this iteration expected to nominate — the spec-gate ask parity — died on its own measurement, which is the strongest demonstration in the round that an event's rarity can never be assumed and must be read from the state log.**
