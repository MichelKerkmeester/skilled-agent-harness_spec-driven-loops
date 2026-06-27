---
name: sk-design
description: "Distinctive, intentional UI design and the full design surface: visual direction, taste, and build for interfaces; color, typography, layout, spacing, hierarchy, and design tokens; animation, transitions, and micro-interactions; accessibility, performance, responsive, theming, and anti-slop design audit with quality scoring; and live-website CSS to Style Reference DESIGN.md extraction. Use to make a UI look custom and polished rather than templated, design a visual system, choreograph motion, audit and harden design quality, or extract a real design system from a live site. The single advisor-routable design skill: it routes to five modes (interface, foundations, motion, audit, md-generator) via mode-registry.json, and each mode holds its own design logic."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.3
metadata:
  author: OpenCode
  family: sk-code
---

<!-- Keywords: sk-design, design-family, mode-registry, workflowmode, backendkind, reference-base, anti-slop, design-tokens, cognitive-laws, interface-design, frontend-design, visual-design, visual-identity, make-it-look-good, looks-templated, redesign-the-ui, hero-section, ui-build, typography, palette, color-palette, font-pairing, ux-quality-checklist, design-variations, foundations, color-system, oklch, color-token-system, dark-mode, typography-scale, spacing-system, responsive-layout, layout, hierarchy, grid, themes, motion-design, animation, animate-this, transitions, micro-interactions, framer-motion, animatepresence, exit-animation, reduced-motion, morphing-icons, motion-performance, design-audit, ui-critique, accessibility-audit, performance-audit, anti-slop-detection, production-hardening, design-quality-score, P0-P1-design-findings, polish, theming, design.md, design-md, css-extraction, website-design-extraction, design-reference, tokens.json, playwright, design-to-markdown, design-system-generator, css-tokens, color-extraction, typography-extraction, hex-extraction, shadow-extraction, spacing-extraction, design-fidelity, anti-hallucination, extract-design-system, generate-design-md, capture-website-css, design-tokens-from-url, distinctive-interface, intentional-design, polished-ui, refined-ui, custom-not-templated, premium-ui, aesthetic, design-taste, visual-direction, craft, make-it-beautiful, less-generic, redesign-distinctive, smooth-animation, hover-effect, scroll-animation, choreography, interaction-feel, animate-the-menu, transition-design, design-audit, accessibility-audit, design-quality-audit, design-review, design-qa, audit-the-design, review-the-ui, wcag-contrast, ui-quality-review -->

# Design Family Hub (sk-design)

One skill, five design modes, one shared reference base. `sk-design` is the public, advisor-routable home for every design persona; the shared design reference base (anti-slop principles, cognitive laws, design-token vocabulary) is the common vocabulary the modes cite. This hub holds NO per-mode design logic — each mode keeps its own contract in its packet, and the hub only routes by `workflowMode` through `mode-registry.json`.

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

### When NOT to Use
- A single quick read/edit with no design judgment — use the relevant skill directly.
- Pure implementation after design direction is settled — hand off to `sk-code`.
- A design transport only (Figma, Open Design) — load the design judgment via this hub first, then use the transport. The transport is never the taste authority.
- The shared reference base itself — it is the vocabulary the modes cite, not a user workflow.

---

## 2. SMART ROUTING

Routing is **registry-driven**. `mode-registry.json` is the single source of truth; the hub reads it and does not re-derive the mapping. The advisor routes any design query to the single identity `sk-design`; the hub then picks the mode.

### The discriminator
- **`workflowMode`** — the public mode key (every mode): `interface`, `foundations`, `motion`, `audit`, `md-generator`.
- **`backendKind`** — which backend runs the mode: `reference-base` (the four doc-guidance modes cite the shared design reference base) or `playwright-extract` (`md-generator` runs its embedded Playwright CSS-extraction pipeline).

### Routing rule
```
classify the request to a workflowMode (dominant design intent; mode hint like "motion: ..." overrides)
read mode-registry.json
  → resolve workflowMode from the hint / classified intent
  → load the mode packet at registry[mode].packet (e.g. sk-design/design-interface/SKILL.md)
  → the mode cites the shared reference base, or runs its own backend per registry[mode].backendKind
```

Intent classification favors the smallest useful mode. Default a generic "make this look good" prompt to **interface** unless the prompt is explicitly foundations (tokens/color/type/layout), motion (animation/transition), audit (critique/accessibility/slop), or md-generator (`DESIGN.md`/style-reference extraction). Pair modes only when the prompt has clearly separate design axes (e.g. interface + motion for a landing page with substantial choreography).

### Bundle Rule for Build/UI Work

