---
title: "Feature Specification: Phase 019 - Transport Mode Benchmark Coverage & Routing Re-Verification"
description: "Adds manual_testing_playbook coverage for the new design-mcp-open-design transport packet, syncs the skill-level advisor descriptor (description.json/graph-metadata.json), and re-runs both router-mode and live-mode skill-benchmarks to produce a fresh whole-hub baseline."
trigger_phrases:
  - "transport mode benchmark coverage"
  - "phase 019 sk-design"
  - "sk-design re-benchmark after transport integration"
  - "MR-007 open design routing"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/019-transport-mode-benchmark-coverage"
    last_updated_at: "2026-07-07T11:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec.md"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "transport-benchmark-019"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 019 - Transport Mode Benchmark Coverage & Routing Re-Verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 018 integrated `design-mcp-open-design` as a registered `packetKind: "transport"` mode in sk-design's registries, but the hub's `manual_testing_playbook` (the corpus the skill-benchmark harness scores against) still only exercised the five original design-judgment modes — it had zero scenarios naming the new mode. The skill-level advisor descriptor (`description.json`) and `graph-metadata.json`'s `causal_summary` also still said "five modes," stale relative to the registry's actual six entries. A benchmark run against this state would silently under-test the exact routing change phase 018 just made.

### Purpose

Bring the playbook, skill-level advisor descriptor, and graph metadata into sync with the six-mode registry, then re-run both the router-mode (deterministic, fast) and live-mode (dispatches through `cli-opencode`) skill-benchmarks to produce a genuinely whole-hub baseline that actually exercises the new transport packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `MR-007` (`01--mode-routing/mcp-open-design-mode.md`): a new critical-path mode-routing scenario verifying an Open Design wiring request resolves to `design-mcp-open-design`, not a design-judgment mode or the external `mcp-figma` sibling.
- Add a `P6` probe to `AI-001` (`02--advisor-integration/positive-design-controls.md`): extends the existing five-probe positive-control battery with an Open Design wiring prompt, so the advisor-integration critical-path check covers all six modes, not five.
- Fix stale "five modes" references incidentally found while updating the above: `manual_testing_playbook.md` (overview, preconditions, critical-path list, cross-reference index, totals), `README.md` (playbook description line), `AI-003`'s own prompt text and its playbook table row (`02--advisor-integration/doc-write-routes-elsewhere.md`).
- Sync the skill-level advisor descriptor `description.json` (description, keywords, trigger_examples, `modes[]`, `backend_kinds[]`) to include `design-mcp-open-design` / `od-cli-transport`.
- Sync `graph-metadata.json`'s `causal_summary` and `intent_signals` to mention the sixth mode and its transport nature.
- Re-run the router-mode skill-benchmark (fast, deterministic) to confirm the new scenario is picked up and D5 connectivity stays clean.
- Re-run the live-mode skill-benchmark (dispatches through `cli-opencode`) for a fresh whole-hub baseline, saved as `benchmark/after-018-transport-integration/`.

### Out of Scope

- Adding scenarios to every other playbook category (Transform Verb Framing, md-generator Pipeline, Shared Reference Base, Parity Behavior, Fallback and Resilience, Hub Manager Intake) for the transport mode — it is not a design-judgment mode, so most of those categories' concepts (procedure cards, shared reference base consumption, transform-verb framing) don't apply to it. Only Mode Routing and Advisor Integration needed new coverage.
- Adding a `hub-router.json` `bundleRule` for `design-mcp-open-design` + a design mode — this was already explicitly considered and rejected in phase 018's plan.md; nothing in this phase's benchmark results reopened that question.
- Regenerating `system-skill-advisor`'s compiled `skill-graph.json` — still a flagged follow-up from phase 018, unchanged by this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-design/manual_testing_playbook/01--mode-routing/mcp-open-design-mode.md` | Create | New `MR-007` scenario |
| `.opencode/skills/sk-design/manual_testing_playbook/02--advisor-integration/positive-design-controls.md` | Edit | Add `P6` probe to `AI-001` |
| `.opencode/skills/sk-design/manual_testing_playbook/02--advisor-integration/doc-write-routes-elsewhere.md` | Edit | Fix stale "five modes" prompt text |
| `.opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md` | Edit | Overview, preconditions, critical-path list, cross-reference index, totals |
| `.opencode/skills/sk-design/README.md` | Edit | Playbook description line (also fixes a pre-existing separate staleness: "24-scenario" when the playbook already declared 32) |
| `.opencode/skills/sk-design/description.json` | Edit | description, keywords, trigger_examples, modes[], backend_kinds[]; version bump |
| `.opencode/skills/sk-design/graph-metadata.json` | Edit | causal_summary, intent_signals |
| `.opencode/skills/sk-design/benchmark/after-018-transport-integration/{report.json,report.md}` | Create | Fresh live-mode benchmark baseline |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | New `MR-007` scenario correctly exercises the transport mode | Router-mode benchmark scenario count increases from 24 to 25; MR-007 appears in the report |
| REQ-002 | Router-mode benchmark still passes after the playbook changes | Verdict PASS, D5 connectivity 100/100 |
| REQ-003 | Live-mode benchmark produces a fresh baseline reflecting the six-mode hub | `benchmark/after-018-transport-integration/report.json` written with a verdict |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Skill-level advisor descriptor matches the registry | `description.json` `modes[]` and `backend_kinds[]` include the sixth entry |
| REQ-005 | No stale "five modes" text remains in sk-design's own docs | Grep sweep across `SKILL.md`, `README.md`, `manual_testing_playbook/**`, `description.json`, `graph-metadata.json` returns 0 hits outside historical/frozen content |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the router-mode benchmark runs, **Then** scenario count is 25 (up from 24), verdict PASS, D5 100/100.
- **SC-002**: **Given** the live-mode benchmark runs, **Then** a fresh report is written and MR-007/P6 outcomes are inspected and recorded in this phase's implementation-summary.md.
- **SC-003**: **Given** a grep sweep for "five modes"/"five design modes" across sk-design's own live docs, **Then** 0 hits remain outside historical changelog/frozen content.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | New MR-007 scenario gets misclassified by the benchmark loader | Low | Verified via an actual router-mode run showing scenario count 24 -> 25 and MR-007 present in the report, not just static review |
| Risk | Live-mode benchmark result for MR-007 is inconclusive (browser-class, routed out) | Medium | MR-class scenarios are uniformly routed to the browser harness regardless of content (confirmed: MR-001 through MR-006 show the same `_routed-out_` pattern in prior baselines); this is expected, not a defect introduced here |
| Dependency | Phase 018's transport integration already shipped and verified | High | This phase only adds benchmark coverage and syncs descriptors; it does not re-touch the registries themselves |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Future benchmark re-runs against sk-design will now score all six registered modes, not silently drop the newest one.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- A future 7th mode (workflow or transport) added to `mode-registry.json` without a matching playbook scenario would repeat this exact gap — not automated-checked, but the pattern (one `MR-*` scenario per mode, one probe per mode in `AI-001`) is now documented precedent to follow.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 1 new file + edits to 7 existing docs, all mechanical/additive |
| Risk | 5/25 | Pure documentation/benchmark-corpus work; no registry or runtime logic touched |
| Research | 4/20 | Required reading the existing playbook pattern (root index + one MR scenario + AI-001) before authoring the new scenario |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None - see section 7.

---

## RELATED DOCUMENTS

- **Predecessor Phase**: `../018-mcp-open-design-transport-integration/spec.md` (the transport integration this phase benchmarks)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
