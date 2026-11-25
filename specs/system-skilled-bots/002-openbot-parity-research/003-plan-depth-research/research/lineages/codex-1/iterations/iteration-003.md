# Iteration 3: Shared architecture and routine/computer-exposure depth

## Focus
Frontier node F-1-005 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/spec.md, specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer, specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure, .skilled/skills/system-skilled-bots/runtime/lib): Small phases 004-computer-exposure and 002-routine-layer, and cross-cutting design: is there a shared architecture doc (module map, file ownership, prompt builder order, answer seam, state-root layout) that every phase builds against, or must one be added before building?

## Findings
1. **Phase 002-routine-layer — P1:** The packet's purpose is one authored routine sentence that stops after its outcome or ten consecutive failures, and its spec/plan cover the completion and fatigue lifecycle; however, the OpenBot reference also sets a cap of twenty enabled routines and calls for a notice on the first failure, while the phase requirements do not include or explicitly defer either behavior. Add `002-routine-parity-decisions.md` (or equivalent requirements) with a decision and acceptance fixtures for both behaviors; retain phase-parent status as a candidate because the broader phase spans parsing, execution, install, persisted state, CLI, docs, and tests, subject to the separate phase-score and Level 3 documentation thresholds. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:42-52,115-120,162-167] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:54-75,146-150] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:107-123] [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:59-66]
2. **Cross-phase architecture — P1:** The build packet maps file changes, shared record owners, and phase dependencies, and phase 005 owns prompt-section order, but no reviewed artifact ties these into the target runtime module/import map, complete state-root tree, file ownership matrix, and end-to-end prompt/answer sequence that all phases can implement against. Add `contracts/runtime-architecture.md` with those maps and sequence diagrams, including the exact prompt-order and answer-stage handoffs; cite the existing per-phase contracts instead of duplicating their field definitions. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:102-139,144-165] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/README.md:21-39,43-75] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:69-74] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:153-171]

## Ruled Out
- Phase 004-computer-exposure does not need a new child on current evidence: its scope is one prompt line over existing record fields with no new state, CLI, or schema, and its plan names implementation modules, tests, dependencies, and rollback. The phase already specifies matching workDir/cwd, branch/null handling, exact prompt text, status row, and JSON output. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:42-55,98-113,143-149] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:58-70,170-180,203-207]
- A blanket claim that phases have no shared contracts is not supported: the build spec has a shared-record ownership table. The gap is a consolidated target architecture and sequence map across those contracts. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:122-139]

## Dead Ends
- The current runtime README documents existing package topology, not the planned parity target architecture; do not treat it as a substitute for the target module and state-root maps. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/README.md:21-39,43-75]

## Edge Cases
- Ambiguous input: none; F-1-005 explicitly groups phases 002/004 with shared architecture.
- Contradictory evidence: the recovered packet purpose emphasizes stopping at outcome or ten failures; OpenBot's routine reference additionally lists cap and first-failure notification behaviors. The phase docs do not decide whether those two additional reference behaviors are in scope, so the parity decision remains open.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:42-52,115-120,121-149,162-167
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:54-75,146-150
- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:107-123
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:42-55,98-113,143-149
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:58-70,170-180,203-207
- specs/system-skilled-bots/003-openbot-parity-build/spec.md:102-139,144-165
- .skilled/skills/system-skilled-bots/runtime/lib/README.md:21-39,43-75
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:69-74
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:153-171
- .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:59-66
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-003.md:13-19
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-010.md:14,16,20,24
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/codex-1/deep-research-config.json, deep-research-state.jsonl, deep-research-strategy.md, findings-registry.json; steer.md was absent at iteration start

## Assessment
- New information ratio: 0.5
- Questions addressed: whether a target architecture map exists; whether phases 002 and 004 are one-shot ready; whether phase 002 should be split.
- Questions answered: a shared target architecture artifact is needed; phase 004 is sufficiently bounded for one shot; phase 002 has an unresolved OpenBot parity decision and remains a phase-parent candidate only if both decomposition thresholds pass.

## Reflection
- What worked and why: comparing the recovered routine purpose and Phase 002 requirements against the OpenBot routine reference surfaced two omitted behaviors, while checking Phase 004's exact output contract and rollback showed its bounded change is already planned concretely.
- What did not work and why: the existing runtime README cannot answer how the parity target should be organized because it describes current modules rather than planned modules.
- What I would do differently: during the next broad phase pass, check each user-facing deliverable for its design artifact and each cross-phase record for an explicit target owner before judging it one-shot ready.

## Recommended Next Focus
Review phases 007-per-bot-apps, 008-vault, and 009-skills for persisted schemas, secret boundaries, restart/rollback behavior, and user-facing mockups; rank any expansion candidates against the Level 3 and phase-score thresholds.
