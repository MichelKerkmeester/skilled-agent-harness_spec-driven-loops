---
title: "Implementation Summary: Research Phase 3 for Classifier Models, Jev and a Local Deem"
description: "Round 3 is prepared and has not run. Deem 0.8B is served and measured, and the spec, plan, tasks, 45 angles, a topic draft and the synthesis brief exist. No lineage, lead, merge or synthesis has run yet."
trigger_phrases:
  - "jev research round 3 summary"
  - "classifier research round 3 status"
  - "deem research preparation status"
  - "round 3 not yet run"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research"
    last_updated_at: "2026-09-27T06:30:00Z"
    last_updated_by: "preparation-leaf"
    recent_action: "Wrote the round-3 spec, plan, tasks, 45 angles, topic draft and synthesis brief"
    next_safe_action: "Tighten the topic, ping the five executors and dispatch the five lineage leads"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/context/research-angles.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Research Phase 3 for Classifier Models, Jev and a Local Deem

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-classifier-deep-research |
| **Status** | In Progress |
| **Completed** | Not yet |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Round 3 is prepared, and the research has not run. No lineage, lead, merge or synthesis exists yet, so this file records the preparation and the Deem install only.

### Phase 7: classifier-deep-research

- **Deem check.** The orchestrator confirmed on 2026-09-27 that no Deem CLI exists. The PyPI name `deem` belongs to an unrelated project, the npm name `deem` is an unrelated 2018 API client, and `deem-cli` and `libertai-deem` exist on neither registry.
- **Deem install.** The operator chose the 0.8B in bf16 over the 9B. The orchestrator installed `LibertAIDAI/deem-0.8-v1` at Hugging Face commit `8cbabbb` under `~/.local/share/deem/` and serves it on MPS at `127.0.0.1:8300`. It measured a p50 of about 60 ms, a p95 of 63 to 79 ms and a 3.4 GB footprint (`context/deem-local.md`). The model is uncalibrated, and its quality here is unmeasured. The 9B stays a documented option.
- **Preparation.** An Opus 5.5 high leaf wrote this phase's spec, plan and tasks, 45 angles in four waves (`context/research-angles.md`), a topic draft (`scratch/research-topic-draft.txt`) and the synthesis brief (`scratch/synthesis-brief.md`).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modified | The research brief, run plan, tasks and this status |
| `context/research-angles.md` | Created | 45 angles, the per-iteration contract and the coverage tables |
| `scratch/research-topic-draft.txt`, `scratch/synthesis-brief.md` | Created | The topic draft for the prompt-improver and the brief for the synthesis leaf |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The run follows `plan.md` section 4: the topic pass, the executor pings, the lead previews, then the fan-out.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `glm` maps iteration 1 to W1, 2 and 3 to W2, 4 to W3 and 5 to W4 | Its five angles must span all four waves (goal D5), and a contrarian lens earns most by reading its siblings |
| The Deem health check is defined by the research, not assumed | The server answers `/health` with `status` `ok` even when it serves the uniform-logit stub (`deem_server.py:137-154`, `:772-777`), so an angle must define the check from code |
| Angles point at the Jev and Deem field names without stating a verdict | The code suggests a gap between the Python `jev-cli` request and Deem's parser, and a brief that states the answer would only confirm it |
| Deem stays at Hugging Face commit `8cbabbb` until the run settles | The operator wants Deem kept current, but an update mid-run would give lineages measurements of two different models |
| The synthesis may propose at most six new phases | The parent D2 requires a `cli-classifier` hub, but every further folder must earn its place against `prevent-overengineering.md` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fan-out, leads, synthesis and reconciliation | Not run |
| `validate.sh --strict` on this phase | Run after preparation, result recorded in the preparation report |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Deem's quality is unmeasured.** `context/deem-local.md` measures the served 0.8B's speed and memory on synthetic inputs, not its accuracy on this repository's judgments, and no calibration file is loaded. Every 9B figure is a vendor claim.
2. **The wire gap is inferred.** The field-name difference between the Python `jev-cli` and Deem's server comes from reading code, not from a live call.
<!-- /ANCHOR:limitations -->

---
