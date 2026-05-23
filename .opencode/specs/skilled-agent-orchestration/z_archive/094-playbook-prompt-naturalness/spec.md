---
title: "Feature Specification: 094 - playbook prompt naturalness"
description: "Drop the formulaic 'As a {ROLE}...' RCAF prompt as the default in all 16 manual_testing_playbook packages; keep RCAF only where the actor is genuinely an AI orchestrator. Update sk-doc templates to reflect natural-human as the default voice."
trigger_phrases:
  - "094 playbook prompt naturalness"
  - "playbook RCAF refactor"
  - "natural human prompts in playbooks"
  - "drop As a role default"
  - "playbook prompt voice"
importance_tier: "high"
contextType: "skill-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/094-playbook-prompt-naturalness"
    last_updated_at: "2026-05-07T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet"
    next_safe_action: "Apply Phase A sk-doc edits"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md"
      - ".opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_snippet_template.md"
      - ".opencode/skills/sk-doc/references/specific/manual_testing_playbook_creation.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Spec packet shape: flat Level 2 with decision-record.md cross-cutting ADR"
      - "cli-codex tier: medium fast (default cli-codex shape per user direction)"
      - "Heuristic: natural-human is the default; RCAF only when orchestrator-as-actor"
---
# Feature Specification: 094 - playbook prompt naturalness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (with cross-cutting decision-record.md) |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every per-feature file across 16 `manual_testing_playbook/` packages (~498 files total) currently pins an "Exact Prompt" that opens with `As a {ROLE}, {ACTION} against {TARGET}. Verify {EXPECTED_OUTCOME}. Return {OUTPUT_FORMAT}.` (RCAF). Real humans almost never phrase requests that way in normal conversation. The formulaic wrapper makes the playbook scenarios feel synthetic and reduces their value as regression coverage for how AIs actually handle real-world requests.

### Purpose
Naturalize the canonical Prompt: field across all 16 playbooks. Apply RCAF only where the actor is genuinely an AI orchestrator (cross-CLI delegation, multi-agent dispatch, safety-refusal flows where role context determines behavior). Update sk-doc templates and the playbook creation reference so that future authors default to natural-human voice.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 4 sk-doc files: snippet template (lines 67, 79), root template (lines 313, 395+), creation reference §5 (add heuristic subsection), `/create:testing-playbook` command line 317.
- 16 `manual_testing_playbook/` directories under `.opencode/skills/*/` (~498 per-feature files).
- Both prompt-equality locations per per-feature file: SCENARIO CONTRACT `Prompt:` line + 9-col table Exact Prompt cell.
- `decision-record.md` ADR documenting the natural-human-vs-RCAF heuristic.
- Validation: `validate_document.py` clean on every root playbook + structural sweep + prompt-sync audit + RCAF retention rate sanity check + naturalness spot-check.

