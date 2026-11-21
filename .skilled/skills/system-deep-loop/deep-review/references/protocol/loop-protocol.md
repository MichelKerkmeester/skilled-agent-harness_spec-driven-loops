---
title: Deep Review Loop Protocol
description: Complete lifecycle specification for the autonomous deep review loop, initialization, iteration, convergence, synthesis, and save phases.
trigger_phrases:
  - "deep review loop protocol"
  - "review iteration lifecycle"
  - "review loop initialization"
  - "review auto resume"
  - "review synthesis phase"
importance_tier: important
contextType: implementation
version: 1.11.45.0
---

# Deep Review Loop Protocol

Complete lifecycle specification for the autonomous deep review loop.

---

## 1. OVERVIEW

### Purpose

The deep review loop has 4 phases: initialization, iteration (repeated), synthesis, and save. The YAML workflow manages the lifecycle. The `@deep-review` agent (LEAF-only, no WebFetch) executes individual review iterations with fresh context each time.

### When to Use

- Initiating a deep-review loop on a spec folder, skill, agent, or track.
- Resuming a paused or interrupted review session from prior state.
- Validating the 4-phase lifecycle and lineage protocol against current behavior.
- Auditing iteration-dispatch, convergence, or save-phase contracts before changes.

```
┌──────────────┐     ┌───────────────────────────────┐     ┌───────────────┐     ┌──────────┐
│  INIT        │────>│  LOOP                         │────>│  SYNTHESIS    │────>│  SAVE    │
│              │     │  ┌─────────────────────────┐  │     │               │     │          │
│ Scope        │     │  │ Read State              │  │     │ Finding       │     │ Memory   │
│ Discovery    │     │  │ Check Convergence       │  │     │ Registry      │     │ Context  │
│ Dimension    │     │  │ Check Pause Sentinel    │  │     │ Dedup         │     │ Save     │
│ Ordering     │     │  │ Generate State Summary  │  │     │               │     │          │
│ Traceability │     │  │ Dispatch @deep-review   │  │     │ Severity      │     │          │
│ Planning     │     │  │ Evaluate Results        │  │     │ Reconcile     │     │          │
│ State Files  │     │  │ Claim Adjudication      │  │     │               │     │          │
│              │     │  │ Dashboard Generation    │  │     │ Replay        │     │          │
│              │     │  │ Loop Decision           │  │     │ Validation    │     │          │
│              │     │  └────────┬────────────────┘  │     │               │     │          │
│              │     │           │ repeat            │     │ review-report │     │          │
│              │     │           │                   │     │ (9 core +     │     │          │
│              │     │           │                   │     │  resource-map)│     │          │
└──────────────┘     └───────────────────────────────┘     └───────────────┘     └──────────┘
```

### Core Innovation

Each agent dispatch gets a fresh context window. State continuity comes from files on disk, not in-context memory. This eliminates context degradation in long review sessions where accumulated findings would otherwise bias subsequent dimensions.

### Key References

| Resource | Path | Purpose |
|----------|------|---------|
| Review contract | `assets/review-mode-contract.yaml` | Dimensions, verdicts, gates, protocols |
| Auto workflow | `.skilled/commands/deep/assets/deep-review.yaml` | Unattended review loop |
| Confirm workflow | `.skilled/commands/deep/assets/deep-review.yaml` | Step-by-step review with approval gates |
| Agent | `@deep-review` (LEAF) | Single iteration executor, no sub-agents, no WebFetch |
| Memory save | `generate-context.js` | Context preservation script |

---

## 2. PHASE 1: INITIALIZATION

### Purpose

Set up all state files for a new review session. Discover the scope, order dimensions by risk priority, establish the traceability protocol plan, and create the review state packet.

### Steps

1. **Classify session state before writing**:
   - `fresh`: no config/state/strategy files exist
   - `resume`: config + state + strategy all exist and agree
   - `completed-session`: consistent prior state with `config.status == "complete"`
   - `invalid-state`: partial or contradictory artifacts
   - Review state still under `scratch/` is moved to the canonical names before this step, and nothing is appended then. The moved state log was written without the ledger, so a resume or synthesis sets it aside as `deep-review-state.legacy.jsonl`, opens the run from the moved config and replays its iteration rows through the append gateway. The `deep_review.migration` row is appended once, at the top of the first iteration.

2. **Resolve local artifact owner**: `artifact_dir = resolveArtifactRoot(specFolder, 'review').artifactDir`, then `mkdir -p {artifact_dir}/iterations`

3. **Scope discovery**: Resolve the review target into a concrete file list using one of 5 target types:

   | Target Type | CLI Value | Resolution Strategy |
   |-------------|-----------|---------------------|
   | **Spec Folder** | `spec-folder` | Read `spec.md`, `plan.md`, implementation files listed in `tasks.md` |
   | **Skill** | `skill` | Read `SKILL.md`, `references/`, `assets/`, `scripts/`, find agent definitions and command entry points |
   | **Agent** | `agent` | Find agent definitions across all runtimes, compare for consistency |
   | **Track** | `track` | List all child spec folders under the track, read `spec.md` + `checklist.md` for each |
   | **Files** | `files` | Expand glob patterns, validate existence, discover cross-references |

   Store the resolved file list in strategy.md "Files Under Review".

4. **Dimension ordering**: Order the 4 review dimensions for iteration based on risk priority:

   | Priority | Dimension | Rationale |
   |----------|-----------|-----------|
   | 1 | Correctness | Logic errors have the highest blast radius |
   | 2 | Security | Vulnerabilities require immediate attention |
   | 3 | Traceability | Spec/code alignment ensures completeness |
   | 4 | Maintainability | Patterns and documentation quality (lowest immediate risk) |

   Default order: D1 Correctness, D2 Security, D3 Traceability, D4 Maintainability. This order is configurable but the default prioritizes highest-impact dimensions first.

5. **Traceability protocol planning**: Partition the 6 cross-reference protocols into core vs overlay, and schedule only applicable overlays for the target type:

   | Level | Protocol | Applies To | Gate Class | Purpose |
   |-------|----------|------------|------------|---------|
   | Core | `spec_code` | all targets | hard | Verify normative claims resolve to shipped behavior |
   | Core | `checklist_evidence` | all targets | hard | Verify checked completion claims have evidence |
   | Overlay | `skill_agent` | skill | advisory | Verify SKILL.md and runtime agents agree |
   | Overlay | `agent_cross_runtime` | agent | advisory | Verify runtime agent parity |
   | Overlay | `feature_catalog_code` | skill, spec-folder, track, files | advisory | Verify catalog claims match capability |
   | Overlay | `playbook_capability` | skill, agent, spec-folder | advisory | Verify playbook scenarios match executable reality |

   Only schedule overlay protocols that apply to the resolved target type.

6. **Write config**: `{artifact_dir}/deep-review-config.json` with `mode: "review"`, lineage metadata (`sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`, `releaseReadinessState`), and review-specific fields including target, target type, dimensions, protocol plan, and release-readiness state.

7. **Initialize state log**: First line of `{artifact_dir}/deep-review-state.jsonl` with config record including `mode: "review"` and the lineage fields.

8. **Initialize reducer state**: Create `{artifact_dir}/deep-review-findings-registry.json` with empty `openFindings`, `resolvedFindings`, `repeatedFindings`, `dimensionCoverage`, `findingsBySeverity`, and `convergenceScore`.

