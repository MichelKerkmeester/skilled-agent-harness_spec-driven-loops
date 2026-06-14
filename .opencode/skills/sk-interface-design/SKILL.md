---
name: sk-interface-design
description: Guidance for distinctive, intentional UI design when building or reshaping an interface. Drives deliberate palette, typography, layout and motion choices that avoid templated AI defaults, with a brainstorm-critique-build process and interface writing rules.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.1.0
metadata:
  author: Anthropic
  source: https://github.com/anthropics/skills/tree/main/skills/frontend-design
license: Apache-2.0; see LICENSE.txt
---

<!-- keywords: interface-design frontend-design visual-design typography palette ui-aesthetics -->

# Interface Design (sk-interface-design)

Approach UI work as the design lead at a studio known for visual identities that could not be mistaken for anyone else's. Make deliberate, opinionated choices specific to the brief, take one justified aesthetic risk, and reject anything that reads as a templated default. Full guidance lives in [`references/design_principles.md`](references/design_principles.md). Vendored from Anthropic's `frontend-design` skill (Apache-2.0).

---

## 1. WHEN TO USE

### Activation Triggers

**Use when** the work involves:
- Building a new UI, page, component, or landing section from a brief.
- Reshaping or restyling an existing interface that feels generic or templated.
- Choosing palette, typography, layout, motion, or interface copy.
- Reviewing a design direction before code is written.

**Keyword Triggers**: "design", "make it look good", "redesign", "variation", "hero section", "landing page", "looks templated", "looks AI-generated", "visual identity".

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
echo "$BRIEF" | grep -qiE 'palette|font|typography|layout|brand|look|style' && AXIS_PINNED=high
# If the brief pins the direction -> follow it exactly. If axes are free -> apply the principles.
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
| ALWAYS | Any design task | `references/design_principles.md` (palette, type, structure, motion, restraint) |
| CONDITIONAL | Writing UI copy | Section 6 of `design_principles.md` (writing in design) |
| CONDITIONAL | Verifying the quality floor / charts | `references/ux_quality_reference.md` (accessibility, motion, touch, responsive, forms, charts) |
| CONDITIONAL | Producing or iterating on real UI (canvas, repo recreation, code-bound) | `references/claude_design_parity.md` (ground in a system, reuse before generating, fidelity check, handoff) |
| ON_DEMAND | Need a real design system to ground in, reuse, or name the default to deviate from | An Open Design system via `mcp-open-design` (`od mcp` get_file/search_files, or `od tools design-systems read`), when that app is installed |
| ON_DEMAND | Implementing in code | `sk-code` web-surface standards for the target stack |

### Smart Router Pseudocode

```python
# Route a design task to the right guidance.
# 1) Always load references/design_principles.md.
# 2) If the brief fixes the visual direction, follow the brief verbatim and skip default-avoidance.
# 3) If axes are free, apply Sections 2-5 (subject, principles, process, restraint).
# 4) If the task writes interface copy, also apply Section 6 (writing).
# 5) Hand implementation to sk-code for the detected web surface. This skill owns the look, not the build mechanics.
```

---

## 3. HOW IT WORKS

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

Calibration matters: current AI design clusters around three default looks (cream + serif + terracotta, near-black + one acid accent, broadsheet with hairline rules). They are defaults, not choices. When the brief frees an axis, do not spend it on one of these. The full calibration, two-pass detail, and writing rules are in [`references/design_principles.md`](references/design_principles.md).

### Quality Floor

Build to it without announcing it: responsive down to mobile, visible keyboard focus, and reduced motion respected. Do most of the planning and iteration in thinking, and show the user ideas only at higher confidence.

---

## 4. RULES

### ALWAYS

1. **ALWAYS ground the design in the subject** before choosing anything. Name the subject, audience, and the page's single job, then draw distinctive choices from the subject's own world.
2. **ALWAYS make deliberate, brief-specific choices** for palette, typography, layout, and motion, and take one justifiable aesthetic risk.
3. **ALWAYS critique the plan against the AI-default looks** before writing code, and revise anything generic with a stated reason.
4. **ALWAYS treat copy as design material**, with active voice, end-user vocabulary, and consistent action names across a flow.
5. **ALWAYS meet the quality floor**: responsive, visible focus, reduced-motion respected.

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

