---
title: "Feature Specification: Extend the Compatibility Upcasters to the Six Live Event Vocabularies"
description: "Five per-mode upcasters plus skill-benchmark reject ordinary lifecycle records that live runs actually emit, so the first ordinary record blocks a whole log. The operator ruling is to write the six live vocabularies with full upcaster coverage; a legacy-state census still runs first, as evidence rather than as an alternative exit."
trigger_phrases:
  - "legacy compat event vocabulary"
  - "blocker 2 upcaster coverage"
  - "unknown legacy record migration"
  - "live event vocabulary upcaster"
  - "deep loop 023 compat"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/023-legacy-compat-event-vocabulary"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the remediation child package from the WS1 phase-tree proposal"
    next_safe_action: "Run T001 against the 6 scoped findings before any edit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 0
    open_questions:
      - "Per unmapped stem: map it, or pin it as legacy-only? Each disposition needs a recorded rationale."
      - "Does the alignment lane-completion semantics fix belong here or in 026?"
    answered_questions:
      - "OPERATOR RULING: write the six live vocabularies with full upcaster coverage. The prove-no-legacy-state shortcut is NOT the chosen path."
      - "The census still runs first, as evidence for the mapping work rather than as an alternative exit"
      - "Fixtures are captured from real command output, never authored as synthetic identity-complete records"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Extend the Compatibility Upcasters to the Six Live Event Vocabularies

> Phase adjacency under the `036-deep-loop-innovation` parent (grouping order, not a runtime dependency): predecessor `022-shadow-parity-independent-derivation`; successor `024-durable-write-boundaries`.

> **Scaffold dependency.** This child is scaffolded under `036-deep-loop-innovation/` as a flat
> sibling of phases 001-020. That nesting is conditional on child `021`'s hashed-child-manifest fix
> (`F-029-03`) landing first: without a bounded child manifest, every child added here widens the
> parent's unbounded recursive-validation glob. `021` is the first scaffold in the tree.

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Blocker 2 is that the compatibility bridge blocks ordinary live events. Research maps three stems and pins seven, while live runs emit `graph_convergence`, `config_warning` and `lock_released`, none of them mapped or pinned, so the first ordinary record blocks the entire log. Review omits four live stems. Alignment maps every `type:"iteration"` record to `lane_completed`, so a migrated slice reads as terminal lane completion, and it requires identity fields the live config does not emit. Council checks a pinned set that misses its own live heartbeat shape. Skill-benchmark maps exactly one stem and never delegates the rest. The operator has ruled that this child writes the six live vocabularies with full upcaster coverage rather than taking the prove-no-legacy-state exit.

**Key Decisions**: Write the six live vocabularies with full upcaster coverage — operator ruling, recorded Accepted (ADR-001); replay fixtures are captured from real command output, never authored synthetically (ADR-002)

**Critical Dependencies**: `021` — honest baselines. Independent of `022`.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `system-deep-loop/036-deep-loop-innovation` |
| **Wave** | W2 (hard gate on 014) |
| **Findings in scope** | 6 (0 P0 / 6 P1 / 0 P2), 1 carrying a review `CONFIRMED*` mark |
| **Blocks `014` cutover** | Yes — Blocker 2 of the four named cutover blockers |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Five per-mode upcasters plus skill-benchmark reject ordinary lifecycle records. Research (`F-022-02`, CONFIRMED-WITH-CORRECTION) maps 3 stems and pins 7, while live runs emit `graph_convergence`, `config_warning` and `lock_released`, none mapped or pinned, so the first ordinary record blocks the whole log. Review (`F-022-03`) omits `graph_convergence`, `claim_adjudication`, `userPaused` and `synthesis_complete`. Alignment (`F-023-01`) maps every `type:"iteration"` record to `lane_completed`, so a migrated slice reads as terminal lane completion, and (`F-023-02`) requires `runId`/`sessionId`/`authorityEpochId` where the live config emits only `sessionId`. Council (`F-023-03`) checks `input.event` against a pinned set containing `progress_record`, but the live heartbeat is `{type:"progress_record", event:"session_heartbeat"}`, and `topic_completed`/`round_completed` are unregistered. Skill-benchmark (`F-024-01`) maps exactly one stem and never delegates the rest to the common upcaster the way the agent and model variants do. The reason this shipped green is that the fixtures are synthetic identity-complete records rather than captures of real command output.

### Purpose
Give every one of the six live vocabularies full upcaster coverage, proven by replaying a captured real state log per mode with zero `blocked:unknown-legacy-record`.

### Calibration

