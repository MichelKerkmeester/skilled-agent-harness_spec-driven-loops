---
title: "Implementation Summary: corpus research"
description: "A 4-model deep-research fan-out over the external design corpus produced a decision-ready sk-design taxonomy and a structural-model recommendation for the phase-002 gate."
trigger_phrases:
  - "corpus research summary"
  - "sk-design research outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/001-corpus-research"
    last_updated_at: "2026-06-25T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed 4-model fan-out research, merged lineages, synthesized research.md"
    next_safe_action: "Await user review at the architecture-decision gate before phase 002"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-corpus-research |
| **Completed** | 2026-06-25 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A four-model deep-research fan-out over the external design-skills corpus, merged into one decision-ready synthesis. You can now read `research/research.md` to see, with per-model attribution, what the `sk-design` family should contain and how its parent should be structured, before committing to any build.

### Four heterogeneous research lineages

Opus 4.8 (15 iterations, the deepest run), GPT-5.5 (5 iterations, converged), Kimi K2.7 (7 iterations), and MiMo V2.5 Pro (8 iterations) each ran an independent deep-research loop over the same brief, then merged. The heterogeneous mix surfaced both consensus and a real structural disagreement, which the synthesis preserves rather than averages away.

### A consolidated, attributed synthesis

`research.md` recommends a 5-core-plus-1-optional sub-skill taxonomy and an umbrella-router structural model (3 of 4 lineages), and it documents the dissent and the open seams so the phase-002 decision is made on evidence.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Consolidated 4-model synthesis (taxonomy + structural recommendation) |
| `research/deep-research-findings-registry.json` | Created | Merged 20 key findings with lineage attribution |
| `research/fanout-attribution.md` | Created | Per-lineage convergence record |
| `research/lineages/*/` | Created | Per-model research outputs (opus48-claude2, gpt55fast, kimi27, mimo25pro) |
| `research/deep-research-fanout-config*.json` | Created | Fan-out configs (initial + recovery) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fan-out ran via the `/deep:research` engine (`fanout-run.cjs`) with per-lineage iteration caps. The first run landed Opus and Kimi cleanly but lost GPT (its writes hit the lineage sandbox) and MiMo (Xiaomi token-plan provider outage). A recovery run re-ran both via cli-opencode, with MiMo moved to the Xiaomi Direct API, and both succeeded. The four lineages were merged with `fanout-merge.cjs`, and the unified `research.md` was compiled from all four lineage reports plus the merged registry.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Recovered the two failed lineages instead of dropping them | The user asked for all four models; verified in spec 143 that GPT-opencode works in fan-out, so the failure was instance-specific, not systemic |
| Moved MiMo to the Xiaomi Direct API | The token-plan provider was in a sustained server outage; the Direct API serves the exact MiMo V2.5 Pro model |
| Accepted GPT converging at 5 of 20 iterations | Convergence is the loop's quality stop; forcing 20 would add repeat iterations with no new signal |
| Kept the structural decision for phase 002 | The research recommends umbrella-over-siblings but the call is the user's to make at the gate |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict --recursive` (parent + child) | PASS (0 errors, 0 warnings) at scaffold time; re-run after this summary |
| Per-lineage iteration caps | opus 15 (maxIterationsReached), kimi 7 (maxIterationsReached), mimo 8, gpt 5 (converged) |
| Merge | `merged_lineages: 3` registries + mimo prose; 20 key findings; research.md 230 lines |
| All 4 models represented | PASS (each lineage has a research.md) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **GPT ran 5 of 20 iterations.** It converged early (a legitimate quality stop), so total depth is 35 iterations across the four models rather than the planned 50. Re-running GPT with convergence disabled is possible if fuller GPT coverage is wanted.
2. **MiMo produced no structured findings-registry.** Its 8 findings survive only in its prose `research.md`, so its unique claims are single-lineage and unverified by the merged registry.
3. **The structural model is a recommendation, not a decision.** The 3-vs-1 umbrella-vs-hub split is unresolved on the merits because no advisor/usage telemetry exists; phase 002 makes the binding call.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
