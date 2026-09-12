### Iteration 1
## 1. INVENTORY
- `communication.md:37` — "About to write any substantive reply, an answer, an explanation, a close-out, a status." AGENTS.md `:404` confirms its trigger is "every substantive reply".
- `evidence-and-proof.md:34-38` — reporting a result, a number, a path, a tool/sub-agent's finding; closing out a turn.
- `uncertainty-and-honesty.md:33-37` — answering without certainty, naming an unverified path/flag/version, operator disagreement.
- `presenting-decisions.md:35-39` — recommendations, forks, trade-offs, ambiguous requests, long-run reports.
- `handoff-and-questions.md:35-39` — "About to end a turn, of any kind, substantive or not"; asks, forks, un-made decisions.
- `delegation-and-orchestration.md:41` — "About to answer a judgment question ... from your own reading alone."
- `root-cause-and-debugging.md:34-37` — anything failing; diagnosis is usually read-only investigation.
- `skill-hub-routing.md:38-39` — "Reporting that a mode is registered, routed, reachable or integrated. Running a per-hub gate and quoting its result."
## 2. CANDIDATES
## 3. SURFACE
## 4. PORTABILITY
## 5. VERDICT

### Iteration 2
## 1. INVENTORY — read-only bindings: iteration 1's list holds; the answer it missed is that this is by design
## 2. CANDIDATES
- **Trigger (observable):** prompt text requests a push/publish; or pre-turn git state (unpushed commits on a non-allowlisted branch).
- **Silence condition:** branch on the allowlist (`pre-push:23`); no unpushed commits; kill-switches.
- **Cost when wrong:** fires on every status/question turn in a workspace holding unpushed commits; carries ~2 lines telling the model something the operator's own words already said.
- **Bar side — retired.** The observable signal and the failure case are *disjoint*: the case that fails is the model pushing unprompted mid-turn, which has no prompt-time signature; when the user asks to push, that instruction self-authorizes (`AGENTS.md:332` — "an explicit user push instruction counts as that go-ahead"). The only deliverable version is a constant line, i.e. the retired every-turn shape. The gate's block message is already a complete instruction (`pre-push:175-183`).
- **Trigger (observable):** routing vocabulary in the prompt ("is X routed/wired/registered"); better than A — it can land on the failure turn (claim composed after a prompt-time injection).
- **Silence condition:** no routing vocabulary; already delivered this session (directive lifecycle, `injection-contract.md:64`); advisor kill-switch.
- **Cost when wrong:** fires on the high-frequency "which skill for X" class where no claim is being made about wiring.
- **Bar side — retired.** Two independent failures: (1) its content is resident verbatim at `AGENTS.md:114`, so a directive restates the system prompt; (2) no gate enforces claim discipline — the rule's own text says so: `skill-hub-routing.md:75` *"A green gate is not integration. The per-hub gate covers some surfaces and asserts only presence, never reachability."* The manifest gates (`pre-push:230-266`, `:205-228`) police the wire, not the sentence, and the commit-time route gate self-heals (`pre-commit:213-228` auto re-mints and stages) — so there is no block cycle for a directive to pre-empt. This is "proof-over-appearance" applied to routing: a claim-justification discipline, resident, ungated. Retired side.
- **Trigger (observable):** failing check in play; fix vocabulary in prompt. Not resident (`AGENTS.md:191-192` carries reproduce/seam, not weakening).
- **Silence condition:** no failure in the session.
- **Cost when wrong:** noise on every debugging turn.
- **Bar side — fails the gate leg.** Nothing detects a loosened assertion or skipped test (the mass-deletion ceiling catches only bulk, default 100 tracked files, `pre-push:96-118`); and it needs no earlier delivery — weakening a check *is* a write, so Gate 5 fires first (`AGENTS.md:122`). **Leave at Gate 5.**
## 3. SURFACE — the contract can carry a directive without a new mechanism; the surface is not the blocker
## 4. PORTABILITY — pointer-form survives; content- or command-form does not
- **Discovery key:** resolve workspace root install-anchored (precedent: `skill-advisor-hook.md:36` "install-anchored walk, not CWD-relative"), then check for `REPO RULES.md` — the same key Gate 5 uses (`AGENTS.md:122`). Absent → silent. Portable across all three repos by construction.
- **Inject only the pointer.** `repo-rules/<file>.md` is a corpus-internal convention owned by `REPO RULES.md` itself (`REPO RULES.md:40-50`), stable wherever the corpus is symlinked. Inlining rule *content*, or a checker command living inside a hub, breaks "hub names are stable; paths inside hubs are not" — `skill-hub-routing.md:86` deliberately says "The commands are in the reference above" rather than naming them, and the hygiene directive itself hardcodes no path. Any candidate must do the same.
- **Consequence:** portability is satisfiable only for a pointer-form, predicate-gated directive — and none of §2's candidates has a predicate that isolates a failure case cheaply (§2A: disjoint; §2B: redundant; §2C: no gate). Portability is not what kills them; the bar is.
## 5. VERDICT — REFUSE the injection; the corpus stays at Gate 5, and the read-only bindings stay in the resident layer

