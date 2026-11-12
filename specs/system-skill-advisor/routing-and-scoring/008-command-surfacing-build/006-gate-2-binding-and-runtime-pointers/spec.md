---
title: "Feature Specification: Phase 6: gate-2-binding-and-runtime-pointers"
description: "No rule tells a model what to do with a command the advisor names, so a surfaced command is a hint nobody is bound to follow. This phase adds one Gate 2 bullet, a generated pointer for runtimes with no brief, a hub-router handoff, a Gate 3 front door and a child-session downgrade."
trigger_phrases:
  - "gate 2 binding and runtime pointers"
  - "phase 6 gate 2 binding and runtime pointers"
  - "command in the brief gate 2 bullet"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: gate-2-binding-and-runtime-pointers

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-recommendation-contract-and-brief |
| **Successor** | 007-per-runtime-behaviour-proof |
| **Handoff Criteria** | `/doctor:agents-md check` prints `STATUS=OK` with the Gate 2 bullet in place, and `sync-gate1-pointers.cjs --check` exits 0 with the command pointer block written |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the build that makes the skill advisor surface every tracked slash command with a run-or-ask policy and brings a chat-only request onto a proper workflow (`../spec.md`). It delivers the binding: the review ids R6, L5, R5, L4, G1, G3, L10 and R10b in `../../007-command-surfacing-and-workflow-enforcement/research/synthesis-review.md`.

**Scope Boundary**: Instruction text and the generators and tests that keep it honest. One Gate 2 bullet in `AGENTS.md`, one generated pointer block in the Cursor rule, one bullet in each of the three hub routers, one line in the Gate 3 notice and in the `create.sh` next steps, the runtime table in the hook reference and a child-session downgrade in the brief renderer. Scoring, the recommendation schema and the brief head stay as phase 005 leaves them.

**Dependencies**:
- Phase 005 is planned in parallel and not built. This phase assumes it lands as review R3 describes: the brief head shows the command and its policy word, as `use <skill> → <command> (<policy>)`, from a generated map for every command in `render.ts`. The child downgrade (REQ-004) edits that line, so it cannot start before phase 005 ships. The Gate 2 bullet also binds to the CLI result's `command` field, which exists today.
- Phase 002 shipped the policy per command and per route (`commandPolicies` in `command-bridges.generated.json`). Phase 003 shipped the attach rule that puts a hub command on its owner skill (`attachCommand` in `ADV/lib/command-attach.ts`).
- Operator decisions D1, D2, D3 and D5 in `../../007-command-surfacing-and-workflow-enforcement/research/research.md` section 13, recorded as Q006 to Q012 in `../decision-record.md`.

**Deliverables**:
- The Gate 2 bullet with the typed-command override and the `COMMAND:` output token, inside the 16,384-byte delivery prefix.
- A second generated block in `.cursor/rules/skill-routing.md`, which Cursor and Devin read, carrying the Gate 2 direct call and the bullet.
- The hub-router handoff, the Gate 3 front door, the runtime table with the DSH row and the child-session downgrade.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor now attaches a command to a recommendation, but nothing in `AGENTS.md` says what a model does with it, so a surfaced command is a hint with no rule behind it. Cursor gets no per-prompt brief at all, a dispatched child gets the same brief as its parent with no limit on what it may start, a hub skill that picks a mode never hands it to that mode's command and a plain build request reaches no workflow. The runtime table in the hook reference lists 6 of the 7 adapters and leaves DSH out.

### Purpose
Every runtime gets one instruction for a surfaced command, read its document in full and follow it under its policy, from `AGENTS.md` Gate 2 or from a generated copy where no brief arrives. The change stays inside the delivery budget and every generated copy is checked against its source.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Every command ran from the repository root on 2026-11-12. `P6` is this phase folder. The scripts in `P6/scratch/` are short read-only probes kept as evidence. `$S/agents006` is a copy of `AGENTS.md` with the drafted bullet inserted, made in the planner's scratchpad outside the repository.

