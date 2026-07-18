---
title: "OOB GLM Parallel Lineage — Radical Lateral Rethinks of Parent-Hub Routing"
description: "A 5-iteration GLM-5.2 lateral-research lineage run concurrently with the SOL-ultra sibling to diversify the idea space over the 8-item out-of-box agenda in 023-oob-glm-parallel/spec.md. stopPolicy=max-iterations (non-converge, lateral). Finds: typed-handoff primitive (closed-loop routing), (T,R,P) decomposition of routing knob space, and the contrarian claim that defaultMode was a documented bug compensating for the missing recovery primitive. Run-1/run-2's keep-1/flip-4 verdict subsumes cleanly as corners of the (T,R,P) space."
lineage: glm-oob
session_id: fanout-glm-oob-1784347200936-r7aos1
executor: cli-opencode (zai-coding-plan/glm-5.2)
sibling_lineage: sol-ultra
parent_packet: 023-oob-glm-parallel
combined_synthesis_target: 021-default-mode-policy-research
trigger_phrases:
  - "glm oob lateral routing lineage"
  - "typed handoff routing primitive"
  - "T R P routing decomposition"
  - "defaultMode was a documented bug"
  - "minimal hub router"
importance_tier: important
contextType: research
---

# OOB GLM Parallel Lineage — Radical Lateral Rethinks of Parent-Hub Routing

> **Provenance (honest, up front).** This lineage is a 5-iteration, non-converge, lateral-research
> pass over the 8-item agenda in `023-oob-glm-parallel/spec.md`, run by GLM-5.2 via cli-opencode
> concurrently with a SOL-ultra sibling lineage. **Convergence is telemetry only**
> (`stopPolicy: max-iterations`, `convergenceMode: off`); the lineage was explicitly chartered to
> *diverge* from the established run-1/run-2 answer in `021/run2-archive/research.md`, not to
> re-derive it. All findings are reading + design inference; **no live router commands were
> executed** in this lineage (the SOL-ultra sibling and run-2 terra-max did the executed-router
> work). Citations point at `hub-router.json` files, `skill_advisor.py`, the canon templates, and
> the run-1/run-2 synthesis — all line-cited internally. The lineage's job is to contribute an
> **axis system** the existing verdict lives in, not a competing verdict.

---

## Bottom line — what this lineage contributes to the combined-`021` synthesis

Three load-bearing ideas, two of which survived cross-iteration pressure inside this lineage and
await SOL-ultra cross-lineage confirmation:

1. **The typed-handoff primitive** (iterations 2, 3, 4) — the genuine lateral transfer from the
   load-balancer / DNS-TTL analogies, *smaller than either analogy suggested*: emit a
   five-field `handoff` record (`routeId, fromMode, toMode, reason, evidence`) when an accepting
   mode discovers it is the wrong home. This turns routing from open-loop (emit-and-forget) into
   closed-loop, and is the typed substrate that turns the degenerate "operator re-prompted within
   30 seconds" signal into a first-class feedback channel.
2. **The (T, R, P) decomposition of routing knob space** (iteration 4) — routing has three
   orthogonal knobs: **T**hreshold, **R**ecovery, **P**rovenance. Today's `defaultMode` is one
   corner of this 3-D space, not a binary. The whole run-1/run-2 keep/flip debate was implicitly
   choosing (T, R, P) corners but labelling them as `defaultMode` values — which is why the
   debate could not terminate.
3. **The contrarian claim: `defaultMode` was a documented bug, not a knob** (iteration 5) — you
   only need a "default" when wrong picks are unrecoverable; once typed handoff exists, the field
   has no work to do. So the run-1/run-2 debate was *a debate about how to compensate for a
   missing primitive, framed as a debate about which compensation value is correct*. The reframe:
   add the missing primitive, observe that the field is empty, delete it.

Subsumption: run-2's "null + compressed card" is the **(T high, R card, P static)** corner of the
minimal router. Run-2's "detection-defaulted cli" is the **(T low, R handoff, P static)** corner
with the runtime-detection block as a fourth table. Run-2 got the right corners for the wrong
reasons; (T, R, P) gives the right reasons.

---

## Method

**Setup.** A 5-iteration GLM-5.2 lateral lineage in
`.opencode/specs/sk-doc/019-sk-doc-router-alignment/023-oob-glm-parallel/research/lineages/glm-oob/`,
chartered to diverge from the run-1/run-2 keep-1/flip-4 verdict in
`021/run2-archive/research.md`. Each iteration proposes one genuinely out-of-the-box idea and
stress-tests it (what breaks, what improves, second-order effects). Convergence is telemetry only
— the loop runs all 5 iterations unconditionally and broadens angles when an iteration reports
low novelty, instead of synthesizing early.

