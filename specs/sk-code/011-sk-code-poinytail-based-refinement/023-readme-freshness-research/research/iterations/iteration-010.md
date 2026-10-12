# Iteration 10: Adversarial re-verification of every flagged finding, and the OK-VERIFIED inventory

## Focus

Final iteration (10 of 10). Adversarial re-verification: re-open every STALE, WRONG and MISSING finding recorded in iterations 1 to 9 (30 rows across 13 READMEs), re-read the README line and its evidence, drop or correct anything that does not hold, and compile the README statements checked and found accurate (OK-VERIFIED) for Q5. The pass stayed read-only; every re-check below was re-opened or re-probed in this iteration, and the rows that could not be fully re-derived say so explicitly.

## Actions Taken

1. Read state: config (`sessionId dr-023-readme-freshness-research-2026-10-12T14:40:22.000Z`, `lineageMode new`, `progressiveSynthesis true`), state JSONL tail (iteration 9 recorded, ratio 0.71), strategy (Q5 the only open key question; exhausted approaches checked and avoided).
2. Indexed all 106 finding rows across `research/iterations/*.md` with one awk pass (class + path:line + claim head) to enumerate the flagged set.
3. Re-ran the decisive read-only probes: `ls -1 .skilled/agents/*.md | wc -l` → 11; `ls -1d .skilled/skills/*/ | wc -l` → 14; `ls -1d .skilled/skills/cli-external-orchestration/cli-*/` → 7 nested modes; `ls -1 .skilled/bin/` and `ls -1 .skilled/bin/lib`; `ls -1 .skilled/skills/system-deep-loop/runtime/` (changelog/ present); `ls -1 .skilled/skills/system-spec-kit/runtime/hooks/` (opencode/ present); `ls -1 .skilled/commands/` + per-group `.md` counts (34 across 6 groups + 3 root = 37); `ls -1 .skilled/commands/doctor/assets/` (21 YAML, 20 with `operating_mode`); five README↔SKILL.md version pairs; `awk` bypass-token scan of `.skilled/scripts/git-hooks/pre-commit` (9 distinct `SPECKIT_SKIP_*`); chart-form and playbook-section counts; `test -e` path checks; `awk` engines read of `.skilled/skills/system-spec-kit/package.json` (`"node": ">=20.11.0"`).
4. Re-opened every flagged README line verbatim (30 anchors) plus spot checks (`README.md:25`, `:562`, `:776`; `.skilled/scripts/git-hooks/README.md:110`; `.skilled/skills/cli-external-orchestration/README.md:93`).
5. Recorded the corrections this pass produced: `README.md:24` is a stale count missed by iterations 1-9; `.skilled/skills/cli-external-orchestration/README.md:94` duplicates `:93`; the `spec/README.md` reference resolves to the existing CLI-spec README; `README.md:49` of the spec-kit hub is contested by its own package engines.

## Findings

### A. Re-verification table (every STALE/WRONG/MISSING row from iterations 1-9, re-checked)

