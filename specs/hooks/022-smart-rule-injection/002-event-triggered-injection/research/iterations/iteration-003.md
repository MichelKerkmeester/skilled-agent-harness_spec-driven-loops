{"timestamp":"2026-09-12T14:14:32.590Z","runtime":"claude","status":"ok","freshness":"live","durationMs":1053,"cacheHit":false,"skillLabel":"sk-doc"}
# ITERATION 3 FINDINGS

*Read this pass: `injection-contract.md` (full), `completion/` and `session-lifecycle/` and `goal/` READMEs, `AGENTS.md` (:100-160, :158-262, :263-307, :390-504), `handoff-and-questions.md`, `presenting-decisions.md`, `post-edit-quality/README.md`, `dist-freshness/README.md`, `plugins/README.md`, first-hand reads of `goal-context.ts` (:120-246), `opencode-goal.js` (continuation surface), `system-dist-freshness-guard.js`, `claude-posttooluse.cjs`, `.claude/settings.json` (:169-188), `check-completion.sh`, spec CLI `README.md`, plus this round's iterations 1–2 and `prior-findings.md`. Iteration-1/2 claims re-tested where marked; none restated without a new test.*

---

## 1. EVENT SURFACE

Iterations 1–2 built the roster (events, wiring, read-only reach). What iteration 3 adds is the axis neither used: **fire vs. deliver** — an event can fire on every runtime and reach the model on half of them — plus the readership classification and one capability correction.

**The roster, with delivery truth added.** Events verified against wiring in iterations 1–2; delivery verified this pass at source.

