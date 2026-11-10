{"timestamp":"2026-09-12T14:19:43.627Z","runtime":"claude","status":"fail_open","freshness":"unavailable","durationMs":82,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_EXIT_64"}
All reads done, no writes made. This pass tested the lineage's open threads against sources iterations 1–3 did not open (Codex hook contract, the OpenCode plugin sources, the full Cursor/Devin registrations), and surveyed the corners left unassigned. Findings for iteration 4, in the requested shape.

---

## 1. EVENT SURFACE

Iterations 1–3 built the roster and the fire-vs-deliver axis. Iteration 4 adds the axis the operator's premise actually turns on — **frequency** — plus three source-verified entries the roster lacked.

| Event class | Fires on | Wired at (source) | Frequency in a working session | Reaches the model today |
|---|---|---|---|---|
| Session start | all 6 | `.claude/settings.json:96-137`, `.codex/hooks.json:3-42`, `.devin/hooks.v1.json:2-38`, `.cursor/hooks.json:4-40`, Pi `session_start`, OpenCode `session.created` | Once per session | Continuity `[SYS]` (`injection-contract.md:212-218`) |
| Prompt-adjacent | 5 (Cursor dormant, `injection-contract.md:103`) | advisor + Gate-3 everywhere | Every turn | `[SYS]`/`[MSG]` — closed lane |
| Tool pre/post | all 6 | guards per runtime | Many per turn | `[BLOCK]`/`[SYS]`; post-edit delivers on 3 of 6 (`post-edit-quality/README.md:66-71`) |
| Turn-end / completion | `Stop` ×3, Pi `turn_end`, OpenCode `session.idle` | sentinel + goal verify | **Every turn** | Log/stderr on 4; model-visible on Pi (`completion/README.md:68`; `goal-context.ts:233-238`) |
| Compaction | PreCompact ×2, Devin `PostCompaction`, Pi `session_compact` | `session-lifecycle/README.md:41-43` | Rare (long sessions) | `[NONE]` at fire, cached; `[SYS]` next start (`injection-contract.md:226-238`) |
| Session end | all 6 | cleanup only | Once | `[NONE]` (`injection-contract.md:220-224`) |
| **Drift envelopes (added this pass)** | Claude/Codex/Devin/Cursor | `.claude/settings.json:23`, `.codex/hooks.json:8`, `.devin/hooks.v1.json:8`, `.cursor/hooks.json:6` | Adapter-resolution failure only | **It is the injection** — `hookSpecificOutput.additionalContext` / `agent_message` |
| **Message-rewrite seams (added this pass)** | Pi `message_end`, OpenCode `chat.message` | `.opencode/plugins/sk-communication-projection.js:1-13` | Per finalized message | Projection-only, opt-in, currently a no-op (`:33-37`) |

**The frequency test, applied to the operator's premise.** "The event is rare and discrete, so the hook is quiet by default" is true for exactly two classes: session boundaries and compaction. Both are already assigned (continuity; recovery) or already refused (N1, NC4, NC5). Every *unassigned* event in the roster is per-turn or per-call: prompt, tool, turn-end, goal-verify. This is the iteration-4 correction to the premise: **event-keying buys silence only where applicability is rare, and the rare events are taken.** A completion-shaped event is the most frequent event in the fleet, not a rare one.

**Three ground-truth refinements (verified first-hand this pass).**
1. The fleet's drift envelopes are the *only shipped failure-event injections* — a failure-wrapper on every command that emits a build/restore remedy when the adapter cannot resolve (`.claude/settings.json:23`, `.codex/hooks.json:8`). They are precedent, not a gap: they show the admissible shape a failure injection takes (a remedy the reader can execute, firing only on real failure).
2. Codex's output contract is not the Claude one: "Codex also accepts plain stdout for context on **injecting events**… recorded as a developer-role message" (`.opencode/skills/cli-external-orchestration/cli-codex/references/hook-contract.md:163-167`), while a Stop hook's stdout "is parsed as a response envelope" (`:100-101`). Which class PostToolUse belongs to is unstated — this bears directly on NC-A below.
3. OpenCode's `chat.message` can atomically replace assistant text parts — `atomicReplace: true, appendAfterOriginal: true` (`.opencode/plugins/sk-communication-projection.js:40-41`) — shipped, gated, and deliberately a no-op until a seam with more context exists (`:33-37`). It is a second rewrite surface iterations 2–3 did not count.

**Unused slots** are unchanged from iterations 2–3 (Claude `SubagentStop`/`Notification`; Cursor's unwired shells/reads/subagent events — `runtime/hooks/cursor/README.md:38`; Pi `agent_settled`, `message_end`, `session_before_compact`, `ui_prompt_*` — `native-skills-and-extensions.md:83`). Nothing new became available; the standing structural fact holds: **no event connects to the rule corpus** (`check-repo-rules.cjs:5-9`).

---

## 2. IDEA ONE — completion presentation

**Verdict: REFUSE — stands. One new test this pass, which closes the operator's premise rather than reopening the idea.**

The operator asked: "does the completion event reach them [the presentation rules]?" The precise answer, verified:

- **The rules are not write-gated, so the question inverts.** Their triggers are "every substantive reply" (`AGENTS.md:404`) and "end a turn, of any kind" (`handoff-and-questions.md:35`); their substance is resident with load commands (`AGENTS.md:405-409`) and the close-out is verbatim at `:501`. There is no completion moment at which the payload is absent.
- **The completion event reaches the model on Pi only, and only as detector output** — the sentinel advisory (`completion/README.md:68`) and the goal nudge when *not* met (`goal-context.ts:233-238`). Neither carries presentation guidance; one flags unsupported claims, the other is operator-created goal state. That allocation was decided, not omitted (`injection-contract.md:240-244`).
- **New test — frequency.** Turn-end fires every turn on all five runtimes that wire it. Key a presentation directive on "a turn ended" and it is the retired every-turn shape with an event costume; key it on "a completion claim" and it is the sentinel's heuristic (`completion/README.md:31`), whose channel decision is the thing the repo deliberately left off. Either key, event-keying bought nothing: **the silence condition for this idea was never "which event," it was "which detector output," and that channel is the consent decision already refused twice** (001 iteration 6 C2; `iteration-010.md`).
- Latency and restatement are unchanged from iterations 1–3 (`presenting-decisions.md:129-132`; Claude Stop async, `.claude/settings.json:146`, `:152`). I do not restate them.

Deciding test: **restatement** (resident at `:407`/`:501`), with the new frequency horn as the direct answer to the operator's premise. Nothing reopens it.

---

## 3. IDEA TWO — question triggering

**Verdict: REFUSE — stands. Plainly: detection is solvable; the remedy is fatal. This pass doubles the remedy evidence instead of moving it.**

- Detection remains solved — the reply exists at turn end on every runtime with a turn-end event (`completion/README.md:64-69`; `goal-context.ts:149-153`).
- **New this pass — the rewrite surface is two of six, not one.** Iteration 3 refused Pi `message_end` asking ("the only surface that can fake the ask"); OpenCode's `chat.message` seam now does the same class of edit with `atomicReplace` and `appendAfterOriginal` capabilities (`.opencode/plugins/sk-communication-projection.js:1-13`, `:40-43`). The second surface makes the refusal *stronger*, not the idea viable: a rewrite still cannot make the model ask, and appending an ask is the same authorship violation on a second runtime. Its own capability comment pre-empts the only other use: the seam "exposes only the current message (no transcript), so a projection cannot select bounded context here yet" (`:33-37`) — a context-blind rewrite cannot even decide *when* to append. NC-C's refusal generalizes; "the surface that must not fake the ask" is now a pair.
- The substance bar is unchanged: three-condition judgment (`handoff-and-questions.md:101-106`), prose is the compliant default (`:108-110`), the surface table exists so nobody invents a tool (`:125-140`). The 1-of-6 reopen channel remains consent-gated and asks the model *not* to ask (`opencode-goal.js:2473` per iteration 3).
- Claude's block path stays doubly off (`completion/README.md:64`; `.claude/settings.json:146`, `:152` — reverified).

Deciding test: **remedy availability at fire time**, now evidenced across two rewrite surfaces instead of one. Fatal.

---

## 4. NEW CANDIDATES

Three new corners, each held to the bar (event/runtimes; real silence; wrong-fire cost; portability; survivor-test side). None was proposed in iterations 1–3, and each is framed against the dist-freshness template iteration 3 established as the bar reference ("state the model cannot compute, silent when fresh, with an action leg").

**NC-D — Pre-compaction verification checkpoint (the pre-side complement of N1).**
- *Event/runtimes:* `PreCompact` (Claude/Codex), Pi `session_before_compact` (exposed, unregistered — `native-skills-and-extensions.md:83`, `:146`), Cursor `preCompact` (registered, delivery unconfirmed — `session-lifecycle/README.md:62`).
- *What it was uniquely positioned to carry:* "in-flight claims become summarized memory — verify or mark them now," the pre-side of iteration 1's N1.
- *Silence:* passes — compaction only, rare.
- *Wrong-fire cost:* low.
- *Deciding test — delivery mechanics, which kill it before the bar does.* On Claude/Codex the pre-event has **no channel by design**: `compact-inject` "deliberately emits no stdout on PreCompact: the cache is delivered by the next `SessionStart(source=compact)`" (`session-lifecycle/README.md:42`; `injection-contract.md:226-230`). The only deliverable position is therefore *after* the summary exists — N1's position, already refused on the gate leg ("names no prohibition a gate enforces", iteration 1 §5-3). Pi's pre-compaction event is the one theoretical delivery surface, and its contract is not resolvable in-repo and no repo extension registers it.
- *Portability:* text-only; moot.
- *Bar side — retired* (disposition, no gate), plus the new mechanical finding: **the "pre" side of compaction cannot be addressed; every compaction payload lands post-hoc.** REFUSE. Deciding test: delivery mechanics.

**NC-E — Corpus-path edit notice (an event keyed to corpus *files*, not corpus content).**
- *Event/runtimes:* `PostToolUse` on an edit to `repo-rules/**`, `REPO RULES.md`, or `AGENTS.md`; fires on all six (same transport as NC-A, `post-edit-quality/README.md:26`). This is the first candidate in the lineage that touches the corpus layer at all.
- *Payload:* "you edited a rule/router document; the corpus has a mechanical consistency check."
- *Silence:* real — corpus edits are rare.
- *Wrong-fire cost:* low.
- *Two legs fail before the bar.* (1) *Design lock:* the corpus's own statement is "nothing else reads it… no hook or workflow touches the router" (`check-repo-rules.cjs:5-9`); a hook keyed to corpus paths is the first automatic consumer and invites the second-loader class the corpus CI exists to close (`.github/workflows/repo-rules-corpus.yml`). (2) *Portability:* the checker lives deep inside a hub — `.opencode/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` — so the payload either names a hub-internal path (forbidden: hub names are stable, paths inside hubs are not) or degrades to "the corpus has a checker somewhere." A payload that cannot name its runner is not actionable.
- *Bar side — retired.* No local gate at the edit (CI runs post-push), no prohibition named. REFUSE. Deciding test: design lock + payload portability.

**NC-F — Hook-resolution drift on Pi (transport-family closure).**
- *Event:* hook adapter/extension resolution failure. Claude/Codex/Devin/Cursor wrap every command with an `mk-hook-drift` envelope that injects the remedy (`.claude/settings.json:23`, `.codex/hooks.json:8`, `.devin/hooks.v1.json:8`, `.cursor/hooks.json:6`); Pi's bridges catch and return `undefined`, silently (`.pi/extensions/README.md:98`).
- *Silence:* the rarest in the fleet — failure only.
- *Wrong-fire cost:* none (fires only on real degradation).
- *Deciding test — iteration 2's NC4 model-action test, applied again and failing again.* The notice is maintenance addressed to whoever can rebuild; the session in which it fires has already been running with the degraded layer; the one detector that could carry it (dist-staleness) is operator-facing by design (`injection-contract.md:252-256`; Pi's `ui.notify` is a headless no-op, `:256`). Also narrower than it looks: Pi fails *closed* at startup on invalid exports (`native-skills-and-extensions.md:81`), so the silent window is call-time resolution only.
- *Bar side — retired*, and family-closing: the fleet's only shipped failure-event injections are the drift envelopes, and their payload class is maintenance — operator-side, therefore outside the admitted template. REFUSE.

**Queued candidate, advanced: NC-A (iteration 3's post-edit parity).** Iteration 3 left NC-A probe-gated with a self-kill condition and asked later iterations to verify before reopening anything else. Static verification this pass narrows its scope instead of killing it:
- Claude: confirmed dead channel — the adapter prints plain stdout and exits 0 (`post-edit-quality/claude/claude-posttooluse.cjs:53-63`, header `:17-18`), and Claude's documented PostToolUse contract renders exit-0 stdout to transcript, not model context (`injection-contract.md:204`). The repair envelope is in use in the same registration (`.claude/settings.json:175`).
- **Codex: correction to iteration 3's "3 stdout-only".** Iteration 3 cited `post-edit-quality/README.md:66-68` — the adapters' *output* shape. Codex's *rendering* is unstated: its contract documents stdout-as-context for "injecting events" (`.codex/.../hook-contract.md:163-167`) and envelope-parsing only for Stop (`:100-101`). Codex is therefore a **probe target, not a confirmed gap** — its leg may already deliver, in which case NC-A's build is Claude + (probe) Devin.
- Devin: still unverified (`injection-contract.md:204`).
- Consequence: the probe iteration 3 scoped as "a live Claude probe" must be per-runtime, with Claude the only confirmed build. NC-A otherwise unchanged: survivor side, transport repair, no new admission.

---

## 5. VERDICT

Ranked, each with the test that decided it:

1. **Idea One — REFUSE.** Deciding test: restatement (`AGENTS.md:407`, `:501`), with the new frequency horn: the completion family's events fire every turn, so event-keying supplies no silence; the only shipped completion-adjacent emissions are detector output, and that channel decision was made and refused. `goal-context.ts:233` — silence on `met` is design.
2. **Idea Two — REFUSE.** Deciding test: remedy fatality, now doubled — two of six runtimes contain message-rewrite seams (Pi `message_end`; OpenCode `chat.message`, `sk-communication-projection.js:40-41`), both refused on authorship, the OpenCode one context-blind by its own comment (`:33-37`). Detection stays solvable and irrelevant.
3. **NC-A post-edit parity — QUEUE (probe-gated, scope corrected).** Deciding test: bar side — sole candidate in the admitted class (payload already model-visible on 3 of 6; the survivor prohibition's own gate). Correction this pass: **Codex is a probe target, not a confirmed stdout-only channel** (`.codex/.../hook-contract.md:163-167`); Claude is the only confirmed build.
4. **NC-D pre-compaction checkpoint — REFUSE.** Deciding test: delivery mechanics — the pre-event has no channel on the runtimes that fire it (PreCompact caches, emits nothing, `session-lifecycle/README.md:42`); every compaction payload degenerates into refused N1.
5. **NC-E corpus-path notice — REFUSE.** Deciding test: design lock (`check-repo-rules.cjs:5-9`) + payload portability (checker path is hub-internal).
6. **NC-F drift on Pi — REFUSE.** Deciding test: model-action — participant in the NC4 family; the fleet's drift envelopes are maintenance, and the one detector that could carry the notice is operator-facing.

**Structural answer, updated for the operator's premise.** Event-keyed admission remains real but narrow, and iteration 4 names *why* the operator's silence reasoning fails: frequency, not kind, decides whether an event can be quiet. The rare events are exactly the already-assigned ones — session start (continuity), compaction (recovery, and its pre-side is mechanically unaddressable) — while the completion, question and failure families are the fleet's most frequent events, where quietness must come from a detector and the detector's channel is the consent decision already made. The admitted class stands as iteration 3 named it (state the model cannot compute, silent when fresh, with an action leg); every new candidate this pass fails by adding a different fourth property — no delivery position (NC-D), no permissible runner name (NC-E), no model action (NC-F). Later iterations should treat NC-A as the only open build item and probe it per-runtime, Claude first.
