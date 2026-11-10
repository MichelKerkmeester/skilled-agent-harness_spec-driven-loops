# Iteration 1: Related-README inventory and v4.0.0.4 to README impact map

## Focus

Q1: Which READMEs are related to the root README.md (linked from it, or documenting the same setup or features, or touched by v4.0.0.4), built from links and grep rather than guesses? Second half of the iteration-1 focus: read the whole `.skilled/changelog/skilled/v4.0.0.4.md` note (452 lines) and map each section to the root README lines it could affect. Install-facing checks in README §4 (Quick Start) and the retired-mode check were done opportunistically because the map pointed straight at them.

## Actions Taken

1. Read state first: `deep-research-config.json`, `deep-research-state.jsonl` (3 lines, no prior iterations), `deep-research-strategy.md`. Focus taken from strategy §11 (Q1). No exhausted approaches exist yet.
2. Extracted every relative link from `README.md` with grep pattern `\]\([^h][^)]*\)` -> 35 matches, 24 distinct targets. All targets resolved in one command: `ls -d LICENSE AGENTS.md .env.example ...` (23 paths printed, 2 errors).
3. Read the complete v4.0.0.4 note in three reads (lines 1-176, 176-390, 390-452).
4. Enumerated READMEs: repo-wide `**/README.md` find (result capped at 100 -- dominated by benchmark/fixture READMEs), a hub-README existence find with brace expansion, and a find for `**/install*.md` under `.skilled/`.
5. Read README lines 140-229 (§4 Quick Start) and 556-660 (§6 Deep Loop) to anchor the map with real claims.
6. Grep `agent-improvement|model-benchmark` over README.md -> 0 matches (the retired deep-loop modes are gone from the root README).
7. ClickUp probe: grep `clickup` (case-insensitive) over README.md -> 5 matches; lines 1336 and 1435 contradict each other and the release note.

## Related-README inventory (answers Q1)

### A. READMEs and docs linked from the root README.md

All targets verified with one `ls -d` command (output: 23 of 25 paths printed; the two errors are `.skilled/README.md` and `spec/README.md`, covered below).

| Target | Root README line | Status |
|---|---|---|
| `.skilled/scripts/git-hooks/README.md` | 214 | exists |
| `.skilled/skills/system-spec-kit/README.md` | 524, 1589 | exists |
| `.skilled/skills/system-deep-loop/runtime/README.md` | 655 | exists |
| `.skilled/skills/system-deep-loop/README.md` | 655 | exists |
| `.skilled/skills/system-skill-advisor/README.md` | 770, 1592 | exists |
| `.skilled/hooks/README.md` | 1068, 1473 | exists |
| `.skilled/skills/system-spec-kit/runtime/README.md` | 1590 | exists |
| `.skilled/scripts/README.md` | 1591 | exists |
| `.skilled/changelog/skilled/` (directory; holds README.md and the release notes) | 1598 | exists |
| `.skilled/skills/system-spec-kit/changelog/` (directory) | 1599 | exists |

Linked non-README docs (same command): `LICENSE` (line 4), `.skilled/skills/sk-git/assets/commit-message-template.md` (200), `.skilled/skills/sk-git/assets/worktree-checklist.md` (201), `.hermes/SYNC.md` (224, 1057), `.hermes/prompts/speckit-complete.md` (224, referenced in backticks), `AGENTS.md` (524, 1588), `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` (542), `.env.example` (1476), `.skilled/skills/system-spec-kit/ARCHITECTURE.md` (1593), `.skilled/skills/sk-doc/SKILL.md` (1594), `.skilled/skills/README.txt` (1595), `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` (1596), `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` (1597), `.skilled/skills/system-spec-kit/references/cli/daemon-cli-reference.md` (1600). All exist.

### B. Hub READMEs named in the research topic (existence find)

`find_file_by_name` pattern `.skilled/{README.md,skills/sk-doc/README.md,skills/sk-code/README.md,skills/sk-git/README.md,skills/system-spec-kit/README.md,skills/system-skill-advisor/README.md,skills/system-deep-loop/README.md,skills/cli-external-orchestration/cli-pi/README.md}` returned 7 paths:

