# Workflow run: the plan, CANCELLED on no, OK on yes

This records two runs of `/doctor:sk-skill convert` driven at the workflow level, not at the engine level. Each run read `.skilled/commands/doctor/sk-skill.md`, bound the `convert` route from `.skilled/commands/doctor/_routes.yaml`, then executed `.skilled/commands/doctor/assets/doctor-sk-skill-convert.yaml` phase by phase, rendering every visible line from `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt`.

The packet's acceptance criteria carry this as AC-005, the conversion criterion. The goal's completion list carries the same criterion as the bullet for a scratch plain skill and a scratch pre-migration skill. The brief for this run restates it at the workflow level: a scratch convert prints a plan, then CANCELLED on no and OK on yes.

Run 1 answers every question with the value the plan proposed, then declines the conversion. Run 2 is a fresh copy of the same repository, answers the same questions the same way, and accepts the conversion.

Both runs happened in temporary repositories outside this checkout, under the operator scratch folder. Absolute operator paths are shortened to `runs/run1/` and `runs/run2/`, as the phase 10 evidence document already does. An angle-bracket name such as `<scratch>` or `<message>` stands in for one long path or text this document shortens, never for a value that was not read from the run.

---

## 1. The harness

The tree is worktree `293-doctor-sk-skill-release` at `5dc15c537385ce2a40d7b1797b23b3c8afea9f22`, the head the brief's own build step names (`git archive HEAD`). The workspace branch is one commit behind `origin/main` at `10ae51d682`. That commit changes four trigger-index data files and nothing else, and none of them is on the conversion surface, so the code these runs exercise is the code on main:

```text
$ git -c core.fsmonitor=false diff --name-only 5dc15c5373 main
.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json
.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json
.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json
.skilled/skills/system-spec-kit/runtime/data/trigger-index.json
```

The harness is the one the earlier phase 10 runs used, rebuilt from scratch:

1. `git archive HEAD | tar -x` into `runs/run1`.
2. The build outputs and dependency trees git does not carry were borrowed from this worktree, as before: `node_modules` linked for `system-spec-kit` and for the advisor runtime, the two `dist` trees copied, and `sk-doc` given the relative `@spec-kit/shared` link its scripts resolve through.
3. A plain skill was added at `incoming/bellwether-stock-check/`, an invented name with no Skilled metadata, holding `SKILL.md` and `references/Shelf Count Notes.md`.
4. One commit recorded the tree and that skill.

```text
$ git init -q && git add -A
$ git -c user.name=t -c user.email=t@t commit -F <message>
exit=0
$ git -c core.fsmonitor=false log --oneline
51b23e3 chore(fixture): record the tree with the scratch plain skill
$ git -c core.fsmonitor=false status --porcelain | wc -l
0
$ git -c core.fsmonitor=false ls-tree -r --name-only HEAD | wc -l
122403
```

The first fixture commit was refused by the repository's own commit-message contract, which runs in the temporary repository too: a 101-character subject failed the 100-character limit and the message carried no prose body. The committed message is the compliant second attempt. No git config was written; every identity travelled on the command line with `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false`.

`runs/run2` is a copy of that committed repository, taken before run 1 changed anything. The copy raced with git's background repack of `run1`, so the object files printed copy warnings. The copy was verified rather than assumed:

```text
$ git -C run1 rev-parse HEAD; git -C run1 rev-parse HEAD^{tree}
51b23e3b34fa082d452f06c4c172cbb232acb4c1
cb08632969d013564cf42ead31ab2ecf3ccf53e8
$ git -C run2 rev-parse HEAD; git -C run2 rev-parse HEAD^{tree}
51b23e3b34fa082d452f06c4c172cbb232acb4c1
cb08632969d013564cf42ead31ab2ecf3ccf53e8
$ git -C run2 status --porcelain | wc -l
0
$ git -C run2 fsck --no-progress --no-dangling; echo exit=$?
exit=0
```

One environment fact shapes how the edge question is asked in both runs. The advisor answers only when a daemon is warm for that workspace root, and a fresh temporary repository has none, so the engine's probe exits 75 and the plan prints its documented unavailable branch:

```text
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"bellwether stock check"}' --warm-only --format json
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/system-skill-advisor/bebc7582b33f/daemon-ipc.sock",
  "exitCode": 75
}
exit=75
```

The presentation contract covers that case: the question asks the operator to name a public skill of this skills root instead of offering a proposal. Both runs follow it, and the operator names `sk-code`.

---

## 2. Run 1: the plan, the questions, and the declined conversion

### 2.1 Phase 1, the assets

All nine assets the workflow reads were present in the temporary repository: the convert engine and its three libraries, the check engine, the router template, the convert YAML, the presentation contract and the route manifest. The target `SKILL.md` was read only to recognise which follow-ups were coming: the description is 76 characters against a 130-character budget, so no trim question could arise, and no `allowed-tools` field is declared, so the allowed-tools question would.

### 2.2 Phase 2, the first plan is a follow-up, not a refusal

```text
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan incoming/bellwether-stock-check
INTENT_SIGNALS_BELOW_FLOOR: Only 0 approved intent phrase(s) were supplied; at least 8 are required. Suggested phrases: ["Checks a bellwether stock count and decides whether a shelf needs a recount."]. Pass repeated --approved-phrase values.
exit=1
```

The engine suggests one sentence, which is one phrase. The workflow asks the intent-phrase question, shows that suggestion on its own line, and requires at least eight distinct phrases of three or more words before it accepts an answer. The operator edits the list to eight phrases drawn from the skill's own body vocabulary.

