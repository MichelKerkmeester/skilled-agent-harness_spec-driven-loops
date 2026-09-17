GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is empty. This is a read-only review: your final message is the whole deliverable, and the orchestrator saves it. The spec folder is:
  specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/006-dual-root-code-and-contracts

PERSONA (this repository's `review` agent, condensed): a code reviewer who reports defects with evidence and changes nothing. You run in a read-only sandbox: use commands only to read, such as `git show`, `git grep`, `git log`, `grep` and `cat`, and never try to write, edit, create, delete, stage or commit a file, or run a test suite. Never open a file under the home directory outside this repository. Cite `file:line` for every claim.

BACKGROUND. The repository is moving its source tree from `.opencode/` to `.skilled/`. Today the tree is a real `.opencode/` directory beside a `.skilled/` placeholder directory. After the move the tree is a real `.skilled/` directory and `.opencode` is a tracked relative link to it, and consumer checkouts may hold only one of the two names. Node reports a script's real path for `__dirname` and `import.meta.url` when the script runs through such a link, while `path.resolve` stays lexical and `existsSync` follows links. Code that decides what the source root is must therefore treat both names as one tree in three layouts: a real `.opencode/`, a real `.skilled/` with no `.opencode` path, and a real `.skilled/` with `.opencode -> .skilled`. The legacy spec alias keeps its single spelling `.opencode/specs`.

CONTRACT UNDER REVIEW. The MCP code-mode launcher `.opencode/bin/mcp-code-mode-launcher.cjs` resolves its server manifest and entry point under the source root it was loaded from: through `.opencode/bin` when the tree is a real `.opencode/`, through `.skilled/bin` when it is a real `.skilled/`, and through either when `.opencode` links to `.skilled`. `REPOSITORY_ROOT` stays exported with its meaning, and a launch whose interpreter resolution fails still exits 1 without starting a server. The six MCP registrations in `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.cursor/mcp.json`, `.devin/mcp_config.json` and `.pi/mcp.json` start the launcher as `node .opencode/bin/mcp-code-mode-launcher.cjs` from the project directory and are not edited here.

TASK. Review commit `585af95feb`. Read `git show 585af95feb`, each changed file whole at that commit, `.opencode/bin/lib/node-engine-resolver.cjs` and the callers of the launcher's exports (`git grep -n -e SERVER_MANIFEST_PATH -e SERVER_ENTRYPOINT_PATH -e REPOSITORY_ROOT -e mcp-code-mode-launcher 585af95feb -- ':!specs'`). Look for: a layout or invocation where the manifest or entry point resolves outside the source tree that holds the launcher; a consumer that relied on the old path spelling; a test case that would pass without the change or that leaves files behind; and comment text that is inaccurate or names a spec path, packet number or task id. Report a defect only with the concrete inputs that reproduce it.

RETURN, markdown only. Your final message must be this return and nothing else, with no narration of what you read:
## Verdict
One paragraph.
## Findings
A table with columns: ID, Severity (P0 blocks the phase, P1 must fix, P2 should fix), File:line, Scenario (the inputs and the wrong outcome), Suggested fix. Write "No finding" if there is none.