9. **Initialize strategy**: `{artifact_dir}/deep-review-strategy.md` from review template with:
   - Topic (review target description)
   - Review Dimensions checklist
   - Files Under Review table
   - Cross-Reference Status table grouped by core vs overlay
   - Known Context from the continuity ladder and ripgrep recipes (if any)
   - Resource-map snapshot when `{spec_folder}/resource-map.md` exists at init
   - `resource-map.md not present. Skipping coverage gate` when it does not
   - Review Boundaries from config
9a. **Initialize resource-map coverage state**:
   - If `{spec_folder}/resource-map.md` exists at init: set `resource_map_present = true`, add `Resource Map Coverage` to the Review Charter, and persist a concise map summary in `Known Context`
   - If absent: set `resource_map_present = false`, record the skip note in `Known Context`, and continue without failing

10. **Validate review charter**:
   - Verify strategy.md contains Non-Goals and Stop Conditions sections (may be empty but must exist)
   - In **confirm mode**: present the charter (target, dimensions, scope, non-goals) for user review before proceeding
   - In **auto mode**: accept automatically and continue

11. **Resume only if config, JSONL, strategy, and findings registry agree**. Otherwise halt for repair instead of guessing.

### Outputs

| File | Location | Purpose |
|------|----------|---------|
| Config | `{artifact_dir}/deep-review-config.json` | Review parameters (immutable after init, apart from the terminal status flip, an `--extend=N` rewrite and the derived expansive budget; a fan-out run writes it in `step_fanout_root_config`) |
| State | `{artifact_dir}/deep-review-state.jsonl` | Iteration log (1 initial line) |
| Registry | `{artifact_dir}/deep-review-findings-registry.json` | Reducer-owned findings state |
| Strategy | `{artifact_dir}/deep-review-strategy.md` | Dimensions, findings, next focus |

---

## 3. PHASE 2: ITERATION LOOP

### Loop Steps (repeated until convergence)

#### Step 1: Read State

- Read `deep-review-state.jsonl` -- count iterations, extract `newFindingsRatio`, `findingsSummary`, `findingsNew`, `traceabilityChecks`, and lineage data
- Read `deep-review-findings-registry.json` -- extract `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, and `convergenceScore`
- Read `{artifact_dir}/deep-review-strategy.md` -- get next focus dimension/files, remaining dimensions, and protocol gaps

Reducer contract for every loop refresh:

| Reducer Part | Canonical Value | Notes |
|--------------|-----------------|-------|
| Inputs | `fullJSONLHistory`, `iterationFiles`, `priorReducedState` | Normal loop refresh is full-history: replay the persisted JSONL state and current iteration corpus each refresh so reducer output stays deterministic across restart, compaction, and synthesis audit paths. |
| Outputs | `findingsRegistry`, `dashboardMetrics`, `strategyUpdates` | The same refresh pass updates the canonical registry, refreshes dashboard metrics, and applies strategy updates. |
| Metrics | `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, `convergenceScore` | These metrics drive convergence decisions, dashboard summaries, and synthesis readiness. |

#### Step 2: Check Convergence

Run `shouldContinue_review()`. The full order is the Decision Priority list in `../convergence/convergence.md`; first match wins:

- Max iterations reached? `STOP`
- Three trailing failed iterations? `STOP` with stop reason `error`
- Stuck count `>= 2` using `noProgressThreshold = 0.05`? `STUCK_RECOVERY`
- `--convergence-mode=off` or `--stop-policy=max-iterations`? `CONTINUE`
- A stop candidate forms when all dimensions are covered and clean, when the composite vote passes, or, under `--depth-mode=expansive`, when the frontier has drained with at least one answered node (`frontier_drained`). No candidate: `CONTINUE`
- Below `minIterations`, the candidate becomes `CONTINUE` (`minIterationsNotReached`)
- Under `--depth-mode=expansive`, an open or active frontier node turns the candidate into `CONTINUE` (`frontierOpen`)
- Composite convergence votes `STOP` only after:
  - Rolling average uses `rollingStopThreshold = 0.08`
  - Dimension coverage reaches 100% across the dimensions `reviewDimensions` names in the config, which is the four canonical ones for `all` and only the names given otherwise; a config with no list falls back to the dimensions the coverage map holds
  - Coverage has aged through `minStabilizationPasses >= 1`
  - Required traceability protocols are covered
  - Evidence, scope, and coverage gates pass
- Otherwise: `CONTINUE`

If convergence math or a hard-stop candidate points to STOP, `runtime/scripts/convergence.cjs` runs the review legal-stop decision tree before the loop stops. That decision tree records nine review-specific gates: `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, `claimAdjudicationGate`, `fixCompletenessReplayGate`, `candidateCoverageGate`, and `graphlessFallbackGate` (see `../convergence/convergence.md` §1 blocked_stop event example for the authoritative shape). The Step 4a claim-adjudication path treats `claimAdjudicationGate` as a hard STOP gate, so the count covers both the convergence decision tree and the adjudication enforcement path. `candidateCoverageGate` and `graphlessFallbackGate` are v2-rollout gates that pass trivially when the review-depth-v2 search path is inactive. If any gate fails, the loop does **not** stop. Instead it emits a first-class `blocked_stop` JSONL event with:

- `blockedBy`: array of the failed review gate names
- `gateResults`: per-gate pass/fail payloads using the review gate names above
- `recoveryStrategy`: one-line hint describing the next review action

The blocked-stop event is append-only evidence that legal-stop blocked the run. The loop then continues with the recovery or next-focus path rather than synthesizing.

Convergence signals and weights:

| Signal | Weight | Description |
|--------|--------|-------------|
| Rolling Average | 0.30 | Last 2 severity-weighted `newFindingsRatio` values average below `rollingStopThreshold` |
| MAD Noise Floor | 0.25 | Latest ratio within noise floor derived from historical ratios |
| Dimension Coverage | 0.45 | Every configured dimension (the four by default) plus required traceability protocols covered, with stabilization |

**P0 override**: Any new P0 finding sets `newFindingsRatio >= 0.50`, blocking convergence regardless of composite score.

#### Step 2a: Check Pause Sentinel

Before dispatching, check for a pause sentinel file:

1. Check if `review/.deep-review-pause` exists (note: the file name uses the shared `-pause` suffix)
2. If present:
   - Log event to JSONL: `{"type":"event","event":"userPaused","mode":"review","stopReason":"userPaused","reason":"sentinel file detected"}`
   - Halt the loop with message:
     ```
     Review paused. Delete review/.deep-review-pause to resume.
     Current state: Iteration {N}, {reviewed}/{total} dimensions complete, {P0}/{P1}/{P2} findings.
     ```
   - Do NOT exit to synthesis -- the loop is suspended, not stopped
3. On resume (file deleted and loop restarted):
   - Log event: `{"type":"event","event":"resumed","fromIteration":N}`
   - Continue from step_read_state

**Use case**: In autonomous mode, this provides the only graceful intervention mechanism short of killing the process. Users can create the sentinel file at any time to pause review between iterations.

Normalization rule: if the runtime first observes a raw `paused` condition or a raw `stuck_recovery` condition, it MUST rewrite the emitted JSONL event names to `userPaused` and `stuckRecovery` before appending them. Persisted review JSONL should never contain raw `paused` or raw `stuck_recovery` rows after emission.

#### Step 2b: Generate State Summary

Generate a compact state summary (~200 tokens) for injection into the dispatch prompt:

```
STATE SUMMARY (auto-generated, review mode):
Iteration: {N} of {max} | Mode: review
Target: {config.reviewTarget} ({config.reviewTargetType})
Dimensions: {reviewed}/{total} complete | Next: {nextDimension}
Findings: P0:{count} P1:{count} P2:{count} active
Traceability: core={core_status} overlay={overlay_status}
Last 2 ratios: {ratio_N-1} -> {ratio_N} | Stuck count: {stuck_count}
Provisional verdict: {PASS|CONDITIONAL|FAIL|PENDING} | hasAdvisories={hasAdvisories}
Next focus: {strategy.nextFocus}
```

This summary is prepended to the dispatch context (Step 3) to ensure the agent has baseline context even if detailed strategy.md reading fails or is incomplete.

#### Step 3: Dispatch Agent

Dispatch `@deep-review` with review-specific context:

```
{state_summary}  // Auto-generated (Step 2b)

