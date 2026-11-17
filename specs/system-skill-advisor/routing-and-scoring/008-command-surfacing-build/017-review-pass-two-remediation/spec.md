---
title: "Feature Specification: Phase 17: review-pass-two-remediation"
description: "Review pass two confirmed 27 P2 findings and no P0 or P1. Four no-edit wordings still attach a writing command, a backfill runs code from any folder a run log names, a file name with a space survives the restore and the doctor checks misread common hook launches. This phase fixes all 27 in ten file-disjoint work groups, with a failing-then-passing test wherever one can fail, and moves no floor."
trigger_phrases:
  - "review pass two remediation"
  - "phase 17 review pass two remediation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 17: review-pass-two-remediation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 18 |
| **Predecessor** | 016-claude-create-reach-and-doctor-default |
| **Successor** | 018-holdout-row-retirement |
| **Handoff Criteria** | Every task in `tasks.md` is `[x]`, the planning probes print the fixed outputs in section 5, every floor equals its line in `scratch/before.txt` and strict validation prints `RESULT: PASSED`, so the narrow third review pass can start on this phase's diff |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). It fixes what review pass two confirmed in `../review/review-report.md`, whose verdict is PASS with advisories: P0 0, P1 0, P2 27 and one refuted finding. Every finding was reproduced read-only before this plan was written (section 2), so none is planned on the report's word alone.

**Scope Boundary**: The 27 findings in work groups WG1 to WG10 of the report's Planning Packet. WG1 to WG9 are worker lanes, each owning its files alone. WG10 is the coordinator's edit to three rows of the parent phase map. The refuted finding and the report's section 8 deferred items stay out.

**Dependencies**:
- Phase 016 is built and committed before this phase starts. It renames `/create:skill` to `/create:sk-skill` with no alias, adds a doctor cue in `runtime/lib/scorer/doctor-helper-handoff.ts`, edits `AGENTS.md` line 65 and adds intent phrases to `command-metadata.json` files and `_routes.yaml`. It also edits `command-attach.ts`, `command-attach-guards.vitest.ts`, `fusion.ts`, `measure-brief-cost.mjs`, its test and the routing-accuracy README, which lanes here edit after it. So every task re-reads its files before its first edit, and a task whose quoted anchor is gone marks itself `[B]` with the line it found. No test input or expected output in this phase names `/create:skill`.
- T001 confirms phase 016 is committed and records the before numbers after it, because phase 016 may raise a floor.
- The third review pass reads this phase's diff only and starts after T041.

**Deliverables**:
- One no-edit test shared by the attach path, the scorer's two command gates and the read-only explainer, which catches the common straight and curly wordings and moves no floor.
- A behaviour runner whose backfill runs no code outside the project root or a marked arena, a restore that reads NUL-separated status, a started-command row picked by id that runs under arm g2 and a backfill that replays the fixture its run used.
- Measurement scripts that leave the caller's environment as they found it, a subprocess that sees a busy marker past its output cap, an OpenCode plugin with no dead computation, doctor checks that accept the common hook launches and count only verified copies, and docs, playbook notes, catalog citations and doctor contracts that match the code.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four no-edit wordings, "don't change anything yet", "no changes yet", "don't touch any files" written with a curly apostrophe and "make no changes", still attach `/create:agent` on the hub path and still pass the scorer's command gate, because the shared pattern knows only "do not". A backfill runs whatever advisor CLI and prompt hook sit in a folder a run log names. A created file whose name holds a space survives the restore. A started-command row picked with `--row-id` runs under the default arm, and its backfill replays a different fixture than the run used. The command capture leaves six environment variables changed in its caller, the cost script measures the child brief inside a dispatched worker and a busy marker after 1 MiB of stderr gets no retry. The hook-wiring check reports `hook-missing` for `env node`, `bash -lc` and five more working launches, and A10 counts two report-only copies as expected. Nine docs, comments and contracts say something the code no longer does.

### Purpose
Each of the 27 findings is fixed with a test that failed before the fix and passes after, wherever such a test can exist, and no floor moves from `scratch/before.txt`, so the third review pass reviews a small diff that matches its docs.

**Core need served:** This phase repairs review findings. Its main fix keeps a command off a prompt that rules out a change, so the model is not pointed at a writing workflow the user did not want. The other fixes make the docs and checks say what the code does.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Every command ran on 2026-11-13 from the worktree root at `087888ec4a`, read-only, before phase 016 was built. `ADV` is `.skilled/skills/system-skill-advisor/runtime` and `PL` is this phase's `scratch/planning/`. Each probe in `PL` builds and removes its own temporary trees, and its first comment line says how to run it. No probe opens `holdout-prompts.jsonl`, and the corpus probe skips a holdout row by its raw `split` before parsing it. All 27 findings reproduced, so none is reported as unreproducible. T001 and T002 record these numbers again after phase 016, which may change the gate lines.

