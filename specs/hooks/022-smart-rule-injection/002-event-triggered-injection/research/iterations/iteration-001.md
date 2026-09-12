{"timestamp":"2026-09-12T14:05:11.651Z","runtime":"claude","status":"ok","freshness":"live","durationMs":996,"cacheHit":false,"skillLabel":"system-deep-loop"}
# ITERATION 1 FINDINGS

*Read this pass: `injection-contract.md` (full), the completion, session-lifecycle and goal READMEs, `repo-rules/handoff-and-questions.md` and `presenting-decisions.md`, `AGENTS.md` (:121-129, :233-248, :400-412, :494-503), the prior-round digest and iteration-010, plus first-hand checks of `goal-context.ts`, `completion-evidence.ts`, `session-prime.ts`, `opencode-goal.js`, both plugin/extension READMEs, `check-repo-rules.cjs` and `repo-rules-corpus.yml`. Claims attributed to prior iterations were re-quoted from the packet, not reopened.*

---

## 1. EVENT SURFACE

**Two ground-truth refinements first, both verified first-hand.**

1. **The sentinel is not dark on all six runtimes.** `injection-contract.md:240-244` names the two Stop-shape adapters and the OpenCode plugin and is accurate for those, but Pi's adapter injects today: `completion-evidence.ts:74-78` calls `pi.sendMessage({customType:"completion-evidence-advisory", display:false})` when `decision==="advise"`, and `completion/README.md:68` labels it "model-visible". By the contract's own taxonomy, `pi.sendMessage` with `display:false` is model-visible and human-invisible (`injection-contract.md:218`, `:268`). So "live detector with the output channel switched off" is a five-of-six statement. One runtime already ran the log-to-model upgrade for this exact detector.
2. **The backward loop is production, and its verdict gate is asymmetric.** Pi `turn_end` flattens the ending message plus tool results into evidence (`goal-context.ts:149-153`), runs the heuristic verifier (`:230`), and nudges via `pi.sendMessage` **only when the verdict is not `met`** (`:233-237`). A met goal currently produces silence, not a completion message.

**The event inventory, grouped by position.**

| Event class | Where it fires | Read-only session reach | Current channel |
|---|---|---|---|
| Prompt-adjacent (UserPromptSubmit/`input`/system.transform) | All 6 | Always | `[SYS]`, `[MSG]` on Pi (`injection-contract.md:52-84`) |
| Tool-time (before/after) | All 6 | Write/dispatch-gated | `[BLOCK]` or `[SYS]`; OpenCode mcp-guard `[LOG]` (`:150-204`) |
| **Turn-end / completion** | Claude/Codex/Devin `Stop`, Cursor `afterAgentResponse`, Pi `turn_end`, OpenCode `session.idle` | Yes: a research wrap-up can carry a claim word in the tail 400 chars (`completion/README.md:31`) | stderr+log (Claude `completion/README.md:64`, Codex `:65`, Devin `:66`), log only (Cursor `:67`, OpenCode `:69`), **model-visible on Pi only** (`:68`) |
| Goal verify | Pi `turn_end`, OpenCode plugin | Only when a goal is bound (`goal-context.ts:227`) | Pi: nudge when not met only; OpenCode: guarded continuation (`plugins/README.md:31`) |
| Session start | All 6 | Always | `[SYS]` continuity (`injection-contract.md:212-218`) |
| PreCompact | Claude/Codex (Cursor registered, unconfirmed `session-lifecycle/README.md:62`) | On long sessions | `[NONE]`, caches for next start (`:226-230`) |
| Post-compaction | Devin `PostCompaction`, Pi `session_compact` | On long sessions | `[SYS]` recovery block (`:232-238`); OpenCode `session.compacted/compact` used only for boundary bookkeeping (`system-spec-gate.js:183-186`, `system-skill-advisor.js:1390-1393`) |
| Session end | Pi `session_shutdown`, Cursor `sessionEnd`, OpenCode `session.deleted` | Always | `[NONE]`, side effects only (`:220-224`) |

**Unused slots.** Pi `agent_end`/`agent_settled` exist and no repo extension registers them (`goal-context.ts:169`). Every completion event on five of six runtimes has a live detector and a dark model channel. The one structural pattern across all of it: **no model-visible injection anywhere in the fleet originates from a turn-end or completion event except Pi's `sendMessage`, and no event connects to the rule corpus at all.**

The corpus lock, verified at source: "The corpus under repo-rules/ is hand-maintained and nothing else reads it... no hook or workflow touches the router" (`check-repo-rules.cjs:5-9`), enforced by CI so drift "cannot leave a rule silently unloaded" (`repo-rules-corpus.yml:25`). Any event hook carrying rule content is a second loader outside that walk, the class the prior round flagged (`prior-findings.md:125`).

