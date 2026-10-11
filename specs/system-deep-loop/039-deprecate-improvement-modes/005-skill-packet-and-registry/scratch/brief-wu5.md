GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/039-deprecate-improvement-modes/005-skill-packet-and-registry
It lives in the main checkout; you do not write to it. You write only in the current directory, which is a git worktree.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

ROLE: You remove two retired modes from the deep-loop hub feature catalog and manual-testing playbook. Nothing else.

Removed: the modes `agent-improvement` and `model-benchmark`, their packet `deep-improvement/`, the agent `deep-improvement`, the commands `/deep:agent-improvement` and `/deep:model-benchmark`, and the backend kind `improvement-host` (loop host `loop-host.cjs`). Remaining: three modes, `research`, `review` and `ai-council`, all on backend `runtime-loop-type`, in packets `deep-research/`, `deep-review/`, `deep-ai-council/`. The registry, router and packet edits are already done in this tree.

EDIT RULES
- A row, bullet, table line, keyword entry or JSON item that exists only for a removed item: delete it.
- A list that names a removed item among others: drop that item and fix the commas and "and".
- A count that included them: correct it (five modes -> three; four workflow families -> three; four packets -> three; "the two improvement lanes" or "the three improvement modes" -> remove the clause).
- A sentence that only explains the shared improvement packet, the improvement host or `runtimeLoopType: null`: delete it.
- Keep everything else word for word. Do not add new sections, do not explain the removal, do not add "removed" notes.

All paths below are under .skilled/skills/system-deep-loop/.

STEP 1. Delete these scenario files with `git rm`; each exists only for a removed mode:
  manual-testing-playbook/improvement-lane-routing/agent-improvement.md
  manual-testing-playbook/improvement-lane-routing/model-benchmark.md
  manual-testing-playbook/runtime-and-backend/improvement-host.md
  manual-testing-playbook/advisor-integration/command-bridge-guard.md

STEP 2. manual-testing-playbook/manual-testing-playbook.md
  - Remove the `improvement-lane-routing/` folder entry (~line 25) and the bullet on the two improvement lanes (~line 39).
  - Delete the whole `### Improvement Lane Routing (IL-001..IL-002)` section with its table (~lines 156-162), the `RB-003` row (~line 184) and the index row of the command-bridge-guard scenario (find it by its file link).
  - Line ~135 critical list: drop `IL-001`, `IL-002`, `RB-003` and the command-bridge-guard scenario id.
  - Line ~232 summary bullet for Improvement Lane Routing: delete it. Line ~234: drop `RB-003 improvement host`.
  - Line ~239 typed leaf-resource gold: drop `IL-001`, change "the four distinct-packet modes" to "the three distinct-packet modes", delete the sentence about the two improvement lanes sharing one packet.
  - Fix any scenario totals or counts in the file so they match what is left.

STEP 3. Edit these scenarios (apply the EDIT RULES; keep each scenario's structure):
  - advisor-integration/single-advisor-identity.md ~lines 39-41, 47: drop `agent-improvement`, `/deep:agent-improvement` and `deep-improvement` from the lists.
  - advisor-integration/lexical-mode-scoring.md ~line 76: delete the check row "None of the three prompts routes through `deep-improvement`." and renumber the rows after it.
  - advisor-integration/no-false-fire-code-edit.md ~line 41: drop `agent-improvement` and `model-benchmark` from the example list.
  - runtime-and-backend/external-adapter.md: the scenario now expects exactly ONE backend kind, `runtime-loop-type`. Rewrite lines ~6, 17, 27, 32, 35, 51, 61, 70 accordingly ("exactly two values" -> "exactly one value", expected set `{"runtime-loop-type"}`, drop `improvement-host` and the loop-host path).

STEP 4. Feature catalog:
  - feature-catalog/feature-catalog.md ~line 15: "one of five `workflowMode` packets (`research`, `review`, `ai-council`, `agent-improvement`, `model-benchmark`)" -> "one of three `workflowMode` packets (`research`, `review`, `ai-council`)". ~line 35: delete the clause about `runtimeLoopType` being `null` for the two improvement lanes and any mention of `improvement-host`.
  - feature-catalog/deep-loop-mode-classification/deep-loop-mode-classification.md ~line 28: drop ", and the two improvement lanes `agent-improvement`, `model-benchmark`" and any `improvement-host` mention in that paragraph.

DON'T
- BANNED OPERATIONS: git commit, git push, git checkout, git reset, git stash, git rebase, git branch, rm -rf, npm install, editing anything under specs/.
- ALLOWED WRITE PATHS: the files named in STEPS 1-4 only.

VERIFY (run these; report each exit status)
  rg -n -i "agent-improvement|model-benchmark|deep-improvement|improvement-host|loop-host|IL-00|RB-003|command-bridge-guard" .skilled/skills/system-deep-loop/manual-testing-playbook .skilled/skills/system-deep-loop/feature-catalog
  ls .skilled/skills/system-deep-loop/manual-testing-playbook

HANDBACK: list every file you deleted or changed, then each VERIFY command with its exit status and output. The rg should print nothing.
