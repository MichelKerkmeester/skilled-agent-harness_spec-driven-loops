GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are @markdown, a leaf documentation editor dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

TASK: add the compaction-recall census to the scripts README: one sentence, the structure block and the file inventory.
FILE = .skilled/skills/system-spec-kit/runtime/scripts/README.md (the only file you may edit). Read it first.

Edit 1, line 19. Replace exactly this text:
`runtime/scripts/` holds the scripts that `package.json` invokes plus one maintenance tool.
with:
`runtime/scripts/` holds the scripts that `package.json` invokes plus one census an operator runs by hand.
(Only that sentence changes; the rest of line 19 stays byte-identical.)

Edit 2, the structure block. After the line `scripts/` (line 31) insert these two lines, byte for byte:
+-- compaction-recall/
|   `-- score-compaction-recall.mjs  # Zero-call census of what host compactions keep

Edit 3, the File Inventory table. Directly after the separator row `|---|---|---|` insert this one row, byte for byte:
| `compaction-recall/score-compaction-recall.mjs` | Operator-run census of host compactions | Reads only the transcripts named with `--transcripts` and makes no model call. It prints counts, scores and one `stop:` line and writes one JSON report to an `--out` path outside every named transcript directory. |

VERIFY (repo root), report each result and exit code:
grep -c 'compaction-recall' .skilled/skills/system-spec-kit/runtime/scripts/README.md   (expect 3)
python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/system-spec-kit/runtime/scripts/README.md   (expect VALID, exit 0)
Accept when: 1 file changed (+3/-1) and nothing else; the grep prints 3; validate_document exits 0.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness
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
