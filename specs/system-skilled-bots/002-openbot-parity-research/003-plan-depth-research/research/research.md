# Plan-Depth Review of the OpenBot Parity Build: Synthesis

> **Draft: Codex lineages still running.** This draft folds in the finished `vibe` lineage (10 iterations, 73 findings) and the Codex iterations that had landed by 22:10 UTC on 2026-11-25: `codex-1` iterations 1 and 2, `codex-2` iterations 1 to 3. Five Codex iterations are still to come, and the merged registry and attribution file do not exist yet. Sections 4, 6 and 9 name what may still move.

## 1. How to Read This

**Question.** For each phase of `specs/system-skilled-bots/003-openbot-parity-build/` except the terminal screen, is it planned deeply enough that a builder needs no design decision, and what artifact or child phase closes each gap? Phase `003-terminal-screen` is the depth benchmark and is not a subject.

**Path prefixes used in citations.**

| Prefix | Expands to |
|---|---|
| `B/` | `specs/system-skilled-bots/003-openbot-parity-build/` |
| `L/` | `.skilled/skills/system-skilled-bots/runtime/lib/` |
| `C/` | `specs/system-skilled-bots/context/` |
| `R/` | `specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/` |

**Severity, as I applied it.**

- **P0**: no builder can satisfy the documents as written. Either two phase documents contradict each other, or the phase is too wide to build in one pass at the benchmark depth.
- **P1**: a builder would have to make a design decision the documents do not make.
- **P2**: polish. The answer is recoverable from the documents, or the point is a decided limitation worth one confirming sentence.

This is stricter on P0 than the `vibe` lineage was. It graded 13 findings P0, and I keep one of them at P0, fold one into a P0 of my own, and move the rest to P1 or reject them. Section 7 gives the reason for each.

**Who found what.** `V` is the `vibe` lineage with iteration and finding number, `C1` and `C2` are the Codex lineages, and `S` marks a finding that is my own, from reading the phase documents during this review.

**Why the bar is high.** The parent spec assigns most build work to DeepSeek Flash executors, and reserves the strongest model as a last fallback [SOURCE: B/spec.md:188]. A decision left open is therefore made by the weakest builder on the roster, once per worker.

## 2. Bottom Line

The packet is closer to one-shot ready than its size suggests. Most phases name their files, their refusals and a verify command per task. The remaining gaps fall into four groups.

1. **Three direct contradictions between phase documents.** 005 and 009 disagree on the proposal sentinel. 012 and 001 disagree on the empty `bots inbox --json` shape. 014's setup task and its own fallback rule disagree on a missing executor. Each is cheap to fix and each makes a perfect one-shot build impossible as written.
2. **Two phases with a user-facing surface and no design artifact.** 011 has channel messages and 010 has a chat pane and a chat loop. Neither has a mockup, a key map or a state list, which is the depth 003 now has. Both should become phase parents.
3. **Durable record shapes left to the builder.** The vault's name grammar and environment key mapping, the memory entry line, the routine state file, the channel link, queue and seen records, and the final needs-you item key set.
4. **A closing chain that cannot certify the build.** 012 may close with recorded failures, nothing carries those failures into 014, and 013's evidence sits outside the checkout.

Two phases are ready: 004 and 007.

## 3. Verdict per Phase

| Phase | Verdict | Evidence strength | Largest open item |
|---|---|---|---|
| 001-activity-and-actor | Needs artifacts (small) | Moderate: V1, V4, V5, C1-1 | Final needs-you item key set and answer nullability |
| 002-routine-layer | Needs artifacts (small) | Moderate: V1, V3, C1-1 | Routine state file schema and write rule |
| 004-computer-exposure | Ready | Weak from lineages (one V pass), confirmed by my read | One stale parent line citation |
| 005-memory | Needs artifacts | Strong: V1, V3, C1-1, C2-2 | Entry line grammar and the append versus forget write protocol |
| 006-approval-grants | Needs artifacts (small) | Weak to moderate: V1, V5, C1-1, my read | Lock lifetime rule and the older-reader statement |
| 007-per-bot-apps | Ready, one operator confirmation | Moderate: C2-1, my read. V gave it no real pass | Shared-run residual is decided but worth confirming |
| 008-vault | Needs artifacts (largest addendum) | Strong: V6, C2-1, my read | Name grammar, environment key mapping, keychain read and delete commands |
| 009-skills | Needs artifacts | Moderate: V7, C2-2 | Sentinel contradiction with 005, `--name` default, draft template |
| 010-conversations | Become a phase parent (4 children) | Moderate to strong: V4, V10, C2-2, my read | Chat pane and loop have no design artifact |
| 011-messaging-channels | Become a phase parent (7 children) | Strong: V2, C1-2, my read | Widest phase, five transports, no message design |
| 012-manual-testing-scenarios | Needs artifacts (rules) | Moderate: V7, C2-3, my read | Failure policy, and one contradiction with 001 |
| 013-skilled-and-doc-alignment | Needs artifacts (rules) | Weak to moderate: V8, C2-3 | Evidence location and the handoff receiver |
| 014-deep-review | Needs artifacts (rules) | Moderate: V8, C2-3 | Missing-executor contradiction and its review inputs |

## 4. Gaps per Phase

Each row gives the gap, the evidence, the artifact that closes it and who found it. A status of **confirmed** means I opened the cited lines and the claim would have read differently if it were false. **Inferred** means the claim rests on an absence I searched for.

### 001-activity-and-actor: needs artifacts (small)

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P1 | The final needs-you item key set is listed nowhere. Five phases add six keys to a closed list that refuses unknown keys. | The list is closed and refuses an unknown key [SOURCE: L/needs-you.ts:51-65] [SOURCE: L/needs-you.ts:97-98]. The Shared Records table names owners for `kind` and `grants` only [SOURCE: B/spec.md:126-138]. Confirmed. | One table in `contracts/records.md`: every item key, its owner phase, its landing phase, its absent-key default. | V5-1, C1-1-1 |
| 2 | P1 | An answer written before this phase has no `by` and no `scope`, and the phase states the read rule for the run record only. | The phase adds both keys and validates both [SOURCE: B/001-activity-and-actor/spec.md:117]. The null rule covers `actor` and `answeredBy` on the record [SOURCE: B/001-activity-and-actor/spec.md:193] [SOURCE: B/001-activity-and-actor/spec.md:218]. Today's answer is `{text, answeredAt}` [SOURCE: L/needs-you.ts:24-27]. Confirmed. | One sentence in REQ-004 and REQ-010 fixing what a stored answer without the keys reads as, plus one test row. | V1-3 |
| 3 | P2 | The item lifecycle is derived state whose transitions are spread over 001, 005 and 006. | [SOURCE: L/needs-you.ts:49] [SOURCE: B/006-approval-grants/spec.md:170-171]. Confirmed. | A transition table in `contracts/answer-seam.md`. | V1-7 |
| 4 | P2 | Two `state` vocabularies ship under one key name: the item's three states and the activity row's seven group ids. | [SOURCE: B/001-activity-and-actor/spec.md:152-153]. Confirmed. | One line in `contracts/cli-json.md` naming both. | V4-5 |

