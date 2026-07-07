---
title: "Implementation Summary: Command lane-asking for the model-benchmark lane"
description: "Phase 008 shipped the two-lane command experience: the agent-improvement command now resolves a use-case lane and a dedicated model-benchmark command plus its workflow YAMLs make Lane B first-class. A latent loop-host arg-forwarding defect was fixed."
trigger_phrases:
  - "command lane-asking summary"
  - "model-benchmark command summary"
  - "lane-asking implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-deep-agent-improvement-benchmark-mode/008-add-model-benchmark-lane-selection-prompts"
    last_updated_at: "2026-05-29T09:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped two-lane commands and fixed loop-host scorer/grader forwarding"
    next_safe_action: "Begin phase 009 SKILL.md two-lane work"
    blockers: []
    key_files:
      - ".opencode/commands/deep/start-model-benchmark-loop.md"
      - ".opencode/commands/deep/start-agent-improvement-loop.md"
      - ".opencode/skills/deep-agent-improvement/scripts/loop-host.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-add-model-benchmark-lane-selection-prompts |
| **Completed** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The model-benchmark lane is now first-class at the command layer. Before this phase the only way to benchmark a model or prompt framework was to call `loop-host.cjs --mode=model-benchmark` by hand, and the `/deep:start-agent-improvement-loop` command never asked which use case the operator wanted. Phase 008 closes both gaps.

### Lane resolution in the existing command

`/deep:start-agent-improvement-loop` gained an additive `lane` resolution. When an agent path is supplied (the normal Lane A invocation) the lane resolves to `agent-improvement` with no new prompt and the command runs exactly as before. A `--lane=model-benchmark` flag or a `--profile` argument routes to Lane B. Only when the lane is genuinely ambiguous (no agent path, no flag, interactive mode) does a new first question `Q(lane)` appear. This preserves CMD-1 behavioral identity for every existing Lane A invocation.

### Dedicated model-benchmark command

A new `/deep:start-model-benchmark-loop` command is the direct Lane B entry for operators who already know the lane. It gathers Lane B inputs (profile, outputs or spec folder, execution mode, scoring method, grader, optional executor and model) and loads the new Lane B workflow YAMLs. A gemini mirror keeps runtime parity.

### Lane B workflow YAMLs

`deep_start-model-benchmark-loop_auto.yaml` and `_confirm.yaml` follow the structure of the agent-improvement YAMLs but drop the agent-only steps (scan-integration, generate-profile) and run the model-benchmark pipeline through `loop-host.cjs --mode=model-benchmark` (which runs materialize then run-benchmark), then reduce-state, journal, dashboard, and optional mode-aware promotion.

### loop-host scorer and grader forwarding fix

Independent verification found a latent defect. `loop-host.cjs` `planInvocation()` never forwarded `--scorer` or `--grader` to `run-benchmark.cjs`, so selecting `5dim` or a `mock` or `llm` grader through any command path was a silent no-op that fell back to `pattern` and `noop`, and the report disagreed with the journal. The fix forwards both flags in the model-benchmark branch only, so Lane A byte-identity (TST-1) is untouched. A regression test now asserts the propagation.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/deep/start-agent-improvement-loop.md` | Modified | Additive lane resolution and Lane B handoff, Lane A unchanged |
| `.opencode/commands/deep/start-model-benchmark-loop.md` | Created | Dedicated Lane B command |
| `.gemini/commands/deep/start-model-benchmark-loop.toml` | Created | Gemini mirror |
| `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml` | Created | Lane B autonomous workflow |
| `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_confirm.yaml` | Created | Lane B interactive workflow |
| `.opencode/commands/README.txt` | Modified | Deep group count 4 to 5, tree, command table |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | Modified | `deep-model-benchmark` canonical alias group |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Modified | Command-level lane disambiguation phrases |
| `.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs` | Modified | Forward `--scorer` and `--grader` in the model-benchmark branch |
| `.opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts` | Modified | Regression test for scorer and grader propagation |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The authoring ran as a 5-agent Workflow with disjoint file ownership (008 docs, Lane B YAMLs, dedicated command plus mirror, the additive command edit, advisor plus README) followed by an independent verification agent. The verifier confirmed CMD-1, advisor routing, vitest, and artifact presence, and surfaced the loop-host forwarding defect, which the orchestrator then fixed and re-verified.

The advisor disambiguation was partly pre-wired from earlier session work and was completed here with the canonical `deep-model-benchmark` alias group plus bounded command-level phrase nudges.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Lane question is additive, agent-path auto-resolves to Lane A | Preserves CMD-1 behavioral identity for every existing invocation |
| Ship a dedicated command in addition to the asking command | Operators who know the lane skip the question, per the approved plan |
| Scope the loop-host fix to the model-benchmark branch | Keeps the agent-improvement plan byte-identical, so TST-1 stays green |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| CMD-1 Lane A behavioral identity | PASS. Agent-path resolves to `agent-improvement` with no new question, Lane A workflow intact |
| TST-1 byte-identity gate | PASS. `loop-host.vitest.ts` backward-compat test green, fix is model-benchmark branch only |
| Lane B end-to-end (`pattern`) | PASS. `loop-host --mode=model-benchmark --scorer=pattern` reaches `status=benchmark-complete`, `scoringMethod=pattern`, record `mode=model-benchmark` |
| Lane B end-to-end (`5dim`, post-fix) | PASS. Same path with `--scorer=5dim` now yields `scoringMethod=5dim` (silent fallback fixed) |
| vitest (deep-agent-improvement scripts) | PASS. 12 files, 132 tests, including the new propagation test |
| Advisor routing both lanes | PASS. "benchmark a model" ranks `deep-model-benchmark` above `deep-agent-improvement`, "improve the debug agent file" routes to agent-improvement with no benchmark leak |
| `validate.sh --strict` on 008 | PASS. 0 errors, 0 warnings |
| README plus gemini mirror present | PASS. README lists 5 deep commands, `start-model-benchmark-loop.toml` exists |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Skill docs not yet two-lane.** SKILL.md still frames model-benchmark as Mode 4 rather than a co-equal lane. That restructure is phase 009.
2. **References, assets, and scripts not yet lane-separated.** Physical lane separation is phases 010 and 013.
3. **Live advisor routing depends on a dist rebuild.** The source change is committed, and the compiled advisor plus skill graph rebuild on MCP start.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
