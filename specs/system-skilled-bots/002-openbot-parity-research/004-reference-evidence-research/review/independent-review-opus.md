# Independent Review of the Reference Evidence Synthesis

Prefixes follow research.md section 1. `C/` is `specs/system-skilled-bots/context/`. `B/` is `specs/system-skilled-bots/003-openbot-parity-build/`. `L/` is `.skilled/skills/system-skilled-bots/runtime/lib/`. `R/` is `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/`. Every tag below is a line I opened in this review.

## 1. Verdict

Most of the synthesis is safe to act on. The reference reads I repeated held up. That covers the firing frame, the paste hazard in the screen, the Telegram `5xx` contradiction, the conformance fixture contradiction, the Slack block caps, the webhook `409` branch, the encoded leak forms, the deny sentence, the skill directory lines, the label tension in 009 and the 014 ledger gap. The licence claims I checked are all right. The problems sit in the recommended fixes more than in the readings. Three fixes would send a builder the wrong way. 009 says to put a live-model scenario into 012, which 012 forbids. The stall watchdog is sized as one timer, but the dispatch is a blocking `spawnSync` in another skill's shared module. 006 says to key future standing answers on tool and account, and the plan has already decided the runtime cannot see a tool. About ten more rows overstate a grade, miss a plan line that already covers them, or broaden the reference. The net-new ranking needs a redo for candidates 1, 3 and 12. The plain rendering inherits every one of these errors and drops the licence caveats from the net-new list. My view is to revise sections 2, 3 (006, 008, 009, 010), 5 and the plain rendering before a builder uses them. The rest can stand.

## 2. Revisions Needed

### Must fix

**M1. 009 tells a builder to put a live-model scenario into 012, which 012 forbids.**
- Location: research.md section 3, 009 lift row 2 and pitfall row 2 (P2-10-1, V2-9-2). Both are graded `confirmed`. Plain rendering, 009 item 3.
- What is wrong: lift row 2 says the adherence case "belongs with 012's scenarios". Pitfall 2 says "Add one live scenario per skill shape in 012". 012 rules this out. Its plan says no scenario calls a model, and its spec rules out a new automated test. The synthesis knows this in other places. Section 10 eliminates "a model-trial corpus for 012", 012 differs row 1 sides with the stub executor, and net-new candidate 7 says the same check needs a tool-call trace that the run record does not hold. So the document contradicts itself, and the 009 instruction cannot be followed.
- Evidence: [SOURCE: B/013-manual-testing-scenarios/plan.md:127] [SOURCE: B/013-manual-testing-scenarios/spec.md:114] [SOURCE: B/013-manual-testing-scenarios/spec.md:204] [SOURCE: R/research.md:680] [SOURCE: R/research.md:482]
- Proposed revision: in 009 lift row 2 replace "so it belongs with 012's scenarios, not with vitest" with "It needs a live model and a tool-call trace, so no planned phase can host it. 012 calls no model. It is net-new candidate 7." In 009 pitfall 2 replace the guard with "No guard in this build. Record the label wording as an open risk in 009 and point at net-new candidate 7." Regrade pitfall 2 to `weak`, because its guard has no home. Change plain 009 item 3 to "Later, not in this build: a live adherence check (net-new 7). 012 calls no model."

**M2. The stall watchdog (net-new candidate 3) is sized and ranked as one timer, but the dispatch blocks.**
- Location: research.md section 5, candidate 3 (V2-10-9), and ranked order item 3. Section 2 "Net-new".
- What is wrong: the row says the build needs "a timer reset on each stdout chunk of the child". The bots runtime dispatches through `runAuditedExecutorCommand`. That function calls `spawnSync` and sends the child's stdout straight to a file descriptor. The runner itself notes that the audited spawn blocks the event loop. No in-process timer can run during a dispatch, and no stdout chunk reaches the parent. Inferred from these lines: the watchdog needs either an async dispatch inside `system-deep-loop`'s shared executor module, which another skill owns, or a separate watcher that polls the stdout file and kills the child. Either way it is not "one timer and one cause".
- Evidence: [SOURCE: L/dispatch.ts:601] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1607] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1612] [SOURCE: L/runner.ts:892-893]
- Proposed revision: in the candidate 3 row, change "What a file-backed version needs" to "An async dispatch or a watcher process that tracks the stdout file's size, because the audited spawn is synchronous and writes stdout to a file. The executor module is shared with system-deep-loop, so the change crosses a skill boundary." Add `system-deep-loop executor-audit` to "Depends on". Move it below candidates 4, 5 and 11 in the ranked order. Drop "One timer and one cause" from ranked item 3.

