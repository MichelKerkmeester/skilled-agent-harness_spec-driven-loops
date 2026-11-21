# Deep Review Strategy - opus lineage

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

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
21c4b325b5a..de32abbb74d -- .skilled/skills/system-deep-loop .skilled/commands/deep .skilled/agents .claude/agents .codex/agents .pi/agents .dsh/agents .vibe/agents (the expansive-depth program: runtime code and tests, command YAML and presentation, agents and their runtime mirrors, skill docs, playbooks and catalogs; specs/ evidence and spec-packet artifacts excluded)

Depth mode: expansive. Frontier scope for this lineage: F-1-002 (frontier-admit.cjs engine), F-1-004 (/deep:review and /deep:research command surface), F-1-006 (skill docs, playbooks, catalogs, agent definitions and runtime mirrors).

Operator focus: Every iteration also covers three angles, read through the range diff (git diff 21c4b325b5a..de32abbb74d -- <file>). 1) Overengineering, per .skilled/repo-rules/prevent-overengineering.md: abstractions, options, flags, layers, fallbacks or files no current requirement earns, and duplicated logic or prose (one rule restated across YAML, presentation, review.md, references and playbooks); name what to delete or collapse. 2) Operator UX: flag ergonomics, error and warning text, setup prompts, dashboard and report clarity, and the cost of discovering how to use --extend, --depth-mode=expansive and the --frontier-max-depth/--frontier-max-nodes flags. 3) Cross-CLI runtime parity: the same behavior across the claude, opencode, codex, pi, devin, cursor, dsh and vibe executors and their agent and command mirrors (.claude .codex .pi .dsh .vibe against .skilled), plus Node and OS portability of the scripts (paths, shells, BSD vs GNU tools). Cite file:line for every finding.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- specs/ evidence and spec-packet artifacts.
- Frontier nodes dealt to other lineages (fan-out runner/merge, reducers, divergent pivot) except as cross-reference context.
- Generated artifacts (compiled routing, skill graph, compiled command contracts).

---

## 5. STOP CONDITIONS
- Frontier drained (every node answered) and legal-stop gates pass.
- maxIterations=24 reached.
- 120 minute duration budget reached.

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
- P2 (Suggestions): 12
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Probing exported helpers with node -e gave hard evidence for dedupe and relevance edge cases (iteration 1)
- Cross-reading the flag table against the producing script lines (reduce-state, convergence) exposed doc drift quickly (iteration 2)
- Sentence-presence counts with grep -o verify mirror parity across single-line TOML mirrors (iteration 3)
- Probing checkProposal with this lineage's real config proved the prefix-only relevance check (iteration 4)
- Reading the decision record before raising spec_code mismatches separated deliberate rulings from defects (iteration 7)
- A repo-wide phrasing grep turned three single-site doc findings into one complete site list (iteration 9)
- Running the real stop decision every iteration surfaced a live stuck close that static reading would have missed (iteration 10)
- Reading the gate's own input derivation explained the block faster than re-running recovery (iteration 14)

---

