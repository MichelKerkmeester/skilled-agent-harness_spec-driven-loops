# Planning-depth review: OpenBot parity build

## Scope and method
Review phases 001-014 of `specs/system-skilled-bots/003-openbot-parity-build` for one-shot implementation readiness, using 003-terminal-screen as the benchmark and excluding its six children. This is progressive synthesis after iteration 1; later iterations will extend and rank the phase plan.

## Interim findings

### Phase 007-per-bot-apps
**P0 — default policy mismatch.** The implementation plan has explicit modules, field/record contracts, a declaration/config matrix, integration fixtures and rollback. It still permits a shared run with no `apps` declaration to read the repository-wide UTCP config while recording `apps: []`. That undermines per-bot least privilege. Amend 007's spec, plan and acceptance criteria to define default-deny semantics and ensure every run passes an absolute run-filtered config path, or refuse connector-capable shared runs. Do not expand this into a phase parent: the remaining gap is a policy rule and an acceptance matrix in an otherwise bounded phase. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:62] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:68] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:116]

### Phase 008-vault
**P0 — grant/access mismatch.** The plan accepts that a same-user child can read another bot's value file, and that a child can persist a value outside the stdout scan. Since `secrets:` is framed as a grant, the phase needs an explicit decision about whether same-user access is an acceptable product boundary. Expand 008 as a phase parent with children for (1) threat model and enforceable access isolation, (2) store schema, backends and CLI lifecycle, (3) injection, run record and cross-phase contracts, and (4) leak detection, cleanup and recovery fixtures. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:190] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:191] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md:74]

**P1 — crash/concurrency protocol.** Define atomic index/value writes, serialization for concurrent set/forget, and recovery when a process stops between value and index updates. Add restart and fault-injection fixtures to the store lifecycle child. [INFERENCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:72 and specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:101-102 specify data flow and the state matrix, while specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md:53-57 and 89-91 cover writes and selected child-kill behavior without defining store update serialization or index recovery]

## Ranked expansion plan (provisional)
1. **008-vault — expand to a phase parent.** Security boundary and store lifecycle decisions affect multiple runtime modules and require threat-model, sequence and recovery fixtures before implementation.
2. **007-per-bot-apps — targeted spec/plan/AC amendment.** The module and test plan are otherwise detailed; close the shared-run default policy hole without adding child phases.
3. Remaining phases — pending the next four review iterations.

## Reference code to inspect
For vault behavior, start with rakazo's `packages/core/src/node/secrets-guard.ts` and `packages/core/src/messages/secret-matcher.ts`, then compare its `packages/core/src/integrations/vault.ts` policy layer. Existing parity research recommends lifting only the matcher and selected guard behavior, with notices; it does not identify these as an end-to-end storage or isolation design. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/lineages/vibe-2/iterations/iteration-012.md:17-35]

## Iteration coverage
- Iteration 1: F-1-002, phases 007 and 008.

## Iteration 2 update

### Phase 005-memory
**P1 — concurrent writes and interrupted updates are not planned.** Add a shared-file multi-writer/restart matrix and fixtures for append/forget races and partial records. Keep this as a focused amendment within 005 rather than creating a parent. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:60-66] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:104-108] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:125-133]

### Phase 009-skills
**P1 — proposal activation handoff.** Approval records a review, while the operator manually moves the draft into the checkout. Add the exact move, `bots install` digest refresh, stale-pin check and git review as an operator prerequisite and acceptance row. The contracts and security tests otherwise look ready for one-shot implementation; no phase parent is indicated. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:104-115] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/plan.md:63-83]

### Phase 010-conversations
**P1 — retention and migration.** The append-only transcript grows without bound; rotation is deferred. Add a child for retention thresholds, archival, migration and recovery fixtures. **P1 — UI design handoff.** The Rust pane's state, transcript and keys are named, but the render test has no visual acceptance set. Make the phase consume the 003 terminal UX artifact and specify empty, active, completed, parked/resumed, error and redaction states. Expand 010 into a phase parent with transcript storage/lifecycle, routing/resume flow, TUI integration/design handoff and hardening children. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:41-55] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:105-112] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md:62-74] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md:117-129]

### Updated provisional ranking
1. **008-vault — phase parent recommended:** access boundary, store lifecycle, injection and leak control.
2. **010-conversations — phase parent recommended:** transcript lifecycle, request/resume integration, and TUI design handoff.
3. **005-memory — targeted concurrency/restart test expansion:** keep the cohesive memory flow together.
4. **007-per-bot-apps — targeted default-policy amendment:** no parent needed.
5. **009-skills — operator handoff/acceptance amendment:** no parent needed after pin-refresh steps are explicit.
6. Phases not yet reviewed — pending iterations 3-5.

