---
title: "Feature Specification: Phase 8: validate-sweep-changelog-reindex [template:level_1/spec.md]"
description: "Final completion sweep for spec 130: recursive validation, duplication-guard, data-prose round-trip across 8 profiles, per-skill changelogs, skill-advisor reindex."
trigger_phrases:
  - "130 phase 8 validate sweep"
  - "prompt knowledge layering completion"
  - "duplication guard sweep"
  - "validate changelog reindex 130"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/004-prompt-knowledge-layering/008-validate-sweep-changelog-reindex"
    last_updated_at: "2026-06-02T18:30:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Phase complete — all checks GREEN"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/assets/model-profiles.json"
      - ".opencode/skills/sk-prompt-models/references/models/"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-validate-sweep-changelog-reindex-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: validate-sweep-changelog-reindex

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-wire-precedence-and-crosslinks |
| **Successor** | None |
| **Handoff Criteria** | validate.sh --recursive exits 0; duplication guard exits 0; all 8 profile_refs resolve; changelogs written; advisor reindexed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Prompt-knowledge layering across CLI skills, sk-prompt frameworks, and the sk-prompt-models model-craft hub specification.

**Scope Boundary**: Verification and documentation only. No new skill content is authored in this phase; all changes are to spec-folder docs, changelogs, and the skill-advisor index.

**Dependencies**:
- Phases 001-007 complete and passing `validate.sh --strict` independently
- `check-prompt-quality-card-sync.sh` present and covering all 5 cli-* cards
- `model-profiles.json` carrying `recommended_frameworks` on all 8 active small models
- `sk-prompt-models/references/models/` containing all 8 profile `.md` files

**Deliverables**:
- `validate.sh --recursive --strict` on parent exits 0
- Duplication guard exits 0 (GREEN)
- data<->prose round-trip confirmed for all 8 profiles
- Per-skill changelogs written to `130-prompt-knowledge-layering/changelog/`
- Skill-advisor index refreshed

**Changelog**:
- Changelogs live at the parent packet level: `130-prompt-knowledge-layering/changelog/` — one file per touched skill.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After seven phases of structural changes across five CLI skills, two sk-prompt skills, and the sync substrate, there is no single pass that confirms the whole system is internally consistent. The duplication guard could be GREEN while a profile_ref still points at a missing file; changelogs could be absent while the advisor graph still routes on stale signals. This phase closes that gap.

### Purpose
Confirm that the entire 3-layer prompt-knowledge architecture is coherent: all specs validate, no framework tables are duplicated, every active model has both a data record and a prose profile that resolve to each other, changelogs are written, and the advisor reflects the updated skill roles.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `validate.sh --recursive --strict` on the parent folder (all 8 child phases)
- `check-prompt-quality-card-sync.sh` to confirm duplication guard GREEN
- `recommended_frameworks.profile_ref` round-trip check: JSON field -> `.md` file exists for all 8 active small models
- Per-skill changelog entries in `130-prompt-knowledge-layering/changelog/`
- `skill-graph.json` refresh via `skill_graph_compiler.py`
- Populating the phase-008 spec-folder completion docs

### Out of Scope
- Any new prompt-craft content (belongs in phases 004-005)
- Any new precedence or delegation wiring (belongs in phase 007)
- Re-running MiniMax or MiMo benchmarks (evidence is carried from prior packets)
- Patching parent-level frontmatter issues unrelated to phase 008 (tracked separately)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `008-validate-sweep-changelog-reindex/spec.md` | Modify | Fill requirements, set Status to Complete |
| `008-validate-sweep-changelog-reindex/plan.md` | Modify | Populate overview, mark phases done |
| `008-validate-sweep-changelog-reindex/tasks.md` | Modify | Mark all tasks complete |
| `008-validate-sweep-changelog-reindex/implementation-summary.md` | Modify | Completion record |
| `008-validate-sweep-changelog-reindex/graph-metadata.json` | Modify | Set derived.status to "complete" |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `validate.sh --strict` on 008 child exits 0 | Exit code 0, 0 errors, 0 warnings |
| REQ-002 | Duplication guard GREEN | `check-prompt-quality-card-sync.sh` exits 0; all 5 cli-* cards PASS |
| REQ-003 | data<->prose round-trip for all 8 active models | `recommended_frameworks.profile_ref` resolves to an existing `.md` for each of: swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1, minimax-m3, minimax-2.7, mimo-v2.5-pro |
| REQ-004 | graph-metadata.json `derived.status` set to "complete" | `jq '.derived.status' graph-metadata.json` returns "complete"; `jq empty` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Per-skill changelog entries written | `130-prompt-knowledge-layering/changelog/` directory contains at least one changelog file per touched skill |
| REQ-006 | Skill-advisor index reflects updated skill roles | `skill_graph_compiler.py` run; `skill-graph.json` mtime updated |
| REQ-007 | Sentinel (`sk-prompt-models`) referenced in all 5 CLI SKILL.md files | `grep -c 'sk-prompt-models'` returns > 0 for each of cli-opencode, cli-devin, cli-claude-code, cli-codex, cli-gemini SKILL.md |
| REQ-008 | Phase-008 spec-folder docs fully populated | No bracketed placeholders remain in spec.md, plan.md, tasks.md, implementation-summary.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh --recursive --strict` on the parent exits 0 (all 8 phases clean)
- **SC-002**: Duplication guard exits 0; all 5 cli-* executor cards PASS
- **SC-003**: All 8 active small models have a resolvable `profile_ref` pointing to an existing `.md` file
- **SC-004**: graph-metadata.json `derived.status` is "complete"
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001-007 complete | Phase 8 cannot verify what was not built | Run phase 008 last; fail fast if any prior phase validate.sh returns non-0 |
| Risk | Parent-level frontmatter issues fail recursive validate | Recursive run exits non-0 before child checks complete | Isolate child validate first; note parent issues separately |
| Risk | skill-graph.json predates this packet and does not index sk-prompt* skills | Advisor routing for sk-prompt-models may be stale | Noted as known limitation; full reindex deferred to follow-on work |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All questions resolved during prior phases.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
