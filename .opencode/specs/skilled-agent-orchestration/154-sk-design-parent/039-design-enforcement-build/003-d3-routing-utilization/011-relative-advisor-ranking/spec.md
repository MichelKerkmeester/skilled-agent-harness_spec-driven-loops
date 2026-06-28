---
title: "D3-R11 — Relative advisor ranking (transport suppression)"
description: "Add rankBelowSkillIds to the playbook schema and scoreRelativeAdvisorRanking() in advisor-probe.cjs to gate sk-design #1 with transports ranked below."
trigger_phrases:
  - "d3-r11 relative advisor ranking"
  - "transport suppression design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D3-R11 — Relative advisor ranking (transport suppression)

## 1. OBJECTIVE
Add `rankBelowSkillIds` to the playbook schema and a `scoreRelativeAdvisorRanking()` check in `advisor-probe.cjs` that gates sk-design at rank #1 with figma / open-design transports ranked below it.

## 2. WHY
The deterministic advisor already returns sk-design #1 with transports at rank 3/5, but nothing guards that ordering. A relative-ranking gate keeps a transport from out-ranking the design-judgment skill on design prompts.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs` (+ playbook schema)
- **Severity:** P2
- **Enforcement class:** enforceable
- **Dimension:** D3 — Routing & Utilization

## 4. BUILD OUTLINE
- Add `rankBelowSkillIds` to the playbook schema.
- Implement `scoreRelativeAdvisorRanking()` in `advisor-probe.cjs`.
- Fail when a transport (figma/open-design) ranks at or above sk-design on a design prompt.

## 5. ACCEPTANCE
- `advisor-probe.cjs` passes when sk-design is #1 with transports below (today: #1, transports at 3/5) and fails a seeded ranking where a transport out-ranks sk-design.

## 6. EVIDENCE
- `advisor-probe.cjs:155` — probe scoring region where relative ranking attaches.
- Source: `research/research.md` §6 (D3-R11).

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