Reference code to study first: `C/OpenBot-main/shared/activity-rows.ts`. The file exists. That it is the file 001 lifts is inferred from its name, because 001's documents cite no context path directly.

### 002-routine-layer: needs artifacts (small)

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P1 | The routine state file has three named fields and no schema: no version field, no write rule, no statement of the absent-file default. | Fields are named [SOURCE: B/002-routine-layer/spec.md:126]. The file path is named [SOURCE: B/002-routine-layer/plan.md:62]. A damaged file has a read rule, so recovery is partly covered [SOURCE: B/002-routine-layer/spec.md:224]. No atomic write or version rule appears in spec, plan, tasks or acceptance criteria. Inferred from search. | A `routine-state` section in `contracts/records.md`: keys, `schemaVersion`, write through temp and rename, absent file reads as empty. | V1-4, C1-1-2 |
| 2 | P2 | The `until` observation on the run record names one field. | The record carries `until.met` [SOURCE: B/002-routine-layer/acceptance-criteria.md:59]. Confirmed. | State in REQ-004 that the object is `{met}` and nothing else, or list the other keys. | V1-6 |
| 3 | P2 | The `routines --json` envelope is fixed only inside a verify command and inside a sibling phase. | A bare array, by a `jq 'length == 2'` check [SOURCE: B/002-routine-layer/plan.md:297] and by 003's fixture paragraph [SOURCE: B/003-terminal-screen/spec.md:184]. REQ-007 itself is silent [SOURCE: B/002-routine-layer/spec.md:173]. Confirmed. | One clause in REQ-007. | V1-5, narrowed by me |

002 should not become a phase parent. See section 7.

Reference code to study first: `C/OpenBot-main/docs/routines.md`, which 002 already cites five times, then `C/OpenBot-main/shared/routine-firing.ts`.

### 004-computer-exposure: ready

No builder decision found. The prompt line is given as literal text with its null-branch variant [SOURCE: B/004-computer-exposure/spec.md:143], and each requirement maps to an existing shape in the tree [SOURCE: B/004-computer-exposure/spec.md:161-173]. Confirmed by my own read of the nine requirements.

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P2 | The design reference for the section order points at the wrong parent line. | It cites parent line 130 [SOURCE: B/004-computer-exposure/spec.md:168]. The section order row is at line 134, and line 130 is the inbox row [SOURCE: B/spec.md:130-134]. Confirmed. | Fix the line, or cite the record by name. See cross-cutting gap X5. | S |

Reference code to study first: none in `C/`. The in-tree shapes are `L/dispatch.ts:301-332` and `L/runner.ts:1033-1038`, which 004 names itself.

### 005-memory: needs artifacts

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P1 | The memory entry line has five named fields and no serialization: no example line, no delimiter, no escaping rule, no index rule for `--forget`. | One module owns the line, parser and renderer [SOURCE: B/005-memory/plan.md:60]. The fields are named [SOURCE: B/005-memory/spec.md:146]. The test list names a line whose text holds a pipe, which implies a delimiter nobody wrote down [SOURCE: B/005-memory/plan.md:108]. Inferred from search across all five documents. | A `memory-entry` section in `contracts/records.md`: one literal line, the delimiter, the escape, what a newline in the text becomes, and whether indexes are 1-based and stable after a forget. | V1-2, C1-1-3 |
| 2 | P1 | Append and forget have no write protocol. The shared file has many writers. | Append and forget sit in one module [SOURCE: B/005-memory/plan.md:60-66]. The matrix covers file, entry state and bot key, with no concurrent case [SOURCE: B/005-memory/plan.md:107]. Confirmed for the matrix, inferred for the absence. | Three lines in the plan: append is one `appendFileSync` of one line, forget rewrites through temp and rename, and a torn last line is skipped on read. Add one race test. | C1-1-3, C2-2-1 |
| 3 | P0 | 005's recorded decision says 009 reserves no second sentinel. 009 reserves one. | See 009 gap 1. | Decide once, then amend the losing document. | V7-3 |
| 4 | P2 | The prompt section order is owned by a plan paragraph. | The order is in 005's plan [SOURCE: B/005-memory/plan.md:71] and is also a Shared Records row [SOURCE: B/spec.md:134]. Confirmed. | Move the literal text of each block into `contracts/prompt-sections.md`. | V3-3, downgraded |

Reference code to study first: `C/OpenGhost-main/memory.js`. Its `LIMITS` line is the source of 005's bounds, and its `clean` helper collapses all whitespace to single spaces, which is a ready answer for the newline rule in gap 1.

### 006-approval-grants: needs artifacts (small)

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P1 | The guarded write uses an exclusive lock file with no rule for a lock left behind by a killed process. | Plan, tasks and goal choose the lock file [SOURCE: B/006-approval-grants/plan.md:63] [SOURCE: B/006-approval-grants/tasks.md:62]. No stale, crash or timeout rule appears in spec, plan or tasks. Inferred from search. | One sentence: the lock is created with exclusive create, holds the pid, and is broken when the pid is dead or the file is older than a named bound. One test. | S |
| 2 | P2 | REQ-014 and the parent table still offer two mechanisms where the plan picked one. | Both read "an exclusive lock or a write-if-unchanged check" [SOURCE: B/006-approval-grants/spec.md:171] [SOURCE: B/spec.md:136]. Confirmed. | Reword both to the lock file. | S |
| 3 | P2 | A revert leaves items an older runtime refuses, and the fix is manual. | The rollback says to strip the `grants` key by hand [SOURCE: B/006-approval-grants/plan.md:144-148]. Confirmed. | Covered by the packet rule in cross-cutting gap X3. A child phase is not needed. | C1-1-4, downgraded |
| 4 | P2 | Two keys named `kind` with different vocabularies sit in one payload. | Item `kind` [SOURCE: B/spec.md:131]. Grant `kind` [SOURCE: B/006-approval-grants/spec.md:153]. Confirmed. | One line in `contracts/records.md`. A rename is optional. | V5-3, downgraded |

