---
title: "Tasks: Phase 7: per-bot-apps"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "per bot apps tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: per-bot-apps

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

Two shell variables keep the paths short. `R` is `.skilled/skills/system-skilled-bots/runtime/lib`. `C` is `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs`. Every command runs from the repository root unless it names a `cd`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the five files this phase edits, the five design documents and the server count (`$R/definition.ts`, `$R/run-record.ts`, `$R/runner.ts`, `$C`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`, `design/records.md`, `design/state-machines.md`, `design/refusals.md`, `design/fixtures.md`, `design/mockups.md`). Verify: `python3 -c "import json;d=json.load(open('.utcp_config.json'));print(len(d['manual_call_templates']),'servers')"` prints `14 servers` and `ls specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design` prints `fixtures`, `fixtures.md`, `mockups.md`, `records.md`, `refusals.md` and `state-machines.md`.
- [ ] T002 Confirm the checker refuses the key today, so the change has a baseline (`$C`). Verify: `T=$(mktemp -d) && cp -R .skilled/skills/system-skilled-bots/scripts/fixtures/clean "$T/r" && awk '{print} /^isolation: shared$/{print "apps: [github]"}' "$T/r/bots/nightly-digest/BOT.md" > "$T/b" && mv "$T/b" "$T/r/bots/nightly-digest/BOT.md" && node $C "$T/r"` prints `FAIL: definition.unknown-key:` and exits 1.
- [ ] T003 [P] Confirm the executor admits no caller-named key beyond its per-kind list, so the child key needs a new seam (`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`). Verify: `grep -c 'dispatchEnvKeys' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints 0 and `grep -c 'UTCP_CONFIG_FILE' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints 0.
- [ ] T004 [P] Confirm no runtime module or checker line mentions the field yet (`$R`, `$C`). Verify: `grep -rc 'apps' $R/*.ts $C | grep -v ':0'` prints nothing and exits 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add `apps` to `FRONTMATTER_KEYS`, add a list predicate, and parse it into `Posture.apps` with `apps-invalid` for a non-list or an empty entry (`$R/definition.ts`). Verify: `grep -n "'apps'" $R/definition.ts` prints the key-set line and `grep -c 'apps-invalid' $R/definition.ts` prints 1.
- [ ] T006 Create the module with `readUtcpServerNames`, `resolveApps` and `writeRunUtcpConfig`, the last writing `<runFolder>/utcp.json` and, for a run with its own worktree, `<worktree>/.utcp_config.json`, with every top-level key copied, `manual_call_templates` filtered and each `env_file_path` made absolute against the source config's folder, each returning a `Result` with a named reason (`$R/apps.ts`). Verify: `grep -c 'export function' $R/apps.ts` prints 3, `grep -c 'utcp.json' $R/apps.ts` prints 1 and `grep -c 'env_file_path' $R/apps.ts` prints 1.
- [ ] T007 Add `apps: string[]` to `HonoredPosture` and leave the record validator unchanged (`$R/run-record.ts`). Verify: `grep -n 'apps' $R/run-record.ts` prints one line inside the interface.
- [ ] T008 Add the `apps-refused` cause with class `author` and seed `apps: []` in `declaredPosture` (`$R/runner.ts`). Verify: `grep -c "'apps-refused': { reason: 'apps-refused', class: 'author' }" $R/runner.ts` prints 1 and `grep -c 'apps: \[\]' $R/runner.ts` prints 1.
- [ ] T009 Call `resolveApps` and `writeRunUtcpConfig` after the posture check and before the worktree, set `seed.posture.apps`, and pass `UTCP_CONFIG_FILE` in `extraEnv` on the `dispatchHeadless` call (`$R/runner.ts`). Verify: `grep -c 'UTCP_CONFIG_FILE' $R/runner.ts` prints at least 1 and `grep -c 'extraEnv' $R/runner.ts` prints 1.
- [ ] T010 Add `dispatchEnvKeys?: string[]` to `RunAuditedExecutorCommandInput` and bound every entry it admits in `assertDispatchEnvAllowed`: an entry is admitted only when it equals `UTCP_CONFIG_FILE` or matches `^SKILLED_BOT_SECRET_[A-Z0-9_]+$`, and anything else throws. The caller names the key and the gate bounds the namespace, so the check can still fail for a caller that names a key outside it (`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`). Verify: `grep -c 'dispatchEnvKeys' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints 2 and `grep -c 'SKILLED_BOT_SECRET_' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints 1.
- [ ] T011 Add `apps-unknown-server` to `HARD_INVARIANTS` and call `resolveApps` once per definition, reporting its refusal under that id (`$C`). Verify: `grep -c 'apps-unknown-server' $C` prints 2.
- [ ] T012 Create the defect fixture: a `bots/config.json` with an identity, one bot declaring a server the fixture's own `.utcp_config.json` does not hold, and that `.utcp_config.json` holding one `github` template, so the checker's root resolves a config and the invariant can fail (`.skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server/`). Verify: `node $C .skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server` prints `FAIL: apps-unknown-server:` and exits 1.
- [ ] T013 Carry `apps: null` with its default named in a comment (`.skilled/skills/system-skilled-bots/assets/bot-template.txt`). Verify: `grep -n 'apps: null' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints one line.
- [ ] T014 Name the field and the invariant in the author reference and the two feature-catalog files, and name the shared-run limit in the author reference: `apps` narrows a worktree run, a shared run reads the repository config, and a shared bot declaring `apps` is refused `apps-unenforceable` (`.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md`, `.skilled/skills/system-skilled-bots/feature-catalog/definition/bot-definition-contract.md`, `.skilled/skills/system-skilled-bots/feature-catalog/definition/definition-checker.md`). Verify: `grep -l 'apps' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md .skilled/skills/system-skilled-bots/feature-catalog/definition/bot-definition-contract.md .skilled/skills/system-skilled-bots/feature-catalog/definition/definition-checker.md` prints all three paths and `grep -c 'apps-unenforceable' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints at least 1.
- [ ] T021 Refuse `apps-unenforceable` with class `author` when the definition declares `apps` and `isolation` is not `worktree`, before any config is written (`$R/runner.ts`). Verify: `grep -c "'apps-unenforceable': { reason: 'apps-unenforceable', class: 'author' }" $R/runner.ts` prints 1.
- [ ] T022 Restore the worktree's own `.utcp_config.json` after the child exits, so the working tree the operator commits holds the repository config. A commit the child made during the run is left alone, which the risk table names (`$R/runner.ts`). Verify: `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps written file restores the worktree file after the run$")` prints `Tests  1 passed`.
- [ ] T023 Restore a tree found holding the filtered file at the next open, before anything else is written: compare the tree's `.utcp_config.json` with the checkout's, and when the two differ restore the tree's file from the tree's own git index, so a run killed between the write and the restore cannot leave the filtered copy as the base a later run copies from (`$R/runner.ts`). Verify: `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps written file restores a tree left holding the filtered file at the next open$")` prints `Tests  1 passed`.
- [ ] T024 Add `extraEnv?: Record<string, string>` to `DispatchInput`, merge it into the `dispatchEnv` that `dispatchInLineage` already passes to `runAuditedExecutorCommand`, and pass its keys as `dispatchEnvKeys`, so one field carries every caller-named key (`$R/dispatch.ts`). Verify: `grep -c 'extraEnv' $R/dispatch.ts` prints 3.
- [ ] T025 Seed `apps: []` in the posture object `validatePosture` builds, because the runner assigns the whole object and a field the builder omits is lost (`$R/posture.ts`). Verify: `grep -c 'apps' $R/posture.ts` prints 1.
- [ ] T026 Extend the posture assertion of the existing happy-path case with `apps`, so the exact-shape comparison keeps passing (`$R/../tests/runner.vitest.ts`). Verify: `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/runner.vitest.ts -t "^manual run, happy path dispatches once through the stub and leaves one terminal record pointing at its run folder$")` prints `Tests  1 passed`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Write the unit and integration suite over the declaration and config matrix `design/fixtures.md` section 1 fixes, reading the five goldens in `design/fixtures/` (`$R/../tests/apps.vitest.ts`). Six describe blocks and eighteen tests, each name unique in the file: `apps declaration` holds `parses a declared list into posture apps`, `refuses a non-list as apps-invalid` and `refuses an empty entry as apps-invalid`. `apps resolution` holds `refuses an unknown server name`, `refuses a missing config`, `refuses a malformed config` and `honors names in source order`. `apps written file` holds `writes the filtered config into the run folder`, `writes an empty template list for a bot that declares nothing`, `writes the filtered config into the worktree root`, `restores the worktree file after the run` and `restores a tree left holding the filtered file at the next open`. `apps record` holds `records the honored names on the run record` and `records an empty list for a bot that declares nothing`. `apps child environment` holds `passes UTCP_CONFIG_FILE through extraEnv` and `refuses a key outside the kind list and outside dispatchEnvKeys`. `apps refusals` holds `refuses apps-refused before dispatch` and `refuses apps-unenforceable on a shared run`. The absent-declaration case runs under both isolations. Verify: `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps declaration ")` prints `Tests  3 passed`, `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps resolution ")` prints `Tests  4 passed`, `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps written file ")` prints `Tests  5 passed`, `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps record ")` prints `Tests  2 passed`, `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps child environment ")` prints `Tests  2 passed` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps refusals ")` prints `Tests  2 passed`.
- [ ] T016 Add the defect row to the checker suite, so the generated case reads `fails apps-unknown-server with exit 1 and the apps-unknown-server invariant` (`.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts`). Verify: `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/bot-check.vitest.ts -t "^bot-check.cjs fails apps-unknown-server with exit 1 and the apps-unknown-server invariant$")` prints `Tests  1 passed`.
- [ ] T017 Run the whole runtime suite. Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0 and prints no `FAIL` line.
- [ ] T018 Run the runtime typecheck. Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0.
- [ ] T019 Run the checker on the clean fixture, so the new invariant refuses nothing the old checker passed (`$C`). Verify: `node $C .skilled/skills/system-skilled-bots/scripts/fixtures/clean` exits 0.
- [ ] T020 Run `/doctor:bots` over a repository whose bot declares an unknown server (`.opencode/commands/doctor/bots.md`). Verify: the report prints one line naming `apps-unknown-server` and the route writes nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `node $C .skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server` exits 1 and `node $C .skilled/skills/system-skilled-bots/scripts/fixtures/clean` exits 0
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

A blocked task is marked `[B]` with the reason on the same line, and the packet cannot close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `grep -c '^| REQ-0' specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md` prints 10.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `grep -c '^## 4. IMPLEMENTATION PHASES' specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md` prints 1.
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm ls yaml vitest` exits 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The runtime typecheck passes. Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0.
- [ ] CHK-011 [P0] The checker still parses as CommonJS. Verify: `node --check .skilled/skills/system-skilled-bots/scripts/bot-check.cjs` exits 0.
- [ ] CHK-012 [P1] Every new refusal is a `Result` with a named reason and never a throw. Verify: `grep -c 'throw' .skilled/skills/system-skilled-bots/runtime/lib/apps.ts` prints 0.
- [ ] CHK-013 [P1] The filtered config copies every top-level key and filters only `manual_call_templates`. Verify: `grep -c 'manual_call_templates' .skilled/skills/system-skilled-bots/runtime/lib/apps.ts` prints at least 1 and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps written file writes the filtered config into the run folder$")` prints `Tests  1 passed`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion in `acceptance-criteria.md` is `Met`. Verify: `grep -c '| Unmet |' specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/acceptance-criteria.md` prints 0.
- [ ] CHK-021 [P0] The declaration and config matrix is covered. Verify: `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps declaration ")` prints `Tests  3 passed` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps resolution ")` prints `Tests  4 passed`.
- [ ] CHK-022 [P1] The checker's defect fixture fails under the new invariant. Verify: `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server` exits 1.
- [ ] CHK-023 [P1] The clean fixture still passes. Verify: `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/clean` exits 0.
- [ ] CHK-024 [P1] A run that declares no apps records an empty list and writes an empty server list. Verify: `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps written file writes an empty template list for a bot that declares nothing$")` prints `Tests  1 passed` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps record records an empty list for a bot that declares nothing$")` prints `Tests  1 passed`.
- [ ] CHK-025 [P1] A worktree run writes the filtered config into the tree root and leaves the tree's own file behind. Verify: `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps written file writes the filtered config into the worktree root$")` prints `Tests  1 passed`.
- [ ] CHK-026 [P1] A run that declares `apps` with no worktree is refused `apps-unenforceable` and writes no config. Verify: `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps refusals refuses apps-unenforceable on a shared run$")` prints `Tests  1 passed`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] The filtered config holds no credential value. Verify: `grep -c 'process.env' .skilled/skills/system-skilled-bots/runtime/lib/apps.ts` prints 0.
- [ ] CHK-031 [P0] An unknown server name is refused, never dropped. Verify: `grep -c 'apps-unknown-server' .skilled/skills/system-skilled-bots/runtime/lib/apps.ts` prints 1.
- [ ] CHK-032 [P1] The child key is a path and not a secret, and it is admitted per dispatch under a bounded namespace rather than by an open prefix or a widened kind list. Verify: `grep -c 'dispatchEnvKeys' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints 2, `grep -c 'SKILLED_BOT_SECRET_' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints 1 and `grep -c 'startsWith' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` is unchanged from the baseline T003 records.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks agree on the field name and the invariant id. Verify: `grep -l 'apps-unknown-server' specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/tasks.md` prints all three paths.
- [ ] CHK-041 [P1] The template names the field with its default. Verify: `grep -n 'apps: null' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints one line.
- [ ] CHK-042 [P2] The feature catalog names the field and the invariant. Verify: `grep -c 'apps' .skilled/skills/system-skilled-bots/feature-catalog/definition/definition-checker.md` prints at least 1.
- [ ] CHK-043 [P1] The author reference names the shared-run limit, so an author who omits `apps` on a shared bot is told its child still reads the repository config. Verify: `grep -c 'apps-unenforceable' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints at least 1.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The measured-behavior copies live under `scratch/` only. Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/scratch/measured` lists `clean` and `with-apps`.
- [ ] CHK-051 [P1] `scratch/` is cleaned before completion. Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/scratch` prints nothing.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:design -->
## Design Documents

- [ ] CHK-060 [P0] The five design documents exist. Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design` prints `fixtures`, `fixtures.md`, `mockups.md`, `records.md`, `refusals.md` and `state-machines.md`.
- [ ] CHK-061 [P0] The five goldens parse. Verify: `cd specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design/fixtures && for f in *.json; do node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "$f" || echo "BAD $f"; done` prints no `BAD` line.
- [ ] CHK-062 [P0] The filtered goldens carry the source's four top-level keys, one template and none and an absolute dotenv path. Verify: the second command in `design/fixtures.md` section 5 prints `4 top-level keys, 1 template and 0 templates, absolute dotenv path`.
- [ ] CHK-063 [P0] The two posture goldens carry the field this phase adds. Verify: the third command in `design/fixtures.md` section 5 prints `worktree apps github, shared apps empty`.
- [ ] CHK-064 [P1] The design documents carry the diagrams and the tables a builder reads. Verify: `grep -c '```mermaid' specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design/state-machines.md` prints 6 and `grep -c '^| ' specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design/records.md` prints at least 20.
- [ ] CHK-065 [P1] Every refusal name the design catalogue lists is the name the packet contract lists. Verify: `grep -c 'apps-invalid\|apps-unknown-server\|apps-refused\|apps-unenforceable\|utcp-config-missing\|utcp-config-invalid' specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design/refusals.md` prints at least 6.
<!-- /ANCHOR:design -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 16 | 0/16 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---


