# Review Iteration 005

## Dispatcher

- Mode: review, lineage `vibe-2`, session `fanout-vibe-2-1795770902266-zziqbr`, generation 1, lineageMode `new`.
- Target: `research/research.md`, `research/regrade-log.md` and the 40 iteration records under `research/lineages/`.
- Dimension: correctness. Focus: phases 005 to 008 -- every lift row's reference half and every differences row's plan half.
- Iteration 5 of 10. Stop policy `max-iterations`, so convergence is telemetry only.

## Files Reviewed

- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:173-199` (005), `:200-232` (006), `:233-254` (007), `:255-300` (008)
- `specs/system-skilled-bots/context/turnstone-main/tests/data/memory_description_parity.json:1-10`
- `specs/system-skilled-bots/context/turnstone-main/docs/memory.md:36-41`
- `specs/system-skilled-bots/context/OpenGhost-main/memory.js:8-16`, `:34-40`
- `specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3-6`, `:38-42`
- `specs/system-skilled-bots/context/OpenBot-main/shared/approval-outcomes.ts:16-24`
- `specs/system-skilled-bots/context/OpenBot-main/app/src/lib/app-grants/queries.ts:4-14`
- `specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts:1-60`
- `specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:94-98`, `:160-164`
- `specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:97-101`
- `specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/design/state-machines.md:224-228`
- `specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/design/fixtures/action-kinds.json:17-21`
- `specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:149-153`, `:167-171`
- `specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/backends.md:45-49`, `:61-66`
- `specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/leak-checks.md:59-63`
- `specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md:235-239`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The 005 opening says the references add "two design checks and one test" while the section carries six rows, and the three it omits include a confirmed plan defect** -- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:175` -- The sentence is a closed enumeration: "What the references add is two design checks and one test." The paragraph then names exactly two things, the stable memory id and OpenGhost's truncate-on-load, which are differences rows 1 and 2, and the test is the parity fixture in lift row 1. The section also carries differences row 3, the 32,000-character refusal against tinymemory's renderer, and two pitfall rows. Pitfall 2 is a `confirmed` plan defect found by the verifier: `B/005-memory/spec.md:96` says `memory: false` keeps a bot from reading "the shared file" only, while REQ-010 at `:162` and `B/contracts/prompt-sections.md:237` both say `false` injects neither file. A builder who reads the opening and trusts the count never reaches that row.
   Finding class: documentation
   Scope proof: the sentence is `research.md:175`; the six rows are `:181-198`; the contradiction is `B/005-memory/spec.md:96` against `:162` and `B/contracts/prompt-sections.md:237`, all three read directly.
   Affected surface hints: `research/research.md` section 3 phase 005 opening paragraph; `B/005-memory/spec.md` line 96 and REQ-010; `B/contracts/prompt-sections.md` memory row.
   Case: a builder reads the 005 opening, notes two design checks and one test, and never opens pitfall 2, so the `memory: false` wording stays as line 96 has it and a bot with `memory: false` still reads the shared file.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | pass | `research.md:181-198`, `:206-231`, `:239-253`, `:261-299`; `C/turnstone-main/docs/memory.md:38-39`; `C/OpenGhost-main/memory.js:11`, `:37`; `C/OpenBot-main/docs/approvals.md:5`, `:40`; `C/OpenBot-main/shared/approval-outcomes.ts:22-23`; `C/OpenBot-main/app/src/lib/app-grants/queries.ts:6-12`; `B/005-memory/spec.md:96`, `:162`; `B/006-approval-grants/design/fixtures/action-kinds.json:19`; `B/008-vault/spec.md:151`, `:169`; `B/008-vault/design/backends.md:47`, `:63-65`; `B/008-vault/design/leak-checks.md:61`; `B/contracts/prompt-sections.md:237` | Every row checked in 005 to 008 resolves to a line that says what the row claims. The one defect is a summary sentence that undercounts its own section (P2 finding 1). |
| `checklist_evidence` | notApplicable | `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/` holds no `checklist.md` | The packet is Level 1 with no checklist, so there is no checklist evidence to align. |

## Integration Evidence