Reference code to study first: `C/OpenBot-main/shared/tool-name.ts`, the classifier REQ-010 names as lifted, then `C/OpenBot-main/docs/approvals.md`.

### 007-per-bot-apps: ready, one operator confirmation

The module map, the refusal names with their failure class, the environment key handoff and the restore rule are all fixed [SOURCE: B/007-per-bot-apps/spec.md:140-153] [SOURCE: B/007-per-bot-apps/plan.md:60-65]. Confirmed by my own read.

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P2 | A shared run that declares no `apps` records `posture.apps: []` while its child reads the full repository config. | The plan states it [SOURCE: B/007-per-bot-apps/plan.md:68] and tests it on purpose [SOURCE: B/007-per-bot-apps/plan.md:116]. The spec names it as a limit [SOURCE: B/007-per-bot-apps/spec.md:108]. Confirmed. | No planning artifact. One operator confirmation that a record reading `[]` for an unfiltered run is acceptable. | C2-1-1, regraded from P0 |

Reference code to study first: none in `C/`. The in-tree anchor is the dispatch environment gate in `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`.

### 008-vault: needs artifacts (largest addendum)

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P1 | The `secrets` name grammar is referenced in spec, plan, tasks and goal and defined in none. | [SOURCE: B/008-vault/spec.md:150] [SOURCE: B/008-vault/plan.md:65] [SOURCE: B/008-vault/tasks.md:54]. The only datum is one negative case [SOURCE: B/008-vault/acceptance-criteria.md:64]. Confirmed by a search of all five documents. | The pattern as one regex with a length bound, in the spec. | V6-1 |
| 2 | P1 | The mapping from a name to `SKILLED_BOT_SECRET_<NAME>` is shown for one name only. | `demo` maps to `SKILLED_BOT_SECRET_DEMO` [SOURCE: B/008-vault/acceptance-criteria.md:66]. No rule for case, hyphen or dot [SOURCE: B/008-vault/spec.md:152]. Confirmed. | A mapping rule and a collision rule beside the grammar. The simplest is a grammar that makes the mapping an upper-casing only. | V6-2 |
| 3 | P1 | The keychain backend names the write command only. Resolve, read-back and forget each need a command, and the read must not put the value in argv. | Only `add-generic-password` is named [SOURCE: B/008-vault/spec.md:147] [SOURCE: B/008-vault/tasks.md:55]. A search for `find-generic-password` and `delete-generic-password` finds nothing. Inferred from search. | Three command lines in REQ-002 and REQ-004, and the meaning of `--store` on `forget` when it differs from the recorded backend. | V6-7, extended by me |
| 4 | P1 | The index shape is recoverable only from a test command and one prose sentence. | [SOURCE: B/008-vault/acceptance-criteria.md:61] [SOURCE: B/008-vault/plan.md:73]. Confirmed. | An `index.json` section in `contracts/records.md` with `schemaVersion`. | V6-4 |
| 5 | P1 | The index is read, changed and written by `set` and `forget` with no write rule, and a crash between the value write and the index write has no stated outcome. | The matrix has no concurrent or interrupted case [SOURCE: B/008-vault/plan.md:101]. The tree already has the temp and rename pattern [SOURCE: L/request-queue.ts:89-93]. Confirmed for the matrix. | Two sentences: write order, temp and rename for the index, and what a value file with no index entry reads as. | V6-6, C2-1-3 |
| 6 | P1 | The meaning of an existing key changes with no upgrade note. | Today the template says the key is recorded and not enforced [SOURCE: .skilled/skills/system-skilled-bots/assets/bot-template.txt:20-21]. After the phase an unknown name is refused before dispatch [SOURCE: B/008-vault/spec.md:151]. The rollback covers a revert only [SOURCE: B/008-vault/plan.md:151-155]. Confirmed. | One upgrade paragraph in the author reference. | V6-5, regraded from P0 |
| 7 | P2 | Two refusals exist in edge-case prose and in the plan's matrix with no requirement row. | [SOURCE: B/008-vault/spec.md:222-223] [SOURCE: B/008-vault/goal.md:63]. Confirmed. | Two requirement rows and two acceptance rows. | V6-3 |
| 8 | P2 | The redaction token for `stdout.log` and the exit of a withheld run are unstated. | [SOURCE: B/008-vault/spec.md:164]. 010 already fixes `[redacted: <key>]` for its own scan [SOURCE: B/010-conversations/spec.md:170]. Confirmed. | Reuse 010's token in REQ-014. | V6-8 |
| 9 | P2 | Any bot child can read another bot's value file. | Stated and accepted three times [SOURCE: B/008-vault/spec.md:165] [SOURCE: B/008-vault/spec.md:190] [SOURCE: B/008-vault/acceptance-criteria.md:74]. Confirmed. | No planning artifact. One operator confirmation. | C2-1-2, regraded from P0 |

008 should stay one phase. See section 7.

Reference code to study first: `C/rakazo-main/packages/core/src/messages/secret-matcher.ts` and `C/rakazo-main/packages/core/src/node/secrets-guard.ts`, the two files the phase lifts, then `C/rakazo-main/docs/bot-secrets.md`.

