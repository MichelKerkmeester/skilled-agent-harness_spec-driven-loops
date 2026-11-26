---
title: "Tasks: Phase 1: activity-and-actor"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "activity and actor tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: activity-and-actor

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

Five shell variables this list uses. `RT` is `.skilled/skills/system-skilled-bots/runtime`. `BOTS` is `node .skilled/bin/bots.cjs`. `SCRATCH` is a fresh `mktemp -d` folder. `SBOTS` is `node .skilled/bin/bots.cjs --repo "$SCRATCH/checkout"`, used for every verb that reads or writes state. `D` is `specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/design`. Every command runs from the repository root with no tty.

**`SBOTS` runs against a scratch checkout, never the operator's state.** `bots.cjs` resolves `inbox`, `status` and `activity` under the installed job's environment when one exists for the checkout, so a shell `XDG_STATE_HOME` is ignored on a host with jobs [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:774-785]. The setup task T000 therefore copies a minimal checkout into `$SCRATCH/checkout` and pins its `stateRoot` under `$SCRATCH`, and every `$SBOTS` command passes `--repo "$SCRATCH/checkout"`. No verify runs a verb against the live state root. This is `contracts/verification.md` V10.

Each implementation task names the `design/` section it builds. A builder that finds a choice the section does not settle stops and reports it rather than choosing.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T000 Build the scratch checkout every `$SBOTS` command runs against (`$SCRATCH/checkout`). Copy `bots/config.json` and one `bots/<id>/BOT.md` into `$SCRATCH/checkout`, and add `"stateRoot": "$SCRATCH/state"` to that copy's `bots/config.json`, so no verb reads or builds the live index. Verify: `test -f "$SCRATCH/checkout/bots/config.json" && rg -c 'stateRoot' "$SCRATCH/checkout/bots/config.json"` prints 1
- [ ] T001 Record the current index schema version (`$RT/lib/status-index.ts`). Verify: `rg -n "SCHEMA_VERSION = " $RT/lib/status-index.ts` prints one line holding `const SCHEMA_VERSION = '2'`
- [ ] T002 Record the current verb list and option sets (`.skilled/bin/bots.cjs`). Verify: `rg -n "VERB_SPECS|FLAG_OPTIONS" .skilled/bin/bots.cjs` prints both declarations and no `activity` entry
- [ ] T003 Record the current needs-you item keys (`$RT/lib/needs-you.ts`). Verify: `rg -n "ITEM_KEYS" $RT/lib/needs-you.ts` prints the declaration and its use, and `rg -n "'by'" $RT/lib/needs-you.ts` prints nothing
- [ ] T004 Record the current run record shape (`$RT/lib/run-record.ts`). Verify: `rg -n "FIELD_GROUPS" $RT/lib/run-record.ts` prints the eight group names and `rg -n "actor" $RT/lib/run-record.ts` prints nothing
- [ ] T005 Capture the baseline suite result (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed` count
- [ ] T006 Record the current sandbox values and the posture check (`$RT/lib/posture.ts`). Verify: `rg -n "SANDBOX_VALUES|validatePosture" $RT/lib/posture.ts` prints the three values and the check, and `rg -n "fullAccess" $RT/lib/posture.ts` prints nothing
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Create the grouping module with the seven ids, their titles and their order, importing `status-index` types only (`$RT/lib/activity.ts`, `$D/data-model.md` sections 1 and 2). Verify: `rg -n "needs_you|recurring" $RT/lib/activity.ts` prints the id list in OpenBot's order and `rg -n "^import" $RT/lib/activity.ts` prints only `import type` lines from `./status-index.js`
- [ ] T008 Add the run-row mapping, the item and live rows, the sort with its tie-break, the empty-group filter and the text lines (`$RT/lib/activity.ts`, `$D/data-model.md` sections 3, 5 and 7). Verify: `rg -n "awaiting-decision|refusalCause|exitClass|schedule|filter" $RT/lib/activity.ts` prints the mapping, the seventh row key and the empty-group filter
- [ ] T009 Create the actor resolver with the name pattern, the three sources, the `scheduled` gate on the pinned operator and the trim-then-exact-match comparison, reading `env` and never `resolveEnv` (`$RT/lib/actor.ts`, `$D/data-model.md` section 8). Verify: `rg -n "ACTOR_PATTERN|resolveActor|trim|SKILLED_BOTS_OPERATOR|scheduled" $RT/lib/actor.ts` prints all five
- [ ] T010 Add `by` and `scope` to the answer, normalize an older answer to four keys on read and land `kind` in the item's key list as a key only that no writer writes (`$RT/lib/needs-you.ts`, `$D/data-model.md` sections 9.1 and 9.2). Verify: `rg -n "'by'|'kind'|'scope'" $RT/lib/needs-you.ts` prints all three keys and the checks for `by` and `scope`, and `rg -n "memory-proposal|skill-proposal" $RT/lib/needs-you.ts` prints nothing because 005-memory owns `kind`'s values
- [ ] T011 Write the actor as the answer's `by` and the scope as its `scope`, judge a duplicate by text and scope and stamp `answeredBy` on the parked run's record after reading it (`$RT/lib/answer.ts`, `$D/data-model.md` sections 9.2 and 9.3). Verify: `rg -n "actor|answeredBy|scope" $RT/lib/answer.ts` prints the input fields, the write, the duplicate check and the record stamp
- [ ] T012 Add `actor` and `answeredBy` to the run record and read a missing one as null (`$RT/lib/run-record.ts`, `$D/data-model.md` section 9.3). Verify: `rg -n "actor|answeredBy" $RT/lib/run-record.ts` prints both fields, their checks and their null defaults
- [ ] T013 Add `actor` to the run summary JSON without moving the schema version or the DDL (`$RT/lib/status-index.ts`, `$D/data-model.md` section 9.4). Verify: `rg -n "SCHEMA_VERSION = " $RT/lib/status-index.ts` prints one line holding `const SCHEMA_VERSION = '2'` and `rg -n "ALTER TABLE|ADD COLUMN" $RT/lib/status-index.ts` prints nothing
- [ ] T014 Write `updatedAt` into `meta` on every build and read it back beside `builtAt` (`$RT/lib/status-index.ts`, `$D/data-model.md` section 6). Verify: `rg -n "actor|updatedAt" $RT/lib/status-index.ts` prints the summary field, the meta write and the read. It prints no insert or select column list
- [ ] T015 Carry the resolved actor on the record seed and the record, copy `answer.by` into a resumed run's `answeredBy`, read `fullAccess` from the install record for `validatePosture` and export the `LeaseSideFile` type (`$RT/lib/runner.ts`, `$D/data-model.md` sections 4.1, 8 and 9.6). Verify: `rg -n "actor|answeredBy|fullAccess|LeaseSideFile" $RT/lib/runner.ts` prints the seed field, the resume copy, the install read and the exported type
- [ ] T016 Pin the operator and the full-access flag into the job environment and read both back (`$RT/lib/plist-render.ts`, `$D/data-model.md` section 9.6). Verify: `rg -n "OPERATOR|FULL_ACCESS" $RT/lib/plist-render.ts` prints the render and the read-back of both
- [ ] T017 Pass the installing operator and the full-access flag into the pinned values and the install record, and carry both through `jobFileEnv` and `pinsOf` (`$RT/lib/installer.ts`, `$D/data-model.md` section 9.6). Verify: `rg -n "operator|fullAccess" $RT/lib/installer.ts` prints both pinned values, both record keys and both carriers
- [ ] T018 Cap a declared `danger-full-access` at `workspace-write` unless `fullAccess` is true (`$RT/lib/posture.ts`, `$D/data-model.md` section 9.7). Verify: `rg -n "workspace-write|fullAccess" $RT/lib/posture.ts` prints the cap and the flag read
- [ ] T019 Add the `activity` verb and its `--json` flag, calling `activityReport` (`.skilled/bin/bots.cjs`, `$D/data-model.md` section 7, `$D/refusals.md` rows R7 to R11). Verify: `$SBOTS activity` prints `bots: no activity` and exits 0
- [ ] T020 Add `--json` and `--all` to `inbox`, keeping the open-and-expired filter on the default form, adding the answered items under `--all` and printing the ten item keys in the order of `$D/data-model.md` section 5 (`.skilled/bin/bots.cjs`). Verify: `$SBOTS inbox --json --all` exits 0 and prints a JSON object with `"version": 1` and an `items` array, and `rg -n "inbox.*--all" .skilled/bin/bots.cjs` prints the inbox usage line
- [ ] T021 Add `--as` and `--scope` to `answer`, `--as` to `run` and `--full-access` to `schedule install`, with the checks in the order `$D/state-machines.md` section 6 draws, in this file alone (`.skilled/bin/bots.cjs`, `$D/refusals.md` rows R1 to R6). Verify: `$SBOTS answer item-1 yes --as "$(whoami)"` prints `bots: item-unknown: item-1` with no tty, `$BOTS answer item-1 yes --as ada < /dev/null` prints `bots: --as needs a tty` and `$BOTS answer item-1 yes --scope always` prints `bots: grant-scope-unsupported`
- [ ] T046 Refuse `answer` and `enable` with `bots: child-write-refused` and exit 2 when `SKILLED_BOT_RUN_ID` or `AI_SESSION_CHILD=1` is in the environment, before the runtime loads (`.skilled/bin/bots.cjs`, `$D/data-model.md` section 8.1, `$D/refusals.md` row R13). Verify: `SKILLED_BOT_RUN_ID=r1 $BOTS answer item-1 yes` prints `bots: child-write-refused` as its first stderr line and exits 2, and `AI_SESSION_CHILD=1 $BOTS enable digest` prints the same line and exits 2
- [ ] T047 Write the install record for a bot whose trigger is not cron when `schedule install` carries `--full-access`, and stop before the plist step (`$RT/lib/installer.ts`, `.skilled/bin/bots.cjs`, `$D/data-model.md` section 9.7). Verify: `rg -n "fullAccess" $RT/lib/installer.ts` prints the record key and the non-cron branch, and `$SBOTS schedule install plain --full-access` exits 0 and prints `full access is recorded and no schedule is installed`
- [ ] T041 Refresh each stale identity on read in one transaction holding every listed record through `indexRunRecord`, the item rows, the generation and `updatedAt`. Apply no retention and print nothing on stderr. Share the refresh between `statusReport` and `activityReport` and add `version` and `updatedAt` to the report (`$RT/lib/status.ts`, `$D/data-model.md` section 6). Verify: `rg -n "refreshStale|recordGeneration|updatedAt|version: 1" $RT/lib/status.ts` prints the shared refresh and the two report keys, and `rg -n "rebuildIndex" $RT/lib/status.ts` prints only the first-build and `--rebuild` calls
- [ ] T042 Gather the live lease side files, the queued requests and the unheld bot schedules with their next fire into `ActivitySources`, and export `activityReport` taking an optional `describe` (`$RT/lib/status.ts`, `$D/data-model.md` section 4). Verify: `rg -n "activityReport|processAlive|validateRequest|translateCron|listSlots|describe" $RT/lib/status.ts` prints the gatherer, its four imports and the seam
- [ ] T022 Create the grouping tests in a `bots activity` block, in tests named `order`, `empty` and `one data set`, covering the group order, the empty-group omission, the tie-break, the text lines and the one data set against the screen's sample (`$RT/tests/activity.vitest.ts`, `$D/fixtures/one-data-set.json`). Verify: `(cd $RT && npx vitest run tests/activity.vitest.ts -t "^bots activity order$")` prints `Tests  1 passed`, `(cd $RT && npx vitest run tests/activity.vitest.ts -t "^bots activity empty$")` prints `Tests  1 passed` and `(cd $RT && npx vitest run tests/activity.vitest.ts -t "^bots activity one data set$")` prints `Tests  1 passed`
- [ ] T023 Create the actor tests in an `actor` block, covering the twelve-row matrix, with a nested `adversarial` block of five cases and a test named `pinned` (`$RT/tests/actor.vitest.ts`). Verify: `(cd $RT && npx vitest run tests/actor.vitest.ts -t "^actor pinned$")` prints `Tests  1 passed` and `(cd $RT && npx vitest run tests/actor.vitest.ts -t "^actor adversarial ")` prints `Tests  5 passed`
- [ ] T024 Extend the needs-you and answer tests with the `by` and `scope` fields, the `once` default, the scope in the duplicate check and the `answeredBy` stamp, in a test named `reads an old answer as by null and scope once` that reads `$D/fixtures/legacy-records.json`, a test named `records the actor in by`, a test named `records the scope and refuses another` and a test named `takes an explicit actor with no tty` that calls `answerItem` with an actor and no tty (`$RT/tests/needs-you.vitest.ts`, `$RT/tests/answer.vitest.ts`). Verify: `(cd $RT && npx vitest run tests/needs-you.vitest.ts -t "^needs-you item reads an old answer as by null and scope once$")` prints `Tests  1 passed`, `(cd $RT && npx vitest run tests/answer.vitest.ts -t "^bots answer records the actor in by$")` prints `Tests  1 passed`, `(cd $RT && npx vitest run tests/answer.vitest.ts -t "^bots answer records the scope and refuses another$")` prints `Tests  1 passed` and `(cd $RT && npx vitest run tests/answer.vitest.ts -t "^bots answer takes an explicit actor with no tty$")` prints `Tests  1 passed`
- [ ] T025 Extend the run-record and status-index tests with the record's two fields, the summary `actor` and the `updatedAt` meta row, in a test named `reads a record written before the actor as null`, a test named `carries the actor in the run summary` and a test named `accepts a write into an index built by the old DDL` (`$RT/tests/run-record.vitest.ts`, `$RT/tests/status-index.vitest.ts`). Verify: `(cd $RT && npx vitest run tests/run-record.vitest.ts -t "^run record reads a record written before the actor as null$")` prints `Tests  1 passed`, `(cd $RT && npx vitest run tests/status-index.vitest.ts -t "^building and rebuilding carries the actor in the run summary$")` prints `Tests  1 passed` and `(cd $RT && npx vitest run tests/status-index.vitest.ts -t "^opening the index accepts a write into an index built by the old DDL$")` prints `Tests  1 passed`
- [ ] T026 Extend the posture tests with the sandbox cap in a test named `caps a declared danger-full-access without full access`, and the resume tests with a full-access bot whose parked run is resumed through the drain in a test named `keeps danger-full-access for a full-access bot the drain resumes` (`$RT/tests/posture.vitest.ts`, `$RT/tests/resume.vitest.ts`). Verify: `(cd $RT && npx vitest run tests/posture.vitest.ts -t "^posture matrix caps a declared danger-full-access without full access$")` prints `Tests  1 passed` and `(cd $RT && npx vitest run tests/resume.vitest.ts -t "^resume requests keeps danger-full-access for a full-access bot the drain resumes$")` prints `Tests  1 passed`
- [ ] T043 Add a test named `refresh on read` that builds the index, lands a run record and a delivery rewrite after it, reads `activityReport` with no rebuild and asserts the new row, the refreshed delivery, `"stale": false` and no deleted run folder, and a test named `row sources` that covers the eleven source and next-fire rows of the plan's matrix with a stub `describe` (`$RT/tests/activity.vitest.ts`, `$D/fixtures/one-data-set.json`, `$D/fixtures/queued-request.json`). Verify: `(cd $RT && npx vitest run tests/activity.vitest.ts -t "^bots activity refresh on read$")` prints `Tests  1 passed` and `(cd $RT && npx vitest run tests/activity.vitest.ts -t "^bots activity row sources$")` prints `Tests  1 passed`
- [ ] T027 Extend the CLI tests with the `activity` verb, `inbox --json` and `--all`, `--as` and `--scope` parsing, the tty refusals, the child refusal and the payload types, in a test named `refuses an id and an unknown option`, a test named `prints the answered item under --all`, a test named `refuses a foreign actor without a tty`, a test named `refuses full access without a tty`, a test named `records full access for a non-cron bot`, a test named `refuses a write from a bot child` and a test named `match the screen's types` that proves `inbox --json --all` prints `$D/fixtures/inbox-all.json`'s `expectAll` (`$RT/tests/cli-run.vitest.ts`). Verify: `(cd $RT && npx vitest run tests/cli-run.vitest.ts -t "^bots activity refuses an id and an unknown option$")` prints `Tests  1 passed`, `(cd $RT && npx vitest run tests/cli-run.vitest.ts -t "^bots inbox prints the answered item under --all$")` prints `Tests  1 passed`, `(cd $RT && npx vitest run tests/cli-run.vitest.ts -t "^bots answer refuses a foreign actor without a tty$")` prints `Tests  1 passed`, `(cd $RT && npx vitest run tests/cli-run.vitest.ts -t "^bots schedule install refuses full access without a tty$")` prints `Tests  1 passed`, `(cd $RT && npx vitest run tests/cli-run.vitest.ts -t "^bots schedule install records full access for a non-cron bot$")` prints `Tests  1 passed`, `(cd $RT && npx vitest run tests/cli-run.vitest.ts -t "^bots answer refuses a write from a bot child$")` prints `Tests  1 passed` and `(cd $RT && npx vitest run tests/cli-run.vitest.ts -t "^the activity and inbox payloads match the screen's types$")` prints `Tests  1 passed`
- [ ] T028 Write the MIT notice for the two lifted files, `app/src/lib/bot-lifecycle/activity-groups.ts` and `shared/activity-rows.ts`, with OpenBot's copyright line (`.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md`). Verify: `rg -n "activity-groups.ts|activity-rows.ts" .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints two lines
- [ ] T029 Add the two module rows to the runtime README (`$RT/lib/README.md`). Verify: `rg -n "activity.ts|actor.ts" $RT/lib/README.md` prints two rows
- [ ] T030 Name the activity verb and the JSON inbox in the status reference (`.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md`). Verify: `rg -n "bots activity|inbox --json" .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints both
- [ ] T031 Add the activity verb to the status mode's allowed Bash (`.skilled/skills/system-skilled-bots/bots-status/SKILL.md`). Verify: `rg -n "bots activity" .skilled/skills/system-skilled-bots/bots-status/SKILL.md` prints the line
- [ ] T032 Document `--as` and `--scope` on `bots answer` and `--full-access` on `bots schedule install` (`.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md`). Verify: `rg -n -- "--as|--scope|--full-access" .skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` prints all three options
- [ ] T033 Prove the `activity --json` and `inbox --json` payloads through the CLI's own output in a test named `payload types` (`$RT/tests/cli-run.vitest.ts`). Also check that every key in `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/payloads/activity.json`, `inbox.json` and `status.json` appears in the real output with the same JSON type, so the screen's fixture and the runtime cannot drift. The comparison is by the screen contract's Type and Null columns for keys whose Producer is `today` or `packet 001`, as `$D/fixtures/README.md` defines it. Verify: `$SBOTS activity --json | jq -e '.version == 1 and (.groups | type == "array")'` exits 0, `$SBOTS inbox --json | jq -e '.version == 1 and (.items | type == "array")'` exits 0, and `cd $RT && npx vitest run tests/cli-run.vitest.ts -t "payload types"` prints one passing test
- [ ] T044 Extend the status tests with `version` and `updatedAt` on the report and `stale` true only after a refresh that could not complete, in a test named `reports stale only after a refresh that could not complete` (`$RT/tests/status.vitest.ts`). Verify: `(cd $RT && npx vitest run tests/status.vitest.ts -t "^bots status reports stale only after a refresh that could not complete$")` prints `Tests  1 passed`
- [ ] T045 Extend the installer tests with the operator and full-access values in the rendered job, the install record and `jobEnv`, in a test named `pins the operator and the full-access flag` (`$RT/tests/installer.vitest.ts`). Verify: `(cd $RT && npx vitest run tests/installer.vitest.ts -t "^install record pins the operator and the full-access flag$")` prints `Tests  1 passed`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T034 Run the whole runtime suite (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`
- [ ] T035 Type-check the runtime (`$RT/`). Verify: `cd $RT && npm run typecheck` exits 0
- [ ] T036 Prove the three CLI surfaces on the scratch checkout (`.skilled/bin/bots.cjs`). Verify: `$SBOTS activity` exits 0, `$SBOTS activity --json` exits 0 and `$SBOTS inbox --json` exits 0
- [ ] T037 Prove the actor round-trip on the scratch checkout (`$RT/tests/answer.vitest.ts`). Verify: `(cd $RT && npx vitest run tests/answer.vitest.ts -t "^bots answer records the actor in by$")` prints `Tests  1 passed`
- [ ] T038 Prove a write into an index built by the old DDL (`$RT/tests/status-index.vitest.ts`). Verify: `(cd $RT && npx vitest run tests/status-index.vitest.ts -t "^opening the index accepts a write into an index built by the old DDL$")` prints `Tests  1 passed`
- [ ] T039 Prove the sandbox cap, the tty refusal and the child refusal (`$RT/tests/posture.vitest.ts`, `$RT/tests/cli-run.vitest.ts`). Verify: `(cd $RT && npx vitest run tests/posture.vitest.ts -t "^posture matrix caps a declared danger-full-access without full access$")` prints `Tests  1 passed`, `(cd $RT && npx vitest run tests/cli-run.vitest.ts -t "^bots answer refuses a foreign actor without a tty$")` prints `Tests  1 passed` and `(cd $RT && npx vitest run tests/cli-run.vitest.ts -t "^bots answer refuses a write from a bot child$")` prints `Tests  1 passed`
- [ ] T040 Run the packet validator (`specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `$SBOTS activity` prints `bots: no activity` on an empty scratch state root and exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Design**: See `design/data-model.md`, `design/state-machines.md`, `design/refusals.md` and `design/fixtures/README.md`
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

A blocked task is marked `[B]` with the reason on the same line, and the phase does not close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md` prints 13
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4\. IMPLEMENTATION PHASES' specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md` prints one line
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `cd $RT && npx vitest --version` exits 0 and `jq --version` exits 0
- [ ] CHK-004 [P0] The design fixtures parse. Verify: `node -e 'require("fs").readdirSync(process.argv[1]).filter((n) => n.endsWith(".json")).forEach((n) => JSON.parse(require("fs").readFileSync(process.argv[1] + "/" + n, "utf8"))), console.log("done")' $D/fixtures` prints `done` and exits 0
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The runtime type-checks. Verify: `cd $RT && npm run typecheck` exits 0
- [ ] CHK-011 [P0] The two new modules print nothing. Verify: `rg -n 'console\.(log|error)' $RT/lib/activity.ts $RT/lib/actor.ts` prints nothing
- [ ] CHK-012 [P1] Error handling implemented. Verify: `rg -n 'ok: false' $RT/lib/actor.ts` prints the refusals
- [ ] CHK-013 [P1] Code follows project patterns. Verify: `rg -n 'Result<' $RT/lib/actor.ts` prints the return type, and `rg -n '^import ' $RT/lib/activity.ts` prints only `import type` lines
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor --strict` prints `RESULT: PASSED`
- [ ] CHK-021 [P0] Manual testing complete. Verify: `$SBOTS activity` exits 0
- [ ] CHK-022 [P1] Edge cases tested. Verify: `(cd $RT && npx vitest run tests/actor.vitest.ts -t "^actor adversarial ")` prints `Tests  5 passed`
- [ ] CHK-023 [P1] Error scenarios validated. Verify: `(cd $RT && npx vitest run tests/status-index.vitest.ts -t "^opening the index accepts a write into an index built by the old DDL$")` prints `Tests  1 passed`
- [ ] CHK-024 [P0] The runtime reproduces the screen's samples. Verify: `(cd $RT && npx vitest run tests/activity.vitest.ts -t "^bots activity one data set$")` prints `Tests  1 passed`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

The plan's affected-surfaces addendum is active because this phase changes a persisted schema and a stored record shape. These rows verify the inventories it names.

- [ ] CHK-FIX-001 [P0] Each changed surface names its class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. Verify: ``rg -c '^\| `runtime/lib/' specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md`` prints 11
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed. Verify: `rg -n 'writeRunRecord|answeredAt' $RT/lib/` prints every writer of a record and of an answer
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed symbols. Verify: `rg -n 'NeedsYouAnswer|RunRecord|RunSummary|SCHEMA_VERSION|validatePosture|PinnedJobValues|pinnedFromPlist' $RT --glob '*.ts'` prints every reader
- [ ] CHK-FIX-004 [P0] The actor's adversarial cases are tested. Verify: `rg -n 'adversarial' $RT/tests/actor.vitest.ts` prints the case block
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Verify: `rg -n 'Matrix axes' specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md` prints the line naming the twelve, six and eleven rows
- [ ] CHK-FIX-006 [P1] The hostile-environment variant ran. Verify: `(cd $RT && npx vitest run tests/actor.vitest.ts -t "^actor pinned$")` prints `Tests  1 passed`
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a commit, not a moving branch. Verify: `git rev-parse --short HEAD` prints the commit the evidence was taken at
- [ ] CHK-FIX-008 [P0] A read deletes nothing. Verify: `(cd $RT && npx vitest run tests/activity.vitest.ts -t "^bots activity refresh on read$")` prints `Tests  1 passed`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Verify: `rg -n 'secret|token|password' $RT/lib/actor.ts` prints nothing
- [ ] CHK-031 [P0] Input validation implemented. Verify: `rg -n 'ACTOR_PATTERN' $RT/lib/actor.ts` prints the pattern and its use
- [ ] CHK-032 [P1] Auth/authz working correctly. Verify: `rg -n 'isTTY|needs a tty' .skilled/bin/bots.cjs` prints the two tty refusals, `rg -n 'child-write-refused|SKILLED_BOT_RUN_ID|AI_SESSION_CHILD' .skilled/bin/bots.cjs` prints the child refusal and its two markers, and `rg -n 'isTTY' $RT/lib/answer.ts` prints nothing, because the refusal is the CLI's alone and the runtime has no sign-in. The actor is a name the host vouches for, and the child marker is a bar rather than an authentication
- [ ] CHK-033 [P0] A definition cannot grant itself full access. Verify: `rg -n 'workspace-write|fullAccess' $RT/lib/posture.ts` prints the cap and the install-time flag read
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized. Verify: `rg -l 'bots activity' specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/tasks.md` prints three paths
- [ ] CHK-041 [P1] Code comments adequate. Verify: `rg -c '^\s*//' $RT/lib/activity.ts` prints a count above zero
- [ ] CHK-042 [P2] The runtime README names both modules. Verify: `rg -n 'activity.ts|actor.ts' $RT/lib/README.md` prints two rows
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/scratch/` lists no file the phase wrote outside it
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Verify: `find specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/scratch -type f` prints nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | [ ]/16 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-11-26
<!-- /ANCHOR:summary -->

---
