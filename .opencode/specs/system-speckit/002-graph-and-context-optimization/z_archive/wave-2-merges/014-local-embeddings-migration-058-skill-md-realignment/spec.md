---
title: "058: Align 3 SKILL.md + 3 mcp_server READMEs + 2 references/ folders"
description: "20 cli-devin SWE 1.6 deep-review iterations followed by sonnet @markdown rewrites. Authority: sk-doc skill_md_template.md for SKILL.md; system-spec-kit/mcp_server/README.md for mcp_server READMEs."
trigger_phrases:
  - "058 spec"
  - "skill md realignment"
  - "20 iter deep review cli-devin"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/z_archive/wave-2-merges/014-local-embeddings-migration-058-skill-md-realignment"
    last_updated_at: "2026-05-15T15:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded 058 packet"
    next_safe_action: "Compose iter template + track seeds"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/SKILL.md"
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-skill-advisor/SKILL.md"
      - ".opencode/skills/system-spec-kit/mcp_server/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/README.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/README.md"
      - ".opencode/skills/system-skill-advisor/references/"
      - ".opencode/skills/system-code-graph/references/"
    session_dedup:
      fingerprint: "sha256:fbc41052219880688ea156d54081787ae249df2e6171cbacaf38f0cff200e160"
      session_id: "058-spec-scaffolded"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "SKILL.md style authority? .opencode/skills/sk-doc/assets/skill/skill_md_template.md (user-confirmed)"
      - "references scope? Add all recommended docs (user-confirmed)"
      - "20 iter total across 8 thematic tracks; cli-devin SWE 1.6 only; sonnet @markdown writes"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# 058: Align 3 SKILL.md + 3 mcp_server READMEs + 2 references/ folders

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Target Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Parent** | `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation` |
| **Depends on** | `057-root-readme-deeper-rewrite` (shipped) |
| **Successor** | None |
| **Handoff Criteria** | 3 SKILL.md + 3 mcp_server READMEs aligned to authorities; 7+ new references docs created; packet strict-validate PASS; single primary commit on main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem

Three system skills evolved through extraction events without consistent styling:

| File | Current state | Drift |
|------|---------------|-------|
| `system-spec-kit/SKILL.md` | 466 lines, NO anchors, minimal frontmatter, dense prose | Does not match sk-doc template (anchors absent) |
| `system-code-graph/SKILL.md` | 146 lines, 8 anchors, adds `_memory` block | Light vs the template's recommended length |
| `system-skill-advisor/SKILL.md` | 215 lines, 8 anchors, RICH frontmatter (trigger_phrases, importance_tier, keywords, intent_signals) | Frontmatter expands beyond template |
| `system-spec-kit/mcp_server/README.md` | 323 lines, 9 anchors, 2 diagrams, 3 tables | THE MODEL |
| `system-code-graph/mcp_server/README.md` | 263 lines, 9 anchors, 2 diagrams, 3 tables | Already aligned, content drift possible |
| `system-skill-advisor/mcp_server/README.md` | 66 lines, 4 anchors, 0 diagrams | MAJOR GAP vs model |
| `system-skill-advisor/references/` | 3 ADR-like docs, 4 recommended gap docs | Live but incomplete |
| `system-code-graph/references/` | Empty (.gitkeep only), 3-4 recommended docs | Empty despite SKILL.md gesturing at architectural decisions |

### Purpose

20 cli-devin SWE 1.6 deep-review iterations identify drift + gaps. Sonnet @markdown applies surgical rewrites following the sk-doc skill_md_template authority + system-spec-kit/mcp_server/README.md model. New reference docs author the architectural ADRs that SKILL.md files gesture at but don't yet document.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 20 cli-devin SWE 1.6 deep-review iter across 8 thematic tracks
- Surgical sonnet @markdown rewrites of 3 SKILL.md + 3 mcp_server READMEs (Batch A + B)
- 7+ new reference docs authored by sonnet @markdown (Batch C)
- Per-iter immediate commit; per-batch commit in Phase 4

### Out of Scope

- Refactoring the underlying code (only docs)
- Modifying the sk-doc skill_md_template itself
- Restructuring agent/command definitions
- Phases A-D + 056-057 work (already shipped)

### Files to Change/Create

