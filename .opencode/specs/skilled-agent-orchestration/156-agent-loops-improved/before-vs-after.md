# What Changed in Agent Loops Improved: The Full 156 Program

> Packet 156 turned loop-systems research into shipped resilience, convergence-quality, observability, safety and interconnection improvements across the deep-loop system. It mined two reference codebases into a ranked backlog, then built that backlog in phases: a session-goal OpenCode plugin, deep-loop-runtime hardening, deep-loop-workflows upgrades, Spec Kit autopilot support, advisor routing projection, UX and observability controls, test isolation and a final remediation track. Every phase in this record shipped and the packet now leaves the loop stack more durable under interruption, more explicit about convergence, more observable during long runs and safer around state mutation.

---

## 1. REFERENCE RESEARCH

Phase 001 is the research front of the packet. It mined the reference systems first, then turned those findings into the ordered implementation backlog that the later phases shipped.

**Before**

The loop-systems work did not yet have a ranked improvement program. The goal plugin, runtime hardening, workflow convergence work, Spec Kit autopilot, advisor interconnection, observability, testing and remediation tracks existed as candidate directions rather than an implementation sequence grounded in the two reference codebases.

**After**

The research phase produced the backlog that drove the rest of the packet. It separated the highest-uncertainty goal-plugin work from the runtime and workflow substrate work, then left the later phases with a clear order: build durable goal state first, harden loop execution next, improve convergence and workflow governance, then close the packet with observability, test isolation and remediation.

**Impact**

The packet did not implement a grab bag of adjacent fixes. It shipped a dependency-ordered program whose later phases all trace back to the reference-mining pass, with the net-new goal plugin isolated first and the deep-loop system improvements grouped by subsystem.

**Why**

The packet needed a research pass before implementation because the risk was not one missing helper. The work crossed persistence, command routing, convergence, fanout, workflow state, advisor projection and manual validation, so the ranked backlog gave the build a spine before any phase started landing code.

## 2. GOAL OPENCODE PLUGIN

This is the session-goal front of the packet: how an OpenCode session stores one active goal, injects it as passive context and decides whether to complete or continue it.

**Before**

The active-goal feature had no durable store, no root command and no safe way to put the current goal into the assistant's system context. A session could not rely on one stable active goal and there was no lifecycle memory for token budget charging, completion evidence or guarded continuation after idle.

**After**

The plugin now persists one active goal per OpenCode session through atomic serialized state, refuses missing session ids and exposes the feature through a thin `/goal` router whose tools own session resolution, mutation, status and injection preview. Active goals reach the assistant as a sanitized `[active_goal]` block through OpenCode's system transform. Lifecycle tracking records assistant activity, charges usage only when safe and marks a goal budget_limited once its token cap is reached. On idle, a conservative supervisor evaluates redacted evidence and completes the goal only on an exact met verdict, while guarded continuation stays passive by default and calls `promptAsync` only when every gate passes.

**Impact**

OpenCode now has a passive goal layer with durable session state, visible status, budget awareness and a cautious completion path. The assistant can see the active goal without making chat depend on persistence and the continuation machinery exists without becoming an always-on prompt sender.

**Why**

The plugin shipped first because it carried the highest design uncertainty. The implementation keeps state ownership inside the plugin tools, keeps injection sanitized and passive and makes automatic completion conservative enough that a goal only closes when the stored verifier result says it is met.

## 3. DEEP-LOOP-RUNTIME IMPROVEMENTS

This is the runtime substrate: atomic writes, locks, sleep, lifecycle state, JSONL repair, fanout timing, convergence signals, fallback routing and judge hardening.

**Before**

The runtime had the core loop machinery but not the hardening needed for long unattended runs. Atomic writes did not skip unchanged content or carry integrity helpers, deferred writes were not coalesced, sleep was not abortable in chunks and lifecycle transitions had no exported taxonomy. JSONL salvage appended without a lock-held merge, lock acquisition and heartbeats had weaker single-flight and staleness behavior, fanout did not persist overrun accounting and wait checkpoints and convergence lacked the shipped delta, observation, time-decay and fuzzy-merge signals.

**After**

The runtime now has `writeStateIfChangedAtomic`, integrity hashing and stamping, a deferred atomic writer and an abortable chunked sleep primitive. Lifecycle status and stop reasons are exported with legal transitions and a paused-wait gate. JSONL salvage now merges under lock with stable dedupe, loop locks have TTL-aware heartbeat refresh and single-flight acquisition and iteration records carry byte-offset log regions. Fanout now records fixed-rate skipped slots, has an opt-in stall watchdog and persists pre-dispatch wait checkpoints for crash resume. Convergence now carries score deltas, a default-off observation threshold guard, time-decay weighting and fuzzy merge. The fallback router has typed route config and graph validation and the LLM judge now retries, times out safely, strips bad formats on retry and quarantines failed verdicts.

