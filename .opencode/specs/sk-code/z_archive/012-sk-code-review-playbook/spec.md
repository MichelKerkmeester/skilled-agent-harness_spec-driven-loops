---
title: "Feature Specification: 001 - sk-code-review manual testing playbook"
description: "Author a manual_testing_playbook package for sk-code-review covering 17 realistic scenarios across 6 categories, validated by sk-doc and dogfooded via @review."
trigger_phrases:
  - "sk-code-review playbook"
  - "manual testing playbook for review"
  - "093/001 sk-code-review"
  - "code review playbook"
  - "review baseline regression coverage"
importance_tier: "high"
contextType: "skill-quality"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/012-sk-code-review-playbook"
    last_updated_at: "2026-05-07T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 spec docs"
    next_safe_action: "Dispatch cli-codex implementation"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code-review/SKILL.md"
      - ".opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md"
      - ".opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_snippet_template.md"
      - ".opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 001 - sk-code-review manual testing playbook

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
sk-code-review is the findings-first review baseline used by `@review`, `@deep-review`, and `/speckit:deep-review`. It defines P0/P1/P2 severity, mandatory security/correctness minimums, finding-class taxonomy (instance-only / class-of-bug / cross-consumer / algorithmic / matrix/evidence / test-isolation), and evidence-with-file:line discipline. There is no realistic-scenario regression coverage today, so refactors silently break the contract.

### Purpose
Author a `manual_testing_playbook/` package for sk-code-review that covers ~17 realistic scenarios across 6 categories, with RCAF-pattern operator prompts mirroring how humans actually invoke code review with an AI assistant - executable both natively (Claude Code / OpenCode) and via external CLIs (cli-codex, cli-opencode, cli-gemini, cli-copilot).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root playbook `.opencode/skills/sk-code-review/manual_testing_playbook/manual_testing_playbook.md` (~600-800 LOC).
- 6 numbered category folders: `01--baseline-review-flow/`, `02--security-and-correctness-minimums/`, `03--severity-and-evidence-discipline/`, `04--scope-and-precedence/`, `05--re-review-and-stale-context/`, `06--cross-cli-orchestration/`.
- ~17 per-feature snippet files following the canonical sk-doc template (frontmatter + 5 numbered H2 sections + 9-column scenario table).
- Cross-CLI category covering native Claude Code / OpenCode + cli-codex + cli-opencode + cli-gemini.
- `validate_document.py` clean validation on the root playbook.
- @review-driven sk-code-review DQI quality pass on the playbook (dogfoods sk-code-review while validating its own playbook).

