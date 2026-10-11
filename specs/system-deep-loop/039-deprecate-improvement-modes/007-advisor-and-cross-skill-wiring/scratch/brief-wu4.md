GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/039-deprecate-improvement-modes/007-advisor-and-cross-skill-wiring
It lives in the main checkout; you do not write to it. You write only in the current directory, which is a git worktree.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.


ROLE: You remove two retired deep-loop modes and their agent from CLI-skill and sk-code docs and scripts. Nothing else.

Removed from this repository: the deep-loop modes `agent-improvement` and `model-benchmark`, the retired `skill-benchmark` lane, their packet `.skilled/skills/system-deep-loop/deep-improvement/`, the agent `deep-improvement`, the commands `/deep:agent-improvement` and `/deep:model-benchmark`, and the backend kind `improvement-host`. The deep-loop hub now has three modes: `research`, `review`, `ai-council`. Those deletions are already done in this tree.
NOT REMOVED: `skill-benchmark-report.json` and `skill-benchmark-report.md` are the standard report files of every manual-testing-playbook run, in every skill. Never delete or edit a line only because it names those files.

EDIT RULES
- A row, bullet, table line, keyword, map entry, alias, case or fixture line that exists only for a removed item: delete it.
- A list that names a removed item among others: drop that item and fix the punctuation.
- A count that included them: correct it.
- A test that checks a general behaviour and merely uses a removed name as its example: keep the test and switch the example to a remaining mode or agent (`deep-research`, `deep-review`, `ai-council`). Never weaken an assertion to make a test pass.
- Keep everything else word for word. No "removed" notes, no tombstone comments.

FILES (lines are where the mentions are today)
  .skilled/skills/cli-classifier/README.md: 72,73
  .skilled/skills/cli-classifier/feature-catalog/feature-catalog.md: 63
  .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md: 95,96,97,115,116
  .skilled/skills/cli-external-orchestration/cli-claude-code/README.md: 57
  .skilled/skills/cli-external-orchestration/cli-claude-code/references/agent-delegation.md: 102,132
  .skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md: 247
  .skilled/skills/cli-external-orchestration/cli-codex/README.md: 138
  .skilled/skills/cli-external-orchestration/cli-cursor/SKILL.md: 255
  .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/agents-skills-rules/agent-roster-enumeration.md: 27
  .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md: 294
  .skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/subagents/roster-enumeration.md: 35
  .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md: 30,197
  .skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md: 188
  .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/orchestrate-agent-multi-agent.md: 31,50
  .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md: 360
  .skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md: 80,134,231
  .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md: 294
  .skilled/skills/sk-code/sk-code-opencode/SKILL.md: 175
  .skilled/skills/sk-code/sk-code-opencode/references/shared/alignment-verification-automation.md: 73
  .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh: 58
  .skilled/skills/sk-code/sk-code-quality/SKILL.md: 150

SPECIAL CASES
- Agent rosters and counts (cursor, devin, opencode, claude-code docs and playbooks): drop `deep-improvement` and lower any stated agent count by one.
- cli-classifier measurement doc pi-transport-integration.md: if it records a past measurement run that used a removed mode, it is history; keep the measurement and only drop present-tense instructions that send the reader to a removed mode or command.
- sk-code-opencode/scripts/run-all-drift-guards.sh: if it runs a guard that lived in the deleted packet, delete that call; if it calls the agent mirror checker by its old path, point it at `.skilled/bin/check-agent-mirror-sync.cjs`.

DON'T
- BANNED OPERATIONS: git commit, git push, git checkout, git reset, git stash, git rebase, git branch, rm -rf, npm install, editing anything under specs/.
- Do not put spec paths, phase numbers or ticket ids in code comments.
- Do not run any generator or sync script unless this brief names it.
- ALLOWED WRITE PATHS: the files listed above only.

VERIFY (report each exit status)
  bash -n .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh
  rg -n -i "agent-improvement|model-benchmark|deep-improvement" .skilled/skills/cli-classifier .skilled/skills/cli-external-orchestration .skilled/skills/sk-code --glob '!**/changelog/**' --glob '!**/benchmark/reports/**'

HANDBACK: list every file you changed, then each VERIFY result. Name any remaining rg hit you left on purpose and why.
