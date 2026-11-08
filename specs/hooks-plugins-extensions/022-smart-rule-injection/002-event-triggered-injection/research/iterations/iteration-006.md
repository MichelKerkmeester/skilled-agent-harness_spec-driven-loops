{"timestamp":"2026-09-12T14:34:32.673Z","runtime":"claude","status":"fail_open","freshness":"unavailable","durationMs":108,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_EXIT_64"}
# ITERATION 6 FINDINGS

*This pass read first-hand: `injection-contract.md` (full), `completion/`, `session-lifecycle/`, `goal/` READMEs, the completion-sentinel advisory log and dedup contract, the directive-lifecycle concern README + boundary adapters, the OpenCode advisor/spec-gate plugins, `.claude/settings.json` PostToolUse block, `AGENTS.md` (Gate 5, §3, §4, §8, §10), both `repo-rules/` files, the 014 spec, the corpus checker header. It does not re-run iterations 1–5; it tests them. What it adds: the **compaction boundary as the fleet's live context-boundary event** (correction to every prior event table), a **measured frequency reading** of the completion event that falsifies the operator's rarity premise for that one event, the **admission rule that bars every non-gate payload at that boundary**, and four new candidates, two of which are structurally novel (a non-restatement payload; a perfect-silence payload).*

---

## 1. EVENT SURFACE

**Delta to iterations 3–5, first-hand: compaction is not unused. It is the fleet's most *used* non-session event, and prior tables missed it.**

- **Directive lane:** a boundary adapter runs on host lifecycle events and re-arms full delivery of the constant directive — "re-arms full delivery only on a lifecycle boundary (`startup` / `resume` / `compact` / `clear` / `post-compact`) … the directives appear at startup and after a compaction, not on every turn" (`directive-lifecycle/README.md:18`); boundary → `full` re-delivery on the next prompt (`:20`, `:37`). The boundary adapter itself "emits no model-visible output" (`:55`) — the event drives state; the next prompt carries the content.
- **Wiring is cross-runtime, verified at the import sites:** Claude `session-prime.ts:26` + `compact-inject.ts:32`; Codex `session-start.ts:16` + `compact-inject.ts:15`; Cursor `session-start.ts:16` + `precompact.ts:35`; Devin `session-start.ts:16` + `post-compaction.cjs:121` (all under `.opencode/skills/system-spec-kit/runtime/hooks/`). OpenCode maps it in-plugin: `session.compacted`/`session.compact` → `'compact'` boundary (`.opencode/plugins/system-skill-advisor.js:784`; boundary comment `:962`).
- **Gate-3 lane:** `session.resumed`/`session.compacted`/`session.compact` advance the question's lifecycle epoch and clear its delivery shadow (`.opencode/plugins/system-spec-gate.js:183-187`; core at `runtime/hooks/lib/spec-gate/spec-gate-core.mjs:260-268`) — re-ask prep for the fixed question, idle today because suppression is opt-in, default-off (`spec-gate/README.md:30`).
- **Continuity lane:** PreCompact caches a brief delivered by the next `SessionStart(compact)`; Devin `PostCompaction`/Pi `session_compact` emit recovery directly (`session-lifecycle/README.md:34`, `:42-43`).

So the event surface has a column the question never named: **the context boundary (compaction/resume)** — rare, discrete, read-only-compatible, and *already consented* for one payload. Iteration 4's NC-D refusal (pre-side undeliverable) remains true for its payload; it was never true that the event is unused.

**The completion event, measured — the premise inversion.** The sentinel's advisory log holds **477 lines, 2026-07-11 → 2026-09-12** (`.opencode/logs/completion-sentinel-advisories.log:1`, `:476`). Sampled lines 1–120 and 455–476 (~30% of the file): **>95% are one class** — "claimed done but no implementation-summary.md recorded in …" — and the same folder re-fires repeatedly (`specs/sk-design/019-sk-design-diagram-upgrade` at `:455-462`, `:466`; `specs/system-skill-advisor/025-mcp-decommission-cli-front-door` at `:463-465`, `:467`, `:470-471`, `:474-475`; a deep-loop lineage folder at `:95-97`, `:100-101`, `:104`, `:106`). Dedup does not bound this: it keys on `specFolder + claimText` (`completion/README.md:43`) and the message text differs per turn. The dominant class is the Level-1 branch — "no `checklist.md` → stat `implementation-summary.md`" (`:41`) — firing on folder shapes whose type never requires that artifact: a research subfolder (`:476`, this session's exact shape), deep-loop lineage children, and even a file path with a line suffix (`:468`). **The event the operator's premise assumed was rare is empirically the loudest event in the fleet.**

