# Plan-Depth Review of the OpenBot Parity Build: Synthesis

Final synthesis of the plan-depth fan-out. It covers the `vibe` lineage (10 iterations, 73 findings), `codex-1` (5 iterations, 18 findings) and `codex-2` (5 iterations, 11 findings), which is all 102 findings in the merged registry. The `opencode` lineage failed on quota before its first iteration and contributed nothing. The runner marks `codex-1` failed because its state log has no terminal row. Its five iteration files are complete, and I judged them on content.

## 1. How to Read This

**Question.** For each phase of `specs/system-skilled-bots/003-openbot-parity-build/` except the terminal screen, is it planned deeply enough that a builder needs no design decision, and what artifact or child phase closes each gap? Phase `003-terminal-screen` is the depth benchmark and is not a subject.

**Path prefixes used in citations.**

| Prefix | Expands to |
|---|---|
| `B/` | `specs/system-skilled-bots/003-openbot-parity-build/` |
| `L/` | `.skilled/skills/system-skilled-bots/runtime/lib/` |
| `C/` | `specs/system-skilled-bots/context/` |
| `R/` | `specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/` |
| `T/` | `B/003-terminal-screen/` |

The earlier parity research now lives at `specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/`. The plan review that used to sit in `B/research/` now lives at `specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/`.

**Severity, as I applied it.**

- **P0**: no builder can satisfy the documents as written. Either two phase documents contradict each other, or the phase is too wide to build in one pass at the benchmark depth.
- **P1**: a builder would have to make a design decision the documents do not make.
- **P2**: polish. The answer is recoverable from the documents, or the point is a decided limitation worth one confirming sentence.

This is stricter on P0 than the lineages were. Section 7 gives the reason for every regrade.

**Who found what.** `V3-2` is the `vibe` lineage, iteration 3, finding 2. `C1-4-1` and `C2-4-1` are the Codex lineages in the same form. `S` marks a finding that is my own. `T` marks a finding that came from the terminal screen's new design contract. Each short id maps to the merged registry id `finding-<iteration>-<n>-...` with the matching `_lineages` value. Section 9 lists all 102.

**Status words.** **Confirmed** means I opened the cited lines and the claim would have read differently if it were false. **Inferred** means the claim rests on an absence I searched for.

**Why the bar is high.** The parent spec assigns most build work to DeepSeek Flash executors and keeps the strongest model as a last fallback [SOURCE: B/spec.md:188]. A decision left open is made by the weakest builder on the roster, once per worker.

## 2. Bottom Line

The packet is closer to one-shot ready than its size suggests. Most phases name their files, their refusals and a verify command per task. What remains falls into five groups.

1. **Three direct contradictions between phase documents.** 005 and 009 disagree on the proposal sentinel. 012 and 001 disagree on the empty `bots inbox --json` shape. 014's setup task and its own fallback rule disagree on a missing executor.
2. **Two phases with a user-facing surface and no design artifact.** 011 has channel messages. 010 has a chat pane and a chat loop. Neither has a mockup, a key map or a state list, which is the depth 003 now has. Both should become phase parents.
3. **Durable record shapes left to the builder.** The vault's name grammar and environment key mapping, the memory entry line, the routine state file, the channel link, queue and seen records, and the final needs-you item key set.
4. **Edits the terminal screen's new contract requires of 001 and 002.** The screen's design work found that three of the seven activity groups have no data source in 001, and it changes `routines --json` to an object. These are written out as verbatim edits and nobody has applied them.
5. **A closing chain that cannot certify the build.** 012 may close with recorded failures, nothing carries those failures into 014, and 013's evidence sits outside the checkout.

One phase is ready as written: 004. One is ready pending an operator confirmation: 007.

## 3. Verdict per Phase

| Phase | Verdict | Evidence strength | Work order |
|---|---|---|---|
| 001-activity-and-actor | Needs artifacts | Strong: V1, V4, V5, C1-1, C2-4, T, my read | WO-02 |
| 002-routine-layer | Needs artifacts. Not a parent | Strong: V1, V3, C1-1, C1-3, C2-4, T, my read | WO-03 |
| 004-computer-exposure | Ready | Moderate: V3, C1-3, C2-4, my read. All four agree | WO-13 (one line) |
| 005-memory | Needs artifacts | Strong: V1, V3, C1-1, C2-2 | WO-04 |
| 006-approval-grants | Needs artifacts (small) | Moderate: V1, V5, C1-1, C2-4, my read | WO-05 |
| 007-per-bot-apps | Ready, one operator confirmation | Moderate: C2-1, C1-4, my read | WO-14 (two lines) |
| 008-vault | Needs artifacts (largest addendum). Not a parent | Strong: V6, C2-1, C1-4, my read | WO-06 |
| 009-skills | Needs artifacts | Strong: V7, C2-2, C1-4 | WO-07 |
| 010-conversations | Become a phase parent, 3 children | Moderate to strong: V4, V10, C2-2, my read | WO-08 |
| 011-messaging-channels | Become a phase parent, 7 children | Strong: V2, C1-2, C2-4, my read. All three lineages agree on a parent | WO-09 |
| 013-manual-testing-scenarios | Needs artifacts (rules) | Strong: V7, C2-3, C1-5, my read | WO-10 |
| 014-skilled-and-doc-alignment | Needs artifacts (rules) | Moderate: V8, C1-5, my read of its plan | WO-11 |
| 015-deep-review | Needs artifacts (rules) | Strong: V8, C2-3, C1-5 | WO-12 |

**The five verdicts I flagged as likely to move, and where they landed.**

- **006** stays at needs artifacts (small). `codex-2` iteration 4 found no P0 or P1 gap in it. My one P1 is a lock lifetime rule, and it stands because a search of the phase finds no stale-lock rule. The grant expiry and revoke lifecycle the steering log lists as uncovered needs no design: the phase records no standing allow, so a grant lives and dies with its item [SOURCE: B/006-approval-grants/spec.md:158].
- **002** stays a leaf. `codex-1` kept a parent as a candidate, `codex-2` and `vibe` both said amendment. Its addendum grew by four items: a transition contract for `bots enable` racing a failing run, a streak restart rule, one parity decision, and the screen contract's edits.
- **013** is now confirmed by a second lineage and by my read of its plan. The handed findings do have a file, `scratch/rebuttals.md` [SOURCE: B/014-skilled-and-doc-alignment/plan.md:96]. The missing half is 014's intake.
- **011 child cut** is final at seven. Three lineages each proposed six with different cuts. Mine follows 003's shape: design, contracts, build slices, proof.
- **010** becomes a parent with three children, down from the four in the draft. Splitting the runtime half in two closes no gap, because that half is already specified to the field. The pane is what needs its own child and its own design folder.

## 4. Gaps per Phase

### 001-activity-and-actor: needs artifacts

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P1 | Three of the seven activity groups have no data source. The phase groups "whatever the index holds", and the index holds terminal run records and items only. | The phase says so [SOURCE: B/001-activity-and-actor/spec.md:109]. A run record is written only at the terminal write [SOURCE: L/runner.ts:409-412]. No next fire is ever computed [SOURCE: L/installer.ts:93-94]. Confirmed. | A new requirement naming the source of `working`, `scheduled` and `recurring` rows, written verbatim in the screen contract [SOURCE: T/002-architecture-and-contracts/design/contracts.md:749]. | T, confirmed by me |
| 2 | P1 | The screen needs a status index that is current on read, and 001 has no refresh rule. | The screen contract writes the requirement as a new REQ-011. Same source, section 12.1 item 3. Confirmed that 001 has no such row. | Apply section 12.1 items 1 to 10. | T |
| 3 | P1 | The final needs-you item key set is listed nowhere. Five phases add six keys to a closed list that refuses unknown keys. | [SOURCE: L/needs-you.ts:51-65] [SOURCE: L/needs-you.ts:97-98]. The Shared Records table names owners for `kind` and `grants` only [SOURCE: B/spec.md:126-138]. Confirmed. | One table in `contracts/records.md`. | V5-1, C1-1-1 |
| 4 | P1 | An answer written before this phase has no `by` and no `scope`, and the phase states the read rule for the run record only. | [SOURCE: B/001-activity-and-actor/spec.md:117] [SOURCE: B/001-activity-and-actor/spec.md:193] [SOURCE: L/needs-you.ts:24-27]. Confirmed. | One sentence in REQ-004 and REQ-010, one test row. | V1-3 |
| 5 | P2 | The item lifecycle is derived state whose transitions are spread over 001, 005 and 006. | [SOURCE: L/needs-you.ts:49] [SOURCE: B/006-approval-grants/spec.md:170-171]. Confirmed. | A transition table in `contracts/answer-seam.md`. | V1-7 |
| 6 | P2 | Two `state` vocabularies ship under one key name. | [SOURCE: B/001-activity-and-actor/spec.md:152-153]. Confirmed. | One line in `contracts/cli-json.md`. | V4-5 |

`codex-2` iteration 4 found no P0 or P1 gap in 001. It read the plan's actor and record rules, which are sound, and did not have the screen contract, which was written after it ran.

Reference code to study first: `C/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts`, which holds the seven group ids, then `C/OpenBot-main/app/src/components/bot-profile/activity.tsx`. Both exist. 001's documents cite no context path, so the match is by content search for `needs_you`.