### Reference code to study first
- **005-memory:** OpenBot's memory entry and list surfaces in `app/src/components/memory/memories.tsx` show add/list/edit/forget interaction states; adapt the data flow, not its server-backed storage. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/memory/memories.tsx:48-62] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/memory/memories.tsx:132-151]
- **009-skills:** OpenBot's `app/src/lib/skills/proposal.ts` gives a typed proposal schema and its `app/src/components/skills/proposed-skill.tsx` shows refusal and decision states; compare these against the local `skill-proposal.ts` record and manual git handoff. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/skills/proposal.ts:73-103] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/skills/proposed-skill.tsx:48-70]
- **010-conversations:** OpenBot's `agent-ag2/tests/test_conversation_contract.py` is the first reference for whole-thread/restart expectations; Turnstone's `turnstone/cli.py` classifier is the first reference for stale prompt targeting, exit and input transitions in an interactive loop. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/agent-ag2/tests/test_conversation_contract.py:52-73] [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:1276-1305]

- Iteration 2: F-1-004, phases 005, 009 and 010.

## Iteration 3 update

### Phase 012-manual-testing-scenarios → 014-deep-review
**P1 — manual failures can miss final review.** Phase 012 allows observed FAIL rows when each failure is documented in `scratch/failures.md`; 014's named inputs are code/docs and its own review registry/report. Add the benchmark run, `results.csv` and `failures.md` as required 014 inputs, with traceability from each failure to its scenario, phase, requirement and disposition. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/tasks.md:142-146] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/plan.md:29-30] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/plan.md:58-66]

### Phase 014-deep-review
**P1 — executor preflight/fallback conflict.** T003 requires all five executables before spawn, while the dependency and fallback contract says a missing executable drops a lineage and gets replaced. Align the Definition of Ready, T003, dependency table and acceptance test so the operator knows whether five binaries are a hard prerequisite or a fallback-supported set. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/tasks.md:39-44] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/plan.md:121-128] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/plan.md:173-183]

### Verification phase readiness
Phase 012's 33 scenario inventory, one-world fixtures, verdict recorder and package validator are concrete. Phase 013 defines code roots, both alignment reports, rechecks and validators. Phase 014 defines five review dimensions, convergence gates and serialized fix waves. Keep all three as Level 2 phases; their current scopes are sequential and well specified. The required expansion is the 012-to-014 failure handoff and the 014 executor rule, not a parent split. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/plan.md:30-73] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/plan.md:70-78] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/plan.md:120-128] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:128-146] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/tasks.md:91-137]

### Updated provisional ranking
1. **008-vault — phase parent:** resolve actual access isolation and secret-store lifecycle.
2. **010-conversations — phase parent:** transcript retention, routing/resume and terminal pane handoff.
3. **014-deep-review — targeted input/gate amendment:** consume manual failures and reconcile executor prerequisites.
4. **005-memory — targeted multi-writer/restart matrix.**
5. **007-per-bot-apps — targeted shared-run default policy.**
6. **009-skills — explicit proposal activation handoff.**
7. **012-manual-testing-scenarios — no parent; preserve the 33-scenario wave plan, but hand failure artifacts forward.**
8. **013-skilled-and-doc-alignment — no parent; retain current alignment/recheck gates.**
9. Phases 001, 002, 004, 006 and 011 remain for the next pass.

- Iteration 3: F-1-006, phases 012, 013 and 014.

## Iteration 4 update

### Runtime foundations readiness
Phase 001-activity-and-actor is sufficiently specified for one-shot implementation: actor precedence, additive run and answer fields, no schema bump, old-index compatibility, and temporary-state tests for old DDL and scheduled actors are all named. Keep it Level 2. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:60-69] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:123-125] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:148-149]

Phase 004-computer-exposure is sufficiently specified for one-shot implementation: the branch can be null, working place is derived from the runner's resolved directory, record/index fields are additive, resumed prompts gain the line when absent, and old summary rows read back null. Keep it Level 2. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:62-69] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:143-149]

Phase 006-approval-grants is sufficiently specified for one-shot implementation: grant classification, the first-answer-wins lock, scope handling, and the concurrent-answer acceptance case are defined. Keep it Level 2. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:58-67] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:169-171] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:120-124]