### 009-skills: needs artifacts

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P0 | 005 decides that 009 "adds no id of its own". 009 sets the item's `botId` to the reserved `skill-proposals` and adds it to the reserved list. | [SOURCE: B/005-memory/spec.md:265] against [SOURCE: B/009-skills/spec.md:164] and [SOURCE: B/009-skills/spec.md:131]. Confirmed. | Decide once. Either 009 reuses `memory-proposals`, or 005's decision is amended to allow a second sentinel. | V7-3, regraded from P1 |
| 2 | P1 | `bots skill propose <run-id>` with no `--name` is valid and has no stated target name. | The flag is optional [SOURCE: B/009-skills/spec.md:163]. Running without it must exit 0 or 4 [SOURCE: B/009-skills/plan.md:108]. Confirmed. | One sentence in REQ-004. | V7-2 |
| 3 | P1 | The draft `SKILL.md` is built with no model call and has no template. | The plan says only that the draft is built from the record's identity, exit and run folder [SOURCE: B/009-skills/plan.md:82]. Confirmed for the plan line, inferred for the absence. | A literal draft template in the plan, with frontmatter that passes the skill package validator. | V7-5, regraded from P2 |
| 4 | P2 | After an accepted proposal the operator has no written steps to make the skill live. | A runtime copy is out of scope by decision [SOURCE: B/009-skills/spec.md:110]. Confirmed. | Four lines in the run reference: move the draft, commit, run `bots install`, check the pin. | C2-2-2, downgraded |
| 5 | P2 | `proposal.json` key names appear only in a test command. | [SOURCE: B/009-skills/acceptance-criteria.md:60]. Confirmed. | List the five keys in REQ-004 and say that `revisionRead` holds a body digest. | V7-4, downgraded |

Reference code to study first: `C/OpenGhost-main/skills.js` for the wrapper, then `C/OpenBot-main/app/src/lib/skills/proposal.ts` and `C/hermes-muse-main/skills/companion/references/memory.md` for the pin.

### 010-conversations: become a phase parent

The runtime half is well specified. The message record carries a version and every field [SOURCE: B/010-conversations/spec.md:154], the transcript line format and the escape rule are fixed [SOURCE: B/010-conversations/spec.md:152], routing and the bound are fixed [SOURCE: B/010-conversations/spec.md:155] [SOURCE: B/010-conversations/spec.md:165]. The gaps are on the two surfaces a person looks at.

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P1 | The chat pane has no mockup, no state list, no key map and no component row. 003 drew a one-line placeholder for it. | 003's inventory gives Chat one state, `placeholder` [SOURCE: B/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:30]. 010 describes the pane in one requirement and four file rows [SOURCE: B/010-conversations/spec.md:159] [SOURCE: B/010-conversations/spec.md:126-128]. Its key task is verified by finding `Enter` or `Esc` in a file [SOURCE: B/010-conversations/tasks.md:67]. Confirmed. | A `design/` folder in a UX child: frames for empty, loaded, composing, sending, parked, failed and redacted, a key map delta against 003's, and component rows. | V10-6, C2-2-4 |
| 2 | P1 | Sending from the pane runs `bots chat --message`, which blocks for a whole bot run. No requirement says how the pane stays live. | The pane sends through that verb [SOURCE: B/010-conversations/spec.md:159]. 003 records that blocking spawns freeze input and routes reads through a worker thread [SOURCE: B/003-terminal-screen/spec.md:218]. Confirmed for both lines. The gap is inferred. | A `sending` state and the worker rule in the pane contract. | S |
| 3 | P1 | A text entry pane inside a screen with single-key commands needs an input context, and none is defined for the Chat tab. | 003's key map has six exclusive contexts. The Chat tab sits in `main`, which binds tabs, list movement, palette and quit. Typing is bound only in the overlay and palette contexts [SOURCE: B/003-terminal-screen/001-ux-and-component-map/design/key-map.md:25-29]. Confirmed for the lines, inferred for the gap. | A seventh `chat` context row in the key map delta, with its rule for leaving text entry. | S |
| 4 | P2 | The terminal loop's printed form is unstated: prompt string, reply rendering, the wait while a run executes. | The loop is specified by behavior only [SOURCE: B/010-conversations/spec.md:156]. It follows a named reference [SOURCE: B/010-conversations/plan.md:70]. Confirmed. | A short transcript sample in the UX child. | S |
| 5 | P2 | The file grows without bound and rotation is deferred. | A decided deferral [SOURCE: B/010-conversations/spec.md:111] [SOURCE: B/010-conversations/spec.md:198]. Confirmed. | None for the build. | C2-2-3, downgraded |

Reference code to study first: `C/turnstone-main/turnstone/cli.py:176-181` and `:1276-1305` for the loop, which 010 already cites, then `C/openhuman-main/crates/openhuman-tui/src/composer.rs` and `input.rs` for the pane. The second pair exists. Its fit is inferred from the parent spec, which says 003 was written from openhuman-tui's shape [SOURCE: B/spec.md:154].

### 011-messaging-channels: become a phase parent

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P0 | The widest phase is a single Level 2 leaf: 29 file rows, 23 requirements, nine modules, five transports. | [SOURCE: B/011-messaging-channels/spec.md:140-170] [SOURCE: B/011-messaging-channels/spec.md:292-295]. Confirmed. | The seven children in section 6. | V2-1, C1-2-6 |
| 2 | P1 | `declaredCapabilities` has no vocabulary and no per-transport matrix. | [SOURCE: B/011-messaging-channels/spec.md:183] [SOURCE: B/011-messaging-channels/plan.md:66]. The plan defers to the reference's adapter [SOURCE: B/011-messaging-channels/plan.md:77]. Confirmed. | A capability table: one row per capability, one column per transport. | V2-2, C1-2-1 |
| 3 | P1 | The inbound acknowledge boundary is undefined: when a Telegram offset, a Slack envelope, a Signal event or a WhatsApp webhook is acknowledged relative to the durable enqueue. The `seen/` folder is named once with no content. | `seen/` appears only in a file row [SOURCE: B/011-messaging-channels/spec.md:151]. The reference makes this an explicit adapter policy [SOURCE: C/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs:66-68]. Confirmed. | An inbound sequence per transport and a `seen` record schema. | C1-2-2 |
| 4 | P1 | The link record, the queue entry and `channel list --json` have no field list. | [SOURCE: B/011-messaging-channels/spec.md:185] [SOURCE: B/011-messaging-channels/spec.md:195] [SOURCE: B/011-messaging-channels/spec.md:206]. Confirmed. | Three schemas in the contracts child. | V2-3, V2-4, C1-2-3 |
| 5 | P1 | No message a person reads is designed: the approval card, the numbered prompt, the link code exchange, the refusal replies, long questions, expiry. | Behavior only [SOURCE: B/011-messaging-channels/spec.md:189-190]. A search for message text across all five documents finds none. Inferred from search. | A `design/` folder with one mockup per transport and golden text fixtures. | V10-6, C1-2-4 |
| 6 | P1 | Operator prerequisites are a risk table, not a runbook. | [SOURCE: B/011-messaging-channels/spec.md:239-241]. Confirmed. | A setup, preflight and health checklist per transport in the reference document the phase already creates. | V2-7, C1-2-5 |
| 7 | P2 | REQ-017 says five conformance rules in one unnumbered sentence. | [SOURCE: B/011-messaging-channels/spec.md:204]. Confirmed. | Number the five. See section 7 for why this is P2. | V2-5, C1-2-1, downgraded |
| 8 | P2 | The approval index lists its fields and not its key structure. | [SOURCE: B/011-messaging-channels/spec.md:188]. Confirmed. | One line in the approval schema. | V2-6 |