### 002-routine-layer: needs artifacts

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P1 | The routine state file has three named fields and no schema: no version, no write rule, no absent-file default. | [SOURCE: B/002-routine-layer/spec.md:126] [SOURCE: B/002-routine-layer/plan.md:62]. A damaged file has a read rule [SOURCE: B/002-routine-layer/spec.md:224]. Inferred from search for the rest. | A `routine-state` section in `contracts/records.md`. | V1-4, C1-1-2 |
| 2 | P1 | `bots enable` and an in-flight failing run both write the switch, the state file and the item, with no stated winner and no rule for a stop between the three writes. | Both writers are named [SOURCE: B/002-routine-layer/plan.md:62-66]. The matrix has no race or partial-write row [SOURCE: B/002-routine-layer/plan.md:101]. Confirmed for the lines, inferred for the absence. | A write order and an idempotent re-run rule in the plan, and two fault fixtures. | C2-4-1 |
| 3 | P1 | After `bots enable`, the failure streak has no restart rule. It is counted from run records, so the ten old failures are still the newest ten, and the next single failure trips the switch again. | The streak counts consecutive failures from run records [SOURCE: B/002-routine-layer/plan.md:62]. Enable clears the fatigue record and nothing else [SOURCE: B/002-routine-layer/spec.md:136]. The reference restarts the count at re-enable [SOURCE: C/OpenBot-main/docs/routines.md:118-123]. Confirmed for the lines. That the streak re-trips is inferred. | An `enabledAt` instant in the state file, and one clause in REQ-006: only runs newer than `enabledAt` count. | S |
| 4 | P1 | `routines --json` must become an object with named keys for the streak and the switch state. The phase tests a bare array and names neither key. | The screen contract decides it [SOURCE: T/002-architecture-and-contracts/design/contracts.md:727]. The phase's own check is `jq 'length == 2'` [SOURCE: B/002-routine-layer/plan.md:297]. Confirmed. | Apply section 12.2 items 1 to 4 of the screen contract. | T, V1-5 |
| 5 | P2 | The reference posts one notice on the first failure after a success. The phase neither adopts nor defers it. | [SOURCE: C/OpenBot-main/docs/routines.md:118-123]. A search of the phase for a first-failure rule finds nothing. Inferred. | One out-of-scope line, or one requirement. | C1-3-1, the half that holds |
| 6 | P2 | The `until` observation on the run record names one field. | [SOURCE: B/002-routine-layer/acceptance-criteria.md:59]. Confirmed. | State in REQ-004 that the object is `{met}` and nothing else. | V1-6 |

Reference code to study first: `C/OpenBot-main/docs/routines.md`, which 002 already cites five times, then `C/OpenBot-main/shared/routine-firing.ts`.

### 004-computer-exposure: ready

No builder decision found. The prompt line is given as literal text with its null-branch variant [SOURCE: B/004-computer-exposure/spec.md:143], and each requirement maps to an existing shape in the tree [SOURCE: B/004-computer-exposure/spec.md:161-173]. `vibe`, `codex-1` and `codex-2` each reached the same verdict.

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P2 | The design reference for the section order points at the wrong parent line. | It cites parent line 130 [SOURCE: B/004-computer-exposure/spec.md:168]. The section order row is at line 134 [SOURCE: B/spec.md:130-134]. Confirmed. | Cite the record by name. | S |

Reference code to study first: none in `C/`. The in-tree shapes are `L/dispatch.ts:301-332` and `L/runner.ts:1033-1038`, which 004 names itself.

### 005-memory: needs artifacts

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P0 | 005's recorded decision says 009 reserves no second sentinel. 009 reserves one. | See 009 gap 1. | Decision D1 in WO-01. | V7-3 |
| 2 | P1 | The memory entry line has five named fields and no serialization: no example line, no delimiter, no escaping rule, no index rule for `--forget`. | [SOURCE: B/005-memory/plan.md:60] [SOURCE: B/005-memory/spec.md:146]. The test list names a line whose text holds a pipe [SOURCE: B/005-memory/plan.md:108]. Inferred from search across all five documents. | A `memory-entry` section in `contracts/records.md`. | V1-2, C1-1-3 |
| 3 | P1 | Append and forget have no write protocol. The shared file has many writers. Two lineages found this independently. | [SOURCE: B/005-memory/plan.md:60-66]. The matrix has no concurrent case [SOURCE: B/005-memory/plan.md:107]. Confirmed for the matrix. | Three plan lines and one race test. | C1-1-3, C2-2-1 |
| 4 | P1 | The untrusted label and the closing-tag escape are described and never written as text. Four phases must emit the same words. | Each phase says "labelled untrusted" and "escaped" [SOURCE: B/005-memory/spec.md:164] [SOURCE: B/010-conversations/spec.md:169]. A search of 005, 009, 010 and 011 finds no literal label sentence and no escape form. Inferred. | The literal sentences and the escape form in `contracts/prompt-sections.md`. | S |
| 5 | P2 | The prompt bounds mix units: bytes for memory and skills, characters for the transcript and the total. | [SOURCE: B/005-memory/spec.md:148] [SOURCE: B/009-skills/spec.md:162] [SOURCE: B/010-conversations/spec.md:165]. Confirmed. | One budget table in `contracts/prompt-sections.md` that states the unit per block. | S |

Reference code to study first: `C/OpenGhost-main/memory.js`. Line 11 is the source of 005's bounds. Line 17 is a `clean` helper that collapses all whitespace to single spaces, a ready answer for what a newline in the text becomes.

### 006-approval-grants: needs artifacts (small)

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P1 | The guarded write uses an exclusive lock file with no rule for a lock left by a killed process. | [SOURCE: B/006-approval-grants/plan.md:63] [SOURCE: B/006-approval-grants/tasks.md:62]. No stale, crash or timeout rule in spec, plan or tasks. Inferred from search. | One sentence and one test. The tree has a model: the run lease is reclaimed by a pid, nonce and heartbeat rule [SOURCE: L/runner.ts:12-16]. | S |
| 2 | P2 | REQ-014 and the parent table still offer two mechanisms where the plan picked one. | [SOURCE: B/006-approval-grants/spec.md:171] [SOURCE: B/spec.md:136]. Confirmed. | Reword both to the lock file. | S |
| 3 | P2 | A revert leaves items an older runtime refuses, and the fix is manual. | [SOURCE: B/006-approval-grants/plan.md:144-148]. Confirmed. | Covered by `contracts/versioning.md`. | C1-1-4, downgraded |
| 4 | P2 | Two keys named `kind` with different vocabularies sit in one payload. | [SOURCE: B/spec.md:131] [SOURCE: B/006-approval-grants/spec.md:153]. Confirmed. | One line in `contracts/records.md`. | V5-3, downgraded |
| 5 | P2 | The grant has no lifecycle table, though its lifecycle is short. | A grant is `once` or `deny`, and no standing allow is recorded [SOURCE: B/006-approval-grants/spec.md:158]. Confirmed. | Four rows in `contracts/answer-seam.md`: born open, granted, denied, expired with its item. | S, closing a steering-log gap |

Reference code to study first: `C/OpenBot-main/shared/tool-name.ts`, the classifier REQ-010 names as lifted [SOURCE: B/006-approval-grants/spec.md:167], then `C/OpenBot-main/docs/approvals.md`, section "What asks".

### 007-per-bot-apps: ready, one operator confirmation

The module map, the refusal names with their failure class, the environment key handoff and the restore rule are all fixed [SOURCE: B/007-per-bot-apps/spec.md:140-153] [SOURCE: B/007-per-bot-apps/plan.md:60-65].

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P2 | A shared run that declares no `apps` records `posture.apps: []` while its child reads the full repository config. | Stated [SOURCE: B/007-per-bot-apps/plan.md:68], tested on purpose [SOURCE: B/007-per-bot-apps/plan.md:116], named as a limit [SOURCE: B/007-per-bot-apps/spec.md:108]. Confirmed. | Decision D5 in WO-01. | C2-1-1, regraded from P0 |
| 2 | P2 | A run killed between the worktree write and the restore leaves the filtered file in its tree, and no sentence says what the next open of that tree does. | The restore runs after the child exits [SOURCE: B/007-per-bot-apps/plan.md:62]. The risk row covers a commit by the child only [SOURCE: B/007-per-bot-apps/spec.md:186]. Inferred. | One sentence and one test row. | S, the residue of C1-4-1 |

`codex-1` iteration 4 raised a P1 that two concurrent runs overwrite each other's filter in one worktree. I reject it as stated. See section 7.

Reference code to study first: none in `C/`. The in-tree anchor is the dispatch environment gate in `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`.

### 008-vault: needs artifacts (largest addendum)

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P1 | The `secrets` name grammar is referenced in spec, plan, tasks and goal and defined in none. | [SOURCE: B/008-vault/spec.md:150] [SOURCE: B/008-vault/plan.md:65] [SOURCE: B/008-vault/tasks.md:54]. One negative case only [SOURCE: B/008-vault/acceptance-criteria.md:64]. Confirmed by search. | The pattern as one regex with a length bound. | V6-1, C1-4-2 |
| 2 | P1 | The mapping from a name to `SKILLED_BOT_SECRET_<NAME>` is shown for one name only. | [SOURCE: B/008-vault/acceptance-criteria.md:66] [SOURCE: B/008-vault/spec.md:152]. Confirmed. | A mapping rule that cannot collide. | V6-2, C1-4-2 |
| 3 | P1 | The keychain backend names the write command only. Resolve, read-back and forget each need one, and `--store` has no meaning on `forget` when it differs from the recorded backend. | [SOURCE: B/008-vault/spec.md:147] [SOURCE: B/008-vault/tasks.md:55]. A search for the read and delete commands finds nothing. Inferred. | Three command lines and one backend-transition rule. | V6-7, C1-4-2, extended by me |
| 4 | P1 | The index shape is recoverable only from a test command and one prose sentence. | [SOURCE: B/008-vault/acceptance-criteria.md:61] [SOURCE: B/008-vault/plan.md:73]. Confirmed. | A `secrets-index` section in `contracts/records.md`. | V6-4, C1-4-2 |
| 5 | P1 | The index is read, changed and written by `set` and `forget` with no write rule, and a stop between the value write and the index write has no stated outcome. | The matrix has no concurrent or interrupted case [SOURCE: B/008-vault/plan.md:101]. The tree has the pattern [SOURCE: L/request-queue.ts:89-93]. Confirmed for the matrix. | A write order, temp and rename, and an orphan rule. | V6-6, C2-1-3 |
| 6 | P1 | The meaning of an existing key changes with no upgrade note. | [SOURCE: .skilled/skills/system-skilled-bots/assets/bot-template.txt:20-21] [SOURCE: B/008-vault/spec.md:151] [SOURCE: B/008-vault/plan.md:151-155]. Confirmed. | One upgrade paragraph. | V6-5, C1-4-2 |
| 7 | P2 | Two refusals exist in edge-case prose and the plan's matrix with no requirement row. | [SOURCE: B/008-vault/spec.md:222-223] [SOURCE: B/008-vault/goal.md:63]. Confirmed. | Two requirement rows, two acceptance rows. | V6-3 |
| 8 | P2 | The redaction token for `stdout.log` and the exit of a withheld run are unstated. | [SOURCE: B/008-vault/spec.md:164]. 010 fixes `[redacted: <key>]` for its own scan [SOURCE: B/010-conversations/spec.md:170]. Confirmed. | Reuse 010's token. | V6-8 |
| 9 | P2 | Any bot child can read another bot's value file. | Stated and accepted three times [SOURCE: B/008-vault/spec.md:165] [SOURCE: B/008-vault/spec.md:190] [SOURCE: B/008-vault/acceptance-criteria.md:74]. Confirmed. | Decision D6 in WO-01. | C2-1-2, regraded from P0 |