- [`references/design_principles.md`](references/design_principles.md) - Full guidance: grounding, design principles, the two-pass process with AI-default calibration, restraint and self-critique, and interface writing.
- [`references/ux_quality_reference.md`](references/ux_quality_reference.md) - The objective quality floor (accessibility, motion, touch, responsive, forms, charts). Apply as the pass/fail gate after the direction is set.
- [`references/design_inventory.md`](references/design_inventory.md) - How to use a real design system (via `mcp-open-design`, when installed) as either reuse-ground or the named default to critique against. Never a chooser.
- [`references/claude_design_parity.md`](references/claude_design_parity.md) - The shared cross-skill loop with `mcp-magicpath` and `mcp-open-design`: ground in a design system, reuse before generating, check the real render against the quality floor, hand off cleanly. Consult when producing or iterating on real UI.
- [`LICENSE.txt`](LICENSE.txt) - Apache-2.0 terms for the vendored Anthropic `frontend-design` base.

### Feature Catalog

The skill's features are catalogued in `feature_catalog/feature_catalog.md` (root index) plus per-feature files under `feature_catalog/<NN>--<topic>/`: the design process, the quality floor, design grounding and critique via Open Design, interface writing, and the integration boundary.

### Manual Testing Playbook

Manual testing scenarios live in `manual_testing_playbook/manual_testing_playbook.md` (root index) plus per-scenario files under `manual_testing_playbook/<NN>--<topic>/`. Validate structure with `python3 .opencode/skills/sk-doc/scripts/validate_document.py manual_testing_playbook/manual_testing_playbook.md`; execute scenarios in a real session for behavioral verification.

### Reference Loading Notes

- Load `design_principles.md` on every design task. It is the authority for palette, type, structure, motion, and copy.
- Keep Section 2 (SMART ROUTING) as the single routing authority.
- `references/ux_quality_reference.md` is the objective quality-floor gate; apply it after the direction is set.
- When the Open Design app is installed, `mcp-open-design` is an OPTIONAL source of real design systems to ground in or to name the default to deviate from, never a required step and never a style chooser. `design_principles.md` stays the authority.

---

## 6. SUCCESS CRITERIA

**A design is ready when:**
- ✅ The subject, audience, and the page's single job are named.
- ✅ A token system (color, type, layout, signature) exists and was critiqued against the AI-default looks.
- ✅ Every color and type decision derives from the revised plan.
- ✅ The signature element is the one bold move, and everything else is quiet.
- ✅ The quality floor holds: responsive, visible focus, reduced motion respected.

---

## 7. INTEGRATION POINTS

### Related Skills

- **`sk-code`** owns implementation. This skill decides the look, and sk-code builds it to the detected web surface's standards and verifies it.
- **`sk-code-review`** can audit the built UI against the standards sk-code enforces.
- **`mcp-chrome-devtools`** drives a real browser to screenshot the build for the self-critique step.
- **`mcp-magicpath`** is the sibling canvas tool that shares the same parity loop (`claude_design_parity.md`). This skill owns the judgment, that skill owns the canvas and CLI.
- **`mcp-open-design`** is the optional transport to a real Open Design design system when that app is installed, for grounding and reuse through the shared parity loop. This skill owns the judgment, that skill owns the transport.

### Knowledge Base Dependencies

**Required**: `references/design_principles.md`. **Conditional**: `sk-code` web-surface references for the target stack during implementation.

---

## 8. REFERENCES AND RELATED RESOURCES

The router (Section 2) loads `references/design_principles.md` for every design task. Hand implementation to `sk-code`, use `mcp-chrome-devtools` for screenshot-based self-critique, and reach for `system-spec-kit` when the work needs packet documentation.

Upstream: vendored from [anthropics/skills/skills/frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) under Apache-2.0. `LICENSE.txt` carries the full terms.
