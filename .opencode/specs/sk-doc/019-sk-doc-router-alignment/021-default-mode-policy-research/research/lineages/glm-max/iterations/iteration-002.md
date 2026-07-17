# Iteration 2: Is Detection-Routed the Universal Archetype? (sk-design feasibility test)

**Thread:** 6 (cross-hub generalization) | **Lineage:** glm-max | **Focus:** Q2
**Run:** 2 of 5 | **Status:** complete | **Timestamp:** 2026-07-17T18:50:00Z

## Focus

Run 1 proposed a *third* archetype ("defer-routed keyword hub") for the four flipped hubs. This iteration stress-tests whether that third archetype is **redundant** — i.e. whether **detection-routed** (sk-code's pattern) is actually the universal answer the flips should converge on, making "defer-routed" collapse into "detection-routed." Test case: could sk-design be detection-routed instead of defer-routed? The discriminant: is the mode signal machine-detectable from the environment, or only inferable from intent?

## Findings

### F2.1 — sk-code's "detection-routed" works ONLY because its discriminator is environmental, not intentional.

sk-code detects its **surface axis** (webflow vs opencode) from the environment — `CWD + library markers` — and it nulls its `defaultMode` on the **workflow axis** (quality vs code-review), deferring that to intent. [SOURCE: file:.opencode/skills/sk-code/SKILL.md:120-122]

> "Surface detection (`WEBFLOW`, `OPENCODE`, `MOTION_DEV`, with `OPENCODE` over `WEBFLOW` precedence) lives once in the hub's `shared/` layer... When no workflow mode dominates (a bare implement/debug/verify request), the router defers to a pure surface bundle: it detects the surface... `routerPolicy.defaultMode` is `null` — the hub does not force a stale default."

**Key asymmetry:** sk-code is detection-routed on the axis that has an environmental signal, and defer-routed (null) on the axis that does not. Detection is not a hub-level property; it is an **axis-level** property, gated on whether a signal exists in the environment to detect.

### F2.2 — sk-design has NO environmental discriminator for its five judgment modes — detection-routed does not apply.

sk-design's `mode-registry.json` defines five design-judgment modes (interface, foundations, motion, audit, md-generator) whose discriminator is **entirely lexical/intent-based**. The `aliases` are request vocabulary, not environmental signals:

- `foundations`: `"color system", "oklch palette", "typography scale", "design tokens", "grid"` [SOURCE: file:.opencode/skills/sk-design/mode-registry.json:76]
- `motion`: `"animate this", "micro-interactions", "transitions", "choreography"` [SOURCE: file:.opencode/skills/sk-design/mode-registry.json:97]
- `audit`: `"design audit", "wcag contrast", "anti-slop detection"` [SOURCE: file:.opencode/skills/sk-design/mode-registry.json:118]
- `interface`: `"make it look good", "visual direction", "bolder", "redesign the ui"` [SOURCE: file:.opencode/skills/sk-design/mode-registry.json:55]

There is no file on disk, no CWD marker, no runtime state that says "this is a color-system request vs a motion request." You cannot detect a design mode from the environment. Therefore sk-design **cannot** be detection-routed on its judgment axis — the signal simply is not there to detect. The only semi-detectable mode is `md-generator` (backendKind `playwright-extract`), inferable from "a URL is present" — but that is one mode of six, not the hub.

### F2.3 — Conclusion: detection-routed is NOT universal; Run 1's third archetype is NOT redundant — but the framing should be **per-axis, not per-hub.**

The decisive variable is whether the primary discriminator is **environmental** (detectable) or **intentional** (lexical). This yields an axis-level, not hub-level, taxonomy:

| Discriminator type | Archetype (per-axis) | Example |
|---|---|---|
| Environmental / machine-detectable | **detection-routed** (null default, detect the signal) | sk-code surface axis (webflow/opencode from CWD) |
| Intentional, one genuine catch-all | **keyword-with-default** (non-null default that earns its keep) | sk-prompt → prompt-improve |
| Intentional, no safe single mode | **defer-routed** (null default + mode-map fallback) | sk-design judgment axis, system-deep-loop, mcp-tooling |

The crucial refinement of Run 1: **sk-code already demonstrates the "detection-on-one-axis + defer-on-another" combination.** sk-code is BOTH archetypes simultaneously — detection-routed (surface) and defer-routed (workflow, null default). So "defer-routed" and "detection-routed" are not competing hub-level archetypes; they are **per-axis strategies** that co-exist within one hub. Run 1's "add a third archetype" is right in spirit but mis-leveled: the canon should describe axis-level routing strategy, and a hub's `routerPolicy` declares the strategy **per axis** (`workflowMode` default vs surface default), not one hub-level `defaultMode`.

### F2.4 — Practical consequence for the flips: none of the four flipped hubs has sk-code's environmental signal, so none can become detection-routed — confirming "flip to null + mode-map" is correct for them, NOT a collapse into sk-code's pattern.

`cli-external-orchestration`'s discriminator is runtime-dependent (each executor refuses self-dispatch — Run 1), `system-deep-loop`'s is intent (research/review/ai-council), `mcp-tooling`'s is which tool the user wants, `sk-design`'s is which design axis. All four are intentional discriminators with no environmental handle. Detection-routed is therefore **not** an available upgrade path for them; null + mode-map (defer-routed) is the terminal correct state, not a waypoint to detection. This closes the "could sk-design be detection-routed?" sub-question firmly: **no**, unless a future mode introduces an environmental signal (e.g. "a URL is open" → md-generator), which would only ever promote one mode, not the hub.

## Sources Consulted

- `file:.opencode/skills/sk-code/SKILL.md:120-122` (detection axis nulls defaultMode; surface detection from environment)
- `file:.opencode/skills/sk-code/SKILL.md:50-57` (registry-driven routing; advisor routes single identity sk-code, hub picks mode)
- `file:.opencode/skills/sk-design/mode-registry.json:39-164` (six modes; all discriminators are lexical aliases, no environmental signal)
- `file:.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/run1-archive/research.md` (Run 1's "third archetype" proposal)

## Assessment

- **newInfoRatio: 0.80** — Reframes Run 1's hub-level "third archetype" as a per-axis strategy, and proves sk-code already combines detection+defer within one hub. Net-new: the environmental-vs-intentional discriminant, and the axis-level taxonomy.
- **Novelty justification:** Run 1 treated defaultMode as a hub-level field and proposed a third hub archetype. This iteration shows the archetype is determined per-axis by signal availability, and sk-code is already a hybrid. Closes the "is detection universal" sub-question with a negative grounded in the absence of environmental signals.
- **Confidence:** 0.85 (the aliases are exhaustive and unambiguous; the inference "no environmental signal exists for design modes" is robust because design intent is expressed in the request, not the repo).

## Reflection

- **What worked:** Comparing the two registries side-by-side exposed the real discriminant (signal location), which neither registry names explicitly. The axis-level reframe emerged from noticing sk-code nulls defaultMode on workflow but detects surface.
- **What failed / ruled out:** Ruled out: "all hubs converge on detection-routed" (thread 6 hypothesis). Not possible without an environmental signal. Also ruled out: treating defer-routed and detection-routed as competing hub archetypes — they are per-axis.
- **Carried-forward:** The axis-level reframe has an encoding consequence Run 1 didn't reach: `routerPolicy` may need a per-axis declaration (workflow default vs surface default) rather than one `defaultMode`. This connects to Q4 (edge cases — single-mode hubs make the axis question trivial) and Q5 (contrarian — does axis-leveling add complexity for little gain?).

## Recommended Next Focus

**Iteration 3 → Q3 (thread 7):** Second-order anti-patterns of `null + mode-map`. Run 1 said null's fallback should load the routing helper. This iteration inverts it: what NEW failure modes does that introduce — mode-map bloat, stale registries, over-deferring friction, and crucially **mode-map-as-new-catch-all-bias** (the disease Run 1 cured, re-introduced at the fallback layer)? Does the fix recreate the original problem?
