---
title: "Implementation Plan: Phase 3: versioned-placeholder-gate"
description: "A script converts the core template hints to value tokens, two validator implementations get a stamp-gated Draft lifecycle, and a failing-first test with mutation checks, a scaffold smoke test and before and after strict counts over every packet prove it."
trigger_phrases:
  - "versioned placeholder gate plan"
  - "value token lifecycle implementation"
  - "validatePlaceholders orchestrator edit"
  - "template hint conversion script"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: versioned-placeholder-gate

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (the orchestrator), Bash (the shell mirror), Python 3 standard library (edit tools), Node ESM (the census), vitest |
| **Framework** | system-spec-kit validator, scaffolder `create.sh` and its vitest suite |
| **Storage** | Text files in this phase's `scratch/`: tools, census results, logs |
| **Testing** | One new vitest file, three scripted mutations, the shell rule harness, the golden snapshot, a scaffold smoke test and before and after strict counts |

### Overview
A Python script rewrites each bare hint of five templates into `[YOUR_VALUE_HERE: <hint>]` and a second script stamps them v2.3. The orchestrator function `validatePlaceholders` and the shell rule `check-placeholders.sh` both learn one lifecycle: for a doc stamped v2.3 or later, an unfilled token warns while `spec.md` has the Status Draft and errors otherwise. The conductor writes the failing test first, makes it pass, breaks the code three ways to prove the test notices, then proves no existing packet changed verdict by validating every folder under `specs/` before and after.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The launch preconditions in `../spec.md` section 3 are recorded as met in `../goal.md` section 4
- [x] Phase 2 is closed, shown by `tasks.md` T001
- [x] `tasks.md` T001 to T007 are done: closures checked, tools checked, start state recorded, tools saved, conversion tool tested, census before recorded, failing test red

