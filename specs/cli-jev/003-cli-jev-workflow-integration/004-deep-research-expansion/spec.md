---
title: "Research Phase 2: Deepening the Council-Revised Jev Recommendations"
description: "Round 2 of the Jev research. A fresh Opus 5.5 xhigh leaf re-synthesizes round 1 from the AI Council review, then four lineages run 5 forced iterations each on Grok 4.7, MiMo V2.6 Pro, SWE-2 Max and DeepSeek V4.1 Flash, and a fresh Opus 5.5 max leaf writes the final synthesis."
trigger_phrases:
  - "jev research round 2"
  - "jev council re-synthesis"
  - "four lineage jev research"
  - "swe-2 max jev lineage"
  - "jev compaction recall research"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Research Phase 2: Deepening the Council-Revised Jev Recommendations

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
| **Phase** | 4 of 4 (the final synthesis may add build phases after it) |
| **Predecessor** | 003-goal-verifier-jev-shadow |
| **Successor** | None until the final synthesis proposes build phases |
| **Handoff Criteria** | Round 1 is re-synthesized, all four lineages reach iteration 5, and `research/research.md` ranks every recommendation with its seam, metric, key gate and smallest slice, with every cited `file:line` reopened |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the cli-jev workflow integration specification.

**Scope Boundary**: Research only. Two writes land outside this folder: the re-synthesis rewrites `../001-deep-research/research/research.md`, and the phase reconciliation edits or adds Planned build phases under the parent. Lineages read anywhere, including `../context/`, and write only inside their own directory under `research/lineages/`. Nothing recommended is built.

**Dependencies**:
- `../001-deep-research/research/research.md` (round 1) and `../001-deep-research/ai-council/council-report.md` plus `proposed-resynthesis.md` (the review)
- `pi` with the `llmgateway` provider, which declares `deepseek-v4.1-flash` and `mimo-v2.6-pro`
- `cursor-agent` logged in, listing `grok-4.7-xhigh-fast`; `devin` 3000.11.3 on PATH, serving `swe-2-max`
- The shared fan-out runner `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`

**Deliverables**:
- A re-synthesized round-1 `research.md` that marks every change from the first synthesis
- `context/research-angles.md` with 20 angles, a research topic and a synthesis brief under `scratch/`
- Four lineage runs of 5 iterations each, merged, with a final `research/research.md`
- Planned build phases under the parent reconciled with the final synthesis

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The AI Council found that round 1 dropped the right ideas but measured too loosely and built in the wrong places. R1's keep rule cannot fail, the OpenCode goal heuristic reads its own `...` clamp as truncation, compaction has a function-hook route round 1 never examined, and goals run on Claude Code's native judge rather than the OpenCode verifier. Its proposed changes rest on one model family and one round, and the council itself left five disagreements open.

### Purpose
Fold the council's verified findings into round 1, then deepen and widen the revised recommendations with 20 more forced iterations on four model families, so the operator can pick build phases from one final, measured synthesis.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A fresh Opus 5.5 xhigh re-synthesis of round 1 from `council-report.md` and `proposed-resynthesis.md`, reopening every council claim it keeps.
- 20 angles in three waves, a tightened topic and a synthesis brief for round 2.
- One fan-out: `grok` (cli-cursor, `grok-4.7-xhigh-fast`), `mimo` (cli-pi, `mimo-v2.6-pro`, high), `swe` (cli-devin, `swe-2-max`) and `deepseek` (cli-pi, `deepseek-v4.1-flash`, max), 5 iterations each, forced to the cap.
- A fresh Opus 5.5 max synthesis of round 2 and the workflow's close report.
- Reconciling the Planned build phases with the final synthesis: amending 002 and 003 and adding new Planned phases, never building one.

