---
title: "Decision Record: system-skill-advisor Routing Fixes"
description: "Eight architecture decisions from the 011 deep-research synthesis: how confidence relates to the RRF score, why public thresholds freeze, how executor-delegation ambiguity gets one source of truth, what the warm-only CLI fallback is and is not, how hub discovery stays guarded without alias mirroring, why measurement freshness gates every tuning decision, why shouldFireAdvisor stays a separate stage, and the still-open no-brief output contract choice."
trigger_phrases:
  - "advisor routing fixes decision record"
  - "frozen threshold decision"
  - "executor delegation finalization boundary decision"
  - "warm only cli fallback decision"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/013-skill-advisor-routing-fixes"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored 8 ADRs from research.md Section 5 findings and Eliminated Alternatives table"
    next_safe_action: "Resolve ADR-007 (output contract) at Phase 1 kickoff, move its status from Proposed to Accepted"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "013-skill-advisor-routing-fixes-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "ADR-007's output contract choice is not resolved by research and needs a Phase 1 decision"
    answered_questions: []
---
# Decision Record: system-skill-advisor Routing Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Confidence Is a Quantized Policy Function, Not the Raw RRF Score

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-16 |
| **Deciders** | 011 research packet (iteration 1), ratified in this implementation packet |

---

<!-- ANCHOR:adr-001-context -->
### Context

The advisor's public confidence number looks like a probability, and CLAUDE.md Gate 2 reads it as one at the >=0.8 threshold. But `fuseAdvisorLaneRanks` produces a rank fusion score, not a confidence value. Somewhere between the fused score and the number a caller sees, a separate transformation happens, and any fix to routing correctness needs to know exactly where that boundary sits.

### Constraints

- `fuseAdvisorLaneRanks` uses the shared `fuseResultsMulti` with `k=8`, zero overlap bonuses, and graduated query-local min-max normalization (fusion.ts:299-326).
- Public confidence is `0.52 + min(1, liveNormalized*1.25)*0.43`, then floors: read-only-allowed/task-intent/direct-evidence floor at 0.82, derived-dominant pins 0.72, hard ceiling 0.95, plus a token-stuffing dispersion guard (fusion.ts:381-429).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Treat public confidence as a separate, deliberately quantized policy function over `liveNormalized`, not as the RRF fusion score itself.

**How it works**: `scoreAdvisorPrompt` computes the fused rank score first, derives `liveNormalized = fusedScore / liveWeightTotal`, then applies the base formula and the floor sequence to produce the number a caller sees. Every fix in this packet reads that separation before touching either layer, so a scorer fix does not accidentally treat a policy floor as fusion output or vice versa.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Confidence as quantized policy over liveNormalized (chosen)** | Matches the actual code path, lets floors encode genuine signal patterns (task intent, direct evidence) | Produces the 0.82 saturation legibility problem this packet partly addresses | 8/10 |
| Confidence as the raw RRF score | Simpler mental model | Does not match `fusion.ts:381-429`, would require rewriting the confidence pipeline for no correctness gain | 2/10 |

**Why this one**: The raw-RRF-score model was eliminated in iteration 1 because it contradicts the source. Building a fix plan on the wrong model would misdiagnose every downstream defect.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Every P0 fix in this packet targets the correct layer (contract, fallback timing, ambiguity derivation, measurement), none of them mistakenly treat the RRF score as the thing Gate 2 reads.

**What it costs**:
- Confidence stays legible only if callers understand it is a policy signal, not an ordinal probability. Mitigation: Recommendation 4 in research.md (surface `dominantLane` and evidence counts alongside confidence) stays on this packet's radar for a future phase, even though it is not in scope here.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future contributor conflates confidence with RRF score again and "fixes" the wrong layer | M | This ADR plus research.md Section 5 stay the canonical reference, cited in `SCORING_CALIBRATION` comments where feasible |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Every P0-1 through P0-4 fix depends on knowing which layer it touches |
| 2 | **Beyond Local Maxima?** | PASS | Iteration 1 explicitly tested and eliminated the raw-RRF-score alternative |
| 3 | **Sufficient?** | PASS | No further model refinement needed, `fusion.ts:381-429` is the full mechanism |
| 4 | **Fits Goal?** | PASS | Directly supports the packet's purpose of trustworthy testing before tuning |
| 5 | **Open Horizons?** | PASS | Leaves room for the deferred `dominantLane`-surfacing recommendation without blocking it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: Nothing in code, this ADR documents the existing mechanism as the frame for every other decision in this packet.

