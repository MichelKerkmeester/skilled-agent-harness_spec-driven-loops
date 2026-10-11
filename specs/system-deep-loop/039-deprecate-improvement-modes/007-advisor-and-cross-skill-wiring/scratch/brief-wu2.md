GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/039-deprecate-improvement-modes/007-advisor-and-cross-skill-wiring
It lives in the main checkout; you do not write to it. You write only in the current directory, which is a git worktree.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.


Removed from this repository: the deep-loop modes `agent-improvement` and `model-benchmark`, the retired `skill-benchmark` lane, their packet `.skilled/skills/system-deep-loop/deep-improvement/`, the agent `deep-improvement`, the commands `/deep:agent-improvement` and `/deep:model-benchmark`, and the backend kind `improvement-host`. The deep-loop hub now has three modes: `research`, `review`, `ai-council`. Those deletions are already done in this tree.

EDIT RULES
- A row, bullet, table line, keyword, map entry, alias, case or fixture line that exists only for a removed item: delete it.
- A list that names a removed item among others: drop that item and fix the punctuation.
- A count that included them: correct it.
- A test that checks a general behaviour and merely uses a removed name as its example: keep the test and switch the example to a remaining mode or agent (`deep-research`, `deep-review`, `ai-council`). Never weaken an assertion to make a test pass.
- Keep everything else word for word. No "removed" notes, no tombstone comments.

ROLE: You remove two benchmark families from the sk-create-benchmark skill. Nothing else.
The `model_benchmark` family (Lane B) and the `agent_improvement` guide-only family (Lane A) existed only to feed the removed deep-loop modes. The `mcp_promotion` and `behavior_benchmark` families stay exactly as they are.

STEP 1. Delete with git rm -r -q:
  .skilled/skills/sk-doc/sk-create-benchmark/assets/model-benchmark/
  .skilled/skills/sk-doc/sk-create-benchmark/references/model-benchmark/
  .skilled/skills/sk-doc/sk-create-benchmark/references/agent-improvement/
  .skilled/skills/sk-doc/sk-create-benchmark/manual-testing-playbook/benchmark-families/match-lane-b-fixture.md
  .skilled/skills/sk-doc/sk-create-benchmark/manual-testing-playbook/evidence-and-boundaries/prepare-lane-a-inputs.md
  If `evidence-and-boundaries/` is then empty, it is gone with its last file.

STEP 2. .skilled/skills/sk-doc/sk-create-benchmark/SKILL.md
  - Frontmatter description: drop "and model-benchmark" and "route the Lane A authoring guide".
  - Delete the Lane B and Lane A bullets in the opening and use-case lists (~lines 16, 18, 32, 33), the two family-table rows (~lines 93-94), `"model_benchmark"` and `"agent_improvement"` from `FAMILIES` (~108-109), the `MODEL_BENCHMARK` and `AGENT_IMPROVEMENT` intent entries (~117-118) and resource sets (~139-152), and the family words "model, agent" in the confirm prompt (~155).
  - Delete section `## 10. MODEL-BENCHMARK FIXTURES AND PROFILES` and the Lane A guide section (§12) whole. Renumber the sections after each deleted one and fix every in-file "§N" or "section N" reference to the new numbers.
  - Any other sentence naming the two families or `deep-improvement`: apply the EDIT RULES.
STEP 3. .skilled/skills/sk-doc/sk-create-benchmark/README.md: drop `model-benchmark` from trigger phrases and the invoke row, delete the two family rows (~44-45), the model-benchmark reference row (~151), change "three benchmark families, plus a guide-only fourth lane" to "two benchmark families", and fix "sections 9 through 11" to the renumbered sections. Apply the EDIT RULES to the rest.
STEP 4. .skilled/skills/sk-doc/sk-create-benchmark/references/shared/README.md: delete rows ~41-42 and ~59-61; fix the sentence at ~44 if it counts families.
STEP 5. .skilled/skills/sk-doc/sk-create-benchmark/manual-testing-playbook/manual-testing-playbook.md: drop "model-benchmark and agent-improvement" from the description; delete the BMR-005 and BMR-007 entries and the section heading left empty (~94-110); drop "the Lane B evaluator" from ~118; fix scenario totals.
STEP 6. .skilled/skills/sk-doc/scripts/tests/test_create_benchmark_family_registry.py line ~16: the guide-only set becomes empty (`frozenset()`); read the test and drop any assertion that exists only for `agent_improvement` or `model_benchmark`.
STEP 7. Add .skilled/skills/sk-doc/sk-create-benchmark/changelog/v1.6.0.0.md in the same frontmatter and section shape as changelog/v1.5.0.0.md: title "create-benchmark v1.6.0.0 changelog", one paragraph saying the model-benchmark and agent-improvement families were removed with the deep-loop modes they fed, a "What's New at a Glance" list of the deletions, and "## Upgrade" saying behavior and MCP-promotion authoring are unchanged. Bump the `version` in SKILL.md and README.md frontmatter to 1.6.0.0 if they carry one.

DON'T
- BANNED OPERATIONS: git commit, git push, git checkout, git reset, git stash, git rebase, git branch, rm -rf, npm install, editing anything under specs/.
- Do not put spec paths, phase numbers or ticket ids in code comments.
- Do not run any generator or sync script unless this brief names it.
- ALLOWED WRITE PATHS: everything under .skilled/skills/sk-doc/sk-create-benchmark/ named above, plus the test file in STEP 6.

VERIFY (report each exit status)
  python3 -m pytest -q .skilled/skills/sk-doc/scripts/tests/test_create_benchmark_family_registry.py 2>&1 | tail -5
  rg -n -i "model.benchmark|agent.improvement|lane a|lane b|deep-improvement" .skilled/skills/sk-doc/sk-create-benchmark --glob '!changelog/v1.[0-5]*'
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-benchmark/SKILL.md 2>&1 | tail -3

HANDBACK: list every file you deleted, changed or created, then each VERIFY result.
