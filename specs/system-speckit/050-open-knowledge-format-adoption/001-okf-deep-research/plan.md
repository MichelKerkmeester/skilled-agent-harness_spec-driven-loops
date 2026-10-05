---
title: "Implementation Plan: Phase 1: okf-deep-research"
description: "Run ten deep-research iterations through the deep-research loop on the cli-pi executor, review each return as the orchestrator, and synthesize a ranked adopt, adapt or reject list."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: okf-deep-research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSONL research artifacts; no code |
| **Framework** | `/deep:research:auto` workflow, `cli-pi` executor |
| **Storage** | Files under `research/` |
| **Testing** | `validate.sh --strict`, citation spot checks, state-log reads |

### Overview
The loop dispatches one `deep-research` iteration at a time to `pi` with `opencode-go/deepseek-v4.1-flash` at `--thinking max`. The orchestrating session reads each iteration file after it lands, opens its citations, and re-dispatches an iteration that fails the check. A final synthesis iteration produces `research/research.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Orchestrator and leaf executor: this session conducts, the Pi child researches.

### Key Components
- **Deep-research loop**: owns iteration dispatch, state log, reducer and convergence.
- **Pi child**: one iteration per dispatch, DeepSeek V4.1 Flash at max effort, web access through its shell.
- **Orchestrator review**: citation checks and the accept or re-dispatch decision.

### Data Flow
Seed copies and repository files go in; iteration files, a findings registry and `research.md` come out; the orchestrator verdict is written to `implementation-summary.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Spec-kit code, templates, validators | Governed behavior under study | Unchanged in this phase | `git status` shows no change outside this folder |
| Phase 002 and 003 specs | Consume the verdict | Updated after this phase closes | Handoff criteria in the parent spec |

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
| Structural | Packet docs | `validate.sh --strict` |
| Evidence | Citations in each iteration | Open each cited `file:line` and URL |
| Process | Ten completed iterations | Read `deep-research-state.jsonl` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `pi` with opencode-go | External | Green: smoke dispatch replied PONG at max | Switch to the Cline route at xhigh |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The run writes outside this folder, or findings fail verification twice.
- **Procedure**: Delete `research/` and re-run, or remove the worktree; nothing outside this packet changes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under 1 hour |
| Core Implementation | Med | Ten iterations, unattended |
| Verification | Med | Review of ten iterations plus synthesis |
| **Total** | | **Run length is UNKNOWN until the first iteration reports a duration** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes; all output is new files in this folder
- [x] Worktree isolates the run from the primary checkout
- [ ] Seed copies present in `scratch/seed/`

### Rollback Procedure
1. Stop the loop.
2. Remove `research/` if its contents are untrustworthy.
3. Confirm `git status` shows nothing outside this folder.
4. Tell the operator which iteration failed and why.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

