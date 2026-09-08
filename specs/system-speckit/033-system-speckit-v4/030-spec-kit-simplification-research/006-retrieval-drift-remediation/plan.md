---
title: "Implementation Plan: Retrieval drift remediation"
description: "Fix the reproduced retrieval findings in one scripted pass over the documents, one code change to the manifest exclusion record with its test, one relocation of the retrofit pipeline, and one regeneration of the committed index."
trigger_phrases:
  - "retrieval remediation plan"
  - "exclusion record parity"
  - "doctor committed pair check"
  - "retrofit relocation plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Retrieval drift remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | ESM JavaScript (`.mjs`), TypeScript tests, Markdown and YAML documents |
| **Framework** | None; plain Node scripts |
| **Storage** | The committed trigger index and its fixture manifest |
| **Testing** | vitest, `--project cli` from `runtime/cli` |

### Overview
Every confirmed finding is either a document that disagrees with the code or a record that disagrees with the policy it describes, so the plan is a literal-replacement script over the documents, one constant change with a test that pins it, a `git mv` with import repointing, and a regeneration so the committed pair agrees again.
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
Surgical edits to existing surfaces; no new module.

### Key Components
- **`lib/corpus.mjs`**: owns both the walker policy and the manifest exclusion record; the change keeps the two in step and the comment says why
- **`retrieval-coverage-parity.vitest.ts`**: the one place the two lanes' exclusion sets are compared; gains the `dist` index-only divergence and the record assertion
- **`doctor-speckit-retrieval.yaml`**: the diagnostic that reads the committed pair; gains the comparison the finding asked for

### Data Flow
The generator folds `EXCLUSIONS` into `manifestHash` and writes the index and manifest together; the doctor reads both files and reports a split pair; the parity suite reads the walker policy and the record and fails on drift.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/corpus.mjs` `EXCLUSIONS` | Manifest identity record | update | parity suite 16 of 16 |
| `generate-trigger-index.mjs` | Folds the record into the hash | unchanged | regeneration reports zero malformed documents |
| `retrofit-convention.mjs` importers | Two tests, three documents | update | `rg 'retrieval/retrofit-convention'` outside specs and changelogs returns nothing |
| Conventions, router, presentation, doctor | Readers of the lookup contract | update | section 2.1 and the router recipe compare equal |
| `AGENTS.md` (`CLAUDE.md` is a symlink to it) | Maintenance row | update | one edit, both names show it |

Required inventories:
- Same-class producers: `rg -n 'EXCLUSIONS|EXCLUDED_DIR_NAMES' runtime/cli` found the generator, the walker and the parity suite.
- Consumers of changed symbols: `rg -n 'retrofit-convention' . --glob '!specs/**' --glob '!**/changelog/**'` found two tests and three documents.
- Matrix axes: lane (index, ripgrep) by exclusion class (shared, index-only, scoped); the parity suite covers every row.
- Algorithm invariant: two generator runs over one tree produce byte-identical output; the README's determinism check remains the proof.
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
| Unit | Seven retrieval suites, including the amended parity suite and the relocated pipeline suite | vitest |
| Integration | `npm run check` in the CLI package, dist freshness, generator run | npm, node |
| Manual | Recipe text compared against section 2.1; residue search for the old path | rg, diff |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Confirmed findings table from 001 | Internal | Green | Nothing to fix without it |
| ripgrep on PATH | External | Green | Sweep and wrapper tests cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a retrieval suite fails after the commit, or a consumer of the old retrofit path appears
- **Procedure**: `git revert` the single commit; the regeneration is reproducible, so no data step exists
<!-- /ANCHOR:rollback -->

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
| Core Implementation | Med | 1 hour |
| Verification | Low | 20 minutes |
| **Total** | | **About 1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not needed; the regeneration is reproducible
- [x] Feature flag configured - none exists for documents
- [x] Monitoring alerts set - the doctor's new signal is the alert

### Rollback Procedure
1. `git revert` the remediation commit
2. Regenerate the index so the committed pair agrees again
3. Rerun the seven retrieval suites
4. No stakeholders to notify; the surfaces are internal

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