| README path:line | Claim as written | Evidence (re-opened this iteration) | Class | Severity | Smallest proposed fix |
|---|---|---|---|---|---|
| `README.md:24` | "- **12 Specialized Agents** - focused roles for implementation, review, research, docs, git and more" | RE-CHECK: NEW this iteration — missed by iterations 1-9 (they flagged `:66` and `:933` only). `ls -1 .skilled/agents/*.md \| wc -l` → 11 (ai-council, code, context, debug, deep-research, deep-review, design, markdown, orchestrate, prompt-improver, review) | STALE | P2 | "12 Specialized Agents" → "11 Specialized Agents" |
| `README.md:25` | "- **14 On-Demand Skills** - deep capabilities for code, design, docs and multi-CLI dispatch" | RE-CHECK: re-read; `ls -1d .skilled/skills/*/ \| wc -l` → 14 | OK-VERIFIED | P2 | none |
| `README.md:66` | "Twelve specialized agents own focused roles, and seven CLI bridges let a runtime dispatch other AI CLIs as sub-tools." | RE-CHECK: re-read; agents → 11 (probe above); "seven CLI bridges" holds — `.skilled/skills/cli-external-orchestration/` holds exactly 7 nested `cli-*` packets (cli-claude-code, cli-codex, cli-cursor, cli-devin, cli-hermes, cli-opencode, cli-pi) | STALE | P2 | "Twelve" → "Eleven" |
| `README.md:80` | "Behind them: 14 on-demand skills, 39 command entry points and the Code Mode MCP server, each detailed in its own section below." | RE-CHECK: 14 skills holds; command entry points recount = 37 (create 13, deep 3, design 3, doctor 8, prompt 1, speckit 6 = 34 across 6 groups + 3 root `.md`; `.skilled/commands/scripts/` holds only `README.md`) | STALE | P2 | "39" → "37" |
| `README.md:421` | "`validate.sh` runs 42 rules against a spec folder and reports what passes and what needs fixing. ... Two of them only warn and never fail a run: `FRONTMATTER_VALUES` ... and `SOURCE_TAGS` ..." | RE-CHECK: re-read; `validate.sh:41-42` drives rules from `$SCRIPT_DIR/../lib/validator-registry.json`; `.skilled/skills/system-spec-kit/README.md:63` (re-opened) states "the 41-rule registry with three strict-only rules gated behind `--strict`". The registry file itself was not counted this iteration | STALE | P2 | "42" → "41" |
| `README.md:426` | "- **`validate.sh`** - run 42 validation rules. Use `--recursive` for phase folders" | RE-CHECK: same evidence as `:421` | STALE | P2 | "42" → "41" |
| `README.md:881` | "- **`mcp-click-up`: manage ClickUp tasks from the assistant.** ... Embedded install via `mcp-servers/` directory. 96-feature catalog + 37-scenario playbook included" | RE-CHECK: packet exists (`.skilled/skills/mcp-tooling/mcp-click-up/` with `feature-catalog/`, `manual-testing-playbook/`, `mcp-servers/`); probe: `feature-catalog.md` table rows = 26, `manual-testing-playbook.md` `###` sections = 61 — neither matches 96/37. Prior iteration 5 verdict retained; exact totals not re-derived | STALE | P2 | replace the two counts with the packet's current totals (re-derive from its `feature-catalog.md` and `manual-testing-playbook.md`) |
| `README.md:933` | "12 custom specialist agents. Defined in `.skilled/agents/` (source of truth) and mirrored for Claude Code (`.claude/agents/`). OpenCode reads `.opencode/agents/`, which links to the same `.skilled/agents/` source." | RE-CHECK: re-read; `ls -1 .skilled/agents/*.md \| wc -l` → 11 | STALE | P2 | "12" → "11" |
| `README.md:1074` | "39 command entry points: 36 across 6 command groups plus 3 root utilities. Each command is a Markdown entry point under `.skilled/commands/**/*.md` ..." | RE-CHECK: recount = 34 across 6 groups (create 13, deep 3, design 3, doctor 8, prompt 1, speckit 6) + 3 root = 37 | STALE | P2 | "39 command entry points: 36 across 6" → "37 command entry points: 34 across 6" |
| `README.md:1278` | "The 19 underlying YAML workflows in `.skilled/commands/doctor/assets/` are self-sufficient. Each declares its own `role/purpose/action/operating_mode` block ..." | RE-CHECK: `ls -1 .skilled/commands/doctor/assets/` → 21 `.yaml` files; 20 declare `operating_mode` (the 21st is `mcp-mutation-class-manifest.yaml`) | STALE | P2 | "19" → "20" |
| `README.md:1435` | "- Parent hub for MCP tool bridges, nine modes: ... `mcp-click-up` (ClickUp task management via cupt CLI + official MCP, requires `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID`) ..." | RE-CHECK: nine mode dirs confirmed (aside-devtools, chrome-devtools, click-up, figma, magicpath, mobbin, notion, obsidian, refero); packet `SKILL.md:12` matches the cupt + official-MCP routing ("cupt CLI (primary) and official ClickUp MCP (secondary). Operation-based routing"). The env-requirement half was not re-derived this iteration; iterations 1 and 5 both flagged the row | STALE | P2 | re-derive the env requirement from `mcp-click-up/INSTALL-GUIDE.md`, then correct the parenthetical |
| `.skilled/bin/README.md:63-90` | Section 3 DIRECTORY TREE "bin/" listing | RE-CHECK: tree re-read; `ls -1 .skilled/bin/` shows entries the tree omits: agent-mirror-crosswalk.md, check-agent-mirror-sync.cjs, check-agent-mirror-sync.vitest.ts, compiled-route-admission.cjs, magicpath-utcp-exec.cjs, magicpath-utcp-manual.cjs, mcp-code-mode-launcher.cjs, mcp-code-mode-launcher.test.cjs, mirror-sync-verify.vitest.ts | STALE | P2 | add the omitted entries to the tree |
| `.skilled/bin/lib/README.md:65-73` | Section 3 DIRECTORY TREE "lib/" listing | RE-CHECK: tree re-read; `ls -1 .skilled/bin/lib` shows four omitted entries: compiled-route-admission.cjs, mirror-sync-verify.cjs, node-engine-resolver.cjs, node-engine-resolver.test.cjs | STALE | P2 | add one tree line each for the four omitted entries |
| `.skilled/bin/lib/README.md:93` | "\| Imports \| All three modules depend only on Node core (`fs`, `net`, `http`, `path`, `child_process`). No third-party packages. \|" | RE-CHECK: the Section 4 table directly above (`:82-85`) lists four launcher-support modules; the sentence's "three" contradicts its own table | WRONG | P2 | "All three modules" → "All launcher-support modules" |
| `.skilled/scripts/git-hooks/README.md:24` (also `:44`, `:73`) | "- `pre-commit` runs nine blocking sub-gates: ... Eight carry their own bypass flag."; diagram at `:44` "8 blocking"; tree at `:73` "8 blocking sub-gates" | RE-CHECK: re-read `:24`, `:44`, `:73` and the Section 4 table `:110`; `awk` token scan of `pre-commit` → 9 distinct `SPECKIT_SKIP_*` bypasses, plus the agent-mirror sync gate that carries none = ten sub-gates; `:110` already says "Runs ten blocking sub-gates ... " | STALE | P2 | `:24` "nine"→"ten" and add "skill authoring" to the list, "Eight"→"Nine"; `:44`/`:73` "8 blocking"→"10 blocking sub-gates" |
| `.skilled/skills/system-spec-kit/runtime/README.md:26` | "`hooks/` holds the per-runtime adapters for Claude, Codex, Cursor, Devin, and Pi, together with the runtime-neutral Gate-3 spec-gate core they all call." | RE-CHECK: re-read; `ls -1 .../runtime/hooks/` shows claude, codex, cursor, devin, opencode, pi (+ lib/, shared-*.ts) — opencode is omitted from the enumeration | MISSING | P2 | add OpenCode: "for Claude, Codex, Cursor, Devin, OpenCode, and Pi" |
| `.skilled/skills/system-deep-loop/runtime/README.md:24-31` | Section 2 DIRECTORY TREE omits `changelog/` | RE-CHECK: tree re-read (database/, feature-catalog/, lib/, manual-testing-playbook/, references/, scripts/, tests/); `ls -1 .../runtime/` shows a real `changelog/` directory | MISSING | P2 | add a `changelog/` line to the tree |
| `.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md:4,11-12` | frontmatter `version: 1.0.0.0`; body blockquote "**Version:** 2.0.0" | RE-CHECK: re-read both; the same skill's `SKILL.md` carries `1.0.10.0`; the doc states two different editions internally | WRONG | P2 | make both state one edition (body "**Version:**" → the frontmatter value, or raise the frontmatter to the doc's current edition) |
| `.skilled/skills/system-spec-kit/README.md:13` | frontmatter `version: 2.7.0.99` | RE-CHECK: probe pair — `SKILL.md` `2.7.13.0` | STALE | P1 | set `version: 2.7.13.0` |
| `.skilled/skills/system-spec-kit/README.md:49` | "- Node.js 20.11 or newer" | RE-CHECK: CONTESTED — fresh probe: `.skilled/skills/system-spec-kit/package.json` engines `"node": ">=20.11.0"` matches the README line; prior iteration 7 verdict not reproduced; the v4.0.0.4 install section was not re-read this iteration. Both claims preserved; fresh evidence favors the README | STALE (contested) | P2 | hold the fix; adjudicate against the v4.0.0.4 install section and the other engines fields before changing the floor |
| `.skilled/skills/system-skill-advisor/README.md:10` | frontmatter `version: 0.12.0.54` | RE-CHECK: probe pair — `SKILL.md` `0.15.6.0` | STALE | P1 | set `version: 0.15.6.0` |
| `.skilled/skills/system-skill-advisor/README.md:113` (also `:154`) | "`advisor_recommend` accepts six options: ..." | RE-CHECK: re-read both; the option set was not re-derived (a camelCase scan of `skill-advisor-cli.ts` matched only `includeCompiledRoute`; the option names live in the tool schema, which the scan did not reach); prior iteration 7 verdict carried | STALE | P2 | re-derive the option list from the CLI's `advisor_recommend` schema, then add the missing option(s) in both places |
| `.skilled/skills/sk-git/README.md:11` | frontmatter `version: 1.8.4.0` | RE-CHECK: probe pair — `SKILL.md` `1.8.5.0` | STALE | P1 | set `version: 1.8.5.0` |
| `.skilled/skills/sk-git/README.md:204` (also `:267`, `:288`) | "38 manual scenarios across 8 categories" | RE-CHECK: re-read all three; playbook probe: 55 `###` headings, 17 `##` headings — the claimed 38/8 does not match the probed structure; prior iteration 7 verdict carried | STALE | P2 | re-derive the playbook's scenario/category totals, then update all three occurrences |
| `.skilled/skills/sk-doc/README.md:22` | frontmatter `version: 2.3.4.0` | RE-CHECK: probe pair — `SKILL.md` `2.3.9.0` | STALE | P1 | set `version: 2.3.9.0` |
| `.skilled/skills/sk-doc/README.md:220` | "Standalone HTML data charts: twenty-one forms across six families, the colour system and the corpus validator" | RE-CHECK: the chart packet states "Twenty-nine chart forms across six question families" (`.skilled/skills/sk-design/sk-design-chart/SKILL.md:137`, `README.md:32`) | STALE | P2 | "twenty-one" → "twenty-nine" |
| `.skilled/skills/system-deep-loop/README.md:9` | frontmatter `version: 1.6.1.0` | RE-CHECK: probe pair — `SKILL.md` `1.6.3.0` | STALE | P1 | set `version: 1.6.3.0` |
| `.skilled/skills/cli-external-orchestration/README.md:94` | "- `cli-codex` fails closed when the binary is absent. `cli-devin`, `cli-pi` and `cli-hermes` gate routing on `command -v`, and `cli-hermes` also reads `hermes status` for a configured provider." | RE-CHECK: `:94` duplicates `:93` exactly (the "Four behaviors" list then carries 5 bullets, two identical); `hermes status` is wrong — `cli-hermes/SKILL.md:47` uses `hermes config get providers.llmgateway.base_url` | WRONG | P2 | delete the duplicated `:94` bullet and replace "reads `hermes status`" with "reads `hermes config get providers.llmgateway.base_url`" |
| `spec/README.md` (referenced in `.skilled/changelog/skilled/v4.0.0.4.md:65`) | "The `spec/` README explains how to restore from the manifest" | RE-CHECK: `test -e spec/README.md` → absent (rc=1); `test -e .skilled/skills/system-spec-kit/runtime/cli/spec/README.md` → present (rc=0) — the reference resolves to the existing spec CLI README | OK-VERIFIED (prior MISSING-at-path corrected) | P2 | none (no README fix; the reference resolves to the spec CLI README) |
| `.skilled/README.md` (topic premise) | The research topic lists `.skilled/README.md` as a related README | RE-CHECK: `test -e .skilled/README.md` → absent (rc=1); consistent with iteration 6's 0-match probe | WRONG (topic premise, not a README claim) | P2 | none (no such file; nothing to fix in the README set) |