**M3. 006 recommends a standing-answer key the runtime cannot observe.**
- Location: research.md section 2, highest stakes item 4. Section 3, 006 pitfall row 2 (V1-4-3, V2-10-2, V2-1-2, P1-1-6), graded `confirmed`. Plain rendering, 006 item 2.
- What is wrong: the row says to change "bot plus kind" to "bot, tool, place and account, each exact". The plan has already decided that the gate reads the question text because a tool name would need the executor's tool surface. The synthesis's own 007 row says the runtime never sees a tool call. A builder who writes the new key into 006 spec lines 205 and 271 writes a key that no part of the runtime can fill. The reference reading is right. The fix is wrong for this architecture.
- Evidence: [SOURCE: B/006-approval-grants/spec.md:272] [SOURCE: B/006-approval-grants/spec.md:202] [SOURCE: B/006-approval-grants/spec.md:205] [SOURCE: C/OpenBot-main/docs/approvals.md:22] [SOURCE: R/research.md:247]
- Proposed revision: replace the guard with: "Record in spec.md lines 205 and 271 that bot plus kind is wider than the reference, which keys on bot, tool, place and account. The runtime sees no tool and no account, so the next packet must either gain a tool surface or narrow the key with what the gate holds: the bot, the kind, the checkout and the exact action text. A bot-plus-kind allow must not ship as is." Keep `confirmed` for the reference half. Mark the fix as judgment. Change plain 006 item 2 to match.

### Should fix

**S1. 006 pitfall 3 widens a check-in rule to every routine.**
- Location: research.md section 3, 006 pitfall row 3 (V2-1-1, V2-3-4, V2-10-3, V2-1-2, V1-4-2). Plain rendering, 006 item 3.
- What is wrong: the guard says to refuse a standing answer "for an item a routine run raised". The reference refuses one only for a task a check-in started. OpenBot runs an acting routine with its creator's own grants. Lift row 1 states the rule correctly, and pitfall 3 does not.
- Evidence: [SOURCE: C/OpenBot-main/shared/standing-rule.ts:10-12] [SOURCE: C/OpenBot-main/docs/approvals.md:15] [SOURCE: C/OpenBot-main/docs/routines.md:186-188] [SOURCE: B/002-routine-layer/spec.md:120]
- Proposed revision: "refused for an item raised by a `does: tell` routine, which is the plan's check-in". Or keep "any routine run" and label it the plan's own stricter choice, with no reference behind it. Fix plain 006 item 3 the same way.

**S2. 008 lift row 1 and section 2 lift 3 present an already planned lift as new.**
- Location: research.md section 2, lift 3. Section 3, 008 lift row 1 (V2-1-8, V1-5-1). Plain rendering, 008 item 1.
- What is wrong: section 2 says the plan's one-line description "drops both" the state cap and the fallback. The plan already lifts the file whole with a statement of changes. Its test plan already names "the state cap falling back to a per-value scan". The verifier searched only the two constant names.
- Evidence: [SOURCE: B/008-vault/plan.md:142] [SOURCE: B/008-vault/tasks.md:78] [SOURCE: B/008-vault/spec.md:119] [SOURCE: C/rakazo-main/packages/core/src/messages/secret-matcher.ts:21]
- Proposed revision: remove lift 3 from section 2. In 008 lift row 1, replace the absence sentence with "The plan already lifts the file and tests the state-cap fallback (plan.md:142). Only `BUILD_COST` is unnamed, and lifting the file whole keeps it." Regrade to `weak`, since the claimed gap is mostly absent.

**S3. 008 pitfall 1's guard leaves the plan lines that cause the trap in place.**
- Location: research.md section 3, 008 pitfall row 1 (V2-1-6, V1-5-3, S). Plain rendering, 008 item 2.
- What is wrong: the reading is right. rakazo's set leaves out the AC-010 value, and the gate opens under Vitest. But the guard names only leak-checks.md section 1. T013, spec.md lines 102 and 120 and plan.md line 83 still say to lift `secrets-guard.ts`, and AC-012 still counts two lifted files. A builder who follows T013 lifts `isDevSecretAllowed` with the file. The file holds no single placeholder check to lift either, because each `resolve*` function inlines its own.
- Evidence: [SOURCE: B/008-vault/tasks.md:79] [SOURCE: B/008-vault/spec.md:102] [SOURCE: B/008-vault/plan.md:83] [SOURCE: B/008-vault/acceptance-criteria.md:71] [SOURCE: C/rakazo-main/packages/core/src/node/secrets-guard.ts:25-30] [SOURCE: C/rakazo-main/packages/core/src/node/secrets-guard.ts:154]
- Proposed revision: add to the guard: "Rewrite T013, spec.md lines 102 and 120 and plan.md line 83 to lift only the eight constants at lines 1-12 and `timingSafeStringEqual` at line 154, and write the placeholder check fresh. AC-012 keeps two notice entries, because the constants and the compare are still lifted text."

