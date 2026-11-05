---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "render checks and gate implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/001-render-checks-and-gate"
    last_updated_at: "2026-11-05T09:20:47Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 001: all 16 acceptance criteria met, checklist worked, packet validated"
    next_safe_action: "Start phase 002: one exempt loader, the pinned list and doc-rewrite-guard.py"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/shared/scripts/validate_document.py"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/tests/render-known-debt-ratchet.test.cjs"
      - ".github/workflows/sk-doc-script-tests.yml"
    session_dedup:
      fingerprint: "sha256:a66a53b9b7b1ab41f95e9b453e0e125ef6fd9bb756ac89ade37c0552d3304d9f"
      session_id: "scaffold-001-render-checks-and-gate"
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
| **Spec Folder** | 001-render-checks-and-gate |
| **Completed** | 2026-11-05 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The validator now catches the layout defects the 066 pass found by hand, and the packaging gate reads every doc a skill hands a reader. New codes and newly scanned files report as `render advisory:` until phase 003 clears the fleet, so all 13 skills and 42 modes still package under `--strict`.

### Phase 1: render-checks-and-gate

`validate_document.py` gains `render_overview_subsections`, `render_section_reference`, `render_intro_missing`, `render_intro_pointer`, `render_intro_sentence_restates` and `render_h2_sequence`, and four check defects are fixed. `package_skill.py` scans `SKILL.md`, `ROUTER.md`, `shared/references` and `runtime/references`, stages the new codes and scopes, fails strict on a stale debt entry and skips fenced headings. A ratchet test and a CI job keep the ledger and the staged sets from growing, and the sk-create-skill docs name one gate.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modified | Six render checks and four defect fixes |
| `.skilled/skills/sk-doc/shared/assets/template-rules.json` | Modified | `overviewSubsections` for reference and asset |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | Modified | Wider scan, staged sets, `RENDER_STAGED_OFF`, stale-debt marker, fence-aware section scan |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/render-known-debt-ratchet.test.cjs` and `fixtures/render-known-debt-frozen.json` | Created | Ledger and staged-set ratchet |
| `.skilled/skills/sk-doc/scripts/tests/` (three test files, 21 fixtures) | Modified and created | Coverage for every new check and staging branch |
| `.github/workflows/sk-doc-script-tests.yml` | Modified | `render-gate` job: ratchet plus a strict sweep of every skill and mode |
| `sk-create-skill/SKILL.md`, `README.md`, `references/skill/creation-workflow.md`, `references/shared/common-pitfalls.md` | Modified | One strict gate command, `\##` escapes retired |
| `specs/sk-doc/066-skill-readability-refinement/010-sk-prompt/scratch/tools/scope-gate.py` | Modified | Counts staged codes apart so the 066 leaf gate matches the new codes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Each task went to DeepSeek V4.1 Flash on cli-pi as a one-change brief (`scratch/briefs/`, `scratch/dispatch.sh`). The orchestrator read every diff, ran the suites and a fleet scan of 7,791 docs, and tightened two checks by hand where the scan showed prose false positives. An opus-medium review of the whole diff returned FIX, its findings were fixed, and the work landed as `dcd1466eb0`, with the manifest remint and Hermes sync in `cfdb82039d`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| New codes and scopes stay advisory in staged sets (ADR-001) | The fleet carries 325 such findings across the 066 leaves; enforcing them now would turn every gate red before phase 003 can fix them |
| A cited title counts only when it names a real section, and a bare number is checked only against a named file | The first fleet scan raised 61 hits, almost all prose words or numbers citing another document; the narrowed rule leaves 1 |
| `render_intro_missing` fires only when a heading follows the H1 | A callout, list, table or fence there is an intro in another shape; the first rule raised 14 hits, mostly callouts |
| The related-resources section is a heading opening with `related` and carrying no colon topic | It keeps RELATED COMMANDS enforced while UNRELATED CHANGES and RELATED SPECS: UPDATE VS CREATE stop matching |
| `render_h2_sequence` sits beside `non_sequential_numbering` | Packaging reads only render codes, so the existing warning never reached the gate |
| `scope-gate.py` stages codes but not scopes | Ignoring the staged scopes would weaken the 066 criterion that already holds |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` | PASS: `all sk-doc script tests passed`; pytest 338 passed |
| `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/*.test.cjs` | PASS: pass 108, fail 0 |
| Strict packaging of 13 skills and 42 modes | PASS: 55 `Result: PASS`, exit 0; `RENDER_STAGED_OFF=1` fails system-deep-loop |
| `scope-gate.py` on all 55 066 leaves | PASS: each `render_warnings=0 invalid=0`, 325 advisory |
| `node --test .skilled/bin/tests/compiled-route-*.test.cjs` after the remint | PASS: pass 101, fail 0 |
| Ratchet negative control | PASS: a debt entry added to the live ledger failed with `sk-git is a new debt key` |
| `render-known-debt.json` `debt` | `{}` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The new checks only advise until phase 003.** A staged code or a finding in a staged scope never fails `--strict`. Run with `RENDER_STAGED_OFF=1` to see what a skill must fix before the staged sets are emptied.
<!-- /ANCHOR:limitations -->

---


