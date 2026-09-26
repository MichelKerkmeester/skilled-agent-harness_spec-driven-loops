---
title: "Research Phase: Pi Skill Orchestrator Mechanisms Against System Skill Advisor"
description: "Two-lineage deep research over the pi-skill-orchestrator extension: 10 iterations on MiMo v2.6 Pro high through cli-pi on LLM Gateway and 5 on SWE-2 MAX through cli-devin. Each lineage compares the extension's lazy catalog, scoped search, dependency loading and Token Saver boundaries with system-skill-advisor, and returns adopt, adapt or reject verdicts cited at file:line on both sides."
trigger_phrases:
  - "pi skill orchestrator research"
  - "skill orchestrator deep research"
  - "lazy skill catalog research"
  - "advisor push vs pull routing"
  - "skill_search scope fallback research"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Research Phase: Pi Skill Orchestrator Mechanisms Against System Skill Advisor

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Active |
| **Created** | 2026-09-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-hook-deadline-and-diagnostics |
| **Handoff Criteria** | Both lineages reach their iteration cap, `research/research.md` holds the merged ranked synthesis and every cited `file:line` in the ranked list resolves |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Pi skill orchestrator research for skill advisor refinement specification.

**Scope Boundary**: Read-only research. Lineages read anywhere in the repository and write only inside their own lineage directory under `research/lineages/`. No file outside `001-deep-research/research/` changes during this phase.

**Dependencies**:
- `pi` 0.87.1 on PATH with the `llmgateway` provider declared in `.pi/models.json`, dispatching `llmgateway/mimo-v2.6-pro` at `--thinking high`
- `devin` 3000.11.3 on PATH, logged in through Devin account OAuth, dispatching `swe-2-max`
- The shared fan-out runner `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`

**Deliverables**:
- Two lineage runs with their own iteration files, deltas, state logs and lineage synthesis
- A merged `research/research.md` with the ranked verdict list and a cross-lineage agreement record

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill advisor and the pi-skill-orchestrator extension solve skill selection with opposite designs. The advisor pushes a scored brief into every prompt through runtime hooks. The extension hides the whole catalog from the model and lets it pull a bounded search result, then loads one root skill plus its dependencies. We have not measured either design against the other on our code, so any claim that one of its mechanisms would help us is unsupported today.

### Purpose
Answer the research questions below with evidence from both codebases, so the operator can pick which mechanisms become system-skill-advisor refinement phases.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The research questions RQ1 to RQ7 below, answered by both lineages.
- Reading `../context/pi-skill-orchestrator-main/` in full, source, docs and tests.
- Reading the advisor side: `.skilled/skills/system-skill-advisor/` runtime, hooks and references, plus `.skilled/plugins/system-skill-advisor.js`.

