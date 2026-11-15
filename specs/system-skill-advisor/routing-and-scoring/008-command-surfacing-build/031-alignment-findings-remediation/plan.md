---
title: "Implementation Plan: Phase 31: alignment-findings-remediation"
description: "Fixes the in-scope P0 and P1 findings of the 2026-11-15 alignment run: the command-reference validator accepts `.vibe`, CI runs the Vibe mirror checks, the release note states the offer rule the code ships, three playbook scenarios cover the offer gates, the policy word and the Vibe document line, and four routing probes are tuned one at a time behind byte-equal floors, while the P0 battery rows are proven on the merge base and on main and the rest is handed back."
trigger_phrases:
  - "alignment findings remediation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 31: alignment-findings-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS for the command-reference validator, GitHub Actions YAML, JSON routing metadata compiled by the Python skill-graph compiler, TypeScript for one Vitest census test, and Markdown for the release note, the catalog page and the playbook |
| **Framework** | The skill advisor runtime (its CLI, its SQLite skill graph and its Vitest suite), the sk-doc playbook contract and its package validator, and the `/local-skilled-alignment` recheck |
| **Storage** | The advisor's gitignored SQLite index, rescanned after each metadata edit, and the committed compiled graph `scripts/skill-graph.json` |
| **Testing** | The validator's `--self-test`, `actionlint`, the playbook package validator and census test, the advisor CLI probes, the routing floors and eval, the full advisor suite and the doctor tests |

### Overview
Four lanes build the in-scope findings, each task test first or probe first. Lane V widens the validator allowlist and adds the Vibe checks to CI. Lane D corrects the offer rule in two docs, as the operator answered. Lane P writes three playbook scenarios against the sk-doc playbook contract. Lane R adds routing phrases one probe at a time, and a coordinator floor gate after each either keeps it or reverts it with the moved numbers. The coordinator proves the P0 battery rows on two extracts, rebuilds the stale `dist`, runs every gate, commits, gets one review and runs the recheck report-only.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phase 030 reads `Complete`, the merge `682ca792315` is an ancestor of HEAD and `git status` prints nothing for `FILES` (T001)
- [ ] `scratch/floor-before.txt`, `scratch/eval-before.txt`, `scratch/matrix-before.txt` and every line of `scratch/before.txt` are recorded (T001)
- [ ] `scratch/battery-origin.txt` holds the three extracts and the BAT-01 rebuild (T002)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `BUILD` and `TC` exit 0, `VALL` reports 0 failed, `DT` reports `fail 0`, and `VMIR`, `META` and the validator exit 0 (T017)
- [ ] The floor and eval after files equal their before files (T018)
- [ ] `scratch/matrix-after.txt` reads as SC-001 states (T019)
- [ ] The fix is committed, the Opus review reports no open P0 or P1 and the recheck reads as REQ-012 states (T021 to T023)
- [ ] `scratch/handback.md` lists every handed-back finding (T024)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Fix at each owner.

### Key Components
- **`validate-command-references.cjs`**: one allowlist entry. Without it the validator exits 1 on this branch's own doctor asset.
- **The two CI workflows**: three check lines each and two filter lines. Without them a Vibe drift merges with every check green, and `/doctor:runtime-mirrors` is the only detector.
- **The release note and the catalog page**: two sentences each corrected. Without them the docs promise a withhold the code never makes.
- **Three playbook scenarios**: without them the operator's release gate passes even if an offer gate is inverted.
- **Two `intent_signals` lists and the compiled graph**: without them P02, P04, P07 and P11 keep missing their skill.

The new files are the three scenarios. No new module, option, layer or dependency.

### Decision D1: append `.vibe` last, in RUN's exact text

**Decision.** The allowlist line becomes `const RUNTIME_DIR_ALLOWLIST = new Set(['.skilled', '.opencode', '.claude', '.codex', '.cursor', '.devin', '.pi', '.dsh', '.vibe']);`. The comment above it already says the list holds every runtime with an `agents/` tree, which `.vibe/agents/` now is, so it stays.