```text
# Gate readings at planning. Lines marked "summary" restate a longer output in one line.
# FLOOR, the four lines probe-capture-env.mjs prints after its capture
{"correct":24,"total":44}
{"count":0,"total":35}
{"own":24,"attached":20,"combined":44,"total":44}
{"own":8,"attached":15,"combined":23,"total":45}
# EVAL
[160,50,21,5]
# summary: VX over the 14 existing advisor test files this phase edits
14 test files passed, 188 tests passed, 0 failed
# summary: NT over the four doctor test files this phase edits
hook-wiring-check pass 8, agents-md-check pass 44, doctor-setup-contract pass 4, doctor-agents-md-contract pass 37, fail 0 in each
# summary: VP, the OpenCode plugin test
tests 42, pass 42, fail 0
# DERIVE as status and changed
{"status":"fresh","changed":[]}
# SRM, last line
PASS: 256 mirrors across 10 trees are in sync.
# summary: RV
exit 0, 32 routes validated, 11 warnings
# PBV, last line
PASS package=system-skill-advisor tier=FAIL_CLOSED scenarios=50 categories=9 operator=25 routing_gold_excluded=25 violations=0 warnings=0

# PL/probe-no-edit.mts, exit 0
attach "do not change anything yet" -> undefined | shared pattern true | isNoEditRequest absent | proposed true
attach "don't change anything yet" -> "/create:agent" | shared pattern false | isNoEditRequest absent | proposed true
attach "no changes yet" -> "/create:agent" | shared pattern false | isNoEditRequest absent | proposed true
attach "don’t touch any files" -> "/create:agent" | shared pattern false | isNoEditRequest absent | proposed true
attach "make no changes" -> "/create:agent" | shared pattern false | isNoEditRequest absent | proposed true
scorer commandMeaningEligible "do not change anything yet" -> false
scorer commandMeaningEligible "don't change anything yet" -> true
scorer commandMeaningEligible "no changes yet" -> true
scorer commandMeaningEligible "don’t touch any files" -> true
scorer commandMeaningEligible "make no changes" -> true
isReadOnlyExplainer "please show me the parser config, do not change anything yet" -> true
isReadOnlyExplainer "please show me the parser config, don't change anything yet" -> false
isReadOnlyExplainer "please show me the parser config so i can update it later, no changes yet" -> false
isReadOnlyExplainer "please show me what the fix would be, don’t touch any files" -> false
isReadOnlyExplainer "please show me the parser config and what to edit, make no changes" -> false
attach(sk-doc, sk-create-benchmark, plain, injected table) -> undefined
attach(sk-doc, sk-create-benchmark, plain, generated table) -> "/create:benchmark"
'sk-create-benchmark' in injected sk-doc row -> false

# PL/probe-no-edit-corpus.mjs, exit 0
command-prompts.jsonl: scanned 132, holdout skipped 44, matched today 0, newly matched 0
labeled-prompts.jsonl: scanned 195, holdout skipped 0, matched today 10, newly matched 0
ambiguity-prompts.jsonl: scanned 24, holdout skipped 0, matched today 2, newly matched 0
doctor-prompts.jsonl: scanned 78, holdout skipped 0, matched today 0, newly matched 0

# PL/probe-tsstring.cjs, exit 0
exported: false
LF: raw break in literal true, parses false
CR: raw break in literal true, parses false
U+2028: raw break in literal true, parses true
U+2029: raw break in literal true, parses true
generated strings 1683, with a line break 0

# PL/probe-status-privacy.mts, exit 0
privacy case persists a record: false
diagnostics file before: false
stored record holds both markers: true
status shows a marker: false
status holds the word prompt: false
status hookHealth invocations: 1

# PL/probe-backfill-trust.mjs, exit 0
backfill result: true lines 1
fake CLI ran: true, fake hook ran: true
offerError: null

# PL/probe-restore-quoted.mjs, exit 0
snapshot keys after the turn: ["\"notes draft.md\"","plain.md"]
restoreTurn: {"restored":false,"leftoverPaths":["\"notes draft.md\""],"failures":[]}
left on disk: notes draft.md true, plain.md false

# PL/probe-arm-fixture.mjs, exit 0
armFor exported: false
--row-id g2-deep-review-ask -> arm pre
--set g2 -> arm g2
--row-id g2-deep-review-ask --row-id cmd-x -> arm pre
run with --fixture /custom/fixture puts in the prompt: review the parser under /custom/fixture for correctness gaps and write up what you find, one iteration is enough
its backfill replays: review the parser under /runs/arm/g2-fixture for correctness gaps and write up what you find, one iteration is enough
run line keys: ["runtime","rowId","arm","locator","exit","changedPaths"]
run line records the fixture: false

# PL/probe-capture-env.mjs, exit 0
variables left changed: ["PYTHONDONTWRITEBYTECODE","SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC","SPECKIT_PRIVATE_SKILL_ROOTS","SPECKIT_SKILL_ADVISOR_FORCE_LOCAL","SYSTEM_SKILL_ADVISOR_DB_DIR","VITEST"]
{"correct":24,"total":44}
{"count":0,"total":35}
{"own":24,"attached":20,"combined":44,"total":44}
{"own":8,"attached":15,"combined":23,"total":45}

# PL/probe-cost-child.mjs, exit 0
script exit 0
hook saw AI_SESSION_CHILD=1

# PL/probe-scorer-rowid.sh, exit 0
args [none] exit=2 stdout={"ok":false,"code":"locator_unavailable"} stderr=
args [--row-id no-such-row] exit=2 stdout={"ok":false,"code":"locator_unavailable"} stderr=
//
// Reads a captured session through the shared session readers and reports what a
// model did with the commands a turn offered it: the `COMMAND:` lines it printed,
// the reads and writes in order, and whether a started loop ran its init first.
//   node score-command-transcripts.mjs --runtime <name> --locator '<json>' [--row-id <id>] [--json]

# PL/probe-playbook-notes.sh, exit 0
scenario files: 50
NNN-*.md scenario files: 0
note: the source category tree contains 41 `NNN-*.md` scenario files
result folder named: system-skill-advisor/benchmark/reports/<dated-run-label>/
renderer sentence: Generated report Markdown is renderer-owned and never hand-authored.
benchmark folder exists: no
standard: The wrapper that once persisted them
tests README row: | `manual-testing-playbook.vitest.ts` | Verifies manual testing playbook routing fixtures. |

# PL/probe-plugin-fields.mts, exit 0
compiledRouteSummary lines: ["591: function compiledRouteSummary(data) {","657: const routeSummary = compiledRouteSummary(data);","669: ...(routeSummary ? { compiledRouteSummary: routeSummary } : {}),"]
metadata readers: ["1542: const freshness = response.metadata?.freshness;"]
bounding jsdoc: ["1080: * @param {boolean} [rawOptions.boundedCompiledRouteSummary] - Bound long compiled-route ta"]
envelope test inputs with command, policy, ownerSkillId: false, false, false
plugin test asserts a command label: false
fallback keeps: command /create:agent, policy start, ownerSkillId sk-doc
head: Advisor: live; use sk-doc → /create:agent (start) 0.95/0.12 pass.

# PL/probe-busy-cap.mts, exit 0
marker after 1 MiB: errorCode NON_ZERO_EXIT, retriesAttempted 0
marker first: errorCode SQLITE_BUSY_EXHAUSTED, retriesAttempted 1

# PL/probe-catalog-lines.sh, exit 0
handlers/advisor-recommend.ts:563 => ...semanticLaneOffWarning(semanticLaneOffReason),
lib/skill-advisor-cli-fallback.ts:238 => includeCompiledRoute: true,
schemas/advisor-tool-schemas.ts:287 => workspaceRoot: BoundedWorkspaceRootSchema.optional(),
schemas/advisor-tool-schemas.ts:290 => topK: z.number().int().min(1).max(10).optional(),
schemas/advisor-tool-schemas.ts:308 => confidence: z.number().min(0).max(1),
schemas/advisor-tool-schemas.ts:310 => dominantLane: AdvisorLaneSchema.nullable(),
skill-advisor-cli-manifest.ts:57 => includeCompiledRoute: { type: 'boolean', description: 'Attach compiled
skill-advisor-cli-manifest.ts:58 => compiledRouteTopOnly: { type: 'boolean', description: 'Attach compiled
tools/advisor-recommend.ts:23 => includeCompiledRoute: { type: 'boolean', description: 'Attach compiled
tools/advisor-recommend.ts:24 => compiledRouteTopOnly: { type: 'boolean', description: 'Attach compiled

# PL/probe-embed-contract.sh, exit 0
engine prints the restore failure: 1
workflow names the restore failure: 0
engine names the backup by: digest.slice(0, BACKUP_NAME_CHARS) with BACKUP_NAME_CHARS = 16, fallback path.join(os.tmpdir(), BACKUP_FALLBACK_DIR)
workflow backup name: doctor-agents-md/<timestamp>/
route backup name: doctor-agents-md/<timestamp>/
route names the temporary-directory fallback: no
setup router reason: names `SKILL_ADVISOR_DEBUG`, the setting that turns the records on
setup router names the debug flag: 1
setup router gives the workflow reason: 0
setup workflow reason: because no prompt hook has written a record for this checkout yet
health writer needs debug: requireDebug: false

# PL/probe-hook-shapes.cjs, exit 0
plain node: exit 0 ok claude
env node: exit 1 hook-missing claude .claude/settings.json
/usr/bin/env node: exit 1 hook-missing claude .claude/settings.json
bash -lc: exit 1 hook-missing claude .claude/settings.json
zsh -c: exit 1 hook-missing claude .claude/settings.json
node with a flag: exit 1 hook-missing claude .claude/settings.json
&& stuck to the word: exit 1 hook-missing claude .claude/settings.json
; stuck to the word: exit 1 hook-missing claude .claude/settings.json
the repository shape: exit 0 ok claude
echo with a quoted script: exit 0 ok claude
echo of node: exit 1 hook-missing claude .claude/settings.json
this repository: exit 0 ok claude, ok codex, ok cursor, ok devin

# PL/probe-a10-count.sh, exit 0
A10 PASS | 5/6 copies as expected, 1 pointer missing
  CLAUDE.md: INFO pointer missing
  .codex/AGENTS.md: PASS absent
  .cursorrules: INFO reported only
  .cursor/rules/skill-routing.md: PASS gate1 block in sync
  .cursor/rules/repo-local.md: PASS absent
  ~/.claude/CLAUDE.md: INFO reported only

# PL/probe-phase-map.sh, exit 0
row 1  001-command-routing-baseline-corpus: map=Complete child=Complete
row 2  002-command-inventory-and-risk-metadata: map=Complete child=Complete
row 3  003-plain-chat-command-reach: map=Complete child=Complete
row 4  004-command-meaning-matching: map=Complete child=Complete
row 5  005-recommendation-contract-and-brief: map=Complete child=Complete
row 6  006-gate-2-binding-and-runtime-pointers: map=Complete child=Complete
row 7  007-per-runtime-behaviour-proof: map=In Progress child=In Progress
row 8  008-embedder-setup-and-cost: map=Complete child=Complete
row 9  009-ux-performance-cross-cli-research: map=In Progress child=In Progress
row 10  010-reachability-and-attribution: map=Complete child=Complete
row 11  011-typed-command-delivery-and-guards: map=Complete child=Complete
row 12  012-plain-offer-reach: map=Complete child=Complete
row 13  013-attribution-and-install-reach: map=Complete child=Complete
row 14  014-review-remediation: map=In Progress child=Complete  <- differs
row 15  015-health-default-and-brief-refinements: map=Planned child=Complete  <- differs
```

