---
title: "Implementation Summary"
description: "Pull requests now fail on a feature-catalog package failure or on a citation they newly break, while 221 older broken citations only report."
trigger_phrases:
  - "ci truth checks implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/006-ci-truth-checks"
    last_updated_at: "2026-10-11T18:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Built and verified the catalog and citation CI jobs"
    next_safe_action: "Integrate the branch; the orchestrator reconciles the 011 parent counts"
    blockers: []
    key_files:
      - ".github/workflows/sk-doc-script-tests.yml"
      - ".skilled/skills/sk-doc/shared/scripts/cite-drift-gate.mjs"
      - ".skilled/skills/sk-doc/scripts/tests/test-cite-drift-gate.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-ci-truth-checks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-ci-truth-checks |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A pull request that breaks a feature-catalog package, or adds or changes a citation that no longer resolves, now fails CI. The 221 broken citations already in the skill docs print as one count and block nothing.

### Phase 6: ci-truth-checks

The sk-doc script-tests workflow gains two jobs. `catalog-packages` runs the catalog validator over all 29 packages and then the validator's fixture test, which the shared runner never reached because it globs only its own folder. `citation-drift` runs the gate's unit test, then the gate. On a pull request the gate compares the head with the merge base and exits 1 only for a broken citation the base lacks. On a push it prints the total and exits 0.

The gate keys a citation by its citing file plus its cited target, so a citation that only moved down its file is not new. It reuses the scanner's resolver unchanged and skips symlinked docs, as the scanner does by reading committed blobs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/sk-doc-script-tests.yml` | Modified | Adds the `catalog-packages` and `citation-drift` jobs |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-gate.mjs` | Created | Head-versus-base comparison of broken citations |
| `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-gate.mjs` | Created | Five node:test cases for the gate |
| `.skilled/skills/sk-doc/changelog/v2.3.4.0.md` and six hub version fields | Created, Modified | sk-doc 2.3.3.0 to 2.3.4.0 |
| `.skilled/changelog/skilled/v4.0.0.4.md` | Modified | One release-note item |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Five cli-pi dispatches to DeepSeek V4.1 Flash at max effort on DevPass wrote every product file: the gate and test, the workflow jobs, the version bump, the release note, and a follow-up fix. Each diff was read before the next step. No product file was edited by hand.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A wrapper script, not a scanner flag | The scanner's exit contract is report-only, and its census does not list unresolved citations one by one |
| The workflow computes `git merge-base "$BASE_SHA" HEAD` | The pull-request checkout is GitHub's merge commit, so the merge base of it and the base tip is the base tip itself |
| Docs are read from the worktree, symlinks skipped | Reading the worktree lets the base side scan a plain detached checkout; skipping symlinks matches the scanner, whose blob read sees only a link path |
| No trigger-path change | The workflow has no `paths` filter, so it already runs on every pull request and push to main and `skilled/**` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test` on the gate test | PASS, 5 of 5. With the gate absent the file fails to load. Mutants fail their tests: no comparison fails 2, no baseline fails 2, a line-keyed citation fails 1, following symlinks fails 1 |
| Catalog step and fixture test | PASS, 29 packages, exit 0; fixture test 22 PASS, `ALL PASS` |
| Simulated pull requests in a shared clone, running the workflow step body | New broken citation: exit 1, `BLOCKED: 1`. Prose only: exit 0. Moved existing citation: exit 0. Push: report only, exit 0 |
| `actionlint` on the workflow | No output, exit 0 |
| Full sk-doc script runner | 32 PASS before and after |
| Release note | `hvr_scan.py` 0 hard blockers; `validate_document.py` 0 issues |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The base checkout costs about 35 seconds locally.** `git worktree add` writes the whole tree. CI pays the same once per pull request.
2. **The older count stays at 221 until R4 and R7 land.** Once it reaches 0, the base comparison can go and every broken citation can block.
<!-- /ANCHOR:limitations -->

---
