---
name: design-interface
description: Distinctive UI design: build/reshape interfaces with palette, typography, layout, motion, critique, and interface writing.
allowed-tools: [Read, Grep, Glob]
version: 1.0.1.0
metadata:
  author: Anthropic
  source: https://github.com/anthropics/skills/tree/main/skills/frontend-design
license: Apache-2.0; see LICENSE.txt
---

<!-- keywords: interface-design frontend-design visual-design typography palette ui-aesthetics -->

# Interface Design (interface)

Approach UI work as the design lead at a studio known for visual identities that could not be mistaken for anyone else's. Make deliberate, opinionated choices specific to the brief, take one justified aesthetic risk, and reject anything that reads as a templated default. Full guidance lives in [`references/design-process/design-principles.md`](references/design-process/design-principles.md). Vendored from Anthropic's `frontend-design` skill (Apache-2.0).

---

## 1. WHEN TO USE

### Activation Triggers

**Use when** the work involves:
- Building a new UI, page, component, or landing section from a brief.
- Reshaping or restyling an existing interface that feels generic or templated.
- Choosing palette, typography, layout, motion, or interface copy.
- Reviewing a design direction before code is written.
- Reading a brief into the register and the variance, motion, and density dials before any visual choice.
- Running the mechanical pre-flight gate over a built or planned surface before delivery, including the layout and content gates.

**Keyword Triggers**: "design", "make it look good", "redesign", "variation", "give me N variations", "show me options", "multiple directions", "hero section", "landing page", "looks templated", "looks AI-generated", "visual identity", "less generic", "custom not templated", "visual direction".

### When NOT to Use

**Skip this skill when:**
- The task is pure logic, data, or back-end work with no visual surface (use `sk-code`).
- A brief already fully pins the visual direction and only mechanical implementation remains (follow the brief, since this skill adds nothing).
- The work is documentation or prose, not interface (use `sk-doc`).

---

## 2. SMART ROUTING

### Primary Detection Signal

Detect design intent and how much of the visual direction the brief fixes:

Route here when the request asks to invent, apply, or reshape an interface direction, not merely to evaluate it. `hero section`, `landing page`, `less generic`, `custom not templated`, `visual direction`, and make-frame transform verbs such as "make it bolder", "make it quieter", "clarify this", or "delight the interaction" are interface evidence when they ask for a new direction. Once one of those transform verbs routes here, apply it through `references/design-process/transform-application.md` (the interface-side landing lane: shared application contract, per-verb ledgers, and fillable proof cards for bolder/quieter/distill/clarify/delight) rather than improvising the change. If the same prompt asks whether the design should change, requests a score, or frames the work as review/release readiness, route to `audit`. If `hierarchy`, `spacing`, `grid`, or token language is the main ask, route to `foundations`; if `DESIGN.md` or `tokens.json` is a measured artifact, route to `md-generator`. **Exception — transform-verb precedence**: `clarify` (`transformVerbRouting.aliasOnly`) always resolves here even when a static-system noun like "hierarchy" appears in the same sentence; `typeset`/`colorize` (`transformVerbRouting.excludedAliases.foundations`) never independently justify pulling `foundations` in as a bundled or supporting mode, even when the request's own wording ("typography and color application") echoes foundations' static-system vocabulary — the registry's alias/exclusion list overrides this noun-based heuristic.

```bash
# Direction freedom (pseudo)
# Test for a PINNED value, not a mention of the axis. "pick a palette" mentions
# the axis but leaves it free; "palette: #0a0a0a + amber" pins it.
echo "$BRIEF" | grep -qiE '(palette|font|typeface|color|layout|brand)\s*[:=]|use (the )?[#a-z0-9-]+ (palette|font|color)|in (our|the) brand' && AXIS_PINNED=high
# If a value is pinned -> follow it exactly on that axis. If axes are only named or left free -> apply the principles.
```

### Phase Detection

```text
DESIGN TASK
    |
    +- STEP 0: Ground the subject (name subject, audience, the page's one job)
    +- STEP 1: Brainstorm a token system (color, type, layout, signature)
    +- STEP 2: Critique the plan against AI-default looks, then revise and justify
    +- STEP 3: Build from the revised plan, deriving every choice from it
    +- STEP 4: Self-critique (screenshot, remove one accessory, check quality floor)
```

