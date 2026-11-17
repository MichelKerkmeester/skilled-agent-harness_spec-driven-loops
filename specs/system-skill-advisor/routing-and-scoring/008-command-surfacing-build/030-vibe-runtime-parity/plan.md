---
title: "Implementation Plan: Phase 30: vibe-runtime-parity"
description: "Gives the command-surfacing packet's own surfaces Vibe support: the transcript scorer reads Vibe tool calls through the Vibe reader's entries, the behaviour runner names Vibe as not measured, the doctor checks the Vibe prompt hook and the three Vibe mirrors, the Vibe brief names each command's document and policy observations carry their own runtime, each change test first, then proves the real Vibe brief with a test and hands the rest back."
trigger_phrases:
  - "vibe runtime parity plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 30: vibe-runtime-parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ES modules (`.mjs`) for the scorer, the runner and the Vibe hook, CommonJS for the doctor check, TypeScript compiled to the advisor runtime's `dist` for the shared handler, YAML for the doctor route and workflow, and Markdown |
| **Framework** | The skill advisor runtime (its routing-accuracy scripts, its hook handler and its Vitest suite), the doctor command scripts with `node --test`, and the Vibe prompt-advisor hook |
| **Storage** | None changed. The scorer reads the committed Vibe reader fixture, and the probes write only under a temporary folder they remove |
| **Testing** | Vitest in four existing files and one new file, `node --test` in two doctor test files, the fourteen Vibe node suites as guards, and the planning matrix in `scratch/planning/` |

### Overview
Six surfaces gain Vibe support, each test first. The scorer loads a Vibe run a second time through the Vibe reader and turns its projection entries into records, so its tool calls reach `normalize` under a Vibe table of recorded names. The runner names Vibe as not measured. The doctor's wiring check reads `.vibe/hooks.toml` line by line, and the runtime-mirrors route runs the three Vibe checks. The Vibe hook adds a line naming each command's document, and the shared handler labels each observation with its own runtime. A new test runs the Vibe hook with the real advisor and pins the command, the policy word, the `Also:` line and the document line. The planning matrix then shows every gap line changed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phase 029 reads `Complete`, the merge `e58d450985c` is an ancestor of HEAD and `git status` prints nothing for `FILES` (T001)
- [ ] `scratch/floor-before.txt`, `scratch/eval-before.txt` and every suite line of `scratch/before.txt` are recorded (T001)
- [ ] `scratch/repro-before.txt` matches the Measured Behavior block (T002)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `BUILD` and `TC` exit 0, `VALL` reports 0 failed, `DT` and `VT` report `fail 0`, `MIRRORS`, `VMIR`, `DRV` and `RV` exit 0 (T013)
- [ ] The floor and eval after files equal their before files (T014)
- [ ] `scratch/repro-after.txt` shows every gap line changed as SC-001 states (T015)
- [ ] The fix is committed and the Opus review reports no open P0 or P1 (T017, T018)
- [ ] `scratch/handback.md` lists every handed-back gap with its evidence, written at planning and rechecked at close (T019)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Extend each owner.

### Key Components
- **`RAD/score-command-transcripts.mjs`**: a `vibe` row in `TOOL_TABLES`, an exported `vibeRecords(entries)` and one branch in `scoreRun`. Without them every Vibe run stays `unscorable_runtime`, and with the table alone a Vibe run that wrote would score as one that touched nothing.
- **`RAD/run-command-behaviour.mjs`**: one `NOT_MEASURED` row. Without it `vibe` is an unknown runtime, which tells a reader nothing about why.
- **`DS/hook-wiring-check.cjs`**: one `RUNTIMES` row with a `format` field and a TOML branch in `inspect`. Without them a Vibe checkout whose prompt hook is gone passes the doctor's delivery leg.
- **The doctor runtime-mirrors workflow and route**: three rows each. Without them a stale `.vibe/prompts` passes `/doctor:runtime-mirrors`.
- **`SAD/hooks/vibe/prompt-advisor.mjs`**: an exported `withCommandDocuments(context, root)` called before `reduceRepeatedHead`. Without it a Vibe model has no path from `/doctor:setup` to its document.
- **`SAD/hooks/claude/user-prompt-submit.ts`**: one expression. Without it every non-Claude observation reads `Claude Code`.

The one new file is `ADV/tests/hooks/vibe-prompt-advisor.vitest.ts`. No new module, option, layer or dependency.

