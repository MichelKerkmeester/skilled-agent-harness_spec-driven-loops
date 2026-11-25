---
title: "Tasks: Phase 8: vault"
description: "Ordered tasks for the secret store, the `bots secret` verb group, the child-environment injection and the `secretsUsed` record field, each with the command that proves it."
trigger_phrases:
  - "vault task list"
  - "secret store tasks"
  - "vault verification steps"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: vault

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Four names keep the paths short: `R` is `.skilled/skills/system-skilled-bots/runtime`, `S` is `.skilled/skills/system-skilled-bots`, `RUN` is the run folder the fixture prints, and `STATE` is the identity's state root. The tests plant the value `skilled-test-value-7f3a`, and `pb-vault` is the fixture bot.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the five runtime modules this phase changes and record their refusal ids (`spec.md`). Verify: `rg -c '^\| REQ-' specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md` prints 15.
- [ ] T002 Capture the measured behavior the problem statement rests on (`spec.md`). Verify: `node .skilled/bin/bots.cjs secret set demo` prints `bots: unknown verb: secret` and exits 2.
- [ ] T003 Confirm the dispatch-env gate refuses a key outside its per-kind list (`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`). Verify: `rg -n 'is not allowed for' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints one line.
- [ ] T004 Confirm the identity's state folders carry no `secrets` entry today (`$R/lib/state-root.ts`). Verify: `rg -n 'secrets' $R/lib/state-root.ts` exits 1.
- [ ] T005 [P] Confirm `HonoredPosture` carries no `secretsUsed` today (`$R/lib/run-record.ts`). Verify: `rg -n 'secretsUsed' $R/lib/run-record.ts` exits 1.
- [ ] T006 [P] Confirm the record validator reads a field group as an object and never a posture key (`$R/lib/run-record.ts`). Verify: `rg -n 'FIELD_GROUPS' $R/lib/run-record.ts` prints two lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Store

- [ ] T007 Name and create the identity's `secrets` folder (`$R/lib/state-root.ts`). Verify: `rg -n 'secrets: join' $R/lib/state-root.ts` prints one line.
- [ ] T008 Create the store with the name grammar, the 0600 index and the 0600 value file (`$R/lib/secrets.ts`). Verify: `rg -n 'export function setSecret' $R/lib/secrets.ts` prints one line.
- [ ] T009 Add the keychain backend and the file backend behind one interface, with `--store` overriding the choice, and hand `security -i` the `add-generic-password -a <name> -s skilled-bots -U -w <value>` command on stdin, so the CLI is the only reader, the value never enters argv and no tty is needed (`$R/lib/secrets.ts`). Verify: `rg -n 'add-generic-password' $R/lib/secrets.ts` prints one line and `rg -n "'-i'" $R/lib/secrets.ts` prints one line.
- [ ] T010 Verify each write by reading it back and report a dropped write (`$R/lib/secrets.ts`). Verify: `rg -n 'secret-write-dropped' $R/lib/secrets.ts` prints one line.
- [ ] T011 Add `listSecrets`, `forgetSecret`, `resolveSecret` and `knownSecretValues`, none of which returns a value except `resolveSecret` (`$R/lib/secrets.ts`). Verify: `rg -c 'export function (listSecrets|forgetSecret|resolveSecret|knownSecretValues)' $R/lib/secrets.ts` prints 4.

### Lifted modules

- [ ] T012 Lift the one-pass matcher with its Apache-2.0 notice and a statement of changes (`$R/lib/secret-matcher.ts`). Verify: `rg -n 'Apache-2.0' $R/lib/secret-matcher.ts` prints one line.
- [ ] T013 Lift the placeholder guard and the constant-time compare with its notice (`$R/lib/secrets-guard.ts`). Verify: `rg -n 'Apache-2.0' $R/lib/secrets-guard.ts` prints one line.
- [ ] T014 Append a `## 008-vault` section to `THIRD_PARTY_NOTICES.md` with one entry per lifted file, naming its source path and its changes (`$S/THIRD_PARTY_NOTICES.md`). Verify: `rg -c 'Apache-2.0' $S/THIRD_PARTY_NOTICES.md` prints 2.

### Definition and record

- [ ] T015 Own the one `secrets` name parse and refuse a value outside the name grammar as `secret-name-invalid` (`$R/lib/definition.ts`). Verify: `rg -n 'secret-name-invalid' $R/lib/definition.ts` prints one line.
- [ ] T016 Add `secretsUsed` to `HonoredPosture` and read it as `[]` when an older record omits it (`$R/lib/run-record.ts`). Verify: `rg -c 'secretsUsed' $R/lib/run-record.ts` prints 2.

### Dispatch and runner

