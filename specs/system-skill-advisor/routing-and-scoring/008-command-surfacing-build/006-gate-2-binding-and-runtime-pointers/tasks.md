---
title: "Tasks: Phase 6: gate-2-binding-and-runtime-pointers"
description: "Ordered tasks to add the Gate 2 command bullet, copy it into the Cursor rule, hand hub modes to their commands, name the plan workflow at Gate 3 and downgrade commands in a child brief."
trigger_phrases:
  - "gate 2 binding and runtime pointers tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: gate-2-binding-and-runtime-pointers

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

Every command runs from the repository root unless a task says otherwise. `ADV` is `.skilled/skills/system-skill-advisor/runtime`. `SSK` is `.skilled/skills/system-spec-kit/runtime`. `SYNC` is `$SSK/cli/runtime-mirrors/sync-gate1-pointers.cjs`. `MAN` is `.skilled/commands/doctor/assets/agents-md-manifest.json`. `CHK` is `node .skilled/commands/doctor/scripts/agents-md-check.cjs`. `HOOKDOC` is `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`. `S` is this phase's `scratch/` folder. `G1T` is `(cd $SSK/cli && npx vitest run tests/gate1-pointer-sync.vitest.ts --config ../vitest.config.ts --root .)`.

Each task is one change to the files it names, small enough for a worker with a short brief. The operator answered the four wording questions on 2026-11-12, and `spec.md` section 10 quotes each answer. No task reads holdout prompt text.

