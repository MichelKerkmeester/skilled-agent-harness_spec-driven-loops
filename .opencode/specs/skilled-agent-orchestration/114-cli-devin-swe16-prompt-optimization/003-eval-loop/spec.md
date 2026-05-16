---
title: "Feature Specification: Eval Loop for cli-devin SWE 1.6 Optimization"
description: "Run the bespoke deep-loop: council-seeded hill-climbing across prompt variants, real SWE 1.6 dispatches per fixture, deterministic + grader scoring, 3-signal weighted-vote convergence. Depends on 002 rig green. Produces synthesis.md ranking variants for 004 to apply."
trigger_phrases:
  - "114/003 eval loop"
  - "cli-devin deep loop"
  - "swe 1.6 iteration run"
  - "hill-climbing convergence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-cli-devin-swe16-prompt-optimization/003-eval-loop"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded eval-loop spec"
    next_safe_action: "Read council-report.md + verify 002 dry-run green; start iter-001"
    blockers:
      - "Depends on 001 council-report.md ratified"
      - "Depends on 002 dry-run gate passing"
    key_files:
      - "state/eval-loop-state.jsonl"
      - "iterations/iteration-NNN.md"
      - "synthesis.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114003"
      session_id: "114-003-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Should the loop pause-and-resume across operator-paused breaks if free-tier rate limit hits, or run continuous?"
      - "Min iterations before STOP-allowed: 6 (proposed) vs council ratified value"
    answered_questions:
      - "Variant generation strategy: council-seeded queue + hill-climbing (NOT combinatorial sweep)"
      - "Convergence: 3-signal weighted vote (plateau 0.40 + mutation-exhaustion 0.35 + MAD 0.25)"
      - "State: append-only JSONL with per-fixture in-flight markers for crash recovery"
---
# Feature Specification: Eval Loop for cli-devin SWE 1.6 Optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Run the bespoke deep-loop. Each iteration picks a council-seeded variant or mutates the current best along one axis, dispatches cli-devin against SWE 1.6 for each fixture (parallel wave of 3), scores via the 002 rig (deterministic + grader, cached), aggregates a variant score, then evaluates convergence via 3-signal weighted vote. Loop legal-stops when stopScore > 0.60 AND coverage + quality + budget gates pass. Min 6 iterations. Synthesis ranks variants with confidence scores and key insights. Output is `synthesis.md` — the binding handoff for 004 to apply winners.

**Key Decisions**: Variant generation (council-seeded hill-climbing); convergence signals + weights; failure-recovery for 7 modes (429, grader dispute, parse error, cache race, fixture missing, grader cache poisoning, auth expiration)

**Critical Dependencies**: 002 rig dry-run green; 001 council-report.md ratified; cli-devin authenticated with SWE 1.6; grader CLI authenticated

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (114 phase parent) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
We have a rig (002) and a ratified design contract (001). Now we need to actually run iterations against SWE 1.6 and find the variant that maximizes our 5-dim score. Doing this without externalized state would lose progress on every interruption. Without convergence detection we'd burn budget. Without failure-recovery we'd silent-fail on 429s. Memory: `feedback_codex_sandbox_blocks_network` and `feedback_cli_devin_bundle_verification` confirm SWE 1.6 will hit edge cases.

### Purpose
Produce `synthesis.md` — a binding variant ranking that 004 applies verbatim. Must converge within budget OR exit cleanly with best-known if budget exhausted.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `state/eval-loop-state.jsonl` (append-only, one row per iteration)
- `state/in-flight/{run}-{fixtureId}.json` per-fixture markers for crash recovery
- `state/best-variant.json`, `state/mutation-coverage.json`, `state/eval-loop-dashboard.md`
- `iterations/iteration-NNN.md` (one per iter, mandatory final-line variant score)
- `variants/v-NNN-*.md` — each variant's rendered prompt scaffold
- 10-step iteration pseudocode implementation
- Council-seeded queue + hill-climbing variant generation (1 axis per iter)
- Parallel fixture dispatch (wave of 3) with per-key cache lock
- 3-signal weighted-vote convergence: plateau (0.40, ≥4 iters, Δ<0.02 over 3) + mutation-exhaustion (0.35, ≥3 iters, exhausted ÷ proposed > 0.75) + MAD (0.25, ≥4 iters, MAD<0.01)
- Legal-stop gate: coverage (≥3 variants per fixture) + quality (best > floor) + budget (dispatches < cap)
- 7-mode failure-detect/recover table (429, grader dispute, parse error, cache race, fixture missing, grader cache poisoning, auth expiration)
- `synthesis.md` final synthesis: top variant + alternates for niche cases + confidence scores + key insights

