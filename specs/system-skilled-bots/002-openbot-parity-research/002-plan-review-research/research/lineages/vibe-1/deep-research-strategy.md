---
title: Deep Research Strategy - OpenBot Parity Build Readiness (vibe-1)
description: Strategy packet for the build-readiness review of the eleven planned phases of specs/system-skilled-bots/003-openbot-parity-build.
trigger_phrases:
  - "openbot parity build readiness"
  - "cross-phase review"
  - "plan versus runtime"
importance_tier: normal
contextType: planning
version: 1.14.3.0
---

# Deep Research Strategy - OpenBot Parity Build Readiness (vibe-1)

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for this research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** populated from the fan-out dispatch context.
- **Per iteration:** the agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration.

### Question Injection Surface

`specs/system-skilled-bots/003-openbot-parity-build/research/lineages/vibe-1/inbox.jsonl` holds the frontier rows dealt to this lineage. The reducer reads the inbox on every reduce step.

---

## 2. TOPIC

Build-readiness review of the eleven planned phases of packet specs/system-skilled-bots/003-openbot-parity-build (001-activity-and-actor, 002-routine-layer, 003-terminal-screen, 004-computer-exposure, 005-memory, 006-approval-grants, 007-per-bot-apps, 008-vault, 009-skills, 010-conversations, 011-messaging-channels). Each phase has spec.md, plan.md, tasks.md and acceptance-criteria.md. They were written in parallel, each alone, and nobody has checked them against the built runtime or against each other. This is a review of plans, not new design research.

Evidence (read-only): the phase docs; the built skilled-bots runtime (.skilled/skills/system-skilled-bots/runtime/lib/, .skilled/bin/bots.cjs, .skilled/skills/system-skilled-bots/scripts/bot-check.cjs, runtime/tests/); the parity research synthesis specs/system-skilled-bots/002-openbot-parity-research/research/research.md; the reference repos under specs/system-skilled-bots/context/.

Four angles: (1) plan versus runtime; (2) cross-phase consistency and build order; (3) parity gaps and overbuild; (4) security and failure modes.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Cross-phase interfaces and order: does the bots --json output the terminal screen (003) and the channels (011) read match what 001, 002, 006 and 010 promise to emit, and is the build order and dependency list in the parent spec sound?
- [x] Does the approval answer contract survive a restart and a replayed press across the terminal, chat and channel surfaces, and does the grant survive with it?
- [x] Do 004, 005, 007, 008 and 009 extend the run record and the status index without breaking the schemaVersion 1 validator or the closed FIELD_GROUPS list?
- [x] Who may approve: does 011's operators.json roster agree with 001's actor precedence and 006's ladder, and what happens when a channel actor and a terminal actor answer the same item?
- [x] Are the phase verify commands runnable in this checkout, and does the crate path 003 fixes collide with the .opencode mirror rule or the CI workflow it edits?
- [x] Does the memory block 005 prepends to the prompt create a second injection path, and does its secret-literal check cover a fact a bot proposes through a needs-you item?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- New design research for the eleven phases; this run reviews plans that already exist.
- Implementing any fix. Findings only; implementation is a separate follow-up step.
- Re-litigating the parity research synthesis in specs/system-skilled-bots/002-openbot-parity-research/research/research.md.

---

## 5. STOP CONDITIONS

