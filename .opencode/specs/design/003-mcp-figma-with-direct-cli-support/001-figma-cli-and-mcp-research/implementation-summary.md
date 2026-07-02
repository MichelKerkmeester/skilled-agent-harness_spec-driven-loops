---
title: "Implementation Summary: figma-cli-and-mcp-research"
description: "A five-iteration gpt-5.5-fast deep research produced a cross-checked recommendation: drive Figma Desktop via the silships figma-cli (npm figma-ds-cli, full surface from the repo build), build mcp-figma on the sibling terminal-control model with a read-only/mutating/destructive gating policy, and keep the Figma MCP optional via the Code Mode figma (Framelink) manual. The npm figma-cli package is unrelated and must never be installed."
trigger_phrases:
  - "figma-cli research outcome"
  - "figma mcp research summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/003-mcp-figma-with-direct-cli-support/001-figma-cli-and-mcp-research"
    last_updated_at: "2026-06-14T17:00:00Z"
    last_updated_by: "orchestrate"
    recent_action: "Research synthesized into research.md"
    next_safe_action: "Operator reviews research.md; start phase 002 skill build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-151-001-figma-cli-and-mcp-research"
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
| **Spec Folder** | 001-figma-cli-and-mcp-research |
| **Completed** | 2026-06-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet is research, not code. It produced a cross-checked answer to four questions: what the silships figma-cli can do, what the Figma MCP landscape offers, how to architect the `mcp-figma` skill, and how to install it safely. The deliverable is `research/research.md` with a prioritized, phaseable recommendation, backed by five iterations and an orchestrator ground-truth pass. No skill or app surface was changed.

### The recommendation
Drive Figma Desktop from the terminal with the silships figma-cli, published to npm as `figma-ds-cli`, taking the full surface from the repo build rather than the minimal npm publish. Build the `mcp-figma` skill on the sibling terminal-control model (`mcp-open-design`, `mcp-chrome-devtools`, `mcp-magicpath`) with a read-only, mutating, and destructive command gating policy. Keep the Figma MCP optional, reached through this project's Code Mode `figma` (Framelink) manual, for pulling design context into the agent for codegen. The CLI is primary; the MCP is opt-in.

### The traps, recorded as first-class output
The npm package literally named `figma-cli` is an unrelated tool (unic/figma-cli) and must never be installed. The silships figma-cli publishes to npm only as a minimal `figma-ds-cli@1.0.0` without the safe connect, daemon, or extract surface; the full surface lives in the repo build. Both traps are stated as warnings the skill must surface.

### Five iterations, converged
The fleet ran as five sequential gpt-5.5-fast iterations so the recommendation does not rest on one pass. Each iteration sharpened the prior one toward a convergent answer, and the orchestrator ground-truthed the live-observed capability and transport facts.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Canonical cross-checked recommendation |
| `research/iterations/iteration-00{1..5}.md` | Created | Per-iteration findings |
| `research/iterations/orchestrator-verifications.md` | Created | Orchestrator ground-truth pass |
| `research/prompts/`, `research/raw/` | Created | Iteration prompts and raw executor output |
| `spec.md`, `plan.md`, `tasks.md`, this file | Created | Packet control docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Via a five-iteration deep research run with `openai/gpt-5.5-fast`. Each iteration refined the prior one across the four research questions, and the orchestrator authored the canonical synthesis from the iteration findings after ground-truthing the live-observed capability and transport facts. The deliverable is `research/research.md`, and the research artifacts live under `research/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Drive Figma via the silships figma-cli (figma-ds-cli) | It drives the live Figma Desktop session from the terminal, which the Figma UI and remote API cannot |
| Take the full surface from the repo build | npm publishes only a minimal 1.0.0 without the safe connect, daemon, or extract commands |
| Never install npm `figma-cli` | It is an unrelated tool (unic/figma-cli); installing it would shadow the wrong binary |
| Model `mcp-figma` on the sibling terminal-control skills with gating | A consistent house shape plus gating keeps mutating and destructive verbs off the default path |
| Keep the Figma MCP optional via Code Mode | The community Framelink `figma` manual is already reachable through Code Mode for codegen context, but the CLI is primary |
| Stop at a recommendation | The skill build and registration are a separate follow-up phase (002) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iteration completion | PASS, five iterations produced findings |
| Convergence | PASS, the recommendation converged across iterations |
| npm trap capture | PASS, both the naming and version traps recorded as warnings |
| Orchestrator ground-truth | PASS, live-observed capability and transport facts checked |
| `validate.sh --strict` | PASS (recorded at packet completion) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Recommendation only.** No skill is built in this packet; that is phase 002.
2. **Live confirmation deferred.** The exact installed version, the live daemon behavior, and the Code Mode `figma` manual tool names are carried into phase 002 for live install and verification.
3. **Single executor.** The research ran on one model (`gpt-5.5-fast`) across five iterations rather than a multi-model fleet, so convergence is within-model.
<!-- /ANCHOR:limitations -->
