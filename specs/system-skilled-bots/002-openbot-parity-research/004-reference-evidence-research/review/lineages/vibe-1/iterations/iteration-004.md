# Review Iteration 4

## Dispatcher

- Lineage: `vibe-1`, iteration 4 of 10, mode `review`, target agent `deep-review`, agent definition loaded.
- Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Artifact directory: `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/review/lineages/vibe-1`
- `steer.md`: absent at dispatch time. No lead ruling was available for this iteration.
- Review target: `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/` (read-only).

PRE-BOUND SETUP ANSWERS, emitted as bindings:

```
BINDING: target=specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research
BINDING: maxIterations=10
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,traceability,security,maintainability
BINDING: specFolder=specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research
```

## Files Reviewed

| File | Lines read | Why |
|---|---|---|
| `research/research.md` | 255-284 (008-vault), 200-232 (006-approval-grants), 284-316 (009-skills), 317-339 (010-conversations), 340-373 (011-messaging-channels), 150-173 (004-computer-exposure) | The six sections that carry a security-relevant recommendation |
| `C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/patterns.rs` | 240-300 | The `encoded_forms` function the 008 pitfall 2 row cites |
| `C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-approval/src/engine.rs` | 1630-1650 | The three human-only tools the 006 reference row 2 cites |
| `C/rakazo-main/packages/core/src/integrations/vault.ts` | 20-42 | The three fixed answers the 008 row 1 and pitfall 3 cite |
| `C/openhuman-full/vendor/tinyskills/README.md` | 40-44 | The `scan_skill` block list the 009 row 3 and pitfall 3 cite |
| `B/008-vault/spec.md` | 165-172 | REQ-014, REQ-015, REQ-017 |
| `B/008-vault/design/leak-checks.md` | 70-76, 104-112 | The scanned forms and the accepted-residual table |
| `B/008-vault/design/backends.md` | 38-50, 130-142 | The hex value form, the never-print rule, the outcome map |
| `B/contracts/refusals.md` | 155-165 | The `secret-store-unreadable` detail row |
| `B/006-approval-grants/spec.md` | 160-175, 200-210, 265-275 | REQ-006, REQ-009, the risks table, the open questions |
| `B/contracts/prompt-sections.md` | 164-174 | The five reserved escape tokens |
| `B/003-terminal-screen/002-architecture-and-contracts/design/architecture.md` | 382-390 | The `printable` bidi strip |
| `B/009-skills/design/draft-template.md` | 26-32, 76-82 | The `allowed-tools` key and its stated reason |
| `B/003-terminal-screen/001-ux-and-component-map/plan.md` | 160-175 | The GPL clean-room worker rule |
| `B/011-messaging-channels/003-link-roster-and-answer-gate/plan.md` | 200-215 | The dispatch rules every 011 worker carries |
| `B/011-messaging-channels/005-polling-transports/tasks.md` | 30-45 | Wave 0's tinychannels read tasks |
| `B/011-messaging-channels/005-polling-transports/plan.md` | 145-155 | The wave table |
| `B/contracts/verification.md` | 35-48 | V9, the line-copy check |

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R2-P1-001` (nine origin ids resolve to no finding in the record they name) remains active and is carried forward unchanged; it is not re-derived here.

### P2 Findings

1. **The 008 encoded-forms guard names three additions where the reference it cites matches eight forms** -- `research/research.md:278` -- The row says tinysecurity's redactor "builds four base64 forms of a secret: standard, standard without padding, URL-safe, and URL-safe without padding", then tells the builder to "Add standard base64 without padding, URL-safe base64 and the lowercase hex form to the scanned forms". The cited function returns eight entries, not four: `secret`, `percent` (uppercase percent-encoding), `percent_lower` (lowercase percent-encoding), `form` (form-urlencoded, space written as `+`), and the four base64 forms [SOURCE: C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/patterns.rs:248-280]. The plan matches three of the eight: the plain value, standard base64 and `encodeURIComponent` [SOURCE: B/008-vault/design/leak-checks.md:73]. So the plan misses five forms, and the guard names three of them. `percent_lower` and `form` are left unnamed, and a builder who follows the guard exactly still misses both. `percent_lower` differs from the plan's `encodeURIComponent` for any value holding a non-alphanumeric byte, and `form` differs for any value holding a space, because `encodeURIComponent` writes `%20` where the reference writes `+`. The row's own wording is not false, which is why this is a P2 and not a P1: "four base64 forms" is exactly right, and the citation to `:248-249` lands on the function signature and the four-engine import. What is incomplete is the guard, which is the part a builder acts on.
   Finding class: `incomplete-recommendation`
   Scope proof: the finding is inside the declared review target (`research/research.md:278`) and cites the reference and plan lines the row itself cites. No file outside the target was modified.
   Affected surface hints: `B/008-vault/design/leak-checks.md` section 2 (the scanned forms), `B/008-vault/spec.md` REQ-014, `B/008-vault/design/threat-model.md` T7.
   Case: an operator stores a value holding a space, such as a passphrase. A child prints it inside an `application/x-www-form-urlencoded` body, where the space arrives as `+`. The plan's scan matches the plain value, standard base64 and `%20`-encoded text, and misses the `+` form. A builder who applied the research's guard adds unpadded base64, URL-safe base64 and hex, and still misses it.

2. **The 008 hex justification cites a value-file line for a keychain read** -- `research/research.md:278` -- The row's reason for adding the hex form is "the hex form is the vault's own, so a child that reads the keychain prints it", and the citation for the child's reach is `B/008-vault/spec.md:169`. That line is REQ-015, which says "every bot child runs as the same user and can read another name's 0600 value file" [SOURCE: B/008-vault/spec.md:169]. It states the value-file read, not a keychain read. The keychain step is a separate mechanism: the vault writes the value's lowercase hex as the keychain item's password [SOURCE: B/008-vault/design/backends.md:41], and whether a same-user child can read that item back without a prompt depends on the item's ACL, which no cited line states. The guard itself is right and the hex form is worth scanning for; what is unsupported is the load-bearing sentence that makes the residual concrete rather than hypothetical. The row is graded `confirmed`, and the document's own grade rule puts "an inference the lines do not state" at `weak` [SOURCE: research/research.md:26]. Either the keychain ACL is cited, or the sentence is marked as an inference.
   Finding class: `citation-scope`
   Scope proof: the finding is inside the declared review target (`research/research.md:278`) and cites the plan line the row cites. No file outside the target was modified.
   Affected surface hints: `B/008-vault/design/backends.md` section 2.1 and 2.2, `B/008-vault/spec.md` REQ-015, `B/008-vault/design/threat-model.md` T7.
   Case: a reviewer checks the row against `spec.md:169`, finds a sentence about 0600 value files, and either accepts the keychain claim on trust or drops the hex addition as unsupported. Both outcomes are wrong: the addition is right, and the reason given for it is not the reason that holds.

## Traceability Checks

| # | Check | Result |
|---|---|---|
| 1 | Every 008 security row's reference citation resolves and says what the row claims | Pass. `patterns.rs:248-280` builds the encoded forms; `vault.ts:25-38` maps a server error to three fixed answers and shows nothing else; `secrets-guard.ts:1-12` holds the eight constants |
| 2 | Every 008 security row's plan-side citation resolves | Pass. `leak-checks.md:73` names the three matched forms; `:108` lists hex as an accepted residual; `backends.md:41` states the lowercase-hex value form; `backends.md:47` states the never-print rule; `refusals.md:160` prints `bots: secret-store-unreadable: <detail>` with no rule for the detail; `backends.md:134-139` fixes no detail for an error exit |
| 3 | The 006 security rows' reference citations resolve | Pass. `engine.rs:1640-1645` refuses any answer but `Once` or `Deny` for `native_secret_grant`, `native_app_io_grant` and `device_crypto` |
| 4 | The 006 security rows' plan-side citations resolve | Pass. `spec.md:205` and `:271` both say "a scope bound to bot plus kind"; `:164` is REQ-006 and names only `grant-kind-unknown` |
| 5 | The 009 security rows' plan-side citations resolve | Pass. `prompt-sections.md:168-171` names exactly five reserved tokens; `architecture.md:386` is the `printable` bidi strip; `draft-template.md:29` is `allowed-tools: ["Read"]` and `:79` is its stated reason |
| 6 | The 009 symlink pitfall's factual premise holds | Pass. `.skilled/skills/local-webflow` is a symlink to a folder outside the repository |
| 7 | The 011 GPL clean-room pitfall's five citations resolve | Pass. `003/001/plan.md:168` is the clean-room worker rule; `011/003/plan.md:206-212` is the dispatch-rules list with no clean-room rule; `011/005/tasks.md:38-39` sends wave 0 into the tinychannels source; `011/005/plan.md:150` is wave 0; `contracts/verification.md:41` is V9 |
| 8 | The 004 and 010 "No row" entries are honest absences rather than unsearched claims | Pass for 004: no reference failure for a working-place line was found. Pass for 010 lifts: no reference has new code for that phase. Both sections state the absence as a search |
| 9 | The 008 pitfall 2 guard covers every form the cited reference matches | **Fail.** Two of the eight forms are unnamed. Reported as finding 1 |
| 10 | Every `confirmed` security row's load-bearing sentence is supported by a line that states it | **Fail.** One sentence rests on a line about a different mechanism. Reported as finding 2 |

## Integration Evidence

The recommendations reviewed here route into named surfaces, and each was checked at the path the row names:

- `B/008-vault/design/leak-checks.md` section 2 is the surface the 008 pitfall 2 guard edits. Its "Values" paragraph at `:73` is the list the guard extends.
- `B/008-vault/spec.md` REQ-014 is the requirement that names the scanned forms, and REQ-015 is the same-user boundary the row cites.
- `B/contracts/refusals.md` section 3.7 is the surface the 008 pitfall 3 guard edits, at the `secret-store-unreadable` row.
- `B/006-approval-grants/spec.md` REQ-006 and REQ-009 are the surfaces the 006 pitfall 3 guard edits.
- `B/contracts/prompt-sections.md` section 3 is the escape form the 009 pitfall 3 guard sits beside.
- `B/009-skills/design/draft-template.md` is the surface the 009 pitfall 6 guard edits.
- `B/011-messaging-channels/003-link-roster-and-answer-gate/plan.md` section "Dispatch rules every worker carries" is the surface the 011 pitfall 3 guard edits.
- `B/contracts/verification.md` V9 is the check the 011 pitfall 3 guard extends to `lib/channel*.ts`.

No command, workflow, skill, MCP tool, caller agent or runtime mirror was modified. The append gateway and the reducer were run as the workflow runs them; both are named in the state record.

## Edge Cases

- **The row says "four base64 forms" and the function returns eight entries.** Both statements are true. The ambiguity is whether the guard is scoped to base64 or to the plan's whole scan gap. Adjudicated as the whole gap, because the guard's third item (hex) is not a base64 form and comes from `backends.md:41` rather than from the reference. Kept at P2 because the row's own wording is not false and the guard still closes three of the five missing forms.
- **`percent_lower` and `form` are narrow.** They differ from the plan's `encodeURIComponent` only for a value holding a non-alphanumeric byte or a space. A 32-character alphanumeric API key is unaffected. The finding is recorded because the guard is the deliverable and a builder cannot tell from the row which forms were considered and dropped.
- **The keychain ACL could not be tested.** Testing whether a same-user child can read the item back would need a keychain write, which is outside this lineage's write surface. The finding is therefore about citation scope only: it does not claim the keychain read fails, and it does not claim it succeeds.
- **The 011 clean-room pitfall is not a rule violation.** Wave 0 reads the tinychannels source and wave 1 writes `lib/channel-telegram.ts`, so the 003 rule ("keep GPL sources out of the brief of a worker that writes the matching module") is not literally broken by the wave table. The row says the rules name no clean-room rule and that wave 0 reads the source, which is what the lines show. No finding raised.
- **`steer.md` is absent.** Recorded rather than treated as a missing input; the dispatch names no lead channel for this lineage.

## Confirmed-Clean Surfaces

- **008 pitfall 1** (`research.md:277`): the eight constants of `secrets-guard.ts:1-12` are one fixed set, `dev-secret-change-me-please-32chars` sits outside the set at `:17-23`, and `isDevSecretAllowed` at `:25-30` returns true for `RAKAZO_ALLOW_DEV_SECRETS=1`, `VITEST` and `NODE_ENV` development or test. The guard ("lift no environment gate") is right.
- **008 pitfall 3** (`research.md:279`): `refusals.md:160` prints a free `<detail>`, `backends.md:134-139` fixes no detail for an error exit, and the never-print rule lives in prose at `backends.md:47` only. The guard is right.
- **008 "where the plan differs" row 3** (`research.md:262`): `spec.md:169` is REQ-015 and states the same-user boundary and the D6 acceptance. The row's reading of the plan is accurate.
- **006 pitfall 2** (`research.md:227`): `spec.md:205` and `:271` both say "a scope bound to bot plus kind". The guard's replacement wording is the reference's four fields.
- **006 pitfall 3** (`research.md:228`): `spec.md:164` is REQ-006 and names only `grant-kind-unknown`. The three missing refusals are real.
- **006 pitfall 4** (`research.md:229`): the deny-resume sentence is supported by `approval-outcomes.ts:18-23`, and `mockups.md:173-174` shows the plan's resumed prompt carrying no such sentence.
- **009 pitfall 3** (`research.md:310`): `prompt-sections.md:168-171` names five reserved tokens and no code point class; `architecture.md:386` strips bidi only when the screen draws. The guard is right.
- **009 pitfall 4** (`research.md:311`): the `local-webflow` symlink is real and outside the tree; `state-machines.md:64`'s grammar argument covers the name, not the folder.
- **009 pitfall 6** (`research.md:313`): `draft-template.md:29` carries `allowed-tools: ["Read"]` and `:79` gives the "would grant more than the review approved" reason, while a loaded body reaches the run as text. The key is advisory and the row says so.
- **011 pitfall 3** (`research.md:369`): all five citations resolve and say what the row claims. The guard names the two surfaces that would carry the rule.
- **004 pitfalls** (`research.md:170`): "No row" is an honest absence. No reference failure for a working-place line was found, and the section says so rather than leaving the table out silently.
- **010 lifts** (`research.md:322`): "No row" is an honest absence, and the section states the reason.

## Ruled Out

- **The 008 pitfall 2 row as a false claim.** The reference does build the four base64 forms and the plan does miss them. The row's citation is accurate; only the guard's completeness fails.
- **The 008 pitfall 2 hex addition as unnecessary.** The vault stores the value's lowercase hex as the keychain password, so the hex form is a real representation of the value. The addition stands; only its justification is uncited.
- **The 006 deny-resume sentence as unsupported.** `approval-outcomes.ts:18-23` states it, and the row's guard is a rewording rather than a lift.
- **The 009 symlink pitfall as hypothetical.** The symlink exists on disk today.
- **The 011 clean-room pitfall as a rule violation.** Wave 0 reads and wave 1 writes, so the 003 rule is not broken; the row claims only that the rule is not carried, which the lines support.
- **The 004 and 010 "No row" entries as unsearched gaps.** Both sections state the absence as a search, and the 004 section names the one change it does recommend.
- **The 008 pitfall 1 guard as over-broad.** Naming eight constants and lifting no environment gate is exactly what AC-010 needs, and the plan's own tests run under Vitest, which is the gate the guard removes.

## Next Focus

- Dimension: maintainability
- Focus area: the document's own structure and honesty claims — section 9's account of what was hand-checked, the "Absences" rule in section 1 against the sections that state an absence, and section 7's overlap accounting against D5.
- Reason: security is now covered and produced two P2s, both in the 008 section. The remaining unexamined risk is whether the document's self-description matches what it did, which is the maintainability dimension and the one a reader relies on to know what to trust.
- Rotation status: correctness twice (iterations 1, 3), traceability once (iteration 2), security once (iteration 4). Maintainability not yet started.
- Blocked/productive carry-forward: nothing blocked. Productive: opening the reference function a row cites rather than the line range it names, which is what surfaced the eight-form gap.
- Required evidence: `research/research.md:5-31` (section 1), `:529-620` (section 7), `:645-664` (section 9), and `scratch/synthesis-inputs/` for the checker and the verify brief.

Review verdict: CONDITIONAL
