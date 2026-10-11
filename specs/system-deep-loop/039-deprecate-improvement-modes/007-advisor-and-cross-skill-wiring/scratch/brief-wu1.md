GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/039-deprecate-improvement-modes/007-advisor-and-cross-skill-wiring
It lives in the main checkout; you do not write to it. You write only in the current directory, which is a git worktree.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

ROLE: You remove two retired deep-loop modes from the skill advisor's routing. Nothing else.

Removed from this repository: the deep-loop modes `agent-improvement` and `model-benchmark`, the retired `skill-benchmark` lane, their packet `.skilled/skills/system-deep-loop/deep-improvement/`, the agent `deep-improvement`, the commands `/deep:agent-improvement` and `/deep:model-benchmark`, and the backend kind `improvement-host`. The deep-loop hub now has three modes: `research`, `review`, `ai-council`. Those deletions are already done in this tree.

EDIT RULES
- A row, bullet, table line, keyword, map entry, alias, case or fixture line that exists only for a removed item: delete it.
- A list that names a removed item among others: drop that item and fix the punctuation.
- A count that included them: correct it.
- A test that checks a general behaviour and merely uses a removed name as its example: keep the test and switch the example to a remaining mode or agent (`deep-research`, `deep-review`, `ai-council`). Never weaken an assertion to make a test pass.
- Keep everything else word for word. No "removed" notes, no tombstone comments.

FILES (lines are where the mentions are today)
  .skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts: 16,17,18,19,20,38,39,40,41,42,62,102
  .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts: 122,123,140,142,143,146,148,149,150,151,152,153,154,155,156,157
  .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts: 152,156,157,158,160,256,258,262,263,264,266,460,462,466
  .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py: 294,295,296,297,298,848,2030,2031,2034,2043,2044,2045,2046,2068,2231,2232,2233,2365,2366,2367,2368,2369,2371,2510,2512,2513,2514,2516
  .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl: 40,41,42,43,44
  .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl: 58,59,60,61
  .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs: 130
  .skilled/skills/system-skill-advisor/runtime/tests/command-metadata-e2e.vitest.ts: 71
  .skilled/skills/system-skill-advisor/runtime/tests/routing-registry-drift-guard.vitest.ts: 192,194
  .skilled/skills/system-skill-advisor/runtime/tests/scorer/native-scorer.vitest.ts: 316,344
  .skilled/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/corpus-df-idf.md: 123
  .skilled/skills/system-skill-advisor/manual-testing-playbook/python-compat/regression-suite.md: 159,160,161,162,169,170,171,172
  .skilled/skills/system-skill-advisor/graph-metadata.json: 52

SPECIAL CASES
- aliases.ts: delete the `deep-model-benchmark` and `deep-improvement` alias groups (~lines 16-20, 38-42) and the default-mode fold entry `'deep-improvement': 'agent-improvement'` (~line 62); drop `deep-improvement` from the comment list near line 102.
- explicit.ts: delete the two `/deep:*` anchors (~lines 122-123) and the whole model-benchmark anchor block with its comment (~lines 140-157). Benchmark phrases such as "model benchmark" must no longer boost anything.
- projection.ts: delete the `deep-model-benchmark` and `command-deep-agent-improvement` projection entries (~lines 150-162, 254-268, 458-470); read the surrounding objects to delete each whole.
- skill_advisor.py: delete the `deep-improvement` alias group (~294), the agent-improvement phrase boosts (~2043-2046, 2068) and the `command-deep-agent-improvement` / `command-deep-model-benchmark` entries (~2231, 2365, 2510); delete each whole dict entry.
- regression-cases.jsonl and holdout-prompts.jsonl: delete each line whose expected route is a removed mode or command; keep the file one JSON object per line.
- routing-registry-drift-guard.vitest.ts ~line 192: the registry now has no `advisorDefaultMode` mode. Change that test to assert that no mode carries `advisorDefaultMode`.
- graph-metadata.json (advisor root): drop any edge or entity naming `deep-improvement`, `deep-model-benchmark` or the two removed commands, if present.

DON'T
- BANNED OPERATIONS: git commit, git push, git checkout, git reset, git stash, git rebase, git branch, rm -rf, npm install, editing anything under specs/.
- Do not put spec paths, phase numbers or ticket ids in code comments.
- Do not run any generator or sync script unless this brief names it.
- ALLOWED WRITE PATHS: the files listed above only. The generated files under `runtime/scripts/command-bridges/` and `runtime/scripts/skill-graph.json` are regenerated later; do not edit them.

VERIFY (report each exit status and the last lines of any failure)
  (cd .skilled/skills/system-skill-advisor/runtime && npm run typecheck 2>&1 | tail -10)
  (cd .skilled/skills/system-skill-advisor/runtime && npx vitest run 2>&1 | tail -15)
  python3 -m pytest -q -x .skilled/skills/system-skill-advisor/runtime/tests/python 2>&1 | tail -5
  python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_regression.py --dataset .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl 2>&1 | tail -5
  rg -n -i "agent-improvement|model-benchmark|deep-improvement" .skilled/skills/system-skill-advisor/runtime/lib .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py .skilled/skills/system-skill-advisor/runtime/scripts/fixtures .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy .skilled/skills/system-skill-advisor/runtime/tests

BASELINE: before your edits the advisor vitest already had 7 failing tests and the regression run passed 92/94 (`P0-CHROME-002` twice). Do not try to fix those; list the names of every failing test you see so they can be compared.

HANDBACK: list every file you changed, then each VERIFY result. If a test fails only because a generated command-bridge file still lists a removed command, say so and stop; do not edit generated files.
