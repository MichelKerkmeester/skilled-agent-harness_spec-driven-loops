---
title: "Implementation Plan: Portable cross-machine hook paths and Barter framework sync"
description: "Rewrite hook commands to a portable env-var-plus-PATH form, apply across Public source and Barter, and surgically sync the last 100 commits of framework changes into Barter."
trigger_phrases:
  - "portable hook paths plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-portable-cross-machine"
    last_updated_at: "2026-06-08T06:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Portable hook fix + Barter sync shipped"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".codex/hooks.json"
      - ".devin/hooks.v1.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-138-portable-cross-machine"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Portable cross-machine hook paths and Barter framework sync

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON hook configs, bash command strings, rsync |
| **Framework** | Claude Code, Codex, Devin native hooks |
| **Storage** | None |
| **Testing** | JSON parse checks, grep audits, sync verification |

### Overview
Each hook command is rewritten from `cd "<hardcoded abs path>" && /opt/homebrew/bin/node ...` to `cd "${RUNTIME_PROJECT_DIR:-$PWD}" && node ...`, resolving the root per machine and running node from PATH. A small idempotent node fixer normalizes every variant, including the corrupted `n/bin/node`. The Barter mirror is then brought current by copying the 322 framework files Public changed in the last 100 commits, excluding the preserve-list and junk.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Corruption and hardcoding diagnosed across both repos
- [x] Portable form chosen (runtime env var + PATH node)
- [x] Sync scope and exclusions defined

### Definition of Done
- [x] All five hook configs portable and JSON-valid
- [x] Barter framework synced, preserve-list intact
- [x] Packet validated, Public changes committed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime-env-resolved project root with a `$PWD` fallback, mirroring the form Devin hooks already used (`${DEVIN_PROJECT_DIR}`).

### Key Components
- **Hook configs**: `.codex/hooks.json`, `.devin/hooks.v1.json`, and the three Barter equivalents.
- **Fixer**: an idempotent node script that rewrites command strings.
- **Sync**: `rsync --files-from` over the changed-file list with symlink preservation.

### Data Flow
A runtime fires a hook, the command resolves the root from its own env var, cd-s there, and runs the relative hook script with PATH node.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Public `.codex/hooks.json` | Hardcoded Public path + homebrew node | Portable cd + PATH node | grep clean; JSON valid |
| Public `.devin/hooks.v1.json` | Portable cd, homebrew node | PATH node only | grep clean; JSON valid |
| Barter three hook configs | Hardcoded/corrupted paths | Portable cd + PATH node | grep clean; JSON valid |
| Barter `.opencode/**` | Behind Public | Surgical sync of changed files | launcher has reap fix; preserve-list untouched |

Required inventories:
- Producers: the hardcoded form appeared in Public source and the Barter copies; the fixer covers every variant.
- Consumers: only the runtime hook runners; the relative script path and PATH node are unchanged.
- Invariant: no hook command contains a machine-specific absolute path or a non-PATH node binary.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Diagnose the hardcoding and the `n/bin/node` corruption in both repos
- [x] Confirm the env-var pattern from the working Devin hook

### Phase 2: Core Implementation
- [x] Write the idempotent fixer
- [x] Fix Public `.codex/hooks.json` and `.devin/hooks.v1.json`
- [x] Fix the three Barter hook configs
- [x] Surgically sync the 322 changed framework files into Barter

### Phase 3: Verification
- [x] JSON valid and grep-clean across all five configs
- [x] Barter preserve-list and configs untouched
- [x] Packet validated, committed
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parse | The five hook configs | node JSON.parse |
| Audit | No hardcoded/corrupted paths remain | ripgrep |
| Sync | Files identical, preserve-list intact | diff, find -newermt |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Runtime project-dir env vars | External | Green | Falls back to `$PWD` |
| rsync | External | Green | Sync would need a manual copy loop |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A hook fails to find its root on a given runtime.
- **Procedure**: Restore the config from the backup in `/tmp`, or re-run the fixer; the prior hardcoded form is in git history for the Public files.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Cross-repo diagnosis |
| Core Implementation | Low | Fixer plus a scoped rsync |
| Verification | Low | Grep and diff checks |
| **Total** | | Part of one session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Barter configs and the 322 files backed up to `/tmp`
- [x] Each config JSON-parse-checked
- [x] Packet validated before commit

### Rollback Procedure
1. Restore the affected config from `/tmp/barter-config-backup` or `/tmp/barter-pre-sync-backup.tar.gz`.
2. For Public, `git revert` the hook commit.
3. Confirm the runtime loads the restored hooks on a fresh session.
4. No data reversal needed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
