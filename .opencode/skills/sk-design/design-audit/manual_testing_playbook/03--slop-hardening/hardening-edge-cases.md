---
title: Hardening Edge Cases Scenario
description: Manual scenario verifying the production-readiness matrix probes extreme inputs, errors, permissions, concurrency and internationalization.
trigger_phrases:
  - "test hardening edge cases"
  - "test production readiness matrix"
  - "hardening edge cases scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# AUDIT-SLOP-003 | Hardening Edge Cases

## Target

Supply one concrete interactive artifact in the `<TARGET>` slot that takes input or fetches data, for example a form, a table or a submit flow: a source file path, a rendered URL or a screenshot. If no target is available, record SKIP with the blocker "no target artifact supplied". Do not invent failures.

## Prompt

`Audit <TARGET> for production readiness: extreme inputs, network errors, permissions, concurrency and internationalization.`

## Expected Process

1. Load `references/hardening_edge_cases.md` and `references/audit_contract.md`.
2. Walk the matrix against real evidence, labeling any probe that cannot run on the available evidence as inferred.
3. File each failure with the exact element, the user impact and a severity.
4. Route the owner: `foundations` for layout, logical-property and token fixes, `interface` for empty-state and error-state direction, `sk-code` for implementation.

## Pass Criteria

- Probes cover extreme inputs, API and network errors, permissions and rate limits, concurrency, internationalization and RTL, text expansion and CJK and emoji.
- A missing empty, loading or error state is filed as a production-readiness finding even when the happy path is flawless.
- Severity follows user impact: lost work or a stranded flow is P0 or P1, a cosmetic overflow with a workaround is P2 or P3.
- RTL failures trace to physical CSS properties and route to `foundations`. Double-submission is flagged when the action is not disabled while in flight.
- Resilience gaps that block assistive use route to Accessibility, with the disabled-control explanation pointing at `assets/a11y_quick_fixes.md`.
