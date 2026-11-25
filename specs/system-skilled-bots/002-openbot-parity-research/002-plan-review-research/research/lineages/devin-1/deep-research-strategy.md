---
title: Deep Research Strategy - OpenBot parity build-readiness review (lineage devin-1)
description: Strategy packet for the devin-1 fan-out lineage reviewing the eleven planned phases of 003-openbot-parity-build for build readiness, on the plan-versus-runtime and security frontier nodes.
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Tracking

## 2. TOPIC

Build-readiness review of the eleven planned phases of packet `specs/system-skilled-bots/003-openbot-parity-build` (001-activity-and-actor, 002-routine-layer, 003-terminal-screen, 004-computer-exposure, 005-memory, 006-approval-grants, 007-per-bot-apps, 008-vault, 009-skills, 010-conversations, 011-messaging-channels). Each phase has `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md`. They were written in parallel, each alone, and nobody has checked them against the built runtime or against each other. This is a review of plans, not new design research.

Evidence surface (read-only): the phase docs; the built skilled-bots runtime (`.skilled/skills/system-skilled-bots/runtime/lib/`, `.skilled/bin/bots.cjs`, `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs`, `runtime/tests/`); the parity research synthesis `specs/system-skilled-bots/002-openbot-parity-research/research/research.md`; the reference repos under `specs/system-skilled-bots/context/`.

Four review angles:
1. Plan versus runtime: do the files, functions, records, fields and verbs each plan names exist with the shapes it assumes, and are its test and verify commands runnable here?
2. Cross-phase consistency: do the phases agree on shared records (`by:` actor, grants, `operators.json`, conversation JSONL, memory files, state-root layout, `HonoredPosture` fields, `bots --json` output read by the terminal screen and the channels), and are the build order and dependencies sound?
3. Parity gaps and overbuild: for a small team, what is still missing after all eleven phases, and what do the plans build that is not needed or duplicates another phase or the runtime?
4. Security and failure modes: secret leakage, token storage, spoofed chat users, who may approve, restarts, lost or duplicated messages and answers, concurrent approvals from terminal and chat, prompt injection through memory, skills or chat, routine `until` and fatigue edge cases.

Every finding must name the phase, the doc and line, the evidence with `[SOURCE: path:line]`, a severity (P0 blocks the build, P1 wrong or missing, P2 polish) and the exact spec edit that fixes it. The run ends with findings grouped by phase and ranked, plus a cross-phase conflict list.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Plan versus runtime: do the files, functions, records, fields and CLI verbs each of the eleven phase plans names exist in the built runtime with the shapes the plan assumes, and are the test and verify commands in every tasks.md and acceptance-criteria.md runnable here (vitest paths, cargo for the Rust screen)? List every mismatch.
- [x] Security: in the vault (008), apps (007), approvals (006), memory (005) and channels (011) plans, where can secrets leak into prompts, logs, run records or chat, how are tokens stored, and can a spoofed or unlinked chat user approve or read?
- [x] Who is allowed to answer a needs-you item, and can a chat sender be linked to the operator before any approval is honored across the 006, 011 and 001 plans?
- [x] How is a standing grant listed, revoked or expired once a rule store exists, and what stops an `always` grant from becoming permanent silent authority?
- [x] Do the secret scans cover child transcripts and logs written outside the run folder, such as an executor's own session store, or only the run folder the plan scans?
- [x] Do the eleven plans agree on the `bots status --json` key set that phase 003's header and phase 004's lastRun fields both extend, and does any phase add a key without updating the terminal screen's parser?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Not new design research: no new feature proposals beyond what the eleven phase plans already claim.
- Not implementation: no code, spec, plan or task file outside this lineage directory is modified; findings are reported, not applied.
- Not a re-run of the parity research (`002-openbot-parity-research`): its synthesis is evidence, not a topic to re-derive.
- Not a general audit of the whole repository; scope is the eleven phase plans plus the runtime surface they name.

---

## 5. STOP CONDITIONS

