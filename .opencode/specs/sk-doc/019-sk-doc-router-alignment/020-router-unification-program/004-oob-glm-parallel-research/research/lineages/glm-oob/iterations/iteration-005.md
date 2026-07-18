# Iteration 5: Contrarian Frame-Break + Radical Simplification

**Lineage:** glm-oob (cli-opencode / GLM-5.2)
**Iteration:** 5 of 5 (final)
**Agenda items:** #7 (is the INTENT_SIGNALS + RESOURCE_MAP two-layer scheme necessary, or an
accident?) + #8 (the whole defaultMode debate is a symptom of a deeper design smell; name it and
the reframe).
**Divergence charter:** carry-forward from iter 4 — the (T, R, P) decomposition says routing has
three orthogonal knobs; today's `routerPolicy` conflates them. The contrarian frame: the
defaultMode debate is a *symptom* of that conflation. Name the deeper smell, then radically
simplify.

## Focus

Two agenda items compose into one stress test:

1. **Contrarian frame-break:** name the deeper design smell that makes the defaultMode debate
   interminable. Iterations 1-4 surface the candidate: router fields today conflate *threshold*,
   *recovery*, and *provenance* concerns. The debate is interminable because each participant is
   answering a different one of the three.
2. **Radical simplification:** given the smell, what is the *minimal* router? A hub-router
   becomes a `(T, R, P)` triple plus a vocabulary table. No `defaultMode`, no `outcomes`, no
   `bundleRules`, no `defaultResource` (each is relocated or deleted). Stress-test what that
   minimal router costs and whether the canon survives.

The combined lateral claim: **`defaultMode` is not a knob, it is a triangle-corner — the
configuration (T low, R none, P static). The debate is interminable because participants argue
different corners. Killing the field and naming the triple dissolves the debate.**

## Findings

### F1. Naming the smell: router-policy fields today conflate three orthogonal concerns.

Reading every `routerPolicy` block in the fleet (`sk-doc`, `sk-design`, `cli-external-orchestration`,
`system-deep-loop`, `mcp-tooling`, `sk-prompt`, `sk-code`) against iter 4's (T, R, P) decomposition:

- `defaultMode` is a **(T, R)** joint: setting it to X says "threshold is low (just pick X)"
  AND "recovery is none (no handoff expected)." Setting it to null says "threshold is high"
  AND "recovery is the card." The field cannot say "low threshold, high recovery" — i.e.
  "default aggressively, recover cheaply." That corner of the space (iter 4 F5's unnamed fourth
  combination) is **unreachable** through `defaultMode` alone.
- `defaultResource` is a **P** concern (where the fallback vocab comes from) leaking into a
  field named for routing.
- `bundleRules` is an **R** concern (what to do when two modes legitimately co-fire) leaking
  into a field named for routing.
- `outcomes` is a presentational enum (`single | orderedBundle | defer`) that *describes* what
  happened, not a knob. It does not belong in policy; it belongs in the routing *result*.
- `tieBreak` is a P concern (provenance of the tiebreaker) leaking into policy.
- `ambiguityDelta` is a T concern (how close the scores before we declare ambiguity) leaking
  into policy.

So **the smell is field-level conflation.** Each `routerPolicy` field mixes concerns from
different axes, which is why the run-1/run-2 debate could not terminate: every "keep vs flip"
argument was implicitly choosing a (T, R, P) corner but labelling it as a `defaultMode` value.
The honest reframe is: `defaultMode` is not a knob, it is a corner.

