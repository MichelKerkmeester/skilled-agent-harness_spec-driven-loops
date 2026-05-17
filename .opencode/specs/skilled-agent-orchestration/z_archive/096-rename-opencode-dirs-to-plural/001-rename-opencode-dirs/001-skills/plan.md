---
title: "Implementation Plan: 096/001 - skills rename"
description: "git mv + bulk sed + targeted patches for opencode.json/settings.local.json/skill_advisor.py; cli-codex executes."
trigger_phrases:
  - "096/001 plan"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills"
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
# Implementation Plan: 096/001 - skills rename

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
| **Testing** | validate.sh strict + grep audits + smoke tests |

### Overview
cli-codex executes `git mv .opencode/skill .opencode/skills`, then runs bulk sed across all reference-bearing files, then targeted Read+Edit patches on 3 critical configs/scripts. Self-validates via grep audit and smoke tests. Orchestrator post-validates and commits.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Resource map enumerates all reference locations
- [x] Critical patches identified with line numbers
- [x] cli-codex shape decided

### Definition of Done
- [ ] `.opencode/skills/` removed; `.opencode/skills/` populated
- [ ] `git grep -E '\.opencode/skills/' | grep -v '\.opencode/skills/'` = 0
- [ ] opencode.json valid + 3 MCP refs use plural
- [ ] settings.local.json valid + 4 hooks use plural
- [ ] skill_advisor.py compiles and routes correctly
- [ ] opencode CLI smoke test passes (no "Could not find" warning)
- [ ] validate.sh on packet 095 still exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
3-pass dispatch: (1) git mv directory, (2) bulk sed all reference-bearing files, (3) targeted Read+Edit on 3 critical configs/scripts. Verification: 3 idempotent gates (grep audit, JSON validation, smoke tests).

### Key Components
- **`git mv` operation**: atomic in working tree.
- **Bulk sed**: literal-pattern + JSON-escaped-pattern passes; macOS `-i ''` form.
- **Targeted patches**: `opencode.json`, `.claude/settings.local.json`, `skill_advisor.py`.
- **Verification**: grep, JSON load test, regex compile test, opencode smoke.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/` directory | Producer of skills runtime | Renamed via `git mv` | `ls .opencode/skills/ \| wc -l` matches old |
| 7,464 reference-bearing files | Consumers (text refs) | Bulk sed | grep audit returns 0 |
| `opencode.json` MCP commands | Producer of MCP server bindings | Targeted Edit | JSON validates + commands resolve to existing files |
| `.claude/settings.local.json` hooks | Producer of Claude Code hook bindings | Targeted Edit | JSON validates + hook scripts exist |
| `skill_advisor.py` (regex/dict/f-string) | Producer of skill routing decisions | Targeted Edit | re.compile succeeds + smoke invocation returns reco |

Required inventories:
- Same-class producers: `git ls-files | xargs grep -l '\.opencode/skills/'` returns 7,464 files.
- Algorithm invariant: `git mv` preserves blob hash per file; sed substitution is byte-equal except for the path string.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Resource map authored
- [x] cli-codex prompt scaffolded
- [x] Smoke-test command verified (opencode run + grep)

### Phase 2: Core Implementation (cli-codex)
- [ ] T010 `git mv .opencode/skill .opencode/skills`
- [ ] T011 Bulk sed pass 1 (literal `.opencode/skills/`)
- [ ] T012 Bulk sed pass 2 (JSON-escaped `.opencode\/skill\/`)
- [ ] T013 Patch `opencode.json` (3 MCP commands)
- [ ] T014 Patch `.claude/settings.local.json` (4 hook commands)
- [ ] T015 Patch `skill_advisor.py` (regex + dict + f-strings)

### Phase 3: Verification
- [ ] T020 Grep audit returns 0 (`git grep -E '\.opencode/skills/' | grep -v '\.opencode/skills/'`)
- [ ] T021 JSON files validate (opencode.json, settings.local.json)
- [ ] T022 skill_advisor.py compiles + smoke test
- [ ] T023 opencode smoke test (no "Could not find" warning)
- [ ] T024 validate.sh on packet 095 returns exit 0
- [ ] T025 validate_document.py on all 16 playbook roots returns VALID
- [ ] T026 Author implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | grep audit | git grep + bash |
| Integration | JSON parsers + Python compile | python3 |
| Manual | opencode smoke test | opencode run |
| Regression | Existing playbooks + scripts | validate.sh, validate_document.py |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| cli-codex (gpt-5.5 medium fast) | External | Green |
| git mv | System | Green |
| sed (BSD/macOS form) | System | Green |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Verification gate fails AND cli-codex re-dispatch can't recover.
- **Procedure**: `git reset --hard HEAD` (working tree only; commits not yet made for this phase).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 min |
| Core Implementation (cli-codex) | Med | 5-10 min wall-clock |
| Verification | Low | 3-5 min |
| **Total** | | **~10-20 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Branch is `main`
- [ ] Working tree dirty only with expected parallel-track files (not in our scope)
- [ ] cli-codex sandbox=workspace-write

### Rollback Procedure
1. `git reset --hard HEAD` to revert all working-tree changes.
2. Re-inspect `.opencode/skills/` to confirm restored.
3. Document the failure mode in implementation-summary.

### Data Reversal
- **Has data migrations?** No — text only.
- **Reversal procedure**: `git reset --hard HEAD`.
<!-- /ANCHOR:enhanced-rollback -->
