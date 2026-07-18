# Iteration 4: Confidence-First Architecture + Learned/Adaptive Routing

**Lineage:** glm-oob (cli-opencode / GLM-5.2)
**Iteration:** 4 of 5
**Agenda items:** #6 (every route carries calibrated confidence; below threshold, always defer with a
card) + #2 (weights update from observed corrections; deterministic-offline learned router).
**Divergence charter:** carry-forwards CF2 (advisor confidence under tier-split load) + iter 3 F5
(handoff as training signal). The lateral claim to stress: under confidence-first + learned
weights, `defaultMode` stops being a meaningful field — not by being set to null, but because the
**threshold** subsumes it.

## Focus

Combine two agenda items into one stress test:

1. **Confidence-first:** every routing decision carries a calibrated confidence; below a single
   fleet threshold, *always* defer with a card. No exceptions, no `defaultMode`. The field is
   replaced by one number.
2. **Learned/adaptive:** the vocabulary-to-mode assignment table is not static; it updates from
   observed corrections (handoffs from iter 3, re-prompts from iter 2). Deterministic-offline:
   weights refresh on a build, not in the live path.

The combined lateral claim: **the discrimination today lives in `classes`/`vocabularyClasses`,
not in `weight` (which is uniformly 4). A learned router does not learn weights (they were
vestigial); it learns the vocabulary-to-mode assignment itself.** So the design is much smaller
than "learn the weights" suggests — and `defaultMode` becomes a redundant knob once a threshold
exists.

## Findings

### F1. The advisor already emits confidence; it is just not authoritative.

`skill_advisor.py:2857-2858` rounds the routed confidence and writes it into the recommendation;
`skill_advisor.py:2810-2812` emits a `clarifying_question` when `max_score <
DEEP_ROUTING_CONFIDENCE_THRESHOLD (=0.65)`. So confidence exists, and a threshold exists, and a
defer-with-question behaviour exists. Confidence-first routing is **already shipped at Layer 0**
for one hub.

What is *not* shipped: the same pattern at Layer 1. Hub routers do not emit a confidence — they
emit a `{single, orderedBundle, defer}` outcome based on raw score deltas, not on calibrated
confidence. The agenda-#6 claim reduces to: **lift the Layer-0 confidence+threshold+defer pattern
to Layer 1, fleet-wide.** That is a small, sourced change, not a new architecture.

[SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2572,2810-2812,2857-2858]

### F2. Under confidence-first, `defaultMode` is subsumed by the threshold — but only if handoff exists.

Stress-test the agenda-#6 claim seriously. Two regimes:

- **Confidence-first WITHOUT handoff (today's path):** below threshold, defer with a card. This
  is run-2's null-with-compressed-card answer (`021/run2-archive/research.md` thread B). It
  *replaces* `defaultMode` with the threshold. So agenda #6 ≡ run-2's null verdict + a single
  fleet-wide threshold instead of per-hub policy. **Not genuinely lateral** — it is run-2
  re-derived from a different starting point.
- **Confidence-first WITH handoff (iter 3 added):** below threshold, defer with a card *or* pick
  the highest-confidence candidate and proceed knowing wrong picks are recoverable. Now the
  threshold does not *force* a defer; it selects between two recoverable strategies. `defaultMode`
  is genuinely meaningless here — there is no "fallback mode" because every mode is recoverable.

So the lateral claim only holds **conjointly with iter 3's typed handoff.** Confidence-first
alone collapses to run-2. Confidence-first + handoff is the new design space. This is a
cross-iteration dependency the divergence charter wanted surfaced: agenda #6 is not independently
radical; it is radical only as the second turn of a two-turn reframe.

[SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/run2-archive/research.md (thread B)]
[SOURCE: iterations/iteration-003.md#F1]

### F3. The learned router does not learn weights — it learns the vocabulary-to-mode assignment.

The key observation that iterations 1-3 kept re-discovering: `"weight": 4` is uniform across
every signal in every hub. Read every `hub-router.json` — the field is doing zero discrimination
work. All the discrimination lives in *which vocabulary entries exist for which mode*, i.e. the
`vocabularyClasses` block. So:

- "Learn the weights" is a non-starter — there is nothing to learn; the field is decorative.
- "Learn the vocabulary-to-mode assignment" is the real design: which token belongs to which
  mode, with what probability.

Concretely, today's table is `{ "interface-taste": ["interface-design", "make-it-look-good", …] }`
(human-authored, static). A learned table is `{ "interface-design": {interface: 0.91,
foundations: 0.06, audit: 0.03} }` (data-derived, refreshable). The training signal is exactly
iter 3's handoff records (mode A accepted a prompt containing token `T`, then handed off to mode
B ⇒ negative sample for (T, A), positive sample for (T, B)).

This is a genuinely smaller design than "learn the router": the router itself is unchanged
(vocabulary lookup → score → confidence → threshold → outcome). Only the *table* changes
provenance, from human-authored to data-derived. And the existing `vocabularyClasses` JSON is a
perfect cold-start prior.

[SOURCE: .opencode/skills/sk-design/hub-router.json:85-160 (vocabularyClasses doing all the work)]
[SOURCE: .opencode/skills/sk-doc/hub-router.json (weight=4 uniform across 12 signals)]

### F4. What breaks (four concrete costs, three of which are not present in static routing)

1. **Calibration drift.** A learned table drifts with the training distribution. If operators
   mostly route to `interface`, the table over-weights `interface` tokens for prompts that
   should hit `foundations`. Static routing is immune to this — its prejudices are fixed. The
   fix is regularisation toward the cold-start prior, plus a periodic re-anchoring pass.
2. **Handoff records become a security surface.** Once the table learns from handoffs, a
   malicious or buggy mode can emit handoffs to bias the table toward itself. Static routing is
   immune. The fix is per-source handoff weighting (operator handoffs weighted higher than
   mode-emitted handoffs) plus a sign-off step before table promotion.
3. **The cold-start prior IS the static table.** This is the good news: the existing
   `vocabularyClasses` JSON does not get deleted; it becomes the prior. New modes get the prior
   by default and graduate to learned weights only after enough traffic.
4. **Deterministic-offline is mandatory, not optional.** Live in-path weight updates would make
   routing non-reproducible — a death sentence for `router-replay.cjs` (cited in
   `021/run2-archive/research.md` thread A as the only executed evidence). So learning happens
   on a build, the table is committed, and the live path is read-only. This matches the
   charter's "deterministic-offline learned router" exactly.

[SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/run2-archive/research.md (thread A — router-replay)]

### F5. The reframe that survives stress: routing has three knobs, not two.

Run-1/run-2 framed the design space as `{defaultMode: X | null}` × `{card shapes}`. Iterations 1-4
collectively surface that the actual knob space is three-dimensional:

| Knob | Today's value | Lateral value |
|------|---------------|---------------|
| **Threshold** (`T`) | per-hub implicit | one fleet-wide `T` from advisor's 0.65 |
| **Recovery** (`R`) | none (re-prompt only) | typed handoff (iter 3 F1) |
| **Table provenance** (`P`) | human-authored, static | data-derived, offline-refreshed |

`defaultMode` is a special case of (`T`, `R`, `P`) = (low, none, static) — i.e. "always pick the
highest scorer, never recover, never learn." Run-2's null-with-card is (`T` high, `R` none, `P`
static). The genuinely lateral designs live off the static-`P` plane:

- (`T` high, `R` handoff, `P` static) — iter 3's NWD
- (`T` high, `R` handoff, `P` learned) — iter 4's confidence-first + learned
- (`T` low, `R` handoff, `P` learned) — "default aggressively, recover cheaply, improve from
  recoveries" — the combination none of the iterations has explicitly endorsed but which the
  three-knob space makes visible