[SOURCE: .opencode/skills/sk-doc/hub-router.json:3-24 (routerPolicy block)]
[SOURCE: .opencode/skills/sk-design/hub-router.json:3-24]
[SOURCE: .opencode/skills/cli-external-orchestration/hub-router.json:3-15]
[SOURCE: iterations/iteration-004.md#F5 (T,R,P)]

### F2. The minimal router: `(T, R, P)` + a vocabulary table.

Take the simplification seriously. A hub-router becomes:

```json
{
  "skill": "sk-design",
  "threshold": 0.65,           // T — one number, fleet-wide default overridable per hub
  "recovery": "handoff",       // R — enum {none | handoff | card}; default "handoff"
  "provenance": "static",      // P — enum {static | learned | prior}; default "static"
  "vocabulary": {              // the only large data; everything else is config
    "interface": ["interface-design", "make-it-look-good", …],
    "foundations": ["color system", "oklch palette", …],
    …
  }
}
```

What got deleted or relocated:

- `defaultMode` — **deleted**. The (T, R) combination picks the behaviour. "Default to X" =
  (T low, R handoff); the highest scorer wins and recovers if wrong. "Defer with card" =
  (T high, R card). "Defer silent" = (T high, R none) — rare.
- `defaultResource` — **deleted as policy**. It becomes a function of (R, P): the card is the
  rendered vocabulary subset under R=card; the scored resource is the learned table under
  P=learned.
- `bundleRules` — **relocated to R**. A bundle rule is "when these modes co-fire, do this
  ordered thing" — that is a recovery behaviour, not a routing policy.
- `outcomes` — **relocated to the routing result type**. It describes what happened, not what
  to do.
- `tieBreak` — **deleted as policy**. Under R=handoff, ties are recovered from, not broken.
- `ambiguityDelta` — **folded into T**. The threshold already encodes "how close is ambiguous."

So a 24-line `routerPolicy` block collapses to a 3-field config plus the vocabulary. The canon
(in `skill_smart_router.md`) shrinks correspondingly: the four-pattern router template stays
(discovery, guard, load, fallback), but the *policy* surface is a triple, not a struct.

### F3. What this minimal router buys (three concrete wins)

1. **The defaultMode debate becomes a non-question.** You cannot argue "should defaultMode be X
   or null" because `defaultMode` does not exist. You can only argue "what (T, R, P) triple
   should this hub use" — and the triple's three axes are independently measurable (T via
   precision/recall, R via handoff-rate, P via drift-over-time). Run-2's "directional-pending-
   measurement" verdict becomes *measurable per axis* instead of per hub.
