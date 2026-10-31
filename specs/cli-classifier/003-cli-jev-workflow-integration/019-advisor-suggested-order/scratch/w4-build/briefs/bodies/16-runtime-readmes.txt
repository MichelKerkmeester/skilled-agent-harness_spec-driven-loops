TASK: list the new script and its test in the two runtime folder READMEs. Literal edits in two files.
A = .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md
P = .skilled/skills/system-skill-advisor/runtime/tests/parity/README.md
Read both first.

In A:
1. Line 29: replace `| Code files | 3 |` with `| Code files | 4 |`.
2. Directly after line 70, the row that starts with `| `score-jev-tiebreak.mjs` |`, insert this one new line:
| `score-suggested-order.mjs` | Offline Jev and Deem order of the advisor's whole near-tie cluster, timed inside a child like the prompt hook's. The default run makes no model call, and `--jev` or `--deem` adds a column only when there is headroom and that backend's own checks pass. |

In P:
3. Directly after line 32, the tree line that starts with `+-- score-jev-tiebreak.vitest.ts`, insert this one new line:
+-- score-suggested-order.vitest.ts  # Offline suggested-order eval checks with stub binaries and stub timed children
4. Directly after line 43, the row that starts with `| `score-jev-tiebreak.vitest.ts` |`, insert this one new line:
| `score-suggested-order.vitest.ts` | Pins the suggested-order eval's helpers, keep rule, timed child, headroom stops, gates, both arms and report with synthetic rows, stub `jev` and `cli-deem` binaries and stub children. It makes no model call. |

VERIFY (repo root):
  grep -c "| Code files | 4 |\|score-suggested-order.mjs" .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md
  grep -c "score-suggested-order.vitest.ts" .skilled/skills/system-skill-advisor/runtime/tests/parity/README.md
Accept when: only A (+2/-1) and P (+2) changed; the first grep prints 2; the second prints 2.
