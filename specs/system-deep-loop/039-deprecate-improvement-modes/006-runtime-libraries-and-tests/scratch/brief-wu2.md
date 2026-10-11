GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/039-deprecate-improvement-modes/006-runtime-libraries-and-tests
It lives in the main checkout; you do not write to it. You write only in the current directory, which is a git worktree.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

ROLE: You remove a retired lane family from the deep-loop runtime's library code and scripts so it typechecks again. Nothing else.

Removed lanes: `agent-improvement`, `model-benchmark`, `skill-benchmark` and their shared base `deep-improvement-common` (also spelled `deep-improvement` or `improvement` as a mode alias), plus the packet `.skilled/skills/system-deep-loop/deep-improvement/` and its loop host. They are the "improvement family". Remaining deep-loop modes: research, review and ai-council (decision kinds `deep-review`, `deep-ai-council`, research where present).
Their libraries, lane tests and `lib/legacy-projections/deep-improvement-ledgers-contract.ts` are already deleted in this tree.

RULE: in the files below, delete every union member, enum or const entry, map row, switch case, import, export, function, type and comment line that exists only for the improvement family. Keep every entry for research, review, ai-council and anything else. Do not invent replacements and do not leave tombstone comments.

FILES (all under .skilled/skills/system-deep-loop/runtime/; the lines are where the mentions are today)
  lib/authorized-ledger/dark-ledger-adapter.ts: 34
  lib/blinded-adjudication/contracts.ts: 16,17,18,52,58,64
  lib/blinded-adjudication/event-registry.ts: 123,124,125
  lib/blinded-adjudication/index.ts: 69,70,74,75,76,133
  lib/blinded-adjudication/mode-adapters.ts: 90,92,97,101,103,108,112,114,160,163,164,167,168,175,181,182,185,186,189
  lib/legacy-projections/index.ts: 22,23,76,77,78
  lib/legacy-projections/legacy-projection-manifest.ts: 148,149,155,156,157,163,170,171,172,178,179,180,187
  lib/mode-append-gateway/append-mode-event.ts: 184
  lib/per-mode-authority-flip/types.ts: 21,23,26,133,134,135
  lib/write-set-conflict-graph/graph.ts: 69,70,71,669
  lib/write-set-conflict-graph/shipped-census.ts: 107,109,111,113,115,117,119,121,123,125,353,356,360,369,373,380,384,393,397,407,410,414,421,425,434,438,449,457,461,469,472,475,479,488,492,499,503,509,513,521,525,533,536,539,543,550,554,563,567,574,578,586,590,598
  lib/write-set-conflict-graph/types.ts: 15,16,17,18
  scripts/append-mode-event.cjs: 96,97,100,134,135,137,138,139,140,143,144,146,147,148,149,152,153,155,156,157,158
  scripts/check-documentation-drift.cjs: 21,47
  scripts/check-projection-coverage.cjs: 45,78,80,132

SPECIAL CASES
- lib/legacy-projections/legacy-projection-manifest.ts: delete the projection surfaces whose writer is `deep-improvement`, the model-benchmark lane or the skill-benchmark lane (~lines 145-190).
- lib/write-set-conflict-graph: delete nodes `004-deep-improvement-common`, `005-agent-improvement`, `006-model-benchmark`, `007-skill-benchmark` and every edge and census row that names them. If a numbered list of nodes is used for ordering, leave the remaining numbers as they are.
- lib/mode-append-gateway/append-mode-event.ts ~line 184 and scripts/append-mode-event.cjs ~lines 96-160: drop the improvement aliases and the three lane cases; an improvement mode name must now fall through to the existing unknown-mode handling.
- scripts/check-documentation-drift.cjs ~lines 21 and 47: drop the `deep-improvement/README.md` doc path and the improvement-lane check that filters `packet === 'deep-improvement'`.
- scripts/check-projection-coverage.cjs ~lines 45, 80, 132: drop the deleted contract and the `deep-improvement` entry.

DON'T
- BANNED OPERATIONS: git commit, git push, git checkout, git reset, git stash, git rebase, git branch, rm -rf, npm install, editing anything under specs/.
- ALLOWED WRITE PATHS: the 15 files above only. Tests are the next unit's job; do not edit them.
- Do not put spec paths, phase numbers or ticket ids in code comments.

VERIFY (run from .skilled/skills/system-deep-loop/runtime; report each exit status)
  npm run typecheck 2>&1 | grep -v "tests/" | tail -20
  rg -n "agent-improvement|model-benchmark|deep-improvement|improvement-host|agent_improvement|model_benchmark|agentImprovement|modelBenchmark|AGENT_IMPROVEMENT|MODEL_BENCHMARK|AgentImprovement|ModelBenchmark|DeepImprovement|DEEP_IMPROVEMENT|skill-benchmark|SKILL_BENCHMARK|SkillBenchmark|improvement-ledgers" lib scripts
  for s in check-contract-drift check-documentation-drift check-projection-coverage check-ledger-stem-producers verify-authority; do [ -f scripts/$s.cjs ] && { node scripts/$s.cjs >/dev/null 2>&1; echo "$s $?"; }; done

HANDBACK: list every file you changed, then each VERIFY output. Typecheck errors inside tests/ are expected until the next unit; errors in lib/ or scripts/ are not.
