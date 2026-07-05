# What Changed in Agent Loops Improved: The Full 156 Program

> Packet 156 turned loop-systems research into shipped resilience, convergence-quality, observability, safety and interconnection improvements across the deep-loop system. It mined two reference codebases into a ranked backlog, then built that backlog in phases: deep-loop-runtime hardening, deep-loop-workflows upgrades, Spec Kit autopilot support, advisor routing projection, UX and observability controls, test isolation, a remediation track, a phase that turned a deep-research fan-out on the packet itself, a documentation-truth audit that checked the public README against everything the packet had shipped, and a follow-up remediation phase that closes the items those passes deferred. All eleven phases shipped in full, the follow-up remediation phase closing on 2026-07-02 with the sliding-window convergence mode. The packet now leaves the loop stack more durable under interruption, more explicit about convergence, more observable during long runs, safer around state mutation, more honest about its own claimed-versus-actual state and more resilient in its own research and fan-out tooling, with public documentation that matches what actually shipped.

---

## 1. REFERENCE RESEARCH

Phase 001 is the research front of the packet. It mined the reference systems first, then turned those findings into the ordered implementation backlog that the later phases shipped.

**Before**

The loop-systems work did not yet have a ranked improvement program. Runtime hardening, workflow convergence work, Spec Kit autopilot, advisor interconnection, observability, testing and remediation tracks existed as candidate directions rather than an implementation sequence grounded in the two reference codebases.

**After**

The research phase produced the backlog that drove the rest of the packet. It separated runtime and workflow substrate work by dependency order, then left the later phases with a clear sequence: harden loop execution first, improve convergence and workflow governance, then close the packet with observability, test isolation and remediation.

**Impact**

The packet did not implement a grab bag of adjacent fixes. It shipped a dependency-ordered program whose later phases all trace back to the reference-mining pass, with the deep-loop system improvements grouped by subsystem.

**Why**

The packet needed a research pass before implementation because the risk was not one missing helper. The work crossed convergence, fanout, workflow state, advisor projection and manual validation, so the ranked backlog gave the build a spine before any phase started landing code.

## 2. DEEP-LOOP-RUNTIME IMPROVEMENTS

This is the runtime substrate: atomic writes, locks, sleep, lifecycle state, JSONL repair, fanout timing, convergence signals, fallback routing and judge hardening.

**Before**

The runtime had the core loop machinery but not the hardening needed for long unattended runs. Atomic writes did not skip unchanged content or carry integrity helpers, deferred writes were not coalesced, sleep was not abortable in chunks and lifecycle transitions had no exported taxonomy. JSONL salvage appended without a lock-held merge, lock acquisition and heartbeats had weaker single-flight and staleness behavior, fanout did not persist overrun accounting and wait checkpoints and convergence lacked the shipped delta, observation, time-decay and fuzzy-merge signals.

**After**

The runtime now has `writeStateIfChangedAtomic`, integrity hashing and stamping, a deferred atomic writer and an abortable chunked sleep primitive. Lifecycle status and stop reasons are exported with legal transitions and a paused-wait gate. JSONL salvage now merges under lock with stable dedupe, loop locks have TTL-aware heartbeat refresh and single-flight acquisition and iteration records carry byte-offset log regions. Fanout now records fixed-rate skipped slots, has an opt-in stall watchdog and persists pre-dispatch wait checkpoints for crash resume. Convergence now carries score deltas, a default-off observation threshold guard, time-decay weighting and fuzzy merge. The fallback router has typed route config and graph validation and the LLM judge now retries, times out safely, strips bad formats on retry and quarantines failed verdicts.

**Impact**

The deep-loop runtime now loses less work, writes less churn, survives more interruption cases and leaves better evidence behind when a long run misbehaves. State writes are safer, waiting can resume after a crash, lock contention is more controlled and convergence has richer signals without forcing behavior changes where the phase kept defaults off.

**Why**

The runtime phases mostly shipped additive hardening because the core loop already existed. The packet tightened the parts most likely to hurt unattended runs: state durability, lock correctness, fanout timing, judge failure behavior and convergence quality. Default-off guards stayed default-off where the change would otherwise alter verdict timing.

