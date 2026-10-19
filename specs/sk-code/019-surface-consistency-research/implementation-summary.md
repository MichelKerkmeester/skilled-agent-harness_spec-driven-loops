---
title: "Implementation Summary: sk-code surface consistency"
description: "Two research rounds are done and the remediation is planned: fifteen check-guarded steps covering one surface setup, doctor checks that enforce it, a hub scaffold for new surfaces and registry-derived routing. No skill file has changed yet."
trigger_phrases:
  - "surface consistency research implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/019-surface-consistency-research"
    last_updated_at: "2026-10-19T08:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Planned the remediation from the research"
    next_safe_action: "Record the step-1 baseline (T003)"
    blockers: []
    key_files:
      - "specs/sk-code/019-surface-consistency-research/research/research.md"
      - "specs/sk-code/019-surface-consistency-research/plan.md"
      - "specs/sk-code/019-surface-consistency-research/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-019-surface-consistency-research"
      parent_session_id: null
    completion_pct: 20
    open_questions:
      - "Is the obsidian reference grouping in plan.md §3 the right one?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: sk-code surface consistency

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-surface-consistency-research |
| **Completed** | Not yet. Research and planning done 2026-10-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two research rounds are finished and the remediation is planned. No file under `.skilled/` has changed yet.

### Research and remediation plan

Round 1 (`research_archive/20261019T081751Z/research.md`) compares the three surfaces over 5 iterations. It finds they already share frontmatter, opening sections, routing keys and the workflow links, and sets one target layout. Round 2 (`research/research.md`, 3 iterations) finds that nothing enforces that layout, that `verify-router-sync.cjs` checks only two of the three surfaces, and that a new surface touches about a dozen files. `plan.md` turns both rounds into 15 steps, each with the check that guards it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research_archive/20261019T081751Z/` | Created | Round 1 research record, moved there by the loop's restart |
| `research/research.md` and `research/iterations/` | Created | Round 2 research record |
| `spec.md` | Created | Scope now covers research and the planned remediation |
| `plan.md`, `tasks.md`, `acceptance-criteria.md` | Created | The 15 steps, their tasks and the closure gate |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both rounds ran `/deep:research:auto` on cli-codex `gpt-6-luna` at `max` effort on the `fast` tier in worktree 145. All 8 iterations passed `verify-iteration.cjs`; round 1's iterations 2 and 5 needed one redispatch each because the first attempt did not write its state record. Round 2 started with `--restart`, which moved round 1 to `research_archive/`. In round 2 the orchestrator ran the YAML's own steps through driver scripts rather than step by step; the codex dispatches still went through the audited executor path. The main claims of both rounds were rechecked on disk before the plan was written.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Standardize the packet contract, not topic folder names | Each surface covers a different domain, and forced names would hide content (`research_archive/20261019T081751Z/research.md` §10) |
| Keep research and remediation in one Level 2 packet | `recommend-level.sh` scored 68/100 and did not recommend phases |
| Leave recorded benchmark reports unchanged | They are the record of their run |
| Put the new doctor checks in `parent-skill-check.cjs`, not a new leg | The `parent-skill` leg already runs that checker |
| Keep the surface scaffold in sk-code, with a checklist rather than a script | sk-doc's scaffolds build a hub or a workflow packet, not a surface; the registration steps cross docs, JSON and generated files |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `verify-iteration.cjs` on all 8 iterations | PASS |
| Packet `validate.sh --strict` | PASSED, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Q3 to Q5 rest on one iteration.** Iterations 3-5 were each handed an already-answered question; iteration 5 covered the rest. The supporting-folder and companion-file claims were rechecked on disk.
2. **The obsidian grouping was confirmed by the operator on 2026-10-19.** It is still untested until step 5 runs.
3. **Round 2's coverage graph reported `STOP_BLOCKED`** on source diversity and evidence depth, with one iteration per question. Its main claims were rechecked on disk; the hint-parity claim is inferred from code until the step-10 tests run.
<!-- /ANCHOR:limitations -->

---
