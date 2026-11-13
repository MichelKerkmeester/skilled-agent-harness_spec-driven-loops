---
title: "Feature Specification: Phase 10: reachability-and-attribution"
description: "The behaviour harness cannot tell a declined command from one that was never offered, and two runtimes cannot receive the advisor brief on a normal install. This phase records the offer and the brief on every run line, makes the scorer report an attributable rate, adds the Codex and DSH install steps with read-only doctor checks and measures the cold first prompt before changing it."
trigger_phrases:
  - "reachability and attribution"
  - "phase 10 reachability and attribution"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: reachability-and-attribution

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-ux-performance-cross-cli-research |
| **Successor** | None |
| **Handoff Criteria** | Every run line carries `offeredCommand`, `offeredPolicy` and `briefDelivered`, the before arm has them by backfill, the scorer prints an attributable rate per runtime and arm and the Codex, DSH and hook-wiring checks run read-only |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the build that makes the skill advisor surface every tracked slash command with a run-or-ask policy (`../spec.md`). It builds ranks 1 to 6 and rank 10 of the research in `../009-ux-performance-cross-cli-research/research/research.md` section 9, with their evidence in sections 3 to 7.

**Scope Boundary**: The measuring harness of phase 007 (the runner and the scorer), the install guide, two new read-only doctor check scripts and the routes that call them, the DSH prompt advisor default and, only when a measurement shows a fail-open, the session-start warm-up and the cascade probe timeout. The brief text, the scorer weights and `AGENTS.md` stay as they are.

**Dependencies**:
- Phase 007 built the runner and the scorer and is still growing its before arm. This phase changes what the scorer prints, so its before numbers are recorded first.
- Phase 005 adds the policy to the brief head. Until it lands, `offeredPolicy` is null on every line, because the head carries no policy.
- The before arm stays where phase 007 wrote it. The backfill writes a new file in this phase's `scratch/` and never edits the original.

**Deliverables**:
- Three fields on every run line and a backfill mode that adds them to an existing log.
- A scorer summary that reports offered and started counts, keeps capped runs apart, flags an incomplete arm and counts starts and writes per policy.
- An argued doctor route that resolves to its command document.
- Install-guide steps for Codex hook approval and for DSH, a Codex approval check, a hook-wiring check and the DSH advisor on when its row flag is absent.
- A measured cold first prompt, and the warm-up and probe timeout only if that measurement shows a fail-open.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The before arm reports Codex at 0 of 12 started rows, but no Codex transcript in that arm carries an advisor brief, because Codex runs a project hook only after per-entry approval and the install guide never says so. A run line records the locator, the exit and the changed paths and nothing about what the advisor offered, so "declined" and "never offered" are one number. The scorer counts capped runs inside the start denominator and looks up `/doctor:git hooks` as `doctor/git hooks.md`, a file that cannot exist. DSH is absent from the install guide, and an existing target-repository hook file silently keeps its own content without the prompt hook.

### Purpose
A before-and-after start rate becomes evidence: each run says whether a brief reached the model and which command it offered, and each runtime that can receive a brief on a normal install does.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Every command ran from the repository root of the worktree on 2026-11-12 between 23:24Z and 23:31Z at commit `49281dd652`. The output is verbatim. In the two commands that loop over the run log, its path is shortened to `runs-pre.jsonl`. The before arm was still growing during the run (141 lines at the first read, 143 at the last).