- `stopPolicy: max-iterations` — the loop runs all 13 iterations; convergence is telemetry only.
- Terminal synthesis record must carry `stopReason: maxIterationsReached`.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Cross-phase interfaces and order: does the bots --json output the terminal screen (003) and the channels (011) read match what 001, 002, 006 and 010 promise to emit, and is the build order and dependency list in the parent spec sound?
- Does the approval answer contract survive a restart and a replayed press across the terminal, chat and channel surfaces, and does the grant survive with it?
- Do 004, 005, 007, 008 and 009 extend the run record and the status index without breaking the schemaVersion 1 validator or the closed FIELD_GROUPS list?
- Who may approve: does 011's operators.json roster agree with 001's actor precedence and 006's ladder, and what happens when a channel actor and a terminal actor answer the same item?
- Are the phase verify commands runnable in this checkout, and does the crate path 003 fixes collide with the .opencode mirror rule or the CI workflow it edits?
- Does the memory block 005 prepends to the prompt create a second injection path, and does its secret-literal check cover a fact a bot proposes through a needs-you item?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the producer's requirement table beside the consumer's requirement table, then checking the named field in the runtime, turned three vague "do they agree" questions into exact line-level mismatches. The runtime is the tiebreaker, and it settled 011's `options` claim in 011's favour and 003's `--scope` gap against 003. (iteration 1)
- reading the idempotency comparison before reading 006's scope rule made the scope gap obvious in one line. The runtime's own refusal vocabulary (`item-answered-differently`) is the exact hook the fix needs, so the finding arrives with its edit. (iteration 2)
- reading the validator before the phases inverted the node's premise. The record is permissive, so the interesting question became "what else do these five phases share", and the prompt builder and the answer path are the answer. (iteration 3)
- reading the write path for a lock, rather than reading the three phases for a policy, found the race in one pass. A policy question about "who may approve" is answered by the code that performs the approval, not by the prose that describes it. (iteration 4)
- `ls -la .opencode/` answered the mirror question in one call and turned three phases' task lists into no-ops. A filesystem fact beats a convention statement every time. (iteration 5)
- reading 009 beside 005 turned a vague "is this safe" question into a diff. 009 reserves an id, wraps the body and pins the revision; 005 does none of the three, and each absence is a finding with an exact edit borrowed from the sibling. (iteration 6)
- starting from the parity synthesis's own small-team and reuse sections gave a checklist the phases could be tested against, and the notices table was the one place where the parent and the children could be compared line by line. That comparison produced two findings from one grep. (iteration 7)
- reading the phase's own risk table and open questions first turned up the two places where the phase had already seen the problem and chosen the weaker answer, which is where the highest-value findings were. The man page settled the argv question in one command. (iteration 8)
- reading the phase's Out of Scope before its requirements showed that the phase had already found the pin problem and stopped at the wrong conclusion. Comparing the pin's relative path with the child's working directory produced the missed alternative in one step. (iteration 9)
- following the parked run from `bots chat` through `answer.ts` to the drain showed the one path the phase does not touch. The phase's own REQ-007 names the question and stops there, which is exactly where the answer should start. (iteration 10)
- reading the Out of Scope first showed the phase's own standard — "refuse it by name rather than ignoring it" — and then checking REQ-001 and REQ-009 against that standard found the non-cron case in one comparison. The fatigue finding came from following the item the phase raises into the hold check that already exists. (iteration 11)
- reading REQ-001's definition of `action` beside REQ-002's classifier showed that the classifier's input is bot-authored text. That is a one-line comparison and it is the highest-severity finding of the iteration. (iteration 12)
- grepping the fixture path across all eleven phases answered the ownership question in one command, and the asymmetry between 010 listing it and 001, 002 and 006 not listing it is the finding. The same grep shape found the missing `chmod`. (iteration 13)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- grepping for `--scope` across all eleven phases returned nothing outside 006, which first looked like a missing dependency rather than a missing consumer. The cause is that 003 and 011 were written before 006 existed, so neither could cite it. (iteration 1)
- my first pass assumed 008's risk row was a correct description of the gate. Reading `assertDispatchEnvAllowed` showed an exact-match list, which turns a "widen it" instruction into an unimplementable one. The lesson is that a risk row's mitigation needs the same line-level check as a requirement. (iteration 2)
- iteration 2's claim that neither env filter admits a prefix was an overclaim from reading one function. Reading `isAllowedExecutorEnvKey` in full showed the prefix branch. The cost is a correction, which is cheaper than a wrong fix in the packet. (iteration 3)
- I expected 011 to pass the linked actor into the answer and searched for `--as` in 011; it is absent. The absence is the finding, and it took a second grep to be sure it was not spelled another way. (iteration 4)
- I nearly accepted 003's "mirrors wholesale" phrasing because the parent spec repeats the same idea. The symlink listing is the only evidence that settles it, and 004 had already found it. (iteration 5)
- my first pass read 005 alone and concluded the design was careful, because every requirement is well written. The gaps are only visible against the phase that solved the same problem better. (iteration 6)
- the first pass looked for a missing capability by scanning phase titles, which found nothing because every title maps to a ranked item. The gap only appeared when the synthesis's §12 was read as a requirement list rather than as background. (iteration 7)
- the first pass looked for a missing refusal and found the matrix complete. The leak was not a missing refusal but a false claim in a requirement, which only appeared when the requirement was checked against where the runtime actually writes. (iteration 8)
- the first pass assumed the phase had modified the wrong allowlist, which would have made every `apps:` run fail at dispatch. Reading `buildGuardEnv` and `buildExecutorDispatchEnv` showed the parent-env path is the one 007 uses, so the gate is right and the finding was wrong. Checking the mechanism before writing the finding is what saved it. (iteration 9)
- the first pass expected `bots chat` to write its own answer record and looked for a duplicate writer. The `requestIds` filter shows the opposite, so the finding became the missing append rather than a duplicated one. (iteration 10)
- the first pass looked for a floor gap and found none, because the floor is correctly scoped to cron. The productive question was not "is the floor right" but "what does the phase do with a start it cannot honor". (iteration 11)
- the first pass looked for a missing rung and found five values for four rungs, which looked like a defect until the edge cases showed `rung: bot` is the degenerate case. The enum is right and the requirement's coverage is wrong. (iteration 12)
- the first pass expected the workflow to lack the crate's path entries and found them specified. The real gap was the verify's strength, which only shows when the task's command is read as a test rather than as a description. (iteration 13)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Counting tasks as a size measure on its own: 007 has 20 tasks and 20 checks, so the count was used only where a phase's own scope boundary corroborated the size. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Counting tasks as a size measure on its own: 007 has 20 tasks and 20 checks, so the count was used only where a phase's own scope boundary corroborated the size.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting tasks as a size measure on its own: 007 has 20 tasks and 20 checks, so the count was used only where a phase's own scope boundary corroborated the size.

### Looking for a `.opencode` mirror row that cannot be done: iteration 5 recorded that the tree is symlinked, and 003's two mirror rows are the same no-op. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Looking for a `.opencode` mirror row that cannot be done: iteration 5 recorded that the tree is symlinked, and 003's two mirror rows are the same no-op.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a `.opencode` mirror row that cannot be done: iteration 5 recorded that the tree is symlinked, and 003's two mirror rows are the same no-op.

### Looking for a `bots answer` roster check in 006: 006's ladder is a precedence order over action kinds, not an actor check, and it defers the roster by name. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Looking for a `bots answer` roster check in 006: 006's ladder is a precedence order over action kinds, not an actor check, and it defers the roster by name.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a `bots answer` roster check in 006: 006's ladder is a precedence order over action kinds, not an actor check, and it defers the roster by name.