- Iteration cap reached (`max-iterations`, 13 iterations) — this run's configured stop policy.
- All bound frontier nodes answered or drained.
- Unrecoverable state corruption or a failed append-gateway receipt (status `error`).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Who is allowed to answer a needs-you item, and can a chat sender be linked to the operator before any approval is honored across the 006, 011 and 001 plans?
- How is a standing grant listed, revoked or expired once a rule store exists, and what stops an `always` grant from becoming permanent silent authority?
- Do the secret scans cover child transcripts and logs written outside the run folder, such as an executor's own session store, or only the run folder the plan scans?
- Do the eleven plans agree on the `bots status --json` key set that phase 003's header and phase 004's lastRun fields both extend, and does any phase add a key without updating the terminal screen's parser?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- probing the live CLI first made the 001 measured-behavior block cheap to confirm, and reading the exact cited line ranges turned three suspected drifts into verified non-findings; the plans' line citations are unusually accurate. (iteration 1)
- reading the spec's residual-risk table before the tasks caught the argv exposure as a designed-in risk rather than an oversight, which made the finding precise instead of speculative. (iteration 2)
- running `readlink` on the `.opencode` entries settled the copy-versus-symlink question in one call and turned a suspicion into a cross-phase contradiction; the same probe also validated phase 004's claim. (iteration 3)
- reading `state-root.ts`'s mode constant before judging the vault turned "0600 protects the secret" into a precise statement of what it protects against, which is the strongest finding so far. (iteration 4)
- grepping all eleven phases for one pattern (`npx tsc`) turned a single-phase finding into a systemic one with an exact edit list, which is more useful to the builder than four separate reports. (iteration 5)
- searching the whole packet for `operators.json` in one call showed the file is named by three phases and created by none, which is the strongest possible form of a missing-dependency finding. (iteration 6)
- running 008's DoD command instead of reading it found an exit-2 refusal that no amount of prose review would have surfaced; the checker's own message is the evidence. (iteration 7)
- reading `posture.ts` for the sandbox values turned a theoretical self-approval into a reachable path, because a BOT.md can request `danger-full-access` and no config caps it. (iteration 8)
- comparing the terminal overlay's labels with the scope list found the promise/effect gap without needing the rule store to exist. (iteration 9)
- following the child's stdout to `stdout.log` made the fixture/scan contradiction concrete; without that path the two statements look compatible. (iteration 10)
- reading the `StatusRow` union showed the header's count is wrong unless filtered, which is a parser bug the key-set question would otherwise miss. (iteration 11)
- checking the three inventory count sets against `rg -c` in one call confirmed 009 was written against the runtime; the only gap left is the trust boundary, not a citation. (iteration 12)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the failed first read of `001/tasks.md` came from a mistyped path (`system-skills-bots`); re-copying the lineage path fixed it. Cost one call. (iteration 1)
- assuming `$RUN/record.json` existed cost one verification call; the record path is a state-root path, and the check now stands as a finding. (iteration 2)
- piping `bots ui` through `head` hid its exit code on the first probe, so the refusal was re-run unpiped; the mistake cost one call and is worth avoiding in later CLI probes. (iteration 3)
- nothing failed this pass; the 007 citations were exact and cheap to confirm. (iteration 4)
- iteration 2's finding 5 trusted the spec's requirement table without reading 006's tasks; the tasks had the migration rule all along. The correction is recorded, and the lesson is to read tasks before declaring a missing rule. (iteration 5)
- nothing failed; the channel plan's security requirements are unusually complete on tokens and signatures, so the gaps that remain are structural (roster, concurrency) rather than accidental. (iteration 6)
- nothing failed; 007's setup probes are exact and cheap to confirm, which is a sign the phase was written against the runtime rather than from memory. (iteration 7)
- nothing failed; the three plans are individually explicit about having no auth, which made the cross-phase conclusion clean. (iteration 8)
- nothing failed. (iteration 9)
- nothing failed. (iteration 10)
- nothing failed. (iteration 11)
- nothing failed. (iteration 12)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Looking for a revocation surface in 003 or 011: none exists. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Looking for a revocation surface in 003 or 011: none exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a revocation surface in 003 or 011: none exists.