### 2.3 Question 1, the intent phrases

```text
Approve these 8 intent phrases as this skill's PRIMARY keywords? [yes/no]
- bellwether stock check
- shelf count review
- stock count comparison
- shelf recount request
- marked aisle lookup
- stock adjustment audit
- count sheet check
- shelf tally lookup
```

Answer: yes, with all eight phrases. Each approved phrase becomes one repeated `--approved-phrase` value, and the plan is rerun with no write switch:

```text
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply incoming/bellwether-stock-check \
    --approved-phrase "bellwether stock check" --approved-phrase "shelf count review" \
    --approved-phrase "stock count comparison" --approved-phrase "shelf recount request" \
    --approved-phrase "marked aisle lookup" --approved-phrase "stock adjustment audit" \
    --approved-phrase "count sheet check" --approved-phrase "shelf tally lookup"
Conversion plan: bellwether-stock-check
1. Copy the source under frontmatter name bellwether-stock-check; source remains unchanged. Copy: runs/run1/incoming/bellwether-stock-check -> runs/run1/.skilled/skills/bellwether-stock-check
2. Render ROUTER.md with PRIMARY keywords ["bellwether stock check","shelf count review","stock count comparison","shelf recount request","marked aisle lookup","stock adjustment audit","count sheet check","shelf tally lookup"] and RESOURCE_MAP ["references/shelf-count-notes.md"] in body order. Create: runs/run1/.skilled/skills/bellwether-stock-check/ROUTER.md
3. Workflow agent must reshape SKILL.md, then provide --agent-output before apply.
4. Snapshot the source body and require every non-heading line to survive in SKILL.md, ROUTER.md, or references/.
5. Rename references/Shelf Count Notes.md to references/shelf-count-notes.md, add resource frontmatter, and rewrite links.
6. Run init_skill.py into os.tmpdir() and copy only absent metadata and scaffold files; write the approved phrases.
7. Run ci-skill-root-metadata.cjs --fix --skills-dir runs/run1/.skilled/skills --skill bellwether-stock-check.
8. Run regenerate-skill-derived.cjs --root runs/run1/.skilled/skills/bellwether-stock-check --write.
9. Run package_skill.py runs/run1/.skilled/skills/bellwether-stock-check --check --strict, then validate_skill_package.py runs/run1/.skilled/skills/bellwether-stock-check.
Backup existing files under: runs/run1/.skilled/skills/.state/doctor-sk-skill/bellwether-stock-check/<timestamp>
Approved intent phrases (8): ["bellwether stock check","shelf count review","stock count comparison","shelf recount request","marked aisle lookup","stock adjustment audit","count sheet check","shelf tally lookup"]
Suggested intent phrases (approve with repeated --approved-phrase values): ["Checks a bellwether stock count and decides whether a shelf needs a recount."]
allowed-tools: approval required; propose ["Read","Grep","Glob"]
No allowed-tools field will be written until approved with repeated --allowed-tool values or one --allowed-tools list.
edges: approval required; the advisor is unavailable, so name the target with --edge enhances:<skill>
No edge is written until one is approved with --edge enhances:<skill>.
RESOURCE_MAP order: ["references/shelf-count-notes.md"]
Integration plan: bellwether-stock-check
I1 advisor discovery: run node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted.
I1 advisor discovery: if that scan cannot run, /doctor:skill-advisor rebuild is the operator's next step; this command never runs it.
I2 compiled skill graph: Overwrite .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json by running python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --export-json (a tracked-file write).
I3 router reach and budget: probe 3 approved phrase(s) with advisor_recommend --warm-only and report where bellwether-stock-check ranks: "bellwether stock check", "shelf count review", "stock count comparison".
I3 router reach and budget: description budget 76/130 characters.
I4 regression corpus: append 3 case row(s) to .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl (a framework skill in this repository).
I4 proposed row: {"id":"P0-BELLWETHER-STOCK-CHECK-001","priority":"P0","prompt":"bellwether stock check","confidence_only":false,"expect_result":true,"expected_top_any":["bellwether-stock-check"],"expect_kind":"skill","allow_command_bridge":false}
I4 proposed row: {"id":"P1-BELLWETHER-STOCK-CHECK-001","priority":"P1","prompt":"shelf count review","confidence_only":false,"expect_result":true,"expected_top_any":["bellwether-stock-check"],"expect_kind":"skill","allow_command_bridge":false}
I4 proposed row: {"id":"P1-BELLWETHER-STOCK-CHECK-002","priority":"P1","prompt":"stock count comparison","confidence_only":false,"expect_result":true,"expected_top_any":["bellwether-stock-check"],"expect_kind":"skill","allow_command_bridge":false}
I5 runtime mirrors: run node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs, then node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check for Hermes.
I5 runtime mirrors: Claude, OpenCode, Pi, Devin are whole-directory links to .skilled/skills and need no write.
I6 changelog: Create .skilled/skills/bellwether-stock-check/changelog/v1.0.0.0.md.
I6 changelog: Create the relative link .skilled/changelog/bellwether-stock-check -> ../skills/bellwether-stock-check/changelog.
Apply gate: no writes without --apply.
exit=0
```

That output is the first printed plan. Two of its lines are the next two questions, not refusals: `allowed-tools: approval required; propose ["Read","Grep","Glob"]` and `edges: approval required; the advisor is unavailable, so name the target with --edge enhances:<skill>`. The engine's proposal carries no `Bash`, because the source folder holds no `scripts/` folder.

### 2.4 Question 2, the allowed-tools list