```text
$ node .skilled/commands/doctor/scripts/agents-md-check.cjs | grep -E "^A(4|6|10) |^STATUS"
A4 section currency: 44 current, 0 stale-known, 0 edited, 0 unknown-base   (PASS)
A6 delivery budget: 15629 of 16384 bytes to the last anchor, 27112 of 32768 bytes total   (PASS)
A10 runtime copies: 6/6 copies as expected   (PASS)
STATUS=OK rows=12 findings=0 unknown=0

$ node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check
[agents-md-manifest] PASS: 44 sections, 30 pins, derived matches AGENTS.md
[agents-md-manifest] Budget: 15629 / 16384 bytes to the last anchor, 27112 / 32768 bytes total, 20 history bodies

$ node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs --check
[gate1-pointer-sync] PASS: 1 instruction files carry the root Gate 1 lookup.

$ wc -c P6/scratch/bullet-draft.txt
     463 P6/scratch/bullet-draft.txt

$ node .skilled/commands/doctor/scripts/agents-md-check.cjs --root $S/agents006 | grep -E "^A(4|6) "
A4 section currency: 43 current, 0 stale-known, 1 edited, 0 unknown-base   (FINDING)
A6 delivery budget: 16092 of 16384 bytes to the last anchor, 27575 of 32768 bytes total   (PASS)

$ rg -n "Command in the brief|COMMAND:" AGENTS.md
(no output, exit 1)

$ node P6/scratch/measure-policies.mjs
commands 44 {"start":20,"ask":17,"run":7}
run records 20 non-read-only run: ["/doctor:deep-loop deep-loop add-only","/doctor:speckit speckit-retrieval add-only"]
{"command":"/doctor:git","route":"hooks","mutating":"mutates","askFirst":[],"policy":"ask"}
{"command":"/doctor:git","route":"setup","mutating":"read-only","askFirst":[],"policy":"run"}
{"command":"/doctor:git","route":"standards","mutating":"mutates","askFirst":[],"policy":"ask"}
entries with mutating 23 of 62
policy records with mutating 68 of 68

$ bash P6/scratch/advisor-top.sh "create a readme for the utils folder"
[["sk-doc",0.95,"/create:readme"],["system-spec-kit",0.82,null],["mcp-tooling",0.82,null]]

$ bash P6/scratch/hook-first-line.sh "create a readme for the utils folder"
Advisor: live; use sk-doc 0.95/0.12 pass.

$ AI_SESSION_CHILD=1 bash P6/scratch/hook-first-line.sh "disable comment hygiene gate"
Advisor: live; ambiguous: /doctor:git hooks 0.91/0.12 vs sk-code 0.88/0.12 pass.

$ rg -n "AI_SESSION_CHILD" .skilled/skills/system-skill-advisor --glob '!**/dist/**' --glob '!**/node_modules/**'
(no output, exit 1)

$ bash P6/scratch/advisor-top.sh "build a login page with email and password"
[["sk-doc",0.82,null],["sk-code",0.82,null],["mcp-tooling",0.82,null]]

$ rg -c "speckit:plan|speckit:complete" .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs
(no output, exit 1)

$ ls -1 .skilled/hooks/skill-advisor/ | grep -v README
claude
codex
cursor
devin
dsh
opencode
pi

$ rg -n '^\| \*\*[A-Za-z]+\*\* \|' .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md | cut -c1-40
53:| **Claude** | `system-spec-kit/.../h
54:| **Codex** | `system-spec-kit/.../ho
55:| **Cursor** | `system-spec-kit/.../h
56:| **Devin** | `system-spec-kit/.../ho
57:| **Pi** | `system-skill-advisor/hook
58:| **OpenCode** | `.opencode/plugins/s

$ rg -n -i "dsh" .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md
(no output, exit 1)

$ sed -n 10,19p .skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts
export const ADVISOR_RUNTIME_VALUES = [
  'claude',
  'copilot',
  'opencode',
  'pi',
  'codex',
  'cursor',
  'devin',
  'dsh',
] as const;

$ node P6/scratch/hub-commands.mjs
sk-doc modes 15 with command 13 null sk-create-frontmatter,sk-create-quality-control
sk-design modes 3 with command 3 null
system-deep-loop modes 3 with command 3 null

$ rg -n "registry row|\.command|names a command|command document" .skilled/skills/sk-doc/ROUTER.md .skilled/skills/sk-design/ROUTER.md .skilled/skills/system-deep-loop/ROUTER.md
(no output, exit 1)

$ for h in sk-doc sk-design system-deep-loop; do node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/$h > /dev/null 2>&1; echo "$h exit=$?"; done
sk-doc exit=0
sk-design exit=0
system-deep-loop exit=0

$ node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js | head -1
OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).

$ cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run tests/gate1-pointer-sync.vitest.ts --config ../vitest.config.ts --root .
 Test Files  1 passed (1)
      Tests  4 passed (4)

$ cd .skilled/skills/system-spec-kit/runtime && node --test tests/hooks/spec-gate-core.test.mjs
ℹ tests 110
ℹ pass 107
ℹ fail 0
ℹ skipped 3

$ rg -n "ADVISOR_RUNTIME_VALUES|\.filter\(validate|tryParseJsonLine\(line\)|JSON.parse\(line\)" lib/metrics.ts schemas/advisor-tool-schemas.ts skill-advisor-cli-manifest.ts   # run in ADV
skill-advisor-cli-manifest.ts:9:import { ADVISOR_RUNTIME_VALUES } from './lib/advisor-runtime-values.js';
skill-advisor-cli-manifest.ts:111:              runtime: { type: 'string', enum: [...ADVISOR_RUNTIME_VALUES] },
schemas/advisor-tool-schemas.ts:13:import { ADVISOR_RUNTIME_VALUES } from '../lib/advisor-runtime-values.js';
schemas/advisor-tool-schemas.ts:470:    runtime: z.enum(ADVISOR_RUNTIME_VALUES),
lib/metrics.ts:11:import { ADVISOR_RUNTIME_VALUES } from './advisor-runtime-values.js';
lib/metrics.ts:23:export { ADVISOR_RUNTIME_VALUES } from './advisor-runtime-values.js';
lib/metrics.ts:351:    return JSON.parse(line) as unknown;
lib/metrics.ts:419:    && enumIncludes(ADVISOR_RUNTIME_VALUES, record.runtime)
lib/metrics.ts:460:    .map((line) => JSON.parse(line) as unknown)
lib/metrics.ts:461:    .filter(validateAdvisorHookDiagnosticRecord);
lib/metrics.ts:518:    && enumIncludes(ADVISOR_RUNTIME_VALUES, record.runtime)
lib/metrics.ts:539:    .map((line) => tryParseJsonLine(line))
lib/metrics.ts:540:    .filter(validateAdvisorHookOutcomeRecord);
lib/metrics.ts:593:    && enumIncludes(ADVISOR_RUNTIME_VALUES, record.runtime)

$ rg -l "copilot" .skilled/skills/system-skill-advisor/runtime --glob '*.ts' --glob '!**/dist/**' --glob '!**/node_modules/**'
.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/hooks-parity-stress.vitest.ts
.skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts
.skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts
.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-observability.vitest.ts
.skilled/skills/system-skill-advisor/runtime/tests/hooks/settings-driven-invocation-parity.vitest.ts

$ rg -c '"runtime":"copilot"' "$(node -e 'console.log(require("os").tmpdir())')/speckit-skill-advisor-metrics"
(no output, exit 1)
```

