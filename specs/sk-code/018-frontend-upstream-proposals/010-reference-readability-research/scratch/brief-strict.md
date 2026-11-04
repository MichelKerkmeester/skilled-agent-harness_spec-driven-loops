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

PERSONA: You are @code, a LEAF implementation agent. Load sk-code first and follow the surface it selects (SKILLED, Python). Never dispatch another agent.

TASK: T030 in tasks.md. package_skill.py --check --strict must block new render defects in a skill's references/ and assets/, while a known-debt ledger tolerates the existing ones in other skills.

ALLOWED WRITE PATHS:
- .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py
- .skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json (new)
- .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py
- any new fixture directory under .skilled/skills/sk-doc/scripts/tests/ that the new tests need

REQUIREMENTS:
- validate_skill runs the render_* checks of .skilled/skills/sk-doc/shared/scripts/validate_document.py over every .md under the skill's references/ and assets/ (import or call it the way package_skill.py already uses validate_document, read the file first).
- Each render finding becomes a warning whose text carries the marker `render check`; add that marker to STRICT_PROMOTED_MARKERS so --strict promotes it to an error.
- A finding recorded in render-known-debt.json is tolerated. Mirror the shape and the never-raise rule of the existing routing-shape known-debt ledger (find it with rg -n 'known-debt' .skilled/skills/sk-doc/sk-create-skill/scripts). The ledger may only shrink: state that rule in its header field as the routing ledger does.
- Seed the ledger from `python3 specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/scratch/render-gate.py --fleet` output file specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/scratch/fleet-render.json (run the gate first), keyed the same way the routing ledger keys entries, with every entry under sk-code/ and sk-doc/sk-create-skill/ left out.
- Tests in test_package_skill_regressions.py: a fixture skill whose reference has a joined bold label fails --strict with the marker, passes without --strict, and passes --strict once its finding is ledgered.

VERIFY (paste output):
  ONLY_TESTS=test_package_skill_regressions.py bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh 2>&1 | grep -E '^(PASS|FAIL)'
  for d in .skilled/skills/sk-code .skilled/skills/sk-code/sk-code-ci .skilled/skills/sk-code/sk-code-frontend .skilled/skills/sk-code/sk-code-quality .skilled/skills/sk-code/sk-code-review .skilled/skills/sk-code/sk-code-skilled .skilled/skills/sk-doc/sk-create-skill .skilled/skills/mcp-code-mode; do echo "$d: $(python3 .skilled/skills/sk-doc/scripts/package_skill.py $d --check --strict 2>&1 | tail -1)"; done
  rg -c 'sk-code/|sk-create-skill/' .skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json   (must print nothing)
Expected: PASS; Result: PASS for all eight; no ledger key for sk-code or sk-create-skill.
