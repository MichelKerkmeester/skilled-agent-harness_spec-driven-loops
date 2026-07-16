---
title: "Feature Specification: path-covering termination"
description: "Plan replay-stable termination on proven, mode-specific search-space coverage: every major path or semantic community is addressed, required contradictions are resolved, and partial coverage remains explicit instead of being hidden by an iteration cap."
trigger_phrases:
  - "path-covering termination"
  - "coverage-based deep-loop stopping"
  - "deep-loop phase 011 child 001"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/011-convergence-termination-and-health"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/011-convergence-termination-and-health/001-path-covering-termination"
    last_updated_at: "2026-07-15T15:19:24Z"
    last_updated_by: "codex"
    recent_action: "Authored the path-covering termination planning contract"
    next_safe_action: "Implement mode coverage profiles and the blocker-aware stop predicate"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Path-Covering Termination

> Phase adjacency under the 008 parent (grouping order, not a runtime dependency): predecessor none (first sibling); successor `002-cycle-detection`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/011-convergence-termination-and-health/001-path-covering-termination |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | First child of phase 011; the program manifest assigns path-covering termination to convergence, termination, and health |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shipped stop decisions prove threshold satisfaction, not exploration completeness. Council convergence compares five aggregate
signals with fixed thresholds and returns `STOP_ALLOWED` when every trace entry passes and no blocking disagreement remains
(`.opencode/skills/system-deep-loop/runtime/lib/council/convergence.cjs:29`, `:188`, and `:192`). The coverage graph already
computes mode-specific ratios for research, review, and context and persists iteration snapshots
(`.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:50`, `:1008`, and `:1029`), but it does
not define the finite path universe that a run promised to explore or issue a certificate that every major region was addressed.
An iteration cap can therefore stop an under-covered run, while repeated work in one region can satisfy activity or novelty
signals without touching another required region.

Run-2 makes the distinction explicit: raw `newInfoRatio` must give way to trusted evidence yield plus STOP blockers, and
max-iteration exhaustion is incomplete rather than converged
(`.opencode/specs/system-deep-loop/034-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md:67`
and `:72`). Phase 010 supplies the concept boundary this proof needs: deterministic semantic communities distinguish a genuinely
new concept from a paraphrase while preserving evidence novelty
(`.opencode/specs/system-deep-loop/034-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities/spec.md:50`
and `:112`). The program consequently places convergence after durable fan-in and novelty/claims projections
(`.opencode/specs/system-deep-loop/034-deep-loop-innovation/manifest/phase-tree.json:15`-`:17`).

This phase plans a replay-stable coverage contract: each mode declares its required path dimensions, the reducer freezes and
versions the resulting universe, semantic-community and contradiction projections update path states, and the evaluator permits
termination only when all major paths are addressed, all required contradictions are resolved, the projection is fresh, and no
STOP blocker remains. A run that hits budget, time, or iteration limits first reports partial coverage with the exact gaps; it
does not relabel resource exhaustion as convergence.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned `ModeCoverageProfile` for every supported deep-loop mode, defining path dimensions, major-region rules, mandatory evidence classes, contradiction policy, and the only statuses that close a path.
- Mode-family coverage definitions: research covers required question/DAG branches, source classes, falsification obligations, and semantic communities; review and alignment cover changed-surface × applicable-dimension cells plus critical finding/refutation paths; council covers agenda branches, independent evidence/dissent regions, and critical disagreements; improvement and benchmark variants cover candidate × evaluator/canary/scenario obligations and unresolved failure regions.
- A frozen `CoverageUniverse` keyed by namespace, run, mode-profile version, input fingerprint, community-projection version, and ledger position; late-discovered major paths extend the universe through a new version rather than mutating prior evidence.
- Path states `unvisited`, `active`, `addressed`, `blocked`, and `excluded`, with evidence locators and transition provenance. Only `addressed` or policy-authorized `excluded` paths close the denominator; blocked or ambiguous paths remain open.
- A coverage certificate containing weighted and unweighted coverage, addressed/total major regions, open path IDs, blocker IDs, unresolved contradiction IDs, semantic-community membership version, projection freshness, and the ledger/replay fingerprint.
- A termination predicate with explicit `STOP_ALLOWED`, `STOP_BLOCKED`, `CONTINUE`, and `INCOMPLETE_LIMIT` outcomes. `STOP_ALLOWED` requires a valid frozen universe, complete major-region coverage, zero required open paths, zero unresolved critical contradictions, zero STOP blockers, and fresh replayable projections.
- A partial-coverage report that ranks the remaining paths without hiding the denominator, lists evidence needed to close each path, and distinguishes incomplete coverage from policy-authorized exclusion.
- Additive shadow integration with existing coverage snapshots and the council decision bridge, preserving current authority until the program's staged cutover phase.
- Deterministic fixtures for complete, partial, blocked, excluded, late-expanding, paraphrase-heavy, contradiction-heavy, empty, replayed, and limit-exhausted spaces across supported mode profiles.

