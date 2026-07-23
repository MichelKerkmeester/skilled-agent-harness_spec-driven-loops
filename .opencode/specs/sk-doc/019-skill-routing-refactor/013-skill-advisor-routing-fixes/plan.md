---
title: "Implementation Plan: system-skill-advisor Routing Fixes"
description: "Dependency-ordered approach: the three P0 correctness fixes plus P0-4 measurement freshness first, since they unblock trustworthy testing of everything downstream. Then the two preventive guard suites (P1-5, P1-6) and the transport taxonomy repair (P1/P2-7). Finish with the gated P2-8 shadow calibration experiment."
trigger_phrases:
  - "skill advisor routing fixes plan"
  - "advisor fix dependency order"
  - "executor delegation finalization boundary plan"
  - "shadow floor experiment gate plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/013-skill-advisor-routing-fixes"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the eight-phase dependency-ordered implementation plan from research.md Section 8"
    next_safe_action: "Await operator authorization, then start Phase 1 (P0-1 output contract)"
    blockers:
      - "P1-5 (Phase 5) needs joint fixture design with sibling packet 012-sk-doc-routing-fixes before it starts"
    key_files:
      - "plan.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "013-skill-advisor-routing-fixes-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: system-skill-advisor Routing Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`mcp_server/` scorer, handlers, hooks), Node.js (CLI fallback, hook transport), JSON (fixtures, baselines) |
| **Framework** | None. Vitest for every test suite in this packet, run through `npm --prefix .opencode/skills/system-skill-advisor/mcp_server test` |
| **Storage** | Filesystem only: JSON calibration baselines, JSONL routing-accuracy corpora, fixture files. SQLite is read-only here (freshness quick_check, untouched by this packet) |
| **Testing** | `npm --prefix mcp_server test -- --run <file>` against the existing vitest config, plus `shasum -a 256` for baseline hash checks |

### Overview

The fix lands as eight sequential phases. The first four repair correctness and measurement freshness in the routing path itself, since every later phase's testing depends on a hook contract that means one thing, a fallback path that actually recovers, an ambiguity field that agrees with itself, and a calibration baseline that reflects the real corpus. The next three phases add preventive guards so these classes of defect cannot silently reappear: a metadata-hub discovery battery, a threshold-surface-parity suite, and a repaired transport diagnostic taxonomy. The final phase is a single gated shadow calibration experiment that only runs once the joined evaluator exists, and only lands if it clears three pre-registered empirical gates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Research packet `011-skill-advisor-routing-research` is complete with all 10 iterations and a frozen fix plan (confirmed, `research.md` Sections 5-11).
- Operator authorizes implementation start.

### Definition of Done
- All 8 fix-plan items (P0-1 through P2-8, research.md Section 8) land in the dependency order below.
- All 4 verification commands (research.md Section 9) pass.
- The Section 10 acceptance matrix holds for every one of the 7 rows, with P2-8 reporting a strict accept or reject against its three empirical gates.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Correctness-first repair with a freshness gate ahead of any calibration change. Four independent defects (output contract, fallback budget, ambiguity coherence, measurement freshness) get fixed in parallel-safe but sequenced phases, because each one makes the others' verification more trustworthy without structurally depending on the others' code. Two guard suites then convert tribal knowledge about the routing boundary into enforced tests. A single scorer-constant change closes the loop, strictly gated on the freshness repair.

### Key Components
- **Output-contract resolver** (`hooks/claude/user-prompt-submit.ts`): decides and implements whether the no-brief path returns `{}` or the governance fallback directive, propagated into the 4 stale test expectations and the reference doc.
- **Fallback-budget reservation** (`user-prompt-submit.ts`, `skill-advisor-cli-fallback.ts`): splits the hook timeout into a primary slice and a reserved fallback slice instead of handing the fallback whatever remains.
- **Executor-delegation finalization boundary** (`fusion.ts:839-868`, `executor-delegation.ts:411-498`): a single point where the override's rank mutation, `ambiguousWith` attribution and the public `ambiguous` boolean all derive from the same final cluster.
- **Joined calibration evaluator** (`joined-calibration-report.cjs`, proposed name): one script that reconciles the 193-row corpus against both committed baselines and reports holdout top-1, ambiguity accuracy, floor frequency and Brier/ECE reliability bins.
- **Metadata-hub discovery battery** (`metadata-hub-discovery-battery.vitest.ts`, proposed name, coordinated with packet 012): enumerates registry-bearing hubs, one representative prompt plus hard negatives per workflow mode, routed through the real scorer at compat thresholds.
- **Threshold-surface-parity suite** (`advisor-threshold-surface-parity.vitest.ts`): a two-layer matrix, env-override rows across 4 surfaces (MCP dispatch, shared brief, hook entry, CLI fallback args) and call-override rows across 2 surfaces (MCP, shared brief only, since the hook has no threshold input).
- **Transport diagnostic taxonomy** (`skill-advisor-cli-fallback.ts`): splits the single generic failure mode into `mcp_channel_unavailable`, `warm_daemon_unavailable`, `probe_timeout` and `cli_timeout`, each stating whether it is CLI-recoverable.
- **Shadow floor experiment** (`shadow-floor-experiment.cjs`, proposed name, gated): flips `taskIntentFloor` from 0.82 to 0.80 behind an experiment path and runs the joined evaluator against the three acceptance gates.