### Mechanism per Work Group
- WG1: `NO_EDIT_REQUEST` (`ADV/lib/command-attach.ts:289`) holds `do not (change|edit|modify|touch)` but no contraction and no `no changes`. `attachCommand` (`:329`), `readOnlyRouteAllowed` (`ADV/lib/scorer/fusion.ts:677`) and `commandMeaningEligible` (`fusion.ts:881`) test the lowercased prompt, and `isReadOnlyExplainer` (`ADV/lib/scorer/text.ts:148`) holds a third copy of the same alternation. The status privacy case stores no record, so it cannot fail. `command-attach.vitest.ts:120` asks the injected table for a mode it has no row for, so it returns before any gate. The command-bridges README row sentence omits `mutating`. `tsString` escapes only the backslash and the single quote.
- WG2: `warmCheckout` and `replayOffer` (`command-offer.mjs:332-345`, `:83-99`) spawn node on files under the line's `locator.projectDir`. `statusSnapshot` (`worktree-restore.mjs:46-58`) splits plain porcelain output, where git quotes a path with a space. `armFor` (`run-command-behaviour.mjs:974-977`) names g2 only for `--set g2`. `backfillLog` (`:1214`) rebuilds every prompt from `g2-fixture` beside the log.
- WG3: the capture sets five variables and deletes four (`capture-command-routing-baseline.mjs:361-376`) and its `finally` (`:662-668`) restores only the clock. `measureRow` (`measure-brief-cost.mjs:163-170`) passes the caller's `AI_SESSION_CHILD` to the hook.
- WG4: `scoreSession` never reads `--row-id`, while the README and the session usage line offer it. The scorer header promises an ordered report the CLI does not print.
- WG5: the playbook note counts 41 `NNN-*.md` files where the tree holds 50 scenario files and none of that name, the persistence paragraph names a renderer-owned folder no renderer writes and the tests README row calls the inventory test a routing-fixture test.
- WG6: the plugin computes `compiledRouteSummary` on every prompt for a metadata field nothing reads, its jsdoc says the bounding option bounds target lists and no test on either delivery path asserts the command, policy or owner fields.
- WG7: `capOutput` (`subprocess.ts:147-152`) stops collecting stderr at 1 MiB, and the busy test (`:355`) reads only what was collected. Six catalog citations point at moved lines.
- WG8: the embed workflow's exit-3 rule has no branch for `ERROR: the restore failed`, the workflow and the route name the backup folder `<timestamp>` while the engine names it by the plan digest, and `setup.md:82` names `SKILL_ADVISOR_DEBUG` as the switch for records the hook now writes by default.
- WG9: `runsMarker` (`hook-wiring-check.cjs:141-146`) splits on spaces and wants the marker right after node at a command start. `rowRuntimeCopies` (`agents-md-check.cjs:651`) subtracts only failed, unmeasured and pointer-missing entries, so report-only INFO entries count as expected.
- WG10: the parent map shows row 7 In Progress with no reason, row 14 In Progress and row 15 Planned, while the 014 and 015 child specs say Complete.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A. Widen the shared no-edit pattern, normalise curly apostrophes before the test in one exported helper and route the attach path, the scorer's two gates and the explainer through it. Guard status privacy with a stored record, drop the vacuous assertion, name `mutating` in the README row shape and escape line breaks in `tsString` (WG1).
- B. Refuse to spawn from an untrusted backfill checkout, read NUL-separated status in the restore, run started-command rows picked by id under arm g2 and replay the fixture a g2 run recorded (WG2).
- C. Restore the capture's environment and drop `AI_SESSION_CHILD` from the cost script's hook environment (WG3).
- D. Refuse `--row-id` in the scorer's session form, describe what the scorer prints and document the WG2 and WG3 names in the routing-accuracy README (WG4).
- E. Restate the playbook's inventory note and persistence folder and the tests README row (WG5), remove the plugin's dead route summary and stale jsdoc and test the command fields on both delivery paths (WG6), see a busy marker past the stderr cap and cite catalog anchors by name (WG7), complete the embed and setup contracts (WG8) and fix the hook launch matcher and the A10 count (WG9).
- F. Correct rows 7, 14 and 15 of the parent phase map (WG10, coordinator).