| Event class | Fires on | Fires on read-only session? | What actually reaches the model today |
|---|---|---|---|
| Session start | all 6 | Yes, always | Continuity brief `[SYS]` all 6 (`injection-contract.md:212-218`); branches startup/compact/resume/clear (`session-lifecycle/README.md:34-37`) |
| Prompt-adjacent | 5 (Cursor's `beforeSubmitPrompt` registered but dormant, `injection-contract.md:103`) | Yes, always | Advisor + Gate-3 `[SYS]`/`[MSG]`; goal block on Pi/Devin/Cursor (`injection-contract.md:138`) |
| Tool pre/post | all 6 | Only when a matching command/edit runs | `[BLOCK]` reasons; post-edit findings on **3 of 6** (Cursor/Pi/OpenCode — `post-edit-quality/README.md:69-71`); stdout-only on **3 of 6** (Claude/Codex/Devin — `:66-68`, "not model context in normal use"); dist-freshness projection OpenCode-only (`dist-freshness/README.md:64`) |
| Turn-end / completion | Claude/Codex/Devin `Stop`, Cursor `afterAgentResponse` (unwired), Pi `turn_end`, OpenCode `session.idle` | Yes — a read-only wrap-up can trip the tail-400 claim regex (`completion/README.md:31`) | Sentinel: `[LOG]` on Claude/Codex/Devin/OpenCode (`:64-66`, `:69`), **model-visible on Pi** (`:68`; `completion-evidence.ts:72-78`); goal verify nudge on Pi, continuation on OpenCode |
| Compaction | Claude/Codex `PreCompact`, Devin `PostCompaction`, Pi `session_compact` (Cursor registered, delivery unconfirmed `session-lifecycle/README.md:62`) | Long sessions only | `[NONE]` at fire, cached; recovery `[SYS]` next start (`injection-contract.md:226-238`) |
| Session end | all 6 | Yes, always | `[NONE]` — side effects only (`injection-contract.md:220-224`; `session-lifecycle/README.md:127`) |

**The readership boundary, now exact:** Pi `agent_end` may still be followed by retry/auto-compact; `agent_settled` is the point where "will not continue running automatically" (iter-2, pi docs `extensions.md:569`). At session end on every runtime, no reader exists. Every event before those points can have a next model turn; at them, none.

**The one turn-reopening surface in the fleet — found this pass.** Iteration 2 concluded "No runtime currently contains a surface that can reopen a finished turn." Correct as a general statement, incomplete as written: OpenCode's goal plugin reopens the turn from `session.idle` via `maybeContinueGoal()` → `client.session.promptAsync()` (`opencode-goal.js:3257-3263`, `:2692-2697`), sending a repo-authored `[active_goal_continuation]` prompt (`:2461-2474`). Its gates matter as much as its existence: `OPENCODE_GOAL_AUTONOMY` must be `active` or `smoke` (`:69`, `:133`, `:2616-2618` — quiet reasons `autonomy_disabled`/`autonomy_passive` at `:84`, `:761-763`), the goal must be active and not budget/turn-capped (`:2672-2688`), and the prompt text itself instructs: *"Do not ask for confirmation unless blocked by missing permission or user input"* (`:2473`). So: capability exists on **1 of 6**, consent-gated, goal-coupled, and configured to suppress questions.

**Correction, Cursor.** Iteration 2 called Cursor's sentinel "dead, not dark" (correct: no `afterAgentResponse` registration; runtime README lists it "Not wired"). Two precisions: Cursor's *delivery envelope* is proven working — its `postToolUse` proxy returns findings as `agent_message` in `{permission:'allow'}` (`post-edit-quality/README.md:69`) — so the deferred sentinel is a *wiring decision*, not a delivery unknown; and Cursor does expose a turn-end API event (`afterAgentResponse`, `cli-cursor/references/hook-contract.md:71`) — unwired, not absent. Iteration 2's "no turn-end event at all" is right about wiring, wrong about capability.

**Unused slots (carried, iter 2 verified; nothing changed):** Claude `SubagentStop`/`Notification`; Cursor's unwired shells/reads/subagent/MCP events (`cursor/README.md:38`); Pi `agent_start`/`agent_end`/`agent_settled`, `message_end`, `context`, `tool_execution_*`, `ui_prompt_*`; OpenCode `session.status`/`session.resumed` (bookkeeping). And the structural fact both iterations confirmed: **no event anywhere connects to the rule corpus** (`check-repo-rules.cjs:5-9`; corpus CI exists to keep rules loadable *through the router*, `repo-rules-corpus.yml:25`).

**What a read-only session actually receives, all six runtimes:** session-start continuity; prompt-time advisor/Gate-3/goal-if-bound; OpenCode dist-freshness only when stale; Pi's sentinel advisory only when a claim trips. That is the complete model-facing event economy on the research path this packet itself runs on.

---

## 2. IDEA ONE — completion presentation

**Verdict: REFUSE — confirmed, with two new tests this pass.**

Iteration 2 killed it on trigger absence ("a goal was met" is emitted nowhere; `goal/README.md:46` 0.72-confidence heuristic; `goal-context.ts:229-233` silent on `met`). Iteration 1 killed it on restatement and latency. Iteration 3 adds:

**New test 1 — even where a completion event exists, its emission is already designed and it is not this.** The goal verifier computes a `met` verdict and emits **nothing** (`goal-context.ts:233`), while the goal block's directive already covers turn ends ("Before ending, run the goal verifier or explain why it is blocked," `injection-contract.md:134`), and the GOAL POSTURE RULE already binds session ends ("Work never stops because a goal is unset or a reminder went unanswered," `AGENTS.md:296`). The completion moment is not an uncovered event; it is an event whose emitters deliberately chose silence per state. Adding presentation guidance would not fill a gap — it would add a second disposition to a moment the goal subsystem already decided.

**New test 2 — the payload's carrier reconfirmed at exact lines.** `AGENTS.md:407` carries "a synthesis reported as findings rather than a file path" — the operator's idea in content-form, resident, "Load it before answering" (`:405`). `:501` carries the close-out and handback verbatim. The rule defers at exactly the completion moment: "Where the run has its own contract for this, that contract wins" (`presenting-decisions.md:129-132`), and the deep modes own their completion messages (`AGENTS.md:464-465`). Under the survivor test (`injection-contract.md:54`), this is disposition-restatement with no gate. Retired side.

**Latency, sharpened:** the sentinel reads the *composed* tail (`completion/README.md:31`) and the verifier reads the finished turn (`goal-context.ts:149-153`); a final-findings message is frequently the session's last, and Claude's Stop-side hooks are fire-and-forget by config (iter-2-verified, `.claude/settings.json:146`, `:152`). Any next-turn remedy lands on the *next prompt* — the lane the prior round closed.

Deciding test: restatement (resident payload at :407/:501, mode contracts at `presenting-decisions.md:129-132`). Secondary: trigger absence + no reader. Nothing reopens it.

---

## 3. IDEA TWO — structured question triggering

**Verdict: REFUSE. Plainly: the timing problem is *detection-solvable* and *remedy-fatal* — and this pass found the exact shape of the fatality.**

**Detection: solved, and not the issue.** The reply exists at turn end and is readable on every runtime with a turn-end event (`completion/README.md:64-69`; backward composition in production, `goal-context.ts:149-153`).

**Remedy: fatal on both capability and consent, now precisely.**
- 5 of 6 runtimes contain no turn-reopening surface at all.
- The 1 of 6 that does (OpenCode's goal continuation, §1) is doubly unusable: it requires an *active, un-met goal* (`opencode-goal.js:2621-2675`) and its authored prompt tells the model **not to ask** (`:2473`). The fleet's single reopen channel exists to *suppress* the behavior this idea wants to increase.
- Pi's `message_end` replacement (the only other modifier surface, pi docs `extensions.md:621` per iteration 2) has an operator-side workaround iteration 2 did not test: append the ask to the finalized message so the human sees a question the model never asked. Mechanically available. Refused this pass on **authorship integrity** — the replacement attributes speech to the model, and the operator would answer a question composed by a heuristic — plus it still cannot compute "should have asked." Recorded as candidate NC-C below.

**Substance: still the second killer.** The three-condition bar (`handoff-and-questions.md:101-106`) is a judgment over alternatives, consequences and defaults — not a signal in text; prose is the rule's default (`:108-110`), so any form detector fires on compliant turns; the per-runtime surface table exists precisely so nobody invents a tool (`:125-140`). The payload is resident (`AGENTS.md:409`).

**Does the event reach the rules that bind only on write turns?** Moot here — the ask obligation binds on *every* turn end by its own trigger (`handoff-and-questions.md:35`), and its substance is resident at `:409`/`:501`. The premise that nothing carries it on read-only turns is false; what is missing is not carriage but enforcement, and no gate enforces question quality by design (`injection-contract.md:240-244` is the repo's one reply-shape experiment, kept `[LOG]`-only).

Deciding test: remedy availability at fire time — now evidenced as consent-gated, goal-coupled, and question-suppressing, with the one workaround refused on authorship.

---

## 4. NEW CANDIDATES

Each new relative to iterations 1–2 and the operator's two ideas. Bar applied verbatim: event/runtimes; silence (how often it really fires); wrong-fire cost; portability; survivor test side.

**NC-A — Post-edit-quality delivery parity (Claude/Codex/Devin).**
- *Event:* `PostToolUse`/`tool_result` on Write|Edit, all six runtimes (`post-edit-quality/README.md:26`).
- *Runtimes:* 6 fire, **3 deliver** — Cursor `agent_message` (`:69`), Pi tool-result content (`:70`), OpenCode transform drain (`:71`); **3 stdout-only** — Claude (`:66`), Codex (`:67`), Devin (`:68`), where the repo's own words are "not model context in normal use." (Correction to `injection-contract.md:204`, which names only Claude/Devin; Codex shares the shape.)
- *Silence:* findings only. The router returns at most one checker per edit (`:16`) and every no-finding path is silence (`:128-129`); the comment-hygiene checker fires only on actual violations.
- *Wrong-fire cost:* low — specific file:line findings, redacted (`:56`), line-level escape (`hygiene-ok`), warn-only, kill-switch `SK_CODE_POST_EDIT_QUALITY_DISABLED` (`:115`).
- *Portability:* the payload is produced by the shared runtime-neutral core (`lib/post-edit-router.cjs`, `:99`); the change is 3 adapter transports in skill-owned code, adding no new cross-repo path references. Nothing here reads the rule corpus.
- *Bar side — survivor side, uniquely in this round.* The comment-hygiene finding restates the exact prohibition the admitted directive carries (`injection-contract.md:52-54`), enforced by the pre-commit gate; the event delivers it at the edit — *before* the gate's late block — on the runtimes that already chose this delivery.
- *Consent status:* this is a **transport repair, not a channel activation**: the identical payload is already model-visible on 3 of 6, and Claude's own registration returns `hookSpecificOutput.additionalContext` on its drift path (`.claude/settings.json:175`), so the envelope is in use in the same registration. It is not the class the prior round refused (a log upgraded without consent); nothing new is admitted to the model that half the fleet does not already receive.
- *Required verification before adoption:* a live probe (`claude --debug`) that PostToolUse additionalContext is delivered. **Self-kill condition:** if Claude/Codex stdout turns out to reach the model after all, the candidate evaporates and there is nothing to build.

**NC-B — Cross-session advisory replay at `session.created`.**
- *Event:* session start (all 6); payload would be the completion-sentinel's accumulated advisories from prior sessions. New shape: nobody proposed surfacing the *backlog* rather than the current turn's finding.
- *Silence:* advisories exist. Rare by construction.
- *Wrong-fire cost:* past-tense claims with no live remedy; dedup is keyed per packet+claim (`completion/README.md:43`), so replay re-serves what the operator already read; session start is the one channel the architecture keeps to continuity, with its advisory family deliberately stderr-only (`injection-contract.md:252-256`).
- *Bar side — retired.* No gate, no remedy for a claim already made — and the existing mechanism on `session.created` is a *sweep* that prunes this state (`completion/README.md:52`), not a reader. The direction of the shipped design is the opposite of this candidate.

**NC-C — Assisted-ask via Pi `message_end` replacement.**
- *Event:* Pi `message_end` — 1 of 6 (partial answer, stated as such).
- *What it was uniquely positioned to do:* append the structured-choice question the model failed to ask onto the finalized, operator-visible message — the only surface in any runtime that can put text into the human's view after the turn ended.
- *Silence:* the same uncomputable predicate as Idea Two — none.
- *Wrong-fire cost:* the mechanism manufactures the failure it pretends to fix: a question attributed to the model, answered by the operator, composed by a heuristic. A wrong fire changes what the operator does next on fabricated authority — the highest wrong-fire cost of any candidate in either round.
- *Bar side — retired*, now on a second, stronger leg: even with a perfect detector it cannot be admitted, because it delivers content the model never produced. The honest conclusion: the only surface that can *fake* the ask is exactly the surface that must not.

**Short-form refusals (same bar, decided on sight):** `validate.sh` exit-code surveillance at tool-result time — born complete (the output plus the resident exit-code table, `AGENTS.md:266`); gate-passed event — N5, refused; gate-failure echo — N2, born complete (`injection-contract.md:150-151`); Cursor `afterAgentResponse` sentinel wiring — a registration decision with a proven envelope (§1), not a payload; `SubagentStop` (NC1) and `session_compact_failed` (NC5) — unchanged.

**Positive finding — the bar-passing exemplar the round now has.** The dist-freshness guard is the fleet's reference event-keyed injection, and it passes for mechanical reasons worth recording: event = risky Bash (`opencode run`/`validate.sh`) plus edits that invalidate cache (`dist-freshness/README.md:39-41`); payload = machine state the model cannot compute; **silence = only-stale** — `freshnessDiagnostics` filters to stale/error (`system-dist-freshness-guard.js:79-82`), `buildBrief` returns `''` when empty (`:112`), the transform injects only on non-empty (`:227-230`); and it carries **both legs** — model-action (rebuild) and gate (validate.sh fails closed with exit 3 on stale dist, spec CLI `README.md:100`). Every rule-shaped candidate in this round fails against this template for the same reason: its content is resident and its consequence is ungated.

**Threads closed this pass (iteration-2 open questions):**
- *"Can any detector output carry a gate leg?"* Tested: the sentinel's evidence condition is checkable — `check-completion.sh` prints `RESULT: BLOCKED` for missing evidence markers (`check-completion.sh:468-470`, detection at `:323-325`) — but that string is a report, not an enforcement; the authoritative gate for completion claims is `validate.sh`, a command the model runs (`AGENTS.md:264-266`). The sentinel cannot inherit a gate leg it does not have. Pi's sentinel channel remains a deficiency notice with a resident remedy. Thread closed, refusal stands.
- *"Cursor deferrals re-test?"* Settled statically: envelope proven (§1), so the barrier is wiring policy, not delivery.
- *"Can the drift class pass the model-action test?"* Split explained: the pre-action variant (dist-freshness) passes because the model's *next action* rebuilds; the session-start variant (NC4) stays refused because the action it enables is operator-side. Same class, opposite verdicts, decided by whose action the state changes.

---

## 5. VERDICT

Ranked, each with the test that decided it:

1. **Idea One — REFUSE.** Deciding test: restatement — the payload is resident at `AGENTS.md:407`/`:501`, and the rule defers to mode contracts at its own moment (`presenting-decisions.md:129-132`). Secondary: trigger absence, now sharpened — where a completion verdict does exist, silence on `met` is the design (`goal-context.ts:233`).
2. **Idea Two — REFUSE.** Deciding test: remedy — 5 of 6 runtimes cannot reopen a turn; the 1 that can is consent-gated (`opencode-goal.js:133`), goal-coupled (`:2621-2675`), and instructs against asking (`:2473`). Secondary: the substance bar is not computable from text (`handoff-and-questions.md:101-110`), and the one fabrication workaround is refused on authorship (NC-C).
3. **NC-A post-edit quality parity — QUEUE (probe-gated).** Deciding test: bar side — this is the only candidate whose payload is the admitted survivor class (`injection-contract.md:52-54`), already delivered on 3 of 6 runtimes; what differs on the other 3 is transport, and the same registration already emits the envelope (`.claude/settings.json:175`). Verify with a live Claude probe before building; no new policy, no new content.
4. **NC-B advisory replay — REFUSE.** Deciding test: no remedy — the shipped mechanism on the same event prunes this state (`completion/README.md:52`); the candidate reads it backwards.
5. **NC-C assisted-ask — REFUSE.** Deciding test: authorship — the surface can attribute a question to a model that never asked it; a perfect detector does not rescue it.
6. **One-liners (exit-code survey, gate-passed, gate-failure echo, Cursor sentinel wiring, NC1/NC5) — REFUSE.** Deciding tests: born-complete / refused-shape / wiring-policy, as listed.

**The round's structural answer, updated:** event-keyed admission is real but narrow, and its admitted class is now empirically nameable — **state the model cannot compute, silent when fresh, with an action leg** (dist-freshness, goal state, continuity). Prohibitions enter model context through `[BLOCK]` reasons at the gate that enforces them, and gate-backed constants through the prompt directive that names them. The two operator ideas ask events to carry *dispositions about text the model composed* — the one category for which no runtime has a reader, a remedy, or a gate, and for which the fleet's single turn-reopening surface is configured to say less, not more. Nothing in this round changes that allocation; NC-A repairs a delivery inside it. Later iterations should treat the dist-freshness guard as the bar reference and probe NC-A before reopening anything else.