### Looking for an existing operator identity store: none exists; `operators.json` is named but never built (iteration 6's P0). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Looking for an existing operator identity store: none exists; `operators.json` is named but never built (iteration 6's P0).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an existing operator identity store: none exists; `operators.json` is named but never built (iteration 6's P0).

### No dead ends this iteration; every citation checked resolved. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No dead ends this iteration; every citation checked resolved.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No dead ends this iteration; every citation checked resolved.

### No dead ends; every citation and probe resolved. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No dead ends; every citation and probe resolved.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No dead ends; every citation and probe resolved.

### No dead ends; every cited symbol and refusal resolved. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No dead ends; every cited symbol and refusal resolved.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No dead ends; every cited symbol and refusal resolved.

### No dead ends. -- BLOCKED (iteration 12, 7 attempts)
- What was tried: No dead ends.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No dead ends.

### Running the full vitest suite was not attempted: it writes caches and temp fixtures outside this lineage, which this run forbids. Runnability was established statically (`vitest` present in `node_modules/.bin`, `test` script declared, every named test file present). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Running the full vitest suite was not attempted: it writes caches and temp fixtures outside this lineage, which this run forbids. Runnability was established statically (`vitest` present in `node_modules/.bin`, `test` script declared, every named test file present).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running the full vitest suite was not attempted: it writes caches and temp fixtures outside this lineage, which this run forbids. Runnability was established statically (`vitest` present in `node_modules/.bin`, `test` script declared, every named test file present).

### Suspected `bots secret set --value` already accepted: ruled out. The CLI has no `secret` verb at all, so the DoR refusal reproduces. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Suspected `bots secret set --value` already accepted: ruled out. The CLI has no `secret` verb at all, so the DoR refusal reproduces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected `bots secret set --value` already accepted: ruled out. The CLI has no `secret` verb at all, so the DoR refusal reproduces.

### Suspected 001 contradiction between Definition of Ready (`SCHEMA_VERSION` prints `'2'`) and the affected-surface verification (`'3'`): ruled out. The first is the pre-change baseline, the second the post-change check, and `status-index.ts:55` currently holds `'2'`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Suspected 001 contradiction between Definition of Ready (`SCHEMA_VERSION` prints `'2'`) and the affected-surface verification (`'3'`): ruled out. The first is the pre-change baseline, the second the post-change check, and `status-index.ts:55` currently holds `'2'`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected 001 contradiction between Definition of Ready (`SCHEMA_VERSION` prints `'2'`) and the affected-surface verification (`'3'`): ruled out. The first is the pre-change baseline, the second the post-change check, and `status-index.ts:55` currently holds `'2'`.

### Suspected 002 citation drift: ruled out. `parseTrigger` is at `definition.ts:142`, `schedulePeriodSeconds` at `slot-accounting.ts:102`, `identityStatePaths` at `state-root.ts:117-132`, `runPrecheck` at `runner.ts:535`, the `disabled` read at `runner.ts:822`, `SWITCH_KINDS` at `switches.ts:25`, and the `disabled`/`paused` reads at `installer.ts:547-548`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Suspected 002 citation drift: ruled out. `parseTrigger` is at `definition.ts:142`, `schedulePeriodSeconds` at `slot-accounting.ts:102`, `identityStatePaths` at `state-root.ts:117-132`, `runPrecheck` at `runner.ts:535`, the `disabled` read at `runner.ts:822`, `SWITCH_KINDS` at `switches.ts:25`, and the `disabled`/`paused` reads at `installer.ts:547-548`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected 002 citation drift: ruled out. `parseTrigger` is at `definition.ts:142`, `schedulePeriodSeconds` at `slot-accounting.ts:102`, `identityStatePaths` at `state-root.ts:117-132`, `runPrecheck` at `runner.ts:535`, the `disabled` read at `runner.ts:822`, `SWITCH_KINDS` at `switches.ts:25`, and the `disabled`/`paused` reads at `installer.ts:547-548`.

