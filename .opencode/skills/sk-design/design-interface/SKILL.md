---
name: design-interface
description: Guidance for distinctive, intentional UI design when building or reshaping an interface. Drives deliberate palette, typography, layout and motion choices that avoid templated AI defaults, with a brainstorm-critique-build process and interface writing rules.
allowed-tools: [Read, Grep, Glob, Task]
version: 1.0.0.1
metadata:
  author: Anthropic
  source: https://github.com/anthropics/skills/tree/main/skills/frontend-design
license: Apache-2.0; see LICENSE.txt
---

<!-- keywords: interface-design frontend-design visual-design typography palette ui-aesthetics -->

# Interface Design (interface)

Approach UI work as the design lead at a studio known for visual identities that could not be mistaken for anyone else's. Make deliberate, opinionated choices specific to the brief, take one justified aesthetic risk, and reject anything that reads as a templated default. Full guidance lives in [`references/design-process/design_principles.md`](references/design-process/design_principles.md). Vendored from Anthropic's `frontend-design` skill (Apache-2.0).

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

**Keyword Triggers**: "design", "make it look good", "redesign", "variation", "give me N variations", "show me options", "multiple directions", "hero section", "landing page", "looks templated", "looks AI-generated", "visual identity".

### When NOT to Use

**Skip this skill when:**
- The task is pure logic, data, or back-end work with no visual surface (use `sk-code`).
- A brief already fully pins the visual direction and only mechanical implementation remains (follow the brief, since this skill adds nothing).
- The work is documentation or prose, not interface (use `sk-doc`).

---

## 2. SMART ROUTING

### Primary Detection Signal

Detect design intent and how much of the visual direction the brief fixes:

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
| ALWAYS | Any design task | `references/design-process/design_principles.md` (palette, type, structure, motion, restraint) |
| ALWAYS | The first step of any design task | `../shared/register.md` (set the Brand-vs-Product register, which gates density, motion, color dosage, copy, anti-slop strictness) and `references/design-process/brief_to_dials.md` (Design Read intake to the dials) |
| CONDITIONAL | Writing UI copy | Section 6 of `design_principles.md` (writing in design) |
| CONDITIONAL | Producing two or more design directions at once | `references/design-process/variation_diversity.md` (seed-of-thought debias so the directions are not N safe copies of the median) |
| CONDITIONAL | Verifying the quality floor / charts | `references/design-process/ux_quality_reference.md` (accessibility, motion, touch, responsive, forms, charts) |
| CONDITIONAL | Producing or iterating on real UI (repo recreation, code-bound, a generation run) | `references/design-process/real_ui_loop.md` (ground in a system, reuse before generating, fidelity check, handoff) |
| CONDITIONAL | Final mechanical pass before shipping | `references/design-process/mechanical_defaults.md` (the layout gate) and `assets/interface_preflight_card.md` (the fill-in PASS or FAIL pre-flight card) |
| CONDITIONAL | Writing placeholder content, names, or numbers | `references/design-process/copy_and_mock_data.md` (realistic mock content, no lorem, no AI-tell copy) |
| ON_DEMAND | Need a real design system to ground in, reuse, or name the default to deviate from | A real design system you own, read live and never copied. See `references/design-grounding/design_inventory.md` |
| ON_DEMAND | Naming a realized look in one line as the default to critique against | The illustrative cues in `references/aesthetics/` (brutalist, minimalist, soft, apple-bento). Critique-against reference only, subordinate to grounding, never a chooser, preset, or pick-a-vibe axis. See `references/aesthetics/README.md` |
| INITIATIVE / ASK | A convention-heavy category where naming the real-world default sharpens the deviation | A real shipped-UI reference via Mobbin (app/iOS screens + flows) or Refero (web pages + visual styles). These run through Code Mode (`mobbin.*` / `refero.*`), so co-load `mcp-code-mode` before any lookup; this skill does not call Code Mode directly. Take the initiative to pull ONE when the category benefits and a subscription is connected; otherwise ask the user; otherwise fall back to the generic process. See `references/design-grounding/design_references_mcp.md` |
| ON_DEMAND | Implementing in code | `sk-code` web-surface standards for the target stack |

