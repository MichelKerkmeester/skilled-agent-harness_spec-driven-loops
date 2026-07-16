---
title: "Feature Specification: system-skill-advisor Routing Fixes"
description: "Fix the three confirmed correctness defects in the skill advisor's routing path (hook output-contract drift, CLI fallback budget starvation, executor-delegation ambiguity incoherence), repair stale calibration measurement, then add two preventive guard suites and a gated shadow floor-calibration experiment, following the dependency-ordered plan from the 011 deep-research synthesis."
trigger_phrases:
  - "skill advisor routing fixes implementation"
  - "advisor output contract fallback budget fix"
  - "executor delegation ambiguity coherence fix"
  - "shadow floor calibration experiment"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/013-skill-advisor-routing-fixes"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored Level 3 scaffold (spec/plan/tasks/checklist/decision-record) from 011 research"
    next_safe_action: "Start Phase 1 P0-1: align hook tests and reference doc to the accepted directive"
    blockers:
      - "Implementation start awaits explicit operator authorization"
      - "P1-5 metadata-hub discovery battery: fixture ownership RESOLVED, packet 012 owns the canonical typed-gold fixtures under the sk-doc tree, this packet consumes read-only"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "013-skill-advisor-routing-fixes-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the no-brief output contract resolve to `{}` or the governance fallback directive (P0-1)?"
      - "Does the shadow taskIntentFloor 0.82 -> 0.80 candidate clear all three empirical gates once P0-4's joined evaluator exists?"
      - "Should a retired-executor alias stay part of the supported metadata contract for the replacement abstain fixture?"
    answered_questions:
      - "Public confidence is a quantized policy function over liveNormalized, not the raw RRF fusion score (fusion.ts:381-429)"
      - "The threshold grid over confidence and uncertainty produced identical holdout outcomes, so external threshold tuning is a proven dead end"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: system-skill-advisor Routing Fixes

---

## EXECUTIVE SUMMARY

The system-skill-advisor routes 73.08 percent of holdout prompts correctly, but its public confidence number is dominated by categorical policy floors rather than an ordinal probability. Layered on top of that calibration-legibility gap sit three confirmed correctness defects in the routing path itself. The 011 research packet traced all of it to file:line evidence across a 10-iteration deep-research loop and produced a dependency-ordered fix plan. This packet turns that plan into an implementation-ready scaffold.

**Key Decisions**: Land the three P0 correctness fixes plus the P0-4 measurement-freshness repair first, since they unblock trustworthy testing of everything downstream. Freeze the public confidence, uncertainty and ambiguity thresholds, and pursue floor calibration only through a single gated shadow experiment (P2-8).

**Critical Dependencies**: P0-4's joined calibration evaluator gates P2-8 outright. P1-5's metadata-hub discovery battery is a shared boundary with sibling packet 012-sk-doc-routing-fixes and needs joint fixture design.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-16 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/031-sk-doc-router-alignment` |
| **Parent Spec** | ../spec.md |
| **Research Source** | `../011-skill-advisor-routing-research/research/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The advisor's current-source holdout accuracy is 73.08 percent (57/78) with 85.25 percent selective precision, so it routes correctly far more often than not. But the confidence number that CLAUDE.md Gate 2 treats as a "must-invoke at >=0.8" signal is dominated by categorical policy floors: exactly 0.82 was the leading confidence on 31 percent of the full corpus and 48 percent of the frozen ambiguity slice, with plateau correctness of only 58 to 65 percent in that band. Confidence at or above 0.8 does not mean 80 percent correct, it means a floor fired.

Three confirmed correctness defects sit underneath that calibration problem. The Claude hook's no-brief output contract has drifted, so 4 of 11 targeted hook tests are red because the implementation now emits a governance directive where the tests expect `{}`. The CLI fallback can be starved to 1 ms, because the primary producer receives the whole 2500 ms hook budget and the fallback only gets whatever remains, defeating the recovery path exactly when the primary times out. Result-level `ambiguous: true` coexists with an unattributed leader, because the executor-delegation override mutates rankings after `ambiguousWith` attribution but before the final ambiguity boolean, reproducing on 7 of 8 frozen positive executor routes plus one stale Codex fixture that fails outright.

