# Iteration 2: Retired-Surface References in Skill/Agent Contracts

## Focus

Find skills and agents whose `SKILL.md` or agent contract still describe
retired surfaces: memory MCP tools, old `scripts/` paths, `memory/` paths,
`@spec-kit/scripts`, `/memory:*` commands.

## Findings

### F2-1 (Verified clean -- no defect): the memory-MCP decommission has no live-doc remnants

A multi-pattern sweep across every live `SKILL.md`, agent contract (`.opencode/agents`,
`.claude/agents`, `.cursor/agents`, `.devin/agents`, `.pi/agents/*.md`,
`.codex/agents/*.toml`), and `references/**/*.md` (excluding `changelog/`,
`z_archive/`, `dist/`, test fixtures) found **zero** live hits for:

- `mcp__memory`, `memory_create_entities`/`search_nodes`/`open_nodes`/`read_graph`/`add_observations` (classic MCP-memory-server verbs)
- `/memory:save` / `/memory:load` / `/memory:search`
- `@spec-kit/scripts`
- `system-spec-kit/memory/` or `spec-kit/memory/` as a live path

[SOURCE: command output of `grep -rlE` over `.opencode/skills`, `.opencode/commands`, `.opencode/agents`, `.claude/agents` with changelog/dist/test-fixture paths excluded -- zero matches for every pattern above]

Cross-checked against packet 054's own three concrete decommission fixes,
all independently verified present/absent as claimed:

- `system-spec-kit/references/workflows/rollback-runbook.md` -- confirmed deleted (`find` returns nothing), and no remaining file in the live tree references `rollback-runbook` by name.
- `system-spec-kit/data/trigger-index.json` -- confirmed moved: no live reference to the old `spec-kit/data/trigger-index.json` path remains, and the new path exists at
  [SOURCE: file:.opencode/skills/system-spec-kit/runtime/data/trigger-index.json]
- `search-decisions.jsonl` -- confirmed fully removed, no file and no reference.

The canonical "what's retired and what replaced it" doc is itself current
(not itself stale): [SOURCE: file:.opencode/skills/system-spec-kit/references/memory/memory-system.md:3,17,193-209]
-- describes the memory-MCP retirement, names the trigger index / ripgrep lane /
continuity writer as the replacements, and has an explicit "CONSTITUTIONAL
RULES (RETIRED)" section (line 193) documenting the constitutional-rule-layer
removal as a loss with no wrapper/replacement, rather than glossing over it.

**Fix:** None required for this angle. Record as verified-clean so a future
audit does not re-spend iterations re-checking the same retired-MCP surface;
`memory-system.md` is the citable source of truth going forward.

### F2-2 (Ruled out as false positive): `.codex/agents` "parity gap"

Initial `find .codex/agents -iname '*.md'` returned 0 files while every other
runtime mirror (`.opencode`, `.claude`, `.cursor`, `.devin`, `.pi`) returned
12 -- looked like a Codex agent-roster regression. Re-inspection shows Codex
CLI agents are written as `.toml`, not `.md`
[SOURCE: file:.codex/agents/deep-research.toml, file:.codex/agents/orchestrate.toml, and 10 more -- 12 files total, one per `.opencode/agents/*.md` counterpart].
Full 12/12 parity across all 5 mirrored runtimes confirmed by filename-stem
comparison. Not a defect; ruled out.

### F2-3 (Informational): `embedder-pluggability.md` / embeddings are correctly a preserved, not retired, surface

`.opencode/skills/system-spec-kit/references/memory/embedder-pluggability.md`
and `runtime/tests/embedders/hf-local-client.vitest.ts` describe a live
embeddings component. Packet 054's own `spec.md` explicitly lists "the
preserved set (skill advisor, shared IPC and embeddings, model server) --
untouched" as Out of Scope
[SOURCE: file:.opencode/specs/system-speckit/054-decommission-debt-fixes/spec.md Out of Scope bullet 3],
confirming this file is not retired-surface debt.

## Sources Consulted

- `.opencode/skills/**/SKILL.md`, `.opencode/agents/*.md`, `.claude/agents/*.md`, `.codex/agents/*.toml`, `.cursor/agents/*.md`, `.devin/agents/*.md`, `.pi/agents/*.md` (grep sweep, multiple keyword sets)
- `.opencode/skills/system-spec-kit/references/memory/memory-system.md`
- `.opencode/skills/system-spec-kit/references/memory/embedder-pluggability.md`
- `.opencode/specs/system-speckit/054-decommission-debt-fixes/spec.md`
- `git log --oneline --all -- .codex/agents` (confirmed active recent commits touching this directory, ruling out abandonment)

## Assessment

- newInfoRatio: 0.55
- Novelty justification: Confirms an entire angle is clean (high-value negative knowledge, prevents future re-litigation) but produces zero actionable fixes, and one sub-check (F2-2) was a self-corrected false positive rather than new ground.
- Confidence: High -- multi-pattern grep sweep plus three independently spot-checked concrete fix claims from the packet's own spec.md.

## Reflection

- What worked: Cross-referencing the research angle against packet 054's own `spec.md` "Files to Change" table turned a generic keyword sweep into three falsifiable, spot-checkable claims (rollback-runbook, trigger-index move, search-decisions.jsonl).
- What failed: First read of `.codex/agents` file count looked like a real gap; would have been a false finding without the follow-up `ls -la` that revealed the `.toml` extension.
- Ruled out: `.codex/agents` file-count mismatch as a cross-runtime parity defect -- extension difference (`.toml` vs `.md`), not a missing-agent regression. [SOURCE: file:.codex/agents (directory listing, 12 .toml files)]

## Recommended Next Focus

Q3: hook registrations across `.claude`/`.codex`/`.cursor`/`.devin`/`.pi`/`opencode.json` versus the adapters in `runtime/dist/hooks`, and CI workflows versus the commands they invoke.
