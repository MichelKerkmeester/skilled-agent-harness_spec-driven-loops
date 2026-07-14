---
name: sk-design
description: "Distinctive, intentional UI design and the full design surface: visual direction, taste, and build for interfaces; color, typography, layout, spacing, hierarchy, and design tokens; animation, transitions, and micro-interactions; accessibility, performance, responsive, theming, and anti-slop design audit with quality scoring; and live-website CSS to Style Reference DESIGN.md extraction. Use to make a UI look custom and polished rather than templated, design a visual system, choreograph motion, audit and harden design quality, or extract a real design system from a live site. The single advisor-routable design skill: it routes to five design modes (interface, foundations, motion, audit, md-generator) plus a nested Open Design transport packet via mode-registry.json, and each holds its own logic."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.4.3.0
metadata:
  author: OpenCode
  family: sk-hub
---

<!-- Keywords: sk-design, design-family, mode-registry, workflowmode, backendkind, reference-base, anti-slop, design-tokens, cognitive-laws, interface-design, frontend-design, visual-design, visual-identity, make-it-look-good, looks-templated, redesign-the-ui, hero-section, ui-build, typography, palette, color-palette, font-pairing, ux-quality-checklist, design-variations, foundations, color-system, oklch, color-token-system, dark-mode, typography-scale, spacing-system, responsive-layout, layout, hierarchy, visual-hierarchy, information-hierarchy, grid, themes, motion-design, animation, animate-this, transitions, micro-interactions, framer-motion, animatepresence, exit-animation, reduced-motion, morphing-icons, motion-performance, design-audit, ui-critique, accessibility-audit, performance-audit, anti-slop-detection, production-hardening, design-quality-score, P0-P1-design-findings, polish, theming, design.md, design-md, style-reference, css-extraction, website-design-extraction, design-reference, tokens.json, playwright, design-to-markdown, design-system-generator, css-tokens, color-extraction, typography-extraction, hex-extraction, shadow-extraction, spacing-extraction, design-fidelity, anti-hallucination, extract-design-system, generate-design-md, capture-website-css, design-tokens-from-url, distinctive-interface, intentional-design, polished-ui, refined-ui, custom-not-templated, premium-ui, aesthetic, design-taste, visual-direction, craft, make-it-beautiful, less-generic, redesign-distinctive, smooth-animation, hover-effect, scroll-animation, choreography, interaction-feel, animate-the-menu, transition-design, design-audit, accessibility-audit, design-quality-audit, design-qa, audit-the-design, review-the-ui, wcag-contrast, ui-quality-review, bolder, quieter, distill, clarify, delight, gratuitous, transform-verb, open-design, od-cli, od-mcp, wire-open-design, connect-open-design, drive-open-design, terminal-design, design-mcp-open-design, validate-design-md, design-md-validation, hex-accuracy, section-completeness, tokens-json-fidelity -->

# Design Family Hub (sk-design)

One skill, five design modes plus a nested transport packet, one shared reference base. `sk-design` is the public, advisor-routable home for every design persona; the shared design reference base (anti-slop principles, cognitive laws, design-token vocabulary) is the common vocabulary the modes cite. Before routing, the hub acts as a design manager: it gathers context, makes the plan visible, names proof expectations, then delegates through `mode-registry.json`. This hub holds NO per-mode design logic — each mode keeps its own contract in its packet, and the hub only routes by `workflowMode` through `mode-registry.json`.

---

## 1. WHEN TO USE

Use this skill (through the hub) for any design-family workflow. Invoke it as `sk-design` (optionally with a mode hint such as `motion: <request>`); the hub classifies the request, resolves a mode key, and loads the matching nested packet.

| Mode | Use it for | Packet |
|------|-----------|--------|
| **interface** | Distinctive, intentional UI direction and build judgment, visual identity, redesign, generic "make it look good", interface writing | `sk-design/design-interface/` |
| **foundations** | Static visual-system decisions: color, typography, layout, spacing, hierarchy, responsive adaptation, themes, design tokens | `sk-design/design-foundations/` |
| **motion** | Temporal interaction design: animation, transitions, micro-interactions, motion materials, `AnimatePresence`, reduced motion | `sk-design/design-motion/` |
| **audit** | Design QA and critique: accessibility, performance, responsive, theming, anti-slop detection, scoring, production hardening | `sk-design/design-audit/` |
| **md-generator** | Extract a live website's real CSS into a v3 Style Reference `DESIGN.md` via the embedded extract-write-validate pipeline | `sk-design/design-md-generator/` |
| **design-mcp-open-design** _(transport)_ | Drive the external Open Design app's `od` CLI / stdio MCP from the terminal — a read-only bridge, always paired with a design-judgment mode that owns the taste | `sk-design/design-mcp-open-design/` |

