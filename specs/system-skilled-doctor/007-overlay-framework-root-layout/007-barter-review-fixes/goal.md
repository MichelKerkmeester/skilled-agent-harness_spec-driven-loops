---
title: "Goal: Phase 7: fix the Barter findings from the extended deep review of the overlay layout"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "barter review fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/007-barter-review-fixes"
    last_updated_at: "2026-11-20T16:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-007-barter-review-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: fix the Barter findings from the extended deep review of the overlay layout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every Barter-side finding of the extended deep review of the overlay framework/root layout is fixed in ai-speckit's overlay sources and their applied copies, with a test where behaviour changes, and Barter's full gate set passes after the fix.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | With no overlay manifest, the commit gate fails closed only when a vendored path is staged, and prints one visible skip line otherwise. |
| D2 | Each of the three Barter hooks reads `overlayDir` from `skilled/.skilled-overlays.json` itself, with `../overlays` as the fallback. |
| D3 | The work runs in ai-speckit. Skilled holds only this phase's record. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `git -C <ai-speckit> show --stat 5dd004f3faa` lists `pre-commit`, `pre-commit.test.cjs`, the guard core, the git-write gate, the plugin test, `.gitignore`, `overlays/README.md`, the byte-parity test and `barter-overlay-first.md`.
- [x] In ai-speckit's `skilled/`, `overlay-engine.cjs status --audit` prints `RESULT: PASSED` with `offLayout=[]`.
- [x] In ai-speckit, `bash tests/run-all.sh` exits 0, and both `overlays/checks` print `RESULT: PASSED`.
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this phase.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Fix and gates in ai-speckit | Done | Commit `5dd004f3faa`; the 039 record's Verification table |
| Skilled record | Done | This folder |

### Deviations and findings

| Item | Note |
|------|------|
| Recorded after the fact | The fix ran in an ai-speckit session before this phase existed; this folder records it from that commit and record |
<!-- /ANCHOR:log -->
