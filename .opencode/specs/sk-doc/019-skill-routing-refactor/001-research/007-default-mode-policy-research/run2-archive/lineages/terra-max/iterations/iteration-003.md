# Iteration 3: Q3 / Thread 4 — Safe `defaultMode` Migration and Rollback

## Focus

Derive a reversible, evidence-gated sequence for any proposed `defaultMode` flip without re-litigating the baseline policy verdict or the Q1/Q2 analysis. The forced iteration focus supersedes the reducer's stale Q2 follow-up. “Flip” is interpreted as a change to one hub's `routerPolicy.defaultMode`, not a simultaneous router, vocabulary, registry, or fallback-resource redesign.

## Findings

1. Router replay supplies necessary observability but cannot alone prove that a live route loaded a proposed default. Its hub telemetry marks `defaultApplied` only when no modes were selected and the policy value is non-null; the replay then continues to assemble resources from the unchanged selected-intent list. A candidate therefore needs a live, privately scored check after deterministic replay rather than treating `defaultApplied: true` as proof of the user-visible route. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:643-702]
2. The minimum deterministic evidence gate before **each** candidate change is: (a) pass the D5 connectivity and hub-registry scan; (b) run the frozen target-owned playbook corpus with route gold explicitly enabled; and (c) retain the generated JSON/Markdown report plus the topology digest. D5 runs before dispatch, hub skills enable route gold by default, and either a structural/registry/route-gold block or a manifest change during scoring returns a failing process signal rather than merely a warning. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:10-20] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:65-89] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:246-298]
3. Use two immutable fixture views: preserve the current baseline gold unchanged, then add candidate-specific private gold for the intentional zero-signal behavior while retaining weak-signal and contradictory-intent invariants. Observe every candidate by fixture stratum through `workflowMode`, `matchedAliases`, `defaultApplied`, `deferReason`, packet, and backend-kind telemetry; a non-targeted default application, changed weak-mode route, or loss of contradictory-intent defer is a regression. The hub's policy keeps default, ambiguity, tie-break, outcomes, fallback resource, and bundle rules together, while its registry and hub router are synchronized projections, so changing more than one of those controls destroys causal attribution. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-20] [SOURCE: .opencode/skills/sk-doc/SKILL.md:48-97] [INFERENCE: preserve baseline gold and isolate the candidate expectation so intentional change is distinguishable from collateral drift]
4. Recommended order: **1)** freeze and pass the baseline corpus; **2)** produce one single-field candidate and its explicit candidate fixture gold; **3)** rerun D5 plus route-gold replay; **4)** run only the bounded target scenarios in live trace mode with private/scorer-only evaluation; **5)** promote one hub at a time only when the candidate equals or improves the predeclared pass rate and cost envelope; **6)** observe the same telemetry after each promotion. Roll back immediately by restoring that one recorded `defaultMode` value and rerunning the unchanged baseline corpus if a hard benchmark block, topology drift, an invariant-fixture failure, an unplanned default application, or a live private-gold regression occurs. This applies the repository's established default-off/frozen-corpus rollout discipline without asserting that this hub already has a runtime canary switch. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:269-298] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:301-388] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:151-162] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:503-513] [INFERENCE: one-field promotion and restoration minimize affected routing surface and preserve a decisive rollback comparison]

## Ruled Out

- A multi-hub flip combined with changes to router signals, registry projections, fallback resources, or tie-break order: the resulting outcome cannot be attributed to the `defaultMode` change and cannot be cleanly rolled back. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-20] [SOURCE: .opencode/skills/sk-doc/SKILL.md:48-97] [INFERENCE: coupled policy edits remove the single-variable comparison]
- Treating deterministic `defaultApplied` telemetry as proof that live dispatch selected or loaded the candidate child. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-356] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:643-702]

## Dead Ends

- No inspected hub or benchmark contract defines a runtime `defaultMode` canary/percentage selector. Do not assume one exists; use a bounded candidate run and explicitly scoped live scenarios until such a control is authored. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-20] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:372-388] [INFERENCE: the inspected contracts expose a policy field and trace-mode selection, not a per-hub rollout selector]
- The inspected contracts do not set a numeric tolerance for live route-quality regression. Structural and route-gold failures are zero-tolerance gates; any live pass-rate or cost tolerance must be predeclared with the candidate rather than invented after observing results. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:289-298] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:503-513]

## Edge Cases

- Ambiguous input: no specific target hub or replacement mode was supplied, so the sequence is generic to a single `routerPolicy.defaultMode` field and deliberately does not nominate a value. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-13]
- Contradictory evidence: none found.
- Missing dependencies: the inspected local contracts do not provide a runtime canary switch or completed live-routing result. The fallback is a bounded, target-owned live trace with private gold; this iteration does not claim that such a run occurred. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:301-388] [INFERENCE: live evaluation is opt-in and target-scoped]
- Partial success: none. Q3 is answered as a migration design; no source policy was changed and no live behavior is claimed measured.

## Sources Consulted

- .opencode/skills/sk-doc/hub-router.json:4-20
- .opencode/skills/sk-doc/SKILL.md:48-97
- .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356, 643-702
- .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:10-20, 65-89, 174-206, 246-298, 301-388
- .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:151-162, 503-513

## Assessment

- New information ratio: 0.88
- Questions addressed: **Q3 (thread 4):** What safe migration and rollback sequence could flip proposed defaults while detecting regressions before live routing behavior is broadly affected?
- Questions answered: **Q3 (thread 4):** What safe migration and rollback sequence could flip proposed defaults while detecting regressions before live routing behavior is broadly affected?

## Reflection

- What worked and why: following the replay telemetry into its resource-assembly path exposed the crucial distinction between observing a configured default and proving a live default route; pairing that limitation with the benchmark's hard exit gates yields a sequence that is testable before broad exposure.
- What did not work and why: the local contracts expose deterministic replay and an opt-in live path, but no existing per-hub rollout selector or numeric live-regression budget; inventing either would turn a migration design into an unsupported implementation claim.
- What I would do differently: when a concrete flip is proposed, bind one target-owned fixture matrix and its private candidate gold to the exact policy field, record the baseline report/digest, then run the bounded live trace before any next hub is considered.

## Recommended Next Focus

Investigate Q4 / thread 8: define the evidence rule for genuinely co-dominant modes, then use the Q3 sequence to evaluate that rule one hub at a time rather than broadening any default change. [INFERENCE: Q3 now supplies the rollback discipline required for a future co-dominant-mode experiment]
