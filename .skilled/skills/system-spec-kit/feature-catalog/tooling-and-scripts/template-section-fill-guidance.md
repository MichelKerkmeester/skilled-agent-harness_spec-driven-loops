---
title: "Template section fill guidance"
description: "Places one imperative fill instruction below every template section heading, with a good and a weak example, and holds the rendered result with a golden test."
trigger_phrases:
  - "template section fill guidance"
  - "section fill instruction"
  - "good and weak example"
  - "template fill line"
version: 1.0.0.0
---

# Template section fill guidance

## 1. OVERVIEW

Template section fill guidance is the line below each content heading in the packet templates. It tells a writer the one action the section needs, then shows a good answer and a weak answer. A token alone says what to replace. The fill line says what a finished answer looks like.

The guidance covers every content section of the four core templates and the ten addon templates. The `TEMPLATE INSTRUCTIONS` and `Author Instructions` headings hold fixed instructions and get no fill line.

---

## 2. HOW IT WORKS

### The Fill Line

Each line is one HTML comment that starts with `FILL:`. It sits directly below the section heading and stays on one physical line, so a renderer cannot break the section. The line names the action, then a good example, then a weak example where the section needs both.

The text never holds an authoring token or an open question marker. A test renders the templates and fails when a section lacks its fill line, holds two of them, or carries a token inside one.

### Render and Anchor Guards

The fill guidance test renders all 16 level and document pairs. It compares the anchor count with a frozen table and checks one fill line per section. The golden snapshot test renders every level and compares the result with a stored file, so a change that moves a heading or prunes a gated block fails before it ships.

### Example Alignment

The hand-written examples a model copies carry the same anchors as their templates. The example drift guard compares each example with its template and reports a missing or extra anchor. The fill line and the anchor count are tested together, because a fill line inside a pruned block changes the rendered shape.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl` | Template | Carries the fill lines for the specification sections |
| `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl` | Template | Carries the fill lines for the plan sections |
| `.skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl` | Template | Carries the fill lines for the task sections |
| `.skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl` | Template | Carries the fill lines for the summary sections |
| `.skilled/skills/system-spec-kit/templates/addons/*.tmpl` | Template | Carries the fill lines for the addon sections |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/template-fill-guidance.vitest.ts` | Vitest | Renders 16 documents and checks one fill line and the anchor count |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` | Vitest | Compares every rendered level with a stored snapshot |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/golden-render-all-levels.md` | Manual playbook | Scenario 480, both template guards |

---

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/template-section-fill-guidance.md`

Related references:
- [versioned-placeholder-gate.md](versioned-placeholder-gate.md) - the rule that reads a token a writer left behind
- [example-drift-guard.md](example-drift-guard.md) - the guard that keeps the examples aligned
