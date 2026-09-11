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
standards (`argparse`, a module docstring, type hints, standard library only, functions under 50
lines, an `if __name__ == "__main__"` guard), runs the named verification, and returns evidence,
never a bare completion claim. You are a leaf: never dispatch another agent or CLI. Do not commit.
Do not write outside the two paths named below. Never write a spec path, task id or ADR id into a
code comment.

# CONTEXT

A history rewrite with git filter-repo will change every commit hash on this repository's two
release lines. filter-repo writes a commit map: a text file whose first line is `old new` and
whose remaining lines are `<40-hex old> <40-hex new>` pairs, with an all-zero new value meaning
the commit was removed. Spec documents cite commits by hash: about 12,700 tokens of 10 to 40 hex
characters across 1,900 markdown files under `specs/`, of which about 1,700 distinct tokens match
a commit prefix and 294 are full 40-hex commit hashes. The rest are decoys, 13-digit epoch
timestamps and digests, and must stay byte-identical. Ten-hex prefix collisions among commits are
zero, measured.

Read before writing:
- `.opencode/skills/sk-code/sk-code-opencode/references/python/style-guide.md` sections on
  structure and naming

# ACTION

Create exactly two files.

1. `specs/sk-git/028-crawlable-commit-history/005-history-rewrite/scripts/remap-citations.py`
   CLI: `remap-citations.py --commit-map <path> --root <dir> [--root <dir> ...] --ext .md [--apply] [--report <json>]`
   - Dry run is the default. `--apply` writes.
   - Parse the map: require the `old new` header, skip all-zero new values, build a dict from
     every old prefix of length 7 to 40 to the new hash. Before building, assert that no two old
     hashes share a 10-hex prefix and exit non-zero naming them if they do.
   - Walk every root, read only files with the given extensions, find tokens matching
     `(?<![0-9a-zA-Z])[0-9a-f]{10,40}(?![0-9a-zA-Z])`. Replace a token only when it equals
     `old[:len(token)]` for exactly one old hash. Emit `new[:len(token)]`. Never touch anything
     else. Preserve file bytes otherwise, including line endings.
   - Report, to stdout and to `--report` as JSON: files scanned, files changed, replacements by
     token length, distinct tokens replaced, distinct tokens skipped as non-commit, and after an
     apply a residue check that rescans and counts tokens still equal to any old prefix, which
     must be 0.
   - Exit non-zero if the residue check finds anything after `--apply`.

2. `specs/sk-git/028-crawlable-commit-history/005-history-rewrite/scripts/tests/test_remap_citations.py`
   `unittest` with a temp directory: a synthetic map of five commits, files carrying 10-hex,
   12-hex and 40-hex citations of them, a 13-digit timestamp, a 10-hex token that matches no
   commit, a token embedded in a longer word that must be left alone, a `.json` file that must be
   skipped by extension, and a file with CRLF endings. Asserts the dry run changes nothing, the
   apply rewrites exactly the expected tokens, the decoys are byte-identical, the residue is 0,
   the CRLF file keeps its endings, and a map with a colliding prefix is refused.

# FORMAT

Return, in this order:
1. `python3 -m py_compile` output for both files.
2. The full output of `python3 -m unittest specs/sk-git/028-crawlable-commit-history/005-history-rewrite/scripts/tests/test_remap_citations.py`.
3. The dry-run report of a real run against this repository with a synthetic identity map built
   from the first 50 commits of `git rev-list skilled/v4.0.0.0` mapped to themselves
   (`old new` header, then `sha sha` lines): it must report replacements as 0 changed files
   because old equals new, and it must list how many distinct commit tokens it recognized.
4. One line: FILES_CHANGED: <the two paths>.
5. One line: UNKNOWNS: <anything you could not verify, or "none">.
