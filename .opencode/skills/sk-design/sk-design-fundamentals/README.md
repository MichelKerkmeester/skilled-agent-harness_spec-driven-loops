---
title: "sk-design"
description: "Concrete values and behavior for a UI that reads as designed — fixed scales, hierarchy technique, interaction detail, motion rules and a WCAG review pass — for anyone building, fixing or reviewing an interface."
trigger_phrases:
  - "ui looks off"
  - "make this look better"
  - "spacing and type scale"
  - "design review findings"
version: 1.0.0.0
---

# sk-design

> A UI that reads as designed, because every value came from a list instead of a guess.

Most interfaces built by people who do not consider themselves designers fail the same way. Nothing is individually wrong. The padding is 17px because it looked about right, the blue came from a color picker, the shadow was copied from a component library, and the transition is 400ms because 400 is a round number. Each choice is defensible alone. Together they read as amateur, and nobody can say why.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Deciding UI values and behavior when building, fixing or reviewing an interface. |
| **Invoke with** | "make this look better", "looks off", "spacing scale", "color palette", "focus ring", "animation duration", "design review". |
| **Works on** | Any web or app surface: a component, a screen, a described complaint, or a set of files. |
| **Produces** | Concrete values and CSS with the reason each was chosen, or severity-tiered review findings with file, line and fix. |

---

## 2. OVERVIEW

### Why This Skill Exists

Visual design gets treated as talent, so people who do not have it guess. Guessing produces 35 slightly different blues, spacing that never quite groups anything, and a headline that is enormous on a phone. The fix is not taste. It is a small set of decisions made once — which sixteen spacing values exist, which eleven font sizes, which nine shades of each color — after which every later choice is picking from a list. That is what this skill carries, along with the techniques for building hierarchy, the interaction details that make a screen behave under a real thumb, and the motion model that keeps it from feeling either sluggish or cartoonish.

### What It Does

The skill decides values and behavior for a surface. `SKILL.md` holds the scales themselves, the procedure for working, and the hierarchy technique that does most of the visible work. Six references carry the rest: palette construction, a symptom-to-fix table for existing UI, depth and typography technique, interaction craft, motion principles, and a WCAG-cited review checklist.

It is the authoring counterpart to `sk-design-md-generator`, which measures a live site's real CSS into a Style Reference. That skill reads a surface; this one writes one. When a measured reference exists, its values win.

### Why It Matters

- **Fewer decisions, better results:** picking from sixteen spacing values is faster than typing a number, and the result is consistent by construction.
- **Vague complaints become fixable:** "looks off" maps to a named cause with a named fix, instead of a restyling session.
- **Accessibility is not an afterthought:** contrast minimums, focus rings, touch targets and keyboard behavior are in the same rules as the visual ones.

### The Design Knowledge Layer

The skill distills four public sources into one operating model, kept in the order a task actually moves: choose values, build hierarchy, implement behavior, animate, verify.

| Layer | What the skill knows how to operate |
|---|---|
| Value scales | Spacing, type, weight, color, elevation, radius, opacity and duration, as fixed lists with the reasoning for each. |
| Procedure | The order of work for something new: feature before layout, grayscale before color, mobile before desktop. |
| Hierarchy | Primary, secondary and tertiary tiers built through weight and color, and the emphasize-by-de-emphasizing technique. |
| Color construction | Nine-shade HSL ramps, saturation at the ends, hue rotation, dark mode, and two escape hatches for contrast. |
| Interaction craft | Inputs, touch, hit areas, focus rings, keyboard, screen readers, performance and feedback placement. |
| Motion | The twelve animation principles adapted to UI, with enforceable timing, easing, physics and staging values. |
| UX laws | Target sizing, choice count, chunking, the 400ms response budget, grouping and emphasis. |
| Review | A severity-tiered pass over UI code with WCAG criteria, producing file, line and fix. |

---

## 3. QUICK START

**Step 1: Invoke it.** Routing is automatic on the trigger phrases above. To load it manually:

```bash
cat .opencode/skills/sk-design/SKILL.md
```

The scales in Section 3 are the always-loaded part; everything else loads on intent.

**Step 2: Take the token file.**

```bash
cp .opencode/skills/sk-design/assets/tokens.css <your-project>/styles/tokens.css
```

You get every scale as CSS custom properties, a semantic role layer, and a dark-mode block. Retune the hues rather than rebuilding the ramps.

**Step 3: Verify the skill package before relying on it.**

```bash
python3 .opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .opencode/skills/sk-design
```

Exit 0 with no hard failures.

---

## 4. HOW IT WORKS

A request arrives and the router asks one question first: is there nothing yet, a complaint, or existing code? That answer decides which reference loads before anything else happens. From there the work follows the same four phases regardless of entry point — choose values from the scales, establish hierarchy, implement behavior, then verify against the hard rules and contrast minimums.

