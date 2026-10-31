---
title: "Implementation Plan: Phase 6: skill-package-doc-findings"
description: "DeepSeek V4.1 Flash builders make the three wording changes, one brief each. The orchestrator checks each diff, fixes what a builder missed, reruns the package and human-voice checks, then bumps the six units."
trigger_phrases:
  - "skill package doc findings plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: skill-package-doc-findings

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown frontmatter and prose |
| **Framework** | sk-doc skill packages |
| **Storage** | None |
| **Testing** | `package_skill.py --check --strict`, `hvr_scan.py`, `validate_document.py` |

### Overview
DeepSeek V4.1 Flash builders make the three wording changes, one brief each. The orchestrator checks each diff, fixes what a builder missed, reruns the package and human-voice checks, then bumps the six units.
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
Other: documentation remediation through a deterministic script and a DeepSeek V4.1 Flash builder.

### Key Components
- **Builder**: DeepSeek V4.1 Flash at max effort through cli-pi, one change per brief.
- **Verifier**: the orchestrator reruns every check the builder reports.

### Data Flow
Baseline, then a builder writes and runs the script once, then the orchestrator verifies, bumps versions and regenerates derived artifacts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Skill descriptions | Routing and listing text | Update | Each at or under 130 characters |
| sk-vision SKILL.md | Mode contract | Update | Required sections present, plugin path resolves |

Required inventories:
- Same-class producers: the descriptions are hand-written frontmatter; no generator emits them.
- Consumers of changed symbols: the advisor reads descriptions for routing, so the routing nouns stay.
- Matrix axes: four description edits, one structural edit, one prose edit.
- Algorithm invariant: no edit changes a skill's behavior or routing nouns.
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
| Unit | Script syntax | `python3 -I -m py_compile` |
| Integration | Changed files | `package_skill.py --check --strict`, `hvr_scan.py`, `validate_document.py` |
| Manual | Diff review | `git diff --numstat` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-pi DeepSeek V4.1 Flash route | Internal | Green | The cline route or a DevPass reset wait |
| Hermes, manifest and trigger index generators | Internal | Green | Derived artifacts would drift |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a validator result regresses.
- **Procedure**: `git revert` the phase commit, then rerun the Hermes and trigger index generators.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baseline) ──► Core (builder run, bumps) ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Low | 30 minutes |
| Verification | Low | 20 minutes |
| **Total** | | **About 1 hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): not applicable, tracked files only
- [x] Feature flag configured: not applicable
- [x] Monitoring alerts set: not applicable

### Rollback Procedure
1. `git revert <phase commit>` in the worktree.
2. Rerun `sync-skills-hermes.cjs` and `generate-trigger-index.mjs`.
3. Rerun the phase's validators.
4. No stakeholder notice needed; nothing is published.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
