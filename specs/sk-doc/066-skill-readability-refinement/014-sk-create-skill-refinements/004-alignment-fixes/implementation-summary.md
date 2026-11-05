---
title: "Implementation Summary"
description: "The readability program's alignment run found two failing doctor suites, a router callout the validator lost, a rewrite guard that matched citations by bare name and stale doc text. All upheld findings are fixed and the recheck reports no new row."
trigger_phrases:
  - "alignment fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/004-alignment-fixes"
    last_updated_at: "2026-11-05T17:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed the upheld alignment findings, committed per skill and rechecked the run"
    next_safe_action: "Operator decides on push or merge of the worktree branch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:79918c4b20b3025be849e48ec0f0f3d5468be50896f97d390258220ee973cd5b"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-alignment-fixes |
| **Completed** | 2026-11-05 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The doctor test suites pass again, section citations are checked in every live doc type, the alignment command checks the checkout it runs in, `/doctor:sk-skill` produces references that clear the strict render check, and the rewrite guard reports only citations of the file that actually changed. The routers send rewrite-guard and render-ledger prompts to sk-create-skill, and the docs the run flagged state the current counts, sections and paths.

### Phase 4: alignment-fixes

You can now run the rewrite guard on a rewrite that touches a common file name such as `validation.md` without a finding for another skill's doc of that name. A citation that moved with its renumbered section passes, while one left pointing at the old number still fails. `validate_document.py` reads `§` citations whose file is written as a code span or a link, so those citations are checked too.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/lib/sk-skill-convert-transforms.cjs` | Modified | Description names up to three sections instead of quoting the intro |
| `.skilled/commands/doctor/scripts/tests/*.test.cjs`, `fixtures/sk-skill-convert/source-render-debt.json` | Modified, Created | Fixture routers open with OVERVIEW; the convert test reads a fixture ledger |
| `.skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py`, `validate_document.py` | Modified | Citation resolution |
| `.skilled/skills/sk-doc/scripts/tests/test_doc_rewrite_guard.py`, `test_render_checks.py`, `render/reference-section-reference-linked.md` | Modified, Created | Five new tests and one fixture |
| `.skilled/skills/sk-doc/ROUTER.md`, `hub-router.json`, `graph-metadata.json`, `sk-create-skill/ROUTER.md`, `.skilled/skills/mcp-tooling/ROUTER.md` | Modified | Callout placement and routing vocabulary |
| `sk-create-skill/references/shared/validation-and-packaging.md`, `render-known-debt.json`, `shared/scripts/README.md` | Modified | Sixteen render checks and the render ledger documented |
| cli-orca, cli-jev, sk-create-agent, human-voice scripts, style-reference and sk-doc READMEs; eleven sk-code-skilled scenarios; `javascript-checklist.md` | Modified | Stale paths, counts and section numbers |
| `.skilled/changelog/skilled/v4.0.1.0.md`, `README.md` | Modified | Render-check count, exempt wording, skill list |
| Six `changelog/v*.md` files and hub version fields | Created, Modified | One release per changed skill |
| `.skilled/skills/sk-doc/shared/assets/template-rules.json`, `feature-catalog/feature-catalog.md`, `document-validation/render-checks.md`, `render-ledger-and-rewrite-guard.md`, `changelog/v2.9.3.0.md` | Modified, Created | Citation check in every type; catalog entries |
| `.skilled/commands/assets/local-skilled-alignment/alignment-lib.cjs`, `tests/alignment-lib.test.cjs` | Modified, Created | Repo root from the working checkout (operator-local, not committed) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each finding was fixed at its producer, then the sk-doc suites, the leaf loop, the strict sweep, package validation of 13 skills, doctor run-all and README parity ran from the final state. Each skill was committed on its own, 810a75b3aa to eb91879758, with the Hermes router mirrors synced in 9dc28d279a. The second pass, for the items first left unfixed, is 6b1d281efb plus the operator-local repo-root change. The alignment recheck and probe replay of run `20261105T151115Z` ran last. Nothing was pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bump only the hub version per skill | The earlier fix commits on this branch did the same, so one changelog per hub records the release |
| Run the citation check for every type, but not for changelog and spec | A missing section misleads the reader of any live doc, while a changelog or spec records what was true when written |
| Fix B-04, A-4 and the repo root after the first pass | The operator asked for every unfixed item; feature catalogs had been held back as outside the form-only scope |
| Take the alignment root from the working checkout only when it carries the command | A run started in an unrelated repository still checks the checkout beside the scripts |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| pytest `sk-doc/scripts/tests/` | PASS, 409 passed |
| `node --test` sk-create-skill and compiled-route suites | PASS, 108/0 and 101/0 |
| Strict sweep | PASS, 55 `Result: PASS`, 0 `::error::` |
| `validate_skill_package.py`, 13 skills | PASS, 0 FAIL each |
| Doctor run-all | PASS, 7 suites |
| README verdict parity | PASS, verdict diff is empty |
| `render_exempt.py --check` | PASS, 8 exempt, 2 pinned, 0 problems |
| Router reach, sk-doc and mcp-tooling | PASS, `outranked=0` |
| `sync-skills-hermes.cjs --check` | PASS, 66 copies in sync |
| Alignment recheck | First `resolved=8 still_open=6 new=0`; after the repo-root fix, with plain `node`, `resolved=12 still_open=2 new=0 needs_review=20`; both open rows are artifacts and every needs-review fix is present by grep |
| Feature catalogs, strict | PASS, 27 packages, 0 FAIL |
| Alignment command tests | PASS, 42/42 (39 before, plus 3 for the root) |
| Probe replay | PASS, 18/18 |
| Rewrite guard `--base 0e88ba257b` | 4 HARD, all the intended router-map fence edits; 24 advisory |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The repo-root fix is not in git.** `alignment-lib.cjs` and its test live in the operator-local, gitignored `.skilled/commands/assets/local-skilled-alignment/` of the main checkout. A copy of the folder from before the change is in the session scratchpad at `lsa-backup/`.
2. **The citation check cannot see a wrong but existing section.** It reports a section number the target lacks or a cited title that does not match, not a citation to the wrong section whose description sits in another table cell.
<!-- /ANCHOR:limitations -->

---