**Why.** `recheck.cjs` reads a literal finding as resolved only when the new text is present and the old text gone. Any other order or spacing reads `file changed differently`. The self-test already fails on the real tree today, so it is the failing first run.

**Rejected.** A fixture line naming `.vibe/agents/` as allowed. The self-test only asks for at least one fixture violation, so the line would never fail, and the real tree already guards the entry.

### Decision D2: the Vibe checks join the existing jobs

**Decision.** In `command-tree-parity.yml`, `.vibe/**` follows `.dsh/**` in the pull request and push path lists, and a step `Compare the Vibe mirrors with their sources` follows the DSH step in the `dsh-mirror` job and runs the three Vibe checks through `.opencode/skills/system-spec-kit/runtime/cli/vibe/`. The job comment names Vibe. The job id and its `name:` stay. In `spec-kit-check.yml`, the same three lines end the `Mirror parity checks` step, and no filter is added. `.github/workflows/README.md:30` names the Vibe copies beside the DSH copies.

**Why.** The Vibe scripts load `@spec-kit/shared` through the workspace link, which both jobs already install. A renamed job or job name changes the status-check context a branch rule may require, so the step joins the job as it is. The neighbouring lines use the `.opencode/` prefix, so the new lines do too. `spec-kit-check.yml` has no `.dsh/**` filter and no DSH check, and the dispatch adds `.vibe/**` only where `.dsh/**` is (spec A6).

**Rejected.** A separate `vibe-mirror` job, which repeats the install for three node runs. The S11 surface-map row, which lives in the main checkout's private command and is handed back.

### Decision D3: the operator's answer on D-03

**Operator's answer, 2026-11-15:** "fix the note, not the code. Keep offering a typed command unless the prompt refuses it or asks about it, and correct the release note and any doc that says a mentioned command is not offered."

**Decision.** `SAD/changelog/v1.1.0.0.md:45` becomes `- **A refusal or a question is not a request.** A command the prompt refuses or asks about is not offered, while a command named with no such lead is. <!-- section: Command Fit -->`. Line 136 opens `A command the prompt refuses or asks about is not offered. A command named with no ask or decline lead counts as a request and is offered, because a typed command is the reader's own wording.` and keeps its last two sentences. `SAD/feature-catalog/cli-surface/advisor-recommend.md:41` opens `` `attachCommand()` returns no command when the prompt refuses or asks about it, and no command when the prompt rules out a change. A command named with no ask or decline lead before it is offered. `` and keeps its last sentence. The heading `#### A Mention Is Not a Request` at line 134 becomes `#### A Refusal or a Question Is Not a Request`. C-05 is folded in as one sentence in that release note's `One Head on Every Runtime` section: `On Vibe, a head that names a command also names each command's document under \`.skilled/commands/\`, because Vibe has no command loader.`

**Why.** `typedCommandForTop` and `attachCommand` withhold a command only when `commandOnlyMentioned` sees an ask or decline lead (`ADV/lib/command-attach.ts:253-261`, `:414-445`). A typed command is how a reader names the workflow they want, and typed delivery reads 43 of 44 today. Withholding every unled naming would remove the command from any typed row with no request verb before it. That count needs the row prompts, which no task reads, so it is inferred from the code. The closed phase 20 row of the parent spec stays as written (spec A7).

### Decision D4: three scenarios, one per surface

