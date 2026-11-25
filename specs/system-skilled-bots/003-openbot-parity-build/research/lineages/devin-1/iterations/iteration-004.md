# Iteration 4: Security — memory (005) and per-bot apps (007)

## Focus
Frontier node F-1-005 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/005-memory, specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants, specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps, specs/system-skilled-bots/003-openbot-parity-build/008-vault, specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels): Security: in the vault (008), apps (007), approvals (006), memory (005) and channels (011) plans, where can secrets leak into prompts, logs, run records or chat, how are tokens stored, and can a spoofed or unlinked chat user approve or read?

## Actions Taken
1. Read 005 `plan.md`, `tasks.md` and its security checklist; traced the `[REMEMBER]` proposal path and the memory block's secret check.
2. Read 007 `plan.md` and checked every runtime surface it names: `.utcp_config.json` (14 names), the Code Mode `UTCP_CONFIG_FILE` lookup, `EXECUTOR_COMMON_ENV_ALLOWLIST`, `HonoredPosture`, `HARD_INVARIANTS`, the `clean` fixture, `.claude/mcp.json`, the doctor script, `status-index.ts`.
3. Read `state-root.ts`'s mode and root resolution to test what the 0600 vault file protects.
4. Compared 005's item-shape edits with 006's from iteration 2.

## Findings
1. **P1 — phase 008 (carried from iteration 2), `spec.md` §6: the 0600 file backend is readable by every bot child.** The store lives under the user-level state root (`STATE_DIR_MODE = 0o700`, files 0600) and every executor child runs as the same OS user with unrestricted reads; the `secrets:` grant is enforced only by not injecting a name, not by making the file unreadable. A bot that declares no secret can still open `{stateRoot}/{identity}/secrets/*.value` and read every stored value. The spec's residual-risk table covers argv exposure but not same-user read access. **Exact edit:** add the same-user trust boundary to 008 §6 and either accept it explicitly for the small-team model or isolate the store (per-run unreadable path, or keychain ACL per item), and add an adversarial test where an undeclared bot tries to read another name's value. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:43-46] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:96]

2. **P1 — phase 005, `plan.md:64` and `tasks.md:63` (T021): the `[REMEMBER]` proposal fact is never checked for secret literals.** T020 checks the rendered memory block for secrets, but the proposal branch writes the child-authored fact into a needs-you item, where `bots inbox` prints it and a delivery notice can carry it. A child that prints `[REMEMBER] token ghp_...` puts the value in the item file and the inbox. **Exact edit:** run `findSecretLiteral` on the fact before `writeNeedsYouItem`, refuse with `memory-proposal-secret`, and add the case to `runner.vitest.ts`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/tasks.md:63] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:13-17]

3. **P1 — cross-phase, phase 005 `tasks.md:57-58` (T015-T016) and phase 006 `spec.md` REQ-001: two phases edit the same item shape with different fields and only one defines a migration.** 005 adds `kind`/`proposal` and T016 reads a missing `kind` as `decision`; 006 adds `grants` with no missing-field rule. Both plans list `ITEM_KEYS` and `validateNeedsYouItem` as their own edit, so a parallel build merges two independent shapes and pre-phase items fail one of them. **Exact edit:** define the item v2 shape once (005 owns it: `kind`, `proposal`, `grants`), have 006 cite that requirement, and add "a missing `grants` reads as null" beside 005's `kind` default. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/tasks.md:57] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:145]

4. **P2 — phase 005, `plan.md:68`: `bots remember` does not check the fact it appends, so a secret written by an operator poisons the block and refuses every later run.** The block check at dispatch would turn one bad entry into a denial of service for every bot, while the append itself accepts the value. **Exact edit:** check the fact at append time and refuse `memory-entry-secret`; keep the dispatch-time check as the second line. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:68] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:13-17]

5. **P2 — phase 007, `plan.md:29`: the apps filter is a capability filter, not a security boundary.** The runner writes a filtered `utcp.json` and points `UTCP_CONFIG_FILE` at it, but a bot with shell access can read the repository `.utcp_config.json` and call any server the operator's credentials reach. The plan calls the invariant fail-closed without saying what it does not close. **Exact edit:** add one line to 007 §6/§7 stating that `apps` scopes the Code Mode server's tool list and is not a sandbox against a shell-capable executor. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:29] [SOURCE: .utcp_config.json]

## Ruled Out
- Suspected 007 citation drift: ruled out. `.utcp_config.json` holds 14 names; the Code Mode lookup is at `dist/index.js:327`; `EXECUTOR_COMMON_ENV_ALLOWLIST` is at `executor-audit.ts:150` and has no `UTCP_CONFIG_FILE`; `HonoredPosture` has four fields and no `apps`; `HARD_INVARIANTS` has no `apps-unknown-server`; the `clean` fixture exists and `apps-unknown-server` is a create task; `.claude/mcp.json:9` and the two doctor lines carry the pin; `status-index.ts` has no `posture` string.
- Suspected 007 record-validator change: ruled out. `validateRunRecord` checks the posture group's shape, not its keys, so adding `apps` needs no validator edit.
- Suspected 005 missing migration: ruled out for `kind` — T016 explicitly reads a missing `kind` as `decision`; the gap is only 006's `grants`.

## Dead Ends
- No dead ends.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none between sources; the item-shape conflict is between two phases, not two sources.
- Missing dependencies: none; 007's fixture is a create task and every other path exists.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/tasks.md
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts
- .skilled/skills/system-skilled-bots/runtime/lib/answer.ts
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts
- .skilled/skills/system-skilled-bots/scripts/bot-check.cjs
- .skilled/skills/mcp-code-mode/mcp-server/dist/index.js
- .utcp_config.json
- .claude/mcp.json
- .skilled/commands/doctor/scripts/mcp-doctor-lib.sh

## Assessment
- New information ratio: 1.0
- Questions addressed: F-1-005 for phases 005 and 007
- Questions answered: none fully

## Reflection
- What worked and why: reading `state-root.ts`'s mode constant before judging the vault turned "0600 protects the secret" into a precise statement of what it protects against, which is the strongest finding so far.
- What did not work and why: nothing failed this pass; the 007 citations were exact and cheap to confirm.
- What I would do differently: for every "0600/0700" claim, name the principal it excludes; a mode protects against other OS users, not against a child the runner spawns as the same user.

## Recommended Next Focus
Continue F-1-005 on channels (011) for spoofed chat users and concurrent approvals, then close the security angle with a ranked list.
