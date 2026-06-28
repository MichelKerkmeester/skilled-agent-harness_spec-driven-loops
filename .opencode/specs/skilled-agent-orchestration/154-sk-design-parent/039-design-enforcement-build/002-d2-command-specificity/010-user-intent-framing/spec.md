---
title: "D2-R10 — Command-as-mode framing leads with Thin bridge / Pin mode not user intent"
description: "Add userIntent{job,ownedSignals} plus a copyGuard to command-metadata.json so wrappers lead with the user job and move mode-binding into an Internal binding section."
trigger_phrases:
  - "d2-r10 user intent framing"
  - "user intent framing design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D2-R10 — Command-as-mode framing leads with Thin bridge / Pin mode not user intent

## 1. OBJECTIVE
Reframe each `/design:*` wrapper to lead with the user's job, demoting the mode-binding to an internal section.

## 2. WHY
Wrappers open with "Thin bridge / Pin mode" implementation framing instead of the user intent the command serves.

## 3. TARGET & CLASS
- **Target file(s):** `command-metadata.json` → `.opencode/commands/design/*.md`
- **Severity:** P2
- **Enforcement class:** hybrid
- **Dimension:** D2 — Command Specificity

## 4. BUILD OUTLINE
- Add `userIntent{job,ownedSignals}` + a `copyGuard` per command.
- Generate the wrapper lead from the user job; move mode-binding to an `Internal binding` section.
- Checker bans bridge-first phrases via the copyGuard corpus.

## 5. ACCEPTANCE
- Checker fails when a wrapper leads with a banned bridge-first phrase; passes when it leads with the user job (wording remains advisory).

## 6. EVIDENCE
- `commands/design/interface.md:9` — wrapper leads with thin-bridge/pin-mode framing, not user intent.
- Source: `research/research.md` §5 (D2-R10)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
