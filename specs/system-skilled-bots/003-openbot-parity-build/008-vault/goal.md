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

**Objective:** Give one bot one named secret, stored once by the operator in the macOS keychain or a 0600 file, injected into that bot's child environment only and recorded by name on the run record, so a key never reaches a prompt, a delivery or another bot's environment and a child that prints it is caught after the run. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/goal.md:39]

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The store is the macOS keychain when `security` is on PATH, else a 0600 file under the identity's `secrets` folder, and the index records the backend per entry; `--store` overrides the choice. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:147] |
| D2 | The value is read once, from a no-echo prompt or a piped line, never from an argument, and the keychain backend hands `security -i` the `add-generic-password` command on stdin, so the value never enters argv and no tty is needed. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:146] |
| D3 | `secrets:` stays one name, parsed once in `definition.ts`; a value outside the name grammar is refused `secret-name-invalid` at parse time, so the checker reports `definition.secret-name-invalid` without a new invariant. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:150] |
| D4 | The value reaches the child environment only, under `SKILLED_BOT_SECRET_<NAME>`, through `dispatchEnv` with exactly that key named in `dispatchEnvKeys`, so a second `SKILLED_BOT_SECRET_OTHER` key is still refused. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:152] |
| D5 | The store's boundary is the OS user: the grant is enforced by not injecting a name, never by file permissions, and the residual is accepted for the small-team model. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:165] |
| D6 | `secret-in-output` is the one cause name for the post-run `stdout.log` scan and for 010's returned answer text, so one scan never records two causes. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:164] |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Each criterion traces to a row in `acceptance-criteria.md` or a line in the plan's Definition of Done [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md:60] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:50].

- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/secrets.vitest.ts tests/secret-matcher.vitest.ts` prints a `Test Files` line with no `failed` count, so the store sets, lists, forgets and resolves over both backends, refuses `secret-empty`, `secret-placeholder`, `secret-no-input`, `secret-too-long` and `secret-write-dropped`, the matcher matches a per-value scan, and a run declaring `secrets: demo` injects `SKILLED_BOT_SECRET_DEMO`, records `secretsUsed: ["demo"]`, redacts a printed value as `secret-in-output` and withholds the delivery.
- [ ] `SKILLED_BOTS_STATE_ROOT=$(mktemp -d) sh -c "printf 'skilled-test-value-7f3a\n' | node .skilled/bin/bots.cjs secret set demo --store file && node .skilled/bin/bots.cjs secret list && node .skilled/bin/bots.cjs secret forget demo"` exits 0 and prints `demo` with no `skilled-test-value-7f3a`.
- [ ] `SKILLED_BOTS_STATE_ROOT=$(mktemp -d) node .skilled/bin/bots.cjs secret set demo < /dev/null; echo "exit=$?"` prints `secret-no-input` and `exit=2`.
- [ ] `SKILLED_BOTS_STATE_ROOT=$(mktemp -d) node .skilled/bin/bots.cjs run pb-vault; echo "exit=$?"` prints `refused before dispatch (secret-unknown)` and `exit=4`.
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
| Acceptance criteria | Pending | All sixteen rows in `acceptance-criteria.md` read `Unmet` |

### Deviations and findings

| Item | Note |
|------|------|
| Parent binding row | The parent goal's row for this phase names `008-vault/goal.md`, which this file supplies. No parent decision or criterion changes, so the parent goal needs no amendment and no resend. |
| Plan section added | `plan.md` §8 External orchestration was added in the same run, so the wave assignment and the executor roster sit beside the plan that owns the test strategy. |
| Derived metadata re-derived | Adding `goal.md` changed the source-doc fingerprint, so `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/system-skilled-bots/003-openbot-parity-build/008-vault --apply` re-derived `graph-metadata.json`. |
| Scaffold tokens outside this goal's write scope | `implementation-summary.md` still carries six unfilled value tokens, which the implementation run fills when it writes that file. `validate.sh --strict` reports them as one warning on a Draft packet, not as an error. |
| Durable slice over the parent cap | `node .skilled/hooks/goal/bin/goal.cjs packet specs/system-skilled-bots/003-openbot-parity-build/008-vault --workspace "$PWD"` reports `packet_budget=unknown`, because the 4,000-character cap applies to a top-level goal and a phase parent, not to a child that is neither. The slice is kept short by citing the acceptance-criteria range once rather than once per criterion. |
| The keychain branch is the one this host may not exercise | `security` is on PATH on macOS and absent elsewhere, so the file backend is the one every host can exercise. The keychain branch is pinned by a fake `security` on PATH in `tests/secrets.vitest.ts`, which is what AC-016's process-table sample reads. |
<!-- /ANCHOR:log -->
