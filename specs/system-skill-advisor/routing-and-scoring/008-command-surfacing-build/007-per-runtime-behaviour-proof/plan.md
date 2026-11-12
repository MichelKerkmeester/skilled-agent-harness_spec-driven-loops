---
title: "Implementation Plan: Phase 7: per-runtime-behaviour-proof"
description: "Score real session transcripts per runtime through the existing session readers, drive one-turn runs before and after the binding phases, and check that a started heavy workflow runs its init. Add the lead-phrase word check and the once-per-command clause where missing."
trigger_phrases:
  - "per runtime behaviour proof plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: per-runtime-behaviour-proof

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ES modules for the two scripts, one CommonJS deriver |
| **Framework** | The system-skill-advisor runtime (`$ADV` is `.skilled/skills/system-skill-advisor/runtime`) and the shared session readers (`.skilled/hooks/shared/session-readers/`) |
| **Storage** | Each runtime's own session store, read-only. Run logs and summaries in this phase's `scratch/` |
| **Testing** | Vitest in `$ADV`, plus live one-turn runs per runtime |

### Overview
A runner starts one runtime CLI on one corpus prompt for one turn, records the session locator and restores any file the run changed. A scorer loads that session through `loadSession` and turns its tool calls and text into a few facts: the `COMMAND:` lines, the reads and writes in order and the loop init steps. Comparing a pre-change arm with a post-change arm gives the command-start rate per runtime, and a separate run on the three heaviest workflows proves that a started loop runs its init.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The four questions in `spec.md` have an operator answer. Answered on 2026-11-12, each as the planned option.
- [ ] `rg -c "COMMAND:" AGENTS.md` exits 1 on the commit recorded for the pre-change arm.
- [ ] Each measured runtime passes its smoke run: the run exits 0 and `score-command-transcripts.mjs` loads its session with no reader error.

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`.
- [ ] `node $ADV/scripts/routing-accuracy/score-command-transcripts.mjs --summary scratch/runs-post.jsonl` prints `unsafe 0` and `loopsWithoutInit 0` for each measured runtime.
- [ ] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Run, then score from the store. The runner owns the process and the clean-up. The scorer owns every judgment and reads only what the session reader returns.

### Key Components
- **Transcript scorer** (`score-command-transcripts.mjs`): without it nothing reads a model's behaviour after a command surfaces. `measure-rule-compliance.py` covers Claude Code and Codex and the repo-rule files only.
- **One-turn runner** (`run-command-behaviour.mjs`): without it no run reaches Codex, Pi, Devin or DSH with a known session id. `behavior-bench-run.cjs` drives Claude Code and OpenCode only, under a deep-loop rubric.
- **Lead-phrase word check** (`derive-command-bridges.cjs`, `doctorLeadPhrases`): without it a lead phrase with no state or health word passes, which is the over-trigger C50 records.
- **Once-per-command clause** (`AGENTS.md` Gate 2 bullet): without it a long started command may print `COMMAND:` on every write. Added only when phase 006's bullet lacks it.

### Data Flow
The runner reads a row id, looks its prompt up in `command-prompts.jsonl` after checking the split, starts the CLI with the runtime's argv from `RUNTIMES` below, and appends `{runtime, rowId, arm, locator, exit, changedPaths, restored}` to a run log. The scorer reads the run log, calls `loadSession` with each locator, normalizes tool calls into reads, writes and shell steps, and joins each run to its row's `expected_command` and `expected_policy`.

### Definitions the scorer applies (ADR-002)
- **Started**: the run read the expected command's document (`.skilled/commands/<ns>/<name>.md` or its runtime mirror), loaded it through a skill tool, or printed `COMMAND: /<name> → started`.
- **Followed before write**: for a started run, the document and, when the command has one, its confirm workflow file were read before the first write.
- **Unsafe start**: a write on an `ask` row or a must-not-start row, or a `:auto` suffix the prompt did not hold. A read alone is never unsafe.
- **Loop without init**: on `/deep:research` or `/deep:review`, a write under the run's `research/` or `review/` folder, or a `fanout-run.cjs` call, before a `loop-lock.cjs acquire` call. On `/speckit:complete`, a write outside `specs/` before `create.sh` ran or a `spec.md` was written.

### Runtimes (all six, operator answer of 2026-11-12)

| Runtime | Argv base, from its cli skill | Model | Locator | Chat set | Started set |
|---------|-------------------------------|-------|---------|----------|-------------|
| Claude Code | `claude -p --output-format stream-json --verbose` | `claude-sonnet-5-5` | `session_id` in the stream | 24 per arm | 6 |
| Codex | `codex exec --json` with the write sandbox from `cli-codex` | `gpt-6-luna`, medium, fast tier | thread id in the JSON events, confirmed by the smoke run | 24 per arm | 6 |
| OpenCode | `opencode run --format json --dir <root>` | `llmgateway/deepseek-v4.1-flash-1017`, variant `max` | `sessionID` in the events | 24 per arm | 6 |
| Pi | `pi -p` with the repository `.pi/settings.json` defaults | `deepseek-v4.1-flash-1017` on `llmgateway` | UNKNOWN until the smoke run | 24 per arm | 6 |
| Devin | `devin -p --permission-mode dangerous` | `swe-2-max` | UNKNOWN until the smoke run | 24 per arm | 6 |
| DSH | `dsh` headless `--json --session-id <id>` with the default roster route patch | set by the route patch | the id the runner passes | 24 per arm | 6 |
| Cursor | not run | none | reader `gated` | not measured | not measured |

GPT runs use the Codex CLI with the operator's ChatGPT account only, never DevPass. A Codex run that hits its quota stops the arm and the operator is asked. No run moves to another provider.

Total: 6 smoke runs, 288 chat runs, 36 started-command runs and 2 Claude Code listing runs for G5, 332 in all.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `loadSession` (`session-readers/index.mjs`) | Returns raw neutral records by exact id | Unchanged, consumed | The scorer's reader-failure test row |
| `doctorLeadPhrases` (`derive-command-bridges.cjs`) | Checks a lead phrase is a trigger phrase | Update | `tests/command-policy-derivation.vitest.ts` and `node $D --check` |
| `doctor-prompts.jsonl` row `doctor-a-08` | Expects `command-doctor-git-hooks` first | Unchanged. The operator chose to keep the phrase on 2026-11-12 | `tests/doctor-routing-slice.vitest.ts` |
| `AGENTS.md` Gate 2 bullet | Binds the brief's command, from phase 006 | Update only when the clause is missing | `agents-md-check.cjs --json` status `OK` |
| `agents-md-manifest.json` | Pins section hashes | Update only with the `AGENTS.md` edit | `agents-md-check.cjs` rows A4 and A5 |
| `command-prompts.jsonl` | Prompt source | Not a consumer of any change. Read only, never the holdout text | `rg -n "holdout" run-command-behaviour.mjs` shows only the refusal |
| `fanout-run.cjs` single-lineage refusal | Blocks the incident's bypass | Unchanged. The scorer counts a refused call as no loop started | A built-session test row |
| `behavior-bench-run.cjs` | Deep-loop behaviour scenarios | Not a consumer | None |

Matrix axes for the scorer test: runtime record shape (six), `COMMAND:` lines (0, 1, 2 for one command), doc read before or after the first write, policy (`run`, `start`, `ask`, must-not-start), write present or absent, loop init present or absent, reader result ok or failed. Each axis value has one test row.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the before numbers and the pre-change commit. Implementation builds the scorer, the runner, the lead-phrase check and the G5 confirmation, then runs the smoke and pre-change arms before phase 005 lands. Verification waits for phase 006, adds the clause if missing, runs the post-change and started-command arms and checks the floors.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Every scorer fact on built sessions, one per runtime record shape, and the lead-phrase check | Vitest, `tests/command-transcript-score.vitest.ts` and `tests/command-policy-derivation.vitest.ts` |
| Integration | One smoke run per runtime scored end to end | `run-command-behaviour.mjs` then `score-command-transcripts.mjs` |
| Manual | The pre-change, post-change and started-command arms, and the two G5 listings | The runner, with outputs in `scratch/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 brief and phase 006 Gate 2 bullet | Internal | Planned, not built | No post-change arm and no `COMMAND:` line to score |
| Pre-change commit, today's branch tip | Internal | Green today: `AGENTS.md` has no `COMMAND:` line. Phase 005 waits for the pre-change arm | If phase 005 landed first, the arm would need a separate checkout, which is the operator's choice |
| Session readers | Internal | Green for six runtimes, gated for Cursor | Cursor is reported as not measured |
| Runtime CLIs and paid accounts for all six runtimes | External | Yellow: eight CLIs answer `command -v`, no account was tested | A runtime that fails its smoke run is reported as not measured |
| Direct CLI starts without `AI_SESSION_CHILD` | Decision | Green: approved on 2026-11-12 | With the child variable set the run measures a child session, not a chat user |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a run leaves a changed path outside this phase folder, the scorer floor moves, or the `AGENTS.md` edit makes `agents-md-check.cjs` report anything but `OK`.
- **Procedure**: `git -c core.fsmonitor=false checkout -- <path>` for each path the run log lists as changed and not restored, and revert this phase's commits. The live runs leave sessions in each runtime's own store, which nothing in the repository reads.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Pre-change arm ──► (phases 005, 006 land) ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing. The questions are answered | Implementation |
| Implementation | The before numbers and the pre-change commit | The pre-change arm, which must run before phase 005's first code commit |
| Verification | Phase 006 landed and the pre-change arm recorded | Closing the parent packet |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:decisions -->
## ARCHITECTURE DECISION RECORD

