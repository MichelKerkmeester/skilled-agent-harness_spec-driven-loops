---
title: "Implementation Plan: Phase 2: baseline-and-decisions"
description: "Freeze the census at one commit from git objects, answer the call-site question, inventory sk-doc frontmatter checks and record D1 to D4, with the D3 threshold written before labeling."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: baseline-and-decisions

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 census scripts over git objects; markdown records |
| **Framework** | None. Two read-only analysis subagents and two labelers |
| **Storage** | `baseline.md`, `decision-record.md` and `scratch/` |
| **Testing** | Rerun each script on the pinned commit and compare SHA-256 |

### Overview
Freeze every number at one commit by reading git objects, answer the document-kind versus session-kind question from the call sites, inventory how sk-doc checks frontmatter, and record decisions D1 to D4. The D3 threshold is written before the enlarged citation sample is labeled by two model families.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [x] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Orchestrator with read-only leaves: this session runs the census and writes the records, and subagents and a Pi child read and label.

### Key Components
- **`scratch/census.py`**: frontmatter value spread and citation classes per doc family, read from git objects at one commit.
- **`scratch/sample_draw.py`**: seeded draw of in-range citations with a markdown target.
- **Labelers**: a Claude subagent and DeepSeek V4.1 Flash through `cli-pi`, blind to each other and to the threshold.

### Data Flow
The commit and the git rename log go in. `census-5285608745.json` and `sample-rows.jsonl` come out, then two label files. `baseline.md` and `decision-record.md` cite them.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| spec-kit and sk-doc product files | Measured, not changed | Unchanged in this phase | `git status --short .skilled/skills` prints nothing |
| Phases 003 to 006 | Consume D1 to D4 | Start only after operator approval | Root goal decision D2 |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Reproducibility | Census and sample draw | Run twice on `5285608745`, compare SHA-256 |
| Evidence | Call-site and addendum claims | Open each cited `file:line` |
| Agreement | Two labelers | Count rows where both verdicts match |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `pi` with opencode-go DeepSeek | External | Green: `command -v pi` resolves | Record the shortfall and default D3 to not building |
| Claude subagent labeler | Internal | Green | Same as above |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A number fails to reproduce, or a decision rests on a claim that does not check out.
- **Procedure**: Mark the number UNKNOWN or the decision Proposed again. Nothing outside this folder changes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Census ──────┐
             ├──► Decision record ──► Labels ──► Operator approval
Call sites ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Census and call sites | Phase 001 | Decision record |
| Decision record (D3 first) | Census | Labels |
| Labels | D3 written | Baseline section 6 |
| Operator approval | All above | Phases 003 to 006 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Rename log 2m15s, census 16s |
| Core Implementation | Med | Two analyses and two labelers in parallel |
| Verification | Low | Hash reruns and citation checks |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes; all output is new files in this folder
- [x] Worktree isolates the run from the primary checkout
- [x] Every number is pinned to commit `5285608745`

### Rollback Procedure
1. Delete the scratch output.
2. Rerun the commands in `baseline.md` section 1.
3. Confirm `git status` shows nothing outside this folder.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
