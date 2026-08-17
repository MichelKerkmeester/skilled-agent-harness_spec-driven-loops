---
title: "Decision Record: Extend the Compatibility Upcasters to the Six Live Event Vocabularies"
description: "Decision record for 003-legacy-compat-event-vocabulary: the architectural rulings this remediation child depends on, with alternatives and consequences."
trigger_phrases:
  - "legacy compat event vocabulary"
  - "blocker 2 upcaster coverage"
  - "unknown legacy record migration"
  - "live event vocabulary upcaster"
  - "deep loop 023 compat"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/005-blocker-closeout/003-legacy-compat-event-vocabulary"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Accepted ADR-003 with census-checked map, pin, and delegation dispositions"
    next_safe_action: "Orchestrator reviews and lands the uncommitted candidate"
    blockers: []
    key_files:
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

# Decision Record: Extend the Compatibility Upcasters to the Six Live Event Vocabularies

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Write the six live event vocabularies with full upcaster coverage

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-30 |
| **Deciders** | Operator (ruling), packet owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

Report §6 step 3 permits two exits from Blocker 2: extend the compat upcasters to the live event vocabularies, or prove no legacy state needs migrating. The second is cheaper but requires a real inventory of legacy state logs that must survive, and it leaves the bridge broken for any state that appears later. Five per-mode upcasters plus skill-benchmark currently reject ordinary lifecycle records, so the first ordinary record blocks a whole log.

### Constraints

- The operator has ruled: write the vocabularies. The prove-nothing-to-migrate exit is not taken.
- The census still runs first, because a pin that contradicts the census is a defect.
- Fixtures must come from real command output; synthetic identity-complete records are why this shipped green.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Full upcaster coverage for all six live vocabularies: research, review, alignment, council, skill-benchmark, and the deep-improvement common bridge.

**How it works**: Every stem a live run emits is either mapped to a typed target or explicitly pinned with a recorded rationale. Acceptance per mode is a replay of a captured real state log producing zero `blocked:unknown-legacy-record`. The census runs first and supplies the must-survive list that pins are checked against.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Write the six vocabularies (operator ruling)** | The bridge works for state that exists and state that appears later; discharges Blocker 2 outright | Substantially more work than the alternative | 9/10 |
| Prove no legacy state needs migrating | Far cheaper; explicitly permitted by report §6 step 3 | Leaves the bridge broken; any later legacy state re-opens the blocker; depends on an inventory being exhaustive | 5/10 |
| Map only the stems the census finds | Middle cost | Census-shaped coverage rots the moment a run emits something new; recreates the current defect | 4/10 |

**Why this one**: The operator ruled for full coverage. Beyond the ruling, the census-shaped alternatives make the bridge only as good as the inventory taken on one day, which is the failure mode already observed.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A live log migrates instead of blocking on its first ordinary record.
- Every stem carries an explicit, reviewable disposition rather than an accidental omission.
- Blocker 2 is discharged outright rather than deferred behind an inventory claim.

**What it costs**:
- Substantially more implementation work than the prove-nothing exit. Mitigation: the six vocabularies are independent and parallelisable once the census and fixtures exist.
- Real fixture capture requires running or locating real runs per mode. Mitigation: substitution from existing run artifacts is permitted and recorded.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A stem is pinned that should be mapped, losing data at cutover | H | Every pin carries a rationale checked against the census |
| Fixtures drift back to synthetic under time pressure | H | ADR-002 and CHK-011 require per-fixture provenance |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Blocker 2 is a named cutover blocker with six CUTOVER BLOCKER findings |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed, including the cheaper permitted exit |
| 3 | **Sufficient?** | PASS | Full stem coverage plus a real-log replay is the minimum that proves the bridge works |
| 4 | **Fits Goal?** | PASS | Directly discharges Blocker 2, which gates `014` |
| 5 | **Open Horizons?** | PASS | A new stem is an additive mapping, not a rebuild |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Six `*-ledger-schema/legacy-compatibility.ts` modules.
- Six `runtime/tests/unit/*-ledger-schema.vitest.ts` suites and their fixtures.

**How to roll back**: Each vocabulary is an independent commit; revert the failing mode and re-run its ledger-schema suite. No live state is migrated by this child, so there is no data to reverse.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Replay fixtures are captured from real command output

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-30 |
| **Deciders** | Operator (implied by the coverage ruling), packet owner |

---

<!-- ANCHOR:adr-002-context -->
### Context

The reason six broken upcasters shipped green is that their fixtures are synthetic identity-complete records: hand-authored logs that carry every field the mapping expects. A real run emits records the mapping has never seen, which is exactly what `F-022-02` through `F-024-01` describe. A fixture authored by the same person who wrote the mapping tests the mapping against itself.

### Constraints

- Some modes may be impractical to run fresh; existing run artifacts must be an acceptable source.
- Captured fixtures may contain operator-identifying or credential-shaped values and must be scrubbed.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Every replay fixture is captured from real command output and records the command and run identifier that produced it.

