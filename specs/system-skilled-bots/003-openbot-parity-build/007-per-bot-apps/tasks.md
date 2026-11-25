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

- [ ] T001 Read the five files this phase edits and record the server count (`$R/definition.ts`, `$R/run-record.ts`, `$R/runner.ts`, `$C`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`). Verify: `python3 -c "import json;d=json.load(open('.utcp_config.json'));print(len(d['manual_call_templates']),'servers')"` prints `14 servers`.
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
- [ ] T008 Add the `apps-refused` cause with class `author` and seed `apps: []` in `declaredPosture` (`$R/runner.ts`). Verify: `grep -c 'apps-refused' $R/runner.ts` prints 1 and `grep -c 'apps: \[\]' $R/runner.ts` prints 1.
- [ ] T009 Call `resolveApps` and `writeRunUtcpConfig` after the posture check and before the worktree, set `seed.posture.apps`, pass `UTCP_CONFIG_FILE` in the environment handed to `dispatchHeadless`, and name it in `dispatchEnvKeys` (`$R/runner.ts`). Verify: `grep -c 'UTCP_CONFIG_FILE' $R/runner.ts` prints 2 and `grep -c 'dispatchEnvKeys' $R/runner.ts` prints 1.
- [ ] T010 Add `dispatchEnvKeys?: string[]` to `RunAuditedExecutorCommandInput` and accept a key that is in the kind's list or in that array in `assertDispatchEnvAllowed`, with no prefix rule (`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`). Verify: `grep -c 'dispatchEnvKeys' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints 2.
- [ ] T011 Add `apps-unknown-server` to `HARD_INVARIANTS` and call `resolveApps` once per definition, reporting its refusal under that id (`$C`). Verify: `grep -c 'apps-unknown-server' $C` prints 2.
- [ ] T012 Create the defect fixture: a `bots/config.json` with an identity and one bot declaring a server the repository config does not hold (`.skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server/`). Verify: `node $C .skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server` prints `FAIL: apps-unknown-server:` and exits 1.
- [ ] T013 Carry `apps: null` with its default named in a comment (`.skilled/skills/system-skilled-bots/assets/bot-template.txt`). Verify: `grep -n 'apps: null' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints one line.
- [ ] T014 Name the field and the invariant in the author reference and the two feature-catalog files, and name the shared-run limit in the author reference: `apps` narrows a worktree run, a shared run reads the repository config, and a shared bot declaring `apps` is refused `apps-unenforceable` (`.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md`, `.skilled/skills/system-skilled-bots/feature-catalog/definition/bot-definition-contract.md`, `.skilled/skills/system-skilled-bots/feature-catalog/definition/definition-checker.md`). Verify: `grep -l 'apps' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md .skilled/skills/system-skilled-bots/feature-catalog/definition/bot-definition-contract.md .skilled/skills/system-skilled-bots/feature-catalog/definition/definition-checker.md` prints all three paths and `grep -c 'apps-unenforceable' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints at least 1.
- [ ] T021 Refuse `apps-unenforceable` with class `author` when the definition declares `apps` and `isolation` is not `worktree`, before any config is written (`$R/runner.ts`). Verify: `grep -c 'apps-unenforceable' $R/runner.ts` prints 1.
- [ ] T022 Restore the worktree's own `.utcp_config.json` after the child exits, so the working tree the operator commits holds the repository config; a commit the child made during the run is left alone, which the risk table names (`$R/runner.ts`). Verify: `grep -c 'utcp_config.json' $R/runner.ts` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Write the unit and integration suite over the declaration and config matrix, including the worktree write, the `apps-unenforceable` refusal, the unlisted-key refusal and the absent-declaration case under both isolations (`$R/../tests/apps.vitest.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts` exits 0.
- [ ] T016 Add the defect row to the checker suite (`.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/bot-check.vitest.ts` exits 0.
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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `grep -c '^| REQ-0' specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md` prints 9.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `grep -c '^## 4. IMPLEMENTATION PHASES' specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md` prints 1.
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm ls yaml vitest` exits 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The runtime typecheck passes. Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0.
- [ ] CHK-011 [P0] The checker still parses as CommonJS. Verify: `node --check .skilled/skills/system-skilled-bots/scripts/bot-check.cjs` exits 0.
- [ ] CHK-012 [P1] Every new refusal is a `Result` with a named reason and never a throw. Verify: `grep -c 'throw' .skilled/skills/system-skilled-bots/runtime/lib/apps.ts` prints 0.
- [ ] CHK-013 [P1] The filtered config copies every top-level key and filters only `manual_call_templates`. Verify: `grep -c 'manual_call_templates' .skilled/skills/system-skilled-bots/runtime/lib/apps.ts` prints at least 1 and the suite's shape test passes.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion in `acceptance-criteria.md` is `Met`. Verify: `grep -c '| Unmet |' specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/acceptance-criteria.md` prints 0.
- [ ] CHK-021 [P0] The declaration and config matrix is covered. Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts` exits 0.
- [ ] CHK-022 [P1] The checker's defect fixture fails under the new invariant. Verify: `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server` exits 1.
- [ ] CHK-023 [P1] The clean fixture still passes. Verify: `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/clean` exits 0.
- [ ] CHK-024 [P1] A run that declares no apps records an empty list and writes an empty server list. Verify: the `apps.vitest.ts` absent-declaration case passes.
- [ ] CHK-025 [P1] A worktree run writes the filtered config into the tree root and leaves the tree's own file behind. Verify: the `apps.vitest.ts` worktree-write case passes.
- [ ] CHK-026 [P1] A run that declares `apps` with no worktree is refused `apps-unenforceable` and writes no config. Verify: the `apps.vitest.ts` no-worktree case passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] The filtered config holds no credential value. Verify: `grep -c 'process.env' .skilled/skills/system-skilled-bots/runtime/lib/apps.ts` prints 0.
- [ ] CHK-031 [P0] An unknown server name is refused, never dropped. Verify: `grep -c 'apps-unknown-server' .skilled/skills/system-skilled-bots/runtime/lib/apps.ts` prints 1.
- [ ] CHK-032 [P1] The child key is a path and not a secret, and it is admitted per dispatch rather than by a prefix or a widened kind list. Verify: `grep -c 'dispatchEnvKeys' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints 2 and `grep -c 'startsWith' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` is unchanged from the baseline T003 records.
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

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 14 | 0/14 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---


