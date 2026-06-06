---
title: "Feature Specification: 101/005 Deep AI Council Fix-ups and Graph Value Scenarios"
description: "Fix the two pre-existing test failures (Claude translated frontmatter parity + persist-artifacts stale HELPER_PATH) and author 6 new value-comparison scenarios DAC-027..DAC-032 that prove the council graph beats the no-graph baseline in real-world situations."
trigger_phrases:
  - "deep-ai-council fixups"
  - "council graph value comparison"
  - "DAC-027"
  - "DAC-032"
  - "claude translated frontmatter parity"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/101-deep-multi-ai-council-skill/005-deep-ai-council-fixups-and-graph-value-scenarios"
    last_updated_at: "2026-05-11T08:10:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored 101/005 spec for fix-ups and value scenarios"
    next_safe_action: "Apply runtime-parity vitest fix"
    blockers: []
    key_files:
      - .opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts
      - .opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-persist-artifacts.vitest.ts
      - .opencode/skills/deep-ai-council/manual_testing_playbook/09--council-graph-value-comparison/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-005-fixups-and-value-scenarios"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Combine the 2 pre-existing fix-ups + 6 new value scenarios into one packet under 101."
      - "Value scenarios live under new category 09--council-graph-value-comparison."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 101/005 Deep AI Council Fix-ups and Graph Value Scenarios

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-11 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (101 phase parent) |
| **Phase** | 5 of 5 |
| **Predecessor** | `004-deep-ai-council-playbook-graph-coverage` |
| **Successor** | None |
| **Handoff Criteria** | Fix the two pre-existing vitest failures surfaced during 101/004's playbook run; add value-comparison scenarios that prove graph adoption beats the no-graph baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When 101/004's playbook run validated all 26 scenarios, two pre-existing vitest failures surfaced:
1. `multi-ai-council-runtime-parity.vitest.ts` enforces byte-equivalent frontmatter across `.opencode/`, `.claude/`, and `.gemini/` agent mirrors. Commit `85bd60b9f` translated Claude's frontmatter to use `tools:` instead of `mode:`/`temperature:`/`permission:`, but the test was never updated. Result: DAC-001 fails despite the mirrors being correctly translated for their runtimes.
2. `multi-ai-council-persist-artifacts.vitest.ts` line 15 points at `.opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs`, but commit `4c82a73ca` moved the helper to `.opencode/skills/deep-ai-council/scripts/persist-artifacts.cjs` during 101/001 (skill extraction). Result: DAC-005 / DAC-007 cannot be exercised via this vitest.

Separately, the 8 functional graph scenarios shipped in 101/004 prove the graph **works** but do not prove the graph adds **value** over a no-graph baseline. Real-world council situations (multi-round disagreements, decision audits, safety-critical convergence checks, blocked-council triage, hot-topic discovery, interruption recovery) need A/B scenarios that contrast the no-graph operator workflow against the with-graph workflow.

### Purpose
Repair the two pre-existing test failures so the entire vitest matrix is green, then author 6 value-comparison scenarios (DAC-027..DAC-032) that demonstrate measurable wins from using the council graph in real-world council situations.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update `multi-ai-council-runtime-parity.vitest.ts` to acknowledge Claude's translated frontmatter while keeping byte-equivalence for OpenCode/Gemini and asserting Claude has the required `tools:` line plus matching name/description.
- Update `multi-ai-council-persist-artifacts.vitest.ts` line 15 `HELPER_PATH` to the canonical script location.
- Re-run both vitest files to confirm green.
- Create `09--council-graph-value-comparison/` playbook category.
- Author 6 scenarios DAC-027..DAC-032 that each describe a real-world council situation, define the no-graph baseline workflow, define the with-graph workflow, and provide a measurable value metric.
- Update root `manual_testing_playbook.md` header metadata (count 26 -> 32, categories 8 -> 9, coverage note refresh, TOC, new §16 COUNCIL GRAPH VALUE COMPARISON, renumber §17/§18, §17 cross-ref row, §18 catalog rows).
- Update phase parent 101 spec.md + graph-metadata.json to add phase 005.

### Out of Scope
- Rewriting the council graph implementation or any `council_graph_*` handler logic.
- Changing the canonical OpenCode or Gemini mirror frontmatter — the test, not the mirror, is wrong.
- Adding new automated vitest tests — value-comparison scenarios are operator-driven contracts.
- Touching 101/001..004 spec packets except parent 101's phase map.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts` | Modify | Acknowledge Claude translated frontmatter; assert shared fields differently |
| `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-persist-artifacts.vitest.ts` | Modify | Line 15 HELPER_PATH -> canonical deep-ai-council location |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md` | Modify | Count, coverage note, TOC, §11 path, new §16, renumber §17/§18, §17 cross-ref, §18 catalog |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/09--council-graph-value-comparison/001..006-*.md` | Create | 6 value-comparison scenarios DAC-027..DAC-032 |
| `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/spec.md` | Modify | Add phase 005 to map |
| `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/graph-metadata.json` | Modify | children_ids, last_active_child_id |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Runtime-parity vitest passes for all 3 markdown mirrors | `npx vitest run tests/multi-ai-council-runtime-parity.vitest.ts` returns 2/2 passed |
| REQ-002 | Persist-artifacts vitest passes (DAC-005, DAC-007 functional coverage restored) | `npx vitest run scripts/tests/multi-ai-council-persist-artifacts.vitest.ts` returns all tests passed |
| REQ-003 | Six new scenarios DAC-027..DAC-032 exist in `09--council-graph-value-comparison/` | `find ... -name '*.md' \| wc -l` returns 6 |
| REQ-004 | Each value-comparison scenario contrasts no-graph vs with-graph workflow with explicit value metric | sk-doc validate_document.py passes; each file contains "Without graph" and "With graph" sections |
| REQ-005 | Root playbook header refreshed to "32 deterministic scenarios across 9 categories" | grep finds the literal string |
| REQ-006 | All council vitests pass cleanly | `npx vitest run` across the 7 council-related vitest files returns 0 failures |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Strict spec validation passes on packet 101/005 and parent 101 | `validate.sh --strict` exit 0 for both |
| REQ-008 | sk-doc quick_validate.py passes on deep-ai-council skill root | Exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Re-running the 101/004 scenario pass shows 26/26 functional scenarios green and the 6 new value scenarios as authored (operator-driven, contract validated by sk-doc).
- **SC-002**: A reviewer reading any DAC-027..DAC-032 scenario can answer "what does the graph give me here that I couldn't get without it" in one sentence.
- **SC-003**: All council-related vitest files (7 total) pass without skipped tests.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 `council_graph_*` tools | None (already complete) | Reference handlers/lib + tests as anchors |
| Risk | Loosening the parity test masks a real Claude mirror drift later | Medium | Keep targeted assertions: Claude must contain name, description prose, and `tools:` line with required tool whitelist |
| Risk | Value-comparison scenarios drift if graph behavior changes | Low | Each scenario anchors to specific MCP tool name and behavior contract in `references/graph_support.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Plan was approved by user via `/remote-control` follow-on before execution.
<!-- /ANCHOR:questions -->
