---
title: "Implementation Plan: Phase 40: design-playbook-filename-denumbering"
description: "Split the 5 sk-design sub-skills between GPT 5.5 and GLM 5.2; each renames its numbered playbook files (drop the prefix) and rewrites references; then a link-integrity gate + sk-doc structure check verify."
trigger_phrases:
  - "design playbook denumbering plan"
  - "gpt5.5 glm5.2 rename split"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/040-design-playbook-filename-denumbering"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/040-design-playbook-filename-denumbering"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 40: design-playbook-filename-denumbering

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + git + filesystem rename |
| **Framework** | sk-doc catalog/playbook convention (packet 133) |
| **Storage** | file-based |
| **Testing** | `find` filename sweep + markdown-link guard + sk-doc structure |
| **Executors** | GPT 5.5 high/fast (cli-codex) + GLM 5.2 high (cli-opencode), split by sub-skill |

### Overview
Two CLI executors work disjoint sub-skill sets in parallel. Each renames its numbered per-feature playbook files (`NNN-name.md` → `name.md`, plain `mv` so the sandbox allows it) and rewrites all references within its scope (root `manual_testing_playbook.md`, sibling cross-links, design-md-generator feature_catalog cross-refs). The orchestrator then stages the renames by explicit path, runs the link + filename gates, commits, and closes the phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Rename mapping + reference inventory confirmed (done in scoping)

### Definition of Done
- [x] 0 numbered playbook filenames in sk-design; no dangling references; folders preserved
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Disjoint-parallel rename-and-repair. Each sub-skill is self-contained (its playbook references stay within the sub-skill), so two executors can run without file conflicts.

### Key Components
- **GLM 5.2 (cli-opencode)**: design-interface (17) + design-motion (10) + design-foundations (8).
- **GPT 5.5 (cli-codex)**: design-md-generator (15, incl. feature_catalog cross-refs) + design-audit (11).
- **Orchestrator**: stages renames by explicit path, runs gates, commits.

### Data Flow
1. Each executor: `mv` its numbered files (drop prefix) + rewrite references in scope.
2. Orchestrator `git add` the sk-design playbook/feature_catalog paths (captures renames + edits).
3. Filename sweep + markdown-link guard + sk-doc structure check.
4. Commit + close.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Dispatch (parallel)
- [x] GLM 5.2 high: rename + ref-rewrite design-interface, design-motion, design-foundations
- [x] GPT 5.5 high/fast: rename + ref-rewrite design-md-generator, design-audit

### Phase 2: Stage + gate
- [x] `git add` the sk-design playbook + feature_catalog paths (explicit, not `-A`)
- [x] Filename sweep = 0 numbered playbook files; markdown-link guard passes; folders preserved

### Phase 3: Close
- [x] Commit by explicit path; write implementation-summary.md; reconcile parent map
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Filename sweep | 0 numbered playbook files | `find ... -name '[0-9][0-9]*.md'` |
| Link integrity | No dangling per-feature links | `check-markdown-links.cjs` / grep for `NNN-*.md` |
| Structure | Roots still valid | sk-doc `extract_structure.py` on a sample root |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex (gpt-5.5) | External | Available | No GPT executor |
| cli-opencode (glm-5.2) | External | Available | No GLM executor |
| git | External | Available | Cannot stage renames |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A dangling link or a wrongly-renamed folder.
- **Procedure**: `git checkout` the affected sub-skill playbook tree (renames + edits revert together); re-dispatch that sub-skill. Fully reversible pre-commit.
<!-- /ANCHOR:rollback -->
