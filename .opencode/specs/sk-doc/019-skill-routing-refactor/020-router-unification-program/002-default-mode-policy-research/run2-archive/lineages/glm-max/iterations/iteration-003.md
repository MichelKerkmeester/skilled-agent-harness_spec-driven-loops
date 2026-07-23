# Iteration 3: Second-Order Anti-Patterns of `null + mode-map` (Does the Fix Recreate the Disease?)

**Thread:** 7 (second-order effects) | **Lineage:** glm-max | **Focus:** Q3
**Run:** 3 of 5 | **Status:** complete | **Timestamp:** 2026-07-17T18:55:00Z

## Focus

Run 1 prescribed null's fallback should load the routing helper (`smart_routing.md` + `mode-registry.json`). This iteration inverts the recommendation and asks: what NEW failure modes does that introduce? Specifically — does loading the full mode-map on a zero-signal request recreate the **catch-all-bias over-emission disease** that Run 1 spent the session curing? And what second-order costs (over-deferring, stale registries, menu-vs-scorer conflation) come bundled with null+mode-map?

## Findings

### F3.1 — The canon ALREADY encodes the rule that ties the over-emission disease to the default — confirmed line-for-line.

The create-skill canon's `parent_skill_hub_router_template.json` is explicit and repeated:

- `_routingPrecisionNote`: "Catch-all vocabulary classes (hub-identity here) belong on the DEFAULT mode only — never on specialized modes... a class shared across modes makes them all co-fire on hub-generic words: over-emission that fails the route-gold gate." [SOURCE: file:.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:5]
- The default mode's signal note: "This is defaultMode; it alone carries hub-identity so hub-generic words route here. Do NOT add hub-identity to the specialized modes below." [SOURCE: file:.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:37]
- The `hub-identity` vocabulary class is the skill's own name + meta-terms (`mode-registry`, `hub-router`, `workflowmode`). [SOURCE: file:.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:60-62]

**Why this matters for the flips:** Run 1's reframe ("defaultMode is a catch-all scoring anchor") is not opinion — it is the canon's *named mechanism*. The default mode is the ONLY legal home for hub-generic vocabulary. So "flip to null" is not just removing a fallback pointer; it is **evicting hub-identity's only scoring home.** That eviction is the entire point (it stops the bias) but it is also the seed of every second-order cost below.

### F3.2 — Anti-pattern A1: "the skill's own name becomes unrouteable" (over-deferring friction).

With `defaultMode: null` and hub-identity correctly removed from all modes, the skill's own name (`design`, `sk-design`, `prompt`) scores **no mode**. A request that is just the skill name with no specific axis — "help me with design", "use sk-design" — falls to the zero-signal defer branch every time. This is maximally *safe* (no mis-route) but can be maximally *annoying* if name-only requests are common. The cost is real but bounded: the advisor selects the skill on the name, and the hub's defer surfaces a disambiguation card, so the user gets a *menu* (not a dead end). The friction is one extra turn, not a failure. **Verdict: acceptable, but the canon should name it as the expected cost of null so authors don't re-add a default to suppress it.**

### F3.3 — Anti-pattern A2: "mode-map-as-new-catch-all-bias" — the fix recreating the disease, but ONLY if the menu is scored, not presented.

This is the central second-order risk. Run 1 said load `smart_routing.md` + `mode-registry.json` on the null fallback. The two resources behave differently:

- **`smart_routing.md` is SAFE as a fallback resource.** Its `DEFAULT_RESOURCE = []` — "No always-loaded preamble on the positive leaf axis... Leaf routing loads only the selected mode's set." [SOURCE: file:.opencode/skills/sk-design/shared/references/smart_routing.md:72-75] It emits typed leaves ONLY on a positive intent score; on zero-signal it loads nothing. Loading it as a fallback resource does NOT recreate bias.
- **`mode-registry.json` is a MENU, not a scorer.** It lists modes with their `aliases` (color, motion, audit — mode-specific vocabulary, NOT hub-generic). [SOURCE: file:.opencode/skills/sk-design/mode-registry.json:55-118] Loading it is safe ONLY IF the agent treats it as a **disambiguation card to present** ("here are the 6 modes; which axis?"), NOT as a routing resource to score against.

