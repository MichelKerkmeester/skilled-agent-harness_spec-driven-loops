---
title: "Deep Review Strategy — Goal Unification Build (second pass)"
trigger_phrases: []
---
# Deep Review Strategy — Goal Unification Build (second pass)

## 1. TOPIC

Independent second-pass review of the goal unification build (packet `goal.md` as the single goal source across runtimes), targeting the phase-007 packet. The first pass (`lineages/deepseek-review`) reviewed the same surfaces and produced 5 P1 and 10 P2 findings; four P2 and all five P1 were then reported fixed. This pass verifies those fixes against the shipped code and goes deeper on the six axes the review scope names: concurrency between two sessions on one packet, plugin-versus-core parity, the validator's measurement against the extractor's, the speckit YAML `packet_goal` blocks as executable instructions, the reminder's effect on prompt budgets, and the Devin adapter.

## 2. REVIEW CHARTER

- Target: `specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification` (`spec-folder`)
- Review surface: per `review/review-scope.md`, with every finding citing `file:line` and naming the decision it bears on
- Prior lineage: read `lineages/deepseek-review/review-report.md` first; a finding that lineage closed is not re-reported unless the fix is wrong or incomplete
- Execution: autonomous detached lineage, executor `cli-pi`, model `deepseek-v4.1-flash`, inline execution (no nested dispatch, no CLI executor, no Task)
- Artifact root: `specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-2`
- Findings only: P0/P1/P2; no fixes; nothing written outside this lineage directory
- Reproductions run against the real modules and the real CLI with fixtures under this lineage's `scratch/`; the state directory is redirected with `OPENCODE_GOAL_STATE_DIR` so no repository state is touched
- Resource Map Coverage: the target packet carries no `resource-map.md` at init, so the gate is skipped and a review-generated map is emitted at synthesis

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

## 4. NON-GOALS

- No changes to goal hooks, plugin, validator, commands, docs, or any file outside this lineage directory.
- No re-execution of the phase-007 verification sweep, and no `validate.sh` run from this lineage.
- No re-audit of surfaces the first pass already cleared unless a later fix touches them.
- No implementation of fixes for the findings reported here.

## 5. STOP CONDITIONS

- Ran exactly five iterations; convergence before iteration 5 is telemetry only.
- Stop reason: `maxIterationsReached` after iteration 5, with active P2 advisories remaining.

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 7
- Resolved: 0

<!-- /ANCHOR:running-findings -->

## 7. WHAT WORKED

- Reproducing against the shipped modules instead of re-reading prose: the measurement divergence (F102), the subdirectory parity gap (F103) and the silent truncation (F106) were each confirmed by execution, and the concurrency loss (F101) was quantified rather than inferred.
- Reading the packet's own `goal.md` log and `implementation-summary.md` first told me exactly which pass-1 findings the build claims closed, which is how the incomplete F013 fix was caught.
- Direct probes of the plugin module through its pinned `__test` seam made the core-versus-plugin comparison evidence-based rather than code-reading.

## 8. WHAT FAILED

- A first attempt to drive the concurrency probe through a shell variable assignment was rejected by the dispatch-audit hook ("Pi dispatch denied: the command does not prove one direct executor"); the probe was rewritten with literal absolute paths and a neutral runtime namespace (`--runtime stub`).
- The plugin `bind` tool-path probe was inconclusive because the harness context carried no session id, so the plugin's `bind` returned its failure envelope; only the session-free `packet` action could be compared for tool-output parity (F105). The subdirectory and workspace facts were still reproduced through the exported `bindGoal`.

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Two sessions in one state directory losing a log row: ruled out; five concurrent same-state-dir pairs all landed, and an earlier pair (row-C, row-D) landed both rows. [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:894] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Two sessions in one state directory losing a log row.
- Why blocked: Repeated reproduction showed serialization works when both sessions share the state directory.
- Do NOT retry: the same-state-dir case; the loss only appears when the state directories differ.

### `--runtime Pi` capitalization rejected by the runtime namespace validator: ruled out; `normalizeRuntimeNamespace` lowercases before validating (`goal-core.cjs:164-170`), and the CLI bind under `--runtime stub` proved the flag path. [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:164] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the YAML's `--runtime Pi` spelling as a defect.
- Why blocked: The value is lowercased before the namespace pattern is applied.
- Do NOT retry: the capitalization angle.

### Resume surfaces binding a packet: ruled out (carried from the first pass and re-read); `speckit-resume-auto.yaml:36-45` and `speckit-resume-confirm.yaml:45` never call the goal tool and state "resume never mutates it and never binds". [SOURCE: .opencode/commands/speckit/assets/speckit-resume-auto.yaml:36] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A resume surface that mutates the goal.
- Why blocked: Both resume YAMLs are read-only by contract and carry `never_halts`.
- Do NOT retry: the resume-mutation angle.

### Nested phase parent exempt from the goal budget: ruled out; `detectLevel()` classifies a phase parent as level `phase` (`orchestrator.ts:167-169` via `isPhaseParent`), which makes `budgetApplies` true in `validateGoalDocument`, so 036's own goal.md is measured. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:167] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `isPhaseChildFolder` exempting a nested phased packet from the durable budget.
- Why blocked: The phase-parent detection runs first and passes level `phase`, bypassing the child exemption.
- Do NOT retry: the nested-parent-exemption angle.

