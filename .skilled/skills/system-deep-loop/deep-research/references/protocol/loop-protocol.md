---
title: Loop Protocol Reference
description: Canonical specification for the deep research loop lifecycle with 4 phases, reference-only wave orchestration, and error handling.
trigger_phrases:
  - "research loop protocol"
  - "research loop lifecycle"
  - "research loop initialization"
  - "research auto resume protocol"
  - "research pause sentinel"
  - "research synthesis phase"
importance_tier: important
contextType: implementation
version: 1.14.32.0
---

# Loop Protocol Reference

Canonical specification for the deep research loop lifecycle. Use it as the lifecycle map for initialization, iteration, synthesis, save, and recovery.

---

## 1. OVERVIEW

### Purpose

Define the lifecycle contract for deep-research initialization, iteration, synthesis, save, reference-only dispatch concepts, and error handling.

### When to Use

Load this reference when running or validating the research loop lifecycle. Use `../convergence/convergence.md` for STOP decisions and `../state/state-format.md` for packet file schemas.

### Core Principle

The YAML workflow owns lifecycle orchestration, `@deep-research` executes LEAF iterations, and the reducer synchronizes packet state after each iteration and lifecycle transition.

### Phase Model

The deep research loop has 4 phases: initialization, iteration (repeated), synthesis, and save.