### Resource Loading Levels

| Level | When to Load | Resource |
| ----- | ------------ | -------- |
| ALWAYS | Any design task | `references/design-process/design-principles.md` (palette, type, structure, motion, restraint) |
| ALWAYS | The first step of any design task | `../shared/register.md` (Brand-vs-Product register) and `references/design-process/brief-to-dials.md` (Design Read intake to the dials). Load-and-prove loop is mandatory, not optional — full rationale: `references/design-process/resource-loading-notes.md` §1. |
| ALWAYS | Any design or UI build task | `../shared/context-loading-contract.md` (register-first gate, build bundle, context manifest, the four required proof fields, and hard gates). Citation required, not just a background load — full rationale: `references/design-process/resource-loading-notes.md` §2. |
| CONDITIONAL | A make-frame transform verb (bolder, quieter, distill, clarify, delight) already routed here | `references/design-process/transform-application.md` (shared application contract, per-verb ledgers, proof cards) |
| CONDITIONAL | Writing UI copy | Section 6 of `design_principles.md` (writing in design) |
| CONDITIONAL | Producing two or more design directions at once | `references/design-process/variation-diversity.md` (seed-of-thought debias so the directions are not N safe copies of the median) |
| CONDITIONAL | Verifying the quality floor / charts | `references/design-process/ux-quality-reference.md` (accessibility, motion, touch, responsive, forms, charts) |
| CONDITIONAL | Producing or iterating on real UI (repo recreation, code-bound, a generation run) | `references/design-process/real-ui-loop.md` (ground in a system, reuse before generating, fidelity check, handoff) and `../shared/sk-code-handoff.md` (required build manifest for sk-code) |
| CONDITIONAL | Final mechanical pass before shipping | `references/design-process/mechanical-defaults.md` (the layout gate) and `assets/interface-preflight-card.md` (the fill-in PASS or FAIL pre-flight card) |
| CONDITIONAL | Writing placeholder content, names, or numbers | `references/design-process/copy-and-mock-data.md` (realistic mock content, no lorem, no AI-tell copy) |
| CONDITIONAL | Redesigning an existing surface | `references/design-process/redesign-intake.md` (classify greenfield, preserve or overhaul, then protect URLs, nav labels, form fields, legal copy and locked tokens) |
| CONDITIONAL | Grounding a direction in the local styles corpus | `corpus/README.md` and `corpus/relational-exemplar.mjs` (one mode-selected anchor plus an optional bounded contrast or rejected default, with a decision-only handoff) |
| CONDITIONAL | Internal procedure support | `procedures/discovery-question-round.md`, `procedures/aesthetic-direction.md`, `procedures/wireframe-exploration.md`, `procedures/variation-set.md`, `procedures/prototype-flow-spec.md`, `procedures/deck-direction-spec.md`, and `../shared/procedures/polish-gate-orchestration.md` when the trigger matches |
| ON_DEMAND | Need a real design system to ground in, reuse, or name the default to deviate from | A real design system you own, read live and never copied. See `references/design-grounding/design-inventory.md` |
| ON_DEMAND | Naming a realized look in one line as the default to critique against | The illustrative cues in `references/aesthetics/` (brutalist, minimalist, soft, apple-bento). Critique-against only, never a chooser or preset — see `references/aesthetics/README.md` and Reference Loading Notes §3. |
| INITIATIVE / ASK | A convention-heavy category where naming the real-world default sharpens the deviation | A real shipped-UI reference via Mobbin (app/iOS) or Refero (web). Routes through Code Mode, one reference, never copied — full initiative/ask/fallback rule in ALWAYS #8 and `references/design-grounding/design-references-mcp.md`. |
| ON_DEMAND | Implementing in code | `sk-code` web-surface standards for the target stack |

The private procedure-card selection table in Section 3 is part of this routing contract: after the public `interface` mode is selected, choose at most one card from `procedures/` or `../shared/procedures/` and cite its relative path in the plan or proof line.

