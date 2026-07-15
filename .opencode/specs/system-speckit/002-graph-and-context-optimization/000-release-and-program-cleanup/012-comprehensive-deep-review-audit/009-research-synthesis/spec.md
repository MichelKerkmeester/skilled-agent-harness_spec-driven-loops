---
title: "Research Charter: Root-Cause Synthesis of the system-spec-kit / 026 Deep-Review Audit"
description: "Deep-research charter investigating root causes and blast radius of the drift, doc-code, memory-correctness, and runtime findings surfaced by the 8-slice review."
trigger_phrases:
  - "audit root cause research"
  - "drift root cause"
  - "deep-loop reliability blast radius"
importance_tier: "normal"
contextType: "general"
---
# Research Charter: Root-Cause Synthesis of the system-spec-kit / 026 Deep-Review Audit

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-04 |
| **Branch** | `wt/0006-deep-review-audit` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An 8-slice deep-review audit of system-spec-kit and 026 surfaced ~50 distinct findings (3 P0, ~40 P1). Many cluster into recurring themes. This research charter investigates ROOT CAUSES and BLAST RADIUS so remediation targets causes, not just symptoms.

### Purpose
Investigate the questions below against the codebase and the per-slice review reports under `../00{1..8}-*/review/`. Produce a cited synthesis (research.md) with root-cause hypotheses, blast-radius estimates, and severity calibration. READ-ONLY investigation.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Review findings to synthesize (evidence in sibling slice reports)
- **Doc/schema-to-code drift (recurring):** reconcile docs (`dryRun:false` vs `mode:"apply"`), `activeOnly` advertised-but-ignored, governed ingest metadata accepted-then-dropped, tool schemas hiding runtime fields, stale playbook/catalog paths, sk-doc-vs-template frontmatter contradiction.
- **026/027 metadata drift:** stale `graph-metadata` last-active/track-status, changelog rollups omitting entries, completed packets marked in-progress, draft/placeholder phases marked complete, stale resource-map rows.
- **Memory write-path correctness:** entity-density cache not invalidated on update/delete; atomic save can commit a DB row before the pending file is promoted.
- **Deep-loop runtime reliability:** non-zero CLI lineage exits counted as success; `spawnSync` serializes fan-out despite the concurrency cap; per-lineage `iterations` only sizes timeout.
- **Catalog/playbook verification:** false universal-coverage claim, tool-count drift (37 vs 36), scenario-count gate drift (380 vs 384), broken catalog links, comment-hygiene "cleanup done" claim false.

### Research Questions
1. **Common root cause for doc/schema-to-code drift:** Are schemas, handlers, docs, and catalog/playbook generated or hand-maintained from divergent sources of truth? Is there a single generator or contract that, if fixed, closes most of these?
2. **Metadata-drift systemic-ness:** Is the stale graph-metadata / completion-claim / placeholder-complete drift a `generate-context.js` / graph-metadata-backfill defect affecting many packets, or isolated edits? Estimate how many packets are affected.
3. **Memory-correctness real impact:** Under normal single-user operation, do the entity-density staleness and atomic-save ordering actually corrupt retrieval/graph-channel routing? Are they reproducible?
4. **P0 security severity calibration (local threat model):** For a local, single-user MCP with no untrusted network input, are "community fallback bypasses governed scope" and "causal tools operate on bare IDs without scope auth" genuine vulnerabilities or acceptable by-design? Recommend a calibrated severity.
5. **Deep-loop blast radius:** Given non-zero lineage exits are counted as success and fan-out serializes, could prior deep-review/deep-research runs have silently masked failed lineages or under-delivered concurrency? What past artifacts are suspect?

### Out of Scope
- Modifying any file (read-only investigation)
- Re-deriving findings already proven in the slice reports (synthesize, do not repeat)


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Investigate each of the 5 research questions | Each answered with cited evidence or marked UNKNOWN with reason |
| REQ-002 | Provide root-cause hypotheses + blast-radius estimates | Findings tie symptoms to causes with file evidence |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: research.md answers the 5 questions with root-cause hypotheses, blast-radius estimates, and calibrated severities


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent audit packet**: See `../spec.md`
- **Slice review reports**: See `../001-*/review/` through `../008-*/review/`

<!-- /ANCHOR:related-docs -->

---