### Out of Scope
- `iter2-P2-hook-health-doc-scope` - refuted by the review synthesis.
- The report's section 8 deferred items, carried unchanged: the per-request child input, `run` commands that write, the DSH install row, `R1-P2-003` reach, live per-runtime evidence, the sealed holdout observation, the nested probe repository and the closeout steps.
- The known limit that a prompt which only limits scope keeps its skill and loses its command - the operator decision keeps the pattern failing toward no offer.
- Rebuilding behaviour arenas, starting a model session or running a live arm.
- `AGENTS.md`, every `package.json` and any phase folder other than this one. The parent `spec.md` changes only in T036.
- Follow-up, not built here: a narrow third `/deep:review` runs over this phase's diff only, with two lineages, one for the attach and runner code and one for the doctor scripts and contracts, at about four iterations each and the 0.10 threshold, then closeout over that pass's lineages only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `ADV/lib/command-attach.ts`, `ADV/lib/scorer/text.ts`, `ADV/lib/scorer/fusion.ts` | Modify | Widened `NO_EDIT_REQUEST`, exported `isNoEditRequest`, its three callers |
| `ADV/tests/command-attach-guards.vitest.ts`, `ADV/tests/scorer/read-only-explainer.vitest.ts`, `ADV/tests/command-meaning-anchor.vitest.ts`, `ADV/tests/command-attach.vitest.ts`, `ADV/tests/handlers/advisor-status.vitest.ts` | Modify | No-edit cases, README field check, deleted assertion, stored privacy record |
| `ADV/scripts/command-bridges/derive-command-bridges.cjs`, `ADV/scripts/command-bridges/README.md`, `ADV/tests/derive-command-bridges-strings.vitest.ts` | Modify, Create | Escaped `tsString`, exported, round-trip test, README row shape |
| `ADV/scripts/routing-accuracy/command-offer.mjs`, `worktree-restore.mjs`, `run-command-behaviour.mjs` and `ADV/tests/command-offer.vitest.ts`, `worktree-restore.vitest.ts`, `command-behaviour-guards.vitest.ts` | Modify | Trusted checkout, NUL status, `armFor`, `lineFixture` |
| `ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs`, `ADV/scripts/measure-brief-cost.mjs`, `ADV/tests/command-routing-slice.vitest.ts`, `ADV/tests/measure-brief-cost.vitest.ts` | Modify | Environment restore, child flag removed |
| `ADV/scripts/routing-accuracy/score-command-transcripts.mjs`, `README.md`, `ADV/tests/command-transcript-score.vitest.ts` | Modify | Session `--row-id` refusal, header, README lines |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md`, `ADV/tests/manual-testing-playbook.vitest.ts`, `ADV/tests/README.md` | Modify | Inventory note, persistence folder, test row |
| `.opencode/plugins/system-skill-advisor.js`, `.opencode/plugins/tests/system-skill-advisor.test.cjs`, `ADV/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` | Modify | Dead summary removed, jsdoc, field tests |
| `ADV/lib/subprocess.ts`, `ADV/tests/subprocess-output-cap.vitest.ts`, `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md` | Modify | Busy scan past the cap, citations by name |
| `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml`, `.skilled/commands/doctor/_routes.yaml`, `.skilled/commands/doctor/setup.md`, `.skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs`, `doctor-setup-contract.test.cjs` | Modify | Restore-failure branch, digest backup name, setup reason |
| `.skilled/commands/doctor/scripts/hook-wiring-check.cjs`, `agents-md-check.cjs` and `tests/hook-wiring-check.test.cjs`, `tests/agents-md-check.test.cjs` | Modify | Quote-aware launch matcher, A10 count |
| `../spec.md` | Modify | Rows 7, 14 and 15 of the phase map, coordinator only |

The restraint pass for each file the report did not list: `fusion.ts` joins WG1 because the operator's decision normalises the apostrophe before the test and its two gates test the raw prompt, `read-only-explainer.vitest.ts` and `command-meaning-anchor.vitest.ts` hold the explainer and gate cases the report asks for. The report's new `doctor-agents-md-embed-contract.test.cjs` is not created, because `doctor-agents-md-contract.test.cjs` already parses the embed workflow and the embed route, so its two new cases go there. The one new file is `derive-command-bridges-strings.vitest.ts`, named by the report, because no test loads the string emitter and its cases belong to neither the policy ladder nor the drift guard. No module, CLI option, layer or dependency is added. The new exports are the functions the new tests call. The prompt named the route manifest under `assets/`, but it lives at `.skilled/commands/doctor/_routes.yaml`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. Each requirement names the report ids it closes.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `SA2-P2-002`: `command-attach.ts` exports `isNoEditRequest(text)`, which lowercases, maps U+2018 and U+2019 to a straight apostrophe and tests a `NO_EDIT_REQUEST` widened with `make no changes`, `no changes yet` and the `don't` contraction. The plan first named a bare `no changes`, which a verifier showed catching change requests that limit their scope, so T042 narrowed it. `attachCommand`, `readOnlyRouteAllowed`, `commandMeaningEligible` and `isReadOnlyExplainer` call it, so the four wordings attach no command, fail both gates and read as no-write on a read-only prompt. |
| REQ-002 | The widening moves no floor: every `FLOOR` and `EVAL` value after the rebuild equals its line in `scratch/before.txt`. |
| REQ-003 | `iter3-P2-backfill-log-code-execution`: the backfill spawns nothing from a checkout that is neither the project root nor a clone holding `.git/skilled-behaviour-arena`, and records `offerError` `untrusted_checkout` on that line. |
| REQ-004 | `iter5-P2-quoted-path-restore`: `statusSnapshot` reads `git status --porcelain -z`, so a created file whose name holds a space is removed and both sides of a rename are keys. |
| REQ-005 | `iter2-P2-g2-row-id-arm-mislabel`: an exported `armFor(options, rowIds)` returns the explicit arm when given, `g2` when every selected id is a started-command row, `pre` when none is, and refuses a mix with code `mixed_row_arms`. |
| REQ-006 | `iter2-P2-backfill-fixture-mismatch`: a g2 run line records `fixture`, `backfillRunLog` hands each line to `promptFor` and the backfill replays the recorded fixture through an exported `lineFixture`, falling back to `g2-fixture` beside the log for an older line. |
| REQ-007 | No task prints holdout prompt text, starts a model session or writes under the home folder. `AGENTS.md` and every `package.json` are unchanged, the parent `spec.md` changes only in T036 and no added code comment names a spec path, phase number, task id or finding id. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | `SA2-P2-003`: the status privacy case stores a debug record holding two marker strings, checks the stored file holds them and asserts the status output shows neither. |
| REQ-009 | `SA2-P2-001`: the assertion at `command-attach.vitest.ts:120` is deleted. |
| REQ-010 | `SA2-P2-004`: the command-bridges README names `command`, `policy`, `mutating` and `ownerSkillId` as the row fields, and a test holds that sentence to the `CommandRow` interface. |
| REQ-011 | `SA2-P2-005`: `tsString` also escapes `\n`, `\r`, U+2028 and U+2029, is exported and round-trips each through a parsed literal, and the deriver check still prints `"changed": []`. |
| REQ-012 | `iter2-P2-capture-env-not-restored`: `scoreCommandCorpus` restores every variable it sets or deletes in its `finally`. |
| REQ-013 | `iter2-P2-cost-script-child-brief`: the cost script removes `AI_SESSION_CHILD` from each hook's environment. |
| REQ-014 | `iter4-P2-row-id-session-mode`: the scorer's session form refuses `--row-id` as a usage error, and neither the usage text nor the README offers it there. |
| REQ-015 | `iter5-P2-scorer-header-ordered-report`: the scorer header says it prints counts and verdicts. |
| REQ-016 | `iter4-P2-playbook-inventory-note`: the playbook note states the tree's own count, 50 scenario files and none named `NNN-*.md`, and the playbook test holds it to the tree. |
| REQ-017 | `iter4-P2-playbook-persistence-path`: the persistence paragraph names the folder records are written to by hand and drops the renderer claim, with the marker kept. |
| REQ-018 | `iter4-P2-tests-readme-description`: the tests README row calls `manual-testing-playbook.vitest.ts` the playbook inventory test. |
| REQ-019 | `iter2-P2-inert-bounded-summary-option`: the jsdoc says the option only sets the `bounded_compiled_route_summary` status field. |
| REQ-020 | `iter5-P2-orphaned-route-summary`: the plugin's `compiledRouteSummary` function and its metadata field are gone. |
| REQ-021 | `iter5-P2-field-pass-through-untested`: the fallback envelope test and the plugin test each assert a `sk-doc → /create:agent (start)` head from a row carrying `command`, `policy` and `ownerSkillId`. |
| REQ-022 | `iter2-P2-stderr-cap-hides-busy`: a busy marker anywhere in stderr, past the cap or split across chunks, triggers the one retry, and the pinned case expects `SQLITE_BUSY_EXHAUSTED` with one retry. |
| REQ-023 | `iter4-P2-advisor-recommend-stale-line-refs`: the catalog page cites the six schema and handler anchors by symbol, with no `advisor-tool-schemas.ts:` or `handlers/advisor-recommend.ts:` line number left. |
| REQ-024 | `DR2-P2-004`: the embed workflow's exit-3 rule gives `ERROR: the restore failed` its own outcome, which takes precedence over `restored:`. |
| REQ-025 | `DR2-P2-006`: `setup.md` gives the reason the setup workflow gives for an absent hook health record and no longer names `SKILL_ADVISOR_DEBUG`. |
| REQ-026 | `DR2-P2-008`: the workflow and the route name the backup folder by the first 16 characters of the plan digest, and the route names the temporary-directory fallback. |
| REQ-027 | `DR2-P2-005`: the hook-wiring check reads `env node`, `/usr/bin/env node`, `bash -lc`, `zsh -c`, node with flags before the script and a `;` or `&&` stuck to the previous word as wired, and a marker inside a quoted `echo` argument as not wired. |
| REQ-028 | `DR2-P2-007`: A10 counts PASS entries alone as expected and names the report-only entries apart, reading `3/6 copies as expected, 2 reported only, 1 pointer missing` on this repository. |
| REQ-029 | `iter3-P2-phase007-open-evidence`: parent map row 7 names why it stays In Progress, and rows 14 and 15 read Complete. |
| REQ-030 | The routing-accuracy README names `untrusted_checkout`, the g2 `fixture` field, the g2 arm rule with `mixed_row_arms` and the cost script's removal of `AI_SESSION_CHILD`, in the words REQ-003, REQ-005, REQ-006 and REQ-013 fix. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The planning probes print the fixed behaviour: `probe-no-edit.mts` prints `undefined` on all five attach lines and `false` on all five scorer lines, `probe-backfill-trust.mjs` prints `fake CLI ran: false, fake hook ran: false`, `probe-restore-quoted.mjs` prints `left on disk: notes draft.md false, plain.md false`, `probe-arm-fixture.mjs` prints `--row-id g2-deep-review-ask -> arm g2` and `refused mixed_row_arms`, `probe-capture-env.mjs` prints `variables left changed: []`, `probe-cost-child.mjs` prints `hook saw AI_SESSION_CHILD=<unset>`, `probe-busy-cap.mts` prints `marker after 1 MiB: errorCode SQLITE_BUSY_EXHAUSTED, retriesAttempted 1`, `probe-hook-shapes.cjs` prints `exit 0 ok claude` for the nine launch shapes and `hook-missing` for both `echo` shapes, and `probe-a10-count.sh` prints `3/6 copies as expected, 2 reported only, 1 pointer missing`.
- **SC-002**: `VALL` reports 0 failed, `DALL`, `VSR` and `VP` report `fail 0` and `SRM` and `RV` exit 0.
- **SC-003**: Every `FLOOR` and `EVAL` value equals its line in `scratch/before.txt`.
- **SC-004**: `bash PL/probe-phase-map.sh` prints no `differs` line.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 016 is committed first and edits seven files a lane here edits | A quoted anchor or a line number moved | T001 checks the commit. Every task re-reads its files and marks itself `[B]` with the line it found when an anchor is gone |
| Risk | The widened pattern takes a command from a prompt that only limits scope | Low: the corpus probe newly matches 0 of 429 non-holdout rows | The direction is the one the operator chose, and T038 holds every floor equal |
| Risk | A holdout aggregate moves, because no planning probe reads holdout prompts | Med: `EVAL` or a holdout count could shift | T038 compares every value with `before.txt` and blocks on any change |
| Risk | An arena built before the marker existed now gets `untrusted_checkout` on backfill | Low: its lines keep null offer fields | Intended. Rebuild the arena with `prepare-behaviour-arena.mjs` |
| Risk | The launch tokenizer reads a non-launch as wired | Med: a doctor PASS on a hook that never runs | The two `echo` cases stay `hook-missing` in `HWT`, and T034 checks the four runtimes of this repository stay `ok` |
| Risk | The A10 detail drops from `5/6` to `3/6` on this repository | Low: the verdict stays PASS | No code reads the detail. The test pins the new wording |
| Risk | The busy scan's carried tail matches a marker cut at the window start | Low: one extra retry | The window carries 64 characters, more than three times the longest marker |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: `isNoEditRequest` adds one lowercase, one replace and one regex test per call, with no I/O.
- **NFR-P02**: The busy scan tests each stderr chunk once with at most 64 carried characters and stops after the first match.

