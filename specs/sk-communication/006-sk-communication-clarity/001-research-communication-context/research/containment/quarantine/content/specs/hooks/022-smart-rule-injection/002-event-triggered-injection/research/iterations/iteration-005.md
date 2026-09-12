{"timestamp":"2026-09-12T14:27:32.516Z","runtime":"claude","status":"fail_open","freshness":"unavailable","durationMs":124,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_EXIT_64"}
# ITERATION 5 FINDINGS

*This pass read first-hand: `injection-contract.md` (full), the hooks tree root README + `coverage-rationale.md`, the completion / session-lifecycle / goal / post-edit-quality / mcp-route-guard / spec-gate READMEs, the claude / codex / cursor / pi runtime hook READMEs, the Pi and OpenCode extension-model READMEs, `.claude/settings.json`, `.cursor/hooks.json`, the canonical `hook-registry.json`, the Codex hook-contract, both `repo-rules/` files, and `AGENTS.md` (Gate 5, standards, §8, close-out). What it adds: the authoritative **registered**-event inventory (two prior-iteration claims corrected), an **event-position** test for Idea One, the **mid-run continuation class** and **content-authorship** link for Idea Two, and four new candidates.*

---

## 1. EVENT SURFACE

**The registered surface, per runtime** (configs are generated from one canonical registry, `hook-registry.json:2`):

| Runtime | Events actually wired | Source |
|---|---|---|
| Claude | PreToolUse, UserPromptSubmit, SessionStart, Stop, SessionEnd, PostToolUse, PreCompact | `hook-registry.json:9-17`; `.claude/settings.json:16-203` |
| Codex | SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, Stop, PreCompact — no SessionEnd, no permission event, no agent-spawn event | `hook-registry.json:24-31`; `coverage-rationale.md:74,77` |
| Cursor | sessionStart, sessionEnd, preToolUse, postToolUse, beforeSubmitPrompt (confirmed **non-delivery**), beforeMCPExecution, preCompact (registered, delivery unconfirmed) | `.cursor/hooks.json:4-104`; cursor README `:24-38` |
| Devin | SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, PermissionRequest, Stop, PostCompaction, SessionEnd | `hook-registry.json:52-61` |
| Pi | handlers registered on `session_start`, `input`, `tool_call`, `tool_result`, `turn_end`, `session_compact`, `session_shutdown(quit)` — of **33 exposed events** | Pi README `:21-30`; `native-skills-and-extensions.md:83` |
| OpenCode | plugin hook model: `tool.exe­cute.before/after`, `experimental.chat.system.transform`, `chat.message`, `event` (`session.created`/`status`/`idle`/`deleted`/`resumed`/`compacted`/`compact`) | plugins README `:117-126` |

**Which fire on read-only sessions.** Always: session start (all six; `injection-contract.md:212-218`), prompt submit (all six; closed class), and the turn-end family — Claude/Codex/Devin `Stop`, Pi `turn_end`, OpenCode `session.idle` — where the completion sentinel evaluates a read-only wrap-up whose tail carries a claim word (`completion/README.md:31`). Tool-time events fire too, but on a read-only session their handlers are shape-keyed (Write/Edit, bash-dispatch, mcp) and produce allow/no-op. Rare: compaction (long sessions only). Never: post-edit-quality (write-keyed, `post-edit-quality/README.md:26`), and no event loads or carries the rule corpus — nothing changed there since iteration 1 (see the NC-E refusal, iteration 4 §4).

**Unused, and why** (the surface nobody claims):
- Cursor's confirmed-but-unwired set: `beforeReadFile`, `afterFileEdit`, `afterAgentThought`, `subagentStart`, `subagentStop`, `postToolUseFailure`, `afterMCPExecution`, `afterAgentResponse` — "No current repository guard consumes these events" (cursor README `:31-38`, documented names at `cli-cursor/references/hook-contract.md:71`).
- Claude's `PermissionRequest` — acknowledged and deliberately unclaimed as duplicative (`coverage-rationale.md:74`).
- Pi: ~25 of 33 events unregistered; the repo has already tested the ones with candidate-shaped payloads (`agent_end` iteration 1, `message_end` NC-C, pre-compact NC-D).
- Session-end on every editor + Pi: fires, injects nothing, by design (`injection-contract.md:220-224`; session-lifecycle README `:45`).

**Two corrections to earlier iterations, both first-hand:**
1. **The Cursor completion sentinel is dormant, not "log only."** `completion/README.md:67` claims an `afterAgentResponse` adapter that fires; the live-verified Cursor table says `afterAgentResponse` is *not wired* and "no current repository guard consumes" it (cursor README `:38`); `.cursor/hooks.json` contains no `afterAgentResponse` key; and the canonical registry binds `completion-evidence-stop` only to claude/codex/devin/pi (`hook-registry.json:223-263`). The adapter file exists (`system-spec-kit/runtime/hooks/cursor/README.md:54`) and is orphaned. The sentinel runs on **five of six**, not six (iteration 1's table said Cursor = advisory log only; it is zero delivery).
2. **Cursor has no per-turn completion signal.** `stop` never fires under `cursor-agent -p`; `sessionEnd` (the actual completion signal) fires once per process; `afterAgentResponse` is unwired (cursor README `:35`, `:38`). So "turn-end fires every turn on all five runtimes that wire it" (iteration 4) resolves to: per-turn on Claude/Codex/Devin/Pi + OpenCode idle; per-process only on Cursor.

Everything else the round established stands: the sentinel detects on five of six and injects on Pi alone (`completion/README.md:64-69`); Session Stop is `[NONE]`; the goal hook reads backward composition at `turn_end` and nudges only when **not** met (`goal/README.md:46`,`:77`).

---

## 2. IDEA ONE — completion presentation

**REFUSE — unchanged verdict, one new deciding test.**

**New test: event position.** Split the fleet's events by where they sit relative to the artifact the guidance would improve:
- *After the final message exists* — Stop/turn_end/session.idle, the sentinel's tail-400 trigger (`completion/README.md:31`), goal "met". Timely-relevant, but the action window has closed; the only thing an injection could shape is a future turn, and the message is frequently the session's last.
- *Before the final message is composed* — prompt-time (closed class) and tool-time. Tool-time is the only live corridor: the model composes its final message after its last tool result. But at any tool event the "this turn will end with a completion claim" predicate is **definitionally undecidable** — the sentinel's own trigger is a property of the finished text (`completion/README.md:31`), not of any tool event. Key it there and it is the every-tool-call constant the retired directives were (`injection-contract.md:54`).

So timely and decidable are disjoint for this payload. That subsumes iteration 1's "delivery latency" and iteration 4's frequency finding as two names for the same geometry.

**Standing legs, one line each:** payload resident at `AGENTS.md:405-409` and verbatim `:501`, with the rule deferring to mode contracts at its own moment (`presenting-decisions.md:129-132`); goal-met deliberately emits silence (`goal/README.md:46`; no continuation surface outside OpenCode).

**New exhibit: the fleet already owns a post-composition operator-visible seam, and confined it.** OpenCode's `chat.message` projection can `atomicReplace`/`appendAfterOriginal` the assistant text (`.opencode/plugins/sk-communication-projection.js:39-43`), and its own constraints are the tell: opt-in, byte-exact restore on any non-accept, and a hard "exact-original" fallback because the seam is context-blind (`:33-37`). The fix-the-final-message class was built, once, for copy-editing with consent — the same authorship boundary that killed NC-C. Presentation *guidance* through it would repeat that violation.

---

## 3. IDEA TWO — structured question triggering

**REFUSE as designed. The timing problem, stated plainly: detection is solvable; the remedy is fatal — and the fatal link is content authorship, not just timing.**

**New test A — the mid-run continuation class, which iteration 3's "5 of 6 runtimes contain no turn-reopening surface" missed.** `[BLOCK]` responses are structurally followed by another model step: the legend's own words are "the assistant's next turn has to react to the failed call" (`injection-contract.md:40`). The fleet exploits this: spec-gate's `evaluateMutation` returns advise/deny **mid-run** (`lib/spec-gate/README.md:44-49`; Cursor's deny path live-verified to block, cursor README `:27`; Codex honors `permissionDecision: deny`, `hook-contract.md:86`; Pi returns `block: true`, Pi README `:24`; OpenCode throws, `:49`). So the turn *is* open when a tool call bounces. The only missed-question class that manifests as an action event — a mutation attempted with Gate 3 unanswered — therefore already gets its ask delivered at that moment: the deny reason **is** the question (`injection-contract.md:150-154`; the question itself is classifier-authored, `injection-contract.md:72-84`). For every other "should have asked," the failure produces no action event; it produces prose.

**New test B — content authorship is the fatal link.** The harness can detect a missing ask (`goal/README.md:46` proves backward evaluation), but for a general missed question the alternatives exist only inside the model's composed reply. The harness has no ask to trigger the tool *with*. The one question with a non-model author (Gate 3's classifier) already ships through a live channel. Meanwhile the question surface is per-runtime and partly unverified (`handoff-and-questions.md:125-131`: Claude `AskUserQuestion` named; Pi extension recorded; OpenCode "name not recorded"; Codex "unverified"), and the rule forbids inventing names (`:138-140`) — a detector that guessed one would fail silently, the exact failure the rule warns about.

