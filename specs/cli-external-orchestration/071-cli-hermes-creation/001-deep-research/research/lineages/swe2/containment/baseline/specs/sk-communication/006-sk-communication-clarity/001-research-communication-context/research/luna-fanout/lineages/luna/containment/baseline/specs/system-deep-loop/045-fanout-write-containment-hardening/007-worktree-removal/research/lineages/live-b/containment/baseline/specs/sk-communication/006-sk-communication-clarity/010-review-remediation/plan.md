---
title: "Implementation Plan: Phase 10: review-remediation"
description: "Confirm the three already-fixed review findings and land the three still-open code items: a direct test file and two explanatory comments."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: review-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, `cli-communication-projection` package |
| **Framework** | None: the package's own fidelity validator and contract types |
| **Storage** | Version-controlled source files, no database |
| **Testing** | Vitest, run through the package's `npm run check` gate |

### Overview
Six findings from a five-iteration deep review. Three are already fixed at the source and this phase confirms that with file reads. Three need one small code change each: a direct unit test file against `compareClaimCoverage`, a comment at the no-op guard in `validator.ts`, and a doc comment on `AcceptedProjection` in `projection.ts`. None of the three code changes alters any runtime behavior or accepted fidelity outcome.
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
- [ ] `npm run check` passes in `cli-communication-projection` (typecheck, build, 82 files plus the new one, 455 tests plus the new cases, import check)
- [ ] Comment hygiene holds: no ephemeral finding or packet label lands in either comment
- [ ] `validate.sh` on this folder reports `RESULT: PASSED` under `--strict`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Confirm-then-close. Three items are read against their file and line and marked with evidence. Three items are small additive changes, each scoped to one file.

### Key Components
- **`compareClaimCoverage`** (`src/fidelity/semantics.ts`): the function the new test file exercises directly, with no change to its own code.
- **The no-op guard** (`src/fidelity/validator.ts`, the `if (restored.text !== sourceText)` block): gains one comment explaining why the five `passed()` pushes sit inside it.
- **`AcceptedProjection`** (`src/contracts/projection.ts`): gains a doc comment naming `AcceptedFidelityOutcome` as its producer-side source type.
- **`goal.md`, both closed children's `acceptance-criteria.md`, the manual-testing-playbook, and both leaf manifests**: read-only confirmation, no edit.

### Data Flow
The three code items touch no data flow. `compareClaimCoverage` already receives `sourceText` and `candidateText` from `validator.ts` and returns null or a `SemanticDifference`. The new test calls it the same way, directly, without going through `validateProjectionCandidate`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This plan follows a deep-review CONDITIONAL verdict, so this addendum applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `compareClaimCoverage` (`src/fidelity/semantics.ts`) | Vetoes a projection that drops a source claim | Unchanged | New direct test calls it and reads its return value |
| The no-op guard (`src/fidelity/validator.ts:212-238`) | Skips five `passed()` pushes when the candidate equals the source | Unchanged behavior, one comment added | Read the comment beside the guard. `changeKind` still resolves to `'no-op'` |
| `AcceptedProjection` (`src/contracts/projection.ts:29-33`) | Contract type with no construction call site in `src/` or `test/` | Unchanged fields, one doc comment added | Grep for `AcceptedProjection(` construction call sites. Still none, by design |
| `AcceptedFidelityOutcome` (`src/fidelity/types.ts`) | The runtime outcome type the doc comment names | Not a consumer, read-only reference | Confirm the type exists under that exact name before citing it |
| `test/config/copy-editing-instruction.test.ts` | Already tests the claim-omission veto and the no-op record end-to-end through `validateProjectionCandidate` | Unchanged | Confirm it still runs and passes alongside the new direct test |
| `goal.md`, `006-reply-shape-rules/acceptance-criteria.md`, `008-decision-and-handoff-rules/acceptance-criteria.md`, `manual-testing-playbook.md` | Already carry the fixes for F003, F004, F006 | Confirm only, no edit | Read each file and line the review cited |

Required inventories:
- Same-class producers: `rg -n "AcceptedProjection\(" .opencode/skills/sk-communication/cli-communication-projection/src .opencode/skills/sk-communication/cli-communication-projection/test` - confirms no construction call site exists anywhere, before and after this phase.
- Consumers of changed symbols: `rg -n "compareClaimCoverage" .opencode/skills/sk-communication/cli-communication-projection --glob '*.ts'` - lists `validator.ts` as the only runtime caller and the new test file as the only direct caller.
- Matrix axes: finding by verdict. Two axes, confirmed-fixed and code-item, three findings each.
- Algorithm invariant: not applicable. No path, parser, redaction, or security logic is in scope. The three code items are a test file and two doc comments.
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
| Unit | `compareClaimCoverage`: dropped claim, reworded claim, unrelated sentence drop | Vitest, `test/fidelity/semantics.test.ts` |
| Integration | The package gate from the final state, existing 455 tests plus the new ones | `npm run check` in `cli-communication-projection` |
| Manual | Read both comments beside the code they explain, and read the four confirm-only files against the review's cited lines | Direct file reads |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Review report (`review/program-review/lineages/sonnet5-xhigh/review-report.md`) | Internal | Green | No source for the six findings |
| Implementation summary's Deep Review section (`005-verification-and-rollout/implementation-summary.md`) | Internal | Green | No record of the conductor's adjudication |
| `cli-communication-projection` package gate | Internal | Green | Cannot prove the new test file passes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The new test file fails against the current `compareClaimCoverage`, or a comment is read as changing accepted behavior.
- **Procedure**: The three code items are independent. Revert whichever one fails alone. The three confirm items require no rollback since they change nothing.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Confirm (F003, F004, F006) ──┐
                              ├──► Code items (F005, F001, F002) ──► Verify (gate, freshness, hygiene, strict validate)
Read review + summary ───────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm | Review report, implementation summary | Verify |
| Code items | Review report, implementation summary | Verify |
| Verify | Confirm, Code items | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | About 20 minutes, reading the review and the four confirm-only files |
| Core Implementation | Low | About 40 minutes, one test file and two comments |
| Verification | Low | About 20 minutes, the package gate, the freshness gate, and a hygiene grep |
| **Total** | | **About 80 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Revert the new test file first if it disagrees with `compareClaimCoverage`'s current behavior
2. Revert either comment if it is read as changing the accepted fidelity outcome
3. Re-run `npm run check` in `cli-communication-projection`
4. Record which item was withdrawn and why

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable, these are version-controlled source files
<!-- /ANCHOR:enhanced-rollback -->

---
