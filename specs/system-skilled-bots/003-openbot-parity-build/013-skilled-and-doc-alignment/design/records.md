---
title: "Design: the alignment run records"
description: "Every field of every record the two alignment commands write, the topic entry shape with one existing topic pasted as the model, the exact line grammar of the clean criterion, and the rebuttals and evidence records this phase adds."
trigger_phrases:
  - "alignment run records"
  - "findings json fields"
  - "topics json topic shape"
  - "recheck buckets"
  - "rebuttals record"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The alignment run records

This file fixes every record the two alignment commands write and the two records this phase adds. A change to a shape here is a change to this file first, then to the golden in `design/fixtures/`, then to the phase documents, the same order `contracts/README.md` sets for the packet's own contracts. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/README.md, section "The rule"]

Every field below was read in the script that writes it, and every sample was produced by running that script. The measured numbers come from a scope run over this checkout at `79519553b62e41c7a018f4e3fde04f1d2f7f30ff`, made with a temporary topics file so the repository's `topics.json` stayed untouched.

---

## 1. WHAT THIS FILE OWNS AND WHAT IT DOES NOT

The two run roots sit outside the checkout, under the operator's state root:

| Command | Run root |
|---------|----------|
| `/local-skilled-alignment` | `${XDG_STATE_HOME:-$HOME/.local/state}/local-skilled-alignment/<repo folder name>/<UTC timestamp>/` [SOURCE: .skilled/commands/local-skilled-alignment.md:58] |
| `/local-doc-alignment` | `${XDG_STATE_HOME:-$HOME/.local/state}/local-doc-alignment/<repo folder name>/<UTC timestamp>/` [SOURCE: .skilled/commands/local-doc-alignment.md:55] |

Three consequences follow, and each one is a decision a builder would otherwise have to make.

**These are not runtime records.** `contracts/records.md` owns the records under `${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots`, in the identity folder. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "Durable records of the OpenBot parity build"] A run folder is not under that root and no runtime module reads it, so `contracts/records.md` neither owns these shapes nor needs an edit when one changes.

**These are not `--json` payloads.** `contracts/cli-json.md` rule 1 makes every `--json` verb print one object with a top-level `version`, and its section 2 closes the verb list. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/cli-json.md, section "1. THE RULE"] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/cli-json.md, section "2. ONE ROW PER VERB"] No alignment record is printed by a `bots` verb, so that rule does not reach them.

**`findings.json` is a bare array and must stay one.** `recheck.cjs` reads the file and throws `findings.json must contain an array` on anything else. [SOURCE: .skilled/commands/assets/local-skilled-alignment/recheck.cjs:144] So the envelope rule cannot be applied here even by analogy: an object with a `findings` key would break the recheck. This is the one place in the packet where a bare array is correct, and the reason is the reader, not a preference.

`contracts/versioning.md` rule 3 lists the state files that carry `schemaVersion: 1` and a run folder is not among them. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/versioning.md, section "1. THE RULES"] No record below carries a version key. A shape change is made by editing this file and the golden together, and the two commands are operator-local so no older reader has to survive it.

---

## 2. THE TOPIC ENTRY

File: `.skilled/commands/assets/local-doc-alignment/topics.json`, one object under `topics.<name>`. The loader reads six fields and defaults the rest. [SOURCE: .skilled/commands/assets/local-doc-alignment/doc-alignment.cjs:91]

| Key | Type | Required | Default | What it does |
|-----|------|----------|---------|--------------|
| `title` | string | no | the topic name | The one-line description the scope checkpoint and the result block print |
| `terms` | array of strings | yes | none, and an empty array stops the run | Regular expressions joined with `\|` and matched case-insensitively against every tracked doc's text |
| `codeRoots` | array of strings | yes | none, and an empty array stops the run | The paths a lane reads as the source of truth, and every doc inside one joins the doc set |
| `checks` | array of objects | no | `[]` | The deterministic checks the run executes, each `{id, cmd, severity}` |
| `checks[].id` | string | yes, when `checks` is present | none | The row id becomes `D2-<id>` in `battery.json` |
| `checks[].cmd` | string | yes, when `checks` is present | none | Run through `bash -c` from the repository root, with a ten-minute timeout |
| `checks[].severity` | `P0` or `P1` or `P2` | no | `P2` | The severity a failing row's finding takes |
| `lanes` | integer 1 to 8 | no | `defaults.lanes`, which is `4` | The lane count when `--lane-count` is absent |
| `overlayReadmes` | boolean | no | `false` | Adds the overlay folder's READMEs and the folder to the review roots |
| `exclude` | array of strings | no | `[]`, added to `defaults.exclude` | Globs removed from the doc set |

