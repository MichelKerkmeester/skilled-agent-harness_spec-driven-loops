---
title: "Implementation Plan: Phase 6: docs-and-release"
description: "Two sk-doc dispatches and one conductor edit: the README, changelog and version through create-readme and create-changelog, the delegation-rule paragraph and AGENTS.md row through create-repo-rule revise, and the advisor vocabulary with regenerated manifests through the skill-root metadata gate."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: docs-and-release

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON metadata |
| **Framework** | sk-doc create-readme, create-changelog, create-repo-rule; ci-skill-root-metadata.cjs |
| **Storage** | None |
| **Testing** | validate_document.py, package_skill.py --check, ci-skill-root-metadata.cjs, recursive validate.sh |

### Overview
The release documents and the rule edits go through the sk-doc modes that own them, one child each. The vocabulary edit and manifest regeneration are small enough that the conductor makes them directly and lets the metadata gate rewrite the derived files. The phase runs last and ends with the parent's recursive validation.
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
Documentation and metadata only

### Key Components
- **README and changelog**: what shipped, in the reader's terms
- **Advisor vocabulary and manifests**: how a prompt reaches sk-git
- **Delegation rule and AGENTS.md row**: the freeze posture and the ownership line ADR-005 decided

### Data Flow
A reader starts at the README or the changelog; the advisor starts at graph-metadata.json; a dispatching session starts at the delegation rule.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| README.md, changelog, SKILL.md version | release surface | update | validate_document.py |
| graph-metadata.json | advisor identity | update | metadata gate |
| leaf-manifest.json, leaf-aliases.json | derived | regenerated | metadata gate fixed 1 |
| delegation-and-orchestration.md, AGENTS.md | posture and ownership | update | validate_document.py, diff |

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
| Unit | none | - |
| Integration | package and metadata gates | package_skill.py, ci-skill-root-metadata.cjs |
| Manual | advisor routing of a commit-id prompt | after the merge, the daemon indexes the main checkout |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| phases 003 to 007 landed | Internal | Green | README would list scripts that change |
| advisor daemon on the main checkout | Internal | Yellow | routing check waits for the merge |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a validator regression after merge
- **Procedure**: revert the three phase commits
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
| Core Implementation | Low | two dispatches and one edit, about 40 minutes |
| Verification | Low | 10 minutes |
| **Total** | | **about one hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Not applicable
- [x] Not applicable
- [x] Not applicable

### Rollback Procedure
1. Revert the phase commits
2. Regenerate the manifests
3. Rerun the three validators
4. Not user-facing

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| README and changelog | phases 003 to 007 | three files | closeout |
| Vocabulary | README | metadata and manifests | closeout |
| Rule edits | ADR-005 | two files | closeout |
| Closeout | all | parent validates recursively | window |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **README dispatch** - 15 minutes - CRITICAL
2. **Rule dispatch** - 15 minutes - CRITICAL
3. **Closeout and recursive validate** - 15 minutes - CRITICAL

**Total Critical Path**: about 45 minutes

**Parallel Opportunities**:
- The vocabulary edit ran beside the rule dispatch
- The dispatches ran one at a time
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Release docs | VALID x3, package PASS, `dcdf2f8441` | 2026-09-11, done |
| M2 | Vocabulary and manifests | gate checked 13 passed 13 fixed 1, `8d5acf93d5` | 2026-09-11, done |
| M3 | Rule edits and closeout | validator green, parent recursive PASSED | 2026-09-11 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: The advisor routing check waits for the merge

**Status**: Accepted

**Context**: The advisor CLI is not built in this worktree and the daemon indexes the main checkout, so a probe here cannot see the vocabulary change.

**Decision**: Record the routing check as a post-merge verification, with the exact prompt to run, and keep the metadata gate as this phase's proof.

**Consequences**:
- The phase closes on the gate and the package check
- One check is deferred and named, not skipped silently

**Alternatives Rejected**:
- Build the advisor in the worktree: a second toolchain install for one probe

---