### Looking for a `bots chat` path that writes its own answer record instead of reusing the queue: the phase adds a `requestIds` filter to `request-drain.ts` so one message runs through the same claim and routing path. That is the reuse the focus asked about, and it is correct. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Looking for a `bots chat` path that writes its own answer record instead of reusing the queue: the phase adds a `requestIds` filter to `request-drain.ts` so one message runs through the same claim and routing path. That is the reuse the focus asked about, and it is correct.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a `bots chat` path that writes its own answer record instead of reusing the queue: the phase adds a `requestIds` filter to `request-drain.ts` so one message runs through the same claim and routing path. That is the reuse the focus asked about, and it is correct.

### Looking for a `completed` switch that a run can clear itself: the switch is cleared by `bots enable` only, which is the intended one-way latch. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Looking for a `completed` switch that a run can clear itself: the switch is cleared by `bots enable` only, which is the intended one-way latch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a `completed` switch that a run can clear itself: the switch is cleared by `bots enable` only, which is the intended one-way latch.

### Looking for a child-side rewrite of `<runFolder>/utcp.json`: the child can write it, but the child's own config is pinned elsewhere, so the rewrite changes nothing it reads. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Looking for a child-side rewrite of `<runFolder>/utcp.json`: the child can write it, but the child's own config is pinned elsewhere, so the rewrite changes nothing it reads.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a child-side rewrite of `<runFolder>/utcp.json`: the child can write it, but the child's own config is pinned elsewhere, so the rewrite changes nothing it reads.

### Looking for a conversation-scoped approval grant: 010 defers it to 006 by name [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:106], and 006 owns the `grants` field. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Looking for a conversation-scoped approval grant: 010 defers it to 006 by name [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:106], and 006 owns the `grants` field.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a conversation-scoped approval grant: 010 defers it to 006 by name [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:106], and 006 owns the `grants` field.

### Looking for a crate that copies openhuman code: REQ-002 refuses it by grep and the licence is MIT [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:162]. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Looking for a crate that copies openhuman code: REQ-002 refuses it by grep and the licence is MIT [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:162].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a crate that copies openhuman code: REQ-002 refuses it by grep and the licence is MIT [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:162].

### Looking for a floor gap on a non-cron start: a queue or git-hook start is demand-driven rather than a standing instruction, so the 15-minute floor applies to cron alone and the phase's reading matches the research's. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Looking for a floor gap on a non-cron start: a queue or git-hook start is demand-driven rather than a standing instruction, so the 15-minute floor applies to cron alone and the phase's reading matches the research's.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a floor gap on a non-cron start: a queue or git-hook start is demand-driven rather than a standing instruction, so the 15-minute floor applies to cron alone and the phase's reading matches the research's.

### Looking for a grant that outlives its item: the phase states that `always` is recorded on the item and read by the resumed prompt, not by a later item [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:104]. That is iteration 2's finding and it is already recorded. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Looking for a grant that outlives its item: the phase states that `always` is recorded on the item and read by the resumed prompt, not by a later item [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:104]. That is iteration 2's finding and it is already recorded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a grant that outlives its item: the phase states that `always` is recorded on the item and read by the resumed prompt, not by a later item [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:104]. That is iteration 2's finding and it is already recorded.

### Looking for a locked-keychain path: the matrix already covers an unreadable store and the refusal is named `secret-store-unreadable` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:220]. No finding. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Looking for a locked-keychain path: the matrix already covers an unreadable store and the refusal is named `secret-store-unreadable` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:220]. No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a locked-keychain path: the matrix already covers an unreadable store and the refusal is named `secret-store-unreadable` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:220]. No finding.

### Looking for a mirror script that copies `.skilled/` into `.opencode/`: there is none, because the tree is symlinked. The "wholesale mirror" phrasing in 003 and in the parent's own conventions describes a mechanism the repository does not use. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for a mirror script that copies `.skilled/` into `.opencode/`: there is none, because the tree is symlinked. The "wholesale mirror" phrasing in 003 and in the parent's own conventions describes a mechanism the repository does not use.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a mirror script that copies `.skilled/` into `.opencode/`: there is none, because the tree is symlinked. The "wholesale mirror" phrasing in 003 and in the parent's own conventions describes a mechanism the repository does not use.

### Looking for a missed-window replay: slot accounting already skips rather than replays, and the phase leaves it unchanged [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:118]. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Looking for a missed-window replay: slot accounting already skips rather than replays, and the phase leaves it unchanged [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:118].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a missed-window replay: slot accounting already skips rather than replays, and the phase leaves it unchanged [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:118].

### Looking for a missing `by` on a chat message: REQ-003 carries it, and 001's actor resolver fills it. No finding. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Looking for a missing `by` on a chat message: REQ-003 carries it, and 001's actor resolver fills it. No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a missing `by` on a chat message: REQ-003 carries it, and 001's actor resolver fills it. No finding.

### Looking for a missing `deny` path: `deny` is one of the four answers and needs no kind, so an `other` item can always be refused. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Looking for a missing `deny` path: `deny` is one of the four answers and needs no kind, so an `other` item can always be refused.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a missing `deny` path: `deny` is one of the four answers and needs no kind, so an `other` item can always be refused.

### Looking for a missing path entry: the two entries are one per trigger list, which is what the workflow needs, and `crates/bots-tui/**` covers the lock file. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Looking for a missing path entry: the two entries are one per trigger list, which is what the workflow needs, and `crates/bots-tui/**` covers the lock file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a missing path entry: the two entries are one per trigger list, which is what the workflow needs, and `crates/bots-tui/**` covers the lock file.

