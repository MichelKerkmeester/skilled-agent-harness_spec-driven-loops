---
title: "Feature Specification: 096/004 - redirect cross-runtime symlinks"
description: "Phase 4 of 4. Recreate 5 symlinks in .claude/, .codex/, .gemini/ to point at new plural targets created in Phases 001-003."
trigger_phrases:
  - "096/004 symlinks"
  - "claude codex gemini symlinks"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks"
    last_updated_at: "2026-05-07T14:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored spec docs"
    next_safe_action: "Recreate symlinks"
    blockers: []
    key_files:
      - ".claude/skills"
      - ".claude/commands"
      - ".codex/skills"
      - ".codex/prompts"
      - ".gemini/skills"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 096/004 - redirect cross-runtime symlinks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After Phases 001-003 rename `.opencode/skills/`, `.opencode/agents/`, `.opencode/commands/` to plural, the following symlinks in mirror runtimes are BROKEN (still pointing at old singular targets):
- `.claude/skills → ../.opencode/skill` (broken)
- `.claude/commands → ../.opencode/command` (broken)
- `.codex/skills → ../.opencode/skill` (broken)
- `.codex/prompts → ../.opencode/command` (broken)
- `.gemini/skills → ../.opencode/skill` (broken)

### Purpose
Recreate the 5 symlinks pointing at the new plural targets so cross-runtime mirror access works.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 5 `rm + ln -s` operations to redirect symlinks at new plural targets
- Verification that all 5 resolve (`test -e`)
- Document pre-existing broken `.gemini/workflows/*` symlinks (out of scope to fix; pre-dates this packet)

### Out of Scope
- Fixing the 19 pre-existing broken `.gemini/workflows/*` symlinks (they point to absolute path "Opencode Env" — wrong directory name; pre-dates this packet)
- Any other directory renames (Phases 001-003 already done)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.claude/skills` | Symlink redirect | `../.opencode/skill` → `../.opencode/skills` |
| `.claude/commands` | Symlink redirect | `../.opencode/command` → `../.opencode/commands` |
| `.codex/skills` | Symlink redirect | `../.opencode/skill` → `../.opencode/skills` |
| `.codex/prompts` | Symlink redirect | `../.opencode/command` → `../.opencode/commands` |
| `.gemini/skills` | Symlink redirect | `../.opencode/skill` → `../.opencode/skills` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 symlinks recreated with new plural targets | `readlink <path>` returns the new plural target string |
| REQ-002 | All 5 resolve | `test -e <link>` succeeds for each |
| REQ-003 | No symlink loops | `realpath <link>` resolves without errors |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Pre-existing `.gemini/workflows/*` broken symlinks documented | implementation-summary.md notes them as out-of-scope |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 004 child packet validates strict-clean.
- **SC-002**: All 5 target symlinks resolve.
- **SC-003**: opencode CLI works end-to-end via cross-runtime mirror access (no "Could not find any skills" warning anywhere).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | rm + ln -s isn't atomic; if mid-execution fails, symlink is gone | Low | Pre-flight test: confirm new plural target exists before rm; if anything fails, recreate manually |
| Risk | Symlink targets need to be relative to symlink's parent dir | Low | Use `../.opencode/skills` (relative to `.claude/`, `.codex/`, `.gemini/`) — verified format |
| Dependency | Phases 001-003 complete | Required | Verified before dispatch |
<!-- /ANCHOR:risks -->

---

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: 5 symlink redirects complete in <5 seconds.

### Security
- **NFR-S01**: No symlinks introduced that point outside the repo.

### Reliability
- **NFR-R01**: Symlink redirects atomic per file (rm + ln -s pair); failure leaves a clear missing symlink state.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty symlink target: shouldn't occur; pre-flight test confirms target exists.
- Maximum length: not relevant; symlink targets are short paths.

### Error Scenarios
- `ln -s` fails because target doesn't exist: pre-flight check catches.
- `rm` fails because file isn't writable: shouldn't occur; user owns these files.

### State Transitions
- After Phase 004: all 5 symlinks resolve; final smoke test passes; entire packet 096 complete.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 3/25 | 5 symlinks |
| Risk | 5/25 | Reversible; well-bounded |
| Research | 4/20 | Inventory complete |
| **Total** | **12/70** | **Level 2** (small but verifiable) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Resource Map**: `../resource-map.md`
