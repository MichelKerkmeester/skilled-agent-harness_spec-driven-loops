---
title: "Review Phase: Two-Model Deep Review of the Advisor Refinements"
description: "Phases 2 to 5 changed the advisor hooks, the CLI and daemon request path, the fallback renderer, the OpenCode plugin, the deep-loop convergence steps and Pi's edit_lines tool, each built by one model and checked by one orchestrator. This phase runs a fan-out /deep:review over exactly those files with two other model families, MiMo v2.6 Pro at high effort and DeepSeek V4.1 Flash at max, three iterations each with no early stop."
trigger_phrases:
  - "advisor refinements deep review"
  - "fan-out deep review mimo deepseek"
  - "pi skill orchestrator review"
  - "goal file manifest review"
importance_tier: "important"
contextType: "review"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Review Phase: Two-Model Deep Review of the Advisor Refinements

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-follow-up-fixes |
| **Successor** | 007-docs-and-standards-alignment |
| **Handoff Criteria** | Both lineages run all three iterations, `review/review-report.md` holds the merged verdict with every P0 and P1 finding checked against the code by the orchestrator, and the close records `synthesis_complete` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Pi skill orchestrator research for skill advisor refinement specification. It reviews what phases 2 to 5 built, plus the research-workflow fix made while closing phase 1.

**Scope Boundary**: The files listed in `goal-file-manifest.txt`, read against the requirements in `../002-hook-deadline-and-diagnostics/spec.md` through `../005-follow-up-fixes/spec.md`. The review reads and reports. Fixes for its findings are a later phase.

**Dependencies**:
- 005-follow-up-fixes, hard. Its review-workflow fix lets a fan-out review close record `synthesis_complete`.

**Deliverables**:
- `review/` with both lineages' state and one merged `review-report.md`
- A verification note on every P0 and P1 finding

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every change in phases 2 to 5 was written by GPT-6 Luna and checked by one orchestrator, with each check chosen by the same party that wrote the brief. A reader from another model family has not looked at any of it, and the changes cross a shell shim, a daemon request option with a stale-daemon retry, a lifecycle dedup rule, a plugin mirror, embedded workflow scripts and an editing tool.

### Purpose
Two independent model families review the changed files for correctness, security, traceability and maintainability, so defects the builder and the checker share a blind spot for can surface before anyone builds on this code.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Review Setup

```
/deep:review:auto specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/006-fanout-deep-review
  --spec-folder=specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/006-fanout-deep-review
  --executor=cli-pi --model=mimo-v2.6-pro --reasoning-effort=high --iters=3 --label=mimo
  --executor=cli-pi --model=deepseek-v4.1-flash --reasoning-effort=max --iters=3 --label=deepseek
  --stop-policy=max-iterations --concurrency=2
```

Target type `spec-folder`, so scope comes from `goal-file-manifest.txt` in this folder. Dimensions: all four. Both models run through cli-pi on LLM Gateway, the fan-out route for each bare literal.

### In Scope
- The code, tests and docs in `goal-file-manifest.txt`.
- In the four deep-loop workflow files, only `step_convergence_report`; the rest of each file is context.
- In `.pi/extensions/pi-cache-optimizer/index.ts`, only the hash-verified edits section; the rest is context.

### Out of Scope
- Fixing findings. They go to a follow-up phase.
- The research lineages under `../001-deep-research/research/`.
- Other sessions' uncommitted work in the tree.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `goal-file-manifest.txt` | Create | The review scope, one repo-relative path per line |
| `review/` | Create | Lineage state, merged registry and `review-report.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both lineages run three iterations | Each lineage state log holds three iteration records, and neither stopped on convergence |
| REQ-002 | One merged report | `review/review-report.md` carries a verdict and every finding with its severity, file and line |
| REQ-003 | The run writes only under `review/` | The fan-out summary reports no containment violation from the run |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The orchestrator checks every P0 and P1 finding | Each one is marked confirmed, refuted or unverified with the evidence, before any fix is planned |
| REQ-005 | The close completes | The convergence step records `synthesis_complete` without a root dashboard |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The operator can decide which findings to fix from the report and its verification notes alone.
- **SC-002**: No finding is acted on without a check of the cited code.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | LLM Gateway metered credit | A lineage stops early | The fan-out summary names the failed lineage; rerun it or record the gap |
| Risk | Three iterations over about forty files is shallow | Med | The manifest names only changed files, and the spec narrows the two large files to their changed sections |
| Risk | Findings that cite lines that do not exist | High | REQ-004 opens every cited line before a finding counts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which confirmed findings the operator wants fixed. Decided after the report.
<!-- /ANCHOR:questions -->

---
