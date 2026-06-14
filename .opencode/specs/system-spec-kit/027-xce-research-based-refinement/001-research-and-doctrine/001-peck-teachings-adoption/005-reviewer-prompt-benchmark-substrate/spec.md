---
title: "010 — Reviewer-Prompt Benchmark Substrate"
description: "Add a reviewer-prompt fixture type and reviewer scorer to deep-improvement Lane B so a reviewer prompt can be regression-tested against real repo-state/diff fixtures with an EXPECTED VERDICT (Pass|Fail|Block). The test substrate that makes the 009 verification rules and the 011 AC-coverage gate safe to ship."
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
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/005-reviewer-prompt-benchmark-substrate"
    last_updated_at: "2026-06-10T07:04:58Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Added reviewer fixture substrate"
    next_safe_action: "Use reviewer fixtures before promoting reviewer rules"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-010-reviewer-prompt-benchmark-substrate-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Proposal ranks 010 #2 in ship-order and explicitly LAND FIRST as the test substrate for 009/011"
      - "Verdict extraction uses pattern-first, then LLM-grader fallback when --grader llm is selected"
      - "input_kind is limited to diff and state_ref; AC coverage uses state_ref"
      - "Schema lives in reviewer-schema.md with a README pointer"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 010 — Reviewer-Prompt Benchmark Substrate

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

Packet 010 adopts **T10**, the highest-novelty mechanism (newInfoRatio 0.85) from the peck-source deep-mining pass (`research/006-peck-source-deep-mining/research.md` §2): peck's untouched `revim-*` harness runs a reviewer prompt over a real repo fixture that carries an **expected verdict** (`CHECKOUT/INPUT/EXPECTED` -> `Pass|Fail|Block`) and asserts the reviewer still catches that known bug class. spec-kit's deep-improvement Lane B (code-task oracles) and Lane C (routing gold) cannot currently answer "does this reviewer prompt still catch this known bug class" — cross-model verification (MiniMax M3, iteration-016) confirmed the gap is real and supplied a low-cost implementation sketch.

