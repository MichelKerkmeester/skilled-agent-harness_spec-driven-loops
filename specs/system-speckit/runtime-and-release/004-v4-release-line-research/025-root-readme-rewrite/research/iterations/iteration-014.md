# Iteration 14: FAQ Claim Audit — The Section Q4 Never Read

## Focus

All five key questions are ticked and the strategy next-focus line is the placeholder `[All tracked questions are resolved]`, so this iteration applied the lowest-coverage rule rather than inventing a question.

The lowest-coverage surface was measurable, not a judgement call. Q4's six read spans covered 1-260, 260-560, 560-780, 780-1020, 1150-1468 and 1468-1667. §16 FAQ runs 1687-1750, so the FAQ fell entirely inside the only unread region of the document (1667-1773): ten Q&As, 64 lines, zero prior audit coverage. Q5's shrink map keeps or trims the FAQ, so a rewrite that preserves it needs the same claim audit as the rest of the file.

Three answers are load-bearing for a reader deciding whether to trust the framework, and each has a mechanical oracle:

1. "The `code_mode` server registers seven tools" — countable in the server source.
2. "On Claude Code, session handover is on by default" — stated in the hook's own defaults table.
3. "No session data, code or context leaves the machine" — checkable against the shipped transports.

Deferred: per-runtime activation (`INSTALL-SKILLED.md` owns it, and reading it in full is a blocked approach from iteration 12) and the root `repo-rules/` mirror (measured in iteration 12; it is a documentation decision, not a measurement).

## Actions Taken

1. Read the run config, state projection, strategy, findings registry and the iteration 13 narrative to fix the iteration number, the exhausted approaches and the last recorded next focus.
2. Read `README.md:1667-1752` — the retrieval configuration block and all ten FAQ answers.
3. Grepped `.skilled/skills/mcp-code-mode/mcp-server/index.ts` for registration calls and listed every registered tool name.
4. Read the session-handover defaults row and the wrapper/auto-compaction behavior in `.skilled/hooks/session-handover/README.md` and `runtime-behavior.md`.
5. Checked the FAQ's answer paths: `/create:skill`, `.skilled/skills/README.txt`, the `graph-metadata.json` files and their readers, and the feature catalog.
6. Re-read the Gate 3 text and the §6 trivial-fix exemption in `AGENTS.md`.

## Findings

### Verified — four FAQ answers hold against the code

1. **The "seven tools" answer is exact, and the §13 table lists the same seven.** `.skilled/skills/mcp-code-mode/mcp-server/index.ts` makes exactly seven `registerTool` calls: `register_manual` (`:245`), `deregister_manual` (`:260`), `search_tools` (`:276`), `list_tools` (`:300`), `get_required_keys_for_tool` (`:315`), `tool_info` (`:332`) and `call_tool_chain` (`:352`). The FAQ's "seven tools, listed under Code Mode MCP" and the seven-row §13 table agree with the server source name for name, so the rewrite can keep the count and the table without re-deriving either. [SOURCE: .skilled/skills/mcp-code-mode/mcp-server/index.ts:245] [SOURCE: .skilled/skills/mcp-code-mode/mcp-server/index.ts:352] [SOURCE: README.md:1739] [SOURCE: README.md:1474]

2. **The handover-default answer is exact: Claude Code ships on, every other runtime ships off, and auto-compaction stays the fallback.** The hook's own defaults row states "ship on for Claude Code and off for every other runtime" and "While off, auto-compaction stays the fallback", which is precisely the FAQ's split between the wrapper's fresh session and the note-plus-compaction path. The wrapper detail is also supported: outside `skilled-loop`, `prepare` prints the manual claim command and exits 3, so the fresh-session hop is wrapper-owned rather than a bare-session behavior. [SOURCE: .skilled/hooks/session-handover/README.md:66] [SOURCE: .skilled/hooks/session-handover/README.md:195] [SOURCE: .skilled/hooks/session-handover/runtime-behavior.md:105] [SOURCE: README.md:1709]

3. **The `/create:skill` answer and the feature-catalog answer both resolve on disk, and discovery does read `graph-metadata.json`.** `/create:skill` exists at `.skilled/commands/create/skill.md`; `.skilled/skills/README.txt` exists and is 11,974 bytes; fifteen `graph-metadata.json` files sit under `.skilled/skills/*/` (the fourteen shipped skills plus the untracked `local-webflow` symlink); and the advisor reads them at `advisor-status.ts:347` and `skill-graph-db.ts:155`, so "discovery reads its SKILL.md frontmatter and `graph-metadata.json`" is a code-backed statement rather than a convention. The feature catalog resolves at `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` (50,469 bytes). [SOURCE: .skilled/commands/create/skill.md:1] [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:347] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:155] [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md:1] [SOURCE: README.md:1721] [SOURCE: README.md:1745]

4. **The Gate 3 answer matches the gate text, including the trivial-fix exemption.** The FAQ's three claims are each present in `AGENTS.md`: Gate 3 fires on a turn that writes a file; option D is an explicit skip after a warning; and the only exemption is "a trivial fix of a few characters in one file" at `AGENTS.md:246`, which is the §6 exemption class the gate names. "Skipped sessions are undocumented and will not be recoverable" follows from there being no packet to resume or search, which is the definition those commands operate on. [SOURCE: AGENTS.md:100] [SOURCE: AGENTS.md:246] [SOURCE: README.md:1695]

### P2 — one absolute sentence the rewrite should scope

