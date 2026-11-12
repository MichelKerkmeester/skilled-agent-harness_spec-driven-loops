---
title: "Implementation Summary"
description: "Two research lineages found that the wait after a push is set by the slowest workflow. Three changes to how checks are arranged shorten it, and almost no test is worth deleting."
trigger_phrases:
  - "test and ci bloat research implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research"
    last_updated_at: "2026-11-12T07:29:40Z"
    last_updated_by: "claude-fable-5-2"
    recent_action: "Deep research complete: two ten-iteration lineages merged and verified into research/research.md"
    next_safe_action: "Operator picks which ranked cuts to build"
    blockers: []
    key_files: ["research/research.md", "spec.md"]
    session_dedup:
      fingerprint: "sha256:102ac9c0ecaf261a6dcc9fc20160d7eb2d8b2e7cfe781fa88f22027a3f523970"
      session_id: "af05cd33-test-and-ci-bloat-research"
      parent_session_id: null
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-test-and-ci-bloat-research |
| **Completed** | 2026-11-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The research is done and it changed no test, workflow or hook. It found that the wait after a push equals the slowest workflow that push triggers, so the cuts worth building are the ones that shorten `Spec-Kit Check` and `sk-doc Script Tests`.

### Phase 7: test-and-ci-bloat-research

You get a ranked list of eight changes in `research/research.md`, each with its path, its label, the wait it saves and the regression it would stop catching. Three of them shorten the wait: running the three sequential `Spec-Kit Check` suites as parallel jobs, path-filtering most of `sk-doc Script Tests`, and rolling out the sparse checkout that one workflow already uses.

You also get the directions that are not worth your time. The git hooks cost one to three seconds. The test files under `specs/` never run. The test files that share a name are not duplicates. Deleting the workflows that repeat a local hook saves runner minutes and no waiting.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | The merged, verified synthesis with the ranked recommendations |
| `research/lineages/opencode-go/` | Created | Ten iterations, state and a lineage synthesis from cli-opencode |
| `research/lineages/pi-llmgateway/` | Created | Ten iterations, state and a lineage synthesis from cli-pi |
| `research/resource-map.md` | Created | The files both lineages read |
| `spec.md` | Modified | The generated findings block under Open Questions |
| `../spec.md` | Modified | The phase 7 rows in the parent phase map |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

`fanout-run.cjs` ran both lineages at forced depth and exited 0 with two lineages succeeded and none failed. `fanout-merge.cjs` merged the two registries. The orchestrator then read both lineage syntheses, checked their main claims by command and wrote `research/research.md`. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Rank the cuts by wait saved, not by summed workflow seconds | Workflows run in parallel. On six pushes the wait was a quarter to a third of the summed run time, so a sum overstates what a cut gives the operator |
| Keep the workflows that repeat a local hook | The lineages disagreed. The workflows never set the wait, so deleting them saves nothing the operator feels and removes the only check for a commit made without hooks |
| Correct the claim that `main` has no required checks | `gh api` shows a ruleset that requires the message-contract status check |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `ls research/lineages/*/iterations/iteration-*.md \| wc -l` | 20 |
| `fanout-run.cjs` summary | `succeeded: 2`, `failed: 0` |
| `fanout-merge.cjs` | `status: ok`, `merged_lineages: 2` |
| Claims checked by command | 7 confirmed, 1 corrected, 3 left as inferred. See `research/research.md` section 9 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The wait savings are estimates.** They are built from measured step times, and no change was trialled. Build rank 1 first and read the next run's wall clock.
2. **Local test runs were not measured.** Neither lineage timed `npm test`. The earlier phases of this packet hold the last local numbers.
3. **Both lineages ran the same model.** They differ in executor and provider only, so a shared blind spot is possible. The orchestrator's checks cover the main claims and not every finding.
<!-- /ANCHOR:limitations -->

---