### Iteration 3
## ITERATION 3 FINDINGS
### 1. INVENTORY — read-only bindings, with the lineage's method corrected
- `communication.md:37` → resident at `AGENTS.md:404` (pointer plus "Load it before answering"), with the always-on minimum kept resident by policy: `REPO RULES.md:80-83` — "§8 keeps the two clauses that must bind even when nothing loads."
- `evidence-and-proof.md:34-38` → `AGENTS.md:239`: "These four bind unconditionally, including on a read-only turn where Gate 5 never fires and no rule file loads" (+ table `:241-245`).
- `uncertainty-and-honesty.md:33-37` → `AGENTS.md:482` ("Never fabricate") + §2 confidence table.
- `presenting-decisions.md:35-39` → `AGENTS.md:499`. `handoff-and-questions.md:35-39` → `AGENTS.md:500`.
- `root-cause-and-debugging.md:34-37` → §3 debugging block, via its expansion pointer `AGENTS.md:175`.
- `skill-hub-routing.md:38-39` → `AGENTS.md:114` (two-stage paragraph incl. "never report a mode as routed because a registry entry exists").
- `delegation-and-orchestration.md:41` → **the one thin spot.** A grep of AGENTS.md for "own reading alone / one model / verdict closes" returns only `:239`; §9 carries a bare posture pointer. The self-directed clause (`delegation-and-orchestration.md:47` — "no single model's verdict, the delegate's or your own, closes a question") has only a weak resident analogue: `AGENTS.md:245` covers *other-produced* findings, not your own closing verdict.
- `blast-radius.md:33-37` = delete/overwrite/truncate/migrate/deploy/publish/send/install/"call that leaves this machine" — mutations all. The read-adjacent stakes read (`:46-48`) fires at the start of non-trivial *work* and is resident at `AGENTS.md:163`.
- `scope-discipline.md:35` — "You notice a defect…" is a read-only *event*; the failure (fixing it) is a write. Notice-and-name is the compliant path, not a failure mode.
- `prevent-overengineering.md:39` — trigger explicitly includes "thinking" 'flexible', but the failure (adding) is a write, and the loop is resident at `AGENTS.md:181` (pre-write pass).
### 2. CANDIDATES
### 3. SURFACE
### 4. PORTABILITY
### 5. VERDICT

### Iteration 4
## ITERATION 4 FINDINGS
### 1. INVENTORY — read-only bindings, re-verified, plus the policy that classifies the whole set
- `communication.md:37` — every substantive reply. Carrier: `AGENTS.md:404` ("Load it before answering") + remnant `:410`.
- `evidence-and-proof.md:34-38` — reports, numbers, paths, close-outs. Carrier: `AGENTS.md:239` + table `:241-245`.
- `uncertainty-and-honesty.md:33-37` — unverified names, disagreements, contradictions. Carrier: `AGENTS.md:482-484` + §2 confidence table (`:88`).
- `presenting-decisions.md:35-39` → `AGENTS.md:406`. `handoff-and-questions.md:35-39` → `AGENTS.md:408`.
- `root-cause-and-debugging.md:34-37` → §3 debugging block via `AGENTS.md:175`.
- `skill-hub-routing.md:35-39` → `AGENTS.md:114`.
- `delegation-and-orchestration.md:37-41` — **partial carrier only.** `AGENTS.md:245` covers other-produced findings; `:418` is a bare pointer with no content. Unchanged thin spot.
### 2. CANDIDATES
- Trigger: phrase hit in the per-prompt lookup (`AGENTS.md:83`). Silence: no hit.
- Cost when wrong: a rule surfaced as a context candidate where no action is at hand — the exact failure pre-ruled at `:283`; plus the index is "committed, size-tracked, fail-closed-on-malformed… parsed cold" on every lookup (`:281`).
- Bar side: **retired side, already decided against in writing** — the policy rationale is the retirement bar restated for the retrieval family. Refuse; do not reopen. Manual escape hatch stays open by design: ripgrep reaches repo-rules "if passed as a root" (`:283`) — deliberate retrieval, not automatic surfacing.
- Trigger candidates: judgment-question vocabulary (`:41` "is this the right design") — topic-keyed; or cadence.
- **Silence: not constructible.** The failing act is composing the reply; any hook runs before it. The only silences available are topic-absence (fires on the whole design-discussion class) or cadence (not relevance). No session state tracks "judgment asked, not yet grounded."
- Cost when wrong: re-asserts an epistemic disposition on every design turn; and rule-file content is level 3, "Only by level 1 or 2" overridable (`REPO RULES.md:24-27`) — the injection could not carry the survivor's force.
- Bar side: **retired side.** Disposition-shaped, no gate leg: the gate chain (`git/README.md:18`) enforces mechanical invariants only, and the one reply-shape checker is `[LOG]`-only "by explicit design" (`injection-contract.md:240-244`).
- Verdict: **change the rule instead** — resident promotion, the mechanism `REPO RULES.md:80-83` documents and `AGENTS.md:239`/`:404` instantiate. Operator decision, not a hook.
### 3. SURFACE — carryable mechanically; nothing admissible to carry
- The contract carries constants with lifecycle dedup (`injection-contract.md:64`), a classifier-gated question (`:82-83`), a resolve-gated evidence block (`:100`), session-bound context (`:106-140`). A repo-rule directive would slot in mechanically (renderer `:65`, channels `:66`).
- But every smart silence in the fleet is content-absence, session state, classifier score, or cadence — **no rule-relevance predicate exists anywhere**, and the policy row explains why: rules were kept out of the one lane that scores documents (`retrieval-conventions.md:283`). All remaining predicates draw on an action surface that reply-shaped obligations never touch.
- The repo has already placed reply-shape checking where the evidence exists — at Stop — and kept it `[LOG]`-only (`injection-contract.md:240-244`). That is the precedent, not a gap to close.
- Payload-class mismatch: prompt-time payloads today are route advisories (§2 domain) and hard-block reminders (§1 domain); corpus content is level 3 (`REPO RULES.md:24-32`).
### 4. PORTABILITY — the refusal ports trivially; the only surviving remedy is the most portable option
- Refusal: nothing to port.

