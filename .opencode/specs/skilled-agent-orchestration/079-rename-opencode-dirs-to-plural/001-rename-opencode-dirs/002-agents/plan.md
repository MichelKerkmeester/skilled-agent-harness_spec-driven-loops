---
title: "Implementation Plan: 096/002 - agents rename"
description: "git mv + bulk sed + targeted patches for CLAUDE.md/sk-prompt/runtime_capabilities/audit_descriptions.py."
trigger_phrases:
  - "096/002 plan"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/002-agents"
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
# Implementation Plan: 096/002 - agents rename

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
| **Testing** | grep audits + JSON validation + Python syntax |

### Overview
Same 3-step shape as Phase 001: `git mv`, bulk sed (2 passes), targeted Read+Edit on 4 critical files. Smaller scope (1,532 files vs 7,464 in Phase 001).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 001 complete and verified
- [x] Resource map enumerates all reference locations
- [x] Critical-patch list identifies 4 files

### Definition of Done
- [ ] `.opencode/agents/` removed; `.opencode/agents/` populated (12 files)
- [ ] `git grep -E '\.opencode/agents/' | grep -v '\.opencode/agents/'` = 0
- [ ] CLAUDE.md §5 routing table uses plural
- [ ] sk-prompt graph-metadata + runtime_capabilities mirrorPath plural
- [ ] audit_descriptions.py syntax-valid
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Same 3-pass dispatch as Phase 001. Differences: smaller blast radius, fewer critical patches, no opencode-discovery smoke test (already passing post-Phase-001).

### Key Components
- `git mv .opencode/agent .opencode/agents`
- Bulk sed (literal + JSON-escaped passes)
- Targeted Read+Edit on 4 files
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/agents/` | Producer of agent definitions | Renamed | `ls .opencode/agents/ \| wc -l` = 12 |
| 1,532 reference-bearing files | Text refs | Bulk sed | grep audit |
| CLAUDE.md §5 | Producer of runtime-routing rules | Targeted Edit | Table renders correctly |
| sk-prompt graph-metadata.json | Producer of mirror metadata | Targeted Edit | JSON validates + mirrorPath plural |
| deep-research runtime_capabilities.json | Producer of runtime mirror metadata | Targeted Edit | JSON validates + mirrorPath plural |
| audit_descriptions.py | Validator script | Targeted Edit (agent half only) | Python syntax-valid |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Phase 001 verified done
- [x] cli-codex prompt scaffolded

### Phase 2: Implementation
- [ ] T010 cli-codex: `git mv .opencode/agent .opencode/agents`
- [ ] T011 cli-codex: bulk sed pass 1 (literal)
- [ ] T012 cli-codex: bulk sed pass 2 (JSON-escaped)
- [ ] T013 cli-codex: patch CLAUDE.md §5
- [ ] T014 cli-codex: patch sk-prompt graph-metadata.json
- [ ] T015 cli-codex: patch runtime_capabilities.json
- [ ] T016 cli-codex: patch audit_descriptions.py (agent half)

### Phase 3: Verification
- [ ] T020 grep audit returns 0
- [ ] T021 JSON validates
- [ ] T022 Python compile
- [ ] T023 Author implementation-summary.md
- [ ] T024 Update graph-metadata.json
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | grep audit | git grep |
| Integration | JSON parsers + Python compile | python3 |
| Regression | validate.sh strict on 095 | validate.sh |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| Phase 001 complete | Internal | TBD (this plan assumes done) |
| cli-codex | External | Green |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Verification gate fails AND cli-codex re-dispatch can't recover.
- **Procedure**: `git reset --hard <pre-phase-002 SHA>` to revert this phase only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 done | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 003 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 min |
| Core Implementation | Med | 3-6 min wall-clock |
| Verification | Low | 2-3 min |
| **Total** | | **~6-10 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase 001 complete and verified
- [ ] On main branch
- [ ] cli-codex sandbox=workspace-write

### Rollback Procedure
1. `git reset --hard <pre-phase-002 SHA>` (revert phase 002 only)
2. Re-inspect `.opencode/agents/` to confirm restored
3. Document failure mode

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: `git reset --hard`
<!-- /ANCHOR:enhanced-rollback -->