**S4. 005 differs row 1 understates what a stable memory id changes.**
- Location: research.md section 3, 005 differs row 1 (P1-4-1, S). Plain rendering, 005 item 1.
- What is wrong: the row says an id "costs one field and removes the shift rule". The shift rule is part of a shared contract, the memory entry line in `contracts/records.md` section 7. The change also moves the `--list --json` shape, REQ-004, REQ-005, the `memory-entry-unknown` refusal text and the 3,600-byte budget. The row also lists the race "two forgets at once lose one removal" as part of the problem. An id does not fix that race, since the second rename still wins.
- Evidence: [SOURCE: B/contracts/records.md:266] [SOURCE: B/005-memory/spec.md:151-152] [SOURCE: B/005-memory/design/module-contract.md:95]
- Proposed revision: "A per-entry id changes contracts/records.md section 7 (five fields to six, and line 266's shift rule), cli-json section 3.2, REQ-004 and REQ-005, and it costs bytes against the 3,600 cap. It fixes the shifted-index hazard, not the two-forget race." Keep `confirmed` for the reference reading.

**S5. Net-new candidate 1 turns a per-action budget into a per-run cap and still grades it confirmed.**
- Location: research.md section 5, candidate 1 (P1-9-3, P1-10-3). Section 2 "Net-new".
- What is wrong: tinysecurity's budget is per action, an hourly budget on a registered command scope that is read at each tool or shell admission. The candidate counts dispatched runs per bot. That is a fair design translation, but the lines do not state it. The table title says "actions per hour", and the bottom line and the build need say runs. Candidate 2 also adds "a cap on runs per conversation per hour", which overlaps.
- Evidence: [SOURCE: C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs:1-7] [SOURCE: C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs:95-98] [SOURCE: R/research.md:476-477]
- Proposed revision: retitle it "A per-bot cap on dispatched runs per hour". Add "The reference caps tool actions inside a policy scope. A run cap is this plan's translation." Grade it `weak`. Move the per-conversation cap out of candidate 2 into candidate 1 as an optional second key.

**S6. Net-new candidate 12 (tool-name wording) has no surface to apply to.**
- Location: research.md section 5, candidate 12 (P1-5-6, P1-10-3), graded `confirmed`.
- What is wrong: the row says the function serves "activity rows and needs-you questions" and that people skim "activity rows full of raw names". The synthesis's own regrade log rejects V2-3-3 because 001's rows hold no tool name. The activity row keys confirm that. The runtime never sees a tool call (007 differs row 1). Needs-you questions are bot prose, not tool names.
- Evidence: [SOURCE: B/001-activity-and-actor/spec.md:167] [SOURCE: R/regrade-log.md:21] [SOURCE: R/research.md:247]
- Proposed revision: regrade to `weak` and state "No surface in this build prints a tool name. It applies only if a later packet records tool calls." Move it to the bottom of the ranked order.

**S7. 002 differs row 1 offers "state the residual" as if it were missing.**
- Location: research.md section 3, 002 differs row 1 (V2-4-5). Section 2, highest stakes item 7. Plain rendering, 002 item 2.
- What is wrong: the out-of-scope list already names "the check-in frequency cap of once an hour" and treats `does: tell` as the whole check-in surface. The gap is recorded. What is weak is the stated reason, "no check-in store exists", because the floor checker could read `does`. The reference reading holds: OpenBot's form turns "Only tell you" into a check-in, which starts at most once an hour.
- Evidence: [SOURCE: B/002-routine-layer/spec.md:120] [SOURCE: C/OpenBot-main/docs/routines.md:19-20] [SOURCE: C/OpenBot-main/docs/routines.md:48-49]
- Proposed revision: "The cap is already deferred at spec.md:120, but its reason does not hold, since the floor check can read `does`. Either add a 3,600-second floor for `does: tell` or rewrite the reason." Change plain 002 item 2 from "or record the gap" to "or fix the reason for the recorded deferral".

