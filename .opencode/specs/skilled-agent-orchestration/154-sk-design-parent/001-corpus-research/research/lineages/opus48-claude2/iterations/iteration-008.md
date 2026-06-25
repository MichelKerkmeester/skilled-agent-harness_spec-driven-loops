# Iteration 8: The family already exists — local convention, coupling asymmetry, and compat constraints

## Focus
Read the two existing skills (sk-design-interface, sk-design-md-generator) to ground the structural recommendation in local convention and open KQ7 (onboarding/backward-compat).

## Findings

### F31 — The `sk-design-*` family ALREADY exists as cross-referencing siblings, with no parent yet
`sk-design-md-generator` states: "**Family boundary.** This skill is the **extraction and format-fidelity engine** of the `sk-design-*` family. It captures what already exists. Sibling `sk-design-interface` invents **new** distinctive direction." It refers to "Sibling `sk-design-interface`" repeatedly and defines a clean division of labor (capture vs create) around the shared `DESIGN.md` artifact. So the family is real and named today; phase 154 adds the missing *parent/identity layer* over siblings that already coordinate. This favors an **umbrella over an existing sibling family** as the lowest-disruption structure. [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:14], [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:400]

### F32 — COUPLING ASYMMETRY: the two siblings share only an artifact, not a runtime
- `sk-design-interface` (v1.5.0.0): pure judgment — references only (`design_principles.md`, quality floor, variation diversity, real-UI loop), `allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]`, optional MCP refs (Mobbin/Refero). No heavy runtime. [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:1-16]
- `sk-design-md-generator` (v1.0.0.0): a heavy **embedded TypeScript/Playwright backend** (20 TS modules under `backend/scripts/`, `npx playwright install chromium`, deterministic formatters, validators). [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:206-294], [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:423]
- They couple ONLY through the `DESIGN.md` v3 Style Reference contract (md-generator produces it; interface + sk-code consume it). [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:398-402]
→ Low runtime coupling + very different toolchains is a strong signal AGAINST folding md-generator into a single co-loaded hub, and FOR keeping it a lazily-loaded sibling. The impeccable verb-family (iter 4/6/7) is the opposite — tightly coupled, shared base — and suits a hub *internally* within the interface sibling.

### F33 — Backward-compat constraint: both skill names are referenced across the repo
`sk-design-interface` is named as a related skill by `sk-code`, `sk-code-review`, `mcp-figma`, `mcp-open-design`, and the root CLAUDE.md routing tables; `sk-design-md-generator` names `sk-design-interface`, `sk-code`, the transports, and `system-spec-kit`. Renaming either to a nested path (e.g. `sk-design/interface`) would break advisor metadata, skill-graph edges, and these cross-references. Onboarding MUST preserve the existing invocable identities or ship aliases + an advisor/skill-graph rebuild. [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:196-202], [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:398-402]

### F34 — Two local parent precedents bracket the choice: create:sk-skill-parent (hub) vs deep-loop-workflows / sk-code (router)
- `create:sk-skill-parent`: "Scaffold a parent skill with nested mode packets (one hub identity, registry source of truth)" → the HUB scaffold convention. [SOURCE: skill registry: create:sk-skill-parent]
- `deep-loop-workflows`: "routes a request to one of five modes… over the shared deep-loop-runtime backend. Holds no per-mode logic — it dispatches by workflowMode through mode-registry.json" → an UMBRELLA/ROUTER with a registry + shared runtime. [SOURCE: skill registry: deep-loop-workflows]
- `sk-code`: "Smart router auto-detects the active surface and loads matching code patterns" → a smart-ROUTER parent. [SOURCE: skill registry: sk-code]
→ The repo natively supports BOTH a hub parent and a router/umbrella parent; the existing-siblings + coupling-asymmetry evidence (F31/F32) points sk-design toward the deep-loop-workflows/sk-code **router-umbrella** shape, with hub-style structure used *inside* the interface child.

### F35 — sk-design-interface already contains a brainstorm-critique-build process + quality floor + writing — it is the flagship child, near-complete
Its STEP 0–4 two-pass process (ground subject → brainstorm token system → critique vs AI defaults → build → self-critique), quality floor (responsive/focus/reduced-motion), variation-diversity debias, real-UI loop, and interface writing rules already cover the interface/taste domain the corpus's taste/impeccable docs describe. It needs *augmentation* (corpus rules, register split, slop test, mode commands), not replacement. [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:55-135], [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:151-167]

## Sources Consulted
- `.opencode/skills/sk-design-interface/SKILL.md` (full).
- `.opencode/skills/sk-design-md-generator/SKILL.md` (full).
- Skill registry descriptions for `create:sk-skill-parent`, `deep-loop-workflows`, `sk-code`.

## Assessment
- **newInfoRatio: 0.5** — The already-existing self-identified family (F31), the runtime coupling asymmetry (F32), the cross-repo name-reference compat constraint (F33), and the two local parent precedents (F34) are all new and decisive for KQ6/KQ7; the interface skill's process overlapped the taste/impeccable content.
- **Novelty justification:** Reframes the structural question with local ground truth — the siblings exist, couple loosely, and are referenced by name — which tips KQ6 toward a router-umbrella and defines the KQ7 compat work.
- **Confidence:** High — direct reads of both SKILL.md files; registry descriptions quoted.

## Reflection
- **Worked:** Reading the existing skills revealed the family is already real (not greenfield), changing the question from "design a family" to "add a parent over loosely-coupled siblings without breaking references."
- **Insight:** Coupling is heterogeneous — tight inside the impeccable verb-set, loose between interface and md-generator. The structure should be hub-inside-children, umbrella-across-children.
- **Ruled out:** Folding md-generator into a co-loaded hub — its Playwright backend and low coupling make it a sibling, not a nested mode packet.
- **Ruled out:** Renaming the existing skills without aliases — breaks cross-repo references and advisor/skill-graph metadata.

## Recommended Next Focus
Iteration 9: Survey the remaining unread corpus (frontend-slides, slidev, canvas-design, morphing-icons, design-lab, redesign, emil-design-eng, bencium, gpt-taste, the process docs) to confirm coverage, finalize what is in-scope vs adjacent, and complete the source→child assignment (KQ5).
