---
title: "D2-R2 — Generic <design request> arg-hint → per-mode arg grammar"
description: "Replace the identical generic argument-hint with a per-mode argumentHint in command-metadata.json, projected to and drift-checked against the /design:* wrappers."
trigger_phrases:
  - "d2-r2 arg grammar"
  - "arg grammar design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D2-R2 — Generic <design request> arg-hint → per-mode arg grammar

## 1. OBJECTIVE
Give every `/design:*` command a real, mode-specific argument grammar so the hint tells the user exactly what to pass.

## 2. WHY
All five wrappers carry the identical placeholder `argument-hint: "<design request>"`, which teaches the caller nothing about the inputs each mode actually consumes.

## 3. TARGET & CLASS
- **Target file(s):** `command-metadata.json` → `.opencode/commands/design/*.md`
- **Severity:** P0
- **Enforcement class:** enforceable
- **Dimension:** D2 — Command Specificity

## 4. BUILD OUTLINE
- Add `argumentHint` per mode: md-generator `<live-url> --output <dir>`, audit `<target> [--scope] [--score]`, motion `<component-state> [--library]`, foundations `<axis> <target>`, interface `<target> [--mode]`.
- Generate the wrapper hint from metadata and drift-check it.
- Checker fails any wrapper still carrying the generic `<design request>`.

## 5. ACCEPTANCE
- Checker exits non-zero if any wrapper hint equals `<design request>` or disagrees with metadata; zero otherwise.

## 6. EVIDENCE
- `commands/design/audit.md:3` — audit wrapper ships the generic placeholder arg-hint.
- Source: `research/research.md` §5 (D2-R2)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