**Decision.**
- **NC-012** `native-cli-tools/command-offer-fit-gates.md`, `A Command the Prompt Does Not Ask For Is Not Offered`. It runs `advisor_recommend` on the six prompts of the Measured Behavior block and checks the first recommendation's `command`: none on the refusal, the question, the no-edit request and the in-place typo fix, and `/create:readme` with `start` on the plain request.
- **CL-009** `cli-hooks-and-plugin/brief-command-policy-word.md`, `The Brief's Command Policy Word in a Parent and a Child Session`. It pipes two prompts into the Claude hook's compiled entry with `AI_SESSION_CHILD` set to 0 and then 1. It pins `Also: /doctor:git setup (run)` in both sessions, because a read-only `run` command is never downgraded, and `→ /doctor:update (ask)` against `→ /doctor:update (parent-named only)`.
- **CL-010** `cli-hooks-and-plugin/vibe-command-documents.md`, `The Vibe Brief Names Each Command's Document`. It calls `buildAdvisorPart` from the Vibe hook with `AI_SESSION_CHILD` unset and pins the `Command documents (read in full before taking one): /create:readme is .skilled/commands/create/readme.md.` line under the head.

Each follows `sk-create-manual-testing-playbook` (its `SKILL.md`, the scenario template under `assets/` and `references/prompt-voice.md`), mirrors NC-011's section shape and frontmatter, stores evidence under `/tmp/skill-advisor-playbook` as NC-011 does, and runs each hook with `TMPDIR` and `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` in a temporary folder it removes. The root playbook gains the three rows, the census moves from 50 to 53 at lines 36, 40 and 133, and the census test's three pins move with it.

**Why.** The probes show each surface answers differently: the gates in the recommendation JSON, the policy word in the rendered Claude brief and the document line only in the Vibe hook. CL-002 and CL-004 stay unused, because the root names them as missing ids. The companion line with `(parent-named only)` has no live prompt yet: the observed companion is a read-only `run` command. T007 probes for a prompt whose companion is a mutating doctor command, and when none renders, it pins the head label and records that on its task line.

### Decision D5: one probe per task, each behind the floors

| Probe | Decision | Phrases added to `intent_signals` | Paraphrase reported, not gated |
|-------|----------|-----------------------------------|--------------------------------|
| P01 | Declined | None | None |
| P02 | Tune, `SAD/graph-metadata.json` (T009) | `vibe prompt advisor`, `not offering a skill` | `my vibe session never shows the advisor brief` |
| P04 | Tune, same file (T011) | `local fallback scorer`, `prompt hook health` | `how often did the prompt hook fall back to the local scorer` |
| P11 | Tune, same file (T013) | `command transcripts`, `workflow measure` | `measure which workflow my behaviour runs loaded from their transcripts` |
| P07 | Tune, `.skilled/skills/system-skilled-doctor/graph-metadata.json` (T015) | `does not appear in my tool list`, `missing from my tool list` | `my formatter tool never shows in the tool list` |

**P01 declined.** The prompt asks to wire the advisor into the Vibe runtime. That wiring is `.vibe/hooks.toml` and the turn-start hook, which the cli-mistral-vibe packet owns, and the operator keeps the Vibe gaps with packet 004. The advisor already ranks second at 0.845. Lifting it above 0.95 needs a Vibe boost in the advisor's metadata that would pull Vibe runtime prompts away from their owner.

**Procedure.** Each tune task saves the metadata file and `scripts/skill-graph.json` to `scratch/rollback/<task>/`, runs the probe and sees it miss, appends its two phrases at the end of the `intent_signals` array and changes nothing else, then runs `COMPILE`, `RESCAN`, the probe and the paraphrase. Its coordinator gate (T010, T012, T014, T016) runs `FLOOR` and `EVAL` and compares them with `cmp` against the before files. When either moves, the gate copies the saved files back, runs `COMPILE` and `RESCAN` again, writes the moved lines into `scratch/probe-decisions.txt` and the parent goal log, and the probe is declined with those numbers.

