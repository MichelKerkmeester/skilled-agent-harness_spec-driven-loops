GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

CONTEXT: read `specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/research/research.md` (the confirmed findings, by id) and the task named below in that folder's `tasks.md`. The task text is your specification. Where this brief and the task differ, this brief wins.

BANNED OPERATIONS:
- Touching any file not listed under ALLOWED WRITE PATHS.
- Rewording rule or contract text beyond what the task names. Moving or splitting text is allowed when the task says so; every claim must survive.
- Changing a rule id, or a heading another file links to, unless the task names it.
- Writing a spec path, phase number, task id or finding id (HUB-1, TPL-2, T010 and the like) into any file outside the spec folder, including code comments.
- git add, git commit, git push, git stash, git checkout, git reset.
- Using an em dash or en dash in text you write.
- Never alter a test or a check to make it pass. If a check flags something you believe is right, leave it and report it.

End with one status line: `STATUS=OK FILES=<n>` or `STATUS=FAIL ERROR=<reason>`, preceded by the verification output you ran.
