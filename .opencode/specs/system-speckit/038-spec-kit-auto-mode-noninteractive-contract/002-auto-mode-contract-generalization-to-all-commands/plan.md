---
title: "Implementation Plan: auto-mode-contract generalization"
description: "Three codex dispatches migrate 11 commands; 12 sequential live :auto dispatch verifications produce per-command evidence."
trigger_phrases:
  - "auto mode contract generalization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/083-spec-kit-auto-mode-noninteractive-contract/002-auto-mode-contract-generalization-to-all-commands"
    last_updated_at: "2026-05-11T12:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch codex group 1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "103-002-auto-mode-contract-generalization"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: auto-mode-contract generalization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command surfaces + sk-doc reference doc |
| **Framework** | system-spec-kit + sk-doc |
| **Storage** | Filesystem; git on main |
| **Testing** | Per-command live `:auto` dispatch + strict-validate |

### Overview
Three codex group dispatches handle the 11-command migration (spec_kit/5, create/6, improve/1). Each dispatch is bounded to its group's command files + reads the shared contract for context. Live verification is 12 sequential `:auto` dispatches (one per command including deep-review re-verification) capturing transcripts as evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Shared `auto_mode_contract.md` exists (created during Stage B).
- [ ] `/deep:start-review-loop.md` refactored to cite shared contract (verified Stage B).
- [ ] cli-codex binary + auth verified.

### Definition of Done
- [ ] All 12 commands cite the shared contract.
- [ ] 12 live `:auto` dispatch evidence files exist with verdicts.
- [ ] ≥10/12 PASS.
- [ ] strict-validate 103 + 001 + 002 exit 0.
- [ ] `:confirm` regression check: no command's consolidated Q-block touched.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-command markdown migration via cli-codex `gpt-5.5 high fast` inline-contract dispatch (3 group dispatches, sequential). Each dispatch:
- Reads the shared contract for context
- Reads each command's current §0
- Identifies Q-block fields and their resolution paths (flag / default / requires-ask)
- Authors per-command Default Resolution Table + PRE-BOUND SETUP ANSWERS field list
- Replaces the consolidated-Q-block under `:auto` with citation + table + field list
- Preserves the existing `:confirm` path untouched
- Updates frontmatter `argument-hint`

### Key Components
- **Shared contract**: `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md` (created Stage B)
- **Per-command markdowns**: 12 files modified
- **Codex group dispatches**: 3 sequential, scope-locked to each group's files
- **Live verifications**: 12 sequential dispatches; minimum-effort PRE-BOUND ANSWERS per command

### Data Flow
1. Stage B authored shared contract + refactored deep-review.md (DONE).
2. Stage C: 3 codex group dispatches migrate 11 commands.
3. Stage D: 12 sequential live `:auto` dispatches verify each command.
4. Stage E: aggregate verdicts into implementation-summary; commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `auto_mode_contract.md` | New shared reference | Author with §1-8 | grep section count + dry-run trace re-run on 001 |
| `deep-review.md` §0 | Inline three-tier from 001 | Refactor to citation + retained per-field table | grep citation count + behavior re-verification |
| `/speckit:*.md` (5) | Each has consolidated Q-block under `:auto` | Replace with citation + per-field table; preserve `:confirm` | per-command grep + read-back diff |
| `/create:*.md` (6) | Each has consolidated Q-block under `:auto` | Same | Same |
| `/deep:start-agent-improvement-loop.md` (1) | Consolidated Q-block under `:auto` | Same | Same |
| Per-command paired YAML | Consumer of resolved config.json | Verify no consumer-side change needed; if forced, document | live dispatch passes |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Shared contract authored (Stage B).
- [x] deep-review.md refactored to cite (Stage B).
- [ ] Confirm 001's dry-run traces still conceptually pass after refactor.

### Phase 2: Core Implementation
- [ ] Codex group dispatch 1 — `/speckit:` 5 commands.
- [ ] Codex group dispatch 2 — `/create:` 6 commands.
- [ ] Codex group dispatch 3 — `/deep:start-agent-improvement-loop` (1 command).

### Phase 3: Verification
- [ ] 12 sequential live `:auto` dispatches; one transcript per command.
- [ ] Verdict per transcript (PASS / PARTIAL / FAIL / SKIP).
- [ ] Populate implementation-summary results table.
- [ ] strict-validate 103 + 001 + 002 → 0 errors.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live dispatch | Per-command `:auto` setup-phase resolution | cli-codex / cli-claude-code / cli-opencode |
| Read-back diff | `:confirm` regression per command | manual grep |
| Strict validate | 103 + 001 + 002 packets | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `auto_mode_contract.md` exists | Internal | Green | Per-command citations have no target |
| cli-codex binary | External | Green | Cannot batch-migrate via codex |
| cli-claude-code + cli-opencode binaries | External | Green | Live verification matrix lacks runtime diversity |
| Per-command paired YAML accepts resolved config shape | Internal | Green (matched 001 behavior) | YAML consumer-side fix needed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Per-command live verification FAILs irrecoverably; `:confirm` regression detected.
- **Procedure**: `git restore <command-md>` per failing command. Codex dispatch transcript stays as failure evidence.
- **State preserved**: 002 spec folder, shared contract doc, deep-review refactor.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

| Phase | Depends On | Provides | Notes |
|-------|-----------|----------|-------|
| Phase 1: Setup | 001 (Complete) + shared contract authored | Refactor verified | No new writes after Stage B |
| Phase 2: Implementation | Phase 1 | 11 migrated commands | Sequential codex group dispatches |
| Phase 3: Verification | Phase 2 | 12 evidence files + verdicts | Sequential live dispatches |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATION

| Activity | Estimate | Drivers |
|----------|----------|---------|
| Shared contract authoring | 30 min | Done in Stage B |
| deep-review refactor | 10 min | Done in Stage B |
| Codex group dispatch ×3 | 30-45 min total | Sequential; ~10-15 min each |
| Live verification ×12 | 60-90 min | Sequential; ~5-7 min each |
| Synthesis + commits | 20 min | Implementation-summary fill + 2 commits |
| **Total** | **~3 hours** | Excluding any FAIL retry cycles |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

### Failure Modes

| Failure Mode | Trigger | Rollback Action |
|--------------|---------|-----------------|
| Codex group dispatch partial-edit | Transcript shows N of M commands migrated, exit !=0 | Per-command `git restore` + retry remaining commands |
| `:confirm` regression in any command | Read-back diff reveals consolidated-Q-block changed | `git restore <command-md>` + re-dispatch with tighter prompt |
| Live verification produces unexpected file writes | Transcript shows writes outside `/tmp` | Immediate halt + `git diff --name-only` audit + restore offending files |
| YAML consumer rejects new config shape | Live dispatch exits with consumer-side error | Document the YAML field gap; either fix YAML in this packet (document in §Key Decisions) or file a follow-on packet |

### State Preserved Across Rollback
- Shared contract doc stays.
- deep-review.md refactor stays (Stage B baseline).
- Successfully migrated commands stay.
- 002 spec folder + evidence dir stay.

### Recovery Procedure
1. Identify which command failed.
2. `git diff <command-md>` to see actual change.
3. `git restore <command-md>` if irrecoverable.
4. Re-dispatch with corrected prompt (tighter scope, more explicit per-field rules).
5. Re-verify after each retry.
<!-- /ANCHOR:enhanced-rollback -->
