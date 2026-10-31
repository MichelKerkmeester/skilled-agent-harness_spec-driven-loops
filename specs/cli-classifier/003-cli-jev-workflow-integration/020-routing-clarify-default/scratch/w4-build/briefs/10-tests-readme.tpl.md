@@PREAMBLE_MD@@

TASK: apply 1 literal text edit to one markdown file. Change nothing else in it.

FILE (edit): .skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md

EDIT 1, starting at line 30. Replace exactly this text, whole lines, between the ~~~~ fences and not including them:
~~~~
| `root-router-contract.test.cjs` | Tests the two-state root ROUTER.md contract and its stable negative codes. |
~~~~
with exactly this text:
~~~~
| `root-router-contract.test.cjs` | Tests the two-state root ROUTER.md contract and its stable negative codes. |
| `score-clarify-default.test.cjs` | Tests the clarify census, the transcript count, the label gate, the keep rule and both backend gates on stub binaries. |
~~~~

Accept when: 1 file changed, every EDIT applied once, and the checks below pass.

@@TAIL@@

Checks to run: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md` must print `Total issues: 0` and exit 0.

@@HANDBACK@@