**Iteration map (covers all 8 agenda items):**

| iter | agenda | lateral claim | outcome |
|------|--------|---------------|---------|
| 1 | #1 (abolish hub-router) | Abolition is a tier-split (cold advisor + hot advisor-loaded vocab), not a deletion | Reframe |
| 2 | #3 (cross-domain analogies) | Genuine transfer is the feedback channel (closed-loop), smaller than health-check | Insight |
| 3 | #4+#5 (no-wrong-door + dialogue) | Typed handoff dissolves keep-vs-null into a cost inequality | Complete + cross-iter convergence |
| 4 | #2+#6 (learned + confidence-first) | (T,R,P) decomposition; learn vocab-to-mode assignment, not weights | Insight |
| 5 | #7+#8 (simplification + frame-break) | `defaultMode` was a documented bug compensating for missing recovery primitive | Insight (load-bearing) |

**Evidence source.** All citations are live repo paths (verified at iteration time, line numbers
in each iteration file). No live router commands were executed; the falsifiable-experiment design
work in run-2 (sol-ultra) and the executed router-replay in run-2 (terra-max) carry the
runtime-evidence weight. This lineage's contribution is structural / design inference over
sourced files.

---

## Section 1 — Iteration 1: Abolish the Hub-Router Layer

**Agenda #1.** Take the one shipped precedent
(`skill_advisor.py:_apply_deep_skill_routing_layer` already pre-resolves `(skill, mode)` for
system-deep-loop, `skill_advisor.py:2815-2866`) to its extreme: delete Layer-1 routing entirely.

### Reframe that survived

Abolition is **not** "remove `hub-router.json`"; it is a **tier-split along the time axis**:
- **Cold tier (metadata-only):** advisor decides `(skill)` from skill descriptions alone.
- **Hot tier (vocabulary-loaded):** advisor (or a thin per-skill shim) decides `(mode)` inside
  the chosen skill's vocabulary.

The deep-routing layer is the one place today where the hot tier runs *inside* the advisor. The
honest abolitionist design moves the hot tier into the advisor for every skill — but that is the
centralisation cost F2 names. So abolition does not eliminate two-layer routing; it **makes the
advisor do both layers**, and the hubs become "vocabulary packs" the advisor loads.

### What breaks (four second-order costs run-1/run-2 did not name)

1. **Vocabulary centralisation kills the per-skill authoring boundary.** `sk-design/hub-router.json`
   vocabulary (`interface-taste`, `motion-feel`, `audit-transform-question`, …) is owned by the
   design authors today. Under abolition, all of it moves into `skill_advisor.py`.
2. **Advisor becomes Layer-0+1 coupled**, losing cold-start isolation. Every advisor call has to
   load every hub's vocabulary + resource-list.
3. **Single-shot property forces eager resource selection.** Either you load all candidate
   resources eagerly, or the advisor must run a shadow router internally to pick them.
4. **`bundleRules` lose their encoding home.** The two shipped bundle rules (sk-doc, sk-design)
   are hub-level ordered-bundle outcomes; abolition forces the advisor to emit list-of-modes,
   changing its contract surface.

### What improves

The keep-vs-null debate disappears at the root — there is no hub fallback branch to keep or null.
Vocabulary drift becomes detectable at one file. The advisor's existing `clarifying_question`
infrastructure becomes the single disambiguation surface.

→ See `iterations/iteration-001.md` for full F1–F4 with citations.

---

## Section 2 — Iteration 2: Cross-Domain Analogies & the Feedback Channel

**Agenda #3.** Survey OS scheduler, IP router, DNS resolver, load balancer, receptionist for what
each transfers *beyond* what routing already has.

### Load-bearing finding: four-of-five analogies collapse; one transfers something new

