---
title: "Feature Specification: Skill Benchmark shadow parity"
description: "Plan the Skill Benchmark shadow-parity harness for paired skill scenarios and scoring: run the typed ledger path beside the legacy emitter, compare canonical projections event-for-event, and block authority movement until parity is green."
trigger_phrases:
  - "Skill Benchmark shadow parity"
  - "skill scenario ledger parity"
  - "skill scoring shadow harness"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/006-shadow-parity"
    last_updated_at: "2026-07-15T21:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Established skill-benchmark shadow parity scope and event-level acceptance"
    next_safe_action: "Freeze the scenario matrix and canonical parity tuple before implementation"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Skill Benchmark Shadow Parity

> Phase adjacency under the 007-skill-benchmark parent (grouping order, not a runtime dependency): predecessor `005-resume-adapter`; successor `007-rollback-and-mode-gate`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/006-shadow-parity |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop / deep-improvement-common + skill-benchmark |
| **Origin** | Skill Benchmark mode migration: plan shadow parity for skill scenario runs and scoring before any authority cutover |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Skill Benchmark migration changes both the scenario-run path and the scorer path. A ledger-backed implementation cannot become authoritative merely because it produces a final score: the benchmark must preserve the legacy emitter's semantic event stream, the paired treatment identity, skill exposure evidence, gold handling, and scoring outcome. Absolute skill-on scores are confounded by executor and task difficulty, while a final pass/fail cannot distinguish discovery, invocation, instruction adherence, or execution failure.

This phase plans a **shadow-only** harness that executes the new typed-ledger path beside the legacy emitter on the same frozen scenario, treatment, executor, environment, tool, permission, dependency, seed, and gold inputs. It compares the two canonical projections event-for-event and records every mismatch with enough identity and digest context to reproduce it. The phase consumes the generic shadow framework from phase 014 and the shared deep-improvement-common services from mode 004; it adds only Skill Benchmark scenario and scoring logic. Legacy remains authoritative throughout this phase.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned Skill Benchmark scenario and treatment manifest covering paired no-skill, full-skill, distractor, component-ablated, and compatibility-boundary cases, with explicit executor and environment descriptors.
- A paired-run identity that binds the legacy and ledger executions to the same task, skill bundle, registry, tool and permission surface, dependency versions, gold snapshot, seed, and scenario revision.
- The Skill Benchmark adapter into the phase-014 shadow framework, using deep-improvement-common ledger, receipt, budget, replay, sealing, and projection services without re-implementing them.
- Skill-specific scenario events and scoring projections for availability, invocation, resource exposure, trajectory compliance, milestones, final-state checks, cost, and controlled security probes.
- Canonical projection normalization and event-for-event comparison, including stable logical IDs, sequence or causal parent, event kind, payload digest, status, score, and receipt references; volatile timing fields require an explicit exclusion rule.
- Gold-integrity checks for scored, negative, structural-only, and pending scenarios, plus negative controls for near-neighbor and noise skills and empty expected sets.
- A parity report and digest-bound shadow receipt that classify missing, extra, reordered, payload, score, gold, cost, and receipt mismatches and fail closed on unexplained semantic differences.

