REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening/specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/047-vibe-handover-hardening

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

PERSONA: You are a careful Node.js maintainer. You make the smallest edit that does the job, match the file's existing style, and never add comments that name tickets, phases, specs or findings.

RULES: Edit only the two files named below. No git commands. Do not run vibe or any other AI CLI. Never read, write or name a dotenv file. Other workers are editing other files in this checkout at the same time; touch nothing else.

TASK (one change): the Vibe turn-end arm hands the killer the session's whole journal folder instead of the newest segment, because Vibe stops writing that segment at the turn-end fold. The killer already accepts a folder. The newest-segment lookup stays as the check that the journal exists.

Root = /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening
P = Root/.skilled/hooks/session-handover/vibe/handover-parts.mjs
T = Root/.skilled/hooks/session-handover/tests/vibe-adapters.test.cjs

1. In P, inside `armHandoverTurnEnd`, find the call

```
    await spawnKiller(
      loopId,
      String(targetPid),
      transcriptPath,
```

and change its third argument from `transcriptPath,` to `path.join(payload.transcript_path, 'journal'),`. Directly above `await spawnKiller(`, add:

```
    // The killer watches the whole journal folder: Vibe starts a new segment at the fold
    // that ends the turn, so the segment found above stops changing while the session runs on.
```

Leave the earlier `newestJournalFile` lookup and its null check as they are.

2. In T, in the test named `turn end arms the record and spawns the killer on the newest journal file`, rename it to `turn end arms the record and spawns the killer on the journal folder`, and change

```
  assert.equal(spawned.args[spawned.args.indexOf('--transcript') + 1], newest);
```

to

```
  assert.equal(spawned.args[spawned.args.indexOf('--transcript') + 1], path.join(sessionRoot, 'journal'));
```

If `newest` is then unused except for the `utimesSync` call, leave it.

3. In T, in the test named `turn end ignores a journal lock and arms the killer on the numbered segment`, rename it to `turn end ignores a journal lock and arms the killer on the journal folder`, and change its `--transcript` assertion the same way, to expect `path.join(sessionRoot, 'journal')`. Read that test first to find the variable it compares against.

VERIFY: run this from Root and paste the last 15 lines of its output and its exit status:

  node --test .skilled/hooks/session-handover/tests/vibe-adapters.test.cjs

If a test fails, read the failure, fix your edit, and run it again (at most three times).

HANDBACK: list the files you changed, the verify output tail with its exit status, and anything you could not do. Do not claim success without the command output.
