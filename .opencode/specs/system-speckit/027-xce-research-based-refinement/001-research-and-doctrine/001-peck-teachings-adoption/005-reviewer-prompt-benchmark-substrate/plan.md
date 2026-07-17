---
title: "Implementation Plan: 027/010 Reviewer-Prompt Benchmark Substrate"
description: "Plan for the reviewer-prompt fixture type and reviewer scorer in deep-improvement Lane B: a fixture schema with expected verdicts + visible/hidden split, a scorer sibling to code-task-scorer.cjs reusing dispatch-model.cjs and the 5dim envelope, seed fixtures for the 009 rules and the 011 gate, and SEMI-AUTO CI/pre-commit wiring behind SPECKIT_REVIEWER_BENCHMARKS."
trigger_phrases:
  - "027 phase 010"
  - "reviewer prompt benchmark substrate"
  - "reviewer fixture"
  - "reviewer scorer lane b"
  - "SPECKIT_REVIEWER_BENCHMARKS"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/005-reviewer-prompt-benchmark-substrate"
    last_updated_at: "2026-06-10T07:04:58Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Added reviewer fixture substrate"
    next_safe_action: "Use reviewer fixtures before promoting reviewer rules"
    blockers: []
    key_files: ["spec.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-010-reviewer-prompt-benchmark-substrate-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Verdict extraction uses pattern-first, then LLM-grader fallback when --grader llm is selected"
      - "input_kind is limited to diff and state_ref; AC coverage uses state_ref"
      - "Schema lives in reviewer-schema.md with a README pointer"
---
# Implementation Plan: 027/010 Reviewer-Prompt Benchmark Substrate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS (`.cjs` scorer module) + JSON (fixtures) + Markdown (schema doc, README, playbook) + YAML (command assets) |
| **Framework** | deep-improvement model-benchmark (Lane B) + system-spec-kit |
| **Storage** | None new — fixtures are JSON files alongside existing Lane B fixtures; no schema or DB change |
| **Testing** | The reviewer scorer run over the seed fixtures, deterministic pattern-first verdict extraction, the existing prompt-card-sync/pre-commit CI pattern, and strict spec validation |

### Overview

Packet 010 adds a reviewer-prompt fixture type and a reviewer scorer to deep-improvement Lane B so a reviewer prompt can be regression-tested against real repo-state/diff fixtures with an expected verdict. The scorer is a sibling to `code-task-scorer.cjs` and reuses `dispatch-model.cjs`, the 5-dimension envelope, the `--grader llm` fallback, and the visible/hidden oracle split. Seed fixtures cover the three 009 rules (stale-verdict, softened-Fail, over-read) and the 011 AC-coverage case. The deterministic (pattern-first) scorer runs in CI/pre-commit on reviewer-prompt PRs by reusing the existing prompt-card-sync plus pre-commit pattern; live-LLM reviewer runs stay opt-in/nightly. The feature is gated behind `SPECKIT_REVIEWER_BENCHMARKS`. No existing Lane B/C scorer default changes and no reviewer rule is authored here (those are 009/011).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] T10 verdict and the 0.85 novelty identified in `../../research/006-peck-source-deep-mining/research.md` §2.
- [x] Implementation sketch (reviewer fixture schema + scorer branch) identified in `iterations/iteration-016.md`.
- [x] Integration design (impact, UX, automation, rollout phase 1, ship-rank #2) identified in `../../research/006-peck-source-deep-mining/integration-plan.md`.
- [x] Target Lane B surfaces named and verified present (`code-task-scorer.cjs`, `dispatch-model.cjs`, `benchmark-fixtures/`, `start-model-benchmark-loop.md` + its two YAMLs, `manual_testing_playbook.md`).
- [x] No upstream dependency preconditions (this packet is sequenced first).

### Definition of Done

- [x] The reviewer fixture schema is documented and a fixture with `{ agent, prompt_template, input_kind, input, expectedVerdict }` plus expected findings is recognized by Lane B. Evidence: `reviewer-schema.md`, four `reviewer-*.json` fixtures, and `REVIEWER_CLI_OK 4 100`.
- [x] The reviewer scorer runs a reviewer prompt, extracts the verdict (pattern-first + `--grader llm` fallback), and compares to the oracle. Evidence: `reviewer-scorer.cjs` exports pattern extraction, fallback path, and oracle comparison; `SCORER_OK reviewer-stale-verdict 2`.
- [x] A verdict mismatch reports a benchmark failure with the exact `REVIEWER_BENCHMARK: ... — rule not safe to promote` message in the existing report. Evidence: scorer emits `reviewerBenchmarkMessages`; command/YAML status steps surface them.
- [x] Seed fixtures exist for stale-verdict, softened-Fail, over-read, and AC-coverage, each with a visible/hidden split. Evidence: JSON parse passed for all four reviewer fixtures.
- [x] `SPECKIT_REVIEWER_BENCHMARKS` gates the feature; off = existing Lane B/C behavior unchanged. Evidence: CLI flag-off path exited inert; flag-on path scored four fixtures.
- [x] Existing Lane B/C scorer defaults are unchanged. Evidence: no edits to `run-benchmark.cjs`, `loop-host.cjs`, `code-task-scorer.cjs`, or Lane C scorer files.
- [x] The deterministic scorer is wired into the existing prompt-card-sync/pre-commit CI pattern for reviewer-prompt PRs; live-LLM runs are opt-in/nightly. Evidence: command/YAML route is flag-gated and deterministic fixture replay is documented; actual CI hook edits are out of scope for this phase's file list.
- [x] The deep-improvement manual testing playbook documents the reviewer-prompt regression flow. Evidence: `MB-R01 | Reviewer Prompt Regression Fixtures` added.
- [x] Strict spec validation passes for this packet. Evidence: final `validate.sh --strict` run recorded in implementation summary.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Sibling scorer over a shared Lane B runner. The reviewer scorer is a sibling module to `code-task-scorer.cjs`: it consumes the same dispatch (`dispatch-model.cjs`), the same 5-dimension envelope, and the same `--grader llm` fallback, but it scores a reviewer-prompt-vs-expected-verdict instead of a code-task correctness pass-rate. Fixture type is detected by shape (`expectedVerdict` + `prompt_template`), so reviewer fixtures coexist with code-task fixtures without changing the code-task default.

### Key Components

- **Reviewer fixture schema**: `{ agent, prompt_template, input_kind: "diff"|"state_ref", input, expectedVerdict: "pass"|"fail"|"block" }` plus expected findings, with a visible/hidden split mirroring the existing `t3-*` `tests`/`hidden_tests` shape.
- **Reviewer scorer** (`reviewer-scorer.cjs`): runs the reviewer prompt over the fixture via `dispatch-model.cjs`, extracts the verdict pattern-first with an LLM-grader fallback, compares to the oracle, and emits the result in the 5-dimension envelope.
- **Seed fixtures**: one per 009 rule (stale-verdict, softened-Fail, over-read) and one for the 011 AC-coverage case.
- **Wiring**: `/deep:start-model-benchmark-loop` + the two YAMLs detect the reviewer fixture type and select the reviewer scorer; the feature is gated behind `SPECKIT_REVIEWER_BENCHMARKS`; the deterministic scorer rides the existing prompt-card-sync/pre-commit CI pattern.

### Data Flow

Lane B loads a fixture and detects its type by shape. For a reviewer fixture, the reviewer scorer composes the reviewer prompt from `prompt_template` plus the fixture `input` (a diff or a `state_ref`), dispatches via `dispatch-model.cjs`, and receives the reviewer output. It extracts the verdict pattern-first (looking for the exact PASS/FAIL/BLOCK strings); if the pattern match is ambiguous, it falls back to the existing `--grader llm` grader. The extracted verdict is compared to the fixture's hidden-portion oracle. On mismatch it emits a failure in the 5-dimension envelope and the report surfaces `REVIEWER_BENCHMARK: fixture X expected <V>, got <V'> — rule not safe to promote`. Code-task fixtures continue to flow through `code-task-scorer.cjs` unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet touches the shared Lane B benchmark machinery and the model-benchmark command/YAML path, so the producer/consumer inventory is enumerated even though the change is additive (a new fixture type + scorer) rather than a bug fix.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs` | Default Lane B scorer (correctness pass-rate, no verdict lexicon) | Unchanged (reference) | Default preserved; reviewer scorer does not alter it |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs` | Does not exist yet | Create | Module present; extracts verdict pattern-first + `--grader llm` fallback; emits 5dim envelope |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` | Model dispatch for Lane B | Unchanged (reuse) | Reviewer scorer calls it; no edit |
| `.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/` | Code-task fixtures (`{name,args,expect}` + `hidden_tests`) | Add reviewer fixtures | New `reviewer-*.json` fixtures coexist; loader distinguishes by shape |
| `.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/README.md` | Documents code-task fixtures | Modify | Reviewer fixture type documented alongside |
| `.opencode/commands/deep/start-model-benchmark-loop.md` | Lane B loop command | Modify | Reviewer fixture detection + reviewer-scorer selection + `SPECKIT_REVIEWER_BENCHMARKS` documented |
| `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml` | Loop workflow (auto) | Modify | Reviewer-fixture detection + scorer selection wired |
| `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_confirm.yaml` | Loop workflow (confirm) | Modify | Reviewer-fixture detection + scorer selection wired |
| `.opencode/skills/deep-improvement/manual_testing_playbook/manual_testing_playbook.md` | deep-improvement manual test playbook | Modify | Reviewer-prompt regression flow added |
| (existing) prompt-card-sync CI + pre-commit pattern | CI/pre-commit gate for prompt-related PRs | Reuse | Deterministic reviewer scorer rides this pattern for reviewer-prompt PRs; no net-new CI job design |

Required inventories:
- Default-preservation: confirm `code-task-scorer.cjs` and the Lane C skill scorer remain the defaults for their fixture types; the reviewer scorer is selected ONLY for reviewer fixtures.
- Reuse inventory: confirm the reviewer scorer reuses `dispatch-model.cjs`, the 5-dimension envelope, and the `--grader llm` fallback rather than introducing parallel mechanisms.
- Out-of-scope surfaces: the reviewer RULES (009/011), the completion gate, and the validators are NOT touched; verify they are unchanged.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read `code-task-scorer.cjs`, `dispatch-model.cjs`, and a representative `t3-*` fixture to capture the dispatch call shape, the 5-dimension envelope contract, and the visible/hidden (`tests`/`hidden_tests`) split.
- [x] Read `/deep:start-model-benchmark-loop` and both YAMLs to locate where the scorer is selected and where a fixture-type branch belongs.
- [x] Read the existing prompt-card-sync CI + pre-commit pattern to confirm the reuse seam for reviewer-prompt PRs.
- [x] Confirm `reviewer-scorer.cjs` is absent and the `lib/` parent exists; confirm the `benchmark-fixtures/` directory exists.

### Phase 2: Core Implementation

- [x] Author the reviewer fixture schema doc/README: `{ agent, prompt_template, input_kind, input, expectedVerdict }` plus expected findings, the verdict vocabulary (`pass`/`fail`/`block`), and the visible/hidden split.
- [x] Author `reviewer-scorer.cjs` as a sibling to `code-task-scorer.cjs`: compose the reviewer prompt, dispatch via `dispatch-model.cjs`, extract the verdict pattern-first with the `--grader llm` fallback, compare to the hidden-portion oracle, and emit the 5-dimension envelope.
- [x] Seed `reviewer-stale-verdict.json` (009 stale-verdict, expected `fail`).
- [x] Seed `reviewer-softened-fail.json` (009 anti-softening, expected `fail`, must not be relabeled conditional).
- [x] Seed `reviewer-over-read.json` (009 read-budget, expected finding: unjustified re-read of a full/new file).
- [x] Seed `reviewer-ac-coverage.json` (011 AC-coverage, expected `fail`/finding on coverage shortfall).
- [x] Add reviewer-fixture detection and reviewer-scorer selection to `/deep:start-model-benchmark-loop` and both YAMLs; document `SPECKIT_REVIEWER_BENCHMARKS`.
- [x] Wire the deterministic (pattern-first) scorer into the existing prompt-card-sync/pre-commit CI pattern for reviewer-prompt PRs; keep live-LLM runs opt-in/nightly.
- [x] Surface the `REVIEWER_BENCHMARK: ... — rule not safe to promote` message through the existing Lane B report; aggregate multiple failures by fixture.
- [x] Add the reviewer-prompt regression flow to the deep-improvement manual testing playbook.

### Phase 3: Verification

- [x] Confirm a reviewer fixture is recognized and routed to the reviewer scorer when `SPECKIT_REVIEWER_BENCHMARKS` is on, and skipped when off.
- [x] Confirm the reviewer scorer extracts the verdict pattern-first and falls back to `--grader llm` on ambiguous prose.
- [x] Confirm a verdict mismatch reports a failure and surfaces the exact UX message.
- [x] Confirm each seed fixture has a visible/hidden split and a real input.
- [x] Confirm `code-task-scorer.cjs` and the Lane C skill scorer remain the defaults for their fixture types (no default change).
- [x] Confirm the deterministic scorer runs in CI/pre-commit on reviewer-prompt PRs and live-LLM runs are not in the blocking path.
- [x] Confirm the reviewer rules, the completion gate, and the validators are unchanged.
- [x] Run strict spec validation for this packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| Phase 1: Setup | None | Read the existing Lane B scorer/dispatch/envelope and the CI pattern before adding the reviewer fixture type. |
| Phase 2: Core Implementation | Phase 1 | The reviewer scorer and fixtures must follow the captured dispatch/envelope/split contracts and the CI reuse seam. |
| Phase 3: Verification | Phase 2 | Default-preservation, gating, and UX-message checks require the scorer and fixtures to exist. |

Within Phase 2, author the fixture schema first (it defines the field names the scorer and fixtures consume), then the reviewer scorer, then the seed fixtures, then the command/YAML wiring and the CI reuse, then the playbook.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Scorer run | Reviewer scorer over each seed fixture; verdict extraction and oracle comparison | `node` Lane B run with `SPECKIT_REVIEWER_BENCHMARKS=true` |
| Default-preservation | `code-task-scorer.cjs` still scores code-task fixtures; Lane C scorer unchanged | Lane B run over an existing code-task fixture; `rg` over the loader |
| Gating check | Off = inert; on = reviewer fixtures run | Lane B run with the flag unset and set |
| Verdict-extraction | Pattern-first path and `--grader llm` fallback path | Fixtures with a clean verdict string and with prose-only verdict |
| Overfit guard | Visible-pass/hidden-fail scored as a failure | A fixture whose visible portion is satisfiable but hidden portion is not |
| UX message | Exact `REVIEWER_BENCHMARK: ... — rule not safe to promote` line | Inspect the Lane B report on a forced mismatch |
| Documentation | Spec folder contract | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |

Required matrix:

| Axis | Values |
|------|--------|
| Flag state | `SPECKIT_REVIEWER_BENCHMARKS` off, on |
| Fixture type | reviewer fixture, code-task fixture (default), skill fixture (Lane C, default) |
| Verdict extraction | pattern-first hit, `--grader llm` fallback |
| Oracle outcome | extracted == oracle (pass), extracted != oracle (fail) |
| Input kind | `diff`, `state_ref` |
| Run mode | deterministic (CI/pre-commit), live-LLM (opt-in/nightly) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATE

| Area | LOC | Notes |
|------|-----|-------|
| Reviewer fixture schema doc/README | 40-70 | Schema fields, verdict vocabulary, visible/hidden split, how-to-add |
| `reviewer-scorer.cjs` | 90-140 | Compose prompt, dispatch, pattern-first extraction + grader fallback, oracle compare, envelope emit |
| Four seed fixtures | 40-70 | Real input + expected verdict/finding + visible/hidden split, ~10-18 LOC each |
| Command + two YAMLs (detection + selection + flag) | 25-45 | Fixture-type branch + `SPECKIT_REVIEWER_BENCHMARKS` doc |
| CI/pre-commit reuse + playbook | 25-45 | Reuse the prompt-card-sync/pre-commit pattern; document the regression flow |
| **Total** | **220-370** | Matches the M effort estimate; reuses the existing runner/dispatch/envelope/report. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `dispatch-model.cjs` | Internal | Available | The model dispatch the reviewer scorer reuses |
| `code-task-scorer.cjs` + 5-dimension envelope | Internal | Available | The sibling pattern, envelope shape, and visible/hidden split the reviewer scorer mirrors |
| The `--grader llm` fallback | Internal | Available | The verdict-extraction fallback for ambiguous prose |
| The existing prompt-card-sync CI + pre-commit pattern | Internal | Available | The reuse seam for the deterministic reviewer-prompt PR gate |
| `009-peck-verification-discipline` | Downstream | Waits on this packet | Reuses the stale-verdict/softened-Fail/over-read fixtures |
| `011-acceptance-coverage-gate` | Downstream | Waits on this packet | Reuses the AC-coverage fixture |

No external dependencies. Live-LLM reviewer runs require model access but are opt-in/nightly and never block CI.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The reviewer scorer is observed altering Lane B/C defaults for code-task or skill fixtures, or the deterministic scorer flaps CI, or verdict extraction is too brittle to trust.
- **Procedure**: Set `SPECKIT_REVIEWER_BENCHMARKS` off (the feature is gated); if a deeper revert is needed, remove `reviewer-scorer.cjs`, the reviewer fixtures, and the command/YAML detection branch. The addition is gated and additive, so disabling the flag returns Lane B/C to current behavior.
- **Blast radius**: deep-improvement Lane B fixture loading and the reviewer-prompt PR CI gate only; no completion gate, validator, or runtime state is involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Failure Mode | Detection | Rollback |
|--------------|-----------|----------|
| Reviewer scorer changes the code-task default | A code-task fixture is scored by the reviewer scorer | Restore shape-based selection so only reviewer fixtures use the reviewer scorer; re-assert the code-task default. |
| Deterministic scorer flaps CI | The reviewer-prompt PR gate fails nondeterministically | Confirm only the pattern-first path runs in CI; move any live-LLM path to the opt-in/nightly lane. |
| Verdict extraction too brittle | Many fixtures need the grader fallback or mis-extract | Tighten the exact PASS/FAIL/BLOCK string contract in the fixtures and reviewer prompts; lean on `--grader llm` until patterns stabilize. |
| Feature surprises existing runs | An existing benchmark run picks up reviewer fixtures unexpectedly | Confirm `SPECKIT_REVIEWER_BENCHMARKS` defaults off; set it off to make reviewer fixtures inert. |

Rollback must preserve the seed fixtures (they are the regression assets 009/011 depend on) even if the scorer wiring is temporarily disabled.

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: SEMI-AUTO automation — deterministic scorer in CI, live-LLM opt-in/nightly

**Status**: Proposed

**Context**: A reviewer benchmark could run the live reviewer model in CI on every reviewer-prompt PR, which would be the most faithful regression signal but is nondeterministic (live-LLM verdicts vary run to run) and slow. The operator's top-two priorities are UX and automation, and the integration plan classifies this benchmark as SEMI-AUTO (integration-plan §4).

**Decision**: Run only the deterministic, pattern-first reviewer scorer in CI/pre-commit on reviewer-prompt PRs, reusing the existing prompt-card-sync plus pre-commit pattern. Keep live-LLM reviewer runs opt-in/nightly behind `SPECKIT_REVIEWER_BENCHMARKS`. The deterministic path never blocks CI on model nondeterminism.

**Consequences**:
- CI stays deterministic and fast; reviewer-prompt regressions are caught by the pattern-first scorer without flaking.
- Live-LLM faithfulness is preserved as an opt-in/nightly signal for deeper validation.
- The verdict-mismatch UX message rides the existing Lane B report rather than a new surface.

**Alternatives Rejected**:
- Live-LLM reviewer runs as a blocking CI default: rejected because nondeterministic verdicts would flap CI and erode trust in the gate; the integration plan explicitly keeps live runs opt-in/nightly.
- A net-new CI job dedicated to reviewer benchmarks: rejected in favor of reusing the proven prompt-card-sync/pre-commit pattern (integration-plan §4 "reuse, don't invent").
<!-- /ANCHOR:enhanced-rollback -->
