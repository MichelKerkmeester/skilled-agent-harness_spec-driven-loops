---
title: "Spec: 031 Generated JSON Quality and Safety Research [template:level_2/spec.md]"
description: "A 10-angle deep-research study on improving the quality and safety of the spec-kit generated JSON metadata, description.json and graph-metadata.json, and the generators that produce them. Covers broad-walk over-reach, non-idempotent writes, relationship and identity drift, and the weak generated-JSON contract. Read-only, the synthesized and skeptically cross-checked proposals live in research/research.md, no generator or schema or validator code is modified."
trigger_phrases:
  - "generated json quality research"
  - "graph metadata safe regeneration"
  - "description json scoping fix"
  - "spec folder identity canonicalizer"
  - "generated metadata validator"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/005-shared-engine-and-research/006-generated-metadata-quality-research"
    last_updated_at: "2026-07-04T17:12:06.026Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed 10-angle research, synthesized and skeptically verified"
    next_safe_action: "Decide which verified proposals warrant a build phase"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: 031 Generated JSON Quality and Safety Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-22 |
| **Branch** | `system-speckit/004-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../005-vague-query-improvement-research/spec.md |
| **Successor** | ../007-z-future-always-ignored/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The spec-kit generators that produce `description.json` and `graph-metadata.json` over-reach and churn. The backfill CLI ignores its positional folder arg and defaults to the repo-wide root, runtime search regenerates a global cache as a side effect, the description path stamps wall-clock time and writes unconditionally, the status normalizer admits free-text prose with em-dashes, `mergeGraphMetadata` drops `parent_id` and `children_ids` on a re-derive, the `specFolder` path shape is inconsistent between the two generators, and the global `descriptions.json` regen pulls in other sessions' folders. The visible symptom is unscoped cross-session commit churn that buries real diffs, plus a latent lineage-loss risk on the merge path. No prior research has examined the generated-JSON quality and safety surface as a whole.

### Purpose
Produce a prioritized, evidence-grounded set of improvement proposals for the generated-JSON surface, spanning ten angles, then skeptically cross-check the load-bearing proposals against the live code with a different model than the seats that surfaced them. The deliverable is the research synthesis and a recommended build order, not an implementation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Ten angle-diverse read-only research iterations covering generator over-reach, the z_future exclusion residual, write determinism, the status enum, causal-summary drift, parent_id integrity, path-format canonicalization, the global index regen, a first-class JSON validator, and the unifying safe-regeneration contract
- A synthesis that deduplicates and ranks the proposals by priority and benefit over effort across four safety classes
- An independent skeptical verification of the load-bearing proposals by a different model

### Out of Scope
- Implementing any proposal or modifying the generator, parser, schema, or validator code
- Re-scoping the broader 005 program, this study only addresses the generated-JSON surface
- Any change to validate.sh beyond proposing a strict-mode integrity rule

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| research/research.md | Create | The synthesized and verified safety and quality proposals |
| research/deltas/ | Create | The ten per-angle finding sets |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ten angles researched with file-grounded evidence | research/research.md carries proposals from each angle, every load-bearing claim cites a file it read |
| REQ-002 | Proposals synthesized and ranked | A deduplicated ranked proposal set with priority and effort, merging overlapping angles into four safety classes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Load-bearing proposals skeptically verified by a different model | The load-bearing claims carry an independent verdict from a non-gpt-5.5 synthesis model |
| REQ-004 | Read-only, no production code modified | git shows zero changes under the generator, parser, schema, or validator trees |
| REQ-005 | Per-angle evidence retained | research/deltas/ holds the ten finding sets |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A ranked proposal set for the generated-JSON surface, each proposal attributed to evidence and an effort, with the two dominant safety classes addressed concretely
- **SC-002**: A recommended build order that sequences the scoped boundary and the identity resolver ahead of the dependent fixes
- **SC-003**: The load-bearing proposals survive independent skeptical verification, with refuted or downgraded ones marked
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A research seat proposes a fix that the code already implements | Inflated proposal count | Each seat reads the real source and lowers priority on already-solved items, the verify pass downgrades the rest |
| Risk | Single-model research over-claims a safety defect | False priority | The load-bearing claims are skeptically re-checked against the live code by a different model |
| Dependency | The live generator, parser, schema, and validator trees as the research substrate | Without them the safety claims are unfounded | Every proposal cites a file the seat read |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Ten bounded angle seats run in parallel, each scoped to its files so it stays within context
- **NFR-P02**: The verification pass is scoped to the load-bearing proposals only, so it fits a single-dimension model dispatch

### Security
- **NFR-S01**: Every research and verification seat is read-only, no seat can mutate generator, parser, schema, or validator code
- **NFR-S02**: The orchestrator owns all writes, confined to the packet research tree

### Reliability
- **NFR-R01**: Each proposal cites a file the seat actually read, a claim without evidence is dropped in synthesis
- **NFR-R02**: The load-bearing proposals are verified by a different model than the one that surfaced them
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Already-solved proposal: the seat marks it solved in the problem field and lowers priority, synthesis downgrades it to already-done
- Overlapping proposals from different angles: synthesis merges them into one ranked entry per safety class
- An angle with no real finding: returns an empty or low-priority set rather than padding

### Error Scenarios
- A proposal whose evidence does not survive verification: marked downgraded or merged, not silently kept
- A seat that dies mid-run: filtered out, its angle noted as missing rather than counted

### State Transitions
- Find to verify: only the load-bearing or surprising proposals advance to the skeptical pass
- Research to recommendation: the ranked set becomes a build order, not an implementation
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | Ten angles across two generators, a parser, two schemas, and the validator registry |
| Risk | 6/25 | Read-only research, low blast radius, no code change |
| Research | 18/20 | Ten angle-diverse seats with an independent skeptical cross-model verification pass |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Which verified proposals warrant a build phase versus a backlog entry
- Whether the behavioral fixes need a scoped migration phase before any default-on flip
<!-- /ANCHOR:questions -->
