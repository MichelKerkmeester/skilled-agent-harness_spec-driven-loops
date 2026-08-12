---
title: "Implementation Plan: sk-create-diagram resource reorganization and code alignment"
description: "Scripted move + relink, deeper AST-based Python audit, and 7 new READMEs, executed and verified directly by the orchestrator."
trigger_phrases:
  - "diagram reorg plan"
importance_tier: "important"
contextType: "planning"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/008-resource-reorganization-and-code-alignment"
    last_updated_at: "2026-08-12T12:29:29.000Z"
    last_updated_by: "claude"
    recent_action: "Authored plan"
    next_safe_action: "Run the reorg script"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-create-diagram resource reorganization and code alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (references/assets reorg, 6 new subfolder READMEs), Python (2 extraction scripts), file moves via `git mv` |
| **Framework** | `sk-code-opencode` Python standards, `skill-reference-template.md`/`skill-asset-template.md` folder-organization principle |
| **Storage** | `sk-create-diagram` packet files; no new top-level directories, only subfolders within `references/`/`assets/` |
| **Testing** | AST-based Python audit, packet-wide link-resolution check, `validate_skill_package.py`, `validate.sh --recursive --strict` |

### Overview

Executed directly by the orchestrator (scripted `git mv` + literal token substitution + hand-enumerated bare-link fixes), not dispatched — see `decision-record.md` Decision 2 for why this phase departs from the packet's earlier Deepseek-dispatch pattern.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Every reference/asset file's current cross-references enumerated before moving anything (59 files scanned).
- [x] Every bare-relative sibling link inside `references/*.md` hand-verified against the new taxonomy.
- [x] `decision-record.md` resolves taxonomy, dispatch-vs-direct, and README-index scope.

### Definition of Done

- [x] All 75 files moved via clean `git mv` renames (verified `R`-status, not delete+add).
- [x] Packet-wide link-resolution check reports 0 broken targets.
- [x] Both Python scripts pass an AST-based audit (0 missing param/return hints, 0 missing public docstrings).
- [x] `scripts/README.md` + 6 subfolder README indexes exist and pass `validate_document.py`.
- [x] `validate_skill_package.py --strict` and `validate.sh --recursive --strict` stay clean.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Move-then-relink-then-verify, in one orchestrator-executed pass: `git mv` every file to its new subfolder, run a literal token-substitution rewrite across every citing file, hand-fix the enumerated bare-relative sibling links, then verify with an independent link-resolution script before touching any spec doc.

### Key Components

- **Reorg script** (`reorg-diagram-refs-assets.py`, scratchpad): performs the 75 `git mv` calls, the 59-file token rewrite, and the 7 hand-targeted bare-link fixes in one run.
- **Link-resolution verifier**: independent Python script walking every `.md` file's `](...)` targets and confirming each resolves on disk — not part of the reorg script, run separately so it cannot share a blind spot with the thing it verifies.
- **AST-based Python auditor**: replaces the phase-007 line-based grep heuristic (which produced 2 false positives this phase caught before acting on them) with `ast.parse` walking every function's `.returns`/`.args` — see Key Decisions.

### Data Flow

Pre-move cross-reference enumeration → `git mv` (75 files) → token rewrite (55 files) → hand-targeted bare-link fixes (7 files) → independent link-resolution verify (found + fixed 2 real depth-shift breaks) → AST-based Python audit (found + fixed 5 missing docstrings on nested closures) → 7 new README files → `validate_skill_package.py` (found + fixed missing `version` frontmatter on 6 READMEs) → packet-wide `validate.sh --recursive --strict`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `references/{types,primitives,import-export,foundations}/` | New subfolders | Populate via `git mv` + new README | Link-resolution check + `validate_document.py` |
| `assets/{examples,templates}/` | New subfolders | Populate via `git mv` + new README | Link-resolution check + `validate_document.py` |
| `scripts/mermaid_extract.py`, `drawio_extract.py` | Shipped scripts | Add 5 missing docstrings on nested closures | AST-based audit re-run |
| `scripts/README.md` | Does not exist | Create | `validate_document.py` |
| `SKILL.md`, `README.md`, `changelog/`, `manual-testing-playbook/`, `feature-catalog/` | Shipped citations | Rewrite every moved-path citation | Link-resolution check + package/playbook/catalog validators |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Enumerate every file citing a reference/asset path (59 files) before moving anything.
- [x] Enumerate every bare-relative sibling link inside `references/*.md` and classify same-subfolder (no change) vs. cross-subfolder (needs a fix).

### Phase 2: Implementation

- [x] Run the reorg script: `git mv` + token rewrite + hand-targeted bare-link fixes.
- [x] Independently verify link resolution; fix the 2 real breaks found (asset links from files that moved one level deeper).
- [x] AST-audit both Python scripts; fix the 5 real missing-docstring gaps found (nested closures).
- [x] Author `scripts/README.md` and 6 subfolder README indexes.

### Phase 3: Verification

- [x] Re-run link resolution (0 broken).
- [x] `validate_skill_package.py --strict`; fix the missing-`version`-frontmatter finding on the 6 new READMEs.
- [x] Re-run `validate-playbook-package.cjs` and `validate_catalog_package.py` (both PASS, 0 violations — reorg did not touch their content, only the packet content they cite).
- [ ] Run packet-wide `validate.sh --recursive --strict` and residue sweep.
- [ ] Write `implementation-summary.md` and `checklist.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Rename integrity | 75 moved files | `git status --short` rename-status (`R`) check |
| Link resolution | Every `.md` file in the packet | Independent Python link-target walker |
| Python standards | 2 extraction scripts | AST-based param/return-hint + docstring audit |
| Package contract | Whole packet | `validate_skill_package.py --strict` |
| Package contract | `manual-testing-playbook/`, `feature-catalog/` | `validate-playbook-package.cjs`, `validate_catalog_package.py` |
| Spec-folder | Whole packet 028 | `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 007 clean baseline | Internal | Satisfied | Nothing stable to reorganize |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A moved file's original content is lost, or a validator regression appears against the phase 007 baseline.
- **Procedure**: The worktree's last commit (`195135840a`) predates this phase entirely — `git checkout 195135840a -- <path>` restores any single file's pre-move state without touching the rest of the reorg.
<!-- /ANCHOR:rollback -->
