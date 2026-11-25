# Iteration 2: Security — vault (008) and approval grants (006)

## Focus
Frontier node F-1-005 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/005-memory, specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants, specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps, specs/system-skilled-bots/003-openbot-parity-build/008-vault, specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels): Security: in the vault (008), apps (007), approvals (006), memory (005) and channels (011) plans, where can secrets leak into prompts, logs, run records or chat, how are tokens stored, and can a spoofed or unlinked chat user approve or read?

This iteration covered the secret store (008-vault) and the approval ladder (006-approval-grants): token storage, argv/log/prompt leakage, standing-grant semantics and pre-phase item migration.

## Actions Taken
1. Read 008 `plan.md`, `tasks.md`, the requirement and acceptance-criteria blocks of `spec.md`, and the residual-risk table.
2. Checked every 008 DoR probe against the runtime: `posture.secrets`, `SKILLED_BOT_SECRET_`, `secrets` in `state-root.ts`, `secretsUsed` in `run-record.ts`, `assertDispatchEnvAllowed`, the runner literal check, the delivery check.
3. Checked where a run record is written (`recordFile`) to test 008's `$RUN/record.json` verify.
4. Read the host `security help add-generic-password` text to test the keychain write path.
5. Read 006 `plan.md` and the requirement/scope blocks of `spec.md`; checked `needs-you.ts` validation and `buildResumedPrompt`, and the live `--scope` refusal.

## Findings
1. **P1 — phase 008, `spec.md:189` and REQ-001/REQ-002: the default macOS backend puts the secret in a process argument.** The spec's own risk table accepts "the value is visible in `ps` while `security add-generic-password -w <value>` runs" as a Med residual risk mitigated only by help text. Apple's `security help add-generic-password` says "Use of the -p or -w options is insecure. Specify -w as the last option to be prompted." On this host `security` is present, so the keychain is the default and the leak is the default path. **Exact edit:** make the 0600 file the default and `--store keychain` opt-in, or require the keychain write to pass `-w` last on a terminal (refusing the piped path with `secret-keychain-needs-tty`), and add an acceptance test asserting the value never appears in the child's argv. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:189] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:147]

2. **P1 — phase 008, `tasks.md:98` (T033) and `acceptance-criteria.md:65` (AC-008): the record verify targets a file that does not exist.** The run record is written by `writeRunRecord` to `recordFile(stateRoot, identity, runId)` = `{stateRoot}/{identityKey}/records/{runId}.json`, never to `$RUN/record.json`. `jq '.posture.secretsUsed' "$RUN/record.json"` fails on a correct implementation. **Exact edit:** read the record path the runner returns (or `"$STATE"/*/records/*.json`) in T033 and AC-008. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:176-178] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:362-369]

3. **P1 — cross-phase, phase 001 `tasks.md:67` (T025) and phase 008 `tasks.md:64` (T015): two phases own the same notice file with different contents.** Phase 001 creates `THIRD_PARTY_NOTICES.md` with two MIT entries; phase 008 writes three Apache-2.0 entries into the same bare path and verifies `rg -c 'Apache-2.0' THIRD_PARTY_NOTICES.md` prints 3. Neither says append, neither names an absolute path, and a build in phase order overwrites or duplicates the other's entries. **Exact edit:** name 001 the file's owner (create with a `## Lifted sources` section), have 008 append its own section, and make each verify count only its own section. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/tasks.md:67] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md:64]

4. **P1 — phase 006, `spec.md:104` and REQ-005: `--scope always` and `conversation` promise persistence the build does not provide.** The scope is recorded on the item and named in the resumed prompt, and the spec explicitly puts "a saved rule that outlives its item" out of scope, so the operator who answers `always` gets a one-item effect while `bots inbox` prints `always`. **Exact edit:** until a rule store exists, refuse `conversation` and `always` as `grant-scope-unsupported` (leaving `once` and `deny`), or rename them to `this-run`/`deny` and move standing scopes to the phase that adds the store. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:104] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:149]

5. **P1 — phase 006, REQ-001 and the `bots inbox` Definition of Done: no migration rule for items written before `grants`.** The item validator rejects unknown keys and validates a fixed required-key list; adding `grants` to the shape and printing a grant column on every line needs an explicit "a missing `grants` reads as null and prints `-`" rule plus a pre-phase-item test, or existing open items become unreadable and hold their bots. **Exact edit:** add that clause to REQ-001, add a task "read a pre-phase item without `grants` as null", and assert it in `needs-you.vitest.ts`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:96-130]

## Ruled Out
- Suspected 008 DoR drift: ruled out. `posture.secrets` and `SKILLED_BOT_SECRET_` both exit 1; `state-root.ts` and `run-record.ts` contain no `secrets`/`secretsUsed`; `assertDispatchEnvAllowed` is at `executor-audit.ts:1508` and refuses with "is not allowed for" at 1513; the runner literal check is at `runner.ts:942` and the delivery check at `delivery.ts:291`.
- Suspected 006 rollback error (like the 001 one): ruled out. `validateNeedsYouItem` rejects unknown keys, so an item carrying `grants` really is unreadable after a revert.
- Suspected `bots secret set --value` already accepted: ruled out. The CLI has no `secret` verb at all, so the DoR refusal reproduces.

## Dead Ends
- No dead ends; every cited symbol and refusal resolved.

## Edge Cases
- Ambiguous input: none; the frontier question names the five phases and this pass narrowed to 008 and 006.
- Contradictory evidence: phase 008's risk table treats argv exposure as acceptable while Apple's own help calls the option insecure; preserved both claims and ranked the exposure P1 because the default path takes it.
- Missing dependencies: none. The runtime surface 008 names all exists.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts
- .skilled/skills/system-skilled-bots/runtime/lib/runner.ts
- .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts
- Host command output: `security help add-generic-password`

## Assessment
- New information ratio: 1.0
- Questions addressed: F-1-005 for phases 008 and 006
- Questions answered: none fully

## Reflection
- What worked and why: reading the spec's residual-risk table before the tasks caught the argv exposure as a designed-in risk rather than an oversight, which made the finding precise instead of speculative.
- What did not work and why: assuming `$RUN/record.json` existed cost one verification call; the record path is a state-root path, and the check now stands as a finding.
- What I would do differently: resolve every `$RUN`-relative path in a verify clause before trusting the task, because two plans now use run-folder paths for state-root files.

## Recommended Next Focus
Continue F-1-005 on memory (005) and per-bot apps (007): memory-file poisoning and prompt injection, app capability exposure, and where their records or logs can carry secrets; then channels (011) for spoofed chat users and concurrent approvals.