The loader stops the run by name in four cases: an unknown topic, a topic with no `terms`, a topic with no `codeRoots` and a `codeRoot` that does not exist. [SOURCE: .skilled/commands/assets/local-doc-alignment/doc-alignment.cjs:94] [SOURCE: .skilled/commands/assets/local-doc-alignment/doc-alignment.cjs:95] [SOURCE: .skilled/commands/assets/local-doc-alignment/doc-alignment.cjs:96] [SOURCE: .skilled/commands/assets/local-doc-alignment/doc-alignment.cjs:281]

### 2.1 The model shape, pasted from the file

`overlay-layout` is the model, because it is the one existing topic that sets `overlayReadmes` and carries a single check, so it shows every optional field at once. [SOURCE: .skilled/commands/assets/local-doc-alignment/topics.json:1]

```json
{
  "title": "Overlay layout: the overlay folder .skilled-overlays.json names, its manifest and README files, and the /doctor:overlay engine that applies, captures, adopts, re-pins and audits it",
  "terms": [
    "\\.skilled-overlays\\.json",
    "overlay-engine",
    "overlay-manifest",
    "doctor:overlay",
    "overlay folder"
  ],
  "codeRoots": [
    ".skilled/commands/doctor/scripts/overlay-engine.cjs"
  ],
  "overlayReadmes": true,
  "lanes": 2,
  "checks": [
    {
      "id": "overlay-engine-tests",
      "cmd": "node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs .skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs",
      "severity": "P1"
    }
  ]
}
```

The new entry copies that shape and changes five things: the title, the terms, the code roots, the lane count and the checks. It sets no `overlayReadmes` and no `exclude`, because the skill is not an overlay and the defaults already exclude `specs/**`, `**/changelog/**`, `**/benchmark/reports/**`, `**/tests/fixtures/**`, `**/node_modules/**`, `.skilled/output/**` and `barter/**`.

### 2.2 The decided entry

```json
{
  "title": "The bots skill: the bots CLI, its runtime modules, the hub and mode docs, the feature catalog and the manual testing playbook",
  "terms": [
    "system-skilled-bots",
    "bots\\.cjs",
    "needs-you",
    "BOT\\.md"
  ],
  "codeRoots": [
    ".skilled/bin/bots.cjs",
    ".skilled/skills/system-skilled-bots/runtime/lib",
    ".skilled/skills/system-skilled-bots/scripts"
  ],
  "lanes": 4,
  "checks": [
    {
      "id": "skill-package",
      "cmd": "python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/system-skilled-bots",
      "severity": "P1"
    },
    {
      "id": "feature-catalog",
      "cmd": "python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py",
      "severity": "P1"
    },
    {
      "id": "manual-testing-playbook",
      "cmd": "node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-skilled-bots/manual-testing-playbook",
      "severity": "P1"
    }
  ]
}
```

Why each choice, in one line each.

- **`terms`.** `system-skilled-bots` reaches every doc that names the skill by path. `bots\.cjs` reaches the docs that quote the CLI without naming the skill. `needs-you` and `BOT\.md` reach the seven docs that describe the inbox and the definition file without either of the first two. The four together reach 121 tracked docs, measured by the scope step below.
- **`codeRoots`.** The CLI is the truth for every verb, flag and exit code a doc claims. `runtime/lib` is the truth for every module, record and refusal a doc claims, and its `README.md` joins the doc set because it sits inside the root. `scripts` is the truth for the definition checker, and its `README.md` joins the doc set the same way.
- **`lanes`.** Four, the default, because 121 docs split into four lanes of 23, 37, 25 and 36 by byte weight.
- **`checks`.** The three package validators that already exist for the skill, the catalog and the playbook. All three are `P1` because a failing one is a broken package rather than a broken run, which is the severity the existing topics give their checks.