**The latent disease:** if a future author, trying to make the menu "smarter," adds hub-identity vocabulary to `mode-registry.json` (e.g. tagging every mode with the skill name so the menu "feels complete"), loading it on fallback would re-introduce exactly the co-fire over-emission the canon forbids. **Verdict: Run 1's "load both" is correct ONLY with an explicit semantics split — `defaultResourceSemantics: "disambiguation-card"` for the menu, distinct from a scored routing resource. The canon must forbid hub-identity vocabulary in any resource loaded as a fallback scorer.**

### F3.4 — Anti-pattern A3: stale-registry drift becomes USER-VISIBLE (a new maintenance coupling).

Today `mode-registry.json` is an internal routing artifact. Under null+mode-map, it becomes a **user-facing** artifact — it is the menu shown on defer. If `mode-registry.json` drifts from `hub-router.json` signals (a mode added to one but not the other), the agent asks the user to pick from a menu that does not match what actually scores. Pre-null, a stale registry was an internal routing bug; post-null, it is a user-facing lie. **Verdict: null+mode-map elevates `mode-registry.json` freshness from internal to user-visible — it needs the same drift-validation the canon applies to `hub-router.json`, or a single-source rule that the menu is derived from the router (not independently authored).**

### F3.5 — Anti-pattern A4: "the compressed card vs full registry" shape question (spec thread 1).

The mode-menu for disambiguation does not need to be the full machine-readable `mode-registry.json` (which is large and includes `toolSurface`, `backendKind`, etc. irrelevant to a user choice). A **compressed disambiguation card** — one line per mode: `mode — one-sentence purpose — 2-3 example triggers` — serves the defer branch better: small token cost, unambiguous, human-readable. The full registry stays the machine source-of-truth; the card is the presentation layer. **Verdict: the canon should specify the fallback loads a *compressed card* derived from the registry, not the raw registry — this bounds token cost and removes the temptation to score the menu.**

## Sources Consulted

- `file:.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:5,37,60` (hub-identity-on-default-only canon rule)
- `file:.opencode/skills/sk-design/shared/references/smart_routing.md:72-75,146` (DEFAULT_RESOURCE=[]; zero-signal → default or disambiguate)
- `file:.opencode/skills/sk-design/mode-registry.json:55-118` (aliases are mode-specific, not hub-generic)
- `file:.opencode/skills/sk-design/hub-router.json` (routerSignals; hub-identity class on modes — the live sk-design over-emission bug)
- `file:.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/run1-archive/research.md` (Run 1 "load both" recommendation)

## Assessment

- **newInfoRatio: 0.70** — Genuine second-order stress test. Discovers the canon already names the disease mechanism (hub-identity-on-default), and that Run 1's "load both" prescription is correct ONLY with an explicit menu-vs-scorer semantics split and a compressed-card presentation layer. Net-new: A1 (name-unrouteable), A3 (registry drift becomes user-visible), A4 (compressed card shape).
- **Novelty justification:** Run 1 asserted the fallback rule without stress-testing it. This iteration derives four concrete anti-patterns from the canon's own hub-identity rule and proposes a semantics split (`disambiguation-card` vs scored resource) Run 1 did not reach.
- **Confidence:** 0.85 (canon rule is line-cited; the anti-patterns are mechanical consequences, not speculation. A1's "how common are name-only requests" is the one empirical unknown, deliberately routed around per Run 1's no-corpus stance).

## Reflection

- **What worked:** Reading the canon *template* (not just live hubs) surfaced the hub-identity-on-default rule as an explicit, named invariant — which is the load-bearing fact for the whole second-order analysis. The template's `_routingPrecisionNote` is the Rosetta stone.
- **What failed / ruled out:** Ruled out: "loading smart_routing.md recreates the bias" (false — its DEFAULT_RESOURCE=[]). Confirmed-and-refined: "loading mode-registry.json is safe" — safe ONLY as a presented menu, NOT as a scored resource.
- **Carried-forward:** The semantics split (`defaultResourceSemantics: "disambiguation-card"` vs `"fallback-only"` vs scored) is an encoding delta. It connects to Q4 (single-mode hubs make the menu trivial → no card needed) and Q5 (contrarian: a named default sidesteps ALL of A1–A4 at the cost of one mis-route — is that the better tradeoff?).

## Recommended Next Focus

**Iteration 4 → Q4 (thread 9):** Edge cases that break the archetype rule. Single-mode hubs (no menu to disambiguate — does null degenerate to "load the only mode"?), empty mode-map, registry drift mechanics, and generalizing cli's *contextual* (runtime-dependent) default into a typed concept. Which edge cases expose a flaw in the per-axis archetype taxonomy from iter 2?
