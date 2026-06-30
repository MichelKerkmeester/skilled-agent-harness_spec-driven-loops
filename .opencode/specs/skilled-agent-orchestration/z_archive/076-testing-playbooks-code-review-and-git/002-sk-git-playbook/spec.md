---
title: "Feature Specification: 002 - sk-git manual testing playbook"
description: "Author a manual_testing_playbook for sk-git covering 21 realistic scenarios across 6 categories: worktree, commit, safety refusals, integration, recovery, cross-CLI. Validated by sk-doc and dogfooded via @review."
trigger_phrases:
  - "sk-git playbook"
  - "manual testing playbook for git"
  - "093/002 sk-git"
  - "git workflow regression coverage"
  - "worktree commit playbook"
importance_tier: "high"
contextType: "skill-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/076-testing-playbooks-code-review-and-git/002-sk-git-playbook"
    last_updated_at: "2026-05-07T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 spec docs"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md"
      - ".opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_snippet_template.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 002 - sk-git manual testing playbook

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
sk-git is the three-phase git lifecycle orchestrator (worktree setup → commit formation → finish/PR) used across the repo for every feature shipped. It enforces Conventional Commits with deterministic type/scope inference, refuses unsafe operations (--no-verify, secrets, force-push to main, amending published commits), and drives the `Co-Authored-By` footer. There is no realistic-scenario regression coverage today, so refactors silently break safety refusals or commit hygiene.

### Purpose
Author a `manual_testing_playbook/` package for sk-git covering ~21 realistic scenarios across 6 categories. Prompts use the RCAF pattern, mirror real human-AI conversation, and exercise both happy paths AND safety-refusal flows. Executable both natively and via external CLIs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root playbook `.opencode/skills/sk-git/manual_testing_playbook/manual_testing_playbook.md`.
- 6 numbered category folders: `01--worktree-setup/`, `02--commit-formation/`, `03--safety-refusals/`, `04--integration-and-pr/`, `05--recovery-and-edge-cases/`, `06--cross-cli-orchestration/`.
- ~21 per-feature snippet files following the canonical sk-doc template.
- Cross-CLI category covering native + cli-codex + cli-opencode + cli-gemini/cli-copilot.
- `validate_document.py` clean validation on the root playbook.
- @review-driven sk-code-review DQI quality pass on the playbook.
- Refusal-flow scenarios: --no-verify, secrets in diff, force-push to main, amending published commits, commit when tests fail, `git branch`/`git checkout -b` (must use `git worktree add -b`).