```text
$ git rev-parse --short HEAD
49281dd652
$ node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs | jq -c '.metrics.typed_recall_at_1, .metrics.false_offer'
{"correct":24,"total":44}
{"count":0,"total":35}
$ (cd .skilled/skills/system-skill-advisor/runtime && npm run typecheck >/dev/null 2>&1; echo typecheck_exit=$?)
typecheck_exit=0
$ node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs --summary specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl | grep -v "^    unscored"
claude: 0 unscored
  pre: 24 of 24 scored, start 3 of 12, COMMAND: line 0 of 24, capped 0, unsafe 0, repeated 0, loops without init 0 of 0
codex: 0 unscored
  pre: 24 of 24 scored, start 0 of 12, COMMAND: line 0 of 24, capped 0, unsafe 0, repeated 0, loops without init 0 of 0
pi: 0 unscored
  pre: 24 of 24 scored, start 0 of 12, COMMAND: line 0 of 24, capped 2, unsafe 3, repeated 0, loops without init 0 of 0
devin: 0 unscored
  pre: 24 of 24 scored, start 3 of 12, COMMAND: line 0 of 24, capped 6, unsafe 3, repeated 0, loops without init 0 of 1
opencode: 0 unscored
  pre: 24 of 24 scored, start 5 of 12, COMMAND: line 0 of 24, capped 7, unsafe 2, repeated 0, loops without init 0 of 0
dsh: 0 unscored
  pre: 22 of 22 scored, start 5 of 12, COMMAND: line 1 of 22, capped 0, unsafe 0, repeated 0, loops without init 1 of 1
$ jq -c 'keys' specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl | sort | uniq -c
 143 ["arm","changedPaths","exit","locator","restored","rowId","runtime"]
$ for r in claude codex; do n=0; t=0; for p in $(jq -r "select(.runtime==\"$r\") | .locator.transcriptPath // empty" runs-pre.jsonl); do t=$((t+1)); grep -q "Advisor: " "$p" && n=$((n+1)); done; echo "$r $n of $t transcripts contain Advisor:"; done
claude 24 of 24 transcripts contain Advisor:
codex 0 of 24 transcripts contain Advisor:
$ node <scratchpad>/brief-count.mjs .skilled/hooks/shared/session-readers/index.mjs runs-pre.jsonl
{"claude":{"brief":0,"loaded":24,"runs":24},"codex":{"brief":0,"loaded":24,"runs":24},"pi":{"brief":24,"loaded":24,"runs":24},"devin":{"brief":0,"loaded":24,"runs":24},"opencode":{"brief":0,"loaded":24,"runs":24},"dsh":{"brief":1,"loaded":23,"runs":23}}
$ rg -n "trusted_hash" .codex/README.md
54:2. Approve the hooks. Codex runs a project hook only after you approve that exact entry. Open `/hooks` in an interactive session and approve each entry it lists for review. The approval is stored as a `trusted_hash` in `~/.codex/config.toml`, so a changed entry needs approving again.
$ rg -c "trusted_hash" INSTALL-SKILLED.md
$ grep -ci dsh INSTALL-SKILLED.md
0
$ rg -n "promptAdvisor" .dsh/plugins/repo-guards/index.mjs .dsh/patches/guards.patch.yml
.dsh/plugins/repo-guards/index.mjs:53:  registerPromptAdvisor(ctx, { enabled: options.promptAdvisor === true });
.dsh/patches/guards.patch.yml:6:          promptAdvisor: true
$ rg -n "lineage.patch.yml" .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs
242:      resolve(DSH_PATCH_DIR, 'lineage.patch.yml'),
$ (cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/command-transcript-score.vitest.ts | tail -4 | head -2)
 Test Files  1 passed (1)
      Tests  44 passed (44)
```

`rg -c "trusted_hash" INSTALL-SKILLED.md` printed nothing. The `brief-count.mjs` probe loads each logged session through the shared readers and tests the normalized records for `/Advisor: [a-z]+[;. ]/`. It printed counts only and no prompt text. No holdout row was read. A read of the section headers of `~/.codex/config.toml`, values redacted, showed approvals stored as `[hooks.state."<checkout>/.codex/hooks.json:<event>:<group>:<index>"]` tables, each with one `trusted_hash` key.

### Research Claims Checked in Code
Each line names the claim from `research.md`, the verdict and the code that decides it.
- Codex runs a project hook only after per-entry approval, and the install guide has no such step. Confirmed: `.codex/README.md:54`, and the empty `rg` above.
- Codex in the before arm had no brief. Confirmed: 0 of 24 raw Codex transcripts carry `Advisor: ` against 24 of 24 for Claude.
- DSH's prompt advisor runs only when its row flag is `true`. Confirmed: `.dsh/plugins/repo-guards/index.mjs:53`.
- DSH is "off by default" on a normal run. Refuted: `.dsh/patches/guards.patch.yml:6` sets the flag `true` in every composition that loads the bundle. The arm's DSH rows had no brief because the runner passes the lineage patch (`run-command-behaviour.mjs:242`) and the adapter skips a lineage leaf (`.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:160`). A default-on flag does not change the arm.
- DSH is absent from the install guide. Confirmed: `grep -ci dsh` prints 0, and `INSTALL-SKILLED.md:57` names six runtimes.
- No artifact records an offer. Confirmed: a run line is built at `run-command-behaviour.mjs:1062-1069` with no offer field, and the 143 lines hold seven keys.
- Capped runs sit in the start denominator. Confirmed: `score-command-transcripts.mjs:1157-1158` count `startRows` and `capped` independently.
- `/doctor:git hooks` is looked up as `doctor/git hooks.md`. Confirmed: `commandParts` keeps everything after the first colon as the name (`score-command-transcripts.mjs:449-454`) and `documentTails` appends `.md` to it (`:468-471`).
- An existing target hook file is kept and never receives the prompt entry. Confirmed: `planMergeTree` links only a missing child (`symlink-engine.cjs:868`) and descends only into a directory (`:884`), so an existing real file is left alone.
- Cold-start bounds are inverted on Claude. Confirmed: the cascade probe defaults to 2,500 ms (`.skilled/skills/system-spec-kit/shared/embeddings/auto-select.ts:116-119`), the CLI waits up to 5,000 ms for a cold daemon (`skill-advisor-cli.ts:34`), the shim kills its child at 2,500 ms (`.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:20`) and the host timeout is 3 s (`.claude/settings.json`, `UserPromptSubmit` timeout 3).
- A detached `advisor_status --warm-only` at session start warms the daemon. Refuted: `--warm-only` suppresses a cold spawn (`skill-advisor-cli.ts:411`), so a warm-up must pass `--no-warm-only`.
- `/doctor:setup` reports SKIP when the daemon is cold. Confirmed: `.skilled/commands/doctor/assets/doctor-setup.yaml:57`.
- The session-start hook files are generated. Confirmed: the `_note` of `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` names `sync-hook-registrations.cjs` as the writer of `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json`.
- Whether a first prompt in a fresh session fails open in practice. UNKNOWN: no measurement exists. Task T003 measures it, and T024 to T026 are dropped if it shows none.
- Whether each checkout gets its own advisor daemon, which the backfill relies on. UNKNOWN: the socket key was not found in a first read. Task T002 confirms it, and T016 carries a fallback if it is refuted.

