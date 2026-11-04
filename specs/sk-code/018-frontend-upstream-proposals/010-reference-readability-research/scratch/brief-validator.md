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

TASK: T010 in tasks.md: add ten render checks to the document validator, as warnings. The check definitions are research.md Section 5 (the Validator check column). Implement exactly those ten: render_bold_label_join, render_setext_underline, render_bare_url, render_overview_heading, render_overview_orientation, render_repeated_sentence, render_repeated_label, render_h2_numbering, render_section_order, render_intro_restates_purpose (advisory, token overlap >= 0.6).

ALLOWED WRITE PATHS:
- .skilled/skills/sk-doc/shared/scripts/validate_document.py
- .skilled/skills/sk-doc/shared/assets/template-rules.json
- .skilled/skills/sk-doc/scripts/tests/test_render_checks.py (new)
- .skilled/skills/sk-doc/scripts/tests/render/ (new fixture directory)

REQUIREMENTS:
- Every check skips YAML frontmatter and is fence-aware through the existing `_fenced_line_numbers` helper (validate_document.py:606). A URL inside inline code, inside a Markdown link target, or inside `<...>` is not bare.
- Each finding is a warning (never a blocking error) whose `type` is the check name, with `line` and a short `message`. Follow the shape existing warnings use in this file.
- Checks run after `validate_general_structure` only when the document type's rules carry `"renderChecks": true`. Set it on the reference, asset, skill and skill_router types in template-rules.json.
- render_section_order also reads `firstSectionName` and `lastSectionPattern` for those four types only; add `"lastSectionPattern": "related"` to reference, asset and skill. Do not start reading those keys for readme or security_policy. A section matching the pattern must be the last H2, a trailing MACHINE ROUTER excepted. In a skill_router a related section sits directly before MACHINE ROUTER.
- render_bold_label_join: two consecutive non-blank lines, neither a list item, both opening with `**...**`. Skip `**[Placeholder]**` style labels.
- render_setext_underline: a `---` or `===` line directly under a paragraph line, where the line above is not a heading, list item, table row, HTML comment, blockquote, blank, or frontmatter.
- render_h2_numbering: in reference, asset and skill docs, a letter-suffixed H2 number (`## 2b.`) or an unnumbered H2 among numbered ones.

TESTS (test_render_checks.py, runnable by the existing harness .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh; read that harness first to see how Python tests are discovered and run):
- Positives: copy the three files in specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/scratch/fixtures/ into scripts/tests/render/ as fixtures. web-cascade-and-selectors.md must produce exactly these warning types: render_bold_label_join, render_bare_url, render_overview_heading, render_overview_orientation, render_repeated_label. web-markup-and-css.md must produce render_setext_underline.
- Negatives, one small fixture each: list-item labels; a URL in a fence, in inline code and in <...>; [Placeholder] labels; two features sharing one browser triple in one Support bullet (the shape at .skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md line 78, which must NOT trip render_repeated_sentence); `---` under a heading, a list item and a table row; a router whose related section precedes MACHINE ROUTER.
- Assert the validator still returns valid: true for the positives (warnings only).

VERIFY (run from the repo root, paste output):
  ONLY_TESTS=test_render_checks.py bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh 2>&1 | tail -5
  JEV_FEATURES=0 python3 -B .skilled/skills/sk-doc/scripts/validate_document.py specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/scratch/fixtures/web-cascade-and-selectors.md --type reference --json
  python3 specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/scratch/render-gate.py | tail -40
Expected: PASS test_render_checks.py; valid true with exactly the five types; the render gate lists hits consistent with research.md Section 6 and no invalid file.
