---
title: "D5-R8 — Treat Agent I/O as advisory-only; never read its absence as proof"
description: "Document in the cli-* design contracts that Agent I/O may carry digests but is never the gate; its absence must not pass an Open Design handoff."
trigger_phrases:
  - "d5-r8 agent io advisory only"
  - "agent io advisory design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D5-R8 — Treat Agent I/O as advisory-only; never read its absence as proof

## 1. OBJECTIVE
Document in the three cli-* design contracts that the Agent I/O envelope may opportunistically carry manifest/result digests but is never the authority gate — and that its absence must never be read as a passing Open Design handoff.

## 2. WHY
Agent I/O is `optional-advisory` by contract; absence of a header is explicitly never a refusal condition. If a checker treats a present Agent I/O envelope as proof, a child can pass simply by omitting it — inverting the gate.

## 3. TARGET & CLASS
- **Target file(s):** the design-contract sections of `.opencode/skills/cli-opencode/SKILL.md`, `.opencode/skills/cli-codex/SKILL.md`, `.opencode/skills/cli-claude-code/SKILL.md` (referencing `agent-io-contract.md`)
- **Severity:** P2
- **Enforcement class:** hybrid
- **Dimension:** D5 — Cross-CLI Survival

## 4. BUILD OUTLINE
- State in each cli-* design contract that Agent I/O digests are advisory hints, not the gate.
- Make the parent re-validation (D5-R2) authoritative; Agent I/O absence is never a pass.
- Cross-reference `agent-io-contract.md` so the advisory-only stance stays single-sourced.

## 5. ACCEPTANCE
- The cli-* contracts explicitly mark Agent I/O as advisory-only; a handoff that relies solely on Agent I/O presence/absence (no transport result) is rejected by the parent re-validation.

## 6. EVIDENCE
- `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:22` — `status: optional-advisory`; line 26 — "Absence of any dispatch header or result envelope is never a refusal condition."
- Source: `research/research.md` §8 (D5-R8)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
