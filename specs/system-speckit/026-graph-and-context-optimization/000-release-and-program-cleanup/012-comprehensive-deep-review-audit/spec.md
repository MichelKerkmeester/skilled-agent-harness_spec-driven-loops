---
title: "Feature Specification: Comprehensive Deep-Review + Deep-Research Audit of system-spec-kit & 026"
description: "Maximal adversarial audit of system-spec-kit and the 026 program: drift, bugs, doc-code inconsistencies, unverified catalog/playbook entries."
trigger_phrases:
  - "deep review audit"
  - "026 audit"
  - "system-spec-kit audit"
  - "drift"
  - "feature catalog verification"
  - "comprehensive review"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Comprehensive Deep-Review + Deep-Research Audit of system-spec-kit & 026

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-04 |
| **Branch** | `wt/0006-deep-review-audit` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 026 program (`graph-and-context-optimization`) is large and mostly complete (8 tracks, ~711 spec.md, ~634 sub-packets) and touched the spec-kit MCP core, the memory/causal runtime, code-graph, the feature catalog + testing playbook, and governance. Recent commits remediated changelog audit drift and completion-claim reconciliation, signalling that drift and verification gaps are a live risk. 027 (`xce-research-based-refinement`) is now launching to refine this surface. Before deeper 027 work, the team needs an independent, adversarial audit to surface what earlier passes missed.

### Purpose
Run a maximal deep-review campaign plus a deep-research pass across system-spec-kit and the interconnected systems, executed by gpt-5.5 at xhigh reasoning (5-way parallel), to produce a consolidated, evidence-backed inventory of P0/P1/P2 findings: real bugs, drift, doc-to-code inconsistencies versus sk-doc and sk-code, broken behaviour, and feature-catalog or testing-playbook entries that were never verified.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- MCP core code: `system-spec-kit/mcp_server/**` (handlers, `context-server.ts`, `tool-schemas.ts`)
- 026 spec-folder integrity + changelog/verification accuracy across all 8 tracks
- Feature catalog and manual testing playbook: catalog-to-code traceability and unverified entries
- Governance: constitutional rules versus actual enforcement, plus sk-doc and sk-code conformance drift
- Interconnected MCPs: system-code-graph, system-skill-advisor, deep-loop-runtime integration seams
- 027 launch-state: phase-parent readiness and alignment with 026 completion
- Deep-research pass on the highest-value unconfirmed unknowns surfaced by the review

### Out of Scope
- Implementing fixes for findings (this packet outputs a remediation-ready inventory only; fixes go to `/speckit:plan` follow-ups)
- Modifying any reviewed code (the review target is read-only; only this packet's artifacts are written)
- Re-running 026 work or changing 026 completion status

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `012-.../review/` | Create | Per-slice deep-review packets (pt-01..pt-06), iteration files, review-report.md |
| `012-.../research/research.md` | Create | Deep-research findings on surfaced unknowns |
| `012-.../implementation-summary.md` | Create | Consolidated, deduped, severity-ranked audit findings |
| `012-.../checklist.md` | Create | Verification checklist with evidence |
| `012-.../decision-record.md` | Create | Key campaign decisions (executor, isolation, scope) |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Cover all six review slices | Each slice has a completed review with a recorded verdict and P0/P1/P2 counts |
| REQ-002 | Findings are evidence-backed | Every reported P0/P1 cites file path and line with a concrete observation |
| REQ-003 | Reviewed code is never modified | Final worktree git diff shows only `012-...` additions; any other path investigated |
| REQ-004 | Top findings are adversarially verified | Each top P0/P1 confirmed by an independent check before inclusion (no plausible-but-wrong) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Deep-research pass executed | research.md produced from the top unconfirmed unknowns surfaced by the review |
| REQ-006 | Catalog/playbook verification assessed | Findings flag feature-catalog or playbook entries lacking code backing or test procedures |
| REQ-007 | Consolidated audit summary produced | implementation-summary.md deduplicates findings and ranks by severity with verified/unverified flags |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All six review slices complete with verdicts and a merged finding registry
- **SC-002**: Deep-research pass complete with cited findings on the surfaced unknowns
- **SC-003**: Consolidated audit summary distinguishes verified findings from suspected ones
- **SC-004**: `validate.sh --strict` passes on this packet and the worktree diff is clean of out-of-scope writes


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cli-codex fan-out runs workspace-write | Stray writes outside artifacts | Worktree isolation + OS sandbox rooted at worktree cwd + per-loop git-status tripwire |
| Risk | gpt-5.5 xhigh timeout on broad scope | Iteration marked timed-out | Bounded per-slice targets; executor timeout 1200s; loop retries once then marks |
| Dependency | codex CLI + ChatGPT OAuth | Cannot dispatch executor | Verified installed and logged in; monitor plan rate limits at concurrency 5 |
| Dependency | spec-kit MCP servers | Loop enrichment + memory save | Degrade to Grep/Glob + direct reads; save via generate-context.js on main post-merge |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Maintain at least 5 concurrent gpt-5.5-xhigh executor lineages during each fan-out loop
- **NFR-P02**: Bound each executor dispatch to a single slice to keep dispatches under the timeout budget

### Security
- **NFR-S01**: No secrets or credentials in dispatch prompts
- **NFR-S02**: Executor sandbox is OS-enforced to the worktree; main checkout is never writable by a lineage

### Reliability
- **NFR-R01**: Partial fan-out failure (exit 2) is tolerated; stdout salvage recovers missing iteration files
- **NFR-R02**: Campaign state survives interruption via the loop's externalized JSONL state per lineage


<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Empty slice findings**: A slice with zero findings still records a PASS verdict and a coverage note
- **Large target**: Slices scope targets by glob so no single dispatch reads the entire surface
- **Duplicate findings across lineages**: Merge deduplicates by file plus finding signature

### Error Scenarios
- **Executor auth failure mid-campaign**: Pause, re-check codex login, resume the affected slice
- **Lineage timeout**: Mark the iteration timed-out, salvage stdout, continue remaining lineages
- **MCP server down**: Skip enrichment, proceed with direct file reads, save after restore

### Concurrent Operations
- **Five lineages writing in parallel**: Each writes only to its isolated lineage directory
- **Worktree vs main**: Campaign runs in the worktree; main retains unrelated uncommitted changes untouched


<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should research run 50 total iterations or 50 per lineage? **RESOLVED: ~50 total (10 per lineage x 5), convergence may stop earlier**
- Where do artifacts land? **RESOLVED: new 026 packet under 000-release-and-program-cleanup (012)**
- How is the workspace-write fan-out isolated? **RESOLVED: fresh git worktree wt/0006-deep-review-audit**


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->

---
