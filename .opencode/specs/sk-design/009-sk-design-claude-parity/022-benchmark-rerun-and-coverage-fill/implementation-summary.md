---
title: "Implementation Summary"
description: "Reran the sk-design Lane C skill-benchmark (router + live) after phase 021's fixes with no regression, then audited manual_testing_playbook coverage per mode and parent hub via a 7-agent Workflow, authoring 4 new scenarios for confirmed real gaps. Final live-mode baseline: PASS 94/100, 27 scenarios."
trigger_phrases:
  - "implementation"
  - "summary"
  - "phase 022 implementation summary"
  - "benchmark rerun coverage fill summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/022-benchmark-rerun-and-coverage-fill"
    last_updated_at: "2026-07-07T15:05:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed implementation-summary.md; all tasks and checklist items done"
    next_safe_action: "Run validate.sh --strict, then commit and push"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/sk-design/benchmark/after-022-coverage-fill/report.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "benchmark-coverage-022"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-benchmark-rerun-and-coverage-fill |
| **Completed** | 2026-07-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two asks handled together: confirm phase 021's validator rewrite and finding fixes didn't regress sk-design's routing (benchmark rerun), and rigorously check whether `manual_testing_playbook` has enough scenarios per mode and the parent hub for real manual `cli-opencode` testing (coverage audit). Ran both concurrently — the live-mode benchmark dispatches real model calls and takes ~10-20 minutes, so it ran in the background while a 7-agent Workflow independently audited each of the 6 registry modes plus the parent hub, synthesized the raw findings into 4 confirmed real gaps (rejecting a 5th as already covered by a nested packet's own scenario), and authored them. Reran both benchmark modes a second time against the coverage-filled corpus so the saved baseline reflects the complete final state, not two disjoint snapshots.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/manual_testing_playbook/06--parity-behavior/interface-variation-set-selection-proof.md` | Created | `PB-007`: interface's untested `variation_set.md` multi-direction procedure card |
| `.opencode/skills/sk-design/manual_testing_playbook/02--advisor-integration/code-review-routes-skcode.md` | Created | `AI-004`: audit vs sk-code `code-review` sibling-collision boundary |
| `.opencode/skills/sk-design/manual_testing_playbook/04--md-generator-pipeline/brief-only-authoring-boundary.md` | Created | `MG-004`: md-generator's anti-hallucination brief-only authoring boundary |
| `.opencode/skills/sk-design/manual_testing_playbook/08--hub-manager-intake/design-mode-pairing-before-run.md` | Created | `HM-004`: hub-level visible design-mode pairing before an Open Design RUN |
| `.opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md` | Edited | 4 category tables, critical-path list, cross-reference index, totals (33->37, 15->16, 8->10), coverage-note prose; version 1.1.0.0 -> 1.2.0.0 |
| `.opencode/skills/sk-design/README.md` | Edited | Fixed stale "33-scenario" playbook description line -> 37 |
| `.opencode/skills/sk-design/benchmark/after-022-coverage-fill/{report.json,report.md}` | Created | Final live-mode baseline: PASS 94/100, 27 scenarios |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Located the exact re-run invocation from `sk-design/benchmark/README.md`'s own instructions rather than guessing flags. Ran router-mode first (fast, deterministic: `PASS` 100/100, 25 scenarios, matching phase 019's last known count exactly) then launched live-mode in the background.

While live-mode dispatched, ran a 3-phase Workflow for the coverage audit: 7 parallel agents (one per registry mode, one for the parent hub) each independently read that target's real `mode-registry.json` entry, `SKILL.md`, and every existing scenario file naming it, then judged adequacy against a fixed bar — routing proof, registry-property exercise (tool surface, backend kind), and any documented precondition/boundary unique to that target — not scenario count alone. This bar caught a real, non-obvious pattern: `md-generator` had MORE scenario-touches (8) than most sibling modes yet was still flagged inadequate, because its gap was a specific untested precondition (every existing scenario supplied a live URL, so the mode's core anti-hallucination "brief-only" boundary was never actually triggered) rather than a volume problem. A synthesis agent then reconciled all 7 reports: it caught that the `design-mcp-open-design` audit and the parent-hub audit had both independently proposed a mandatory-pairing-gate scenario, discovered by reading the transport packet's own NESTED playbook that `GATE-001` (`design-mcp-open-design/manual_testing_playbook/05--design-gate/mandatory-design-gate.md`) already exhaustively covers the packet-internal half of that gap, and kept only the genuinely uncovered remainder (whether the HUB's own dispatch visibly surfaces the pairing plan at intake) as `HM-004`. Four parallel authoring agents then wrote the confirmed scenarios, each independently re-verifying every cited fact against real source files rather than trusting the synthesis summary.

After authoring, synced the root index by hand (category tables, cross-reference index, critical-path list matching the new files' own `Critical path:` metadata, totals) and fixed `README.md`'s separately-stale scenario count. Reran router-mode against the updated corpus: scenario count 25 -> 27 (`AI-004`, `MG-004` both scored `PASS`), confirmed the 4 pre-existing `parseWarnings` were byte-identical before/after (not a new regression), and confirmed `PB-007`/`HM-004` are excluded from router-mode scoring for the SAME reason their sibling `PB-004/005/006`/`HM-001/002/003` scenarios already were before this phase (a pre-existing harness classification, not a new gap). Finally reran live-mode against the complete 27-scenario corpus for the true final baseline.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run the benchmark rerun and coverage audit concurrently (background live-mode + foreground Workflow) rather than sequentially | Live-mode dispatch is I/O-bound and takes 10-20 minutes with near-zero CPU from this session; the coverage audit is independent work that didn't need to wait for it |
| Grade each mode's adequacy against a fixed bar (routing + registry-property + boundary proof), not scenario count | Scenario count alone is a weak proxy — `md-generator` had the second-highest count of any mode yet still had a real, specific gap; a count-only bar would have missed it |
| Make synthesis explicitly adversarial ("be skeptical, more coverage alone is not a justification") rather than a pass-through merge | Caught and correctly rejected one full recommendation as redundant with an already-existing nested-packet scenario, which a naive merge would have duplicated |
| Rerun live-mode a second time against the coverage-filled corpus rather than only saving the pre-fill run | The saved `benchmark/` baseline should reflect the actual current state of the corpus, not a stale snapshot from before scenarios existed that the corpus now contains |
| Leave `MR-002`/`MR-003`/`MR-004`'s live-mode 50/100 scores uninvestigated | Already root-caused and classified out-of-scope in phase 019's implementation-summary (pre-existing browser-harness-availability artifact); unchanged before/after this phase, confirming it's not something this phase's work touched |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Router-mode benchmark (pre-coverage-fill) | `PASS`, aggregate 100/100, scenarios=25 |
| Live-mode benchmark (pre-coverage-fill) | `PASS`, aggregate 93/100, scenarios=25 |
| Coverage audit (7 agents) | 5/7 targets flagged a real gap; synthesis confirmed 4, dropped 1 as redundant |
| Router-mode benchmark (post-coverage-fill) | `PASS`, aggregate 100/100, scenarios=27 (`AI-004`, `MG-004` both scored 100); `parseWarnings` unchanged |
| Live-mode benchmark (final baseline) | `PASS`, aggregate 94/100, scenarios=27; `AI-004` and `MG-004` both scored 100 in real dispatch (the model correctly deferred the code-review prompt to sk-code, and correctly refused to fabricate a token table for the brief-only md-generator request); D5 connectivity 100/100 (hard gate) |
| Root-index arithmetic | 37 total = 16 critical-path + 10 candidates + 11 non-critical, confirmed by direct count |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`PB-007` and `HM-004` remain unscored by both automated benchmark modes.** This matches the SAME pre-existing pattern their sibling categories already had (`PB-004/005/006`, `HM-001/002/003` were never picked up by the router/live-mode corpus loader either) — a structural harness classification unrelated to this phase's additions. Their value is primarily for manual/human playbook execution, per the playbook's own EXECUTION POLICY.
2. **`PB-007` and `HM-004` are marked "Candidate for operator confirmation" for critical-path status**, matching the existing convention for their sibling scenarios. Promoting them is an operator decision this phase did not make.
3. **`design-mcp-open-design`'s mandatory-pairing gate is only half-closed by this phase.** The packet-internal enforcement mechanism was already exhaustively proven by its own nested `GATE-001` scenario before this phase started; `HM-004` closes the remaining hub-level visibility gap specifically, not a from-scratch new gate.
<!-- /ANCHOR:limitations -->
