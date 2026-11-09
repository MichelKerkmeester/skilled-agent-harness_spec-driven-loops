---
title: "Implementation Summary"
description: "Forced-depth deep research of the spec-kit-core cluster across the v4 release line: iteration count, executor, coverage of release against finding type, and the strongest verified findings."
trigger_phrases:
  - "spec kit core implementation summary"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/001-spec-kit-core"
    last_updated_at: "2026-11-08T22:34:13Z"
    last_updated_by: "orchestrator-a"
    recent_action: "Run closed after the depth bar cleared at iteration 20; research.md synthesized"
    next_safe_action: "Parent synthesis reads research/research.md"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-state.jsonl"
    session_dedup:
      fingerprint: "sha256:8cbb396cb88b7b9b8e087d52dcd21073373a06e6fa16d3aeecc337ecab078701"
      session_id: "001-spec-kit-core-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-spec-kit-core |
| **Completed** | 2026-11-08 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase ran a forced-depth research loop over spec-kit core: 20 state rows, 19 productive iterations after one Devin quota failure, two +5 extensions, closed when iterations 18 to 20 held no new verified P1. The strongest findings are fail-open gates and a continuity writer that can fall back to the shared runtime checkout.

### Phase 1: spec-kit-core

The loop read each v4 release that touched this cluster against the code and docs it shipped, and logged findings in seven types. You get a ranked list in `research/research.md` that a remediation packet can pick up without re-reading the releases.

### Coverage: release against finding type

Counts come from the `findingType` and `release` fields of the finding rows in `research/deltas/`. A dot means no finding of that type was logged for that release. 7 of 121 finding rows carried no parsable type or release and are not counted.

| Release | Drift | Misalign | Bug | Improve | UX | Over-eng | Extension |
|---------|-------|----------|-----|---------|----|----------|-----------|
| pre-v4.0.0.0 | 5 | 5 | 11 | 4 | 6 | 2 | 2 |
| v4.0.0.0 | 5 | 1 | 4 | 2 | 3 | 4 | 1 |
| v4.0.0.1 | 1 | . | 1 | 1 | . | 1 | . |
| v4.0.0.2 | 1 | 1 | 3 | 2 | 3 | . | 2 |
| v4.0.0.3 | 1 | . | . | 2 | 1 | . | . |
| v4.0.0.4-.10 | 6 | . | . | . | 2 | 1 | . |
| v4.0.0.11 | 1 | . | . | . | . | 1 | . |
| v4.0.0.12 | 1 | . | 1 | . | . | 1 | 1 |
| v4.0.0.13 | 1 | . | 2 | . | . | . | . |
| v4.0.0.14 | 2 | . | 1 | . | . | . | . |
| v4.0.0.15 | 1 | . | 1 | . | 1 | . | . |
| v4.0.0.16 | . | . | . | 1 | . | . | . |
| v4.0.1.0 | 2 | 1 | 3 | . | 2 | . | . |
| v4.0.2.0 | 2 | 1 | 2 | . | 1 | . | . |

### Strongest Findings

| # | Finding | Type | Severity | Release | Source | Orchestrator check |
|---|---------|------|----------|---------|--------|--------------------|
| 1 | Gate 3 depends on word order: 'Update the README and review the result.' does not fire it while 'Review the README and update it.' does, because the read-only override wins when the write verb comes first | bug | P1 | pre-v4.0.0.0 | `.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:731` | Orchestrator ran classifyPrompt on both prompts in iteration 1: false with read_only_override, then true with file_write_match |
| 2 | The continuity writer /speckit:save runs is gitignored and untracked, and /doctor:install probes runtime/dist, not runtime/cli/dist, while the repair line validate.sh prints builds a tsconfig that never compiles runtime/cli | bug | P1 | v4.0.2.0 | `.skilled/commands/doctor/assets/doctor-install.yaml:34` | Orchestrator: git check-ignore -v gives .gitignore:60 dist/ for runtime/cli/dist/continuity/generate-context.js, git ls-files runtime/cli/dist is 0, runtime/tsconfig.json references only ../shared |
| 3 | A project that is not recognised as using spec-kit silently gets the shared runtime checkout as its project root, so a save run from it writes into this repository after one stderr line | bug | P1 | v4.0.1.0 | `.skilled/skills/system-spec-kit/runtime/cli/core/config.ts:146` | Orchestrator at close: resolveProjectRoot('/tmp/rr-o/bare/nested') printed the stderr note and returned /Users/michelkerkmeester/MEGA/Development/Skilled |
| 4 | Strict validation passes a phase parent's ANCHORS_VALID before parsing any anchor, so broken nesting in a phase-parent spec.md never fails | drift | P1 | v4.0.0.5 | `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:975` | Orchestrator read :975-976 (pass returned on level phase and isPhaseParent before any scan); iteration 12 reproduced exit 0 on nested anchors |
| 5 | The trigger lookup answers a misspelled query with 20 rows scored 0.000 and exit 0 unless --scoring-only is passed, so a Gate 1 caller without the flag cannot tell a typo from a hit | ux | P1 | v4.0.0.3 | `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:204` | Orchestrator ran the lookup on 'validaton rulles strict': 20 rows at 0.000, exit 0; with --json --scoring-only, exit 1 |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/` | Created | Run config, ledger-backed state log, strategy, registry, iterations, deltas, prompts and `research.md` |
| `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md` | Modified | Research charter, plan, task state, run decisions and this summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator ran the auto workflow's own commands step by step: lock, render, dispatch through `if_cli_devin`, `verify-iteration.cjs`, the reducer and the graph upsert. Executors used: cli-devin deepseek-v4-1-flash-max (iterations before the switch), cli-pi opencode-go/deepseek-v4.1-flash thinking max (after). After every iteration it read the iteration file and its state record, opened two cited lines, and set the next focus. Recorded iterations, counted from the state log: 20.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Convergence runs as telemetry only, with ten iterations as the floor | The brief asks for forced depth, so a quiet iteration must not end the run early. |
| Steering goes through `research/inbox.jsonl` and the rendered focus, never a hand edit of reducer-owned sections | The reducer rewrites Next Focus every pass, so a hand edit would vanish and break the ownership contract. |
| The artifact directory is not staged with `git add` | The brief forbids changing the index; the operator stages the run when committing it. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iterations recorded in the state log | 20 rows of type `iteration` |
| Depth-bar score at close | 3 of 3 clean by the orchestrator's verification: iterations 18 to 20 added no new verified P1 after two +5 extensions. Raw delta severities for 18, 19 and 20 are P1 2, 1 and 2, none of which the orchestrator verified as a new P1, with newInfoRatio 0.60, 0.58 and 0.62 |
| Citation checks | Two per iteration, verdicts in `decision-record.md` ADR-005 |
| Strict validation | Summary: Errors: 0  Warnings: 2 / RESULT: PASSED (SOURCE_TAGS: 4 citations inside a containment quarantine copy of a sibling child iteration; LEVEL_MATCH: decision-record.md at Level 1) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One model family.** Every iteration ran DeepSeek V4.1 Flash, so judgment findings such as over-engineering carry one lens. Treat them as hypotheses until a second family or a grounding check agrees.
2. **Release attribution is by path-limited diff.** v4.0.0.4 to v4.0.0.10 share one tag commit, so attribution inside that block leans on each note and the commit dates.
<!-- /ANCHOR:limitations -->

---
