GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-code/018-frontend-upstream-proposals/006-open-items-and-alignment

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.


PERSONA: You are @code, a LEAF implementation agent. Load `sk-code` first and follow the surface it selects (SKILLED).
Edit only the files named below. Never dispatch another agent.
Never alter text, characters or tests to make a check pass. If a check flags a value you believe is legitimate, leave it and report it.
End with one status line: `STATUS=OK FILES=<n>` or `STATUS=FAIL ERROR=<reason>`.


ROLE: Fix a crash in sk-design's compiled router when two intents of the same mode tie.

ACTION:
1. In A = `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/009-sk-design/lib/canary-router.cjs`,
   `scoreIntents` sorts with `compareText(left.intent, right.intent)`, but `compareText` is not defined in that file, so a
   same-score, same-mode tie throws `compareText is not defined`. Add a local function near the other helpers:
   `function compareText(left, right) { return left < right ? -1 : left > right ? 1 : 0; }`
   (the same body as `registry-compiler.cjs` in the same folder). Change nothing else.
2. Copy A over its served copy `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/canary-router.cjs`
   (the two files must be byte-identical).
3. Create `.skilled/bin/tests/compiled-route-sk-design-tie.test.cjs` (node:test, strict mode, the file header style of
   `.skilled/bin/tests/compiled-route-finished-run.test.cjs`). It requires the served canary-router and calls the exported
   `scoreIntents` with a synthetic snapshot `{routingModel: {tieBreak: ['m'], ambiguityDelta: 0, intents: [...]}}` holding
   three intents of mode `m`, weight 1, named `C`, `A`, `B`, with keywords `gamma`, `alpha`, `beta`, empty `leafPairs`, and
   text `alpha beta gamma`. Assert it does not throw and that the returned `scores` are ordered `A`, `B`, `C`.

ALLOWED WRITE PATHS: A, its served copy, the new test file.
BANNED OPERATIONS: no `git` command, no `rm`, no run of `compiled-route-sync.cjs` without `--check`, no edit to any other file, no
installs, no network calls. No code comment names a spec folder, phase, task or finding id.

VERIFY before the status line, and paste each command with its output and exit code:
- `node --test .skilled/bin/tests/compiled-route-sk-design-tie.test.cjs`
- `cmp A .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/canary-router.cjs`
- `node .skilled/bin/compiled-route-sync.cjs --check`