**S8. 010 pitfall 1 is graded confirmed, but its central claim is inferred. Section 2 states it as fact.**
- Location: research.md section 3, 010 pitfall row 1 (P1-6-3). Section 2, highest stakes item 1, second half.
- What is wrong: the row itself says "Inferred from REQ-005 and from how a terminal delivers a paste" that three pasted lines start three runs. Under the brief's own definition, an inferred claim is `weak`. Section 2 says "a three-line paste into `bots chat` starts three runs" with no caveat, and section 2's "What would change this answer" does not list it among the inferences. Inferred by me: a cooked-mode Node readline does split pasted lines, so the claim is likely true. But no reference line or probe shows it.
- Evidence: [SOURCE: B/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:156] [SOURCE: R/research.md:336] [SOURCE: R/research.md:62]
- Proposed revision: regrade the row to `weak`. In section 2 write "is likely to start three runs (inferred)". Add it to the list of inferences in "What would change this answer".

**S9. The plain rendering drops the licence caveats and grades from the net-new list and inherits M1 to M3 and S1 to S8.**
- Location: plain-recommendations.md, "Net-new ranked" and the items named above.
- What is wrong: research.md marks candidates 1, 2, 5, 9, 13 and 14 as "GPL-3.0-only, mirror the design, copy no code", and candidates 3, 6, 10 and 11 as `weak`. The plain list gives sixteen bare names in rank order. It also drops research.md's line that "None of the sixteen is needed for parity". Plain 005 item 5 says "operator confirms each remembered fact (solid)", but research.md's 005 differs table has no such row (see m6). Plain 004 item 1 matches the row better than section 2 does.
- Evidence: [SOURCE: R/research.md:476-491] [SOURCE: R/research.md:514]
- Proposed revision: add "(GPL, design only)" and "(likely)" tags to the net-new list. Add "None is needed for parity." Apply the M and S revisions above to the plain items they name.

### Minor

**m1. 002 pitfall 1 (fatigue streak) says no rule exists, but REQ-006 chooses stop on purpose.** REQ-006 says the count stops at the first record that is not a failed run, "so neither kind is ever counted". The consequence the row names is real. The plan chose it, and nobody missed it. OpenBot keeps a busy dispatch out of the routine's own count, which supports skipping a refusal. [SOURCE: B/002-routine-layer/spec.md:173] [SOURCE: C/OpenBot-main/docs/routines.md:125-127]. Revision: "REQ-006 chooses stop. Reconsider skip for a null-class refusal, which the reference's busy-dispatch rule supports."

**m2. Section 2 highest stakes item 1 says a paste "can answer an item nobody named".** In the overlay the item is the one the operator opened. On the inbox tab a pasted newline opens the selected row, and a pasted `y` then approves it. The row quotes spec.md:213 as "no keystroke answers an item the operator did not name", but the line reads "No key denies an item the operator did not name". [SOURCE: B/003-terminal-screen/005-answer-flow/spec.md:213] [SOURCE: B/003-terminal-screen/005-answer-flow/design/state-machines.md:41] [SOURCE: B/003-terminal-screen/001-ux-and-component-map/design/key-map.md:52]. Revision: "a pasted `y` approves the open or selected item without the operator typing it". Quote NFR-S03 as written. The hazard and the guard stand.

**m3. 002 lift row 1 (firing frame) is the first lift in section 2 with no caveat.** The row itself says the transfer is inferred, because this runtime offers no routine tool. Section 2 should carry the same word. [SOURCE: R/research.md:100] [SOURCE: R/research.md:40].

**m4. Net-new candidate 4 (health probe) misses the read half that already exists.** `bots status` already joins install records with `launchctl print` and reports loaded state and last exit. [SOURCE: L/status.ts:8] [SOURCE: L/status.ts:370] [SOURCE: .skilled/bin/bots.cjs:336]. Revision: "The probe reuses `statusReport`. Only the silent-on-no-change delivery is new." The size shrinks.

**m5. The tool-name.ts correction names S3 only.** S1's reuse table is where the error starts: "Action-kind classifier | OpenBot `shared/tool-name.ts`". [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:125]. Revision: name S1 section 14 beside S3:135 in section 2 and in 006 pitfall 1.

**m6. Section 10 cites "Section 3 phase 005 differs row 4", which does not exist.** The 005 differs table has three rows. The nearest row is 009 differs row 3. [SOURCE: R/research.md:673] [SOURCE: R/research.md:185-189]. Revision: point it at 009 differs row 3, or add the 005 row it means.

