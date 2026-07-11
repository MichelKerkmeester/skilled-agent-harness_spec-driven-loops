---
title: "Implementation Plan: Plugin & hook opportunities from existing skills"
description: "Research method for the two-model deep-research fan-out that inventoried existing repo skills and produced a ranked, cross-checked backlog of candidate OpenCode plugins and Claude hooks. No production code."
trigger_phrases:
  - "plugin hook research method"
  - "two model deep research fan-out"
  - "plugin hook backlog plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/000-plugin-hook-opportunities"
    last_updated_at: "2026-07-11T09:03:29.363Z"
    last_updated_by: "spec-author"
    recent_action: "Documented the two-model deep-research fan-out method that produced the ranked backlog"
    next_safe_action: "Consume the ranked backlog in implementation phases 001-007"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Plugin & hook opportunities from existing skills

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep research via opencode CLI dispatch; no production code |
| **Framework** | system-deep-loop fan-out driver (`fanout-run`) |
| **Storage** | Append-only JSONL state plus per-iteration markdown under `research/` |
| **Testing** | Convergence guards, source-diversity and focus-alignment checks |

### Overview
A two-model deep-research fan-out inventoried existing repo skills and ranked candidate OpenCode plugins and Claude hooks. The method ran two independent convergent loops, `zai-coding-plan/glm-5.2` at reasoning max and `openai/gpt-5.6-sol-fast` at reasoning high, through the deep-loop driver, then synthesized and cross-checked them into one decision-ready backlog. This phase ships no production code and no runtime surface changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (opencode CLI plus both providers)

### Definition of Done
- [x] All acceptance criteria met (ranked, evidence-cited backlog delivered)
- [x] Convergence reached on both lineages (research is loop-based, not test-based)
- [x] Docs updated (spec, plan, tasks, and the `research/research.md` synthesis)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-model deep-research fan-out: two independent convergent loops plus a cross-model synthesis step.

### Key Components
- **GLM-5.2 lineage**: reasoning max, 5 iterations, converged as newInfoRatio decayed from 1.0 to 0.3
- **GPT-5.6-sol lineage**: reasoning high, 3 iterations, converged as newInfoRatio decayed from 1.0 to 0.72
- **Synthesis layer**: merges both lineages, ranks candidates by value, feasibility, and blast radius, and surfaces cross-model disagreements

### Data Flow
The deep-loop driver seeds each lineage with the same question. Each loop iterates its own findings registry and deltas until its convergence guard fires. The synthesis step then merges both lineages and cross-checks them into `research/research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Research packet initialized with the question and scope
- [x] opencode CLI and both providers confirmed in pre-flight
- [x] Deep-loop fan-out driver configured for two lineages

### Phase 2: Research Execution
- [x] Ran the GLM-5.2 lineage to convergence over 5 iterations
- [x] Ran the GPT-5.6-sol lineage to convergence over 3 iterations
- [x] Synthesized both lineages and cross-checked findings

### Phase 3: Verification
- [x] Convergence confirmed on both lineages
- [x] Ranked backlog cross-checked across both model families
- [x] Synthesis captured in `research/research.md` with per-lineage citations
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Convergence | Per-lineage newInfoRatio decay | Deep-loop convergence guard |
| Corroboration | Cross-model agreement and disagreement | Two-model synthesis step |
| Source diversity | Each candidate cites a real skill path | Deep-loop source-diversity and focus-alignment guards |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| opencode CLI | External | Green | Cannot dispatch either lineage |
| zai-coding-plan/glm-5.2 provider | External | Green | GLM lineage cannot run |
| openai/gpt-5.6-sol-fast provider | External | Green | GPT lineage cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research findings prove unusable or a lineage fails to converge.
- **Procedure**: Research output is additive and lives entirely under `research/`. Discard the folder to revert. This phase changes no production code and no runtime surface, so there is nothing else to undo.
<!-- /ANCHOR:rollback -->
