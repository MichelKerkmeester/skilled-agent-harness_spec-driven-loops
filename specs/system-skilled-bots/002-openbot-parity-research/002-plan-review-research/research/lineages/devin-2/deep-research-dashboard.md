---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Build-readiness review of the eleven planned phases of packet specs/system-skilled-bots/003-openbot-parity-build (001-activity-and-actor, 002-routine-layer, 003-terminal-screen, 004-computer-exposure, 005-memory, 006-approval-grants, 007-per-bot-apps, 008-vault, 009-skills, 010-conversations, 011-messaging-channels). Each phase has spec.md, plan.md, tasks.md and acceptance-criteria.md. They were written in parallel, each alone, and nobody has checked them against the built runtime or against each other. This is a review of plans, not new design research. Evidence (read-only): the phase docs; the built skilled-bots runtime (.skilled/skills/system-skilled-bots/runtime/lib/, .skilled/bin/bots.cjs, .skilled/skills/system-skilled-bots/scripts/bot-check.cjs, runtime/tests/); the parity research synthesis specs/system-skilled-bots/002-openbot-parity-research/research/research.md; the reference repos under specs/system-skilled-bots/context/ (OpenBot-main, OpenMausBot-main, rakazo-main, openhuman-main, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main, tinychannels-main). Four angles: 1. Plan versus runtime: do the files, functions, records, fields and verbs each plan names exist with the shapes it assumes, and are its test and verify commands runnable here? 2. Cross-phase consistency: do the phases agree on shared records (by: actor, grants, operators.json, conversation JSONL, memory files, state-root layout, HonoredPosture fields, bots --json output read by the terminal screen and the channels), and are the build order and dependencies sound? 3. Parity gaps and overbuild: for a small team, what is still missing after all eleven phases, and what do the plans build that is not needed or duplicates another phase or the runtime? 4. Security and failure modes: secret leakage, token storage, spoofed chat users, who may approve, restarts, lost or duplicated messages and answers, concurrent approvals from terminal and chat, prompt injection through memory, skills or chat, routine until and fatigue edge cases. Every finding names the phase, the doc and line, the evidence with [SOURCE: path:line], a severity (P0 blocks the build, P1 wrong or missing, P2 polish) and the exact spec edit that fixes it. End with findings grouped by phase and ranked, plus a cross-phase conflict list.
- Started: 2026-11-25T14:06:08Z
- Status: COMPLETE
- Iteration: 13 of 13
- Session ID: fanout-devin-2-1795615532231-nbblrp
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Frontier node F-1-002 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/0*/spec.md, specs/system-skilled-bots/003-openbot-parity-build/0*/plan.md): Cross-phase records: do the phases agree on shared records and their exact shape (by: actor, needs-you grants, operators.json and roles, conversation JSONL, memory files, state-root layout, HonoredPosture fields)? List every conflict between two phases. | cross-phase-consistency | 1.00 | 6 | complete |
| 2 | Frontier node F-1-006 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer, specs/system-skilled-bots/003-openbot-parity-build/005-memory, specs/system-skilled-bots/003-openbot-parity-build/009-skills, specs/system-skilled-bots/003-openbot-parity-build/010-conversations, specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels): Failure modes: what happens across the plans on restarts, lost or duplicated messages and answers, concurrent approvals from the terminal and a chat, prompt injection through memory, skills or chat, and routine until and fatigue edge cases? | failure-modes | 1.00 | 6 | complete |
| 3 | Frontier node F-1-002 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/0*/spec.md, specs/system-skilled-bots/003-openbot-parity-build/0*/plan.md): Cross-phase records: do the phases agree on shared records and their exact shape (by: actor, needs-you grants, operators.json and roles, conversation JSONL, memory files, state-root layout, HonoredPosture fields)? List every conflict between two phases. | cross-phase-consistency | 0.83 | 3 | complete |
| 4 | Angle 1 — plan versus runtime: do the files, functions, records, fields and verbs each phase plan names exist with the shapes it assumes, and are its test and verify commands runnable here? | plan-vs-runtime | 1.00 | 4 | complete |
| 5 | Angle 1 at the shape layer — do the record and field shapes each plan assumes match the runtime's actual types, and do the new fields have a named home? | plan-vs-runtime | 1.00 | 3 | complete |
| 6 | Angle 2's build-order half — for each phase, does every file it modifies exist today or get created by an earlier phase, and does any file get claimed as a new creation by more than one phase? | build-order | 1.00 | 2 | complete |
| 7 | Angle 3 — for a small team, what is still missing after all eleven phases, and what do the plans build that is not needed or duplicates another phase or the runtime? | parity-gaps | 1.00 | 3 | complete |
| 8 | Angle 4's security half — secret leakage paths, token storage, spoofed chat users and who may approve, tested against the runtime's record shape, the vault's storage claim and the channel link's identity model. | security | 1.00 | 3 | complete |
| 9 | The --json payloads the terminal and the channels consume: does each producer promise the keys its consumer parses? | json-contracts | 1.00 | 3 | complete |
| 10 | Angle 2's remaining half — each phase declares a handoff that the next phase depends on; does every handoff name an observable state the next phase's setup step can test, and does any handoff claim a dependency that does not exist or contradict the phase's own change? | handoffs | 0.83 | 3 | complete |
| 11 | The closure layer: every requirement has an acceptance row, no acceptance row cites a missing requirement, and every [P0] checklist row names a check that can run. | closure-layer | 1.00 | 3 | complete |
| 12 | The run folder and the child environment — phase 008 promises a stored value never reaches the prompt, the run folder, the run record or a delivery message; this pass tested the run-folder sink against what the runner writes. | security | 1.00 | 1 | complete |
| 13 | Consolidation — duplicate check, fix order, and the parent-level edits that settle more than one finding. | consolidation | 0.60 | 3 | complete |