- **OS scheduler → priority + preemption.** Priority = today's `weight`. Pre-emption is
  incoherent for a stateless one-shot routing decision. Aging collapses to learned weights
  (iteration 4's territory).
- **IP router → longest-prefix match.** Today's `vocabularyClasses` already is this implicitly.
- **DNS resolver → hierarchical cache + TTL.** Hierarchy is the advisor↔hub split. The new piece
  is **TTL**: vocabulary entries that expire if not refreshed. Structurally identical to the
  load-balancer health check reached via a different analogy.
- **Load balancer → weighted round-robin + health checks.** Weighted round-robin is today's
  static-weight router. The new piece is the **health check**: each backend has a runtime score,
  and routing weight adapts.
- **Receptionist → ask, don't guess.** Already shipped as `defer`; triage protocol is
  `bundleRules`.

So the only primitive routing lacks is **runtime feedback** — the load-balancer's health check,
equivalently DNS's TTL. Reaching it via two independent analogies is mild cross-domain
convergence.

### The lateral claim (F2) and why the literal transfer fails (F3)

F2: every `(skill, mode)` carries a `health` record; effective weight = `staticWeight ×
healthMultiplier`. Modes below a `healthFloor` are drained.

F3 kills the literal transfer with four structural costs the load-balancer literature does not
flag because backends there do not argue back:
1. **Modes are not stateless backends.** Health is `(mode, prompt-class)`, not `mode` — state
   space explodes from N modes to N×P.
2. **Defining "success" requires a grader** (LLM-as-judge or proxy) — expensive, itself unreliable.
3. **Cold-start is poisoned** — new modes have no history and skill modes don't get continuous
   traffic.
4. **Health feedback invites Goodhart's law** — mode authors game the score (decline hard prompts).

### The genuine transfer is smaller than the analogy (F4)

The productive part is not the score; it is the **existence of a feedback channel**. Today the
router is open-loop. Even a degenerate signal — "operator re-prompted within 30 seconds, yes/no"
— gives the system its first closed-loop data point. That data point requires no grader, no
cold-start handling, no health table. It just requires the router to emit a `routeId` and the
runtime to record whether the next operator turn re-entered the router.

**This is the bridge to iteration 3** (handoff is the *typed* version of this signal) and
**iteration 4** (closed-loop routing is the *training signal* a learned router needs).

### Implication for run-1/run-2

Run-1/run-2 assumed an open-loop router — every recommendation is a configuration change. A
closed-loop router changes the *kind* of recommendation possible: instead of "what should the
default be," the question becomes "what default minimises re-prompt rate." That is exactly the
measurable, falsifiable question run-2 thread D said was missing.

→ See `iterations/iteration-002.md` for full F1–F5 with citations.

---

## Section 3 — Iteration 3: No-Wrong-Door / Handoff + Routing as Dialogue

**Agenda #4 + #5.** Carry-forwards CF1 (is deferral the right primitive, or is handoff?) and CF3
(handoff is a typed closed-loop signal, strictly more informative than re-prompt).

### The typed handoff contract (F1, load-bearing)

Today's router emits a one-shot `{single, orderedBundle, defer}` outcome
(`sk-doc/hub-router.json:8-14`, `sk-design/hub-router.json:8-14`); there is no field that says
"create-skill accepted, then transferred to create-quality-control." Typed handoff needs:

- `routeId` (foreign key back to the original routing decision)
- `fromMode`, `toMode`
- `reason` (fixed enum: `wrong-scope | missing-capability | better-fit | operator-redirect`)
- `evidence` (the triggering observation)

One record type, one enum, one foreign key. Small contract surface, exactly the typed closed-loop
signal iter 2 F4 named.

### The reframe (F2): keep-vs-null dissolves into a cost inequality, not a moral judgment

Under NWD with typed handoff:
- **"Default to X" stops being a commitment; it becomes a bet.** If wrong, the mode accepts and
  immediately hands off. Cost of a wrong default = one typed transfer, not a silent misroute.
- **"Defer with a card" stops being the only safe option.** It becomes the option you take when
  the *first* handoff also fails. The card is the **second** turn of the dialogue.

So run-2's null-with-compressed-card is *one slice* of the NWD design space, not its replacement.
The keep-vs-null question stops being a moral judgment ("presumption vs defer") and becomes a
**cost question**: "is one extra handoff cheaper than one extra clarification turn?"

This is a genuine reframe, not a relabelling: run-2 said "flip four, keep one because the cost of
one wrong default justifies it." NWD says "the cost of a wrong default is no longer a misroute, it
is a handoff — so recompute the inequality." The inequality may flip back, but the *terms* changed.

### What breaks (F3)

1. **Every mode needs a "wrong door" entry protocol** — real new code in every mode.
2. **Handoff can loop** — needs `handoffCount` on `routeId` and a hard cap (e.g. 2 transfers)
   before card fallback.
3. **Token cost of a wrong door** is paid by the operator: today a misroute costs one re-prompt;
   under NWD it costs mode-entry + handoff + re-route + second-mode-entry. Net depends on the
   **base rate of correct defaults** — exactly the unmeasured quantity run-2 flagged (thread D).
4. **Mode contract surface changes** — every mode goes from "produce an artefact" to "produce an
   artefact OR emit a typed handoff." Canon templates need a new slot.

### Routing as dialogue (F4): the card becomes non-blocking

Run-2's compressed card was a *commitment gate* (no pick without a reply). RaD's card is a
*non-blocking suggestion*: if the operator does not reply, the hub picks the highest-confidence
candidate and proceeds, knowing wrong picks are recoverable via handoff. This is the genuine
novelty vs run-2: NWD + RaD makes the card cheap to skip.

### Cross-iteration convergence (F5, load-bearing)

Iter 2 F4 said the minimum feedback signal is "operator re-prompted within 30 seconds." Iter 3 F1
says handoff is a typed signal strictly more informative than re-prompt. Combined: **handoff is
the typed substrate that turns the degenerate re-prompt signal into a first-class closed-loop
channel.** Two iterations independently arrived at the same primitive from different angles —
strongest signal so far that "closed-loop routing with typed handoff" is the genuinely lateral
idea this lineage was meant to find.

→ See `iterations/iteration-003.md` for full F1–F5 with citations.

---

## Section 4 — Iteration 4: Confidence-First + Learned/Adaptive Routing

**Agenda #2 + #6.** Carry-forwards CF2 (advisor confidence under tier-split load) + iter 3 F5
(handoff as training signal).

### The advisor already has confidence; it is just not authoritative (F1)

`skill_advisor.py:2857-2858` rounds routed confidence into the recommendation;
`skill_advisor.py:2810-2812` emits `clarifying_question` when `max_score <
DEEP_ROUTING_CONFIDENCE_THRESHOLD (=0.65)`. Confidence + threshold + defer-with-question already
exist at Layer 0 for one hub. **Confidence-first routing is already shipped at Layer 0; what is
not shipped is lifting the pattern to Layer 1 fleet-wide.** That is a small, sourced change, not
a new architecture.

### The two-turn dependency (F2): agenda #6 is radical only with handoff

- **Confidence-first WITHOUT handoff** ≡ run-2's null-with-compressed-card (thread B). Replaces
  `defaultMode` with the threshold. *Not genuinely lateral* — run-2 re-derived from a different
  starting point.
- **Confidence-first WITH handoff** (iter 3 added) → threshold does not *force* a defer; it
  selects between two recoverable strategies. `defaultMode` is genuinely meaningless here.

So agenda #6 is **radical only as the second turn of a two-turn reframe** that starts with
agenda #4. This is the cross-iteration dependency the divergence charter wanted surfaced.

### The learned router does not learn weights — it learns the vocabulary-to-mode assignment (F3, load-bearing)

Reading every `hub-router.json` confirms: `"weight": 4` is uniform across every signal in every
hub. The field is doing zero discrimination work. All discrimination lives in
`vocabularyClasses`. So:
- "Learn the weights" is a non-starter — nothing to learn.
- "Learn the vocabulary-to-mode assignment" is the real design.

Today's table is human-authored static: `{ "interface-taste": ["interface-design",
"make-it-look-good", …] }`. A learned table is data-derived: `{ "interface-design": {interface:
0.91, foundations: 0.06, audit: 0.03} }`. The training signal is iter 3's handoff records (mode
A accepted a prompt containing token `T`, then handed off to mode B ⇒ negative sample for `(T,A)`,
positive sample for `(T,B)`).

This is a genuinely smaller design than "learn the router": the router itself is unchanged
(vocabulary lookup → score → confidence → threshold → outcome). Only the table changes
provenance. The existing `vocabularyClasses` JSON is a perfect cold-start prior.

### What breaks (F4)

1. **Calibration drift** — learned table drifts with training distribution; mitigated by
   regularisation toward the cold-start prior + periodic re-anchoring.
2. **Handoff records become a security surface** — a malicious/buggy mode can emit handoffs to
   bias the table. Mitigated by per-source weighting (operator > mode) + sign-off before promotion.
3. **The cold-start prior IS the static table** — good news; the existing JSON does not get
   deleted, it becomes the prior.
4. **Deterministic-offline is mandatory** — live in-path updates break `router-replay`
   reproducibility (`021/run2-archive/research.md` thread A). Learning happens on a build; the
   table is committed; the live path is read-only. Matches the charter verbatim.

### The (T, R, P) decomposition (F5, load-bearing)

Run-1/run-2 framed the design space as `{defaultMode: X | null}` × `{card shapes}`. Iterations
1-4 collectively surface that the actual knob space is three-dimensional:

| Knob | Today's value | Lateral value |
|------|---------------|---------------|
| **Threshold** (`T`) | per-hub implicit | one fleet-wide `T` from advisor's 0.65 |
| **Recovery** (`R`) | none (re-prompt only) | typed handoff (iter 3 F1) |
| **Table provenance** (`P`) | human-authored, static | data-derived, offline-refreshed |

`defaultMode` is a special case of `(T, R, P) = (low, none, static)` — "always pick the highest
scorer, never recover, never learn." Run-2's null-with-card is `(T high, R none, P static)`. The
genuinely lateral designs live off the static-`P` plane, and the most aggressive one — `(T low, R
handoff, P learned)` — is "default aggressively, recover cheaply, improve from recoveries." That
combination is **unreachable** through `defaultMode` alone.

→ See `iterations/iteration-004.md` for full F1–F5 with citations.

---

## Section 5 — Iteration 5: Contrarian Frame-Break + Radical Simplification

**Agenda #7 + #8.** Carry-forward: iter 4's (T, R, P) decomposition says routing has three
orthogonal knobs; today's `routerPolicy` conflates them. Name the smell, then radically simplify.

### The smell named (F1): routerPolicy fields conflate three orthogonal concerns

Reading every `routerPolicy` block (sk-doc, sk-design, cli-external-orchestration,
system-deep-loop, mcp-tooling, sk-prompt, sk-code) against (T, R, P):

- `defaultMode` is a **(T, R) joint**: setting it to X says "T is low" AND "R is none." Setting
  it to null says "T is high" AND "R is the card." The field *cannot* say "low T, high R" — that
  corner is unreachable through `defaultMode` alone.
- `defaultResource` is a **P** concern leaking into a field named for routing.
- `bundleRules` is an **R** concern leaking into policy.
- `outcomes` is a presentational enum that *describes* what happened; not a knob; belongs in the
  routing result, not policy.
- `tieBreak` is a **P** concern (provenance of the tiebreaker) leaking into policy.
- `ambiguityDelta` is a **T** concern leaking into policy.

**The smell is field-level conflation.** Each `routerPolicy` field mixes concerns from different
axes. The run-1/run-2 debate could not terminate because every "keep vs flip" argument was
implicitly choosing a (T, R, P) corner but labelling it as a `defaultMode` value.

### The minimal router (F2, load-bearing)

```json
{
  "skill": "sk-design",
  "threshold": 0.65,           // T — fleet-wide default overridable per hub
  "recovery": "handoff",       // R — enum {none | handoff | card | orderedBundle}
  "provenance": "static",      // P — enum {static | learned | prior}
  "vocabulary": {              // the only large data
    "interface": ["interface-design", "make-it-look-good", …],
    "foundations": ["color system", "oklch palette", …]
  }
}
```

Deleted or relocated from today's `routerPolicy`:
- `defaultMode` — **deleted**; (T, R) picks the behaviour.
- `defaultResource` — **deleted as policy**; it is a function of (R, P).
- `bundleRules` — **relocated to R** as `orderedBundle` (a bundle is a recovery behaviour, not a
  routing policy). The two shipped bundle rules (sk-doc, sk-design) survive as `R: orderedBundle`.
- `outcomes` — **relocated to the routing result type**.
- `tieBreak` — **deleted**; under `R: handoff`, ties are recovered from, not broken.
- `ambiguityDelta` — **folded into T**.

A 24-line `routerPolicy` block collapses to a 3-field config plus the vocabulary table. The canon
(`skill_smart_router.md`) shrinks correspondingly: the four-pattern router template stays
(discovery, guard, load, fallback); the *policy* surface becomes a triple.

### What it buys (F3)

1. **The defaultMode debate becomes a non-question** — the field does not exist; the three axes
   are independently measurable (T via precision/recall, R via handoff-rate, P via drift-over-time).
   Run-2's "directional-pending-measurement" downgrade becomes *measurable per axis*.
2. **New hubs cannot get the policy wrong** — authors pick three enum/number values from a
   documented table; the corner is explicit, not inherited by accident from a neighbour.
3. **The canon becomes testable** — a `create-skill` benchmark can assert "every hub's
   routerPolicy is a valid (T, R, P) triple plus a vocabulary table."

### What breaks (F4)

1. **Migration is non-mechanical.** Every `routerPolicy` re-expressed as (T, R, P); run-2 thread
   C's one-hub-at-a-time ordered migration with rollback applies. No automatic codemod because
   `defaultMode: X` is ambiguous between `(T low, R none)` and `(T low, R handoff)`.
2. **`bundleRules` relocation is the hardest part** — adds a fourth value to R (`orderedBundle`).
3. **The vocabulary table becomes load-bearing** — today it is one input among many; under the
   minimal router it is the only routing data. Mitigated by P=learned.
4. **Canon rewrite touches every skill** — `skill_smart_router.md` is the copy-paste template;
   rewriting it changes what every new skill inherits. Feature and cost.

### The contrarian claim (F5, load-bearing)

**`defaultMode` was never a design knob — it was a documented bug compensating for the absence of
typed recovery.** You only need a "default" when wrong picks are unrecoverable; once handoff
exists, the field has no work to do. So the entire run-1/run-2 keep/flip debate was *a debate
about how to compensate for a missing primitive, framed as a debate about which compensation value
is correct.*

The reframe: add the missing primitive (typed handoff), observe that the field is now empty,
delete it. The minimal router (F2) is what the system looks like after the field is deleted.

This **subsumes run-2's verdict rather than contradicting it**: run-2's "null + compressed card"
is the (T high, R card, P static) corner; run-2's "detection-defaulted cli" is the (T low, R
handoff, P static) corner with the runtime-detection block as a fourth table. Run-2 got the right
corners for the wrong reasons; (T, R, P) gives the right reasons.

→ See `iterations/iteration-005.md` for full F1–F5 with citations.

---

## Section 6 — Cross-Iteration Convergence Map

Two load-bearing claims recur across multiple iterations; everything else hangs off them.

### Convergence A: typed handoff is the missing primitive

| Iteration | Where handoff surfaces | Role |
|-----------|------------------------|------|
| 1 (CF1) | Deferral is a clarifying-question not a handoff — seeds the question | problem |
| 2 (F4) | Feedback channel = "did operator re-prompt" — degenerate handoff | signal |
| 3 (F1) | Typed handoff contract (5 fields) — first-class closed-loop | primitive |
| 3 (F5) | Handoff is the typed substrate turning re-prompt into closed-loop | convergence |
| 4 (F2) | Confidence-first is radical only WITH handoff | dependency |
| 4 (F3) | Handoff records are the training signal for a learned router | input |
| 5 (F5) | `defaultMode` was a bug compensating for the missing recovery primitive | diagnosis |

Three independent observations (iters 2/3/4) reached the reducer's promotion threshold
(`idea-closed-loop-router`, observationCount=3).

### Convergence B: the (T, R, P) decomposition

| Iteration | Where it surfaces | Role |
|-----------|-------------------|------|
| 1 (F4) | Tier-split = (cold advisor for skill, hot advisor-loaded vocab for mode) — early T/P separation | seed |
| 4 (F5) | Explicit (T, R, P) decomposition; `defaultMode` is one corner | claim |
| 5 (F1) | Per-field conflation inventory across all 7 hubs | evidence |
| 5 (F2) | Minimal router = (T, R, P) + vocabulary table | application |
| 5 (F5) | The debate was a symptom of the conflation | diagnosis |

---

## Section 7 — Implications for the Combined-`021` Synthesis

### 7.1 What this lineage does NOT claim

- It does **not** overturn run-1/run-2's keep-1/flip-4 direction. The four corners the verdict
  lives in survive; (T, R, P) just gives them sharper reasons.
- It does **not** claim typed handoff or (T, R, P) is *correct* — both are design inferences from
  a single model (GLM-5.2). Cross-lineage confirmation from the SOL-ultra sibling is required
  before they feed the combined synthesis as load-bearing.
- It does **not** propose an implementation order. (Implementation is `022`; CF5 names the order
  *if* the design is adopted: R first, then T, then P.)

### 7.2 What this lineage DOES contribute

1. **An axis system** (`T, R, P`) the existing verdict lives in. Without this, the keep/flip
   debate will recur for every new hub because the field's conflation smell persists.
2. **A primitive the existing router lacks** (typed handoff). Without this, closed-loop learning
   (P=learned) has no training signal and "is the default correct" stays unfalsifiable (run-2
   thread D).
3. **A diagnosis of why the debate was interminable** — the field conflates three orthogonal
   concerns. This is process debt: every future routing question will repeat the same argument
   shape until the field is split.
4. **Two measurable claims that survive cross-lineage scrutiny regardless of model agreement:**
   - `weight: 4` is uniform across the fleet (sourced; not model-dependent). Weights are
     vestigial; the discrimination lives in `vocabularyClasses`.
   - `_apply_deep_skill_routing_layer` is the one shipped precedent for advisor-side mode
     pre-resolution (sourced; not model-dependent).

### 7.3 What the combined-`021` synthesis should do with this

- Treat the (T, R, P) decomposition as a **proposed axis system**, not a verdict. If SOL-ultra
  independently arrives at typed-handoff or (T, R, P), promote both to load-bearing. If SOL-ultra
  contradicts either, treat this lineage's claims as one-model design inference and ablate.
- Treat the typed-handoff primitive as a **candidate addition** to the canon, separable from the
  (T, R, P) decomposition. The primitive survives even if the decomposition does not — handoff is
  useful under any field schema.
- Treat the "defaultMode was a documented bug" contrarian claim as the **frame-break** the
  combined synthesis owes its readers: even if the field is kept, the diagnosis explains *why* the
  debate felt interminable and *why* every new hub re-derives a corner instead of inheriting one.

---

## Section 8 — Eliminated Alternatives (primary negative-knowledge output)

Consolidated from each iteration's `ruledOut` and `## Negative Knowledge` sections. Treat as
primary research output, not appendix.

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Set every `defaultMode` to null as abolition | Run-1/run-2 answer wearing a wig; abolition only counts if 4 other routerPolicy fields also deleted | `iterations/iteration-001.md#negative-knowledge` | 1 |
| Generalise `_apply_deep_skill_routing_layer` verbatim | Lexical regex works for deep-loops only; per-hub regex per domain is distributed monolith in another shape | `iterations/iteration-001.md#negative-knowledge` | 1 |
| OS scheduler priority/preemption as routing primitive | Priority = today's weight; pre-emption incoherent for one-shot routing; aging collapses to learned weights | `iterations/iteration-002.md#negative-knowledge` | 2 |
| IP longest-prefix match as routing primitive | `vocabularyClasses` already is this | `iterations/iteration-002.md#negative-knowledge` | 2 |
| Receptionist "ask, don't guess" as routing primitive | Already shipped as `defer`; triage protocol is `bundleRules` | `iterations/iteration-002.md#negative-knowledge` | 2 |
| Full health-score routing as immediate destination | Four structural costs (state-space explosion, grader cost, cold-start, Goodhart) make it multi-release | `iterations/iteration-002.md#negative-knowledge` | 2 |
| Any-mode-accepts without typed handoff vocabulary | Without typed record, NWD collapses to today's re-prompt signal; no recovery benefit | `iterations/iteration-003.md#negative-knowledge` | 3 |
| NWD as replacement for `defaultMode: null` | NWD is orthogonal; both `default:X-recoverable` and `default:null-card-first` valid; choice is cost inequality | `iterations/iteration-003.md#negative-knowledge` | 3 |
| Open-ended `clarifying_question` as zero-signal outcome | RaD typed card dominates it whenever N≤3 candidates; open-ended survives only for no-candidates case | `iterations/iteration-003.md#negative-knowledge` | 3 |
| Confidence-first routing without handoff | Collapses to run-2 null-with-card; agenda #6 radical only as second turn of two-turn reframe | `iterations/iteration-004.md#negative-knowledge` | 4 |
| "Learn the weights" | `weight: 4` uniform fleet-wide; nothing to learn; real target is vocab-to-mode assignment | `iterations/iteration-004.md#negative-knowledge` | 4 |
| Live in-path weight updates | Breaks `router-replay` reproducibility, the only executed-evidence harness | `iterations/iteration-004.md#negative-knowledge` | 4 |
| Keep `defaultMode` as field alongside (T,R,P) | Worst of both worlds; conflation smell persists; deletion is load-bearing | `iterations/iteration-005.md#negative-knowledge` | 5 |
| Mechanical codemod for (T,R,P) migration | `defaultMode:X` ambiguous between (T low, R none) and (T low, R handoff); only human classification per hub resolves it | `iterations/iteration-005.md#negative-knowledge` | 5 |
| Shrink the vocabulary table too | Vocabulary IS the router's discrimination (iter 4 F3); simplification target is policy fields, not data | `iterations/iteration-005.md#negative-knowledge` | 5 |

