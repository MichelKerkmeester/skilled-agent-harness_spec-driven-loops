---
title: "Implementation Summary: 101/005 Deep AI Council Fix-ups and Graph Value Scenarios"
description: "Repaired 2 pre-existing vitest failures surfaced by 101/004's playbook run and authored 6 value-comparison scenarios DAC-027..DAC-032 proving the council graph beats the no-graph baseline in real-world situations."
trigger_phrases:
  - "101/005 summary"
  - "deep-ai-council fixups summary"
  - "DAC-027..DAC-032 summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/005-deep-multi-ai-council-skill/005-deep-ai-council-fixups-and-graph-value-scenarios"
    last_updated_at: "2026-05-11T09:05:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Fixed 2 vitests and authored 6 value scenarios"
    next_safe_action: "Mark phase 005 Complete in parent 101 spec.md"
    blockers: []
    key_files:
      - .opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts
      - .opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-persist-artifacts.vitest.ts
      - .opencode/skills/deep-ai-council/manual_testing_playbook/09--council-graph-value-comparison/
      - .opencode/skills/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-005-fixups-and-value-scenarios"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Runtime-parity test was correct at 101/001 ship; commit 85bd60b9f added Claude translated frontmatter without updating the test."
      - "Persist-artifacts vitest HELPER_PATH pointed at the system-spec-kit script location used before 101/001 moved the helper into deep-ai-council."
      - "Value-comparison scenarios use A/B structure: each contrasts no-graph baseline workflow with with-graph workflow on a real-world council situation."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: 101/005 Deep AI Council Fix-ups and Graph Value Scenarios

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/101-deep-multi-ai-council-skill/005-deep-ai-council-fixups-and-graph-value-scenarios` |
| **Status** | Complete |
| **Level** | 1 |
| **Completed** | 2026-05-11 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two surgical test repairs restored the council vitest matrix to fully green (7 files, 43 tests, 0 failures), and six new value-comparison scenarios moved the playbook beyond "the graph works" to "the graph beats the no-graph baseline in real-world situations". Every behavior the playbook is supposed to validate is now exercised by at least one test or operator scenario.

### Fix #1 — Runtime-parity vitest acknowledges Claude translated frontmatter

`multi-ai-council-runtime-parity.vitest.ts` enforced byte-equivalent frontmatter across the three markdown mirrors (OpenCode, Claude, Gemini). The Claude mirror has a translated schema (`tools:` whitelist instead of OpenCode's `mode:`/`temperature:`/`permission:` block) shipped at commit `85bd60b9f` after the test was written. The test now asserts OpenCode and Gemini stay byte-equivalent on the full frontmatter, and Claude must contain the canonical name + description prose + a `tools:` line that includes Read/Write/Edit. DAC-001 now passes 2/2 tests in `mcp_server/tests/`. Verified: `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts:29-58`.

### Fix #2 — Persist-artifacts vitest HELPER_PATH

`multi-ai-council-persist-artifacts.vitest.ts` line 15 was pointing at the pre-extraction script location `.opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs`. Phase 101/001 moved the helper to `.opencode/skills/deep-ai-council/scripts/persist-artifacts.cjs` without updating the test. Path corrected; DAC-005/DAC-007 functional coverage restored. Verified: `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-persist-artifacts.vitest.ts:13-16`. 8/8 tests pass.

### Six new value-comparison scenarios (DAC-027..DAC-032)

A new `09--council-graph-value-comparison/` category holds six A/B scenarios. Each scenario describes a real-world council situation, the no-graph baseline workflow (with concrete operator steps), the with-graph workflow (with concrete MCP tool calls), and a measurable value metric. Scenarios:

- **DAC-027 Unresolved disagreement triage** — graph returns the unresolved critical set in one MCP call; baseline reads 12+ artifacts.
- **DAC-028 Decision provenance audit** — graph returns structured DECISION → SUPPORTS → EVIDENCE → SEAT trace; baseline produces prose narrative.
- **DAC-029 Convergence safety under critical disagreement** — graph returns `STOP_BLOCKED` when 2-of-3 agree but a critical is unresolved; naive two-of-three baseline would have allowed stop.
- **DAC-030 Stalled-council blocker ranking** — graph returns ranked blockers with reason traces; baseline returns unranked survey.
- **DAC-031 Hot-topic discovery** — graph ranks nodes by edge-degree; baseline approximates via text cross-reference counts.
- **DAC-032 Mid-run interruption recovery** — graph status returns counts + readiness + namespace-scoped recovery payload; baseline requires manual JSONL forensics.

### Refreshed root playbook metadata

Root `manual_testing_playbook.md` now reads "32 deterministic scenarios across 9 categories" with a 2026-05-11 coverage note that names every value-comparison scenario. TOC renumbered: new §15 COUNCIL GRAPH VALUE COMPARISON inserted between §14 COUNCIL GRAPH INTEGRATION and §16 AUTOMATED TEST CROSS-REFERENCE; §17 FEATURE CATALOG renumbered from §16. Cross-reference adds an "Operator A/B comparison" row mapping DAC-027..DAC-032; catalog adds 6 rows.

### Phase 005 added to phase parent 101

Parent `spec.md` now has 5 entries in its Phase Documentation Map (phase 004 transitioned to Complete; phase 005 added as In Progress, then Complete once this summary lands). Parent `graph-metadata.json` `children_ids` and `derived.last_active_child_id` now point at 005.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts` | Modified | Acknowledge Claude translated frontmatter; preserve OpenCode/Gemini byte-equivalence; assert Claude has shared identity fields + `tools:` line |
| `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-persist-artifacts.vitest.ts` | Modified | Line 15 HELPER_PATH updated to canonical deep-ai-council location |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md` | Modified | Count 26 -> 32, categories 8 -> 9, coverage note refresh, canonical artifacts list, TOC, new §15, §16/§17 renumber, cross-ref row, catalog rows |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/09--council-graph-value-comparison/001..006-*.md` | Created (6 files) | Scenarios DAC-027..DAC-032 |
| `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/spec.md` | Modified | Added phase 005 to Phase Documentation Map + transitions + handoff |
| `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/graph-metadata.json` | Modified | Added 005 to children_ids; bumped last_active_child_id |
| `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/005-deep-ai-council-fixups-and-graph-value-scenarios/{spec,plan,tasks,implementation-summary,description,graph-metadata}` | Created/Updated | Packet 005 continuity docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each fix was minimal and targeted: runtime-parity test was loosened only for Claude's translated frontmatter while keeping byte-equivalence for OpenCode/Gemini; persist-artifacts test only had its HELPER_PATH constant updated. Value-comparison scenarios followed the same 5-section template as 101/004's functional scenarios but added explicit "Without graph" vs "With graph" subsections inside §3 TEST EXECUTION. Each scenario anchors back to the specific `council_graph_*` MCP tool and the `tests/council-graph.vitest.ts` test name that protects the underlying behavior, so future test renames surface playbook drift immediately.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Combined 2 fixes + 6 value scenarios into one packet | The user requested both deliverables in sequence; one packet keeps the audit trail tight without ceremony overhead |
| Loosened parity test for Claude only, not all mirrors | Gemini legitimately uses the OpenCode schema; only Claude has translated frontmatter per commit 85bd60b9f. Keeping Gemini byte-equivalent preserves the protection against silent Gemini-side drift |
| Value scenarios use A/B comparison rather than pure functional checks | The user explicitly asked for "scenarios that test the actual usefulness of the graph compared to runs without graph". Functional tests already exist in `08--council-graph-integration/`; the value layer is genuinely additive |
| Each value scenario anchors to a specific MCP tool + vitest test name | Without anchoring, the value layer drifts silently when graph behavior evolves. Anchoring makes downstream updates a grep away |
| Did not introduce new automated vitests | All graph behaviors are already covered by `council-graph.vitest.ts` 6/6 passing. Value scenarios are operator-driven A/B contracts, not redundant test code |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fixed runtime-parity vitest | PASS - `npx vitest run tests/multi-ai-council-runtime-parity.vitest.ts` returned `Test Files 1 passed (1) / Tests 2 passed (2)` |
| Fixed persist-artifacts vitest | PASS - `npx vitest run ../scripts/tests/multi-ai-council-persist-artifacts.vitest.ts` returned `Test Files 1 passed (1) / Tests 8 passed (8)` |
| Full 7-file council vitest batch | PASS - 7 test files passed, 43 tests passed, 0 failures |
| sk-doc quick_validate | PASS - `python3 .opencode/skills/sk-doc/scripts/quick_validate.py .opencode/skills/deep-ai-council` returned `Skill is valid!` |
| Per-file validate_document.py (7 files: 6 new scenarios + root playbook) | PASS - all returned `VALID` with `Total issues: 0` |
| Scenario count integrity | PASS - `find ... -mindepth 2 -name '*.md' | wc -l` returned 32 (matches root playbook header claim) |
| Cross-link integrity | PASS - `rg -c 'DAC-(027|028|029|030|031|032)' manual_testing_playbook.md` returned 21 (≥12 expected) |
| Strict spec validation (packet 005) | PASS - `validate.sh --strict` returned `Errors: 0  Warnings: 0` after implementation-summary authored |
| Strict spec validation (parent 101) | PASS - `validate.sh --strict` returned `Errors: 0  Warnings: 0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Value scenarios are operator-driven.** The 6 A/B scenarios document the comparison contract but do not automate the baseline workflow. Operators executing them must seed sandbox sessions and manually run the no-graph baseline before invoking the graph tools. A future packet could add a fixture script for the seeded sessions.
2. **Baseline efficiency claims are descriptive, not benchmarked.** Scenarios say "graph cut effort from 12 file reads to 1 MCP call" — that count is a representative figure for a typical 3-round 3-seat council, not a measured benchmark. The intent is operator-visible value, not a performance regression suite.
3. **Pre-existing §17 FEATURE CATALOG TODO remains.** All 32 scenario rows still carry `No feature catalog exists yet` placeholders inherited from packet 002. Separate workstream.
<!-- /ANCHOR:limitations -->
