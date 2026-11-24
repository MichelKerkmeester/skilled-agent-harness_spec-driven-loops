---
title: "Implementation Summary"
description: "The doctor scenarios now live in the playbook of the skill that owns the doctor."
trigger_phrases:
  - "playbook consolidation implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/008-own-all-doctor-commands/002-playbook-consolidation"
    last_updated_at: "2026-11-24T18:45:48Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Implemented and verified the phase"
    next_safe_action: "Operator review, then commit and merge"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-playbook-consolidation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-playbook-consolidation |
| **Completed** | 2026-11-24 |
| **Level** | 3 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The doctor scenarios now live in the playbook of the skill that owns the doctor. The 66 scenarios moved from `.skilled/manual-testing-playbook/` into `system-skilled-doctor/manual-testing-playbook/doctor-commands/`, the two root documents became one, and the folder outside every skill is gone.

### Phase 2: playbook-consolidation

`git mv` moved the category folder so each file keeps its history. The skill's root kept its own sections, then gained the doctor test environments (section 9), the doctor command index (section 10), one test cross-reference (section 11) and the source metadata (section 12). A resolver rewrote 312 links in the moved files that the deeper location broke and 12 inbound links from other skills' playbooks and catalogs. The fail-closed allowlist names the skill package where the central line was, and the spec-kit and sk-doc tests that pinned the old path follow the new one.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/manual-testing-playbook/doctor-commands/` | Moved | Now `.skilled/skills/system-skilled-doctor/manual-testing-playbook/doctor-commands/` |
| `.skilled/manual-testing-playbook/manual-testing-playbook.md` | Deleted | Merged into the skill's root |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/manual-testing-playbook.md` | Modified | One root for the whole package |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/routing/moved-command-contract.md` | Modified | Seventeen commands, not eleven |
| `.skilled/skills/system-skilled-doctor/{leaf-manifest,leaf-aliases}.json` | Modified | Regenerated for the new files |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` | Modified | Skill package in the central line's place |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/{durable-directory-manifest,baseline-readme-verdicts}.json` | Modified | New README path |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/{playbook-provenance-paths,workflow-invariance}.vitest.ts` | Modified | New scenario path |
| Seven skills' playbook roots, `sk-git` and `system-skill-advisor` and `system-spec-kit` feature catalogs | Modified | Links and wording |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The merged root was drafted in `scratch/` while Phase 1's tests ran, then copied in after the move. The final gate reran the validator, the spec-kit vitest, the README tests and a link resolver over every tracked Markdown file. The independent review confirmed one stale table in the category README that predates the move; it is reported, not fixed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| One package, one root | sk-doc's contract gives a package one root document; a second root would be read as a second package |
| Resolve links instead of rewriting a pattern | Links inside the folder and to the root still worked, so a blanket prefix would have broken them |
| Keep the validator's central-root support | It is a generic capability with its own test, and nothing here depends on removing it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Playbook validator | PASS, `package=system-skilled-doctor scenarios=79 categories=3 ... violations=0 warnings=13`; 53 packages pass and 4 FAIL or SKIP, the central package folded in, the same 4 as the baseline |
| Link resolver | PASS, `links into old folder: 0; broken links in skill playbook: 0` |
| spec-kit vitest | PASS, `1365 passed \| 11 skipped`, the same as the baseline |
| README parity test | PASS, `PARITY PASS: verdict diff is empty` |
| README manifest test | FAIL, three `sk-code/benchmark/reports/2026-11-23--*` folders; the primary checkout fails the same way |
| Validator regression test | Output identical to the primary checkout |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The category README's scope table is stale.** It leaves out DOC-407 to DOC-410, the four conversation companions; the central README had the same gap before the move.
2. **The README manifest test fails for an unrelated reason.** Three sk-code benchmark run folders from 2026-11-23 are missing from the frozen manifest; `test_readme_manifest.py --write` refreshes it.
<!-- /ANCHOR:limitations -->

---


