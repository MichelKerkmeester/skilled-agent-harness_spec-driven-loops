---
title: "Implementation Plan: Phase 9: authoring-benchmark-and-closeout"
description: "Three final runs of the frozen authoring task feed one deterministic delta, then the report, the changelogs, the index, the track metadata and the parent maps are reconciled against the seven parent criteria."
trigger_phrases:
  - "authoring benchmark and closeout plan"
  - "authoring metric definitions"
  - "packet closeout sequence"
  - "parent completion criteria proofs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: authoring-benchmark-and-closeout

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Bash, ripgrep, jq, awk, Node.js |
| **Framework** | system-spec-kit validator, scaffold and trigger index scripts |
| **Storage** | JSONL and JSON files in this phase's `scratch/`, plus the benchmark report folder |
| **Testing** | Five metrics, each computed by a literal command on both sides |

### Overview
Three serial DeepSeek workers author the same frozen Level 2 packet in a throwaway track on the final tree. The conductor measures each run with the five commands phase 1 used, adds the v2.3 token count to M2 and writes one delta table. The remaining work publishes that result, regenerates the derived artifacts and proves each parent criterion before any completion box is ticked.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The launch preconditions in `../spec.md` section 3 are recorded as met in `../goal.md` section 4
- [ ] `tasks.md` T001 to T003 are done: provider, prior phase closure and start state
- [ ] Phase 1 leaves `baseline.json` and `hints-v2.2.txt` under `../001-template-drift-census-and-baseline/scratch/baseline/`

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/054-weak-model-spec-authoring --recursive --strict` prints `RESULT: PASSED`
- [ ] `scratch/closeout/criteria.txt` holds seven PASS lines and the parent goal holds seven ticked boxes
- [ ] `git status --porcelain` lists only the paths declared in `spec.md` section 3
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out of three serial runs into one deterministic reduce, then a publish stage that writes each artifact from a command rather than from prose.

### Key Components
- **Conductor**: one DeepSeek V4.1 Flash max session outside OpenCode. It dispatches runs, runs every verify command, writes only the declared paths and keeps `goal.md` section 4 current.
- **Run worker**: one `opencode2 run` dispatch on `llmgateway/deepseek-v4.1-flash-1017#max`. It authors the frozen task in `specs/zz-bench-authoring/` and then stops.
- **Metric reducer**: the jq script in `tasks.md` T007. It writes `delta.json` and `delta.md` from the two `baseline.json` files.
- **Report writer**: the script in `tasks.md` T008. It writes the report tables from `delta.json` and never takes a number from prose.
- **Reviewer**: one read-only frontier review through `cli-codex` at phase close. It writes nothing.

### Frozen metric definitions

Both sides use the same five metrics. A final run is measured on the tree after the worker stops and before its throwaway track is deleted.

| Metric | Field | Definition | Command |
|--------|-------|------------|---------|
| M1 | `strict_passed` | 1 when strict validation of the four authored docs prints `RESULT: PASSED`, else 0 | `bash $S/runtime/cli/spec/validate.sh $P --strict \| grep -c 'RESULT: PASSED'` |
| M2 | `leftover_hints` | Bare v2.2 hint occurrences plus v2.3 value token occurrences in the four docs | the two-pattern command in `tasks.md` T006 |
| M3 | `missing_anchors` | Sum over the four docs of the shortfall against `anchors-v2.3.txt` | the loop in `tasks.md` T006 |
| M4 | `out_of_scope_writes` | New paths in `git status --porcelain` after the run that are outside the bench track and this phase folder | the diff and filter in `tasks.md` T006 |
| M5 | `seconds` | Wall clock from the saved start second to the measurement second | `$(( $(date +%s) - T0 ))` |

### M2 comparability rule

