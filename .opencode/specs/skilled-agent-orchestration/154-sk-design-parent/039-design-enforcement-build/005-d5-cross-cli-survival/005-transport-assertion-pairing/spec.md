---
title: "D5-R5 — OPEN_DESIGN_TRANSPORT_ASSERTION v1 child-resident pairing rule"
description: "Add an Open Design Transport Pairing (child-resident) ALWAYS rule with assertion fields to all 3 cli-* SKILLs."
trigger_phrases:
  - "d5-r5 transport assertion pairing"
  - "child-resident pairing design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D5-R5 — OPEN_DESIGN_TRANSPORT_ASSERTION v1 child-resident pairing rule

## 1. OBJECTIVE
Add an `Open Design Transport Pairing (child-resident)` ALWAYS rule to all three cli-* SKILLs carrying an `OPEN_DESIGN_TRANSPORT_ASSERTION v1` (childLoadedSkills, operationClass, liveToolsListVerified, payloadDigests), so the child self-asserts pairing before any Open Design op.

## 2. WHY
The parent's pairing precondition lives in mcp-open-design, which the child cannot resolve across the CLI boundary. A child-resident assertion re-states the precondition where the child can actually honor it and hands the parent digests to re-validate.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/cli-opencode/SKILL.md`, `.opencode/skills/cli-codex/SKILL.md`, `.opencode/skills/cli-claude-code/SKILL.md`
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D5 — Cross-CLI Survival

## 4. BUILD OUTLINE
- Define the assertion fields (childLoadedSkills, operationClass, liveToolsListVerified, payloadDigests).
- Add the child-resident pairing ALWAYS rule to all three cli-* with parallel wording.
- Pair the assertion with the D5-R2 transport result so the parent can re-validate its digests.

## 5. ACCEPTANCE
- A static token lint finds the child-resident pairing rule + assertion fields present in all three cli-*; the assertion's `payloadDigests` reconcile against the returned transport result.

## 6. EVIDENCE
- `.opencode/skills/mcp-open-design/SKILL.md:21` — the parent MANDATORY PAIRING precondition the child-resident assertion mirrors across the dispatch boundary.
- Source: `research/research.md` §8 (D5-R5)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