2. **New hubs cannot get the policy wrong.** Today a new hub author copies a neighbour's
   `routerPolicy` (run-2's "ad-hoc" observation) and inherits whatever (T, R, P) corner the
   neighbour was implicitly in. Under the triple, the author picks three enum/number values
   from a documented table; the corner is explicit, not inherited by accident.
3. **The canon becomes testable.** A `create-skill` benchmark can assert "every hub's routerPolicy
   is a valid (T, R, P) triple plus a vocabulary table." Today's equivalent assertion would have
   to enumerate every field combination — which is why no such benchmark exists.

[SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/run2-archive/research.md (run-2's "directional-pending-measurement" downgrade)]
[SOURCE: .opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md (canon)]

### F4. What breaks (four concrete costs, two of which are about migration)

1. **Migration is non-mechanical.** Every existing `routerPolicy` block has to be re-expressed
   as a (T, R, P) triple. Run-2 (thread C, terra-max iter 3) already showed one-hub-at-a-time
   ordered migration with rollback; that contract applies. But there is no automatic codemod,
   because `defaultMode: X` could be (T low, R none, P static) OR (T low, R handoff, P static)
   depending on whether the hub *also* has handoff — which none do today. So the migration
   defaults to (R=none) for everyone, then upgrades hub-by-hub.
2. **`bundleRules` relocation is the hardest part.** The two shipped bundle rules (sk-doc
   "create-skill + create-quality-control", sk-design "interface + foundations") are *legitimate
   ordered bundles* — they say "do these in order, do not pick one." Under R=handoff, two
   co-firing modes would mean "do one, then hand off." Bundles are different: they are "do both,
   in order." So R needs a fourth value: `orderedBundle`. The enum grows from {none, handoff,
   card} to {none, handoff, card, orderedBundle}. Still small.
3. **The vocabulary table becomes load-bearing.** Today `vocabularyClasses` is one input among
   many; under the minimal router it is the *only* routing data. Errors in it become more
   costly. The mitigation is exactly iter 4's P=learned: the table is refreshable, not frozen.
4. **The canon rewrite touches every skill.** `skill_smart_router.md` is the copy-paste template
   every new skill uses. Rewriting it changes what every new skill inherits. This is a feature
   (F3.2) and a cost (one-shot fleet-wide rewrite).

[SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/run2-archive/research.md (thread C — terra-max one-hub-at-a-time migration)]
[SOURCE: .opencode/skills/sk-doc/hub-router.json:18-24]
[SOURCE: .opencode/skills/sk-design/hub-router.json:17-23]

### F5. The genuine contrarian finding: **`defaultMode` was never a design knob — it was a
documented bug.**

The strongest frame-break the iteration can defend: the field `defaultMode` is not a policy
choice that has a correct answer per hub. It is a *compensation* for the absence of typed
recovery. You only need a "default" when wrong picks are unrecoverable; once handoff exists, the
field has no work to do. So the entire run-1/run-2 keep/flip debate was **a debate about how to
compensate for a missing primitive (typed handoff), framed as a debate about which compensation
value is correct.**

This is the contrarian answer to agenda #8: the defaultMode debate is a symptom of a deeper
smell (no recovery primitive → need a default → argue about the default). The reframe is:
add the missing primitive, observe that the field is now empty, delete it. The minimal router
(F2) is what the system looks like after the field is deleted.

This subsumes run-2's verdict rather than contradicting it: run-2's "null + compressed card" is
the (T high, R card, P static) corner of the minimal router; run-2's "detection-defaulted cli"
is the (T low, R handoff, P static) corner with the runtime-detection block as a fourth table.
Run-2 got the right corners for the wrong reasons; the (T, R, P) decomposition gives the right
reasons.

## Negative knowledge — what this iteration ruled out

- **Ruled out: keeping `defaultMode` as a field while adding (T, R, P) alongside.** That is the
  worst of both worlds — the conflation smell persists, and the new knobs inherit the
  undocumented corners. The deletion is load-bearing.
- **Ruled out: mechanical codemod for the migration.** `defaultMode: X` is ambiguous between
  (T low, R none) and (T low, R handoff) today; only human classification per hub resolves it.
  Run-2's thread C already named this for a different reason.
- **Ruled out: shrinking the vocabulary table too.** The vocabulary *is* the router's
  discrimination (iter 4 F3). Shrinking it would lose information; the simplification target is
  the policy fields, not the data.

## Sources Consulted

- Every `routerPolicy` block in the fleet (seven hub-router.json files).
- `021/run2-archive/research.md` threads B (compressed card), C (migration), D (measurement gap),
  and the bottom-line keep/flip table.
- `iterations/iteration-004.md#F5` ((T, R, P) decomposition).
- `iterations/iteration-003.md#F1` (typed handoff — the missing primitive this iteration names).
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md` (the canon that gets
  rewritten).

## Assessment

- **newInfoRatio:** 0.60 — the (T, R, P) decomposition is iter 4's; this iteration *applies* it
  to delete `defaultMode` and name the smell (F5). F1 (field conflation inventory) and F2 (the
  minimal router) are net-new and load-bearing. F5 is a reframe, not new evidence. Lower ratio
  than prior iterations by design — the lineage is converging on its synthesis, even though
  stopPolicy=max-iterations forbids early synthesis.
- **novelty justification:** F5 ("defaultMode was a documented bug, not a knob") is the
  load-bearing contrarian claim; F1 (per-field conflation inventory across seven hubs) is the
  sourced evidence for it. Together they are net-new vs every prior packet.
- **confidence:** high on F1 (sourced inventory); high on F5 (defensible from iter 1-4 evidence);
  medium on F2 (minimal-router shape is a design inference).
- **status:** `insight` — the lineage's load-bearing contrarian claim lives here.

## Reflection

- **What worked:** letting iter 4's (T, R, P) decomposition do the work. The contrarian claim
  (F5) is just "apply the decomposition to the field that conflates the axes." The simplification
  (F2) falls out for free.
- **What failed:** initially trying to invent a *fourth* axis. The decomposition is three —
  adding a fourth (e.g. "verbosity") was scope creep and did not survive stress.
- **Net for the synthesis:** the lineage's lateral contribution is the **typed-handoff primitive
  + (T, R, P) decomposition + the field-conflation diagnosis.** Run-2's verdict subsumes cleanly
  into the (T, R, P) space; the keep-1/flip-4 corners survive but for sharper reasons. The
  combined-`021` synthesis should treat this lineage's contribution as the *axis system* the
  verdict lives in, not as a competing verdict.

## Recommended Next Focus

No next iteration — this is iteration 5 of 5 (max-iterations reached). Proceed to synthesis.
