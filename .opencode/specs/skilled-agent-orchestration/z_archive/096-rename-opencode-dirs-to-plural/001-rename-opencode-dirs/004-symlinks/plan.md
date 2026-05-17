---
title: "Implementation Plan: 096/004 - symlinks redirect"
description: "5 rm + ln -s operations to redirect mirror-runtime symlinks at new plural targets."
trigger_phrases:
  - "096/004 plan"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks"
    last_updated_at: "2026-05-07T14:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md"
    next_safe_action: "Execute symlink redirects"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 096/004 - symlinks redirect

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | Bash (rm + ln -s) |
| **Executor** | Orchestrator direct (no cli-codex needed — small mechanical task) |
| **Storage** | Filesystem |
| **Testing** | `test -e` for each |

### Overview
Pre-flight: verify new plural targets exist. Execute: 5 sequential `rm <symlink> && ln -s <new-target> <symlink>` pairs. Verify: each `test -e <link>` succeeds.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 001-003 complete (new plural targets exist)
- [x] Pre-flight check confirms 5 symlinks currently exist (and now broken)

### Definition of Done
- [ ] 5 symlinks recreated with plural targets
- [ ] All 5 resolve (`test -e`)
- [ ] Smoke test: cross-runtime access works
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bash one-liner per symlink: `rm <link> && ln -s <new-target> <link>`. Sequential to keep ordering clear.

### Key Components
- 5 rm + ln -s pairs
- Pre-flight target existence check
- Post-flight `test -e` verification
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.claude/skills` | Cross-runtime skill access for Claude Code | Symlink redirect | `readlink` + `test -e` |
| `.claude/commands` | Cross-runtime command access for Claude Code | Symlink redirect | same |
| `.codex/skills` | Codex skill access | Symlink redirect | same |
| `.codex/prompts` | Codex command access (named "prompts") | Symlink redirect | same |
| `.gemini/skills` | Gemini skill access | Symlink redirect | same |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Phases 001-003 verified complete
- [x] Pre-flight: confirm `.opencode/skills`, `.opencode/commands` directories exist

### Phase 2: Implementation
- [ ] T010 Redirect `.claude/skills` → `../.opencode/skills`
- [ ] T011 Redirect `.claude/commands` → `../.opencode/commands`
- [ ] T012 Redirect `.codex/skills` → `../.opencode/skills`
- [ ] T013 Redirect `.codex/prompts` → `../.opencode/commands`
- [ ] T014 Redirect `.gemini/skills` → `../.opencode/skills`

### Phase 3: Verification
- [ ] T020 `test -e` returns 0 for all 5 symlinks
- [ ] T021 `readlink` shows correct plural target
- [ ] T022 opencode smoke test (no "Could not find" warning)
- [ ] T023 Document pre-existing broken `.gemini/workflows/*` symlinks
- [ ] T024 Author implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Per-symlink resolution | `test -e`, `readlink` |
| Integration | Cross-runtime access | opencode CLI smoke |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| Phases 001-003 complete | Internal | TBD |
| `.opencode/skills/`, `.opencode/commands/` directories present | Internal | Required |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Symlink resolution fails after redirect.
- **Procedure**: Recreate the broken symlink with the singular target (which won't exist post-rename) — but realistically just fix the failed `ln -s` invocation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 001-003 done | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Final commit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30s |
| Core Implementation | Low | 30s wall-clock |
| Verification | Low | 1 min |
| **Total** | | **~2 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phases 001-003 complete
- [ ] On main
- [ ] Plural directories exist

### Rollback Procedure
1. If a single `ln -s` fails: rerun manually with correct target.
2. If multiple fail: inspect target paths; ensure relative path is correct from symlink's parent dir.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Recreate symlinks with old singular targets (won't resolve post-rename, but harmless).
<!-- /ANCHOR:enhanced-rollback -->
