# Iteration 1: Abolish the Hub-Router Layer Entirely

**Lineage:** glm-oob (cli-opencode / GLM-5.2)
**Iteration:** 1 of 5
**Agenda item:** #1 — advisor (Layer 0) picks the mode directly; hubs become pure packet containers.
**Divergence charter:** this is NOT "flip everyone to `defaultMode: null`" (that is the run-1/run-2
answer in `021/run2-archive/research.md`). This iteration pushes to the literal deletion of Layer-1
routing and names what concretely breaks vs improves.

## Focus

Take the existing precedent — `skill_advisor.py:_apply_deep_skill_routing_layer` already
pre-resolves a `(skill, mode)` pair for **one** hub (`system-deep-loop`) — and follow it to its
extreme: there is no Layer-1 router at all. The advisor emits `(skill, mode, resources)` in one
shot. Hubs keep their packet folders (`SKILL.md`, `mode-registry.json`, vocabulary) but lose their
`hub-router.json`, `routerPolicy`, `routerSignals`, `defaultResource`, `bundleRules`, and the
`SMART ROUTING` section of `SKILL.md`. The whole keep-vs-null debate evaporates because there is no
hub fallback branch to keep or null.

The question is concretely: **what breaks, what improves, what does the canon become?**

## Findings

### F1. The precedent is already shipped, and it is not symmetric.
`_apply_deep_skill_routing_layer` is invoked twice in the advisor
(`skill_advisor.py:709`, `skill_advisor.py:4009`) and writes both `recommendation["mode"]` and
`recommendation["workflowMode"]` for the merged deep-loop node
(`skill_advisor.py:2859-2860`). Two structural facts make this precedent **load-bearing** and
**non-generalizable** at the same time:

- **Load-bearing:** the layer is gated on a *lexical* deep-signal regex
  (`skill_advisor.py:2825-2829`): `autoresearch | deep-research | deep-review | ai-council |
  :review:(auto\|confirm) | /autoresearch | convergence | deliberat | …`. If the regex fires,
  the layer overrides the recommendation's `mode` with the deep-mode winner. So for *one* family
  of prompts, Layer-1 routing is **already** bypassed today. The abolition case is not new
  behaviour — it is the existing behaviour generalised.
- **Non-generalizable:** the deep-signal regex is a hand-maintained per-domain scoring table.
  Generalising it to every hub means duplicating each hub's `mode-registry.json` discrimination
  vocabulary into the advisor. The reason Layer-1 routing exists is precisely so each hub can own
  its own discrimination table; abolishing it forces every hub's vocabulary to migrate into a
  single advisor file.

[SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:709,2815-2866,4009]

### F2. What breaks (concretely, four second-order costs the run-1/run-2 study did not name)

1. **Centralisation of vocabulary kills the per-skill authoring boundary.** Today, the
   `sk-design/hub-router.json` vocabulary (`interface-taste`, `motion-feel`, `audit-transform-question`,
   …) is owned by the design skill authors and lives next to the modes it routes between. Under
   abolition, all of it moves into `skill_advisor.py` (or a sibling advisor data file). New-skill
   authoring now requires editing a central file that every other skill depends on — the
   coordination cost that microservices literature calls the "distributed monolith." The canon
   (`sk-doc/create-skill/assets/skill/skill_smart_router.md`) currently tells authors to copy a
   self-contained router into their skill; abolition inverts the canon to "register your
   vocabulary with the central advisor."

2. **The advisor becomes Layer-1 + Layer-0 coupled, losing cold-start isolation.** Today the
   advisor can be probed without any hub being loaded (it is metadata + descriptions). Under
   abolition, every advisor call has to load every hub's vocabulary + resource-list — the
   advisor's hot path now does what hubs do today, just earlier. Latency moves, it does not
   disappear.

3. **The "single-shot" property forces eager resource selection.** A hub-router can pick resources
   *lazily* after deciding the mode (load `interface/SKILL.md` only if `interface` won). If the
   advisor emits `(skill, mode, resources)` in one shot, resources must be selected without the
   mode-decision having finished — either you load all candidate resources eagerly, or the
   advisor must run a shadow router internally to pick them. Either way, abolition does not
   remove routing work; it relocates it into the advisor.

4. **`bundleRules` lose their encoding home.** sk-doc's "create-skill + create-quality-control"
   rule and sk-design's "interface + foundations" rule (the only two `bundleRules` in the fleet,
   per F-init) are hub-level *ordered bundle* outcomes. Under abolition, the advisor must emit a
   list-of-modes; but the advisor today emits one `(skill, mode)` — extending it to ordered lists
   changes the advisor's contract surface, not just its data.

[SOURCE: .opencode/skills/sk-doc/hub-router.json:18-24 (bundleRules)]
[SOURCE: .opencode/skills/sk-design/hub-router.json:17-23 (bundleRules)]
[SOURCE: .opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md:2 (canon)]

### F3. What improves (three concrete wins, beyond the trivial "fewer files")

1. **The keep-vs-null debate disappears at the root.** There is no hub fallback branch to keep or
   null. The 5-hub audit in run-1/run-2 collapses into a single advisor-side question: "what
   does the advisor do on zero signal?" That question already has an answer
   (`DEEP_ROUTING_CONFIDENCE_THRESHOLD = 0.65` + `clarifying_question`,
   `skill_advisor.py:2572,2810-2812`). So abolition **centralises the keep-vs-null decision into
   one already-existing code path**, instead of it being re-litigated per hub.