- [ ] T017 Add `secretEnv` to `DispatchInput` and merge it into `dispatchEnv` after the per-kind filter (`$R/lib/dispatch.ts`). Verify: `rg -c 'secretEnv' $R/lib/dispatch.ts` prints 2.
- [ ] T018 Add an extra known-secret map to `collectKnownSecrets` and put the matcher behind `findSecretLiteral` (`$R/lib/dispatch.ts`). Verify: `rg -n 'createSecretMatcher' $R/lib/dispatch.ts` prints one line.
- [ ] T019 Resolve the name before dispatch, refuse `secret-unknown`, pass `secretEnv` and record the name (`$R/lib/runner.ts`). Verify: `rg -n 'secret-unknown' $R/lib/runner.ts` prints one line.
- [ ] T020 Scan `stdout.log` after the child exits, redact a matching line in place, record `secret-in-output` and withhold the delivery (`$R/lib/runner.ts`). Verify: `rg -n 'secret-in-output' $R/lib/runner.ts` prints one line.
- [ ] T021 Include the store's values in the delivery check (`$R/lib/delivery.ts`). Verify: `rg -n 'knownSecretValues' $R/lib/delivery.ts` prints one line.
- [ ] T022 Include the store's values in the answer check (`$R/lib/answer.ts`). Verify: `rg -n 'knownSecretValues' $R/lib/answer.ts` prints one line.
- [ ] T023 Take `dispatchEnvKeys` in `assertDispatchEnvAllowed` and name exactly `SKILLED_BOT_SECRET_<NAME>` in it, so a second `SKILLED_BOT_SECRET_OTHER` key is still refused (`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`). Verify: `rg -c 'dispatchEnvKeys' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints 2.

### CLI and docs

- [ ] T024 Add the `secret set|list|forget` verb group, the no-echo prompt and the `secret-no-input` refusal for a closed stdin (`.skilled/bin/bots.cjs`). Verify: `node .skilled/bin/bots.cjs secret list` exits 0.
- [ ] T025 Replace the template comment that says the field is not enforced (`$S/assets/bot-template.txt`). Verify: `rg -n 'secrets:' $S/assets/bot-template.txt` prints one line.
- [ ] T026 Add one row per new module to the files table (`$R/lib/README.md`). Verify: `rg -c 'secrets.ts' $R/lib/README.md` prints 1.
- [ ] T027 Update the author reference and the feature-catalog contract to say the field names a store entry (`$S/bots-author/references/bot-definition.md`, `$S/feature-catalog/definition/bot-definition-contract.md`). Verify: `rg -c 'secrets' $S/bots-author/references/bot-definition.md $S/feature-catalog/definition/bot-definition-contract.md` prints two lines.

### Tests

- [ ] T028 Prove the keychain backend's one reader and its argv: a set with stdin a pipe and no tty stores the value, and a process-table sample taken during it finds no `security` argument carrying it (`$R/tests/secrets.vitest.ts`). Verify: `rg -n 'process table' $R/tests/secrets.vitest.ts` prints one line.
- [ ] T029 Prove the same-user boundary: a child of a bot declaring no `secrets` reads another name's value file, and the record names no secret (`$R/tests/secrets.vitest.ts`). Verify: `rg -n 'same-user' $R/tests/secrets.vitest.ts` prints one line.
- [ ] T030 Prove the post-run scan: a `stdout.log` holding the value is redacted, `secret-in-output` lands on the record and the delivery is withheld, including a partial log from a killed child (`$R/tests/secrets.vitest.ts`). Verify: `rg -n 'secret-in-output' $R/tests/secrets.vitest.ts` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T031 Run the store and matcher tests (`$R/tests/secrets.vitest.ts`, `$R/tests/secret-matcher.vitest.ts`). Verify: `cd $R && npm test -- tests/secrets.vitest.ts tests/secret-matcher.vitest.ts` exits 0.
- [ ] T032 Run the whole runtime suite (`$R/tests/`). Verify: `cd $R && npm test` exits 0.
- [ ] T033 Run the typecheck (`$R/tsconfig.json`). Verify: `cd $R && npm run typecheck` exits 0.
- [ ] T034 Run the definition checker on the clean fixture (`$S/scripts/bot-check.cjs`). Verify: `node $S/scripts/bot-check.cjs $S/scripts/fixtures/clean` exits 0.
- [ ] T035 Run the fixture bot declaring `secrets: demo`, whose body prints its environment's names only, and scan its run folder for the planted value (`$R/tests/secrets.vitest.ts`). Verify: `rg -c 'skilled-test-value-7f3a' "$RUN"` exits 1 and the child's stdout holds `SKILLED_BOT_SECRET_DEMO` with no `=`.
- [ ] T036 Confirm the record carries the name and not the value (`$R/tests/secrets.vitest.ts`). Verify: `jq '.posture.secretsUsed' "$STATE"/*/records/*.json` prints `["demo"]`.
- [ ] T037 Confirm an unknown name refuses before dispatch (`$R/tests/secrets.vitest.ts`). Verify: `node .skilled/bin/bots.cjs run pb-vault` prints `refused before dispatch (secret-unknown)` and exits 4.
- [ ] T038 Confirm no verb prints a value (`$R/tests/secrets.vitest.ts`). Verify: `node .skilled/bin/bots.cjs secret list | rg -c 'skilled-test-value-7f3a'` exits 1.
- [ ] T039 Validate the packet (`specs/system-skilled-bots/003-openbot-parity-build/008-vault/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/008-vault --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every row in `acceptance-criteria.md` is `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md` prints 15.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 3. ARCHITECTURE' specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md` prints one line.
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `rg -n '^## 6. DEPENDENCIES' specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md` prints one line.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The typecheck passes. Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0.
- [ ] CHK-011 [P0] The suite passes with no skipped secret test. Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0.
- [ ] CHK-012 [P1] Every store refusal names its reason and its detail. Verify: `rg -c "reason: 'secret-" .skilled/skills/system-skilled-bots/runtime/lib/secrets.ts` prints at least 5.
- [ ] CHK-013 [P1] The new modules follow the runtime's section-comment layout. Verify: `rg -c '^// [0-9]\. ' .skilled/skills/system-skilled-bots/runtime/lib/secrets.ts` prints at least 3.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion is Met, and there is at least one per requirement. Verify: `test "$(rg -c '\| Met \|' specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md)" -ge "$(rg -c '^\| REQ-' specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md)"` exits 0.
- [ ] CHK-021 [P0] The fixture run proves the injection. Verify: `rg -c 'skilled-test-value-7f3a' "$RUN"` exits 1 and the child's stdout holds `SKILLED_BOT_SECRET_DEMO` with no `=`.
- [ ] CHK-022 [P1] The backend matrix is covered: keychain and file, each with a stored, absent and unreadable store. Verify: `rg -c "backend" .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` prints at least 4.
- [ ] CHK-023 [P1] The adversarial names are covered: a slash, `..`, an empty name and a 65-character name. Verify: `rg -c 'secret-name-invalid' .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` prints at least 4.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Verify: `rg -n 'secrets' .skilled/skills/system-skilled-bots/runtime/lib` names only `definition.ts` before the change.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Verify: `rg -n 'posture\.secrets|secretsUsed|collectKnownSecrets|findSecretLiteral' .skilled --glob '*.ts' --glob '*.cjs'` names every consumer.
- [ ] CHK-FIX-004 [P0] Security fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Verify: `rg -c 'secret-name-invalid|secret-too-long|secret-empty' .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` prints at least 3.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Verify: `rg -n 'Matrix axes' specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md` prints one line.
- [ ] CHK-FIX-006 [P1] Hostile env variant executed when tests or code read process-wide state. Verify: `rg -c 'process\.env' .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` prints at least 1.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret in the new modules or the tests. Verify: `rg -n 'ghp_|sk-[A-Za-z0-9]{20}' .skilled/skills/system-skilled-bots/runtime/lib/secrets.ts .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` exits 1.
- [ ] CHK-031 [P0] The store folder is 0700 and every file it writes is 0600. Verify: `stat -f '%Lp' "$STATE/secrets"` prints 700 and `stat -f '%Lp' "$STATE/secrets/index.json"` prints 600.
- [ ] CHK-032 [P1] The value reaches the child environment only. Verify: `rg -c 'skilled-test-value-7f3a' "$RUN" "$STATE"/*/records/*.json` exits 1.
- [ ] CHK-033 [P0] A child that prints the value is caught after the run. Verify: `rg -c 'secret-in-output' .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` prints at least 1.
- [ ] CHK-034 [P1] The keychain set leaves no value in argv. Verify: `rg -n 'process table' .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` prints one line.
- [ ] CHK-035 [P1] The same-user boundary is stated and pinned. Verify: `rg -n 'same-user' .skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` prints one line.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and acceptance criteria agree on the refusal ids. Verify: `rg -c 'secret-unknown' specs/system-skilled-bots/003-openbot-parity-build/008-vault/*.md` prints one line per document, four in all.
- [ ] CHK-041 [P1] The template comment no longer says the field is unenforced. Verify: `rg -n 'does not enforce' .skilled/skills/system-skilled-bots/assets/bot-template.txt` exits 1.
- [ ] CHK-042 [P2] The bot template names the verb that fills the store. Verify: `rg -n 'bots secret' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints one line.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/008-vault/scratch` lists no tracked artifact.
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Verify: `git status --porcelain specs/system-skilled-bots/003-openbot-parity-build/008-vault/scratch` prints nothing.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 15 | 0/15 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->
