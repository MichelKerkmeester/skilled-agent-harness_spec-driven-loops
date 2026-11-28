---
title: "Design: the alignment mockups"
description: "Every screen a person sees from the two alignment commands and from the bots help block, drawn at the width the presentation contracts use, with the measured values this checkout produces and the one block that changes when the topic lands."
trigger_phrases:
  - "alignment mockups"
  - "no topic display"
  - "doc alignment result block"
  - "bots help block"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The alignment mockups

Every screen a person sees. The two commands are terminal-only, so a mockup is a fenced block and not an image. Each block below is the presentation contract's template with this checkout's measured values filled in, and the contract is the source of truth for the wording. [SOURCE: .skilled/commands/assets/local-doc-alignment/local-doc-alignment-presentation.txt:1] [SOURCE: .skilled/commands/assets/local-skilled-alignment/local-skilled-alignment-presentation.txt:1]

The values come from two places. The scope, lane and check counts come from a scope run over this checkout at `79519553b62e41c7a018f4e3fde04f1d2f7f30ff`. The finding counts come from the last full skilled run, which reported 40 findings, and they are marked as that run's numbers rather than as this phase's.

---

## 1. THE NO-TOPIC DISPLAY, TODAY

This is what `/local-doc-alignment` prints right now, and it is the measured gap the phase closes. The command needs a topic, `topics.json` holds ten and none names this skill, so the run stops before it reads a single doc. [SOURCE: .skilled/commands/local-doc-alignment.md:41]

```text
/local-doc-alignment needs a topic.
Known topics in .skilled/commands/assets/local-doc-alignment/topics.json: session-handover, changelog-spec-folder-line, expansive-depth, advisor-pasted-reply, advisor-lane-removal, opencode-v2-only, overlay-layout, playbook-run-recording, mcp-browser-use, doctor-ownership
Usage: /local-doc-alignment <topic> [:auto|:confirm] [--lanes=NAME] [--lane-count=N] [--no-lanes] [--no-checks] [--fix=literal] [--out=DIR] [--keep=N]
STATUS=FAIL ERROR="no topic"
```

The topic list is one line and it wraps in a narrow terminal. That is the contract's shape and not a defect: the list is the whole set, so a reader can see that the skill is absent from it.

After the topic lands the same invocation prints eleven names, with `system-skilled-bots` last because the file is read in insertion order and the new entry is appended.

---

## 2. THE UNKNOWN-TOPIC DISPLAY

What a typo prints. The block names the topic, lists the known ones and says what a topic needs, so a reader who has never added one can add one.

```text
/local-doc-alignment: unknown topic system-skilled-bot.
Known topics in .skilled/commands/assets/local-doc-alignment/topics.json: session-handover, changelog-spec-folder-line, expansive-depth, advisor-pasted-reply, advisor-lane-removal, opencode-v2-only, overlay-layout, playbook-run-recording, mcp-browser-use, doctor-ownership, system-skilled-bots
Add a topic there with its terms, codeRoots, optional checks and optional overlayReadmes.
STATUS=FAIL ERROR="unknown topic system-skilled-bot"
```

No run folder is written, so the state root is unchanged and the failure is distinguishable from a clean run by the absence of a folder rather than by a green report.

---

## 3. THE DOC RUN'S PROGRESS LINES

One line per step, printed as the step finishes. The values are this checkout's.

```text
scope     topic system-skilled-bots: 121 docs in 4 lanes, 3 checks
checks    pass 3, fail 0, cannot run 0
lanes     preset native (subagent native)
lane      L1 ok 41s
lane      L2 ok 55s
lane      L3 ok 38s
lane      L4 ok 47s
critic    done
report    /Users/ada/.local/state/local-doc-alignment/system-skilled-bots/20261125T232500Z/report.md
prune     removed 0 runs, 0 scratch folders; kept 10
```

Two lines carry a rule a builder would otherwise invent.

- **`checks skipped (--no-checks)`** replaces the `checks` line when the flag is passed, and `lanes skipped (--no-lanes)` replaces the four `lane` lines and the `critic` line. A skipped step prints a line saying so rather than printing nothing, so a reader can tell a skipped step from a step that produced no output.
- **The `lane` line is one per lane and it names the lane id, the outcome, the seconds and a reason when there is one.** A failed lane prints `lane L2 error 12s <reason>` and the run continues, so a partial review is visible in the progress rather than only in the report.

---

## 4. THE DOC RUN'S RESULT

The block a person reads at the end. `STATUS=OK` means the run finished with no finding, and `STATUS=PARTIAL` means it finished with findings.

```text
Doc alignment report written.
Topic:     system-skilled-bots, 121 docs
Findings:  0  (P0 0, P1 0, P2 0); literal 0, inferred 0
Overturned: 0 by the critic, not counted
Checks:    pass 3, fail 0, cannot run 0
Lanes:     L1, L2, L3, L4
Report:    /Users/ada/.local/state/local-doc-alignment/system-skilled-bots/20261125T232500Z/report.md
Fix plan:  /Users/ada/.local/state/local-doc-alignment/system-skilled-bots/20261125T232500Z/fix-plan.md

STATUS=OK
```