> **Severity calibration (carry verbatim, do not re-escalate).** The review report states that in
> every confirmed case the actor is the operator or a stale local file, not a remote attacker. Read
> every P0 and P1 below as **cutover-readiness and robustness risk, not breach risk**. A finding's
> severity label is not a licence to treat it as a security incident.

> **Finding = hypothesis.** Only 13 of the 166 register findings carry a `CONFIRMED*` mark. Every
> other finding in the scope table below is an unverified single-leaf report. No fix may be built
> against an unconfirmed finding: T001 re-reads every cited `file:line` at HEAD and records
> `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` before any edit.

### Non-Goals
- The prove-no-legacy-state shortcut. The operator has ruled that this child writes the vocabularies; the census is evidence, not an exit.
- Flipping authority for any mode — that is `014`.
- Alignment coverage and lane-identity semantics beyond the migration mapping itself — that is `026`.
- Shadow parity — that is `022`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Full upcaster coverage for all six live vocabularies: research, review, alignment, council, skill-benchmark, and the deep-improvement common bridge.
- A legacy-state census, run first, recording exactly which legacy state logs exist and must survive migration.
- Replay fixtures captured from **real command output** for each mode, replacing synthetic identity-complete records.
- Per unmapped stem, a recorded disposition: mapped (with the target) or pinned (with the rationale).
- Alignment: distinguish an iteration slice from terminal lane completion in the migration mapping.
- Alignment: accept the identity fields the live config actually emits rather than requiring fields it does not.
- Council: match the live heartbeat shape `{type:"progress_record", event:"session_heartbeat"}` and register `topic_completed` / `round_completed`.
- Skill-benchmark: delegate unmapped stems to the common upcaster, matching the agent and model variants.
- Correcting `F-022-02`'s refuted `manualStop` sub-claim in the confirm task.

### Out of Scope
- Reducer semantics beyond the migration mapping (`026` owns alignment coverage and lane identity).
- Certificate binding (`025`).
- Any authority flip (`014`).

### Findings in Scope (6)

| ID | Sev | Review mark | Location (at review time) | Defect |
|----|-----|-------------|---------------------------|--------|
| `F-022-02` | P1 | CONFIRMED-WITH-CORRECTION | `runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:90` | Research legacy compatibility blocks normal lifecycle events |
| `F-022-03` | P1 | unverified | `runtime/lib/deep-review-ledger-schema/legacy-compatibility.ts:89` | Review legacy compatibility omits the live review event vocabulary |
| `F-023-01` | P1 | unverified | `runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts:92` | Alignment upcaster treats every iteration as lane completion |
| `F-023-02` | P1 | unverified | `runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts:77` | Alignment compatibility cannot migrate live identity and convergence records |
| `F-023-03` | P1 | unverified | `runtime/lib/deep-ai-council-ledger-schema/legacy-compatibility.ts:194` | Council compatibility rejects live heartbeat and terminal state records |
| `F-024-01` | P1 | unverified | `runtime/lib/skill-benchmark-ledger-schema/legacy-compatibility.ts:28` | Skill Benchmark cannot migrate shared common legacy lifecycle records |

