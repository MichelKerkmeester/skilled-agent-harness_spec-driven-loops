GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint

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

TASK: add rule 4 (dangling referring expressions) to the goal-criteria lint and pin it with two tests.
G = .skilled/skills/sk-doc/sk-create-goal/scripts. Edit only G/lint-goal-criteria.cjs and G/tests/lint-goal-criteria.test.cjs. Read both first.

EDIT 0, G/lint-goal-criteria.cjs:2, the box line overruns by two columns. Replace the whole line with exactly:
// ║ lint-goal-criteria - advisory lint for goal criteria rules 4 and 5      ║

EDIT 1, G/lint-goal-criteria.cjs section 2 CONSTANTS, append after SCRATCH_DIR, each Set with a one-line why comment above it:
- `NAMED_TOKEN = 'QREF'`
- `DETERMINERS = new Set(['the', 'this', 'these', 'those', 'its', 'their', 'every', 'each'])`
- `LOCALITY_NOUNS = new Set(['repo', 'repository', 'packet', 'phase', 'goal', 'child', 'line', 'command', 'operator', 'test'])` (why: these name the packet or the run itself, so they resolve without another file)
- `MODIFIERS = new Set(['same', 'own', 'new', 'old', 'final', 'first', 'last', 'next', 'other', 'whole', 'full', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'])`
- `FUNCTION_WORDS = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'nor', 'of', 'to', 'in', 'on', 'at', 'by', 'for', 'with', 'from', 'into', 'is', 'are', 'was', 'were', 'be', 'been', 'has', 'have', 'had', 'do', 'does', 'no', 'not', 'none', 'each', 'every', 'all', 'any', 'both', 'only', 'per', 'its', 'their', 'this', 'that', 'these', 'those', 'when', 'if', 'then', 'than', 'as', 'after', 'before', 'while', 'which', 'where', 'it', 'they', 'exits', 'prints', 'passes', 'returns', 'reports', 'holds', 'matches', 'contains', 'exists', 'lists', 'shows', 'validates', 'resolve', 'resolves', 'runs', 'fails', 'writes', 'reads', 'present', 'zero', 'one'])` (why: English words common in criteria; a line with none of them is not scored)

EDIT 2, section 3 HELPERS, after getCriterionItems, three helpers:
- `maskNamedText(line)`: String(line) with every /`[^`]*`/gu span, then every /"[^"]*"/gu span, replaced by ' ' + NAMED_TOKEN + ' '.
- `bareWord(token)`: token with /^[("'[]+/u removed, then /[.,;:!?)"'\]]+$/u removed, then /['’]s$/u removed.
- `isNamedToken(token)`: w = bareWord(token); true when w === NAMED_TOKEN, w includes '/', /^[\w.-]+\.[a-z0-9]{1,6}$/iu matches w, or /^\d/u matches w.

EDIT 3, section 4 CORE LOGIC, `rule4DanglingRefs(line)` with a JSDoc block, returning an array of span strings:
  words = maskNamedText(line).split(/\s+/u).filter(Boolean); spans = [].
  If words[0] exists and bareWord(words[0]) is exactly 'It' or 'They' (case-sensitive), push that bare word.
  For each i where DETERMINERS has bareWord(words[i]).toLowerCase():
    start = i + 1; while start < words.length and MODIFIERS has bareWord(words[start]).toLowerCase(), start += 1.
    window = words.slice(start, start + 3); skip when window is empty.
    head = bareWord(window[0]).toLowerCase(); skip when head is '' or FUNCTION_WORDS has head.
    skip when window.some(isNamedToken).
    skip when LOCALITY_NOUNS has head, or head ends with 's' and LOCALITY_NOUNS has head without its last character.
    skip when window[0] ends with ':' or '='.
    otherwise push words.slice(i, start + 1).map(bareWord).join(' ').
  Add rule4DanglingRefs to the exports.

EDIT 4, G/tests/lint-goal-criteria.test.cjs: import rule4DanglingRefs too and add two tests after the existing ones:
  1. 'rule 4 fails a dangling definite description': rule4DanglingRefs('The report includes the result.') deepEquals ['The report', 'the result']; rule4DanglingRefs('It passes.') deepEquals ['It']; rule4DanglingRefs('each of the four goals lists the same three rows') deepEquals ['the same three rows'].
  2. 'rule 4 passes a line whose references resolve locally': each of '`node lint.cjs --all` exits 0 in the packet and prints the `rows=` line.', "This phase's report names docs/a.md" and 'Every test in the repo passes' gives [].

VERIFY (repo root):
  node --check .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs
  node -e "const m=require('./.skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs');console.log(JSON.stringify(m.rule4DanglingRefs('The report includes the result.')))"
Accept when: 2 files changed and nothing else; node --check exits 0; the node -e line prints ["The report","the result"].

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint
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
