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

STEP 1: validate_document.py warns when auto-detection falls back to README rules (2 files; anchor: validate_document.py:266-267)
File A: .skilled/skills/sk-doc/shared/scripts/validate_document.py
  a. Line 221 `def detect_document_type(...) -> str:` becomes `def _detect_document_type_with_source(file_path: str, content: str, rules: Dict[str, Any]) -> Tuple[str, str]:`
     and its docstring at 222 becomes `"""Detect document type and whether a path rule ('rule') or the README default ('default') decided it."""`
  b. In that body, each `return '<type>'` at lines 234, 242, 244, 248, 252, 254, 256, 258, 260, 262, 264 becomes
     `return '<type>', 'rule'`. Line 267 `return 'readme'` becomes `return 'readme', 'default'`. The comment at 266 stays.
  c. Directly after that function, before `def has_emoji` (line 270), add this wrapper so its current callers see no change:
     def detect_document_type(file_path: str, content: str, rules: Dict[str, Any]) -> str:
         """Detect document type from file path or content."""
         return _detect_document_type_with_source(file_path, content, rules)[0]
  d. In validate_document(), lines 1630-1631, old text:
         if doc_type is None:
             doc_type = detect_document_type(file_path, content, rules)
     new text (the `elif doc_type == 'code-folder':` branch under it stays):
         type_source = 'explicit'
         if doc_type is None:
             doc_type, type_source = _detect_document_type_with_source(file_path, content, rules)
  e. After line 1659 `all_errors.extend(validate_code_folder(content, file_path))`, before the `blocking_errors =` line, insert:
         # README rules applied by default look like a README verdict, so say it was a fallback.
         if type_source == 'default':
             all_errors.append({
                 'type': 'document_type_fallback',
                 'severity': 'warning',
                 'message': f'No document type rule matched {file_path}, so README rules were applied. Pass --type to choose the rule set.',
                 'fix_hint': 'Pass --type <type> to validate against the intended rule set',
                 'auto_fixable': False,
             })
     Severity is warning, so `valid` and `exit_code` stay computed from blocking errors only. Change nothing else.
File B: .skilled/skills/sk-doc/scripts/tests/test_structure_validation.py. Append two pytest functions after line 157.
  Both write "# Notes\n\nPlain notes that no document type rule claims.\n" into tmp_path, then call validate_document(str(path), doc_type=<given>, rules=load_rules(), skip_exclusions=True).
  1. test_untyped_document_reports_readme_fallback: file notes.md, doc_type=None. Expect document_type "readme", exactly one
     warnings entry whose type is "document_type_fallback", "--type" in its fix_hint, and (valid, exit_code) equal to the same
     file validated with doc_type="readme".
  2. test_typed_or_named_readme_gets_no_fallback: notes.md with doc_type="readme", and README.md (same body) with doc_type=None.
     Expect document_type "readme" for both and no "document_type_fallback" entry in either warnings list.
Accept when: 2 files changed. validate_document.py: helper, wrapper, 3-line detection swap, one warning block. Test file: 2 new functions only.

VERIFY (paste each command with its result line and exit code; do not run pytest, the orchestrator runs it)
  python3 -c 'import ast,sys; [ast.parse(open(p).read()) for p in sys.argv[1:]]' .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/scripts/tests/test_structure_validation.py   # exit 0
  grep -c "document_type_fallback" .skilled/skills/sk-doc/shared/scripts/validate_document.py      # 1
  grep -c "_detect_document_type_with_source" .skilled/skills/sk-doc/shared/scripts/validate_document.py   # 3
  grep -c "^def test_" .skilled/skills/sk-doc/scripts/tests/test_structure_validation.py      # 6

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