### Data Flow
The advisor's four-layer MCP path (`advisor-server.ts` to `dispatchTool` to `handleAdvisorRecommend` to `scoreAdvisorPrompt`) and the Claude hook's native-local-first, warm-daemon-CLI-second transport stay structurally unchanged. This packet repairs specific junctions in that flow: the hook's no-brief output boundary (P0-1), the timeout split feeding the CLI fallback (P0-2), the point where `executor-delegation.ts` mutates the scorer's fused ranking before `fusion.ts` derives public ambiguity fields (P0-3), and the offline evaluation path that reads the corpus and both baselines (P0-4). P1-5 and P1-6 add new read-only observers of the existing flow, they do not change it. P2-8 changes exactly one constant read by the confidence-floor calculation, behind a flag that defaults off.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `hooks/claude/user-prompt-submit.ts` | Existing: builds the no-brief output, times the primary producer | Update: resolve output contract, reserve fallback budget | `claude-user-prompt-submit-hook.vitest.ts`, `skill-advisor-cli-fallback-envelope.vitest.ts` |
| `hooks/lib/skill-advisor-cli-fallback.ts` | Existing: warm-only CLI fallback client | Update: accept reserved timeout slice, split diagnostic codes | `skill-advisor-cli-fallback-envelope.vitest.ts` |
| `lib/scorer/fusion.ts` | Existing: derives public ambiguity fields | Update: single finalization boundary at lines 839-868 | `executor-delegation.vitest.ts --reporter=verbose` |
| `lib/scorer/executor-delegation.ts` | Existing: mutates fused ranking on executor override | Update: cover the existing-candidate branch (470-477) | `executor-delegation.vitest.ts --reporter=verbose` |
| `bench/scorer-calibration-baseline.json`, `scripts/routing-accuracy/scorer-eval-baseline.json` | Existing: stale committed baselines | Update: regenerate against the clean 193-row corpus | `shasum -a 256`, `scorer-eval-baseline-ratchet.vitest.ts` |
| `parent-skill-check.cjs` | Existing: registry-router key equality, first-layer existence | Update: fail on a metadata-routed mode without a discovery fixture | New metadata-hub battery suite |
| `references/hooks/skill_advisor_hook.md`, manual playbook | Existing: mixed authored-source vs executed-dist ownership | Update: state the resolved contract and the diagnostic taxonomy | Manual review, no scripted gate |
| `lib/scorer/scoring-constants.ts` | Existing: `taskIntentFloor` at 0.82 | Update (gated): experiment path to 0.80 | `shadow-floor-experiment.cjs` against the three gates |

Required inventories:
- Same-class producers: `rg -n "ambiguousWith|result.ambiguous" .opencode/skills/system-skill-advisor/mcp_server/lib/scorer` to confirm every place that reads or writes the ambiguity fields before the finalization-boundary fix lands.
- Consumers of changed symbols: `rg -n "taskIntentFloor|no-brief|buildSkillAdvisorBrief|hookTimeout" . --glob '*.ts' --glob '*.js' --glob '*.cjs' --glob '*.md'`.
- Matrix axes: research.md Section 10's 7 acceptance-matrix rows (P0-1 through P2-8), plus P1-6's own 4-surface env-row by 2-surface call-row matrix.
- Algorithm invariant: `result.ambiguous` always equals `top.ambiguousWith.length > 0` on the final, post-override cluster. No code path derives one from a pre-override snapshot and the other from a post-override snapshot.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Output-Contract Reconciliation (P0-1)
- [ ] No-brief output contract decided (`{}` vs governance fallback directive), per decision-record.md ADR-007
- [ ] `hooks/claude/user-prompt-submit.ts:228-245` aligned with the decision
- [ ] `claude-user-prompt-submit-hook.vitest.ts:143-178` updated, all 11 hook tests green
- [ ] `references/hooks/skill_advisor_hook.md` states the resolved contract

