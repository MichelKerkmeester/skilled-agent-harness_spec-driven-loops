# Deep Review Strategy

## Topic
Review the 1,997-file `v4.0.0.2..v4.0.0.3` release manifest for observable correctness, security, traceability and maintainability defects. The manifest was checked for unique, existing, repo-relative paths. No source or packet file is writable.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] maintainability

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability

<!-- /ANCHOR:completed-dimensions -->
## Non-Goals
- Do not change reviewed code, tests, commands, skills or packet docs.
- Do not run builds, tests, validators, git writes, external executors or continuity saves.
- Keep every created or modified artifact under this lineage directory.

## Stop Conditions
Run all 10 iterations. Treat convergence as telemetry only. The synthesis state must record `stopReason: maxIterationsReached`.

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## What Worked
- Manifest validation plus targeted `git diff` reads provides evidence for the declared release range.
- (Iteration 1) Direct reads bounded the release-update correctness pass.
- (Iteration 2) Following the shared validator to commit, agent, pre-push and CI callers confirmed the oversized-input finding affects the common gate.

## What Failed
- None.

## Exhausted Approaches
None.

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## Ruled Out Directions
None.

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: maintainability - Focus area: inspect shared fan-out and executor-routing boundaries for duplicated configuration or unclear ownership, expanding into changed callers only where the evidence points. - Reason: the initial correctness, security and traceability passes now cover separate release surfaces. - Rotation status: fresh dimension; no maintainability pass has run. - Blocked/productive carry-forward: no blocked review direction; direct source reads and manifest-scoped diffs were productive. - Required evidence: source-of-truth executor configuration, its fan-out consumers and the matching changed tests or documentation.

<!-- /ANCHOR:next-focus -->
## Known Context
### Bounded Context Snapshot
- Target: the release-range file list in the packet's `goal-file-manifest.txt`.
- Behavior claims: spec and plan describe a findings-only release review, with lineages capped by their configured iteration counts.
- Reuse/conventions: commit range is `v4.0.0.2..v4.0.0.3`; direct reads and `git diff` are read-only evidence.
- Risk and gaps: full scope spans 1,997 files, so each pass samples a distinct subsystem; tests are not executed by this lineage.
- Resource map: not present at initialization; coverage gate skipped.

## Cross-Reference Status
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3 | Per-lineage caps align; resume-event handoff is incomplete. |
| `checklist_evidence` | core | partial | 3 | Setup claims are recorded; raw route-smoke output and containment attribution remain unresolved. |
| `feature_catalog_code` | overlay | pending | — | Apply where a manifest surface has an applicable feature catalog. |
| `playbook_capability` | overlay | pending | — | Apply to executable review scenarios encountered in scope. |

## Files Under Review
The validated 1,997-path scope is enumerated by the read-only packet manifest. Iteration records name the exact selected files and lines. Initial focus: `.skilled/release/`, doctor commands and scripts, Git hooks, session hooks and runtime integrations, Pi surfaces and GitHub workflows.

| Area | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| Release-update safety | correctness | 1 | 0 | partial |
| Message contract and runtime gates | security | 2 | 1 P1 | partial |
| Remaining initial-focus surfaces | — | — | 0 | partial |

## Review Boundaries
- Max iterations: 10
- Convergence threshold: 0.1
- Stop policy: max-iterations
- Convergence mode: default; telemetry only
- Session: `fanout-luna-max-1791260058145-vgna23`
- Generation: 1
- Lineage mode: new
- Target type: spec-folder
- Executor: cli-pi, model gpt-6-luna, reasoning effort max
- Core protocols: `spec_code`, `checklist_evidence`
- Overlay protocols: `feature_catalog_code`, `playbook_capability`
- Per-iteration artifact paths: `iterations/iteration-NNN.md`, `deltas/iter-NNN.jsonl`

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `checklist_evidence`: not evaluated in this correctness pass; scheduled for the traceability pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: not evaluated in this correctness pass; scheduled for the traceability pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: not evaluated in this correctness pass; scheduled for the traceability pass.

### `checklist_evidence`: not evaluated in this security pass; planned for the traceability pass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence`: not evaluated in this security pass; planned for the traceability pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: not evaluated in this security pass; planned for the traceability pass.

### `spec_code`: not evaluated in this correctness pass; scheduled for the traceability pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: not evaluated in this correctness pass; scheduled for the traceability pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: not evaluated in this correctness pass; scheduled for the traceability pass.

### `spec_code`: not evaluated in this security pass; planned for the traceability pass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code`: not evaluated in this security pass; planned for the traceability pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: not evaluated in this security pass; planned for the traceability pass.

### Path traversal through `..` or a symlinked parent was not demonstrated: `safeResolve` rejects those parent paths and the regression test covers a release file below a symlinked directory. [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:218-258`] [SOURCE: `.skilled/commands/doctor/scripts/tests/release-update.test.cjs:1363-1385`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Path traversal through `..` or a symlinked parent was not demonstrated: `safeResolve` rejects those parent paths and the regression test covers a release file below a symlinked directory. [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:218-258`] [SOURCE: `.skilled/commands/doctor/scripts/tests/release-update.test.cjs:1363-1385`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Path traversal through `..` or a symlinked parent was not demonstrated: `safeResolve` rejects those parent paths and the regression test covers a release file below a symlinked directory. [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:218-258`] [SOURCE: `.skilled/commands/doctor/scripts/tests/release-update.test.cjs:1363-1385`]