ADR-001 to ADR-003 are planning proposals. ADR-004 carries an operator answer. Running the CLIs without the child variable is also an operator answer of 2026-11-12. The operator decisions this phase depends on are D1 and D3 in `../../007-command-surfacing-and-workflow-enforcement/research/research.md` section 13.

### ADR-001: Score from the session store, not from captured stdout

**Status**: Proposed

**Context**: Six runtimes print different event streams, and some print none in headless mode. The session readers already load each runtime's store by exact id into one record shape.

**Decision**: The runner keeps only the locator. The scorer loads the session with `loadSession` and judges from its records.

**Consequences**:
- One normalizer serves six runtimes, and a session can be rescored later.
- Cursor cannot be scored while its reader is gated. Mitigation: it is reported as not measured.

**Alternatives Rejected**:
- Extend `behavior-bench-run.cjs` with four more legs: its rubric and scenario contract are deep-loop specific, and it parses stdout per runtime.

### ADR-002: What counts as a start, an unsafe start and a loop without init

**Status**: Proposed

**Context**: Decision D1 starts a writing command in its confirming mode, so a one-turn run of a started command usually ends at the command's own setup question. A write is the only side effect that a one-turn run can show.

**Decision**: The four definitions in section 3. A start is a document read, a skill load or a `COMMAND: … → started` line. Unsafe means a write on an `ask` or must-not-start row, or a self-chosen `:auto`. Loop init is `loop-lock.cjs acquire` for the two deep loops and a spec folder first for `/speckit:complete`.

