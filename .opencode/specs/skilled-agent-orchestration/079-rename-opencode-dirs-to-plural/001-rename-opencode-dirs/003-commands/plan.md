---
title: "Implementation Plan: 096/003 - commands rename"
description: "git mv + bulk sed + targeted patches for audit_descriptions.py/target_manifest.jsonc/mcp-doctor.sh."
trigger_phrases:
  - "096/003 plan"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/003-commands"
    last_updated_at: "2026-05-07T14:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md"
    next_safe_action: "Dispatch cli-codex"
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
# Implementation Plan: 096/003 - commands rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | Bash + git + sed + python3 |
| **Executor** | cli-codex (gpt-5.5 medium fast) |
| **Storage** | Git working tree |
| **Testing** | grep audits + Python compile + bash syntax |

### Overview
Same 3-step shape as Phases 001/002. Smaller scope than 001 (1,811 vs 7,464 files). Touches `audit_descriptions.py` for the second time (Phase 002 already updated agent-path validators; this phase updates command-path validators).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 001 + 002 complete and verified
- [x] Resource map enumerates references

### Definition of Done
- [ ] `.opencode/commands/` removed; `.opencode/commands/` populated (69 files)
- [ ] `git grep -E '\.opencode/commands/' | grep -v '\.opencode/commands/'` = 0
- [ ] audit_descriptions.py compiles
- [ ] target_manifest.jsonc parses
- [ ] mcp-doctor.sh syntax-valid
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Same 3-pass dispatch. Differences: `audit_descriptions.py` was already touched in Phase 002 for agent paths; this phase updates its remaining command-path references.

### Key Components
- `git mv .opencode/command .opencode/commands`
- Bulk sed (literal + JSON-escaped passes)
- Targeted Read+Edit on 3 files
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/commands/` | Producer of slash-command definitions | Renamed | `ls .opencode/commands/ \| wc -l` matches |
| 1,811 reference-bearing files | Text refs | Bulk sed | grep audit |
| audit_descriptions.py | Validator script | Targeted Edit (command half) | Python compile |
| target_manifest.jsonc | Producer of agent improvement targets | Targeted Edit | JSONC parse |
| mcp-doctor.sh | Diagnostic script | Targeted Edit | bash -n syntax check |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Phases 001 + 002 verified done
- [x] cli-codex prompt ready

### Phase 2: Implementation
- [ ] T010 cli-codex: `git mv .opencode/command .opencode/commands`
- [ ] T011 cli-codex: bulk sed pass 1 (literal)
- [ ] T012 cli-codex: bulk sed pass 2 (JSON-escaped)
- [ ] T013 cli-codex: patch audit_descriptions.py (command half)
- [ ] T014 cli-codex: patch target_manifest.jsonc
- [ ] T015 cli-codex: patch mcp-doctor.sh

### Phase 3: Verification
- [ ] T020 grep audit returns 0
- [ ] T021 Python compile + JSONC parse + bash syntax
- [ ] T022 Author implementation-summary.md
- [ ] T023 Update graph-metadata.json
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | grep audit | git grep |
| Integration | Python + JSONC + bash syntax | python3, jq, bash -n |
| Regression | validate.sh strict on 095 | validate.sh |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| Phases 001 + 002 complete | Internal | TBD |
| cli-codex | External | Green |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Verification gate fails AND cli-codex re-dispatch can't recover.
- **Procedure**: `git reset --hard <pre-phase-003 SHA>` to revert this phase only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 001, 002 done | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 004 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 min |
| Core Implementation | Med | 4-7 min wall-clock |
| Verification | Low | 2-3 min |
| **Total** | | **~7-11 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phases 001 + 002 done
- [ ] On main
- [ ] cli-codex sandbox=workspace-write

### Rollback Procedure
1. `git reset --hard <pre-phase-003 SHA>`
2. Document failure mode

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: `git reset --hard`
<!-- /ANCHOR:enhanced-rollback -->