**How to roll back**: Not applicable, this is a factual model, not a code change.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Freeze Public Thresholds, Pursue Floor Calibration Only Through the Gated P2-8 Shadow Experiment

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-16 |
| **Deciders** | 011 research packet (iteration 8), ratified in this implementation packet |

---

### Context

Once the calibration-legibility problem was clear, the natural next move was to tune the thresholds themselves. Iteration 8 ran a 12-cell grid over confidence {0.78, 0.80, 0.82} by uncertainty {0.30, 0.35, 0.40} and got identical holdout outcomes across every cell. That result needed to become a hard constraint on this packet's scope, not just a footnote.

### Constraints

- Full corpus is 193 rows, holdout is 78 rows, frozen ambiguity slice is 25 rows. All threshold-grid numbers come from the same current-source run (iteration 8).
- Raising confidence to 0.84 alone dropped holdout coverage 24.36 points for 2.85 points of selective precision, the single clearest signal that public threshold tuning does not pay for itself.

---

### Decision

**We chose**: Freeze the public confidence threshold at 0.80, the uncertainty threshold at 0.35, and the ambiguity margins at 0.05. The only permitted calibration change in this packet is the single P2-8 candidate: `SCORING_CALIBRATION.confidence.taskIntentFloor` from 0.82 to 0.80, gated on three pre-registered empirical checks and on P0-4 landing first.

**How it works**: P2-8 runs behind an experiment path that defaults off. It flips one constant, re-runs the joined evaluator from P0-4, and compares the result against three fixed thresholds: holdout at or above 57/78, coverage at or above 61/78, ambiguity slice at or above 16/25. Any other result rejects the candidate and keeps 0.82. No other threshold, floor or margin changes in this packet.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Freeze thresholds, single gated floor candidate (chosen)** | Matches the grid evidence exactly, keeps the change surface to one constant behind one flag | Leaves the 0.82 saturation problem only partly addressed even if P2-8 succeeds | 9/10 |
| Raise confidence to 0.84 for cleaner separation | Intuitive "stricter gate" argument | Empirically destroys 24.36 points of coverage for 2.85 points of precision | 1/10 |
| Move uncertainty within 0.30-0.40 | Seems like a safe, small tuning knob | Holdout behavior is identical across the entire interval, so it buys nothing | 1/10 |
| Tune scorer weights or margins from the current baselines | Broader search space, might find a better operating point | Both committed baselines are stale against the clean 193-row corpus, so any tuning result would be unverifiable until P0-4 lands | 2/10 |

**Why this one**: The grid evidence is unambiguous and the stale-baseline finding makes broader tuning actively unsafe right now. A single, gated, reversible candidate is the only defensible move.

---

### Consequences

**What improves**:
- This packet cannot silently drift into ungrounded threshold tuning, the frozen values are enforced by scope, not just convention.
- P2-8's strict gates make the eventual accept/reject decision auditable instead of a judgment call.

