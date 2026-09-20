---
title: "Implementation Plan: Inventory and skill-contract mapping"
description: "Read the forked source, size and classify every file, and decide the trim manifest, target tree, name/boundary, and command surface."
trigger_phrases:
  - "diagram inventory plan"
  - "diagram trim manifest plan"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/001-inventory-and-skill-contract"
    last_updated_at: "2026-08-12T05:53:36.000Z"
    last_updated_by: "claude"
    recent_action: "Completed inventory and recorded decisions"
    next_safe_action: "Start phase 002 executor dispatch"
    blockers: []
    key_files:
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Inventory and skill-contract mapping

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown analysis output; no runtime code in this phase |
| **Framework** | `sk-create-skill` authoring contract |
| **Storage** | Spec-folder documents only |
| **Testing** | None — this phase produces decisions, not executable artifacts |

### Overview

Read every source file's size and dependency footprint, then decide what ports, what gets restructured, and what is dropped, against the `sk-create-skill` required shape and the existing `sk-create-flowchart` boundary.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] `context/` is present in the worktree and readable.
- [x] `sk-create-skill/SKILL.md` and `sk-create-flowchart/SKILL.md` are read in full.

### Definition of Done

- [x] `resource-map.md` covers every `references/*.md` and `scripts/*.py` file plus the `assets/` directory as a whole.
- [x] `decision-record.md` states the trim manifest, target tree, name/boundary, and command surface.
- [x] Both carried-over open questions are resolved.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One-shot inventory-and-decide analysis, no iteration loop — the source is small enough (37 reference files, 2 scripts, 100 assets) to size directly rather than dispatch a research loop.

### Key Components

- **Resource map**: mechanical inventory (`wc -l`, import scan) of every source file.
- **Decision record**: the judgment layer — trim manifest, target tree, boundary text, command surface.

### Data Flow

`context/` → line-count + dependency scan → resource-map.md → judgment against `sk-create-skill` contract → decision-record.md → phases 002-005 executor briefs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `context/` | Forked source, read-only | Read and inventory only | N/A — never mutated |
| Phase 002-005 spec docs | Not yet authored | Will cite this phase's decision-record.md | Cross-reference check in phase 006 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Confirm `context/` is present in the worktree.
- [x] Re-read `sk-create-skill/SKILL.md` and `sk-create-flowchart/SKILL.md`.

### Phase 2: Implementation

- [x] Size every `references/*.md` file (`wc -l`) and classify port/restructure/drop.
- [x] Confirm `drawio_extract.py` and `mermaid_extract.py` are stdlib-only.
- [x] Count and size `assets/` and decide the trim ratio.
- [x] Decide skill name, folder, and `sk-create-flowchart` boundary text.
- [x] Decide command surface (`/create:diagram` only).
- [x] Resolve icon-set and onboarding-automation open questions.

### Phase 3: Verification

- [x] Confirm every file in `resource-map.md` has a fate.
- [x] Confirm `decision-record.md`'s target tree matches the required standalone-skill shape from `sk-create-skill/SKILL.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Completeness check | Every source file has a recorded fate | Manual cross-reference, `resource-map.md` vs. `find context/`  |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `context/` fork | Internal | Present | Nothing to port without it |
| `sk-create-skill` contract | Internal | Read | Target tree and frontmatter rules come from here |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A later phase discovers the trim manifest under- or over-scoped a file class.
- **Procedure**: Amend `decision-record.md` in place (it is a living decision record for this packet, not a frozen artifact) and note the amendment date; no rollback of prior phases needed since nothing downstream is built yet at this point.
<!-- /ANCHOR:rollback -->