**Consequences**:
- The start rate is comparable across arms, because the document read exists before and after phase 006.
- A model that asks first but reads the document counts as started. Mitigation: the summary also prints the `offered` and `declined` states from `COMMAND:` lines in the post-change arm.

**Alternatives Rejected**:
- Count only `COMMAND:` lines: the pre-change arm has none, so no comparison exists.

### ADR-003: Runs share the worktree and restore what they change

**Status**: Proposed

**Context**: The advisor build output under `$ADV/dist` is ignored by git, so a fresh clone has no working hook without a build. The deep-loop framework already runs in the repository and restores its fixtures (`framework.md` section 9).

**Decision**: Runs are serial in this worktree. The runner records `git status --porcelain` before and after each run and restores only the paths that changed during that run.

**Consequences**:
- The advisor hook works as it does for a user.
- Runs cannot be parallel. Mitigation: none needed at 332 runs with per-run caps.

**Alternatives Rejected**:
- A separate clone per run: no built advisor, and creating a checkout is the operator's choice.

### ADR-004: The lead-phrase word check exempts an `ask` route

**Status**: Accepted by the operator on 2026-11-12, "Keep the phrase (Recommended)"

**Context**: The review's check would fail on `disable comment hygiene gate`, a deliberate lead phrase whose gold row expects `/doctor:git hooks` first. That route's derived policy is `ask`, so leading only offers it.

**Decision**: A lead phrase must hold a state or health word unless its route's policy is `ask`. The other four lead phrases already hold one (`off`, `state`, `report`, `check`).

**Consequences**:
- No gold row moves and the doctor slice stays green.
- A future lead phrase on an `ask` route is not checked for wording. Mitigation: the route stays ask-first.

**Alternatives Rejected**:
- The review's version, which removes the lead phrase and relabels `doctor-a-08`: the operator kept the phrase.
<!-- /ANCHOR:decisions -->
