---
title: "Implementation Summary: Phase 4: total-candidate-count"
description: "The trigger lookup now reports how many documents ranked before its --limit cut, and /speckit:search shows the hidden count."
trigger_phrases:
  - "total candidate count implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count"
    last_updated_at: "2026-11-09T16:18:07Z"
    last_updated_by: "template-author"
    recent_action: "Phase 4 built, aligned and benchmarked"
    next_safe_action: "Start phase 5"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-total-candidate-count"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-total-candidate-count |
| **Completed** | 2026-11-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A truncated trigger lookup now says how much it cut. `--limit 2` on "trigger index" prints `candidates : 2 of 801 (truncated) from 1035 phrase(s)`, and the JSON answer carries `totalCandidates: 801`.

### Phase 4: total-candidate-count

Before this phase, `truncated: true` was the only signal, so you could not tell 21 candidates from 2,000. Now you can judge whether raising `--limit` is worth it. Untruncated output is byte-identical to before, exit codes did not move, and `/speckit:search` renders a `+N more candidate(s)` line only when the lookup cut results. The retrieval conventions also list the research-folder divergence the code already had.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/retrieval/lookup-trigger-index.mjs` | Modified | `totalCandidates` in the answer; `N of TOTAL (truncated)` human line |
| `references/retrieval/retrieval-conventions.md` | Modified | Section 8 count sentence; section 9 `specs/**/research/**` row |
| `runtime/cli/tests/trigger-index.vitest.ts`, `retrieval-coverage-parity.vitest.ts` | Modified | Six new tests, one new assertion, third scoped divergence |
| `.skilled/commands/speckit/assets/search-presentation.txt` | Modified | `+<hidden> more candidate(s)` line, from the alignment critic |
| `feature-catalog/retrieval/trigger-lookup-total-candidates.md`, `feature-catalog.md` | Created, Modified | Catalog entry and index block |
| `manual-testing-playbook/retrieval/trigger-lookup-total-candidates.md`, `manual-testing-playbook.md` | Created, Modified | Conversational scenario 489 and its row |
| System-spec-kit `README.md`, retrieval `README.md`, root `README.md` | Modified | Describe the count and the truncated line |
| `changelog/v2.12.41.0.md`, `SKILL.md` | Created, Modified | Changelog and version 2.12.41.0 |
| `cli-external-orchestration/feature-catalog/feature-catalog.md` | Modified | Root description now matches its leaf, which cleared a CI-gated catalog failure already on main |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

In worktree 335 from `3378c36a06`. The full suite ran first as the baseline (4071 passed, 0 failed), then cli-devin DeepSeek wrote `benchmark/run.mjs` and the before run. Five cli-codex Luna xhigh workers made the code, test, conventions, catalog/scenario and README/changelog edits in parallel; the conductor ran the two test files (84/84). Devin ran the after benchmark and scenario 489 (PASS, `Left out: 1,934 matches.`). `/local-skilled-alignment` on the codex preset found 11 findings; seven fixes followed (four by codex, metadata repair, the cli node_modules folder, the evidence move), and the recheck closed with 0 still open and 0 new.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Print the total only when truncated | An untruncated run already shows every result, so its output stays byte-identical; the benchmark confirmed 0/6 changed |
| Add the `+N more` line in `/speckit:search` without touching its `STATUS=` line | The critic showed the main user-facing caller hid the new count; leaving the status line alone keeps every parser of it unchanged |
| Fix the cli-external-orchestration catalog description in this phase | It was a CI-gated P0 already on main, and the phase gate requires 0 open P0; the root line now matches the newer leaf |
| Compare benchmark runs by index sha256 only | The after run happens with the build uncommitted, so a git status count cannot match by design |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Retrieval test files | `trigger-index.vitest.ts`, `retrieval-coverage-parity.vitest.ts`: 84 passed |
| Full system-spec-kit suite | 4077 passed, 33 skipped, 0 failed, 333 files (baseline 4071 passed, 0 failed) |
| `npm --prefix runtime/cli run check` | Exit 0 |
| Catalog and playbook validators | `validate_catalog_package.py` exit 0 (all packages); `validate-playbook-package.cjs` exit 0 |
| Scenario 489 on devin | PASS 1/1 (`benchmark/scenario-489/matrix.md`) |
| `/local-skilled-alignment` recheck | resolved 7, still open 0, new 0, needs review 5 (all reviewed below) (`alignment/recheck.md`) |
| `validate.sh --strict` on this phase | RESULT: PASSED |
| Benchmark: truncated answers stating a total | 0/6 before, 6/6 after |
| Benchmark: untruncated output changed | 0/6 |
| Benchmark: median lookup time | 83.45 ms before, 78.22 ms after (-6.3%) |
| Benchmark: cold-lookup p95 over `prompt-set.json` | 109.4 ms before, 129.6 ms after (run noise; `measure-cold-lookup.mjs` 112.9 ms, within 200 ms) |

Needs-review findings, resolved by the conductor: E-1 fixed by the `+N more` line; E-2 closed by this closeout; E-4 evidence moved to `benchmark/scenario-489/`; B-1 check tightened and scenario rerun PASS; B-2 pre-existing per the critic, and fixed anyway as BAT-01. C-2 was refuted by the critic: release notes v4.0.2.0 are tagged. Probes P01 and P02 route to `command-doctor-helper` on main too; the critic did not uphold them.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Trigger-index prompts route to `command-doctor-helper`.** The advisor sends "limit a trigger-index search" to the doctor helper on main as well; this phase did not cause it. Name `system-spec-kit` or use `/speckit:search` until the advisor vocabulary covers it.
2. **`recheck.cjs` cannot resolve an additive literal fix.** It tests the old text before the new one, so a fix whose new text contains the old line stays open. Amendment: test `fix.new` first when it contains `fix.old` (`.skilled/commands/assets/local-skilled-alignment/recheck.cjs:90`).
<!-- /ANCHOR:limitations -->

---
