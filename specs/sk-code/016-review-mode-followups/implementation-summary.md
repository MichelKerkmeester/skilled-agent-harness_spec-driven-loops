---
title: "Implementation Summary"
description: "A path-only workflow review now keeps the review mode, a review report can no longer contradict itself, and the first live finding-accuracy run is on record."
trigger_phrases:
  - "review mode followups implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/016-review-mode-followups"
    last_updated_at: "2026-10-27T09:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped the six review-mode follow-ups and aligned the review agent"
    next_safe_action: "Orchestrator lands the lane commits"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/hub-router.json"
      - ".skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js"
      - ".skilled/skills/sk-code/sk-code-review/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "lane-d-review-mode-followups"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the clean-control false positive change the mode or the scenario gold?"
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
| **Spec Folder** | 016-review-mode-followups |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A review of only a workflow file path now gets the review mode and the CI standards, not the CI surface alone. A review report whose summary and status line disagree now fails its checker, and the mode has its first live measurement of whether it finds real defects.

### sk-code-review follow-ups

The CI vocabulary carried the workflows path twice, so a path prompt scored the CI surface 8 against the review mode's 4, past the ambiguity delta of 1. With the path counted once both score 4 and bundle. The review mode also gained a `Quality gate evidence` header line, a cache key that works without an `origin` remote and per-package with a pathspec, a written contract for user-authored modes, repository-neutral examples and four playbook scenarios.

Agents and commands checked against the mode:
- `.skilled/agents/review.md`: changed. A Summary agreement paragraph states the quality-evidence line and the Overall assessment rule. Its `.claude` copy took the same paragraph by hand (no generator exists), and the codex, pi and hermes copies were regenerated. `.opencode` and `.hermes/agents` are hard links and followed.
- `.skilled/agents/deep-review.md`: no change. It loads only `references/review-core.md`, which this packet did not touch.
- `/deep:review` command and its assets: no change. They reference the `CODE-REVIEW` marker and review-core doctrine, both unchanged, so no contract recompile was needed.
- `/doctor:sk-code`: no change. It holds no review-mode reference.
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs`: no change. Its one match is a comment example, and it passes on the hub.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/hub-router.json`, `ROUTER.md` | Modified | Drop the duplicate path keyword, raise versions |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its archived twin | Modified | Refreshed activation |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modified | Re-exported graph |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Modified | Path-only workflow review test |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js` | Modified | Overall assessment comparison |
| `.skilled/skills/sk-code/sk-code-review/scripts/review-output-fixture/`, `scripts/tests/check-rule-copies.test.sh`, `scripts/README.md` | Created/Modified | Contradictory fixture, header line, tests, packet-relative commands |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md`, `README.md`, `references/pr-state-dedup.md` | Modified | Header line, cache key, user modes, neutral paths |
| `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/` | Created/Modified | CR-025 to CR-028 and the root index |
| `.skilled/skills/sk-code/sk-code-review/benchmark/reports/` | Created/Modified | Live finding-accuracy run and index row |
| `.skilled/agents/review.md` and runtime copies | Modified | Summary agreement |
| Version carriers, `changelog/v1.9.2.0.md`, hub `changelog/v3.9.2.0.md`, `.hermes/skills/` copies | Modified/Created | Patch releases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash workers made each edit from a one-change brief, through pi and, where pi returned nothing, devin. A network drop failed one wave on all three executors with connection errors, and it was resent unchanged once the endpoint answered. The conductor read every diff, corrected one brief whose example narrowed the diff to the current directory, ran the live reviews, scored them against the gold, and ran the gate set from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the trailing-slash path keyword instead of adding review vocabulary | The double count was the cause. A review keyword such as `review .github/` would catch one phrasing and miss "review the workflow at ...". |
| Accept the quality path prompt moving from a bundle to `single` | Its own scenario expects `single`, and the quality gate already attaches the CI checklist by path. |
| Score the clean control as FAIL | Its gold allows no P0 or P1, and the review raised a P1. Recording it keeps the D4 number honest. |
| Keep raw run evidence in `evidence/` as `.txt` | The gates would otherwise treat model output and fixtures as authored docs and code. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .../scripts/tests/check-rule-copies.test.sh` | PASS, `All rule-canary test cases passed` |
| `node --test .skilled/bin/tests/compiled-route-*.test.cjs` | PASS, `# fail 0` (95 pass against a 94 baseline, the added test) |
| `compiled-route-guard.cjs`, `compiled-route-sync.cjs --check`, `compiled-route-admission.cjs --all` | PASS |
| `verify-router-sync.cjs`, `verify-doc-claims.cjs`, `parent-skill-check.cjs .skilled/skills/sk-code` | PASS 5/5, 4/4, 0 warnings |
| `skill-graph-freshness.cjs --strict`, intent signals `--check` | PASS |
| Agent mirrors (agent sync, codex, pi, roster, hermes) | PASS |
| `sync-runtime-mirrors.cjs --check` | FAIL on `.cursor/commands/local-skilled-alignment.md` EXTRA, present in the baseline and outside this packet |
| `validate_document.py` on changed docs | VALID, except the three review-output fixtures, which were INVALID before this packet too |
| Live finding accuracy | CR-025 PASS, CR-026 PASS, CR-027 FAIL, D4 67/100 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One sample per scenario.** The live run is one review each, so D4 67/100 is a single observation, not a rate. Rerun the three scenarios to see the spread.
2. **The clean control drew a P1.** The review flagged `NaN` bounds in `clamp.js` as P1. Whether the mode should hold that at P2 or the gold should accept it is open.
3. **CR-028 is not recorded in a benchmark folder.** Its commands were run and matched, but no report folder holds that run.
<!-- /ANCHOR:limitations -->

---