A fourth blocker sits under all of it: both committed calibration baselines are stale against the clean 193-row corpus, so any threshold or scorer change made today would be tuned against measurements nobody can trust.

### Purpose

Repair the three P0 correctness defects and the P0-4 measurement freshness gap first, since together they unblock trustworthy testing of everything else. Then add the two preventive guard suites (P1-5, P1-6) plus the transport diagnostic taxonomy and doc repair (P1/P2-7). Finish with a single gated shadow calibration experiment (P2-8) that only lands if it clears three pre-registered empirical gates.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **P0-1 Output-contract reconciliation.** Decide whether the no-brief path returns `{}` or the governance fallback directive, then align the hook, the 4 stale test expectations and the hook reference doc.
- **P0-2 Fallback-budget reservation.** Reserve a fallback slice out of the hook timeout instead of handing the primary the whole budget, and add timing tests for the primary-timeout, probe-timeout, skipped and daemon-absent cases.
- **P0-3 Executor-delegation coherence.** Fix the stale `suppressed-codex-abstain` fixture, add coverage for the never-exercised existing-candidate branch, and enforce one finalization boundary so `result.ambiguous` derives from the same final cluster as `ambiguousWith`.
- **P0-4 Calibration measurement freshness.** Reconcile the 193-row corpus with both committed baselines and produce one joined evaluator report with holdout top-1, ambiguity accuracy, floor frequency and Brier/ECE reliability bins. Measurement repair only, no scorer changes here.
- **P1-5 Metadata-hub advisor-discovery battery.** A new suite enumerating registry-bearing hubs, with one representative prompt plus hard negatives per workflow mode, routing at compat thresholds through the real scorer. Extends `parent-skill-check.cjs` to fail when a metadata-routed mode lacks a fixture. **This is the same shared boundary as sk-doc's "unguarded advisor-discovery boundary" finding in sibling packet `012-sk-doc-routing-fixes`.** The research packet names it from the advisor side, an unguarded routing-registry-drift-guard boundary for metadata-routed hubs. The sk-doc packet names it from the hub side, hub discoverability fixtures. Both point at the same missing artifact: behavioral discovery fixtures per sk-doc workflow mode, checked from both the advisor test suite and `parent-skill-check.cjs`. Ownership is settled: packet 012 owns the single canonical typed-gold fixture set under the sk-doc tree, defined in its early Layer-A phase. Phase 5 of this packet's plan builds the P1-5 battery on top of those fixtures, read-only.
- **P1-6 Threshold-surface-parity suite.** A two-layer matrix across MCP dispatch, shared brief, Claude hook entry and CLI fallback args (env rows), plus MCP and shared brief only (call-override rows, since the hook exposes no threshold input). Also absorbs or renames the mislabeled `runtime-parity.vitest.ts`.
- **P1/P2-7 Transport diagnostic taxonomy and docs.** Split `mcp_channel_unavailable`, `warm_daemon_unavailable`, `probe_timeout` and `cli_timeout`, state which are CLI-recoverable, and fix the stale/mixed ownership paths in `references/hooks/skill_advisor_hook.md` and the manual playbook.
- **P2-8 Shadow calibration experiment, gated on P0-4.** Public thresholds stay unchanged. Single candidate: `SCORING_CALIBRATION.confidence.taskIntentFloor` 0.82 to 0.80, accepted only if holdout stays at or above 57/78, coverage at or above 61/78 and ambiguity slice at or above 16/25.

### Out of Scope

