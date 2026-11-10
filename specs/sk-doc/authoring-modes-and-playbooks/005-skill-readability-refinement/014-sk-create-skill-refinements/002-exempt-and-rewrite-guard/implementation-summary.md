---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "exempt and rewrite guard implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/014-sk-create-skill-refinements/002-exempt-and-rewrite-guard"
    last_updated_at: "2026-11-05T10:53:14Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 002: acceptance criteria met with AC-001 superseded by ADR-003, checklist worked"
    next_safe_action: "Start phase 003 templates and fleet pass"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/shared/scripts/render_exempt.py"
      - ".skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json"
    session_dedup:
      fingerprint: "sha256:3d9b0c0f48163130876c87e253ab74c7b2f82cc8aa348fce46288414c193ba6e"
      session_id: "scaffold-002-exempt-and-rewrite-guard"
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
| **Spec Folder** | 002-exempt-and-rewrite-guard |
| **Completed** | 2026-11-05 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

One loader now decides which docs code depends on, and a shipped guard catches a form-only rewrite that changes what a doc says. Pinned docs keep their render checks but cannot be rewritten.

### Phase 2: exempt-and-rewrite-guard

`shared/scripts/render_exempt.py` replaces the three exempt readers and reads a new `pinned` list. An entry counts only when its doc exists and its consumer names the doc, with the folder too for a generic name such as `DESIGN.md`. The validator now checks an exempt doc but labels each finding with its consumer and refuses `--fix` on it. `shared/scripts/doc-rewrite-guard.py --base <ref> [paths]` hard-fails a rewrite that changes frontmatter beyond `version`, edits a fenced block, drops a citation, breaks a cited anchor or section, or touches an exempt or pinned doc, and reports lost lines and intro changes as advice.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/shared/scripts/render_exempt.py` | Created | One exempt and pinned loader, `--check` and `--scan-pinned` |
| `.skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py` | Created | Rewrite guard with hard and advisory checks |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modified | Style Reference skip moved to the ledger; exempt findings labelled; `--fix` refused on exempt docs |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | Modified | Its own exempt reader replaced by the loader |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json` | Modified | Two Style Reference entries, the contract snapshot's consumer, the `pinned` list, the description |
| `.skilled/skills/sk-doc/scripts/tests/` | Created and modified | Loader, validator-exempt, guard and replay tests |
| `sk-create-skill/references/skill/examples-and-maintenance.md`, `creation-workflow.md` | Modified | A guard step before commit |
| `.skilled/skills/sk-doc/shared/scripts/README.md` | Modified | The two scripts indexed |
| `specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/010-sk-prompt/scratch/tools/scope-gate.py` | Modified | Reads exemptions through the loader |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

DeepSeek V4.1 Flash on cli-pi built the loader, the validator change, the packager change, the pinned scan and the guard from one-change briefs in `scratch/briefs/`. The orchestrator wrote the ledger edits, `scope-gate.py`, the replay test and the workflow steps, read every diff, and fixed a line-number bug in the guard. An opus-medium review returned FIX and its findings were fixed with a regression test each, which a mutation run confirmed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| The five DESIGN.md format-spec files stay a validator skip (ADR-003) | No code reads them; the operator kept the consumer rule strict rather than allow a doc consumer |
| The contract snapshot's consumer is `review-mode-contract.yaml` | The generator takes the path from that contract and never names the file, so the contract is what names it |
| A generic doc name needs its folder named too | `DESIGN.md` or `SKILL.md` alone would let any copy qualify |
| An exempt doc is validated and its findings labelled, not skipped | A reader sees what would change and why it does not block |
| The guard compares a renamed doc with its old text | A rename is when a rewrite slips through unseen |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `python3 -m pytest -q .skilled/skills/sk-doc/scripts/tests/` | PASS: 399 passed |
| `run-script-tests.sh` and the sk-create-skill node suite | PASS: all passed; pass 108, fail 0 |
| `render_exempt.py --check` | PASS: 8 exempt, 2 pinned, 0 problems |
| Replay of `diff-1.patch` at `16e06ed2c6` | PASS: the rewritten `shared/parsing/README.md` line named; 7 hard, 154 advisory in 0.89 s |
| Pinned-doc edit | PASS: guard exit 1 with `pinned doc, pinned by ... check-rule-copies.js` |
| Strict loop | PASS: 13 of 13, matching the baseline; 55 of 55 with modes |
| `scope-gate.py` on the 55 066 leaves | PASS: each `render_warnings=0 invalid=0` |
| `node --test .skilled/bin/tests/compiled-route-*.test.cjs` | PASS: fail 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **`--scan-pinned` finds no candidate in this repository.** The code here builds Markdown paths with `path.join` and constants, so a literal-path scan cannot see what it reads. The pinned list stays the record; add an entry by hand when a check pins a doc's text.
<!-- /ANCHOR:limitations -->

---