```text
Declare allowed-tools as ["Read","Grep","Glob"] for this skill? [yes/no]
```

Answer: yes, the list the line printed, read back in full and not edited. The plan is rerun with the list added:

```text
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply incoming/bellwether-stock-check \
    --approved-phrase "bellwether stock check" --approved-phrase "shelf count review" \
    --approved-phrase "stock count comparison" --approved-phrase "shelf recount request" \
    --approved-phrase "marked aisle lookup" --approved-phrase "stock adjustment audit" \
    --approved-phrase "count sheet check" --approved-phrase "shelf tally lookup" \
    --allowed-tools "Read,Grep,Glob"
```

The run printed exit 0 and the plan line changed:

```text
allowed-tools: ["Read","Grep","Glob"]
edges: approval required; the advisor is unavailable, so name the target with --edge enhances:<skill>
Apply gate: no writes without --apply.
```

The remaining lines matched the first plan line for line. The address of the run directory is the only other difference, and every block below is shortened the same way.

### 2.5 Question 3, the one edge

```text
Approve sk-code as the skill this one enhances? [yes/no]
```

The plan proposed no name, because its advisor line reported the backend unavailable. The presentation contract answers that case by asking the operator to name a public skill of this skills root, so the operator names `sk-code`. Only `--edge enhances:<skill>` is accepted, and the workflow composes no other type. The plan is rerun with the edge:

```text
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply incoming/bellwether-stock-check \
    --approved-phrase "bellwether stock check" --approved-phrase "shelf count review" \
    --approved-phrase "stock count comparison" --approved-phrase "shelf recount request" \
    --approved-phrase "marked aisle lookup" --approved-phrase "stock adjustment audit" \
    --approved-phrase "count sheet check" --approved-phrase "shelf tally lookup" \
    --allowed-tools "Read,Grep,Glob" --edge enhances:sk-code
```

Exit 0, and the edge line became the approved write:

```text
allowed-tools: ["Read","Grep","Glob"]
edges: enhances -> sk-code (the approved edge, weight 0.3)
Apply gate: no writes without --apply.
```

### 2.6 The agent step and the preservation proof

A plain skill needs its prose reshaped before the format gate, and the workflow agent writes that prose to the one scratch root the plain path uses: `.skilled/skills/.state/doctor-sk-skill/bellwether-stock-check/scratch/agent-output.md`. The agent kept the source frontmatter block and rewrote the body only, and every original body line stayed word for word.

The proof copies the source `SKILL.md` and its references into `scratch/snapshot/`, copies the agent's `SKILL.md` and the same references into `scratch/staging/`, and compares them:

```text
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs preserve --snapshot <scratch>/snapshot <scratch>/staging
Preservation PASS: 6 original body line(s) found.
exit=0
```

### 2.7 The plan the operator approved

The plan is rerun once more with every approved flag and nothing else, still with no write switch:

```text
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply incoming/bellwether-stock-check \
    --approved-phrase "bellwether stock check" --approved-phrase "shelf count review" \
    --approved-phrase "stock count comparison" --approved-phrase "shelf recount request" \
    --approved-phrase "marked aisle lookup" --approved-phrase "stock adjustment audit" \
    --approved-phrase "count sheet check" --approved-phrase "shelf tally lookup" \
    --allowed-tools "Read,Grep,Glob" --edge enhances:sk-code \
    --agent-output <scratch>/agent-output.md
Conversion plan: bellwether-stock-check
1. Copy the source under frontmatter name bellwether-stock-check; source remains unchanged. Copy: runs/run1/incoming/bellwether-stock-check -> runs/run1/.skilled/skills/bellwether-stock-check
2. Render ROUTER.md with PRIMARY keywords ["bellwether stock check","shelf count review","stock count comparison","shelf recount request","marked aisle lookup","stock adjustment audit","count sheet check","shelf tally lookup"] and RESOURCE_MAP ["references/shelf-count-notes.md"] in body order. Create: runs/run1/.skilled/skills/bellwether-stock-check/ROUTER.md
3. Use workflow agent prose from runs/run1/.skilled/skills/.state/doctor-sk-skill/bellwether-stock-check/scratch/agent-output.md.
4. Snapshot the source body and require every non-heading line to survive in SKILL.md, ROUTER.md, or references/.
5. Rename references/Shelf Count Notes.md to references/shelf-count-notes.md, add resource frontmatter, and rewrite links.
6. Run init_skill.py into os.tmpdir() and copy only absent metadata and scaffold files; write the approved phrases.
7. Run ci-skill-root-metadata.cjs --fix --skills-dir runs/run1/.skilled/skills --skill bellwether-stock-check.
8. Run regenerate-skill-derived.cjs --root runs/run1/.skilled/skills/bellwether-stock-check --write.
9. Run package_skill.py runs/run1/.skilled/skills/bellwether-stock-check --check --strict, then validate_skill_package.py runs/run1/.skilled/skills/bellwether-stock-check.
Backup existing files under: runs/run1/.skilled/skills/.state/doctor-sk-skill/bellwether-stock-check/<timestamp>
Approved intent phrases (8): ["bellwether stock check","shelf count review","stock count comparison","shelf recount request","marked aisle lookup","stock adjustment audit","count sheet check","shelf tally lookup"]
Suggested intent phrases (approve with repeated --approved-phrase values): ["Checks a bellwether stock count and decides whether a shelf needs a recount."]
allowed-tools: ["Read","Grep","Glob"]
edges: enhances -> sk-code (the approved edge, weight 0.3)
RESOURCE_MAP order: ["references/shelf-count-notes.md"]
Integration plan: bellwether-stock-check
I1 advisor discovery: run node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted.
I1 advisor discovery: if that scan cannot run, /doctor:skill-advisor rebuild is the operator's next step; this command never runs it.
I2 compiled skill graph: Overwrite .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json by running python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --export-json (a tracked-file write).
I3 router reach and budget: probe 3 approved phrase(s) with advisor_recommend --warm-only and report where bellwether-stock-check ranks: "bellwether stock check", "shelf count review", "stock count comparison".
I3 router reach and budget: description budget 76/130 characters.
I4 regression corpus: append 3 case row(s) to .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl (a framework skill in this repository).
I4 proposed row: {"id":"P0-BELLWETHER-STOCK-CHECK-001","priority":"P0","prompt":"bellwether stock check","confidence_only":false,"expect_result":true,"expected_top_any":["bellwether-stock-check"],"expect_kind":"skill","allow_command_bridge":false}
I4 proposed row: {"id":"P1-BELLWETHER-STOCK-CHECK-001","priority":"P1","prompt":"shelf count review","confidence_only":false,"expect_result":true,"expected_top_any":["bellwether-stock-check"],"expect_kind":"skill","allow_command_bridge":false}
I4 proposed row: {"id":"P1-BELLWETHER-STOCK-CHECK-002","priority":"P1","prompt":"stock count comparison","confidence_only":false,"expect_result":true,"expected_top_any":["bellwether-stock-check"],"expect_kind":"skill","allow_command_bridge":false}
I5 runtime mirrors: run node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs, then node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check for Hermes.
I5 runtime mirrors: Claude, OpenCode, Pi, Devin are whole-directory links to .skilled/skills and need no write.
I6 changelog: Create .skilled/skills/bellwether-stock-check/changelog/v1.0.0.0.md.
I6 changelog: Create the relative link .skilled/changelog/bellwether-stock-check -> ../skills/bellwether-stock-check/changelog.
Apply gate: no writes without --apply.
exit=0
```

