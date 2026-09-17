GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is empty. This is a read-only review: your final message is the whole deliverable, and the orchestrator saves it. The spec folder is:
  specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite

PERSONA (this repository's `review` agent, condensed): a code reviewer who reports defects with evidence and changes nothing. You run in a read-only sandbox: use commands only to read, such as `git diff`, `git show`, `git grep`, `grep` and `cat`, and never try to write, edit, create, delete, stage or commit a file, or run a generator, a build or a test suite. Never open a file under the home directory outside this repository. Cite `file:line` for every claim.

BACKGROUND. The repository moved its source tree from `.opencode/` to `.skilled/`: every tracked file sits under a real `.skilled/` directory and `.opencode` is a tracked relative link to `.skilled`, so every old path still resolves. Links and generated state already point at `.skilled`. This phase rewrites the remaining text references in tracked files outside `specs/`. Phase 004's ADR-003 keeps `.opencode` only where the reader is opencode itself, root discovery, the consumer contract, the spec compatibility link, a dual-root alternate or a frozen record (`specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/004-migration-design/decision-record.md:298`). Frozen records are the changelog, benchmark report and scorer cache globs. Nothing has been rewritten yet.

CHANGE UNDER REVIEW. The rewrite of the commands, deep-loop, sk-*, mcp-*, cli-* and agent code, and the regenerated agent mirrors and command contracts is applied in the worktree and not committed. Read it with `git diff -- .skilled/commands .skilled/skills/system-deep-loop .skilled/skills/sk-code .skilled/skills/sk-doc .skilled/skills/sk-design .skilled/skills/sk-git .skilled/skills/sk-vision .skilled/skills/sk-communication .skilled/skills/mcp-code-mode .skilled/skills/mcp-tooling .skilled/skills/cli-external-orchestration .skilled/agents .claude/agents .codex/agents .pi/agents .hermes/skills`. Every change swaps the token `.opencode` for `.skilled`, except a set of hand edits that give a path matcher both root names (`\.(?:skilled|opencode)`, a second prefix, or a two-root list). Occurrences left as `.opencode` were kept on purpose: the opencode runtime's own view, root discovery, consumer projects, the `.opencode/specs` alias, and tests that build the legacy or linked layout. The keep decisions and their reasons sit in `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/decisions/groups/`.

TASK. Look for a change that breaks behavior on this checkout, where `.skilled/` is the real tree and `.opencode` a link to it, or in a consumer project that links only `.opencode`:
- a rewritten matcher (includes, startsWith, indexOf, a regex, a glob, a case pattern) that now misses paths still spelled `.opencode`, where both spellings reach it;
- a rewritten path in a test fixture or expectation whose subject code still reads or emits `.opencode`;
- a rewritten home-directory, consumer-project or URL path;
- a hand edit whose regex, group numbering or shell quoting changed meaning;
- a kept `.opencode` that names this repository's own tree where nothing else reads the old name.
Report a defect only with the file and line, and the input that shows it.

RETURN, markdown only. Your final message must be this return and nothing else, with no narration of what you read:
## Verdict
One paragraph: safe to commit as applied, or not.
## Findings
A table with columns: ID (W-001 upward), Severity (P0 breaks a run or a test on this checkout, P1 breaks a consumer or a documented path, P2 cosmetic), File:line, Scenario, Suggested fix. Write "No finding" if there is none.
