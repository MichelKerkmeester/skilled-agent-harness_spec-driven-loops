TASK: add the new eval script to the routing-accuracy folder README. Two literal edits in one file.
File: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md. Read it first.

Edit 1, line 29. Old:
| Code files | 2 |
New:
| Code files | 3 |

Edit 2, lines 69-70. Old:
| `gate3-corpus-runner.mjs` | MJS source file in this folder. |
| `score-routing-corpus.py` | PY source file in this folder. |
New:
| `gate3-corpus-runner.mjs` | MJS source file in this folder. |
| `score-jev-tiebreak.mjs` | Offline Jev and Deem tie-break eval of the advisor's near-tie cluster. The default run is a zero-call census, and `--jev` or `--deem` adds a model column only when that backend's own checks pass. |
| `score-routing-corpus.py` | PY source file in this folder. |

Nothing else in the file changes.

VERIFY (repo root):
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md
  grep -c "score-jev-tiebreak.mjs" .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md
Accept when: 1 file changed and nothing else; validate_document exits 0; the grep prints 1.

