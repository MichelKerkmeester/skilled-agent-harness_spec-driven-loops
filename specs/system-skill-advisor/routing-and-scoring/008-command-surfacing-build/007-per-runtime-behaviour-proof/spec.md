---
title: "Feature Specification: Phase 7: per-runtime-behaviour-proof"
description: "No check reads what a model does after the advisor surfaces a command. This phase scores real session transcripts per runtime for the command start, the COMMAND token, the workflow read before the first write and a started loop without init, against a pre-change run."
trigger_phrases:
  - "per runtime behaviour proof"
  - "phase 7 per runtime behaviour proof"
  - "command start rate per runtime"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: per-runtime-behaviour-proof

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
| **Phase** | 7 of 7 |
| **Predecessor** | 006-gate-2-binding-and-runtime-pointers |
| **Successor** | None |
| **Handoff Criteria** | Per measured runtime the command-start rate is reported against the pre-change run, with zero unsafe starts and zero started loops without init |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the build that makes the skill advisor surface every tracked slash command with a run-or-ask policy and brings a chat-only request onto a proper workflow (`../spec.md`).

**Scope Boundary**: A transcript scorer and a one-turn runner beside the routing-accuracy captures, the live runs they score, a lead-phrase check in the bridge deriver, one clause in the Gate 2 bullet when phase 006 left it out and a confirmation of the Claude Code `create` gap. No scorer weight, no command policy and no brief text changes here.

**Dependencies**:
- Phase 005 renders the command and its policy in the brief, and phase 006 adds the Gate 2 bullet with the `COMMAND:` output token. Both are planned in parallel and not built. This plan assumes they land as `../../007-command-surfacing-and-workflow-enforcement/research/synthesis-review.md` R3 and R6 describe.
- The pre-change arm has to run on a commit that holds neither phase 005 nor phase 006. Today's worktree HEAD qualifies (the Measured Behavior block shows no `COMMAND:` line in `AGENTS.md`).
- The session readers in `.skilled/hooks/shared/session-readers/` load a session by exact id for six runtimes.

**Deliverables**:
- `score-command-transcripts.mjs`, which scores one session or a run log and prints the per-runtime rates with their denominators.
- `run-command-behaviour.mjs`, which runs one prompt one turn on one runtime and records the session locator and the files the run changed.
- A pre-change arm and a post-change arm per measured runtime, and a started-command-is-followed run on the three heaviest workflows.
- The lead-phrase check in the deriver, the `COMMAND:` once-per-session clause when phase 006 did not write it and the confirmed cause of the Claude Code `create` gap.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every check this build has so far reads the advisor's output, never the model's behaviour. A recorded session started `/deep:research` from chat, read 420 of 2,539 workflow lines and called the runner itself, so `phase_init` never ran (`specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/001-research-egm-checks-and-chat-path-gaps/scratch/incident-chat-started-loop.md`). Decision D1 lets a model start a writing command, and research.md section 13 makes D1 depend on the check that a started command is followed. Nothing measures that today on any runtime.

### Purpose
For each runtime that has a session reader, a scored pre-change run and post-change run report the command-start rate, the `COMMAND:` token rate and the unsafe-start count, and a run on the three heaviest workflows reports zero loops started without init.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Every command ran from the repository root of the worktree on 2026-11-12. `$ADV` is `.skilled/skills/system-skill-advisor/runtime`.