**m7. Section 2 lift 4 (buzz `workspace_section`) is a citation, not a lift.** The row's action is "Mirror, copy no code ... The one change is to cite buzz in REQ-001". Nothing is built. [SOURCE: R/research.md:158]. Revision: move it to "Corrections to the earlier syntheses", where it already appears.

**m8. Net-new candidate 2 duplicates 011 pitfall 4.** Both add an outcome field to the seen record. [SOURCE: R/research.md:370] [SOURCE: R/research.md:477]. Revision: candidate 2 should cite 011 pitfall 4 for the field and keep only folding as new.

## 3. Findings That Should Be Restored

None with strong support. I checked the drops below and they hold. One sits on the border.

- P1-7-3 (a test that a deferred feature stays absent): logged `wrong` because the reference test checks the opposite case and BOT-029 covers `--scope always`. The reference half is wrong as logged. [SOURCE: C/openhuman-full/tests/cost_cap_removed.rs:1] But BOT-029 covers one deferral, and the lineage named others such as `bots skill accept` and `--demo`. [SOURCE: B/013-manual-testing-scenarios/spec.md:145]. A row that says "012 asserts one deferral, not all" would be a fair `weak` note. It is low value, and 012's REQ-011 may bar it.

A cross-check found no orphan. Every numbered finding in all 40 records appears under its id in research.md or the regrade log. The findings that one slice dropped as "another slice's" were all picked up or rejected by the owning slice (P1-1-7, P1-6-2, V2-3-2, P1-2-2).

## 4. Checked and Holds