Reference code to study first, in this order. `C/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs` for the contract and the acknowledge policy. `C/tinychannels-main/crates/tinychannels-bus/src/capabilities.rs:164` for the capability vocabulary. `C/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:374-470` for the conformance checks. `C/tinychannels-main/src/delivery/queue.rs` and `policy.rs` for the queue. The phase marks tinychannels as design only and copies none of it [SOURCE: B/011-messaging-channels/spec.md:205]. Do not copy its approval index, which is in memory [SOURCE: C/tinychannels-main/src/approvals/mod.rs:58-70].

### 012-manual-testing-scenarios: needs artifacts (rules)

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P0 | 012 says an empty inbox prints `[]`. 001 and 003 say it prints an object with an `items` array. | [SOURCE: B/012-manual-testing-scenarios/spec.md:261] against [SOURCE: B/001-activity-and-actor/acceptance-criteria.md:56] and [SOURCE: B/003-terminal-screen/004-panes/spec.md:222]. Confirmed. | Fix 012's edge case to `{"items":[]}`. | S |
| 2 | P1 | The phase may close with recorded failures. A failure of the product is filed in a scratch file that no later phase reads. | [SOURCE: B/012-manual-testing-scenarios/spec.md:191] [SOURCE: B/012-manual-testing-scenarios/tasks.md:144]. Confirmed. | A rule: a product failure blocks the close or becomes a named input to 014. | V7-6, C2-3-1 |
| 3 | P1 | The recorded run goes stale. 014 changes the code after 012 ran, and nothing re-runs the corpus. | [SOURCE: B/014-deep-review/spec.md:41] [SOURCE: B/014-deep-review/spec.md:102]. Confirmed. | One task in 014: re-run the scenarios whose phase a fix touched. | V7-8, V8-3 |

Reference to study first: the existing scenario `.skilled/skills/system-skilled-bots/manual-testing-playbook/manual-run/needs-you-park-and-hold.md`, which 012 cites as its model.

### 013-skilled-and-doc-alignment: needs artifacts (rules)

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P1 | Runtime findings are "handed to 014" and 014 lists no such input. | [SOURCE: B/013-skilled-and-doc-alignment/spec.md:112] [SOURCE: B/013-skilled-and-doc-alignment/spec.md:33] against [SOURCE: B/014-deep-review/spec.md:44]. Confirmed. | One file in 013's folder holding the handed findings, named as a 014 input. | V8-1 |
| 2 | P1 | Both reports are written under the user state root, outside the checkout, so the clean close cannot be checked later. | [SOURCE: B/013-skilled-and-doc-alignment/spec.md:54-55]. Confirmed. | Copy the final `report.md` and `findings.json` of each run into the phase folder. | V8-2 |
| 3 | P2 | 013 fixes every finding. 014 leaves P2 open. | [SOURCE: B/013-skilled-and-doc-alignment/spec.md:108] [SOURCE: B/014-deep-review/spec.md:101]. Confirmed. | One sentence stating the difference is intended. | V8-6 |

### 014-deep-review: needs artifacts (rules)

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P0 | Setup requires all five executor binaries. The plan says an absent binary drops its lineage and the next executor takes two. | [SOURCE: B/014-deep-review/tasks.md:43] against [SOURCE: B/014-deep-review/plan.md:219] and [SOURCE: B/014-deep-review/plan.md:183]. Confirmed. | Pick one. The fan-out behind this very research lost a lineage to quota at its first iteration, so the fallback is the live case, not the edge. | C2-3-2 |
| 2 | P1 | 012's results and failure file are not review inputs, so the verdict can read PASS beside a recorded FAIL. | [SOURCE: B/014-deep-review/spec.md:31]. Confirmed. | Add both files to the dependency list and to the verdict rule. | V8-4, C2-3-1 |
| 3 | P2 | No second review follows the fixes. | A stated decision [SOURCE: B/014-deep-review/spec.md:102]. Confirmed. | One operator confirmation. | V8-3 |
| 4 | P2 | The scope check on `git status` does not exempt the review's own output files. | [SOURCE: B/014-deep-review/spec.md:165]. Confirmed. | One clause. | V8-8 |

## 5. Cross-Cutting Gaps

