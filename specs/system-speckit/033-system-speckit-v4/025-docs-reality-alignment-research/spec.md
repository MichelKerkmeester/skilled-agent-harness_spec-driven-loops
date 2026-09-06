---
title: "Feature Specification: Docs reality alignment research"
description: "Ten-iteration deep-research lane that checks the system-spec-kit manual-testing playbook, feature catalog and references against the code that ships today, and records every mismatch with evidence."
trigger_phrases:
  - "docs reality alignment research"
  - "playbook versus runtime mismatch"
  - "feature catalog stale entries"
  - "spec kit references drift audit"
  - "retired capability still documented"
  - "deepseek research lane spec kit docs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/025-docs-reality-alignment-research"
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
# Feature Specification: Docs reality alignment research

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
| **Phase** | 25 of 26 |
| **Predecessor** | 024-metadata-regeneration-and-shared-parser |
| **Successor** | 026-runtime-code-standards-research |
| **Handoff Criteria** | Ten iterations complete, findings reproduced, confirmed table handed to the remediation child |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 25** of the system-speckit v4 program: a research lane whose only writes land under its own `research/` directory.

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
The system-spec-kit documentation grew through the memory-database era and the CLI move from `scripts/` to `runtime/cli/`. Operators following a playbook step, a catalog entry or a reference can land on a command, path, flag or capability that no longer exists, and nothing today measures how much of the documentation still describes the current runtime.

### Purpose
Every document under `manual-testing-playbook/`, `feature-catalog/` and `references/` is checked against the runtime, and each mismatch is recorded with a doc citation, a code citation, a severity and a one-line fix, ready for the remediation phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Ten research iterations over `.opencode/skills/system-spec-kit/{manual-testing-playbook,feature-catalog,references}` with the runtime, shared package, templates, commands and SKILL.md as ground truth
- A ranked `research/research.md` whose findings each carry `[SOURCE: path:line]` evidence on both the doc side and the code side
- A reproduction pass in this session that confirms or drops every finding before it reaches the remediation phase

### Out of Scope
- Editing any documentation or code - research is read-only; remediation is the next phase, created after synthesis
- Writing-style review - the sk-doc quality program owns voice and structure; this lane checks facts
- Packets under `specs/` - they are evidence at most, not the corpus under test

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/manual-testing-playbook/**` | Read | Operator scenarios checked step by step against the CLI |
| `.opencode/skills/system-spec-kit/feature-catalog/**` | Read | Feature entries checked for retired or missing capabilities |
| `.opencode/skills/system-spec-kit/references/**` | Read | Reference documents checked against runtime behavior |
| `research/**` | Create | Loop state, iteration files and the synthesized research.md |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The lane completes ten iterations under `--stop-policy max-iterations` with a non-empty iteration file and one state event per iteration |
| REQ-002 | Every finding in `research/research.md` cites a doc `path:line` and a code `path:line` or a command with its observed output |
| REQ-003 | Each finding carries a severity (P0 wrong or harmful, P1 misleading, P2 cosmetic) and a one-line proposed fix |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The seven research angles (stale commands and paths, retired capabilities, contradicted runtime behavior, non-executable scenarios, undocumented shipped features, cross-document contradictions, phantom index entries) are each visited by at least one iteration |
| REQ-005 | Findings are reproduced in this session before the remediation phase is planned; unreproducible ones are dropped with a note |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` exists with ten iteration entries and a ranked findings list
- **SC-002**: Every P0 and P1 finding reproduces from the cited doc and code lines when opened in this session
- **SC-003**: The reproduced findings are handed to the remediation phase as a numbered table with doc path, actual behavior and fix
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | OpenRouter route for DeepSeek V4 Flash on the pi CLI | A lane cannot start or stalls | Retry once, then dispatch the same charter directly through the DevPass route |
| Risk | The executor reports doc drift that is really a template convention | Med | Reproduction pass in this session checks the claim against the runtime before it is kept |
| Risk | A lane goes silent without an exit | Med | Monitor log growth every three minutes; a lane silent for fifteen minutes is killed and resumed in lineage-resume mode |
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
- **NFR-R02**: Findings without a code-side citation are excluded from the ranked list rather than kept as guesses
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: An iteration that finds nothing new records a low novelty ratio and moves to the next angle instead of restating prior findings
- Maximum length: Iteration files over the leaf budget are truncated by the executor; the reducer keeps the JSONL event as the record of truth
- Invalid format: A finding whose doc citation does not resolve is dropped during the reproduction pass

### Error Scenarios
- External service failure: If OpenRouter rejects the model, the lane falls back to the DevPass route with the same charter
- Network timeout: A silent lane is killed after fifteen minutes and resumed; the resumed lineage appends a typed resumed event
- Concurrent access: The two lanes write to different research directories, so they never contend for a file

### State Transitions
- Partial completion: A lane that stops short of ten iterations is resumed until it reaches ten; synthesis waits for both lanes
- Session expiry: Not applicable; the loop has no interactive session
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Three doc trees, roughly 170 markdown files, read only |
| Risk | 4/25 | No code changes in this phase |
| Research | 18/20 | Ten fresh-context iterations with reproduction |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether retired capabilities should be documented as history or removed outright is decided in the remediation phase, per document
<!-- /ANCHOR:questions -->
