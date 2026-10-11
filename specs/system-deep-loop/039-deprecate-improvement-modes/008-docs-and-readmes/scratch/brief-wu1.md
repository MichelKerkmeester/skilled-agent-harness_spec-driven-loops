GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/039-deprecate-improvement-modes/008-docs-and-readmes
It lives in the main checkout; you do not write to it. You write only in the current directory, which is a git worktree.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.


ROLE: You remove the last live doc mentions of two retired deep-loop modes and add one changelog entry. Nothing else.

Removed from this repository: the deep-loop modes `agent-improvement` and `model-benchmark`, the retired `skill-benchmark` lane, their packet `.skilled/skills/system-deep-loop/deep-improvement/`, the agent `deep-improvement`, the commands `/deep:agent-improvement` and `/deep:model-benchmark`, and the backend kind `improvement-host`. The deep-loop hub now has three modes: `research`, `review`, `ai-council`. Those deletions are already done in this tree.
NOT REMOVED: `skill-benchmark-report.json` and `skill-benchmark-report.md` are the standard report files of every manual-testing-playbook run, in every skill. Never delete or edit a line only because it names those files.

EDIT RULES
- A row, bullet, table line, keyword, map entry, alias, case or fixture line that exists only for a removed item: delete it.
- A list that names a removed item among others: drop that item and fix the punctuation.
- A count that included them: correct it.
- A test that checks a general behaviour and merely uses a removed name as its example: keep the test and switch the example to a remaining mode or agent (`deep-research`, `deep-review`, `ai-council`). Never weaken an assertion to make a test pass.
- Keep everything else word for word. No "removed" notes, no tombstone comments.

PART A. Live docs (apply the EDIT RULES)
  README.md (repo root): lines 556,648,650,821,868,1003,1005,1239,1243,1432
  .env.example: lines 334,452 — delete variables only the deleted packet read, with their comment lines.
  .skilled/hooks/hook-flags.env.example: lines 54,55 — delete both `JEV_FEATURE_VERDICT_FALLBACK` and `JEV_FEATURE_HALLUCINATION_GRADER` lines; their only readers were in the deleted packet and both switches are gone from the Jev feature registry.

PART B. Benchmark READMEs are HISTORY. They already describe the deep-improvement harness as retired; keep that wording. Change only:
  (a) a link whose target is inside `.skilled/skills/system-deep-loop/deep-improvement/` or to a deleted command file: keep the link text as plain text, drop the link;
  (b) a present-tense sentence telling the reader to run `/deep:agent-improvement`, `/deep:model-benchmark` or the deleted packet today: delete it.
  If a README needs neither, leave it untouched.
  Files:
    .skilled/skills/cli-classifier/cli-jev/benchmark/README.md: lines 24
    .skilled/skills/cli-external-orchestration/benchmark/README.md: lines 2,3,6,12,16,23,34,46
    .skilled/skills/cli-external-orchestration/cli-claude-code/benchmark/README.md: lines 2,3,6,12,16,23,44
    .skilled/skills/cli-external-orchestration/cli-cursor/benchmark/README.md: lines 3,16,22,24,50
    .skilled/skills/cli-external-orchestration/cli-hermes/benchmark/README.md: lines 20
    .skilled/skills/cli-external-orchestration/cli-opencode/benchmark/README.md: lines 3,16,22,53,54
    .skilled/skills/cli-external-orchestration/cli-pi/benchmark/README.md: lines 3,16,22,53,54
    .skilled/skills/mcp-tooling/benchmark/README.md: lines 3,13,17
    .skilled/skills/sk-code/benchmark/README.md: lines 2,3,6,10,14,23,89,90,116
    .skilled/skills/sk-design/benchmark/README.md: lines 2,6,12,22
    .skilled/skills/sk-design/sk-design-fundamentals/benchmark/README.md: lines 15
    .skilled/skills/sk-doc/benchmark/README.md: lines 2,3,6,12,16,22,35
    .skilled/skills/sk-git/benchmark/README.md: lines 2,6,12
    .skilled/skills/sk-prompt/benchmark/README.md: lines 2,3,6,12,16,22,59,60
    .skilled/skills/sk-vision/benchmark/README.md: lines 15,39,40

PART C. Changelog. Create .skilled/skills/system-deep-loop/changelog/v1.6.0.0.md in the same frontmatter and section shape as changelog/v1.5.3.0.md:
  - title "system-deep-loop v1.6.0.0", version 1.6.0.0, trigger phrases "system-deep-loop v1.6.0.0", "system-deep-loop 1.6.0.0", "improvement modes removed".
  - Opening paragraph: the agent-improvement and model-benchmark modes, the deep-improvement packet and agent, both /deep commands and their runtime lane libraries are removed; the hub routes three modes (research, review, ai-council). The agent mirror checker moved to .skilled/bin/check-agent-mirror-sync.cjs.
  - "## What's New at a Glance": four or five short bullets on the above.
  - "## Upgrade": the two commands no longer exist; agent evaluation and model benchmarking have no in-repo replacement; old spec packets that hold improvement/ artifact folders are history and need no action.
  - No spec-folder line.
  Then set `version: 1.6.0.0` in .skilled/skills/system-deep-loop/SKILL.md frontmatter (only that line).

DON'T
- BANNED OPERATIONS: git commit, git push, git checkout, git reset, git stash, git rebase, git branch, rm -rf, npm install, editing anything under specs/.
- Do not put spec paths, phase numbers or ticket ids in code comments.
- Do not run any generator or sync script unless this brief names it.
- ALLOWED WRITE PATHS: the files in PARTS A and B, the new changelog file, and the version line of system-deep-loop/SKILL.md.
- Do not edit BARTER.md; it is handled outside this worktree.

VERIFY
  rg -n -i "/deep:agent-improvement|/deep:model-benchmark|JEV_FEATURE_VERDICT_FALLBACK|JEV_FEATURE_HALLUCINATION_GRADER" README.md .env.example .skilled/hooks/hook-flags.env.example
  rg -n "deep-improvement/" .skilled/skills/cli-classifier/cli-jev/benchmark/README.md .skilled/skills/cli-external-orchestration/benchmark/README.md .skilled/skills/cli-external-orchestration/cli-claude-code/benchmark/README.md .skilled/skills/cli-external-orchestration/cli-cursor/benchmark/README.md .skilled/skills/cli-external-orchestration/cli-hermes/benchmark/README.md .skilled/skills/cli-external-orchestration/cli-opencode/benchmark/README.md .skilled/skills/cli-external-orchestration/cli-pi/benchmark/README.md .skilled/skills/mcp-tooling/benchmark/README.md .skilled/skills/sk-code/benchmark/README.md .skilled/skills/sk-design/benchmark/README.md .skilled/skills/sk-design/sk-design-fundamentals/benchmark/README.md .skilled/skills/sk-doc/benchmark/README.md .skilled/skills/sk-git/benchmark/README.md .skilled/skills/sk-prompt/benchmark/README.md .skilled/skills/sk-vision/benchmark/README.md 
  head -12 .skilled/skills/system-deep-loop/changelog/v1.6.0.0.md

HANDBACK: list every file you changed or created, then each VERIFY output. The first two should print nothing.