### Phase 002-routine-layer
**P1 — state-transition concurrency and recovery.** `routine-state.ts` and `bots enable` both update fatigue-related state, while the routine test matrix does not define an ordering for an enable racing an in-flight failed run or recovery from a stop between switch, state and needs-you writes. Add a serialized/idempotent transition contract and race/restart fault fixtures to `plan.md`, `tasks.md` and `acceptance-criteria.md`; the focused change does not justify a parent phase. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:62-66] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:71-73] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:101-102] [INFERENCE: the plan names both state writers and a state matrix but no race ordering or partial-write recovery fixture]

### Phase 011-messaging-channels
**P1 — user-facing design and delivery decomposition.** The plan pins five transports, the shared adapter, queue and approval mechanics, but it does not assign literal message examples or mockups for prompt, choice, expiry, refusal, redaction and uncertain delivery states. Create a Level 3 parent with children for (1) UX/message catalog and component map, (2) shared contract/config/pairing/roster, (3) approval and queue persistence/recovery, (4) Telegram and Slack, (5) Signal and WhatsApp, and (6) terminal/chat integration and conformance hardening. The UX child owns `design/` mockups plus snapshot fixtures for all five surfaces; it also confirms whether the documented fatigue-notice limitation is intentional. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:31-32] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:67-80] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:101-108] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:140-149] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:68]

### Reference code to study first
- **002:** OpenGhost `routines.js` is a useful first reference for visible routine lifecycle and change notifications; OpenBot's routine docs remain the domain reference. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/routines.js:4-5] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/routines.js:41-72]
- **006:** OpenBot `shared/tool-name.ts` is the planned classifier reference; OpenGhost `approval-card.js` is a useful first UI reference for approval content hierarchy and action states. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:136] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/approval-card.js:4-6] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/approval-card.js:59-89]
- **011:** Start with tinychannels `crates/tinychannels-runtime/src/channel/adapter.rs`, `crates/tinychannels-bus/src/channel/envelope.rs`, `src/delivery/queue.rs` and `src/approvals/mod.rs`; compare Turnstone's Slack bot/formatter only for its provider-specific presentation. Use tinychannels as a design reference and copy no GPL-3.0 implementation. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:65-70] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs:43-103] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/envelope.rs:37-59]
- **001 and 004:** No supplied context clone is a closer reference than the existing runtime; begin with `runtime/lib/actor.ts`, `run-record.ts`, `status-index.ts`, `dispatch.ts` and `isolation.ts`, whose owners are named by each plan. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:60-69] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:62-69]

## Iteration 5 update

The cross-phase audit confirmed that the run record is the join consumed by request, run, delivery and status surfaces, and that `answerItem` writes the item before enqueuing a resume keyed by item id. The build parent explicitly sequences actor/scope work in 001 before grant extension in 006, while 012 runs scenarios for 001-011 and 014 is the final review. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:5-11] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:5-13] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:91-119] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:78-84]

No independent cross-phase finding was added. The already-recorded 012→014 failure handoff and 014 executor preflight conflict remain required changes; 011's channels deliver parked prompts carrying `itemId`, so the 002 fatigue notice remains outside the channel approval path unless its phase contract changes. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/tasks.md:142-145] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/plan.md:100] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/plan.md:125] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:130-145] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:68-71]

## Final synthesis: ranked per-phase expansion plan

The severity labels follow the requested scale: P0 blocks a one-shot build, P1 leaves a builder to decide, and P2 is polish. Phase 003-terminal-screen is used as the depth benchmark; its six children were not reviewed.

