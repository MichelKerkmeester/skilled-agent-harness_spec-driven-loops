---
title: "Feature Specification: Extract md-generator and styles to a standalone skill root"
description: "Phase 002 moves sk-design-md-generator (120 tracked) and styles (7,812 tracked) out of the doomed hub into a new top-level skill root via directory git mv, preserving build artifacts and the style corpus, leaving a transiently unwired tree that phase 003 repairs."
trigger_phrases:
  - "extract md-generator standalone"
  - "git mv sk-design-md-generator"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/002-extract-md-generator-and-styles"
    last_updated_at: "2026-08-19T05:04:07Z"
    last_updated_by: "spec-author"
    recent_action: "Authored extraction child spec after 001 inventory landed"
    next_safe_action: "Execute the two directory git mv operations, then verify tree integrity"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/sk-design-md-generator/"
      - ".opencode/skills/sk-design/styles/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: Extract md-generator and styles to a standalone skill root

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Structure** | Phase child of `016-deprecate-sk-design-interface` |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/016-deprecate-sk-design-interface` |
| **Parent Spec** | ../spec.md |
| **Mutation Class** | mutates (directory `git mv`; no content edits) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The surviving DESIGN.md extraction engine (`sk-design-md-generator`) and its `styles/` corpus live inside the `sk-design` hub that is being deleted. They must first be relocated to a standalone top-level skill root so the hub can be removed without taking them down.

**Purpose:** relocate both subtrees to `.opencode/skills/sk-design-md-generator/` (styles nested under it) with a directory-level `git mv` that preserves tracked history, the 135M style corpus, and the build artifacts (`backend/node_modules`, `backend/dist`). This phase performs the move only; the resulting tree is transiently unwired (md-generator's 4 `../shared/*` links and 1 `styles` test path break) and is repaired in phase 003.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- `git mv .opencode/skills/sk-design/sk-design-md-generator .opencode/skills/sk-design-md-generator`
- `git mv .opencode/skills/sk-design/styles .opencode/skills/sk-design-md-generator/styles`
- Verifying the tracked renames staged cleanly (120 + 7,812), the on-disk trees are intact (incl. gitignored `node_modules`/`dist`/`database`), and nothing outside the two subtrees changed.

**Out of scope**

- Any content edit, path rewire, or metadata creation (phase 003).
- Deleting the hub or anything else (phase 005).
- `npm install` / rebuild (only if the directory move fails to carry `node_modules`; verified, not assumed).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001** — After the move, `.opencode/skills/sk-design-md-generator/SKILL.md` and `.opencode/skills/sk-design-md-generator/styles/lib/paths.mjs` exist; the old paths under `sk-design/` do not.
- **REQ-002** — `git status` shows 120 + 7,812 staged renames (`R`) and no deletions/additions of tracked content (a pure rename).
- **REQ-003** — The gitignored build/runtime dirs (`backend/node_modules`, `backend/dist`, `styles/database`) travel with the move (present at the new path).
- **REQ-004** — No file outside the two moved subtrees (and this packet) is modified.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Both subtrees are reachable at `.opencode/skills/sk-design-md-generator/**` (styles at `.../sk-design-md-generator/styles/**`).
- `git status --porcelain` shows only renames within the two subtrees; tracked file count is conserved (120 + 7,812).
- Build artifacts and the style corpus are intact on disk at the new location.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Risk: `git mv` drops gitignored contents** — a directory `git mv` performs a filesystem rename that carries untracked/ignored files, but this is verified post-move (REQ-003), not assumed. If `node_modules` did not travel, phase 003 reinstalls it.
- **Risk: transiently broken tree** — expected and documented; md-generator's `../shared/*` links and the styles test path are dangling until phase 003. No deletion happens until 005, so the break is recoverable.
- **Dependency:** 001 dependency-map (identifies the exact subtrees and the 5 outward refs). Fully reversible (uncommitted; reverse the `git mv`).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. The nesting choice (styles as a subdir of the new skill root) is fixed by the dependency-map and the goal.
<!-- /ANCHOR:questions -->