### Definition of Done
- [x] Every row in `acceptance-criteria.md` is `Met`
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this phase> --strict` prints `RESULT: PASSED`
- [x] `tasks.md` T015 printed `CENSUS_SAME` for both gates
- [x] `tasks.md` T017 printed `SUITE_MATCH_PLUS_NEW_TEST`
- [x] `tasks.md` T018 printed `0` changed paths outside the file list
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A stamp-gated lifecycle. The template stamp says which contract a doc was written under. The validator keeps the old strict verdict for any doc without the new stamp and applies the Draft lifecycle only to docs that carry it.

### Facts read from the tree while this plan was written

- `validate.sh` runs the compiled `runtime/dist/lib/validation/orchestrator.js`, never the shell rules, for the rule `PLACEHOLDER_FILLED`. The orchestrator lists it in `nativeRuleIds`, and `runRegistryShellRules` skips every rule in that set. The proof is the wording: a v2.3 scaffold validated in a scratch copy printed `unfilled value token(s) in a Draft packet`, which is the new orchestrator message, and not the shell message.
- `validate.sh` exits 3 with the text `compiled validation orchestrator is stale` when `runtime/dist` is older than its source. So the TypeScript edit is invisible until `npm run build` runs under `runtime/`.
- `rules/check-placeholders.sh` still matters. The harness `runtime/cli/tests/test-validation-extended.sh` sources it in the category `Individual Rule: PLACEHOLDER_FILLED (check-placeholders.sh)`, and its header says it mirrors the orchestrator.
- A warning does not fail strict. The orchestrator sets `passed: summary.errors === 0`.
- `create.sh` function `finalize_scaffold_templates` replaces `[NAME]`, `[YYYY-MM-DD]`, `[Feature Name]` and `[###-feature-name]` and strips ` [template:...]` with `perl`. Function `ensure_template_source_near_top` moves the stamp line below the frontmatter. The stamp text, including its version, comes from the template.
- `templates/spec-kit-docs.json` lists a version per template, and `runtime/cli/tests/template-version-parity.vitest.ts` fails when a manifest version differs from the template stamp.
- `runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` renders these templates and compares them with `runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap`. Without `-u` it fails after conversion on four tests.
- The orchestrator reads every authored doc that is present. The shell rule reads only `spec.md`, `plan.md`, `tasks.md` and `decision-record.md`. This difference exists today and the plan keeps it for older docs (ADR-007).

### Frozen definitions

**Hint.** A bracketed text that matches `\[[A-Za-z/][^]\[]{2,}\]`. The slash lets the score cells `[/25]`, `[/20]` and `[/15]` count. Phase 1 counted with a letter-only start, so on the same Level 2 scaffold it saw 97 occurrences and this regex sees 112 over the five docs a Level 2 scaffold creates.

**Conversion rule.** The script `convert_hints.py` turns a hint into `[YOUR_VALUE_HERE: ` followed by the hint text and `]`. The text keeps its case. It skips five cases:
1. A line inside a fenced code block.
2. Text inside an inline code span.
3. Text followed directly by `(`, which is a link.
4. The five scaffolder texts `NAME`, `Feature Name`, `YYYY-MM-DD`, `###-feature-name` and `1/2/3/3+`, and any text that starts with `template:`. `create.sh` replaces or strips them, so a token there would stay in every scaffold.
5. A text that already starts with `YOUR_VALUE_HERE`.

**Counts the conversion must give.** Converted per file: `spec.md.tmpl` 96, `plan.md.tmpl` 90, `tasks.md.tmpl` 7, `implementation-summary.md.tmpl` 14, `acceptance-criteria.md.tmpl` 10, so 217 in all. The total hint count of each file does not change, because a token is itself a hint under this regex. The bare hints left are exactly the ones in `tasks.md` T011.

**Stamp.** The 7 stamp lines of those five templates change from `| v2.2 -->` to `| v2.3 -->`: 3 in `spec.md.tmpl` and 1 each in the other four. The five manifest entries change the same way.

**Gate stamp.** A doc carries the gate stamp when one of its first 70 lines matches `<!-- SPECKIT_TEMPLATE_SOURCE: <names> | vMAJOR.MINOR -->` with MAJOR above 2, or MAJOR 2 and MINOR 3 or more. A doc with an older stamp or none does not.

**Lifecycle.**

| Doc | Status in `spec.md` | Unfilled `[YOUR_VALUE_HERE:` token | `[NEEDS CLARIFICATION:` | Strict result |
|-----|---------------------|------------------------------------|-------------------------|---------------|
| Gate stamp | Draft | warning | error | passes when nothing else errors |
| Gate stamp | any other value or none | error | error | fails |
| No gate stamp | any value | error | error | fails, as before |

Draft means the cell holds the word Draft, ignoring case, bold marks, backticks, outer quotes, trailing punctuation and repeated spaces. The first Status row of the metadata table counts.

### Key Components
- **`convert_hints.py`**: the conversion tool, saved by `tasks.md` T004.
- **`replace_block.py`**: replaces the lines from a start marker up to an end marker, and refuses unless each marker occurs once. Used for the orchestrator.
- **`mutate.py`**: replaces one exact text that must occur once. Used for the mutation checks.
- **`apply_edits.py`**: applies old-text and new-text pairs to a doc, and refuses unless each old text occurs once.
- **`strict-census.mjs`**: validates every folder in a list with the orchestrator built in this checkout and prints one row per folder.
- **`suite_compare.py`**: compares two suite outputs and allows only the new test file and its tests.
- **`placeholder-token-gate.vitest.ts`**: the new test.
- **Conductor**: runs every task and reads every output.
- **Reviewer**: one read-only `cli-codex` review at phase close.

### Data Flow
Templates are converted and stamped. A scaffold made from them carries tokens and the v2.3 stamp. The orchestrator reads the stamp and the spec status for each doc and returns pass, warn or error for `PLACEHOLDER_FILLED`. The test drives the orchestrator through `validate.sh` and the shell rule through `bash -c`, and compares them.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

All paths are under `.skilled/skills/system-spec-kit/`.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/lib/validation/orchestrator.ts`, function `validatePlaceholders` | The rule `validate.sh` really runs | update | `tasks.md` T008 and the test |
| `runtime/cli/rules/check-placeholders.sh` | Shell mirror used by the isolated rule harness | update | `tasks.md` T009 and the test parity checks |
| Five template files | What a scaffold is rendered from | update | `tasks.md` T011 counts |
| `templates/spec-kit-docs.json` | Declares each template version | update | `template-version-parity.vitest.ts` |
| `runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Golden render of the templates | update | `tasks.md` T013 diff check |
| `runtime/cli/tests/level-contract-resolver.vitest.ts` | Expects the manifest version of `spec.md.tmpl` | update one line to v2.3 | `tasks.md` T013 fourth and fifth blocks |
| `runtime/cli/tests/upgrade-legacy.vitest.ts` | Removes a plan stamp line spelled with v2.2 from a rendered template | update one line to v2.3 | `tasks.md` T013 fourth and fifth blocks |
| `references/templates/template-guide.md` | Authoring guide that says `[PLACEHOLDER]` | update five lines | `tasks.md` T012 |
| `references/validation/validation-rules.md` | Rule reference | update one section | `tasks.md` T012 |
| `runtime/cli/spec/create.sh` | Replaces `[NAME]`, dates and the title token at scaffold time | unchanged, a consumer, the kept list protects it | `tasks.md` T014 smoke test |
| `runtime/cli/spec/check-template-staleness.sh` | Compares a packet stamp with the manifest | unchanged, it will report older packets as stale | `plan.md` ADR-005 |
| `runtime/cli/spec/repo-era.mjs` | Classifies markers as `new` or `legacy` by the manifest | unchanged, side effect recorded | `plan.md` ADR-005 |
| `runtime/cli/spec/upgrade-level.sh` | Renders template sections into an older doc | unchanged, side effect recorded | `plan.md` ADR-006 |
| `runtime/cli/spec/check-placeholders.sh` | Post-edit hook scan | unchanged, two defects recorded | `plan.md` ADR-003 |
| `runtime/cli/tests/workflow-invariance.vitest.ts` | Bans four words under `templates/` | unchanged, a consumer of the new token text | `tasks.md` T013 |
| `leaf-manifest.json`, `runtime/data/trigger-index.json` | Router and index | unchanged | `rg -c 'YOUR_VALUE_HERE' <file>` prints nothing |

Required inventories:
- Same-class producers: every `.tmpl` with a bare hint was counted with `rg -c '\[[A-Za-z/][^]\[]{2,}\]' templates/core/*.tmpl templates/addons/*.tmpl templates/packet-types/*.tmpl`. Only the five named templates are in scope. The other addons and packet types keep bare hints and their v2.2 stamps.
- Consumers of changed symbols: `rg -n 'validatePlaceholders' .skilled/skills/system-spec-kit --glob '!node_modules' --glob '!dist'` finds the definition and one call in `validateFolder`, plus the comment in the shell rule. Nothing else imports it, because it is not exported.
- Matrix axes: stamp (gate, older) by status (Draft, other) by marker (token, open question) makes 8 cells. The new test pins four: gate with Draft and token warns, gate with another status and token errors, older with Draft and token errors, gate with Draft and open question errors. The other four are the old behavior, covered by the 8 existing isolated cases and the 3 edge cases of the harness.
- Algorithm invariant: a warning is produced only when the doc has the gate stamp and the Status is Draft and the line holds no open question. Every other path reaches `findings` as before.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Four lifecycle cells plus the realpath check, orchestrator and shell mirror | `runtime/cli/tests/placeholder-token-gate.vitest.ts` |
| Mutation | Remove the stamp gate, remove the Draft check, remove the stamp gate in the shell rule: each must turn the test red | `mutate.py` in `tasks.md` T010 |
| Integration | Scaffold, validate, flip status, downgrade stamp | `create.sh` and `validate.sh` in `tasks.md` T014 |
| Regression | Every packet under `specs/` validates the same, and the suite matches the start | `strict-census.mjs` and `suite_compare.py` |
| Manual | Frontier review of the diff | read-only `cli-codex` dispatch in `tasks.md` T019 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 closed | Internal | Checked in T001 | The templates this phase edits may still be changing |
| Phase 1 `suite-start.txt` and `ledger.jsonl` | Internal | Checked in T001 | The suite comparison and the ledger check cannot run |
| `python3`, `jq`, `rg`, `node`, `perl`, `npm` | Internal | Checked in T002 | No tool can run |
| `npm run build` under `runtime/` | Internal | Checked in T008 | The orchestrator edit stays invisible to `validate.sh` |
| `codex` with `gpt-6-luna` | External | Checked in T019 | Review is recorded as skipped with the error, and REQ-009 stays open |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a path outside the file list changed. Or the census printed `CENSUS_DIFF` twice. Or the suite comparison printed `SUITE_DIFF` twice. Or the frontier review raised a P0 that cannot be fixed.
- **Procedure**: write the plan to roll back in `goal.md` section 4 first. Then list tracked changes with `git diff --name-only` and restore each one with `git restore --source=<phase start commit> -- <path>`. The one file this phase created is `runtime/cli/tests/placeholder-token-gate.vitest.ts`. Delete it with `rm` only after its path is written in `goal.md` section 4. Then run `npm run build` under `runtime/` so `dist/` matches the restored source. Nothing is committed by this phase, so there is no commit to revert.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001-T005) ──► Census before (T006) ──► Failing test (T007) ──► Code (T008-T010)
                                                                          │
              Templates (T011) ──► Docs (T012) ──► Snapshot (T013) ──► Smoke (T014) ──► Census after (T015)
                                                                          │
                                         Ledger (T016) ──► Suite (T017) ──► Scope (T018) ──► Review (T019-T020) ──► Close (T021)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 2 closed | Everything |
