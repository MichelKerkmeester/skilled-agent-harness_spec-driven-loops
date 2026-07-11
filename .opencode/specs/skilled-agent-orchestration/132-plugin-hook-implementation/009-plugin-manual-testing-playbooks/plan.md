---
title: "Implementation Plan: Plugin Manual-Testing Playbooks (11 scenarios)"
description: "Two-agent author-then-review pipeline grounding each scenario in real source and a real test run"
trigger_phrases:
  - "manual testing playbook authoring plan"
  - "plugin scenario review pipeline"
  - "playbook two-agent verification"
  - "plugins-and-hooks category plan"
  - "scenario evidence approach"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/009-plugin-manual-testing-playbooks"
    last_updated_at: "2026-07-11T13:12:24Z"
    last_updated_by: "spec-author"
    recent_action: "Authored and reviewer-verified 11 manual-testing-playbook scenarios, all PASS"
    next_safe_action: "None; phase 9 of 9 is complete, no successor phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-plugin-manual-testing-playbooks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Skipped plugins already covered: mk-skill-advisor, mk-goal, mk-deep-loop-guard"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Plugin Manual-Testing Playbooks

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown scenario files following the sk-doc manual_testing_playbook template |
| **Framework** | Spec Kit Memory manual_testing_playbook operator directory |
| **Storage** | None - documentation only, no runtime state introduced |
| **Testing** | Vitest / node:test suites already shipped by phases 001-007, run live for evidence |

### Overview
Author one runnable scenario per plugin/hook pair (11 total: 7 from this program plus 4 pre-existing) under `plugins-and-hooks/`. A first agent reads each pair's real source and runs its actual test suite to ground the scenario in evidence. A second agent independently re-verifies every command and expected signal against the code, fixing real defects inline rather than rubber-stamping the first pass.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (11 pairs, 3 explicit exclusions)
- [x] Success criteria measurable (SC-001..SC-003)
- [x] Dependencies identified (phases 001-007 shipped, playbook category pattern proven)

