---
title: "Implementation Plan: Phase 32: review-pass-five-remediation"
description: "Fixes review pass five's 2 P1 and 29 P2 findings in four lanes, one per review area, each task test first and checked by an Opus verifier, then rescores the stored arms, proves the floors byte-equal, commits, gets one Opus review and a DeepSeek re-review of the fix diff, and writes the pass-five synthesis."
trigger_phrases:
  - "review pass five remediation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 32: review-pass-five-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | ES modules for the routing-accuracy scripts and the Vibe part, TypeScript for the Claude hook and the Vitest suites, CommonJS for the doctor wiring check and its `node --test` suites, JSON for the leaf scopes and Markdown for the docs |
| **Framework** | The skill advisor runtime and its Vitest suite, the routing-accuracy harness (transcript scorer, arena builder, behaviour runner, offer replay), the shared hook resolver `hook-flags.cjs`, the doctor scripts and the sk-doc playbook and leaf-manifest validators |
| **Storage** | The stored run logs and session stores of phase 007, read by the scorer and never edited, and the gitignored `ADV/dist` rebuilt by `BUILD` |
| **Testing** | Vitest test-first cases per lane, the verifier's five probes and `scratch/planning/arena-cases.sh`, the routing floors and eval, the full advisor suite, the doctor and Vibe `node --test` suites, the mirror checks, `META` and `PBV` |

### Overview
Four lanes build the findings of one review area each. Lane A fixes the transcript scorer on one track and the arena builder and runner on a second track that shares no file with the first. Lane K corrects the kill-switch doc rows, the playbook control step, two tests and the lib README. Lane V fixes the Vibe part, the Claude hook, the doctor wiring check and the hook contract. Lane D fixes eight docs and regenerates the leaf files. The coordinator records the before state, rescores the stored arms after lane A, runs every gate, compares the floors, checks the boundaries, commits, gets one Opus review and one DeepSeek re-review of the fix diff, writes the synthesis and closes the phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phase 031 reads `Complete`, `2427bc4c4b6` is an ancestor of HEAD and `git status` prints nothing for `FILES` (T001)
- [ ] `scratch/before.txt`, `scratch/floor-before.txt`, `scratch/eval-before.txt` and `scratch/probes-before.txt` are recorded (T001)
- [ ] The stored-arm summaries and per-row lines are recorded before lane A edits the scorer (T002)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `BUILD` and `TC` exit 0, `VALL` reports 0 failed, `DT` and `VT` report `fail 0`, and `VMIR`, `META` and `PBV` pass (T035)
- [ ] The floor and eval after files equal their before files, and `scratch/probes-after.txt` reads as SC-001 states (T035, T036)
- [ ] `scratch/rescore-delta.txt` names every moved figure and each quoted figure is restated (T034)
- [ ] The fix is committed, the Opus review and the last DeepSeek round leave no open P0 or P1, and the synthesis is written (T038 to T042)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Fix at each owner.

### Key Components
- **`score-command-transcripts.mjs`**: a write reader beside the existing read reader, an anchored marker match and a tally on the command parts. Without them a `sed -i` edit is invisible and a quoted marker is a start.
- **`prepare-behaviour-arena.mjs`**: an entry guard, two exports, three precondition refusals, a dotenv list and the marker lines. Without them an arena measures a build nobody committed.
- **`run-command-behaviour.mjs`**: one exported guard called before every live turn. Without it a remote a turn adds survives into every later turn.
- **The kill-switch rows, tests and README, the Vibe part, the Claude hook, the doctor check, the hook contract and the eight docs**: each one change at the line the finding names.

No new file outside this phase folder. Three new exports, each named in `spec.md` section 3 with what fails without it.

### Decision D1: an in-place shell edit is a write

**Decision.** `normalize` gains a write reader, `shellWriteTargets(command)`, beside `shellReadTargets` (`RAD/score-command-transcripts.mjs:713`), split the same way: on `;`, `&&`, `||`, `|` and newlines, leading `NAME=value` words skipped and `cd` followed. Its writers and targets:

