---
title: Anti-Slop And Production Hardening Scenario
description: Manual scenario verifying AI-slop detection, critique, copy clarity, pseudo-element checks, and hardening behavior.
trigger_phrases:
  - "test anti-slop audit"
  - "test production hardening"
  - "slop hardening scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# AUDIT-SLOP-001 | Anti-Slop And Production Hardening

## Prompt

`Critique this landing page for AI-generated design tells, unclear copy, brittle edge cases, and production hardening gaps.`

## Expected Process

1. Load `references/critique_hardening.md`, `references/anti_patterns_production.md`, and `references/audit_contract.md`.
2. Check anti-slop signals, cognitive load, copy clarity, edge cases, i18n, pseudo-elements, and theming drift.
3. Map findings to sibling owners.

## Pass Criteria

- Starts anti-pattern verdict with concrete tells.
- Includes hardening checks for long text, empty/error/loading states, and localization/RTL risk.
- Does not confuse critique with implementation.
- Provides concrete next actions by owner.