Two lineages grade gaps 1 and 2 P0. I hold them at P1 because a builder can choose a grammar and still pass every acceptance row. They are the most consequential open choices in the packet, which is why WO-06 fixes a default.

Reference code to study first: `C/rakazo-main/packages/core/src/messages/secret-matcher.ts` and `C/rakazo-main/packages/core/src/node/secrets-guard.ts`, the two files the phase lifts, then `C/rakazo-main/docs/bot-secrets.md`.

### 009-skills: needs artifacts

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P0 | 005 decides that 009 "adds no id of its own". 009 sets the item's `botId` to the reserved `skill-proposals` and adds it to the reserved list. | [SOURCE: B/005-memory/spec.md:265] against [SOURCE: B/009-skills/spec.md:164] and [SOURCE: B/009-skills/spec.md:131]. Confirmed. | Decision D1 in WO-01. | V7-3, regraded from P1 |
| 2 | P1 | `bots skill propose <run-id>` with no `--name` is valid and has no stated target name. | [SOURCE: B/009-skills/spec.md:163] [SOURCE: B/009-skills/plan.md:108]. Confirmed. | One sentence in REQ-004. | V7-2, C1-4-3 |
| 3 | P1 | The draft `SKILL.md` is built with no model call and has no template. | [SOURCE: B/009-skills/plan.md:82]. Inferred for the absence. | A literal draft template in the plan. | V7-5, regraded from P2 |
| 4 | P1 | A proposal is three separate writes: the draft, `proposal.json` and the review item. No order and no re-run rule is stated. The one existing guard covers an item that already exists. | [SOURCE: B/009-skills/plan.md:64] [SOURCE: B/009-skills/spec.md:231]. Confirmed. | A write order with the item last, and an idempotent re-run rule. | C1-4-3 |
| 5 | P2 | After an accepted proposal the operator has no written steps to make the skill live. | A runtime copy is out of scope by decision [SOURCE: B/009-skills/spec.md:110]. Confirmed. | Four lines in the run reference. | C2-2-2, downgraded |
| 6 | P2 | `proposal.json` key names appear only in a test command. | [SOURCE: B/009-skills/acceptance-criteria.md:60]. Confirmed. | List the five keys in REQ-004. | V7-4, downgraded |

Reference code to study first: `C/OpenGhost-main/skills.js:6-7` for the wrapper, then `C/OpenBot-main/app/src/lib/skills/proposal.ts` and `C/hermes-muse-main/skills/companion/references/memory.md:20` for the pin.

### 010-conversations: become a phase parent

The runtime half is specified to the field. The message record carries a version and every key [SOURCE: B/010-conversations/spec.md:154]. The transcript line format is fixed [SOURCE: B/010-conversations/spec.md:152]. Routing and the bound are fixed [SOURCE: B/010-conversations/spec.md:155] [SOURCE: B/010-conversations/spec.md:165]. The steering log lists the routing grammar, the prompt budget and the injection boundary as uncovered. All three have a requirement. What they lack is in gaps 5 to 7 below and in 005 gaps 4 and 5.

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P1 | The chat pane has no mockup, no state list, no key map and no component row. 003 drew a one-line placeholder for it. | [SOURCE: T/001-ux-and-component-map/design/component-inventory.md:30] [SOURCE: B/010-conversations/spec.md:159] [SOURCE: B/010-conversations/tasks.md:67]. Confirmed. | A `design/` folder in a UX child. | V10-6, C2-2-4 |
| 2 | P1 | Sending from the pane runs `bots chat --message`, which blocks for a whole bot run. No requirement says how the pane stays live. | [SOURCE: B/010-conversations/spec.md:159]. 003 records that blocking spawns freeze input [SOURCE: T/spec.md:246]. Confirmed for both lines. The gap is inferred. | A `sending` state and the worker rule in the pane contract. | S |
| 3 | P1 | A text entry pane inside a screen with single-key commands needs an input context, and none is defined for the Chat tab. | 003's key map has six exclusive contexts. The Chat tab sits in `main`. Typing is bound only in the overlay and palette contexts [SOURCE: T/001-ux-and-component-map/design/key-map.md:25-29]. Confirmed for the lines. | A seventh `chat` context in a key map delta. | S |
| 4 | P1 | The transcript `--json` form is a bare array, and the screen contract now makes every payload an object with a `version`. | [SOURCE: B/010-conversations/spec.md:157] against [SOURCE: T/002-architecture-and-contracts/design/contracts.md:727]. Confirmed. | Decision D2 in WO-01. | V4-3, T |
| 5 | P2 | `@<bot-id>` routing does not say whether the prefix is stored in the message text, what follows it, or what an `@` with an invalid id does. | [SOURCE: B/010-conversations/spec.md:155]. Inferred from search. | Four lines in the UX child's grammar table. | S, closing a steering-log gap |
| 6 | P2 | The terminal loop's printed form is unstated: prompt string, reply rendering, the wait while a run executes. | [SOURCE: B/010-conversations/spec.md:156] [SOURCE: B/010-conversations/plan.md:70]. Confirmed. | A transcript sample in the UX child. | S |
| 7 | P2 | The file grows without bound and rotation is deferred. | A decided deferral [SOURCE: B/010-conversations/spec.md:111] [SOURCE: B/010-conversations/spec.md:198]. Confirmed. | None for the build. | C2-2-3, downgraded |

Reference code to study first: `C/turnstone-main/turnstone/cli.py:176-181` and `:1276-1305` for the loop, which 010 already cites. For the pane, `C/openhuman-main/crates/openhuman-tui/src/composer.rs` and `input.rs`. Both exist. Their fit is inferred from the parent spec, which says 003 was written from openhuman-tui's shape [SOURCE: B/spec.md:154]. For the pane's contract style, `T/002-architecture-and-contracts/design/contracts.md`.

### 011-messaging-channels: become a phase parent

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P0 | The widest phase is a single Level 2 leaf: 29 file rows, 23 requirements, nine modules, five transports. | [SOURCE: B/011-messaging-channels/spec.md:140-170] [SOURCE: B/011-messaging-channels/spec.md:292-295]. Confirmed. | Seven children, WO-09. | V2-1, C1-2-6, C2-4-2 |
| 2 | P1 | `declaredCapabilities` has no vocabulary and no per-transport matrix. | [SOURCE: B/011-messaging-channels/spec.md:183] [SOURCE: B/011-messaging-channels/plan.md:66] [SOURCE: B/011-messaging-channels/plan.md:77]. Confirmed. | A capability table. | V2-2, C1-2-1 |
| 3 | P1 | The inbound acknowledge boundary is undefined per transport, and the `seen/` folder is named once with no content. | [SOURCE: B/011-messaging-channels/spec.md:151]. The reference makes it an adapter policy [SOURCE: C/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs:66-68]. Confirmed. | An inbound sequence per transport and a `seen` record. | C1-2-2 |
| 4 | P1 | The link record, the queue entry and `channel list --json` have no field list. | [SOURCE: B/011-messaging-channels/spec.md:185] [SOURCE: B/011-messaging-channels/spec.md:195] [SOURCE: B/011-messaging-channels/spec.md:206]. Confirmed. | Schemas in the contracts child. | V2-3, V2-4, C1-2-3 |
| 5 | P1 | No message a person reads is designed. Three lineages agree. | Behavior only [SOURCE: B/011-messaging-channels/spec.md:189-190]. A search for message text finds none. Inferred. | A `design/` folder with mockups and golden text. | V10-6, C1-2-4, C2-4-2 |
| 6 | P1 | Operator prerequisites are a risk table, not a runbook. | [SOURCE: B/011-messaging-channels/spec.md:239-241]. Confirmed. | A setup, preflight and health checklist per transport. | V2-7, C1-2-5 |
| 7 | P2 | The fatigue notice from 002 never reaches a chat, by design, and the operator-facing documents do not say so. | The rule is in REQ-006 [SOURCE: B/011-messaging-channels/spec.md:188]. Confirmed. | One line in the message catalog. | C2-4-2 |
| 8 | P2 | REQ-017 says five conformance rules in one unnumbered sentence. | [SOURCE: B/011-messaging-channels/spec.md:204]. Confirmed. | Number the five. See section 7. | V2-5, C1-2-1, downgraded |
| 9 | P2 | The approval index lists its fields and not its key structure. | [SOURCE: B/011-messaging-channels/spec.md:188]. Confirmed. | One line in the approval schema. | V2-6 |

