# Review Iteration 002

## Dispatcher

- Mode: review, lineage `vibe-2`, session `fanout-vibe-2-1795770902266-zziqbr`, generation 1, lineageMode `new`.
- Target: `research/research.md`, `research/regrade-log.md` and the 40 iteration records under `research/lineages/`.
- Dimension: security. Focus: the licence map and the secret-handling rows (008, 009, 011, 006).
- Iteration 2 of 10. Stop policy `max-iterations`, so convergence is telemetry only.

## Files Reviewed

- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:1-60` (section 2 bottom line and licence map), `:260-479` (phases 008-011)
- `specs/system-skilled-bots/context/OpenBot-main/LICENSE:1-3`, `OpenGhost-main/LICENSE:1-3`, `rakazo-main/LICENSE:1-2`, `rakazo-main/NOTICE:1`, `turnstone-main/LICENSE:1-2`, `buzz-main/LICENSE:1-2`, `buzz-main/Cargo.toml:44-48`, `OpenMausBot-main/LICENSE:1-2`, `OpenMausBot-main/LICENSING.md:1-10`, `hermes-muse-main/LICENSE:1-3`, `tinychannels-main/LICENSE:1-2`, `tinychannels-main/Cargo.toml:53-57`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/Cargo.toml:22-26`
- `specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts:1-60`
- `specs/system-skilled-bots/context/rakazo-main/packages/core/src/messages/secret-matcher.ts:1-70`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/patterns.rs:244-252`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-approval/src/engine.rs:1630-1650`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/docs/module-approval-contracts.md:33-45`
- `specs/system-skilled-bots/context/OpenBot-main/shared/standing-rule.ts:1-32`, `app/src/lib/approvals.ts:58-96`, `docs/approvals.md:18-26`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/README.md:40-44`
- `specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_send.rs:424-438`, `:925-936`, `src/delivery/queue.rs:256-270`, `src/providers/slack/blocks.rs:5-68`
- `specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:162-171`, `acceptance-criteria.md:67-72`, `tasks.md:76-82`, `plan.md:140-146`, `design/leak-checks.md:26-34`, `:70-76`, `:104-110`, `design/backends.md:38-50`, `:128-142`
- `specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:160-166`, `:260-270`
- `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:165-180`, `002-adapter-and-record-contracts/design/records.md:172-192`, `002-adapter-and-record-contracts/design/capabilities.md:60-66`, `005-polling-transports/spec.md:96-102`, `006-daemon-and-webhook-transports/spec.md:88-94`, `003-link-roster-and-answer-gate/plan.md:204-214`, `005-polling-transports/tasks.md:36-41`
- `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/plan.md:166-170`
- `specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md:156-164`, `contracts/verification.md:39-43`, `contracts/prompt-sections.md:166-172`
- `.gitignore:231-235`, `.skilled/skills/local-webflow` (symlink target), `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts:938-955`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The 008 pitfall 1 guard does not say whether `lib/secrets-guard.ts` is still lifted, so T013 and AC-012 lose their file** -- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:305` -- The guard reads "Name the eight constants of secrets-guard.ts lines 1-12 as one fixed set in leak-checks.md section 1. Lift no environment gate." A builder who follows it literally writes the eight constants into a design document and creates no `lib/secrets-guard.ts`. But T013 lifts that file (`B/008-vault/tasks.md:79`), AC-012 requires an Apache-2.0 notice inside it (`B/008-vault/acceptance-criteria.md:71`), and the plan's unit tests import it (`B/008-vault/plan.md:143`). The row's own reasoning says "A builder who lifts the file brings the gate", which implies the file is lifted, so the guard and the plan can be reconciled — but the row never says so, and the reconciliation is the one thing a builder needs.
   Finding class: licence-compliance
   Scope proof: the guard is at `research.md:305`; the three plan lines that require the file are `B/008-vault/tasks.md:79`, `B/008-vault/acceptance-criteria.md:71` and `B/008-vault/plan.md:143`, each read directly.
   Affected surface hints: `research/research.md` section 3 phase 008 pitfall row 1; `B/008-vault/tasks.md` T013; `B/008-vault/acceptance-criteria.md` AC-012; `B/008-vault/design/leak-checks.md` section 1.
   Case: a builder reads the guard, copies the eight placeholder constants into `leak-checks.md`, and never creates `lib/secrets-guard.ts`; T013's `rg -n 'Apache-2.0' $R/lib/secrets-guard.ts` finds no file and AC-012's two-line check prints one line.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | pass | `research.md:305`; `B/008-vault/tasks.md:79`; `B/008-vault/acceptance-criteria.md:71`; `B/011-messaging-channels/002-adapter-and-record-contracts/design/records.md:181-184`; `B/011-messaging-channels/005-polling-transports/spec.md:99`; `B/011-messaging-channels/006-daemon-and-webhook-transports/spec.md:91`; `B/contracts/refusals.md:160` | Every security-relevant plan-side claim sampled resolves to a plan line that says what the row claims. One guard leaves a plan task and its acceptance criterion without their file (P2 finding 1). |
| `checklist_evidence` | notApplicable | `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/` holds no `checklist.md` | The packet is Level 1 with no checklist, so there is no checklist evidence to align. |

## Integration Evidence

- **Licence map holds.** `OpenBot-main/LICENSE:1-3` and `OpenGhost-main/LICENSE:1-3` are MIT; `rakazo-main/LICENSE:1-2`, `turnstone-main/LICENSE:1-2`, `buzz-main/LICENSE:1-2` and `OpenMausBot-main/LICENSE:1-2` are Apache-2.0; `hermes-muse-main/LICENSE:1-3` is MIT; `tinychannels-main/LICENSE:1-2` is GPL-3.0 and `tinychannels-main/Cargo.toml:55` says `GPL-3.0-only`; `openhuman-full/vendor/tinysecurity/Cargo.toml:24` says `GPL-3.0-only`. `OpenMausBot-main/LICENSING.md:6-9` confirms the `enterprise/` carve-out the skip-list check describes.
- **008 pitfall 2 holds.** `tinysecurity-redact/src/patterns.rs:248-249` imports `STANDARD`, `STANDARD_NO_PAD`, `URL_SAFE` and `URL_SAFE_NO_PAD`, so the reference builds four base64 forms. `B/008-vault/design/leak-checks.md:73` scans the plain value, standard base64 and `encodeURIComponent` only, `:108` lists hex as an accepted residual, and `B/008-vault/design/backends.md:41` stores the value's lowercase hex in the keychain. `B/008-vault/spec.md:169` (REQ-015) confirms a same-user child can read another name's value file.
- **008 pitfall 1 reference half holds.** `rakazo-main/packages/core/src/node/secrets-guard.ts:17-23` is `DEDICATED_SECRET_PLACEHOLDERS` with five entries and no `dev-secret-change-me-please-32chars`; that value is line 1 and is refused only inside `resolveAuthSecret` behind `isDevSecretAllowed` (`:25-30`, `:46-57`). `B/008-vault/acceptance-criteria.md:69` (AC-010) pipes exactly that value.
- **008 pitfall 3 holds.** `B/contracts/refusals.md:160` prints `bots: secret-store-unreadable: <detail>` with no rule for the detail; `B/008-vault/design/backends.md:134-139` fixes no detail for an error exit of a write or a read and gives `forget` a free `<reason>`; the never-print rule is prose at `:47`.
- **008 lift row 1 holds.** `rakazo-main/packages/core/src/messages/secret-matcher.ts` is 199 lines with no imports, `MAX_SECRET_MATCHER_STATES` and `BUILD_COST` sit inside the cited `:23-53`, and `maxStates` is a parameter at `:56-59`. A search of the 003 tree for both constant names returns no hit, as the row says.
- **009 pitfall 3 and 4 hold.** `tinyskills/README.md:42` blocks invisible, bidi and zero-width code points; `B/contracts/prompt-sections.md:168-171` escapes five reserved tags only; `.gitignore:233` ignores `/.skilled/skills/local-*`; and `.skilled/skills/local-webflow` is a symlink to `/Users/michelkerkmeester/MEGA/Development/Websites/A. Nobel & Zn./local-skills/local-webflow`, outside the repository.
- **011 lift rows 2 and 4 hold.** `tinychannels-main/src/providers/telegram/channel_send.rs:427-435` passes `is_server_error() || 429` as retryable and `is_server_error()` as sent-before-error, `:928-934` sets sent-before-error once any chunk landed, and `src/delivery/queue.rs:260-266` reads that flag first and marks the entry unknown. `src/providers/slack/blocks.rs:7-11` holds `MAX_SECTION_CHARS = 3000` and `MAX_LABEL_CHARS = 75`, refused at `:27-31` and `:58-66`. The plan's `records.md:181-184` state machine names no order between the two flags, `005-polling-transports/spec.md:99` calls a Telegram `5xx` retryable, `006-daemon-and-webhook-transports/spec.md:91` calls a WhatsApp `5xx` unknown, and `capabilities.md:63` sets Slack's chunk limit at 3,900.
- **011 pitfall 3 holds.** `B/003-terminal-screen/001-ux-and-component-map/plan.md:168` states the clean-room rule; `B/011-messaging-channels/003-link-roster-and-answer-gate/plan.md:206-212` lists five dispatch rules and none is a clean-room rule; `005-polling-transports/tasks.md:38-39` sends a worker into `$CTX/tinychannels-main/src/providers/telegram/` and `slack/`; `B/contracts/verification.md:41` (V9) is the line-copy check.
- **006 lift rows 1 to 3 hold.** `OpenBot-main/shared/standing-rule.ts:21-29` is `offersStandingRule` with the three refusals and `:10-14` gives the reason; `tinysecurity/docs/module-approval-contracts.md:35-43` states that a grant never overrides a denial, a Cron external effect, reviewed reuse or a human-only tool and that names are never wildcards; `engine.rs:1640-1645` refuses any answer but once or deny for `native_secret_grant`, `native_app_io_grant` and `device_crypto`; `OpenBot-main/app/src/lib/approvals.ts:76-86` and `:88-94` hold the two field sets and `docs/approvals.md:22` the four-fact reach.

## Edge Cases

- **The 006 lift row 1 predicate is broader in code than in prose.** `standing-rule.ts:21-29` refuses a standing answer for any `policy.source === "task"`, while the doc comment at `:10-14` and the synthesis's row both narrow it to "a task a check-in started". The server file that would settle whether `source: "task"` is set only for check-in tasks (`server/src/approvals/service.ts`) is absent from the snapshot, so the row cannot be shown wrong. Recorded as an edge case, not a finding.
- **The 011 lift row 4's action-id claim is uncited.** The row says "The 255-byte action id cap is moot, because the derived id is about 40 bytes" with no line for the 40. The cap itself is confirmed at `blocks.rs:11` and `:58-66`; only the derived-id size is an assertion. Not raised: the conclusion (the cap is moot) does not depend on the exact figure.
- **The 009 section's "Phase 009 cites no GPL source today" reproduces.** A search of `009-skills/` for `tinyskills` and `GPL` returns no hit, so the sentence is a true statement about the plan and not a claim about the reference.
- **`tinychannels-main` does carry Signal and WhatsApp.** `src/providers/` lists `signal`, `slack`, `telegram` and `whatsapp` beside eleven other transports, so the 011 opening's "the only reference with Telegram, Slack, Signal and WhatsApp transports" holds.

## Confirmed-Clean Surfaces

- The licence map in section 2 and section 10 is applied consistently: every GPL row says "mirror the design, copy no code", every MIT or Apache-2.0 lift names its notice, and no row proposes copying GPL source.
- The 008 section's "two leak gaps" is precise: pitfall 1 is a refusal gap, not a leak gap, and pitfalls 2 and 3 are the two leaks.
- The 009 lift row 1's notice claim is right: `B/009-skills/spec.md:266` is the reversal condition that requires the notice entry once any line of `skills.js` is copied.
- The 011 section's claim that the plan already mirrors the adapter contract, the capability matrix, the acknowledge order, the backoff ladder and the five conformance rules reproduces against `B/011-messaging-channels/spec.md:165-180`.

## Ruled Out

- **The licence map misgrades a repo.** Ruled out: all ten `LICENSE` files and the two `Cargo.toml` licence lines were read and match the document.
- **The 008 pitfall 2 encoded-forms gap is overstated.** Ruled out: `patterns.rs:248-249` imports four base64 engines and the plan scans one padded form plus `encodeURIComponent`.
- **The 011 send-error precedence guard is wrong because the plan already orders the flags.** Ruled out: `records.md:181-184` names no order and the `error` field at `:173` carries both flags with no precedence.
- **The 006 grant bound is weaker than the row says.** Ruled out: `module-approval-contracts.md:35-43` and `engine.rs:1640-1645` both hold.
- **The 009 symlink claim is stale.** Ruled out: `.skilled/skills/local-webflow` is still a symlink to a folder outside the repository.

## Next Focus

- Dimension: traceability
- Focus area: the regrade log's rejection outcomes -- every `wrong`, `out of scope` and `duplicate` row read against the plan or reference line it cites, starting with the 001-004 and 005-010 groups
- Reason: the document's central claim is that a third of the lineage findings were wrong, and that claim rests entirely on the regrade log
- Rotation status: first pass of the traceability dimension
- Blocked/productive carry-forward: the reference-side reads are productive; the `server/`-absent claims are blocked and cannot be settled from the snapshot
- Required evidence: the cited plan or reference line for each rejection checked, plus the lineage finding it rejects

Review verdict: PASS