### Looking for a missing refusal on a malformed config: the risk row already names `utcp-config-missing` and `utcp-config-invalid` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:179]. No finding. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Looking for a missing refusal on a malformed config: the risk row already names `utcp-config-missing` and `utcp-config-invalid` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:179]. No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a missing refusal on a malformed config: the risk row already names `utcp-config-missing` and `utcp-config-invalid` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:179]. No finding.

### Looking for a phase that builds the 0770 mode under another name: none does. 005, 008, 010 and 011 all create their own folders 0700/0600, which is the opposite direction. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Looking for a phase that builds the 0770 mode under another name: none does. 005, 008, 010 and 011 all create their own folders 0700/0600, which is the opposite direction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a phase that builds the 0770 mode under another name: none does. 005, 008, 010 and 011 all create their own folders 0700/0600, which is the opposite direction.

### Looking for a place where the runtime writes the child environment to disk: `dispatchEnv` is passed to the audited runner and never recorded, so the leak is the child's own output, not the runtime's bookkeeping. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Looking for a place where the runtime writes the child environment to disk: `dispatchEnv` is passed to the audited runner and never recorded, so the leak is the child's own output, not the runtime's bookkeeping.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a place where the runtime writes the child environment to disk: `dispatchEnv` is passed to the audited runner and never recorded, so the leak is the child's own output, not the runtime's bookkeeping.

### Looking for a record-level allowlist that would reject `apps` or `secretsUsed`: there is none. The only strict list is `DISPATCH_ENV_KEYS` on the executor side, which is a different surface. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a record-level allowlist that would reject `apps` or `secretsUsed`: there is none. The only strict list is `DISPATCH_ENV_KEYS` on the executor side, which is a different surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a record-level allowlist that would reject `apps` or `secretsUsed`: there is none. The only strict list is `DISPATCH_ENV_KEYS` on the executor side, which is a different surface.

### Looking for a rotation path: the value is resolved once before dispatch and the child keeps it, so a rotation mid-run changes nothing for that run and the next run resolves the new value. No finding. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Looking for a rotation path: the value is resolved once before dispatch and the child keeps it, so a rotation mid-run changes nothing for that run and the next run resolves the new value. No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a rotation path: the value is resolved once before dispatch and the child keeps it, so a rotation mid-run changes nothing for that run and the next run resolves the new value. No finding.

### Looking for a rules store that rung 2 needs: `approval-ladder.ts` is a pure function over four inputs, so the strictest-rule rule is testable with an injected list and the phase says so [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:59]. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Looking for a rules store that rung 2 needs: `approval-ladder.ts` is a pure function over four inputs, so the strictest-rule rule is testable with an injected list and the phase says so [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:59].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a rules store that rung 2 needs: `approval-ladder.ts` is a pure function over four inputs, so the strictest-rule rule is testable with an injected list and the phase says so [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:59].

### Looking for a sanitizer in the runtime that already strips control characters from a question: there is none on the item path, so the fix has to be added. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Looking for a sanitizer in the runtime that already strips control characters from a question: there is none on the item path, so the fix has to be added.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a sanitizer in the runtime that already strips control characters from a question: there is none on the item path, so the fix has to be added.

### Looking for a schema-version requirement in 007 or 008: neither names `schemaVersion`, and the record validator treats the posture object as an object rather than a closed field list, so an added field needs no bump. No finding. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Looking for a schema-version requirement in 007 or 008: neither names `schemaVersion`, and the record validator treats the posture object as an object rather than a closed field list, so an added field needs no bump. No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a schema-version requirement in 007 or 008: neither names `schemaVersion`, and the record validator treats the posture object as an object rather than a closed field list, so an added field needs no bump. No finding.

### Looking for a scope field on `NeedsYouAnswer` in the runtime: the answer object holds `text` and `answeredAt` only [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:24-27], so 006's scope is a new field on a new object, not an extension of an existing one. That is why the idempotency comparison cannot see it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for a scope field on `NeedsYouAnswer` in the runtime: the answer object holds `text` and `answeredAt` only [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:24-27], so 006's scope is a new field on a new object, not an extension of an existing one. That is why the idempotency comparison cannot see it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a scope field on `NeedsYouAnswer` in the runtime: the answer object holds `text` and `answeredAt` only [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:24-27], so 006's scope is a new field on a new object, not an extension of an existing one. That is why the idempotency comparison cannot see it.

### Looking for a second language toolchain problem: the local toolchain exists and the phase confirms it in T002, so the only toolchain gap is the CI step, which iteration 5 recorded. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Looking for a second language toolchain problem: the local toolchain exists and the phase confirms it in T002, so the only toolchain gap is the CI step, which iteration 5 recorded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a second language toolchain problem: the local toolchain exists and the phase confirms it in T002, so the only toolchain gap is the CI step, which iteration 5 recorded.

### Looking for a second writer to the conversation file inside the runtime: the CLI is the only writer, and the drain appends nothing today, which is finding 1 rather than a race. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Looking for a second writer to the conversation file inside the runtime: the CLI is the only writer, and the drain appends nothing today, which is finding 1 rather than a race.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a second writer to the conversation file inside the runtime: the CLI is the only writer, and the drain appends nothing today, which is finding 1 rather than a race.

