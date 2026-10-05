---
title: "Implementation Plan: Phase 53: retire-unproven-features"
description: "Four parallel sweeps remove the three retired features: system-spec-kit, sk-doc, cli-classifier and the packet changelogs. Generated mirrors and indexes are then regenerated and every suite reruns."
trigger_phrases:
  - "retire unproven features plan"
  - "jev feature removal sweep"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 53: retire-unproven-features

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM, CommonJS, TypeScript and Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` and vitest |

### Overview
Each sweep deletes one skill's files for the retired features and edits every reference in that skill. A fourth sweep withdraws the packet changelog entries. Then the Hermes copies, the trigger index and the README baselines are regenerated, and a repository grep outside `specs/` must come back clean.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Removal.

### Key Components
- **Three scorers**: the only consumers of the keep-rule gates, deleted with them.
- **Docs**: catalog entries, playbook scenarios, READMEs, skill files and changelogs.

### Data Flow
No live path reads these scorers, so nothing downstream changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `scorer-report.mjs` keep-rule gates | Used only by the three scorers | Delete | `rg` for each export outside `specs/` |
| `score-injection-screen.mjs` | Uses the older kit helpers | Unchanged | Its import line names no gate |

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
| Unit | Every kept suite | `node --test`, vitest |
| Grep | Retired names outside `specs/` | `git grep` |
| Docs | Every edited Markdown file | `validate_document.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 52 commits | Internal | Green | None, this phase removes what they added |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The operator wants a retired feature back.
- **Procedure**: Revert this phase's commits. Every deleted file returns from git history.
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
| Setup | Low | 15 minutes |
| Core Implementation | Low | 1 hour |
| Verification | Low | 30 minutes |
| **Total** | | **2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes
- [x] No feature flag: nothing is served
- [x] No monitoring needed

### Rollback Procedure
1. Revert the phase commits.
2. Rerun the suites to confirm the old counts.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

