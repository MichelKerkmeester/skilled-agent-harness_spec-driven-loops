---
title: "Feature Specification: 001-documentation-quality-audit-research (skill-advisor docs audit via 20-iter cli-devin SWE 1.6 deep-research)"
description: "Exhaustive audit of system-skill-advisor docs via 20 iterations of /spec_kit:deep-research:auto dispatched through cli-devin SWE 1.6. Surfaces all drift, broken refs, content gaps, HVR violations, alignment misses, and produces a ranked findings ledger that gates phases 002-005."
trigger_phrases:
  - "skill-advisor docs audit"
  - "20-iter deep-research skill-advisor"
  - "cli-devin SWE 1.6 audit"
  - "skill-advisor findings ledger"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded child 001"
    next_safe_action: "Invoke /spec_kit:deep-research:auto with 20 iters"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 001-documentation-quality-audit-research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-skill-advisor docs need a coordinated audit before any rewrite/alignment work begins. A single-pass scan misses cross-cutting drift; 20 targeted iterations across all 6 doc surfaces (SKILL.md, README.md, ARCHITECTURE.md, INSTALL_GUIDE.md, references/*, feature_catalog/*, manual_testing_playbook/*) plus cross-cutting concerns (HVR compliance, cross-link integrity, source↔doc drift, hook-reference resolution) will produce a complete findings ledger.

### Purpose
Run `/spec_kit:deep-research:auto` for 20 iterations via cli-devin SWE 1.6 to produce `research/research.md` — the authoritative findings ledger that gates phases 002-005.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 20 iterations covering: SKILL.md anchors, README marketing-voice gaps, ARCHITECTURE source drift, INSTALL_GUIDE smoke, all 7 references/*, all 7 feature_catalog/* groups, all 9 manual_testing_playbook/* categories, HVR compliance sweep, cross-link integrity, source↔doc drift, hook-reference resolution, MCP tool truth-check, bug hunt, synthesis prep
- Convergence forced disabled (`--convergence=0.0`) — all 20 iters execute
- Executor: cli-devin, model: swe-1.6
- P0 verification gates after loop completes

### Out of Scope
- Actual edits to system-skill-advisor docs (this is read-only audit)
- Embeddings symlink work (owned by 040 follow-on)
- `lib/skill-graph/` relocation (owned by packet 011)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-documentation-quality-audit-research/research/research.md` | Create | Final synthesis (deep-research workflow-owned) |
| `001-documentation-quality-audit-research/research/iterations/iteration-{001..020}.md` | Create | Per-iter output |
| `001-documentation-quality-audit-research/research/deep-research-state.jsonl` | Create | Append-only state log |
| `001-documentation-quality-audit-research/research/deep-research-strategy.md` | Create | Reducer-mutable strategy |
| `001-documentation-quality-audit-research/research/deltas/iter-{001..020}.jsonl` | Create | Per-iter deltas |
| `001-documentation-quality-audit-research/implementation-summary.md` | Update | Verification table post-synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 20 iterations execute fully (no early convergence) | `deep-research-state.jsonl` contains 21+ rows: 1 init + 20 iter rows; final stopReason=`maxIterationsReached` |
| REQ-002 | `research/research.md` ships with synthesis | File exists, ≥1KB, includes Per-track findings + Cross-track patterns + Provenance sections |
| REQ-003 | P0 verification gates pass | grep-verify, smoke-run, JSONL strict-validate, schema-mismatch check all green |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each iter has ≥3 file:line citations per claim | Manual spot-check on 5 random iters |
| REQ-005 | Findings tagged P0/P1/P2 + impact-ranked 1-10 | Visible in iteration-NNN.md Findings sections |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research.md` exists and is reviewed by user before phases 002-005 begin
- **SC-002**: All 20 iters logged in state.jsonl with required fields (`type`, `iteration`, `newInfoRatio`, `status`, `focus`)
- **SC-003**: Parent `derived.last_active_child_id` correctly points to `001-documentation-quality-audit-research` at end of run (restored if clobbered by generate-context.js)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cli-devin background dispatch hangs without `</dev/null` | High | Workflow YAML enforces; verify in logs |
| Risk | SWE-1.6 bundle hallucination | High | P0 gates (grep-verify + smoke-run) before trusting any iter |
| Risk | Early convergence despite `--convergence=0.0` | Medium | Inspect stopReason in state.jsonl; resume if not `maxIterationsReached` |
| Dependency | `/spec_kit:deep-research` skill availability | Green | Verified loaded |
| Dependency | cli-devin CLI installed + SWE 1.6 model accessible | Green | Verified in plan phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Will iter 10 (feature_catalog gap-05) and iter 14 (playbook gap-09) find conclusive root causes or require git log archaeology? Defer to actual run.
<!-- /ANCHOR:questions -->