**Impact**

The deep-loop runtime now loses less work, writes less churn, survives more interruption cases and leaves better evidence behind when a long run misbehaves. State writes are safer, waiting can resume after a crash, lock contention is more controlled and convergence has richer signals without forcing behavior changes where the phase kept defaults off.

**Why**

The runtime phases mostly shipped additive hardening because the core loop already existed. The packet tightened the parts most likely to hurt unattended runs: state durability, lock correctness, fanout timing, judge failure behavior and convergence quality. Default-off guards stayed default-off where the change would otherwise alter verdict timing.

## 4. DEEP-LOOP-WORKFLOWS IMPROVEMENTS

This is the workflow layer above the runtime: convergence policy, question provenance, idea lifecycle, coverage seeding, improvement promotion and fanout shape.

**Before**

The workflows did not have a shared convergence-profile schema, a cross-mode anti-convergence contract or a minimum-iteration floor for deep research. Question origin provenance was not propagated through the reducer, generated key questions had no conflict resolver and rejected ideas had no bounded cache. Ideas did not move through an observed, promoted and rejected lifecycle, coverage graphs were not seeded from code graph at loop init and improvement promotion did not separate accepted candidates from shipped candidates.

**After**

Deep research now has a gated minimum-iteration STOP guard and convergence mode, while the workflow stack has a shared convergence-profile schema and explicit anti-convergence blocks across modes. Runtime capabilities enforce fail-closed stop policy where configured. The reducer now carries question origin provenance, resolves generated-question conflicts and records rejected ideas with exact plus fuzzy suppression and reversal events. Ideas now start as observed and promote only after enough observations. Coverage graphs can seed from code graph with source and confidence fields. Deep improvement now emits outcome score deltas and fixture deltas, gates promotion on deltas, separates accept from ship, preserves branches on failure and has rollback support. Lane-D packaging, a self-target guard and dormant wave-fanout schema landed with flat-pool behavior preserved by default.

**Impact**

The workflows now converge with more explicit policy and better evidence. A loop can explain where a question came from, avoid repeating rejected ideas, promote ideas only after repeated observation and distinguish a promising candidate from a shipped one. Coverage starts with better structural context and future wave planning has a schema without disturbing the current flat-pool path.

**Why**

The workflow work shipped around governance rather than one universal formula. The phase recorded that convergence modes need their own profiles, then added shared schema, fail-closed capability checks and reducer evidence so each mode can stay honest about its own stop logic.

## 5. SYSTEM SPEC KIT

This is the Spec Kit autopilot lane: unattended envelopes, terminal reason codes and branch-preserved failure for the plan, implement and complete routes.

**Before**

Spec Kit commands did not have the shipped unattended `:autopilot` envelope. Terminal outcomes were not exposed as machine-readable reason codes across the plan, implement and complete surfaces and failure handling did not preserve the branch state through the autopilot flow.

**After**

Spec Kit now has an unattended `:autopilot` envelope wired into `speckit complete`, `speckit plan`, `speckit implement` and `complete_auto.yaml`. The shipped flow emits machine-readable terminal reason codes and preserves branch state on failure. The contract test, YAML parse and strict validation all passed for the phase.

**Impact**

Spec Kit can now participate in unattended loop execution without making the caller scrape prose for terminal state. Automation can distinguish stop reasons and a failed autopilot run keeps enough branch context for recovery.

**Why**

Autopilot needed a machine contract before higher-level loops could treat Spec Kit as a reliable step. The phase kept the scope narrow: one envelope, explicit reason codes and branch-preserved failure across the existing command surfaces.

## 6. SKILL INTERCONNECTION

This is the advisor routing projection lane: how workflow modes from the mode registry become advisor-visible aliases and response fields.

**Before**

The advisor did not publish the resolved workflow mode in its responses and alias projection from the mode registry was not automatically generated with a drift guard. That left routing interconnection dependent on duplicated or implicit knowledge.

**After**

The advisor now gets an auto-generated alias projection from the mode registry, protected by a hash drift guard. Advisor responses also publish the resolved `workflowMode`, giving downstream callers the routing decision in a stable field. The advisor tests passed and the typecheck and drift checks were green.

**Impact**

Workflow routing is now visible rather than implied. The advisor can expose which mode it resolved and the alias projection stays tied to the registry instead of drifting as a separate hand-maintained surface.

**Why**

