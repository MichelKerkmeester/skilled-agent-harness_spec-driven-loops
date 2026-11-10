---
title: "Implementation Plan: Phase 9: existing-issue-fixes"
description: "Fix three existing defects found while planning the removal: the citation pattern stops at a plus sign, the cli-opencode provider doc says the Cline DeepSeek route cannot fan out, and the agent-mirror-sync CI job never builds the parser its checker loads."
trigger_phrases:
  - "existing issue fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: existing-issue-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | ESM, TypeScript tests, Markdown, GitHub Actions YAML |
| **Framework** | sk-doc cite-drift scanner, spec-kit SOURCE_TAGS rule, GitHub Actions |
| **Storage** | None |
| **Testing** | `check-source-tags.vitest.ts`, `test-cite-drift-scan.mjs`, YAML parse |

### Overview
`CITATION_RE` leaves `+` out of both its path class and its lookbehind, so the SOURCE_TAGS rule reads `v3+/x.ts:3` as `/x.ts:3` and warns falsely. Adding `+` to both fixes it, and a new SOURCE_TAGS test pins the case. The provider doc sentence is replaced with one that matches `pinReasoningEffortForModel`. The CI workflow gains the Node setup and shared-package build the other workflows already use. One DeepSeek work unit, run after phase 003 because both touch the CI workflow.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each defect confirmed in the code (`classifier-cite-drift-scan.mjs:23`, `executor-config.ts:321`, `agent-mirror-sync.yml`)
- [x] Brief written (`scratch/brief-wu1.md`)

### Definition of Done
- [ ] Every row of `acceptance-criteria.md` is Met, or names the pull-request run it waits on
- [ ] The diff touches only `scratch/files.txt`
- [ ] `validate.sh --strict` passes on this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the source: the pattern lives in one module that both the scanner and the SOURCE_TAGS helper import.

### Key Components
- **`CITATION_RE`**: shared by `cite-drift-scan.mjs` and `check-source-tags-helper.mjs`.
- **`agent-mirror-sync.yml`**: the only CI caller of the mirror checker.

### Data Flow
SOURCE_TAGS reads research docs, matches citations with `CITATION_RE`, and resolves each path and line in the tree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `CITATION_RE` | Producer of every citation match | Add `+` to path class and lookbehind | New SOURCE_TAGS test, cite-drift tests |
| `cite-drift-scan.mjs`, `check-source-tags-helper.mjs` | Consumers | Unchanged | Same tests |
| `providers-and-models.md:77` | Documents the Cline route | Replace one sentence | Read against `executor-config.ts:321` |
| `agent-mirror-sync.yml` | CI caller of the checker | Add setup and build steps | YAML parse now; real run on the next agent pull request |

Same-class producers: `rg -n "CITATION_RE" .skilled` finds one definition.
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
| Unit | Plus-sign citation | `check-source-tags.vitest.ts` |
| Regression | Existing cite-drift behaviour | `test-cite-drift-scan.mjs` |
| Static | Workflow syntax | YAML parse |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 | Internal | Runs first | Both edit `agent-mirror-sync.yml` |
| A pull request that changes an agent | External | Not in this program | REQ-003 stays inferred until then |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a test regresses past its baseline or the diff leaves `scratch/files.txt`.
- **Procedure**: `git read-tree -u --reset <snapshot>` with the tree `dispatch.sh` recorded.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 003 ──► WU1 three fixes ──► verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| WU1 | Phase 003 | Verify |
| Verify | WU1 | Phase 010 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| WU1 | Low | One DeepSeek turn |
| Verification | Low | Three commands |
| **Total** | | **Under an hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Tree snapshot recorded before WU1

### Rollback Procedure
1. Restore the snapshot tree.
2. Rerun the two test files.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

