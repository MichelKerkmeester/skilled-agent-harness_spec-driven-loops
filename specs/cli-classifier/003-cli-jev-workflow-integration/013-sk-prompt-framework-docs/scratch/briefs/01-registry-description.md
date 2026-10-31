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

You are a mechanical editor in one repository. Do exactly the step below, nothing more.

STEP 1: rewrite the opening of the registry's top-level `description` string
Scope: 1 file, `.skilled/skills/sk-prompt/assets/framework-registry.json`. Anchor: line 3.
Replace this literal old text (it occurs once, at the start of the line 3 value):
  "description": "Machine-readable registry of prompt-engineering frameworks. Each entry
with this literal new text:
  "description": "Code-task benchmark scaffolds for five of the sk-prompt skill's seven frameworks: RCAF, RACE, CIDI, TIDD-EC and COSTAR. CRISPE and CRAFT have no scaffold, because they fit strategy and planning work rather than a code task. references/patterns-evaluation.md defines all seven and is the source of the framework set. Each entry
Everything after "Each entry" on line 3 stays byte-identical. Lines 1, 2 and 4 onward stay byte-identical.
Accept when: 1 file changed, exactly 1 line changed (line 3), the file still parses as JSON.

VERIFY (paste each command with its result line)
  node -p '((r)=>r.frameworks.map(f=>f.id).join(",")+" "+/CRISPE/.test(r.description)+" "+/CRAFT/.test(r.description))(require("./.skilled/skills/sk-prompt/assets/framework-registry.json"))'
    # expect: rcaf,race,cidi,tidd-ec,costar true true
  grep -c 'Machine-readable registry' .skilled/skills/sk-prompt/assets/framework-registry.json   # expect 0

```text
HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
```