## 3. DEEP-LOOP-WORKFLOWS IMPROVEMENTS

This is the workflow layer above the runtime: convergence policy, question provenance, idea lifecycle, coverage seeding, improvement promotion and fanout shape.

**Before**

The workflows did not have a shared convergence-profile schema, a cross-mode anti-convergence contract or a minimum-iteration floor for deep research. Question origin provenance was not propagated through the reducer, generated key questions had no conflict resolver and rejected ideas had no bounded cache. Ideas did not move through an observed, promoted and rejected lifecycle, coverage graphs were not seeded from code graph at loop init and improvement promotion did not separate accepted candidates from shipped candidates.

**After**

Deep research now has a gated minimum-iteration STOP guard and convergence mode, while the workflow stack has a shared convergence-profile schema and explicit anti-convergence blocks across modes. Runtime capabilities enforce fail-closed stop policy where configured. The reducer now carries question origin provenance, resolves generated-question conflicts and records rejected ideas with exact plus fuzzy suppression and reversal events. Ideas now start as observed and promote only after enough observations. Coverage graphs can seed from code graph with source and confidence fields. Deep improvement now emits outcome score deltas and fixture deltas, gates promotion on deltas, separates accept from ship, preserves branches on failure and has rollback support. Lane-D packaging, a self-target guard and dormant wave-fanout schema landed with flat-pool behavior preserved by default.

**Impact**

The workflows now converge with more explicit policy and better evidence. A loop can explain where a question came from, avoid repeating rejected ideas, promote ideas only after repeated observation and distinguish a promising candidate from a shipped one. Coverage starts with better structural context and future wave planning has a schema without disturbing the current flat-pool path.

**Why**

The workflow work shipped around governance rather than one universal formula. The phase recorded that convergence modes need their own profiles, then added shared schema, fail-closed capability checks and reducer evidence so each mode can stay honest about its own stop logic.

## 4. SYSTEM SPEC KIT

This is the Spec Kit autopilot lane: unattended envelopes, terminal reason codes and branch-preserved failure for the plan, implement and complete routes.

**Before**

Spec Kit commands did not have the shipped unattended `:autopilot` envelope. Terminal outcomes were not exposed as machine-readable reason codes across the plan, implement and complete surfaces and failure handling did not preserve the branch state through the autopilot flow.

**After**

Spec Kit now has an unattended `:autopilot` envelope wired into `speckit complete`, `speckit plan`, `speckit implement` and `complete_auto.yaml`. The shipped flow emits machine-readable terminal reason codes and preserves branch state on failure. The contract test, YAML parse and strict validation all passed for the phase.

**Impact**

Spec Kit can now participate in unattended loop execution without making the caller scrape prose for terminal state. Automation can distinguish stop reasons and a failed autopilot run keeps enough branch context for recovery.

**Why**

Autopilot needed a machine contract before higher-level loops could treat Spec Kit as a reliable step. The phase kept the scope narrow: one envelope, explicit reason codes and branch-preserved failure across the existing command surfaces.

## 5. SKILL INTERCONNECTION

This is the advisor routing projection lane: how workflow modes from the mode registry become advisor-visible aliases and response fields.

**Before**

The advisor did not publish the resolved workflow mode in its responses and alias projection from the mode registry was not automatically generated with a drift guard. That left routing interconnection dependent on duplicated or implicit knowledge.

**After**

The advisor now gets an auto-generated alias projection from the mode registry, protected by a hash drift guard. Advisor responses also publish the resolved `workflowMode`, giving downstream callers the routing decision in a stable field. The advisor tests passed and the typecheck and drift checks were green.

**Impact**

Workflow routing is now visible rather than implied. The advisor can expose which mode it resolved and the alias projection stays tied to the registry instead of drifting as a separate hand-maintained surface.

**Why**

Interconnection work is fragile when two systems carry the same routing truth separately. The phase made the registry the source of projection and added drift protection so the advisor can participate in mode routing without becoming its own fork of the map.

## 6. UX, OBSERVABILITY AND AUTOMATION

