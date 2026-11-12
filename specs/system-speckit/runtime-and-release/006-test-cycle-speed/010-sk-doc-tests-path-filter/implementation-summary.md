---
title: "Implementation Summary"
description: "A push that touches no sk-doc path now runs two repository-walking sk-doc tests instead of all 56. The other 54 files run from a path-filtered workflow when an sk-doc path changes. Both files parse, the union is still 56 files, and the gate-input check passes."
trigger_phrases:
  - "sk doc tests path filter implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/010-sk-doc-tests-path-filter"
    last_updated_at: "2026-11-12T11:02:45Z"
    last_updated_by: "build-worker"
    recent_action: "Split the sk-doc script tests into an every-push walking job and a path-filtered workflow"
    next_safe_action: "Amend the expected node count in tasks.md T004 from 1 to 2, then close T004"
    blockers:
      - "T004 verify expects node=1; the in-scope tree prints node=2 because the render-gate and citation-drift jobs keep their Node setup"
    key_files:
      - ".github/workflows/sk-doc-script-tests.yml"
      - ".github/workflows/sk-doc-script-tests-filtered.yml"
      - ".github/workflows/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-sk-doc-tests-path-filter"
      parent_session_id: null
    completion_pct: 90
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
| **Spec Folder** | 010-sk-doc-tests-path-filter |
| **Completed** | 2026-11-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A push that touches no sk-doc path now runs two sk-doc script tests instead of 56. The durable-directory manifest and the README verdict baseline still run on every push because they read the whole repository; the other 54 files run from a second workflow that starts only when an sk-doc path changes.

### Phase 10: sk-doc-tests-path-filter

The single script-test step ran 56 files on every push and, at 182 seconds, was the slowest check on a push that touched nothing under sk-doc. Splitting it removes that wait without dropping a test: the walking pair keeps its every-push trigger, and the remaining 50 Python files plus four Node tests gained a path filter over both sk-doc source roots.

The walking job also dropped the Node setup and the three package installs, which only the filtered files needed, and pytest, which neither walking file uses because both run as plain `python3` scripts. The pinned PyYAML stays, because the verdict baseline reads frontmatter through the validator and that validator turns lenient without it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/sk-doc-script-tests.yml` | Modified | First job renamed to the repository walk and narrowed with `ONLY_TESTS` to `test_readme_manifest.py` and `test_readme_verdict_parity.py`; its Node setup, package installs and pytest removed; header comment rewritten. The catalog, render and citation jobs are unchanged. |
| `.github/workflows/sk-doc-script-tests-filtered.yml` | Created | Runs the runner with `SKIP_TESTS` naming the rename harness and the two walking tests, behind a path filter over `.opencode/skills/sk-doc/**`, `.skilled/skills/sk-doc/**` and the workflow file, on `SKILLED_CI_TESTS`. |
| `.github/workflows/README.md` | Modified | Added the new workflow to the contents table, the path-filtered trigger row and the `SKILLED_CI_TESTS` row, and reworded the `sk-doc-script-tests.yml` row to the two walking tests. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Recorded the 56-file baseline first, then ran the walking pair with `ONLY_TESTS` set to confirm it passes without pytest or the Node packages. Only then were the workflow files changed.

The split was proved three ways: both workflow files parse under `yaml.safe_load`, the before-and-after set comparison over the runner's own `NODE_TESTS` and the test directory prints `SAME 56 FILES`, and `check-gate-inputs.sh` accepts the new filter's twin roots. Nothing was committed, pushed or opened as a pull request; that stays with the orchestrator.

No task was skipped for needing a branch, a pull request or an operator go-ahead. T004 is left unticked with its reason recorded below and in `tasks.md`: its stated expected output cannot be met from inside the frozen scope.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two workflows rather than one path-filtered job | A path filter on the whole suite would skip the two walking tests on any push that touches no sk-doc path, and those two are the only checks that read the whole repository. |
| `ONLY_TESTS` in the walking job, `SKIP_TESTS` in the filtered one | Listing the walking pair positively means a test file added later joins the filtered workflow by default instead of silently joining the every-push one. |
| Walking job keeps `SKIP_TESTS`-free and drops pytest | Neither walking file defines `def test_`, so the runner invokes both with plain `python3`; installing pytest would only slow the job. |
| Filter names each whole sk-doc tree | The gate-input check requires both `.opencode/` and `.skilled/` roots, and a narrower glob would miss fixtures and shared scripts the filtered tests load. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T001 baseline counts | `py=53 node=4` (PASS) |
| T002 walking pair alone | `PASS test_readme_manifest.py`, `PASS test_readme_verdict_parity.py`, `all sk-doc script tests passed` (PASS) |
| T003 walking job narrowed | `only=1 skip=0` (PASS) |
| T004 walking job dependencies | `node=2 pkgs=0 pyyaml=2` against stated `node=1 pkgs=0 pyyaml=2` (MISMATCH, blocked; see Known Limitations) |
| T005 filtered workflow parses | `YAML OK` (PASS) |
| T006 README documents the new file | `rg -c 'sk-doc-script-tests-filtered.yml' .github/workflows/README.md` printed `3` (PASS) |
| T007 both workflows parse | `2 YAML FILES OK` (PASS) |
| T008 union proof | `SAME 56 FILES` (PASS) |
| T009 gate inputs | `files=46 inputs_resolved=293 dynamic_inputs=38 twin_pairs=375 failures=0`, `RESULT: PASSED` (PASS) |
| Packet validation | `RESULT: PASSED (errors=0 warnings=1)`, the warning being `CONTINUITY_FRESHNESS ... code:not_opted_in` (PASS) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **T004's expected count is wrong** The verify expects `node=1`; the tree prints `node=2`. Only one of the three `name: Setup Node` steps belonged to the walking job, so removing it leaves the two that the `render-gate` and `citation-drift` jobs run their `node --test` steps on. Spec section 3 keeps both jobs unchanged, so `node=1` is unreachable from this phase. The one-line fix is to change the expected value in `tasks.md` T004 to `node=2`; the change the task describes is already in place.
2. **The filtered tests no longer catch breaks from outside their filter** A change that breaks one of the 54 files without touching a path under `.opencode/skills/sk-doc/` or `.skilled/skills/sk-doc/` waits for the next push that does. `plan.md` section 3 records this as the accepted regression; the two walking tests still run on every push.
<!-- /ANCHOR:limitations -->

---