### 2.3 The measured scope

The entry is not in `topics.json` yet, so the measurement below stages it into a copy and points the scope step at that copy with `--topics`. Once T009 lands the entry, the same command runs without `--topics` and against the real file.

```text
$ node .skilled/commands/assets/local-doc-alignment/doc-alignment.cjs scope --topic system-skilled-bots --out /tmp/wo11/run --topics /tmp/wo11/topics.json
topic system-skilled-bots: 121 docs in 4 lanes, 3 checks, code roots 3
L1  23 docs  .skilled/commands/bots/assets/bots-author-auto.yaml .. .skilled/scripts/git-hooks/README.md
L2  37 docs  .skilled/skills/sk-git/assets/worktree-checklist.md .. .skilled/skills/system-skilled-bots/feature-catalog/runs/worktree-isolation.md
L3  25 docs  .skilled/skills/system-skilled-bots/feature-catalog/scheduling/cron-translation.md .. .skilled/skills/system-skilled-bots/manual-testing-playbook/request-queue/enqueue-dedupe-and-drain.md
L4  36 docs  .skilled/skills/system-skilled-bots/manual-testing-playbook/schedule-lifecycle/pause-and-disable-switches.md .. README.md
STATUS=OK doc-alignment: action=scope topic=system-skilled-bots docs=121 lanes=4 checks=3
```

The four owners are `docs:.skilled/commands` with 22 files, `docs:.skilled/scripts` with 1, `docs:.skilled/skills` with 97 and `docs:.pi` with 1. The count is a measurement of this checkout at `79519553b62e41c7a018f4e3fde04f1d2f7f30ff` and the run's own `scope.json` is the record, so a later commit moves it and the design does not.

---

## 3. `scope.json`

Written by the scope step of either command. The doc run's shape differs from the skilled run's in five keys, marked below.

| Key | Type | Null | Doc run value | Skilled run value |
|-----|------|------|---------------|-------------------|
| `target` | string | no | `topic <name>` | the target word, `HEAD` by default |
| `kind` | string | no | `topic` | `branch`, `range`, `tag`, `skill`, `path` or `overlays` |
| `mode` | string | no | `doc-set` | `first-parent` or `full-diff` |
| `base` | string | yes | `null` | the base ref, `origin/main` by default |
| `mergeBase` | string | no | the head commit | the merge base commit |
| `head` | string | no | the head commit | the head commit |
| `generatedAt` | string | no | an ISO 8601 UTC instant | the same |
| `topic` | string | yes | the topic name | absent |
| `reviewRoots` | array of strings | no | `codeRoots`, plus the overlay folder when one applies | absent |
| `overlayFolder` | string | yes | the overlay folder or `null` | absent |
| `files` | array of strings | no | the doc set, sorted | the changed file set, sorted |
| `statuses` | object | no | one entry per file, `tracked` or a working-tree status | the same |
| `dirty` | array of strings | no | the files whose status is not `tracked`, sorted | the same |
| `commits` | array | no | `[]` | one entry per first-parent commit |
| `fileOwners` | object | no | one owner id per file | the same |
| `owners` | object | no | one entry per owner, `{kind, root, files}` | the same |

The doc run writes `scope-summary.json` beside it with `{target, head, files, owners}` where `owners` is an array of `{id, kind, root, files}`. [SOURCE: .skilled/commands/assets/local-doc-alignment/doc-alignment.cjs:342]

A doc run's `commits` is empty and its `mergeBase` equals its `head`, so the report's `Commits:` line reads `<head>` to `<head>`, 0 first-parent commits. That is correct and not a defect: the doc run checks the docs as they stand, not a range.

---

## 4. `battery.json`

Written by the battery step of the skilled run and by the checks step of the doc run. [SOURCE: .skilled/commands/assets/local-doc-alignment/doc-alignment.cjs:261]