### Out of Scope
- Modifying 002 rig (002 is frozen; if rig needs change, revise 002 first)
- Modifying cli-devin skill (004's domain)
- Council deliberation (001's domain — if rubric needs adjustment, escalate to operator)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `003-eval-loop/state/eval-loop-state.jsonl` | Create | Append-only iteration state |
| `003-eval-loop/state/in-flight/*.json` | Create | Per-fixture crash-recovery markers |
| `003-eval-loop/iterations/iteration-NNN.md` | Create | One per iteration |
| `003-eval-loop/variants/v-NNN-*.md` | Create | Each variant's rendered prompt |
| `003-eval-loop/synthesis.md` | Create | Final ranking + insights |
| `003-eval-loop/scripts/loop.cjs` | Create | Main iteration runner |
| `003-eval-loop/scripts/converge.cjs` | Create | 3-signal weighted-vote evaluator |
| `003-eval-loop/scripts/mutate.cjs` | Create | Hill-climbing mutation generator |
| `003-eval-loop/scripts/synthesize.cjs` | Create | Synthesis writer |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Loop runs at minimum 6 iterations before STOP-allowed | `wc -l state/eval-loop-state.jsonl` ≥ 6 + non-STOP rows before any STOP row |
| REQ-002 | Each iteration row JSONL is well-formed | `jq -e '.run and .variantId and .variantScore and .timestamp and .status' state/eval-loop-state.jsonl` per row |
| REQ-003 | Coverage gate: each fixture scored against ≥ 3 variants | `jq '.fixtureResults[].fixtureId' state/eval-loop-state.jsonl \| sort \| uniq -c \| awk '$1 < 3' \| wc -l` returns 0 |
| REQ-004 | Quality gate: best-variant score > 0.70 (or council-ratified floor) | `jq '.bestVariantScore' state/best-variant.json` > 0.70 |
| REQ-005 | Budget gate: total dispatches < council-ratified cap (e.g., 12 × N fixtures) | Sum of fixture-dispatch counts in state.jsonl < cap |
| REQ-006 | Convergence detection emits stopScore + legal-stop bundle result | Last state row includes `convergence: {stopScore: <n>, legalStopBundle: {coverage:..., quality:..., budget:...}}` |
| REQ-007 | All 7 failure modes have detect + recover handlers | `grep -l "detect.*429\|detect.*disput\|detect.*parse\|detect.*lock\|detect.*missing\|detect.*poison\|detect.*auth" scripts/loop.cjs` returns the file (all patterns present) |
| REQ-008 | `synthesis.md` ranks variants with confidence scores | Top section lists ≥ 3 variants ranked, each with score, confidence band, and 1-line insight |
| REQ-009 | Loop pauses cleanly on 429 (3-strike backoff → pause sentinel) | `state/.eval-loop-pause` exists after sentinel write; operator can resume via re-invoke |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Crash recovery via per-fixture in-flight markers | Force-kill mid-iteration; restart finds in-flight markers and resumes (cache hits expected on partial completion) |
| REQ-011 | Dashboard auto-generated for operator inspection | `state/eval-loop-dashboard.md` updated after each iter; lists current best, queue depth, exhausted signatures |
| REQ-012 | Stuck detection: 3 consecutive no-improvement → axis switch; 2 axis switches → exit best-known | State rows show `mutationAxisSwitchCount` field; exit triggered at threshold |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Loop converges within budget OR exits cleanly with best-known + clear "budget exhausted" status
- **SC-002**: `synthesis.md` provides 004 with everything needed (no further questions)
- **SC-003**: At least 1 mid-loop pause-and-resume cycle survives without data loss (validates REQ-009 + REQ-010)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 001 council-report.md + 002 rig dry-run green | Hard blocker — can't start loop | Pause until upstream green |
| Risk | Free-tier rate-limit pause stretches across days | Run wall-clock unpredictable | REQ-009 pause sentinel + operator manual resume; document expected timeline in synthesis.md |
| Risk | Grader disagreement ≥ 0.15 on key dim → flagged variants unranked | Synthesis incomplete | Median + escalate to operator if disputes persist ≥ 3 iters |
| Risk | Combinatorial blow-up if hill-climbing mutation queue ever proposes all 180 combinations | Wall-clock explosion | Mutation-coverage signature dedup; stuck detection triggers axis switch |
| Risk | Cache race condition under parallel fixture dispatch | Torn rows, score divergence | Per-key mkdir lock with 5min TTL (delegated to 002 rig) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Single iteration < 15 min wall-clock typical (10 fixtures × 60s parallel-3 wave + grader serial + bookkeeping)
- **NFR-P02**: State JSONL append < 100ms p99

### Security
- **NFR-S01**: Variant prompts scrubbed of repo secrets before dispatch
- **NFR-S02**: Cache directory permissions match 002 rig policy (mode 700 if sensitive)

### Reliability
- **NFR-R01**: Append-only state survives any single crash
- **NFR-R02**: Per-fixture in-flight markers enable resumption from exact failure point

---

## 8. EDGE CASES

### Data Boundaries
- Variant produces empty output: score 0.0 deterministic; skip grader; mark `gradable:false`; 3 consecutive → exhaust variant
- Fixture missing mid-run: pre-flight checksum at iter start; pause + escalate on miss
- Cache key collision (theoretical): sha256-collision-resistant; alert if ever observed

### Error Scenarios
- 429 rate limit: exponential backoff 60s/120s/240s → after 3 → pause sentinel + clean exit
- Devin auth expired mid-run: pre-flight `devin auth status` per iter → pause + escalate
- Grader CLI unavailable: 3-strike retry → pause + escalate
- Operator force-kill: in-flight markers preserve mid-iteration state; restart resumes

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Loop runner + convergence + mutation + synthesis scripts; iteration files; state files; 7-mode failure-recovery |
| Risk | 14/25 | Real-model dispatch with free-tier rate limits; cache races under parallelism; grader disagreements |
| Research | 8/20 | Reuse deep-research state + deep-agent-improvement signature dedup patterns; novel convergence-vote tuning |
| Multi-Agent | 6/15 | SWE 1.6 (cli-devin) + grader CLI dispatch per iteration |
| Coordination | 12/15 | Upstream 001 + 002 dependencies; downstream 004 contract |
| **Total** | **60/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Free-tier 429 rate limit pauses loop indefinitely | H | M | Pause sentinel + operator manual resume; document timeline expectations |
| R-002 | Grader dispute on key dim → variant unranked | M | M | Median + escalate after 3 persistent disputes |
| R-003 | Combinatorial mutation explosion | H | L | Signature dedup + stuck detection axis-switch |
| R-004 | Cache race condition (parallel wave of 3) | M | L | Per-key mkdir lock from 002 rig |
| R-005 | Synthesis quality low due to noisy scores | M | M | MAD signal in convergence catches noise floor; require quality gate > 0.70 |

---

## 11. USER STORIES

### US-001: Operator dispatches the loop (Priority: P0)

**As an** operator with 001 + 002 green, **I want** to run the loop with one command, **so that** I don't manually orchestrate iterations.

**Acceptance Criteria**:
1. Given upstream green, When operator runs `node scripts/loop.cjs`, Then iterations dispatch sequentially until convergence or budget exhaustion.
2. Given a mid-run 429 pause, When operator returns, Then `node scripts/loop.cjs --resume` picks up from the last in-flight marker.

### US-002: 004 consumes synthesis.md (Priority: P0)

**As** 004-skill-uplift, **I want** to read `synthesis.md` and find every winner + insight needed, **so that** I don't need to re-analyze raw iteration files.

**Acceptance Criteria**:
1. Given a converged loop, When 004 starts, Then `synthesis.md` provides top-variant winners + alternates + confidence + insights ready to apply.

## 12. OPEN QUESTIONS

- Should pause-resume be transparent (resume picks up exactly where left off) or always re-validate cache integrity first?
- Minimum iterations before STOP-allowed: 6 (proposed) — council can revise. Higher = more thorough; lower = faster convergence under good seeds.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent**: `../spec.md`
- **Upstream**: `../001-council-design/ai-council/council-report.md`, `../002-eval-rig/`
- **Downstream**: `../004-skill-uplift/spec.md`
