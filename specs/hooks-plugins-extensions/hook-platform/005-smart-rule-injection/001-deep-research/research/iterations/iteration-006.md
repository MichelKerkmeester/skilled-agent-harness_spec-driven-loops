{"timestamp":"2026-09-12T13:02:26.365Z","runtime":"claude","status":"fail_open","freshness":"unavailable","durationMs":88,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_EXIT_64"}
# ITERATION 6 FINDINGS

**Tested this pass (firsthand reads new to this lineage):** the parent round's refusal record (`rules-round2/iteration-010.md`) — iterations 1–5 spoke of the refusals only second-hand; the production directive-lifecycle as a carrier; the backward-composition channel the goal hook actually runs; the corpus's new CI loadability gate.

## 1. INVENTORY — read-only bindings, re-verified, plus what the parent round already settled

Read-side obligations and their carriers, verified this pass:

| Obligation (trigger cited) | Carrier that already binds |
|---|---|
| `delegation-and-orchestration.md:41` — "About to answer a judgment question … from your own reading alone"; clause `:47` — "no single model's verdict, the delegate's or your own, closes a question" | **None.** Firsthand grep of AGENTS.md for the clause's signature phrases: no matches. `AGENTS.md:418` is a bare pointer; `:488` routes the CLI mechanics only. Thin spot stands. |
| `evidence-and-proof.md:34-38` (REPO RULES.md row `:42`) | `AGENTS.md:239` — "bind unconditionally, including on a read-only turn where Gate 5 never fires" + table `:241-246` |
| `communication.md:37` (row `:47`) | `AGENTS.md:404` — "fires on every substantive reply … Load it before answering" + `:410` |
| `presenting-decisions.md:35-39` (row `:48`) → `AGENTS.md:406`; `handoff-and-questions.md:35-39` (row `:49`) → `AGENTS.md:408`, `:500` | resident |
| `uncertainty-and-honesty.md:33-37` (row `:46`) | `AGENTS.md:482-484` + §2 table |
| `skill-hub-routing.md:38-39` (row `:50`) | `AGENTS.md:114` |
| rows `:41`, `:44`, `:45`, `:40` (scope, blast, root-cause, overengineering) | read-event triggers; the failing act is a write — no injection value |

**Correction the parent round supplies, read firsthand:** its two refusals were *not* decided by the read-only fact. P2 (context-gathering) was decided by the scope test — selection is Out (`rules-round2/iteration-010.md:24`); read-only is cited additionally (`:26`). P3 (design-loading) was decided by routing/scope tests *and* read-only (`:40`). The "injection vs Gate 5" question was never the decider for the refused rules — and `:83` already names the repo's read-side answer: "the two mechanisms that do bind across read-only turns — the four unconditional verification standards (`AGENTS.md:239-246`) and §8's load instruction (`:404-410`)"; "rule files are obligations, not context."

**New mechanical fact:** the corpus's stated failure mode now has an automated guard — `.github/workflows/repo-rules-corpus.yml:25` "keeps the repo-rules corpus loadable so drift cannot leave a rule silently unloaded", fail-closed (`:26-30`), keyed on `repo-rules/**` and the router (`:5-8`).

## 2. CANDIDATES

**C1 — ride the production directive-lifecycle (zero-new-mechanism version).**
- **Trigger:** every user prompt; payload appended to the advisor brief, which fires per prompt (`injection-contract.md:48`).
- **Silence:** exact and observable — the delivery-state machine: constant directive full on "the first proven message and after lifecycle boundaries", route-only otherwise, "any error also stays full" (`:64`; `skill-advisor-hook.md:40`, `:137`). But it is **positional**, not relevance: anchored to message position and lifecycle events.
- **Cost when wrong:** (i) full delivery lands on the session's first message, before any turn where a corpus rule binds; (ii) on later binding turns the same cadence suppresses it — iteration 5's anti-correlation, now mechanized and with its anchoring named; (iii) the fail direction is *toward spam*: any state/helper error "stays full" (`:64`), i.e. yields the every-turn constant the operator forbids; (iv) the surviving hygiene directive has a gate (pre-commit) **and** a second detector (post-edit-quality, `:191-204`); a corpus constant has no equivalent leg.
- **Bar side — retired.** It is the retired every-turn shape on a cadence, restating level-3 content (`REPO RULES.md:26`) with no enforcing gate.

**C2 — completion-sentinel feedback at the next prompt (the back-loop; never tested by iterations 1–5).**
- **Mechanism precedent, proven:** the goal hook reads *backward composition* — `turn_end` flattens the ending message + tool results into evidence (`pi/goal-context.ts:149`), a fail-closed heuristic verifier runs over it (`goal-core.cjs:591-619`, evidence "never trusted" `:361`), the verdict is carried as `last_check: <verdict> ; reason: <reason>` (`goal-core.cjs:542`) and injected on subsequent turns (`injection-contract.md:132`). Iteration 5's "no predicate reads the model's … composition" holds **forward only**; the backward direction is production.
- **Trigger:** a new completion-sentinel finding since the last prompt.
- **Silence:** no new finding — precise, observable. But it observes the *previous* turn.
- **Cost when wrong:** the failing turn is already over (the operator read the claim); a heuristic false positive (`unclear`/`not-met`) steers the next, possibly unrelated turn; it upgrades a log the repo explicitly keeps advisory into model-visible direction — "Advisory only for the entire v1 rollout, never `{decision:"block"}`" (`injection-contract.md:242`) — without that decision being made.
- **Bar side — retired.** No gate enforces completion evidence (the sentinel exists *because* nothing blocks); the four standards already bind resident (`AGENTS.md:239`). Unlike the goal block — operator-created state, display, consented lifecycle — this is corpus advice with no consent and a heuristic "verifier".

**C3 — entity-resolution silence for rule content.** Trigger: prompt names a corpus file/rule → inject pointer. Silence: no name (`injection-contract.md:100`, the sk-vision class). **Cost/self-defeat:** sk-vision's justification is inaccessibility (a text-only model cannot read the image, `:88`); a plain file the session *can* read does not qualify — the injection duplicates the lookup it triggers. **Bar side — retired** (no recorded failure; no gate).

## 3. SURFACE

The contract can carry content (channels `:66`, kill-switches `:20`) — not the blocker. Three refinements this iteration contributes:
- The lifecycle is a **delivery-economy device**, orthogonal to relevance by construction (`:64`); reusing it inherits positional silence.
- The back-loop needs **no new mechanism class** — C2's surface leg passes on the goal precedent. Its refusal is bar-side, not surface-side. This is the strongest form the question has taken so far.
- For *rule content specifically*, an injection becomes a second loader the corpus gate cannot see. `repo-rules-corpus.yml:25` exists to prevent "a rule silently unloaded"; a hook carrying `repo-rules/<file>.md` names outside the checker's walk would reopen that class — the pointer replaces "unloaded" with "unresolved", and nothing validates the hook against the corpus.

## 4. PORTABILITY

- **C1:** maximal — the advisor runs on all six runtimes, resolves install-anchored (`skill-advisor-hook.md:36`); no layout dependency. Refused on the bar, not on layout.
- **C2:** producer is a Stop-side event and the fleet documents Cursor's stop never fires (`injection-contract.md:138`), with sentinel artifacts already runtime-specific (`:242`) — a back-loop would be live in some runtimes, dead in others. The CI guard is per-repo; a shared hook has no cross-repo equivalent.
- **C3:** pointer form ports; moot.

## 5. VERDICT

**Refuse the injection; leave the corpus at Gate 5; change the rule for the one gap.**
- No candidate clears the bar: C1 and C2 land on the retired side, and C2 — the only one whose surface leg passes — fails on the same leg the hygiene survivor passes (gate-enforced prohibition, `injection-contract.md:54`) with none present.
- The delegation clause (`delegation-and-orchestration.md:47`) remains the sole uncovered read-side obligation; the remedy stays promotion into the resident layer (iterations 4–5), now corroborated by the parent round's own conclusion (`iteration-010.md:83`) and the documented mechanism (`REPO RULES.md:80-83`). The operator's decision is the carrier: §9's pointer region (`AGENTS.md:418`) or the four-standards table (`:241-246`).
- The hard constraint answered: no candidate offers a relevance-keyed silence observable at prompt time for rule obligations. The two silences rule content admits — delivery position (C1) and prompt vocabulary/entity (C3) — are respectively anti-correlated and self-defeating; C2's precise silence is real but backward-looking and bar-failing.

Nothing blocks on further research; the refusal is recorded with its tests.