This is the operator-facing lane: dashboard trends, telemetry heartbeat, normalized observability events, run-now control, per-iteration memory refresh and dry-run boundaries.

**Before**

Long loop runs had weaker operator feedback. The dashboard did not show trend sparklines, telemetry rows did not carry a started, progress and terminal heartbeat lifecycle, observability emitters did not share one normalized envelope and a paused run had no shipped one-shot run-now sentinel. Deep research did not refresh memory after each iteration and there was no first-class dry-run halt at the major mutation and dispatch boundaries.

**After**

The dashboard now renders a TREND section with new-information and score sparklines plus a flatline advisory event. Deep research emits serialized-diff-gated telemetry heartbeat rows and five emitters now route through a shared observability event normalizer and append helper. A run-now check consumes a one-shot sentinel before pause, convergence and dispatch, then emits requested or rejected events. Each iteration now runs a non-fatal memory save or upsert and refreshes memory context before the next prompt. The loop also has a first-class `--dry-run` flag with halt hooks at dispatch, state mutation, reducer refresh and child spawn boundaries.

**Impact**

An operator can see trend shape, heartbeat state, normalized events and dry-run stops instead of inferring them from scattered output. A paused loop can be nudged once, memory context refreshes between iterations and dry-run can exercise the control path without crossing mutation boundaries.

**Why**

The packet made long-running automation easier to trust by making its state visible and its controls explicit. The changes are additive because observability is most useful when it does not rewrite the loop's core behavior while it is telling the operator what happened.

## 7. TESTING

This is the test-isolation lane: hermetic runtime tests and record-replay cassettes for script execution.

**Before**

Deep-loop-runtime tests could write to the real HOME or runtime database directory and lock, state and fanout tests could cross-contaminate through shared real paths. Script-run regressions also lacked the shipped record and replay helpers pinned into parity and fanout tests.

**After**

The deep-loop-runtime tests now run fully in parallel without writing to the real HOME or runtime database directory. The packet also shipped `recordScriptRun` and `replayScriptRun` helpers in the spawn utility, with cassette regressions pinned in the convergence parity test and the fanout-run test. Parity, tests, typecheck, hygiene and drift checks were green for the phase.

**Impact**

The wired suite is now less dependent on local machine state and less likely to hide interference between tests. Record-replay coverage gives the runtime a stable way to pin script behavior without depending on live execution every time.

**Why**

Runtime hardening only counts if the test harness can exercise it without polluting itself. This phase removed real-path cross-contamination first, then added cassettes so sensitive script behavior can stay reproducible across future changes.

## 8. LOOP-SYSTEMS REMEDIATION

This is the remediation track that closed safety, benchmark, playbook and test-adequacy gaps left by the shipped loop work.

**Before**

The improvement rollback path could restore a backup without first checking accepted-state hashes against the current target. Promotion safety checked runtime mirrors against the candidate rather than the canonical body, which blocked a legitimate in-sync agent-definition promotion. Model-benchmark runs did not pass the improvement state log explicitly to the loop host, manual playbooks lacked the eight adversarial scenarios for the fixed clusters, high-risk validation could pass on inspection alone and the JSONL append concurrency test was sequential rather than a true process race.

**After**

Rollback now checks accepted-state hashes before restoring the pre-acceptance backup, accepts the legitimate before-ship and after-ship states and refuses unrelated drift. Promotion safety now verifies runtime mirrors against the current canonical body, so real mirror drift still blocks while legitimate in-sync promotions pass. Autonomous model-benchmark runs pass the improvement state log explicitly, which lets the reducer append the benchmark row even when outputs live under the benchmark run label. The manual-testing playbooks now carry eight adversarial regression scenarios, one per fixed review cluster, each phrased to fail on regression and tied to the real test. High-risk manual validation now requires both a zero-exit test command and matching source inspection. The JSONL append concurrency test now races two child processes through the real append function behind a control-directory barrier.

**Impact**

The final track tightened the packet's own safety story. Rollback refuses to overwrite unrelated drift, promotion no longer blocks a valid synchronized state, benchmark reducers see the run they need, manual validation has adversarial cases with runnable evidence and JSONL concurrency is tested as a real race.