| Writer | Counts as a writer when | Target words |
|--------|------------------------|--------------|
| `sed` | a word is `-i`, starts `-i`, is a short-flag cluster holding `i`, or is `--in-place` or `--in-place=...` | the last non-option word |
| `perl` | a short-flag cluster holds `i`, as `-pi` and `-i.bak` do | the last non-option word |
| `cp`, `mv` | always | the last non-option word |
| `tee`, `rm`, `mkdir`, `touch` | always | every non-option word |

A shell call with at least one write target emits one `write` event per target with its `command`, in order, and no `shell` event, as a redirect already does (`:401-405`). A redirect and an in-place writer in one call each add their targets. A call with no target, such as `tee` alone, stays `shell`. The verifier's probe after the fix prints `kinds=write unsafe=true loopInit=false` for every spelling but the Python one, and `startedCommand=/deep:review` on both decline lines.

**Why.** The unsafe verdict, `loopInit` and the start rule all read `write` events (`firstWritePosition` at `:690`), so the fix belongs where events are made, not in each reader. The writer list is the verifier's, which names the commands a model runs to change a file in place. The word rule keeps the `sed` script and the `perl -e` code out of the targets, because both come before the file.

**Rejected.** Reading a Python, Node or other interpreter write. Its target is only known by running its code, so the `python write` line stays `kinds=shell`, recorded in D13. Treating every unknown shell call as a write, which would mark every `ls` unsafe.

### Decision D2: the arena refuses a dirty source and a stale build

**Decision.** `main` checks two preconditions on the source before it clones, each with `refuse()` and exit 2, so nothing is written on a refusal:
- `source_dirty`, when `git status --porcelain` in the source prints any line, with the first ten paths in the refusal.
- `stale_build`, when a copied `dist` tree's newest file is older than the newest tracked file in the folder that holds that `dist`, outside its `dist/` and `node_modules/`. The tracked files come from `git ls-files -z -- <folder>`. The refusal names the folder, the newest source time and the build time.

The marker becomes three kinds of line: the head, `source clean`, and one `built <relPath> <ISO time of its newest file>` line per copied `dist`. Both readers test the marker's existence only (`RAD/run-command-behaviour.mjs:630-631`, `RAD/command-offer.mjs:358`), so the extra lines change no reader.

**Why.** Case B of the verifier's probe has a clean tree and a stale `dist`, so a clean-tree check alone leaves the gap open, and case A has a fresh build of an uncommitted edit, so a freshness check alone leaves it open too. Both are refused before the clone, so a refused build never leaves a half-made arena. The rule reads any tracked file in the package folder, so it also works on the temporary repositories the tests and probes build.

**Rejected.** Reusing `dist-freshness.cjs` from system-spec-kit. It checks registered packages only, needs the spec-kit workspace link to load, and would pass the verifier's case B, whose source is a temporary repository. Rebuilding inside the arena, which the builder header rules out (`:12-16`).

### Decision D3: the guard runs before every live turn, and the comments name the real boundary

**Decision.** `RAD/run-command-behaviour.mjs` exports `turnRefusal(root, { dryRun })`, which returns `null` on a dry run and `liveArmRefusal(root)` otherwise. `runTurn` calls it before every turn and keeps the dirty-path check on the first turn only. The comment at `:610-613` and the one in `runTurn` at `:1267-1269` say a remote is what a turn could push to by name, and that the push boundary is the child environment's empty credential helper, empty `GH_CONFIG_DIR` and `GIT_TERMINAL_PROMPT=0` (`childEnv`, `:1001-1035`). The builder header at `RAD/prepare-behaviour-arena.mjs:5-10` says the arena takes away remotes, an outer repository's hooks and credentials, not the filesystem, since a turn can write anywhere its user can by absolute path.

**Why.** The verifier's probe shows a remote added by one turn survives the restore, and that a push to an explicit URL exits 0 with no remote at all, so the remote check narrows the surface and the credential overrides hold the line. `runTurn` spawns a model and a dry run skips the guard, so the exported helper is the only seam a test can reach. The every-turn call is checked by reading the code, which the task's verify names.

**Severity.** Graded P2, as the verifier graded it. The registry row still says P1 (spec A3).

### Decision D4: a `COMMAND:` line is one the model printed as its own