**New test C — mid-generation actors.** Pi's steering path is the only mid-stream actor, and it is the operator's: the sk-vision handler explicitly passes "mid-stream steers" through untouched and only auto-injects images after a grace window (`.pi/extensions/README.md:73`). Extensions still do not get a mid-generation injection channel. Nothing new to build on.

Standing: form-vs-substance (`handoff-and-questions.md:108-110`, prose is the compliant default) and the resident relay obligation (`AGENTS.md:409`).

---

## 4. NEW CANDIDATES

Held to the same bar: event + runtimes, silence, wrong-fire cost, portability, bar side. Portability is clean for all four (framework text or core-produced payloads; no hub-internal paths) — the bar and the delivery mechanics decide, as before.

**E1. The consent-request event → blast-radius rollback text.**
- *Event/runtimes:* Devin `PermissionRequest` (live, [BLOCK], `injection-contract.md:246-250`); Claude `PermissionRequest` (exposed, deliberately unclaimed, `coverage-rationale.md:74`). Codex fires no permission event; Pi has no separate approval event; Cursor's consent moment is `preToolUse`, already covered (cursor README `:30`). Partial by construction.
- *Payload:* `AGENTS.md:164` — "Name the rollback, stop for yes" — surfaced at the approval prompt.
- *Silence:* only when a permission is actually requested; rare and discrete. Good.
- *Wrong-fire cost:* low (operator-facing prompt text).
- *Bar side — retired.* The model's obligation is to name the rollback *before composing the call*; by permission time the call exists, and the operator already sees it. Devin's existing adapter composes allow/deny for this exact event from the same cores (`injection-contract.md:248`). The payload's action window closed one step earlier, same lateness test as Idea One.
- *Deciding test:* action window + existing owner.

