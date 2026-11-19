---
title: "Feature Specification: Phase 17: ollama-advisor-analysis"
description: "Nobody has checked whether the advisor's Ollama-backed semantic lane earns its cost. A fresh Fable 5.2 read looks for bugs, measures effectiveness against the lexical lanes, names overengineering and finds where load or orphaned daemons build up."
trigger_phrases:
  - "ollama advisor analysis"
  - "phase 17 ollama advisor analysis"
  - "advisor semantic lane analysis"
  - "advisor zombie daemons"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 17: ollama-advisor-analysis

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-19 |
| **Branch** | `main` (report-only, no code change) |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 17 |
| **Predecessor** | 016-doc-alignment-check |
| **Successor** | None |
| **Handoff Criteria** | `evidence/report.md` holds the analysis with a file:line source for every finding |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the pi-context-decisions refinement packet, a report-only analysis like phases 015 and 016.

**Scope Boundary**: read the code and write one report. No code, doc or config change.

**Dependencies**:
- Phase 014 merged to main, so the analysis reads the current advisor.
- The `claude2` account for the Fable 5.2 dispatch.

**Deliverables**:
- `evidence/report.md`, the analysis, ranked by impact
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor can score prompts through an embedding model served by Ollama (`runtime/lib/embedders/adapters/ollama.ts`, the semantic shadow lane, the launcher's embedder bootstrap and `/doctor:skill-advisor embedder`). Nobody has checked whether that path finds better skills than the lexical lanes, what it costs per prompt, or whether its daemons and model processes are reaped. The measured state below shows one advisor daemon pair per checkout and no Ollama process.

### Purpose
One report says, with sources, what to fix, simplify or drop in the advisor's Ollama path, and how to cut its load and stop daemons from piling up.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ pgrep -f system-skill-advisor-launcher.cjs | wc -l ; pgrep -f runtime/advisor-server.js | wc -l ; pgrep -fl ollama | wc -l
3
3
0
$ pgrep -fl advisor-server.js   (paths shortened)
10783 MEGA/Development/Skilled/.skilled/skills/system-skill-advisor/runtime/dist/runtime/advisor-server.js
43859 MEGA/Development/Skilled/barter/ai-speckit/skilled/.skilled/skills/system-skill-advisor/runtime/dist/runtime/advisor-server.js
87705 worktrees/public/477-opencode-v1-removal/.skilled/skills/system-skill-advisor/runtime/dist/runtime/advisor-server.js
$ node .skilled/bin/skill-advisor.cjs advisor_status --json '{"workspaceRoot":"<repo>"}' --format json   (keys)
freshness,generation,trustState,lastGenerationBump,lastScanAt,skillCount,indexStaleness,laneWeights,hookHealth
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Dispatch one read-only Fable 5.2 medium analysis through `claude2` over the advisor's Ollama and embedder code.
- Cover bugs, effectiveness, overengineering, per-prompt and idle load, and daemon or model-process build-up.
- Save the returned report as `evidence/report.md` and check its load-bearing claims against the code.

### Out of Scope
- Fixing anything the report finds - fixes are a separate operator decision, as for phases 015 and 016.
- Live latency benchmarks with Ollama running - the report may propose them; this phase does not run them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `017-ollama-advisor-analysis/evidence/report.md` | Create | The analysis |
| `017-ollama-advisor-analysis/*.md` | Modify | This phase's own docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The report covers all five questions: bugs, effectiveness, overengineering, load, daemon build-up | `evidence/report.md` has a section for each, and each finding cites file:line |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The conductor checks the report's top findings against the code | `implementation-summary.md` lists each top finding as confirmed or not, with the line read |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `evidence/report.md` exists, and `rg -c 'ts:[0-9]+|cjs:[0-9]+|mjs:[0-9]+' evidence/report.md` prints at least 5.
- **SC-002**: `git status --short` shows no change outside this phase folder after the dispatch.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `claude2` OAuth token and the `claude-fable-5-2` model id | No report if either is refused | Check the dispatch's first output; on a refusal, stop and ask rather than switch model or account |
| Risk | A model report asserts behavior it did not read | Wrong fixes get planned | Run it read-only with `--permission-mode plan`, demand file:line for each claim, and confirm the top findings against the code |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
