---
title: "D2-R12 — High-value task verbs buried in references/aliases"
description: "Promote typeset/colorize/bolder/quieter/distill/harden/polish/delight as command-visible task projections (not new modes) in command-metadata.json, rejecting command creep via a negative corpus."
trigger_phrases:
  - "d2-r12 task verbs"
  - "task verbs design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D2-R12 — High-value task verbs buried in references/aliases

## 1. OBJECTIVE
Make high-value transform verbs visible as task projections of existing commands, without spawning new modes.

## 2. WHY
Verbs like typeset, colorize, bolder, quieter, distill, harden, polish, and delight are buried in references and aliases, invisible at the command surface.

## 3. TARGET & CLASS
- **Target file(s):** `command-metadata.json` (task projections) → `.opencode/commands/design/*.md`
- **Severity:** P2
- **Enforcement class:** advisory
- **Dimension:** D2 — Command Specificity

## 4. BUILD OUTLINE
- Promote the verbs as command-visible task projections (NOT new modes), each with ownerModes, strictness, referenceSources, requires, and fixtures.
- Reject command creep via a negative corpus that bans new top-level commands for these verbs.
- **Candidate nested sub-phases (materialize at execution):** group the eight verbs by ownerMode into per-mode projection batches.

## 5. ACCEPTANCE
- Each verb maps to an ownerMode task projection; negative corpus rejects any attempt to mint a verb as a standalone command (call stays advisory).

## 6. EVIDENCE
- `design-audit/references/transform_remediation.md:22` — high-value transform verbs buried in references.
- Source: `research/research.md` §5 (D2-R12)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
