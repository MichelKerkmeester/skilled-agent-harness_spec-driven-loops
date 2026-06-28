---
title: "Feature Specification: Phase 4: model-hub-and-priority-profiles"
description: "Mature sk-prompt-models from a thin router into the per-model prompt-craft content hub: rewrite SKILL.md, author _index.md, and deliver the two priority profiles (minimax-m3.md + mimo-v2.5-pro.md) following the fixed 6-section template."
trigger_phrases:
  - "model hub"
  - "priority profiles"
  - "sk-prompt-models rewrite"
  - "minimax-m3 prompt profile"
  - "mimo-v2.5 prompt profile"
  - "small model content hub"
importance_tier: "important"
contextType: "spec-completion"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/130-prompt-knowledge-layering/004-model-hub-and-priority-profiles"
    last_updated_at: "2026-06-02T18:30:00Z"
    last_updated_by: "agent"
    recent_action: "Phase 004 complete — all deliverables shipped"
    next_safe_action: "Phase 005: backfill remaining 6 profiles"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/SKILL.md"
      - ".opencode/skills/sk-prompt-models/references/models/_index.md"
      - ".opencode/skills/sk-prompt-models/references/models/minimax-m3.md"
      - ".opencode/skills/sk-prompt-models/references/models/mimo-v2.5-pro.md"
    session_dedup:
      fingerprint: "sha256:2de0152b71988d81926d353f221a1f1cc59f059aca2169ebf22446128b6985b7"
      session_id: "phase-004-completion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Architecture A confirmed: per-model profiles are the WEIGHT; SKILL.md is the thin entry surface."
      - "SKILL.md version bumped 0.1.0 -> 0.2.0 at 199 LOC."
      - "minimax-m3.md and mimo-v2.5-pro.md authored per fixed 6-section template."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: model-hub-and-priority-profiles

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 8 |
| **Predecessor** | 003-land-recommended-frameworks-data |
| **Successor** | 005-backfill-remaining-profiles |
| **Handoff Criteria** | SKILL.md at 0.2.0 with 6-section profile template enforced; minimax-m3.md and mimo-v2.5-pro.md authored and indexed; _index.md covers all 8 active models (remaining 6 as roadmap pointers). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Prompt-knowledge layering across CLI skills, sk-prompt frameworks, and the sk-prompt-models model-craft hub specification.

**Scope Boundary**: Rewrite SKILL.md and author the two priority profiles (minimax-m3, mimo-v2.5-pro). The remaining 6 profiles (minimax-2.7, swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1) are roadmap pointers in _index.md and are deferred to phase 005.

**Dependencies**:
- Phase 003 landed the recommended-frameworks data in `sk-prompt/assets/model-profiles.json` — the DATA source that the profiles mirror.
- cli-opencode prompt templates (Templates 14 and 15) carry the executor mechanics that the profiles cross-reference but do not restate.