| Census before | Setup | Every edit, because it reads the unchanged tree |
| Failing test | Census before | Code |
| Code | Failing test | Templates |
| Templates and docs | Code | Snapshot |
| Snapshot and smoke | Templates | Census after |
| Census after and suite | Smoke | Review |
| Review and close | Suite | Phase 4 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and tools | Low | 30 minutes |
| Census before | Low | 1 minute for the rule-scoped gate and about 40 minutes for the all-rules gate on three shards |
| Test and code | Med | 45 minutes |
| Templates, docs and snapshot | Low | 20 minutes |
| Census after and suite | Med | about 40 minutes for the census plus one suite run |
| Review and close | Low | 30 minutes |
| **Total** | | **3 to 4 hours, an assumption. The census timing was measured at 1.4 seconds per folder on a sample of 31. The suite time is UNKNOWN until `tasks.md` T017 runs it** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Phase start commit hash recorded in `goal.md` section 4 before the first edit
- [x] `git status --porcelain` saved to `scratch/status-start.txt`
- [x] The unconverted templates saved to `scratch/templates-before/` by `tasks.md` T011 before they change
- [x] No feature flag applies, the new lifecycle is selected by the template stamp

### Rollback Procedure
1. List changed files with `git diff --name-only`.
2. Restore each one with `git restore --source=<phase start commit> -- <path>`.
3. Delete the created test file as the rollback plan above says.
4. Run `npm run build` under `runtime/` and `git status --porcelain`, then compare with `scratch/status-start.txt`.
5. Record the rollback in `goal.md` section 4.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the phase edits source files and creates one test file
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────┐   ┌────────────┐   ┌──────────┐   ┌────────────┐   ┌───────────┐
│  Setup  │──►│ Census     │──►│ Failing  │──►│ Validator  │──►│ Templates │
│         │   │ before     │   │ test     │   │ code       │   │ and docs  │
└─────────┘   └────────────┘   └──────────┘   └────────────┘   └─────┬─────┘
                                                                     │
