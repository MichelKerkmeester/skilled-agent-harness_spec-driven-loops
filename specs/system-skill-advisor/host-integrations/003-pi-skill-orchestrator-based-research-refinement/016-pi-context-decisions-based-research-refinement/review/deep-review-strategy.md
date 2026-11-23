---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.1.0
---

# Deep Review Strategy - Advisor Logic, Generation 5

Live strategy for the three native Opus passes that follow the DeepSeek generation.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
The system-skill-advisor logic: 154 source files under `.skilled/skills/system-skill-advisor/runtime/` and `hooks/` (tests, fixtures, benches and dist excluded), at HEAD `82af76f6754`. Target type: skill. Focus: The advisor's logic: runtime/ (lib, scorer, handlers, scripts including the Python fallback skill_advisor.py) and hooks/. Prose docs are out of scope unless code contradicts them.

Generation 4 (five DeepSeek passes, report archived at `review-archive/2026-11-23T21-41-09Z/review-report.md`) returned FAIL: one P1 (R2-P1-001, the launcher sets SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT=trusted while `advisor-server.ts:324-326` says a call without caller metadata stays untrusted), 14 P2s, failed scope and coverage gates and four deferred search rows (socket_hijack, python_ts_parity, duplication, lifecycle_and_derived_defect_scan). This generation starts a fresh registry: a finding that still holds is recorded again with its full repo-relative path.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Prose docs, except where code contradicts them.
- Test files as review targets; read them only to judge expected behaviour, and run them when a parity claim needs settling.
- No fixes: the review target is read-only.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: all 3 iterations run; convergence is telemetry only.
- Halt on a P0 that needs operator attention before more passes.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 2
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Running the parity suites instead of reading them settled python_ts_parity in two calls: vitest 206/206 in 9 files, python 130/0 (iteration 2)
- Comparing the client socket checks with the shared server's own threat comment exposed the missing owner check (iteration 2)
- One batched sed over every cited line rechecked all eight open findings in a single call (iteration 3)
- A path sweep over the catalog (123 paths, none missing) plus a caller grep found the claims that are false, not the paths (iteration 3)

---

## 9. WHAT FAILED
- Capturing the vitest exit through PIPESTATUS inside a subshell printed empty; only the summary line is evidence (iteration 2)
- The 24-call budget did not reach handlers/skill-graph/status.ts and validate.ts (iteration 2)
- The 24-call budget left playbook_capability unrun; INTENT_BOOSTERS against PHRASE_BOOSTS was compared only through the shared corpus, not table by table (iteration 3)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### heldBelow naming one holder (fusion.ts:545-558): the named binding is the lowest-scored holder, which is the one whose ceiling (min) set the final score, as the comment at :542-544 states. Not a defect. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: heldBelow naming one holder (fusion.ts:545-558): the named binding is the lowest-scored holder, which is the one whose ceiling (min) set the final score, as the comment at :542-544 states. Not a defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: heldBelow naming one holder (fusion.ts:545-558): the named binding is the lowest-scored holder, which is the one whose ceiling (min) set the final score, as the comment at :542-544 states. Not a defect.

### isError loss in toMCP: the skill-graph handlers never set isError. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: isError loss in toMCP: the skill-graph handlers never set isError.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: isError loss in toMCP: the skill-graph handlers never set isError.

### NaN from age-haircut.ts:37-40 on a malformed timestamp: the only live caller passes `derivedGeneratedAt` validated through isoTimestampOrNull (projection.ts:1334). Not reachable. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: NaN from age-haircut.ts:37-40 on a malformed timestamp: the only live caller passes `derivedGeneratedAt` validated through isoTimestampOrNull (projection.ts:1334). Not reachable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: NaN from age-haircut.ts:37-40 on a malformed timestamp: the only live caller passes `derivedGeneratedAt` validated through isoTimestampOrNull (projection.ts:1334). Not reachable.

### Prompt-time refusal as a separate finding: folded into P2-001 as defence-in-depth evidence, because hooks reach the daemon only through the CLI. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Prompt-time refusal as a separate finding: folded into P2-001 as defence-in-depth evidence, because hooks reach the daemon only through the CLI.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt-time refusal as a separate finding: folded into P2-001 as defence-in-depth evidence, because hooks reach the daemon only through the CLI.

### Propagate-apply trust predicate mismatch: fails closed; no write path is reachable without trust. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Propagate-apply trust predicate mismatch: fails closed; no write path is reachable without trust.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Propagate-apply trust predicate mismatch: fails closed; no write path is reachable without trust.

### python_ts_parity disagreement: both suites pass (206/206 vitest, 130/0 Python); no divergent case within the shared corpus. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: python_ts_parity disagreement: both suites pass (206/206 vitest, 130/0 Python); no divergent case within the shared corpus.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: python_ts_parity disagreement: both suites pass (206/206 vitest, 130/0 Python); no divergent case within the shared corpus.

### STOP_WORDS as a duplicated vocabulary: the Python and TypeScript sets serve different roles and are not meant to agree. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: STOP_WORDS as a duplicated vocabulary: the Python and TypeScript sets serve different roles and are not meant to agree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: STOP_WORDS as a duplicated vocabulary: the Python and TypeScript sets serve different roles and are not meant to agree.

### Symlink escape through cross-skill-edges apply: discovery skips symlinks, and the apply guard receives the root. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Symlink escape through cross-skill-edges apply: discovery skips symlinks, and the apply guard receives the root.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Symlink escape through cross-skill-edges apply: discovery skips symlinks, and the apply guard receives the root.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining; all four dimensions are covered (3 of 3 iterations used). - Focus area: synthesis. Carry G5-I1-P1-001 and G5-I2-P1-001 as the two active P1s, eight P2s. - Reason: max-iterations stop policy reached. - Rotation status: correctness, security, traceability, maintainability covered (4/4). - Blocked/productive carry-forward: do not reopen parity or the cross-skill-edges symlink path; playbook_capability was never run. - Required evidence: synthesis rechecks the two P1s at file:line before the verdict. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
[Populated during initialization from the continuity ladder and ripgrep recipes, if any prior work exists]

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: [from config]
- Convergence threshold: [from config]
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=[from config.sessionId], parentSessionId=[from config.parentSessionId], generation=[from config.generation], lineageMode=[from config.lineageMode]
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Severity threshold: [from config.severityThreshold]
- Review target type: [from config.reviewTargetType]
- Cross-reference checks: core=[from config.crossReference.core], overlay=[from config.crossReference.overlay]
- Started: [timestamp]
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
