# Deep Review Strategy - Session Tracking Template

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
specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers (spec-folder) — generation 9 lineage deepseek-max-1

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
Not a remediation pass: the target tree is read-only. Not the merge verdict: the fan-out merge recomputes it from lineage registries. Not a rerun of the build suites; only the tree as it stands is read.

---

## 5. STOP CONDITIONS
Stop policy max-iterations, cap 7. No lineage-written terminal_gates row: the orchestrator computes it with terminal-gates.cjs after the run.

---

<!-- ANCHOR:completed-dimensions -->
## 6. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 7. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Resolving a requirement against both gate copies at once (TypeScript and Python) settled every ambiguous clause in one read and exposed the shared-list contract behind the drift guard (iterations 2, 3, 6).
- Running the packet's own acceptance-tail checker (`scratch/citations/evidence-tails.py`) after reading it for write paths turned the citation question into a measured `problems=0` rather than an impression (iteration 5).
- Tracing a suspected divergence through both layers before reporting it retired four hypotheses (doctor-gate no-edit, unescaped pattern, line flattening, astral cut) instead of filing them as phantom findings (iterations 1, 2).
- Counting the checklist's priority-tagged rows before trusting the Verification Summary disproved a would-be drift finding and kept the report honest (iteration 5).

---

## 9. WHAT FAILED
- Checking acceptance citations against the process working directory rather than packet-relative paths reported every short-form `implementation-summary.md:NNN` cell as a missing file; resolving each path against the packet first removed all 23 false hits (iteration 1).
- Reading the Verification Summary as a count of CHK-tagged rows only suggested a totals mismatch; counting every priority-tagged row, legend rows excluded, showed the summary is correct (iteration 5).
- Searching for `DEPTH_WORDING` across the repo hit a raw transcript under `scratch/` and flooded the read; restricting the search to `.skilled` was the workable form (iteration 3).

---