### Suspected 002 inventory miscounts in the "Required inventories" block: ruled out. `rg -c 'trigger'` returns exactly definition.ts:14, slot-accounting.ts:5, installer.ts:5, request-queue.ts:3, runner.ts:2, repo-config.ts:1, and the switch-consumer count returns switches.ts:4, installer.ts:3, runner.ts:3, bots.cjs:2, as written. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Suspected 002 inventory miscounts in the "Required inventories" block: ruled out. `rg -c 'trigger'` returns exactly definition.ts:14, slot-accounting.ts:5, installer.ts:5, request-queue.ts:3, runner.ts:2, repo-config.ts:1, and the switch-consumer count returns switches.ts:4, installer.ts:3, runner.ts:3, bots.cjs:2, as written.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected 002 inventory miscounts in the "Required inventories" block: ruled out. `rg -c 'trigger'` returns exactly definition.ts:14, slot-accounting.ts:5, installer.ts:5, request-queue.ts:3, runner.ts:2, repo-config.ts:1, and the switch-consumer count returns switches.ts:4, installer.ts:3, runner.ts:3, bots.cjs:2, as written.

### Suspected 005 DoR drift: ruled out. REQ count 12, affected-surface rows 10, `buildBotPrompt` at 315, `parseDecisionMarker` at 432, and the three absences all reproduce. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Suspected 005 DoR drift: ruled out. REQ count 12, affected-surface rows 10, `buildBotPrompt` at 315, `parseDecisionMarker` at 432, and the three absences all reproduce.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected 005 DoR drift: ruled out. REQ count 12, affected-surface rows 10, `buildBotPrompt` at 315, `parseDecisionMarker` at 432, and the three absences all reproduce.

### Suspected 005 missing migration: ruled out for `kind` — T016 explicitly reads a missing `kind` as `decision`; the gap is only 006's `grants`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Suspected 005 missing migration: ruled out for `kind` — T016 explicitly reads a missing `kind` as `decision`; the gap is only 006's `grants`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected 005 missing migration: ruled out for `kind` — T016 explicitly reads a missing `kind` as `decision`; the gap is only 006's `grants`.

### Suspected 006 "grants" consumer drift: ruled out. `status-index.ts`, `delivery.ts` and `status.ts` contain no `grants`, as the plan says. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Suspected 006 "grants" consumer drift: ruled out. `status-index.ts`, `delivery.ts` and `status.ts` contain no `grants`, as the plan says.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected 006 "grants" consumer drift: ruled out. `status-index.ts`, `delivery.ts` and `status.ts` contain no `grants`, as the plan says.

### Suspected 006 DoR drift: ruled out. The answer spec at `bots.cjs:73` has an empty options list, the references folder holds one file, and the three item writers are the gate, the answer and the resume stamp. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Suspected 006 DoR drift: ruled out. The answer spec at `bots.cjs:73` has an empty options list, the references folder holds one file, and the three item writers are the gate, the answer and the resume stamp.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected 006 DoR drift: ruled out. The answer spec at `bots.cjs:73` has an empty options list, the references folder holds one file, and the three item writers are the gate, the answer and the resume stamp.

### Suspected 006 rollback error (like the 001 one): ruled out. `validateNeedsYouItem` rejects unknown keys, so an item carrying `grants` really is unreadable after a revert. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Suspected 006 rollback error (like the 001 one): ruled out. `validateNeedsYouItem` rejects unknown keys, so an item carrying `grants` really is unreadable after a revert.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected 006 rollback error (like the 001 one): ruled out. `validateNeedsYouItem` rejects unknown keys, so an item carrying `grants` really is unreadable after a revert.

