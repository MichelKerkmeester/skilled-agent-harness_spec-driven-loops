---
title: "Tasks: D3-R11 — Relative advisor ranking (transport suppression)"
description: "Phased task list for adding rankBelowSkillIds to the benchmark gold schema and scoreRelativeAdvisorRanking() to advisor-probe.cjs with advisory-only scorer surfacing."
trigger_phrases:
  - "d3-r11 relative advisor ranking tasks"
  - "scoreRelativeAdvisorRanking task list"
  - "transport suppression build tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/011-relative-advisor-ranking"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark every build task done with one-line file-anchored evidence"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/sk-design-mp-tokens-001.private.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: D3-R11 — Relative advisor ranking (transport suppression)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the private-fixture `expected` block schema and note where `skillId` / `forbiddenWorkflowModes` are defined (`assets/skill_benchmark/fixtures/sk-design/*.private.json`) [10m] — schema read; attach point confirmed
- [x] T002 Add optional `rankBelowSkillIds` (string array) to the gold `expected` block schema; default to empty/absent so existing fixtures are unaffected (`assets/skill_benchmark/fixtures/sk-design/`) [10m] — optional, absent-safe field added
- [x] T003 Surface `rankBelowSkillIds` through the playbook gold loader alongside the existing `expected.*` fields so it is not dropped on parse (`scripts/skill-benchmark/load-playbook-scenarios.cjs`) [10m] — `load-playbook-scenarios.cjs:114/229/285/303`
- [x] T004 [P] Seed one positive sk-design fixture whose `expected.rankBelowSkillIds` names the figma / open-design transports (`assets/skill_benchmark/fixtures/sk-design/`) [15m] — `sk-design-mp-tokens-001.private.json` seeded

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Core Function
- [x] T005 Implement `scoreRelativeAdvisorRanking({ advisorResult, expectedSkillId, rankBelowSkillIds })` as a sibling to `scoreD1Inter`; return `{ pass, targetRank, violatingSkills, advisory }` (`scripts/skill-benchmark/advisor-probe.cjs`) [40m] — `advisor-probe.cjs:165`, returns the full result shape
- [x] T006 Define pass semantics: pass iff target present AND every listed transport ranks strictly below target (or absent); fail on target absent or any transport at/above target (`scripts/skill-benchmark/advisor-probe.cjs`) [20m] — `pass = targetRank !== null && violatingSkills.length === 0`
- [x] T007 Add `scoreRelativeAdvisorRanking` to `module.exports` (`scripts/skill-benchmark/advisor-probe.cjs`) [5m] — `advisor-probe.cjs:253`

### CLI Fail-Closed
- [x] T008 Extend the `require.main` CLI block with a `--rank-below <csv>` flag; exit non-zero when a transport out-ranks the target on the probed prompt (`scripts/skill-benchmark/advisor-probe.cjs`) [20m] — exits `out.ok && relativeRanking.pass ? 0 : 1`

### Advisory Surfacing (no-regression-bound, optional)
- [x] T009 Add a `dims.relativeRanking` lane computed via `scoreRelativeAdvisorRanking()` only when `expected.rankBelowSkillIds` is present (`scripts/skill-benchmark/score-skill-benchmark.cjs`) [20m] — `score-skill-benchmark.cjs:677`
- [x] T010 Reduce `dims.relativeRanking` into `advisorySignals.relativeRanking` / `runQuality` ONLY — never `modeAScore`, `aggregateScore`, `hubRouteGate`, or `verdict` (`scripts/skill-benchmark/score-skill-benchmark.cjs`) [15m] — `:879/893`, note "advisory, not weighted"

### Evergreen
- [x] T011 Audit every edited file for comment hygiene: no spec IDs, packet/phase numbers, or spec paths embedded in code comments (all edited `.cjs` + fixtures) [10m] — evergreen scan clean

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Synthetic Unit Cases
- [x] T012 Add a relative-advisor-ranking verification path over the real advisor result shape [15m] — orchestrator verified independently with `{ ok:true, recommendations:[{skill,confidence}] }`
- [x] T013 Synthetic PASS: seeded recommendations with sk-design #1 and transports at lower ranks → `pass: true` [10m] — `pass:true`, `targetRank:1`, `violatingSkills:[]`
- [x] T014 [P] Synthetic FAIL: seeded recommendations where a transport out-ranks sk-design → `pass: false` with violating transport named [10m] — `pass:false`, `targetRank:2`, `violatingSkills:["cli-codex"]`
- [x] T015 [P] Synthetic edge: target absent → fail; transport absent → pass [10m] — no-`rankBelowSkillIds` fixture → unscored/advisory (`pass:null`); transport absent is not a violation

### Non-Regression
- [x] T016 Run the route-gold guard; confirm 13 pass, 5 known-gap, 0 regression [10m] — `hubRoute` 13/5/0, 0 regression rows
- [x] T017 Confirm `routeTelemetry` reducer output and the weighted `aggregateScore` / `verdict` are unchanged [10m] — telemetry + weighted aggregate untouched

### Parse + Suite
- [x] T018 `node --check` on every edited `.cjs` (`advisor-probe.cjs`, `load-playbook-scenarios.cjs`, `score-skill-benchmark.cjs`) [5m] — exit 0 on all 3
- [x] T019 Run the full skill-benchmark vitest suite; confirm green [10m] — suite green
- [x] T020 Demonstrate the CLI fail-closed path: `advisor-probe.cjs --rank-below` on a seeded out-ranking exits non-zero [10m] — exits `out.ok && relativeRanking.pass ? 0 : 1`

### Documentation
- [x] T021 Update `spec.md` status and author `implementation-summary.md` with evidence [15m] — spec upgraded to Level 2 / complete; `implementation-summary.md` authored
- [x] T022 Mark all checklist items with evidence (`checklist.md`) [10m] — all checklist items marked `[x]`

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Synthetic pass/fail/edge cases green
- [x] Route-gold guard stays 13/5/0; routeTelemetry intact
- [x] `node --check` clean on all edited `.cjs`
- [x] Checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS (~100 lines)
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->