### Smart Router (parseable intent model)

The Resource Loading Levels table above is the human-readable view; the fenced block below is the machine-parseable router that drives deterministic routing and the skill-benchmark D5 connectivity gate. `INTENT_SIGNALS` scores the lowercased task by keyword, `RESOURCE_MAP` maps each intent to the in-skill references and assets it loads, and `DEFAULT_RESOURCE` is loaded on every design task. Routing semantics match the table one-for-one: the same references load for the same intents. The shared register (`../shared/register.md`) is consulted on every task as a routing preamble but lives outside this skill root, so it is cited in prose rather than in the in-skill `RESOURCE_MAP`.

```python
# In-skill router for a design task. Substring-scored, ambiguity-aware: lowercase
# the task, sum each intent's weight per keyword hit, keep intents within the delta
# of the top score, then union DEFAULT_RESOURCE + RESOURCE_MAP[intent] for each.
# Every reference and asset on disk appears in exactly one RESOURCE_MAP entry, so
# no on-disk guidance is unreachable; design_principles.md is also the default.

DEFAULT_RESOURCE = "references/design-process/design_principles.md"

INTENT_SIGNALS = {
    "DESIGN_PRINCIPLES": {"weight": 4, "keywords": ["design", "redesign", "make it look good", "looks generic", "looks templated", "looks ai-generated", "visual identity", "distinctive", "palette", "typography", "type", "layout", "brainstorm", "critique", "deviate", "templated default", "hero section", "landing page"]},
    "REGISTER_DIALS": {"weight": 4, "keywords": ["register", "brand vs product", "posture", "dials", "variance", "motion dial", "density", "design read", "read the brief", "intake", "calibrate", "calibration"]},
    "VARIATION_DIVERSITY": {"weight": 4, "keywords": ["variation", "variations", "give me options", "multiple directions", "several directions", "show me options", "n directions", "two directions", "three directions", "diverse", "seed of thought", "debias"]},
    "UX_QUALITY": {"weight": 4, "keywords": ["quality floor", "accessibility", "accessible", "contrast", "focus", "keyboard", "reduced motion", "touch target", "responsive", "forms", "charts", "data visualization", "what fails"]},
    "REAL_UI_LOOP": {"weight": 4, "keywords": ["real ui", "real-ui loop", "reuse before generate", "existing design system", "registered component", "render fidelity", "dev server", "actually rendered", "matches the intent", "handoff", "screenshot the build"]},
    "MECHANICAL_PREFLIGHT": {"weight": 4, "keywords": ["mechanical", "pre-flight", "preflight", "pre flight", "preflight card", "ship or fix", "layout gate", "hero lines", "bento", "eyebrow", "button contrast", "section spacing", "before shipping", "before i ship"]},
    "COPY_MOCK_DATA": {"weight": 4, "keywords": ["copy", "mock data", "placeholder", "lorem", "ai-tell phrasing", "fake-precise", "fake precision", "copy register", "image seed", "names and numbers", "realistic content", "content tells"]},
    "GROUNDING": {"weight": 4, "keywords": ["design system", "design inventory", "ground in a system", "critique against", "default to deviate from", "mobbin", "refero", "real-world reference", "shipped ui", "the cliche", "the usual look", "typical look"]},
    "AESTHETICS": {"weight": 3, "keywords": ["aesthetic", "brutalist", "minimalist", "soft ui", "apple bento", "name the look", "name a realized look", "realized default", "named default look", "vibe"]},
}

RESOURCE_MAP = {
    "DESIGN_PRINCIPLES": ["references/design-process/design_principles.md"],
    "REGISTER_DIALS": ["references/design-process/brief_to_dials.md"],
    "VARIATION_DIVERSITY": ["references/design-process/variation_diversity.md"],
    "UX_QUALITY": ["references/design-process/ux_quality_reference.md"],
    "REAL_UI_LOOP": ["references/design-process/real_ui_loop.md"],
    "MECHANICAL_PREFLIGHT": ["references/design-process/mechanical_defaults.md", "references/design-process/copy_and_mock_data.md", "assets/interface_preflight_card.md"],
    "COPY_MOCK_DATA": ["references/design-process/copy_and_mock_data.md"],
    "GROUNDING": ["references/design-grounding/design_inventory.md", "references/design-grounding/design_references_mcp.md", "references/mcp-tooling/mobbin_tools.md", "references/mcp-tooling/refero_tools.md"],
    "AESTHETICS": ["references/aesthetics/README.md", "references/aesthetics/brutalist.md", "references/aesthetics/minimalist.md", "references/aesthetics/soft.md", "references/aesthetics/apple_bento.md"],
}

# Routing flow on top of the model above:
# 1) DEFAULT_RESOURCE (design_principles.md) loads on every design task.
# 2) If the brief pins the visual direction, follow it verbatim and skip default-avoidance.
# 3) If axes are free, apply DESIGN_PRINCIPLES (subject, principles, process, restraint).
# 4) If two or more directions are requested, VARIATION_DIVERSITY runs the seed-of-thought debias.
# 5) If the task writes interface copy or mock data, COPY_MOCK_DATA gates the content.
# 6) Hand implementation to sk-code for the detected web surface; this skill owns the look, not the build.
```

