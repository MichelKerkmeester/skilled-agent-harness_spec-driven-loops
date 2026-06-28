---
title: "D5-R6 — Reject register=unknown at dispatch; hoist compact manifest to per-skill contract"
description: "Promote the cli-opencode Template 16 compact Context Manifest into a copied per-skill contract across cli-*, and reject register=unknown before dispatch."
trigger_phrases:
  - "d5-r6 reject register unknown"
  - "compact manifest parity design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D5-R6 — Reject register=unknown at dispatch; hoist compact manifest to per-skill contract

## 1. OBJECTIVE
Promote the compact Context Manifest block from cli-opencode Template 16 into a copied per-skill design contract present in all three cli-*, and forbid dispatching a design task while `register=unknown` (Brand vs Product unresolved).

## 2. WHY
The compact manifest lives in only one sibling today, so codex/claude-code dispatches carry no register/mode block. And `register=unknown` means no design judgment was actually resolved — dispatching it ships ambiguity into a child that cannot resolve it.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/cli-opencode/assets/prompt_templates.md` (Template 16) → copied contract in `cli-codex` + `cli-claude-code`; pre-dispatch register check in all 3 cli-*
- **Severity:** P1
- **Enforcement class:** hybrid
- **Dimension:** D5 — Cross-CLI Survival

## 4. BUILD OUTLINE
- Extract the compact Context Manifest block into a copied per-skill reference so each cli-* carries it.
- Add a parity checker that fails if only one sibling defines the block.
- Add a pre-dispatch guard that refuses (or ASKs) when `register` resolves to `unknown`.

## 5. ACCEPTANCE
- A parity check finds the compact manifest in all three cli-*; a dispatch attempt with `register=unknown` is refused or escalated before launch.

## 6. EVIDENCE
- `.opencode/skills/cli-opencode/assets/prompt_templates.md:587` — the `Register: <Brand | Product | unknown ...>` field in the Template 16 compact Context Manifest (the block to hoist and the `unknown` value to reject).
- Source: `research/research.md` §8 (D5-R6)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
