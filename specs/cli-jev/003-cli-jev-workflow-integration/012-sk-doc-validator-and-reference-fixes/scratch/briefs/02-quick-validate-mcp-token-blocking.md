GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/012-sk-doc-validator-and-reference-fixes

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/code.md; focused summary for a one-change brief) ===
You are @code, a leaf implementer dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. Read each file before editing it and re-read the edited region after.
Standards: read .skilled/skills/sk-code/SKILL.md and follow the route it resolves for this file type.
Comment hygiene is a hard block: no spec paths, packet or phase numbers, or REQ/task ids in code comments. Keep the durable why.
Verification: run only the checks this brief lists. Fail closed: no retry loop, no workaround. Report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: code) ===

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/012-sk-doc-validator-and-reference-fixes
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

STEP 1: quick_validate.py blocks a non-qualified MCP tool token in a skill, as it already does in a command
Scope: 2 files, the validator and its test file. Anchor: quick_validate.py:247-251 holds the token loop.
File A: .skilled/skills/sk-doc/shared/scripts/quick_validate.py
  a. Lines 247-251 now read as follows (lines 250 and 251 shortened here with ...):
            for token in iter_allowed_tools(tools_value):
                if is_non_fq_mcp_token(token):
                    if kind == 'command':
                        return False, f"allowed-tools entry '{token}' is a non-fully-qualified MCP tool token ... use mcp__<server>__<tool>", warnings
                    warnings.append(f"allowed-tools entry '{token}' ... prefer mcp__<server>__<tool>")
     Delete line 249 (`if kind == 'command':`) and line 251 (the whole `warnings.append(` line). Remove 4 leading spaces from
     line 250 so the `return False, ...` sits directly under `if is_non_fq_mcp_token(token):`. Keep line 250's text otherwise
     byte-identical, including its dash character. The comment at 237-240 already states the rule and stays.
  b. Docstring: after line 17 `- allowed-tools (if present): array format [Tool1, Tool2]` insert this line:
     - allowed-tools MCP tokens: fully qualified mcp__<server>__<tool>, for skills and commands alike
File B: .skilled/skills/sk-doc/scripts/tests/test_quick_validate_086.py
  a. After write_fixture (ends line 70) add `def write_tools_fixture(parent: Path, name: str, tools: str) -> Path:`.
     It writes parent/name/SKILL.md from SKILL_TEMPLATE with the line `allowed-tools: [Read, Write]` replaced by
     `allowed-tools: {tools}` and description "Skill fixture for the MCP tool token rule.", and returns the skill dir.
  b. In run_tests, after Case 5 (ends line 203) and before the final print at 205, open a new
     tempfile.TemporaryDirectory(prefix="quick-validate-mcp-") and add two cases in the file's existing style
     (a print("Case N: ...") line, then the assert_eq / assert_contains_substring / assert_no_substring helpers, failed += 1 on miss):
     Case 6 input: write_tools_fixture(tmp, "mcp-server-only", "[Read, mcp__code_mode]"), then validate_skill(dir).
            expected: valid is False, and msg contains "mcp__<server>__<tool>".
     Case 7 input: write_tools_fixture(tmp, "mcp-wildcard", "[Read, mcp__code_mode__*]"), then validate_skill(dir).
            expected: valid is True, and no warning contains "MCP tool token".
  c. Docstring: after line 16 `boundaries without touching the file system.` add this line:
     Plus two MCP-token cases: a skill granting server-only mcp__code_mode is invalid, one granting mcp__code_mode__* is valid.
Accept when: 2 files changed. quick_validate.py: -2 lines in the token loop, one line re-indented, +1 docstring line.
The test file: one helper, Cases 6 and 7, one docstring line, nothing else.

VERIFY (paste each command with its result line and exit code; do not run the test file, the orchestrator runs it)
  python3 -c 'import ast,sys; ast.parse(open(sys.argv[1]).read())' .skilled/skills/sk-doc/shared/scripts/quick_validate.py      # exit 0
  python3 -c 'import ast,sys; ast.parse(open(sys.argv[1]).read())' .skilled/skills/sk-doc/scripts/tests/test_quick_validate_086.py  # exit 0
  grep -c "prefer mcp__" .skilled/skills/sk-doc/shared/scripts/quick_validate.py      # 0 (exit 1 is expected for a zero count)
  grep -c "if kind == 'command':" .skilled/skills/sk-doc/shared/scripts/quick_validate.py      # 1 (the angle-bracket branch at 216)
  grep -c "mcp__code_mode" .skilled/skills/sk-doc/scripts/tests/test_quick_validate_086.py      # 3

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