| Key | Type | Null | Format |
|-----|------|------|--------|
| `topic` | string | yes | the topic name on a doc run, absent on a skilled run |
| `grading` | string | no | one sentence naming what the rows were graded against |
| `surfaces` | array | no | one entry per surface, `{id, title, fired, matched, checks}` |
| `counts` | object | no | `{pass, fail, cannot_run, not_applicable}`, four integers |
| `rows` | array | no | one entry per check, in surface order |

A row carries eleven keys.

| Key | Type | Null | Format |
|-----|------|------|--------|
| `id` | string | no | `<surface>-<checkId>`, for example `D2-skill-package` |
| `checkId` | string | no | the same string, kept so a recheck can match a row across runs |
| `surface` | string | no | the surface id the row belongs to |
| `standard` | string | no | the sentence the check is graded against |
| `status` | string | no | `pass`, `fail`, `cannot_run` or `not_applicable` |
| `severity` | string | no | `P0`, `P1` or `P2`, from the topic's `checks[].severity` or the surface map |
| `ci_gated` | boolean | no | whether a CI workflow runs the same command |
| `exit` | integer | yes | the process exit status, `null` when the row never started |
| `durationMs` | integer | no | wall time in milliseconds |
| `cmd` | string | no | the command as run |
| `outTail` | string | yes | the last 30 lines of combined output |
| `reason` | string | yes | why the row is `cannot_run`, `null` otherwise |

The doc run's two surfaces are fixed: `D1` is the lane review with `checks: 0` and `matched` equal to the doc count, and `D2` is the topic's checks with `matched: 0` and `checks` equal to the check count. `D2` is `fired: false` when the topic names no check.

A `cannot_run` row is never a silent pass. It is a row with a `reason`, and the aggregator turns it into a `P1` finding. [SOURCE: .skilled/commands/assets/local-skilled-alignment/aggregate-findings.cjs:169]

---

## 5. `findings.json`

A bare array, one entry per finding, sorted by severity then by file. Written by `aggregate-findings.cjs`. [SOURCE: .skilled/commands/assets/local-skilled-alignment/aggregate-findings.cjs:626]

### 5.1 The finding record

| Key | Type | Null | Format |
|-----|------|------|--------|
| `id` | string | no | the lane's own id when it gave one, else `<lane>-<nn>` with a two-digit index. A numeric id becomes `<lane>-<n>` |
| `source_id` | string | yes | the id the lane wrote, kept so a critic override can name it |
| `lane` | string | no | `A`, `B`, `C`, `D`, `battery`, `env`, `probe` or `critic` |
| `surface` | string | yes | the surface id, `S1` to `S16` on a skilled run and `D1` or `D2` on a doc run |
| `standard` | string | yes | the sentence the finding is graded against, from the surface map when the lane gave none |
| `severity` | string | no | `P0`, `P1` or `P2`. An unknown value becomes `P2` |
| `fix_class` | string | no | `literal` or `judgment`. A `literal` with no exact `old` and `new` becomes `judgment` |
| `file` | string | yes | the repository-relative path the finding names |
| `line` | string | yes | the line number as a string, `null` when the finding names a file or nothing |
| `issue` | string | no | the finding text, one paragraph |
| `evidence` | object | yes | `{cmd, exit, out, ci_gated, ci_workflows}`, see 5.2 |
| `fix` | object | yes | `{old, new}`, both strings, present only on a `literal` finding |
| `inferred` | boolean | no | `true` when `evidence.cmd` is absent, so a claim with no command behind it is marked |
| `outside_scope` | boolean | no | `true` when the file is not in `scope.json` |
| `outside_reason` | string | yes | `merged-in`, `unchanged in range` or `pre-existing (critic)` |
| `critic_override` | object | yes | `{verdict, note, lane_severity}`, see 5.3 |
| `disposition` | object | yes | `{status, note}`, see 5.4 |

### 5.2 `evidence`

| Key | Type | Null | Format |
|-----|------|------|--------|
| `cmd` | string | yes | the command that shows the finding, absent on an inferred finding |
| `exit` | integer | yes | that command's exit status |
| `out` | string | yes | the last lines of its output |
| `ci_gated` | boolean | yes | whether a CI workflow runs the same command |
| `ci_workflows` | array of strings | yes | `<workflow file> > <job> > <step>` per workflow |

