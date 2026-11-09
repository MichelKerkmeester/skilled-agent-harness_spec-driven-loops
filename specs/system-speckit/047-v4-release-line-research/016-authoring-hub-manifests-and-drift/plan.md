---
title: "Implementation Plan: Phase 16: authoring-hub-manifests-and-drift"
description: "Stop the packager writing into a repository root, correct the authoring docs and two sk-doc checkers, decide the leaf-manifest finding against its alias design, and rerun the package and sk-doc checks against their baselines."
trigger_phrases:
  - "authoring hub manifests and drift plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 16: authoring-hub-manifests-and-drift

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 packager, Node.js CommonJS checker, Markdown and JSON |
| **Framework** | sk-doc skill packaging and validation, sk-prompt card, create commands |
| **Storage** | None |
| **Testing** | `validate_skill_package.py` on sk-doc, sk-design, sk-prompt; sk-doc script tests; `parent-skill-check.cjs`; root metadata and leaf-manifest freshness; card-sync guard; playbook validator |

### Overview
One P1 code change (the packager's output directory), two P2 checker changes, and doc corrections whose every sentence was checked against the code or registry it describes. Two findings close with a recorded decision instead of an edit.
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
- [x] Every baseline check holds, and sk-design's compiled routing stays ready
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at producer.

### Key Components
- **`package_skill.py`**: validates and packages a skill
- **`check-repo-rules.cjs`**: repo-rule coverage check
- **Release notes, create index, prompt card, playbook**: operator-facing text

### Data Flow
An author runs the packager with `--check` to validate or with an output directory to write a zip; the repo-rule checker scores each router bullet against its rule file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `package_skill.py` CLI and function | packager | update | regression tests |
| Packager usage docs (quick reference, creation workflow, skills README) | operator commands | update | rg |
| `check-repo-rules.cjs` | repo-rule gate | update | its tests and a real-repo run |
| sk-design `hub-router.json` | router policy | unchanged (decision) | compiled routing readiness |
| `leaf-manifest.json`, `leaf-aliases.json` | leaf registry | unchanged (decision) | freshness check |

Required inventories:
- Callers of `package_skill()`: the CLI and `test_create_skill_contract.py`, all passing an output directory.
- CLI callers: `sk-skill-check.cjs`, `validate_skill_package.py`, `sk-skill-convert.cjs`, `create-skill-auto.yaml`; each passes `--check` or `--json`.
- Matrix axes: output directory (none, repo top level, repo subdirectory, non-repo) by mode (package, --check, --json).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: setup records baselines, implementation sends one worker brief per change group, verification reruns the probes and the baseline suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | packager output and frontmatter, coverage units | pytest, `test_check_repo_rules.py` |
| Integration | package checks on three hubs | `validate_skill_package.py` |
| Manual | each doc sentence against its source | read-only review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-pi DeepSeek | External | Green | none |
| cli-codex Luna | External | Red (quota until 2026-11-13) | DeepSeek took every brief |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a baseline-passing test fails after the change.
- **Procedure**: `git revert <phase commit>` in the worktree.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (baselines, negative controls) | None | Implementation |
| Implementation (worker briefs) | Setup | Verification |
| Verification (probes, suites, cross-family review) | Implementation | Close and commit |
<!-- /ANCHOR:phase-deps -->

---