| # | Sev | Gap | Evidence | Closing artifact |
|---|---|---|---|---|
| X1 | P1 | **Shared records have owners and no contents.** The Shared Records table says who fixes a shape and never shows the shape. The final item key set, the answer object, the request record's new key and every new file under the state root are each spread over several phases. | [SOURCE: B/spec.md:122-138]. No schema file exists in the packet. Confirmed by search. | A packet-level `contracts/` folder, described in section 6. |
| X2 | P1 | **`--json` envelopes differ per verb and are fixed in three different kinds of place.** `activity` and `inbox` print an object, `routines` and the chat transcript print a bare array. One of the four is fixed only in a verify command. The 012 contradiction is the first casualty. | [SOURCE: B/003-terminal-screen/spec.md:184] [SOURCE: B/010-conversations/spec.md:157] [SOURCE: B/002-routine-layer/plan.md:297]. The existing verb prints an object and sends human lines to stderr [SOURCE: .skilled/bin/bots.cjs:376-388]. Confirmed. | `contracts/cli-json.md`: the envelope and the empty shape per verb, and the stdout rule. Whether the two arrays change to objects is an operator choice. Stating them is the requirement. |
| X3 | P1 | **Record versioning is uneven.** The run record, the request record and the index carry a version and the phases keep it fixed on purpose. The needs-you item carries none, and five phases add keys to it. The new files in 002, 008, 009 and 011 state no version. 010's message does. | Versions exist [SOURCE: L/run-record.ts:197] [SOURCE: L/request-record.ts:192]. The item list has none [SOURCE: L/needs-you.ts:51-65]. 006 names the older-reader effect [SOURCE: B/006-approval-grants/spec.md:194]. 010 versions its message [SOURCE: B/010-conversations/spec.md:154]. Confirmed. | `contracts/versioning.md`: additive keys keep the version, an absent key reads as its default, every new file carries `schemaVersion: 1`, and one paragraph on what a revert of any item-touching phase requires. |
| X4 | P1 | **New refusals have no single table.** 007 states the failure class of each run refusal. 008, 009 and 011 name refusals with an exit code and no class, and do not say which are run refusals that enter the runner's typed registry and which are verb or parse refusals that do not. | The registry is typed and frozen [SOURCE: L/runner.ts:122-151]. 007 states the class [SOURCE: B/007-per-bot-apps/spec.md:151]. A search of 008 and 011 for a class finds none. Inferred from search. | `contracts/refusals.md`: name, phase, layer (parse, checker, run, verb), failure class, exit code. |
| X5 | P2 | **Line-number citations between phases are already stale.** Phase documents cite parent rows four lines above where they now sit, after the parent gained rows for 012 to 014. | 004 cites line 130 for the section order, now at 134 [SOURCE: B/004-computer-exposure/spec.md:168]. 014 cites line 159 for its own row, now at 165 [SOURCE: B/014-deep-review/spec.md:45]. 010 cites line 133 for the scan cause, now at 137 [SOURCE: B/010-conversations/spec.md:170]. Confirmed. | Cite shared records by name, and let `contracts/` hold the anchors. |
| X6 | P2 | **About 46 citations point at a research folder that has moved.** The earlier research now sits under `002-openbot-parity-research/001-openbot-parity-research/research/`. Every phase from 001 to 011 still cites `002-openbot-parity-research/001-openbot-parity-research/research/`. | The old path is absent in this worktree, and the move is uncommitted. Confirmed by listing. | Rewrite the paths once the move is committed. 013's doc run would otherwise report them. |
| X7 | P1 | **The answer path is assembled from five phases and drawn nowhere.** Order: surface and roster check, lock, identity check, write of answer with `by`, scope and grant, review seam, conversation id stamp, resume request or the no-resume branch. | [SOURCE: B/011-messaging-channels/spec.md:208] [SOURCE: B/006-approval-grants/spec.md:157] [SOURCE: B/005-memory/spec.md:163] [SOURCE: B/010-conversations/spec.md:168] [SOURCE: B/002-routine-layer/spec.md:132]. Confirmed. | `contracts/answer-seam.md` with one numbered sequence. It doubles as the assertion order for the answer tests. |
| X8 | P1 | **Test strategy has no shared contract fixture.** The Rust fixture is a hand-kept copy of each `--json` payload. Only 006 and 010 list it as a file to change. Nothing checks the copy against the Node output. | The copy rule [SOURCE: B/spec.md:133]. 006 and 010 update it [SOURCE: B/006-approval-grants/spec.md:139] [SOURCE: B/010-conversations/spec.md:129]. Confirmed for the lines, inferred for the absence of a check. | One golden file per verb under `contracts/fixtures/`, read by a vitest case and by the crate's fake CLI. |
| X9 | P1 | **The closing chain does not connect.** 012 to 014 and 013 to 014 both hand over something 014 does not list. | See 012 gap 2, 013 gap 1, 014 gap 2. | The three rules already named, written together in one paragraph of the parent's handoff section. |
| X10 | P2 | **No diagram exists outside 003.** | A search for mermaid, sequence diagrams and image files in the other thirteen phases finds none. Inferred from search. | Four sequences in `contracts/`: run, answer, chat turn, channel inbound. |
| X11 | P2 | **No target-state module map or state-root tree.** Each phase names its own modules, folders and README rows. The sum is written nowhere. | Today's map covers existing modules only [SOURCE: L/README.md:21-39]. Today's tree has seven folders [SOURCE: L/state-root.ts:117-131]. Confirmed. | `contracts/module-map.md` and `contracts/state-root.md`. |

## 6. Ranked Expansion Plan

The order is the order to plan in. The build order of the phases does not change.

### Step 1: settle three contradictions and four confirmations

This is an hour of editing and it removes every P0 except the width of 011.

| Item | Decision needed | Documents to change |
|---|---|---|
| Proposal sentinel | One sentinel or two | 005 decision or 009 REQ-005 and its `label.ts` row |
| Empty inbox shape | Already decided by 001 | 012 edge case |
| Missing executor in 014 | Hard prerequisite or fallback | 014 task T003, definition of ready, acceptance row |
| Operator confirmations | 007 shared-run record, 008 same-user boundary, 014 no second review, array or object for `routines` and chat | One line each in the phase's risk table |

### Step 2: add `contracts/` at the packet root

A folder, not a fifteenth phase. It holds what several phases cite, the way 003's `design/` holds what its children cite. Write it before 001 builds, because every addendum in step 5 is shorter once it exists.

| File | Holds | Closes |
|---|---|---|
| `contracts/records.md` | Final needs-you item and answer key sets with owner and landing phase. Run record additions per phase. Request record additions. One section per new state file: routine state, memory entry line, secrets index, `proposal.json`, conversation message, channel config, link, approval, queue and seen records, roster. | X1, 001-1, 001-2, 002-1, 005-1, 008-4, 009-5 |
| `contracts/cli-json.md` | Envelope and empty shape per verb. Stdout carries only the document. | X2, 002-3, 012-1 |
| `contracts/versioning.md` | The additive-key rule, the version field rule, the revert note. | X3, 006-3 |
| `contracts/refusals.md` | Every new refusal: phase, layer, failure class, exit code. | X4, 008-7 |
| `contracts/prompt-sections.md` | The nine blocks in order, the literal text of each, the untrusted label, the 32,000 character rule. | 005-4 |
| `contracts/answer-seam.md` | The numbered answer sequence and the item transition table. | X7, 001-3 |
| `contracts/state-root.md` and `contracts/module-map.md` | The final tree with modes and owners. The final module list with groups and allowed imports. | X11 |
| `contracts/fixtures/` | One golden payload per `--json` verb. | X8 |

### Step 3: make 011 a phase parent

Seven children, shaped like 003: design first, contracts second, then the build slices, then proof.

