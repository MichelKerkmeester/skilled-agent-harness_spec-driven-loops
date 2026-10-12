# Iteration 2: Root README install path — prerequisites, five steps, verify block, first use

## Focus

Q2: Do the root README install, prerequisites (Node 24), first-use and setup statements match the v4.0.0.4 install changes and the repository?

Read scope: `README.md` lines 1-270 (§4 Quick Start = lines 154-246, the only install/setup section; section map captured with an `awk` scan of `^## ` headings, 16 sections total). The changelog's Install and First Use (401-413) and Upgrade Notes (417-452) were re-opened first-hand so the install-side release claims are read evidence in this iteration, not carried hypotheses. Every install target the README names was checked against the repository, and the README's own safe, read-only commands were run: `node --version`, `npm --version`, `git --version`, `git remote get-url origin`, the seven-config launcher probe, and `node .skilled/bin/skill-advisor.cjs list-tools --format json` — run only after the daemon socket `/tmp/system-skill-advisor/hf-embed.sock` was verified live, so the query spawns nothing.

## Actions Taken

1. Read state first: `deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `findings-registry.json` (the Q2 text was taken exactly from the registry), and `iterations/iteration-001.md`. Focus = strategy §11 Next Focus (Q2); no exhausted approach blocks Q2.
2. Re-opened `.skilled/changelog/skilled/v4.0.0.4.md` lines 395-452: Playbook/Catalog checks, Install and First Use, Missing Builds, Mirror Check, Upgrade Notes.
3. Read `README.md` lines 1-270: prerequisites (158-162), the five install steps (164-183), Verify Installation (185-193), Git Hooks (195-214), First Use (216-234), Adapting to Your Stack (236-244).
4. One read-only evidence command covered: versions (`node` v26.8.2, `npm` 11.19.1, `git` 2.50.1), `git remote get-url origin`, `git config --local --get skilled.trustRepoHooks` (unset), `cat` of the three npm targets' `package.json` files plus the Code Mode server package, a `.skilled/bin` listing, the seven MCP config presence + `mcp-code-mode-launcher` string probe, existence checks for root `.nvmrc` / root `package.json` (both absent), and the first-use paths `.devin/skills/system-spec-kit` / `.hermes/prompts/speckit-complete.md` (both present).
5. Read the build-load chain files: `.skilled/bin/skill-advisor.cjs` (shim; requires spec-kit CLI `lib/dist-freshness.cjs` at line 24), `.skilled/bin/check-agent-mirror-sync.cjs` (NOT CHECKABLE exit path at 120-122), `.skilled/bin/lib/mirror-sync-verify.cjs` (parser = spec-kit `shared/dist/frontmatter/parse-frontmatter.js`, lines 12-16; its error at line 37 names the README's exact build command).
6. Grepped `.skilled/hooks/` for `system-spec-kit` → `.skilled/hooks/session-lifecycle/README.md:80` states the hook `.js` siblings are relative symlinks into spec-kit's built `dist/hooks/`.
7. Ran the README's verify command: `node .skilled/bin/skill-advisor.cjs list-tools --format json` → `{"status":"ok","data":{"count":9,...}}`, EXIT=0.

## Findings

| README path:line | Claim as written | Evidence | Class | Severity | Smallest proposed fix |
|---|---|---|---|---|---|
| README.md:160 | "Node.js 24.x for a full install. Code Mode's MCP server needs `>=24.0.0 <25.0.0`, the spec-kit runtime CLI needs 22.12+ and the advisor runtime needs 20.19+ or 22.12+" | `cat` of each target: `.skilled/skills/mcp-code-mode/mcp-server/package.json` → `"engines": {"node": ">=24.0.0 <25.0.0"}`; `.skilled/skills/system-spec-kit/runtime/cli/package.json` → `>=22.12.0`; `.skilled/skills/system-skill-advisor/runtime/package.json` → `^20.19.0 \|\| >=22.12.0`; [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:444] | OK-VERIFIED | P2 | none |
| README.md:161 | "`npm`, `git` and a POSIX shell" | `npm --version` → 11.19.1; `git --version` → 2.50.1 (Apple Git-155); this session's commands run under bash | OK-VERIFIED | P2 | none |
| README.md:160 (prereq context) | The prerequisite assumes Node 24.x; the repository ships no root version pin | `cat .nvmrc` → not found; `cat package.json` (root) → not found; `node --version` → v26.8.2, outside Code Mode's `<25.0.0`; the requirement is enforced per package only, in the four `engines` fields | OK-VERIFIED | P2 | none required (no README wording defect; a root `.nvmrc` would be a repo-side addition, not a README fix) |
| README.md:162 | "No global TypeScript needed. The builds use the TypeScript the spec-kit workspace installs" | `.skilled/skills/system-spec-kit/package.json` devDependencies → `"typescript": "^5.9.3"`; advisor build script → `npm --prefix ../../system-spec-kit/shared run build && ../../system-spec-kit/node_modules/.bin/tsc -p tsconfig.build.json` | OK-VERIFIED | P2 | none |
| README.md:166 | Clone URL `https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git` | `git remote get-url origin` → `https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git` | OK-VERIFIED | P2 | none |
| README.md:169-173 | Steps 2-3 (`npm --prefix .skilled/skills/system-spec-kit install` / `run build`); "The runtimes' session hooks and the agent mirror check load this build" | `.skilled/skills/system-spec-kit/package.json` exists: workspaces `[shared, runtime, runtime/cli]`, `scripts.build` = `tsc --build`, `postinstall` records the node version; `.skilled/bin/lib/mirror-sync-verify.cjs:14-16` loads `system-spec-kit/shared/dist/frontmatter/parse-frontmatter.js` (build output) and its failure message at line 37 names `npm --prefix .skilled/skills/system-spec-kit run build`; [SOURCE: .skilled/hooks/session-lifecycle/README.md:80] ("The `.js` siblings are relative symlinks into `system-spec-kit`'s built `dist/hooks/`"); [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:405], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:449] | OK-VERIFIED | P2 | none |
| README.md:175-179 | Step 4 ("Run it after step 2: the advisor build compiles against the types step 2 installs"); `node .skilled/bin/skill-advisor.cjs list-tools --format json` | Advisor `package.json`: build script uses `../../system-spec-kit/node_modules/.bin/tsc`, deps include `"@spec-kit/shared": "file:../../system-spec-kit/shared"`; `.skilled/bin/skill-advisor.cjs:24` requires `system-spec-kit/runtime/cli/lib/dist-freshness.cjs`; the command ran → `{"status":"ok","data":{"count":9,...}}`, EXIT=0 | OK-VERIFIED | P2 | none |
| README.md:181-182 | Step 5: `git config --local skilled.trustRepoHooks true` | `git config --local --get skilled.trustRepoHooks` → unset in this worktree (the step is a reader action, not repo state); [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:405] | OK-VERIFIED | P2 | none |
| README.md:188-189 | Verify grep over `opencode.json .mcp.json .claude/mcp.json .codex/config.toml .cursor/mcp.json .devin/mcp_config.json .pi/mcp.json` for `mcp-code-mode-launcher` | All seven files PRESENT; `awk` probe → all seven carry the launcher string; `.skilled/bin/mcp-code-mode-launcher.cjs` exists; `.codex/config.toml` is the file Codex reads [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:397] | OK-VERIFIED | P2 | none |
| README.md:191-192 | "Confirm the advisor CLI enumerates all nine commands" | Ran it: `node .skilled/bin/skill-advisor.cjs list-tools --format json` → `"count": 9` (advisor_recommend, advisor_rebuild, advisor_status, advisor_validate, skill_graph_scan, skill_graph_query, skill_graph_status, skill_graph_validate, skill_graph_propagate_enhances), EXIT=0 | OK-VERIFIED | P2 | none |
| README.md:218-224 | First Use: seven runtimes and their `/speckit:complete` spellings; Hermes via `.hermes/prompts/speckit-complete.md`; Devin via its `/system-spec-kit` skill | `.hermes/prompts/speckit-complete.md` exists (843 bytes); `.devin/skills/system-spec-kit/` exists; [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:405] | OK-VERIFIED | P2 | none |

Note: every row was checked by opening the cited file lines or running the cited command in this iteration. No STALE, MISSING or WRONG row was found in §4: all eleven checks are OK-VERIFIED. The v4.0.0.4 install changes (Node 24 prerequisite, the new spec-kit workspace build step, the advisor step-order note, the `skilled.trustRepoHooks` step, the seven-runtime First Use) are all present in the README and backed by the repository.

## Questions Answered

- Q2: Do the root README install, prerequisites (Node 24), first-use and setup statements match the v4.0.0.4 install changes and the repository? -- answered by the eleven §4 checks above. The only item not run literally is the `grep -l` at README:189, replaced by an equivalent read-only `awk` probe because shell `grep` is barred in this environment; result 7/7 files present and 7/7 carrying the launcher string.

## Questions Remaining

- Q3: Do the root README statements on features (deep-loop modes, skill hubs, routing and the advisor, hooks, code review output, scripts refusing unknown options, per-doc versions, playbook and catalog checks, CI gates) match v4.0.0.4 and the repository?
- Q4: Which statements in the related READMEs are stale, missing or wrong against v4.0.0.4 and the repository?
- Q5: Which v4.0.0.4 user-facing changes do the READMEs leave out where a reader would need them, and which README statements were checked and found accurate?

## Ruled Out

- Root `.nvmrc` or root `package.json` as the Node 24 enforcement source: both absent (cat probes returned not-found); the requirement is enforced per package via the four `engines` fields, so no root version file can be cited or expected.
- Forcing the advisor CLI run past its freshness gate with `SYSTEM_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1`: unnecessary; the shim's freshness check passed and `list-tools` exited 0 without any bypass, so the bypass env would have changed behavior without adding evidence.

## Dead Ends

- None beyond Ruled Out.

## Edge Cases

- Ambiguous input: none material. The focus names `.nvmrc` as a check item; its absence is recorded as evidence (finding row 3), not as ambiguity.
- Contradictory evidence: none. README:160, the three `engines` fields and [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:444] all agree.
- Missing dependencies: none. The advisor daemon socket precondition was verified live before the run; no fallback needed.
- Partial success: none. The one command not run literally (the `grep -l` at README:189) was replaced by an equivalent read-only probe; the advisor command ran to exit 0.

## Sources Consulted

- [SOURCE: README.md:154], [SOURCE: README.md:158], [SOURCE: README.md:160], [SOURCE: README.md:161], [SOURCE: README.md:162], [SOURCE: README.md:166], [SOURCE: README.md:169], [SOURCE: README.md:172], [SOURCE: README.md:175], [SOURCE: README.md:177], [SOURCE: README.md:181], [SOURCE: README.md:189], [SOURCE: README.md:192], [SOURCE: README.md:218], [SOURCE: README.md:224]
- [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:401], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:405], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:413], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:420], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:444], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:449]
- [SOURCE: .skilled/skills/mcp-code-mode/mcp-server/package.json], [SOURCE: .skilled/skills/system-spec-kit/package.json], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/package.json], [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json]
- [SOURCE: .skilled/bin/skill-advisor.cjs:24], [SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:14], [SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:37], [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:21], [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:121], [SOURCE: .skilled/hooks/session-lifecycle/README.md:80], [SOURCE: .skilled/hooks/session-lifecycle/README.md:135]
- Command outputs: `node --version` v26.8.2; `npm --version` 11.19.1; `git --version` 2.50.1; `git remote get-url origin` (matches README:166); `git config --local --get skilled.trustRepoHooks` (unset); launcher probe 7/7 "HAS launcher"; `node .skilled/bin/skill-advisor.cjs list-tools --format json` count 9, EXIT=0; `ls -la /tmp/system-skill-advisor/` (live `hf-embed.sock`)
- specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/deep-research-config.json; deep-research-state.jsonl; deep-research-strategy.md; findings-registry.json; iterations/iteration-001.md

## Assessment

- New information ratio: 0.75
- Questions addressed: Q2
- Questions answered: Q2

## Reflection

- What worked and why: re-reading the changelog's install section first-hand made the claim list exact; one compound read-only command per batch kept the evidence count low while still opening every cited file; verifying the daemon socket before running the README's own verify command turned a spawn-side-effect risk into a clean read-only run (exit 0, count 9); reading the shim and parser libraries pinned the "hooks and the mirror check load this build" claim to exact lines instead of the changelog's prose.
- What did not work and why: nothing failed. The literal `grep -l` could not be used because shell grep is barred in this environment; the `awk` probe reproduces its predicate exactly, so the substitution changed the tool, not the evidence.
- What I would do differently: resolve the two iteration-1 carry-overs (`spec/` restore README location; the cupt CLI key question) inside the same pass when Q3/Q4 open the related READMEs, instead of leaving them for a later focus.

## Recommended Next Focus

Iteration 3: Q3 — walk the root README's feature statements (deep-loop modes, skill hubs, routing and the advisor, hooks, code-review output, unknown-option refusal, per-doc versions, playbook and catalog checks, CI gates) against v4.0.0.4 and the repository. Carry-overs to fold in: (1) locate the `spec/` restore README the changelog names at lines 65 and 425 (search `specs/` and the system-spec-kit tree); (2) confirm whether `mcp-click-up`'s cupt CLI still needs `CLICKUP_API_KEY`/`CLICKUP_TEAM_ID` so the README:1435 fix wording from iteration 1 can be finalized.

## SCOPE VIOLATIONS

None.
