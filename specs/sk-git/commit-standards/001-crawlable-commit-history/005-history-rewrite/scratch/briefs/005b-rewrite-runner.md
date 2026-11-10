GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-git/028-crawlable-commit-history/005-history-rewrite

Proceed directly to the work. Do not print A/B/C/D/E options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.
# ROLE

You are the Code Implementer persona of this repository (`.claude/agents/code.md`): a stack-aware
implementer who edits only the files named in the brief, follows the sk-code opencode shell and
Python standards, runs the named verification, and returns evidence, never a bare completion
claim. You are a leaf: never dispatch another agent or CLI. Do not commit. NEVER run the rewrite
against this repository, its origin, or any clone that is not a throwaway you created under
`/tmp` for the test. Do not write outside the three paths named below. Never write a spec path,
task id or ADR id into a code comment.

# CONTEXT

The history of `main` and `skilled/v4.0.0.0` will be rewritten so every commit carries a final
trailer paragraph: `Spec: <path>` when a plan row has a packet, `Commit-Id: NNNNNNN` always. A plan
file already exists in this shape, one JSON object per line:
`{"old": "<40-hex>", "ordinal": "0000123", "spec": "<path>|null", "rule": "...", "tie": false}`.
`git filter-repo` is installed. Facts from its help text: `--commit-callback` receives a commit
object whose `message` is bytes and whose `original_id` is the old SHA as bytes; `--message-callback`
also runs on tag messages, so it is not used for stamping; the tool prunes reflogs and refuses a
non-fresh clone without `--force`; it writes `.git/filter-repo/commit-map` with an `old new` header;
`--dry-run` disables message rewriting so it cannot rehearse this. Old messages may carry a
`Refs: specs/<path>` or `Refs: .opencode/specs/<path>` line: that line is REMOVED when the plan
gives the same packet as `Spec:`, and kept otherwise. Old messages may carry `Co-Authored-By` and
`Claude-Session` lines; those stay where they are. Commit messages also cite other commits by
hash (about 460 messages); a second pass remaps those from the commit map after the first pass.

Message shape after stamping: the existing message with trailing whitespace stripped, then one
blank line, then `Spec: ...` if any, then `Commit-Id: ...`. If the message already ends with a
paragraph made only of `Token: value` lines (the Co-Authored-By block), the new keys join that
final paragraph instead of opening a new one, so git's trailer parser sees one block: place
`Spec:` and `Commit-Id:` BEFORE `Co-Authored-By:` within it.

Read before writing:
- `.opencode/scripts/git-hooks/prepare-commit-msg`, for the trailer-shaped-line test and the
  blank-line rule the live stamper uses
- `git filter-repo --help` sections on callbacks, commit-map and `--force`

# ACTION

Create exactly three files under
`specs/sk-git/028-crawlable-commit-history/005-history-rewrite/scripts/`.

1. `stamp-callback.py`: a Python module with `load_plan(path) -> dict[bytes, dict]` and
   `stamp_message(message: bytes, row: dict) -> bytes` implementing the shape above, plus
   `remap_message(message: bytes, prefix_map: dict) -> bytes` that replaces 10-to-40-hex tokens
   equal to an old prefix with the new prefix of the same length. Pure functions, no git calls.
   A `main()` that prints a usage line; the functions are imported by the runner through
   filter-repo's callback text.

2. `rewrite-run.sh`: CLI
   `rewrite-run.sh --source <repo-or-url> --plan <plan.jsonl> --work <dir> [--refs main,skilled/v4.0.0.0] [--tags] [--rehearse]`
   Steps, each logged with a timestamp to `<work>/rewrite.log`:
   a. `git clone --mirror <source> <work>/backup.git` and `git clone --mirror <source> <work>/mirror.git`.
      Record every ref tip of both into `<work>/tips-before.txt` and assert they match.
   b. Verify every commit reachable from the named refs appears in the plan, and that the plan has
      no ordinal gaps; abort otherwise.
   c. First pass on the mirror: `git filter-repo --force --refs <refs and tags> --commit-callback
      "<python that imports stamp-callback.py by absolute path, looks up commit.original_id, and
      sets commit.message = stamp_message(...)>"`, with `--replace-refs delete-no-add`. Copy
      `mirror.git/filter-repo/commit-map` to `<work>/commit-map-1`.
   d. Second pass: `--message-callback` that calls `remap_message` with a prefix map built from
      `commit-map-1`, skipping messages without any hex token, and copy the cumulative
      `commit-map` to `<work>/commit-map`.
   e. Invariants, each printed as PASS or FAIL and the run exits non-zero on any FAIL:
      commit count on each ref equals the backup's; every mapped commit keeps its tree hash,
      author name, author email, author date and committer date; every message on the named refs
      carries exactly one `Commit-Id:` line and it equals the plan ordinal; tag count equals the
      backup's; commit-map rows equal the commit count; no message on the named refs still
      contains an old 10-hex prefix from the map.
   f. `--rehearse` means: run everything above and stop. Without it the script still stops, and
      prints the exact `git push --force` lines for the operator to run by hand. The script never
      pushes.

3. `tests/test_stamp_callback.py`: `unittest` covering stamp_message on a plain body, a body
   ending in a Co-Authored-By block, a message with a `Refs: specs/<same packet>` line that must be
   dropped, a `Refs:` line to a different path that must stay, a message with no packet, an
   idempotent second stamp, and remap_message on 10-hex, 40-hex and decoy tokens. Plus one
   integration test that builds a throwaway repo under `/tmp` with five commits and a tag, writes a
   plan, runs `rewrite-run.sh --rehearse` against it, and asserts the invariants section reports
   all PASS and that `git log --format=%B` on the rewritten mirror shows the ordinals 0000001 to
   0000005 and the tag survives.

# FORMAT

Return, in this order:
1. `python3 -m py_compile` and `bash -n` output for the three files.
2. The full output of `python3 -m unittest specs/sk-git/028-crawlable-commit-history/005-history-rewrite/scripts/tests/test_stamp_callback.py`.
3. The `rewrite.log` tail from the integration test's rehearsal, showing the invariants block.
4. One line: FILES_CHANGED: <the three paths>.
5. One line: UNKNOWNS: <anything you could not verify, or "none">.
