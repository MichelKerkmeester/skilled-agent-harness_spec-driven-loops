@@PREAMBLE_MD@@

TASK: apply 3 literal text edits to one markdown file. Change nothing else in it. A second brief adds a subsection to the same file later.

FILE (edit): .skilled/skills/sk-doc/sk-create-skill/README.md

EDIT 1, starting at line 7. Replace exactly this text, whole lines, between the ~~~~ fences and not including them:
~~~~
version: 1.2.0.19
~~~~
with exactly this text:
~~~~
version: 1.2.0.20
~~~~

EDIT 2, starting at line 147. Replace exactly this text, whole lines, between the ~~~~ fences and not including them:
~~~~
| Structure extraction | `python3 ../shared/scripts/extract_structure.py <path/to/SKILL.md>` | Prints the parsed section outline for a fast quality read |
~~~~
with exactly this text:
~~~~
| Structure extraction | `python3 ../shared/scripts/extract_structure.py <path/to/SKILL.md>` | Prints the parsed section outline for a fast quality read |
| Clarify census and scorer | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs` | `pass 28` and `fail 0` |
~~~~

EDIT 3, starting at line 162. Replace exactly this text, whole lines, between the ~~~~ fences and not including them:
~~~~
| [`scripts/package_skill.py`](./scripts/package_skill.py) | Validation and packaging helper |
~~~~
with exactly this text:
~~~~
| [`scripts/package_skill.py`](./scripts/package_skill.py) | Validation and packaging helper |
| [`scripts/score-clarify-default.cjs`](./scripts/score-clarify-default.cjs) | Zero-call clarify census and default-pick scorer |
~~~~

Accept when: 1 file changed, every EDIT applied once, and the checks below pass.

@@TAIL@@

Checks to run: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/README.md` must print `Total issues: 0` and exit 0.

@@HANDBACK@@