### Smart Router (parseable intent model)

The Resource Loading Levels table above is the human-readable view; the fenced block below is the machine-parseable router that drives deterministic routing and the skill-benchmark D5 connectivity gate. `INTENT_SIGNALS` scores the lowercased task by keyword, `RESOURCE_MAP` maps each intent to the in-skill references and assets it loads, and `DEFAULT_RESOURCE` is loaded on every design task. Routing semantics match the table one-for-one: the same references load for the same intents. The shared register (`../shared/register.md`) is loaded on every task via `DEFAULT_RESOURCE`. It lives in the parent skill's `shared/` dir, a sanctioned cross-packet location the D5 gate recognizes.

```python
# In-skill router for a design task. Substring-scored, ambiguity-aware: lowercase
# the task, sum each intent's weight per keyword hit, keep intents within the delta
# of the top score, then union DEFAULT_RESOURCE + RESOURCE_MAP[intent] for each.
# Every reference and asset on disk appears in at least one RESOURCE_MAP entry, so
# no on-disk guidance is unreachable; design_principles.md is also the default.
from pathlib import Path

DEFAULT_RESOURCE = ["references/design-process/design-principles.md", "../shared/register.md", "../shared/context-loading-contract.md"]

INTENT_SIGNALS = {
    "DESIGN_PRINCIPLES": {"weight": 4, "keywords": ["design", "redesign", "make it look good", "looks generic", "looks templated", "looks ai-generated", "visual identity", "distinctive", "palette", "typography", "type", "layout", "brainstorm", "critique", "deviate", "templated default", "hero section", "landing page"]},
    "REGISTER_DIALS": {"weight": 4, "keywords": ["register", "brand vs product", "posture", "dials", "variance", "motion dial", "density", "design read", "read the brief", "intake", "calibrate", "calibration"]},
    "VARIATION_DIVERSITY": {"weight": 4, "keywords": ["variation", "variations", "give me options", "multiple directions", "several directions", "show me options", "n directions", "two directions", "three directions", "diverse", "seed of thought", "debias"]},
    "UX_QUALITY": {"weight": 4, "keywords": ["quality floor", "accessibility", "accessible", "contrast", "focus", "keyboard", "reduced motion", "touch target", "responsive", "forms", "charts", "data visualization", "what fails"]},
    "REAL_UI_LOOP": {"weight": 4, "keywords": ["real ui", "real-ui loop", "reuse before generate", "existing design system", "registered component", "render fidelity", "dev server", "actually rendered", "matches the intent", "handoff", "screenshot the build"]},
    "MECHANICAL_PREFLIGHT": {"weight": 4, "keywords": ["mechanical", "pre-flight", "preflight", "pre flight", "preflight card", "ship or fix", "layout gate", "hero lines", "bento", "eyebrow", "button contrast", "section spacing", "before shipping", "before i ship"]},
    "COPY_MOCK_DATA": {"weight": 4, "keywords": ["copy", "mock data", "placeholder", "lorem", "ai-tell phrasing", "fake-precise", "fake precision", "copy register", "image seed", "names and numbers", "realistic content", "content tells"]},
    "REDESIGN_INTAKE": {"weight": 4, "keywords": ["redesign", "preserve", "overhaul", "greenfield", "existing surface", "existing interface", "do not surprise", "keep the nav", "keep urls", "locked tokens", "form fields", "legal copy"]},
    "REAL_SYSTEM_GROUNDING": {"weight": 4, "keywords": ["design system", "design inventory", "ground in a system", "existing design system", "our design system", "reuse-ground"]},
    "REAL_WORLD_REFERENCE": {"weight": 4, "keywords": ["mobbin", "refero", "real-world reference", "shipped ui", "critique against", "default to deviate from", "the cliche", "the usual look", "typical look"]},
    "AESTHETICS": {"weight": 3, "keywords": ["aesthetic", "brutalist", "minimalist", "soft ui", "apple bento", "name the look", "name a realized look", "realized default", "named default look", "vibe"]},
    "TRANSFORM_APPLICATION": {"weight": 4, "keywords": ["make it bolder", "make it quieter", "make it distill", "make it clarify", "make it delight", "bolder", "quieter", "distill", "clarify", "delight the interaction", "earned moment", "keep ledger", "remove ledger"]},
}

RESOURCE_MAP = {
    "DESIGN_PRINCIPLES": ["references/design-process/design-principles.md"],
    "TRANSFORM_APPLICATION": ["references/design-process/transform-application.md"],
    "REGISTER_DIALS": ["references/design-process/brief-to-dials.md"],
    "VARIATION_DIVERSITY": ["references/design-process/variation-diversity.md"],
    "UX_QUALITY": ["references/design-process/ux-quality-reference.md"],
    "REAL_UI_LOOP": ["references/design-process/real-ui-loop.md", "../shared/sk-code-handoff.md"],
    "MECHANICAL_PREFLIGHT": ["references/design-process/mechanical-defaults.md", "references/design-process/copy-and-mock-data.md", "references/design-process/brief-to-dials.md", "assets/interface-preflight-card.md"],
    "COPY_MOCK_DATA": ["references/design-process/copy-and-mock-data.md"],
    "REDESIGN_INTAKE": ["references/design-process/redesign-intake.md"],
    "REAL_SYSTEM_GROUNDING": ["references/design-grounding/design-inventory.md"],
    "REAL_WORLD_REFERENCE": ["references/design-grounding/design-references-mcp.md", "references/mcp-tooling/mobbin-tools.md", "references/mcp-tooling/refero-tools.md"],
    "AESTHETICS": ["references/aesthetics/README.md", "references/aesthetics/brutalist.md", "references/aesthetics/minimalist.md", "references/aesthetics/soft.md", "references/aesthetics/apple-bento.md"],
}

# Resilience guards (see ../../sk-doc/create-skill/assets/skill/skill_smart_router.md):
# runtime-discover what's actually on disk, guard every path inside the skill
# before loading it, and fall back to disambiguation instead of guessing.
SKILL_ROOT = Path(__file__).resolve().parent

def discover_markdown_resources() -> set[str]:
    bases = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
    return {p.relative_to(SKILL_ROOT).as_posix() for base in bases if base.exists() for p in base.rglob("*.md")}

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    shared_root = (SKILL_ROOT.parent / "shared").resolve()
    if not (resolved.is_relative_to(SKILL_ROOT) or resolved.is_relative_to(shared_root)):
        raise ValueError(f"Resource escapes the skill root: {relative_path}")
    return relative_path

UNKNOWN_FALLBACK = "Ask which request shape applies: pinned brief, free-axis direction, transform verb, or procedure trigger — do not guess a mode."

# Routing flow on top of the model above:
# 1) DEFAULT_RESOURCE (design_principles.md and the shared register) loads on every design task.
# 2) If the brief pins the visual direction, follow it verbatim and skip default-avoidance.
# 3) If axes are free, apply DESIGN_PRINCIPLES (subject, principles, process, restraint).
# 4) If two or more directions are requested, VARIATION_DIVERSITY runs the seed-of-thought debias.
# 5) If the task writes interface copy or mock data, COPY_MOCK_DATA gates the content.
# 6) Hand implementation to sk-code for the detected web surface; this skill owns the look, not the build.
```