```text
$ for c in claude opencode codex pi cursor-agent devin dsh hermes; do printf "%s: " $c; command -v $c || echo "(none)"; done
claude: claude
opencode: opencode
codex: codex
pi: pi
cursor-agent: cursor-agent
devin: devin
dsh: /Users/michelkerkmeester/.local/bin/dsh
hermes: /Users/michelkerkmeester/.local/bin/hermes

$ node --input-type=module -e "<print capabilities status>"   # .skilled/hooks/shared/session-readers/index.mjs
claude ready
codex ready
pi ready
opencode ready
devin ready
dsh ready
cursor gated

$ jq -s -c 'group_by([.row_type, .split]) | map({rt: .[0].row_type, split: .[0].split, n: length})' $ADV/scripts/routing-accuracy/command-prompts.jsonl
[{"rt":"must-not-start","split":"none","n":22},{"rt":"near-miss","split":"none","n":9},{"rt":"plain","split":"holdout","n":44},{"rt":"plain","split":"tune","n":45},{"rt":"slash-variant","split":"none","n":12},{"rt":"typed","split":"none","n":44}]
$ jq -s -c '[.[] | select(.split=="tune" and .row_type=="plain")] | group_by(.expected_policy) | map({p: .[0].expected_policy, n: length})' $ADV/scripts/routing-accuracy/command-prompts.jsonl
[{"p":"ask","n":11},{"p":"run","n":12},{"p":"start","n":22}]

$ wc -l .skilled/commands/deep/assets/deep-review-confirm.yaml .skilled/commands/deep/assets/deep-research-confirm.yaml .skilled/commands/speckit/assets/speckit-complete.yaml
    2205 .skilled/commands/deep/assets/deep-review-confirm.yaml
    1998 .skilled/commands/deep/assets/deep-research-confirm.yaml
    1444 .skilled/commands/speckit/assets/speckit-complete.yaml
    5647 total

$ rg -c "COMMAND:" AGENTS.md; echo "exit $?"
exit 1
$ node .skilled/commands/doctor/scripts/agents-md-check.cjs --json | jq -r '.status, (.rows[] | select(.id=="A6") | .detail)'
OK
15629 of 16384 bytes to the last anchor, 27112 of 32768 bytes total

$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"disable comment hygiene gate"}' --format json | jq -c '[.data.recommendations[] | [.skillId, .confidence]]'
[["command-doctor-git-hooks",0.9138],["sk-code",0.8798]]
$ rg -n "disable comment hygiene gate" .skilled/commands/doctor/_routes.yaml $ADV/scripts/routing-accuracy/doctor-prompts.jsonl
.skilled/commands/doctor/_routes.yaml:309:      - "disable comment hygiene gate"
.skilled/commands/doctor/_routes.yaml:313:      - "disable comment hygiene gate"
.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl:8:{"id":"doctor-a-08","prompt":"disable comment hygiene gate","expected_top":"command-doctor-git-hooks","expected_second":null,"wave":"A"}

$ git -c core.fsmonitor=false ls-files .claude/commands/create | wc -l; ls -l .claude/commands/create/skill.md
      13
.claude/commands/create/skill.md -> ../../../.skilled/commands/create/skill.md

$ rg -n "allowSingleLineage !== true" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
3410:    && args.allowSingleLineage !== true
$ rg -n "^  'claude-cli'" .skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs
60:  'claude-cli': ['claude', '-p', '--output-format', 'stream-json', '--verbose', '--dangerously-skip-permissions'],
```

What the block settles for this plan:
- Eight runtime CLIs answer `command -v`. Six runtimes have a `ready` session reader. Cursor's reader is `gated`, so no Cursor transcript can be scored. Hermes has no reader and is not one of the seven runtimes the review names.
- The tune split holds 45 plain rows (11 ask, 12 run, 22 start) and the corpus holds 22 must-not-start rows. The runs draw prompts from these rows only. The 44 holdout rows are counted and never read.
- The three heaviest workflows by line count are `/deep:review`, `/deep:research` and `/speckit:complete`. The confirm files are the ones a model-started command opens, because decision D1 never starts a command in `:auto`.
- `AGENTS.md` holds no `COMMAND:` line today, so this HEAD is a valid pre-change commit. The last anchor sits 755 bytes under the 16,384-byte limit before phase 006 adds its bullet.
- `disable comment hygiene gate` is a lead phrase of `/doctor:git hooks` and a gold row that expects that command first. The review's R10d check would fail on it at once.
- The one-lineage refusal the review's G2 asks for already ships in `fanout-run.cjs`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Score a session transcript per runtime through `loadSession` for four facts: each `COMMAND:` line, whether the expected command's document and workflow file were read before the first write, whether the run started a command and whether a started loop ran its init first.
- Run each chosen prompt one turn on each measured runtime with a recorded session locator, and restore any file the run changed.
- Run the chat set before and after phases 005 and 006, and the started-command set on the three heaviest workflows after them.
- Add a lead-phrase check to the bridge deriver (R10d) that exempts a route whose policy is `ask`, so `disable comment hygiene gate` keeps leading.
- Add the once-per-command clause to the Gate 2 bullet only when phase 006 did not write it (R10c).
- Confirm the cause of the Claude Code `create` gap in a scratch copy and record it (G5), with no command rename.

