# Verb and record map

Every scenario this phase adds drives one verb and reads one record or file. This note is the lookup a builder uses to find which phase owns the behavior a scenario asserts, and which file the scenario reads back.

## 1. The nine new verbs

None of these verbs exists in the CLI verb table at the time of this run. Each probe prints `bots: unknown verb: <verb>` and exits 2, and `baseline-verbs.txt` holds the whole probe.

| Verb | Phase | What it writes | Scenario that drives it |
|---|---|---|---|
| `activity` | 001 | nothing, it reads the run records and the needs-you items | BOT-040, BOT-041, BOT-042 |
| `routines` | 002 | nothing, it reads the routine block and the routine state file | BOT-035, BOT-036, BOT-037, BOT-038, BOT-039 |
| `ui` | 003 | nothing, it starts the crate's binary | BOT-043, BOT-044, BOT-045 |
| `remember` | 005 | the shared memory file and the per-bot memory file | BOT-048, BOT-049, BOT-050, BOT-031 |
| `apps` | 007 | nothing, it reads the filtered `utcp.json` a run wrote | BOT-051, BOT-052 |
| `secret` | 008 | the secret store entry | BOT-053, BOT-054, BOT-055 |
| `skill` | 009 | the proposal draft and the review item | BOT-056, BOT-057, BOT-032 |
| `chat` | 010 | the conversation JSONL and one run record | BOT-026, BOT-027, BOT-028, BOT-029, BOT-030 |
| `channel` | 011 | `channels/config.json`, `links.json`, `operators.json`, the approval index and the send queue | BOT-033, BOT-034, BOT-058 |

## 2. The verbs that already exist

These verbs ship today, so a scenario that drives them fails on the behavior rather than on the verb. The phase column names the phase that extends the verb.

| Verb | Phase that extends it | What the scenario reads | Scenario |
|---|---|---|---|
| `run` | 004 adds the working-place line, 005 the memory block, 007 the apps filter, 008 the secret environment, 009 the skill block | the run record and the stub executor's receipt | BOT-046, BOT-049, BOT-051, BOT-054, BOT-055, BOT-056, BOT-057 |
| `status` | 004 adds `branch` and `worktree` | the status row and its JSON form | BOT-047 |
| `answer` | 001 adds `--as` and `--scope`, 006 adds the grants, 011 the roster check | the item's `answer` object and the resume request | BOT-028, BOT-029, BOT-030, BOT-042 |
| `inbox` | 001 adds `--json` and `--all`, 005 and 009 the proposal kinds | the item file and the JSON object | BOT-030, BOT-031, BOT-041 |
| `check` | 007 adds `apps-unknown-server`, 009 adds three skill invariants | one `FAIL:` line per defect | BOT-052, BOT-056, BOT-057 |
| `drain` | 010 and 011 reuse it for a resume request | the request record and the resumed run record | BOT-028, BOT-030, BOT-033, BOT-034 |
| `enable` | 002 adds the fatigue lift | the routine state file and the switch | BOT-039 |
| `pause` | unchanged | the switch and the refusal | BOT-040 |

## 3. The records a scenario reads back

| Record or file | Path under the world | Written by | Read by |
|---|---|---|---|
| Run record | `$W/state/*/records/<run id>.json` | the runner | BOT-026, BOT-035, BOT-037, BOT-039, BOT-042, BOT-046, BOT-049, BOT-051, BOT-054, BOT-055 |
| Needs-you item | `$W/state/*/needs-you/<item id>.json` | the runner and the proposal writers | BOT-028, BOT-030, BOT-031, BOT-032, BOT-034, BOT-041 |
| Conversation | `$W/state/*/conversations/<conversation id>.jsonl` | the chat verb | BOT-026, BOT-027, BOT-028 |
| Memory file | `$W/state/*/memory/shared.md` and `$W/state/*/memory/<bot id>.md` | the remember verb | BOT-048, BOT-049, BOT-050 |
| Routine state | `$W/state/*/routines/<bot id>.json` | the runner | BOT-037, BOT-039 |
| Filtered apps config | the run's own folder under the state root | the runner before dispatch | BOT-051, BOT-052 |
| Secret store | `$W/state/*/secrets/` | the secret verb | BOT-053, BOT-054, BOT-055 |
| Channel config | `$W/state/*/channels/config.json` | the channel link verb | BOT-033, BOT-034, BOT-058 |
| Send queue | `$W/state/*/channels/queue/` | the send path before the I/O | BOT-058 |
| Stub receipt | `$W/acct/stub-receipts/<run id>.json` | the shipped stub executor | BOT-046, BOT-049, BOT-051, BOT-054, BOT-055, BOT-056, BOT-057 |

## 4. Why the map matters

A scenario that fails has to name the phase that owns the behavior, or the defect lands on the wrong desk. The map is the one place that pairing is written down, and `scenario-inventory.md` repeats it per scenario with the requirement id.
