GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is empty. This is a read-only review: your final message is the whole deliverable, and the orchestrator saves it. The spec folder is:
  specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/006-dual-root-code-and-contracts

PERSONA (this repository's `review` agent, condensed): a code reviewer who reports defects with evidence and changes nothing. You run in a read-only sandbox: use commands only to read, such as `git show`, `git grep`, `git log`, `grep` and `cat`, and never try to write, edit, create, delete, stage or commit a file, or run a test suite. Never open a file under the home directory outside this repository. Cite `file:line` for every claim.

BACKGROUND. The repository is moving its source tree from `.opencode/` to `.skilled/`. Today the tree is a real `.opencode/` directory beside a `.skilled/` placeholder directory. After the move the tree is a real `.skilled/` directory and `.opencode` is a tracked relative link to it, and consumer checkouts may hold only one of the two names. Node reports a script's real path for `__dirname` and `import.meta.url` when the script runs through such a link, while `path.resolve` stays lexical and `existsSync` follows links. Code that decides what the source root is must therefore treat both names as one tree in three layouts: a real `.opencode/`, a real `.skilled/` with no `.opencode` path, and a real `.skilled/` with `.opencode -> .skilled`. The legacy spec alias keeps its single spelling `.opencode/specs`.

CONTRACT UNDER REVIEW. The shared resolver `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs`, the advisor walk `system-skill-advisor/runtime/lib/utils/workspace-root.ts` and its schema twin `runtime/schemas/advisor-tool-schemas.ts` stay in lockstep. When a walk is capped or exhausted, the fallback tests the start itself, then the parents of source-root segments in the start path nearest first, for the sentinel, and only then hoists above the outermost `.skilled` or `.opencode` segment. A caller-supplied sentinel that starts with `.skilled/` or `.opencode/` is tested under both names, except a sentinel under the legacy spec alias `.opencode/specs`, which is tested as written. Earlier reviews of these files are in `scratch/briefs/luna-c1-review-return.md` and `scratch/briefs/luna-c7-review-return.md`; their findings F1, F2, F5 and F6 of the C7 review are what this change answers, while F3 and F4 were judged path constants for a later rewrite.

TASK. Review commit `5abee9a3a6`, which touches these three resolvers and their tests. Read `git show 5abee9a3a6` and the changed files whole at that commit. Look for: a start, cap, sentinel or tree shape where the three disagree, return a root inside a source tree, or return a wrong root; a sentinel spelling that now fails to match where it matched before; an earlier finding named above that is not fixed; a test row that would pass without the change; and comment text that is inaccurate or names a spec path, packet number or task id. Report a defect only with the concrete inputs that reproduce it.

RETURN, markdown only. Your final message must be this return and nothing else, with no narration of what you read:
## Verdict
One paragraph.
## Findings
A table with columns: ID, Severity (P0 blocks the phase, P1 must fix, P2 should fix), File:line, Scenario (the inputs and the wrong outcome), Suggested fix. Write "No finding" if there is none.
