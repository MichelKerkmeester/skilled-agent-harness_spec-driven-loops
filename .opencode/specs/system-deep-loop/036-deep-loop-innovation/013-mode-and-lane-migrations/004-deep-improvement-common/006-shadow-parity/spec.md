---
title: "Feature Specification: Deep Improvement Common Services - Shadow Parity"
description: "Plan the shadow-parity harness for the shared Deep Improvement Common Services backbone: run the typed ledger path beside the legacy emitter, compare projections event-for-event, and block authority cutover until evaluator, canary, and promotion parity is proven."
trigger_phrases:
  - "deep improvement common shadow parity"
  - "deep improvement ledger parity"
  - "evaluator canary promotion shadow"
  - "shared service event parity"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/006-shadow-parity"
    last_updated_at: "2026-07-15T20:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped shared parity to event-level legacy projection comparison"
    next_safe_action: "Define parity fixtures, mismatch classes, and cutover-blocking thresholds"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Improvement Common Services - Shadow Parity
> Child adjacency under `004-deep-improvement-common` (independent planning contracts, not runtime dependencies): predecessor `005-resume-adapter`; successor `007-rollback-and-mode-gate`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/006-shadow-parity |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (Deep Improvement Common Services) |
| **Origin** | Phase 013 mode-and-lane migrations, mode 004; sixth child of the shared Deep Improvement Common Services migration |
| **Child depends_on** | `[]` |
| **Inputs** | Phase-014 health and degeneration shadow framework; siblings `001-typed-ledger-schema` through `005-resume-adapter`; parent phase plan; 065/002 findings registries |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shared Deep Improvement Common Services loop currently has one legacy execution path for evaluator-first iteration:
candidate generation produces a candidate, evaluators return observations, a score policy reduces those observations, canaries
check the candidate, and a guarded promotion service decides whether a stable baseline may change. The three downstream
variants reuse this backbone, but a new typed ledger path cannot become authoritative merely because its events serialize or
its terminal score looks plausible. It must reproduce the legacy path at every event boundary and projection boundary while
the legacy emitter remains authoritative.

This phase plans that proof. The harness runs the typed ledger path in shadow alongside the legacy emitter on the same run
input, evaluator epoch, fixture commitments, candidate lineage, and budget context. It pairs the legacy emissions with typed
ledger events, folds both into comparable projections, and records immutable mismatch evidence event-for-event. The comparison
must preserve raw evaluator observations, score-normalization versions, canary lifecycle, promotion evidence, external
authorization references, receipts, and rollback targets. A terminal aggregate alone is not parity.

The harness consumes the generic phase-014 health and degeneration shadow framework for coherent observations, telemetry-gap
handling, recovery hysteresis, and non-authoritative action requests. It does not redefine health thresholds, implement a
second cycle detector, authorize a stop, dispatch a candidate, or cut authority. It owns the shared evaluator, canary, and
promotion parity contract that `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` reuse. Their later
mode migrations consume this one source rather than defining variant-specific shadow semantics.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A paired shadow runner that feeds the same immutable run context to the legacy emitter and the typed ledger path, records
  path versions and correlation identities, and keeps the ledger path non-authoritative.
- A legacy-to-typed event mapping and comparator with one-to-one matching by run, lineage, logical event identity, and
  sequence; it preserves raw bytes and hashes while declaring only approved volatile fields such as observation timestamps.
- Event-for-event comparison of event family, schema/version path, causal links, candidate and evaluator identity, fixture
  and baseline references, raw observation references, normalized score references, uncertainty, canary outcomes, promotion
  status, receipt references, authorization references, and terminal dispositions.
- Projection checkpoints after every matched event boundary, including candidate lineage, evaluator epoch, score history,
  canary state, promotion state, vetoes, rollback target, budget observations, and per-variant shared-service status.
- Mismatch classification for missing, extra, reordered, malformed, unauthorized, stale, nondeterministic, reference-digest,
  projection, evaluator-integrity, canary, promotion, and telemetry-gap differences, with a typed evidence receipt for each.
- Shared evaluator, canary, and promotion probes that compare raw observations before normalization and compare guarded
  decisions without allowing the shadow path to mutate evaluator assets, hidden fixtures, baselines, or production state.
- Integration with the phase-014 shadow framework for health observations, `telemetry_gap`, `not_evaluable`, degeneration
  signals, recovery evidence, and action requests that remain observations until a later authorization boundary.
- A fixture matrix covering healthy progress, candidate rejection, score-policy changes, evaluator epoch changes, canary leak
  and drift, promotion veto, inconclusive evidence, rollback target preservation, resume/replay, duplicate delivery, missing
  events, extra events, order changes, and unsupported versions.
- A parity acceptance report and cutover-blocking contract consumed by the later common mode gate and the three downstream
  variant migrations.

### Out of Scope
- Defining the typed event vocabulary, reducer ownership, projection schema, sealed-artifact format, certificate format, or
  resume classification; those remain owned by siblings `001` through `005`.
