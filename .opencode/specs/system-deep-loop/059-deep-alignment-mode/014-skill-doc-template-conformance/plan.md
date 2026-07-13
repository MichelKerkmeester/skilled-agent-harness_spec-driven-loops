---
title: "Implementation Plan: deep-alignment skill-doc template conformance"
description: "Conform six deep-alignment doc groups to their sk-doc create-skill templates via parallel fresh sonnet-5 xhigh markdown agents, one per disjoint file group, verified with package_skill.py --check and validate_document.py, preserving all technical content."
trigger_phrases:
  - "deep-alignment doc conformance plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/014-skill-doc-template-conformance"
    last_updated_at: "2026-07-13T13:00:00Z"
    last_updated_by: "claude"
    recent_action: "Executed six-group conformance; verified checkers green"
    next_safe_action: "Operator review, then commit before merge"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "059-014-skill-doc-template-conformance"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions: []
---
# Implementation Plan: deep-alignment skill-doc template conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs + YAML frontmatter |
| **Framework** | sk-doc create-skill / create-feature-catalog / create-benchmark templates |
| **Validators** | `package_skill.py --check` (SKILL.md) + `validate_document.py` (reference/catalog/benchmark docs) |
| **Executor** | Fresh sonnet-5 xhigh markdown agents (one per file group), run as a background workflow |

### Overview
Six disjoint file groups each get a dedicated fresh markdown agent that reads its authoritative template plus a passing sibling exemplar (deep-review), conforms structure/frontmatter/version/voice, preserves all technical substance, and self-validates. The orchestrator then re-runs the checkers across the whole skill and diff-reviews for content preservation before any commit. Work is isolated in a worktree off the current origin/v4.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Authoritative template identified per group
- [x] Passing sibling exemplar identified (deep-review, deep-research)
- [x] Disjoint file groups (no parallel-edit collision)

### Definition of Done
- [x] `package_skill.py --check` on deep-alignment → PASS
- [x] `validate_document.py` clean on every touched doc
- [x] Diff review confirms no technical content lost
- [x] `validate.sh --strict` on this packet exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parallel fan-out: one markdown agent per file group, disjoint scopes, each self-validating; orchestrator verifies the union.

### Key Components
- **SKILL.md agent** — adds SMART ROUTING §2, renumbers, conforms to `skill_md_template.md`.
- **README agent** — `skill_readme_template.md`.
- **references-core agent** — 4 docs → `skill_reference_template.md`.
- **adapters agent** — 9 docs → `skill_reference_template.md`.
- **feature-catalog agent** — `create-feature-catalog` templates.
- **behavior-benchmark agent** — `create-benchmark` templates.

### Data Flow
Template + exemplar + current doc → agent conforms → self-validate → orchestrator union-verify + diff review → commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Isolated worktree off origin/v4; template + exemplar + checker located

### Phase 2: Implementation
- [ ] Six markdown agents conform their groups (background workflow)

### Phase 3: Verification
- [ ] `package_skill.py --check` PASS + `validate_document.py` clean across the skill
- [ ] Content-preservation diff review
- [ ] `validate.sh --strict` on this packet exits 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **SKILL.md**: `package_skill.py --check` must print `Result: PASS`.
- **Reference/catalog/benchmark docs**: `validate_document.py <file>` structural pass per file.
- **Content preservation**: `git diff` review per group — confirm only structure/frontmatter/voice changed, no dropped contracts/schema/scenarios.
- **Packet**: `validate.sh --strict` exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Python validators (`package_skill.py`, `validate_document.py`) run against worktree paths — no node_modules needed.
- Worktree isolated off origin/v4; nothing committed without operator approval.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Isolated worktree; nothing committed. Rollback = discard the worktree edits (`git -C <worktree> checkout -- .`) or remove the worktree. Doc-only pass, no runtime behavior touched.
<!-- /ANCHOR:rollback -->