## 9. WHAT FAILED
- Running vitest is out of bounds (writes .vitest-cache outside the lineage); rely on direct reads and node probes (iteration 1)
- Clean traceability passes (iterations 8-9) counted as no-progress and triggered stuck recovery on F-1-004 (iteration 10)
- A productive iteration (one new P2 at ratio 0.05) still counted as stuck and exhausted F-2-007 after one dimension (iteration 13)
- Thirteen iterations of ledger rows shaped like the prompt-pack example were ignored by the graphless fallback gate (iteration 14)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `checkCycle` removal: spec-mandated sixth check (ruled out in iteration 1). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `checkCycle` removal: spec-mandated sixth check (ruled out in iteration 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checkCycle` removal: spec-mandated sixth check (ruled out in iteration 1).

### A second code-side universe definition: only `buildDimensionUniverse` builds it, and the budget calls it. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A second code-side universe definition: only `buildDimensionUniverse` builds it, and the budget calls it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A second code-side universe definition: only `buildDimensionUniverse` builds it, and the budget calls it.

### A state-transition defect in `closeNode`: guards verified again by direct read. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: A state-transition defect in `closeNode`: guards verified again by direct read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A state-transition defect in `closeNode`: guards verified again by direct read.

### Band budget roll-up: `carry` only flows to a later band (`:361-373`), never up. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Band budget roll-up: `carry` only flows to a later band (`:361-373`), never up.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Band budget roll-up: `carry` only flows to a later band (`:361-373`), never up.

### Band roll-up: no path carries budget to a shallower band. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Band roll-up: no path carries budget to a shallower band.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Band roll-up: no path carries budget to a shallower band.

### BSD versus GNU portability defects in new playbook commands: none found. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: BSD versus GNU portability defects in new playbook commands: none found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: BSD versus GNU portability defects in new playbook commands: none found.

### Climbing paths read as ranges: `(?:^|\/)\.\.(?:\/|$)` excludes them (`frontier-admit.cjs:592`), pinned by the test at `frontier-admit-review.vitest.ts:534`. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Climbing paths read as ranges: `(?:^|\/)\.\.(?:\/|$)` excludes them (`frontier-admit.cjs:592`), pinned by the test at `frontier-admit-review.vitest.ts:534`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Climbing paths read as ranges: `(?:^|\/)\.\.(?:\/|$)` excludes them (`frontier-admit.cjs:592`), pinned by the test at `frontier-admit-review.vitest.ts:534`.

### Cross-lineage node id collision: ruled out by merge-time qualification (`fanout-merge.cjs:761`). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Cross-lineage node id collision: ruled out by merge-time qualification (`fanout-merge.cjs:761`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cross-lineage node id collision: ruled out by merge-time qualification (`fanout-merge.cjs:761`).

### Dead exports in frontier-admit: each export has a caller. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Dead exports in frontier-admit: each export has a caller.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dead exports in frontier-admit: each export has a caller.

### Destructive or permission-bypassing playbook commands: none found. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Destructive or permission-bypassing playbook commands: none found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Destructive or permission-bypassing playbook commands: none found.

### Extend arithmetic double-counting redispatched runs: it counts distinct iteration numbers. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Extend arithmetic double-counting redispatched runs: it counts distinct iteration numbers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Extend arithmetic double-counting redispatched runs: it counts distinct iteration numbers.

### Lineage default budget mismatch (12 native, 7 CLI): code at `fanout-run.cjs:386,720` matches the doc. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Lineage default budget mismatch (12 native, 7 CLI): code at `fanout-run.cjs:386,720` matches the doc.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lineage default budget mismatch (12 native, 7 CLI): code at `fanout-run.cjs:386,720` matches the doc.

### Mirror drift in the `.vibe` TOML: the two-line diff is the single-string storage format, not missing content. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Mirror drift in the `.vibe` TOML: the two-line diff is the single-string storage format, not missing content.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mirror drift in the `.vibe` TOML: the two-line diff is the single-string storage format, not missing content.

### New tool dependency: `jq` predates the range in this playbook set. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: New tool dependency: `jq` predates the range in this playbook set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New tool dependency: `jq` predates the range in this playbook set.

### Over-engineering of `checkCycle`: ids are fresh and parents must exist, so a cycle needs a hand-edited store; the check is part of the spec's six-check contract, so it is kept as a cheap guard rather than flagged. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Over-engineering of `checkCycle`: ids are fresh and parents must exist, so a cycle needs a hand-edited store; the check is part of the spec's six-check contract, so it is kept as a cheap guard rather than flagged.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Over-engineering of `checkCycle`: ids are fresh and parents must exist, so a cycle needs a hand-edited store; the check is part of the spec's six-check contract, so it is kept as a cheap guard rather than flagged.

### Path traversal through `--output`: not leaf-reachable. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Path traversal through `--output`: not leaf-reachable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Path traversal through `--output`: not leaf-reachable.

### Permission widening in agent mirrors: no frontmatter change in range. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Permission widening in agent mirrors: no frontmatter change in range.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Permission widening in agent mirrors: no frontmatter change in range.

### Prototype pollution through proposal JSON: spreads define own properties only. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Prototype pollution through proposal JSON: spreads define own properties only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prototype pollution through proposal JSON: spreads define own properties only.

### REQ-014 code defect: the code follows decision-record Q011, a later operator ruling; the spec line is the stale side and specs are outside the findings target. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: REQ-014 code defect: the code follows decision-record Q011, a later operator ruling; the spec line is the stale side and specs are outside the findings target.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: REQ-014 code defect: the code follows decision-record Q011, a later operator ruling; the spec line is the stale side and specs are outside the findings target.

### Research/review playbook duplication as overengineering: the shared lines are the template. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Research/review playbook duplication as overengineering: the shared lines are the template.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Research/review playbook duplication as overengineering: the shared lines are the template.

### Shell injection through `--extend`/`--extend-minutes`: digit-validated before the step. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Shell injection through `--extend`/`--extend-minutes`: digit-validated before the step.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shell injection through `--extend`/`--extend-minutes`: digit-validated before the step.

### Shell injection through frontier node ids: minted by the engine. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Shell injection through frontier node ids: minted by the engine.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shell injection through frontier node ids: minted by the engine.

### Shell injection through review focus, review target or fan-out config: passed by file since this range. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Shell injection through review focus, review target or fan-out config: passed by file since this range.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shell injection through review focus, review target or fan-out config: passed by file since this range.

### Six-check order drift between code, catalog and loop-protocol: identical order in all three. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Six-check order drift between code, catalog and loop-protocol: identical order in all three.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Six-check order drift between code, catalog and loop-protocol: identical order in all three.

### Upgrading the three re-examined P2 findings: each lacks either reach inside the stated contract or runtime impact. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Upgrading the three re-examined P2 findings: each lacks either reach inside the stated contract or runtime impact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Upgrading the three re-examined P2 findings: each lacks either reach inside the stated contract or runtime impact.

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
- Dimension: correctness - Focus area: stop check; synthesis when the gate passes - Reason: blocked-stop recovery evidence recorded - Rotation status: frontier closed; all dimensions covered - Required evidence: convergence.cjs gate output Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Prior archived review exists at review-archive/20261119T183614Z (not read as evidence; this lineage reviews fresh).

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
- Max iterations: 24
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-opus-1795113418367-pvzn7z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-11-19T18:38:12.356Z
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