### Out of Scope
- Building any recommendation - each build phase stays Planned (parent D7).
- Fixing the OpenCode goal clamp defect or the fan-out merge parser - both are recorded for their owners.
- A live `jev` call from any lineage or leaf - it spends quota and could send repository text.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../001-deep-research/research/research.md` | Modify | Re-synthesis of round 1 from the council review |
| `context/research-angles.md`, `scratch/research-topic.txt`, `scratch/synthesis-brief.md` | Create | Round-2 angles, topic and synthesis brief |
| `research/**` | Create | Four lineages, the merge and the final synthesis |
| `../002-*/`, `../003-*/`, `../NNN-*/{spec,plan,tasks,goal}.md` | Modify / Create | Planned build phases reconciled with the final synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:research-brief -->
## Research Brief

**Read first**: the re-synthesized `../001-deep-research/research/research.md`, `../001-deep-research/ai-council/council-report.md`, the four digests in `../001-deep-research/context/` and the vendored material in `../context/`.

| ID | Question |
|----|----------|
| RQ1 | For each build-now and next recommendation of the re-synthesis, what is the exact first slice: files, functions, test cases, pre-registered keep or kill rule and rough LOC? |
| RQ2 | Can a Claude Code function hook host a Jev keep-or-drop compaction pass within its real deadline, and what does a zero-call recall census over local transcripts show first? |
| RQ3 | How should a goal-criteria lint work across `sk-create-goal` authoring and Claude Code's native goal judge, and what base rate of unverifiable criteria do existing `goal.md` files show? |
| RQ4 | Is R1's advisor tie-break arm powered: how many decided rows the held-out and holdout files yield, and which zero-call comparator it must beat? |
| RQ5 | Which patterns in the five vendored repos, the two websites and the three posts are worth adopting under the key gate, and which are anti-patterns here? |
| RQ6 | What did round 1 and the council both miss: seams, skills or workflows where a Jev judgment passes the fitness checklist today? |
| RQ7 | In what order should the survivors be built, what does each cost in calls, latency and egress, and what kills each? |

**Answer shape**: every recommendation names its seam at `file:line`, the value, the metric with baseline and harness, cost, latency and privacy, the key gate and its own switch with exact no-key behavior, a rough size in LOC, and a verdict of build-now, next, later or drop with one sentence of reason. Mark every claim as confirmed from code or inferred, and say what would confirm an inferred one. Keep the Python `jev-cli` 0.6.2 and the npm `jevctl` 0.2.3 apart in every sentence.
<!-- /ANCHOR:research-brief -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Round 1 is re-synthesized by a fresh Opus 5.5 xhigh leaf | `../001-deep-research/research/research.md` carries a changes section against the first synthesis, and every council claim it keeps cites a reopened `file:line` |
| REQ-002 | Four lineages run to their cap | `research/lineages/{grok,mimo,swe,deepseek}` each hold `iteration-001.md` to `iteration-005.md` and a state log whose last record carries `stopReason` `maxIterationsReached` |
| REQ-003 | A fresh Opus 5.5 max leaf writes the final synthesis | `research/research.md` answers RQ1 to RQ7 in the answer shape and ranks every recommendation |
| REQ-004 | Every recommendation obeys the key gate | Each names its switch and states that with `jev auth status` failing it behaves exactly as today |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Citations are verified | The synthesis ledger marks each citation resolved, drifted or failed, and the host reopens five citations and three recommendations |
| REQ-006 | Build phases match the final synthesis | Each proposed phase is a Planned child with `spec.md`, `plan.md`, `tasks.md`, `goal.md`, a binding row, a phase-map row and the key gate |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The operator can pick build phases from one final synthesis without rereading round 1 or the council.
- **SC-002**: Each build-now recommendation has a first slice concrete enough to start without further research.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `devin` or `cursor-agent` auth lapses | A lineage ends short | Rerun that lineage alone under its label; it never counts as done short |
| Risk | Lineages repeat round 1 instead of deepening it | Low new information | Angles start from the re-synthesis's open questions and forbid restating round-1 findings without new evidence |
| Risk | Cross-reading makes agreement look independent | Overconfident synthesis | Iterations 1 and 2 stay independent; the synthesis counts only those as corroboration |
| Risk | The merge under-counts a lineage again | Registry gaps | The synthesis reads every iteration file directly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the council's five open disagreements resolve with round-2 evidence: the compaction rank, parking 003, R14, R1's tau 0.03 veto and the criteria-lint base rate.
<!-- /ANCHOR:questions -->

---