- **005's reference half holds.** `turnstone-main/tests/data/memory_description_parity.json:1-10` opens with a `whitespace_code_points` array, so the parity fixture is a table of code points as the row says. `turnstone-main/docs/memory.md:38-39` reads "A memory's identity is the tuple `(name, scope, scope_id)`. Saving a memory with the same identity upserts -- updating content while preserving the ID", which is differences row 1's claim exactly. `OpenGhost-main/memory.js:11` is `const LIMITS = { text: 400, records: 60, crowded: 28, chars: 3600 }` and `:37` is `.slice(0, LIMITS.records)`, so both the crowded-at-28 and the truncate-on-load claims hold.
- **005 pitfall 2 is a real contradiction.** `B/005-memory/spec.md:96` says `memory: true` or `false` exists "so a bot can be kept from reading the shared file", while REQ-010 at `:162` says `false` "injects neither file into that bot's prompt" and `B/contracts/prompt-sections.md:237` says "Both: the definition sets `memory: false`". The row's guard, rewrite line 96 to match REQ-010, is the right fix.
- **006's rows hold.** `docs/approvals.md:5` lists the kinds as "Deleting, sending to other people, sharing, posting, paying, and changing a password or account settings", so the plan's pay-first order at `B/006-approval-grants/spec.md:99` is not OpenBot's order and the design's citation of line 5 at `state-machines.md:226` does not support it. `docs/approvals.md:40` says "removing a collaborator asks as sharing" while `action-kinds.json:19` puts `remove` in the delete word list. `approval-outcomes.ts:22-23` is `DECLINED_BY_PERSON`, whose text says "Do not try this action, or anything equivalent, again" and "tell them you did not do it because they declined", which is lift row 4's sentence.
- **007's rows hold.** `app-grants/queries.ts:6-12` declares `ChangedAction` with `effect: "read" | "write"` and `destructive: boolean`, so lift row 1's shape is right. The section's "No row" for pitfalls is consistent with the regrade log's 006-007-008 group, which rejects every 007 pitfall on the plan side.
- **008's differences rows hold.** `B/008-vault/spec.md:151` (REQ-002) says "No argv of any spawn carries the value or its hex form", `design/backends.md:47` says every spawn "captures stdout and stderr into memory and prints neither", and `:63-65` records the measured 4,096-byte line bound and the echo of the value, so differences row 1's three claims all resolve. `design/leak-checks.md:61` says each surface fails closed and none falls back to the environment-only map, against `secrets-guard.ts:46-50`'s dev placeholder. `spec.md:169` (REQ-015) says every bot child can read another name's 0600 value file "as decision D6 confirms", which is 008's own D6 and not the research packet's.

## Edge Cases

- **The 005 opening's count is a summary, not an inventory.** The sentence could be read as naming the two checks the paragraph then explains rather than the section's total. Raised as P2 finding 1 because the wording is a closed enumeration and the omitted pitfall 2 is a confirmed plan defect.
- **006's differences row 1 rests on a doc line the plan cites for a different purpose.** `state-machines.md:226` cites `approvals.md:5` for "the six kinds in OpenBot's order", and line 5 does list six kinds in a different order. The row is right that the plan's order is not the doc's, and the plan's own reason for its order ("so a payment that also deletes reads as `pay`") is a deliberate choice, so the row's "which side the evidence supports" answer is a judgement rather than a defect.
- **008's differences row 3 cites a decision id that also exists in this packet.** "Decision D6" at `B/008-vault/spec.md:169` is 008's own D6, not this packet's D6 about the primary checkout. The row cites the 008 line, so the reference is unambiguous in context.
- **007 has no pitfall row.** The section says so explicitly and points at the regrade log, which is the honest form for a phase whose lineage pitfalls all failed on the plan side.

## Confirmed-Clean Surfaces

- 005's lift row 1, differences rows 1 to 3 and pitfall 1 all resolve to lines that say what the rows claim.
- 006's lift rows 1 to 4 and differences rows 1 to 4 all resolve, including the kind-order discrepancy and the `remove`-as-delete label.
- 007's lift row 1 and differences row 1 resolve, and the absent pitfall row is explained.
- 008's differences rows 1 to 3 resolve, including the 4,096-byte keychain line bound and the accepted same-user residual.
- The 005 `memory: false` contradiction is correctly graded `confirmed` and correctly attributed to origin `S`.

## Ruled Out

- **005's stable-id claim misreads turnstone.** Ruled out: `docs/memory.md:38-39` states the tuple identity and the upsert that preserves the id.
- **005's crowded-at-28 claim is wrong.** Ruled out: `memory.js:11` sets `crowded: 28` beside `records: 60`.
- **006's kind-order row is wrong because the plan's order is deliberate.** Ruled out: the plan calls its order "OpenBot's order" and cites line 5, which lists a different order.
- **006's `remove` row is wrong because both kinds ask.** Ruled out: the row says so itself and only disputes the label.
- **008's 4,095-byte bound is invented.** Ruled out: `design/backends.md:63-65` records the measurement and the echo.
- **008's "decision D6" is a mis-citation of this packet's D6.** Ruled out: `spec.md:169` is 008's own decision, cited from the 008 line.

## Next Focus

- Dimension: security
- Focus area: the 006 and 007 approval surfaces and the 011 transport rows -- the grant bound, the standing-answer predicate, and the send-error precedence, read against the plan's own contracts
- Reason: the first security pass covered the licence map and the secret rows; 006's ladder and 011's transport rows have had no security pass
- Rotation status: second pass of the security dimension
- Blocked/productive carry-forward: the reference-side reads stay productive; the `server/`-absent claims stay blocked
- Required evidence: the plan contract line for each guard, plus the reference line it mirrors

Review verdict: PASS