A v2.2 hint is a bracketed authoring string that names what the section still needs. A v2.3 token is the same instruction with a `YOUR_VALUE_HERE` prefix inside the opening bracket. The old opening bracket is consumed by the token prefix, so the old pattern cannot match inside a token and the token pattern cannot match a bare hint. M2 is the sum of the two occurrence counts. Each unfilled instruction counts once. The baseline side had no tokens, so the same sum reduces to the phase 1 count of 97 occurrences.

### Report folder grammar

The folder is `.skilled/skills/system-spec-kit/benchmark/reports/$DATE--model-eval--authoring-baseline/`, where `DATE` is `date +%F` at execution time. The subject is `model-eval` because the run measures how a model authors documents. The variant names the feature, not the model, so a later rerun on another model can keep the same variant. ADR-002 records the choice. The file is named `README.md`, not `benchmark-report.md`, because every existing folder under this reports root holds `README.md` and the index links to the folder. The ten-section report contract is unchanged. `goal.md` section 4 records the naming difference.

### Changelog targets

| Target | Path | Template |
|--------|------|----------|
| Global component entry | `.skilled/changelog/system-spec-kit/v2.9.0.0.md` | `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` compact format |
| Packet root | `specs/system-speckit/054-weak-model-spec-authoring/changelog/changelog-054-root.md` | `.skilled/skills/system-spec-kit/templates/changelog/root.md` through the nested generator |
| Phase child | `specs/system-speckit/054-weak-model-spec-authoring/changelog/changelog-054-009-authoring-benchmark-and-closeout.md` | `.skilled/skills/system-spec-kit/templates/changelog/phase.md` through the nested generator |

The two nested names come from the generator's own `--json` output, observed on this tree while this plan was written. Its `outputPath` uses the packet number and the phase number, not the full packet slug.

The version carrier `.skilled/skills/system-spec-kit/SKILL.md` moves from `2.8.5.0` to `2.9.0.0`. A minor bump is right because the packet adds a template gate, a card and a guard rather than only fixing text. When `v2.9.0.0.md` already exists, bump the minor segment once more to `v2.10.0.0.md`, and record the path in `goal.md` section 4.

### Derived artifacts

