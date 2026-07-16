---
title: Resource Map — sk-deep-* → deep-* Skill Rename
description: Path ledger covering every area that needs touching for the rename. Phase 001 produces the canonical exhaustive list; this map is the pre-discovery shape and risk assessment.
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/015-sk-deep-rename"
    last_updated_at: "2026-05-05T18:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Initial resource-map authored"
    next_safe_action: "Phase 001 discovery"
    blockers: []
    completion_pct: 0
---

# Resource Map — Packet 070 (sk-deep-* → deep-*)

This packet renames two skills and propagates the change across all consumers. This document is the architectural ledger of WHAT and WHERE; per-phase plans handle HOW.

---

## 1. RENAME TARGETS

| From | To | Notes |
|------|-----|-------|
| `.opencode/skills/sk-deep-review/` | `.opencode/skills/deep-review/` | Folder rename via `git mv` |
| `.opencode/skills/sk-deep-research/` | `.opencode/skills/deep-research/` | Folder rename via `git mv` |
| String `sk-deep-review` | `deep-review` | All non-historical occurrences |
| String `sk-deep-research` | `deep-research` | All non-historical occurrences |

**Pre-discovery counts** (from `grep -rl` across `.md`, `.json`, `.toml`, `.ts`, `.js`, `.py`, `.sh`, `.yaml`, `.yml`):
- `sk-deep-review`: 704 files
- `sk-deep-research`: 1029 files
- (significant overlap; total unique high hundreds to ~1000+)

Phase 001 produces the canonical exhaustive list with file paths.

---

## 2. AREA LEDGER (PHASE → AREA → REPRESENTATIVE PATHS)

### Phase 002 — Skill folder rename + advisor

| Area | Paths |
|------|-------|
| Skill folder roots | `.opencode/skills/sk-deep-review/`, `.opencode/skills/sk-deep-research/` |
| Skill graph | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` (keys: `signals.deep-review`, `signals.deep-research`, `families.*`, `adjacency.*`, `hub_skills`) |
| Compiled SQLite | `.opencode/skills/system-spec-kit/mcp_server/database/skill-graph.sqlite` (rebuilt via advisor_rebuild after JSON edits) |

### Phase 003 — `.opencode/` internals

| Sub-area | Representative paths | Estimated count |
|----------|----------------------|-----------------|
| Other skills' SKILL.md routing tables | `.opencode/skills/system-spec-kit/SKILL.md`, `.opencode/skills/sk-improve-prompt/SKILL.md`, `.opencode/skills/cli-*/SKILL.md` | ~15-20 |
| Other skills' references/* | `.opencode/skills/system-spec-kit/references/**/*.md` (especially routing/agent-related docs) | ~50-100 |
| Agent definitions | `.opencode/agents/deep-research.md`, `.opencode/agents/deep-review.md`, `.opencode/agents/orchestrate.md`, etc. | ~10-15 |
| Command files | `.opencode/commands/speckit/spec_kit_deep-review.md`, `.opencode/commands/speckit/spec_kit_deep-research.md`, plus their YAML asset files | ~10-15 |
| MCP server code | `.opencode/skills/system-spec-kit/mcp_server/**/*.ts`, `**/*.js` (deep-loop modules, executor configs, prompt packs) | ~30-60 |
| Scripts | `.opencode/skills/system-spec-kit/scripts/dist/**/*.js`, `scripts/*.ts`, `scripts/*.py` | ~20-40 |
| Test fixtures | `.opencode/skills/system-spec-kit/scripts/test-fixtures/**/*.{md,json}` | ~30-50 |
| Spec folders (active, NOT z_archive) | `.opencode/specs/**/spec.md`, `**/plan.md`, etc. (active packets that mention deep-* skills) | ~100-200 |
| graph-metadata.json files (active packets) | `.opencode/specs/**/graph-metadata.json` | ~100-200 |

### Phase 004 — Runtime mirrors

| Runtime | Representative paths | Estimated count |
|---------|----------------------|-----------------|
| `.claude/agents/` | `deep-research.md`, `deep-review.md`, `orchestrate.md`, `code.md` (and any with cross-references) | ~12 |
| `.codex/agents/` | `deep-research.toml`, `deep-review.toml`, `orchestrate.toml` | ~12 |
| `.gemini/agents/` | `deep-research.md`, `deep-review.md`, `orchestrate.md` (post-schema-migration from packet 069) | ~12 |
| Runtime READMEs | `.claude/agents/README.txt`, `.codex/agents/README.txt`, `.gemini/agents/README.txt` (if exist) | ~3-4 |

### Phase 005 — Root docs + configs

| Item | Path | Notes |
|------|------|-------|
| Repo README | `README.md` | Top-level skill list / quickstart references |
| AGENTS.md | `AGENTS.md`, `AGENTS_Barter.md` | Public framework docs (per memory: only canonical + Barter sibling exist) |
| CLAUDE.md | `CLAUDE.md` | Project-level instructions referencing skills |
| OpenCode config | `opencode.json` | MCP server registry, skill configurations |
| UTCP config | `.utcp_config.json` | External tool config (likely no refs but check) |
| Settings | `.claude/settings.json`, `.claude/settings.local.json` | Hook + permission configs |
| Telemetry/state | `.claude/CLAUDE.md` (global) | (memory rule: don't edit user globals — only repo files) |

### Phase 006 — Verification (no source mods)

| Verification | Tool | Expected |
|--------------|------|----------|
| Skill graph refresh | `mcp__spec_kit_memory__advisor_rebuild` | freshness: stale → live, gen bumped |
| Advisor probes | `python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "deep review the auth flow" --threshold 0.0` | top-1 = `deep-review` |
| Validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename --strict` | exit 0 |
| Final grep | `grep -rl "sk-deep-review\|sk-deep-research" .opencode .claude .codex .gemini *.md *.json` (excluding z_archive) | 0 hits in active scope |
| Opus review | `@review` agent (model=opus) cross-file consistency pass | PASS verdict |