- Any scorer weight, floor or margin change outside the single P2-8 `taskIntentFloor` candidate. The iteration-8 threshold grid over confidence and uncertainty produced identical holdout outcomes, proving external tuning is a dead end for the rest of the surface.
- Public threshold changes to confidence 0.80, uncertainty 0.35 or the 0.05 ambiguity margins. Frozen per decision-record.md ADR-002. Raising confidence to 0.84 alone dropped holdout coverage 24.36 points for 2.85 points of precision in the iteration-8 grid, so this door stays closed.
- Replacing evidence-string counting with independence-aware uncertainty. Research names this a longer-term follow-up beyond P2-8, not part of this packet.
- Mirroring the 113 sk-doc hub aliases into `graph-metadata.json`. Eliminated alternative: it duplicates registry-owned vocabulary, inflates lexical evidence and is the wrong invariant for two-stage routing.
- Any change to `hub-router.json` in `cli-external-orchestration`. The revived `cli-codex` alias there is legitimate. The stale artifact is the parity test fixture, not the hub router.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/hooks/claude/user-prompt-submit.ts` | Modify | Resolve the no-brief output contract (P0-1) and reserve fallback budget out of the hook timeout (P0-2) |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modify | Align the 4 stale expectations with the resolved output contract |
| `.opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md` | Modify | Document the resolved contract and the corrected transport diagnostic taxonomy |
| `.opencode/skills/system-skill-advisor/mcp_server/hooks/lib/skill-advisor-cli-fallback.ts` | Modify | Accept a reserved timeout slice, split diagnostic codes (P1/P2-7) |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` | Create | Timing tests: primary-timeout to fallback-success, probe-timeout within budget, skipped, daemon-absent exit 75 |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts` | Modify | Cover the never-exercised existing-candidate branch (lines 470-477), assert branch provenance |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modify | Single finalization boundary so `result.ambiguous` derives from the post-override cluster (lines 839-868) |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/executor-delegation-cases.json` | Modify | Replace the stale `suppressed-codex-abstain` fixture with a genuinely retired executor alias |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/executor-delegation.vitest.ts` | Modify | Assert `result.ambiguous === (top.ambiguousWith.length > 0)` on every fixture |
| `.opencode/skills/system-skill-advisor/mcp_server/bench/scorer-calibration-baseline.json` | Modify | Regenerate against the clean 193-row corpus |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json` | Modify | Regenerate against the clean 193-row corpus |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/joined-calibration-report.cjs` | Create (proposed name) | One joined evaluator: holdout top-1, ambiguity accuracy, floor frequency, Brier/ECE bins |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | Modify | Restore hash-equality assertions against the regenerated baselines |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/metadata-hub-discovery-battery.vitest.ts` | Create (proposed name, coordinated with 012) | Per-workflow-mode fixture routing at compat thresholds through the real scorer |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Modify | Fail when a metadata-routed mode lacks a discovery fixture |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/advisor-threshold-surface-parity.vitest.ts` | Create | Two-layer matrix: 4 env-row surfaces, 2 call-override-row surfaces |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/runtime-parity.vitest.ts` | Modify | Absorb or rename the mislabeled `['claude','opencode','opencode']` test |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts` | Modify (P2-8, gated) | `taskIntentFloor` 0.82 to 0.80 behind the shadow-experiment path |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/shadow-floor-experiment.cjs` | Create (proposed name, gated) | Runs the three-gate acceptance check and reports accept or reject |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reconcile the no-brief output contract across the hook, tests and reference doc | 11/11 hook tests green, and `skill_advisor_hook.md` states the chosen contract |
| REQ-002 | Reserve fallback budget out of the hook timeout and add live handoff timing tests | Primary-timeout to fallback-success test passes within the total hook budget |
| REQ-003 | Repair executor-delegation coherence: fixture, branch coverage, single finalization boundary | Executor suite green, `result.ambiguous` coherent with `ambiguousWith` on every fixture, both override branches covered |
| REQ-004 | Repair calibration measurement freshness with a joined evaluator | Ratchet hash-equality assertions pass, and the joined report includes Brier/ECE reliability bins |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Build the metadata-hub advisor-discovery battery, coordinated with packet 012 | Every sk-doc workflow mode has a passing discovery fixture, and `parent-skill-check.cjs` fails on a missing one |
| REQ-006 | Build the advisor-threshold-surface-parity suite | Parity suite green across the 4 env-row surfaces and the 2 call-override-row surfaces |
| REQ-007 | Split the transport diagnostic taxonomy and repair stale doc ownership paths | Each diagnostic code states its CLI-recoverability, and `skill_advisor_hook.md` matches the authored-source-vs-executed-dist reality |