| Artifact | Path | Producer |
|----------|------|----------|
| Trigger index | `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | `runtime/cli/retrieval/generate-trigger-index.mjs` |
| Corpus manifest | `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json` | the same generator |
| Generation diagnostics | `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json` | the same generator |
| Phrase variants | `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json` | the same generator |
| Track children | `specs/system-speckit/graph-metadata.json` | `runtime/cli/spec/refresh-track-roots.mjs --apply` |

### Data Flow
Phase 1 baseline, then three final runs, then M1 to M5 per run, then `delta.json`, then the report and the changelogs, then the index and track refresh, then the seven criterion proofs, then the parent map and goal reconciliation, then review and close.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes no producer or consumer. The table records what it reads and what it publishes so a reviewer can check that nothing else moved.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `../001-template-drift-census-and-baseline/scratch/baseline/baseline.json` | The baseline side of every metric | read only | `jq '.runs \| length'` prints `3` |
| `../001-template-drift-census-and-baseline/scratch/baseline/hints-v2.2.txt` | The bare hint pattern list for M2 | read only | `wc -l` prints a number above 50 |
| `../003-versioned-placeholder-gate/scratch/census/` | The frozen folder list and the before verdicts for parent criterion 3 | read only | `wc -l < folders.txt` is above 0 and `b-before.tsv` exists |
| `../004-template-section-fill-guidance` guard | Parent criterion 4 | run only | `EXAMPLE_DRIFT_OK` |
| `../005-weak-model-authoring-card` guard | Parent criterion 4 | run only | `CARD SYNC OK` |
| `../008-playbook-run-in-worktree` report | Parent criterion 6 | read only | one `*--manual-testing-playbook--*` folder names this packet |
| Benchmark reports index | One row per run | one row added | `rg -c 'model-eval--authoring-baseline'` prints `1` |
| Parent phase map | Nine status rows | nine rows to `Complete` | `rg -c '\| Complete \|$'` prints `9` inside the map |
| 041 phase map | One row for the write-recipe child | one row to `Complete` | `rg -c '006-fix-write-recipe-move-destination.*Complete'` prints `1` |

Required inventories:
- Same-class producers: the script and rule names in `plan.md` section 3 were checked against the tree with `ls` and `rg` while this plan was written.
- Consumers of changed symbols: none. No code symbol changes.
- Matrix axes: two sides by five metrics makes ten cells, each reported as a minimum, a maximum and a mean.
- Algorithm invariant: a reported number is the value of a command over a saved run directory. It is never a prose estimate.
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
| Unit | Each metric command over one saved run | the five commands in `tasks.md` T006 |
| Integration | The two sides share one M2 definition and one anchor file shape | the scratch test in ADR-001 and the delta check in T007 |
| Manual | The report numbers match `delta.json` and the parent proofs match their commands | `tasks.md` T008 and T015, read by the frontier review in T016 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 1 to 8 closed | Internal | Checked in T002 | No final tree and no phase 8 report |
| `041-006` closed | Internal | Checked in T002 | The 041 map row cannot be flipped |
| `opencode2` with `llmgateway/deepseek-v4.1-flash-1017` | External | Checked in T001 | No final run can start |
| `jq`, `rg`, `awk`, `node`, `python3` | Internal | Checked in T001 | The metrics, the report and the changelog checks cannot run |
| `validate.sh`, `create.sh`, `nested-changelog.js` | Internal | Checked in T002 | The runs or the packet changelogs cannot run |
| `cli-codex` with `gpt-6-luna` | External | Checked in T016 | The review is recorded as skipped and REQ-013 stays open |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a published artifact carries a wrong number, a wrong date or a wrong status, or a final run wrote outside its throwaway track.
- **Procedure**: restore each path outside this phase folder with `git restore --source=<phase start commit> -- <path>`, delete `specs/zz-bench-authoring/` and rerun the task that owns the artifact. A report folder is never edited in place after the index row is added. Delete the folder, the index row and the changelog entry together and rerun T008 to T011.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001-T003) ──► Final runs 1, 2, 3 (T005) ──► Metrics and delta (T006-T007)
                                                              │
Report and changelogs (T008-T011) ──► Index and tracks (T012-T013) ──► Reconcile and proof (T014-T015)
                                                              │
                                                     Review (T016) ──► Close (T017)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 1 to 8 | Runs |
| Runs | Setup | Metrics |
| Metrics | Runs and the phase 1 baseline | Report |
| Report and changelogs | Metrics | Index |
| Index and tracks | Report | Reconcile |
| Reconcile | Index | Review |
| Review | Reconcile | Close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Final runs | Med | 1 to 2 hours, three serial runs |
| Metrics and delta | Low | 20 minutes |
| Report and changelogs | Med | 1 hour |
| Index, tracks and reconcile | Med | 40 minutes |
| Review and close | Low | 40 minutes |
| **Total** | | **4 to 5 hours, an assumption with no timed earlier run** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase start commit recorded in `goal.md` section 4
- [ ] `git status --porcelain` saved to `scratch/baseline/status-start.txt`
- [ ] No feature flag applies, this phase ships documentation and generated artifacts

### Rollback Procedure
1. List the changed paths with `git diff --name-only <phase start commit>`.
2. Restore every path outside this phase folder with `git restore --source=<phase start commit> -- <path>`.
3. Delete `specs/zz-bench-authoring/` when a run stopped before its cleanup.
4. Run `git status --porcelain` and compare it with `scratch/baseline/status-start.txt`.
5. Record the rollback in `goal.md` section 4.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The only generated data is the benchmark report, the changelogs, the index and the track metadata, and each is rebuilt by its own command.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────┐    ┌──────────────┐    ┌──────────┐    ┌───────────┐
│  Setup   │───►│ Final runs 3 │───►│  Delta   │───►│  Publish  │
└──────────┘    └──────────────┘    └──────────┘    └─────┬─────┘
                                                          │
                    ┌──────────────┐    ┌──────────┐      │
                    │   Reconcile  │◄───│  Index   │◄─────┘
                    └──────┬───────┘    └──────────┘
                           │
                    ┌──────▼───────┐    ┌──────────┐
                    │    Review    │───►│   Close  │
                    └──────────────┘    └──────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | Phases 1 to 8 | Start state and checks | Runs |
| Runs | Setup | Three run directories and logs | Delta |
| Delta | Runs, phase 1 baseline | `delta.json`, `delta.md` | Publish |
| Publish | Delta | Report, changelogs | Index |
| Index | Publish | Four index artifacts, track children | Reconcile |
| Reconcile | Index | Parent maps, goal log, proofs | Review |
| Review | Reconcile | Finding lines | Close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Final runs** - 1 to 2 hours - CRITICAL
2. **Report and changelogs** - 1 hour - CRITICAL
3. **Reconcile and prove** - 40 minutes - CRITICAL
4. **Review and close** - 40 minutes - CRITICAL

**Total Critical Path**: about 3 to 4 hours

**Parallel Opportunities**:
- None between the three runs. They run serially because one sampling model under load is not the same sample.
- The changelog draft and the report draft can be written in either order once `delta.json` exists.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup done | T001 to T003 marked `[x]` with evidence | Start of phase |
| M2 | Final side measured | `baseline.json` holds three runs with five metrics each | Mid phase |
| M3 | Delta published | The report folder, the index row and both changelogs exist | Mid phase |
| M4 | Packet reconciled | Parent maps and goal log hold one observed state | Late phase |
| M5 | Phase closeable | Seven PASS lines, every acceptance row `Met` and recursive strict `RESULT: PASSED` | End of phase |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

Written for the executing swarm. Follow each rule as written. Where a rule and your own judgment disagree, follow the rule and record the disagreement in `goal.md` section 4.

### Roles
- **Conductor**: one DeepSeek V4.1 Flash max session that is not itself running inside OpenCode, because `cli-opencode` refuses a dispatch from inside OpenCode. It dispatches runs, runs every verify command, edits only the declared paths and keeps `goal.md` section 4 current.
- **Worker**: one `opencode2 run` dispatch on `llmgateway/deepseek-v4.1-flash-1017#max`. One worker does one final run, then stops.
- **Reviewer**: one read-only frontier review through `cli-codex` at phase close. It writes nothing.

