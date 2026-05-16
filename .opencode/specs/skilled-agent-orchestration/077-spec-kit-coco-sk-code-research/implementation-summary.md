---
title: "Implementation Summary: 077 Deep Research"
description: "10-iteration cli-codex deep-research audit of system-spec-kit + mcp-coco-index + sk-code OpenCode side surfaced 22 P1 + 20 P2 findings; synthesized into a 4-phase remediation roadmap. No code changes in this packet — research-only planning input for 078+."
trigger_phrases: ["077 summary"]
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/077-spec-kit-coco-sk-code-research"
    last_updated_at: "2026-05-05T17:05:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Spec docs authored"
    next_safe_action: "Validate + commit + push + memory save"
    blockers: []
    key_files:
      - .opencode/specs/skilled-agent-orchestration/077-spec-kit-coco-sk-code-research/research/research.md
      - .opencode/specs/skilled-agent-orchestration/077-spec-kit-coco-sk-code-research/research/resource-map.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "077-complete"
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
| **Spec Folder** | 077-spec-kit-coco-sk-code-research |
| **Completed** | 2026-05-05 |
| **Level** | 1 |
| **Predecessor** | 069 sk-code v3.1.0.0 (motion_dev cross-stack) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A 10-iteration deep-research audit of three intertwined OpenCode skill surfaces — system-spec-kit, mcp-coco-index, and sk-code (OpenCode side specifically) — surfaced 22 P1 and 20 P2 findings and synthesized them into a 4-phase remediation roadmap. The audit ran via `/spec_kit:deep-research:auto` with cli-codex (gpt-5.5/high/fast) as executor, taking ~30 minutes wall-clock total. Every iteration produced new P1 findings, so the convergence streak never triggered; the loop ran the full 10 iterations and stopped at maxIterations. No code outside the packet was changed — this is research-only planning input for any subsequent remediation packet (078+).

### 10-iteration loop with cli-codex

The dispatcher (`research/scripts/dispatch-iter.sh`) builds a per-iteration prompt from a template that names the 3-artifact contract (iteration-NNN.md narrative + canonical JSONL append + per-iteration delta file), then pipes it via stdin to `codex exec --sandbox workspace-write -c service_tier="fast" -c model="gpt-5.5" -c model_reasoning_effort="high" -`. Stdin redirection follows the memory rule for large prompts (avoids the cli-codex background-stall pattern). The loop driver (`research/scripts/run-loop.sh`) parses each iteration's `[P0]`/`[P1]` finding tags and increments a streak counter; convergence threshold is 2 consecutive zero-new-P0/P1 iterations.

### Synthesis output

`research/research.md` (~9KB) is structured as: executive summary → per-surface findings (system-spec-kit, mcp-coco-index, sk-code OpenCode) → cross-cutting integration findings → answered/remaining questions → 4-phase remediation roadmap → ruled-out directions → artifacts → verdict. `research/resource-map.md` (~3KB) inventories all 43 touched paths grouped into 10 sections (READMEs, Documents, Commands, Agents, Skills, Specs, Scripts, Tests, Config, Meta).

### Top-level findings