### Suspected 007 citation drift: ruled out. `.utcp_config.json` holds 14 names; the Code Mode lookup is at `dist/index.js:327`; `EXECUTOR_COMMON_ENV_ALLOWLIST` is at `executor-audit.ts:150` and has no `UTCP_CONFIG_FILE`; `HonoredPosture` has four fields and no `apps`; `HARD_INVARIANTS` has no `apps-unknown-server`; the `clean` fixture exists and `apps-unknown-server` is a create task; `.claude/mcp.json:9` and the two doctor lines carry the pin; `status-index.ts` has no `posture` string. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Suspected 007 citation drift: ruled out. `.utcp_config.json` holds 14 names; the Code Mode lookup is at `dist/index.js:327`; `EXECUTOR_COMMON_ENV_ALLOWLIST` is at `executor-audit.ts:150` and has no `UTCP_CONFIG_FILE`; `HonoredPosture` has four fields and no `apps`; `HARD_INVARIANTS` has no `apps-unknown-server`; the `clean` fixture exists and `apps-unknown-server` is a create task; `.claude/mcp.json:9` and the two doctor lines carry the pin; `status-index.ts` has no `posture` string.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected 007 citation drift: ruled out. `.utcp_config.json` holds 14 names; the Code Mode lookup is at `dist/index.js:327`; `EXECUTOR_COMMON_ENV_ALLOWLIST` is at `executor-audit.ts:150` and has no `UTCP_CONFIG_FILE`; `HonoredPosture` has four fields and no `apps`; `HARD_INVARIANTS` has no `apps-unknown-server`; the `clean` fixture exists and `apps-unknown-server` is a create task; `.claude/mcp.json:9` and the two doctor lines carry the pin; `status-index.ts` has no `posture` string.

### Suspected 007 record-validator change: ruled out. `validateRunRecord` checks the posture group's shape, not its keys, so adding `apps` needs no validator edit. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Suspected 007 record-validator change: ruled out. `validateRunRecord` checks the posture group's shape, not its keys, so adding `apps` needs no validator edit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected 007 record-validator change: ruled out. `validateRunRecord` checks the posture group's shape, not its keys, so adding `apps` needs no validator edit.

### Suspected 007 REQ-count drift: ruled out — `grep -c '^| REQ-0'` prints 9. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Suspected 007 REQ-count drift: ruled out — `grep -c '^| REQ-0'` prints 9.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected 007 REQ-count drift: ruled out — `grep -c '^| REQ-0'` prints 9.

### Suspected 007 setup drift: ruled out. python3 3.9.6 is present and prints 14 servers; the `clean` fixture holds `bots/nightly-digest/BOT.md` with `isolation: shared` at line 6; `grep -rc 'apps'` over the lib and checker prints nothing; the executor allowlist has no `UTCP_CONFIG_FILE`; `.opencode/commands/doctor/bots.md` exists. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Suspected 007 setup drift: ruled out. python3 3.9.6 is present and prints 14 servers; the `clean` fixture holds `bots/nightly-digest/BOT.md` with `isolation: shared` at line 6; `grep -rc 'apps'` over the lib and checker prints nothing; the executor allowlist has no `UTCP_CONFIG_FILE`; `.opencode/commands/doctor/bots.md` exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected 007 setup drift: ruled out. python3 3.9.6 is present and prints 14 servers; the `clean` fixture holds `bots/nightly-digest/BOT.md` with `isolation: shared` at line 6; `grep -rc 'apps'` over the lib and checker prints nothing; the executor allowlist has no `UTCP_CONFIG_FILE`; `.opencode/commands/doctor/bots.md` exists.

### Suspected 008 DoR drift: ruled out again — `posture.secrets` and `SKILLED_BOT_SECRET_` both exit 1, and `secret-unknown` appears in all four docs. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Suspected 008 DoR drift: ruled out again — `posture.secrets` and `SKILLED_BOT_SECRET_` both exit 1, and `secret-unknown` appears in all four docs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected 008 DoR drift: ruled out again — `posture.secrets` and `SKILLED_BOT_SECRET_` both exit 1, and `secret-unknown` appears in all four docs.

### Suspected 008 DoR drift: ruled out. `posture.secrets` and `SKILLED_BOT_SECRET_` both exit 1; `state-root.ts` and `run-record.ts` contain no `secrets`/`secretsUsed`; `assertDispatchEnvAllowed` is at `executor-audit.ts:1508` and refuses with "is not allowed for" at 1513; the runner literal check is at `runner.ts:942` and the delivery check at `delivery.ts:291`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Suspected 008 DoR drift: ruled out. `posture.secrets` and `SKILLED_BOT_SECRET_` both exit 1; `state-root.ts` and `run-record.ts` contain no `secrets`/`secretsUsed`; `assertDispatchEnvAllowed` is at `executor-audit.ts:1508` and refuses with "is not allowed for" at 1513; the runner literal check is at `runner.ts:942` and the delivery check at `delivery.ts:291`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected 008 DoR drift: ruled out. `posture.secrets` and `SKILLED_BOT_SECRET_` both exit 1; `state-root.ts` and `run-record.ts` contain no `secrets`/`secretsUsed`; `assertDispatchEnvAllowed` is at `executor-audit.ts:1508` and refuses with "is not allowed for" at 1513; the runner literal check is at `runner.ts:942` and the delivery check at `delivery.ts:291`.

