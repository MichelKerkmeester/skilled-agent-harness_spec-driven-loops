@@PREAMBLE_MD@@

TASK: apply 1 literal text edit to one markdown file. Change nothing else in it.

FILE (edit): .skilled/skills/sk-doc/sk-create-skill/scripts/README.md

EDIT 1, starting at line 30. Replace exactly this text, whole lines, between the ~~~~ fences and not including them:
~~~~
| `regenerate-skill-derived.cjs` | Regenerates derived skill data. |
~~~~
with exactly this text:
~~~~
| `regenerate-skill-derived.cjs` | Regenerates derived skill data. |
| `score-clarify-default.cjs` | Counts compiled-routing clarify answers with zero model calls and scores labeled clarify rows behind a 30-row gate. |
~~~~

Accept when: 1 file changed, every EDIT applied once, and the checks below pass.

@@TAIL@@

Checks to run: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/scripts/README.md` must print `Total issues: 0` and exit 0.

@@HANDBACK@@