- 002 lift 1, firing frame: the reference says it, and the plan has no framing rule in prompt-sections.md or 002. [SOURCE: C/OpenBot-main/shared/routine-firing.ts:9-13] [SOURCE: C/OpenBot-main/shared/routine-firing.ts:42-46]
- 001 notice entry needs a third file for the frame: REQ-006 names two files. [SOURCE: B/001-activity-and-actor/spec.md:179]
- 001 pitfall 1, the double-listing window: the item and the stamp are written before the record. [SOURCE: L/runner.ts:1116-1120]
- 003 pitfall 1, bracketed paste: no hit for paste in the plan. crossterm 0.29.0 emits `Paste` only when the mode is on, `bracketed-paste` is a default feature, and `\r` maps to Enter (registry source, `src/event.rs:559-562` and `parse.rs:92-93`). `y` approves in `Idle`. [SOURCE: B/003-terminal-screen/005-answer-flow/design/state-machines.md:41]
- 006 pitfall 4, the deny sentence: the reference text is as quoted, and mockups 5.1 carries only "Continue the work". [SOURCE: C/OpenBot-main/shared/approval-outcomes.ts:22-23] [SOURCE: B/006-approval-grants/design/mockups.md:173-174]
- 006 pitfall 1, tool-name.ts is not a classifier: it is a display namer. [SOURCE: C/OpenBot-main/shared/tool-name.ts:15-29]
- 006 differs row 1, kind order: line 5 order differs from the table. [SOURCE: C/OpenBot-main/docs/approvals.md:5]
- 008 pitfall 2, the encoded forms: tinysecurity builds four base64 forms, the plan scans two plus plain, and the vault stores hex. [SOURCE: C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/patterns.rs:248-249] [SOURCE: B/008-vault/design/leak-checks.md:73] [SOURCE: B/008-vault/design/backends.md:41]
- 008 pitfall 1, the reference half: the set at lines 17-23 leaves out line 1, and the gate is at lines 25-30. [SOURCE: C/rakazo-main/packages/core/src/node/secrets-guard.ts:17-30]
- 009 lift 1, the skill directory lines. [SOURCE: C/OpenGhost-main/skills.js:90-91]
- 009 pitfall 1, the label tension. [SOURCE: B/contracts/prompt-sections.md:90]
- 009 pitfall 4, the symlink: `local-webflow` points outside the repository (`ls -l`).
- 009 pitfall 5, the stale "always refused" sentence against D11. [SOURCE: B/009-skills/spec.md:162] [SOURCE: B/contracts/prompt-sections.md:212]
- 005 pitfall 2, spec.md:96 against REQ-010. [SOURCE: B/005-memory/spec.md:96] [SOURCE: B/005-memory/spec.md:162]
- 005 differs row 1, the reference half: OpenGhost removes by id and turnstone upserts by identity. [SOURCE: C/turnstone-main/docs/memory.md:38-39]
- 011 lift 2, sent-before-error first: the reference flag and the queue order, the plan's Telegram `5xx` retryable against WhatsApp `5xx` unknown, and no precedence in records.md. [SOURCE: C/tinychannels-main/src/providers/telegram/channel_send.rs:928-934] [SOURCE: C/tinychannels-main/src/delivery/queue.rs:260-266] [SOURCE: B/011-messaging-channels/002-adapter-and-record-contracts/design/records.md:181-184]
- 011 lift 1, the webhook `409`. [SOURCE: C/tinychannels-main/src/providers/telegram/channel_ops.rs:1935-1945]
- 011 lift 4, the Slack 3,000 and 75 caps against the 3,900 chunk with a section block. [SOURCE: C/tinychannels-main/src/providers/slack/blocks.rs:7-11] [SOURCE: B/011-messaging-channels/001-channel-ux-and-message-map/design/mockups.md:150]
- 011 lift 5, the synthetic fixture against child 007. [SOURCE: B/011-messaging-channels/002-adapter-and-record-contracts/design/conformance-rules.md:33] [SOURCE: B/011-messaging-channels/007-conformance-hardening-and-proof/plan.md:61]
- 013 differs row 1: the hand-edited help against `VERB_SPECS` holds as judgment. 013's plan allows editing the help block. [SOURCE: B/014-skilled-and-doc-alignment/plan.md:109]
- 014 pitfall 1: five ledger columns, CHK-012 counts a word the golden lacks. [SOURCE: B/015-deep-review/tasks.md:231] [SOURCE: B/015-deep-review/design/fixtures/fix-ledger.md:5-10]
- 004 lift 1, buzz `workspace_section`, and its licence. [SOURCE: C/buzz-main/crates/buzz-acp/src/pool.rs:2284-2289] [SOURCE: C/buzz-main/Cargo.toml:46]
- Corrections: S3:111 said none for 004, and S3:379 set the positional index. S1 section 14 leaves out tinychannels. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:111]
- Licences, read from each LICENSE file: OpenBot, OpenGhost and hermes-muse are MIT. rakazo, turnstone, buzz and OpenMausBot are Apache-2.0, with OpenMausBot's `enterprise/` carve-out. tinychannels and openhuman are GPL-3.0. The openhuman workspace, tinychannels and tinysecurity manifests say `GPL-3.0-only`. buzz crates inherit Apache-2.0 from the workspace.
- Regrade log sample. I checked 31 `wrong` and `dropped` rows against the plan line they cite, across every phase group, and all held. Examples: V1-1-6, V2-4-1, P2-3-3 (slot-lister lines 11-15), V1-3-5 (architecture.md lines 44-48), P1-1-4, V2-5-3, P1-1-6 (`expiryDays: 7`), V1-5-2, V2-1-11 (spec.md:240), P2-1-3 (inbound-sequence.md lines 21-31), P2-2-1, V2-8-5, V2-8-6, P1-9-4 and P1-2-2. For 8 of them I also opened the iteration record (P2-3-3, V2-1-11, P1-9-4, V2-8-6, P1-7-3, P2-1-3, V2-10-7, and pi-2 and vibe-2 iteration 10).
- Section 2 counts (121 rows, 90 confirmed, 31 weak) match the section 8 table.

## 5. Not Checked

- I did not open the cited lines for 001 differs rows 1 and 2, 001 pitfall 2, 003 pitfalls 2 to 5, 004 differs rows, 005 lift 1 and differs rows 2 and 3, 006 lift rows 2 and 3, 007, 008 differs rows and pitfalls 3 and 4, 009 lifts 2 and 3, differs rows and pitfall 6, 010 differs rows, 011 lift 3, differs rows 1 to 4 and pitfalls 1 to 4, 012 pitfall 1, or 013 lift 1. I did not rerun the plan-side "searched, no hit" claims for those rows.
- Section 4: I did not recount files and lines, and I checked only the three licence lines named above. The tinyvoice and two GPL-or-later entries were not opened.
- Net-new candidates 5 to 11 and 13 to 16: I opened only what M2, S5, S6 and m4 needed.
- Of the 31 regrade rows, 23 were checked on the plan side only, without opening their iteration record.
- Earlier syntheses: I opened S1 section 14 and three S3 lines. I did not search S1 to S3 to confirm that no section 3 row repeats them.
- I did not run `cite-check.cjs`.