Rendered through the presentation contract:

```text
SKILL CONVERSION PLAN
Skill: bellwether-stock-check
Folder: runs/run1/.skilled/skills/bellwether-stock-check, created by this plan; the source at runs/run1/incoming/bellwether-stock-check stays as it is
Steps:
  1. Copy: incoming/bellwether-stock-check -> .skilled/skills/bellwether-stock-check
  2. Create: .skilled/skills/bellwether-stock-check/ROUTER.md, with the eight approved PRIMARY keywords and RESOURCE_MAP ["references/shelf-count-notes.md"]
  3. Use the workflow agent prose from scratch/agent-output.md
  4. Snapshot the source body and require every non-heading line to survive
  5. Rename references/Shelf Count Notes.md to references/shelf-count-notes.md and rewrite the links
  6. Run init_skill.py into os.tmpdir() and copy only absent metadata and scaffold files
  7. Run ci-skill-root-metadata.cjs --fix for this root
  8. Run regenerate-skill-derived.cjs --write for this root
  9. Run package_skill.py --check --strict, then validate_skill_package.py
Backup folder: runs/run1/.skilled/skills/.state/doctor-sk-skill/bellwether-stock-check/<timestamp>
Integration plan: I1 advisor discovery, I2 compiled skill graph, I3 router reach and budget, I4 regression corpus, I5 runtime mirrors, I6 changelog
Engine follow-ups: none

Field values approved in this run:
- Intent phrases: ["bellwether stock check","shelf count review","stock count comparison","shelf recount request","marked aisle lookup","stock adjustment audit","count sheet check","shelf tally lookup"]
- Description: within budget at 76 characters, so no trim was asked
- allowed-tools: ["Read","Grep","Glob"]
- Edge: enhances -> sk-code

Convert this skill now? [yes/no]
```

### 2.8 Question 4, the conversion, answered no

The operator reads the plan above and answers no. Any answer other than yes is a no. The workflow deletes the scratch root it created, and writes nothing else:

```text
$ rm <scratch>/agent-output.md
$ rm <scratch>/snapshot/SKILL.md
$ rm "<scratch>/snapshot/references/Shelf Count Notes.md"
$ rm <scratch>/staging/SKILL.md
$ rm "<scratch>/staging/references/Shelf Count Notes.md"
$ rmdir <scratch>/snapshot/references <scratch>/snapshot <scratch>/staging/references <scratch>/staging <scratch>
$ rmdir .skilled/skills/.state/doctor-sk-skill/bellwether-stock-check .skilled/skills/.state/doctor-sk-skill
exit=0
$ ls -d <scratch>
ls: <scratch>: No such file or directory
$ ls .skilled/skills/.state
advisor
authority
completion-sentinel
goal
loop-guard
smart-router-telemetry
spec-gate
```

Each file was removed by name rather than by a recursive delete, and the empty directories followed, so `.skilled/skills/.state` holds exactly the seven tracked folders it held before the run. The staged skill folder, the changelog link and every integration target were never written.

Rendered result:

```text
DOCTOR TARGET CANCELLED
Target: convert
Skill: bellwether-stock-check
Declined: the conversion
Changed: none
STATUS=CANCELLED ACTION=cancelled
```

### 2.9 Status before and after

```text
$ git -c core.fsmonitor=false status --porcelain   # before the first read
                                              # 0 lines
$ git -c core.fsmonitor=false status --porcelain   # before the conversion question
                                              # 0 lines
$ git -c core.fsmonitor=false status --porcelain   # after the cancellation
                                              # 0 lines
$ diff <before> <after>
identical to the pre-run read
$ ls -d .skilled/skills/bellwether-stock-check
ls: .skilled/skills/bellwether-stock-check: No such file or directory
$ ls -l .skilled/changelog/bellwether-stock-check
ls: .skilled/changelog/bellwether-stock-check: No such file or directory
```