**Why.** The floors read committed metadata directly, while the CLI probe reads the SQLite index, so an edit needs both `COMPILE` and `RESCAN`. CI's `skill-graph-freshness.cjs --strict` fails when the compiled graph lags its sources, and `ci-skill-derived-freshness.cjs` reads the `derived` block, so only the authored `intent_signals` change. One probe per task keeps a floor move attributable. The phrases name each skill's own surface and come only from the probes and the skill docs. No task reads a sealed or fresh row, and any lift on a sealed row shows as a moved holdout count and reverts the change. The probe passes only on the top `skillId`, as `run-probes.cjs:97-99` compares it, so P07 needs the doctor skill itself first.

**Rejected.** A change to the doctor helper's cue list in scorer code for P07. The dispatch asks for metadata, and the helper ranker returning no candidate is a separate gap.

### Decision D6: battery rows are judged on two extracts

**Decision.** T002 runs `EXTRACT` on the merge base `28a6d40f81f` and on `origin/main`, records the hash `origin/main` resolved to, and rebuilds the two gitignored `dist` folders for BAT-01. A row is pre-existing when the merge base fails it and `G diff --quiet 28a6d40f81f -- <its files>` exits 0. A row the branch fails while both extracts pass becomes a new lane task.

**Why.** Main fixed BAT-02, BAT-06 and BAT-07 after the last catch-up merge, so a check on `origin/main` alone would call them branch-caused (spec A4). An extract has no `node_modules` and no built shared package, so `extract-check.sh` links them in and the result is read from the package line, never the exit code.

### Data Flow
A reader types a prompt. The advisor scores it against the SQLite skill graph built from each skill's `graph-metadata.json`, attaches a command only when the prompt does not refuse or ask about it, and renders the brief with a policy word that a child session downgrades. On Vibe the hook adds the command document line. CI checks each runtime's generated mirrors, now Vibe's too, and the command-reference validator checks every runtime folder a command asset names.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

No review Planning Packet applies. The findings come from RUN's `findings.json`, read as inert data, and every row below was read in the code or run by this planner.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `validate-command-references.cjs` `RUNTIME_DIR_ALLOWLIST` (`:46`) | Rejects a phantom runtime folder | update (T003) | `--self-test` real tree line, plain run exit 0 |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:160` | Names `.vibe/agents/` | unchanged, now accepted | The validator run |
| `command-tree-parity.yml` `dsh-mirror` job, path lists (`:19`, `:45`, `:143-148`) | DSH mirror checks | update (T004) | `actionlint`, `rg -c`, the lines run by hand |
| `spec-kit-check.yml` mirror parity step (`:321-332`) | Nine mirror checks | update (T004) | Same |
| `.github/workflows/README.md:30` | Describes `command-tree-parity.yml` | update (T004) | `rg -c` |
| `.vibe/SYNC.md:115` | Says no CI job names a Vibe generator | not changed here, handed back to packet 004 | `scratch/handback.md` |
| `ADV/lib/command-attach.ts` `commandOnlyMentioned`, `typedCommandForTop`, `attachCommand` | Decide the offer | unchanged by the operator's answer | `G diff --quiet BASE -- $ADV/lib` (T020) |
| `SAD/changelog/v1.1.0.0.md:45`, `:134`, `:136`, `SAD/feature-catalog/cli-surface/advisor-recommend.md:41` | State the offer rule | update (T005) | `rg -c 'only mentions'` prints nothing |
| `ADV/tests/command-attach-guards.vitest.ts:138` | A describe title that says `only mentions` | unchanged: a test title, its cases read the leads | `VALL` |
| `PB/manual-testing-playbook.md`, `ADV/tests/manual-testing-playbook.vitest.ts` | Census and index | update (T006 to T008) | The census test and `PBV` |
| `SAD/graph-metadata.json`, `.skilled/skills/system-skilled-doctor/graph-metadata.json` `intent_signals` | Routing phrases | update (T009, T011, T013, T015) | The probes, `META`, floors |
| `ADV/scripts/skill-graph.json` | Compiled graph CI checks | update by `COMPILE` | `skill-graph-freshness.cjs --strict` |
| `ADV/database/skill-graph.sqlite` | The index the CLI reads | rescanned, gitignored | The CLI probes |
| `RAD/command-routing-baseline.json`, `RAD/scorer-eval-baseline.json` | Committed baselines | unchanged | `G diff --quiet BASE` (T020) |
| `.skilled/skills/system-spec-kit/runtime/dist`, `runtime/cli/dist` | Gitignored builds | rebuilt (T002) | `npm run check` exit 0 |