This **(T, R, P)** decomposition is the iteration's load-bearing finding. It is genuinely lateral
because it makes the run-1/run-2 framing a 2-D slice of a 3-D space, and shows that the
"interesting" designs are off the static-P plane.

## Negative knowledge — what this iteration ruled out

- **Ruled out: confidence-first routing WITHOUT handoff.** Without recovery, the threshold just
  reproduces run-2's null-with-card verdict (F2). Agenda #6 is radical only as the second turn
  of a two-turn reframe that starts with agenda #4.
- **Ruled out: "learn the weights."** The `weight` field is uniformly 4 across the fleet; there
  is nothing to learn (F3). The real learning target is the vocabulary-to-mode assignment.
- **Ruled out: live in-path weight updates.** Breaks `router-replay` reproducibility, which is
  the only executed-evidence harness the fleet has (F4.4).

## Sources Consulted

- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2572,2810-2812,
  2857-2858,2865-2866` (confidence, threshold, clarifying_question — the Layer-0 pattern to lift).
- Every `hub-router.json` (`weight: 4` uniform — F3's load-bearing observation).
- `021/run2-archive/research.md` threads A (router-replay reproducibility), B (compressed card),
  and the bottom-line table.
- `iterations/iteration-001.md` (CF2, F4), `iterations/iteration-002.md` (F4, F5),
  `iterations/iteration-003.md` (F1, F5).

## Assessment

- **newInfoRatio:** 0.70 — the **(T, R, P)** decomposition (F5) and the "learn the assignment not
  the weights" reframe (F3) are net-new and load-bearing; F1 (advisor already has confidence) is
  sourced but confirmatory; F2 (collapse to run-2 without handoff) is a negative-knowledge finding.
- **novelty justification:** The (T, R, P) decomposition makes the run-1/run-2 framing a 2-D slice
  of a 3-D space; no prior packet has named this. The "weights were never the discrimination
  mechanism" observation recurs across iterations 1, 4, and 5 — its recurrence is itself evidence.
- **confidence:** high on F1, F3 (sourced); medium on F5 (decomposition is a design inference but
  it cleanly accommodates every prior iteration's findings, which is internal validation).
- **status:** `insight` — F5 is a conceptual breakthrough even though the iteration looks
  medium-novelty on raw evidence count.

## Reflection

- **What worked:** combining agenda #2 and #6. They are not independent — #6 needs #2's handoff
  substrate to be lateral rather than a re-derivation of run-2.
- **What failed:** initially trying to make "learn the weights" the headline. Reading the actual
  hub-router files killed that — weights are uniformly 4. The real design (learn the assignment)
  is smaller and more interesting.
- **Carries forward to iter 5:** the (T, R, P) decomposition is the natural input to "radical
  simplification" (agenda #7) and "contrarian frame-break" (agenda #8). If routing has three
  knobs, what is the *minimal* router? And is the defaultMode debate a symptom of a deeper smell
  — namely, that the router conflates three orthogonal concerns (threshold, recovery,
  provenance) in one field?

## Recommended Next Focus

**Iteration 5: Contrarian frame-break + radical simplification (agenda #7 + #8).**
The carry-forward is explicit: the (T, R, P) decomposition says routing has three orthogonal
knobs; today's `routerPolicy` conflates them in one bag. The contrarian frame: the defaultMode
debate is a *symptom* of that conflation — you cannot decide "should defaultMode be X or null"
because the question mixes a threshold question (how confident), a recovery question (what
happens if wrong), and a provenance question (who says). Radically simplify: a hub-router
becomes `(T, R, P)` triple plus a vocabulary table. No `defaultMode`, no `outcomes`, no
`bundleRules` (bundles move to R), no `defaultResource` (it is a function of P). Stress-test
what that minimal router costs and whether the canon survives.