---

## Section 9 — Recommendations

Ordered by blast-radius, lowest first.

1. **Sourced, model-independent observations to fold into the combined-`021` synthesis now:**
   - `weight: 4` is uniform across every hub; the field is vestigial; discrimination lives in
     `vocabularyClasses`. The learned router's target is the vocab-to-mode assignment, not weights.
   - `_apply_deep_skill_routing_layer` is the one shipped advisor-side mode pre-resolution
     precedent. It is regex-gated, non-generalizable; but it proves the pattern ships.
2. **Frame-break to surface in the combined synthesis** (zero implementation cost, high
   explanatory value): name the (T, R, P) decomposition as the axis system the keep/flip verdict
   lives in. Readers get a vocabulary for *why* the debate was interminable, even if the field is
   not deleted.
3. **Candidate primitive for separate evaluation** (implementation in `022`, not here): typed
   handoff. The five-field contract is small; it survives independently of the (T, R, P)
   decomposition; and it is the load-bearing input to any future closed-loop / learned routing.
4. **Long-horizon design candidate** (multi-release, not now): minimal router = `(T, R, P) +
   vocabulary table`. Requires handoff first (R ≠ none), then fleet-wide T, then learned P. CF5
   names the order; run-2 thread C names the per-hub migration discipline.
5. **What NOT to do:** do not keep `defaultMode` as a field while adding (T, R, P) alongside —
   the conflation smell persists and the new knobs inherit undocumented corners. If the
   decomposition is adopted, the deletion is load-bearing.