---

## 3. HOW IT WORKS

### Register And Dials First

Before any visual choice, set the Brand-vs-Product posture from `../shared/register.md`, which gates density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity. Then read the brief into the VARIANCE, MOTION, and DENSITY dials with `references/design-process/brief_to_dials.md`, stated once in a one-line Design Read. The dials are internal calibration, never a chooser surfaced to the user.

### The Two-Pass Process

**Process Flow**:
```
STEP 0: Ground the subject
       └─ Name one concrete subject, its audience, and the page's single job
       ↓
STEP 1: Brainstorm a compact token system
       ├─ Color: 4-6 named hex values
       ├─ Type: a display face used with restraint + a body face (+ utility face)
       ├─ Layout: a concept with one-sentence prose + ASCII wireframes
       └─ Signature: the one element the page will be remembered by
       ↓
STEP 2: Critique the plan against the brief
       └─ Anything that reads like a generic default gets revised, with a stated reason
       ↓
STEP 3: Build from the revised plan
       └─ Derive every color and type decision from the plan, mind CSS specificity
       ↓
STEP 4: Self-critique
       └─ Screenshot if possible, remove one accessory, confirm the quality floor
```

Calibration matters: current AI design clusters around three default looks (cream + serif + terracotta, near-black + one acid accent, broadsheet with hairline rules). They are defaults, not choices. When the brief frees an axis, do not spend it on one of these. The full calibration, two-pass detail, and writing rules are in [`references/design-process/design_principles.md`](references/design-process/design_principles.md).

### Quality Floor

Build to it without announcing it: responsive down to mobile, visible keyboard focus, and reduced motion respected. Do most of the planning and iteration in thinking, and show the user ideas only at higher confidence.

### Mechanical Delivery Gates

A taste read misses structural and content tells, so two binary gates run before delivery. The layout gate in `references/design-process/mechanical_defaults.md` counts the hero lines, the bento cells against content, and the eyebrows against a `ceil(sectionCount / 3)` ceiling, and computes button contrast against the real background. The content gate in `references/design-process/copy_and_mock_data.md` sweeps for lorem, AI-tell phrasing, fake-precise numbers, a mixed copy register, and lazy image seeds. The fill-in `assets/interface_preflight_card.md` is the checkable form of both plus the dials: every box is binary, and a single fail means the surface is not done.

---

## 4. RULES

### ALWAYS