Worker waves. Tasks in one wave touch different files and can run in parallel.
- Wave 0, 2 tasks: T001, T002. Read-only setup.
- Wave 1, 12 tasks: T003 (`AGENTS.md`), T004 (`SYNC`), T005 (`HOOKDOC`), T006 (`advisor-runtime-values.ts`), T007 (`advisor-observability.vitest.ts`), T008 (`hook-brief-signal-noise.bench.ts`), T009, T010 and T011 (one `ROUTER.md` each), T012 (`spec-gate-core.mjs`), T013 (`create.sh`), T014 (the deriver, only if its condition holds).
- Wave 2, 8 tasks: T015 (`render.ts`), T016 (`MAN`), T017 (gate1 test), T018 (`HOOKDOC`), T019 (parity test, new), T020 (spec-gate test), T021 (runtime-mirrors README), T022 (label removal test, new).
- Wave 3, 4 tasks: T023 (child render test, new), T024 (`MAN`, generated), T025 (`.cursor/rules/skill-routing.md`, generated), T026 (`HOOKDOC`).
- Verification, 9 tasks, one at a time: T027 to T035.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-read the before numbers (`$S/before.txt`). Verify: `$CHK | grep -E "^A(4|6) |^STATUS"` prints `44 current`, `15629 of 16384` and `STATUS=OK`, `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` prints `30 pins`, `node $SYNC --check` exits 0 and `node $S/measure-policies.mjs | head -1` prints `commands 44 {"start":20,"ask":17,"run":7}`.
- [x] T002 Confirm phase 005 shipped the brief line (`$S/phase005-check.txt`). Verify: `bash $S/hook-first-line.sh "create a readme for the utils folder"` prints a line holding `/create:readme` and `(start)`. If it does not, mark T014, T015, T023, T026 and T033 `[B]` with the line it printed, and carry on with the rest.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Insert one line in `AGENTS.md` Gate 2, right after the line `- Confidence ≥ 0.8 → MUST invoke skill | < 0.8 → general approach | User names skill → cite and proceed`. The line is the exact content of `$S/bullet-draft.txt`: ``- **Command in the brief.** A brief or advisor result that names a command offers its workflow beside the skill's. Take either path whole, never an improvised one. To take the command, read its document in full and follow it. `run` starts it now. `start` starts it without `:auto`, so its setup asks. `ask` offers it in one question and waits. A typed command or explicit instruction outranks the policy. Output: `COMMAND: [/name] → [started|offered|declined]` `` (`AGENTS.md`). Verify: `rg -c "^- \*\*Command in the brief\.\*\*" AGENTS.md` prints 1, and `diff <(rg "^- \*\*Command in the brief" AGENTS.md) $S/bullet-draft.txt` prints nothing.
- [x] T004 In `SYNC`, add a second block. Add the constants `START_COMMAND = '<!-- spec-kit:gate2-command-pointer:start -->'`, `END_COMMAND = '<!-- spec-kit:gate2-command-pointer:end -->'`, `GATE_TWO_CALL_MARKER = 'skill-advisor.cjs advisor_recommend'` and `GATE_TWO_COMMAND_MARKER = '**Command in the brief.**'`. Read the first `AGENTS.md` line holding each marker, with a leading `2. ` stripped as `readGateOneLine` does. When both lines exist, write a block right after the Gate 1 block: the start marker, `## Gate 2 command routing (generated from the root AGENTS.md)`, a blank line, `Cursor gets no per-prompt advisor brief under the tested build. Before acting, run the direct call below, then apply the command rule:`, a blank line, the call line, a blank line, the command line, a blank line, the same `Generated by` line as block one, the end marker. When either line is missing, remove an existing second block and write nothing for it. Under `--check`, report `pointer block differs from the root AGENTS.md Gate 2 lines` or `no Gate 2 command block` and exit 1. Export the new names (`.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs`). Verify: `node --check $SYNC` exits 0, and `rg -c "GATE_TWO_COMMAND_MARKER = '\*\*Command in the brief\.\*\*'" $SYNC` prints 1.
- [x] T005 [P] In `HOOKDOC` section 3, add a DSH row after the OpenCode row: runtime `**DSH**`, adapter `system-skill-advisor/hooks/dsh/prompt-advisor.mjs`, imported by `.dsh/plugins/repo-guards/adapters/prompt-advisor.mjs`, wiring `agent/pre-step` through the `repo-guards` plugin, on unless the `promptAdvisor` row flag is `false`, payload note `A fan-out leaf, marked by the lineage patch, gets no brief`, delivery `Brief added to the step`. In section 4, add a `dsh/` entry with `README.md` and `prompt-advisor.mjs` (`.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`). Verify: `rg -n '^\| \*\*DSH\*\* \|' $HOOKDOC` prints 1 line, and `rg -c "prompt-advisor.mjs" $HOOKDOC` prints at least 2.
- [x] T006 [P] Remove the `'copilot',` line from `ADVISOR_RUNTIME_VALUES`, leaving seven labels in this order: `claude`, `opencode`, `pi`, `codex`, `cursor`, `devin`, `dsh`. Add no retired list (`.skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts`). Verify: `rg -c "copilot" $ADV/lib/advisor-runtime-values.ts` prints nothing and exits 1, and in `$ADV`, `npm run typecheck` exits 0.
- [x] T007 [P] In the observability test, change the expectation `expect(ADVISOR_RUNTIME_VALUES).toEqual([...])` to the seven labels T006 leaves, in the same order (`$ADV/tests/legacy/advisor-observability.vitest.ts`). Verify: after T006, in `$ADV`, `npx vitest run tests/legacy/advisor-observability.vitest.ts` reports 0 failed, and `rg -c "copilot" $ADV/tests/legacy/advisor-observability.vitest.ts` prints nothing.
- [x] T008 [P] In the brief benchmark, delete the `copilot` row of `SEVEN_AXIS_MATRIX` and drop `copilot` from the header comment that lists the runtimes (`$ADV/bench/hook-brief-signal-noise.bench.ts`). Verify: `rg -c "copilot" $ADV/bench/hook-brief-signal-noise.bench.ts` prints nothing and exits 1. The bench sits outside `npm run typecheck` and the default test run, so this grep is its check.
- [x] T009 [P] Add one bullet as the last item of section 4, HOW TO READ THIS, in `.skilled/skills/sk-doc/ROUTER.md`: ``- A mode whose `mode-registry.json` row names a `command` has two whole entries: read that command's document in full and follow it under the policy the advisor names, or follow this mode's packet. Pick one and keep to it. A mode whose row has `command: null` has only its packet.`` (`.skilled/skills/sk-doc/ROUTER.md`). Verify: `rg -c "has two whole entries" .skilled/skills/sk-doc/ROUTER.md` prints 1, and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` exits 0.
- [x] T010 [P] Add the same bullet as T009 as the last item of section 4 in `.skilled/skills/sk-design/ROUTER.md` (`.skilled/skills/sk-design/ROUTER.md`). Verify: `rg -c "has two whole entries" .skilled/skills/sk-design/ROUTER.md` prints 1, and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-design` exits 0.
- [x] T011 [P] Add the T009 bullet as the last item of section 4 in `.skilled/skills/system-deep-loop/ROUTER.md`, followed in the same bullet by: ``Where a mode packet names its command as its only entry, as `deep-research/SKILL.md` does, both entries lead to the command.`` (`.skilled/skills/system-deep-loop/ROUTER.md`). Verify: `rg -c "has two whole entries" .skilled/skills/system-deep-loop/ROUTER.md` prints 1, and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop` exits 0.
- [x] T012 [P] In `GATE_3_MUTATION_NOTICE`, insert one array item right after `'The answer holds for the rest of this session: do not ask this again on later turns.'`: `'For a new folder, start /speckit:plan, or /speckit:complete when the operator asked for the build itself: read that command document in full and follow it without :auto.'` (`$SSK/hooks/lib/spec-gate/spec-gate-core.mjs`). Verify: `rg -c "speckit:plan" $SSK/hooks/lib/spec-gate/spec-gate-core.mjs` prints 1, and `node --check $SSK/hooks/lib/spec-gate/spec-gate-core.mjs` exits 0.
- [x] T013 [P] In the standard next-steps block of `create.sh`, the one that prints `1. Fill out spec.md with requirements`, add after the lazy add-ons `if` block: `echo "    6. Plan the work with /speckit:plan, or plan and build with /speckit:complete, unless one of them created this folder"` (`$SSK/cli/spec/create.sh`). Verify: `bash -n $SSK/cli/spec/create.sh` exits 0, and `rg -c "6. Plan the work with /speckit:plan" $SSK/cli/spec/create.sh` prints 1.
- [x] T014 The command table phase 005 generates (`COMMAND_ROWS` in `$ADV/lib/command-attach.ts`) carries a policy but no `mutating` class, and T015 needs the class. In `renderCommandRows` of `$ADV/scripts/command-bridges/derive-command-bridges.cjs`, add `mutating: '<class>'` to each `COMMAND_ROWS` row, taken from the same `commandPolicies` record that supplies the row's policy, placed after `policy` and left out when the row has no policy record. In `$ADV/lib/command-attach.ts`, add `readonly mutating?: 'read-only' | 'add-only' | 'mutates';` to the `CommandRow` interface, outside the generated block. Then run `node $ADV/scripts/command-bridges/derive-command-bridges.cjs`. Verify: `node $ADV/scripts/command-bridges/derive-command-bridges.cjs --check | jq -r .status` prints `fresh`, `rg -c "'command-doctor-git-setup': \{ command: '/doctor:git setup', policy: 'run', mutating: 'read-only'" $ADV/lib/command-attach.ts` prints 1, `rg -c "'command-doctor-speckit': \{ command: '/doctor:speckit', policy: 'run', mutating: 'add-only'" $ADV/lib/command-attach.ts` prints 1, and in `$ADV`, `npm run typecheck` exits 0 and `npx vitest run tests/command-brief-golden.vitest.ts tests/doctor-command-bridges.vitest.ts` reports 0 failed.
- [x] T015 In `$ADV/lib/render.ts`, add `childSession?: boolean` to `AdvisorBriefRenderOptions`, defaulting to `process.env.AI_SESSION_CHILD === '1'`. When it is true, the command shown in the head line, and in an `Also:` line, renders `(parent-named only)` in place of its policy word when the policy is `start` or `ask`, or when it is `run` and the class is not `read-only`. Nothing else in the brief changes (`.skilled/skills/system-skill-advisor/runtime/lib/render.ts`). Verify: in `$ADV`, `npm run typecheck` exits 0, and `npx vitest run tests/doctor-brief-render.vitest.ts tests/hooks` reports 0 failed.
- [x] T016 [P] In `MAN` `pins`, add an entry right after `gate1-lookup`: `"id": "gate2-command"`, `"kind": "first-occurrence"`, `"section": "gate-2"`, `"texts": ["**Command in the brief.**"]`, `"consumer": ".skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs"`, `"consumer_evidence": ["GATE_TWO_COMMAND_MARKER = '**Command in the brief.**'"]` and a `why` saying the Cursor rule's second block is generated from the first line holding this marker (`.skilled/commands/doctor/assets/agents-md-manifest.json`). Verify: `node -e 'const m=require("./.skilled/commands/doctor/assets/agents-md-manifest.json");console.log(m.pins.length, m.pins.some((p)=>p.id==="gate2-command"))'` prints `31 true`.
- [x] T017 [P] In `gate1-pointer-sync.vitest.ts`, seed `AGENTS.md` with a Gate 2 call line and a command line, and add three cases: both blocks are written and `--check` exits 0, a root with no command line gets block one only and a stale second block is removed, and a hand edit inside the second block makes `--check` exit 1 with `pointer block differs from the root AGENTS.md Gate 2 lines` (`$SSK/cli/tests/gate1-pointer-sync.vitest.ts`). Verify: `$G1T` reports 7 passed and 0 failed.
- [x] T018 [P] In `HOOKDOC`, add a subsection `### Starting a surfaced command` at the end of section 3. It says the command document is `.skilled/commands/<group>/<name>.md`, the model reads it in full and follows it on every runtime, never tells the user to type a slash command and asks the user to type one only when it cannot read the file. Then a table with columns `Runtime`, `Model can start a command itself` and `Basis`, one row each for Claude Code, Codex, Cursor, Devin, Pi, OpenCode and DSH, taken from section 2.8 of `../../007-command-surfacing-and-workflow-enforcement/research/synthesis-review.md`. Write runtime names in plain text, not bold, so the parity test reads only the adapter table. Claude Code's row says the Skill tool is a shortcut for the names it lists, and that it lists one `create` entry and none of the other twelve `create:*` names (`.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`). Verify: `rg -n "^### Starting a surfaced command" $HOOKDOC` prints 1 line, and `rg -c '^\| \*\*' $HOOKDOC` still prints 7.
- [x] T019 [P] Create `$ADV/tests/hooks/advisor-runtime-list-parity.vitest.ts`. Export a pure `compareRuntimeLists(index, table, enumValues)` that returns the names missing from each list. Read the index as the directory names under `.skilled/hooks/skill-advisor/`, the table as the lowercased bold names in `HOOKDOC` rows matching `^\| \*\*([A-Za-z]+)\*\* \|`, and the enum as `ADVISOR_RUNTIME_VALUES`. One case asserts the three real lists agree. One case passes an index with an extra name and asserts the function reports it (`.skilled/skills/system-skill-advisor/runtime/tests/hooks/advisor-runtime-list-parity.vitest.ts`). Verify: in `$ADV`, `npx vitest run tests/hooks/advisor-runtime-list-parity.vitest.ts` reports 2 passed and 0 failed.
- [x] T020 [P] In the test `Gate-3 delivery flag off preserves byte-identical baseline output`, add the T012 line to the `mutationNotice` array at the same position (`$SSK/tests/hooks/spec-gate-core.test.mjs`). Verify: `(cd $SSK && node --test tests/hooks/spec-gate-core.test.mjs)` prints `fail 0` and `pass 107`.
- [x] T021 [P] In the `sync-gate1-pointers.cjs` row of the runtime-mirrors README, say the script writes two blocks into `.cursor/rules/skill-routing.md`: the Gate 1 lookup and the Gate 2 command rule with its direct call (`$SSK/cli/runtime-mirrors/README.md`). Verify: `rg -n "sync-gate1-pointers" $SSK/cli/runtime-mirrors/README.md` prints a line naming `Gate 2`.
- [x] T022 [P] Create `$ADV/tests/legacy/runtime-label-removal.vitest.ts` for a record or input that still carries `copilot`. Use a temporary workspace root and delete the two files it writes afterwards. Cases: a diagnostics file at `advisorHookDiagnosticsPath(root)` holding one valid `claude` record and one otherwise valid `copilot` record makes `readAdvisorHookDiagnosticRecords(root)` return only the `claude` record without throwing. The same holds for an outcomes file at `advisorHookOutcomesPath(root)` and `readAdvisorHookOutcomeRecords(root)`. `serializeAdvisorHookDiagnosticRecord` throws for a `copilot` record. `validateSkillExecutionOutcomeRecord` returns false for one. `AdvisorValidateInputSchema.safeParse` fails for an `outcomeEvents` entry with `runtime: 'copilot'` and names that path in its issues (`.skilled/skills/system-skill-advisor/runtime/tests/legacy/runtime-label-removal.vitest.ts`). Verify: after T006, in `$ADV`, `npx vitest run tests/legacy/runtime-label-removal.vitest.ts` reports 5 passed and 0 failed.
- [x] T023 [P] Create `$ADV/tests/render-child-session.vitest.ts`. Cases, each rendering one result through `renderAdvisorBrief`: child set and policy `start`, `ask`, `run` with `read-only` and `run` with `add-only`, then the variable set to `0` and unset. Expected: `(parent-named only)` for `start`, `ask` and `run` with `add-only`, the policy word for `run` with `read-only`, and output byte-equal to the non-child render for `0` and unset. One more case renders `/doctor:git hooks` as top with the child set (`.skilled/skills/system-skill-advisor/runtime/tests/render-child-session.vitest.ts`). Verify: in `$ADV`, `npx vitest run tests/render-child-session.vitest.ts` reports 7 passed and 0 failed.
- [x] T024 Regenerate the manifest's derived copy (`MAN`). Verify: `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --write` exits 0, then `--check` prints `PASS: 44 sections, 31 pins, derived matches AGENTS.md`.
- [x] T025 [P] Regenerate the Cursor rule (`.cursor/rules/skill-routing.md`). Verify: `node $SYNC` exits 0, then `node $SYNC --check` exits 0, `rg -c "Command in the brief" .cursor/rules/skill-routing.md` prints 1 and `rg -c "skill-advisor.cjs advisor_recommend" .cursor/rules/skill-routing.md` prints 1.
- [x] T026 [P] In `HOOKDOC` section 2, step 5 Render, add one sentence: with `AI_SESSION_CHILD=1` a surfaced `start` or `ask` command, or a `run` command that is not read-only, renders as `(parent-named only)` (`.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`). Verify: `rg -c "parent-named only" $HOOKDOC` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T027 Run the agents-md check (`$S/after-check.txt`). Verify: `$CHK` prints `STATUS=OK`, A4 `44 current`, A5 `31/31 pins hold`, A10 `6/6` and A6 at or under `16384`, expected `16092` with the T003 text unchanged.
- [x] T028 Run the rule-copy canary. Verify: `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js | head -1` prints a line starting `OK: all rule invariants present`.
- [x] T029 Run the pointer test and check. Verify: `$G1T` reports 7 passed, and `node $SYNC --check` exits 0.
- [x] T030 Run the spec gate test. Verify: `(cd $SSK && node --test tests/hooks/spec-gate-core.test.mjs)` prints `fail 0`.
- [x] T031 Run the advisor checks. Verify: in `$ADV`, `npm run typecheck` exits 0, `npx vitest run tests/hooks/advisor-runtime-list-parity.vitest.ts tests/render-child-session.vitest.ts tests/legacy/runtime-label-removal.vitest.ts tests/legacy/advisor-observability.vitest.ts` reports 0 failed, `rg -n "copilot" $ADV --glob "*.ts" --glob "!dist/**" --glob "!node_modules/**"` prints only the new test and the adapter-path guards in `tests/hooks/settings-driven-invocation-parity.vitest.ts` and `stress-test/skill-advisor/hooks-parity-stress.vitest.ts` and `npm test` reports 0 failed.
- [x] T032 Run the three hub checks. Verify: `for h in sk-doc sk-design system-deep-loop; do node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/$h > /dev/null 2>&1; echo "$h exit=$?"; done` prints `exit=0` three times.
- [x] T033 Rebuild the advisor and probe the hook. Verify: in `$ADV`, `npm run build` exits 0. Then `AI_SESSION_CHILD=1 bash $S/hook-first-line.sh "disable comment hygiene gate"` prints a line holding `/doctor:git hooks (parent-named only)`, and the same command without the variable prints the phase 005 line with its policy word.
- [x] T034 Check scope and comment hygiene. Verify: `git -c core.fsmonitor=false diff --stat` names only files in `spec.md` section 3, and `git -c core.fsmonitor=false diff -U0 -- '*.ts' '*.cjs' '*.mjs' '*.sh' | rg "^\+.*(REQ-0|T0[0-9]{2}|specs/|ADR-)"` prints nothing.
- [x] T035 Write `implementation-summary.md` and mark each row in `acceptance-criteria.md` with its evidence. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `$CHK` prints `STATUS=OK` and `node $SYNC --check` exits 0 with the bullet in place. Evidence: `scratch/after-check.txt` and T025
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Review**: `../../007-command-surfacing-and-workflow-enforcement/research/synthesis-review.md` R5, R6, R10b, L4, L5, L10, G1 and G3
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

