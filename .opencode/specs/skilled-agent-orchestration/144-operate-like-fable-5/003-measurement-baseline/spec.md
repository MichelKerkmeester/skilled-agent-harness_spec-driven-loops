---
title: "Feature Specification: Measurement baseline for fable-5 efficiency: a fable-metrics script, post-dispatch behavioral advisories, and a doctor/benchmark delivery route [template:level_3/spec.md]"
description: "Ships the measurement baseline FIRST so every later fable-5 phase can prove behavioral movement: a runtime-agnostic fable-metrics script, non-blocking post-dispatch advisories, and a read-only /doctor delivery route."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/003-measurement-baseline"
    last_updated_at: "2026-06-15T14:05:58Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 3 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-measurement-baseline"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Measurement baseline for fable-5 efficiency: a fable-metrics script, post-dispatch behavioral advisories, and a doctor/benchmark delivery route

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

<!-- WHEN TO USE THIS TEMPLATE:
Level 3 (+Arch) is appropriate when:
- Changes affect 500+ lines of code
- Architecture decisions need formal documentation (ADRs)
- Executive summary needed for stakeholders
- Risk matrix required
- 4-8 user stories
- Multiple teams or cross-functional work

DO NOT use Level 3 if:
- Simple feature (use Level 1)
- Only verification needed (use Level 2)
- Governance approval workflow required (use Level 3+)
- Compliance checkpoints needed (use Level 3+)
- Multi-agent parallel execution coordination (use Level 3+)
-->

---

## EXECUTIVE SUMMARY

This phase implements recommendations C1, C2, and C3 from the fable-5 efficiency research: a standalone `fable-metrics.cjs` script that computes five behavioral signals from existing deep-loop state, non-blocking advisories wired into `post-dispatch-validate.ts`, and a read-only `/doctor fable-mode` delivery route. It ships first in the fable-5 sequence so that the governor and doctrine changes in later phases can be measured against a captured baseline instead of asserted. Per the research's own honesty note (G4), these metrics steer efficiency (token burn, context decay, result-first output), not capability.

**Key Decisions**: Build a runtime-agnostic `fable-metrics.cjs` instead of porting the Claude-path-coupled `leak_test.py`; deliver primarily through a read-only `/doctor fable-mode` route, with a `deep:model-benchmark` dimension noted as a secondary option.

**Critical Dependencies**: None. This is the first fable-5 phase to ship and reads only existing 002 lineage state files.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The fable-5 efficiency work proposes governor and doctrine changes whose effect on behavior (tool:text ratio, message length, self-referential openers, hedging density, evidence-backed completions) is currently unmeasured. Without a baseline captured before any change, "fable-5 efficiency" stays an assertion rather than a verified delta, and the research explicitly sequences measurement first (Land-first shortlist item 2, Implementation sequence step 1: "capture a behavioral baseline *before* any governor change, so movement is provable"). The only existing behavioral metric (`leak_test.py`) is hard-wired to `~/.claude/projects/`, so it cannot read the framework's runtime-agnostic deep-loop state.

### Purpose
Ship a runtime-agnostic measurement layer first: a `fable-metrics.cjs` script that computes five behavioral metrics from existing deep-loop state, non-blocking advisories that surface those signals at dispatch time, and a read-only `/doctor` route that operators can run on demand. Success is a captured baseline snapshot over the 002 lineage state files that later phases compare against.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- C1: A standalone `fable-metrics.cjs` that reads deep-loop state JSONL plus iteration markdown and computes five metrics: tool:text ratio, median words per message, "I'll/Let me" self-opener percentage, unsolicited-caveat percentage, and evidence-backed-completion ratio.
- C1: A captured baseline snapshot produced by running the script over the existing 002 lineage state files.
- C2: Non-blocking behavioral advisories emitted from `post-dispatch-validate.ts` on low tool:text ratio, self-openers, and high caveat density.
- C3: A read-only `/doctor fable-mode` delivery route (route entry, route asset, and a read-only diagnostic script).

