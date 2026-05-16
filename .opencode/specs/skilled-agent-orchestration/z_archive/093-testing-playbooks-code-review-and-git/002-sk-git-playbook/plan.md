---
title: "Implementation Plan: 002 - sk-git manual testing playbook"
description: "Author manual_testing_playbook for sk-git via cli-codex (gpt-5.5 high, normal mode); 21 scenarios across 6 categories; sk-doc + DQI verification."
trigger_phrases:
  - "sk-git playbook plan"
  - "093/002 plan"
importance_tier: "high"
contextType: "skill-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/093-testing-playbooks-code-review-and-git/002-sk-git-playbook"
    last_updated_at: "2026-05-07T00:00:00Z"
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
# Implementation Plan: 002 - sk-git manual testing playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter |
| **Framework** | sk-doc testing-playbook contract |
| **Storage** | `.opencode/skills/sk-git/manual_testing_playbook/` |
| **Testing** | `validate_document.py` + manual structural sweep + @review DQI |

### Overview
Use `/create:testing-playbook sk-git create :auto` to scaffold the package, then have cli-codex (gpt-5.5 high, normal mode) author the root playbook plus ~21 per-feature snippet files. Special emphasis on safety-refusal scenarios (--no-verify, secrets, force-push, amend) and Conventional Commits determinism. Verification dogfoods sk-code-review on the produced playbook.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001..SC-005)
- [x] Dependencies identified (cli-codex, sk-doc validator, sk-git skill content)

### Definition of Done
- [ ] All ~21 per-feature files exist with correct structure
- [ ] Root playbook validates via `validate_document.py`
- [ ] `validate.sh --strict` returns exit 0
- [ ] @review DQI pass returns no P0/P1 findings
- [ ] All 4 safety-refusal scenarios verified
- [ ] implementation-summary.md filled with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Doc-as-code with template-driven generation. Special handling for refusal scenarios: each refusal documents the dangerous command and expected refusal message without executing it.

### Key Components
- **Root playbook**: Index + global preconditions + integrated review/release-readiness + 6 category summaries.
- **Per-feature snippet files**: 9-column scenario tables + RCAF prompts.
- **Refusal scenarios** (sub-class of per-feature): document dangerous-command + expected refusal text + verification that AI does NOT execute.
- **Validation harness**: `validate_document.py` + structural sweep + @review DQI.

### Data Flow
1. cli-codex reads SKILL.md + 6 reference files + 3 asset templates + GitHub MCP integration.
2. Runs `/create:testing-playbook sk-git create :auto`.
3. Authors per-feature files.
4. Authors root playbook.
5. Self-validates and returns.
6. Orchestrator verifies, dispatches @review, runs canonical save.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable - documentation-creation packet, not a fix. Only `.opencode/skills/sk-git/manual_testing_playbook/**` is created.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| sk-git skill content (SKILL.md, references/*, assets/*) | producer of git doctrine being tested | unchanged | grep diff: no edits outside `manual_testing_playbook/` |
| Spec packet docs | continuity surfaces | unchanged | orchestrator owns these |
| sk-doc validator | policy enforcer | unchanged | invocation only |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] cli-codex reads sk-git SKILL.md + all 6 reference files
- [ ] cli-codex reads 3 asset templates (worktree-checklist, commit-message-template, pr-template)
- [ ] cli-codex reads `references/github_mcp_integration.md`
- [ ] cli-codex reads sk-doc templates + creation reference
- [ ] cli-codex reads reference playbooks for prompt voice (sk-prompt + cli-claude-code)

### Phase 2: Core Implementation
- [ ] Run `/create:testing-playbook sk-git create :auto` to scaffold root + 6 categories
- [ ] Author 3 per-feature files in `01--worktree-setup/`
- [ ] Author 4 per-feature files in `02--commit-formation/`
- [ ] Author 4 per-feature files in `03--safety-refusals/`
- [ ] Author 4 per-feature files in `04--integration-and-pr/`
- [ ] Author 4 per-feature files in `05--recovery-and-edge-cases/`
- [ ] Author 2-3 per-feature files in `06--cross-cli-orchestration/`
- [ ] Author root `manual_testing_playbook.md`

### Phase 3: Verification
- [ ] cli-codex self-runs `validate_document.py` and reports
- [ ] Orchestrator runs `validate.sh --strict`
- [ ] Orchestrator runs per-feature structural sweep
- [ ] Orchestrator runs forbidden-sidecar sweep
- [ ] Orchestrator dispatches @review for DQI
- [ ] Resolve any P0/P1 via cli-codex follow-up
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Per-file structural validity | `validate_document.py`; orchestrator sweep |
| Integration | Cross-file consistency | Manual orchestrator audit |
| Manual | Operator readability of refusal scenarios | Spot-check 3-5 random files; verify refusal scenarios are unambiguous |
| Quality | Findings-first DQI on the playbook | @review with sk-code-review baseline |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex (gpt-5.5 high, normal mode) | External executor | Green | Halt; need fallback |
| `/create:testing-playbook` command | Internal | Green | Halt scaffolding |
| sk-doc validator | Internal | Green | Cannot certify quality |
| sk-git skill content | Internal reference | Green | Need for scenarios |
| Reference playbooks (sk-prompt, cli-claude-code) | Internal reference | Green | Shape and prompt voice |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: cli-codex output fails validate_document.py and cannot be repaired in ≤2 follow-up dispatches; or @review reports >2 P0 findings without clear remediation.
- **Procedure**: `git rm -rf .opencode/skills/sk-git/manual_testing_playbook/`; revert child 002 spec docs to draft; document blocker.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup)──────► Phase 2 (Implement)──────► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implement |
| Implement | Setup | Verify |
| Verify | Implement | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 3-6 minutes |
| Core Implementation | Med | 18-30 minutes (cli-codex authoring 22 files) |
| Verification | Low | 3-5 minutes (validators) + 5-8 minutes (@review DQI) |
| **Total** | | **30-50 minutes wall-clock** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No uncommitted changes outside packet scope
- [ ] cli-codex prompt includes pre-approved spec-folder marker
- [ ] Working directory is `main` branch

### Rollback Procedure
1. If partial: `git restore --staged` then `rm -rf` partial output.
2. If verification fails: dispatch follow-up cli-codex with specific findings.
3. If still failing after 2 follow-ups: revert directory and document blocker.

### Data Reversal
- **Has data migrations?** No - documentation-only.
- **Reversal procedure**: `git rm -rf` + `git commit`.
<!-- /ANCHOR:enhanced-rollback -->
