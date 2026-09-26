---
title: "Research Phase: Jev Typed Judgments Across .skilled Skills and Workflows"
description: "Three-lineage deep research, 10 iterations each on DeepSeek V4.1 Flash max and MiMo V2.6 Pro high through cli-pi and on Grok 4.7 xhigh fast through cli-cursor, into where Jev typed judgments earn a measured, opt-in place in .skilled. A fresh Opus synthesis ranks every recommendation build-now, next, later or drop."
trigger_phrases:
  - "jev workflow integration research"
  - "jev typed judgment seams"
  - "three lineage jev research"
  - "grok 4.7 cursor lane"
  - "jev opt-in measured integration"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Research Phase: Jev Typed Judgments Across .skilled Skills and Workflows

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-09-26 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 1 (build phases are scaffolded from this phase's synthesis) |
| **Predecessor** | None |
| **Successor** | None until the synthesis proposes build phases |
| **Handoff Criteria** | All three lineages reach iteration 10, `research/research.md` ranks every recommendation with its seam, metric, opt-in behavior and smallest slice, and every cited `file:line` in the ranked list was reopened |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the cli-jev workflow integration specification.

**Scope Boundary**: Research, plus one setup change. Lineages read anywhere in the repository and write only inside their own directory under `research/lineages/`. The setup change adds the Grok 4.7 model id to cli-cursor's allowlist, tests and docs so the Grok lane can run. After the synthesis, this phase scaffolds the proposed build phases as Planned siblings and implements none of them.

**Dependencies**:
- `pi` 0.87.1 on PATH with the `llmgateway` provider in `.pi/models.json`, which declares `deepseek-v4.1-flash` and `mimo-v2.6-pro`
- `cursor-agent` 2026.09.26 on PATH and logged in, which lists `grok-4.7-xhigh-fast`
- The shared fan-out runner `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`

**Deliverables**:
- Four context digests and a research-angles file under `context/`, a research topic and a synthesis brief under `scratch/`
- The Grok 4.7 id accepted by cli-cursor, with passing tests and a live probe
- Three lineage runs with their iteration files, state logs and lineage syntheses
- A merged `research/research.md` with the ranked recommendation list and a proposed phase list
- The proposed build phases scaffolded as Planned siblings under the parent packet

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`cli-jev` returns typed judgments, and no other part of `.skilled` asks for one. The operator has four candidate uses in `../context/ideas from michel kerkmeester.md`, and `../context/` vendors five outside Jev integrations. None has been tested against the seams in this repository or given a metric and a baseline. Picking builds from that list today would be a guess, and the repository rules ask for measured usefulness and against speculative machinery.

### Purpose

Produce a ranked, evidence-cited list of Jev integrations for `.skilled`, each with a seam, a metric on an existing harness, opt-in and no-key behavior and a smallest first slice, so the operator can pick build phases without rereading the repository.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The research questions RQ1 to RQ7 below, answered across all three lineages.
- Reading the vendored material under `../context/` and the repository: its rules, skills, hooks, commands and runtimes.
- The Grok 4.7 cli-cursor allowlist entry, its tests and its docs.
- Scaffolding the build phases the synthesis proposes, as Planned siblings with filled documents.

### Out of Scope

- Building any recommendation. The scaffolded phases stay Planned.
- Any edit to `cli-jev` or `cli-usage`, or to the vendored repositories.
- Running `validate.sh`, `generate-context.js`, test suites or any git write from inside a lineage.
- Sending a key or secret to Jev, or writing one into any artifact.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `context/repo-rules-digest.md`, `seam-map.md`, `jev-material-digest.md`, `measurement-digest.md` | Create | What the repository values, where Jev could plug in, what the vendored material shows, and which harnesses can measure usefulness |
| `context/research-angles.md` | Create | Three lenses and 30 label-keyed angles in four widening waves |
| `scratch/research-topic.txt`, `scratch/synthesis-brief.md` | Create | The one-line fan-out topic and the brief for the synthesis leaf |
| `research/lineages/{deepseek,mimo,grok}/` | Create | Lineage state, iterations and lineage synthesis |
| `research/research.md` | Create | Merged, ranked synthesis across the three lineages |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Add `grok-4.7-xhigh-fast` to the cli-cursor allowlist |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Mirror the allowlist the runner checks |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts`, `fanout-run.vitest.ts` | Modify | Cover the new id |
| `.skilled/skills/cli-external-orchestration/cli-cursor/**` | Modify | Document the new id and add a changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:research-brief -->
## Research Brief

### Where to read

- **The operator's intent:** `../context/ideas from michel kerkmeester.md`, and `REPO RULES.md` with `.skilled/repo-rules/*.md` for what the repository values.
- **Outside Jev patterns:** `../context/external repo's/` holds `claude-jev-main`, `jev-cli-main` (the npm `jevctl` package), `jev-review-main`, `pi-jev-context-main` and `supercov-main`. `../context/social posts/` and `../context/external websites/` hold the posts.
- **The Jev contract here:** `.skilled/skills/cli-jev/` and its `cli-usage/` transport, which wraps the Python `jev-cli`. It is a different package from the vendored npm `jevctl`, and both install a `jev` command.
- **Candidate seams:** the skill advisor (`.skilled/skills/system-skill-advisor/`), the goal hooks (`.skilled/hooks/goal/`), the deep loops (`.skilled/skills/system-deep-loop/`), spec-kit validation (`.skilled/skills/system-spec-kit/`), compiled routing (`.skilled/bin/compiled-route.cjs`), and the commands under `.skilled/commands/`.
- **The digests:** `context/*.md` in this phase condense all of the above, with paths.

### Research questions

- **RQ1 Grading AI responses.** Where would a Jev grade of a model's output change a decision here (review findings, research iterations, playbook verdicts, benchmark scoring), and what harness measures whether the grade agrees with the current judge?
- **RQ2 Active skill-advisor recommendations.** Can a Jev judgment settle cases the advisor scorer handles poorly, such as close top-two scores or a clarify or defer outcome, and does it beat the scorer on the advisor corpus and ratchets?
- **RQ3 Goal hooks.** Could Jev judge goal progress, drift or criterion completion in the goal hooks, plugin and extensions, and what would it replace or add?
- **RQ4 Compaction.** Can Jev with a compressor decide what survives compaction, and how would recovery quality be measured before and after?
- **RQ5 Cross-cutting judgment points.** Deep-loop stop and convergence, finding triage, dispatch guards, validation triage, routing clarify and defer, playbook verdicts. Which of these is a typed judgment today, made by code or by a model, and would Jev make it cheaper, faster or more accurate?
- **RQ6 New skills, commands and workflows.** Which new surfaces are worth building, and what from the vendored integrations carries over or fails to?
- **RQ7 Cost and restraint.** For each candidate: cost, latency, privacy, failure modes, prompt caching, behavior with no key, and what not to build. Which order puts the smallest useful slice first?

### Shape of an acceptable answer

Each recommendation names the seam at `file:line`, the value, the metric with its baseline and the harness that measures it, the cost, latency and privacy exposure, the opt-in switch and what happens with no Jev key, a rough size in lines of code, and a verdict of build-now, next, later or drop with one sentence of reason. Mark every claim as confirmed from code or inferred, and say what would confirm an inferred one.
<!-- /ANCHOR:research-brief -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The DeepSeek, MiMo and Grok lineages each run all 10 iterations | Each lineage state log holds 10 iteration records and its terminal record carries `stopReason` `maxIterationsReached` |
| REQ-002 | `research/research.md` answers RQ1 to RQ7 with the answer shape above | Every ranked recommendation carries a seam `file:line`, a metric with baseline and harness, opt-in and no-key behavior, a smallest slice and a verdict |
| REQ-003 | cli-cursor accepts the Grok 4.7 id | Both allowlists list `grok-4.7-xhigh-fast`, the two vitest files pass, and a live `Reply OK` probe returns `OK` |
| REQ-004 | Lineages write only inside their own directories | The fan-out summary reports no containment violation from a lineage, and `git status` shows no lineage write outside `001-deep-research/research/` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The synthesis reopens every citation in the ranked list | The synthesis marks each citation resolved, drifted or failed, and the orchestrator reopens five of them and three recommendations |
| REQ-006 | The context and angles exist before the run | `context/` holds the four digests and `research-angles.md` with 30 label-keyed angles |
| REQ-007 | The proposed build phases exist as Planned siblings | Each proposed phase has a filled `spec.md`, `plan.md`, `tasks.md` and `goal.md`, a parent binding row and a phase-map row |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The operator can choose build phases from the ranked list without rereading the repository or the vendored material.
- **SC-002**: No recommendation reaches a build phase on a citation that does not resolve or without a metric it can be measured on.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | LLM Gateway credit and Cursor quota | A lineage stops early | The runner retries a lineage up to five times, and the orchestrator reruns a short lineage alone under its label |
| Dependency | No Grok 4.7 "MAX" tier in Cursor | The requested model does not exist | Use `grok-4.7-xhigh-fast`, the highest-effort fast Grok 4.7 id, and record the substitution |
| Risk | Fabricated `file:line` citations | High | The synthesis reopens every cited reference and the orchestrator spot-checks five |
| Risk | Lineages read each other from wave 2 on | Med | The synthesis treats agreement after iteration 4 as not independent |
| Risk | Two packages both named Jev | Med | Every digest and brief names the Python `jev-cli` that `cli-usage` wraps apart from the vendored npm `jevctl` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which ranked recommendations the operator builds. Decided after the synthesis.
<!-- /ANCHOR:questions -->

---