### Pre-Task Checklist
- [ ] Read this phase's `spec.md`, this plan and `tasks.md` before the first dispatch
- [ ] Read `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` sections 3 and 4 before composing the first worker command
- [ ] Confirm the working directory is the build worktree recorded in `../goal.md` section 4, never the main checkout
- [ ] Confirm `opencode2 models --standalone` lists `llmgateway/deepseek-v4.1-flash-1017`
- [ ] Save every brief to `scratch/briefs/<task-id>.txt` before dispatching it

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Run tasks in ID order. No task in this phase runs in parallel with another |
| TASK-SCOPE | A worker writes only the paths under ALLOWED WRITE PATHS in its brief |
| TASK-VERIFY | The conductor runs the task's verify command and reads both its output and its exit status before marking the task `[x]` |
| TASK-LOCATE | Find text by its exact content, never by a line number |
| TASK-FROZEN | The task text in T005 is copied from phase 1 T009 byte for byte. Never correct a typo, a path or a sentence in it |
| TASK-BANNED | Workers never run `git commit`, `git push`, `git checkout`, `git switch`, `git branch`, `git reset`, `git stash`, `generate-context.js` or `/speckit:save` |

### Worker Brief Skeleton

Every brief starts with this block, word for word, with the path filled in:

```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and
SYSTEM_SPEC_GATE_ENFORCE=0 are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/zz-bench-authoring/001-recommend-level-quiet-flag

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

ROLE: You are a documentation author working in this repository. Follow the
system-spec-kit skill for how spec documents are written.

ALLOWED WRITE PATHS:
  specs/zz-bench-authoring/ and everything under it

BANNED OPERATIONS: git commit, git push, git checkout, git switch, git branch, git reset,
git stash, generate-context.js, /speckit:save, and any edit outside specs/zz-bench-authoring/.
Do not edit recommend-level.sh.
```