### Out of Scope
- Modifying sk-git SKILL.md or its references - playbook only.
- Validator improvements - current sk-doc validator only checks root.
- Auto-execution harness - prompts are operator-led.
- GitHub MCP feature coverage beyond what sk-git already documents.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-git/manual_testing_playbook/manual_testing_playbook.md` | Create | Root playbook with 6 category summaries + integrated review/release-readiness logic |
| `.opencode/skills/sk-git/manual_testing_playbook/01--worktree-setup/*.md` | Create | 3 per-feature files (fresh feature, current branch, stay-on-main) |
| `.opencode/skills/sk-git/manual_testing_playbook/02--commit-formation/*.md` | Create | 4 per-feature files (conventional commit, scope inference, mixed concerns, Co-Authored-By footer) |
| `.opencode/skills/sk-git/manual_testing_playbook/03--safety-refusals/*.md` | Create | 4 per-feature files (--no-verify refused, secrets refused, force-push refused, amend refused) |
| `.opencode/skills/sk-git/manual_testing_playbook/04--integration-and-pr/*.md` | Create | 4 per-feature files (merge to main, PR with template, failing tests block, cleanup) |
| `.opencode/skills/sk-git/manual_testing_playbook/05--recovery-and-edge-cases/*.md` | Create | 4 per-feature files (merge conflict, accidental wrong branch, empty commit, rebase vs merge) |
| `.opencode/skills/sk-git/manual_testing_playbook/06--cross-cli-orchestration/*.md` | Create | 2-3 per-feature files (native, cli-codex, cli-gemini/cli-copilot handback) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Root playbook exists with all required sections per sk-doc template | `validate_document.py` passes; sections per template |
| REQ-002 | All 21 per-feature files follow snippet template structure | Frontmatter + 5 numbered H2 + 9-col table |
| REQ-003 | All operator prompts use RCAF pattern verbatim | Every prompt opens with `As a {ROLE}, {ACTION} against {TARGET}. Verify {EXPECTED_OUTCOME}. Return {OUTPUT_FORMAT}.` |
| REQ-004 | No forbidden sidecar files | `find` returns empty for `review_protocol.md`, `subagent_utilization_ledger.md`, `snippets/` |
| REQ-005 | Safety refusal scenarios exist for: --no-verify, secrets, force-push to main, amend published | All 4 documented with refusal verification commands |
| REQ-006 | Co-Authored-By footer scenario verifies the canonical footer string | Includes `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Cross-CLI category covers native + cli-codex + cli-opencode + cli-gemini/cli-copilot | Each surface has at least one scenario |
| REQ-011 | Pass/fail criteria reference actual sk-git reference files | Citations like `references/commit_workflows.md §X` |
| REQ-012 | Type/scope inference deterministic checks | Same diff → same commit message verification scenario |
| REQ-013 | @review DQI pass returns no P0/P1 findings | sk-code-review baseline applied |
| REQ-014 | Stay-on-main scenario honors user memory rule | Verifies `create.sh` auto-branch is reverted to main |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Root playbook validates clean via `validate_document.py`.
- **SC-002**: All ~21 per-feature files exist and pass orchestrator structural sweep.
- **SC-003**: 4 safety-refusal scenarios documented and verifiable.
- **SC-004**: Strict `validate.sh` exit code 0 for the child phase folder.
- **SC-005**: @review dispatch returns no P0/P1 findings on the playbook content.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `/create:testing-playbook` setup prompts | Could block autonomous run | Pre-encode answers; rely on `:auto` suffix |
| Risk | Refusal scenarios become hypothetical | Med | Each refusal must specify a real failure trigger and expected error message |
| Risk | Force-push and amend scenarios trigger destructive commands | Med | Use `--dry-run` or read-only equivalents in the test contract; document the dangerous command without executing |
| Risk | Co-Authored-By footer format drift | Low | Pin exact string in REQ-006 |
| Risk | Worktree cleanup scenarios leave artifacts | Low | Cleanup verification commands included in pass criteria |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: cli-codex implementation completes in <30 minutes wall-clock (gpt-5.5 high, normal mode).
- **NFR-P02**: `validate_document.py` returns in <5 seconds.

### Security
- **NFR-S01**: Secret-refusal scenario uses `<REDACTED>` placeholders only - no real credentials.
- **NFR-S02**: Force-push scenarios document the dangerous command for AI to refuse, but do NOT execute it.

### Reliability
- **NFR-R01**: Same diff → same commit message (deterministic type/scope inference) - tested via repeated invocation scenario.
- **NFR-R02**: Per-feature file structure consistent across all ~21 files.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: empty-commit scenario tests refusal of no-change commits.
- Maximum length: large-PR scenario tests commit message under 50-char subject limit.
- Invalid format: scenario where commit message has no recognizable type prefix.

### Error Scenarios
- External service failure: GitHub MCP unreachable - finish workflow falls back to local merge.
- Network timeout: `git push` fails - safe retry guidance.
- Concurrent access: branch behind upstream - rebase-vs-merge decision scenario.

### State Transitions
- Partial completion: commit succeeded but push failed - resumption scenario.
- Session expiry: user resumes after stash; stash-pop confliict scenario.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 22 files (1 root + 21 per-feature); ~3500 LOC; 1 system (sk-git) |
| Risk | 12/25 | Refusal scenarios touch destructive git ops (must document, not execute); doc-only otherwise |
| Research | 14/20 | sk-git has 6 reference files + 3 asset templates + GitHub MCP integration to absorb |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

(none - all clarifications resolved in approved planning document)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
