GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-git/028-crawlable-commit-history/008-second-pass-subjects-and-attribution

Proceed directly to the work. Do not print A/B/C/D/E options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.
# ROLE

You are the Code Implementer persona of this repository (`.claude/agents/code.md`): a stack-aware
implementer who edits only the files named in the brief, follows the sk-code opencode Python and
shell standards (argparse, module docstring, type hints, standard library only, functions under
50 lines, a main guard), runs the named verification, and returns evidence, never a bare
completion claim. You are a leaf: never dispatch another agent or CLI. Do not commit. Never run
git filter-repo or any git command that writes to this repository. Never write a spec path,
task id or ADR id into a code comment. Do not add Co-Authored-By or any attribution line anywhere.

# CONTEXT

The first rewrite pass shipped in `../005-history-rewrite/scripts/`: `stamp-callback.py` formats
the trailer paragraph from a plan row, `rewrite-run.sh` runs the two filter-repo passes on a
mirror and proves six invariants. A second pass now needs four more behaviors, decided by the
operator:

1. Replace each subject with `subject_new` from a subject plan (JSONL rows `{"old": sha,
   "subject_new": ...}`) when it is not null; exempt and residual rows keep their subject.
2. Emit one `Spec:` line per touched packet, the dominant one first, from the commit plan's
   `spec` and `candidates` fields, deduplicated.
3. Strip every trailer line matching `^(Co-Authored-By|Claude-Session):` and every trailer line
   containing `anthropic` case-insensitively, anywhere in the message; the trailer paragraph must
   remain contiguous and end the message.
4. Three new invariants in the runner, each PASS or FAIL: zero forbidden lines remain on the
   named refs; every non-exempt subject passes the commit-msg grammar (port the checks from
   `.opencode/scripts/git-hooks/commit-msg` lines 60 to 115); every commit's Spec line count
   equals its candidate count in the plan.

And the two hooks:

5. `.opencode/scripts/git-hooks/commit-msg`: an error for any body line matching the forbidden
   patterns above, naming the line.
6. `.opencode/scripts/git-hooks/prepare-commit-msg`: strip those lines before stamping, silently,
   so a runtime that appends them never lands one; idempotent.

Read `stamp-callback.py`, `rewrite-run.sh`, both hooks and their harnesses before editing.

# ACTION

Edit exactly these files: `../005-history-rewrite/scripts/stamp-callback.py`,
`../005-history-rewrite/scripts/rewrite-run.sh` (new flag `--subject-plan <jsonl>`),
`../005-history-rewrite/scripts/tests/test_stamp_callback.py`,
`.opencode/scripts/git-hooks/commit-msg`, `.opencode/scripts/git-hooks/prepare-commit-msg`,
`.opencode/scripts/git-hooks/tests/commit-msg.test.sh`,
`.opencode/scripts/git-hooks/tests/prepare-commit-msg.test.sh`. Keep every existing behavior
and test. Add cases: subject replaced, subject kept when null, two Spec lines dominant first,
attribution lines stripped from the middle and the end, an `anthropic` trailer stripped, the
integration rehearsal asserting the three new invariants, the hook refusing a Co-Authored-By
line, and the stamper removing one before stamping.

# FORMAT

Return, in this order:
1. `python3 -m py_compile` and `bash -n` for every edited file.
2. The unittest output and the two hook harness summaries, from real runs.
3. `git diff --stat`.
4. One line: FILES_CHANGED: <paths>.
5. One line: UNKNOWNS: <anything you could not verify, or "none">.