**E2. Child-completion event → the "Finding = hypothesis" grade.**
- *Event/runtimes:* Cursor documents `subagentStart`/`subagentStop` as exposed and **unwired** (cursor README `:38`; `hook-contract.md:71`); no other runtime has a named child-completion hook in the registry. The deployment guards are dispatch-side only (`.claude/settings.json:38-57`; `coverage-rationale.md:76-78`), so a returned child arrives as an ordinary tool result everywhere else. Partial answer, stated.
- *Payload:* `AGENTS.md:245` — a sub-agent's "COMPLETE" is a claim about itself until something you ran confirms it.
- *Silence:* only when a child returns; rare and discrete.
- *Wrong-fire cost:* low.
- *Bar side — retired.* The payload is resident **unconditionally** (`AGENTS.md:239`: "These five bind unconditionally"); no gate enforces parent-side confirmation at the child's return, and the only runtime that names the event has never wired it. The event has no unique object — which is exactly why nothing is wired there.
- *Deciding test:* restatement + unwired delivery.

**E3. Dispatch provenance — session start with `AI_SESSION_CHILD=1` → "Gate 3 is pre-resolved; do not ask."**
- *Event/runtimes:* SessionStart fires on all six (`session-lifecycle/README.md:53-60`); the flag is the framework's own vocabulary (Gate-3 child-dispatch exemption; `lib/spec-gate/README.md:99`). Delivery needs one adapter line where session context exists; OpenCode's session events are plugin-owned (session-lifecycle README `:60`).
- *Silence:* fires only for dispatched children; parents never see it.
- *Wrong-fire cost:* low.
- *Bar side — refused, on the strongest mechanism test this round produced.* The child case is **resolved in code, not prose**: both spec-gate entrypoints short-circuit on `AI_SESSION_CHILD=1` "before any state read, question, denial, or telemetry" (`lib/spec-gate/README.md:99`). An injection would restate a mechanism the system already enforces itself — no gate leg, nothing left for it to change.
- *Deciding test:* the mechanism already answers the event. (Recorded because "does an event need a payload when its consumer is mechanically special-cased?" is the general question every future provenance-keyed candidate must answer.)

