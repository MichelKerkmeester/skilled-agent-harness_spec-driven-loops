# Resource Map: system-code-graph / mk_code_index Touchpoints by Consumer

**Lineage:** glm | **Generated:** 2026-07-27T20:55:00.000Z

## MCP Registrations (3 physical files)
- opencode.json:69 — mk_code_index block
- .claude/mcp.json:58 — mk_code_index block (canonical for .mcp.json + .cursor/mcp.json symlinks)
- .codex/config.toml:31 — [mcp_servers.mk_code_index]

## Launchers & CLI (4 files)
- .opencode/bin/mk-code-index-launcher.cjs (1944 lines) — REMOVE
- .opencode/bin/code-index.cjs (119 lines) — REMOVE
- .opencode/bin/lib/launcher-ipc-bridge.cjs (555 lines) — STRIP mk-code-index branch (SHARED with mk-spec-memory)
- .opencode/bin/lib/launcher-session-proxy.cjs (33805 bytes) — STRIP code-graph replayability set (SHARED)

## Plugins (2 + 2 tests + 1 state dir)
- .opencode/plugins/mk-code-graph.js (514 lines) — REMOVE
- .opencode/plugins/mk-code-graph-freshness.js (241 lines) — REMOVE
- .opencode/plugins/tests/mk-code-graph.test.cjs — REMOVE
- .opencode/plugins/tests/mk-code-graph-freshness.test.cjs — REMOVE
- .opencode/skills/.code-graph-freshness-state/ — REMOVE

## Spec-Kit Integration (10 files)
- .opencode/skills/system-spec-kit/mcp-server/lib/code-graph-boundary.ts (452 lines) — REMOVE after decoupling
- .opencode/skills/system-spec-kit/mcp-server/hooks/code-index-cli-fallback.ts (401 lines) — REMOVE
- .opencode/skills/system-spec-kit/mcp-server/context-server.ts — STRIP code-graph routing
- .opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts — STRIP code-graph descriptions
- .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts — STRIP code-graph import
- .opencode/skills/system-spec-kit/mcp-server/hooks/memory-surface.ts — STRIP code-graph import
- .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs — STRIP code-graph ref
- .opencode/skills/system-spec-kit/mcp-server/lib/enrichment/passive-enrichment.ts — STRIP code-graph import
- .opencode/skills/system-spec-kit/mcp-server/scripts/finalize-dist.mjs:22 — STRIP system-code-graph
- .opencode/skills/system-spec-kit/shared/code-graph-contracts.ts (228 lines) — TRIM or REMOVE

## Spec-Kit Other
- .opencode/skills/system-spec-kit/mcp-server/lib/runtime-detection.ts:5 — STRIP ref
- .opencode/skills/system-spec-kit/SKILL.md:441,449 — STRIP doctrine
- .opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md:42-43,71,79 — STRIP routing

## Skill-Advisor (6 files)
- .opencode/skills/system-skill-advisor/mcp-server/scripts/skill-graph.json — REMOVE node
- .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/fusion.ts:530 — STRIP bonus
- .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/explicit.ts — STRIP weights
- .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/lexical.ts:29 — STRIP synonyms
- .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py — STRIP parity entries

## mk-spec-memory Cross-Coupling (1 file)
- .opencode/bin/mk-spec-memory-launcher.cjs:102,346,1150 — STRIP code-graph DB path refs

## Agent Tool Grants (32 files: 8 agents × 4 trees)
- .claude/agents/{ai-council,context,debug,deep-alignment,deep-improvement,deep-research,deep-review,review}.md
- .codex/agents/{ai-council,context,debug,deep-alignment,deep-improvement,deep-research,deep-review,review}.toml
- .pi/agents/{ai-council,context,debug,deep-alignment,deep-improvement,deep-research,deep-review,review}.md
- .opencode/agents/{ai-council,context,debug,deep-alignment,deep-improvement,deep-research,deep-review,review}.md

## Command Tool Grants (11 files)
- .opencode/commands/deep/research.md:4
- .opencode/commands/deep/review.md:4
- .opencode/commands/doctor/update.md:4
- .opencode/commands/doctor/speckit.md:4,45
- .opencode/commands/memory/search.md:4
- .opencode/commands/speckit/implement.md:4
- .opencode/commands/speckit/plan.md:4
- .opencode/commands/speckit/complete.md:4
- .opencode/commands/create/agent.md:4
- .opencode/commands/create/skill.md:4
- .opencode/commands/create/changelog.md:4

## Hooks (3 freshness + 1 post-commit + 2 reapers)
- .claude/settings.json:165 — freshness hook
- .codex/hooks.json:101 — freshness hook
- .devin/hooks.v1.json:109 — freshness hook
- .opencode/scripts/git-hooks/post-commit — strip code-graph invalidation
- .opencode/scripts/git-hooks/tests/post-commit-code-graph-invalidation.sh (208 lines) — REMOVE
- .opencode/scripts/session-cleanup.sh:99,102 — strip code-graph patterns
- .opencode/scripts/orphan-mcp-sweeper.sh:209,213 — strip code-graph patterns

## /Doctor Surface (6 files)
- .opencode/commands/doctor/_routes.yaml:27-28,83-105 — strip code-graph route
- .opencode/commands/doctor/assets/doctor-code-graph.yaml (278 lines) — REMOVE
- .opencode/commands/doctor/assets/doctor-mcp-debug.yaml — strip mk_code_index
- .opencode/commands/doctor/assets/doctor-mcp-install.yaml — strip mk_code_index
- .opencode/commands/doctor/assets/doctor-mcp-presentation.txt — strip mk_code_index
- .opencode/commands/doctor/scripts/mcp-doctor.sh — strip diagnose_mk_code_index()
- .opencode/commands/doctor/assets/doctor-update.yaml — strip system-code-graph

## CI (1 file)
- .github/workflows/isolation-check.yml — REMOVE or rewrite

## Docs (12+ files)
- README.md:590-657,886,1220,1401 — strip code-graph sections
- AGENTS.md:342,378 (= CLAUDE.md symlink) — strip routing rows
- .claude/CLAUDE.md:5 — strip SEARCH ROUTING
- .claude/SYNC.md:76 — strip detect_changes
- .opencode/install-guides/README.md:84,319,380,699-715 — strip §10.4
- .opencode/bin/README.md — strip launcher entries
- .opencode/skills/system-deep-loop/runtime/references/integration-points.md:82-90 — strip refs
- .opencode/skills/system-deep-loop/runtime/lib/deep-loop/README.md:40 — strip ref
- .opencode/commands/deep/research.md:17 — strip ownership note
- .opencode/commands/deep/review.md:144 — strip ownership note

## Skill Directory (DELETE LAST)
- .opencode/skills/system-code-graph/ — entire directory
- .opencode/skills/.code-graph-freshness-state/ — runtime state dir

## Archival (INVENTORY ONLY — DO NOT EDIT)
- .opencode/specs/system-code-graph/**
- .opencode/skills/system-code-graph/changelog/**
- .opencode/skills/system-deep-loop/deep-*/changelog/**
- .opencode/skills/*/benchmark/reports/**
- .worktrees/**