- `.skilled/skills/cli-external-orchestration/cli-pi/README.md` -- exists
- `.skilled/skills/sk-code/README.md` -- exists
- `.skilled/skills/sk-doc/README.md` -- exists
- `.skilled/skills/sk-git/README.md` -- exists
- `.skilled/skills/system-deep-loop/README.md` -- exists
- `.skilled/skills/system-skill-advisor/README.md` -- exists
- `.skilled/skills/system-spec-kit/README.md` -- exists
- `.skilled/README.md` -- NOT found (confirmed: `ls -d .skilled/README.md` -> `No such file or directory`)

### C. Docs the v4.0.0.4 changes touch (find `**/install*.md` under `.skilled/`)

- `.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md`
- `.skilled/skills/mcp-tooling/mcp-aside-devtools/INSTALL-GUIDE.md`
- `.skilled/skills/mcp-tooling/mcp-chrome-devtools/INSTALL-GUIDE.md`
- `.skilled/skills/mcp-tooling/mcp-click-up/INSTALL-GUIDE.md`
- `.skilled/skills/mcp-tooling/mcp-figma/INSTALL-GUIDE.md`
- `.skilled/skills/mcp-tooling/mcp-mobbin/INSTALL-GUIDE.md`
- `.skilled/skills/mcp-tooling/mcp-notion/INSTALL-GUIDE.md`
- `.skilled/skills/mcp-tooling/mcp-obsidian/INSTALL-GUIDE.md`
- `.skilled/skills/mcp-tooling/mcp-refero/INSTALL-GUIDE.md`
- `.skilled/skills/sk-design/sk-design-md-generator/INSTALL-GUIDE.md`
- `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md`

The changelog's "install guides" that gained frontmatter [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:389] map to this INSTALL-GUIDE.md family. The changelog also names a `spec/` README for manifest restore [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:65] [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:425] -- `ls -d spec/README.md` -> `No such file or directory`; the actual location is unresolved and is carried into iteration 2.

### D. Excluded from the related set (with reason)

- The repo-wide `**/README.md` find returns more than 100 paths, dominated by report/fixture READMEs (`.pi/extensions/*/benchmark/reports/**/README.md`, `.skilled/skills/*/benchmark/reports/**/README.md`, `.skilled/commands/**/fixtures/README.md`). These document one benchmark run or a fixture, not the setup or features the topic names.
- `.skilled/skills/.state/*/README.md` -- runtime state folders, not docs.

## Changelog to README impact map

| v4.0.0.4 section (note lines) | Root README target | Status after iteration 1 |
|---|---|---|
| Intro + Why This Release (12-28) | cross-cutting | mapped; no direct claim check |
| What's New at a Glance (32-47) | cross-cutting, incl. install (46) | mapped; install rows checked below |
| Spec Upgrades (51-89) | §5 Spec Kit (248-555); §16 links (1589-1590); `spec/` README (unresolved) | deferred to iteration 2-3 |
| Spec Validation (93-105) | §5; create.sh mentions | deferred |
| Commit and Pull Request Checks (109-133) | §4 Git Hooks (195-214) | README:199 checked OK-VERIFIED; PR-side checks deferred |
| Spec Folder Questions (137-141) | §5 Gate 3 wording | deferred |
| Deep Loop Modes (145-167) | §6 Deep Loop (556-656); §9 agents (988-996); §11 command library (1072+) | README:562 checked OK-VERIFIED; no retired names (grep 0 hits); review "Case" line -> §6 (637-644) deferred |
| Follow-Up Fixes (171-199) | §11/§14 doctor surfaces | deferred |
| Deep Review Fixes (203-229) | internal tooling | no README claim expected |
| Tooling Changes (233-281) | §5/§14 (script usage errors) | deferred |
| Code Skill (285-317) | §8 Skill Library (774-930) | deferred |
| Agents and Repo Rules (321-329) | §9 Agent Library (931-999) | deferred |
| Hooks and Dispatch Guards (333-341) | §14 Off Switches (1464-1477); hooks README (1068, 1473) | deferred |
| Skill Routing (345-361) | §7 Skill Advisor (659-773); §16 (1592) | deferred |
| Skill Authoring (365-397) | §8; §16 catalog/playbook links (1596-1597) | link targets checked OK-VERIFIED; content checks deferred |
| Install and First Use (401-413) | §4 Quick Start (154-246) | 5 rows checked OK-VERIFIED (below) |
| Upgrade Notes (417-452) | §4 (Node 24, build after pull); §10 (ClickUp) | Node 24 OK-VERIFIED; ClickUp contradiction found (finding below) |

