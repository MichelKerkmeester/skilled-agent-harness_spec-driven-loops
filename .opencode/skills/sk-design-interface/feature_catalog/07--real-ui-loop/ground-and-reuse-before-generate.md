---
title: "Ground and reuse before generate"
description: "Captures the design-context snapshot and builds from a present design system before authoring anything net-new."
trigger_phrases:
  - "ground and reuse before generate"
  - "design-context snapshot intake"
  - "reuse before generate design system"
  - "design-system adherence check"
version: 1.5.0.3
---

# Ground and reuse before generate

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Captures the design-context snapshot and builds from a present design system before authoring anything net-new.

This is the grounding half of the real-UI loop and its strongest anti-default move. It captures what already constrains the work, then prefers an existing system component or token over inventing one, so output stays grounded in a real system rather than drifting into AI defaults. The full protocol lives in `references/design-process/real_ui_loop.md`, and this entry is the catalog summary rather than a second copy of it.

## 2. HOW IT WORKS

### Design-context snapshot

Before choosing anything, the loop captures what grounds the work as intake, never as a chooser. It records the subject, audience, and the page's single job, any existing design system that is present such as brand colors, typography, component patterns, and semantic tokens, any supplied reference material treated as inherit-from or critique-against rather than copy, and the target viewport and output target. Only what is actually present is captured, and a persisted project brief is read at the start to ground work across sessions without fixing a style independent of the subject.

### Reuse before generate

When a design system is present, the loop builds from it instead of inventing. Before authoring net-new markup it searches the active system for a component or token that fits, and authors something new only when nothing fits. An adherence check flags and fixes raw color values used instead of semantic tokens, arbitrary one-off spacing, inline style overrides, and bypassing a system component with a hand-rolled one. On a free axis with no system, the anti-default process still governs, and reuse applies only to what the system actually provides.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/design-process/real_ui_loop.md` | Shared | Sections 2 and 3 define the design-context snapshot intake and the design-system adherence plus reuse-before-generate move. |
| `references/design-process/design_principles.md` | Shared | Step 0 grounding that the snapshot draws the subject, audience, and page job from. |
| `SKILL.md` | Shared | Section 2 resource-loading row and Section 5 Core References entry load the real-UI loop when producing or iterating on real UI. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `references/design-process/real_ui_loop.md` | Manual playbook | Section 8 guardrails assert reuse stays anti-default and the snapshot never becomes a style chooser. |
| `SKILL.md` | Manual playbook | Section 2 resource-loading table requires the protocol to load for canvas, repo recreation, and code-bound work. |

---

## 4. SOURCE METADATA

- Group: Real-UI loop
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--real-ui-loop/ground-and-reuse-before-generate.md`

Related references:
- [fidelity-check-and-revision-grammar.md](fidelity-check-and-revision-grammar.md) - Fidelity check and revision grammar
- [handoff-and-parity-guardrails.md](handoff-and-parity-guardrails.md) - Handoff and loop guardrails
- [../01--design-process/ground-the-subject.md](../01--design-process/ground-the-subject.md) - Ground the subject