### When NOT to Use
- A single quick read/edit with no design judgment — use the relevant skill directly.
- Pure implementation after design direction is settled — hand off to `sk-code`.
- A design transport only (Figma, Open Design) — load the design judgment via this hub first, then use the transport. The transport is never the taste authority.
- The shared reference base itself — it is the vocabulary the modes cite, not a user workflow.

---

## 2. SMART ROUTING

Routing is **registry-driven**. `mode-registry.json` is the single source of truth; the hub reads it and does not re-derive the mapping. The advisor routes any design query to the single identity `sk-design`; the hub then picks the mode.

### Manager Intake Before Routing

Before selecting a mode or using a transport, gather the smallest complete context set needed to avoid generic output:
- **Goal**: what the user wants changed, evaluated, generated, or extracted.
- **Surface**: target page, component, product area, brand, platform, or artifact.
- **Inputs**: existing files, screenshots, live URLs, design references, copy, constraints, and user-provided assets.
- **Constraints**: audience, accessibility, responsive breakpoints, brand limits, implementation surface, deadlines, and non-goals.
- **Proof expectations**: what evidence will make the result ready, including critique criteria, accessibility checks, responsive states, and any requested transport confirmation.

If a required fact is unknown and changes the route or acceptance bar, ask a focused question before routing. If enough context exists for a narrow advisory answer, proceed with the smallest useful mode and state any assumption explicitly.

**Ordering is a hard constraint, not just a preference**: do not state a "Route selected"/"Route:" line, a mode/bundle name, or any design recommendation until AFTER the intake fields above (or the one focused clarifying question) have been shown to the user. Requesting missing inputs (screenshots, brand deck, URL) in the same message as, or after, an already-declared route does not satisfy this — the intake must visibly precede the route, not just accompany or follow it. A label like "Intake:" ahead of the route text does not itself satisfy this rule if its content is generic hedging rather than substantive answers to the five fields above.

**No hedge-everything bundling**: when the user names several candidate modes as uncertain (e.g. "not sure whether this needs interface, foundations, motion, or audit") with no other disambiguating signal, that is not evidence for bundling all of them — it is exactly the missing-fact case that requires the ONE focused question first ("which of these is the primary concern: direction, tokens, motion, or quality?"), or an explicitly stated assumption narrowing to the smallest useful mode. Do not resolve an uncertain multi-mode prompt into a full bundle as a way to avoid asking; that produces the generic, unfocused output this section exists to prevent.

### The discriminator
- **`workflowMode`** — the public mode key (every mode): `interface`, `foundations`, `motion`, `audit`, `md-generator`, and the `design-mcp-open-design` transport.
- **`packetKind`** — `workflow` for the five design-judgment modes; `transport` for `design-mcp-open-design`, which bridges to an external tool's CLI/MCP surface and never performs design judgment itself.
- **`backendKind`** — which backend runs the mode: `reference-base` (the four doc-guidance modes cite the shared design reference base), `playwright-extract` (`md-generator` runs its embedded Playwright CSS-extraction pipeline), or `od-cli-transport` (the `design-mcp-open-design` transport drives the external Open Design `od` CLI / stdio MCP server).

### Routing rule
```
classify the request to a workflowMode (dominant design intent; mode hint like "motion: ..." overrides)
read mode-registry.json
  → resolve workflowMode from the hint / classified intent
  → load the mode packet at registry[mode].packet (e.g. sk-design/design-interface/SKILL.md)
  → the mode cites the shared reference base, or runs its own backend per registry[mode].backendKind
```

### Intent-Router Resilience

