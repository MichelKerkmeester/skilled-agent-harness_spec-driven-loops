@@PREAMBLE_MD@@

TASK: apply 3 literal text edits to one markdown file. Change nothing else in it.

FILE (edit): .skilled/skills/sk-doc/sk-create-skill/SKILL.md

EDIT 1, starting at line 5. Replace exactly this text, whole lines, between the ~~~~ fences and not including them:
~~~~
version: 1.2.0.0
~~~~
with exactly this text:
~~~~
version: 1.4.0.0
~~~~

EDIT 2, starting at line 80. Replace exactly this text, whole lines, between the ~~~~ fences and not including them:
~~~~
| Validation | `scripts/package_skill.py`, `../shared/scripts/extract_structure.py` | Check completion, package distribution zips, and inspect structure. |
~~~~
with exactly this text:
~~~~
| Validation | `scripts/package_skill.py`, `../shared/scripts/extract_structure.py` | Check completion, package distribution zips, and inspect structure. |
| Routing measurement | `scripts/score-clarify-default.cjs` | Count how often compiled hubs answer `clarify` with zero model calls and write unlabeled clarify rows. `--score` stops below 30 labeled rows. Past that gate `--jev` or `--deem` asks a classifier for a default pick. |
~~~~

EDIT 3, starting at line 468. Replace exactly this text, whole lines, between the ~~~~ fences and not including them:
~~~~
- `scripts/package_skill.py` - validation and packaging helper.
~~~~
with exactly this text:
~~~~
- `scripts/package_skill.py` - validation and packaging helper.
- `scripts/score-clarify-default.cjs` - zero-call clarify census and default-pick scorer. It stops below 30 labeled rows. `--jev` or `--deem` scores a pick only past that gate.
~~~~

Accept when: 1 file changed, every EDIT applied once, and the checks below pass.

@@TAIL@@

Checks to run: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/SKILL.md` must print `Total issues: 0` and exit 0.

@@HANDBACK@@
