GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are @markdown, a leaf documentation editor dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

TASK: create the skill's next changelog entry, a new file whose full text is given below.
F = .skilled/skills/sk-communication/changelog/v1.4.0.0.md (new; the only file you create). The folder holds `v1.0.0.0.md` to `v1.3.0.0.md`; do not touch them.
Write F with exactly the text between the two fence lines below: no fence lines, nothing added, nothing reworded, one trailing newline.
```markdown
---
title: "sk-communication v1.4.0.0, An Offline Check for Model Judges"
description: "Adds judge-agreement.mjs, which measures offline whether a Deem or Jev judge agrees with the operator's grades of masked replies more often than the mechanical scores."
trigger_phrases:
  - "sk-communication v1.4.0.0"
  - "sk-communication 1.4.0.0"
  - "offline check for model judges"
  - "label gate"
importance_tier: "normal"
contextType: "general"
version: 1.4.0.0
---
# 1.4.0.0, An Offline Check for Model Judges

The reply comparison can now test a model judge before anyone trusts one. A new script measures whether a Deem or Jev judge agrees with the operator's grades of masked replies more often than the mechanical scores, and it calls no model until the operator has graded 20 replies.

## Why This Release

The comparison scored replies on mechanical checks alone, and nobody had measured whether those checks agree with a human reader. A model judge could read the masked replies, but without human grades there was no way to tell a trustworthy judge from an unreliable one.

## What's New at a Glance

- **A census comes first.** `judge-agreement.mjs` joins every masked reply to its reply file by the SHA-256 of the reply text. It prints how many replies exist, how many are distinct and how often the mechanical scores agree with the operator's grades.
- **No model call happens below the label gate.** With fewer than 20 graded replies the run prints `stop: fewer than 20 labeled replies`. A baseline that already agrees on more than 90 percent of graded cells prints `no headroom`.
- **Each judge sits behind its own switch.** `--deem` asks the local Deem server after its health check, and `--jev` asks the hosted Jev service after its version and credential checks. A failed check skips that judge and never starts the other one.
- **The keep rule is fixed before any run.** Each judge column prints one verdict line: `keep`, `kill` or a `stop` with its reason. Coverage, an exact sign test over replies and a 10-point gain over the baseline decide it.
- **Reply text leaves the machine only on request.** `--jev` sends reply text to a hosted service, so a masked file that git does not track also needs `--accept-payload`. Deem keeps everything on this machine.
- **A verdict feeds nothing.** `compare.mjs` and the release gate never read it, and using a judge anywhere would need a change of its own.

## Upgrade

No migration required. Every existing script runs as before, and the new script writes nothing unless it is given `--out`.
```

Accept when: 1 file created (F), no other file changed, and both checks pass.
Checks you run, from the repo root:
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-communication/changelog/v1.4.0.0.md` (expect `VALID`, exit 0)
- `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/sk-communication/changelog/v1.4.0.0.md` (expect `hard blockers:          0`)

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge
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