```text
011-messaging-channels/
  001-channel-ux-and-message-map/        design/ folder: one mockup per transport, the reply
                                         grammar table, refusal and link copy, golden text fixtures
  002-adapter-and-record-contracts/      capability table and matrix, link, approval, queue and
                                         seen schemas, inbound acknowledge sequence, list --json,
                                         the five conformance rules numbered
  003-link-roster-and-answer-gate/       channel-link.ts, operators.json, roster verbs, the
                                         surface check in answer.ts
  004-approval-index-and-send-queue/     channel-approval.ts, channel-queue.ts, delivery.ts
  005-polling-transports/                Telegram, Slack and the terminal transport, none of
                                         which needs a public URL
  006-daemon-and-webhook-transports/     Signal and WhatsApp, with the operator runbook for each
  007-conformance-hardening-and-proof/   fake transport, conformance suite, notices, docs
```

Children 001 and 002 are prerequisites for the rest. 003 and 004 can run side by side, then 005 and 006 side by side. The two lineages each proposed six children with different cuts. This is my merge of them, and it may change when `codex-1` finishes its 011 pass.

### Step 4: make 010 a phase parent

Four children. The pane is the reason: it lives in the crate 003 owns and must extend 003's key map, glyph table and component inventory.

```text
010-conversations/
  001-chat-ux-and-pane-map/              design/ folder: pane frames per state, key map delta
                                         with a chat input context, component rows, a sample
                                         of the terminal loop
  002-conversation-record-and-prompt-block/   conversation.ts, the record, the bound, the block,
                                              the secret scan
  003-chat-verb-loop-and-resume/         the chat verb, the loop, the drain filter, the
                                         conversation id on item and request
  004-chat-pane-and-proof/               the crate changes, the fixture, the render tests
```

The minimum alternative is to keep 010 a leaf and add a `design/` folder with the same content as child 001. I recommend the parent because the pane work has a different owner crate, a different language and a different test tool from the rest of the phase.

### Step 5: phase addenda, in this order

| Order | Phase | Addendum content |
|---|---|---|
| 1 | 008-vault | Name grammar, key mapping and collision rule, three keychain commands, index write rule, upgrade note, two requirement rows, redaction token |
| 2 | 005-memory | Entry line grammar and escape, forget index rule, write protocol and one race test |
| 3 | 009-skills | `--name` default, draft template, operator activation steps, the five `proposal.json` keys |
| 4 | 002-routine-layer | Routine state schema and write rule, `until` object, envelope clause |
| 5 | 001-activity-and-actor | Answer read rule for old answers |
| 6 | 006-approval-grants | Lock lifetime rule, single mechanism wording |

008 comes first because its open choices are security-relevant and feed 011, whose tokens are vault secrets.

### Step 6: closing rules

012 gets a failure policy. 013 copies its reports into the phase folder and writes its handed findings to a named file. 014 lists both as inputs and re-runs the touched scenarios after its fixes.

### Step 7: citation refresh

Fix the four-line drift into the parent spec and the moved research path. Do this last, after steps 1 to 6 have stopped moving lines.

### Nothing to do

004 and 007 need no expansion beyond the citation fix in 004.

## 7. Findings Rejected or Downgraded

### Rejected: the cited evidence, or other packet evidence, contradicts the claim

| Finding | Claim | Why it fails |
|---|---|---|
| V3-2 (P0) | `answer.ts` is a contracts module whose imports break the README's direction rule. | The README lists `answer.ts` in the request pipeline group [SOURCE: L/README.md:33]. The rule binds contracts modules only [SOURCE: L/README.md:39]. No violation exists. |
| V9-4 (P0) | The packet has no schema version concept, and `run-record.ts` has no version field. | The run record carries and checks `schemaVersion` [SOURCE: L/run-record.ts:197] [SOURCE: L/run-record.ts:239]. 001 states the version rule in plain words [SOURCE: B/001-activity-and-actor/plan.md:66]. The true residue is narrower and is X3. |
| V7-1 (P1) | The skill-name grammar is defined nowhere. | The plan defines it as the bot-id grammar and cites the pattern [SOURCE: B/009-skills/plan.md:63]. The lineage read the spec only. |
| V8-5 (P1) | 014 has no rule for a host with fewer than five executors. | The plan has one [SOURCE: B/014-deep-review/plan.md:219]. The real defect is the contradiction with the setup task, which `codex-2` found and I kept as 014 gap 1. |
| V9-5 (P1) | No phase has a rollback step. | Each plan has a rollback section. Two examples: [SOURCE: B/006-approval-grants/plan.md:144-148] [SOURCE: B/008-vault/plan.md:151-155]. |
| V2-5 (P1), and the matching half of C1-2-1 | REQ-017 promises five conformance rules and names two. | The sentence carries five assertions: an unsupported result, no platform reached, no provider error, one matching observation, a receipt [SOURCE: B/011-messaging-channels/spec.md:204]. They match the reference checker's checks [SOURCE: C/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:374-470]. The three extra rules `vibe` proposed (replay, chunk limit, redaction) are not in the reference. My count of five is a reading of the sentence. A numbered list from the phase author would confirm it. Kept as P2. |

### Rejected: proposed expansion is larger than the gap

| Proposal | Why not |
|---|---|
| C1-1-2: make 002 a phase parent with four children | 002 has 11 requirements with field-level rules. Its gaps are one schema and two clauses. Its damaged-file rule already exists [SOURCE: B/002-routine-layer/spec.md:224]. |
| C1-1-3: a child phase for the memory file format | One module owns the line [SOURCE: B/005-memory/plan.md:60]. A contract section and three plan lines close it. |
| C1-1-4: a child phase for grant rollout and rollback | The rollback is written. The general rule belongs to the packet, as X3. |
| C2-1-2 and C2-1-3: make 008 a phase parent with two children | The access boundary is a decision the phase states three times, so there is nothing left to design in a threat-model child. The store lifecycle gap is two sentences and a test. |
| V1-1: a new phase 015 for contracts before 001 | A phase would renumber nothing and build nothing. `vibe` reversed this itself in iteration 10. A folder is enough. |

### Downgraded