┌─────────┐   ┌────────────┐   ┌──────────┐   ┌────────────┐   ┌─────▼─────┐
│  Close  │◄──│ Review     │◄──│ Suite    │◄──│ Census     │◄──│ Snapshot  │
│         │   │            │   │          │   │ after      │   │ and smoke │
└─────────┘   └────────────┘   └──────────┘   └────────────┘   └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | Phase 2 closed | Start commit, tools, folder list | Census before |
| Census before | Setup | `before-*.tsv` files | Every edit |
| Failing test | Census before | A red test with a recorded message | Validator code |
| Validator code | Failing test | Green test, built `dist/` | Templates |
| Templates and docs | Validator code | Five converted templates, two edited docs | Snapshot |
| Snapshot and smoke | Templates | Regenerated snapshot, smoke output | Census after |
| Census after | Smoke | `after-*.tsv` files | Suite |
| Suite | Census after | `suite-end.txt` | Review |
| Review | Suite | `T019.txt` | Close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup and tools** - 30 minutes - CRITICAL
2. **Census before, all rules** - about 40 minutes - CRITICAL
3. **Test and code** - 45 minutes - CRITICAL
4. **Census after, all rules** - about 40 minutes - CRITICAL
5. **Suite and review** - about 1 hour - CRITICAL

