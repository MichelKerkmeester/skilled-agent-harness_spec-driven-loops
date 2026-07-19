---
title: sk-code Handoff Schema
description: Shared envelope for design-family handoffs to sk-code. Modes fill the fields they own before implementation begins.
trigger_phrases:
  - "sk-code handoff schema"
  - "design implementation handoff"
  - "design build manifest"
  - "audit backlog handoff"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# sk-code Handoff Schema

Shared envelope for `sk-design` modes when design decisions move to `sk-code` implementation. This file defines the contract shape. Each mode fills the subset it owns and keeps mode-specific judgment in its own packet.

---

## 1. OVERVIEW

### Purpose

Keep the design-to-build boundary explicit. `sk-design` decides the design, constraints and risks. `sk-code` implements the accepted handoff in the detected stack, verifies it and raises conflicts when the target surface cannot honor the card.

### Usage

Use this schema whenever a design mode hands a built UI, token system, audit backlog or motion spec to `sk-code`. A mode may add required fields, but it should not rename the shared envelope fields.

---

## 2. COMMON ENVELOPE

Every handoff card uses this order. Mark a field `N/A` only when the mode truly does not own it.

| Field | Required Content |
|---|---|
| **WHAT** | The deliverable being handed off: built UI, specified UI, token system, audit backlog or motion spec. Include the target surface and current state. |
| **LOCKED VALUES** | Exact values `sk-code` must use verbatim. Include colors, type roles, spacing, breakpoints, durations, easing, motion budget, copy strings or other pinned values. |
| **SIGNATURE MOVES** | Distinctive elements to preserve. Name the visual, structural or temporal moves that make the design specific. |
| **REUSE LIST** | Existing components, tokens, patterns, routes or systems to reuse. State what must not be rebuilt. |
| **IMPLEMENTATION MECHANISM / STACK BOUNDARY** | The library, framework or implementation mechanism that applies. State what `sk-code` owns and what the design mode already decided. |
| **OPEN RISKS / VERIFICATION** | Risks `sk-code` must check, with severity and owner. Include accessibility, responsive, performance, fidelity and residual uncertainty checks. |
| **NEVER-CHANGE** | Constraints `sk-code` must not alter, such as URLs, nav labels, form fields, legal copy, locked tokens, motion budget or component contracts. |

---

## 3. MODE EXTENSIONS

### Interface Build Manifest

Required when `interface` hands a built or specified UI to `sk-code`.

- **WHAT**: page, route, component or flow plus the one job of the surface.
- **LOCKED VALUES**: token system, type choices, color values, spacing scale, motion budget and reduced-motion expectations.
- **SIGNATURE MOVES**: the one memorable visual move and any supporting interaction details.
- **REUSE LIST**: existing design-system components, tokens and patterns to reuse before generating new UI.
- **OPEN RISKS / VERIFICATION**: pre-flight status, responsive checks, accessibility checks, screenshot or render fidelity needs.
- **NEVER-CHANGE**: URLs, nav labels, form field names, legal copy and any brief-pinned values.

### Foundations Handoff Card

Required when `foundations` hands a static visual system or token set to `sk-code`.

- **WHAT**: token system role, surface role and target platform context.
- **LOCKED VALUES**: CSS variables or theme-token names, OKLCH or fallback values, type scale, spacing scale, breakpoint intent and data-viz scales when present.
- **IMPLEMENTATION MECHANISM / STACK BOUNDARY**: target token format, CSS-variable strategy, breakpoint approach and what `sk-code` must implement without inventing new roles.
- **OPEN RISKS / VERIFICATION**: contrast, gamut, measure, responsive behavior, touch targets and unresolved source-evidence gaps.
- **NEVER-CHANGE**: semantic token roles, breakpoint intent and source system names.

### Audit Backlog Handoff Card

Required when accepted audit findings move to implementation.

- **WHAT**: accepted findings backlog. An audit with zero accepted findings still emits an empty valid backlog.
- **LOCKED VALUES**: finding id, severity, owner, target, evidence label, one-line fix shape and verification for each accepted finding.
- **IMPLEMENTATION MECHANISM / STACK BOUNDARY**: audit routes accepted findings only. It does not apply fixes or grant write authority.
- **OPEN RISKS / VERIFICATION**: per-finding check, residual uncertainty and owner for follow-up evidence.
- **NEVER-CHANGE**: finding severity, evidence caveat, legal copy, locked tokens and review boundary.

### Motion Handoff Field

Required on motion cards before implementation.

- **WHAT**: motion pattern, affected states and target component or flow.
- **LOCKED VALUES**: duration, easing, delay, reduced-motion fallback, motion budget and target properties.
- **IMPLEMENTATION MECHANISM / STACK BOUNDARY**: animation library or no-library path. State whether the implementation uses CSS transitions, Web Animations, View Transitions, `motion/react`, GSAP or an existing project system.
- **OPEN RISKS / VERIFICATION**: jank risk, compositor safety, reduced-motion behavior, exit coordination and frame-drop checks.
- **NEVER-CHANGE**: chosen library boundary, no mixed migration inside one interaction surface and no replacement of an existing animation system without approval.

---

## 4. HANDOFF RULES

1. **Design owns decisions.** `sk-code` implements the handed-off decision and raises conflicts instead of redesigning it silently.
2. **Values stay exact.** Locked values are copied verbatim unless implementation proves they fail accessibility or platform constraints.
3. **Reuse beats rebuild.** The reuse list is a constraint, not a suggestion.
4. **Audit routes only.** Audit handoffs create an implementation backlog and never apply fixes.
5. **Stack boundaries are real.** Motion and foundations handoffs name the mechanism so `sk-code` does not migrate or mix systems by accident.

---

## 5. CHILD USAGE

- `interface` uses this schema as the required build manifest for real UI handoff.
- `foundations` uses this schema as the final token-system handoff card.
- `audit` uses this schema as the accepted-finding backlog card, with zero-finding output allowed.
- `motion` uses this schema to record the implementation mechanism and animation stack boundary.
