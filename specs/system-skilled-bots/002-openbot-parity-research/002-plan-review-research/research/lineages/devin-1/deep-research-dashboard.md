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
- Started: 2026-11-25T14:06:54Z
- Status: INITIALIZED
- Iteration: 12 of 13
- Session ID: fanout-devin-1-1795615532231-nbblrp
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Frontier node F-1-001 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/*/plan.md, specs/system-skilled-bots/003-openbot-parity-build/*/tasks.md, specs/system-skilled-bots/003-openbot-parity-build/*/acceptance-criteria.md, .skilled/skills/system-skilled-bots/runtime/lib, .skilled/bin/bots.cjs, .skilled/skills/system-skilled-bots/runtime/tests): Plan versus runtime: do the files, functions, records, fields and CLI verbs each of the eleven phase plans names exist in the built runtime with the shapes the plan assumes, and are the test and verify commands in every tasks.md and acceptance-criteria.md runnable here (vitest paths, cargo for the Rust screen)? List every mismatch. | plan-vs-runtime | 1.00 | 4 | complete |
| 2 | Frontier node F-1-005 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/005-memory, specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants, specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps, specs/system-skilled-bots/003-openbot-parity-build/008-vault, specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels): Security: in the vault (008), apps (007), approvals (006), memory (005) and channels (011) plans, where can secrets leak into prompts, logs, run records or chat, how are tokens stored, and can a spoofed or unlinked chat user approve or read? | security | 1.00 | 5 | complete |
| 3 | Frontier node F-1-001 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/*/plan.md, specs/system-skilled-bots/003-openbot-parity-build/*/tasks.md, specs/system-skilled-bots/003-openbot-parity-build/*/acceptance-criteria.md, .skilled/skills/system-skilled-bots/runtime/lib, .skilled/bin/bots.cjs, .skilled/skills/system-skilled-bots/runtime/tests): Plan versus runtime: do the files, functions, records, fields and CLI verbs each of the eleven phase plans names exist in the built runtime with the shapes the plan assumes, and are the test and verify commands in every tasks.md and acceptance-criteria.md runnable here (vitest paths, cargo for the Rust screen)? List every mismatch. | plan-vs-runtime | 1.00 | 5 | complete |
| 4 | Frontier node F-1-005 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/005-memory, specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants, specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps, specs/system-skilled-bots/003-openbot-parity-build/008-vault, specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels): Security: in the vault (008), apps (007), approvals (006), memory (005) and channels (011) plans, where can secrets leak into prompts, logs, run records or chat, how are tokens stored, and can a spoofed or unlinked chat user approve or read? | security | 1.00 | 5 | complete |
| 5 | Frontier node F-1-001 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/*/plan.md, specs/system-skilled-bots/003-openbot-parity-build/*/tasks.md, specs/system-skilled-bots/003-openbot-parity-build/*/acceptance-criteria.md, .skilled/skills/system-skilled-bots/runtime/lib, .skilled/bin/bots.cjs, .skilled/skills/system-skilled-bots/runtime/tests): Plan versus runtime: do the files, functions, records, fields and CLI verbs each of the eleven phase plans names exist in the built runtime with the shapes the plan assumes, and are the test and verify commands in every tasks.md and acceptance-criteria.md runnable here (vitest paths, cargo for the Rust screen)? List every mismatch. | plan-vs-runtime | 0.90 | 5 | complete |
| 6 | Frontier node F-1-005 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/005-memory, specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants, specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps, specs/system-skilled-bots/003-openbot-parity-build/008-vault, specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels): Security: in the vault (008), apps (007), approvals (006), memory (005) and channels (011) plans, where can secrets leak into prompts, logs, run records or chat, how are tokens stored, and can a spoofed or unlinked chat user approve or read? | security | 1.00 | 5 | complete |
| 7 | Frontier node F-1-001 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/*/plan.md, specs/system-skilled-bots/003-openbot-parity-build/*/tasks.md, specs/system-skilled-bots/003-openbot-parity-build/*/acceptance-criteria.md, .skilled/skills/system-skilled-bots/runtime/lib, .skilled/bin/bots.cjs, .skilled/skills/system-skilled-bots/runtime/tests): Plan versus runtime: do the files, functions, records, fields and CLI verbs each of the eleven phase plans names exist in the built runtime with the shapes the plan assumes, and are the test and verify commands in every tasks.md and acceptance-criteria.md runnable here (vitest paths, cargo for the Rust screen)? List every mismatch. | plan-vs-runtime | 1.00 | 3 | complete |
| 8 | Frontier node F-2-006 (depth 2, scope specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants, specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels, specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor): Who is allowed to answer a needs-you item, and can a chat sender be linked to the operator before any approval is honored across the 006, 011 and 001 plans? | security | 1.00 | 4 | complete |
| 9 | Frontier node F-2-007 (depth 2, scope specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants): How is a standing grant listed, revoked or expired once a rule store exists, and what stops an `always` grant from becoming permanent silent authority? | security | 1.00 | 4 | complete |
| 10 | Frontier node F-2-008 (depth 2, scope specs/system-skilled-bots/003-openbot-parity-build/008-vault, .skilled/skills/system-skilled-bots/runtime/lib): Do the secret scans cover child transcripts and logs written outside the run folder, such as an executor's own session store, or only the run folder the plan scans? | security | 1.00 | 3 | complete |
| 11 | Frontier node F-2-009 (depth 2, scope specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen, specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure, .skilled/skills/system-skilled-bots/runtime/lib/status.ts): Do the eleven plans agree on the `bots status --json` key set that phase 003's header and phase 004's lastRun fields both extend, and does any phase add a key without updating the terminal screen's parser? | plan-vs-runtime | 1.00 | 2 | complete |
| 12 | Plan versus runtime: phases 009-skills and 010-conversations — verify every file, symbol, CLI verb and verify command those plans name, then rank the cross-phase conflicts for the final consolidation. | plan-vs-runtime | 1.00 | 4 | complete |