**Why**

The remediation phase treated release safety as part of the product, not cleanup after it. The earlier phases hardened the loop system and this final track made the safety checks, playbook gates and concurrency tests prove the failure modes they were meant to catch.

## 9. RESEARCH BACKLOG REMEDIATION

This is the phase that closed the loop on the packet itself. A deep-research fan-out ran against the packet's own state, then a deeper forced-depth pass found two more critical bugs in the research runtime's own completion and hang-handling logic, and this phase shipped every finding as one of 11 independently verified children.

**Before**

The fan-out merge tool silently dropped a lineage's findings on a schema mismatch, the per-lineage timeout ceiling had no operator override and ephemeral finding-id markers sat in source comments alongside a salvage-filename padding bug. Six phase-parents claimed every child was Draft despite real completion, 40 grandchild files carried a stale zero completion percentage, several folders still pointed at the packet's old pre-migration name, an abandoned review lineage held a dead lock, 14 review findings sat undispositioned, graph-metadata omitted real runtime surfaces a folder's own frontmatter already named and the description generator cut generated text off mid-word. One phase-parent's own governance docs were still raw templates, two ADR sub-phases had no decision-record, a convergence-threshold default disagreed across loop types, a working forced-depth flag had no documentation and no detector caught a Complete folder with untouched scaffold docs. Most severely, a lineage could narrate synthesis complete without ever writing its registry or output files, and the fan-out orchestrator could hang indefinitely after a lineage's subprocess had already exited, both directly observed during this same phase's own operational work.

**After**

The merge tool now tolerates known schema aliases and warns instead of silently dropping findings, the timeout ceiling has a documented override and the comment-hygiene and salvage-filename bugs are fixed with a new lint rule guarding recurrence. Every phase-map row and completion percentage now matches real state, every live old-name reference points at the current path, the dead lock is removed with its lineage archived, all 14 review findings carry an evidence-backed disposition, graph-metadata reflects real runtime surfaces packet-wide and the description generator no longer truncates mid-word. Phase 008's own governance docs are real aggregates, both missing ADR decision-records are authored from real shipped content, the convergence-threshold default is now loop-type-aware, the forced-depth flag is documented and a new validate.sh rule catches untouched-scaffold drift automatically. A real synthesis-completion invariant now gates the completion event on real artifact state, and a genuinely new post-exit watchdog stops the orchestrator from hanging after a lineage's subprocess has already exited.

**Impact**

The packet's own research and remediation tooling is now trustworthy in the exact ways this phase found it was not. A future research pass against this packet, or any other, will not silently lose a lineage's findings to a schema mismatch, will not hang forever after a subprocess exits and will not narrate a completion that never happened. The drift between what the packet claimed and what it actually shipped is closed everywhere this phase looked.

**Why**

This phase existed because the packet's own claim of being shipped had never been tested against itself. Running the deep-research process on the packet surfaced real, previously invisible bugs in the very tooling used to build and verify every earlier phase, and fixing those bugs first was the only way to trust that the drift-closure and hardening work that followed was itself correct.

## 10. DOCUMENTATION TRUTH AUDIT

This phase dispatched a genuine 10-iteration deep-review to `openai/gpt-5.5-fast` to check whether the public root README and the project's agent-instruction files had drifted from everything packet 030 shipped, then fixed every confirmed gap.

**Before**

The public README still called the Spec Kit section "Documentation" after the framework had already been renamed elsewhere in the same file. The Goal plugin, a first-class capability with its own contract, sat as a 3-line bullet under Commands rather than getting a feature section like every comparable capability. The public Deep Loop section described autonomous, hands-off execution without disclosing that fan-out can run with elevated CLI permissions, or naming the stall watchdog, cost cap and lag-ceiling guardrails phase 009 shipped to bound that autonomy. This phase's own draft graph metadata still carried the retired Spec Kit label as a live entity.

**After**

