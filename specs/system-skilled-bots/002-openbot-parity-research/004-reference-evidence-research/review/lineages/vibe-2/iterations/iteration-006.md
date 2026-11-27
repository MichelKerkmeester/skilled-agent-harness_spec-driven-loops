# Review Iteration 006

## Dispatcher

- Mode: review, lineage `vibe-2`, session `fanout-vibe-2-1795770902266-zziqbr`, generation 1, lineageMode `new`.
- Target: `research/research.md`, `research/regrade-log.md` and the 40 iteration records under `research/lineages/`.
- Dimension: security. Focus: the 006 and 007 approval surfaces and the 011 transport rows, read against the plan's own contracts.
- Iteration 6 of 10. Stop policy `max-iterations`, so convergence is telemetry only.

## Files Reviewed

- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:200-232` (006), `:233-254` (007), `:301-380` (011)
- `specs/system-skilled-bots/context/OpenBot-main/app/src/lib/approvals.ts:60-72`
- `specs/system-skilled-bots/context/OpenBot-main/shared/tool-name.ts:13-31`
- `specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3-6`, `:38-42`, `:46-50`, `:62-66`
- `specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs:1973-1979`
- `specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_types.rs:10-14`
- `specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_core.rs:254-265`
- `specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/api.rs:7-23`, `:112-150`, `:150-190`
- `specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:157-161`
- `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/records.md:185-189`
- `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/spec.md:96-102`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The 006 kind-list row catches the plan's kind order but not its kind count, so the plan's "OpenBot's six kinds" stands against a reference type that declares seven** -- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:206` -- The row's whole subject is the kind list: it says the plan "Tests kinds as pay, credentials, delete, send, share, post and calls it OpenBot's order", and it shows that `docs/approvals.md:5` lists delete first. It never says the plan has six kinds where the reference has seven. `C/OpenBot-main/app/src/lib/approvals.ts:62-69` declares `ActionKind` as `deleting`, `sending`, `sharing`, `publishing`, `payments`, `credentials` and `security_settings`, and `B/006-approval-grants/spec.md:99` says `action-kind.ts` "returns the strictest of OpenBot's six kinds". The seventh, `security_settings`, is folded into `credentials` in the plan, which is defensible because `docs/approvals.md:41` covers "a password, two-factor setting or other credential, or security and sharing settings" in one row — but the plan's sentence is still false about the reference, and the row that exists to check the kind list does not say so.
   Finding class: correctness
   Scope proof: the row is `research.md:206`; the plan's claim is `B/006-approval-grants/spec.md:99` and its six-kind list is REQ-002 at `:160`; the reference type is `C/OpenBot-main/app/src/lib/approvals.ts:62-69`; the doc row that merges the two kinds is `C/OpenBot-main/docs/approvals.md:41`, all read directly.
   Affected surface hints: `research/research.md` section 3 phase 006 differences row 1; `B/006-approval-grants/spec.md` line 99 and REQ-002; `B/006-approval-grants/design/state-machines.md` section 5.
   Case: a builder fixes the order as the row says, keeps six kinds, and a security-settings change is classified `credentials`; the plan's `action-kind.ts` then reports a kind set OpenBot does not have, and no test covers a `security_settings` question.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | pass | `research.md:206`, `:350`, `:360`; `C/OpenBot-main/app/src/lib/approvals.ts:62-69`; `C/OpenBot-main/docs/approvals.md:5`, `:41`, `:48-49`; `C/tinychannels-main/src/providers/telegram/channel_ops.rs:1975-1977`; `C/tinychannels-main/src/providers/telegram/channel_types.rs:12`; `C/tinychannels-main/src/providers/slack/api.rs:9-21`, `:150-190`; `B/006-approval-grants/spec.md:99`, `:159`, `:161`; `B/011-messaging-channels/002-adapter-and-record-contracts/design/records.md:187` | Every security-relevant row checked resolves to a line that says what the row claims. One row checks the kind order and misses the kind count (P2 finding 1). |
| `checklist_evidence` | notApplicable | `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/` holds no `checklist.md` | The packet is Level 1 with no checklist, so there is no checklist evidence to align. |

## Integration Evidence