Reference code to study first, in this order. `C/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs` for the contract and the acknowledge policy. `C/tinychannels-main/crates/tinychannels-bus/src/capabilities.rs:164` for the capability vocabulary. `C/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:374-470` for the conformance checks. `C/tinychannels-main/src/delivery/queue.rs` and `policy.rs` for the queue. The phase copies no tinychannels code [SOURCE: B/011-messaging-channels/spec.md:205]. Do not copy its approval index, which is in memory [SOURCE: C/tinychannels-main/src/approvals/mod.rs:58-70].

### 013-manual-testing-scenarios: needs artifacts (rules)

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P0 | 012 says an empty inbox prints `[]`. 001 and 003 say it prints an object with an `items` array. | [SOURCE: B/013-manual-testing-scenarios/spec.md:261] against [SOURCE: B/001-activity-and-actor/acceptance-criteria.md:56] and [SOURCE: T/004-panes/spec.md:223]. Confirmed. | Fix the edge case. | S |
| 2 | P1 | The phase may close with recorded failures. A product failure is filed in a scratch file no later phase reads. | [SOURCE: B/013-manual-testing-scenarios/spec.md:191] [SOURCE: B/013-manual-testing-scenarios/acceptance-criteria.md:61] [SOURCE: B/013-manual-testing-scenarios/tasks.md:144]. Confirmed. | Decision D4 in WO-01. | V7-6, C2-3-1, C1-5-1 |
| 3 | P1 | The recorded run goes stale. 014 changes the code after 012 ran, and nothing re-runs the corpus. | [SOURCE: B/015-deep-review/spec.md:41] [SOURCE: B/015-deep-review/spec.md:102]. Confirmed. | One task in 014. | V7-8, V8-3, C1-5-3 |

Reference to study first: no context repository applies. Use the existing scenario `.skilled/skills/system-skilled-bots/manual-testing-playbook/manual-run/needs-you-park-and-hold.md`, which 012 cites as its model, and the recorder `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/record-playbook-run.cjs`.

### 014-skilled-and-doc-alignment: needs artifacts (rules)

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P1 | Runtime findings are "handed to 014" and 014 lists no such input. | 013 records them in `scratch/rebuttals.md` [SOURCE: B/014-skilled-and-doc-alignment/plan.md:96] [SOURCE: B/014-skilled-and-doc-alignment/spec.md:112]. 014's dependency list names only that 013 is clean [SOURCE: B/015-deep-review/spec.md:44]. Confirmed. | Name the file as a 014 input. | V8-1, C1-5-2 |
| 2 | P1 | Both reports are written under the user state root, outside the checkout, so the clean close cannot be checked later. | [SOURCE: B/014-skilled-and-doc-alignment/spec.md:54-55] [SOURCE: B/014-skilled-and-doc-alignment/plan.md:28]. Confirmed. | Copy the final reports into the phase folder. | V8-2, C1-5-2 |
| 3 | P2 | 013 fixes every finding. 014 leaves P2 open. | [SOURCE: B/014-skilled-and-doc-alignment/spec.md:108] [SOURCE: B/015-deep-review/spec.md:101]. Confirmed. | One sentence. | V8-6 |
| 4 | P2 | The new `topics.json` topic is named by field with no key shapes. | [SOURCE: B/014-skilled-and-doc-alignment/spec.md:122]. Confirmed. | Paste one existing topic as the model. | V8-7 |

Reference to study first: `.skilled/commands/local-skilled-alignment.md`, `.skilled/commands/local-doc-alignment.md` and `.skilled/commands/assets/local-doc-alignment/topics.json`.

### 015-deep-review: needs artifacts (rules)

| # | Sev | Gap | Evidence | Closing artifact | Found by |
|---|---|---|---|---|---|
| 1 | P0 | Setup requires all five executor binaries. The plan says an absent binary drops its lineage and the next executor takes two. | [SOURCE: B/015-deep-review/tasks.md:43] against [SOURCE: B/015-deep-review/plan.md:219] and [SOURCE: B/015-deep-review/plan.md:183]. Confirmed. | Decision D3 in WO-01. | C2-3-2 |
| 2 | P1 | 012's results and failure file, and 013's handed findings, are not review inputs. | [SOURCE: B/015-deep-review/spec.md:31] [SOURCE: B/015-deep-review/spec.md:44]. Confirmed. | Three input rows and a verdict rule. | V8-4, C2-3-1, C1-5-2 |
| 3 | P1 | The fix pass re-runs unit suites and never the 012 scenarios its fixes touch. | [SOURCE: B/015-deep-review/spec.md:102]. Confirmed. | One task and one acceptance row. | V8-3, C1-5-3 |
| 4 | P2 | The scope check on `git status` does not exempt the review's own output files. | [SOURCE: B/015-deep-review/spec.md:165]. Confirmed. | One clause. | V8-8 |

Reference to study first: `.skilled/commands/deep/review.md`, `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml` and `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`. The run behind this research is a worked example of the fallback case: one lineage lost to quota at once, and one finished its work and was still marked failed for a missing terminal row.

## 5. Cross-Cutting Gaps

| # | Sev | Gap | Evidence | Closing artifact |
|---|---|---|---|---|
| X1 | P1 | **Shared records have owners and no contents.** The Shared Records table says who fixes a shape and never shows it. | [SOURCE: B/spec.md:122-138]. No schema file exists in the packet outside 003's new payload samples. Confirmed by search. | `contracts/records.md`. |
| X2 | P1 | **`--json` envelopes are being settled in one phase only.** The screen contract makes each of its four payloads an object with a top-level `version`. Verbs the screen does not read have no rule: the chat transcript is a bare array, `channel list --json` is "an object" with no keys, `remember --list --json` has no shape. | [SOURCE: T/002-architecture-and-contracts/design/contracts.md:727] [SOURCE: B/010-conversations/spec.md:157] [SOURCE: B/011-messaging-channels/spec.md:206] [SOURCE: B/005-memory/spec.md:149]. Confirmed. | `contracts/cli-json.md`, which adopts the screen's rule for every verb. |
| X3 | P1 | **Record versioning is uneven.** The run record, the request record and the index carry a version. The needs-you item carries none, and five phases add keys to it. The new files in 002, 008, 009 and 011 state no version. | [SOURCE: L/run-record.ts:197] [SOURCE: L/request-record.ts:192] [SOURCE: L/needs-you.ts:51-65] [SOURCE: B/006-approval-grants/spec.md:194]. Confirmed. | `contracts/versioning.md`. |
| X4 | P1 | **New refusals have no single table.** 007 states the failure class of each run refusal. 008, 009 and 011 name refusals with an exit code and no class, and do not say which enter the runner's typed registry. | [SOURCE: L/runner.ts:122-151] [SOURCE: B/007-per-bot-apps/spec.md:151]. A search of 008 and 011 for a class finds none. Inferred. | `contracts/refusals.md`. |
| X5 | P2 | **Line-number citations between phases are stale.** Phase documents cite parent rows four lines above where they now sit. | [SOURCE: B/004-computer-exposure/spec.md:168] [SOURCE: B/015-deep-review/spec.md:45] [SOURCE: B/010-conversations/spec.md:170]. Confirmed. | Cite shared records by name. WO-15. |
| X6 | P2 | **The research folders moved.** At the draft, 46 phase citations pointed at the old parity research path. A path rewrite is in progress in this worktree, and 5 old-path citations remained when I last counted. | Counted by search at 22:35 UTC. Confirmed at that moment. | Recount after the move is committed. WO-15. |
| X7 | P1 | **The answer path is assembled from five phases and drawn nowhere on the runtime side.** Order: surface and roster check, lock, identity check, write of answer with `by`, scope and grant, review seam, conversation id stamp, resume request or the no-resume branch. The screen side is now drawn. | [SOURCE: B/011-messaging-channels/spec.md:208] [SOURCE: B/006-approval-grants/spec.md:157] [SOURCE: B/005-memory/spec.md:163] [SOURCE: B/010-conversations/spec.md:168] [SOURCE: B/002-routine-layer/spec.md:132]. The screen's half is at [SOURCE: T/005-answer-flow/design/state-machines.md:258]. Confirmed. | `contracts/answer-seam.md`, which links to the screen's section 4 and does not copy it. |
| X8 | P1 | **Test strategy has one shared fixture set, for four verbs.** The screen contract adds sample payload files and a type check against real output for `status`, `activity`, `inbox` and `routines`. No other verb has a golden file, and only 006 and 010 list the screen fixture as a file to change. | [SOURCE: T/002-architecture-and-contracts/design/contracts.md:749] [SOURCE: B/006-approval-grants/spec.md:139] [SOURCE: B/010-conversations/spec.md:129]. Confirmed. | `contracts/fixtures/` for the remaining verbs and records. |
| X9 | P1 | **The closing chain does not connect.** 012 to 014 and 013 to 014 both hand over something 014 does not list. | 012 gap 2, 013 gap 1, 014 gap 2. | One paragraph in the parent's handoff section, WO-01. |
| X10 | P1 | **No single statement of the target runtime.** Each phase names its own modules, folders and README rows. The sum, the final state-root tree and the import edges are written nowhere. Two lineages asked for this. | [SOURCE: L/README.md:21-39] [SOURCE: L/state-root.ts:117-131] [SOURCE: B/spec.md:102-118]. Confirmed. | `contracts/runtime-architecture.md`. |
| X11 | P2 | **No diagram exists outside 003.** | A search for mermaid, sequence diagrams and image files in the other thirteen phases finds none. Inferred. | Four sequences in `contracts/runtime-architecture.md`. |

## 6. Expansion Work Orders

Fifteen work orders. Each names the files to create or edit, the content each must hold, and what it depends on. A writer can do one from its entry alone. No two work orders edit the same file.

### 6.1 Order and dependencies

```text
Wave 0   WO-01  contracts/ folder, decisions, parent spec edits
            |
Wave 1   WO-02 001   WO-03 002   WO-04 005   WO-05 006   WO-06 008   WO-07 009
         WO-08 010 (child 001 first)   WO-10 012   WO-11 013   WO-12 014
         WO-13 004   WO-14 007
            |
Wave 2   WO-09 011   (needs WO-06 for the secret name grammar,
                      reads WO-08 child 002 for the chat path)
            |
Wave 3   WO-15  citation refresh across the packet
```