**Total Critical Path**: about 3.5 hours

**Parallel Opportunities**:
- The all-rules census runs as three shard processes at once, because each reads a separate list and writes a separate file. They write nothing else.
- Nothing else runs in parallel. Every edit changes the tree that the census and the suite read.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup and census before done | T001 to T006 marked `[x]` with evidence | Start of phase |
| M2 | Validator done | Test green, three mutations red, shell harness green | Mid phase |
| M3 | Templates done | 217 tokens, 7 stamps, snapshot regenerated, smoke test as expected | Mid phase |
| M4 | Phase closeable | Census same, suite matches, review answered, every acceptance criterion `Met` | End of phase |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

Written for the executing swarm. Follow each rule as written. Where a rule and your own judgment disagree, follow the rule and record the disagreement in `goal.md` section 4.

### Roles
- **Conductor**: the operator's interactive OpenCode v2 session on DeepSeek V4.1 Flash max. It runs every command in `tasks.md`, reads every output, edits only the files in `spec.md` section 3 and this phase folder, and keeps `goal.md` section 4 current.
- **Worker**: one Task subagent, dispatched with the Task tool and inheriting the session model. This phase dispatches none, because every edit is made by a tool script or a quoted heredoc, and each one has an exact old text and an exact new text. No model call can improve on that, and a model could only reword it.
- **Reviewer**: one read-only frontier review through `cli-codex` with `gpt-6-luna` at phase close. It writes nothing.

### Pre-Task Checklist
- [ ] Read this phase's `spec.md`, this plan and `tasks.md` before the first command
- [ ] Confirm the working directory is the build worktree recorded in `../goal.md` section 4, never the main checkout
- [ ] Read `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` before the review command
- [ ] Write each file with the quoted heredoc exactly as shown, then run the check printed under it
- [ ] Save every brief to `scratch/briefs/` before sending it

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Run tasks in ID order. No task is parallel except the three census shards inside T006 and T015 |
| TASK-SCOPE | Edit only the files in `spec.md` section 3. A tool that touches another file is a failure, restore that file |
| TASK-VERIFY | The conductor runs the task's verify command and reads both its output and its exit status before marking the task `[x]` |
| TASK-LOCATE | Find text by its exact content, never by a line number |
| TASK-NOHAND | Never edit a template, a validator file or a reference doc by hand. Only the tool named in the task changes it |
| TASK-BUILD | After any change to `orchestrator.ts` run `npm run build` under `runtime/` before the next test or validation |
| TASK-NOCOMMIT | Never run `git commit`, `git push`, `git checkout`, `git switch`, `git branch`, `git reset`, `git stash`, `generate-context.js` or `/speckit:save`. The operator commits |
| TASK-COMMENT | A code comment states the durable reason. It never names a spec, phase, task or decision id |