### Looking for a secret in the grant: NFR-S02 states a grant is a kind, a phrase, a rung and a scope and never a credential [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:204]. No finding. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Looking for a secret in the grant: NFR-S02 states a grant is a kind, a phrase, a rung and a scope and never a credential [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:204]. No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a secret in the grant: NFR-S02 states a grant is a kind, a phrase, a rung and a scope and never a credential [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:204]. No finding.

### Looking for a way a bot could forge `HonoredPosture.apps`: the runner writes it from the resolved names after the refusal, so the record cannot claim a server the filter dropped. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Looking for a way a bot could forge `HonoredPosture.apps`: the runner writes it from the resolved names after the refusal, so the record cannot claim a server the filter dropped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a way a bot could forge `HonoredPosture.apps`: the runner writes it from the resolved names after the refusal, so the record cannot claim a server the filter dropped.

### Looking for a way a routine fires twice from one cron start: `starts[0]` renders into the single `trigger` the installer and slot accounting already read, so one start is one schedule. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Looking for a way a routine fires twice from one cron start: `starts[0]` renders into the single `trigger` the installer and slot accounting already read, so one start is one schedule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a way a routine fires twice from one cron start: `starts[0]` renders into the single `trigger` the installer and slot accounting already read, so one start is one schedule.

### Looking for an actor input on the ladder: iteration 4 recorded that the ladder has none, and 011's roster is the phase that would supply it. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Looking for an actor input on the ladder: iteration 4 recorded that the ladder has none, and 011's roster is the phase that would supply it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an actor input on the ladder: iteration 4 recorded that the ladder has none, and 011's roster is the phase that would supply it.

### Looking for an existing lock primitive on the item path: the runtime has a run lease and a queue lease, and neither covers the item file. The fix has to add one. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for an existing lock primitive on the item path: the runtime has a run lease and a queue lease, and neither covers the item file. The fix has to add one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an existing lock primitive on the item path: the runtime has a run lease and a queue lease, and neither covers the item file. The fix has to add one.

### Looking for an unrunnable verify command: `cargo` and `rustc` are installed here, so `cargo test`, `cargo clippy` and `cargo fmt --check` run in this checkout. The gap is the CI job, not the local commands. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Looking for an unrunnable verify command: `cargo` and `rustc` are installed here, so `cargo test`, `cargo clippy` and `cargo fmt --check` run in this checkout. The gap is the CI job, not the local commands.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an unrunnable verify command: `cargo` and `rustc` are installed here, so `cargo test`, `cargo clippy` and `cargo fmt --check` run in this checkout. The gap is the CI job, not the local commands.

### Reading 005's memory file format for its own sake: the format is bounded and clear; the finding is where the block sits in the prompt, not how it is stored. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Reading 005's memory file format for its own sake: the format is bounded and clear; the finding is where the block sits in the prompt, not how it is stored.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading 005's memory file format for its own sake: the format is bounded and clear; the finding is where the block sits in the prompt, not how it is stored.

### Reading 005's memory file format for this node: 005 touches no record and no index field, so its only interface here is the prompt builder. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reading 005's memory file format for this node: 005 touches no record and no index field, so its only interface here is the prompt builder.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading 005's memory file format for this node: 005 touches no record and no index field, so its only interface here is the prompt builder.

### Reading 008's acceptance criteria line by line for a missing case: the criteria follow the requirements, so a requirement gap shows up as a criterion gap and the requirement is the place to fix. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Reading 008's acceptance criteria line by line for a missing case: the criteria follow the requirements, so a requirement gap shows up as a criterion gap and the requirement is the place to fix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading 008's acceptance criteria line by line for a missing case: the criteria follow the requirements, so a requirement gap shows up as a criterion gap and the requirement is the place to fix.

### Reading 011's transports for the roster check: the check is one function in `channel-link.ts`, and the transports only call it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Reading 011's transports for the roster check: the check is one function in `channel-link.ts`, and the transports only call it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading 011's transports for the roster check: the check is one function in `channel-link.ts`, and the transports only call it.

### Reading 011's transports for wire-protocol correctness: the question is about the answer contract, and the transports' own conformance rules (REQ-017) are a separate concern. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reading 011's transports for wire-protocol correctness: the question is about the answer contract, and the transports' own conformance rules (REQ-017) are a separate concern.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading 011's transports for wire-protocol correctness: the question is about the answer contract, and the transports' own conformance rules (REQ-017) are a separate concern.

### Reading the reference repos again for this angle: the parity synthesis already carries the per-repo evidence with citations, and every claim here resolved against the packet and the runtime instead. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Reading the reference repos again for this angle: the parity synthesis already carries the per-repo evidence with citations, and every claim here resolved against the packet and the runtime instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the reference repos again for this angle: the parity synthesis already carries the per-repo evidence with citations, and every claim here resolved against the packet and the runtime instead.

### Reading the reference repos for this node: the question is about this packet's own contracts, and every claim resolved against the built runtime instead. Deferred to the parity-gap angle. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading the reference repos for this node: the question is about this packet's own contracts, and every claim resolved against the built runtime instead. Deferred to the parity-gap angle.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the reference repos for this node: the question is about this packet's own contracts, and every claim resolved against the built runtime instead. Deferred to the parity-gap angle.

### Running the runtime suite to prove the commands work: it writes temporary state roots outside this lineage's write surface, so I verified the entry points and the installed binaries instead. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Running the runtime suite to prove the commands work: it writes temporary state roots outside this lineage's write surface, so I verified the entry points and the installed binaries instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running the runtime suite to prove the commands work: it writes temporary state roots outside this lineage's write surface, so I verified the entry points and the installed binaries instead.

