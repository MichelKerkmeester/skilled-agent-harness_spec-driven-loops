---
title: "Phase 012 - Rigorous Routing Benchmark and Skill-Advisor Verification"
description: "Level 3 phase packet reconciled to the existing sk-design Mode A routing benchmark PASS at benchmark/after-012-routing-rigor, with explicit floor-by-floor evidence and caveats for live-only metrics not measured by that report."
trigger_phrases:
  - "routing benchmark rigor"
  - "sk-design routing accuracy"
  - "skill-advisor confidence floor"
  - "gap-to-second"
  - "near-perfect routing"
  - "procedure-card selection accuracy"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Reconciled Phase 012 docs to the existing Mode A routing benchmark PASS evidence."
    next_safe_action: "No further Phase 012 action required; known limitations documented."
    completion_pct: 100
---
# Feature Specification: Phase 012 - Rigorous Routing Benchmark and Skill-Advisor Verification

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 012 is reconciled to the existing `sk-design` Mode A router benchmark evidence at `.opencode/skills/sk-design/benchmark/after-012-routing-rigor/report.{json,md}`. That run is complete and passed: `report.json` records `verdict: "PASS"`, `aggregateScore: 100`, `traceMode: "router"`, `scoringMethod: "mode-a-router-replay"`, and `gate.d5Score: 100`; `report.md` renders `Verdict: PASS · aggregate 100/100`, 18 scored text-executor scenarios, 6 browser scenarios routed out, and 24 total scenarios. This reconciliation updates the Phase 012 tracking docs to that real evidence and preserves the exact caveat that D1-inter, advisor confidence, gap-to-second, D4, and live-only procedure-card selection were not measured by the authoritative Mode A report.

**Key Decisions**: Accept the existing parent-verified Mode A benchmark as Phase 012's authoritative closeout evidence; record every ADR-001 floor against the actual report instead of inventing live-only scores; treat D1-inter, advisor confidence, gap-to-second, and live-only procedure-card selection as unscored by this run rather than failed; keep the orphaned duplicate `benchmark/after-d3-proxy/` artifact as a known naming inconsistency without deleting either artifact.

**Critical Dependencies**: Existing benchmark report `.opencode/skills/sk-design/benchmark/after-012-routing-rigor/report.{json,md}`, duplicate artifact `.opencode/skills/sk-design/benchmark/after-d3-proxy/skill-benchmark-report.{json,md}`, and strict spec validation for this phase folder after metadata regeneration.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-06 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Estimated LOC** | Documentation-only reconciliation of the Phase 012 tracking packet; no benchmark harness or sk-design skill files edited |
<!-- /ANCHOR:metadata -->

---

## Phase Navigation

| Link | Target |
|------|--------|
| **Parent Spec** | ../spec.md |
| **Predecessor Phase** | ../011-manual-testing-playbook-alignment/spec.md |
| **Successor Phase** | ../013-design-commands-asset-refactor/spec.md |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Phase 012 packet still described future work as "Planned / Not Started" even though a real benchmark run already exists and passed at `.opencode/skills/sk-design/benchmark/after-012-routing-rigor/report.{json,md}`. The stale docs created a tracking mismatch: the parent packet's final verification could cite a passing Phase 012 benchmark, while Phase 012's own `spec.md`, `tasks.md`, and `checklist.md` still showed 0 verified items and no implementation summary. The actual report also has narrower evidence than the original planning packet: it proves the Mode A router gate, D1-intra, D2, and D5, but it explicitly leaves D1-inter, advisor confidence/gap-to-second, D4, and live-only evidence unscored.

### Purpose

Reconcile the Phase 012 tracking documents to the real benchmark state without re-running the benchmark or editing any file outside this phase folder. The closeout records the actual Mode A PASS, checks every ADR-001 floor against the report, marks unmeasured live-only metrics as unscored rather than fabricated, and adds `implementation-summary.md` so the phase's own status matches the parent packet's final verification evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Update only this phase's tracking docs to reflect the existing Mode A benchmark PASS.
- Cite `.opencode/skills/sk-design/benchmark/after-012-routing-rigor/report.json` and `report.md` as the authoritative evidence.
- Check each ADR-001 numeric floor against the actual report values and record PASS / UNSCORED / NOT APPLICABLE honestly.
- Record that `after-d3-proxy/skill-benchmark-report.{json,md}` is an orphaned duplicate of the Phase 012 report naming pattern and leave it untouched.
- Regenerate `description.json` and `graph-metadata.json` after all content edits.
- Run strict validation for this phase folder and record the exit code in `implementation-summary.md`.