### Review Brief Skeleton

The review brief starts with this block, word for word. `tasks.md` T019 holds the whole brief.

```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched reviewer. AI_SESSION_CHILD=1 and
SYSTEM_SPEC_GATE_ENFORCE=0 are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

ROLE: You are a read-only reviewer of a code and text diff. Your output is checked line by
line by a script.

ALLOWED WRITE PATHS:
  none

BANNED OPERATIONS: git commit, git push, git checkout, git switch, git branch, git reset,
git stash, rm, mv, create.sh, generate-context.js, /speckit:save, and any edit to any file.
```

The role line is a focused persona summary in place of a full agent file, the small-context exception that `cli-opencode` rule 18 allows. It is declared here as that exception. Layers L1 to L3 of `cli-opencode` rule 15 apply to the review: banned operations and allowed write paths in the prompt, a fresh worktree and a baseline commit.

### Status Reporting Format

```text
[T###] DONE | BLOCKED - one line of evidence
```

Write it as a row in the progress table of `goal.md` section 4.

### Blocked Task Protocol
1. Restore any file the task changed with `git restore --source=<phase start commit> -- <file>`, and run `npm run build` under `runtime/` when the file was `orchestrator.ts`.
2. Mark the task `[B]` in `tasks.md` with the failing command and the first line of its output.
3. Retry the task at most twice with the cause fixed. After the third failure on the same task, leave it `[B]` and continue with the next task that does not depend on it.
4. Stop the phase when two tasks are blocked, and write `STOP` with both task IDs in `goal.md` section 4.
<!-- /ANCHOR:ai-execution -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Reuse the existing token and gate by the template stamp

**Status**: Accepted

**Context**: The token `[YOUR_VALUE_HERE: ...]` is already an error in the validator and is already documented in `template-style-guide.md` section 3. A flag or an environment switch would need setting in every repo, and an external repo could not be expected to set it.

**Decision**: No new grammar. A doc stamped v2.3 or later gets the Draft lifecycle. Any other doc keeps its old verdict.

**Consequences**:
- The gate turns on by itself for each new scaffold and never for an old packet.
- A hand-written doc that copies a v2.3 stamp opts itself in. That is the intended meaning of the stamp.

**Alternatives Rejected**:
- An environment flag: it would have to be set in every external repo, and an unset flag is silent.
- Gating by packet creation date: dates are fragile across copies and renames, and the stamp already travels with the doc.

### ADR-002: Draft means the word Draft, and a warning does not fail strict

**Status**: Accepted

**Context**: Planning commits must keep passing, as the rule `SCAFFOLD_NEVER_TOUCHED` already allows for a Draft. Other status words, such as Planned or In Progress, are real work states where a leftover hint is a defect.

**Decision**: Only the exact word Draft defers a token to a warning. Every other value, and a missing Status row, makes it an error. The orchestrator already treats a warning as advice, so strict still passes with warnings.

**Consequences**:
- A packet marked In Progress with tokens fails, which is the point of the gate.
- A packet with the status `Draft (phase 3)` counts as not Draft. The author writes `Draft`.

**Alternatives Rejected**:
- Treat every non-Complete status as Draft: a weak model that sets In Progress could then leave every hint for ever.

### ADR-003: Record two defects in the post-edit scanner and leave the file alone

**Status**: Accepted

**Context**: `runtime/cli/spec/check-placeholders.sh` is the broad scan the post-edit hook runs. Two defects were observed with probe files. It skips only the lines that start a code fence and not the lines between fences, so a bracketed hint inside a fenced block exits 1. Its bracket class has no colon, so a line that holds a value token after the word Priority exits 0. After this phase the hook therefore stops reporting unfilled tokens in new packets.

**Decision**: This phase does not edit that file. It is a different script from the rule being changed, with a different caller, and the fix for the colon blind spot would change the hook verdict for existing packets that hold text such as `[SOURCE: ...]`. The conductor records the two defects in `goal.md` section 4 as follow-up rows with these probe commands, and raises them to the operator.

