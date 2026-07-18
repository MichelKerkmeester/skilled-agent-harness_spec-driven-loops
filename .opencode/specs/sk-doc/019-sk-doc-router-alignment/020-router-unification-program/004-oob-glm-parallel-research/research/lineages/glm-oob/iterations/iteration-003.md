# Iteration 3: No-Wrong-Door / Handoff Routing + Routing as Dialogue

**Lineage:** glm-oob (cli-opencode / GLM-5.2)
**Iteration:** 3 of 5
**Agenda items:** #4 (any mode accepts then hands off; routing becomes recoverable) + #5 (zero-signal
case as one-turn typed negotiation, not a silent default).
**Divergence charter:** carry-forwards CF1 (is deferral the right primitive, or is handoff?) and
CF3 (handoff is a typed closed-loop signal, strictly more informative than re-prompt). The lateral
claim: routing stops being "pick the right mode upfront" and becomes "any mode accepts, then types
the transfer." Stress-test whether the keep-vs-null distinction dissolves, and whether handoff
supplies the closed-loop signal iteration 2's feedback channel needs.

## Focus

Two agenda items compose into one stress test:

1. **No-wrong-door (NWD):** any mode in a hub can accept any request routed to the hub. If the
   accepting mode decides it is the wrong home, it emits a typed `handoff` record, and the hub
   re-routes (or asks). There is no upfront default; routing is **recoverable**.
2. **Routing as dialogue (RaD):** the zero-signal case is not a silent default (`defaultMode: X`)
   and not an open-ended clarification (`clarifying_question`). It is a **one-turn typed
   negotiation**: the hub presents a small fixed card of candidate modes; the operator's reply
   is a typed selection; the hub routes.

The combined lateral claim: **`defaultMode` becomes meaningless not because it is set to `null`
but because the *category* of "default" stops existing.** Every entry is recoverable, so a wrong
entry costs a handoff, not a mis-route.

## Findings

### F1. The current router has no handoff vocabulary — adding it is the load-bearing change.

Reading every `hub-router.json` in the fleet confirms: the routing decision is a one-shot
`{single, orderedBundle, defer}` outcome (`sk-doc/hub-router.json:8-14`,
`sk-design/hub-router.json:8-14`). Once the router emits `single: create-skill`, there is no
field that says "create-skill accepted, then transferred to create-quality-control." The only
way the system knows a misroute happened today is the operator re-prompting — which is the
untyped, noisy signal iteration 2 (F4) flagged as the degenerate feedback channel.

A typed handoff needs at minimum:

- `routeId` (so the handoff links back to the original routing decision)
- `fromMode` (the mode that accepted)
- `toMode` (the mode the from-mode believes is the right home)
- `reason` (a fixed enum: `wrong-scope | missing-capability | better-fit | operator-redirect`)
- `evidence` (the triggering observation, e.g. "prompt mentioned `validate` which is not in my
  resource surface")

That is a new contract surface, but it is small: one record type, one enum, one foreign key.
And it is exactly the typed closed-loop signal CF3 named.

[SOURCE: .opencode/skills/sk-doc/hub-router.json:8-14]
[SOURCE: .opencode/skills/sk-design/hub-router.json:8-14]
[SOURCE: iterations/iteration-002.md#F4 (feedback channel)]

### F2. Under NWD + typed handoff, the keep-vs-null distinction dissolves — but not in the way
run-1/run-2 expected.

Run-1/run-2 framed the choice as: `defaultMode: X` (commit to a possibly-wrong mode) vs
`defaultMode: null` (defer to a card). Under NWD:

- "Default to X" stops being a *commitment*; it becomes a *bet*. If the bet is wrong, the mode
  accepts and immediately hands off. The cost of a wrong default is one typed transfer, not a
  silent misroute.
- "Defer with a card" (run-2's compressed card) stops being the *only* safe option; it becomes
  the option you take when the *first* handoff also fails. The card is the **second** turn of
  the dialogue, not the first.

So run-2's null-with-compressed-card answer is **one slice of the NWD design space**, not its
replacement. The NWD reframe says: keep the default if you want (low cost if wrong), but
guarantee recovery via handoff. The keep-vs-null question stops being a moral judgment
("presumption vs defer") and becomes a **cost question** ("is one extra handoff cheaper than one
extra clarification turn?").

This is a genuine reframe of run-2's verdict, not a relabelling: run-2 said "flip four, keep one
because the cost of one wrong default justifies it." NWD says "the cost of a wrong default is no
longer a misroute, it is a handoff — so recompute the inequality." The inequality may flip back,
but the *terms* changed.

[SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/run2-archive/research.md (bottom-line table)]

### F3. What breaks under NWD (four concrete costs)

1. **Every mode needs a "wrong door" entry protocol.** Today a mode's `SKILL.md` assumes the
   router picked it correctly. Under NWD, every mode needs a "should I be here?" check at the
   top of its workflow. That is real new code in every mode — not free.
2. **Handoff can loop.** Mode A → B → A → B indefinitely. NWD needs a `handoffCount` on the
   `routeId` and a hard cap (e.g. 2 transfers) before falling back to a card. Without the cap,
   routing becomes non-terminating.
3. **Token cost of a wrong door is paid by the operator.** Today a misroute costs the operator
   one re-prompt; under NWD it costs one mode-entry + one handoff + one re-route + the second
   mode's entry. If most defaults are *right* (run-2's "dominant case" assumption), NWD is a
   wash on correct routes and strictly worse on the wrong ones that *would* have been caught by
   defer-with-card. So NWD's net depends on the **base rate of correct defaults**, which is
   exactly the unmeasured quantity run-2 flagged (thread D).
4. **Handoff changes the mode contract surface.** Today a mode's contract is "given a prompt,
   produce an artefact." Under NWD it is "given a prompt, EITHER produce an artefact OR emit a
   typed handoff." That is a new return type. The canon (`skill_smart_router.md`,
   `skill_md_template.md`) does not have a slot for it; adding it touches every mode template.

[SOURCE: .opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md]
[SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/run2-archive/research.md (thread D — unmeasured base rate)]

### F4. Routing as dialogue (RaD) gives the zero-signal case a shape that is neither silent nor open-ended.

Today's zero-signal outcomes are:
- **Silent default** (`defaultMode: X`) — run-2's "presumption" critique.
- **Open-ended clarification** (`clarifying_question`) — the advisor's behaviour below
  `DEEP_ROUTING_CONFIDENCE_THRESHOLD` (`skill_advisor.py:2810-2812`). Open-ended = high operator
  effort.

RaD proposes a **third** shape: on zero-signal, the hub emits a one-turn card with N≤3 candidate
modes, each with a single discriminating phrase ("interface → if you want it to *look custom*";
"foundations → if you want the *color/type system*"; "audit → if you want to *score what exists*").
The operator's reply is the typed selection. This is structurally the "compressed card" run-2
proposed (terra-max iter 1, glm-max iter 3 in `021/run2-archive/research.md` thread B), **except**
run-2's card was the *fallback* path under null; RaD's card is the *default* zero-signal outcome
regardless of `defaultMode`, because under NWD a wrong pick costs only one handoff.

The genuine novelty vs run-2: RaD + NWD **makes the card cheap to skip**. If the operator does
not reply to the card, the hub picks the highest-confidence candidate and proceeds — knowing
that a wrong pick is recoverable. Run-2's card was a *commitment gate* (no pick without a reply);
RaD's card is a *non-blocking suggestion*.

[SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2810-2812]
[SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/run2-archive/research.md (thread B)]

### F5. The unexpected convergence with iteration 2's feedback channel.

Iteration 2's F4 said the minimum feedback signal is "operator re-prompted within 30 seconds."
Iteration 3's F1 says handoff is a typed signal strictly more informative than re-prompt. Put
together: **handoff is the typed substrate that turns the degenerate re-prompt signal into a
first-class closed-loop channel.** The two iterations independently arrived at the same primitive
(handoff / typed transfer) from different angles — exactly the kind of cross-iteration
convergence the divergence charter is meant to surface. This is the strongest signal so far that
"closed-loop routing with typed handoff" is the genuinely lateral idea this lineage was meant to
find, and that iterations 1 (tier-split) and 5 (radical simplification) should be re-read with
that primitive in mind.

## Negative knowledge — what this iteration ruled out

- **Ruled out: "any mode can accept any request" without a typed handoff vocabulary.** Without
  the typed record, NWD collapses to today's re-prompt signal — no recovery benefit, only added
  mode-entry cost. The typed handoff is the load-bearing piece.
- **Ruled out: NWD as a *replacement* for `defaultMode: null`.** NWD sits orthogonal to
  keep-vs-null; both "default: X, recoverable" and "default: null, card-first" are valid under
  NWD. The choice between them is a cost inequality (F2), not a moral judgment.
- **Ruled out: open-ended `clarifying_question` as the zero-signal outcome.** RaD's typed card
  dominates it whenever N≤3 candidates can be named. Open-ended survives only for the "no
  candidates at all" case, which today is rare.

## Sources Consulted

- `.opencode/skills/sk-doc/hub-router.json` and `.opencode/skills/sk-design/hub-router.json`
  (the `{single, orderedBundle, defer}` outcome vocabulary — no handoff field).
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2810-2812`
  (`clarifying_question` below `DEEP_ROUTING_CONFIDENCE_THRESHOLD`).
- `021/run2-archive/research.md` threads B (compressed card), D (unmeasured base rate), and the
  bottom-line keep/flip table.
- `iterations/iteration-001.md` (CF1) and `iterations/iteration-002.md` (F4, CF3).

## Assessment

- **newInfoRatio:** 0.90 — the convergence with iter 2 (F5) and the "card is non-blocking under
  NWD" reframe (F4) are net-new; F2 (inequality recompute) is a sharpening of run-2 rather than
  pure novelty, hence not 1.0.
- **novelty justification:** The two genuinely new pieces are (a) the typed-handoff contract
  surface (F1, with five required fields) and (b) the convergence with iter-2 F4 (F5). Both are
  absent from `021/run2-archive/research.md` and from prior iterations of this lineage.
- **confidence:** high on F1 (sourced; contract is concrete); medium on F5 (cross-iteration
  convergence is a strong signal but the destination design is still unmeasured).
- **status:** `complete` — five sourced findings plus one cross-iteration convergence.

## Reflection

- **What worked:** treating agenda #4 and #5 as a single iteration. They are not independent —
  RaD's typed card only becomes cheap-to-skip once NWD's handoff exists. Splitting them would
  have produced two half-findings.
- **What failed:** trying to declare NWD a *replacement* for the run-2 answer. It is not; it is
  orthogonal and re-weights the inequality (F2).
- **Carries forward to iter 4:** F5 names handoff as the typed substrate for closed-loop
  routing. Iteration 4 (confidence-first + learned/adaptive) should treat handoff records as
  the *training signal* for a learned router — exactly what a static vocabulary table cannot
  consume.

## Recommended Next Focus

**Iteration 4: Confidence-first architecture + learned/adaptive routing (agenda #2 + #6).**
Carry-forward CF2 (advisor confidence under tier-split load) + F5 (handoff as training signal).
Stress-test: if every route carries calibrated confidence and the table is learned from handoff
records, does `defaultMode` still be a meaningful field? The lateral claim: today's `weight: 4`
uniform across every signal is not just vestigial (iteration 1's observation) — it is *evidence
that the weights were never the discrimination mechanism*. The whole discrimination lives in
`classes`/`vocabularyClasses`. So the learned router does not learn weights (they were never
doing anything); it learns the **vocabulary-to-mode assignment itself**.
