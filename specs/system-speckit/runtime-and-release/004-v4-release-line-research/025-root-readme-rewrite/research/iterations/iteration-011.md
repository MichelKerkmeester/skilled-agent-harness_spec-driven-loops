# Iteration 11: MCP registration topology per runtime

## Focus

The dispatch's focus line is `[All tracked questions are resolved]`, so no key question is open. Iteration 10's Next Focus named exactly one area it had not measured: **MCP configuration per runtime** — `.claude/mcp.json`, `.cursor/mcp.json`, `.devin/mcp_config.json` and `.pi/mcp.json` exist, Codex and Vibe carry `config.toml`, and DSH and OpenCode showed no top-level MCP file at that time.

That is the lowest-coverage area still feeding the rewrite, because the current README makes three MCP claims a rewrite will have to either keep or correct: `README.md:1408` ("registers Code Mode in the seven project runtime configs"), `README.md:1465` ("`code_mode` is the only registered MCP server") and `README.md:1487` ("14 templates are registered"). This iteration measures the registration files themselves, the writer of each registration, and the manual registry those registrations point at. It does not re-derive Q1–Q5 and does not repeat the synthesis-state check a third time.

## Actions Taken

1. Read `deep-research-config.json`, `deep-research-strategy.md`, `findings-registry.json` and `iteration-010.md` to fix the iteration number, the exhausted-approach list and the one area iteration 10 left unmeasured.
2. Listed MCP-related entries at the repository root and in all eight runtime folders, resolving link forms.
3. Read all seven on-disk registrations in full: `.claude/mcp.json`, `.cursor/mcp.json`, `.devin/mcp_config.json`, `.pi/mcp.json`, `opencode.json`, `.codex/config.toml`, `.vibe/config.toml`.
4. Grepped `.dsh/` and `.vibe/` for every `mcp` reference to locate registrations that are not top-level config files.
5. Read `.dsh/patches/mcp-code-mode.patch.yml` in full and the `.dsh/SYNC.md` / `.dsh/README.md` rows that describe it.
6. Grepped `README.md` for every MCP and Code Mode claim, then read the Code Mode section (`README.md:1455-1509`) whole.
7. Grepped `.skilled/commands/doctor/mcp.md` for the runtime list, `dsh` and `vibe`.
8. Counted the templates in `.utcp_config.json` and listed every `${VAR}` reference with line numbers.
9. Checked git tracking for all nine config paths, and grepped the launcher for its Node-range refusal.

## Findings

### P1 — corrections the rewrite must carry

1. **`README.md:1408`'s "seven project runtime configs" is a file count, not a doctor-managed count.** `/doctor:mcp install` accepts `--runtime` from six names only — `opencode`, `claude`, `codex`, `cursor`, `pi`, `devin` — and the command doc contains no `dsh` or `vibe` reference at all. The seventh registration on disk is DSH's hand-authored opt-in patch. A rewrite that keeps "seven" without naming the writer sends a reader looking for a `--runtime dsh` flag that does not exist. The accurate sentence is "six runtimes by `/doctor:mcp install`, plus a hand-authored opt-in DSH patch". [SOURCE: .skilled/commands/doctor/mcp.md:61] [SOURCE: .dsh/patches/mcp-code-mode.patch.yml:1]

2. **Vibe is the only one of the eight runtimes with no Code Mode registration.** `.vibe/config.toml` returns zero `mcp` matches; it carries a provider, two model rows and `allowed_models` only. Vibe's only MCP-adjacent surface in this repository is the `mcp-route-guard` plugin. Whether Vibe supports MCP natively was **not established from repository evidence**, so the rewrite must not claim Vibe runs Code Mode — and must not claim it cannot, either. [SOURCE: .vibe/config.toml:1] [SOURCE: .vibe/plugins/repo-guards/mcp-route-guard.mjs:3]

3. **All seven registrations mount the same server through the same launcher and the same UTCP file, in four different config dialects.** Claude Code, Cursor and Devin use JSON `mcpServers`; Pi uses JSON `mcpServers` plus `transport` and `lifecycle`; OpenCode uses JSON `mcp` with `type: local`, an array `command` and `environment`; Codex uses TOML `[mcp_servers.code_mode]`; DSH uses a YAML insert patch. Every one of them launches `node .skilled/bin/mcp-code-mode-launcher.cjs` with `UTCP_CONFIG_FILE=.utcp_config.json`. That is the load-bearing fact for the rewrite's MCP section: one server, seven registrations, four spellings — and the root `.mcp.json` is a symlink to `.claude/mcp.json`, not an eighth registration. [SOURCE: .claude/mcp.json:2-9] [SOURCE: .cursor/mcp.json:2-6] [SOURCE: .devin/mcp_config.json:2-6] [SOURCE: .pi/mcp.json:2-7] [SOURCE: opencode.json:21-28] [SOURCE: .codex/config.toml:12-17]

