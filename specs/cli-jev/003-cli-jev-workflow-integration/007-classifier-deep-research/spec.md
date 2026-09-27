---
title: "Research Phase 3: Classifier Models, Jev and a Local Deem"
description: "Round 3 of the Jev research. Five lineages run 45 forced iterations on Grok 4.7, DeepSeek V4.1 Flash, MiMo V2.6 Pro, SWE-2 Max and GLM-5.3-Flash to find where a classifier model, Jev hosted or Deem local, cuts the main AI's context and review work, then a fresh Opus 5.5 max leaf synthesizes and the Planned phases are reconciled for both backends."
trigger_phrases:
  - "jev research round 3"
  - "deem local classifier research"
  - "classifier context reduction research"
  - "five lineage classifier fan-out"
  - "cli-classifier hub research"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Research Phase 3: Classifier Models, Jev and a Local Deem

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-27 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 9 |
| **Predecessor** | 006-goal-criteria-lint |
| **Successor** | 008-cli-classifier-hub |
| **Handoff Criteria** | All five lineages reach their cap with one lead review per iteration, `research/research.md` answers questions A to H in the answer shape with every citation marked resolved, drifted or failed, and 002, 003, 005 and 006 plus every new Planned phase carry the two-backend gate |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the cli-jev workflow integration specification.

**Scope Boundary**: Research only. Lineages read anywhere, including `../context/` and this phase's `context/deem-main/`, and write only inside their own directory under `research/lineages/`. The only writes outside this folder are later phase amendments to 002, 003, 005 and 006 and new Planned phases under the parent, both done by the orchestrator through its leaves. Nothing recommended is built. Deem 0.8B bf16 is installed and served by the orchestrator on the operator's yes (parent D3) and measured in `context/deem-local.md`. Updating, stopping and removing it stay the orchestrator's, and only the orchestrator calls it.

**Dependencies**:
- `../004-deep-research-expansion/research/research.md` (the round-2 final synthesis, R1 to R22) and `../001-deep-research/research/research.md` (the round-1 re-synthesis and What Not To Build rows 1 to 43)
- The vendored Deem repository in `context/deem-main/`, the orchestrator's install record and measurements in `context/deem-local.md` and the transport skill `.skilled/skills/cli-jev/`
- `pi` with the `llmgateway` provider (`deepseek-v4.1-flash`, `mimo-v2.6-pro`, `glm-5.3-flash`), `cursor-agent` listing `grok-4.7-xhigh-fast` and `devin` serving `swe-2-max`
- The shared fan-out runner `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`

**Deliverables**:
- `context/research-angles.md` with 45 angles in four waves, a research topic and a synthesis brief under `scratch/`
- One fan-out run of five lineages, 45 iterations in all, with one lead review per iteration in each lineage's `steer.md`
- A fresh Opus 5.5 max `research/research.md` that answers questions A to H
- 002, 003, 005 and 006 amended for both backends, and each new phase the synthesis proposes authored as a Planned child

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Rounds 1 and 2 asked where Jev, a hosted and keyed typed-judgment model, earns a place here. They dropped many ideas for cost, quota, latency or egress, reasons that may not hold for an open-weights model served on this Mac. Deem is such a model. Its 0.8B now serves here at about 60 ms per call, inside the hook deadlines that ruled out live forms before. It is uncalibrated, its quality on this repository's judgments is unmeasured and no Deem CLI exists to install, update or roll it back. Neither round asked the questions the operator now cares about most: which classifier judgments cut the main AI's context and manual review work, and which validator judgment calls survive after every template check passes.

### Purpose
Give the operator one ranked synthesis that says, per idea, whether a classifier on Jev, on a local Deem or on either earns a build phase, with a seam, a baseline and a two-backend gate, and give Deem a clear place in a `cli-classifier` hub or a recorded reason why it has none.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 45 angles in four widening waves, a research topic and a synthesis brief for round 3.
- One fan-out: `grok` (cli-cursor, `grok-4.7-xhigh-fast`), `deepseek` (cli-pi, `deepseek-v4.1-flash` max), `mimo` (cli-pi, `mimo-v2.6-pro` high) and `swe` (cli-devin, `swe-2-max`) at 10 iterations each, and `glm` (cli-pi, `glm-5.3-flash` max) at 5, forced to the cap.
- One Opus 5.5 high lead per lineage that previews the prompt and reviews and steers every iteration through `steer.md`.
- A fresh Opus 5.5 max synthesis, then the reconciliation of the Planned build phases for both backends.