---

## Section 10 — Open Questions (for the combined-`021` synthesis)

1. **Does the SOL-ultra sibling lineage independently arrive at typed-handoff or (T, R, P)?**
   If yes → cross-lineage convergence, promote both to load-bearing. If no → keep as one-model
   design inference, ablate before adoption.
2. **Base rate of correct defaults.** Run-2 thread D named this as the missing measurement. This
   lineage adds: under NWD with handoff, the base rate becomes *measurable* from handoff
   records. So the measurement question and the primitive question are coupled.
3. **Mode contract surface change.** Adding typed handoff as a return type touches every mode's
   `SKILL.md`. What is the fleet-wide cost of the canon rewrite?
4. **Security surface of learned routing.** If handoff records drive a learned table, what is the
   review/sign-off workflow before table promotion? (Per-source weighting is the proposal; needs
   adversarial review.)
5. **cli-external-orchestration under (T, R, P).** Run-2 said cli should be "detection-defaulted"
   via a runtime-detection block. Under (T, R, P), is the detection block a fourth axis, or is it
   a `(P)` variant (`P: detected`)?

---

## Section 11 — References

- **Iteration narratives:** `iterations/iteration-001.md` through `iterations/iteration-005.md`
  (this lineage).
- **State log:** `deep-research-state.jsonl` (config + 5 iteration records + maxIterationsReached event).
- **Per-iteration deltas:** `deltas/iter-001.jsonl` through `deltas/iter-005.jsonl`.
- **Strategy:** `deep-research-strategy.md` (final state).
- **Dashboard:** `deep-research-dashboard.md` (auto-generated, 5 iterations).
- **Registry:** `findings-registry.json`.
- **Sibling lineage (SOL-ultra):** `../sol-ultra/` (for cross-lineage convergence check).
- **Established answer (do not re-derive):**
  `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/run2-archive/research.md`.