### P2 - Gated (complete only if P0-4 lands and the three empirical gates pass)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Run the shadow `taskIntentFloor` 0.82 to 0.80 experiment | Accepted only if holdout stays at or above 57/78, coverage at or above 61/78, ambiguity slice at or above 16/25. Any other outcome rejects the candidate and keeps 0.82 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four Section 9 verification commands from research.md pass, including the executor suite in verbose mode.
- **SC-002**: The joined calibration report exists and is reproducible, with reliability bins that make the 0.82 floor's plateau correctness legible to any reader of `SCORING_CALIBRATION`.
- **SC-003**: Every sk-doc workflow mode routes correctly on its representative discovery fixture, and `parent-skill-check.cjs` fails closed on a missing one.
- **SC-004**: The P2-8 shadow experiment reports a strict accept or reject against the three pre-registered gates, with no post-hoc gate relaxation.
- **SC-005**: Sibling packet 012's hub-discoverability fixture plan and this packet's P1-5 battery share one fixture format and location. Ownership is settled: 012 owns the canonical typed-gold fixtures under the sk-doc tree, this packet's P1-5 battery and `parent-skill-check.cjs` consume them read-only.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | P0-4 joined calibration evaluator | P2-8 cannot run without it. Every later phase's calibration claims stay unverifiable | Land P0-4 before starting P2-8, gate the phase in plan.md explicitly |
| Dependency | Sibling packet 012-sk-doc-routing-fixes | P1-5 builds on 012's canonical typed-gold fixture set. If 012's Layer-A fixture work slips, Phase 5 has nothing to build on top of | Sequence Phase 5 after 012's early Layer-A fixture phase lands; ownership is already settled (012 owns, this packet consumes read-only) |
| Risk | RESOLVED: the no-brief output contract (P0-1) is now Accepted (ADR-007), adopting the governance fallback directive | None remaining, the risk was picking the wrong default before the consumer check ran | Decision recorded in decision-record.md ADR-007, Phase 1 aligns the 4 stale tests and the reference doc to it |
| Risk | The Spec Kit Memory daemon was unhealthy for the whole research session (exit 75 warm-only timeouts) | Live transport-lane evidence for P1/P2-7 is thinner than the source-loaded scorer evidence | Treat transport findings as directional, verify the diagnostic taxonomy split against source, not against a live daemon session |
| Risk | A `better-sqlite3` Node ABI mismatch forced the executor-delegation test into filesystem-projection fallback during research | The red-fixture failure is consistent with checked-in metadata, but P0-3's live-run confirmation still needs a working native module | Confirm the ABI issue is resolved, or re-run P0-3's verification command in filesystem-projection mode explicitly, before claiming REQ-003 done |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The reserved fallback slice (P0-2) keeps the total hook path inside the existing 2500 ms budget. No new p95 target is introduced, the fix redistributes an existing budget rather than growing it.

### Security
- **NFR-S01**: The HMAC prompt cache keying and SQLite integrity quick_check stay untouched by every fix in this packet. Freshness failure stays fail-open exactly as today: `absent`/`unavailable` return empty recommendations with warnings, `stale` degrades only the `graph_causal` lane.

### Reliability
- **NFR-R01**: The executor-delegation finalization boundary (P0-3) is the single source of truth for `result.ambiguous`. No caller-side re-derivation of ambiguity from `ambiguousWith` survives this packet, so the two fields cannot drift again through a different code path.

---

## 8. EDGE CASES

### Data Boundaries
- Env-var threshold overrides freeze at module load (constants), while call-level overrides stay dynamic. P1-6's parity suite must call `vi.resetModules()` before every env-row assertion or it tests a stale module snapshot, not a live one.
- The 0.82 floor saturates 31.09 percent of the full corpus, 25.64 percent of the holdout slice and 48.00 percent of the frozen ambiguity slice. P0-4's reliability bins need enough rows per bucket to be meaningful, not just a headline percentage.

### Error Scenarios
- A fixture referencing a retired executor alias that the hub router no longer suppresses reproduces the P0-3 defect exactly. The fix must not special-case that one alias, it must fix the finalization boundary so any future alias retirement stays coherent.
- Daemon-absent CLI fallback returns exit 75 (retryable). P0-2's timing tests must assert that path explicitly, not just infer it from the primary-timeout case.

