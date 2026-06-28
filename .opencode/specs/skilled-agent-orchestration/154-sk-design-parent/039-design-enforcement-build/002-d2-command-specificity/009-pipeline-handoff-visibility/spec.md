---
title: "D2-R9 — No pipeline/handoff visibility across the five commands"
description: "Add pipeline{stage,acceptsFrom,produces,nextCommands,proofRequired} to command-metadata.json and emit STATUS=OK PRODUCES= NEXT= PROOF= / DEFER / ASK, recommend-only with no silent chaining."
trigger_phrases:
  - "d2-r9 pipeline handoff"
  - "pipeline handoff design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D2-R9 — No pipeline/handoff visibility across the five commands

## 1. OBJECTIVE
Make the design pipeline legible: each command states what it accepts, produces, and recommends next.

## 2. WHY
The five commands give no handoff visibility, so the md-generator→foundations/interface→motion→audit→sk-code flow is invisible at the command layer.

## 3. TARGET & CLASS
- **Target file(s):** `command-metadata.json` → `.opencode/commands/design/*.md`
- **Severity:** P1
- **Enforcement class:** hybrid
- **Dimension:** D2 — Command Specificity

## 4. BUILD OUTLINE
- Add `pipeline{stage,acceptsFrom,produces,nextCommands,proofRequired}` per command.
- Encode the flow md-generator→foundations/interface→motion→audit→sk-code.
- Emit `STATUS=OK PRODUCES= NEXT= PROOF=` / `DEFER` / `ASK`; recommend-only, never silently chain.

## 5. ACCEPTANCE
- Status tail carries PRODUCES/NEXT/PROOF; checker confirms no command auto-invokes its successor.

## 6. EVIDENCE
- `mode-registry.json:14` — routing data with no command-layer pipeline projection.
- `design-md-generator/SKILL.md:444` — packet handoff detail absent from the wrapper.
- Source: `research/research.md` §5 (D2-R9)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
