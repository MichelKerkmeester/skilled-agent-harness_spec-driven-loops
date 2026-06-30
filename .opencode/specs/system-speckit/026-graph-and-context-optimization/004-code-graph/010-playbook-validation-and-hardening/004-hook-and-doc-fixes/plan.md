---
title: "Implementation Plan: Hook + Doc-Sync Fixes (029 Phase 004)"
description: "Correct the Devin SessionStart hook path and reconcile stale playbook scenario docs."
trigger_phrases:
  - "devin hook fix plan"
  - "playbook doc sync plan"
  - "029 phase 004 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/004-hook-and-doc-fixes"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 004 plan"
    next_safe_action: "Proceed to phase 005 DB cleanup"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-code-graph-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Hook + Doc-Sync Fixes (029 Phase 004)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON config + Markdown docs |
| **Framework** | Devin hooks v1 + system-code-graph playbook |
| **Storage** | None |
| **Testing** | jq parse + hook invocation + grep verification |

### Overview
Single-line path correction in `.devin/hooks.v1.json`, verified by invoking the registered path; plus targeted edits to stale playbook scenario docs reconciled against 029 evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] F-025-1 correct path confirmed to exist
- [x] Stale doc targets identified from 029 evidence

### Definition of Done
- [ ] Registered hook path exists + emits payload
- [ ] `.devin/hooks.v1.json` valid JSON
- [ ] Playbook docs reconciled
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Config + doc edit; verify by execution.

### Key Components
- **`.devin/hooks.v1.json`** — SessionStart hook registration.
- **playbook scenario docs** — 020, 011, 021, 009, 010.

### Data Flow
Edit → jq-validate → invoke hook → grep payload.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.devin/hooks.v1.json` SessionStart | registers hook path | update path | `jq` path + `test -f` + invoke |
| playbook 020/011/021/009/010 | scenario expectations | edit to match runtime | grep edited values |

Required inventories:
- Other references to the wrong hook path: `rg -n 'system-code-graph/dist/system-spec-kit' .` (confirm none remain).
- Other "11 tools" references: `rg -n '11 tools' .opencode/skills/system-code-graph/manual_testing_playbook`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Hook fix
- [ ] Edit `.devin/hooks.v1.json` SessionStart command path
- [ ] jq-validate + `test -f` registered path + invoke startup payload

### Phase 2: Doc-sync
- [ ] 020: 11→8 tools
- [ ] 011: replace stale verify-`rating` sub-check
- [ ] 021: reconcile label vs content
- [ ] 009/010: update cited line ranges

### Phase 3: Verification
- [ ] `rg` confirms no stale references remain
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | hook invocation + doc grep | node, jq, rg |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| compiled hook artifact | Internal | Green | hook can't fire |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: hook still fails or JSON invalid.
- **Procedure**: `git checkout -- .devin/hooks.v1.json` and re-investigate.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Hook fix ──┐
           ├──► Verification
Doc-sync ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Hook fix | None | Verification |
| Doc-sync | None | Verification |
| Verification | both | parent rollup |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Hook fix | Low | 5 min |
| Doc-sync | Low | 15 min |
| Verification | Low | 5 min |
| **Total** | | **~25 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `.devin/hooks.v1.json` backed by git (revertable)

### Rollback Procedure
1. `git checkout -- .devin/hooks.v1.json`
2. Revert playbook doc edits via git if needed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