The README's Spec Kit section now reads "Framework" everywhere, TOC, heading and anchor alike, with a whole-repo check confirming no dangling reference to the old name. The Goal plugin has its own FEATURES subsection, carrying the accurate wording a separate concurrent session had already corrected mid-review, with the old Commands bullet trimmed to a cross-reference instead of duplicated. The Deep Loop section now names the permission boundary and the shipped guardrails directly, not just by link. This phase's own metadata was regenerated after its task wording was corrected, and a grep confirmed the retired label is gone.

**Impact**

The public-facing documentation now matches what the packet actually shipped, not what it shipped several phases ago. A reader following the README's own Deep Loop section now sees the safety guardrails that back its autonomy claims, and the Goal plugin gets the same visibility as every other first-class feature in the packet.

**Why**

The prior remediation phase fixed the packet's internal tooling and internal docs. This phase closed the same kind of gap on the surface a real user or operator actually reads first, verified by an independently dispatched review rather than a single manual pass, since a packet that fixes its own internals but leaves its public face stale has only solved half the problem.

---

## 11. FOLLOW-UP REMEDIATION

Phase 010 closed the packet's documentation drift. Phase 011 closes the 4 items phase 009's own changelog explicitly deferred rather than declared out of scope. All 7 children are shipped; child 007 (sliding-window convergence mode) landed 2026-07-02.

**Before**

Two review findings from a prior codex deep-review lineage were still live: the fan-out session-id propagation bug (downstream state log, findings registry, convergence events and claim adjudication all inherited a raw timestamp instead of the real session id) and the LEAF-identity conflation bug (the shared fan-out prompt builder told dispatched subprocesses to run the full multi-iteration loop, contradicting the one-iteration LEAF-agent contract). ~40 leaf children across phases 002-007 had genuinely-authored `spec.md` files sitting next to scaffold-template `plan.md`/`tasks.md` placeholder text. The default `validate.sh` invocation never ran registry-backed shell rules at all — and, once traced, the actual cause was worse than a missing bridge: the compiled validation orchestrator `validate.sh` depends on had been silently stale for roughly two weeks, with no freshness check anywhere in the repo able to catch it.

**After**

Both fan-out findings are fixed at the shared-function layer, and the workflow-config layer now matches: the review, context and research YAMLs all honor a caller-supplied detached session id. All ~40 originally-scoped leaves, plus `001-reference-research` (a standalone phase outside that count, found while closing this out), now carry real content grounded in their own already-correct `spec.md` files. `validate.sh`'s default path bridges every eligible registry rule automatically. A permanent, repo-wide dist-freshness enforcement layer now exists — a shared checker consumed by the 3 CLI shims, a hard `validate.sh` backstop, a Claude Code hook, and an OpenCode plugin — so a compiled artifact silently drifting from its source for weeks, unnoticed, cannot happen again without at least one of four independent layers catching it. On 2026-07-02 a 10-iteration deep-review lineage audited the finished state at forced depth and returned CONDITIONAL: 0 P0, 5 P1, 1 P2. Every finding was independently verified and remediated the same day — stale continuity reconciled, the first direct recursive validation of the 011 subtree run (exposing and fixing 8 masked errors, including a validator heuristic that read the task-notation legend as completed work), and the session-id fix extended to the context and research workflow configs. Two code-level findings are deferred as one documented orchestrator seam pending a safe shared-dist rebuild.

**Impact**

Packet 030 passes `validate.sh --strict --recursive` with 0 errors across all 12 folders. Tracing the registry-bridge fix to its actual root cause also surfaced a repo-wide validation debt spanning all 43 packet roots in the monorepo — not something this phase's own work created, but something it was first to make visible after a silent two-week gap. That repo-wide remediation was deliberately spun into its own packet (`system-speckit/030-validate-sh-dist-freshness-and-repo-remediation`) rather than folded into this phase, to keep "close packet 030's follow-ups" from quietly becoming "fix every packet in the repo."

**Why**

A packet whose own changelog names 4 deferred items and then never revisits them has a documentation-truth problem of exactly the kind phase 010 just finished fixing on the README. Leaving these open after packet 030 was otherwise "done" would have meant the packet's own follow-up list stayed permanently stale — the same failure mode phase 010 closed, one level down.
