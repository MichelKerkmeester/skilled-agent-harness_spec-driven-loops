---
title: "Goal: Phase 8: vault"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/008-vault"
    last_updated_at: "2026-11-25T19:58:32Z"
    last_updated_by: "create-goal"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w3-008-vault"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 8: vault

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give one bot one named secret, stored once by the operator in the OS keychain or a 0600 file, injected into that bot's child environment only and recorded by name on the run record, so a key never reaches a prompt, a delivery or another bot's environment and a child that prints it is caught after the run. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/goal.md:39]

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The store is the OS keychain when the host has one (`security` on macOS, `secret-tool` on Linux), else a 0600 file under the identity's `secrets` folder. The index `contracts/records.md` section 8 fixes records the backend per entry, and `--store` on `set` overrides the choice. Each keychain item is account `<name>@<scope>` under service `skilled-bots`, and its password is the hex of the value. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:151] |
| D2 | The value is read once, from a no-echo prompt or a piped line, never from an argument, and the macOS keychain backend hands `security -q -i` one `add-generic-password` line on stdin, refused before the spawn when it is over 4,095 bytes, so the value never enters argv and no tty is needed. Every keychain spawn is killed after 10 s. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:151] |
| D3 | `secrets:` stays one name in the grammar `^[a-z0-9][a-z0-9-]*$` of at most 64 characters. A value outside it is refused `secret-name-invalid` at parse time, so the checker reports `definition.secret-name-invalid` without a new invariant. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:154] |
| D4 | The value reaches the child environment only, under `SKILLED_BOT_SECRET_` plus the name upper-cased with each hyphen turned into an underscore, through `dispatchEnv` with exactly that key named in `dispatchEnvKeys`, so a second `SKILLED_BOT_SECRET_OTHER` key is still refused. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:156] |
| D5 | The store's boundary is the OS user: the grant is enforced by not injecting a name, never by file permissions, and the residual is accepted for the small-team model, as packet decision D6 confirms. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:169] |
| D6 | `secret-in-output` is the one cause name for the post-run scan and for 010's returned answer text. A match reads `[redacted: <name>]`, the delivery is withheld and the run keeps its own exit. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:168] |
| D7 | `set` and `forget` hold `secrets/index.lock` across their change. `set` writes the value, reads it back, then writes the index. `forget` writes the index, then deletes the value. A value with no index entry is ignored and removed by the next `set` or `forget` of that name. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:172] |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Each criterion traces to a row in `acceptance-criteria.md` or a line in the plan's Definition of Done [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md, AC-001] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md, section "Definition of Done"].

- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/secrets.vitest.ts tests/secret-matcher.vitest.ts` prints a `Test Files` line with no `failed` count, so the store sets, lists, forgets and resolves over the file backend and the fake keychain programs, refuses `secret-empty`, `secret-no-input`, `secret-too-long`, `secret-write-dropped` and `secret-store-unreadable`, keeps the index true under racing and stopped writers, the matcher matches a per-value scan, and a run declaring `secrets: demo` injects `SKILLED_BOT_SECRET_DEMO`, records `secretsUsed: ["demo"]`, redacts a printed value to `[redacted: demo]` as `secret-in-output` and withholds the delivery.
- [ ] After the `FIXTURE` recipe in `tasks.md` Task Notation, `printf 'skilled-test-value-7f3a\n' | node .skilled/bin/bots.cjs secret set demo --store file --repo "$FIXTURE" && node .skilled/bin/bots.cjs secret list --repo "$FIXTURE" && node .skilled/bin/bots.cjs secret forget demo --repo "$FIXTURE"` exits 0 and prints `demo` with no `skilled-test-value-7f3a`.
- [ ] `node .skilled/bin/bots.cjs secret set demo --store file --repo "$FIXTURE" < /dev/null; echo "exit=$?"` prints `secret-no-input` and `exit=2`.
- [ ] `node .skilled/bin/bots.cjs run pb-vault --repo "$FIXTURE"; echo "exit=$?"` prints `bots: pb-vault refused before dispatch (secret-unknown): absent is not stored, run bots secret set absent` and `exit=4`.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/008-vault --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Goal authored | Done | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/008-vault` prints `RESULT: PASSED (5/5 checks)` |
| Packet validates | Done | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/008-vault --strict` prints `RESULT: PASSED` |
| Implementation | Pending | `rg -n 'export function setSecret' .skilled/skills/system-skilled-bots/runtime/lib/secrets.ts` exits 2, so the store does not exist yet |
| Acceptance criteria | Pending | All 28 rows in `acceptance-criteria.md` read `Unmet` |

### Deviations and findings

| Item | Note |
|------|------|
| Parent binding row | The parent goal's row for this phase names `008-vault/goal.md`, which this file supplies. No parent decision or criterion changes, so the parent goal needs no amendment and no resend. |
| Plan section added | `plan.md` §8 External orchestration was added in the same run, so the wave assignment and the executor roster sit beside the plan that owns the test strategy. |
| Derived metadata re-derived | Adding `goal.md` changed the source-doc fingerprint, so `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/system-skilled-bots/003-openbot-parity-build/008-vault --apply` re-derived `graph-metadata.json`. |
| Scaffold tokens outside this goal's write scope | `implementation-summary.md` still carries six unfilled value tokens, which the implementation run fills when it writes that file. `validate.sh --strict` reports them as one warning on a Draft packet, not as an error. |
| Durable slice over the parent cap | `node .skilled/hooks/goal/bin/goal.cjs packet specs/system-skilled-bots/003-openbot-parity-build/008-vault --workspace "$PWD"` reports `packet_budget=unknown`, because the 4,000-character cap applies to a top-level goal and a phase parent, not to a child that is neither. The slice is kept short by citing the acceptance-criteria range once rather than once per criterion. |
| The keychain branch is the one this host may not exercise | `security` is on PATH on macOS and absent elsewhere, so the file backend is the one every host can exercise. The keychain branch is pinned by a fake `security` and a fake `secret-tool` on PATH in `tests/secrets.vitest.ts`, whose argv log AC-016 reads, and by one macOS round trip through a scratch keychain. |
| Plan-depth work order WO-06 applied | 2026-11-26: the seven `design/` notes were written and spec, plan, tasks, acceptance criteria and this goal were brought into line with them and the contracts. The probes behind `design/backends.md` found that `security -i` splits a line over 4,096 bytes into commands that write to the default keychain, that a locked keychain blocks `security` with no limit and that the prompting form truncates at 128 characters. D1, D2, D4 and D6 were amended and D7 added. |
| Proposed contract amendments | Three, for the contract owner, none applied because `contracts/` is frozen for this phase. (1) `contracts/refusals.md` section 3.7, `secret-store-unreadable` row, Layer cell: replace `Run refusal` with `Run refusal, and a verb refusal on set, list, forget and answer, exit 4`. (2) The same file, a new row only if the owner wants a named short-value refusal: `secret-too-short`, verb refusal, exit 2, closing `design/threat-model.md` T9. (3) `contracts/records.md` section 8, last paragraph: replace `are 008's plan to state under its own work order` with `are stated in 008-vault/design/backends.md and index-and-writes.md`. (4) `contracts/records.md` sections 4 and 17 say `names` and the redaction token carry secret names, while the post-run scan also names environment and dotenv map keys: replace "secret names" with "secret names, or the known-secret map key for an environment or dotenv value". WO-06's refusal for `--store` on `forget` is not proposed, because `forget` takes no `--store` |
| Contract amendments applied | 2026-11-26, by the contract reconciliation pass. (1) Applied: `contracts/refusals.md` section 3.7 lists `secret-store-unreadable` as a run refusal and a verb refusal on `secret set`, `secret list`, `secret forget` and `answer`, exit 4, citing REQ-017. (2) Not applied, the default: no `secret-too-short` row, because `design/threat-model.md` T9 accepts the residual. Section 3.7 now says so in one sentence, so a later name is a new row there and a new check here. (3) Applied: `contracts/records.md` section 8 points at `design/backends.md` and `design/index-and-writes.md`, and its `backend` row says `keychain` covers the Linux Secret Service through `secret-tool`, which settles the Linux backend against the two-value enum. (4) Applied: `contracts/records.md` section 4 (`postRunCauses.names`) and section 17 (redaction token) allow the known-secret map key for an environment or dotenv value beside a secret name. `design/backends.md` section 6 still calls the verb use a widening the contract does not yet name, which is now stale and is the 008 writer's to drop |
| Final-review fixes applied | 2026-11-26: F-003, F-009, F-017, F-018, F-028, O-021 and O-022 applied in this folder. The secret key now travels on 007's `extraEnv` field, so this phase adds no `DispatchInput` field and no second merge. The gate admits a `dispatchEnvKeys` entry only at the `UTCP_CONFIG_FILE` or `SKILLED_BOT_SECRET_` floor. `collectAllKnownSecrets` replaces the per-caller merge and every call site that exists at build time migrates, 005's included. The post-run scan reads the child's stderr through a new `onStderr` option. `postRunCauses` is extended, not declared, because 005 lands it. AC-027 is new, and AC-007 and AC-014 now cover stderr. |
| Choices taken by the assistant | 2026-11-26, under the operator's do-not-ask directive, where a finding named alternatives the first one was taken. F-003: `extraEnv: Record<string, string>` as the one `DispatchInput` field. F-009: `onStderr` rather than `echoStderr: false`. F-018: `collectAllKnownSecrets(env, checkoutRoot, stateRoot, identity)` as the one function. F-017: the `UTCP_CONFIG_FILE` or `^SKILLED_BOT_SECRET_[A-Z0-9_]+$` floor. |
| Choices taken by the assistant, second wave | 2026-11-26, under the operator's do-not-ask directive, where a finding named alternatives the first one was taken. F-074: `setBy` added to the secrets index rather than striking "secret records" from the parent's Scope line. |
| Verify commands re-pinned | The criteria used `SKILLED_BOTS_STATE_ROOT=$(mktemp -d)`, which the verb's job-environment resolution turns into `XDG_STATE_HOME` set to the temp folder's parent, so it was not isolated. They now use the `FIXTURE` recipe, which pins the state root in the fixture's own config. |
<!-- /ANCHOR:log -->