### Out of Scope
- Any edit to the orchestrator source or to the advisor. This phase writes research artifacts only.
- Running the advisor's test suite, `validate.sh`, `generate-context.js` or any git write from inside a lineage.
- Token Saver as a general tool-output compressor. It is in scope only where it bears on advisor output size, brief format or lazy discovery.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/lineages/mimo/` | Create | MiMo v2.6 Pro lineage state, iterations and synthesis |
| `research/lineages/swe2max/` | Create | SWE-2 MAX lineage state, iterations and synthesis |
| `research/research.md` | Create | Merged, ranked synthesis across both lineages |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:research-brief -->
## Research Brief

### Where to read

Orchestrator side, under `../context/pi-skill-orchestrator-main/`:
- `docs/architecture.md`, `docs/usage.md`, `docs/groups-and-profiles.md`, `docs/dependencies.md`, `docs/token-saver.md`
- `src/index.ts` (prompt rewrite and tool registration), `src/catalog.ts`, `src/search.ts`, `src/scope.ts`, `src/profiles.ts`, `src/dependencies.ts`, `src/skill-io.ts`, `src/token-saver.ts`
- `tests/` for the behavior each module guarantees, especially `pi-compatibility.test.mjs`, `scope.test.mjs` and `dependencies.test.mjs`

Advisor side, under `.skilled/skills/system-skill-advisor/`:
- `ARCHITECTURE.md`, `references/scoring/advisor-scorer.md`, `references/runtime/cli-front-door-contract.md`, `hooks/skill-advisor-hook.md`
- `runtime/handlers/advisor-recommend.ts`, `runtime/lib/scorer/fusion.ts`, `runtime/lib/scorer/lanes/`, `runtime/lib/scorer/ambiguity.ts`
- `runtime/lib/skill-advisor-brief.ts`, `runtime/lib/render.ts`, `runtime/lib/prompt-policy.ts`, `runtime/lib/prompt-cache.ts`, `runtime/lib/routing/`
- `runtime/lib/skill-graph/`, `runtime/lib/cross-skill-edges/`
- `hooks/pi/prompt-advisor.ts`, `hooks/claude/user-prompt-submit.ts`, `hooks/lib/skill-advisor-cli-fallback.ts`, and `.skilled/plugins/system-skill-advisor.js`

### Research questions

- **RQ1 Catalog cost.** How many tokens does each runtime we support spend on an eager skill catalog before the advisor brief arrives, and does the brief replace that catalog or add to it? Could the extension's scope stub plus on-demand search apply to any of our runtimes, Pi first?
- **RQ2 Push versus pull.** The advisor pushes a brief every prompt. The extension lets the model pull `skill_search` results. What failure modes does each design have on our code? One observed data point: a Pi dispatch on 2026-09-26 logged the advisor hook as `fail_open` with `CLI fallback timed out`. Would a pull surface, alone or beside the brief, change routing accuracy, latency or those failures?
- **RQ3 Scope model.** Profiles and groups act as preferred search scopes, with a bounded global fallback and an authorization set that a new search replaces. What in the advisor, if anything, plays that role (hubs, compiled routes, workflow modes)? Would scope preference raise precision, and what would it break?
- **RQ4 Dependencies.** The extension loads one root skill plus required recursive dependencies. Does the advisor act on `depends_on` or `enhances` edges at recommendation time, and should it return a dependency bundle?
- **RQ5 Ranking signals.** What does the extension rank skill metadata on, and does any signal it uses map onto a gap in the advisor's lexical or derived lanes?
- **RQ6 Output bounds.** The extension caps results at 5 by default and 8 at most, and truncates descriptions to a configured length. Where does the advisor bound its brief, and would these limits change what the model sees?
- **RQ7 Robustness patterns.** Conservative catalog removal with a warning on unknown prompt formats, atomic writes, respect for `disable-model-invocation` and Pi-version compatibility tests. Which of these does the advisor lack, and which would matter here?

### Shape of an acceptable answer

Each finding names the orchestrator mechanism at `file:line`, the advisor counterpart at `file:line` or states that none exists, the proposed change, the expected benefit, the cost and the risk. It closes with a verdict of ADOPT, ADAPT or REJECT and one sentence of reason. Mark every claim as confirmed from code or inferred, and say what would confirm an inferred one.
<!-- /ANCHOR:research-brief -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The MiMo lineage runs all 10 iterations and the SWE-2 MAX lineage runs all 5 | Each lineage state log holds that many iteration records and its terminal record carries `stopReason` `maxIterationsReached` |
| REQ-002 | `research/research.md` answers RQ1 to RQ7 with the answer shape above | Every ranked recommendation cites both sides at `file:line` or states the advisor side is absent |
| REQ-003 | Lineages write only inside their own directories | The fan-out summary reports no containment violation, and `git status` shows no change outside `001-deep-research/research/` from the run |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The orchestrator opens every citation in the ranked list | A verification note records each citation as resolved or failed, and failed ones are marked in the synthesis |
| REQ-005 | Agreement between the two model families is recorded per recommendation | The synthesis marks each recommendation as found by both lineages, by one, or disputed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The operator can choose refinement phases from the ranked list without rereading either codebase.
- **SC-002**: No recommendation reaches a refinement phase on a citation that does not resolve.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | LLM Gateway metered credit and Devin quota | A lineage stops early | The fan-out summary names the failed lineage, and the orchestrator reruns or records the gap |
| Dependency | Four-hour lineage ceiling | The MiMo lineage computes 10 x 900s x 2 and is capped at 4 hours | Watch progress, and treat a timeout as a finding with its partial state |
| Risk | Fabricated `file:line` citations | High | REQ-004 opens every cited reference before the synthesis is used |
| Risk | Other sessions writing in this repository during the run | Med | The runner's containment attributes out-of-lineage changes to the lineage. The default preserve mode records them as advisories, and the orchestrator changes nothing outside the lineage while it runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which ranked recommendations the operator adopts as refinement phases. Decided after the synthesis.
<!-- /ANCHOR:questions -->

---