### Out of Scope
- `Real user request:` field — already natural-human; reference baseline.
- Validator/DQI/contract changes — none enforce RCAF today.
- SKILL.md or reference files of subject skills - playbook content only.
- Authoring NEW playbooks (separate packet).
- Migrating other documentation (READMEs, ADRs) to natural-human voice.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md` | Modify | Lines 313, 333+ - replace RCAF placeholder with natural-human exemplar + heuristic note |
| `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_snippet_template.md` | Modify | Lines 67, 79 - same |
| `.opencode/skills/sk-doc/references/specific/manual_testing_playbook_creation.md` | Modify | §5 Prompt Quality Rules - add "When to use RCAF vs natural-human" subsection |
| `.opencode/commands/create/testing-playbook.md` | Modify | Line 317 - clarify realism > format |
| `.opencode/skills/*/manual_testing_playbook/**` | Modify | Refactor canonical Prompt: field per heuristic; preserve prompt-equality |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | sk-doc templates default to natural-human prompts; RCAF as documented exception | Snippet + root templates show natural-human as default scaffold; creation reference §5 has explicit heuristic subsection |
| REQ-002 | All 16 playbooks audited per the heuristic | Every per-feature file's canonical Prompt: line classified and rewritten where natural-human is more accurate |
| REQ-003 | Prompt-equality contract preserved | SCENARIO CONTRACT prompt == 9-col table Exact Prompt cell, byte-for-byte, in every per-feature file |
| REQ-004 | All root playbooks pass validate_document.py | 16/16 VALID, 0 issues |
| REQ-005 | All per-feature files pass structural sweep | Frontmatter + 5 numbered H2 + 9-col table + non-empty Prompt: line |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | RCAF retention rate within target band | ~140 files (~28%) keep RCAF; not <15% (over-converted) and not >40% (under-converted) |
| REQ-011 | @review DQI on sk-code-review + sk-git playbooks | No P0/P1 regressions; naturalization counts as quality improvement |
| REQ-012 | Decision-record.md captures the heuristic | ADR documents: heuristic, examples, prompt-equality preservation, validator behavior |
| REQ-013 | Naturalness spot-check passes | 5 random scenarios per playbook read like real human-AI conversation |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 4 sk-doc files updated and validate clean.
- **SC-002**: 16/16 playbook root files pass `validate_document.py`.
- **SC-003**: 100% prompt-sync (SCENARIO CONTRACT == 9-col table cell) across ~498 files.
- **SC-004**: RCAF retention rate falls within 15-40% range globally.
- **SC-005**: @review DQI on sk-code-review + sk-git: no new P0/P1 findings.
- **SC-006**: `validate.sh --strict` exit 0 on the 094 packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cli-codex misclassifies orchestrator scenario as human-direct | Med | Heuristic in ADR + per-dispatch prompt; orchestrator spot-check 5/playbook |
| Risk | Prompt-equality drift | High | cli-codex self-validates byte-equality; orchestrator post-dispatch sweep |
| Risk | cli-codex too aggressive (over-converts) | Med | RCAF retention <15% triggers re-dispatch with stricter "keep when in doubt" |
| Dependency | cli-codex (gpt-5.5 medium fast) | Green | Default cli-codex shape per memory rule |
| Dependency | sk-doc validator | Green | Format-agnostic; no changes needed |
| Risk | system-spec-kit playbook (321 files) too big for one cli-codex context | Med | Split into 23 per-category dispatches |
| Risk | 16 sequential dispatches slow (~2-3h wall-clock) | Low | User explicitly requested medium fast; spec packet checkpoints state for resume |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each cli-codex dispatch completes in <15 minutes wall-clock per playbook (medium fast tier).
- **NFR-P02**: Total wall-clock under 4 hours including verification gates.

### Security
- **NFR-S01**: No secrets, hardcoded credentials, or sensitive paths added to any prompt during refactor.
- **NFR-S02**: Naturalization must NOT remove safety-refusal scenario provenance (refusal strings stay pinned).

### Reliability
- **NFR-R01**: Validation gates idempotent - re-running produces same verdict.
- **NFR-R02**: Spec packet checkpoints state per playbook so resume after partial run is safe.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: scenarios with no `Real user request:` field require cli-codex to derive natural voice from objective + scenario name.
- Maximum length: prompts must stay terse enough to fit in a 9-col table cell (no multi-sentence epics).
- Invalid format: scenarios where the existing Prompt: line is malformed - cli-codex must flag rather than silently rewrite.

### Error Scenarios
- cli-codex partial completion (network timeout, rate limit) - resume via per-playbook checkpoint.
- Validator regression - if sk-doc template change breaks validate_document.py, rollback Phase A and reissue.
- Prompt-equality drift on subset - re-dispatch the affected playbook with stricter sync requirement.

### State Transitions
- Partial completion: per-playbook checkpoint via spec packet continuity entries (which playbooks done, which pending).
- Session expiry: resumable via `/speckit:resume specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | ~498 files across 16 directories + 4 sk-doc files; surface-cutting refactor |
| Risk | 12/25 | Doc-only; reversible; prompt-equality is the main correctness concern |
| Research | 12/20 | Heuristic established; per-scenario classification is the runtime question |
| **Total** | **46/70** | **Level 2 with decision-record cross-cutting** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

(none - all clarifications resolved in approved planning document)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md` (the natural-human-vs-RCAF heuristic)
- **Track parent**: `../` (`skilled-agent-orchestration`)
- **Approved plan**: `/Users/michelkerkmeester/.claude/plans/create-new-spec-in-staged-glade.md`
