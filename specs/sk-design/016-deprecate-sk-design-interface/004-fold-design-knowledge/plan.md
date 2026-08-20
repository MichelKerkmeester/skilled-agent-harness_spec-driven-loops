---
title: "Implementation Plan: Fold a condensed design-knowledge layer into the standalone skill"
description: "Dispatch cli-devin to distill the condensed layer from the hub sources, verify every folded file against its source, repoint the 3 links, and prove no ../shared reference survives."
trigger_phrases:
  - "fold design knowledge plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/004-fold-design-knowledge"
    last_updated_at: "2026-08-19T06:07:13Z"
    last_updated_by: "spec-author"
    recent_action: "Authored fold plan"
    next_safe_action: "Verify devin output"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/references/design-knowledge/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Fold a condensed design-knowledge layer into the standalone skill

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Delegate the bulk distillation to the plan-named cli-devin `gemini-3-7-flash-high` (verified healthy), giving it an exact source→target mapping and trim rules, then verify each folded file against its hub source and repair in place. Prove the fold self-contained by confirming no `../shared` reference survives and the 3 repointed links resolve.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- **Ready:** 003 landed the standalone identity; sources still present under `sk-design/shared/` and `sk-design-interface/references/`.
- **Done:** 8 files exist; every folded file faithful + trimmed to posture; 3 links resolve; zero `../shared` refs; `validate.sh --strict` exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Aspect | Value |
|--------|-------|
| **Target** | `.opencode/skills/sk-design-md-generator/references/design-knowledge/` |
| **Folded (condensed)** | register, register-card, anti-slop, cognitive-laws, numeric-laws, token-vocabulary |
| **New** | `design-principles-digest.md` (distilled from interface design-process), `README.md` |
| **Repoints** | `SKILL.md`, `references/authoring-boundary.md`, `assets/source-of-truth-router-card.md` |
| **Executor** | cli-devin `gemini-3-7-flash-high`, `accept-edits`, child spec-gate disabled |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Scope the fold: size the hub sources, confirm the 3 dangling links and their exact target paths, decide the condensed layer's file list.

### Phase 2: Implementation

Dispatch cli-devin with the precise prompt (source→target map, trim-to-posture rules, link repoints). Fallback ladder if it fails: GLM 5.2 high, then in-context authoring.

### Phase 3: Verification

Read each folded file against its source; repair over-condensation or mis-trims in place; confirm zero `../shared` refs and that all 3 repointed links resolve.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Real command evidence: a repo-scoped `grep -rn '\.\./shared' --include=*.md` returning empty; a resolve check on each repointed link target; a per-file source-vs-fold read to confirm substance is preserved and posture-trimmed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Upstream: 003 (standalone identity). Downstream: 005 (delete hub — safe only after this), 006 (reconcile external refs).
- Tools: cli-devin (`devin` CLI, verified logged in); Read/Grep/Edit for verification and repair.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Uncommitted. The new `design-knowledge/` directory is removable with `rm -r`; the 3 link repoints revert via `git checkout -- <file>`. Reversing returns the skill to its post-003 state (links dangling, no design-knowledge layer).
<!-- /ANCHOR:rollback -->