### Out of Scope

- Re-running the benchmark harness; the existing `after-012-routing-rigor` report is authoritative for this reconciliation.
- Editing `.opencode/skills/sk-design/**` mode packets, benchmark artifacts, `mode-registry.json`, `hub-router.json`, or procedure cards themselves.
- Editing `.opencode/commands/design/**` command files.
- Editing `skill_advisor.py` or any `system-skill-advisor` scoring/ranking source code.
- Editing the parent `009-sk-design-claude-parity/spec.md` root, sibling phase folders, `external/**`, `research/**`, `.opencode/skills/sk-design/**`, or `.opencode/commands/design/**`.
- Deleting or renaming the duplicate `after-d3-proxy` artifact.
- Inventing scores for live-only metrics that the Mode A report explicitly marks unscored.
- Dispatching Task/subagents for this leaf packet.

### Files to Change

> This reconciliation is documentation-only. The benchmark already exists and is not re-run or edited.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/spec.md` | Update | Mark phase complete and record actual Mode A report evidence |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/plan.md` | Update | Reconcile planned quality gates to the existing report-backed closeout |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/tasks.md` | Update | Close task list with evidence and caveats for superseded/unscored work |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/checklist.md` | Update | Mark checklist verified with evidence, including unscored floor caveats |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md` | Update | Accept ADRs for the actual reconciliation and add floor-by-floor report comparison |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/implementation-summary.md` | Create | Final closeout evidence, known limitations, validation exit code |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/description.json` | Regenerate | Memory discovery metadata |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/graph-metadata.json` | Regenerate | Graph traversal metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Existing benchmark evidence is identified | `.opencode/skills/sk-design/benchmark/after-012-routing-rigor/report.json` and `report.md` are cited as the authoritative Phase 012 evidence; `report.json` records `verdict: "PASS"`, `aggregateScore: 100`, `traceMode: "router"`, and `scoringMethod: "mode-a-router-replay"` |
| REQ-002 | Benchmark is not re-run or edited | No `.opencode/skills/sk-design/**` file is changed by this reconciliation; the existing report remains the source of truth |
| REQ-003 | Mode A pass is recorded exactly | `report.md` records `Verdict: PASS · aggregate 100/100`, 18 scored text-executor scenarios, 6 browser scenarios routed out, and 24 total scenarios |
| REQ-004 | ADR-001 floors are checked against real report data | `decision-record.md` and `checklist.md` record PASS for D1-intra, D2, D5, aggregate verdict, and no benchmark divergences, and record UNSCORED / NOT APPLICABLE for D1-inter, advisor confidence, gap-to-second, and live-only procedure-card selection |
| REQ-005 | Unscored dimensions stay visible | `report.json` / `report.md` evidence that D1-inter and D4 are `unscored-mode-a` is preserved in the docs; no score is invented |
| REQ-006 | Duplicate artifact is documented, not deleted | `implementation-summary.md` notes that `.opencode/skills/sk-design/benchmark/after-d3-proxy/skill-benchmark-report.{json,md}` is an orphaned duplicate naming artifact matching the Phase 012 report content pattern |
| REQ-007 | Phase docs are synchronized to complete | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` all state the same final evidence state and no longer claim "Planned / Not Started" |
| REQ-008 | Metadata is regenerated last | `description.json` and `graph-metadata.json` are regenerated after all content edits, before strict validation |
| REQ-009 | Strict validation is run | `implementation-summary.md` records the strict validation command and exit code for this phase folder |
| REQ-010 | Write boundary is preserved | Only files under this phase folder are modified; no sibling phase, parent packet, benchmark artifact, command, or sk-design skill file is edited |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Contamination findings remain caveated | `report.md` lines 67-80 list contamination findings as router-mode drift, not scenario failures; docs preserve that distinction |
| REQ-012 | Browser scenarios remain routed out | `report.md` lines 42-47 show MR-001 through MR-006 routed out to the browser harness; docs do not count them as scored failures |
| REQ-013 | Weighted aggregate is distinguished from advisory signals | `report.md` lines 25-29 and `report.json` `advisorySignals` keep advisory signals outside the weighted aggregate |
| REQ-014 | Evidence gaps stay visible | Unscored dimensions remain explicitly marked unscored rather than defaulted to a pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 012 docs cite the existing `after-012-routing-rigor` report as authoritative evidence and no longer claim implementation has not started.
- **SC-002**: The docs record the actual Mode A result: PASS, aggregate 100/100, D1-intra 100/100, D2 100/100, D5 100/100, and `gateFailed: false`.
- **SC-003**: Every ADR-001 floor is checked against the actual report and labeled PASS, UNSCORED, or NOT APPLICABLE with a citation.
- **SC-004**: Live-only gaps remain visible: D1-inter, advisor confidence, gap-to-second, D4, and procedure-card selection are not assigned fabricated scores.
- **SC-005**: `implementation-summary.md` exists and records the duplicate `after-d3-proxy` artifact as a known naming inconsistency.
- **SC-006**: `description.json` and `graph-metadata.json` are regenerated after content edits.
- **SC-007**: Strict validation runs for the phase folder and the exit code is recorded.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 006-011 landing | The corpus cannot be updated for changes that do not yet exist, and no new baseline can be honestly frozen | Block corpus/baseline-freeze execution until each of Phases 006-011 is independently validated and confirmed complete |
| Dependency | Phase 005 benchmark conventions | Baseline immutability and append-only sibling-folder discipline depend on Phase 005's existing rules | Reuse Phase 005's `benchmark/README.md` conventions rather than inventing new ones |
| Dependency | `deep-loop-workflows` Lane-C harness | Advisor confidence and gap-to-second cannot be measured without extending `advisor-probe.cjs`/`score-skill-benchmark.cjs` | Scope the harness edit narrowly (additive fields only) and keep `skill_advisor.py` untouched |
| Risk | Release owner unavailable | Baseline promotion and remediation-loop decisions have no authority to close on | Name the release owner explicitly in `decision-record.md`, matching Phase 005's precedent |
| Risk | Larger corpus dilutes signal | A bigger battery could bury real routing gaps in noise if floors are too loose | Set floors below 100 only where the harder/larger corpus genuinely requires tolerance, and keep D5 connectivity at an exact 100 hard gate |
| Risk | Router/live divergence hidden by averaging | A scenario could pass in router mode and fail in live mode (or vice versa) without being flagged | Require per-scenario router/live comparison and treat any unexplained divergence as a routing risk, not a rounding error |
| Risk | Harness edit expands scope beyond routing tests | Touching `score-skill-benchmark.cjs` risks drifting into unrelated harness rework | Scope the edit to the two named files and the specific `dims.d1inter` fields only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Evidence Quality

- **NFR-E01**: Every near-perfect routing claim must cite a specific benchmark dimension score, advisor confidence value, or gap-to-second value, not a qualitative impression.
- **NFR-E02**: Deltas must compare the new `baseline-post-011` run to the prior `after-009` run by name, not to an unnamed "previous" state.

### Reliability

- **NFR-R01**: Any scenario or dimension below its defined floor blocks the release-gate verdict unless the release owner records an explicit accepted-risk decision.

### Maintainability

- **NFR-M01**: Benchmark outputs stay append-only; new runs are written to new sibling folders (`after-011/`, `after-011-live/`, `baseline-post-011/`) rather than overwriting `baseline/` or `after-009/`.

### Compatibility

- **NFR-C01**: The advisor-probe/scoring extension adds fields to the existing `dims.d1inter` object; it must not remove or rename `score`, `rank`, or `topSkill`, which existing reports and consumers already read.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Corpus Boundaries

- Phases 006-011 introduce a mode or procedure-card change with no obvious scenario mapping: the plan requires the ambiguity to be resolved with the release owner before the corpus is called "updated for 006-011."
- A procedure card is removed or merged during Phases 006-011: its scenario is retired with a documented reason, not silently deleted.

### Advisor Boundaries

- A prompt has no plausible second-candidate skill: gap-to-second is reported as N/A for that scenario rather than forced to a default value.
- The advisor probe fails to run (non-zero exit, unparseable output): the scenario's advisor fields are marked unscored, matching the existing `D1-inter (advisor)... unscored-mode-a` convention, never defaulted to a pass.

### Baseline Boundaries

- Phases 006-011 are only partially landed when this phase's implementation begins: the plan blocks baseline-freeze until all six phases are confirmed complete, and blocks on a partial subset rather than freezing early.
- A rerun after remediation still misses a floor: the plan requires a new `after-012-remediation-N/` sibling folder rather than overwriting the prior rerun.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | Five modes, all procedure cards, three new benchmark dimensions, two trace modes, a new frozen baseline |
| Risk | 22/25 | Release-gate false-confidence risk, shared-harness code touch, baseline-overwrite risk, dependency on six unlanded phases |
| Research | 18/20 | Requires precise understanding of existing harness scoring code, advisor CLI ranked output, and Phase 005 conventions |
| Multi-Agent | 4/15 | This packet creation is LEAF-only with no subagent dispatch |
| Coordination | 13/15 | Depends on Phases 006-011 landing and on release-owner authority for baseline promotion and remediation |
| **Total** | **78/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Corpus update misses a Phases 006-011 change surface | High | Medium | Require a per-phase file-list audit against each landed phase's `implementation-summary.md` before claiming the corpus is updated |
| R-002 | New baseline is frozen before Phases 006-011 are actually complete | High | Medium | Gate `baseline-post-011/` creation on explicit release-owner confirmation, not on this phase's own assumption |
| R-003 | Advisor confidence/gap-to-second thresholds are set arbitrarily | Medium | Medium | Ground every floor in `baseline`/`after-009` evidence and the existing repo-wide 0.8 advisor confidence convention |
| R-004 | Harness edit for confidence/gap-to-second breaks existing D1-inter consumers | High | Low | Add fields additively to `dims.d1inter`; do not remove or rename `score`, `rank`, `topSkill` |
| R-005 | Router and live trace modes diverge without anyone noticing | Medium | Medium | Require a per-scenario router-vs-live comparison table in the release report, not an aggregate-only comparison |
| R-006 | Procedure-card selection scenarios do not keep pace with card count changes from Phases 006-011 | Medium | Medium | Derive the card-selection scenario list from the live `procedures/` folder inventory at execution time, not from this planning packet's static count |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Release owner gets a numeric near-perfect routing gate (Priority: P0)

**As a** release owner, **I want** explicit numeric floors for D1/D2/D5, advisor confidence, and gap-to-second, **so that** I can approve or block a release on evidence instead of a qualitative "looks right" impression.

**Acceptance Criteria**:
1. Given the expanded battery has run in router mode, When the release owner reviews the report, Then every gated dimension shows a numeric score against its named floor.
2. Given any dimension is below its floor, When the release owner reviews the report, Then the release cannot be marked ready without an explicit accepted-risk decision.
3. Given the advisor confidence battery has run, When the release owner reviews gap-to-second, Then any scenario with a negative gap (a neighbor skill outranking `sk-design`) is flagged as a routing risk, not averaged away.

---

### US-002: Mode author proves procedure-card selection accuracy (Priority: P0)

**As a** `sk-design` mode author, **I want** a dedicated scenario proving my mode selects the correct private procedure card for its trigger, **so that** Phases 006-011's card changes do not silently break routing inside my mode.

**Acceptance Criteria**:
1. Given a procedure card exists after Phases 006-011 land, When the card-selection battery runs, Then exactly one scenario proves that card is selected by its trigger in router mode and in live mode.
2. Given a card is removed or merged during Phases 006-011, When the battery is updated, Then the retired card's scenario is removed with a documented reason rather than left to silently fail.

---

### US-003: Maintainer catches routing gaps through a remediation loop (Priority: P1)

**As a** maintainer, **I want** a defined remediation loop for any scenario or dimension that misses its floor, **so that** a routing gap is fixed and re-verified instead of quietly shipped.

**Acceptance Criteria**:
1. Given a scenario misses its floor, When the remediation loop is invoked, Then the owner, trigger condition, and re-benchmark cadence are all named in `decision-record.md`.
2. Given remediation requires touching `mode-registry.json`, `hub-router.json`, procedure cards, or `skill_advisor.py`, When the fix is scoped, Then it routes to a new phase rather than expanding Phase 012's write boundary.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Exact final procedure-card count and scenario count depend on what Phases 006-011 actually land with; this plan sets a floor (at least 60 total scenarios, at least one scenario per card) rather than a fixed final number.
- Whether the live-mode dispatch executor for Phase 012's rerun is `cli-opencode` again (as used in prior parity work) or a different executor is left to the implementation pass, informed by whichever executor Phases 006-011 themselves used.
- Whether advisor confidence and gap-to-second are promoted into the weighted D1-D5 aggregate or remain advisory-only signals is deferred to `decision-record.md` ADR-001, pending release-owner input once real battery data exists.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