**What it costs**:
- The 0.82 saturation problem stays partly unresolved if P2-8 rejects the candidate. Mitigation: the longer-term independence-aware uncertainty redesign named in research.md stays a named follow-up, not silently dropped.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Pressure to relax the three P2-8 gates after a near-miss result | M | Gates are fixed in this ADR and in spec.md before the experiment runs. Changing them requires an explicit operator decision, not an implementation-time judgment call |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The grid result is a direct, current-source empirical finding, not a hypothesis |
| 2 | **Beyond Local Maxima?** | PASS | The grid tested 12 combinations before this decision froze the surface |
| 3 | **Sufficient?** | PASS | One gated candidate is the smallest change that still tests the floor-calibration hypothesis |
| 4 | **Fits Goal?** | PASS | Directly matches the task instruction naming this as the key decision |
| 5 | **Open Horizons?** | PASS | Names the independence-aware uncertainty redesign as future work without blocking it |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts` gets an experiment-path branch for `taskIntentFloor`, defaulting to the current 0.82. No other constant changes.

**How to roll back**: Flip the experiment flag off. The default path is untouched, so rollback is a one-line config change, not a code revert.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Single Finalization Boundary for Executor-Delegation Ambiguity

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-16 |
| **Deciders** | 011 research packet (iteration 9), ratified in this implementation packet |

---

### Context

`result.ambiguous: true` can coexist with a top candidate that has an empty `ambiguousWith`, because the executor-delegation override mutates the fused ranking after `ambiguousWith` attribution runs but before the final `ambiguous` boolean gets derived. This reproduces on 7 of 8 frozen positive executor routes, which rules out a one-off bug and points at a structural ordering defect.

### Constraints

- `ambiguity.ts:22-57` and `fusion.ts:839-868` both agree on the same candidate list, so the defect is not a disagreement between two ambiguity implementations, it is a mutation that happens between one attribution step and one derivation step.
- The mismatch reproduces deterministically, it is not floating-point drift or test flakiness.

---

### Decision

**We chose**: Add one finalization boundary in `fusion.ts` where the executor-delegation override, the `ambiguousWith` attribution and the public `ambiguous` boolean all read from the same final, post-override cluster.

**How it works**: Either move the executor override to run before finalization, or add an explicit finalizer step at `fusion.ts:839-868` that recomputes `passes_threshold`, clears stale `ambiguousWith` entries, reapplies ambiguity detection, and derives `result.ambiguous` from that same final cluster. The regression invariant is `result.ambiguous === (top.ambiguousWith.length > 0)`, asserted on every fixture including the previously-uncovered existing-candidate branch.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Single finalization boundary (chosen)** | Fixes the ordering defect at its structural source, prevents the same class of bug from reappearing at a different mutation point | Touches shared scorer code that every routing result flows through | 8/10 |
| Fix only the serializer or handler that reports ambiguity | Smaller, more localized change | Leaves inconsistent fields inside the scorer result itself before projection, the next serializer change reintroduces the bug | 2/10 |
| Change the 0.05 ambiguity margins | Looks like a calibration knob | Both ambiguity APIs already agree on the candidate list, margins are not the defect | 1/10 |
| Treat it as floating-point drift and add a tolerance | Cheap, no structural change | The mismatch reproduces deterministically, tolerance would mask a real ordering bug | 1/10 |

**Why this one**: Iteration 9 isolated the defect as a post-attribution mutation, not a margin or precision issue. Only a finalization boundary closes the actual gap.

---

### Consequences

**What improves**:
- `result.ambiguous` becomes trustworthy for every downstream consumer, including the P1-6 threshold-parity suite that reads it.
- The existing-candidate branch (`executor-delegation.ts:470-477`), which had zero e2e coverage before this fix, gets its first test coverage as part of the same change.

**What it costs**:
- The finalization boundary is shared scorer code, so a bug here would affect every routing result, not just executor-delegation cases. Mitigation: the regression invariant runs against every fixture in the parity suite, not just the 7 previously-broken ones.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The finalization fix introduces a new mutation-order bug at a different point in the pipeline | H | Assert the coherence invariant broadly, not narrowly, per CHK-FIX-004 |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 7 of 8 frozen positive executor routes reproduce the defect today |
| 2 | **Beyond Local Maxima?** | PASS | Three narrower fixes (serializer-only, margin change, tolerance) were tested and eliminated in iteration 9 |
| 3 | **Sufficient?** | PASS | One boundary closes the gap for both attribution and the public boolean |
| 4 | **Fits Goal?** | PASS | Directly required by REQ-003 and US-001 |
| 5 | **Open Horizons?** | PASS | Does not foreclose future ambiguity-detection improvements, it just makes the current one coherent |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` (finalization boundary), `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts` (existing-candidate branch coverage), the parity fixture file (stale alias replacement).