| WO | Target | Depends on | Can run beside |
|---|---|---|---|
| WO-01 | `B/contracts/`, `B/spec.md` | Nothing | Nothing. It goes first |
| WO-02 | 001 | WO-01 | Every Wave 1 order |
| WO-03 | 002 | WO-01 | Every Wave 1 order |
| WO-04 | 005 | WO-01 (D1) | Every Wave 1 order |
| WO-05 | 006 | WO-01 | Every Wave 1 order |
| WO-06 | 008 | WO-01 (D6) | Every Wave 1 order |
| WO-07 | 009 | WO-01 (D1) | Every Wave 1 order |
| WO-08 | 010 | WO-01 (D2) | Every Wave 1 order |
| WO-09 | 011 | WO-01, WO-06, WO-08 child 002 | WO-15 must wait for it |
| WO-10 | 012 | WO-01 (D2, D4) | Every Wave 1 order |
| WO-11 | 013 | WO-01 | Every Wave 1 order |
| WO-12 | 014 | WO-01 (D3, D4, D7) | Every Wave 1 order |
| WO-13 | 004 | WO-01 | Every Wave 1 order |
| WO-14 | 007 | WO-01 (D5) | Every Wave 1 order |
| WO-15 | All phases, citations only | WO-02 to WO-14 | Nothing. It goes last |

WO-10, WO-11 and WO-12 can run side by side because the handoff file names are fixed here: `B/013-manual-testing-scenarios/scratch/failures.md`, `B/014-skilled-and-doc-alignment/scratch/rebuttals.md` and `B/014-skilled-and-doc-alignment/evidence/`.

Ranking by value, for a team that cannot do all fifteen at once: WO-01, WO-09, WO-08, WO-06, WO-02, WO-03, WO-04, WO-07, WO-12, WO-10, WO-11, WO-05, WO-14, WO-13, WO-15.

### WO-01: packet-level `contracts/` folder, decisions and parent spec edits

**Why first.** Every other work order cites a file in this folder or a decision in it.

**Create `B/contracts/` with these files.**

| File | Must hold |
|---|---|
| `contracts/README.md` | An index: one row per file below with its owner phase and the phases that cite it. One rule: a phase that changes a shape edits the contract file in the same change. |
| `contracts/decisions.md` | The nine decisions in the table below, each with the choice taken, the date and the documents it changes. A writer applies the recommended default unless the operator has overruled it there. |
| `contracts/records.md` | One section per durable record, each with a field table (key, type, null rule, owner phase, landing phase, absent-key default), one literal sample and its `schemaVersion` rule. Sections: needs-you item (the 13 keys that exist today plus every key a phase adds), answer object (`text`, `answeredAt`, `by`, `scope`), grant object, run record additions per phase (`actor`, `answeredBy`, `until`, `posture.apps`, `posture.secretsUsed`, `evidence.branch`, `evidence.worktreePath`, skill digests, delivery `unknown`), request record (`conversationId`), routine state, memory entry line, secrets index, `proposal.json`, conversation message, `channels/config.json`, link record, approval index, queue entry, seen record, `operators.json`. |
| `contracts/cli-json.md` | One rule: every `--json` verb prints one object with a top-level `version`, stdout carries only that document, and human lines go to stderr. One row per verb with its envelope key, its empty shape and where its field table lives. For `status`, `activity`, `inbox` and `routines` the row points at `T/002-architecture-and-contracts/design/contracts.md` sections 4 to 7 and copies nothing. For `chat --transcript`, `remember --list`, `channel list` and any other verb, the row holds the field table itself. One line naming the two `state` vocabularies. |
| `contracts/versioning.md` | Four rules. An added key keeps the version and reads as its default when absent. A removed, renamed or retyped key bumps it. Every new state file carries `schemaVersion: 1`. The needs-you item gains no version key, and the reason is stated. One table: for each phase that adds an item key, what an older runtime does with a newer item, and the manual step a revert needs. |
| `contracts/refusals.md` | One row per refusal the packet adds: name, phase, layer (definition parse, checker invariant, run refusal, verb refusal), failure class (`author`, `operator`, `environment` or none), exit code, and whether it enters `REFUSAL_CAUSES`. One row per existing exit code from `L/runner.ts:113-120`. A link to `T/005-answer-flow/design/state-machines.md` section 4.2 for what the answer verb returns. |
| `contracts/prompt-sections.md` | The nine blocks in order. For each: the literal opening and closing text, the literal untrusted-label sentence, the absent-block rule and the owner phase. The escape form for a closing tag inside a block. One budget table with the cap and the unit per block and the 32,000 character total. The overflow rule. |
| `contracts/answer-seam.md` | One numbered sequence for `answerItem`: surface and roster check, lock, identity check, write, review seam, conversation id stamp, resume request or no-resume. For each step: owner phase, refusal on failure, and what is on disk if the process stops there. One item state transition table. One grant lifecycle table of four rows. A link to the screen's answer contract. |
| `contracts/runtime-architecture.md` | The target module list with group and allowed imports, one row per new module with its phase. The final state-root tree with mode and owner phase per node. Four sequence diagrams in mermaid: run, answer, chat turn, channel inbound. |
| `contracts/fixtures/` | One golden file per record and per `--json` verb that the screen's `design/payloads/` does not already hold. A README naming which vitest file reads each. |

**Decisions to record in `contracts/decisions.md`.**

| ID | Decision | Recommended default | Documents it changes |
|---|---|---|---|
| D1 | Proposal sentinel: one or two | Two. Keep 009's `skill-proposals`. Three places in 009 already use it and the inbox column then names the right queue | `B/005-memory/spec.md:265` last clause |
| D2 | Envelope for verbs outside the screen | Object with `version`, the screen's rule. The chat transcript becomes `{"version":1,"messages":[...]}` | 010 REQ-006 and its checks, 011 REQ-019, 005 REQ-004 |
| D3 | 014 and a missing executor | The fallback wins. Setup probes and records which binaries are present | 014 task T003, definition of ready, AC-003 |
| D4 | 012 failure policy | A product failure does not block 012 when it is filed. It does block 014's PASS | 012 REQ-006, 014 verdict rule |
| D5 | 007 shared-run record | Confirm as designed | One line in 007's risk table |
| D6 | 008 same-user boundary | Confirm as designed | One line in 008's risk table |
| D7 | 014 after its fixes | No second review. Re-run the 012 scenarios whose phase a fix touched | 014 one task, one acceptance row |
| D8 | 002 first-failure notice | Defer, with an out-of-scope line. `delivery.onFailure` already reports each failure | 002 out-of-scope list |
| D9 | 002 streak after `bots enable` | Count only runs newer than a stored `enabledAt` | 002 REQ-006, state file |

**Edit `B/spec.md`.**

- Shared Records table: replace each shape description with a pointer to the matching section of `contracts/records.md`. Reword the guarded-write row to the lock file only (line 136).
- Phase map: mark 010 and 011 as phase parents once WO-08 and WO-09 land.
- Phase Handoff Criteria: add one paragraph stating the three closing handoffs (012 failures file to 014, 013 rebuttals and evidence to 014, 014 re-runs touched scenarios).

**Done when.** Every row of sections 4 and 5 that names a `contracts/` file can be answered from that file, and each of the nine decisions has a recorded choice.

### WO-02: 001-activity-and-actor

**Depends on.** WO-01.

| File | Edit | Content |
|---|---|---|
| `B/001-activity-and-actor/spec.md` | Apply the screen contract's section 12.1 items 1 to 7, verbatim | REQ-002 and REQ-003 rewritten with `version`, ordering and null rules. New REQ-011, refresh on read. New REQ-012, the source of `working`, `scheduled` and `recurring` rows. A Files to Change row for `status.ts`. The out-of-scope and edge-case lines. Source: `T/002-architecture-and-contracts/design/contracts.md` section 12.1 |
| Same file | Edit REQ-004 and REQ-010 | An answer stored before this phase reads `by: null` and `scope: "once"`. State it in both rows |
| Same file | Edit the `needs-you.ts` row | Point at `contracts/records.md` for the item and answer key sets |
| `B/001-activity-and-actor/acceptance-criteria.md` | Section 12.1 items 8 and 9 | AC-002 with seven row keys. New AC rows for REQ-011 and REQ-012. One new row for the old-answer read rule |
| `B/001-activity-and-actor/tasks.md` | Section 12.1 item 10, plus two tasks | T033 type-checks real output against the screen's sample files. One task for the refresh, one for the row sources |
| `B/001-activity-and-actor/plan.md` | Architecture section | Name where a run in flight is read from (the held lease) and where a next fire is computed. Add both to the test matrix |

The line numbers in section 12.1 were taken at commit `69ecfd0b1f9`. Match on the quoted text, not the number.

### WO-03: 002-routine-layer

**Depends on.** WO-01 (D8, D9).

| File | Edit | Content |
|---|---|---|
| `B/002-routine-layer/spec.md` | Apply the screen contract's section 12.2 items 1 and 2, verbatim | REQ-007 as an object with `version`, `routines`, `failureStreak` and the five-value `switch`. The `routine.ts` row gains `describeStart` |
| Same file | Edit REQ-006 | Add the restart rule: only runs newer than `enabledAt` count toward ten. State that `bots enable` writes `enabledAt` |
| Same file | Edit REQ-004 | State that the record's `until` object is `{met}` and nothing else |
| Same file | Edit the out-of-scope list | One line deferring the first-failure notice, per D8 |
| Same file | Edit the `routine-state.ts` row | Point at `contracts/records.md` for the state file: `schemaVersion`, `untilMetAt`, `fatiguedAt`, `fatigueItemId`, `enabledAt`, written through temp and rename, absent file reads as all null |
| `B/002-routine-layer/plan.md` | Architecture and matrix | A transition contract for fatigue and enable. Write order on fatigue: item, state file, switch. Write order on enable: answer the item, state file, clear the switch. Each step safe to repeat. Add four matrix rows: enable during a failing run, and a stop after each of the first two writes |
| `B/002-routine-layer/acceptance-criteria.md` | Section 12.2 item 3, plus two rows | AC-007 with the object check. One row for the streak restart. One row for the interrupted fatigue write |
| `B/002-routine-layer/tasks.md` | Section 12.2 item 4, plus two tasks | T031 with the object check and the sample type check. One task per new acceptance row |