Run 1 ends `STATUS=CANCELLED ACTION=cancelled`, with the tree identical to the one the run started from.

---

## 3. Run 2: the same questions answered yes, then the apply

`runs/run2` starts from the same commit as run 1, its tree hash and its clean status read above. The workflow runs again from phase 1.

### 3.1 The plan and the questions

```text
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan incoming/bellwether-stock-check
INTENT_SIGNALS_BELOW_FLOOR: Only 0 approved intent phrase(s) were supplied; at least 8 are required. Suggested phrases: ["Checks a bellwether stock count and decides whether a shelf needs a recount."]. Pass repeated --approved-phrase values.
exit=1
```

The questions, and the answers given, are the three from run 1 in the same order: the eight intent phrases, the proposed `allowed-tools` list `["Read","Grep","Glob"]`, and the operator-named edge `enhances: sk-code`, because the advisor line reports the backend unavailable again. Each answer reruns the plan with the flags approved so far and no write switch.

Every engine line is byte-identical to run 1's, apart from the run directory inside the paths. The check was a diff of each pair of logs after normalising that directory, and the only lines that differed were the exit markers this harness writes itself:

```text
$ diff <run1 step> <run2 step>    # operator paths normalised to RUN/
01 plan                             0 differing lines
02 rerun after the phrases          0 differing lines
03 rerun after the allowed-tools    1 differing line, the exit marker
04 rerun after the edge             1 differing line, the exit marker
05 preserve                         0 differing lines
06 rerun with every approved flag   0 differing lines
```

Run 2's engine output for the two reruns whose markers differed:

```text
$ grep '^allowed-tools:\|^edges:\|^Apply gate:' <run2 step 03>
allowed-tools: ["Read","Grep","Glob"]
edges: approval required; the advisor is unavailable, so name the target with --edge enhances:<skill>
Apply gate: no writes without --apply.
$ grep '^allowed-tools:\|^edges:\|^Apply gate:' <run2 step 04>
allowed-tools: ["Read","Grep","Glob"]
edges: enhances -> sk-code (the approved edge, weight 0.3)
Apply gate: no writes without --apply.
```

### 3.2 The agent step and the preservation proof

The reshaped prose went to the same scratch path in this run, and the same proof ran against it:

```text
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs preserve --snapshot <scratch>/snapshot <scratch>/staging
Preservation PASS: 6 original body line(s) found.
exit=0
```

### 3.3 The plan the operator approved

```text
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply incoming/bellwether-stock-check \
    --approved-phrase "bellwether stock check" --approved-phrase "shelf count review" \
    --approved-phrase "stock count comparison" --approved-phrase "shelf recount request" \
    --approved-phrase "marked aisle lookup" --approved-phrase "stock adjustment audit" \
    --approved-phrase "count sheet check" --approved-phrase "shelf tally lookup" \
    --allowed-tools "Read,Grep,Glob" --edge enhances:sk-code \
    --agent-output <scratch>/agent-output.md
Conversion plan: bellwether-stock-check
1. Copy the source under frontmatter name bellwether-stock-check; source remains unchanged. Copy: runs/run2/incoming/bellwether-stock-check -> runs/run2/.skilled/skills/bellwether-stock-check
2. Render ROUTER.md with PRIMARY keywords ["bellwether stock check","shelf count review","stock count comparison","shelf recount request","marked aisle lookup","stock adjustment audit","count sheet check","shelf tally lookup"] and RESOURCE_MAP ["references/shelf-count-notes.md"] in body order. Create: runs/run2/.skilled/skills/bellwether-stock-check/ROUTER.md
3. Use workflow agent prose from runs/run2/.skilled/skills/.state/doctor-sk-skill/bellwether-stock-check/scratch/agent-output.md.
4. Snapshot the source body and require every non-heading line to survive in SKILL.md, ROUTER.md, or references/.
5. Rename references/Shelf Count Notes.md to references/shelf-count-notes.md, add resource frontmatter, and rewrite links.
6. Run init_skill.py into os.tmpdir() and copy only absent metadata and scaffold files; write the approved phrases.
7. Run ci-skill-root-metadata.cjs --fix --skills-dir runs/run2/.skilled/skills --skill bellwether-stock-check.
8. Run regenerate-skill-derived.cjs --root runs/run2/.skilled/skills/bellwether-stock-check --write.
9. Run package_skill.py runs/run2/.skilled/skills/bellwether-stock-check --check --strict, then validate_skill_package.py runs/run2/.skilled/skills/bellwether-stock-check.
Backup existing files under: runs/run2/.skilled/skills/.state/doctor-sk-skill/bellwether-stock-check/<timestamp>
Approved intent phrases (8): ["bellwether stock check","shelf count review","stock count comparison","shelf recount request","marked aisle lookup","stock adjustment audit","count sheet check","shelf tally lookup"]
Suggested intent phrases (approve with repeated --approved-phrase values): ["Checks a bellwether stock count and decides whether a shelf needs a recount."]
allowed-tools: ["Read","Grep","Glob"]
edges: enhances -> sk-code (the approved edge, weight 0.3)
RESOURCE_MAP order: ["references/shelf-count-notes.md"]
Integration plan: bellwether-stock-check
I1 advisor discovery: run node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted.
I1 advisor discovery: if that scan cannot run, /doctor:skill-advisor rebuild is the operator's next step; this command never runs it.
I2 compiled skill graph: Overwrite .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json by running python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --export-json (a tracked-file write).
I3 router reach and budget: probe 3 approved phrase(s) with advisor_recommend --warm-only and report where bellwether-stock-check ranks: "bellwether stock check", "shelf count review", "stock count comparison".
I3 router reach and budget: description budget 76/130 characters.
I4 regression corpus: append 3 case row(s) to .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl (a framework skill in this repository).
I4 proposed row: {"id":"P0-BELLWETHER-STOCK-CHECK-001","priority":"P0","prompt":"bellwether stock check","confidence_only":false,"expect_result":true,"expected_top_any":["bellwether-stock-check"],"expect_kind":"skill","allow_command_bridge":false}
I4 proposed row: {"id":"P1-BELLWETHER-STOCK-CHECK-001","priority":"P1","prompt":"shelf count review","confidence_only":false,"expect_result":true,"expected_top_any":["bellwether-stock-check"],"expect_kind":"skill","allow_command_bridge":false}
I4 proposed row: {"id":"P1-BELLWETHER-STOCK-CHECK-002","priority":"P1","prompt":"stock count comparison","confidence_only":false,"expect_result":true,"expected_top_any":["bellwether-stock-check"],"expect_kind":"skill","allow_command_bridge":false}
I5 runtime mirrors: run node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs, then node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check for Hermes.
I5 runtime mirrors: Claude, OpenCode, Pi, Devin are whole-directory links to .skilled/skills and need no write.
I6 changelog: Create .skilled/skills/bellwether-stock-check/changelog/v1.0.0.0.md.
I6 changelog: Create the relative link .skilled/changelog/bellwether-stock-check -> ../skills/bellwether-stock-check/changelog.
Apply gate: no writes without --apply.
exit=0
```