**Consequences**:
- The validator warning is the only signal for a Draft packet until the scanner is fixed.
- No existing hook verdict changes in this phase.

**Alternatives Rejected**:
- Add the colon to the bracket class here: it changes which existing packets the hook flags, with no test covering the scanner.

### ADR-004: Convert with a script and keep the scaffolder's own placeholders

**Status**: Accepted

**Context**: By the frozen regex the five templates hold 257 bracketed hints. Of those, 217 are to convert, 38 are texts that `create.sh` replaces or strips and 2 sit inside an inline code span. A hand edit by a weak model would miss some and corrupt others.

**Decision**: `convert_hints.py` converts by the frozen rule and prints how many it changed. Counts before and after, and the list of bare texts left, are checked by commands.

**Consequences**:
- The result is the same on every run, and a second run changes nothing.
- A hint that the rule keeps but a later phase wants as a token needs a rule change, not a hand edit.

**Alternatives Rejected**:
- Convert by hand: error prone at this size.
- Convert the scaffolder's own placeholders too: every scaffold would then keep a token for the feature name and the date.

### ADR-005: Accept the era report flip and raise it to the operator

**Status**: Accepted

**Context**: `template-version-parity.vitest.ts` forces the manifest version to equal the template stamp, so the manifest must say v2.3. `repo-era.mjs` marks a document `legacy` when its stamp differs from the manifest. Run against this repository with the two manifests, the report went from 16871 `new` and 2374 `legacy` markers to 1421 `new` and 17824 `legacy`. `/doctor:update check` treats a `legacy` count above zero as a pre-v4 signal, so a repo with none today would start showing it. The validator verdict for every packet is unchanged.

**Decision**: This phase does not edit `repo-era.mjs` or the doctor command. It records the measured counts and three options in `goal.md` section 4 and in the closing report: accept the flip, teach the era report that v2.2 is still a current stamp for old docs, or hold the manifest bump until the doctor signal is adjusted.

**Consequences**:
- The operator decides before a release carries the new templates to external repos.
- Decision D-b is met for the validator and open for the doctor signal.

**Alternatives Rejected**:
- Skip the manifest bump: the parity test would fail.
- Edit the era report here: it is outside the frozen file list and changes a doctor contract.

### ADR-006: Record the upgrade-level token copy and leave it

**Status**: Accepted

**Context**: `upgrade-level.sh` renders sections from the templates into an older doc and does not touch the doc's template stamp. After this phase those sections arrive as tokens inside a doc that still says v2.2, and a token in a v2.2 doc is an error. Before this phase the same upgrade inserted bare hints that validated clean.

**Decision**: Not fixed here. The conductor records it as an operator item with the probe in `goal.md` section 4. The full suite includes `upgrade-level-sections.vitest.ts` and `test-upgrade-level.sh`, and `tasks.md` T017 reports whether either changed.

**Consequences**:
- An operator who upgrades an old packet to a higher level must fill the new sections or set the stamp.
- No existing packet changes, because the upgrade is an explicit action.

**Alternatives Rejected**:
- Stamp the upgraded doc v2.3: it would put a whole older doc under the new contract without anyone choosing that.

### ADR-007: Update both implementations together and prove them with one test

**Status**: Accepted

**Context**: The orchestrator decides every real verdict. The shell rule is a mirror that a harness still drives. The two already differ in the docs they read.

**Decision**: Both get the same lifecycle in this phase. The shell rule reads `acceptance-criteria.md`, `implementation-summary.md` and `goal.md` only when they carry the gate stamp, so older docs are scanned exactly as before. One test file runs both on the same folder and compares the result.

**Consequences**:
- For a doc with the gate stamp the two agree on pass, warn and error.
- The old difference in the docs read stays for older docs and is listed in `validation-rules.md`.

**Alternatives Rejected**:
- Update only the orchestrator: the mirror would drift on day one.

---

