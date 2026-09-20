---
title: "Tasks: Fold a condensed design-knowledge layer into the standalone skill"
description: "Task breakdown for distilling and repointing the design-knowledge layer."
trigger_phrases:
  - "fold design knowledge tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/004-fold-design-knowledge"
    last_updated_at: "2026-08-19T06:07:13Z"
    last_updated_by: "spec-author"
    recent_action: "Authored 8 design-knowledge files, repointed 3 links, verified zero ../shared refs"
    next_safe_action: "Phase 005: delete hub + interface commands (operator-gated)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/references/design-knowledge/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: Fold a condensed design-knowledge layer into the standalone skill

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Size the hub sources — `wc -l shared/*.md` totals 444 lines across 6 files; confirmed the "condensed" scope (fold the compact shared principles, not the larger interface references).
- [x] T002 Confirm the 3 dangling `../shared/*` links and their exact repoint targets (all point at the register).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Dispatch cli-devin `gemini-3-7-flash-high` (plan-named, verified healthy) with the precise fold prompt.
- [x] T004 Devin blocked: rejected file writes in non-interactive `-p` mode (`requires confirmation / use --permission-mode dangerous`); `dangerous` forbidden without operator approval, `--sandbox` isolates writes, GLM-5.2 shares the same runtime block. Deviation flagged; fell to in-context authoring (fold is small + sources loaded — cli-devin's own "direct action is faster" case).
- [x] T005 Author 6 condensed folded files under `references/design-knowledge/` (register, register-card, anti-slop, cognitive-laws, numeric-laws, token-vocabulary), trimmed to the extraction posture (register recorded not authored; sibling-mode handoffs + deleted-hub paths removed).
- [x] T006 Author `design-principles-digest.md` (new, ~90 lines) distilled from interface design-principles, framed as intent-vs-slop recognition for extraction.
- [x] T007 Author `README.md` index; repoint the 3 dangling links to the local copies (SKILL.md "Shared" section renamed to "Design Knowledge" surfacing the whole layer).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 `grep -rniI --include=*.md '\.\./\(\.\./\)*shared'` over the skill returns **NONE** — no reference escapes to the deleted hub.
- [x] T009 All 3 repointed link targets resolve — `test -f` passes for `references/design-knowledge/README.md`, `design-knowledge/register.md`, `design-knowledge/register-card.md`.
- [x] T010 All 8 design-knowledge files present (`register.md` 4881B, `design-principles-digest.md` 4567B, `README.md` 2053B, plus 5 more); folded content spot-checked against `sk-design/shared/*` sources for fidelity + posture trim.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 10 tasks (T001-T010) marked `[x]`
- [x] 8 files under `references/design-knowledge/` (`ls` count = 8)
- [x] Zero `../shared` references in the standalone skill (`grep` = NONE)
- [x] `validate.sh --strict` exits 0 (Errors: 0)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
