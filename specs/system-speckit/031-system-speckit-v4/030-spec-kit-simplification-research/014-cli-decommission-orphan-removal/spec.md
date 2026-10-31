---
title: "Feature Specification: CLI decommission orphan removal"
description: "Remove the orphans the memory decommission left in the CLI package that round one certified as wired, correct the four document and fixture lines child 007 left behind, and bring the two test lanes CI never ran back to green and into the workflow."
trigger_phrases:
  - "cli decommission orphan removal"
  - "legacy test lanes in ci"
  - "validation lane repair"
  - "check doc pointers removed"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: CLI decommission orphan removal

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 002-cli-runtime-utilization |
| **Successor** | None |
| **Handoff Criteria** | Every row of lane 002's round-two section in `research/confirmed-findings.md` is fixed, kept with a reason or dropped with evidence, and the CLI's three test lanes pass locally and in CI |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the spec-kit simplification research program: the remediation child for the CLI lane's second round.

**Scope Boundary**: the CLI package under `runtime/cli`, its READMEs and the catalog rows that name its files, the environment-variables reference, the architecture document, three test fixtures, the spec-kit CI workflow, and the lane 002 and lane 005 census documents.

**Dependencies**:
- Lane 002's round-two synthesis and its census section
- Child 007, whose removal this round verified

**Deliverables**:
- Six orphan files gone with their README and catalog rows, and two legacy test blocks that were their only consumers
- The four leftover lines corrected, and the census documents that cited a dead loader or a missing wiring corrected with them
- The legacy module lanes and the bash validation suites green and running in CI
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Round one certified directories as wired without enumerating their files, and the decommission's orphans survived inside them: an unregistered rule script, a re-export shim, a capture-era helper whose named modules no longer exist, a registry loader the engine never calls, a read-tool wrapper nobody imports, a validation helper only a legacy test loads, a root shim whose one caller bypasses it, and a test that no lane runs. Child 007 also left four lines behind: a second environment document still teaching a removed variable, two copies of the looser phase-child regex, three fixtures advertising a removed flag and a tree tag claiming the CLI indexes. Underneath, the CI workflow ran only the vitest project, so the legacy and validation lanes `npm test` also runs had rotted: one still tested a module child 009 removed, one addressed the pre-nesting layout, and the frozen compliant fixture had a stale fingerprint and contradictory expectations across two suites.

### Purpose
The CLI package holds only files something reads or a document names as a tool; every line the decommission left behind says what the code does; and every test lane the package declares runs in CI and passes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The removals, the barrel and README trims, and the two legacy test blocks
- The four leftover corrections and the two census corrections
- The legacy and validation lane repairs and their CI step

### Out of Scope
- The runtime root vitest project, which fails in seven files and is recorded for its own child
- Modules the lane called orphans that relative imports keep alive, and the tools documents name as manual commands: kept, with the reason in the census
- The optimizer directory, kept as child 011 recorded

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/cli/rules/check-doc-pointers.sh`, `utils/phase-classifier.ts`, `utils/validation-utils.ts`, `observability/live-session-wrapper.ts`, `lib/cli-capture-shared.ts`, `lib/validator-registry.ts`, `check-links.sh`, `tests/test-naming-migration.js` | Delete | Orphans |
| `runtime/cli/utils/index.ts` | Modify | Barrel drops the validation helpers |
| `runtime/cli/tests/test-scripts-modules.js` | Modify | Validation-utils and embeddings blocks removed |
| `runtime/cli/tests/test-validation-system.cjs`, `tests/test-validation-extended.sh` | Modify | Nested layout paths; fixture expectations aligned with the base suite |
| `runtime/cli/test-fixtures/053-template-compliant-level2/graph-metadata.json` | Modify | Derived fingerprint re-derived; documents untouched |
| `runtime/cli/test-fixtures/00{2,3,4}-valid-level*/implementation-summary.md` | Modify | Removed-flag sentence dropped |
| `runtime/cli/{README,core/README,utils/README,lib/README,observability/README}.md`, `feature-catalog/tooling-and-scripts/{spec-validation-rule-engine,session-capturing-pipeline-quality}.md`, `.opencode/hooks/post-edit-quality/README.md`, `.opencode/skills/.state/smart-router-telemetry/README.md` | Modify | Rows for removed files; the rule path for the link check |
| `references/config/environment-variables.md`, `references/validation/template-compliance-contract.md`, `runtime/lib/spec/README.md`, `ARCHITECTURE.md`, `runtime/cli/retrieval/lib/frontmatter.mjs` | Modify | The four leftover lines and one comment path |
| `.github/workflows/spec-kit-check.yml` | Modify | Legacy and validation lanes |
| `002-cli-runtime-utilization/research/confirmed-findings.md`, `005-overengineering-simplification/research/confirmed-findings.md` | Modify | Round-two section; the resource-map row superseded; the dead loader citation corrected |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The CLI package builds, its check gate passes, and no removed file is referenced from any code, workflow or document outside changelogs |
| REQ-002 | `npm run test:legacy` and `npm run test:validation` exit zero, and the CI workflow runs both |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The environment-variables reference names no variable without a code reader |
| REQ-004 | Both phase-child regex sites carry the enforced form, the three fixtures no longer name the removed flag, and the architecture tree tag matches the package |
| REQ-005 | The full CLI vitest project reports zero failures |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Rebuild, check gate, dist freshness and the three test lanes all pass locally
- **SC-002**: The next push runs the two lanes in CI
- **SC-003**: The sk-doc validator exits zero on every touched README
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A removal breaks a relative import the census missed | The build fails | The first rebuild caught two such imports; those modules were restored and the census corrected before anything else moved |
| Risk | The frozen fixture's pins break | Suites that copy it fail | Its documents were restored byte for byte after an attempted rewrite; only the derived fingerprint was re-derived with the runtime's own function, and the suites that pin it were rerun |
| Dependency | The legacy lane rebuilds the package | Slower CI | Already built by the preceding step; the rebuild is a no-op |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The two added CI lanes add about two minutes to the spec-kit check
- **NFR-P02**: No runtime path changed

### Security
- **NFR-S01**: No rule became less strict
- **NFR-S02**: The removed root shim exec'd the rule script; the router already calls the rule directly

### Reliability
- **NFR-R01**: The lanes cannot rot unseen again
- **NFR-R02**: Every gate result was read from its output
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: not applicable
- Maximum length: not applicable
- Invalid format: the validation-system test still skips its JSON level case, which reads fields the output no longer carries

### Error Scenarios
- External service failure: not applicable
- Network timeout: not applicable
- Concurrent access: the other session's working-tree edits stayed out of the private index

### State Transitions
- Partial completion: removals, corrections, lane repairs and the workflow ship in one commit
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Eight deletions, about twenty document and test edits, one workflow |
| Risk | 10/25 | Two removals reversed at the first rebuild; a pinned fixture restamped |
| Research | 6/20 | Every row re-checked with relative imports included |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The runtime root project's seven failing files are recorded for the next child.
<!-- /ANCHOR:questions -->
