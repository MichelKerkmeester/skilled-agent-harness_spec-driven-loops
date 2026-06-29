---
description: Design QA: accessibility, performance, responsive, anti-slop, scoring, hardening. sk-design audit mode.
argument-hint: "<target> [--scope] [--score]"
allowed-tools: Read, Glob, Grep
---

# /design:audit

Thin bridge into the `sk-design` parent skill's `audit` mode.

## 1. PURPOSE

Pin the `audit` mode of the `sk-design` parent hub to audit and harden design quality. The hub owns routing
across modes; this command loads the `audit` mode directly. If the request spans more
than `audit`, defer to the hub's routing instead of forcing this mode.

<!-- ANCHOR:sibling-discriminator -->
## 2. WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is to review, score, or harden an existing design surface.
- **Prefer `/design:foundations` when** the request is to create or repair a static token system, palette, typography, layout, or spacing plan.
- **Prefer `/design:interface` when** the request is to invent a new visual direction, interface concept, or signature surface.
- **Prefer `/design:md-generator` when** the request is to extract measured CSS from a live site into a Style Reference DESIGN.md.
- **Prefer `/design:motion` when** the request is to create animation choreography, transitions, or micro-interaction behavior.
- **Defer to the `sk-design` hub when** the request asks for new direction, static system design, or motion choreography rather than quality review.
<!-- /ANCHOR:sibling-discriminator -->

## 3. INSTRUCTIONS

### Step 1: Load and apply the mode
- Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table and the
  shared references under `shared/`.
- Read `.opencode/skills/sk-design/design-audit/SKILL.md` -- the `audit` mode contract
  -- and load its `references/` and assets as the work requires.
- Apply the `audit` mode to `$ARGUMENTS`, following its workflow and quality gates.

### Step 2: Return Status
- Success: `STATUS=OK`
- Failure: `STATUS=FAIL ERROR="<message>"`

## 4. EMIT DELIVERABLE

Emit `Design Quality Audit Report` as the primary deliverable.

Required fields:
- `target`
- `evidenceInventory`
- `severityFindings`
- `qualityScore`

## 5. EXAMPLE

```
/design:audit src/components/Checkout.tsx --scope a11y --score
```

Returns: a findings-first design quality report with evidence, scores, owners, and verification notes