### What Already Exists
- The runner's dataset guard refuses a holdout row before it can run (`findRow` in `run-command-behaviour.mjs`), and the scorer marks a holdout label and never opens it.
- The scorer exports its facts for tests and runs its CLI only as the entry point, so another script can import it. The runner runs its CLI on import, so it cannot be imported.
- The shared session readers load every runtime's stored session. They drop Claude's hook attachments, so the brief is visible in Claude's raw transcript (`attachment.type` `hook_additional_context`, `attachment.hookEvent` `UserPromptSubmit`) and in Pi's normalized records.
- `/doctor:runtime-mirrors` already reads `~/.codex/hooks.json` read-only through `install-codex-hooks.mjs --check`.

### What Is Missing
- The offer, its policy and brief delivery on a run line, and a way to add them to the finished before arm.
- An attributable scorer summary and a working argued-route lookup.
- The Codex approval step, the DSH listing, a Codex approval check and a hook-wiring check.
- A cold-start measurement.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Attribution (ranks 2, 3 and 10): the run-line fields, the backfill mode, the attributable summary and the argued-route lookup.
- Reachability (ranks 1, 5 and 6): the Codex install step and approval check, the DSH listing and default, and the hook-wiring check.
- Cold start (rank 4): the measurement first, then the warm-up and the probe timeout only on a measured fail-open.