```text
[UI request]
   |
   v
[build? improve? review?]
   |                 |                    |
   v                 v                    v
[scales in       [diagnosis-table    [review-checklist
 SKILL.md]        maps symptom]       scans the code]
   |                 |                    |
   +--------+--------+--------------------+
            v
   [hierarchy, interaction, motion]  -->  [values + reasons, or findings]
```

### Values Outrank Adjectives

The output is never "make the spacing tighter". It is `--space-4` instead of `--space-5`, with the reason: more space around a group than within it. That is what makes the result implementable by `sk-code` without another round of interpretation.

### Sources Disagree, And The Skill Says So

Four sources went into this skill and they do not agree everywhere. Fluid `clamp()` sizing conflicts with a fixed type scale. Three different motion-duration ceilings exist. Touch-target minimums differ by 12px. One source calls pure-black shadows harsh while another's default elevation scale uses them. Each conflict is stated where it lands, with a resolution and the reasoning, rather than quietly picking a winner.

The same applies across skills: `sk-design-md-generator` records type ratios and motion bands as targets for *reading* a measured surface, which would look like a contradiction if direction were ignored. Both skills now carry the reconciliation, so neither can be read in isolation and misapplied.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

- Building a component or screen and needing to decide sizes, colors, shadows or durations.
- Someone says the UI looks off, cluttered, plain or unfinished.
- Reviewing a pull request that touches UI, and the review must produce findings rather than impressions.
- Extending an existing palette to a new accent or to dark mode.

Do not use it to document a live site's existing CSS. That is extraction and belongs to `sk-design-md-generator`.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-design-md-generator` | Measures an existing surface into a Style Reference. Its measured values outrank this skill's defaults; both skills state the boundary. |
| `sk-code` | Implements the values this skill decides. |
| `system-spec-kit` | Owns packet documentation and continuity when the work is tracked. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Suggested values conflict with the project's tokens | The project has an established system this skill does not know about | Point the skill at the token file. An established system outranks these defaults. |
| A color cannot reach 4.5:1 | The brand color is too light for its role | Use one of the two escape hatches in `references/color-system.md`, or escalate the brand color as an operator decision. |
| A fix makes another element fail contrast | De-emphasizing a competitor pushed its text below the minimum | Re-run the contrast check after every hierarchy change; the hard rules apply after the fix, not only before it. |
| Motion guidance seems contradictory | Sources use different ceilings for different kinds of motion | See `references/motion-principles.md` Section 5, which separates feedback, state change and layout transition. |

---

## 7. FAQ

**Q: Why not just use a component library?**

A: A library gives you components, not the decisions behind them. It cannot tell you which of its shadows belongs on this element, or why the page still reads as noise once the components are in place.

**Q: The skill is named after design, but half of it is accessibility and motion. Why?**

A: Because a surface that looks right and behaves wrong is not finished. Contrast, focus, touch targets and durations are values like any other, so they live on the same scales and in the same rules.

**Q: How does this differ from `sk-design-md-generator`?**

A: That skill measures what a live site already does. This one decides what a surface should do when nothing has been decided yet. They are the reading and writing halves of the same job.

---

## 8. VERIFICATION

| Check | Result |
|---|---|
| Skill package | `validate_skill_package.py .opencode/skills/sk-design` exits 0 |
| Root metadata | `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` reports the root conformant |
| Advisor routing | `node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"this ui looks off"}' --warm-only --format json` returns this skill |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the value scales, and routing logic |
| [`references/build-procedure.md`](./references/build-procedure.md) | The seven-step order of work for something new |
| [`references/diagnosis-table.md`](./references/diagnosis-table.md) | Symptom to cause to fix, for existing UI |
| [`references/hierarchy.md`](./references/hierarchy.md) | The full hierarchy method: actions, labels, weight versus contrast |
| [`references/color-system.md`](./references/color-system.md) | Building and tuning a palette in HSL |
| [`references/depth-and-detail.md`](./references/depth-and-detail.md) | Light, shadow, typography detail, layout and images |
| [`references/interaction-craft.md`](./references/interaction-craft.md) | Inputs, touch, focus, keyboard, performance, feedback |
| [`references/motion-principles.md`](./references/motion-principles.md) | The twelve principles and the enforceable motion values |
| [`references/ux-laws.md`](./references/ux-laws.md) | Target size, choice count, chunking, response budgets, grouping |
| [`references/review-checklist.md`](./references/review-checklist.md) | The severity-tiered WCAG and visual review pass |
| [`assets/tokens.css`](./assets/tokens.css) | Every scale as contrast-verified CSS custom properties |
| [`assets/token-starter-set.md`](./assets/token-starter-set.md) | What is in the token file and how to retune it |
