# Iteration 021: RQ-M2 PRD write-back / requirements-drift

**Focus:** RQ-M2 PRD write-back / requirements-drift  
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only). **Status:** complete. **newInfoRatio:** 0.15.  
**Raw output:** prompts/iteration-021.out  ·  **Prompt:** prompts/iteration-021.prompt

### FINDINGS
| Sub-feature | gem-team mechanism (file:line) | spec-kit equivalent or GAP (file:line) | Verdict | Effort(S/M/L) | Net-new value |
|---|---|---|---|---|---|
| Planner emits `prd_update_recommended` boolean | gem-planner output field `prd_update_recommended: boolean` (.apm/agents/gem-planner.agent.md:142); planner assesses scope shifts, ADR deviations, AC changes and sets flag (line 106) | GAP — no structured "spec.md needs update" signal in plan output. Logic-Sync Protocol (CLAUDE.md:310-312) is reactive human-triggered halt, not a machine-readable output field. Completion metadata reconciliation (CLAUDE.md:251-258) is post-hoc manual. | ADAPT | M | Partial — the signal concept is valuable but spec-kit's multi-doc model (spec.md/plan.md/decision-record.md) needs richer targeting than a single boolean |
| Acceptance criteria injection from PRD→tasks | Planner extracts AC from PRD per task scope, populates `task_definition.acceptance_criteria` array (gem-planner.agent.md:82-85) | COVERED — plan.md templates include "All acceptance criteria met" as DoD checklist item (templates/examples/level_2/plan.md:54); checklist.md has `CHK-020 [P0] All acceptance criteria met` (scripts/test-fixtures/053-template-compliant-level2/checklist.md:52). Structured per-task AC array is absent but equivalent intent exists in plan/checklist. | REJECT | — | No net-new; spec-kit uses plan.md phases + checklist P0 items for same purpose |
| Phase 4 "Decisions → PRD" write-back | Orchestrator persists decisions back to PRD.yaml during learning loop (README.md:170) | PARTIAL — Memory save arbitration auto-supersedes/updates contradicting spec-docs (feature_catalog/mutation/022-prediction-error-save-arbitration.md:26); `_memory.continuity` in implementation-summary.md captures decisions. But no explicit "write back to spec.md" signal from task output. | ADAPT | M | Partial — auto-arbitration at memory layer vs explicit spec-doc write-back signal |
| Contradiction detection at save time | Gem Team: decisions written back during Phase 4 (manual/orchestrated) | Spec-kit: prediction-error gate detects contradictions via cosine similarity + negation keywords, auto-supersedes (feature_catalog/mutation/022:26); contradiction-detection.ts auto-invalidates conflicting edges (feature_catalog/graph-signal-activation/100-contradiction-detection.md:26). | COVERED | — | No net-new; spec-kit's automated contradiction handling is more sophisticated |
| PRD as single source of truth for planning | PRD.yaml drives planning/implementation/verification (README.md:121); knowledge priority: PRD→codebase→AGENTS.md (AGENTS.md:1) | COVERED — spec.md is canonical spec; knowledge retrieval via memory_context/memory_search; spec docs are indexed and searchable. Multi-doc model (spec/plan/tasks/checklist) is richer than single YAML. | REJECT | — | Spec-kit's model is strictly more expressive |

[F-021-01] **Missing structured drift signal.** Gem Team's `prd_update_recommended` (gem-planner.agent.md:142) is a planner-emitted boolean that explicitly flags when the requirements doc needs updating. The spec-kit has no equivalent structured output field. Logic-Sync (CLAUDE.md:310-312) is reactive and human-facing; memory arbitration (022-prediction-error-save-arbitration.md:26) operates at the memory layer, not at the spec.md document layer. The gap is a machine-readable, task-level "spec.md update recommended" signal.

[F-021-02] **Acceptance criteria coverage differs in form, not function.** Gem Team injects per-task `acceptance_criteria` arrays (gem-planner.agent.md:84). Spec-kit uses plan.md phase checklists + checklist.md `CHK-020` items (templates/examples/level_2/plan.md:54). The intent is equivalent; the structured per-task array is absent but not required given the checklist enforcement model.

[F-021-03] **Write-back mechanism partially covered by memory arbitration.** The prediction-error save gate (022) auto-detects contradictions via cosine similarity ≥0.85 with negation conflicts and triggers SUPERSEDE/UPDATE actions. This is more automated than Gem Team's manual Phase 4 write-back, but it targets the memory index layer, not the spec.md/plan.md document layer directly.

[F-021-04] **Completion reconciliation is the closest analog.** CLAUDE.md:251-258 requires updating spec.md Status, plan/checklist evidence, and implementation-summary continuity at completion. This is the spec-kit's mechanism for keeping requirements in sync — but it's a gate at the end, not a continuous signal during planning/execution.

### NEGATIVE / RULED-OUT
- **Full PRD.yaml adoption**: Rejected. Spec-kit's multi-doc model (spec.md + plan.md + tasks.md + checklist.md + decision-record.md + implementation-summary.md) is strictly richer than a single YAML file. No evidence Gem Team's PRD.yaml handles phased coordination, nested packets, or multi-session continuity.
- **Acceptance criteria field injection**: Rejected as net-new. Spec-kit's checklist.md P0/P1/P2 enforcement covers the same verification intent with stronger gate enforcement (validate.sh --strict).
- **Knowledge priority layer**: Rejected. Spec-kit's memory_context + memory_search + code_graph_query routing is more sophisticated than Gem Team's static PRD→codebase→AGENTS.md priority chain.

### OPEN QUESTIONS
- Would a `spec_update_recommended` boolean in the completion metadata (`description.json` / `graph-metadata.json`) be sufficient, or does it need to live in plan.md output?
- Should the memory_save arbitration path also emit a structured "spec.md drift detected" signal alongside its auto-supersede action?
- Is the manual reconciliation at completion (CLAUDE.md:251-258) actually being enforced in practice, or is it a paper gate?

### METRICS
newInfoRatio: 0.15
novelty: The structured planner-emitted drift signal is the only genuinely absent mechanism; spec-kit's multi-layer contradiction handling and completion gates cover the remaining intent.
status: complete
focus: RQ-M2 PRD write-back / requirements-drift
