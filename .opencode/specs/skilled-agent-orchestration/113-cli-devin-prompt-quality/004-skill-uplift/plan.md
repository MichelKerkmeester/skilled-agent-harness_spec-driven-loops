---
title: "Implementation Plan: Skill Uplift"
description: "Apply 003 synthesis winners to cli-devin SKILL.md + assets + changelog. Strict-validate after each authored doc write."
trigger_phrases:
  - "113/004 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/113-cli-devin-prompt-quality/004-skill-uplift"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded plan.md"
    next_safe_action: "Verify 003 synthesis.md ratified; map winners to skill sections"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114041"
      session_id: "114-004-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Skill Uplift

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown edits to skill files |
| **Framework** | sk-doc validator + spec-kit strict-validate |
| **Storage** | `.opencode/skills/cli-devin/` (existing skill tree) |
| **Testing** | sk-doc linter + manual_testing_playbook/03--model-presets/swe-1.6 smoke test |

### Overview
Map each winner from synthesis.md to a specific cli-devin file/section. Apply edits one file at a time with strict-validate per write. Add v1.0.5.0 changelog. Smoke-test via existing playbook entries.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 003 synthesis.md operator-ratified
- [ ] No conflicting changes in flight on cli-devin (git status check)
- [ ] sk-doc validator confirmed working

### Definition of Done
- [ ] All P0 requirements (REQ-001..006) satisfied
- [ ] Smoke test (manual_testing_playbook/03--model-presets/swe-1.6) passes
- [ ] Operator approves diff
- [ ] strict-validate exit 0 on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-file authored edit with strict-validate gate. Each edit isolated to its file. Changelog entry consolidates the uplift narrative.

### Key Components
- **Synthesis reader**: extracts winner descriptions + confidence + insights from `../003-eval-loop/synthesis.md`
- **Mapper**: maps each winner to (file, section, edit-type) — manual operator review
- **Editor**: applies edits one at a time
- **Validator**: runs sk-doc + strict-validate after each edit
- **Changelog writer**: authors v1.0.5.0.md with before/after table