---

## 2. IDEA ONE: completion presentation

**Verdict: REFUSE.** Two independent tests each kill it.

**Test A: restatement.** The payload is resident already, twice. `AGENTS.md:407` (always in context) carries the presenting-decisions digest including "a synthesis reported as findings rather than a file path," and `:501` carries the close-out and handback obligation verbatim. The rule the injection would carry even defers to mode contracts for exactly the moment in question: "Where the run has its own contract for this, that contract wins" (`presenting-decisions.md:129-132`). Under the survivor test (`injection-contract.md:54`: not a disposition, a specific prohibition a gate enforces, the gate making it load-bearing), this is restatement with no gate. Retired side.

**Test B: delivery latency.** The event fires after the artifact it would improve. The sentinel reads the composed claim tail (`completion/README.md:31`), the goal verifier reads the finished message plus tool results (`goal-context.ts:149-153`). A "final findings" message is frequently the session's last message, so even a next-turn injection has no guaranteed next turn. The rules "bind only on write turns" premise is also wrong as stated: Gate 5 is the only loader (`AGENTS.md:121-129`), but §8 makes their substance resident regardless of writes (`:405-409`), so there is no completion moment at which the payload is absent and needed.

**Costs and portability.** The only runtime where a completion event reaches the model today is Pi, and its sentinel channel already exists, so the candidate is a one-of-six partial answer for any new payload. Upgrading the Claude/Codex/Devin Stop or Cursor/OpenCode adapters from advisory to model-visible is the same consent-cost upgrade the prior round refused for the completion back-loop (`prior-findings.md:118-121`; refusal logged at `iteration-010.md:57`). The goal-met half is weaker still: `goal-context.ts:233` shows the verifier deliberately stays quiet on `met`, the verifier itself is a 0.72-confidence heuristic (`goal/README.md:46`), and the goal block already carries the completion directive ("Before ending, run the goal verifier or explain why it is blocked," `injection-contract.md:134`).

---

## 3. IDEA TWO: structured question triggering

**Verdict: REFUSE as designed. The timing problem is not fatal for detection. It is fatal for the remedy.**

**Detection is solvable.** The reply that "does not exist at prompt time" exists at turn end and is readable on every runtime that has such an event: `payload.last_assistant_message` on Claude/Codex/Devin (`completion/README.md:64-66`), `payload.text` on Cursor (`:67`), `ctx.client.session.messages()` on OpenCode (`:69`), `event.message` on Pi (`:68`). Backward composition is proven in production (`goal-context.ts:149-153`, `:221-237`). The prior round's proof that "no predicate reads the model's composition" was explicitly forward-only (`prior-findings.md:117`). So say plainly: judging a reply is possible, and this session verified the mechanism that does it.

**The remedy is what dies.** The structured question tool is model-side per runtime (`handoff-and-questions.md:125-131`). At turn end the model is not running. The same-turn continuation surfaces are all closed: Claude's Stop-block path is policy-off ("Never `{decision:"block"}`: advisory only," `completion/README.md:64`; `injection-contract.md:242`), Pi's turn-end events are void and "cannot force continuation" (`goal-context.ts:169-173`), and OpenCode's continuation is goal-owned with its own guards (`plugins/README.md:31`). What remains is a next-turn corrective, and it fails four ways: it lands after the failure window closed. It anti-correlates, because if the operator ignored the buried ask there may be no next turn. Its detectable proxy is form, while the rule's own default is prose ("Otherwise put it in prose and keep going," `handoff-and-questions.md:108-110`), so a form detector fires on compliant turns. And substance ("should have asked") is a judgment over alternatives, consequences and context, not a signal in the text. The payload itself is resident at `AGENTS.md:409` ("when a question becomes a structured choice rather than a sentence in a paragraph") and the per-runtime tool surface is documented precisely so nobody invents one (`handoff-and-questions.md:138-140`). No gate leg. Retired side.

---

## 4. NEW CANDIDATES

Held to the same bar: event, runtimes, silence, wrong-fire cost, portability, and which side of the survivor test (`injection-contract.md:54`) each falls on.

