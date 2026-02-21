# Feature Specification: Phase 007 — Rename mcp-chrome-devtools to mcp-chrome-devtools

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
| **Phase** | 7 of 7 |
| **Predecessor** | 002-sk-code--web |
| **Successor** | 004-sk-documentation |
| **Handoff Criteria** | `grep -r "mcp-chrome-devtools"` returns 0 matches in active files |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 7** of the Skill Rename (038) specification. It is the ONLY phase using the `mcp-` prefix instead of `sk-`, because Chrome DevTools is an MCP integration, not a standard skill.

**Scope Boundary**: ALL changes for `mcp-chrome-devtools` → `mcp-chrome-devtools`.

**Dependencies**:
- Phases 3, 1, 2 must complete first (execution order)

**Deliverables**:
- Renamed skill folder: `.opencode/skill/mcp-chrome-devtools/`
- All internal references updated (21 files)
- All external references updated (36 files)
- skill_advisor.py entries updated (20 lines)
- Renamed changelog directory: `11--mcp-chrome-devtools`
- grep verification: 0 matches
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill `mcp-chrome-devtools` uses the `workflows-*` prefix, which incorrectly categorizes it as a standard workflow skill. In reality, it is an MCP integration that provides Chrome DevTools access via MCP protocol. The naming should reflect this distinction.

### Purpose
Rename `mcp-chrome-devtools` to `mcp-chrome-devtools`, correctly categorizing it as an MCP integration and aligning with existing `mcp-figma` and `mcp-code-mode` naming conventions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Filesystem rename: `git mv .opencode/skill/mcp-chrome-devtools .opencode/skill/mcp-chrome-devtools`
- Update all 21 internal files
- Update 36 external files
- Update 20 lines in skill_advisor.py
- Rename changelog directory: `11--mcp-chrome-devtools` → `11--mcp-chrome-devtools`

### Out of Scope
- Renaming other skills, functional changes, memory files, changelog content

### Files to Change

| Category | File Path | Change Type | Ref Count |
|----------|-----------|-------------|-----------|
| Folder | `.opencode/skill/mcp-chrome-devtools/` | Rename | — |
| Internal | `mcp-chrome-devtools/SKILL.md` | Modify | ~5 |
| Internal | `mcp-chrome-devtools/index.md` | Modify | ~3 |
| Internal | `mcp-chrome-devtools/nodes/*.md` (~5 files) | Modify | ~15 |
| Internal | `mcp-chrome-devtools/references/*.md` (~3 files) | Modify | ~8 |
| Internal | `mcp-chrome-devtools/assets/*.md` (~5 files) | Modify | ~10 |
| Internal | `mcp-chrome-devtools/scripts/*.sh` (~3 files) | Modify | ~6 |
| skill_advisor | `.opencode/skill/scripts/skill_advisor.py` | Modify | 20 lines |
| Agent | `.opencode/agent/orchestrate.md` | Modify | ~5 refs |
| Agent | `.opencode/agent/chatgpt/orchestrate.md` | Modify | ~5 refs |
| Agent | `.claude/agents/orchestrate.md` | Modify | ~5 refs |
| Agent | `.gemini/agents/orchestrate.md` | Modify | ~5 refs |
| Install | `.opencode/install_guides/README.md` | Modify | ~5 refs |
| Install | `.opencode/install_guides/SET-UP - AGENTS.md` | Modify | ~3 refs |
| Install | `.opencode/install_guides/SET-UP - Opencode Agents.md` | Modify | ~3 refs |
| Install | `.opencode/install_guides/SET-UP - Skill Creation.md` | Modify | ~3 refs |
| Root | `CLAUDE.md` | Modify | ~5 refs |
| Root | `README.md` | Modify | ~3 refs |
| Root | `.opencode/README.md` | Modify | ~3 refs |
| spec-kit | `system-spec-kit/SKILL.md` | Modify | ~2 refs |
| spec-kit | `system-spec-kit/nodes/rules.md` | Modify | ~2 refs |
| Changelog | `.opencode/changelog/11--mcp-chrome-devtools/` | Rename | — |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename skill folder | `ls .opencode/skill/mcp-chrome-devtools/` exists |
| REQ-002 | Update all internal refs | grep = 0 within folder |
| REQ-003 | Update skill_advisor.py (20 lines) | `python3 skill_advisor.py "take screenshot"` returns `mcp-chrome-devtools` |
| REQ-004 | Update agent files | All 4 runtime orchestrate.md use `mcp-chrome-devtools` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Update install guides (4 files) | All updated |
| REQ-006 | Update root docs (3 files) | All updated |
| REQ-007 | Update system-spec-kit refs | SKILL.md, rules.md updated |
| REQ-008 | Rename changelog dir | `11--mcp-chrome-devtools` exists |
| REQ-009 | Update cross-refs in other skills | All updated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -r "mcp-chrome-devtools"` in active files returns 0
- **SC-002**: `python3 skill_advisor.py "take screenshot"` returns `mcp-chrome-devtools`
- **SC-003**: Folder `.opencode/skill/mcp-chrome-devtools/` exists with all files
- **SC-004**: Naming aligns with existing `mcp-figma` and `mcp-code-mode` conventions
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `mcp-` prefix is non-standard for this rename set | M | Intentional — MCP categorization |
| Risk | 36 external files — moderate cross-cutting | M | Per-file verification |
| Risk | 20 skill_advisor lines | L | Mechanical replacement |
| Dependency | Phases 3, 1, 2 must complete | Execution order | Sequential |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: `mcp-chrome-devtools` naming aligns with `mcp-figma`, `mcp-code-mode`
- **NFR-C02**: Agent files consistent across 4 runtimes
- **NFR-C03**: Folder name matches skill_advisor.py entries

### Categorization
- **NFR-CT01**: MCP integrations use `mcp-*` prefix to distinguish from standard `sk-*` skills
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Prefix Change
- Unlike other phases (`workflows-` → `sk-`), this uses `workflows-` → `mcp-`
- Any wildcard patterns like `workflows-*` that should NOT include this skill must be handled

### MCP Alignment
- The new name `mcp-chrome-devtools` joins existing `mcp-figma` and `mcp-code-mode`
- system-spec-kit may have MCP-specific references or groupings
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 21 internal + 36 external |
| Risk | 10/25 | Different prefix (mcp-) adds minor complexity |
| Research | 18/20 | All references cataloged |
| **Total** | **44/70** | **Level 2 — Medium-High** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->