**E4. The channel-parity audit — two instances the lineage never inspected.**
- *Instances:* (a) OpenCode's `mcp-route-guard`: [SYS] on five runtimes, `[LOG]`-only on OpenCode (`injection-contract.md:175`; plugins README `:30`), while the same plugin family drains to `experimental.chat.system.transform` elsewhere (plugins README `:33`, `:124`). (b) Cursor's completion sentinel: adapter exists (`completion/README.md:67`; cursor README `:54`), event unwired (cursor README `:38`; `hook-registry.json:223-263` has no Cursor binding).
- *Silence:* family-native MCP call; completion claim. Both rare and discrete.
- *Wrong-fire cost:* low (bounded advisories; redaction/log caps in both cores).
- *Bar side — both refused as injections.* (a) The routing advisory is a context-economy preference ("the mcp-code-mode SKILL mandates", mcp-route-guard README `:39`) — no gate enforces the route — and its OpenCode log-only shape reads as a recorded transport choice. (b) The sentinel is advisory-log by explicit v1 policy (`completion/README.md:133`; `injection-contract.md:242`), so binding the missing event restores telemetry, not injection; upgrading it is the consent class refused twice.
- *Deciding test:* gate leg (a) and policy channel (b). Recorded finding: the fleet has a measurable parity axis — identical cores, diverging transports — and NC-A remains the **only** parity gap whose payload carries a gate-backed prohibition.

**The idea the bar forbids so plainly nobody proposed it (recorded):** a pre-write hygiene reminder on every Write/Edit. It fails by construction — the highest-frequency event in the fleet, zero silence — while the same text already ships prompt-time (`injection-contract.md:52-54`) and post-edit (post-edit-quality README `:26`, `:66-71`), with the pre-commit gate as the enforcement. Frequency, restatement, third delivery of an already-served text.

---

## 5. VERDICT

1. **Idea One — REFUSE.** Deciding test: **event position** — timely events are undecidable (no tool event can know the turn will end with a completion claim; `completion/README.md:31`), decidable events are actionless (the message is composed; often the last one). Secondary: restatement (`AGENTS.md:405-409`, `:501`) and the confined projection seam (`.opencode/plugins/sk-communication-projection.js:33-43`).
2. **Idea Two — REFUSE as designed.** Deciding test: **content authorship** — the alternatives to ask with exist only in the model's composed reply, except in the one class whose ask already ships (Gate 3, mid-run at the deny/advise event; `injection-contract.md:40`, `:150-154`). Sub-test: the mid-run continuation class exists and is already occupied where it matters; the question-tool surface is per-runtime and partly unverified (`handoff-and-questions.md:125-131`).
3. **E1 consent-request — REFUSE.** Deciding test: action window closed before the event (`AGENTS.md:164` obligation precedes the call; Devin's adapter owns the event, `injection-contract.md:248`).
4. **E2 child-completion — REFUSE.** Deciding test: restatement of an unconditional standard (`AGENTS.md:239`, `:245`) plus an event wired nowhere (`cursor README:38`).
5. **E3 child-session provenance — REFUSE.** Deciding test: the mechanism already answers the event in code (`lib/spec-gate/README.md:99`) — no injection can beat a short-circuit.
6. **E4 channel parity — REFUSE as injections.** Deciding test: no gate leg (mcp routing) and a policy-owned channel (sentinel `[LOG]`). Kept as the parity inventory: post-edit-quality (NC-A) is the only gap with an admitted payload.
7. **Fleet findings to reconcile (not candidates):** the Cursor sentinel dormancy (`completion/README.md:67` vs cursor README `:38` + `.cursor/hooks.json` + `hook-registry.json:223-263`) — either bind `afterAgentResponse` for log parity or correct the doc; and the per-turn completion signal does not exist on Cursor at all.