### Iteration 5
## ITERATION 5 FINDINGS
### 1. INVENTORY — the read-only set is unchanged; what iteration 5 adds is its structural classification and the gate-side proof
### 2. CANDIDATES — two constructions never tested, one re-test, each with its silence condition and bar side
- **Trigger:** the prompt scores as probable file mutation (`injection-contract.md:82`), once per session until answered.
- **Silence:** read-only prompts (the classifier says no); answered session. Precise, observable — and wrong-shaped.
- **Cost when wrong:** fires on every session's first write-intent turn carrying text that restates the *resident* Gate 5 block (`AGENTS.md:121-129`), including its own sentence "that load is a Read, not a Gate Action, so on a file-modification request it queues behind Gate 3" (`AGENTS.md:126`).
- **Bar side — retired.** Restatement of resident text (`AGENTS.md:121-129`), and the load it asks for already fires at exactly that moment. It covers zero of the gap: the read path is where it does not fire, by construction. Its one merit is negative: it proves the fleet's only prompt-classifier points at the write path, the opposite pole of the uncovered surface.
- **Trigger:** prompt vocabulary matches a corpus rule class (e.g., judgment/recommendation vocabulary → `presenting-decisions.md` pointer).
- **Silence:** first matching prompt per session, via directive-lifecycle dedup (`injection-contract.md:64`); no vocabulary match, never. This satisfies the operator's letter — one line, once.
- **Cost when wrong:** two-part, and the second part is new. (i) Topic selectivity ≠ failure selectivity: it fires on the compliant majority and cannot distinguish the turn where the model will bury the verdict from the turn where it will not — the failure is agent-side (5.1). (ii) **Cadence dedup is anti-correlated with relevance.** Once-per-session delivery is *guaranteed* to be absent on the second and later offending turns, and present on the first turn of the class, when no reply obligation is yet in play. The only silence the protocol offers optimizes spam, not timeliness — iterations 2/4 listed "cadence" as a silence class without noting it can never be relevance.
- **Bar side — (a) passes on read-only sessions, (b) fails.** On a pure read-only session nothing carries the corpus (`AGENTS.md:122`), so a pointer would add, not restate. But no gate enforces any corpus reply obligation (5.4), so the directive would spend context without a backstop — which is the exact reason `:54` gives for the hygiene survivor's load-bearingness.
- **Additional collapse:** the admissible payload set is the uncovered set, which is one clause (5.3). Any *narrow* version of C2 converges on C4; any *broad* version (cover the corpus's vocabulary) fires on nearly every substantive prompt and becomes the constant delivery the retired shape was (`:54`). Both ends fail.
- **Trigger:** `delegation-and-orchestration.md:41`, "about to answer a judgment question … from your own reading alone."
- **Silence: not constructible, and now provably so.** The failure is the choice to *solo-answer*; that choice is made after the prompt event every predicate can see (`injection-contract.md:48`). The clause's own conditional ("from your own reading alone") is not observable at injection time; the only observable is the topic class ("is this the right design"), which fires on the whole judgment-discussion population, compliant and failing alike. The fleet's predicate inventory — score threshold (`:52`), mutation classifier (`:82`), entity resolution (`:100`), session binding (`:106-140`), delivery cadence (`:64`) — reads prompt-side or session-side evidence only. No predicate reads the model's future composition. This supersedes iteration 4's "not constructible" with the reason: it is not that no predicate was found, it is that the failure dimension is invisible to the predicate class.
- **Cost when wrong:** re-asserts an epistemic stance on every design turn; and the rule file is level 3 (`REPO RULES.md:24-32`), so an injected copy could not carry tier-1 force anyway.
- **Bar side — retired.** (b) fails; disposition-shaped reminder.
- **Remedy (tested, not repeated):** iteration 4 said "change the rule." Iteration 5 names the target and the portability proof. Candidate homes: the four-standard table (`AGENTS.md:237-245`), whose "Finding = hypothesis" row already covers *other-produced* claims — the self-lens clause is its mirror and belongs beside it — or §7 escalation (`AGENTS.md:445` region, "Confidence stays <80%…"). Both promotion precedents exist: down into the corpus (`REPO RULES.md:80-83`) and up with "bind unconditionally" (`AGENTS.md:239`). The clause is repo-generic, so promotion into shared `AGENTS.md` is the maximally portable form — zero paths, identical across all three repositories. Direction is genuinely the operator's call, because it decides *where* the clause lives for all three repos.
### 3. SURFACE — the contract can transport text; it cannot transport a smart silence for agent-side failures, and the repo has already chosen the surfaces for reply-shaped checks
- Action-detectable → **[BLOCK]** at tool time, where "the denial reason is the content the model receives" (`injection-contract.md:150-154`) — structural silence: fires only on the violating call. This is the perfect-silence surface, and it exists; it simply has no corpus subject (5.4).
- Stop-detectable reply claims → **[LOG]** advisory, kept invisible "by explicit design: 'Advisory only for the entire v1 rollout, never `{decision:"block"}`'" (`:240-244`). This is the repo's one experiment aimed at a corpus-shaped failure — evidence-and-proof's completion claims — and its deliberate setting is non-blocking and non-injected.
- Entity-resolvable prompt content → **[SYS]** prompt-time (`:100`), whose cost rationale is the fleet's best silence statement: a path that does not resolve "produces nothing, deliberately, so a filename mentioned in passing never spins a local GPU" (`:100`).
- Session-bound state → goal injections (`:106-140`), spec-gate's once-per-session-until-answered (`:82`).
### 4. PORTABILITY — pointer form survives the layout test; the surviving remedy does not need to
- **Discovery is proven.** The advisor precedent resolves workspace "install-anchored, not CWD-relative, so the hook stays correct off-root" (`skill-advisor-hook.md:36`, `:53`, `:98`), and Gate 5's own resolution key is "any repository whose root holds a `REPO RULES.md`" (`AGENTS.md:122`). A pointer-form candidate can find the router in all three repos by the same walk.
- **Names are stable by construction.** The corpus is shared by symlink; the router routes "per-rule documents under `repo-rules/`" (`REPO RULES.md:4`), and the trigger table (`REPO RULES.md:40-50`) is the central routing index. A pointer naming `repo-rules/<file>.md` breaks nothing — those names are the corpus's own stable vocabulary.

### Iteration 6
## 1. INVENTORY — read-only bindings, re-verified, plus what the parent round already settled
## 2. CANDIDATES
- **Trigger:** every user prompt; payload appended to the advisor brief, which fires per prompt (`injection-contract.md:48`).
- **Silence:** exact and observable — the delivery-state machine: constant directive full on "the first proven message and after lifecycle boundaries", route-only otherwise, "any error also stays full" (`:64`; `skill-advisor-hook.md:40`, `:137`). But it is **positional**, not relevance: anchored to message position and lifecycle events.
- **Cost when wrong:** (i) full delivery lands on the session's first message, before any turn where a corpus rule binds; (ii) on later binding turns the same cadence suppresses it — iteration 5's anti-correlation, now mechanized and with its anchoring named; (iii) the fail direction is *toward spam*: any state/helper error "stays full" (`:64`), i.e. yields the every-turn constant the operator forbids; (iv) the surviving hygiene directive has a gate (pre-commit) **and** a second detector (post-edit-quality, `:191-204`); a corpus constant has no equivalent leg.
- **Bar side — retired.** It is the retired every-turn shape on a cadence, restating level-3 content (`REPO RULES.md:26`) with no enforcing gate.
- **Mechanism precedent, proven:** the goal hook reads *backward composition* — `turn_end` flattens the ending message + tool results into evidence (`pi/goal-context.ts:149`), a fail-closed heuristic verifier runs over it (`goal-core.cjs:591-619`, evidence "never trusted" `:361`), the verdict is carried as `last_check: <verdict> ; reason: <reason>` (`goal-core.cjs:542`) and injected on subsequent turns (`injection-contract.md:132`). Iteration 5's "no predicate reads the model's … composition" holds **forward only**; the backward direction is production.
- **Trigger:** a new completion-sentinel finding since the last prompt.
- **Silence:** no new finding — precise, observable. But it observes the *previous* turn.
- **Cost when wrong:** the failing turn is already over (the operator read the claim); a heuristic false positive (`unclear`/`not-met`) steers the next, possibly unrelated turn; it upgrades a log the repo explicitly keeps advisory into model-visible direction — "Advisory only for the entire v1 rollout, never `{decision:"block"}`" (`injection-contract.md:242`) — without that decision being made.
- **Bar side — retired.** No gate enforces completion evidence (the sentinel exists *because* nothing blocks); the four standards already bind resident (`AGENTS.md:239`). Unlike the goal block — operator-created state, display, consented lifecycle — this is corpus advice with no consent and a heuristic "verifier".
## 3. SURFACE
- The lifecycle is a **delivery-economy device**, orthogonal to relevance by construction (`:64`); reusing it inherits positional silence.
- The back-loop needs **no new mechanism class** — C2's surface leg passes on the goal precedent. Its refusal is bar-side, not surface-side. This is the strongest form the question has taken so far.
- For *rule content specifically*, an injection becomes a second loader the corpus gate cannot see. `repo-rules-corpus.yml:25` exists to prevent "a rule silently unloaded"; a hook carrying `repo-rules/<file>.md` names outside the checker's walk would reopen that class — the pointer replaces "unloaded" with "unresolved", and nothing validates the hook against the corpus.
## 4. PORTABILITY
- **C1:** maximal — the advisor runs on all six runtimes, resolves install-anchored (`skill-advisor-hook.md:36`); no layout dependency. Refused on the bar, not on layout.
- **C2:** producer is a Stop-side event and the fleet documents Cursor's stop never fires (`injection-contract.md:138`), with sentinel artifacts already runtime-specific (`:242`) — a back-loop would be live in some runtimes, dead in others. The CI guard is per-repo; a shared hook has no cross-repo equivalent.
- **C3:** pointer form ports; moot.
## 5. VERDICT
- No candidate clears the bar: C1 and C2 land on the retired side, and C2 — the only one whose surface leg passes — fails on the same leg the hygiene survivor passes (gate-enforced prohibition, `injection-contract.md:54`) with none present.
- The delegation clause (`delegation-and-orchestration.md:47`) remains the sole uncovered read-side obligation; the remedy stays promotion into the resident layer (iterations 4–5), now corroborated by the parent round's own conclusion (`iteration-010.md:83`) and the documented mechanism (`REPO RULES.md:80-83`). The operator's decision is the carrier: §9's pointer region (`AGENTS.md:418`) or the four-standards table (`:241-246`).
- The hard constraint answered: no candidate offers a relevance-keyed silence observable at prompt time for rule obligations. The two silences rule content admits — delivery position (C1) and prompt vocabulary/entity (C3) — are respectively anti-correlated and self-defeating; C2's precise silence is real but backward-looking and bar-failing.

### Iteration 7
## 1. INVENTORY — the read-side set re-verified by direct grep, plus two additions, one negative, and the carrier-form map the fix needs
- `presenting-decisions.md:37` — "About to start a multi-step stretch of work the reader will not see inside." A long read-only research or review pass — this session's shape — binds it. Carrier: `AGENTS.md:406` (content-form: "the intended path stated before a long stretch of work").
- `blast-radius.md:37` — "Any call that leaves this machine." The corpus's one action class that need not be a *file* write; Gate 5's definition is file-write-scoped by its Gate-3 framing (`AGENTS.md:122`), so the mapping is at best indirect. It is already double-carried: resident (`AGENTS.md:163`, "Name the rollback, stop for yes") plus the mechanical pre-push gate.
- **Negative:** `grep "read-only|read only" repo-rules/` returns zero. No rule file names the read-only turn; the read-side obligation set exists only in trigger phrasing. The corpus never states the division this question is about — only the resident layer and `retrieval-conventions.md:283` do.
- The corpus's own load doctrine sharpens the gap: `REPO RULES.md:12-13` — "Match on the action you are about to take"; "Load before the action. A rule read afterwards is a post-mortem." Six router rows (42 evidence, 43 delegation, 46 uncertainty, 47 communication, 48 presenting, 49 handoff) plus row 50's reporting half describe acts that are not file writes; for those rows, the router's own rule 2 is unsatisfiable through Gate 5.
## 2. CANDIDATES — three new constructions, one retest, and a policy test of the directive slot
## 3. SURFACE — the contract carries text; each prompt-time surface fails a different requirement
## 4. PORTABILITY — discovery is doubly proven; names are the part that is not frozen
## 5. VERDICT

### Iteration 8
## ITERATION 8 FINDINGS
### 1. INVENTORY — the read-side set, re-verified, plus the policy that classifies it
### 2. CANDIDATES — the three constructions still formally open, tested against the new policy sources
- **Trigger:** whichever rule-vocabulary predicate a builder picks; the slot fires on every prompt and the predicate only decides payload.
- **Silence:** inherits the lifecycle — full constant on the first proven message and after lifecycle boundaries, route-only otherwise, "any error also stays full" (`injection-contract.md:64`). Positional, never relevance; no rule-relevance predicate exists in the fleet (iterations 4–6). "Fires when relevant" cannot be written for corpus content.
- **Cost when it fires wrongly — now measured:** the pre-reduction constant payload was ~763 bytes / ~190 tokens, ~94.7% of the per-turn advisor payload, with a 10-turn session carrying ~9,600 bytes of repeated policy text (`specs/hooks/002-injection-bloat-reduction/spec.md:59`); the shipped program is "full policy once per session/lifecycle epoch, route-only deltas on repeats," targeting an ~82% cut (`:62`). A new constant partially reverses a measured, shipped reduction. Wrongly-fires case: every read-only turn of every session.
- **Bar side — retired, and now purpose-barred.** The slot's admission rule is verbatim: *"Every prompt carries the directive that has an enforcement mechanism, and nothing else"* (`specs/hooks/014-retire-governor-and-proof-directives/spec.md:77`; the survival test at `:71-73`). No corpus rule has an enforcer: the gate inventory is nine mechanical gates (`git/README.md:18` — comment hygiene, mirror-sync, mass-deletion, doc-model-refs, mirror-parity, prompt-card-sync, MCP mutation-class, compiled-routing re-mint, tool-ownership) and the one claim-shape checker is `[LOG]`-only "by explicit design" (`injection-contract.md:240-244`). Both bar prongs fail by construction of the corpus's own precedence: rule files are level 3 (`REPO RULES.md:24-32`).
- **Trigger:** judgment-question vocabulary (`delegation-and-orchestration.md:41`).
- **Silence:** "no judgment vocabulary in the prompt" — observable, but topic-absence, not failure-absence: it fires on the compliant judgment-discussion population and cannot see the solo-answer choice, which is made after the prompt event every predicate can read (iterations 5–6's proof, cited not restated; the clause's own conditional "from your own reading alone" has no prompt-time signature). The fleet's one backward predicate observes only a finished turn (`injection-contract.md:106-140`).
- **Cost when it fires wrongly:** re-asserts an epistemic stance on every design turn; carries level-3 content that cannot match the rule's force; and it would make the hook a second machine consumer of a corpus whose design statement is "nothing else reads it… no hook or workflow touches the router" (`check-repo-rules.cjs:5-9`).
- **Bar side — retired, and now procedure-routed.** It is Test-1 content ("must bind on a turn where nothing fires" — the read-only judgment turn), so the procedure's destination is `AGENTS.md` as a compressed row (`decision-tests.md:38-40`, `:131`). The candidate is answered before the bar is reached.
- **Trigger:** every prompt in a repo holding `REPO RULES.md`.
- **Silence:** none that is not cadence — constant delivery.
- **Cost when it fires wrongly:** surfaces a rule "as a context candidate" where no action is at hand — the failure pre-ruled in the retrieval-lane decision (`retrieval-conventions.md:283`, verified verbatim: "indexing them would surface a rule as a context candidate"); the parent's reading: "rule files are obligations, not context" (`iteration-010.md:83`).
- **Bar side — retired** (the constant shape). Its role is closure: trigger-loading misses read-side by construction (`AGENTS.md:122`); universal loading spams; and the middle — selective prompt injection — is closed by N1 (no admissible purpose) and N2 (no failure-observable predicate). **The design space is exhausted, not merely unmapped.**
### 3. SURFACE — carryable mechanically; three policy locks, one design lock
### 4. PORTABILITY — discovery proven twice; names unfrozen; the hook would re-implement, the resident remedy is path-free
### 5. VERDICT

### Iteration 9
## ITERATION 9 FINDINGS
### 1. INVENTORY — the read-side set holds; the corpus's own doctrine explains why it lives where it does
- `communication.md:37` (trigger block `:35-42`) — "About to write any substantive reply, an answer, an explanation, a close-out, a status."
- `evidence-and-proof.md:34-38` — "done"/"works" claims, reporting a result/path/output, acting on a tool's or sub-agent's success, write a completion summary, "close out a turn."
- `uncertainty-and-honesty.md:33-37` — not knowing, sources disagreeing, naming unverified things, operator disagreement, contradictions.
- `presenting-decisions.md:35-39` — recommendation/fork/trade-off, complex request, "start a multi-step stretch of work the reader will not see inside" (`:37`).
- `handoff-and-questions.md:35-39` — "end a turn, of any kind, substantive or not" (`:35`), along with asks and forks.
- `delegation-and-orchestration.md:37-41` — including `:41` "answer a judgment question … from your own reading alone."
- `root-cause-and-debugging.md:34-37` — "Anything fails" (`:34`); `skill-hub-routing.md:38-39` — reporting/quoting routing claims; `blast-radius.md:33-37` — mutations plus "any call that leaves this machine" (`:37`).
- `scope-discipline.md:35` (notice a defect — the read-only event is met by notice-and-name) and `prevent-overengineering.md:39` (thinking vocabulary; the failure is a subsequent write).
- **`decision-tests.md:32-41`** — Test 1: "A rule file loads on a trigger. Content that must bind when no trigger has fired cannot live in one." Ask: "on a turn where nothing fires, must this still hold?" → **Yes → it belongs in `AGENTS.md`. Refuse the rule.** The destination map at `:131` says `AGENTS.md`, as a compressed row. The corpus has a rehearsal for this class: `manual-testing-playbook/rule-decision/always-loaded-refusal.md:32` (refusal names Test 1 and the always-loaded destination).
- **`communication.md:40-42`** — the corpus's own account of read-side loading: "Its trigger is deliberately the broadest in the set: a rule about how replies read has to load whenever a reply is being written, or it silently stops applying to the short answers that need it most." Its companion at `decision-tests.md:48-51`: "A total move needs a total trigger, or the content goes quiet."
### 2. CANDIDATES — three constructions and one retest, each against the silence requirement
- *Trigger:* every prompt (the slot fires per prompt; no corpus-relevance predicate exists to shape payload).
- *Silence:* cadence only — full on first proven message and after lifecycle boundaries, route-only repeats; "any error also stays full" (`injection-contract.md:64`). No relevance silence.
- *Cost:* spends from a capped channel — `SYSTEM_SKILL_ADVISOR_MAX_TOKENS` default 80 and `MAX_BRIEF_CHARS` 2 KiB (`skill-advisor-hook.md:123`) — and the retirement record already answered the frequency question: "a disposition re-asserted every turn spends context on something that was never in dispute, and **a reader who ignores it once ignores it a hundred times**" (`specs/hooks/014-retire-governor-and-proof-directives/spec.md:67-69`). Throttling cannot fix relevance.
- *Bar side — retired.* Purpose rule: "Every prompt carries the directive that has an enforcement mechanism, and nothing else" (`014 spec:77`); the survivor is admissible only because "a pre-commit gate rejects a commit that violates it" (`:71-73`); the corpus is level 3 (`REPO RULES.md:24-32`) and gate-free (`git/README.md:18` gate list).
- *Trigger:* `session_start`/`SessionStart` — the one model-facing injection that fires on pure read-only sessions by construction (`injection-contract.md:212-218`; composer at `.opencode/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:129-136`, whose fallback text is what this session received).
- *Silence:* none by relevance. The only switches are the `session-lifecycle` kill-switch (`hooks/README.md:52`) and which cached payload applies; every session receives it.
- *Cost:* a per-session constant whose content is either resident restatement (same retired rationale, now with `:67-69`'s margin argument) or the level-3 delegation clause carried with no enforcer; additionally it would make `system-spec-kit` a corpus consumer against the stated architecture (`check-repo-rules.cjs:5-9`). The repo's own session-start advisory surface (worktree/git-hooks/dist-staleness/codex-hooks) is deliberately stderr-only, "never delivered to the assistant" (`injection-contract.md:252-256`) — the architecture has already decided what session-start adds to model context, and it is continuity, not rules.
- *Bar side — retired.* No gate leg; restatement.
- *Trigger:* carrier entry — dispatch of a scoped role.
- *Silence:* genuinely smart — the carrier's wake-domain is a subset of the payload's applicability domain (every orchestrate run is a delegation act), so the pointer is relevant by construction.
- *Cost when generalized:* to serve session-level read-side obligations, the generator must find, for each rule, a carrier whose domain implies applicability — no session-scoped carrier has that property (§2 N4), so the generalizing version collapses back into N1 on the same channel. The realized form also needs no hook: `agents/orchestrate.md:847` is author-maintained, and a hook-generated pointer would be a second loader the corpus checker cannot see (it walks only `ROUTER_FILE` + `RULES_DIR`, `check-repo-rules.cjs:42-52, 166-195`).
- *Bar side — the realized form clears it by being scope-contained; the automated session form is retired-side.*

### Iteration 10
## ITERATION 10 FINDINGS
### 1. INVENTORY — the read-side set holds under the violation-clock test; the carriers re-verified; one iteration-9 claim withdrawn
- `communication.md:37` → resident load-command `AGENTS.md:404` ("Load it before answering").
- `evidence-and-proof.md:34-38` → `AGENTS.md:239` ("These four bind unconditionally, including on a read-only turn where Gate 5 never fires and no rule file loads") plus table `:241-246`.
- `uncertainty-and-honesty.md:33-37` → `AGENTS.md:482-484` plus the §2 confidence table (`:92-97`).
- `presenting-decisions.md:35-39` → `AGENTS.md:406`, `:499`. `handoff-and-questions.md:35-39` → `:408`, `:500`.
- `root-cause-and-debugging.md:34-37` → `AGENTS.md:175` pointer, §3 debugging block `:190-192`. `skill-hub-routing.md:38-39` → `AGENTS.md:114`.
- Negative re-verified: `grep "read-only|read only" repo-rules/` returns zero matches. No rule file names the read-only turn.
- The sole uncovered obligation remains `delegation-and-orchestration.md:45-47` (self-lens), §6 at `:166-174`, with `AGENTS.md:418` and `:488` both bare expansion pointers.
### 2. CANDIDATES — two never-tested constructions, then the class-level closure
- *Trigger:* imperative request vocabulary naming a restrained action.
- *Silence:* no such vocabulary. Observable, and it is the only new trigger shape found since iteration 3.
- *Cost when wrong, and the new general property:* it fires on exactly the turns where a live operator instruction exists, and `REPO RULES.md:22-27` puts an in-the-moment instruction at level 2, above rule files at level 3. The injected text is content that cannot govern the turn it was injected for. This generalizes 3 §2C's and 2 §2A's self-authorization observations: for every action-requesting trigger, the fire moment and the override moment are the same moment.
- *Bar side:* retired. No gate leg, and the mechanically gated subset (push) was already refused as signal-disjoint with a complete block message (2 §2A). **Refuse.**
- *Trigger:* session state at prompt time (turn 1, no write, router present).
- *Silence:* first turn only.
- *Cost when wrong:* it fires on every session that opens with reading, which is this packet's own shape. Its payload is already resident: the Gate 5 block (`AGENTS.md:121-129`) and the read-side carriers (`:239`, `:404`) arrive in context by construction, from the same system that would deliver the injection. One-shot cadence inherits iteration 5's anti-correlation, absent on every later turn, present before any obligation attaches.
- *Bar side:* retired. Constant-shaped restatement, no gate. **Refuse.**
### 3. SURFACE — carryable mechanically; locks stand; one new cost axis
- Mechanical carriage is not the blocker: canonical owner and channel list (`injection-contract.md:65-66`), cadence machinery (`:64`).
- Locks re-verified: purpose rule (`014 spec:77`, "Every prompt carries the directive that has an enforcement mechanism, and nothing else"), failure-silence ban in that lane (`002 spec:75`) with fail-open toward full (`injection-contract.md:64`), and the corpus's single-consumer design statement (`check-repo-rules.cjs:5-9`).
- Budget context: `SYSTEM_SKILL_ADVISOR_MAX_TOKENS` default 80 and `MAX_BRIEF_CHARS` 2 KiB (`skill-advisor-hook.md:123`) against a pre-reduction constant measured at ~94.7% of payload (`002 spec:59`) and a shipped ~82% cut (`:62`).
- **New cost axis, never enumerated in iterations 1-9:** on Pi the prompt-time channel is the operator's own visible prompt (`[MSG]`, `injection-contract.md:39`, `:66`, `:268`), and the brief and Gate-3 question "chain additively, so both appear in the same visibly-modified prompt" (`:84`). A new corpus directive would be text the operator sees in their own mouth on every firing, so a wrong fire costs the human's trust directly, not only context. The incumbent pays this for a gate-backed prohibition. No corpus candidate justifies it.
### 4. PORTABILITY — the remedy now has current-state federation evidence, and both layers are heterogeneous
- Layout axis stays solved: discovery precedent (`check-repo-rules.cjs:42-52`, `skill-advisor-hook.md:36`), payload stays the corpus's own `repo-rules/<file>.md` convention.