### Decision D1: score Vibe through a scorer-local view of the reader's entries

**Context.** `normalize` reads `toolCall` blocks from records. The Vibe reader puts only message entries into `records` and keeps tool effects in `entries`, and the dispatcher's `loadSession` returns `records` alone (spec, Mechanism per Path).

**Decision.** `scoreRun` keeps calling `loadSession`, so a reader refusal keeps its own code. For a `vibe` line that loaded, it calls `loadVibeSession` from `.skilled/hooks/shared/session-readers/vibe.mjs` with the same locator and passes `vibeRecords(session.entries)` to `normalize`. `vibeRecords` walks the entries in projection order. A `message` entry from the user or the assistant becomes a record of its text blocks. An `effect` entry whose `detail.kind` is `tool` becomes an assistant record holding one `{ type: 'toolCall', id, name: detail.toolName, arguments: detail.input }` block. Every other entry is skipped.

**Why.** Projection order is the order the session ran, because the reader's replay keeps each entry at its first position when a later delta replaces it, so a read before a write stays before it. The shared reader and the dispatcher stay as they are: `readSession` projects `records` for history lookup and keeps unpaired calls out of it on purpose, and main still edits that reader.

**Rejected.**
- A Vibe table with no adapter. The fixture session wrote `proof.txt` and would normalize to a text event alone.
- Putting `toolCall` blocks into the Vibe reader's `records`. It changes what `readSession` projects for every history caller, in a file main owns.
- `turnToolCalls`. It returns only the latest turn's calls and drops their order against the assistant text.

### Decision D2: the Vibe tool table holds recorded names only

**Decision.** `vibe: { read: ['file_system.read_file'], write: ['file_system.write_file', 'file_system.edit'], shell: ['file_system.bash'], skill: [] }`.

**Why.** `kindOf` compares a folded name exactly, and every Vibe tool name is namespaced. `file_system.write_file` (`path`, `content`) is in the committed reader fixture, `file_system.read_file` (`path`) in the 018 forced-compaction journal and `file_system.bash` (`command`) in the 009 lineage journal (Measured Behavior). `file_system.edit` is a builtin of the recorded registry, and the repo-guard fixture `post-edit-quality/clean-payload.json` gives it `file_path`, a key `PATH_KEYS` already reads. `process.start` and `skill.read` are registry builtins with no recorded call, so neither their model-facing name nor their argument keys are known. They stay out and are named as a limit. A Vibe skill load that reads a `SKILL.md` through `file_system.read_file` already counts as a read.

### Decision D3: the runner names Vibe as not measured

**Decision.** `NOT_MEASURED.vibe` is `no live turn is wired for it: live runs need an arena with credentials off and the behaviour arms are stopped`. `RUNTIMES` gains no Vibe entry, so no argv, no `VIBE_HOME` and no journal locator are built.

**Why.** Goal decision D5 keeps live runs in an arena with credentials off, and the operator stopped the behaviour arms. An argv that no run uses is code no test can prove. The reason must not say the reader is gated, because the Vibe reader is `ready` (`index.mjs` capabilities).

### Decision D4: the doctor reads `.vibe/hooks.toml` line by line

**Decision.** The Vibe row is `{ id: 'vibe', dir: '.vibe', file: '.vibe/hooks.toml', event: 'pre_agent', marker: 'hooks/session-lifecycle/vibe/turn-start.mjs', format: 'toml' }`. For a `toml` row, `inspect` reads the file as text and splits it into blocks at each line that is exactly `[[hooks]]` after trimming. In a block, it reads `type` and `command` from lines of the form `key = "value"`, skipping lines that start with `#`, and unescapes the basic string's `\"` and `\\`. The row is wired when some block's `type` equals the event and its `command` passes the existing `runsMarker`. An unreadable file is `hook-missing`.

**Why.** Goal decision D2 forbids installs, so no TOML package. The hook file uses one basic-string line per key, and the check needs two keys. `runsMarker` already reads the command the way a shell does, so `node "$(git rev-parse --show-toplevel)/.skilled/hooks/session-lifecycle/vibe/turn-start.mjs"` counts and an echo or a comment does not. `turn-start` is the marker because it is the one `pre_agent` entry that composes the brief (`.vibe/hooks.toml:12-20`, `turn-start.mjs:27`).

**Known limit.** Pi, DSH and OpenCode still have no row: they load their prompt hook through an extension or a plugin, not a hook file. Recorded in the doctor README and the hand-back, not built.