| File | Action | Phase |
|------|--------|-------|
| `system-spec-kit/SKILL.md` | Edit (add anchors per template + content drift) | 4-A |
| `system-code-graph/SKILL.md` | Edit (anchor alignment + drift) | 4-A |
| `system-skill-advisor/SKILL.md` | Edit (anchor alignment + drift; preserve advisor scoring frontmatter) | 4-A |
| `system-spec-kit/mcp_server/README.md` | Edit (drift updates) | 4-B |
| `system-code-graph/mcp_server/README.md` | Edit (drift updates) | 4-B |
| `system-skill-advisor/mcp_server/README.md` | Edit (MAJOR expansion 66→~280 lines) | 4-B |
| `system-skill-advisor/references/advisor-scorer.md` | Create | 4-C |
| `system-skill-advisor/references/propagate-enhances.md` | Create | 4-C |
| `system-skill-advisor/references/skill-graph-extraction-plan.md` | Create | 4-C |
| `system-skill-advisor/references/tool-ids-reference.md` | Create | 4-C |
| `system-code-graph/references/code-graph-readiness-check.md` | Create | 4-C |
| `system-code-graph/references/ownership-boundary.md` | Create | 4-C |
| `system-code-graph/references/database-path-policy.md` | Create | 4-C |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 20 iter outputs persist | `research/iterations/iteration-001.md` ... `iteration-020.md`, each >= 1000 bytes |
| REQ-002 | State JSONL covers all 20 iter | 22 rows: config + 20 iter + converged |
| REQ-003 | Verified delta document exists | `delta-verified.md` with EDITs + NEW-FILE specs, each citing iter |
| REQ-004 | 3 SKILL.md realigned | All 3 have consistent anchor set per template + verified drift fixes |
| REQ-005 | 3 mcp_server READMEs aligned | Each passes sk-doc validate; system-skill-advisor expanded to 9-section scaffold |
| REQ-006 | 7+ new references docs created | Each passes sk-doc validate |
| REQ-007 | Strict-validate packet | `validate.sh --strict` exit 0 |
| REQ-008 | Sonnet @markdown + @review final | 0 P0 findings before commit |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Per-iter immediate commit | Each iter has its own commit on main |
| REQ-010 | Per-batch immediate commit Phase 4 | A, B, C each commit independently |
| REQ-011 | Executor separation honored | cli-devin only SWE 1.6 (auto perm); sonnet @markdown only via Task tool |
| REQ-012 | audit_readmes.py bulk sweep | 0 blocking errors over 3 system skills |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 3 SKILL.md files consistent with sk-doc skill_md_template.
- **SC-002**: 3 mcp_server READMEs consistent with system-spec-kit/mcp_server/README.md model.
- **SC-003**: 7+ new reference docs created with consistent style.
- **SC-004**: All modified/created files pass sk-doc validate.
- **SC-005**: Single primary commit on main closes the packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | sk-doc skill_md_template path verified | n/a | Already located at .opencode/skills/sk-doc/assets/skill/skill_md_template.md |
| Risk | Anchor addition to system-spec-kit/SKILL.md (466 dense lines) | Medium | Sonnet places anchors at section boundaries without restructuring |
| Risk | Phase 4 token budget across 3 batches | Medium | Each batch caps at ~10 files; sonnet self-throttles |
| Risk | References docs authored from research, not source | Medium | Mark forward-looking content explicitly; cite live code where applicable |
| Risk | Parallel-session interference | Medium | Per-iter + per-batch immediate commit |
| Dependency | sk-doc skill_md_template | Met | Located |
| Dependency | cli-devin SWE 1.6 | Met | Used in 055-057 |
| Dependency | Sonnet @markdown via Task tool | Met | Used in 055/057 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Per-iter wall-clock < 5 min
- **NFR-P02**: 20-iter total < 100 min
- **NFR-P03**: Phase 4 per-batch < 20 min
- **NFR-P04**: Phase 5 verify + double-check < 15 min

### Quality
- **NFR-Q01**: HVR score >= 85 per modified/created file
- **NFR-Q02**: No em dashes, semicolons, oxford commas in prose
- **NFR-Q03**: Anchor balance verified per file

### Reproducibility
- **NFR-R01**: Per-iter prompts persist under `prompts/` references; logs under `dispatch-logs/`
- **NFR-R02**: Edit evidence captured per Phase 4 batch
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **EC-001**: cli-devin returns malformed iter output → retry max 2 with tighter prompt; fall back to direct main-agent capture if needed
- **EC-002**: An iter finds 0 drift → still records `complete`, no early stop
- **EC-003**: Sonnet rewrites non-drifted prose → reject, redispatch with tighter scope
- **EC-004**: New reference doc duplicates existing content → consolidate before commit
- **EC-005**: HVR score < 85 on a target file → re-dispatch that file with stricter HVR prompt
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

None. Authority, scope, and 8-track structure clarified at planning time.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Resource Map**: See `resource-map.md`
- **Track Seeds**: See `research/track-seeds.md`
- **Iter Template**: See `assets/iter-template.md`
- **Predecessor**: `../057-root-readme-deeper-rewrite/`
<!-- /ANCHOR:related-docs -->
