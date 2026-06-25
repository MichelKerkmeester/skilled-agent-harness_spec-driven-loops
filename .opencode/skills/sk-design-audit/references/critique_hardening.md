---
title: Critique And Hardening
description: Holistic critique, cognitive load, Nielsen heuristics, personas, polish, edge cases, i18n, errors, empty/loading states, and resilience checks.
trigger_phrases:
  - "design critique"
  - "cognitive load"
  - "Nielsen heuristics"
  - "production hardening"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Critique And Hardening

Use this reference when the task is broader than a technical scan: does the interface make sense, feel intentional, survive real data, and help the right users succeed?

## 1. Critique Workflow

1. Resolve the target to a concrete source path, URL, screenshot, or design plan.
2. Review the design holistically before reading deterministic findings if both are available.
3. Evaluate AI slop, hierarchy, information architecture, emotional fit, states, copy, accessibility, and edge cases.
4. Synthesize; do not concatenate independent notes.

## 2. Cognitive Load

Check:
- Single focus: one primary task visible.
- Chunking: groups of four or fewer where possible.
- Grouping: related items visually close or in a common region.
- Visual hierarchy: primary, secondary, and supporting content are clear.
- One decision at a time.
- Minimal visible choices.
- No memory bridge across screens.
- Progressive disclosure where complexity is not immediately needed.

Map failures to severity on a two-band scale: 2-3 failures = P2 (address soon); 4 or more failures = P1 (high cognitive load).

## 3. Nielsen Heuristic Lens

Walk the 10 heuristics as a checklist; for each clear violation, file a P0-P3 finding with evidence. Do not assign per-heuristic numeric scores.
1. Visibility of system status.
2. Match between system and real world.
3. User control and freedom.
4. Consistency and standards.
5. Error prevention.
6. Recognition rather than recall.
7. Flexibility and efficiency.
8. Aesthetic and minimalist design.
9. Error recovery.
10. Help and documentation.

The Nielsen lens is a diagnostic to surface findings; it is NOT separately totaled. Each heuristic violation becomes a P0-P3 finding feeding the relevant /20 dimension (mostly Accessibility, Responsive, or Anti-Patterns). There is no /40 score in this skill.

## 4. Persona Checks

Select two or three relevant personas:
- Power user: shortcuts, batch work, no forced hand-holding.
- First-timer: clear first action, labels, help, no unexplained jargon.
- Accessibility-dependent user: keyboard, screen reader, focus, contrast.
- Stress tester: edge inputs, refresh, long data, errors.
- Distracted mobile user: thumb reach, interruptions, slow connection, tap targets.

Report red flags tied to actual elements, not generic persona descriptions.

## 5. Hardening Checks

Real interfaces need hostile data tests:
- Very long/short text.
- Empty states and no results.
- 1000+ items and pagination or virtualization.
- Emoji, accents, CJK, RTL.
- German or Finnish text expansion.
- Offline, timeout, 401/403/404/429/500.
- Concurrent submissions and double-clicks.
- Permission states and read-only mode.

## 6. Polish Checks

Polish starts with design-system discovery. For drift, name the root cause:
- Missing token.
- One-off implementation.
- Conceptual misalignment.

Then check spacing, optical alignment, typography, states, copy, icons, forms, edge cases, responsiveness, performance, and code cleanliness.

## 7. Evidence Limits

A clean detector result is not proof of a strong design. Browser/rendered evidence and human judgment still matter for hierarchy, emotional fit, slop, and flow shape.
