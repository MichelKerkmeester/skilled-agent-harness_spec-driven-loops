---
title: "Implementation Plan: sk-create-diagram adherence audit and artifact completion"
description: "Dispatch Deepseek v4 Flash via cli-opencode for the audit-and-fix pass and the two new packages; orchestrator plans, dispatches, and independently verifies."
trigger_phrases:
  - "diagram adherence audit plan"
importance_tier: "important"
contextType: "planning"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/007-adherence-audit-and-artifact-completion"
    last_updated_at: "2026-08-12T18:40:07.000Z"
    last_updated_by: "claude"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch task 1: template + code standards audit"
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
# Implementation Plan: sk-create-diagram adherence audit and artifact completion

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (SKILL.md, references, playbook/catalog), Python (2 extraction scripts), JSON/YAML (hub registry, command assets) |
| **Framework** | `sk-create-skill` templates, `sk-code-opencode` language standards, `sk-create-manual-testing-playbook` + `sk-create-feature-catalog` package contracts |
| **Storage** | `sk-create-diagram` packet files; two new packet-local subdirectories |
| **Testing** | `validate_document.py`, `validate-playbook-package.cjs`, `validate_catalog_package.py` (where reachable), packet-wide `validate.sh --recursive --strict` |

### Overview

Three dispatched passes to Deepseek v4 Flash via `cli-opencode` (`opencode-go/deepseek-v4-flash`), each independently verified by the orchestrator before the next starts — same pattern as phases 002-004. Final validation pass is orchestrator-run directly, matching phase 006's verifier-role precedent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 006 closed packet 028 with all prior gates clean.
- [x] All four standards documents read in full (skill-md/reference/asset templates, sk-code-opencode SKILL.md, sk-create-manual-testing-playbook SKILL.md, sk-create-feature-catalog SKILL.md).
- [x] `decision-record.md` resolves asset-template applicability, package placement, and taxonomy ahead of dispatch.

### Definition of Done

- [x] Template/code audit dispatched, findings fixed, orchestrator-verified.
- [x] `manual-testing-playbook/` authored and passes `validate-playbook-package.cjs`.
- [x] `feature-catalog/` authored and passes `validate_document.py` on root + leaves.
- [x] `validate.sh --recursive --strict` clean for packet 028's parent and all 7 children.
- [x] `implementation-summary.md` and `checklist.md` written with real evidence.
- [x] Residue sweep clean.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Sequential dispatch-verify-fix loop: launch one `opencode run` dispatch, wait for completion, independently verify the claimed output against the real files, fix any gap the dispatch missed, then launch the next dispatch. Never trust a dispatched agent's self-report without checking file contents and running the relevant validator.

### Key Components

- **Dispatch 1 — Audit + fix**: SKILL.md, 37 references, 2 Python scripts, config/YAML surfaces vs. the four standards documents.
- **Dispatch 2 — Playbook authoring**: `manual-testing-playbook/` per the decided taxonomy.
- **Dispatch 3 — Catalog authoring**: `feature-catalog/` per the decided taxonomy, cross-referenced to the playbook.
- **Orchestrator verification pass**: final validation chain + residue sweep.

### Data Flow

Decided taxonomy (decision-record.md) → dispatch 1 (audit + fix existing content) → orchestrator verify → dispatch 2 (author playbook) → orchestrator verify → dispatch 3 (author catalog, cross-referencing playbook) → orchestrator verify → full validate.sh --recursive --strict → residue sweep → closeout docs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-create-diagram/SKILL.md` | Shipped skill contract | Fix any template-adherence finding | Re-diff against skill-md-template.md section list |
| `sk-create-diagram/references/*.md` | Shipped reference set | Fix any frontmatter/structure finding | Scripted frontmatter-field check + spot-check |
| `sk-create-diagram/scripts/*.py` | Shipped extraction scripts | Fix any code-standards finding | `python-checklist.md` walkthrough |
| `sk-create-diagram/manual-testing-playbook/` | Does not exist | Create | `validate-playbook-package.cjs` |
| `sk-create-diagram/feature-catalog/` | Does not exist | Create | `validate_document.py` (root + leaves) |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read all four standards documents in full.
- [x] Decide and record asset-template applicability, package placement, and taxonomy.

### Phase 2: Implementation

- [x] Dispatch 1: template + code standards audit and fix.
- [x] Dispatch 2: author `manual-testing-playbook/`.
- [x] Dispatch 3: author `feature-catalog/` (orchestrator completed the 1 file the dispatch left unfinished).

### Phase 3: Verification

- [x] Run packet-wide `validate.sh --recursive --strict`.
- [x] Residue sweep.
- [x] Write `implementation-summary.md` and `checklist.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Template structure | SKILL.md + 37 references | Manual diff against templates + scripted frontmatter check |
| Code standards | 2 Python scripts | `python-checklist.md` + style-guide walkthrough |
| Package contract | `manual-testing-playbook/` | `validate-playbook-package.cjs` |
| Package contract | `feature-catalog/` | `validate_document.py` (root + per-feature leaves) |
| Spec-folder | Whole packet 028 | `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 006 clean baseline | Internal | Satisfied | Nothing stable to audit against |
| `system-spec-kit/mcp-server` node_modules stability | External/environment | Fragile, fixed on demand | Metadata generation falls back to `compute-metadata.mjs` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A dispatched fix touches a file outside this phase's declared scope, or a validator regression appears against the phase 006 baseline.
- **Procedure**: `git diff` the dispatch's changes against the declared file scope in `spec.md`; `git checkout --` anything outside scope; rerun the validator that regressed before proceeding to the next dispatch.
<!-- /ANCHOR:rollback -->
