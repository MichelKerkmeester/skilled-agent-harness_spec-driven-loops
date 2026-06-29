---
title: Transform Remediation
description: Maps directional transform verbs bolder, quieter, distill and redesign to findings, the owner mode and the accepted remediation path. Register-gated.
trigger_phrases:
  - "transform remediation"
  - "bolder quieter distill audit"
  - "directional remediation path"
  - "which transform verb"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Transform Remediation

When an audit finds a surface that is bland, loud, cluttered or generic, the fix has a direction.

---

## 1. OVERVIEW

### Purpose

Maps four directional verbs to the findings that call for them, the mode that owns the work, and the accepted remediation path. The audit names the direction and routes it; it does not perform the transform, which is `interface` or `foundations` work, with implementation by `sk-code` after the user accepts the recommendation.

This file is register-gated. Which direction is correct depends on the Brand-vs-Product posture, so resolve the register first: `../../shared/register.md`. A loud Brand hero and a loud Product dashboard get opposite verdicts from the same observation. Severity and the findings schema come from `audit_contract.md`. The general anti-slop signals are in `anti_patterns_production.md`, and the model-specific tells are in `ai_fingerprint_tells.md`.

### When to Use

- Routing bland, loud, cluttered, or generic audit findings to bolder, quieter, distill, or redesign.
- Deciding whether a Brand or Product register changes the remediation verdict.
- Naming the owner mode and accepted path without performing the transform during audit.

### Core Principle

Resolve the register first; the same observation can require opposite remediation on Brand and Product surfaces.

---

## 2. THE FOUR VERBS

| Verb | The problem it fixes | One-line direction |
|---|---|---|
| bolder | Too safe, bland, flat hierarchy, generic choices | Increase impact through stronger hierarchy and committed choices, not more effects |
| quieter | Too loud, overstimulating, competing weight, motion excess | Reduce intensity with precision, keep the point of view intact |
| distill | Cluttered, redundant, too many elements and choices | Strip to essence, remove what does not earn its place |
| redesign | Generic across the board, multiple tells, a default look | Upgrade an existing surface to premium without breaking it |

bolder, quieter and distill are single-axis moves on one surface. redesign is the broad upgrade pass that runs when the surface is generic in several dimensions at once and a single verb is not enough.

---

## 3. REGISTER GATE

The same observation routes to a different verb depending on posture. Read the register before assigning a remediation.

| Observation | Brand verdict | Product verdict |
|---|---|---|
| Surface feels flat and safe | bolder, toward distinctiveness: committed scale, unexpected color, typographic risk | bolder, toward clarity only: stronger hierarchy, sharper single accent, more committed density. No theatrics, they undercut trust |
| Surface feels loud and busy | quieter, but the point of view survives the cuts: drama reduced, not eliminated | quieter, toward disappearing into the task: fewer background accents, flatter cards, less color, less motion |
| Surface feels cluttered | distill, toward one big move with room to breathe | distill, toward density that still reads: one primary action, progressive disclosure for the rest |
| Surface feels generic everywhere | redesign, weighted to voice and a signature moment | redesign, weighted to affordance, consistency and accessibility |

The audit-severity dial follows from this. On a Brand surface a generic-but-functional result is a real finding, so bland scores against Anti-Patterns. On a Product surface an expressive-but-unclear result is a real finding, so theatrics score against Accessibility and consistency. A verdict that ignores the register will push a dashboard toward marketing drama or flatten a campaign into a tool.

---

## 4. FINDING TO VERB MAP

Map the observed finding to a verb, then to the owner mode and the accepted path. None of these are implementation steps. They are the direction the owner mode will take.

### 4.1 Bland signals to bolder

Signals: system fonts, everything medium-sized with no drama, uniform visual weight, no focal point, predictable standard patterns.

- Verb: bolder.
- Owner: `interface` for the focal moment and overall direction, `foundations` for the type scale, weight contrast and color strategy.
- Accepted path: pick one hero moment, widen the size and weight contrast, commit the color strategy a step up the commitment axis. The trap to avoid is the AI idea of bold: gradient text, glassmorphism, neon on dark, hero-metric templates. Those are the opposite of bold and are themselves findings.

### 4.2 Loud signals to quieter

Signals: oversaturated color, high-contrast everywhere, too many heavy elements competing, motion excess, no hierarchy because everything shouts.

- Verb: quieter.
- Owner: `foundations` for desaturation, neutral dominance and weight reduction, `motion` for cutting decorative animation.
- Accepted path: reduce saturation, let neutrals carry more, raise contrast only where it matters, replace dramatic motion with gentle feedback. The trap is collapsing to grayscale or killing all character. Quiet is precision, not absence.

### 4.3 Cluttered signals to distill

Signals: competing buttons, repeated information, too many colors and fonts and sizes, everything visible at once, unclear hierarchy, feature creep.

- Verb: distill.
- Owner: `interface` for the information architecture and the single primary goal, `foundations` for cutting the palette and type variants.
- Accepted path: find the one primary goal, hide complexity behind progressive disclosure, merge related actions, reduce to one primary action with the rest tertiary or hidden. The trap is removing necessary function or making the surface so sparse it turns unclear. Distill removes obstacles, not features.

### 4.4 Generic-everywhere signals to redesign

Signals: default or Inter-everywhere type, pure-black backgrounds, oversaturated or multiple accents, the purple-blue AI gradient, three equal feature cards, generic card look of border plus shadow plus white, no hover or active states, missing empty and error states.

- Verb: redesign.
- Owner: `interface` leads the upgrade direction, `foundations` carries type, color, layout and state tokens, `sk-code` implements without breaking the stack.
- Accepted path: scan the existing stack, diagnose every generic pattern and missing state, then apply targeted upgrades that work with the current framework rather than a rewrite. Order the work for impact over risk: type first, then palette cleanup, then states, then layout and spacing, then component swaps, then the missing empty and error states.

---

## 5. CONTENT-REALISM AND MECHANICAL-LAYOUT CHECKS

Two recurring generic signals have their own authored gates on the interface side. Do not re-document them here. Reference the interface gate and report the review-side finding.

- Content realism. Placeholder names like John Doe, round fake numbers, Acme-style company names, Lorem Ipsum, identical avatars and dates, AI copy cliches are a generic-content signal. The authored gate is `../../design-interface/references/design-process/copy_and_mock_data.md`. When the audit finds unrealistic mock content, file the finding against Anti-Patterns and route remediation through that gate, owned by `interface` for the content direction.

- Mechanical layout. Everything centered and symmetrical, three equal columns as the feature row, uniform card grids, identical vertical padding top and bottom, snap-to-grid placement with no rhythm are a mechanical-default signal. The authored gate is `../../design-interface/references/design-process/mechanical_defaults.md`. When the audit finds mechanical layout, file the finding against Anti-Patterns or Responsive as fits, and route remediation through that gate, owned by `foundations` for spacing and layout tokens and `interface` for the composition call.

These two checks are the review-side view of the interface authoring gates. The audit reports the defect and points at the gate. The interface and foundations modes own the actual transform.

---

## 6. ROUTING SUMMARY

1. Resolve the register before assigning any verb.
2. Match the finding to one verb, or step up to redesign when several findings stack.
3. Name the owner mode: interface for direction, foundations for tokens, motion for choreography.
4. State the accepted path as a direction, not an implementation.
5. Hand implementation to `sk-code` only after the user accepts the recommendation.

The audit chooses and routes the direction. It does not turn the dial.