**How to roll back**: Revert the finalization-boundary commit. Because the fix is additive (a new boundary, not a removed check), reverting restores the prior mutation order exactly, with the 7 known-broken fixtures returning to their prior red state.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: The Warm-Only CLI Fallback Is an Alternate Client, Not Daemon Recovery

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-16 |
| **Deciders** | 011 research packet (iteration 3), ratified in this implementation packet |

---

### Context

P0-2's fallback-budget fix could be designed two ways: treat the CLI fallback as a way to bring a dead daemon back to life, or treat it as a faithful alternate client that only helps when a daemon is already warm. Those two framings lead to different timeout and retry logic, so the packet needs to commit to one before writing the timing tests.

### Constraints

- `buildSkillAdvisorBriefFromCli` is `--warm-only`, deep-probes the socket, and never cold-spawns (`skill-advisor-cli-fallback.ts:224-262,499`).
- It returns retryable exit 75 when the daemon is absent, which only makes sense if callers are expected to retry against a daemon that might come up later, not to treat the CLI call itself as the thing that starts it.

---

### Decision

**We chose**: Treat the warm-only CLI fallback strictly as an alternate client for an already-running daemon. It never triggers daemon startup and P0-2's timing tests must assert the daemon-absent-to-exit-75 path explicitly, not treat it as an implicit success path.

**How it works**: The reserved fallback budget slice exists to give this alternate client enough time to probe and respond when the primary in-process path times out, not to give it time to spawn a new daemon process. The distinction matters for P0-2's test design: a daemon-absent scenario should assert exit 75 within budget, not assert eventual success.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Alternate client for a warm daemon (chosen)** | Matches the actual `--warm-only` implementation, keeps timeout math simple (bounded by budget, not by spawn time) | Does not help when the daemon is genuinely down, callers still see exit 75 | 8/10 |
| Daemon failover (treat CLI call as recovery) | Would make the system self-healing on daemon death | Contradicts the `--warm-only` code path directly, would require an entirely different cold-spawn design outside this packet's scope | 1/10 |

**Why this one**: The code already commits to warm-only behavior. Treating the fallback as failover would mean testing against a contract the implementation does not provide.

---

### Consequences

**What improves**:
- P0-2's timing tests test the real contract (bounded recovery within an already-warm daemon) instead of an aspirational one.

**What it costs**:
- A genuinely dead daemon still produces exit 75 through both paths. Mitigation: none in this packet, daemon cold-start recovery is explicitly out of scope and would be its own packet if ever pursued.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future contributor reads "fallback" and assumes it means recovery, then designs a feature expecting cold-spawn behavior | L | This ADR plus the P1/P2-7 transport diagnostic taxonomy state the CLI-recoverability of each failure mode explicitly |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | P0-2's timing tests need a clear contract to test against |
| 2 | **Beyond Local Maxima?** | PASS | Iteration 3 considered and eliminated the daemon-failover framing directly |
| 3 | **Sufficient?** | PASS | The warm-only contract is fully described by the cited source lines, no further research needed |
| 4 | **Fits Goal?** | PASS | Directly shapes P0-2's test design and the P1/P2-7 taxonomy |
| 5 | **Open Horizons?** | PASS | Does not block a future cold-spawn-recovery packet, it just keeps this one honest about scope |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**: No new code from this ADR alone, it frames the test design for T002 and the taxonomy split in T007.

**How to roll back**: Not applicable, this is a design frame, not a code change.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Two-Stage Hub Discovery Stays Guarded by Behavioral Fixtures, Not Alias Mirroring

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-16 |
| **Deciders** | 011 research packet (iteration 2), ratified in this implementation packet |

---

### Context

The advisor discovers a hub like sk-doc from `graph-metadata.json` discovery fields, then the hub's own `hub-router.json` picks the workflow mode from a richer 113-alias vocabulary. The named routing-registry-drift-guard only covers system-deep-loop's projection, so metadata-routed hubs have zero advisor-discovery coverage today. P1-5 needs to close that gap without breaking the two-stage design.

