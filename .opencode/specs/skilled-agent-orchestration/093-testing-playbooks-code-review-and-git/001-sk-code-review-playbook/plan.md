---
title: "Implementation Plan: 001 - sk-code-review manual testing playbook"
description: "Author manual_testing_playbook for sk-code-review via cli-codex (gpt-5.5 high, normal mode); 17 scenarios across 6 categories; sk-doc + DQI verification."
trigger_phrases:
  - "sk-code-review playbook plan"
  - "093/001 plan"
  - "code review playbook implementation"
importance_tier: "high"
contextType: "skill-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/093-testing-playbooks-code-review-and-git/001-sk-code-review-playbook"
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
# Implementation Plan: 001 - sk-code-review manual testing playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter |
| **Framework** | sk-doc testing-playbook contract (template + validator) |
| **Storage** | `.opencode/skills/sk-code-review/manual_testing_playbook/` |
| **Testing** | `validate_document.py` + manual structural sweep + @review DQI |

### Overview
Use `/create:testing-playbook sk-code-review create :auto` to scaffold the package, then have cli-codex (gpt-5.5 high, normal mode) author the root playbook plus 17 per-feature snippet files following the canonical sk-doc template. Each per-feature file uses the RCAF prompt pattern and includes a 9-column scenario table. Verification dogfoods sk-code-review by dispatching @review on the produced playbook.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001..SC-005)
- [x] Dependencies identified (cli-codex, sk-doc validator, sk-code-review skill content)

### Definition of Done
- [ ] All 17 per-feature files exist with correct structure
- [ ] Root playbook validates via `validate_document.py`
- [ ] `validate.sh --strict` returns exit 0
- [ ] @review DQI pass returns no P0/P1 findings
- [ ] implementation-summary.md filled with evidence anchors
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Doc-as-code with template-driven generation. cli-codex follows canonical sk-doc snippet template per file; root assembles category summaries.

### Key Components
- **Root playbook (`manual_testing_playbook.md`)**: Index, global preconditions, deterministic command notation, integrated review/release-readiness logic, sub-agent orchestration guidance, per-category summaries pointing at per-feature files.
- **Per-feature snippet files**: Self-contained execution contracts. RCAF prompt + 9-column table + source files + metadata.
- **Validation harness**: `validate_document.py` (root) + orchestrator-driven structural sweep (per-feature) + @review DQI pass.

### Data Flow
1. cli-codex reads SKILL.md + 9 reference files + sk-doc templates + reference playbooks.
2. Runs `/create:testing-playbook sk-code-review create :auto` to scaffold structure.
3. Authors per-feature files following snippet template, embedding RCAF prompts.
4. Authors root playbook assembling category summaries.
5. Self-validates and returns.
6. Orchestrator (Claude) verifies, dispatches @review, then runs canonical save.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable - this is a documentation-creation packet, not a fix. No producer/consumer surfaces are modified; only `.opencode/skills/sk-code-review/manual_testing_playbook/**` is created.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| sk-code-review skill content (SKILL.md, references/*, README.md) | producer of review doctrine being tested | unchanged | grep diff: no edits outside `manual_testing_playbook/` |
| @review and @deep-review agents | consumers that already use sk-code-review | unchanged | grep diff: no edits to `.opencode/agents/review.md` or `.opencode/agents/deep-review.md` |
| sk-doc validator | policy enforcer | unchanged | invocation only; no edits |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] cli-codex reads sk-code-review SKILL.md + all 9 reference files
- [ ] cli-codex reads @review and @deep-review agent definitions
- [ ] cli-codex reads sk-doc templates (root + snippet) + creation reference
- [ ] cli-codex reads reference playbooks (sk-prompt root + 1-2 per-feature; cli-claude-code 001-base example)

### Phase 2: Core Implementation
- [ ] Run `/create:testing-playbook sk-code-review create :auto` to scaffold root + 6 categories
- [ ] Author 3 per-feature files in `01--baseline-review-flow/`
- [ ] Author 3 per-feature files in `02--security-and-correctness-minimums/`
- [ ] Author 3 per-feature files in `03--severity-and-evidence-discipline/`
- [ ] Author 3 per-feature files in `04--scope-and-precedence/`
- [ ] Author 3 per-feature files in `05--re-review-and-stale-context/`
- [ ] Author 2-3 per-feature files in `06--cross-cli-orchestration/`
- [ ] Author root `manual_testing_playbook.md` with category summaries + integrated review/release-readiness

### Phase 3: Verification
- [ ] cli-codex self-runs `validate_document.py` and reports
- [ ] Orchestrator runs `validate.sh --strict` on packet
- [ ] Orchestrator runs per-feature structural sweep (frontmatter + 5 H2 + 9-col table)
- [ ] Orchestrator runs forbidden-sidecar sweep
- [ ] Orchestrator dispatches @review for DQI pass
- [ ] Resolve any P0/P1 findings via cli-codex follow-up dispatch
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Per-file structural validity | `validate_document.py`; orchestrator glob+regex sweep |
| Integration | Cross-file consistency (prompt sync, ID counts) | Manual orchestrator audit |
| Manual | Operator readability of scenarios | Spot-check 3-5 random per-feature files |
| Quality | Findings-first DQI on the playbook itself | @review agent dispatch with sk-code-review baseline |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex (gpt-5.5 high, normal mode) | External executor | Green | Halt; would need fallback to Claude implementation |
| `/create:testing-playbook` command | Internal | Green | Halt scaffolding |
| sk-doc validator | Internal | Green | Cannot certify quality without it |
| sk-code-review skill content | Internal reference | Green | Need to read it to author scenarios |
| Reference playbooks (sk-prompt, cli-claude-code) | Internal reference | Green | Shape and prompt-voice fidelity |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: cli-codex output fails validate_document.py and cannot be repaired in ≤2 follow-up dispatches; or @review reports >2 P0 findings without clear remediation path.
- **Procedure**: `git rm -rf .opencode/skills/sk-code-review/manual_testing_playbook/`; revert child 001 spec docs to draft state; document blocker in implementation-summary.md.
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
| Setup | Low | 2-5 minutes (cli-codex context absorption) |
| Core Implementation | Med | 15-25 minutes (cli-codex authoring 18 files) |
| Verification | Low | 3-5 minutes (validators) + 5-8 minutes (@review DQI) |
| **Total** | | **25-43 minutes wall-clock** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No uncommitted changes outside the packet's scope
- [ ] cli-codex dispatch prompt includes pre-approved spec-folder marker
- [ ] Working directory is `main` branch (not a worktree)

### Rollback Procedure
1. If cli-codex partially completed and output is broken: `git restore --staged .opencode/skills/sk-code-review/manual_testing_playbook/` then `rm -rf` the partial output.
2. If cli-codex completed but verification fails: dispatch a follow-up cli-codex run with the specific findings to resolve.
3. If verification still fails after 2 follow-ups: revert the entire playbook directory and document the blocker.

### Data Reversal
- **Has data migrations?** No - documentation-only change.
- **Reversal procedure**: `git rm -rf` and `git commit` to remove the new directory.
<!-- /ANCHOR:enhanced-rollback -->
