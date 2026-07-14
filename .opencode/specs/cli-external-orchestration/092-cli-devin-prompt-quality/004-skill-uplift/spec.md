---
title: "Feature Specification: Skill Uplift — Apply winners to cli-devin"
description: "Read 003 synthesis.md and apply winning prompt patterns to .opencode/skills/cli-devin/ (SKILL.md §2/§4, prompt_templates.md, prompt_quality_card.md, changelog/v1.0.5.0.md). Strict-validate after each authored doc write. Depends on 003 synthesis complete."
trigger_phrases:
  - "113/004 skill uplift"
  - "cli-devin skill update"
  - "swe 1.6 winners application"
  - "cli-devin v1.0.5.0"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/004-skill-uplift"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded skill-uplift spec"
    next_safe_action: "Read 003 synthesis.md; map winners to cli-devin sections"
    blockers:
      - "Depends on 003 synthesis.md ratified by operator"
    key_files:
      - ".opencode/skills/cli-devin/SKILL.md"
      - ".opencode/skills/cli-devin/assets/prompt_templates.md"
      - ".opencode/skills/cli-devin/assets/prompt_quality_card.md"
      - ".opencode/skills/cli-devin/changelog/v1.0.5.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114004"
      session_id: "114-004-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Does any winner require breaking changes (existing dispatches behave differently)?"
      - "Do we need a deprecation note for retired template variants?"
    answered_questions:
      - "cli-devin is .opencode-only; no 4-runtime mirror needed (memory: feedback_new_agent_mirror_all_runtimes applies to agents, not skills)"
      - "Each authored doc write followed by strict-validate per Distributed Governance Rule"
      - "Apply step is gated by operator review of synthesis.md (not auto-apply mid-loop)"
---
# Feature Specification: Skill Uplift — Apply winners to cli-devin

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Read `../003-eval-loop/synthesis.md` and apply the top-ranked variant's patterns to `.opencode/skills/cli-devin/`. Targeted sections: SKILL.md §2 SMART ROUTING (knob tuning), SKILL.md §4 RULES (e.g., revised pre-planning contract, sequential_thinking threshold), `assets/prompt_templates.md` (replace template variants with winners), `assets/prompt_quality_card.md` (refine CLEAR cutoffs if council found better). Add `changelog/v1.0.5.0.md` entry documenting the uplift. Strict-validate after each authored doc write. No 4-runtime mirror — cli-devin is `.opencode`-only.

**Key Decisions**: Which winners apply directly vs require operator sign-off (e.g., changes to mandatory contracts); deprecation note for retired template variants

**Critical Dependencies**: 003-eval-loop `synthesis.md` operator-ratified

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (114 phase parent) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The synthesis.md from 003 lists winning prompt patterns, but they live in eval-loop packet artifacts — invisible to future cli-devin dispatches. Without applying them to the canonical skill, the optimization round has no lasting effect. Memory: `feedback_implementation_summary_placeholders` shows that planning artifacts can decay without continuous reference — this same risk applies to deep-loop outputs unless they land in the skill itself.