- iterationsCompleted: 12
- keyFindings: 49
- openQuestions: 0
- resolvedQuestions: 6

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 6/6
- [x] Plan versus runtime: do the files, functions, records, fields and CLI verbs each of the eleven phase plans names exist in the built runtime with the shapes the plan assumes, and are the test and verify commands in every tasks.md and acceptance-criteria.md runnable here (vitest paths, cargo for the Rust screen)? List every mismatch.
- [x] Security: in the vault (008), apps (007), approvals (006), memory (005) and channels (011) plans, where can secrets leak into prompts, logs, run records or chat, how are tokens stored, and can a spoofed or unlinked chat user approve or read?
- [x] Who is allowed to answer a needs-you item, and can a chat sender be linked to the operator before any approval is honored across the 006, 011 and 001 plans?
- [x] How is a standing grant listed, revoked or expired once a rule store exists, and what stops an `always` grant from becoming permanent silent authority?
- [x] Do the secret scans cover child transcripts and logs written outside the run folder, such as an executor's own session store, or only the run folder the plan scans?
- [x] Do the eleven plans agree on the `bots status --json` key set that phase 003's header and phase 004's lastRun fields both extend, and does any phase add a key without updating the terminal screen's parser?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██████▅▁▅███████████
- score sparkline: ██████▅▁▅███████████
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 1.00
- coverageBySources: {"code":5,"other":74}
- WARNING event: novelty_signal_inert metric=newInfoRatio run=12 window=3 sparkline=▄▄▄ — newInfoRatio held flat at 1 across 3 iterations — the novelty signal is uninformative, so convergence and "not exhausted" claims derived from it are untrustworthy.
- Advisory event: trend_flatline metric=score run=12 window=3 sparkline=▄▄▄

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- No dead ends this iteration; every citation checked resolved. (iteration 1)
- Running the full vitest suite was not attempted: it writes caches and temp fixtures outside this lineage, which this run forbids. Runnability was established statically (`vitest` present in `node_modules/.bin`, `test` script declared, every named test file present). (iteration 1)
- Suspected 001 contradiction between Definition of Ready (`SCHEMA_VERSION` prints `'2'`) and the affected-surface verification (`'3'`): ruled out. The first is the pre-change baseline, the second the post-change check, and `status-index.ts:55` currently holds `'2'`. (iteration 1)
- Suspected 002 citation drift: ruled out. `parseTrigger` is at `definition.ts:142`, `schedulePeriodSeconds` at `slot-accounting.ts:102`, `identityStatePaths` at `state-root.ts:117-132`, `runPrecheck` at `runner.ts:535`, the `disabled` read at `runner.ts:822`, `SWITCH_KINDS` at `switches.ts:25`, and the `disabled`/`paused` reads at `installer.ts:547-548`. (iteration 1)
- Suspected 002 inventory miscounts in the "Required inventories" block: ruled out. `rg -c 'trigger'` returns exactly definition.ts:14, slot-accounting.ts:5, installer.ts:5, request-queue.ts:3, runner.ts:2, repo-config.ts:1, and the switch-consumer count returns switches.ts:4, installer.ts:3, runner.ts:3, bots.cjs:2, as written. (iteration 1)
- No dead ends; every cited symbol and refusal resolved. (iteration 2)
- Suspected `bots secret set --value` already accepted: ruled out. The CLI has no `secret` verb at all, so the DoR refusal reproduces. (iteration 2)
- Suspected 006 rollback error (like the 001 one): ruled out. `validateNeedsYouItem` rejects unknown keys, so an item carrying `grants` really is unreadable after a revert. (iteration 2)
- Suspected 008 DoR drift: ruled out. `posture.secrets` and `SKILLED_BOT_SECRET_` both exit 1; `state-root.ts` and `run-record.ts` contain no `secrets`/`secretsUsed`; `assertDispatchEnvAllowed` is at `executor-audit.ts:1508` and refuses with "is not allowed for" at 1513; the runner literal check is at `runner.ts:942` and the delivery check at `delivery.ts:291`. (iteration 2)
- No dead ends; every citation and probe resolved. (iteration 3)
- Suspected citation drift in 003: ruled out. `bots ui` exits 2; `.opencode/bin/bots.cjs` and `.opencode/skills/system-skilled-bots/SKILL.md` exist; `.github/workflows/bots-runtime.yml` exists; `.gitignore` has no `crates` entry; the openhuman `app.rs` patterns match at lines 301 and 359. (iteration 3)
- Suspected citation drift in 004: ruled out. `checkoutLine` at `dispatch.ts:306`, `buildBotPrompt` at 315, `runner.ts:1038` exact, `summarizeRecord` at `status-index.ts:266`, `status.ts:479` exact, `branch: string | null` at `run-record.ts:156`, and both `.opencode` entries are relative symlinks as 004 states. (iteration 3)
- Suspected missing crate workspace: ruled out. No root `Cargo.toml` exists, so the standalone manifest path 003 uses is valid. (iteration 3)
- Suspected toolchain gap: ruled out. `cargo 1.92.0`, `clippy 0.1.92` and `rustfmt 1.8.0-stable` are installed, matching 003's stated "cargo 1.92.0" and making its DoD runnable. (iteration 3)
- No dead ends. (iteration 4)
- Suspected 005 missing migration: ruled out for `kind` — T016 explicitly reads a missing `kind` as `decision`; the gap is only 006's `grants`. (iteration 4)
- Suspected 007 citation drift: ruled out. `.utcp_config.json` holds 14 names; the Code Mode lookup is at `dist/index.js:327`; `EXECUTOR_COMMON_ENV_ALLOWLIST` is at `executor-audit.ts:150` and has no `UTCP_CONFIG_FILE`; `HonoredPosture` has four fields and no `apps`; `HARD_INVARIANTS` has no `apps-unknown-server`; the `clean` fixture exists and `apps-unknown-server` is a create task; `.claude/mcp.json:9` and the two doctor lines carry the pin; `status-index.ts` has no `posture` string. (iteration 4)
- Suspected 007 record-validator change: ruled out. `validateRunRecord` checks the posture group's shape, not its keys, so adding `apps` needs no validator edit. (iteration 4)
- Suspected 005 DoR drift: ruled out. REQ count 12, affected-surface rows 10, `buildBotPrompt` at 315, `parseDecisionMarker` at 432, and the three absences all reproduce. (iteration 5)
- Suspected 006 "grants" consumer drift: ruled out. `status-index.ts`, `delivery.ts` and `status.ts` contain no `grants`, as the plan says. (iteration 5)
- Suspected 006 DoR drift: ruled out. The answer spec at `bots.cjs:73` has an empty options list, the references folder holds one file, and the three item writers are the gate, the answer and the resume stamp. (iteration 5)
- Suspected 011 DoR drift: ruled out. `DELIVERY_CHANNELS` is `['desktop']` at `delivery.ts:45`; the parked entry carries `itemId`; `DECISION_MARKER`/`OPTION_MARKER` are at `dispatch.ts:45-48`; the runner fills `options`; `bots channel list` and `bots chat` both exit 2 today. (iteration 6)
- Suspected token leak in the queue or record: ruled out as written — REQ-014 explicitly forbids the token in the config, a queue entry, a log or a run record, and the value is read from the 008 store at send time. (iteration 6)
- Suspected webhook signature gap: ruled out — REQ-012 verifies `X-Hub-Signature-256` as an HMAC over the raw body in constant time before any parse. (iteration 6)
- Suspected 007 REQ-count drift: ruled out — `grep -c '^| REQ-0'` prints 9. (iteration 7)
- Suspected 007 setup drift: ruled out. python3 3.9.6 is present and prints 14 servers; the `clean` fixture holds `bots/nightly-digest/BOT.md` with `isolation: shared` at line 6; `grep -rc 'apps'` over the lib and checker prints nothing; the executor allowlist has no `UTCP_CONFIG_FILE`; `.opencode/commands/doctor/bots.md` exists. (iteration 7)
- Suspected 008 DoR drift: ruled out again — `posture.secrets` and `SKILLED_BOT_SECRET_` both exit 1, and `secret-unknown` appears in all four docs. (iteration 7)
- Looking for an existing operator identity store: none exists; `operators.json` is named but never built (iteration 6's P0). (iteration 8)
- Suspected runtime auth helper the plans could reuse: ruled out. `actor.ts` does not exist and the plan's `CHK-032` explicitly checks that the runtime has no sign-in. (iteration 8)
- Suspected sandbox cap in repo config: ruled out. `repo-config.ts` has no sandbox key; the definition's `sandbox` is the only input, and `posture.ts` accepts all three modes. (iteration 8)
- Looking for a revocation surface in 003 or 011: none exists. (iteration 9)
- Suspected chat path offers `always`: ruled out. 011 sends the item's own options; it has no fixed always choice, so the persistence promise is terminal-only today. (iteration 9)
- Suspected existing grant store: ruled out. No module, verb or state file names a grant store; 006 explicitly defers it. (iteration 9)
- Suspected dispatch-receipt leak: ruled out. `buildReceiptFacts` records only command, args, cwd, executor and iteration; the environment is not persisted, and the vault passes the value through `dispatchEnv`, not argv, so the receipt carries no value. (iteration 10)
- Suspected run-master-secret leak: ruled out by the module's own containment guarantee (in-memory only, never env/argv/disk). (iteration 10)
- Suspected other status-key additions: ruled out. 001 leaves `status.ts` unchanged; 002 adds a row-state value, not a key, and leaves the index unchanged; 006 prints a text column on the inbox line; 011 adds no status field. (iteration 11)
- Suspected status-json shape drift in 004: ruled out — AC-005 explicitly keeps the row key set unchanged apart from the two new `lastRun` keys. (iteration 11)
- Suspected 009 citation drift: ruled out. Every symbol and count resolves exactly, including the three inventory sets. (iteration 12)
- Suspected 010 citation drift: ruled out. `drainQueue`, `DrainInput`, `listInbox`, `finalAnswerText`, the `completed` outcome and the empty `conversation` baseline all reproduce. (iteration 12)
- Suspected 010 duplicate-message gap: ruled out — the message id is the queue event id, so a duplicate is refused as `duplicate` (the plan's own test). (iteration 12)

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
- Frontier size: 6 nodes (0 open, 0 active, 4 answered, 2 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 5
- Budget depth1: 7 of 6.5 iterations spent
- Budget depth2: 4 of 4.55 iterations spent
- Budget depth3: 0 of 2.5 iterations spent

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
