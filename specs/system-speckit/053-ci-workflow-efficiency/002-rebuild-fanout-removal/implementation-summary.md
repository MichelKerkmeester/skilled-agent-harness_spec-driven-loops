---
title: "Implementation Summary"
description: "In progress, built and measured but not closeable: this phase appended a [skip ci] token to the trigger-index rebuild commit so the pushed rebuild starts no workflow run, guarded it with a vitest case that fails without the token, and observed three qualifying zero-run rebuilds; the 24 h baseline recorded 2,191 runner-min, outside its 1,700-1,850 band, so one acceptance row stays Unmet."
trigger_phrases:
  - "rebuild fanout removal implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal"
    last_updated_at: "2026-10-24T09:00:00Z"
    last_updated_by: "markdown"
    recent_action: "24 h baseline measured at 2,191 runner-min, outside its 1,700-1,850 band"
    next_safe_action: "Operator decides AC-006: amend the band or re-collect a quieter window"
    key_files:
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-002-rebuild-fanout-removal"
      parent_session_id: null
    completion_pct: 95
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
| **Spec Folder** | 002-rebuild-fanout-removal |
| **Status** | In progress |
| **Planned** | 2026-10-23 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Built but not closed. Commit `8e62a3d096` landed the token, the two comment lines, the `SKIP_TOKEN` case, both filter entries and both README rows as one commit, and workflow-only PR #71 proved the new trigger. The three qualifying post-change rebuild SHAs (`08bd79a68a`, `27490113c2`, `c9d4deed31`) each have a captured `[]` result; a fourth SHA (`c7c5bfb51b`) also returned `[]`. T015 is complete. The 24 h snapshot was collected 2026-10-24: 2,191 runner-min for `.github/workflows/` runs against an expected 1,700-1,850 and 3,812 before the change, with 0 runs started by any of the 19 rebuild commits in the window. The number is outside the band, so AC-006 stays `Unmet` and the phase stays in progress.

### Phase 2: rebuild-fanout-removal