### Phase 2: Fallback-Budget Reservation (P0-2)
- [ ] `hooks/claude/user-prompt-submit.ts` passes `hookBudget - fallbackReserve` as the primary `subprocessTimeoutMs`
- [ ] `skill-advisor-cli-fallback-envelope.vitest.ts` added: primary-timeout to fallback-success, probe-timeout within total budget, `skipped` to no CLI, daemon-absent to exit 75

### Phase 3: Executor-Delegation Coherence (P0-3)
- [ ] Stale `suppressed-codex-abstain` fixture replaced with a genuinely retired executor alias
- [ ] Existing-candidate branch (`executor-delegation.ts:470-477`) covered with branch-provenance assertions
- [ ] Single finalization boundary added in `fusion.ts` (move the override before finalization, or add an explicit finalizer at lines 839-868)
- [ ] Regression assertion `result.ambiguous === (top.ambiguousWith.length > 0)` passes on every fixture

### Phase 4: Calibration Measurement Freshness (P0-4)
- [ ] `bench/scorer-calibration-baseline.json` and `scripts/routing-accuracy/scorer-eval-baseline.json` regenerated against the clean 193-row corpus
- [ ] One joined evaluator report added: holdout top-1, ambiguity accuracy, floor frequency, Brier/ECE reliability bins
- [ ] `scorer-eval-baseline-ratchet.vitest.ts` hash-equality assertions pass
- [ ] No scorer weight, floor or margin change in this phase, measurement repair only

### Phase 5: Metadata-Hub Discovery Battery (P1-5, coordinated with packet 012)
- [ ] Fixture format and location confirmed jointly with sibling packet `012-sk-doc-routing-fixes` before any fixture file is written
- [ ] New suite enumerates registry-bearing hubs, one representative prompt plus hard negatives per workflow mode
- [ ] Fixtures route the hub identity at compat thresholds through the real scorer
- [ ] `parent-skill-check.cjs` extended to fail when a metadata-routed mode lacks a fixture
- [ ] The 113 sk-doc aliases stay unmirrored into `graph-metadata.json`

### Phase 6: Threshold-Surface-Parity Suite (P1-6)
- [ ] `advisor-threshold-surface-parity.vitest.ts` added: env-override rows (after `vi.resetModules()`) across MCP dispatch, shared brief, Claude hook entry, CLI fallback args
- [ ] Call-override rows added across MCP and shared brief only, no hook call-override row (the hook exposes no threshold input)
- [ ] Mislabeled `runtime-parity.vitest.ts` (`['claude','opencode','opencode']`) absorbed or renamed

### Phase 7: Transport Taxonomy and Docs (P1/P2-7)
- [ ] `mcp_channel_unavailable`, `warm_daemon_unavailable`, `probe_timeout`, `cli_timeout` split as distinct diagnostic codes
- [ ] Each diagnostic code states whether it is CLI-recoverable
- [ ] `references/hooks/skill_advisor_hook.md` and the manual playbook corrected: authored-source vs build-owner vs executed-dist ownership
- [ ] A dist-freshness assertion added

### Phase 8: Shadow Calibration Experiment (P2-8, gated on Phase 4)
- [ ] Public thresholds (confidence 0.80, uncertainty 0.35, ambiguity margins 0.05) confirmed unchanged
- [ ] `taskIntentFloor` 0.82 to 0.80 run behind the experiment path, single candidate only
- [ ] Joined evaluator run against the candidate: accept only if holdout at or above 57/78, coverage at or above 61/78, ambiguity slice at or above 16/25
- [ ] Result recorded as strict accept or reject, no gate relaxation

