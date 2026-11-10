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

PERSONA: You are @markdown, a LEAF documentation agent. Load sk-doc first and follow the reference and asset templates it routes to. Never dispatch another agent.

TASK: T012 in tasks.md. Do every bullet of that task and nothing else.

ALLOWED WRITE PATHS:
- .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md
- .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-router-template.md
- .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md
- .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md

VERIFY (run from the repo root, paste output):
  python3 specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/scratch/render-gate.py | grep -F -e 'skill-md-template.md' ; python3 specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/scratch/render-gate.py | tail -1
  python3 specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/scratch/check-anchors.py . | tail -1   (baseline is broken=21, all example links in templates; it must not rise)
  for f in <each file you edited>; do JEV_FEATURES=0 python3 -B .skilled/skills/sk-doc/scripts/validate_document.py $f --json | head -3; done
Expected: no render_* hit in the files you edited, broken stays 21, every file valid true.
  ONLY_TESTS="test_create_skill_contract.py test_routing_shape.py test_surface_packet_sections.py" bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh 2>&1 | tail -4
  node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-root-router.test.cjs .skilled/commands/doctor/scripts/tests/parent-skill-check-routing-shape.test.cjs 2>&1 | grep -E '^ℹ (pass|fail)'
Expected also: three PASS lines and fail 0.
