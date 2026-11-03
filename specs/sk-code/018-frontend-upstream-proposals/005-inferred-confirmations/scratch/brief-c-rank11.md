GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-code/018-frontend-upstream-proposals/005-inferred-confirmations

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.


PERSONA: You are @code, a LEAF implementation agent. Load `sk-code` first and follow the surface it selects (SKILLED).
Edit only the files named below. Never dispatch another agent.
Never alter text, characters or tests to make a check pass. If a check flags a value you believe is legitimate, leave it and report it.
End with one status line: `STATUS=OK FILES=<n>` or `STATUS=FAIL ERROR=<reason>`.


ROLE: Make every routing keyword matcher treat a hyphen and a space alike, on both the prompt and the keyword. Evidence:
`scratch/rank11-trace.txt` in this phase ("widget-panel layout bug" and "widget panel layout bug" route differently).
P = `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program` (the AUTHORED compiled-routing source;
its served copies under `.skilled/bin/lib/compiled-routing/` are published by a sync tool and are never hand-edited).

ACTION:
1. In each matcher below, compare the prompt text and the keyword after replacing every run of hyphens with one space on
   both sides (for example a local `const spaced = (s) => s.replace(/-+/g, ' ');`). Keep the existing lower-casing and the
   word-boundary regex paths; apply the same replacement to both sides before a regex test. Add one short comment per file
   saying why: a hyphenated and a spaced prompt name the same thing. Do not change the literal `'forbidden'` checks.
   - P/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs `containsSignal`
   - P/009-parent-hub-rollout/001-sk-code/lib/policy-card.cjs keyword selector (about line 165)
   - P/009-parent-hub-rollout/002-system-deep-loop/lib/canary-router.cjs `containsSignal`
   - P/009-parent-hub-rollout/003-mcp-tooling/lib/router.cjs `containsSignal`
   - P/009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs keyword matcher (about line 112)
   - P/009-parent-hub-rollout/007-sk-doc/lib/router.cjs `containsSignal`
   - P/009-parent-hub-rollout/008-cli-classifier/lib/router.cjs keyword matcher (about line 112)
   - P/009-parent-hub-rollout/009-sk-design/lib/canary-router.cjs `containsSignal`
   - P/009-parent-hub-rollout/009-sk-design/lib/policy-card.cjs keyword selector (about line 167)
   - P/004-compiler-n1-shadow/compiler/projections.cjs keyword and negative-admission matches (about lines 290-296)
   - P/004-compiler-n1-shadow/compiler/evaluator.cjs detector matches (about lines 30 and 106)
   - `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` `keywordHits`
2. Publish: run `node .skilled/bin/compiled-route-sync.cjs` once; it prints a rollback path and a `--finalize` command.
   Do NOT finalize. Report both lines.
3. New test `.skilled/bin/tests/compiled-route-hyphen-parity.test.cjs` (node:test, modelled on
   `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` for its imports): for every hub in `DEFAULT_ON_HUBS`, read its
   `hub-router.json` vocabulary keywords, take up to three keywords that contain a space, and assert that
   `resolveRoute(hub, '<keyword> please')` and `resolveRoute(hub, '<keyword with spaces as hyphens> please')` return the same
   action, selectionKind and target modes. Do the same in reverse for up to three keywords that contain a hyphen.
4. In `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs`, add one test that `keywordHits`
   (export it if needed) matches "widget panel" in "widget-panel layout bug" and "widget-panel" in "widget panel layout bug".

ALLOWED WRITE PATHS: the twelve files in step 1, the two test files in steps 3 and 4, and whatever `compiled-route-sync.cjs`
writes under `.skilled/bin/lib/`.
BANNED OPERATIONS: no `rm` outside the OS temp dir, no `git` command of any kind, no `mv`, no hand edit under
`.skilled/bin/lib/compiled-routing/`, no `--finalize` or `--revert`, no edit to any ROUTER.md, hub-router.json,
mode-registry.json or activation manifest, no installs, no network calls. No code comment names a spec folder, phase,
task, ADR or rank number.

VERIFY before the status line, and paste each command with its output and exit code:
- `node --test .skilled/bin/tests/compiled-route-*.test.cjs` (the only failure allowed is the pre-existing "the live corpus
  holds the pinned number of gold scenarios"; report any other failure exactly)
- `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/` (must exit 0)
- `node .skilled/bin/compiled-route-sync.cjs --check`
- `for h in sk-code sk-doc sk-design mcp-tooling system-deep-loop cli-external-orchestration cli-classifier; do node .skilled/bin/compiled-route-status.cjs --hub $h | grep causeCode; done`