### Definition of Done
- [x] All acceptance criteria met (REQ-001..REQ-005)
- [x] Tests passing (each scenario's cited unit/vitest suite run live)
- [x] Docs updated (spec/plan/tasks/checklist synchronized)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-agent author-then-review pipeline, mirroring the same evidence discipline the plugin/hook cores themselves already use (shared core + independent verification), applied here to documentation instead of runtime code.

### Key Components
- **Author agent (Sonnet-5, xhigh)**: reads each plugin/hook pair's real shared core plus both adapters, runs the pair's actual test suite, and writes one scenario file per pair following the sk-doc manual_testing_playbook template.
- **Reviewer agent (Sonnet-5, xhigh)**: independently re-reads the same source for every scenario and checks each cited command and expected signal against it, fixing defects inline instead of only flagging them.
- **manual_testing_playbook.md (index)**: registers the new `plugins-and-hooks/` category so the recursive scenario runner discovers all 11 files without a per-file index entry.

### Data Flow
Real plugin/hook source -> author agent reads it and runs the real test command -> scenario file captures the command, its literal output, and a PASS/FAIL/SKIP/UNAUTOMATABLE verdict -> reviewer agent re-verifies against the same source and fixes any drift -> the category entry in the root playbook makes all 11 files discoverable.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable in the fix_bug sense - this phase authors and live-validates documentation for plugin/hook pairs that already shipped; it changes no runtime code, security boundary, path handling, env precedence, schema, persistence, or shared policy. The table below instead tracks the two producer/consumer surfaces this phase does touch.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|----------------|
| `plugins-and-hooks/` scenario directory | New category holding one scenario per plugin/hook pair | Create: 11 new scenario files | `ls .opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/` lists 11 `.md` files |
| `manual_testing_playbook.md` root index | Directory of all manual-testing categories | Update: register the `plugins-and-hooks/` category path + description | `grep -n 'plugins-and-hooks' manual_testing_playbook.md` resolves |

Required inventories:
- Same-class producers: the 22 other category directories already listed in `manual_testing_playbook.md` follow the identical folder-plus-index-line pattern; no new mechanism was introduced.
- Consumers of changed symbols: the scenario runner's recursive `readdir` is the only consumer of the new category path; it needed no code change, only the index registration.
- Matrix axes: 11 plugin/hook pairs x {fresh-authored (7) | backfill (4)} x {review pass: defect found | clean}.
- Algorithm invariant: every scenario's verdict traces to a command that was actually run against real files/handlers in this phase or a documented prior run; no verdict is asserted from unexecuted reasoning.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed the scenario contract and EXECUTION POLICY requirements from `manual_testing_playbook.md`
- [x] Enumerated all 11 plugin/hook pairs and confirmed the 3 already-covered exclusions
- [x] Created the `plugins-and-hooks/` scenario directory

### Phase 2: Core Implementation
- [x] Authored the 7 scenarios for this program's plugin/hook pairs, each against real source with a real test run
- [x] Backfilled 4 scenarios for the pre-existing plugins that had no dedicated scenario yet
- [x] Registered the `plugins-and-hooks/` category in `manual_testing_playbook.md`

### Phase 3: Verification
- [x] Independent review pass verified every command and expected signal against the real code, fixing 6 defects across 5 scenarios
- [x] All 11 scenarios confirmed PASS with real evidence, no mocked or stubbed results
- [x] Documentation synchronized (spec/plan/tasks/checklist) and `validate.sh --strict` run on this phase
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (cited per scenario) | Each plugin/hook pair's shared-core suite | Vitest (`mcp_server/tests`, `cli-external` scripts) |
| Integration (cited per scenario) | Live in-process/stdin invocation of each OpenCode plugin and Claude hook adapter | Manual command execution, real scratch directories |
| Manual | The scenario file itself is the manual test artifact; the review pass is the QA gate on it | Independent agent re-verification against real source |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phases 001-007 (7 plugin/hook pairs + shared cores) | Internal | Green | Already shipped and unit-tested before this phase started |
| 4 pre-existing plugins (code-graph, spec-memory, dist-freshness-guard, session-cleanup) | Internal | Green | Already shipped; only lacked a dedicated scenario file |
| `manual_testing_playbook.md` category-directory pattern | Internal | Green | Proven pattern reused unchanged from the existing categories |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A scenario's cited evidence turns out fabricated, stale, or a cited command no longer reproduces the claimed signal.
- **Procedure**: Edit or remove the affected scenario file directly; there is no runtime state to unwind since this phase changes documentation only. Re-run the review pass on the corrected file before re-claiming PASS.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──────────────────────┐
                            ├──► Core: author 7 + backfill 4 + register category ──► Verify
Contract confirmed ─────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core: author + backfill | Setup | Core: register category, Verify |
| Core: register category | Core: author + backfill | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | ~0.5 hour |
| Core Implementation | Med | ~4-6 hours (11 scenarios, each grounded in a real test run) |
| Verification | Med | ~2-3 hours (independent review pass, 6 fixes across 5 files) |
| **Total** | | **~7-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration required (documentation-only phase)
- [x] No kill-switch needed (no runtime behavior changed)
- [x] All 11 scenario files confirmed present under `plugins-and-hooks/` before claiming complete

### Rollback Procedure
1. Identify the affected scenario file(s) by name.
2. Edit or revert the specific file; no other file needs to change since scenarios are independent per plugin/hook pair.
3. Re-run the cited command(s) in the corrected scenario to confirm the evidence is real again.
4. No stakeholder notification needed - the change is documentation-only and operator-facing.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A - scenario files are plain markdown with no persisted runtime state.

### Design Choices Resolved
- **Two-agent author-then-review pipeline** (not single-pass authoring): a second independent pass is what actually caught the 6 real defects across 5 scenarios; a single-pass authoring approach would have shipped those defects unnoticed.
- **Backfill the 4 pre-existing plugins into this phase** (not leave them uncovered): gives the new `plugins-and-hooks/` category full 11-of-11 coverage from day one instead of a partial category that looks incomplete to an operator browsing the index.
- **Exclude mk-skill-advisor, mk-goal, mk-deep-loop-guard**: each already has manual-testing coverage elsewhere in the playbook; adding a second scenario here would create two sources of truth for the same plugin.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