**How it works**: Per mode, capture a state log from an actual run (or from an existing run artifact, with the substitution recorded), scrub it, and store it with its provenance. The replay assertion runs against that fixture, not against a hand-authored one.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Real capture with recorded provenance** | Tests the mapping against records it did not anticipate; provenance makes recapture possible | Requires access to real runs; needs scrubbing | 9/10 |
| Synthetic identity-complete fixtures (status quo) | Trivial to author; deterministic | Tests the mapping against itself; this is the confirmed root cause | 1/10 |
| Generated fixtures from the emitter source | Deterministic and exhaustive over declared stems | Only as complete as the declaration; misses shapes the emitter produces incidentally, such as nested heartbeats | 6/10 |

**Why this one**: Only a real capture contains the shapes nobody declared, and those shapes are precisely what the six findings are about.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The fixture can surprise the mapping, which is the only way the test carries information.
- Provenance makes a fixture recapturable when the emitter changes.

**What it costs**:
- Capture and scrubbing effort per mode. Mitigation: substitution from existing artifacts is permitted and recorded.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A scrubbed fixture loses the shape that mattered | M | Scrub rule recorded; scrubbing replaces values, never removes fields |
| No real run available for a mode | M | Substitution from existing run artifacts, recorded explicitly per mode |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Synthetic fixtures are the identified reason the defect shipped green |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed, including source-generated fixtures |
| 3 | **Sufficient?** | PASS | Capture plus provenance is the minimum that makes the fixture independent |
| 4 | **Fits Goal?** | PASS | Makes the Blocker 2 evidence load-bearing |
| 5 | **Open Horizons?** | PASS | Recapture is a documented procedure rather than a rewrite |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Fixture files under the six ledger-schema test suites.
- A recorded scrub rule and per-fixture provenance record.

**How to roll back**: Restore the prior fixtures. Doing so re-introduces the synthetic-fixture weakness, so a rollback here must be recorded as re-opening Blocker 2 for that mode.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Map lossless lifecycle records and pin legacy-only observations

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-07 |
| **Deciders** | Packet owner, based on the captured-log census |

### Context

The real logs contain both lifecycle records that can be represented by an existing typed event and operational, derived, or mutation records for which inventing a typed target would overstate the evidence. Alignment also contains an iteration slice that is not a terminal lane completion, and council emits a nested heartbeat shape that must remain non-authoritative.

### Decision

Map only records with a lossless typed target. Pin every live stem without one, retaining the legacy record as an explicit compatibility outcome. The complete mode-by-mode disposition table is in `implementation-summary.md`; the census and fixture provenance are the evidence sources for each pin.

| Case | Disposition | Rationale |
|------|-------------|-----------|
| Research, review, alignment, and common lifecycle records | Mapped to their registered typed targets | The existing upcasters have a lossless target and stable identity checks. |
| Research/review operational, convergence, synthesis, lock, and mutation records | Pinned | No lossless typed mode event exists; pinning preserves the old fact without fabricating semantics. |
| Alignment `type:"iteration"` slice | Pinned as non-terminal | The captured stream contains slices; mapping one to `lane_completed` would claim terminal completion. |
| Alignment `type:"finding"` | Pinned | The legacy row lacks typed adjudication/proof bindings. |
| Alignment config with only `sessionId` | Mapped to `deep_alignment.run_initialized` | This is the identity shape emitted by the live config; `runId` and `authorityEpochId` are not required here. |
| Council `{type:"progress_record",event:"session_heartbeat"}` | Compatible, non-authoritative | The live heartbeat is liveness evidence, not a domain event. |
| Council `topic_completed` and `round_completed` | Mapped to `ai_council.round_ended` | Both are terminal round signals with the same typed destination. |
| Skill-benchmark common stems | Delegated to the common upcaster | This matches the established agent/model variant bridge and keeps common vocabulary behavior single-sourced. |

### Alternatives Considered

| Option | Why rejected |
|--------|--------------|
| Map every legacy row to the nearest typed event | It would turn operational or partial evidence into false domain semantics. |
| Block every unmapped row | It reopens the original cutover blocker on the first ordinary lifecycle record. |
| Change reducers or authority behavior to absorb the rows | Those surfaces belong to the alignment-coverage and authority-cutover workstreams, outside this child. |

### Consequences

- Real logs migrate without an unknown-record block while lossy records remain visibly pinned.
- The alignment migration no longer promotes a slice to terminal lane completion.
- The common bridge remains the single implementation for shared improvement lifecycle events.
- A future live stem still requires an explicit mapping or pin; the fail-closed behavior for genuinely unknown stems remains intact.

### Rollback

Restore the six touched ledger-schema files from clean anchor `5c98e4654e4bcaf2c7002412d6da2b92f1793942` and rerun the affected ledger-schema suite. This rollback was not executed because all gates remained green.
<!-- /ANCHOR:adr-003 -->
