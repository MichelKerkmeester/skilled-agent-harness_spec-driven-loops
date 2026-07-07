---
title: "Feature Specification: Lane C Skill-Benchmark Live Playbook Mode (Mode B)"
description: "Redesign Lane C so it benchmarks a skill against its OWN manual_testing_playbook scenarios executed live through cli-opencode, instead of synthetic decontaminated fixtures replayed by a deterministic router. Adds dual-mode (router CI gate + live default), a browser-harness executor, D4 usefulness ablation, and an auto-CREATE generator."
trigger_phrases:
  - "skill-benchmark live playbook mode"
  - "Lane C mode B"
  - "playbook corpus benchmark"
  - "cli-opencode live skill benchmark"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/023-deep-improvement-skill-benchmark-mode/010-skill-benchmark-live-playbook-mode"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped Phase 1 spine + Phase 0 spike + Phase 2 live executor; 232 tests green"
    next_safe_action: "Build Phase 3 browser-executor.cjs (bdg path validated)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs"
      - ".opencode/skills/deep-improvement/scripts/skill-benchmark/live-executor.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-benchmark-live-playbook-mode"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions:
      - "Dual-mode, live is the default (router stays for CI)"
      - "Route browser scenarios to a bdg browser harness now"
      - "Full build in one packet (live + D4 ablation + generator)"
---
# Feature Specification: Lane C Skill-Benchmark Live Playbook Mode (Mode B)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## OVERVIEW

Lane C previously graded skills with synthetic, decontaminated public/private fixtures replayed by a deterministic keyword router — artificial corpus, simulated execution. This packet realizes the deferred "Mode B": the skill's own `manual_testing_playbook` becomes the corpus, scored in two modes over one parser — `router` (deterministic, the CI gate) and `live` (real `cli-opencode` dispatch, the operator default) — plus a `bdg` browser executor for browser-gated scenarios, a D4 usefulness ablation, and an auto-CREATE generator for skills lacking scenarios.

**Key Decisions**: dual-mode (live default, router CI gate); browser harness now; full build in one packet.

**Critical Dependencies**: `cli-opencode` (live dispatch), `bdg` (browser), the existing `gradeD4` grader.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (+ decision-record) |
| **Priority** | P1 |
| **Status** | Complete (all 6 phases; live-validated; 245 tests green; strict-valid) |
| **Created** | 2026-06-01 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Lane C benchmark grades skills with hand-invented, keyword-stripped fixtures and a pure-function router replay — not the skill being used. The skills' own `manual_testing_playbook` folders state the correct contract ("execute against the live skill — no mocks"), so the existing approach is doubly artificial and produced empty-gold placeholder scores.

### Purpose
Benchmark each skill against its real playbook scenarios, executed live, while keeping a deterministic router path for CI.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Playbook parser (default corpus) + dual trace-mode (router CI gate + live default) over one corpus.
- Live cli-opencode executor; browser (bdg) executor for MR/CB; D4 usefulness ablation (approximate); auto-CREATE generator (staged).
- Real-gold scoring + A↔B divergence; report + loop-host flags; tests.

### Out of Scope
- Cross-browser (Safari/Firefox) automation — bdg is Chrome-only; those legs SKIP with escalation.
- Video baseline diff (MR-004) — capture-only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/skill-benchmark/load-playbook-scenarios.cjs` | Create | playbook → normalized gold |
| `scripts/skill-benchmark/executor-dispatch.cjs` | Create | one observed-result for 3 executors |
| `scripts/skill-benchmark/live-executor.cjs` | Create | cli-opencode dispatch + NDJSON parse |
| `scripts/skill-benchmark/browser-executor.cjs` | Create | bdg executor for MR/CB |
| `scripts/skill-benchmark/d4-ablation.cjs` | Create | skill-on/off usefulness delta |
| `scripts/skill-benchmark/playbook-generator.cjs` | Create | auto-author scenarios (staged) |
| `scripts/skill-benchmark/{run-skill-benchmark,score-skill-benchmark,build-report}.cjs` | Modify | dual-path, real-gold, divergence, report |
| `scripts/shared/loop-host.cjs` | Modify | flags + live default (deferred to Phase 2 wiring) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Playbook is the default corpus | parser returns normalized scenarios; sk-code → 24 (17 text + 7 browser) |
| REQ-002 | Router mode scores against real gold, deterministic | D1-intra/D2/D3 from playbook expected-refs; CI suite stays green |
| REQ-003 | Live mode runs scenarios through cli-opencode | activation + stated-routing parsed from real NDJSON schema |
| REQ-004 | No existing behavior broken | full vitest suite green |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Browser scenarios run via bdg | MR/CB → real/partial verdicts, no fake PASS |
| REQ-006 | D4 ablation (approximate) | skill-on vs skill-off graded; attribution stamped approximate |
| REQ-007 | Generator creates staged scenarios | opt-in; writes staging only; 4 validation gates |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: sk-code benchmarked from its playbook in router (deterministic) + live modes; A↔B divergence reported.
- **SC-002**: Full deep-improvement vitest suite green (232+ now).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Shared harness change breaks tests | High | back-compat adapter; dual-path; suite green |
| Risk | Live default before live executor exists | Med | default-flip deferred until live-executor ships |
| Risk | D4 can't isolate one skill | Med | approximate via MK_SKILL_ADVISOR_HOOK_DISABLED; stamped advisory |
| Dependency | cli-opencode auth / model | Med | provider pre-flight; model via env; MiniMax omits --agent |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Live default-flip + stopgap-fixture retirement scheduled for later phases.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Router mode is deterministic + offline (CI). Live mode is advisory; default to the critical-path subset.

### Security
- **NFR-S01**: Generator writes only to a staging dir; live dispatch is read-only-analysis (no edits).

### Reliability
- **NFR-R01**: Live/browser executors degrade gracefully (recorded error/routed-out) when unavailable.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Skill with no playbook: parser returns shape `none`; generator (opt-in) can author scenarios.
- Browser scenarios: routed out of text executors.

### Error Scenarios
- Live dispatch auth/model failure: recorded as a live error; router gate unaffected.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | 6 new modules + 4 modified, multi-phase |
| Risk | 18/25 | shared tooling + live dispatch + target mutation (generator) |
| Research | 16/20 | 3 explore + 3 plan agents + live spike |
| **Total** | **56/70** | **Level 2 (+ decision-record for the architecture choices)** |
<!-- /ANCHOR:complexity -->
