{"timestamp":"2026-09-12T13:16:22.019Z","runtime":"claude","status":"fail_open","freshness":"unavailable","durationMs":92,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_EXIT_64"}
## ITERATION 9 FINDINGS

### 1. INVENTORY — the read-side set holds; the corpus's own doctrine explains why it lives where it does

The trigger texts, verified this iteration:

- `communication.md:37` (trigger block `:35-42`) — "About to write any substantive reply, an answer, an explanation, a close-out, a status."
- `evidence-and-proof.md:34-38` — "done"/"works" claims, reporting a result/path/output, acting on a tool's or sub-agent's success, write a completion summary, "close out a turn."
- `uncertainty-and-honesty.md:33-37` — not knowing, sources disagreeing, naming unverified things, operator disagreement, contradictions.
- `presenting-decisions.md:35-39` — recommendation/fork/trade-off, complex request, "start a multi-step stretch of work the reader will not see inside" (`:37`).
- `handoff-and-questions.md:35-39` — "end a turn, of any kind, substantive or not" (`:35`), along with asks and forks.
- `delegation-and-orchestration.md:37-41` — including `:41` "answer a judgment question … from your own reading alone."
- `root-cause-and-debugging.md:34-37` — "Anything fails" (`:34`); `skill-hub-routing.md:38-39` — reporting/quoting routing claims; `blast-radius.md:33-37` — mutations plus "any call that leaves this machine" (`:37`).
- `scope-discipline.md:35` (notice a defect — the read-only event is met by notice-and-name) and `prevent-overengineering.md:39` (thinking vocabulary; the failure is a subsequent write).

Two policy texts, previously unquoted in this lineage, that classify the whole set:

- **`decision-tests.md:32-41`** — Test 1: "A rule file loads on a trigger. Content that must bind when no trigger has fired cannot live in one." Ask: "on a turn where nothing fires, must this still hold?" → **Yes → it belongs in `AGENTS.md`. Refuse the rule.** The destination map at `:131` says `AGENTS.md`, as a compressed row. The corpus has a rehearsal for this class: `manual-testing-playbook/rule-decision/always-loaded-refusal.md:32` (refusal names Test 1 and the always-loaded destination).
- **`communication.md:40-42`** — the corpus's own account of read-side loading: "Its trigger is deliberately the broadest in the set: a rule about how replies read has to load whenever a reply is being written, or it silently stops applying to the short answers that need it most." Its companion at `decision-tests.md:48-51`: "A total move needs a total trigger, or the content goes quiet."

So the read-side design is documented policy — **breadth plus a resident remnant** (`communication.md:40`, §8 clauses per `REPO RULES.md:80-83`) — not an accident, and not a hook. The only clause with **no resident remnant** remains `delegation-and-orchestration.md:45-47` ("no single model's verdict, the delegate's or your own, closes a question"): `AGENTS.md:245` ("Finding = hypothesis") covers other-produced findings only.

New empirical result — **carrier census**. Nothing in `.opencode/hooks/` or `plugins/` reads or points at the corpus; grep for `REPO RULES|repo-rules/` across `.opencode` returns authoring tooling (`sk-create-repo-rule/*`), the `/create:repo-rule` command (`commands/create/README.txt:57`), and exactly **one live runtime prompt pointer**: `agents/orchestrate.md:847` ("`repo-rules/delegation-and-orchestration.md` — the orchestrating posture"). This confirms `check-repo-rules.cjs:5-9` ("nothing else reads it … no hook or workflow touches the router") at hook level and supplies the counterexample the lineage lacked: **role-scoped prompt carriage of corpus content is already shipped.**

### 2. CANDIDATES — three constructions and one retest, each against the silence requirement

**N1 — corpus constant on the advisor directive slot.**
- *Trigger:* every prompt (the slot fires per prompt; no corpus-relevance predicate exists to shape payload).
- *Silence:* cadence only — full on first proven message and after lifecycle boundaries, route-only repeats; "any error also stays full" (`injection-contract.md:64`). No relevance silence.
- *Cost:* spends from a capped channel — `SYSTEM_SKILL_ADVISOR_MAX_TOKENS` default 80 and `MAX_BRIEF_CHARS` 2 KiB (`skill-advisor-hook.md:123`) — and the retirement record already answered the frequency question: "a disposition re-asserted every turn spends context on something that was never in dispute, and **a reader who ignores it once ignores it a hundred times**" (`specs/hooks/014-retire-governor-and-proof-directives/spec.md:67-69`). Throttling cannot fix relevance.
- *Bar side — retired.* Purpose rule: "Every prompt carries the directive that has an enforcement mechanism, and nothing else" (`014 spec:77`); the survivor is admissible only because "a pre-commit gate rejects a commit that violates it" (`:71-73`); the corpus is level 3 (`REPO RULES.md:24-32`) and gate-free (`git/README.md:18` gate list).

**N2 — session-start corpus pointer (the surface this lineage never tested).**
- *Trigger:* `session_start`/`SessionStart` — the one model-facing injection that fires on pure read-only sessions by construction (`injection-contract.md:212-218`; composer at `.opencode/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:129-136`, whose fallback text is what this session received).
- *Silence:* none by relevance. The only switches are the `session-lifecycle` kill-switch (`hooks/README.md:52`) and which cached payload applies; every session receives it.
- *Cost:* a per-session constant whose content is either resident restatement (same retired rationale, now with `:67-69`'s margin argument) or the level-3 delegation clause carried with no enforcer; additionally it would make `system-spec-kit` a corpus consumer against the stated architecture (`check-repo-rules.cjs:5-9`). The repo's own session-start advisory surface (worktree/git-hooks/dist-staleness/codex-hooks) is deliberately stderr-only, "never delivered to the assistant" (`injection-contract.md:252-256`) — the architecture has already decided what session-start adds to model context, and it is continuity, not rules.
- *Bar side — retired.* No gate leg; restatement.

**N3 — automate the `orchestrate.md:847` pattern (role-scoped pointer, hook-generated).**
- *Trigger:* carrier entry — dispatch of a scoped role.
- *Silence:* genuinely smart — the carrier's wake-domain is a subset of the payload's applicability domain (every orchestrate run is a delegation act), so the pointer is relevant by construction.
- *Cost when generalized:* to serve session-level read-side obligations, the generator must find, for each rule, a carrier whose domain implies applicability — no session-scoped carrier has that property (§2 N4), so the generalizing version collapses back into N1 on the same channel. The realized form also needs no hook: `agents/orchestrate.md:847` is author-maintained, and a hook-generated pointer would be a second loader the corpus checker cannot see (it walks only `ROUTER_FILE` + `RULES_DIR`, `check-repo-rules.cjs:42-52, 166-195`).
- *Bar side — the realized form clears it by being scope-contained; the automated session form is retired-side.*

**N4 — inject the delegation clause on judgment vocabulary (retest).**
- *Trigger:* prompt matches judgment/recommendation vocabulary (`delegation-and-orchestration.md:41`).
- *Silence:* "no judgment vocabulary in the prompt" — observable but topic-absence, not failure-absence. It fires on the compliant judgment-discussion population and cannot see the solo-answer choice, which is made after the prompt event.
- *Why no predicate can close this — the deeper form of iterations 5-8:* every working prompt-time silence in the fleet is **domain containment**, not failure prediction — the carrier's wake-domain is inside the payload's applicability domain: advisor score vs. skill match (`skill-advisor-hook.md:37`), mutation classifier vs. Gate-3 applicability (`injection-contract.md:82`), resolving image path vs. OCR payload (`:100`), packet binding vs. goal payload (`:106-140`), lifecycle epoch vs. directive delivery (`:64`). A posture rule's applicability is "how the model is about to reason," which has no carrier, no entity, no session state, and no tool call that implies it. Silence conditions must be predicates over observable state; this failure dimension is invisible to the predicate class, so no candidate can state one.
- *Cost:* re-asserts an epistemic stance on every design turn; the injected copy could not carry tier-1 force (`REPO RULES.md:24-32`); no enforcer exists.
- *Bar side — retired*, and procedurally pre-answered: it is Test-1 content whose destination is an `AGENTS.md` row (`decision-tests.md:40, :131`). One-line collapse of the entity-keyed variant: keying on corpus paths fires only on rule-maintenance prompts, which are write-path where Gate 5 already fires (`AGENTS.md:122`).

### 3. SURFACE — carryable mechanically; three locks close the slot, and the read-only-capable channel is occupied by design

- Mechanical carriage exists: the directive slot is a single canonical owner (`render.ts`/`HYGIENE_DIRECTIVE`, `injection-contract.md:65`) and the session-start composer composes what it says (`session-prime.ts:129-136`). No new mechanism is needed to move text — the surface is not the blocker.
- Lock 1 — admission: gate-enforced prohibition or nothing (`014 spec:77, :92`), and the corpus is gate-free (`git/README.md:18`).
- Lock 2 — load-path design statement: "they are loaded at Gate 5 through the trigger table in `REPO RULES.md`, not retrieved at Gate 1; indexing them would surface a rule as a context candidate" (`retrieval-conventions.md:283`).
- Lock 3 — hooks-tree doctrine: cores keep code in the tree only if they "import nothing but Node builtins"; engines stay inside owning skills (`hooks/README.md:80-91`). A corpus reader is neither — it adds a data dependency on root-level files owned by no concern, with no kill-switch row in the index (`hooks/README.md:38-62` lists 23 concerns; none is corpus-related).
- The session-start surface — the one channel that fires on read-only sessions — is already occupied by continuity state (`injection-contract.md:212-218`), and its advisory sibling is stderr-only by deliberate design (`:252-256`). The repo has already placed all three read-side remedies where they belong: resident clauses, role-scoped prompt pointers (`orchestrate.md:847`), and rule files for write-path loads.

### 4. PORTABILITY — the repo-layout axis is solved (and irrelevant); the runtime axis is not uniform even for the precedent

- *Repo layout:* discovery is shipped code — `findRepoRoot` walks up for the `REPO RULES.md` + `repo-rules/` pair (`check-repo-rules.cjs:42-52`), matching Gate 5's resolution key ("any repository whose root holds a `REPO RULES.md`", `AGENTS.md:122`); absent corpus → silent (`AGENTS.md:128`). Pointer-form survives any layout because `repo-rules/<file>.md` is the corpus's own convention. So a candidate would port; it dies on the bar, not the layout.
- *Runtime axis (new):* prompt-time delivery is not uniform. `injection-contract.md:103` records a live probe: Cursor "does not deliver `beforeSubmitPrompt`" and two spec-kit hooks on that event are dormant; yet `skill-advisor-hook.md:55` still lists the Cursor advisor shim registered on `beforeSubmitPrompt`. The two documents conflict, and the contract's is the probe-backed one — meaning the "working precedent" this question cites is dormant on one of six runtimes. Any candidate riding that channel inherits the hole; the resident remedy has no runtime matrix at all.
- *Carrier-presence axis:* role-scoped carriers (`orchestrate.md:847`) are per-repo prompt files; the resident remedy moves content between two documents that are shared across all three repositories by construction (`AGENTS.md:11`; the corpus is symlinked) — the maximally portable form.

### 5. VERDICT — REFUSE the injection; one repair, one operator decision

No repo rule is better served by a prompt-time injection hook than by Gate 5 plus the resident layer. Every candidate either restates resident text without an enforcer (N1, N2, N4 — retired side of `injection-contract.md:54`) or is already realized in the only form that works (N3). The operator's constraint, answered on the repo's own evidence: smartness in this fleet means *domain containment* (a carrier whose wake-domain implies applicability) or *gate enforcement*; cadence is position, not relevance, and the retirement record already rejected repetition as a remedy (`014 spec:67-69`). No corpus rule has either property, so no candidate can state a silence condition — and "fires when relevant" is unfalsifiable, as required.

What remains is not a hook:

- **Change the rule instead — the one uncovered clause.** `delegation-and-orchestration.md:45-47`'s self-lens ("no single model's verdict, the delegate's or your own, closes a question") is Test-1 content (`decision-tests.md:32-41`) whose documented destination is a compressed `AGENTS.md` row (`:131`), beside the four-standards table (`AGENTS.md:241-246`) where "Finding = hypothesis" (`:245`) already carries the other-produced mirror. This is the same class as the communication near-miss (`decision-tests.md:48-51`, `communication.md:40-42`); the clause is repo-generic, and `AGENTS.md` is the cross-repo shared document (`AGENTS.md:11`) — portability is maximal by construction. The operator decides only whether the clause earns the row and its wording.
- **Leave at Gate 5** — everything else, unchanged.
- **Recorded side-finding for the contract's maintainers:** `skill-advisor-hook.md:55` and `injection-contract.md:103` cannot both be operationally current about Cursor; the probe-backed statement should win or the probe re-run.