### Constraints

- sk-doc hub-internal parity is already green and strictly checked (12 modes, 113 aliases, 12 router signals) by `parent-skill-check.cjs`, but that checker never verifies the advisor can find the hub in the first place.
- Exact metadata-alias coverage was measured at 13.3 percent, which sounds alarming but is not the right metric, since the advisor uses weighted multi-field and semantic/derived lanes, not exact-string alias matching.

---

### Decision

**We chose**: Guard the boundary with behavioral discovery fixtures (one representative prompt plus hard negatives per workflow mode, routed through the real scorer), not by mirroring the 113 aliases into `graph-metadata.json`.

**How it works**: P1-5's new suite enumerates registry-bearing hubs and asserts that each workflow mode's representative prompt actually routes to that hub at compat thresholds. `parent-skill-check.cjs` gets extended to fail when a metadata-routed mode lacks a fixture, so the guard is structural, not just a suite that could silently stop being run.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Behavioral discovery fixtures (chosen)** | Tests what the advisor actually does (weighted multi-field, semantic, derived lanes), matches the two-stage design intentionally | Requires authoring per-mode fixtures, more work than a mechanical mirror | 8/10 |
| Mirror all 113 aliases into `graph-metadata.json` | Looks like a complete fix, mechanical to generate | Duplicates registry-owned vocabulary, inflates lexical evidence, and is the wrong invariant for a design that deliberately keeps discovery coarse and mode-selection fine-grained | 2/10 |
| Treat exact alias-coverage percentage as the recall metric | Cheap to compute | Measures the wrong thing, the advisor does not do exact-string alias matching | 1/10 |
| Read the existing green drift-guard as sufficient sk-doc coverage | No new work needed | The guard hard-codes system-deep-loop only, reading it as sk-doc coverage is a direct misread of what it checks | 1/10 |

**Why this one**: Iteration 2 eliminated both the mirroring approach and the alias-percentage metric on structural grounds, not just preference. Behavioral fixtures are the only approach that tests the real two-stage contract.

---

### Consequences

**What improves**:
- Advisor-level discoverability for sk-doc (and any future metadata-routed hub) becomes an enforced, structural guard instead of an assumption.
- This is the same fix as sk-doc packet 012's "unguarded advisor-discovery boundary" finding, named from the other side. Landing it once, coordinated, avoids two divergent fixture sets for the same gap.

**What it costs**:
- Fixture authoring for 12 sk-doc modes plus any other registry-bearing hub is real work, not a mechanical script. Mitigation: coordinate with packet 012 so the cost is shared, not duplicated.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Packet 012 and this packet design incompatible fixture formats before syncing | M | Plan.md Phase 5 makes joint fixture design a hard gate, not an informal note |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Zero advisor-discovery coverage exists for metadata-routed hubs today |
| 2 | **Beyond Local Maxima?** | PASS | Three alternative metrics or approaches were tested and eliminated in iteration 2 |
| 3 | **Sufficient?** | PASS | Behavioral fixtures plus a structural `parent-skill-check.cjs` guard close the gap completely |
| 4 | **Fits Goal?** | PASS | Directly required by REQ-005, and matches recommendation 2 in research.md ("fund the metadata-hub discovery battery before any per-skill routing research phases") |
| 5 | **Open Horizons?** | PASS | Extends naturally to any future metadata-routed hub, not just sk-doc |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**: New vitest suite under `.opencode/skills/system-skill-advisor/mcp_server/tests/`, extension to `.opencode/commands/doctor/scripts/parent-skill-check.cjs`, fixtures coordinated with packet 012.

**How to roll back**: Remove the new suite and revert the `parent-skill-check.cjs` extension. No production routing behavior depends on this guard, so rollback has zero runtime impact, only test coverage.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Measurement Freshness Gates Every Tuning Decision

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-16 |
| **Deciders** | 011 research packet (iterations 6-8), ratified in this implementation packet |

---

### Context