Interconnection work is fragile when two systems carry the same routing truth separately. The phase made the registry the source of projection and added drift protection so the advisor can participate in mode routing without becoming its own fork of the map.

## 7. UX, OBSERVABILITY AND AUTOMATION

This is the operator-facing lane: dashboard trends, telemetry heartbeat, normalized observability events, run-now control, per-iteration memory refresh and dry-run boundaries.

**Before**

Long loop runs had weaker operator feedback. The dashboard did not show trend sparklines, telemetry rows did not carry a started, progress and terminal heartbeat lifecycle, observability emitters did not share one normalized envelope and a paused run had no shipped one-shot run-now sentinel. Deep research did not refresh memory after each iteration and there was no first-class dry-run halt at the major mutation and dispatch boundaries.

**After**

The dashboard now renders a TREND section with new-information and score sparklines plus a flatline advisory event. Deep research emits serialized-diff-gated telemetry heartbeat rows and five emitters now route through a shared observability event normalizer and append helper. A run-now check consumes a one-shot sentinel before pause, convergence and dispatch, then emits requested or rejected events. Each iteration now runs a non-fatal memory save or upsert and refreshes memory context before the next prompt. The loop also has a first-class `--dry-run` flag with halt hooks at dispatch, state mutation, reducer refresh and child spawn boundaries.

**Impact**

An operator can see trend shape, heartbeat state, normalized events and dry-run stops instead of inferring them from scattered output. A paused loop can be nudged once, memory context refreshes between iterations and dry-run can exercise the control path without crossing mutation boundaries.

**Why**

The packet made long-running automation easier to trust by making its state visible and its controls explicit. The changes are additive because observability is most useful when it does not rewrite the loop's core behavior while it is telling the operator what happened.

## 8. TESTING

This is the test-isolation lane: hermetic runtime tests and record-replay cassettes for script execution.

**Before**

Deep-loop-runtime tests could write to the real HOME or runtime database directory and lock, state and fanout tests could cross-contaminate through shared real paths. Script-run regressions also lacked the shipped record and replay helpers pinned into parity and fanout tests.

**After**

The deep-loop-runtime tests now run fully in parallel without writing to the real HOME or runtime database directory. The packet also shipped `recordScriptRun` and `replayScriptRun` helpers in the spawn utility, with cassette regressions pinned in the convergence parity test and the fanout-run test. Parity, tests, typecheck, hygiene and drift checks were green for the phase.

**Impact**

The wired suite is now less dependent on local machine state and less likely to hide interference between tests. Record-replay coverage gives the runtime a stable way to pin script behavior without depending on live execution every time.

**Why**

Runtime hardening only counts if the test harness can exercise it without polluting itself. This phase removed real-path cross-contamination first, then added cassettes so sensitive script behavior can stay reproducible across future changes.

## 9. LOOP-SYSTEMS REMEDIATION

This is the remediation track that closed safety, benchmark, playbook and test-adequacy gaps left by the shipped loop work.

**Before**

The improvement rollback path could restore a backup without first checking accepted-state hashes against the current target. Promotion safety checked runtime mirrors against the candidate rather than the canonical body, which blocked a legitimate in-sync agent-definition promotion. Model-benchmark runs did not pass the improvement state log explicitly to the loop host, manual playbooks lacked the eight adversarial scenarios for the fixed clusters, high-risk validation could pass on inspection alone and the JSONL append concurrency test was sequential rather than a true process race.

**After**

Rollback now checks accepted-state hashes before restoring the pre-acceptance backup, accepts the legitimate before-ship and after-ship states and refuses unrelated drift. Promotion safety now verifies runtime mirrors against the current canonical body, so real mirror drift still blocks while legitimate in-sync promotions pass. Autonomous model-benchmark runs pass the improvement state log explicitly, which lets the reducer append the benchmark row even when outputs live under the benchmark run label. The manual-testing playbooks now carry eight adversarial regression scenarios, one per fixed review cluster, each phrased to fail on regression and tied to the real test. High-risk manual validation now requires both a zero-exit test command and matching source inspection. The JSONL append concurrency test now races two child processes through the real append function behind a control-directory barrier.

**Impact**

The final track tightened the packet's own safety story. Rollback refuses to overwrite unrelated drift, promotion no longer blocks a valid synchronized state, benchmark reducers see the run they need, manual validation has adversarial cases with runnable evidence and JSONL concurrency is tested as a real race.

**Why**

The remediation phase treated release safety as part of the product, not cleanup after it. The earlier phases hardened the loop system and this final track made the safety checks, playbook gates and concurrency tests prove the failure modes they were meant to catch.