---

## 3. HOW IT WORKS

### Register And Dials First

Before any visual choice, set the Brand-vs-Product posture from `../shared/register.md`, which gates density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity. Then read the brief into the VARIANCE, MOTION, and DENSITY dials with `references/design-process/brief-to-dials.md`, stated once in a one-line Design Read. The dials are internal calibration, never a chooser surfaced to the user.

### Procedure Card Selection

After the hub selects the public `interface` mode, choose at most one primary private procedure card and cite it by relative path in the plan or proof line. These cards support this mode; they are not public user-facing routes.

| Request shape | Procedure card | Proof to cite |
| --- | --- | --- |
| Missing material brief facts | `procedures/discovery-question-round.md` | The specific facts that would change direction, plus which minor decisions this mode will own. |
| Greenfield direction without a stronger brand/system | `procedures/aesthetic-direction.md` | The non-generic direction, the absent/source context, and axes needing sign-off. |
| Low-fidelity structure or storyboard | `procedures/wireframe-exploration.md` | Structurally distinct options, each with its test question and recommendation. |
| Multiple high-fidelity directions or alternatives | `procedures/variation-set.md` | Meaningful variation axes and the recommended option. |
| Prototype, demo, or stateful interaction brief | `procedures/prototype-flow-spec.md` | Screens, state model, interaction matrix, feedback states, and handoff constraints. |
| Slide deck or presentation design | `procedures/deck-direction-spec.md` | Slide system, layout types, contrast/body-size expectations, and implementation handoff. |
| Final polish across dimensions | `../shared/procedures/polish-gate-orchestration.md` | Consolidated blockers, quality issues, polish notes, and owner mapping. |