### Suspected 009 citation drift: ruled out. Every symbol and count resolves exactly, including the three inventory sets. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Suspected 009 citation drift: ruled out. Every symbol and count resolves exactly, including the three inventory sets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected 009 citation drift: ruled out. Every symbol and count resolves exactly, including the three inventory sets.

### Suspected 010 citation drift: ruled out. `drainQueue`, `DrainInput`, `listInbox`, `finalAnswerText`, the `completed` outcome and the empty `conversation` baseline all reproduce. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Suspected 010 citation drift: ruled out. `drainQueue`, `DrainInput`, `listInbox`, `finalAnswerText`, the `completed` outcome and the empty `conversation` baseline all reproduce.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected 010 citation drift: ruled out. `drainQueue`, `DrainInput`, `listInbox`, `finalAnswerText`, the `completed` outcome and the empty `conversation` baseline all reproduce.

### Suspected 010 duplicate-message gap: ruled out — the message id is the queue event id, so a duplicate is refused as `duplicate` (the plan's own test). -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Suspected 010 duplicate-message gap: ruled out — the message id is the queue event id, so a duplicate is refused as `duplicate` (the plan's own test).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected 010 duplicate-message gap: ruled out — the message id is the queue event id, so a duplicate is refused as `duplicate` (the plan's own test).

### Suspected 011 DoR drift: ruled out. `DELIVERY_CHANNELS` is `['desktop']` at `delivery.ts:45`; the parked entry carries `itemId`; `DECISION_MARKER`/`OPTION_MARKER` are at `dispatch.ts:45-48`; the runner fills `options`; `bots channel list` and `bots chat` both exit 2 today. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Suspected 011 DoR drift: ruled out. `DELIVERY_CHANNELS` is `['desktop']` at `delivery.ts:45`; the parked entry carries `itemId`; `DECISION_MARKER`/`OPTION_MARKER` are at `dispatch.ts:45-48`; the runner fills `options`; `bots channel list` and `bots chat` both exit 2 today.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected 011 DoR drift: ruled out. `DELIVERY_CHANNELS` is `['desktop']` at `delivery.ts:45`; the parked entry carries `itemId`; `DECISION_MARKER`/`OPTION_MARKER` are at `dispatch.ts:45-48`; the runner fills `options`; `bots channel list` and `bots chat` both exit 2 today.

### Suspected chat path offers `always`: ruled out. 011 sends the item's own options; it has no fixed always choice, so the persistence promise is terminal-only today. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Suspected chat path offers `always`: ruled out. 011 sends the item's own options; it has no fixed always choice, so the persistence promise is terminal-only today.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected chat path offers `always`: ruled out. 011 sends the item's own options; it has no fixed always choice, so the persistence promise is terminal-only today.

### Suspected citation drift in 003: ruled out. `bots ui` exits 2; `.opencode/bin/bots.cjs` and `.opencode/skills/system-skilled-bots/SKILL.md` exist; `.github/workflows/bots-runtime.yml` exists; `.gitignore` has no `crates` entry; the openhuman `app.rs` patterns match at lines 301 and 359. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Suspected citation drift in 003: ruled out. `bots ui` exits 2; `.opencode/bin/bots.cjs` and `.opencode/skills/system-skilled-bots/SKILL.md` exist; `.github/workflows/bots-runtime.yml` exists; `.gitignore` has no `crates` entry; the openhuman `app.rs` patterns match at lines 301 and 359.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected citation drift in 003: ruled out. `bots ui` exits 2; `.opencode/bin/bots.cjs` and `.opencode/skills/system-skilled-bots/SKILL.md` exist; `.github/workflows/bots-runtime.yml` exists; `.gitignore` has no `crates` entry; the openhuman `app.rs` patterns match at lines 301 and 359.