5. **"No session data, code or context leaves the machine" is true of the continuity path and false as an unscoped guarantee.** The continuity path is local in every component the FAQ names: the trigger index is a committed JSON file, retrieval is ripgrep over the working tree, and the advisor's embedding backend defaults to `http://127.0.0.1:11434` with `OLLAMA_BASE_URL` as the only override. But the shipped library also contains `cli-classifier`, whose `cli-jev` mode is a **hosted** judgment transport, and `cli-external-orchestration`, which dispatches prompts to external CLIs by design. Neither is part of continuity, so the factual claim about continuity stands; the sentence is the problem. A rewrite should either scope it ("the continuity path keeps everything on the machine") or drop the absolute, because a reader will read it as a repository-wide privacy guarantee that the skill inventory does not support. [SOURCE: README.md:1727] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs:38] [SOURCE: .skilled/skills/cli-classifier/SKILL.md:3] [SOURCE: .skilled/skills/cli-classifier/SKILL.md:22]

### Reconfirmed, not new

6. **The FAQ's two other numeric claims were already settled and were not re-derived.** "14 skills" (FAQ Q1) is the shipped count settled in iteration 6 against the untracked `local-webflow` symlink, and "14 entries" in `.utcp_config.json` (FAQ Q9) was settled in iteration 11 against `manual_call_templates`. Both remain correct; this iteration only confirmed they sit in FAQ text that had not been read by Q4. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/iterations/iteration-006.md:42] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/iterations/iteration-011.md:31]

## Questions Answered

- None. All five key questions were ticked before this iteration; this pass closed the last unaudited README section rather than a tracked question.

## Questions Remaining

- None.

## Ruled Out

- **A broad Q4 re-audit.** Q4 is answered and blocked as a repeat in strategy §9 since iteration 10; this iteration read only the region Q4's spans never reached.
- **Re-counting the 14 templates and the 14 skills.** Settled in iterations 11 and 6; the FAQ only needed their line references confirmed.
- **Editing `research/research.md`.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-014.md` and `deltas/iter-014.jsonl`.
- **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12; the FAQ's install-adjacent answers do not depend on it.

## Dead Ends

- **Treating the FAQ as soft prose.** The first framing assumed FAQ answers are explanatory and hard to falsify; four of the ten turned out to have a mechanical oracle (a registration count, a defaults row, file existence, and gate text). The lesson is that a FAQ is a claim surface like any catalog section, not a commentary layer.

## Edge Cases

- Ambiguous input: none. The next-focus line is a placeholder, so the lowest-coverage rule applied; the chosen region is the one Q4 demonstrably never read.
- Contradictory evidence: none factual. Finding 5 records a scope overreach between an absolute privacy sentence and two shipped non-continuity transports; the continuity claim itself is supported.
- Missing dependencies: none. Every oracle the audit needed was present on disk.
- Partial success: none. Every action produced usable evidence.

## Sources Consulted

- `README.md:1474`, `:1667-1752` (retrieval configuration and all ten FAQ answers; Q lines at `:1689`, `:1695`, `:1701`, `:1709`, `:1715`, `:1721`, `:1727`, `:1733`, `:1739`, `:1745`)
- `.skilled/skills/mcp-code-mode/mcp-server/index.ts` (`registerTool` calls at `:245`, `:260`, `:276`, `:300`, `:315`, `:332`, `:352`)
- `.skilled/hooks/session-handover/README.md:66`, `:195`
- `.skilled/hooks/session-handover/runtime-behavior.md:105`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:347`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:155`
- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs:38`
- `.skilled/skills/cli-classifier/SKILL.md:3`, `:22`
- `.skilled/commands/create/skill.md`, `.skilled/skills/README.txt`, `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md`
- `AGENTS.md:100`, `AGENTS.md:246`
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/iterations/iteration-006.md:42`, `iteration-011.md:31` (settled counts)
- Commands: `rg -n '^```'`, `node -e` fenced-block inventory, `rg -n 'registerTool'`, `rg -n '^\*\*Q:'`, `ls`/`rg` path checks

## Assessment

- New information ratio: 0.75
- Questions addressed: none open; §16 FAQ was the last unaudited README section
- Questions answered: none (all five were already ticked)

## Reflection

- What worked and why: choosing the surface by coverage gap instead of by topic. Q4's span list made the gap a fact rather than a hunch — 1667-1773 was never read — and that turned a 64-line FAQ into four new, citable verifications in five calls. Pairing each answer with its exact oracle (the `registerTool` call list, the defaults row, the path existence check, the gate text) is what separates "the FAQ sounds right" from a finding the rewrite can rely on.
- What did not work and why: the first tool-registration grep looked for object-literal `name: 'search_tools'` shapes and returned nothing, because the server registers through `mcpTools.registerTool("name", ...)` calls. That is the same schema-guess failure as iteration 3's `workflowModes` probe and iteration 8's `rules` key, now on a registration API.
- What I would do differently: read the registration call shape from the file's own helper definition before grepping for the names it registers.

## Next Focus

None. §16 FAQ was the last section with zero audit coverage, and this iteration closes it: four answers verified, one sentence flagged for scoping, two counts already settled. The remaining items are decisions or a synthesis apply, not measurements — the root `repo-rules/` mirror (document or remove), the `sk-design` README gap, and the stale `research/research.md` that still lists Q3 and Q4 as open and lacks §5E-§5I. Recommend the workflow owner apply the synthesis and converge the loop rather than dispatch another measurement iteration.

## SCOPE VIOLATIONS

- `research/research.md` was not updated although `progressiveSynthesis` is true in config. This dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-014.md` and `deltas/iter-014.jsonl`, so the synthesis edit was not executed. The synthesis remains at 172 lines, lists Q3 and Q4 as open in its §5, and has no §5E-§5I. Findings 1-6 above are ready to paste.
