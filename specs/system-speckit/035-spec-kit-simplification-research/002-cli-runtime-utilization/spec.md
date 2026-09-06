---
title: "Feature Specification: CLI runtime utilization research"
description: "Establish what every directory of the @spec-kit/cli package is for, who actually calls it, what is dead or test-only, and what should be removed or merged."
trigger_phrases:
  - "cli runtime utilization"
  - "cli runtime utilization research lane"
  - "glm research lane spec kit"
  - "cli runtime utilization findings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/002-cli-runtime-utilization"
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
# Feature Specification: CLI runtime utilization research

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-ripgrep-search-system |
| **Successor** | 003-shared-package-utilization |
| **Handoff Criteria** | Ten iterations complete, findings reproduced, confirmed table handed to remediation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the spec-kit simplification research: a research lane whose only writes land under its own `research/` directory. Its durable directive is `goal.md`.

**Scope Boundary**: read-only research over the named corpus; remediation is a later child.

**Dependencies**:
- The pi CLI with the DevPass GLM 5.3 Flash route
- The system-deep-loop research mode runner (`fanout-run.cjs`)

**Deliverables**:
- `research/lineages/glm-5-3-flash-cli-runtime/research.md` with ranked, two-sided-cited findings
- `research/confirmed-findings.md`, the reproduced subset the remediation child consumes

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The CLI package holds roughly thirty directories, a registry that lists fourteen entry points, and a README that describes it as context generation. The research lane measured the callers: continuity is the most-referenced half, validation carries the heaviest execution, and every retrieval reference is a reminder rather than a mechanism. Before the lane, nobody had mapped what is live.

### Purpose
Establish what every directory of the @spec-kit/cli package is for, who actually calls it, what is dead or test-only, and what should be removed or merged.
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
| `.opencode/skills/system-spec-kit/runtime/cli/**` | Read | Corpus under audit |
| `scripts-registry.json`, `package.json`, `README.md`, `../../ARCHITECTURE.md` | Read | Corpus under audit |
| Callers under `.opencode/commands`, `.opencode/bin`, `.opencode/hooks`, `.opencode/plugins`, `.github/workflows` | Read | Corpus under audit |
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

- **SC-001**: 10 iteration files and 10 state events exist under research/lineages/glm-5-3-flash-cli-runtime/
- **SC-002**: research.md carries a per-directory table: purpose, callers, verdict
- **SC-003**: Every P0 and P1 finding reproduces in-session
- **SC-004**: A ranked removal and merge list with the evidence that nothing documented depends on each item
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
