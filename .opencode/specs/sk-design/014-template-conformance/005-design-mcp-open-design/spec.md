---
title: "Feature Specification: design-mcp-open-design template conformance"
description: "Audit every file and subdirectory under `design-mcp-open-design/` against the governing create-skill templates, fix confirmed header/structure defects, and record deliberate transport-packet deviations (like the absent `procedures/` directory) as legitimate rather than missing."
trigger_phrases:
  - "design-mcp-open-design template conformance"
  - "template conformance"
  - "phase parent"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/005-design-mcp-open-design"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author phase-parent spec for template-conformance subtree"
    next_safe_action: "Plan or resume a child leaf"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-mcp-open-design/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase map only; no plan/tasks/checklist/decision/impl-summary here (those live in child phase folders). -->

# Feature Specification: design-mcp-open-design template conformance

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Phase Parent lean trio |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance` |
| **Handoff Criteria** | Each child leaf validates independently before the subtree validates `--recursive` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Open Design MCP transport packet (`design-mcp-open-design/`) has not been audited against the create-skill template family. It is a TRANSPORT packet (`packetKind: transport`), not a workflow packet, so its tool-surface posture and directory shape differ from ordinary skill modes — a blanket audit risks flagging legitimate transport-only deviations as defects.

### Purpose
Audit every file and subdirectory under `design-mcp-open-design/` against the governing create-skill templates, fix confirmed header/structure defects, and record deliberate transport-packet deviations (like the absent `procedures/` directory) as legitimate rather than missing.

> **Phase-parent note:** root stays lean — `spec.md`, `description.json`, `graph-metadata.json`. All audit detail, findings, and fixes live in the child leaves below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 9 first-level entries of `design-mcp-open-design/`: packet root docs, `references/`, `fixtures/`, `scripts/`, `tests/`, `mcp-servers/`, `feature-catalog/`, `manual-testing-playbook/`, `changelog/`.
- Markdown structure conformance (H1/H2 numbering, `---` separators, OVERVIEW presence) for every markdown file in scope.

### Out of Scope
- Relocating the 4 loose `.mjs` executables at the packet root (`grounding-receipt.mjs`, `live-transport.mjs`, `offline-gate.mjs`, `return-reconciliation.mjs`) into `scripts/` or `corpus/` — that decision is owned by sibling packet `008-structural-anomalies`, not this subtree.
- The transport's runtime behavior, MCP wiring, or live-server integration — this is a documentation-conformance audit only.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| design-mcp-open-design/{SKILL,README,INSTALL-GUIDE}.md | Audit/Fix | 001-packet-root | Packet-root doc conformance |
| design-mcp-open-design/references/*.md | Audit/Fix | 002-references | 5 confirmed-defective + 3 unaudited + 1 conformant |
| design-mcp-open-design/fixtures/** | Audit | 003-fixtures | Directory-rule conformance |
| design-mcp-open-design/scripts/** | Audit | 004-scripts | Directory-rule conformance |
| design-mcp-open-design/tests/** | Audit | 005-tests | Directory-rule conformance |
| design-mcp-open-design/mcp-servers/** | Audit | 006-mcp-servers | Directory-rule conformance |
| design-mcp-open-design/feature-catalog/** | Audit/Fix | 007-feature-catalog | feature-catalog-template.md conformance |
| design-mcp-open-design/manual-testing-playbook/** | Audit/Fix | 008-manual-testing-playbook | manual-testing-playbook-template.md conformance |
| design-mcp-open-design/changelog/*.md | Audit/Fix | 009-changelog | changelog-template.md conformance |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently validatable audit-and-conform leaf.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-packet-root/` | SKILL.md/README.md/INSTALL-GUIDE.md conformance; loose .mjs relocation flagged (not owned here) | Planned |
| 2 | `002-references/` | 9 reference docs: 5 known-defective headers, 3 unaudited, 1 confirmed conformant | Planned |
| 3 | `003-fixtures/` | fixtures/ directory-rule audit (no authored template) | Planned |
| 4 | `004-scripts/` | scripts/ directory-rule audit (no authored template) | Planned |
| 5 | `005-tests/` | tests/ directory-rule audit (no authored template) | Planned |
| 6 | `006-mcp-servers/` | mcp-servers/ directory-rule audit (no authored template) | Planned |
| 7 | `007-feature-catalog/` | feature-catalog/ conformance to feature-catalog-template.md | Planned |
| 8 | `008-manual-testing-playbook/` | manual-testing-playbook/ conformance to its template | Planned |
| 9 | `009-changelog/` | changelog/ conformance to changelog-template.md | Planned |

### Phase Transition Rules
- Each leaf passes `validate.sh` independently; validate the subtree with `validate.sh --recursive --strict`.
- Leaves with no known defects run the exhaustive audit first; "conformant, no changes" is a legitimate leaf outcome.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| each leaf | subtree parent | leaf validate.sh --strict passes | CLI exit 0 |
| subtree parent | program parent (owned by another worker) | validate.sh --recursive --strict passes for the whole subtree | CLI exit 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS
- Whether the loose `.mjs` executables at the packet root get relocated is decided by `008-structural-anomalies`; this subtree only documents that the decision is out of its scope.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Program parent:** `../spec.md` (owned by another worker).
- **Graph Metadata:** `graph-metadata.json`.
