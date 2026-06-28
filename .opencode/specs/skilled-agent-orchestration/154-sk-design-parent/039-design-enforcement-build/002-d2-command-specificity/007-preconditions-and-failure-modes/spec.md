---
title: "D2-R7 — Preconditions & failure modes unnamed"
description: "Add preconditions{requiredInputKind,missingInputQuestion,cannotRunWhen,escalateIf,routeInstead} to command-metadata.json and generate Requires/Ask-first/Cannot-run/Escalate, banning status-only failure."
trigger_phrases:
  - "d2-r7 preconditions failure modes"
  - "preconditions design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D2-R7 — Preconditions & failure modes unnamed

## 1. OBJECTIVE
Name the inputs each `/design:*` command requires and what it does when they are missing or it cannot run.

## 2. WHY
Wrappers never declare required input kind, tool readiness, or named failure routes, so a missing URL/target/component just collapses to a bare status.

## 3. TARGET & CLASS
- **Target file(s):** `command-metadata.json` → `.opencode/commands/design/*.md`
- **Severity:** P1
- **Enforcement class:** hybrid
- **Dimension:** D2 — Command Specificity

## 4. BUILD OUTLINE
- Add `preconditions{requiredInputKind,missingInputQuestion,cannotRunWhen,escalateIf,routeInstead}` per command.
- Generate `Requires` / `Ask-first` / `Cannot-run` / `Escalate` sections.
- Ban status-only failure: every failure path names a cause and a route.

## 5. ACCEPTANCE
- Checker fails when a command lacks `preconditions` or emits a status-only failure with no named cause/route; passes otherwise.

## 6. EVIDENCE
- `commands/design/md-generator.md:26` — wrapper names no preconditions or failure routes.
- `design-md-generator/SKILL.md:354` — packet defines the readiness/failure detail the wrapper drops.
- Source: `research/research.md` §5 (D2-R7)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
