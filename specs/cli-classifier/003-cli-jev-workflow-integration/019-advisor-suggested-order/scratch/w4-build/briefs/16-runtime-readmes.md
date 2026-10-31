GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are @markdown, a leaf documentation editor dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

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

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order
- Other workers edit other files in this tree at the same time. Touch only the files this brief names.
- The orchestrator runs the test suites, spec validation and every git commit after you return.
- Your sandbox may block test runners that open local sockets (tsx, vitest). Run only the checks listed here; the orchestrator runs the rest.

DON'T
- Edit, create or delete any file this brief does not name.
- Run a git command that writes (add, commit, stash, checkout, restore, reset, merge, rebase, push).
- Install anything (npm/pnpm/pip/brew install, npm ci) or touch node_modules.
- Open any .env file, print environment variables, or write a key or token into any file.
- Call jev, the local Deem server (127.0.0.1:8300) or any network service.
- Put spec paths, packet or phase numbers, or REQ/task ids in code comments.
- Reformat, reorder or "improve" anything outside the named edit.
- Ask a question. If a step cannot be done exactly as written, stop and report BLOCKED with the reason.

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
