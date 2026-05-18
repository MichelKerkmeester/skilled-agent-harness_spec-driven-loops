---
title: "Implementation Plan: sk-code compliance and code README coverage audit"
description: "Plan for auditing first-party code folders across 19 skills, creating missing code READMEs, and deferring broad source convention clusters."
trigger_phrases:
  - "026 implementation plan"
  - "sk-code README audit plan"
importance_tier: "high"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/026-sk-code-readme-audit"
    last_updated_at: "2026-05-15T11:40:19Z"
    last_updated_by: "codex"
    recent_action: "Plan updated after audit scaffold"
    next_safe_action: "Complete verification and commit scoped files"
    blockers: []
    key_files:
      - "audit-report.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-code compliance and code README coverage audit

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode skill docs plus TypeScript, JavaScript, Python samples |
| **Framework** | Spec Kit, sk-code, sk-doc |
| **Storage** | None |
| **Testing** | Spec validation, audit rerun, targeted drift checks |

### Overview

The implementation audits direct first-party code-bearing folders in the requested skills, writes missing README.md files using the sk-doc structure, and records sk-code findings. Source convention clusters are deferred when they require broad multi-surface edits or package-boundary review.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gate 3 answered with a new Level 3 packet.
- [x] Required sk-code and sk-doc templates read.
- [x] Existing dirty worktree identified.

### Definition of Done
- [ ] audit-report.md records coverage matrix and findings.
- [ ] README compliance is at least 95%.
- [ ] Spec validation passes in strict mode.
- [ ] Staged diff contains only packet 026 and authored README files.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Audit-and-generate documentation sweep with named source follow-ons.

### Key Components
- **Audit inventory**: Finds first-party code-bearing folders with direct code files.
- **README authoring**: Creates folder-specific README.md files from sk-doc structure.
- **Finding deferral**: Groups sk-code source violations into named follow-on packets.

### Data Flow

Skill folders are scanned, folder rows are classified, missing READMEs are generated, and audit-report.md records before and after metrics.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| 19 requested skill folders | Own code-bearing subdirectories | Audit direct first-party code folders | audit-report.md matrix |
| Missing code READMEs | Documentation gap | Create README.md files | Audit rerun compliance rate |
| Source files with sk-code drift | Existing convention debt | Defer broad clusters | Named follow-on packets |
| Packet 026 docs | Execution record | Create and update Level 3 docs | Spec strict validation |

Required inventories:
- Same-class producers: first-party direct code folders under requested skill roots.
- Consumers of changed symbols: not applicable because no source behavior changes are planned.
- Matrix axes: skill, subdir, README present, README compliant, sk-code sample findings, action.
- Algorithm invariant: excluded folders must be non-first-party, generated, vendored, database/data, scratch, or fixture-bound.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create packet 026 with Level 3 templates.
- [x] Read required sk-code, sk-doc, and prior summary references.
- [x] Define first-party audit scope.

### Phase 2: Core Implementation
- [x] Run inventory across 19 skills.
- [x] Author missing code READMEs.
- [x] Write audit-report.md.
- [x] Adapt packet docs.

### Phase 3: Verification
- [ ] Rerun audit and confirm compliance delta.
- [ ] Run Spec Kit strict validation.
- [ ] Run targeted alignment check for changed scope.
- [ ] Commit and push.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Audit rerun | README coverage and folder count | Node inventory script |
| Spec validation | Packet 026 docs | `validate.sh --strict` |
| Drift check | Changed skill docs and packet docs | `verify_alignment_drift.py` |
| Git hygiene | Staged files only | `git diff --cached --name-only` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-code references | Internal | Green | Cannot classify convention findings. |
| sk-doc README template | Internal | Green | Cannot author aligned READMEs. |
| Spec Kit validator | Internal | Green | Cannot claim completion. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Audit or validation fails in a way that cannot be resolved within dispatch scope.
- **Procedure**: Revert only this packet's created files and authored README files from the scoped commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup -> Audit -> README authoring -> Verification -> Commit and push
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Audit |
| Audit | Setup | README authoring |
| README authoring | Audit | Verification |
| Verification | README authoring | Commit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 20 minutes |
| Core Implementation | High | 60 minutes |
| Verification | Medium | 20 minutes |
| **Total** | | **About 100 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Dirty worktree recorded before edits.
- [x] No branch created.
- [ ] Staged diff checked before commit.

### Rollback Procedure
1. Revert the scoped commit if needed.
2. Verify no unrelated dirty files were staged.
3. Rerun the audit if a README path changed.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
sk-code refs + sk-doc template + prior summaries
        -> audit inventory
        -> README generation
        -> audit report
        -> validation and commit
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Scaffold and read required references** - complete - CRITICAL
2. **Audit first-party code folders** - complete - CRITICAL
3. **Author missing code READMEs** - complete - CRITICAL
4. **Validate packet and staged scope** - in progress - CRITICAL

**Total Critical Path**: Single-session dispatch.

**Parallel Opportunities**:
- Source convention follow-ons can run after this packet lands.
- Existing README refreshes can run independently from source header normalization.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Audit Complete | 19 skills and 192 folders listed | Complete |
| M2 | README Coverage Complete | 97.4% compliant coverage | Complete |
| M3 | Verification Complete | Strict validation and drift checks recorded | Current dispatch |
| M4 | Delivery Complete | Scoped commit pushed to origin/main | Current dispatch |
<!-- /ANCHOR:milestones -->
