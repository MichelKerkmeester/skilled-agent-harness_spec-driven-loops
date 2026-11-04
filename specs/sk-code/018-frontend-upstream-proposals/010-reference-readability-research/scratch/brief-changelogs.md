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

PERSONA: You are @markdown, a LEAF documentation agent. Load sk-doc first and follow its changelog template (find it under .skilled/skills/sk-doc; the newest existing entry in each changelog folder below shows the house shape: frontmatter, H1 "vX, Title", one-paragraph lead, a "> Spec folder:" blockquote, &nbsp; spacers, Why This Release, What's New at a Glance, Upgrade). Never dispatch another agent.

TASK: T031 in tasks.md. Write one changelog entry per package for this restructure, and bump that package's SKILL.md frontmatter version to match. Describe only what changed in that package, read from `git diff HEAD -- <package dir>` (exclude changelog folders). Spec folder line: `specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research` (Level 2).

ENTRIES (new file, and the SKILL.md version line):
- .skilled/skills/sk-code/changelog/v3.10.1.0.md, .skilled/skills/sk-code/SKILL.md -> 3.10.1.0 (hub ROUTER and SKILL section order, stack-detection overview, shared workflow overviews)
- .skilled/skills/sk-code/sk-code-ci/changelog/v1.1.14.0.md, .skilled/skills/sk-code/sk-code-ci/SKILL.md -> 1.1.14.0
- .skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.3.0.md, .skilled/skills/sk-code/sk-code-frontend/SKILL.md -> 1.0.3.0
- .skilled/skills/sk-code/sk-code-quality/changelog/v1.13.17.0.md, .skilled/skills/sk-code/sk-code-quality/SKILL.md -> 1.13.17.0
- .skilled/skills/sk-code/sk-code-review/changelog/v1.9.15.0.md, .skilled/skills/sk-code/sk-code-review/SKILL.md -> 1.9.15.0
- .skilled/skills/sk-code/sk-code-skilled/changelog/v2.1.17.0.md, .skilled/skills/sk-code/sk-code-skilled/SKILL.md -> 2.1.17.0
- .skilled/skills/sk-doc/changelog/v2.4.0.0.md, .skilled/skills/sk-doc/SKILL.md -> 2.4.0.0 (ten render_* warnings in validate_document.py and template-rules.json, with tests)
- .skilled/skills/sk-doc/sk-create-skill/changelog/v1.11.0.0.md, .skilled/skills/sk-doc/sk-create-skill/SKILL.md -> 1.11.0.0 (template and guidance fixes, the reference skeleton, render checks promoted under package_skill.py --strict past render-known-debt.json)

ALLOWED WRITE PATHS: exactly the sixteen files above.

VERIFY (paste output):
  for f in <each new changelog>; do JEV_FEATURES=0 python3 -B .skilled/skills/sk-doc/scripts/validate_document.py $f --type changelog --json | head -3; done
  python3 specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/scratch/render-gate.py | tail -1
Expected: each valid true; render_warnings=0.