Required inventories:
- Same-class producers: `rg -n "RUNTIME_DIR_ALLOWLIST|AGENT_DIRS" .skilled --glob '!**/node_modules/**'` and `rg -n "sync-(prompts|agents|skills)-dsh" .github/workflows` list every runtime folder list and DSH check line this phase mirrors.
- Consumers of changed symbols: `rg -n "only mentions|mention is not a request" -i .skilled README.md --glob '*.md'` is read at close.
- Matrix axes: D-01 the self-test's three lines. X-01 two workflows by check lines and filter lines. B-S4-01 three scenarios by their pinned lines. PRB five probes by kept or declined.
- Algorithm invariant: the floors and eval are byte-equal after every metadata change that is kept.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep <n>` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and checks that ten archives become three. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the before-state and the matrix, then proves the battery rows and rebuilds `dist`. Implementation runs four lanes: lane V the validator then CI, lane D the two docs, lane P the three scenarios, and lane R the four probes, each followed by a coordinator floor gate. Verification runs every gate, compares the floors, reruns the matrix, checks the boundaries, commits, gets one Opus review, runs the recheck and closes the phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The validator allowlist and the playbook census | `--self-test`, `VX tests/manual-testing-playbook.vitest.ts` |
| Integration | The CI lines, the scenarios' commands, the routing probes, the floors and eval, the full advisor suite and the doctor tests | `actionlint`, `PBV`, the advisor CLI, `FLOOR`, `EVAL`, `VALL`, `DT` |
| Manual | `MATRIX` prints every built line changed, and `EXTRACT` reads each battery row on the merge base and on main | The two planning probes |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 030 closed and committed | Internal | Complete | T001 stops the phase |
| RUN on disk | Internal | Present, 5 runs in its root | The recheck has nothing to read |
| `origin/main` moving | Internal | Read at T002 | A new hash changes what the extract shows, so T002 records it |
| `actionlint`, `jq`, `rg`, `zsh`, `python3` | Tool | Present | T004 or a probe cannot run |
| DeepSeek v4.1 flash max on OpenCode Go, an Opus verifier per task and one Opus reviewer | External | Named in the dispatch | A lane waits for its worker |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A floor or eval line moves, a suite goes red, a CI line fails on a clean runner or a scenario's pinned line stops showing.
- **Procedure**: A probe change reverts by copying back `scratch/rollback/<task>/`, then `COMPILE` and `RESCAN`. Before the fix commit, a lane's other changes are discarded file by file. After it, revert the fix commit as a whole, then run `COMPILE` and `RESCAN` so the SQLite index follows the restored metadata.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup (T001, T002) ──► lane V T003 ──► T004 ─────────────────────────────┐
                   ├─► lane D T005 ──────────────────────────────────────┤
                   ├─► lane P T006 ──► T007 ──► T008 ────────────────────┤
                   └─► lane R T009 ► T010[C] ► T011 ► T012[C] ► T013 ► T014[C] ► T015 ► T016[C]
──► Verification T017 gates ► T018 floors ► T019 matrix ► T020 boundaries ► T021 commit ► T022 review ► T023 recheck ► T024 close
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 030 committed | Implementation |
| Implementation | Setup. Each lane P task follows the one before it, because each moves the same census lines. Each lane R task follows the gate before it, so a floor move has one cause | Verification |
| Verification | Every lane ended and no worker session open for `VALL` | Close |
<!-- /ANCHOR:phase-deps -->

---
