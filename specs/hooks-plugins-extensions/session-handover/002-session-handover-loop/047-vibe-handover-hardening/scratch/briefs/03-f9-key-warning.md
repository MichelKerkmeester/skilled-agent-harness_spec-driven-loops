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

PERSONA: You are a careful Bash and Node.js maintainer. You make the smallest edit that does the job, match the file's existing style, and never add comments that name tickets, phases, specs or findings.

RULES: Edit only the two files named below. No git commands. Do not run vibe or any other AI CLI. Never read, write or name a dotenv file. Never print or write a real key value. Other workers are editing other files in this checkout at the same time; touch nothing else.

TASK (one change): `skilled-loop vibe` warns once on stderr when `MISTRAL_API_KEY` is exported, because Vibe then bills that key instead of the plan key its browser sign-in stored. It still starts the runtime.

Root = /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening

1. In `Root/.skilled/bin/skilled-loop`, directly after the line `export SKILLED_LOOP_RUNTIME="$runtime"`, add:

```
# Vibe reads an exported MISTRAL_API_KEY before the plan key its browser sign-in stored, so a
# key from another budget bills there, and every session after a hop inherits it.
if [ "$runtime" = vibe ] && [ -n "${MISTRAL_API_KEY:-}" ]; then
  printf '%s\n' '[skilled-loop] MISTRAL_API_KEY is exported, so Vibe bills that key instead of the plan key from its browser sign-in. Unset it to use the plan.' >&2
fi
```

2. In `Root/.skilled/hooks/session-handover/tests/skilled-loop-wrapper-launch-arguments.test.cjs`, directly after the test named `a Vibe hop never replays the headless-only --model flag`, add:

```

test('a Vibe loop warns once when MISTRAL_API_KEY is exported and still starts', (t) => {
  const warning = '[skilled-loop] MISTRAL_API_KEY is exported';
  const runs = [];
  for (const [runtime, key] of [['vibe', 'placeholder-not-a-key'], ['vibe', ''], ['claude', 'placeholder-not-a-key']]) {
    const sandbox = createSandbox(t);
    const { recordPath } = installRuntimeStub(sandbox, { markers: '1' });
    installVibeStub(sandbox);
    if (key) sandbox.env.MISTRAL_API_KEY = key;
    else delete sandbox.env.MISTRAL_API_KEY;
    const result = runWrapper(sandbox, [runtime, 'first prompt']);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readRecords(recordPath).length, 2);
    runs.push(result.stderr.split(warning).length - 1);
  }
  assert.deepEqual(runs, [1, 0, 0]);
});
```

VERIFY: run this from Root and paste the last 12 lines of its output and its exit status:

  node --test --test-name-pattern="Vibe" .skilled/hooks/session-handover/tests/skilled-loop-wrapper-launch-arguments.test.cjs

If it fails, read the failure, fix your edit, and run it again (at most three times).

HANDBACK: list the files you changed, the verify output tail with its exit status, and anything you could not do. Do not claim success without the command output.