This packet is the **test substrate that makes 009 and 011 regression-safe** and must **land first** (integration-plan §6 ship-rank #2; sub-packet-proposal §0/§7 "land FIRST"). It adds three additive pieces inside the existing Lane B machinery — no new infrastructure:

- A **reviewer-prompt fixture type**: a JSON fixture shape `{ agent, prompt_template, input_kind: "diff"|"state_ref", input, expectedVerdict: "pass"|"fail"|"block" }` plus expected findings, mirroring the existing visible/hidden oracle split so the reviewer prompt cannot overfit to the known answer.
- A **reviewer scorer** (sibling to `code-task-scorer.cjs`) that runs a reviewer prompt over the fixture, extracts the verdict (pattern-first, LLM-grader fallback via the existing `--grader llm`), and compares it to the oracle. It reuses `dispatch-model.cjs`, the existing 5-dimension envelope, and the visible/hidden split.
- **Seed fixtures** for each 009 rule (stale-verdict, softened-Fail, over-read) and the 011 AC-coverage case, so the downstream packets have regression coverage on day one.

The two operator-directed top priorities — **UX and automation** — are first-class requirements here (Section 4 has a dedicated subsection). Automation is **SEMI-AUTO**: the deterministic scorer runs in CI/pre-commit on reviewer-prompt PRs by reusing the existing prompt-card-sync CI plus pre-commit pattern, while live-LLM reviewer runs stay opt-in/nightly (integration-plan §4). The user-facing message style is the actionable `REVIEWER_BENCHMARK: fixture X expected FAIL, got PASS — rule not safe to promote` (integration-plan §3). The feature is gated behind `SPECKIT_REVIEWER_BENCHMARKS` (integration-plan §5 phase 1).

Source context:
- Verdict + novelty evidence: `../../research/006-peck-source-deep-mining/research.md` §2 (T10, 0.85) and Executive Summary headline 3.
- Implementation sketch (cross-model): `../../research/006-peck-source-deep-mining/iterations/iteration-016.md` (MiniMax M3 reviewer fixture schema + scorer branch).
- Integration design: `../../research/006-peck-source-deep-mining/integration-plan.md` §2 impact, §3 UX, §4 automation, §5 rollout (phase 1), §6 ship-rank (#2, land first), §7 mapping.
- Recommendation: `../../research/006-peck-source-deep-mining/sub-packet-proposal.md` §2 (Packet 010).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Completed |
| **Parent Packet** | `001-peck-teachings-adoption` |
| **Source** | `../../research/006-peck-source-deep-mining/research.md` §2 (T10); `iterations/iteration-016.md`; `integration-plan.md` §§2-7; `sub-packet-proposal.md` §2 |
| **Depends on** | None structural (sequence FIRST so 009/011 are regression-tested) |
| **Feeds into** | `009-peck-verification-discipline` (regression fixtures for stale-verdict/softened-Fail/over-read) and `011-acceptance-coverage-gate` (AC-coverage fixture); also unlocks the optional T11 cheap-model preset |
| **LOC budget** | ~220-320 (fixture schema + README + seed fixtures + reviewer scorer; reuses existing dispatch/runner/report) |
| **Branch** | `main` |
| **Created** | 2026-06-06 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

spec-kit ships verification-discipline rules and gates (the 009 freshness/anti-softening/read-budget rules, the 011 AC-coverage gate) onto reviewer agents and the completion gate, but it has **no regression harness that answers "does this reviewer prompt still catch this known bug class."** The deep-improvement benchmark Lanes do not cover the reviewer-prompt-vs-expected-verdict shape: Lane B fixtures are function/code-task oracles (`code-task-scorer.cjs` returns a correctness pass-rate, zero verdict lexicon; fixtures carry `{name,args,expect}`, no `expectedVerdict`), and Lane C gold is routing/usefulness (skillId/intentKeys/resources, no verdict dimension). This was the run's highest-novelty finding (0.85) and was cross-model-CONFIRMED: "could be built" is not "already exists" — no fixture today takes a reviewer prompt plus a known-buggy diff and asserts the verdict.

Without this substrate, every new verification rule in 009 and the AC-coverage gate in 011 would ship **unverified**: there would be no mechanical way to prove that a reviewer prompt edit still produces `FAIL` on a stale-verdict case, still refuses to soften a `Fail` to conditional, still flags an over-read, or still surfaces an AC-coverage shortfall. A reviewer-prompt regression (a prompt edit that silently stops catching a bug class) would pass CI undetected.

### Purpose

Give deep-improvement Lane B a reviewer-prompt fixture type and a reviewer scorer so any reviewer prompt can be regression-tested against real repo-state/diff fixtures with an expected verdict, reusing the existing Lane B dispatch/runner/scorer/report machinery and the visible/hidden oracle split. Seed the fixtures the 009 rules and the 011 gate need so those packets are safe to ship.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

1. **Reviewer-prompt fixture type (Lane B)**
   - A JSON fixture schema `{ agent, prompt_template, input_kind: "diff"|"state_ref", input, expectedVerdict: "pass"|"fail"|"block" }` plus expected findings (the peck `revim-*` shape).
   - Mirror the existing fixture visible/hidden split (e.g. the `t3-*` `tests` + `hidden_tests` shape) so a reviewer prompt cannot overfit to the visible answer.
   - A README documenting the fixture shape, the verdict vocabulary, and how to add a reviewer fixture.

2. **Reviewer scorer**
   - A sibling to `code-task-scorer.cjs` in `scripts/model-benchmark/lib/` that runs a reviewer prompt over the fixture, extracts the verdict (pattern-first, then the existing `--grader llm` LLM-grader fallback), and compares to the oracle.
   - Reuse `dispatch-model.cjs` for the model call, the existing 5-dimension envelope, and the visible/hidden split. No change to the Lane B runner contract beyond selecting the reviewer scorer for reviewer fixtures.

3. **Seed fixtures**
   - One fixture per 009 rule: stale-verdict, softened-Fail, over-read.
   - One fixture for the 011 AC-coverage case.
   - Each seed fixture carries a real repo-state/diff input and an expected verdict/finding set.

4. **Wiring + flag + UX/automation surfaces**
   - `/deep:start-model-benchmark-loop` (and its `_auto`/`_confirm` YAMLs) recognize the reviewer fixture type and route it to the reviewer scorer.
   - Gate the feature behind `SPECKIT_REVIEWER_BENCHMARKS` (default off in this packet; opt-in/nightly for live-LLM runs).
   - SEMI-AUTO automation: the deterministic (pattern-first) scorer runs in CI/pre-commit on reviewer-prompt PRs by reusing the existing prompt-card-sync CI plus pre-commit pattern; live-LLM runs stay opt-in/nightly.
   - Actionable UX message: `REVIEWER_BENCHMARK: fixture X expected FAIL, got PASS — rule not safe to promote`, surfaced through the existing Lane B report (no new prompt).
   - Document the new fixture type and reviewer-prompt regression flow in the deep-improvement `manual_testing_playbook`.

### Out of Scope

- Changing existing Lane B/C scorer defaults — `code-task-scorer.cjs` (correctness pass-rate) and the Lane C skill scorer stay the defaults for their fixture types; the reviewer scorer is selected only for reviewer fixtures.
- The reviewer rules themselves — the stale-verdict/softened-Fail/over-read rules are owned by 009; the AC-coverage rule is owned by 011. This packet only provides the fixtures and the scorer to test them.
- The optional T11 cheap-model review preset — unlocked by this substrate but its own opt-in/deferred item.
- Any change to the completion gate, validators, or governance — this packet adds a benchmark fixture type and scorer only; no `validate.sh`/`check-completion.sh`/`spec-doc-structure` change.
- Live-LLM runs as a blocking default — live runs are opt-in/nightly; only the deterministic pattern-first scorer participates in CI/pre-commit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md` | Create | Reviewer-prompt fixture schema + verdict vocabulary + how-to-add doc (or fold into the existing fixtures README) |
| `.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-stale-verdict.json` | Create | Seed fixture for the 009 stale-verdict rule (expected `fail`) |
| `.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-softened-fail.json` | Create | Seed fixture for the 009 anti-softening rule (expected `fail`, must not be relabeled conditional) |
| `.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-over-read.json` | Create | Seed fixture for the 009 read-budget rule (expected finding: unjustified re-read of a full/new file) |
| `.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-ac-coverage.json` | Create | Seed fixture for the 011 AC-coverage case (expected `fail`/finding on coverage shortfall) |
| `.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/README.md` | Modify | Document the new reviewer fixture type alongside the existing code-task fixtures |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs` | Create | Reviewer scorer: run reviewer prompt, extract verdict (pattern-first + `--grader llm` fallback), compare to oracle; reuses `dispatch-model.cjs` + 5dim envelope + visible/hidden split |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/lib/README.md` | Modify | Document the reviewer scorer alongside `code-task-scorer.cjs` |
| `.opencode/commands/deep/start-model-benchmark-loop.md` | Modify | Recognize the reviewer fixture type; route it to the reviewer scorer; document `SPECKIT_REVIEWER_BENCHMARKS` |
| `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml` | Modify | Wire reviewer-fixture detection + reviewer-scorer selection (auto mode) |
| `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_confirm.yaml` | Modify | Wire reviewer-fixture detection + reviewer-scorer selection (confirm mode) |
| `.opencode/skills/deep-improvement/manual_testing_playbook/manual_testing_playbook.md` | Modify | Add the reviewer-prompt regression flow (fixture authoring + scorer run + UX message) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add a reviewer-prompt fixture type to Lane B with the documented schema. | Given a reviewer fixture authored with `{ agent, prompt_template, input_kind, input, expectedVerdict }` plus expected findings, when Lane B loads it, then it is recognized as a reviewer fixture and not mis-parsed as a code-task fixture. |
| REQ-002 | Add a reviewer scorer (sibling to `code-task-scorer.cjs`) that runs the reviewer prompt and extracts a verdict. | Given a reviewer fixture and a reviewer prompt, when the reviewer scorer runs, then it dispatches via `dispatch-model.cjs`, extracts a verdict pattern-first with an LLM-grader fallback via the existing `--grader llm`, and emits the result in the existing 5-dimension envelope. |
| REQ-003 | Compare the extracted verdict to the fixture oracle and report pass/fail. | Given an `expectedVerdict` of `fail` and an extracted verdict of `pass`, when the scorer compares, then it reports a benchmark failure (the reviewer prompt did not catch the bug class). |
| REQ-004 | Seed fixtures for the three 009 rules and the 011 AC-coverage case. | Fixtures `reviewer-stale-verdict.json`, `reviewer-softened-fail.json`, `reviewer-over-read.json`, and `reviewer-ac-coverage.json` exist, each with a real repo-state/diff input and an expected verdict/finding. |
| REQ-005 | Mirror the existing visible/hidden oracle split in the reviewer fixture. | Each reviewer fixture carries a visible portion and a hidden portion (mirroring the `t3-*` `tests`/`hidden_tests` shape) so the reviewer prompt cannot overfit to the visible answer. |
| REQ-006 | Gate the feature behind `SPECKIT_REVIEWER_BENCHMARKS`. | With the flag unset/off, existing Lane B/C behavior is unchanged; with it on, reviewer fixtures are run by the reviewer scorer. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Do not change existing Lane B/C scorer defaults. | `code-task-scorer.cjs` stays the default for code-task fixtures and the Lane C skill scorer stays the default for skill fixtures; the reviewer scorer is selected only for reviewer fixtures. |
| REQ-008 | SEMI-AUTO automation: the deterministic scorer runs in CI/pre-commit on reviewer-prompt PRs. | The pattern-first reviewer scorer is wired into the existing prompt-card-sync CI plus pre-commit pattern for reviewer-prompt PRs; live-LLM runs stay opt-in/nightly and never block CI. |
| REQ-009 | Surface the actionable UX message through the existing Lane B report. | A failing reviewer benchmark surfaces `REVIEWER_BENCHMARK: fixture X expected <V>, got <V'> — rule not safe to promote` in the existing report, with no new prompt surface. |
| REQ-010 | Reuse, do not invent: `dispatch-model.cjs`, the 5-dimension envelope, the `--grader llm` fallback, and the prompt-card-sync CI/pre-commit pattern. | The reviewer scorer adds a branch/sibling to existing machinery; no parallel dispatch, envelope, grader, or CI mechanism is introduced. |
| REQ-011 | Document the reviewer-prompt regression flow in the deep-improvement manual testing playbook. | The playbook gains a section covering reviewer-fixture authoring, running the reviewer scorer, the verdict-mismatch UX message, and the `SPECKIT_REVIEWER_BENCHMARKS` flag. |

### UX + Automation Requirements (operator top-2 priorities — dedicated)

These are first-class P0/P1 requirements, called out separately because UX and automation are the system's stated #1 priorities (integration-plan front-matter + §6).

| ID | Dimension | Requirement | Acceptance Criteria |
|----|-----------|-------------|---------------------|
| UXA-001 | Automation class | The reviewer benchmark is **SEMI-AUTO**: deterministic scorer in CI/pre-commit, live-LLM opt-in/nightly. | CI/pre-commit runs the pattern-first scorer on reviewer-prompt PRs; live-LLM runs are explicitly opt-in/nightly per `SPECKIT_REVIEWER_BENCHMARKS`. |
| UXA-002 | Automation reuse | Reuse the existing prompt-card-sync CI plus pre-commit trigger for reviewer-prompt PRs. | The reviewer-prompt PR trigger rides the existing prompt-card-sync/comment-hygiene CI + staged-file pre-commit pattern, not a net-new CI job design. |
| UXA-003 | UX message | The verdict-mismatch message is exact and actionable. | The message reads `REVIEWER_BENCHMARK: fixture X expected FAIL, got PASS — rule not safe to promote` (verdict words substituted), names the fixture, and states the consequence ("not safe to promote"). |
| UXA-004 | UX surface | The message reuses an existing surface (the Lane B report), never a new prompt. | The mismatch is surfaced in the existing Lane B benchmark report output; no new interactive prompt is added. |
| UXA-005 | UX anti-pattern guard | Avoid wall-of-errors and verdict ambiguity. | Multiple fixture failures aggregate by fixture with one top consequence line each; the exact verdict strings (PASS/FAIL/BLOCK) are kept parseable. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reviewer fixture authored with the documented schema is recognized by Lane B and routed to the reviewer scorer when `SPECKIT_REVIEWER_BENCHMARKS` is on.
- **SC-002**: The reviewer scorer dispatches a reviewer prompt via `dispatch-model.cjs`, extracts the verdict (pattern-first + `--grader llm` fallback), and reports a failure when the extracted verdict disagrees with the oracle.
- **SC-003**: Seed fixtures exist for stale-verdict, softened-Fail, over-read (009), and AC-coverage (011), each with a real input and an expected verdict/finding.
- **SC-004**: Each reviewer fixture has a visible/hidden split so the reviewer prompt cannot overfit to the visible answer.
- **SC-005**: Existing Lane B/C scorer defaults are unchanged; the reviewer scorer is selected only for reviewer fixtures.
- **SC-006**: The deterministic scorer runs in CI/pre-commit on reviewer-prompt PRs via the existing prompt-card-sync/pre-commit pattern; live-LLM runs are opt-in/nightly.
- **SC-007**: A failing reviewer benchmark surfaces the exact `REVIEWER_BENCHMARK: ... — rule not safe to promote` message in the existing Lane B report.
- **SC-008**: 009 and 011 can record this packet as their regression substrate (their rules have a fixture each).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Verdict extraction is brittle (a reviewer prompt phrases the verdict in prose the pattern matcher misses). | High | Pattern-first with the existing `--grader llm` fallback; keep the exact PASS/FAIL/BLOCK strings parseable (UXA-003/005); the grader resolves ambiguous prose. |
| Risk | A reviewer prompt overfits to the visible fixture answer and passes without genuinely catching the bug class. | Medium | Mirror the visible/hidden oracle split (REQ-005); the hidden portion is what the verdict is scored against. |
| Risk | Live-LLM reviewer runs are nondeterministic and would flap CI if made blocking. | Medium | SEMI-AUTO: only the deterministic pattern-first scorer participates in CI/pre-commit; live-LLM runs are opt-in/nightly (UXA-001). |
| Risk | The reviewer scorer accidentally changes Lane B/C defaults for code-task or skill fixtures. | Medium | The reviewer scorer is selected ONLY for reviewer fixtures; existing defaults are asserted unchanged (REQ-007, SC-005). |
| Risk | Wall-of-errors when several reviewer fixtures fail at once. | Low | Aggregate by fixture with one consequence line each (UXA-005). |
| Risk | Feature lands enabled and surprises existing benchmark runs. | Low | Gate behind `SPECKIT_REVIEWER_BENCHMARKS`, default off in this packet (REQ-006). |
| Dependency | None structural. | None | This packet is the substrate; it has no upstream dependency and is sequenced FIRST. 009 and 011 depend on it for regression fixtures. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Compatibility

- **NFR-C01**: With `SPECKIT_REVIEWER_BENCHMARKS` off, no existing Lane B/C run changes behavior; reviewer fixtures and the reviewer scorer are inert.
- **NFR-C02**: Reviewer fixtures coexist with code-task fixtures in the same fixtures directory; the loader distinguishes them by shape (`expectedVerdict` + `prompt_template`) without disturbing code-task loading.

### Maintainability

- **NFR-M01**: The reviewer scorer is a sibling module to `code-task-scorer.cjs`, sharing `dispatch-model.cjs`, the 5-dimension envelope, and the grader path, so there is one dispatch/envelope/grader mechanism to maintain.
- **NFR-M02**: The fixture schema is documented once (the reviewer schema doc/README) and reused by all seed fixtures.

### Clarity

- **NFR-CL01**: The verdict-mismatch message is a single, exact, parseable line per failing fixture (UXA-003/005).
- **NFR-CL02**: The fixture README states the verdict vocabulary (`pass`/`fail`/`block`) and the visible/hidden split unambiguously.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

| Case | Expected Behavior |
|------|-------------------|
| `SPECKIT_REVIEWER_BENCHMARKS` unset | Reviewer fixtures are skipped; Lane B/C run exactly as today. |
| Reviewer prompt emits the verdict in prose the pattern matcher cannot parse | Pattern-first extraction misses; the `--grader llm` fallback resolves the verdict from the prose. |
| Reviewer fixture missing `expectedVerdict` | Treated as malformed; the loader reports a fixture error rather than scoring it as a code-task fixture. |
| Extracted verdict equals the oracle | Benchmark passes for that fixture; no mismatch message. |
| Reviewer prompt passes the visible portion but fails the hidden portion | Scored against the hidden portion; reported as a failure (overfit caught). |
| A code-task fixture is present alongside reviewer fixtures | The code-task fixture is scored by `code-task-scorer.cjs` (default unchanged); only reviewer fixtures use the reviewer scorer. |
| Live-LLM reviewer run requested in CI | Not run in the blocking CI path; only the deterministic pattern-first scorer runs there (live-LLM is opt-in/nightly). |
| Multiple reviewer fixtures fail in one run | Failures aggregate by fixture, one consequence line each, exact verdict strings preserved. |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | One fixture schema, one scorer module, four seed fixtures, plus command/YAML/playbook wiring; reuses the existing Lane B runner/dispatch/envelope/report. |
| Risk | 12/25 | Verdict extraction brittleness and the must-not-change-defaults constraint are the load-bearing risks; gated behind a flag and SEMI-AUTO in CI. |
| Research | 6/20 | T10 verdict, the 0.85 novelty, and the MiniMax implementation sketch already define the fixture shape and scorer branch. |
| **Total** | **31/70** | **Level 2** because it touches the shared Lane B machinery and must preserve existing scorer defaults while adding a deterministic CI path. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

All scaffolded questions are answered:

- Verdict extraction is pattern-first, with `--grader llm` fallback only when the pattern matcher cannot parse a verdict.
- `input_kind` is limited to `diff` and `state_ref`; the acceptance-coverage seed uses `state_ref`.
- The reviewer schema lives in `reviewer-schema.md`, with a pointer from the fixtures README.
<!-- /ANCHOR:questions -->
