# Playbook contract

The rules every scenario in this phase obeys. They come from the playbook skill's own contract and from the package validator, and a scenario that breaks one fails the package check rather than a reader's patience.

## 1. The five sections

Every scenario file carries exactly five level-two headings, in this order and with these names.

| Position | Heading | What it holds |
|---|---|---|
| 1 | `## 1. OVERVIEW` | what the operator does, and a `### Why This Matters` subsection |
| 2 | `## 2. SCENARIO CONTRACT` | objective, real user request, prompt, expected process, expected signals, desired outcome, pass/fail |
| 3 | `## 3. TEST EXECUTION` | the prompt, the one bash block, one subsection per turn, the expected list, the evidence list, the pass/fail rule and the failure triage |
| 4 | `## 4. SOURCE FILES` | the playbook sources and the implementation and test anchors |
| 5 | `## 5. SOURCE METADATA` | group, playbook id, canonical root source and feature file path |

The validator reads the heading text, so a renamed section is a violation rather than a style choice.

## 2. One bash block

Each scenario gives one block, run in order in one shell. The block builds its world in the first turn, drives the behavior in the middle turns and removes the world in its last turn. A turn is a numbered comment, and the prose below the block gives one subsection per turn with what the operator should see.

The block starts with `mktemp -d` and removes that folder at the end. A scenario that leaves a temp folder behind is a scenario that fills a disk over a hundred runs.

## 3. The verdict vocabulary

The only verdicts are `PASS`, `FAIL` and `SKIP`. The words `PARTIAL`, `READY`, `UNAUTOMATABLE` and `BLOCKED` are refused by the validator in any casing, because each of them hides which of the three actually happened.

A `SKIP` names its blocker in the same row. A `SKIP` with no blocker is refused by the recorder.

## 4. No tty

Every check runs from a pipe. The screen's refusal, its key handling and the `bots answer` write are each proved by a command that needs no terminal, and the words `isTTY` and `/dev/tty` appear nowhere in the corpus. A scenario that needs a terminal to prove its point is a scenario an automated run cannot repeat.

## 5. The throwaway world

Every runtime scenario uses the identity `local/bots-playbook`, a `pb-` bot id and a state root inside its own temp folder. It never reads or writes a real bot's state. The one exception is BOT-021, which installs a launchd job and removes it in its last turn.

## 6. The stub executor

The model is the one stand-in. `pbots` puts the shipped stub executor first on PATH, so the real runner, recursion guard, records, queue, worktree, delivery, installer and status code run end to end and no model is called. The stub writes the prompt it received to `$HOME/stub-receipts/<run id>.json`, which is how a scenario reads what a child was told.

## 7. The recursion guard

The command line of `bots run` and `bots drain` must never contain `claude`, `codex`, `opencode` or `vibe`. The guard reads the command lines of every ancestor process and refuses with exit 3 on a match. A scenario run from inside an AI runtime session is a setup `SKIP`, not a product `FAIL`.

## 8. The root link

Every scenario file is linked from `manual-testing-playbook.md`, once from its own section block and once from the catalog table. A file the root does not link is a file no operator will find.

## 9. The citation form

A citation is `[SOURCE: path:line]` and the line has to resolve. A contract is cited by file and section rather than copied, so a change to the contract does not leave a stale copy in the corpus. A path that does not exist yet is written with a `$` prefix, which marks it as a world path or a path a later phase creates.

## 10. The result record

A run is recorded by `record-playbook-run.cjs` and never by hand. The recorder writes `results.csv` with the columns `scenario_id,runtime,verdict,reason,evidence`, a leading line naming itself and the run's own page. A hand-edited `results.csv` is a record with no provenance.
