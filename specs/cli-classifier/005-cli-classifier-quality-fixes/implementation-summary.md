---
title: "Implementation Summary"
description: "Closed the eight required cli-classifier findings: five docs now pass the validator, the hub states the real transport default, clarify-default records the route that answered and two transport edge cases are guarded, with three new failing-first tests and no suite regression."
trigger_phrases:
  - "cli-classifier fixes summary"
  - "clarify-default transport fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/005-cli-classifier-quality-fixes"
    last_updated_at: "2026-10-04T14:13:19Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed the required findings, verified each test both ways and passed a Luna review"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-cli-classifier-quality-fixes"
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
| **Spec Folder** | 005-cli-classifier-quality-fixes |
| **Completed** | 2026-10-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every required finding from the cli-classifier quality research is closed. The five cli-jev docs that failed the blocking doc validator now pass it, the hub tells readers the transport tries Pi first, and a Pi answer in a clarify-default run is now recorded as Pi.

### Code fixes

`spawnClassifierCall` in `jev-transport.mjs` now defaults an omitted `env` to the process environment, so a caller using the documented minimal shape can reach Pi. `choiceRequestFrom` refuses a `choice` call with no question, matching the `noul` parser and the CLI's own contract. `score-clarify-default.cjs` writes `transport` on each call record, falling back to `jev` for the CLI-only retry path. Each fix carries one new test that fails without it.

### Optional fixes (amendment)

The hub `SKILL.md` keyword list carried bare `score` and `choice`. The advisor scores a one-word keyword at 0.7 when it appears in a prompt, so "Score this task brief for ambiguity" reached cli-classifier. The keywords now read `jev score` and `jev choice`. The brief prompt no longer routes here, four real Jev prompts still do, and the advisor's divergence ledger dropped the entry its ratchet test reported as resolved. The hub README now opens with the install, auth and status commands. The latest live injection screen run is checked in under `benchmark/reports/`, and the hub is released as `v0.8.0.0`.

### Doc fixes

The four cli-jev references and the question-shaping card gained an Overview section built from their existing intros, with the later sections renumbered and eight section citations updated. The hub `SKILL.md` and its Hermes copy, `shared/README.md`, the Pi transport test count and the 049 review-band line now match the code.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` and its test | Modified | Question guard and `env` default, two tests |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` and its test | Modified | `transport` on call records, one test |
| `.skilled/skills/cli-classifier/cli-jev/references/*.md`, `cli-jev/assets/question-shaping-card.md` | Modified | Overview sections |
| `cli-jev/feature-catalog/**`, `cli-jev/manual-testing-playbook/manual-testing-playbook.md` | Modified | Section citations after renumbering |
| `.skilled/skills/cli-classifier/SKILL.md`, `.hermes/skills/cli-classifier/SKILL.md`, `shared/README.md`, `benchmark/pi-transport/tests/README.md`, the 049 004 summary | Modified | Stale lines |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash at max thinking on cli-pi wrote the three code fixes, one brief each. The operator-chosen OpenCode Go provider refused with a workspace region error, so the briefs ran through Cline Pass on the operator's call. The orchestrator checked each diff, added a missing `'jev'` fallback to the exit-4 record, and reran each new test with its fix reverted to watch it fail. Luna reviewed the three changes read-only and found nothing. The orchestrator made the doc edits.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `backend: 'jev'` and add `transport` | Matches the other callers' records, so readers group by `transport` everywhere |
| Renumber the reference sections | The template puts the Overview first, and only eight citations pointed into the old numbers |
| Leave the optional findings open | Each needs an operator call or belongs to another skill |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py` on the five docs and `shared/README.md` | PASS: 0 issues each |
| New tests reverted against their fix | PASS: each fails without its fix (choice guard, env default, transport record) |
| Baseline suite set rerun | PASS: transport 96 to 98, clarify and leaf-route 57 to 58, every other count unchanged |
| Luna read-only review | PASS: no findings on any change |
| `ci-skill-root-metadata.cjs --skill cli-classifier` | PASS: checked=1 passed=1 |
| Advisor replay after the keyword change | PASS: the brief prompt returns no recommendation, four Jev prompts return cli-classifier |
| Compiled front door after the re-mint | PASS: three Jev prompts route to `cli-jev`, the brief and an off-topic prompt defer |
| `parent-skill-check.cjs .skilled/skills/cli-classifier` | PASS: all invariants, version 0.8.0.0 matches the newest changelog |
| Suite set after the amendment | PASS: every count equal to the run before it, advisor parity 54 of 54 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The injection screen report predates the probability-aware arm.** It shows the majority verdict only. A new live run would add the second verdict line.
2. **Luna could not run the suites.** Its read-only sandbox refused temporary files, so the suite evidence is the orchestrator's own run.
<!-- /ANCHOR:limitations -->

---