Runtime capability matrix references for parity-sensitive loop behavior:
- Human-readable matrix: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Machine-readable matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`

```text
┌──────────┐     ┌──────────────────────────┐     ┌───────────────────────┐     ┌──────────┐
│  INIT    │────>│  LOOP                    │────>│  SYNTHESIS            │────>│  SAVE    │
│          │     │  ┌────────────────────┐  │     │                       │     │          │
│ Config    │     │  │ Read State         │  │     │ Final                 │     │ Memory   │
│ Strategy │     │  │ Check Convergence  │  │     │ research/research.md  │     │ Context  │
│ State    │     │  │ Dispatch Agent     │  │     │ compilation           │     │ Save     │
│          │     │  │ Evaluate Results   │  │     │                       │     │          │
│          │     │  │ Loop Decision      │  │     │                       │     │          │
│          │     │  └────────┬───────────┘  │     │                       │     │          │
│          │     │           │ repeat       │     │                       │     │          │
└──────────┘     └──────────────────────────┘     └───────────────────────┘     └──────────┘
```

---

## 2. PHASE: INITIALIZATION

### Purpose
Set up all state files for a new research session.

### Steps

1. **Classify session state before writing**:
   - `fresh`: no config/state/strategy files exist
   - `resume`: config + state + strategy all exist and agree
   - `completed-session`: consistent prior state with `config.status == "complete"`
   - `invalid-state`: partial or contradictory artifacts
2. **Resolve canonical artifact names**:
   - Read legacy aliases during the migration window if needed
   - Write only canonical `deep-research-*` names
   - Record a `migration` event for every legacy alias consumed, appended through the gateway once the run is open, since an append before classification would turn a fresh packet into a partial one
3. **Resolve local artifact owner**: `artifact_dir = resolveArtifactRoot(specFolder, 'research').artifactDir`, then `mkdir -p {artifact_dir}/iterations`
4. **Write config**: `research/deep-research-config.json` from template + user parameters
5. **Initialize state log**: Append the config record as the first line of `research/deep-research-state.jsonl` through the append gateway, the only way a record reaches the log
6. **Initialize strategy**: `research/deep-research-strategy.md` from template with:
   - Topic from user input
   - Initial key questions (3-5, from topic analysis)
   - Known context from the continuity ladder and ripgrep recipes (if any), injected only after the strategy file exists
   - Research boundaries from config
6a. **Detect resource-map integration state**:
   - Check `{spec_folder}/resource-map.md` once during init
   - If present: set `resource_map_present = true` in `deep-research-config.json`
   - Summarize the map into `deep-research-strategy.md` `Known Context`
   - The summary MUST include per-section entry counts for `READMEs`, `Documents`, `Commands`, `Agents`, `Skills`, `Specs`, `Scripts`, `Tests`, `Config`, and `Meta`
   - The summary MUST also include a one-line theme summary for each resource-map section
   - If absent: set `resource_map_present = false` and append `resource-map.md not present; skipping coverage gate` to `Known Context`
7. **Initialize findings registry**: `research/findings-registry.json` with empty `openQuestions`, `resolvedQuestions`, `keyFindings`, and `ruledOutDirections`
7a. **Validate Research Charter**:
   - Verify strategy.md contains a "Non-Goals" section (may be empty but must exist)
   - Verify strategy.md contains a "Stop Conditions" section (may be empty but must exist)
   - If either section is missing, append it as an empty placeholder before proceeding
   - In **confirm mode**: present the charter (topic, key questions, non-goals, stop conditions) for user review before proceeding
   - In **auto mode**: accept the charter automatically and continue
8. **Resume only if config, JSONL, and strategy agree**; otherwise halt for repair instead of guessing

### Outputs
- `research/deep-research-config.json`
- `research/deep-research-state.jsonl` (1 line)
- `research/deep-research-strategy.md`

### Auto-Resume Protocol
If state files already exist from a prior session:
1. Verify config, JSONL, and strategy all exist and agree on topic/spec folder
2. Read JSONL, count iteration records
3. Read strategy.md for current state
4. Set iteration counter to last completed + 1
5. Record the canonical resume event through the append gateway, the only way a record reaches `deep-research-state.jsonl` (all fields below are required by the reducer):

```json
{"type":"event","event":"resumed","mode":"research","sessionId":"rsr-2026-03-18T10-00-00Z","parentSessionId":"rsr-2026-03-18T10-00-00Z","lineageMode":"resume","continuedFromRun":4,"generation":1,"timestamp":"2026-03-18T14:05:00Z"}
```

6. Continue loop from `step_read_state`.

### Lifecycle Branch Contract (current release)

The runtime supports four lineage modes. `completed-continue` is live through `--extend=N`, which reopens a completed run in the same session and generation.
`fork` is deferred: it has no workflow wiring, so it MUST NOT be exposed to operators. If the long-form lineage feature is picked up later it will arrive with first-class event emission, reducer ancestry handling, and replay fixtures. Until then treat the contract below as canonical.

| Mode | Session id | Generation | Archive | JSONL event | When to pick |
|------|-----------|-----------|---------|-------------|--------------|
| `new` | fresh | 1 | n/a | implicit (config record) | no existing state |
| `resume` | same | same | none | `resumed` (see example above) | operator wants to continue the current lineage boundary |
| `restart` | fresh | `prior + 1` | prior `research/` tree moved under `research_archive/{timestamp}/` | `restarted` (same field set plus `archivedPath`) | operator wants to clear the workspace and replay with a new angle |
| `completed-continue` | same | same | none; the prior synthesis is copied to `research/synthesis-v{generation}-r{continuedFromRun}.md` | `extended` (see below) | a completed run needs N more iterations: pass `--extend=N` |

#### Completed-run extension

`--extend=N` (and optionally `--extend-minutes=M`) continues a run whose config has `status: "complete"`. Under the loop lock and before session classification, `step_extend_completed_run`:

1. Counts `continuedFromRun` as the distinct runs among the iteration records, error and timeout rows included.
2. Sets `maxIterations` to `continuedFromRun + N`, so a run stopped at 7 of 10 and extended by 3 ends at 10.
3. Sets `maxDurationMinutes` to `max(prior budget, minutes elapsed since createdAt) + M`. `M` defaults to the prior budget, and a run with no duration budget keeps none unless `--extend-minutes` is passed. `createdAt` is never re-stamped, because the duration check counts wall-clock time, idle time included.
4. Appends `deep_research.run_extended` through the append gateway, which projects an `extended` row into the state log, and only then replaces the config with `status: "initialized"`, `lineageMode: "completed-continue"` and `continuedFromRun`. A failed append leaves the run complete and untouched.

Classification then lands on resume. The workflow writes no `resumed` row for an extension, and the reducers treat an `extended` row like `resumed`, so the run is live again. Before the first new dispatch, `step_snapshot_extended_synthesis` copies the prior synthesis to `research/synthesis-v{generation}-r{continuedFromRun}.md` and refuses to overwrite an existing snapshot, so a second extension of the same generation keeps its own copy. `--extend` refuses a run that is not complete (use `--lineage-mode=resume`), refuses fan-out before any lineage spawns, and accepts positive integers only.

The extended row carries `{"type":"event","event":"extended","sessionId","generation","lineageMode":"completed-continue","continuedFromRun","extension","timestamp"}`, where `extension` holds `addedIterations`, `priorMaxIterations`, `newMaxIterations`, `priorMaxDurationMinutes`, `newMaxDurationMinutes` and `elapsedMinutesAtExtension`. It has no `archivedPath` or `parentSessionId`, so the field rule below covers `resumed` and `restarted` only.

**Convergence window.** Under `stopPolicy: convergence`, an extension with nothing new to cover re-stops on `all_questions_answered` at the first convergence check. The extension step prints a warning when this is likely. The extension keeps the stop policy and convergence mode the run was created with, and a flag passed beside `--extend` does not change them. To keep the run going, add questions to `research/inbox.jsonl` before you extend; a run created with `--convergence-mode=off` or `stopPolicy: max-iterations` keeps going without them.

**Consecutive failures.** A run that completed on consecutive failures re-stops at the consecutive-failure check even when it was created with `--convergence-mode=off`, because that check runs before the `off` branch and the trailing failed iterations are still in the log.

**Contract for every persisted lifecycle event**:

```json
{
  "type": "event",
  "event": "resumed | restarted",
  "mode": "research",
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

---

## 3. PHASE: ITERATION LOOP

### Loop Steps (repeated until convergence)

#### Step 1: Read State
- Read `deep-research-state.jsonl` -- count iterations, get last newInfoRatio
- Read `deep-research-strategy.md` -- get next focus, remaining questions

#### Step 2: Check Convergence
Run the convergence algorithm (see convergence.md):
- Max iterations reached? STOP
- Three consecutive failed iterations? STOP with stop reason `error`
- Stuck count >= threshold? STUCK_RECOVERY
- All questions answered, or average newInfoRatio < threshold? STOP candidate. An expansive fan-out lineage whose frontier share has drained, with at least one node answered and none open or active, forms the `frontier_drained` candidate. Below the `minIterations` floor it becomes CONTINUE, and so does a `--depth-mode=expansive` run while a frontier node is open or active. Otherwise it stops the loop only when the stop policy allows a convergence stop and the quality gates pass
- Otherwise: CONTINUE

#### Step 2a: Check Pause Sentinel

Before dispatching, check for a pause sentinel file:

1. Check if `research/.deep-research-pause` exists
2. If present:
   - Log event to JSONL: `{"type":"event","event":"userPaused","mode":"research","run":N,"stopReason":"userPaused","sentinelPath":"{artifact_dir}/.deep-research-pause","timestamp":"<ISO8601>","sessionId":"<sid>","generation":G}`
   - Halt the loop with message:
     ```text
     Research paused. Delete research/.deep-research-pause to resume.
     Current state: Iteration {N}, {remaining} questions remaining.
     ```
   - Do NOT exit to synthesis -- the loop is suspended, not stopped
3. On resume (file deleted and loop restarted):
   - Log event: `{"type":"event","event":"resumed","fromIteration":N}`
   - Continue from step_read_state

Pause and recovery events use the frozen stop-reason enum on the live path. Raw `paused` and `stuck_recovery` labels are legacy aliases and MUST be normalized to `userPaused` and `stuckRecovery` at emission time.

**Use case**: In autonomous mode, this provides the only graceful intervention mechanism short of killing the process. Users can create the sentinel file at any time to pause research between iterations.

#### Step 2b: Generate State Summary

Generate a compact state summary (~200 tokens) for injection into the dispatch prompt:

```text
STATE SUMMARY (auto-generated):
Segment: {current_segment} | Iteration: {N} of {max}
Questions: {answered}/{total} answered | Last focus: {last_focus}
Last 2 ratios: {ratio_N-1} -> {ratio_N} | Stuck count: {stuck_count}
Recovery: {active_recovery_strategy or "none"}
Next focus: {strategy.nextFocus}
```

This summary is prepended to the dispatch context (Step 3) to ensure the agent has baseline context even if detailed strategy.md reading fails or is incomplete. It serves as a redundant context channel.

#### Step 2c: Quality Guard Check

When the convergence script forms a STOP candidate, it evaluates the quality guards itself (see convergence.md §3, Decision Order steps 8 and 9):
1. The guards are `sourceDiversity`, `focusAlignment` and `singleWeakSource`
2. If **all guards pass**: the graph decision settles the stop
3. If **any guard fails**: the decision becomes CONTINUE with reasonDetail `qualityGuardFailed`, and `blockedBy` names the failed guards
   - The workflow logs `Quality guard failed: {blocked_by_csv}. Continuing.`
   - No event is written: a failed guard records neither a `guard_violation` nor a `blocked_stop` event
4. The loop continues until BOTH convergence AND quality guards pass simultaneously
5. Guard checks apply to every STOP candidate except the hard max-iteration stop - CONTINUE and STUCK_RECOVERY bypass this step

If the legal-stop decision tree returns `blocked`, the `blocked_stop` JSONL event MUST be in the state log before the loop continues. `convergence.cjs` records it: the workflow runs it with `--record-blocked-stop`, and on a `BLOCKED` decision the script appends the row through the append gateway, once per run and blocker set, and reports it as `blocked_stop_record` with status `recorded`, `already_recorded` or `failed`. A `failed` record makes the script exit with the gateway's status after printing the decision, and the workflow treats that as a gateway refusal and halts rather than writing the row by hand. `step_emit_blocked_stop` logs the block and appends nothing, so the row is never written twice. Reducers and dashboards consume the persisted event; they must not infer blocked-stop state solely from prose logs.

#### Step 2d: Rejected Pattern Cache Check

Before selecting the next-focus, recovery, or ideas-backed candidate for dispatch, read the reducer-owned rejected-pattern cache and promoted ideas backlog from the findings registry.

Rejected-cache lifecycle:

1. `idea_rejected` appends one rejected pattern to JSONL with `ideaId`, `idea` or `pattern`, optional `category`, optional `reason`, and normal lifecycle fields.
2. The reducer derives the active cache from JSONL events; generated registry and dashboard files expose `rejectedPatterns`, `rejectedPatternIndex`, and `suppressedCandidates`.
3. Exact suppression compares normalized candidate text against normalized rejected text.
4. Fuzzy suppression uses `rejectedPatternFuzzyThreshold` from config when present, otherwise `0.85`, and only applies when the rejected category is compatible with the candidate category.
5. `idea_rejected_removed` removes a single active pattern by id or by pattern/category.
6. `idea_rejected_reset` clears all active rejected patterns for the current replay.

The active cache is capped at 100 entries. When the replay would exceed that cap, the oldest active entry is evicted and the reducer emits a warning. Operators can re-add an evicted pattern with another `idea_rejected` event if it remains relevant. Existing `ideaRejected`, `ideaRejectedRemoved` and `ideaRejectedReset` replay rows are legacy aliases and remain accepted for backward compatibility.

When every candidate is suppressed, the workflow halts for operator input. In a ledger-backed run the operator records the `idea_rejected_removed` or `idea_rejected_reset` row through the append gateway (`append-mode-event.cjs --mode research --run-directory <artifact dir> --event-json <row file>`), never by editing the state log, which the next projection replaces. The row shapes and the full command are in `../state/state-jsonl.md` section 7.

Ideas lifecycle:

1. Leaf agents may append `idea_observed` events only. They must not append `idea_promoted`.
2. The reducer accumulates observations by `ideaId` or a normalized text-derived id.
3. `minIdeaObservations` defaults to `2` and is clamped to `1..10`.
4. When an idea reaches `observationCount >= minIdeaObservations`, the reducer appends one idempotent `idea_promoted` event and ranks promoted ideas by observation count, latest observation, then first observation.
5. `idea_rejected` removes the matching idea from `promotedIdeas` and from ideas-backed next-focus candidates until a reset/removal event clears the active rejected pattern.

Candidate categories:

| Category | Candidate source |
|----------|------------------|
| `next-focus` | Strategy next-focus, carried-forward open questions, open questions, and follow-up findings |
| `recovery` | Stuck and blocked-stop recovery strategies |
| `ideas` | Reducer-promoted ideas backlog entries |
| `general` | Cross-category fallback when a narrower category is not known |

When all candidates in a category are suppressed, continue with the next eligible category or halt for operator input rather than reusing the rejected idea.

#### Step 3: Dispatch Agent
Dispatch `@deep-research` with explicit context:
```text
{state_summary}  // Auto-generated (Step 2b)

Research Topic: {config.topic}
Iteration: {N} of {maxIterations}
Focus Area: {strategy.nextFocus}
Remaining Questions: {strategy.remainingQuestions}
Last 3 Iterations Summary: {brief summaries}
Resource Map: if `config.resource_map_present == true`, prior-inventoried files are listed in `{spec_folder}/resource-map.md`; treat them as the exclusion set when hunting for net-new files; flag only missed-from-map candidates as gaps.
State Files:
  - Config: {artifact_dir}/deep-research-config.json
  - State: {artifact_dir}/deep-research-state.jsonl
  - Strategy: {artifact_dir}/deep-research-strategy.md
Output: Write findings to {artifact_dir}/iterations/iteration-{NNN}.md
CONSTRAINT: LEAF agent -- do NOT dispatch sub-agents
```

#### Executor Resolution

Before dispatching, the YAML resolves the executor via `parseExecutorConfig` from `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`. The resolved `config.executor.kind` selects the dispatch branch:

- `native`: dispatch `@deep-research` agent with model Opus.
- `cli-opencode`: pass the rendered prompt as the last argument of the command `buildLineageCommand` in `fanout-run.cjs` builds, `opencode run --standalone -m X[#Y] --format json --auto "PROMPT"`, started in `{repo_root}` with stdin closed. `reasoningEffort` Y rides as the `#Y` suffix on the model. `--auto` is always passed. `dispatch-iteration.cjs` resolves an unset sandbox mode to `workspace-write`, as fan-out does, and under it the builder hands the child an inline `OPENCODE_CONFIG_CONTENT` that denies `external_directory`; the receipt records `sandboxMode` `workspace-write`. That deny stops OpenCode's file tools at the working directory but does not confine Bash. **In both modes that run, Bash keeps full OS-level write access.** `danger-full-access` adds no deny, and OpenCode exposes no confinement flag, so an explicit `read-only` fails closed before dispatch. The real containment is (a) the `external_directory` deny on the file tools under `workspace-write`, (b) the prompt-level "ALLOWED WRITE PATHS" / "BANNED OPERATIONS" contract rendered into the iteration prompt, which relies on the model obeying instructions rather than an OS-level sandbox, and (c) post-dispatch validation catching some violations after the fact. Fetched/reviewed content must be treated as potentially adversarial (untrusted) for prompt-injection purposes.
- `cli-claude-code`: `claude -p "$(cat prompt)" --model X --permission-mode <mode> --output-format text` with optional `--effort Y`. The permission mode resolves from `--sandbox-mode`: unset or `workspace-write` runs `acceptEdits` so iteration writes succeed, `read-only` runs `plan` and `danger-full-access` runs `bypassPermissions`. The inline workflow branches are not the complete schema: `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi` and `cli-deepseek-harness` (experimental) also have inline branches that run `dispatch-iteration.cjs`, and `cli-mistral-vibe` runs only as a fan-out lineage. The executor-kind authority is `runtime/lib/deep-loop/executor-config.ts` (`EXECUTOR_KINDS`).
- Sandbox on those `dispatch-iteration.cjs` branches: `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi` and `cli-deepseek-harness` resolve the requested `--sandbox-mode` and map it to the kind's own read-only or write surface, which is an OS sandbox only on codex, cursor and the deepseek harness. An unset mode resolves to `workspace-write`, so the iteration can write its iteration file, delta and state record. A requested `read-only` is passed through, never widened, and the iteration then fails at the post-dispatch artifact gate rather than gaining write access. The deepseek harness narrows `danger-full-access` to `workspace-write`, and pi builds the same command for both write modes.

All branches share:
1. Pre-dispatch prompt rendering via `renderPromptPack` (writes to `{artifact_dir}/prompts/iteration-{n}.md`).
2. Post-dispatch validation via `validateIterationOutputs` (asserts iteration file + JSONL delta + required fields).
3. Executor audit append via `appendExecutorAuditToLastRecord` (skipped when kind=='native').

Per-kind flag-compatibility is enforced at config parse time by `EXECUTOR_KIND_FLAG_SUPPORT` in `executor-config.ts`. Setting a flag that the chosen kind does not support throws `ExecutorConfigError` before dispatch.

Cross-CLI delegation (a running executor invoking other CLIs via its shell) is documented design intent. Runtime recursion detection is out of scope; see the SKILL.md Cross-CLI Delegation subsection.

Two containment rules bind every CLI lineage (any `cli-*` executor kind):

- **The lineage is the executor, so it works in-process.** A CLI lineage performs each iteration itself, with its own tools, inside the session the driver already started. The YAML's per-iteration executor dispatch steps are satisfied by the lineage. Spawning a second CLI process for the same iteration is a route violation, not an optimization, and on codex it also fails outright (see `cli-external-orchestration/cli-codex/SKILL.md` Rule 18).
- **Write containment attributes every new dirty path outside the lineage directory to the lineage, and reports it rather than undoing it.**
  - **Default remedy is preserve.** Attribution on a shared checkout is a guess: a tracked file changed anywhere in the same checkout during a lineage window looks identical whether the lineage, an operator, or another session wrote it. The file is left byte-for-byte as it stands, the finding is recorded on the status ledger and the observability stream, and a lane that produced its artifacts still settles as complete, carrying `completed_with_containment_advisory`.
  - **Restore is opt-in.** Restoring is safe only on a checkout with a single writer; under it a path that was already dirty when the lineage started is put back to its pre-dispatch bytes, never to HEAD, and a path whose baseline could not be captured is preserved regardless. Untracked files are never deleted in either mode.
  - **Contested path.** A path that was already dirty when the lineage started and changed again during it is the one exception to attribution: it has a second writer on record, so under the default remedy it is reported as contested, as a `containment_contested` ledger event and a `containmentContested` field on the lineage output, with a note that the tree shows the bytes changed, not who wrote them. A single-lineage run reports the same path the same way, as a `containment_contested` event in its state log, and the dispatch step prints the paths and the note beside any violations. No quarantine copy, patch or revert is made for it, and its pre-dispatch bytes stay in the baseline capture.
  - **Earlier quarantine.** A path the lane itself quarantined on an earlier pass stays the lane's, restore keeps the single-owner reading, and a path that was clean at the baseline is still attributed.
  - **Sibling lineage exemption.** One exemption still applies to attribution: another run's lineage directory under the same top-level packet is treated as that run's own write surface while its loop lock is live, so two lineages can run in sibling phases of one packet at the same time; a directory with no lock, or a stale one, is still attributed here.
  - **Evidence.** The runtime records each finding's diff under the lineage directory at `containment/quarantine/<iteration>[-attempt-<n>]/`, in a `containment-out-of-scope/` subdirectory on the default preserve path and `containment-reverted/` only under restore, where bytes really were rolled back; each pass keeps its own directory so a retry never overwrites an earlier pass's evidence. The pre-dispatch baseline bytes go to `<lineage dir>/containment/baseline/`, so an out-of-scope change stays recoverable either way.

Failure handling: `schema_mismatch` records a conflict event, then three consecutive failures stop the loop with stop reason `error`.

The dispatch context may include a suggested `focusTrack` label (e.g., `"focusTrack": "performance"`, `"focusTrack": "security"`). Agents may tag their iteration with this track label for post-hoc grouping and analysis. Track labels are metadata only - the orchestrator does not use them for loop decisions.

#### Step 3a: Per-Iteration Budget

After dispatch, the orchestrator monitors the running iteration against budget limits:
- **Tool call count**: tracked against `config.maxToolCallsPerIteration` from `assets/deep-research-config.json`, the only source of the per-iteration value
- **Elapsed time**: tracked against `config.maxMinutesPerIteration` (default: 10)
- If either limit is exceeded and no iteration file has been written yet:
  1. Mark the iteration as `"status": "timeout"` in the JSONL record
  2. Log event: `{"type":"event","event":"iteration_timeout","iteration":N,"reason":"tool_calls|elapsed_time"}`
  3. Continue to the next iteration (do not retry the timed-out iteration)
- Budget limits are soft caps - if the agent is actively writing its iteration file when the limit is reached, allow completion

#### Step 3b: Direct Mode Fallback (REFERENCE-ONLY)

When agent dispatch fails after the earlier recovery tiers are exhausted:

1. Detect dispatch failure: Task tool timeout, API overload (529), or agent crash
2. Log event: `{"type":"event","event":"direct_mode","iteration":N,"reason":"dispatch_failure"}`
3. Orchestrator absorbs the iteration work:
   - Read state files (JSONL + strategy.md)
   - Determine focus from strategy "Next Focus"
   - Execute 3-5 research actions directly
   - Write `research/iterations/iteration-NNN.md`
   - Update strategy.md
   - Record the iteration through the append gateway
4. Continue loop normally after direct-mode iteration completes
5. If direct mode also fails, escalate to the final user-escalation tier

**Note**: Direct mode iterations are logged with `"directMode": true` in their JSONL record for diagnostic tracking.

#### Step 4: Evaluate Results
After agent completes:
1. Verify `{artifact_dir}/iterations/iteration-{NNN}.md` was created
2. Verify JSONL was appended with iteration record
3. Run reducer with `{ latestJSONLDelta, newIterationFile, priorReducedState }`
   - This is a **delta refresh**, not a full replay of every historical JSONL row on each iteration.
   - The reducer consumes only the newest JSONL slice plus the latest iteration artifact against the previously reduced packet state.
4. Verify reducer refreshed `deep-research-strategy.md`, `findings-registry.json`, and `deep-research-dashboard.md`
5. Verify the refreshed packet surfaces reflect the new iteration evidence
6. Extract `newInfoRatio` from JSONL record
7. Let `deriveLoopCounters` in `runtime/scripts/convergence.cjs` derive the stuck count from the state log on every pass: skip `status == "thought"` (no change), reset to 0 if `status == "insight"` (breakthrough counts as progress), increment if `newInfoRatio < config.convergenceThreshold`, reset otherwise. A resumed run counts the same as one that never paused.

#### Step 4a: Generate Dashboard

After evaluating iteration results, the reducer generates the human-readable dashboard:

1. Read JSONL state log, findings registry, and strategy.md
2. The reducer writes or rewrites `research/deep-research-dashboard.md` with the following sections:
   - **Iteration table**: `| run | focus | newInfoRatio | findings count | status |`
   - **Question status**: `X/Y answered` with itemized list (answered vs remaining)
   - **Trend**: Last 3 newInfoRatio values with direction indicator (ascending, descending, flat)
   - **Dead ends**: Consolidated from all iteration `ruledOut` data
   - **Next focus**: Current value from strategy.md
   - **Active risks**: Guard violations, stuck count, budget warnings
3. Log event: `{"type":"event","event":"dashboard_generated","iteration":N}`
4. The dashboard is **auto-generated only** - never manually edited
5. The dashboard file is overwritten each iteration (not appended)
6. Dashboard generation is non-blocking: if it fails, log a warning and continue the loop

In **confirm mode**, the dashboard is displayed to the user at each iteration approval gate. In **auto mode**, it is written silently for post-hoc review.

#### Step 4b: Checkpoint Commit (REFERENCE-ONLY)

This checkpointing pattern is documented for reference, but current runtimes should not assume it is available.

After each iteration is verified (JSONL appended, iteration file written, reducer outputs refreshed):

1. **Stage targeted files only** (never `git add -A`):
   ```bash
   git add research/iterations/iteration-{NNN}.md
   git add research/deep-research-state.jsonl
   git add research/deep-research-strategy.md
   git add research/findings-registry.json
   git add research/deep-research-dashboard.md
   git add research/research.md  # if it exists
   ```
2. **Sanitize**: Exclude `.env`, credentials, large binaries from staging
3. **Commit**: `git commit -m "chore(deep-research): iteration {NNN} complete" -m "{one-line summary of what the iteration found}"`
4. **On commit failure**: Log warning and continue (checkpoint is non-blocking)

Checkpoint commits provide rollback points: `git log -- research/` shows the last good state for the research packet. If state corruption occurs, `git checkout HEAD~1 -- research/deep-research-state.jsonl` restores the previous version.

#### Step 5: Loop Decision
- If convergence check returns STOP: exit to synthesis
- If STUCK_RECOVERY: modify focus directive, reset stuck count, continue
- Otherwise: increment iteration counter, go to Step 1

### Expansive Depth Frontier (opt-in)

Under `--depth-mode=expansive` the loop keeps a frontier of follow-up questions. When `research/inbox.jsonl` already holds frontier rows at strategy creation, `step_create_strategy` writes an empty Key Questions list and the reducer adds the frontier rows, so the frontier is the only question intake; a fan-out lineage dealt no seed share has no frontier rows and derives its key questions from the topic as a default run does. The flag writes `antiConvergence.depthMode: "expansive"` and the caps in `expansiveDepth`: `maxDepth` 3, `maxChildrenPerNode` 6, a `budgetSplit` of 0.5/0.35/0.15 per depth, and `maxFrontierNodes`, which defaults to half of `maxIterations` unless the config sets a number. Two flags set the caps when the config is created: `--frontier-max-depth=N` writes `maxDepth` and `--frontier-max-nodes=N` writes `maxFrontierNodes`; both take a positive integer, need `--depth-mode=expansive` on a single-executor run, and are refused on a fan-out config. The depth-1 seed answers only to the root-children cap, but every seed that is not pruned counts toward the run cap. When `--max-iterations` is left at its default, the run sizes its budget from the seed: `min(24, max(10, 2 × (S + maxDepth − 1)))` iterations for S seeded depth-1 nodes, 16 at the full six seeds, and the seed step prints the derived budget. A fan-out lineage with no matrix `iterations` value is sized the same way from its own round-robin share of the seed, with a floor of 12 for a native lineage and 10 for a CLI one, and a lineage dealt no seed node runs at that floor. The node cap stays half that budget, which leaves room for at least two nodes past depth 1. An explicit `--max-iterations`, marker, setup answer or fan-out matrix `iterations` value always wins, even below the derived value, and the seed warns when it leaves no room past depth 1. A run without the flag keeps the default path and its behavior. The one byte change is the expansive-only persona paragraph in the CLI lineage prompt, which the golden test strips before it compares.

`step_frontier_seed` decomposes the topic into 3 to 6 depth-1 nodes before iteration 1. On a plain run it sits in `phase_init` after `step_create_config`; on a fan-out run it runs before `step_fanout_spawn`. It calls `runtime/scripts/frontier-admit.cjs seed`.

A leaf may append `frontier_proposal` rows to its delta only when its prompt carries a FRONTIER block, which `frontier-admit.cjs block` computes from the focus the workflow writes to `research/frontier-focus.txt` with its file tool and passes as `--focus-file`, so the focus never travels inside a shell argument. The block is the smaller of the node's remaining child slots and the run-wide room left under `maxFrontierNodes`, and the prompt pack renders it through `{frontier_block}`. `step_frontier_admit` runs before `step_reduce_state` and calls `frontier-admit.cjs admit`, which applies seven checks in order: relevance, dedupe, depth, fan-out, node-cap, budget, cycle. `fanout` prunes past a parent's own children cap and `node-cap` past the run-wide `maxFrontierNodes` cap. Relevance fails a proposal with no question, no evidence or no usable scope, a parent that is not in the store or was pruned, and a question or any scope entry longer than 500 characters. Before the checks run, every control character in the question and scope is replaced with a space and repeated spaces are collapsed, so a stored row, a focus line and the inbox text never carry a newline. The first failure prunes the proposal with that reason. Admitted nodes become `research/inbox.jsonl` rows with `origin: "frontier"`.

Next Focus picks the shallowest open node first, then the least visited, then the oldest, and writes `Frontier node <id> (depth N, scope S): <question>` so a visit does not read as an answer.

The reducer publishes `registry.frontier.activeNodeId`, the node the next focus picks by the same breadth-first choice. Under expansive depth with an active node, the stuck count reads only the passes bound to that node, by `frontierNodeId`, the `Frontier node <id>` focus marker or the store's `active` row, so low passes on its siblings cannot close it. Under stuck recovery the handler takes that published `activeNodeId`, not the focus text, closes the node as `exhausted` with reason `stuck` through `frontier-admit.cjs close`, keeps the `stuckRecovery` event, and moves to the next open node. Global recovery runs only when no node is open or active. A default run keeps the run-wide count.

On a fan-out run, `fanout-run.cjs --depth-mode expansive` deals the seeded open depth-1 nodes round-robin in node-id order, by UTF-16 code unit rather than locale collation, across lineages, writes the `frontier-nodes.jsonl` and inbox rows of each lineage dealt at least one node that has no store yet before it spawns (a lineage dealt no node gets neither and runs at its loop default), binds `frontier_scope:` in the lineage prompt and records `frontier_partition` in `orchestration-summary.json`. `fanout-merge.cjs` merges the lineage frontiers, each node keeping its lineage label, and records a partition guard that names any dealt node no lineage reports.

### Ideas Backlog Convention

The canonical ideas backlog is reducer-owned and derived from JSONL lifecycle events. A persistent ideas file at `research/research-ideas.md` may still exist as operator-authored context, but leaf agents record new machine-discovered tangents with `idea_observed` events.

#### Check Points

The orchestrator checks the ideas backlog at three points:

1. **Init**: During strategy initialization, if `research/research-ideas.md` exists from a prior session, read it as operator-authored context and incorporate relevant ideas into the initial key questions or "Next Focus"
2. **Stuck**: During stuck recovery (Step 2a of the recovery protocol in convergence.md), check reducer-promoted ideas before defaulting to generic recovery strategies. Promoted ideas often provide the best escape from stuck states
3. **Resume**: On auto-resume, read JSONL, registry, strategy.md, and any operator-authored ideas file to restore full context

#### Event Format

```json
{"type":"event","event":"idea_observed","mode":"research","run":4,"ideaId":"idea-cache-stampede","idea":"Investigate cache stampede mitigation","category":"ideas","source":"iteration-004.md","timestamp":"2026-05-24T00:00:00Z"}
{"type":"event","event":"idea_promoted","mode":"research","run":5,"ideaId":"idea-cache-stampede","idea":"Investigate cache stampede mitigation","category":"ideas","observationCount":2,"minIdeaObservations":2,"firstObservedRun":4,"lastObservedRun":5,"timestamp":"2026-05-24T00:01:00Z"}
{"type":"event","event":"idea_rejected","mode":"research","run":6,"ideaId":"idea-cache-stampede","idea":"Investigate cache stampede mitigation","category":"ideas","reason":"Operator rejected this direction","timestamp":"2026-05-24T00:02:00Z"}
```

Users can edit `research-ideas.md` between sessions to steer future iterations. Agents do not promote ideas directly; they emit observations, and the reducer owns promotion, ranking, rejection filtering, and dashboard projection.

### Stuck Recovery Protocol
When stuckThreshold consecutive iterations show no progress (default: 3, configurable via config.json):

**Step 0: Classify Failure Mode**
Before selecting a recovery strategy, classify why progress stalled:
1. Read the last N iteration files (where N = stuckThreshold) to determine the failure pattern
2. Classify into one of the following modes:
   - `shallow_sources` - iterations find content but lack depth or authoritative sources
   - `contradictory` - iterations return conflicting information without resolution
   - `too_broad` - focus area is too wide, producing scattered low-value findings
   - `repetitive` - iterations keep rediscovering the same information
   - `exhausted` - the topic area has been thoroughly explored with diminishing returns
3. Select a targeted recovery prompt based on the classification (see convergence.md §4 for category-specific strategies)
4. Log classification: `{"type":"event","event":"stuck_classified","mode":"<classification>","iteration":N}`

**Steps 1-5: Execute Recovery**
1. Read strategy.md "What Worked" section
2. Identify least-explored question from "Key Questions"
3. Set next focus to: "RECOVERY: Widen scope to {least-explored-area}. Try a fundamentally different approach." (refined by classification)
4. Reset stuck counter
5. If recovery iteration also shows no progress: exit to synthesis with gaps documented

---

## 4. WAVE ORCHESTRATION PROTOCOL (REFERENCE-ONLY)

An optional parallel execution concept for research topics with multiple independent questions. Treat this as reference guidance only; the live workflow remains sequential and does **not** emit wave-specific JSONL events or routing today.

### When to Use Waves

- 3+ independent key questions identified during initialization
- Questions do not depend on each other's answers
- Parallelism is beneficial (time-constrained research, broad survey)

### Wave Execution Model (conceptual only)

```text
Wave 1: Dispatch N agents on independent questions
  |
  +-- Agent A: Question 1 --> iteration-001.md (newInfoRatio: 0.8)
  +-- Agent B: Question 2 --> iteration-002.md (newInfoRatio: 0.3)
  +-- Agent C: Question 3 --> iteration-003.md (newInfoRatio: 0.7)
  |
Scoring: Rank by newInfoRatio, prune below median only in a future runtime that explicitly adds wave support
  |
Wave 2: Follow-up on top-K questions (K = ceil(N/2))
  +-- Agent A: Question 1 follow-up --> iteration-004.md
  +-- Agent C: Question 3 follow-up --> iteration-005.md
  |
Repeat until convergence
```

### Scoring and Pruning

In a future wave-enabled runtime:
1. Rank all wave iterations by `newInfoRatio`
2. Compute wave median: `median([i.newInfoRatio for i in wave_iterations])`
3. **Prune**: Questions with newInfoRatio below median would be deprioritized
4. **Promote**: Top-K questions (K = ceil(N/2)) would get follow-up iterations
5. Pruned questions would move to the ideas backlog, not be discarded

### Breakthrough Detection

When any single iteration in a wave achieves `newInfoRatio > 2x wave_average`:

1. Flag as **breakthrough**: `{"type":"event","event":"breakthrough","iteration":N,"ratio":X.XX}`
2. Generate 2-3 adjacent questions from the breakthrough findings
3. Prioritize these adjacent questions in the next wave
4. Breakthrough iterations are NEVER pruned

### Wave JSONL Records

Wave-specific fields and events are **not part of the current persisted contract**. Until a runtime explicitly ships wave support, keep iteration records and events on the standard sequential schema only.

### Integration with Sequential Loop

- Waves are an ALTERNATIVE to sequential iteration, not a replacement
- The convergence algorithm applies identically (uses all iteration records)
- A future wave-capable runtime could transition back to sequential mode when questions narrow to 1-2
- The current runtime never spawns a wave automatically

---

## 5. CONTEXT ISOLATION DISPATCH (EXPERIMENTAL, REFERENCE-ONLY)

An alternative dispatch mechanism that guarantees fresh context per iteration by launching a new OS process. Treat this as reference-only unless the runtime explicitly implements alternate CLI dispatch.

### Motivation

The standard dispatch (Task tool) shares the parent session's token budget. In long research sessions (10+ iterations), this may cause context compression that degrades reasoning quality. Process-level isolation eliminates this risk.

### Dispatch Mechanism

Replace Task tool dispatch with shell-level `claude -p` invocation:

1. **Generate prompt**: Orchestrator builds a self-contained prompt from:
   - Strategy.md (current state)
   - Config.json (parameters)
   - Last N iteration summaries (from JSONL)
   - Compact state summary (Step 2b)
   - Full agent protocol instructions
2. **Write to temp file**: `scratch/.dispatch-prompt-{NNN}.md`
3. **Execute**: `claude -p "$(cat scratch/.dispatch-prompt-{NNN}.md)" --max-turns 50 --output-format json`
4. **Collect output**: Agent writes iteration file directly to disk
5. **Verify**: Orchestrator checks iteration file and JSONL were created
6. **Cleanup**: Remove temp prompt file

### Trade-offs

| Aspect | Task Tool Dispatch | `claude -p` Dispatch |
|--------|-------------------|---------------------|
| Context freshness | Shared budget, may degrade | Guaranteed fresh |
| Token cost | Lower (cached context) | Higher (full context per call) |
| Latency | Lower (in-process) | Higher (new process startup) |
| Context size | Limited by parent budget | Full model context available |
| Error handling | In-process exceptions | Process exit codes |

### When to Use

- Autonomous/unattended research sessions (overnight runs)
- Research past iteration 8+ where context degradation is measurable
- Critical research where reasoning quality must not degrade

**Status**: Reference-only. Track adoption based on need for fully autonomous overnight research sessions.

---

## 6. PHASE: SYNTHESIS

### Purpose
Compile all iteration findings into final research/research.md. The synthesis workflow owns the canonical `research/research.md` output.

### Steps

1. **Read all iteration files**: `research/iterations/iteration-*.md`
2. **Read strategy.md**: Final state of questions, approaches
3. **Compile research/research.md**: Merge findings into 17-section format
   - Deduplicate overlapping findings
   - Organize by section topic
   - Add citations from iteration files
   - Cite `{spec_folder}/resource-map.md` in the References section when `config.resource_map_present == true`
   - Do not synthesize a placeholder reference when `resource-map.md` was absent at init
   - Note unanswered questions in Section 12 (Open Questions)
   - **Include a mandatory "## Eliminated Alternatives" section** as primary research output:
     - Consolidate all `ruledOut` entries from iteration JSONL records
     - Consolidate all `## Dead Ends` sections from iteration files
     - Format as a table: `| Approach | Reason Eliminated | Evidence | Iteration(s) |`
     - This section documents negative knowledge (what was tried and why it failed)
     - Treat as primary research output - not an appendix or afterthought
     - Place after Section 11 (Recommendations) and before Section 12 (Open Questions)
4. **Extension snapshot**: an extension keeps the prior synthesis. Before its first dispatch, `step_snapshot_extended_synthesis` copies this file to `research/synthesis-v{generation}-r{continuedFromRun}.md` and never overwrites an existing snapshot
5. **Update config status**: Set `status: "complete"` in config.json
6. **Refresh the dashboard**: `step_refresh_completed_dashboard` reruns the reducer, so the dashboard reports the completed status. A fan-out run skips it, and a failure only logs a warning.
7. **Final JSONL entry**: `{"type":"event","event":"synthesis_complete","totalIterations":N,"answeredCount":A,"totalQuestions":Q,"stopReason":"converged"}`

### Progressive vs Final Synthesis
- If `progressiveSynthesis: true` (default): research/research.md was updated each iteration. Final synthesis is a cleanup pass.
- If `progressiveSynthesis: false`: research/research.md is created from scratch during synthesis.

---

## 7. PHASE: SAVE

### Purpose
Preserve research context to memory system.

### Steps

1. **Compose context payload**: Write `/tmp/save-context-data-<session-id>.json` with `specFolder`, `sessionSummary`, `observations`, `recent_context`, `toolCalls` and `exchanges`. A full-auto save writes continuity only from `recent_action`, `next_safe_action`, `blockers` and `key_files`, so the payload carries all four.
2. **Generate context**: `node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js /tmp/save-context-data-<session-id>.json {spec_folder} --full-auto`. Without `--full-auto` the writer only plans and writes no continuity.
3. **No extra indexing step in the live contract**: `generate-context.js` is the supported save boundary for this workflow
4. **Verify**: Confirm `implementation-summary.md`, `decision-record.md` or `handover.md` in the spec folder carries the new continuity update. Standalone `memory/*.md` files are retired.

---

## 8. STATE TRANSITIONS

```text
[INITIALIZED] --> config + strategy + state created
    |
[ITERATING] --> agent dispatched, executing research
    |
[EVALUATING] --> iteration complete, checking convergence
    |
    |-- newInfoRatio >= threshold --> [ITERATING]
    |-- stuck_count >= stuckThreshold --> [STUCK_RECOVERY]
    |-- converged or max_iterations --> [SYNTHESIZING]

[STUCK_RECOVERY] --> widen focus, try different approach
    |
    |-- recovered (newInfoRatio > 0) --> [ITERATING]
    |-- still stuck --> [SYNTHESIZING] (gaps documented)

[SYNTHESIZING] --> final research/research.md compilation
    |
[SAVING] --> memory context preservation
    |
[COMPLETE] --> all artifacts created, loop finished
```

Hook-capable and non-hook runtimes must follow the same state machine. Hooks may pre-prime context, but they must not change which lifecycle branch the packet selects.

---

## 9. ERROR HANDLING

| Error | Phase | Action |
|-------|-------|--------|
| Agent dispatch timeout | Loop | Retry once with reduced scope. If second timeout, mark iteration as "timeout" and continue |
| WebFetch fails | Loop | Log URL in iteration file, try alternative source, continue with available data |
| State file missing | Init/Loop | If JSONL missing: re-initialize. If strategy missing: reconstruct from JSONL |
| JSONL malformed | Loop | Skip malformed lines, reconstruct from valid entries |
| 3+ consecutive failures | Loop | Halt the loop with stop reason `error` and enter synthesis with partial findings. In confirm mode the workflow first asks Retry, Skip or Cancel. |
| Agent dispatch failure (API overload, timeout) | Loop | Escalate through the documented recovery ladder in order. Direct mode fallback is reference-only unless the runtime explicitly supports it. |
| Memory save fails | Save | Preserve the current `{artifact_dir}` packet as backup, then log the error |

### State Recovery Protocol

When state files are missing or corrupted, apply this 5-priority cascade:

| Priority | Condition | Recovery Action |
|----------|-----------|----------------|
| 1 (Primary) | JSONL exists and parseable | Normal operation (with fault-tolerant parsing) |
| 2 (Strategy rebuild) | JSONL exists, strategy.md missing | Reconstruct strategy from JSONL: extract questions, focus areas, newInfoRatio trend. Create minimal strategy.md |
| 3 (JSONL reconstruction) | JSONL missing/corrupt, iteration files exist | Scan `research/iterations/iteration-*.md`, parse Assessment sections, reconstruct JSONL with `status: "reconstructed"` |
| 4 (Config-only restart) | Only config.json remains | Restart from initialization phase using config parameters. Log: `{"type":"event","event":"fresh_restart","reason":"state_files_missing"}` |
| 5 (Abort) | Config.json also missing | Cannot recover. Report error and halt. |

Each priority level is attempted in order. If a level fails, fall through to the next. See state-format.md for JSONL reconstruction details.

---

## 10. CONFIRM MODE ADDITIONS

In confirm mode, the YAML workflow adds approval gates:

| Gate Location | Behavior |
|---------------|----------|
| After initialization | Show config and initial strategy. Wait for approval |
| After each iteration | Show iteration findings and convergence status. Options: Continue, Adjust Focus, Stop |
| Before synthesis | Show summary of all iterations. Wait for approval to synthesize |
| After synthesis | Show final research/research.md summary. Approve or request revisions |

---

## 11. REVIEW MODE ROUTING

Deep-review lifecycle, convergence, state schemas, traceability protocols, and report contracts live in the sibling `deep-review` skill.

This reference keeps only the routing rule: do not document or execute review-mode loop behavior from `deep-research`. Route review requests to `deep-review/SKILL.md` and its references.
