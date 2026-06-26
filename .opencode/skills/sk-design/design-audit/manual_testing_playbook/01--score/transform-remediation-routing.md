---
title: Transform Remediation Routing Scenario
description: Manual scenario verifying register-gated directional verbs map to the right finding, owner mode and accepted remediation path.
trigger_phrases:
  - "test transform remediation"
  - "test bolder quieter distill routing"
  - "transform routing scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# AUDIT-SCORE-002 | Transform Remediation Routing

## Target

Supply one concrete artifact in the `<TARGET>` slot that reads as bland, loud, cluttered or generic: a source file path, a rendered URL, a screenshot or a design plan. State the register (Brand or Product) when you know it, since the same observation routes to a different verb by posture. If no target is available, record SKIP with the blocker "no target artifact supplied". Do not invent a surface or a verdict.

## Prompt

`Audit <TARGET>, then tell me whether it needs to be bolder, quieter or distilled, and who owns the fix.`

## Expected Process

1. Resolve the register from `../shared/register.md` before assigning any verb.
2. Load `references/transform_remediation.md` and `references/audit_contract.md`.
3. Match the observed finding to one verb (bolder, quieter, distill) or step up to redesign when several findings stack.
4. Name the owner mode and state the accepted path as a direction, not an implementation.

## Pass Criteria

- The register is resolved first, and the verdict reflects the posture (a flat Brand surface routes toward distinctiveness, a flat Product surface routes toward clarity only).
- One verb is chosen per finding, with redesign reserved for several stacked findings.
- The owner mode is named: `interface` for direction, `foundations` for tokens, `motion` for choreography.
- The accepted path reads as a direction, and implementation is deferred to `sk-code` after the user accepts.
- Content-realism and mechanical-layout findings route to the authored interface gates rather than being re-documented inline.