### 5.3 `critic_override`

| Key | Type | Null | Format |
|-----|------|------|--------|
| `verdict` | string | no | `refuted`, `pre-existing`, `duplicate` or `severity` |
| `note` | string | yes | the critic's evidence |
| `lane_severity` | string | no | the severity the lane gave, kept beside the new one |

A `refuted` or `duplicate` finding leaves the counts and is listed under the report's overturned section. A `pre-existing` finding moves outside the scope. A `severity` override replaces `severity` and keeps `lane_severity`. An override that names no finding, names two or carries an invalid severity is listed in the report's problems section with its reason and is not applied. [SOURCE: .skilled/commands/assets/local-skilled-alignment/aggregate-findings.cjs:320]

### 5.4 `disposition`

| Key | Type | Null | Format |
|-----|------|------|--------|
| `status` | string | no | `handed_off` or `rebutted` |
| `note` | string | yes | the reason, one sentence |

A finding with a disposition is settled and leaves the open count. The report's `- Open findings:` line counts `findings.length - handedOff - rebutted`. [SOURCE: .skilled/commands/assets/local-skilled-alignment/aggregate-findings.cjs:397]

`handed_off` is this phase's name for a finding whose code root is wrong: the doc is right and the runtime is wrong, so the finding goes to 014 rather than being fixed by editing the doc. `rebutted` is a finding the fix pass declines with a reason. Both are recorded in `scratch/rebuttals.md` section 11, and both are what makes the clean criterion honest rather than a count of what was easy.

---

## 6. `dispositions.json`

The input the fix pass writes into a run folder before the aggregator runs again, so a settled finding keeps its place in the report instead of vanishing. One array, one entry per settled finding.

| Key | Type | Null | Format |
|-----|------|------|--------|
| `id` | string | no | a finding `id`, a `source_id` or `<lane>-<source_id>` |
| `status` | string | no | `handed_off` or `rebutted` |
| `note` | string | yes | the reason, one sentence |

Four entries are refused and listed in the report's problems section: an entry with no `id`, an entry with an unknown `status`, an entry whose `id` matches no finding, and an entry whose `id` matches more than one finding. A fifth is refused when two entries name the same finding. [SOURCE: .skilled/commands/assets/local-skilled-alignment/aggregate-findings.cjs:366]

---

## 7. `report.md`

The one file a person reads. Its section order is fixed by the renderer and a section is never dropped, only emptied. [SOURCE: .skilled/commands/assets/local-skilled-alignment/aggregate-findings.cjs:420]

| Order | Heading | Holds |
|-------|---------|-------|
| 1 | `# Alignment report: <target>` | the title, then one line saying the run was report-only |
| 2 | `## Scope` | eight bullet lines, listed below |
| 3 | `## Surfaces` | a five-column table, one row per surface |
| 4 | `## Battery` | the four counts, the grading sentence, the debt note and a six-column table |
| 5 | `## Checks that could not run` | one bullet per `cannot_run` row, or `None.` |
| 6 | `## CI workflows this scope triggers` | present only when the S15 row carries a workflow list |
| 7 | `## Findings by surface` | one `### <surface> <title>` block per surface, then one block per finding, grouped by severity |
| 8 | `## Findings outside the scope` | the findings whose file is not in `scope.json`, grouped by reason |
| 9 | `## Overturned by the critic` | the refuted and duplicate findings, with the lane severity kept |
| 10 | `## Env tokens` | present only when the env check wrote a report |
| 11 | `## Probes` | present only when the probe runner wrote a report |
| 12 | `## Probes awaiting the critic` | one bullet per probe the critic did not uphold, or `None.` |
| 13 | `## Files no lane reviewed` | one bullet per file the critic showed no lane read, or `None.` |
| 14 | `## Inputs and overrides that could not be used` | present only when the aggregator recorded a problem |

The eight `## Scope` bullets, in order, are `Kind`, `Target`, `Commits`, `Files`, `Owners`, `Findings`, `Open findings` and `Lanes`, then `Fix plan`. The `Open findings` line is the clean criterion and its grammar is exact:

```text
- Open findings: <open> (<handed off> handed off, <rebutted> rebutted)
```

