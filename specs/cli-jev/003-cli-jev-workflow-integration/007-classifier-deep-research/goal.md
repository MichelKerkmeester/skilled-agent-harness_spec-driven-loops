---
title: "Goal: Phase 7: classifier-deep-research"
description: "The durable directive for research round 3 on classifier models, Jev and a local Deem, and the criteria that decide when it is done."
trigger_phrases:
  - "classifier research round 3 goal"
  - "deem local classifier research"
  - "jev deem context reduction research"
  - "five lineage classifier fan-out"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research"
    last_updated_at: "2026-09-27T05:40:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Authored the durable directive"
    next_safe_action: "Check online for a Deem CLI and a Mac serving route"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/goal.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: classifier-deep-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Research, over 45 forced iterations on five model families, where a classifier model, Jev (hosted, keyed) or Deem (open weights, local on this MacBook), cuts the main AI's context and manual review work, then synthesize with a fresh Opus 5.5 max leaf and reconcile the Planned build phases.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Deem first: check online for an existing Deem CLI and an Apple Silicon serving route, then put a Deem install plan with its rollback to the operator and install only on a yes. The operator chose the 0.8B in bf16, kept current with Deem's releases; the 9B stays a documented option. The orchestrator, never a lineage, measures the served model (health check, latency, memory) into `context/deem-local.md`. The research does not wait for the yes: without numbers at launch, lineages work from Deem's docs and later waves read the numbers once they exist. A no or a failed install makes Deem design-only, recorded |
| D2 | Lineages, all in one fan-out run, stop policy max-iterations, convergence off, concurrency 5: `grok` (cli-cursor, `grok-4.7-xhigh-fast`, no MAX tier) 10; `deepseek` (cli-pi llmgateway, `deepseek-v4.1-flash` max) 10; `mimo` (cli-pi llmgateway, `mimo-v2.6-pro` high) 10; `swe` (cli-devin, `swe-2-max`) 10; `glm` (cli-pi, `glm-5.3-flash` max, since the runner has no Cline route) 5 |
| D3 | Questions. A: Deem on this Mac (serving, latency, memory, 0.8B against 9B on the same judgments from their published numbers, accuracy against Jev, an existing Deem CLI, `cli-deem`'s place in a `cli-classifier` hub beside `cli-jev`, and whether jev-cli's `custom` provider and hidden `--endpoint` make it a thin wrapper rather than a fork). B: round 1 and 2 drops that were drops only for cost, quota, latency or egress, and whether they flip. C: context reduction (skill and resource routing including ROUTER leaves, retrieval reranking, file relevance, compaction keep or drop, tool-output pruning). D: validators (map every template-alignment check in spec-kit, sk-doc, check-goal, frontmatter and command, skill and agent docs, then the judgment calls an AI still makes after they pass, and the precision a classifier reaches on them). E: sk-prompt (framework pick, CLEAR scoring, ambiguity). F: sk-design (mode routing, rubric scoring). G: open discovery. H: order, savings in tokens, AI passes and minutes, cost and kill criteria |
| D4 | Answer shape: seam `file:line`, metric with baseline and harness, the two-backend gate with exact no-backend behavior, smallest slice, rough LOC, verdict build-now, next, later or drop. Every claim is marked confirmed or inferred, and the Python `jev-cli` and the npm `jevctl` stay apart |
| D5 | 45 angles in widening waves in `context/research-angles.md`. Iteration N takes angle `<label>-NN`, builds on its lineage's last iteration and, from wave 2, on the newest sibling iterations. A finding repeated without new evidence counts for nothing, and only wave-1 agreement counts as corroboration |
| D6 | One Opus 5.5 high lead per lineage previews its prompt before launch. For each iteration the orchestrator reports, the lead checks new ground, cited `file:line` and the angle, appends its review and steering to `research/lineages/<label>/steer.md` (which each iteration reads first) and reports back. It reruns a short lineage alone after the main run ends and never edits an iteration file |
| D7 | Lineages write only inside their own directory and make no Jev call. Only the orchestrator calls the local Deem server. A fresh Opus 5.5 max leaf writes `research/research.md`. Opus 5.5 high leaves amend 002, 003, 005 and 006 for both backends and author each new Planned phase, the `cli-classifier` hub and `cli-deem` included |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] An online check for an existing Deem CLI and a Mac serving route is recorded, the Deem install plan with its rollback went to the operator, and `context/deem-local.md` records the 0.8B bf16 passing a health check with latency and memory, or why it does not serve here
- [ ] `context/research-angles.md` defines 45 angles from `grok-01` to `glm-05`, and each lead previewed its lineage prompt before launch
- [ ] `research/lineages/grok/`, `deepseek/`, `mimo/` and `swe/` hold `iteration-001.md` to `iteration-010.md`, `glm/` holds `iteration-001.md` to `iteration-005.md`, and each state log's last record has `stopReason` `maxIterationsReached`
- [ ] Each lineage's `steer.md` holds one lead review per iteration
- [ ] `research/research.md`, by a fresh Opus 5.5 max leaf, answers questions A to H in the answer shape, marks every citation resolved, drifted or failed and ranks each recommendation build-now, next, later or drop
- [ ] 002, 003, 005 and 006 carry the two-backend gate, each new phase the synthesis proposes is a Planned child with `spec.md`, `plan.md`, `tasks.md` and `goal.md`, and `validate.sh --strict` on this phase prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase opened | In Progress | Scaffolded by `create.sh --phase` on 2026-09-27 after the operator approved the round-3 prompt |

### Deviations and findings

| Item | Note |
|------|------|
| GLM route | The operator's prompt named cli-cline. The fan-out runner has no Cline route (`fanout-run.cjs:2185-2188`), so `glm-5.3-flash` max runs on cli-pi, which the operator approved |
| Grok tier | Cursor lists no Grok 4.7 MAX tier, so `grok-4.7-xhigh-fast` runs `grok`, as in rounds 1 and 2 |
| Deem calls | Only the orchestrator calls the local Deem server, so five concurrent lineages cannot load it at once or skew its latency numbers |
<!-- /ANCHOR:log -->