### The apply path records rollback data before its first planned target write and the rollback path restricts restoration to planned units. [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:1817-1941`] [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:2178-2197`] [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:2379-2453`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The apply path records rollback data before its first planned target write and the rollback path restricts restoration to planned units. [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:1817-1941`] [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:2178-2197`] [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:2379-2453`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The apply path records rollback data before its first planned target write and the rollback path restricts restoration to planned units. [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:1817-1941`] [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:2178-2197`] [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:2379-2453`]

### The observed counts are progress, not a completed-run claim: Luna has 2 of 10, DeepSeek has 15 of 15 and SWE 2 has 5 of 10. The supervisor remains active. [SOURCE: `review/lineages/luna-max/deep-review-state.jsonl:1-3`] [SOURCE: `review/lineages/deepseek-flash-max/deep-review-config.json:13-47`] [SOURCE: `review/lineages/swe2-max/deep-review-config.json:14-30`] [SOURCE: `review/orchestration-status.log:164-169`] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The observed counts are progress, not a completed-run claim: Luna has 2 of 10, DeepSeek has 15 of 15 and SWE 2 has 5 of 10. The supervisor remains active. [SOURCE: `review/lineages/luna-max/deep-review-state.jsonl:1-3`] [SOURCE: `review/lineages/deepseek-flash-max/deep-review-config.json:13-47`] [SOURCE: `review/lineages/swe2-max/deep-review-config.json:14-30`] [SOURCE: `review/orchestration-status.log:164-169`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The observed counts are progress, not a completed-run claim: Luna has 2 of 10, DeepSeek has 15 of 15 and SWE 2 has 5 of 10. The supervisor remains active. [SOURCE: `review/lineages/luna-max/deep-review-state.jsonl:1-3`] [SOURCE: `review/lineages/deepseek-flash-max/deep-review-config.json:13-47`] [SOURCE: `review/lineages/swe2-max/deep-review-config.json:14-30`] [SOURCE: `review/orchestration-status.log:164-169`]

### The per-lineage iteration caps do not conflict with the 10/15/10 fan-out configuration. `fanout-run.cjs` derives each prompt's `maxIterations` from that lineage's `iterations` value and checks the terminal cap. [SOURCE: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1506-1529`] [SOURCE: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1012-1063`] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The per-lineage iteration caps do not conflict with the 10/15/10 fan-out configuration. `fanout-run.cjs` derives each prompt's `maxIterations` from that lineage's `iterations` value and checks the terminal cap. [SOURCE: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1506-1529`] [SOURCE: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1012-1063`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The per-lineage iteration caps do not conflict with the 10/15/10 fan-out configuration. `fanout-run.cjs` derives each prompt's `maxIterations` from that lineage's `iterations` value and checks the terminal cap. [SOURCE: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1506-1529`] [SOURCE: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1012-1063`]

### The pre-tool parser's documented fail-open behavior for shell syntax it cannot parse is separate from this defect; the committed-message hooks and CI are intended backstops but share the truncating validator. [SOURCE: `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:11-14`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The pre-tool parser's documented fail-open behavior for shell syntax it cannot parse is separate from this defect; the committed-message hooks and CI are intended backstops but share the truncating validator. [SOURCE: `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:11-14`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The pre-tool parser's documented fail-open behavior for shell syntax it cannot parse is separate from this defect; the committed-message hooks and CI are intended backstops but share the truncating validator. [SOURCE: `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:11-14`]

### The rename path did not show an omitted deletion: the regression test checks that apply removes the old path and installs the renamed path. [SOURCE: `.skilled/commands/doctor/scripts/tests/release-update.test.cjs:541-590`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The rename path did not show an omitted deletion: the regression test checks that apply removes the old path and installs the renamed path. [SOURCE: `.skilled/commands/doctor/scripts/tests/release-update.test.cjs:541-590`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The rename path did not show an omitted deletion: the regression test checks that apply removes the old path and installs the renamed path. [SOURCE: `.skilled/commands/doctor/scripts/tests/release-update.test.cjs:541-590`]

### The review scope remains the validated manifest, not every repository file. The manifest explicitly excludes `specs/**`, archives, build output, lockfiles, changelogs, fixtures and run results. [SOURCE: `goal-file-manifest.txt:1-2`] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The review scope remains the validated manifest, not every repository file. The manifest explicitly excludes `specs/**`, archives, build output, lockfiles, changelogs, fixtures and run results. [SOURCE: `goal-file-manifest.txt:1-2`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The review scope remains the validated manifest, not every repository file. The manifest explicitly excludes `specs/**`, archives, build output, lockfiles, changelogs, fixtures and run results. [SOURCE: `goal-file-manifest.txt:1-2`]

### The shared rule source is not duplicated between the commit hook and CI: both route through `validate-message.mjs` and the same template-backed validator. [SOURCE: `.skilled/scripts/git-hooks/commit-msg:76-79`] [SOURCE: `.github/workflows/message-contract.yml:61,79`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The shared rule source is not duplicated between the commit hook and CI: both route through `validate-message.mjs` and the same template-backed validator. [SOURCE: `.skilled/scripts/git-hooks/commit-msg:76-79`] [SOURCE: `.github/workflows/message-contract.yml:61,79`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The shared rule source is not duplicated between the commit hook and CI: both route through `validate-message.mjs` and the same template-backed validator. [SOURCE: `.skilled/scripts/git-hooks/commit-msg:76-79`] [SOURCE: `.github/workflows/message-contract.yml:61,79`]

<!-- /ANCHOR:exhausted-approaches -->
