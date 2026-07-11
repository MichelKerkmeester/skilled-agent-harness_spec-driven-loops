---
title: "Feature Specification: Plugin Manual-Testing Playbooks (11 scenarios)"
description: "Author and verify 11 manual-testing-playbook scenarios for the plugin and hook pairs"
trigger_phrases:
  - "plugin manual testing playbooks"
  - "plugins and hooks playbook scenarios"
  - "manual testing playbook plugin coverage"
  - "plugin hook live validation"
  - "playbook scenario authoring"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/009-plugin-manual-testing-playbooks"
    last_updated_at: "2026-07-11T14:07:09Z"
    last_updated_by: "spec-author"
    recent_action: "Authored and reviewer-verified 11 manual-testing-playbook scenarios, all PASS"
    next_safe_action: "None; phase 9 of 9 is complete, no successor phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/"
      - ".opencode/skills/cli-external/manual_testing_playbook/plugins-and-hooks/"
      - ".opencode/skills/system-code-graph/manual_testing_playbook/plugins-and-hooks/"
      - ".opencode/skills/sk-code/manual_testing_playbook/plugins-and-hooks/"
      - ".opencode/skills/mcp-code-mode/manual_testing_playbook/plugins-and-hooks/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-plugin-manual-testing-playbooks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Skipped plugins already covered: mk-skill-advisor, mk-goal, mk-deep-loop-guard"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Plugin Manual-Testing Playbooks

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-11 |
| **Branch** | `009-plugin-manual-testing-playbooks` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-plugin-state-cleanup |
| **Successor** | None |
| **Handoff Criteria** | All 11 scenarios classify PASS with real command evidence, review pass closes real defects, each owning skill's playbook index registers the category |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Author runnable manual-testing-playbook scenarios for the plugin and hook pairs specification.

**Scope Boundary**: Author and validate one manual-testing-playbook scenario per plugin/hook pair shipped by this program, plus the four pre-existing plugins that lacked a scenario, so the new category has full coverage. Does not touch the plugins, hooks, or their shared cores themselves.

**Dependencies**:
- The seven plugin/hook pairs and their shared cores built in phases 001-007 (cli-dispatch-audit, code-graph-freshness, post-edit-quality, completion-sentinel, mcp-route-guard, spec-mutation-gate, speckit-completion) plus the four pre-existing plugins (code-graph, spec-memory, dist-freshness-guard, session-cleanup).
- The `manual_testing_playbook.md` operator directory and its EXECUTION POLICY contract (real commands, no mocked or stubbed results).

**Deliverables**:
- 11 runnable scenario files, one per plugin/hook pair, distributed across the owning skill of each pair's shared core (6 under system-spec-kit, 1 under cli-external, 2 under system-code-graph, 1 under sk-code, 1 under mcp-code-mode) - see the scenario-to-owning-skill mapping table in §3 SCOPE.
- A registered `plugins-and-hooks/` category entry in each of the 5 owning skills' own `manual_testing_playbook.md` so each skill's recursive directory discovery picks up its own scenarios automatically.
- An independent review pass that verified every command and expected-signal claim against the real code and fixed defects inline.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The plugin-and-hook implementation program (phases 001-007) shipped seven policy/logic cores with paired OpenCode plugin and Claude hook adapters, and the repo already carries four older plugins with no dedicated manual-validation scenario. Every pair had unit tests, but no operator-facing playbook proved the live adapters, kill switches, and fail-open paths actually behave against real source and real commands, and the new plugins had no entry point in the manual testing directory at all.

### Purpose
Give operators one runnable, evidence-backed scenario per plugin/hook pair (11 total) under the existing manual_testing_playbook category pattern, so every guard, sentinel, and router the program shipped can be live-validated the same way the rest of Spec Kit Memory already is.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author one scenario file per plugin/hook pair (7 from this program + 4 pre-existing), each placed under the `plugins-and-hooks/` directory of the skill that owns that pair's shared core, grounded in a real source read and an actual executed test run.
- Register the `plugins-and-hooks/` category in each owning skill's own `manual_testing_playbook.md` so that skill's recursive scenario runner discovers its own scenarios.
- An independent review pass verifying every scenario's commands and expected signals against the real plugin/hook/core source, fixing defects inline.