| Finding | From | To | Why |
|---|---|---|---|
| V1-1, V10-2 no schema or contract document | P0 | P1 | Most shapes are present as prose or test commands. The missing piece is one place to read them. |
| V1-2 memory line format | P0 | P1 | One module owns parser and renderer, so any choice is self-consistent. It is still a builder decision about a durable file. |
| V3-1 no target-state architecture document | P0 | P2 | Each phase names its modules and several state their import limits. |
| V6-1, V6-2 vault grammar and key mapping | P0 | P1 | A builder decision, and the most consequential one in the packet. Not a contradiction. |
| V6-5 vault changes the meaning of `secrets` | P0 | P1 | The template ships `secrets: null` and the phase notes this repository has no bots folder [SOURCE: B/007-per-bot-apps/spec.md:108]. An upgrade paragraph closes it. |
| V9-1 no phase cites the refusal registry | P0 | P1 | 007 states the class of each refusal and names the runner as the owner of refusal causes [SOURCE: B/007-per-bot-apps/plan.md:83]. The gap is 008, 009 and 011. |
| V10-3 008 needs an addendum | P0 | P1 | Follows from the two rows above. |
| V4-1, V4-3 envelope disagreement | P1 | P2 for the rule, P0 for the one contradiction it caused | `vibe` said `routines` was unstated and chat was the only array. Both arrays are fixed [SOURCE: B/003-terminal-screen/spec.md:184]. |
| V5-6 the `kind` row contradicts the ownership rule | P1 | Rejected as a contradiction | The split is stated on purpose in both places [SOURCE: B/spec.md:131] [SOURCE: B/001-activity-and-actor/spec.md:117]. |
| V5-2 `needs-you.ts` needs a serial merge rule | P1 | P2 | Phases run one after another [SOURCE: B/spec.md:169]. |
| V9-2, V9-3 free-string cause, no owner for exit codes | P1 | P2 | The first describes existing code. For the second, every new refusal states its exit number. |
| V9-7 no phase says which refusals are before dispatch | P1 | P2 | The registry is documented as before dispatch only [SOURCE: L/runner.ts:122], and 007 and 008 say "before dispatch" on each run refusal. |
| C2-1-1 shared runs expose every app | P0 | P2 | A named and tested limit, not an open decision. |
| C2-1-2 the grant is not a per-bot boundary | P0 | P2 | An accepted residual with its own requirement and test. |
| C2-2-3 transcript retention | P1 | P2 | A stated deferral. |

### Upgraded

| Finding | From | To | Why |
|---|---|---|---|
| V7-3 sentinel conflict between 005 and 009 | P1 | P0 | Two documents cannot both be followed. |
| V7-5 draft `SKILL.md` shape | P2 | P1 | The draft is the thing an operator reviews, and it is generated with no model call, so the template is the whole design. |

## 8. Citation Check

I marked all 73 `vibe` findings and all 19 Codex findings landed so far. For each I opened the cited lines, or searched for the claimed absence.

| Lineage | Findings | Confirmed | Weak | Wrong | Not verified |
|---|---|---|---|---|---|
| `vibe` | 73 | 52 | 14 | 6 | 1 |
| `codex-1` (iterations 1, 2) | 10 | 9 | 1 | 0 | 0 |
| `codex-2` (iterations 1 to 3) | 9 | 7 | 2 | 0 | 0 |

**Confirmed** means the claim holds, whatever I did to its severity. **Weak** means part of the claim is contradicted by a document the lineage did not read, or it rests on counts I did not reproduce. **Wrong** means the six rows at the top of section 7. The one unverified `vibe` finding is its ranked order (V10-8), which is judgment.

**Line accuracy.** Of roughly 100 individual `vibe` citations I opened, about 60 land on the cited line or inside the cited range, and about 35 point at the right file with the right content between one and ten lines away. The drift is not from a moving file. No phase document outside 003 has a commit after 21:10 CET, and the lineage started at 22:22 CET. Six citations are attached to a claim the file contradicts. Every Codex citation I opened lands inside its cited range. One Codex citation has a doubled path segment and resolves to no file as written (C2-2-2).

**The pattern behind the weak and wrong marks.** `vibe` ran ten iterations in about eight minutes and in several of them read a phase's `spec.md` only. Five of its six wrong findings are answered in the same phase's `plan.md` or in the runtime file it cited. Its absence claims are reliable where I re-ran the search (no schema file, no diagram, no vault grammar) and unreliable where a plan could hold the answer.

**Severity.** `vibe` graded 13 findings P0. I keep one (011's width), raise one of its P1s to P0 (the sentinel), reject two and move ten to P1 or P2. Codex graded two findings P0, and both are decided residuals I regrade to P2. Codex missed no P0 that `vibe` found, and found one `vibe` missed (014's contradiction).

**Reference code.** `vibe` named a first repository for six phases in its summary and opened reference code in one iteration. Three of its suggestions I could not tie to any file: `buzz-main` for the queue, `openhuman-main` for the conversation surface as a whole, and `OpenMausBot-main` for routines. Section 4 lists only paths I checked exist.

## 9. What Is Still Uncertain

1. **Codex has five iterations left.** `codex-1` has three: it has not yet reached F-1-005, the cross-cutting architecture and 004. `codex-2` has two, and its notes say it plans to revisit 001, 002, 004, 006 and 011. Verdicts most likely to move: 006 (thinnest evidence), 002 (a parent proposal I rejected on one pass) and the child cut for 011.
2. **The parent verdict for 010 is a judgment.** I did not score 010 against the spec-kit phase thresholds. The design gap is confirmed. Whether it needs four children or one `design/` folder is the open part.
3. **The count of five conformance rules is my reading of one sentence.** A numbered list from the phase author settles it.
4. **Operator intent on four decided residuals.** 007's shared-run record, 008's same-user boundary, 014's single review, and bare arrays for two verbs. Each is decided in the documents. Each is the kind of decision an operator who wants a perfect one-shot may want to reopen.
5. **The moved research folder.** The move is uncommitted in this worktree. If it is reverted, X6 disappears.
6. **Absence claims marked inferred.** Each rests on a search across the phase's spec, plan, tasks, acceptance criteria and goal. I did not read every phase document end to end. 004 and 007 I read at the requirement and architecture level only.
7. **001's lifted reference file.** 001 cites no context path, so its first reference is inferred from a file name.
8. **013 has the least evidence.** One `vibe` pass and one `codex-2` sentence. I did not read its plan.
9. **The steering log is still being appended to.** I read it at 178 lines. Its later entries are not reflected here.

## 10. Waiting On

- The remaining Codex iterations: `codex-1` iterations 3 to 5 and `codex-2` iterations 4 and 5.
- `R/deep-research-findings-registry.json` and `R/fanout-attribution.md`, to reconcile finding ids and to check that no merged finding was dropped from this synthesis.
- Anything in the final Codex passes that contradicts a verdict in section 3, a rejection in section 7, or the child lists in section 6.