The plan removes the 14-run fan-out that follows every trigger-index rebuild commit by putting `[skip ci]` on that commit's body line, keeping the `Trigger-Index-Rebuild: ci` trailer last so the loop guard still matches. It guards the change with one case in `trigger-index-rebuild-workflow.vitest.ts`, and makes `spec-kit-check.yml` run that suite when the rebuild workflow changes. The task list is `tasks.md` T001 to T021; the closure gate is `acceptance-criteria.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/trigger-index-rebuild.yml` | Modified in `8e62a3d096` | Body `-m` at `:151` carries ` [skip ci]`; trailer at `:152` stays last; comment lines at `:147-148` explain the token; the job-level loop-guard comment was rewritten beyond T005's scope (accepted 2026-10-24) |
| `.github/workflows/README.md` | Modified in `8e62a3d096` | Rows `:58` and `:75` state that the pushed rebuild starts no workflow run (`:58` carries the delivered fallback wording the 2026-10-24 amendment accepted) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts` | Modified in `8e62a3d096` | `SKIP_TOKEN` at `:85` and one case at `:895` asserting the token and the trailer |
| `.github/workflows/spec-kit-check.yml` | Modified in `8e62a3d096` | Both path lists name `.github/workflows/trigger-index-rebuild.yml` (`:12` and `:43`) |
| `scratch/pre-change/` | Created | Three `gh run list` JSONs, 14 runs per rebuild SHA, the before number |
| `scratch/post-change/` | Created | `[]` results for `08bd79a68a`, `27490113c2` and `c9d4deed31`; `c7c5bfb51b` is a fourth |
| `scratch/baseline-24h/` | Created | `runs-last-1000.json`, `window.json`, `run-ids.txt`, `rebuild-shas.txt`, 191 `jobs/<id>.json` samples and `summary.md`: the post-change 24 h baseline for phases 003 to 009 (2,191 runner-min) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered through T018, with T012's negative arm and T019's snapshot run on 2026-10-24 and 2026-10-25. D1 answered (`scratch/d1-answer.md` holds `D1=A`), the pre-change capture recorded 14 runs per rebuild SHA, the suite was green before and after the change, `8e62a3d096` carried the whole change set, and PR #71 exercised the `pull_request:` path list. T015 is done on three qualifying rebuild SHAs, with a fourth additional zero-run result; T012 now shows the stripped-variant suite exiting 1 and the real suite exiting 0, and T019 collected the snapshot. Remaining work is the operator's decision on AC-006 and then the T021 commit. `acceptance-criteria.md` shows AC-001, AC-002, AC-003, AC-004, AC-005 and AC-007 `Met`; AC-006 stays `Unmet` because the measured total is outside its band.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| D1 default: the `[skip ci]` token, not 104 path-filter entries | One line removes 2,073 of 3,812 runner-min/day and leaves the twin gate and its ordering rule untouched |
| The token on the body line, the trailer last | The loop guard is a suffix match, so the trailer's position decides whether the guard still works |
| One commit for token, test, filters and README | spec-kit-check runs on every spec-kit change, so a split commit is either red or ships an unguarded token |
| A fresh 24 h baseline rather than a scaled window | Later phases state deltas against it, so it has to measure the deployed state |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run --config ../../vitest.config.ts --project cli tests/trigger-index-rebuild-workflow.vitest.ts` | Exit 0; 60 passed and 1 skipped of 61, including the `marks the rebuild commit` case |
| The same suite through `TRIGGER_INDEX_REBUILD_WORKFLOW_PATH` on a token-stripped copy | Exit 1 on 2026-10-25; 1 failed, 59 passed, 1 skipped of 61; the failing case is `marks the rebuild commit so the pushed commit starts no workflow run` |
| `bash .github/scripts/check-gate-inputs.sh` | Exit 0 on 2026-10-25: `files=45 inputs_resolved=250 dynamic_inputs=39 twin_pairs=336 failures=0`, `RESULT: PASSED`; the earlier reading at the change was `inputs_resolved=235 dynamic_inputs=9 twin_pairs=340` |
| Three qualifying rebuild SHAs by `gh run list --commit` | `[]` for `08bd79a68a`, `27490113c2` and `c9d4deed31`; `c7c5bfb51b` is a fourth and also returned `[]` |
| spec-kit-check on `8e62a3d096` and PR #71 head `6c51acecb2f8` | Run 40018919244 `success`; run 40021934338 `success` |
| `scratch/baseline-24h/summary.md` | Exists. Window 2026-10-23T21:59:34Z to 2026-10-24T21:59:34Z, 795 runs (728 from `.github/workflows/`, 67 `dynamic`). Total 2,191 runner-min, outside 1,700-1,850; 0 runs started by 19 rebuild commits; `dynamic` runs about 584 min on a separate line |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The result covers four observed rebuilds.** The three qualifying SHAs `08bd79a68a`, `27490113c2` and `c9d4deed31` each returned `[]`, and the additional SHA `c7c5bfb51b` did too. Future rebuilds remain unobserved; the 24 h baseline is still pending.
2. **`main`'s tip carries no statuses after a rebuild.** Phase 009's `/doctor:ci report` must resolve the newest non-rebuild SHA. No current consumer was found.
3. **The baseline total missed its band.** The 24 h window held 391 push and 321 pull_request runs plus 15 manual dispatches. The total of 2,191 includes 90 min from the rebuild workflow's own runs, which the pre-change estimate counted as 0, and 114 min of manual dispatches; removing both still leaves 1,987, above 1,850. Later phases measure their deltas against 2,191, as reported, until the operator decides what to do with AC-006.
4. **GitHub CodeQL default-setup runs sit outside this packet's workflow count.** Since 2026-10-24, the repository has GitHub's CodeQL default-setup code scanning enabled. This packet did not enable it. Each push to `main` starts one `Push on main` run with event `dynamic`, including a `[skip ci]` rebuild commit, because `[skip ci]` does not suppress code scanning. Rebuild `a191ba6f70` shows one such run and no run from `.github/workflows/`. The three-zero-run criterion counts runs from `.github/workflows/` only. It was met by `08bd79a68a`, `27490113c2` and `c9d4deed31`. Baselines and deltas in 002 T019, 003 T036 and phase 008 count `.github/workflows/` runs and report the CodeQL dynamic run on a separate line. This keeps totals comparable with the pre-change baseline.
<!-- /ANCHOR:limitations -->

---