### Searching for a written `bots activity --json` row schema anywhere in the packet: no phase, plan or acceptance criterion enumerates the row fields. The gap is real, not a missed document. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a written `bots activity --json` row schema anywhere in the packet: no phase, plan or acceptance criterion enumerates the row fields. The gap is real, not a missed document.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a written `bots activity --json` row schema anywhere in the packet: no phase, plan or acceptance criterion enumerates the row fields. The gap is real, not a missed document.

### Treating 003's "no new JSON contract" claim as evidence that the contracts match: it is a scope statement, not a check, and findings 6 and 8 show the contracts are under-specified rather than absent. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating 003's "no new JSON contract" claim as evidence that the contracts match: it is a scope statement, not a check, and findings 6 and 8 show the contracts are under-specified rather than absent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating 003's "no new JSON contract" claim as evidence that the contracts match: it is a scope statement, not a check, and findings 6 and 8 show the contracts are under-specified rather than absent.

### Treating 009's `<skill_content>` wrapper as sufficient for both phases: it is the right pattern, and 005 does not use it, which is the finding. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating 009's `<skill_content>` wrapper as sufficient for both phases: it is the right pattern, and 005 does not use it, which is the finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating 009's `<skill_content>` wrapper as sufficient for both phases: it is the right pattern, and 005 does not use it, which is the finding.

### Treating 011's restart claim (NFR-R01) as unverified: it is backed by a file written before the I/O, and the runtime's queue already dedupes by request id. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating 011's restart claim (NFR-R01) as unverified: it is backed by a file written before the I/O, and the runtime's queue already dedupes by request id.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating 011's restart claim (NFR-R01) as unverified: it is backed by a file written before the I/O, and the runtime's queue already dedupes by request id.

### Treating the `.opencode` rows as harmless duplication: they are harmless to the build and harmful to the plan, because a task that cannot be done cannot be verified. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the `.opencode` rows as harmless duplication: they are harmless to the build and harmful to the plan, because a task that cannot be done cannot be verified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the `.opencode` rows as harmless duplication: they are harmless to the build and harmful to the plan, because a task that cannot be done cannot be verified.

### Treating the `until` command as a new arbitrary-execution surface: the precheck field already runs `/bin/sh -c` as the operator, and a BOT.md change is refused as `definition-drifted` until re-enabled, so the surface is gated the same way. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Treating the `until` command as a new arbitrary-execution surface: the precheck field already runs `/bin/sh -c` as the operator, and a BOT.md change is refused as `definition-drifted` until re-enabled, so the surface is gated the same way.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the `until` command as a new arbitrary-execution surface: the precheck field already runs `/bin/sh -c` as the operator, and a BOT.md change is refused as `definition-drifted` until re-enabled, so the surface is gated the same way.

### Treating the append-only file as a torn-write risk: REQ-002 skips a torn last line and reports it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:149], and the append is one line. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating the append-only file as a torn-write risk: REQ-002 skips a torn last line and reports it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:149], and the append is one line.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the append-only file as a torn-write risk: REQ-002 skips a torn last line and reports it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:149], and the append is one line.

### Treating the atomic write as sufficient: it makes one write indivisible, not one read-modify-write, which is the operation that races. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the atomic write as sufficient: it makes one write indivisible, not one read-modify-write, which is the operation that races.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the atomic write as sufficient: it makes one write indivisible, not one read-modify-write, which is the operation that races.

### Treating the checker's `apps-unknown-server` as a duplicate of the runner's refusal: `bot-check.cjs` loads the runtime's own predicates through `tsx` and restates no field rule [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:74-77], so the two share one implementation. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating the checker's `apps-unknown-server` as a duplicate of the runner's refusal: `bot-check.cjs` loads the runtime's own predicates through `tsx` and restates no field rule [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:74-77], so the two share one implementation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the checker's `apps-unknown-server` as a duplicate of the runner's refusal: `bot-check.cjs` loads the runtime's own predicates through `tsx` and restates no field rule [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:74-77], so the two share one implementation.

### Treating the closed `FIELD_GROUPS` list as a blocker for new fields: it is a presence check, not an allowlist, and the posture object is validated only as an object. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the closed `FIELD_GROUPS` list as a blocker for new fields: it is a presence check, not an allowlist, and the posture object is validated only as an object.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the closed `FIELD_GROUPS` list as a blocker for new fields: it is a presence check, not an allowlist, and the posture object is validated only as an object.

### Treating the keychain as the safe backend by default: it is the safer store at rest and the less safe one in flight, and the phase's risk row already says so. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating the keychain as the safe backend by default: it is the safer store at rest and the less safe one in flight, and the phase's risk row already says so.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the keychain as the safe backend by default: it is the safer store at rest and the less safe one in flight, and the phase's risk row already says so.