### Data Flow
synthesis.md → mapper (manual) → editor (applies edit) → validator (gate) → next file → ... → changelog v1.0.5.0 → commit
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase actually modifies code/docs outside the packet — the FIX ADDENDUM applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/cli-devin/SKILL.md` | Skill body w/ contracts | Update §2/§4 per winners | strict-validate skill; grep for unintended other-section changes |
| `.opencode/skills/cli-devin/assets/prompt_templates.md` | 7 dispatch templates | Replace specific variants | Diff per-template review |
| `.opencode/skills/cli-devin/assets/prompt_quality_card.md` | CLEAR cutoffs | Refine IF synthesis warrants | Diff review against synthesis recommendations |
| `.opencode/skills/cli-devin/changelog/v1.0.5.0.md` | New version entry | Create | Reads cleanly; cites synthesis.md |

Required inventories:
- Same-class producers: `rg -n 'SWE.?1\.6|swe-1\.6' .opencode/skills/cli-devin/` to find all SWE 1.6 references; ensure every applicable one is updated consistently
- Consumers of changed symbols: `rg -n 'SWE.?1\.6|swe-1\.6' .opencode/` to find external references to cli-devin's SWE 1.6 contract; flag any cross-skill dependency
- Matrix axes: list every winner from synthesis.md before implementation; one row per (winner, target-file, target-section)
- Algorithm invariant: existing non-SWE-1.6 dispatches must remain unaffected (verify by re-running deepseek-v4 / glm-5.1 / kimi-k2.6 playbook entries post-uplift if any)
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Verify 003 synthesis.md operator-ratified
- [ ] Read `../003-eval-loop/synthesis.md`; extract winner list with confidence + insights
- [ ] Build winner→target mapping table: per-winner (target-file, target-section, edit-type, rationale)
- [ ] Operator review of mapping table; approve before edits begin

### Phase 2: Implementation (per-file, strict-validate-gated)
- [ ] Edit SKILL.md §2 SMART ROUTING (intent weights) if synthesis warrants
- [ ] sk-doc validate SKILL.md → exit 0
- [ ] Edit SKILL.md §4 RULES (#12 SWE-1.6 Prompt-Quality Contract, #14 Sequential_thinking, etc.) per winners
- [ ] sk-doc validate SKILL.md → exit 0
- [ ] Edit `assets/prompt_templates.md` — replace winning template variants; preserve framework labels
- [ ] sk-doc validate → exit 0
- [ ] Edit `assets/prompt_quality_card.md` — refine CLEAR cutoffs IF synthesis warrants
- [ ] sk-doc validate → exit 0
- [ ] Author `changelog/v1.0.5.0.md` — date, summary, before/after table, citation to synthesis.md, BREAKING flags if any
- [ ] Optional: tag release per convention review

### Phase 3: Verification
- [ ] Smoke test: re-run `manual_testing_playbook/03--model-presets/swe-1.6/*.md` entries; expect no regression
- [ ] If non-SWE-1.6 playbook entries exist that touch shared scaffolding, re-run those too (deepseek-v4, glm-5.1, kimi-k2.6 model presets)
- [ ] REQ-001..006 verification per spec
- [ ] strict-validate 004-skill-uplift packet exit 0
- [ ] Operator final approval before commit
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Lint | sk-doc validator per file edit | sk-doc CLI |
| Smoke | Manual playbook swe-1.6 group | manual_testing_playbook/03--model-presets/swe-1.6 |
| Regression | Non-SWE-1.6 playbook groups if shared scaffolding changed | manual_testing_playbook/03--model-presets/{deepseek-v4,glm-5.1,kimi-k2.6} |
| Validate | strict-validate this packet | validate.sh |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 003 synthesis.md ratified | Internal | Pending | Hard blocker |
| sk-doc validator | Internal | Green | Hard blocker for REQ-001 gate |
| Existing cli-devin manual_testing_playbook | Internal | Green | Required for smoke test |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Smoke test regression OR sk-doc validator fails OR operator rejects diff
- **Procedure**: `git revert <uplift-commit-sha>`; document regression in `implementation-summary.md`; iterate on synthesis or escalate to a 005 follow-on packet
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup + Mapping) ──► Phase 2 (Per-file Edits + Validate) ──► Phase 3 (Smoke + Validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 003 synthesis green | Implementation |
| Implementation | Setup + operator-approved mapping | Verification |
| Verification | All edits applied | Commit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (synthesis read + mapping + operator approval) | Med | 1-2 hr |
| Implementation (per-file edits + validate) | Med | 2-3 hr |
| Verification (smoke + regression + final validate) | Med | 1-2 hr |
| **Total** | | **4-7 hr** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All edits captured in single commit (single revert target)
- [ ] Operator approval recorded
- [ ] Smoke test scope identified (which playbook entries to re-run)

### Rollback Procedure
1. `git revert <uplift-commit-sha>`
2. Re-run smoke test to confirm reversion clean
3. Document regression in `implementation-summary.md`
4. Iterate: revise synthesis (loop more) OR open a 005 follow-on packet

### Data Reversal
- **Has data migrations?** No (markdown edits only)
- **Reversal procedure**: git revert
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌──────────────────────┐     ┌────────────────┐
│   Phase 1   │────►│   Phase 2            │────►│   Phase 3      │
│   Setup     │     │   Per-file edits     │     │   Smoke + Vali │
└─────────────┘     │   (sequential        │     └────────────────┘
                    │    with validate     │
                    │    gate per file)    │
                    └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Synthesis read | 003 synthesis.md | Winner list | Mapping |
| Mapping | Winner list | Target table | Operator approval |
| Operator approval | Mapping | Go signal | Edits |
| Per-file edits | Approval | Modified skill files | Smoke test |
| Smoke test | Edits | Pass/fail signal | Commit |
| Changelog | Edits | v1.0.5.0.md | Commit |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **003 synthesis.md ratified** - Upstream - CRITICAL
2. **Mapping table + operator approval** - 1-2 hr - CRITICAL
3. **Per-file edits + sk-doc validate** - 2-3 hr - CRITICAL (sequential)
4. **Smoke test + regression** - 1-2 hr - CRITICAL
5. **Commit + tag** - 15 min - CRITICAL

**Total Critical Path**: 4-7 hr

**Parallel Opportunities**:
- Within Phase 2: sk-doc validate runs after each edit (gated, not parallel)
- Within Phase 3: smoke test groups (swe-1.6 + other models) can run in parallel
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Mapping approved | Operator signs off on winner→target table | Phase 1 end |
| M2 | All edits applied + validated | Every modified file passes sk-doc | Phase 2 end |
| M3 | Smoke test green | swe-1.6 playbook group passes | Phase 3 mid |
| M4 | Commit landed | Single commit on main with v1.0.5.0 changelog | Phase 3 end |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: No 4-runtime mirror for cli-devin skill changes

**Status**: Proposed

**Context**: Memory `feedback_new_agent_mirror_all_runtimes` specifies that new AGENTS must mirror to 4 runtimes (.opencode/.md, .claude/.md, .gemini/.md, .codex/.toml). That rule applies to AGENTS (top-level decision-making entities), not SKILLS (which are tooling extensions loaded by agents on-demand). cli-devin is a skill, not an agent.

**Decision**: All edits stay in `.opencode/skills/cli-devin/`. No mirror writes.

**Consequences**:
- Improves: smaller diff, faster review, no mirror-sync overhead
- Costs: future readers from non-OpenCode runtimes don't see the skill updates. Mitigation: cli-devin already documents "OpenCode-only" in its top-level README (verify before commit).

**Alternatives Rejected**:
- Mirror to .claude/.codex/.gemini: memory rule doesn't apply to skills; would create stale mirrors that drift
- Author a generic "cli executor optimization" spec applicable to all CLI skills: scope creep; out-of-bounds for this packet

---