1. **ALWAYS ground the design in the subject** before choosing anything. Name the subject, audience, and the page's single job, then draw distinctive choices from the subject's own world.
2. **ALWAYS make deliberate, brief-specific choices** for palette, typography, layout, and motion, and take one justifiable aesthetic risk.
3. **ALWAYS critique the plan against the AI-default looks** before writing code, and revise anything generic with a stated reason.
4. **ALWAYS treat copy as design material**, with active voice, end-user vocabulary, and consistent action names across a flow.
5. **ALWAYS meet the quality floor**: responsive, visible focus, reduced-motion respected.
6. **ALWAYS debias multiple directions with the seed of thought** from `references/design-process/variation_diversity.md` when a brief asks for two or more: a committed seed picks a non-median start in the grounded option space and the rest are spread to be genuinely distinct, each still grounded and critiqued. Never surface it as a style chooser.
7. **ALWAYS decide, at the critique step, whether a real-world reference would sharpen the default to deviate from.** Take the initiative to pull ONE Mobbin or Refero reference when the brief sits in a convention-heavy category and a subscription is connected; otherwise ask the user first; otherwise fall back to the generic anti-default process. Mobbin for app/iOS surfaces, Refero for web pages and visual style. One reference, read live, never copied, never a chooser. Mobbin and Refero are Code Mode (UTCP) manuals, not tools in this skill's `allowed-tools`, so co-load `mcp-code-mode` and route the lookup through it; if Code Mode is unavailable, fall back to the generic process. See `references/design-grounding/design_references_mcp.md`.

### NEVER

1. **NEVER ship a templated default** (cream + serif + terracotta, near-black + one acid accent, or broadsheet hairlines) on a free axis just because it is safe.
2. **NEVER add decoration that does not serve the brief**, including numbered markers (01 / 02 / 03) when the content is not actually a sequence.
3. **NEVER let motion pile up**. Scattered animation reads as AI-generated, so prefer one orchestrated moment.
4. **NEVER override a brief that pins the direction**. The brief's own words always win, even when they ask for a default look.

### ESCALATE IF

1. **ESCALATE IF the brief is too thin to ground** and you cannot reasonably pin the subject, audience, or page job yourself. State your assumed direction and confirm.
2. **ESCALATE IF the requested direction conflicts with brand or accessibility** (for example a palette that fails contrast). Surface the trade-off before building.

---

## 5. REFERENCES

### Core References

- [`references/design-process/design_principles.md`](references/design-process/design_principles.md) - Full guidance: grounding, design principles, the two-pass process with AI-default calibration, restraint and self-critique, and interface writing.
- [`references/design-process/ux_quality_reference.md`](references/design-process/ux_quality_reference.md) - The objective quality floor (accessibility, motion, touch, responsive, forms, charts). Apply as the pass/fail gate after the direction is set.
- [`references/design-grounding/design_inventory.md`](references/design-grounding/design_inventory.md) - How to use a real design system you own as either reuse-ground or the named default to critique against. Never a chooser.
- [`references/design-grounding/design_references_mcp.md`](references/design-grounding/design_references_mcp.md) - How to read real-world shipped UI live via Mobbin or Refero (Code Mode) to name the real-world default and deviate from it. Critique-against only, one reference, never a chooser, never copied.
- [`references/mcp-tooling/mobbin_tools.md`](references/mcp-tooling/mobbin_tools.md) - Mobbin MCP tool catalog (search_screens, search_flows): arguments, the verified Code Mode call convention, result shape, troubleshooting.
- [`references/mcp-tooling/refero_tools.md`](references/mcp-tooling/refero_tools.md) - Refero MCP tool catalog (8 tools across styles, screens, flows): the styles-first model, call convention, result shape, troubleshooting.
- [`references/design-process/variation_diversity.md`](references/design-process/variation_diversity.md) - The seed-of-thought debias for producing two or more directions at once: a committed seed picks a non-median start in the grounded option space, the rest are spread to be distinct, and grounding plus the anti-default critique stay primary. Consult only when more than one direction is requested.
- [`references/design-process/real_ui_loop.md`](references/design-process/real_ui_loop.md) - The real-UI loop: ground in a design system, reuse before generating, check the real render against the quality floor, hand off cleanly. Consult when producing or iterating on real UI.
- [`../shared/register.md`](../shared/register.md) - The shared Brand-vs-Product operating register. Set it first. It gates density, motion, color dosage, copy, anti-slop strictness.
- [`references/design-process/brief_to_dials.md`](references/design-process/brief_to_dials.md) - Design Read intake that maps the variance, motion and density dials to choices and defers the Brand-vs-Product posture to the shared register. Consult at the start of a task.
- [`references/design-process/mechanical_defaults.md`](references/design-process/mechanical_defaults.md) - The mechanical anti-default layout gate (hero, bento, meta-label, button contrast, spacing). Authored once here, referenced by the audit mode.
- [`references/design-process/copy_and_mock_data.md`](references/design-process/copy_and_mock_data.md) - The content gate for realistic mock data and copy (no lorem, no AI-tell phrasing, one copy register). Authored once here, referenced by the audit mode.
- [`assets/interface_preflight_card.md`](assets/interface_preflight_card.md) - The fill-in PASS or FAIL mechanical pre-flight card. Run it before shipping.
- [`references/aesthetics/README.md`](references/aesthetics/README.md) - Illustrative grounding cues (brutalist, minimalist, soft, apple-bento) for naming a realized default to critique against. Subordinate to grounding and the anti-default critique, never a chooser, preset, or pick-a-vibe axis.
- [`LICENSE.txt`](LICENSE.txt) - Apache-2.0 terms for the vendored Anthropic `frontend-design` base.