The headroom before the change is 755 bytes, 16384 minus 15629. The drafted bullet is 463 bytes, so the last anchor moves to 16092 and 292 bytes stay free. A4 reads `edited` until the manifest's `derived` key is rewritten, which is why the manifest regeneration is a task and not an afterthought.

Six facts from the code shape the plan. Each was read on 2026-11-12.
- Gate 2 has no command rule. The review asked for the Gate 4 tie-break to be rewritten in the same edit, but that is done: `AGENTS.md` line 89 names the command rows for `/deep:research` and `/deep:review`.
- The Cursor rule's pointer block is written by `sync-gate1-pointers.cjs` from one `AGENTS.md` line (`readGateOneLine`, `renderBlock`, one entry in `TARGETS`). `/doctor:agents-md check` row A10 runs that script's `--check`. Devin reads the same Cursor rule (`.devin/SYNC.md` section 5), so one target covers both runtimes.
- The manifest pin `gate1-lookup` ties the generator's marker to Gate 1. A second marker needs a second pin, or a template edit could drop the block with every check green.
- The Gate 3 notice is `GATE_3_MUTATION_NOTICE` in `spec-gate-core.mjs`, and `spec-gate-core.test.mjs` pins it byte for byte, so the notice edit and the test edit ship together. `create.sh` prints two next-steps blocks. The phased one already names `/speckit:plan`, the standard one names no command.
- Every one of the 68 policy records carries its `mutating` class (`commandPolicies[].mutating` in `command-bridges.generated.json`), while only 23 of the 62 bridge entries do. The policy word alone cannot tell a read-only `run` from the two add-only `run` routes above, so the child downgrade reads the class from the policy records.
- `copilot` is in `ADVISOR_RUNTIME_VALUES` and has no registration (`hook-adapter-path-parity.vitest.ts` header). The operator chose to remove it. After removal a label of `copilot` is handled in four places. Tool input is rejected: `AdvisorValidateInputSchema` in `ADV/schemas/advisor-tool-schemas.ts` checks `outcomeEvents[].runtime` with `z.enum(ADVISOR_RUNTIME_VALUES)`, and the CLI manifest in `ADV/skill-advisor-cli-manifest.ts` lists the same enum. A stored record is skipped, never thrown on: `readAdvisorHookDiagnosticRecords` and `readAdvisorHookOutcomeRecords` in `ADV/lib/metrics.ts` filter each line through `validateAdvisorHookDiagnosticRecord` and `validateAdvisorHookOutcomeRecord`, which return false on an unknown runtime through `enumIncludes`. A new diagnostic record carrying it is refused: `serializeAdvisorHookDiagnosticRecord` throws on a record that fails validation. `validateSkillExecutionOutcomeRecord` also returns false, and nothing in the advisor reads those records today. The stored files live under the system temp folder in `speckit-skill-advisor-metrics`, and none on this machine holds a `copilot` record.
- The diagnostics reader parses each line with a bare `JSON.parse` (`metrics.ts:460`), so a corrupt line throws there, while the outcomes reader uses `tryParseJsonLine` and skips it. That gap is unrelated to the label and stays out of scope.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add one Gate 2 bullet in `AGENTS.md` that binds a command named in a brief or CLI result to its own document, defines `run`, `start` and `ask`, lets a typed command or explicit instruction outrank the policy and adds the `COMMAND:` output token (R6, L5, R5). Regenerate the manifest's `derived` key and add a pin for the bullet's marker.
- Extend `sync-gate1-pointers.cjs` to write a second block into the Cursor rule with the Gate 2 direct call and the bullet, so Cursor and Devin carry the rule without a brief (L4).
- Add one handoff bullet to section 4 of each hub `ROUTER.md`: a mode whose registry row names a command can be run through that command or through its packet, each whole (G1, under D2).
- Name `/speckit:plan` and `/speckit:complete` in the Gate 3 mutation notice and the standard `create.sh` next steps (G3).
- Add the DSH row and a per-runtime invocation table to `skill-advisor-hook.md`. Add a test that compares the hook index, the documented table and the runtime enum. Remove `copilot` from the runtime enum and from the two files that pin it, and add a test that a stored record or tool input still carrying it is skipped or rejected (R5, L10).
- Render a surfaced `start` or `ask` command, or a `run` command that is not read-only, as `(parent-named only)` in a session with `AI_SESSION_CHILD=1` (R10b).

