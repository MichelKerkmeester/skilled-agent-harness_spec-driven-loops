---
title: "Feature Specification: Shared package utilization research"
description: "Establish what every module of @spec-kit/shared is for, who consumes it, what is residue of the retired memory database, and what should be removed, merged or moved to its sole consumer."
trigger_phrases:
  - "shared package utilization"
  - "shared package utilization research lane"
  - "glm research lane spec kit"
  - "shared package utilization findings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/003-shared-package-utilization"
    last_updated_at: "2026-09-06T16:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the research lane planning documents and goal"
    next_safe_action: "Launch the lane through fanout-run.cjs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Shared package utilization research

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-cli-runtime-utilization |
| **Successor** | 004-template-system-and-acceptance-criteria |
| **Handoff Criteria** | Ten iterations complete, findings reproduced, confirmed table handed to remediation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the spec-kit simplification research: a research lane whose only writes land under its own `research/` directory. Its durable directive is `goal.md`.

**Scope Boundary**: read-only research over the named corpus; remediation is a later child.

**Dependencies**:
- The pi CLI with the DevPass GLM 5.3 Flash route
- The system-deep-loop research mode runner (`fanout-run.cjs`)

**Deliverables**:
- `research/lineages/glm-5-3-flash-shared-package/research.md` with ranked, two-sided-cited findings
- `research/confirmed-findings.md`, the reproduced subset the remediation child consumes

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shared package grew as the neutral layer under a memory server that no longer exists. Its embeddings, ranking, scoring and contract modules may have no live consumer, and its boundaries have already leaked runtime layout once.

### Purpose
Establish what every module of @spec-kit/shared is for, who consumes it, what is residue of the retired memory database, and what should be removed, merged or moved to its sole consumer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Ten research iterations over the corpus below with the runtime as ground truth
- A ranked `research.md` whose findings each carry `[SOURCE: path:line]` evidence
- A reproduction pass in this session that confirms or drops every finding before remediation

### Out of Scope
- Editing any file - research is read-only; remediation is a later child
- Writing-style review - this lane checks facts and utilization

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/shared/**` | Read | Corpus under audit |
| Importers under `runtime/`, `system-skill-advisor`, `system-deep-loop`, `sk-doc`, `.opencode/bin` | Read | Corpus under audit |
| `research/**` | Create | Loop state, iteration files and the synthesized research.md |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The lane completes ten iterations under `--stop-policy max-iterations` with a non-empty iteration file and one state event per iteration |
| REQ-002 | Every finding cites `path:line` on both the claim side and the evidence side |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every charted angle is visited by at least one iteration |
| REQ-004 | Findings are reproduced in this session before remediation is planned; unreproducible ones are dropped with a note |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 10 iteration files and 10 state events exist under research/lineages/glm-5-3-flash-shared-package/
- **SC-002**: research.md carries a per-module consumer census
- **SC-003**: Every P0 and P1 finding reproduces in-session
- **SC-004**: A ranked remove, merge or move list with evidence
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DevPass route for GLM 5.3 Flash on the pi CLI | A lane cannot start or stalls | Retry once, then use the OpenRouter route for the same model |
| Risk | A lane goes silent without an exit | Med | Monitor every minute; a lane silent for fifteen minutes is killed and resumed |
| Risk | The executor reports a convention as a defect | Med | Reproduction in this session checks the standard and the code before keeping a row |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each iteration finishes within the executor timeout of one hour
- **NFR-P02**: At most twelve tool calls per iteration, matching the leaf agent contract

### Security
- **NFR-S01**: The executor runs with the spec gate disabled only because its write authority is the bound research directory
- **NFR-S02**: No credential appears in an iteration file; the charter forbids fetching remote content

### Reliability
- **NFR-R01**: Every iteration leaves a parseable state event
- **NFR-R02**: Findings without an evidence-side citation are excluded from the ranked list
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an iteration that finds nothing new records a low novelty ratio and moves to the next angle
- Maximum length: iteration files over the leaf budget are truncated by the executor; the JSONL event remains the record
- Invalid format: a finding whose citation does not resolve is dropped during reproduction

### Error Scenarios
- External service failure: if DevPass rejects the model, the lane falls back to OpenRouter with the same charter
- Network timeout: a silent lane is killed after fifteen minutes and resumed with a typed resumed event
- Concurrent access: lanes run one at a time, so they never contend

### State Transitions
- Partial completion: a lane that stops short of ten iterations is resumed until it reaches ten
- Session expiry: not applicable; the loop has no interactive session
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | A whole package or document family, read only |
| Risk | 4/25 | No code changes in this phase |
| Research | 18/20 | Ten fresh-context iterations with reproduction |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which confirmed rows become their own remediation child versus a row in a shared one is decided at synthesis
<!-- /ANCHOR:questions -->
