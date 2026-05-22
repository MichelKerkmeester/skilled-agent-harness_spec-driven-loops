---
title: "Feature Specification: 116 — Deep Review Search-Depth Hardening"
description: "Phase parent for turning the completed deep-review complexity research into staged search-depth hardening across schema, validation, reducer persistence, convergence, graph vocabulary, and rollout playbooks."
trigger_phrases:
  - "deep-review search-depth hardening"
  - "deep-review search ledger"
  - "candidate generation review"
  - "search coverage gates"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Initialized phased parent for deep-review search-depth hardening."
    next_safe_action: "Resume 002-seeded-fixture-harness and add failing fixtures before production changes."
    blockers:
      - "Spec Kit Memory MCP indexing is unavailable: Not connected"
    key_files:
      - "001-research-synthesis/research/research.md"
      - "002-seeded-fixture-harness/spec.md"
      - "003-review-depth-schema-and-prompt-contract/spec.md"
      - "004-validator-v2-enforcement/spec.md"
    session_dedup:
      fingerprint: "sha256:1161161161161161161161161161161161161161161161161161161161160000"
      session_id: "116-deep-review-complexity-phase-parent"
      parent_session_id: null
    completion_pct: 12
    open_questions:
      - "Should future implementation phases upgrade from Level 1 to Level 2 or Level 3 before code edits?"
    answered_questions:
      - "Phase 001 owns the completed 15-iteration research synthesis."
      - "Implementation starts with seeded fixtures before schema, validator, reducer, convergence, graph, or rollout changes."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: 116 — Deep Review Search-Depth Hardening

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0/P1 phased program |
| **Status** | Active parent; 001 complete; 002 planned next |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Parent Spec** | `..` (skilled-agent-orchestration track root) |
| **Parent Packet** | skilled-agent-orchestration |
| **Predecessor** | 115-deep-ai-council-rename |
| **Successor** | None planned |
| **Handoff Criteria** | Each child validates independently; parent recursive validation passes; memory indexing refreshes when MCP reconnects |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The completed research showed that `deep-review` validates discovered findings strongly, but it does not require enough pre-finding candidate search proof before a dimension can count as covered. A clean or no-finding review needs auditable target selection, bug-class hypotheses, invariant checks, producer/consumer tracing, negative-case search, and remaining search debt.

### Purpose
Coordinate the staged hardening of `deep-review` so standard and complex review runs can prove what was searched, what was ruled out, what remains blocked, and why a PASS or CONDITIONAL verdict is justified.

> **Phase-parent note:** This parent tracks the child phase map only. Detailed planning, tasks, checklists, decisions, and continuity live inside the child phase folders listed below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Preserve the completed 15-iteration research evidence in phase 001.
- Add seeded fixtures before production changes.
- Define `reviewDepthSchemaVersion`, `reviewDepthApplicability`, `targetSelection`, `searchCoverage`, and `searchLedger` contracts.
- Add validator warning/advisory behavior and strict v2 enforcement.
- Persist search debt through reducer, dashboard, and final report surfaces.
- Add candidate-saturation and graphless-fallback stop gates.
- Add ledger-led graph vocabulary after text/JSON ledger semantics are stable.
- Add manual playbooks and revisit iteration defaults after gates prove useful.

### Out of Scope
- Changing `deep-review` production behavior directly at the parent level.
- Treating graph availability as required when text/JSON fallback evidence can satisfy the same obligations.
- Raising iteration defaults as a standalone fix before search proof exists.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/001-research-synthesis/` | Preserve | 001 | Completed research evidence and synthesis. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts` | Modify/Create | 002, 004 | Seeded validator fixtures and v2 enforcement tests. |
| `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl` | Modify | 003 | Prompt contract for search ledger and target selection. |
| `.opencode/skills/deep-review/references/state_format.md` | Modify | 003 | Versioned review-depth state fields. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` | Modify | 004 | Warning/advisory surface and strict v2 checks. |
| `.opencode/skills/deep-review/scripts/reduce-state.cjs` | Modify | 005, 006 | Search debt persistence and convergence inputs. |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | 005, 006, 007 | Report synthesis, stop gates, and graph projection. |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | 005, 006, 007 | Confirm workflow parity. |
| `.opencode/skills/deep-review/manual_testing_playbook/` | Create/Modify | 008 | Seeded review-depth manual scenarios. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-research-synthesis/` | Completed 15-iteration research synthesis and evidence registry. | Complete |
| 002 | `002-seeded-fixture-harness/` | Add failing fixtures and seeded targets before production changes. | Planned |
| 003 | `003-review-depth-schema-and-prompt-contract/` | Define review-depth schema and prompt contract. | Planned |
| 004 | `004-validator-v2-enforcement/` | Add warnings and strict v2 validator enforcement. | Planned |
| 005 | `005-search-ledger-persistence-and-reporting/` | Persist ledger/search debt through reducer, dashboard, and report. | Planned |
| 006 | `006-candidate-saturation-and-graphless-gates/` | Add candidate-saturation and graphless fallback stop gates. | Planned |
| 007 | `007-ledger-led-graph-vocabulary/` | Project stable ledger semantics into graph vocabulary. | Planned |
| 008 | `008-playbooks-and-default-calibration/` | Add manual playbooks and calibrate defaults after gates exist. | Planned |

### Phase Transition Rules

- 002 must create failing fixtures before 003-007 production changes begin.
- 003 defines the versioned contract that 004 validates and 005 persists.
- 004 must support legacy warning behavior before hard-failing explicit v2 records.
- 005 must preserve search debt before 006 can use it for stop decisions.
- 007 starts only after text/JSON ledger semantics are stable.
- 008 evaluates rollout and defaults after seeded tests and gates pass.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Research synthesis complete and phase parent validates. | `validate.sh --recursive --strict` |
| 002 | 003 | Failing fixtures exist for schema, validator, reducer, convergence, graphless fallback, and playbook surfaces. | Targeted fixture test commands fail for current shallow behavior. |
| 003 | 004 | Prompt/state docs define versioned review-depth schema. | Prompt render tests assert required terms. |
| 004 | 005 | Valid v2 records pass; shallow v2 records fail; legacy records warn. | `post-dispatch-validate` vitest suite. |
| 005 | 006 | Reducer/dashboard/report expose candidate coverage and search debt. | Reducer fixture and dashboard/report assertions. |
| 006 | 007 | Stop gates block shallow no-finding standard/complex reviews. | STOP_BLOCKED candidate and graphless fallback fixtures. |
| 007 | 008 | Graph projection mirrors ledger semantics without breaking graphless mode. | Coverage graph and graphless fallback tests. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should phase 003 and later phases upgrade to Level 2/3 before production edits begin?
- Which exact seeded target should be the first end-to-end no-finding prevention scenario?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research synthesis**: `001-research-synthesis/research/research.md`
- **Graph Metadata**: `graph-metadata.json`
- **Next active phase**: `002-seeded-fixture-harness/`
