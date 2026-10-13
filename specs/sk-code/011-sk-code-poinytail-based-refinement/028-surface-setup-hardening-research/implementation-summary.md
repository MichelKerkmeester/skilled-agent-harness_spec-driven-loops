---
title: "Implementation Summary"
description: "Two five-iteration cli-devin lineages and a five-agent verification fan-out found that the surface order holds, while a fresh clone cannot reach a green battery from the adapting block, two battery legs cannot name or detect their failure, and the setup belongs in a read-only /doctor:sk-code setup command rather than a hub mode."
trigger_phrases:
  - "surface setup hardening research implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research"
    last_updated_at: "2026-10-13T18:45:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Verified both lineages and wrote the synthesis with ranked recommendations and two build phases"
    next_safe_action: "Operator picks whether to scaffold build phases P1 and P2 from research/research.md section 8"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:2d12b9501b69283398a96cfbadced8d37404e46dff5040719f2febef10ea81dd"
      session_id: "dr-028-surface-setup-hardening-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1 to Q6, see research/research.md sections 3 to 7"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-surface-setup-hardening-research |
| **Completed** | 2026-10-13 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You now have a checked answer to how the external-user surface rule can still break and where the setup should live. The order itself holds: a surface added ahead of `sk-code-opencode` wins, check 5l catches a declared one placed after it, and the README refresh-and-copy step makes a hand-added surface route first. The gaps are on the way in and in the battery.

### Phase 28: surface-setup-hardening-research

`research/research.md` holds 32 checked findings (F1 to F32, two of them rejected), five ranked recommendations (R1 to R5), eleven rejected ideas (X1 to X11), the doctor-versus-mode answer and two build phases with goal sketches. No skill, command, script or README changed.

The answer to the operator's question is a read-only doctor command, `/doctor:sk-code setup`. A `sk-code-setup` hub mode fails the registry's two-axis contract and no setup prompt would route to it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Verified synthesis |
| `research/lineages/deepseek-max/`, `research/lineages/swe-max/` | Created | Each lineage's config, state, ledgers, prompts, receipts, five iterations and deltas |
| `research/deep-research-config.json`, `findings-registry.json`, `deep-research-findings-registry.json`, `fanout-attribution.md`, `resource-map.md` | Created | Fan-out config and merge outputs |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, `implementation-summary.md` | Modified | Charter, findings fence, outcome and log |
| `../spec.md`, `../goal.md`, `../graph-metadata.json` | Modified | Phase row 28, handoff row, binding row, criteria counts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator executed the `/deep:research` auto YAML step by step, as 025 did, with the two lineages under `research/lineages/<label>/`. Each round dispatched both lineages at once through the YAML's `cli-devin` branch (`buildLineageCommand` and `runAuditedExecutorCommand`), then ran `verify-iteration.cjs`, the reducer and the graph upsert per lineage. After the merge, five `cli-devin` DeepSeek agents checked one area each in parallel, and the orchestrator reread every cited line and ran six experiments of its own in throwaway copies before marking a finding CONFIRMED.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Per-round foreground dispatch instead of `fanout-run.cjs` | One foreground call is capped at ten minutes and the brief bars idle waits on a detached job; the same per-iteration path 025 used |
| Rule against swe-max's P0 on the activation manifest | Three independent runs routed a hand-added surface first after the README refresh and copy |
| `/doctor:sk-code setup` over a target under `/doctor:skill-advisor` | The doctor index says one command per owner and scopes the advisor command to the skill graph |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iteration records per lineage | 5 and 5 `"type":"iteration"` records |
| `verify-iteration.cjs` | Exit 0 for all ten iterations; swe-max iteration 5 first failed `state_record_missing` and passed after the orchestrator recorded the leaf's record |
| Dispatch receipts | All ten `devin` dispatches exit 0 |
| Verification fan-out | Five reports; one claim corrected (V4.6's README answer searched only `.skilled/`), one PARTLY (V3.2) |
| Orchestrator experiments | E1 to E6 in copies under the scratchpad's `028/` folder |
| Goal criteria and strict validation | See `goal.md` log |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One advisor measurement is the verifier's.** The orchestrator's advisor probe could not bind a socket under the scratchpad's long path; F28 rests on the contract line and verifier V5's run.
2. **Two out-of-scope writes by verifier agents were found and undone.** Two output files at the worktree root were removed, and one verifier restored `description.json` itself; `git status` was clean afterwards.
3. **Some workflow steps were simplified, as in 025.** The single-loop telemetry rows and the executor block in the state projection were not written, and the convergence-report closeout was not run per lineage.
<!-- /ANCHOR:limitations -->