- **Source files cited (verified at iteration time):**
  - `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:709,2572,2810-2812,2815-2866,4009`
  - `.opencode/skills/sk-doc/hub-router.json` (full file)
  - `.opencode/skills/sk-design/hub-router.json` (full file)
  - `.opencode/skills/cli-external-orchestration/hub-router.json` (full file)
  - `.opencode/skills/system-deep-loop/hub-router.json` (full file)
  - `.opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md` (canon)
  - `.opencode/specs/sk-doc/019-sk-doc-router-alignment/023-oob-glm-parallel/spec.md` (agenda)

---

## Provenance and confidence

- **Confidence:** high on sourced observations (uniform `weight: 4`; `_apply_deep_skill_routing_layer`
  precedent; advisor confidence+threshold+clarifying_question shipped). Medium on design inferences
  ((T, R, P) decomposition; minimal router shape; typed-handoff contract details). The
  contrarian claim ("defaultMode was a bug") is defensible from iter 1-5 evidence but rests on
  the typed-handoff primitive being adopted — a contingent claim.
- **Single-lineage caveat:** every lateral claim in this report comes from one model
  (GLM-5.2). Cross-lineage confirmation from SOL-ultra is required before adoption.
- **Honest ceiling:** this lineage executed no live router commands. Its contribution is
  structural / design inference over sourced files. Runtime-evidence weight lives in run-2
  sol-ultra / terra-max and any future live-executor benchmark this report's Section 7.3
  recommends.
