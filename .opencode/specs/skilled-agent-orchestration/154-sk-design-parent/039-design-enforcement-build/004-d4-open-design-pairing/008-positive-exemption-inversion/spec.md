---
title: "D4-R8 — Positive two-token exemption; invert default-false to unclassified"
description: "Replace the boolean feeds_design_decision with a required openDesignPurpose (openDesignExemption vs skDesignGate); missing maps to unclassified and is denied for design."
trigger_phrases:
  - "d4-r8 positive exemption inversion"
  - "open design purpose design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D4-R8 — Positive two-token exemption; invert default-false to unclassified

## 1. OBJECTIVE
Replace the caller-supplied boolean default with a required `openDesignPurpose` taking two positive values — `openDesignExemption` (pure transport, forbids any later design use) vs `skDesignGate` (design-authorized) — and map a missing value to `unclassified`, which is denied for design.

## 2. WHY
The current `feeds_design_decision=False` default lets a caller opt out of the gate by omission. Inverting to a required positive purpose makes "no answer" fail closed instead of silently exempting.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/mcp-open-design/SKILL.md:164-175` + `tool_surface.md` policy
- **Severity:** P1
- **Enforcement class:** hybrid
- **Dimension:** D4 — mcp-open-design Pairing

## 4. BUILD OUTLINE
- Remove the boolean default and add the required `openDesignPurpose` field with two positive values.
- Make `openDesignExemption` forbid any later design use of the same artifact; `skDesignGate` requires a valid token.
- Map missing/unknown purpose to `unclassified` → denied for design at the gate.

## 5. ACCEPTANCE
- A call with no `openDesignPurpose` is treated as `unclassified` and DENIED for design; an `openDesignExemption` call that later feeds design is DENIED.

## 6. EVIDENCE
- `.opencode/skills/mcp-open-design/SKILL.md:171` — the `feeds_design_decision=False` default this inverts.
- Source: `research/research.md` §7 (D4-R8)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
