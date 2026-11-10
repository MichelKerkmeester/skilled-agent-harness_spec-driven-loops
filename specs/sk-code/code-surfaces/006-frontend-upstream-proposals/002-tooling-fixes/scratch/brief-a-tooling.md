GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-code/018-frontend-upstream-proposals/002-tooling-fixes

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.


PERSONA: You are @code, a LEAF implementation agent. Load `sk-code` first and follow the surface it selects (SKILLED).
Edit only the files named below. Never dispatch another agent.
Never alter text, characters or tests to make a check pass. If a check flags a value you believe is legitimate, leave it and report it.
End with one status line: `STATUS=OK FILES=<n>` or `STATUS=FAIL ERROR=<reason>`.

ROLE: Teach two router tools in `.skilled/skills/sk-doc/sk-create-skill/scripts/` the fixes recorded in
`specs/sk-code/018-frontend-upstream-proposals/002-tooling-fixes/decision-record.md` (read ADR-001 and ADR-002 first).

ACTION:
1. `generate-router-intent-signals.cjs`:
   - `plan()` also computes `orphans`: entries of the hub's `intent_signals_generated` array that no router phrase
     declares any more (lower-cased comparison, as for `missing`) and that the hub's `intent_signals_keep` array does
     not list. A hub with neither array has no orphans. Hand-curated `intent_signals` entries are never orphans.
   - `--write` appends each missing phrase to `intent_signals` AND to `intent_signals_generated` (create the array
     when absent), and removes each orphan from both arrays, keeping the order of every entry that stays.
     It writes the file only when something changed.
   - `--check` prints each orphan as `       - <phrase>` under its hub line, adds `orphans=<n>` to the hub line and the
     `checked=` summary line, prints `RESULT: FAILED` and exits 1 when any hub has a missing phrase or an orphan.
   - `--json` adds `orphans: [...]` and `removed: <n>` per hub; keep every existing field.
   - Rewrite the header comment so it describes the provenance rule and the keep list, and no longer says the
     generator only ever adds.
2. `ci-skill-root-metadata.cjs`: add `'intent_signals_generated'` and `'intent_signals_keep'` to
   `GRAPH_METADATA_TOP_LEVEL_KEYS`, each with a one-line comment saying which tool writes or reads it. When present,
   each must be an array of non-blank strings; report a broken one under a new code `GRAPH_METADATA_INVALID_SIGNAL_LIST`.
3. `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`: add one bullet after the
   "Optional quality block" bullet describing the two optional arrays, and one row for `GRAPH_METADATA_INVALID_SIGNAL_LIST`
   in the findings table after the `GRAPH_METADATA_INVALID_SURFACE_DETECTION` row.
4. `ci-router-vocabulary-reach.cjs`: set `DEFAULT_CONCURRENCY = 2` with a comment giving the reason in ADR-002 (advisor
   load reported as unreachable phrases at 8). Replace the final `main();` with
   `if (require.main === module) main();` and add `module.exports = { DEFAULT_CONCURRENCY };`.
5. New test file `tests/generate-router-intent-signals-orphans.test.cjs`, using `node:test` and the temp-tree pattern
   of `testRouterIntentSignalsSkipsPrivateHubs` in `tests/skill-derived-regenerator.test.cjs` (copy the script into a
   temp repo). Cases:
   - one generated phrase no router declares: `--check` exits 1, stdout names it and shows `orphans=  1`;
   - `--write` on that fixture removes it from both arrays and the remaining `intent_signals` keep their order;
   - a generated phrase listed in `intent_signals_keep` is neither reported nor removed;
   - a hand-curated undeclared phrase (not in `intent_signals_generated`) is neither reported nor removed;
   - `--write` adds a newly declared phrase to both arrays;
   - an empty `intent_signals` with no arrays reports nothing and exits 0.
6. New test file `tests/ci-router-vocabulary-reach-default.test.cjs`: `require` the reach script and assert
   `DEFAULT_CONCURRENCY === 2`.
7. In `tests/skill-root-metadata-contract.test.cjs` (or the test that covers `ci-skill-root-metadata.cjs` unknown keys),
   add one case: a valid `intent_signals_generated` passes, and one holding a blank string reports
   `GRAPH_METADATA_INVALID_SIGNAL_LIST`.

ALLOWED WRITE PATHS:
- .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs
- .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs
- .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
- .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md
- .skilled/skills/sk-doc/sk-create-skill/scripts/tests/ (the three test files named above only)
- temp directories under the OS temp dir, created and removed by the tests

BANNED OPERATIONS: no `rm` outside the OS temp dir, no `git` command of any kind, no `mv`, no `find -delete`, no `--write`
run of `generate-router-intent-signals.cjs` against the real repository (only inside temp fixtures), no edit to any
`graph-metadata.json` in the repository, no installs, no network calls. No code comment names a spec folder, phase,
task, ADR or REQ id.

VERIFY before the status line, and paste each command with its output and exit code:
- `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/` (must exit 0)
- `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check` against the real tree (report its output; it must not write)
- `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` (read `--help` for the call form; report the result)
- `git` is banned, so list the files you changed by name.