### Decision D5: the Vibe mirror rows follow the DSH shape

**Decision.** Three `upstream_assets` keys, `vibe_prompts`, `vibe_agents` and `vibe_skills`, three execution steps and three repair lines, each in the DSH wording, with the surfaces `.vibe/prompts`, `.vibe/agents` and `.vibe/skills` and the tree `.vibe/`. Each step reports the row as n/a while `.vibe/` is absent and says the run never creates that directory. The route gains the three `--check` invocations with the same n/a comment. The purpose line names `.vibe`, and the paragraph after the repair lines says the Vibe rows read n/a the way the DSH rows do.

**Why.** A `--check` against an absent tree reports 45, 11 and 55 drift items and exits 1 (Measured Behavior), so without the n/a rule a checkout with no `.vibe/` would read as drift. The DSH rows already carry that rule and the contract test already checks it, so the Vibe rows reuse both.

### Decision D6: the Vibe hook names each command's document

**Decision.** `withCommandDocuments(context, root)` reads the head, the text before `\nDirectives:` or the whole context when there is no directive block. It finds each command token, a `/` at the start of the head or after a space or `(` followed by a lowercase name, an optional `:` and a lowercase name. It maps `/ns:name` to `.skilled/commands/ns/name.md` and a colon-less `/name` to `.skilled/commands/name.md`, drops any second `:` part such as `:auto` and any word after the token such as `setup` in `/doctor:git setup`, keeps a path only when `existsSync(join(root, path))` is true, and lists each path once in head order. When at least one path is kept, it inserts one line at the end of the head: `Command documents (read in full before taking one): /create:readme is .skilled/commands/create/readme.md.`, with several commands joined by `, `. A thrown error returns the context unchanged. `buildAdvisorPart` calls it on the advisor's context before `reduceRepeatedHead`.

**Why.** The brief names `/doctor:setup`, and the only Vibe copy is `.vibe/prompts/doctor-setup.md`, headed `/doctor-setup`, with no loader to run it. `AGENTS.md:288` points every runtime at `.opencode/commands/`, which links to `.skilled/commands/`, but not at how a colon name maps to a path, and `AGENTS.md` has 134 bytes left before its last anchor (Measured Behavior). Only Vibe lacks a command loader, so the line belongs to the Vibe hook, where it costs no other runtime a byte. Adding it before `reduceRepeatedHead` keeps equal heads equal, so a repeated brief is still dropped. Naming the canonical document, not the stub, saves the model a hop.

**Rejected.**
- A line in `AGENTS.md`. It reaches every runtime for a Vibe-only gap and would spend most of the 134 bytes left.
- Renaming the stub headings to the colon form. The generator is main's Vibe work, and the model would still need to know to look in `.vibe/prompts/`.
- A sentence in the hook doc alone. A model does not read it.

### Decision D7: the observation label is the runtime that emitted it

**Decision.** `observeEmittedAdvisorPolicy` receives `runtime: runtime === 'claude' ? 'Claude Code' : runtime`, where `runtime` is the label the handler already resolved.

**Why.** Pi, DSH and Vibe pass their label in, and Codex, Cursor and Devin set `SPECKIT_RUNTIME`, yet all six are recorded as `Claude Code` (Measured Behavior). The binding sits in an in-process sink that no production code reads, and no data file names `"Claude Code"`, so the change breaks no reader. Claude keeps its label, so the existing sink tests, which pass `Claude Code` themselves, keep their meaning.

### Decision D8: the proof runs the real advisor in a child process

**Decision.** The new test file starts a child `node` process per case with `createIsolatedCliScope(...).env`, plus `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` under the scope's `rootDir` and with `AI_SESSION_CHILD` deleted. The child imports `buildAdvisorPart` from the Vibe hook, calls it with a `pre_agent` payload, a fresh session id and the prompt, and prints the result. The test cleans up with `cleanupSkillAdvisorScope`.

**Why.** The hook imports the compiled handler, which talks to the advisor through the scope's socket folder and database. A child process keeps that state out of the Vitest worker, the scope keeps every real flags file, socket and receipt out, and `AI_SESSION_CHILD` left set would make the hook return nothing and the test pass or fail for no reason. The prompts are `write a readme for the utils folder`, `Check my git hooks setup` (`SAD/changelog/v0.16.0.0.md:25`) and `my skilled install is broken, check its health`, so no row file is read.

