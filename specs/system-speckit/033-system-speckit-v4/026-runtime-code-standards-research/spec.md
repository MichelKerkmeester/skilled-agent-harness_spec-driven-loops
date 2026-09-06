---
title: "Feature Specification: Runtime code standards research"
description: "Ten-iteration deep-research lane that audits the system-spec-kit shared package and runtime against the sk-code-opencode and sk-code-quality standards, and records every deviation with evidence and a mechanical-or-judgment label."
trigger_phrases:
  - "runtime code standards research"
  - "spec kit code standards audit"
  - "sk code opencode conformance spec kit"
  - "shared package duplicate helpers"
  - "runtime cli shell script standards"
  - "deepseek research lane spec kit code"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/026-runtime-code-standards-research"
    last_updated_at: "2026-09-06T08:10:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the research lane planning documents"
    next_safe_action: "Launch the lane through fanout-run.cjs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-v4-reality-research"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Runtime code standards research

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
| **Phase** | 26 of 26 |
| **Predecessor** | 025-docs-reality-alignment-research |
| **Successor** | none |
| **Handoff Criteria** | Ten iterations complete, findings reproduced, confirmed table handed to the remediation child |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 26** of the system-speckit v4 program: a research lane whose only writes land under its own `research/` directory.

**Scope Boundary**: read-only research over the named corpus; remediation is a later child.

**Dependencies**:
- The pi CLI with the OpenRouter DeepSeek V4 Flash route, DevPass as fallback
- The system-deep-loop research mode runner (`fanout-run.cjs`)

**Deliverables**:
- `research/lineages/*/research.md` with ranked, two-sided-cited findings
- `research/confirmed-findings.md`, the reproduced subset the remediation child consumes

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-spec-kit runtime and shared package were built across many packets and two directory moves, while the sk-code-opencode and sk-code-quality standards kept evolving. Nobody has measured the code against those standards since the memory-database decommission, so residue, duplicate helpers, boundary violations and banner drift can persist unnoticed.

### Purpose
Every source file under `shared/` and `runtime/` (excluding `node_modules/` and `dist/`) is checked against the two sk-code standards, and each deviation is recorded with the code citation, the standard clause it violates, a severity and whether the fix is mechanical or needs judgment.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Ten research iterations over `.opencode/skills/system-spec-kit/shared/**` and `.opencode/skills/system-spec-kit/runtime/**` with `sk-code/sk-code-opencode`, `sk-code/sk-code-quality` and the universal code-quality standards as ground truth
- A ranked `research/research.md` whose findings each cite the code `path:line` and the standard `path:line`
- A reproduction pass in this session that confirms or drops every finding and splits the confirmed ones into mechanical and judgment lanes for remediation

### Out of Scope
- Editing any file - research is read-only; remediation is the next phase
- Auditing sk-code itself or other skills - the standards are the ruler, not the subject
- Proposing new abstractions - the standards' restraint ladder forbids abstractions no current requirement earns

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/shared/**` | Read | The @spec-kit/shared package under audit |
| `.opencode/skills/system-spec-kit/runtime/**` | Read | lib, api, cli, hooks and tests under audit; node_modules and dist excluded |
| `.opencode/skills/sk-code/sk-code-opencode/**` | Read | Surface standard: banners, naming, script and hook contracts |
| `.opencode/skills/sk-code/sk-code-quality/**` | Read | Universal quality tiers, error handling, boundaries, coverage floor |
| `research/**` | Create | Loop state, iteration files and the synthesized research.md |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The lane completes ten iterations under `--stop-policy max-iterations` with a non-empty iteration file and one state event per iteration |
| REQ-002 | Every finding cites the code `path:line` and the standard clause `path:line` it violates |
| REQ-003 | Each finding carries a severity (P0 correctness or contract break, P1 standards violation with maintenance cost, P2 cosmetic), a one-line fix and a mechanical-or-judgment label |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The eight research angles (banners, duplicate helpers, error handling and exit codes, module boundaries, dead code and decommission residue, naming and suffixes, coverage floor, shell script hygiene) are each visited by at least one iteration |
| REQ-005 | Findings are reproduced in this session before the remediation phase is planned; unreproducible ones are dropped with a note |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` exists with ten iteration entries and a ranked findings list
- **SC-002**: Every P0 and P1 finding reproduces from the cited code and standard lines when opened in this session
- **SC-003**: The confirmed findings are handed to the remediation phase split into a mechanical table and a judgment table
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | OpenRouter route for DeepSeek V4 Flash on the pi CLI | A lane cannot start or stalls | Retry once, then dispatch the same charter directly through the DevPass route |
| Risk | The executor flags a deliberate exception as a violation (a dependency-free checker, a scanner that must not depend on the shared package) | Med | Reproduction pass reads the file's own rationale before keeping the finding |
| Risk | A lane goes silent without an exit | Med | Monitor log growth every three minutes; a lane silent for fifteen minutes is killed and resumed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each iteration finishes within the executor timeout of one hour; the whole lane within one working day
- **NFR-P02**: At most twelve tool calls per iteration, matching the leaf agent contract

### Security
- **NFR-S01**: The executor runs with the spec gate disabled only because its write authority is the bound research directory
- **NFR-S02**: No credential or token appears in an iteration file; the charter forbids fetching remote content

### Reliability
- **NFR-R01**: Every iteration leaves a parseable state event; a malformed event routes to stuck recovery rather than a silent skip
- **NFR-R02**: Findings without a standard-side citation are excluded from the ranked list
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: An iteration that finds nothing new records a low novelty ratio and moves to the next angle
- Maximum length: Iteration files over the leaf budget are truncated by the executor; the JSONL event remains the record
- Invalid format: A finding whose code citation does not resolve is dropped during the reproduction pass

### Error Scenarios
- External service failure: If OpenRouter rejects the model, the lane falls back to the DevPass route with the same charter
- Network timeout: A silent lane is killed after fifteen minutes and resumed with a typed resumed event
- Concurrent access: The two lanes write to different research directories and never contend

### State Transitions
- Partial completion: A lane that stops short of ten iterations is resumed until it reaches ten
- Session expiry: Not applicable; the loop has no interactive session
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Roughly 700 source files across shared and runtime, read only |
| Risk | 6/25 | No code changes in this phase; findings feed a code-changing phase |
| Research | 18/20 | Ten fresh-context iterations with reproduction |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which confirmed mechanical findings are safe for a GLM 5.3 Flash busy-work lane is decided at remediation planning, per finding
<!-- /ANCHOR:questions -->
