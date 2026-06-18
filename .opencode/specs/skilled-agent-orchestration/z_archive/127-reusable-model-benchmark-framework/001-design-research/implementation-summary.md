---
title: "Implementation Summary: Reusable model-benchmark framework (research packet)"
description: "Outcome of the 10-iteration cli-codex deep-research loop: a config/profile-driven benchmark-framework design for deep-improvement, an anti-saturation fixture strategy, a reuse-vs-net-new map against Lane B, and a prioritized P0/P1/P2 roadmap."
trigger_phrases:
  - "reusable benchmark framework summary"
  - "deep-improvement benchmark research outcome"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-reusable-model-benchmark-framework/001-design-research"
    last_updated_at: "2026-06-02T06:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Research complete; design + roadmap delivered"
    next_safe_action: "Plan implementation phases from the roadmap"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/127-reusable-model-benchmark-framework/research/research.md"
      - ".opencode/specs/skilled-agent-orchestration/127-reusable-model-benchmark-framework/research/deltas/deltas.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "research-127"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 127-reusable-model-benchmark-framework |
| **Completed** | 2026-06-02 |
| **Level** | 1 (research packet) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet delivered a research design, not code. Ten `cli-codex gpt-5.5` (high reasoning, fast tier, read-only) iterations investigated the repo's three overlapping benchmark efforts and produced a concrete plan to fold them into ONE config/profile-driven framework inside `deep-improvement` — so benchmarking any model, prompt technique, reasoning level, or situation becomes a profile, not new rig code. All 10 dispatches returned real, evidence-grounded findings (exit 0); zero failures, zero fabricated runs.

### The design

You can now read a build-ready architecture in `research/research.md`: ONE benchmark profile drives five seams — fixture-source, framework-source, dispatcher, scorer, reporter — built as an additive EXTENSION of Lane B (`scripts/model-benchmark/`), not a new rig. The design also fixes the `126/004` correctness-saturation problem (frontier models passed every tractable fixture) via five composing mechanisms: correctness-as-gate, tiered T3/T4 fixtures, per-dimension separation, hidden-test anti-overfitting, and saturation auto-detect. A `mode` field is a thin selector so six situations (model-vs-model, framework bake-off, reasoning ablation, prompt-vs-prompt, skill-regression, capability profiling) are all config.

### The roadmap

A prioritized P0/P1/P2 roadmap with an explicit MVP boundary, plus 64 structured deltas in `research/deltas/deltas.jsonl` (26 P0, 25 P1, 13 P2), each tagged with target, change, confidence, and the iteration evidence.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/iterations/iteration-001..010.md` | Created | Per-iteration codex findings (verbatim, evidence-grounded) |
| `research/research.md` | Created | Synthesis: seam architecture, anti-saturation strategy, reuse-vs-net-new, P0/P1/P2 roadmap |
| `research/deltas/deltas.jsonl` | Created | 64 structured deltas `{priority, target_file, change, confidence, evidence}` |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created/Updated | Spec-folder governance docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each iteration was a single themed `codex exec` (read-only) pointed at named repo files; codex read the files itself and emitted findings + a structured deltas block, which the orchestrator captured verbatim to the iteration file. Iteration 1 surfaced a path correction (`126`/`120` real directory names), which was confirmed and applied to all later prompts. Confidence was kept numeric and priorities normalized to P0/P1/P2 when building the canonical `deltas.jsonl`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Extend Lane B rather than build a new rig | Lane B already owns profile loading, executor dispatch, the 5-dim scorer, and report history; only the matrix layer, framework registry, harder fixtures, and stats are missing |
| Matrix expander as a new `sweep-benchmark.cjs` called by `loop-host` | Keeps the sweep concern out of the row scorer and avoids mode-specific branches |
| Correctness becomes a GATE once saturated | Directly fixes the `126/004` mis-read where a format/length winner looked like a correctness winner |
| New profile keys strictly additive + ignored until a sweep runner consumes them | Lane B agent-improvement benchmarks keep working byte-for-byte |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| 10 codex iterations dispatched | PASS — all exit 0, real findings (tokens 24.8k-110k each) |
| Iteration files present + well-formed | PASS — `iteration-001..010.md`, each with a deltas JSON block |
| `deltas.jsonl` valid | PASS — 64 lines, every line valid JSON, confidence 0.7-0.95 |
| `research.md` present with design + roadmap + references anchor | PASS |
| `validate.sh --strict` on folder | PASS (see run log in conversation) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Research grounding, not verified ground truth.** codex read files read-only and cited specific line numbers; the implementation packet must confirm each cited line/constant against the actual code before relying on it.
2. **No `--search`.** codex-cli 0.135.0 has no web search, so the design draws on repo evidence + model knowledge — appropriate for this design question but not an external-source survey.
3. **Two fixture categories are net-new, not generalizations.** codex found no true long-context fixture and no required-tool-use/agentic scoring contract in the current repo; those are new schema extensions (flagged low-confidence).
4. **Provider cost/token fields unverified.** Whether the current OpenCode binary's `session.completed` payload exposes token/cost is unconfirmed; per-executor cost parsers are lower-confidence and deferred to P1/P2.
<!-- /ANCHOR:limitations -->