### Data Flow
A Vibe user types a prompt. Vibe runs the `turn-start` hook, which calls `buildAdvisorPart`. It calls the compiled handler under the label `vibe`, which renders the brief and records its observations as `vibe`. The hook adds the command document line to the head and drops the head when this session already received it unchanged. Later, the scorer reads a Vibe run's journal through the Vibe reader and scores its reads, writes and shell steps, and the doctor checks the Vibe hook entry and the three Vibe mirrors.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

No review Planning Packet applies. The gaps come from the operator's request and a read-only analysis, and every row below was read in the code or run by this planner.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `RAD/score-command-transcripts.mjs` `TOOL_TABLES`, `scoreRun` (`:166-203`, `:1577-1586`) | Scores a run's events, throws for a runtime with no table | update (T003) | The Vibe cases of `SCT` and the G1 line of the matrix |
| `.skilled/hooks/shared/session-readers/vibe.mjs`, `index.mjs` | The Vibe reader and the dispatcher | unchanged, now also read by the scorer through `loadVibeSession` | `G diff --quiet BASE -- .skilled/hooks/shared/session-readers` exits 0 (T016) |
| `RAD/run-command-behaviour.mjs` `NOT_MEASURED`, `resolveRuntime` (`:93-95`, `:1102-1110`) | Refuses an unknown or unmeasured runtime | update (T004) | The Vibe case of `RBT` and the G2 line |
| `DS/hook-wiring-check.cjs` `RUNTIMES`, `inspect` (`:39-68`, `:310-321`) | The doctor's delivery leg | update (T005) | The Vibe cases of `HWT`, `WIRE` and the G3 line |
| `.skilled/commands/doctor/assets/doctor-setup.yaml:61`, `doctor-symlink-check.yaml:60` | Run the wiring check and print its lines | not a consumer of a format change, they print what it prints | `DT` passes |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml`, `_routes.yaml` runtime-mirrors route | The mirrors diagnostic and its manifest | update (T006) | The contract test, `RV` and the G5 line |
| `ADV/scripts/command-bridges/derive-command-bridges.cjs` and its generated JSON | Read `_routes.yaml` routes, trigger phrases and subroutes | not a consumer of `script_invocations` (`rg -n script_invocations` on the deriver prints nothing) | `DRV` exits 0 and the drift-guard test passes in `VALL` |
| `SAD/hooks/claude/user-prompt-submit.ts:444-448` | Records host-observed policy blocks | update (T007) | The label cases of `UPT` and the G11 lines |
| `ADV/lib/policy-plan.ts` sink, `ADV/tests/policy-observation-sink.vitest.ts` | Holds and tests the binding | unchanged, the tests pass their own label | `VALL` |
| `SAD/hooks/vibe/prompt-advisor.mjs` `buildAdvisorPart`, `reduceRepeatedHead` (`:120-139`, `:160-193`) | The Vibe advisor part | update (T009) | The unit and proof cases of `VPT` |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` and its test | Composes the Vibe turn-start parts | not a consumer: its test stubs a brief that names no command | `VT` passes |
| `SAD/hooks/pi/prompt-advisor.ts`, `SAD/hooks/dsh/prompt-advisor.mjs` | The other in-process callers | not a consumer of D6, consumers of D7 through the label only | `VALL` and `VT` |
| `RAD/README.md:135`, `:137`, `DS/README.markdown:112`, `:235`, `SAD/hooks/skill-advisor-hook.md:95` | Describe the scorer, the runner, the wiring check and the Vibe hook | update (T010, T011, T012) | `rg` for each new sentence |

Doc lines about Vibe left unchanged, each handed back or true after the fix:
- `.skilled/hooks/README.md:30`, `:36`, `:351-359`, `.skilled/hooks/goal/vibe/README.md:21`, `.vibe/SYNC.md:71`, `.vibe/plugins/README.md:66` and `cli-mistral-vibe/references/guards-and-hooks.md:139` are on the dispatch's do-not-touch list or in main's Vibe work, and are handed back (`scratch/handback.md`).
- `.skilled/commands/doctor/runtime-mirrors.md` and `doctor-runtime-mirrors-presentation.txt` list no checker rows (the presentation file holds one generic row template), so they need no change.