This hub has simple intent-mode routing, not keyed resource discovery: it selects one or more mode packet folders from `mode-registry.json`. There is no root `references/<key>/` or `assets/<key>/` resource map for the hub; mode packets and `shared/` own their own references and assets. Keep the router resilient without replacing it with the keyed-resource router:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
REGISTRY_PATH = SKILL_ROOT / "mode-registry.json"
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the design goal and artifact surface",
    "Confirm whether the request asks to create, guide, animate, audit, or extract",
    "Provide one concrete input such as a file, URL, screenshot, or acceptance criterion",
    "Confirm the proof expected before a ready claim",
]

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.name != "SKILL.md":
        raise ValueError(f"Only mode packet SKILL.md files are hub-routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def resolve_mode_packet(mode: str, intent_confidence: float):
    if intent_confidence < 0.5:
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": [],
        }

    if not REGISTRY_PATH.exists():
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "notice": "mode-registry.json is unavailable; ask for route confirmation before loading a mode packet",
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": [],
        }

    registry = read_json(REGISTRY_PATH)
    modes_by_key = {entry["workflowMode"]: entry for entry in registry.get("modes", [])}
    packet = modes_by_key.get(mode)
    if not packet:
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "notice": f"No sk-design mode registered for '{mode}'",
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": [],
        }

    skill_md = _guard_in_skill(f"{packet['packet']}/SKILL.md")
    if not (SKILL_ROOT / skill_md).exists():
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "notice": f"Registered mode packet is missing: {skill_md}",
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": [],
        }

    load(skill_md)
    return {"workflowMode": mode, "resources": [skill_md]}
