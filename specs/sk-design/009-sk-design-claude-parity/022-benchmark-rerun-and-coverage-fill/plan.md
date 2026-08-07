---
title: "Implementation Plan: Phase 022 - Benchmark Rerun & Manual-Testing Coverage Fill"
description: "Plan for rerunning both benchmark trace modes and running a 7-way parallel coverage audit + synthesis + authoring pass over the manual_testing_playbook."
trigger_phrases:
  - "phase 022 plan"
  - "coverage audit workflow plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/022-benchmark-rerun-and-coverage-fill"
    last_updated_at: "2026-07-07T13:05:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "benchmark-coverage-022"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 022 - Benchmark Rerun & Manual-Testing Coverage Fill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | `run-skill-benchmark.cjs` Lane C harness; markdown playbook scenarios; a multi-agent Workflow orchestration for the audit/synthesize/author pipeline |
| **Framework** | Existing `manual_testing_playbook` `{PREFIX}-NNN` scenario contract shape |
| **Storage** | `.opencode/skills/sk-design/manual_testing_playbook/`, `.opencode/skills/sk-design/benchmark/` |
| **Testing** | `run-skill-benchmark.cjs --trace-mode router|live` |

### Overview

Two independent asks: confirm phase 021 didn't regress anything (benchmark rerun), and rigorously check playbook coverage per mode/parent (coverage audit). Ran them concurrently — the live-mode benchmark dispatches real `opencode run` calls and takes minutes, so it ran in the background while a Workflow handled the coverage audit in parallel. Once the audit's synthesis confirmed 4 real gaps and authored them, reran the router-mode benchmark against the updated corpus (confirmed +2 scenarios scored) and reran live-mode once more against the final corpus so the saved baseline reflects both halves of the ask together, not two disjoint snapshots.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Located the Lane C benchmark harness and its exact CLI invocation (from `sk-design/benchmark/README.md`'s own re-running instructions)
- [x] Read the full playbook root index to establish the current per-mode/per-category scenario inventory before auditing

### Definition of Done
- [x] Router-mode benchmark rerun: `PASS`, no regression
- [x] Live-mode benchmark rerun (pre-coverage-fill): `PASS`, matches phase 019's prior baseline shape
- [x] 7-way coverage audit completed (6 modes + parent hub), each independently grounded in real registry/SKILL.md reads
- [x] Synthesis deduplicated and rejected weak/redundant recommendations
- [x] 4 confirmed scenarios authored, each verified against 2+ real sibling files
- [x] Root index synced: category tables, cross-reference index, critical-path list, totals
- [x] Router-mode benchmark rerun against the updated corpus: confirmed scenario count delta
- [x] Live-mode benchmark rerun against the final corpus: fresh, complete baseline
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Coverage audit used a 3-phase Workflow: parallel independent judgment (7 agents, one per mode + one for the parent hub, each reading the target's real registry entry, `SKILL.md`, and existing scenario files before judging adequacy) -> adversarial synthesis (one agent reconciling all 7 raw reports, explicitly instructed to reject weak/redundant recommendations and resolve ID collisions) -> parallel authoring (one agent per confirmed scenario, each required to read real sibling files before writing, never assume the shape).

### Key Components

- **Per-mode/parent audit agents**: each graded on the SAME adequacy bar (routing proof + registry-property exercise + boundary/precondition proof), not raw scenario count — this is why `md-generator` (8 scenario-touches, more than most modes) was still flagged inadequate: its gap was a specific untested precondition (brief-only authoring boundary), not volume.
- **Synthesis agent's dedup catch**: the `design-mcp-open-design` audit and the parent-hub audit both independently proposed a mandatory-pairing-gate scenario; synthesis discovered (by reading the transport packet's own NESTED `manual_testing_playbook/design-gate/mandatory-design-gate.md`) that `GATE-001` already exhaustively covers the packet-internal half of that gap, so it kept only the genuinely uncovered remainder (hub-level pairing visibility) as `HM-004` and dropped the redundant one.
- **Authoring agents' verification discipline**: each explicitly re-confirmed every cited fact (alias strings, procedure-card names, resource paths) against the real source files rather than trusting the synthesis step's summary verbatim — caught in their own result text ("confirmed by grep/read, not assumed").
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `parity-behavior/`, `advisor-integration/`, `md-generator-pipeline/`, `hub-manager-intake/` | 4 category folders | +1 scenario file each | Router-mode benchmark scenario count |
| `manual_testing_playbook.md` | Root index | Tables, cross-reference index, critical-path list, totals, coverage notes | Manual re-read + total-count arithmetic check |
| `sk-design/README.md` | Hub README | Fixed stale scenario count | Grep |
| `sk-design/benchmark/` | Result archive | New baseline folder | Directory listing |

Required inventories:
- Same-class producers: no other in-flight work touches the playbook or benchmark folders concurrently (confirmed via scoped `git status` before starting).
- Consumers of changed symbols: `load-playbook-scenarios.cjs` (parses the playbook into scored scenarios) is the only consumer of the new files' structural shape; confirmed via the router-mode rerun that it parses `AI-004`/`MG-004` without warnings.
- Matrix axes: mode x {registry property, boundary/precondition, existing scenario count} — this is the adequacy grid each audit agent was scored against, not a flat scenario-count comparison.
- Algorithm invariant: every authored scenario traces to one specific, named, real gap (a registry field, a `SKILL.md` section, or a documented boundary) — none is a generic "more coverage" addition.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Benchmark Rerun (pre-coverage-fill)
- [x] Router-mode rerun: `PASS` aggregate 100/100, scenarios=25 (unchanged from phase 019's last count)
- [x] Live-mode rerun (background): `PASS` aggregate 93/100, scenarios=25

### Phase 2: Coverage Audit (Workflow, ran concurrently with Phase 1's live-mode background job)
- [x] 7 parallel audit agents (6 modes + parent hub)
- [x] Synthesis: 4 confirmed, 1 redundant recommendation dropped with a documented reason
- [x] 4 parallel authoring agents

### Phase 3: Root Index Sync
- [x] Category tables (AI, MG, PB, HM) updated with new rows + header ID ranges
- [x] Critical-path list, cross-reference index, totals recomputed
- [x] `README.md`'s stale scenario-count line fixed

### Phase 4: Final Verification
- [x] Router-mode rerun against updated corpus: scenarios 25 -> 27, `PASS` 100/100, confirmed `parseWarnings` unchanged (pre-existing, not new)
- [x] Live-mode rerun against final corpus: fresh complete baseline
- [x] Write this phase's own `implementation-summary.md`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Router-mode benchmark | Full sk-design skill, deterministic replay | `run-skill-benchmark.cjs --trace-mode router` |
| Live-mode benchmark | Full sk-design skill, real dispatch via cli-opencode | `run-skill-benchmark.cjs --trace-mode live` |
| Regression comparison | New run vs. phase 019/021 prior baseline shape | Manual diff of `verdict`/`aggregateScore`/`scenarioRows` counts |
| File-existence + shape spot-check | All 4 new scenario files | Direct `Read` against 2+ of each file, cross-checked against sibling shape |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 021's validator + finding fixes | Prerequisite | Complete, pushed as `e0a35f44b9` | This phase's benchmark rerun exists specifically to confirm it |
| `run-skill-benchmark.cjs` | Verification tool | Available | Would need manual routing verification only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A new scenario's claims turn out to be wrong on a real manual execution (a documented registry property or boundary doesn't actually behave as the scenario asserts).
- **Procedure**: `git restore` the specific scenario file and its root-index rows; the underlying registry/SKILL.md behavior is unaffected since this phase never touched runtime logic.
<!-- /ANCHOR:rollback -->
