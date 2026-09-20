---
title: "Implementation Plan: Extract md-generator and styles to a standalone skill root"
description: "Two directory git mv operations, integrity verification, rollback by reverse-move."
trigger_phrases:
  - "extract md-generator plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/002-extract-md-generator-and-styles"
    last_updated_at: "2026-08-19T05:04:07Z"
    last_updated_by: "spec-author"
    recent_action: "Authored extraction plan"
    next_safe_action: "Execute the two git mv operations"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Extract md-generator and styles to a standalone skill root

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Two ordered directory `git mv` operations relocate the surviving skill out of the doomed hub, then a verification pass confirms the move was a clean rename that conserved every tracked file and carried the gitignored build/corpus content. Content stays byte-identical; only paths change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- **Ready:** 001 dependency-map identifies the exact subtrees (120 + 7,812 tracked) and the 5 outward refs 003 will fix.
- **Done:** new paths exist; old paths gone; `git status` shows only renames within the two subtrees; build/corpus dirs present at the new location; nothing else changed.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Aspect | Value |
|--------|-------|
| **Operation** | `git mv` (directory rename: stages tracked renames, filesystem-moves the whole dir incl. ignored) |
| **Target layout** | `.opencode/skills/sk-design-md-generator/` (md-generator at root; `styles/` nested beneath) |
| **Order** | md-generator first (creates the new top-level dir), then styles into it |
| **Preserved** | tracked history, `backend/node_modules` (72M), `backend/dist`, `styles/database`, the 135M corpus |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Move

`git mv .opencode/skills/sk-design/sk-design-md-generator .opencode/skills/sk-design-md-generator`, then `git mv .opencode/skills/sk-design/styles .opencode/skills/sk-design-md-generator/styles`.

### Phase 2: Verify integrity

Confirm new paths exist, old paths gone, staged-rename count = 120 + 7,812, and the ignored build/corpus dirs are present at the new location.

### Phase 3: Scope check

`git status --porcelain` shows only renames within the two subtrees plus this packet's docs; nothing else changed vs the captured baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Structural verification only (no code runs here — that is phase 003's "prove it works"). Checks: `test -e` on sentinel files at the new paths and `test ! -e` at the old; `git status --porcelain | grep -c '^R'`; `find` counts for the ignored dirs; baseline diff for out-of-scope changes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 001 dependency-map (upstream).
- 003 rewire + standalone metadata (downstream — repairs the transiently broken refs).
- No external tools beyond `git`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Fully reversible and uncommitted. Reverse the moves: `git mv .opencode/skills/sk-design-md-generator/styles .opencode/skills/sk-design/styles` then `git mv .opencode/skills/sk-design-md-generator .opencode/skills/sk-design/sk-design-md-generator`. No data loss (no deletion; content byte-identical).
<!-- /ANCHOR:rollback -->