Rendered through the presentation contract:

```text
SKILL CONVERSION PLAN
Skill: bellwether-stock-check
Folder: runs/run2/.skilled/skills/bellwether-stock-check, created by this plan; the source at runs/run2/incoming/bellwether-stock-check stays as it is
Steps:
  1. Copy: incoming/bellwether-stock-check -> .skilled/skills/bellwether-stock-check
  2. Create: .skilled/skills/bellwether-stock-check/ROUTER.md, with the eight approved PRIMARY keywords and RESOURCE_MAP ["references/shelf-count-notes.md"]
  3. Use the workflow agent prose from scratch/agent-output.md
  4. Snapshot the source body and require every non-heading line to survive
  5. Rename references/Shelf Count Notes.md to references/shelf-count-notes.md and rewrite the links
  6. Run init_skill.py into os.tmpdir() and copy only absent metadata and scaffold files
  7. Run ci-skill-root-metadata.cjs --fix for this root
  8. Run regenerate-skill-derived.cjs --write for this root
  9. Run package_skill.py --check --strict, then validate_skill_package.py
Backup folder: runs/run2/.skilled/skills/.state/doctor-sk-skill/bellwether-stock-check/<timestamp>
Integration plan: I1 advisor discovery, I2 compiled skill graph, I3 router reach and budget, I4 regression corpus, I5 runtime mirrors, I6 changelog
Engine follow-ups: none

Field values approved in this run:
- Intent phrases: ["bellwether stock check","shelf count review","stock count comparison","shelf recount request","marked aisle lookup","stock adjustment audit","count sheet check","shelf tally lookup"]
- Description: within budget at 76 characters, so no trim was asked
- allowed-tools: ["Read","Grep","Glob"]
- Edge: enhances -> sk-code

Convert this skill now? [yes/no]
```

### 3.4 Question 4 answered yes, and the apply

The operator answers yes to the conversion question on that plan. `git status --porcelain` read 0 lines before the apply. The apply reruns the same plan, then writes:

```text
$ git -c core.fsmonitor=false status --porcelain   # before the apply
                                              # 0 lines
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply incoming/bellwether-stock-check \
    --approved-phrase "bellwether stock check" --approved-phrase "shelf count review" \
    --approved-phrase "stock count comparison" --approved-phrase "shelf recount request" \
    --approved-phrase "marked aisle lookup" --approved-phrase "stock adjustment audit" \
    --approved-phrase "count sheet check" --approved-phrase "shelf tally lookup" \
    --allowed-tools "Read,Grep,Glob" --edge enhances:sk-code \
    --agent-output <scratch>/agent-output.md --apply
```

The apply printed the plan of section 3.3 first, line for line, then these lines:

```text
Converted bellwether-stock-check; preservation and the format gates passed, and 6 integration row(s) ran.
Backup: runs/run2/.skilled/skills/.state/doctor-sk-skill/bellwether-stock-check/2026-10-30T14-21-21-664Z
Snapshot: runs/run2/.skilled/skills/.state/doctor-sk-skill/bellwether-stock-check/2026-10-30T14-21-21-664Z/before
Converted skill: runs/run2/.skilled/skills/bellwether-stock-check
Preservation PASS: 6 original body line(s) found.
node runs/run2/.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix --skills-dir runs/run2/.skilled/skills --skill bellwether-stock-check (exit 0)
OK   [S] bellwether-stock-check  (wrote leaf-manifest.json, leaf-aliases.json)

checked=1 passed=1 failed=0 fixed=1
node runs/run2/.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root runs/run2/.skilled/skills/bellwether-stock-check --write (exit 0)
{
  "mode": "write",
  "total": 1,
  "changed": 0,
  "errored": 0,
  "results": [
    {
      "name": "bellwether-stock-check",
      "status": "unchanged"
    }
  ]
}
python3 runs/run2/.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py runs/run2/.skilled/skills/bellwether-stock-check --check --strict (exit 0)
🔍 Validating skill: bellwether-stock-check
(strict mode)
==================================================

✅ Skill is valid!

==================================================
Result: PASS
python3 runs/run2/.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py runs/run2/.skilled/skills/bellwether-stock-check (exit 0)
Skill: runs/run2/.skilled/skills/bellwether-stock-check
Detected kind: standalone
- package_skill.py --check: PASS (exit 0)
I1 advisor discovery: scanned; the advisor reads the new root. Manual fallback: /doctor:skill-advisor rebuild.
I2 compiled skill graph: recompiled; .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json is current.
I3 router reach and budget: "bellwether stock check" -> bellwether-stock-check ranks 1 of 1 above the bar.
I3 router reach and budget: "shelf count review" -> bellwether-stock-check ranks 1 of 3 above the bar.
I3 router reach and budget: "stock count comparison" -> bellwether-stock-check ranks 1 of 1 above the bar.
I3 router reach and budget: description budget 76/130 characters.
I4 regression corpus: appended 3 case row(s) to .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl.
I5 runtime mirrors: Hermes synced and checked (PASS: 66 Hermes skill copies in sync).
I6 changelog: created .skilled/skills/bellwether-stock-check/changelog/v1.0.0.0.md.
I6 changelog: created .skilled/changelog/bellwether-stock-check -> ../skills/bellwether-stock-check/changelog.
Undo:
  cp "runs/run2/.skilled/skills/.state/doctor-sk-skill/bellwether-stock-check/2026-10-30T14-21-21-664Z/integration/skill-graph.json-325e22f11009" "runs/run2/.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json"
  cp "runs/run2/.skilled/skills/.state/doctor-sk-skill/bellwether-stock-check/2026-10-30T14-21-21-664Z/integration/skill-advisor-regression-cases.jsonl-1f39b0499ced" "runs/run2/.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl"
  rm -r "runs/run2/.hermes/skills"
  cp -R "runs/run2/.skilled/skills/.state/doctor-sk-skill/bellwether-stock-check/2026-10-30T14-21-21-664Z/integration/skills-27e422c58e3c" "runs/run2/.hermes/skills"
  rm "runs/run2/.skilled/skills/bellwether-stock-check/changelog/v1.0.0.0.md"
  rm "runs/run2/.skilled/changelog/bellwether-stock-check"
  rm -r "runs/run2/.skilled/skills/bellwether-stock-check"
Check: node "runs/run2/.skilled/commands/doctor/scripts/sk-skill-check.cjs" check "runs/run2/.skilled/skills/bellwether-stock-check"
exit=0
```

Exit 0, with `Backup:`, `Snapshot:`, `Converted skill:` and `Preservation PASS:` printed for this path, nine command lines each carrying its own exit, six integration rows reporting, and the engine's undo block last.

### 3.5 Phase 6, the re-read, and the four checks after the run

The converted root is `.skilled/skills/bellwether-stock-check`, the path the `Converted skill:` line printed. It was re-read through the read-only check engine with `--json`, not the outside source:

```text
$ node .skilled/commands/doctor/scripts/sk-skill-check.cjs .skilled/skills/bellwether-stock-check --json
```

Fields read from that report: `mode` deep, `exitCode` 0, `findingCount` 0, `unknownCount` 0, 13 rows, and the row statuses are `PASS` and `INFO` only. The rows themselves are printed in text mode by the fourth check below.

The four checks the brief names, run in this order:

```text
=== node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check ===
PASS: 66 Hermes skill copies in sync
exit=0

=== node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict ===
Skill-graph freshness panel (read-only)
  compiled skill-graph.json : 14 skills, generated_at 2026-10-30T14:21:22.807674+00:00
  SQLite skill-graph.sqlite : 14 nodes
  on-disk graph-metadata    : 14 skills (source of truth)
  scan rule                 : depth-1 only (direct children of .skilled/skills); nested folders are not read
  STALE COMPILED: none (generated_at 2026-10-30T14:21:22.807674+00:00, newest source stamp 2026-10-30T14:21:21.706427+00:00)
  UNREADABLE graph-metadata: none
  ZOMBIE (in SQLite, not on disk): none
  MISSING (on disk, not in SQLite): none
  FAMILY MISMATCH SQLite vs disk: none
  GHOST (in compiled json, not on disk): none
  MISSING (on disk, not in compiled json): none
  FAMILY MISMATCH compiled vs disk: none
  SIGNAL DRIFT compiled vs disk: none
  NULL derived timestamp: none
  (report-only — the canonical reindex is operator-gated; nothing was written)
exit=0
```

```text
=== ls .skilled/changelog/bellwether-stock-check/ ===
v1.0.0.0.md
exit=0
readlink: ../skills/bellwether-stock-check/changelog

=== node .skilled/commands/doctor/scripts/sk-skill-check.cjs check bellwether-stock-check ===
Skill check: bellwether-stock-check (canon)

C1  PASS    Location: Direct child of the skills root.
C2  PASS    Input kind: Resolver verdict: router-md; input kind: canon.
C3  PASS    Format: Strict package validation passed.
C4  PASS    Root metadata: Root metadata contract passed.
C5  PASS    Intent signals: The intent signals differ from the scaffold defaults.
C6  PASS    Derived freshness: Generated derived content is current.
C7  PASS    Router equivalence: Parsed 1 intent signal groups and 1 resource-map entries.
C8  INFO    Advisor home: Skill graph validates and its compiled view is fresh. Advisor queries completed; the skill appeared in 3 of 3 result(s).
C9  PASS    Runtime mirrors: Runtime mirror status: Claude:pass, OpenCode:pass, Pi:pass, Devin:pass, Hermes:pass, Codex:n/a, Cursor:n/a.
C10 PASS    Changelog: The versioned changelog and index link resolve.
C11 PASS    Description budget: Description is OK at 76 characters.
C12 PASS    Collisions: No duplicate, reserved-prefix or runtime-persona collision found.
C13 INFO    Regression coverage: Regression corpus contains 3 matching cases.

Result: PASS
exit=0
```