If no procedure card matches, state `Procedure applied: none - baseline interface workflow` and continue with the core register, dials, two-pass process, and pre-flight card. Do not load all cards by default; select from request triggers and available context.

### Context, Proof, And Direct Fallback

Context basis before recommendations: public mode `interface`, loaded references, selected procedure card or no-procedure fallback, target surface, audience, pinned axes, constraints, missing facts. Proof line before any ready/handoff claim: selected procedure card, loaded evidence, pre-flight result, unresolved risks.

Run directly with Read, Glob, and Grep only. If subagents are unavailable or disallowed, do not dispatch — do the same card selection, context capture, and proof checks in the current session, same proof bar, no Write/Edit/Bash/Task.

### The Two-Pass Process

The five-step flow (ground, brainstorm a token system, critique against the brief, build from the revised plan, self-critique) is diagrammed once already, in Phase Detection (Section 2) — not repeated here. Calibration matters: current AI design clusters around three default looks (cream + serif + terracotta, near-black + one acid accent, broadsheet with hairline rules). They are defaults, not choices. When the brief frees an axis, do not spend it on one of these. The full step detail, calibration, and writing rules are in [`references/design-process/design-principles.md`](references/design-process/design-principles.md).

### Corpus Relational Exemplar Pilot

The corpus path is optional grounding after the brief, owned system, register and dials are resolved. `corpus/relational-exemplar.mjs` validates the neutral shared context plan, queries the styles engine, and accepts one mode-selected coherent anchor plus at most one bounded contrast or rejected default. The anchor may be hydrated for relationship and rationale evidence; the secondary source stays bounded. `no-fit`, corpus unavailability and an absent secondary are valid outcomes and never force a weak source.

The authority order is fixed: user brief and owned system, selected-mode judgment, target evidence and deterministic checks, corpus reference evidence, then transport output. Corpus evidence can explain relationships, expose counterexamples, sharpen critique and preserve provenance. It cannot select this mode, override the target render or preflight, prove accessibility or performance, assign audit severity, establish copying, authorize exact reuse or accept transport output.

The relational exemplar records target-owned preserve, transform or reject decisions and the counterfactual no-corpus default that changed. Its handoff is decision-only: decisions, source identity and provenance, transformation and fallback state, proof state and authority-preservation locks. Raw hydrated prose, token values, source assets and screenshots never cross the handoff. Values are never averaged.

The mode itself remains Read/Glob/Grep-only. Execution belongs to a Bash-capable
`sk-code` OpenCode runtime consumer: that consumer imports
`corpus/relational-exemplar.mjs`, calls `buildRelationalExemplar()` with the
closed typed request envelope, and returns the validated JSON result to this
mode. The consumer is transport, not design authority; it cannot add decisions,
change authority locks, or expose hydrated bodies. The Node test harness imports
and executes the same public function, proving the runtime seam is reachable
without granting this mode Bash.

### Quality Floor

Build to it without announcing it: responsive down to mobile, visible keyboard focus, and reduced motion respected. Do most of the planning and iteration in thinking, and show the user ideas only at higher confidence.

### Mechanical Delivery Gates

