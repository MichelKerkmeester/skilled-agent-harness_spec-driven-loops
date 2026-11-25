# Iteration 1: Per-bot app isolation and vault boundaries

## Focus
Frontier node F-1-002: assess whether phases 007-per-bot-apps and 008-vault specify security boundaries, secret lifecycle, injection and leak checks deeply enough for one-shot implementation, and whether either needs a phase parent. The frontier block reported no remaining child slots, so this iteration proposes no frontier nodes.

## Actions Taken
- Read the bound config, projected state, strategy, findings registry and steer file (steer.md was absent) before choosing the focus.
- Compared the 007 and 008 phase specs, plans, tasks and acceptance criteria with the current dispatch/runtime behavior and the earlier parity research.
- Checked the reference-code paths; the prior research identifies rakazo's actual matcher and guard paths, while the initially assumed integrations/ paths do not exist.
- Workflow deviations recorded for this run: the YAML's temporary event-file staging was replaced by a lineage-local event file to obey the write boundary; lock acquisition followed config/run-open setup because this process inherited initialized state; no out-of-lineage phase save or continuity write is attempted. The frontier block has no child slots.

## Findings
1. **Phase 007-per-bot-apps — P0: shared isolation can still expose every configured app.** The plan refuses a shared run only when the bot explicitly declares apps, but its data-flow note says a shared run resolves the pinned config from the checkout; the planned absent-declaration shared-run test explicitly accepts that the child reads the repository-wide config while the record says []. That leaves the core least-privilege policy undecided and prevents a one-shot build from guaranteeing each run sees only its honored apps. Close this in 007's spec/plan/acceptance criteria with an explicit default-deny rule and an absolute per-run UTCP_CONFIG_FILE for shared runs, or refuse connector-capable shared runs; add the corresponding absent/empty/explicit declaration matrix. Phase 007 already has a detailed module map, schema delta, adversarial matrix, integration tests and rollback, so it does not need a phase parent. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:62] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:68] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:116]
2. **Phase 008-vault — P0: the declared secret grant is not a per-bot access boundary.** The plan and acceptance criteria explicitly allow a same-user child with no secrets grant to read another bot's value file, and the spec accepts the OS user as the boundary; the stdout scan also leaves values written to files or commits outside its reach. This is clearly documented as a residual, but it conflicts with treating secrets: as an authorization grant and leaves the one-shot threat model unresolved. Close with a 008 child phase for access boundary and threat model that chooses enforceable isolation or explicitly narrows the promise, and acceptance fixtures for cross-bot reads plus file/commit exfiltration. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:190] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:191] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md:74]
3. **Phase 008-vault — P1: secret-store concurrency and crash recovery are unspecified.** The plan specifies backend choice, write-readback, metadata, and a matrix for backend/value/store/bot states, but the task and acceptance coverage shown does not define atomic index/value updates, concurrent set/forget behavior, interruption between writing the value and index, or recovery after a killed update. A builder would have to choose ordering and conflict semantics. Close with an 008 child phase for store lifecycle and recovery, including an index/value schema, atomic write protocol, lock or serialization rule, restart matrix, and fault-injection fixtures. [INFERENCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:72 and specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:101-102 specify the data flow and input matrix, while specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md:53-57 and 89-91 cover writes and selected kill behavior without defining concurrent store updates or index recovery]

## Questions Answered
- Security-heavy phases 007-per-bot-apps and 008-vault: are threat model, secret lifecycle, storage, injection and leak checks architected deeply enough, and should either become a phase parent with children? **Partially answered:** 007 is otherwise well decomposed but has a default-policy hole; 008 has detailed module/test plans but its same-user access boundary and store recovery require explicit planning. Recommend a narrow spec expansion for 007 and a phase parent with children for 008.

## Questions Remaining
- For 008, whether the product accepts same-user access as a stated limitation or requires process-level isolation; whether the single-secret schema remains one value per bot.
- Review phases outside this frontier: runtime foundations, computer exposure, approvals, channels and terminal-adjacent integration.

## Ruled Out
- Do not assume a worktree alone enforces least privilege: 007's plan documents that config resolution differs for shared runs.
- Do not treat 0600/0700 ownership as per-bot isolation: 008's test explicitly verifies same-user cross-read succeeds.
- No reference modules were copied or modified; the incorrect assumed rakazo integrations/ paths were replaced with the actual packages/core/src/node and packages/core/src/messages paths found by file search.

## Dead Ends
- None. The source-path correction was a local lookup adjustment, not an exhausted research approach.

## Edge Cases
- Ambiguous input: none; the frontier question and scope are explicit.
- Contradictory evidence: 007's intended per-bot restriction conflicts with its acceptance of repository-config exposure in shared runs without an apps declaration; preserved as a P0 planning conflict.
- Missing dependencies: the presumed rakazo integrations/ guard/matcher paths were absent; actual reference locations are identified in prior research and will be verified in a later targeted pass.
- Partial success: enough evidence was gathered to answer the assigned frontier question; no child proposals were allowed by the frontier block.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:60-68, 115-118
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:188-212
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:64-73, 98-102
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md:53-57, 89-91
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md:74
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:242-295
- specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/lineages/vibe-2/iterations/iteration-007.md:17-38
- specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/lineages/vibe-2/iterations/iteration-012.md:17-35
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/codex-2/steer.md (checked; absent)

## Assessment
- New information ratio: 0.83 (two fully new planning gaps and one partially new security boundary already acknowledged by the phase spec).
- Questions addressed: F-1-002.
- Questions answered: F-1-002; resolution is a clear planning verdict with two required closeouts, not approval of the current contract.

## Reflection
- What worked and why: comparing acceptance tests with the plan's declared data flow surfaced a concrete mismatch in 007, while reading 008's explicit residuals distinguished documented limits from enforced access control.
- What did not work and why: the initially assumed rakazo integrations/ source paths were wrong; repository path search located the node guard and messages matcher instead.
- What I would do differently: inspect the actual rakazo reference modules and compare cross-phase contracts before recommending final child boundaries for 008.

## Recommended Next Focus
Frontier node F-1-004: assess phases 005-memory, 009-skills and 010-conversations for prompt assembly order and budgets, transcript and routing contracts, injection boundaries, and required user-facing design artifacts.