For UI build work, page or component generation, and redesign implementation, auto-load the build bundle before design or implementation decisions: `interface`, `foundations`, `design-interface/assets/interface_preflight_card.md`, `shared/register.md`, `design-interface/references/design-process/brief_to_dials.md`, and the matching foundations axis references. Require a context manifest per `shared/context_loading_contract.md`, with `shared/assets/context_loaded_card.md` before recommendations and `shared/assets/proof_of_application_card.md` before any ready claim. Keep the smallest-useful-mode rule for narrow advice that does not produce, evaluate, or hand off a UI surface.

Per-mode behavior is **not flattened**: each packet keeps its own design judgment, examples, standards, verification, and tool-permission needs. The four doc-guidance modes are read-and-guide; `md-generator` is the only mode that runs an extraction pipeline (Write/Edit/Bash over Playwright).

---

## 3. HOW IT WORKS

### Layout
```
sk-design/
  SKILL.md               # this routing hub (no per-mode design logic)
  mode-registry.json     # the discriminator + advisorRouting (single source of truth)
  graph-metadata.json    # the ONE advisor identity for the whole skill
  shared/                # shared design reference base the hub + modes cite
  design-interface/  design-foundations/  design-motion/  design-audit/  design-md-generator/   # five mode packets
```

Each mode packet is self-contained (its own `SKILL.md`, `references/`, `assets/`, and `md-generator`'s extraction backend), with internal paths repointed and **no per-packet `graph-metadata.json`** — only this hub carries one, so the advisor discovers exactly one skill. The mode packet folders are created when the flat skills move under the hub; the hub references those packet paths now.

### Backend
The four doc-guidance modes (interface, foundations, motion, audit) consume the shared **design reference base** under `shared/` — `anti_slop_principles.md`, `cognitive_laws.md`, `design_token_vocabulary.md` — so anti-slop critique, design-token vocabulary, and cognitive-law rationale stay consistent across modes without duplication. The `md-generator` mode consumes its own embedded Playwright extraction backend instead. The reference base provides shared vocabulary; it must never gain per-mode workflow logic.

---

## 4. RULES

### ALWAYS
- **ALWAYS** resolve a mode through `mode-registry.json`; never hardcode a router mapping in the hub.
- **ALWAYS** keep each mode's design judgment, examples, and verification in its packet — the hub stays logic-free.
- **ALWAYS** keep exactly one `graph-metadata.json` (this hub's) so the advisor sees one skill identity.
- **ALWAYS** give every mode an `advisorRouting` block with a valid `routingClass` and `packetSkillName`.
- **ALWAYS** route a generic design prompt to the smallest useful mode; default to `interface` when no other axis dominates.

### NEVER
- **NEVER** add a `graph-metadata.json` or a discoverable skill marker inside a mode packet or the shared reference base.
- **NEVER** embed per-mode design instructions in this hub — that content lives in the packets.
- **NEVER** treat `mcp-figma` or `mcp-open-design` as taste or critique authority; they are transports loaded after the design mode is chosen.
- **NEVER** route pure code, backend, or data work through the design family.

### ESCALATE IF
- A new design mode is needed — extend `mode-registry.json` and open a packet; do not bolt logic onto the hub.
- A named mode conflicts with the request's actual intent, or the prompt spans more than three design axes needing an explicit workflow order.
- Brand, accessibility, or production constraints make the requested visual direction unsafe or contradictory.

---

## 5. REFERENCES

- Shared reference base: `shared/anti_slop_principles.md`, `shared/cognitive_laws.md`, `shared/design_token_vocabulary.md` (cited by every doc-guidance mode).
- Mode packets: `design-interface/SKILL.md`, `design-foundations/SKILL.md`, `design-motion/SKILL.md`, `design-audit/SKILL.md`, `design-md-generator/SKILL.md` (per-mode detail).
- Registry: `mode-registry.json` (the routing contract).
- Implementation handoff: `sk-code` consumes the design output; `sk-code-review` can audit it after build.

---

## 6. SUCCESS CRITERIA

- The hub resolves one primary mode for the request (or a small set only for clearly separate axes).
- The selected mode packet owns the detailed design workflow; the hub stayed routing-only.
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
- `mcp-figma` and `mcp-open-design` are transports. Use them after the design mode is chosen.
- `sk-code` consumes design output and implements it in the detected code surface.
- `sk-code-review` can audit implementation quality after design and build work converge.

---

## 8. RELATED RESOURCES

- Pattern: `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md` (parent-skill hub + nested packets, the one-graph-metadata invariant).
- Canonical example: `.opencode/skills/deep-loop-workflows/` (hub + `mode-registry.json` + mode packets).
- Registry: `mode-registry.json` (this hub's routing contract).
