---
title: "Implementation Plan: Phase 4: doctrine"
description: "Amends the sk-code shared doctrine, the SKILLED house checklist, the quality checklists and three handoff lines in place, then proves each edit with a grep, the strict validator and the drift guards."
trigger_phrases:
  - "phase 4 doctrine plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 4: doctrine

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown doctrine and checklists in the sk-code hub, plus JSON version fields. No code |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `validate.sh --strict`, `validate_document.py`, `run-all-drift-guards.sh` and line-anchored `rg` checks |

### Overview
This phase amends the sk-code doctrine in place. It changes the text of Iron Law 3 and the UNKNOWN rows, adds a universal floor definition, a mechanical floor and a review-severity column to the universal standards, and retitles one checklist as the SKILLED house checklist. Each edit is proven by a grep that names its expected line, then by the strict validator and the four drift guards.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md sections 2 and 3)
- [x] Success criteria measurable (spec.md section 5, with grep forms in acceptance-criteria.md)
- [x] Dependencies identified (spec.md Phase Context: phases 001, 002 and 003)
- [ ] Phases 001, 002 and 003 landed, checked by task T002

### Definition of Done
- [ ] All acceptance criteria met (AC-001 to AC-016 in acceptance-criteria.md)
- [ ] Drift guards pass (`run-all-drift-guards.sh` exits 0, and its last line reads all 4 guards PASSED)
- [ ] Strict packet validation passes, and each changed Markdown file passes `validate_document.py`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation edit in place, in one change set. Each rule has one owner file, and every other file that restates the rule points at that owner.

### Key Components
- **Shared doctrine (`shared/references/`)**: Iron Law 3 in `phase-detection.md`, the UNKNOWN rows in `stack-detection.md` and the universal standards in `universal/code-quality-standards.md`.
- **Checklists**: the SKILLED house checklist in `sk-code-skilled/assets/checklists/`, and the quality checklists and style guide in `sk-code-quality/`.
- **Handoffs**: the implement, debug and verify workflow references, and the P0 table in `sk-code-quality/SKILL.md`.

### Data Flow
Phase 002 emits the gate values and envelope fields, and phase 003 defines the config name. This phase writes the doctrine that names them. Agents read the doctrine when they choose a surface and when they hand work between phases. The phase writes no data and changes no runtime path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A. This phase amends doctrine, and it fixes no defect. Its consumers are the readers of each changed rule:
- Iron Law 3 is read by `phase-detection.md` itself, by the UNKNOWN rows in `stack-detection.md` and `code-quality-standards.md`, by `workflow-verify.md` at lines 47 and 55, and by the UNKNOWN escalation in `sk-code-quality/SKILL.md`. Task T004 and T017 check the first two. Task T015 amends the escalation line.
- The review-severity column is read by `sk-code-review` only as evidence, and review keeps its own ids. Task T021 covers that reader.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup is T001 and T002. Implementation is T003 to T020. Verification is T021 to T028.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None. The phase adds no code | None |
| Integration | The grep set in acceptance-criteria.md, `validate.sh --strict --no-recursive`, `validate_document.py` on each changed Markdown file, and `run-all-drift-guards.sh` | `rg`, `bash`, `python3` |
| Manual | `sk-code-review` reads each row of the review-severity column (T021). The operator reads ADR-001 and ADR-002 at program end | `sk-code-review`, reading |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 spec-root rows in `universal-checklist.md` | Internal, earlier phase | Yellow. Not landed | The retitle edits lines that phase 001 also edits. Rebase and rerun T001 |
| Phase 002 runner, gate values and envelope fields | Internal, earlier phase | Yellow. Not landed | Handoff and verify lines name fields that do not exist yet. Blocks T016 and T017 |
| Phase 003 config name and init route | Internal, earlier phase | Yellow. Not landed | Iron Law 3 names a file that does not exist yet. Blocks T003 |
| `sk-code-review` confirmation of the review-severity column | External reviewer | Yellow. Pending | The column stays unconfirmed. T021 stays open |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A grep in acceptance-criteria.md fails after landing, `sk-code-review` rejects a row that cannot be fixed, or a drift guard fails on the landed change.
- **Procedure**: Revert the single landing commit with `git revert <landing sha>`. Do not rewrite history. Then rerun AC-001 and AC-002. Both must print no line, which shows the amended text is gone.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
001-honest-checker ──► 002-builtin-runner ──► 003-config-and-doctor ──► 004-doctrine ──► 005-consumers-and-routing ──► 006-measurement
```

Design section 7 runs the build order from 1 to 6, and each phase ships alone. This phase therefore depends on the three phases before it.

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 001-honest-checker | None | 002-builtin-runner |
| 002-builtin-runner | 001-honest-checker | 003-config-and-doctor, 004-doctrine |
| 003-config-and-doctor | 002-builtin-runner | 004-doctrine |
| **004-doctrine (this phase)** | **001, 002, 003** | **005-consumers-and-routing** |
| 005-consumers-and-routing | 004-doctrine | 006-measurement |
| 006-measurement | 005-consumers-and-routing | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and recheck (T001 to T002) | Low | About 30 minutes |
| Doctrine text: Iron Law 3, UNKNOWN rows, floors and crosswalk (T003 to T009) | Medium | About 2 hours |
| Checklists, handoffs and gate values (T010 to T017) | Low | About 1 hour |
| Versions, changelogs and review confirmation (T018 to T028) | Low | About 1 hour |
| **Total** | | **About 4.5 hours. Assumes `sk-code-review` answers in one round** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

This packet ships Markdown and JSON metadata only, so no service deploys from it.

### Pre-deployment Checklist
- Not applicable. The phase changes no data.
- Not applicable. No feature flag controls doctrine text.
- Not applicable. No runtime alert watches these files.

### Rollback Procedure
1. Immediate action: stop any further landing of this phase. The doctrine loads when an agent reads it, so revert before the next session that reads these files.
2. Revert code: `git revert <landing sha>` for the one landing commit. Do not rewrite history.
3. Verify rollback: rerun AC-001 and AC-002. Both must print no line.
4. Notify stakeholders: not user-facing. Tell the phase 005 owner if that phase has started.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