2. **Vocabulary drift becomes detectable at one point.** Today, a stale `mode-registry.json` is
   an internal hub bug; under run-2's null-with-card fallback it becomes a user-facing lie
   (thread G of `021/run2-archive/research.md`). Under abolition, vocabulary lives in one file,
   so drift is one-file version control, not a fleet-wide scan.

3. **The advisor's existing clarifying-question infrastructure becomes the single disambiguation
   surface.** Run-2 had to invent a "compressed disambiguation card" because hubs were the ones
   deferring. If the advisor is the only deferrer, the card is just `recommendation["clarifying_question]`,
   which is already shipped. No new artefact.

[SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2572,2810-2812,2865-2866]
[SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/run2-archive/research.md (thread G)]

### F4. The real shape of abolition: a tier-split, not a deletion.

Stress-testing the literal deletion surfaces the actual minimal design: abolition is not "remove
`hub-router.json`"; it is **split routing into two tiers along the time axis**:

- **Cold tier (metadata-only, no vocab):** the advisor decides `(skill)` from skill
  descriptions alone. This is what the advisor does today before the deep-routing layer fires.
- **Hot tier (vocabulary-loaded):** the advisor (or a thin per-skill shim) decides `(mode)`
  inside the chosen skill's vocabulary.

The deep-routing layer is the one place today where the hot tier runs *inside* the advisor. The
honest abolitionist design moves the hot tier into the advisor for *every* skill — but that is
exactly the centralisation cost F2 names. So abolition does not eliminate two-layer routing; it
**makes the advisor do both layers**, and the hubs become "vocabulary packs" the advisor loads.

This is a **genuine reframe**, not a relabelling: the question stops being "should hubs default to
null" and becomes "should the hot tier be in-hub or in-advisor." Run-1/run-2 implicitly assumed
in-hub. The radical answer is "in-advisor, for every skill."

## Negative knowledge — what this iteration ruled out

- **Ruled out: "abolish Layer-1 by setting every `defaultMode` to null."** That is the run-1/run-2
  answer wearing a wig. Abolition only counts if `routerPolicy`, `routerSignals`, `bundleRules`,
  and `defaultResource` are *also* deleted. Anything less is null-with-extra-steps.
- **Ruled out: "generalise `_apply_deep_skill_routing_layer` verbatim."** The lexical regex trick
  works for deep-loops because their trigger vocabulary is small and stable. Design / cli / docs
  vocabularies are larger and shift per release; a per-hub regex per domain is the distributed
  monolith in another shape.

## Sources Consulted

- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` (lines 709, 2572,
  2810-2812, 2815-2866, 4009) — the one shipped precedent for advisor-side mode pre-resolution.
- `.opencode/skills/sk-doc/hub-router.json` (full file, 12 modes, 1 bundle rule, weight: 4 uniform).
- `.opencode/skills/sk-design/hub-router.json` (full file, 6 modes, 1 bundle rule, weight: 4 uniform).
- `.opencode/skills/cli-external-orchestration/hub-router.json` (3 modes, weight: 4 uniform).
- `.opencode/skills/system-deep-loop/hub-router.json` (7 modes, the hub the advisor already bypasses).
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md` — the canonized router
  template abolition would invert.
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/run2-archive/research.md`
  (thread G, A2) — established the "null recreates the disease" second-order risk; abolition changes
  the shape of that risk, doesn't remove it.

## Assessment

- **newInfoRatio:** 1.0 — first iteration of this lineage; every finding is net-new to the packet.
- **novelty justification:** First lateral pass; the tier-split reframe (F4) and the four second-order
  costs (F2) are not present in `021/run2-archive/research.md`.
- **confidence:** high on F1 (verbatim source evidence); medium on F4 (reframe is a design
  inference, not a measured outcome).
- **status:** `complete` — evidence-gathering iteration with five sourced findings.

## Reflection

- **What worked:** reading the one shipped precedent (`_apply_deep_skill_routing_layer`) made the
  "is abolition possible" question answerable from evidence rather than speculation. The regex-gated
  override is exactly the in-advisor hot tier (F4).
- **What failed:** trying to find a "minimal deletion" — there is no minimal deletion; the moment
  you keep `bundleRules` or `defaultResource` you have re-invented a Layer-1 router. The radical
  answer is all-or-nothing.
- **Ruled out:** "null everyone" as abolition-in-disguise (see Negative Knowledge).
- **Open question for later iterations:** abolition makes the advisor the single deferrer. But the
  advisor's deferral is a *clarifying question*, not a handoff. Iteration 3 (no-wrong-door) and
  iteration 4 (confidence-first) should stress whether *deferral* itself is the right primitive, or
  whether *handoff* is.

## Recommended Next Focus

**Iteration 2: Cross-domain analogies — the load-balancer health-check transfer (agenda #3).**
Iteration 1 stayed inside the routing domain. Iteration 2 deliberately imports a primitive from
outside routing entirely: weighted round-robin with health checks. The lateral claim to stress-test:
what if every mode had a runtime *health* score (recent success rate, recent token cost) and routing
weight adapted to it? Nothing in any `hub-router.json` has feedback today — every weight is static.
The load-balancer analogy is the one most likely to surface a primitive routing doesn't have; OS
scheduler / DNS / IP-router analogies collapse back to "weighted selection" and add less.
