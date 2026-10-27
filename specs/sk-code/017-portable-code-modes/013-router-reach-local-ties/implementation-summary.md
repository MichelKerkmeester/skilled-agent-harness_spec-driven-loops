---
title: "Implementation Summary"
description: "The router reach check now judges the shipped fleet, so a private surface linked into one checkout no longer fails it, and a private tie is reported as a note that never names the surface."
trigger_phrases:
  - "router reach local ties implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/013-router-reach-local-ties"
    last_updated_at: "2026-10-27T23:30:00Z"
    last_updated_by: "implementer"
    recent_action: "Made the reach check judge the shipped fleet and proved it from the main checkout"
    next_safe_action: "Conductor adds the child to the parent phase table and commits"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-router-vocabulary-reach.test.cjs"
      - ".skilled/commands/doctor/assets/doctor-router-reach.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "router-reach-local-ties-implementer"
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
| **Spec Folder** | 013-router-reach-local-ties |
| **Status** | Complete |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/doctor:skill-advisor router-reach` now gives the same verdict on the main checkout as in CI. The run that printed `RESULT: FAILED` with two outranked rows prints `RESULT: PASSED` at the same advisor generation, and the two phrases a private surface takes on that machine show as notes.

### Router reach check scores the shipped fleet and notes operator-local ties

The check drops every private-surface recommendation before it judges the declaring hub, so hit, presence and the reported winner all come from the shipped fleet. A private surface ranked ahead of the shipped leader becomes an `operator-local` note with its confidence and no name. A shipped hub that beats the declaring hub still fails the phrase, wherever the private surface sits. The old outranked rows also printed the private surface's name, and that is gone too.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` | Modified | Shipped-fleet ranking, the `operator-local` note and one non-failing set |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-router-vocabulary-reach.test.cjs` | Created | Four stand-in advisor cases |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md` | Modified | Row for the new test |
| `.skilled/commands/doctor/assets/doctor-router-reach.yaml` | Modified | The new row kind and how to report it |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-skill-advisor-router-reach.md` | Modified | The new row kind in the signals and the pass and fail rules |
| `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.5.11.0.md`, `.skilled/skills/system-skill-advisor/changelog/v0.17.13.0.md` | Created | Changelog entries |
| `.skilled/skills/sk-doc/sk-create-skill/SKILL.md`, `.skilled/skills/system-skill-advisor/SKILL.md` | Modified | Version carriers |
| `.hermes/skills/sk-create-skill/SKILL.md`, `.hermes/skills/system-skill-advisor/SKILL.md` | Regenerated | Hermes mirrors |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The failure was reproduced from the main checkout first, then attributed with the advisor's lane breakdown, and the worktree advisor (no private links) confirmed the shipped hubs score the same there. The new test was run against the `HEAD` copy of the check, where it failed, and against the change, where it passed. The proof run used the changed script from the worktree with `ROUTER_REACH_ADVISOR` pointed at the main checkout's advisor, so it read the private links the main daemon indexes. The advisor vitest suite ran before and after with the same counts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Judge the shipped fleet instead of adding vocabulary (ADR-001) | Both phrases are already declared. The tie comes from the private surface's generic one-word keywords, which the tracked tree cannot change, and a scorer anchor would override a private surface that really owns a phrase |
| Never print the private surface's name | A private folder name must not reach a screen or a log, so the note carries only its confidence |
| Identify private surfaces by the private-skill prefix | Every advisor reader uses that prefix for a followable link, and `.gitignore` keeps every such entry out of the tracked tree |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reach check from the main checkout, unchanged script | FAIL as expected: `outranked` on "browser agent" and "css extraction", `RESULT: FAILED`, exit 1, generation 1779 |
| Reach check from the main checkout, changed script | PASS: `outranked=0`, `operator-local=2`, `probe-error=0`, `RESULT: PASSED`, exit 0, generation 1779 |
| Reach check in the worktree, changed script | PASS: `operator-local=0`, `probe-error=0`, `RESULT: PASSED`, exit 0 |
| `ci-router-vocabulary-reach.test.cjs` | FAIL on the `HEAD` check (exit 1), PASS on the change (exit 0) |
| Advisor vitest suite | PASS before and after: 153 files, 1301 passed, 8 skipped, exit 0 |
| Advisor Python tests | PASS: `pass=87, fail=0` |
| Doctor phrase probe | PASS: `STATUS=OK phrases=118 bridges=22` in both checkouts |
| sk-create-skill script tests, leaf and derived freshness, parent-skill check | PASS: 19 of 19 tests exit 0, `fresh=14`, all hard invariants passed |
| Quality gate and comment hygiene on the two code files | PASS: `NO_BLOCKER_FOUND`, hygiene exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The bare phrases still miss on that machine.** Typing only "browser agent" or "css extraction" on the main checkout ranks the private surface first. Longer prompts route to the shipped hub. The fix belongs to the private surface's keywords, or to the explicit-lane follow-up recorded in ADR-001.
2. **Two live runs printed probe errors mid-rebuild.** One main-checkout run and one worktree run hit an advisor that was regenerating. Both were rerun clean, and the clean runs are the evidence above.
<!-- /ANCHOR:limitations -->

---