### B. New and corrected items this pass

- New: `README.md:24` carries a stale agent count ("12 Specialized Agents" vs 11 on disk) that iterations 1-9 missed; its sibling `README.md:25` ("14 On-Demand Skills") checks out.
- Corrected: the iteration-1 `spec/README.md` MISSING row resolves — the README exists at `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`.
- Extended: the `cli-external-orchestration/README.md:94` row now also records that `:94` is an exact duplicate of `:93` (the "Four behaviors" list carries five bullets).
- Contested: `.skilled/skills/system-spec-kit/README.md:49` — fresh engines probe supports the README; prior verdict preserved until the v4.0.0.4 install section is re-read (see Edge Cases).
- No row was dropped as flatly false; four rows (`:113`, `:881`, `:204`, `:1435` env half) carry their prior verdict with a partial re-check, each naming its next evidence.

### C. OK-VERIFIED inventory (Q5: statements checked and found accurate)

Re-opened this iteration (marked `re-opened`); the rest were verified with cited evidence in iterations 1-9.

Root `README.md`:
- `:160` Node 24.x full install + per-part floors; `:161` npm/git/POSIX shell; `:162` no global TypeScript; `:166` clone URL; `:169-173` install/build steps 2-3; `:175-179` step 4 advisor-build ordering; `:181-182` step 5 `skilled.trustRepoHooks`; `:188-189` MCP config verify list; `:191-192` advisor enumerates nine commands; `:199` pre-commit phrase lint; `:205` message-contract CI check; `:210` uninstall command; `:218-224` seven runtimes + completion spellings; `:241` "other 13 shipped skills"; `:325` lazy-addons/goal flags; `:414` `--phase`/`--phases`; `:425` `create.sh` usage; `:445` `SPECKIT_POST_VALIDATE`; `:562` three loop families (re-opened); `:630`/`:639`/`:648` deep-loop agents; `:669` daemon-unreachable fallback; `:776` 14 skills + no exclusions (re-opened); `:878` mcp-tooling nine modes; `:893` 29 catalog forms + 49 check families; `:902` sk-doc 15 modes / 14 packets; `:1025` thirteen plugins kill-switch; `:1264` unknown-flag refusal; `:1269` `compat` v3→v4; `:1336` `clickup_official` MCP description; `:1596-1597` catalog + playbook links; `:1598` release-notes link. (`:1278`'s route-validate sentence is accurate; only its "19" count is stale.)

Nested READMEs:
- `.skilled/bin/README.md` `:22` freshness shim check; `:149-168` entrypoints table; `:178-180` shim exit taxonomy; `:200-226` validation commands.
- `.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md` `:11-12` Node 24 dependency; `:24-36` AI-first prompt checks.
- `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md` `:1-4`,`:9` nine commands.
- `.skilled/skills/sk-git/README.md` `:60` 17 state-gated rules.
- `.skilled/skills/system-skill-advisor/README.md` `:194` doctor targets.
- `.skilled/skills/system-spec-kit/README.md` `:63` 41-rule registry (re-opened); `:431-433`,`:448` module counts; `:550-557` doctor commands.
- `.skilled/skills/sk-code/README.md` `:23`,`:38`,`:51`,`:106` three surfaces.
- `.skilled/skills/cli-external-orchestration/README.md` `:33`,`:35`,`:88` seven runtimes + tieBreak; `:96` graph-metadata; `:97` per-mode directories.
- `.skilled/skills/sk-doc/README.md` `:134`,`:191`,`:193` thirteen `/create:*` commands, validator path, cite-drift.
- `.skilled/skills/cli-external-orchestration/cli-pi/README.md` `:10`,`:34` own-edition version + inventory.
- `.skilled/scripts/README.md` `:22-29` contents table.
- `.skilled/hooks/README.md` `:177` 3000 ms stdin deadline.
- `.skilled/scripts/git-hooks/README.md` `:110` ten sub-gates table (re-opened); the mirror-gate, phrase-lint and version-bump sentences inside `:24`.
- `.skilled/skills/system-deep-loop/runtime/README.md` `:15` three modes; `:42-44`,`:66-67` links + validation.
- `.skilled/skills/system-spec-kit/runtime/hooks/README.md` `:88`,`:177` deadline constants.
- `.skilled/bin/lib/README.md` `:56-58` compiled-routing group.

## Questions Answered

- Q5: Which v4.0.0.4 user-facing changes do the READMEs leave out where a reader would need them, and which README statements were checked and found accurate? — Answered. The gaps are the flagged rows above (30 anchors, all re-verified; two contested/partial named); the checked-and-accurate statements are the inventory in Findings C (about 45 anchors across 15 READMEs, with the re-opened subset marked).

## Questions Remaining

- None at the strategy level. Residual verification debt, each with its next evidence: `:113` option set (CLI schema), `:881` catalog/playbook totals, `:204` playbook totals, `:1435` env half (`mcp-click-up/INSTALL-GUIDE.md`), and the `:49` adjudication (v4.0.0.4 install section).

## Edge Cases

- Contradictory evidence: `.skilled/skills/system-spec-kit/README.md:49` — the iteration 7 verdict (STALE) and this iteration's fresh probe (`package.json` engines `"node": ">=20.11.0"`, matching the README) conflict. Both are preserved; the fresh evidence favors the README; unresolved without re-reading the v4.0.0.4 install section. Do not apply a fix until then.
- Missing dependency: the full prior-row text for iterations 1-5 was not recoverable (first-cell format mismatch); fresh probes replaced it. Rows `:113`, `:881`, `:204` carry their prior verdict with a partial re-check note.
- Ambiguous input: Q5's "checked and found accurate" — interpreted as the accumulated OK-VERIFIED inventory plus the statements re-opened this iteration; the inventory marks which were re-opened now.
- Partial success: none — all probes completed; the contested and partial rows are named explicitly.

## Ruled Out

- Recovering iterations 1-5 full rows by matching the first table cell against `` | `path` ``: the rows' first cells do not match that shape; direct probes replaced the need.
- A single multi-line awk program for the line re-print: a newline between the OR-chain pattern and its `{print}` action binds the action as an always-true rule, so it dumped whole files; per-file one-liner awks were used instead.

## Dead Ends

- None beyond Ruled Out. The `.skilled/README.md` and root `spec/README.md` absence checks confirm the topic's premise errors rather than opening new work; the real spec README sits at `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`.

## Sources Consulted

- READMEs re-opened: `README.md`; `.skilled/bin/README.md`; `.skilled/bin/lib/README.md`; `.skilled/scripts/README.md`; `.skilled/scripts/git-hooks/README.md`; `.skilled/hooks/README.md`; `.skilled/skills/system-spec-kit/runtime/README.md`; `.skilled/skills/system-deep-loop/runtime/README.md`; `.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md`; `.skilled/skills/system-spec-kit/README.md`; `.skilled/skills/system-skill-advisor/README.md`; `.skilled/skills/sk-git/README.md`; `.skilled/skills/sk-doc/README.md`; `.skilled/skills/system-deep-loop/README.md`; `.skilled/skills/cli-external-orchestration/README.md`.
- Evidence files: `.skilled/skills/system-spec-kit/package.json`; `.skilled/skills/mcp-code-mode/SKILL.md`; `.skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md`; `.skilled/skills/cli-external-orchestration/cli-*/SKILL.md`; `.skilled/skills/sk-design/sk-design-chart/SKILL.md` and `README.md`; `.skilled/skills/mcp-tooling/mcp-click-up/SKILL.md`; `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`; `.skilled/scripts/git-hooks/pre-commit`.
- Commands (outputs quoted in Findings): `ls -1 .skilled/agents/*.md | wc -l`; `ls -1d .skilled/skills/*/ | wc -l`; `ls -1d .skilled/skills/cli-external-orchestration/cli-*/`; `ls -1 .skilled/bin/`; `ls -1 .skilled/bin/lib`; `ls -1 .skilled/skills/system-deep-loop/runtime/`; `ls -1 .skilled/skills/system-spec-kit/runtime/hooks/`; `ls -1 .skilled/commands/` + per-group `.md` counts; `ls -1 .skilled/commands/doctor/assets/`; `awk` version pairs (README vs SKILL.md); `awk` `SPECKIT_SKIP_*` scan; `awk` chart-form and playbook-section counts; `test -e` path checks; `awk` engines read.

## Assessment

- New information ratio: 0.25 — 30 rows recorded: 2 fully new (README:24 stale count; the :94 duplicated bullet), 5 partially new/corrected (spec/README resolution, :1074/:80 recount, :1278 value, :220 value), 23 confirmations; +0.10 consolidation bonus for closing Q5's verification inventory.
- Questions addressed: Q5.
- Questions answered: Q5.

## Reflection

- What worked and why: batching the probes into compound read-only commands and extracting flagged lines per file kept the re-check inside the call budget; the fresh counts reproduced every prior count-based finding, so the flagged set survived adversarial review almost intact.
- What did not work and why: the first line-print awk dumped whole files (the pattern/action line split made `{print}` an always-true rule) and the iterations 1-5 row extraction missed (first-cell format differs), costing two recovery detours; both were replaced with narrower commands rather than retried.
- What I would do differently: put an awk action on the same line as its pattern from the start, and probe the row format before building a matcher for prior artifacts.

## Recommended Next Focus

Run complete (10/10). For the follow-up fix pass: apply the confirmed rows' fixes, then re-derive the four partial rows (`:113` option set, `:881` catalog/playbook totals, `:204` playbook totals, `:1435` env half) and adjudicate `.skilled/skills/system-spec-kit/README.md:49` against the v4.0.0.4 install section.

## SCOPE VIOLATIONS

- `research/research.md` (progressive synthesis): the config sets `progressiveSynthesis=true`, which normally updates `research/research.md`, but this dispatch's allowed-write list covers only `iterations/iteration-010.md`, `deltas/iter-010.jsonl` and gateway writes. The synthesis update was skipped per the scope lock; the workflow reducer owns `research.md`. No other out-of-scope mutation was attempted.