### Already Delivered (not planned again)
- The one-lineage refusal in `fanout-run.cjs` `main` (`allowSingleLineage`, line 3410), shipped by the goldfish packet. It covers the bypass the incident used, so the second step of G2 has nothing left to add.
- Exact-id session readers for Claude Code, Codex, Pi, OpenCode, Devin and DSH (`loadSession`, `readSession` and `capabilities` in `.skilled/hooks/shared/session-readers/index.mjs`).
- A behaviour runner for deep-loop scenarios (`behavior-bench-run.cjs`, `LEG_TABLE`) with natural-ask scenarios `RSB-003`, `RSB-004`, `RVB-003` and `RVB-004`. It has two runtimes (`claude-cli` and the `opencode` legs) and a deep-loop rubric, so the command proof does not extend it.
- A read-before-write measure for Claude Code and Codex transcripts (`measure-rule-compliance.py` in `sk-create-repo-rule`, its Gate 5 miss rate). Its tool-name sets are the starting table for the normalizer.
- The prompt rows with their expected command and policy (`command-prompts.jsonl`) and the policy per command and route (`commandPolicies` in `command-bridges.generated.json`).
- The lead-phrase subset check in `doctorLeadPhrases` (`derive-command-bridges.cjs`). It checks that a lead phrase is a trigger phrase and nothing more.
- The Gate 2 premise of R10c, "A skill already in context is not re-read" (`AGENTS.md:68`).

### Out of Scope
- Any change to scoring, ranking, policies or the brief. Phases 003 to 005 own them.
- Writing the Gate 2 bullet itself, the static pointer and the child downgrade. Phase 006 owns them, and its own smoke test proves the child line.
- Cursor transcripts. Its reader stays gated until preCompact delivery is proven, so Cursor is reported as not measured.
- Hermes. It has no session reader and is outside the review's seven runtimes.
- Renaming `/create:skill` or changing the Claude mirror. Every fix found so far renames a command a user types, so the fix is a decision for after the cause is confirmed.
- A runner for the single-executor deep loop. The goldfish research ruled it out for now, and this phase measures before it builds.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `$ADV/scripts/routing-accuracy/score-command-transcripts.mjs` | Create | Session scoring and the per-runtime summary |
| `$ADV/scripts/routing-accuracy/run-command-behaviour.mjs` | Create | One prompt, one turn, one runtime, with locator and restore |
| `$ADV/tests/command-transcript-score.vitest.ts` | Create | Scorer cases on built sessions, no live model |
| `$ADV/scripts/routing-accuracy/README.md` | Modify | The two scripts and their exit codes |
| `$ADV/scripts/command-bridges/derive-command-bridges.cjs` | Modify | The lead-phrase word check |
| `$ADV/tests/command-policy-derivation.vitest.ts` | Modify | A failing and a passing lead-phrase case |
| `AGENTS.md`, `.skilled/commands/doctor/assets/agents-md-manifest.json` | Modify, only if phase 006 left the clause out | The once-per-command clause and its manifest entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `score-command-transcripts.mjs` scores a session from each `ready` reader and reports, per session, every `COMMAND:` line, whether the expected command document was read before the first write, whether a command started, whether the start was unsafe and whether a started loop ran its init first. A reader failure exits 2 and prints the reader's code. The test file covers each fact with a built session. |
| REQ-002 | The runner refuses a holdout row with exit 2 before it reads any prompt text, and selects the chat set by sorted id: the first 8 start, 4 run and 4 ask tune plain rows and the first 8 must-not-start rows. |
| REQ-003 | For each of the six measured runtimes, a pre-change arm on the commit recorded in `scratch/pre-change-commit.txt` and a post-change arm after phase 006 each score all 24 chat-set prompts, and the summary prints the command-start rate of both arms with its denominator. |
| REQ-004 | The post-change arm records zero unsafe starts on every measured runtime. |
| REQ-005 | The started-command set runs `/deep:research`, `/deep:review` and `/speckit:complete` each as a natural ask and as a typed command on every measured runtime, and records zero started loops without init. |
| REQ-006 | After the runs, `git -c core.fsmonitor=false status --porcelain` lists no path outside this phase folder, and the run log records every path a run changed and restored. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | In every post-change session, no command has more than one `COMMAND:` line. When phase 006's bullet lacks the once-per-command clause, `AGENTS.md` gains it and `agents-md-check.cjs` still reports `OK`. |
| REQ-008 | The deriver checks each lead phrase for a state or health word unless its route's policy is `ask`, `derive-command-bridges.cjs --check` prints `fresh` and the doctor slice still passes. |
| REQ-009 | The cause of the Claude Code `create` gap is confirmed or refuted in a scratch copy outside the repository, and the result is recorded with the two listings it rests on. |
| REQ-010 | The scorer floor still prints `[159,50,20,5]`, the command baseline metrics are unchanged and `npm test` in `$ADV` reports 0 failed. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The summary prints, per measured runtime, the pre-change and post-change command-start rate as n of 12 each. The 12 are the 8 start rows and the 4 run rows of the chat set. The 4 ask rows are reported apart, as offered or unsafe.
- **SC-002**: The post-change unsafe-start count is 0 and the started-loops-without-init count is 0 on every measured runtime.
- **SC-003**: The worktree is clean outside this phase folder after the last run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 005 and 006, planned in parallel | The post-change arm and R10c have nothing to measure until both land | The pre-change arm and all code tasks run first. The post-change tasks wait on `rg -c "COMMAND:" AGENTS.md` printing at least 1 |
| Dependency | The pre-change commit | If phase 005 lands before the pre-change arm runs, no clean pre-change state exists in the worktree | The pre-change arm runs on today's branch tip before phase 005's first code commit, and phase 005 waits for it |
| Dependency | Paid model accounts and installed CLIs | A runtime without a working account cannot be measured | A runtime that fails its smoke run is reported as not measured, never as zero. A GPT run that hits its quota stops and the operator is asked |
| Risk | A run writes to tracked files | High: a model that ignores its policy edits the worktree | The runner records `git status --porcelain` before and after each run and restores only the paths the run changed |
| Risk | Runs that deviate from the cli skill contracts | Med: rule 17 of `cli-opencode/SKILL.md` sets `AI_SESSION_CHILD=1` for every dispatched session, and `cli-claude-code` refuses to run from inside Claude Code | The operator approved running the CLIs directly without the child variable, as `behavior-bench-run.cjs` does for its `claude-cli` leg |
| Risk | Tool names differ per runtime | Med: a read missed by the normalizer counts as a skipped workflow | The smoke run on each runtime records its tool names, and the test file holds one built session per runtime |
| Risk | One sample per cell | Med: a single run can mislead | The framework's rerun rule: a contested cell gets three samples, all recorded, with the reason |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: One chat-set run ends within 300 seconds and one started-command run within 900 seconds, the cap `framework.md` section 6 sets for research and review. A run that hits the cap is recorded as a timeout, never retried silently.

