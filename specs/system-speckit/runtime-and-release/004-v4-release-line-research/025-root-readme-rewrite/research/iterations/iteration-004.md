# Iteration 4: Q2 Close-Out — CLI Executors, MCP/Code Mode, Doctor Family, and a Registry-Shape Correction

## Focus

The dispatch focus was a stale copy of iteration 1's carried-forward residual: "read `.skilled/changelog/skilled/v4.0.1.0.md` and `.skilled/changelog/skilled/v4.0.2.0.md`; obtain a bounded `git diff --stat` for `v4.0.0.0..v4.0.1.0`; confirm which spec packets closed in each range."

Every part of that is already done and recorded, and two of the three parts are on the strategy's own EXHAUSTED APPROACHES list. Verified before choosing a different focus:

- Both release notes were read in full in iteration 2; its findings 1, 7 and 10 carry the release narratives and the authoritative `> Spec folders:` closure lists (9 packets for `v4.0.1.0`, 10 for `v4.0.2.0`, roughly 25 for `v4.0.2.1`).
- `git diff --stat` on the early range is blocked by rename detection, and a bounded measurement already exists: `v4.0.0.0..v4.0.1.0` is 142,262 files with +6,451,293 / -16,124,638, dominated by deleted spec archives.
- Q1 is marked `[x]` in the strategy's key-questions list and appears in ANSWERED QUESTIONS; the Next Focus section still naming Q1 is reducer lag, the same ambiguity iteration 3 recorded.

Interpretation chosen: finish Q2, which iteration 3 opened and explicitly handed forward — "what is missing is ... the MCP and Code Mode surface, the doctor command family, and the per-runtime CLI executor list." That is the first unchecked key question, it is not on the exhausted list, and it is what a README's "what it does" section actually needs. Deferred: literal re-execution of the Q1 residual, which would spend an iteration on work already on disk.

## Actions Taken

1. `rg -n "^[0-9]+\. \*\*"` over `iteration-002.md` plus a `closed` count — verified on disk that iteration 2's closure lists exist before declaring the dispatch focus redundant.
2. `jq` over all seven `mode-registry.json` files: `.modes|type` and `.modes|length`, plus `keys_unsorted` on `sk-code` — probed the registry shape directly instead of trusting the prior description.
3. Read `.skilled/skills/cli-external-orchestration/mode-registry.json` in full (271 lines) — the eight CLI executor modes, their discriminators and their command bindings.
4. Read `.skilled/skills/mcp-tooling/mode-registry.json` in full (336 lines) — the eight MCP modes, the workflow/transport split and the backend kinds.
5. Read `.skilled/skills/mcp-code-mode/SKILL.md:1-45` — the Code Mode contract, its four tools and its mandatory-use rule.
6. `ls .skilled/commands/doctor/*.md` — enumerated the doctor command family.
7. Per-group `fd -t f '\.md$' -d 1 | wc -l` over `.skilled/commands/*/` — the command breakdown that sums to 44.
8. `ls -d .skilled/skills/*/` — the 15 skill directories, re-read to split hubs from standalone skills.

## Findings

1. **The CLI executor surface is eight named workflow executors, and none of them is a slash command.** `.skilled/skills/cli-external-orchestration/mode-registry.json` declares `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`, `cli-deepseek-harness` and `cli-mistral-vibe`, every one `packetKind: workflow` and `backendKind: cli-dispatch`, with `command: null` throughout because "None of the eight modes has a dedicated command". A README that lists these as `/cli-opencode`-style commands would invent a surface that does not exist; they are advisor-routed by hub membership. [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:8] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:15]

2. **The `cli-` prefix spans three different homes, so a README cannot describe it as one family.** The `cli-jev` transport left this hub and is now the single mode of the `cli-classifier` hub, and `cli-orca` exists on disk as a standalone skill with no mode registry at all. The eight dispatch executors live in `cli-external-orchestration`; `cli-classifier` carries one transport mode; `cli-orca` is its own skill. [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:8] [INFERENCE: `ls -d .skilled/skills/*/` returning `cli-classifier`, `cli-external-orchestration` and `cli-orca`, combined with the seven registries counted in Action 2]

3. **The MCP surface is eight modes split five workflow / three read-only transport, across three backend kinds.** Workflow modes (`mcp-chrome-devtools`, `mcp-click-up`, `mcp-aside-devtools`, `mcp-obsidian`, `mcp-notion`) can mutate workflow state; transports (`mcp-figma`, `mcp-refero`, `mcp-mobbin`) are read-only in this workspace and hand their output to `sk-design-md-generator` for design-reference extraction. Backends are `cli-plus-mcp`, `code-mode-remote-mcp` and `figma-desktop-transport`. This is the shape a README's MCP section needs: it is not a flat list of eight tools, it is two kinds of mode with different mutation postures. [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:8] [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:9] [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:19]

