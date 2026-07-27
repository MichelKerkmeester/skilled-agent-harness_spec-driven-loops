---
title: "Verification Checklist: /interface:design command decomposition research"
description: "Verification checklist for the two 10-iteration deep-research lineages (cli-devin/glm-5-2, cli-cursor/composer-2.5), their converged syntheses, and the cross-lineage comparison."
trigger_phrases:
  - "design command decomposition research checklist"
  - "interface design command split checklist"
  - "sk-design command surface research checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/013-design-command-decomposition-research"
    last_updated_at: "2026-07-27T14:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored verification checklist, no item checked yet"
    next_safe_action: "Verify CHK-001 once Phase 1 lands"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: /interface:design command decomposition research
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The five research questions and hard constraint text are identical across both lineages' iteration framing before dispatch
  - **Evidence (planned):** diff of each lineage's iteration-prompt framing against `spec.md`'s Research Questions and Hard Constraint sections
- [ ] CHK-002 [P0] The shared evidence base (`design-interface/SKILL.md` lane structure, `INTENT_SIGNALS`, `RESOURCE_MAP`) is snapshotted before either lineage starts
  - **Evidence (planned):** snapshot recorded in `research/lineages/` setup notes
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality [lineage execution]

- [ ] CHK-010 [P0] Lineage A (`cli-devin` · `glm-5-2`) completes 10 forced iterations with no early convergence stop
  - **Evidence (planned):** iteration count under `research/lineages/glm/`
- [ ] CHK-011 [P0] Lineage B (`cli-cursor` · `composer-2.5`) completes 10 forced iterations with no early convergence stop
  - **Evidence (planned):** iteration count under `research/lineages/composer/`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing [synthesis quality]

- [ ] CHK-020 [P0] Lineage A's synthesis ranks recommendations by value-to-cost with explicit confidence per item
  - **Evidence (planned):** read-through of `research/lineages/glm/` synthesis document
- [ ] CHK-021 [P0] Lineage B's synthesis ranks recommendations by value-to-cost with explicit confidence per item
  - **Evidence (planned):** read-through of `research/lineages/composer/` synthesis document
- [ ] CHK-022 [P0] Both syntheses carry an explicit "not worth doing" section
  - **Evidence (planned):** read-through of both synthesis documents
- [ ] CHK-023 [P1] Every recommendation ranked above "not worth doing" states a demonstrated current problem, the smallest fix, and its cost — no "split it because it's big" reasoning
  - **Evidence (planned):** spot-check of each ranked recommendation against the hard constraint
- [ ] CHK-024 [P1] Both syntheses explicitly address all five research questions, including "no evidence found" where applicable
  - **Evidence (planned):** cross-read of both syntheses against the five research questions
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness [cross-lineage comparison]

- [ ] CHK-030 [P0] The two lineages' conclusions are compared, not merged — a comparison section names concrete points of agreement and disagreement
  - **Evidence (planned):** comparison section in `research.md` or `implementation-summary.md`
- [ ] CHK-031 [P1] The comparison identifies which disagreement is most load-bearing for a future decompose-or-not decision
  - **Evidence (planned):** comparison section's own framing
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security [n/a]

- [ ] CHK-040 [P2] No secrets or credentials appear in either lineage's research artifacts
  - **Evidence (planned):** review of `research/lineages/{glm,composer}/` content
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` describe the same two-lineage, research-only scope
  - **Evidence (planned):** cross-read of all five packet files
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization [final sweep]

- [ ] CHK-060 [P0] This packet made no edit to `design-interface`, `design-mcp-open-design`, `design-md-generator`, any other sk-design mode, or the program parent's `spec.md`
  - **Evidence (planned):** `git diff --stat` shows only this packet's own files plus `research/lineages/**`
- [ ] CHK-061 [P1] No decomposition, new command doc, or asset was actually created — research artifacts only
  - **Evidence (planned):** directory listing of this packet's output confirms markdown research artifacts only
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 5 | 0/5 |
| P2 Items | 1 | 0/1 |

**Verification Date**: TBD (packet authored 2026-07-27; no iterations started yet, nothing verified yet)
<!-- /ANCHOR:summary -->
