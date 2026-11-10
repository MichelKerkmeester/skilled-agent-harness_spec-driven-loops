GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

PERSONA: You are @code, a LEAF implementation agent. Load `sk-code` first and follow the surface it
selects (SKILLED). Edit only the files named below. Never dispatch another agent or another codex.
Never alter text, characters or tests to make a check pass. If a check flags a value you believe is legitimate, leave it and report it.
End with one status line: `STATUS=OK FILES=<n>` or `STATUS=FAIL ERROR=<reason>`.

ROLE: Finish wiring the read-only `sk-code-frontend` surface into compiled routing, the way `sk-code-ci` is wired.

ACTION:
1. Rename the keyword "react native list performance" to "react native scroll performance" in
   `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md`, `.skilled/skills/sk-code/ROUTER.md`,
   `.skilled/skills/sk-code/mode-registry.json` and `.skilled/skills/sk-code/hub-router.json`. Then rerun
   `generate-leaf-manifest.cjs` for sk-code and `generate-router-intent-signals.cjs --write`, both in
   `.skilled/skills/sk-doc/sk-create-skill/scripts/`.
2. In the AUTHORED fixture `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`, add a case
   after `surface-bundle-ci`, copied from it: id `surface-bundle-frontend`, prompt
   "implement a figma design with css cascade layers", expectedModes and gold.expectedIntents
   `["sk-code-quality","sk-code-frontend"]`.
3. In `.skilled/bin/tests/compiled-route-surface-hint.test.cjs`, after the CI tests, add:
   - a test that `resolveRoute('sk-code', 'implement a figma design with css cascade layers')` routes as a
     `surfaceBundle` with modes `['sk-code-quality', 'sk-code-frontend']`;
   - a test that these prompts never select `sk-code-frontend`: "fix the css in the advisor dashboard script",
     "write a react hook test", "review the github actions workflow yaml".
   If the resolver returns other modes, do not change the expectation: report the actual route.
4. Run `node .skilled/bin/compiled-route-status.cjs --hub sk-code --pretty`. Copy its
   `manifestFreshness.currentPolicyHash` into `effectivePolicyHash` of
   the AUTHORED manifest `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`, keeping the file on one line.
   Then run `node .skilled/bin/compiled-route-sync.cjs` once to promote the authored copies into `.skilled/bin/lib/compiled-routing/`.
   Rerun status: `causeCode` must no longer be `stale-manifest`. Never hand-edit the served copies under `.skilled/bin/lib/`.

ALLOWED WRITE PATHS (edit only these; the sync tool and the two generators may write their own outputs):
- .skilled/skills/sk-code/sk-code-frontend/ROUTER.md
- .skilled/skills/sk-code/ROUTER.md, mode-registry.json, hub-router.json, leaf-manifest.json, graph-metadata.json
- specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json
- specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json
- .skilled/bin/tests/compiled-route-surface-hint.test.cjs

BANNED OPERATIONS: no `rm`, no `git` commands of any kind, no `mv`, no `find -delete`, no writes outside ALLOWED WRITE PATHS
except the outputs of the named tools, no installs, no network calls. Do not run `ci-router-vocabulary-reach.cjs`.

VERIFY before the status line, and paste each command with its output and exit code:
- `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs`
- `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` (must print no FAIL line)
- `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`
- `node .skilled/bin/compiled-route-sync.cjs --check`
