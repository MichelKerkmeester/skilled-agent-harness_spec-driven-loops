---
title: "Implementation Summary"
description: "Phase 001 authored its research angles and known context and launched a 15-iteration two-lineage fan-out over Hermes Agent; the synthesis and its evidence are recorded here when the run completes."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/001-deep-research"
    last_updated_at: "2026-09-14T18:30:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored angles and resource map; launched fan-out"
    next_safe_action: "Verify lineage caps, merge, synthesize"
    blockers: []
    key_files:
      - "research-angles.md"
      - "resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-001-deep-research"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-deep-research |
| **Completed** | 2026-09-14 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The research inputs exist and the run is launched. `research-angles.md` holds the ten angles and the rules of engagement every iteration follows; `resource-map.md` holds the known context (the local Hermes install as observed, and this repo's runtime integration surface with file and line pointers) so lineages build on it rather than rediscover it; `research/deep-research-config.json` records the two-lineage fan-out.

### Phase 1: deep-research

You get a cited answer to what Hermes can do as a seventh runtime and a recommended phase plan, before anything is built. The synthesis lands at `research/research.md` when both lineages finish.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research-angles.md` | Created | Ten bounded angles, evidence rules, forbidden commands |
| `resource-map.md` | Created | Known context seeded into each lineage's strategy |
| `research/deep-research-config.json` | Created | Run configuration: two `cli-devin` lineages, `stop_policy: max-iterations` |
| `research/lineages/{deepseek,swe2}/` | Created by the run | Per-lineage iterations (10 and 5), deltas, state logs, syntheses |
| `research/findings-registry.json`, `research/fanout-attribution.md`, `research/resource-map.md` | Created by merge | Merged registry (90 findings), attribution table, convergence resource map |
| `research/research.md` | Created | Consolidated synthesis: verdict, ten angles, 16-row comparison, ranked plan R1 to R8, five resolved disagreements, seven open questions, verification record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Through the `/deep:research:auto` workflow in fan-out mode: `fanout-run.cjs` spawned both `devin -p` lineages at 16:17Z with stdin closed and write containment on; deepseek completed at 16:53Z and swe2 at 17:02Z; `fanout-merge.cjs` consolidated the registries and `reduce-state.cjs` emitted the resource map. The orchestrating session then opened fourteen citations against the installed Hermes source, resolved the three disagreements between the lineages from the source, and wrote the consolidated synthesis.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two lineages with caps of 10 and 5 instead of one 15-iteration loop | The runtime cannot switch model mid-loop; two labelled lineages give the requested split and a second model family on every judgment |
| `deepseek-v4-flash-max` as the DeepSeek id | The `cli-devin` roster bakes the Max thinking tier into the id; the `v4.1` name exists only on other routes |
| Angles in a file, not in the topic string | The topic travels as a CLI argument; the file carries the detail and the forbidden-command list |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `command -v devin` and `devin --version` | PASS: `devin 3000.10.21` |
| Lineage caps on disk | PASS: 10 and 5 iteration files; both terminal records `maxIterationsReached`; `orchestration-summary.json` succeeded 2 of 2 |
| Citation sample resolves | PASS: 14 of 14 opened citations resolve (`research/research.md` section 7) |
| `git status` clean outside the packet | PASS with note: the packet is the only path this session added; the runner's containment advisory names a neighbouring fan-out in another session |
| Lineage state-log timestamps | WARN: 8 fabricated ISO timestamps flagged by the runner; ordering taken from file mtimes |
| `validate.sh --strict` | See the run recorded in the parent goal log |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Web research on `cli-devin` is inherit-only.** No flag forces it on; only one live fetch happened (the agentskills.io specification, by deepseek). Hermes's own documentation site and changelog were not fetched; version-drift and upstream-roadmap claims rest on the installed source alone.
2. **No live dispatch ran.** The local Hermes install has no configured provider, so every dispatch-contract claim is source-verified. The contract pin phase carries the smoke.
3. **Lineage timestamps are unreliable.** Both models fabricated ISO timestamps in their state logs; the runner flagged them, and the lineage file mtimes carry the real order.
<!-- /ANCHOR:limitations -->

---