### Manual Testing Playbook

Manual testing scenarios live in `manual_testing_playbook/manual_testing_playbook.md` (root index) plus per-scenario files under `manual_testing_playbook/<NN>--<topic>/`. Validate structure with `python3 .opencode/skills/sk-doc/scripts/validate_document.py manual_testing_playbook/manual_testing_playbook.md`; execute scenarios in a real session for behavioral verification.

### Reference Loading Notes

- Load `design_principles.md` on every design task. It is the authority for palette, type, structure, motion, and copy.
- Keep Section 2 (SMART ROUTING) as the single routing authority.
- `references/design-process/ux_quality_reference.md` is the objective quality-floor gate; apply it after the direction is set.
- A real design system you own is an OPTIONAL source to ground in or to name the default to deviate from, never a required step and never a style chooser. `design_principles.md` stays the authority.
- The `references/aesthetics/` cues are illustrative critique-against reference only: cite at most one to name a realized default at the critique step, subordinate to grounding, never surfaced as a chooser, preset, or pick-a-vibe axis. `real_ui_loop.md` Section 8 owns this guardrail.
- When the Mobbin or Refero subscriptions are connected, they are an OPTIONAL real-world critique-against reference (via Code Mode) for naming the category default to deviate from, never a chooser and never copied. `references/design-grounding/design_references_mcp.md` owns the rules and `design_principles.md` stays the authority.

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

---

## 7. INTEGRATION POINTS

### Related Skills

- **`sk-code`** owns implementation. This skill decides the look, and sk-code builds it to the detected web surface's standards and verifies it.
- **`sk-code-review`** can audit the built UI against the standards sk-code enforces.
- **`mcp-chrome-devtools`** drives a real browser to screenshot the build for the self-critique step.
- **`mcp-figma`** is the sibling transport to Figma Desktop. This skill's judgment applies whenever a Figma read or export feeds a design decision.
- **Mobbin and Refero** (via Code Mode, `mobbin.*` / `refero.*`) are optional real-world UI reference libraries for naming the category's real-world default so a design can deviate from it deliberately. Read live, one reference, never a chooser, never copied. `references/design-grounding/design_references_mcp.md` owns the discipline.

### Knowledge Base Dependencies

**Required**: `references/design-process/design_principles.md`. **Conditional**: `sk-code` web-surface references for the target stack during implementation.

---

## 8. REFERENCES AND RELATED RESOURCES

The router (Section 2) loads `references/design-process/design_principles.md` for every design task. Hand implementation to `sk-code`, use `mcp-chrome-devtools` for screenshot-based self-critique, and reach for `system-spec-kit` when the work needs packet documentation.

Upstream: vendored from [anthropics/skills/skills/frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) under Apache-2.0. `LICENSE.txt` carries the full terms.