### Security
- **NFR-S01**: The backfill spawns no process from a checkout that is neither the project root nor a marked arena.
- **NFR-S02**: No task prints holdout prompt text, starts a model session or writes under the home folder. Every test builds its trees under the system temp folder and removes them.

### Reliability
- **NFR-R01**: Every fix lands with a test that failed before it, except where none can: `SA2-P2-003` has no leak path today and its case guards one, `iter5-P2-field-pass-through-untested` passes today and guards a dropped field, `iter5-P2-orphaned-route-summary` and `iter2-P2-inert-bounded-summary-option` are guarded by the plugin suite, `iter5-P2-scorer-header-ordered-report` and `iter4-P2-tests-readme-description` are a comment and a doc line, and `iter4-P2-advisor-recommend-stale-line-refs` and `iter3-P2-phase007-open-evidence` are checked by `rg` and the phase-map probe.
- **NFR-R02**: A restore that cannot remove a path still lists it in `leftoverPaths` and the runner still stops the arm.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a selection with no row ids runs under `pre`, and a run line with no `fixture` field replays `g2-fixture` beside the log.
- Maximum input: a busy marker after 1 MiB of stderr, or split across two chunks, still triggers the one retry, while stdout and stderr stay capped at 1 MiB.
- Failure path: a backfill line naming an untrusted checkout keeps null offer fields with `offerError` `untrusted_checkout` and the rest of the log is still written.
- "do not change anything yet" still matches, and a prompt with no no-edit wording still attaches `/create:agent`.
- A rename whose new name holds a space yields both names as keys, and an untracked folder still arrives with its trailing slash.
- `echo "x && node <marker>"` and `echo node <marker>` stay `hook-missing`, while the repository's own `bash -c 'cd ... && node <marker> || {...}'` stays `ok`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | About 43 files in ten groups across the advisor runtime, the routing-accuracy scripts, the OpenCode plugin, the doctor scripts and contracts and four docs, about 700 changed lines |
| Risk | 9/25 | The no-edit gate and the backfill trust are offer-safety and code-execution guards, each behind a failing-then-passing test and the floors |
| Research | 5/20 | Every finding was re-read in code and reproduced by a probe before planning |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