### Treating the parent's notices table as authoritative: it disagrees with five of the eleven phases, so the phases are the evidence and the table is the defect. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating the parent's notices table as authoritative: it disagrees with five of the eleven phases, so the phases are the evidence and the table is the defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the parent's notices table as authoritative: it disagrees with five of the eleven phases, so the phases are the evidence and the table is the defect.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Reading the reference repos for this node: the question is about this packet's own contracts, and every claim resolved against the built runtime instead. Deferred to the parity-gap angle. (iteration 1)
- Searching for a written `bots activity --json` row schema anywhere in the packet: no phase, plan or acceptance criterion enumerates the row fields. The gap is real, not a missed document. (iteration 1)
- Treating 003's "no new JSON contract" claim as evidence that the contracts match: it is a scope statement, not a check, and findings 6 and 8 show the contracts are under-specified rather than absent. (iteration 1)
- Looking for a scope field on `NeedsYouAnswer` in the runtime: the answer object holds `text` and `answeredAt` only [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:24-27], so 006's scope is a new field on a new object, not an extension of an existing one. That is why the idempotency comparison cannot see it. (iteration 2)
- Reading 011's transports for wire-protocol correctness: the question is about the answer contract, and the transports' own conformance rules (REQ-017) are a separate concern. (iteration 2)
- Treating 011's restart claim (NFR-R01) as unverified: it is backed by a file written before the I/O, and the runtime's queue already dedupes by request id. (iteration 2)
- Looking for a record-level allowlist that would reject `apps` or `secretsUsed`: there is none. The only strict list is `DISPATCH_ENV_KEYS` on the executor side, which is a different surface. (iteration 3)
- Reading 005's memory file format for this node: 005 touches no record and no index field, so its only interface here is the prompt builder. (iteration 3)
- Treating the closed `FIELD_GROUPS` list as a blocker for new fields: it is a presence check, not an allowlist, and the posture object is validated only as an object. (iteration 3)
- Looking for an existing lock primitive on the item path: the runtime has a run lease and a queue lease, and neither covers the item file. The fix has to add one. (iteration 4)
- Reading 011's transports for the roster check: the check is one function in `channel-link.ts`, and the transports only call it. (iteration 4)
- Treating the atomic write as sufficient: it makes one write indivisible, not one read-modify-write, which is the operation that races. (iteration 4)
- Looking for a mirror script that copies `.skilled/` into `.opencode/`: there is none, because the tree is symlinked. The "wholesale mirror" phrasing in 003 and in the parent's own conventions describes a mechanism the repository does not use. (iteration 5)
- Running the runtime suite to prove the commands work: it writes temporary state roots outside this lineage's write surface, so I verified the entry points and the installed binaries instead. (iteration 5)
- Treating the `.opencode` rows as harmless duplication: they are harmless to the build and harmful to the plan, because a task that cannot be done cannot be verified. (iteration 5)
- Looking for a sanitizer in the runtime that already strips control characters from a question: there is none on the item path, so the fix has to be added. (iteration 6)
- Reading 005's memory file format for its own sake: the format is bounded and clear; the finding is where the block sits in the prompt, not how it is stored. (iteration 6)
- Treating 009's `<skill_content>` wrapper as sufficient for both phases: it is the right pattern, and 005 does not use it, which is the finding. (iteration 6)
- Counting tasks as a size measure on its own: 007 has 20 tasks and 20 checks, so the count was used only where a phase's own scope boundary corroborated the size. (iteration 7)
- Looking for a `bots answer` roster check in 006: 006's ladder is a precedence order over action kinds, not an actor check, and it defers the roster by name. (iteration 7)
- Looking for a phase that builds the 0770 mode under another name: none does. 005, 008, 010 and 011 all create their own folders 0700/0600, which is the opposite direction. (iteration 7)
- Reading the reference repos again for this angle: the parity synthesis already carries the per-repo evidence with citations, and every claim here resolved against the packet and the runtime instead. (iteration 7)
- Treating the parent's notices table as authoritative: it disagrees with five of the eleven phases, so the phases are the evidence and the table is the defect. (iteration 7)
- Looking for a locked-keychain path: the matrix already covers an unreadable store and the refusal is named `secret-store-unreadable` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:220]. No finding. (iteration 8)
- Looking for a place where the runtime writes the child environment to disk: `dispatchEnv` is passed to the audited runner and never recorded, so the leak is the child's own output, not the runtime's bookkeeping. (iteration 8)
- Looking for a rotation path: the value is resolved once before dispatch and the child keeps it, so a rotation mid-run changes nothing for that run and the next run resolves the new value. No finding. (iteration 8)
- Reading 008's acceptance criteria line by line for a missing case: the criteria follow the requirements, so a requirement gap shows up as a criterion gap and the requirement is the place to fix. (iteration 8)
- Treating the keychain as the safe backend by default: it is the safer store at rest and the less safe one in flight, and the phase's risk row already says so. (iteration 8)
- Looking for a child-side rewrite of `<runFolder>/utcp.json`: the child can write it, but the child's own config is pinned elsewhere, so the rewrite changes nothing it reads. (iteration 9)
- Looking for a missing refusal on a malformed config: the risk row already names `utcp-config-missing` and `utcp-config-invalid` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:179]. No finding. (iteration 9)
- Looking for a schema-version requirement in 007 or 008: neither names `schemaVersion`, and the record validator treats the posture object as an object rather than a closed field list, so an added field needs no bump. No finding. (iteration 9)
- Looking for a way a bot could forge `HonoredPosture.apps`: the runner writes it from the resolved names after the refusal, so the record cannot claim a server the filter dropped. (iteration 9)
- Treating the checker's `apps-unknown-server` as a duplicate of the runner's refusal: `bot-check.cjs` loads the runtime's own predicates through `tsx` and restates no field rule [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:74-77], so the two share one implementation. (iteration 9)
- Looking for a `bots chat` path that writes its own answer record instead of reusing the queue: the phase adds a `requestIds` filter to `request-drain.ts` so one message runs through the same claim and routing path. That is the reuse the focus asked about, and it is correct. (iteration 10)
- Looking for a conversation-scoped approval grant: 010 defers it to 006 by name [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:106], and 006 owns the `grants` field. (iteration 10)
- Looking for a missing `by` on a chat message: REQ-003 carries it, and 001's actor resolver fills it. No finding. (iteration 10)
- Looking for a second writer to the conversation file inside the runtime: the CLI is the only writer, and the drain appends nothing today, which is finding 1 rather than a race. (iteration 10)
- Treating the append-only file as a torn-write risk: REQ-002 skips a torn last line and reports it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:149], and the append is one line. (iteration 10)
- Looking for a `completed` switch that a run can clear itself: the switch is cleared by `bots enable` only, which is the intended one-way latch. (iteration 11)
- Looking for a floor gap on a non-cron start: a queue or git-hook start is demand-driven rather than a standing instruction, so the 15-minute floor applies to cron alone and the phase's reading matches the research's. (iteration 11)
- Looking for a missed-window replay: slot accounting already skips rather than replays, and the phase leaves it unchanged [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:118]. (iteration 11)
- Looking for a way a routine fires twice from one cron start: `starts[0]` renders into the single `trigger` the installer and slot accounting already read, so one start is one schedule. (iteration 11)
- Treating the `until` command as a new arbitrary-execution surface: the precheck field already runs `/bin/sh -c` as the operator, and a BOT.md change is refused as `definition-drifted` until re-enabled, so the surface is gated the same way. (iteration 11)
- Looking for a grant that outlives its item: the phase states that `always` is recorded on the item and read by the resumed prompt, not by a later item [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:104]. That is iteration 2's finding and it is already recorded. (iteration 12)
- Looking for a missing `deny` path: `deny` is one of the four answers and needs no kind, so an `other` item can always be refused. (iteration 12)
- Looking for a rules store that rung 2 needs: `approval-ladder.ts` is a pure function over four inputs, so the strictest-rule rule is testable with an injected list and the phase says so [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:59]. (iteration 12)
- Looking for a secret in the grant: NFR-S02 states a grant is a kind, a phrase, a rung and a scope and never a credential [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:204]. No finding. (iteration 12)
- Looking for an actor input on the ladder: iteration 4 recorded that the ladder has none, and 011's roster is the phase that would supply it. (iteration 12)
- Looking for a `.opencode` mirror row that cannot be done: iteration 5 recorded that the tree is symlinked, and 003's two mirror rows are the same no-op. (iteration 13)
- Looking for a crate that copies openhuman code: REQ-002 refuses it by grep and the licence is MIT [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:162]. (iteration 13)
- Looking for a missing path entry: the two entries are one per trigger list, which is what the workflow needs, and `crates/bots-tui/**` covers the lock file. (iteration 13)
- Looking for a second language toolchain problem: the local toolchain exists and the phase confirms it in T002, so the only toolchain gap is the CI step, which iteration 5 recorded. (iteration 13)
- Looking for an unrunnable verify command: `cargo` and `rustc` are installed here, so `cargo test`, `cargo clippy` and `cargo fmt --check` run in this checkout. The gap is the CI job, not the local commands. (iteration 13)

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
- Do 004, 005, 007, 008 and 009 agree with 001 on the run-record and status-index shapes they extend? (iteration 1)
- Are the test and verify commands in each phase runnable in this checkout (cargo, vitest, jq)? (iteration 1)
- Does 011's `operators.json` roster conflict with 001's actor precedence, and who may approve from a channel versus the terminal? (iteration 1)
- Do 004, 005, 007 and 009 extend the run record and the status index without breaking the schemaVersion 1 validator? (iteration 2)
- Are the phase verify commands runnable in this checkout? (iteration 2)
- Does 005's memory block create a prompt-injection path of its own, and does its secret-literal check cover a fact a bot proposes? (iteration 2)
- Are the phase verify commands runnable in this checkout (cargo, vitest, jq)? (iteration 3)
- What is still missing after all eleven phases for a small team, and what is overbuilt? (iteration 3)
- Does 005's memory block create a prompt-injection path of its own? (iteration 4)
- Does 010's conversation store create a third injection path, and does its transcript framing match 009's wrapper? (iteration 6)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers: `specs/system-skilled-bots/003-openbot-parity-build/{spec.md,plan.md,tasks.md,001-activity-and-actor,002-routine-layer,003-terminal-screen,004-computer-exposure,005-memory,006-approval-grants,007-per-bot-apps,008-vault,009-skills,010-conversations,011-messaging-channels}`; runtime at `.skilled/skills/system-skilled-bots/runtime/lib/`, `.skilled/bin/bots.cjs`, `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs`, `.skilled/skills/system-skilled-bots/runtime/tests/`.
- Reuse candidates: the parity research synthesis at `specs/system-skilled-bots/002-openbot-parity-research/research/research.md`.
- Integration points: `bots --json` output, `operators.json`, grants records, conversation JSONL, memory files, state-root layout, HonoredPosture fields.
- Constraints and risks: all evidence is read-only; no repo tooling that writes may run; findings only.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 13
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue`
- Deferred lifecycle branch: `fork` (not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `specs/system-skilled-bots/003-openbot-parity-build/research/lineages/vibe-1/inbox.jsonl`
- Canonical pause sentinel: `specs/system-skilled-bots/003-openbot-parity-build/research/lineages/vibe-1/.deep-research-pause`
- Current generation: 1
- Started: 2026-11-25T14:06:38.000Z
