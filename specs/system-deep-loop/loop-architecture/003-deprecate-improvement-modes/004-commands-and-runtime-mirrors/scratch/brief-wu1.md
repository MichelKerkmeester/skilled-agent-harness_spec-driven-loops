GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/039-deprecate-improvement-modes/004-commands-and-runtime-mirrors
It lives in the main checkout; you do not write to it. You write only in the current directory, which is a git worktree.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

ROLE: You delete two retired deep-loop commands and one retired agent, with every runtime copy, and remove their index entries. Nothing else.

STEP 1. Delete these files with `git rm` (some are symlinks; `git rm` handles them):
  .skilled/commands/deep/agent-improvement.md
  .skilled/commands/deep/model-benchmark.md
  .skilled/commands/deep/assets/deep-agent-improvement-auto.yaml
  .skilled/commands/deep/assets/deep-agent-improvement-confirm.yaml
  .skilled/commands/deep/assets/deep-agent-improvement-presentation.txt
  .skilled/commands/deep/assets/deep-model-benchmark-auto.yaml
  .skilled/commands/deep/assets/deep-model-benchmark-confirm.yaml
  .skilled/commands/deep/assets/deep-model-benchmark-presentation.txt
  .skilled/agents/deep-improvement.md
  .claude/agents/deep-improvement.md
  .codex/agents/deep-improvement.toml
  .pi/agents/deep-improvement.md
  .codex/prompts/deep-agent-improvement.md
  .codex/prompts/deep-model-benchmark.md
  .pi/prompts/deep-agent-improvement.md
  .pi/prompts/deep-model-benchmark.md
  .hermes/prompts/deep-agent-improvement.md
  .hermes/prompts/deep-model-benchmark.md
  .hermes/skills/agent-deep-improvement/SKILL.md
  .hermes/skills/deep-improvement/SKILL.md
  .claude/commands/deep/agent-improvement.md
  .claude/commands/deep/model-benchmark.md
  .cursor/agents/deep-improvement.md
  .cursor/commands/deep-agent-improvement.md
  .cursor/commands/deep-model-benchmark.md
  .devin/agents/deep-improvement/AGENT.md

STEP 2. Edit these files. Delete or replace only the named text.
  a) .skilled/agents/README.txt line 23 and .claude/agents/README.txt line 27: delete the line that starts `  deep-improvement: proposal-only mutator`.
  b) .skilled/commands/README.txt: delete line 98 (`│   ├── agent-improvement.md ...`), line 100 (`│   ├── model-benchmark.md ...`), line 180 (`| Agent Improvement | ...`), line 181 (`| Model Benchmark | ...`), line 245 (`/deep:agent-improvement .skilled/agents/review.md :confirm`) and line 346 (`| [Deep Agent Improvement Command](deep/agent-improvement.md) | ... |`). Read the lines first; delete by content, not by number, because numbers shift as you delete.
  c) .skilled/commands/deep/assets/compiled/README.md line 23: delete the last sentence, `The rollout entries for \`deep/agent-improvement\` and \`deep/model-benchmark\` are fallback-only and are not compiler-managed asset pairs.`
  d) .skilled/commands/deep/assets/legacy/README.md line 23: delete the last sentence, `The remaining rollout entries, \`deep/agent-improvement\` and \`deep/model-benchmark\`, are intentionally fallback-only command files outside this asset inventory and have not been compiled.`
  e) .skilled/commands/create/assets/create-benchmark-presentation.txt lines 86-90: delete the options `C) model_benchmark` and `D) agent_improvement`, and change `Only A is command-bound. Selecting B-D stops` to `Only A is command-bound. Selecting B stops`.
  f) .skilled/commands/create/assets/create-skill-parent-auto.yaml and create-skill-parent-confirm.yaml: in each file remove the three parenthetical examples that name deep-improvement, leaving the rule text:
       ` (canonical: 4 improvement modes -> deep-improvement)` -> `` (two places per file)
       ` (canonical: 4 modes -> deep-improvement).` -> `.` (one place per file)
  g) .skilled/hooks/task-dispatch/lib/dispatch-guard.cjs line 74: `new Set(['deep-research', 'deep-review', 'deep-improvement'])` -> `new Set(['deep-research', 'deep-review'])`.
  h) .skilled/hooks/task-dispatch/README.md line 32: `For the three command-owned loop executors (\`deep-research\`, \`deep-review\`, \`deep-improvement\`)` -> `For the two command-owned loop executors (\`deep-research\`, \`deep-review\`)`.
  i) .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs line 37: delete the line `  'deep-improvement': { sandboxMode: 'workspace-write', ...DEFAULT_SETTINGS },`.

DON'T
- Do not edit, move or delete any other file. Leave `.skilled/agents/README.txt` line 11 and `.claude/agents/README.txt` line 11 as you find them.
- BANNED OPERATIONS: git commit, git push, git checkout, git reset, git stash, git rebase, git branch, rm -rf, npm install, editing anything under specs/.
- ALLOWED WRITE PATHS: the files in STEP 1 and STEP 2 only.
- Do not run any sync or generator script.

VERIFY (run these; report each exit status)
  ls .skilled/commands/deep .skilled/agents
  node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check
  node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check
  node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check
  node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check
  node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check
  git ls-files -s | awk '$1=="120000"{print $4}' | while read -r l; do [ -e "$l" ] || echo "BROKEN $l"; done

HANDBACK: list every file you deleted or changed, then each VERIFY command with its exit status and the last lines of any failure.