### State Transitions
- `shouldFireAdvisor` is an eligibility gate with its own `SPECKIT_ADVISOR_PROMPT_POLICY_*` config domain, not a duplicate of the 0.80/0.35 threshold gate. P1-6 must not attempt to converge the two into one surface, that would encode a contract that does not exist.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: ~19 across hook contract, fallback timing, scorer finalization, calibration baselines, two new guard suites, transport taxonomy and a gated scorer constant. Systems: MCP advisor server, Claude hook transport, RRF scorer, calibration tooling |
| Risk | 14/25 | No auth or public API surface change, but a wrong finalization boundary in the scorer or a wrong output-contract default breaks routing signal for every downstream consumer of Gate 2 |
| Research | 6/20 | Root cause, design options and the fix plan are already settled by the 10-iteration 011 research packet. Remaining work is implementation and the P0-1 contract decision, not open investigation |
| Multi-Agent | 5/15 | Single implementer per dependency-ordered phase. P1-5 needs a coordination touchpoint with the sibling 012 packet, not a parallel workstream |
| Coordination | 9/15 | Eight sequential fix-plan phases, one of which (P1-5) gates on joint fixture design with sibling packet 012 |
| **Total** | **52/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The finalization-boundary fix in `fusion.ts` introduces a new mutation-order bug while fixing the old one | H | L | Assert the coherence invariant (`result.ambiguous === (top.ambiguousWith.length > 0)`) on every fixture, not just the previously-red ones |
| R-002 | The P0-1 output-contract decision picks the option that breaks an undiscovered downstream consumer | M | M | Grep every consumer of the hook's brief output before finalizing the choice, per ADR-007's decision criteria |
| R-003 | P1-5's fixture design diverges from packet 012's before the two packets sync | M | M | Treat Phase 5 kickoff as a hard coordination gate, not a soft note, before either packet writes fixture files |
| R-004 | The P2-8 shadow experiment's three gates get relaxed after a near-miss result | M | L | State the exact accept thresholds in this spec and in decision-record.md before the experiment runs, and require operator sign-off to change them |

---

## 11. USER STORIES

### US-001: Trustworthy routing signal (Priority: P0)

**As a** downstream Gate 2 consumer reading the advisor's confidence, **I want** the hook contract, fallback recovery and executor-ambiguity fields to behave coherently, **so that** a >=0.8 confidence and a passing test suite mean the routing path actually works, not just that the tests were relaxed to match a drifted implementation.

**Acceptance Criteria**:
1. Given the hook receives a skip-eligible prompt, When it builds the no-brief output, Then all 11 targeted hook tests pass against the single resolved contract.
2. Given the primary hook producer times out, When the CLI fallback takes over, Then it completes within the reserved budget slice, not a 1 ms remainder.
3. Given an executor-delegation override resolves a single candidate, When the result serializes, Then `result.ambiguous` matches the final `ambiguousWith` state on every fixture in the parity suite.

### US-002: Guarded metadata-hub discovery boundary (Priority: P1)

**As a** maintainer of a metadata-routed hub like sk-doc, **I want** a behavioral discovery fixture per workflow mode enforced by both the advisor test suite and `parent-skill-check.cjs`, **so that** hub-internal vocabulary alignment and advisor-level discoverability cannot silently diverge again.

**Acceptance Criteria**:
1. Given a new sk-doc workflow mode ships without a discovery fixture, When `parent-skill-check.cjs` runs, Then it fails closed instead of passing silently.
2. Given the shared boundary with packet 012, When both packets reference the fixture set, Then they point at the same file location and format.

---

## 12. OPEN QUESTIONS

- RESOLVED (ADR-007, Accepted): the no-brief output contract adopts the governance fallback directive, since it already reaches production on every prompt today. Phase 1 aligns the 4 stale hook tests and the reference doc, the implementation stays as-is.
- Can a natural production prompt reach the executor-delegation existing-candidate branch, or does the fixture need to seed the projection?
- Should a retired-executor alias remain part of the supported metadata contract for the replacement abstain fixture?
- Is env-override freezing at module load acceptable for long-lived daemon processes, or should threshold resolution become read-per-call?
- RESOLVED: packet 012 owns the canonical typed-gold discovery-fixture set under the sk-doc tree, defined in its early Layer-A phase. This packet's P1-5 battery and `parent-skill-check.cjs` consume it read-only.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research Source**: `../011-skill-advisor-routing-research/research/research.md`
- **Sibling Fix Packet (shared P1-5 boundary)**: `../012-sk-doc-routing-fixes/spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