Both committed calibration baselines (`bench/scorer-calibration-baseline.json`, `scripts/routing-accuracy/scorer-eval-baseline.json`) fail hash equality against the clean 193-row corpus. Any threshold grid, floor experiment or scorer change evaluated against those stale baselines would produce numbers nobody could trust, including this packet's own P2-8 experiment.

### Constraints

- The stale-dist warning surfaced during research (a `@spec-kit/mcp-server` dist warning) reinforces that executed-dist and authored-source paths can silently diverge, which is a second, related freshness risk beyond the baseline files themselves.
- Iteration 7 attempted a joined calibration run and failed on runner unavailability. Iteration 8 recovered with a fresh, current-source, joined run. The numbers this packet cites (holdout 57/78, coverage, ambiguity slice 16/25) come specifically from that iteration-8 recovery run, not from the stale baselines.

---

### Decision

**We chose**: Repair measurement (P0-4) before any scorer, threshold or floor change lands, including the single gated P2-8 candidate. Treat any evaluation run against a stale baseline or a stale dist as inadmissible evidence for this packet's completion claims.

**How it works**: P0-4 regenerates both baseline files against the clean 193-row corpus and adds one joined evaluator that reports holdout top-1, ambiguity accuracy, floor frequency and Brier/ECE reliability bins from a single source-loaded run. P2-8 explicitly depends on P0-4's output in plan.md's phase dependency graph, it cannot run against pre-P0-4 numbers.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Repair measurement first, gate all tuning on it (chosen)** | Every later number in this packet traces to a verified, current-source run | Adds a full phase before any calibration work can start | 9/10 |
| Tune scorer floors, weights or margins from the current stale baselines | Faster to start | Produces unverifiable results, since the baselines themselves fail hash equality against the real corpus | 1/10 |
| Use the stale dist as calibration evidence | Avoids a source-loaded run, which is slower | The dist-freshness warning directly says the dist and source can diverge, using it risks citing numbers that do not reflect the current implementation | 1/10 |

**Why this one**: Iterations 6 through 8 established this is not a preference, it is a precondition for any trustworthy tuning claim, including the one this packet's task explicitly calls out as the key decision.

---

### Consequences

**What improves**:
- Every number cited in this packet's spec, plan and acceptance matrix (57/78 holdout, 61/78 coverage, 16/25 ambiguity slice) has a traceable, current-source origin (iteration 8).
- P2-8's eventual accept/reject verdict is defensible, because it runs against a repaired baseline, not a stale one.

**What it costs**:
- Phase 4 adds real time to the plan (1-2 sessions) before P2-8 can even start. Mitigation: Phases 1-3 and 5-7 do not depend on Phase 4, so they can run in parallel per the phase-dependency graph.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future contributor reaches for the stale baselines out of habit before checking freshness | M | `scorer-eval-baseline-ratchet.vitest.ts` hash-equality assertions fail loudly if the baseline drifts again |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Both baselines fail hash equality against the clean corpus today |
| 2 | **Beyond Local Maxima?** | PASS | Iteration 7's failed attempt and iteration 8's recovery both inform this decision |
| 3 | **Sufficient?** | PASS | One joined evaluator against a regenerated baseline covers every downstream measurement need in this packet |
| 4 | **Fits Goal?** | PASS | Named directly in the task instructions as gating P2-8 |
| 5 | **Open Horizons?** | PASS | The joined evaluator becomes reusable infrastructure for any future calibration work, not a one-off script |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**: `bench/scorer-calibration-baseline.json`, `scripts/routing-accuracy/scorer-eval-baseline.json` (regenerated), new joined evaluator script, `tests/parity/scorer-eval-baseline-ratchet.vitest.ts` (hash assertions restored).

**How to roll back**: Git revert restores the prior baseline files exactly, since regeneration is a full rewrite. Re-run the ratchet suite after reverting to confirm hash equality against the restored (stale) state.
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: No-Brief Output Contract Resolution

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-16 |
| **Deciders** | Operator, ratified 2026-07-16 |

---

### Context

