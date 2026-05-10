---
title: "Implementation Plan: Phase 008 Final Cleanup"
description: "Execute Packet 070 final cleanup in order: planning artifacts, advisor signal tuning, deep-loop family rename, sk-code entity normalization, ADRs, and strict validation."
trigger_phrases:
  - "070 phase 008 plan"
  - "final cleanup plan"
  - "deep-loop family plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/070-sk-deep-rename/008-final-cleanup"
    last_updated_at: "2026-05-05T17:45:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed Phase 008 cleanup sequence"
    next_safe_action: "Orchestrator can run advisor_rebuild via MCP to refresh native routing"
    blockers: []
    key_files:
      - "plan.md"
      - "../review/review-report.md"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 008 Final Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON, Python, Markdown |
| **Framework** | Spec Kit Level 2 phase documentation and skill advisor graph source |
| **Storage** | Git-tracked specs and skill metadata |
| **Testing** | JSON parse, advisor probe, advisor validation, grep, strict spec validation |

### Overview
Phase 008 fixes the three final approved P1 findings from the Packet 070 review. The work is intentionally narrow: adjust routing signals, align the internal family taxonomy, normalize one rejected metadata kind, then validate both the child and phase parent specs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Review report read from `../review/review-report.md`.
- [x] Approved spec folder and write set supplied by user.
- [x] Current advisor graph source read before editing.
- [x] Current compiler family/entity validation read before editing.
- [x] Current deep-loop and `sk-code` graph metadata read before editing.

### Definition of Done
- [x] `deep-review` has requested positive signals.
- [x] `sk-code-review` has requested loop/audit anti-signals.
- [x] `sk-deep` family identity is replaced by `deep-loop` in approved files.
- [x] `reference-category` is replaced with `reference`.
- [x] ADRs and implementation summary are written.
- [x] Child and parent strict validation exit 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-of-truth metadata cleanup. The phase edits the graph source and per-skill metadata directly, keeping compiler validation in sync with the new family taxonomy.

### Key Components
- **Review evidence**: `../review/review-report.md`.
- **Advisor source**: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json`.
- **Compiler validation**: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py`.
- **Skill metadata**: `deep-review`, `deep-research`, and `sk-code` graph metadata.
- **Decision record**: `decision-record.md`.

### Data Flow
The review finding identifies the misrouting and metadata errors. Phase 008 patches source metadata, validates parse and compiler constraints, then records evidence in `tasks.md`, `checklist.md`, and `implementation-summary.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Finding | Surface | Action | Verification |
|---------|---------|--------|--------------|
| P1-002 | `skill-graph.json` signals | Add deep-review positives and sk-code-review anti-signals | Advisor probe and JSON assertions |
| P1-003 | Family metadata and compiler | Rename `sk-deep` family to `deep-loop` | JSON assertion and grep for old family refs |
| P1-004 | `sk-code` graph metadata | Change `reference-category` to `reference` | Grep for old entity kind and advisor validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Planning Artifact Setup
- [x] Create Phase 008 `description.json`, `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `graph-metadata.json`.
- [x] Add Phase 008 to parent `graph-metadata.json` children.

### Phase 2: P1-002 Advisor Signal Tuning
- [x] Add requested positive `deep-review` signals.
- [x] Add requested `sk-code-review` anti-signals.
- [x] Re-probe iterative review-loop audit prompt where possible.

### Phase 3: P1-003 Deep-Loop Family Rename
- [x] Rename `families.sk-deep` to `families.deep-loop`.
- [x] Update `deep-review` and `deep-research` per-skill family fields.
- [x] Update compiler family allow-list.

### Phase 4: P1-004 Entity Kind Normalization
- [x] Replace `reference-category` with `reference`.
- [x] Run advisor validation and targeted grep.

### Phase 5: Decisions and Validation
- [x] Create `decision-record.md` with ADR-001 through ADR-003.
- [x] Create `implementation-summary.md` with final evidence.
- [x] Run child and parent strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| JSON parse | Edited JSON files | `/usr/bin/python3 -c` |
| Advisor routing | P1-002 prompt | `skill_advisor.py` |
| Advisor validation | Metadata compiler constraints | `skill_advisor.py --validate-only --show-rejections` |
| Grep checks | Old family and entity kind refs | `grep` / `rg` |
| Spec validation | Phase 008 and parent packet | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

- Phase 006/007 review context exists under the parent packet.
- `/usr/bin/python3` is available.
- The spec validator is available under `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`.
- The orchestrator may run advisor rebuild after source edits if generated artifacts lag.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

Rollback is hunk-local: remove added signals, restore the family key and family fields, restore the compiler allow-list, and change the `motion_dev` entity kind back only if the entity-kind contract is intentionally expanded later.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Dependency | Notes |
|-------|------------|-------|
| 006 | Advisor and validation | Owns prior advisor rebuild and validation context |
| 007 | Deep review remediation | Partially tuned P1-002 and deferred P1-003/P1-004 before Phase 008 reopened them |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Reason |
|-----------|----------|--------|
| Planning artifacts | Medium | Level 2 docs plus decision record and summary |
| Advisor signal tuning | Low | Single JSON source patch |
| Family rename | Low | One graph key, two metadata fields, one compiler allow-list |
| Entity kind fix | Low | One JSON field |
| Validation | Medium | Advisor checks plus child and parent strict validation |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

If the advisor probe shows a regression, keep the family and entity-kind fixes but tune only the signal arrays. If compiler validation fails on the family rename, the likely rollback point is the `ALLOWED_FAMILIES` set or a missed per-skill family field.
<!-- /ANCHOR:enhanced-rollback -->