<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
### `AC-028`'s evidence cell (the eighth-round row) versus its 186 files / 3,518 passed count: recorded as a traceability item for a later pass, not a correctness defect in code. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: `AC-028`'s evidence cell (the eighth-round row) versus its 186 files / 3,518 passed count: recorded as a traceability item for a later pass, not a correctness defect in code.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### `REQ-006` naming the wrong test file: ruled out. The requirement as amended names the shared fixture and `command-attach-guards.vitest.ts`, and that file holds the depth-word `undefined` cases at `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:539`. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: `REQ-006` naming the wrong test file: ruled out. The requirement as amended names the shared fixture and `command-attach-guards.vitest.ts`, and that file holds the depth-word `undefined` cases at `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:539`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### `REQ-011`'s alias clause against the hub: ruled out. Both hub files carry the two aliases and neither carries `autonomous research`, so ADR-007's narrowed clause holds. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: `REQ-011`'s alias clause against the hub: ruled out. Both hub files carry the two aliases and neither carries `autonomous research`, so ADR-007's narrowed clause holds.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### `REQ-025`'s claim that `typedCommandIn` has no production reader: ruled out as drift. The export exists, the boundary tests import it (`.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts:176`), and no production path was found calling it. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: `REQ-025`'s claim that `typedCommandIn` has no production reader: ruled out as drift. The export exists, the boundary tests import it (`.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts:176`), and no production path was found calling it.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### `T084` as missing evidence: ruled out. It is the only unticked task and its stated reason matches `AC-040`'s `Unmet` status. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: `T084` as missing evidence: ruled out. It is the only unticked task and its stated reason matches `AC-040`'s `Unmet` status.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A forged command through the degraded renderer: ruled out at `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489`, whose tracked-table lookup drops a command the row's skill does not own. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: A forged command through the degraded renderer: ruled out at `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489`, whose tracked-table lookup drops a command the row's skill does not own.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### ADR status as drift: ruled out. Every ADR reads `Accepted`, and every waiving ADR names the row it waives. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: ADR status as drift: ruled out. Every ADR reads `Accepted`, and every waiving ADR names the row it waives.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Astral-character cut divergence between the transports: ruled out at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:889`, which counts two units per non-BMP character and never splits one. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: Astral-character cut divergence between the transports: ruled out at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:889`, which counts two units per non-BMP character and never splits one.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Changelog claiming refused asks are skipped: ruled out. The chart carries the exception at `.skilled/changelog/skilled/v4.2.0.0.md:482`, which withholds the diagnosis only when the complaint also refuses a run or a fix. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: Changelog claiming refused asks are skipped: ruled out. The chart carries the exception at `.skilled/changelog/skilled/v4.2.0.0.md:482`, which withholds the diagnosis only when the complaint also refuses a run or a fix.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Comment-hygiene violation in the test files: ruled out for comments. The 232 pattern-bearing lines in the in-scope code are assertion labels and fixture strings, not comments; none of them is a comment line. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: Comment-hygiene violation in the test files: ruled out for comments. The 232 pattern-bearing lines in the in-scope code are assertion labels and fixture strings, not comments; none of them is a comment line.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Continuity `_memory.next_safe_action` saying "Fix the nine generation 8 P2s, then run generation 9": ruled out as drift. The field is a save-time pointer written at 20:38, before the twelfth round landed; it describes the next action at the moment of that save, and the twelfth-round rows at `implementation-summary.md:198` record the round that followed. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: Continuity `_memory.next_safe_action` saying "Fix the nine generation 8 P2s, then run generation 9": ruled out as drift. The field is a save-time pointer written at 20:38, before the twelfth round landed; it describes the next action at the moment of that save, and the twelfth-round rows at `implementation-summary.md:198` record the round that followed.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Doctor-gate disagreement on a no-edit stuck complaint: ruled out. Both layers withhold it, through `isNoEditRequest` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1600` and `isRunRefused` at `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1082`, because `RUN_REFUSED` reads "don't change anything" as a refused fix. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: Doctor-gate disagreement on a no-edit stuck complaint: ruled out. Both layers withhold it, through `isNoEditRequest` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1600` and `isRunRefused` at `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1082`, because `RUN_REFUSED` reads "don't change anything" as a refused fix.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Drift-guard coverage gap: ruled out for the lists the requirement names. Each exported list is either a `VOCABULARY_PAIRS` row, a pattern pair, or a listed non-compared pattern with a reason. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: Drift-guard coverage gap: ruled out for the lists the requirement names. Each exported list is either a `VOCABULARY_PAIRS` row, a pattern pair, or a listed non-compared pattern with a reason.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Next Focus line-flattening in the dashboard: ruled out. The dashboard pushes the multi-line focus string as one array element (`reduce-state.cjs:2896`), so its line breaks survive; the strategy writes it through `replaceAnchorSection`, which joins with `\n`. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: Next Focus line-flattening in the dashboard: ruled out. The dashboard pushes the multi-line focus string as one array element (`reduce-state.cjs:2896`), so its line breaks survive; the strategy writes it through `replaceAnchorSection`, which joins with `\n`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### ReDoS through an unbounded prefix scan: ruled out for the lead-reading patterns by the 400-character window in both copies; the remaining patterns are fixed alternations without nested quantifiers over the prompt. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: ReDoS through an unbounded prefix scan: ruled out for the lead-reading patterns by the 400-character window in both copies; the remaining patterns are fixed alternations without nested quantifiers over the prompt.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Reducer readability as a follow-on-change hazard: not reported. The dialect fallbacks and the finding-id handling are documented where they are implemented, and a clearer shape would be a refactor outside this review's scope rather than a defect. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: Reducer readability as a follow-on-change hazard: not reported. The dialect fallbacks and the finding-id handling are documented where they are implemented, and a clearer shape would be a refactor outside this review's scope rather than a defect.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### REQ-035's mode-free clause against ADR-008: ruled out. The four `servedRun: "none"` rows are exactly what ADR-008 records, and the hub still serves the ask without a command. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: REQ-035's mode-free clause against ADR-008: ruled out. The four `servedRun: "none"` rows are exactly what ADR-008 records, and the hub still serves the ask without a command.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### REQ-039's baseline as stale: ruled out. `capturedAt` is the pinned scoring date, `capturedAtSha` is a 2026-11-23 commit, and the file's last commit is this packet's, so the recapture is in the tree. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: REQ-039's baseline as stale: ruled out. `capturedAt` is the pinned scoring date, `capturedAtSha` is a 2026-11-23 commit, and the file's last commit is this packet's, so the recapture is in the tree.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### REQ-047 as short of rows: ruled out. The fourth mode-free row is the singular prompt AC-055 also names. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: REQ-047 as short of rows: ruled out. The fourth mode-free row is the singular prompt AC-055 also names.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### The timeline's report pointer as dangling: ruled out for the reason in the edge cases — the milestone is in progress and a restart archives the prior report by design. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: The timeline's report pointer as dangling: ruled out for the reason in the edge cases — the milestone is in progress and a restart archives the prior report by design.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Timeline one round short: ruled out. The generation-8 entry at `timeline.md:45` names the twelfth round and the P2 set it answers. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: Timeline one round short: ruled out. The generation-8 entry at `timeline.md:45` names the twelfth round and the P2 set it answers.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Unescaped command name in `DOCTOR_NAMING_LED`: ruled out as a live defect. The value is a fixed export (`/doctor:deep-loop`), whose characters are literal in a `RegExp` string, and the pattern is rebuilt from the export on every load; no prompt text reaches the pattern's source. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: Unescaped command name in `DOCTOR_NAMING_LED`: ruled out as a live defect. The value is a fixed export (`/doctor:deep-loop`), whose characters are literal in a `RegExp` string, and the pattern is rebuilt from the export on every load; no prompt text reaches the pattern's source.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Verification Summary totals as a third drift: ruled out. Counting the priority-tagged rows by prefix gives 12 P0, 13 P1 and 1 P2 before the legend rows are excluded, and the summary states exactly those totals with 11 of 12 P0 ticked, which is `CHK-020`'s open state. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: Verification Summary totals as a third drift: ruled out. Counting the priority-tagged rows by prefix gives 12 P0, 13 P1 and 1 P2 before the legend rows are excluded, and the summary states exactly those totals with 11 of 12 P0 ticked, which is `CHK-020`'s open state.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

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
## 12. NEXT FOCUS
- Dimension: none remaining (all four configured dimensions are covered and both core protocols read `pass`)
- Focus area: synthesis of this lineage's findings into its own review report; the cross-lineage merge and the release verdict belong to the fan-out root.
- Reason: the iteration cap is reached, the stop policy is `max-iterations`, and the remaining work is synthesis rather than another review pass.
- Rotation status: correctness, security, traceability and maintainability all covered; `spec_code` and `checklist_evidence` at `pass`.
- Blocked/productive carry-forward: productive; no approach was blocked.
- Required evidence: the findings registry the reducer owns, and the five P2 rows this run recorded.
- No recovery note: this pass was not a recovery iteration.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Prior work: generation 8 review-archive/20261124T203829Z found 0 P0, 0 P1 and 9 P2; the twelfth fix round (T112 to T114) closed them. The operator focus names REQ-001 to REQ-053, ADR-001 to ADR-009, AC-001 to AC-061 and T112 to T114.