4. **No MCP mode has a dedicated command either; `/doctor:mcp` is the separate install/debug router that covers every `mcp-*` skill.** The registry says so explicitly (`command:null on all, per ADR-006`). A README should present `/doctor:mcp` as the operational entry point and the eight modes as advisor-routed capabilities. [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:15]

5. **Code Mode is four tools, mandatory for all MCP tool calls, and the "~98% context reduction" figure is a self-claim in its own frontmatter, not a measurement.** The skill exposes `call_tool_chain`, `list_tools`, `search_tools` and `tool_info`; it states "MANDATORY for ALL MCP tool calls" and describes "200+ MCP tools through progressive disclosure". The 200+ and 98% numbers are the skill describing itself, so a README may attribute them ("Code Mode advertises ~98%...") but should not present them as independently verified. [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:3] [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:4] [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:12] [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:18]

6. **The doctor family is 17 commands, not the "ten setup commands" the v4.0.2.0 notes describe.** On disk `.skilled/commands/doctor/` holds `agents-md`, `ci`, `deep-loop`, `env`, `git`, `helper`, `install`, `mcp`, `overlay`, `runtime-mirrors`, `setup`, `sk-code`, `sk-skill`, `skill-advisor`, `speckit`, `symlink` and `update`. The release note's "ten" counts the setup commands `system-skilled-doctor` took ownership of; the family has since grown. A README should say 17 and cite the directory, not repeat the release-note count. [INFERENCE: `ls .skilled/commands/doctor/*.md` returning 17 files, Actions Taken 6]

7. **The 44 commands break down as doctor 17, create 13, speckit 8, design 3, deep 2, prompt 1.** The `assets/` and `scripts/` folders under `.skilled/commands/` hold no markdown, so the 44 figure counts command documents only. This turns a bare total into a table a README can print and a reader can verify. [INFERENCE: per-group `fd -t md -d 1 | wc -l` over `.skilled/commands/*/`, Actions Taken 7]

8. **Correction to the prior shape claim: `modes` is a JSON array in all seven registries, not an object keyed by numeric index.** `jq '.modes|type'` returns `array` for every one of the seven files, with lengths 1, 8, 8, 5, 3, 15 and 2 — the 42 total stands. Iteration 3 and the synthesis both recorded the shape as an object keyed `"0"`, `"1"`, …; that reading comes from `jq keys` on an array, which returns indices and looks like object keys. The practical warning survives unchanged (there is no `workflowModes` field, and a count probing one returns zero), but any script written against the "object" description would be wrong. [INFERENCE: `jq -r '.modes|type'` over all seven `mode-registry.json` files returning `array`, and `.modes|length` returning 1,8,8,5,3,15,2, Action 2] [SOURCE: .skilled/skills/sk-code/mode-registry.json:1]

9. **The eight CLI executors correspond by name to the eight runtime adapter folders — a clean one-to-one story the README can tell, with one caveat.** `cli-claude-code`↔`.claude`, `cli-codex`↔`.codex`, `cli-cursor`↔`.cursor`, `cli-devin`↔`.devin`, `cli-deepseek-harness`↔`.dsh`, `cli-opencode`↔`.opencode`, `cli-pi`↔`.pi`, `cli-mistral-vibe`↔`.vibe`. The caveat: no registry field declares this mapping, so it is a name correspondence, not a configured link. [INFERENCE: the eight `workflowMode` names in the CLI registry compared against the eight runtime folders verified in iteration 3]

10. **The 15 skills split 7 hubs with a mode registry and 8 standalone skills.** Hubs: `sk-doc`, `cli-external-orchestration`, `mcp-tooling`, `sk-code`, `sk-design`, `system-deep-loop`, `cli-classifier`. Standalone: `cli-orca`, `local-webflow`, `mcp-code-mode`, `sk-git`, `sk-prompt`, `system-skill-advisor`, `system-skilled-doctor`, `system-spec-kit`. A README skill table should carry that split, because "hub" is a routing concept and the eight standalone skills are not reachable through a mode registry. [INFERENCE: 15 skill directories minus the 7 carrying `mode-registry.json`, Actions Taken 2 and 8]