1. **008-vault — P0, expand to a Level 3 phase parent.** Decide the real access boundary for a same-user child and prevent persistent secret writes outside the leak scan. Add children for threat model/access isolation; store schema, backends and CLI lifecycle; injection, run-record and cross-phase contracts; and leak detection, cleanup and crash/recovery fixtures. Add atomic index/value updates and concurrent set/forget tests in the store child. The current same-user read and file-write exposure contradict the grant framing. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:190-191] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md:74] [INFERENCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:72,101-102 and tasks.md:53-57,89-91 leave write serialization and index recovery undecided]
2. **007-per-bot-apps — P0, targeted spec/plan/acceptance amendment; no parent.** Resolve shared-run default behavior when no `apps` declaration exists: either enforce default-deny and pass a run-filtered absolute UTCP config path, or refuse connector-capable shared runs. Add the missing/shared-run policy row and fixtures. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:62] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:68] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:116]
3. **010-conversations — P1, expand to a Level 3 phase parent.** Add children for transcript schema/storage/retention/migration; routing and resume; terminal UI and design handoff; and hardening. Consume phase 003's UX artifact without reviewing or duplicating its children. Specify empty, active, completed, parked/resumed, error and redaction mockups plus bounded transcript retention and recovery fixtures. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:41-55,105-112] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md:62-74,117-129]
4. **011-messaging-channels — P1, expand to a Level 3 phase parent.** Add the six children listed in iteration 4, with exact per-platform message mockups, message-copy examples, button/text state tables and fixture snapshots. Record the existing operator prerequisites (WhatsApp URL/business account, Signal daemon, provider tokens) in the UX/operations handoff. Keep the shared authorization boundary in `answerItem`; do not fork it per transport. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:31-32,67-80,145-155] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/acceptance-criteria.md:60-77]
5. **005-memory — P1, focused plan/tasks/AC expansion; no parent.** Define serialization and recovery for concurrent append/forget operations, interrupted writes and partial records. Add a multi-writer/restart matrix and fixtures. The memory flow is otherwise a cohesive phase. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:60-66,104-108,125-133]
6. **012-manual-testing-scenarios — P1, targeted output-contract amendment; no parent.** Continue to allow a FAIL to be documented, but make `results.csv` and `scratch/failures.md` mandatory named outputs for 014, with scenario, phase, REQ and disposition traceability. Preserve the existing 33-scenario corpus and recorder. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/tasks.md:142-145] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/plan.md:30-73]
7. **014-deep-review — P1, targeted spec/plan/tasks/AC alignment; no parent.** Reconcile T003's five-executable hard preflight with the dependency/fallback rule, and require 012's benchmark run, results and documented failures as review inputs. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/tasks.md:39-44] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/plan.md:58-66,121-128,173-183]
8. **002-routine-layer — P1, focused plan/tasks/AC amendment; no parent.** Define the race winner and recovery protocol for `bots enable` versus an in-flight failure and for interruption between switch, routine-state and fatigue-item writes; add deterministic race/restart fault fixtures. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:62-66,71-73,101-102]
9. **009-skills — P1, operator handoff and acceptance amendment; no parent.** Specify the exact approved-proposal move into the checkout, `bots install` digest refresh, stale-pin check and git review as an operator prerequisite. Existing module/security/test design is otherwise ready. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:104-115] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/plan.md:63-83]
10. **013-skilled-and-doc-alignment — no expansion.** Keep Level 2. Its code roots, paired alignment reports, rechecks and validators are explicit. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/plan.md:70-78,120-128]
11. **001-activity-and-actor — no expansion.** Keep Level 2; schemas, backward compatibility, rollback and old-index tests are named. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:60-69,123-125,148-149]
12. **004-computer-exposure — no expansion.** Keep Level 2; prompt/record/status behavior and null/old-row compatibility are defined. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:62-69] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:143-149]
13. **006-approval-grants — no expansion.** Keep Level 2; shared answer writing, grant shape, concurrency lock and integration cases are specified. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:58-67,120-124] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:169-171]
14. **003-terminal-screen — benchmark only.** The parent is used as the requested depth benchmark. Its six UX, architecture, shell/navigation, panes, answer-flow and hardening children were not reviewed.

### Reference-code order
- **008:** rakazo `packages/core/src/node/secrets-guard.ts` and `packages/core/src/messages/secret-matcher.ts`, then `packages/core/src/integrations/vault.ts`; these inform matching and policy, not end-to-end isolation. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/lineages/vibe-2/iterations/iteration-012.md:17-35]
- **007:** use the current local `runtime/lib/dispatch.ts` and `posture.ts` as the first references for config filtering and declared posture; no supplied context clone is a closer reference for this shared-run policy gap. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:62-68]
- **010:** OpenBot `agent-ag2/tests/test_conversation_contract.py` for thread/restart behavior, then Turnstone `turnstone/cli.py` for interactive input and resume transitions. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/agent-ag2/tests/test_conversation_contract.py:52-73] [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:1276-1305]
- **011:** tinychannels adapter, envelope, approval and queue modules first; then Turnstone's Slack bot/formatter for provider presentation. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:65-70] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs:43-103] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/envelope.rs:37-59]
- **005:** OpenBot `app/src/components/memory/memories.tsx` for memory add/list/edit/forget states; retain local file-backed storage semantics. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/memory/memories.tsx:48-62,132-151]
- **009:** OpenBot `app/src/lib/skills/proposal.ts` and `app/src/components/skills/proposed-skill.tsx` for proposal records and approval/refusal states. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/skills/proposal.ts:73-103] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/skills/proposed-skill.tsx:48-70]
- **002 and 006:** OpenGhost `routines.js` and `approval-card.js`; the 006 classifier still starts from OpenBot `shared/tool-name.ts`. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/routines.js:41-72] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/approval-card.js:59-89] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:136]
- **001, 004, 012, 013 and 014:** use the named local runtime modules and phase-owned fixtures first; the supplied context clones do not provide a closer source for the additive actor/index fields, branch/worktree status, 33-scenario recorder, docs alignment gates or review executor preflight.