### WO-04: 005-memory

**Depends on.** WO-01 (D1).

| File | Edit | Content |
|---|---|---|
| `B/005-memory/spec.md` | Edit REQ-001 and REQ-005 | The entry line. Recommended default: `- <type> \| <YYYY-MM-DD> \| <actor> \| <source> \| <text>`, split on the first four delimiters so a pipe in the text needs no escape. Whitespace in the text collapses to single spaces, as the reference does. Indexes are 1-based in file order and shift down after a forget |
| Same file | Edit line 265 | The last clause, per D1 |
| Same file | Edit REQ-004 | The `--list --json` shape, per D2: an object with `version`, `path`, `entries` and the two counts |
| Same file | Edit REQ-006, REQ-014, REQ-015 | Replace the described label and bound with pointers to `contracts/prompt-sections.md` |
| `B/005-memory/plan.md` | Architecture and matrix | Write protocol: append is one `appendFileSync` of one whole line, forget rewrites through temp and rename, a torn last line is skipped on read and reported. Add a concurrent axis to the matrix: two appends, and an append during a forget |
| `B/005-memory/acceptance-criteria.md`, `tasks.md` | Two rows, two tasks | One for the line grammar round trip with a pipe and a newline in the text. One for the append and forget race |

Record the entry line in `contracts/records.md` as part of this order, in the section WO-01 leaves for it.

### WO-05: 006-approval-grants

**Depends on.** WO-01.

| File | Edit | Content |
|---|---|---|
| `B/006-approval-grants/spec.md` | Edit REQ-014 | The lock file only. Add its lifetime rule: created with exclusive create, holds the writer's pid and a creation instant, and is broken when the pid is dead or the lock is older than a named bound |
| Same file | Edit REQ-001 | Point at `contracts/records.md` for the grant object and note the two `kind` vocabularies |
| `B/006-approval-grants/plan.md` | Rollback section | Replace the manual step with a pointer to `contracts/versioning.md` |
| `B/006-approval-grants/acceptance-criteria.md`, `tasks.md` | One row, one task | A lock left by a dead pid does not block the next answer |

### WO-06: 008-vault

**Depends on.** WO-01 (D6).

| File | Edit | Content |
|---|---|---|
| `B/008-vault/spec.md` | Edit REQ-005 | The name grammar. Recommended default: the bot id pattern `^[a-z0-9][a-z0-9-]*$` from `L/definition.ts:88`, with a 64 character bound |
| Same file | Edit REQ-007 | The mapping: upper-case the name and turn each hyphen into an underscore. It cannot collide, because the grammar admits no underscore. Add two worked names |
| Same file | Edit REQ-002 and REQ-004 | The keychain read and delete commands beside the write command, each with the value kept out of argv. `forget` and `resolve` use the backend the index records. `--store` on `forget` that differs from the record is refused by name. `set` on an existing name with another backend removes the old value first |
| Same file | Two new requirement rows | `secret-too-long` and `secret-store-unreadable`, each with its exit code |
| Same file | Edit REQ-014 | The redaction token `[redacted: <name>]`, and the exit of a withheld run |
| Same file | Risk table | One line recording D6 |
| `B/008-vault/plan.md` | Architecture | Index write through temp and rename. Order on `set`: value, read-back, index. Order on `forget`: index, value. A value file with no index entry is ignored by `list` and removed by the next `set` or `forget` of that name. Add concurrent and interrupted rows to the matrix |
| `B/008-vault/acceptance-criteria.md`, `tasks.md` | Five rows, five tasks | Grammar accept and refuse set. Mapping for a hyphenated name. Keychain forget. Two racing `set` calls. The two new refusals |
| `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md`, as a row in 008's Files to Change | Upgrade note | Before upgrading, run `bots secret set` for every name a `BOT.md` declares, or the bot is refused `secret-unknown` |

Record the index in `contracts/records.md` as part of this order.

### WO-07: 009-skills

**Depends on.** WO-01 (D1).

| File | Edit | Content |
|---|---|---|
| `B/009-skills/spec.md` | Edit REQ-004 | The five `proposal.json` keys by name, `schemaVersion`, and that `revisionRead` holds the SHA-256 digest of the target body or null. The `--name` default: the proposing bot's id |
| Same file | Edit REQ-005 | Keep or change the sentinel, per D1 |
| `B/009-skills/plan.md` | Architecture | The literal draft template: frontmatter keys, the sections, and which run-record field fills each. It must pass `validate_skill_package.py`. Write order: draft, `proposal.json`, review item last. A re-run with files present and no item overwrites the files. A re-run with an item present refuses as today |
| `.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md`, as a row in 009's Files to Change | Operator steps | After `accept`: move the draft into `.skilled/skills/<name>/`, commit, run `bots install`, check the pinned digest |
| `B/009-skills/acceptance-criteria.md`, `tasks.md` | Three rows, three tasks | The default name. The draft passes the validator. An interrupted proposal is repaired by a re-run |

### WO-08: 010-conversations becomes a phase parent

**Depends on.** WO-01 (D2).

**Before creating children.** Run `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` on the phase. The decomposition rule asks for a phase score of 25 or more and Level 3 [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:58-61]. 003's expansion is the precedent. If the rule is not met, keep 010 a leaf and create `B/010-conversations/design/` with the content of child 001 below. The design content is the same either way.

**Create these children.** The parent keeps `spec.md`, `description.json` and `graph-metadata.json`.

| Child folder | Scope in one line |
|---|---|
| `010-conversations/001-chat-ux-and-pane-map/` | Design only: the pane's frames, key map delta, component rows, the loop's printed form and the routing grammar |
| `010-conversations/002-conversation-runtime-and-chat-verb/` | Today's phase minus the pane: `conversation.ts`, the chat verb and loop, the drain filter, the conversation id on item and request |
| `010-conversations/003-chat-pane-and-proof/` | The crate changes, the fixture, the render tests, built from child 001 on top of 003's screen |

**Child 001 must hold a `design/` folder with these files.**

| File | Must hold |
|---|---|
| `design/mockups.md` | One frame per pane state at 80x24 and 120x40, in the style of `T/001-ux-and-component-map/design/mockups.md`: empty, loaded, composing, sending, reply arrived, parked with its item id, failed with its reason, redacted reply, load error, bot picker |
| `design/key-map-delta.md` | A seventh context, `chat`, added to 003's six. Which key enters text entry, which leaves it, what `Enter` and `Esc` do, and which global keys stay bound while typing |
| `design/component-rows.md` | Rows for 003's component inventory: transcript list, composer, bot label, status line, each with its data source and states |
| `design/pane-contract.md` | The `chat --transcript --json` payload with a field table and a sample file, per D2. The `sending` state and the rule that the send runs on the worker thread. What the pane draws for each message `role` and for an unanswered human message |
| `design/loop-transcript.md` | A literal sample session of `bots chat <id>`: the prompt string, a reply, the line shown while a run executes, a parked question, a failure, `/exit` |
| `design/routing-grammar.md` | The `@<bot-id>` grammar: position, what may follow, whether the prefix is stored in `text`, the refusal for an invalid id, the default conversation id for `bots chat <id>` |

**Child 002** takes the existing spec, plan, tasks and acceptance rows for REQ-001 to REQ-007 and REQ-009 to REQ-014. Change REQ-006 and its checks to the object envelope. **Child 003** takes REQ-008 and adds one acceptance row per frame in child 001.

**Order inside.** 001 and 002 in parallel, then 003.

### WO-09: 011-messaging-channels becomes a phase parent

**Depends on.** WO-01, WO-06 for the secret name grammar that `channels/config.json` uses, and child 002 of WO-08 for the chat path the terminal transport reuses.

**Before creating children.** Run `recommend-level.sh` as in WO-08. All three lineages recommend the parent.

**Create these children.**

| Child folder | Scope in one line |
|---|---|
| `011-messaging-channels/001-channel-ux-and-message-map/` | Design only: every message a person reads on each of the five surfaces |
| `011-messaging-channels/002-adapter-and-record-contracts/` | Design only: the capability table, every channel record, the inbound acknowledge sequence, the numbered conformance rules |
| `011-messaging-channels/003-link-roster-and-answer-gate/` | `channel-link.ts`, `operators.json`, the roster verbs, the surface check in `answer.ts` |
| `011-messaging-channels/004-approval-index-and-send-queue/` | `channel-approval.ts`, `channel-queue.ts`, the `delivery.ts` change |
| `011-messaging-channels/005-polling-transports/` | Telegram, Slack and the terminal transport, none of which needs a public URL |
| `011-messaging-channels/006-daemon-and-webhook-transports/` | Signal and WhatsApp, with the operator runbook for each |
| `011-messaging-channels/007-conformance-hardening-and-proof/` | The fake transport, the conformance suite, the notices, the documents |

**Child 001 must hold a `design/` folder with these files.**

| File | Must hold |
|---|---|
| `design/message-catalog.md` | The literal text of every outbound message: approval prompt, numbered prompt, link code reply, link confirmed, each refusal reply (`channel-unlinked`, `channel-locked` with seconds, `answer-not-approver`, `item-expired`), failure notice, uncertain delivery. One line stating that the 002 fatigue notice never reaches a chat |
| `design/mockups.md` | One mockup per surface: Telegram inline keyboard, Slack Block Kit, and the plain text form for Signal, WhatsApp and the terminal. Each for a two-option item, a yes or no item, a question over the chunk limit, and an expired prompt |
| `design/reply-grammar.md` | The accepted replies as a table, and what a line that matches none becomes |
| `design/golden/` | One text fixture per message in the catalog, read by `channel-transports.vitest.ts` |

