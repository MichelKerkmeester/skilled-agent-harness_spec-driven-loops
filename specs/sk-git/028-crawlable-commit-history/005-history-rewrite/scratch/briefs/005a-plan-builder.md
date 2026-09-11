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
implementer who edits only the files named in the brief, follows the sk-code opencode Python
standards (`argparse`, a module docstring, type hints, no dependency outside the standard
library, functions under 50 lines, an `if __name__ == "__main__"` guard), runs the named
verification, and returns evidence, never a bare completion claim. You are a leaf: never dispatch
another agent or CLI. Do not commit. Do not run git filter-repo. Do not write outside the two
paths named below. Never write a spec path, task id or ADR id into a code comment.

# CONTEXT

Every commit on `skilled/v4.0.0.0` will be rewritten to carry a final trailer paragraph:
`Spec: <track>/<packet>[/<phase>...]` when the commit is packet work and `Commit-Id: NNNNNNN`
always, a seven-digit zero-padded ordinal. A later step rewrites messages from a plan file; this
brief builds the plan. The plan must be reproducible from one pinned SHA and must never be
minted inside a rewrite callback.

Rules the plan encodes:
- Ordinal: the 1-based position of each commit in `git rev-list --reverse --topo-order <tip>`,
  formatted `%07d`. Every commit gets one, including merges and git-generated subjects.
- Packet, by the first rule that fires, per commit:
  1. A body line `Refs: specs/<path>` or `Spec: <path>` naming an existing packet directory
     under `specs/` (strip a leading `specs/` or `.opencode/specs/`). The value is the packet path
     relative to `specs/`, nested phases included, so `specs/sk-git/028-x/001-y/plan.md` maps to
     `sk-git/028-x/001-y`. Take the deepest directory that matches `^[0-9]{3}-` segments under a
     track directory.
  2. A numeric-only scope in the subject plus exactly one touched packet whose leading number
     matches that scope.
  3. Exactly one touched packet, only when the subject scope is consistent with the track: the
     scope equals the track name, or names a skill directory whose path sits under that track's
     topic, or is one of the generic scopes `specs`, `spec-kit`, `speckit`, `docs`, `repo`. When
     the scope is inconsistent the rule does not fire.
  4. More than one touched packet: the one with the most changed files wins. Ties break by the
     deepest packet path, then lexicographic order, and a tie that survives both is recorded with
     `"tie": true` for manual adjudication and gets no packet.
  5. Otherwise no packet.
- "Touched packet" means a changed path under `specs/<track>/<NNN-...>[/<NNN-...>...]`. The
  packet is the deepest `NNN-` directory on the path. Paths under `z_archive/` count as their
  archived packet. These files are EXCLUDED from the touch signal because many unrelated commits
  brush them: `goal.md`, `graph-metadata.json`, `description.json`, `handover.md`, any path with
  an `activation/` or `scratch/` segment, and any `.jsonl` or `.log` file.
- Commits whose subject starts with `Merge `, `Revert "`, `fixup! `, `squash! ` or `amend! `
  get an ordinal and rule 1 only; rules 2 to 4 do not fire for them.

Measured facts you can verify: 9,110 or more commits on the tip and moving, so the tool takes an
explicit `--tip <sha>`; 1,355 commits carry numeric scopes; about 5,987 touch `specs/`.

Read before writing:
- `.opencode/scripts/git-hooks/commit-msg` lines 40-48 and 72 for the exempt subjects and the
  subject regex
- `.opencode/skills/sk-code/sk-code-opencode/references/python/style-guide.md` sections on
  structure and naming

# ACTION

Create exactly two files.

1. `specs/sk-git/028-crawlable-commit-history/005-history-rewrite/scripts/build-commit-plan.py`
   CLI: `build-commit-plan.py --repo <path> --tip <sha> --out <plan.jsonl> [--sample N --seed S]`
   - Reads history with `git rev-list --reverse --topo-order <tip>` and, per commit, the subject,
     body and changed paths (`git show --format=%H%n%s%n%b --name-only`, or
     `git log --name-only` in one pass for speed; one pass is required, per-commit subprocesses
     are too slow at 9,000 commits).
   - Emits one JSON object per line, in ordinal order:
     `{"old": "<40-hex>", "ordinal": "0000123", "spec": "<path>|null", "rule": "refs|scope-dir|unique-touch|dominant-touch|none", "tie": false, "candidates": [...]}`
     where candidates lists the touched packets considered.
   - Prints a summary to stderr: total, per-rule counts, ties.
   - `--sample N --seed S` additionally writes `<out>.sample.jsonl` with N random rows plus the
     subject and the changed paths, for hand judgment.
   - Deterministic: the same tip and repo give byte-identical output.

2. `specs/sk-git/028-crawlable-commit-history/005-history-rewrite/scripts/tests/test_build_commit_plan.py`
   `unittest`, builds a throwaway repo with commits shaped for each rule: a Refs line to an
   existing packet, a numeric scope with one matching packet, a single-touch with a consistent
   scope, a single-touch with an inconsistent scope that must NOT map, a two-packet commit with a
   clear winner, a two-packet tie, a commit touching only `goal.md` that must NOT map, a merge
   commit, and a commit touching nothing under specs. Asserts ordinals are consecutive from
   0000001 and output is identical across two runs.

# FORMAT

Return, in this order:
1. `python3 -m py_compile` output for both files.
2. The full output of `python3 -m unittest specs/sk-git/028-crawlable-commit-history/005-history-rewrite/scripts/tests/test_build_commit_plan.py`.
3. The stderr summary of a real run:
   `python3 <script> --repo . --tip $(git rev-parse skilled/v4.0.0.0) --out /tmp/plan.jsonl --sample 100 --seed 28`
   plus `wc -l /tmp/plan.jsonl` and `head -3 /tmp/plan.jsonl`.
4. One line: FILES_CHANGED: <the two paths>.
5. One line: UNKNOWNS: <anything you could not verify, or "none">.
