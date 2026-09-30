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

TASK: add rule 5 (a check that needs another document), the line classes and one per-line entry point to the goal-criteria lint, and pin them with four tests.
G = .skilled/skills/sk-doc/sk-create-goal/scripts. Edit only G/lint-goal-criteria.cjs and G/tests/lint-goal-criteria.test.cjs. Read both first; reuse maskNamedText, bareWord, isNamedToken and FUNCTION_WORDS already in the file.

EDIT 1, G/lint-goal-criteria.cjs section 2 CONSTANTS, append after FUNCTION_WORDS, with this comment above them:
// Wording whose check needs another document's content. The second list
// counts only when the line names no artifact of its own.
const RULE5_PATTERNS = [
  /\bas (?:described|defined|listed|specified|documented|stated|shown|required) (?:in|by|under)\b/giu,
  /\b(?:see|refer to|per) (?:the )?(?:spec|plan|tasks|checklist|section|table|appendix|research|synthesis|decision record|requirements?)\b/giu,
  /\b(?:REQ|SC|CHK|NFR|AC)-\d+\b/gu,
  /\bevery (?:kept|listed|named|required|relevant|affected|applicable)\b/giu,
  /\bwhere (?:they|these|those)\b/giu
];
const RULE5_UNNAMED_PATTERNS = [
  /\b(?:is|are) listed\b/giu,
  /\bthe (?:rows|items|entries|cases|steps) (?:in|of|from|under)\b/giu
];

EDIT 2, section 3 HELPERS, after isNamedToken: `hasNamedArtifact(line)` returns maskNamedText(line).split(/\s+/u).filter(Boolean).some(isNamedToken).

EDIT 3, section 4 CORE LOGIC, after rule4DanglingRefs, three functions, each with a JSDoc block:
- `rule5ExternalFile(line)`: text = String(line); spans = []. For each pattern in RULE5_PATTERNS in order, push match[0] for every match of text.matchAll(pattern). Then, only when hasNamedArtifact(text) is false, do the same for RULE5_UNNAMED_PATTERNS. Return spans.
- `classifyCriterion(text)`: trimmed = String(text).trim(). Return 'placeholder' when /^\[[^\]]*\]$/u matches trimmed. Return 'lexical_unscored' when no word of maskNamedText(trimmed).split(/\s+/u), mapped through bareWord and toLowerCase, is in FUNCTION_WORDS. Otherwise return 'scored'.
- `lintCriterion(text)`: cls = classifyCriterion(text); return { class: cls, rule4: cls === 'scored' ? rule4DanglingRefs(text) : [], rule5: cls === 'scored' ? rule5ExternalFile(text) : [] }.
Add rule5ExternalFile, classifyCriterion and lintCriterion to the exports.

EDIT 4, G/tests/lint-goal-criteria.test.cjs: import the three new functions too and append four tests:
  1. 'rule 5 fails a check that needs another document': rule5ExternalFile('Every check passes as described in the plan.') deepEquals ['as described in']; rule5ExternalFile('Every REQ-001 row holds') deepEquals ['REQ-001']; rule5ExternalFile('The rows in the report are listed') deepEquals ['are listed', 'The rows in'].
  2. 'rule 5 passes a check on named commands and counts': '`npm test` exits 0 with 12 passing cases.' and 'the rows in `labels.jsonl` are listed' each give [].
  3. 'a line can fail both rules': lintCriterion('The report covers every listed file as described in the spec.') deepEquals { class: 'scored', rule4: ['The report', 'every listed', 'the spec'], rule5: ['as described in', 'every listed'] }.
  4. 'placeholder and unscored lines stay out of both rules': classifyCriterion('[Another]') is 'placeholder'; classifyCriterion('Repo trusted; verdict recorded') is 'lexical_unscored'; lintCriterion('[Another]') deepEquals { class: 'placeholder', rule4: [], rule5: [] }.

VERIFY (repo root):
  node --check .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs
  node -e "const m=require('./.skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs');console.log(JSON.stringify(m.lintCriterion('Rows match per the spec where they apply')))"
Accept when: 2 files changed and nothing else; node --check exits 0; the node -e line prints {"class":"scored","rule4":["the spec"],"rule5":["per the spec","where they"]}.

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