A run with findings prints the same block with the counts filled and a `Top findings:` section of up to five rows, P0 first. The section is omitted when there is nothing to list, so a clean run ends at the `Fix plan:` line.

The `Lanes:` line names the ids that were read and appends `, missing: <ids>` when a lane failed. A run whose lane L2 failed reads `Lanes: L1, L3, L4, missing: L2`, which is the one line that says the review was partial.

---

## 5. THE SKILLED RUN'S PROGRESS LINES

The same shape with the skilled run's steps. The counts are the last full run's, which scoped 716 files.

```text
scope     branch system-skilled-bots: 716 files, 12 commits, 2 uncommitted
battery   pass 215, fail 6, cannot run 0, not applicable 2
lanes     preset native (subagent native)
lane      A ok 41s
lane      B ok 38s
lane      C ok 52s
lane      D ok 44s
probes    pass 9, fail 5, cannot run 0; held 0 not upheld by the critic
critic    done
report    /Users/ada/.local/state/local-skilled-alignment/system-skilled-bots/20261123T205442Z/report.md
prune     removed 0 runs, 0 scratch folders; kept 10
```

The `scope` line gains a second line when the scope step's status ends with a `note=`, so an empty scope is not read as a pass over the target. [SOURCE: .skilled/commands/assets/local-skilled-alignment/local-skilled-alignment-presentation.txt:66]

---

## 6. THE SKILLED RUN'S RESULT

```text
Alignment report written.
Target:    system-skilled-bots (branch), 716 files
Findings:  40  (P0 2, P1 19, P2 19); literal 4, inferred 0, outside the scope 2
Overturned: 1 by the critic, not counted
Battery:   pass 215, fail 6, cannot run 0
Lanes:     A, B, C, D
Report:    /Users/ada/.local/state/local-skilled-alignment/system-skilled-bots/20261123T205442Z/report.md
Fix plan:  /Users/ada/.local/state/local-skilled-alignment/system-skilled-bots/20261123T205442Z/fix-plan.md
Data:      /Users/ada/.local/state/local-skilled-alignment/system-skilled-bots/20261123T205442Z/findings.json, /Users/ada/.local/state/local-skilled-alignment/system-skilled-bots/20261123T205442Z/overturned.json, /Users/ada/.local/state/local-skilled-alignment/system-skilled-bots/20261123T205442Z/probes-held.json

Top findings:
BAT-05 P0 S15 -:- S15-ci-skill-doc-frontmatter failed (exit 1).
BAT-04 P0 S7 -:- S7-skill-graph-freshness failed (exit 1).
CR-01 P1 S2 .skilled/changelog/skilled/v4.2.0.0.md:300 The open root release notes still say the opposite of what this scope ships for read-only executors.
PRB-04 P1 S7 -:- Probe P04 "Run the release-notes bot now against this repository" expected system-skilled-bots/bots-run; top-1 was sk-doc/sk-create-changelog.
A-1 P1 S2 .skilled/skills/system-skilled-bots/assets/bot-template.md:1 The new author template fails the skill-doc frontmatter coverage guard.

STATUS=PARTIAL
```

The `Top findings:` rows are the last full run's real rows, kept here because they show the four shapes a row takes: a battery row with no file, a lane row with a file and a line, a probe row with no file, and a lane row whose issue is a sentence. A builder who has to invent a row shape can copy one of the four.

---

## 7. THE RECHECK RESULT

```text
Recheck of /Users/ada/.local/state/local-skilled-alignment/system-skilled-bots/20261123T205442Z written.
Resolved:      5
Still open:    3
New:           0
Needs review:  33
Recheck:       /Users/ada/.local/state/local-skilled-alignment/system-skilled-bots/20261124T065827Z/recheck.md
Data:          /Users/ada/.local/state/local-skilled-alignment/system-skilled-bots/20261124T065827Z/recheck.json

STATUS=OK
```

`STATUS=OK` means the recheck ran, not that the run is clean. The counts say what is left, and the phase's criterion reads `Still open` and `New` and not `Needs review`. [SOURCE: .skilled/commands/assets/local-skilled-alignment/local-skilled-alignment-presentation.txt:145]

The `recheck.md` the block points at opens with the five-bucket table, so a reader who opens the file sees the same five numbers in the same order.

---

## 8. THE FAILURE AND CANCELLED BLOCKS

Both commands print the same two shapes.

```text
/local-doc-alignment stopped at checks.
Command:  node .skilled/commands/assets/local-doc-alignment/doc-alignment.cjs checks --run-dir /Users/ada/.local/state/local-doc-alignment/system-skilled-bots/20261125T232500Z
Exit:     2
Output:   STATUS=ERROR doc-alignment: topic system-skilled-bots has no codeRoots
STATUS=FAIL ERROR="checks exited 2"
```