### Purpose
Ship the optimization wins as updated cli-devin defaults. Future dispatches use the data-driven prompt patterns automatically.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Modify `.opencode/skills/cli-devin/SKILL.md` § 2 SMART ROUTING (intent weight tuning if synthesis warrants)
- Modify `.opencode/skills/cli-devin/SKILL.md` § 4 RULES (e.g., update #12 SWE-1.6 Prompt-Quality Contract, #14 Sequential_thinking threshold if synthesis changed them)
- Modify `.opencode/skills/cli-devin/assets/prompt_templates.md` (replace template variants with winners; preserve framework labels)
- Modify `.opencode/skills/cli-devin/assets/prompt_quality_card.md` (refine CLEAR 5-check cutoffs IF synthesis found better)
- Create `.opencode/skills/cli-devin/changelog/v1.0.5.0.md` (new entry documenting the uplift)
- Update `.opencode/skills/cli-devin/SKILL.md` version line if convention requires
- Strict-validate after each authored doc write (per Distributed Governance Rule)

### Out of Scope
- 4-runtime mirror (cli-devin is `.opencode`-only; memory feedback_new_agent_mirror_all_runtimes applies to AGENTS, not skills)
- Modifying any other cli-* sibling skill (cli-codex, cli-claude-code, cli-gemini, cli-opencode)
- Changing cli-devin's model preset list (we're not adding/removing models; we're tuning the prompt scaffolding)
- Rewriting the manual_testing_playbook (separate concern; if synthesis surfaces a new failure mode, add a playbook entry as follow-on)
- Modifying agent-config recipes (these are deep-loop-specific; if recipe changes are warranted, do in a follow-on packet)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-devin/SKILL.md` | Modify | §2 + §4 tuning |
| `.opencode/skills/cli-devin/assets/prompt_templates.md` | Modify | Replace variants with winners |
| `.opencode/skills/cli-devin/assets/prompt_quality_card.md` | Modify | CLEAR cutoffs (if changed) |
| `.opencode/skills/cli-devin/changelog/v1.0.5.0.md` | Create | New version entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each authored doc write followed by strict-validate of the relevant skill artifact | After each SKILL.md or asset edit, run skill linter / sk-doc check (whichever applies); exit 0 |
| REQ-002 | Changes cite synthesis.md confidence per modification | Every diff hunk has a comment OR commit-message line referencing `../003-eval-loop/synthesis.md` line range |
| REQ-003 | Changelog v1.0.5.0 entry documents the uplift | `changelog/v1.0.5.0.md` exists with date + summary + before/after table for major changes |
| REQ-004 | No 4-runtime mirror writes | `git status` shows no changes outside `.opencode/skills/cli-devin/` AND `.opencode/specs/...113/004-skill-uplift/` |
| REQ-005 | Breaking changes (if any) explicitly flagged | If any change alters existing dispatch behavior, REQ-005 requires a `BREAKING:` line in v1.0.5.0.md |
| REQ-006 | strict-validate of 004-skill-uplift packet exit 0 | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 004-skill-uplift --strict` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Deprecation note for retired template variants | If a variant is replaced, the old variant gets a comment line indicating it was replaced + the v1.0.5.0 reference |
| REQ-008 | Operator review of diff before commit | Operator reads each modified file and approves before commit lands |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Future cli-devin dispatches automatically use winning patterns (verified by running cli-devin on a fixture from 002 — output should reflect winner patterns)
- **SC-002**: Changelog v1.0.5.0 explains the data-driven rationale clearly enough that future readers know why these patterns won
- **SC-003**: No regression in non-SWE-1.6 model dispatches (deepseek-v4, glm-5.1, kimi-k2.6) since changes scoped to SWE-1.6 prompt scaffolding
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 003 synthesis.md operator-ratified | Hard blocker | Pause until operator signs off on synthesis |
| Risk | Winner pattern requires breaking existing dispatch behavior | M | REQ-005 flags BREAKING; operator decides accept-vs-defer |
| Risk | SKILL.md edits trigger sk-doc validator failures | M | Run sk-doc linter inline; fix before commit |
| Risk | Other cli-* skills inherit cli-devin patterns inadvertently | L | Scope-locked to cli-devin/ tree; verify via git status |
| Risk | Manual playbook tests fail with new defaults | M | Re-run manual_testing_playbook/03--model-presets/swe-1.6 group as post-uplift smoke test |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No regression in cli-devin dispatch latency from prompt-template changes (verify via post-uplift playbook timing)

### Security
- **NFR-S01**: New prompt patterns don't leak repo secrets or paths

### Reliability
- **NFR-R01**: Each authored doc write reversible via git revert if regression discovered

---

## 8. EDGE CASES

### Data Boundaries
- Synthesis recommends a pattern that conflicts with existing mandatory contract: escalate to operator; do NOT silent-override
- Synthesis recommends NO change: skip uplift; document in v1.0.5.0.md as "verified existing patterns are still optimal"

### Error Scenarios
- sk-doc linter fails on SKILL.md edit: roll back the specific edit, simplify, retry
- Manual playbook regression post-uplift: roll back via git revert; investigate before re-applying

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | 4 file edits + 1 file create; well-bounded |
| Risk | 10/25 | Could break existing dispatches if winners require breaking changes |
| Research | 4/20 | Synthesis.md is the input; no further research |
| Multi-Agent | 0/15 | Single-agent edit work |
| Coordination | 6/15 | Depends on 003 synthesis being final |
| **Total** | **32/100** | **Level 3** (justified by Distributed Governance Rule + skill-modification scope) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Breaking change to mandatory contract surfaces | H | M | REQ-005 BREAKING flag; operator sign-off |
| R-002 | sk-doc validator fails on edit | M | M | Run linter inline; simplify if needed |
| R-003 | Manual playbook regression post-uplift | M | L | Re-run swe-1.6 playbook group as smoke test |
| R-004 | Inadvertent change outside cli-devin/ | L | L | REQ-004 git-status check |

---

## 11. USER STORIES

### US-001: Operator applies winners (Priority: P0)

**As an** operator with 003 synthesis ratified, **I want** to apply winners to cli-devin in one commit, **so that** future dispatches benefit automatically.

**Acceptance Criteria**:
1. Given synthesis.md ratified, When operator reviews this packet's diffs, Then operator approves and commits.
2. Given the commit lands, When a new dispatch runs via cli-devin against SWE 1.6, Then the new prompt scaffolding reflects the winning pattern.

### US-002: Future reader understands the change (Priority: P1)

**As a** developer reading cli-devin/changelog/v1.0.5.0.md, **I want** to know why these specific patterns won, **so that** I trust the changes and can revert if regressions surface.

**Acceptance Criteria**:
1. Given v1.0.5.0.md, When a reader scans it, Then they see (a) what changed, (b) why (data-driven citation to synthesis.md), (c) how to revert if needed.

## 12. OPEN QUESTIONS

- Should we tag the cli-devin release with a git tag (e.g., `cli-devin-v1.0.5.0`)? Convention review needed.
- If synthesis surfaces a new failure mode unhandled in current playbook, do we add a playbook entry inline or defer to a follow-on packet?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent**: `../spec.md`
- **Upstream**: `../003-eval-loop/synthesis.md`
- **Target skill**: `.opencode/skills/cli-devin/`
