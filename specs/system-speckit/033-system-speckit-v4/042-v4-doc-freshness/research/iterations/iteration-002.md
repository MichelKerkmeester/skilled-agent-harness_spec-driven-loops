# Iteration 002 - Q2: capability, family, mode and workflow claims vs the shipped tree

## Focus

Q2: which capability, family, mode or workflow claims in `CHANGELOG-v4.0.0.0.md` no longer match the shipped tree after the retirements, renames and moves. Named sub-targets: retired families, renamed commands, hub and mode counts, and the orca packet. Read-only audit; no fixes applied (research leaf contract).

## Actions Taken

1. Recovered state from `deep-research-strategy.md` (sections 2-13) and `findings-registry.json`; carried iter-1's four open sub-checks forward (two sat on the Q1/Q2 boundary).
2. Mapped the changelog claim surface: case-insensitive grep for headings plus numeric unit claims (90 matches over 600 lines), then full reads of L328-412 (Surfaces Retired, Design Surface) and L487-600 (Prompt Engineering, MCP Tooling, Agent Discipline, Plain-English Output, Upgrade Notes, Internal Seams).
3. Scanned the shipped tree: per-family `mode-registry.json` counts and mode names under `.skilled/skills/`, sk-doc and sk-design packet directories, command families under `.skilled/commands/`, the 033 packet index, and the `.skilled/bin` inventory.
4. Ran the required append gateway. The first append was refused with `stable-identity-missing` (exit 1) - the same packet-schema gap iter-1 recorded as `f-iter001-007`. Patched the record with the `runId`/`sessionId`/`lineageId` trio from iter-1's accepted record and retried; the gateway returned `ok:true` with a fencing receipt (ledger sequence 3) and refreshed the state log. Gateway exit `0`.
5. Wrote this narrative and `deltas/iter-002.jsonl`. No writes outside the run directory.

## Findings

### Stale claims (claim-by-claim verdicts)

- **mcp-tooling mode count - STALE (P1).** L41 and L511 say the hub ships "nine modes". The shipped registry registers ten: `mcp-chrome-devtools`, `mcp-click-up`, `mcp-aside-devtools`, `mcp-figma`, `mcp-refero`, `mcp-mobbin`, `mcp-obsidian`, `mcp-notion`, `mcp-magicpath`, `mcp-orca-cli`. The tenth is the orca packet: `.skilled/skills/mcp-tooling/mcp-orca-cli/` exists on disk and in the registry, and the changelog never names it - zero case-insensitive `orca` matches in the file. This is both the Q2 focus item and a Q4 input (post-draft work missing from the narrative).
- **deep-loop mode count - STALE (P2).** L592 says "The six modes behave as before". The shipped registry has five active modes (`research`, `review`, `ai-council`, `agent-improvement`, `model-benchmark`) and an empty `deprecatedModes` array; the same document's L581 retires the `deep-alignment` mode and the skill-benchmark lane. "Six" reads as a merge-time count that survived into the shipped narrative.

### Confirmed claims

- **Hub and standalone roster (P2).** "Six hubs now route to modes" (L21) holds: exactly six families carry a `mode-registry.json` - `sk-code`, `sk-doc`, `sk-design`, `mcp-tooling`, `cli-external-orchestration`, `system-deep-loop`. The seven standalones named at L55/L491 all exist (`sk-vision`, `sk-communication`, `sk-git`, `mcp-code-mode`, `system-spec-kit`, `system-skill-advisor`, `sk-prompt`); 6 + 7 = 13 matches `.skilled/skills`.
- **sk-design four modes (P2).** Registry: `sk-design-fundamentals`, `sk-design-md-generator`, `sk-design-diagram`, `sk-design-chart`. Chart/diagram are absent from sk-doc (registry and dirs); `/interface:*` is gone from the command tree; `/design:extract`, `/design:chart`, `/design:diagram` exist. L36/L379-388 hold.
- **Seven CLI executors (P2).** `cli-external-orchestration` registry carries the L211 roster exactly: `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`, `cli-hermes`. (`cli-devin` is the packet's known-stale exclusion; not re-litigated.)
- **sk-doc counts (P2).** 14 `sk-create-*` modes in the registry, 13 `sk-create-*` packet dirs (`sk-create-skill-parent` has no dir), and exactly 12 command files under `.skilled/commands/create/` - the L162 "fourteen modes across thirteen packets, twelve `/create:*` commands" claim holds.
- **Retirements (P2).** No `cli-gemini`, no `cli-copilot`, no `mcp-webflow` in any registry; `/interface:*` gone; no memory database under `system-spec-kit`; retired prompt skill names (`sk-prompt-small-model`, `sk-prompt-models`, `sk-prompt-improve`) absent from the tree. L340/L581/L501 hold.
- **Renames sampled (P2).** `doc-quality` to `create-quality-control` (registry), `create-*` dirs to `sk-create-*`, `cli-external` to `cli-external-orchestration`, `prose-mechanics.md` to `communication-prose.md` (REPO RULES index), Gate 3 letters C/D (root `AGENTS.md` shows A-D), `/prompt:improve` (`.skilled/commands/prompt/improve.md`). L579/L501 hold where sampled.

### Iter-1 residuals resolved

- **hvr-rules.md (was f-iter001-1).** The base standard lives at `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` with `hvr-publish-supplement.md` beside it; the packet is hub-nested under sk-doc, which is why iter-1's top-level spelling missed. L580 holds.
- **storage/ to database/ (was f-iter001-2).** `.skilled/skills/system-deep-loop/runtime/database/` exists. L580 holds at the runtime level.

### Residuals not verified this iteration

- L392's caveat that sk-design "does not yet resolve through a compiled router contract" - needs `.skilled/bin/compiled-route-status.cjs` or the compiled-route manifest run; deferred under the tool-call budget.
- L447 "Rust Joins the Code" - no Rust packet dir under sk-code; likely inside `sk-code-quality` stack guidance, not packet-level.
- `@create` to `@markdown` agent rename; `ai-council/` to `deep-ai-council/` packet move (the `deep-ai-council` dir exists; the rename itself was not sampled).

## Questions Answered

- **Q2: substantially answered.** Verdicts with tree evidence for the hub/standalone roster, per-hub mode counts, both stale counts, the retirements, and the sampled renames. Named residuals above stay open.

## Questions Remaining

- Q2 residuals: compiled-router closure status for sk-design; Rust placement; `@markdown`/`deep-ai-council` renames.
- Q1 residuals carried: L15 "deliberately tolerant gate" behavior; `.hermes` skills/agents mirror contents.
- Q3 (README vs post-migration tree), Q4 (post-draft work missing from the changelog - now includes the `mcp-orca-cli` mode), Q5 (rewrite vs targeted corrections).

## Next Focus

Q3: root `README.md` statements about entry points, structure, commands and setup versus the shipped tree, with the 041 source-root migration and the packet moves as the live risks. Carry the Q2 residuals above as secondary checks.