**Ground-truth refinement.** The sentinel's channel is not uniformly off: Pi's `turn_end` adapter already delivers it model-visible (`completion/README.md:68` — `pi.sendMessage`, "model-visible"). Off-by-policy is Claude/Codex/Devin (stderr+log, `:64-66`), OpenCode (log only, `:69`), Cursor (adapter orphaned — iteration 5's first-hand correction, not re-read). "Channel off" = 5-of-6, Pi is live.

**Read-only sessions:** session start (all six; `injection-contract.md:212-218`), prompt submit (closed class), turn-end family — sentinel evaluates read-only wrap-ups and provably fires on them (log `:476` is a research folder), compaction (all six, above). Tool-time events are shape-keyed and no-op. Session end: `[NONE]` (`:220-224`; `session-lifecycle/README.md:45`). **Unused sets unchanged since iteration 5** (Cursor's confirmed-unwired list, Claude `PermissionRequest`, Pi's ~25/33 — inherited from iteration 5, not re-read).

---

## 2. IDEA ONE — completion presentation

**REFUSE. New deciding test: measured frequency and specificity — the completion event is the wrong end of the rarity spectrum, and its fires are dominated by a class whose signal is wrong.**

- **Reach — the event reaches a detector, never the presentation rules.** No injection anywhere in the fleet carries presentation content: the contract's full enumeration (§2–§4) is routes, questions, goals, findings, recovery — none is `presenting-decisions.md` or the `handoff-and-questions.md` close-out. The completion event's only model-visible carrier today is Pi's evidence advisory (`completion/README.md:68`). To carry the guidance you must either upgrade that advisory's channel (the consent class refused in the prior round's iteration 6 C2 and restated in `iterations/iteration-010.md`) or build a second detector on a claim event — same channel, same consent ledger, and now a measured noise floor.
- **The "rare and discrete" premise is false for this event specifically.** 477 fires / 63 days; bursts of 8–10 on one folder per day; the sampled class split above. Attaching presentation guidance to a detector that already fires ~8×/day fleet-wide, >95% one low-specificity class, means the operator's learned response to the injected line is skim — the exact failure the retirement record describes ("a reader who ignores it once ignores it a hundred times", `specs/hooks/014-retire-governor-and-proof-directives/spec.md:67-69`). And the wrong fires land on read-only research wrap-ups (`:476`) — the moment where a "present final findings" nudge has nothing to improve.
- **The operator's "work completed" state does not exist as an event; it exists as a text heuristic.** The trigger is the last 400 characters matching claim words (`completion/README.md:31`). "When work completes" is not detectable as a state; "the tail of the message looks claim-ish" is. Goal-met has the opposite shape — deliberately silent, `last_check` computed on Pi only, never a continuation (`goal/README.md:46`).
- **Standing legs (one line each, not restated):** restatement — payload resident at `AGENTS.md:404-409` with the close-out verbatim at `:501`, and the rule defers to mode contracts at its own moment (`presenting-decisions.md:129-132`); action window — iteration 5's event-position test stands.
- **Fleet note, not a proposal:** the measured log also surfaces two quality defects in the *existing* detector — the Level-1 branch mis-fires on folder types that never carry `implementation-summary.md`, and path extraction admits file:line shapes (`:468`). That is correction/backlog material for the completion concern, the opposite direction from adding payload.

---

## 3. IDEA TWO — structured question triggering

**REFUSE as designed. The timing problem, stated plainly: detection is solvable as detection; deciding "should have asked" is solvable never; and the remedy is still fatally authorless. Fatal — this is the honest answer, and iteration 6 sharpens *why*.**
- **The fleet's own re-ask precedent defines the boundary.** The one machine-authored question (Gate 3) is *fixed-content* and *forward-looking* ("before any Write/Edit, pick one", `injection-contract.md:72-84`), and its boundary re-arm requires a **stable question identity** — receipts confirm only "a question hash with `lifecycleEpoch >= 1`" (`spec-gate/README.md:30`). A missed-ask detector inverts every property: content composed on the fly from the reply it judges, direction backward (about the turn that just ended), identity one-shot. The re-arm machinery at compaction (`system-spec-gate.js:183-187`) cannot carry it; it exists precisely because its question never varies.
- **Authorship is the fatal link (iteration 5's finding, generalized this pass).** Each ship-approved ask is (a) authored by the harness *before* the model composes and (b) fixed-enum — Gate 3's A–E, the mid-run deny reason. A useful missed ask is (a) authored in the model's head and (b) unbounded. Any detector can find "no question in the reply" (recall); none can find "should have been one", because the alternatives — and the counterfactual reply — never existed outside the model.
- **Standing legs:** three-condition bar (`handoff-and-questions.md:101-106`), prose-is-compliant default (`:108-110`), per-runtime surface table with unverified rows plus the no-invented-names rule (`:125-131`, `:138-140`), and the rewrite surfaces (Pi `message_end`, OpenCode `chat.message`) = authorship violation on two runtimes (NC-C; iteration 4, inherited).
- **Sub-question answered:** not fatal *for the Gate-3 class* — that ask already ships mid-run and is re-armed at boundaries. Fatal for the general class, on authorship, not on timing alone.

---

## 4. NEW CANDIDATES

Same bar; portability noted; refusals decided by a named test. Portability is clean for all four (framework text or pointer form; no hub-internal paths).

**C1 — Compaction boundary → rule-restoration after compaction "the rules you loaded are gone."**
- *Event/runtimes:* compaction/resume, all six — five adapter runtimes notify the directive boundary at start + compact (import sites in §1); OpenCode maps it in-plugin (`system-skill-advisor.js:784`). The event and its plumbing exist everywhere.
- *Shape:* payload is a **pointer** ("if you loaded `repo-rules/` before this session compacted, that content was summarized away; re-read the files your triggers matched before the next write"), not content — fully portable.
- *Silence:* fires only on sessions that compact. Genuinely rare and discrete — the property Idea One lacked.
- *Wrong-fire cost:* low (a pointer; worst case a re-read).
- *The novelty:* **the first candidate in this lineage whose payload is not a restatement.** The prior refusal leg — "restates what is already in context" — does not apply by construction; the content was compacted, not re-said. Recovery re-injects retained summary + spec-folder pointer and nothing else (`session-lifecycle/README.md:34`, `:43`); no lane carries rule content.
- *Bar side — RETIRED, and the refusal is the finding:* the content leg passes, the gate leg fails (no machine adjudicates rule awareness; corpus is level 3), and decisively — **the one lane that already solves delivery at this exact boundary has an explicit admission rule that bars it**: "Every prompt carries the directive that has an enforcement mechanism, and nothing else" (`specs/hooks/014-retire-governor-and-proof-directives/spec.md:77`). The corpus is also single-consumer by design statement — "nothing else reads it … no hook or workflow touches the router" (`.opencode/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs:5-7`).
- *Deciding test:* **the boundary lane's admission rule.** Solved delivery does not solve admission — the cleanest demonstration available that the event side was never the binding constraint.

**C2 — Pre-edit read ledger → Law 1 "never edit a file without reading it first."**
- *Event/runtimes:* `PreToolUse` on Write|Edit already wired on Claude (`.claude/settings.json:169-171`), and the enforce path exists on all six (`spec-gate/README.md:44-49`): Pi `tool_call`, OpenCode `tool.execute.before`, etc. The ledger needs read-tool tracking — shape-keyed, partial fidelity (bash `cat`, subagent context, offset reads).
- *Silence:* fires only on an edit whose file was not read this session — **the best structural silence of any candidate in either round**; it keys on the violating action itself.
- *Wrong-fire cost:* ledger false positives = the hook accusing a model that did read (via a path it can't track) — trust damage at the exact moment the model acted correctly.
- *Bar side — RETIRED.* The prohibition is specific (`AGENTS.md:23`) but no gate adjudicates read-state; the commit gates' subjects are comments, mirrors, cards, deletion volume — none reads a session ledger (iteration 5 §5.4, inherited). A deny would be new enforcement on an unsound ledger.
- *Deciding test:* **gate leg + ledger soundness.** Its value is the proof that perfect silence alone never admits — this candidate has it and still fails.

**C3 — Destructive-call content classifier → blast-radius "stop for yes."**
- *Event/runtimes:* `PreToolUse` Bash content match, 6/6 fire the event; warn/deny envelopes proven live (`injection-contract.md:158-167` dispatch-preflight warn/block; `:150-154` spec-gate deny).
- *Silence:* pattern match only (rm -rf, force-push, drop, delete-volume) — rare if the list is good.
- *Wrong-fire cost:* the warn-only `[SYS]` path arrives with the *next* step — after execution; so the only timely form is a deny, i.e. **a new blocking gate** over a corpus rule (`AGENTS.md:164`), subject to the consent class. False positives (rm of scratch files) force re-issue cycles; the fleet's own escape hatches (mass-deletion bypass, `hygiene-ok`) exist because this class misfires.
- *Bar side — RETIRED as injection.* The two highest-harm sub-classes already gate at push with complete messages (remote allowlist, mass-deletion ceiling — iteration 5's verified gate inventory, inherited); the runtime permission system already interposes on dangerous calls (Devin's adapter composes allow/deny for spec-gate/dispatch cores, `injection-contract.md:246-250`); and the payload is resident (`AGENTS.md:163-164`).
- *Deciding test:* **injection vs enforcement** — the only timely form is creating a gate, which is a policy change, not an injection. (Adjacent to E1, distinct: E1 keyed the consent *event*; this keys tool *content* at the pre-execution event.)

**C4 — Recorded, the obvious-bad one: inject debugging discipline on command/test failure.**
- *Event:* any failing command. *Why nobody proposed it:* it is the most frequent event of a working debugging session — it fires on every retry, i.e. every-turn shape on an event costume. Payload restates `AGENTS.md:191-192` (resident, unconditional). The sentinel log is the empirical demonstration of what an event-keyed hook on a common terminal state becomes: 477 entries, one dominant class, a skimmable channel. **Refused — frequency + restatement.**

---

## 5. VERDICT

1. **Idea One — REFUSE.** Deciding test: **measured frequency & specificity.** The event is empirically the fleet's least silent (477/63 days, >95% one low-specificity class in samples, fires on folders that never carry the artifact). Secondary: no event-side carrier for the rules; channel upgrade is the twice-refused consent class; claim-state is a tail-text heuristic, not an event.
2. **Idea Two — REFUSE as designed.** Deciding test: **content authorship, generalized** — every approved ask is fixed-content and pre-composition and carries a stable identity the boundary re-arm can key on (`spec-gate/README.md:30`); a missed ask is composed, backward-looking, one-shot. Fatal; the Gate-3 class is the only surviving form and already ships.
3. **C1 compaction rule-restoration — REFUSE.** Deciding test: **the boundary lane's admission rule** (`014 spec:77`) + corpus single-consumer lock (`check-repo-rules.cjs:5-7`). First candidate to survive the restatement objection and still fail — delivery was never the binding constraint; admission is. This closes the "rare event = free silence" avenue with a mechanism, not an opinion.
4. **C2 read-ledger Law 1 — REFUSE.** Deciding test: **gate leg.** Perfect silence, no adjudicator → no admission.
5. **C3 destructive-call classifier — REFUSE as injection.** Deciding test: **injection vs enforcement** — the timely form is a new gate, consent-class; existing gates and permission systems own the harm classes.
6. **C4 failure-event debugging injection — REFUSE.** Deciding test: **frequency** (the event is the session's most repeated), restatement of `AGENTS.md:191-192`.
7. **Fleet notes to reconcile (not candidates):** (a) sentinel dominant-class specificity — the Level-1 branch mis-fires on research/lineage folders and file:line paths (`log:468`, `:476`); a detector-quality item, not an injection item; (b) sentinel channel truth is 5-off / 1-on (Pi, `completion/README.md:68`); (c) NC-A remains the lineage's only admitted object — its Claude registration is reconfirmed first-hand (`.claude/settings.json:169-189`, drift-fallback `additionalContext` at `:175`); the live delivery probe stays the standing gate before any adoption.