- Reimplementing the phase-006 ledger, transition-authorization gateway, receipts, typed budgets, locks, or other shared
  substrate services. The harness calls their declared ports and verifies their references.
- Selecting evaluator rubrics, production thresholds, canary contents, promotion policy, or health thresholds. The harness
  compares versioned policy identities and consumes the phase owners' decisions.
- Changing legacy behavior, making the ledger path authoritative, performing a per-mode authority cutover, retiring legacy
  writers, or executing rollback in production.
- Implementing the three downstream variant migrations. They must consume this shared harness and add only namespaced variant
  inputs and fixtures after the shared contract is frozen.
- Hand-writing generated `description.json` or `graph-metadata.json` metadata for this folder.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The shadow harness executes both paths from one coherent input | Every paired run records the same run, candidate, lineage, evaluator epoch, fixture set, baseline, budget context, and input digest for the legacy and typed paths; path divergence is a blocking mismatch |
| REQ-002 | Events are compared one-for-one at each boundary | Eligible event sequences have equal cardinality, stable logical identities, compatible order, matching event families, matching authorization intent, and no unclassified missing or extra event |
| REQ-003 | Projections remain semantically identical after every event | At each common event boundary, protected projection fields, state hashes, artifact references, vetoes, rollback targets, and terminal dispositions match; non-semantic fields are excluded only by a versioned normalization rule |
| REQ-004 | Raw evaluator evidence survives parity comparison | Raw observations, fixture identity, evaluator capsule/epoch, judge family, seed, raw scale, rationale digest, normalization version, cost, and latency remain addressable; a later score policy cannot erase parity evidence |
| REQ-005 | Canary and promotion parity is guarded and non-authoritative | Canary leak, drift, invariant failure, inconclusive, veto, pause, abort, baseline-restore, and promotion decisions match with external authorization references; shadow output cannot authorize or mutate a promotion |
| REQ-006 | Mismatches fail closed and produce typed evidence | Any missing input, stale watermark, unsupported version, unauthorized event, evaluator-integrity failure, projection drift, or ambiguous mapping blocks the parity report and names the mismatch class and evidence refs |
| REQ-007 | Phase-014 health shadow integration remains observation-only | Health observations use coherent cursors and policy digests; `telemetry_gap` and `not_evaluable` are never treated as healthy; action requests do not stop, dispatch, cancel, or alter authority |
| REQ-008 | The gate is deterministic, replayable, and reusable by all three variants | Replaying a captured pair yields the same event matches, projection hashes, mismatch identities, and acceptance result; the shared fixtures pass for agent, model-benchmark, and skill-benchmark extensions |
<!-- /ANCHOR:requirements -->

The parity contract has two comparison layers. The first is the event ledger: each legacy emission maps to one typed event
or to an explicitly declared non-semantic adapter record. Event type, logical identity, causal parent, sequence position,
payload meaning, policy and version references, authorization intent, and receipt identity are protected. The comparator may
normalize a timestamp or provider-specific serialization only when the rule names the source field, target field, digest
algorithm, and compatibility version; normalization never drops a raw value.

The second is the projection: after every matched event, the legacy projection adapter and typed reducer expose a comparable
state snapshot. Protected fields include candidate lineage and profile scope, evaluator epoch, raw-trial index, normalized
score versions, uncertainty and insufficient-evidence state, canary lifecycle, promotion state, hard vetoes, stable baseline,
rollback target, budget settlement references, receipts, health observation watermark, and terminal disposition. A final score
match without intermediate state parity is a failure.

### Shadow-parity acceptance contract

Authority cutover is blocked until every required item below is green for the shared service corpus and for each downstream
variant fixture set:

- **Event completeness**: 100% of eligible event boundaries have one matched legacy and typed event; missing, extra, reordered,
  unauthorized, or unknown-version events are zero.
- **Protected semantic parity**: 100% of protected event fields and projection fields match their declared canonical values;
  unexplained or policy-uncovered differences are zero.
- **Decision parity**: evaluator insufficiency, canary veto/drift/leak, promotion pause/abort/restore, and promotion eligibility
  agree at every boundary; no shadow decision changes legacy authority.
- **Evidence integrity**: every comparison has a pair identity, source digests, policy/version identities, cursors, and receipts;
  no telemetry gap, stale watermark, or non-evaluable boundary may be counted as a pass.
- **Replay parity**: captured pairs replay deterministically with identical match identities, projection fingerprints, mismatch
  classifications, and final verdict; duplicate delivery is idempotent.
- **Framework parity**: phase-014 health observations and recovery signals use the same coherent evidence boundary, while all
  pause, re-seed, quarantine, repair, and stop requests remain non-authoritative.
- **Operational safety**: the typed path performs no authority write, candidate dispatch, evaluator mutation, hidden-fixture
  disclosure, baseline mutation, or legacy-writer bypass during shadow execution.

