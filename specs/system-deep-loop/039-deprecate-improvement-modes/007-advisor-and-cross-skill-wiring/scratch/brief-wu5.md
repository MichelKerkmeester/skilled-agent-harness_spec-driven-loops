GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/039-deprecate-improvement-modes/007-advisor-and-cross-skill-wiring
It lives in the main checkout; you do not write to it. You write only in the current directory, which is a git worktree.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.


ROLE: You remove two retired deep-loop modes and their packet from system-spec-kit docs and tests. Nothing else.

Removed from this repository: the deep-loop modes `agent-improvement` and `model-benchmark`, the retired `skill-benchmark` lane, their packet `.skilled/skills/system-deep-loop/deep-improvement/`, the agent `deep-improvement`, the commands `/deep:agent-improvement` and `/deep:model-benchmark`, and the backend kind `improvement-host`. The deep-loop hub now has three modes: `research`, `review`, `ai-council`. Those deletions are already done in this tree.
NOT REMOVED: `skill-benchmark-report.json` and `skill-benchmark-report.md` are the standard report files of every manual-testing-playbook run, in every skill. Never delete or edit a line only because it names those files.

EDIT RULES
- A row, bullet, table line, keyword, map entry, alias, case or fixture line that exists only for a removed item: delete it.
- A list that names a removed item among others: drop that item and fix the punctuation.
- A count that included them: correct it.
- A test that checks a general behaviour and merely uses a removed name as its example: keep the test and switch the example to a remaining mode or agent (`deep-research`, `deep-review`, `ai-council`). Never weaken an assertion to make a test pass.
- Keep everything else word for word. No "removed" notes, no tombstone comments.

FILES (lines are where the mentions are today)
  .skilled/skills/system-spec-kit/references/structure/folder-structure.md: 144,239,243,249,250,251,252,253,265,267
  .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json: 424-434 (the `IMPROVEMENT_ARTIFACTS` entry)
  .skilled/skills/system-spec-kit/runtime/cli/rules/check-improvement-artifacts.sh: delete the file with `git rm -q`
  .skilled/skills/system-spec-kit/references/workflows/agent-io-contract.md: 44
  .skilled/skills/system-spec-kit/references/workflows/quick-reference.md: 118
  .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md: 344,439,440
  .skilled/skills/system-spec-kit/runtime/tests/continuity-freshness.vitest.ts: 21
  .skilled/skills/system-spec-kit/runtime/tests/remediation-008-docs.vitest.ts: 27

SPECIAL CASES
- folder-structure.md: it may describe the `improvement/` artifact folder a removed mode wrote into a spec packet. Delete that description; old packets that still hold such folders are history and need no rule.
- The `IMPROVEMENT_ARTIFACTS` validator rule exists only to check configs the removed runtime wrote. Delete its script with `git rm -q` and remove its whole object from `validator-registry.json`, keeping the JSON valid.
- ENV-REFERENCE.md: delete env variables that only the deleted packet read; keep shared ones.
- The two tests: if a test reads a doc line that you changed, update its expected text to match; never delete an assertion that still checks a live behaviour.

DON'T
- BANNED OPERATIONS: git commit, git push, git checkout, git reset, git stash, git rebase, git branch, rm -rf, npm install, editing anything under specs/.
- Do not put spec paths, phase numbers or ticket ids in code comments.
- Do not run any generator or sync script unless this brief names it.
- ALLOWED WRITE PATHS: the files listed above only.

VERIFY (report each exit status)
  (cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/continuity-freshness.vitest.ts tests/remediation-008-docs.vitest.ts 2>&1 | tail -8)
  rg -n -i "agent-improvement|model-benchmark|deep-improvement" .skilled/skills/system-spec-kit/references .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md .skilled/skills/system-spec-kit/runtime/tests/continuity-freshness.vitest.ts .skilled/skills/system-spec-kit/runtime/tests/remediation-008-docs.vitest.ts

  node -e 'JSON.parse(require("fs").readFileSync(".skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json","utf8"))'
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/038-review-and-cli-lineage --strict 2>&1 | tail -4
  rg -n "IMPROVEMENT_ARTIFACT|check-improvement-artifacts" .skilled --glob '!**/changelog/**' --glob '!**/fixtures/**'

HANDBACK: list every file you changed, then each VERIFY result.