### Suspected citation drift in 004: ruled out. `checkoutLine` at `dispatch.ts:306`, `buildBotPrompt` at 315, `runner.ts:1038` exact, `summarizeRecord` at `status-index.ts:266`, `status.ts:479` exact, `branch: string | null` at `run-record.ts:156`, and both `.opencode` entries are relative symlinks as 004 states. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Suspected citation drift in 004: ruled out. `checkoutLine` at `dispatch.ts:306`, `buildBotPrompt` at 315, `runner.ts:1038` exact, `summarizeRecord` at `status-index.ts:266`, `status.ts:479` exact, `branch: string | null` at `run-record.ts:156`, and both `.opencode` entries are relative symlinks as 004 states.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected citation drift in 004: ruled out. `checkoutLine` at `dispatch.ts:306`, `buildBotPrompt` at 315, `runner.ts:1038` exact, `summarizeRecord` at `status-index.ts:266`, `status.ts:479` exact, `branch: string | null` at `run-record.ts:156`, and both `.opencode` entries are relative symlinks as 004 states.

### Suspected dispatch-receipt leak: ruled out. `buildReceiptFacts` records only command, args, cwd, executor and iteration; the environment is not persisted, and the vault passes the value through `dispatchEnv`, not argv, so the receipt carries no value. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Suspected dispatch-receipt leak: ruled out. `buildReceiptFacts` records only command, args, cwd, executor and iteration; the environment is not persisted, and the vault passes the value through `dispatchEnv`, not argv, so the receipt carries no value.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected dispatch-receipt leak: ruled out. `buildReceiptFacts` records only command, args, cwd, executor and iteration; the environment is not persisted, and the vault passes the value through `dispatchEnv`, not argv, so the receipt carries no value.

### Suspected existing grant store: ruled out. No module, verb or state file names a grant store; 006 explicitly defers it. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Suspected existing grant store: ruled out. No module, verb or state file names a grant store; 006 explicitly defers it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected existing grant store: ruled out. No module, verb or state file names a grant store; 006 explicitly defers it.

### Suspected missing crate workspace: ruled out. No root `Cargo.toml` exists, so the standalone manifest path 003 uses is valid. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Suspected missing crate workspace: ruled out. No root `Cargo.toml` exists, so the standalone manifest path 003 uses is valid.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected missing crate workspace: ruled out. No root `Cargo.toml` exists, so the standalone manifest path 003 uses is valid.

### Suspected other status-key additions: ruled out. 001 leaves `status.ts` unchanged; 002 adds a row-state value, not a key, and leaves the index unchanged; 006 prints a text column on the inbox line; 011 adds no status field. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Suspected other status-key additions: ruled out. 001 leaves `status.ts` unchanged; 002 adds a row-state value, not a key, and leaves the index unchanged; 006 prints a text column on the inbox line; 011 adds no status field.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected other status-key additions: ruled out. 001 leaves `status.ts` unchanged; 002 adds a row-state value, not a key, and leaves the index unchanged; 006 prints a text column on the inbox line; 011 adds no status field.

### Suspected run-master-secret leak: ruled out by the module's own containment guarantee (in-memory only, never env/argv/disk). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Suspected run-master-secret leak: ruled out by the module's own containment guarantee (in-memory only, never env/argv/disk).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected run-master-secret leak: ruled out by the module's own containment guarantee (in-memory only, never env/argv/disk).

### Suspected runtime auth helper the plans could reuse: ruled out. `actor.ts` does not exist and the plan's `CHK-032` explicitly checks that the runtime has no sign-in. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Suspected runtime auth helper the plans could reuse: ruled out. `actor.ts` does not exist and the plan's `CHK-032` explicitly checks that the runtime has no sign-in.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected runtime auth helper the plans could reuse: ruled out. `actor.ts` does not exist and the plan's `CHK-032` explicitly checks that the runtime has no sign-in.