### Resolved

- Q1. Build all 27 findings? Decision (operator): yes, one lane per work group, the lanes in parallel.
- Q2. Where is the curly apostrophe handled? Decision (operator): at the shared pattern, with curly apostrophes normalised before the test, so the attach path and the scorer both get it. `fusion.ts` therefore joins WG1 although the report kept it out, because its two gates test the raw prompt. A character class holding both apostrophes in the pattern would have spared `fusion.ts` and is recorded as the alternative.
- Q3. Does the scope-limiting known limit change? Decision (operator): no. A prompt that only limits scope keeps its skill and loses its command.
- Q4. Which hook launches read as wired? Decision (operator): `env node`, `/usr/bin/env node`, `bash -lc`, `zsh -c`, node with flags before the script and a `;` or `&&` stuck to the previous word, and a marker inside a quoted `echo` argument reads as not wired.
- Q5. Where do the two embed contract assertions go? Decision: into `doctor-agents-md-contract.test.cjs` (Recommended), which already parses the embed workflow and route. The report named a new file.
- Q6. Is `untrusted_checkout` a refusal of the whole backfill or a line error? Decision: a line error like `no_checkout` (Recommended). The report asks for it on the line, and the rest of the log stays writable.
- Q7. What does `--row-id` do in session mode? Decision: it is a usage error and the session usage line drops it (Recommended). A locator already names one session, and the report offers filtering or dropping.
- Q8. Which persistence folder does the playbook name? Decision: the one the standard names, written by hand (Recommended). The `sk-create-manual-testing-playbook` standard says the wrapper that wrote these records was retired, and no renderer writes under this skill.
- Q9. What are the WG10 rows? Decision: the coordinator's (operator). Rows 7, 14 and 15 only.

### Open

- Does the widened pattern move a holdout aggregate? UNKNOWN until T038, because no planning probe reads holdout prompts. Owner: the coordinator.
<!-- /ANCHOR:questions -->
