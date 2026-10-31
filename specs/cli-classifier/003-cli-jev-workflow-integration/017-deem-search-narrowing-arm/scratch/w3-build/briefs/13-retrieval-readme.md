GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are @markdown, a leaf documentation editor dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

TASK: add the track-narrowing script to the retrieval package README: one tree line, one key-files row, the probe-reader note and the script count. Four literal edits in one file.
F = .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md. Read F first. Change nothing else in it.

1. F:56. Old line:
All five scripts here import shared primitives from lib/ (see lib/README.md).
New line:
All six scripts here import shared primitives from lib/ (see lib/README.md).

2. After F:68 (the line starting `+-- rg-wrapper.mjs`) insert this one line, keeping the `#` in the same column as the lines around it:
+-- score-track-narrowing.mjs     # Offline check: does a model's pick of the spec track beat ripgrep and the lookup

3. F:78. Replace only the first sentence. Old first sentence:
Five fixtures were captured once, when the lexical lanes were accepted, and have no runtime reader: `latency-report.json`, `semantic-probes.json`, `prompt-set.json`, `recipe-execution.json` and `daemon-off-proof.json`.
New first two sentences:
Five fixtures were captured once, when the lexical lanes were accepted: `latency-report.json`, `semantic-probes.json`, `prompt-set.json`, `recipe-execution.json` and `daemon-off-proof.json`. None has a runtime reader except `semantic-probes.json`, whose Latin paraphrase and exact queries `score-track-narrowing.mjs` reads for a report-only probe line, taking each probe's gold from the current index rather than from the captured paths.
The rest of line 78 stays as it is.

4. After F:95 (the row starting "| `rg-wrapper.mjs` |") insert this row:
| `score-track-narrowing.mjs` | Measures offline whether one classifier choice that picks the spec track beats ripgrep and the trigger-index lookup at naming the right track. The default run makes no model call and writes no file: it prints the test-set counts, both baselines on the same rows, the fixed keep rule and whether a 10-point gain still fits. `--deem` and `--jev` each call their backend only behind that backend's own availability check and need `--out <dir>` for `calls.jsonl` and `report.json`. It changes no lookup, index or recipe. |

VERIFY (repo root):
  grep -c "score-track-narrowing" .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md   (expect 3)
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md   (expect exit 0)
Accept when: 1 file changed and nothing else; the grep prints 3; the validator exits 0.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm
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