---

## 3. EDGE CASES TO AUDIT IN PHASE 001

These are NON-OBVIOUS reference forms that simple text grep may miss:

1. **Filename embeds**: filenames containing `sk-deep-*` (e.g., `sk-deep-research_auto.yaml` → `deep-research_auto.yaml`). Need `find -name "*sk-deep-*"`.
2. **URL paths**: any docs linking to `.opencode/skills/sk-deep-research/` (relative or absolute) — the broken-link audit at end.
3. **Hardcoded skill IDs in MCP server code**: TypeScript constants like `'sk-deep-research'` used as keys for skill metadata lookups.
4. **Code-graph node IDs**: `.cocoindex_code/` SQLite databases may have indexed node names; require re-indexing post-rename.
5. **Agent dispatch markers**: `Dispatched by /speckit:deep-research` — the COMMAND uses `deep-research` (without `sk-` prefix already in some places; audit consistency).
6. **Command IDs**: `/speckit:deep-research:auto` — the user-facing command ID. Verify this is already the target naming (no change needed) or needs alignment.
7. **Skill graph JSON node names** vs **directory names** — must agree post-rename.
8. **Memory database**: `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` may have indexed entries with old skill names; rebuild post-rename.
9. **Prompt packs / template strings**: `.opencode/skills/sk-deep-research/assets/prompt_pack_iteration.md.tmpl` (FILENAME has it; CONTENT may have many self-references).
10. **Test snapshots**: Vitest/pytest snapshot files with skill names embedded as test inputs/outputs.

Phase 001 catalogues every edge case with concrete file paths.

---

## 4. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Folder rename breaks active references mid-implementation | Medium | High | Phase 002 completes BEFORE 003-005; folders renamed first |
| Advisor cache stale during multi-phase run | High | Medium | Rebuild advisor in Phase 002 + final rebuild in Phase 006 |
| Parallel cli-codex stepping on same files | Low | Medium | Phases 003/004/005 partition by directory; each cli-codex owns a subtree |
| Test fixtures embed old names as expected output | Medium | Low | Phase 001 inventory flags fixtures; Phase 003 updates them; Phase 006 runs full test suite |