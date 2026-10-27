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
    recent_action: "Added the severity reach calibration and reran finding accuracy three times per scenario"
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

### Severity reach calibration (reopened)

The first live run failed the clean control: the review raised a P1 because `clamp(5, NaN, 10)` returns `NaN`, though only a broken caller sends a `NaN` bound, the file had no callers and its comment states a number contract. The severity rules never asked whether the failing input could arrive. `references/review-core.md` section 2 now carries a Reach Calibration: a P0 or P1 names an input the stated contract allows or a real caller that sends it, out-of-contract input is P2 hardening unless the code claims to validate it, a guard claims only the class it checks, and data crossing a trust boundary is always in reach. The escalation rule now raises only a finding whose reach is named, so the two cannot contradict.

Restatements kept in step: `SKILL.md` Phase 3, the `README.md` severity taxonomy, and `.skilled/agents/review.md` (severity table note and a Skeptic-pass question) with its `.claude` copy by hand and the codex, pi and hermes copies regenerated. `.opencode/agents` and `.hermes/agents` are directory links to `.skilled/agents`. `deep-review.md` and the deep-review prompt pack load `review-core.md` directly, so they take the rule without an edit. The clean control now names the `NaN` note as an allowed P2.

The rerun, three live reviews per scenario plus one with the range guard removed, is in `benchmark/reports/2026-10-27--finding-accuracy-calibrated--live/`, raw outputs in `evidence/finding-accuracy-rerun/`:

| Scenario | Runs met gold | Durations | Total tokens |
|----------|---------------|-----------|--------------|
| CR-025 seeded injection | 3 of 3, P0 at users.js:5 each time | 41, 54, 51 s | 327951, 205734, 343266 |
| CR-026 seeded off-by-one | 3 of 3, P1 at paginate.js:5 each time | 31, 41, 51 s | 125129, 160801, 245241 |
| CR-027 clean control | 3 of 3, no P0 or P1, NaN note held at P2 | 57, 64, 46 s | 151091, 253801, 152551 |
| CR-027 guard removed | Finding raised at clamp.js:5, graded P2 | 71 s | 168063 |

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
| Hold out-of-contract input at P2 rather than change the clean-control gold | The scenario was right: a NaN bound needs a broken caller. A rule about reach fixes every review, where a gold change would fix one fixture. |
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
| Mirror checks after the reach rule (agent sync, codex, pi, runtime mirrors, roster, hermes) | PASS, runtime mirrors 194 across 8 trees |
| Playbook validator `--strict` | PASS, `sk-code/sk-code-review` 34 scenarios, 0 violations |
| Live finding accuracy, rerun | CR-025 3/3, CR-026 3/3, CR-027 3/3, D4 100/100; guard-removed variant drew a P2 finding |
| `test_readme_manifest.py` and `test_readme_verdict_parity.py` after `--write` | PASS against an index that includes the new report folder (783 directories, 983 README verdicts). Against the working index the manifest test fails until the new folder is staged, because discovery counts tracked files only |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three samples per scenario.** The rerun is three reviews each on one model, so 100/100 is a small sample, not a stable rate.
2. **The guard-removed variant was flagged at P2, not as a blocker.** With the `min > max` guard gone, the review named the inverted-range defect but held it at P2, reasoning that no guard, doc line or caller put an inverted range in reach. The supplemental check asks only that a finding is raised, which it was. Whether an inverted range under a "closed range [min, max]" comment should count as in-contract is not settled by this run.
3. **CR-028 is not recorded in a benchmark folder.** Its commands were run and matched, but no report folder holds that run.
<!-- /ANCHOR:limitations -->

---
