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


PERSONA: You are @deep-research, a LEAF investigator. You run commands and record what they print; you change no tracked
file. Never dispatch another agent. End with one status line: `STATUS=OK FILES=4` or `STATUS=FAIL ERROR=<reason>`.

ROLE: Run one confirming experiment for each of four suspected tooling defects, and save each run with its command, its
full relevant output and its exit status. S = `specs/sk-code/018-frontend-upstream-proposals/005-inferred-confirmations/scratch`.
Report what happened; do not fix anything; do not guess a cause the output does not show.

ACTION:
1. Rank 10 -> `S/rank10-replay.txt`. Suspicion: `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs`
   (`parseIntentSignals`, about lines 75-89) keeps only quoted strings and one weight per intent, while
   `.skilled/skills/sk-design/sk-design-fundamentals/ROUTER.md` (about line 113) writes keywords as `(phrase, weight)` tuples,
   so a fundamentals control prompt resolves no intent. Run the replay (its usage is
   `leaf-route-replay.cjs [--report <dir>] [--transcripts <dir>] [--prose <file>]`; write any report into a temp dir under the
   OS temp dir), and also call its exported parser, if it exports one, on the fundamentals ROUTER.md from a small node script
   kept in the OS temp dir. Say whether the tuples, `INTENT_MODEL`, or both cause a no-intent result, and quote the lines that show it.
2. Rank 12 -> `S/rank12-index.txt`. Suspicion: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`
   finds its repo root from its own directory, so a project that links the Skilled source in gets an index with none of that
   project's `specs/` paths, even with `--repo-root .`. Make a temp git repo under the OS temp dir: `git init`, a symlink
   `.skilled -> <this worktree>/.skilled`, and one spec doc at `specs/demo/001-demo/spec.md` with a `trigger_phrases` entry
   (copy the frontmatter shape of any spec.md in this worktree). From inside the temp repo run the generator twice, once
   plain and once with `--repo-root .`, ALWAYS with `--out <tempdir>/idx-<n>.json` so the shared index is never written. Count
   the `specs/` paths in each output and whether `specs/demo` appears. Then delete the temp repo.
3. Rank 13 -> `S/rank13-save.txt`. Suspicion: a save aimed at a phase parent exits 0 but scores the payload 0/100 and
   refreshes only `graph-metadata.json`, silently. Make a second temp git repo the same way (symlinked `.skilled`), scaffold a
   phase parent with one child there using `bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --help` to find the
   phase form, then run the save tool (`generate-context`; find its built `.js` under `.skilled/skills/system-spec-kit/`) with
   `--project-root <temprepo>` aimed at the phase parent, once with a minimal payload `{"specFolder":"<parent>"}` and once with
   a payload holding `user_prompts`, `observations` and `recent_context`. Record each run's printed score, exit status and the
   files it changed (`git status --short` inside the temp repo). Then delete the temp repo.
4. Rank 11 -> `S/rank11-trace.txt`. Suspicion: the sk-code hub picks a mode from `hub-router.json` aliases with a matcher that
   treats "x-y" and "x y" differently. Find the code that matches prompt text against hub-router vocabulary for
   `resolveRoute` in `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` and name the file and function
   that does the matching. Then, without editing any repository file, compile a copy of the sk-code registry in memory with one
   extra test alias "widget panel" on the `sk-code-frontend` mode (see how `.skilled/bin/tests/compiled-route-surface-hint.test.cjs`
   calls `compileRegistry`), and route "widget-panel layout bug" and "widget panel layout bug" through it. Record both routes.
   If in-memory compile is impossible, explain why and instead trace the tokenizer by reading the code, quoting the lines.

ALLOWED WRITE PATHS: the four files in S, and anything under the OS temp dir (remove what you create there).

BANNED OPERATIONS: no edit, move or delete of any tracked or untracked file in this worktree other than the four S files; no
`git` command inside this worktree except `git status --short` and `git diff --stat`; no run of the trigger-index generator
without `--out`; no save aimed at any folder in this worktree; no installs; no network calls.

VERIFY before the status line: paste `git status --short` and `git diff --stat` for this worktree, which must show only the
four S files as new, and list the temp directories you created and removed.