### Phase 9: Verification
- [ ] All 4 Section 9 verification commands pass in order
- [ ] Section 10 acceptance matrix confirmed for all 7 rows
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/Contract | Hook output contract, fallback budget timing | `npm --prefix mcp_server test -- --run tests/hooks/*` |
| Scorer parity | Executor-delegation coherence, both override branches | `npm --prefix mcp_server test -- --run tests/scorer/executor-delegation.vitest.ts --reporter=verbose` |
| Baseline integrity | Calibration hash equality against the clean corpus | `shasum -a 256`, `npm --prefix mcp_server test -- --run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` |
| Discovery battery | Per-workflow-mode fixture routing at compat thresholds | New vitest suite, `parent-skill-check.cjs` |
| Threshold parity | 4-surface env-row and 2-surface call-row matrix | New vitest suite under `tests/parity/` |
| Transport | Warm-only CLI fallback exit codes and diagnostic taxonomy | `node .opencode/bin/skill-advisor.cjs advisor_recommend --warm-only` |
| Shadow experiment | Three-gate accept or reject on the single P2-8 candidate | `shadow-floor-experiment.cjs` against the joined evaluator |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Research packet `011-skill-advisor-routing-research` | Internal | Complete | This packet's fix plan is sourced directly from it. No blocking risk expected |
| Sibling packet `012-sk-doc-routing-fixes` | Internal | Planned | Phase 5 (P1-5) needs joint fixture design before it starts. Do not write fixtures unilaterally |
| Joined calibration evaluator (Phase 4 output) | Internal | Not started | Phase 8 (P2-8) cannot run without it. Nothing downstream of Phase 4 can claim calibration-based done status |
| `better-sqlite3` native module health | External | Unknown | If the ABI mismatch from the research session persists, Phase 3's live verification runs in filesystem-projection fallback mode. Confirm before claiming REQ-003 done |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any Section 9 verification command regresses an already-green suite, or the Phase 8 shadow experiment produces an ambiguous or ties-broken-by-judgment result instead of a strict accept or reject.
- **Procedure**: Revert the implementation commits for the affected phase in dependency order, starting from the latest phase back toward Phase 1. Phase 8 is the only phase that can revert alone with zero downstream impact, since it changes one constant behind a flag that defaults off. Phases 1 through 4 touch shared hook and scorer code, so reverting one requires re-running Phase 9's verification gate to confirm no later phase depended on the reverted change.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Output Contract) ──┐
Phase 2 (Fallback Budget)  ──┤
Phase 3 (Executor Coherence) ┼──► Phase 4 (Calibration Freshness) ──► Phase 8 (Shadow Experiment)
                              │                                              ▲
                              └──► Phase 5 (Discovery Battery) ──┐           │
                                   Phase 6 (Threshold Parity)   ─┼──► Phase 7 (Transport Taxonomy) ──► Phase 9 (Verification)
                                                                 ┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Output Contract | None | 9 |
| 2 Fallback Budget | None | 9 |
| 3 Executor Coherence | None | 9 |
| 4 Calibration Freshness | None | 8 |
| 5 Discovery Battery | Coordination with packet 012 | 9 |
| 6 Threshold Parity | 1, 2 (reads the resolved contract and budget shape) | 9 |
| 7 Transport Taxonomy | 2 (reads the reserved-budget fallback path) | 9 |
| 8 Shadow Experiment | 4 | 9 |
| 9 Verification | 1, 2, 3, 4, 5, 6, 7, 8 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| 1 Output Contract | Low | 1 session |
| 2 Fallback Budget | Medium | 1 session |
| 3 Executor Coherence | High | 1-2 sessions |
| 4 Calibration Freshness | Medium | 1-2 sessions |
| 5 Discovery Battery | Medium | 1-2 sessions, plus coordination time with packet 012 |
| 6 Threshold Parity | Medium | 1 session |
| 7 Transport Taxonomy | Low | 1 session |
| 8 Shadow Experiment | Low | 1 session, strictly gated |
| 9 Verification | Low | 1 session |
| **Total** | | **9-11 sessions** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All 4 Section 9 verification commands pass before any phase claims done status
- [ ] Regenerated calibration baseline hashes recorded for the pre-fix and post-fix state
- [ ] Phase 8's shadow experiment only runs after Phase 4's joined evaluator is confirmed working on the current baselines

### Rollback Procedure
1. Identify the failing phase from the Phase 9 verification output.
2. Revert that phase's commits, then re-run its own test file (Section 5).
3. Re-run the full 4-command verification suite to confirm no downstream phase depended on the reverted change.
4. If Phase 8 is the failing phase, simply flip the experiment flag off. No other phase needs to revert.

### Data Reversal
- **Has data migrations?** Yes, the two calibration baseline JSON files get regenerated in Phase 4.
- **Reversal procedure**: Git revert restores the prior baseline files directly, since regeneration is a full rewrite, not an incremental patch. Re-run `scorer-eval-baseline-ratchet.vitest.ts` after reverting to confirm the hash-equality assertions match the restored baseline state.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Phase 1   │  │   Phase 2   │  │   Phase 3   │  │   Phase 4   │
│   Contract  │  │   Budget    │  │  Executor   │  │ Calibration │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │                │
       │                └───────┬────────┘                ▼
       │                        │                   ┌─────────────┐
       │                        │                   │   Phase 8   │
       │                        │                   │   Shadow    │
       │                        │                   └──────┬──────┘
       ▼                        ▼                          │