- iterationsCompleted: 13
- keyFindings: 48
- openQuestions: 0
- resolvedQuestions: 2

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 2/2
- [x] Cross-phase records: do the phases agree on shared records and their exact shape (by: actor, needs-you grants, operators.json and roles, conversation JSONL, memory files, state-root layout, HonoredPosture fields)? List every conflict between two phases.
- [x] Failure modes: what happens across the plans on restarts, lost or duplicated messages and answers, concurrent approvals from the terminal and a chat, prompt injection through memory, skills or chat, and routine until and fatigue edge cases?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▅▇████████▇▅▆██▅▁
- score sparkline: ██▇▅▇████████▇▅▆██▅▁
- Last 3 ratios: 1.00 -> 1.00 -> 0.60
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.60
- coverageBySources: {"code":182,"other":11}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Treating `by` and `actor` as a naming conflict.** Phase 001 deliberately splits them: `by` on a needs-you answer, `actor` on a run record [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:146-147]. That is two records with two fields, not one record with two names, so it was ruled out as a conflict. The bot-message gap in Finding 5 is the real residue. (iteration 1)
- **Treating `HonoredPosture.apps` and `HonoredPosture.secretsUsed` as a conflict.** Phase 007 adds `apps` and explicitly leaves the validator unchanged [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:63]; phase 008 adds `secretsUsed` read as `[]` when absent [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:154]. Both edit the same interface but they are additive and ordered (007 before 008), so no conflict. (iteration 1)
- **Treating the memory and vault state-root folders as a collision.** Phase 005 uses `memory/shared.md` and `memory/<bot-id>.md` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:49]; phase 008 uses the identity's `secrets` folder [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:84]. Different folders under the same root, both through `state-root.ts`, so no collision. (iteration 1)
- Reading only `spec.md` files hides the `SCHEMA_VERSION` contradiction: 001's bump lives in `plan.md:60,76` and its spec never names the constant. A spec-only pass would have missed it. Not a dead end for the node, but a method note: plan file tables carry the verify commands that actually break. (iteration 1)
- **Treating `holdForBot` as a per-bot pile-up risk.** It returns the first open item for a bot and holds that bot while it is open [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:287], so real-bot items do not pile up. Only the reserved-id proposal items escape it (Finding 5). (iteration 2)
- **Treating a re-sent chat message as a duplicate run.** Phase 010 uses the request's event id as the human message id, so a re-sent message is a queue duplicate [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:163], and `answerItem` derives the resume request id from the item id [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:105]. The duplicate-run case is already solved. (iteration 2)
- **Treating the approval index or the send queue as restart-fragile.** Phase 011 writes the approval index before the send and resolves a press through the file, so a restart loses no prompt [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:178], and the queue writes an entry before the I/O and records an uncertain send `unknown` without retrying [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:185]. Both are file-backed and both have a stated restart test [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:209]. Verified as strengths, not failures. (iteration 2)
- Searching the phase docs for an explicit "injection" or "untrusted" token returns nothing in 005, 009, 010 or 011. That absence is the finding, but it also means there is no line to cite for "the plan says nothing"; the citations point at the block each phase injects and at the only text check it applies. (iteration 2)
- **Treating phase 007's "validator unchanged" claim as wrong.** `validateRunRecord` checks the eight field groups' presence and a fixed set of named fields, and never enumerates `HonoredPosture`'s keys [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:240]. Adding `apps` and `secretsUsed` therefore needs no validator change, and an older record still validates. Both 007 and 008 are correct; recorded as a verified strength. (iteration 3)
- **Treating phase 010's dependency on 003 as a build-order defect.** The phase map says 003 gains its chat pane in 010, and 010 replaces the phase 003 placeholder [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:155]; the placeholder is explicit in 003's requirement [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:164]. The handoff is deliberate and stated on both sides, not a conflict. (iteration 3)
- **Treating the state-root folders as a collision.** The runtime's shared level holds `index`, `registered-roots` and `authority`; the identity level holds `requests`, `leases`, `switches`, `needs-you`, `records`, `installs` and `receipts` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117]. The phases add `routines` (002), `memory` at both levels (005), `secrets` (008), `proposals` (009), `conversations` (010) and `channels` (011) — seven distinct names, each through `state-root.ts`, with no shared file name. Verified as consistent. (iteration 3)
- Comparing acceptance-criteria files row by row for every record produced no new conflict: the four contested contracts are absent from the acceptance rows and live only in `tasks.md` and `plan.md`. The acceptance layer is thinner than the task layer, which is itself worth knowing: a phase can pass its AC table and still fail a task verify. (iteration 3)
- **Treating `$T` in phase 007's tasks as an undefined variable.** It is a `mktemp` directory defined inline in the same command [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/tasks.md:37], not a missing notation variable. (iteration 4)
- **Treating any planned symbol as invented.** All fifteen symbols checked exist today, including `buildBotPrompt` in `dispatch.ts` and `runner.ts`, `runPrecheck` in `runner.ts`, `summarizeRecord` in `status-index.ts`, `buildResumedPrompt` in `needs-you.ts` and `runner.ts`, and `openIndex` in `status-index.ts`. The plans' pre-state claims are accurate. (iteration 4)
- **Treating the `crates/bots-tui/` path as inconsistent with `<skilled-tree>`.** `DEFAULT_SKILLED_TREE` resolves to the repository root (`__dirname/../..` from `.skilled/bin`), so `<skilled-tree>/crates/bots-tui/target/release/bots-ui` and the file table's `crates/bots-tui/...` name the same path [SOURCE: .skilled/bin/bots.cjs:17] [SOURCE: .skilled/bin/bots.cjs:425]. The plan's reason for placing the crate outside `.skilled/` — the `.opencode/` mirror would duplicate the build output — is sound [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:31]. (iteration 4)
- **Treating the new verbs as already present.** `VERB_SPECS` holds exactly the eleven verbs the phases claim, and none of `activity`, `ui`, `routines`, `remember`, `secret`, `skill`, `chat` or `channel` is among them [SOURCE: .skilled/bin/bots.cjs:64]. Every phase's "unknown verb" measured behavior is accurate. (iteration 4)
- A pure existence sweep cannot find a wrong shape: every `Modify` path exists and every `Create` path is absent except `scripts/fixtures/`, so the sweep is clean apart from Finding 3. Shape errors need a per-symbol read, which is the next iteration's work. (iteration 4)
- **Treating `HonoredPosture` as an open key bag.** The record validator checks group presence and named fields and never enumerates the posture keys [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:240], so 007's and 008's additive fields need no validator change; that was already ruled in during iteration 3 and still holds. (iteration 5)
- **Treating `RunSummary`'s new fields as unnamed.** Phase 004's REQ-005 names `lastRun.branch` and `lastRun.worktreePath` in the JSON, and REQ-006 says the two fields ride in `RunSummary` from the record's evidence [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:147]. The data already exists in `EvidenceLocations.branch` and `EvidenceLocations.worktreePath` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:155], so the phase surfaces it without a new record field. Verified as consistent. (iteration 5)
- **Treating the `BotDefinition` key additions as a collision.** `FRONTMATTER_KEYS` holds thirteen keys today [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:92], and the four phases that add a key each add a distinct one — `routine` (002), `memory` (005), `apps` (007) and `skills` (009). Phase 008 adds none, because `secrets` already exists as `Posture.secrets` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:57]. Verified as consistent. (iteration 5)
- **Treating the needs-you key list as automatically extensible.** It is not — `ITEM_KEYS` is an explicit array [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:51] — which is why phases 001 and 006 both say they update it, and why Finding 2 matters. (iteration 5)
- Reading the interface alone cannot find a semantic contradiction: `NeedsYouItem` has no `kind` field today, so the 005 conflict only appears when the requirement text is read against `holdForBot`'s selector. Shape review needs the reader, not just the type. (iteration 5)
- **Treating 011's `THIRD_PARTY_NOTICES.md` row as wrong.** It is the only phase that correctly marks an append as `Modify`, which is the model the other phases should copy. (iteration 6)
- **Treating the shared `Modify` sets as merge risks.** The phases run one at a time and the lists are strictly ordered; the only cross-phase edit risk is the `SCHEMA_VERSION` contradiction already reported as P0 in iteration 3. (iteration 6)
- A pure duplicate-`Create` scan finds only two paths (`THIRD_PARTY_NOTICES.md` and `scripts/fixtures/`), and the second is a directory that already exists. The build-order layer is otherwise clean, which suggests the parallel authors coordinated on file ownership better than on field contracts. (iteration 6)
- **Treating phase 003's Rust TUI as overbuild.** The research ranked the terminal screen and the operator chose a Rust rebuild explicitly, with the GPL alternative rejected [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:157]. The phase follows a recorded decision, so it is not overbuild. (iteration 7)
- **Treating phase 008's four modules as overbuild.** The research names rakazo's vault policy, leak matcher and placeholder guard as the liftable layer [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:73], so the module split mirrors the reference rather than inventing surface. (iteration 7)
- **Treating phase 011 as an unranked phase that should not exist.** The research's small-team model puts a bot in the team's chat, and the phase is explicit that it extends the program rather than continuing the ranked order [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:43]. The finding is the phase's size, not its existence. (iteration 7)
- Searching for a missing verb by comparing the research's smallest-change text to the phase lists found no gap: every "smallest change" sentence in the research maps to a phase requirement. The gaps that remain are operational (backup), not feature slices. (iteration 7)
- **Treating `bots secret list` as a leak.** REQ-003 prints names and metadata only and states that no verb prints a value [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:149]. Verified as consistent with the store's index shape. (iteration 8)
- **Treating a forwarded pairing code as a spoofing hole the phase misses.** The code is one-time and the lockout is file-backed [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:176]; whoever redeems it first becomes the linked actor, which is the same trust model as any device-pairing flow. It is a residual risk, not a plan defect. (iteration 8)
- **Treating channel token storage as a new leak.** Phase 011 resolves a token through the vault at send time and refuses `secret-unknown` before the I/O [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:223], so the token value lives in the same store as every other secret and never in the link file. (iteration 8)
- **Treating the run record as a secret-capture path.** `DispatchSnapshot` holds source, timestamps, lateness, skipped slots and a held slot; it has no environment or argv field [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:82], so 008's "never the run record" holds by construction. (iteration 8)
- The outbound path is already covered: `delivery.ts` calls `findSecretLiteral` before a delivery, and 008 adds every stored value to the known-secret map [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:160]. The inbound persistence path in 010 is the uncovered one. (iteration 8)
- **Treating `chat --transcript --json` as underspecified.** Phase 010 names the message keys in REQ-003 and says `--json` prints the messages as an array in REQ-006 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:150], which is enough for 003's chat pane and for 010's own pane requirement. (iteration 9)
- **Treating 011's `options` read as a shape risk.** `options` is `string[] | null` on the item [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:36] and 011's YES/NO fallback covers the null case [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:179]. (iteration 9)
- **Treating the status header's staleness flag as missing.** `status.ts` carries a `stale` boolean and a `staleIdentities` list in its snapshot [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:106], so 003's header assumption is sound. (iteration 9)
- Comparing only the producer's spec to the consumer's spec finds the missing keys but not the vocabulary mismatch; the seven-versus-six marker gap only appears when 001's group list and 003's marker list are laid side by side. (iteration 9)
- **Treating phase 005's byte-identical-prompt handoff as untestable.** It names the exact regression (a bot with no memory file gets today's prompt) and phase 005's acceptance table carries the matching row [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/acceptance-criteria.md:59]. Observable and testable. (iteration 10)
- **Treating phase 007's handoff as overreach.** It names the per-run config path and says 008 injects into the same file, which matches 008's own scope ("the per-run filtered UTCP config and `HonoredPosture.apps` belong to 007") [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:42]. The handoff is the model the other phases should follow. (iteration 10)
- **Treating phase 011's "nothing passes to a successor" as wrong.** It is the last phase in the program and its handoff says so; the only defect there is the phase-count metadata already reported in iteration 1. (iteration 10)
- A handoff that names a command can be checked against the runtime, but a handoff that names a behavior ("a met `until` switches the bot off") can only be checked against the phase's acceptance table. Both were read; no further contradiction surfaced. (iteration 10)
- **Treating 002's and 009's asserted file counts as wrong.** Both match the current tables (22 and 23 rows), so the check passes today; the defect is what it proves, not whether it passes. (iteration 11)
- **Treating any requirement as unaccepted.** All eleven phases have one or more `AC` rows per `REQ` and no `AC` row cites a missing `REQ`; the counts are 7/7, 10/10, 15/15, 9/9, 12/12, 11/11, 9/12, 13/13, 10/10, 11/11 and 19/19 (007 has three extra matrix rows, all mapped to existing requirements). The acceptance layer is complete. (iteration 11)
- **Treating the `[P0]` checklist as decorative.** The rows name real gates elsewhere — typecheck, the full suite, a secret scan and a manual verb run — and nine phases carry a runnable command for each. 011 is the outlier. (iteration 11)
- A pure `REQ`/`AC` diff cannot find a gate that checks the wrong artifact; that only appears when the `[P0]` row's label is read against its command. (iteration 11)
- **Treating a child's descendants as a separate plan defect.** The value is injected into the child's environment and any subprocess it spawns inherits it; that is inherent to environment injection and is the reason the redaction pass, not the injection, is the enforceable control. (iteration 12)
- **Treating the `.utcp_config.json` `env_file_path` as a leak.** It is a path to a dotenv file, not a value, and the filtered copy keeps the path the operator already configured. (iteration 12)
- **Treating the run record as a fourth leak.** `DispatchSnapshot` has no environment or argv field [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:82], so the record cannot carry the value; only the captured output can. (iteration 12)
- Searching for a second state-root writer of child output found none: the stdout log is the only capture, and the ledger writes request metadata rather than child text. (iteration 12)
- **Treating iteration 1's `SCHEMA_VERSION` finding as a separate item from iteration 3's and 10's.** All three cite the same constant and the same two phases; they are one root cause with three consequences and are merged in Finding 1. (iteration 13)
- **Treating the 45-versus-40 difference as lost findings.** Every delta row is present in the registry under a slug id; the five extras are the verified observations, not missing findings. (iteration 13)
- **Treating the frontier answers as complete coverage of the topic.** The two frontier nodes covered shared records and failure modes; the four topic angles were covered by iterations 3-12 after the frontier drained, and the synthesis names what remains unexamined. (iteration 13)
- A per-phase count from the `sources` arrays overcounts phases that a finding cites as evidence but does not accuse (for example, 008 citing 010). The ranking in Finding 3 uses the accused phase, read by hand, not the raw citation count. (iteration 13)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:frontier -->
## 6B. FRONTIER
- Frontier size: 2 nodes (0 open, 0 active, 2 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 1
- Budget depth1: 3 of 6.5 iterations spent
- Budget depth2: 0 of 8.05 iterations spent
- Budget depth3: 0 of 10 iterations spent

<!-- /ANCHOR:frontier -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