11. **The two agent directories do not agree, and the canonical one undercounts the Claude Code surface by one.** `.skilled/agents/` holds 11 agent documents plus `agent-registry.json` and `README.txt`; `.claude/agents/` holds 12 plus `README.txt`, the extra being `Explore`. A README that states "11 agents" from the canonical path is describing `.skilled/agents/` only, and any agent table should name the directory it counted. Appended during output verification, after the state record was committed; the committed record therefore carries `findingsCount: 10` and `newInfoRatio: 0.88`, and including this finding the ratio is 0.87. [INFERENCE: name-by-name comparison of `ls -1 .claude/agents` and `ls -1 .skilled/agents`]

## Questions Answered

- **Q2** — Current inventory verified against files on disk. Closed by iteration 3 (skills, modes, hubs, commands, agents, runtime folders) plus this iteration (CLI executors, MCP and Code Mode, doctor commands, and the hub/standalone split).

## Questions Remaining

- **Q3** — every dedicated hook, plugin and extension per runtime, one README subsection each. The 27 hook cores are already named and verified against disk; what is missing is the per-runtime adapter mapping.
- **Q4** — claim audit of the current 1,773-line `README.md`.
- **Q5** — reader-first section order for a shorter README.

## Ruled Out

- **Re-reading the two release notes to satisfy the literal dispatch text.** Both are already read in full and their findings recorded in `iteration-002.md`; a second pass would produce a redundant iteration and no new citations. Blocked in strategy §9 before this iteration began.
- **Re-running `git diff --stat` for `v4.0.0.0..v4.0.1.0`.** Blocked by rename detection, and the bounded measurement plus its deleted-archive explanation already sit in the synthesis.

## Dead Ends

- Describing `modes` as an object keyed by numeric index. `jq keys` over an array returns `0,1,2,…`, which is indistinguishable from object keys in output; only `jq 'type'` separates the two. Do not carry the object description forward.

## Edge Cases

- Ambiguous input: the dispatch focus duplicated completed Q1 work. Selected interpretation — close Q2's unverified remainder, which iteration 3's Recommended Next Focus named and which is the first unchecked key question. Deferred alternative: literal re-execution, which the exhausted list blocks.
- Contradictory evidence: resolved. `research.md:103` and `iteration-003.md:38` describe `modes` as a numeric-keyed object; the disk says array. The total (42) is unaffected; the shape description is corrected here and in the synthesis.
- Missing dependencies: none.
- Partial success: none for this iteration's scope. Q2 is closed; Q3-Q5 remain untouched, which is the planned boundary rather than a shortfall.

## Sources Consulted

- `.skilled/skills/cli-external-orchestration/mode-registry.json:8`, `:15`, `:17`
- `.skilled/skills/mcp-tooling/mode-registry.json:8`, `:9`, `:15`, `:19`
- `.skilled/skills/mcp-code-mode/SKILL.md:3`, `:4`, `:12`, `:18`
- `.skilled/skills/sk-code/mode-registry.json:1`
- `.skilled/commands/doctor/` (17 command documents)
- `.skilled/commands/*/` per-group markdown counts
- `.skilled/skills/*/` directory listing (15 skills)
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/iterations/iteration-002.md` (closure-list verification)
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/iterations/iteration-003.md:38` (contradicted shape claim)
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:103` (contradicted shape claim)

## Assessment

- New information ratio: 0.88
- Findings: 10 (6 fully new — 1, 3, 4, 5, 6, 8; 4 partially new or synthetic — 2, 7, 9, 10), plus a contradiction resolution that adds the simplicity bonus
- Questions addressed: Q2
- Questions answered: Q2
- Questions remaining: Q3, Q4, Q5

## Reflection

- What worked and why: probing `.modes|type` across all seven registries in one call settled a shape question three iterations had carried, and reading the two registry files whole gave the mode, backend and command facts a README table needs without a second pass. The registries are dense — one read produced three of this iteration's findings.
- What did not work and why: the `&&` chain in the pre-write check aborted when `ls` returned exit 1 on the first absent target, so the gateway-existence check never ran in that call. A chained check on intentionally-missing files reports failure as if the check itself failed.
- What I would do differently: probe the type of a field before describing its shape, and never chain a verification step behind an `ls` that is expected to fail.

## Recommended Next Focus

Q3. The 27 hook cores are already verified against disk and the README's list of them is current, so Q3's remaining work is the per-runtime adapter mapping: which of `.claude/hooks`, `.codex/hooks`, `.opencode/plugins`, `.pi/extensions`, `.devin`, `.dsh/plugins`, `.vibe` and `.cursor` carries which core, and what each adapter does. The `.skilled/hooks/mcp-route-guard/` layout (separate `claude/`, `codex/`, `cursor/`, `devin/`, `dsh/`, `pi/` implementations over a shared `lib/`) is the template the rest of the inventory should follow. Q3 then feeds Q4 directly, because the hook section is one of the README's largest claims.