Review Target: {config.reviewTarget}
Review Mode: {config.reviewTargetType}
Iteration: {N} of {maxIterations}
Focus Dimension: {strategy.nextFocus.dimension}
Focus Files: {strategy.nextFocus.files}
Remaining Dimensions: {strategy.remainingDimensions}
Traceability Protocols:
  - Core: {core_protocols}
  - Overlay: {overlay_protocols}
Active Findings: {findingsSummary}
State Files:
  - Config: {artifact_dir}/deep-review-config.json
  - State: {artifact_dir}/deep-review-state.jsonl
  - Registry: {artifact_dir}/deep-review-findings-registry.json
  - Strategy: {artifact_dir}/deep-review-strategy.md
Output: Write findings to {artifact_dir}/iterations/iteration-{NNN}.md
CONSTRAINT: LEAF agent -- do NOT dispatch sub-agents
CONSTRAINT: Target files are READ-ONLY -- never modify code under review
```

#### Executor Resolution

Before dispatching, the YAML resolves the executor via `parseExecutorConfig` from `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`. The resolved `config.executor.kind` selects the dispatch branch:

- `native`: dispatch `@deep-review` agent with model Opus.
- `cli-opencode`: pass the rendered prompt as the last argument of the command `buildLineageCommand` in `fanout-run.cjs` builds, `opencode run --standalone -m X[#Y] --format json --auto "PROMPT"`, started in `{repo_root}` with stdin closed. `reasoningEffort` Y rides as the `#Y` suffix on the model. `--auto` is always passed. `dispatch-iteration.cjs` resolves an unset sandbox mode to `workspace-write`, as fan-out does, and under it the builder hands the child an inline `OPENCODE_CONFIG_CONTENT` that denies `external_directory`; the receipt records `sandboxMode` `workspace-write`. That deny stops OpenCode's file tools at the working directory but does not confine Bash. **In both modes that run, Bash keeps full OS-level write access.** `danger-full-access` adds no deny, and OpenCode exposes no confinement flag, so an explicit `read-only` fails closed before dispatch. The real containment is (a) the `external_directory` deny on the file tools under `workspace-write`, (b) the prompt-level "ALLOWED WRITE PATHS" / "BANNED OPERATIONS" contract rendered into the iteration prompt (`assets/prompt-pack-iteration.md.tmpl`), which relies on the model obeying instructions rather than an OS-level sandbox, and (c) post-dispatch validation (`validateIterationOutputs`) catching some violations after the fact. Because review targets are arbitrary code/spec files, they MUST be treated as potentially adversarial content (untrusted) for prompt-injection purposes — the same containment posture as untrusted fetched content in deep-research.
- `cli-claude-code`: `claude -p "$(cat prompt)" --model X --permission-mode <mode> --output-format stream-json --verbose` with optional `--effort Y`, built by `buildLineageCommand` in `fanout-run.cjs`. The event stream stays off the terminal, and `dispatch-iteration.cjs` writes the session cost to `{artifact_dir}/iterations/iteration-NNN.cost.json` as `providerCostUsd`, null when the stream reports none. The stream itself, like every kind's stdout, is written to `{artifact_dir}/iterations/iteration-NNN.out` and masked like a fan-out lineage log. The cost, the completion check and the unavailable-marker check read the whole log up to 20 MB and only its last 20 MB past that. An unset model resolves to the builder's `CLAUDE_DEFAULT_MODEL`, and a missing `claude` binary throws an `INPUT_VALIDATION` error (exit 1) before any receipt is written. The permission mode resolves from `--sandbox-mode`: unset or `workspace-write` runs `acceptEdits` so iteration writes succeed, `read-only` runs `plan` and `danger-full-access` runs `bypassPermissions`. The inline workflow branches are not the complete schema: `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi` and `cli-deepseek-harness` (experimental) also have inline branches that run `dispatch-iteration.cjs`, and `cli-mistral-vibe` runs only as a fan-out lineage. The executor-kind authority is `runtime/lib/deep-loop/executor-config.ts` (`EXECUTOR_KINDS`).
- Sandbox on those `dispatch-iteration.cjs` branches: `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi` and `cli-deepseek-harness` resolve the requested `--sandbox-mode` and map it to the kind's own read-only or write surface, which is an OS sandbox only on codex, cursor and the deepseek harness. An unset mode resolves to `workspace-write`, so the iteration can write its iteration file, delta and state record. A requested `read-only` is passed through, never widened, and the iteration then fails at the post-dispatch artifact gate rather than gaining write access. The deepseek harness narrows `danger-full-access` to `workspace-write`, and a fan-out `--preview` reports that lineage's `effective_config` as `sandboxMode` `workspace-write`, `sandboxNarrowedFrom` `danger-full-access` and `sandboxEnforcement` `preventive`. Devin and pi run a `workspace-write` request with the same unconfined command as `danger-full-access`, so it is reported as `sandboxMode` `danger-full-access`, `sandboxWidenedFrom` `workspace-write` and `sandboxEnforcement` `none`. A single iteration records the same fields in the `executor` record of its receipt and state rows.

All branches share:
1. Pre-dispatch prompt rendering via `renderPromptPack` (writes to `{artifact_dir}/prompts/iteration-{n}.md`).
2. Post-dispatch validation via `validateIterationOutputs` (asserts iteration file + JSONL delta + required fields).
3. Executor audit append via `appendExecutorAuditToLastRecord` (skipped when kind=='native').

Per-kind flag-compatibility is enforced at config parse time by `EXECUTOR_KIND_FLAG_SUPPORT` in `executor-config.ts`. Setting a flag that the chosen kind does not support throws `ExecutorConfigError` before dispatch.

Cross-CLI delegation (a running executor invoking other CLIs via its shell) is documented design intent. Runtime recursion detection is out of scope. See the SKILL.md Cross-CLI Delegation subsection.

Two containment rules bind every CLI lineage (any `cli-*` executor kind):

- **The lineage is the executor, so it works in-process.** A CLI lineage performs each iteration itself, with its own tools, inside the session the driver already started. The YAML's per-iteration executor dispatch steps are satisfied by the lineage. Spawning a second CLI process for the same iteration is a route violation, not an optimization, and on codex it also fails outright (see `cli-external-orchestration/cli-codex/SKILL.md` Rule 18).
- **Write containment attributes every new dirty path outside the lineage directory to the lineage, and reports it rather than undoing it.**
  - Attribution on a shared checkout is a guess: a tracked file changed anywhere in the same checkout during a lineage window looks identical whether the lineage, an operator, or another session wrote it.
  - So the default remedy is preserve. The file is left byte-for-byte as it stands, the finding is recorded on the status ledger and the observability stream, and a lane that produced its review artifacts — its iteration records, and `review-report.md` where it reached synthesis — still settles as complete, carrying `completed_with_containment_advisory`.
  - Restoring is opt-in and safe only on a checkout with a single writer; under it a path that was already dirty when the lineage started is put back to its pre-dispatch bytes, never to HEAD, and a path whose baseline could not be captured is preserved regardless. Untracked files are never deleted in either mode.
  - A path that was already dirty when the lineage started and changed again during it is the one exception to attribution: it has a second writer on record, so under the default remedy it is reported as contested, as a `containment_contested` ledger event and a `containmentContested` field on the lineage output, with a note that the tree shows the bytes changed, not who wrote them. A single-lineage run reports the same path the same way, as a `containment_contested` event in its state log, and the dispatch step prints the paths and the note beside any violations. No quarantine copy, patch or revert is made for it, and its pre-dispatch bytes stay in the baseline capture.
  - A path the lane itself quarantined on an earlier pass stays the lane's, restore keeps the single-owner reading, and a path that was clean at the baseline is still attributed.
  - One exemption still applies to attribution: another run's lineage directory under the same top-level packet is treated as that run's own write surface while its loop lock is live, so two lineages can run in sibling phases of one packet at the same time; a directory with no lock, or a stale one, is still attributed here.
  - The runtime records each finding's diff under the lineage directory at `containment/quarantine/<iteration>[-attempt-<n>]/`, in a `containment-out-of-scope/` subdirectory on the default preserve path and `containment-reverted/` only under restore, where bytes really were rolled back; each pass keeps its own directory so a retry never overwrites an earlier pass's evidence. The pre-dispatch baseline bytes go to `<lineage dir>/containment/baseline/`, so an out-of-scope change stays recoverable either way.

Failure handling is unchanged: `schema_mismatch` → conflict event → retry. Three consecutive failures stop the loop with stop reason `error`.

**Agent constraints**:
- `@deep-review` is LEAF-only: it cannot dispatch sub-agents
- No WebFetch: review is code-only and read-only
- Stay within `config.maxToolCallsPerIteration` tool calls per iteration. Breadth over depth per cycle

#### Step 3a: Cross-Reference Protocol Execution

During iterations focused on the Traceability dimension, the agent executes applicable cross-reference protocols. Each protocol produces a structured result appended to the JSONL `traceabilityChecks.results[]` array.

| Protocol | Execution | Expected Output |
|----------|-----------|-----------------|
| `spec_code` | Compare normative claims in spec.md against shipped implementation | Pass/partial/fail per claim with file:line evidence |
| `checklist_evidence` | Verify every `[x]` mark in checklist.md has supporting evidence | Pass/partial/fail per checked item |
| `skill_agent` | Compare SKILL.md contracts against runtime agent definitions | Agreement/drift/disagreement per capability |
| `agent_cross_runtime` | Compare agent definitions across runtimes (.opencode, .claude, .opencode) | Parity/drift/divergence per runtime pair |
| `feature_catalog_code` | Compare catalog claims against discoverable implementation | Match/stale/missing per feature |
| `playbook_capability` | Validate playbook scenarios against executable reality | Executable/needs-update/impossible per scenario |

Each protocol result includes:
- `protocolId`: Protocol identifier
- `status`: `pass`, `partial`, or `fail`
- `gateClass`: `hard` or `advisory`
- `applicable`: Whether the protocol applies to this target type
- `counts`: `{ pass, partial, fail, skipped }`
- `evidence`: Array of file:line citations
- `findingRefs`: Array of finding IDs generated from this protocol
- `summary`: Human-readable summary text

#### Step 3b: Resource Map Coverage Audit

When `config.resource_map_present == true`, at least one loop iteration MUST audit implementation-vs-resource-map coverage:

1. Read `{spec_folder}/resource-map.md`
2. Read applied reports under `{spec_folder}/applied/T-*.md`
3. Cross-check `target_files` from the applied reports against resource-map entries
4. Classify outcomes into:
   - entries touched
   - entries not touched (`expected-by-scope` vs `gap`)
   - implementation paths absent from the map
5. Emit any resulting findings with category `resource-map-coverage`

When `config.resource_map_present == false`, skip this audit and rely on the `Known Context` note: `resource-map.md not present. Skipping coverage gate`.

#### Step 4: Evaluate Results

After agent completes:

1. Verify `{artifact_dir}/iterations/iteration-{NNN}.md` was created
2. Verify JSONL was appended with review iteration fields:
   - `dimensions` (array of dimensions covered)
   - `filesReviewed` (array of file paths)
   - `findingsSummary` (cumulative P0/P1/P2 counts)
   - `findingsNew` (this iteration's new findings)
   - `traceabilityChecks` (protocol results if applicable)
3. Verify strategy.md was updated (dimension progress, findings count, protocol status)
4. Extract `newFindingsRatio` from JSONL record
5. Update stuck tracking using `noProgressThreshold = 0.05`:
   - Skip if `status == "thought"` (no change)
   - Reset to 0 if `status == "insight"` (breakthrough counts as progress)
   - Increment if `newFindingsRatio < noProgressThreshold`
   - Reset otherwise

#### Step 4a: Claim Adjudication

Before the next convergence pass, the orchestrator adjudicates every new P0/P1 finding with a **typed claim-adjudication packet**. This step prevents false positives from inflating severity and distorting convergence, AND acts as a hard STOP gate: `step_post_iteration_claim_adjudication` appends a `claim_adjudication` event to `deep-review-state.jsonl`, and the next iteration's `step_check_convergence` legal-stop decision tree consults that event via `claimAdjudicationGate` (gate `f`). A missing or failing packet vetoes STOP even when every other gate passes.

Each new P0/P1 must carry a typed packet with the following required fields (see `../state/state-format.md` §9 for the full schema and a worked example):

| Field | Type | Description |
|-------|------|-------------|
| `findingId` | string | Matches the finding ID in the iteration body |
| `claim` | string | The single assertion the finding makes |
| `evidenceRefs` | string[] | `file:line` or `file:range` citations (≥ 1) |
| `counterevidenceSought` | string | Where the orchestrator looked for contradicting evidence |
| `alternativeExplanation` | string | An alternative explanation, even if rejected |
| `finalSeverity` | `"P0"` \| `"P1"` \| `"P2"` | Severity after adjudication |
| `confidence` | number `[0, 1]` | Orchestrator confidence in `finalSeverity` |
| `downgradeTrigger` | string | Concrete condition that would cause a future downgrade |
| `transitions` | object[] | Optional, required when `finalSeverity` differs from the originally asserted severity |

**Protocol**:

1. Re-read the cited evidence at the referenced file:line locations.
2. Seek counterevidence in adjacent code, docs, or prior iteration history.
3. Record an alternative explanation even if it is rejected.
4. Confirm or downgrade severity before the finding becomes convergence-visible.
5. Emit the typed packet inside the iteration file so `step_post_iteration_claim_adjudication` can parse it.

**Failure semantics**: when any new P0/P1 finding is missing a packet or a required field, the workflow records `{"event":"claim_adjudication","passed":false,"missingPackets":[...]}` in `deep-review-state.jsonl`. On the next loop, `step_check_convergence` step 0 (universal pre-check) routes STOP to `BLOCKED` with `blockedBy: ["claimAdjudicationGate"]` until a follow-up iteration rewrites the packet. Downgraded findings have their `finalSeverity` updated. The original severity is preserved in the iteration file for audit trail.

#### Step 4b: Generate Dashboard

Generate `{artifact_dir}/deep-review-dashboard.md` with review-specific sections:

| Section | Content |
|---------|---------|
| Status | Provisional verdict (`PASS`/`CONDITIONAL`/`FAIL`/`PENDING`) and `hasAdvisories` flag |
| Findings Summary | P0/P1/P2 counts with deltas from previous iteration |
| Progress Table | Iteration number, focus dimension, `newFindingsRatio`, findings count, status |
| Coverage | Files reviewed, dimensions completed, traceability protocol status |
| Trend | Last 3 `newFindingsRatio` values with direction indicator (ascending/descending/flat) |
| Active Risks | Guard violations, stuck count, budget warnings |

Dashboard behavior:
- Auto-generated only -- never manually edited
- Overwritten each iteration (not appended)
- Non-blocking: if generation fails, log a warning and continue the loop
- In **confirm mode**: displayed to the user at each iteration approval gate
- In **auto mode**: written silently for post-hoc review

#### Step 5: Loop Decision

- If convergence check returns STOP: exit to synthesis
- If STUCK_RECOVERY: apply review-specific recovery strategies (see Section 3a), reset stuck count, continue
- Otherwise: increment iteration counter, go to Step 1

### Stuck Recovery (Review-Specific)

**Threshold:** 2 consecutive no-progress iterations (`noProgressThreshold = 0.05`).

| Failure Mode | Detection | Recovery Strategy |
|-------------|-----------|-------------------|
| Same dimension stuck | Last 2 iterations reviewed the same dimension with ratios `< 0.05` | **Change granularity**: if reviewing at file level, zoom into functions, if reviewing functions, zoom out to module level |
| Traceability plateau | Required protocols remain partial while ratios stay `< 0.05` | **Protocol-first replay**: re-run the unresolved traceability protocol directly against the conflicting artifacts |
| Low-value advisory churn | Last 2 iterations found only P2 work | **Escalate severity review**: explicitly search for P0/P1 patterns or downgrade unsupported severity claims |

**Selection logic**:

```
function selectReviewRecoveryStrategy(stuckIterations, state, config):
  lastFocuses = [i.focus for i in stuckIterations[-2:]]

  // Same dimension stuck? Change granularity
  if len(set(lastFocuses)) <= 1:
    return { strategy: "change_granularity", dimension: lastFocuses[0] }

  // Required protocol plateau?
  if hasRequiredProtocolPlateau(state.traceabilityChecks):
    return { strategy: "protocol_first_replay" }

  // Default: escalate severity
  return { strategy: "escalate_severity_review" }
```

**Recovery evaluation**:
- If recovery iteration finds any new P0/P1 or materially advances required traceability coverage: recovery successful. Reset stuck count. Continue.
- If recovery iteration finds only P2 or nothing: recovery failed. If all dimensions are already covered, exit to synthesis. Otherwise, move to the next unreviewed dimension.

---

### Expansive Depth Frontier (opt-in)

Under `--depth-mode=expansive` the loop keeps a frontier of sub-target nodes beside the review target. The flag writes `antiConvergence.depthMode: "expansive"` and the caps in `expansiveDepth`: `maxDepth` 3, `maxChildrenPerNode` 6, a review root up to 8 depth-1 children because the seed asks for 3 to 8 sub-targets, a `budgetSplit` of 0.5/0.35/0.15 across the depth bands and `maxFrontierNodes`, which defaults to half of `maxIterations` unless the config sets a number. Two flags set the caps when the config is created: `--frontier-max-depth=N` writes `maxDepth` and `--frontier-max-nodes=N` writes `maxFrontierNodes`; both take a positive integer, need `--depth-mode=expansive` on a single-executor run, and are refused on a fan-out config. The depth-1 seed answers only to the root-children cap, but every seed that is not pruned counts toward the run cap. The depth-1 band gets only `budgetSplit.depth1` of `maxIterations`, so fund it with at least `2 * ceil(nodes / lineages) * dimensions` iterations. When `--max-iterations` is left at its default, the run sizes its budget from the seed: `min(24, max(7, 2 × D × (S + maxDepth − 1)))` iterations for S seeded depth-1 nodes and D the four canonical dimensions less traceability when the config's `reviewDimensions` list leaves it out, plus each custom name it adds, each counted once, and on a single-executor run the seed step prints the derived budget. Since D is never below three, the ceiling of 24 binds from the second seed at three and from the first at four or more, so one run cannot fund every node at every depth of a wide review; split a wide review with fan-out, where each lineage with no matrix `iterations` value sizes its own budget from its share of the seed, with D fixed at the canonical four because a lineage reviews only those. A lineage dealt no seed node, or a run whose seeds were all pruned, runs at its loop default of 7 instead. A fan-out parent seeds before its root config exists, so its seed step prints no whole-seed budget: the runner writes the largest lineage cap into the root config's `maxIterations` and prints the run's budget table as one `[fanout-run] budget table:` line on stderr. The node cap stays half the budget, which leaves room for at least two nodes past depth 1. An explicit `--max-iterations`, marker, setup answer or fan-out matrix `iterations` value always wins, even below the derived value, and the seed warns when it leaves no room past depth 1. Iteration time varies by executor and model: a measured fan-out run took 0.5 to 5 minutes an iteration and committed reviews 1.5 to 3.7 minutes, so a 24-iteration review on the slowest of those can reach `maxDurationMinutes` (120) before its iteration cap. A run without the flag keeps the default path and runs exactly as before, and the mode is locked against the optimizer; the `expansiveDepth` caps are in neither its tunable nor its locked list.

`step_frontier_scope` runs right after `step_create_config`, on every fan-out lineage too, and writes `git diff --name-only <range> -- <pathspec>` into the config's `reviewScopeFiles` for a commit-range target; an open-ended range such as `main..`, `..HEAD` or `origin/main...` reads as a range. `step_frontier_seed` decomposes the review target into depth-1 sub-target nodes before iteration 1, through `runtime/scripts/frontier-admit.cjs seed --target review`. On a plain run it sits in `phase_init` after `step_create_config` and `step_frontier_scope`; on a fan-out run it runs before `step_fanout_spawn`. A merge that carries no diff of its own is pruned `merge-no-own-diff` and an index rebuild `generated-artifact`, because neither is reviewable work.

The store is `review/frontier-nodes.jsonl`, and the reducer derives `answered` and budget-`exhausted` status from it on every reduce. An open node is deferred `searchDebt`; a node closed `exhausted` or `blocked` short of its dimension universe is blocked debt, so the verdict reads CONDITIONAL while `candidateCoverageGate` does not hold the stop on it. A node needs one iteration per dimension in its universe, the four canonical dimensions less traceability when `reviewDimensions` leaves it out, plus each custom name. Only an evidence-bearing iteration counts as a visit and covers a dimension: `complete`, `insight`, `stuck` or a legacy row with no status; `thought`, `error` and `timeout` spend no band share. Under expansive depth with an active node the stuck count reads only rows bound to that node and treats a bound pass with a new finding as progress; with no active node it is run-wide.

`step_read_state` reads `active_frontier_node` from `registry.frontier.activeNodeId` and sets `next_dimension` to that node's next uncovered dimension, so the iteration reviews depth the node has not spent yet. On the last iteration under a cap of 2 or more, while a core traceability protocol is unfinished and `traceability` is among the run's dimensions, `next_dimension` is `traceability` instead. A configured subset that leaves traceability out is not steered, so the last iteration reviews the configured dimensions in order. `step_frontier_activate` marks the node `active` before the dispatch, and the prompt pack's `{frontier_block}` names the node; a leaf proposes `frontier_proposal` rows only when its block is non-empty.

`step_frontier_admit` runs before the reducer and applies seven checks in order: relevance, dedupe, depth, fan-out, node-cap, budget, cycle. `fanout` prunes past a parent's own children cap and `node-cap` past the run-wide `maxFrontierNodes` cap. Relevance includes a node's scope sitting inside a file-list review target: every word of a scope entry must lie inside the target, and a commit-range target means inside the files `step_frontier_scope` recorded. The first failure prunes the proposal under that check's name. A review run has no inbox, so the store alone queues an admitted node, and `runtime/scripts/frontier-admit.cjs --target review` writes it, apart from the starting store `fanout-run.cjs` writes for each fan-out lineage.

Next Focus reads, in precedence order: blocked-stop recovery, the pivot, the active frontier node, the leaf's `nextFocus` when it names an uncovered dimension or every dimension is covered, and otherwise the first uncovered dimension. The `frontierOpen` veto holds the loop at CONTINUE while a node stays open, and never outranks the iteration cap, consecutive failures, stuck recovery, pause, the max-duration stop, `--convergence-mode=off`, `--stop-policy=max-iterations` or the review floor. Stuck recovery closes the active node `exhausted` with reason `stuck` before recovery continues. Once no node is open or active and at least one is answered, a run with no other candidate gets the hard `frontier_drained` candidate, which the legal-stop gates and the graph decision still decide.

On a fan-out run the depth-1 nodes are dealt round-robin in node-id order, by UTF-16 code unit rather than locale collation, `frontier_scope:` binds each lineage's node ids beside `review_focus:` in its prompt, and the partition is recorded as `frontier_partition` in `orchestration-summary.json`. Each lineage dealt at least one node gets its store before it spawns, the merge returns a merged `frontier`, and a partition guard names any dealt node no lineage reports. A lineage reviews the canonical four only, because fan-out binds `review_dimensions: all` in every lineage, so a lineage node needs four iterations and 50% of each lineage's `maxIterations` should reach `ceil(nodes / lineages) * 4`; below that the depth-1 band cannot fund the nodes it was dealt.

---

## 4. PHASE 3: SYNTHESIS

### Purpose

Compile all iteration findings into the final `{artifact_dir}/review-report.md`. The synthesis phase owns the canonical review report output.

### Steps

#### Step 1: Finding Registry Deduplication

Consolidate findings across all iterations:

1. Read all iteration files: `{artifact_dir}/iterations/iteration-*.md`
2. Group findings by file + line range + root cause
3. Merge duplicates, keeping the highest severity and all evidence
4. Assign final finding IDs: `F001`, `F002`, ...
5. Preserve the audit trail: note which iterations contributed to each merged finding

#### Step 2: Severity Reconciliation

Use adjudicated `finalSeverity` for any P0/P1 that was downgraded during claim adjudication (Step 4a of the iteration loop). The original severity from the iteration file is preserved in the audit appendix.

#### Step 3: Replay Validation

Recompute the convergence outcome from JSONL state before finalizing the report:

1. Read `deep-review-state.jsonl` and select review-mode iteration records in run order
2. Recompute `newFindingsRatio`, rolling-average votes, MAD votes, and coverage votes from stored JSONL fields only
3. Recompute `traceabilityChecks.summary` and confirm required protocol statuses match the recorded coverage vote
4. Re-run the evidence, scope, and coverage gates against stored findings and scope data
5. Compare the replayed decision and stop reason to the recorded synthesis event

This synthesis-stage replay is a **full-history audit replay** over the stored JSONL state. It follows the same full-history replay discipline as the per-iteration reducer refresh above, but runs as an explicit pre-synthesis audit.

Replay passes only when the recomputed decision, thresholds, and gate outcomes agree with the persisted result. If replay fails, log a warning in the audit appendix but proceed with synthesis.

#### Step 4: Compile review-report.md

Generate the 9 core review-report sections (defined in `review-mode-contract.yaml` under `outputs.reviewReport`) and insert `## Resource Map Coverage Gate` between `Traceability Status` and `Deferred Items` when `config.resource_map_present == true`:

| # | Section | Purpose |
|---|---------|---------|
| 1 | Executive Summary | Verdict, active P0/P1/P2 counts, scope, `hasAdvisories` metadata |
| 2 | Planning Trigger | Why the verdict routes to planning or changelog follow-up |
| 3 | Active Finding Registry | Deduplicated active findings with evidence and final severity |
| 4 | Remediation Workstreams | Grouped action lanes derived from active findings |
| 5 | Spec Seed | Minimal spec delta derived from review results |
| 6 | Plan Seed | Action-ready plan starter for remediation |
| 7 | Traceability Status | Core vs overlay protocol status and unresolved gaps |
| 8 | Resource Map Coverage Gate | Present only when `config.resource_map_present == true`, reports touched entries, untouched entries (`expected-by-scope` vs `gap`), and implementation paths absent from the map |
| 9 | Deferred Items | P2 advisories, blocked checks, and follow-up items |
| 10 | Audit Appendix | Coverage, replay validation, convergence evidence |

#### Step 5: Verdict Determination

Apply the verdict contract from `review-mode-contract.yaml`:

| Verdict | Condition | Next Command |
|---------|-----------|--------------|
| **FAIL** | Active P0 remains OR any required binary gate fails | `/speckit:plan` for remediation |
| **CONDITIONAL** | No active P0, but active P1 remains or search debt is still open | `/speckit:plan` for fixes |
| **PASS** | No active P0/P1 and no open search debt | `/create:changelog` |

When `PASS` verdict is issued and active P2 findings remain, set `hasAdvisories = true` in the report metadata.

#### Step 6: Finalize State

1. Update config status: Set `status: "complete"` in `deep-review-config.json`
2. Write final JSONL entry:
   ```json
   {
     "type": "event",
     "event": "synthesis_complete",
     "mode": "review",
     "totalIterations": N,
     "verdict": "PASS|CONDITIONAL|FAIL",
     "activeP0": N,
     "activeP1": N,
     "activeP2": N,
     "dimensionCoverage": X,
     "stopReason": "...",
     "timestamp": "..."
   }
   ```
3. Refresh the dashboard: `step_refresh_completed_dashboard` reruns the reducer after the status flip, so the dashboard reports the completed status. A fan-out run skips it, and a failure only logs a warning.

---

## 5. PHASE 4: SAVE

### Purpose

Preserve review context to the memory system for future session recovery and cross-session continuity.

### Steps

1. **Compose context payload**: Create a structured JSON payload with the review summary, active findings, verdict, next action, and relevant artifacts. Use `specFolder` for the target packet and include curated `observations`, `recent_context`, `toolCalls`, and `exchanges` when available. A full-auto save writes continuity only from `recent_action`, `next_safe_action`, `blockers` and `key_files`, so the payload carries all four. Write it to the session-scoped file `/tmp/save-context-data-<session-id>.json`.

2. **Generate context**: Run the continuity writer on that file with `--full-auto`. Without `--full-auto` the writer only plans and writes no continuity.
   ```bash
   node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js /tmp/save-context-data-<session-id>.json {spec_folder} --full-auto
   ```

3. **No extra indexing step in the live contract**: `generate-context.js` is the supported save boundary for this workflow.

4. **Verify**: Confirm the routed canonical spec document carries the review continuity update. Expected targets are `implementation-summary.md`, `decision-record.md`, or `handover.md`; standalone `memory/*.md` files are retired and should not be created.

### On Save Failure

If memory save fails:
- Preserve the current `review/` packet as backup (the disk state is the ground truth)
- Log the error
- The review results remain intact in `{artifact_dir}/review-report.md` regardless of memory save status

---

## 6. AUTO-RESUME PROTOCOL

### Purpose

Enable review sessions to resume cleanly from prior state when interrupted by context compaction, process termination, or intentional pause.

### Resume Detection

If state files already exist from a prior session:

1. **Verify agreement**: Confirm config, JSONL, findings registry, and strategy all exist and agree on target/spec folder
2. **Count progress**: Read JSONL, count iteration records, determine last completed iteration
3. **Read strategy**: Load current dimension progress, findings, and next focus from `deep-review-strategy.md`
4. **Set counter**: Set iteration counter to last completed + 1
5. **Log resume**: Append the canonical resume event to `deep-review-state.jsonl`. The reducer requires every field below:
   ```json
   {"type":"event","event":"resumed","mode":"review","sessionId":"rvw-2026-03-24T10-00-00Z","parentSessionId":"rvw-2026-03-24T10-00-00Z","lineageMode":"resume","continuedFromRun":4,"generation":1,"archivedPath":null,"timestamp":"2026-03-24T14:05:00Z"}
   ```
6. **Continue**: Enter the iteration loop from step_read_state

### Lifecycle Branches (current release)

The runtime supports four lineage modes. `completed-continue` is live through `--extend=N`, which reopens a completed run in the same session and generation.
`fork` is deferred: it has no workflow wiring, so it MUST NOT be exposed to operators. If the long-form lineage feature is picked up later it will arrive with first-class event emission, reducer ancestry handling, and replay fixtures. Until then treat the contract below as canonical.

| Mode | Session id | Generation | Archive | JSONL event | When to pick |
|------|-----------|-----------|---------|-------------|--------------|
| `new` | fresh | 1 | n/a | implicit (config record) | no existing state |
| `resume` | same | same | none | `resumed` (see example above) | operator wants to continue the current lineage boundary |
| `restart` | fresh | `prior + 1` | prior `review/` tree moved under `review-archive/{timestamp}/` | `restarted` (same field set plus non-null `archivedPath`) | operator wants to clear the workspace and replay with a new angle |
| `completed-continue` | same | same | none; the prior review report is copied to `review/review-report-v{generation}-r{continuedFromRun}.md` | `extended` (see below) | a completed run needs N more iterations: pass `--extend=N` |

#### Restart prior-lineage fallback

Before the archive, `workflow-steps.cjs prior-lineage` reads the session id and generation of the packet about to be archived, and the new run opens at that generation plus 1 with the prior session as its `parentSessionId`. It reads both from the old root config. When that config is missing, as an older fan-out root never wrote one, it rebuilds them from what the packet still holds, in this order:

1. The lineage configs under `lineages/*/`. Their one shared `parentSessionId` is the prior session and their highest `generation` is its generation. Parents that disagree name no session.
2. The state log. Exactly one session id other than the packet folder name, a placeholder older runs wrote, is the prior session, at the highest generation its rows carry, else 1.

Anything else reports no prior session and generation 0, so the restart opens generation 1 with no parent. An old config that exists but cannot be read halts the restart instead. A restart request never falls back to resume.

#### Completed-run extension

`--extend=N` (and optionally `--extend-minutes=M`) continues a run whose config has `status: "complete"`. Under the loop lock and before session classification, `step_extend_completed_run`:

1. Counts `continuedFromRun` as the distinct runs among the iteration records, error and timeout rows included.
2. Sets `maxIterations` to `continuedFromRun + N`, so a run stopped at 7 of 10 and extended by 3 ends at 10.
3. Sets `maxDurationMinutes` to `max(prior budget, minutes elapsed since createdAt) + M`. `M` defaults to the prior budget, and a run with no duration budget keeps none unless `--extend-minutes` is passed. `createdAt` is never re-stamped, because the duration check counts wall-clock time, idle time included.
4. Appends `deep_review.run_extended` through the append gateway, which projects an `extended` row into the state log, and only then replaces the config with `status: "initialized"`, `lineageMode: "completed-continue"` and `continuedFromRun`. A failed append leaves the run complete and untouched.

Classification then lands on resume. The workflow writes no `resumed` row for an extension, and the reducers treat an `extended` row like `resumed`, so the run is live again. Before the first new dispatch, `step_snapshot_extended_review_report` copies the prior review report to `review/review-report-v{generation}-r{continuedFromRun}.md` and refuses to overwrite an existing snapshot, so a second extension of the same generation keeps its own copy. `--extend` refuses a run that is not complete (use `--lineage-mode=resume`), refuses fan-out before any lineage spawns, and accepts positive integers only.

The extended row carries `{"type":"event","event":"extended","sessionId","generation","lineageMode":"completed-continue","continuedFromRun","extension","timestamp"}`, where `extension` holds `addedIterations`, `priorMaxIterations`, `newMaxIterations`, `priorMaxDurationMinutes`, `newMaxDurationMinutes` and `elapsedMinutesAtExtension`. It has no `archivedPath` or `parentSessionId`, so the field rule below covers `resumed` and `restarted` only.

**Convergence window.** Under `stopPolicy: convergence`, an extension with nothing new to cover re-stops on `all_dimensions_clean` at the first convergence check, or on `frontier_drained` when an expansive run's frontier is already drained. The extension step prints a warning when this is likely. The extension keeps the stop policy and convergence mode the run was created with, and a flag passed beside `--extend` does not change them, so only a run created with `--convergence-mode=off` or `stopPolicy: max-iterations` is sure to use the new budget.

**Consecutive failures.** A run that completed on consecutive failures re-stops at the consecutive-failure check even when it was created with `--convergence-mode=off`, because that check runs before the `off` branch and the trailing failed iterations are still in the log.

**Contract for every persisted lifecycle event**:

```json
{
  "type": "event",
  "event": "resumed | restarted",
  "mode": "review",
  "sessionId": "<session id of the new or continuing lineage>",
  "parentSessionId": "<session id of the prior lineage (equals sessionId on resume)>",
  "lineageMode": "resume | restart",
  "generation": <number>,
  "continuedFromRun": <number or null>,
  "archivedPath": "<path or null>",
  "timestamp": "<ISO 8601>"
}
```

Every field in the contract MUST be present on every persisted `resumed` and `restarted` event. `archivedPath` is null for `resumed` and set to the archive destination for `restarted`. `continuedFromRun` is the number of completed iteration records before the lifecycle boundary. Reducer parity tests ensure the dashboard `Lifecycle` section reads exactly those fields.

### State Validation on Resume

| Condition | Classification | Action |
|-----------|---------------|--------|
| Config + JSONL + strategy all exist and agree | `resume` | Continue from last iteration + 1 |
| All exist, config says `status: "complete"` | `completed-session` | Report completion, ask user if re-review desired |
| Partial files or contradictions | `invalid-state` | Halt for repair, do not guess |
| No files exist | `fresh` | Start new initialization |

### State Recovery Cascade

When state files are missing or corrupted, apply this priority cascade:

| Priority | Condition | Recovery Action |
|----------|-----------|----------------|
| 1 | JSONL exists and parseable | Normal operation |
| 2 | JSONL exists, strategy.md missing | Reconstruct strategy from JSONL: extract dimensions, findings, coverage |
| 3 | JSONL missing, iteration files exist | Scan `review/iterations/iteration-*.md`, reconstruct JSONL with `status: "reconstructed"` |
| 4 | Only config.json remains | Restart from initialization phase |
| 5 | Config.json also missing | Cannot recover. Report error and halt. |

Each priority level is attempted in order. If a level fails, fall through to the next.

---

## 7. PAUSE/RESUME

### Pause Sentinel Behavior

The pause sentinel provides graceful loop suspension in autonomous mode without killing the process.

### Creating a Pause

Create the sentinel file at any time:

```bash
touch {artifact_dir}/.deep-review-pause
```

The orchestrator checks for this file between iterations (Step 2a). When detected:
- The current iteration is allowed to complete
- The loop halts before dispatching the next iteration
- A paused event is logged to JSONL
- The user is notified with current state (iteration count, dimensions covered, findings)

### Resuming After Pause

Delete the sentinel file and restart the workflow:

```bash
rm {artifact_dir}/.deep-review-pause
```

On the next invocation:
- The auto-resume protocol (Section 6) detects the existing state
- A resumed event is logged to JSONL
- The loop continues from the next iteration

### Confirm Mode Approval Gates

In confirm mode (`deep-review.yaml`), the workflow adds explicit approval gates instead of relying on the pause sentinel:

| Gate Location | Behavior |
|---------------|----------|
| After initialization | Show config, strategy, and scope. Wait for approval |
| After each iteration | Show iteration findings, dashboard, and convergence status. Options: Continue, Adjust Focus, Stop |
| Before synthesis | Show summary of all iterations. Wait for approval to synthesize |
| After synthesis | Show final review-report.md summary. Approve or request revisions |

---

## 8. STATE TRANSITIONS, ERROR HANDLING, AND QUALITY GATES

State-transition rules, error handling, and the review quality gates live in `loop-state-and-gates.md` for navigability.

---

## 9. EXECUTOR SELECTION CONTRACT

Executor settings are owned by the YAML workflow and rendered prompt pack. Do not bypass the workflow by hand-dispatching review iterations; each iteration stays LEAF-only and produces the required markdown plus JSONL delta.

### Invariants

Every executor path MUST satisfy:

1. Produce an iteration markdown file at `{state_paths.iteration_pattern}` (non-empty).
2. Append a JSONL delta record to `{state_paths.state_log}` with required fields: `type`, `iteration`, `dimensions`, `filesReviewed`, `findingsSummary`, `findingsNew`, `findingDetails`, `newFindingsRatio`.
3. Respect the LEAF-agent constraint: no sub-dispatch, no nested loops. No more tool calls per iteration than `config.maxToolCallsPerIteration`.

### Failure Modes

- Missing iteration file: `iteration_file_missing` from `post-dispatch-validate.ts`, emits a `schema_mismatch` conflict event.
- Empty iteration file: `iteration_file_empty`, same downstream.
- JSONL not appended: `jsonl_not_appended`.
- JSONL missing required fields: `jsonl_missing_fields`.
- JSONL malformed: `jsonl_parse_error`.
- Missing executor identity: `executor_missing` from `runtime/scripts/verify-iteration.cjs`, when the run config names a non-native executor and the iteration records none. A fan-out lineage is checked against the `invocation-metadata.json` in its folder instead, and a missing file or a different executor kind fails it.
- 3 consecutive failed iterations: the loop stops with stop reason `error`.

### JSONL Audit Field

Non-native executor runs record an `executor` block with model and runtime settings through `executor-audit.ts`. On a ledger-backed state log it lands on the iteration's opening `iteration_start` row, which the append gateway keeps through every refresh. On a log with no ledger it is merged onto the iteration's JSONL record. Native runs are recoverable from YAML alone.

### Template And Config Surface

The executor-agnostic iteration prompt lives at `assets/prompt-pack-iteration.md.tmpl`, rendered by `prompt-pack.ts` before dispatch and either injected as the agent's context (native) or passed to `opencode run` as the message argument with stdin closed (cli-opencode). Config is in `assets/deep-review-config.json` under the `executor` key; schema in `runtime//lib/deep-loop/executor-config.ts`. CLI flag precedence: `--executor/--model/--reasoning-effort/--service-tier/--executor-timeout > config file > schema default`.

### What Never Changes Regardless Of Executor Route

- YAML owns state (`deep-review-state.jsonl`, strategy.md, registry, dashboard).
- The append gateway (`runtime/scripts/append-mode-event.cjs`) is the single writer of a ledger-backed state log. A log with no ledger keeps direct writes. `reduce-state.cjs` never writes the state log. It derives the strategy, the registry and the dashboard.
- Lifecycle events (new/resume/restart) and the review dimensions pass stay workflow-driven. The stop decision comes from `runtime/scripts/convergence.cjs`.
- The `@deep-review` LEAF agent definition is untouched: it is the native executor, not the only one.

### Code-Graph Readiness TrustState Surface

On this skill surface, the live code-graph readiness contract only reaches four TrustState values: `live`, `stale`, `absent`, and `unavailable`. The values `cached`, `imported`, `rebuilt`, and `rehomed` remain declared in the shared TrustState type for compatibility and downstream schema stability, but the seven code-graph handlers and readiness helpers used here do not emit them today.

---

## 10. RELATED RESOURCES

### Shared Protocol Documentation

Protocol documents from `deep-research` are cross-referenced, not duplicated:

| Document | Path | Purpose |
|----------|------|---------|
| Loop Protocol (research) | `../deep-research/references/protocol/loop-protocol.md` | Research loop lifecycle (this file adapts Section 9) |
| State Format | `../deep-research/references/state/state-format.md` | JSONL, strategy, and config schemas |
| Convergence | `../deep-research/references/convergence/convergence.md` | `shouldContinue_review()` (Section 10), stuck recovery, quality guards |

### Review-Specific Resources

| Resource | Path | Purpose |
|----------|------|---------|
| Review Contract | `assets/review-mode-contract.yaml` | Single source of truth for dimensions, verdicts, gates, protocols |
| Quick Reference | `references/protocol/quick-reference.md` | One-page review cheat sheet |
| Strategy Template | `assets/deep-review-strategy.md` | Template for review strategy files |
| Config Template | `assets/deep-review-config.json` | Template for review config files |
| Dashboard Template | `assets/deep-review-dashboard.md` | Template for auto-generated dashboard |

### Workflow Files

| Mode | Path |
|------|------|
| Auto (unattended) | `.skilled/commands/deep/assets/deep-review.yaml` |
| Confirm (step-by-step) | `.skilled/commands/deep/assets/deep-review.yaml` |

### Agent

| Agent | Path Pattern | Constraint |
|-------|-------------|------------|
| `@deep-review` | `{runtime_dir}/deep-review.{ext}` | LEAF-only, no sub-agents, no WebFetch, target files read-only |

Runtime paths:
- OpenCode / Copilot: `.opencode/agents/deep-review.md`
- Claude: `.claude/agents/deep-review.md`
