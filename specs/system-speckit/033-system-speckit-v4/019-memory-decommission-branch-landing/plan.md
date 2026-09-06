---
title: "Implementation Plan: memory decommission landing and verification "
description: "Merge v4 into the branch so the release branch fast-forwards, regenerate derived metadata, validate changed documents against their template classes, then run a bounded deep review with gpt-5.6-luna and fix at source until it reports no P0 or P1."
trigger_phrases:
  - "memory decommission landing plan"
  - "branch-side merge fast-forward"
  - "validator-driven alignment sweep"
  - "bounded review loop fanout"
  - "validate_document per class"
  - "cli-codex gpt-5.6 executor"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: memory decommission landing and verification

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | git, the spec-kit scripts, the sk-doc validators |
| **Framework** | system-deep-loop fan-out with the cli-codex executor |
| **Storage** | Lineage-local review state under this packet |
| **Testing** | validate.sh, validate_document.py, residue sweep, trigger-index determinism, doctor routes, skill-root audit |

### Overview
The landing merges from the branch side so the release branch only ever fast-forwards and is never rewritten. Documents changed since the fork point are validated by class and fixed at source. The review loop runs on the landed tree with the executor the operator named, no early convergence, and its findings are fixed, re-verified and the loop rerun.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Branch-side merge, fast-forward landing, validator-driven alignment, bounded review loop.

### Key Components
- **Branch-side merge**: conflicts resolved in the worktree; v4 fast-forwards.
- **Validation sweep**: `validate_document.py` per class over the changed-document list.
- **Review loop**: `fanout-run.cjs --loop-type review` with a cli-codex gpt-5.6-luna executor, ten iterations, stop policy max-iterations.

### Data Flow
The merge diff defines the changed-surface list; the validators and the review loop consume it; findings flow back as commits on the branch, which v4 and main fast-forward to.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Command frontmatter allow lists | Name which tools a command may call | update | grep for the retired prefix returns no live surface; sweep live 0 |
| Runtime MCP configs | Register servers | unchanged from the branch | grep count 0 in five roots |

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
| Unit | Merged launcher bootstrap test, retrieval suites | vitest |
| Integration | Residue sweep, trigger index, validate.sh recursive, doctor routes, skill-root audit | spec-kit scripts |
| Manual | Deep review loop findings triage | review report |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Codex CLI with ChatGPT OAuth | External | Green | No review loop |
| cli-codex skill contract | Internal | Green | Dispatch shape |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the landed tree fails a gate the branch passed.
- **Procedure**: `git update-ref` v4 and main back to `5d222c0032` and `4c1fb6b3d5` respectively; nothing was pushed.
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
| Setup | Med | two merges, 41 conflicts |
| Core Implementation | Med | validation sweep and fixes |
| Verification | High | ten review iterations plus fixes and reruns |
| **Total** | | **one to two sessions** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - rollback refs recorded
- [x] Feature flag configured - not applicable
- [x] Monitoring alerts set - the gates in the testing table

### Rollback Procedure
1. Stop the review loop.
2. Reset the two branch refs to their recorded pre-landing commits.
3. Confirm `git log` on each matches the record.
4. Tell the operator which findings were outstanding.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

