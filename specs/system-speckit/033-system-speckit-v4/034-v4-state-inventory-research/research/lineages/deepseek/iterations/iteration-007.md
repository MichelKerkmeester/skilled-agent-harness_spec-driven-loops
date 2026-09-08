# Iteration 7: Angle 7 — THE OTHER HUBS

## Focus
Inventory the remaining hubs and standalone skills: sk-code (modes/surfaces), sk-design (modes, style corpus), sk-git (worktree grammar, hooks, allowlist), sk-prompt, mcp-tooling transports, mcp-code-mode, sk-communication, sk-vision; check draft claims about branch grammar, style library, GitKraken and prompt-models.

## INVENTORY

| Surface | Value | SOURCE |
|---|---|---|
| sk-code | 6 modes: quality, review, webflow, opencode, mobile-cli, obsidian (workflow + surface packets); ROUTER.md | sk-code/ ls |
| sk-design | 4 modes: fundamentals, md-generator, diagram, chart; commands /design:{chart,diagram,extract} | sk-design/ ls; commands/design/ |
| sk-design style corpus | styles/ = 135M, 6 entries (README, database, lib, library, scripts) — local style library + SQLite database dir present; library/ holds 3 entries | du + ls |
| sk-git | scripts/: worktree-naming.sh, migrate-legacy-branch-names.sh, remote-branch-allowlist.txt, hooks/{git-preflight-advisory.mjs, opencode/, pi/} | sk-git/scripts/ ls |
| Branch grammar (current) | `worktrees/NNN-slug` or `branches/NNN-slug` (NNN 1-999, slug kebab); releases `skilled/vX.Y.Z.W`; wrapper lane `work/...`; backup lane `backup/...`; `main`; "Owner-first and malformed names are rejected" | worktree-naming.sh:102-133 |
| GitKraken | ZERO references across .opencode/skills and .opencode/commands | rg -i gitkraken (0 hits) |
| sk-prompt | Standalone single leaf; ZERO references to prompt-models in the skill | rg prompt-models (0 hits) |
| mcp-code-mode | mcp-server/index.ts (TypeScript MCP server), dist/, package.json | mcp-code-mode/mcp-server/ ls |
| sk-communication | cli-communication-projection package: bin/, docs/, dist/, enablement.local.json.example | cli-communication-projection/ ls |
| sk-vision | vision-runtime: bun.lock, python/, src/, dist/, scripts/ (Moondream runtime) | vision-runtime/ ls |

## DRIFT

| Draft line | Claim | Verdict | Actual state | Severity | Correction | SOURCE |
|---|---|---|---|---|---|---|
| "New branches use the owner-first form `<skill>/{NNNN}-{slug}` or `skilled/{NNNN}-{slug}`" | Owner-first branch grammar | STALE | Current grammar is `worktrees/NNN-slug` / `branches/NNN-slug`; owner-first names are explicitly REJECTED by is_valid_branch; only `skilled/v*` release lanes kept | P1 | Grammar is worktrees/branches NNN-slug; owner-first is rejected | worktree-naming.sh:112-120 |
| "the number is allocated by a locked clone-wide counter" | Allocator counter | UNVERIFIED | worktree-naming.sh validators present; allocator not inspected this pass | P2 | Not contradicted | — |
| "the GitKraken MCP was wired in for those who use it" | GitKraken integration | FALSE | No gitkraken references anywhere in skills or commands | P1 | No GitKraken wiring found on branch | rg -i gitkraken (0 hits) |
| "sk-prompt-models is a mode now" / "The per-model prompt-craft knowledge is now a real hub with six conformed profiles" | prompt-models mode | FALSE | No prompt-models anywhere in sk-prompt; sk-prompt is standalone with a single leaf identity | P0 | No prompt-models mode on branch | rg prompt-models (0 hits); sk-prompt/ ls |
| "All 1,290 Refero styles ... about 129 MB across 7,744 files" | Refero corpus size | STALE (approx) | styles/ dir is 135M with database+library; exact 1,290/7,744 counts not re-verified (deep count deferred); corpus present | P2 | Corpus present ~135M; counts unverified | du styles/ |
| "the models skill went sk-prompt-small-model → sk-prompt-models" | Rename history | STALE | Rename may have happened historically but no sk-prompt-models artifact exists now | P1 | Same as prompt-models row | rg prompt-models (0 hits) |
| "sk-code ... workflow modes ... webflow and opencode surface packets" | sk-code 4-mode shape | STALE | 6 modes: quality, review, webflow, opencode, mobile-cli, obsidian (two surface packets added since draft) | P1 | Draft omits sk-code-mobile-cli and sk-code-obsidian | sk-code/ ls |
| "A library of real-world styles now lives on your own machine behind a fast database" | Local style DB | TRUE | styles/database + styles/library under sk-design-md-generator; SQLite/FTS machinery referenced in database dir | — | Confirmed | styles/ ls |
| "sk-communication ... drop a git-ignored enablement.local.json holding { enabled: true } at the package root" | Enablement file | TRUE | cli-communication-projection/enablement.local.json.example ships | — | Confirmed | cli-communication-projection/ ls |

## Sources Consulted
- sk-code/, sk-design/, sk-git/scripts/, sk-prompt/, mcp-code-mode/, sk-communication/, sk-vision/ (ls, sed, du, rg)

## Assessment
- **newInfoRatio**: 0.9 — branch grammar, GitKraken absence, prompt-models absence are novel negatives; corpus presence known from draft.
- **Confidence**: Confirmed for all rows; Refero counts and counter allocator unverified.

## Reflection
- Worked: single `rg -i gitkraken` and `rg prompt-models` settle two draft claims with zero hits.
- Failed: exact Refero file count not worth the calls; corpus presence suffices for the drift table.
- Ruled out: DESIGN.md theming deep-dive (find returned nothing at maxdepth 3; not a draft-critical claim).

## Recommended Next Focus
Angle 8: RUNTIME MIRRORS, HOOKS, CI AND GOALS — .claude/.codex/.cursor/.devin/.pi mirror mechanics, hook dispatch + count, git hooks installed, every .github/workflows job, goal system and resync rule.