A taste read misses structural and content tells, so two binary gates run before delivery: the layout gate (`references/design-process/mechanical-defaults.md` — hero lines, bento cells, eyebrow ceiling, button contrast) and the content gate (`references/design-process/copy-and-mock-data.md` — lorem, AI-tell phrasing, fake-precise numbers, mixed copy register, lazy image seeds). The fill-in `assets/interface-preflight-card.md` is the checkable form of both plus the dials: every box is binary, and a single fail means the surface is not done.

### Required sk-code Build Manifest

When interface hands a built or specified UI to `sk-code`, emit the shared handoff envelope from `../shared/sk-code-handoff.md`. The interface-owned fields are required: `WHAT`, locked tokens and values, signature moves, motion budget, reuse list, open risks with verification, and `NEVER-CHANGE` constraints. Include URLs, nav labels, form field names, legal copy and any brief-pinned values when they must remain untouched.

---

## 4. RULES

### ✅ ALWAYS

1. **ALWAYS ground the design in the subject** before choosing anything. Name the subject, audience, and the page's single job, then draw distinctive choices from the subject's own world.
2. **ALWAYS make deliberate, brief-specific choices** for palette, typography, layout, and motion, and take one justifiable aesthetic risk.
3. **ALWAYS load all three `DEFAULT_RESOURCE` files before any recommendation, not just `design_principles.md` and `register.md`**: `../shared/context-loading-contract.md` is DEFAULT_RESOURCE too, not conditional — skipping it is a FAIL condition on its own, independent of whether the recommendation itself is otherwise sound.
4. **ALWAYS critique the plan against the AI-default looks** before writing code, and revise anything generic with a stated reason.
5. **ALWAYS treat copy as design material**, with active voice, end-user vocabulary, and consistent action names across a flow.
6. **ALWAYS meet the quality floor**: responsive, visible focus, reduced-motion respected.
7. **ALWAYS debias multiple directions with the seed of thought** from `references/design-process/variation-diversity.md` when a brief asks for two or more: a committed seed picks a non-median start in the grounded option space and the rest are spread to be genuinely distinct, each still grounded and critiqued. Never surface it as a style chooser.
8. **ALWAYS decide, at the critique step, whether a real-world reference would sharpen the default to deviate from.** Take the initiative to pull ONE Mobbin or Refero reference when the brief sits in a convention-heavy category and a subscription is connected; otherwise ask the user first; otherwise fall back to the generic anti-default process. Mobbin for app/iOS surfaces, Refero for web pages and visual style. One reference, read live, never copied, never a chooser. Mobbin and Refero are Code Mode (UTCP) manuals, not tools in this skill's `allowed-tools`, so co-load `mcp-code-mode` and route the lookup through it — Refero specifically runs as the `mcp-refero` transport over `mcp-code-mode` (the transport never decides taste); if Code Mode is unavailable, fall back to the generic process. See `references/design-grounding/design-references-mcp.md`.
9. **ALWAYS cite the selected procedure card or the no-procedure fallback** before substantial output when a private procedure trigger matches.
10. **ALWAYS keep corpus grounding subordinate to the brief, owned system, target render and preflight**, and preserve provenance and rights state for every selected reference.

### ⛔ NEVER

1. **NEVER ship a templated default** (cream + serif + terracotta, near-black + one acid accent, or broadsheet hairlines) on a free axis just because it is safe.
2. **NEVER add decoration that does not serve the brief**, including numbered markers (01 / 02 / 03) when the content is not actually a sequence.
3. **NEVER let motion pile up**. Scattered animation reads as AI-generated, so prefer one orchestrated moment.
4. **NEVER override a brief that pins the direction**. The brief's own words always win, even when they ask for a default look.
5. **NEVER average source token values, copy source-specific literals or assets, expose hydrated corpus bodies, or treat corpus rank as mode judgment.**

### ⚠️ ESCALATE IF

1. **ESCALATE IF the brief is too thin to ground** and you cannot reasonably pin the subject, audience, or page job yourself. State your assumed direction and confirm.
2. **ESCALATE IF the requested direction conflicts with brand or accessibility** (for example a palette that fails contrast). Surface the trade-off before building.

---

## 5. REFERENCES

### Core References

