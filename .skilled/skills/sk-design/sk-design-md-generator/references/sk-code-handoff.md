---
title: sk-code Handoff Schema
description: Envelope for handing an accepted Style Reference from the design-reference extraction to sk-code implementation.
trigger_phrases:
  - "sk-code handoff schema"
  - "design implementation handoff"
  - "design build manifest"
importance_tier: normal
contextType: general
version: 1.1.0.0
---

# sk-code Handoff Schema

Envelope for when an extracted Style Reference DESIGN.md moves to `sk-code` implementation. This file defines the contract shape; the extraction fills the subset it owns and keeps extraction judgment in this skill.

---

## 1. OVERVIEW

### Purpose

Keep the design-to-build boundary explicit. This skill decides the measured design reference, its locked values, and its risks. `sk-code` implements the accepted handoff in the detected stack, verifies it, and raises conflicts when the target surface cannot honor the card.

### Usage

Use this schema whenever an accepted Style Reference (measured tokens, components, and provenance) is handed to `sk-code`. Add required fields as needed, but do not rename the shared envelope fields.

---

## 2. COMMON ENVELOPE

Every handoff card uses this order. Mark a field `N/A` only when the extraction truly does not own it.

| Field | Required Content |
|---|---|
| **WHAT** | The deliverable being handed off: the Style Reference DESIGN.md plus its token data. Include the source surface and current state. |
| **LOCKED VALUES** | Exact measured values `sk-code` must use verbatim: colors, type roles, spacing, breakpoints, durations, easing, copy strings, or other pinned values. |
| **SIGNATURE MOVES** | Distinctive elements the reference captured. Name the visual, structural, or temporal moves that make the source specific. |
| **REUSE LIST** | Existing components, tokens, patterns, routes, or systems to reuse. State what must not be rebuilt. |
| **IMPLEMENTATION MECHANISM / STACK BOUNDARY** | The library, framework, or implementation mechanism that applies. State what `sk-code` owns and what the reference already decided. |
| **OPEN RISKS / VERIFICATION** | Risks `sk-code` must check, with severity and owner: accessibility, responsive, performance, fidelity, and residual uncertainty (including any inferred-vs-measured token). |
| **NEVER-CHANGE** | Constraints `sk-code` must not alter: URLs, nav labels, form fields, legal copy, locked tokens, or component contracts. |

---

## 3. EXTRACTION HANDOFF NOTE

A Style Reference handoff carries the provenance the extraction recorded. Every LOCKED VALUE traces to a source observation, and any value the reference labeled inferred (not measured) is flagged as an OPEN RISK so `sk-code` never treats an inferred token as ground truth.

---

## 4. HANDOFF RULES

1. **Design owns decisions.** `sk-code` implements the handed-off decision and raises conflicts instead of redesigning it silently.
2. **Values stay exact.** Locked measured values are copied verbatim unless implementation proves they fail accessibility or platform constraints.
3. **Reuse beats rebuild.** The reuse list is a constraint, not a suggestion.
4. **Provenance travels.** Measured-vs-inferred labels survive the handoff; `sk-code` verifies inferred values before relying on them.
5. **Stack boundaries are real.** The handoff names the mechanism so `sk-code` does not migrate or mix systems by accident.