```

Do not hardcode a file inventory of mode references/assets in the hub. If a future design workflow needs runtime-keyed resource folders, add them to the relevant mode packet and adapt that packet's router to the canonical discovery/guard/fallback pattern rather than loading raw paths here.

Intent classification favors the smallest useful mode. Default a generic "make this look good" prompt to **interface** unless the prompt is explicitly foundations (tokens/color/type/layout), motion (animation/transition), audit (critique/accessibility/slop), or md-generator (`DESIGN.md`/style-reference extraction). Pair modes only when the prompt has clearly separate design axes (e.g. interface + motion for a landing page with substantial choreography).

### Mode Vocabulary Guardrails

Treat hub identity terms such as `sk-design`, `design-family`, and `mode-registry` as family context, not as evidence for a child mode by themselves. Use these disambiguators when routing vocabulary overlaps:
- **interface** owns end-to-end visual direction and application verbs: make it look better, less generic, custom not templated, hero or landing-page direction, visual identity, and transform commands framed as "make it bolder/quieter/clearer".
- **foundations** owns static-system nouns: color, type, spacing, grid, layout rhythm, visual hierarchy, information hierarchy, responsive adaptation, and design-token system design. `tokens.json` and `DESIGN.md` as measured artifacts route to `md-generator`, not foundations, unless the prompt asks to design or adapt a token system. **Exception — transform-verb precedence**: when the prompt frames the request as a `make-it` transform using one of `mode-registry.json`'s `transformVerbRouting.aliasOnly` (`clarify`) or names a term in `transformVerbRouting.excludedAliases.foundations` (`typeset`, `colorize`), route to `interface` even when a static-system noun (hierarchy, typography, color) also appears in the same sentence — the alias/exclusion registry entry takes precedence over this noun-based guardrail, not the other way around.
- **motion** owns temporal behavior: animation, interaction states, hover/focus/active feedback, transitions, choreography, motion budget, reduced motion, and motion performance.
- **audit** owns evaluation frames: audit, review, critique, WCAG, quality score, AI-template risk, production hardening, and "should it be bolder/quieter/clearer" questions. A generic polish request routes here when the user asks for a review or release-readiness pass; accepted fixes can then be owner-mapped to siblings. **Exception — single-axis static review**: when a review/critique-framed request is scoped to exactly one static-system axis `foundations` owns (color, type, spacing, layout rhythm, information hierarchy) and that axis has its own procedure card with confirmed-versus-inferred proof-gate methodology, route to `foundations` alone even though the prompt uses "review" or asks what proof is needed before calling it "ready" — the axis-scoped procedure card owns its own proof discipline, so `audit` is not required to supply it. Route to `audit` (alone or bundled) when the request spans multiple axes, asks for an overall quality/readiness verdict across the surface, or names audit-specific frames (WCAG, quality score, AI-template risk, production hardening) that no single `foundations` procedure card covers. **Exception — transform-verb precedence**: when the prompt frames the request as a `should-it-be` transform naming a term in `transformVerbRouting.excludedAliases.audit` (`harden`, `polish`) without also asking for a findings-first audit report, route to `interface` even though "harden"/"polish" could otherwise read as a production-hardening evaluation frame — the alias/exclusion registry entry takes precedence over this evaluation-frame guardrail, mirroring the same precedence rule `foundations` already applies for `typeset`/`colorize`.
- **md-generator** owns measured extraction and fidelity artifacts: live-URL CSS capture, `tokens.json`, `DESIGN.md`, style reference, validation, reports, and source-of-truth provenance.

Keep these guardrails synchronized with `hub-router.json` `vocabularyClasses`/`routerSignals` and with the `aliases` / `transformVerbRouting` vocabulary in `mode-registry.json`; do not change registry structure or tool surfaces to resolve vocabulary ambiguity.

### Visible Plan Before Design or Build Work

Before producing substantial design direction, build-ready guidance, implementation handoff, or transport work, show a concise plan with:
- selected mode or ordered bundle, resolved from `mode-registry.json`;
- context loaded or still missing;
- intended design moves or audit dimensions;
- proof the result must provide before it can be called ready;
- handoff target when code implementation or external transport is needed.

For quick, narrow advice, the plan can be one sentence. For UI build or redesign work, make the plan explicit before the first design recommendation so the user can see the route and acceptance bar.

### Bundle Rule for Build/UI Work

For UI build work, page or component generation, and redesign implementation, auto-load the build bundle before design or implementation decisions: `interface`, `foundations`, `design-interface/assets/interface_preflight_card.md`, `shared/register.md`, `design-interface/references/design_process/brief_to_dials.md`, and the matching foundations axis references. Require a context manifest per `shared/context_loading_contract.md`, with `shared/assets/context_loaded_card.md` before recommendations and `shared/assets/proof_of_application_card.md` before any ready claim. Keep the smallest-useful-mode rule for narrow advice that does not produce, evaluate, or hand off a UI surface.

This bundle is declared machine-readably as the `ui-build-bundle` entry in `hub-router.json` `routerPolicy.bundleRules` (`whenAll: interface + foundations → orderedBundle`); the prose above remains the behavioral elaboration (resource specifics and manifest requirements).

Per-mode behavior is **not flattened**: each packet keeps its own design judgment, examples, standards, verification, and tool-permission needs. The four doc-guidance modes are read-and-guide; `md-generator` is the only mode that runs an extraction pipeline (Write/Edit/Bash over Playwright).

### Proof Gates and Verifier Cadence

The hub names proof requirements; the selected mode supplies the detailed evidence contract. Use these gates before a ready/completion claim:
- **Taste proof**: cite the mode's design rationale and the concrete visual decisions made against the user's context.
- **Accessibility proof**: route contrast, semantics, reduced-motion, and usability concerns to the relevant mode packet; do not let transport output stand in for critique.
- **Responsive proof**: name the viewport/state coverage expected for the surface, or state why the current request is advisory-only.
- **Transport proof**: when Figma, Open Design, browser, or extraction tools are involved, report only what the transport actually did and keep design acceptance in `sk-design`.

If a required proof field is missing, contradictory, or only supplied by transport mechanics, pause the ready claim and route the gap back to the selected mode or to `audit`. The hub names the missing proof; it does not invent a new verifier or bypass the mode packet's evidence contract.

Verifier cadence is: intake before routing, visible plan before substantial design/build output, proof review before ready claims, and `sk-code` review/verification after implementation handoff. The four read-only modes must meet their proof obligations with Read/Glob/Grep evidence, loaded references, and user-provided artifacts only; they must not require Write, Edit, or Bash. `md-generator` may use its extraction pipeline because the registry marks it as the only mutating mode.

---

## 3. HOW IT WORKS

### Layout
```
sk-design/
  SKILL.md               # this routing hub (no per-mode design logic)
  mode-registry.json     # the discriminator + advisorRouting (single source of truth)
  graph-metadata.json    # the ONE advisor identity for the whole skill
  shared/                # shared design reference base the hub + modes cite
  design-interface/  design-foundations/  design-motion/  design-audit/  design-md-generator/   # five design mode packets
  design-mcp-open-design/  # nested transport packet (packetKind: "transport")
