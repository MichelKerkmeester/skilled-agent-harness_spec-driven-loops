---
title: "Feature Specification: Clear repo-wide documentation debt: broken README references, README template conformance, changelog internal ids and test counts"
description: "Phase parent for the repo-wide README and changelog debt the sk-create-readme audit and the changelog validator report: broken references, template-invalid READMEs and changelog prose that carries internal ids or test counts."
trigger_phrases:
  - "repo doc debt phase parent spec"
  - "readme audit debt"
  - "changelog internal id cleanup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/070-repo-doc-debt"
    last_updated_at: "2026-10-27T08:00:00Z"
    last_updated_by: "lane-e-conductor"
    recent_action: "Closed all three phases with before and after counts"
    next_safe_action: "Operator decides how the 235 generated report READMEs should conform"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py"
      - ".skilled/skills/sk-doc/shared/scripts/validate_document.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "lane-e-repo-doc-debt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Clear repo-wide documentation debt: broken README references, README template conformance, changelog internal ids and test counts

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/231-repo-doc-debt` |
| **Parent Spec** | None |
| **Parent Packet** | sk-doc/070-repo-doc-debt |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child validates strict on its own and records its before and after counts from a rerun of the audit or validator |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The README audit (`audit_readmes.py`) over this worktree reports 753 READMEs, 244 template-invalid, 119 broken references, 19 missing key artifacts and 1 warning. The changelog validator warns on 53 of 864 tracked `*/changelog/v*.md` files for internal ids or test counts in prose. Some of these findings are real drift and some are artifacts of how the checks resolve paths, so the debt has to be sorted before it can be cleared.

### Purpose
Fix every finding that is real drift, keep every fact while doing it, and record each finding left in place with the reason it stays.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Broken README references that point at a moved or removed file
- READMEs that fail the sk-create-readme template validator, and real inventory gaps the audit names
- Changelog prose that names an internal id or carries a test count

### Out of Scope
- Files other lanes own: `sk-code-review`, the review agents, `commands/deep/`, `.pi/extensions/`, `hooks/goal/`, advisor runtime tests
- Generated files whose generator is gone or lossy, and gitignored runtime paths
- Changes to the audit or validator themselves

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| READMEs under `.skilled/skills/` | Modify | 001, 002 | Path fixes and template conformance |
| `*/changelog/v*.md` | Modify | 003 | Reword ids and drop test counts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-broken-references/ | Fix README references whose target moved or was removed | Complete |
| 2 | 002-readme-template-conformance/ | Bring hand-authored READMEs to the template and close real inventory gaps | Complete |
| 3 | 003-changelog-omissions/ | Reword changelog ids into words and drop test counts | Complete |
| 4 | 004-benchmark-report-readmes/ | Give the 235 legacy benchmark-report READMEs an overview section without changing their content | Complete |
| 5 | 005-reference-and-coverage-fixes/ | Fix every real broken reference and close every coverage finding in the hand-authored READMEs | Complete |
| 6 | 006-audit-and-validator-accuracy/ | Fix the README audit and changelog check where they misjudge correct documents | Complete |
| 7 | 007-alignment-fixes/ | Fix the document validator and the README reference and count checkers where they misjudge correct documents, and correct the README references and counts they report as broken | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-broken-references | 002-readme-template-conformance | Every real broken reference fixed or its sentence rewritten | Audit rerun broken-reference count |
| 002-readme-template-conformance | 003-changelog-omissions | Every hand-authored template failure fixed | `validate_document.py` on each changed README |
| 006-audit-and-validator-accuracy | 007-alignment-fixes | The audit's path rules are settled, so the checkers can reuse them | Checker runs before and after over every tracked README |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should the 235 benchmark report READMEs written by the retired skill-benchmark writer be hand-edited, given that the only renderer left in the repo is lossy for them? This needs an operator decision; phase 002 records the evidence.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
