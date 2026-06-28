---
title: "D4-R7 — Cross-child laundering guard: mandatory token in dispatch + child re-validate + demand-back"
description: "Add a separate required DESIGN_PROOF_TOKEN block to a shared design_delegation_payload.md and have child PreToolUse re-validate before start_run."
trigger_phrases:
  - "d4-r7 cross-child laundering guard"
  - "child re-validate design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D4-R7 — Cross-child laundering guard: mandatory token in dispatch + child re-validate + demand-back

## 1. OBJECTIVE
Make the `DESIGN_PROOF_TOKEN` a mandatory, separate dispatch block (not optional Agent I/O evidence) in a shared `design_delegation_payload.md` required by all cli-*, and have the child's PreToolUse re-validate the token before `start_run`, with a parent-side demand-back.

## 2. WHY
A parent can launder design intent through a sub-agent if the token is optional or merely advisory. A mandatory dispatch block plus child re-validation closes the cross-child bypass and proves the child did not fabricate authorization.

## 3. TARGET & CLASS
- **Target file(s):** new shared `references/design_delegation_payload.md` imported by `cli-*/SKILL.md` + `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:174`
- **Severity:** P1
- **Enforcement class:** hybrid
- **Dimension:** D4 — mcp-open-design Pairing

## 4. BUILD OUTLINE
- Define a separate required `DESIGN_PROOF_TOKEN` dispatch block (distinct from optional Agent I/O evidence).
- Require all cli-* skills to import `design_delegation_payload.md`.
- Add child-side PreToolUse re-validation before `start_run` and a parent-side demand-back of the transport result.

## 5. ACCEPTANCE
- A child `start_run` with a missing/altered token is DENIED at the child boundary, and a dispatch lacking the mandatory token block is refused before launch.

## 6. EVIDENCE
- `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:174` — the dispatch/evidence contract the separate mandatory token block must extend (not reuse as optional).
- Source: `research/research.md` §7 (D4-R7)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