### 3.6 The rendered converted result

```text
DOCTOR MUTATING RESULT
Target: convert
Skill: bellwether-stock-check
Files changed: .skilled/skills/bellwether-stock-check/, created with SKILL.md, ROUTER.md, graph-metadata.json, leaf-manifest.json, leaf-aliases.json, leaf-manifest.config.json, references/shelf-count-notes.md, changelog/v1.0.0.0.md, benchmark/ and manual-testing-playbook/
               .skilled/changelog/bellwether-stock-check, the relative link to that changelog folder
               .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json, overwritten by this run's own scan
               .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl, three case rows appended
               .hermes/skills/bellwether-stock-check/, created by the Hermes sync
Verification: Result: PASS, 13 rows, no FINDING, C8 and C13 INFO
Fields approved: ["bellwether stock check","shelf count review","stock count comparison","shelf recount request","marked aisle lookup","stock adjustment audit","count sheet check","shelf tally lookup"], allowed-tools ["Read","Grep","Glob"], edge enhances -> sk-code; no description trim was asked at 76 of 130 characters
Integration: I1 advisor discovery: scanned; the advisor reads the new root. Manual fallback: /doctor:skill-advisor rebuild.
             I2 compiled skill graph: recompiled; .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json is current.
             I3 router reach and budget: "bellwether stock check" -> bellwether-stock-check ranks 1 of 1 above the bar.
             I3 router reach and budget: "shelf count review" -> bellwether-stock-check ranks 1 of 3 above the bar.
             I3 router reach and budget: "stock count comparison" -> bellwether-stock-check ranks 1 of 1 above the bar.
             I3 router reach and budget: description budget 76/130 characters.
             I4 regression corpus: appended 3 case row(s) to .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl.
             I5 runtime mirrors: Hermes synced and checked (PASS: 66 Hermes skill copies in sync).
             I6 changelog: created .skilled/skills/bellwether-stock-check/changelog/v1.0.0.0.md.
             I6 changelog: created .skilled/changelog/bellwether-stock-check -> ../skills/bellwether-stock-check/changelog.
Undo: the engine's block, quoted whole in section 3.4: the two cps that restore skill-graph.json and the cases file, the rm -r of .hermes/skills and the cp -R of its backup, the rm of the changelog entry, the rm of the index link, the rm -r of the staged skill folder, and its closing Check: line
STATUS=OK
```

The plain path prints no `Router source:` line, because its router was written rather than moved, so none is quoted here. The engine's undo block is the only undo: this route prints it and never runs it. Running it leaves the advisor graph describing a skill that is gone, because the run's own scan rebuilt the graph instead of backing it up, so `/doctor:skill-advisor rebuild`, or the I1 row's `skill_graph_scan`, brings it back in step afterwards.

The operator commits the converted skill themselves. This route stages and commits nothing.

---

## 4. What the two runs prove

1. A plan is printed before anything is written, in both runs, carrying the two pending questions the engine raised, its backup folder and its integration plan.
2. A no at the conversion question ends the run as `STATUS=CANCELLED ACTION=cancelled`, with `Changed: none`, the scratch root removed and nothing written. `git status --porcelain` read 0 lines before the plan and 0 lines after the cancellation, and the two reads are identical.
3. A yes writes the staged skill, its changelog entry and index link, and every integration target the plan recorded, exits 0 with all six integration rows reporting, and reads back `Result: PASS` from the converted root. The four checks after the run pass: the Hermes mirror is in sync, the graph freshness panel reports no drift, the changelog link resolves to `v1.0.0.0.md`, and the check engine reports 13 rows with no finding.

What these runs do not cover, and where the earlier phase 10 evidence does: the older Skilled in-place path, which is a different input kind. What this environment did not produce: an advisor-proposed edge, because a fresh temporary repository has no warm daemon and the plan printed its unavailable branch, and a description trim question, because the description is 76 of the 130 characters.

## 5. Notes on the contract

No YAML step failed to be followed as written, so these runs raise no finding of that class. Three observations are worth carrying forward.

1. The engine's unavailable branch for the edge, `edges: approval required; the advisor is unavailable, so name the target with --edge enhances:<skill>`, is what a cold advisor produces, and the presentation contract defines its answer: the operator names a public skill of the skills root. Both runs followed that path and named `sk-code`. With a warm daemon the same line offers the name, which is the shape the earlier phase 10 plain-skill run recorded.
2. Phase 5 says to delete the scratch root once the run has finished, and this run deleted it after the phase 6 re-read and the four checks rather than between the apply and the re-read. Nothing after the apply reads that root, and the end state is the one the mutation boundary asks for: no temporary copy outlives the run.
3. A plain plan prints its `allowed-tools` and `edges` lines before a `Proposed description trim` line. With no trim needed here the order the workflow used, intent phrases then allowed-tools then edge, matches the presentation's four-question order. A description over 130 characters would put the plan's own line order against that fixed order, so the next over-budget run should read both before it asks.