- **006 pitfall 1 holds.** `app/src/lib/approvals.ts:62-69` declares `ActionKind` as a type and nothing else; a search of the file for `classifyAction` and `function classify` returns no hit, and the only `classify*` functions in `shared/` are `classifyAttachment` and `classifySource`. `shared/tool-name.ts:15-29` is the display-name doc comment, so the row's "names a tool call for display" is right.
- **006 differences row 4 holds.** `docs/approvals.md:48-49` reads "It is handed to you: the card says it is yours to do, and offers **I did it myself** and **Don't do it**. A credential an app's own tool changes asks like everything else", which is the row's reference half verbatim. `B/006-approval-grants/spec.md:159` (REQ-003) gives `decideApproval` only the kind rung and the `bot` fallback, so a `credentials` question gets `once` or `deny` like every kind.
- **006 differences row 3 holds.** REQ-003 at `:161` takes the kind and the bot and returns `rung: "kind"` or `rung: "bot"`, with no input for what started the run, so the row's "takes the kind only" is right.
- **011 pitfall 1 holds.** `channel_ops.rs:1975-1977` reads `if update_id > 0 && self.has_seen_update_id(update_id) { offset = offset.max(update_id.saturating_add(1)); continue; }`, so a duplicate update does move the offset before the loop continues.
- **011 pitfall 2 holds.** `channel_types.rs:12` is `pub(crate) const TELEGRAM_RECENT_UPDATE_CACHE_SIZE: usize = 4096`, and `channel_core.rs:259-264` evicts from `recent_order` once the window passes that size.
- **011 lift row 3 holds in substance.** `slack/api.rs:9-21` declares four `ApiFailure` variants, and `:116-147` maps them to `sent_before_error` and a `SendErrorKind`; `:150-190` makes `ok: false` retryable for `ratelimited` plus exactly four transient codes (`internal_error`, `service_unavailable`, `fatal_error`, `request_timeout`), which is the row's "ratelimited and four transient codes" exactly. The row's "three outcomes" names the three send outcomes it then describes, not the four failure variants.
- **011 differences row 3 holds.** `records.md:187` says "`delivered`, `failed` and `unknown` are terminal. A `sending` entry at the start of a drain belongs to a process that stopped mid-send, so it becomes `unknown` and is never resent", which is the row's plan half.

## Edge Cases

- **011 lift row 3's "every other code is permanent" drops the reference's catch-all.** `slack/api.rs:189` maps an unrecognised `ok: false` code to `SendErrorKind::Unknown`, not to a permanent kind. The practical consequence is nil, because the enum doc at `:19-20` says an `ok: false` body means "nothing was applied", so the send did not land whichever kind is chosen. Recorded as an edge case rather than a finding, and the row is already graded `weak`.
- **The reference's `ActionKind` has seven members and the plan's REQ-002 has six.** The plan's `credentials` covers the reference's `credentials` and `security_settings` together, which `docs/approvals.md:41` supports by covering both in one row. Raised as P2 finding 1 because the plan's sentence claims the reference's count, not because the merge is wrong.
- **011 lift row 3's "three outcomes" is a count of send outcomes, not of failure variants.** The row then names them, so a reader is not misled. Not raised.
- **006's `server/` folder is absent, so the ladder and the grant store cannot be read as code.** The section says so in its opening, and the rows that depend on server behaviour are graded `weak` or cite the doc instead.

## Confirmed-Clean Surfaces

- 006 pitfall 1's "no kind classifier exists as code" reproduces: `approvals.ts` declares the type only.
- 006 differences rows 3 and 4 both resolve against REQ-003 and the reference doc.
- 011 pitfall 1's offset rule and pitfall 2's 4,096-entry window both reproduce in the reference source.
- 011 lift row 3's retryable set is exactly `ratelimited` plus four transient codes.
- 011 differences row 3's `unknown` state is stated at `records.md:187` as the row says.

## Ruled Out

- **006 pitfall 1 is wrong because a classifier exists.** Ruled out: `approvals.ts:62-69` is a type declaration and the file holds no classify function.
- **006 differences row 4 misreads the reference's credentials hand-off.** Ruled out: `docs/approvals.md:48-49` states the hand-off and the two buttons.
- **011 pitfall 1's offset rule is wrong.** Ruled out: `channel_ops.rs:1975-1977` moves the offset before continuing.
- **011 pitfall 2's window size is wrong.** Ruled out: `channel_types.rs:12` is 4,096 and `channel_core.rs:259-264` evicts at that size.
- **011 lift row 3's retryable set is wrong.** Ruled out: `slack/api.rs:150-190` retries `ratelimited` and exactly four transient codes.
- **011 differences row 3's `unknown` state does not exist in the plan.** Ruled out: `records.md:187` names it as terminal.

## Next Focus

- Dimension: traceability
- Focus area: citation integrity -- the `[SOURCE:]` tags in sections 3 to 5, the path prefixes, and section 9's own account of what was hand-checked
- Reason: the rows' substance is now verified in three passes; what remains untested is whether the tags themselves resolve and whether section 9's claims about hand-checking are true
- Rotation status: second pass of the traceability dimension
- Blocked/productive carry-forward: the reference-side reads stay productive; the `server/`-absent claims stay blocked
- Required evidence: each sampled tag's path and line, plus section 9's list of hand-checked citations

Review verdict: PASS
