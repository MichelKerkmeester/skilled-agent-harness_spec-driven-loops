# Contract Compiler Design Expansion - Deliverables 5-7

This document expands the seed design in `design.md` with the three omitted deliverables requested for phase 001:

- 5. Pacing / resume.
- 6. Rollout flag -> live consumer.
- 7. 035 T002 unblock.

Scope boundary: this is design only. It does not build the compiler or modify runtime behavior. Existing APIs are named as existing. Any API, file, field, or script that does not currently exist is explicitly labeled `proposed-new`.

## 5. Pacing / Resume

### Live Evidence

The compiler should reference existing runtime mechanisms instead of inventing another liveness system:

| Evidence | Design Implication |
| --- | --- |
| Research F-031 says iteration units are atomic-heavy and a budget-killed run can get zero credit because only complete `type:"iteration"` records count; F-034 says no pacing contract exists for first-artifact deadlines, budget-fraction checkpoints, or pre-cap finalizers. `034-gpt-reliability-research/research/briefs/R5-ranking-crosscheck.md:55-58` | The compiled contract needs a top-loaded pacing block, not just more prose in prompt packs. |
| `progress-record.cjs` defines `PROGRESS_RECORD_TYPE = 'progress'`, `PROGRESS_RECORD_EVENT = 'progress_record'`, excludes progress from completion-bearing types, and sets `PROGRESS_THRESHOLD_SECONDS = 60`. `.opencode/skills/deep-loop-workflows/shared/progress/progress-record.cjs:13-28` | Pacing must use the existing progress-record vocabulary and threshold. |
| Review, research, and context reducers all filter progress records out before computing completion. `.opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs:1836-1842`, `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:2514-2521`, `.opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs:686-694` | Progress records are safe liveness edges but cannot be counted as iterations, convergence, or terminal success. |
| Deep-context explicitly says seats are read-only and the host writes merged state. `.opencode/commands/deep/assets/deep_context_auto.yaml:19-24` | Context pacing belongs to the host, not to CLI/native seats. |
| Deep-context per-seat settle requires host writes and progress pairs as each seat returns. `.opencode/commands/deep/assets/deep_context_auto.yaml:385-389`, `.opencode/commands/deep/assets/deep_context_auto.yaml:443-477` | The compiled contract should preserve per-seat settle as the context liveness primitive. |
| Deep-ai-council requires per-seat progress around seat artifact writes and documents watchdog-only fallback. `.opencode/commands/deep/assets/deep_ai-council_auto.yaml:126-130` | Council pacing should compile per-seat persistence, not a hidden internal deliberation loop. |
| Research F-018 flags council adjudicator-stability loops as a hidden-loop risk and proposes a single bounded referee pass per persisted round. `034-gpt-reliability-research/research/briefs/R5-ranking-crosscheck.md:42` | The compiler should make hidden referee loops structurally illegal unless a later explicit opt-in flag is designed. |
| Auto setup Tier 1 resolves all required fields and loads YAML without a question; Tier 2 is narrow; Tier 3 fails fast. `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md:31-56` | Resume and pacing must happen after deterministic setup, not by asking new generic setup questions. |
| Gate-3 classifier already has a `CommandContract` shape, pre-bound spec-folder satisfaction, and resume trigger handling. `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:67-72`, `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:653-681`, `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:812-820` | The compiled contract should call the classifier contract with bound setup facts rather than restating Gate-3 prose. |

### Proposed-New Contract Fields

The compiler should emit a compact, command-local pacing/resume block into the compiled contract. These fields are `proposed-new` schema fields, not existing runtime APIs:

```yaml
commandContract:
  proposed-new:
    pacing:
      firstArtifactDeadlineSeconds: 60
      progressRecordType: progress
      progressRecordEvent: progress_record
      completionBearingTypes: [iteration, event]
      checkpointRule: "Before any step expected to exceed 60 seconds, emit a started/completed progress pair or an artifact write."
      preCapFinalizer: "If visible progress exists before a timeout/tool cap, write a checkpoint summary and stop with partial status; do not claim convergence."
      stallPolicy: "Never increase budget for a dark stall. Budget extension is allowed only when progress records or artifact mtimes prove visible progress."
    resume:
      gate3Classifier: ".opencode/skills/system-spec-kit/shared/gate-3-classifier.ts#classifyPrompt"
      satisfiedBy: [prebound_spec_folder, prior_answer]
      validPreboundSources: [flags, pre_bound_setup_answers, target_path_resolution]
      lineageModes: [new, resume, restart]
      canonicalCompletionRecords: [iteration, event]
      nonCompletionRecords: [progress]
```

### Compile Rules

1. Compile the `progress-record.cjs` constants by value into the contract, but keep the runtime source as the owner. The compiler must fail drift if `PROGRESS_RECORD_TYPE`, `PROGRESS_RECORD_EVENT`, `COMPLETION_BEARING_TYPES`, or `PROGRESS_THRESHOLD_SECONDS` changes without a regenerated contract.
2. Compile a first-artifact deadline of 60 seconds because the live progress threshold is 60 seconds. This is not a new policy value; it is derived from `PROGRESS_THRESHOLD_SECONDS`.
3. Compile the rule that progress records reset liveness but never count as an iteration, synthesis event, convergence event, or completion event.
4. Compile resume as a write-path. `/deep:*` resume triggers and `:auto` should route through `classifyPrompt(..., { executionMode: 'AUTONOMOUS', boundSpecFolder, commandContract })`, where the command contract declares autonomous execution, owns spec-folder setup, and supplies a write boundary.
5. Compile `lineage_mode=restart` as an operator-authorized archive when explicitly requested. Review already states restart archives before fan-out or init and must fail rather than silently resume if archive fails. `.opencode/commands/deep/assets/deep_review_auto.yaml:137-152`
6. Compile context as host-owned progress. CLI/native seats remain read-only analyzers; the host writes seat JSON, progress records, state log, deltas, dashboard, registry, and final report.
7. Compile council pacing as stepwise per-seat persistence. The council contract must permit one bounded referee/adjudication pass per persisted round, then persist a round result or a typed stop reason. Any repeat adjudication loop is illegal unless a later, explicitly named opt-in flag is added.
8. Compile pre-cap finalizer behavior as partial state, not success. If an iteration has no valid `type:"iteration"` record, resume should continue from the last completed iteration plus progress/advisory evidence, not from an in-memory claim.

### Acceptance For Later Implementation

| Acceptance | Evidence Required |
| --- | --- |
| Progress is visible but non-terminal | Inject progress records into review, research, and context state logs; reducers still report the same completed iteration count because progress is filtered out. |
| Resume does not ask Gate 3 after autonomous setup binds a valid spec folder | A classifier test covers `executionMode: 'AUTONOMOUS'`, valid `boundSpecFolder`, `ownsSpecFolderSetup: true`, and a matching write boundary returning `requiresGate3Prompt: false`. |
| Context partial seat progress survives a straggler | A context fan-out test has one failed or delayed seat, verifies surviving seat files and progress records are written, and verifies merge proceeds with degraded agreement. |
| Council hidden-loop risk is bounded | A council test verifies each round persists seat progress before adjudication and no more than one referee pass occurs unless an explicit later opt-in flag exists. |
| Pre-cap finalizer is not a false success | A timeout-with-progress test writes a checkpoint/partial status and does not emit synthesis/completion. A dark-stall test does not receive a budget extension. |

### Residual Risk

OpenCode and external CLI executors may not expose token-budget exhaustion early enough for a perfect pre-cap finalizer. The fallback must be wall-clock and artifact/progress based. macOS/BSD locks are advisory in the current YAML notes, so single-writer safety remains best-effort under hostile concurrent processes. Council's in-process seat simulation can still be indivisible in the documented fallback; the compiled contract should treat that as degraded watchdog-only mode, not as the default success path.

## 6. Rollout Flag -> Live Consumer

### Live Evidence

The rollout core exists, but the live consumer does not:

| Evidence | Design Implication |
| --- | --- |
| `resolveInjectionMode(command)` canonicalizes command names, honors `SPECKIT_COMMAND_INJECTION_MODE`, reads `command-injection-rollout.json`, accepts only `fallback` and `fix`, and defaults to `fallback`. `.opencode/skills/deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs:10-13`, `.opencode/skills/deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs:57-68` | The consumer must call this resolver at render time, not ask the model to choose a mode. |
| The rollout map currently keeps every deep command in `fallback`. `.opencode/skills/deep-loop-workflows/shared/rollout/command-injection-rollout.json:1-10` | The first implementation can ship safely with zero behavior change until a command is flipped. |
| The rollout README says manifest capture and comparator are deferred. `.opencode/skills/deep-loop-workflows/shared/rollout/README.md:9-12` | A live consumer without capture/comparator would be unpromotable. |
| Registered command dispatch is the only way slash-command templates enter non-interactive OpenCode sessions; raw slash text is just prose. `.opencode/skills/cli-opencode/SKILL.md:271` | T002 and rollout tests must use `opencode run --command`, not raw `/deep:review ...` text. |
| Existing command templates can evaluate a shell line before the model reads policy; `/memory:search` uses a bang-shell interpolation line to bind invocation facts from `$ARGUMENTS`. `.opencode/commands/memory/search.md:13-19` | The concrete insertion point should be a command-template render prelude, not a late model instruction. |
| `design-unknowns.md` resolves the insertion point as command-scoped Markdown after command frontmatter and H1, before the existing router prose and `## 1. ROUTER CONTRACT`. `.opencode/specs/deep-loops/036-command-contract-compiler/001-contract-compiler-design/design-unknowns.md:3-12` | The rollout consumer must render into that command-body seam, not into a session-global plugin. |
| `/deep:review` loads the selected workflow asset only after required setup values are bound. `.opencode/commands/deep/review.md:90-97` | The compiled contract prelude must appear before selected YAML content is exposed to the model. |

### Proposed-New Live Consumer

Use the command-template shell interpolation seam as the primary live consumer, placed at the resolved command-body seam: after the H1 and before `## 1. ROUTER CONTRACT`. The model-visible output at that seam must be command-scoped Markdown. The command body can call a `proposed-new` renderer there:

```md
!`node .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs --command deep/review -- '$ARGUMENTS'`
```

`render-command-contract.cjs` is `proposed-new`. It must:

1. Call existing `resolveInjectionMode('deep/review')`.
2. Parse `$ARGUMENTS` with the same argv semantics documented for command-template shell interpolations, joining argv itself.
3. In `fallback`, emit the previously captured legacy body slice byte-for-byte for the portion after the insertion seam.
4. In `fix`, emit the compiled contract first, then the minimum legacy body needed to preserve command discovery, setup, and YAML handoff.
5. Emit no model-visible explanation of the flag decision. The model receives only the selected rendered contract/body.
6. Record a manifest row for both modes.

The OpenCode plugin message-transform path is secondary. Existing plugins can append system or synthetic message blocks through `experimental.chat.system.transform` and `experimental.chat.messages.transform`. `.opencode/plugins/mk-code-graph.js:442-468`, `.opencode/plugins/mk-code-graph.js:470-517` This is useful for session-global hints, but it is not the primary contract insertion point because it is not command-template-owned and may not know the command name without extra detection.

### Proposed-New Manifest Capture

The renderer should write one JSONL manifest row per render. This is `proposed-new` storage and schema:

```json
{"type":"command_contract_render","command":"deep/review","mode":"fallback|fix","argsSha256":"...","legacyBodySha256":"...","compiledContractSha256":"...","renderedSha256":"...","sourceDigests":[{"path":"...","sha256":"...","section":"..."}],"timestamp":"..."}
```

Storage should be packet-local when a spec folder is bound, otherwise under a command-contract rollout state directory with session scoping. The manifest is not model-authored. It is host-renderer evidence.

### Comparator And Promotion Rules

The comparator is `proposed-new`. It must be CI-runnable and locally runnable:

1. For every command still in `fallback`, render current fallback and compare it to the captured legacy body. Any byte difference blocks promotion.
2. For commands in `fix`, render fallback and fix for the same fixture argument sets and report the exact diff. Allowed diffs are the compiled contract prelude, manifest metadata, and source digest headers.
3. Refuse promotion if the compiled contract references source digests that no longer match the live files.
4. Refuse promotion if `fix` omits the Gate-3 classifier contract, receipt/progress references, write boundary, or setup values required by the command's YAML start condition.
5. Promotion requires a live acceptance run and a baseline leg. The baseline leg must remain green in `fallback`; the fix leg must show the intended behavior flip.

### Residual Risk

Command-template shell interpolation must be proven to preserve exact byte output, including leading/trailing newlines. If the OpenCode renderer normalizes whitespace around shell-interpolation output, strict byte-identical fallback may require storing the whole legacy command body inside the renderer and making the command bootstrap body intentionally outside the compared payload. If `opencode run --command` changes `$ARGUMENTS` expansion semantics, the renderer's argv parser and all rollout fixtures must be updated together.

## 7. 035 T002 Unblock

### Live Evidence

035 phase 004 shipped mechanisms but left live acceptance blocked on 036 wiring:

| Evidence | Design Implication |
| --- | --- |
| T002 is blocked for RVB-007, RSB-005, RSB-007, ACB-004-high, ACB-005, and CXB-004 because progress reducers and route asserts are live, but receipt/Gate-3 fixes are still prose and the rollout flag has no live consumer. `.opencode/specs/deep-loops/035-gpt-reliability-fixes/004-dispatch-receipts-and-progress/tasks.md:58-75` | T002 must not rerun until compiled-contract injection and rollout consumption are live. |
| The 035 implementation summary repeats that live acceptance cells were not re-run and explains that pre-036 runs would measure distributed-instruction prose, not the intended mechanism. `.opencode/specs/deep-loops/035-gpt-reliability-fixes/004-dispatch-receipts-and-progress/implementation-summary.md:94-103` | The unblock gate is structural wiring, not another documentation pass. |
| The 036 context index names the exact same blocker and says T002 should run after the fixes are wired into the compiled per-command contract and the flag becomes a live consumer. `.opencode/specs/deep-loops/036-command-contract-compiler/context-index.md:26-28` | This design must define the wiring-complete criteria. |
| The audited executor writes INTENT and COMPLETION receipts when `receiptDir` is set. `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:102-107`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:544-582` | The contract should require receipt opt-in for CLI branches and bind the dispatch id into validation. |
| Receipt validation distinguishes missing, invalid MAC, and intent mismatch; a valid receipt makes model-written route-proof fields advisory while keeping `mode` hard-enforced. `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:201-205`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:633-736`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:879-924`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1642-1653` | The compiled contract should make receipt expectation mandatory wherever a dispatch wrapper creates receipts. |
| Review and research CLI branches already pass `receiptDir` and a generated `dispatchId` into `runAuditedExecutorCommand`. `.opencode/commands/deep/assets/deep_review_auto.yaml:864-891`, `.opencode/commands/deep/assets/deep_review_auto.yaml:946-958`, `.opencode/commands/deep/assets/deep_review_auto.yaml:1013-1027`, `.opencode/commands/deep/assets/deep_research_auto.yaml:897-909`, `.opencode/commands/deep/assets/deep_research_auto.yaml:967-981` | The missing part is not receipt creation; it is compiled, deterministic exposure of the receipt expectation to post-dispatch validation. |
| Review and research post-dispatch validation currently lists route proof and artifact assertions. `.opencode/commands/deep/assets/deep_review_auto.yaml:1041-1069`, `.opencode/commands/deep/assets/deep_research_auto.yaml:995-1029` | The compiler should augment the validation input with the receipt pair expected for that dispatch. |
| `design-unknowns.md` confirms fan-out receipt/progress parity is not identical yet and must remain residual risk until fan-out is routed through audited receipt writing or a parity adapter. `.opencode/specs/deep-loops/036-command-contract-compiler/001-contract-compiler-design/design-unknowns.md:28-38` | T002 unblock must not claim full fan-out receipt parity. |

### Wiring-Complete Criteria