The audit's central insight: all three surfaces are healthy at their cores but share an architectural gap — no first-class authoring-time integration path between them. system-spec-kit, mcp-coco-index, and sk-code work well in isolation, but the workflow that ties them together (spec-folder writes that touch `.opencode/`, expecting sk-code patterns to load AND CocoIndex to index AND spec-kit validators to enforce) has no canonical recipe. The 4-phase remediation roadmap closes this gap starting with sk-code OpenCode authoring assets (foundation), followed by `/spec_kit:complete` integration, CocoIndex canonical-priority semantics, and finally validator/MCP-tool drift cleanup.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `077/research/deep-research-config.json` | Created | Loop config (cli-codex executor, 10 iters, 0.10 convergence) |
| `077/research/deep-research-state.jsonl` | Created | Append-only canonical state log (14 lines: config + init + 10 iter records + loop_complete + synthesized) |
| `077/research/deep-research-strategy.md` | Created | Strategy with 7 key questions + non-goals + stop conditions; reducer-owned sections updated by iter 1 |
| `077/research/findings-registry.json` | Created | Reducer-owned registry of open questions |
| `077/research/iterations/iteration-{001..010}.md` | Created | 10 iteration narratives |
| `077/research/deltas/iter-{001..010}.jsonl` | Created | Per-iteration structured delta streams |
| `077/research/prompts/iter-{001..010}.md` + `*.codex.log` | Created | Per-iteration prompts + codex stdout logs |
| `077/research/scripts/{dispatch-iter,run-loop}.sh` | Created | Per-iteration dispatcher + loop driver |
| `077/research/research.md` | Created | Synthesis (~9KB, 8 sections) |
| `077/research/resource-map.md` | Created | 10-section inventory of 43 touched paths |
| `077/{spec,plan,tasks,implementation-summary}.md` | Created | Level 1 packet docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet ran in two background sessions: iter 1 as a smoke test (~3 min wall-clock, all 3 artifacts produced cleanly), then iters 2-10 in a single continuous run after a one-line fix to a `grep -c` arithmetic bug in run-loop.sh (multiline `0\n0` from `|| echo 0` fallback was choking `$((p0 + p1))`). Total wall-clock: ~30 minutes for all 10 iterations. Synthesis was authored in this session after the loop completed; spec docs use the canonical Level 1 anchor structure verified against 075/076's passing validators.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| cli-codex executor over native @deep-research (Opus) | User explicitly requested; aligns with Phase 019 autonomous-completion directive in memory; gpt-5.5/high/fast is stable + fast for code-audit prompts |
| stdin redirection for codex invocation | Memory rule: cli-codex stalls on large prompts in background mode; stdin avoids shell argv limits + escape issues |
| Convergence threshold 0.10, streak ≥ 2 | Loose enough to allow multi-pass exploration; in practice the loop ran all 10 because every iter found new P1s |
| 4-phase remediation roadmap (not 1 bundled phase) | Findings cluster naturally into dependent stages: foundation → integration → indexing → cleanup. Bundling would lose the sequencing signal |
| No decision-record.md | Pure research packet (no architectural decision); rationale lives in spec.md + research.md |
| Stay on main, no feature branch | Per memory rule (`feedback_stay_on_main_no_feature_branches`); create.sh's auto-branch was suppressed via --skip-branch |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| 10 iteration narratives produced | PASS (`iteration-001.md` through `iteration-010.md`) |
| All 10 iterations exit_code 0 | PASS (`grep -c "codex exit=0" loop-master.log` = 10) |
| Canonical iteration records in state log | PASS (10 records with `"type":"iteration"`) |
| research.md synthesis complete | PASS (executive summary + 3 per-surface sections + cross-cutting + roadmap) |
| resource-map.md section-grouped | PASS (10 sections, 43 paths) |
| Findings tally | PASS (22 P1 + 20 P2 = 42 distinct findings) |
| validate.sh --strict on 077 | _pending — runs at T019_ |
| Branch | main |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Single-pass per iteration; no run-to-run variance measurement.** cli-codex (gpt-5.5/high/fast) is non-deterministic; a different run might surface slightly different finding sets. Spot-check of iter 1 against the actual files confirmed cited file:line evidence is real, not hallucinated.

2. **Synthesis grouping is heuristic.** Findings were grouped by surface using ID prefix patterns (F-001-* surface mapping) and content. A reviewer could re-cluster differently. The raw finding headlines are preserved verbatim in research.md so the underlying data is auditable.

3. **No code changes shipped.** This is research-only. Remediation requires a separate user decision; the proposed 4-phase roadmap is non-binding. Phase 1 (sk-code OpenCode authoring recipe) is the foundation everything else builds on.

4. **Convergence didn't trigger.** Every iteration found new P1 findings, so the streak never hit 2. This is expected for a multi-surface audit where iterations rotate focus. A future packet covering only one surface might converge faster.
<!-- /ANCHOR:limitations -->
