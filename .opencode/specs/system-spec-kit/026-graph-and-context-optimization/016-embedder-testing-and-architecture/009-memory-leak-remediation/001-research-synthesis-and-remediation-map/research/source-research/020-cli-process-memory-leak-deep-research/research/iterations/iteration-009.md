# Iteration 009: Stale Locks, Pause Files, Interrupted Recovery, Cancellation, Signals, JSONL Recovery, And Resume/Restart Behavior

## Focus
This iteration inspected stale locks, pause sentinel handling, interrupted-session recovery, cancellation paths, signal handling, JSONL partial-write recovery, and resume/restart behavior for leak or duplicate-dispatch hazards in the deep-research workflow and its executor wrapper.

## Findings
1. The deep-research lock is a workflow-owned advisory file at the research packet path, held across init, every loop iteration, synthesis, and post-synthesis write-back; release is specified for halt, cancel, and workflow-exit branches, but the contract is declarative and depends on runtimes honoring those branches. [SOURCE: .opencode/skills/deep-research/references/spec_check_protocol.md:42-64] [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:179-195]
2. Stale-lock recovery is policy-level only in the inspected workflow: contention fails closed and stale-lock override is "confirm-only or explicit recovery-only," but the lock definition and acquisition text do not define an owner PID, timestamp TTL, heartbeat, or automatic stale-lock reap. [SOURCE: .opencode/skills/deep-research/references/spec_check_protocol.md:56-64] [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:179-182]
3. The pause sentinel is checked before dispatch, logs `userPaused`, and halts the loop, but it is explicitly an intervention mechanism "between iterations"; it does not cancel an already-running CLI executor. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:400-408] [SOURCE: .opencode/skills/deep-research/references/loop_protocol.md:159-176]
4. The cli-codex, cli-gemini, and cli-claude-code branches route through `runAuditedExecutorCommand` with `wait_for_completion: true`; that wrapper uses blocking `spawnSync` with a timeout and records timeout/crash/signal outcomes as `dispatch_failure`, but it does not install parent signal handlers or kill a process group. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:584-629] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:169-223]
5. JSONL audit append is implemented as read-full-file plus `writeFileSync`, not an OS append or write-temp-and-rename path. An interruption during this write can damage more than the new trailing record because the rewritten content includes the pre-existing state log. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:33-55] [INFERENCE: `writeFileSync(stateLogPath, content + record)` rewrites the state-log file contents rather than appending atomically.]
6. The documented recovery path says malformed JSONL can be skipped or reconstructed from iteration files, but the live reducer throws by default when `corruptionWarnings.length > 0`, and the YAML invokes the reducer without `--lenient`. This makes partial-write recovery stricter than the docs imply. [SOURCE: .opencode/skills/deep-research/references/loop_protocol.md:555-573] [SOURCE: .opencode/skills/deep-research/references/state_format.md:506-526] [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:86-145] [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:904-906] [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:841-843]
7. The delta stream is described as a complement that lets the reducer rehydrate iteration state after interruption, and post-dispatch validation requires a delta iteration record, but `reduce-state.cjs` only loads deltas for resource-map emission. Canonical iteration history still comes from `deep-research-state.jsonl` plus iteration markdown files. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:109-115] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:21-27] [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:112-129] [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:912-918]
8. Restart lifecycle events in the YAML omit `continuedFromRun`, while the lifecycle contract says every persisted `resumed` or `restarted` event must include that field. The reducer tolerates the missing field by falling back to config lineage or `null`, which can hide where the restart boundary came from. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:216-225] [SOURCE: .opencode/skills/deep-research/references/loop_protocol.md:105-122] [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:318-351]
9. The loop derives `current_iteration` from the count of JSONL records where `type === 'iteration'`, while the LEAF agent refuses to overwrite an existing computed iteration file. If a prior run wrote `iteration-NNN.md` but lost or corrupted the JSONL append, resume can select that same iteration number and collide with the write-once file contract rather than automatically reconciling from the delta file. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:374-384] [SOURCE: .opencode/skills/deep-research/references/loop_protocol.md:81-93] [SOURCE: .opencode/agents/deep-research.md:407-412] [INFERENCE: the duplicate-dispatch/collision path requires interruption after markdown write but before a valid canonical JSONL append.]

