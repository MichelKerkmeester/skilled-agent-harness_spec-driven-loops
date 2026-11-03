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


ROLE: Stop the hyphen/space fold from counting one mention twice, and fold the one matcher it missed.

Context: every compiled matcher now folds hyphen runs to a space (the `spaced()` helper) on both the text and the keyword.
Some vocabularies list both spellings of one phrase ("code quality" and "code-quality" in sk-code; "deep-research" and
"deep research" in system-deep-loop; 16 such pairs across sk-code, system-deep-loop, mcp-tooling, cli-classifier and
cli-external-orchestration), so a prompt that names the phrase once now matches two keywords and scores double.

ACTION:
1. In R = `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/`, wherever a matcher scores by
   counting matched keywords or detectors, count each folded form once (for example a `Set` of `spaced(...)` values of the
   keywords that hit, then its size). Find them with `rg -n "containsSignal|detectorMatches|includes\(spaced" R` and read
   each scorer: `scoreModes` and `scoreIntents` in `009-parent-hub-rollout/{001-sk-code,002-system-deep-loop,009-sk-design}/lib/canary-router.cjs`,
   the scorers in `009-parent-hub-rollout/{003-mcp-tooling,004-cli-external-orchestration,007-sk-doc,008-cli-classifier}/lib/router.cjs`
   (for detector routers, two detectors whose values fold to the same text count once), `scoreSelectors` in
   `004-compiler-n1-shadow/compiler/evaluator.cjs` and the keyword count in `replayPolicyCard` in `004-compiler-n1-shadow/compiler/projections.cjs`.
   Do not change which keywords match, only how many times a folded form counts.
2. `009-parent-hub-rollout/002-system-deep-loop/lib/policy-card.cjs` line ~249 still matches selector keywords without the
   fold. Fold it the way `009-parent-hub-rollout/001-sk-code/lib/policy-card.cjs` does.
3. The same counting in `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` `scoreIntents`: a keyword
   whose folded form already counted for that intent adds nothing.
4. Run `node .skilled/bin/compiled-route-sync.cjs` once to publish the authored copies into `.skilled/bin/lib/compiled-routing/`.
   Do NOT run `--finalize` or `--revert`; report the rollback path it prints.
5. Add `.skilled/bin/tests/compiled-route-fold-dedupe.test.cjs` (node:test, strict mode, header style of
   `compiled-route-finished-run.test.cjs`, and the activation-root setup of `compiled-route-hyphen-parity.test.cjs`): for each
   default-on hub, find vocabulary keyword pairs in `.skilled/skills/<hub>/hub-router.json` that fold to the same text; for
   each pair, score a prompt that names the phrase once with that hub's served scorer (the exported `scoreModes` or its
   equivalent, fed the hub's compiled routing model) and assert the owning mode scores its weight times one, not two.
   Keep it deterministic. Add one case to
   `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs`: an intent with keywords `["deep research",
   "deep-research"]` and weight 2 scores 2 for "run deep research", not 4.

ALLOWED WRITE PATHS: the files named above under R, their served copies under `.skilled/bin/lib/compiled-routing/` (written
by the sync), the leaf replay and its test, the new test file.
BANNED OPERATIONS: no `git` command, no `rm` outside the OS temp dir, no `--finalize` or `--revert`, no edit to any other file,
no installs, no network calls. No code comment names a spec folder, phase, task or finding id.

VERIFY before the status line, and paste each command with its output and exit code:
- `node --test .skilled/bin/tests/compiled-route-*.test.cjs` (report every failing test name)
- `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/`
- `node .skilled/bin/compiled-route-sync.cjs --check`
- `node .skilled/bin/compiled-route-admission.cjs --all` (every hub must pass)
