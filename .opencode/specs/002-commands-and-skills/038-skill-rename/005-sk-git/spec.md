# Feature Specification: Phase 005 — Rename workflows-git to sk-git

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-02-21 |
| **Branch** | `038-skill-rename` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 5 of 7 |
| **Predecessor** | 006-sk-visual-explainer |
| **Successor** | None (last phase) |
| **Handoff Criteria** | `grep -r "workflows-git"` returns 0 matches in active files |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 5** of the Skill Rename (038) specification. It executes LAST because `workflows-git` is the shortest old name. It has the highest skill_advisor.py line count (28 lines).

**Scope Boundary**: ALL changes required to rename `workflows-git` to `sk-git`.

**Dependencies**:
- All other phases (1-4, 6-7) must complete first

**Deliverables**:
- Renamed skill folder: `.opencode/skill/sk-git/`
- All internal references updated (20 files)
- All external references updated (39 files)
- skill_advisor.py entries updated (28 lines — highest)
- grep verification: 0 matches for old name
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill `workflows-git` uses the legacy `workflows-*` naming convention. With 28 skill_advisor.py lines, it has the densest routing configuration of all skills being renamed.

### Purpose
Rename `workflows-git` to `sk-git` across all references, executing last as the shortest name to prevent substring collisions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Filesystem rename: `git mv .opencode/skill/workflows-git .opencode/skill/sk-git`
- Update all 20 internal files
- Update 39 external files
- Update 28 lines in skill_advisor.py (highest count)
- Rename changelog directory: `10--workflows-git` → `10--sk-git`

### Out of Scope
- Renaming other skills, functional changes, memory files, changelog content

### Files to Change

| Category | File Path | Change Type | Ref Count |
|----------|-----------|-------------|-----------|
| Folder | `.opencode/skill/workflows-git/` | Rename | — |
| Internal | `sk-git/SKILL.md` | Modify | ~5 |
| Internal | `sk-git/index.md` | Modify | ~3 |
| Internal | `sk-git/nodes/*.md` (~5 files) | Modify | ~15 |
| Internal | `sk-git/references/*.md` (~3 files) | Modify | ~8 |
| Internal | `sk-git/assets/*.md` (~5 files) | Modify | ~10 |
| Internal | `sk-git/scripts/*.sh` (~2 files) | Modify | ~5 |
| skill_advisor | `.opencode/skill/scripts/skill_advisor.py` | Modify | 28 lines |
| Agent | `.opencode/agent/orchestrate.md` | Modify | ~5 refs |
| Agent | `.opencode/agent/chatgpt/orchestrate.md` | Modify | ~5 refs |
| Agent | `.claude/agents/orchestrate.md` | Modify | ~5 refs |
| Agent | `.gemini/agents/orchestrate.md` | Modify | ~5 refs |
| Install | `.opencode/install_guides/README.md` | Modify | ~5 refs |
| Install | `.opencode/install_guides/SET-UP - AGENTS.md` | Modify | ~3 refs |
| Install | `.opencode/install_guides/SET-UP - Opencode Agents.md` | Modify | ~2 refs |
| Install | `.opencode/install_guides/SET-UP - Skill Creation.md` | Modify | ~2 refs |
| Root | `CLAUDE.md` | Modify | ~3 refs |
| Root | `README.md` | Modify | ~3 refs |
| Root | `.opencode/README.md` | Modify | ~3 refs |
| Changelog | `.opencode/changelog/10--workflows-git/` | Rename | — |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename skill folder | `ls .opencode/skill/sk-git/` exists |
| REQ-002 | Update all internal refs | grep = 0 within sk-git/ |
| REQ-003 | Update skill_advisor.py (28 lines) | `python3 skill_advisor.py "git commit"` returns `sk-git` |
| REQ-004 | Update agent files | All 4 runtime orchestrate.md use `sk-git` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Update install guides (4 files) | All updated |
| REQ-006 | Update root docs (3 files) | All updated |
| REQ-007 | Rename changelog dir | `10--sk-git` exists |
| REQ-008 | Update cross-refs in other skills | All updated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -r "workflows-git" .opencode/skill/ .opencode/command/ .opencode/agent/ .opencode/install_guides/ .claude/ .gemini/ CLAUDE.md README.md` returns 0
- **SC-002**: `python3 skill_advisor.py "git commit"` returns `sk-git`
- **SC-003**: Folder `.opencode/skill/sk-git/` exists
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | 28 skill_advisor lines — highest density | M | Careful line-by-line verification |
| Risk | Shortest name — must execute last | L | Execution order enforced |
| Risk | 39 external files — moderate cross-cutting | M | Per-file checklist |
| Dependency | All other phases complete | Must be last | Execution order |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: skill_advisor.py entries (28) must exactly match `sk-git`
- **NFR-C02**: Agent files consistent across 4 runtimes
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Substring Risk
- `workflows-git` is a substring of no other skill name, but being shortest it executes last for safety
- Must not match `workflows-git-*` patterns (none exist, but verify)

### Routing Density
- 28 skill_advisor.py lines makes this the densest routing update
- INTENT_BOOSTERS likely has git-specific keywords: "commit", "push", "branch", "merge", etc.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 20 internal + 39 external |
| Risk | 12/25 | High skill_advisor density (28 lines) |
| Research | 18/20 | All references cataloged |
| **Total** | **45/70** | **Level 2 — Medium-High** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->