### Out of Scope
- Promoting the advisories from advisory to blocking - the research keeps them advisory until baselines exist (open question 4); blocking gates are a later, owner-directed decision.
- Porting `leak_test.py` as-is - it is hard-wired to `~/.claude/projects/` and is Claude-path-coupled; this phase builds a runtime-agnostic replacement instead.
- Model-family-specific metric tuning - the script ships generic; per-model specialization is a later, parameterized layer.
- The governor capsule, fail-loud provenance, and subagent injection channel - those are separate fable-5 phases that depend on this baseline.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/metrics/fable-metrics.cjs` | Create | Standalone, runtime/model-agnostic metric script: reads deep-loop state JSONL and iteration markdown, computes the five behavioral metrics, and emits a baseline snapshot. Not a port of `leak_test.py`. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | Modify | Emit non-blocking advisories on low tool:text ratio, self-openers, and high caveat density. Advisories never set a blocking verdict. |
| `.opencode/commands/doctor/_routes.yaml` | Modify | Register a new read-only `fable-mode` route (`mutating: read-only`) that runs the diagnostic script. |
| `.opencode/commands/doctor/assets/doctor_fable-mode.yaml` | Create | Route asset describing the `fable-mode` diagnostic surface, its inputs, and its read-only behavior. |
| `.opencode/commands/doctor/scripts/fable-mode-check.cjs` | Create | Read-only diagnostic that invokes the metric computation and prints the five metrics plus the baseline comparison. No writes. |
| `.opencode/commands/deep/model-benchmark.md` | Modify (secondary option) | Optionally add a behavioral-metrics dimension to the benchmark lane. Noted as a secondary delivery; `/doctor fable-mode` is the recommended primary surface. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `fable-metrics.cjs` computes the five behavioral metrics from deep-loop state JSONL plus iteration markdown. | Running the script on the 002 lineage state files prints tool:text ratio, median words/msg, self-opener %, unsolicited-caveat %, and evidence-backed-completion ratio. |
| REQ-002 | The script is runtime/model-agnostic and reads no Claude-specific path. | `grep` confirms no `~/.claude` or `projects/` hard-coded path; the script accepts a spec-folder or state-file path argument. |
| REQ-003 | A baseline snapshot is captured over the 002 lineage state files. | A baseline snapshot artifact exists with the five metrics recorded for the 002 lineage corpus. |
| REQ-004 | The `/doctor fable-mode` route is read-only. | The `_routes.yaml` entry sets `mutating: read-only` and `gate3_location` states no writes; `route-validate.sh` passes. |
| REQ-005 | Advisories in `post-dispatch-validate.ts` never block. | The advisory code path adds informational output only and never sets a blocking/`error` verdict; a unit test asserts a low-tool:text fixture stays non-blocking. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The diagnostic script `fable-mode-check.cjs` prints the five metrics and the baseline comparison. | Invoking the route runs the script and renders the metrics with no file writes. |
| REQ-007 | The route asset `doctor_fable-mode.yaml` documents inputs, behavior, and read-only status. | The asset parses and matches the route entry; presentation follows the existing doctor asset pattern. |
| REQ-008 | The secondary `deep:model-benchmark` option is documented but not required. | `model-benchmark.md` notes the behavioral-metrics dimension as optional; the doc records `/doctor fable-mode` as the recommended primary surface. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `fable-metrics.cjs` runs cleanly on the existing 002 lineage state files and reports all five metrics for the corpus.
- **SC-002**: A baseline snapshot is captured and stored so later fable-5 phases can compute a before/after delta.
- **SC-003**: The `/doctor fable-mode` route is read-only (`route-validate.sh` passes) and the post-dispatch advisories are confirmed non-blocking by test.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None (first phase to ship) | This phase reads only existing 002 lineage state; no upstream blocker exists. | Baseline computed from committed 002 lineage state files. |
| Risk | Deep-loop state schema varies across lineages (codex vs opus vs small models) | Med | Parse defensively; skip records that lack expected fields and report coverage rather than crashing. |
| Risk | Heuristic metrics (self-opener %, caveat %) are approximate | Low | Document the heuristic definitions in the script and treat the baseline as a relative reference, not an absolute truth. |
| Risk | Advisory output mistaken for a blocking gate | Med | Keep advisories purely informational; assert non-blocking behavior with a test fixture (REQ-005). |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `fable-metrics.cjs` completes a single-corpus run over the 002 lineage state files in under a few seconds on a developer machine; it is a one-shot read, not a hot-path dependency.

### Security
- **NFR-S01**: The diagnostic reads only files inside the resolved spec/state path passed as an argument; it performs no network calls and writes nothing during a `/doctor` run.

### Reliability
- **NFR-R01**: A malformed or partial state file (for example the kimi lineage, which wedged after four iterations) must not abort the run; the script reports coverage and continues over the remaining lineages.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a lineage folder with no state JSONL and no iteration markdown is reported as zero-coverage, not an error.
- Maximum length: very large iteration files are streamed or read in full but bounded by available memory; the metric set is summary-only, so no per-token retention is required.

### Error Scenarios
- Malformed JSONL line: skip the line, increment a skipped-records counter, and continue.
- Missing expected field (no message text, no tool-call record): exclude that record from the affected ratio and note reduced coverage in the output.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 6 (3 create, 3 edit), one new script plus a runtime edit and a command route; spans system-spec-kit, deep-loop-runtime, and the doctor command |
| Risk | 12/25 | Auth: N, API: N, Breaking: N. The runtime edit touches a shared validation path; advisories must stay non-blocking |
| Research | 14/20 | Metric definitions and the structural-first sequence are settled by the 002 research; heuristic thresholds still need calibration |
| Multi-Agent | 8/15 | Two workstreams: the metric script/baseline and the delivery/advisory surfaces |
| Coordination | 6/15 | No upstream dependency; downstream phases consume the baseline |
| **Total** | **58/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Heuristic metric definitions drift from how later phases expect them, breaking the before/after comparison | M | M | Pin the metric definitions in the script header and the baseline snapshot; later phases reuse the same script, not a reimplementation |
| R-002 | The `post-dispatch-validate.ts` edit accidentally affects the blocking verdict | H | L | Confine the change to additive advisory output; cover it with a non-blocking fixture test (REQ-005) |
| R-003 | Lineage state schemas differ enough that coverage is low and the baseline is thin | M | M | Report per-lineage coverage; accept partial corpora; the baseline records which lineages contributed |
| R-004 | The new doctor route is mistakenly treated as mutating | L | L | Set `mutating: read-only` and a `gate3_location` of "n/a (read-only)"; `route-validate.sh` enforces the schema |

---

## 11. USER STORIES

### US-001: Capture a behavioral baseline (Priority: P0)

**As a** framework maintainer sequencing the fable-5 work, **I want** a baseline of the five behavioral metrics over existing deep-loop state, **so that** I can prove later governor and doctrine changes actually moved the needle.

**Acceptance Criteria**:
1. Given the 002 lineage state files, When I run `fable-metrics.cjs`, Then it prints tool:text ratio, median words/msg, self-opener %, unsolicited-caveat %, and evidence-backed-completion ratio and writes a baseline snapshot.

---

### US-002: Run a read-only fable-mode diagnostic (Priority: P1)

**As a** maintainer checking behavioral drift, **I want** a `/doctor fable-mode` route that reports the metrics without changing anything, **so that** I can inspect efficiency signals safely at any time.

**Acceptance Criteria**:
1. Given a spec folder with deep-loop state, When I run the `/doctor fable-mode` route, Then it renders the five metrics and the baseline comparison and writes no files.

---

### US-003: See non-blocking advisories at dispatch time (Priority: P1)

**As a** maintainer running deep-loop dispatches, **I want** post-dispatch advisories on low tool:text, self-openers, and high caveat density, **so that** I notice behavioral regressions without the advisory ever blocking a run.

**Acceptance Criteria**:
1. Given a dispatch whose output trips an advisory threshold, When `post-dispatch-validate.ts` runs, Then it emits an informational advisory and the run is not blocked.

---

## 12. OPEN QUESTIONS

- Measurement delivery: `/doctor fable-mode` (diagnostic) is recommended as primary; should the `deep:model-benchmark` dimension also ship now, or be deferred? (Research open question 3.)
- Behavioral advisories: keep them advisory in this phase; the promote-to-blocking decision is deferred to a later owner-directed phase. (Research open question 4.)
- Exact heuristic thresholds for the self-opener and caveat-density advisories: calibrate against the captured baseline before fixing values.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
