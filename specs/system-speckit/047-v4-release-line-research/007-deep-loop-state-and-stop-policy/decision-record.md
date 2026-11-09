---
title: "Decision Record: Phase 7: deep-loop-state-and-stop-policy"
description: "Decisions taken without an operator while planning and implementing the single-executor dispatch fixes: the stop-policy waiver, workflow deviations and every worker and review call."
trigger_phrases:
  - "deep loop state and stop policy decision record"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/007-deep-loop-state-and-stop-policy"
    last_updated_at: "2026-11-09T00:00:00Z"
    last_updated_by: "remediation-orchestrator-a"
    recent_action: "Closed the phase with every worker, review and adjudication recorded"
    next_safe_action: "Start phase 008"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-a-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 7: deep-loop-state-and-stop-policy

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Waive moving stop policy and minIterations into code

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation Orchestrator A (operator unavailable; goal G3 pre-authorizes the call) |

---

<!-- ANCHOR:adr-001-context -->
### Context

V06 (P2) notes that stop policy and `minIterations` are evaluated in the workflow YAML (`step_check_convergence`) while `convergence.cjs` has no reference to them. The verifier downgraded it because the YAML implements both correctly.

### Constraints

- Moving the rules into code changes the owner of every stop decision across research and review, a redesign rather than a fix.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: no code change for V06; the YAML stays the owner of stop policy, and this record says so.

**How it works**: phase 007 fixes the inputs the YAML stop rules read (iteration counts, error rows) instead of relocating the rules.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep the YAML as owner** | No behavior change; correct today | Rules stay out of unit-test reach | 8/10 |
| Move the rules into `convergence.cjs` | Testable in code | Redesign of a shared stop path with no failing case behind it | 3/10 |

**Why this one**: no requirement fails today, and the restraint rule asks for a failing case before the costlier move.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The phase stays scoped to verified defects.

**What it costs**:
- Stop-policy logic remains prose plus heredocs in the YAML.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| YAML and code drift on stop rules | L | The contract and parity tests already read the YAML |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | V06 is in the phase scope and needs a recorded decision |
| 2 | **Beyond Local Maxima?** | PASS | The move to code was weighed |
| 3 | **Sufficient?** | PASS | The verifier found the YAML correct |
| 4 | **Fits Goal?** | PASS | Goal G3 fixes defects, and V06 is not one |
| 5 | **Open Horizons?** | PASS | A later packet can move the rules if a failure appears |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Nothing for V06.

**How to roll back**: not applicable.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:run-decisions -->
## Run Decisions Log

| ID | Decision | Why | Evidence |
|----|----------|-----|----------|
| D-01 | Plan step 5 inline fallback instead of four `@context` agents; no per-phase `research/research.md` | Leaf orchestrator; the parent synthesis holds the evidence | `speckit-plan.yaml` step_5 fallback; `../research/research.md` |
| D-02 | Skip the continuity writer; continuity frontmatter refreshed by hand | V28: the writer can fall back to the shared checkout | `../research/research.md` V28 |
| D-03 | Commit with the lead-approved remint bypass after `repair-derived` under the lock | Same shared-worktree constraint as phase 006 D-12 | lead approval |
| D-04 | Workers: cli-codex `gpt-6-luna` high fast for the reducer counting and delta fix, the state-row projection, the readiness binding, the executor-unavailable classifier and halt, the confirm-gate lock refresh, the fan-out cap check, the unknown-option refusal and the four review fixes; cli-pi `opencode-go/deepseek-v4.1-flash` max for the council confirm validation copy, the `iteration_count` text in four YAMLs and the cross-family review | Goal G4 tiers; cli-devin stays exhausted (phase 006 D-05) | worker logs in the orchestrator scratchpad |
| D-05 | Treat the sandboxed `executor-audit` ancestry failure and the fan-out checkpoint timing failure as sandbox artifacts | Both pass outside the codex sandbox; the sandbox blocks `/bin/ps` and slows process start past an 800 ms deadline | outside-sandbox run of both files: all passed |
| D-06 | Classify the one `authorized-ledger.vitest.ts` failure in the first full run as load-induced, not a regression | It failed while a review worker ran in parallel; alone it passed 53 of 53, and a full rerun with no parallel load passed 174 files, 2876 tests, 0 failed. No ledger code changed in this phase | full rerun `Tests 2876 passed / 8 skipped`, exit 0 |
| D-07 | Restore `runtime/database/council-graph.sqlite` and keep it out of the commit | The council suite rewrites the tracked database; it is test residue, not a phase change | `git checkout -- <path>` by the orchestrator after the final gate |
| D-08 | Review adjudication (DeepSeek reviewer, verdict CONDITIONAL, 1 P1 and 4 P2): fixed all five | P1: distinct counting made `current_iteration = iteration_count + 1` collide with existing sparse run numbers on resume; the next run is now `max(highest_run, iteration_count) + 1` in all four loop YAMLs. P2: the review reducer dashboard now counts distinct runs; `step_hydrate_summary_metrics` counts distinct runs; the classifier scans stderr plus only error-shaped tail lines of stdout; the research YAMLs check executor-unavailable before `step_reduce_state` can refresh the state-log projection | reviewer report; outside-sandbox runs of `executor-audit` and `deep-review-state-reducer`: 90 passed |
| D-09 | Leave the resume and restart bookkeeping fields (`continuedFromRun`, `continuedFromRunId`) on `iteration_count` | They are emitted in `step_classify_session`, before `step_read_state` binds `highest_run`; rebinding them needs a new step, which is outside this phase. On a sparse legacy log they report the distinct count, not the last run number | Luna report for the counting fix; recorded as a known limitation |
| D-10 | Leave the `if_other_failure` error row on the state log as it is | The reviewer noted it shares the ephemeral-row risk; it predates this phase and is not one of its verified findings | recorded as an out-of-scope observation |
<!-- /ANCHOR:run-decisions -->
