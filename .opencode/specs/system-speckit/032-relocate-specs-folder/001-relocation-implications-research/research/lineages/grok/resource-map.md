# Resource Map — Specs Relocation Implications (grok lineage)

Generated from converged research deltas for packet
`.opencode/specs/system-speckit/032-relocate-specs-folder/001-relocation-implications-research`.

## Scripts
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh` — SPECS_DIR hardcode + dual-root validator
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` — path-agnostic validator
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts` — parameterized base-path
- `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` — default root + identity-gated supported roots
- `.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh` — dual-root packet_pointer
- `.opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts` — dual prefix strip + auto-detect

## Shared / MCP
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs` — approved artifact roots
- `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts` — SPEC_ROOTS dual list
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs` — Gate 3 prompts
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts` — Gate D canonical root
- `.opencode/skills/system-spec-kit/mcp-server/startup-checks.ts` — path lock
- `.opencode/skills/system-spec-kit/mcp-server/lib/utils/index-scope.ts` — specs exclude glob
- `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts` — identity anchor
- `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts` — findSpecsRoot
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-alias.ts` — SQL alias patterns

## Config / Git
- `.gitignore` — `!.opencode/`, `!specs`
- `~/.gitignore_global` — `/specs`, `/.opencode/`
- Root `specs` symlink → `.opencode/specs`
- `.claude/SYNC.md` — documented specs symlink (absent on disk)
- `AGENTS.md` / `CLAUDE.md` — canonical path language

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| grok | deltas/iter-001.jsonl … deltas/iter-006.jsonl |