The role line is a focused persona summary in place of a full agent file, the small-context exception that `cli-opencode` rule 18 allows. It is declared here as that exception.

### Dispatch Command

```bash
cd "$WORKTREE" && SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode2 run --standalone \
  -m llmgateway/deepseek-v4.1-flash-1017#max --format json \
  "$(cat "$PHASE/scratch/briefs/$TASK.txt")" </dev/null > "$PHASE/scratch/runs/$TASK.jsonl" 2>&1 &
PID=$!; wait "$PID"; kill -9 "$PID" 2>/dev/null; pkill -9 -P "$PID" 2>/dev/null
```

`PHASE` is this folder's path and `WORKTREE` is the build worktree. Never kill by a name pattern. Kill only the captured PID.

### Status Reporting Format

```text
[T###] DONE | BLOCKED - one line of evidence
```

Written as a row in the progress table of `goal.md` section 4.

### Blocked Task Protocol
1. Restore any file the task changed with `git restore --source=<phase start commit> -- <file>`.
2. Mark the task `[B]` in `tasks.md` with the failing command and the first line of its output.
3. Re-dispatch at most twice with the brief corrected for what failed. After the third failure on the same task, leave it `[B]` and continue with the next task.
4. Stop the phase when two tasks are blocked, and write `STOP` with both task IDs in `goal.md` section 4.
<!-- /ANCHOR:ai-execution -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Count bare hints plus value tokens for M2

**Status**: Accepted

**Context**: Phase 3 turns every core hint from a bare bracket into a value token that carries a `YOUR_VALUE_HERE` prefix. The phase 1 extractor looks for the bare form. On the final tree it reports zero for every hint a worker leaves as a token, so the delta would show an improvement that is only a change of spelling.

**Decision**: M2 is the sum of two occurrence counts over the same four documents. The first is `grep -F -o -f hints-v2.2.txt`. The second is the value token pattern in `tasks.md` T006, which runs from the token prefix to its closing bracket. A scratch test on one token line and one bare hint line printed `bare_hits=1`, `token_hits=1` and `total=2`, which shows the patterns are disjoint. Each unfilled instruction counts once, and the baseline side had no tokens, so the same sum reduces to the phase 1 count.

**Consequences**:
- The two sides share one definition and the delta measures work, not wording.
- A hint whose text phase 4 rewrites is still counted, because the token pattern does not depend on the old text.
- A future template form that is neither shape would need a third term. The report names the two shapes it counts.

**Alternatives Rejected**:
- Counting tokens only on the final side: the baseline count would be zero by construction.
- Counting old hints only: every token would read as a filled section.

### ADR-002: Name the report `model-eval--authoring-baseline`

**Status**: Accepted

**Context**: The benchmark report grammar is `<YYYY-MM-DD>--<subject>--<variant>`. The subject names the corpus the run measured. The variant names what distinguishes the run. A feature-scoped run names the feature, not the model, so a later run on another model can reuse the folder shape.

**Decision**: The subject is `model-eval` and the variant is `authoring-baseline`. The folder is `.skilled/skills/system-spec-kit/benchmark/reports/$DATE--model-eval--authoring-baseline/`. The model and the effort are recorded inside `README.md` and `source.md`.

**Consequences**:
- The folder reads as a model evaluation of the authoring baseline rather than as a playbook run.
- A rerun after a later template change uses a new date and the same variant.

**Alternatives Rejected**:
- `manual-testing-playbook` as the subject: this run executes no playbook scenario.
- The model name in the variant: the folder would have to be renamed to compare a second model.

### ADR-003: Freeze the run task and the measured documents

**Status**: Accepted

**Context**: A delta is only meaningful when both sides answer the same question under the same measurement.

