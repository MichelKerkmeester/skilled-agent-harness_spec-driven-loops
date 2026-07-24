# Iteration 4: Edge Cases That Break the Archetype Rule (single-mode, empty map, drift, contextual defaults)

**Thread:** 9 (edge cases & failure modes) | **Lineage:** glm-max | **Focus:** Q4
**Run:** 4 of 5 | **Status:** complete | **Timestamp:** 2026-07-17T19:00:00Z

## Focus

The per-axis archetype taxonomy (iter 2) and the menu-vs-scorer split (iter 3) were built from multi-mode hubs with clean signals. This iteration hunts for edge cases that **break or refine** those rules: single-mode hubs (does null degenerate to "load the only mode"?), empty/drifting mode-map, and — the load-bearing one — generalizing cli's *contextual* (runtime-dependent) default into a typed concept. Which edge exposes a flaw?

## Findings

### F4.1 — cli-external-orchestration is NOT a pure-defer flip; it is a **detection-defaulted** hub — a distinct fourth shape Run 1 collapsed into "flip to null."

cli's `hub-router.json` sets a static `defaultMode: "cli-opencode"` and `defaultResource: ["cli-opencode/SKILL.md"]`, with no field expressing runtime-dependence. [SOURCE: file:.opencode/skills/cli-external-orchestration/hub-router.json:4-14] The "runtime-dependent" property Run 1 cited lives only in prose (each executor refuses self-dispatch), not in the router. Critically, **cli has an environmental signal the other three flips lack: the active runtime.** "Which CLI am I running inside" is machine-detectable (the runtime is in the process environment), whereas deep-loop's research-vs-review and sk-design's color-vs-motion are intent-only.

**The refinement:** cli should NOT become pure-defer (null + mode-map). It should become `defaultMode: null` **plus a runtime-detection block** that resolves the default from the active runtime — i.e. detection applied to the *default-resolution axis*, not surface bundling. This is a distinct shape:

| Shape | Default resolution | Has env signal? | Hubs |
|---|---|---|---|
| keyword-with-default | static named child (catch-all anchor) | n/a | sk-prompt |
| detection-defaulted | `null` static + runtime-detected default | yes (runtime) | **cli-external-orchestration** |
| pure-defer | `null` + mode-map menu, ask the user | no | system-deep-loop, mcp-tooling, sk-design |
| detection-routed (surface) | `null` on workflow + surface detected | yes (CWD/markers) | sk-code (surface axis) |

This is a genuine correction to Run 1: of the four flips, **cli is the one that can be detection-defaulted** (it has a runtime signal), so it should not be encoded identically to the three pure-defer flips. Run 1's "flip cli to null" is the right *first step* (kill the static bias) but leaves cli's best behavior — auto-pick the in-runtime executor — unencoded. The encoding should add `defaultResolution: "runtime-detected"` as a typed option distinct from a static `defaultMode`.

### F4.2 — Single-mode hub edge case: the archetype rule degenerates — defaultMode is moot, but the hub itself is arguably not a "hub."

With exactly one mode, `defaultMode: <that mode>` and `defaultMode: null` are **operationally equivalent** — both route to the only mode, and there is no disambiguation to defer. The catch-all-anchor rule (iter 3) is vacuous: the single mode IS the catch-all by definition. So a single-mode hub needs no archetype decision. But this exposes a definitional edge: a one-mode "hub" is indistinguishable from a standalone skill (the advisor routes the single identity and there is no Layer-1 choice). system-skill-advisor is exactly this — "a normal, standalone single-mode skill whose sole workflow mode is `system-skill-advisor` (there is no `mode-registry.json`)." [SOURCE: file:.opencode/skills/system-skill-advisor/SKILL.md:87] **Verdict:** the archetype rule applies only at ≥2 modes; the canon's threshold for "you are a parent hub and need a routerPolicy" should be ≥2 modes. A one-mode entity should not adopt the hub-router machinery at all (it gains nothing and inherits the maintenance coupling from iter 3 A3). This is a small but real canon correction: don't scaffold a hub-router for a single-mode skill.

### F4.3 — Empty / drifting mode-map: the registry must be the single source, and the menu derived, not co-authored.

