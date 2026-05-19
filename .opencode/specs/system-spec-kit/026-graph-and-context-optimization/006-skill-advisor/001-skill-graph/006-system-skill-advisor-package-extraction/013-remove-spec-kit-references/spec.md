---
title: "Feature Specification: Sweep stale advisor refs from spec-kit docs"
description: "Level 2 packet for auditing and cleaning stale system-skill-advisor references in system-spec-kit operator-facing documentation."
trigger_phrases:
  - "013/009/013"
  - "spec-kit advisor ref cleanup"
  - "stale advisor docs"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/013-remove-spec-kit-references"
    last_updated_at: "2026-05-14T19:00:00Z"
    last_updated_by: "codex"
    recent_action: "Spec-kit advisor doc cleanup completed"
    next_safe_action: "Commit scoped changes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---
# Feature Specification: Sweep stale advisor refs from spec-kit docs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
| **Spec Folder** | `013-remove-spec-kit-references` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The advisor extraction moved skill-advisor ownership out of `system-spec-kit` into the sibling `system-skill-advisor` skill and standalone `system_skill_advisor` MCP server. Operator-facing spec-kit docs must not keep live instructions that point users back to old `system-spec-kit/mcp_server/skill_advisor/` paths, old server ownership, or advisor feature catalog entries that now belong with the advisor skill.

### Purpose

Audit only spec-kit documentation surfaces, classify every advisor-related hit, fix stale live instructions, preserve legitimate historical context, and document the result with binding grep and validation evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Scaffold this Level 2 packet under `013/009/013-remove-spec-kit-references`.
- Audit whitelisted system-spec-kit docs for advisor-related references.
- Rewrite stale live references to the current sibling skill and MCP topology.
- Annotate historical references where ambiguity remains.
- Delete advisor-owned feature catalog or playbook entries from spec-kit docs only when they are no longer relevant.

### Out of Scope

- Source code under `.opencode/skills/system-spec-kit/mcp_server/`.
- Docs under `.opencode/skills/system-skill-advisor/`.
- Sibling packets other than this packet's own docs.
- Tool-id, server-id, or skill-id renames.
- Non-doc file changes except this packet's `description.json` and `graph-metadata.json`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/.../013-remove-spec-kit-references/*.md` | Create/modify | Level 2 packet documentation and evidence. |
| `.opencode/specs/.../013-remove-spec-kit-references/{description,graph-metadata}.json` | Create/modify | Packet metadata mirrored from 010 shape. |
| `.opencode/skills/system-spec-kit/**/*.md` | Modify as needed | Whitelisted operator-facing docs only, excluding `mcp_server/`. |
| `.opencode/install_guides/SET-UP - Skill Advisor.md` | Verify/modify as needed | Ensure ownership notes remain current. |
| `.opencode/install_guides/SET-UP - AGENTS.md` | Verify/modify if advisor refs exist | Ensure no stale advisor refs remain. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Baseline advisor grep is captured before fixes. | `BASELINE_HITS_COUNT` is recorded in `implementation-summary.md`. |
| REQ-002 | Stale live spec-kit doc refs are removed or rewritten. | Final grep has zero `STALE_LIVE` matches. |
| REQ-003 | Scope stays inside the hard whitelist. | `FILES_OUT_OF_SCOPE=0`. |
| REQ-004 | Strict validation passes for this packet. | `validate.sh <013-remove-spec-kit-references> --strict` exits 0. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Historical references are preserved when legitimate. | Ambiguous historical refs are annotated rather than deleted. |
| REQ-006 | Advisor-owned catalog/playbook entries are deleted from spec-kit docs if no longer relevant. | Deleted entries are counted in the binding trace. |
| REQ-007 | Fixed files are spot-checked for context preservation. | 3-5 files are inspected after edits. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Packet scaffolded and completed with `completion_pct=100`.
- **SC-002**: Zero `STALE_LIVE` references remain.
- **SC-003**: Strict validation for `013-remove-spec-kit-references` passes.
- **SC-004**: Commit lands on `main` with scoped changes only.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deleting historical migration context | ADR evidence would be lost. | Apply ADR-004: delete live stale refs, annotate historical refs. |
| Risk | Racing packet 011 or 012 | Parallel dispatches own code and advisor-skill docs. | Stay out of `mcp_server/` source and `system-skill-advisor/` docs. |
| Risk | Over-broad doc cleanup | Could modify unrelated docs. | Limit edits to advisor stale-ref matches only. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: Current operator instructions must name the sibling `system-skill-advisor` skill or `system_skill_advisor` server where topology matters.
- **NFR-M02**: Historical annotations should be minimal and explicit.

### Reliability

- **NFR-R01**: Binding counts must reconcile with grep evidence and changed files.
- **NFR-R02**: Packet docs must validate strictly before completion.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Reference Boundaries

- Bare `advisor_*` tool ids can be current when no server ownership is implied.
- `skill_advisor.py` can be current as a Python compat shim filename when the path is correct.
- ADR or implementation-summary mentions of prior topology can remain when explicitly historical.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Documentation-only sweep across several spec-kit doc families. |
| Risk | 12/25 | Main risk is deleting historical context or touching parallel packet territory. |
| Research | 12/20 | Requires handover, ADR-004 policy, prior D2 evidence, and full doc grep bucketing. |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. Gate 3 was pre-answered as Option B for `013/009/013`.
<!-- /ANCHOR:questions -->