**Child 002 must hold a `design/` folder with these files.**

| File | Must hold |
|---|---|
| `design/capabilities.md` | The capability keys and a matrix with one column per transport. This is the conformance fixture's input |
| `design/records.md` | Field tables and samples, each with `schemaVersion`: link record with its key, lockout record, approval index with its key structure, queue entry with its state enum and the backoff table as data, seen record, `channel list --json` |
| `design/inbound-sequence.md` | Per transport: when the provider is acknowledged relative to the durable enqueue, what is on disk if the process stops between the two, and how a redelivery is recognized |
| `design/conformance-rules.md` | The five rules numbered, each with its fixture |
| `design/operator-runbook.md` | Per transport: the credentials and scopes to create, the `bots secret set` and `bots channel link` commands, a preflight check, a health check, and what to do when a token is rotated |

**Order inside.** 001 and 002 first, in parallel. Then 003 and 004 in parallel. Then 005 and 006 in parallel. Then 007. The 23 requirements move to the child that owns their file row. REQ-019 takes the object envelope per D2.

### WO-10: 013-manual-testing-scenarios

**Depends on.** WO-01 (D2, D4).

| File | Edit | Content |
|---|---|---|
| `B/013-manual-testing-scenarios/spec.md` | Edit line 261 | The empty inbox prints `{"version":1,"items":[]}` |
| Same file | Edit REQ-006 and the handoff criteria | A scenario defect is fixed and re-run. A product failure is filed in `scratch/failures.md` with scenario id, phase, requirement, observed line and evidence path, and that file is a named input to 014 |
| `B/013-manual-testing-scenarios/acceptance-criteria.md` | Edit AC-006 | The same rule, and a check that each filed row has all five fields |
| `B/013-manual-testing-scenarios/tasks.md` | Edit T046 | Write the five fields. Copy `scratch/failures.md` beside `results.csv` in the run folder |

### WO-11: 014-skilled-and-doc-alignment

**Depends on.** WO-01.

| File | Edit | Content |
|---|---|---|
| `B/014-skilled-and-doc-alignment/spec.md` | New requirement, edit the handoff criteria | After the last run of each command, copy `report.md`, `findings.json` and `recheck.md` into `evidence/skilled-alignment/` and `evidence/doc-alignment/` in the phase folder. The handoff to 014 is `evidence/` and `scratch/rebuttals.md` |
| Same file | Edit the `topics.json` row | Paste one existing topic from the file as the model shape |
| Same file | One sentence | 013 fixes findings of every severity, and 014 leaves P2 open, by intent |
| `B/014-skilled-and-doc-alignment/acceptance-criteria.md`, `tasks.md` | One row, one task | `rg -n '^- Open findings: 0' evidence/*/report.md` prints two lines |

### WO-12: 015-deep-review

**Depends on.** WO-01 (D3, D4, D7).

| File | Edit | Content |
|---|---|---|
| `B/015-deep-review/tasks.md` | Edit T003 | Probe the five binaries and record which are present. At least one must be. An absent one is replaced per the plan's fallback order |
| `B/015-deep-review/plan.md` | Definition of ready and the setup row | The same wording, so setup and section 8.3 agree |
| `B/015-deep-review/spec.md` | Dependencies | Three inputs: `B/013-manual-testing-scenarios/scratch/failures.md`, `B/014-skilled-and-doc-alignment/scratch/rebuttals.md` and `B/014-skilled-and-doc-alignment/evidence/` |
| Same file | Handoff criteria and verdict rule | Each row of the two handoff files becomes a seeded finding. The verdict cannot read PASS while a filed product failure is open |
| Same file | New requirement | After the last fix, re-run each 012 scenario whose owning phase a fix touched, and record the result |
| Same file | Edit REQ-009 | The scope check exempts `review/` and `implementation-summary.md` |
| `B/015-deep-review/acceptance-criteria.md` | Edit AC-003, add two rows | AC-003 reads five lineages after fallback. One row for the seeded inputs, one for the scenario re-run |

### WO-13: 004-computer-exposure

**Depends on.** WO-01.

Edit `B/004-computer-exposure/spec.md`, the Design references table: replace the parent line citation for the section order with a pointer to `contracts/prompt-sections.md`. Nothing else.

### WO-14: 007-per-bot-apps

**Depends on.** WO-01 (D5).

Edit `B/007-per-bot-apps/spec.md`. In the risk table, add one line recording D5. In REQ-003, add one sentence: a tree found holding the filtered file at the next open is restored before anything else is written. Add one test row to the plan's integration table for a run killed before the restore.

### WO-15: citation refresh

**Depends on.** WO-02 to WO-14, and the research folder move being committed.

Across every phase document: replace each line-number citation into `B/spec.md` Shared Records with a citation of the record by name. Rewrite every citation of `specs/system-skilled-bots/002-openbot-parity-research/research/` to `.../002-openbot-parity-research/001-openbot-parity-research/research/`, and every citation of `B/research/` to `.../002-openbot-parity-research/002-plan-review-research/research/`. Check with one search per old path that prints nothing.

## 7. Findings Rejected, Downgraded or Upgraded

### Rejected: the cited evidence, or other packet evidence, contradicts the claim

| Finding | Claim | Why it fails |
|---|---|---|
| V3-2 (P0) | `answer.ts` is a contracts module whose imports break the README's direction rule. | The README lists `answer.ts` in the request pipeline group [SOURCE: L/README.md:33]. The rule binds contracts modules only [SOURCE: L/README.md:39]. |
| V9-4 (P0) | The packet has no schema version concept, and `run-record.ts` has no version field. | The run record carries and checks one [SOURCE: L/run-record.ts:197] [SOURCE: L/run-record.ts:239]. 001 states the rule [SOURCE: B/001-activity-and-actor/plan.md:66]. The true residue is X3. |
| V7-1 (P1) | The skill-name grammar is defined nowhere. | The plan defines it as the bot-id grammar [SOURCE: B/009-skills/plan.md:63]. |
| V8-5 (P1) | 014 has no rule for a host with fewer than five executors. | The plan has one [SOURCE: B/015-deep-review/plan.md:219]. The real defect is the contradiction `codex-2` found. |
| V9-5 (P1) | No phase has a rollback step. | Each plan has a rollback section [SOURCE: B/006-approval-grants/plan.md:144-148] [SOURCE: B/008-vault/plan.md:151-155]. |
| V2-5 (P1), and half of C1-2-1 | REQ-017 promises five conformance rules and names two. | The sentence carries five assertions: an unsupported result, no platform reached, no provider error, one matching observation, a receipt [SOURCE: B/011-messaging-channels/spec.md:204]. They match the reference checker [SOURCE: C/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:374-470]. My count of five is a reading of the sentence. A numbered list from the phase author would confirm it. Kept as P2. |
| C1-4-1 (P1) | Two concurrent runs write and restore one worktree's config with no lease. | Each worktree run makes its own numbered tree [SOURCE: L/isolation.ts:477-489]. One lease per bot, repository and spec target stops a second run of the same key [SOURCE: L/runner.ts:290-295]. So two live runs do not share a tree. The lineage tagged this as inference. A test with two overlapping runs of one bot would settle it. The residue is 007 gap 2. |
| C1-3-1, first half (P1) | 002 neither adopts nor defers the reference's cap of twenty routines. | It defers it by name [SOURCE: B/002-routine-layer/spec.md:113]. The second half, the first-failure notice, holds and is 002 gap 5. |

### Rejected: proposed expansion is larger than the gap

| Proposal | Why not |
|---|---|
| C1-1-2 and C1-3-1: 002 as a phase parent | `codex-2` and `vibe` both say amendment. Its gaps are a schema, a transition contract and four clauses. |
| C1-1-3: a child phase for the memory file format | One module owns the line [SOURCE: B/005-memory/plan.md:60]. |
| C1-1-4: a child phase for grant rollout and rollback | The rollback is written. The general rule belongs to the packet. |
| C2-1-2 and C2-1-3: 008 as a phase parent with two children | The access boundary is decided three times in the phase. `codex-1` iteration 4 and `vibe` both keep 008 one phase. |
| C2-2-4: 010 with four children | Three. Splitting the specified runtime half closes no gap. |
| C1-4-1: a child phase for 007 | The premise fails, above. |
| C1-5-1, C1-5-2, C1-5-3: three new addendum files in 012 to 014 | The rules fit in the existing requirement rows. A separate file per rule would be a second place to read. |
| V1-1: a new phase 015 for contracts | `vibe` reversed this itself in iteration 10. A folder is enough. |

### Downgraded

