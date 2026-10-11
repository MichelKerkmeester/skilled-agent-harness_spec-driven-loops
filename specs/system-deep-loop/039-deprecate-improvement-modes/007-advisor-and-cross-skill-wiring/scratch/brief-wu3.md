GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/039-deprecate-improvement-modes/007-advisor-and-cross-skill-wiring
It lives in the main checkout; you do not write to it. You write only in the current directory, which is a git worktree.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.


ROLE: You remove two retired deep-loop modes and two retired benchmark families from the sk-doc hub and its shared tooling. Nothing else.

Removed from this repository: the deep-loop modes `agent-improvement` and `model-benchmark`, the retired `skill-benchmark` lane, their packet `.skilled/skills/system-deep-loop/deep-improvement/`, the agent `deep-improvement`, the commands `/deep:agent-improvement` and `/deep:model-benchmark`, and the backend kind `improvement-host`. The deep-loop hub now has three modes: `research`, `review`, `ai-council`. Those deletions are already done in this tree.

EDIT RULES
- A row, bullet, table line, keyword, map entry, alias, case or fixture line that exists only for a removed item: delete it.
- A list that names a removed item among others: drop that item and fix the punctuation.
- A count that included them: correct it.
- A test that checks a general behaviour and merely uses a removed name as its example: keep the test and switch the example to a remaining mode or agent (`deep-research`, `deep-review`, `ai-council`). Never weaken an assertion to make a test pass.
- Keep everything else word for word. No "removed" notes, no tombstone comments.
The sk-create-benchmark packet itself is already trimmed to the mcp_promotion and behavior_benchmark families in this tree.

FILES (lines are where the mentions are today)
  .skilled/skills/sk-doc/ROUTER.md: 107,168,289,290,291,294,296
  .skilled/skills/sk-doc/SKILL.md: 33
  .skilled/skills/sk-doc/hub-router.json: 312,316,317,318
  .skilled/skills/sk-doc/mode-registry.json: 306,310,311,312
  .skilled/skills/sk-doc/graph-metadata.json: 222
  .skilled/skills/sk-doc/manual-testing-playbook/token-cost-baseline/max-load.md: 16,17,18,21,23,152,154,156,162,166
  .skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl: 4,11,21,27,33,38
  .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md: 749
  .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json: 304
  .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py: 82
  .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md: 283,284
  .skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt: 50
  .skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs: 12,104,140
  .skilled/skills/sk-doc/sk-create-skill/scripts/validate-playbook-topology.cjs: 88
  .skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json: 7388,7398,7408,7418,7428,7438,7448,7458,7468,7478,7488,7498,7508,7518,7528,7538,7548,7558,7568,7578,7588,7598,7608,7618,7628,7638,7648,7658,7788,7798,7808,7948,7958,7968,8148,8158,8168,10944
  .skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json: 529,530,531,532,533,534,535,536,537,538,539,540,541,542,543,544,545,546,547,548,549,550,551,552,553,564,565,566,580,581,582,600,601,602

SPECIAL CASES
- mode-registry.json and hub-router.json of sk-doc: remove the benchmark resource entries for the deleted model-benchmark and agent-improvement references and assets, keep the create-benchmark mode itself.
- After editing those two files, regenerate the leaf manifest (never hand-edit it):
    node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .skilled/skills/sk-doc
- scripts/tests/code-folder/*.json: these fixtures list the repository's code folders and README verdicts. Delete every entry whose path is inside `.skilled/skills/system-deep-loop/deep-improvement/` or one of the deleted runtime lib folders (`*-improvement-*`, `model-benchmark-*`). Keep the JSON valid and keep any counts in the file consistent.
- cite-drift-labels.jsonl: delete the label lines whose citation points into a deleted path.
- validate-compiled-routing-scenarios.cjs and validate-playbook-topology.cjs: drop the removed modes from any allowlist or expected-mode table. If a check counts deep-loop modes or playbook folders, update the count.

DON'T
- BANNED OPERATIONS: git commit, git push, git checkout, git reset, git stash, git rebase, git branch, rm -rf, npm install, editing anything under specs/.
- Do not put spec paths, phase numbers or ticket ids in code comments.
- Do not run any generator or sync script unless this brief names it.
- ALLOWED WRITE PATHS: the files listed above plus .skilled/skills/sk-doc/leaf-manifest.json (written by the generator only).

VERIFY (report each exit status and the last lines of any failure)
  node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-doc
  for t in .skilled/skills/sk-doc/scripts/tests/*.test.cjs; do node --test "$t" >/dev/null 2>&1 || echo "FAIL $t"; done
  (cd .skilled/skills/sk-doc/scripts/tests && python3 -m pytest -q -x . 2>&1 | tail -5)
  rg -n -i "agent-improvement|model-benchmark|deep-improvement|agent_improvement|model_benchmark" .skilled/skills/sk-doc --glob '!**/changelog/**' --glob '!**/benchmark/reports/**'

HANDBACK: list every file you changed, then each VERIFY result.