Full descriptions for every file below live in its own frontmatter and body; this index states only the routing-relevant fact (why it's cited from here, or when to consult it).

- [`references/design-process/design-principles.md`](references/design-process/design-principles.md) - Grounding, principles, the two-pass process, AI-default calibration, restraint, self-critique, interface writing. The default-loaded authority.
- [`references/design-process/ux-quality-reference.md`](references/design-process/ux-quality-reference.md) - The objective quality-floor pass/fail gate. Apply after the direction is set.
- [`references/design-grounding/design-inventory.md`](references/design-grounding/design-inventory.md) - Using a real design system as reuse-ground or named default to critique against. Never a chooser.
- [`references/design-grounding/design-references-mcp.md`](references/design-grounding/design-references-mcp.md) - Reading real-world shipped UI live via Mobbin/Refero to name and deviate from the category default. One reference, never copied, never a chooser.
- [`references/mcp-tooling/mobbin-tools.md`](references/mcp-tooling/mobbin-tools.md) - Mobbin MCP tool catalog: arguments, Code Mode call convention, result shape, troubleshooting.
- [`references/mcp-tooling/refero-tools.md`](references/mcp-tooling/refero-tools.md) - Pointer to the canonical `mcp-refero` transport packet (mcp-tooling hub) plus the judgment-side styles-first framing that stays here.
- [`references/design-process/variation-diversity.md`](references/design-process/variation-diversity.md) - Seed-of-thought debias for two-or-more directions. Consult only when multiple directions are requested.
- [`references/design-process/real-ui-loop.md`](references/design-process/real-ui-loop.md) - Ground in a system, reuse before generating, render-fidelity check, clean handoff. Consult when producing or iterating on real UI.
- [`../shared/sk-code-handoff.md`](../shared/sk-code-handoff.md) - Shared sk-code handoff envelope; the required build manifest for real UI handoff.
- [`../shared/register.md`](../shared/register.md) - The Brand-vs-Product operating register. Set it first; it gates density, motion, color dosage, copy, anti-slop strictness.
- [`references/design-process/brief-to-dials.md`](references/design-process/brief-to-dials.md) - Design Read intake mapping the variance/motion/density dials to choices. Consult at task start.
- [`references/design-process/mechanical-defaults.md`](references/design-process/mechanical-defaults.md) - The mechanical anti-default layout gate. Authored once here, referenced by the audit mode.
- [`references/design-process/copy-and-mock-data.md`](references/design-process/copy-and-mock-data.md) - The content gate for realistic mock data and copy. Authored once here, referenced by the audit mode.
- [`references/design-process/redesign-intake.md`](references/design-process/redesign-intake.md) - Redesign intake: greenfield/preserve/overhaul classification plus approval-gated never-silently-change items.
- [`references/design-process/transform-application.md`](references/design-process/transform-application.md) - Interface-side landing lane for a make-frame transform verb already routed here: application contract, per-verb ledgers, proof cards.
- [`references/design-process/resource-loading-notes.md`](references/design-process/resource-loading-notes.md) - Extended rationale for the load-and-prove and citation-required table rows, plus reference-loading discipline notes.
- [`assets/interface-preflight-card.md`](assets/interface-preflight-card.md) - The fill-in PASS/FAIL mechanical pre-flight card. Run before shipping.
- [`corpus/README.md`](corpus/README.md) - Maintainer-only relational-exemplar contract, positive/no-fit/rejected-default fixture atlas, and verification command.
- [`procedures/discovery-question-round.md`](procedures/discovery-question-round.md) - Private question-round support for under-specified briefs.
- [`procedures/aesthetic-direction.md`](procedures/aesthetic-direction.md) - Private direction-setting support for greenfield or weakly grounded systems.
- [`procedures/wireframe-exploration.md`](procedures/wireframe-exploration.md) - Private low-fidelity structure/storyboard exploration support.
- [`procedures/variation-set.md`](procedures/variation-set.md) - Private support for materially distinct design options.
- [`procedures/prototype-flow-spec.md`](procedures/prototype-flow-spec.md) - Private prototype-flow spec support before `sk-code` implementation.
- [`procedures/deck-direction-spec.md`](procedures/deck-direction-spec.md) - Private deck/presentation planning support.
- [`../shared/procedures/polish-gate-orchestration.md`](../shared/procedures/polish-gate-orchestration.md) - Shared private final-polish orchestration when interface owns visual-direction repair.
- [`references/aesthetics/README.md`](references/aesthetics/README.md) - Illustrative grounding cues, critique-against only, subordinate to grounding, never a chooser or preset.
- [`LICENSE.txt`](LICENSE.txt) - Apache-2.0 terms for the vendored Anthropic `frontend-design` base.

### Manual Testing Playbook

Manual testing scenarios live in `manual-testing-playbook/manual-testing-playbook.md` (root index) plus per-scenario files under `manual_testing_playbook/<NN>--<topic>/`. Validate structure with `python3 .opencode/skills/sk-doc/scripts/validate_document.py manual-testing-playbook/manual-testing-playbook.md`; execute scenarios in a real session for behavioral verification.

### Reference Loading Notes

Full reference-loading discipline notes (design_principles.md authority, quality-floor gate order, design-system-grounding optionality, aesthetics-cue subordination, Mobbin/Refero optionality): `references/design-process/resource-loading-notes.md` §3.

---

## 6. SUCCESS CRITERIA

**A design is ready when:**
- ✅ The register posture is set and the brief is read into the variance, motion, and density dials in a one-line Design Read.
- ✅ The subject, audience, and the page's single job are named.
- ✅ A token system (color, type, layout, signature) exists and was critiqued against the AI-default looks.
- ✅ Every color and type decision derives from the revised plan.
- ✅ The signature element is the one bold move, and everything else is quiet.
- ✅ The quality floor holds: responsive, visible focus, reduced motion respected.
- ✅ The mechanical pre-flight card passes: the layout gate and the content gate clear every binary box before delivery.
- ✅ The selected private procedure card is cited by relative path, or the no-procedure fallback is explicitly stated.
- ✅ Direct execution with Read, Glob, and Grep can produce the same context/proof result without subagent dispatch.
- ✅ Any child-agent or small-model dispatch carries the context manifest from `../shared/context-loading-contract.md`, requires `../shared/assets/context-loaded-card.md` before recommendations, requires `../shared/assets/proof-of-application-card.md` before any ready claim, and presents a valid `DESIGN_BOUNDARY_PROOF v1` envelope at the dispatch boundary per `../shared/design-dispatch-boundary.md`.
- ✅ Any handoff to `sk-code` includes the required build manifest with locked values, signature moves, reuse list, open risks and never-change constraints.
- ✅ Any corpus-grounded direction uses one coherent anchor by default, keeps the optional secondary bounded, records the changed no-corpus default, and emits no raw hydrated material.

---

## 7. INTEGRATION POINTS

### Related Skills

- **`sk-code`** owns implementation. This skill decides the look, and sk-code builds it to the detected web surface's standards and verifies it.
- **`sk-code`'s code-review mode** can audit the built UI against the standards sk-code enforces.
- **`mcp-chrome-devtools`** drives a real browser to screenshot the build for the self-critique step.
- **`mcp-figma`** is the sibling transport to Figma Desktop. This skill's judgment applies whenever a Figma read or export feeds a design decision.
- **Mobbin and Refero** (via Code Mode, `mobbin.*` / `refero.*`; Refero as the `mcp-refero` transport over `mcp-code-mode`) are optional real-world UI reference libraries for naming the category's real-world default so a design can deviate from it deliberately. Read live, one reference, never a chooser, never copied. `references/design-grounding/design-references-mcp.md` owns the discipline.

### Knowledge Base Dependencies

**Required**: `references/design-process/design-principles.md`. **Conditional**: `sk-code` web-surface references for the target stack during implementation.

---

## 8. REFERENCES AND RELATED RESOURCES

The router (Section 2) loads `references/design-process/design-principles.md` for every design task. Hand implementation to `sk-code`, use `mcp-chrome-devtools` for screenshot-based self-critique, and reach for `system-spec-kit` when the work needs packet documentation.

Upstream: vendored from [anthropics/skills/skills/frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) under Apache-2.0. `LICENSE.txt` carries the full terms.