### Out of Scope
- The Gate 4 tie-break rewrite. It shipped in phase 003 and the alignment pass.
- Any scorer, schema or brief-head change. Phase 005 owns the brief line this phase edits for children.
- Behaviour runs per runtime, the `COMMAND:` once-per-session rule (R10c) and the Claude Code `create:*` listing (G5). Phase 007 owns them.
- The private `/local-skilled-alignment` command (D5). The invocation table covers the 44 tracked commands.
- The parent-skill router template in `sk-create-skill`. Three hubs carry commands today and no new hub is planned, so a template line has no reader yet.
- The diagnostics reader's bare `JSON.parse` on a corrupt line. It is a separate fault and no label depends on it.

### Files to Change

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. `SSK` is `.skilled/skills/system-spec-kit/runtime`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | The Gate 2 command bullet |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Modify | Pin `gate2-command`, then the regenerated `derived` key |
| `SSK/cli/runtime-mirrors/sync-gate1-pointers.cjs` | Modify | Second block from the Gate 2 direct call and the bullet |
| `SSK/cli/tests/gate1-pointer-sync.vitest.ts` | Modify | Cases for the second block |
| `.cursor/rules/skill-routing.md` | Modify (generated) | Written by the generator, never by hand |
| `SSK/cli/runtime-mirrors/README.md` | Modify | The generator's row names both blocks |
| `.skilled/skills/sk-doc/ROUTER.md`, `.skilled/skills/sk-design/ROUTER.md`, `.skilled/skills/system-deep-loop/ROUTER.md` | Modify | One handoff bullet in section 4 each |
| `SSK/hooks/lib/spec-gate/spec-gate-core.mjs` | Modify | One line in `GATE_3_MUTATION_NOTICE` |
| `SSK/tests/hooks/spec-gate-core.test.mjs` | Modify | The pinned notice bytes |
| `SSK/cli/spec/create.sh` | Modify | One next-steps line in the standard block |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | Modify | DSH row, tree entry, invocation table and the child note |
| `ADV/lib/advisor-runtime-values.ts` | Modify | Remove `copilot` from `ADVISOR_RUNTIME_VALUES` |
| `ADV/tests/legacy/advisor-observability.vitest.ts` | Modify | Expect the seven remaining labels |
| `ADV/bench/hook-brief-signal-noise.bench.ts` | Modify | Drop the `copilot` fixture row and its mention in the header comment |
| `ADV/tests/legacy/runtime-label-removal.vitest.ts` | Create | A stored `copilot` record is skipped and tool input carrying it is rejected |
| `ADV/tests/hooks/advisor-runtime-list-parity.vitest.ts` | Create | Hook index, documented table and enum agree |
| `ADV/lib/render.ts` | Modify | Child-session downgrade on the command line |
| `ADV/tests/render-child-session.vitest.ts` | Create | Downgrade cases with and without the variable |
| `ADV/scripts/command-bridges/derive-command-bridges.cjs` and its generated outputs | Modify, only if needed | Emit the `mutating` class from `commandPolicies` into the render map when phase 005's map lacks it |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Gate 2 in `AGENTS.md` holds exactly one line starting `- **Command in the brief.**` with the text in `tasks.md` T003. It names reading the command document in full, the three policy words, the typed-command override and the `COMMAND:` token. |
| REQ-002 | `node .skilled/commands/doctor/scripts/agents-md-check.cjs` prints `STATUS=OK`, A4 `44 current` and A6 at or under 16384 bytes to the last anchor. `agents-md-manifest.cjs --check` prints `PASS` with 31 pins. `check-rule-copies.js` prints `OK`. |
| REQ-003 | `sync-gate1-pointers.cjs --check` exits 0, and `.cursor/rules/skill-routing.md` holds a second generated block with the Gate 2 direct-call line and the bullet, byte-equal to their `AGENTS.md` lines. A hand edit inside that block makes `--check` exit 1. An `AGENTS.md` with no bullet gets block one only and exit 0. |
| REQ-004 | With `AI_SESSION_CHILD=1`, `renderAdvisorBrief` shows a surfaced `start` or `ask` command, and a `run` command whose class is not `read-only`, as `(parent-named only)`. Without the variable the brief is byte-equal to phase 005's output. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Section 4 of each of the three hub `ROUTER.md` files holds one bullet that names the command path and the packet path as two whole entries and says a `command: null` mode has only its packet. `parent-skill-check.cjs` exits 0 for each hub. |
| REQ-006 | `GATE_3_MUTATION_NOTICE` holds one line naming `/speckit:plan` and `/speckit:complete` for a new folder. `spec-gate-core.test.mjs` pins the new bytes and reports 0 failed. The standard `create.sh` next steps name both commands. |
| REQ-007 | `skill-advisor-hook.md` section 3 has a DSH row and a per-runtime invocation table with 7 rows that tells the model to read the command document and never to type a slash command. `advisor-runtime-list-parity.vitest.ts` passes, and it fails when a runtime is in the hook index and missing from the table or the enum. |
| REQ-008 | `ADVISOR_RUNTIME_VALUES` holds the seven labels `claude`, `opencode`, `pi`, `codex`, `cursor`, `devin` and `dsh`, with no retired list. `runtime-label-removal.vitest.ts` shows that both metrics readers skip a stored `copilot` record without throwing, that `serializeAdvisorHookDiagnosticRecord` throws for one and that `AdvisorValidateInputSchema` rejects tool input carrying it. `advisor-observability.vitest.ts` expects the seven labels and passes. |
| REQ-009 | No regression: `npm test` in `ADV` reports 0 failed, `npx tsc --noEmit` in `ADV` exits 0, the gate1 pointer test passes and `git diff --stat` names only the files in section 3. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/doctor:agents-md check` prints `STATUS=OK` with the bullet in place and A6 at or under 16384.
- **SC-002**: `sync-gate1-pointers.cjs --check` exits 0 and the Cursor rule carries the bullet byte for byte.
- **SC-003**: A child-session brief for `disable comment hygiene gate` shows `/doctor:git hooks (parent-named only)`, and the same prompt without the variable shows the phase 005 line.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 005, not built | The child downgrade has no command line to edit | T002 checks the brief head first and marks REQ-004 tasks `[B]` when it is absent. The `AGENTS.md`, pointer, router and Gate 3 tasks do not depend on it |
| Dependency | `~/.claude/CLAUDE.md` is a symlink to the main checkout's `AGENTS.md` | The bullet reaches running Claude sessions only after this branch merges | None needed. Phase 007 runs its behaviour proof from this worktree |
| Risk | Every session on every runtime loads Gate 2 | High: a wording fault steers every turn | The operator approved the exact text on 2026-11-12. The pin and the pointer check catch a later drift |
| Risk | 292 bytes stay free in the delivery prefix | Med: the next Gate 2 addition may not fit | A6 is the gate. The number is recorded here so the next author sees it |
| Risk | Removing `copilot` makes a stored record or caller input with that label invalid | Low: none of the stored files on this machine holds one, and no adapter emits it | The readers skip such a record, and the new test pins that. A caller sending it gets a validation error naming the field |
| Risk | The notice line reaches every session that writes with no bound folder | Low: one more line per session, once | The line is scoped to a new folder and names no other choice |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The child check is one environment read per render. Hook timing is not re-measured in this phase, because no scoring path changes.
- **NFR-P02**: The delivery prefix grows by at most 463 bytes, to 16092 of 16384.

### Security
- **NFR-S01**: A child never gets a bare `start` or `ask` command line, which matches the existing bar on acting outside its lineage directory (`AGENTS.md` Gate 3).
- **NFR-S02**: The generated pointer copies text from the tracked `AGENTS.md` only.

### Reliability
- **NFR-R01**: A missing source line leaves the matching block unwritten and exits 0, so a consumer on an older template keeps a working Cursor rule.
- **NFR-R02**: Any value of `AI_SESSION_CHILD` other than `1` renders the normal brief, the same reading as `isChildSession` in `spec-gate-core.mjs`.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an `AGENTS.md` with no bullet writes block one only, removes a stale block two and exits 0.
- Maximum input: the bullet leaves 292 bytes. A Gate 2 text that pushes the last anchor past 16384 fails A6 and blocks the phase.
- Failure path: an `AGENTS.md` with no Gate 1 line still exits 2 with the existing message, and a missing Cursor rule is still reported as `missing`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 18 files and 350 lines, most of them short text edits and two new tests |
| Risk | 15/25 | `AGENTS.md` is loaded by every runtime on every turn |
| Research | 6/20 | Every location is known. The open part is the operator's wording choices |
| **Total** | **33/70** | **Level 2** |

`recommend-level.sh --loc 350 --files 17` printed Level 1. The phase still uses Level 2, because the packet brief asks for `acceptance-criteria.md`, which only Level 2 carries, and `speckit-plan.yaml` says to go higher when the helper and judgment differ.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

### Open

None.

### Resolved

The operator answered the four wording questions on 2026-11-12 through the question dialog.

- Which Gate 2 bullet text lands in `AGENTS.md`? Answer: "Command beside the skill (Recommended)". The operator saw the full 463-byte text in `tasks.md` T003 and approved it.
- How does a dispatched child see a surfaced command? Answer: "Shown as parent-named only (Recommended)". `start`, `ask` and a `run` command that is not read-only render as `(parent-named only)`.
- Which workflow does the Gate 3 notice name for a new folder? Answer: "/speckit:plan, or /speckit:complete for a build (Recommended)".
- What happens to `copilot` in the runtime enum? Answer: "Drop it", with the option text "The label is removed. Old stored records and any tool input carrying 'copilot' fail validation from then on." This differs from the planned option. Section 3 and `tasks.md` T006 to T008 and T022 now plan the removal, and the measured facts above name where such a record or input is skipped or rejected.
- The Gate 4 tie-break needs no edit. It already names the deep-loop command rows (D4, shipped).
- The pointer block lives in the Cursor rule only. Devin reads that rule, and Claude, Codex and Pi load `AGENTS.md` itself (`.devin/SYNC.md` section 5, `sync-gate1-pointers.cjs` header).
<!-- /ANCHOR:questions -->

---