| Finding | From | To | Why |
|---|---|---|---|
| V1-1, V10-2 no schema or contract document | P0 | P1 | Most shapes exist as prose or test commands. The missing piece is one place to read them. |
| V1-2 memory line format | P0 | P1 | One module owns parser and renderer. Still a builder decision about a durable file. |
| V3-1 no target-state architecture document | P0 | P1 | Each phase names its modules. `codex-1` asked for the same artifact at P1. |
| V6-1, V6-2, C1-4-2 vault grammar and key mapping | P0 | P1 | A builder decision, not a contradiction. Two lineages grade it P0, and WO-06 treats it as first in its order. |
| V6-5 vault changes the meaning of `secrets` | P0 | P1 | The template ships `secrets: null` and this repository has no bots folder [SOURCE: B/007-per-bot-apps/spec.md:108]. |
| V9-1 no phase cites the refusal registry | P0 | P1 | 007 states the class of each refusal [SOURCE: B/007-per-bot-apps/plan.md:83]. The gap is 008, 009 and 011. |
| V10-3 008 needs an addendum | P0 | P1 | Follows from the rows above. |
| V5-6 the `kind` row contradicts the ownership rule | P1 | Rejected | The split is stated on purpose [SOURCE: B/spec.md:131] [SOURCE: B/001-activity-and-actor/spec.md:117]. |
| V5-2 `needs-you.ts` needs a serial merge rule | P1 | P2 | Phases run one after another [SOURCE: B/spec.md:169]. |
| V3-3 the prompt section order lives in one plan paragraph | P1 | P2 | The order is also a Shared Records row [SOURCE: B/spec.md:134]. What is missing is the literal text of each block, which is 005 gap 4. |
| V7-4 `proposal.json` fields are prose | P1 | P2 | The five keys are recoverable from the acceptance command [SOURCE: B/009-skills/acceptance-criteria.md:60]. |
| V9-2, V9-3 free-string cause, no owner for exit codes | P1 | P2 | The first describes existing code. For the second, every new refusal states its exit number. |
| V9-7 no phase says which refusals are before dispatch | P1 | P2 | The registry is documented as before dispatch only [SOURCE: L/runner.ts:122]. |
| C2-1-1 shared runs expose every app | P0 | P2 | A named and tested limit. |
| C2-1-2 the grant is not a per-bot boundary | P0 | P2 | An accepted residual with its own requirement and test. |
| C2-2-2 skill activation handoff | P1 | P2 | The copy is out of scope by decision. Four lines of operator text close it. |
| C2-2-3 transcript retention | P1 | P2 | A stated deferral. |

### Upgraded, or vindicated by later evidence

| Finding | From | To | Why |
|---|---|---|---|
| V7-3 sentinel conflict between 005 and 009 | P1 | P0 | Two documents cannot both be followed. |
| V7-5 draft `SKILL.md` shape | P2 | P1 | The draft is what an operator reviews, and it is generated with no model call, so the template is the whole design. |
| V4-1, V4-3 the packet has no envelope rule, and chat is the one array among objects | P1 | P1 | In the draft I marked these weak and regraded the rule to P2, because `routines` was then also a bare array by its own checks. The screen contract has since adopted the object rule and changed `routines`, which leaves chat as the outlier `vibe` said it was. The claim was wrong about the documents it read and right about the direction. |

## 8. Citation Check

I marked all 102 findings. For each I opened the cited lines or searched for the claimed absence.

| Lineage | Findings | Confirmed | Weak | Wrong | Not verified |
|---|---|---|---|---|---|
| `vibe` | 73 | 52 | 14 | 6 | 1 |
| `codex-1` | 18 | 15 | 3 | 0 | 0 |
| `codex-2` | 11 | 9 | 2 | 0 | 0 |
| Total | 102 | 76 | 19 | 6 | 1 |

**Confirmed** means the claim holds, whatever I did to its severity. **Weak** means part of the claim is contradicted by a document or runtime file the lineage did not read, or it rests on counts I did not reproduce. **Wrong** means the first six rows of section 7. The one unverified finding is `vibe`'s ranked order (V10-8), which is judgment.

**`vibe` line accuracy.** Of roughly 100 citations I opened, about 60 land on the cited line or inside the range, and about 35 point at the right file with the right content between one and ten lines away. The drift is not from a moving file: no phase document outside 003 had a commit after 21:10 CET, and the lineage started at 22:22 CET. Six citations are attached to a claim the file contradicts.

**Codex line accuracy.** Every Codex citation I opened lands inside its cited range. Three caveats. One citation has a doubled path segment and resolves to no file as written (C2-2-2). Four findings carry an inference tag where a source tag was asked for (C2-1-3, C2-2-4, C1-4-1, C1-4-3). Codex writes several ranges after one path, as in `spec.md:42-52,115-120`. `R/resource-map.md` lists 22 references as missing on disk, and every one I checked is that format, not a missing file.

**Novelty.** `codex-2` iteration 4 reports a new-information ratio of 1 and repeats a point three lineages already held. `codex-2` iteration 5 has no findings. `codex-1` iteration 2 mostly confirms `vibe` on 011 and adds four specifics. The new ground from Codex is: the 014 contradiction, the 012 to 014 handoff, the 011 inbound acknowledge boundary, the 002 enable race, the 009 proposal write order, and the 005 write protocol found twice.

**The pattern behind `vibe`'s weak and wrong marks.** It ran ten iterations in about eight minutes and in several read a phase's `spec.md` only. Five of its six wrong findings are answered in the same phase's `plan.md` or in the runtime file it cited. Its absence claims are reliable where I re-ran the search and unreliable where a plan could hold the answer.

**Severity.** `vibe` graded 13 findings P0. I keep one (011's width), raise one of its P1s to P0 (the sentinel), reject two and move ten to P1. Codex graded three findings P0. Two are decided residuals I regrade to P2, and one is the vault consolidation I hold at P1. The four P0s in this synthesis are 011's width and three contradictions, two of which no lineage graded P0 and one of which no lineage found.

**What no lineage found.** The empty-inbox contradiction between 012 and 001. The streak that re-trips after `bots enable`. The missing data source for three activity groups, which the screen's design contract found. The lock lifetime in 006. The pane's blocking send and missing input context in 010.

## 9. Reconciliation Against the Merged Registry

All 102 registry findings, by short id, with my mark and where each lands. `C` is confirmed, `W` weak, `X` wrong, `U` not verified. A gap reference such as `008-1` is phase 008, gap row 1 in section 4. `S7` is section 7.

| Iteration | Findings and disposition |
|---|---|
| V1 | 1 C X1. 2 C 005-2. 3 C 001-4. 4 W 002-1. 5 W X2. 6 W 002-6. 7 C 001-5 |
| V2 | 1 C 011-1. 2 C 011-2. 3 C 011-4. 4 C 011-4. 5 X S7, 011-8. 6 C 011-9. 7 C 011-6 |
| V3 | 1 C X10. 2 X S7. 3 W WO-01 prompt sections. 4 C X7. 5 C X10. 6 C X11. 7 C no action, optional design-reference table per phase |
| V4 | 1 W X2. 2 C X2. 3 W S7, 010-4. 4 C X2 stdout rule. 5 C 001-6 |
| V5 | 1 C 001-3. 2 W S7. 3 C 006-4. 4 C X1 request record. 5 C 001-4. 6 W S7. 7 C no action, a self-correction |
| V6 | 1 C 008-1. 2 C 008-2. 3 C 008-7. 4 C 008-4. 5 C 008-6. 6 C 008-5. 7 C 008-3. 8 C 008-8 |
| V7 | 1 X S7. 2 C 009-2. 3 C 009-1. 4 W 009-6. 5 C 009-3. 6 C 012-2. 7 C no action, scenario preconditions stay in the root index. 8 C 012-3 |
| V8 | 1 C 013-1. 2 C 013-2. 3 C 014-3. 4 C 014-2. 5 X S7. 6 C 013-3. 7 C 013-4. 8 C 014-4 |
| V9 | 1 W X4. 2 C S7, P2. 3 C X4. 4 X S7, X3. 5 X S7. 6 W X3, 008-5. 7 W S7. 8 C 008-7, X4 |
| V10 | 1 C 011-1. 2 C X1. 3 C 008. 4 W rolls up the addenda and inherits V7-1. 5 W rolls up the closing rules and inherits V8-5. 6 C 010-1, 011-5. 7 C 004 and 007 verdicts. 8 U superseded by section 6 |
| C1-1 | 1 C 001-3. 2 W 002-1, parent rejected. 3 C 005-2, 005-3. 4 C 006-3 |
| C1-2 | 1 C 011-2, half in S7. 2 C 011-3. 3 C 011-4. 4 C 011-5. 5 C 011-6. 6 C 011-1 |
| C1-3 | 1 W 002-5, half in S7. 2 C X10 |
| C1-4 | 1 W S7, 007-2. 2 C 008-1 to 008-6. 3 C 009-4, 009-2 |
| C1-5 | 1 C 012-2. 2 C 013-1, 013-2. 3 C 014-3 |
| C2-1 | 1 C 007-1. 2 C 008-9. 3 C 008-5 |
| C2-2 | 1 C 005-3. 2 W 009-5. 3 W 010-7. 4 C 010-1 |
| C2-3 | 1 C 012-2, 014-2. 2 C 014-1 |
| C2-4 | 1 C 002-2. 2 C 011-5, 011-7, 011-1 |
| C2-5 | No findings |

Nothing is dropped. Three `vibe` findings are confirmed and carry no work: V3-7, V5-7 and V7-7.

## 10. What Is Still Uncertain

1. **The parent verdicts for 010 and 011 are not scored.** The spec-kit rule needs a phase score and a Level 3 result, and I ran neither script. Each phase's own complexity table is no guide: 011 scores itself 32 of 70 and 008 scores itself 38. WO-08 and WO-09 each begin with the check, and WO-08 names its fallback.
2. **Nine operator decisions are open.** D1 to D9 in WO-01. Each has a recommended default, and none is mine to take.
3. **The count of five conformance rules is my reading of one sentence.**
4. **The 007 rejection rests on my reading of two runtime files.** I did not run two overlapping runs.
5. **The 002 streak finding is inferred.** The plan says the streak counts from run records and says nothing about a floor. A sentence I missed would close it.
6. **The screen's design contract is new and unreviewed by any lineage.** I folded its section 12 into WO-02 and WO-03 as written and verified only the two runtime facts its largest claim rests on.
7. **The research folder move was in progress while I wrote.** Counts in X6 are a snapshot. Phase documents were being edited by another writer at the same time, so a line number in this document may be off by the time it is read. The quoted content is the anchor.
8. **Absence claims marked inferred** each rest on a search across the phase's spec, plan, tasks, acceptance criteria and goal. I did not read every phase document end to end.
9. **Reference files for 001 and for 010's pane are matched by content and by name.** Neither phase cites them.
