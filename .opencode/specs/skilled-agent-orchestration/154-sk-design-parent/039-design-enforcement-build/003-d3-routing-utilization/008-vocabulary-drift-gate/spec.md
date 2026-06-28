---
title: "D3-R8 — Four-copy vocabulary-drift gate"
description: "Add a parent-hub-vocab-sync Vitest+CLI, modeled on sk-code-router-sync, projecting vocabulary across the four copies and failing on drift."
trigger_phrases:
  - "d3-r8 vocabulary drift gate"
  - "parent hub vocab sync design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D3-R8 — Four-copy vocabulary-drift gate

## 1. OBJECTIVE
Add a new `parent-hub-vocab-sync` Vitest + CLI, modeled on the existing `sk-code-router-sync`, that builds a classified projection across the four vocabulary copies — graph-metadata `trigger_phrases`, hub keywords, registry aliases, packet `INTENT_SIGNALS` — and fails on divergence.

## 2. WHY
The same routing vocabulary lives in four places with no gate keeping them in sync; drift silently degrades routing. The proven `sk-code-router-sync` pattern already enforces this shape for code routing.

## 3. TARGET & CLASS
- **Target file(s):** new `parent-hub-vocab-sync` test+CLI under `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/` (model: `.../tests/sk-code-router-sync.vitest.ts`)
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D3 — Routing & Utilization

## 4. BUILD OUTLINE
- Clone the `sk-code-router-sync` structure for the parent hub.
- Project a classified vocabulary across the four copies.
- Fail the test/CLI when any copy diverges from the projection.

## 5. ACCEPTANCE
- `parent-hub-vocab-sync` passes when the four copies agree and fails when a seeded trigger_phrase / alias mismatch is introduced.

## 6. EVIDENCE
- `sk-code-router-sync.vitest.ts:5` — the proven sync pattern to model the new gate on.
- Source: `research/research.md` §6 (D3-R8).

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