### Suspected sandbox cap in repo config: ruled out. `repo-config.ts` has no sandbox key; the definition's `sandbox` is the only input, and `posture.ts` accepts all three modes. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Suspected sandbox cap in repo config: ruled out. `repo-config.ts` has no sandbox key; the definition's `sandbox` is the only input, and `posture.ts` accepts all three modes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected sandbox cap in repo config: ruled out. `repo-config.ts` has no sandbox key; the definition's `sandbox` is the only input, and `posture.ts` accepts all three modes.

### Suspected status-json shape drift in 004: ruled out — AC-005 explicitly keeps the row key set unchanged apart from the two new `lastRun` keys. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Suspected status-json shape drift in 004: ruled out — AC-005 explicitly keeps the row key set unchanged apart from the two new `lastRun` keys.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected status-json shape drift in 004: ruled out — AC-005 explicitly keeps the row key set unchanged apart from the two new `lastRun` keys.

### Suspected token leak in the queue or record: ruled out as written — REQ-014 explicitly forbids the token in the config, a queue entry, a log or a run record, and the value is read from the 008 store at send time. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Suspected token leak in the queue or record: ruled out as written — REQ-014 explicitly forbids the token in the config, a queue entry, a log or a run record, and the value is read from the 008 store at send time.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected token leak in the queue or record: ruled out as written — REQ-014 explicitly forbids the token in the config, a queue entry, a log or a run record, and the value is read from the 008 store at send time.

### Suspected toolchain gap: ruled out. `cargo 1.92.0`, `clippy 0.1.92` and `rustfmt 1.8.0-stable` are installed, matching 003's stated "cargo 1.92.0" and making its DoD runnable. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Suspected toolchain gap: ruled out. `cargo 1.92.0`, `clippy 0.1.92` and `rustfmt 1.8.0-stable` are installed, matching 003's stated "cargo 1.92.0" and making its DoD runnable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected toolchain gap: ruled out. `cargo 1.92.0`, `clippy 0.1.92` and `rustfmt 1.8.0-stable` are installed, matching 003's stated "cargo 1.92.0" and making its DoD runnable.

### Suspected webhook signature gap: ruled out — REQ-012 verifies `X-Hub-Signature-256` as an HMAC over the raw body in constant time before any parse. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Suspected webhook signature gap: ruled out — REQ-012 verifies `X-Hub-Signature-256` as an HMAC over the raw body in constant time before any parse.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suspected webhook signature gap: ruled out — REQ-012 verifies `X-Hub-Signature-256` as an HMAC over the raw body in constant time before any parse.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Prior work exists and is the evidence surface, not prior context to recover:

- Phase packet docs: `specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor` through `011-messaging-channels`, each with `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`.
- Built runtime: `.skilled/skills/system-skilled-bots/runtime/lib/`, `.skilled/bin/bots.cjs`, `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs`, `.skilled/skills/system-skilled-bots/runtime/tests/`.
- Parity synthesis: `specs/system-skilled-bots/002-openbot-parity-research/research/research.md`.
- Reference repos: `specs/system-skilled-bots/context/{OpenBot-main,OpenMausBot-main,rakazo-main,openhuman-main,OpenGhost-main,hermes-muse-main,turnstone-main,buzz-main,tinychannels-main}`.
- `resource-map.md not present; skipping coverage gate`.

### Bounded Context Snapshot

- Source pointers: `bots.cjs` CLI verbs, runtime `lib/` modules for routine, memory, approvals, vault, skills, conversations, channels; `bot-check.cjs` verification entry point.
- Reuse candidates: existing runtime records and CLI output shapes that the phase plans must match.
- Integration points: `bots --json` output consumed by the terminal screen and the channels; state-root layout; shared record schemas.
- Constraints and risks: docs written in parallel without cross-review; runtime may already implement a subset; review must not modify anything outside this lineage.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 13
- Convergence threshold: 0.05 (telemetry only; stop policy is max-iterations)
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue` through `--extend=N` and `--extend-minutes=M` (live)
- Deferred lifecycle branch: `fork` (not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `specs/system-skilled-bots/003-openbot-parity-build/research/lineages/devin-1/inbox.jsonl`
- Current generation: 1
- Started: 2026-11-25T14:06:54Z