### Out of Scope
- `mk-skill-advisor`, `mk-goal`, and `mk-deep-loop-guard` - already have manual-testing coverage elsewhere; duplicating it here would fork the source of truth.
- Any change to plugin, hook, or shared-core behavior - this phase documents and validates, it does not modify runtime logic.
- CI wiring to auto-run these scenarios on a schedule - execution stays operator-invoked per the playbook's manual EXECUTION POLICY.

### Files to Change

Scenarios are distributed across the owning skill of each plugin/hook pair's shared core, not concentrated under system-spec-kit:

| File Path | Owning Skill | Change Type | Description |
|-----------|--------------|-------------|--------------|
| `.opencode/skills/cli-external/manual_testing_playbook/plugins-and-hooks/cli-dispatch-audit-trail.md` | cli-external | Create | Scenario for `mk-cli-dispatch-audit` |
| `.opencode/skills/system-code-graph/manual_testing_playbook/plugins-and-hooks/code-graph-freshness-guard.md` | system-code-graph | Create | Scenario for `mk-code-graph-freshness` |
| `.opencode/skills/sk-code/manual_testing_playbook/plugins-and-hooks/post-edit-quality-router.md` | sk-code | Create | Scenario for `mk-post-edit-quality` |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/completion-evidence-sentinel.md` | system-spec-kit | Create | Scenario for `mk-completion-sentinel` |
| `.opencode/skills/mcp-code-mode/manual_testing_playbook/plugins-and-hooks/mcp-route-guard.md` | mcp-code-mode | Create | Scenario for `mk-mcp-route-guard` |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/spec-mutation-gate-enforce.md` | system-spec-kit | Create | Scenario for `mk-spec-gate` |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/speckit-completion-exposer.md` | system-spec-kit | Create | Scenario for `mk-speckit-completion` |
| `.opencode/skills/system-code-graph/manual_testing_playbook/plugins-and-hooks/code-graph-plugin.md` | system-code-graph | Create | Backfill scenario for `mk-code-graph` |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/spec-memory-plugin.md` | system-spec-kit | Create | Backfill scenario for `mk-spec-memory` |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/dist-freshness-guard.md` | system-spec-kit | Create | Backfill scenario for `mk-dist-freshness-guard` |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/session-cleanup-plugin.md` | system-spec-kit | Create | Backfill scenario for `session-cleanup` |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | system-spec-kit | Modify | Register the `plugins-and-hooks/` category (6 scenarios) |
| `.opencode/skills/cli-external/manual_testing_playbook/manual_testing_playbook.md` | cli-external | Modify | Register the `plugins-and-hooks/` category (1 scenario) |
| `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md` | system-code-graph | Modify | Register the `plugins-and-hooks/` category (2 scenarios) |
| `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md` | sk-code | Modify | Register the `plugins-and-hooks/` category (1 scenario) |
| `.opencode/skills/mcp-code-mode/manual_testing_playbook/manual_testing_playbook.md` | mcp-code-mode | Modify | Register the `plugins-and-hooks/` category (1 scenario) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-001 | Each of the 11 plugin/hook pairs has one runnable scenario file following the sk-doc manual_testing_playbook template contract | 11 files exist under `plugins-and-hooks/`, each with a scenario contract, real test commands, and a PASS/FAIL/SKIP/UNAUTOMATABLE verdict |
| REQ-002 | Every scenario is grounded in a real source read and an actually executed test run, not a mocked or stubbed result | Each scenario cites the real command run and its literal output (test counts, exit behavior); no fabricated JSON or invented numbers |
| REQ-003 | A second reviewer independently verifies every command and expected-signal claim against the real code | Review pass produces a defect list; every reported defect is fixed in the scenario file, not waved through |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-004 | Each owning skill's `manual_testing_playbook.md` registers the `plugins-and-hooks/` category for the scenarios it owns | Each of the 5 owning-skill playbooks (system-spec-kit, cli-external, system-code-graph, sk-code, mcp-code-mode) lists the category path and a one-line description; each skill's recursive scenario runner discovers its own scenarios without further index changes |
| REQ-005 | The 3 plugins with pre-existing coverage are explicitly named as out of scope, not silently omitted | spec.md scope section names `mk-skill-advisor`, `mk-goal`, `mk-deep-loop-guard` and states why each is excluded |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 11 scenarios classify PASS, each backed by a real command transcript rather than a mocked or stubbed one.
- **SC-002**: The independent review pass closes every real defect it finds before the phase is marked complete; the count and location of fixes is documented, not glossed over.
- **SC-003**: An operator can open any of the 5 owning skills' `manual_testing_playbook.md`, follow its `plugins-and-hooks/` link, and run that skill's scenarios end to end with no missing preconditions.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Backfill scenarios for the 4 pre-existing plugins carry less granular evidence than the 7 freshly authored ones | Low | Each backfill scenario is labeled honestly as backfill in this spec and its Known Limitations; the verdict is still a real PASS, not fabricated |
| Risk | A scenario's cited command drifts from the real plugin/hook source after a future refactor | Med | The independent review pass exists precisely to catch drift before merge; future phases re-run scenarios rather than trusting stale prose |
| Dependency | Phases 001-007 shipping the seven plugin/hook pairs and their shared cores | Green | All seven pairs are already implemented and unit-tested; this phase only documents and live-validates them |
| Dependency | `manual_testing_playbook.md`'s existing category-directory pattern and EXECUTION POLICY | Green | Proven pattern already used by every other category in the playbook |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance impact - this phase adds documentation and scenario evidence only; no plugin, hook, or core code changes.

