# Iteration 2: Memory, skills and conversation flows

## Focus
Frontier node F-1-004: assess phases 005-memory, 009-skills and 010-conversations for prompt composition, skill review, conversation lifecycle, security boundaries and user-facing design. The frontier block reported no remaining child slots, so this iteration proposes no frontier nodes.

## Actions Taken
- Read config, state, strategy, registry and steer.md (absent), then followed the reducer-selected F-1-004 focus and checked exhausted approaches.
- Compared phase specs, plans, tasks and acceptance criteria for 005, 009 and 010, including prompt order, review seams, conversation file behavior and TUI rendering coverage.
- Inspected the OpenBot memory and skill proposal surfaces, OpenBot's conversation contract test, and Turnstone's interactive input classifier as reference code.
- Ran the required expansive frontier block and convergence telemetry. Early convergence is telemetry only; this lineage continues to iteration 5.

## Findings
1. **Phase 005-memory — P1: shared memory updates lack concurrency and crash semantics.** The plan assigns append and forget to one module and puts shared memory beside per-bot memory, but its test matrix covers file/entry/bot state and its tests cover append/forget as isolated operations. It does not specify two bots appending at once, forget racing with append, or recovery from a partially written line. A one-shot builder would choose the write protocol and conflict behavior. Close this in 005's plan, tasks and acceptance criteria with a multi-writer/restart matrix and fixtures for append/forget races and interrupted writes. Keep 005 as a single phase; its storage, prompt block and reviewed proposal form one coherent flow. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:60-66] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:104-108] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:125-133]
2. **Phase 009-skills — P1: accepted proposals stop before an installable skill is verified.** The spec intentionally excludes `bots skill accept` and says the operator moves the draft into the checkout; the answer path records approval and returns without a resume request. The plan says `bots install` pins skill digests, but the operator handoff does not spell out the move, reinstall/pin refresh and verification sequence. Add an operator-prerequisite and acceptance row to 009's proposal handoff, including the exact checkout path, `bots install` step, stale-pin check and git review boundary. The loader, digest pin, prompt order, refusal set, proposal records and adversarial tests are otherwise sufficiently detailed; 009 does not need a phase parent. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:104-115] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/plan.md:63-83] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-openbot-parity-build/009-skills/acceptance-criteria.md:60-67]
3. **Phase 010-conversations — P1: transcript retention and migration are explicitly deferred.** The conversation file is append-only, is read whole, and can grow without bound; rotation is assigned to a later packet. That leaves an operational decision for long-lived bots and no migration path if the format or retention policy changes. Close this in an 010 child phase for transcript storage and lifecycle with retention/rotation thresholds, archival behavior, schema-version/migration rules, and restart/backup fixtures. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:105-112] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:192-203]
4. **Phase 010-conversations — P1: the chat pane lacks an explicit design handoff and visual acceptance artifact.** The plan names Rust chat state, transcript drawing and key labels, while its render test checks only that the transcript and footer draw. The phase depends on phase 003's placeholder but does not name a UX artifact or states the pane must render. Since 003 now owns terminal mockups, make 010 consume the designated 003 UX/component artifact and list empty, composing, running, completed, parked/resumed, refused/error and redacted-reply states in a pane contract with render fixtures. Expand 010 as a phase parent with children for transcript storage/lifecycle, routing and resume flow, TUI integration/design handoff, and hardening. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:41-55] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md:62-74] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md:117-129] [INFERENCE: the phase directory contains only the spec, plan, tasks and acceptance criteria artifacts and no design/ mockups; the render acceptance checks output behavior but no visual states]

## Questions Answered
- Conversations and skills (010, 009) and memory (005): are the user-facing flows designed deeply enough to one-shot? **Partially answered:** 009's runtime contracts and security tests are detailed, with a manual activation handoff to make explicit; 005 needs concurrent-file semantics; 010 needs retention/migration and an explicit design handoff to the terminal UX artifacts.

## Questions Remaining
- 005: whether shared memory should be serialized through a lock, append-only journal, or atomic replacement; specify the choice and recovery behavior.
- 010: retention and migration policy, plus the precise artifact interface with 003's terminal UX child.
- The runtime foundations, channel delivery and verification phases remain uncovered.

## Ruled Out
- Do not treat the 009 proposal's manual checkout move as automatic skill installation; the spec explicitly excludes a runtime copy into the checkout.
- Do not infer chat-pane visual completeness from a render test that checks only transcript and footer drawing.
- No skills, memory entries or conversation data were written; reference repositories were read only.

## Dead Ends
- None. The user-facing design gap is an unowned artifact interface, not a failed search path.

## Edge Cases
- Ambiguous input: none; F-1-004 names its three phases and review dimensions.
- Contradictory evidence: none. 009 documents that approval does not copy into a checkout; the planning gap is the handoff verification, not the ownership boundary.
- Missing dependencies: none. The exact 003 UX child path is not available in this phase's files, so the 010 parent/plan should name it when the build packet finalizes those children.
- Partial success: the assigned question is answered with targeted closeouts; other phases remain for later iterations.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:59-74, 104-108, 125-133
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:101-115
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/plan.md:62-83, 131-139
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/acceptance-criteria.md:60-67
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:41-55, 105-112, 192-203
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md:62-74, 117-129
- specs/system-skilled-bots/context/OpenBot-main/app/src/components/memory/memories.tsx:48-62, 132-151
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/skills/proposal.ts:73-103
- specs/system-skilled-bots/context/OpenBot-main/app/src/components/skills/proposed-skill.tsx:48-70
- specs/system-skilled-bots/context/OpenBot-main/agent-ag2/tests/test_conversation_contract.py:52-73
- specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:176-181, 1276-1305
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/codex-2/steer.md (checked; absent)

## Assessment
- New information ratio: 0.75 (two newly identified handoff/write-protocol gaps and two partially new 010 gaps whose retention limit and phase-003 UX ownership are already acknowledged elsewhere).
- Questions addressed: F-1-004.
- Questions answered: F-1-004; 005 and 010 require bounded expansion, while 009 is implementation-ready once its manual activation handoff is operationalized.

## Reflection
- What worked and why: reading task matrices beside the specs separated what is already concretely decided from lifecycle edges the tests do not exercise; reference UI code clarified which user flows need design artifacts.
- What did not work and why: broad reference-file enumeration was noisy; the phase plans and named source components produced more useful anchors than a repository-wide search.
- What I would do differently: next compare the verification phases' stop rules against the runtime artifacts they expect, then trace any missing hooks into the build phases.

## Recommended Next Focus
Frontier node F-1-006: assess phases 012-manual-testing-scenarios, 013-skilled-and-doc-alignment and 014-deep-review for fixtures, alignment targets, review dimensions, executor waves and stop rules.