## Ruled Out
- Re-running spawn inventory, sidecar, Ollama, ccc daemon, browser/devtools, and in-process cache hunts; those were covered in iterations 001, 005, 007, and 008.
- Launching nested `codex`, `claude`, `opencode`, `devin`, or `gemini` processes; the iteration contract forbids nested executors.
- Inspecting secrets, auth files, token stores, or environment dumps; none were required for lock, pause, signal, or JSONL recovery analysis.
- Treating the current packet as actively paused or locked; a filesystem check found no `.deep-research.lock` or `.deep-research-pause` in this packet at research time.

## Dead Ends
- Broad exact-text search over all scoped paths produced heavy fixture and documentation noise. The useful evidence came from the live deep-research YAML, reducer, post-dispatch validator, executor audit wrapper, and lifecycle/state references.
- Deep-review was only useful as contrast for pause naming and validator reuse; this iteration's focus stayed on the deep-research run requested by the prompt.

## Edge Cases
- Ambiguous input: none; the iteration number, executor metadata, prompt directory, and allowed writes were explicit.
- Contradictory evidence: docs describe fault-tolerant JSONL skip/reconstruction, while the reducer fail-closes by default unless lenient mode is explicitly selected.
- Missing dependencies: code graph was unavailable in startup context, but exact-text search and direct source reads were sufficient.
- Partial success: actual CLI binary signal behavior was not executed; process-group and child-process survival risks are inferred from wrapper source, not measured with live subprocesses.

## Sources Consulted
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/research/prompts/iteration-contract.md:1-38`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/research/prompts/iteration-009.md:1-15`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/research/deep-research-config.json:1-32`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/research/deep-research-state.jsonl:1-9`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/research/deep-research-strategy.md:1-29`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:96-230`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:374-408`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:540-840`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:841-884`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:884-906`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:1050-1058`
- `.opencode/skills/deep-research/references/spec_check_protocol.md:38-66`
- `.opencode/skills/deep-research/references/loop_protocol.md:74-124`
- `.opencode/skills/deep-research/references/loop_protocol.md:159-177`
- `.opencode/skills/deep-research/references/loop_protocol.md:223-254`
- `.opencode/skills/deep-research/references/loop_protocol.md:555-573`
- `.opencode/skills/deep-research/references/state_format.md:94-106`
- `.opencode/skills/deep-research/references/state_format.md:269-281`
- `.opencode/skills/deep-research/references/state_format.md:351-362`
- `.opencode/skills/deep-research/references/state_format.md:506-526`
- `.opencode/skills/deep-research/scripts/reduce-state.cjs:64-145`
- `.opencode/skills/deep-research/scripts/reduce-state.cjs:286-370`
- `.opencode/skills/deep-research/scripts/reduce-state.cjs:842-918`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:1-142`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:307-456`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:1-60`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:132-255`
- `.opencode/agents/deep-research.md:232-286`
- `.opencode/agents/deep-research.md:406-453`

## Assessment
- New information ratio: 0.61
- Questions addressed: stale-lock handling; pause and cancellation behavior; signal handling; JSONL partial-write recovery; resume/restart duplicate-dispatch hazards; verification needed to prove fixes.
- Questions answered: stale locks are mostly policy-level, not owner/TTL-enforced; pause is between-iteration only; audited CLI dispatch has timeout/crash/signal logging but no parent signal trap or process-group cleanup; JSONL recovery has doc/code drift; delta files do not currently repair canonical iteration state; restart events are missing a required lifecycle field.

## Reflection
- What worked and why: Narrowing to workflow YAML plus reducer/validator/wrapper code produced higher signal than another process-spawn inventory.
- What did not work and why: Broad grep across all scoped paths produced too much fixture and documentation noise to use directly.
- What I would do differently: Start from the lifecycle contract and state reducer first, then use exact searches only to confirm where the live workflow diverges from that contract.

## Recommended Next Focus
Design a targeted fix and verification matrix for interruption safety: owner/TTL metadata for locks, parent signal traps, process-group cancellation for CLI executors, mid-dispatch pause semantics, atomic JSONL append or temp-rename writes, reducer-backed delta recovery, and lifecycle schema tests for `resumed`/`restarted`.