The report is `PASS` only when all blocking criteria are green and every tolerated representation difference is listed in the
versioned normalization manifest. `INCONCLUSIVE`, `TELEMETRY_GAP`, or `MISMATCH` is a blocking result, not a soft pass. The
later mode gate may consume a passing report, but this child never issues a cutover certificate.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The same immutable run context drives the legacy emitter and typed ledger path, and every eligible event boundary has a deterministic pair identity.
- **SC-002**: Event-for-event comparison reports zero missing, extra, reordered, unauthorized, unsupported, or unexplained protected-field differences across the required corpus.
- **SC-003**: Projection snapshots match at every boundary for lineage, evaluator, score, canary, promotion, receipt, budget, rollback, and terminal fields; final-only equality is insufficient.
- **SC-004**: Raw observations and evaluator/canary/promotion evidence remain addressable across normalization-policy changes and replay without mutation or loss.
- **SC-005**: Phase-014 health and degeneration shadow outputs are coherent, fail closed on data gaps, and never alter legacy stop, dispatch, budget, or authority behavior.
- **SC-006**: A shared parity report and mismatch taxonomy are reusable unchanged by `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`.
- **SC-007**: The acceptance report is a hard prerequisite for the later common mode gate; no parity result is treated as authority-cutover approval.

**Given** a candidate run is emitted by both paths, **When** each legacy boundary is paired with its typed event, **Then** the
comparator records a match or a typed blocking mismatch without silently dropping or inventing an event.

**Given** a normalization or evaluator epoch changes, **When** the pair is replayed, **Then** raw observations remain intact,
the source-to-target policy path is visible, and incomparable projections return `INCONCLUSIVE` or `TELEMETRY_GAP`.

**Given** a canary veto, evaluator-integrity failure, or promotion denial occurs, **When** shadow parity evaluates the decision,
**Then** both paths expose the same protected disposition and the typed path cannot authorize a state transition.

**Given** phase-014 reports degeneration or missing telemetry, **When** the shadow harness consumes the observation, **Then** it
records the same evidence boundary and leaves all action authority with the shared gateway and later cutover contract.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Legacy nondeterminism** - timestamps, provider ordering, retries, and external effects can produce false mismatches. Mitigation:
  capture immutable inputs, preserve raw values, compare logical identities, and permit only explicit versioned normalization.
- **False parity from over-normalization** - a permissive adapter could hide lost evidence, changed policy, or reordered effects.
  Mitigation: protect semantic fields, retain raw bytes and hashes, review every normalization rule, and fail closed on unknown fields.
- **Terminal-score tunnel vision** - equal final scores can conceal different candidate lineage, evaluator epochs, canary results,
  or promotion vetoes. Mitigation: compare projection snapshots after every event boundary.
- **Evaluator or canary leakage** - shadow instrumentation could expose hidden fixtures or mutate the evaluator boundary. Mitigation:
  use sealed references and receipts, keep the evaluator outside the mutable candidate surface, and test disclosure/mutation attempts.
- **Health framework drift** - phase-014 policy or adapter changes can make the two paths observe different watermarks. Mitigation:
  bind observations to policy and adapter digests, classify stale or missing inputs as blocking, and never infer health.
- **Shared-service divergence** - a downstream variant could fork comparator rules or quietly weaken promotion evidence. Mitigation:
  publish one common harness contract, require namespaced extensions, and run the same fixture matrix for all three variants.
- **Authority creep** - a shadow decision may accidentally dispatch, stop, promote, or mutate the baseline. Mitigation: separate
  comparison receipts from authorization, assert zero authority writes, and leave cutover to the later mode gate.
- **Cost and double execution** - shadowing doubles evaluator and canary work. Mitigation: typed budgets, bounded fixtures,
  deterministic replay where safe, and an explicit disable switch that retains evidence without changing legacy behavior.

Dependencies are the parent program's typed ledger and compatibility model, the phase-014 health and degeneration shadow
framework, siblings `001-typed-ledger-schema`, `002-reducers-and-projections`, `003-sealed-artifacts`, `004-certificates-and-receipts`,
and `005-resume-adapter`, the phase-012 shared mode contracts and write-set conflict graph, and the two 065/002 findings
registries. The successor `007-rollback-and-mode-gate` consumes the passing parity report; the three downstream variants reuse
the common harness after the shared contracts are frozen.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which legacy emission boundaries are canonical comparison points when one legacy call produces multiple serialized records,
  and which adapter record must preserve the original grouping?
- Which timestamps, provider identifiers, and retry metadata are genuinely non-semantic, and what canonical digest rule proves
  their normalization did not hide a behavioral difference?
- Which projection fields are protected for every shared service, and which variant extension fields require a namespaced
  comparator without weakening common parity?
- What corpus size and workload stratification are required to cover evaluator epochs, profile-specific champions, canary
  freshness, evaluator-integrity attacks, and promotion abort paths before the report may be consumed by the mode gate?
- How should shadow budget reservations and duplicate evaluator effects be represented when the legacy path already owns an
  external side effect and the typed path is required to remain observational?

These decisions are resolved while freezing the comparator, normalization manifest, fixture corpus, and parity report schema.
They cannot authorize authority movement, replace phase-014 health policy, or move rollback ownership into this child.
<!-- /ANCHOR:questions -->