A blocked task gets `[B]` and one line naming what blocks it. An A6 reading above 16384 blocks the phase.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The four wording questions have an operator answer, quoted in `spec.md` section 10. Evidence: answered on 2026-11-12 through the question dialog. T003, T006, T012, T013, T015 and T026 follow those answers.
- [x] CHK-002 [P0] The before numbers are in `$S/before.txt` (T001). Evidence: the file records 15629 of 16384, 30 pins and `commands 44 {"start":20,"ask":17,"run":7}` at commit `49281dd652`.
- [x] CHK-003 [P1] Phase 005's brief line is confirmed, or the REQ-004 tasks are marked `[B]` (T002). Evidence: `$S/phase005-check.txt` prints `use sk-doc → /create:readme (start)`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] In `$ADV`, `npm run typecheck` exits 0, and `node --check` exits 0 on `SYNC` and `spec-gate-core.mjs`. Evidence: T031 typecheck exit 0. Both `node --check` runs exited 0 when rerun during closure.
- [x] CHK-011 [P0] No code comment names a spec path, a phase number, a requirement or a task id (T034). Evidence: the added-line scan printed nothing.
- [x] CHK-012 [P1] `.cursor/rules/skill-routing.md` is written by `SYNC` only, never by hand (T025). Evidence: the sync run and `--check` both exit 0, so the file matches the generator output.
- [x] CHK-013 [P1] The child branch reads the class, never the policy word alone (T015, T023). Evidence: `parentNamedOnly(policy, mutating)` in `render.ts` returns true for `run` only when `mutating` is not `read-only`, and the child test covers `run` with `read-only` and with `add-only`, 7 passed.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] `$CHK` prints `STATUS=OK` with A6 at or under 16384 (T027). Evidence: `STATUS=OK rows=12 findings=0 unknown=0`, A6 `16092 of 16384`.
- [x] CHK-021 [P0] The pointer test passes 7 cases and `--check` exits 0 (T029). Evidence: 7 passed, sync `--check` exit 0.
- [x] CHK-022 [P0] The child render test covers every renderer axis in `plan.md` (T023). Evidence: cases for `1` with `start`, `ask`, `run` read-only and `run` add-only, then `0` and unset, plus `/doctor:git hooks`. 7 passed, 0 failed.
- [x] CHK-023 [P1] The spec gate test, the parity test and `npm test` in `$ADV` report 0 failed (T030, T031). Evidence: `pass 107`, `fail 0`. Parity 2 passed on a closure rerun. `npm test` 1528 passed, 6 skipped, 0 failed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The gap is class `cross-consumer`: one rule, read by seven runtimes through four surfaces. Evidence: the rule lands in `AGENTS.md`, the generated Cursor rule, the hub routers and the brief renderer, and the hook reference table names seven runtimes.
- [x] CHK-FIX-002 [P0] Every reader of the pointer generator is checked: `rg -l "sync-gate1-pointers" .skilled --glob '!**/node_modules/**' --glob '!**/dist/**'` lists only files this phase changed or confirmed unchanged in `plan.md`. Evidence: the closure rerun listed 11 files. Six are not named in `plan.md` (`CROSS-CLI.md`, the retrieval README, the doctor presentation text, two doctor YAML files and the compose fixture). Each was read during closure and none quotes the generator output or depends on the second block. `CROSS-CLI.md` line 73 describes only block one, recorded as a known limitation.
- [x] CHK-FIX-003 [P0] Every reader of `GATE_3_MUTATION_NOTICE` is checked: `rg -n "GATE_3_MUTATION_NOTICE" .skilled --glob '!**/dist/**'` lists the core, its test and the injection contract, which names it without quoting it. Evidence: the closure rerun also lists the spec-gate README and a manual playbook page. Neither quotes the notice, because a search for its text matches only the core and its test.
- [x] CHK-FIX-004 [P1] The matrix axes in `plan.md` are listed in the two test file headers. Evidence: the `gate1-pointer-sync.vitest.ts` header names the generator axes and the `render-child-session.vitest.ts` header now lists the child variable, policy and class axes. The file still reports 7 passed.
- [x] CHK-FIX-005 [P1] The child test sets and restores `AI_SESSION_CHILD`, so no other test sees it. Evidence: each case uses `vi.stubEnv` and `afterEach` calls `vi.unstubAllEnvs()`.
- [x] CHK-FIX-006 [P1] Evidence names the commit it ran on. Evidence: `implementation-summary.md` names the working tree over `HEAD` `a57ce61a13`, committed 01:58, with the scratch outputs dated 02:17 to 02:24.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] A child never sees a bare `start` or `ask` command line (T023). Evidence: 7 passed, and the T033 probe printed `(parent-named only)` with the child variable.
- [x] CHK-031 [P0] No changed file names `/local-skilled-alignment`: `rg -n "local-skilled-alignment" <changed files>` prints nothing. Evidence: rerun during closure over every changed and created file outside `specs/`, no output, exit 1.
- [x] CHK-032 [P1] The pointer block copies tracked `AGENTS.md` text only (T004). Evidence: `--check` compares the block with the root `AGENTS.md` lines and exits 0.
- [x] CHK-033 [P0] A stored record carrying `copilot` is skipped by both readers without an error, and tool input carrying it is rejected (T022). Evidence: `runtime-label-removal.vitest.ts` 5 passed on a closure rerun.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` state the same bullet text, byte count and pin count. Evidence: each names 31 pins where it states a count, the byte count is 463 and 16092 wherever stated and the text lives in T003 and `scratch/bullet-draft.txt`.
- [x] CHK-041 [P1] `HOOKDOC` names seven adapters and holds the invocation table (T005, T018). Evidence: `rg -c '^\| \*\*'` printed 7, including DSH, and the table heading is at line 90.
- [x] CHK-042 [P2] The runtime-mirrors README names both pointer blocks (T021). Evidence: line 26 says the script writes the Gate 1 lookup and the Gate 2 command rule.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Probes, before and after output live in `scratch/` only. Evidence: `before.txt`, `after-check.txt`, `suite-after.txt`, `phase005-check.txt` and the probe scripts are in `scratch/`.
- [x] CHK-051 [P1] `scratch/` holds only the evidence files the summary cites at completion. Evidence: the summary cites the probes, `briefs/`, `logs/`, the before and after files and `verification-evidence.txt`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-13

Every checklist item is verified and AC-001 to AC-009 are `Met`, so the phase is closed.
<!-- /ANCHOR:summary -->

---
