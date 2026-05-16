---
title: "Feature Specification: Deep Research Issues [template:level_2/spec.md]"
description: "Research packet for the 10-iteration sweep over code graph, hook/plugin, advisor, and adjacent integration bug surfaces."
trigger_phrases:
  - "deep research issues"
  - "code graph bug surface"
  - "hook advisor synthesis"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/003-deep-research-issues"
    last_updated_at: "2026-05-06T05:27:17Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored final synthesis and applied user framing correction"
    next_safe_action: "Open remediation packet focused on the two remaining end-user P0s"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/resource-map.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "cli-codex-synthesis-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether SPECKIT_CODE_GRAPH_INDEX_SKILLS is default setup or maintainer-mode opt-in"
      - "Where candidate manifest drift fires"
      - "Why zero-node scans can persist"
      - "How parser runtime errors affect persistence"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Deep Research Issues

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-06 |
| **Branch** | `003-deep-research-issues` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The native rerun downgraded code graph from useful to overhead after broad scans, read-path drift blocks, parser crashes, and a zero-node persistence regression made the graph unreliable during framework-maintainer work. User clarification on 2026-05-06 corrected one premise: default scope excludes framework backend paths by design because template users primarily index their own production code. The remaining synthesis still needed to identify which findings affect end users and which are maintainer-only polish.

### Purpose
Produce a final, citable research synthesis that converts 10 read-only iterations into a remediation backlog with severity, file:line evidence, negative knowledge, operator configuration guidance, and the corrected default-scope design-intent framing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Synthesize `research/iterations/iteration-001.md` through `iteration-010.md`.
- Deduplicate P0/P1/P2 findings across code graph, hooks/plugin, advisor, seed contracts, and tests.
- Create root packet artifacts and canonical `research/research.md` plus `research/resource-map.md`.
- Update parent `011-real-world-usefulness-test/graph-metadata.json.children_ids` with this child packet.

### Out of Scope
- Implementing the remediation backlog; that belongs in a follow-up Phase 014 or sibling 015 packet.
- Re-running native measurements from `012/002`; this packet uses the existing iteration artifacts.
- Investigating unrelated skills outside code graph, hooks/plugin, advisor, CocoIndex handoff, and related test coverage.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `description.json` | Create | Canonical packet identity metadata |
| `graph-metadata.json` | Create | Canonical graph metadata for this research packet |
| `spec.md` | Create | Level 2 research packet scope |
| `plan.md` | Create | Execution plan for the completed 10-iteration sweep |
| `tasks.md` | Create | Completed iteration and synthesis task ledger |
| `checklist.md` | Create | Verification checklist for required research outputs |
| `implementation-summary.md` | Create | Packet-level delivery summary |
| `decision-record.md` | Create | Supplemental ADRs for synthesis decisions |
| `research/research.md` | Create | Final canonical research report |
| `research/resource-map.md` | Create | File:line citation map grouped by subsystem |
| `../graph-metadata.json` | Update | Add this child packet to the parent `children_ids` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Final synthesis exists at `research/research.md` | File contains executive summary, methodology, severity view, axis view, primary-question answers, remediation scope, env snippets, negative knowledge, iteration index, and convergence note |
| REQ-002 | Each unique actionable finding has file:line evidence | Every listed finding contains at least one `path:line` citation or an explicit TODO if a source did not provide one |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Root Level 2 planning artifacts exist | `description.json`, `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `graph-metadata.json`, and `implementation-summary.md` are present |
| REQ-004 | Remediation backlog is implementation-ready | `research/research.md` lists file-by-file remediation, rollout order, and test additions |
| REQ-005 | Resource map exists | `research/resource-map.md` groups every finding citation by subsystem |

### P2 - Suggestions

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Default and maintainer-mode env guidance is drafted | `research/research.md` states no env vars are needed for default end-user project-code indexing and includes `.env` plus `opencode.json` snippets for framework maintainer mode |
| REQ-007 | Major synthesis choices are recorded | `decision-record.md` contains short ADRs documenting dedupe and remediation-scope choices |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict spec validation exits 0 for this packet.
- **SC-002**: Deduplicated findings preserve the original total counts as provenance: P0=3, P1=19, P2=13, then record corrected status counts: P0=2, P1=16, P2=12, DESIGN-INTENT closed=1.
- **SC-003**: Parent metadata includes `system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/003-deep-research-issues`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Iteration artifacts | Synthesis quality depends on the 10 markdown reports and JSONL deltas being present | All required iteration and delta files were read before synthesis |
| Risk | Duplicate findings | Remediation scope could over-count symptoms as root causes | Findings are grouped by severity and axis, with repeated coverage gaps folded into root-cause entries where appropriate |
| Risk | Validation strictness | Supplemental `decision-record.md` on a Level 2 packet could create warnings | The packet remains Level 2; the ADR file is supplemental and keeps required frontmatter/template markers |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Traceability
- **NFR-T01**: Every actionable finding must carry a file:line citation.
- **NFR-T02**: Dedupe counts must preserve the raw delta totals for auditability.

### Validation
- **NFR-V01**: Strict Spec Kit validation must pass before completion is claimed.
- **NFR-V02**: Parent metadata must remain valid JSON after adding this child.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Missing Evidence
- Missing iteration file: mark the affected finding source TODO and do not fabricate evidence.
- Missing line citation: keep the finding but flag the missing citation explicitly.

### Duplicate Evidence
- Repeated findings across iterations are merged when they describe the same root cause.
- Test and docs gaps remain separate only when they require distinct remediation work.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Multiple docs plus parent metadata, no runtime code |
| Risk | 12/25 | Research conclusions affect follow-up remediation order |
| Research | 18/20 | 10 iterations and 35 raw findings |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None for this synthesis packet. Implementation questions are carried into the recommended remediation scope in `research/research.md`.
<!-- /ANCHOR:questions -->
