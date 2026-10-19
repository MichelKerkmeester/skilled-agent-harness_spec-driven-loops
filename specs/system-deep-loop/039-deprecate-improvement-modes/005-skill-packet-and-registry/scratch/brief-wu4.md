GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/039-deprecate-improvement-modes/005-skill-packet-and-registry
It lives in the main checkout; you do not write to it. You write only in the current directory, which is a git worktree.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

ROLE: You remove two retired modes from the deep-loop hub's own docs. Nothing else.

Removed: the modes `agent-improvement` and `model-benchmark`, their packet `deep-improvement/`, the agent `deep-improvement`, the commands `/deep:agent-improvement` and `/deep:model-benchmark`, and the backend kind `improvement-host` (loop host `loop-host.cjs`). Remaining: three modes, `research`, `review` and `ai-council`, all on backend `runtime-loop-type`, in packets `deep-research/`, `deep-review/`, `deep-ai-council/`. The registry, router and packet edits are already done in this tree.

EDIT RULES
- A row, bullet, table line, keyword entry or JSON item that exists only for a removed item: delete it.
- A list that names a removed item among others: drop that item and fix the commas and "and".
- A count that included them: correct it (five modes -> three; four workflow families -> three; four packets -> three; "the two improvement lanes" or "the three improvement modes" -> remove the clause).
- A sentence that only explains the shared improvement packet, the improvement host or `runtimeLoopType: null`: delete it.
- Keep everything else word for word. Do not add new sections, do not explain the removal, do not add "removed" notes.

FILES AND LINES (read each file first; the lines are where the mentions are today)
  .skilled/skills/system-deep-loop/SKILL.md: lines 4,8,29,49,60,62,67,70,82,84,89,104,122,141,163,166
  .skilled/skills/system-deep-loop/README.md: lines 61,62,63,82,87,114
  .skilled/skills/system-deep-loop/ARCHITECTURE.md: lines 25,71,115,123
  .skilled/skills/system-deep-loop/ROUTER.md: lines 23,44,45,46,47,49,75,76,95,96,97,98,100,101,102,114
  .skilled/skills/system-deep-loop/deep-ai-council/README.md: lines 134
  .skilled/skills/system-deep-loop/deep-research/README.md: lines 118
  .skilled/skills/system-deep-loop/deep-review/README.md: lines 43,176
  .skilled/skills/system-deep-loop/shared/behavior-benchmark/README.md: lines 12
  .skilled/skills/system-deep-loop/shared/behavior-benchmark/framework.md: lines 22,36,334
  .skilled/skills/system-deep-loop/shared/progress/README.md: lines 12
  .skilled/skills/.state/loop-guard/README.md: lines 48,60,62

SPECIAL CASES
- ROUTER.md: delete the `AGENT_IMPROVEMENT` and `MODEL_BENCHMARK` intent entries (~lines 75-76) and the two `RESOURCE_MAP` entries that list `deep-improvement/...` leaves (~lines 94-103); fix the JSON commas inside those code blocks. Delete the prose bullets about the improvement leaves (~lines 44-50) and the shared-packet note (~line 114).
- shared/behavior-benchmark/framework.md: delete the `/deep:model-benchmark` table row (~line 36) and the `IMB` prefix row (~line 334).
- .skilled/skills/system-deep-loop/benchmark/README.md: do NOT edit. It is a frozen archive and already describes the harness as retired.

DON'T
- BANNED OPERATIONS: git commit, git push, git checkout, git reset, git stash, git rebase, git branch, rm -rf, npm install, editing anything under specs/.
- ALLOWED WRITE PATHS: the files listed above only.

VERIFY (run these; report each exit status)
  rg -n -i "agent-improvement|model-benchmark|deep-improvement|improvement-host|loop-host" .skilled/skills/system-deep-loop/SKILL.md .skilled/skills/system-deep-loop/README.md .skilled/skills/system-deep-loop/ARCHITECTURE.md .skilled/skills/system-deep-loop/ROUTER.md .skilled/skills/system-deep-loop/deep-*/README.md .skilled/skills/system-deep-loop/shared .skilled/skills/.state/loop-guard/README.md
  node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_router_sync.cjs 2>&1 | tail -8

HANDBACK: list every file you changed, then each VERIFY command with its exit status and output. The rg should print nothing.