4. **`.utcp_config.json` is tracked, ships 14 templates, and holds environment references rather than secrets.** `git ls-files` lists it, so a clone carries the manual registry. `manual_call_templates` holds exactly 14 entries — aside, chrome_devtools_1, chrome_devtools_2, chrome_devtools_live, clickup_official, figma, github, gitkraken, magnific, mobbin, notion, obsidian, refero, webflow — and every credential is a `${VAR}` reference: `FIGMA_API_KEY`, `GITHUB_PERSONAL_ACCESS_TOKEN`, `NOTION_TOKEN`, `OBSIDIAN_API_KEY`, `OBSIDIAN_BASE_URL`, `OBSIDIAN_VERIFY_SSL`, `WEBFLOW_TOKEN`. This confirms `README.md:1487`'s "14 templates" exactly and supports a rewrite sentence of the form "the registry ships with the clone; you supply five keys". [SOURCE: .utcp_config.json:113] [SOURCE: .utcp_config.json:132] [SOURCE: .utcp_config.json:205] [SOURCE: .utcp_config.json:263] [INFERENCE: template count and names read with `jq` over `.manual_call_templates`; tracking read from `git ls-files`]

5. **DSH's patch is the one registration whose checkout root is not the cwd, and its startup is bounded.** The patch resolves the root from its own `--patch` argument (falling back to a cwd walk), caps startup at 60 s, and `.dsh/SYNC.md` records that dsh strips ambient variables whose names hold `KEY`, `PASSWORD`, `SECRET` or `TOKEN`, and picks its Node 24 interpreter through `NVM_DIR` or `$HOME/.nvm`. The README's install section does not need this detail, but the runtime note for DSH should say MCP is opt-in and never part of a default dispatch. [SOURCE: .dsh/patches/mcp-code-mode.patch.yml:12-30] [SOURCE: .dsh/SYNC.md:55] [SOURCE: .dsh/README.md:121]

### P2 — confirmations and one simplification

6. **The two "only registered server" claims survive the measurement.** `code_mode` is the only entry in every one of the seven configs, and `opencode.json` carries no skill-advisor registration — only `mcp.code_mode` beside model, agent and permission settings. `README.md:1465` and `README.md:676` can both be kept as written. [SOURCE: opencode.json:21-28] [SOURCE: README.md:1465] [SOURCE: README.md:676]

7. **The Node sentence is a safe simplification but should name its intersection.** `README.md:164` says "You need Node.js 24". That is correct for Code Mode, whose launcher refuses any interpreter outside the server manifest's range, and `.codex/config.toml` records why the range is strict: the server bundles isolated-vm, which has no Node 25+ build and segfaults at isolate creation. A reader on 22.23.4 or 26.12.1 satisfies the nine package manifests but cannot start Code Mode; the rewrite should either keep "Node 24" with an inline Code Mode caveat or say "Node 24; 22.23.4+ and 26.12.1+ work for everything except Code Mode". [SOURCE: README.md:164] [SOURCE: .codex/config.toml:5-10] [SOURCE: .skilled/bin/mcp-code-mode-launcher.cjs:51-53]

## Ruled Out

- **Editing `research.md` to add a §5I for this iteration's MCP matrix.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-011.md` and `deltas/iter-011.jsonl`. Recorded under SCOPE VIOLATIONS; the material is ready to paste.
- **Re-running the synthesis-state check a third time.** Iteration 9 measured it and iteration 10 re-confirmed `research.md` unchanged at 172 lines. A third measurement would add no citation, only redundancy.
- **Reading the eight runtime READMEs in full for MCP statements.** The config files are the authoritative inventory; the READMEs' MCP lines were already reached by grep, and a full read would repeat iteration 7's shape.
- **Counting registrations as seven without checking the writer.** The count and the writer are different facts, and the README's sentence conflates them; the doctor doc's six-value `--runtime` list is what separates the two.

## Dead Ends

- None. Every action produced usable evidence.