If `mode-registry.json` and `hub-router.json` drift (a mode added to one but not the other), two distinct breakages occur:
1. **Routing break:** hub-router scores a mode whose registry entry is missing → sk-code's router hits `"matched registry but no packet SKILL.md was available"` and falls to UNKNOWN_FALLBACK. [SOURCE: file:.opencode/skills/sk-code/SKILL.md:113-115]
2. **Menu break (new under null):** the defer branch presents a menu listing a mode that doesn't score, or omits one that does — a user-facing lie (iter 3 A3 made drift user-visible; this confirms the mechanism).

**Verdict:** under null+mode-map, `mode-registry.json` becomes the user-facing source-of-truth for the disambiguation menu. The menu card (iter 3 A4) must be **derived** from the registry, never independently authored, and the existing `hub-router.json ↔ mode-registry.json` bidirectional-alignment checker (canon template line 2: "Keep routerSignals keys bidirectionally aligned with mode-registry.json modes") [SOURCE: file:.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:2] must run as a gate, not just a lint. The empty-map case (zero modes) is degenerate: it means the hub was scaffolded but never populated — defer to "no modes configured; cannot route," not to a silent empty menu.

### F4.4 — "Contextual default" generalized: detection can apply to default-resolution, not just surface bundling — but only when an environmental signal exists for the default axis.

The generalization from F4.1: iter 2 said "detection applies where an environmental signal exists." That was framed around surface bundling. cli shows detection can also apply to the **default axis** — when the *default itself* is a function of detectable environment (runtime). The discriminant is unchanged (environmental vs intentional), but the *target* of detection broadens: it can resolve a mode (sk-code surface) OR resolve a default (cli runtime). This means the canon's detection mechanism is not surface-specific; it is "resolve any routing axis from environment when a signal exists." The flip consequence: **only cli qualifies for detection-defaulted among the four flips**; deep-loop/mcp-tooling/sk-design have no environmental signal for their default axis and stay pure-defer. This sharpens Run 1's uniform "flip 4 to null" into a 1+3 split with distinct encodings.

## Sources Consulted

- `file:.opencode/skills/cli-external-orchestration/hub-router.json:4-14` (static defaultMode + defaultResource; no runtime field)
- `file:.opencode/skills/system-skill-advisor/SKILL.md:87` (single-mode standalone skill; no mode-registry)
- `file:.opencode/skills/sk-code/SKILL.md:113-115` (registry-miss → UNKNOWN_FALLBACK)
- `file:.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:2` (bidirectional alignment checker)
- `file:.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/run1-archive/research.md` (Run 1 "cli runtime-dependent" framing)

## Assessment

- **newInfoRatio: 0.75** — Splits Run 1's uniform "flip 4" into a 1+3 with distinct encodings (cli = detection-defaulted; the other three = pure-defer). Adds two canon corrections (single-mode threshold; drift-as-gate not lint) and broadens detection from surface-bundling to default-resolution.
- **Novelty justification:** Run 1 treated all four flips identically. This iteration shows cli has an environmental signal (runtime) the others lack, making it a distinct, more sophisticated shape — and that detection can target the default axis, not just surface. The single-mode and drift refinements are mechanical but unaddressed by Run 1.
- **Confidence:** 0.80 (cli's hub-router is line-cited; the "runtime is detectable" claim is robust — the runtime is literally the process. The single-mode threshold is an inference from the advisor's own single-mode description but strongly supported).

## Reflection

- **What worked:** Treating cli as the test case rather than re-averaging the four flips exposed that cli is structurally different (has an env signal for the default). The "detection can target default-resolution" generalization fell out of asking *what* cli would detect.
- **What failed / ruled out:** Ruled out: "all four flips encode identically." They do not — cli is detection-defaulted, the rest are pure-defer. Also ruled out: "single-mode hubs need a routerPolicy" — they don't; the canon threshold should be ≥2 modes.
- **Carried-forward:** The 1+3 split and the detection-on-default-axis concept connect directly to Q5 (contrarian): if cli auto-picks the in-runtime executor via detection, that is essentially "auto-default is fine WHEN the default is environmentally determined" — the strongest version of the keep-a-default case. Hand to Q5 to steelman.

## Recommended Next Focus

**Iteration 5 → Q5 (thread 12):** Contrarian steelman. Argue the strongest case that auto-default is fine and Run 1's flip-4 is wrong — now refined by F4.1/F4.4 (detection-defaulted cli is the model: a default is fine WHEN it's environmentally determined and self-correcting). Where might keeping a named default actually be right beyond cli? What would falsify the flips?