### Out of Scope
- Cycle detection, repeated-state fingerprints, or oscillation policy; owned by successor `002-cycle-detection`.
- Independent stopping-clock arbitration across budget, novelty decay, wall time, and coverage; owned by `003-stopping-clocks`.
- Value-of-computation ranking or adaptive compute allocation beyond exposing ranked uncovered paths; owned by `004-value-of-computation-allocation`.
- Generic degeneration or mode-collapse health policy; owned by `005-health-and-degeneration-harness`.
- Rebuilding phase-010 semantic communities, contradiction/supersession events, claim continuity, or transactional projections; this phase consumes their committed versions.
- Calibrating production thresholds, changing runtime authority, migrating in-flight packets, or removing iteration limits. Limits remain safety clocks and produce `INCOMPLETE_LIMIT` when coverage is not proven.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define coverage per supported mode without collapsing modes into one score | Every mode profile names its path dimensions, major-region rule, required evidence, contradiction policy, closeable statuses, and profile version; fixtures reject an unknown or incomplete profile |
| REQ-002 | Freeze a replayable search-space denominator | A certificate binds the universe to mode, run, input, profile, community projection, ledger position, and replay fingerprint; identical inputs replay to the same path IDs and denominator |
| REQ-003 | Consume semantic communities rather than raw claim strings | Paraphrases in one committed community close one concept path, not multiple paths; a new stable community extends coverage and evidence-only growth remains separately visible |
| REQ-004 | Make the termination predicate blocker-aware and fail closed | `STOP_ALLOWED` is impossible with an invalid/stale universe, any required open path, unresolved critical contradiction, ambiguous major community, or STOP blocker |
| REQ-005 | Separate proven convergence from resource exhaustion | A time, budget, or iteration limit reached below full required coverage returns `INCOMPLETE_LIMIT` with the triggering limit and uncovered paths, never `STOP_ALLOWED` |
| REQ-006 | Report partial coverage as an actionable artifact | Every non-stop decision returns addressed/total regions, weighted and unweighted ratios, uncovered and blocked path IDs, required evidence, contradiction IDs, projection versions, and ranked next paths |
| REQ-007 | Preserve evidence and exclusion provenance | Each closed path cites ledger events or projection rows; each exclusion records an authorized reason and policy version; aggregate ratios alone cannot close a path |
| REQ-008 | Integrate additively with current convergence surfaces | Shadow evaluation emits the existing decision/trace bridge plus a path-coverage certificate; legacy authority and thresholds remain unchanged until the later cutover contract authorizes them |
| REQ-009 | Prove deterministic behavior under path and projection change | Complete, partial, blocked, exclusion, late-discovery, community-drift, contradiction, empty, replay, and limit-exhaustion fixtures produce stable decisions and certificates |
<!-- /ANCHOR:requirements -->

### Coverage and termination contract

Coverage is a proof over a declared universe, not a scalar sampled after an arbitrary number of iterations. The profile compiler
derives deterministic path IDs from mode-owned dimensions and freezes version 1 before authoritative evaluation. Reducer events
move paths through the state machine while retaining evidence locators. A newly discovered major region creates a successor
universe version, invalidates any older stop candidate, and requires evaluation against the expanded denominator. Community
membership is read only from the committed phase-010 projection; ambiguous communities remain open and projection-version drift
forces recomputation before a stop decision.

The evaluator returns `STOP_ALLOWED` only when `universe.valid && universe.frozen && projection.fresh`, every major path is
`addressed` or policy-authorized `excluded`, all mandatory evidence obligations are present, required open-path count is zero,
unresolved critical contradiction count is zero, and STOP-blocker count is zero. Any blocker yields `STOP_BLOCKED`; remaining
work with available clocks yields `CONTINUE`; an exhausted safety clock yields `INCOMPLETE_LIMIT`. Weighted coverage may rank
work, but cannot override an uncovered mandatory path. This is stronger than count-based stopping: iterations measure effort,
whereas the certificate names what was examined, what remains, and the replayable evidence behind the decision.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every supported mode has a versioned coverage profile whose mandatory paths and close conditions are explicit and fixture-backed.
- **SC-002**: Full required coverage with fresh projections and zero blockers produces one replay-stable `STOP_ALLOWED` certificate; any missing mandatory path or critical contradiction prevents it.
- **SC-003**: Limit exhaustion below full coverage produces `INCOMPLETE_LIMIT` and a complete partial-coverage report naming the remaining paths and evidence obligations.
- **SC-004**: Paraphrase-heavy runs do not manufacture coverage, late major-region discovery invalidates stale stop candidates, and replay reproduces the same universe, path states, decision, and certificate hash.
- **SC-005**: The path evaluator lands additive and shadow-only, preserving existing council and coverage-graph authority until staged cutover.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Inherits the program's additive-dark, replay-determinism, stable-identity, mixed-version, and authority-cutover constraints. The
largest phase-specific risk is denominator gaming: an underspecified profile can report complete coverage while omitting a major
region. Other risks are premature universe freeze, path explosion, authorized-exclusion abuse, semantic-community merge/split
drift, stale contradiction projections, small denominators producing misleading ratios, and a late major-region discovery after
a provisional stop. Mitigations are versioned mode profiles, mandatory-region fixtures, fail-closed unknown profiles, explicit
exclusion provenance, universe supersession, projection freshness checks, and certificate replay.

This child declares no sibling `depends_on`. It still consumes program prerequisites from phases 003, 004, 006, and 007 through
the phase-011 parent; the manifest explicitly sequences fan-in and novelty before convergence
(`.opencode/specs/system-deep-loop/034-deep-loop-innovation/manifest/phase-tree.json:17`).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Execution must freeze the exact mandatory-region matrix, evidence sufficiency rules, authorized
exclusion roles, weighting policy, and maximum universe-expansion behavior for each mode before shadow calibration. Those are
profile and evidence decisions inside this contract; they cannot weaken the invariant that every mandatory path and critical
contradiction is explicitly dispositioned before `STOP_ALLOWED`.
<!-- /ANCHOR:questions -->