### Out of Scope
- Installing, serving, updating or removing Deem. The orchestrator owns them under parent D3. The research designs `cli-deem`'s lifecycle, including updates on new Hugging Face commits, but runs none of it. The 9B stays a documented option that nobody serves.
- Building any recommendation. Every build phase stays Planned.
- A live `jev` call or a Deem server call from any lineage. The first spends quota and could send repository text, and the second would let five lineages load one server and skew its numbers.
- Fixing the fan-out merge parser, which under-counts findings. It is recorded for its owner.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | The research brief, run plan, tasks and status of this phase |
| `context/research-angles.md`, `scratch/research-topic-draft.txt`, `scratch/synthesis-brief.md` | Create | Round-3 angles, the topic draft and the synthesis brief |
| `context/deem-local.md` | Created by the orchestrator before launch | Deem 0.8B on this Mac: install, health check, latency and memory |
| `research/**` | Create | Five lineages, leads' `steer.md` files, the merge and the final synthesis |
| `../002-*/`, `../003-*/`, `../005-*/`, `../006-*/`, `../NNN-*/` | Modify / Create | Planned phases amended for both backends and new Planned phases, by the orchestrator's leaves |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:research-brief -->
## Research Brief

**Read first**: `../004-deep-research-expansion/research/research.md` (sections 1, 11 with What Not To Build, 12 and 13), the drop list in `../001-deep-research/research/research.md`, the vendored Deem repository in `context/deem-main/`, the transport skill `.skilled/skills/cli-jev/` and `context/deem-local.md` once it exists.

| ID | Question |
|----|----------|
| A | Deem on this Mac: how the served 0.8B serves, its latency and memory, the 0.8B against the 9B on the same judgments from their published numbers, its accuracy against Jev, whether any Deem CLI exists, where `cli-deem` sits in a `cli-classifier` hub beside `cli-jev`, its lifecycle (install, start, health, update on a new Hugging Face commit and rollback), and whether the Python `jev-cli`'s `custom` provider and hidden `--endpoint` make `cli-deem` a thin wrapper rather than a fork |
| B | Which round-1 and round-2 drops were drops only for cost, quota, latency or egress, and which of them flip under a free, private, local model |
| C | Context reduction: skill and resource routing including ROUTER leaves, retrieval reranking, file relevance, compaction keep or drop and tool-output pruning |
| D | Validators: map every template-alignment check in spec-kit, sk-doc, `check-goal.cjs`, frontmatter and the command, skill and agent docs, then the judgment calls an AI still makes after they pass, and the precision a classifier reaches on them |
| E | sk-prompt: framework pick, CLEAR scoring and ambiguity |
| F | sk-design: mode routing and rubric scoring |
| G | Open discovery: new skills and workflows with measured value |
| H | Order, savings in context tokens, AI passes and minutes, cost and kill criteria |

**Answer shape** (goal D4): every recommendation names its seam at `file:line`, the metric with its baseline and harness, the two-backend gate with exact no-backend behavior, the smallest slice, a rough size in LOC and a verdict of build-now, next, later or drop with one sentence of reason. Every claim is marked confirmed from code or a count, or inferred with what would confirm it. The Python `jev-cli` 0.6.2 and the npm `jevctl` 0.2.3 stay apart in every sentence. Deem's vendor figures and every 9B figure stay labeled as vendor claims, while `context/deem-local.md` holds measured speed and memory for the served 0.8B, never its quality.