### Loop closeout
All five configured iterations were recorded; the reducer completed five iterations with zero corruption. The final convergence command returned STOP with `stopReason: maxIterationsReached`, while the graph remained empty and source-diversity quality telemetry remained insufficient. The configured max-iteration policy therefore governed the stop, as requested.

### Iteration 5 workflow boundary note
The synthesis YAML's `step_writeback_spec_findings` targets `{spec_folder}/spec.md`, outside this lineage's write authority. That step is deferred under the dispatcher's lineage-only write limit; no target packet file was modified. The lineage's `research.md` is the canonical synthesis output for this run. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:2120-2145]

## Eliminated Alternatives
- Do not expand 001, 004 or 006 into parents: their module, record, compatibility, rollback and test boundaries are already explicit; the identified state race is confined to 002's fatigue updates. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:60-69,123-125,148-149] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:62-69] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:58-67,120-124]
- Do not split 005, 007, 009, 012 or 014 into parent phases: their unresolved work is a bounded concurrency, policy, operator-handoff or cross-phase input/gate amendment.
- Do not inspect the six children of 003-terminal-screen; the parent remains the supplied depth benchmark.

## Divergence Map
Three depth-1 frontier nodes were answered, with no open or active nodes, pivot attempts or overrides. The lineage added no child frontier proposals. The cross-phase audit did not identify a new divergent direction beyond the ranked amendments already recorded.

## Convergence Report
- Stop reason: `maxIterationsReached`
- Total iterations: 5
- Questions answered: 3 / 3
- Remaining tracked questions: 0
- Last 3 runs: run 3 verification phases (ratio 1.0); run 4 runtime foundations and messaging (ratio 1.0); run 5 cross-phase contract audit (ratio 0.0)
- Convergence threshold: 0.05
- Divergence summary: 3 frontier nodes answered; no remaining frontier.
- Telemetry: the coverage graph remained empty and the source-diversity quality signal was insufficient; max-iteration policy still required the fifth pass and determined the stop.

## Final ranked per-phase expansion plan
1. **008-vault — P0:** Level 3 parent; threat model/access isolation, store schema and lifecycle, injection and cross-phase contracts, leak detection and crash/recovery fixtures.
2. **007-per-bot-apps — P0:** amend spec, plan and acceptance criteria for shared-run default-deny behavior and a run-filtered absolute UTCP config path or explicit refusal.
3. **010-conversations — P1:** Level 3 parent; transcript retention/storage, routing/resume, terminal UX handoff and hardening children.
4. **011-messaging-channels — P1:** Level 3 parent; UX/message mockups, shared contract and identity, approvals/queue recovery, provider adapters and terminal/conformance children.
5. **005-memory — P1:** add multi-writer, append/forget race, partial-write and restart fixtures; keep Level 2.
6. **012-manual-testing-scenarios — P1:** make results and documented failures required 014 inputs with traceability; keep Level 2.
7. **014-deep-review — P1:** reconcile the five-executor preflight with fallback behavior and consume 012's results/failures; keep Level 2.
8. **002-routine-layer — P1:** define fatigue/enable race ordering and interrupted-write recovery with deterministic fixtures; keep Level 2.
9. **009-skills — P1:** document proposal activation, install digest refresh, stale-pin check and git review; keep Level 2.
10. **013-skilled-and-doc-alignment — no expansion:** retain the existing alignment and recheck plan.
11. **001-activity-and-actor — no expansion:** retain the existing actor/schema compatibility plan.
12. **004-computer-exposure — no expansion:** retain the existing working-place, record and status plan.
13. **006-approval-grants — no expansion:** retain the existing shared answer guard, grant and concurrency plan.
14. **003-terminal-screen — benchmark only:** do not review its children in this run.