Research left this decision open by design: "decide: skipped/fail-open returns `{}` or the governance fallback directive." The hook's no-brief output contract has drifted, the implementation now emits a governance directive where 4 of 11 targeted tests expect `{}`. Someone has to pick a winner before Phase 1 can align the hook, the tests and the reference doc, and research.md does not hand this packet an answer.

### Constraints

- 4 of 11 hook tests are red today, all on the same drift.
- Whichever option loses becomes a breaking change for any consumer that already depends on the current (non-test) behavior.

---

### Decision

**We chose**: Adopt the governance fallback directive as the no-brief output contract. `renderAdvisorFallbackDirective()` (`.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts:204`) already reaches the model on every prompt in production today, confirmed live. `git blame` on the `brief ?? renderAdvisorFallbackDirective()` line (`hooks/claude/user-prompt-submit.ts:243`) shows it landed as an intentional, review-hardened change in commit 7adbd30db9f (2026-07-10), not accidental drift. The implementation is the intended behavior, the 4 red tests are stale.

**How it works**: `renderAdvisorFallbackDirective()` returns the comment-hygiene directive plus the Fable-5 governor directive whenever the hook runs but produces no brief. Skip-eligible and fail-open paths still return `{}` unchanged, only the ran-but-produced-no-brief path emits the directive. Phase 1 aligns the 4 stale hook tests and `references/hooks/skill_advisor_hook.md` to this directive, the implementation itself does not change. Path correction for Phase 1: the real hook lives at `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`, not the `mcp_server/hooks/...` path shown in this packet's Files to Change table in spec.md.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Align implementation to `{}`, fix the drift | Matches what the tests already expect, smaller diff if no consumer depends on the governance directive | Wrong choice if a production consumer already relies on the governance directive shipping today | Rejected |
| Align tests to the governance directive, adopt it as the new contract | Correct choice if the governance directive already reached production and is providing value | Wrong choice if it was an unintentional drift with no real consumer, in which case this locks in an accidental behavior | Chosen |

**Why this one**: The consumer check confirmed the governance directive already reaches production on every prompt (`render.ts:204`, confirmed live), and `git blame` confirmed the change was intentional and review-hardened, commit 7adbd30db9f, not accidental drift. That makes the 4 red tests stale, not the implementation.

---

### Consequences

**What improves**:
- Once resolved, 11/11 hook tests go green and P1-6's threshold-surface-parity suite has a stable contract to test against.

**What it costs**:
- Phase 1 cannot start writing the fix until the consumer grep runs and the decision is made. Mitigation: this is a small, bounded investigation (one grep plus a read of its results), not a research phase.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The grep misses a consumer that reads the brief output indirectly, through a serialized log or a downstream cache | M | Cross-check the grep result against `references/hooks/skill_advisor_hook.md`'s existing description of who consumes the brief, before finalizing |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 4 of 11 hook tests are red right now because of this exact ambiguity |
| 2 | **Beyond Local Maxima?** | PASS | The choice traces to a live production check (`render.ts:204`) and a `git blame` confirmation (commit 7adbd30db9f), not a guess between two equally plausible shapes |
| 3 | **Sufficient?** | PASS | Aligning the 4 stale tests and the reference doc to the directive resolves the drift completely, no implementation change is required |
| 4 | **Fits Goal?** | PASS | Directly blocks REQ-001, resolving it unblocks the rest of Phase 1 |
| 5 | **Open Horizons?** | PASS | The directive stays reusable governance infrastructure for any future no-brief path, not a one-off carve-out |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**: `.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:143-178` (align the 4 stale expectations to the governance directive) and `.opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md` (document the accepted contract). `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:228-245` is the hook itself, it stays unchanged since the implementation is already the intended behavior.

**How to roll back**: Git revert restores the 4 test expectations and the reference doc to their pre-alignment state. The hook implementation never changes, so rollback touches only the test and doc side of the contract.
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: shouldFireAdvisor Stays a Distinct Eligibility Stage, Not a Duplicate Threshold Gate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-16 |
| **Deciders** | 011 research packet (iteration 4), ratified in this implementation packet |