┌─────────────┐          ┌─────────────┐                   │
│   Phase 6   │          │   Phase 7   │                   │
│  Threshold  │          │  Transport  │                   │
└──────┬──────┘          └──────┬──────┘                   │
       │                        │                          │
       │      ┌─────────────┐   │                          │
       └─────►│   Phase 5   │◄──┘                          │
              │  Discovery  │                               │
              └──────┬──────┘                               │
                     │                                       │
                     ▼                                       ▼
              ┌───────────────────────────────────────────────┐
              │                    Phase 9                    │
              │                  Verification                 │
              └─────────────────────────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Output contract | None | Resolved hook contract | Threshold parity |
| Fallback budget | None | Reserved timeout slice | Threshold parity, Transport taxonomy |
| Executor coherence | None | Finalization boundary | Verification |
| Calibration freshness | None | Joined evaluator, fresh baselines | Shadow experiment |
| Discovery battery | Coordination with 012 | Per-mode fixtures, guard code | Verification |
| Threshold parity | Output contract, Fallback budget | Parity suite | Verification |
| Transport taxonomy | Fallback budget | Diagnostic taxonomy, doc repair | Verification |
| Shadow experiment | Calibration freshness | Accept/reject decision | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 4: Calibration Freshness** - 1-2 sessions - CRITICAL (gates Phase 8)
2. **Phase 8: Shadow Experiment** - 1 session - CRITICAL
3. **Phase 3: Executor Coherence** - 1-2 sessions - CRITICAL (highest-risk fix, R-001)
4. **Phase 5: Discovery Battery** - 1-2 sessions plus coordination time - CRITICAL (external dependency on packet 012)
5. **Phase 9: Verification** - 1 session - CRITICAL

**Total Critical Path**: 5-8 sessions, plus whatever coordination time packet 012 needs for Phase 5

**Parallel Opportunities**:
- Phases 1, 2 and 3 touch different files (hook contract, fallback timing, scorer finalization) and can run concurrently once the operator authorizes implementation.
- Phase 7 can start as soon as Phase 2 lands, in parallel with Phases 3-6, since it only reads the reserved-budget fallback shape.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | Correctness restored | Phases 1-3 complete, all 11 hook tests green, executor suite coherent | After Phase 3 |
| M2 | Measurement trustworthy | Phase 4 complete, joined evaluator produces reliability bins against the clean corpus | After Phase 4 |
| M3 | Boundary guarded and calibration decided | Phases 5-8 complete, discovery battery enforced, shadow experiment reports a strict verdict | After Phase 8 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm operator authorization to start Phase 1 (currently blocked, per T000 in tasks.md)
- [ ] Read decision-record.md ADR-007 before touching the hook's no-brief output contract
- [ ] Confirm the prior phase's own Section 5 test command passed before starting the next phase

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Phases execute in the Section 4 dependency-graph order. Phase 8 never starts before Phase 4's joined evaluator lands |
| TASK-SCOPE | Each phase touches only the files listed in its Section 4 checklist and the Files to Change table in spec.md |
| TASK-VERIFY | Each phase's own Section 5 test command runs before the next phase starts |

### Status Reporting Format
Report phase status as `Phase N: <name> - <PASS/FAIL> - <command output summary>` after each phase's test run, matching the Section 9 verification command list in research.md.

### Blocked Task Protocol
A BLOCKED phase records the blocking phase or external dependency, the specific test that fails, and the resumption condition. T005 (P1-5) and T008 (P2-8) are the current BLOCKED tasks in tasks.md, gated on packet-012 fixture coordination and Phase 4 output respectively.
<!-- /ANCHOR:ai-protocol -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the eight settled design decisions (confidence as quantized policy not raw RRF score, frozen public thresholds with gated floor calibration only, single finalization boundary for executor-delegation ambiguity, warm-only CLI fallback as alternate client not daemon recovery, two-stage hub discovery guarded by behavioral fixtures, measurement freshness required before any tuning, shouldFireAdvisor as a distinct eligibility stage, and the no-brief output contract decision) plus the eliminated alternatives from research.md's Eliminated Alternatives table.