**N1. Compaction-provenance notice.** Event: `SessionStart(source=compact)` (Claude/Codex), `PostCompaction` (Devin), `session_compact` (Pi); Cursor's equivalent is registered but unconfirmed (`session-lifecycle/README.md:62`). Payload shape: apply the resident Confirmed/INFERRED standard (`AGENTS.md:243`) to recovered memory, "pre-compaction detail is INFERRED until re-read." The event is uniquely positioned because its defining property is that the model's own context became second-hand, and its silence condition is the best any candidate in this round produced: applicability (context is lossy) equals the firing observable (a compaction happened), which is exactly the property the prior round's class closure demanded (`iteration-010.md:38`). Fires zero times on short sessions, once or twice on long ones. Wrong-fire cost: low, and the payload overlaps the existing provenance wrapping plus "Recovery Instructions" (`session-prime.ts:99-104`). Portability: the recovery chain is already per-runtime and the text would be path-free. Bar side: **retired side, on the gate leg only.** It names no prohibition a gate enforces, and the nearest corpus analogue already covers documents-as-claims (`evidence-and-proof.md:189-192`). Event-keying bought the silence condition and did not buy load-bearingness. Record it as the strongest shape among this round's refusals.

**N2. Gate-failure remediation echo.** Event: a failed gate command observed in `tool_result`/`PostToolUse` (Pi and Claude fire it today, OpenCode `tool.execute.after` at `plugins/README.md:123`). Silence: only on gate failure. Wrong-fire cost: low. Bar side: **refused, born complete.** The failure output already is the message, and the tool-time precedent says exactly that: "the denial reason is the content the model receives back in place of a successful tool result" (`injection-contract.md:150-151`). The prior round found the same for the push gate's block message (`prior-findings.md:22`). An echo restates `AGENTS.md:244` on top of output the model already holds.

**N3. Session-end handback (the event with no reader).** Event: Pi `session_shutdown`, Cursor `sessionEnd`, OpenCode `session.deleted`, final `Stop`. What it is uniquely positioned to carry: whatever the session owes at close. Finding: **structurally void for model injection.** No model turn follows, so any injection is addressed to nobody. The runtimes agree by design: Session Stop is `[NONE]` with side effects only (`injection-contract.md:220-224`), and `session-entry`-style autosave already runs (`session-lifecycle/README.md:45-46`). The only model-reachable variant is making the final Stop block, which is the policy the repo turned off (`completion/README.md:64`). This is the obvious idea nobody proposed because it is bad, and it is worth recording as such: session-end is the one event where more content is never the fix.

**N4. Repeated-failure streak.** Event: the Nth consecutive failing `tool_result` on one target, or N edits to one file (Pi/Claude fire it today). Unique position: the moment retrying should stop. Silence: a streak threshold. Bar side: **refused, restatement.** The payload duplicates the resident §3 text ("If an attempt repeats without new evidence, stop patching at the failure site, restate the problem one level up"), and sk-code already owns the repeated-failure limit inside its debugging loop. No gate, no new object.

**N5 (short). Gate-passed event.** The complement of N2. A passing gate needs no injection: the green-versus-reality gap is what the five resident standards cover (`AGENTS.md:239-247`), and a "check reality even when green" nudge is the disposition shape the slot policy retired (`injection-contract.md:54`). Refused for carrying the least of any event in the set.

---

## 5. VERDICT

Ranked, each with the test that decided it:

1. **Idea One: REFUSE.** Deciding test: restatement. `AGENTS.md:407` and `:501` carry the payload in every context, and the rule defers to mode contracts for its own moment (`presenting-decisions.md:129-132`). Secondary test: delivery latency, the event lands after the artifact it would improve and sometimes on a session with no next turn. Tertiary test: portability, the model-visible completion channel exists on Pi alone.
2. **Idea Two: REFUSE.** Deciding test: remedy availability at fire time. Detection passes (backward composition is production, `goal-context.ts:149-153`), delivery fails on every runtime (void events `:169-173`, block policy-off `completion/README.md:64`, continuation goal-owned `plugins/README.md:31`). The surviving next-turn shape also fails the form-versus-substance test because prose is the rule's default (`handoff-and-questions.md:108-110`).
3. **N1 compaction-provenance: REFUSE.** Deciding test: gate leg. Event leg and silence condition both pass, uniquely among this round's candidates, and the payload still names no gate-enforced prohibition. Keep as the named shape any future event admission must beat.
4. **N2 gate-failure echo: REFUSE.** Deciding test: payload completeness, established at `injection-contract.md:150-151`.
5. **N3 session-end: REFUSE.** Deciding test: no reader exists. `[NONE]` is correct, not a gap.
6. **N4 failure streak and N5 gate-passed: REFUSE.** Deciding test: resident restatement, no gate.

One affirmative finding, which later iterations should treat as the current state of the corpus layer: **the prior round's only open remedy has landed.** The prior packet recommended promoting the self-lens clause (`iteration-010.md:59`) beside "Finding = hypothesis," and `AGENTS.md:239` now reads "These five bind unconditionally," with the added row "**Your own read is also one lens**" at `:246`. The mechanism that works for reply-shaped obligations is promotion into the resident layer, demonstrated, path-free, and identical across the three repositories. Every candidate above must therefore beat a working alternative that needs no hook, no channel and no portability work.
