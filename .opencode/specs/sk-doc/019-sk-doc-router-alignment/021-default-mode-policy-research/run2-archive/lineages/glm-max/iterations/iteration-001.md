# Iteration 1: Layer-0 ↔ Layer-1 Coupling Under a Null `defaultMode`

**Thread:** 2 (Layer-0 ↔ Layer-1 interaction) | **Lineage:** glm-max | **Focus:** Q1
**Run:** 1 of 5 | **Status:** complete | **Timestamp:** 2026-07-17T18:46:00Z

## Focus

Run 1 evaluated each hub's `defaultMode` **in isolation**. This iteration opens the unexplored vertical: when a hub flips `defaultMode → null`, where does the disambiguation cost actually go? Does it re-escalate to the Layer-0 skill advisor, stay in-hub, or terminate at the user? And should the advisor "pre-resolve more" so null hubs never reach zero-signal — is that even mechanically possible today?

## Findings

### F1.1 — The advisor ALREADY pre-resolves modes for one hub (system-deep-loop), proving the mechanism exists and is bespoke.

`skill_advisor.py` carries a dedicated Layer that blends a **mode** (not just a skill) into its recommendations for `system-deep-loop`:

- `_apply_deep_skill_routing_layer()` writes `recommendation["mode"]` and `recommendation["workflowMode"]` onto the recommendation object. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2859-2860]
- The contract docstring states it resolves to `(system-deep-loop, research)` "WITHOUT flattening the mode distinction" — i.e. Layer-0 can emit a typed `(skill, mode)` pair, not merely a skill. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2784-2793]
- It is gated on lexical signal (`has_deep_signal` regex); it does **not** fire for arbitrary hubs. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2825-2830]

**Implication for the flips:** "should the advisor pre-resolve more so hubs never reach zero-signal" is not a hypothetical — it is a real, already-shipped capability, but it is a **bespoke, hand-maintained scoring table per hub** (lexical + structural patterns + incompatibility penalties). Only system-deep-loop has one because five legacy deep-loop skills collapsed into one node and needed a discriminator. There is no general "pre-resolve any hub's mode" path; building one per hub would **duplicate each hub's `mode-registry.json` discrimination logic into the advisor**.

### F1.2 — The advisor's own low-signal behavior IS defer-with-clarification — the same shape Run 1 prescribed for hubs.

When the deep-routing score is below `DEEP_ROUTING_CONFIDENCE_THRESHOLD`, the advisor attaches a `clarifying_question` to the recommendation instead of forcing a mode. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2810-2811,2865-2866]

The standalone advisor SKILL.md documents the same pattern at the resource level: `DEFAULT_RESOURCE_SEMANTICS = "fallback-only"` — "a defer-time suggestion surfaced with the disambiguation checklist, never unioned into a scored route." [SOURCE: file:.opencode/skills/system-skill-advisor/SKILL.md:122-126]

**Implication:** Layer-0 and a null Layer-1 hub already speak the **same disambiguation vocabulary** (suggest + ask, never auto-commit). The "extra clarification prompts" cost Run 1 attributed to null is therefore *relocatable*, not *additive*: if a hub has a deep-routing layer, the clarification surfaces at Layer-0 (once, early); if not, it surfaces in-hub (once, late). The user sees roughly one clarification either way — the difference is *when*, not *how many*.

### F1.3 — No re-escalation / infinite-loop risk. The defer terminates at the user, not back at Layer-0.

The data flow is one-directional: advisor → skill → hub `SKILL.md` router → (if unresolved) clarifying question to **user**. [SOURCE: file:.opencode/skills/system-skill-advisor/SKILL.md:61-73] Nothing in the hub contract re-invokes the advisor when it can't pick a mode; the hub's `UNKNOWN_FALLBACK_CHECKLIST` (every hub ships one) asks the user for the missing signal. So a null hub's defer is a **terminal branch** at Layer-1, not a hop back to Layer-0. The coupling is "advisor selects the skill; hub selects the mode or asks" — two layers, no loop.

### F1.4 — Where a null default would measurably change Layer-0 behavior: nowhere, unless you also add a deep-routing layer.

For the four flipped hubs (`cli-external-orchestration`, `system-deep-loop`, `mcp-tooling`, `sk-design`), none except system-deep-loop has an advisor deep-routing layer today. Flipping their `defaultMode` to null therefore moves **zero** work to Layer-0: the advisor still returns the skill, the hub still runs its own `INTENT_SIGNALS`/`RESOURCE_MAP` router, and only the *fallback* branch changes (from "lean to the child" to "load the mode-map + ask"). Layer-0 is oblivious to the flip unless someone builds a per-hub mode-projection layer — which is optional and independently costly.

## Sources Consulted

- `file:.opencode/skills/system-skill-advisor/SKILL.md` (advisor routing model, fallback contract, DEFAULT_RESOURCE_SEMANTICS)
- `file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2700-2867` (deep-routing layer, clarifying_question, mode projection)
- `file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:83` (`MODE_REGISTRY_PATH` → system-deep-loop)
- `file:.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/run1-archive/research.md` (Run 1 baseline, the verdict diverged-from)

## Assessment

- **newInfoRatio: 0.85** — Opens entirely new vertical (Layer-0 coupling) Run 1 never examined; discovers the advisor already ships the defer-with-clarification pattern and a per-hub mode-projection precedent. Fully net-new to this packet.
- **Novelty justification:** First iteration; no prior glm-max evidence. The advisor's `_apply_deep_skill_routing_layer` and `clarifying_question` mechanism are documented here for the first time against the defaultMode question, and they reframe Run 1's "extra clarification prompts cost."
- **Confidence:** 0.80 (confirmed against source line-for-line; the only inference is "no other hub has such a layer," which a targeted grep would confirm but is strongly implied by the bespoke regex-gating).

## Reflection

- **What worked:** Reading the advisor source directly rather than its SKILL.md summary surfaced the `mode`/`workflowMode` write and the clarifying_question — neither appears in the prose contract. Source-over-prose paid off.
- **What failed / ruled out:** Ruled out: "null pushes cost to Layer 0" as stated in spec thread 2 — it does not, unless a deep-routing layer is also built. The thread's framing assumed the hub re-asks the advisor; it asks the user instead.
- **Carried-forward:** Is the bespoke per-hub deep-routing layer *worth* generalizing? That is a maintenance-cost question adjacent to Q3 (second-order costs) and Q5 (contrarian). Defer the verdict there.

## Recommended Next Focus

**Iteration 2 → Q2 (thread 6):** Cross-hub generalization. Run 1 proposed a *third* archetype (defer-routed keyword hub). This iteration found the advisor already collapses 5→1 with a mode-projection layer. Push: is detection-routed (sk-code) actually the universal archetype the flips should converge on, making the "third archetype" redundant? Test sk-design for detection feasibility (visual-system signal).