### Out of Scope
- Re-implementing deep-improvement-common services, the typed ledger, transition authorization, generic shadow scheduling, generic receipts, budgets, or shared projections.
- Resume behavior, rollback switching, final Skill Contribution Certificate issuance, validity-domain policy, registry-scaling experiments, composition analysis, or the mode gate owned by sibling children.
- Any authority cutover, removal of the legacy emitter, mutation of legacy benchmark semantics, or promotion from shadow to canary or ship.
- The other mode migrations and the six sibling Skill Benchmark concerns; this child supplies only their scenario/scoring parity evidence.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The phase uses the shared substrate rather than duplicating it | The implementation references the phase-014 shadow API and mode-004 deep-improvement-common services for ledger writes, replay identity, receipts, budgets, sealing, and projections; no parallel service is introduced |
| REQ-002 | Legacy and ledger runs are causally paired | Every pair shares the same scenario revision, treatment arm, task digest, executor descriptor, environment/tool/permission/dependency digests, gold digest, seed, and logical run identity |
| REQ-003 | The Skill Benchmark scenario lattice is explicit and reproducible | Required no-skill, full-skill, distractor, SKILL.md-only, references-ablated, scripts-ablated, and compatibility-boundary cases are represented as versioned scenario inputs with bounded repetitions |
| REQ-004 | The new path is compared event-for-event with the legacy projection | For every paired run, canonical event kind, logical ID, causal ordering, payload digest, status, score contribution, and receipt reference match; only documented volatile fields may be excluded |
| REQ-005 | Skill-specific scoring preserves causal stage distinctions | Availability, invocation, resource exposure, trajectory or key-point coverage, milestone diagnostics, final outcome, cost, and security-probe results are separately projected; intention-to-treat lift remains the primary paired outcome |
| REQ-006 | Gold integrity is fail closed | Scored scenarios with empty required intent or resource gold are blocked, pending and structural-only rows are excluded from positive numerators, gold provenance is recorded, and a gold mutation changes the score or produces an explicit invalid result |
| REQ-007 | Parity failures cannot authorize migration | Any missing, extra, reordered, semantically different, invalid-gold, or unexplained score event produces a typed mismatch and a withheld shadow result; legacy remains authoritative and no cutover signal is emitted |
| REQ-008 | Evidence is replayable and bounded to the frozen contract | The parity report binds scenario, bundle, evaluator, gold, executor, registry, tool, permission, dependency, and common-service digests, records commands and exit codes, and reproduces the same projection under replay |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The frozen Skill Benchmark scenario matrix exercises the required treatment and negative-control arms with paired legacy and ledger runs.
- **SC-002**: Canonical projections are event-for-event equivalent across the required corpus and repeated seeds, with zero unexplained semantic mismatches.
- **SC-003**: The parity comparator distinguishes causal stages and retains the paired intention-to-treat result without collapsing discovery, invocation, trajectory, and outcome into one score.
- **SC-004**: Gold-integrity checks block invalid positive scoring and make gold provenance and mutation sensitivity visible in the shadow evidence.
- **SC-005**: Every mismatch or replay failure yields a withheld, digest-bound result; no parity evidence changes authority or bypasses the later mode gate.
- **SC-006**: The implementation plan reuses deep-improvement-common and phase-014 services and leaves resume, rollback, certificate issuance, and cutover to their owning sibling phases.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Projection-shape drift** — the legacy emitter and ledger path may use different envelopes. Mitigation: compare a documented canonical Skill Benchmark projection, retain source event references, and fail on any semantic field that is not explicitly classified as volatile.
- **Executor confounding** — an absolute score can hide whether the skill caused the change. Mitigation: pair within task and executor, retain treatment arms, and report intention-to-treat first with stage diagnostics afterward.
- **Invalid or decorative gold** — empty expectations can create false passes. Mitigation: pre-dispatch gold policy, provenance, required-coverage blocking, and mutation-sensitivity checks.
- **Nondeterministic tools or environments** — replay can report harness noise as parity drift. Mitigation: freeze tool, permission, environment, dependency, seed, and registry digests; classify fidelity failures separately from semantic mismatches.
- **Shared-service duplication** — variant-local code can silently fork ledger or receipt semantics. Mitigation: make shared services the only construction path and add an ownership check to the phase gate.
- **Premature authority movement** — a green subset can be mistaken for a cutover authorization. Mitigation: this phase emits shadow evidence only; the later mode gate and cutover phase are the sole authority owners.
- **Dependencies**: the phase consumes the phase-014 shadow framework and mode-004 deep-improvement-common contracts as integration inputs. The declared phase dependency is empty; downstream implementation remains gated by the local phase-012 shared-contract freeze and write-set conflict graph before the 010 migration fan-out lands.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which legacy fields are genuinely volatile and may be excluded from the canonical event tuple without hiding behavioral drift?
- Which phase-014 shadow receipt fields and mode-004 common-service versions are the minimum frozen interface for this child?
- Which skill-resource canaries are mandatory for each treatment arm, and what evidence distinguishes loader exposure from model activation?
- What minimum repeated-run and task-slice coverage makes the paired interval useful without turning this parity child into the full benchmark calibration lane?
- How should a legacy-known defect be represented when the ledger path intentionally preserves it for parity and a sibling phase later owns the correction?
<!-- /ANCHOR:questions -->
