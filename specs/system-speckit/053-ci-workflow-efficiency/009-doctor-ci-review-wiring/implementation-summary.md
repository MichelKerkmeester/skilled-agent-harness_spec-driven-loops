---
title: "Implementation Summary"
description: "Built and landed: the R28 probe answered the toggle shape with write, and /doctor:ci shipped as a read-only report, a confirmed scaffold and a confirmed toggle with three registered advisor bridges. The CI surface value (R30) is superseded by ADR-013, so no sk-code file changed and a workflow review gets its CI evidence through request vocabulary bundling. The closure commit is the one open task."
trigger_phrases:
  - "doctor ci review wiring implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring"
    last_updated_at: "2026-10-25T10:20:00Z"
    last_updated_by: "markdown"
    recent_action: "Closed the verification checklist with evidence and set the decision statuses"
    next_safe_action: "Phase closed; no further work in this phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-009-doctor-ci-review-wiring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-doctor-ci-review-wiring |
| **Completed** | Built and landed 2026-10-25 on main (10c6791341, e0f922b593, 4e0b8560cb). Closure records finished 2026-10-25. The closure commit (T033) is the orchestrator's and the one open task |
| **Level** | 3 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The phase shipped `/doctor:ci` as three routes in three commits on main. The R30 half of the plan, a `CI` value in surface detection, was not built. The operator ruled "Drop R30, keep the hub." on 2026-10-25 and ADR-013 records it.

### Phase 9: doctor-ci-review-wiring

- **The R28 probe** set, read, deleted and re-read the throwaway variable `SKILLED_CI_PROBE`. The four exit codes were 0, 0, 0 and 1, the live variable list printed `[]` afterwards, and the answer is `D9: write`, so the toggle writes after an explicit yes.
- **The report** (`/doctor:ci report`) is read-only. It lists every workflow with its switch state, trigger, filters and drift flags, and it resolves the newest non-rebuild commit on main. The live run listed 32 workflows with every switch `on`.
- **The scaffold** (`/doctor:ci scaffold`) creates a new workflow from the `sk-code-ci` templates after an explicit yes. It refuses an existing path and a protected name.
- **The toggle** (`/doctor:ci toggle`) accepts only the six documented switch variables and refuses to turn off the message contract switch and the master switch while the README carries the prohibition.
- **The registration** adds three routes, three advisor bridges in both scorers, the regenerated projection and one `/doctor:setup` row.
- **R30 is superseded.** The hub removed the Webflow and Obsidian surfaces and now bundles `sk-code-ci` from request vocabulary, and its contract says stack detection does not select CI. The compiled route returns `sk-code-review` then `sk-code-ci` for a workflow prompt.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/ci.md` | Created | The router with the `report`, `scaffold` and `toggle` targets |
| `.skilled/commands/doctor/assets/doctor-ci-*.yaml` and `doctor-ci-presentation.txt` | Created | The three workflows and the presentation contract |
| `.skilled/commands/doctor/scripts/ci-report.cjs` and two tests | Created | The report script, its fixture test and the contract test |
| `.skilled/commands/doctor/_routes.yaml` and `doctor-setup-presentation.txt` | Modified | Three routes and one setup row |
| `.skilled/skills/system-skill-advisor/runtime/` bridge files | Modified | Six activation entries and the four regenerated projections |
| `.skilled/skills/sk-code/` | Unchanged | R30 is superseded, so this phase changes no sk-code file |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`tasks.md` holds T001 to T033. T001 to T017 and T026 to T031 are done, T018 to T025 are closed as superseded by ADR-013, T032 closed the acceptance rows, and T033 (the closure commit) is open. The three doctor commits are ancestors of `origin/main`. No sk-code commit was made.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| D9 is answered by the R28 probe, with write as the default | The probe is the only evidence that separates a working toggle from a printed instruction (ADR-001) |
| The report reads the job `if:` expression rather than a spec folder | A shipped command must not depend on a mutable spec tree (ADR-003) |
| The newest non-rebuild SHA is excluded by commit-message trailer | A rebuild SHA carries downstream runs, so a workflow-name filter cannot exclude it (ADR-004) |
| R30 is superseded and the hub stays as it is | The hub no longer has the surfaces the frozen precedence assumed and its contract says detection does not select CI (ADR-013, which supersedes ADR-006) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | Exit 0, `17 routes validated, 2 warnings` |
| `derive-command-bridges.cjs --check` | Exit 0, `"status": "fresh"` with `"changed": []` |
| `doctor-phrase-reach.cjs` | Exit 0, `STATUS=OK phrases=109 bridges=21` |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | Exit 0, `7 suite(s) passed, 0 failed`, node:test `tests 458`, `pass 458` |
| `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.test.cjs` | Exit 0, `tests 27`, `pass 27`, `fail 0`, the same as the baseline |
| `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` | Exit 0, `all 4 guards PASSED, 10 non-blocking warning(s)` |
| Live report | 32 workflows against 32 files, switch set `['on']`, newest non-rebuild SHA `bce45aa297aac14f6b0e92f85126c57dc53c4ba2` |
| Acceptance rows | 24 rows, 19 `Met` and 5 `Superseded`, none `Unmet`, `Closeable: Yes` (AC-023 and AC-024 added on 2026-10-25) |
| Verification checklist in `tasks.md` | 26 of 26 rows closed with evidence re-run on 2026-10-25 (12 P0, 13 P1 and 1 P2) |
| Decision statuses in `decision-record.md` | ADR-001, ADR-003 to ADR-005 and ADR-007 to ADR-013 `Accepted`, ADR-006 superseded by ADR-013, ADR-002 not applied because the probe answered write |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <phase> --strict --no-recursive` | `RESULT: PASSED` (recorded in `scratch/phase-result.md`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The review router's own surface label reads `UNKNOWN` for a workflow diff.** The inline `detect_surface_evidence` in `sk-code-review/SKILL.md` has one branch, `SKILLED`, so `.github/workflows/spec-kit-check.yml` returns `UNKNOWN` (observed 2026-10-25). The `sk-code-ci` evidence still loads through request vocabulary bundling, so a review is not left without it. This is recorded and not a task. A later hub change can decide whether the label should change (ADR-013).
2. **AC-021 counts six by entry and prints twelve by line.** The literal `grep -c 'command-doctor-ci-'` prints `12` because each of the six activation entries matches on two lines. The row records the deviation.
3. **Resolved: the edits made by another process are committed.** `.skilled/commands/doctor/ci.md` and the `sk-code-ci` docs were edited in this worktree while the closure pass ran. They landed in `d16cab7620` and `0781e81da2`, outside this phase's three commits.
<!-- /ANCHOR:limitations -->

---