**Decision.** `commandLines` skips lines inside a fenced block and lines that open with `>`, and matches `COMMAND:` only where it opens the line after optional list markers, digits with a dot, emphasis markers, a backtick or a square bracket. The tally keys on `commandParts(command)`'s namespace and name, so `/deep:review` and `/deep:review:auto` count together while each entry keeps its own `command`.

**Why.** A refusal that quotes the format is not a report, and a model that reports `/deep:review` then `/deep:review:auto` reported one command twice. The module comment at `:494-503` already lists the markup a model wraps the line in, so the anchor accepts that markup and nothing before it.

### Decision D5: a copied link may not leave the source

**Decision.** The walk that `holdsDotenv` does over each copied tree also checks each symlink, and `main` refuses `symlink_escape` with the link's path when its real path is outside the source or cannot be resolved. A link that stays inside the source is copied as a link, as today.

**Why.** Dereferencing would copy the outside data into the arena, which is the leak. At planning the build trees hold 110 links, none absolute and none resolving outside, so the refusal does not fire on this repository.

**Rejected.** Checking the four tracked absolute links under `specs/**/scratch`. They arrive through `git clone`, so `copyPath` never sees them (D13).

### Decision D6: tracked dotenv files are named, not refused

**Decision.** The builder lists every tracked file at the head whose base name matches `DOTENV_PATTERN`, writes it as `trackedDotenv` in its success output and as one `tracked-dotenv <path>` line in the marker, and the header sentence at `:31-34` says the dotenv skip covers the copied build trees only, since a clone brings every tracked file. The marker comment at `:322-324` already says copied build trees and stays.

**Why.** `git ls-files` at planning prints a root `.env.example` and one more under `specs/`, so a refusal would refuse every arena built from this repository. A file in git history is already published to anyone who clones it, so the arena adds no exposure. Naming it lets the operator see it.

### Decision D7: the builder owns the marker name

**Decision.** The builder gains the `invokedDirectly` entry guard that `RAD/run-command-behaviour.mjs:1482-1491` and `RAD/score-command-transcripts.mjs:2267-2276` use, exports `MARK` and `copyArgs(platform)`, and the runner, the offer replay and both tests import `MARK`. `copyArgs('darwin')` returns `['-Rc']` and any other platform `['-R']`, and `runCp` passes `copyArgs(process.platform)`.

**Why.** The builder writes the marker, so it is the owner. Without the guard, importing the file would run `main` with the importer's arguments and exit. The builder imports nothing local, so the new imports make no cycle.

**Rejected.** Putting the constant in `command-offer.mjs`, which would make the builder load the shared session readers to read one string.

### Decision D8: the kill-switch docs, built in place

**Decision.** `ENV-REFERENCE.md` row 74 names `MK_HOOKS_DISABLED` as its alias. Row 75 adds `MK_SKILL_ADVISOR_DISABLED`, `MK_SKILL_ADVISOR_HOOK_DISABLED` and `MK_SKILL_ADVISOR_PLUGIN_DISABLED` to its aliases and `system-skill-advisor/runtime/lib/advisor-disabled.ts`, `system-skill-advisor/runtime/skill-advisor-cli.ts` and `system-skill-advisor/runtime/handlers/advisor-recommend.ts` to its sources. The lib README tree names every tracked top-level file and folder of `ADV/lib`.

**Why.** The file sits under system-spec-kit, outside the packet's skills, so recording it was weighed. It is built because the branch already rewrote row 75 to add the direct call (`git diff origin/main` shows only that row and the Vibe paragraph), the two cells are about the advisor switch this branch shipped, and main has not touched rows 74 and 75 since the merge base (spec Measured Behavior). The README tree claims to be the folder, so adding the seven files and leaving nine folders out would leave the same finding open.

### Decision D9: the hook fixes reuse what exists

**Decision.** `skillAdvisorHookEnabled` in `SAD/hooks/claude/user-prompt-submit.ts` finds `hooks/shared/hook-flags.cjs` by walking up from its own folder, as `loadHookFlags` in `ADV/lib/advisor-disabled.ts:50-68` does, and keeps its fail-open answer. `tomlCommands` in `DS/hook-wiring-check.cjs` keeps `match` beside `type` and `command`, and `inspect` accepts a block for the Vibe `pre_agent` event only when `match` is absent or exactly `main`. Any other value, `re:` selectors included, reads `hook-missing`.

