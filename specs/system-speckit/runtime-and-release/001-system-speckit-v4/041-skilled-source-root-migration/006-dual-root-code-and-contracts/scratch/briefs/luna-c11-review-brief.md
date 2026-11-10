GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is empty. This is a read-only review: your final message is the whole deliverable, and the orchestrator saves it. The spec folder is:
  specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/006-dual-root-code-and-contracts

PERSONA (this repository's `review` agent, condensed): a code reviewer who reports defects with evidence and changes nothing. You run in a read-only sandbox: use commands only to read, such as `git show`, `git grep`, `git log`, `grep` and `cat`, and never try to write, edit, create, delete, stage or commit a file, or run a test suite. Never open a file under the home directory outside this repository. Cite `file:line` for every claim.

BACKGROUND. The repository is moving its source tree from `.opencode/` to `.skilled/`. Today the tree is a real `.opencode/` directory beside a `.skilled/` placeholder directory. After the move the tree is a real `.skilled/` directory and `.opencode` is a tracked relative link to it, and consumer checkouts may hold only one of the two names. Node reports a script's real path for `__dirname` and `import.meta.url` when the script runs through such a link, while `path.resolve` stays lexical and `existsSync` follows links. Code that decides what the source root is must therefore treat both names as one tree in three layouts: a real `.opencode/`, a real `.skilled/` with no `.opencode` path, and a real `.skilled/` with `.opencode -> .skilled`. The legacy spec alias keeps its single spelling `.opencode/specs`.

CONTRACT UNDER REVIEW. `.opencode/bin/worktree-session.sh` links shared dependencies and compiled output from the main checkout's real source root, testing `.skilled/skills/system-spec-kit/SKILL.md` before `.opencode/skills/system-spec-kit/SKILL.md` and keeping `.opencode` when neither exists. The dry-run plan and `SPEC_KIT_DB_DIR` name main's source root, and after the worktree is created `SPEC_KIT_DB_DIR` names the worktree's own source root. When the two roots differ, as with a main checkout whose tree moved in its working copy but not in the commit the worktree checks out, the session logs a warning and links nothing. `SPECKIT_WORKTREE_SHARED_PATHS` still supplies the path list when set. A `.skilled`-only checkout never gains a real `.opencode` path, and the launcher adds at most four file tests before allocating a worktree.

TASK. Review commit `1c3c1936ce`. Read `git show 1c3c1936ce` and each changed file whole at that commit. Look for: a layout, override or mismatch where the launcher links the wrong tree, plants a second source tree or skips paths it should link; a shell construct that `/bin/bash` 3.2.57 rejects or that breaks under `set -euo pipefail`; a test fixture that touches the real home directory, the real git hooks or anything outside its temporary root, or a row that would pass without the change; and comment text that is inaccurate or names a spec path, packet number or task id. Report a defect only with the concrete inputs that reproduce it.

RETURN, markdown only. Your final message must be this return and nothing else, with no narration of what you read:
## Verdict
One paragraph.
## Findings
A table with columns: ID, Severity (P0 blocks the phase, P1 must fix, P2 should fix), File:line, Scenario (the inputs and the wrong outcome), Suggested fix. Write "No finding" if there is none.
