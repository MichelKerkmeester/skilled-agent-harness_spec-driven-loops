---
title: "Implementation Plan: Phase 2: skill-and-routing-rename"
description: "Move the surface packet, rewrite every identity reference with case-preserving safe patterns, rename the surface id OPENCODE to SKILLED in the hub, then rebuild every generated routing artifact."
trigger_phrases:
  - "skill and routing rename plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: skill-and-routing-rename

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON, CommonJS, TypeScript, shell, Python, Markdown |
| **Framework** | Skilled framework (sk-code hub, system-skill-advisor, system-spec-kit) |
| **Storage** | Git-tracked files; advisor SQLite DB and trigger index rebuilt from them |
| **Testing** | node --test, vitest, python unittest, the hub drift guards and `validate.sh --strict` |

### Overview
One scripted pass moves every tracked path whose segment carries the identity with `git mv`, re-points the changelog symlink, and rewrites text with patterns that require `code` directly before `opencode`. Inside the sk-code hub and the advisor plugin, the surface id OPENCODE becomes SKILLED. Generated artifacts are then rebuilt with their own tools, never hand-edited.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scripted rename, then regenerate derived artifacts

### Key Components
- **Rename script**: segment-level `git mv`, symlink re-point, case-preserving text rules
- **Hub regenerators**: `generate-leaf-manifest.cjs`, `compiled-route-manifest.cjs refresh`
- **Index regenerators**: `advisor_rebuild`, `sync-skills-hermes.cjs`, `generate-trigger-index.mjs`

### Data Flow
Hub JSONs and docs carry the new names; the leaf manifest and compiled-route manifest are re-minted from them; the advisor DB re-indexes the hub graph; the hermes mirror and trigger index regenerate from the renamed sources.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A baseline of every gate was captured in `scratch/baseline/` before the rename and re-run into `scratch/after/` after it. Routing was replayed through both stages, advisor and hub, and compared with `main` for the same prompt.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 001's `research/research.md` and the three operator decisions recorded in `spec.md`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The rename is staged, not committed. `git reset --hard HEAD` in the worktree discards it; the packet backup in the session scratchpad restores this packet's docs.
<!-- /ANCHOR:rollback -->

---