```text
/local-doc-alignment cancelled at the lane checkpoint. Files written so far stay in /Users/ada/.local/state/local-doc-alignment/system-skilled-bots/20261125T232500Z.
STATUS=CANCELLED ACTION=cancelled
```

The failure block names the step, the command, the exit status and the last lines of output, so a reader can reproduce it without the run folder. The cancelled block names the checkpoint and the folder, so a reader knows what was written before the stop.

---

## 9. THE BOTS HELP BLOCK

The one user-facing surface this phase edits. The block is 35 lines today and lists eleven verbs. [SOURCE: .skilled/bin/bots.cjs:19]

```text
usage: bots <verb> [id] [--repo <path>] [--skilled-tree <path>]

verbs:
  run <id> [--schedule-index <n>]
                 run one bot now, in the shared checkout or, for a worktree
                 bot, in its own worktree; only the installed schedule passes
                 --schedule-index, so the run records the slot it fired for
  disable <id>   stop every run of a bot until enabled, and its installed schedule
  enable <id>    lift a disable; for an installed schedule, recheck it and let it fire
  pause <id>     hold a bot's runs after the lease until resumed
  resume <id>    lift a pause (not the resume of a parked run)
  inbox          list open and expired needs-you items
  enqueue <id> --source <name> (--event-id <id> | --key <key>)
                 [--prompt <text>] [--origin <text>] [--fired-slot <slot>]
                 queue one run request; an event sent twice is a duplicate
  enqueue --git-commit <sha>
                 queue one request per bot with a git-hook trigger, when
                 bots/config.json sets gitHookTrigger (the post-commit hook)
  drain [--scheduled]
                 claim every queued request once, run it, and route the outcome;
                 --scheduled backs off after a setup fault (the drain job uses it)
  schedule install <id>
                 install a cron bot's schedule, held disabled until bots enable;
                 the id drain installs this repository's queue-drain job
  schedule uninstall <id>
                 remove a schedule and sweep this repository's orphaned ones
  answer <item-id> <text>
                 answer a needs-you item and queue the run that continues it
  status [--json] [--rebuild] [--all] [--unregister <owner/name>]
                 show every installed bot, its last run and delivery, and open
                 needs-you items, from the status index; --rebuild rebuilds the
                 index from run records, --unregister hides an identity's rows
                 and deletes nothing, --all shows hidden identities too

exit codes: 0 completed, 1 run failure, 2 usage, 3 recursion guard, 4 refused before dispatch, 5 awaiting decision
```

Phases 001 to 011 add eight verb groups to `VERB_SPECS` and none of them to this block today. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "Files to Change", row `.skilled/bin/bots.cjs`] The eight are `activity`, `routines`, `ui`, `remember`, `secret`, `skill`, `chat` and `channel`. Each one needs a line in the same shape as the eleven above: the verb and its arguments on one line, then an indented description.

The rule the phase enforces is a set equality and not a count: the distinct verbs the block lists and the keys of `VERB_SPECS` are the same set. A count alone would pass on a block that lists `activity` twice and omits `channel`.

```text
$ node .skilled/bin/bots.cjs --help | rg -o '^  [a-z]+' | sort -u | wc -l
      11
$ node -e "const s=require('fs').readFileSync('.skilled/bin/bots.cjs','utf8');const m=s.match(/const VERB_SPECS = \{([\s\S]*?)\n\};/);console.log([...m[1].matchAll(/^  ([a-z]+):/gm)].length)"
11
```

Both read 11 today, so the pair agrees on the baseline and the row is unmet on the post-012 state. After 001 to 011 land the pair reads 19 and 19, and the phase re-measures both and records the new pair in `implementation-summary.md`.

---

## 10. A CLEAN REPORT AS A PERSON READS IT

The report is the artifact a person opens, so its first twenty lines are a screen. This is a clean doc run's.

```text
# Alignment report: topic system-skilled-bots

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: topic, file set doc-set
- Target: `topic system-skilled-bots`
- Commits: `79519553b62e41c7a018f4e3fde04f1d2f7f30ff` to `79519553b62e41c7a018f4e3fde04f1d2f7f30ff`, 0 first-parent commits
- Files: 121, of which 0 uncommitted or untracked
- Owners: 4
- Findings: 0 (P0 0, P1 0, P2 0), 0 literal, 0 inferred, 0 outside the scope; 0 more overturned by the critic and not counted
- Open findings: 0 (0 handed off, 0 rebutted)
- Lanes: L1, L2, L3, L4
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| D1 | Docs match the topic's current code | yes | 121 | lens only |
| D2 | Topic checks pass | yes | 0 | 3 |

## Battery

pass 3, fail 0, cannot run 0, not applicable 0

Grading: topic checks from topics.json; a doc-alignment run has no change-scoped battery.
```

The `- Open findings: 0 (0 handed off, 0 rebutted)` line is the clean criterion and it is the ninth line of the block. A check that anchors on the end of that line fails, which is why every criterion in this packet matches the prefix and not the whole line.

The `Commits:` line reads the same commit twice with 0 commits, which is correct for a doc run: it checks the docs as they stand and not a range.
