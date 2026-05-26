---
title: "Implementation Plan: Bulk Comment-Anchor Removal"
description: "Plan for removing standalone ANCHOR comments from in-scope skill markdown via the shared transform."
trigger_phrases:
  - "anchor comment removal plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Removed standalone anchor comments from skill markdown"
    next_safe_action: "Proceed to phase 004"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Bulk Comment-Anchor Removal

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 (stdlib only) |
| **Tool** | `strip_toc_anchors.py --anchors` |
| **Carve-outs** | system-spec-kit/templates, sk-doc/scripts/tests |
| **Testing** | residual grep + glued-marker grep + idempotency |

### Overview
The shared transform's `--anchors` mode deletes any whole-line `ANCHOR:...` /
`/ANCHOR:...` comment (fence-agnostic, since removing a self-contained comment line from
an example block is harmless and shows the new pattern). It runs on the same in-scope list as
Phase 002, minus the same carve-outs. A pre-run grep confirmed no script/MCP consumes skill-doc
anchors (the consumers operate on spec/memory artifacts under `.opencode/specs/`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Confirmed no consumer reads skill-doc anchors
- [x] Carve-outs defined

### Definition of Done
- [x] Zero standalone anchor comments in scope
- [x] Carve-out anchors preserved (26 spec-kit template files)
- [x] Idempotent
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Whole-line filter: drop lines matching `^\s*<!--\s*/?ANCHOR:[^>]*-->\s*$`, then normalize blanks.

### Key Components
- `strip_anchors(lines)` — line filter.
- Shared `collapse_blanks` / gated rewrite (no cosmetic-only churn).

### Data Flow
read → strip_anchors → collapse → write iff changed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pre-checks
- [x] Confirm no anchor consumers in sk-doc/create/skill scripts
- [x] Confirm carve-out file set

### Phase 2: Bulk run
- [x] Run `--anchors` on in-scope list (673 changed); idempotent

### Phase 3: Residual
- [x] Grep for glued/inline markers; fix the 1 stray closing marker
- [x] Confirm remaining mentions are documentation of the live spec-kit anchor system
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Residual | Zero standalone anchors | python whole-line scan |
| Glued markers | None inline | `rg '\S<!--.*ANCHOR\|ANCHOR.*-->\S'` |
| Carve-out | Templates intact | `rg -l '<!-- ANCHOR' templates` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Shared transform (002) | Internal | Green | No tool to run |
| python3 | External | Green | Cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A consumed anchor removed, or doc rendering broken.
- **Procedure**: `git checkout -- <files>`; widen carve-out; re-run.
<!-- /ANCHOR:rollback -->
