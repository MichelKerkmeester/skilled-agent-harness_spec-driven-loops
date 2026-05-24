---
title: "Feature Specification: Phase 8 — rename sk-ai-small-model → sk-prompt-small-model"
description: "Phase 8 of 114-small-ai-model-optimization: rename the sentinel skill `sk-ai-small-model` to `sk-prompt-small-model` across every live AND historical reference surface (rewrite-all policy), rotate the global changelog aggregator symlink, regenerate the compiled skill-graph index, and verify the renamed skill still surfaces at confidence ≥0.7 on small-model dispatch prompts. Family stays sk-util; behavior unchanged."
trigger_phrases:
  - "rename sk-ai-small-model"
  - "sk-prompt-small-model"
  - "small-model sentinel rename 008"
  - "skill rename phase 008"
  - "rewrite-all historical doc policy"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/008-sk-prompt-small-model-rename"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored spec.md (re-application)"
    next_safe_action: "Author plan.md"
    blockers: []
    key_files: [".opencode/skills/sk-ai-small-model/SKILL.md", ".opencode/skills/cli-devin/graph-metadata.json", ".opencode/changelog/sk-ai-small-model", "AGENTS.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000008"
      session_id: "114-008-spec-init"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: ["target: sk-prompt-small-model", "phase: 008", "family: stays sk-util", "policy: REWRITE-ALL", "level: 2 + decision-record addendum"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 8 — rename sk-ai-small-model → sk-prompt-small-model

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 + optional Level-3 decision-record.md addendum |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-sk-ai-small-model-rename (Complete 2026-05-21) |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh --strict` exit 0; zero name-only `sk-ai-small-model` outside documented exemptions. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 8 of 114. Phase 007 renamed `sk-small-model` → `sk-ai-small-model` (preserve-history). Phase 008 renames `sk-ai-small-model` → `sk-prompt-small-model` with REWRITE-ALL policy per user directive.

**Scope**: rename + propagation + symlink rotation + advisor reindex + global historical sweep. No behavioral changes. Family stays `sk-util`.

**Deliverables**: renamed dir + body, reverse edges, symlink rotation, 4 playbook renames, root markdown sweep, compiled graph regen, memory sweep, new v0.4.0.0 changelog, historical sweep.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-ai-small-model` over-claims its scope. It's a prompt-engineering sentinel (RCAF, CLEAR, bundle-gate) for small-model dispatch, not a generic AI sentinel.

### Purpose
Rename to `sk-prompt-small-model` so the canonical name anchors on prompt-quality scope. Apply REWRITE-ALL across all surfaces per ADR-002.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — 8 buckets

1. **Skill body**: dir rename + SKILL.md/README.md/description.json/graph-metadata.json/pattern-index.md/changelog/v{0.1,0.2,0.3}.0.0.md + new v0.4.0.0.md
2. **Sibling reverse edges**: cli-devin + cli-opencode `enhances.target`
3. **Aggregator symlink**: `.opencode/changelog/sk-ai-small-model` → `.opencode/changelog/sk-prompt-small-model`
4. **Manual playbooks**: 4 file renames (cli-devin/03--model-presets/005,006 + cli-opencode/07--prompt-templates/004,005) + 2 indexes + permissions-matrix files
5. **Root markdown**: .opencode/skills/README.md, AGENTS.md, CLAUDE.md, repo README.md
6. **Compiled skill-graph**: regen via `skill_graph_compiler.py --export-json --pretty`
7. **Memory dir**: MEMORY.md + reference_small_model_dispatch_matrix.md + feedback_skill_graph_compiler_rebuild.md
8. **Historical sweep (REWRITE-ALL)**: 114/007/, 131/scratch/115-arc-review/, deep-ai-council/v1.2.0.0, rename-pattern.md

### Out of Scope
- Behavior changes
- Immutable `007-sk-ai-small-model-rename/` folder NAME (path-only)
- Family change (stays sk-util)
- 008/* active-phase docs + v0.4.0.0.md (REWRITE-ALL exempt per D-008)
- Feature branches (stay on main)
- Memory file slug rename (slug preserved per D-005)

### Files to Change

| File | Change |
|------|--------|
| `.opencode/skills/sk-ai-small-model/` | git mv → sk-prompt-small-model |
| 8 skill body files | Content sweep |
| `cli-devin/graph-metadata.json` + `cli-opencode/graph-metadata.json` | enhances target |
| `.opencode/changelog/sk-ai-small-model` symlink | rm + ln -s |
| 4 playbook files | git mv + content |
| Root markdown (4) | Content sweep |
| Compiled skill-graph (2) | Regenerate |
| Memory dir (3) | Content sweep |
| 007/, 131/scratch/115, deep-ai-council/v1.2.0.0, rename-pattern.md | REWRITE-ALL |
| 114/spec.md + description.json + graph-metadata.json | Refreshed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-001 | Skill dir renamed | ls + git log |
| REQ-002 | SKILL.md frontmatter `name:` updated | grep |
| REQ-003 | Reverse edges updated | jq |
| REQ-004 | Symlink rotated | readlink |
| REQ-005 | Root docs updated | rg → 0 hits |
| REQ-006 | Compiled graph regenerated | jq |
| REQ-007 | Parent metadata refreshed | jq |
| REQ-008 | Global rg clean outside exemptions | disambiguating sweep |

### P1 — Required

| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-009 | 4 playbook files renamed | ls + rg |
| REQ-010 | permissions-matrix updated | rg |
| REQ-011 | Memory dir swept | rg |
| REQ-012 | Historical sweep complete | rg |
| REQ-013 | cli-devin context-gathering performed OR skip documented | logs OR ADR |
| REQ-014 | validate.sh --strict 008/ exit 0 | run |
| REQ-015 | New v0.4.0.0 changelog | file exists |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Advisor returns `sk-prompt-small-model` ≥0.7 confidence on canonical small-model prompt.
- **SC-002**: `rg -il "sk[_-]ai[_-]small[_-]model"` outside documented exemptions = 0.
- **SC-003**: `validate.sh --strict 008/` exit 0.
- **SC-004**: `git log --follow` traces through both renames.
- **SC-005**: Parent `114/graph-metadata.json` lists 008 + `last_active_child_id` points to it.
- **SC-006**: Aggregator symlink resolves to new path; old symlink gone.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|-----------|
| Risk | Advisor daemon cache stale | Kill advisor-server.js for launcher respawn |
| Risk | Sibling edges fall off graph | Atomic update with rename + compiler rebuild |
| Risk | REWRITE-ALL hits active-phase docs | Exempt via D-008 |
| Risk | Path-component refs to `007-sk-ai-small-model-rename` rewritten | Post-sweep restore step |
| Dep | git mv clean | Verify pre-sweep |
| Dep | skill_graph_compiler.py functional | Verified |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 6.5 NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement |
|----|-------------|
| NFR-001 | Skill body byte-identical excluding name/title/H1 |
| NFR-002 | git revert restores cleanly |
| NFR-003 | Compiled graph `generated_at` fresh |
| NFR-004 | Symlink matches sibling pattern |
| NFR-005 | Historical narrative cost documented in ADR-002 |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 6.6 EDGE CASES

| Case | Handling |
|------|----------|
| Compiler runs before reverse edges | Order: rename → edges → compiler |
| Memory slug rename breaks links | Slug stays (D-005) |
| Path components rewritten by sed | Post-sweep restore |
| 008/v0.4.0.0 self-contradicting | Exempt (D-008) |
| Underscore variant `sk_ai_small_model` | Separate sweep |
| Symlink target stale | Rotate atomically |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 6.7 COMPLEXITY ASSESSMENT

~85 files, ~600 LOC of edits, mechanical sed-driven, parallel-safe per bucket. Level 2 with decision-record.md addendum.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — resolved pre-implementation.
<!-- /ANCHOR:questions -->
