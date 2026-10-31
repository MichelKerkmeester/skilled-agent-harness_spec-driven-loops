---
title: "Implementation Summary: Phase 44: deem-answer-shape-fix"
description: "cli-deem now reads the noul and score answers the local Deem server sends, and 027's and 026's scorers read judgment output where real cli-deem and jev print it, so their Deem and Jev arms can measure."
trigger_phrases:
  - "deem answer shape fix implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/044-deem-answer-shape-fix"
    last_updated_at: "2026-10-02T06:02:32Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Closed the phase after one cross-family review"
    next_safe_action: "None for this phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-044-deem-answer-shape-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 044-deem-answer-shape-fix |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`cli-deem` now gets a number from the local Deem server for every `noul` and `score` question, and 027's and 026's model arms read that number where the real tools print it. Before this phase no real `noul` or `score` call could be measured, and every suite still passed.

### Phase 44: deem-answer-shape-fix

The local server answers `noul` as `{"noul": <number>}` and `score` with a float `score`, a `legend` and index-keyed `probabilities`. The client read `value` and a `level` label, so every real call exited 1. It now range-checks both and passes them through, takes a batch score's levels from `criteria` before `levels`, and still maps `choice` text to the submitted key.

Real `cli-deem` and `jev` print the `answers.answer` envelope. 027's stop rater read `score` above it in both arms, and 026's Deem arm read `noul` above it. Both now read `answers.answer`, and 027's Jev arm rounds a float score where it took only an integer.

Each suite's stub had printed the shape its own code expected. The stubs now print what the real tools print, and an old-shape answer exits 1 or stays unmeasured.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs` | Modified | `translateAnswer` passes `noul` and `score` through after a range check |
| `.skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs` | Modified | Real-shape fake answers, old-shape and `criteria` cases |
| `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` | Modified | Both arms read `answers.answer`, the Jev arm rounds a float |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts` | Modified | Envelope stubs, an old-shape case and a float case |
| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` | Modified | `parseNoul` reads `answers.answer` |
| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts` | Modified | Envelope stub and an old-shape case |
| `.skilled/skills/cli-classifier/cli-deem/` docs | Modified | README, SKILL.md 0.1.2.0, wire contract, catalog, playbook, changelog v0.1.2.0 |
| `.hermes/skills/cli-deem/SKILL.md` and cli-classifier's activation manifest | Modified | Synced and re-minted after the SKILL.md change |
| `../043-label-finding-fixes/goal.md` and `implementation-summary.md` | Modified | The recorded cause now names the client |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The session traced the cause with two direct calls to the local server and a sweep of every scorer's parser, then sent Luna 6 max the client and SWE 2 max the two scorers in parallel, and SWE the docs after. It ran each suite from the changed state, ran the fixed client against the local server and committed each fix alone: `006994d12a`, `7180ff06b4`, `1882e3f868` and `ec3d3c1e7f`. It made two small changes itself, both logged in `goal.md`: the float rounding in 027's Jev arm, and the review's `criteria` bound.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The real tools are the contract, with no fallback to the old shapes | A fallback would keep a path no real tool exercises |
| Scorers that already read `answers.answer` stay unchanged | The parser sweep and the review both found them correct |
| A batch score's bound reads `criteria` first | The installed server reads `criteria` first and treats `levels` as an alias |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| cli-deem suite | PASS, 39 tests (34 before), 0 failing |
| 027 and 026 suites | PASS, 61 (59 before) and 24 (23 before), 0 failing |
| Local server | `health`, `noul`, `choice`, `score`, both `--value` forms and a `criteria` batch each exit 0 |
| Docs | `validate_document.py` exits 0 on every changed doc, Hermes sync PASS 72, manifest `compiled-serving` |
| Review | DeepSeek V4.1 Flash: 1 P1 fixed in `ec3d3c1e7f`, 3 P2 recorded |
| Closure gates | PASS: `validate.sh --strict --recursive` `RESULT: PASSED` with 0 errors and 0 warnings on all 45 folders, and `check-goal.cjs` 5/5 on each |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No scorer has measured a real Deem or Jev answer yet.** A run with `--deem` or `--jev` needs the operator's yes.
2. **The recorded P2s stay open.** The wire contract and README still say Deem answers `criteria` with HTTP 400, DEE-006's fake answer carries `temperature`, and a `score` with 1 or 11 levels exits 1 where a usage exit 2 fits.
<!-- /ANCHOR:limitations -->

---


