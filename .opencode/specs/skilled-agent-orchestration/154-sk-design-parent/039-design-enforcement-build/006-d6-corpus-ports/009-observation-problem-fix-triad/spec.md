---
title: "D6-R9 — Observation/Problem/Fix finding triad"
description: "Add a neutral OBSERVATION slot before Problem/Fix to audit_contract.md + audit_report_template.md, with an optional proof_check.py --require-observation-triad."
trigger_phrases:
  - "d6-r9 observation problem fix triad"
  - "observation triad design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D6-R9 — Observation/Problem/Fix finding triad

## 1. OBJECTIVE
Add a neutral OBSERVATION slot ahead of Problem/Fix in the audit finding schema so each critique records what was seen before judging it.

## 2. WHY
designer-skills-main's critique-composition skill separates neutral observation from problem and fix. sk-design audits jump straight to Problem/Fix, which conflates seeing with judging and weakens reviewability.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/sk-design/design-audit/references/audit_contract.md`; `.opencode/skills/sk-design/design-audit/assets/audit_report_template.md`; `.opencode/skills/sk-design/shared/scripts/proof_check.py` (`--require-observation-triad`)
- **Severity:** P2
- **Enforcement class:** enforceable
- **Dimension:** D6 — Corpus Ports
- **Feeds:** D4

## 4. BUILD OUTLINE
- Add the OBSERVATION → PROBLEM → FIX triad to the audit contract and report template.
- Add `proof_check.py --require-observation-triad` to assert all three slots per finding.
- Keep the flag optional so legacy reports degrade gracefully.

## 5. ACCEPTANCE
- A finding missing the OBSERVATION slot fails under `--require-observation-triad`; a complete triad passes.

## 6. EVIDENCE
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/skills/critique-composition/SKILL.md:35` — "Output Format" defining the observation-first finding shape.
- Source: `research/research.md` §9 (D6-R9)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
