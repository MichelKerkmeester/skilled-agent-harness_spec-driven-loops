---
title: "Feature Specification: Phase 071 Stack-Agnostic Cleanup"
description: "Remove stack, library, and repo-specific language from non-sk-code skills so the public template remains usable by any codebase."
trigger_phrases:
  - "stack agnostic cleanup"
  - "non sk-code skills"
  - "public template cleanup"
  - "skill examples"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/071-stack-agnostic-cleanup"
    last_updated_at: "2026-05-05T19:14:28Z"
    last_updated_by: "cli-codex"
    recent_action: "Initialized Phase 071 cleanup packet"
    next_safe_action: "Run initial inventory grep and patch scoped non-sk-code skills"
    blockers: []
    key_files:
      - ".opencode/skills/"
      - "specs/skilled-agent-orchestration/071-stack-agnostic-cleanup/"
    session_dedup:
      fingerprint: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      session_id: "phase-071-stack-agnostic-cleanup"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Gate 3 pre-approved by user for this exact packet path."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 071 Stack-Agnostic Cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-05 |
| **Branch** | `071-stack-agnostic-cleanup` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Non-`sk-code` skills currently include frontend stack names, library names, repo-specific paths, and internal surface tag examples. Those references make the public template look tailored to one codebase when only `sk-code` should carry stack-specific customization.

### Purpose
Make every non-`sk-code` skill codebase-agnostic while preserving `sk-code` as the single surface-aware routing and standards layer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory stack-specific strings in `.opencode/skills/` markdown, JSON, and TOML files outside `/sk-code/` and `/changelog/`.
- Patch non-`sk-code` skills to use generic service, frontend, code-surface, or `<surface>` examples.
- Preserve runtime CLI skill names, `.opencode/` paths, historical changelogs, test fixtures, and all files under `.opencode/skills/sk-code/`.
- Recompile and validate the skill graph after content cleanup.

### Out of Scope
- Changing `sk-code` references or surface-specific resources, because `sk-code` is the designated customization layer.
- Editing historical `specs/` packets beyond this Phase 071 packet.
- Changing scorer logic or routing algorithms, because this cleanup is string/content-only.
- Editing changelog or test fixture files, because they are historical/test evidence.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/skilled-agent-orchestration/071-stack-agnostic-cleanup/` | Create/Modify | Phase packet docs, inventory note, ADR, summary |
| `.opencode/skills/cli-*/` | Modify if matched | Replace stack-specific references in CLI skill docs/config |
| `.opencode/skills/mcp-*/` | Modify if matched | Replace stack-specific references in MCP skill docs/examples |
| `.opencode/skills/sk-doc/` | Modify if matched | Replace stack-specific documentation examples |
| `.opencode/skills/sk-git/` | Modify if matched | Replace stack-specific workflow examples |
| `.opencode/skills/sk-code-review/` | Modify if matched | Replace internal surface tags with generic `<surface>` placeholders |
| `.opencode/skills/system-spec-kit/` | Modify if matched | Replace stack-specific routing examples and graph signals |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Do not modify `.opencode/skills/sk-code/` | `git diff --name-only -- .opencode/skills/sk-code` returns no files |
| REQ-002 | Remove stack-specific tokens from non-`sk-code` skill docs/config | Final scoped grep returns zero hits outside `/sk-code/`, `/changelog/`, and excluded test fixtures |
| REQ-003 | Preserve routing/scoring functionality | Skill graph compile and validate-only commands pass |
| REQ-004 | Document the agnostic rule | `decision-record.md` contains ADR-001 with accepted rule and exceptions |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Inventory before patching | Initial grep output is saved under this packet |
| REQ-006 | Patch known affected skills in deterministic order | `tasks.md` tracks one task per affected skill |
| REQ-007 | Keep markdown/frontmatter parseable | Frontmatter checks run for touched `SKILL.md` files |
| REQ-008 | Strictly validate the packet | `validate.sh specs/skilled-agent-orchestration/071-stack-agnostic-cleanup --strict` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The scoped non-`sk-code`, non-changelog grep returns zero matches.
- **SC-002**: Skill graph compiler export and validate-only both pass.
- **SC-003**: Strict spec validation passes for the Phase 071 packet.
- **SC-004**: `sk-code` has no diff from this cleanup.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-broad replacement changes historical or protected files | Medium | Restrict commands to `.opencode/skills/`, exclude `/sk-code/`, `/changelog/`, and test fixtures |
| Risk | Generic examples become unclear | Medium | Use concrete neutral examples such as `myservice.myservice_get_items({})` |
| Risk | Metadata signals still contain stack terms | Medium | Include JSON/TOML in grep and recompile skill graph |
| Dependency | Skill graph compiler | High | Run export and validate-only after patches |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Non-`sk-code` skills must not require customization for a user's chosen stack.
- **NFR-M02**: Replacement examples must remain readable and useful as generic patterns.

### Reliability
- **NFR-R01**: Routing metadata remains valid after string cleanup.
- **NFR-R02**: Markdown frontmatter remains parseable in touched `SKILL.md` files.

### Scope Control
- **NFR-SC01**: No protected paths are modified.
- **NFR-SC02**: No scorer logic changes are introduced.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Protected Matches
- Matches inside `.opencode/skills/sk-code/` remain allowed.
- Matches inside changelog paths remain allowed.
- Test fixture matches are not patched unless they are user-facing skill content.

### Case and Token Variants
- Search covers capitalized and lowercase stack terms, snake-case library names, API-style names, repo path variants, and surface tag examples.

### Metadata
- `graph-metadata.json` and skill graph inputs must be generic when they describe non-`sk-code` skills.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Multiple skill folders, mostly prose/config edits |
| Risk | 14/25 | Routing metadata and examples need preservation |
| Research | 12/20 | Inventory-driven cleanup with final grep proof |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Gate 3 and target packet path were supplied by the user.
<!-- /ANCHOR:questions -->
