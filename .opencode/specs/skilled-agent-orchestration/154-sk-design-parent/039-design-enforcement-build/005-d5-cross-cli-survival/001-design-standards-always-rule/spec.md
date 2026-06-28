---
title: "D5-R1 — Design Standards Loading ALWAYS baseline rule (twin of code-standards)"
description: "Add a short Design Standards Loading ALWAYS entry beside the existing code-standards rule in all 3 cli-* SKILLs."
trigger_phrases:
  - "d5-r1 design standards always rule"
  - "design standards loading design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D5-R1 — Design Standards Loading ALWAYS baseline rule (twin of code-standards)

## 1. OBJECTIVE
Add a short `Design Standards Loading` ALWAYS entry beside the existing `Code Standards Loading` rule in each of the three cli-* SKILLs, so a dispatched child loads `sk-design` and runs ground → token-system → critique whenever the task feeds a design decision — firing independent of router keyword hits.

## 2. WHY
Router intent matching is phrasing-dependent and can miss. The code-standards rule already survives dispatch this way for code; design has no equivalent deterministic net, so a design dispatch phrased outside the keyword set reaches the child with no judgment loaded.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/cli-opencode/SKILL.md`, `.opencode/skills/cli-codex/SKILL.md`, `.opencode/skills/cli-claude-code/SKILL.md`
- **Severity:** P0
- **Enforcement class:** enforceable
- **Dimension:** D5 — Cross-CLI Survival

## 4. BUILD OUTLINE
- Author the `Design Standards Loading` ALWAYS entry as the exact twin of the code-standards rule (load `sk-design`, resolve register + mode bundle, run the design verification).
- Insert it beside the code-standards rule in all three cli-* ALWAYS blocks, keeping wording parallel across siblings.
- Keep it surface-aware and phrasing-independent, mirroring the code-standards fallback when the surface is uncertain.

## 5. ACCEPTANCE
- A static token lint finds a `Design Standards Loading` ALWAYS rule present in all three cli-* SKILLs with parallel wording; a sibling missing it fails the parity check.

## 6. EVIDENCE
- `.opencode/skills/cli-codex/SKILL.md:359` — existing `Code Standards Loading` ALWAYS rule (the twin pattern to clone); same rule at `cli-claude-code/SKILL.md:354` and `cli-opencode/SKILL.md:328`.
- Source: `research/research.md` §8 (D5-R1)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