**Deliverables**:
- Rewritten SKILL.md at version 0.2.0 (199 LOC, under the 200-LOC cap)
- `references/models/_index.md` with 8 active-model rows
- `references/models/minimax-m3.md` — full 6-section priority profile, status: carried
- `references/models/mimo-v2.5-pro.md` — full 6-section priority profile, status: empirical

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-prompt-models` was a thin router with no per-model prompt-craft content. Operators dispatching MiniMax-M3 or MiMo-V2.5-Pro had no single authoritative source for which prompt framework to use, what pre-planning density to apply, or what gotchas to avoid. The recommended-frameworks data landed in phase 003 needed a content hub — profiles that translate the registry data into actionable prompt scaffolds with benchmark evidence and tuned templates.

### Purpose
Transform `sk-prompt-models` into the canonical per-model prompt-craft hub (Architecture A): per-model profiles as the WEIGHT in `references/models/`, SKILL.md as the thin entry surface, executor mechanics delegated to `cli-*`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `sk-prompt-models/SKILL.md` (retitle, flip ALWAYS/NEVER, add dispatch matrix, define adoption protocol; keep <= 200 LOC; bump version 0.1.0 -> 0.2.0)
- Create `references/models/_index.md` (8-row index mirroring model-profiles.json recommended_frameworks)
- Author `references/models/minimax-m3.md` following the fixed 6-section template (Identity, Framework, Evidence, Template Snippet, Dispatch Gotchas, See Also); status: carried (inherited from minimax-2.7 benchmark 120/003)
- Author `references/models/mimo-v2.5-pro.md` following the fixed 6-section template; status: empirical (benchmark 126/004, confidence high)

### Out of Scope
- Remaining 6 profiles (minimax-2.7, swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1) — deferred to phase 005
- Changes to cli-devin or cli-opencode executor mechanics — those are owned by the respective CLI skills
- Changes to sk-prompt/assets/model-profiles.json — the DATA registry; already populated in phase 003
- New benchmarks — phase 004 absorbs existing benchmark evidence; no fresh benchmark runs

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt-models/SKILL.md` | Modify | Rewrite to hub architecture: retitle, ALWAYS/NEVER rules, dispatch matrix, adoption protocol; version 0.2.0; 199 LOC |
| `.opencode/skills/sk-prompt-models/references/models/_index.md` | Create | Thin index: 8 active-model rows with framework primary/fallback, pre-planning density, status |
| `.opencode/skills/sk-prompt-models/references/models/minimax-m3.md` | Create | Full 6-section priority profile for MiniMax-M3 (TIDD-EC + dense; status: carried) |
| `.opencode/skills/sk-prompt-models/references/models/mimo-v2.5-pro.md` | Create | Full 6-section priority profile for MiMo-V2.5-Pro (COSTAR + lean; status: empirical) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SKILL.md rewritten to hub architecture | File retitled "Small-Model Prompt-Craft Hub"; ALWAYS/NEVER rules flip prompt-craft ownership to this skill and executor mechanics to cli-*; version field reads 0.2.0; LOC <= 200 |
| REQ-002 | _index.md created with all 8 active model rows | File exists at `references/models/_index.md`; rows for minimax-m3, mimo-v2.5-pro, minimax-2.7, swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1; each row has framework primary/fallback and status |
| REQ-003 | minimax-m3.md authored per 6-section template | All 6 sections present; framework listed as TIDD-EC primary / RCAF fallback / dense; status labeled `carried`; source benchmark named (120/003); executor mechanics not duplicated |
| REQ-004 | mimo-v2.5-pro.md authored per 6-section template | All 6 sections present; framework listed as COSTAR primary / RACE fallback / lean; status labeled `empirical`; benchmark 126/004 cited; TIDD-EC marked "avoid" with evidence; executor mechanics not duplicated |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | COSTAR/RACE tie documented as within noise | mimo-v2.5-pro.md explicitly states the sample size (2 fixtures, single-sample) and flags the tie as within noise; both frameworks declared safe |
| REQ-006 | minimax-m3.md fresh-run caveat present | Profile documents that a fresh M3-specific benchmark is needed before status can be elevated to `empirical` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: SKILL.md at version 0.2.0, exactly 199 LOC, retitled "Small-Model Prompt-Craft Hub", ALWAYS/NEVER rules enforce the prompt-craft/mechanics boundary.
- **SC-002**: `references/models/_index.md` exists with 8 rows; minimax-m3 and mimo-v2.5-pro link to authored profiles; remaining 6 link to roadmap pointers.
- **SC-003**: `minimax-m3.md` and `mimo-v2.5-pro.md` both follow the fixed 6-section template; neither file restates executor mechanics; each cites model-profiles.json as data source.
- **SC-004**: validate.sh --strict exits 0 on this spec folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-prompt/assets/model-profiles.json (phase 003) | Profiles mirror this registry; if phase 003 data is stale, profiles carry wrong framework recommendations | Phase 003 landed framework data before phase 004 authored profiles; each profile cites the registry and marks evidence status clearly |
| Risk | SKILL.md exceeds 200-LOC cap | Advisor surface becomes too heavy; violates ALWAYS rule 1 | File written to exactly 199 LOC; cap enforced at authoring time |
| Risk | minimax-m3 "carried" misread as "empirical" | Operators trust M3-specific data that does not exist | Profile explicitly labels status, names source benchmark (120/003), and includes a caveat requiring a fresh M3 run before elevation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All questions resolved during phase execution.
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
