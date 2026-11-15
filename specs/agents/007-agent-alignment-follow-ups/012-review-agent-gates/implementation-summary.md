---
title: "Implementation Summary"
description: "The review agent runs both report checkers before sending, finishes with an unclosable gap at LOW confidence, accepts Fast Path in its self-check and keeps one gate type and one score table."
trigger_phrases:
  - "review agent gates implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/012-review-agent-gates"
    last_updated_at: "2026-11-15T00:08:24Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified the phase"
    next_safe_action: "Start phase 013 context-markdown-design-fixes"
    packet_purpose: "Purpose: Every review the agent can produce has a send path its own rules allow, its report passes through the checkers that grade it, and the file states only the gate type and score rules a caller uses."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:ada430ae09066c3e67be0987d6cd0df06668863b51edd965ac3ee9b628e2ffa0"
      session_id: "scaffold-012-review-agent-gates"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a84f4eed-26f9-49ac-91eb-e2375c207e96"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-15T00:08:24Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-review-agent-gates |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

@review now runs both report checkers on its finished report before sending, can finish a review with a gap it cannot close, and accepts a Fast Path review in its self-check. Its gate types and advisory score say only what the callers and the template's self-score rule hold.

### Phase 12: review-agent-gates

| Finding | Outcome | Evidence (`scratch/after.txt`) |
|---------|---------|-------------------------------|
| review-2 | Fixed. Question 6 accepts a Fast Path review | 1 in both files |
| review-3 | Fixed. A gap that cannot be closed is sent with confidence LOW on the `Not checked:` line; the verdict follows the Section 6 table | `DO NOT send until fixed` exit 1, `cannot be closed` 4 |
| review-4 | Fixed. Step 7 runs `check-review-final-line.js` and `check-review-findings.js` through a quoted heredoc | the agent's command run verbatim: `final-line=0 findings=0` on `pr-shape-valid.md`, `findings=1` on `status-commented-open-p1.md` |
| review-6 | Fixed. One gate type, `post_execution`, sent by `/speckit:implement` and `/speckit:complete`; one score table; the repeated block gone; the template's self-score rule stated in the score paragraph | gate searches exit 1, score section 15 lines, `never decides a status` 1 |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/agents/review.md` | Modify | The four fixes, 462 to 453 lines |
| `.claude/agents/review.md` | Regenerate | Canonical body from the H1 with `.claude/agents/` paths |
| `.pi/agents/review.md`, `.codex/agents/review.toml`, `.dsh/agents/review.patch.yml` | Regenerate | The three sync scripts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash at `--thinking max` through cli-pi made five serial single-task edits to `review.md`. The conductor read the diff, then changed the step 7 command so `S` names the review mode folder and each call adds `scripts/`, because the roster check rejects a cited skill directory that holds no `SKILL.md`. The command was then run verbatim from the agent file on three fixtures.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A LOW-confidence review with no P0 or open P1 still passes the gate | The planning default in open question 1; failing it would change the verdict table and the speckit verdict handling this phase does not own |
| The self-score rule is applied in the score paragraph's own words: "a score the review gives itself never decides a status" | The template line reads "A score an agent gives itself never decides a status" (`agent-template.md:472`); the score paragraph adds two lines, 15 in all, inside the REQ-006 limit |
| `S` points at `sk-code-review`, not its `scripts/` folder | The roster check resolves every `.skilled/skills/` path and fails a directory without `SKILL.md` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Every acceptance command | Each prints its stated value, `scratch/after.txt` |
| Step 7 on fixtures | `final-line=0 findings=0`, `final-line=0 findings=1`, `final-line=1 findings=1`, same as `scratch/baseline.txt` |
| Roster and mirrors | `agent-roster: OK`, mirror check exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **LOW confidence still passes.** A review that could not close a gap passes when no P0 or open P1 exists. The gap travels on the `Not checked:` line and in `confidence: LOW`; making it fail is the operator's call.
<!-- /ANCHOR:limitations -->

---