All six carry the CUTOVER BLOCKER cross-tag. `F-022-02` is CONFIRMED-WITH-CORRECTION: its `manualStop` sub-claim is wrong (`manualStop` appears 0 times at the cited location), and T001 must record that correction explicitly rather than carrying the sub-claim forward.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` | Modify | Map or pin `graph_convergence`, `config_warning`, `lock_released` (`F-022-02`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/legacy-compatibility.ts` | Modify | Add `graph_convergence`, `claim_adjudication`, `userPaused`, `synthesis_complete` (`F-022-03`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts` | Modify | Separate iteration slices from lane completion; accept live identity fields (`F-023-01`, `F-023-02`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-ledger-schema/legacy-compatibility.ts` | Modify | Match the live heartbeat shape; register `topic_completed` and `round_completed` (`F-023-03`) |
| `.opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-ledger-schema/legacy-compatibility.ts` | Modify | Delegate unmapped stems to the common upcaster (`F-024-01`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-ledger-schema/legacy-compatibility.ts` | Modify | Serve as the delegation target for the three benchmark variants |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-ledger-schema.vitest.ts` | Modify | Real-log replay fixture and zero-blocked assertion |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-ledger-schema.vitest.ts` | Modify | Real-log replay fixture and zero-blocked assertion |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-alignment-ledger-schema.vitest.ts` | Modify | Multi-slice lane stream proving the lane does not complete after the first slice |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-ledger-schema.vitest.ts` | Modify | Live heartbeat shape and terminal-record fixtures |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/skill-benchmark-ledger-schema.vitest.ts` | Modify | Delegation-to-common fixture |
| `.opencode/skills/system-deep-loop/commands/deep/assets/deep-{research,review,alignment}-auto.yaml` | Read-only | Evidence source for the live vocabularies; not modified by this child |
| `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-{session,topic}.cjs` | Read-only | Evidence source for the live council vocabulary; not modified by this child |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each of the six vocabularies has full upcaster coverage: every stem a live run emits is either mapped to a typed target or explicitly pinned with a recorded rationale. | Per mode, a stem-to-disposition table with no unlisted stem; a replay of a captured real log produces zero `blocked:unknown-legacy-record`. |
| REQ-002 | Replay fixtures are captured from real command output, not authored as synthetic identity-complete records. | Each fixture records the command that produced it and the run identifier; no fixture is hand-written. |
| REQ-003 | Alignment distinguishes an iteration slice from terminal lane completion. | A multi-slice alignment lane stream migrates without the lane completing after the first slice. |
| REQ-004 | Alignment accepts the identity fields the live config actually emits. | A live-shaped record carrying only `sessionId` migrates rather than being rejected for missing `runId`/`authorityEpochId`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Council matches the live heartbeat shape and registers `topic_completed` and `round_completed`. | A `{type:"progress_record", event:"session_heartbeat"}` record migrates; both terminal stems are registered. |
| REQ-006 | Skill-benchmark delegates unmapped stems to the common upcaster, matching the agent and model variants. | A stem handled by common migrates through skill-benchmark; the delegation path is asserted by test. |
| REQ-007 | The legacy-state census records which legacy state logs exist and must survive. | A census artifact enumerating the legacy logs, their modes, and whether each must migrate. |
| REQ-008 | `F-022-02`'s refuted `manualStop` sub-claim is corrected rather than carried forward. | T001 records the sub-claim as REFUTED with the grep that shows `manualStop` absent at the cited location. |

### Universal - applies to every child in the 021-032 remediation tree

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-U01 | Confirm before build. Every finding ID in the scope table is re-read at HEAD and classified `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` before any code edit. | T001 output table in `tasks.md` lists all scoped IDs with a classification and a cited probe, test, commit, or new anchor. |
| REQ-U02 | Baseline before delta. Every suite this child touches is run **before** any edit and its real numbers recorded; the whole gate is re-run at close and reported as a delta. | Pre-edit and post-edit runs of the named runners are recorded in `checklist.md` with discovered-test counts, pass/fail/skip, and exit codes. |
| REQ-U03 | Negative test per confirmed finding. Acceptance is a test that **fails before the fix and passes after** — never a green suite alone. | Each confirmed finding maps to a named test that is demonstrated red at the pre-fix commit and green at the post-fix commit. |
| REQ-U04 | Independent verification. An adversarial pass is run by a different actor than the builder; a gate authored alongside the change is not independent evidence. | A verification pass distinct from the build pass is recorded, naming the actor and the defects it found (or explicitly none). |
| REQ-U05 | Evidence citations are drift-proof. No completion claim cites a bare run count or a raw line number; every claim cites a **test name + suite-content digest + candidate SHA**. | `checklist.md` evidence strings contain a test name, a suite digest, and a commit SHA. Grep for bare "N/N passing" strings returns none. |
| REQ-U06 | Completion discipline. `validate.sh --strict` exits 0 for this child, all `checklist.md` items are `[x]` with evidence, and completion metadata reconciles across `spec.md` / `plan.md` / `tasks.md` / `implementation-summary.md`. | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0; no doc claims a completion state another doc contradicts. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 scoped findings closed as fixed, `REFUTED`, or `ALREADY-FIXED`.
- **SC-002**: Per mode, an end-to-end replay of a captured **real** state log migrates losslessly with zero `blocked:unknown-legacy-record`.
- **SC-003**: A multi-slice alignment lane stream proves the reducer does not complete the lane after the first slice.
- **SC-004**: Every stem a live run emits carries a recorded disposition (mapped or pinned) in all six vocabularies.
- **SC-005**: The legacy-state census exists and names what must survive.
- **SC-006**: `npm run typecheck && npm test` in `runtime` green, reported as a delta against the `021` baseline.
- **SC-007**: Blocker 2 discharged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Synthetic fixtures reproduce the original defect at a new granularity | High | REQ-002: fixtures captured from real command output, each recording the producing command |
| Risk | A stem is pinned that should have been mapped, silently losing data at cutover | High | Every pin carries a recorded rationale; the census names what must survive so pins can be checked against it |
| Risk | Alignment mapping overlaps `026`'s lane semantics work | Medium | Scope split is explicit: `023` owns the migration mapping, `026` owns coverage and lane identity. Serialize edits to shared understanding via `MANIFEST.md` |
| Dependency | `021` honest baselines | Blocks evidence issuance | Sequence after `021` |
| Dependency | Ability to run each mode long enough to capture a real log | Blocks REQ-002 | Capture from existing run artifacts where a fresh run is impractical; record which |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Losslessness
- **NFR-L01**: A captured real log must migrate with zero `blocked:unknown-legacy-record` and no dropped records.
- **NFR-L02**: A pinned stem must be recoverable as legacy state; pinning may not mean discarding.

### Fidelity
- **NFR-F01**: Every fixture must record the command and run that produced it.

### Compatibility
- **NFR-C01**: An already-typed record must pass through unchanged.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty legacy log: migrates to an empty typed log without error.
- Log with a single unmapped stem: blocks loudly with the stem named, never silently drops.
- Log mixing typed and legacy records: both survive.

### Error Scenarios
- Live record missing an identity field the mapping requires: accept the fields the live config emits (`F-023-02`), or block with the missing field named.
- Council heartbeat with the live nested shape: migrates (`F-023-03`).
- Skill-benchmark stem handled only by common: delegates (`F-024-01`).

### State Transitions
- Multi-slice alignment lane: the lane must not complete after slice one (`F-023-01`).
- Truncated legacy log: blocks with the truncation named rather than migrating a partial lane as complete.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | 6 findings across 6 `legacy-compatibility.ts` modules, 6 paired vitest suites, and a new legacy-state census artifact |
| Risk | 18/25 | Edits production compat-bridge code (`runtime/lib/*-ledger-schema`) that migrates real state at cutover; a wrongly pinned stem loses data (R-002) |
| Research | 10/20 | Root cause and target stems already isolated by review; the per-stem map-or-pin dispositions remain open work reserved to ADR-003 |
| Multi-Agent | 6/15 | Single workstream, five sequential phases, one independent-verification pass (REQ-U04) |
| Coordination | 12/15 | Wave W2 hard gate on `014` cutover (Blocker 2); depends on `021`'s honest baselines, independent of `022` |
| **Total** | **62/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Synthetic fixtures let the same defect ship green again | H | H | REQ-002 real-capture rule plus a fixture provenance field |
| R-002 | A wrongly pinned stem loses data at cutover | H | M | Census-checked pins; every pin carries a rationale |
| R-003 | Alignment mapping and `026` lane semantics conflict | M | M | Explicit scope split; serialize shared edits |
| R-004 | A real log cannot be captured for a mode | M | M | Fall back to existing run artifacts and record the substitution explicitly |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: A live log migrates (Priority: P0)

**As a** operator migrating in-flight state before a cutover, **I want** a real captured state log to migrate without blocking, **so that** the compat bridge is usable on the state that actually exists.

**Acceptance Criteria**:
1. Given a state log captured from a real run of a mode, When it is replayed through that mode's upcaster, Then zero records are `blocked:unknown-legacy-record`.
2. Given a stem that is deliberately pinned, When the log is replayed, Then the pin is reported with its recorded rationale rather than as a block.

### US-002: An alignment slice is not a completed lane (Priority: P0)

**As a** engineer migrating alignment state, **I want** an iteration slice to migrate as a slice, **so that** a partially audited lane does not read as terminally complete.

**Acceptance Criteria**:
1. Given a multi-slice alignment lane stream, When it is migrated, Then the lane is not complete after the first slice.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:open-questions -->
## 12. OPEN QUESTIONS

- For each currently unmapped stem, the map-versus-pin disposition is a per-stem decision that must be recorded with a rationale in `decision-record.md` ADR-003 as it is made. The census (REQ-007) is the input; a pin that contradicts the census is a defect.
- Does the alignment iteration-versus-lane-completion semantics fix belong to this child (migration mapping) or to `026` (reducer lane semantics)? Current split: `023` owns the mapping, `026` owns the reducer. Confirm before Phase 3 so the two children do not both edit the same understanding.
- Can a real state log be captured for every mode, or must some fixtures come from existing run artifacts? Record the substitution per mode rather than silently authoring a synthetic fixture.
<!-- /ANCHOR:open-questions -->
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Findings register**: `../016-whole-system-gate/review/findings-register.md`
- **Canonical registry**: `../016-whole-system-gate/review/deep-review-findings-registry.json`
- **Review verdict and calibration**: `../016-whole-system-gate/review/review-report.md`
<!-- /ANCHOR:related-docs -->