### Out of Scope
- Modifying sk-code-review SKILL.md or its references - playbook only.
- Validator improvements - current sk-doc validator only checks root.
- Auto-execution harness - playbook prompts are operator-led, not automated.
- Coverage of every reference file edge case - target real-world scenarios.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code-review/manual_testing_playbook/manual_testing_playbook.md` | Create | Root playbook with 6 category summaries + integrated review/release-readiness logic |
| `.opencode/skills/sk-code-review/manual_testing_playbook/01--baseline-review-flow/*.md` | Create | 3 per-feature files (small PR, large refactor, multi-commit branch) |
| `.opencode/skills/sk-code-review/manual_testing_playbook/02--security-and-correctness-minimums/*.md` | Create | 3 per-feature files (auth, input validation, secrets) |
| `.opencode/skills/sk-code-review/manual_testing_playbook/03--severity-and-evidence-discipline/*.md` | Create | 3 per-feature files (P0 with file:line, finding-class, cross-consumer) |
| `.opencode/skills/sk-code-review/manual_testing_playbook/04--scope-and-precedence/*.md` | Create | 3 per-feature files (explicit scope, baseline-vs-surface precedence, test code review) |
| `.opencode/skills/sk-code-review/manual_testing_playbook/05--re-review-and-stale-context/*.md` | Create | 3 per-feature files (re-review, stale architecture, AI-generated code) |
| `.opencode/skills/sk-code-review/manual_testing_playbook/06--cross-cli-orchestration/*.md` | Create | 3 per-feature files (native, cli-codex delegation, cli-opencode/cli-gemini handback) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Root playbook exists with all required sections per sk-doc template | `validate_document.py` passes; sections present: OVERVIEW, GLOBAL PRECONDITIONS, GLOBAL EVIDENCE REQUIREMENTS, DETERMINISTIC COMMAND NOTATION, REVIEW PROTOCOL, SUB-AGENT ORCHESTRATION, per-category summaries, AUTOMATED TEST CROSS-REFERENCE, FEATURE CATALOG CROSS-REFERENCE INDEX |
| REQ-002 | All 17 per-feature files follow snippet template structure | Each file has frontmatter + 5 numbered H2 sections (OVERVIEW, SCENARIO CONTRACT, TEST EXECUTION, SOURCE FILES, SOURCE METADATA) + 9-column scenario table |
| REQ-003 | All operator prompts use RCAF pattern verbatim | Every prompt opens with `As a {ROLE}, {ACTION} against {TARGET}. Verify {EXPECTED_OUTCOME}. Return {OUTPUT_FORMAT}.` |
| REQ-004 | No forbidden sidecar files | `find` returns empty for `review_protocol.md`, `subagent_utilization_ledger.md`, `snippets/` |
| REQ-005 | Exact-prompt sync between SCENARIO CONTRACT and 9-column table | Token-level equality; orchestrator audit gate |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Cross-CLI category covers native + cli-codex + cli-opencode + cli-gemini | Each surface has at least one scenario with executable command sequence |
| REQ-011 | Pass/fail criteria reference actual sk-code-review reference files | Citations like `references/security_checklist.md §X` or `references/review_core.md` evidence rule |
| REQ-012 | Each category has ≥3 scenarios except cross-cli (≥3) | Category coverage spread |
| REQ-013 | @review DQI pass returns no P0/P1 findings | sk-code-review baseline applied; severity/evidence/scope all pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Root playbook validates clean via `validate_document.py`.
- **SC-002**: All 17 per-feature files exist and pass orchestrator-driven structural sweep.
- **SC-003**: Cross-CLI category executable on at least 2 surfaces (Claude Code native + cli-codex).
- **SC-004**: Strict `validate.sh` exit code 0 for the child phase folder.
- **SC-005**: @review dispatch returns no P0/P1 findings on the playbook content.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `/create:testing-playbook` command Q-prompts | Could block autonomous run if cli-codex hits interactive setup question | Pre-encode answers in dispatch prompt; rely on `:auto` suffix |
| Risk | RCAF prompts drift to bare paraphrases | Med | Cite cli-claude-code/sk-prompt examples explicitly in dispatch prompt |
| Risk | Cross-CLI scenarios become synthetic | Med | Each scenario must specify a real terminal command and expected exit code |
| Risk | Scope drift into modifying SKILL.md | Low | Plan explicitly excludes; verification audits diff |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: cli-codex implementation completes in <30 minutes wall-clock for one playbook (gpt-5.5 high, normal mode).
- **NFR-P02**: `validate_document.py` returns in <5 seconds for the root playbook.

### Security
- **NFR-S01**: No secrets, hardcoded credentials, or sensitive paths in any playbook content.
- **NFR-S02**: All scenarios must instruct operator to run real commands - "unautomatable" is not a valid status.

### Reliability
- **NFR-R01**: Validation deterministic - same content always produces same validator verdict.
- **NFR-R02**: Per-feature file structure consistent across all 17 files (zero drift).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: scenario asks operator to handle "review with no diff" gracefully (refuse, not crash).
- Maximum length: large refactor (500+ LOC, multi-file) scenario tests review pipeline scalability.
- Invalid format: scenario where reviewer encounters truncated/corrupted diff.

### Error Scenarios
- External service failure: cli-codex unreachable - fall back to native review.
- Network timeout: operator scenario where review request times out - escalation flow tested.
- Concurrent access: multi-commit feature branch with concurrent edits - finding lineage to commit SHAs.

### State Transitions
- Partial completion: re-review-after-fixes scenario tests resumption with prior findings loaded.
- Session expiry: stale-architecture scenario tests fresh-pass behavior when context is outdated.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 18 files (1 root + 17 per-feature); ~3000 LOC across all files; 1 system (sk-code-review) |
| Risk | 8/25 | No code execution risk; doc-only change; reversible |
| Research | 15/20 | Deep skill analysis required; sk-code-review has 9 reference files + agent definitions to absorb |
| **Total** | **35/70** | **Level 2** (QA validation work; doc-only) |
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
