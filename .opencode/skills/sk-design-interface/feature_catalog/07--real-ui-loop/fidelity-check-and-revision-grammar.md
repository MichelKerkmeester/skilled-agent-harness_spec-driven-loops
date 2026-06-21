---
title: "Fidelity check and revision grammar"
description: "Checks the real render against the quality floor and anti-default critique, then scopes revisions with an element-target grammar."
trigger_phrases:
  - "fidelity check and revision grammar"
  - "design fidelity check loop"
  - "render screenshot check"
  - "element-target revision grammar"
---

# Fidelity check and revision grammar

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Checks the real render against the quality floor and anti-default critique, then scopes revisions with an element-target grammar.

This is the iterate-against-a-real-render half of the real-UI loop. It closes the gap where "done" used to mean compiles plus responsive rather than matches-intent, by judging an actual render and routing feedback precisely instead of vaguely reprompting. The mechanism and pass bar live in `references/design-process/real_ui_loop.md`, and this entry summarizes the capability rather than restating the protocol.

## 2. HOW IT WORKS

### Fidelity check against the real render

The loop checks the latest render with the right mechanism for the surface. For a dev-server UI the agent controls, an `mcp-chrome-devtools` screenshot of the running build is the right mechanism, local-first and needing no remote sign-in. The render must clear the `ux_quality_reference.md` floor and survive the anti-default critique from `design_principles.md`, since "looks roughly like the brief" is a weaker bar than the skill already enforces. Automated screenshot comparison is unreliable for subtle visual and color differences, so the check is judgment over a render rather than pixel diffing, and completion is never claimed from a screenshot alone.

### Element-target revision grammar

Feedback is made precise and auditable instead of a vague reprompt. A revision names the target element or component, the visual evidence of what is wrong, the requested change, the scope, the expected verification, and whether the feedback is broad or targeted. Broad feedback re-plans the direction back to `design_principles.md`, while targeted feedback scopes a single edit. The grammar is the agent classifying feedback rather than reading hosted comment threads.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/design-process/real_ui_loop.md` | Shared | Sections 4 and 5 define the element-target revision grammar and the fidelity check, including the mechanism, pass bar, and the pixel-diff caveat. |
| `references/design-process/ux_quality_reference.md` | Shared | The objective floor the fidelity check gates the render on. |
| `references/design-process/design_principles.md` | Shared | The anti-default critique the render must survive, and the re-plan target for broad feedback. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `references/design-process/real_ui_loop.md` | Manual playbook | Section 5 caveat requires judgment over a render and forbids claiming completion from a screenshot alone. |
| `SKILL.md` | Manual playbook | Section 6 success criteria require the quality floor to hold on the built result. |

---

## 4. SOURCE METADATA

- Group: Real-UI loop
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--real-ui-loop/fidelity-check-and-revision-grammar.md`

Related references:
- [ground-and-reuse-before-generate.md](ground-and-reuse-before-generate.md) - Ground and reuse before generate
- [handoff-and-parity-guardrails.md](handoff-and-parity-guardrails.md) - Handoff and loop guardrails
- [../02--quality-floor/objective-quality-floor.md](../02--quality-floor/objective-quality-floor.md) - Objective quality floor
