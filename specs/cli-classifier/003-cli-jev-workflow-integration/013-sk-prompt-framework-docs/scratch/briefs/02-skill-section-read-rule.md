```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.
```

```text
=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are @markdown, a leaf documentation editor dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===
```

```text
RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs
- Other workers edit other files in this tree at the same time. Touch only the files this brief names.
- The orchestrator runs the test suites, spec validation and every git commit after you return.
- Your sandbox may block test runners that open local sockets (tsx, vitest). Run only the checks listed here; the orchestrator runs the rest.
```

```text
DON'T
- Edit, create or delete any file this brief does not name.
- Run a git command that writes (add, commit, stash, checkout, restore, reset, merge, rebase, push).
- Install anything (npm/pnpm/pip/brew install, npm ci) or touch node_modules.
- Open any .env file, print environment variables, or write a key or token into any file.
- Call jev, the local Deem server (127.0.0.1:8300) or any network service.
- Put spec paths, packet or phase numbers, or REQ/task ids in code comments.
- Reformat, reorder or "improve" anything outside the named edit.
- Ask a question. If a step cannot be done exactly as written, stop and report BLOCKED with the reason.
```

You are a mechanical editor in one repository. Do exactly the steps below, nothing more.

STEP 1: insert the rule below the Resource Loading Levels table
Scope: 1 file, `.skilled/skills/sk-prompt/SKILL.md`. Anchor: line 98 is the table's last row (`| ON_DEMAND   | Only on explicit request | ...`), line 99 is blank, line 100 is `### Smart Router Pseudocode`.
Insert these 8 lines, flush left, directly before line 100 (the last inserted line is blank):
```text
A run that loads `references/patterns-evaluation.md` reads three of its sections, not the whole file:

1. `## 2. FRAMEWORK LIBRARY & SELECTION`, to score at least three frameworks and choose one.
2. The chosen framework's `###` subsection under `## 3. FRAMEWORK DEEP DIVES`. A switch to another framework reads its subsection too. A name that matches no subsection reads all of section 3.
3. `## 10. CLEAR EVALUATION MASTERY`, to score the result.

A request that carries an on-demand keyword (the `ON_DEMAND_KEYWORDS` list below) reads the whole file.

```

STEP 2: amend the patterns-evaluation bullet in Deterministic Agent Rules
Same file. Anchor: line 461 before STEP 1 (line 469 after it). Literal old line:
```text
- Use `references/patterns-evaluation.md` as the framework-selection source of truth.
```
Literal new line (one line):
```text
- Use `references/patterns-evaluation.md` as the framework-selection source of truth. Read only `## 2. FRAMEWORK LIBRARY & SELECTION`, the chosen framework's subsection of `## 3. FRAMEWORK DEEP DIVES` and `## 10. CLEAR EVALUATION MASTERY`. A framework switch reads the new framework's subsection, and an on-demand keyword reads the whole file.
```
Accept when: 1 file changed, 9 lines added and 1 removed, nothing else in the file moved.

VERIFY (paste each command with its result line)
  grep -c 'FRAMEWORK DEEP DIVES' .skilled/skills/sk-prompt/SKILL.md       # expect 2
  grep -c 'CLEAR EVALUATION MASTERY' .skilled/skills/sk-prompt/SKILL.md   # expect 2
  grep -c '"all frameworks"' .skilled/skills/sk-prompt/SKILL.md           # expect 1
  sed -n '100p;108p' .skilled/skills/sk-prompt/SKILL.md                   # expect the rule's first line, then ### Smart Router Pseudocode
  wc -c < .skilled/skills/sk-prompt/SKILL.md                              # expect 23893

```text
HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
```
