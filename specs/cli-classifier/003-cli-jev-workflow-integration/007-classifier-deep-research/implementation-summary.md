---
title: "Implementation Summary: Research Phase 3 for Classifier Models, Jev and a Local Deem"
description: "Round 3 ran and closed. Deem 0.8B is served, measured and kept current with rollback. 45 iterations over five model families, one lead review per iteration and a fresh Opus 5.5 max synthesis led to two-backend amendments to 002, 003, 005 and 006 and two new Planned phases, 008 and 009."
trigger_phrases:
  - "jev research round 3 summary"
  - "classifier research round 3 status"
  - "deem research round 3 results"
  - "cli-classifier hub research outcome"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research"
    last_updated_at: "2026-09-27T09:37:40Z"
    last_updated_by: "generate-context"
    recent_action: "Closed round 3: synthesis, phase amendments, new phases 008 and 009, validation"
    next_safe_action: "Await the operator choice of the first build, 002 zero-call census"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/research/research.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/context/deem-local.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/goal.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/goal.md"
    session_dedup:
      fingerprint: "sha256:aef7ec217812267d688987880ebfd35f24470a0cf9d2104ce987ffe7912ccde8"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
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
| **Status** | Complete |
| **Completed** | 2026-09-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Round 3 ran and closed. It asked where a classifier model, Jev hosted or Deem local, cuts the main AI's context and manual review work. Nothing was built beyond serving Deem, as the parent's D3 requires.

### Phase 7: classifier-deep-research

- **Deem check.** No Deem CLI exists. The PyPI name `deem` belongs to an unrelated project, the npm name `deem` is an unrelated 2018 API client, and `deem-cli` and `libertai-deem` exist on neither registry.
- **Deem served.** On the operator's yes, `LibertAIDAI/deem-0.8-v1` in bf16 runs on MPS at `127.0.0.1:8300` from `~/.local/share/deem/`. The launchd schedule `com.skilled.deem-update` checks for a release every 6 hours. `deem-ctl` starts, stops and updates it, proves each update with one real decision, and rolls back on request with a hold on the rejected release. `context/deem-local.md` records the install, the latency and memory, the post-run measurements (health-check cost, one request at a time, determinism and `DEEM_N_ORDERS`) and the CORS exposure.
- **The run.** 45 iterations in one fan-out, launched 2026-09-27T06:27:32Z from `506e4e6430`: grok, deepseek, mimo and swe 10 each and glm 5, all ending `maxIterationsReached` on the first attempt with no containment advisory. One Opus 5.5 high lead reviewed every iteration in its lineage's `steer.md`.
- **The synthesis.** A fresh Opus 5.5 max leaf wrote `research/research.md`: 2 build-now (R1, R19), 4 next (R2, R20, R21, R23), 18 later and 1 drop (R14), with R23 to R26 new. It checked 136 citations, of which 130 resolved, 2 drifted and 4 failed, none of them load-bearing.
- **The phases.** Following its section 14, one Opus 5.5 high leaf each amended 002, 003, 005 and 006 for two backends and authored the new Planned phases `008-cli-classifier-hub` (the hub with `cli-deem`, a Node client) and `009-cli-jev-hub-move`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, `implementation-summary.md` | Modified | The brief, the run plan, the task evidence, the goal log and this summary |
| `context/deem-local.md`, `context/research-angles.md` | Created | The Deem record and measurements, and the 45 angles with the leads' refinements |
| `scratch/research-topic.txt`, `scratch/synthesis-brief.md`, `scratch/phase-brief.md` | Created | The run topic, the synthesis brief with the run corrections, and the brief for the six phase leaves |
| `research/**` | Created | Five lineages with their `steer.md`, the merge, the resource map, the ledgers and `research.md` |
| `../002-*`, `../003-*`, `../005-*`, `../006-*` | Modified | The two-backend amendments |
| `../008-cli-classifier-hub/`, `../009-cli-jev-hub-move/` | Created | The two new Planned phases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator measured Deem, ran the fan-out in the background and sent each landed iteration to its lead. After the run it merged the lineages, built the resource map, corrected the synthesis brief and dispatched the synthesis. It reopened six citations and three recommendations itself, R23 by a live wire test. Then it dispatched the six phase leaves, updated the parent's phase map, handoffs and binding rows, and ran the convergence report and the checks.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `glm` maps iteration 1 to W1, 2 and 3 to W2, 4 to W3 and 5 to W4 | Its five angles must span all four waves (goal D5), and a contrarian lens earns most by reading its siblings |
| The Deem health check refuses the stub backend | The server answers `/health` with `ok` even when it serves the uniform-logit stub (`deem_server.py:137-154`, `:772-777`) |
| The schedule kept Deem current during the run | The operator asked for auto-update. No release landed, so every measurement is of model `8cbabbb` and source `6755b30` |
| Leads wrote their reviews as annotations for the synthesis | The loop has no per-iteration steering input, and lineages read `steer.md` only sometimes |
| The amendments were applied without a second approval | Section 14 says each waits for the operator, but the parent's D5 and fourth criterion already direct them |
| `cli-deem` is a new Node client, not a wrapper | Deem answers `jev-cli`'s `choice` and `score` with HTTP 400, confirmed live, and names its answer fields differently |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Lineage counts and stop records | grok, deepseek, mimo and swe 10 iteration files each and glm 5, every state log ending `maxIterationsReached` |
| Lead reviews | One `Review of iteration N` per iteration in each `steer.md`, plus a lineage summary |
| Containment | No advisory. `git status` showed changes only inside this packet |
| Host spot check | Six citations resolve, and R1, R19 and R23 hold against the code. The live test got HTTP 400 for `jev-cli`-shaped `choice` and `score`, and 200 with `value` for `noul` |
| `step_convergence_report` | Recorded `synthesis_incomplete`, as in rounds 1 and 2: the merge rebuilt 57 of 173 count-only findings. The synthesis read all 45 iteration files directly |
| `validate.sh --strict --recursive` on the parent | `RESULT: PASSED` on all 10 folders, 0 errors and 0 warnings |
| `check-goal.cjs` | `RESULT: PASSED (4/4 checks)` on the parent and all nine children |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Deem's quality is unmeasured.** Its accuracy on this repository's judgments is unknown and no calibration is loaded. R21's 195 labeled Gate 3 prompts under `--deem` give the first number, in about 12 s.
2. **The server is reachable from any web page.** Deem sends `Access-Control-Allow-Origin: *` with no authentication. It listens on localhost only, so it exposes compute, not data. Closing it needs a patch to Deem or a proxy, the operator's call.
3. **Whether a lineage called Deem or `jev` is unverified.** Lineage transcripts were not kept and the server's access log was off (research open question 52). Every lineage was told not to.
4. **The first transcript counts were partly void.** The dedupe rule in `context/research-angles.md` §7 ALL-7 did not say to count content blocks across all records, so `mimo` iteration 1's tool-call counts are void. Its token-usage counts stand.
<!-- /ANCHOR:limitations -->

---