---

### Context

P1-6's threshold-surface-parity suite needs to know exactly which surfaces carry the 0.80/0.35 threshold contract, so it does not test a surface that does not actually expose one. `shouldFireAdvisor` looked, on first read, like it might be a second, drifting copy of the same gate, which would have meant P1-6 needed to test it for drift too.

### Constraints

- `shouldFireAdvisor` lives in `prompt-policy.ts:46-100` with its own `SPECKIT_ADVISOR_PROMPT_POLICY_*` config domain, entirely separate from `SCORING_CALIBRATION`'s confidence and uncertainty thresholds.
- Both the hook and MCP dispatch share one threshold resolver (`contract.ts:5-35` to `skill-advisor-brief.ts:112-147` and `advisor-recommend.ts:369-424`), with no numeric drift found between them.

---

### Decision

**We chose**: Treat `shouldFireAdvisor` as an earlier, separate eligibility stage with its own config domain, not as a duplicate of the 0.80/0.35 gate. P1-6's parity suite tests the shared threshold resolver's surfaces only, it does not add a fifth surface for `shouldFireAdvisor`.

**How it works**: A prompt first passes (or fails) the `shouldFireAdvisor` eligibility check, governed by its own prompt-policy config. Only prompts that pass reach the shared threshold resolver that P1-6 actually tests. Conflating the two stages in one parity matrix would test a contract that does not exist, since `shouldFireAdvisor` has no `passes_threshold` output of its own to compare against the resolver's.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Distinct eligibility stage, not tested for threshold drift (chosen)** | Matches the actual separate config domains, keeps P1-6 scoped to the real threshold contract | Does not add drift coverage for `shouldFireAdvisor` itself, though none was found to exist | 8/10 |
| Treat shouldFireAdvisor as a duplicate gate and test it for numeric drift against 0.80/0.35 | Would feel thorough | Encodes a contract that does not exist, `shouldFireAdvisor` has no 0.80/0.35 comparison to drift from | 1/10 |

**Why this one**: Iteration 4 confirmed the shared resolver has no numeric drift and that `shouldFireAdvisor` is architecturally separate. Testing it as a duplicate gate would be testing a fiction.

---

### Consequences

**What improves**:
- P1-6's parity suite stays correctly scoped to the 4 surfaces (env rows) and 2 surfaces (call rows) that actually share the threshold resolver, instead of a 5th surface that would always trivially pass or fail in a way that adds noise, not signal.

**What it costs**:
- If `shouldFireAdvisor`'s own config domain ever drifts internally, this packet's guards would not catch it. Mitigation: out of scope here, `SPECKIT_ADVISOR_PROMPT_POLICY_*` drift is a separate concern from the threshold-surface-parity problem this packet addresses.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future contributor adds a `shouldFireAdvisor` row to P1-6's matrix, misreading it as a missing surface | L | This ADR states the architectural reason explicitly, cited from plan.md's edge-case notes |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | P1-6's suite design depends on knowing exactly which surfaces carry the shared contract |
| 2 | **Beyond Local Maxima?** | PASS | Iteration 4 tested the duplicate-gate hypothesis directly and eliminated it with source evidence |
| 3 | **Sufficient?** | PASS | The config-domain separation fully explains the architecture, no further investigation needed |
| 4 | **Fits Goal?** | PASS | Keeps REQ-006's parity suite correctly scoped |
| 5 | **Open Horizons?** | PASS | Leaves `shouldFireAdvisor`-specific drift coverage as an explicitly named, separate future concern |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**: No code change from this ADR alone, it scopes the P1-6 suite design in T006.

**How to roll back**: Not applicable, this is a scoping decision, not a code change.
<!-- /ANCHOR:adr-008 -->

---

<!--
Level 3 Decision Record: 8 ADRs, one per major decision from research.md Section 5 settled findings
and the Eliminated Alternatives table. ADR-007 stays Proposed until Phase 1 resolves the output
contract choice research deliberately left open.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/shared/references/hvr_rules.md
-->