**Decision**: The task text in `tasks.md` T005 is copied byte for byte from `../001-template-drift-census-and-baseline/tasks.md` T009. The measured documents stay `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md`. The throwaway tracks stay separate, `zz-bench-hints` for the vocabulary and `zz-bench-authoring` for the runs.

**Consequences**:
- The two `baseline.json` files are comparable field by field.
- A defect in the frozen text is measured on both sides and does not bias the delta.
- A later packet that wants a different task starts a new baseline rather than editing this one.

**Alternatives Rejected**:
- Adding a sentence about value tokens to the task: it teaches the final side something the baseline side never saw.

### ADR-004: Phase 9 writes both changelog modes

**Status**: Accepted

**Context**: Every phase spec carries the same template line that points at `../changelog/`. The phase 5 and phase 6 goal logs record that phase 9 writes the packet changelog. No earlier phase writes a global component entry.

**Decision**: This phase writes the global entry `.skilled/changelog/system-spec-kit/v2.9.0.0.md` in compact format, and runs the nested generator twice, once for the packet root and once for this phase child. It also moves the version carrier `.skilled/skills/system-spec-kit/SKILL.md` to `2.9.0.0`.

**Consequences**:
- One release entry describes the whole packet to a reader of the component changelog.
- The root nested changelog rolls up the earlier phase folders from their own summaries.
- The operator gets one version bump for the packet rather than one per phase.

**Alternatives Rejected**:
- One global entry per phase: the reader would see eight entries for one release and the version would jump eight times.
- Hand-writing the nested files: the generator is the write path named by the workflow.

### ADR-005: Prove parent criterion 3 on the frozen phase 3 folder list

**Status**: Accepted

**Context**: The criterion says recursive strict validation over `specs/` gives the same pass and fail counts before phase 3 and after phase 9. The tree gains packets between those two points, including this packet and the write-recipe child, so a live walk compares different populations.

**Decision**: Rerun the phase 3 census over its frozen `folders.txt` with its own `strict-census.mjs`, and compare the per-folder verdict column with `b-before.tsv`. Two identical count lines prove the criterion for the population that existed before the gate. A live recursive walk is reported separately as the packet gate, never as the criterion proof.

**Consequences**:
- The proof compares the same folders twice.
- A packet added later cannot change the verdict of the criterion.
- The report states the population in one sentence, so a reader is not misled.

**Alternatives Rejected**:
- A live recursive walk over `specs/`: its counts grow with every new packet and can never be equal.
- Comparing only the 054 packet: the criterion names `specs/`, not one packet.

### ADR-006: Identify the added playbook scenarios from the packet diff

**Status**: Accepted

**Context**: Phase 8 writes a report whose folder is dated at execution time and phase 7 writes the scenario files. This phase is authored before either file name exists.

**Decision**: Parent criterion 6 reads the scenario files this packet added or changed with `git diff --name-only <start commit> -- .skilled/skills/system-spec-kit/manual-testing-playbook/` plus `git ls-files --others --exclude-standard -- .skilled/skills/system-spec-kit/manual-testing-playbook/`, takes each id from its folder-derived slug, the parent folder name plus the file name, and looks up the verdict in the newest `*--manual-testing-playbook--*` report whose `source.md` names this packet. The lookup also accepts the numeric title prefix, because the phase 8 report writes the scenario number as `scenario_id`. `<start commit>` is the phase start commit T003 records. A FAIL counts only when `../008-playbook-run-in-worktree/goal.md` section 4 names the same id with an escalation.

**Consequences**:
- The proof does not depend on a folder name or a scenario id that this plan cannot know.
- A missing report or a missing verdict prints a named failure, and the parent criterion stays unticked.
- A scenario added outside the playbook folder is not counted. Phase 7 owns that folder by scope.

**Alternatives Rejected**:
- A hardcoded list of scenario ids: it would be wrong the moment phase 7 renames one.
- Counting every row in the report: it would include scenarios this packet never touched.

---