```

Each mode packet is self-contained (its own `SKILL.md`, `references/`, `assets/`, and `md-generator`'s extraction backend), with internal paths repointed and **no per-packet `graph-metadata.json`** — only this hub carries one, so the advisor discovers exactly one skill. The hub references those packet paths directly.

### Backend
The four doc-guidance modes (interface, foundations, motion, audit) consume the shared **design reference base** under `shared/` — `anti_slop_principles.md`, `cognitive_laws.md`, `design_token_vocabulary.md` — so anti-slop critique, design-token vocabulary, and cognitive-law rationale stay consistent across modes without duplication. The `md-generator` mode consumes its own embedded Playwright extraction backend instead. The reference base provides shared vocabulary; it must never gain per-mode workflow logic.

---

## 4. RULES

### ✅ ALWAYS
- **ALWAYS** resolve a mode through `mode-registry.json`; never hardcode a router mapping in the hub.
- **ALWAYS** gather context before routing when missing facts could change the selected mode or acceptance bar.
- **ALWAYS** make the route and proof plan visible before substantial design, build, or transport work.
- **ALWAYS** keep each mode's design judgment, examples, and verification in its packet — the hub stays logic-free.
- **ALWAYS** keep exactly one `graph-metadata.json` (this hub's) so the advisor sees one skill identity.
- **ALWAYS** give every mode an `advisorRouting` block with a valid `routingClass` and `packetSkillName`.
- **ALWAYS** route a generic design prompt to the smallest useful mode; default to `interface` when no other axis dominates.
- **ALWAYS** route evidence requirements to the existing modes and consumers instead of inventing hub-local verification logic.

### ⛔ NEVER
- **NEVER** add a `graph-metadata.json` or a discoverable skill marker inside a mode packet or the shared reference base.
- **NEVER** embed per-mode design instructions in this hub — that content lives in the packets.
- **NEVER** add public micro-skill identities or a public mirror of another design skill family; preserve the single `sk-design` advisor identity.
- **NEVER** require Write, Edit, or Bash for the four read-only advisory modes; their tool surface is Read/Glob/Grep only.
- **NEVER** treat `mcp-figma` or `design-mcp-open-design` as taste or critique authority; they are transports loaded after the design mode is chosen.
- **NEVER** route pure code, backend, or data work through the design family.

### ⚠️ ESCALATE IF
- A new design mode is needed — extend `mode-registry.json` and open a packet; do not bolt logic onto the hub.
- A named mode conflicts with the request's actual intent, or the prompt spans more than three design axes needing an explicit workflow order.
- Brand, accessibility, or production constraints make the requested visual direction unsafe or contradictory.

---

## 5. REFERENCES

- Shared reference base: `shared/anti_slop_principles.md`, `shared/cognitive_laws.md`, `shared/design_token_vocabulary.md` (cited by every doc-guidance mode).
- Mode packets: `design-interface/SKILL.md`, `design-foundations/SKILL.md`, `design-motion/SKILL.md`, `design-audit/SKILL.md`, `design-md-generator/SKILL.md` (per-mode detail); `design-mcp-open-design/SKILL.md` (nested transport packet, `packetKind: "transport"`).
- Registry: `mode-registry.json` (the routing contract).
- Implementation handoff: `sk-code` consumes the design output; its code-review mode can audit it after build.

---

## 6. SUCCESS CRITERIA

- The hub resolves one primary mode for the request (or a small set only for clearly separate axes).
- The selected mode packet owns the detailed design workflow; the hub stayed routing-only.
- Intake, visible plan, proof expectations, and verifier cadence are visible before ready claims.
- The shared reference base is used only for common vocabulary and cross-mode consistency.
- Exactly one `graph-metadata.json` exists for the whole skill; no packet carries its own.

---

## 7. INTEGRATION POINTS

### Modes
- `interface` — direction, distinctive UI build judgment, interface writing.
- `foundations` — color, typography, layout, responsive systems, tokens.
- `motion` — animation, transitions, micro-interactions, temporal feel.
- `audit` — accessibility, performance, critique, hardening, production readiness.
- `md-generator` — `DESIGN.md` / style-reference extraction other skills consume.

### Transports and Consumers
- `mcp-figma` (external sibling skill) and `design-mcp-open-design` (nested transport packet, resolved through this hub's own `mode-registry.json`) are transports. Use them after the design mode is chosen, with the user-visible plan naming what the transport will do.
- Transports can fetch, inspect, generate, extract, or apply artifacts; they do not decide whether the design is tasteful, accessible, responsive, or production-ready. Treat transport output as evidence to inspect, not as acceptance.
- `sk-design` owns design judgment and proof expectations. When transport evidence is needed, bring it back into the selected design mode or audit mode for acceptance.
- If transport output conflicts with the visible proof plan, resolve acceptance through the selected design mode or audit mode before implementation or ready claims.
- `sk-code` consumes design output and implements it in the detected code surface after the design plan and proof expectations are clear.
- `sk-code`'s code-review mode can audit implementation quality after design and build work converge; use it as the implementation verifier, not as a replacement for design taste.

---

## 8. RELATED RESOURCES

- Pattern: `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md` (parent-skill hub + nested packets, the one-graph-metadata invariant).
- Canonical example: `.opencode/skills/system-deep-loop/` (hub + `mode-registry.json` + mode packets).
- Registry: `mode-registry.json` (this hub's routing contract).