<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: concurrency-on-the-log, extractor-versus-validator measurement, plugin-versus-core parity, YAML executable instructions, packet-claim reconciliation
- Pivot lineage: none yet
- Remaining frontier: host-side merge semantics for multiple Devin `additionalContext` emitters (F107) cannot be settled from this repository

## 11. RULED OUT DIRECTIONS

- Frontmatter leak through the runtime extractor on a tolerant fence (iteration 2; the runtime strips it, pinned by `goal-slice.test.cjs`).
- Symlinked packet escaping the workspace (iteration 2; realpath containment refuses it, pinned by `goal-slice.test.cjs`).
- OpenCode injection carrying no resend reminder (iteration 4; the plugin appends it, pinned by `opencode-goal-tool-path.test.cjs:211-221`).
- Pointer-less records contradicting ADR-001/ADR-002 (iteration 5; both ADRs now carry the plain-text exception).
- 009 REQ-010 and the changelog Devin contradiction (iteration 5; both carry superseding text now).
- Cursor command hint advertising unsupported actions (iteration 5; trimmed to `packet` only).

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Maximum iteration count reached; synthesize the active advisories and the verified prior-lineage closures without changing reviewed sources.

<!-- /ANCHOR:next-focus -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `goal-slice.cjs`/`goal-core.cjs`/`bin/goal.cjs`; pi, cursor and devin adapters; `.opencode/plugins/opencode-goal.js`; `spec-doc-structure.ts` and `continuity-freshness.ts`; `spec-kit-docs.json`; speckit plan/implement/complete/resume YAMLs; 007's own `spec.md`, `goal.md`, `tasks.md`, `implementation-summary.md`.
- Prior-pass state: 5 P1 fixed (F001 fence tolerance, F005 symlink containment, F010 OpenCode reminder, F002 ADR wording, F003 set-time budget report), 4 P2 fixed (F011 changelog, F012 009 REQ-010, F013 workspace resolution, F015 Cursor hint), 6 P2 recorded as follow-ups (F004 cache key, F006 lock scope, F007 plugin log/unbind, F009 archive-on-rebind, F013 residual, F014 parity test).
- Behavior claims under test: a log append is serialized per packet; the validator and the runtime measure one durable slice; the plugin and the core resolve a packet the same way; the speckit YAML instructions are executable as written; the five P1 fixes are pinned by tests.
- Risk areas: the lock's directory scope; the union of three frontmatter regexes; the plugin's workspace resolution; unlocked direct table-row appends; the `packet` action's field parity.
- Context gap: the target packet is closed (`Status: Complete`, all tasks checked), so its claims are read as evidence rather than as an in-progress state.

## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 5 | ADR-003's one-extractor claim is not met: the runtime and the validator disagree on a tolerant fence (F102). |
| `checklist_evidence` | core | partial | 5 | Every task is checked; two claimed fixes are not pinned by the tests the packet names (F103, F106). |
| `skill_agent` | overlay | notApplicable | — | Spec-folder target. |
| `agent_cross_runtime` | overlay | partial | 4 | Plugin resolves a packet against the raw directory (F103) and omits `packet_budget` on `packet` (F105). |
| `feature_catalog_code` | overlay | pass | 5 | Feature catalog and changelog now match the shipped surfaces. |
| `playbook_capability` | overlay | partial | 3 | The speckit YAML sanctions an append path the core serializes (F104). |

## 15. FILES UNDER REVIEW

| File or group | Dimensions Reviewed | Last Iteration | Findings | Status |
|---------------|---------------------|----------------|----------|--------|
| `lib/goal-slice.cjs` | correctness, security | 2 | F102 | reviewed |
| `lib/goal-core.cjs` | correctness, security | 2 | F101, F102, F106 | reviewed |
| `bin/goal.cjs` | correctness, traceability | 2 | F104, F105 | reviewed |
| pi/cursor/devin adapters, `.devin/hooks.v1.json` | traceability | 3 | F107 | reviewed |
| `.opencode/plugins/opencode-goal.js` | correctness, traceability | 4 | F103, F105 | reviewed |
| `spec-doc-structure.ts`, `orchestrator.ts`, `spec-kit-docs.json` | correctness | 2 | F102 | reviewed |
| speckit plan/implement/complete/resume YAMLs | traceability | 3 | F104 | reviewed |
| 007 `spec.md`, `goal.md`, `tasks.md`, `implementation-summary.md` | traceability, completeness | 5 | F103, F106 | reviewed |
| 002 `decision-record.md` | traceability | 5 | F102, F106 | reviewed |
| `README.md`, `goal-plugin.md`, playbook | traceability | 4 | F104, F105 | reviewed |

## 16. REVIEW BOUNDARIES

- Max iterations: 5
- Stop policy: max-iterations
- Convergence threshold: 0.05 (telemetry only before the cap)
- No-progress threshold: 0.05
- Severity threshold: P2
- Session lineage: `sessionId=fanout-deepseek-review-2-1789123936134-6zq196`, `parentSessionId=null`, `generation=1`, `lineageMode=auto`
- Started: 2026-09-11T10:52:16Z
- Stopped: 2026-09-11T11:20:00Z (`maxIterationsReached`)

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