**Two-backend gate** (parent D1): a feature is dormant unless a backend is available. Jev is available when `jev auth status --provider <p>` exits 0 for the provider the feature uses. Deem is available when the local server passes a health check. With neither, behavior is exactly today's. Jev gets no secret.
<!-- /ANCHOR:research-brief -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Deem check is recorded and the install followed the operator's yes | The online check (no Deem CLI on GitHub, PyPI or npm) and the Mac serving route are recorded, the install plan with its rollback went to the operator before any install, and `context/deem-local.md` records the 0.8B bf16 passing a health check with latency and memory |
| REQ-002 | 45 angles exist and each lead previewed its lineage prompt | `context/research-angles.md` defines `grok-01` to `grok-10`, `deepseek-01` to `deepseek-10`, `mimo-01` to `mimo-10`, `swe-01` to `swe-10` and `glm-01` to `glm-05`, and the goal log records five previews before launch |
| REQ-003 | Five lineages run to their cap | `research/lineages/{grok,deepseek,mimo,swe}` each hold `iteration-001.md` to `iteration-010.md`, `glm` holds `iteration-001.md` to `iteration-005.md`, and each state log's last record carries `stopReason` `maxIterationsReached` |
| REQ-004 | Each iteration has one lead review | Each lineage's `research/lineages/<label>/steer.md` holds one review per iteration, naming the iteration number, and no iteration file was edited by a lead |
| REQ-005 | A fresh Opus 5.5 max leaf writes the final synthesis | `research/research.md` answers questions A to H in the answer shape, marks every citation resolved, drifted or failed and ranks each recommendation build-now, next, later or drop |
| REQ-006 | Every recommendation obeys the two-backend gate | Each names its own switch, how it detects Jev and Deem, which one it prefers when both are available, and states that with neither it behaves exactly as today |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Build phases match the final synthesis | 002, 003, 005 and 006 carry the two-backend gate, and each proposed phase, the `cli-classifier` hub and `cli-deem` included, is a Planned child with `spec.md`, `plan.md`, `tasks.md`, `goal.md`, a binding row and a phase-map row |
| REQ-008 | Containment holds | No lineage wrote outside its own directory, no lineage called `jev` or the Deem server, and every containment advisory is attributed in the synthesis |
| REQ-009 | The phase validates | `validate.sh --strict` on this phase prints `RESULT: PASSED` and `check-goal.cjs` passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The operator can say, from one synthesis and without rereading rounds 1 and 2, which classifier ideas to build on Jev, on Deem or on either, and in what order.
- **SC-002**: Every build-now recommendation states its savings in context tokens, AI passes or minutes against a counted baseline, not an estimate.
- **SC-003**: Deem either has a measured place in `cli-classifier` or a recorded reason why it does not serve here.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's yes on the Deem install (given for the 0.8B in bf16 on 2026-09-27) | Without it, Deem would stay design-only | The research does not wait: lineages work from Deem's docs and code, later waves read `context/deem-local.md` once it exists, and a no is recorded as design-only (goal D1) |
| Risk | Deem may not serve on Apple Silicon | The two-backend gate collapses to Jev only | Resolved for the 0.8B: it serves on MPS with `DEEM_DEVICE=mps` set by hand and no code change (`deem-local.md:24`). Open for the 9B, which stays a documented option compared from published numbers in grok-01 |
| Risk | The served 0.8B is fast but unmeasured | A feature ships on speed alone | It is uncalibrated and its quality here is unmeasured (`deem-local.md:27`, `:52-53`). mimo-03 designs the comparison against Jev, and the synthesis ranks no Deem feature above later without a measured accuracy set or a zero-call first slice |
| Risk | An update changes the model under the run | Iterations and measurements describe different models | No lineage calls the server, so an update cannot touch an iteration. `context/deem-local.md` stays unedited until the run settles and is re-measured then if the served commit changed. Every Deem figure cites the commit it was measured on. deepseek-02 designs the `cli-deem` update and rollback against the tested `deem-ctl` |
| Risk | The `custom` route may not reach Deem unchanged | `cli-deem` becomes a translator or a separate client, not a thin wrapper | The Python `jev-cli` sends `criteria` and reads `answers.answer.<type>` (`jev_cli/__init__.py:364-369`, `:389-393`), while Deem reads `options` and `levels` and returns `value` and `level` (`deem_server.py:535`, `:542`, `:606`, `:618`). Inferred from code, unverified live. Angles grok-02, swe-01 and deepseek-06 settle it field by field |
| Risk | Five concurrent lineages may collide | Rate limits, retries or a short lineage | Three lineages share cli-pi and the `llmgateway` provider (`fanout-run.cjs:2532-2550`). Concurrency stays 5, the runner retries up to 5 times, and a lineage short of its cap is rerun alone under its label by its lead |
| Risk | Orchestrator writes during the run trip containment | A lineage fails or records advisories | Sibling lineage directories are excluded from each lineage's containment (`fanout-run.cjs:3458-3459`), so leads' `steer.md` writes are safe. A new untracked file outside them is advisory only (`write-containment.ts:244-247`). The orchestrator edits no tracked file outside `research/lineages/`, `context/deem-local.md` included, until the run settles |
| Risk | Lead steering lags about one iteration | A steer lands after the next iteration has started | Each lineage runs its iterations back to back, so a review of iteration N usually reaches iteration N+2. Leads write steering that still holds two iterations ahead, and the synthesis reads `steer.md` beside each iteration |
| Risk | Lead steering can erode wave-1 independence | Opus steering becomes a hidden shared source | Leads never pass a sibling lineage's findings into a wave-1 steer, and the synthesis counts a wave-1 agreement only when neither lineage's steer suggested it |
| Risk | The merge parser under-counts findings | Registry gaps, as in rounds 1 and 2 | The synthesis reads every iteration file directly and never trusts a merged count |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the Python `jev-cli`'s `custom` provider reach Deem's `/v1/systemone` unchanged for `noul`, `choice` and `score`, or only through `run` with Deem-shaped questions? The code read above suggests a field-name gap, and no live call has tested it.
- The `custom` provider needs a stored `JEV_API_KEY` before any request (a probe with an endpoint and no key exits 3), while Deem's server has no auth. What does `cli-deem` put there without inventing a secret?
- A warm 0.8B answers in about 60 ms, but what does a hook pay to reach it: a process spawn, a connection or a cold start of about 10 s (`deem-local.md:44`, `:50`)? That decides whether the advisor and PreCompact drops truly reopen.
- How should the local model follow Deem's releases, which appear only as new Hugging Face commits, without silently changing answers that a measured keep rule depends on?
- Which validator judgment calls recur often enough to earn a classifier, and is there gold to measure one?
<!-- /ANCHOR:questions -->

---