Required inventories:
- Same-class producers: `rg -n "TOOL_TABLES|NOT_MEASURED|RUNTIMES = \[|'Claude Code'" $RAD $DS .skilled/skills/system-skill-advisor/hooks --glob '!**/dist/**'` lists each table this phase extends and the one label.
- Consumers of changed symbols: `rg -n "normalize\(|loadSession\(|vibeRecords|withCommandDocuments|buildAdvisorPart|observeEmittedAdvisorPolicy" .skilled --glob '!**/dist/**' --glob '!**/node_modules/**'` is read at close.
- Matrix axes: G1 the tool kind (read, write, edit, shell, an unknown tool) by the source (reader fixture, recorded shapes) and the reader result (ok, refusal). G3 the event (`pre_agent`, `post_agent`), the line form (live, commented, `name` only) and the tree (present, absent). G5 the three checks by the four contract rules. G6 the head form (`→` command, `Also:`, `run`, ambiguous, none), the name form (`/ns:name`, `/ns:name arg`, `/ns:name:auto`, `/name`) and the file (present, absent). G11 the four labels.
- Algorithm invariant: `vibeRecords` keeps projection order and turns exactly the tool effects into `toolCall` blocks. `withCommandDocuments(context)` equals `context` when the head names no command whose document exists, and is a pure function of the head and the checkout. Adversarial cases: a replaced effect entry (kept at its first position), a non-tool effect, a `/0.94/0.12` score fragment, a command whose file is absent and a head with no directive block.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep <n>` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and checks that ten archives become three. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup checks the gate and records the floors, the suites, the mirror checks and the matrix before any edit. Implementation runs five lanes, each task test first: lane S the scorer, lane R the runner, lane W the doctor wiring check then the mirrors, lane H the handler label, the proof and the document line, and lane D the three documents once the code they describe is in. Verification builds, runs every gate, compares the floors, reruns the matrix, checks the boundaries, commits the fix, gets one Opus review, writes the hand-back and closes the phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `vibeRecords` and the Vibe table, the Vibe `NOT_MEASURED` refusal, the TOML reader, the mirror contract, the observation label and `withCommandDocuments` | Vitest in `SCT`, `RBT`, `UPT` and `VPT`, `node --test` in `HWT` and `RMC` |
| Integration | The scorer's summary over a run log naming the committed Vibe fixture, the wiring check on this checkout, and the Vibe hook with the real advisor in an isolated scope, plus the floors, the eval and the full suite | Vitest, `node --test`, the committed captures and `jq` |
| Manual | `zsh $SP/planning/vibe-parity-matrix.sh` prints every gap line changed | The planning matrix |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 029 closed and the merge `e58d450985c` in | Internal | Complete | T001 stops the phase |
| The Vibe reader, its fixture and the recorded Vibe journals | Internal | Committed by main's Vibe packet, unchanged here | The scorer cases have nothing to read. A main change to the reader's entry shape shows in `SCT` and `VT` |
| Main moving under the branch | Internal | A final catch-up merge follows | A conflict in one of `FILES` is resolved at that merge. No file here sits in main's Vibe tree |
| `jq`, `rg`, `zsh` and the compiled `dist` | Tool | Present | The matrix or the proof cannot run. `BUILD` comes before every probe, matrix or proof run after an edit to the handler |
| DeepSeek v4.1 flash max on OpenCode Go, an Opus verifier per task and one Opus reviewer for the diff | External | Named in the dispatch | A lane waits for its worker |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A floor or eval line moves, a non-Vibe runtime's score changes, the wiring check stops passing a runtime it passed, a non-Vibe brief changes, a repeated Vibe head stops being dropped, or a suite goes red.
- **Procedure**: Before the fix commit, discard the lane's working changes to the files it owns, which no other lane touches. After it, revert the fix commit as a whole. The rebuilt `dist` follows the source on the next `BUILD`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup (T001, T002) ──► lane S T003 ──────────────────────────┐
                   ├─► lane R T004 ──────────────────────────┤──► lane D T010 (after T003, T004)
                   ├─► lane W T005 ──► T006 ─────────────────┤──► lane D T011 (after T005)
                   └─► lane H T007 ──► T008 ──► T009 ────────┘──► lane D T012 (after T009)
──► Verification: gates, floors, matrix, boundaries ──► fix commit ──► Opus review ──► close
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 029 committed and the merge in | Implementation |
| Implementation | Setup. T006 follows T005 because both change the doctor suite `DT` runs. T008 follows T007's `BUILD`. T009 follows T008, whose proof cases it extends. Each lane D task follows the code it describes | Verification |
| Verification | Every lane ended and no worker session open for `VALL` | Close |
<!-- /ANCHOR:phase-deps -->

---