T002 becomes unblocked only after all of these are true:

| Criterion | Required Design |
| --- | --- |
| Live compiled contract injection | `/deep:review`, `/deep:research`, `/deep:context`, and `/deep:ai-council` render through the rollout live consumer in section 6. `fallback` renders legacy content byte-identically; `fix` prepends the compiled command contract. |
| Gate-3 autonomous precedence is machine-bound | The compiled contract includes `commandContract` facts compatible with `gate-3-classifier.ts`: `declaresAutonomousExecution: true`, `ownsSpecFolderSetup: true`, allowed pre-bound sources, and a concrete write boundary. The renderer or setup loader calls `classifyPrompt` with these facts before any write. |
| Dispatch receipt expectation is deterministic | Each dispatch gets a deterministic dispatch id from the host-rendered iteration context, not a model-only random string. The same id is passed to `runAuditedExecutorCommand` and to `post_dispatch_validate.dispatchReceipt`. Using the existing `dispatchId` parameter is not a new API; the deterministic id binding is `proposed-new` renderer behavior. |
| Route proof demotion is exercised | A valid receipt must make `target_agent`, `agent_definition_loaded`, and `resolved_route` advisory warnings, while `mode` stays hard-enforced. Missing/invalid receipt must fail with `dispatch_receipt_missing`, `dispatch_receipt_invalid_mac`, or `dispatch_receipt_intent_mismatch`. |
| Progress remains non-completion | Progress records may reset liveness for ACB-004-high and CXB-004, but reducers must still count only completion-bearing records. |
| Council hidden-loop avoidance is compiled | ACB-005 requires stepwise per-seat progress and one bounded referee pass per persisted round. Any internal adjudicator loop without persistence keeps T002 blocked. |
| Rollout evidence is captured | Each benchmark leg records render manifests containing command, mode, args hash, legacy hash, compiled hash, rendered hash, and source digests. |

### Cell Mapping

| Cell | Required Mechanism Before Re-Run | Expected Observable Flip |
| --- | --- | --- |
| RVB-007 | Compiled absorption abort plus deterministic dispatch receipt expectation for review. | Inline/self-attested findings without receipt fail before state-log acceptance. |
| RSB-005 | Research prompt pack receives compiled dispatch boundary before model work. | Executor does not absorb LEAF work inline when no receipt exists. |
| RSB-007 | Research CLI branch receipt is validated, not merely created. | Model-written route proof is advisory only after valid receipt; forged/missing receipt fails. |
| ACB-004-high | Council per-seat progress records and persisted seat artifacts are required. | Long council runs show visible liveness instead of dark-window watchdog failure. |
| ACB-005 | Council referee/adjudication loop is bounded to one persisted round pass unless a later explicit opt-in flag exists. | Hidden internal evaluator loops no longer satisfy the contract. |
| CXB-004 | Context per-seat settle is host-owned and progress-visible. | A slow/failed straggler degrades agreement but does not starve the whole sweep of observable progress. |

### Re-Run Protocol For T002

1. Capture current fallback baseline for the six cells using `opencode run --command`, never raw slash text.
2. Flip only the target command(s) to `fix` via `SPECKIT_COMMAND_INJECTION_MODE=<command>:fix` or the rollout JSON.
3. Re-run the six cells on gpt-fast-med and gpt-fast-high.
4. Compare baseline versus fix with the manifest comparator. Baseline regressions block promotion even if fix improves the target cell.
5. Record the acceptance result back in 035 phase 004 only after the live run validates the behavior flip.

### Residual Risk

T002 still depends on live GPT behavior and provider availability, so a failed live run can indicate model/provider variance rather than a contract defect. The comparator and fallback baseline are therefore mandatory: they separate prompt-render regressions from model stochasticity. The deterministic dispatch-id requirement may require refactoring current random dispatch ids in YAML-rendered Node snippets; until that is implemented, receipt validation cannot be reliably bound to the correct receipt pair. Fan-out receipt parity remains a separate residual risk and should not be claimed as solved by the T002 unblock unless the later build phase wires fan-out through the same audited receipt semantics.