## Edge Cases

- **Ambiguous input**: the focus line is `[All tracked questions are resolved]`. Selected the one area iteration 10 explicitly named as unmeasured (MCP configuration per runtime). No key question was re-derived.
- **Contradictory evidence**: `README.md:1408` says "seven project runtime configs" while `/doctor:mcp install` names six runtimes. Both are recorded; the resolution is that the count includes DSH's hand-authored patch, and the rewrite must distinguish the writer from the count. The contradiction is not smoothed over.
- **Missing dependency**: no Vibe document states whether Vibe supports MCP. Recorded as unestablished rather than as "no support" — the absence of a project registration is not evidence about the runtime's capability.
- **Partial success**: all seven registrations were read in full, but no runtime was executed, so "each runtime loads its file" rests on file shape and each runtime's own documentation, not on an observed session. `README.md:1465`'s "7 tools" was not re-counted; it is carried from the existing README and not from this iteration's evidence.

## Sources Consulted

- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-config.json`
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-strategy.md`
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/findings-registry.json`
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/iterations/iteration-010.md`
- `.claude/mcp.json`, `.mcp.json` (symlink target), `.cursor/mcp.json`, `.devin/mcp_config.json`, `.pi/mcp.json`, `opencode.json`, `.codex/config.toml`, `.vibe/config.toml`
- `.dsh/patches/mcp-code-mode.patch.yml`, `.dsh/SYNC.md:28`, `:55`, `.dsh/README.md:46`, `:121`
- `.utcp_config.json` (template count, names, `${VAR}` lines 113, 132, 205, 224-226, 263)
- `.skilled/commands/doctor/mcp.md:61`
- `.skilled/bin/mcp-code-mode-launcher.cjs:51-53`
- `README.md:164`, `:676`, `:1408`, `:1455-1509`

## Assessment

- New information ratio: 0.86
- Questions addressed: none tracked; the MCP registration topology is now measured
- Questions answered: none (Q1–Q5 were answered before this iteration)

## Reflection

- What worked and why: reading the seven registrations whole in one call. Each file is under 300 bytes, so a single `cat` loop produced the complete topology — server name, launcher path, env var and dialect — and the identical launcher line across seven files is what turns "MCP support" into one citable fact instead of seven. Pairing it with `git ls-files` on the same paths then separated the shipped registry from operator-local state in one line of output.
- What did not work and why: nothing failed, but the first discovery pass assumed a top-level MCP file would exist for every runtime. OpenCode keeps its registration in the root `opencode.json` and DSH keeps it in a patch under `.dsh/patches/`, so a "look for `mcp.json`" search would have reported two runtimes as unregistered. The `.dsh`/`.vibe` grep is what recovered them, and it also proved Vibe's absence rather than assuming it.
- What I would do differently: grep each runtime folder for `mcp` *before* listing config files, so the two non-file registrations surface in the first pass rather than after a null result.

## Questions Answered

None. All five strategy key questions were answered before this iteration.

## Questions Remaining

None tracked. One artifact-level gap remains and is not a research question: `research.md` still needs §5E (Q4, iteration 6), §5F (Q3, iteration 7), §5G (numeric claims, iteration 8), §5H (command spelling and mirror forms, iteration 10) and §5I (this iteration's MCP topology), plus a rewrite of §5's Q3/Q4 entries. All material is cited in the iteration files.

## Recommended Next Focus

No research focus remains. The recommended action is the workflow-owner synthesis write:

1. Append §5E from `iteration-006.md`, §5F from `iteration-007.md`, §5G from `iteration-008.md`, §5H from `iteration-010.md` and §5I from this iteration.
2. Rewrite `research.md` §5 so Q3 and Q4 carry answered status like Q1, Q2 and Q5.

If another iteration is dispatched anyway, the only candidate left is the install path: whether `INSTALL-SKILLED.md`'s MCP steps match what `/doctor:mcp install` actually does. Whether iteration 6's Q4 audit already covered that file was not re-checked this iteration.

## SCOPE VIOLATIONS

- **Would-be mutation: append §5I to `research.md` and rewrite its §5 Q3/Q4 entries.** `progressiveSynthesis` is `true` in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-011.md` and `deltas/iter-011.jsonl`. The edit was not executed. This is the fourth iteration to hit the same conflict (iterations 8, 9 and 10 recorded it first). The material is prepared above so the workflow owner can apply it without re-research.
