---
title: "Feature Specification: Record executor kind and model in the publish manifest so the attribution table stops reading unknown"
description: "The fan-out merge reads each lineage's executor kind, model and reasoning effort from the invocation metadata the runner already writes, so the attribution table and the merged registry never print unknown for a published lane."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Record executor kind and model in the publish manifest so the attribution table stops reading unknown

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `../spec.md` |
| **Predecessor** | `../002-iteration-record-dedupe/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The attribution table printed `unknown` in the Kind and Model column for every lineage of a completed run. The merge looked for an `executor_start` state-log event and a label-keyed orchestration summary entry, and the runner writes neither; the provenance it does write, `invocation-metadata.json` beside each lineage, was never read.

### Purpose
Every published lineage names the executor kind and model that produced it, and the merged registry can group findings by model without decoding lineage names.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The per-lineage loader in the merge script reading `invocation-metadata.json`
- A `lineageExecutors` map on both merge outputs
- Tests for the read path, the fallback path and both merge shapes

### Out of Scope
- The runner - it already writes the provenance file before dispatch
- The publish manifest of the worktree path - removed with the worktree mechanism in the last phase
- Changing existing registry fields - none change

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modify | Loader reads invocation metadata with the old lookups as fallbacks; `buildLineageExecutors` feeds both merge outputs; attribution prints `unknown` rather than `default` for a missing model |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Modify | Four new tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The loader takes kind, model and reasoning effort from `effectiveConfig` in the lineage's invocation metadata, falling back to the state-log event and the summary, and to `unknown` only when no source has the value |
| REQ-002 | Both merge outputs carry `lineageExecutors`, keyed by label, holding kind, model and reasoning effort |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A missing invocation metadata file never throws; the lineage still merges |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The attribution table for the retained research run shows no `unknown` in the Kind or Model column
- **SC-002**: The deep-loop runtime suite exits zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Older artifacts without the file | Low | The fallbacks and `unknown` keep them mergeable |
| Dependency | Runner writes `invocation-metadata.json` before dispatch | Green | Already shipped; verified on four retained lineages |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One small JSON read per lineage

### Security
- **NFR-S01**: The read goes through the merge's own root-bound JSON reader

### Reliability
- **NFR-R01**: A missing or malformed file degrades to the fallbacks, never to a throw
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- File absent: fallbacks, then `unknown`
- `effectiveConfig` absent or not an object: treated as empty
- Reasoning effort absent: `null`, never `unknown`

### Error Scenarios
- Malformed JSON: the root-bound reader returns null and the fallbacks apply
- Label mismatch: the map is keyed by the lineage directory name, which is the label

### State Transitions
- Partial completion: not applicable; the merge runs after all lanes settle
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One script, one test file |
| Risk | 6/25 | Merge output gains a field; nothing existing changes |
| Research | 3/20 | Provenance file already existed |
| **Total** | **15/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