So a clean report reads `- Open findings: 0 (0 handed off, 0 rebutted)` and never `- Open findings: 0` alone. A check that anchors on the end of the line therefore fails on a clean report, which is why every criterion in this packet matches the prefix `^- Open findings: 0` and not the whole line.

The `Findings` line above it reads `- Findings: <n> (P0 <n>, P1 <n>, P2 <n>), <n> literal, <n> inferred, <n> outside the scope; <n> more overturned by the critic and not counted`.

---

## 8. `fix-plan.md`

The work list, one checkbox per finding, grouped by owner. [SOURCE: .skilled/commands/assets/local-skilled-alignment/aggregate-findings.cjs:564]

| Order | Heading | Holds |
|-------|---------|-------|
| 1 | `# Fix plan` | the title, then `Target: <target>; head: <sha>` |
| 2 | `## In scope` | one `### <owner>` block per owner, each with its checkbox lines |
| 3 | `## Pre-existing or outside the scope` | the same, for the findings outside `scope.json` |

A checkbox line reads `- [ ] <id> <severity> <file>:<line> <issue, truncated to 200 characters>` and gains ` [handed off]` or ` [rebutted]` when the finding is settled. A settled finding's box is `[x]`, so the file shows at a glance what is left.

---

## 9. `recheck.json` AND `recheck.md`

`--recheck RUN_DIR` writes both into a new run folder. The new folder holds no `report.md`, which is why the clean criterion reads the newest folder that holds one rather than the newest folder. [SOURCE: .skilled/commands/assets/local-skilled-alignment/recheck.cjs:156]

`recheck.json` carries `{from, battery, generatedAt, battery_rows, findings, counts}`. `counts` holds five integers: `resolved`, `still_open`, `new`, `needs_review` and `disposed`.

`recheck.md` opens with a two-column table and then one section per bucket per source. [SOURCE: .skilled/commands/assets/local-skilled-alignment/recheck.cjs:121]

```text
# Alignment recheck

| Bucket | Count |
|---|---:|
| resolved | <n> |
| still_open | <n> |
| new | <n> |
| needs_review | <n> |
| disposed | <n> |
```

The five buckets mean five different things, and a builder who conflates two of them reports a clean recheck that is not clean.

| Bucket | Meaning | What it counts |
|--------|---------|----------------|
| `resolved` | The row now passes, or the literal fix's new text is present and its old text is absent | battery rows and findings |
| `still_open` | The row still fails or cannot run, or the literal fix's old text is still there | battery rows and findings |
| `new` | A row that is open now and was not open in the original run | battery rows only |
| `needs_review` | A `judgment` finding, or a literal finding whose file changed differently | findings only |
| `disposed` | A finding settled by a disposition | findings only |

The recheck's exit status is 1 when `still_open` or `new` is above 0 and 0 otherwise, and its status line reads `STATUS=OPEN` or `STATUS=OK`. [SOURCE: .skilled/commands/assets/local-skilled-alignment/recheck.cjs:157] `needs_review` does not affect the exit status, because a judgment finding is settled by a person and not by a re-run. That is why the phase's clean criterion reads `still_open` and `new` and not `needs_review`.

The bucket rows are the exact strings a criterion matches, so the table above is the contract: `| still_open | 0 |` and `| new | 0 |` are the two lines a clean recheck prints.

---

## 10. `applied.json` AND `applied.diff`

Written only under `--fix literal`, which this phase does not use. Recorded here so a builder who reaches for it knows what it produces and why the phase declines it.

`applied.json` holds one entry per literal finding with `{id, file, status}` where `status` is `applied` or `skipped` and a skipped entry carries a `reason`. `applied.diff` is the unified diff of every applied fix, and it is what the `:confirm` checkpoint shows before anything is written.

The phase declines `--fix literal` because the applier reaches only a `literal` finding whose exact `old` and `new` text the critic did not overturn, and the last full run over this repository reported 4 literal findings against 36 judgment ones. [SOURCE: .skilled/commands/local-skilled-alignment.md:15] A fix pass that reached a tenth of the report would leave the other 36 open and the clean criterion unmet.

---

