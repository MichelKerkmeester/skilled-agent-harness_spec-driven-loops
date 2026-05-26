# Iteration 5: Q5 cross-surface and 4-runtime mirror consistency

## Focus

Audit runtime mirrors for operator-facing `/doctor`, install, and adjacent command-surface drift after CocoIndex deprecation and 116 deep-skill-evolution. The pass compared `.opencode` canonical doctor surfaces against `.claude`, `.codex`, and `.gemini`, with special attention to stale tool counts, database locations, advisor MCP ownership, and renamed `deep-*` skills.

## Actions Taken

Ran topology discovery across `.opencode/commands/doctor`, `.claude/commands/doctor`, `.gemini/commands/doctor`, and `.codex`; ran the requested stale-count/identity grep for `39 tools`, `64 tools`, `11 tools`, `cocoindex`, `mk_code_index`, `mk-spec-memory`, `35 tools`, `8 tools`, and `60 tools`; ran skill-name grep for `sk-deep-*`, `sk-ai-council`, `sk-research`, and `sk-review` across runtime mirrors; diffed `.opencode/commands/doctor` against `.claude/commands/doctor`; read exact line evidence in `_routes.yaml`, `speckit.md`, `update.md`, `mcp-doctor.sh`, `.codex/config.toml`, `.gemini/commands/deep/start-research-loop.toml`, and the canonical `.opencode/commands/deep/start-research-loop.md`.

## Findings

- Important | SHARED-STALE | `.opencode/commands/doctor/_routes.yaml:92`, `.claude/commands/doctor/_routes.yaml:92`, `.opencode/commands/doctor/update.md:219`, `.claude/commands/doctor/update.md:219` | The full `.opencode` and `.claude` doctor mirrors both still name `.opencode/skills/deep-loop-runtime/storage/deep-loop-graph.sqlite`; current truth is `.opencode/skills/deep-loop-runtime/database/deep-loop-graph.sqlite`, so this is mirror-parity staleness rather than one-runtime drift.
- Important | SHARED-STALE | `.opencode/commands/doctor/speckit.md:101`, `.claude/commands/doctor/speckit.md:101` | Both unresolved-target menus still show `6) Debug Code Graph                    (semantic search daemon)`, which preserves the deleted semantic-search-daemon concept in the live operator prompt.
- Important | SHARED-STALE | `.opencode/commands/doctor/scripts/mcp-doctor.sh:61`, `.claude/commands/doctor/scripts/mcp-doctor.sh:61` | Both MCP doctor scripts still describe `mk_code_index` as `structural AST + 11 graph tools`; current truth is 8 mk_code_index tools.
- Important | SHARED-STALE | `.opencode/commands/doctor/update.md:4`, `.claude/commands/doctor/update.md:4` | Both `/doctor:update` frontmatter allow `mcp__mk_spec_memory__advisor_recommend`, `advisor_status`, `advisor_validate`, and `advisor_rebuild`; advisor ownership has moved to `mk_skill_advisor`, while the route manifest already uses `mcp__mk_skill_advisor__advisor_*` at `.opencode/commands/doctor/_routes.yaml:112`.
- Important | MIRROR-DRIFT | `.codex/config.toml:89`, `.opencode/commands/doctor/_routes.yaml:71`, `.claude/commands/doctor/_routes.yaml:71` | Codex runtime config says the code-graph database lives at `.opencode/.spec-kit/code-graph/database/code-graph.sqlite`, while the full `.opencode` and `.claude` doctor mirrors use the current `.opencode/skills/system-code-graph/database/code-graph.sqlite` path.
- Important | MIRROR-DRIFT | `.gemini/commands/deep/start-research-loop.toml:2`, `.opencode/commands/deep/start-research-loop.md:38`, `.opencode/commands/deep/start-research-loop.md:328` | Gemini's deep-research command mirror still points to `.opencode/skills/sk-deep-research/...` and says the full protocol is `.opencode/skills/sk-deep-research/SKILL.md`; the canonical OpenCode command uses `.opencode/skills/deep-research/...` and `.opencode/skills/deep-research/SKILL.md`.
- Info | CORRECT/IN-SYNC | `.codex/config.toml:68`, `.codex/config.toml:90`, `.opencode/commands/doctor/_routes.yaml:112`, `.claude/commands/doctor/_routes.yaml:112` | Codex's MCP config carries current tool-count identity for `mk-spec-memory` as `Registers 35 tools` and `mk_code_index` as `Registers 8 tools`, and both full doctor route manifests put advisor tools under `mcp__mk_skill_advisor__advisor_recommend`.

## Ruled Out

- CORRECT/IN-SYNC | The full `/doctor` tree is expected only in `.opencode` and `.claude`; discovery found `.gemini/commands/doctor/{mcp,speckit,update}.toml` as thin wrappers and no `.codex/commands/doctor` directory, so Codex does not have a doctor command mirror to compare.
- CORRECT/IN-SYNC | `.opencode/commands/doctor` and `.claude/commands/doctor` had no `diff -qr` output, so every doctor drift observed in those two trees is shared-stale mirror parity, not `.claude`-only divergence.
- CORRECT/IN-SYNC | The scoped grep found no `39 tools` or `64 tools` claims in `.opencode/commands/doctor`, `.claude/commands/doctor`, `.gemini/commands/doctor`, or `.codex`; the live stale count in this pass is the shared `11 graph tools` claim in `mcp-doctor.sh`.
- CORRECT/IN-SYNC | The requested doctor/install scoped skill-name grep found no `sk-deep-*`, `sk-ai-council`, `sk-research`, or `sk-review` hits under `.claude`, `.codex`, or `.gemini` doctor/install surfaces; the stale `sk-deep-research` hit is in the Gemini deep command mirror, not in `/doctor`.

## Questions Answered

Q5 is substantially answered. The actual mirror topology is: `.opencode` has the canonical full `/doctor` tree; `.claude` has a full byte-for-byte mirror of that tree; `.gemini` has only thin `/doctor` TOML wrappers for `mcp`, `speckit`, and `update`; `.codex` has runtime agents/config but no `/doctor` command mirror. Shared stale items exist in `.opencode` and `.claude`; Codex has a separate code-graph DB path drift in config; Gemini has a separate stale `sk-deep-research` command mirror.

## Questions Remaining

This pass did not audit every non-doctor deep command asset in `.gemini` or every generated runtime config outside the requested surfaces. The remaining uncertainty is whether the thin Gemini doctor wrappers are generated from `.opencode` command text elsewhere or intentionally minimal.

## Next Focus

Q6 should synthesize fix targets by owner surface: full doctor tree parity fixes for `.opencode` and `.claude`, runtime-config correction for `.codex`, and deep-command mirror regeneration for `.gemini`.
