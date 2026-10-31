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

STEP 1: create 1 new file, `.skilled/skills/sk-prompt/changelog/v3.0.2.0.md`. It must not exist yet: if it does, stop BLOCKED.
Write exactly the text between the BEGIN and END markers (markers excluded), ending with one newline:
----- BEGIN -----
---
title: "sk-prompt v3.0.2.0"
description: "The framework registry now says it covers five of the seven frameworks, and a run reads only the parts of the framework reference it needs."
trigger_phrases:
  - "sk-prompt v3.0.2.0"
  - "sk-prompt 3.0.2.0"
  - "framework reference read by section"
importance_tier: "normal"
contextType: "general"
---
The framework registry now says what it holds, and a run reads about a quarter of the framework reference instead of all of it. Both changes are documentation: no framework was added or removed, and the reference file itself is unchanged.

> Spec folder: `specs/cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs` (Level 2)

## What's New at a Glance

- **The registry states its scope.** `assets/framework-registry.json` holds code-task benchmark scaffolds for five of the skill's seven frameworks. Its description now says so, names CRISPE and CRAFT as the two without a scaffold and points to `references/patterns-evaluation.md` for the full set.
- **A run reads the framework reference by section.** `SKILL.md` now tells a run, and `@prompt-improver`, to read three sections of `patterns-evaluation.md`: selection, the chosen framework's deep dive and CLEAR scoring. That is at most 9,686 of the file's 36,580 bytes. A request for a deep dive, a full template or all frameworks still reads the whole file.

## Upgrade

No migration required.
----- END -----
Accept when: 1 file created, no other file changed.

VERIFY (paste each command with its result line)
  grep -c 'sk-prompt v3.0.2.0' .skilled/skills/sk-prompt/changelog/v3.0.2.0.md   # expect 1
  grep -c '^## ' .skilled/skills/sk-prompt/changelog/v3.0.2.0.md          # expect 2

```text
HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
```