### Security
- **NFR-S01**: No `mcp_server/` dist or plugin source is rebuilt or modified by this phase.
- **NFR-S02**: Comment hygiene - scenario prose carries durable technical detail (plugin names, file paths, command shapes), no ephemeral packet/phase ids embedded in the scenario files themselves.

### Reliability
- **NFR-R01**: EXECUTION POLICY compliance - every scenario's evidence comes from a command actually run against real files and real handlers, matching the playbook's real-execution mandate.
- **NFR-R02**: Honest verdict vocabulary - each scenario uses PASS, FAIL, SKIP, or UNAUTOMATABLE per the playbook's classification contract; no invented in-between states.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- The 4 backfill scenarios (code-graph, spec-memory, dist-freshness-guard, session-cleanup) reuse an existing PASS verdict from prior coverage rather than a fresh live run captured inside this phase; this is documented, not hidden.
- The `spec-mutation-gate-enforce` scenario spans the widest signal surface (enforce-OFF/ON, child-folder scope, exempt paths, kill switch) and needed live telemetry to measure its false-positive rate rather than a single assertion.

### Error Scenarios
- External service failure: not applicable - every scenario runs local commands against local files.
- Concurrent access: not applicable - scenarios are read-only validation runs against existing plugin/hook state.

### State Transitions
- Category discovery: the playbook runner uses a recursive `readdir`, so adding the 11th file to an already-registered category needed no further index change beyond the one category entry.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | 11 scenario files plus one index registration; each file follows an established template, no new pattern invented |
| Risk | 3/25 | Documentation and live-validation only; no plugin/hook/core behavior changes, so blast radius is limited to accuracy of the written scenarios |
| Research | 8/20 | Required reading the real source of 11 plugin/hook pairs plus running each pair's actual test suite for evidence |
| **Total** | **20/70** | **Level 2** (chosen for the evidence-and-review discipline across 11 scenarios, not for LOC) |
<!-- /ANCHOR:complexity -->

---

## 7. OPEN QUESTIONS

None outstanding - all 11 scenarios shipped PASS and the review pass closed every defect it found.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