## 11. `scratch/rebuttals.md`

This phase's own record, and one of the two things it hands to 014. One `##` heading per settled finding, the heading text being the finding id exactly as `findings.json` carries it, then six bullet lines.

```text
## <finding id>

- Status: handed_off | rebutted
- Severity: P0 | P1 | P2
- Phase: <NNN>, the phase whose code root the finding names
- File: <path>:<line>, or none
- Reason: <one sentence>
- Evidence: <the command and its exit status, or the report line that shows it>
```

The heading grammar is `^## (\S+)$` so a check can collect the ids and compare them with a run's `findings.json`. The six fields are the six a reader needs to decide whether to accept the decline, and `Status` is the same word `dispositions.json` carries so the two records cannot disagree.

`Phase` is the field 014 reads. Its seeded intake keys on the literal `Status: handed_off` and takes the phase from this line, so a `handed_off` row with no `Phase` line is a row 014 cannot seed and `review-seed-unreadable` refuses it. The value is the three-digit phase number, `001` to `013`, and never a folder name.

A `handed_off` row names 014 as its destination in `Reason`, because 014 is where a wrong code root is fixed. A `rebutted` row names what makes the finding wrong, which is a fact about the doc or about the scope and never a preference.

---

## 12. `evidence/`

The second thing this phase hands to 014, and the fix for the gap that both reports were written outside the checkout. After the last run of each command, three files are copied into the phase folder:

| From | To |
|------|-----|
| `<state>/local-skilled-alignment/system-skilled-bots/<stamp>/report.md` | `evidence/skilled-alignment/report.md` |
| `<state>/local-skilled-alignment/system-skilled-bots/<stamp>/findings.json` | `evidence/skilled-alignment/findings.json` |
| `<state>/local-skilled-alignment/system-skilled-bots/<stamp>/recheck.md` | `evidence/skilled-alignment/recheck.md` |
| `<state>/local-doc-alignment/system-skilled-bots/<stamp>/report.md` | `evidence/doc-alignment/report.md` |
| `<state>/local-doc-alignment/system-skilled-bots/<stamp>/findings.json` | `evidence/doc-alignment/findings.json` |
| `<state>/local-doc-alignment/system-skilled-bots/<stamp>/recheck.md` | `evidence/doc-alignment/recheck.md` |

The doc run has no recheck mode, so its `recheck.md` is the second full run's `report.md` copied under the recheck name. That is a decision, not an oversight: the criterion reads `still_open` and `new` from a recheck table, and a doc run's second report has no such table, so the doc run's `recheck.md` is its last `report.md` and the criterion for the doc run reads the report's `Open findings` line instead. Section 13 records the choice.

The three files are copied, never moved, so the run folder stays the record the command wrote and the phase folder holds a copy a later reader can open without the operator's state root.

---

## 13. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The topic's `codeRoots` are three code paths and never the skill folder itself | A code root is the truth a lane reads. Naming the skill folder would make the docs the truth for their own claims, which is the circular check this phase exists to avoid |
| `findings.json` stays a bare array | `recheck.cjs` throws on anything else [SOURCE: .skilled/commands/assets/local-skilled-alignment/recheck.cjs:144], so the envelope rule in `contracts/cli-json.md` cannot apply even by analogy |
| No record in a run folder carries a version key | `contracts/versioning.md` rule 3 lists the state files that carry `schemaVersion` and a run folder is not one. Both commands are operator-local, so no older reader has to survive a shape change |
| The clean criterion matches `^- Open findings: 0` and not the whole line | The line continues with the handed-off and rebutted counts, so an end-anchored pattern fails on a clean report |
| The doc run's `recheck.md` is its last `report.md` copied under that name | The doc run has no recheck mode, and the criterion needs a file at that path in each evidence folder |
| `handed_off` and `rebutted` are the only two dispositions | They are the two the aggregator accepts [SOURCE: .skilled/commands/assets/local-skilled-alignment/aggregate-findings.cjs:50], and a third would need a change to the script rather than to this phase |
| The rebuttals heading is the finding id and nothing else | A check compares the headings with a run's `findings.json`, and a heading with a title after the id would need a second parse rule |