### Out of Scope
- Ranks 7, 8, 9, 11, 12, 13 and 14. The research places them after the after arm, because only that arm shows which runtimes still decline.
- Any reword of the Gate 2 bullet in `AGENTS.md`. Phase 006 froze it.
- Renaming `.skilled/commands/create/skill.md`. Decision Q025, as the research reads it, rules it out.
- Any write to a home-folder config, including `~/.codex/config.toml` and `~/.codex/hooks.json`. The Codex check only reads.
- Installing anything.
- The hook diagnostic record in `runtime/lib/metrics.ts` that rank 2 also names. The run line carries the offer, which is what the scorer reads.
- Changing the runner's DSH composition. The lineage patch stops a goal driver from holding an idle headless agent, so DSH arm rows keep no brief and read `briefDelivered` `unknown`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `ADV/scripts/routing-accuracy/command-offer.mjs` | Create | `parseOffer`, `replayOffer`, `briefDelivered` and `backfillRunLog`, importable by the runner and by tests |
| `ADV/tests/command-offer.vitest.ts` | Create | Fixture tests for the four functions |
| `ADV/scripts/routing-accuracy/run-command-behaviour.mjs` | Modify | Three fields per run line and the `--backfill` mode |
| `ADV/scripts/routing-accuracy/score-command-transcripts.mjs` | Modify | Argued route, capped apart, offered counts, incomplete arm, per-policy counts |
| `ADV/tests/command-transcript-score.vitest.ts` | Modify | One case per scorer change |
| `ADV/scripts/routing-accuracy/README.md` | Modify | The new fields, the mode and the summary keys |
| `INSTALL-SKILLED.md` | Modify | The Codex approval step and DSH |
| `.dsh/plugins/repo-guards/index.mjs`, `tests/bundle.test.mjs`, `README.md` | Modify | The advisor on unless its flag is `false` |
| `.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs` and its test | Create | Read-only Codex approval check |
| `.skilled/commands/doctor/scripts/hook-wiring-check.cjs` and its test | Create | Read-only prompt-hook wiring check for a target repository |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml`, `doctor-symlink-check.yaml` | Modify | Call the two checks |
| `.skilled/commands/doctor/scripts/README.markdown` | Modify | List the two checks |
| `hook-registry.json` (then the generated `.claude/settings.json` and `.codex/hooks.json`), `.skilled/bin/system-skill-advisor-launcher.cjs` | Modify | Only on a measured fail-open |

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. The restraint pass for each new file: `command-offer.mjs` exists because the runner cannot be imported, so without it the replay and the backfill have no testable home. Each check script exists because no current script reads the Codex approval table or the target's prompt-hook entries. The warm-up needs no new file: the registry's `background` fallback already detaches a session-start command (`sync-hook-registrations.cjs:96`).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every run line the runner writes carries `offeredCommand` (the first slash command in the replayed brief head, or null), `offeredPolicy` (`run`, `start` or `ask` right after it, or null) and `briefDelivered` (`true`, `false` or `"unknown"`). |
| REQ-002 | `run-command-behaviour.mjs --backfill <log> --out <new-log>` writes every input line with the three fields and `offerBackfilled: true`, replays the brief inside each line's `locator.projectDir`, refuses when the output path is the input path and refuses a holdout row before it writes anything. A fixture test covers each case. |
| REQ-003 | The scorer summary reports, per runtime and arm, `offered` (uncapped start rows whose line offered the row's expected command), `startedOfOffered` and `offerUnknown` (start rows whose line has no offer field), and the text line prints `offered X, started Y of X`. |
| REQ-004 | Capped runs leave the start denominator: `startRate` counts uncapped start rows only, and `cappedStartRows` counts the rest. |
| REQ-005 | An arm whose runtime has fewer runs than the largest runtime in the same arm carries `armIncomplete: true`, and the text line ends with `arm incomplete`. |
| REQ-006 | `byPolicy` holds `run`, `start` and `ask`, each with `rows`, `capped`, `started` and `wrote`, where `wrote` means the line lists at least one changed path. |
| REQ-007 | `/doctor:git hooks` resolves to the `doctor/git.md` document, so a run that read it before writing scores `started: true`. |
| REQ-012 | The floors hold: the command capture prints `{"correct":24,"total":44}` and `{"count":0,"total":35}`, `npm run typecheck` in `ADV` exits 0, `AGENTS.md` and `.skilled/commands/create/` are unchanged and no added code comment names a spec path, phase, task, ADR or REQ id. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | `INSTALL-SKILLED.md` tells a Codex user to approve the project hooks through `/hooks`, and `codex-hook-approval-check.cjs --root <dir>` prints `PASS codex-hooks-approved` when the advisor's prompt entry has a `trusted_hash` and `WARN codex-hooks-unapproved` otherwise. It reads `${CODEX_HOME:-~/.codex}/config.toml` and writes nothing. `/doctor:runtime-mirrors` runs it as a warning row. |
| REQ-009 | `INSTALL-SKILLED.md` names DSH at least twice, the bundle registers the prompt advisor unless its flag is `false`, and the bundle test and README say so. |
| REQ-010 | `hook-wiring-check.cjs --root <dir>` exits 1 and prints `hook-missing <runtime>` for each of claude, codex, cursor and devin whose folder exists in the root while its hook file lacks the prompt entry, and exits 0 when every present runtime is wired. `/doctor:symlink check` runs it and reports a missing hook as a warning. |
| REQ-011 | A cold first prompt is measured five times with a sandboxed socket directory, and the result records how many failed open. |
| REQ-013 | Only when REQ-011 shows a fail-open: a session-start warm-up for Claude and Codex, added in `hook-registry.json` and regenerated by `sync-hook-registrations.cjs`, and a 750 ms cascade probe default in the launcher. A rerun of the measurement with the warm-up shows 0 fail-opens of 5. When REQ-011 shows none, its tasks are marked dropped with the measured numbers. |
| REQ-014 | The routing-accuracy README and the doctor scripts README describe the new fields, mode, summary keys and check scripts. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The backfilled before arm in `scratch/runs-pre-attributed.jsonl` has as many lines as its input, and every Codex line reads `briefDelivered` other than `true`.
- **SC-002**: `score-command-transcripts.mjs --summary` prints `offered X, started Y of X` for every runtime and arm, and flags DSH's arm as incomplete while it holds fewer rows than the others.
- **SC-003**: On a Codex arena after approval, the check prints `PASS codex-hooks-approved` and one smoke rollout contains `Advisor: `.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 007's before arm is still growing | A changed summary meaning mid-arm confuses its numbers | T001 records the old-meaning summary first, and no scorer task starts before the coordinator confirms the arm is done |
| Dependency | Phase 005 adds the policy to the head | `offeredPolicy` stays null until then | REQ-001 allows null, and the after arm runs on 005's code |
| Risk | The replay is not the turn's own brief | Med: a cache or a cold daemon makes them differ | The replay runs after the turn, against the same checkout, and is labelled a replay in the README |
| Risk | The replay answers from another checkout's daemon | High: the offer would describe the wrong code | T002 confirms the socket key, and T017 isolates the socket directory if it is shared |
| Risk | A new Codex hook entry shifts approval keys | Med: an approved entry reads unapproved | T024 adds the warm-up as the last slot of Codex's first SessionStart group, so existing `<group>:<index>` keys keep their place |
| Risk | The warm-up holds session start or outlives the session | Low: the daemon already idles out | The registry's `background` fallback detaches the call, and T003 stops only a process that names its own sandbox |
| Risk | A doctor contract test pins workflow text | Med: a new step breaks the contract suite | T014 and T015 keep the existing invariant phrases, and their verify runs the contract tests |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The replay adds one hook process per run line after the turn ends, so the turn's own timing is unchanged.

### Security
- **NFR-S01**: The two check scripts and the backfill write no file in the home folder. The Codex check reads one config file and prints no hash value.
- **NFR-S02**: No task reads or prints holdout prompt text. The backfill refuses a holdout row id through the runner's own lookup.

### Reliability
- **NFR-R01**: A replay that times out or prints no head yields null offer fields with an `offerError` code, never a crash.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a run log with no lines makes the backfill write an empty file and exit 0.
- Maximum input: an ambiguous head that names two commands records the first one.
- Failure path: a line with no `locator.projectDir` gets null offer fields and `offerError: 'no_checkout'`, and the rest of the log is still written.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | About 18 files and 900 lines across the harness, two doctor scripts, the DSH bundle and the install guide |
| Risk | 10/25 | No scoring or brief change, and a measurement output that changes meaning |
| Research | 6/20 | The research names each change, and the code read is done |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

### Resolved

Each answer below is an autonomous decision under the packet goal's D1 ("Run autonomously and ask the operator nothing. Take the recommended option"), recorded on 2026-11-13.

- How is the offer decided? Decision: replay the Claude prompt hook inside the run's checkout and read the first line of its brief (Recommended). The renderer is shared by every runtime today, so one replay stands for all six, and the head is what the model saw. Reading the recommendation JSON instead would count a hub's attached command that the pre-005 head never printed.
- When does the replay run? Decision: after the turn and its restore (Recommended), so the replay cannot warm the daemon for the turn it describes or add a changed path to it.
- How is `briefDelivered` decided? Decision: `true` or `false` only where the stored session shows the brief (Claude's raw transcript and Pi's records), and `"unknown"` for Codex, Devin, OpenCode and DSH (Recommended). Codex joins the decided set only after T031 shows a delivered brief in a rollout (T032).
- Which checkout does the backfill ask? Decision: each line's own `locator.projectDir` (Recommended). The before arm's lines already name their arena, so no extra flag is needed.
- What counts as "offered" in the summary? Decision: the line's `offeredCommand` names the row's expected command by namespace and name (Recommended).
- What is the size of the set for `arm incomplete`? Decision: the largest run count of any runtime in the same arm (Recommended). The scorer cannot import the runner's sets, and a new flag would duplicate them.
- What does `wrote` mean? Decision: the run line lists at least one changed path (Recommended). The runner observed it in git, which is stronger than a transcript event.
- Where does the Codex check run? Decision: a new script called from `/doctor:runtime-mirrors` (Recommended), the route the research names and the one that already reads `~/.codex/hooks.json`.
- Is the DSH default change still worth building after the refutation? Decision: yes, as asked (Recommended), with the gain stated as small. Only a patch that omits the flag benefits, and the arm does not change.
- The workflow's step 5 explorer agents, its `research/research.md` output and its step 6 continuity save. Decision: skipped (Recommended). The claims were read in code directly, the research exists in phase 009 and the spec authoring card forbids `generate-context.js` in a planning worker.
- The level helper. Decision: Level 2 as the brief states (Recommended).
- `implementation-summary.md`. Decision: not scaffolded now (Recommended). It is written by the last task, as the card says.

### Open

None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Research**: `../009-ux-performance-cross-cli-research/research/research.md`