### Security
- **NFR-S01**: The scorer opens stores read-only through the session readers and prints no prompt or reply text beyond the `COMMAND:` lines.
- **NFR-S02**: The runner never reads a holdout prompt and never passes a credential on the command line.

### Reliability
- **NFR-R01**: A reader failure, a missing locator or a crashed CLI makes that run `unscored` with its reason, and the summary counts it apart from the denominators.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a session with no tool call and no text scores as not started with no `COMMAND:` line.
- Maximum input: a started deep loop with many writes is scored on its first write only for the init check, and on all assistant text for `COMMAND:` lines.
- Failure path: an unknown runtime, a gated reader or an unreadable store exits 2 with the reader's code, for example `capability_gated` for Cursor.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | Two new scripts, one test, one README, one deriver check and an optional `AGENTS.md` clause, about 650 lines |
| Risk | 14/25 | Live runs on paid accounts that may write to the worktree |
| Research | 12/20 | Session locators and tool names differ per runtime and two are unconfirmed |
| **Total** | **37/70** | **Level 2** |

`recommend-level.sh --loc 650 --files 9` printed Level 1. This packet uses Level 2 because the brief requires `acceptance-criteria.md`, the plan workflow's `level_selection` says to go higher when the helper and judgment differ and every sibling phase is Level 2.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

### Open

None.

Not a question for this phase: how to fix the Claude Code `create` gap. This phase confirms the cause and records it. A fix is a later decision, because each fix found so far renames a command a user types.

### Resolved

The operator answered all four on 2026-11-12 through the question dialog. Each answer was the option this plan was written on.

- Which runtimes run live and how many prompts each? Decision: "All six, about 332 runs (Recommended)". Claude Code, Codex, OpenCode, Pi, Devin and DSH run the 24-prompt chat set in two arms and 6 started-command runs each. Cursor is reported as not measured.
- When does the pre-change arm run? Decision: "Now, on today's branch tip (Recommended)". It runs before phase 005's first code commit, and phase 005 waits for it.
- May the runs start the CLIs directly without `AI_SESSION_CHILD=1`, against rule 17 of `cli-opencode/SKILL.md` and the `cli-claude-code` self-invocation guard? Decision: "Yes, run them like a chat user (Recommended)".
- Should `disable comment hygiene gate` keep leading with `/doctor:git hooks`? Decision: "Keep the phrase (Recommended)". The word check exempts a lead phrase whose route policy is `ask`, and gold row `doctor-a-08` stays.

Two standing operator rules apply to every run that names a model:
- GPT models (Luna, Terra) run only on the Codex CLI with the operator's ChatGPT account, never through DevPass. If a quota is exhausted the run stops and the operator is asked. No run is re-routed to another provider.
- Workers that write the harness code are DeepSeek v4.1 flash max through Pi, with Luna max fast through the Codex CLI as the fallback. This rule is about who builds the harness, not about which models the behaviour runs measure.
<!-- /ANCHOR:questions -->

---