## Findings

| README path:line | Claim as written | Evidence | Class | Severity | Smallest proposed fix |
|---|---|---|---|---|---|
| README.md:562 | "Three loop families (research, review and AI council) live as nested mode packets inside one parent skill, `system-deep-loop`" | [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:149] ("system-deep-loop now routes three modes: research, review and AI Council"); grep `agent-improvement\|model-benchmark` over README.md -> 0 matches | OK-VERIFIED | P2 | none |
| README.md:160 | "Node.js 24.x for a full install ... Node 24 is the one line every part accepts" | [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:405] ("The README now asks for Node 24, the one line every part accepts"); [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:444] | OK-VERIFIED | P2 | none |
| README.md:172-173 | "# 3. Build the spec-kit workspace. The runtimes' session hooks and the agent mirror check load this build" | [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:405] ("A new step builds the spec-kit workspace, which the session hooks and the agent mirror check load"); [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:449] | OK-VERIFIED | P2 | none |
| README.md:175 | "# 4. ... Run it after step 2: the advisor build compiles against the types step 2 installs" | [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:405] ("The advisor build step says to run it after the dependency install, because it compiles against the types that install brings") | OK-VERIFIED | P2 | none |
| README.md:181-182 | "# 5. Let the git hooks run their checks in this clone ... `git config --local skilled.trustRepoHooks true`" | [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:405] ("A last step sets `skilled.trustRepoHooks`, so a second clone on the same machine runs its pre-commit checks") | OK-VERIFIED | P2 | none |
| README.md:218-224 | "Open your project directory in any of the seven supported runtimes: OpenCode, Claude Code, Codex, Cursor, Devin, Pi or Hermes" + per-runtime `/speckit:complete` spellings | [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:405] ("First Use names all seven runtimes and how each one spells `/speckit:complete`") | OK-VERIFIED | P2 | none |
| README.md:199 | pre-commit "blocks a staged phrase that carries a template default or editor fallback" | [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:113] ("A template-default or editor-fallback phrase blocks the commit, and the block message names the bypass") | OK-VERIFIED | P2 | none |
| README.md:176 | "Code Mode needs its own server build, see the mcp-code-mode install guide." (plain text, no link) | `.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md` exists (find `**/install*.md` output) | OK-VERIFIED | P2 | optional addition: make it a link -- `[mcp-code-mode install guide](.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md)` |
| README.md:1596-1597 | Links to the feature catalog and the manual testing playbook | `ls -d` resolved both: `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md`, `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | OK-VERIFIED | P2 | none |
| README.md:1435 | "`mcp-click-up` (ClickUp task management via cupt CLI + official MCP, requires `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID`)" | Contradicts README.md:1336 ("`clickup_official` ... No env var needed, the first launch asks for one OAuth approval in the browser") and [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:38] ("its API-key lines left `.env.example`") and [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:421] ("The old ClickUp key lines in your own `.env` are unused and safe to delete") | STALE | P1 | Drop "requires `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID`" (or align with line 1336's wording) -- verify first whether the cupt CLI path still needs a key (iteration 2) |
| `.skilled/README.md` (topic example) | The research topic lists `.skilled/README.md` as a related README | Brace-pattern find returned 7 of 8 paths, `.skilled/README.md` absent; `ls -d .skilled/README.md` -> `No such file or directory` | WRONG (topic premise, not a README claim) | P2 | Inventory correction: the related set is the linked READMEs (A), the hub READMEs (B) and the install guides (C); there is no `.skilled/README.md` |
| `spec/README.md` (named in [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:65]) | "The `spec/` README explains how to restore from the manifest" | `ls -d spec/README.md` -> `No such file or directory` at repo root | MISSING (at the checked path; actual location unresolved) | P2 | Iteration 2: locate the restore README (check `specs/` and the spec-kit skill tree) before proposing wording anywhere |

Note: every row above was checked by opening the cited lines or running the cited command in this iteration. The ClickUp row is the one true defect so far; its exact fix wording depends on the cupt CLI question recorded under Recommended Next Focus.

## Questions Answered

- Q1: Which READMEs are related to the root README.md (linked from it, or documenting the same setup or features, or touched by v4.0.0.4), built from links and grep rather than guesses? -- answered by the inventory above (sections A-C) with the exclusion rule in section D.

## Questions Remaining

- Q2: Do the root README install, prerequisites (Node 24), first-use and setup statements match the v4.0.0.4 install changes and the repository?
- Q3: Do the root README statements on features (deep-loop modes, skill hubs, routing and the advisor, hooks, code review output, scripts refusing unknown options, per-doc versions, playbook and catalog checks, CI gates) match v4.0.0.4 and the repository?
- Q4: Which statements in the related READMEs are stale, missing or wrong against v4.0.0.4 and the repository?
- Q5: Which v4.0.0.4 user-facing changes do the READMEs leave out where a reader would need them, and which README statements were checked and found accurate?

## Ruled Out

- Repo-wide `**/README.md` sweep as the inventory source: the find returns more than 100 paths, dominated by benchmark-report and fixture READMEs; the related set was built from root-README links plus the topic-named hubs instead.

## Dead Ends

- None this iteration. (The retired-mode name search is not a dead end: 0 hits is the verified absence that confirms README:562.)

## Edge Cases

- Ambiguous input: none material. The topic's example `.skilled/README.md` does not exist; handled as a finding, not as an ambiguity.
- Contradictory evidence: README.md:1336 vs README.md:1435 on ClickUp env vars -- recorded with both sides cited, classified STALE against [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:38] and [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:421]; resolution pending the cupt CLI check.
- Missing dependencies: none (all state files present; gateway not yet called at write time of this section).
- Partial success: none -- all planned actions completed.

## Sources Consulted

- [SOURCE: README.md:160], [SOURCE: README.md:172], [SOURCE: README.md:175], [SOURCE: README.md:176], [SOURCE: README.md:181], [SOURCE: README.md:199], [SOURCE: README.md:214], [SOURCE: README.md:218], [SOURCE: README.md:524], [SOURCE: README.md:562], [SOURCE: README.md:655], [SOURCE: README.md:770], [SOURCE: README.md:1068], [SOURCE: README.md:1336], [SOURCE: README.md:1435], [SOURCE: README.md:1473], [SOURCE: README.md:1476], [SOURCE: README.md:1588], [SOURCE: README.md:1596], [SOURCE: README.md:1597], [SOURCE: README.md:1598], [SOURCE: README.md:1600]
- [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:38], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:65], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:113], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:149], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:389], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:405], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:421], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:425], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:444], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:449]
- Command outputs: grep `\]\([^h][^)]*\)` on README.md (35 matches); grep `agent-improvement|model-benchmark` on README.md (0 matches); grep `clickup` on README.md (5 matches); `ls -d` link-target check (23 paths printed, 2 errors); find `.skilled/{README.md,skills/sk-doc/README.md,...}` (7 paths); find `**/install*.md` under `.skilled/` (23 paths, 11 standalone guides)
- specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/deep-research-config.json; deep-research-state.jsonl; deep-research-strategy.md

## Assessment

- New information ratio: 0.65
- Questions addressed: Q1
- Questions answered: Q1

## Reflection

- What worked and why: deriving the related set from the README's own links plus an existence find produced a bounded, evidence-backed list instead of a guess; the one-command `ls -d` resolution check turned link verification into a single verifiable step; reading the full changelog before checking claims made the map complete and the claim checks targeted.
- What did not work and why: the repo-wide README find saturates at its 100-result cap and is dominated by report artifacts, so it cannot serve as the inventory source; the `spec/` README reference in the changelog has no root-level path, so its location needs a targeted search next.
- What I would do differently: resolve the `spec/` README location inside this iteration by searching the spec-kit tree directly, and add the cupt CLI key question to the same batch.

## Recommended Next Focus

Iteration 2: (1) locate the `spec/` restore README the changelog names (search `specs/` and `.skilled/skills/system-spec-kit/**`); (2) confirm whether `mcp-click-up`'s cupt CLI still needs `CLICKUP_API_KEY`/`CLICKUP_TEAM_ID` (read `.skilled/skills/mcp-tooling/mcp-click-up/` docs and `.env.example`) to finalize the ClickUp fix wording; (3) start Q2 by walking the §4 install path against the repository: each `npm --prefix` target's `package.json` scripts, the Verify Installation grep list ([SOURCE: README.md:189]) against the real runtime config files, and [SOURCE: README.md:1476] against `.env.example`'s actual contents.

## SCOPE VIOLATIONS

None.
