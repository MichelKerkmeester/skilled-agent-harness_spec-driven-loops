---
title: "Tasks: sk-code Animation Surface Mining"
description: "Task breakdown: worktree setup, the gpt-5.5 outsourced analysis+draft, and the reviewed integration into sk-code with drift-guard validation."
trigger_phrases:
  - "sk-code animation mining tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/012-sk-code-animation-mining"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Listed tasks"
    next_safe_action: "Create the worktree; dispatch gpt-5.5"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-animation-mining"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Tasks: sk-code Animation Surface Mining

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` done · `[~]` in progress. Tasks map to the plan's phases.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-101 Recorded HEAD baseline `b697b0a1d1` (RM-8 L3); created `wt/0006-sk-code-animation` off it (sk-git method).
- [x] T-102 Composed the RM-8-scoped prompt (BANNED/ALLOWED + additive-delta mandate + output contract + Gate-3 pre-answer for the non-interactive agent).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-201 Dispatched gpt-5.5-fast (xhigh) via cli-opencode `--dir <worktree>`; it cloned web-motion-skill + analyzed (delta table in `proposals/ANALYSIS.md`). First dispatch blocked on the repo's Gate-3 rule; re-dispatched with the gate pre-answered.
- [x] T-202 gpt-5.5 drafted `animation_principles.md` (design-principle layer) + `principled_reveal.js` (composed snippet) + a frame-verification fold-in to `performance_and_pitfalls.md` — additive-only, Motion.dev-framed.
- [x] T-203 Wired both into `smart_routing.md` §2/§5/§11; MIT attribution in each artifact; rationale in `proposals/{ANALYSIS,INTEGRATION}.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-301 Reviewed the worktree diff (additive-only, Motion.dev-framed, MIT-attributed, hygiene-clean); integrated the 6 vetted files into main's sk-code (2 new + 4 modified, incl §2/§5/§11 wiring). gpt-5.5 had already dropped the scripts/GSAP-specifics as non-portable.
- [x] T-302 Drift guard 4/4 + full suite 349/349 green on main; analysis copied to `proposals/{ANALYSIS,INTEGRATION}.md`; worktree + branch removed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Done when the additive animation guidance is wired into the router with the drift guard green on main, MIT attribution is present, the worktree diff was reviewed (weak drafts dropped), and the analysis is preserved in `proposals/`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..005). Plan: `plan.md`. Source: `Schmandarine/web-motion-skill` (MIT). sk-code surface: `references/motion_dev/`, `references/smart_routing.md` §5/§11.
<!-- /ANCHOR:cross-refs -->