**Why.** The walk-up already exists for the same resolver in the same skill. A `re:` selector could match the main agent or not, and the doctor cannot run Vibe's matcher, so it reports what it can prove. The real `.vibe/hooks.toml` uses `match = "main"` (line 18), so it still reads `ok vibe`.

### Decision D10: the docs follow their owners

**Decision.** `DM5-P2-007` is fixed by removing `PARTIAL` from `SAD/manual-testing-playbook/manual-testing-playbook.md:84`, `:121` and `:128`, and the feature rule at `:128` becomes `` `SKIP`: no mapped scenario is `FAIL` and at least one is `SKIP`. `` The `loadRate` sentence at `SAD/changelog/v1.1.0.0.md:176` names `command` and `skill` as its numerator and says `otherMode` is counted in the denominator only, and no number in that line changes in lane D. Both gap-09 lines go, `:38` and the parenthetical at `:350`.

**Why.** `validate-playbook-package.cjs` names `PASS`, `FAIL` and `SKIP` as the outcome vocabulary and lists `PARTIAL` as a forbidden verdict (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:30-31`), and the root template uses the same three (`assets/manual-testing-playbook-template.md:182-183`). Adding `PARTIAL` to the persistence line, as the verifier proposed, would move the root further from its owner. The figures at `:176` are rescored by T034, which restates any that moved.

### Decision D11: the stored arms are rescored, phase 026's arm is not

**Decision.** T002 records `SSTART`, `SPRE` and `SFIN` and their per-row lines before lane A, and T034 runs them again after lane A, writes every moved run with its rule into `scratch/rescore-delta.txt`, and restates each moved figure in the goal log with `PLOG`. A moved figure quoted in a packet doc becomes a follow-up task with the next free id. The parent spec's open question on load rates and `SAD/changelog/v1.1.0.0.md:176` are the two quote sites read first.

**Why.** D1 and D4 change what the scorer reads from a stored session, which the floors and eval never show. Phase 026's arm was stopped by the operator before scoring, so scoring it here would produce the verdict the operator declined.

### Decision D12: one Opus review, then DeepSeek on the fix diff

**Decision.** One Opus reviewer reads `G diff BASE FIX` read-only. Then round `5b` runs four `cli-opencode` lineages on `opencode-go/deepseek-v4.1-flash` at reasoning effort `max`, three iterations each, one per area, labelled `accuracy-runner-confirm-5b`, `kill-switch-cli-confirm-5b`, `vibe-hooks-doctor-confirm-5b` and `docs-metadata-confirm-5b`, over a scope file that lists only the fix commit's paths. A P1 that reproduces becomes a task, a new fix commit and one closing round `5c` over that commit's diff. No round past `5c` runs. The synthesis moves the pass-four report to `review/review-report-pass-4.md` and writes the pass-five report, counting rows whose `_lineages` end in `-5`, `-5b` or `-5c`.

**Why.** It is the shape of pass four's rounds `4b` and `4c` (`review/review-report.md`, phase 027 T024 to T026), with one lineage per pass-five area.

### Decision D13: recorded, not built

| Item | File and line | Reason |
|------|---------------|--------|
| `R1-P2-002` | `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:184`, `:195` | Rejected by the verifier: the field is documented and the code handles it |
| Interpreter writes | `RAD/score-command-transcripts.mjs` `normalize` | A Python or Node write's target is only known by running it. The probe's `python write` line stays `kinds=shell` |
| Tracked absolute symlinks | four links under `specs/**/scratch`, found with `git ls-files -s` mode `120000` | `git clone` brings them, not `copyPath` |
| The fixed six-hop resolver path in other sources | `SAD/hooks/claude/directive-lifecycle-boundary.ts:18` and 13 sources under `.skilled/skills/system-spec-kit/runtime/hooks/` (`claude`, `codex`, `cursor`, `devin`) | No finding grades them, every compiled copy resolves, and the spec-kit sources are another skill's |
| The registry severity of the remote guard | `review/deep-review-findings-registry.json`, `iter3-P1-remote-guard-first-turn-only` | Merged output, graded P2 by the verifier |
| Scoring phase 026's arm | `026-untuned-behaviour-arm/scratch/runs/` | Stopped by the operator before scoring |

### Data Flow
A live turn runs in an arena built from a clean source with a fresh build, and the runner checks before each turn that no remote was added. The stored session goes through `normalize`, which now turns an in-place edit into a write, then through the start, unsafe and load rules and the `COMMAND:` line reader, and the summary feeds the goal log.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

The findings come from `review/verify-5/report.md` and the merged registry, read as inert data. Every row below was read in the code or run by this planner, and no command was copied from a registry field.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `normalize`, `shellReadTargets`, `redirectTargets` (`RAD/score-command-transcripts.mjs:267`, `:372`, `:713`) | Make and classify events | update `normalize`, reuse the split | The probe and the `CTS` cases (T003) |
| `firstWritePosition`, `startState`, `loopInit`, `startedCommand` (`:690`, `:1077`, `:1257`, `:1024`) | Read `write` events | unchanged, they see more writes | `CTS`, then the rescore (T034) |
| `commandLines`, `offerSeenIn`, `reportedStart` (`:521`, `:556`, `:1004`) | Read `COMMAND:` lines | update `commandLines` only | `command-line-cases.mjs`, `CTS` (T004, T005) |
| `prepare-behaviour-arena.mjs` `main`, `buildArena`, `copyPath`, `runCp`, `MARK` | Build the arena | update (T006 to T010, T013) | `arena-cases.sh`, `CBG` |
| `run-command-behaviour.mjs` `runTurn`, `liveArmRefusal`, `MARK` (`:523`, `:614`, `:1264`) | Guard a live arm | update (T006, T012) | `CBG` |
| `command-offer.mjs` `trustedCheckout` (`:354-362`) | Trusts an arena by its marker | update the literal only (T006) | `COT` |
| `RAD/README.md:111`, `:143` | Describe the builder | update (T014) | `DOCV`, `rg` |
| `liveArmRefusal`'s other caller | The verifier's `remote-guard.mjs` probe | not changed, the probe narrates and is not an after check | `probes-after.txt` equals its before lines |
| `ENV-REFERENCE.md:74-75` | Switch reference | update (T015) | `rg -c`, `DOCV` |
| `ADVISOR_DISABLED_FLAGS` (`ADV/lib/advisor-disabled.ts:74-80`) | The ten names | unchanged, the tests and the playbook read it | T016 to T018 |
| `withCommandDocuments`, `headReceiptDir`, `buildAdvisorPart` (`SAD/hooks/vibe/prompt-advisor.mjs:68`, `:123`, `:203`) | The Vibe part | update (T020, T021) | `VBT`, `vibe-part.mjs` |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | Calls `buildAdvisorPart` | not a consumer of the changed signatures, its call is unchanged | `VT` |
| `skillAdvisorHookEnabled` (`SAD/hooks/claude/user-prompt-submit.ts:68`) and its dist | The Claude hook switch | update and rebuild (T022) | `UPT`, `BUILD` |
| `tomlCommands`, `inspect` (`DS/hook-wiring-check.cjs:233`, `:350`) | The doctor's Vibe row | update (T023) | `HWT`, the `agents_spawn` probe |
| `SAD/leaf-scopes.json`, `leaf-manifest.json`, `leaf-aliases.json` | Leaf routing files | update and regenerate (T033) | `META` |

Required inventories:
- Same-class producers: `rg -n "new URL\('\.\./\.\./\.\./\.\./\.\./\.\./hooks/shared" .skilled/skills --glob '*.ts' --glob '!**/dist/**' --glob '!**/node_modules/**'` lists the fixed-hop sources. One is built (T022) and the rest are recorded (D13). `rg -n "'-Rc'|cp -R" .skilled/skills/system-skill-advisor --glob '!**/node_modules/**'` lists every copy call.
- Consumers of changed symbols: `rg -n "MARK|skilled-behaviour-arena|liveArmRefusal|turnRefusal|copyArgs" .skilled/skills/system-skill-advisor --glob '!**/dist/**'` is read at close.
- Matrix axes: the eight writer spellings by target position, the five arena cases A to E, the three `match` values (absent, `main`, other), the ten switch names by three surfaces (playbook, launcher, CLI).
- Algorithm invariant: a `write` event names a path the command writes, never its script or its source, and an arena holds only the commit under test, its fresh build and links that stay inside the source. Adversarial cases: `sed -i '' 's/a/b/' f`, `perl -pi -e 's/x/y/' f`, `cp src dest`, `rm -rf a b`, `tee` with no file, a quoted `COMMAND:` line, a dangling link, a `dist` newer than an untracked file.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep <n>` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and checks that ten archives become three. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the before state, the probe lines and the stored-arm summaries. Implementation runs lane A on two tracks (the scorer, then the arena and runner), lane K, lane V and lane D side by side, each task test first and checked by an Opus verifier. Verification rescores the stored arms, runs every gate and the floors, reruns the probes, checks the boundaries, commits, gets the Opus review and the DeepSeek re-review, writes the synthesis and closes the phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The write reader, the marker reader, the tally, the builder exports, `turnRefusal`, the Vibe part, the Claude hook switch, the `match` rule | `VX` on `CTS`, `CBG`, `COT`, `VBT`, `UPT`, and `node --test` on `HWT` |
| Integration | The builder end to end on temporary repositories, the kill-switch fixtures, the floors and eval, the full advisor suite, the doctor and Vibe suites, `META`, `PBV`, `VMIR` | `arena-cases.sh`, `VX` on `LBT` and `CSD`, `FLOOR`, `EVAL`, `VALL`, `DT`, `VT` |
| Manual | The five verifier probes before and after, and the stored-arm rescore | `PROBES`, `SSTART`, `SPRE`, `SFIN`, `PERROW` |

A task that changes code writes its case first and sees it fail for the reason the task names. A task that changes only a test or a name proves its case can fail with the check its line names: a case count that rises, or a run against a mutated copy outside the repository.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 031 closed and the catch-up merge `2427bc4c4b6` in HEAD | Internal | Complete | T001 stops the phase |
| The stored run logs and sessions of phase 007 | Internal | On disk at planning (`007-per-runtime-behaviour-proof/scratch/runs-*.jsonl`) | T002 and T034 cannot rescore |
| The verifier's probes in `review/verify-5/probes/` | Internal | Committed at `1d9fdd6231e` | No before or after lines |
| `jq`, `rg`, `git`, `node`, `python3` | Tool | Present | A probe or a gate cannot run |
| DeepSeek v4.1 flash max on OpenCode Go, an Opus verifier per task, one Opus reviewer and the `5b` lineages | External | Named in the dispatch | A lane or the re-review waits |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A floor or eval line moves, a suite goes red, a rescored figure moves for a reason no task names, or the arena builder refuses the real repository after a fresh build.
- **Procedure**: Before the fix commit, discard a lane's change file by file with `G restore -- <file>`. After it, revert the fix commit as a whole and run `BUILD`, so the gitignored `dist` follows the restored sources. The stored run logs and sessions are never edited, so a revert needs no data restore.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup T001 ► T002 ─┬─► lane A scorer  T003 ► T004 ► T005 ─────────────────────────────┐
                   ├─► lane A arena   T006 ► T007 ► T008 ► T009 ► T010 ► T011 ► T012 ► T013 ► T014
                   ├─► lane K         T015 ► T016 ► T017 ► T018 ► T019 ──────────────┤
                   ├─► lane V         T020 ► T021 ► T022 ► T023 ► T024 ► T025 ──────┤
                   └─► lane D         T026 ► T027 ► T028 ► T029 ► T030 ► T031 ► T032 ► T033
──► T034 rescore ► T035 gates and floors ► T036 probes ► T037 boundaries ► T038 commit ► T039 Opus review
──► T040 round 5b ► T041 adjudicate (5c at most) ► T042 synthesis ► T043 close
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 031 committed | Implementation |
| Implementation | Setup. Each lane task follows the task before it in its lane. The two lane A tracks share no file. T034 waits for both lane A tracks | Verification |
| Verification | Every lane ended and no worker session open for `VALL` | Close |
<!-- /ANCHOR:phase-deps -->

---