### Bounded Context Snapshot

Populated at init from the packet and the dispatch focus. Pointer-based and scoped to the declared review target.

- Target pointers: packet docs spec.md, plan.md, tasks.md, acceptance-criteria.md, decision-record.md (ADR-001 to ADR-009), implementation-summary.md, timeline.md; gate code command-attach.ts, scorer/fusion.ts, scorer/lanes/explicit.ts, skill-advisor-cli.ts, scripts/skill_advisor.py; fixtures and tests under .skilled/skills/system-skill-advisor/runtime/tests/; reducer .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs
- Behavior claims: REQ-001 to REQ-053 as amended by ADR-001 to ADR-009; AC-001 to AC-061 and their status cells; the twelfth fix round T112 to T114; the fan-out focus of generation 9.
- Reuse and conventions: one shared fixture read by both gate copies; exported word lists compared by the drift guard; reducer-owned registry and dashboard; findings cite the full repo-relative path.
- Review risks and gaps: closure counts can lag a fix round; the continuity _memory fields were written before the twelfth round; no resource-map.md, so its coverage gate is skipped; build suites are not rerun, so counts are read from the record rather than re-measured.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 3, 6, 7 | REQ-001 to REQ-053 mapped to a live file:line or ADR section; no requirement left unmapped |
| `checklist_evidence` | core | pass | 5, 7 | 61 AC rows, 114 tasks and 26 checklist rows read at row level; acceptance-tail checker `problems=0`; two P2 drifts recorded |
| `skill_agent` | overlay | notApplicable | - | No agent definition changed in this packet; the SKILL.md edits do not alter the agent contract |
| `agent_cross_runtime` | overlay | notApplicable | - | No agent file or runtime mirror is part of the packet's change set |
| `feature_catalog_code` | overlay | notApplicable | - | No feature catalog entry names the deep-loop offer gate |
| `playbook_capability` | overlay | notApplicable | - | No playbook describes this gate |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| 72 scope files (packet docs, gate code, tests, reducer, changelog) | - | - | 0 findings | not started |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-1-1795552859377-13gxwk, parentSessionId=2026-11-24T19:58:39.000Z, generation=9, lineageMode=restart
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence, overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-11-24T20:44:12.287Z
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
