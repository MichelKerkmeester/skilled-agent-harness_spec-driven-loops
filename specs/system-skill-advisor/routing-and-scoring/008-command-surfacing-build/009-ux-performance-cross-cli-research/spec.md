---
title: "Feature Specification: Phase 9: ux-performance-cross-cli-research"
description: "Phases 005 to 008 plan how a command reaches the model, but nobody had asked what is still lost after them in user experience, performance and use across the CLIs. This research child records that question, the deep-research run that answered it and the rule that each ranked recommendation is later built in a new phase or declined with a reason."
trigger_phrases:
  - "ux performance cross cli research"
  - "phase 9 command surfacing research"
  - "command surfacing further gains research"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: ux-performance-cross-cli-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-embedder-setup-and-cost |
| **Successor** | None |
| **Handoff Criteria** | Every ranked recommendation in `research/research.md` section 9 has a disposition in `tasks.md`, either built in a named phase or declined with a reason |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the build that makes the skill advisor surface every tracked slash command with a run-or-ask policy and brings a chat-only request onto a proper workflow (`../spec.md`).

**Scope Boundary**: Research only. This child reads the planned phases, their scratch evidence and the runtime surfaces, and writes findings under `research/`. It changes no code, no command, no hook and no other phase folder.

**Dependencies**:
- Segment two reruns the research against the built state, so it waits until phases 005 to 008 are built and phase 007 has recorded its after arm.

**Deliverables**:
- `research/research.md`, the merged synthesis with 14 ranked recommendations in section 9.
- A disposition for each of those recommendations, recorded in `tasks.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 005 to 008 plan the recommendation contract, the Gate 2 binding, the per-runtime proof and the embedder setup. None of them asks what a person still loses after those phases land: whether the brief reaches every runtime, whether the first prompt after install is fast enough to carry it and whether a measured start rate can be traced back to an offer. Without that question answered, the next build phase would be chosen by guess.

### Purpose
A ranked list of further gains for command surfacing in user experience, performance and cross-CLI use, each with its file, its gain and its check, so that every item is later built in its own phase or declined with a reason.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Every command ran from this folder on 2026-11-13.

```text
$ for l in ux performance cross-cli; do printf "%s: " $l; ls research/lineages/$l/iterations | wc -l | tr -d ' '; done
ux: 5
performance: 5
cross-cli: 3
$ jq -c '{model: .executor.model, effort: .executor.reasoningEffort, maxIterations, createdAt}' research/deep-research-config.json
{"model":"opencode-go/deepseek-v4.1-flash","effort":"max","maxIterations":5,"createdAt":"2026-11-12T22:46:52.068Z"}
$ jq -c '{total, succeeded, failed}' research/orchestration-summary.json
{"total":3,"succeeded":3,"failed":0}
$ jq '.keyFindings | length' research/findings-registry.json
67
$ rg -c '^\| [0-9]+ \| ' research/research.md
14
```

What the block settles:
- Segment one ran three lineages with 5, 5 and 3 iterations, all three succeeded.
- The executor was `opencode-go/deepseek-v4.1-flash` at `max` effort with a cap of 5 iterations per lineage.
- The merged registry holds 67 key findings and `research/research.md` holds 14 ranked recommendation rows.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Research Question
After phases 005 to 008, which further changes raise how often a surfaced command is started, remove a silent failure or make the start rate attributable, judged on three lanes: user experience (`ux`), hook and embedder cost (`performance`) and behaviour per runtime (`cross-cli`)?

### Evidence Read
- The parent `spec.md`, `decision-record.md` and `goal.md`, and the `plan.md` and `tasks.md` of phases 005 to 008.
- The before arm of phase 007 (`../007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl`) and its G5 listing (`../007-per-runtime-behaviour-proof/scratch/g5/result.txt`).
- The embedder measurements of phase 008 (`../008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt`).
- The runtime surfaces and advisor code that `research/research.md` section 13 lists, among them `INSTALL-SKILLED.md`, `.codex/README.md`, `.dsh/plugins/repo-guards/index.mjs`, `runtime/lib/render.ts` and `runtime/lib/metrics.ts`.

### In Scope
- Run a fan-out deep research over the three lanes and merge the lineages into one ranked list in `research/research.md`.
- Rerun the research against the built state of phases 005 to 008 and the after arm of phase 007 until it converges.
- Record a disposition for each ranked recommendation in `tasks.md`.

### Out of Scope
- Any change to code, commands, hooks, install guides or `AGENTS.md`. Each recommendation that is accepted is built in a new phase with its own spec.
- Reading holdout prompt rows from any corpus file. The research rules in `research/research.md` section 2 forbid it.
- Starting CLI runs for the behaviour arms. Phase 007 owns the arms.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Lineage state, iterations and the merged synthesis written by the deep-research run |
| `spec.md`, `plan.md`, `tasks.md` | Create | This packet's documents and the disposition table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Segment one merges all three lineages into one ranked list | `research/research.md` section 9 holds 14 numbered rows and `research/orchestration-summary.json` reports 3 succeeded and 0 failed |
| REQ-002 | Each ranked recommendation is built in a new phase or declined with a reason | Every row of the disposition table in `tasks.md` reads `built in <phase>` or `declined: <reason>` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Segment two reruns the research against the built phases 005 to 008 and the phase 007 after arm until it converges | A second merged synthesis under `research/` records its stop reason as converged, and the open questions in `research/research.md` section 12 are answered or carried forward with a reason |
| REQ-004 | No document in this child reads or prints a holdout prompt row | `rg -n 'holdout' spec.md plan.md tasks.md` shows only rule text, never a prompt |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.
- **SC-002**: The disposition table in `tasks.md` has 14 rows and none has an empty `Disposition` cell when this child closes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 005 to 008 built and the phase 007 after arm recorded | Segment two has no built state to read until they land | Segment two stays open in `tasks.md` and starts only when phase 007 records its after arm |
| Risk | The executor is a flash model and some of its numbers carry only the lineage's citation | Med | `research/research.md` section 15 marks which claims the orchestrator re-checked. A phase that builds a recommendation measures its own baseline before it claims the gain |
| Risk | The before arm grew while segment one ran | Low | Ranking uses the single snapshot in `research/research.md` section 3 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The six open questions in `research/research.md` section 12 carry into segment two. Question 6, whether the embed model should stay warm against the cold-by-design choice of phase 008, is an operator decision.
<!-- /ANCHOR:questions -->
