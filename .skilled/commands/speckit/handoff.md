---
description: "Write the handoff note and prepare the session relaunch loop: the manual trigger on every runtime."
argument-hint: "(no arguments)"
allowed-tools: Read, Write, Bash
---

# /speckit:handoff

Manual entry point for the session relaunch loop. Writes this session's handoff note and prepares a pending record. Automatic runtimes arm it at their end event. Command-only runtimes leave it pending and use a manual claim command.

---

## 1. PURPOSE

The relaunch loop carries work into a fresh session near the end of this session's useful context. This session writes a standalone handoff note. The wrapper relaunches the runtime with a claim seed. The new session picks up the remaining work. This command is the manual trigger on runtimes wired with the session-relaunch hooks and the only trigger on runtimes without a hook. The automatic nudge fires only inside `skilled-loop`. Outside the loop, a session keeps working and runs this command only when the operator explicitly asks for a manual handoff. Sourcing `.skilled/bin/skilled-loop-shell.sh` from `~/.zshrc` or `~/.bashrc` starts every interactive runtime launch inside the loop, so nobody has to start the wrapper by hand. The note this command writes is gitignored runtime state for the next session, not a spec packet's `handover.md`. Section 5 covers a session seeded with `[session-relaunch] claim and continue handoff <path>`.

---

## 2. CONTRACT

**Inputs:** nothing through `$ARGUMENTS`. Both `prepare` and `claim` require `--session <id>`. Only Claude Code can omit it and use `$CLAUDE_CODE_SESSION_ID`. On Claude, `CLAUDE_PID` supplies the runtime process id for the shell-child check and the killer's target, both only while it descends from the loop. Other runtimes must pass the session id. If a runtime has no session-id variable, such as Devin or Cursor, run `uuidgen` once and reuse that id for the session. `spec_folder` records the Gate 3 answer: the repo-relative packet path, `none` after D) Skip or empty when Gate 3 was never answered.

**Outputs:**

- A handoff note at `.skilled/skills/.state/session-relaunch/handoffs/<UTC yyyymmddThhmmssZ>-<first 8 chars of the session id>.md`.
- One `STATUS=` line per the exit code in Step 5.
- When a spec packet is bound: save continuity before `prepare` runs. The nudge asks for the note first, and either order works. Claude runs `/speckit:save`. Other runtimes pipe the save JSON to the continuity writer.

**CLI:** `node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs`

| Invocation | Effect | Exit |
|---|---|---|
| `prepare --handoff <path> --session <id> [--runtime <name>]` | Validate the note and write the pending relaunch record | `0` prepared (pending until an automatic arm event, or manual on command-only runtimes), `2` refused (reason on stderr, including a runtime conflict), `3` no automatic hop: not under `skilled-loop`, or the hop limit is reached |
| `claim <path> --session <id>` | Move the note `open -> claimed` and print its body | `0` ok, `2` refused |
| `complete <path>` | Move the note `claimed -> done` | `0` ok, `2` refused |

---

## 3. WORKFLOW OVERVIEW

| Step | Name | Purpose | Output |
|---|---|---|---|
| 1 | Resolve inputs | Session id, cwd, spec binding | Values for the note |
| 2 | Save the packet | Claude runs `/speckit:save`. Other runtimes use the continuity writer when a packet is bound | Fresh continuity |
| 3 | Write the note | `status: open` handoff file | The note path |
| 4 | Prepare | CLI validates and records | Exit code `0`, `2` or `3` |
| 5 | Report | Translate the exit code | `STATUS=` line |

---

## 4. INSTRUCTIONS

### Step 1: Resolve inputs

- Session id: both commands require `--session <id>`. Claude Code can omit the flag because the CLI reads `$CLAUDE_CODE_SESSION_ID`. Other runtimes pass the id directly. If a runtime exposes no session-id variable, such as Devin or Cursor, run `uuidgen` once and reuse that value for the rest of the session. The id fills the note's `session_id`, the filename suffix and `--session`.
- cwd: the absolute working directory.
- Spec binding: use the repo-relative packet path when one is bound. Use `none` when Gate 3 was answered D) Skip. Leave the field empty when Gate 3 was never answered.

### Step 2: Save the bound packet

When `spec_folder` is a packet path, save its continuity before `prepare` so the receiving session's `/speckit:resume` lands on fresh state. The automatic nudge asks for the note first and the save second. Both orders meet that need. Claude runs `/speckit:save`. Other runtimes pipe the save JSON to `node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js --stdin --full-auto <spec-folder>`. Record the repo-relative packet path in `spec_folder`. When Gate 3 was answered D) Skip, set `spec_folder` to `none` and skip the save. When Gate 3 was never answered, leave `spec_folder` empty.

### Step 3: Write the handoff note

Create the directory first:

```bash
mkdir -p .skilled/skills/.state/session-relaunch/handoffs
```

Name the file `<UTC yyyymmddThhmmssZ>-<first 8 chars of session id>.md`. `date -u +%Y%m%dT%H%M%SZ` produces the stamp and `${SESSION_ID:0:8}` the suffix. The note format is exact:

```markdown
---
status: open
session_id: <id of the session that wrote it>
loop_id: <SKILLED_LOOP_ID or empty>
runtime: <runtime-name>
cwd: <absolute cwd>
spec_folder: <repo-relative packet path, none if Gate 3 was answered D) Skip or empty if Gate 3 was never answered>
created_at: <ISO-8601 UTC>
---
## Goal
<non-empty>
## Done
<non-empty>
## Remaining work
<non-empty>
## In-flight state
<non-empty>
```

Frontmatter is flat `key: value` lines only: no nesting, no lists. `loop_id` is `$SKILLED_LOOP_ID`, empty when the session is not running under the wrapper. `runtime` is the runtime that wrote the note. Every section must be non-empty. Goal states what the work is for. Done records finished work. Remaining work lists the claimable tail. In-flight state preserves the active work the next session must not lose, including open files, half-applied edits, running processes and pending decisions.

### Step 4: Prepare

```bash
node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs prepare --handoff <path> --session <session id> --runtime <runtime>
```

Pass `--session <id>` to `prepare`. Only Claude Code can omit it and use `CLAUDE_CODE_SESSION_ID`. The `--runtime` value must be one of `claude`, `pi`, `opencode`, `codex`, `cursor`, `hermes` or `devin`. Outside the loop, it overrides the environment or Claude default. Inside the loop, it must match `SKILLED_LOOP_RUNTIME` or prepare exits 2. The handoff nudge passes the session id and runtime.

### Step 5: Report by exit code

- `0`: prepared. The record is pending until the runtime's arm event fires. Command-only runtimes leave it pending for the wrapper's manual command. Report `STATUS=OK RESULT=prepared HANDOFF=<path>` and stop.
- `2`: refused. Show the stderr reason verbatim. Fix the cause it names, then run `prepare` again. The cause may be an invalid note, a note owned by another session or a live shell child of the runtime process. Report `STATUS=FAIL ERROR="<reason>"` only when the refusal cannot be repaired.
- `3`: no automatic hop. Either the session is not running under `skilled-loop`, or the loop has reached its hop limit, in which case the CLI first prints `hop limit reached; continue in this session` and auto-compaction stays the fallback. Both cases print the claim command for the selected runtime. Show it verbatim and report `STATUS=OK RESULT=manual HANDOFF=<path>`. For automatic hops in later sessions, start the runtime through `skilled-loop`, or source `.skilled/bin/skilled-loop-shell.sh` from the shell profile so a plain `claude`, `pi`, `opencode`, `codex`, `hermes`, `devin` or `cursor-agent` launch starts under it.

| Runtime | Printed command |
|---|---|
| Claude | `skilled-loop claude "[session-relaunch] claim and continue handoff <path>"` |
| Pi | `skilled-loop pi "[session-relaunch] claim and continue handoff <path>"` |
| OpenCode | `skilled-loop opencode --prompt "[session-relaunch] claim and continue handoff <path>"` |
| Codex | `skilled-loop codex "[session-relaunch] claim and continue handoff <path>"` |
| Cursor | `skilled-loop cursor "[session-relaunch] claim and continue handoff <path>"` |
| Hermes | `skilled-loop hermes chat -q "[session-relaunch] claim and continue handoff <path>"` |
| Devin | `skilled-loop devin -- "[session-relaunch] claim and continue handoff <path>"` |

The CLI and wrapper place each path `!` in single quotes outside the seed's double quotes. For example, they print `skilled-loop claude "[session-relaunch] claim and continue handoff /tmp/han"'!'"doff.md"`. Interactive Bash keeps that path intact when history expansion is on.

---

## 5. RECEIVING A HANDOFF

A session seeded with `[session-relaunch] claim and continue handoff <path>` is on the other side of this protocol. It:

1. Runs `node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs claim <path> --session <session id>`, which moves the note `open -> claimed` and prints its body. Only Claude Code may omit `--session` and use `CLAUDE_CODE_SESSION_ID`. A runtime without a session-id variable generates an id with `uuidgen` and reuses it for the session.
2. Reads the note's Goal, Done, Remaining work and In-flight state sections.
3. Runs `/speckit:resume <spec_folder>` when the field contains a repo-relative packet path. When it is `none`, Gate 3 was answered D) Skip and the receiver does not ask it again. When it is empty, Gate 3 was never answered and the receiver asks it as usual.
4. Continues the Remaining work.
5. Runs `node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs complete <path>` when the handoff is fully absorbed.

The note's status moves only `open -> claimed -> done`. When this session prepares a successor hop, `prepare` marks as `done` every other note this session claimed and every other open note this session wrote, sets `completed_at` and adds `superseded_by` with the new note's basename. It leaves done notes, notes of another session and the new note unchanged.

---

## 6. EXAMPLES

**Example 1: inside the loop**

```text
/speckit:handoff
```

The note is written and `prepare` exits `0`. On an automatic runtime, its arm event can qualify the record for relaunch when the session ends.

**Example 2: outside the loop, at the operator's request**

```text
/speckit:handoff
```

The operator asked for a manual handoff. `prepare` exits `3` and the command shows the selected runtime's printed claim command so the operator can run the hop by hand. Without that request, a session outside the loop keeps working.

---

## 7. RELATED COMMANDS

- `/speckit:save`: used before the note on Claude when a spec packet is bound. Other runtimes use the continuity writer.
- `/speckit:resume`: runs on the receiving side when the note names a `spec_folder`.
