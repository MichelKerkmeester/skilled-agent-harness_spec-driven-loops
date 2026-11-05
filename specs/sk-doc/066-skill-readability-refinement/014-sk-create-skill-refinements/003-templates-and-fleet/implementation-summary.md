---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "templates and fleet implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/003-templates-and-fleet"
    last_updated_at: "2026-11-05T13:06:19Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 003 with review PASS"
    next_safe_action: "Validate 066 and check the goal criteria"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py"
      - ".skilled/skills/sk-doc/shared/scripts/validate_document.py"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py"
      - ".skilled/skills/sk-doc/shared/assets/template-rules.json"
    session_dedup:
      fingerprint: "sha256:1a0013919b63b74dacd3bafa5b5a5cd3fb131ad9519207335ac783e7484435ba"
      session_id: "scaffold-003-templates-and-fleet"
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
| **Spec Folder** | 003-templates-and-fleet |
| **Completed** | 2026-11-05 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

`package_skill.py --check --strict` now fails on any render finding it scans, README.md included, because no render code or scope is held advisory any more. A skill built from the sk-create-skill templates starts render-clean, and all 13 skills pass strict packaging with 0 advisories.

### Phase 3: templates-and-fleet

The templates stopped teaching the shapes the render checks flag. Reference and asset templates open OVERVIEW with Purpose, intros are hooks, READMEs open with OVERVIEW, a SKILL.md ends with one REFERENCES AND RELATED RESOURCES section, and one Size Limits table matches the packager. The fleet pass then fixed every staged finding in the 13 skills in form only, one commit per skill, and the last commit retired the staging.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-doc/sk-create-skill/assets/skill/*.md`, `assets/parent-skill/parent-skill-readme-template.md` | Modified | Templates that pass their own render checks (83fe581ff0) |
| `sk-doc/shared/scripts/validate_document.py` | Modified | The README inventory check reads a WHAT IS IN THE PACKAGE or STRUCTURE section, its prose and its tree, and nothing outside it |
| `sk-doc/sk-create-skill/scripts/package_skill.py` | Modified | Empty staged sets, README.md in the render scan, RELATED RESOURCES no longer recommended apart |
| `sk-doc/shared/assets/template-rules.json` | Modified | Render checks on for the readme type |
| `sk-doc/sk-create-skill/scripts/init_skill.py` | Modified | The generated hub ROUTER.md opens with `## 1. OVERVIEW` |
| READMEs, references and assets in 13 skills | Modified | Form-only fleet pass, f81581e246 to d3e9fbdefc |
| `sk-doc/scripts/tests/*`, `sk-create-skill/scripts/tests/*` | Modified/Created | Size table test, inventory fixtures, fixtures that are render-clean, staging tests that set their own staged sets |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Templates first, then one commit per skill, then the switch. Each skill pass listed its staged findings with `RENDER_STAGED_OFF=1`, fixed them (DeepSeek V4.1 Flash on cli-pi drafted intros and OVERVIEW openings, every diff read and hand-corrected), ran `doc-rewrite-guard.py` against the commit parent and committed with a changelog, version bump and Hermes sync. The switch landed last, in 45af20eb71, so leaf gates stayed green between skill commits. Nothing is pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| READMEs open with OVERVIEW (ADR-002) | The operator chose it, so README rules match sk-create-readme with no exception |
| The README render switch lands after the last fold | Turning it on first failed 52 leaves and the parity test between skill commits |
| The pinned `code-quality-standards.md` gets an intro-only edit | The operator allowed it, and `check-rule-copies.js` still exits 0 |
| Guard hard findings are mapped, not blocking (ADR-003) | Five are basename false positives and one is the approved pinned edit, the same rule the operator set for the templates |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `run-script-tests.sh` | PASS: `all sk-doc script tests passed` |
| `pytest scripts/tests/` | PASS: 402 passed |
| sk-create-skill node tests | PASS: pass 108, fail 0 |
| `compiled-route-*.test.cjs` | PASS: pass 101, fail 0 |
| 13-skill `--check --strict` | PASS: 13 of 13 exit 0, 0 `render advisory:` lines |
| 55 leaf scope gates | PASS: every leaf `render_warnings=0 invalid=0` |
| Staged sets and debt | `() ()` and `{}` |
| T026 opus-medium review of 273224bbed..45af20eb71 | PASS: 0 P0 or P1, 3 P2 fixed in 8a3d2e24e3 (inventory search scoped to its section with a new negative fixture, a restored `SKILL.md` §3-§5 cite, an Oxford comma removed) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The guard matches cited files by basename.** A citation of another folder's `README.md` reads as a citation of the edited one. Read the citing line before acting on a `cited-section` finding. Resolving the path against the citing file's folder is a follow-up.
2. **Three scaffolds keep REFERENCES mid-file.** `hub-skill-scaffold.md`, `packet-skill-scaffold.md` and `parent-skill-hub-template.md` still place `## 5. REFERENCES` before later sections, and the core-standards fix template is unchanged. Both are logged follow-ups.
<!-- /ANCHOR:limitations -->

---


